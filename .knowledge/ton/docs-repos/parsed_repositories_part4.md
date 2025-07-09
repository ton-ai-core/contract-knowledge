# GitHub Docs Parser - Part 4

                const value = await backendAuth.generatePayload();
                if (!value) {
                    tonConnectUI.setConnectRequestParameters(null);
                } else {
                    tonConnectUI.setConnectRequestParameters({state: 'ready', value});
                }
            }

            refreshPayload();
            setInterval(refreshPayload, payloadTTLMS);
            return;
        }

        const token = localStorage.getItem(localStorageKey);
        if (token) {
            setToken(token);
            return;
        }

        if (wallet.connectItems?.tonProof && !('error' in wallet.connectItems.tonProof)) {
            backendAuth.checkProof(wallet.connectItems.tonProof.proof, wallet.account).then(result => {
                if (result) {
                    setToken(result);
                    localStorage.setItem(localStorageKey, result);
                } else {
                    alert('Please try another wallet');
                    tonConnectUI.disconnect();
                }
            })
        } else {
            alert('Please try another wallet');
            tonConnectUI.disconnect();
        }

    }, [wallet, isConnectionRestored, setToken])
}
```
</details>



## Backend example

<details>
<summary>Check if proof valid with [ton-proof-service](https://github.com/ton-connect/demo-dapp-with-react-ui/blob/master/src/server/services/ton-proof-service.ts)</summary>

```tsx
public async checkProof(payload: CheckProofRequestDto, getWalletPublicKey: (address: string) => Promise<Buffer | null>): Promise<boolean> {
  try {
    const stateInit = loadStateInit(Cell.fromBase64(payload.proof.state_init).beginParse());
  
    // 1. First, try to obtain the public key via the get_public_key get-method on the smart contract deployed at Address.
    // 2. If the smart contract is not deployed yet, or the get-method is missing, you need:
    //  2.1. Parse TonAddressItemReply.walletStateInit and get public key from stateInit. You can compare the walletStateInit.code
    //  with the code of standard wallet contracts and parse the data according to the found wallet version.
    let publicKey = tryParsePublicKey(stateInit) ?? await getWalletPublicKey(payload.address);
    if (!publicKey) {
      return false;
    }
  
    // 2.2. Check that TonAddressItemReply.publicKey equals to obtained public key
    const wantedPublicKey = Buffer.from(payload.public_key, 'hex');
    if (!publicKey.equals(wantedPublicKey)) {
      return false;
    }
  
    // 2.3. Check that TonAddressItemReply.walletStateInit.hash() equals to TonAddressItemReply.address. .hash() means BoC hash.
    const wantedAddress = Address.parse(payload.address);
    const address = contractAddress(wantedAddress.workChain, stateInit);
    if (!address.equals(wantedAddress)) {
      return false;
    }
  
    if (!allowedDomains.includes(payload.proof.domain.value)) {
      return false;
    }
  
    const now = Math.floor(Date.now() / 1000);
    if (now - validAuthTime > payload.proof.timestamp) {
      return false;
    }
  
    const message = {
      workchain: address.workChain,
      address: address.hash,
      domain: {
        lengthBytes: payload.proof.domain.lengthBytes,
        value: payload.proof.domain.value,
      },
      signature: Buffer.from(payload.proof.signature, 'base64'),
      payload: payload.proof.payload,
      stateInit: payload.proof.state_init,
      timestamp: payload.proof.timestamp
    };
  
    const wc = Buffer.alloc(4);
    wc.writeUInt32BE(message.workchain, 0);
  
    const ts = Buffer.alloc(8);
    ts.writeBigUInt64LE(BigInt(message.timestamp), 0);
  
    const dl = Buffer.alloc(4);
    dl.writeUInt32LE(message.domain.lengthBytes, 0);
  
    // message = utf8_encode("ton-proof-item-v2/") ++
    //           Address ++
    //           AppDomain ++
    //           Timestamp ++
    //           Payload
    const msg = Buffer.concat([
      Buffer.from(tonProofPrefix),
      wc,
      message.address,
      dl,
      Buffer.from(message.domain.value),
      ts,
      Buffer.from(message.payload),
    ]);
  
    const msgHash = Buffer.from(await sha256(msg));
  
    // signature = Ed25519Sign(privkey, sha256(0xffff ++ utf8_encode("ton-connect") ++ sha256(message)))
    const fullMsg = Buffer.concat([
      Buffer.from([0xff, 0xff]),
      Buffer.from(tonConnectPrefix),
      msgHash,
    ]);
  
    const result = Buffer.from(await sha256(fullMsg));
  
    return sign.detached.verify(result, message.signature, publicKey);
  } catch (e) {
    return false;
  }
}

```
</details>

You can review our [example](https://github.com/ton-connect/demo-dapp-with-react-ui/tree/master/src/server) showcasing the key methods:
- [generatePayload](https://github.com/ton-connect/demo-dapp-with-react-ui/blob/master/src/server/api/generate-payload.ts): Generates a payload for `ton_proof`.
- [checkProof](https://github.com/ton-connect/demo-dapp-with-react-ui/blob/master/src/server/api/check-proof.ts): Checks the proof and returns an access token.

## Concept explanation

If `TonProofItem` is requested, the wallet proves ownership of the selected account’s key. The signed message is bound to:

- Unique prefix to separate messages from on-chain messages. (`ton-connect`)
- Wallet address
- App domain
- Signing timestamp
- App’s custom payload (where server may put its nonce, cookie id, expiration time)

```
message = utf8_encode("ton-proof-item-v2/") ++
          Address ++
          AppDomain ++
          Timestamp ++
          Payload

signature = Ed25519Sign(privkey, sha256(0xffff ++ utf8_encode("ton-connect") ++ sha256(message)))
```

where:

* `Address` is the wallet address encoded as a sequence:
 * `workchain`: 32-bit signed integer big endian;
 * `hash`: 256-bit unsigned integer big endian;
* `AppDomain` is Length ++ EncodedDomainName
- `Length` is 32-bit value of utf-8 encoded app domain name length in bytes
- `EncodedDomainName` id `Length`-byte  utf-8 encoded app domain name
* `Timestamp` 64-bit unix epoch time of the signing operation
* `Payload` is a variable-length binary string.

Note: payload is variable-length untrusted data. We put it last to avoid using unnecessary length prefixes.

The signature must be verified using the public key:

1. First, try to obtain the public key via the `get_public_key` get-method on the smart contract deployed at `Address`.

2. If the smart contract is not deployed yet, or the get-method is missing, then:

    1.  Parse `TonAddressItemReply.walletStateInit` and get public key from stateInit. You can compare the `walletStateInit.code` with the code of standard wallet contracts and parse the data according to the found wallet version.

    2.  Check that `TonAddressItemReply.publicKey` equals to obtained public key

    3.  Check that `TonAddressItemReply.walletStateInit.hash()` equals `TonAddressItemReply.address`. `.hash()` means BoC hash.


### Verification examples

* [Go demo app](https://github.com/ton-connect/demo-dapp-backend)
* [Rust demo app](https://github.com/liketurbo/demo-dapp-backend-rs)
* [JS demo app](https://github.com/liketurbo/demo-dapp-backend-js)
* [Python example](https://github.com/XaBbl4/pytonconnect/blob/main/examples/check_proof.py)
* [PHP example](https://github.com/vladimirfokingithub/Ton-Connect-Proof-Php-Check)
* [C# demo app](https://github.com/WinoGarcia/TonProof.NET)

## See also

* [Preparing messages](/v3/guidelines/ton-connect/guidelines/preparing-messages)
* [Sending messages](/v3/guidelines/ton-connect/guidelines/sending-messages)
* [[YouTube] Check ton_proof for @tonconnect/react-ui [RU]](https://youtu.be/wIMbkJHv0Fs?list=PLyDBPwv9EPsCJ226xS5_dKmXXxWx1CKz_&t=2971)

<Feedback />




================================================
FILE: docs/v3/guidelines/ton-connect/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/ton-connect/overview.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'

# About TON Connect

TON Connect is a powerful open-source toolkit that serves as a universal **application (apps)** authorization standard within the [TON](/v3/concepts/dive-into-ton/introduction) ecosystem, enabling users to securely and conveniently log into applications and services using their TON wallets instead of traditional logins and passwords.

<div style={{width: '100%', textAlign:'center', margin: '10pt auto'}}>
  <video style={{width: '100%',maxWidth: '600px', borderRadius: '10pt'}} muted={true} autoPlay={true} loop={true}>
    <source src="/files/TonConnect.mp4" type="video/mp4" />
    Your browser does not support video tags.
  </video>
</div>

Feel free to use one of the following flows for integration of your apps:

<Button href="/v3/guidelines/ton-connect/frameworks/react" colorType={'primary'} sizeType={'sm'}>
React Apps
</Button>
<Button href="/v3/guidelines/ton-connect/frameworks/web"
        colorType="secondary" sizeType={'sm'}>
HTML/JS Apps
</Button>
<Button href="https://github.com/ton-community/tma-usdt-payments-demo"
        colorType="secondary" sizeType={'sm'}>
TMA USDT Payments Demo
</Button>

## Overview

TON Connect enhances the TON ecosystem by allowing users to interact with various DApps using their wallets effortlessly. This protocol aims to provide a secure, user-friendly, and efficient connection method, fostering greater adoption of TON-based applications and services.

### Key features:

* **Seamless Integration**. TON Connect is designed to integrate smoothly with TON wallets and DApps. It allows users to connect their wallets to DApps with a few clicks, offering a frictionless experience.

* **Enhanced Security**. TON Connect employs secure communication methods to ensure that user data and transactions are always protected.

* **User-Friendly Experience**. With a focus on simplicity, TON Connect makes it easy for users to interact with DApps without needing extensive technical knowledge. The protocol's intuitive interface ensures a smooth user journey from connection to transaction completion.

* **Cross-Platform Compatibility**. TON Connect supports various platforms, including web, mobile, and desktop applications. This wide compatibility ensures that users can connect their wallets to DApps regardless of their preferred device.

* **Developer-Friendly Tools**. TON Connect provides developers with tools and APIs to integrate the protocol seamlessly into their DApps. These resources enable developers to offer a consistent and secure connection experience across different applications.

* **Open-Source Development**. TON Connect is led by the TonTech team and is an open-source project. Thus, this project is always open to great minds who want to participate and improve this.

## Use cases for your DApp

Explore these deliverables that the TON Ecosystem provides for superior DApp integration.

- **Traffic**. Drive additional user visits via crypto wallets that support TON Connect.
- **Authenticity**. Leverage TON users' wallets as ready-made accounts, removing the need for additional authentication steps and thus boosting user experience.
- **Payments**. Process transactions swiftly and securely through TON Blockchain using Toncoin or USD₮.
- **Retention**. Enhance user retention through the in-app list-saving feature, which allows users to keep track of recently opened and favorite apps.

## For wallet developers

If you are a wallet developer, you can connect your wallet to TON Connect and enable your users to interact with TON apps securely and conveniently; read how to [integrate TON Connect into your wallet](/v3/guidelines/ton-connect/wallet/).

## Success stories

- [GetGems — The Open Network Marketplace](https://getgems.io/)
- [STON.fi — AMM DEX for TON blockchain](https://ston.fi/)
- [TON Society](https://society.ton.org/activities/active)

<details>
  <summary><b>Show the entire list</b></summary>

  * [getgems.io](https://getgems.io/)
  * [fragment.com](https://fragment.com/) 
  * [ston.fi](https://ston.fi/)
  * [app.evaa.finance](https://app.evaa.finance/)
  * [ton.diamonds](https://ton.diamonds/)
  * [minter.ton.org](https://minter.ton.org/)
  * [tonconsole.com/jetton/minter](https://tonconsole.com/jetton/minter)
  * [dedust.io](https://dedust.io/swap)
  * [vesting.ton.org](https://vesting.ton.org/)
  * [tonverifier.live](https://verifier.ton.org/)
  * [tonstarter.com](https://tonstarter.com/)
  * [dns.ton.org](https://dns.ton.org/)
  * [daolama.co](https://daolama.co/)
  * [ton.vote](https://ton.vote/)

</details>


## Join TON Ecosystem
To connect your service with the TON Ecosystem, you need to implement the following:

- **TON Connect**. Incorporate the TON Connect protocol within your application.
- **Transactions**. Create specified transaction messages using TON libraries. Dive into the process of [sending messages](/v3/guidelines/ton-connect/guidelines/preparing-messages) with our comprehensive guide.
- **Payments**. Process payments via the public API ([tonapi](https://tonapi.io/)) or your own indexer, for instance, [gobycicle](http://github.com/gobicycle/bicycle). Learn more from our extensive guide on [asset processing](/v3/guidelines/DApps/asset-processing/payments-processing).

<Feedback />




================================================
FILE: docs/v3/guidelines/ton-connect/wallet.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/ton-connect/wallet.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'

# Connect a wallet

If you're a wallet developer, you can connect your wallet to TON Connect, allowing your users to interact with TON apps securely and conveniently.

## Integration

Follow these steps to connect your wallet to TON Connect:

1. Carefully read the [Protocol specifications](/v3/guidelines/ton-connect/overview/).
2. Implement the protocol using one of the [SDKs](/v3/guidelines/ton-connect/guidelines/developers).
3. Add your wallet to the [wallets-list](https://github.com/ton-blockchain/wallets-list) with a pull request.

<Feedback />




================================================
FILE: docs/v3/guidelines/web3/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/web3/overview.mdx
================================================
import Feedback from '@site/src/components/Feedback';


# Overview

## Key concepts

Learn more about the core ideas:

* [Payments on TON](https://blog.ton.org/ton-payments)
* [TON DNS & domains](/v3/guidelines/web3/ton-dns/dns)
* [TON Sites, TON WWW and TON Proxy](https://blog.ton.org/ton-sites)

## Use cases

- [*.ton user-friendly domains for any smart contract](/v3/guidelines/web3/ton-dns/dns)
- [Connect to the TON Sites using the TON Proxy](/v3/guidelines/web3/ton-proxy-sites/connect-with-ton-proxy)
- [Run your own TON Proxy to connect to TON Sites](/v3/guidelines/web3/ton-proxy-sites/running-your-own-ton-proxy)
- [Link your TON Wallet or TON Site to a domain](/v3/guidelines/web3/ton-proxy-sites/site-and-domain-management)
- [How to make a subdomain using TON DNS smart contracts](/v3/guidelines/web3/ton-proxy-sites/site-and-domain-management#how-to-set-up-subdomains)
<Feedback />




================================================
FILE: docs/v3/guidelines/web3/ton-dns/dns.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/web3/ton-dns/dns.md
================================================
import Feedback from '@site/src/components/Feedback';

# TON DNS & domains

TON DNS is a service that translates human-readable domain names like `test.ton` or `mysite.temp.ton` into TON smart contract addresses, ADNL addresses used by services on the TON Network such as TON Sites, and more. 

## Standard

The [TON DNS standard](https://github.com/ton-blockchain/TIPs/issues/81) outlines the domain name format, the domain resolution process, the interface for DNS smart contracts, and the structure of DNS records.

## SDK

Support for working with TON DNS is available through the JavaScript SDK [TonWeb](https://github.com/toncenter/tonweb) and [TonLib](https://ton.org/#/apis/?id=_2-ton-api).

```js
const address: Address = await tonweb.dns.getWalletAddress('test.ton');

// or 

const address: Address = await tonweb.dns.resolve('test.ton', TonWeb.dns.DNS_CATEGORY_WALLET);
```

Also, `lite-client` and `tonlib-cli` are supported by DNS queries.

## First-level domain

Only domains ending in `.ton` are currently recognized as valid TON DNS domains.

You can view the root DNS smart contract source code [here](https://github.com/ton-blockchain/dns-contract/blob/main/func/root-dns.fc).

This may change in the future. Adding a new top-level domain would require deploying a new root DNS smart contract and a community vote to update the [network config #4](https://ton.org/#/smart-contracts/governance?id=config).


## *.ton domains

`.ton` domains are implemented as NFTs. Because they follow the standard NFT format, they're compatible with most NFT marketplaces and wallets that support NFTs.

The source code for `.ton` domains is available [here](https://github.com/ton-blockchain/dns-contract).

The `.ton` domain resolver acts as an NFT collection, while each individual `.ton` domain functions as an NFT item.

Primary sales of `.ton` domains occur through a decentralized open auction at [dns.ton.org](https://dns.ton.org). The auction's source code can be found [here](https://github.com/ton-blockchain/dns).



## Subdomains
Domain owners can create subdomains by setting the smart contract address responsible for subdomain resolution in the DNS record using the key `sha256("dns_next_resolver")`.

This address can point to any smart contract implementing the TON DNS standard.
<Feedback />




================================================
FILE: docs/v3/guidelines/web3/ton-dns/subresolvers.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/web3/ton-dns/subresolvers.md
================================================
import Feedback from '@site/src/components/Feedback';

# TON DNS resolvers

## Introduction

TON DNS is a powerful tool for assigning TON Sites or Storage bags to domains and configuring subdomain resolution.

## Relevant links

1. [TON smart contract address system](/v3/documentation/smart-contracts/addresses)
1. [TEP-0081 - TON DNS standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0081-dns-standard.md)
1. [Source code of .ton DNS collection](https://tonscan.org/address/EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz#source)
1. [Source code of .t.me DNS collection](https://tonscan.org/address/EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi#source)
1. [Domain contracts searcher](https://tonscan.org/address/EQDkAbAZNb4uk-6pzTPDO2s0tXZweN-2R08T2Wy6Z3qzH_Zp#source)
1. [Simple subdomain manager code](https://github.com/Gusarich/simple-subdomain/blob/198485bbc9f7f6632165b7ab943902d4e125d81a/contracts/subdomain-manager.fc)

## Domain contracts searcher

Subdomains provide helpful functionality. For example, most blockchain explorers do not support looking up a domain contract by its name. This section explains how to create a contract that enables this functionality.


:::info
The example contract is deployed at [EQDkAbAZNb4uk-6pzTPDO2s0tXZweN-2R08T2Wy6Z3qzH_Zp](https://tonscan.org/address/EQDkAbAZNb4uk-6pzTPDO2s0tXZweN-2R08T2Wy6Z3qzH_Zp#source) and is associated with `resolve-contract.ton`. To test it, enter `<your-domain.ton>.resolve-contract.ton` in the address bar of your preferred TON explorer. This resolves to the corresponding TON DNS domain contract page. Subdomains and `.t.me` domains are supported. 

To view the resolver’s code, navigate to `resolve-contract.ton.resolve-contract.ton`. Note that this does not show the subresolver contract; it is a separate smart contract. Instead, it displays the domain contract itself.
:::

### dnsresolve() code

Some repetitive parts are omitted.

```func
(int, cell) dnsresolve(slice subdomain, int category) method_id {
  int subdomain_bits = slice_bits(subdomain);
  throw_unless(70, (subdomain_bits % 8) == 0);
  
  int starts_with_zero_byte = subdomain.preload_int(8) == 0;  ;; Assuming that 'subdomain' is not empty.
  if (starts_with_zero_byte) {
    subdomain~load_uint(8);
    if (subdomain.slice_bits() == 0) {   ;; Current contract has no DNS records by itself.
      return (8, null());
    }
  }
  
  ;; We are loading some subdomain.
  ;; Supported subdomains are "ton\\0", "me\\0t\\0" and "address\\0"
  
  slice subdomain_sfx = null();
  builder domain_nft_address = null();
  
  if (subdomain.starts_with("746F6E00"s)) {
    ;; we are resolving
    ;; "ton" \\0 <subdomain> \\0 [subdomain_sfx]
    subdomain~skip_bits(32);
    
    ;; reading domain name
    subdomain_sfx = subdomain;
    while (subdomain_sfx~load_uint(8)) { }
    
    subdomain~skip_last_bits(8 + slice_bits(subdomain_sfx));
    
    domain_nft_address = get_ton_dns_nft_address_by_index(slice_hash(subdomain));
  } elseif (subdomain.starts_with("6164647265737300"s)) {
    subdomain~skip_bits(64);
    
    domain_nft_address = subdomain~decode_base64_address_to(begin_cell());
    
    subdomain_sfx = subdomain;
    if (~ subdomain_sfx.slice_empty?()) {
      throw_unless(71, subdomain_sfx~load_uint(8) == 0);
    }
  } else {
    return (0, null());
  }
  
  if (slice_empty?(subdomain_sfx)) {
    ;; Example of domain being resolved:
    ;; [initial, not accessible in this contract] "ton\\0resolve-contract\\0ton\\0ratelance\\0"
    ;; [what is accessible by this contract]      "ton\\0ratelance\\0"
    ;; subdomain          "ratelance"
    ;; subdomain_sfx      ""
    
    ;; We want the resolved result to point to the 'ratelance.ton' contract, not its owner.
    ;; So we must answer that the resolution is complete + "wallet"H is the address of the 'ratelance.ton' contract
    
    ;; dns_smc_address#9fd3 smc_addr:MsgAddressInt flags:(## 8) { flags <= 1 } cap_list:flags . 0?SmcCapList = DNSRecord;
    ;; _ (HashmapE 256 ^DNSRecord) = DNS_RecordSet;
    
    cell wallet_record = begin_cell().store_uint(0x9fd3, 16).store_builder(domain_nft_address).store_uint(0, 8).end_cell();
    
    if (category == 0) {
      cell dns_dict = new_dict();
      dns_dict~udict_set_ref(256, "wallet"H, wallet_record);
      return (subdomain_bits, dns_dict);
    } elseif (category == "wallet"H) {
      return (subdomain_bits, wallet_record);
    } else {
      return (subdomain_bits, null());
    }
  } else {
    ;; subdomain          "resolve-contract"
    ;; subdomain_sfx      "ton\\0ratelance\\0"
    ;; we want to pass \\0 further, so that next resolver has opportunity to process only one byte
    
    ;; next resolver is contract of 'resolve-contract<.ton>'
    ;; dns_next_resolver#ba93 resolver:MsgAddressInt = DNSRecord;
    cell resolver_record = begin_cell().store_uint(0xba93, 16).store_builder(domain_nft_address).end_cell();
    return (subdomain_bits - slice_bits(subdomain_sfx) - 8, resolver_record);
  }
}
```

### dnsresolve() explanation
Here's a step-by-step breakdown of when a user resolves a domain like `stabletimer.ton.resolve-contract.ton`:

1. The user requests the domain: `"stabletimer.ton.resolve-contract.ton"`.
2. The application encodes it as a byte string: `"\0ton\0resolve-contract\0ton\0stabletimer\0"`.  Note: the leading null byte is optional.
3. The root DNS resolver forwards the request to the TON DNS collection, leaving: `"\0resolve-contract\0ton\0stabletimer\0"`.
4. The TON DNS collection delegates the request to the specified domain, leaving: `"\0ton\0stabletimer\0"`.
5. The `.ton` DNS domain contract passes the resolution to the subresolver specified by the editor. The subdomain is: `"ton\0stabletimer\0"`.

**At this point, the `dnsresolve()` is invoked.**

How `dnsresolve()` works:


1. It takes the subdomain and category as inputs. 
2. It is skipped if the subdomain begins with zero byte. 
3. It checks if the subdomain starts with `"ton\0"`. If it does:
   - The first 32 bits are skipped (`subdomain = "resolve-contract\0"`).  
   - A suffix variable `subdomain_sfx` is set to the `subdomain`. It reads bytes until the zero byte.
   - At this point: `subdomain = "resolve-contract\0", subdomain_sfx = "")`.
   - The zero byte and suffix are trimmed, resulting in `subdomain = "resolve-contract"`.
   - The domain name is converted into a contract address using helper functions `slice_hash` and `get_ton_dns_nft_address_by_index`. See [Appendix 1](subresolvers#appendix-1-code-of-resolve-contractton) for implementation details.
4. If the subdomain starts with `"address\0"`:
   - The prefix is skipped, and the rest is interpreted as a base64-encoded address.
5. If the subdomain doesn't match any known prefix:
   - The function returns `(0, null())`, indicating a failed resolution with no entries.
6. The function then checks if the `subdomain_sfx` is empty:
   - If **yes**, the request is considered fully resolved.
     - `dnsresolve()` generates a DNS record for the wallet subdomain using the previously retrieved TON DNS contract address.
     - If category 0, i.e., all DNS records, is requested, the result is wrapped in a dictionary and returned.
     - If the category is "wallet"H, the record is returned as-is.
     - The function returns a successful resolution for any other category with no matching record.
   - If **not**, the request is only partially resolved.
     - The function builds a resolver record pointing to the next contract associated with the domain.
     - The remaining subdomain `"\0ton\0stabletimer\0"` is forwarded to the contract, with the already processed bits corresponding to the initial part of the subdomain.


The `dnsresolve()` function can:
- Fully resolve a subdomain to a DNS record. 
- Partially resolve it, delegating to another resolver contract. 
- Return a "domain not found" result if the subdomain is unknown.

:::warning
Base64 address parsing is currently not functional. Suppose you attempt to resolve a domain like `<some-address>.address.resolve-contract.ton`, you will receive an error indicating that the domain is misconfigured or does not exist. This issue arises because domain names are case-insensitive—a behavior inherited from traditional DNS, which results in the lowercase. Consequently, the resolver may attempt to query a non-existent or invalid WorkChain address.
:::

### Binding the resolver

Now that the subresolver contract is deployed, the next step is to point the domain to it by updating domain `dns_next_resolver` record. This is done by sending a message with the following TL-B structure to the domain contract:
```
`change_dns_record#4eb1f0f9 query_id:uint64 record_key#19f02441ee588fdb26ee24b2568dd035c3c9206e11ab979be62e55558a1d17ff record:^[dns_next_resolver#ba93 resolver:MsgAddressInt]`
```

## Creating own subdomains manager
Subdomains can be helpful for everyday users. For example, they can associate multiple projects with a single domain or link to friends' wallet addresses.

### Contract data
The contract must store the owner's address and a dictionary structured as **domain → record hash → record value**.

```func
global slice owner;
global cell domains;

() load_data() impure {
  slice ds = get_data().begin_parse();
  owner = ds~load_msg_addr();
  domains = ds~load_dict();
}
() save_data() impure {
  set_data(begin_cell().store_slice(owner).store_dict(domains).end_cell());
}
```

### Processing records update

```func
const int op::update_record = 0x537a3491;
;; op::update_record#537a3491 domain_name:^Cell record_key:uint256
;;     value:(Maybe ^Cell) = InMsgBody;

() recv_internal(cell in_msg, slice in_msg_body) {
  if (in_msg_body.slice_empty?()) { return (); }   ;; Simple money transfer.

  slice in_msg_full = in_msg.begin_parse();
  if (in_msg_full~load_uint(4) & 1) { return (); } ;; Bounced message.

  slice sender = in_msg_full~load_msg_addr();
  load_data();
  throw_unless(501, equal_slices(sender, owner));
  
  int op = in_msg_body~load_uint(32);
  if (op == op::update_record) {
    slice domain = in_msg_body~load_ref().begin_parse();
    (cell records, _) = domains.udict_get_ref?(256, string_hash(domain));

    int key = in_msg_body~load_uint(256);
    throw_if(502, key == 0);  ;; Cannot update "all records" record.

    if (in_msg_body~load_uint(1) == 1) {
      cell value = in_msg_body~load_ref();
      records~udict_set_ref(256, key, value);
    } else {
      records~udict_delete?(256, key);
    }

    domains~udict_set_ref(256, string_hash(domain), records);
    save_data();
  }
}
```

We begin by verifying that the incoming message:
- Contains a valid request 
- Is not bounced 
- Comes from the owner 
- Specifies the `op::update_record` operation.

Next, we extract the domain name from the message. Domains cannot be stored directly in a dictionary since they may vary in length — and TVM non-prefix dictionaries require keys of fixed length. To solve this, we compute `string_hash(domain)`, which is the SHA-256 hash of the domain name. Domain names are guaranteed to contain an integer number of octets, so hashing them is safe and consistent.

Finally, we update the record associated with the specified domain and write the new data to the contract storage.

### Resolving domains

```func
(slice, slice) ~parse_sd(slice subdomain) {
  ;; "test\0qwerty\0" -> "test" "qwerty\0"
  slice subdomain_sfx = subdomain;
  while (subdomain_sfx~load_uint(8)) { }  ;; Searching zero byte.
  subdomain~skip_last_bits(slice_bits(subdomain_sfx));
  return (subdomain, subdomain_sfx);
}

(int, cell) dnsresolve(slice subdomain, int category) method_id {
  int subdomain_bits = slice_bits(subdomain);
  throw_unless(70, subdomain_bits % 8 == 0);
  if (subdomain.preload_uint(8) == 0) { subdomain~skip_bits(8); }
  
  slice subdomain_suffix = subdomain~parse_sd();  ;; "test\0" -> "test" ""
  int subdomain_suffix_bits = slice_bits(subdomain_suffix);

  load_data();
  (cell records, _) = domains.udict_get_ref?(256, string_hash(subdomain));

  if (subdomain_suffix_bits > 0) { ;; More than "<SUBDOMAIN>\0" requested.
    category = "dns_next_resolver"H;
  }

  int resolved = subdomain_bits - subdomain_suffix_bits;

  if (category == 0) { ;; All categories are requested.
    return (resolved, records);
  }

  (cell value, int found) = records.udict_get_ref?(256, category);
  return (resolved, value);
}
```

The `dnsresolve` function begins by verifying that the requested subdomain contains an integer number of octets. It skips an optional zero byte at the start of the subdomain slice, then splits the slice into the top-level domain and the remaining portion. For example, `test\0qwerty\0` is split into `test` and `qwerty\0`. Next, the function loads the record dictionary associated with the requested domain.

If a non-empty subdomain suffix remains, the function returns the number of bytes resolved along with the next resolver record, which is stored under the `"dns_next_resolver"H` key. Otherwise, it returns the total number of resolved bytes, i.e., the full slice length and the requested record.

While this function could be improved to handle errors more gracefully, such enhancements are not strictly required.

## Appendix 1: code of resolve-contract.ton

<details>
<summary>subresolver.fc</summary>

```func showLineNumbers
(builder, ()) ~store_slice(builder to, slice s) asm "STSLICER";
int starts_with(slice a, slice b) asm "SDPFXREV";

const slice ton_dns_minter = "EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz"a;
cell ton_dns_domain_code() asm """
  B{<TON DNS NFT code in HEX format>}
  B>boc
  PUSHREF
""";

const slice tme_minter = "EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi"a;
cell tme_domain_code() asm """
  B{<T.ME NFT code in HEX format>}
  B>boc
  PUSHREF
""";

cell calculate_ton_dns_nft_item_state_init(int item_index) inline {
  cell data = begin_cell().store_uint(item_index, 256).store_slice(ton_dns_minter).end_cell();
  return begin_cell().store_uint(0, 2).store_dict(ton_dns_domain_code()).store_dict(data).store_uint(0, 1).end_cell();
}

cell calculate_tme_nft_item_state_init(int item_index) inline {
  cell config = begin_cell().store_uint(item_index, 256).store_slice(tme_minter).end_cell();
  cell data = begin_cell().store_ref(config).store_maybe_ref(null()).end_cell();
  return begin_cell().store_uint(0, 2).store_dict(tme_domain_code()).store_dict(data).store_uint(0, 1).end_cell();
}

builder calculate_nft_item_address(int wc, cell state_init) inline {
  return begin_cell()
      .store_uint(4, 3)
      .store_int(wc, 8)
      .store_uint(cell_hash(state_init), 256);
}

builder get_ton_dns_nft_address_by_index(int index) inline {
  cell state_init = calculate_ton_dns_nft_item_state_init(index);
  return calculate_nft_item_address(0, state_init);
}

builder get_tme_nft_address_by_index(int index) inline {
  cell state_init = calculate_tme_nft_item_state_init(index);
  return calculate_nft_item_address(0, state_init);
}

(slice, builder) decode_base64_address_to(slice readable, builder target) inline {
  builder addr_with_flags = begin_cell();
  repeat(48) {
    int char = readable~load_uint(8);
    if (char >= "a"u) {
      addr_with_flags~store_uint(char - "a"u + 26, 6);
    } elseif ((char == "_"u) | (char == "/"u)) {
      addr_with_flags~store_uint(63, 6);
    } elseif (char >= "A"u) {
      addr_with_flags~store_uint(char - "A"u, 6);
    } elseif (char >= "0"u) {
      addr_with_flags~store_uint(char - "0"u + 52, 6);
    } else {
      addr_with_flags~store_uint(62, 6);
    }
  }
  
  slice addr_with_flags = addr_with_flags.end_cell().begin_parse();
  addr_with_flags~skip_bits(8);
  addr_with_flags~skip_last_bits(16);
  
  target~store_uint(4, 3);
  target~store_slice(addr_with_flags);
  return (readable, target);
}

slice decode_base64_address(slice readable) method_id {
  (slice _remaining, builder addr) = decode_base64_address_to(readable, begin_cell());
  return addr.end_cell().begin_parse();
}

(int, cell) dnsresolve(slice subdomain, int category) method_id {
  int subdomain_bits = slice_bits(subdomain);

  throw_unless(70, (subdomain_bits % 8) == 0);
  
  int starts_with_zero_byte = subdomain.preload_int(8) == 0;  ;; assuming that 'subdomain' is not empty
  if (starts_with_zero_byte) {
    subdomain~load_uint(8);
    if (subdomain.slice_bits() == 0) {   ;; current contract has no DNS records by itself
      return (8, null());
    }
  }
  
  ;; we are loading some subdomain
  ;; supported subdomains are "ton\\0", "me\\0t\\0" and "address\\0"
  
  slice subdomain_sfx = null();
  builder domain_nft_address = null();
  
  if (subdomain.starts_with("746F6E00"s)) {
    ;; we're resolving
    ;; "ton" \\0 <subdomain> \\0 [subdomain_sfx]
    subdomain~skip_bits(32);
    
    ;; reading domain name
    subdomain_sfx = subdomain;
    while (subdomain_sfx~load_uint(8)) { }
    
    subdomain~skip_last_bits(8 + slice_bits(subdomain_sfx));
    
    domain_nft_address = get_ton_dns_nft_address_by_index(slice_hash(subdomain));
  } elseif (subdomain.starts_with("6D65007400"s)) {
    ;; "t" \\0 "me" \\0 <subdomain> \\0 [subdomain_sfx]
    subdomain~skip_bits(40);
    
    ;; reading domain name
    subdomain_sfx = subdomain;
    while (subdomain_sfx~load_uint(8)) { }
    
    subdomain~skip_last_bits(8 + slice_bits(subdomain_sfx));
    
    domain_nft_address = get_tme_nft_address_by_index(string_hash(subdomain));
  } elseif (subdomain.starts_with("6164647265737300"s)) {
    subdomain~skip_bits(64);
    
    domain_nft_address = subdomain~decode_base64_address_to(begin_cell());
    
    subdomain_sfx = subdomain;
    if (~ subdomain_sfx.slice_empty?()) {
      throw_unless(71, subdomain_sfx~load_uint(8) == 0);
    }
  } else {
    return (0, null());
  }
  
  if (slice_empty?(subdomain_sfx)) {
    ;; example of domain being resolved:
    ;; [initial, not accessible in this contract] "ton\\0resolve-contract\\0ton\\0ratelance\\0"
    ;; [what is accessible by this contract]      "ton\\0ratelance\\0"
    ;; subdomain          "ratelance"
    ;; subdomain_sfx      ""
    
    ;; we want the resolve result to point at contract of 'ratelance.ton', not its owner
    ;; so we must answer that resolution is complete + "wallet"H is address of 'ratelance.ton' contract
    
    ;; dns_smc_address#9fd3 smc_addr:MsgAddressInt flags:(## 8) { flags <= 1 } cap_list:flags . 0?SmcCapList = DNSRecord;
    ;; _ (HashmapE 256 ^DNSRecord) = DNS_RecordSet;
    
    cell wallet_record = begin_cell().store_uint(0x9fd3, 16).store_builder(domain_nft_address).store_uint(0, 8).end_cell();
    
    if (category == 0) {
      cell dns_dict = new_dict();
      dns_dict~udict_set_ref(256, "wallet"H, wallet_record);
      return (subdomain_bits, dns_dict);
    } elseif (category == "wallet"H) {
      return (subdomain_bits, wallet_record);
    } else {
      return (subdomain_bits, null());
    }
  } else {
    ;; example of domain being resolved:
    ;; [initial, not accessible in this contract] "ton\\0resolve-contract\\0ton\\0resolve-contract\\0ton\\0ratelance\\0"
    ;; [what is accessible by this contract]      "ton\\0resolve-contract\\0ton\\0ratelance\\0"
    ;; subdomain          "resolve-contract"
    ;; subdomain_sfx      "ton\\0ratelance\\0"
    ;; and we want to pass \\0 further, so that next resolver has opportunity to process only one byte
    
    ;; next resolver is contract of 'resolve-contract<.ton>'
    ;; dns_next_resolver#ba93 resolver:MsgAddressInt = DNSRecord;
    cell resolver_record = begin_cell().store_uint(0xba93, 16).store_builder(domain_nft_address).end_cell();
    return (subdomain_bits - slice_bits(subdomain_sfx) - 8, resolver_record);
  }
}

() recv_internal() {
  return ();
}
```

</details>

<Feedback />




================================================
FILE: docs/v3/guidelines/web3/ton-proxy-sites/connect-with-ton-proxy.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/web3/ton-proxy-sites/connect-with-ton-proxy.md
================================================
import Feedback from '@site/src/components/Feedback';

# Connect with TON Proxy

TON Proxy is fully compatible with standard HTTP proxy settings so that you can configure it directly through your browser or operating system.

## Google Chrome

Follow the instructions specific to your device’s operating system: Windows, macOS, Linux, iOS, or Android.

## Firefox

1. Go to **Settings → General → Network Settings → Configure**. 
2. Choose a "Manual proxy settings". 
3. In the "HTTP Proxy" field, enter the address of a public entry proxy. 
4. In the "Port" field, enter "8080" without quotes.
5. Click "OK".


## Safari

Follow the instructions for Windows, macOS, Linux, iOS, or Android, depending on your operating system.

## iOS

1. Go to **Settings → Wi-Fi**. 
2. Tap your currently connected network. 
3. Scroll to "HTTP Proxy" and choose "Manual". 
4. In the "Server" field, enter the address of a public entry proxy. 
5. In the "Port" field, enter "8080" without quotes. 
6. Tap "Save".

## Android

1. Go to **Settings → Wi-Fi**.
2. Tap and hold the Wi-Fi network name. 
3. Select **Modify Network → Advanced Options → Manual**. 
4. In the "Server" field, enter the address of a public entry proxy. 
5. In the "Port" field, enter "8080" without quotes.
6. Tap "Save".

## Windows

1. Click the "Start" button and select **Settings → Network & Internet → Proxy**. 
2. Under "Manual proxy setup", next to "Use a proxy server", select "Set up". 
3. Turn on "Use a proxy server".
4. Enter the address of one of the public entry proxies, in the "Port" field, and enter "8080" without quotes.
5. Click "Save".

## macOS

1. Go to **Settings → Network → Advanced → Web proxy (HTTP)**. 
2. In the "Web proxy server" field, enter the address of one of the public entry proxies; after the colon, enter "8080" without quotes.
3. Click "OK".

## Ubuntu

1. Go to **Settings → Network**. 
2. Click **Network Proxy → Manual**. 
3. In the "HTTP Proxy" field, enter the address of one of the public entry proxies.
4. For the port, enter "8080" without quotes.

<Feedback />




================================================
FILE: docs/v3/guidelines/web3/ton-proxy-sites/how-to-open-any-ton-site.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/web3/ton-proxy-sites/how-to-open-any-ton-site.md
================================================
import Feedback from '@site/src/components/Feedback';

# How to open any TON Site?

This article explains the most common ways to access TON Sites from different devices.

Each method has its advantages and limitations. The list begins with the most straightforward options and progresses to more advanced configurations.

## Easy methods

### Browse through the ton.run or tonp.io

The simplest way to access a TON Site is through services like [ton.run](https://ton.run). No installation or setup is required — just open the **ton.run** or **tonp.io** and browse TON Sites.

This method is helpful for casual browsing or quick checks. However, it is not recommended for regular use due to several drawbacks:

- Your internet traffic is routed through a third-party service, e.g., ton.run. 
- The service may go offline or stop functioning at any time.
- Your internet service provider may block it.


### TON Wallet and MyTonWallet extensions


A more reliable and private method is to use a browser extension that connects directly to the TON Proxy without relying on third-party services.
Currently:
- [MyTonWallet](https://mytonwallet.io/) supports TON Proxy in its browser extension. 
- [TON Wallet](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd) will support it soon.

This method requires installing a browser extension and is suitable for regular use by most users.

## Advanced methods

### Using Tonutils-Proxy

This is the most secure way of accessing TON Sites.

1. Download the latest version [from here](https://github.com/xssnick/Tonutils-Proxy#download-precompiled-version)

2. Launch it and press "Start Gateway"
3. Done!


For the most secure and independent access to TON Sites, use Tonutils-Proxy.

**To get started:**
1. Download the latest release from [GitHub](https://github.com/xssnick/Tonutils-Proxy#download-precompiled-version). 
2. Launch the application and click “Start Gateway”.


## See also
* [Run C++ implementation](/v3/guidelines/web3/ton-proxy-sites/running-your-own-ton-proxy)

<Feedback />




================================================
FILE: docs/v3/guidelines/web3/ton-proxy-sites/how-to-run-ton-site.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/web3/ton-proxy-sites/how-to-run-ton-site.md
================================================
import Feedback from '@site/src/components/Feedback';

# How to run TON Sites

## Introduction

[TON Sites](https://blog.ton.org/ton-sites) work similarly to regular websites but require additional steps to start. This guide walks you through the setup process.

## Running TON Site
Install the [Tonutils reverse proxy](https://github.com/tonutils/reverse-proxy) to use TON Proxy for your website.

### Installation on any Linux

##### Download
```bash
wget https://github.com/tonutils/reverse-proxy/releases/latest/download/tonutils-reverse-proxy-linux-amd64
chmod +x tonutils-reverse-proxy-linux-amd64
```

##### Run

Run with domain configuration and follow the following steps:
```
./tonutils-reverse-proxy-linux-amd64 --domain your-domain.ton 
```
Scan the QR code shown in your terminal using Tonkeeper, Tonhub, or any other wallet. Confirm the transaction to link your domain to the site.

###### Run without domain
Alternatively, you can run the proxy in simple mode with an .adnl domain if you do not have a `.ton` or `.t.me` domain:

```
./tonutils-reverse-proxy-linux-amd64
```

##### Use
Your TON Site is now accessible via the ADNL address or the domain.

To change settings such as the proxy pass URL, edit the `config.json` file and restart the proxy. The default proxy pass URL is: `http://127.0.0.1:80/`.


The proxy also adds the following headers:
- `X-Adnl-Ip` – the client's IP address.
- `X-Adnl-Id` – the client's ADNL ID.

### Installation on any other OS

Build it from sources, and run it as in step 2 for linux. Go environment is required to build.

To install it on other systems, build the project from the source and run it as in step 2 for Linux. A `Go` environment is required.

```bash
git clone https://github.com/tonutils/reverse-proxy.git
cd reverse-proxy
make build
```

To build for other operating systems, run `make all`.


## Further steps

### Checking site availability 

After completing the setup, the TON Proxy should be running. If the setup is successful, your site will be available at the ADNL address generated during the configuration.

You can check availability by opening the address with the `.adnl` suffix. Ensure that a TON Proxy is active in your browser, such as via the [MyTonWallet](https://mytonwallet.io/) browser extension.

## References

 * [TON Sites, TON WWW and TON Proxy](https://blog.ton.org/ton-sites)
 * [Tonutils reverse proxy](https://github.com/tonutils/reverse-proxy)
 * Authors: [_Andrew Burnosov_](https://github.com/AndreyBurnosov) (TG: [@AndrewBurnosov](https://t.me/AndreyBurnosov)), [_Daniil Sedov_](https://gusarich.com) (TG: [@sedov](https://t.me/sedov)), [_George Imedashvili_](https://github.com/drforse)


## See also
* [Run C++ implementation](/v3/guidelines/web3/ton-proxy-sites/running-your-own-ton-proxy)

<Feedback />




================================================
FILE: docs/v3/guidelines/web3/ton-proxy-sites/running-your-own-ton-proxy.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/web3/ton-proxy-sites/running-your-own-ton-proxy.md
================================================
import Feedback from '@site/src/components/Feedback';

# Running your TON Proxy

This document briefly introduces TON Sites — websites accessed through the TON Network. TON Sites can serve as convenient entry points to other TON Services. For instance, HTML pages loaded from TON Sites may contain `ton://...` URIs, such as payment links. When clicked, these links can trigger actions like making a payment, provided the user has a TON Wallet installed on their device.

From a technical standpoint, TON Sites function similarly to standard websites. Still, they are accessed via the [TON Network](/v3/concepts/dive-into-ton/ton-blockchain/ton-networking) — an overlay network that operates within the Internet — rather than directly through the Internet itself. Instead of using standard IPv4 or IPv6 addresses, TON Sites are addressed via [ADNL](/v3/documentation/network/protocols/adnl/overview) addresses. They receive HTTP queries over the [RLDP](/v3/documentation/network/protocols/rldp) protocol, a high-level RPC protocol built on top of ADNL, the TON Network's primary protocol, instead of the usual TCP/IP.
Since encryption is handled at the ADNL level, there’s no need for HTTPS (TLS), mainly when the entry proxy is hosted locally on the user's device.

A gateway between the "ordinary" Internet and the TON Network is required to access existing sites or create new TON Sites. In practice, this involves:
- A HTTP → RLDP proxy running locally on the client's machine to access TON Sites. 
- A reverse RLDP → HTTP proxy running on a remote web server to serve your content through the TON Network.

[Read more about TON Sites, WWW, and Proxy](https://blog.ton.org/ton-sites)

## Running an entry proxy

To access existing TON Sites, you need to run an RLDP-HTTP proxy on your local machine.

1. Download the proxy.
    
   You can either:
   - Download the precompiled **rldp-http-proxy** from [TON auto builds](https://github.com/ton-blockchain/ton/releases/latest).
  
   or 
   - Compile it yourself by following these [instructions](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#rldp-http-proxy).

2. Download the [TON global config](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config).

    Run **rldp-http-proxy**.

   ```bash
   rldp-http-proxy/rldp-http-proxy -p 8080 -c 3333 -C global.config.json
   ```
    Here’s what the parameters mean:
    
  - `8080`: TCP port on localhost where the proxy listens for incoming HTTP requests.
  - `3333`: UDP port used for outbound and inbound RLDP and ADNL communication — connecting to TON Sites via the TON Network.
  - `global.config.json`: path to the global TON config file.

The proxy will continue running in your terminal if everything is set up correctly. You can now access TON Sites through: `http://localhost:8080`.

To stop the proxy, press `Ctrl+C` or close the terminal window.

## Running an entry proxy on a remote computer

1. Download the proxy.

You can either:
- Download **rldp-http-proxy** from [TON auto builds](https://github.com/ton-blockchain/ton/releases/latest).
  
  or
- Compile it yourself by following these [instructions](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#rldp-http-proxy).

2. Download the [TON global config](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config).

3. Download **generate-random-id** from [TON auto builds](https://github.com/ton-blockchain/ton/releases/latest).
   Or you can compile the **generate-random-id** yourself by following these [instructions](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#generate-random-id).

4. Generate a persistent ANDL address for your entry proxy.

   ```bash
   mkdir keyring
   utils/generate-random-id -m adnlid
   ```
    This outputs something like:
   ```
   45061C1D4EC44A937D0318589E13C73D151D1CEF5D3C0E53AFBCF56A6C2FE2BD vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
   ```

   This is your newly generated persistent ADNL address in hexadecimal and user-friendly form. The corresponding private key is saved into file `45061...2DB` in the current directory. Move the key into the keyring directory.

   ```bash
   mv 45061C1* keyring/
   ```

5. Run **rldp-http-proxy**.

   ```
   rldp-http-proxy/rldp-http-proxy -p 8080 -a <your_public_ip>:3333 -C global.config.json -A <your_adnl_address>
   ```

   where `<your_public_ip>` is your public IPv4 address and `<your_adnl_address>` is the ADNL address generated in the previous step.

   **Example**
   ```
   rldp-http-proxy/rldp-http-proxy -p 8080 -a 777.777.777.777:3333 -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
   ```

   - `8080`: TCP port to listen for incoming HTTP queries on localhost. 
   - `3333`: UDP port used for RLDP/ADNL activity — connecting to TON Sites via the TON Network. 
   - `global.config.json`: Path to the global TON configuration file. 

The proxy will stay running in the terminal if everything is configured correctly. You can now access TON Sites through: `http://<your_public_ip>:8080`.

To stop the proxy, press `Ctrl+C` or close the terminal window.

## Accessing TON Sites


Once your RLDP-HTTP proxy is up and running on `localhost:8080` for inbound TCP connections, as explained [above](#running-an-entry-proxy-on-a-remote-computer).

You can verify your setup with a simple test using `curl` or `wget`. For example,

```
curl -x 127.0.0.1:8080 http://just-for-test.ton
```

This command attempts to download the main page of the TON Site `just-for-test.ton` using the proxy at `127.0.0.1:8080`. If the proxy is running correctly, you'll see output similar to the following:

```html

<html>
<head>
<title>TON Site</title>
</head>
<body>
<h1>TON Proxy Works!</h1>
</body>
</html>

```

You can also use the ADNL address directly with a fake `.adnl` domain. For example:

```bash
curl -x 127.0.0.1:8080 http://utoljjye6y4ixazesjofidlkrhyiakiwrmes3m5hthlc6ie2h72gllt.adnl/
```
This fetches the same TON Web page.

Alternatively, you can configure your browser to use `localhost:8080` as an HTTP proxy. For example, in Firefox:

1. Go to **Settings → General → Network Settings → Settings → Configure Proxy Access → Manual Proxy configuration**.
2. Enter the following:
   - **HTTP Proxy:** 127.0.0.1
   - **Port:** 8080

Once the proxy is configured, you can visit TON Sites directly by entering their URLs in the browser's address bar. For example:
- `http://just-for-test.ton`
- `http://utoljjye6y4ixazesjofidlkrhyiakiwrmes3m5hthlc6ie2h72gllt.adnl/`

You can interact with these TON Sites just like regular websites. 

## Running TON Site

:::tip tutorial found!
Want to create your own TON Site? This is a [beginner-friendly guide](/v3/guidelines/web3/ton-proxy-sites/how-to-run-ton-site). 
:::


Most users only need to access existing TON Sites, not create new ones.
However, if you want to host your TON Site, you need to:
- Run the RLDP-HTTP proxy on your server.
- Use standard web server software such as Apache or Nginx.

We assume that you already know how to set up a regular website and that:
- You have a working web server running on `http://<your-server-ip>:80`. 
- You are accepting incoming HTTP connections on TCP port `80`. 
- You have defined a TON Network domain name (e.g., `example.ton`) as the main domain or an alias in your web server configuration.

1. Download the proxy.

You can either:
- Download **rldp-http-proxy** from [TON auto builds](https://github.com/ton-blockchain/ton/releases/latest).

  or
- Compile it yourself by following these [instructions](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#rldp-http-proxy).

2. Download the [TON global config](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config).

3. Download **generate-random-id** from [TON auto builds](https://github.com/ton-blockchain/ton/releases/latest).
   Or you can compile the **generate-random-id** yourself by following these [instructions](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#generate-random-id).

4. Generate a persistent ANDL address for your entry proxy.

   ```bash
   mkdir keyring

   utils/generate-random-id -m adnlid
   ```

   This outputs something like:

   ```bash
   45061C1D4EC44A937D0318589E13C73D151D1CEF5D3C0E53AFBCF56A6C2FE2BD vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
   ```
    This is your newly generated persistent ADNL address in hexadecimal and user-friendly form. The corresponding private key is saved into file `45061...2DB` in the current directory. Move the key into the keyring directory.

   ```bash
   mv 45061C1* keyring/
   ```
5. Ensure your web server accepts HTTP requests with `.ton` and `.adnl` domain names.

    **Example for Nginx:**
    
    If your config includes: `server_name example.com;`,
    
    Change it to: `server_name example.com example.ton vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3.adnl;` or `server_name _;`.


6. Run the proxy in reverse mode.

   ```bash
   rldp-http-proxy/rldp-http-proxy -a <your-server-ip>:3333 -L '*' -C global.config.json -A <your-adnl-address> -d -l <log-file>
   ```

   where:
   - `<your-server-ip>` is your public IPv4 address.
   - `<your-adnl-address>` is the ADNL address you generated earlier.

If you want your TON Site to run permanently, you need to use options `-d` and `-l <log-file>`.

**Example**
 ```bash
 rldp-http-proxy/rldp-http-proxy -a 777.777.777.777:3333 -L '*' -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3 -d -l tonsite.log
 ```

If everything is configured correctly, the RLDP-HTTP proxy will:
- Accept incoming HTTP queries from the TON Network via RLDP/ADNL. 
- Run on UDP port 3333 of your server’s IPv4 address `<your-server-ip>`. 
- Forward these HTTP queries to `127.0.0.1:80`, which is your local web server.

You can use a different UDP port. Just make sure to allow `rldp-http-proxy` to receive and send UDP packets through your firewall on that port.
If you want to forward queries only for specific hosts, replace `-L '*'` with `-L <your-hostname>`.


You can now access your site from a browser with a proxy set up as [described earlier](/v3/guidelines/web3/ton-proxy-sites/running-your-own-ton-proxy#accessing-ton-sites) using `http://<your-adnl-address>.adnl`.

**Example**

```
http://vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3.adnl
```
This lets you verify whether your TON Site is publicly accessible.


**Optional: register a TON DNS domain** 

If you’d like to make your TON Site accessible via a human-readable domain like `example.ton`, you can:
- [Register](/v3/guidelines/web3/ton-proxy-sites/site-and-domain-management) a TON DNS domain.
- Create a `site` record pointing to your server’s persistent ADNL address.

Once set up, RLDP-HTTP proxies running in client mode will resolve `http://example.ton` to your ADNL address and display your TON Site like a regular website.


**Optional: run a reverse proxy on a separate server**

You can also host your RLDP-HTTP proxy on a machine different from your web server. In this case, use the `-R` instead of `-L '*'`:

```
-R '*'@<YOUR_WEB_SERVER_HTTP_IP>:<YOUR_WEB_SERVER_HTTP_PORT>
```

**Example**
```bash
rldp-http-proxy/rldp-http-proxy -a 777.777.777.777:3333 -R '*'@333.333.333.333:80 -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3 -d -l tonsite.log
```

In this case, your regular web server must be accessible at `http://333.333.333.333:80`, although this IP address will remain hidden from external access.


### Recommendations
Since anonymity features will only be introduced in TON Proxy 2.0, if you'd prefer to keep your web server's IP address private, you have two options:
- Set up a reverse proxy on a different server using the `-R` flag. 
- Create a duplicate server containing a copy of your website and run the reverse proxy locally.

<Feedback />




================================================
FILE: docs/v3/guidelines/web3/ton-proxy-sites/site-and-domain-management.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/web3/ton-proxy-sites/site-and-domain-management.md
================================================
import Feedback from '@site/src/components/Feedback';

# Site & domain management

## How to open a domain for editing

1. Open Google Chrome on your computer. 
2. Install the [TON Chrome extension](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd). 
3. Open the extension, click "Import wallet", and import the wallet that holds the domain.

> **Recovery phrases**
>
> Your recovery phrase consists of 24 words written down when the wallet was created.
>
> You can restore this phrase using any TON wallet if you lose it. 
> In Tonkeeper: go to Settings → Wallet protection → Your private key.
> 
> Store your 24 words securely. In case of an emergency, you will be able to restore access to the wallet using only your recovery phrase.
> Please do not share them. Anyone with access to your phrase can access your funds.
> 

4. Go to [dns.ton.org](https://dns.ton.org), open your domain, and click "Edit".

## How to link a wallet to a domain

You can link a wallet address to a domain, allowing users to send coins directly to that domain name instead of a wallet address.
1. Open your domain for editing. See steps above. 
2. Paste your wallet address into the "Wallet address" field and click "Save". 
3. Confirm the transaction in the extension.


## How to link a TON Site to a domain

1. Open your domain for editing. See steps above. 
2. Copy the ADNL address of your TON Site in HEX format, paste it into the "Site" field, and click "Save". 
3. Confirm the transaction in the extension.

## How to set up subdomains

1. Create a smart contract on the network to manage the subdomains of your website or service. 
2. You can use one of the following ready-made smart contracts:
   - [manual-dns](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/dns-manual-code.fc)
   - [auto-dns](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/dns-auto-code.fc)
3. Open your domain for editing. See steps above.
4. Paste the smart contract address of the subdomain manager into the "Subdomains" field and click "Save".
5. Confirm the transaction in the extension.



<Feedback />




================================================
FILE: docs/v3/guidelines/web3/ton-proxy-sites/ton-sites-for-applications.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/web3/ton-proxy-sites/ton-sites-for-applications.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# TON Sites for applications

## How to support TON Site in your application?

You can launch TON Site in your application by directly integrating a local entry proxy into your product.
Libraries and example integrations are available for popular platforms:

* [Andriod](https://github.com/andreypfau/tonutils-proxy-android-example)
* [iOS](https://github.com/ton-blockchain/ton-proxy-swift)

:::caution
Public entry proxies are intended only for demonstration and testing purposes. Please do not use them in production.
:::

## See also

* [Connect with TON Proxy](/v3/guidelines/web3/ton-proxy-sites/connect-with-ton-proxy)
<Feedback />




================================================
FILE: docs/v3/guidelines/web3/ton-storage/storage-daemon.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/web3/ton-storage/storage-daemon.md
================================================
import Feedback from '@site/src/components/Feedback';

# Storage daemon

A **storage daemon** is a program used to download and share files in the TON network. The `storage-daemon-cli` console program manages a running storage daemon.

The current version of the storage daemon is available in the [Testnet](https://github.com/ton-blockchain/ton/tree/testnet) branch.

## Hardware requirements

* At least 1GHz dual-core CPU
* At least 2 GB RAM
* At least 2 GB SSD, excluding space for torrents
* 10 Mb/s network bandwidth with a static IP

## Binaries 

You can download `storage-daemon` and `storage-daemon-cli` for Linux, Windows, and macOS from [TON auto builds](https://github.com/ton-blockchain/ton/releases/latest).


## Compile from sources
You can compile `storage-daemon` and `storage-daemon-cli` from the source using this [instruction](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#storage-daemon).

## Key concepts

* **Bag of files** or **bag** – a collection of files distributed via TON Storage.
* TON Storage uses torrent-like technology, so terms like *Torrent*, *bag of files*, and *bag* are used interchangeably. However, there are some important differences:
  * Data is transferred over [ADNL](/v3/documentation/network/protocols/adnl/overview) using the [RLDP](/v3/documentation/network/protocols/rldp) protocol.
  * Each bag is distributed via its overlay network.
  * The Merkle structure can exist in two formats: one with large chunks for efficient downloading and one with smaller chunks for efficient proof of ownership.
  * The [TON DHT](/v3/documentation/network/protocols/dht/ton-dht) network is used to discover peers.

* A **bag of files** includes:
  * Torrent info. 
  * Data block - starts with a torrent header including file names and sizes, followed by the files themselves.


The data block is divided into chunks, with a default size of 128 KB. A merkle tree built from TVM cells is constructed on the SHA256 hashes of these chunks. This structure enables the creation and verification of *merkle proofs* for individual chunks and allows efficient reconstruction of the *bag* by exchanging only the proof of the changed chunk.


* **Torrent info** contains the merkle root of the following:
  * The chunk size (data block)
  * The list of chunk sizes 
  * Hash-based merkle tree 
  * Description, which is any text specified by the creator of the torrent

* Torrent info is serialized into a TVM cell. The hash of this cell is called the **bagID**, and it uniquely identifies the **bag**.
* The **bag meta** is a file that includes the *torrent info* and *header*. This file serves the same purpose as a `.torrent` file.




## Starting the storage daemon and storage-daemon-cli

### Starting storage-daemon:

**Example**

```storage-daemon -v 3 -C global.config.json -I <ip>:3333 -p 5555 -D storage-db```

* `-v` - verbosity level (INFO)
* `-C` - global network config ([download](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config))
* `-I` - IP address and port for ADNL
* `-p` - TCP port for the console interface
* `-D` - path to the storage daemon’s database

### Starting storage-daemon-cli 
It's started like this:

```
storage-daemon-cli -I 127.0.0.1:5555 -k storage-db/cli-keys/client -p storage-db/cli-keys/server.pub
```

* `-I` - IP address and port of the daemon (same as `-p` above)
* `-k` and `-p` - client private and server public keys (similar to `validator-engine-console`). These are auto-generated at first daemon startup and stored in `<db>/cli-keys/`.

### List of commands
You can view the list of `storage-daemon-cli` commands using the `help` command.


Commands include *positional parameters* and *flags*. 
* Parameters that contain spaces must be enclosed in quotes, using either single `'` or double `"` quotation marks. 
* Alternatively, spaces can be escaped. 
* Other common escape sequences are also supported.

**Example**
```
create filename\ with\ spaces.txt -d "Description\nSecond line of \"description\"\nBackslash: \\"
```

All parameters following the `--` flag are treated as positional parameters. This allows specifying filenames that begin with a dash:

```
create -d "Description" -- -filename.txt
```

You can run `storage-daemon-cli` in non-interactive mode by passing it commands to execute:

```
storage-daemon-cli ... -c "add-by-meta m" -c "list --hashes"
```

## Adding a bag of files

To download a **bag of files**, you need its hash `bagID` or a metafile. Use the following commands to add a *bag* for download:

```
add-by-hash <hash> -d directory
add-by-meta <meta-file> -d directory
```
The bag will be downloaded to the specified directory. It will be saved to the default storage daemon directory if not specified.

:::info
The hash must be provided in hexadecimal format with a length of 64 characters.
:::

When adding a bag via a metafile, information such as size, description, and file list becomes available immediately. When adding by hash, this information may take time to load.


## Managing added bags
* The `list` command shows all added bags. 
* The `list --hashes` command shows full hashes.

In the following commands, `<BagID>` can be either a bag's hexadecimal hash or its ordinal number in the current session, which is visible in the list output using `list` command. Note that ordinal numbers of bags are not persistent and are unavailable in non-interactive mode.

### Methods

* `get <BagID>` - shows full information about the Bag: description, size, download speed, and file list.
* `get-peers <BagID>` - lists connected peers.
* `download-pause <BagID>`, `download-resume <BagID>` - pauses or resumes download.
* `upload-pause <BagID>`, `upload-resume <BagID>` - pauses or resumes upload.
* `remove <BagID>` - removes the bag. 
* `remove --remove-files` also removes the bag and its files. Note that if the bag is saved in the internal storage daemon directory, the files will be deleted in any case.


## Partial download, priorities
:::info
When adding a bag, you can specify which files to download:
:::
```
add-by-hash <hash> -d dir --partial file1 file2 file3
add-by-meta <meta-file> -d dir --partial file1 file2 file3
```

### Priorities
Each file in a bag has a priority from 0 to 255. A priority of 0 means the file will not be downloaded. The `--partial` flag sets selected files to priority 1 and all others to 0.

To update priorities after adding a bag:

* `priority-all <BagID> <priority>` - sets priority for all files.
* `priority-idx <BagID> <idx> <priority>` - sets priority by file index (shown by the `get` command).
* `priority-name <BagID> <name> <priority>` - sets priority by file name.

You can set priorities even before the file list is fully available.


## Creating a bag of files
To create and start sharing a bag, use the `create` command:
```
create <path>
```
`<path>` can be a file or a directory. Add a description if needed:  

```
create <path> -d "Bag of Files description"
```

After creation, detailed information, including the hash `BagID`, is shown in the console, and the daemon begins sharing the torrent.
Additional options for the `create` command:

* `--no-upload` - daemon will not distribute files to peers. Upload can be started using the `upload-resume` command.
* `--copy` - files will be copied to the internal directory of the storage daemon.

To download the bag, other users need to know its hash. You can also save the torrent metafile:

```
get-meta <BagID> <meta-file>
```

<Feedback />




================================================
FILE: docs/v3/guidelines/web3/ton-storage/storage-faq.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/web3/ton-storage/storage-faq.md
================================================
import Feedback from '@site/src/components/Feedback';

# TON Storage FAQ

## How to assign a TON domain to a TON Storage bag 

1. [Upload your bag of files](/v3/guidelines/web3/ton-storage/storage-daemon#creating-a-bag-of-files) to the network and copy the bag ID. 
2. Open Google Chrome on your computer. 
3. Install a TON extension:
   - [TON Wallet](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd)
   - or [MyTonWallet](https://chrome.google.com/webstore/detail/mytonwallet/fldfpgipfncgndfolcbkdeeknbbbnhcc)
4. Open the extension, click "Import wallet", and import the wallet that owns the domain using your recovery phrase. 
5. Go to [dns.ton.org](https://dns.ton.org), open your domain, and click "Edit". 
6. Paste the bag ID into the "Storage" field and click "Save".

## How to host static TON site in TON Storage

1. [Create a bag](/v3/guidelines/web3/ton-storage/storage-daemon#creating-a-bag-of-files) from the folder containing your static website. 
2. The folder must contain an `index.html` file. 
3. Upload the bag to the network and copy the bag ID. 
4. Open Google Chrome and install a [TON extension](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd) or [MyTonWallet](https://chrome.google.com/webstore/detail/mytonwallet/fldfpgipfncgndfolcbkdeeknbbbnhcc).  
5. Import the wallet that owns the domain using your recovery phrase. 
6. Go to [dns.ton.org](https://dns.ton.org), open your domain, and click "Edit". 
7. Paste the bag ID into the "Site" field, select "Host in TON Storage", and click "Save".

## How to migrate TON NFT content to TON Storage

If you're using a [standard NFT contract](https://github.com/ton-blockchain/token-contract/blob/main/nft/nft-collection-editable.fc), update the content prefix by sending a [message](https://github.com/ton-blockchain/token-contract/blob/2d411595a4f25fba43997a2e140a203c140c728a/nft/nft-collection-editable.fc#L132) to your NFT collection smart contract from the collection owner's wallet.

- **Old URL prefix example:** `https://mysite/my_collection/`
- **New URL prefix format:** `tonstorage://my_bag_id/`.


## How to assign a TON domain to a TON Storage bag (low-level)

You need to assign the following value to the sha256("storage") DNS Record of your TON domain:
```
dns_storage_address#7473 bag_id:uint256 = DNSRecord;
```

## How to host static TON site in TON Storage (low-level)


To host a static site via TON Storage directly:
- [Create a bag](/v3/guidelines/web3/ton-storage/storage-daemon#creating-a-bag-of-files) from your website folder. The folder must include `index.html`. 
- Assign the following value to the DNS record with key sha256("site"):

```
dns_storage_address#7473 bag_id:uint256 = DNSRecord;
```


<Feedback />




================================================
FILE: docs/v3/guidelines/web3/ton-storage/storage-provider.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/web3/ton-storage/storage-provider.md
================================================
import Feedback from '@site/src/components/Feedback';


# Storage provider
A **storage provider** is a service that stores files for a fee.


## Binaries

Precompiled binaries of `storage-daemon` and `storage-daemon-cli` are available for Linux, Windows, and macOS at [TON auto builds](https://github.com/ton-blockchain/ton/releases/latest).

## Compile from sources
To build `storage-daemon` and `storage-daemon-cli` from the source, follow the [instruction](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#storage-daemon).

## Key concepts

A storage provider consists of:
- A smart contract that handles storage requests and manages client payments. 
- A daemon application that uploads and serves files to clients.

The process works as follows:

1. The owner of the provider launches the `storage-daemon`, deploying the main smart contract, and configuring the necessary parameters. The contract address is then shared with potential clients.

2. A client uses the `storage-daemon` to create **a bag** from their files and sends an internal message to the provider's smart contract. 
3. The smart contract creates a storage contract for **this bag**. 
4. The provider detects the request on-chain, downloads the bag, and activates the storage contract. 
5. The client transfers payment to the storage contract. The provider must regularly submit proof that the bag is still being stored to continue receiving payment. 
6. If the contract's funds are depleted, it becomes inactive, and the provider is no longer obligated to store the bag. The client can either refill the contract or retrieve their files.


:::info
Clients can retrieve their files anytime by providing proof of ownership to the storage contract. Once validated, the contract releases the files and deactivates itself.
:::

## Smart contract

View the [smart contract source code](https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont).

## Using a provider by clients
To use a storage provider, you need to first know the address of its smart contract. You can retrieve the provider's parameters using the following command in `storage-daemon-cli`:

```
get-provider-params <address>
```

### Provider parameters

* Whether new storage contracts are accepted.
* Minimum and maximum *Bag* size (in bytes).
* Rate - the cost of storage. Specified in nanoTON per megabyte per day.
* Max span - how often the provider should provide proofs of *Bag* storage.


The output includes the following parameters:
- Whether new storage contracts are currently accepted. 
- Minimum and maximum **bag** size (in bytes). 
- Rate – the cost of storage specified in nanoTON per megabyte per day. 
- Max span – the interval at which the provider must submit proof of **bag** storage.

### A request to store
To request storage, you need to create a **bag** and generate a message using the following command:

```
new-contract-message <BagID> <file> --query-id 0 --provider <address>
```

### Notes
- This command may take some time to execute for large **bags**. 
- The generated message body, not the full internal message, is saved to `<file>`.
- Query ID can be any integer from `0` to `2^64 - 1`. 
- The generated message includes the provider's current rate and max span parameters. These values are displayed after execution and should be reviewed before sending. 
- If the provider updates their parameters before the message is submitted, it will be rejected. This ensures that the storage contract is created under the client's agreed-upon conditions.

The client must then send the generated message body to the provider's smart contract address. If an error occurs, the message bounces back to the sender. If successful, a new storage contract is created, and the client receives a message from the contract with [`op=0xbf7bd0c1`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L3) and the same query ID.

At this stage, the contract is not yet active. Once the provider downloads the bag, the contract is activated, and the client receives another message from the same contract with  [`op=0xd4caedcd`](https://github.com/SpyCheese/ton/blob/tonstorage/storage/storage-daemon/smartcont/constants.fc#L4).


#### Client balance

The storage contract maintains a client balance, which consists of the funds transferred by the client that have not yet been paid to the provider. This balance gradually reduces over time based on the provider's rate (in nanoTON per megabyte per day).
- The initial balance is the amount sent when creating the storage contract with the request. 
- The client can top up the contract anytime by making transfers to the storage contract — this can be done from any wallet address. 
- The current balance can be retrieved using the [`get_storage_contract_data`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/storage-contract.fc#L222) getter method. It is returned as the second value: `balance`.


### Contract closure

:::info
If the storage contract is closed, the client receives a message with the remaining balance and [`op=0xb6236d63`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L6). 
:::

A storage contract may be closed under the following conditions:

* Immediately after creation, before activation, if the provider declines the request, e.g., due to capacity limits or configuration issues.
* When the client balance reaches 0.
* Voluntarily by the provider.
* Voluntarily by the client by sending a message with [`op=0x79f937ea`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L2) from the address with any query ID.


## Running and configuring a provider
The storage provider is a component of the `storage-daemon` and is managed using the `storage-daemon-cli`. To run the provider, launch `storage-daemon` with the `-P` flag.

### Create a main smart contract

To deploy the provider’s smart contract from `storage-daemon-cli`, run:
```
deploy-provider
```

:::info IMPORTANT!
During deployment, you’ll be prompted to send a non-bounceable message with 1 TON to the specified address to initialize the provider. You can verify successful deployment with the `get-provider-info` command.
:::

By default, the contract does not accept new storage contracts. Before activating it, you must configure the provider configuration, which is stored in  `storage-daemon`, and contract parameters stored on-chain.

### Configuration

The provider configuration includes:

* `max contracts` - maximum number of concurrent storage contracts.
* `max total size` - maximum total size of *bags* in storage contracts.

To view the current configuration:

```
get-provider-info
```

To update the configuration:
```
set-provider-config --max-contracts 100 --max-total-size 100000000000
```

### Contract parameters
* `accept` - whether to accept new storage contracts.
* `max file size`, `min file size` - size limits for one *bag*.
* `rate` - cost of storage specified in nanoTON per megabyte per day.
* `max span` - how often the provider will have to submit storage proofs.

To view the current parameters:
```
get-provider-info
```

To update the parameters:
```
set-provider-params --accept 1 --rate 1000000000 --max-span 86400 --min-file-size 1024 --max-file-size 1000000000
```

**Note:** in the `set-provider-params` command, you may update only a subset of parameters. Any omitted values will retain their current settings. Since blockchain data is not updated instantly, executing multiple `set-provider-params` commands quickly can lead to inconsistent results.

It is recommended that the provider’s smart contract be funded with more than 1 TON after deployment to cover future transaction fees. However, avoid transferring large amounts during the initial non-bounceable setup.



After setting the `accept` parameter to `1`, the smart contract will start accepting requests from clients and creating storage contracts, while the storage daemon will automatically process them: downloading and distributing *Bags*, generating storage proofs.


- The provider begins accepting client requests once the `accept` parameter is set to `1` and creates storage contracts. The storage daemon will automatically:
- Download and distribute **bags**. 
- Generate and submit storage proofs.


## Further work with the provider

### List of existing storage contracts

To list all active storage contracts and their balances:
```
get-provider-info --contracts --balances
```
Each contract displays:
- `Client$`: funds provided by the client.
- `Contract$`: total funds in the contract.

The difference between these values represents the provider’s earnings, which can be withdrawn using `withdraw <address>`.

To withdraw from all contracts with at least 1 TON available:
`withdraw-all`

To close a specific contract: 
`close-contract <address>`

Closing a contract automatically transfers available funds to the main provider contract. The exact process occurs automatically when the client’s balance is depleted. In both cases, the associated bag files will be deleted—unless other active contracts still use them.

### Transfer

You can transfer funds from the main smart contract to any address (the amount is specified in nanoTON):

```
send-coins <address> <amount>
send-coins <address> <amount> --message "Some message"
```

:::info
All *bags* stored by the provider are available with the command `list` and can be used as usual. To prevent disrupting the provider's operations, do not delete them or use this storage daemon to work with any other *bags*.
:::

<Feedback />




================================================
FILE: helm/app/Chart.yaml
URL: https://github.com/ton-community/ton-docs/blob/main/helm/app/Chart.yaml
================================================
apiVersion: v2
name: Node.js Chart
description: A Helm chart for deploying my Node.js application
version: 0.1.2



================================================
FILE: helm/app/templates/ghcr-secret.yaml
URL: https://github.com/ton-community/ton-docs/blob/main/helm/app/templates/ghcr-secret.yaml
================================================
kind: Secret
type: kubernetes.io/dockerconfigjson
apiVersion: v1
metadata:
  name: dockerconfigjson-github-com
  namespace: {{ .Release.Namespace }}
  labels:
    app: {{ .Values.appName }}-{{ .Values.deployEnv}}
data:
  .dockerconfigjson: {{ .Values.ghcrSecret }}


================================================
FILE: helm/app/templates/ingress.yaml
URL: https://github.com/ton-community/ton-docs/blob/main/helm/app/templates/ingress.yaml
================================================
{{ if .Values.publicService }}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ .Values.appName }}-{{ .Values.deployEnv}}
  namespace: {{ .Release.Namespace }}
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/ssl-redirect: "{{ .Values.sslRedirect }}"
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "10s"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "15s"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "15s"
    nginx.ingress.kubernetes.io/from-to-www-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-next-upstream: "error timeout http_502 http_503 http_504"
    nginx.ingress.kubernetes.io/proxy-next-upstream-tries: "3"
    cert-manager.io/cluster-issuer: {{ .Values.tlsIssuer }}
    {{- if eq .Values.deployEnv "canary" }}
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-by-cookie: {{ .Values.canaryCookie | quote }}
    nginx.ingress.kubernetes.io/canary-weight: {{ .Values.canaryWeight | quote }}
    {{- end }}
    nginx.ingress.kubernetes.io/server-snippet: |
      location ~ ^/(metrics|ready|health)$ {
        return 403;
      }

  labels:
    release: prometheus-stack
    app: {{ .Values.appName }}-{{ .Values.deployEnv}}
spec:
  tls:
    - hosts:
        - {{ .Values.host }}
      secretName: {{ .Values.host }}
  rules:
    - host: {{ .Values.host }}
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: {{ .Values.appName }}-{{ .Values.deployEnv }}
                port:
                  name: http
{{- end }}



================================================
FILE: helm/app/templates/ns-resource-quota.yaml
URL: https://github.com/ton-community/ton-docs/blob/main/helm/app/templates/ns-resource-quota.yaml
================================================
apiVersion: v1
kind: ResourceQuota
metadata:
  name: resource-quota
  namespace: {{ .Release.Namespace }}
spec:
  hard:
    {{- if eq .Values.deployEnv "staging" }}
    pods: "2"
    requests.memory: "256Mi"
    limits.cpu: "1"
    limits.memory: "16Gi"
    persistentvolumeclaims: "0"
    {{- end }}
    {{- if eq .Values.deployEnv "canary" }}
    pods: "10"
    limits.cpu: "4"
    limits.memory: "8Gi"
    persistentvolumeclaims: "0"
    {{- end }}
    {{- if eq .Values.deployEnv "production" }}
    pods: "100"
    limits.cpu: "8"
    limits.memory: "16Gi"
    persistentvolumeclaims: "0"
    {{- end }}



================================================
FILE: helm/app/templates/service-monitor.yaml
URL: https://github.com/ton-community/ton-docs/blob/main/helm/app/templates/service-monitor.yaml
================================================
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: {{ .Values.appName }}-{{ .Values.deployEnv}}
  namespace: {{ .Release.Namespace }}
  labels:
    release: prometheus-stack
spec:
  selector:
    matchLabels:
      app: {{ .Values.appName }}-{{ .Values.deployEnv}}
  endpoints:
    - port: http
      interval: 30s
      path: /metrics
    - port: https
      interval: 30s
      path: /metrics




================================================
FILE: helm/app/templates/service.yaml
URL: https://github.com/ton-community/ton-docs/blob/main/helm/app/templates/service.yaml
================================================
apiVersion: v1
kind: Service
metadata:
  name: {{ .Values.appName }}-{{ .Values.deployEnv}}
  namespace: {{ .Release.Namespace }}
  labels:
    app: {{ .Values.appName }}-{{ .Values.deployEnv }}
spec:
  type: ClusterIP
  selector:
    app: {{ .Values.appName }}-{{ .Values.deployEnv}}
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: {{ .Values.containerPort }}


================================================
FILE: helm/app/values-staging.yaml
URL: https://github.com/ton-community/ton-docs/blob/main/helm/app/values-staging.yaml
================================================
deployEnv: staging
replicaCount: 3
imageTag: "staging"

minReplicas: 1
maxReplicas: 1

memoryLimit: 120Mi
memoryRequest: 100Mi



================================================
FILE: helm/app/values.yaml
URL: https://github.com/ton-community/ton-docs/blob/main/helm/app/values.yaml
================================================
appVersion: "0.1"

cpuLimit: "500m"
memoryLimit: "128Mi"
cpuRequest: "500m"
memoryRequest: "64Mi"

minReplicas: 1
maxReplicas: 1

containerPort: 80
nodePort: 80


imageRepo: ""
imageTag: ""
host: ""
appName: ""
ghcrSecret: ""

tlsCert: ""
tlsKey: ""

canaryCookie: "canary"

tlsIssuer: "letsencrypt"
certIssuingMode: false

publicService: true
sslRedirect: false



================================================
FILE: i18n/ja/code.json
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ja/code.json
================================================
{
  "theme.ErrorPageContent.title": {
    "message": "ページがクラッシュしました。",
    "description": "The title of the fallback page when the page crashed"
  },
  "theme.NotFound.title": {
    "message": "ページが見つかりません",
    "description": "The title of the 404 page"
  },
  "theme.NotFound.p1": {
    "message": "お探しのページは見つかりませんでした。",
    "description": "The first paragraph of the 404 page"
  },
  "theme.NotFound.p2": {
    "message": "元のリンク提供元のサイトの管理者に連絡し、リンクが壊れていることを知らせてください。",
    "description": "The 2nd paragraph of the 404 page"
  },
  "theme.admonition.note": {
    "message": "メモ",
    "description": "The default label used for the Note admonition (:::note)"
  },
  "theme.admonition.tip": {
    "message": "ヒント",
    "description": "The default label used for the Tip admonition (:::tip)"
  },
  "theme.admonition.danger": {
    "message": "危険",
    "description": "The default label used for the Danger admonition (:::danger)"
  },
  "theme.admonition.info": {
    "message": "情報",
    "description": "The default label used for the Info admonition (:::info)"
  },
  "theme.admonition.caution": {
    "message": "警告",
    "description": "The default label used for the Caution admonition (:::caution)"
  },
  "theme.BackToTopButton.buttonAriaLabel": {
    "message": "トップに戻る",
    "description": "The ARIA label for the back to top button"
  },
  "theme.blog.archive.title": {
    "message": "過去のブログ記事",
    "description": "The page & hero title of the blog archive page"
  },
  "theme.blog.archive.description": {
    "message": "過去のブログ記事",
    "description": "The page & hero description of the blog archive page"
  },
  "theme.blog.paginator.navAriaLabel": {
    "message": "ブログ記事リストのページネーションナビゲーション",
    "description": "The ARIA label for the blog pagination"
  },
  "theme.blog.paginator.newerEntries": {
    "message": "新しい記事",
    "description": "The label used to navigate to the newer blog posts page (previous page)"
  },
  "theme.blog.paginator.olderEntries": {
    "message": "古い記事",
    "description": "The label used to navigate to the older blog posts page (next page)"
  },
  "theme.blog.post.paginator.navAriaLabel": {
    "message": "ブログ記事のページネーションナビゲーション",
    "description": "The ARIA label for the blog posts pagination"
  },
  "theme.blog.post.paginator.newerPost": {
    "message": "新しい投稿",
    "description": "The blog post button label to navigate to the newer/previous post"
  },
  "theme.blog.post.paginator.olderPost": {
    "message": "古い投稿",
    "description": "The blog post button label to navigate to the older/next post"
  },
  "theme.colorToggle.ariaLabel": {
    "message": "ライトモード/ダークモードを切り替え（現在は{mode}）",
    "description": "The ARIA label for the navbar color mode toggle"
  },
  "theme.colorToggle.ariaLabel.mode.dark": {
    "message": "ダークモード",
    "description": "The name for the dark color mode"
  },
  "theme.colorToggle.ariaLabel.mode.light": {
    "message": "ライトモード",
    "description": "The name for the light color mode"
  },
  "theme.blog.post.plurals": {
    "message": "{count} 件のブログ記事",
    "description": "Pluralized label for \"{count} posts\". Use as much plural forms (separated by \"|\") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)"
  },
  "theme.blog.tagTitle": {
    "message": "{nPosts} 件の「{tagName}」タグが含まれています",
    "description": "The title of the page for a blog tag"
  },
  "theme.tags.tagsPageLink": {
    "message": "すべてのタグを見る",
    "description": "The label of the link targeting the tag list page"
  },
  "theme.docs.breadcrumbs.navAriaLabel": {
    "message": "ページのパス",
    "description": "The ARIA label for the breadcrumbs"
  },
  "theme.docs.DocCard.categoryDescription": {
    "message": "{count} 件のアイテム",
    "description": "The default description for a category card in the generated index about how many items this category includes"
  },
  "theme.docs.paginator.navAriaLabel": {
    "message": "ドキュメントタブ",
    "description": "The ARIA label for the docs pagination"
  },
  "theme.docs.paginator.previous": {
    "message": "前のページ",
    "description": "The label used to navigate to the previous doc"
  },
  "theme.docs.paginator.next": {
    "message": "次のページ",
    "description": "The label used to navigate to the next doc"
  },
  "theme.docs.tagDocListPageTitle.nDocsTagged": {
    "message": "{count} 件のドキュメントにタグが付いています",
    "description": "Pluralized label for \"{count} docs tagged\". Use as much plural forms (separated by \"|\") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)"
  },
  "theme.docs.tagDocListPageTitle": {
    "message": "{nDocsTagged}「{tagName}」",
    "description": "The title of the page for a docs tag"
  },
  "theme.docs.versionBadge.label": {
    "message": "バージョン：{versionLabel}"
  },
  "theme.common.editThisPage": {
    "message": "このページを編集",
    "description": "The link label to edit the current page"
  },
  "theme.common.headingLinkTitle": {
    "message": "{heading}への直接リンク",
    "description": "Title for link to heading"
  },
  "theme.docs.versions.unreleasedVersionLabel": {
    "message": "これは {siteTitle} {versionLabel} バージョンの未発表のドキュメントです。",
    "description": "The label used to tell the user that he's browsing an unreleased doc version"
  },
  "theme.docs.versions.unmaintainedVersionLabel": {
    "message": "これは {siteTitle} {versionLabel} バージョンのドキュメントで、現在は積極的にメンテナンスされていません。",
    "description": "The label used to tell the user that he's browsing an unmaintained doc version"
  },
  "theme.docs.versions.latestVersionSuggestionLabel": {
    "message": "最新のドキュメントは {latestVersionLink} ({versionLabel}) をご覧ください。",
    "description": "The label used to tell the user to check the latest version"
  },
  "theme.docs.versions.latestVersionLinkLabel": {
    "message": "最新バージョン",
    "description": "The label used for the latest version suggestion link label"
  },
  "theme.lastUpdated.atDate": {
    "message": "{date} に",
    "description": "The words used to describe on which date a page has been last updated"
  },
  "theme.lastUpdated.byUser": {
    "message": "{user} によって",
    "description": "The words used to describe by who the page has been last updated"
  },
  "theme.lastUpdated.lastUpdatedAtBy": {
    "message": "最終更新 {byUser} {atDate}",
    "description": "The sentence used to display when a page has been last updated, and by who"
  },
  "theme.navbar.mobileVersionsDropdown.label": {
    "message": "バージョンを選択",
    "description": "The label for the navbar versions dropdown on mobile view"
  },
  "theme.tags.tagsListLabel": {
    "message": "タグ：",
    "description": "The label alongside a tag list"
  },
  "theme.AnnouncementBar.closeButtonAriaLabel": {
    "message": "閉じる",
    "description": "The ARIA label for close button of announcement bar"
  },
  "theme.blog.sidebar.navAriaLabel": {
    "message": "最近のブログ投稿ナビゲーション",
    "description": "The ARIA label for recent posts in the blog sidebar"
  },
  "theme.CodeBlock.copied": {
    "message": "コピー成功",
    "description": "The copied button label on code blocks"
  },
  "theme.CodeBlock.copyButtonAriaLabel": {
    "message": "コードをクリップボードにコピー",
    "description": "The ARIA label for copy code blocks button"
  },
  "theme.CodeBlock.copy": {
    "message": "コピー",
    "description": "The copy button label on code blocks"
  },
  "theme.CodeBlock.wordWrapToggle": {
    "message": "折り返しの切り替え",
    "description": "The title attribute for toggle word wrapping button of code block lines"
  },
  "theme.DocSidebarItem.toggleCollapsedCategoryAriaLabel": {
    "message": "サイドバーのメニュー「{label}」を開く/閉じる",
    "description": "The ARIA label to toggle the collapsible sidebar category"
  },
  "theme.NavBar.navAriaLabel": {
    "message": "メインナビゲーション",
    "description": "The ARIA label for the main navigation"
  },
  "theme.blog.post.readMore": {
    "message": "続きを読む",
    "description": "The label used in blog post item excerpts to link to full blog posts"
  },
  "theme.blog.post.readMoreLabel": {
    "message": "{title} の全文を読む",
    "description": "The ARIA label for the link to full blog posts from excerpts"
  },
  "theme.TOCCollapsible.toggleButtonLabel": {
    "message": "このページの概要",
    "description": "The label used by the button on the collapsible TOC component"
  },
  "theme.navbar.mobileLanguageDropdown.label": {
    "message": "言語を選択",
    "description": "The label for the mobile language switcher dropdown"
  },
  "theme.blog.post.readingTime.plurals": {
    "message": "{readingTime} 分で読めます",
    "description": "Pluralized label for \"{readingTime} min read\". Use as much plural forms (separated by \"|\") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)"
  },
  "theme.docs.breadcrumbs.home": {
    "message": "ホームページ",
    "description": "The ARIA label for the home page in the breadcrumbs"
  },
  "theme.docs.sidebar.collapseButtonTitle": {
    "message": "サイドバーを閉じる",
    "description": "The title attribute for collapse button of doc sidebar"
  },
  "theme.docs.sidebar.collapseButtonAriaLabel": {
    "message": "サイドバーを閉じる",
    "description": "The title attribute for collapse button of doc sidebar"
  },
  "theme.docs.sidebar.navAriaLabel": {
    "message": "ドキュメントサイドバー",
    "description": "The ARIA label for the sidebar navigation"
  },
  "theme.docs.sidebar.closeSidebarButtonAriaLabel": {
    "message": "ナビゲーションバーを閉じる",
    "description": "The ARIA label for close button of mobile sidebar"
  },
  "theme.navbar.mobileSidebarSecondaryMenu.backButtonLabel": {
    "message": "← メインメニューに戻る",
    "description": "The label of the back button to return to main menu, inside the mobile navbar sidebar (notably used to display the docs sidebar)"
  },
  "theme.docs.sidebar.toggleSidebarButtonAriaLabel": {
    "message": "ナビゲーションバーを切り替える",
    "description": "The ARIA label for hamburger menu button of mobile navigation"
  },
  "theme.docs.sidebar.expandButtonTitle": {
    "message": "サイドバーを展開する",
    "description": "The ARIA label and title attribute for expand button of doc sidebar"
  },
  "theme.docs.sidebar.expandButtonAriaLabel": {
    "message": "サイドバーを展開する",
    "description": "The ARIA label and title attribute for expand button of doc sidebar"
  },
  "theme.SearchBar.seeAll": {
    "message": "すべての結果を見る"
  },
  "theme.SearchPage.documentsFound.plurals": {
    "message": "合計 {count} 件のドキュメントが見つかりました",
    "description": "Pluralized label for \"{count} documents found\". Use as much plural forms (separated by \"|\") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)"
  },
  "theme.SearchPage.existingResultsTitle": {
    "message": "「{query}」の検索結果",
    "description": "The search page title for non-empty query"
  },
  "theme.SearchPage.emptyResultsTitle": {
    "message": "ドキュメントを検索",
    "description": "The search page title for empty query"
  },
  "theme.SearchPage.inputPlaceholder": {
    "message": "ここに検索語を入力",
    "description": "The placeholder for search page input"
  },
  "theme.SearchPage.inputLabel": {
    "message": "検索",
    "description": "The ARIA label for search page input"
  },
  "theme.SearchPage.algoliaLabel": {
    "message": "Algolia で検索",
    "description": "The ARIA label for Algolia mention"
  },
  "theme.SearchPage.noResultsText": {
    "message": "ドキュメントが見つかりませんでした",
    "description": "The paragraph for empty search result"
  },
  "theme.SearchPage.fetchingNewResults": {
    "message": "新しい検索結果を取得しています...",
    "description": "The paragraph for fetching new search results"
  },
  "theme.SearchBar.label": {
    "message": "検索",
    "description": "The ARIA label and placeholder for search button"
  },
  "theme.SearchModal.searchBox.resetButtonTitle": {
    "message": "クエリをクリア",
    "description": "The label and ARIA label for search box reset button"
  },
  "theme.SearchModal.searchBox.cancelButtonText": {
    "message": "キャンセル",
    "description": "The label and ARIA label for search box cancel button"
  },
  "theme.SearchModal.startScreen.recentSearchesTitle": {
    "message": "最近の検索",
    "description": "The title for recent searches"
  },
  "theme.SearchModal.startScreen.noRecentSearchesText": {
    "message": "最近の検索はありません",
    "description": "The text when no recent searches"
  },
  "theme.SearchModal.startScreen.saveRecentSearchButtonTitle": {
    "message": "この検索を保存",
    "description": "The label for save recent search button"
  },
  "theme.SearchModal.startScreen.removeRecentSearchButtonTitle": {
    "message": "履歴からこの検索を削除",
    "description": "The label for remove recent search button"
  },
  "theme.SearchModal.startScreen.favoriteSearchesTitle": {
    "message": "お気に入り",
    "description": "The title for favorite searches"
  },
  "theme.SearchModal.startScreen.removeFavoriteSearchButtonTitle": {
    "message": "お気に入りリストからこの検索を削除",
    "description": "The label for remove favorite search button"
  },
  "theme.SearchModal.errorScreen.titleText": {
    "message": "結果を取得できません",
    "description": "The title for error screen of search modal"
  },
  "theme.SearchModal.errorScreen.helpText": {
    "message": "ネットワーク接続を確認する必要があるかもしれません。",
    "description": "The help text for error screen of search modal"
  },
  "theme.SearchModal.footer.selectText": {
    "message": "選択",
    "description": "The explanatory text of the action for the enter key"
  },
  "theme.SearchModal.footer.selectKeyAriaLabel": {
    "message": "Enterキー",
    "description": "The ARIA label for the Enter key button that makes the selection"
  },
  "theme.SearchModal.footer.navigateText": {
    "message": "ナビゲーション",
    "description": "The explanatory text of the action for the Arrow up and Arrow down key"
  },
  "theme.SearchModal.footer.navigateUpKeyAriaLabel": {
    "message": "上矢印キー",
    "description": "The ARIA label for the Arrow up key button that makes the navigation"
  },
  "theme.SearchModal.footer.navigateDownKeyAriaLabel": {
    "message": "下矢印キー",
    "description": "The ARIA label for the Arrow down key button that makes the navigation"
  },
  "theme.SearchModal.footer.closeText": {
    "message": "閉じる",
    "description": "The explanatory text of the action for Escape key"
  },
  "theme.SearchModal.footer.closeKeyAriaLabel": {
    "message": "Escキー",
    "description": "The ARIA label for the Escape key button that close the modal"
  },
  "theme.SearchModal.footer.searchByText": {
    "message": "Algoliaによる検索",
    "description": "The text explain that the search is making by Algolia"
  },
  "theme.SearchModal.noResultsScreen.noResultsText": {
    "message": "結果がありません：",
    "description": "The text explains that there are no results for the following search"
  },
  "theme.SearchModal.noResultsScreen.suggestedQueryText": {
    "message": "検索を試してみてください",
    "description": "The text for the suggested query when no results are found for the following search"
  },
  "theme.SearchModal.noResultsScreen.reportMissingResultsText": {
    "message": "このクエリには結果があるべきだと思いますか？",
    "description": "The text for the question where the user thinks there are missing results"
  },
  "theme.SearchModal.noResultsScreen.reportMissingResultsLinkText": {
    "message": "お知らせください。",
    "description": "The text for the link to report missing results"
  },
  "theme.SearchModal.placeholder": {
    "message": "文書を検索",
    "description": "The placeholder of the input of the DocSearch pop-up modal"
  },
  "theme.Playground.result": {
    "message": "結果",
    "description": "The result label of the live codeblocks"
  },
  "theme.Playground.liveEditor": {
    "message": "ライブエディタ",
    "description": "The live editor label of the live codeblocks"
  },
  "theme.SearchBar.noResultsText": {
    "message": "文書が見つかりませんでした"
  },
  "theme.ErrorPageContent.tryAgain": {
    "message": "再試行",
    "description": "The label of the button to try again rendering when the React error boundary captures an error"
  },
  "theme.common.skipToMainContent": {
    "message": "メインコンテンツに移動",
    "description": "The skip to content label used for accessibility, allowing to rapidly navigate to main content with keyboard tab/enter navigation"
  },
  "theme.tags.tagsPageTitle": {
    "message": "タグ",
    "description": "The title of the tag list page"
  }
}



================================================
FILE: i18n/ja/docusaurus-plugin-content-docs/current.json
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ja/docusaurus-plugin-content-docs/current.json
================================================
{
  "version.label": {
    "message": "次",
    "description": "The label for version current"
  },
  "sidebar.learn.category.TON Blockchain": {
    "message": "TON ブロックチェーン",
    "description": "The label for category TON Blockchain in sidebar learn"
  },
  "sidebar.learn.category.TON Virtual Machine (TVM)": {
    "message": "TON バーチャルマシン (TVM)",
    "description": "The label for category TON Virtual Machine (TVM) in sidebar learn"
  },
  "sidebar.learn.category.TL-B Language": {
    "message": "TL-B 言語",
    "description": "The label for category TL-B Language in sidebar learn"
  },
  "sidebar.learn.category.TON Networking": {
    "message": "TON ネットワーキング",
    "description": "The label for category TON Networking in sidebar learn"
  },
  "sidebar.learn.category.ADNL Protocol": {
    "message": "ADNL プロトコル",
    "description": "The label for category ADNL Protocol in sidebar learn"
  },
  "sidebar.learn.category.TON Services": {
    "message": "TON サービス",
    "description": "The label for category TON Services in sidebar learn"
  },
  "sidebar.learn.category.TON Whitepapers": {
    "message": "TON ホワイトペーパー",
    "description": "The label for category TON Whitepapers in sidebar learn"
  },
  "sidebar.learn.link.TON Compared to Other L1s": {
    "message": "他の L1 と比較した TON",
    "description": "The label for link TON Compared to Other L1s in sidebar learn, linking to https://ton-org/analysis"
  },
  "sidebar.learn.link.Open-Source and Decentralization in TON": {
    "message": "TON におけるオープンソースと分散化",
    "description": "The label for link Open-Source and Decentralization in TON in sidebar learn, linking to https://defi-org/ton/"
  },
  "sidebar.learn.link.TON": {
    "message": "TON",
    "description": "The label for link TON in sidebar learn, linking to https://ton-org/ton-pdf"
  },
  "sidebar.learn.link.TON Virtual Machine": {
    "message": "TON バーチャルマシン",
    "description": "The label for link TON Virtual Machine in sidebar learn, linking to https://ton-org/tvm-pdf"
  },
  "sidebar.learn.link.TON Blockchain": {
    "message": "TON ブロックチェーン",
    "description": "The label for link TON Blockchain in sidebar learn, linking to https://ton-org/tblkch-pdf"
  },
  "sidebar.learn.link.Catchain Consensus Protocol": {
    "message": "Catchain コンセンサスプロトコル",
    "description": "The label for link Catchain Consensus Protocol in sidebar learn, linking to https://ton-org/catchain-pdf"
  },
  "sidebar.learn.doc.Overview": {
    "message": "概要",
    "description": "The label for the doc item Overview in sidebar learn, linking to the doc learn/docs"
  },
  "sidebar.learn.doc.TON DNS": {
    "message": "TON DNS",
    "description": "The label for the doc item TON DNS in sidebar learn, linking to the doc learn/services/dns"
  },
  "sidebar.learn.doc.TON Sites, WWW, and Proxy": {
    "message": "TON サイト、WWW、およびプロキシ",
    "description": "The label for the doc item TON Sites, WWW, and Proxy in sidebar learn, linking to the doc learn/services/sites-www-proxy"
  },
  "sidebar.develop.category.Develop Smart Contracts": {
    "message": "スマートコントラクトの開発",
    "description": "The label for category Develop Smart Contracts in sidebar develop"
  },
  "sidebar.develop.category.Environment": {
    "message": "環境",
    "description": "The label for category Environment in sidebar develop"
  },
  "sidebar.develop.category.Choose Your SDK": {
    "message": "SDK の選択",
    "description": "The label for category Choose Your SDK in sidebar develop"
  },
  "sidebar.develop.category.Testing & Debugging": {
    "message": "テストとデバッグ",
    "description": "The label for category Testing & Debugging in sidebar develop"
  },
  "sidebar.develop.category.Deploying Contract": {
    "message": "コントラクトのデプロイ",
    "description": "The label for category Deploying Contract in sidebar develop"
  },
  "sidebar.develop.category.Best Practices": {
    "message": "ベストプラクティス",
    "description": "The label for category Best Practices in sidebar develop"
  },
  "sidebar.develop.category.Develop dApps & Bots": {
    "message": "dApps & ボットの開発",
    "description": "The label for category Develop dApps & Bots in sidebar develop"
  },
  "sidebar.develop.category.API Types": {
    "message": "API タイプ",
    "description": "The label for category API Types in sidebar develop"
  },
  "sidebar.develop.category.DeFi Development": {
    "message": "DeFi 開発",
    "description": "The label for category DeFi Development in sidebar develop"
  },
  "sidebar.develop.category.Telegram bots": {
    "message": "Telegram ボット",
    "description": "The label for category Telegram bots in sidebar develop"
  },
  "sidebar.develop.category.FunC language": {
    "message": "FunC 言語",
    "description": "The label for category FunC language in sidebar develop"
  },
  "sidebar.develop.category.Documentation": {
    "message": "ドキュメンテーション",
    "description": "The label for category Documentation in sidebar develop"
  },
  "sidebar.develop.category.Network Configs": {
    "message": "ネットワーク設定",
    "description": "The label for category Network Configs in sidebar develop"
  },
  "sidebar.develop.category.Low Level Internals": {
    "message": "低レベルの内部",
    "description": "The label for category Low Level Internals in sidebar develop"
  },
  "sidebar.develop.category.Compile from Sources": {
    "message": "ソースからのコンパイル",
    "description": "The label for category Compile from Sources in sidebar develop"
  },
  "sidebar.develop.link.TON Hello World": {
    "message": "TON ハローワールド",
    "description": "The label for link TON Hello World in sidebar develop, linking to https://blog-ton-org/step-by-step-guide-for-writing-your-first-smart-contract-in-func"
  },
  "sidebar.develop.link.Using tonstarter-contracts": {
    "message": "tonstarter-contracts の使用",
    "description": "The label for link Using tonstarter-contracts in sidebar develop, linking to https://github-com/ton-defi-org/tonstarter-contracts"
  },
  "sidebar.develop.link.Using Online IDE": {
    "message": "オンライン IDE の使用",
    "description": "The label for link Using Online IDE in sidebar develop, linking to https://glitch-com/edit/#!/remix/clone-from-repo?&REPO_URL=https%3A%2F%2Fgithub-com%2Fton-defi-org%2Ftonstarter-contracts-git"
  },
  "sidebar.develop.link.Using toncli": {
    "message": "toncli の使用",
    "description": "The label for link Using toncli in sidebar develop, linking to https://github-com/disintar/toncli"
  },
  "sidebar.develop.link.Coming from Solidity": {
    "message": "Solidity からの移行",
    "description": "The label for link Coming from Solidity in sidebar develop, linking to /learn/introduction#ethereum-to-ton"
  },
  "sidebar.develop.link.How to shard your TON smart contract and why": {
    "message": "TON スマートコントラクトをシャードする方法とその理由",
    "description": "The label for link How to shard your TON smart contract and why in sidebar develop, linking to https://blog-ton-org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons"
  },
  "sidebar.develop.link.TON Concepts": {
    "message": "TON コンセプト",
    "description": "The label for link TON Concepts in sidebar develop, linking to /learn/introduction"
  },
  "sidebar.develop.link.TON Services": {
    "message": "TON サービス",
    "description": "The label for link TON Services in sidebar develop, linking to /learn/services/payments"
  },
  "sidebar.develop.link.TON Whitepapers": {
    "message": "TON ホワイトペーパー",
    "description": "The label for link TON Whitepapers in sidebar develop, linking to /learn/docs"
  },
  "sidebar.develop.link.Mainnet config": {
    "message": "メインネット設定",
    "description": "The label for link Mainnet config in sidebar develop, linking to https://ton-org/global-config-json"
  },
  "sidebar.develop.link.Testnet config": {
    "message": "テストネット設定",
    "description": "The label for link Testnet config in sidebar develop, linking to https://ton-org/testnet-global-config-json"
  },
  "sidebar.develop.doc.Compilation Instructions": {
    "message": "コンパイル手順",
    "description": "The label for the doc item Compilation Instructions in sidebar develop, linking to the doc develop/howto/compile"
  },
  "sidebar.develop.doc.Instructions for low-memory machines": {
    "message": "低メモリマシンのための手順",
    "description": "The label for the doc item Instructions for low-memory machines in sidebar develop, linking to the doc develop/howto/compile-swap"
  },
  "sidebar.participate.category.Setup Your Wallet": {
    "message": "ウォレットの設定",
    "description": "The label for category Setup Your Wallet in sidebar participate"
  },
  "sidebar.participate.category.Run a Node": {
    "message": "ノードを実行",
    "description": "The label for category Run a Node in sidebar participate"
  },
  "sidebar.participate.category.Use TON Proxy": {
    "message": "TON プロキシの使用",
    "description": "The label for category Use TON Proxy in sidebar participate"
  },
  "sidebar.participate.link.Wallet Contract Versions": {
    "message": "ウォレットコントラクトのバージョン",
    "description": "The label for link Wallet Contract Versions in sidebar participate, linking to https://github-com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources-md"
  },
  "sidebar.participate.link.Run a Validator Node": {
    "message": "バリデーターノードの実行",
    "description": "The label for link Run a Validator Node in sidebar participate, linking to https://ton-org/validator"
  },
  "sidebar.participate.link.Standards Discussion (TEPs)": {
    "message": "標準ディスカッション (TEPs)",
    "description": "The label for link Standards Discussion (TEPs) in sidebar participate, linking to https://github-com/ton-blockchain/TEPs"
  },
  "sidebar.participate.link.Ask a Question about TON": {
    "message": "TON に関する質問をする",
    "description": "The label for link Ask a Question about TON in sidebar participate, linking to https://answers-ton-org/"
  },
  "sidebar.participate.doc.Use Cross-chain Bridges": {
    "message": "クロスチェーンブリッジの使用",
    "description": "The label for the doc item Use Cross-chain Bridges in sidebar participate, linking to the doc participate/crosschain-bridges"
  },
  "sidebar.participate.doc.Stake with Nominator Pools": {
    "message": "ノミネータープールとステーク",
    "description": "The label for the doc item Stake with Nominator Pools in sidebar participate, linking to the doc participate/nominators"
  },
  "sidebar.contribute.category.Become a Contributor": {
    "message": "コントリビューターになる",
    "description": "The label for category Become a Contributor in sidebar contribute"
  },
  "sidebar.contribute.category.Hacktoberfest 2022": {
    "message": "Hacktoberfest 2022",
    "description": "The label for category Hacktoberfest 2022 in sidebar contribute"
  },
  "sidebar.contribute.category.Archive": {
    "message": "アーカイブ",
    "description": "The label for category Archive in sidebar contribute"
  },
  "sidebar.contribute.category.Common Rules": {
    "message": "一般規則",
    "description": "The label for category Common Rules in sidebar contribute"
  },
  "sidebar.contribute.category.Documentation": {
    "message": "ドキュメント",
    "description": "The label for category Documentation in sidebar contribute"
  },
  "sidebar.contribute.category.Localization Program": {
    "message": "ローカライゼーションシステム",
    "description": "The label for category Localization Program in sidebar contribute"
  },
  "sidebar.contribute.category.Tutorials": {
    "message": "チュートリアル",
    "description": "The label for category Tutorials in sidebar contribute"
  },
  "sidebar.contribute.doc.How It Works": {
    "message": "仕組み",
    "description": "The label for the doc item How It Works in sidebar contribute, linking to the doc contribute/localization-program/how-it-works"
  },
  "sidebar.contribute.doc.How To Contribute": {
    "message": "寄稿方法",
    "description": "The label for the doc item How To Contribute in sidebar contribute, linking to the doc contribute/localization-program/how-to-contribute"
  },
  "sidebar.contribute.doc.Overview": {
    "message": "概要",
    "description": "The label for the doc item Overview in sidebar contribute, linking to the doc contribute/localization-program/overview"
  },
  "sidebar.contribute.doc.Translation Style Guide": {
    "message": "翻訳スタイルガイド",
    "description": "The label for the doc item Translation Style Guide in sidebar contribute, linking to the doc contribute/localization-program/translation-style-guide"
  },
  "sidebar.develop.category.APIs and SDKs": {
    "message": "API と SDK",
    "description": "The label for category APIs and SDKs in sidebar develop"
  },
  "sidebar.develop.category.Advanced": {
    "message": "高度",
    "description": "The label for category Advanced in sidebar develop"
  },
  "sidebar.develop.category.Archived": {
    "message": "アーカイブ済み",
    "description": "The label for category Archived in sidebar develop"
  },
  "sidebar.develop.category.Blockchain Fundamentals": {
    "message": "ブロックチェーン基礎",
    "description": "The label for category Blockchain Fundamentals in sidebar develop"
  },
  "sidebar.develop.category.Business": {
    "message": "ビジネス",
    "description": "The label for category Business in sidebar develop"
  },
  "sidebar.develop.category.Core Contracts": {
    "message": "コアコントラクト",
    "description": "The label for category Core Contracts in sidebar develop"
  },
  "sidebar.develop.category.DApps Development": {
    "message": "分散型アプリケーション開発",
    "description": "The label for category DApps Development in sidebar develop"
  },
  "sidebar.develop.category.Data Formats": {
    "message": "データ形式",
    "description": "The label for category Data Formats in sidebar develop"
  },
  "sidebar.develop.category.Development Guidelines": {
    "message": "開発ガイドライン",
    "description": "The label for category Development Guidelines in sidebar develop"
  },
  "sidebar.develop.category.Fift language": {
    "message": "Fift 言語",
    "description": "The label for category Fift language in sidebar develop"
  },
  "sidebar.develop.category.Frameworks": {
    "message": "フレームワーク",
    "description": "The label for category Frameworks in sidebar develop"
  },
  "sidebar.develop.category.Getting Started": {
    "message": "はじめに",
    "description": "The label for category Getting Started in sidebar develop"
  },
  "sidebar.develop.category.Guidelines": {
    "message": "ガイドライン",
    "description": "The label for category Guidelines in sidebar develop"
  },
  "sidebar.develop.category.Integrate with TON": {
    "message": "TONとの統合",
    "description": "The label for category Integrate with TON in sidebar develop"
  },
  "sidebar.develop.category.Message Management": {
    "message": "メッセージ管理",
    "description": "The label for category Message Management in sidebar develop"
  },
  "sidebar.develop.category.Network Configurations": {
    "message": "ネットワーク構成",
    "description": "The label for category Network Configurations in sidebar develop"
  },
  "sidebar.develop.category.Network Protocols": {
    "message": "ネットワークプロトコル",
    "description": "The label for category Network Protocols in sidebar develop"
  },
  "sidebar.develop.category.Security Measures": {
    "message": "セキュリティ対策",
    "description": "The label for category Security Measures in sidebar develop"
  },
  "sidebar.develop.category.Smart Contracts": {
    "message": "スマートコントラクト",
    "description": "The label for category Smart Contracts in sidebar develop"
  },
  "sidebar.develop.category.TL-B": {
    "message": "TL-B",
    "description": "The label for category TL-B in sidebar develop"
  },
  "sidebar.develop.category.TON Hello World series": {
    "message": "TON Hello World シリーズ",
    "description": "The label for category TON Hello World series in sidebar develop"
  },
  "sidebar.develop.category.TON Virtual Machine (TVM)": {
    "message": "TON 仮想マシン(TVM)",
    "description": "The label for category TON Virtual Machine (TVM) in sidebar develop"
  },
  "sidebar.develop.category.Telegram Bot Examples": {
    "message": "Telegram ボットの例",
    "description": "The label for category Telegram Bot Examples in sidebar develop"
  },
  "sidebar.develop.category.Telegram Mini Apps": {
    "message": "Telegram ミニアプリ",
    "description": "The label for category Telegram Mini Apps in sidebar develop"
  },
  "sidebar.develop.category.Testing and Debugging": {
    "message": "テストとデバッグ",
    "description": "The label for category Testing and Debugging in sidebar develop"
  },
  "sidebar.develop.category.Transaction Fees": {
    "message": "取引手数料",
    "description": "The label for category Transaction Fees in sidebar develop"
  },
  "sidebar.develop.category.Tutorials & Examples": {
    "message": "チュートリアルと例",
    "description": "The label for category Tutorials & Examples in sidebar develop"
  },
  "sidebar.develop.doc.Get Started with TON": {
    "message": "TONを始める",
    "description": "The label for the doc item Get Started with TON in sidebar develop, linking to the doc develop/get-started-with-ton"
  },
  "sidebar.develop.doc.HTML/JS Apps": {
    "message": "HTML/JS アプリケーション",
    "description": "The label for the doc item HTML/JS Apps in sidebar develop, linking to the doc develop/dapps/ton-connect/web"
  },
  "sidebar.develop.doc.Mint Your First Token": {
    "message": "最初のトークンを発行する",
    "description": "The label for the doc item Mint Your First Token in sidebar develop, linking to the doc develop/dapps/tutorials/jetton-minter"
  },
  "sidebar.develop.doc.NFT Minting Guide": {
    "message": "NFT 発行ガイド",
    "description": "The label for the doc item NFT Minting Guide in sidebar develop, linking to the doc develop/dapps/tutorials/collection-minting"
  },
  "sidebar.develop.doc.NFT Use Cases in TON": {
    "message": "TON における NFT の使用例",
    "description": "The label for the doc item NFT Use Cases in TON in sidebar develop, linking to the doc participate/nft"
  },
  "sidebar.develop.doc.React Apps": {
    "message": "React アプリケーション",
    "description": "The label for the doc item React Apps in sidebar develop, linking to the doc develop/dapps/ton-connect/react"
  },
  "sidebar.develop.doc.TON Connect Protocol": {
    "message": "TON Connect プロトコル",
    "description": "The label for the doc item TON Connect Protocol in sidebar develop, linking to the doc develop/dapps/ton-connect/protocol/README"
  },
  "sidebar.develop.doc.Telegram Bots JS": {
    "message": "Telegram ボット(JS)",
    "description": "The label for the doc item Telegram Bots JS in sidebar develop, linking to the doc develop/dapps/ton-connect/tg-bot-integration"
  },
  "sidebar.develop.doc.Telegram Bots Python": {
    "message": "Telegram ボット(Python)",
    "description": "The label for the doc item Telegram Bots Python in sidebar develop, linking to the doc develop/dapps/ton-connect/tg-bot-integration-py"
  },
  "sidebar.develop.doc.Web3 Game Example": {
    "message": "Web3 ゲーム例",
    "description": "The label for the doc item Web3 Game Example in sidebar develop, linking to the doc develop/dapps/tutorials/building-web3-game"
  },
  "sidebar.develop.doc.Zero-Knowledge Proofs": {
    "message": "ゼロ知識証明",
    "description": "The label for the doc item Zero-Knowledge Proofs in sidebar develop, linking to the doc develop/dapps/tutorials/simple-zk-on-ton"
  },
  "sidebar.develop.link.Building first web client": {
    "message": "最初のWebクライアントの構築",
    "description": "The label for link Building first web client in sidebar develop, linking to https://helloworld.tonstudio.io/03-client"
  },
  "sidebar.develop.link.TVM Instructions": {
    "message": "TVM 命令",
    "description": "The label for link TVM Instructions in sidebar develop, linking to /learn/tvm-instructions/instructions"
  },
  "sidebar.develop.link.Testing your smart contract": {
    "message": "スマートコントラクトのテスト",
    "description": "The label for link Testing your smart contract in sidebar develop, linking to https://helloworld.tonstudio.io/04-testing"
  },
  "sidebar.develop.link.Wallets List": {
    "message": "ウォレットリスト",
    "description": "The label for link Wallets List in sidebar develop, linking to https://github.com/ton-blockchain/wallets-list"
  },
  "sidebar.develop.link.Working with your wallet": {
    "message": "ウォレットの使用",
    "description": "The label for link Working with your wallet in sidebar develop, linking to https://helloworld.tonstudio.io/01-wallet"
  },
  "sidebar.develop.link.Writing first smart contract": {
    "message": "最初のスマートコントラクトの作成",
    "description": "The label for link Writing first smart contract in sidebar develop, linking to https://helloworld.tonstudio.io/02-contract"
  },
  "sidebar.participate.category.Blockchain Nodes": {
    "message": "ブロックチェーンノード",
    "description": "The label for category Blockchain Nodes in sidebar participate"
  },
  "sidebar.participate.category.Cross-chain Bridges": {
    "message": "クロスチェーンブリッジ",
    "description": "The label for category Cross-chain Bridges in sidebar participate"
  },
  "sidebar.participate.category.Network Infrastructure": {
    "message": "ネットワークインフラ",
    "description": "The label for category Network Infrastructure in sidebar participate"
  },
  "sidebar.participate.category.TON DNS": {
    "message": "TON DNS",
    "description": "The label for category TON DNS in sidebar participate"
  },
  "sidebar.participate.category.TON Proxy & Sites": {
    "message": "TON プロキシとサイト",
    "description": "The label for category TON Proxy & Sites in sidebar participate"
  },
  "sidebar.participate.category.TON Storage": {
    "message": "TON ストレージ",
    "description": "The label for category TON Storage in sidebar participate"
  },
  "sidebar.participate.category.Wallets in TON": {
    "message": "TON ウォレット",
    "description": "The label for category Wallets in TON in sidebar participate"
  },
  "sidebar.participate.doc.Bridges Addresses": {
    "message": "ブリッジアドレス",
    "description": "The label for the doc item Bridges Addresses in sidebar participate, linking to the doc participate/crosschain/bridge-addresses"
  },
  "sidebar.participate.doc.Overview": {
    "message": "概要",
    "description": "The label for the doc item Overview in sidebar participate, linking to the doc participate/crosschain/overview"
  }
}



================================================
FILE: i18n/ja/docusaurus-plugin-content-docs/current/v3/contribute/docs/guidelines.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ja/docusaurus-plugin-content-docs/current/v3/contribute/docs/guidelines.md
================================================
# ドキュメンテーションの共通ルール

最適なユーザーエクスペリエンスと明確さを提供するために、新しいコンテンツを作成する際には、docs.ton.org をすべてのドキュメントに適用し、一般的かつ重要な要件のリストに留意してください。

## プロフェッショナル向けのドキュメント

ドキュメントページは主にドキュメントの目的のために作成されており、チュートリアルとしての使用を意図していないため、テキスト中で個人的な例や比喩の使用を最小限に抑えることが重要です。コンテンツが専門家およびそうでない人の両方に適していることを確保しつつ、有益な情報を提供することが重要です。

## 一貫したフォーマットを使用する

読者がドキュメントを簡単に追えるようにするためには、ドキュメント全体で一貫したフォーマットを使用することが重要です。見出し、サブ見出し、箇条書き、および番号付きリストを使用して、テキストを区切り、読みやすくしましょう。

## 特別なセクションで例を挙げる

例を挙げることで、読者はその内容や適用方法をより理解しやすくなります。もしドキュメントページを書いていて、いくつかの例を参照する必要がある場合は、「参考文献」と「また見る」のセクションの前に「例」のセクションを作ってください。ドキュメントページでは、説明と例を混在させないよう気をつけてください。
コード・スニペット、スクリーンショット、図などを使ってポイントを説明し、ドキュメントをより魅力的なものにしてください。

## 常に最新の状態に

技術文書は、技術の変化やソフトウェアの更新により、すぐに古くなってしまいます。ドキュメンテーションを定期的に見直し、更新することで、正確さとソフトウェアの最新バージョンとの関連性を保つことが重要です。

## フィードバックを得る

ドキュメントを公開する前に、他のコントリビューターやユーザーからフィードバックをもらうとよいでしょう。そうすることで、分かりにくかったり、不明瞭だったりする部分を特定し、ドキュメントを公開する前に改善することができます。



================================================
FILE: i18n/ko/code.json
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/code.json
================================================
{
  "theme.ErrorPageContent.title": {
    "message": "페이지에 오류가 발생하였습니다.",
    "description": "The title of the fallback page when the page crashed"
  },
  "theme.ErrorPageContent.tryAgain": {
    "message": "다시 시도해 보세요",
    "description": "The label of the button to try again when the page crashed"
  },
  "theme.NotFound.title": {
    "message": "페이지를 찾을 수 없습니다.",
    "description": "The title of the 404 page"
  },
  "theme.NotFound.p1": {
    "message": "원하는 페이지를 찾을 수 없습니다.",
    "description": "The first paragraph of the 404 page"
  },
  "theme.NotFound.p2": {
    "message": "사이트 관리자에게 링크가 깨진 것을 알려주세요.",
    "description": "The 2nd paragraph of the 404 page"
  },
  "theme.admonition.note": {
    "message": "노트",
    "description": "The default label used for the Note admonition (:::note)"
  },
  "theme.admonition.tip": {
    "message": "팁",
    "description": "The default label used for the Tip admonition (:::tip)"
  },
  "theme.admonition.danger": {
    "message": "위험",
    "description": "The default label used for the Danger admonition (:::danger)"
  },
  "theme.admonition.info": {
    "message": "정보",
    "description": "The default label used for the Info admonition (:::info)"
  },
  "theme.admonition.caution": {
    "message": "주의",
    "description": "The default label used for the Caution admonition (:::caution)"
  },
  "theme.BackToTopButton.buttonAriaLabel": {
    "message": "맨 위로 스크롤하기",
    "description": "The ARIA label for the back to top button"
  },
  "theme.blog.paginator.navAriaLabel": {
    "message": "블로그 게시물 목록 탐색",
    "description": "The ARIA label for the blog pagination"
  },
  "theme.blog.paginator.newerEntries": {
    "message": "이전 페이지",
    "description": "The label used to navigate to the newer blog posts page (previous page)"
  },
  "theme.blog.paginator.olderEntries": {
    "message": "다음 페이지",
    "description": "The label used to navigate to the older blog posts page (next page)"
  },
  "theme.blog.archive.title": {
    "message": "게시물 목록",
    "description": "The page & hero title of the blog archive page"
  },
  "theme.blog.archive.description": {
    "message": "게시물 목록",
    "description": "The page & hero description of the blog archive page"
  },
  "theme.blog.post.paginator.navAriaLabel": {
    "message": "블로그 게시물 탐색",
    "description": "The ARIA label for the blog posts pagination"
  },
  "theme.blog.post.paginator.newerPost": {
    "message": "이전 게시물",
    "description": "The blog post button label to navigate to the newer/previous post"
  },
  "theme.blog.post.paginator.olderPost": {
    "message": "다음 게시물",
    "description": "The blog post button label to navigate to the older/next post"
  },
  "theme.blog.post.plurals": {
    "message": "{count}개 게시물",
    "description": "Pluralized label for \"{count} posts\". Use as much plural forms (separated by \"|\") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)"
  },
  "theme.blog.tagTitle": {
    "message": "\"{tagName}\" 태그로 연결된 {nPosts}개의 게시물이 있습니다.",
    "description": "The title of the page for a blog tag"
  },
  "theme.tags.tagsPageLink": {
    "message": "모든 태그 보기",
    "description": "The label of the link targeting the tag list page"
  },
  "theme.colorToggle.ariaLabel": {
    "message": "어두운 모드와 밝은 모드 전환하기 (현재 {mode})",
    "description": "The ARIA label for the navbar color mode toggle"
  },
  "theme.colorToggle.ariaLabel.mode.dark": {
    "message": "어두운 모드",
    "description": "The name for the dark color mode"
  },
  "theme.colorToggle.ariaLabel.mode.light": {
    "message": "밝은 모드",
    "description": "The name for the light color mode"
  },
  "theme.docs.breadcrumbs.home": {
    "message": "홈",
    "description": "The ARIA label for the home page in the breadcrumbs"
  },
  "theme.docs.breadcrumbs.navAriaLabel": {
    "message": "Breadcrumbs",
    "description": "The ARIA label for the breadcrumbs"
  },
  "theme.docs.DocCard.categoryDescription": {
    "message": "{count} 항목",
    "description": "The default description for a category card in the generated index about how many items this category includes"
  },
  "theme.docs.paginator.navAriaLabel": {
    "message": "문서 탐색",
    "description": "The ARIA label for the docs pagination"
  },
  "theme.docs.paginator.previous": {
    "message": "이전",
    "description": "The label used to navigate to the previous doc"
  },
  "theme.docs.paginator.next": {
    "message": "다음",
    "description": "The label used to navigate to the next doc"
  },
  "theme.docs.tagDocListPageTitle.nDocsTagged": {
    "message": "{count}개 문서가",
    "description": "Pluralized label for \"{count} docs tagged\". Use as much plural forms (separated by \"|\") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)"
  },
  "theme.docs.tagDocListPageTitle": {
    "message": "{nDocsTagged} \"{tagName}\" 태그에 분류되었습니다",
    "description": "The title of the page for a docs tag"
  },
  "theme.docs.versionBadge.label": {
    "message": "버전: {versionLabel}"
  },
  "theme.docs.versions.unreleasedVersionLabel": {
    "message": "{siteTitle} {versionLabel} 문서는 아직 정식 공개되지 않았습니다.",
    "description": "The label used to tell the user that he's browsing an unreleased doc version"
  },
  "theme.docs.versions.unmaintainedVersionLabel": {
    "message": "{siteTitle} {versionLabel} 문서는 더 이상 업데이트되지 않습니다.",
    "description": "The label used to tell the user that he's browsing an unmaintained doc version"
  },
  "theme.docs.versions.latestVersionSuggestionLabel": {
    "message": "최신 문서는 {latestVersionLink} ({versionLabel})을 확인하세요.",
    "description": "The label used to tell the user to check the latest version"
  },
  "theme.docs.versions.latestVersionLinkLabel": {
    "message": "최신 버전",
    "description": "The label used for the latest version suggestion link label"
  },
  "theme.common.editThisPage": {
    "message": "페이지 편집",
    "description": "The link label to edit the current page"
  },
  "theme.common.headingLinkTitle": {
    "message": "제목으로 바로 가기",
    "description": "Title for link to heading"
  },
  "theme.lastUpdated.atDate": {
    "message": " {date}에",
    "description": "The words used to describe on which date a page has been last updated"
  },
  "theme.lastUpdated.byUser": {
    "message": " {user}가",
    "description": "The words used to describe by who the page has been last updated"
  },
  "theme.lastUpdated.lastUpdatedAtBy": {
    "message": "최종 수정: {atDate}{byUser}",
    "description": "The sentence used to display when a page has been last updated, and by who"
  },
  "theme.navbar.mobileVersionsDropdown.label": {
    "message": "버전",
    "description": "The label for the navbar versions dropdown on mobile view"
  },
  "theme.common.skipToMainContent": {
    "message": "본문으로 건너뛰기",
    "description": "The skip to content label used for accessibility, allowing to rapidly navigate to main content with keyboard tab/enter navigation"
  },
  "theme.AnnouncementBar.closeButtonAriaLabel": {
    "message": "닫기",
    "description": "The ARIA label for close button of announcement bar"
  },
  "theme.tags.tagsListLabel": {
    "message": "태그:",
    "description": "The label alongside a tag list"
  },
  "theme.blog.sidebar.navAriaLabel": {
    "message": "최근 블로그 문서 둘러보기",
    "description": "The ARIA label for recent posts in the blog sidebar"
  },
  "theme.CodeBlock.copied": {
    "message": "복사했습니다",
    "description": "The copied button label on code blocks"
  },
  "theme.CodeBlock.copyButtonAriaLabel": {
    "message": "클립보드에 코드 복사",
    "description": "The ARIA label for copy code blocks button"
  },
  "theme.CodeBlock.copy": {
    "message": "복사",
    "description": "The copy button label on code blocks"
  },
  "theme.CodeBlock.wordWrapToggle": {
    "message": "줄 바꿈 전환",
    "description": "The title attribute for toggle word wrapping button of code block lines"
  },
  "theme.DocSidebarItem.toggleCollapsedCategoryAriaLabel": {
    "message": "접을 수 있는 사이드바 분류 '{label}' 접기(펼치기)",
    "description": "The ARIA label to toggle the collapsible sidebar category"
  },
  "theme.navbar.mobileLanguageDropdown.label": {
    "message": "언어",
    "description": "The label for the mobile language switcher dropdown"
  },
  "theme.TOCCollapsible.toggleButtonLabel": {
    "message": "이 페이지에서",
    "description": "The label used by the button on the collapsible TOC component"
  },
  "theme.blog.post.readMore": {
    "message": "자세히 보기",
    "description": "The label used in blog post item excerpts to link to full blog posts"
  },
  "theme.blog.post.readMoreLabel": {
    "message": "{title} 에 대해 더 읽어보기",
    "description": "The ARIA label for the link to full blog posts from excerpts"
  },
  "theme.docs.sidebar.collapseButtonTitle": {
    "message": "사이드바 숨기기",
    "description": "The title attribute for collapse button of doc sidebar"
  },
  "theme.docs.sidebar.collapseButtonAriaLabel": {
    "message": "사이드바 숨기기",
    "description": "The title attribute for collapse button of doc sidebar"
  },
  "theme.blog.post.readingTime.plurals": {
    "message": "약 {readingTime}분",
    "description": "Pluralized label for \"{readingTime} min read\". Use as much plural forms (separated by \"|\") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)"
  },
  "theme.navbar.mobileSidebarSecondaryMenu.backButtonLabel": {
    "message": "← 메인 메뉴로 돌아가기",
    "description": "The label of the back button to return to main menu, inside the mobile navbar sidebar secondary menu (notably used to display the docs sidebar)"
  },
  "theme.docs.sidebar.expandButtonTitle": {
    "message": "사이드바 열기",
    "description": "The ARIA label and title attribute for expand button of doc sidebar"
  },
  "theme.docs.sidebar.expandButtonAriaLabel": {
    "message": "사이드바 열기",
    "description": "The ARIA label and title attribute for expand button of doc sidebar"
  },
  "theme.Playground.result": {
    "message": "결과",
    "description": "The result label of the live codeblocks"
  },
  "theme.Playground.liveEditor": {
    "message": "라이브 에디터",
    "description": "The live editor label of the live codeblocks"
  },
  "theme.SearchBar.noResultsText": {
    "message": "No results"
  },
  "theme.SearchBar.seeAll": {
    "message": "See all results"
  },
  "theme.SearchBar.label": {
    "message": "Search",
    "description": "The ARIA label and placeholder for search button"
  },
  "theme.SearchPage.existingResultsTitle": {
    "message": "Search results for \"{query}\"",
    "description": "The search page title for non-empty query"
  },
  "theme.SearchPage.emptyResultsTitle": {
    "message": "Search the documentation",
    "description": "The search page title for empty query"
  },
  "theme.SearchPage.documentsFound.plurals": {
    "message": "1 document found|{count} documents found",
    "description": "Pluralized label for \"{count} documents found\". Use as much plural forms (separated by \"|\") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)"
  },
  "theme.SearchPage.noResultsText": {
    "message": "No documents were found",
    "description": "The paragraph for empty search result"
  },
  "theme.tags.tagsPageTitle": {
    "message": "태그",
    "description": "The title of the tag list page"
  },
  "theme.NavBar.navAriaLabel": {
    "message": "주 내비게이션",
    "description": "The ARIA label for the main navigation"
  },
  "theme.SearchModal.errorScreen.helpText": {
    "message": "네트워크 연결을 확인해야 할 수도 있습니다.",
    "description": "The help text for error screen of search modal"
  },
  "theme.SearchModal.errorScreen.titleText": {
    "message": "결과를 가져올 수 없습니다",
    "description": "The title for error screen of search modal"
  },
  "theme.SearchModal.footer.closeKeyAriaLabel": {
    "message": "Esc 키",
    "description": "The ARIA label for the Escape key button that close the modal"
  },
  "theme.SearchModal.footer.closeText": {
    "message": "닫기",
    "description": "The explanatory text of the action for Escape key"
  },
  "theme.SearchModal.footer.navigateDownKeyAriaLabel": {
    "message": "아래 화살표 키",
    "description": "The ARIA label for the Arrow down key button that makes the navigation"
  },
  "theme.SearchModal.footer.navigateText": {
    "message": "탐색",
    "description": "The explanatory text of the action for the Arrow up and Arrow down key"
  },
  "theme.SearchModal.footer.navigateUpKeyAriaLabel": {
    "message": "위 화살표 키",
    "description": "The ARIA label for the Arrow up key button that makes the navigation"
  },
  "theme.SearchModal.footer.searchByText": {
    "message": "검색 제공",
    "description": "The text explain that the search is making by Algolia"
  },
  "theme.SearchModal.footer.selectKeyAriaLabel": {
    "message": "Enter 키",
    "description": "The ARIA label for the Enter key button that makes the selection"
  },
  "theme.SearchModal.footer.selectText": {
    "message": "선택",
    "description": "The explanatory text of the action for the enter key"
  },
  "theme.SearchModal.noResultsScreen.noResultsText": {
    "message": "결과가 없습니다:",
    "description": "The text explains that there are no results for the following search"
  },
  "theme.SearchModal.noResultsScreen.reportMissingResultsLinkText": {
    "message": "알려주세요.",
    "description": "The text for the link to report missing results"
  },
  "theme.SearchModal.noResultsScreen.reportMissingResultsText": {
    "message": "이 쿼리에 결과가 있어야 한다고 생각하십니까?",
    "description": "The text for the question where the user thinks there are missing results"
  },
  "theme.SearchModal.noResultsScreen.suggestedQueryText": {
    "message": "검색해 보세요",
    "description": "The text for the suggested query when no results are found for the following search"
  },
  "theme.SearchModal.placeholder": {
    "message": "문서 검색",
    "description": "The placeholder of the input of the DocSearch pop-up modal"
  },
  "theme.SearchModal.searchBox.cancelButtonText": {
    "message": "취소",
    "description": "The label and ARIA label for search box cancel button"
  },
  "theme.SearchModal.searchBox.resetButtonTitle": {
    "message": "쿼리 지우기",
    "description": "The label and ARIA label for search box reset button"
  },
  "theme.SearchModal.startScreen.favoriteSearchesTitle": {
    "message": "즐겨찾기",
    "description": "The title for favorite searches"
  },
  "theme.SearchModal.startScreen.noRecentSearchesText": {
    "message": "최근 검색 없음",
    "description": "The text when no recent searches"
  },
  "theme.SearchModal.startScreen.recentSearchesTitle": {
    "message": "최근 검색",
    "description": "The title for recent searches"
  },
  "theme.SearchModal.startScreen.removeFavoriteSearchButtonTitle": {
    "message": "즐겨찾기 목록에서 이 검색 삭제",
    "description": "The label for remove favorite search button"
  },
  "theme.SearchModal.startScreen.removeRecentSearchButtonTitle": {
    "message": "기록에서 이 검색 삭제",
    "description": "The label for remove recent search button"
  },
  "theme.SearchModal.startScreen.saveRecentSearchButtonTitle": {
    "message": "이 검색 저장",
    "description": "The label for save recent search button"
  },
  "theme.SearchPage.algoliaLabel": {
    "message": "Algolia로 검색",
    "description": "The ARIA label for Algolia mention"
  },
  "theme.SearchPage.fetchingNewResults": {
    "message": "새 검색 결과를 가져오는 중...",
    "description": "The paragraph for fetching new search results"
  },
  "theme.SearchPage.inputLabel": {
    "message": "검색",
    "description": "The ARIA label for search page input"
  },
  "theme.SearchPage.inputPlaceholder": {
    "message": "여기에 검색어 입력",
    "description": "The placeholder for search page input"
  },
  "theme.docs.sidebar.closeSidebarButtonAriaLabel": {
    "message": "네비게이션 바 닫기",
    "description": "The ARIA label for close button of mobile sidebar"
  },
  "theme.docs.sidebar.navAriaLabel": {
    "message": "문서 사이드바",
    "description": "The ARIA label for the sidebar navigation"
  },
  "theme.docs.sidebar.toggleSidebarButtonAriaLabel": {
    "message": "네비게이션 바 전환",
    "description": "The ARIA label for hamburger menu button of mobile navigation"
  }
}



================================================
FILE: i18n/ko/docusaurus-plugin-content-docs/current.json
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-docs/current.json
================================================
{
  "version.label": {
    "message": "Next",
    "description": "The label for version current"
  },
  "sidebar.learn.category.TON Blockchain": {
    "message": "TON Blockchain",
    "description": "The label for category TON Blockchain in sidebar learn"
  },
  "sidebar.learn.category.TON Virtual Machine (TVM)": {
    "message": "TON Virtual Machine (TVM)",
    "description": "The label for category TON Virtual Machine (TVM) in sidebar learn"
  },
  "sidebar.learn.category.TL-B Language": {
    "message": "TL-B Language",
    "description": "The label for category TL-B Language in sidebar learn"
  },
  "sidebar.learn.category.TON Networking": {
    "message": "TON Networking",
    "description": "The label for category TON Networking in sidebar learn"
  },
  "sidebar.learn.category.ADNL Protocol": {
    "message": "ADNL Protocol",
    "description": "The label for category ADNL Protocol in sidebar learn"
  },
  "sidebar.learn.category.TON Services": {
    "message": "TON Services",
    "description": "The label for category TON Services in sidebar learn"
  },
  "sidebar.learn.category.TON Whitepapers": {
    "message": "TON Whitepapers",
    "description": "The label for category TON Whitepapers in sidebar learn"
  },
  "sidebar.learn.link.TON Compared to Other L1s": {
    "message": "TON Compared to Other L1s",
    "description": "The label for link TON Compared to Other L1s in sidebar learn, linking to https://ton.org/analysis"
  },
  "sidebar.learn.link.Open-Source and Decentralization in TON": {
    "message": "Open-Source and Decentralization in TON",
    "description": "The label for link Open-Source and Decentralization in TON in sidebar learn, linking to https://defi.org/ton/"
  },
  "sidebar.learn.link.TON": {
    "message": "TON",
    "description": "The label for link TON in sidebar learn, linking to https://ton.org/ton.pdf"
  },
  "sidebar.learn.link.TON Virtual Machine": {
    "message": "TON Virtual Machine",
    "description": "The label for link TON Virtual Machine in sidebar learn, linking to https://ton.org/tvm.pdf"
  },
  "sidebar.learn.link.TON Blockchain": {
    "message": "TON Blockchain",
    "description": "The label for link TON Blockchain in sidebar learn, linking to https://ton.org/tblkch.pdf"
  },
  "sidebar.learn.link.Catchain Consensus Protocol": {
    "message": "Catchain Consensus Protocol",
    "description": "The label for link Catchain Consensus Protocol in sidebar learn, linking to https://ton.org/catchain.pdf"
  },
  "sidebar.learn.doc.Overview": {
    "message": "Overview",
    "description": "The label for the doc item Overview in sidebar learn, linking to the doc learn/docs"
  },
  "sidebar.learn.doc.TON DNS": {
    "message": "TON DNS",
    "description": "The label for the doc item TON DNS in sidebar learn, linking to the doc learn/services/dns"
  },
  "sidebar.learn.doc.TON Sites, WWW, and Proxy": {
    "message": "TON Sites, WWW, and Proxy",
    "description": "The label for the doc item TON Sites, WWW, and Proxy in sidebar learn, linking to the doc learn/services/sites-www-proxy"
  },
  "sidebar.develop.category.Develop Smart Contracts": {
    "message": "Develop Smart Contracts",
    "description": "The label for category Develop Smart Contracts in sidebar develop"
  },
  "sidebar.develop.category.Environment": {
    "message": "Environment",
    "description": "The label for category Environment in sidebar develop"
  },
  "sidebar.develop.category.Choose Your SDK": {
    "message": "Choose Your SDK",
    "description": "The label for category Choose Your SDK in sidebar develop"
  },
  "sidebar.develop.category.Testing & Debugging": {
    "message": "Testing & Debugging",
    "description": "The label for category Testing & Debugging in sidebar develop"
  },
  "sidebar.develop.category.Deploying Contract": {
    "message": "Deploying Contract",
    "description": "The label for category Deploying Contract in sidebar develop"
  },
  "sidebar.develop.category.Best Practices": {
    "message": "Best Practices",
    "description": "The label for category Best Practices in sidebar develop"
  },
  "sidebar.develop.category.Develop dApps & Bots": {
    "message": "Develop dApps & Bots",
    "description": "The label for category Develop dApps & Bots in sidebar develop"
  },
  "sidebar.develop.category.API Types": {
    "message": "API Types",
    "description": "The label for category API Types in sidebar develop"
  },
  "sidebar.develop.category.DeFi Development": {
    "message": "DeFi Development",
    "description": "The label for category DeFi Development in sidebar develop"
  },
  "sidebar.develop.category.Telegram bots": {
    "message": "Telegram bots",
    "description": "The label for category Telegram bots in sidebar develop"
  },
  "sidebar.develop.category.FunC language": {
    "message": "FunC language",
    "description": "The label for category FunC language in sidebar develop"
  },
  "sidebar.develop.category.Documentation": {
    "message": "Documentation",
    "description": "The label for category Documentation in sidebar develop"
  },
  "sidebar.develop.category.Network Configs": {
    "message": "Network Configs",
    "description": "The label for category Network Configs in sidebar develop"
  },
  "sidebar.develop.category.Low Level Internals": {
    "message": "Low Level Internals",
    "description": "The label for category Low Level Internals in sidebar develop"
  },
  "sidebar.develop.category.Compile from Sources": {
    "message": "Compile from Sources",
    "description": "The label for category Compile from Sources in sidebar develop"
  },
  "sidebar.develop.link.TON Hello World": {
    "message": "TON Hello World",
    "description": "The label for link TON Hello World in sidebar develop, linking to https://blog.ton.org/step-by-step-guide-for-writing-your-first-smart-contract-in-func"
  },
  "sidebar.develop.link.Using tonstarter-contracts": {
    "message": "Using tonstarter-contracts",
    "description": "The label for link Using tonstarter-contracts in sidebar develop, linking to https://github.com/ton-defi-org/tonstarter-contracts"
  },
  "sidebar.develop.link.Using Online IDE": {
    "message": "Using Online IDE",
    "description": "The label for link Using Online IDE in sidebar develop, linking to https://glitch.com/edit/#!/remix/clone-from-repo?&REPO_URL=https%3A%2F%2Fgithub.com%2Fton-defi-org%2Ftonstarter-contracts.git"
  },
  "sidebar.develop.link.Using toncli": {
    "message": "Using toncli",
    "description": "The label for link Using toncli in sidebar develop, linking to https://github.com/disintar/toncli"
  },
  "sidebar.develop.link.Coming from Solidity": {
    "message": "Coming from Solidity",
    "description": "The label for link Coming from Solidity in sidebar develop, linking to /learn/introduction#ethereum-to-ton"
  },
  "sidebar.develop.link.How to shard your TON smart contract and why": {
    "message": "How to shard your TON smart contract and why",
    "description": "The label for link How to shard your TON smart contract and why in sidebar develop, linking to https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons"
  },
  "sidebar.develop.link.TON Concepts": {
    "message": "TON Concepts",
    "description": "The label for link TON Concepts in sidebar develop, linking to /learn/introduction"
  },
  "sidebar.develop.link.TON Services": {
    "message": "TON Services",
    "description": "The label for link TON Services in sidebar develop, linking to /learn/services/payments"
  },
  "sidebar.develop.link.TON Whitepapers": {
    "message": "TON Whitepapers",
    "description": "The label for link TON Whitepapers in sidebar develop, linking to /learn/docs"
  },
  "sidebar.develop.link.Mainnet config": {
    "message": "Mainnet config",
    "description": "The label for link Mainnet config in sidebar develop, linking to https://ton.org/global-config.json"
  },
  "sidebar.develop.link.Testnet config": {
    "message": "Testnet config",
    "description": "The label for link Testnet config in sidebar develop, linking to https://ton.org/testnet-global.config.json"
  },
  "sidebar.develop.doc.Compilation Instructions": {
    "message": "Compilation Instructions",
    "description": "The label for the doc item Compilation Instructions in sidebar develop, linking to the doc develop/howto/compile"
  },
  "sidebar.develop.doc.Instructions for low-memory machines": {
    "message": "Instructions for low-memory machines",
    "description": "The label for the doc item Instructions for low-memory machines in sidebar develop, linking to the doc develop/howto/compile-swap"
  },
  "sidebar.participate.category.Setup Your Wallet": {
    "message": "Setup Your Wallet",
    "description": "The label for category Setup Your Wallet in sidebar participate"
  },
  "sidebar.participate.category.Run a Node": {
    "message": "Run a Node",
    "description": "The label for category Run a Node in sidebar participate"
  },
  "sidebar.participate.category.Use TON Proxy": {
    "message": "Use TON Proxy",
    "description": "The label for category Use TON Proxy in sidebar participate"
  },
  "sidebar.participate.link.Wallet Contract Versions": {
    "message": "Wallet Contract Versions",
    "description": "The label for link Wallet Contract Versions in sidebar participate, linking to https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md"
  },
  "sidebar.participate.link.Run a Validator Node": {
    "message": "Run a Validator Node",
    "description": "The label for link Run a Validator Node in sidebar participate, linking to https://ton.org/validator"
  },
  "sidebar.participate.link.Standards Discussion (TEPs)": {
    "message": "Standards Discussion (TEPs)",
    "description": "The label for link Standards Discussion (TEPs) in sidebar participate, linking to https://github.com/ton-blockchain/TEPs"
  },
  "sidebar.participate.link.Ask a Question about TON": {
    "message": "Ask a Question about TON",
    "description": "The label for link Ask a Question about TON in sidebar participate, linking to https://answers.ton.org/"
  },
  "sidebar.participate.doc.Use Cross-chain Bridges": {
    "message": "Use Cross-chain Bridges",
    "description": "The label for the doc item Use Cross-chain Bridges in sidebar participate, linking to the doc participate/crosschain-bridges"
  },
  "sidebar.participate.doc.Stake with Nominator Pools": {
    "message": "Stake with Nominator Pools",
    "description": "The label for the doc item Stake with Nominator Pools in sidebar participate, linking to the doc participate/nominators"
  },
  "sidebar.contribute.category.Become a Contributor": {
    "message": "Become a Contributor",
    "description": "The label for category Become a Contributor in sidebar contribute"
  },
  "sidebar.contribute.category.Hacktoberfest 2022": {
    "message": "Hacktoberfest 2022",
    "description": "The label for category Hacktoberfest 2022 in sidebar contribute"
  },
  "sidebar.contribute.category.Archive": {
    "message": "아카이브",
    "description": "The label for category Archive in sidebar contribute"
  },
  "sidebar.contribute.category.Common Rules": {
    "message": "일반 규칙",
    "description": "The label for category Common Rules in sidebar contribute"
  },
  "sidebar.contribute.category.Documentation": {
    "message": "문서",
    "description": "The label for category Documentation in sidebar contribute"
  },
  "sidebar.contribute.category.Localization Program": {
    "message": "현지화 프로그램",
    "description": "The label for category Localization Program in sidebar contribute"
  },
  "sidebar.contribute.category.Tutorials": {
    "message": "튜토리얼",
    "description": "The label for category Tutorials in sidebar contribute"
  },
  "sidebar.contribute.doc.How It Works": {
    "message": "작동 원리",
    "description": "The label for the doc item How It Works in sidebar contribute, linking to the doc contribute/localization-program/how-it-works"
  },
  "sidebar.contribute.doc.How To Contribute": {
    "message": "기여 방법",
    "description": "The label for the doc item How To Contribute in sidebar contribute, linking to the doc contribute/localization-program/how-to-contribute"
  },
  "sidebar.contribute.doc.Overview": {
    "message": "개요",
    "description": "The label for the doc item Overview in sidebar contribute, linking to the doc contribute/localization-program/overview"
  },
  "sidebar.contribute.doc.Translation Style Guide": {
    "message": "번역 스타일 가이드",
    "description": "The label for the doc item Translation Style Guide in sidebar contribute, linking to the doc contribute/localization-program/translation-style-guide"
  },
  "sidebar.develop.category.APIs and SDKs": {
    "message": "APIs 및 SDKs",
    "description": "The label for category APIs and SDKs in sidebar develop"
  },
  "sidebar.develop.category.Advanced": {
    "message": "고급",
    "description": "The label for category Advanced in sidebar develop"
  },
  "sidebar.develop.category.Archived": {
    "message": "보관됨",
    "description": "The label for category Archived in sidebar develop"
  },
  "sidebar.develop.category.Blockchain Fundamentals": {
    "message": "블록체인 기초",
    "description": "The label for category Blockchain Fundamentals in sidebar develop"
  },
  "sidebar.develop.category.Business": {
    "message": "비즈니스",
    "description": "The label for category Business in sidebar develop"
  },
  "sidebar.develop.category.Core Contracts": {
    "message": "코어 계약",
    "description": "The label for category Core Contracts in sidebar develop"
  },
  "sidebar.develop.category.DApps Development": {
    "message": "DApps 개발",
    "description": "The label for category DApps Development in sidebar develop"
  },
  "sidebar.develop.category.Data Formats": {
    "message": "데이터 형식",
    "description": "The label for category Data Formats in sidebar develop"
  },
  "sidebar.develop.category.Development Guidelines": {
    "message": "개발 가이드라인",
    "description": "The label for category Development Guidelines in sidebar develop"
  },
  "sidebar.develop.category.Fift language": {
    "message": "Fift 언어",
    "description": "The label for category Fift language in sidebar develop"
  },
  "sidebar.develop.category.Frameworks": {
    "message": "프레임워크",
    "description": "The label for category Frameworks in sidebar develop"
  },
  "sidebar.develop.category.Getting Started": {
    "message": "시작하기",
    "description": "The label for category Getting Started in sidebar develop"
  },
  "sidebar.develop.category.Guidelines": {
    "message": "가이드라인",
    "description": "The label for category Guidelines in sidebar develop"
  },
  "sidebar.develop.category.Integrate with TON": {
    "message": "TON과 통합",
    "description": "The label for category Integrate with TON in sidebar develop"
  },
  "sidebar.develop.category.Message Management": {
    "message": "메시지 관리",
    "description": "The label for category Message Management in sidebar develop"
  },
  "sidebar.develop.category.Network Configurations": {
    "message": "네트워크 구성",
    "description": "The label for category Network Configurations in sidebar develop"
  },
  "sidebar.develop.category.Network Protocols": {
    "message": "네트워크 프로토콜",
    "description": "The label for category Network Protocols in sidebar develop"
  },
  "sidebar.develop.category.Security Measures": {
    "message": "보안 조치",
    "description": "The label for category Security Measures in sidebar develop"
  },
  "sidebar.develop.category.Smart Contracts": {
    "message": "스마트 계약",
    "description": "The label for category Smart Contracts in sidebar develop"
  },
  "sidebar.develop.category.TL-B": {
    "message": "TL-B",
    "description": "The label for category TL-B in sidebar develop"
  },
  "sidebar.develop.category.TON Hello World series": {
    "message": "TON Hello World 시리즈",
    "description": "The label for category TON Hello World series in sidebar develop"
  },
  "sidebar.develop.category.TON Virtual Machine (TVM)": {
    "message": "TON 가상 머신(TVM)",
    "description": "The label for category TON Virtual Machine (TVM) in sidebar develop"
  },
  "sidebar.develop.category.Telegram Bot Examples": {
    "message": "Telegram 봇 예제",
    "description": "The label for category Telegram Bot Examples in sidebar develop"
  },
  "sidebar.develop.category.Telegram Mini Apps": {
    "message": "Telegram 미니 앱",
    "description": "The label for category Telegram Mini Apps in sidebar develop"
  },
  "sidebar.develop.category.Testing and Debugging": {
    "message": "테스트 및 디버깅",
    "description": "The label for category Testing and Debugging in sidebar develop"
  },
  "sidebar.develop.category.Transaction Fees": {
    "message": "거래 수수료",
    "description": "The label for category Transaction Fees in sidebar develop"
  },
  "sidebar.develop.category.Tutorials & Examples": {
    "message": "튜토리얼 및 예제",
    "description": "The label for category Tutorials & Examples in sidebar develop"
  },
  "sidebar.develop.doc.Get Started with TON": {
    "message": "TON 시작하기",
    "description": "The label for the doc item Get Started with TON in sidebar develop, linking to the doc develop/get-started-with-ton"
  },
  "sidebar.develop.doc.HTML/JS Apps": {
    "message": "HTML/JS 애플리케이션",
    "description": "The label for the doc item HTML/JS Apps in sidebar develop, linking to the doc develop/dapps/ton-connect/web"
  },
  "sidebar.develop.doc.Mint Your First Token": {
    "message": "첫 토큰 발행하기",
    "description": "The label for the doc item Mint Your First Token in sidebar develop, linking to the doc develop/dapps/tutorials/jetton-minter"
  },
  "sidebar.develop.doc.NFT Minting Guide": {
    "message": "NFT 발행 가이드",
    "description": "The label for the doc item NFT Minting Guide in sidebar develop, linking to the doc develop/dapps/tutorials/collection-minting"
  },
  "sidebar.develop.doc.NFT Use Cases in TON": {
    "message": "TON의 NFT 사용 사례",
    "description": "The label for the doc item NFT Use Cases in TON in sidebar develop, linking to the doc participate/nft"
  },
  "sidebar.develop.doc.React Apps": {
    "message": "React 애플리케이션",
    "description": "The label for the doc item React Apps in sidebar develop, linking to the doc develop/dapps/ton-connect/react"
  },
  "sidebar.develop.doc.TON Connect Protocol": {
    "message": "TON Connect 프로토콜",
    "description": "The label for the doc item TON Connect Protocol in sidebar develop, linking to the doc develop/dapps/ton-connect/protocol/README"
  },
  "sidebar.develop.doc.Telegram Bots JS": {
    "message": "Telegram 봇(JS)",
    "description": "The label for the doc item Telegram Bots JS in sidebar develop, linking to the doc develop/dapps/ton-connect/tg-bot-integration"
  },
  "sidebar.develop.doc.Telegram Bots Python": {
    "message": "Telegram 봇(Python)",
    "description": "The label for the doc item Telegram Bots Python in sidebar develop, linking to the doc develop/dapps/ton-connect/tg-bot-integration-py"
  },
  "sidebar.develop.doc.Web3 Game Example": {
    "message": "Web3 게임 예제",
    "description": "The label for the doc item Web3 Game Example in sidebar develop, linking to the doc develop/dapps/tutorials/building-web3-game"
  },
  "sidebar.develop.doc.Zero-Knowledge Proofs": {
    "message": "영지식 증명",
    "description": "The label for the doc item Zero-Knowledge Proofs in sidebar develop, linking to the doc develop/dapps/tutorials/simple-zk-on-ton"
  },
  "sidebar.develop.link.Building first web client": {
    "message": "첫 번째 웹 클라이언트 구축",
    "description": "The label for link Building first web client in sidebar develop, linking to https://helloworld.tonstudio.io/03-client"
  },
  "sidebar.develop.link.TVM Instructions": {
    "message": "TVM 지침",
    "description": "The label for link TVM Instructions in sidebar develop, linking to /learn/tvm-instructions/instructions"
  },
  "sidebar.develop.link.Testing your smart contract": {
    "message": "스마트 계약 테스트",
    "description": "The label for link Testing your smart contract in sidebar develop, linking to https://helloworld.tonstudio.io/04-testing"
  },
  "sidebar.develop.link.Wallets List": {
    "message": "지갑 목록",
    "description": "The label for link Wallets List in sidebar develop, linking to https://github.com/ton-blockchain/wallets-list"
  },
  "sidebar.develop.link.Working with your wallet": {
    "message": "지갑 사용하기",
    "description": "The label for link Working with your wallet in sidebar develop, linking to https://helloworld.tonstudio.io/01-wallet"
  },
  "sidebar.develop.link.Writing first smart contract": {
    "message": "첫 번째 스마트 계약 작성",
    "description": "The label for link Writing first smart contract in sidebar develop, linking to https://helloworld.tonstudio.io/02-contract"
  },
  "sidebar.participate.category.Blockchain Nodes": {
    "message": "블록체인 노드",
    "description": "The label for category Blockchain Nodes in sidebar participate"
  },
  "sidebar.participate.category.Cross-chain Bridges": {
    "message": "크로스체인 브리지",
    "description": "The label for category Cross-chain Bridges in sidebar participate"
  },
  "sidebar.participate.category.Network Infrastructure": {
    "message": "네트워크 인프라",
    "description": "The label for category Network Infrastructure in sidebar participate"
  },
  "sidebar.participate.category.TON DNS": {
    "message": "TON DNS",
    "description": "The label for category TON DNS in sidebar participate"
  },
  "sidebar.participate.category.TON Proxy & Sites": {
    "message": "TON 프록시 및 사이트",
    "description": "The label for category TON Proxy & Sites in sidebar participate"
  },
  "sidebar.participate.category.TON Storage": {
    "message": "TON 스토리지",
    "description": "The label for category TON Storage in sidebar participate"
  },
  "sidebar.participate.category.Wallets in TON": {
    "message": "TON 지갑",
    "description": "The label for category Wallets in TON in sidebar participate"
  },
  "sidebar.participate.doc.Bridges Addresses": {
    "message": "브리지 주소",
    "description": "The label for the doc item Bridges Addresses in sidebar participate, linking to the doc participate/crosschain/bridge-addresses"
  },
  "sidebar.participate.doc.Overview": {
    "message": "개요",
    "description": "The label for the doc item Overview in sidebar participate, linking to the doc participate/crosschain/overview"
  }
}



================================================
FILE: i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/README.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/README.md
================================================
# 기여 방법

## 기여할 영역 식별

TON Docs에 기여할 수 있는 영역을 식별하는 방법은 여러 가지가 있습니다:

- Telegram의 [TON Docs Club 채팅](https://t.me/+c-0fVO4XHQsyOWM8) 에 참여하여 유지 관리자에게서 최신 작업을 받습니다.
- 구체적인 기여 사항이 있지만 확신이 서지 않는 경우, 직접 [Docs 유지 관리자](/contribute/maintainers) 에게 연락하여 해당 기여가 적절한지 확인하세요.
- [TON Developers 채팅](https://t.me/tondev_eng) 채팅에서 자주 묻는 질문에 익숙해지세요.
- GitHub 리포지토리에서 [issues](https://github.com/ton-community/ton-docs/issues)를 읽어보세요.
- 사용 가능한 [footsteps](https://github.com/ton-society/ton-footsteps/issues?q=documentation) 문서를 참조하세요.

## 요약

- TON Docs에 추가하거나 수정해야 할 사항이 있으면, main 브랜치를 대상으로 풀 리퀘스트를 생성하세요.
- 문서 팀에서 풀 리퀘스트를 검토하거나 필요에 따라 연락을 드릴 것입니다.
- Repository: https://github.com/ton-community/ton-docs

## 개발

### 온라인 원클릭 기여 설정

Gitpod(무료 온라인 VS code와 유사한 IDE) 를 사용하여 기여할 수 있습니다. 한 번의 클릭으로 워크스페이스가 실행되며 자동으로 다음 작업이 이루어집니다:

[![깃팟에서 열기](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/ton-community/ton-docs)

### 코드 규칙

- **가장 중요한 것**: 주변을 둘러보세요. 프로젝트의 전체 스타일을 맞추세요. 여기에는 서식 지정, 파일 이름 지정, 코드에서 객체 이름 지정, 문서에서 항목 이름 지정 등이 포함됩니다.
- **문서용**: 문서를 편집할 때는 줄을 80자로 줄 바꿈하지 말고 소프트 줄 바꿈을 사용하도록 편집기를 구성하세요.

스타일에 대해 너무 걱정하지 마세요. 유지 관리자가 코드 검토 시 도움을 줄 것입니다.

### 풀 리퀘스트

코드를 업스트림으로 다시 기여하기 위해 풀 리퀘스트를 열기로 결정했습니다. 많은 노력을 기울인 것을 감사히 생각합니다. 우리는 최선을 다해 여러분과 협력하여 풀 리퀘스트를 검토하겠습니다.

풀 리퀘스트를 제출할 때는 다음 사항을 확인하세요:

1. **풀 리퀘스트를 작게 유지하세요**. 풀리퀘스트가 작을수록(~300줄 차이) 검토하기 쉽고 병합될 가능성이 높습니다. 풀 리퀘스트가 한 가지 일만 하는지 확인하고, 그렇지 않으면 분할하세요.
2. **설명적인 제목을 사용하세요**. 커밋 메시지 스타일을 따르는 것이 좋습니다.
3. **변경 사항을 테스트하세요**. 풀 리퀘스트 설명에 테스트 계획을 작성하세요.

모든 풀 리퀘스트는 `main` 브랜치에 대해 열어야 합니다.

## 그 다음은 무엇인가요?

톤 문서 팀은 풀 리퀘스트를 모니터링할 것입니다. 위의 가이드를 따라 풀 리쉐스트가 일관성율 유지할 수 있도록 도와주세요.



================================================
FILE: i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/archive/hacktoberfest-2022/README.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/archive/hacktoberfest-2022/README.mdx
================================================
import Button from '@site/src/components/button'

# Hacktoberfest란 무엇인가요?

<div style={{ textAlign: 'center', margin: '50px 0' }}>
  <img alt="tlb structure"
       src="/docs/img/docs/hacktoberfest.webp"
       width="100%" />
</div>

[Hacktoberfest](https://hacktoberfest.digitalocean.com/)는 _오픈소스 프로젝트_와 그 _관리자_, 전체 _기여자_ 커뮤니티를 위한 한 달간의 축제입니다. 매년 10월, 오픈 소스 유지 관리자는 새로운 기여자에게 첫 풀 리퀘스트를 작성하는 과정을 안내하며 개발자에게 특별한 관심을 기울입니다.

TON 커뮤니티에게는 생태계 성장을 함께 도울 시간입니다. 전 세계와 함께 **Hack-TON-berfest** 파티에 참여하여 _올해의 #1 오픈 소스 생태계_가 되어봅시다!

## 참여 방법

2022년 Hacktoberfest 규칙은 다음과 같습니다:

- **Hacktoberfest는 누구나 참여할 수 있습니다**!
- 9월 26일부터 10월 31일까지 언제든지 등록할 수 있습니다.
- 풀 리퀘스트는 모든 GITHUB 또는 GITLAB 프로젝트에서 만들 수 있습니다:
  - [TON 생태계 프로젝트 목록](/hacktonberfest)
  - [GitHub 프로젝트 목록](https://github.com/topics/hacktoberfest)
- 10월 1일부터 10월 31일 사이에 **4**개의 풀/머지 리퀘스트가 승인되어야 합니다.
- Hacktoberfest를 완료한 선착순 40,000 명의 참가자 (유지 관리자 및 기여자) 는 두 가지 상품 중 하나를 선택할 수 있습니다: 그들의 명예를 기리는 나무 심기 또는 Hacktoberfest 2022 티셔츠. (Hacktoberfest 커뮤니티 제공)
- TON 생태계 프로젝트의 모든 참여자 (유지 관리자 및 기여자) 는 [**한정판 Hack-TON-berfest NFT**](#what-the-rewards) 를 받게 됩니다. _(TON Foundation 제공)_

TON의 모든 사람들에게는 전체 생태계의 성장을 주도하고 TON Foundation의 멋진 보상을 받을 수 있는 기회입니다. 함께 해봅시다!

## 보상은 무엇인가요?

TON 생태계의 오픈 소스 프로젝트에 기여하도록 커뮤니티를 동기부여하기 위해, TON Foundation에서 특별한 보상을 받을 수 있습니다. 모든 참가자는 참여의 증거로 한정판 Hack-TON-berfest NFT 업적을 받게 됩니다:

<div style={{width: '100%', textAlign:'center', margin: '0 auto'}}>
  <video width="300" style={{width: '100%', borderRadius:'10pt', margin:'15pt auto'}} muted={true} autoPlay={true} loop={true}>
    <source src="/docs/files/nft-sm.mp4" type="video/mp4" />

브라우저가 동영상 태그를 지원하지 않습니다.

  </video>
</div>

:::info 중요!
TON Foundation은 11월에 [@toncontests_bot](https://t.me/toncontests_bot) 에 제출된 모든 지갑 주소로 컬렉션을 발행할 예정입니다. 이는 모든 기여 결과를 계산하고 검증한 후에 이루어질 것입니다.
:::

이벤트에 참여할 수 있는 시간은 충분합니다. 전 세계 수천 명의 기여자들과 함께 미래의 탈중앙화된 인터넷을 구축해 보세요!

<Button href="/contribute/hacktoberfest/as-contributor"
     colorType="primary" sizeType={'lg'}>

기여자가 되고 싶습니다.

</Button>

<Button href="/contribute/hacktoberfest/as-maintainer" colorType={'secondary'} sizeType={'lg'}>

저는 관리자입니다

</Button>



================================================
FILE: i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/archive/hacktoberfest-2022/as-contributor.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/archive/hacktoberfest-2022/as-contributor.md
================================================
# 기여자로 참여하기

한정된 *Hack-TON-berfest NFT*를 받는 기여자가 되려면, [TON 지갑](https://ton.org/wallets)을 설정하고 GitHub 계정을 인증하시기 바랍니다.

## 여정을 시작하세요

1. [ton.org/wallets](https://ton.org/wallets) 페이지에서 지갑을 설정합니다. ([TON Wallet extension](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd)을 예로 들 수 있습니다.)
2. 텔레그램의 [@toncontests_bot](https://t.me/toncontests_bot)에 지갑 주소를 알려주세요.
3. 동일한 봇에서 GitHub 계정을 인증합니다.

이 단계를 마치면 [한정된 Hack-TON-berfest NFT](/contribute/hacktoberfest/#what-the-rewards) 를 받을 준비가 완료됩니다.

클럽에 오신 것을 환영합니다. 이제 시작에 불과합니다!

## 오픈소스에 기여하는 것이 처음이신가요?

Hacktoberfest는 처음으로 오픈 소스 기여를 시작하기에 좋은 장소입니다. 시작하는 데 도움이 될 다양한 스트림, 게시물, 가이드, 그리고 토론이 준비되어 있습니다. 이번 달에 여정을 시작하는 많은 사람들과 함께 하게 될 것입니다!

- [초보자를 위한 Hacktoberfest 기본 정보](https://hacktoberfest.com/participation/#beginner-resources)
- [첫 기여 가이드](https://dev.to/codesandboxio/how-to-make-your-first-open-source-contribution-2oim) 작성자: Ceora Ford
- [첫 번째 기여를 위한 워크플로우 연습](https://github.com/firstcontributions/first-contributions)
- [오픈소스 기여의 가면 증후군 극복하기](https://blackgirlbytes.dev/conquering-the-fear-of-contributing-to-open-source)

## TON에 어떻게 기여할 수 있나요?

TON 생태계에는 여러 조직과 저장소가 있습니다:

<span className="DocsMarkdown--button-group-content">
  <a href="/hacktonberfest"
     className="Button Button-is-docs-primary">
    기여자를 모집하는 프로젝트 목록
  </a>
</span>



================================================
FILE: i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/archive/hacktoberfest-2022/as-maintainer.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/archive/hacktoberfest-2022/as-maintainer.md
================================================
# 유지 관리자로 참여하기

Hacktoberfest 이벤트는 커뮤니티의 지원을 받기에 가장 좋은 시기입니다!

여러분의 리포지토리가 TON 생태계와 관련이 있다면 많은 기여자들이 관심을 가질 것입니다. 그들이 여러분의 프로젝트에 바로 뛰어들 수 있도록 도와주세요!

## 준비하기

기여자를 적절히 관리하려면 리포지토리가 잘 준비되어 있어야 합니다.

다음 모범 사례를 따라 프로젝트의 기여를 준비하세요:

1. 리포지토리에 'hacktoberfest' 주제를 추가하여 **Hacktoberfest에 OPT-IN** 하고 기여를 받고 싶다는 것을 나타내세요.
2. GitHub 또는 GitLab 프로젝트에서 기여자의 도움을 받고자 하는 이슈에 "hacktoberfest" 라벨을 적용하세요.
3. [신규 오픈소스 관리자를 위한 필수 팁](https://blog.ton.org/essential-tips-for-new-open-source-maintainers)을 읽고 활용하세요.
4. 유효한 pull/merge 요청을 받아들일 준비를 하세요. 이를 위해 병합하거나 전체 승인 리뷰를 남기거나 "hacktoberfest-accepted" 라벨을 추가하세요.
5. 스팸 요청은 "spam"으로 라벨을 붙여 거부하고, 기타 유효하지 않은 기여는 "invalid"로 라벨을 붙이거나 닫으세요.

다음은 전체 리포지토리의 예입니다: [ton-community/ton-compiler](https://github.com/ton-community/ton-compiler)

그런 다음 리포지토리를 목록에 자유롭게 추가하세요.

## 유지 관리자를 위한 보상

TON 생태계의 리포지토리 관리자는 두 가지 유형의 보상을 받을 수 있습니다:

1. [Hacktoberfest Reward Kit](https://hacktoberfest.com/participation/#maintainers)(*유지 관리자를 위한 보상 참조*)
2. [한정판 Hacktoberfest NFT](/contribute/hacktoberfest/#what-the-rewards) (*지갑주소를 [@toncontests_bot](https://t.me/toncontests_bot)* 에 등록하세요)

## 가입하고 등록하는 방법은 무엇인가요?

Hack-TON 버페스트에 참여하려면 이 링크를 클릭하세요:

<span className="DocsMarkdown--button-group-content">
  <a href="https://airtable.com/shrgXIgZdBKKX64NL"
     className="Button Button-is-docs-primary">
    리포지토리를 목록에 추가하기
  </a>
</span>



================================================
FILE: i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/contribution-rules.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/contribution-rules.md
================================================
# 기여 지침

docs.ton.org 페이지에 기여하기 전에 원활한 경험을 보장하기 위해 다음의 일반적이고 중요한 요구 사항 목록을 검토하세요.

## 명명 규칙

- TON 문서에서 _THE_의 올바른 사용을 보장하는 것이 중요합니다. *TON Blockchain* 과 *TON Ecosystem* 은 대문자로 쓰이는 용어이므로 _THE_를 사용하지 않습니다.
- *TON* 을 일반 명사와 함께 쓸 때, 영어 문법에 따라 *THE* 가 필요하면 사용합니다. 예를 들어: "*The* TON Connect protocol is a..."

:::info
TON Blockchain...

TON Ecosystem...

The TON Connect protocol...
:::

실제 TON 브랜드 자산은 [여기](https://ton.org/en/brand-assets)를 참조하세요.

## 문서 참조

TON 문서의 모든 페이지는 반드시 'See Also' 섹션으로 마무리해야 합니다. 현재 페이지와 관련이 있다고 생각하는 페이지를 추가 설명 없이 그곳에 배치하세요.

:::info

```
## See Also
* [TON Contribution Guidelines](/contribute/contribution-rules)
* [Tutorial Styling Guidelines](/contribute/tutorials/guidelines)
```

:::

## 유용한 영어 자료

TON Ecosystem은 전 세계를 위해 구축되고 있으므로, 지구상의 모든 사람들이 이해할 수 있도록 하는 것이 중요합니다. 여기에서는 영어 실력을 향상시키고자 하는 주니어 기술 작가들에게 유용한 자료를 제공합니다.

- [복수 명사](https://www.grammarly.com/blog/plural-nouns/)
- [관사: A와 An](https://owl.purdue.edu/owl/general_writing/grammar/articles_a_versus_an.html)

## 더 보기

- [TON 기여 지침](/contribute/contribution-rules)
- [튜토리얼 스타일링 지침](/contribute/tutorials/guidelines)



================================================
FILE: i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/docs/guidelines.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/docs/guidelines.md
================================================
# 공통 문서 원칙

최적의 사용자 경험과 명확성을 위해 새 콘텐츠를 작성할 때 docs.ton.org의 모든 문서에 적용하려는 하는 일반적이고 중요한 요구 사항 목록을 염두에 두시기 바랍니다.

## 전문가를 위한 문서 작성

문서 페이지는 주로 문서화 목적을 위한 것이며 튜토리얼이 아니므로, 텍스트에서 개인적인 예시나 비유의 사용을 최소화하는 것이 중요합니다. 전문가는 물론 비전문가에게도 유용한 정보를 제공하면서 적합한 내용을 담는 것이 중요합니다.

## 일관된 형식 사용

독자가 문서를 쉽게 탐색할 수 있도록 문서 전체에 일관된 형식을 사용하는 것이 중요합니다. 제목, 부제목, 글머리 기호, 번호 목록 등을 사용하여 텍스트를 구분하고 읽기 쉽게 만드십시오.

## 특별 섹션에 예제 제공

예제는 독자가 내용을 더 잘 이해하고 적용할 수 있도록 도와줍니다. 문서 페이지를 작성할 때 여러 예제를 참조해야 한다면, '참고 자료'와 '더 보기' 섹션 바로 전에 '예제'라는 특별 섹션을 만드십시오. 문서 설명과 예제를 혼합하지 마십시오. 코드 스니펫, 스크린샷 또는 다이어그램을 사용하여 요점을 설명하고 문서를 더 흥미롭게 만드십시오.

## 최신 상태 유지

기술 문서는 기술이나 소프트웨어 업데이트의 변화로 인해 금방 오래될 수 있습니다. 문서를 정기적으로 검토하고 업데이트하여 현재 버전의 소프트웨어와 정확하고 관련성이 있는지 확인하는 것이 중요합니다.

## 피드백 받기

문서를 게시하기 전에 다른 기여자나 사용자로부터 피드백을 받는 것이 좋습니다. 이를 통해 혼란스럽거나 불분명한 부분을 파악하여 문서가 공개되기 전에 개선할 수 있습니다.



================================================
FILE: i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/docs/schemes-guidelines.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/docs/schemes-guidelines.mdx
================================================
import ConceptImage from '@site/src/components/conceptImage';
import ThemedImage from '@theme/ThemedImage';

# 그래픽 설명 가이드라인

문서의 일관성을 유지하는 것은 매우 중요하며, 이를 위해 스마트 컨트랙트의 프로세스를 시각화하기 위한 특정 표준이 개발되었습니다.

## 그래픽 설명 표기법

### 메시지 처리 그래프

메시지 처리를 설명하려면 트랜잭션과 메시지에 대한 레이블이 있는 스마트 컨트랙트 그래프와 유사한 그래픽 표현을 사용하는 것이 좋습니다.

트랜잭션 순서가 중요하지 않은 경우 레이블을 생략할 수 있습니다. 이는 다이어그램을 단순화하여 메시지 및 계약과 관련된 세부 정보를 더 쉽게 읽고 이해할 수 있도록 합니다.

#### 주석 기본 요소

| 그림                                                                                                         | 설명                                |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------- |
| ![](/img/docs/scheme-templates/message-processing-graphs/circle_for_smart_contract.svg?raw=true)           | 원형 - 스마트 컨트랙트 엔티티                 |
| ![](/img/docs/scheme-templates/message-processing-graphs/rectangle_for_regular_message.svg?raw=true)       | 직사각형 - 메시지 엔티티                    |
| ![](/img/docs/scheme-templates/message-processing-graphs/dashed_rectgl_for_optional_message.svg?raw=true)  | 대시 직사각형 - 선택적 메시지 엔티티             |
| ![](/img/docs/scheme-templates/message-processing-graphs/line_for_transaction.svg?raw=true)                | 트랜잭션(숫자 선택 사항) |
| ![](/img/docs/scheme-templates/message-processing-graphs/person_figure_for_actor.svg?raw=true)             | 배우                                |

- 다양하고 밝은 색상의 사용을 피하십시오.
- 점선 테두리와 같은 도형의 변형을 사용하십시오.
- 더 나은 이해를 위해 서로 다른 트랜잭션을 뚜렷한 선 스타일 (실선 및 점선) 로 표시할 수 있습니다.

#### 메시지 처리 예제

<br></br>
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/message-delivery/message_delivery_2.svg?raw=true',
    dark: '/img/docs/message-delivery/message_delivery_2.svg?raw=true',
  }}
/>
<br></br>

Visio [message-processing.vsdx](/static/schemes-visio/message-processing.vsdx)에서 직접 참조를 학습하세요.

### 형식 및 색상

#### 폰트

- 다이어그램 내의 모든 텍스트에 **Inter** 폰트 패밀리를 사용합니다.

#### 색상 - 라이트 모드

- 연필 손그림 (기본 테마)

#### 색상 - 다크 모드

- 폰트 `#e3e3e3`
- 배경 `#232328`
- 라이트 하이라이트 (화살표 및 구성표 테두리) `#058dd2`
- 다크 하이라이트 (화살표 및 구성표 테두리) `#0088cc`
- 내부 배경(중첩 블록용) `#333337`

#### 버전 관리 정책

- 다양한 기기에서 가독성을 보장하기 위해 문서의 다이어그램을 SVG 형식으로 설정하여 스키마에 맞게 구성하세요.
- 향후 수정이 용이하도록 원본 파일을 프로젝트의 Git 리포지토리에 "/static/visio" 디렉토리에 저장하세요.

### 시퀀스 다이어그램

2~3명의 액터 간의 복잡하고 반복적인 통신 체계의 경우, 시퀀스 다이어그램을 사용하는 것이 좋습니다. 메시지의 경우 일반적인 동기식 메시지 화살표 표기법을 사용합니다.

#### 예제

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/message-delivery/message_delivery_7.svg?raw=true',
    dark: '/img/docs/message-delivery/message_delivery_7.svg?raw=true',
  }}
/>
</div>
<br></br>

### 스키마 참조

- [message-processing.vsdx](/schemes-visio/message_processing.vsdx)



================================================
FILE: i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/maintainers.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/maintainers.md
================================================
# 유지 관리자

## 활동 팀

아래는 현재 TON Docs 팀의 구성원들을 알파벳 순으로 나열한 목록입니다.

### Alex Golev

TON Docs 유지 관리자이자 TON Foundation의 DevRel

- Telegram: [@alexgton](https://t.me/alexgton)
- Github: [Reveloper](https://github.com/Reveloper)

### Gusarich

Web3 개발자, [TON 개발자 커뮤니티](https://github.com/ton-community) 기여자, [TON Footsteps](https://github.com/ton-society/ton-footsteps) 및 TON Docs 유지 관리자

- Telegram: [@Gusarich](https://t.me/Gusarich)
- GitHub: [Gusarich](https://github.com/Gusarich)

### SwiftAdviser

TON Foundation의 개발자 온보딩 매니저

- Telegram: [@SwiftAdviser](https://t.me/SwiftAdviser)
- GitHub: [SwiftAdviser](https://github.com/SwiftAdviser)

## 감사 인사

TON Docs는 원래 [tolya-yanot](https://github.com/tolya-yanot)와 [EmelyanenkoK](https://github.com/EmelyanenkoK)에 의해 만들어졌습니다.

시간이 지나면서, TON Docs는 [수많은 외부 기여자](https://github.com/ton-community/ton-docs/graphs/contributors)의 지성과 헌신으로부터 혜택을 받았습니다. 각 기여자들에게 진심으로 감사드립니다.

그러나 특히 다음 개인들의 상당한 기여를 특별히 언급하고 싶습니다. 이들의 기여는 우리 문서의 품질과 깊이를 크게 향상시켰습니다:

- [akifoq](https://github.com/akifoq): 초기 기여
- [amnch1](https://github.com/amnch1): 수정 사항
- [aSpite](https://github.com/aSpite): 콘텐츠
- [awesome-doge](https://github.com/awesome-doge): 초기 기여
- [coalus](https://github.com/coalus): 콘텐츠
- [delovoyhomie](https://github.com/delovoyhomie): 콘텐츠
- [krau5](https://github.com/krau5): 개선
- [LevZed](https://github.com/LevZed): 콘텐츠
- [ProgramCrafter](https://github.com/ProgramCrafter): 콘텐츠
- [siandreev](https://github.com/siandreev): 콘텐츠
- [SpyCheese](https://github.com/SpyCheese): 초기 기여
- [Tal Kol](https://github.com/talkol): 초기 기여
- [TrueCarry](https://github.com/TrueCarry): 콘텐츠
- [xssnick](https://github.com/xssnick): 콘텐츠

TON Docs를 풍부하고 신뢰할 수 있는 자원으로 만드는 데 도움을 준 모든 기여자들에게 진심으로 감사드립니다.



================================================
FILE: i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/participate.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/participate.md
================================================
# 기여 가이드

여기에는 튜토리얼을 통해 TON 문서에 기여하는 단계별 가이드가 있습니다.

:::tip 기회
운이 좋으시네요! TON Ecosystem을 여기서 개선할 좋은 기회입니다.
:::

튜토리얼을 작성하기로 결정하면 우수한 자료에 대한 보상을 받을 수 있습니다:

- TON에 가장 가치 있는 기여를 한 사람에게 **특별 TON Bounty NFT** 제공
- 튜토리얼과 같은 승인된 고품질의 기여가 승인될 경우 **TON**으로 보상 지급

기여 과정에 어떻게 참여할 수 있는지 살펴보겠습니다.

## 작성할 내용 결정

설명하고자 하는 자료를 찾거나 작성합니다.

1. TON Docs GitHub에서 'tutorial' 라벨이 붙은 [이슈 목록](https://github.com/ton-community/ton-docs/issues) 을 확인합니다.
2. *또는* [튜토리얼 템플릿](https://github.com/ton-community/ton-docs/issues/new?assignees=\&labels=feature+%3Asparkles%3A%2Ccontent+%3Afountain_pen%3A\&template=suggest_tutorial.yaml\&title=Suggest+a+tutorial)을 사용하여 Ton Docs Github에 자신의 아이디어를 작성합니다.

## 보상을 받기 위한 문제 설명

기여에 대한 자금을 받기 위해 _ton-footstep_을 작성합니다.

1. [TON Bounties](https://github.com/ton-society/grants-and-bounties/blob/main/bounties/BOUNTIES_PROGRAM_GUIDELINES.md) 프로그램에 대해 더 자세히 알아보세요.
   1. [Improve TVM Instructions article](https://github.com/ton-society/grants-and-bounties/issues/361)를 예시로 사용하세요.
2. 참여하려면 [자신의 바운티](https://github.com/ton-society/grants-and-bounties/issues/new/choose)를 작성하고 승인을 기다립니다. [TON Bounties Creator Bot](https://t.me/footsteps_helper_bot)이 도움을 드릴 것입니다.
3. 'approved' 라벨을 받은 후 튜토리얼을 작성하기 시작합니다.

## 튜토리얼 작성

**준비**. 요청된 변경 사항을 최소화하고 시간을 절약하세요:

1. [튜토리얼 지침](/contribute/guidelines) 을 따르고 [샘플 튜토리얼 구조](/contribute/sample-tutorial) 에서 확인하세요.
2. 멋진 튜토리얼을 작성하려면 [좋은 튜토리얼의 원칙](/contribute/principles-of-a-good-tutorial)을 읽어보세요 :)
3. 소스에서 [첫 Jetton 채굴하기](/develop/dapps/tutorials/jetton-minter) 예시를 참고하세요.
4. **환경 설정**. 로컬에서 포크를 실행하거나 Gitpod을 사용하여 [튜토리얼](/contribute#online-one-click-contribution-setup) 을 확인하세요.
5. **튜토리얼 작성**. 환경을 사용하여 포크에서 튜토리얼이 어떻게 보이는지 확인하세요.
6. **풀 리퀘스트 생성**. PR을 공개하여 관리자로부터 피드백을 받아보세요.
7. 병합하세요!

## 보상 받기

1. TON Docs에 PR이 병합된 후, ton-footsteps 작업에 작성하세요.
2. [ton-bounty를 완료하는 방법](https://github.com/ton-society/grants-and-bounties/blob/main/bounties/BOUNTIES_PROGRAM_GUIDELINES.md#got-assigned-submit-a-questbook-proposal) 가이드를 따라 바운티를 완료하고 보상을 받으세요.
3. 작업에서 보상을 받을 지갑 주소를 요청할 것입니다.
4. 보상을 받으세요!



================================================
FILE: i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/tutorials/guidelines.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/tutorials/guidelines.md
================================================
# 튜토리얼 스타일 가이드라인

TON 문서를 위한 튜토리얼을 작성하기로 결정하셨나요?

기여자로 함께하게 되어 기쁩니다! 튜토리얼이 TON Docs의 기존 콘텐츠 스타일과 품질을 따르도록 하기 위해 아래 가이드라인을 검토해 주세요.

튜토리얼의 구조와 제목을 어떻게 사용해야 하는지 익숙해지는 데 시간을 할애하는 것이 중요합니다. 기존 튜토리얼을 읽어보고 [이전 Pull Requests](https://github.com/ton-community/ton-docs/pulls?q=is%3Apr+is%3A마감) 를 확인한 후에 자신의 튜토리얼을 제출해 주세요.

## 프로세스

:::info 중요
작성을 시작하기 전에 아래 가이드라인을 읽어보세요! 검토 프로세스를 훨씬 빠르게 진행할 수 있는 표준화와 품질 수준을 보장하는 데 도움이 될 것입니다.
:::

또한 저희가 제공한 [**샘플 튜토리얼 구조**](/contribute/tutorials/sample-tutorial)를 참고하시기 바랍니다.

1. 시작하려면 GitHub에서 [ton-docs](https://github.com/ton-community/ton-docs/) 리포지토리를 포크한 다음 복제하고 로컬 리포지토리에 새 브랜치를 만드세요.
2. 품질과 가독성을 염두에 두고 튜토리얼을 작성하세요! 기존 튜토리얼을 살펴보고 무엇을 목표로 해야 하는지 알아보세요.
3. 검토를 위해 제출할 준비가 되면 지점에서 [Pull Request를 열고](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) 제출하세요. 우리에게 알림이 전송되면 검토 절차가 시작됩니다:
   1. **튜토리얼의 최종 초안을 제출하혀고 노력해 주세요**. 몇 가지 오타와 문법 수정은 허용되지만, 튜토리얼을 게시하기 전에 큰 변경이 필요한 경우, 리뷰와 수정에 훨씬 더 많은 시간이 걸릴 것입니다.
4. 제출하신 내용을 검토하고 필요한 모든 변경을 완료하면, Pull Request를 병합하고 TON Documentation에 튜토리얼을 게시할 것입니다. 그 후 곧 연락을 드리고 결제를 준비하겠습니다!
5. 튜토리얼이 게시되면 소셜 미디어에 **홍보**하는 것을 잊지 마세요! [문서 유지 관리자](/contribute/maintainers) 가 이 홍보를 증대시킬 수 있도록 협력해 주세요.

요약하면 워크플로우는 다음과 같습니다:

1. **`ton-docs`** 리포지토리를 ***포크하고 복제합니다.***
2. ***튜토리얼을 작성 및 수정***합니다.
3. 검토를 위해 ***Pull Request***를 제출합니다.
4. ***필요한 모든 변경 사항을 적용***합니다.
5. 튜토리얼이 ***병합되고 게시***됩니다.
6. ***소셜 미디어에서 튜토리얼***을 홍보합니다!

## 문맥

"THE"를 "TON" 앞에 추가하는 주된 문제는 TON 문서화 및 편집 정책을 개발하는 동안 마케팅, 공급업체, 개발자 등 다양한 부서가 "Blockchain," "Ecosystem" 등과 같은 단어를 "TON"과 결합하여 단일 시스템, 네트워크, 브랜드의 강력한 이미지를 만들기 위해 토론에 참여했다는 것입니다. 긴 토론 끝에 강력한 브랜드 이미지를 위해 "THE" 없이 작성할 수 있고 대문자로 작성할 수 있는 단어와 구문의 용어집을 작성하기로 결론지었습니다. 현재 두 가지 단어 조합이 있습니다: TON Blockchain 및 TON Ecosystem.

TON Connect, TON SDK, TON Grants 등 다른 TON 모듈 이름의 경우, 문맥에 따라 다릅니다. 대문자 규칙을 적용하지만 관사 규칙에는 유연합니다. 구성 요소 이름이 단독으로 사용될 때는 관사 없이 사용하는 것이 좋습니다. 그러나 TON Connect 프로토콜과 같이 일반 명사와 결합된 경우에는 엔티티 프로토콜을 지칭하므로 관사가 필요합니다.

"TON + 명사" (예: "the TON world," "the TON community" 등)와 같은 다른 단어 조합의 경우, 우리는 명사와 결합할 때 기사를 기대하기 때문에 관사의 사용을 제한하지 않습니다.

## 일반 팁

- **기존 콘텐츠를 복사하여 붙여넣지 마세요**. 표절은 심각한 문제이며 용납되지 않습니다. 튜토리얼이 기존 콘텐츠에서 영감을 얻은 경우, 이를 참조하고 링크를 추가하세요. 다른 튜토리얼/리소스에 링크할 때는 가급적 TON Docs 리소스를 사용하세요.
- **안내 동영상 또는 동영상 콘텐츠**를 Google Drive에 업로드하여 PR에 포함하세요.
- 어떤 계정에서, 어디서, 왜 자금을 조달하는지를 포함하여 **계정 자금 조달에 대해 명확하게 설명**해야 합니다. 학습자가 이 작업을 스스로 수행할 수 있다고 가정하지 마세요!
- 학습자가 예상되는 내용을 이해하는 데 도움이 되도록 터미널 스니펫 또는 스크린샷 형태로 **샘플 출력**을 표시합니다. 긴 출력을 다듬어 주세요.
- 학습자에게 오류를 디버깅하는 방법을 가르치기 위해 일부러 오류를 발생시키는 **오류 중심 접근 방식**을 취하세요. 예를 들어, 컨트랙트를 배포하기 위해 계정에 자금을 지원해야 하는 경우 먼저 자금을 지원하지 않고 배포를 시도하고 반환되는 오류를 관찰한 다음 (계정에 자금을 지원하여) 오류를 수정하고 다시 시도하세요.
- **잠재적인 오류와 및 문제 해결 방법을 추가하세요.** 물론 튜토리얼에 가능한 모든 오류를 나열할 필요는 없지만, 중요하거나 가장 일반적인 오류를 파악하기 위해 노력해야 합니다.
- **클라이언트 측에서는 React 또는 Vue**를 사용하세요.
- **PR을 만들기 전에 먼저 코드를 직접 실행**하여 명백한 오류를 방지하고 예상대로 작동하는지 확인하세요.
- **튜토리얼 간의 다른 소스로 연결되는 외부/교차 링크**를 포함하지 마세요. 튜토리얼이 길다면, 더 긴 과정이나 경로로 전환하는 방법에 대해 논의할 수 있습니다.
- 필요한 경우 복잡한 과정을 설명하기 위해 **사진 또는 스크린샷**을 **제공**하세요.
- Learn-tutorials 리포지토리의 'static' 디렉터리에 업로드하세요 - 외부 사이트에 대한 핫링크는 이미지가 손상될 수 있으므로 **사용하지 마세요**.
- \*\*이미지 링크는 markdown 형식이어야 하며, 리포지토리에 있는 static 디렉토리의 raw GitHub URL만 **사용**해야 합니다. `![이미지 이름](https://raw.githubusercontent.com/ton-community/ton-docs/main/static/img/tutorials/<your image filename>.png?raw=true)`
  - URL 끝에 `?raw=true`를 추가하는 것을 잊지 마세요.

## 튜토리얼을 구성하는 방법

:::info 샘플 튜토리얼 구조
[샘플 튜토리얼 구조](/contribute/tutorials/sample-tutorial) 를 직접 확인해보세요.
:::

- **제목**은 튜토리얼의 목표를 요약하여 직접적이고 명확하게 작성해야 합니다. 튜토리얼 제목을 문서 내부의 제목으로 추가하지 말고 markdown 문서 파일명을 사용하세요.
  - *예를 들어*: 튜토리얼의 제목이 "*Step by step guide for writing your first smart contract in FunC*"인 경우 파일 이름은 다음과 같아야 합니다:\
    'step-by-step-guide-for-writing-your-first-smart-contract-in-func.md'와 같은 형식이어야 합니다.
- 이 튜토리얼이 왜 중요한지, 튜토리얼의 맥락이 무엇인지 설명하는 **소개** 섹션을 포함하세요. 당연하다고 생각하지 마세요.
- *선행 지식*, 완료해야 할 기존 튜토리얼, 필요한 토큰 등을 설명하는 **사전 요구 사항** 섹션을 포함하세요.
- 튜토리얼을 시작하기 전에 **설치**해야 하며 튜토리얼에서 다루지 않는 기술(예: TON 지갑 확장 프로그램, Node.js 등)을 설명하는 **요구사항** 섹션을 포함하세요. 튜토리얼 중에 설치될 패키지를 나열하지 마세요.
- **소제목**(H2: ##) 을 사용하여 튜토리얼 본문 내에서 설명을 세분화할 수 있습니다. 소제목을 사용할 때는 목차를 염두에 두고 일관성을 유지하세요.
  - 소제목 아래의 내용이 짧은 경우(예: 단락 하나와 코드 블록 하나) 소제목 대신 굵은 텍스트를 사용하는 것이 좋습니다.
- 배운 내용을 요약하고 주요 포인트를 강화하며 튜토리얼 완료를 축하하는 **결론** 섹션을 포함하세요.
- (***선택 사항***) 좋은 후속 튜토리얼이나 기타 리소스(프로젝트, 기사 등) 로 연결되는 **다음 단계** 섹션을 포함하세요.
- (***선택사항***) 튜토리얼의 마지막에 **저자 소개** 섹션을 포함하세요. 귀하의 GitHub 프로필(이름, 웹사이트 등 포함) 링크와 Telegram 프로필 링크를 포함하세요(사용자가 도움과 질문을 위해 연락하거나 태그할 수 있도록).
- 이 튜토리얼을 작성하는 데 다른 문서, GitHub 리포지토리 또는 기타 튜토리얼에서 도움을 받았다면 **참고자료** 섹션을 **필수**로 작성해야 합니다. 가능한 경우 문서에 이름과 링크를 추가하여 출처를 표시하세요(디지털 문서가 아닌 경우 ISBN 또는 기타 참조 수단을 포함하세요).

## 스타일 가이드

- **작성 톤 -** 튜토리얼은 커뮤니티 기여자가 동료를 위해 작성합니다.
  - 이러한 점을 고려하여 튜토리얼 전반에 걸쳐 포용과 상호 작용의 분위기를 조성하는 것이 좋습니다. "우리", "우리가", "우리의"와 같은 단어를 사용하세요.
    - *예시*: "우리의 계약을 성공적으로 배포했습니다."
  - 직접적인 지시를 제공할 때는 "귀하", "귀하의" 등을 자유롭게 사용하세요.
    - *예시*: "*귀하의 파일은 다음과 같이 표시되어야 합니다:*".

- 튜토리얼 내내 **markdown을 적절히 사용하세요**. [GitHub의 마크다운 가이드](https://guides.github.com/features/mastering-markdown/)와 [샘플 튜토리얼 구조](/contribute/tutorials/sample-tutorial)를 참조하세요.

- **강조를 위해 미리 서식화된 텍스트를 사용하지 마세요**, *예시*:
  - ❌ "TON counter `smart contract` named `counter.fc`"는 잘못되었습니다.
  - ✅ "TON counter **smart contract** named `counter.fc`"는 올바릅니다.

- **섹션 제목에 markdown 서식을 사용하지 마세요**, *예시*:
  - ❌ #**Introduction**는 잘못되었습니다.
  - ✅ # Introduction는 올바릅니다.

- **코드를 설명하세요!** 학습자에게 무작정 복사하여 붙여넣기만 하라고 하지 마세요.
  - 함수 이름, 변수, 상수는 문서 전체에 걸쳐 일관성을 유지해야 합니다.
  - 코드 블록의 시작 부분에 주석을 사용하여 코드가 있는 경로와 파일명을 표시합니다. *예시*:

    ```jsx
    // test-application/src/filename.jsx

    import { useEffect, useState } from 'react';

    ...
    ```

- 코드 블록 구문 강조 표시를 위해 **적절한 언어**를 선택하세요!
  - 모든 코드 블록에는 구문 강조 표시가 *필수* 있어야 합니다. 어떤 구문 강조 표시를 적용할지 잘 모르겠다면 **\`\`\`텍스트**를 사용하세요.

- **미리 형식이 지정된 텍스트에는 코드 블록 구문을 사용하지 마세요**, *예시*:
  - ❌ \`filename.jsx\` 는 잘못되었습니다.
  - ✅ \`filename.jsx\` 는 올바릅니다.

- **코드 블록은 주석이 잘 달려 있어야 합니다**. 주석은 짧고(보통 한 번에 두세 줄) 효과적이어야 합니다. 코드를 설명하기 위해 더 많은 공간이 필요한 경우 코드 블록 외부에서 설명하세요.

- **모든 코드 블록 앞뒤에 빈 줄**을 남겨두는 것을 잊지 마세요.\
  *예시*:

```jsx
  
// test-application/src/filename.jsx  
  
import { useEffect, useState } from 'react';
  
```

- 코드를 코드 블록에 붙여넣기 전에 **linter 및 prettifier**를 사용하세요. JavaScript/React에는 `eslint`를 권장합니다. 코드 서식 지정에는 `prettier`를 사용하세요.
- **글머리 기호**, 번호 목록 또는 복잡한 텍스트 서식을 남용하지 마세요. **굵게** 또는 *이탤릭체* 강조는 허용되지만 최소한으로 사용해야 합니다.

# **앱 설정**

- Web3 프로젝트에는 일반적으로 여러 개의 기존 코드 라이브러리가 포함됩니다. 튜토리얼을 작성할 때 이를 고려해야 합니다. 가능하면 학습자가 쉽게 시작할 수 있도록 GitHub 리포지토리를 시작점으로 제공하세요.
- 튜토리얼에 사용하는 코드를 포함하기 위해 GitHub 리포지토리를 *사용하지* 않는 경우에는 독자들에게 코드를 정리할 폴더를 만드는 방법을 설명해 주세요.
  *예시*: `mkdir example && cd example`
- `npm init`을 사용하여 프로젝트 디렉터리를 초기화하는 경우, 프롬프트를 설명하거나 `-y` 플래그를 사용합니다.
- `npm install`을 사용하는 경우 `-save` 플래그를 사용합니다.



================================================
FILE: i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/tutorials/principles-of-a-good-tutorial.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/tutorials/principles-of-a-good-tutorial.md
================================================
# 좋은 튜토리얼의 원칙

이 원칙을 담은 [talkol](https://github.com/talkol)의 원본 댓글입니다:

- [TON 발자취 #7에 대한 원본 댓글](https://github.com/ton-society/ton-footsteps/issues/7#issuecomment-1187581181)

다음은 신규 기여자를 위한 요점 정리입니다.

## 원칙

1. 전체 흐름은 사용자의 클라이언트에서 실행되어야 합니다. 타사 서비스가 포함되지 않아야 합니다. 사용자가 리포지토리를 간단히 복제하고 즉시 실행할 수 있도록 모든 작업을 수행해야 합니다.

2. README는 매우 상세해야 합니다. 사용자가 아무것도 모른다고 가정하지 마세요. 튜토리얼에 필요한 경우 장치에 FunC 컴파일러나 Lite-client를 설치하는 방법도 설명해야 합니다. 이 문서의 다른 튜토리얼에서 이러한 부분을 복사할 수 있습니다.

3. 저장소에는 사용된 컨트랙트의 전체 소스 코드가 포함되는 것이 좋습니다. 사용자들이 표준 코드를 약간 변경할 수 있도록 하기 위해서입니다. 예를 들어, Jetton 스마트 컨트랙트는 사용자들이 맞춤형 동작을 실험할 수 있도록 합니다.

4. 가능하다면 사용자가 코드를 다운로드하거나 아무것도 구성하지 않고도 프로젝트를 배포하거나 실행할 수 있는 사용자 친화적인 인터페이스를 만들어야 합니다. 이 경우에도 독립형으로 GitHub Pages에서 제공되어 사용자의 장치에서 100% 클라이언트 측에서 실행되도록 해야 합니다. 예: https://minter.ton.org/

5. 각 필드 선택이 무엇을 의미하는지 사용자에게 설명하고 모범 사례를 설명합니다.

6. 보안에 대해 알아야 할 모든 것을 설명합니다. 작성자가 실수를 하지 않고 위험한 스마트 계약/봇/웹사이트를 만들지 않도록 충분히 설명해야 하며, 이는 최고의 보안 관행을 가르치는 것입니다.

7. 이상적으로, 리포지토리에는 독자가 튜토리얼의 맥락에서 이를 구현하는 방법을 잘 보여주는 잘 작성된 테스트가 포함되어야 합니다.

8. 저장소는 자체적으로 이해하기 쉬운 컴파일/배포 스크립트를 포함해야 합니다. 사용자가 단순히 `npm install` 을 하고 이를 사용할 수 있어야 합니다.

9. 때로는 GitHub 리포지토리만으로 충분하고 전체 문서를 작성할 필요가 없습니다. 이 경우 README에 저장소의 모든 코드가 포함되어 있어야 합니다. 코드는 사용자가 쉽게 읽고 이해할 수 있도록 잘 주석이 달려 있어야 합니다.



================================================
FILE: i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/tutorials/sample-tutorial.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-docs/current/v3/contribute/tutorials/sample-tutorial.md
================================================
# 샘플 튜토리얼 구조

## 소개

소개 제목은 **반드시** H2로 해야 합니다: `## 소개`

이 섹션에서는 이 튜토리얼의 배경과 중요성, 우리가 이 튜토리얼에서 만들고 배울 것들에 대해 설명합니다.

- 마치 5살 아이에게 설명하듯이 이 섹션을 설명하세요 (**[ELI5](https://www.dictionary.com/e/slang/eli5/)**).
- 모든 내용을 최대 5~6줄로 설명하세요.

\*예시: \*

> 스마트 컨트랙트는 TON 블록체인에서 실행되는 컴퓨터 프로그램입니다. 더 구체적으로 말하면, [TVM](/learn/tvm-instructions/tvm-overview)(*TON 가상 머신*) 에서 실행됩니다. 이 컨트랙트는 코드(*컴파일된 TVM 명령어*) 와 데이터(*영구 상태*) 로 구성되며, TON의 특정 주소에 저장됩니다.

## 전제 조건

사전 준비 제목은 **반드시** H2로 해야 합니다: `## 사전 준비`

이 섹션에서는 필요한 사전 지식이나 먼저 완료해야 하는 기존 튜토리얼에 대해 설명합니다. 필요한 토큰도 이곳에 언급합니다.

\*예시: \*

> 이 튜토리얼에서는 테스트넷에서 Jetton을 발행할 것입니다. 계속하기 전에 [testnet](/develop/smart-contracts/environment/testnet) 지갑에 충분한 잔액이 있는지 확인하시기 바랍니다.

## 요구 사항

요구 사항 제목은 **반드시** H2로 해야 합니다: ## 요구 사항

**선택 사항 :** 튜토리얼에 동영상 콘텐츠가 있는 경우 이 섹션에 삽입하세요.

튜토리얼을 시작하기 **전에** 설치해야 하며 튜토리얼에서 다루지 않는 기술(`TON 월렛 확장`, `노드` 등) 을 설명합니다. 튜토리얼 동안 설치할 패키지는 나열하지 않습니다.

\*예시: \*

- 이 튜토리얼에서는 TON 지갑 확장 프로그램이 필요하므로 [여기](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd)에서 설치하세요.
- NodeJS 12.0.1+가 설치되어 있는지 확인하세요.

## 튜토리얼 본문

- "튜토리얼 본문"을 제목으로 사용하지 말고, 자료와 관련된 제목을 사용하세요.
  - 다른 것이 생각나지 않으면 "시작하기"를 사용해도 됩니다 😉
- 독자들이 튜토리얼을 따라갈 수 있도록 필요한 모든 텍스트 콘텐츠를 추가하고, 제출하기 전에 철자와 ***문법을 교정하는 것을 잊지 마세요.***
  - [Grammarly](http://grammarly.com)는 문법 실수를 방지하는 데 도움이 되는 좋은 무료 프로그램입니다.

### 핵심 사항

- "튜토리얼 본문"을 제목으로 사용하지 마세요!

- **모든 소제목은 H3로 유지하고**, H4 이하로는 사용하지 마세요.
  - Markdown 문법에서는 H2 제목에 두 개의 해시마크가 사용됩니다: ##
  - H3 제목에는 세 개의 해시마크가 사용됩니다: ###

- 코드 블록에 필요한 주석만 추가하세요. ***터미널 입력 코드 블록에 # 스타일 주석을 추가하지 마세요.***

- 관련된 모든 코드 블록을 추가하세요:
  - ## Markdown 문법에서 코드 블록은 코드 블록 시작과 끝에 세 개의 백틱을 사용합니다. 또한, 모든 코드 블록 앞뒤에 줄 바꿈이 있어야 합니다. *예시*:
    \`js  
          const testVariable = 'some string';  
          someFunctionCall();  
          \`

  - 모든 코드 블록은 구문 강조 유형을 ***반드시*** 가져야 합니다. 확실하지 않은 경우 \`\`\`text를 사용하세요.

  - 터미널 출력, 터미널 명령 및 일반 텍스트에는 \\`\`\`text를 사용해야 합니다.

  - \`javascript *또는* `js는 JavaScript 코드에 사용합니다.

  - \`typescript 또는 `ts는 TypeScript 코드에 사용합니다.

  - \\`\`\`jsx는 ReactJS 코드에 사용합니다.

  - \\`\`\`cpp는 Func 코드에 사용합니다.

  - GraphQL 구문 강조에는 \\`\`\`graphql을 사용하세요.

  - 유효한 JSON을 강조할 때는 \`json을 사용합니다. (유효하지 않은 JSON 예제에는 대신 \`text를 사용하세요.)

  - \\`\`\`bash는 # 스타일 주석이 필요한 코드 블록에서만 사용해야 합니다. 이는 많은 상황에서 # 문자가 Markdown 제목으로 렌더링될 수 있기 때문에 신중히 사용해야 합니다. 일반적으로, 목차가 이로 인해 영향을 받습니다.

- 강조를 위해 `미리 서식을 지정한 텍스트`를 사용하지 말고, 대신 **굵은 글씨**나 *기울임꼴* 텍스트만 사용하세요.

- 예상되는 터미널 출력을 반영하기 위해 이미지나 코드 블록을 추가하세요.

- 튜토리얼을 작성할 때는 오류 중심 접근 방식을 취하세요. 일반적인 오류와 문제 해결 단계를 추가하세요. *예시:*

> **`node deploy:testnet` 명령을 실행할 때 발생하는 오류로 인해 테스트넷에 연결할 수 없습니다.**
>
> 몇 가지 일반적인 원인을 살펴보겠습니다:

- `.env`에 생성된 테스트넷 지갑에 충분한 자금이 있는지 확인하세요. 그렇지 않으면, faucet 제공자에서 테스트넷 코인을 추가하세요.
- 여전히 같은 문제가 발생하면 [개발자 채팅](https://t.me/TonDev_eng/)에서 개발자에게 도움을 요청하세요.

>

## 결론

결론 제목은 **반드시** H2로 해야 합니다: `## 결론`

이 섹션에서는 튜토리얼에서 배운 내용을 요약하고, 핵심 사항을 강조하며, 학습자가 튜토리얼을 완료한 것을 축하해야 합니다. 최대 5–6줄로 작성합니다. *예시*:

> 우리는 카운터 기능이 있는 새로운 간단한 FunC 컨트랙트를 만들었습니다. 그런 다음 이를 온체인에 구축하고 배포했으며, 마지막으로 getter를 호출하고 메시지를 보내 상호작용했습니다.

이 코드는 프로덕션용이 아닙니다. 메인넷에 배포하려면 토큰이 시장에 상장된 경우 전송 메서드를 비활성화하는 등 고려해야 할 몇 가지 사항이 더 있다는 점을 기억하시기 바랍니다.

>

## 더 보기

더 보기 제목은 **반드시** H2로 해야 합니다: `## 더 보기`

이 섹션에서는 이 튜토리얼 후에 계속 학습할 수 있는 방법을 설명합니다. 이 튜토리얼과 관련된 프로젝트와 기사도 자유롭게 추천하세요. 진행 중인 다른 고급 튜토리얼이 있다면 간단히 언급할 수 있습니다. 일반적으로 docs.ton.org의 관련 페이지만 여기에 배치됩니다.

## 저자 소개 *(선택 사항)*

저자 소개 제목은 **반드시** H2로 해야 합니다: `## 저자 소개`

짧게 작성하세요. 한 두 줄 정도면 충분합니다. GitHub 프로필 + Telegram 프로필 링크를 포함할 수 있습니다. 여기에 LinkedIn이나 Twitter를 추가하지 마세요.

## 참조 *(선택 사항)*

참조 제목은 **반드시** H2로 해야 합니다: `## 참조`

다른 문서, GitHub 리포지토리 또는 기존 튜토리얼에서 도움을 받은 경우 이 섹션을 추가해야 합니다.

가능한 경우 문서 이름과 링크를 추가하여 출처를 표시하세요.

디지털 문서가 아닌 경우 ISBN 또는 다른 형태의 참고 자료를 포함하세요.



================================================
FILE: i18n/ko/docusaurus-plugin-content-docs/current/v3/develop/archive/mining.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-docs/current/v3/develop/archive/mining.md
================================================
# TON 마이닝 가이드

:::warning 사용 중지
이 정보는 오래되어 더 이상 유용하지 않을 수 있습니다. 생략해도 됩니다.
:::

## <a id="introduction"></a>소개

이 문서는 작업 증명을 사용하여 톤코인을 채굴하는 과정을 소개합니다. TON 마이닝의 최신 현황은 [ton.org/mining](https://ton.org/mining)을 참조하세요.

## <a id="quick-start"></a>빠른 시작

지금 채굴을 시작하려면:

1. [채굴에 적합한 컴퓨터](#hardware) 를 구합니다.
2. [Ubuntu](https://ubuntu.com) 20.04 데스크톱 또는 서버 배포판을 설치합니다.
3. `라이트` 모드에서 [mytonctrl](https://github.com/igroman787/mytonctrl#installation-ubuntu) 을 설치합니다.
4. `mytonctrl` 내에서 `emi` 명령을 실행하여 하드웨어와 [예상 채굴 수입](#faq-emi) 을 확인하세요.
5. 아직 지갑이 없는 경우 [지갑](https://www.ton.org/wallets) 중 하나를 사용하여 `지갑 주소`를 생성하세요.
6. `mytonctrl`에서 `set minerAddr "..."`을 실행하여 `지갑 주소`를 채굴 대상으로 정의합니다.
7. [ton.org/mining](https://ton.org/mining) 에서 제공되는 목록에서 기버 컨트랙트를 선택하고, `mytonctrl`에서 `set powAddr "..."`을 실행하여 마이너를 채굴하도록 설정합니다.
8. `mytonctrl`에서 `mon`을 실행하여 채굴을 시작합니다.
9. 컴퓨터의 CPU 부하를 확인하세요. 'pow-miner'라는 프로세스는 대부분의 CPU를 사용해야 합니다.
10. 행운을 기다리세요; 4단계의 결과를 통해 블록을 채굴할 확률이 어느 정도인지 대략적으로 알 수 있을 것입니다.

## <a id="basics"></a>기본 사항

Toncoin은 특정 양의 TON이 할당된 스마트 계약인 이른바 `PoW 기버`에 의해 분배됩니다. 현재 TON 네트워크에는 10개의 활성 PoW 기버가 있습니다. Givers는 100 TON씩 블록으로 코인을 나누어줍니다. 이러한 블록을 받으려면 컴퓨터가 기버가 발행한 복잡한 수학적 문제를 가능한 빨리 해결해야 합니다. 다른 채굴자들과 100 TON의 보상을 놓고 경쟁하게 됩니다. 누군가가 먼저 문제를 해결하면, 컴퓨터가 수행한 모든 작업은 무효가 되며, 새로운 라운드/경주가 시작됩니다.

채굴로 인한 수익은 기계가 작업을 수행하는 동안 `조금씩` 들어오는 것이 아니라, giver 문제를 성공적으로 해결할 때마다 100 TON 단위로 들어옵니다. 따라서 기계가 24시간 내에 블록을 계산할 확률이 10%라면 ([빠른 시작](#quickStart) 4단계 참조) 100 TON 보상을 받기까지 최대 10일을 기다려야 할 수도 있습니다.

채굴 과정은 대부분 `mytonctrl`에 의해 자동화되어 있습니다. 채굴 과정에 대한 자세한 정보는 [PoW Giver](https://www.ton.org/#/howto/pow-givers) 문서에서 확인할 수 있습니다.

## <a id="advanced"></a>고급

채굴에 진지하게 관심이 있고 두 대 이상의 기계/채굴장을 운영하고자 하는 경우, TON과 채굴 작동 방식을 배워야 하며 자세한 내용은 [HOWTO](https://ton.org/#/howto/) 섹션에서 심도 있는 정보를 확인하세요. 여기 몇 가지 일반적인 조언이 있습니다:

- 자체 노드/라이트 서버를 별도의 컴퓨터에서 **실행하세요.** 이렇게 하면 마이닝 팜이 다운되거나 쿼리를 적시에 처리하지 못할 수 있는 외부 라이트 서버에 의존하지 않도록 할 수 있습니다.
- 퍼블릭 라이트 서버에 `get_pow_params` 쿼리를 **퍼붓지 마세요.** 제공자 상태를 자주 폴링하는 사용자 지정 스크립트가 있는 경우 반드시 자체 라이트 서버를 사용해야 합니다. 이 규칙을 위반하는 클라이언트는 퍼블릭 라이트 서버에서 IP가 블랙리스트에 오를 위험이 있습니다.
- [마이닝 프로세스](https://www.ton.org/#/howto/pow-givers)가 어떻게 작동하는지 이해하려고 노력하세요. 대부분의 대규모 마이너는 여러 대의 마이닝 머신이 있는 환경에서 `mytonctrl`보다 많은 이점을 제공하는 자체 스크립트를 사용합니다.

## <a id="hardware"></a>채굴 하드웨어

TON 채굴의 전체 네트워크 해시레이트는 매우 높기 때문에 채굴자가 채굴에 성공하려면 고성능 컴퓨터가 필요합니다. 일반 가정용 컴퓨터나 노트북으로 채굴하는 것은 무의미하며, 이러한 시도는 권장하지 않습니다.

#### CPU

[Intel SHA Extension](https://en.wikipedia.org/wiki/Intel_SHA_extensions)을 지원하는 최신 CPU는 **필수**입니다. 대부분의 채굴자는 최소 32개의 코어와 64개의 스레드를 갖춘 AMD EPYC 또는 Threadripper 기반 컴퓨터를 사용합니다.

#### GPU

네, GPU를 사용하여 TON을 채굴할 수 있습니다. Nvidia와 AMD GPU를 모두 사용할 수 있는 PoW 채굴기 버전이 있으며, 코드와 사용 방법에 대한 지침은 [POW 마이너 GPU](https://github.com/tontechio/pow-miner-gpu/blob/main/crypto/util/pow-miner-howto.md) 리포지토리에서 찾을 수 있습니다.

현재로서는 이를 사용하려면 기술적인 지식이 필요하지만, 보다 사용자 친화적인 솔루션을 개발 중입니다.

#### 메모리

거의 모든 채굴 과정은 CPU의 L2 캐시에서 발생합니다. 즉, 메모리 속도와 크기는 채굴 성능에 영향을 미치지 않습니다. 단일 메모리 채널에 단일 DIMM이 있는 듀얼 AMD EPYC 시스템은 16개의 DIMM이 모든 채널을 차지하는 시스템과 동일한 속도로 채굴합니다.

이것은 **단순한 채굴 과정에만** 해당되며, 기계가 풀 노드나 다른 프로세스를 실행하는 경우 상황이 달라집니다! 그러나 이는 이 가이드의 범위를 벗어납니다.

#### 스토리지

라이트 모드에서 실행되는 일반 채굴기는 최소한의 공간을 사용하며 스토리지에 데이터를 저장하지 않습니다.

#### 네트워크

단순 채굴기는 인터넷으로의 아웃바운드 연결을 열 수 있어야 합니다.

#### FPGA / ASIC

[FPGA / ASIC을 사용할 수 있는지 확인](#faq-hw-asic) 하세요.

### <a id="hardware-cloud"></a>클라우드 머신

많은 사람들이 AWS 또는 Google Compute Cloud 머신을 사용하여 채굴합니다. 위의 사양에서 설명한 것처럼, 실제로 중요한 것은 CPU입니다. 따라서 AWS [c5a.24xlarge](https://aws.amazon.com/ec2/instance-types/c5/) 또는 Google [n2d-highcpu-224](https://cloud.google.com/compute/vm-instance-pricing) 인스턴스를 권장합니다.

### <a id="hardware-estimates"></a>수익 예측

소득을 계산하는 공식은 매우 간단합니다: `($total_bleed / $total_hashrate) * $your_hashrate`. 이렇게 하면 **현재** 추정치가 나옵니다. 변수는 [ton.org/mining](https://ton.org/mining)에서 확인하거나 `mytonctrl`에서 예상 채굴 소득 계산기(`emi` 명령어)를 사용할 수 있습니다. 다음은 2021년 8월 7일에 i5-11400F CPU를 사용하여 계산한 샘플 출력입니다:

```
Mining income estimations
-----------------------------------------------------------------
Total network 24h earnings:         171635.79 TON
Average network 24h hashrate:       805276100000 HPS
Your machine hashrate:              68465900 HPS
Est. 24h chance to mine a block:    15%
Est. monthly income:                437.7 TON
```

**중요**: 제공된 정보는 *실행 시점의 네트워크 해시레이트*를 기준으로 한다는 점에 유의하시기 바랍니다. 실제 수익은 네트워크 해시레이트 변화, 선택한 기버, 운 등의 여러 요인에 따라 달라질 수 있습니다.

## <a id="faq"></a>자주 묻는 질문

### <a id="faq-general"></a>일반

#### <a id="faq-general-posorpow"></a>TON은 PoS 네트워크인가요, PoW 네트워크인가요?

TON 블록체인은 지분 증명 합의를 사용합니다. 새로운 블록을 생성하기 위해 채굴은 필요하지 않습니다.

#### <a id="faq-general-pow"></a>그러면 왜 TON은 작업 증명을 사용하는 건가요?

초기 50억 Toncoin 발행량이 임시 PoW Giver 스마트 컨트랙트로 이전되었기 때문입니다. 이 스마트 컨트랙트에서 Toncoin을 얻기 위해 채굴을 사용합니다.

#### <a id="faq-general-supply"></a>채굴할 수 있는 코인은 얼마나 남았나요?

가장 최신 정보는 [ton.org/mining](https://ton.org/mining) 에서 확인할 수 있으며 `bleed` 그래프를 참조하세요. PoW 기버 컨트랙트에는 한계가 있으며 사용자가 모든 Toncoin을 채굴하면 고갈됩니다.

#### <a id="faq-general-mined"></a>이미 채굴된 코인은 얼마나 되나요?

2021년 8월 기준으로 약 49억 Toncoin이 채굴되었습니다.

#### <a id="faq-general-whomined"></a>그 코인을 누가 채굴했나요?

코인은 70,000개 이상의 지갑으로 채굴되었으며, 해당 지갑의 소유자는 알려지지 않았습니다.

#### <a id="faq-general-elite"></a>채굴을 시작하는 것이 어렵나요?

전혀 어렵지 않습니다. 필요한 것은 [적절한 하드웨어](#hardware) 와 [빠른 시작](#quickStart) 섹션에 설명된 단계를 따르기만 하면 됩니다.

#### <a id="faq-general-pissed"></a>다른 방법으로 채굴할 수 있나요?

네, 서드파티 앱인 [TON Miner Bot](https://t.me/TonMinerBot)이 있습니다.

#### <a id="faq-general-stats"></a>채굴 통계를 어디서 볼 수 있나요?

[ton.org/mining](https://ton.org/mining)

#### <a id="faq-general-howmany"></a>채굴자는 몇 명이나 되나요?

정확히 알 수 없습니다. 네트워크의 전체 해시레이트만 알고 있습니다. 하지만, 대략적인 총 해시레이트를 제공하기 위해 필요한 특정 유형의 머신의 수량을 추정하는 그래프가 [ton.org/mining](https://ton.org/mining)에 있습니다.

#### <a id="faq-general-noincome"></a>채굴을 시작하려면 톤코인이 필요한가요?

아니요, 필요하지 않습니다. 단 한 개의 Toncoin 없이도 채굴을 시작할 수 있습니다.

#### <a id="faq-mining-noincome"></a>몇 시간 동안 채굴을 했는데 왜 지갑 총액이 1 TON도 늘지 않나요?

TON은 100개의 블록 단위로 채굴됩니다. 블록을 추측하여 100 TON을 받거나 아무것도 받지 못합니다. [기본 사항](#basics) 을 참조하세요.

#### <a id="faq-mining-noblocks"></a>며칠 동안 채굴했지만 결과가 보이지 않는 이유는 무엇인가요?

현재 [수익 예상치](#hardware-estimates) 을 확인하셨나요? `24시간 내 블록 채굴 확률` 추정 필드가 100% 미만이면 인내심을 가져야 합니다. 또한 24시간 내 블록을 채굴할 확률이 50%라고 해서 자동으로 2일 내에 블록을 채굴할 수 있는 것은 아닙니다. 50%는 각 날마다 별도로 적용됩니다.

#### <a id="faq-mining-pools"></a>채굴 풀이 있나요?

아니요, 현재로서는 마이닝 풀이 구현되어 있지 않으며 모두가 스스로 마이닝을 합니다.

#### <a id="faq-mining-giver"></a>어떤 기버를 채굴해야 하나요?

기버를 선택하는 것은 크게 중요하지 않습니다. 각 기버의 난이도는 변동하므로, 현재 [ton.org/mining](https://ton.org/mining) 에서 가장 쉬운 기버가 한 시간 내에 가장 복잡해질 수 있습니다. 반대의 경우도 마찬가지입니다.

### <a id="faq-hw"></a>하드웨어

#### <a id="faq-hw-machine"></a>더 빠른 기계가 항상 승리하나요?

아니요, 모든 채굴자는 해결책을 찾기 위해 서로 다른 길을 택합니다. 더 빠른 기계일수록 성공 확률이 높지만 승리를 보장하지는 않습니다!

#### <a id="faq-hw-machine"></a>내 기계가 얼마나 많은 수익을 창출하나요?

[수익 예측](#hardware-estimates) 을 참조하세요.

#### <a id="faq-hw-asic"></a>BTC/ETH 장비를 사용해 TON을 채굴할 수 있나요?

아니요, TON은 BTC, ETH 및 기타 암호화폐와 다른 단일 SHA256 해싱 방식을 사용합니다. 다른 암호화폐를 채굴하기 위해 제작된 ASIC 또는 FPGA는 도움이 되지 않습니다.

#### <a id="faq-hw-svsm"></a>더 빠른 기계 하나가 더 좋은가요, 아니면 여러 대의 느린 기계가 더 좋은가요?

이는 논란의 여지가 있습니다. 채굴 소프트웨어는 시스템의 각 코어에 스레드를 실행하며, 각 코어는 처리할 자체 키 세트를 받습니다. 따라서 64개의 스레드를 실행할 수 있는 기계 하나와 각각 16개의 스레드를 실행할 수 있는 기계 4대는 스레드 속도가 동일하다고 가정할 때 동일한 성공률을 가집니다.

현실에서는 낮은 코어 수를 가진 CPU는 보통 클럭 속도가 더 높기 때문에 여러 대의 기계를 사용하는 것이 더 나은 성공률을 가질 가능성이 높습니다.

#### <a id="faq-hw-mc"></a>여러 대의 기계를 실행하면 협력하나요?

아니요, 협력하지 않습니다. 각 기계는 자체적으로 채굴하지만, 솔루션을 찾는 과정은 무작위입니다. 어떤 기계도, 심지어 단일 스레드도 동일한 경로를 취하지 않습니다. 따라서 직접적인 협력 없이 해시레이트가 유리하게 합산됩니다.

#### <a id="faq-hw-CPU"></a>ARM CPU를 사용하여 채굴할 수 있나요?

CPU에 따라 다릅니다. AWS Graviton2 인스턴스는 매우 강력한 채굴기이며 AMD EPYC 기반 인스턴스와 가격/성능 비율을 유지할 수 있습니다.

### <a id="faq-software"></a>소프트웨어

#### <a id="faq-software-os"></a>Windows/xBSD/기타 다른 OS를 사용하여 채굴할 수 있나요?

물론입니다. [TON 소스코드](https://github.com/ton-blockchain/ton) 는 Windows, xBSD 및 다른 OS에서 빌드된 것으로 알려져 있습니다. 그러나 Linux에서 `mytonctrl`을 사용하는 것처럼 편리한 자동 설치는 없으며, 소프트웨어를 수동으로 설치하고 자체 스크립트를 작성해야 합니다. FreeBSD의 경우 빠른 설치를 가능하게 하는 [port](https://github.com/sonofmom/freebsd_ton_port)소스 코드 가 있습니다.

#### <a id="faq-software-node1"></a>mytonctrl을 풀 노드 모드에서 실행하면 채굴 속도가 빨라지나요?

계산 과정 자체는 빨라지지 않지만, 자신의 풀 노드/라이트 서버를 운영하면 안정성과 유연성을 얻을 수 있습니다.

#### <a id="faq-software-node2"></a>풀 노드를 운영하려면 무엇이 필요하며, 어떻게 운영하나요?

이는 이 가이드의 범위를 벗어납니다. [풀 노드 사용법](https://ton.org/#/howto/full-node) 및 [mytonctrl 지침](https://github.com/igroman787/mytonctrl) 을 참조하세요.

#### <a id="faq-software-build"></a>내 OS에서 소프트웨어를 빌드하는 데 도움을 줄 수 있나요?

이는 이 가이드의 범위를 벗어납니다. [풀 노드 가이드](https://ton.org/#/howto/full-node) 및 [Mytonctrl 설치 스크립트](https://github.com/igroman787/mytonctrl/blob/master/scripts/toninstaller.sh#L44) 를 참조하여 종속성 및 프로세스에 대한 정보를 확인하세요.



================================================
FILE: i18n/ko/docusaurus-plugin-content-docs/current/v3/develop/archive/pow-givers.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-docs/current/v3/develop/archive/pow-givers.md
================================================
# POW 기버(Giver)

:::warning 사용 중지
이 정보는 최신 상태가 아닐 수 있으며 더 이상 유용하지 않을 수 있습니다. 필요 시 생략해도 됩니다.
:::

이 문서의 목적은 Toncoin을 얻기 위해 Proof-of-Work Giver 스마트 컨트랙트와 상호 작용하는 방법을 설명하는 것입니다. 이 문서는 `시작하기`에서 설명된 TON 블록체인 라이트 클라이언트에 대한 이해와 라이트 클라이언트 및 기타 소프트웨어를 컴파일하는 절차에 대한 이해를 전제로 합니다. 검증기를 실행하기 위해 필요한 대량의 Toncoin을 얻기 위해서는 `Full Node` 및 `Validator` 페이지에 대한 이해가 필요합니다. 더 많은 양의 Toncoin을 얻으려면 검증기를 실행할 수 있는 전용 서버가 필요합니다. 적은 양의 Toncoin을 얻는 데는 전용 서버가 필요하지 않으며, 가정용 컴퓨터에서 몇 분 내에 완료할 수 있습니다.

> 현재 채굴자 수가 많기 때문에 채굴에 많은 리소스가 필요하다는 점에 유의하세요.

## 1. 작업 증명 기버(Proof-of-Work Giver) 스마트 컨트랙트

소수의 악의적인 당사자가 모든 Toncoin을 수집하는 것을 방지하기 위해 네트워크의 마스터체인에 특별한 종류의 "Proof-of-Work Giver" 스마트 컨트랙트가 배포되었습니다. 이 스마트 컨트랙트의 주소는 다음과 같습니다:

작은 양을 제공하는 스마트 컨트랙트들 (몇 분마다 10에서 100 Toncoin을 제공):

- kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN
- kf8SYc83pm5JkGt0p3TQRkuiM58O9Cr3waUtR9OoFq716lN-
- kf-FV4QTxLl-7Ct3E6MqOtMt-RGXMxi27g4I645lw6MTWraV
- kf_NSzfDJI1A3rOM0GQm7xsoUXHTgmdhN5-OrGD8uwL2JMvQ
- kf8gf1PQy4u2kURl-Gz4LbS29eaN4sVdrVQkPO-JL80VhOe6
- kf8kO6K6Qh6YM4ddjRYYlvVAK7IgyW8Zet-4ZvNrVsmQ4EOF
- kf-P_TOdwcCh0AXHhBpICDMxStxHenWdLCDLNH5QcNpwMHJ8
- kf91o4NNTryJ-Cw3sDGt9OTiafmETdVFUMvylQdFPoOxIsLm
- kf9iWhwk9GwAXjtwKG-vN7rmXT3hLIT23RBY6KhVaynRrIK7
- kf8JfFUEJhhpRW80_jqD7zzQteH6EBHOzxiOhygRhBdt4z2N

많은 양을 제공하는 스마트 컨트랙트들 (최소 하루에 한 번 10,000 Toncoin을 제공):

- kf8guqdIbY6kpMykR8WFeVGbZcP2iuBagXfnQuq0rGrxgE04
- kf9CxReRyaGj0vpSH0gRZkOAitm_yDHvgiMGtmvG-ZTirrMC
- kf-WXA4CX4lqyVlN4qItlQSWPFIy00NvO2BAydgC4CTeIUme
- kf8yF4oXfIj7BZgkqXM6VsmDEgCqWVSKECO1pC0LXWl399Vx
- kf9nNY69S3_heBBSUtpHRhIzjjqY0ChugeqbWcQGtGj-gQxO
- kf_wUXx-l1Ehw0kfQRgFtWKO07B6WhSqcUQZNyh4Jmj8R4zL
- kf_6keW5RniwNQYeq3DNWGcohKOwI85p-V2MsPk4v23tyO3I
- kf_NSPpF4ZQ7mrPylwk-8XQQ1qFD5evLnx5_oZVNywzOjSfh
- kf-uNWj4JmTJefr7IfjBSYQhFbd3JqtQ6cxuNIsJqDQ8SiEA
- kf8mO4l6ZB_eaMn1OqjLRrrkiBcSt7kYTvJC_dzJLdpEDKxn

> 현재 모든 많은 양을 제공하는 스마트 컨트랙트가 소진된 상태임을 유의하세요.

처음 10 개의 스마트 컨트랙트는 적은 양의 Toncoin을 얻고자 하는 사용자가 많은 컴퓨팅 파워를 소비하지 않고 얻을 수 있게 합니다 (일반적으로 가정용 컴퓨터에서 몇 분의 작업으로 충분합니다). 나머지 스마트 컨트랙트는 네트워크에서 검증자를 실행하는 데 필요한 더 큰 양의 Toncoin을 얻기 위한 것입니다. 일반적으로 검증자를 실행할 수 있는 전용 서버에서 하루 정도 작업하면 필요한 양을 얻을 수 있습니다.

> 현재 많은 수의 채굴자 때문에 적은 양을 제공하는 스마트 컨트랙트를 채굴하는 데 많은 리소스가 필요함을 유의하세요.

이 "proof-of-work giver" 스마트 컨트랙트 중 하나를 (목적에 따라 이 두 목록 중 하나에서) 임의로 선택하고, 채굴과 유사한 절차를 통해 이 스마트 컨트랙트에서 Toncoin을 얻어야 합니다. 본질적으로, "proof-of-work"을 포함하고 지갑 주소를 포함하는 외부 메시지를 선택한 "proof-of-work giver" 스마트 컨트랙트에 제출하면 필요한 양이 전송됩니다.

## 2. 채굴 과정

"proof-of-work"이 포함된 외부 메시지를 생성하려면 GitHub 저장소에 있는 TON 소스에서 컴파일된 특수 마이닝 유틸리티를 실행해야 합니다. 이 유틸리티는 빌드 디렉토리와 관련하여 './crypto/pow-miner' 파일에 있으며, 빌드 디렉토리에서 `make pow-miner`를 입력해 컴파일할 수 있습니다.

그러나 `pow-miner`를 실행하기 전에 선택한 "proof-of-work giver" 스마트 컨트랙트의 `seed` 및 `complicity` 매개 변수의 실제 값을 알아야 합니다. 이는 이 스마트 컨트랙트의 get-method `get_pow_params`를 호출하여 수행할 수 있습니다. 예를 들어, giver 스마트 컨트랙트를 사용할 경우 `kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN`을 입력하기만 하면 됩니다:

```
> runmethod kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN get_pow_params
```

출력은 다음과 같습니다:

```...
    arguments:  [ 101616 ] 
    result:  [ 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 256 ] 
    remote result (not to be trusted):  [ 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 256 ]
```

"result:" 줄에서 처음 두 개의 큰 숫자는 이 스마트 컨트랙트의 '시드'와 '복잡도'입니다. 이 예시에서 시드는 `229760179690128740373110445116482216837`이고 복잡도는 `53919893334301279589334030174039261347274288845081144962207220498432`입니다.

다음으로, `pow-miner` 유틸리티를 다음과 같이 호출합니다:

```
$ crypto/pow-miner -vv -w<num-threads> -t<timeout-in-sec> <your-wallet-address> <seed> <complexity> <iterations> <pow-giver-address> <boc-filename>
```

여기서:

- `<num-threads>`는 채굴에 사용하려는 CPU 코어 수입니다.
- `<timeout-in-sec>`는 채굴자가 실패를 인정하기 전에 실행할 수 있는 최대 시간(초)입니다.
- `<your-wallet-address>`는 당신의 지갑 주소(아직 초기화되지 않았을 수도 있음) 입니다. 이는 마스터체인이나 워크체인에 있을 수 있습니다(검증자를 제어하려면 마스터체인 지갑이 필요함).
- `<seed>` 및 `<complexity>`은 get-method `get-pow-params`를 실행하여 얻은 가장 최근 값입니다.
- `<pow-giver-address>`는 선택한 proof-of-work giver 스마트 컨트랙트의 주소입니다.
- `<boc-filename>`는 성공 시 작업 증명이 포함된 외부 메시지가 저장되는 출력 파일의 파일명입니다.

예를 들어 지갑 주소가 `kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7`인 경우, 다음과 같이 실행할 수 있습니다:

```
$ crypto/pow-miner -vv -w7 -t100 kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN mined.boc
```

프로그램은 일정 시간(이 경우 최대 100초) 동안 실행된 후 성공적으로 종료(종료 코드 0)되고 필요한 작업 증명을 `mined.boc` 파일에 저장하거나, 작업 증명을 찾을 수 없는 경우 종료 코드가 0이 아닌 상태로 종료됩니다.

실패한 경우 다음과 같은 메시지가 표시됩니다:

```
   [ expected required hashes for success: 2147483648 ]
   [ hashes computed: 1192230912 ]
```

그리고 프로그램은 비정상 종료 코드를 반환하며 종료될 것입니다. 그런 다음 `seed`와 `complexity`를 다시 얻어야 합니다(더 성공적인 채굴자들의 요청 처리 결과로 인해 그동안 변경되었을 수 있기 때문입니다). 새로운 파라미터로 `pow-miner`를 다시 실행하고, 성공할 때까지 이 과정을 반복해야 합니다.

성공한 경우 다음과 같은 내용이 표시됩니다:

```
   [ expected required hashes for success: 2147483648 ]
   4D696E65005EFE49705690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1A1F533B3BC4F5664D6C743C1C5C74BB3342F3A7314364B3D0DA698E6C80C1EA4ACDA33755876665780BAE9BE8A4D6385A1F533B3BC4F5664D6C743C1C5C74BB3342F3A7314364B3D0DA698E6C80C1EA4
   Saving 176 bytes of serialized external message into file `mined.boc`
   [ hashes computed: 1122036095 ]
```

그런 다음 라이트 클라이언트를 사용하여 `mined.boc` 파일에서 proof-of-work giver 스마트 컨트랙트로 외부 메시지를 보낼 수 있습니다 (가능한 한 빨리 이 작업을 수행해야 합니다):

```
> sendfile mined.boc
... external message status is 1
```

몇 초간 기다렸다가 지갑 상태를 확인할 수 있습니다:

:::info
여기와 이후에 나오는 코드, 주석 및/또는 문서에는 "gram", "nanogram" 등의 파라미터, 메서드 및 정의가 포함될 수 있음을 유의하시기 바랍니다. 이는 Telegram이 개발한 원래 TON 코드의 유산입니다. Gram 암호화폐는 발행된 적이 없습니다. TON의 통화는 Toncoin이며, TON 테스트넷의 통화는 Test Toncoin입니다.
:::

```
> last
> getaccount kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7
...
account state is (account
  addr:(addr_std
    anycast:nothing workchain_id:0 address:x5690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1)
  storage_stat:(storage_info
    used:(storage_used
      cells:(var_uint len:1 value:1)
      bits:(var_uint len:1 value:111)
      public_cells:(var_uint len:0 value:0)) last_paid:1593722498
    due_payment:nothing)
  storage:(account_storage last_trans_lt:7720869000002
    balance:(currencies
      grams:(nanograms
        amount:(var_uint len:5 value:100000000000))
      other:(extra_currencies
        dict:hme_empty))
    state:account_uninit))
x{C005690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F12025BC2F7F2341000001C169E9DCD0945D21DBA0004_}
last transaction lt = 7720869000001 hash = 83C15CDED025970FEF7521206E82D2396B462AADB962C7E1F4283D88A0FAB7D4
account balance is 100000000000ng
```

만약 아무도 당신보다 먼저 이 `seed`와 `complexity`로 유효한 작업 증명을 보내지 않았다면, proof-of-work giver는 당신의 작업 증명을 받아들이고, 이는 지갑 잔액에 반영될 것입니다(외부 메시지를 보낸 후 10~20초 정도 걸릴 수 있습니다. 지갑 잔액을 확인하기 전에 여러 번 시도하고 `last`를 입력하여 Lite Client 상태를 새로 고치십시오). 성공한 경우, 잔액이 증가한 것을 볼 수 있습니다(지갑이 존재하지 않았다면 초기화되지 않은 상태로 생성된 것도 확인할 수 있습니다). 실패한 경우, 새로운 `seed`와 `complexity`를 얻고 채굴 과정을 처음부터 다시 반복해야 합니다.

만약 운이 좋아서 지갑의 잔액이 증가했다면, 지갑이 이전에 초기화되지 않았다면 초기화하고 싶을 것입니다 (지갑 생성에 대한 자세한 정보는 `Step-by-Step`에서 찾을 수 있습니다):

```
> sendfile new-wallet-query.boc
... external message status is 1
> last
> getaccount kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7
...
account state is (account
  addr:(addr_std
    anycast:nothing workchain_id:0 address:x5690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1)
  storage_stat:(storage_info
    used:(storage_used
      cells:(var_uint len:1 value:3)
      bits:(var_uint len:2 value:1147)
      public_cells:(var_uint len:0 value:0)) last_paid:1593722691
    due_payment:nothing)
  storage:(account_storage last_trans_lt:7720945000002
    balance:(currencies
      grams:(nanograms
        amount:(var_uint len:5 value:99995640998))
      other:(extra_currencies
        dict:hme_empty))
    state:(account_active
      (
        split_depth:nothing
        special:nothing
        code:(just
          value:(raw@^Cell 
            x{}
             x{FF0020DD2082014C97BA218201339CBAB19C71B0ED44D0D31FD70BFFE304E0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54}
            ))
        data:(just
          value:(raw@^Cell 
            x{}
             x{00000001CE6A50A6E9467C32671667F8C00C5086FC8D62E5645652BED7A80DF634487715}
            ))
        library:hme_empty))))
x{C005690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1206811EC2F7F23A1800001C16B0BC790945D20D1929934_}
 x{FF0020DD2082014C97BA218201339CBAB19C71B0ED44D0D31FD70BFFE304E0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54}
 x{00000001CE6A50A6E9467C32671667F8C00C5086FC8D62E5645652BED7A80DF634487715}
last transaction lt = 7720945000001 hash = 73353151859661AB0202EA5D92FF409747F201D10F1E52BD0CBB93E1201676BF
account balance is 99995640998ng
```

이제 100Toncoin의 행복한 소유자가 되셨습니다. 축하드립니다!

## 3. 실패 시 채굴 과정 자동화

오랜 시간 동안 Toncoin을 얻지 못했다면, 이는 너무 많은 사용자가 동일한 proof-of-work giver 스마트 계약에서 동시에 채굴하고 있기 때문일 수 있습니다. 위에 제공된 목록에서 다른 proof-of-work giver 스마트 계약을 선택해 보십시오. 또는, 간단한 스크립트를 작성하여 올바른 파라미터로 `pow-miner`를 성공할 때까지 반복적으로 실행하고(성공 여부는 `pow-miner`의 종료 코드를 확인하여 감지) `-c 'sendfile mined.boc'` 파라미터를 사용하여 외부 메시지가 발견되면 즉시 보내도록 Lite Client를 호출할 수 있습니다.



================================================
FILE: i18n/ko/docusaurus-plugin-content-docs/current/v3/develop/blockchain/sharding-lifecycle.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-docs/current/v3/develop/blockchain/sharding-lifecycle.mdx
================================================
# 무한 샤딩 패러다임

## TON 블록체인에서의 분할 및 병합 이해하기

TON(텔레그램 오픈 네트워크) 블록체인은 블록체인의 확장성과 효율성을 위한 혁신적인 개념을 도입합니다. 그 중 하나가 블록체인 아키텍처의 핵심인 분할 및 병합(Split Merge) 기능입니다. 이 짧은 글에서는 무한 샤딩 패러다임(Infinite Sharding Paradigm, ISP) 내에서의 Split Merge의 주요 측면을 탐구합니다.

#### 무한 샤딩 패러다임(ISP)과 애플리케이션

ISP는 TON 블록체인의 설계를 기반으로 하며, 각 계정을 별도의 "계정 체인(accountchain)"의 일부로 취급합니다. 이러한 계정 체인들은 효율성을 위해 샤드 체인 블록(shardchain blocks)으로 집계됩니다. 샤드 체인의 상태는 모든 계정 체인의 상태로 구성됩니다. 따라서 샤드 체인 블록은 본질적으로 자신에게 할당된 계정의 가상 블록 모음입니다.

- **ShardState**: 계정 ID의 비트 길이를 n으로 하여 Hashmap(n, AccountState)로 근사화됩니다.
- **ShardBlock**: Hashmap(n, AccountBlock)로 근사화합니다.

각 샤드 체인, 또는 더 정확히 말하면 각 샤드 체인 블록은 `workchain_id`와 계정 Id의 이진 접두사 `s`의 조합으로 식별됩니다.

## 메시지 및 인스턴트 하이퍼큐브 라우팅(Instant Hypercube Routing)

무한 샤딩 패러다임에서 각 계정(또는 스마트 컨트랙트)은 자체적으로 별도의 샤드 체인에 있는 것처럼 취급됩니다. 계정 간의 상호작용은 메시지를 전송하는 방식으로만 이루어지며, 이는 계정이 액터(actor)로 작용하는 액터 모델의 일부입니다. 샤드 체인 간의 효율적인 메시징 시스템은 TON 블록체인의 운영에 필수적입니다. TON의 특징 중 하나는 인스턴트 하이퍼큐브 라우팅(Instant Hypercube Routing)으로, 이는 샤드 체인 간의 메시지를 빠르게 전달하고 처리할 수 있게 해 주며, 한 샤드 체인의 블록에서 생성된 메시지가 대상 샤드 체인의 다음 블록에서 처리되도록 보장합니다. 이는 시스템 내의 메시지 수에 관계없이 이루어집니다.

## 샤딩 예시

![](/img/docs/blockchain-fundamentals/shardchains.jpg)

제공된 그래픽 구성표에서:

- 작업 체인의 샤드는 시간에 따라 나뉘며, 점선으로 표시됩니다.
- 블록 222, 223 및 224는 seqno=102인 마스터 체인 블록과 관련이 있습니다. 여기서 222는 하나의 샤드에 있고, 223과 224는 다른 샤드에 있습니다.
- 분할 또는 병합 이벤트가 발생하면 영향을 받는 샤드는 다음 마스터체인 블록이 발생할 때까지 일시 정지됩니다.

요약하자면, TON 블록체인의 분할 병합은 블록체인 네트워크 내에서 확장성과 상호작용을 향상시키는 복잡하지만 효율적인 메커니즘입니다. 이는 TON이 일반적인 블록체인 문제를 해결하는 접근 방식을 보여주며, 효율성과 글로벌 일관성을 강조합니다.

## 샤딩 세부 정보

#### 샤드체인의 분할 및 비분할 부분

샤드체인 블록과 상태는 두 부분으로 나뉩니다:

1. **분할 부분(Split Part)**: ISP 형식을 준수하며, 계정별 데이터를 포함합니다.
2. **비분할 부분(Non-Split Part)**: 다른 블록 및 외부와의 상호작용과 관련된 데이터를 포함합니다.

#### 다른 블록과의 상호작용

비분할 부분은 글로벌 일관성을 보장하는 데 중요하며, 내부 및 외부 지역 일관성 조건으로 축소됩니다. 이들은 다음과 같은 이유로 중요합니다:

- 샤드체인 간 메시지 전달.
- 여러 개의 샤드체인을 포함하는 트랜잭션.
- 블록의 초기 상태를 이전 블록과 대조하여 전달 보장 및 검증.

#### 인바운드 및 아웃바운드 메시지

샤드체인 블록의 비분할 부분의 주요 구성 요소는 다음과 같습니다:

- **InMsgDescr**: 블록으로 가져온 모든 메시지에 대한 설명(즉, 블록에 포함된 트랜잭션에 의해 처리되거나 출력 대기열로 전달된 메시지, `하이퍼큐브 라우팅`이 지정한 경로를 따라 이동하는 일시적 메시지의 경우).
- **OutMsgDescr**: 블록에서 내보내거나 생성한 모든 메시지에 대한 설명(즉, 블록에 포함된 트랜잭션에서 생성된 메시지 또는 현재 샤드체인에 속하지 않은 목적지를 가진 `InMsgDescr`에서 전달된 트랜짓 메시지).

#### 블록 헤더 및 검증자 서명

또 다른 비분할 구성 요소인 블록 헤더에는 `workchain_id`, `account_ids`의 이진 접두사, 블록 시퀀스 번호(이전 블록의 시퀀스 번호보다 가장 작은 음수가 아닌 정수로 정의), 논리적 시간 및 유닉스 시간 생성 등의 필수 정보가 포함되어 있습니다. 또한 해당 블록의 직전 블록(또는 이전
샤드체인 병합 이벤트의 경우 두 개의 직전 블록)의 해시, 초기 및 최종 상태(즉, 현재 블록이 처리되기 직전과 직후의 샤드체인 상태)의 해시, 샤드체인 블록이 생성될 당시 알려진 가장 최근 마스터체인 블록의 해시도 포함됩니다. 서명되지 않은 블록에 검증자 서명이 추가되어 서명된 블록이 형성됩니다.

#### 아웃바운드 메시지 큐

`OutMsgQueue`는 샤드 체인 상태에서 중요한 비분할 부분입니다. 여기에는 이 상태로 이어지는 마지막 샤드 체인 블록 또는 그 이전 블록에 의해 포함된 미전달 메시지가 `OutMsgDescr`에 포함되어 있습니다. 초기에는 각 발신 메시지가 `OutMsgQueue`에 포함되어 저장되며, 처리가 되거나 목적지로 전달될 때까지 대기합니다.

#### 샤드 분할 및 병합 메커니즘

동적 샤딩의 맥락에서, 샤드 구성은 분할 및 병합 이벤트로 인해 변경될 수 있습니다. 이러한 이벤트는 마스터 체인 블록과 동기화됩니다. 예를 들어, 분할 또는 병합이 발생하면 영향을 받는 샤드는 다음 마스터 체인 블록을 기다린 후에 진행합니다.

## 참고 항목

- [블록 레이아웃](/develop/data-formats/block-layout)
- [백서](/learn/docs)



================================================
FILE: i18n/ko/docusaurus-plugin-content-docs/current/v3/develop/blockchain/shards.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-docs/current/v3/develop/blockchain/shards.mdx
================================================
# 샤드

:::warning
페이지가 개발 중입니다.
:::

샤딩은 [데이터베이스 설계](https://en.wikipedia.org/wiki/Shard_(database_architecture))에서 기원한 성숙한 개념입니다. 이는 하나의 논리적 데이터 세트를 여러 데이터베이스에 나누어 분산시키는 것으로, 이 데이터베이스들은 서로 독립적이며 여러 서버에 배포될 수 있습니다.
간단히 말해, 샤딩은 수평적 확장성을 가능하게 합니다 - 데이터를 독립적인 여러 조각으로 나누어 병렬로 처리할 수 있게 하는 것입니다. 이는 데이터에서 [빅 데이터](https://en.wikipedia.org/wiki/Big_data)로의 전환에서 중요한 개념입니다.
데이터 세트가 전통적인 방법으로 처리하기에는 너무 커질 때, 더 작게 분할하지 않으면 확장할 다른 방법이 없습니다.

TON 블록체인의 샤딩 메커니즘은 많은 수의 거래를 처리할 수 있게 합니다.
TON 블록체인은 하나의 마스터체인과 최대 2<sup>32</sup>개의 워크체인으로 구성됩니다. 각 워크체인은 자체 규칙을 가진 별도의 체인입니다. 각 워크체인은 2<sup>60</sup>개의 샤드체인 또는 하위 샤드로 추가로 분할될 수 있으며, 이는 워크체인의 상태의 일부를 포함합니다. 현재 TON에서는 하나의 워크체인, 즉 베이스체인만 운영되고 있습니다.
TON에서 샤딩의 주요 아이디어는 계정 A가 계정 B에 메시지를 보내고 계정 C가 계정 D에 메시지를 보낼 때, 이 두 작업이 비동기적으로 수행될 수 있다는 것입니다.

기본적으로 베이스체인 (`workchain=0`)에는 샤드 번호 `0x8000000000000000` (또는 이진 표현으로 `1000000000000000000000000000000000000000000000000000000000000000`)인 하나의 샤드만 존재합니다. 마스터체인 (`workchain=-1`)은 항상 하나의 샤드만 가집니다.

## 마스터체인

마스터체인은 네트워크 구성과 모든 워크체인의 최종 상태를 저장하는 주요 체인입니다. 이를 마스터체인이 생태계의 모든 샤드에 대한 단일 진실의 원천이자 핵심 디렉토리로 이해할 수 있습니다.

마스터체인은 현재 설정, 활성 검증자 목록과 그들의 스테이크, 활성 워크체인 및 관련 샤드체인을 포함한 기본 프로토콜 정보를 담고 있습니다. 가장 중요한 것은 모든 워크체인과 샤드체인의 최신 블록 해시를 기록하여 네트워크 전반에 걸친 합의를 강제하는 것입니다.

## 워크체인

마스터체인은 워크체인이라고 불리는 개별 체인으로 분할됩니다. 워크체인은 특정 거래나 사용 사례에 맞게 맞춤화된 블록체인으로, TON 네트워크 내에서 병렬로 작동합니다.

## 차별화

TON 블록체인을 설계할 때, 샤딩을 활용하는 다른 블록체인과 차별화되는 두 가지 주요 결정이 있었습니다. 

첫째, TON은 네트워크 부하에 따라 블록체인을 동적으로 분할합니다. 거래 수가 임계 수준에 도달하면 블록체인은 자동으로 두 개의 별도 샤드체인으로 분할됩니다. 
한쪽 부분의 부하가 계속 증가하면 다시 절반으로 분할되며, 이 과정은 필요에 따라 계속됩니다. 거래 수가 감소하면 샤드는 다시 합쳐질 수 있습니다. 
이 적응형 모델은 주어진 시간에 필요한 만큼의 샤드를 생성할 수 있게 합니다.

TON을 차별화하는 두 번째 솔루션은 샤드 수의 비고정 원칙입니다. 이더리움 2.0과 같이 고정된 샤드 수(64개 샤드)를 지원하는 시스템과 달리, TON은 네트워크의 필요에 따라 샤드를 계속 추가할 수 있으며, 이론적으로는 워크체인당 2<sup>60</sup>개의 샤드를 한도로 설정하고 있습니다. 이 숫자는 매우 커서 사실상 무한대이며, 지구상의 모든 사람에게 1억 개 이상의 샤드를 제공하고도 남을 수 있습니다. 이 접근 방식은 사전에 예측하기 어려운 동적 확장 요구를 충족하는 유일한 방법입니다.

![](/img/docs/blockchain-fundamentals/scheme.png)

## 분할

TON 블록체인에서 단일 계정의 거래 순서(예: `Tx1 -> Tx2 -> Tx3 -> ...`)를 계정 트래잭션 체인 또는 <b>계정체인</b>이라고 합니다. 이는 단일 계정과 관련된 거래의 연속임을 강조합니다.
여러 개의 <b>AccountChains</b>가 단일 샤드 내에서 결합하여 <b>ShardChain</b>을 형성합니다. <b>ShardChain</b> (이하 샤드)은 샤드 내 모든 거래를 저장하고 처리하는 역할을 하며, 각 거래 체인은 특정 계정 그룹에 의해 정의됩니다. 

이 계정 그룹들은 공통 이진 접두사로 표시되며, 이는 동일 샤드에 클러스터링하는 기준으로 사용됩니다.
이 접두사는 샤드 ID에 나타나며 64비트 정수로 표현됩니다. 그 구조는 다음과 같습니다: `<binary prefix>100000...`. 예를 들어, ID가 `1011100000...`인 샤드는 접두사 `1011`로 시작하는 모든 계정을 포함합니다.

어떤 샤드의 거래 수가 증가하면, 이 샤드는 두 개의 샤드로 분할됩니다. 새로운 샤드는 다음과 같은 ID를 얻습니다: `<parent prefix>01000...`과 `<parent prefix>11000...`이며, 각각 `<parent prefix>0`과 `<parent prefix>1`로 시작하는 계정을 담당하게 됩니다. 샤드의 블록 일련 번호는 부모의 마지막 일련 번호에 1을 더한 값부터 연속적으로 시작합니다. 분할 후, 샤드는 독립적으로 작동하며 서로 다른 일련 번호를 가질 수 있습니다.

간단한 예:
![](/img/docs/blockchain-fundamentals/shardchains-split.jpg)

마스터체인 블록은 헤더에 샤드에 대한 정보를 포함합니다. 샤드의 블록이 마스터체인 헤더에 나타나면, 해당 블록은 완료된 것으로 간주되며(롤백할 수 없음) 최종적으로 확정됩니다.

실제 예:

- 마스터체인 블록 `seqno=34607821`은 두 개의 샤드를 포함합니다: `(0,4000000000000000,40485798)`와 `(0,c000000000000000,40485843)` (https://toncenter.com/api/v2/shards?seqno=34607821).
- 샤드 `shard=4000000000000000`는 `shard=2000000000000000`과 `shard=6000000000000000`으로 분할되었으며, 마스터체인 블록 `seqno=34607822`는 세 개의 샤드를 가지게 됩니다: `(0,c000000000000000,40485844)`, `(0,2000000000000000,40485799)` 그리고 `(0,6000000000000000,40485799)`. 두 새로운 샤드는 동일한 일련 번호(seqnos)를 가지지만 다른 샤드 ID를 가지고 있다는 점에 유의하십시오 (https://toncenter.com/api/v2/shards?seqno=34607822).
- 새로운 샤드는 독립적으로 작동하며, 100개의 마스터체인 블록 후(마스터체인 블록 `seqno=34607921`), 한 샤드는 마지막 블록으로 `(0,2000000000000000,40485901)`을 가지며 다른 하나는 `(0,6000000000000000,40485897)`을 가집니다 (https://toncenter.com/api/v2/shards?seqno=34607921).

## 병합

샤드에 대한 부하가 줄어들면 다시 병합할 수 있습니다:

- 두 샤드는 공통 부모를 가지고 있어야 병합할 수 있으며, 따라서 샤드 ID는 `<parent prefix>010...`와 `<parent prefix110...`이어야 합니다. 병합된 샤드는 샤드 ID `<parent prefix>10...`을 갖게 됩니다(예: `10010...` + `10110...` = `1010...`). 병합된 샤드의 첫 번째 블록은 `seqno=max(seqno1, seqno2) + 1`을 가집니다.

간단한 예:
![](/img/docs/blockchain-fundamentals/shardchains-merge.jpg)

실제 예:

- 마스터체인 블록 `seqno=34626306`에서, 마지막 블록이 `(0,a000000000000000,40492030)`와 `(0,e000000000000000,40492216)`인 다섯 개의 샤드 중 두 개가 병합되어 블록 `(0,c000000000000000,40492217)`이 되었습니다 (https://toncenter.com/api/v2/shards?seqno=34626306 및 https://toncenter.com/api/v2/shards?seqno=34626307).

## 참고 항목

- [무한 샤딩 패러다임](sharding-lifecycle)
- [백서](/learn/docs)



================================================
FILE: i18n/ko/docusaurus-plugin-content-docs/current/v3/develop/companies/auditors.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-docs/current/v3/develop/companies/auditors.mdx
================================================
import Button from '@site/src/components/button'

# 보안 보증 제공자(SAP)

:::info
다음 품질 보증 제공자와 함께 소프트웨어를 테스트하세요.
:::

## 주요 TON 블록체인 SAP

- [quantstamp.com](https://quantstamp.com/)
- [zellic.io](https://www.zellic.io/)

## TON 생태계 SAP

- [hackenproof.com](https://hackenproof.com/)
- [hexens.io](https://hexens.io/)
- [scalebit](https://www.scalebit.xyz/)
- [skynet.certik.com](https://skynet.certik.com/)
- [slowmist.com](https://slowmist.com/)
- [softstack.io formerly Chainsulting](https://softstack.io/)
- [trailofbits.com](https://www.trailofbits.com/)
- [vidma.io](https://vidma.io/)

## 새로운 SAP 추가

새로운 TON 보안 제공자로서 목록에 포함되기를 원하시면, 양식을 작성해 주세요.

<Button href="https://2jfouh4c.paperform.co/" colorType={'primary'} sizeType={'sm'}>

새로운 SAP 추가

</Button>

## 참고 항목

- [외주 개발](/develop/companies/outsource)
- [톤 구직](https://jobs.ton.org/jobs)



================================================
FILE: i18n/ko/docusaurus-plugin-content-docs/current/v3/develop/companies/outsource.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-docs/current/v3/develop/companies/outsource.mdx
================================================
import Button from '@site/src/components/button'

# 외주 개발

## 외주 팀 목록

TON 프로젝트를 위한 타사 개발팀 찾기

- [Astralyx](#astralyx)
- [Blockczech R&D Lab](#blockczech-rd-lab)
- [Coinvent](#coinvent)
- [EvaCodes](#evacodes)
- [Pixelplex](#pixelplex)
- [softstack](#softstack)

### Astralyx

#### 요약

TON 및 기타 체인 개발에 큰 경험을 가진 회사. 디자인, 텔레그램 미니 애플리케이션(TMA), 웹사이트 등 무엇이든 제작을 요청하실 수 있습니다.

#### 업무 흐름

- TON 스마트 컨트랙트 개발(감사 및 테스트 포함)
- 웹 2.0 및 웹 3.0 개발
- 디자인, 예술, 프로젝트용 리드 대여

#### 프로젝트

- [t.me/xjetswapbot](http://t.me/xjetswapbot) (프론트엔드, 디자인),
- [github.com/astralyxdev/lockup-jettons-contract](http://github.com/astralyxdev/lockup-jettons-contract) (스마트 컨트랙트, 웹 인터페이스, 테스트)
- [github.com/astralyxdev/ton-proxy](http://github.com/astralyxdev/ton-proxy) (TON Proxy extension, 첫 번째)
- [store.devdao.io](http://store.devdao.io) (프론트엔드, 디자인)
- [scaleton.io](http://scaleton.io) (랜딩, 프론트엔드, 디자인)
- [burn.astralyx.dev](http://burn.astralyx.dev) (프론트엔드, 디자인, TON에서 SBT NFT를 소각하는 서비스)

#### 연락처

[astralyx.dev](http://astralyx.dev), contact@astralyx.dev

### Blockczech R&D Lab

#### 요약

게임과 e스포츠를 위한 블록체인 기반 솔루션에 중점을 둔 웹3.0 소프트웨어 하우스이자 스타트업 스튜디오입니다.

#### 업무 흐름

- dApps
- TMA 개발
- 블록체인 게임
- 통합

#### 프로젝트

- [TCG.world](http://TCG.world)
- [cryptomeda.tech ](http://cryptomeda.tech)
- [liithos.com](http://liithos.com)
- [x.la/contracts/](http://x.la/contracts/)
- [Blockczech R&D Lab 소개](https://docs.google.com/presentation/d/1htMH1ihm31wQSn08ZziFfK6NpbPSHA3M/edit?usp=sharing&ouid=105247529013711719883&rtpof=true&sd=true)

#### 연락처

- http://blockczech.io
- [@blockczech](https://t.me/blockczech)

### Coinvent

#### 요약

코인벤트는 성공적인 프로젝트를 만들기 위해 열정적으로 노력하는 전담 외주 개발팀입니다. 간단한 봇 제작부터 복잡한 디파이 프로토콜 개발까지 다양한 전문 지식을 보유하고 있습니다.

#### 업무 흐름

- 스마트 컨트랙트
- DeFi, NFT
- dApps, 텔레그램 미니 앱
- 일반적인 Web2
- 텔레그램 봇

#### 프로젝트

- [Tonraffles Lock module](https://tonraffles.app/lock) (스마트 컨트랙트, 프론트엔드)
- [Tonraffles NFT Launchpad](https://tonraffles.app/nft/launchpad) (스마트 컨트랙트)
- [OOIA shopping cart feature](https://testnet.ooia.art/) (스마트 컨트랙트)
- [Monaki NFT Staking](https://www.monaki.life/) (스마트 컨트랙트)

#### 연락처

- [coinvent.dev](https://coinvent.dev)
- [@coinvent_dev](https://t.me/coinvent_dev)
- contact@coinvent.dev

### EvaCodes

#### 요약

EvaCodes는 우크라이나, 아르메니아, 폴란드에 팀을 두고 있는 동유럽 최고의 블록체인 개발 회사입니다. 이 회사는 50명 이상의 숙련된 개발자로 구성되어 있으며, 웹3 뱅킹 솔루션, L1 블록체인, 웹3 인프라를 포함하여 60개 이상의 웹3 솔루션을 제공했습니다.

#### 업무 흐름

- DeFi
- 암호화폐 지갑
- NFT 기반 솔루션

#### 프로젝트

- [alium.finance](https://alium.finance/)
- [trush.io](https://trush.io/)
- [konsta.network](https://konsta.network/)

#### 연락처

- ton@evacodes.com
- [evacodes.com](https://evacodes.com/)
- 텔레그램 [@salesevacodes](https://t.me/salesevacodes)

### Pixelplex

#### 요약

PixelPlex는 안전하고 확장 가능한 블록체인 기반 솔루션을 제공하는 데 있어 두드러집니다. 강력한 프로토콜에서 고급 리스크 관리 시스템에 이르기까지 다양한 서비스를 제공합니다. 실질적인 결과를 도출하고 프로젝트 가치를 향상시키는 데 중점을 둔 PixelPlex는 다른 곳에서 어려움을 겪는 복잡한 문제들을 능숙하게 해결합니다. 이 회사의 전문성은 핀테크, 헬스케어, 부동산, 전자상거래를 포함한 다양한 산업에서 450개 이상의 프로젝트에 걸쳐 있습니다.

#### 업무 흐름

- 생태계에 구애받지 않는 개발
- 맞춤형 프로토콜 엔지니어링
- 디파이(DeFi) 강화
- ZK 롤업 확장 솔루션
- 스마트 컨트랙트 최적화
- NFT 지원 솔루션
- 증권형 토큰 발행

#### 프로젝트

- [web3antivirus.io](https://web3antivirus.io)
- [qtum.org](https://qtum.org)
- [blackfort.exchange](https://blackfort.exchange/)
- [patientory.com](https://patientory.com/)
- [cyndicate.io](https://cyndicate.io)
- [streamsettle.com](https://streamsettle.com/)
- [savage.app](https://savage.app/marketplace)

#### 연락처

- [pixelplex.io](https://pixelplex.io)
- [info@pixelplex.io](mailto:info@pixelplex.io)

### 소프트스택

#### 요약

Softstack은 2017년부터 소프트웨어 개발 및 스마트 계약 감사에 중점을 둔 종합적인 Web3 솔루션의 선도적인 서비스 제공업체입니다. 독일에서 제작되었습니다.

#### 업무 흐름

- 스마트 컨트랙트 & dApp 개발
- 디지털 자산 지갑
- 텔레그램 미니앱 & 봇
- 사이버 보안(스마트 계약 감사, 침투 테스트)

#### 프로젝트

- [DeGods](https://degods.com)
- [tixbase](https://tixbase.com)
- [TMRW Foundation](https://tmrw.com)
- [Bitcoin.com](https://bitcoin.com)
- [Coinlink Finance](https://coinlink.finance)

#### 연락처

- hello@softstack.io
- [softstack.io](https://softstack.io/)
- 텔레그램 [@yannikheinze](https://t.me/yannikheinze)

## 팀 추가

TON 에코시스템의 외부 에이전트가 될 준비가 되었다면, 양식을 작성하거나 풀 리퀘스트(Pull request)를 제출하여 회사를 홍보할 수 있습니다.

<Button href="https://hvmauju3.paperform.co/" colorType={'primary'} sizeType={'sm'}>

팀 추가

</Button>

<Button href="https://github.com/ton-community/ton-docs/tree/main/docs/develop/companies/outsource.mdx"
        colorType="secondary" sizeType={'sm'}>

PR로 요청하기

</Button>

<br></br><br></br>

## 참고 항목

- [보안 보증 제공자](/develop/companies/auditors)



================================================
FILE: i18n/ko/docusaurus-plugin-content-docs/current/v3/develop/dapps/apis/adnl.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-docs/current/v3/develop/dapps/apis/adnl.md
================================================
# TON ADNL API

:::tip

블록체인에 연결하는 방법에는 여러 가지가 있습니다:

1. RPC 데이터 제공자나 다른 API: 대부분의 경우, 안정성과 보안을 **신뢰**해야 합니다.
2. **ADNL 연결**: [라이트서버](/participate/run-nodes/liteserver)에 연결합니다. 이들은 접근할 수 없을 수도 있지만, 특정 수준의 검증(라이브러리에 구현됨)을 통해 거짓 정보를 제공할 수는 없습니다.
3. Tonlib 바이너리: 라이트서버에 연결하는 점은 동일하지만, 동적 로딩 라이브러리를 포함하고 있어 추가적인 장점과 단점이 존재합니다.
4. 오프체인 전용: 이러한 SDK는 셀을 생성하고 직렬화하여 API로 전송할 수 있습니다.

:::

클라이언트는 바이너리 프로토콜을 사용하여 라이트서버(노드)에 직접 연결합니다.

클라이언트는 키블록, 계정의 현재 상태, 그리고 **머클 증명**을 다운로드하여 수신한 데이터의 유효성을 보장합니다.

읽기 작업(예: get-method 호출)은 다운로드 및 검증된 상태로 로컬 TVM을 실행하여 수행됩니다. 블록체인의 전체 상태를 다운로드할 필요는 없으며, 작업에 필요한 것만 다운로드합니다.

공개 라이트서버에 글로벌 구성([메인넷](https://ton.org/global-config.json) 또는 [테스트넷](https://ton.org/testnet-global.config.json))에서 연결하거나, 자체 [라이트서버](/participate/nodes/node-types)를 운영하고 [ADNL SDK](/develop/dapps/apis/sdk#adnl-based-sdks)로 이를 처리할 수 있습니다.

머클 증명](/개발/데이터-포맷/증명)에 대한 자세한 내용은 [TON 백서](https://ton.org/ton.pdf) 2.3.10, 2.3.11에서 확인할 수 있습니다.

글로벌 구성의 공개 라이트서버는 TON을 빠르게 시작하는 데 도움을 줍니다. TON 프로그래밍을 배우거나, 100% 가동 시간을 필요로 하지 않는 애플리케이션 및 스크립트에 사용할 수 있습니다.

프로덕션 인프라를 구축하려면 잘 준비된 인프라를 사용하는 것이 좋습니다:

- [자체 라이트서버 설정](https://docs.ton.org/participate/run-nodes/full-node#enable-liteserver-mode),
- 라이트서버 프리미엄 제공업체 [@liteserver_bot](https://t.me/liteserver_bot) 사용

## 장단점

- ✅ 신뢰성. 머클 증명 해시를 사용하여 들어오는 바이너리 데이터를 검증하는 API를 사용합니다.

- ✅ 보안성. 머클 증명을 검증하기 때문에 신뢰할 수 없는 라이트서버도 사용할 수 있습니다.

- ✅ 빠른 속도. HTTP 미들웨어를 사용하지 않고 TON 블록체인 노드에 직접 연결합니다.

- ❌ 복잡성. 문제를 해결하는 데 더 많은 시간이 필요합니다.

- ❌ 백엔드 우선. 웹 프론트엔드와 호환되지 않거나 HTTP-ADNL 프록시가 필요합니다 (비 HTTP 프로토콜용으로 구축됨).

## API 참조

서버에 대한 요청과 응답은 특정 프로그래밍 언어에 대한 타입 인터페이스를 생성할 수 있도록 하는 [TL](/develop/data-formats/tl) 스키마에 의해 설명됩니다.

[TonLib TL 스키마](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl)



================================================
FILE: i18n/ko/docusaurus-plugin-content-docs/current/v3/develop/dapps/apis/getblock-ton-api.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-docs/current/v3/develop/dapps/apis/getblock-ton-api.md
================================================
# GetBlock의 TON API

이 가이드는 GetBlock을 통해 개인 RPC 엔드포인트를 획득하고 사용하는 필수 단계를 다루며, 이를 통해 TON 블록체인에 접근할 수 있습니다.

:::info
[GetBlock](https://getblock.io/)은 HTTP 기반 API 엔드포인트를 제공하여 클라이언트가 TON을 포함한 다양한 블록체인 네트워크와 상호작용할 수 있도록 하는 Web3 인프라 제공업체입니다.
:::

## TON 블록체인 엔드포인트 액세스 방법

GetBlock의 엔드포인트를 사용하려면, 사용자 계정에 로그인하여 TON 엔드포인트 URL을 받아야 합니다. 자세한 단계는 아래를 참고하세요.

### 1. GetBlock 계정 생성

GetBlock [웹사이트](https://getblock.io/?utm_source=external\&utm_medium=article\&utm_campaign=ton_docs)를 방문하여 메인 페이지의 "Get Started for Free" 버튼을 찾습니다. 이메일 주소를 사용하거나 MetaMask 지갑을 연결하여 계정에 가입합니다.

![GetBlock.io\_main\_page](/img/docs/getblock-img/unnamed-2.png?=RAW)

### 2. TON 블록체인을 선택

로그인 후, 대시보드로 이동됩니다. "My Endpoints" 섹션을 찾은 후 "Protocols" 드롭다운 메뉴에서 "TON"을 선택합니다.

원하는 네트워크와 API 타입(JSON-RPC 또는 JSON-RPC(v2))을 선택합니다.

![GetBlock\_계정\_\_대시보드](/img/docs/getblock-img/unnamed-4.png)

### 3. 엔드포인트 URL 생성

"Get" 버튼을 클릭하여 TON 블록체인 엔드포인트 URL을 생성합니다.

GetBlock API의 모든 엔드포인트는 `https://go.getblock.io/[ACCESS TOKEN]/`과 같은 일관된 구조를 따릅니다.

이 접근 토큰은 각 사용자 또는 애플리케이션에 대한 고유 식별자로 작동하며, 요청을 적절한 엔드포인트로 라우팅하는 데 필요한 정보를 포함하고 있어 민감한 세부 정보를 노출하지 않습니다. 이는 별도의 승인 헤더나 API 키가 필요 없게 합니다.

사용자는 여러 엔드포인트를 생성하고, 토큰이 유출된 경우 교체하거나, 사용하지 않는 엔드포인트를 삭제할 수 있는 유연성을 갖추고 있습니다.

![GetBlock\_계정\_끝점](/img/docs/getblock-img/unnamed-3.png)

이제 이러한 URL을 사용하여 TON 블록체인과 상호작용하고, 데이터를 조회하고, 트랜잭션을 전송하며, 인프라 설정 및 유지 관리의 번거로움 없이 분산 애플리케이션을 구축할 수 있습니다.

### 무료 요청 및 사용자 제한

모든 등록된 GetBlock 사용자는 40,000회의 무료 요청을 받을 수 있으며, 이는 초당 60회의 요청(RPS)으로 제한됩니다. 요청 잔액은 매일 갱신되며, 지원되는 블록체인의 모든 공유 엔드포인트에서 사용할 수 있습니다.

향상된 기능과 성능을 원할 경우, 유료 옵션을 탐색할 수 있으며, 이는 아래에 설명되어 있습니다.

GetBlock.io는 두 가지 유형의 요금제를 제공합니다: 공유 노드와 전용 노드. 클라이언트는 자신의 요구와 예산에 따라 요금제를 선택할 수 있습니다.

### 공유 노드

- 여러 클라이언트가 동시에 동일한 노드를 사용하는 초기 진입 기회;
- 초당 요청 수(RPS)가 200으로 증가;
- 개인 사용 또는 완전한 생산 애플리케이션에 비해 낮은 거래량과 자원 요구 사항을 가진 애플리케이션에 적합;
- 제한된 예산을 가진 개인 개발자나 소규모 팀에게 더 경제적인 옵션.

공유 노드는 상당한 초기 투자나 약정 없이 TON 블록체인 인프라에 접근할 수 있는 비용 효율적인 솔루션을 제공합니다.

개발자가 애플리케이션을 확장하고 추가 자원을 필요로 할 경우, 구독 요금제를 쉽게 업그레이드하거나 필요에 따라 전용 노드로 전환할 수 있습니다.

### 전용 노드

- 하나의 노드가 단독으로 한 클라이언트에게만 할당;
  요청 제한 없음;
- 아카이브 노드, 다양한 서버 위치 및 사용자 지정 설정에 대한 접근 허용;
- 프리미엄 수준의 서비스와 지원 보장;

이는 높은 처리량, 빠른 노드 연결 속도, 확장 시 보장된 자원을 필요로 하는 개발자 및 분산 애플리케이션(dApps)을 위한 차세대 솔루션입니다.

## GetBlock의 TON HTTP API 사용 방법

이 섹션에서는 GetBlock이 제공하는 TON HTTP API의 실용적인 사용법을 다룹니다. 생성된 엔드포인트를 효과적으로 사용하는 방법을 예시를 통해 살펴보겠습니다.

### 일반적인 API 호출의 예

먼저, curl 명령어를 사용하여 특정 주소의 잔액을 조회하는 ‘/getAddressBalance’ 메서드를 간단히 예로 들어보겠습니다.

```
curl --location --request GET 'https://go.getblock.io/<ACCESS-TOKEN>/getAddressBalance?address=EQDXZ2c5LnA12Eum-DlguTmfYkMOvNeFCh4rBD0tgmwjcFI-' \

--header 'Content-Type: application/json'
```

`ACCESS-TOKEN`을 GetBlock에서 제공한 실제 액세스 토큰으로 교체하세요.

이 명령어는 해당 주소의 잔액을 나노톤(nanotons) 단위로 출력합니다.

![겟어드레스밸런스\_응답\_온\_TON\_블록체인](/img/docs/getblock-img/unnamed-2.png)

TON 블록체인을 쿼리할 수 있는 다른 방법도 있습니다:

| # | 메서드  | 엔드포인트              | 설명                                                                            |
| - | ---- | ------------------ | ----------------------------------------------------------------------------- |
| 1 | GET  | getAddressState    | 지정된 주소의 현재 상태(초기화되지 않음, 활성, 또는 동결)를 반환합니다. |
| 2 | GET  | getMasterchainInfo | 마스터체인의 상태에 대한 정보를 가져옵니다.                                      |
| 3 | GET  | getTokenData       | 지정된 TON 계정과 관련된 NFT 또는 Jetton의 세부 정보를 검색합니다.                  |
| 4 | GET  | packAddress        | TON 주소를 원시 형식에서 사람이 읽을 수 있는 형식으로 변환합니다.                       |
| 5 | POST | sendBoc            | 직렬화된 BOC 파일과 외부 메시지를 블록체인에 전송하여 실행합니다.                        |

GetBlock의 [문서](https://getblock.io/docs/ton/json-rpc/ton_jsonrpc/)를 참조하여 추가 메서드 목록과 예제 및 종합적인 API 참조를 확인하세요.

### 스마트 컨트랙트 배포

개발자는 동일한 엔드포인트 URL을 사용하여 TON 블록체인에 컨트랙트를 원활하게 배포할 수 있습니다.

라이브러리는 GetBlock HTTP API 엔드포인트를 통해 네트워크에 연결하기 위해 클라이언트를 초기화합니다.

![TON 블루프린트 IDE 이미지](/img/docs/getblock-img/unnamed-6.png)

이 튜토리얼은 GetBlock의 API를 사용하여 TON 블록체인을 효과적으로 활용하려는 개발자에게 종합적인 가이드를 제공할 것입니다.

웹사이트](https://getblock.io/?utm_source=external&utm_medium=article&utm_campaign=ton_docs)에서 자세한 내용을 확인하거나 라이브 채팅, [텔레그램](https://t.me/GetBlock_Support_Bot) 또는 웹사이트 양식을 통해 겟블록의 지원팀에 문의해 주세요.



================================================
FILE: i18n/ko/docusaurus-plugin-content-pages/index.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-pages/index.tsx
================================================
import React from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import {firstRow} from "./index/features";
import ContentBlock from "@site/src/components/contentBlock";
import './index/index.module.css'

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (

    <Layout title={"Start"} description={"Learn about the basics of blockchain and TON and how to get started. TON is blockchain of blockchains with a masterchain to rule them all. You can learn more about general architecture in Basic Concepts section."}>
      <div
        className="bootstrap-wrapper"
      >
        <br/>
        <h1 style={{ fontWeight: '650', textAlign:'center', padding: '0 10px' }}>Welcome to the TON Blockchain documentation</h1>
        <p style={{ textAlign:'center', fontWeight: '400', fontSize:'18px' }}>Choose your path to start journey 🚀</p>

        <div className="container">

          <div id="Get Started" className="row">
            {firstRow &&
                                  firstRow.length &&
                                  firstRow.map((props, idx) => (
                                    <ContentBlock key={idx} {...props} />
                                  ))}{" "}
          </div>

          <br/>
          <br/>
        </div>
      </div>
    </Layout>
  );
}



================================================
FILE: i18n/ko/docusaurus-plugin-content-pages/index/features.js
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-pages/index/features.js
================================================
export const firstRow = [
  {
    title: "What is TON?",
    status: "Beginner",
    linkUrl: "/v3/concepts/dive-into-ton/introduction",
    imageUrl: "img/ton_symbol_old.svg",
    description: "Learn about the basics of blockchain and TON and how to get started."
  },
  {
    title: "Develop",
    status: "Intermediate",
    linkUrl: "/v3/documentation/ton-documentation",
    imageUrl: "img/ton_symbol_old.svg",
    description: "Build smart contracts, web applications or bots using TON."
  },
  {
    title: "Participate",
    status: "Beginner",
    linkUrl: "/participate/",
    imageUrl: "img/ton_symbol_old.svg",
    description: "Take part in TON by staking, running node or even become a Validator!"
  },
  // {
  //   title: "Integrator",
  //   status: "Intermediate",
  //   linkUrl: "/integrate/quickstart",
  //   imageUrl: "img/logo.svg",
  //   description: "Integrate an application, tool, wallet, oracle, and more with Polygon."
  // },
];




================================================
FILE: i18n/ko/docusaurus-plugin-content-pages/index/index.module.css
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ko/docusaurus-plugin-content-pages/index/index.module.css
================================================
/**
 * CSS files with the .module.css suffix will be treated as CSS modules
 * and scoped locally.
 */

.heroBanner {
  padding: 4rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

@media screen and (max-width: 996px) {
  .heroBanner {
    padding: 2rem;
  }
}

.buttons {
  display: flex;
  align-items: center;
  justify-content: center;
}



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/go-from-ethereum/blockchain-services.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/go-from-ethereum/blockchain-services.md
================================================
# Блокчейн сервисы

## Система доменных имен

В Ethereum пользователи используют cервис доменных имен Ethereum Name Service (ENS), который является децентрализованной системой имен, построенной на основе блокчейна Ethereum.

В свою очередь блокчейн TON использует встроенную систему доменных имен, известную как TON DNS. Это децентрализованный сервис, который позволяет пользователям регистрировать понятные для человека доменные имена для своих смарт-контрактов, веб-сайтов или любого другого онлайн-контента. Такое устройство облегчает взаимодействие с децентрализованными приложениями (DApps) и другими ресурсами на блокчейне TON. Система DNS в TON функционирует аналогично традиционным системам DNS в Интернете, но ее децентрализованная природа устраняет необходимость в централизованном органе для контроля и управления доменными именами, тем самым снижая риски цензуры, мошенничества и перехвата доменных имен.

## WWW

TON WWW — это часть блокчейна TON, которая позволяет создавать и взаимодействовать с децентрализованными веб-сайтами напрямую через блокчейн. В отличие от традиционных веб-сайтов, веб-сайты на TON доступны через специальные URL-адреса, заканчивающиеся на `.ton`, и поддерживают уникальные гиперссылки формата `ton://`, которые позволяют проводить транзакции и другие операции непосредственно из URL-адреса.

Одной из ключевых особенностей TON WWW является возможность прямой привязки криптокошельков к доменным именам, что позволяет пользователям отправлять криптовалюту на адреса типа alice.place.ton без передачи дополнительных данных. Это значительно упрощает процесс создания пожертвований и платежей, делая его более интуитивным и удобным.

## Прокси

TON Proxy — это инструмент на основе протокола TON, который обеспечивает высокий уровень безопасности и анонимности. Все данные, которые передаются через TON Proxy, зашифрованы, что в свою очередь позволяет защитить конфиденциальную информацию пользователей.

Одним из ключевых преимуществ TON Proxy является его способность обходить блокировки, накладываемые интернет-провайдерами или государственными органами. Это делает его незаменимым инструментом для пользователей, которым необходим свободный доступ к информации в Интернете без ограничений.

Более того, TON Proxy также позволяет ускорить скорость подключения к Интернету. Он автоматически выбирает серверы с наименьшей нагрузкой, что улучшает качество соединения и скорость доступа к Интернету.

## Децентрализованное хранилище

Ethereum не подходит для хранения больших объемов данных. Поэтому под децентрализованным хранилищем на Ethereum обычно подразумевается использование распределенных файловых систем для хранения и извлечения данных децентрализованным и безопасным образом. Одним из популярных подходов к децентрализованному хранению на Ethereum является InterPlanetary File System (IPFS), которая представляет собой одноранговую файловую систему, позволяющую пользователям хранить и извлекать файлы из сети распределенных узлов.

В свою очередь сеть TON имеет собственную децентрализованную службу хранения, которая используется блокчейном TON для хранения архивных копий блоков и данных о состоянии, снепшотов, а также может быть использована для хранения пользовательских файлов или других служб, работающих на платформе, используя технологию доступа подобную торренту. Наиболее популярным вариантом использования такой системы является хранение метаданных NFT непосредственно в хранилище TON, без использования дополнительных распределенных служб хранения файлов, таких как IPFS.

## Платежные сервисы

TON Payments — это решение для мгновенных транзакций с нулевыми сетевыми сборами на блокчейне TON. Хоть для большинства задач достаточно только блокчейна TON, некоторые приложения, такие как TON Proxy, TON Storage или определенные виды DApps, требуют микротранзакций с гораздо более высокой скоростью и меньшими затратами. Для решения этой проблемы были созданы платежные каналы, также известные как сеть Lightning. Платежные каналы позволяют двум сторонам совершать транзакции вне блокчейна, создавая специальный смарт-контракт на блокчейне со своими начальными балансами. Затем они могут выполнять неограниченное количество транзакций без каких-либо лимитов по скорости или коммисий. Сетевые сборы взимаются только при открытии и закрытии канала. Данная технология также гарантирует корректную работу между пользователями, позволяя одной стороне самостоятельно закрывать канал, если другая сторона обманывает или исчезает.




================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/go-from-ethereum/difference-of-blockchains.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/go-from-ethereum/difference-of-blockchains.md
================================================
# Различия блокчейнов

В этом разделе мы рассмотрим основные различия между блокчейном Ethereum и блокчейном TON. Анализ будет включать обзор сетевых архитектур, описывать их уникальные особенности и оценивать преимущества и недостатки каждого из них.

Начиная с обзора экосистем Ethereum и TON, стоит отметить, что обе платформы предлагают схожую структуру участников и услуг. Структура включает в себя: пользователей, которые совершают транзакции и имеют в наличии активы, валидаторов, которые поддерживают работу и безопасность сети, а также разработчиков приложений, использующих блокчейн как основу для своих продуктов и услуг. Оба экосистемы включают в себя кастодиальные, и некастодиальные сервисы, предоставляющие пользователям различные уровни контроля над их активами.

Более того, стоит отметить, что обе платформы поддерживают создание децентрализованных приложений (DApps), предоставляя разработчикам мощные инструменты и стандарты для разработки.

Однако, несмотря на сходства в общей структуре и предлагаемых функциях, ключевые технологические аспекты и подходы к проектированию сети Ethereum и TON существенно различаются.Эти различия формируют основу для более глубокого понимания уникальных преимуществ, а также и ограничений каждой платформы, что в свою очередь особенно важно для разработчиков, стремящихся максимизировать возможности каждой сети.В следующих подразделах мы подробно изучим эти различия, сосредоточившись на архитектуре сети, моделях, механизмах транзакций и системе расчетов транзакций, что предоставит разработчикам необходимую основу для начала разработки.

## Архитектура блокчейна

Ethereum, наследуя и расширяя фундаментальные принципы Bitcoin, предоставляет разработчикам гибкость, необходимую для создания сложных децентрализованных приложений, DApps. Особенностью Ethereum является его способность предоставлять каждому счету индивидуальное хранилище данных, что позволяет через транзакции не только выполнять переводы токенов, но и изменять состояние блокчейна, взаимодействуя со смарт-контрактами.Эта способность синхронно взаимодействовать между счетами, как мы знаем, имеет большое значение для разработки приложений, однако в свою очередь также вызывает вопрос о масштабируемости. Каждая транзакция на сети Ethereum требует от узлов обновлять и поддерживать полное состояние блокчейна, что приводит к значительной задержке и увеличивает стоимость газа при росте сети.

В ответ на эти вызовы, TON предлагает альтернативный подход, направленный на улучшение масштабируемости и производительности. Будучи разработанным с целью предоставить разработчикам максимальную гибкость при создании различных приложений, TON использует концепцию шардов и мастерчейна для оптимизации процесса создания блоков.В каждом TON шардчейне и мастерчейне создается новый блок примерно каждые 5 секунд, обеспечивая более быстрое выполнение транзакций. В отличие от Ethereum, где обновления состояния синхронны, TON реализует асинхронное взаимодействие между смарт-контрактами, позволяя каждую транзакцию обрабатывать независимо и параллельно, что значительно ускоряет обработку транзакций в сети.Разделы и статьи для ознакомления:

- [Шарды](/v3/documentation/smart-contracts/shards/shards-intro)
- [Документ "Сравнение блокчейнов"](https://ton.org/comparison_of_blockchains.pdf)
- [Таблица сравнения блокчейнов (гораздо менее информативная, чем документ, но более наглядная)](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison)

В заключение, сравнивая архитектуру и технологические основы TON и Ethereum, становится ясно, что TON предлагает значительные преимущества. Используя инновационный подход к обработке асинхронных транзакций и уникальную архитектуру шардов и мастерчейна, TON демонстрирует потенциал для поддержки миллионов транзакций в секунду без наличия компромиссов по безопасности или централизации. Это обеспечивает платформе выдающуюся гибкость и эффективность, что делает ее идеальным выбором для широкого спектра приложений.

## Модель счетов (Ethereum) и Акторная модель (TON)

В первом подразделе мы сравнили Ethereum и TON, описав их ключевые архитектурные различия и основные вызовы, с которыми сталкивается Ethereum.Особого внимания заслуживают различия блокчейнов в рамках подходов к организации взаимодействий и использованию моделей. Эти различия возникают из-за уникальности архитектуры каждой из платформ. Разработчикам привыкшим к Ethereum важно понять эти различия, чтобы эффективно перейти на разработку в TON. Это понимание позволит адаптировать архитектуру и оптимизировать взаимодействие смарт-контрактов в новом окружении.

Давайте вспомним как работает модель счетов в Ethereum. Ethereum использует эту модель для отслеживания балансов. Как и в случае с банковской картой, доступные средства хранятся на счетах, а не отдельными монетами. Существуют два типа счетов:

- Externally-owned accounts (EOAs) – внешние управляемые счета, управляются пользователем с помощью публичных и приватных ключей. Публичный ключ позволяет другим отправлять платежи на этот счет.
- Contract Accounts — это счета, управляемые кодом смарт-контракта, а не приватными ключами. Поскольку у них нет приватного ключа, счета-контракты самостоятельно не могут инициировать транзакции.

Когда пользователь Ethereum создает кошелек, внешний счет добавляется в глобальное состояние на всех узлах децентрализованной сети при проведении первой транзакции или получении средств. Развертывание умного контракта создает счет-контракт, способный хранить и распределять средства программно в зависимости от определенных условий. Все типы счетов имеют балансы, личное хранилище и могут инициировать транзакции, вызывая функции в других счетах. Подобная структура позволяет Ethereum по сути быть программируемой валютой.

В Ethereum реализована синхронная обработка транзакций, где каждая транзакция обрабатывается по очереди, в строгом порядке. Это обеспечивает то, что состояние блокчейна всегда остается консистентным и предсказуемым для всех участников сети.Все транзакции атомарны – либо они полностью успешно завершаются, либо не выполняются вовсе, без какого-либо частичного или неполного выполнения. Более того, когда вызывается смарт-контракт, который затем вызывает другой смарт-контракт, вызов происходит мгновенно в рамках одной транзакции.Однако здесь также есть недостатки: транзакция в таком подходе может вырасти до максимальной допустимой величины. Основной минус синхронности — это перегрузка из-за того, что вычисления не могут выполняться параллельно. Число контрактов и пользователей будет расти, и невозможность параллелизации вычислений станет основным ограничивающим фактором для роста сети.

Теперь давайте разберемся что же представляет собой акторная модель.Акторная модель – это метод параллельной и распределенной обработки, где основным элементом является Актор — независимый исполняемый блок кода.Изначально разработанная для кластерного вычисления, эта модель широко используется в микросерверных архитектурах из-за её способности к масштабированию, а также умению обеспечить параллелизм и надежность при работе с современными распределенными системами.Акторы принимают и обрабатывают сообщения, а далее, на основании логики принимаемого сообщения, могут произвести либо локальные изменения, либо запросить действия в ответ. Более того они могут создавать других акторов или направлять сообщения далее.Они являются потокобезопасными и рекурсивно вызываемыми, что позволяет избежать блокировок и упрощает параллельную обработку задач. Эта модель идеальна для построения масштабируемых и надежных серверных решений, предоставляя эффективный контроль одновременного доступа и поддерживая как синхронные, так и асинхронные сообщения.

В TON все представлено в виде смарт-контрактов, которые также могут называться акторами в контексте акторной модели.Смарт-контракт является объектом со следующими свойствами: адрес, код, данные и баланс. Он способен хранить данные, а также действовать в соответствии с инструкциями, полученными от других смарт-контрактов. После того как контракт получает сообщение и обрабатывает его, выполняя код в TVM, могут возникать различные сценарии:

- Контракт изменяет свои свойства `code, data, balance`
- Контракт опционально генерирует исходящие сообщения
- Контракт переходит в режим ожидания до тех пор, пока не произойдет следующее событие

Результат скриптов всегда является созданием транзакции. Сами же транзакции асинхронны, что означает, что система может продолжать обрабатывать другие транзакции, не дожидаясь завершения прошедших транзакций.Это обеспечивает большую гибкость при обработке сложных операций. Иногда для одной транзакции требуется выполнение нескольких вызовов смарт-контрактов в определенной последовательности. Поскольку эти вызовы асинхронны, разработчикам проще проектировать и реализовывать сложные потоки транзакций, которые могут включать несколько параллельных операций.Разработчик, переходящий с Ethereum, должен учесть, что смарт-контракты в блокчейне TON могут обмениваться данными только в асинхронном режиме. Это означает, что при запросе данных из другого контракта вы не можете надеяться на получение немедленного ответа.Вместо этого get-методы должны вызываться клиентами снаружи сети. Это подобно тому как в Ethereum кошельках используются узлы RPC, такие как Infura, для запроса состояния смарт-контрактов.Это важное ограничение по нескольким причинам. Например, flash loans — это вид транзакций, которые должны быть выполнены в рамках одного блока, рассчитывая на возможность проведения заема и возврата в рамках одной транзакции. Это требование соответствует синхронной природе EVM Ethereum, но в TON асинхронность всех транзакций делает выполнение flash loan невозможным.Также Оракулы, которые предоставляют смарт-контрактам внешние данные, имеют в TON более сложный процесс проектирования. Что такое Оракулы и как их использовать в TON можно найти [здесь](/v3/documentation/dapps/oracles/about_blockchain_oracles).

## Отличия кошельков

Ранее мы уже обсуждали, что в Ethereum кошелек пользователя генерируется на основе его адреса, который находится в отношении 1 к 1 с его открытым ключом.В свою очередь в TON все кошельки являются смарт-контрактами, которые должны быть развернуты самим пользователем. Поскольку смарт-контракты могут быть настроены по-разному и иметь различные функции, существует несколько версий кошельков, о которых вы можете прочитать [здесь](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts).В связи с тем, что кошельки являются смарт-контрактами, у пользователя может быть несколько кошельков с разными адресами и начальными параметрами. Чтобы отправить транзакцию, пользователь должен подписать сообщение своим закрытым ключом и отправить его в свой контракт кошелька, который, в свою очередь, пересылает его в смарт-контракт конкретного приложения DApp. Такой подход значительно повышает гибкость в проектировании кошелька, и разработчики могут добавлять новые версии кошелька в будущем.В Ethereum на данный момент разработчики активно используют мультиподписные кошельки, смарт-контракты, типа gnosis и только начинают внедрять так называемые \\`account-abstractions' типа ERC-4337, где кошельки наполнены таким функционалом, как отправка транзакций без собственного токена, восстановление счета после его потери и т.д.Однако важно отметить, что счета кошельков TON гораздо дороже в использовании с точки зрения комиссий за газ в сравнении с EOA в Ethereum.

## Сообщения и транзакции

Мы называем сообщением любое событие происходящее между двумя смарт-контрактами, по сути оно является отправкой небольшого количества токенов и произвольного набора данных на указанный адрес. Когда сообщение достигает контракта, оно обрабатывается кодом контракта, состояние контракта обновляется, и он опционально отправляет новое сообщение. Все эти действия в контракте записываются как транзакции.Давайте представим пример: у нас есть цепочка сообщений от контракта `A` к контракту `B`, а затем от контракта `B` к контракту `C`.В этом случае у нас будет два сообщения и три транзакции. Однако изначально, чтобы изменить состояние блокчейна, нам потребуется внешний сигнал. Чтобы вызвать смарт-контракт, необходимо отправить внешнее сообщение, которое маршрутизируется к валидаторам, и уже они применяют его к смарт-контракту.Мы уже обсуждали в последнем подразделе, что кошелек является смарт-контрактом, поэтому это внешнее сообщение обычно сначала отправляется в смарт-контракт кошелька, который его записывает как первую транзакцию, и эта первая транзакция обычно содержит внутреннее сообщение для целевого контракта.Когда смарт-контракт кошелка получает это сообщение, он обрабатывает его и передает его целевому контракту (в нашем примере контракт `A` может быть кошельком, и когда он получает внешнее сообщение, у него будет первая транзакция).Последовательность подобных транзакций образует цепочку. Таким образом, вы можете видеть, что каждый смарт-контракт имеет свои собственные транзакции, что в свою очередь означает, что каждый контракт имеет свой собственный микро-блокчейн – вы можете узнать больше об этом [здесь](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains). Именно поэтому сеть может обрабатывать транзакции в полной независимости друг от друга.

## Отличия в системе газа

В Ethereum стоимость транзакции измеряется в `газе`, что отражает количество вычислительных ресурсов, требуемых для выполнения транзакции. Стоимость газа делится на `базовую плату`, установленную протоколом, и `приоритетную плату`, которую пользователь добавляет, чтобы ускорить обработку транзакций валидаторами. `Общая стоимость` будет равна = `использованным единицам газа` \* (`базовая плата` + `приоритетная плата`).Кроме того, хранение данных на Ethereum по сути бесплатное, что означает, что после того, как данные были сохранены в блокчейне, больше не возникает затрат на их содержание.

В TON расчеты за транзакционные сборы сложны и включают несколько типов сборов: за хранение смарт-контрактов в блокчейне, за импорт сообщений в блокчейн, за выполнение кода на виртуальной машине, за обработку действий после выполнения кода и за отправку сообщений вне сети TON.Цена газа и некоторые другие параметры могут изменяться путем голосования на основной сети. В отличие от Ethereum, в TON пользователи не могут самостоятельно устанавливать цену газа. Также разработчику необходимо вручную вернуть оставшиеся средства газа владельцу, иначе они останутся заблокированы.Использование хранилища смарт-контрактов также влияет на стоимость: если смарт-контракт кошелька не использовался долго, следующая транзакция будет стоить дороже.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/go-from-ethereum/solidity-vs-func.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/go-from-ethereum/solidity-vs-func.md
================================================
# Сравнение Solidity и FunC

Разработка смарт-контрактов предполагает знание таких языков, как Solidity для Ethereum и FunC для TON. Solidity - это объектно-ориентированный, высокоуровневый, строго типизированный язык, основанный на C++, Python и JavaScript, и специально разработанный для написания смарт-контрактов, которые выполняются на блокчейн-платформе Ethereum.

FunC также является языком высокого уровня, используемым для программирования смарт-контрактов на блокчейне TON, объектно-ориентированный, C-подобный, статически типизированный язык.

В следующих разделах будет приведен краткий анализ и сравнение двух языков по типам данных, хранилищам, функциям, структурам управления потоком и словарям, хеш-картам.

## Схема хранения

Solidity обеспечивает плоскую модель хранения, которая означает, что все переменные состояния хранятся в едином непрерывном блоке памяти, называемом хранилищем. Хранилище состоит из набора данных типа ключ-значение, где каждый ключ есть 256-битное (32-байтовое) целое число, представляющее собой номер ячейки хранения, а каждое значение – это 256-битное слово, хранящееся в этой ячейке. Ячейки нумеруются последовательно, начиная с нуля, и в каждой ячейке может храниться только одно слово. Solidity позволяет разработчику сформировать структуру хранилища, используя ключевое слово storage для определения переменных состояния. Порядок, в котором задаются переменные, определяет их положение в хранилище.

Данные постоянного хранилища в блокчейне TON хранятся в виде ячеек. Ячейки играют роль памяти в стековой TVM. Ячейка может быть преобразована в фрагмент, Slice, а затем биты данных и ссылки на другие ячейки из ячейки могут быть получены путем их загрузки из этого фрагмента. Биты данных и ссылки на другие ячейки могут быть сохранены в компоновщике, Builder'e, а затем компоновщик может быть преобразован в новую ячейку.

## Типы данных

Solidity включает следующие базовые типы данных:

- Целые числа со знаком/без знака
- Булевые значения
- Адреса — используются для хранения адресов кошельков Ethereum или смарт-контрактов, обычно около 20 байт. Тип адреса может быть дополнен ключевым словом `payable`, что ограничивает его использование хранением только адресов кошельков, а также только использованием функций передачи и отправки криптовалюты.
- Массивы байтов — объявляются ключевым словом "bytes", представляют собой массив фиксированного размера, используемый для хранения предопределенного количества байтов до 32, обычно задаются вместе с ключевым словом.
- Литералы – неизменяемые значения, такие как адреса, рациональные и целые числа, строки, юникод и шестнадцатеричные числа, которые могут храниться в переменной.
- Перечисления
- Массивы (фиксированные/динамические)
- Структуры
- Маппинги

В случае FunC основными типами данных являются:

- Целые числа
- Cell — базовая для TON непрозрачная структура данных, которая содержит до 1023 бит и до 4 ссылок на другие ячейки
- Slice и Builder — специальные объекты для чтения и записи в ячейки
- Continuation — еще одна разновидность ячейки, которая содержит готовый к выполнению байт-код TVM
- Tuples — упорядоченная коллекция из до 255 компонентов, имеющих произвольные типы значений, возможно, различные.
- Tensors — это упорядоченная коллекция, готовая к массовому присвоению типа: (int, int) a = (2, 4). Частным случаем тензорного типа является тип unit (). Он означает, что функция не возвращает никакого значения или не имеет аргументов.

В настоящее время FunC не поддерживает определение пользовательских типов.

### См. также

- [Операторы](/v3/documentation/smart-contracts/func/docs/statements)

## Объявление и использование переменных

Solidity - это язык со статической типизацией, что означает, что тип каждой переменной должен быть указан при ее объявлении.

```js
uint test = 1; // Declaring an unsigned variable of integer type
bool isActive = true; // Logical variable
string name = "Alice"; // String variable
```

FunC - более абстрактный и функционально-ориентированный язык, он поддерживает динамическую типизацию и функциональный стиль программирования.

```func
(int x, int y) = (1, 2); // A tuple containing two integer variables
var z = x + y; // Dynamic variable declaration 
```

### См. также

- [Операторы](/v3/documentation/smart-contracts/func/docs/statements)

## Циклы

Solidity поддерживает циклы `for`, `while` и `do { ... } while`.

Если вы хотите сделать что-то 10 раз, вы можете сделать это следующим образом:

```js
uint x = 1;

for (uint i; i < 10; i++) {
    x *= 2;
}

// x = 1024
```

FunC, в свою очередь, поддерживает циклы `repeat`, `while` и `do { ... } until`. Цикл for не поддерживается. Если вы хотите выполнить тот же код, что и в примере выше, но на Func, вы можете использовать `repeat`

```func
int x = 1;
repeat(10) {
  x *= 2;
}
;; x = 1024
```

### См. также

- [Операторы](/v3/documentation/smart-contracts/func/docs/statements)

## Функции

Подход Solidity к объявлениям функций является сочетанием ясности и контроля. В этом языке программирования каждая функция инициируется ключевым словом "function", за которым следует имя функции и ее параметры. Тело функции заключено в фигурные скобки, явно определяющие область действия. Кроме того, возвращаемые значения указываются с помощью ключевого слова "returns".Основное отличие Solidity заключается в определении области видимости функций. Они могут быть обозначены как `public`, `private`, `internal` или `external`, тем самым описывая условия, при которых к ним может быть получен доступ и осуществлен вызов из других частей смарт-контракта или внешних сущностей. Ниже приведен пример, в котором мы задаем глобальную переменную `num` в языке Solidity:

```js
function set(uint256 _num) public returns (bool) {
    num = _num;
    return true;
}
```

В свою очередь программа, написанная на FunC, по сути представляет собой список объявляемых функций и глобальных переменных. Объявление функции в FunC обычно начинается с необязательного декларатора, за которым следует возвращаемый тип и имя функции. Далее перечисляются параметры, а объявление заканчивается выбором спецификаторов, таких как `impure`, `inline/inline_ref` и `method_id`.Эти спецификаторы регулируют область видимости функции, ее способность изменять хранилище контрактов и ее поведение при встраивании.Ниже приведен пример, в котором мы сохраняем переменную хранилища как ячейку в постоянном хранилище на языке Func:

```func
() save_data(int num) impure inline {
  set_data(begin_cell()
            .store_uint(num, 32)
           .end_cell()
          );
}
```

### См. также

- [Функции](/v3/documentation/smart-contracts/func/docs/functions)

## Операторы выбора и перехода

Большинство операторов из известных языков с фигурными скобками доступны и в Solidity, включая: `if`, `else`, `while`, `do`, `for`, `break`, `continue`, `return`, с обычной семантикой, известной из C или JavaScript.

FunC поддерживает классические операторы `if-else`, а также циклы `ifnot`, `repeat`, `while` и `do/until`. Также с версии v0.4.0 поддерживаются операторы `try-catch`.

### См. также

- [Операторы](/v3/documentation/smart-contracts/func/docs/statements)

## Словари

Словари, hashmap/mapping, крайне важны для разработки контрактов Solidity и FunC, так как позволяют разработчикам эффективно хранить и извлекать данные в смарт-контрактах. В частности данные, связанные с определенным ключом, к примеру, баланс счета пользователя или факт владения активом.

Mapping — это хэш-таблица в Solidity, которая хранит данные в виде пар ключ-значение, где ключ может принимать значение любого из встроенных типов данных, кроме ссылочного. В свою очередь значение может быть любым, даже ссылочным. Mapping чаще всего используются в Solidity и блокчейне Ethereum для соединения уникального адреса Ethereum с соответствующим типом значения. В любом другом языке программирования Mapping является эквивалентом словарю.

В Solidity структура Mapping не имеет размера и не имеет функционала задания ключа или значения. Mapping применим только к переменным состояния, которые служат типами ссылок на хранилище. Когда происходит инициализация Mapping структуры, он включает в себя все возможные ключи, которые соединены с значениями, байтовые представления которых состоят из одних нулей.

Аналогом Mapping в FunC являются словари или TON hashmap. В контексте TON, hashmap представляет собой структуру данных, представленную деревом ячеек. Hashmap маппит ключи в значения произвольного типа, чтобы обеспечить возможность их быстрого поиска и изменения. Абстрактное представление hashmap в TVM — это дерево Patricia или компактное двоичное дерево.Работа с потенциально большими деревьями ячеек может содержать несколько сложностей. Каждая операция обновления создает значительное количество ячеек, а каждая построенная ячейка стоит 500 единиц газа, что в свою очередь означает, что эти операции могут исчерпать имеющиеся ресурсы, если их использовать неосторожно.Чтобы избежать превышения лимита газа, ограничьте количество обновлений словаря за одну транзакцию. Кроме того, двоичное дерево для `N` пар ключ-значение содержит `N-1` форков, что означает в общей сложности не менее `2N-1` ячеек. Хранилище смарт-контракта ограничено `65536` уникальными ячейками, поэтому максимальное количество записей в словаре составляет `32768` или чуть больше, если есть повторяющиеся ячейки.

### См. также

- [Словари в TON](/v3/documentation/smart-contracts/func/docs/dictionaries)

## Взаимодействие смарт-контрактов

Solidity и FunC предоставляют разные подходы к взаимодействию со смарт-контрактами. Основное различие заключается в механизмах вызова и взаимодействия между контрактами.

Solidity использует объектно-ориентированный подход, при котором контракты взаимодействуют друг с другом посредством вызовов методов. Это похоже на вызовы методов в традиционных объектно-ориентированных языках программирования.

```js
// External contract interface
interface IReceiver {
    function receiveData(uint x) external;
}

contract Sender {
    function sendData(address receiverAddress, uint x) public {
        IReceiver receiver = IReceiver(receiverAddress);
        receiver.receiveData(x);  // Direct call of the contract function
    }
}
```

FunC, используемый в экосистеме блокчейна TON, работает с сообщениями для вызова и взаимодействия между смарт-контрактами. Вместо прямого вызова методов контракты отправляют друг другу сообщения, которые могут содержать данные и код для выполнения.

Рассмотрим пример, в котором отправитель смарт-контракта должен отправить сообщение с номером, а получатель смарт-контракта должен получить этот номер и выполнить над ним некоторые манипуляции.

Изначально получатель смарт-контракта должен описать, как он будет получать сообщения.

```func
() recv_internal(int my_balance, int msg_value, cell in_msg, slice in_msg_body) impure {
    int op = in_msg_body~load_uint(32);
    
    if (op == 1) {
        int num = in_msg_body~load_uint(32);
        ;; do some manipulations
        return ();
    }

    if (op == 2) {
        ;;...
    }
}
```

Давайте подробнее обсудим, как выглядит получение сообщения в нашем целевом контракте:

1. `recv_internal()` - эта функция выполняется, когда к контракту обращаются напрямую в блокчейне. Например, когда контракт обращается к нашему контракту.
2. Функция принимает сумму баланса контракта, сумму входящего сообщения, ячейку с исходным сообщением и срез `in_msg_body`, в котором хранится только тело полученного сообщения.
3. Наше тело сообщения будет хранить два целых числа. Первое число — это 32-битное беззнаковое целое число `op`, определяющее операцию, которую нужно выполнить, или `method` смарт-контракта, который нужно вызвать. Можно провести аналогию с Solidity и представить себе `op` как сигнатуру функции. Второе число — это число, с которым нам нужно произвести некоторые манипуляции.
4. Чтобы прочитать из полученного Slice `op` и `наше число`, мы используем `load_uint()`.
5. Далее мы уже взаимодействуем с числом (мы опустили эту функциональность в этом примере).

Далее смарт-контракт отправителя должен корректно отправить сообщение. Для этого используется `send_raw_message`, который ожидает сериализованное сообщение в качестве аргумента.

```func
int num = 10;
cell msg_body_cell = begin_cell().store_uint(1,32).store_uint(num,32).end_cell();

var msg = begin_cell()
            .store_uint(0x18, 6)
            .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; in the example, we just hardcode the recipient's address
            .store_coins(0)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_ref(msg_body_cell)
        .end_cell();

send_raw_message(msg, mode);
```

Давайте более подробно рассмотрим то, как выглядит отправка сообщения нашим смарт-контрактом получателю:

1. Сначала нам нужно построить наше сообщение. Полную структуру отправки можно найти [здесь](/v3/documentation/smart-contracts/message-management/sending-messages). Мы не будем детально описывать процесс создания сообщения здесь – вы можете прочитать об этом по ссылке.
2. Тело сообщения представляет собой ячейку. В `msg_body_cell` мы делаем: `begin_cell()` - создает `Builder` для будущей ячейки, сначала `store_uint` - сохраняет первый `uint` в `Builder` (1 - это наш `op`), затем `store_uint` - сохраняет второй `uint` в `Builder` (num - это наш номер, которым мы будем манипулировать в контракте-получателе), `end_cell()` - создает ячейку.
3. Чтобы прикрепить тело, которое придет в `recv_internal` в сообщении, мы ссылаемся на собранную ячейку в самом сообщении с помощью `store_ref`.
4. Отправка сообщения.

В этом примере показано, как смарт-контракты могут общаться друг с другом.

### См. также

- [Внутренние сообщения](/v3/documentation/smart-contracts/message-management/internal-messages)
- [Отправка сообщений](/v3/documentation/smart-contracts/message-management/sending-messages)
- [Невозвратные сообщения](/v3/documentation/smart-contracts/message-management/non-bounceable-messages)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/go-from-ethereum/tvm-vs-evm.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/go-from-ethereum/tvm-vs-evm.md
================================================
# TVM и EVM

Ethereum Virtual Machine (EVM) и TON Virtual Machine (TVM) - это две стековые виртуальные машины, разработанные для запуска кода смарт-контрактов. Несмотря на то, что у них есть общие черты, между ними есть заметные различия.

## Представление данных

### Ethereum Virtual Machine (EVM)

1. Основные единицы данных

- EVM работает в основном с 256-битными целыми числами, так как она была спроектирована для удобной работы с криптографическими функциями Ethereum (например, хеширование Keccak-256 и операции с эллиптическими кривыми).
- Типы данных в основном ограничены целыми числами, байтами и иногда массивами этих типов, но все они должны соответствовать 256-битным правилам обработки.

2. Хранилище состояний

- Все состояние блокчейна Ethereum представляет собой отображение 256-битных адресов в 256-битных значениях. Это отображение поддерживается в структуре данных, известной как Merkle Patricia Trie (MPT).
- MPT позволяет Ethereum эффективно доказывать согласованность и целостность состояния блокчейна с помощью криптографических проверок, что жизненно важно для децентрализованной системы, такой как Ethereum.

3. Ограничения структуры данных

- Упрощение до ограничений в 256 бит означает, что EVM изначально не предназначена для обработки сложных или пользовательских структур данных напрямую.
- Разработчикам часто требуется внедрять дополнительную логику в смарт-контракты для имитации более сложных структур данных, что может привести к увеличению затрат на газ и увеличению сложности.

### TON Virtual Machine (TVM)

1. Архитектура на основе ячеек

- TVM использует уникальную модель "bag of cells" для представления данных. Каждая ячейка может содержать до 128 байтов данных и может иметь до 4 ссылок на другие ячейки.
- Эта структура позволяет TVM изначально поддерживать произвольные алгебраические типы данных и более сложные конструкции, такие как деревья или направленные ациклические графы (DAG) непосредственно в своей модели хранения.

2. Гибкость и эффективность

- Модель ячеек обеспечивает значительную гибкость, позволяя TVM обрабатывать широкий спектр структур данных более естественно и эффективно, чем EVM.
- Например, возможность создания связанных структур с помощью ссылок на ячейки позволяет создавать динамические и потенциально бесконечные структуры данных, которые имеют решающее значение для определенных типов приложений, таких как децентрализованные социальные сети или сложные децентрализованные финансовые протоколы (DeFi).

3. Обработка сложных данных

- Возможность управлять сложными типами данных, изначально заложенная в архитектуре VM, снижает необходимость их имитации в смарт-контрактах, что потенциально снижает стоимость и увеличивает скорость выполнения.
- Конструкция TVM особенно выгодна для приложений, требующих сложного управления состоянием или взаимосвязанных структур данных, предоставляя разработчикам надежную основу для создания сложных и масштабируемых децентрализованных приложений.

## Стековая машина

### Ethereum Virtual Machine (EVM)

- EVM работает как традиционная стековая машина, где она использует стек "последним пришел — первым вышел" (LIFO) для управления вычислениями.
- Она обрабатывает операции, помещая и выталкивая 256-битные целые числа, которые являются стандартным размером для всех элементов в стеке.

### TON Virtual Machine (TVM)

- TVM также функционирует как стековая машина, но с ключевым отличием: она поддерживает как 257-битные целые числа, так и ссылки на ячейки.
- Это позволяет TVM помещать и выводить эти два различных типа данных в стек/из стека, обеспечивая повышенную гибкость в прямой управлении данными.

### Пример операций со стеком

Предположим, мы хотим сложить два числа (2 и 2) в EVM. Процесс будет включать помещение чисел в стек и последующий вызов инструкции `ADD`. Результат (4) останется наверху стека.

Мы можем выполнить эту операцию таким же образом и в TVM. Но давайте рассмотрим другой пример с более сложными структурами данных, такими как хэш-карты и ссылки на ячейки. Предположим, у нас есть хэш-карта, которая хранит пары ключ-значение, где ключи являются целыми числами, а значения — либо целыми числами, либо ссылками на ячейки. Допустим, наша хэш-карта содержит следующие записи:

```js
{
    1: 10
    2: cell_a (which contains 10)
}
```

Мы хотим сложить значения, связанные с ключами 1 и 2, и сохранить результат с ключом 3. Давайте рассмотрим операции, происходящие в стеке:

1. Поместить ключ 1 в стек: `stack` = (1)
2. Вызвать `DICTGET` для ключа 1 (извлечь значение, связанное с ключом наверху стека): Извлечь значение 10. `stack` = (10)
3. Поместить ключ 2 в стек: `stack` = (10, 2)
4. Вызвать `DICTGET` для ключа 2: Извлечь ссылку на Cell_A. `stack` = (10, Cell_A)
5. Загрузить значение из Cell_A: Выполняется инструкция по загрузке значения из ссылки на ячейку. `stack` = (10, 10)
6. Вызвать инструкцию `ADD`: При выполнении инструкции `ADD` TVM извлечет два верхних элемента из стека, сложит их и поместит результат обратно в стек. В этом случае верхние два элемента — 10 и 10. После сложения стек будет содержать результат: `stack` = (20)
7. Поместить ключ 3 в стек: `stack` = (20, 3)
8. Вызвать `DICTSET`: Сохраняет 20 с ключом 3. Обновленная хэш-карта:

```js
{
    1: 10,
    2: cell_a,
    3: 20
}
```

Чтобы сделать то же самое в EVM, нам нужно задать Mapping, который будет хранить пары ключ-значение, а также функцию, в которой мы будем работать напрямую с 256-битными целыми числами, хранящимися в маппинге. Важно отметить, что EVM поддерживает сложные структуры данных, используя Solidity, но эти структуры построены поверх более простой модели данных EVM, которая принципиально отличается от более явной модели данных TVM

## Арифметические операции

### Ethereum Virtual Machine (EVM)

- Ethereum Virtual Machine (EVM) обрабатывает арифметику с использованием 256-битных целых чисел. Это означает, что операции, такие как сложение, вычитание, умножение и деление, адаптированы под этот размер данных.

### TON Virtual Machine (TVM)

- TON Virtual Machine (TVM) поддерживает более широкий спектр арифметических операций, включая 64-битные, 128-битные и 256-битные целые числа, как беззнаковые, так и знаковые, а также операции по модулю. TVM дополнительно расширяет свои арифметические возможности с помощью таких операций, как умножение-затем-сдвиг и сдвиг-затем-деление, которые особенно полезны для реализации арифметики с фиксированной точкой. Это разнообразие позволяет разработчикам выбирать наиболее эффективные арифметические операции на основе конкретных требований их смарт-контрактов, предлагая потенциальные оптимизации на основе размера и типа данных.

## Проверки переполнения

### Ethereum Virtual Machine (EVM)

- В EVM проверки переполнения не выполняются самой виртуальной машиной. С введением Solidity 0.8.0 автоматические проверки переполнения и потери значимости были интегрированы в язык для повышения безопасности. Эти проверки помогают предотвратить распространенные уязвимости, связанные с арифметическими операциями, но требуют более новых версий Solidity, поскольку более ранние версии требуют ручной реализации этих мер безопасности.

### TON Virtual Machine (TVM)

- Напротив, TVM автоматически выполняет проверки переполнения для всех арифметических операций, с помощью функций, встроенных непосредственно в виртуальную машину. Такая реализация упрощает разработку смарт-контрактов, изначально снижая риск ошибок и повышая общую надежность и безопасность кода.

## Криптография и хэш-функции

### Ethereum Virtual Machine (EVM)

- EVM поддерживает специфичную для Ethereum схему криптографии, используя эллиптическую кривую secp256k1 и хэш-функцию keccak256. Более того, EVM не имеет встроенной поддержки доказательств Меркла, которые являются криптографическими доказательствами, используемыми для проверки принадлежности элемента к множеству.

### TON Virtual Machine (TVM)

- TVM предлагает поддержку 256-битной криптографии на эллиптических кривых, ECC, для предопределенных кривых подобных Curve25519. Он также поддерживает пары Вейля на некоторых эллиптических кривых, которые полезны для быстрой реализации zk-SNARK – доказательства с нулевым разглашением.Также поддерживаются популярные хэш-функции, такие как sha256, что обеспечивает больше возможностей для криптографических операций. Кроме того, TVM может работать с доказательствами Меркла, предоставляя дополнительные криптографические функции, которые могут быть полезны для определенных вариантов использования, к примеру, проверки включения транзакции в блок.

## Высокоуровневые языки

### Ethereum Virtual Machine (EVM)

- EVM в первую очередь использует Solidity в качестве своего высокоуровневого языка, который является объектно-ориентированным статически типизированным языком, похожим на JavaScript и C++. Также существуют другие языки для написания смарт-контрактов Ethereum, такие, как Vyper, Yul и прочие.

### TON Virtual Machine (TVM)

- TVM использует FunC в качестве высокоуровневого языка, предназначенного для написания смарт-контрактов TON. Это процедурный язык со статическими типами и поддержкой алгебраических типов данных. FunC компилируется в Fift, который, в свою очередь, компилируется в байт-код TVM.

## Заключение

Подводя итог, можно сказать, что хотя и EVM, и TVM являются стековыми машинами, предназначенными для выполнения смарт-контрактов, TVM предлагает бо́льшую гибкость, поддержку более широкого спектра типов и структур данных, встроенные проверки переполнения, расширенные криптографические функции.

Поддержка TVM смарт-контрактов с поддержкой шардинга и его уникальный подход к представлению данных делают его более подходящим для определенных вариантов использования и масштабируемых сетей блокчейнов.




================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/introduction.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/introduction.mdx
================================================
import Player from '@site/src/components/player'
import Button from '@site/src/components/button'

# The Open Network

**The Open Network (TON)** — это децентрализованная и открытая интернет-платформа, состоящая из нескольких компонентов. К ним относятся: TON Blockchain, TON DNS, TON Storage и TON Site. Блокчейн TON — это основной протокол, который объединяет базовую инфраструктуру TON в единую экосистему TON.

TON нацелен на обеспечение повсеместной межсетевой совместимости, работая при этом в высокомасштабируемой защищенной среде. TOM разработан для обработки миллионов транзакций в секунду (TPS) с целью в конечном итоге охватить сотни миллионов пользователей в будущем.

**Блокчейн TON** разработан как распределенный суперкомпьютер, или “_суперсервер_”, предназначенный для предоставления разнообразных продуктов и услуг, способствующих развитию видения нового децентрализованного Интернета.

- Чтобы узнать больше о технических аспектах блокчейна TON, ознакомьтесь со статьей [Блокчейн Блокчейнов](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains)
- Чтобы узнать больше о развитии всего, что связано с TON, изучите этот раздел: [Начало работы](/v3/documentation/ton-documentation)

## Общее представление

Чтобы понять, что мы подразумеваем под видением децентрализованного интернета и то, как TON вносит свой вклад в это неизбежное развитие, рекомендуем посмотреть следующее видео:

<Player url="https://www.youtube.com/watch?v=XgzHmV_nnpY" />

## Основы блокчейна с TON

Этот курс знакомит с основами блокчейна, уделяя особое внимание практическим навыкам в экосистеме TON. Вы поймете, как функционирует блокчейн и его разнообразные приложения. Вы также приобретете важные навыки, связанные с TON, включая настройку кошелька, торговлю NFT, создание жетонов и транзакции с монетами TON на децентрализованных биржах (DEX). Курс также даст вам важные знания об угрозах и мошенничестве криптовалют и даст практические советы о том, как защитить ваши криптоактивы.

- [Основы блокчейна с TON](https://stepik.org/course/201294/) ([RU версия](https://stepik.org/course/202221/), [CHN версия](https://stepik.org/course/200976/))

## Курс по блокчейну TON

Мы с гордостью представляем **курс по блокчейну TON**, который представляет собой комплексное руководство по блокчейну TON. Курс предназначен для разработчиков, которые хотят научиться создавать смарт-контракты и децентрализованные приложения на блокчейне TON.

Курс состоит из **9 модулей** и охватывает основы блокчейна TON, язык программирования FunC и виртуальную машину TON (TVM).

<Button href="https://stepik.org/course/176754/promo"
        colorType={'primary'} sizeType={'sm'}>

Проверьте курс TON

</Button>

<Button href="https://stepik.org/course/201638/promo"
        colorType={'secondary'} sizeType={'sm'}>

CHN

</Button>

<Button href="https://stepik.org/course/201855/promo"
        colorType={'secondary'} sizeType={'sm'}>

RU

</Button>

## Вы новичок в блокчейне?

Если вы новичок в блокчейне и не понимаете, что же делает эту технологию такой революционной, то советуем ознакомиться со следующими материалами:

- [Что такое блокчейн? Что такое смарт-контракт? Что такое газ?](https://blog.ton.org/what_is_blockchain)
- [Как блокчейн может помочь вам на необитаемом острове](https://talkol.medium.com/why-decentralized-consensus-blockchain-is-good-for-business-5ff263468210)
- [\[YouTube\] Криптосети и почему они важны](https://youtu.be/2wxtiNgXBaU)

## Отношение TON к Ethereum

Для тех, кто уже знаком с разработкой на Ethereum, мы написали две вводные статьи, чтобы помочь вам понять ключевые преимущества и основные отличия TON от Ethereum:

- [Шесть уникальных аспектов блокчейна TON, которые удивят разработчиков Solidity](https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers)
- [Пора попробовать что-то новое: асинхронные смарт-контракты](https://telegra.ph/Its-time-to-try-something-new-Asynchronous-smart-contracts-03-25)
- [Сравнение блокчейнов](https://ton.org/comparison_of_blockchains.pdf)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison.md
================================================
# Сравнение блокчейнов

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

В этом документе представлен сравнительный анализ TON с Ethereum и Solana.

|                            | Ethereum 2.0 (ETH 2.0) | Solana (SOL)          | TON                              |
| -------------------------- | ------------------------------------------------------------------------- | ---------------------------------------- | -------------------------------- |
| **Консенсус**              | Proof of Stake                                                            | Proof of History                         | BFT PoS                          |
| **TPS**                    | 100 000 TPS                                                               | 59 400 TPS                               | 104 715 TPS                      |
| **Время блока**            | 12 сек                                                                    | < 1 сек         | 5 сек                            |
| **Время завершения блока** | 10-15 мин                                                                 | ~6.4 сек | < 6 сек |



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains.md
================================================
# Блокчейн блокчейнов

:::tip
Термины **смарт-контракт**, **аккаунт** и **актор** используются взаимозаменяемо в этом документе для описания сущности блокчейна.
:::

## Отдельный актор

Рассмотрим один смарт-контракт.

В TON это *сущность* с такими свойствами как `address`, `code`, `data`, `balance` и другие. Другими словами, это объект, который имеет *хранилище* и определенное *поведение*. Это поведение в основном принимает следующий вид:

- происходит событие (наиболее распространенная ситуация — контракт получает сообщение)
- контракт обрабатывает это событие в соответствии со своими свойствами, исполняя `код` в виртуальной машине TON.
- контракт изменяет свои свойства (`code`, `data` и другие)
- контракт опционально генерирует исходящие сообщения
- контракт переходит в режим ожидания, пока не произойдет следующее событие

Комбинация этих шагов называется **транзакцией**. Важно, чтобы описанные выше события обрабатывались одно за другим, поэтому *транзакции* в блокчейне строго упорядочены и не могут прерывать друг друга.

Данная модель обработки и называется `Актор`.

### Самый низкий уровень: AccountChain

Последовательность *транзакций* `Tx1 -> Tx2 -> Tx3 -> ....` можно назвать **цепочкой**. В рассматриваемом нами случае, так как эта *цепочка* транзакций относится к одному аккаунту, мы можем использовать термин `AccountChain`.

Далее, так как обрабатывающие транзакции узлы время от времени должны координировать состояние смарт-контракта, достигать *консенсуса* о состоянии, эти *транзакции* собираются в батчи: `[Tx1 -> Tx2] -> [Tx3 -> Tx4 -> Tx5] -> [] -> [Tx6]`.Собранные батчи не вмешивается в последовательность, каждая транзакция по-прежнему имеет только одну `предыдущую` и максимум одну `последующую`, однако теперь эта общая последовательность будет разбита на отдельные **блоки**.

Также будет целесообразно включать в *блоки* и очереди входящих и исходящих сообщений. В этом случае *блок* будет содержать полный набор информации, которая определяет и описывает, что произошло со смарт-контрактом во время исполнения этого блока.

## Множество AccountChains: Шарды

Теперь давайте рассмотрим множество аккаунтов. Мы можем получить несколько *AccountChains* и хранить их вместе. Подобный набор *AccountChains* называется *Шардчейн*.Схожим образом мы можем разбить **Шардчейн** на **Шардблоки**, которые будут являться совокупностью отдельных *AccountBlocks*.

### Динамическое разделение и объединение шардчейнов

Важно отметить, что поскольку *Шардчейн* состоит из явно различимых *AccountChains*, мы сможем его легко разделять.К примеру, если у нас есть 1 *Шардчейн*, который описывает происходящие с 1 миллионом аккаунтов события, и в одну секунду происходит слишком много транзакций для обработки и хранения в одном узле, то мы можем просто разделить эту цепочку на два меньших *Шардчейна*. При этом каждая цепочка будет работать с выделенным полмиллионом аккаунтов, а также она будет обрабатываться на отдельном подмножестве узлов.

Аналогично, если некоторые шарды станут слишком свободными, их можно **объединить** в один более крупный шард.

Очевидно, что есть два предельных случая – когда шард содержит только один аккаунт (и, следовательно, не может быть разделен дальше) и когда шард содержит все аккаунты.

Аккаунты могут взаимодействовать друг с другом, отправляя сообщения. Существует специальный механизм маршрутизации, который перемещает сообщения из исходящих очередей в соответствующие входящие очереди и гарантирует, что все сообщения будут *доставлены*, а также, что эти сообщения будут доставлены *последовательно* (сообщение, отправленное раньше, достигнет получателя раньше).

:::info ПРИМЕЧАНИЕ
Чтобы сделать разделение и слияние детерминированными, агрегация AccountChains в шарды основана на битовом представлении адресов аккаунтов. Например, адрес выглядит как `(shard prefix, address)`. Таким образом, все аккаунты в шарде будут иметь точно такой же двоичный префикс (например, все адреса будут начинаться с `0b00101`).
:::

## Блокчейн

Объединение всех шардов, содержащее все аккаунты, работающие по одному набору правил, называется **Блокчейном**.

В TON может быть много наборов правил и, следовательно, много блокчейнов. Все они будут работать одновременно, а также они могут взаимодействовать друг с другом, отправляя сообщения по всей цепочке таким же образом, как аккаунты одной цепочки могут взаимодействовать друг с другом.

### Воркчейн: Блокчейн с вашими собственными правилами

Если вы хотите настроить свои правила группы шардчейнов, вы можете создать **Воркчейн**. Хорошим примером является создание воркчейна, который работает на базе EVM, чтобы запускать на нем смарт-контракты Solidity.

Теоретически, каждый в сообществе может создать собственный воркчейн. На деле же – это крайне трудоемкая задача. Более того, для его создания необходимо заплатить ощутимую цену, а также получить 2/3 голосов от валидаторов, которые необходимы для одобрения создания вашего Воркчейна.

TON позволяет создавать до `2^32` воркчейнов, каждый из которых подразделяется на `2^60` шардов.

В настоящее время в TON есть только два воркчейна: Мастерчейн и Бейсчейн.

Бейсчейн используется для повседневных транзакций между участниками, ввиду его дешевизны. В свою очередь Мастерчейн выполняет важную для TON функцию.

### Мастерчейн: Блокчейн Блокчейнов

В блокчейне существует необходимость в синхронизации маршрутизации сообщений и выполнения транзакций. Другими словами, узлам сети нужен способ зафиксировать некоторую "точку" в состоянии мультичейна и достичь консенсуса относительно этого состояния.В TON для этой цели используется специальная цепочка под названием **Мастерчейн**. Блоки *Мастерчейна* содержат дополнительную информацию, последние хэши блоков, обо всех других цепочках в этой системе. Таким образом, любой наблюдатель однозначно может определить состояние всех систем мультичейна в одном блоке Мастерчейна.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage.md
================================================
import ConceptImage from '@site/src/components/conceptImage';
import ThemedImage from '@theme/ThemedImage';

# Ячейки как хранилище данных

Все в TON хранится в ячейках. Ячейка — это структура данных, содержащая:

- до **1023 бит** данных (не байтов!)
- до **4 ссылок** на другие ячейки

Биты и ссылки нельзя смешивать – они хранятся отдельно. Циклические ссылки запрещены. Это означает, что для любой ячейки ни одна из ее дочерних ячеек не может иметь эту исходную ячейку в качестве ссылки.

Таким образом, все ячейки формируют направленный ациклический граф (DAG), наглядная иллюстрация предоставлена ниже:

<br></br>
<ThemedImage
alt=""
sources={{
light: '/img/docs/cells-as-data-storage/dag.png?raw=true',
dark: '/img/docs/cells-as-data-storage/Cells-as-data-storage_1_dark.png?raw=true',
}}
/> <br></br>

## Типы ячеек

В настоящее время существует 5 типов ячеек: *обычные* и 4 *экзотических*. Экзотические типы следующие:

- Ячейка с обрезанной ветвью
- Ячейка библиотечной ссылки
- Ячейка с доказательством Меркла
- Ячейка обновления Меркла

:::tip
Подробнее об экзотических ячейках см: [**TVM Whitepaper, раздел 3**](https://ton.org/tvm.pdf).
:::

## Варианты ячеек

Ячейка — это непрозрачный объект, оптимизированный для компактного хранения.

В частности, он необходим для дедуплицикации данных. Если существует несколько эквивалентных подъячеек, на которые есть ссылки в разных ветвях, то их содержимое будет сохранено только один раз.В свою очередь свойство непрозрачности означает, что ячейку нельзя изменять или читать напрямую. Таким образом, появляются 2 дополнительных разновидности ячеек:

- *Builder* – для частично построенных ячеек, для которых можно определить быстрые операции добавления битовых строк, целых чисел, других ячеек и ссылок на другие ячейки.
- *Slice* – для "разрезанных" ячеек, представляющих собой либо остаток частично разобранной ячейки, либо значение, подъячейку, находящееся внутри такой ячейки и извлеченное из нее с помощью парсинг-инструкции.

Также в TVM используется еще одна особая разновидность ячеек:

- *Continuation* – для ячеек, содержащих opcode (инструкции) для виртуальной машины TON, см. [обзор TVM](/v3/documentation/tvm/tvm-overview).

## Сериализация данных в ячейки

Любой объект в TON (сообщение, очередь сообщений, блок, состояние всего блокчейна, код контракта и данные) сериализуется в ячейку.

Процесс сериализации описывается схемой TL-B. Это формальное описание того, как этот объект может быть сериализован в *Builder* или как проанализировать объект заданного типа из *Slice*. TL-B для ячеек — это то же самое, что TL или ProtoBuf для байтовых потоков.

Если вы хотите узнать больше подробностей о (де)сериализации ячеек, вы можете прочитать статью [Cell & Bag of Cells](/v3/documentation/data-formats/tlb/cell-boc).

## См. также

- [Язык TL-B](/v3/documentation/data-formats/tlb/tl-b-language)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/security-measures.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/security-measures.md
================================================
# Аудиты безопасности

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Безопасность экосистемы блокчейна TON является критически важной. Ниже приведен обзор завершенных аудитов ключевых компонентов TON Blockchain, проведенных известными аудиторскими фирмами.

## Блокчейн TON

Основные блокчейн-модули были проверены на надежность и безопасность.

**Аудиторские компании**: Trail of Bits, SlowMist, CertiK\
**Аудиторские отчеты**:

- [Trail of Bits: Отчет об аудите блокчейна TON](https://docs.ton.org/audits/TON_Blockchain_ToB.pdf)
- [SlowMist: Отчет об аудите блокчейна TON](https://docs.ton.org/audits/TON_Blockchain_SlowMist.pdf)
- [CertiK: Отчет об аудите блокчейна TON](https://docs.ton.org/audits/TON_Blockchain_CertiK.pdf)
- [CertiK: Формальная верификация контрактов Мастерчейна TON](https://docs.ton.org/audits/TON_Blockchain_Formal_Verification_CertiK.pdf)

## Библиотека блокчейна TON (tonlib)

С 16 октября по 17 ноября 2023 г. компания Zellic провела оценку безопасности для TON. В ходе этого проекта Zellic проверил код Tonlib на предмет уязвимостей безопасности, проблем проектирования и общих недостатков в состоянии безопасности.

**Аудиторская компания**: Zellic\
**Отчет об аудите**:

- [Zellic: Отчет об аудите](https://docs.ton.org/audits/TON_Blockchain_tonlib_Zellic.pdf)

## TVM и Fift

Виртуальная машина TON и язык программирования Fift.

**Аудиторская компания**: Trail of Bits\
**Отчет об аудите**:

- [Отчет об аудите Trail of Bits - TVM & Fift](https://docs.ton.org/audits/TVM_and_Fift_ToB.pdf)

## Обновление TVM 2023.07

Обновление TVM 2023.07 было проанализировано на предмет безопасности и потенциальных уязвимостей.

**Аудиторская компания**: Trail of Bits\
**Отчет об аудите**:

- [Отчет об аудите Trail of Bits - обновление TVM](https://docs.ton.org/audits/TVM_Upgrade_ToB_2023.pdf)

---

## Программа вознаграждений за ошибки

Чтобы еще больше повысить безопасность экосистемы TON, мы призываем исследователей и разработчиков в области безопасности принять участие в [Программе вознаграждения за обнаруженные ошибки в блокчейне TON](https://github.com/ton-blockchain/bug-bounty).



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/sharding.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/sharding.md
================================================
# Шардинг в блокчейне TON

[//]: # "TODO, это из gpt"

В блокчейне TON используются усовершенствованные механизмы шардинга для повышения масштабируемости и производительности, позволяющие эффективно обрабатывать огромное количество транзакций.
Основная концепция заключается в разделении блокчейна на более мелкие, независимые части, называемые **шардами**. Эти шарды могут обрабатывать транзакции параллельно, обеспечивая высокую пропускную способность даже по мере роста сети.

В TON шардинг очень динамичен. В отличие от других блокчейнов, которые имеют фиксированное количество шардов, TON может создавать новые шарды по требованию.
При увеличении нагрузки на транзакции шарды разделяются, а при уменьшении нагрузки - объединяются.
Такая гибкость гарантирует, что система сможет адаптироваться к меняющейся рабочей нагрузке, сохраняя при этом эффективность.

**Мастерчейн** играет важнейшую роль, поддерживая конфигурацию сети и конечное состояние всех **воркчейнов** и **шардчейнов**.
В то время как мастерчейн отвечает за общую координацию, **воркчейны** работают по своим особым правилам и могут быть разделены на шардчейны.
В настоящее время на TON работает только один воркчейн (**Basechain**).

В основе эффективности TON лежит **Парадигма Бесконечного Шардинга**, которая рассматривает каждый счет как часть собственного "чейна счетов". Затем эти чейны счетов объединяются в блоки шардчейна, что способствует эффективной обработке транзакций.

Помимо динамического создания шардов, TON использует функцию **Split Merge**, которая позволяет сети эффективно реагировать на изменение нагрузки, зависящее от количества транзакций. Подобная система улучшает масштабируемость и взаимодействие внутри сети блокчейна. Она демонстрирует уникальность подхода TON к решению общей проблемы блокчейнов, делая акцент на эффективность и глобальную согласованность.

## См. также

- [Шарды](/v3/documentation/smart-contracts/shards/shards-intro)
- [# Парадигма Бесконечного Шардинга](/v3/documentation/smart-contracts/shards/infinity-sharding-paradigm)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/smart-contract-addresses.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/smart-contract-addresses.md
================================================
# Адреса смарт-контрактов

[//]: # "TODO, это gpt"

В блокчейне TON каждый актор, включая кошельки и смарт-контракты, представлен адресом. Эти адреса имеют решающее значение при получении и отправке сообщений и транзакций. Существует два основных формата адресов смарт-контрактов: **исходный** и **пользовательский**.

## Компоненты адреса

Каждый адрес в TON состоит из двух основных компонентов:

- **Workchain ID**: подписанное 32-битное целое число, которое обозначает то, к какому воркчейну относится контракт (например, `-1` для Мастерчейна и `0` для Бейсчейна).
- **Account ID**: Уникальный идентификатор контракта, обычно длиной 256 бит для Мастерчейна и Бейсчейна.

## Исходный и пользовательский форматы адреса

### Необработанный адрес

**Исходный адрес** содержит только основные элементы:

- **Workchain ID** (например, `-1` для Мастерчейна)
- **Account ID**: 256-битный уникальный идентификатор

Пример:\
`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

Однако у адресов в исходном формате есть две основные проблемы:

1. У них нет встроенной проверки на ошибки. Это означает, что в случае возникновения ошибки при копировании могут быть потеряны средства.
2. Они не поддерживают дополнительные функции, такие как флаги возврата/невозврата.

### Пользовательский формат адреса

**Пользовательский адрес** решает эти проблемы, используя:

1. **Флаги**: они указывают на то, является ли адрес возвратным (для контрактов) или нет (для кошельков)
2. **Контрольную сумму**: 2-байтовый механизм проверки ошибок (CRC16), который помогает обнаруживать неточности перед отправкой.
3. **Кодирование**: оно преобразует необработанный адрес в читаемую компактную форму с использованием base64 или base64url.

К примеру, тот же исходный вид адреса можно преобразовать в удобный для чтения пользовательский адрес, например:\
`kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny` (base64)

Пользовательские адреса делают транзакции более безопасными, предотвращая ошибки и позволяя возвращать средства в случае неудачных транзакций.

## Состояния адресов

Каждый адрес в TON может находиться в одном из следующих состояний:

- **Nonexist**: Адрес не имеет данных (начальное состояние для всех адресов)
- **Uninit**: Адрес имеет баланс, но нет кода смарт-контракта
- **Active**: Адрес активен, а также имеет и код смарт-контракта и баланс
- **Frozen**: Адрес заблокирован из-за того, что расходы на хранение превышают его баланс

## Преобразование между форматами адресов

Для преобразования между исходным и пользовательским адресами вы можете использовать API TON или инструменты разработчика, такие как [ton.org/address](https://ton.org/address). Эти утилиты обеспечивают качественное преобразование и гарантируют правильный формат перед отправкой транзакций.

Более подробную информацию о том, как обрабатывать эти адреса, включая примеры кодирования и сведения о безопасности транзакций, вы можете найти в полном руководстве в [Документации по адресам](/v3/documentation/smart-contracts/addresses).

## См. также

- [Документация по адресам смарт-контрактов](/v3/documentation/smart-contracts/addresses)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/ton-networking.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-blockchain/ton-networking.md
================================================
# TON Сеть

Проект TON использует собственные одноранговые сетевые протоколы.

- Блокчейн **TON использует эти протоколы** для распространения новых блоков, отправки и сбора очереди на транзакцию и тому подобные операции.

  Сетевые требования проектов с одним блокчейном, таких как Bitcoin или Ethereum, могут быть удовлетворены довольно легко  – по сути нужно построить одноранговую оверлейную сеть, а затем распространять все новые блоки и кандидатов на транзакции через протокол [gossip](https://en.wikipedia.org/wiki/Gossip_protocol).В свою очередь проекты с несколькими блокчейнами, такие как TON, гораздо более требовательны к устройству сети. Например, нужно иметь возможность подписываться на обновления только некоторых из всего множества шардчейнов.

- Сервисы экосистемы **TON (например, TON Proxy, TON Sites, TON Storage) работают на этих протоколах.**

  Как только будут внедрены более сложные сетевые протоколы, необходимые для поддержки блокчейна TON, окажется, что их можно легко переиспользовать для целей, не связанных с непосредственными потребностями самого блокчейна, тем самым предоставя больше возможностей и гибкости для создания новых сервисов в самой TON экосистеме.

## См. также

- [Протокол ADNL](/v3/documentation/network/protocols/adnl/overview)
- [Оверлейные подсети](/v3/documentation/network/protocols/overlay)
- [Протокол RLDP](/v3/documentation/network/protocols/rldp)
- [Служба TON DHT](/v3/documentation/network/protocols/dht/ton-dht)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton.mdx
================================================
import Player from '@site/src/components/player'

# Обозреватели в TON

В этой статье мы рассмотрим обозреватели в TON, их возможности, а также их особенности с точки зрения разработки.

## Что такое обозреватель?

Обозреватель — это веб-сайт, позволяющий просматривать важную информацию в блокчейне. К ней можно отнести баланс счета, историю транзакций, блоки и т. д.

<Player url="https://www.youtube.com/watch?v=i5en19kzX6M" />

## Какие обозреватели существуют?

Среди обозревателей в TON можно выделить несколько категорий:

- Для повседневного использования
- С расширенной информацией для разработчиков
- Специализированные

Это разделение на категории во многом условно, и один обозреватель может относиться к нескольким категориям одновременно. Поэтому не будем уделять этому слишком много внимания.

## Псевдоним адреса в обозревателях

Сделайте адрес своего сервиса более удобным для пользователей, используя алиас адреса. Для этого создайте пул реквесты, PR, в соответствии с предоставленными ниже рекомендациями:

- [tonkeeper/ton-assets](https://github.com/tonkeeper/ton-assets) - псевдонимы Tonviewer.com
- [catchain/address-book](https://github.com/catchain/address-book)- псевдонимы Tonscan.org

## Общая функциональность

Давайте начнем с базовой функциональности, которая присутствует во всех обозревателях.

Большинство обозревателей имеют возможность уточнять информацию о балансах, истории транзакций, а также информацию о самом смарт-контракте, если он развернут на адресе.

Далее мы рассмотрим несколько обозревателей, которые можно отнести к каждой из описанных выше категорий.

## TON Scan.org

Хороший обозреватель для повседневного использования. Он обеспечивает комплексное представление блокчейна TON, позволяя пользователям искать транзакции, адреса, блоки и многое другое. Любой поиск выполняется по открытой [адресной книге](https://github.com/catchain/tonscan/blob/master/src/addrbook.json) (TON Foundation, OKX и др.)

### Функции

- **Удобен для повседневного использования**
- Удобен для разработчиков
- Поддержка TON DNS
- Типы контрактов
- Дизассемблер контрактов

### Ссылки

- URL: https://tonscan.org/
- URL Testnet: https://testnet.tonscan.org/

## TON Scan.com

### Функции

- Аналитика состояния транзакций
- Отслеживание транзакций

### Ссылки

- URL: https://tonscan.com/

## Ton Whales Explorer

Этот обозреватель больше ориентирован на разработчиков, чем на обычных пользователей.

### Возможности

- **Удобен для разработчиков**
- Типы контрактов
- Дизассемблер контрактов

### Ссылки

- URL: https://tonwhales.com/explorer

## Tonviewer Explorer

Это самый новый обозреватель и поэтому он обладает уникальными функциями. Например, Trace. Эта функция позволяет вам видеть всю последовательность транзакций между смарт-контрактами, даже если последующие транзакции не содержат вашего адреса.

Информация о транзакциях не такая подробная, как, например, на TON Whales.

### Функции

- Удобен для разработчиков
- Удобен для повседневного использования
- История транзакций жетонов
- **Trace**
- Поддержка TON DNS

### Ссылки

- URL: https://tonviewer.com/
- URL Testnet: https://testnet.tonviewer.com/

## TON NFT EXPLORER

Этот обозреватель специализируется на NFT, однако его можно использовать и как обычный обозреватель.

При просмотре адреса кошелька можно узнать какие NFT он хранит. В свою очередь при просмотре NFT, можно узнать метаданные, адрес коллекции, владельца, а также историю транзакций.

### Функции

- Удобен для разработчиков
- Типы контрактов
- **Специализируется на NFT**.

### Ссылки

- URL: https://explorer.tonnft.tools/
- URL Testnet: https://testnet.explorer.tonnft.tools/

## DTON

DTON – еще один обозреватель для разработчиков. Он предоставляет много информации о транзакциях в удобной форме.

Кроме того, он имеет функцию, которая позволяет вам видеть фазу вычислений транзакции шаг за шагом.

### Функции

- Удобен для разработчиков
- Расширенная информация о фазе вычислений
- Типы контрактов
- Дизассемблер контрактов

### Ссылки

- URL: https://dton.io/

## TON NFTscan

Этот обозреватель специально разработан для невзаимозаменяемых токенов (NFT) в блокчейне TON. Он позволяет пользователям исследовать, отслеживать и проверять транзакции, контракты и метаданные NFT.

### Функции

- Удобен для обычных пользователей
- Полезная информация для трейдеров, например, ежедневные объемы торгов
- Рейтинг коллекций NFT

### Ссылки

- URL: https://ton.nftscan.com/

## TonStat

Отображает различные статистические данные, такие как количество зарегистрированных сетевых адресов и кошельков, объем сжигаемых Toncoin, объем стейкинга Toncoin, объем выпущенных NFT, количество валидаторов и ряд других показателей.

### Функции

- Удобен для постоянных пользователей
- Полезная информация для трейдеров, например, ежедневные объемы торгов
- Информация о DeFi

### Ссылки

- URL: https://www.tonstat.com/

## Хотите попасть в этот список?

Пожалуйста, напишите одному из [сопровождающих](/v3/contribute/maintainers).

## Ссылки

- [ton.app/explorers](https://ton.app/explorers)
- [Awesome TON repository](https://github.com/ton-community/awesome-ton)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps.mdx
================================================
import Player from '@site/src/components/player'

# Приложения-кошельки

## Обзор

В этой статье описываются кошельки с точки зрения разработки. Конечная цель — создание приложений-кошельков, наличие которых поспособствует массовому распространению TON.

<br></br>
<Player url="https://www.youtube.com/watch?v=OfW96enpD4Q" />
<br></br>

Если вы хотите установить кошелек, сделать это можно на [ton.org/wallets](https://ton.org/wallets).

## Некастодиальные программные, горячие кошельки

:::info
Программный кошелек, также более известный как горячий кошелек, функционирует как программное обеспечение на хост-устройстве и хранит ваши личные ключи в своем интерфейсе. В основном эти кошельки являются некастодиальными, то есть они предоставляют вам право управления вашими ключами.
:::

Вот несколько некастодиальных кошельков для блокчейна TON:

- [TON Wallet](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd) - Классический многоплатформенный (iOS, Android, macOS, Linux, Windows) кошелек экосистемы TON, разработанный TON Foundation.
- [Tonkeeper](https://tonkeeper.com/) - многоплатформенный (iOS, Android, Firefox, Chrome) кошелек с открытым исходным кодом и большой базой пользователей.
- [MyTonWallet](https://mytonwallet.io/) - веб-кошелек с открытым исходным кодом для браузера и кошелек-расширение браузера для TON.
- [Tonhub](https://tonhub.com/) - альтернативный мобильный кошелек с открытым исходным кодом (iOS, Android) с расширенными функциями (TON Whales Staking UI).
- [OpenMask](https://www.openmask.app/) - кошелек-расширение для браузера Chrome с открытым исходным кодом и биометрической аутентификацией.

### TON Wallet

TON Wallet стал первым доступным для обычных пользователей инструментом в рамках массового внедрения технологий блокчейна. Он является ярким примером того, как кошелек должен работать на блокчейне TON.

|                                                                                                                                                                                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;![TON wallet](/img/docs/wallet-apps/TonWallet.png?raw=true) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |

#### Плюсы и минусы

- ✅ Оригинальный кошелек, разработанный TON Foundation. TON Wallet работает в соответствии с видением основных разработчиков блокчейна TON.
- ✅ Реализовано ADNL-соединение.
- ✅ Поддержка многоплатформенной архитектуры. Работает в Linux, Windows, macOS, iOS, Android, а также в качестве плагина для Chrome.
- ✅ [Программа вознаграждения за ошибки](https://github.com/ton-blockchain/bug-bounty)
- ❌ Редко обновляется. В этом кошельке нет всех актуальных функций (адреса DNS TON, а контракт wallet-v4 не поддерживается).
- ❌ Текущий пользовательский интерфейс устарел и хуже, чем у альтернативных кошельков.

#### Тестовая среда Ton Wallet

Чтобы переключить классический кошелек TON в тестовую среду, вам необходимо открыть в браузере с параметром testnet:

#### Ссылки

- [GitHub\*](https://github.com/ton-blockchain/wallet-ios)

  > Клиенты _TON Wallet_ для всех поддерживаемых операционных систем размещены в соответствующих репозиториях.

### Tonkeeper

[Tonkeeper](https://tonkeeper.com/) – самый скачиваемый и популярный кошелек, разработанный командой Tonkeeper. Проект активно поддерживается как разработчиками, так и пользователями.

|                                                                                                                                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;![Tonkeeper](/img/docs/wallet-apps/Tonkeeper.png?raw=true) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |

#### Плюсы и минусы

- ✅ Это приложение пользуется наибольшей популярностью у пользователей.
- ✅ Поддерживает все современные функции, включая нативную передачу NFT между кошельками пользователей.
- ✅ Поддерживает все основные платформы, такие как iOS и Android, а также работает в популярных браузерах, таких как Firefox или Chrome.
- ❌ Требуются продвинутые навыки для доработки исходного кода. 

#### Тестовая среда Tonkeeper

##### Мобильное приложение Tonkeeper

1. Создайте новый кошелек, чтобы получить фразу для восстановления, состоящую из 24 ключевых слов.
2. Вернитесь на главный экран Tonkeeper.
3. Нажмите на имя вашего кошелька в верхней части экрана.
4. Нажмите кнопку "Добавить кошелек" внизу экрана.
5. Выберите опцию Аккаунт в Testnet.
6. Введите фразу восстановления из шага 1.

Теперь ваш кошелек testnet создан и подключен к вашему кошельку mainnet.

#### Ссылки

- [GitHub](https://github.com/tonkeeper/wallet)
- [API кошелька Tonkeeper](https://github.com/tonkeeper/wallet-api)

### MyTonWallet

[MyTonWallet](https://mytonwallet.io/) – это самый многофункциональный веб-кошелек, а также расширение браузера для TON с поддержкой токенов, NFT, TON DNS, TON Sites, TON Proxy и TON Magic.

|                                                                                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;![MyTonWallet](/img/docs/wallet-apps/MyTonWallet.png?raw=true) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |

#### Плюсы и минусы

- ✅ Реализованы все основные функции.
- ✅ Уникальная функция — управление официальным контрактом [Nominator Pool](https://github.com/ton-blockchain/nominator-pool) из пользовательского интерфейса кошелька.
- ✅ Мультичейн-кошелек, поддерживающий блокчейн TRON.
- ✅ Поддерживает все основные платформы (такие как macOS, Linux и Windows), а также работает в Chrome как расширение.
- ❌ Требуются продвинутые навыки для доработки исходного кода. 

#### Тестовая среда MyTonWallet (браузер, настольное и мобильное приложение)

1. Перейдите в раздел настроек.
2. Прокрутите страницу вниз и нажмите на версию приложения MyTonWallet.
3. Во всплывающем окне выберите среду.

#### Ссылки

- [GitHub](https://github.com/mytonwalletorg/mytonwallet)
- [MyTonWallet Telegram](https://t.me/MyTonWalletRu)

### Tonhub

[Tonhub](https://tonhub.com/) – еще один полноценный кошелек TON, который поддерживает основные современные функции. Команда Ton Whales активно расширяют возможности кошелька.

|                                                                                                                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;![Tonhub](/img/docs/wallet-apps/Tonhub.png?raw=true) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |

#### Плюсы и минусы

- ✅ Имеет собственный пользовательский контракт [Ton Nominator](https://github.com/tonwhales/ton-nominators), поддерживаемый пользовательским интерфейсом Tonhub.
- ✅ Кошелек с открытым исходным кодом с самого начала работы выхода приложения.
- ✅ [Программа вознаграждения за ошибки](https://tonwhales.com/bounty).
- ❌ Не поддержки настольных платформ.
- ❌ Требует продвинутых навыков для доработки исходного кода.

#### Тестовая среда Tonhub

Вам потребуется загрузить отдельное приложение для подключения к Testnet.

#### Ссылки

- [GitHub](https://github.com/tonwhales/wallet)
- [Sandbox iOS](https://apps.apple.com/app/ton-development-wallet/id1607857373)
- [Sandbox Android](https://play.google.com/store/apps/details?id=com.tonhub.wallet)

### OpenMask

[OpenMask](https://www.openmask.app/) – новаторский инструмент, позволяющий взаимодействовать и работать в Web3 в качестве расширения браузера.

|                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;![OpenMask](/img/docs/wallet-apps/OpenMask.png?raw=true) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |

#### Плюсы и минусы

- ✅ Удобен для разработчиков в рамках изучения и создания DApps на ПК без использования мобильных устройств.
- ✅ Уникальные функции, такие как несколько кошельков, с подробными описаниями и примерами в документации.
- ❌ На данный момент практически не имеет интеграции с dApps.
- ❌ Поддерживает только платформу расширения браузера.

#### Тестовая среда OpenMask

Чтобы переключить OpenMask между Mainnet и Testnet: вам нужно нажать кнопку «mainnet/testnet» в верхней части главного экрана OpenMask и выбрать нужную вам сеть.

#### Ссылки

- [GitHub](https://github.com/OpenProduct/openmask-extension)
- [Документация](https://www.openmask.app/docs/introduction)

## Некастодиальные аппаратные, холодные кошельки

:::info
Аппаратный кошелек — это физическое устройство, которое хранит закрытые ключи к вашим криптовалютным средствам без доступа к Интернет. Даже если вы совершаете с ним транзакции, кошелек подтверждает транзакции в автономной среде. Этот механизм помогает защищать ваши закрытые ключи от рисков, которые несет в себе использование интернета.
:::

### Ledger

Аппаратные кошельки [Ledger](https://www.ledger.com/) с приложением Ledger Live.

#### Ссылки

- Руководство пользователя в[ TON блоге Ledger](https://blog.ton.org/ton-is-coming-to-ledger-hardware-wallets).
- Официальный сайт [Ledger](https://www.ledger.com/).

### SafePal

[SafePal](https://www.safepal.com/en/) – ваш проложенный путь в быстро расширяющуюся галактику децентрализованных приложений.

#### Ссылки

- Официальный сайт [SafePal](https://www.safepal.com/en/)

## Кастодиальные кошельки

:::info
С кастодиальным кошельком пользователь доверяет кому-то другому хранение закрытого ключа кошелька.
:::

### @wallet

[@wallet](https://t.me/wallet) – бот для отправки, получения или обмена TON на реальные деньги с использованием P2P в Telegram. Поддерживает интерфейс Мини-приложения Telegram.

|                                                                                                                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;![wallet](/img/docs/wallet-apps/Wallet.png?raw=true) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |

### @cryptobot

[@cryptobot](https://t.me/cryptobot) - бот-кошелек Telegram для хранения, отправки и обмена TON.

|                                                                                                                                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;![CryptoBot](/img/docs/wallet-apps/CryptoBot.png?raw=true) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |

#### Ссылки для сторонних интеграций

- [Crypto Pay API](https://help.crypt.bot/crypto-pay-api)

### @tonRocketBot

[@tonRocketBot](https://t.me/tonRocketBot) – бот-кошелек Telegram для хранения, отправки и обмена TON. Также поддерживает торговлю жетонами.

|                                                                                                                                                                                                                                        |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;![tonrocketbot](/img/docs/wallet-apps/tonrocketbot.png?raw=true) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |

#### Ссылки для интеграции с третьими сторонами

- [Rocket exchange](https://trade.ton-rocket.com/api/)
- [Rocket pay docs](https://pay.ton-rocket.com/api/)

## Мультиподписные кошельки

### Tonkey

Tonkey – это передовой проект, который ввел функционал мультиподписи в блокчейн TON.

### Ссылки

- https://tonkey.app/
- [GitHub](https://github.com/tonkey-app)

## См. также

- [Что такое блокчейн? Что такое смарт-контракт? Что такое газ?](https://blog.ton.org/what-is-blockchain)
- [Типы контрактов кошелька](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/educational-resources.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/educational-resources.mdx
================================================
import Button from '@site/src/components/button'

# Образовательные ресурсы

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

### Курсы

#### Основы технологии блокчейн

Этот курс знакомит с основами блокчейна, уделяя особое внимание практическим навыкам в экосистеме TON. Вы поймете, как функционирует блокчейн и его разнообразные приложения.

Этот курс предназначен для начинающих разработчиков, новичков в криптовалюте, людей, не имеющих технического образования в сфере ИТ и интересующихся блокчейнами.

<Button href="https://stepik.org/course/201294/promo" 
        colorType={'primary'} sizeType={'sm'}>

Английский

</Button>

<Button href="https://stepik.org/course/200976/promo" 
        colorType={'secondary'} sizeType={'sm'}>

Китайский

</Button>

<Button href="https://stepik.org/course/202221/promo" 
        colorType={'secondary'} sizeType={'sm'}>

Русский

</Button>

#### Разработка на блокчейне TON

Мы с гордостью представляем курс по блокчейну TON, который представляет собой исчерпывающее руководство по блокчейну TON. Курс предназначен для разработчиков, которые хотят научиться создавать смарт-контракты и децентрализованные приложения на блокчейне TON увлекательным и интерактивным способом.

Он состоит из **9 модулей** и охватывает основы блокчейна TON, язык программирования FunC и TON Virtual Machine (TVM).

Этот курс предназначен для разработчиков программного обеспечения и архитекторов смарт-контрактов.

<Button href="https://stepik.org/course/176754/promo" 
        colorType={'primary'} sizeType={'sm'}>

Английский

</Button>

<Button href="https://stepik.org/course/201638/promo" 
        colorType={'secondary'} sizeType={'sm'}>

Китайский

</Button>

<Button href="https://stepik.org/course/201855/promo" 
        colorType={'secondary'} sizeType={'sm'}>

Русский

</Button>

## См. также

- [TON Hello World](https://helloworld.tonstudio.io/01-wallet/)
- [Канал YouTube по обучению разработки на TON](https://www.youtube.com/@TONDevStudy)
- [Канал YouTube по обучению разработки на TON Русская версия](https://www.youtube.com/@WikiMar)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/glossary.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/glossary.md
================================================
# Глоссарий

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Введение

В этом глоссарии Вы найдете все популярные термины, связанные с TON и криптовалютами.

____________

## A

### Airdrop

**Airdrop** - бесплатное распределение токенов среди конкретных участников.

### Альткоин

**Альткоин** - все криптовалюты, кроме Биткоина, называются альткоинами.

### AMA

**AMA** - онлайн-сессия вопросов и ответов в формате "спроси меня о чём угодно", где руководители проектов отвечают на вопросы сообщества о продукте или услуге.

### API

**API** - интерфейс прикладного программирования, механизм, позволяющий двум программам взаимодействовать друг с другом посредством ряда протоколов.

### APY

**APY** - годовая процентная доходность, рассчитанная ставка годового процента для определённого актива.

____________

## B

### Медвежий

**Медвежий** - термин, используемый, когда цена актива снижается из-за продаж со стороны инвесторов. (Этот термин часто используется для описания общего настроя на рынке.)

### Binance

**Binance** - крупнейшая в мире криптовалютная биржа по ежедневному объему торгов.

### Биткойн (BTC)

**Биткойн (BTC)** - ведущая криптовалюта и первая децентрализованная сеть с открытым исходным кодом, которая заложила основу для развития технологии блокчейн.

### Блокчейн

**Блокчейн** - распределённый реестр данных в виде цепочки блоков, фиксирующий информацию о транзакциях для каждого события в сети.

### Кровавая баня

**Кровавая баня** - разговорный термин, используемый для описания серьёзного и продолжительного обвала рынка, сопровождающегося множеством глубоких красных свечей на ценовых графиках.

### BoC

**BoC** - Bag of Cells (пакет ячеек). Обычно используется в программном коде.

### BoF

**BoF** - Bag of Files (пакет файлов). Обычно используется в программном коде.

### Бот

**Бот** - программа, написанная для взаимодействия двух экосистем, например, The Open Network и мессенджера Telegram. В Telegram боты представляют собой аккаунты, управляемые программным обеспечением.

### Мост

**Мост** - программа, соединяющая различные блокчейны для передачи токенов и данных из одной сети в другую. TON Bridge доступен по [ссылке](https://ton.org/bridge/).

### Бычий

**Бычий** - термин "бычий" используется для описания актива, стоимость которого растет. ("Бычий" является противоположностью термина «медвежий» и обозначает общий рост стоимости рынка.)

### Сжигание

**Сжигание** - процесс сжигания или удаления определённого числа токенов из оборота и общего предложения, что часто приводит к увеличению спроса.

___________

## C

### CEX

**CEX** - централизованная криптовалютная биржа для торговли токенами.

### CMC

**CMC** - CoinMarketCap, агрегатор криптовалютной информации, который внимательно отслеживает изменения цен на токены и рыночной капитализации.

### Coinbase

**Coinbase** - крупнейшая криптовалютная биржа в США.

### Cryptobot

**Криптобот** - P2P-бот-сервис для покупки, торговли и продажи Toncoin и других криптовалют без процедуры верификации "Знай своего клиента" (KYC).

### Кастодиальный

**Кастодиальный** - тип криптовалютного кошелька, при котором криптовалюты хранятся третьей стороной, а не их настоящим владельцем.

___________

## D

### DApps

**DApps** - децентрализованные приложения, работающие на блокчейнах и поддерживаемые группой узлов, а не централизованным сервером.

### DCA

**DCA** - усреднение стоимости покупки (dollar-cost averaging), инвестиционная стратегия, при которой инвесторы покупают криптоактивы по низкой, но фиксированной цене, чтобы снизить риски.

### Децентрализация

**Децентрализация** - один из основных принципов, лежащих в основе TON и других блокчейнов. Без децентрализации достижение Web3 было бы невозможно, поэтому каждый элемент экосистемы TON направлен на максимизацию децентрализации.

### DeFi

**DeFi** - децентрализованный аналог традиционных финансов, включающий доступные финансовые услуги и приложения, основанные на смарт-контрактах.

### DEX

**DEX** - децентрализованная биржа (DEX), на которой пользователи могут обменивать криптовалюты без посредников. Онлайновым элементом, обеспечивающим безопасные транзакции, является сам блокчейн.

### Бриллиантовые руки

**Бриллиантовые руки** - разговорный термин, описывающий инвестора, который не намерен продавать свои активы независимо от состояния рынка, даже если происходит крах или рынок находится в пессимистичной ситуации.

### DNS

**DNS** - система доменных имён, технология, которая позволяет пользователям осуществлять транзакции между читаемыми человеком доменными именами (ton.org) и машиночитаемыми IP-адресами (192.0.2.44).

### Дельфин

**Дельфин** - инвестор с небольшим капиталом, но оказывающий влияние на сообщество.

### Пожертвование

**Donate** - бот-сервис в Telegram, через который люди могут делать пожертвования, а создатели контента — монетизировать свои каналы и услуги в Telegram с возможностью оплаты в Toncoin.

### Сбрасывание

**Дамп** - манипулирование ростом стоимости токена или криптовалюты с последующим выводом средств.

### Дуров

**Дуров** - Павел Дуров, российский предприниматель, известный как основатель социальной сети VK и мессенджера Telegram. Николай Дуров — брат Павла, который участвовал в разработке VK, Telegram, а также в создании TON.

### DYOR

**DYOR** - *Do Your Own Research* (Проводите собственное исследование), процесс, при котором вы исследуете проект, компанию или криптовалюту перед принятием решения об инвестициях.

___________

## E

### EVM

**EVM** - Ethereum Virtual Machine (Виртуальная машина Ethereum), система, функционирующая как децентрализованный компьютер, которая вычисляет состояние блокчейна Ethereum после каждого нового блока и выполняет смарт-контракты.

### Обмен

**Обменник** - место для торговли и использования других рыночных инструментов.

___________

## F

### Farming

**Farming** - предоставление криптовалютных активов в займ с целью получения вознаграждений.

### Fiat

**Фиат** - обычные деньги, выпускаемые центральными банками или финансовыми органами.

### FOMO

**FOMO** - "страх упустить шанс", психологическое состояние, которое охватывает некоторых инвесторов, когда они боятся потерять возможную прибыль от упущенной возможности. Обычно появляется во время бычьего рынка, когда трейдеры не проводят должное исследование и анализ конкретного проекта.

### Взаимозаменяемые токены

**Взаимозаменяемые токены** - криптовалюты, которые имеют одинаковую стоимость с любым другим токеном того же типа в любой момент времени.

### FUD

**FUD** - "Страх, неопределённость и сомнения", рыночные настроения, основанные на различных факторах.

### Полный узел

**Полный узел** - компьютер в блокчейне TON, который синхронизирует и копирует весь блокчейн TON.

### FunC

**FunC** - язык смарт-контрактов на TON.

___________

## G

### Газ

**Газ** - плата, взимаемая за транзакции в блокчейне.

### GitHub

**GitHub** - платформа, на которой разработчики собираются для создания базового кода для программ.

___________

## H

### Хакатон

**Hackathon** - собрание программистов для разработки программного обеспечения, приложений и других технологий.

### Хэш

**Хэш** - информация о данных транзакции, созданная с помощью хэширующего алгоритма.

### Скорость хэширования

**Скорость хэширования** - показатель вычислительной мощности, используемой в сети для майнинга криптовалюты.

### Удержание

**Удержание** - удержание, то есть не продажа актива или активов из Вашего портфеля.

___________

## I

### ICO

**ICO** - первичное предложение монет (Initial Coin Offering), метод привлечения капитала для криптопроектов на ранних стадиях развития.

### IDO

**IDO** - первичное предложение на децентрализованной бирже (Initial Decentralized Exchange Offering), ещё один метод привлечения капитала при запуске криптовалюты или токена на децентрализованной бирже.

### Инфляция

**Инфляция** - процесс, при котором стоимость валюты, например, доллара США или евро, снижается. Toncoin (и другие криптовалюты) эмитируются с высокой степенью прозрачности и предсказуемым выпуском, что придаёт им дефляционные свойства.

___________

## K

### KYC

**KYС** - *Знай своего клиента*, процесс, при котором пользователь подтверждает свою личность при создании аккаунта для криптосервиса.

___________

## L

### Launchpad

**Launchpad** - платформа для крипто-стартапов, которая соединяет инвесторов и проекты. Основной launchpad в экосистеме TON — это Tonstarter.

### Пул ликвидности

**Пул ликвидности** - объединение криптовалютных активов с их заморозкой в смарт-контракте. Пулы ликвидности используются для децентрализованной торговли, кредитования и других операций.

__________

## M

### Mainnet

**Мейннет** - главная сеть блокчейна.

### Рыночная стоимость (капитализация)

**Рыночная стоимость (капитализация)** - общая стоимость криптовалюты, рассчитанная как произведение количества её токенов на текущую цену.

### Мастерчейн

**Мастерчейн** - в многоуровневом блокчейне мастерчейн является наиболее важным слоем. Для TON мастерчейн — это основная цепочка сети. Операции в блокчейне происходят именно в мастерчейн.

### Метавселенная

**Metaverse** - цифровая вселенная, аналогичная видеоигре, в которой пользователи создают аватары и взаимодействуют с цифровыми представлениями других людей или пользователей.

### Луна

**Луна** -криптовалютный термин, описывающий вертикальное движение актива на графике цен — то есть его быстрое повышение стоимости.

__________

## N

### NFA

**NFA** - not financial advice (не является финансовым советом), аббревиатура, используемая в качестве отказа от ответственности при обсуждении криптовалют или проектов с другими людьми.

### NFT

**NFT** - невзаимозаменяемый токен (non-fungible token), уникальный цифровой токен на блокчейне, который невозможно дублировать или выпустить повторно.

### Номинатор

**Номинатор** - участники, предоставляющие финансовые ресурсы валидаторам, чтобы те могли подтверждать блоки в блокчейне TON.

### Некостодиальный

**Некостодиальный** - тип криптокошелька, который предоставляет владельцу/пользователю полный контроль над активами.

__________

## O

### Офф-рамп

**Офф-рамп** - процесс или сервис, позволяющий конвертировать криптовалюту в фиатные деньги.

### Он-рамп

**Он-рамп** - способы конвертации (покупки) криптовалюты путем траты фиатных денег.

### Луковая маршрутизация

**Луковая маршрутизация** - технология, аналогичная TOR, которая обеспечивает анонимное взаимодействие в сети. Все сообщения шифруются в несколько слоёв, напоминающих структуру луковицы. В TON Proxy используется подобный метод.

__________

## P

### Бумажные руки

**Бумажные руки** - инвестор, склонный к панической продаже активов, не обладающий достаточным опытом в инвестициях.

### Proof-of-stake

**Proof-of-stake** -механизм консенсуса для обработки транзакций в новых блоках на блокчейне.

### Proof-of-work

**Доказательство работы** - алгоритм консенсуса, при котором одна сторона доказывает другой, что была затрачена определённая вычислительная мощность. Сторона может проверить это, потратив немного энергии.

### Прокси

**Прокси** - сервис в компьютерной сети, который позволяет клиентам устанавливать косвенные сетевые соединения с другими сетевыми сервисами.

### Pump

**Pump** - искусственное завышение цены криптовалюты или актива.

### P2P

**P2P** - *peer-to-peer*, транзакции между пользователями без участия третьей стороны или посредника.

__________

## R

### Дорожная карта

**Дорожная карта** - стратегический план проекта, который показывает, когда будут выпущены его продукты, услуги, обновления и т. д.

### ROI

**ROI** - *возврат на инвестиции*, прибыль, полученная от инвестиций.

_________

## S

### SBT

**SBT** - *Soulbound token*, NFT, который нельзя передать, поскольку он содержит информацию о владельце и его достижениях.

### Масштабируемость

**Масштабируемость** - способность блокчейн-сети обрабатывать сложные транзакции, а также большое их количество.

### SEC

**SEC** - Комиссия по ценным бумагам и биржам (Securities and Exchange Commission), финансовый регулятор в США.

### Shard

**Shard** - механизм, который помогает блокчейн-сети масштабироваться, разделяя её на более мелкие блокчейны для снижения нагрузки на сеть — это то, что реализует блокчейн TON.

### Смарт-контракт

**Смарт-контракт** - самовыполняющийся код, который контролирует и позволяет выполнять операции с помощью математических алгоритмов без участия человека.

### Спотовая торговля

**Спот-трейдинг** - торговля финансовым активом за деньги, при которой сделка заключается и исполняется немедленно по текущей рыночной цене.

### Stablecoin

**Стабильный монета** - криптовалюта, чья стоимость стабильна (обычно привязана к фиатной валюте) и не подвергается резким колебаниям.

### Staking

**Staking** - способ получения пассивного дохода пользователями путём хранения монет или токенов в алгоритме Proof-of-Stake, что, в свою очередь, обеспечивает бесперебойную работу блокчейна. За это пользователи получают вознаграждения в качестве стимула.

### Обмен

**Swap** - обмен двух финансовых активов - например, Toncoin на USDT.

________

## T

### TEP

**TEP** - [TON Enhancement Proposals](https://github.com/ton-blockchain/TEPs), стандартный набор методов взаимодействия с различными частями экосистемы TON.

### Testnet

**Testnet** - сеть для тестирования проектов или услуг перед запуском в основной сети.

### Тикер

**Тиккер** - сокращённая форма криптовалюты, актива или токена на биржах, торговых сервисах или других DeFi-решениях — например, TON для Toncoin.

### Слияние

**The Merge** - процесс перехода Ethereum с алгоритма консенсуса Proof-of-Work на Proof-of-Stake.

### Токен

**Токен** - форма цифрового актива, которая может выполнять различные функции.

### Токеномика

**Токеномика** - экономический план и стратегия распределения криптовалюты (или токена).

### На луну

**На луну** - разговорное выражение, используемое для создания эффекта FOMO. Оно относится к надеждам, что стоимость криптовалюты быстро вырастет, что символизирует её траекторию к Луне.

### Тонкоин

**Toncoin** - родная криптовалюта экосистемы TON, которая используется для разработки сервисов, оплаты сборов и услуг. Её можно покупать, продавать и обменивать.

### Торговля

**Торговля** - покупка и продажа криптовалют с целью получения прибыли.

### TVL

**TVL** (Total Value Locked) - общая заблокированная стоимость, которая представляет собой количество активов, в настоящее время заблокированных в конкретном протоколе.

### TVM

**TVM** - Ton Virtual Machine (виртуальная машина Тон), машина, функционирующая как децентрализованный компьютер, вычисляющая состояние блокчейна Ton после каждого нового блока и выполняющая смарт-контракты.

___________

## V

### Валидатор

**Валидатор** - участники, которые проверяют новые блоки в блокчейне TON.

___________

## W

### WAGMI

**WAGMI** - WAGMI — "we’re all gonna make it" (мы все добьёмся успеха), фраза, часто используемая в криптосообществе для выражения надежды стать богатыми когда-то, инвестируя в криптовалюты.

### Кошелек

**Кошелек** - программное обеспечение, которое хранит криптовалюты через систему приватных ключей, необходимых для покупки или продажи криптовалют и токенов. Также это бот в экосистеме TON для покупки и продажи Toncoin.

### Web3

**Web3** - новое поколение интернета, основанное на технологии блокчейн, которое включает в себя децентрализацию и токеномику.

### Кит

**Кит** - инвестор, который владеет большим количеством криптовалют и токенов.

### Белый список

**Белый список** - список, предоставляющий людям особые привилегии.

### Белая бумага

**Белая книга** - основной документ проекта, написанный его разработчиками. Он объясняет технологию и цели проекта.

### Список наблюдения

**Список наблюдения** - настраиваемый список криптовалют, за ценовыми действиями которых инвестор хочет следить.

### Workchain

**Workchain** - вторичные цепочки, которые подключаются к мастерчейну. Они могут содержать огромное количество различных связанных цепочек с собственными правилами консенсуса. Также они могут включать информацию об адресах и транзакциях, а также виртуальные машины для смарт-контрактов. Кроме того, они могут быть совместимы с мастер-цепочкой и взаимодействовать друг с другом.

___________

## Y

### Yield farming

**Yield farming**\* - предоставление или размещение криптовалют, или токенов в смарт-контракт с целью получения вознаграждений в виде транзакционных сборов.

### Yolo

**Yolo** - "you only live once" (ты живёшь только один раз), сленговая аббревиатура, используемая как призыв жить на полную катушку, не учитывая риски связанного с этим начинания.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/qa-outsource/auditors.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/qa-outsource/auditors.mdx
================================================
import Button from '@site/src/components/button'

# Поставщики гарантий безопасности (Security assurance providers)

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::info
Протестируйте свое программное обеспечение с помощью следующих поставщиков услуг по обеспечению качества.
Найдите больше аудиторов экосистемы TON на [ton.app/audit](https://ton.app/audit).
:::

## Основные SAP блокчейна TON

- [beosin.com](https://beosin.com/?lang=en-US)
- [certik.com](https://www.certik.com/)
- [quantstamp.com](https://quantstamp.com/)
- [ton.tech](https://ton.tech/)
- [trailofbits.com](https://www.trailofbits.com/)
- [zellic.io](https://www.zellic.io/)
- [tonbit.xyz](https://www.tonbit.xyz/)

## См. также

- [Аудиторы экосистемы TON](https://ton.app/audit)
- [Работа в TON](https://jobs.ton.org/jobs)
- [Таланты TON](https://ton.org/en/talents)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/qa-outsource/outsource.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/concepts/qa-outsource/outsource.mdx
================================================
import Button from '@site/src/components/button'

# Разработка на аутсорсинге

:::danger
Эта страница устарела и скоро будет удалена. Пожалуйста, ознакомьтесь с информацией о разработчиках экосистемы на странице [ton.org/en/talents](https://ton.org/en/talents).
:::

## Список команд аутсорсинга

Ниже приведен список квалифицированных аутсорс команд разработчиков для вашего проекта TON

- [Astralyx](#astralyx)
- [Coinvent](#coinvent)
- [EvaCodes](#evacodes)
- [Pixelplex](#pixelplex)
- [Serokell](#serokell)
- [softstack](#softstack)

### Astralyx

#### Краткие сведения

Компания с большим опытом в разработке TON и других сетей. Вы можете попросить нас создать дизайн, мини-приложение Telegram (TMA), веб-сайт, что угодно.

#### Направления работы

- Разработка смарт-контрактов TON (включая аудит и тестирование)
- Разработка Web 2.0 и Web 3.0
- Дизайн, художественное оформление, привлечение потенциальных клиентов для проектов

#### Проекты

- [t.me/xjetswapbot](http://t.me/xjetswapbot) (frontend, дизайн),
- [github.com/astralyxdev/lockup-jettons-contract](http://github.com/astralyxdev/lockup-jettons-contract) (смарт-контракт, веб-интерфейс, тесты)
- [github.com/astralyxdev/ton-proxy](http://github.com/astralyxdev/ton-proxy) (расширение TON Proxy, одно из первых)
- [scaleton.io](http://scaleton.io) (лендинг, frontend, дизайн)

#### Контакты

[astralyx.dev](http://astralyx.dev), contact@astralyx.dev

### Coinvent

#### Краткие сведения

Coinvent - это специализированная команда разработчиков на аутсорсинге, нацеленная на создание успешных проектов. Их экспертиза варьируется от создания простых ботов до разработки сложных DeFi протоколов.

#### Направления работы

- Смарт-контракты
- DeFi, NFT
- dApps, Мини-приложения Telegram
- Обычный Web2
- Боты Telegram

#### Проекты

- [Модуль Tonraffles Lock](https://tonraffles.app/lock) (смарт-контракт, front-end)
- [Tonraffles NFT Launchpad](https://tonraffles.app/nft/launchpad) (смарт-контракты)
- [Monaki NFT Staking](https://www.monaki.life/) (смарт-контракты)

#### Контакты

- [coinvent.dev](https://coinvent.dev)
- [@coinvent_dev](https://t.me/coinvent_dev)
- contact@coinvent.dev

### EvaCodes

#### Краткие сведения

EvaCodes - ведущая восточноевропейская компания по блокчейн разработке с командами, расположенными в Украине, Армении и Польше. В состав компании входят более 50 квалифицированных разработчиков, которые разработали более 60 web3-решений, включая банковские web3 решения, блокчейны L1 и инфраструктуру web3.

#### Направления работы

- DeFi
- Криптовалютные кошельки
- Решения на основе NFT

#### Проекты

- [alium.finance](https://alium.finance/)
- [konsta.network](https://konsta.network/)

#### Контакты

- ton@evacodes.com
- [evacodes.com](https://evacodes.com/)
- Telegram [@salesevacodes](https://t.me/salesevacodes)

### Pixelplex

#### Краткие сведения

PixelPlex выделяется тем, что предоставляет безопасные и масштабируемые решения на базе блокчейна, разрабатывая все: от надежных протоколов до передовых систем управления рисками. Ориентируясь на результат и повышение ценности проекта, PixelPlex умело решает сложные задачи, где другие команды не справляются. Опыт компании охватывает более 450 проектов в различных отраслях, включая финтех, здравоохранение, недвижимость и электронную коммерцию.

#### Направления работы

- Разработка, не зависящая от экосистем
- Индивидуальная разработка протоколов
- Улучшение DeFi
- Решения по масштабированию ZK rollup
- Оптимизация смарт-контрактов
- Решения с поддержкой NFT
- Предложение токенов безопасности (Security token offering)

#### Проекты

- [web3antivirus.io](https://web3antivirus.io)
- [qtum.org](https://qtum.org)
- [blackfort.exchange](https://blackfort.exchange/)
- [patientory.com](https://patientory.com/)
- [cyndicate.io](https://cyndicate.io)
- [streamsettle.com](https://streamsettle.com/)
- [savage.app](https://savage.app/marketplace)

#### Контакты

- [pixelplex.io](https://pixelplex.io)
- [info@pixelplex.io](mailto:info@pixelplex.io)

### Serokell

#### Краткие сведения

Самая эксцентричная компания с самыми смелыми идеями в области программирования на Ton и FunC.

#### Направления работы

- Кибербезопасность (аудит смарт-контрактов)
- Разработка смарт-контрактов и dApp
- Кошельки для цифровых активов

#### Проекты

- [Symbiosis](https://symbiosis.finance/)
- [Serokell Case Studies](https://serokell.io/project-ton-blockchain)
- Проведен аудит безопасности контракта TON Wallet

#### Контакты

- [serokell.io](https://serokell.io/)
- Telegram [Roman Alterman](https://t.me/alterroman)
- hi@serokell.io

### softstack

#### Краткие сведения

С 2017 года Softstack является ведущим поставщиком комплексных решений для Web 3, специализирующимся на разработке программного обеспечения и аудите смарт-контрактов. Сделано в Германии

#### Направления работы

- Разработка смарт-контрактов и dApp
- Кошельки для цифровых активов
- Мини-приложения и Telegram боты
- Кибербезопасность (аудит смарт-контрактов, тестирование на проникновение)

#### Проекты

- [DeGods](https://degods.com)
- [tixbase](https://tixbase.com)
- [TMRW Foundation](https://tmrw.com)
- [Bitcoin.com](https://bitcoin.com)
- [Coinlink Finance](https://coinlink.finance)

#### Контакты

- hello@softstack.io
- [softstack.io](https://softstack.io/)
- Telegram [@yannikheinze](https://t.me/yannikheinze)

## Добавьте свою команду

Если вы полностью готовы стать аутсорсинговым агентом для экосистемы TON, вы можете продвигать свою компанию, заполнив нашу форму или отправив запрос на включение.

<Button href="https://hvmauju3.paperform.co/" colorType={'primary'} sizeType={'sm'}>

Добавить команду

</Button>

<Button href="https://github.com/ton-community/ton-docs/tree/main/docs/v3/concepts/qa-outsource/outsource.mdx"
        colorType="secondary" sizeType={'sm'}>

Запрос на включение изменений

</Button>

<br></br><br></br>

## См. также

- [Поставщики услуг по обеспечению безопасности](/v3/concepts/qa-outsource/auditors/)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/README.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/README.md
================================================
# Как внести свой вклад

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::info
Узнайте, как отправить контент в документацию TON здесь.
:::

## Правила внесения вклада

### Политика ведения документации

Документация TON полностью открыта. Энтузиасты сообщества и ранние участники TON сыграли ключевую роль в создании этой открытой документации TON, превратив свои заметки в подробные страницы.

Первоначально она была написана [участниками] TON (/v3/contribute/maintainers/) и поддерживается [TON Studio] (https://tonstudio.io/).
Мы стремимся рассказать пользователям о TON с помощью понятного контента с возможностью простого поиска, который понравится техническим экспертам и обычным читателям.

### Как внести свой вклад

:::info
Эта документация написана на английском языке. Пожалуйста, обратитесь к [программе локализации](/v3/contribute/localization-program/how-to-contribute/) для других языков.
:::

1. Клонируйте текущую версию из репозитория GitHub [ton-docs](https://github.com/ton-community/ton-docs).
2. Определите область для внесения вклада в соответствии с [руководством по стилю](/v3/contribute/style-guide/) и откройте связанную [задачу](https://github.com/ton-community/ton-docs/issues).
3. Ознакомьтесь со [Стандартизацией контента](/v3/contribute/content-standardization/) и [Типографикой](/v3/contribute/typography/).
4. Откройте запрос на извлечение ветки `main` с четким описанием и краткими обновлениями в соответствии с шаблоном.

#### Шаблон запроса на объединение в пул

```md

## Description

Please provide a brief description of the changes introduced in this pull request. Include any relevant issue numbers or links.

## Checklist

- [ ] I have created an issue.
- [ ] I am working on content that aligns with the [Style guide](https://docs.ton.org/v3/contribute/style-guide/).
- [ ] I have reviewed and formatted the content according to [Content standardization](https://docs.ton.org/v3/contribute/content-standardization/).
- [ ] I have reviewed and formatted the text in the article according to [Typography](https://docs.ton.org/v3/contribute/typography/).

```

4. Перед отправкой запроса на включение внесенных изменений выполните и проверьте каждый этап в контрольном списке описания.

:::info
Чтобы избежать чрезмерной доработки, прочтите рекомендации по внесению вклада в [Руководстве по стилю](/v3/contribute/style-guide/), [Стандартизации контента](/v3/contribute/content-standardization/) и [Типографики](/v3/contribute/typography/) перед внесением вклада. Не беспокойтесь о незначительных проблемах; сопровождающие помогут вам исправить их в процессе проверки.
:::

### Разработка

- Изучите процесс разработки документации на основе документа [ton-docs/README.md](https://github.com/ton-community/ton-docs?tab=readme-ov-file#set-up-your-environment-%EF%B8%8F).

#### Лучшая практика для запросов на извлечение

1. **Сделайте ваш pull request небольшим**. Меньшие pull requests (~300 строк различий) легче проходят проверку и вероятнее всего будут приняты. Убедитесь, что pull request выполняет только одно действие, в противном случае разделите его.
2. **Используйте описательные заголовки**. Рекомендуется придерживаться стиля сообщений фиксации.
3. **Протестируйте свои изменения**. Запустите сборку локально и убедитесь, что у вас нет сбоев.
4. **Используйте мягкий перенос**: не переносите строки по 80 символов; настройте редактор на мягкий перенос.

## Общайтесь с другими разработчиками

- [Задавайте вопросы, связанные с документацией TON, в чате TON Docs Club в Telegram.](https://t.me/+c-0fVO4XHQsyOWM8)
- [Ознакомьтесь с наиболее часто задаваемыми вопросами в чате разработчиков TON.](https://t.me/tondev)
- [Создайте задачу с вашими идеями по улучшению.](https://github.com/ton-community/ton-docs/issues)
- [Найдите и получите доступные вознаграждения за документацию.](https://github.com/ton-society/ton-footsteps/issues?q=documentation)
- [См. docs-ton на GitHub.](https://github.com/ton-community/ton-docs)

## См. также

- [Руководство по стилю](/v3/contribute/style-guide/)
- [Типографика](/v3/contribute/typography/)
- [Программа локализации](/v3/contribute/localization-program/overview/)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/contribution-rules.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/contribution-rules.md
================================================
# Руководство по внесению вклада

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::danger
Эта страница устарела и скоро будет удалена.
См. [Как внести вклад](/v3/contribute/).
:::

Перед добавлением любой страницы на docs.ton.org, пожалуйста, ознакомьтесь со следующим списком общих и важных требований, чтобы гарантировать качественную работу.

## Название

- Необходимо обеспечить правильное использование *THE* в документации TON. *TON Blockchain* и *TON Ecosystem* - термины, написанные с заглавной буквы, и поэтому они не требуют использования *THE*.
- Мы пишем *TON* с обычными существительными, и если по английской грамматике требуется артикль *THE*, мы используем его. Например: "*The* TON Connect *protocol* is a..."

:::info
TON Blockchain...

TON Ecosystem...

The TON Connect protocol...
:::

Пожалуйста, ознакомьтесь с актуальными brand assets TON [здесь](https://ton.org/en/brand-assets).

## Ссылки в документации

Каждая страница в документации TON должна заканчиваться разделом "См. также". Разместите там страницу, которая, по вашему мнению, относится к текущей странице без дополнительного описания.

:::info

```
## See Also
* [TON Contribution Guidelines](/v3/contribute/contribution-rules/)
* [Tutorial Styling Guidelines](/v3/contribute/tutorials/guidelines/)
```

:::

## Полезные источники на английском языке

Экосистема TON создается для всего мира, поэтому крайне важно, чтобы она была понятна всем на Земле. Здесь мы предоставляем материалы, которые будут полезны для начинающих технических писателей, желающих улучшить свои навыки английского языка.

- [Plural Nouns](https://www.grammarly.com/blog/plural-nouns/)
- [Articles: A versus An](https://owl.purdue.edu/owl/general_writing/grammar/articles_a_versus_an.html)

## См. также

- [Руководство по внесению вклада в TON](/v3/contribute/contribution-rules/)
- [Рекомендации по оформлению руководств](/v3/contribute/tutorials/guidelines/)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/docs/guidelines.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/docs/guidelines.md
================================================
# Общие принципы работы с документацией

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::danger
Эта страница устарела и скоро будет удалена.
См. [Как внести вклад](/v3/contribute/).
:::

Для обеспечения оптимального взаимодействия с пользователем и ясности, пожалуйста, помните о списке общих и важных требований, которые мы стремимся применять ко всей документации на docs.ton.org при создании нового контента.

## Документация, созданная для профессионалов

Страницы документации в первую очередь предназначены для документирования, а не как учебное пособие, поэтому важно свести к минимуму использование личных примеров или аналогий в тексте. Важно убедиться, что содержание подходит как для профессионалов, так и непрофессионалов, и при этом содержит ценную информацию.

## Используйте единый формат

Чтобы читателям было легче ориентироваться в документации, важно использовать единый формат во всем документе. Используйте заголовки, подзаголовки, маркеры и нумерованные списки, чтобы разбить текст и сделать его более удобным для чтения.

## Приведите примеры в специальном разделе

Приведите примеры в специальном разделе
Приведение примеров может помочь читателям лучше понять контент и то, как его применять. Если вы пишете страницу документации и вам нужно сослаться на несколько примеров, пожалуйста, создайте специальный раздел "Примеры" прямо перед разделами "Ссылки" и "См. также". Не смешивайте описание и примеры на страницах документации. Используйте фрагменты кода, снимки экрана или диаграммы, чтобы проиллюстрировать свои соображения и сделать документацию более интересной.

## Поддерживайте ее актуальность

Техническая документация может быстро устареть из-за изменений в технологиях или обновлений программного обеспечения. Важно регулярно просматривать и обновлять документацию, чтобы она оставалась точной и соответствующей текущей версии программного обеспечения.

## Получите обратную связь

Перед публикацией документации рекомендуется получить обратную связь от других участников или пользователей. Это может помочь выявить области, которые могут вызывать путаницу или неясность, и позволит вам внести улучшения до выхода документации.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/docs/schemes-guidelines.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/docs/schemes-guidelines.mdx
================================================
import ConceptImage from '@site/src/components/conceptImage';
import ThemedImage from '@theme/ThemedImage';

# Рекомендации по графическим пояснениям

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::danger
Эта страница устарела и скоро будет удалена.
См. [Как внести вклад](/v3/contribute/).
:::

Поддержание согласованности в документации имеет решающее значение, и для достижения этого был разработан специальный стандарт визуализации процессов в смарт-контрактах.

## Графические пояснения

### График обработки сообщений

Для изображения обработки сообщений рекомендуется использовать графическое представление, напоминающее график смарт-контракта, с метками для транзакций и сообщений.

Если порядок транзакций не имеет значения, вы можете опустить их метки. Это упрощает диаграмму, облегчая чтение и понимание деталей, связанных с сообщениями и контрактами.

#### Примитивы аннотаций

<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/scheme-templates/message-processing-graphs/Graphic-Explanations-Guidelines_1.png?raw=true',
    dark: '/img/docs/scheme-templates/message-processing-graphs/Graphic-Explanations-Guidelines_1_dark.png?raw=true',
  }}
/>
<br></br>

- Избегайте использования большого количества разных и ярких цветов.
- Используйте модификацию рисунков, например, использование пунктирной линии границы.
- Для лучшего понимания различные транзакции могут отображаться с различными стилями линий (сплошными и пунктирными).

#### Пример обработки сообщения

<br></br>
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/message-delivery/message_delivery_2.png?raw=true',
    dark: '/img/docs/message-delivery/message_delivery_2_dark.png?raw=true',
  }}
/>
<br></br>

Изучите примеры непосредственно в Visio [message-processing.vsdx](/schemes-visio/message_processing.vsdx).

### Форматы и Цвета

#### Шрифты

- Семейство шрифтов **Inter** для всего текста в диаграммах.

#### Цвета — светлый режим

- Рисунок карандашом (тема по умолчанию)

#### Цвета — темный режим

- Шрифт `#e3e3e3`
- Фон `#232328`
- Светлое выделение (стрелки и границы схемы) `#058dd2`
- Темное выделение (стрелки и границы схемы) `#0088cc`
- Внутренний фон (для вложенных блоков) `#333337`

#### Политика контроля версий

- Установите диаграммы в документации в формате SVG для схем, чтобы обеспечить читаемость на различных устройствах.
- Храните исходные файлы в репозитории Git проекта в каталоге `/static/visio`, что упростит их изменение в будущем.

### Диаграмма последовательности

В случае сложных и повторяющихся схем связи между 2-3 участниками рекомендуется использовать диаграмму последовательности. Для сообщений используйте нотацию обычного синхронного сообщения.

#### Пример

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/message-delivery/message_delivery_7.png?raw=true',
    dark: '/img/docs/message-delivery/message_delivery_7_dark.png?raw=true',
  }}
/>
</div>
<br></br>

### Ссылки на схемы

- [message-processing.vsdx](/schemes-visio/message_processing.vsdx)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/localization-program/how-it-works.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/localization-program/how-it-works.md
================================================
# Как это работает

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

![how it works](/img/localizationProgramGuideline/localization-program.png)

Программа локализации **TownSquare Labs** состоит из нескольких ключевых компонентов. В этой главе будет представлен обзор того, как работает программа, что поможет вам понять ее работу и как эффективно ее использовать.

В этой системе мы интегрируем несколько приложений для бесперебойной работы в качестве единой программы:

- **GitHub**: размещает документацию, синхронизирует документы из репозитория upstream и синхронизирует переводы с определенными ветками.
- **Crowdin**: управляет процессами перевода, включая перевод, корректуру и настройку языковых предпочтений.
- **Системы ИИ**: использует расширенный ИИ для помощи переводчикам, обеспечивая плавный рабочий процесс.
- **Настраиваемый глоссарий**: направляет переводчиков и гарантирует, что ИИ генерирует точные переводы на основе контекста проекта. Пользователи также могут загружать свои глоссарии по мере необходимости.

:::info
Это руководство не будет подробно рассматривать весь процесс, но в нем будут выделены ключевые компоненты, которые делают программу локализации TownSquare Labs уникальной. Вы можете изучить программу более подробно самостоятельно.
:::

## Синхронизация GitHub для документации и переводов

Наш репозиторий использует несколько ветвей для управления документацией и переводами. Ниже приведено подробное объяснение цели и функции каждой специальной ветви:

### Обзор ветвей

- **`dev`**\
  Ветка `dev` запускает GitHub Actions для обработки задач синхронизации. Конфигурации рабочих процессов можно найти в каталоге [**`.github/workflows`**](https://github.com/TownSquareXYZ/ton-docs/tree/dev/.github/workflows):

  - **`sync-fork.yml`**: этот рабочий процесс синхронизирует документацию из вышестоящего репозитория. Он запускается ежедневно в 00:00.
  - **`sync-translations.yml`**: этот рабочий процесс синхронизирует обновленные переводы с соответствующими языковыми ветвями для предварительного просмотра на соответствующих языковых веб-сайтах.

- **`main`**\
  Эта ветвь синхронизируется с вышестоящим репозиторием с помощью действий GitHub, запущенных в ветке `dev`. Также используется для обновления определённых кодов, которые мы хотим предложить оригинальному репозиторию.

- **`l10n_main`**\
  Эта ветвь включает все изменения из ветви `main` и переводы из Crowdin. Все изменения в этой ветке периодически фиксируются в вышестоящем репозитории с помощью новой подветки с именем `l10n_main_[some data]`.

- **`l10n_feat` или `l10n_feat_[specific functions]`**\
  Эта ветка будет включать изменения в коде или документации, связанной с системой перевода. После завершения всего контента изменения в этой ветке будут объединены в `l10_main`.

- **`[lang]_preview`**\
  Эти ветки предназначены для определенных языковых предварительных просмотров, таких как `ko_preview` для корейского и `ja_preview` для японского. Они позволяют нам предварительно просматривать веб-сайт на разных языках.

Поддерживая эти ветки и используя GitHub Actions, мы эффективно управляем синхронизацией нашей документации и обновлений переводов, гарантируя, что наш многоязычный контент всегда будет актуальным.

## Как создать новый проект Crowdin

1. Войдите в свою учетную запись [**Crowdin**](https://accounts.crowdin.com/login).

2. Нажмите `Создать проект` в меню.
   ![Create new project](/img/localizationProgramGuideline/howItWorked/create-new-project.png)

3. Укажите название проекта и целевые языки. Вы можете изменить языки в настройках позже.
   ![Create project setting](/img/localizationProgramGuideline/howItWorked/create-project-setting.png)

4. Перейдите к только что созданному проекту, выберите вкладку "Интеграции", нажмите кнопку `Добавить интеграцию`, найдите GitHub и установите его.
   ![install-github-integration](/img/localizationProgramGuideline/howItWorked/install-github-integration.png)

5. Перед настройкой интеграций GitHub на Crowdin укажите, какие файлы следует загрузить на Crowdin, чтобы избежать загрузки ненужных файлов:

   1. Создайте файл **crowdin.yml** в корне **репозитория GitHub** с базовой конфигурацией:

   ```yml
   project_id: <Your project id>
   preserve_hierarchy: 1
   files:
     - source: <Path of your original files>
       translation: <Path of your translated files>
   ```

   2. Введите правильные значения конфигурации:
      - **project_id**: В проекте Crowdin перейдите на вкладку "Инструменты", выберите API и найдите там **project_id**.
        ![select-api-tool](/img/localizationProgramGuideline/howItWorked/select-api-tool.png)
        ![projectId](/img/localizationProgramGuideline/howItWorked/projectId.png)
      - **preserve_hierarchy**: Поддерживает структуру каталогов GitHub на сервере Crowdin.
      - **source** и **translation**: Укажите пути для файлов, которые нужно загрузить в Crowdin, и место, где должны быть переведенные файлы.

        Обратитесь к [**нашему официальному конфигурационному файлу**](https://github.com/TownSquareXYZ/ton-docs/blob/localization/crowdin.yml) для примера.\
        Более подробную информацию можно найти в [**документации по конфигурации Crowdin**](https://developer.crowdin.com/configuration-file/).

6. Настройте Crowdin для подключения к вашему репозиторию на GitHub:
   1. Нажмите `Добавить репозиторий` и выберите режим `Исходные файлы и файлы перевода`.
      ![select-integration-mode](/img/localizationProgramGuideline/howItWorked/select-integration-mode.png)
   2. Подключите свою учетную запись GitHub и найдите репозиторий, который нужно перевести.
      ![search-repo](/img/localizationProgramGuideline/howItWorked/search-repo.png)
   3. Выберите ветку слева, которая создаст новую ветку, в которой Crowding будет публиковать переводы.
      ![setting-branch](/img/localizationProgramGuideline/howItWorked/setting-branch.png)
   4. Выберите частоту обновления переводов в вашей ветке GitHub. Настройки по умолчанию можно сохранить для других конфигураций, затем нажмите "Сохранить", чтобы включить интеграцию.
      ![frequency-save](/img/localizationProgramGuideline/howItWorked/frequency-save.png)

Дополнительные сведения см. в [**документации по интеграции GitHub**](https://support.crowdin.com/github-integration/).

7. Наконец, вы можете нажать кнопку "Синхронизировать сейчас", чтобы синхронизировать репозиторий и переводы при необходимости.

## Глоссарий

### Что такое глоссарий?

Иногда переводчики ИИ не могут распознать определенные термины, которые не следует переводить. Например, мы не хотим, чтобы «Rust» переводился применительно к языку программирования. Чтобы предотвратить такие ошибки, мы используем глоссарий для руководства переводами.

**Глоссарий** позволяет создавать, хранить и управлять терминологией, относящейся к конкретному проекту, в одном месте, обеспечивая правильный и последовательный перевод терминов.

Вы можете проверить наш [**ton-i18n-glossary**](https://github.com/TownSquareXYZ/ton-i18n-glossary) для справки.
![ton-i18n-glossary](/img/localizationProgramGuideline/howItWorked/ton-i18n-glossary.png)

### Как настроить глоссарий для нового языка?

Большинство платформ перевода поддерживают глоссарии. В Crowdin после настройки глоссария каждый термин отображается как подчеркнутое слово в редакторе. Наведите курсор на термин, чтобы увидеть его перевод, часть речи и определение (если указано).
![github-glossary](/img/localizationProgramGuideline/howItWorked/github-glossary.png)
![crowdin-glossary](/img/localizationProgramGuideline/howItWorked/crowdin-glossary.png)

В DeepL просто загрузите свой глоссарий, и он будет автоматически использоваться во время перевода ИИ.

Мы создали [**программу для глоссария**](https://github.com/TownSquareXYZ/ton-i18n-glossary), которая автоматически загружает обновления.

Чтобы добавить термин в глоссарий:

1. Если английский термин уже есть в глоссарии, найдите соответствующую строку и столбец для языка, который вы хотите перевести, введите перевод и загрузите его.
2. Чтобы загрузить новый глоссарий, клонируйте проект и запустите:

   - `npm i`
   - `npm run generate -- <glossary name you want>`

Повторите шаг 1, чтобы добавить новый термин.

**Просто и эффективно, не так ли?**

## Как воспользоваться преимуществами AI Translation Copilot?

AI Translation Copilot помогает сломать языковые барьеры, имея несколько преимуществ:

- **Повышенная согласованность**: переводы AI основаны на актуальной информации, предоставляя самые точные и актуальные переводы.
- **Скорость и эффективность**: перевод AI выполняется мгновенно, обрабатывая большие объемы контента в режиме реального времени.
- **Надежная масштабируемость**: системы AI постоянно обучаются и совершенствуются, повышая качество перевода с течением времени. С помощью предоставленного глоссария переводы AI можно адаптировать к конкретным потребностям различных репозиториев.

Чтобы использовать AI перевод в Crowdin (мы используем DeepL в нашем проекте):

1. Выберите «Машинный перевод» в меню Crowdin и нажмите "Изменить" в строке DeepL.
   ![select-deepl](/img/localizationProgramGuideline/howItWorked/select-deepl.png)
2. Включите поддержку DeepL и введите ключ API переводчика DeepL.
   > [Как получить ключ API переводчика DeepL](https://www.deepl.com/pro-api?cta=header-pro-api)

![config-crowdin-deepl](/img/localizationProgramGuideline/howItWorked/config-crowdin-deepl.png)

3. В нашей настройке DeepL используется настраиваемый глоссарий. Проверьте [**ton-i18n-glossary**](https://github.com/TownSquareXYZ/ton-i18n-glossary) для получения подробной информации о загрузке глоссария.

4. В репозитории нажмите "Предварительный перевод" и выберите "Машинный перевод".
   ![pre-translation](/img/localizationProgramGuideline/howItWorked/pre-translation.png)

5. Выберите DeepL в качестве движка перевода, выберите целевые языки и выберите файлы для перевода.
   ![pre-translate-config](/img/localizationProgramGuideline/howItWorked/pre-translate-config.png)

Вот и все! Теперь вы можете сделать перерыв и дождаться завершения предварительного перевода.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/localization-program/how-to-contribute.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/localization-program/how-to-contribute.md
================================================
# Как сделать вклад

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::info
На этой странице объясняется, как принять участие в программе локализации документации TON.
:::

## Предварительные условия

Программа локализации **TownSquare Labs** открыта для всех! Вот несколько шагов, которые вам необходимо выполнить, прежде чем вы начнете вносить свой вклад:

1. Войдите в свою учетную запись [**Crowdin**](https://crowdin.com) или зарегистрируйтесь.
2. Выберите язык, на котором вы хотите внести свой вклад.
3. Ознакомьтесь с руководством [**Как использовать Crowdin**](/v3/contribute/localization-program/how-to-contribute) и руководством по [**Стилю перевода**](/v3/contribute/localization-program/translation-style-guide) для получения советов и рекомендаций.
4. Используйте машинные переводы для помощи в своей работе, но не полагайтесь исключительно на них.
5. Все результаты перевода можно предварительно просмотреть на веб-сайте через час после исправлений.

## Роли

Вот **роли**, которые вы можете взять на себя в системе:

- **Language Coordinator** - Управляет функциями проекта в рамках назначенных языков.
- **Developer** - Загружает файлы, редактирует переводимый текст, подключает интеграции и использует API.
- **Proofreader** - Переводит и утверждает строки.
- **Translator** (собственный или сообщества) - переводит строки и голосует за переводы,.

Наш проект локализации размещен на [Crowdin](https://crowdin.com/project/ton-docs).

:::info
Before you start contributing, **read the guidelines below** to ensure standardization and quality, making the review process much faster.

## Режим "Бок о бок"

Все задачи выполняются в режиме **бок о бок** в редакторе Crowdin. Чтобы включить его, щелкните файл, над которым вы хотите работать. В правом верхнем углу страницы щелкните кнопку **Вид редактора** и выберите режим **бок о бок"** для более удобного просмотра в редакторе.
![Режим "бок о бок"](/img/localizationProgramGuideline/side-by-side.png)
:::

### Language Coordinator

- **Переводите и утверждайте строки**
- **Предварительно переводите содержимое проекта**
- **Управляйте участниками проекта и запросами на присоединение**
  ![manage-members](/img/localizationProgramGuideline/manage-members.png)
- **Создавайте отчеты по проекту**
  ![generate-reports](/img/localizationProgramGuideline/generate-reports.png)
- **Создавайте задачи**
  ![create-tasks](/img/localizationProgramGuideline/create-tasks.png)

### Developer

- **Обновление конфигурации нижнего колонтитула для вашего языка:**
  1. Создайте ответвление нашего [**репозитория**](https://github.com/TownSquareXYZ/ton-docs/tree/i18n_feat).
  2. Перейдите к файлу [**`src/theme/Footer/config.ts`**] (https://github.com/TownSquareXYZ/ton-docs/blob/main/src/theme/Footer/config.ts).
  3. Скопируйте значение переменной **`FOOTER_COLUMN_LINKS_EN`** в **`FOOTER_COLUMN_LINKS_[YOUR_LANG]`**.
  4. Переведите значения ключей **`headerLangKey`** и **`langKey`** на ваш язык, как мы это сделали для мандаринского в **`FOOTER_COLUMN_LINKS_CN`**.
  5. Добавьте новое свойство в **`FOOTER_LINKS_TRANSLATIONS`**:
     - Установите **ключ** как ваш [**код языка ISO**](https://www.andiamo.co.uk/resources/iso-language-codes/) (**две буквы**, **нижний регистр**).
     - **Значение** должно быть новой переменной, которую вы только что создали для вашего языка.
  6. Выполните команду **`yarn start:local [YOUR_IOS_LANG_CODE]`**, чтобы просмотреть новый нижний колонтитул на вашем языке.\
     (например, **`yarn start:local ru`** для предварительного просмотра на **русском** языке)
  7. Если все выглядит хорошо, создайте pull request в ветку **`i18n_feat`**.
- **Загрузите файлы**
- **Отредактируйте переводимый текст**
- **Подключите интеграции** (например, добавьте интеграцию с GitHub)
  ![install-github-integration](/img/localizationProgramGuideline/howItWorked/install-github-integration.png)
- **Используйте [Crowdin API](https://developer.crowdin.com/api/v2/)**

### Proofreader

Как **Proofreader**, вы будете работать с файлами с **синим индикатором выполнения**.
![proofread step1](/img/localizationProgramGuideline/proofread-step1.png)
Щелкните на файле, чтобы войти в интерфейс редактирования.

#### Давайте начнем вносить свой вклад

1. Убедитесь, что вы работаете в [**режиме бок о бок**](#side-by-side-mode). Отфильтруйте **неутвержденные** переводы, чтобы увидеть строки, требующие проверки..
   ![proofread](/img/localizationProgramGuideline/proofread-filter.png)

2. Соблюдайте следующие правила:
   - Выберите строки с **синим прямоугольным значком**. Проверьте каждый перевод:
     - Если **правильный**, нажмите кнопку ☑️.
     - Если **неправильный**, перейдите к следующей строке.

![proofread approved](/img/localizationProgramGuideline/proofread-approved.png)

:::info
You can also review approved lines:

1. Фильтр по **утвержденным**.

2. Если в утвержденной строке есть проблемы, нажмите кнопку ☑️, чтобы вернуть ее к требующей проверки.
   :::

3. Чтобы перейти к следующему файлу, щелкните имя файла вверху, выберите новый файл во всплывающем окне и продолжите проверку.
   ![to next](/img/localizationProgramGuideline/redirect-to-next.png)

#### Предварительный просмотр вашей работы

Все одобренные материалы будут размещены на веб-сайте предварительного просмотра в течение одного часа. Ознакомьтесь с [**нашим репозиторием**](https://github.com/TownSquareXYZ/ton-docs/pulls) на наличие ссылки предварительного просмотра в последнем PR.
![preview link](/img/localizationProgramGuideline/preview-link.png)

### Translator

Ваша цель как **Translator** — обеспечить точность и выразительность переводов, максимально приблизив их к исходному значению и сделав максимально понятными. Ваша миссия — довести **синюю полосу выполнения** до 100%.

#### Давайте начнем перевод

Для успешного процесса перевода выполните следующие шаги:

1. Выберите файлы, которые не достигли 100% перевода.
   ![translator select](/img/localizationProgramGuideline/translator-select.png)

2. Убедитесь, что вы находитесь в [**режиме бок о бок**](#side-by-side-mode). Фильтр по **непереведенным** строкам.
   ![translator filter](/img/localizationProgramGuideline/translator-filter.png)

3. Ваше рабочее пространство состоит из четырех частей:
   - **Сверху слева:** введите свой перевод на основе исходной строки.
   - **Снизу слева:** предварительный просмотр переведенного файла. Сохраните исходный формат.
   - **Снизу справа:** предлагаемые переводы от Crowdin. Нажмите, чтобы использовать, но проверьте точность, особенно со ссылками.

4. Сохраните свой перевод, нажав кнопку **Сохранить** вверху.
   ![translator save](/img/localizationProgramGuideline/translator-save.png)

5. Чтобы перейти к следующему файлу, щелкните имя файла вверху и выберите новый файл во всплывающем окне.
   ![to next](/img/localizationProgramGuideline/redirect-to-next.png)

## Как добавить поддержку нового языка

В настоящее время в Crowdin есть все нужные языки. Если вы являетесь менеджером сообщества, выполните следующие действия:

1. Добавьте новую ветку с именем `[lang]_localization` (например, `ko_localization` для корейского языка) в [TownSquareXYZ/ton-docs](https://github.com/TownSquareXYZ/ton-docs).
2. **Свяжитесь с владельцем этого репозитория Vercel**, чтобы добавить новый язык в меню.
3. Создайте PR-запрос в ветку dev. **Не объединяйте с dev**; это нужно только для целей предварительного просмотра.

После завершения этих действий вы сможете увидеть предварительный просмотр своего языка в запросе на PR.
![ko preview](/img/localizationProgramGuideline/ko_preview.png)

Когда ваш язык будет готов для документации TON, создайте issue, и мы добавим ваш язык в производственную среду.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/localization-program/overview.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/localization-program/overview.md
================================================
# Программа локализации

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Локализация – это совместный проект по переводу связанных с TON документов на другие, отличные от английского, языки. Его реализация позволит сделать сайт доступным для миллиардов людей по всему миру

## Как устроен проект локализации

![Принцип работы](/img/localizationProgramGuideline/localization-program.png)

Проект локализации **разработан** и **активно развивается** компанией [**TownSquare Labs**](https://github.com/TownSquareXYZ), одним из ключевых партнеров **TON**.

Цель проекта локализации – создать открытую и понятную инфраструктуру для взаимодействия внутри многоязычного сообщества **TON**. Ее ключевыми свойствами являются:

- **Доступность для многоязычных сообществ**\
  Программа для локализации поддерживает несколько языков, что обеспечивает вовлеченность и простоту доступа для пользователей из разных стран

- **Автоматизация разработки, интеграции и деплоя**\
  С помощью инструментов автоматизации программа упрощает разработку, интеграцию и развертывание, сокращая ручные усилия и повышая эффективность и согласованность всех задач, связанных с локализацией

- **Удобная ролевая модель**\
  В проекте реализованы роли для разработчиков, переводчиков и верификаторов. Это позволяет каждому сосредоточиться на своих задачах, а также обеспечить высокое качество переводов и отсутствие конфликтных ситуаций

- **Система поощрений**\
  Мы предлагаем бонусы для членов сообщества, которые вносят весомый вклад в работу над локализацией. Мы уверены, что это способствует вовлеченности, поощряет активных участников, а также усиливает чувство причастности к международному проекту **TON**

- **Усовершенствованная интеграция AI для переводов**\
  Встроенные системы искусственного интеллекта повышают точность и эффективность работы с текстом – предлагая подсказки, автоматизируя повторяющиеся задачи, тем самым обеспечивая высокое качество переводов при минимальных усилиях

Проект локализации позволяет обеспечить удобный процесс работы над переводами, тем самым оказывая поддержку глобальному сообществу разработчиков **TON**

## Сообщество

Команда проекта благодарна за вклад каждого из тысяч участников сообщества. Мы хотим отметить результаты наших разработчиков, переводчиков, верификаторов и поддержать в их карьерном пути. В ближайшее время мы отметим самых активных участников, создав таблицы лидеров, а также список всех участников проекта локализации

## Полезные ссылки

Полезные ресурсы, которые помогут сделать первые шаги в рамках проекта локализации:

- [**Руководство по стилистике перевода**](/contribute/localization-program/translation-style-guide) - Инструкции и советы для переводчиков
- [**Как работать в Crowdin**](https://support.crowdin.com/online-editor/) - Подробное руководство по взаимодействию с онлайн-редактором Crowdin, который используется в проекте



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/localization-program/translation-style-guide.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/localization-program/translation-style-guide.md
================================================
# Руководство по стилю перевода

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Это руководство по стилю перевода содержит некоторые из самых важных рекомендаций, инструкций и советов для переводчиков, помогающих нам локализовать веб-сайт.

Этот документ служит общим руководством и не относится к какому-либо одному языку.

## Передача сути сообщения

При переводе содержимого документов TON избегайте дословных переводов.

Важно, чтобы переводы передавали суть сообщения. Это может означать перефразирование определенных фраз или использование описательных переводов вместо дословного перевода содержимого.

В разных языках существуют разные грамматические правила, условные обозначения и порядок слов. При переводе, пожалуйста, помните о том, как структурированы предложения в целевых языках, и избегайте дословного перевода английского оригинала, так как это может привести к плохой структуре предложения и читабельности.

Вместо того чтобы переводить исходный текст слово в слово, рекомендуется прочитать все предложение целиком и адаптировать его в соответствии с нормами языка перевода.

## Официальное и неформальное обращение

Мы используем официальную форму обращения, которая всегда вежлива и подходит всем посетителям.

Использование официального обращения позволяет нам избежать того, чтобы оно звучало неофициально или оскорбительно, и работает независимо от возраста и пола посетителя.

В большинстве индоевропейских и афроазиатских языков используются личные местоимения второго лица, относящиеся к определенному полу, которые различают мужской и женский пол. При обращении к пользователю или использовании притяжательных местоимений мы можем избегать предположений о поле посетителя, поскольку официальная форма обращения, как правило, применима и последовательна, независимо от того, как он себя идентифицирует.

## Простая и понятная лексика и значение

Наша цель — сделать контент на сайте понятным как можно большему количеству людей.

В большинстве случаев этого можно легко достичь, используя короткие и простые слова, которые легко понять. Если существует несколько возможных переводов определенного слова на вашем языке с одинаковым значением, лучшим вариантом чаще всего является самое короткое слово, которое четко отражает значение.

## Система письма

Весь контент должен быть переведен с использованием правильной системы письма для вашего языка и не должен включать слова, написанные с использованием латинских символов.

При переводе контента вы должны убедиться, что переводы являются единообразными и не включают латинские символы.

**Вышеизложенное не относится к языкам, где имена собственные, как правило, не переводятся.**

## Перевод метаданных страницы

Некоторые страницы содержат метаданные, такие как «title», «lang», «description», «sidebar» и т. д.

Мы скрываем содержимое, которое переводчики никогда не должны переводить, при загрузке новых страниц в Crowdin, что означает, что все метаданные, видимые переводчикам в Crowdin, должны быть переведены.

Пожалуйста, будьте особенно внимательны при переводе любых строк, где в исходном тексте стоит "en". Это означает язык, на котором доступна страница, и его следует перевести в [языковой код ISO для вашего языка](https://www.andiamo.co.uk/resources/iso-language-codes/). Эти строки всегда следует переводить с использованием латинских символов, а не алфавита, который является родным для языка перевода.

Если вы не уверены, какой код языка использовать, вы можете проверить память переводов в Crowdin или найти код языка для вашего языка в URL-адресе страницы в онлайн-редакторе Crowdin.

Несколько примеров языковых кодов для наиболее распространенных языков:

- Английский - en
- Китайский упрощенный - zh-CN
- Русский - ru
- Корейский - ko
- Польский - pl
- Украинский - uk

## Заголовки внешних статей

Некоторые строки содержат заголовки внешних статей. Большинство наших страниц документации для разработчиков содержат ссылки на внешние статьи для дальнейшего чтения. Строки, содержащие заголовки статей, необходимо перевести, независимо от языка статьи, чтобы обеспечить более единообразный пользовательский интерфейс для посетителей, просматривающих страницу на своем языке.

## Предупреждения Crowdin

Crowdin имеет встроенную функцию, которая предупреждает переводчиков, когда они собираются совершить ошибку. Crowdin автоматически предупредит вас об этом перед сохранением вашего перевода, если вы забудете включить тег из источника, переведете элементы, которые не следует переводить, добавите несколько последовательных пробелов, забудете конечную пунктуацию и т. д. Если вы видите такое предупреждение, вернитесь и дважды проверьте предложенный перевод.

:::warning
Никогда не игнорируйте эти предупреждения, поскольку они обычно означают, что что-то не так или что в переводе отсутствует ключевая часть исходного текста.
:::

## Сокращенный вариант по сравнению с полными формами/аббревиатурами

На сайте используется много аббревиатур, например, dapps, NFT, DAO, DeFi и т. д. Эти аббревиатуры обычно используются в английском языке, и большинство посетителей сайта с ними знакомы.

Поскольку они обычно не имеют устоявшихся переводов на другие языки, лучший способ подойти к этим и похожим терминам — предоставить описательный перевод полной формы и добавить английскую аббревиатуру в скобках.

Не переводите эти аббревиатуры, поскольку большинство людей с ними не знакомы, а локализованные версии не будут иметь особого смысла для большинства посетителей.

Пример того, как перевести dapps:

- Децентрализованные приложения (dapps) → Переведенная полная форма (английская аббревиатура в скобках)

## Термины без устоявшихся переводов

Некоторые термины могут не иметь устоявшихся переводов на другие языки и широко известны по оригинальному английскому термину. Такие термины в основном включают в себя новые концепции, такие как proof-of-work, proof-of-stake, Beacon Chain, staking и т. д.

Хотя перевод этих терминов может показаться неестественным, поскольку английская версия широко используется и в других языках, настоятельно рекомендуется их переводить.

При их переводе не стесняйтесь проявлять креативность, используйте описательные переводы или просто переводите их дословно.

Причина, по которой большинство терминов следует переводить, а не оставлять некоторые на английском, заключается в том, что эта новая терминология станет более распространенной в будущем, поскольку все больше людей начнут использовать TON и связанные с ним технологии. Если мы хотим привлечь в это пространство больше людей со всего мира, нам нужно предоставить понятную терминологию на как можно большем количестве языков, даже если нам придется создавать ее самим.

## Кнопки и призывы к действию (CTA)

На сайте есть множество кнопок, которые следует переводить иначе, чем остальной контент.

Текст кнопки можно определить, просмотрев скриншоты контекста, связанные с большинством строк, или проверив контекст в редакторе, который включает фразу ‘’button’’.

Переводы для кнопок должны быть как можно более короткими, чтобы избежать несоответствий в форматировании. Кроме того, перевод кнопок должен быть императивным, т.е. содержать команду или запрос.

## Перевод для всех

Посетители TON docs приходят со всего мира и из разных слоев общества. Поэтому язык на сайте должен быть нейтральным, дружелюбным ко всем и не исключающим.

Важной частью этого является гендерная нейтральность. Это легко можно достичь, используя формальный стиль обращения и избегая использования гендерных слов в переводе.

Другой способ вовлечения — это попытка переводить для глобальной аудитории, не ограниченной конкретным странам, этническими группами или регионами.

Наконец, язык должен подходить для всех аудиторий и возрастов.

## Переводы на разные языки

При переводе важно соблюдать правила грамматики, условные обозначения и форматирование, используемые в вашем языке, а не копировать из источника. Исходный текст соответствует правилам грамматики английского языка, которые неприменимы ко многим другим языкам.

Вы должны знать правила вашего языка и переводить соответствующим образом. Если вам нужна помощь, обратитесь к нам, и мы поможем вам найти некоторые ресурсы о том, как эти элементы следует использовать в вашем языке.

Некоторые примеры того, на что следует обратить особое внимание:

### Пунктуация, форматирование

#### Заглавные буквы

- Существуют огромные различия в написании заглавных букв в разных языках.
- В английском языке принято писать все слова с заглавной буквы в названиях и именах, месяцах и днях, названиях языков, праздниках и т. д. Во многих других языках это грамматически неправильно, так как у них разные правила написания заглавных букв.
- В некоторых языках также есть правила написания с заглавной буквы личных местоимений, существительных и некоторых прилагательных, которые в английском языке не пишутся с заглавной буквы.

#### Интервалы

- Правила орфографии определяют использование пробелов для каждого языка. Поскольку пробелы используются везде, эти правила являются одними из самых четких, а пробелы являются одними из самых неправильно переводимых элементов.
- Некоторые общие различия в интервалах между английским и другими языками:
  - Пробел перед единицами измерения и валютами (например, USD, EUR, kB, MB)
  - Пробел перед знаками градуса (например, °C, ℉)
  - Пробел перед некоторыми знаками препинания, особенно многоточием (…)
  - Пробел перед и после косых черт (/)

#### Списки

- В каждом языке существует разнообразный и сложный набор правил написания списков. Они могут значительно отличаться от английского.
- В некоторых языках первое слово каждой новой строки должно быть написано с заглавной буквы, в то время как в других новые строки должны начинаться со строчных букв. Во многих языках также существуют разные правила использования заглавных букв в списках в зависимости от длины каждой строки.
- То же самое относится к пунктуации элементов строк. Конечным знаком препинания в списках может быть точка (.), запятая (,) или точка с запятой (;) в зависимости от языка.

#### Кавычки

- В разных языках используется много разных кавычек. Простое копирование английских кавычек из источника часто неправильно.
- Некоторые из наиболее распространенных типов кавычек:
  - „Пример текста“
  - ‚Пример текста’
  - »Пример текста«
  - “Пример текста”
  - ‘Пример текста’
  - «Пример текста»

#### Дефисы и тире

- В английском языке дефис (-) используется для соединения слов или разных частей слова, а тире (–) используется для обозначения диапазона или паузы.
- Во многих языках существуют разные правила использования дефисов и тире, которые следует соблюдать.

### Форматы

#### Числа

- Основное различие в написании чисел на разных языках заключается в разделителе, используемом для десятичных дробей и тысяч. Для тысяч это может быть точка, запятая или пробел. Аналогично, некоторые языки используют десятичную точку, а другие — десятичную запятую.
  - Некоторые примеры больших чисел:
    - Английский язык - **1,000.50**
    - Испанский - **1.000,50**
    - Французский - **1 000,50**
- Еще одним важным моментом при переводе чисел является знак процента. Его можно записать по-разному: **100%**, **100 %** или **%100**.
- Наконец, отрицательные числа могут отображаться по-разному в зависимости от языка: -100, 100-, (100) или [100].

#### Даты

- При переводе дат в зависимости от языка существует ряд особенностей и отличий. К ним относятся формат даты, разделители, заглавные буквы и начальные нули. Также существуют различия между полными и числовыми датами.
  - Некоторые примеры различных форматов дат:
    - Английский (Великобритания) (dd/mm/yyyy) – 1st January, 2022
    - Английский (США) (mm/dd/yyyy) – January 1st, 2022
    - Китайский (yyyy-mm-dd) – 2022 年 1 月 1 日
    - Французский (dd/mm/yyyy) – 1er janvier 2022
    - Итальянский (dd/mm/yyyy) – 1º gennaio 2022
    - Немецкий язык (dd/mm/yyyy) – 1. Januar 2022

#### Валюты

- Перевод валют может быть затруднен из-за различий в форматах, условных обозначениях и способах конвертации. Как правило, пожалуйста, указывайте валюты, указанные в источнике. Для удобства читателя вы можете указать свою местную валюту и способ конвертации в скобках.
- Основные различия в написании валют на разных языках включают размещение символов, десятичные запятые и десятичные точки, интервалы и сокращения и символы.
  - Размещение символов: $100 или 100$
  - Десятичные запятые и десятичные точки: 100,50$ или 100.50$
  - Интервалы: 100$ или 100 $
  - Сокращения и символы: 100 $ или 100 USD

#### Единицы измерения

- Как правило, сохраняйте единицы измерения, указанные в источнике. Если в вашей стране используется другая система, вы можете включить преобразование в скобки.
- Помимо локализации единиц измерения, важно также отметить различия в подходе к этим единицам в разных языках. Основное различие заключается в интервале между числом и единицей измерения, который может отличаться в зависимости от языка. Например, 100kB вместо 100 kB или 50°F вместо 50 ° F.

## Заключение

При переводе старайтесь не торопиться. Не торопитесь и получайте удовольствие!

Благодарим вас за участие в программе перевода и за то, что помогли нам сделать веб-сайт доступным для более широкой аудитории. Сообщество TON является глобальным, и мы рады, что вы являетесь его частью!



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/maintainers.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/maintainers.md
================================================
# Сопровождающие

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Основная команда

Ниже представлен алфавитный список текущих членов команды документации TON.

### Алекс Голев

Руководитель отдела по адаптации в TON Studio

- Telegram: [@alexgton](https://t.me/alexgton)
- GitHub: [Reveloper](https://github.com/Reveloper)

## Благодарности

Документация TON была создана [tolya-yanot](https://github.com/tolya-yanot) и [EmelyanenkoK](https://github.com/EmelyanenkoK).

Со временем документация TON обогатилась интеллектом и преданностью [многочисленных внешних участников](https://github.com/ton-community/ton-docs/graphs/contributors). Мы выражаем нашу искреннюю благодарность каждому из них.

Тем не менее, мы хотели бы особо отметить значительный вклад, внесенный следующими лицами. Их вклад значительно повысил качество и глубину нашей документации:

- [akifoq](https://github.com/akifoq): раннее участие
- [amnch1](https://github.com/amnch1): исправления
- [aSpite](https://github.com/aSpite): содержание
- [awesome-doge](https://github.com/awesome-doge): раннее участие
- [coalus](https://github.com/coalus): содержание
- [delovoyhomie](https://github.com/delovoyhomie): содержание
- [Gusarich](https://github.com/Gusarich): содержание
- [krau5](https://github.com/krau5): улучшения
- [LevZed](https://github.com/LevZed): содержание
- [ProgramCrafter](https://github.com/ProgramCrafter): содержание
- [siandreev](https://github.com/siandreev): содержание
- [SpyCheese](https://github.com/SpyCheese): раннее участие
- [SwiftAdviser](https://github.com/SwiftAdviser): контент, удобный конструктор документов
- [Tal Kol](https://github.com/talkol): раннее участие
- [TrueCarry](https://github.com/TrueCarry): содержание
- [xssnick](https://github.com/xssnick): содержание

Мы искренне ценим каждого участника, который помог превратить документацию TON в богатый и надежный ресурс.

## См. также

- [Как внести свой вклад](/v3/contribute/)
- [Стандартизация контента](/v3/contribute/content-standardization/)
- [Типографика](/v3/contribute/typography/)
- [Программа локализации](/v3/contribute/localization-program/overview/)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/participate.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/participate.md
================================================
# Руководство по внесению вклада

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::danger
Эта страница устарела и скоро будет удалена.
См. [Как внести вклад](/v3/contribute/).
:::

Вот пошаговое руководство по внесению вклада в документацию TON с помощью учебных материалов.

:::tip возможности
Это хорошая возможность улучшить экосистему TON здесь.
:::

Если вы решите написать учебный материал, вы можете получить награду за выдающиеся работы:

- **Special TON Bounty NFT** за самый ценный вклад в TON
- **Премия в TON** в качестве оплаты за одобренный высококачественный вклад, такой как учебный материал

Давайте посмотрим, как вы можете участвовать в процессе внесения вклада.

## Решите, что вы хотите написать

Найдите или напишите материал, который вы хотите описать.

1. Проверьте [список issues на GitHub TON Docs](https://github.com/ton-community/ton-docs/issues) с меткой 'tutorial'.
2. *Или* предложите свою идею на GitHub TON Docs с помощью шаблона руководства.

## Опишите проблему, чтобы получить вознаграждение

Напишите заявку в *ton-footstep*, чтобы получить финансирование за свой вклад.

1. Подробнее о программе [TON Bounties](https://github.com/ton-society/grants-and-bounties/blob/main/bounties/BOUNTIES_PROGRAM_GUIDELINES.md).
    1. **Кратко**: используйте статью [Improve TVM Instructions](https://github.com/ton-society/grants-and-bounties/issues/361) в качестве примера.
2. Напишите [заявку на награду](https://github.com/ton-society/grants-and-bounties/issues/new/choose) за участие и ждите одобрения. [TON Bounties Creator Bot](https://t.me/footsteps_helper_bot) поможет вам.
3. После получения метки `approved` начните писать свое руководство.

## Написание руководства

**Подготовка**. Минимизируйте количество запрашиваемых изменений в будущем, *сэкономьте свое время*:

1. Следуйте [руководству по написанию инструкций](/v3/contribute/contribution-rules) и сверьте его с [образцом структуры инструкции](/v3/contribute/tutorials/sample-tutorial)
2. Прочитайте [принципы хорошего руководства](/v3/contribute/tutorials/principles-of-a-good-tutorial), чтобы написать потрясающее руководство :)
3. Вдохновитесь примером как [Создать свой первый жетон](/v3/guidelines/dapps/tutorials/mint-your-first-token).
4. **Настройте среду**. [Проверьте руководство](/v3/contribute#online-one-click-contribution-setup), запустив свой fork локально или с помощью Gitpod.
5. **Напишите руководство**. Используя среду, посмотрите, как руководство выглядит на вашем fork.
6. **Сделайте запрос Pull Request**. Откройте PR, чтобы получить обратную связь от участников команды.
7. Дождитесь слияния!

## Получение вознаграждения

1. После того, как ваш PR в TON Docs был объединен, пожалуйста, напишите это в своей задаче ton-footsteps.
2. Следуйте [руководству по завершению задания](https://github.com/ton-society/grants-and-bounties/blob/main/bounties/BOUNTIES_PROGRAM_GUIDELINES.md#got-assigned-submit-a-questbook-proposal), чтобы завершить работу и получить вознаграждение.
3. В вашей задаче вас попросят указать кошелек для отправки вознаграждения.
4. Получите вознаграждение!



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/style-guide.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/style-guide.mdx
================================================
# Руководство по стилю документации

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Введение

Это руководство призвано помочь вам определить вашу аудиторию, которая повлияет на стиль и размещение вашего контента.

## Аудитория

Документация TON (**docs.ton.org**) — это ресурс, разработанный для трех основных аудиторий.

[**Концепции**](/v3/concepts/dive-into-ton/introduction/) для **отдельных лиц:**
Независимо от того, являются ли читатели новыми пользователями приложений, инвесторами или энтузиастами блокчейна, они найдут ответы на свои вопросы о надежности TON, возможностях кошелька, вовлеченности сообщества и технической дорожной карте. Концепции упрощают сложные абстракции, чтобы читатели могли уверенно вникать в суть.

[**Рекомендации**](/v3/guidelines/get-started-with-ton/) для **внешних разработчиков:**
Читатели могут узнать, как запускать узлы, быстро создавать примеры проектов и интегрировать свои проекты с TON — все это представлено в виде простых пошаговых инструкций. Для разработчиков, которые практически не имеют опыта работы с блокчейном, этот материал представляет собой практическое введение в технологический стек TON. 

[**Документация**](/v3/documentation/ton-documentation/) для **разработчиков TON:**
Раздел документации посвящен улучшению опыта разработчиков с помощью глубокой и подробной документации. Здесь технические эксперты могут ознакомиться с лучшими практиками и технической информацией для разработки смарт-контрактов промышленного уровня и приложений для глобального рынка. Это также руководство для тех, кто планирует улучшить программное обеспечение для блокчейна и обновить протоколы TON. 

### Концепции для отдельных лиц

  Пользователи приложений, инвесторы, энтузиасты или все, кто впервые знаком с блокчейном и TON

  **Примерные пути развития:**

- “Я хочу проверить надежность TON и, ответив на несколько основных вопросов, попробовать его использовать.”
- “Я знаю, что мне нужен кошелек TON, и я хочу узнать, как он работает.”
- “Я хочу получить представление об активности сообщества TON, чтобы решить, достаточно ли оно активно, чтобы я мог обратиться за помощью в случае необходимости.”
- “Я в восторге от TON и хочу принять участие, но не знаю, что делать дальше.”
- "Я хочу узнать о технической дорожной карте TON."

### Рекомендации для внешних разработчиков

  **Примерные пути развития для внешних разработчиков**:

- “Я разработчик, но у меня нет опыта в криптографии, и я хочу разобраться в технологическом стеке TON.”
- “Я хочу научиться управлять узлом TON/”
- “Я хочу быстро запустить пример проекта TON, чтобы понять, насколько сложно или легко создать настоящий проект на TON.”
- "Я начал работать над интеграцией своего проекта в TON и хочу выяснить, как это сделать лучше всего.”

### Документация для разработчиков TON

  **Примерные пути развития для разработчиков TON**:

- "Я хочу разработать промышленные смарт-контракты для экосистемы TON в соответствии с передовой практикой и спецификациями."
- "Я хочу участвовать в разработке программного обеспечения блокчейна TON."
- "Я хочу обновить протоколы TON, чтобы улучшить пользовательский опыт."
- "Я хочу обновить спецификацию TON, чтобы повысить удобство работы для разработчиков."

## Рекомендации по стилю

В этом разделе описываются лучшие практики для концепций, руководств и разделов документации. Концепции и руководства используют схожий подход.

### Концепции и рекомендации

Это общие проблемы контента для читателей концепций и руководств.

#### Распространенные проблемы с контентом:

- Перегруженность специфическими техническими терминами
- Несогласованность содержания на разных страницах
- Статьи трудно усваиваются из-за того, что
- Содержание слишком абстрактно и оторвано от реальности
- Слишком много текста на странице и абзаце
- Использование сложных предложений
- Слишком большое количество ссылок может привести к перегрузке читателей, в результате чего они покинут веб-сайт

Чтобы контент соответствовал своей аудитории, соблюдайте следующие правила.

#### Концепции и рекомендации, которые являются наилучшей практикой

- Сосредоточьтесь на преимуществах для пользователя, а не на объяснении технических деталей системы
- Используйте активную речь и четкие, сжатые предложения, которые легко понять
- Разбивайте длинные фрагменты текста на более мелкие разделы или абзацы
- Рассмотрите возможность использования таблиц, маркеров или нумерованных списков вместо абзацев
- Выделите жирным шрифтом ключевые фразы для удобства сканирования и беглого просмотра статьи
- Ограничьте объем статьи до 2000 слов
- Сократите количество гиперссылок примерно до 10 на 2000 слов.
- Исходите из того, что люди только начали интересоваться технологией блокчейн
- Пользователи хотят понять, как тема связана с ними и как они могут принять в ней участие, а не углубляться в теорию

### Стиль документации

Для читателей документации это список типичных проблем с содержанием.

#### Проблемы с документацией

- Несоответствия в документации
- Разные, неясные и противоречивые формулировки и терминология
- Длинные предложения, написанные страдательным залогом
- Устаревшая информация
- Предоставляется только код, без объяснений и документации

Сделайте документацию по содержанию привлекательной для аудитории, придерживаясь следующих правил.

#### Рекомендации по документированию

- Как можно скорее публикуйте обновленную документацию по изменениям.
- Предоставляйте подробные и понятные объяснения всех компонентов системы и процессов.
- Используйте диаграммы, примеры и выделенные ключевые моменты для поддержки текста.
- Структурируйте контент таким образом, чтобы сочетать подробную информацию на странице со стратегическими перекрестными ссылками, обеспечивая простоту навигации, не перегружая при этом ни одну страницу.
- Унифицируйте контент в соответствии с руководствами по вкладам.
- Используйте активную речь для составления четких, прямых предложений для сложных абстракций.
- Разбивайте длинные предложения на более короткие и простые, чтобы улучшить читаемость.

### Идеи для контента

#### Весь раздел

- Предоставьте наглядные пособия, чтобы лучше объяснить тему
- Обновите стиль и проведите корректуру

#### Концепции

- Используйте примеры или реальные сценарии применения технологии, чтобы проиллюстрировать сложные концепции или идеи
- Объясните, как идея может положительно повлиять на людей сейчас или в будущем

#### Рекомендации

- Добавьте пошаговое руководство по выполнению действий
- Включите соответствующую статистику или графики, чтобы подкрепить аргументы
- Добавьте призывы к действию

#### Документация

- Обновите или улучшите существующую документацию.
- Добавьте полную новую документацию о сущности TON: узел, оракул, смарт-контракт или TVM в целом.

### Объективность

Документация TON призвана служить надежным, нейтральным источником информации, информирующим читателей об экосистеме TON, ее технологиях и развитии. Ниже приведены примеры контента, которые не будут приняты к рассмотрению:

**Грандиозные, непроверяемые утверждения о TON или смежных технологиях.**
    \- Пример: _"Вы должны купить TON для раздачи подарков..."_

**Враждебные или конфронтационные высказывания в адрес какой-либо организации или человека**
    \- Пример: _ "Компания X плоха, потому что она централизована!"_

**Политизированная риторика**
    \- Пример: _"Эта политическая партия лучше подходит для децентрализации, потому что..."_

:::warning
Любой предлагаемый контент, который не соответствует целям платформы, будет отклонен без дополнительных объяснений. Спам и неподобающее поведение в комментариях приведут к блокировке.
:::

### Согласованность

Подробно ознакомьтесь со следующими руководствами и поддерживайте соответствие контента.

- [Стандартизация контента](/v3/contribute/content-standardization/) - Узнайте, как правильно организовывать контент, добавлять изображение, атрибут и т. д.
- [Типографика](/v3/contribute/typography/) - Изучите лучшие методы работы с обычным текстом и заголовками.

## См. также

- [Как внести свой вклад](/v3/contribute/)
- [Стандартизация контента](/v3/contribute/content-standardization/)
- [Типографика](/v3/contribute/typography/)
- [Программа локализации](/v3/contribute/localization-program/overview/)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/tutorials/guidelines.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/tutorials/guidelines.md
================================================
# Рекомендации по оформлению руководства

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::danger
Эта страница устарела и скоро будет удалена.
См. [Как внести вклад](/v3/contribute/).
:::

Итак, вы решили написать руководство для документации TON?

Мы рады видеть вас среди наших участников! Ознакомьтесь с приведенными ниже рекомендациями, чтобы убедиться, что ваше руководство соответствует стилю и качеству уже существующего контента в TON Docs.

Важно, чтобы вы потратили некоторое время на ознакомление со структурой руководчства и тем, как следует использовать заголовки. Ознакомьтесь с некоторыми из наших уже существующих руководств, а также посмотрите [предыдущие Pull Requests](https://github.com/ton-community/ton-docs/pulls?q=is%3Apr+is%3Aclosed), прежде чем отправить свой собственный.

## Процесс

:::info ВАЖНО
Прежде чем начать писать, *прочтите приведенные ниже рекомендации*! Они помогут вам обеспечить уровень стандартизации и качества, который значительно ускорит процесс проверки.
:::

Кроме того, обязательно ознакомьтесь с [**примером структуры руководства**](/v3/contribute/tutorials/sample-tutorial), который мы предоставили.

1. Для начала создайте ответвление и клонируйте репозиторий [ton-docs](https://github.com/ton-community/ton-docs/) на GitHub и создайте новую ветку в локальном репозитории.
2. Напишите руководство, учитывая качество и читабельность! Ознакомьтесь с существующими руководствами, чтобы понять, к чему следует стремиться.
3. Когда вы будете готовы отправить его на проверку, [откройте Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) из своей ветки. Мы будем уведомлены, и начнется процесс проверки:
  1. **Пожалуйста, приложите все усилия, чтобы отправить только окончательный вариант вашего руководства**. Некоторые опечатки и исправления грамматики приемлемы, но если необходимо внести существенные изменения, прежде чем мы сможем опубликовать руководство, проверка и внесение необходимых изменений займет гораздо больше времени.
4. После того, как мы рассмотрим вашу заявку и вы внесете все необходимые изменения, мы объединим Pull Request и опубликуем руководство в документации TON. Вскоре после этого мы свяжемся с вами, чтобы договориться об оплате!
5. После публикации не забудьте **продвигать** свое руководство в социальных сетях! [Сопровождающие документацию](/v3/contribute/maintainers) могут помочь усилить эту акцию, если вы будете сотрудничать с нами.

Подводя итог, рабочий процесс выглядит следующим образом:

1. ***Создайте ответвление и клонируйте*** репозиторий **`ton-docs`**
2. ***Напишите и отшлифуйте*** свое руководство
3. ***Отправьте Pull Request*** на рассмотрение
4. ***Внесите необходимые изменения***
5. Учебное пособие ***объединено и опубликовано***
6. ***Продвигайте свое учебное пособие*** в социальных сетях!

## Контекст

Основная проблема с добавлением «THE» перед «TON» заключается в том, что во время разработки документации TON и редакционной политики различные отделы, такие как маркетинг, поставщики и разработчики, присоединились к обсуждению, чтобы писать с заглавной буквы такие слова, как «Блокчейн», «Экосистема» и другие в сочетании с «TON», чтобы создать сильный образ единой системы, сети и бренда. После долгих обсуждений мы пришли к выводу, что для сильного имиджа бренда нам следует создать глоссарий слов и фраз, которые можно писать без «THE» и с заглавной буквы. Если Если это можно сделать с заглавной буквы, то в статье нет необходимости. В настоящее время существует два таких словосочетания: TON Blockchain и TON Ecosystem.

Что касается других названий модулей TON, таких как TON Connect, TON SDK, TON Grants и т. д., то это зависит от контекста. Мы применяем правило заглавных букв, но проявляем гибкость в отношении артикля. Если имя компонента стоит отдельно, лучше обойтись без артикля. Однако, если оно сочетается с нарицательным существительным, например, протоколом TON Connect, артикль необходим, поскольку он относится к протоколу сущности.

Что касается других словосочетаний, таких как «TON + существительное» (например, «мир TON», «сообщество TON» и т. д.), мы не ограничиваем использование артикля, поскольку мы, естественно, ожидаем увидеть артикль в сочетании с существительным.

## Общие советы

- **Не копируйте и не вставляйте ранее существовавший контент**. Плагиат является серьезной проблемой и недопустим. Если в основу руководства положен какой-либо существующий контент, ознакомьтесь с ним и дайте ссылку на него. При размещении ссылок на другие учебные пособия / ресурсы, по возможности, используйте ресурсы TON Docs.
- **Включайте любые видео-руководства или видеоконтент** в PR, загружая его на Google Диск.
- **Пополнение аккаунта с кранов должно быть четко объяснено**, включая то, какой аккаунт пополняется, откуда и почему. Не думайте, что учащиеся могут выполнить эту задачу самостоятельно!
- **Отображайте примеры выходных данных** в виде фрагментов терминала или снимков экрана, чтобы помочь учащимся понять, чего ожидать. Обрезайте длинные выходные данные.
- **Используйте подход, основанный на ошибках**, когда вы специально сталкиваетесь с ошибками, чтобы научить учащихся, как их отлаживать. Например, если вам нужно пополнить счет, чтобы иметь возможность развернуть контракт, сначала попробуйте развернуть без пополнения, посмотрите на возвращаемую ошибку, затем исправьте ошибку (пополнив счет) и повторите попытку.
- **Добавьте потенциальные ошибки и способы устранения неполадок.** Конечно, руководство не должно перечислять все возможные ошибки, но оно должно попытаться выявить важные или наиболее распространенные из них.
- **Используйте React или Vue** для клиентской части.
- **Перед тем, как сделать PR, сначала запустите код самостоятельно**, чтобы избежать очевидных ошибок и убедиться, что он работает так, как ожидается.
- **Избегайте включения внешних/перекрестных ссылок** на разные источники между руководствами. Если ваше руководство длинное, мы можем обсудить, как превратить его в более длинный курс или Pathway.
- **Предоставьте** **изображения или скриншоты**, чтобы проиллюстрировать сложные процессы, где это необходимо.
- Загрузите свои изображения в каталог `static` репозитория learn-tutorials — **НЕ** используйте прямые ссылки на внешние сайты, так как это может привести к повреждению изображений.
- **Ссылки на изображения** должны\*\* **быть в формате markdown**, и вы должны **ТОЛЬКО** использовать необработанный URL-адрес GitHub статического каталога в репозитории: `![name of your image](https://raw.githubusercontent.com/ton-community/ton-docs/main/static/img/tutorials/<your image filename>.png?raw=true)`
  - Не забудьте добавить `?raw=true` в конец URL-адреса.

## Как структурировать ваше учебное пособие

:::info Пример структуры руководства
Не стесняйтесь проверять [пример структуры руководства](/v3/contribute/tutorials/sample-tutorial), чтобы увидеть его своими глазами.
:::

- **Заголовок** должен быть прямым и понятным, обобщающим цель руководства. Не добавляйте заголовок урока в качестве заголовка внутри документа; вместо этого используйте имя файла документа markdown.
  - *Например*: если ваше руководство называется "*Пошаговое руководство по написанию вашего первого смарт-контракта на FunC*", имя файла должно быть:
    `step-by-step-guide-for-writing-your-first-smart-contract-in-func.md`
- Включите раздел **Введение**, объясняющий, *почему* это руководство важно каков его контекст. Не думайте, что это очевидно.
- Включите раздел **Предварительные требования**, в котором объясняются требуемые предварительные знания или существующие учебные пособия, которые необходимо выполнить в первую очередь, любые необходимые токены и т. д.
- Включите раздел **Требования**, в котором объясняются любые технологии, которые необходимо установить перед началом обучения и которые в руководстве не рассматриваются, например, расширение кошелька TON, Node.js и т.д. Не указывайте пакеты, которые будут установлены во время обучения.
- Используйте **подзаголовки** (H2: ##), чтобы разбить ваши объяснения в тексте руководства. Помните о содержании при использовании подзаголовков и старайтесь, чтобы они были по существу.
  - Если содержимое под подзаголовком короткое (например, только один абзац и блок кода), рассмотрите возможность использования жирного текста вместо подзаголовка.
- Включите раздел **Заключение**, который суммирует то, что было изучено, закрепляет ключевые моменты, а также поздравляет учащегося с завершением руководства.
- (***Необязательно***) Включите раздел **Что дальше**, указывающий на хорошие последующие руководства или другие ресурсы (проекты, статьи и т. д.).
- (***Необязательно***) Включите раздел **Об** **Авторе** в конце. Ваша биография должна включать ссылку на ваш профиль GitHub (где будет указано ваше имя, веб-сайт и т. д.) и ссылку на ваш профиль Telegram (чтобы пользователи могли связаться с вами/отметить вас для получения помощи и вопросов).
- Раздел **Ссылки** **должен** присутствовать, если при написании этого руководства вы использовали какую-либо помощь из других документов, репозиториев GitHub или других руководств. Указывайте источники, добавляя их имя и ссылку на документ, когда это возможно (если это не цифровой документ, включите ISBN или другие средства ссылки).

## Руководство по стилю

- **Тон письма -** Учебники пишутся участниками сообщества для своих коллег.
  - Учитывая это, мы рекомендуем создать тон включения и взаимодействия на протяжении всего учебника. Используйте такие слова, как «мы», «нас», «наш».
    - *Например*: «Мы успешно развернули наш контракт.»
  - При предоставлении прямых инструкций не стесняйтесь использовать «вы», «ваш» и т. д.
    - *Например*: "*Ваш файл должен выглядеть так:*".

- **Правильно используйте Markdown** на протяжении всего учебника. Ознакомьтесь с [руководством по Markdown на GitHub](https://guides.github.com/features/mastering-markdown/), а также с [примером структуры руководства](/v3/contribute/tutorials/sample-tutorial).

- **Не используйте предварительно отформатированный текст для выделения**, *например*:
  - ❌ "TON counter `smart contract` с именем `counter.fc`" неверно.
  - ✅ "TON counter **smart contract** с именем `counter.fc`" верно.

- **Не используйте форматирование markdown в заголовке раздела**, *например*:
  - ❌ # **Введение** неверно.
  - ✅ # Введение верно.

- **Объясните свой код!** Не просите учащихся просто слепо копировать и вставлять.
  - Имена функций, переменные и константы **должны** быть одинаковыми во всем документе.
  - Используйте комментарий в начале блока кода, чтобы показать путь и имя файла, где находится код. *Например*:

    ```jsx
    // test-application/src/filename.jsx

    import { useEffect, useState } from 'react';

    ...
    ```

- **Выберите соответствующий язык** для подсветки синтаксиса блока кода!
  - Все блоки кода *должны* иметь подсветку синтаксиса. Используйте **\`\`\\`text**, если вы не уверены, какой тип подсветки синтаксиса применить.

- **Не используйте синтаксис блока кода для предварительно отформатированного текста**, *например*:
  - ❌ \`filename.jsx\` неправильно.
  - ✅ \`filename.jsx\` правильно.

- **Ваши блоки кода должны быть хорошо прокомментированы**. Комментарии должны быть короткими (обычно две или три строки за раз) и эффективными. Если вам нужно больше места для объяснения фрагмента кода, сделайте это за пределами блока кода.

- **Не забудьте оставить пустую строку** перед всеми блоками кода и после них.
  *Например*:

```jsx
  
// test-application/src/filename.jsx  
  
import { useEffect, useState } from 'react';
  
```

- **Используйте linter и prettifier** перед вставкой кода в блоки кода. Мы рекомендуем `eslint` для JavaScript/React. Используйте `prettier` для форматирования кода.
- **Избегайте чрезмерного использования маркеров**, нумерованных списков или сложного форматирования текста. Использование **жирного** или *курсива* выделения допускается, но должно быть сведено к минимуму.

# **Настройка приложения**

- Проекты Web3 обычно включают несколько существующих библиотек кода. Обязательно учитывайте это при написании своего руководства. По возможности предоставьте репозиторий GitHub в качестве отправной точки, чтобы облегчить учащимся начало работы.
- Если вы *не* используете репозиторий GitHub для хранения кода, используемого в вашем руководстве, не забудьте объяснить читателям, как создать папку для организации кода.
  *Например*: `mkdir example && cd example`
- Если вы используете `npm init` для инициализации каталога проекта, объясните подсказки или используйте флаг `-y`.
- Если вы используете `npm install`, используйте флаг `-save`.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/tutorials/principles-of-a-good-tutorial.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/tutorials/principles-of-a-good-tutorial.md
================================================
# Принципы хорошего руководства

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::danger
Эта страница устарела и скоро будет удалена.
См. [Как внести вклад](/v3/contribute/).
:::

Оригинальный комментарий к этим принципам от [talkol](https://github.com/talkol):

- [Оригинальный комментарий к TON Footstep #7](https://github.com/ton-society/ton-footsteps/issues/7#issuecomment-1187581181)

Вот краткое изложение этих пунктов для новых участников.

## Принципы

1. Весь процесс должен выполняться на стороне пользователя. Не должно быть никаких сторонних сервисов. Вам нужно сделать все так, чтобы пользователь мог просто клонировать репозиторий и сразу же запустить его.

2. README должен быть ОЧЕНЬ подробным. Не предполагайте, что пользователи что-то знают. Если руководство требует этого, оно также должно объяснять, как установить компилятор FunC или Lite-клиент на ваше устройство. Вы можете скопировать эти части из других руководств в этой документации.

3. Было бы хорошо, если бы репозиторий включал весь исходный код используемых контрактов, чтобы пользователи могли вносить незначительные изменения в стандартный код. Например, смарт-контракт жетона позволяет пользователям экспериментировать с пользовательским поведением.

4. Если это возможно, создайте удобный интерфейс, который позволит пользователям развертывать или запускать проект без необходимости загрузки кода или какой-либо настройки. Обратите внимание, что это все еще должно быть автономным и обслуживаться из GitHub Pages для запуска на 100% клиентской части, на устройстве пользователя. Пример: https://minter.ton.org/

5. Объясните пользователям, что означает каждый выбор поля, и объясните лучшие практики.

6. Объясните все, что нужно знать о безопасности. Вы должны объяснить достаточно, чтобы разработчики не совершали ошибок и не создавали опасные смарт-контракты/ботов/веб-сайты — вы обучаете их лучшим практикам безопасности.

7. В идеале репозиторий должен включать хорошо написанные тесты, которые показывают читателю, как лучше всего реализовать их в контексте вашего руководства.

8. Репозиторий должен иметь собственные простые для понимания скрипты компиляции/развертывания. Пользователь должен иметь возможность просто `npm install` и использовать их.

9. Иногда достаточно репозитория GitHub, и нет необходимости писать полную статью. Просто README со всем кодом, который вам нужен в репозитории. В этом случае код должен быть хорошо прокомментирован, чтобы пользователь мог легко его прочитать и понять.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/tutorials/sample-tutorial.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/tutorials/sample-tutorial.md
================================================
# Пример структуры руководства

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::danger
Эта страница устарела и скоро будет удалена.
См. [Как внести вклад](/v3/contribute/).
:::

## Введение

Заголовок "Введение" **должен** быть H2: `## Введение`

Этот раздел предназначен для того, чтобы объяснить контекст этого руководства и почему это важно, что мы собираемся создать и изучить в этом руководстве.

- Опишите этот раздел так, как будто вы объясняете его 5-летнему ребенку (**[ELI5](https://www.dictionary.com/e/slang/eli5/)**)
- Объясните все максимум в 5–6 строках.

*Например:*

> Смарт-контракт - это просто компьютерная программа, которая работает на блокчейне TON или, точнее, на его [TVM](/v3/documentation/tvm/tvm-overview) (*TON Virtual Machine*). Контракт состоит из кода (*скомпилированных инструкций TVM*) и данных (постоянного состояния), которые хранятся по некоторому адресу в TON.

## Требования

Заголовок "Условия" **должен** быть H2: `## Условия`

В этом разделе вы должны объяснить о любых необходимых предварительных знаниях или о любых существующих руководствах, которые необходимо выполнить в первую очередь. Любые необходимые токены — укажите их здесь.

*Например:*

> В этом руководстве мы собираемся создать жетоны в тестовой сети. Прежде чем продолжить, убедитесь, что на вашем кошельке [тестовой сети](/v3/documentation/smart-contracts/getting-started/testnet) достаточно средств.

## Требования

Заголовок "Требования" **должен** быть H2: `## Требования`

**ДОПОЛНИТЕЛЬНО :** вставьте любой видеоконтент в этот раздел, если он есть в вашем руководстве.

Любая технология, которую необходимо установить перед началом руководства и которую руководство не будет рассматривать (`TON Wallet Extension`, `node`, и т. д.). Не перечисляйте пакеты, которые будут установлены во время руководства.

*Например:*

- В этом руководстве нам понадобится расширение TON Wallet; установите его [ЗДЕСЬ](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd).
- Убедитесь, что у вас установлен NodeJS 12.0.1+.

## Основная часть руководства

- Пожалуйста, не используйте "Основная часть руководства" в качестве заголовка, используйте собственный заголовок, который соответствует материалу.
  - "Начало работы" приемлемо, если вы не можете придумать ничего другого 😉
- Добавьте любой текст, который поможет читателям разобраться в вашем учебном пособии, и **не забудьте проверить его на орфографию** и грамматику, прежде чем отправлять учебное пособие.
  - [Grammarly](http://grammarly.com) -- хорошая бесплатная программа, которая поможет вам избежать грамматических ошибок.

### Ключевые моменты

- Не используйте "Основную часть руководства" в качестве заголовка!

- **Все подзаголовки оставляйте на уровне H3**, не используйте H4 или ниже.
  - В синтаксисе Markdown для заголовков H2 используются два хэш-знака: ##
  - Три хэш-знака используются для заголовков H3: ###

- Добавляйте только необходимые комментарии к блокам кода. ***Не*** добавляйте комментарии в стиле # к блокам кода ввода терминала.

- Добавляйте все соответствующие блоки кода:
  - ## Синтаксис Markdown для блоков кода состоит из трех обратных кавычек в начале и конце блока кода. Также убедитесь, что перед и после обратных кавычек во всех блоках кода есть новая строка. **Например**:
    \`js  
    сonst testVariable = 'some string';  
    someFunctionCall();  
    \`

  - Все блоки кода ***должны*** иметь тип подсветки синтаксиса. Используйте \`\`\\`text, если вы не уверены.

  - \\`\`\\`text должен использоваться для вывода терминала, команд терминала и обычного текста.

  - \`javascript *или* `js можно использовать для любого кода JavaScript.

  - \`typescript или `ts можно использовать для любого кода TypeScript.

  - \\`\`\\`jsx для кода ReactJS.

  - \\`\`cpp для кода Func.

  - Используйте \\`\`\\`graphql при подсветки синтаксиса GraphQL.

  - Используйте \`json при подсветке допустимого JSON. (Для недопустимых примеров JSON используйте \`text.)

  - \\`\`\\`bash следует использовать только в тех блоках кода, где вам нужны комментарии в стиле #. Это нужно делать осторожно, потому что во многих ситуациях символ # будет отображаться как заголовок markdown. Как правило, это повлияет на оглавление.

- Не используйте `предварительно отформатированный текст` для выделения текста; вместо этого используйте только **жирный** шрифт или *курсив*.

- Добавьте изображения или блоки кода, чтобы отразить ожидаемый результат работы терминала.

- При написании руководства используйте подход, основанный на ошибках. Добавьте распространенные ошибки и шаги по устранению неполадок. *Например:*

> **Не удается подключиться к Testnet из-за ошибки при выполнении команды `node deploy:testnet`.**
>
> Давайте рассмотрим некоторые распространенные причины:

- Убедитесь, что у вас достаточно средств в сгенерированном тестовом кошельке в `.env`. Если нет, добавьте несколько тестовых монет из Faucet Giver.
- Если у вас все еще возникает та же проблема, обратитесь за помощью к разработчикам в [чат разработчиков](https://t.me/TonDev).

>

## Заключение

Заголовок "Заключение" **должен** быть H2: `## Заключение`

В этом разделе следует обобщить то, что было изучено в руководстве, закрепить ключевые моменты и поздравить обучающегося с завершением руководства. Используйте максимум 5–6 строк.
*Например*:

> Мы создали простой новый контракт FunC с функциональностью счетчика. Затем мы построили и развернули его on-chain и, наконец, взаимодействовали с ним, вызвав геттер и отправив сообщение.

Пожалуйста, помните, что этот код не предназначен для производственной среды; есть еще несколько вещей, которые следует учесть, если вы хотите развернуть это в основной сети, например, отключение метода передачи, если токен размещается на рынке, и т. д.

>

## См. также

Заголовок "Смотрите также" **должен** быть H2: `## См. также`

Используйте этот раздел, чтобы объяснить, что можно сделать дальше после этого руководства, чтобы продолжить обучение. Не стесняйтесь добавлять рекомендуемые проекты и статьи, относящиеся к этому руководству. Если вы работаете над другими расширенными руководствами, вы можете кратко упомянуть их здесь. Обычно здесь размещаются только связанные страницы с docs.ton.org.

## Об авторе *(Необязательно)*

Заголовок "Об авторе" **должен** быть H2: `## Об авторе`

Должен быть коротким. Не более одной-двух строк. Вы можете указать ссылку на свой профиль на GitHub или в Telegram. Пожалуйста, не добавляйте сюда свой LinkedIn или Twitter.

## Ссылки *(необязательно)*

Заголовок "Ссылки" **должен** быть H2: `## Ссылки`

Этот раздел ***должен*** присутствовать, если при написании этого руководства вы использовали какую-либо помощь из других документов, репозиториев GitHub или уже существующих руководств.

Укажите источники, добавив их имя и ссылку на документ, когда это возможно.

Если это не цифровой документ, включите ISBN или другую форму ссылки.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/typography.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/contribute/typography.mdx
================================================
# Типографика

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Введение

Этот стандарт обеспечивает единообразный и профессиональный стиль в документации TON. 

Следуя этим рекомендациям, вы помогаете поддерживать ясность, улучшаете читаемость и поддерживаете легкую навигацию на сайте документации и любых связанных меню.

---

## Имена файлов

- **Соглашение об именовании:** используйте **kebab-case** — все строчные буквы, слова разделены дефисами.
- **Пример:** `kebab-case-file-name.md`
- **Цель:** Kebab-case дружелюбен к SEO, легко читается и помогает избежать конфликтов имен или проблем в файловых системах, чувствительных к регистру.

---

## Типографика документов

### Общий стиль текста

- Пишите краткие, понятные предложения.
- Используйте простой, прямой язык, подходящий как для новых, так и для опытных пользователей.
- Избегайте слишком сложных структур; стремитесь к ясности и краткости.
- Избегайте чрезмерного использования жирного или курсивного начертания.
- Все графические элементы, содержащие текст, должны использовать шрифт [Inter](https://rsms.me/inter/) или аналогичный совместимый шрифт.

### Сокращения

При введении незнакомого сокращения напишите весь термин и заключите сокращение в скобки. Выделите как полный термин, так и сокращение жирным шрифтом.

**Пример:**

**The Open Network (TON)** — это децентрализованная и открытая интернет-платформа...

### Заголовки

#### Иерархия заголовков:

1. **H1 (`#`)** — Название документа
2. **H2 (`##`)** — Основные разделы
3. . **H3 (`###`)** — Подразделы в H2
4. **H4 (`####`)** и ниже — Используйте экономно для более мелких деталей

#### Стиль заглавных букв в заголовках:

- **H1, H2, H3 и H4:** **Регистр предложений**
  - Пример: `# Это предложение в заглавных буквах`
  - Пример: `## Это предложение в заглавных буквах`
  - Пример: `## Это предложение в заглавных буквах`
  - Пример: `### Это предложение в заглавных буквах`

- **Исключение**: **Специальные термины**.
  Несмотря на общее правило _падежа предложения_,
  определенные слова или фразы — ключевые концепции или определенные термины в документации — всегда должны форматироваться
  с использованием заглавного регистра.
  - Пример: `# Используйте американский английский`
  - Пример: `# Запустите службу TON Center`

#### Согласованность заголовков:

- Избегайте повторения одних и тех же слов в последовательных заголовках.

#### Термины в заголовках пишутся с заглавной буквы

Иногда вы можете столкнуться с определенными заглавными буквами, которые пишутся с заглавной буквы в соответствии с правилами американского английского.

- Стандарт использования заглавных букв для определенных терминов:
- Пример: `## Use American English`
- Пример: `### Date Format`

Дата и формат являются специальными терминами и должны быть написаны с заглавной буквы, независимо от общего правила написания предложений.

### Заголовки меню навигации

Меню навигации должны оставаться минималистичными как в левой боковой панели, так и в верхнем меню. Для согласованности и ясности все заголовки меню должны использовать Sentence case.

#### Меню левой боковой панели:

- Избегайте длинных описаний.
- Используйте короткие, понятные надписи из двух-трех слов.

:::info
Укажите левое боковое меню с помощью файлов конфигурации [боковой панели](https://github.com/ton-community/ton-docs/tree/main/sidebars).
:::

#### Меню панели навигации:

- Установите в этом меню только страницы иерархии высокого уровня.
- Используйте широкие, описательные термины для категоризации контента, чтобы пользователи могли быстро определить нужный им основной раздел.

:::info
Укажите меню панели навигации с помощью файла конфигурации [navbar.js](https://github.com/ton-community/ton-docs/blob/main/navbar.js).
:::

#### Согласованность между меню и заголовками на странице

- Сопоставьте текст заголовка, используемый в оглавлении или боковом меню, с текстом заголовка в статье, чтобы читатели знали, что они находятся на нужной странице или в нужном разделе.

---

## Объединяем все это вместе

1. **Создайте новый файл документации**, используя соглашение об именовании в стиле kebab-case
   - Пример: `getting-started-guide.md`.
2. **Откройте файл** и установите заголовок H1 в sentence case
   - Пример: `# Руководство по началу работы`.
3. **Организуйте контент** с помощью заголовков H2 по основным темам. 
   - Пример: `## Шаги установки`, также в sentence case.
4. **Используйте заголовки H3** для более подробных подтем в sentence case 
   - Пример: `### Установка на Linux`.
5. **Поддерживайте согласованность ** в любых боковых меню или оглавлениях, сопоставляя текст заголовка с текстом документа.

---

## Пример структуры

```md title="getting-started-with-ton.md"
# Getting started with TON

## Prerequisites

### What is TON
**The Open Network (TON)** is a decentralized and open internet platform...
The content goes here.

### Checking your environment
The content goes here.

## Installation steps

### Installing on Linux
The content goes here.

### Installing on macOS
The content goes here.

## Basic usage

### Running your first command
The content goes here.

## See also
- [How to contribute](/v3/contribute/)
```

## См. также

- [Как внести свой вклад](/v3/contribute/)
- [Стандартизация контента](/v3/contribute/content-standardization/)
- [Типографика](/v3/contribute/typography/)
- [Программа локализации](/v3/contribute/localization-program/overview/)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/archive/compile.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/archive/compile.md
================================================
# Составляйте и создавайте смарт-контракты на TON

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Вот список библиотек и репозиториев для создания Вашего смарт-контракта.

**TLDR:**

- В большинстве случаев достаточно использовать Blueprint SDK.
- Если Вам нужен более низкоуровневый подход, Вы можете использовать ton-compiler или func-js.

## Blueprint

### Обзор

Среда разработки для блокчейна TON, предназначенная для написания, тестирования и развертывания смарт-контрактов. Подробнее читайте в [Git репозитории Blueprint](https://github.com/ton-community/blueprint).

### Установка

Выполните следующую команду в терминале, чтобы создать новый проект, и следуйте инструкциям на экране:

```bash
npm create ton@latest
```

&nbsp;

### Особенности

- Оптимизированный рабочий процесс для создания, тестирования и развертывания смарт-контрактов
- Очень простое развертывание в mainnet/testnet с помощью Вашего любимого кошелька (например, Tonkeeper)
- Удивительно быстрое тестирование нескольких смарт-контрактов в изолированном блокчейне, работающем в процессе

### Технологический стек

1. Компиляция FunC с помощью https://github.com/ton-community/func-js (без CLI)
2. Тестирование смарт-контрактов с помощью https://github.com/ton-community/sandbox
3. Развертывание смарт-контрактов с помощью [TON Connect 2](https://github.com/ton-connect), [Tonhub wallet](https://tonhub.com/) или диплинк `ton://`

### Требования

- [Node.js](https://nodejs.org) последней версии, например, v18, проверьте версию с помощью `node -v`
- IDE с поддержкой TypeScript и FunC, например [Visual Studio Code](https://code.visualstudio.com/) с [плагином FunC](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode)

### Как использовать?

- [Посмотрите презентацию DoraHacks с демонстрацией работы с blueprint](https://www.youtube.com/watch?v=5ROXVM-Fojo).
- Прочитайте подробное объяснение в [репозитории Blueprint](https://github.com/ton-community/blueprint#create-a-new-project).

## ton-compiler

### Обзор

Упакованный компилятор FunC для смарт-контрактов TON:

- GitHub: [ton-community/ton-compiler](https://github.com/ton-community/ton-compiler)
- NPM: [ton-compiler](https://www.npmjs.com/package/ton-compiler)

### Установка

```bash npm2yarn
npm install ton-compiler
```

### Особенности

- Несколько версий компилятора FunC
- Не нужно устанавливать и компилировать TON
- Программные и CLI-интерфейсы
- Готовность к использованию в модульном тестировании

### Как использовать

Этот пакет добавляет бинарные файлы `ton-compiler` в проект.

Компиляция FunC - это многоступенчатый процесс. Один из них - компиляция Func в код Fift, который затем компилируется в двоичное представление. Компилятор Fift уже содержит Asm.fif.

FunC stdlib входит в комплект поставки, но может быть отключен во время выполнения.

#### Использование консоли

```bash
# Compile to binary form (for contract creation)
ton-compiler --input ./wallet.fc --output ./wallet.cell

# Compile to fift (useful for debugging)
ton-compiler --input ./wallet.fc --output-fift ./wallet.fif

# Compile to binary form and fift
ton-compiler --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif

# Disable stdlib
ton-compiler --no-stdlib --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif

# Pick version
ton-compiler --version "legacy" --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif
```

#### Программное использование

```javascript
import { compileContract } from "ton-compiler";
let result = await compileContract({ code: 'source code', stdlib: true, version: 'latest' });
if (result.ok) {
  console.log(result.fift); // Compiled Fift assembler
  console.log(result.cell); // Compiled cell Buffer
} else {
  console.warn(result.logs); // Output logs
}
```

## func-js

### Обзор

*Кроссплатформенные* привязки для компилятора TON FunC.

Он более низкоуровневый, чем ton-compiler, поэтому используйте его только в том случае, если ton-compiler Вам не подходит.

- GitHub: [ton-community/func-js](https://github.com/ton-community/func-js)
- NPM: [@ton-community/func-js](https://www.npmjs.com/package/@ton-community/func-js)

### Установка

```bash npm2yarn
npm install @ton-community/func-js
```

### Особенности

- Нет необходимости компилировать или загружать двоичные файлы FunC
- Работает как в Node.js, так и в **WEB** (требуется поддержка WASM)
- Компилируется прямо в BOC с кодом Cell
- Сборка возвращается для отладки
- Не зависит от файловой системы

### Как использовать

Внутри этот пакет использует компилятор FunC и интерпретатор Fift, объединенные в одну lib, скомпилированную в WASM.

Простая схема:

```bash
(your code) -> WASM(FunC -> Fift -> BOC)
```

Исходники внутреннего lib можно найти [здесь](https://github.com/ton-blockchain/ton/tree/testnet/crypto/funcfiftlib).

### Пример использования

```javascript
import {compileFunc, compilerVersion} from '@ton-community/func-js';
import {Cell} from 'ton';

async function main() {
    // You can get compiler version 
    let version = await compilerVersion();
    
    let result = await compileFunc({
        // Entry points of your project
        entryPoints: ['main.fc'],
        // Sources
        sources: {
            "stdlib.fc": "<stdlibCode>",
            "main.fc": "<contractCode>",
            // Rest of the files which are included in main.fc if some
        }
    });

    if (result.status === 'error') {
        console.error(result.message)
        return;
    }

    // result.codeBoc contains base64 encoded BOC with code cell 
    let codeCell = Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0];
    
    // result.fiftCode contains assembly version of your code (for debug purposes)
    console.log(result.fiftCode)
}
```

Обратите внимание, что все содержимое исходных файлов FunC, используемое в Вашем проекте, должно быть передано в `sources`, включая:

- точки входа
- stdlib.fc (если Вы его используете)
- все файлы, включенные в точки входа

### Проверено сообществом TON

- [ton-community/ton-compiler](https://github.com/ton-community/ton-compiler) - готовый к использованию компилятор FunC для смарт-контрактов TON.
- [ton-community/func-js](https://github.com/ton-community/func-js) - кроссплатформенные привязки для компилятора TON FunC.

### Сторонние контрибьюторы

- [grozzzny/ton-compiler-groz](https://github.com/grozzzny/ton-compiler-groz) - компилятор смарт-контрактов TON FunC.
- [Termina1/tonc](https://github.com/Termina1/tonc) - TONC (компилятор TON). Использует WASM, поэтому идеально подходит для Linux.

## Другие

- [disintar/toncli](https://github.com/disintar/toncli) - один из самых популярных подходов. Вы даже можете использовать его с Docker.
- [tonthemoon/ton](https://github.com/tonthemoon/ton) - *(закрытая бета)* однострочный установщик бинарных файлов TON.
- [delab-team/tlbcrc](https://github.com/delab-team/tlbcrc) - Пакет и CLI для генерации опкодов по схеме TL-B



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/archive/hacktoberfest-2022/README.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/archive/hacktoberfest-2022/README.mdx
================================================
import Button from '@site/src/components/button'

# Что такое Hacktoberfest?

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

<div style={{ textAlign: 'center', margin: '50px 0' }}>
  <img alt="tlb structure"
       src="/img/docs/hacktoberfest.webp"
       width="100%" />
</div>

[Хактоберфест](https://hacktoberfest.digitalocean.com/) - это месячный праздник, посвященный _проектам с открытым исходным кодом_, их _сопровождающим_ и всему сообществу _соавторов_. Каждый октябрь сопровождающие проектов с открытым исходным кодом уделяют особое внимание новым участникам, направляя разработчиков через их первые запросы.

Для сообщества TON настало время помочь развитию экосистемы вместе, так что давайте объединим весь мир с нашей **Хак-TON-берфест** вечеринкой и станем _#1 экосистемой года с открытым исходным кодом_!

## Как принять участие?

Правила Хактоберфеста 2022 года таковы:

- **Хактоберфест открыт для всех**!
- Зарегистрируйтесь в любое время с 26 сентября по 31 октября
- Pull-запросы можно делать в любом проекте GITHUB или GITLAB:
  - [Список проектов по экосистеме TON](/hacktonberfest)
  - [Список проектов на GitHub](https://github.com/topics/hacktoberfest)
- Иметь **4** запросов на слияние, принятых в период с 1 октября по 31 октября
- Первые 40,000 участников (мейнтейнеры и контрибьюторы), которые завершат Hacktoberfest, смогут выбрать один из двух призов: дерево, посаженное в их честь, или футболку Hacktoberfest 2022. _(от сообщества Hacktoberfest)_
- Каждый участник (разработчик и контрибьютор) любого из проектов экосистемы TON получит [**Лимитированный Hack-TON-berfest NFT**](/v3/documentation/archive/hacktoberfest-2022#what-are-the-rewards). _(от TON Foundation)_

Для всех участников TON это возможность стимулировать развитие всей экосистемы и получать крутые вознаграждения от TON Foundation. Давайте сделаем это вместе!

## Какие награды?

Чтобы мотивировать сообщество вносить свой вклад в проекты с открытым исходным кодом в экосистеме TON, Вы сможете получить специальное вознаграждение от TON Foundation. Каждый участник получит **Лимитированный Hack-TON-berfest NFT** в качестве доказательства участия:

<div style={{width: '100%', textAlign:'center', margin: '0 auto'}}>
  <video width="300" style={{width: '100%', borderRadius:'10pt', margin:'15pt auto'}} muted={true} autoPlay={true} loop={true}>
    <source src="/files/nft-sm.mp4" type="video/mp4" />

Ваш браузер не поддерживает видео тег.

</video>
</div>

:::info ВАЖНО!
В ноябре Фонд TON сминтит коллекцию на все адреса кошельков, присланные на [@toncontests_bot](https://t.me/toncontests_bot). Это произойдет после подсчета и проверки результатов всех вкладов.
:::

У Вас есть достаточно времени, чтобы принять участие в мероприятии. Давайте построим децентрализованный Интернет будущего вместе с тысячами участников со всего мира!

<Button href="/v3/documentation/archive/hacktoberfest-2022/as-contributor"
     colorType="primary" sizeType={'lg'}>

Я хочу стать Контрибьютором

</Button>

<Button href="/v3/documentation/archive/hacktoberfest-2022/as-maintainer" colorType={'secondary'} sizeType={'lg'}>

Я Мейнтейнер

</Button>



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/archive/hacktoberfest-2022/as-contributor.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/archive/hacktoberfest-2022/as-contributor.md
================================================
# Участвуйте в качестве контрибьютора

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Чтобы стать контрибьютором, который получит ограниченный *Hack-TON-berfest NFT*, пожалуйста, создайте свой собственный [TON-кошелёк](https://ton.org/wallets) и подтвердите свой аккаунт на GitHub.

## Начните свое путешествие

1. Настройте любой кошелек со страницы [ton.org/wallets](https://ton.org/wallets). ([Расширение TON Wallet](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd), например)
2. Пожалуйста, сообщите адрес своего кошелька [@toncontests_bot](https://t.me/toncontests_bot) в Telegram.
3. Подтвердите Вашу учетную запись GitHub в том же боте.

После этих шагов Вы готовы внести свой вклад и получить [лимитированный Hack-TON-berfest NFT](/v3/documentation/archive/hacktoberfest-2022#what-are-the-rewards).

Добро пожаловать в клуб, это только начало!

## Вы только начинаете вносить свой вклад в открытый исходный код?

Hacktoberfest - это отличное место для того, чтобы впервые окунуться в работу с открытым исходным кодом. Здесь есть множество трансляций, постов, руководств и обсуждений, чтобы начать. Вы присоединитесь ко многим людям, которые также начинают свой путь в этом месяце!

- [Основная информация о Hacktoberfest для новичков](https://hacktoberfest.com/participation/#beginner-resources)
- [Руководство по внесению Вашего первого вклада](https://dev.to/codesandboxio/how-to-make-your-first-open-source-contribution-2oim) от Ceora Ford
- [Практикуйте рабочий процесс, чтобы сделать свой первый вклад](https://github.com/firstcontributions/first-contributions)
- [Преодоление синдрома самозванца при работе с открытым исходным кодом](https://blackgirlbytes.dev/conquering-the-fear-of-contributing-to-open-source)

## Как я могу внести свой вклад в TON?

В экосистеме TON есть несколько организаций и хранилищ:

<span className="DocsMarkdown--button-group-content">
  <a href="/hacktonberfest"
     className="Button Button-is-docs-primary">
    Список проектов, ищущих помощников
  </a>
</span>



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/archive/hacktoberfest-2022/as-maintainer.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/archive/hacktoberfest-2022/as-maintainer.md
================================================
# Участвовать в качестве Мейнтейнера

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Событие Hacktoberfest - лучшее время года для получения поддержки от сообщества!

Если ваш репозиторий относится к Экосистеме TON, многие контрибьюторы будут заинтересованы в этом. Давай поможем им погрузиться в ваш проект!

## Приготовьтесь к вечеринке

Чтобы правильно работать с участниками, у Вас должен быть репозиторий с хорошей репутацией.

Следуйте этим лучшим практикам, чтобы подготовить свой проект к содействию:

1. Добавьте тему "hacktoberfest" в свой репозиторий для **OPT-IN TO HACKTOBERFEST** и укажите, что Вам нужно содействие.
2. Примените ярлык "hacktoberfest" к issues, с которыми Вы хотите, чтобы контрибьюторы помогли Вам в Вашем проекте на GitHub или GitLab.
3. Пожалуйста, прочтите и используйте [основные советы для новых мейнтейнеров открытого исходного кода](https://blog.ton.org/essential-tips-for-new-open-source-maintainers) от TON Society.
4. Подготовьтесь принимать соответствующие pull/merge запросы, делая merge, оставляя одобряющий ревью или добавляя метку "hacktoberfest-accepted".
5. Отклоняйте все спам запросы, помечая их как "spam", и закрывайте или помечайте любые другие недействительные вклады как "invalid"

Вот пример полного репозитория: [ton-community/ton-compiler](https://github.com/ton-community/ton-compiler)

После этого можете добавить свой репозиторий в список.

## Награды для мейнтейнеров

Как мейнтейнер репозитория в экосистеме TON, Вы сможете получать два вида вознаграждений:

1. [Hacktoberfest Reward Kit](https://hacktoberfest.com/participation/#maintainers) (*смотрите REWARD FOR MAINTAINERS*)
2. [Ограниченный Hack-TON-berfest NFT](/v3/documentation/archive/hacktoberfest-2022#what-are-the-rewards) (пожалуйста, зарегистрируйте адрес кошелька в [@toncontests_bot](https://t.me/toncontests_bot)_)

## Как присоединиться и попасть в список?

Чтобы принять участие в Hack-TON-berfest, перейдите по этой ссылке:

<span className="DocsMarkdown--button-group-content">
  <a href="https://airtable.com/shrgXIgZdBKKX64NL"
     className="Button Button-is-docs-primary">
    Добавьте репозиторий в список
  </a>
</span>



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/archive/mining.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/archive/mining.md
================================================
# Руководство по добыче TON

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::warning устаревшее
Эта информация может быть устаревшей и больше не актуальной. Вы можете пропустить ее.
:::

## <a id="introduction"></a>Введение

Этот документ представляет собой введение в процесс добычи Toncoin с помощью PoW-раздатчиков. Пожалуйста, посетите [ton.org/mining](https://ton.org/mining) для получения актуальной информации о состоянии майнинга TON.

## <a id="quick-start"></a>Быстрый старт

Чтобы сразу же начать добычу:

1. Купите [компьютер, подходящий для майнинга](#hardware).
2. Установите дистрибутив [Ubuntu](https://ubuntu.com) 20.04 для настольных компьютеров или серверов.
3. Установите [mytonctrl](https://github.com/igroman787/mytonctrl#installation-ubuntu) в режиме `lite`.
4. Проверьте свое оборудование и [ожидаемый доход от добычи] (/v3/documentation/archive/mining#income-estimates), выполнив команду `emi` в `mytonctrl`.
5. Если у Вас его еще нет, создайте `адрес кошелька`, используя один из [кошельков](https://www.ton.org/wallets).
6. Определите свой `адрес кошелька` в качестве цели для майнинга, выполнив команду `set minerAddr "..."` в `mytonctrl`.
7. Выберите контракт-даритель из списка, доступного на [ton.org/mining](https://ton.org/mining), и настройте свой майнер на его добычу, выполнив команду `set powAddr "..."` в `mytonctrl`.
8. Начните добычу, выполнив команду `mon` в `mytonctrl`
9. Проверьте загрузку процессора на Вашем компьютере; процесс под названием `pow-miner` должен использовать большую часть Вашего процессора.
10. Дождитесь удачи; результат шага 4 должен был примерно сказать Вам, каковы Ваши шансы добыть блок.

## <a id="basics"></a>Основы

Toncoin распространяется через `PoW Givers`, которые представляют собой смарт-контракты с определенным количеством Toncoin, закрепленным за ними. В настоящее время в сети TON существует 10 активных PoW Givers. Каждый giver распределяет монеты блоками по 100 TON. Чтобы заработать один из этих блоков, Ваш компьютер должен решить сложную математическую задачу быстрее, чем другие майнеры. Если другой майнер решит задачу раньше Вас, работа Вашей машины будет отброшена, и начнется новый раунд.

Прибыль от майнинга не является постепенной; она поступает партиями по 100 TON за каждый успешно решенную задачу giver-а. Это означает, что если Ваша машина имеет 10% шанс вычислить блок в течение 24 часов (см. шаг 4 раздела [Быстрый старт](/v3/documentation/archive/mining#quick-start)), то Вам, вероятно, придется подождать ~10 дней, прежде чем Вы получите вознаграждение в размере 100 TON.

Процесс добычи в значительной степени автоматизирован с помощью `mytonctrl`. Подробную информацию о процессе майнинга можно найти в документе [PoW givers](https://www.ton.org/#/howto/pow-givers).

## <a id="advanced"></a>Продвинутый

Если Вы серьезно настроены к майнингу и хотите управлять несколькими машинами или майнинг-фермой, Вам необходимо узнать о TON и о том, как работает майнинг. За подробной информацией обратитесь к разделу [HOWTO](https://ton.org/#/howto/). Здесь приведены некоторые общие советы:

- **ЗАПУСТИТЕ** свой собственный узел / lite-сервер на отдельной машине; это позволит Вашей майнинговой ферме не зависеть от внешних lite-серверов, которые могут выйти из строя или не обрабатывать Ваши запросы своевременно.
- **НЕ БОМБАРДИРУЙТЕ** публичные lite-серверы запросами `get_pow_params`, если у Вас есть пользовательские скрипты, которые часто опрашивают статус дарителей, Вы **должны** использовать свой собственный lite-сервер. Клиенты, нарушающие это правило, рискуют получить черный список IP-адресов на публичных lite-серверах.
- **ПОСТАРАЙТЕСЬ ПОНЯТЬ**, как работает [процесс майнинга](https://www.ton.org/#/howto/pow-givers); большинство крупных майнеров используют собственные скрипты, которые дают много преимуществ по сравнению с `mytonctrl` в средах с несколькими майнинговыми машинами.

## <a id="hardware"></a>Оборудование для майнинга

Общий хэшрейт сети при добыче TON очень высок; майнерам нужны высокопроизводительные машины, если они хотят добиться успеха. Майнинг на обычных домашних компьютерах и ноутбуках бесполезен, и мы не советуем предпринимать такие попытки.

#### CPU

Современный процессор с поддержкой [Intel SHA Extension](https://en.wikipedia.org/wiki/Intel_SHA_extensions) является **обязательным**. Большинство майнеров используют машины AMD EPYC или Threadripper с не менее чем 32 ядрами и 64 потоками.

#### GPU

Да! Вы можете добывать TON с помощью GPU. Существует версия майнера PoW, способная использовать GPU как Nvidia, так и AMD; Вы можете найти код и инструкции по его использованию в репозитории [POW Miner GPU](https://github.com/tontechio/pow-miner-gpu/blob/main/crypto/util/pow-miner-howto.md).

Пока что для использования этой функции нужно быть технически подкованным, но мы работаем над более удобным решением.

#### Память

Почти весь процесс майнинга происходит в кэше L2 процессора. Это означает, что скорость и объем памяти не играют никакой роли в производительности майнинга. Двойная система AMD EPYC с одним модулем DIMM на одном канале памяти будет майнить так же быстро, как и система с 16 модулями DIMM, занимающими все каналы.

Обратите внимание, что это относится **только** к простому процессу майнинга. Если на Вашей машине также запущен полный узел или другие процессы, то все изменится! Но это выходит за рамки данного руководства.

#### Хранение

Майнер, работающий в режиме lite, использует минимальное пространство для хранения данных и не хранит их.

#### Сеть

Простому майнеру необходима возможность открывать исходящие соединения с Интернетом.

#### FPGA / ASIC

Смотрите [могу ли я использовать FPGA / ASIC?](/v3/documentation/archive/mining#can-i-use-my-btceth-rig-to-mine-ton)

### <a id="hardware-cloud"></a>Облачные машины

Многие люди занимаются майнингом, используя облачные машины AWS или Google. Как указано в спецификациях выше, что действительно важно, так это процессор. Поэтому мы советуем использовать инстансы AWS [c5a.24xlarge](https://aws.amazon.com/ec2/instance-types/c5/) или Google [n2d-highcpu-224](https://cloud.google.com/compute/vm-instance-pricing).

### <a id="hardware-estimates"></a>Оценка доходов

Формула для расчета дохода довольно проста: `($total_bleed / $total_hashrate) * $your_hashrate`. Это даст Вам **текущую** оценку. Вы можете узнать переменные на [ton.org/mining](https://ton.org/mining) или воспользоваться калькулятором предполагаемого дохода от добычи (команда `emi`) в `mytonctrl`. Вот пример расчета, выполненного 7 августа 2021 года на процессоре i5-11400F:

```
Mining income estimations
-----------------------------------------------------------------
Total network 24h earnings:         171635.79 TON
Average network 24h hashrate:       805276100000 HPS
Your machine hashrate:              68465900 HPS
Est. 24h chance to mine a block:    15%
Est. monthly income:                437.7 TON
```

**Важно**: Пожалуйста, обратите внимание, что предоставленная информация основана на *сетевом хэшрейте на момент выполнения*. Ваш реальный доход со временем будет зависеть от многих факторов, таких как изменение хэшрейта сети, выбор дарителя и доля везения.

## <a id="faq"></a>ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ

### <a id="faq-general"></a>Общие сведения

#### <a id="faq-general-posorpow"></a>Является ли сеть TON PoS или PoW?

Блокчейн TON работает на основе консенсуса Proof-of-Stake (PoS). Для создания новых блоков не требуется майнинг.

#### <a id="faq-general-pow"></a>Так как же получилось, что TON - это Proof-of-Work?

Причина в том, что первоначальная эмиссия в 5 миллиардов Тонкоинов была передана специальным смарт-контрактам Proof-of-Work Giver.
Для получения Тонкоинов из этого смарт-контракта используется майнинг.

#### <a id="faq-general-supply"></a>Сколько монет осталось для добычи?

Самая актуальная информация доступна на сайте [ton.org/mining](https://ton.org/mining), см. графики `bleed`. Контракты PoW Giver имеют свой предел и иссякнут, как только пользователи добывают все доступные Toncoin.

#### <a id="faq-general-mined"></a>Сколько монет уже добыто?

По состоянию на август 2021 года было добыто около 4,9 млрд Toncoin.

#### <a id="faq-general-whomined"></a>Кто добыл эти монеты?

Монеты были добыты на более чем 70 000 кошельков. Владельцы этих кошельков остаются неизвестными.

#### <a id="faq-general-elite"></a>Трудно ли начать майнинг?

Вовсе нет. Все, что Вам нужно, это [соответствующее оборудование](#hardware) и следовать шагам, описанным в разделе [быстрый старт](#quick-start).

#### <a id="faq-general-pissed"></a>Есть ли другой способ майнинга?

Да, существует стороннее приложение - [TON Miner Bot](https://t.me/TonMinerBot).

#### <a id="faq-general-stats"></a>Где я могу посмотреть статистику добычи?

[ton.org/mining](https://ton.org/mining)

#### <a id="faq-general-howmany"></a>Сколько человек занимается добычей?

Мы не можем этого сказать. Все, что нам известно, - это общий хэшрейт всех майнеров в сети. Однако на [ton.org/mining](https://ton.org/mining) есть графики, которые пытаются оценить количество машин определенного типа, необходимое для получения приблизительного общего хэшрейта.

#### <a id="faq-general-noincome"></a>Нужен ли мне Toncoin, чтобы начать добычу?

Нет, это не так. Любой может начать добычу, не владея ни одним Toncoin.

#### <a id="faq-mining-noincome"></a>Почему баланс моего кошелька не увеличивается даже после нескольких часов добычи?

TON добываются блоками по 100 штук, Вы либо угадываете блок и получаете 100 TON, либо не получаете ничего. Пожалуйста, ознакомьтесь с [basics](#basics).

#### <a id="faq-mining-noblocks"></a>Я занимаюсь добычей уже несколько дней и не вижу никаких результатов, почему?

Проверяли ли Вы свои текущие [Оценки дохода] (/v3/documentation/archive/mining#income-estimates)? Если поле `Est. 24h chance to mine a block` меньше 100%, то Вам нужно набраться терпения. Также обратите внимание, что 50% шанс добыть блок в течение 24 часов не означает, что Вы автоматически добываете его в течение 2 дней; 50% применяется к каждому дню отдельно.

#### <a id="faq-mining-pools"></a>Существуют ли пулы для майнинга?

Нет, на данный момент нет никаких реализаций майнинговых пулов, каждый майнит сам за себя.

#### <a id="faq-mining-giver"></a>Какого giver-а мне следует выбрать?

Не имеет значения, какого giver-а Вы выберете. Сложность имеет тенденцию колебаться на каждом giver-е, так что текущий самый простой giver на [ton.org/mining](https://ton.org/mining) может стать самым сложным в течение часа. То же самое относится и к противоположному направлению.

### <a id="faq-hw"></a>Оборудование

#### <a id="faq-hw-machine"></a>Всегда ли выигрывает более быстрая машина?

Нет, все майнеры идут разными путями, чтобы найти решение. Более быстрая машина повышает вероятность успеха, но это не гарантирует победу!

#### <a id="faq-hw-machine"></a>Какой доход будет приносить моя машина?

Пожалуйста, посмотрите [Оценки доходов](/v3/documentation/archive/mining#income-estimates).

#### <a id="faq-hw-asic"></a>Могу ли я использовать свою установку BTC/ETH для добычи TON?

Нет, TON использует единственный метод хеширования SHA256, который отличается от BTC, ETH и других. ASICS или FPGA, созданные для добычи других криптовалют, не помогут.

#### <a id="faq-hw-svsm"></a>Что лучше - одна быстрая машина или несколько медленных?

Это спорный вопрос. Смотрите: программное обеспечение майнера запускает потоки для каждого ядра системы, и каждое ядро получает свой набор ключей для обработки, поэтому если у Вас есть одна машина, способная выполнять 64 потока, и 4 машины, способные выполнять 16 потоков каждая, то они будут одинаково успешны при условии, что скорость каждого потока одинакова.

Однако в реальном мире процессоры с меньшим количеством ядер обычно имеют более высокую тактовую частоту, поэтому Вы, вероятно, добьетесь большего успеха при работе с несколькими машинами.

#### <a id="faq-hw-mc"></a>Если я запущу много машин, будут ли они объединены?

Нет, не будут. Каждая машина майнит сама по себе, но процесс поиска решения носит случайный характер: ни одна машина, даже ни один поток (см. выше), не пойдет по одному и тому же пути. Таким образом, их хэшрейты складываются в Вашу пользу без прямого сотрудничества.

#### <a id="faq-hw-CPU"></a>Можно ли добывать, используя процессоры ARM?

В зависимости от процессора, инстансы AWS Graviton2 действительно являются очень способными майнерами и способны выдержать соотношение цена/производительность наравне с инстансами на базе AMD EPYC.

### <a id="faq-software"></a>Программное обеспечение

#### <a id="faq-software-os"></a>Могу ли я добывать, используя Windows/xBSD/другую ОС?

Разумеется, [исходный код TON](https://github.com/ton-blockchain/ton) уже собирался под Windows, xBSD и другие ОС. Однако удобной автоматизированной установки, как под Linux с `mytonctrl`, не существует. Вам придется устанавливать программу вручную и создавать собственные скрипты. Для FreeBSD существует исходник [port](https://github.com/sonofmom/freebsd_ton_port), который позволяет быстро установить программу.

#### <a id="faq-software-node1"></a>Станет ли моя добыча быстрее, если я запущу mytonctrl в режиме full node?

Сам по себе процесс вычислений не станет быстрее, но Вы получите некоторую стабильность и, самое главное, гибкость, если будете управлять собственным сервером full node/lite.

#### <a id="faq-software-node2"></a>Что мне нужно / как я могу управлять full node?

Это выходит за рамки данного руководства, пожалуйста, обратитесь к [Full node howto](https://ton.org/#/howto/full-node) и/или [mytonctrl instructions](https://github.com/igroman787/mytonctrl).

#### <a id="faq-software-build"></a>Можете ли Вы помочь мне создать программное обеспечение на моей ОС?

Это выходит за рамки данного руководства, пожалуйста, обратитесь к [Full node howto](https://ton.org/#/howto/full-node), а также к [Mytonctrl installation scripts](https://github.com/igroman787/mytonctrl/blob/master/scripts/toninstaller.sh#L44) за информацией о зависимостях и процессе.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/archive/pow-givers.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/archive/pow-givers.md
================================================
# POW Givers

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::warning устаревшее
Эта информация может быть устаревшей и больше не актуальной. Вы можете пропустить ее.
:::

Цель этого текста - описать, как взаимодействовать со смарт-контрактами Proof-of-Work Giver для получения Toncoin. Мы предполагаем знакомство с TON Blockchain Lite Client, как объясняется в разделе `Начать работу`, и с процедурой, необходимой для компиляции Lite Client и другого программного обеспечения. Для получения большего количества Toncoin, необходимого для запуска валидатора, мы также предполагаем знакомство со страницами `Full Node` и `Валидатор`. Вам также понадобится выделенный сервер, достаточно мощный для запуска Full Node, чтобы получить большую сумму Toncoin. Получение небольших сумм Тонкоинов не требует выделенного сервера и может быть выполнено за несколько минут на домашнем компьютере.

> Обратите внимание, что на данный момент для любой добычи требуются большие ресурсы из-за большого количества майнеров.

## 1. Смарт-контракты Proof-of-Work Giver

Чтобы предотвратить сбор всех Toncoin небольшим количеством злоумышленников, в мастерчейн сети был внедрен специальный вид смарт-контракта "Proof-of-Work Giver". Адреса этих смарт-контрактов следующие:

Небольшие giver-ы (доставляют от 10 до 100 Toncoin каждые несколько минут):

- kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN
- kf8SYc83pm5JkGt0p3TQRkuiM58O9Cr3waUtR9OoFq716lN-
- kf-FV4QTxLl-7Ct3E6MqOtMt-RGXMxi27g4I645lw6MTWraV
- kf_NSzfDJI1A3rOM0GQm7xsoUXHTgmdhN5-OrGD8uwL2JMvQ
- kf8gf1PQy4u2kURl-Gz4LbS29eaN4sVdrVQkPO-JL80VhOe6
- kf8kO6K6Qh6YM4ddjRYYlvVAK7IgyW8Zet-4ZvNrVsmQ4EOF
- kf-P_TOdwcCh0AXHhBpICDMxStxHenWdLCDLNH5QcNpwMHJ8
- kf91o4NNTryJ-Cw3sDGt9OTiafmETdVFUMvylQdFPoOxIsLm
- kf9iWhwk9GwAXjtwKG-vN7rmXT3hLIT23RBY6KhVaynRrIK7
- kf8JfFUEJhhpRW80_jqD7zzQteH6EBHOzxiOhygRhBdt4z2N

Крупные giver-ы (доставляют 10,000 Toncoin минимум раз в день):

- kf8guqdIbY6kpMykR8WFeVGbZcP2iuBagXfnQuq0rGrxgE04
- kf9CxReRyaGj0vpSH0gRZkOAitm_yDHvgiMGtmvG-ZTirrMC
- kf-WXA4CX4lqyVlN4qItlQSWPFIy00NvO2BAydgC4CTeIUme
- kf8yF4oXfIj7BZgkqXM6VsmDEgCqWVSKECO1pC0LXWl399Vx
- kf9nNY69S3_heBBSUtpHRhIzjjqY0ChugeqbWcQGtGj-gQxO
- kf_wUXx-l1Ehw0kfQRgFtWKO07B6WhSqcUQZNyh4Jmj8R4zL
- kf_6keW5RniwNQYeq3DNWGcohKOwI85p-V2MsPk4v23tyO3I
- kf_NSPpF4ZQ7mrPylwk-8XQQ1qFD5evLnx5_oZVNywzOjSfh
- kf-uNWj4JmTJefr7IfjBSYQhFbd3JqtQ6cxuNIsJqDQ8SiEA
- kf8mO4l6ZB_eaMn1OqjLRrrkiBcSt7kYTvJC_dzJLdpEDKxn

> Обратите внимание, что в данный момент все крупные giver-ы исчерпаны.

Первые десять смарт-контрактов позволяют пользователю, желающему получить небольшое количество Toncoin, получить его, не затрачивая много вычислительной мощности (обычно достаточно нескольких минут работы на домашнем компьютере). Остальные смарт-контракты предназначены для получения более крупных сумм Toncoin, необходимых для работы валидатора в сети; как правило, для получения необходимой суммы достаточно дня работы на выделенном сервере, достаточно мощном для работы валидатора.

> Обратите внимание, что, из-за большого количества майнеров, в настоящее время требуются много ресурсов для добычи мелких giver-ов.

Вы должны случайным образом выбрать один из таких смарт-контрактов "proof-of-work giver" (из одного из этих двух списков, в зависимости от Вашей цели) и получить Toncoin из этого смарт-контракта с помощью процедуры, похожей на майнинг. По сути, Вам необходимо отправить внешнее сообщение, содержащее доказательство работы и адрес Вашего кошелька, выбранному смарт-контракту "proof-of-work giver", после чего Вам будет отправлена необходимая сумма.

## 2. Процесс добычи

Чтобы создать внешнее сообщение, содержащее "proof-of-work", Вам необходимо запустить специальную утилиту для майнинга, скомпилированную из исходников TON, расположенных в репозитории GitHub. Утилита находится в файле `./crypto/pow-miner` относительно каталога сборки и может быть скомпилирована путем ввода команды `make pow-miner` в каталоге сборки.

Однако, прежде чем запускать `pow-miner`, Вам необходимо узнать фактические значения параметров `seed` и `complexity` выбранного смарт-контракта "proof-of-work giver". Это можно сделать, вызвав get-метод `get_pow_params` этого смарт-контракта. Например, если Вы используете смарт-контракт giver, `kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN`, Вы можете просто ввести:

```
> runmethod kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN get_pow_params
```

в консоли Lite Client и получить результат, подобный этому:

```...
    arguments:  [ 101616 ] 
    result:  [ 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 256 ] 
    remote result (not to be trusted):  [ 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 256 ]
```

Два первых больших числа в строке "result:" - это `seed` и `complexity` этого смарт-контракта. В этом примере семя - `229760179690128740373110445116482216837`, а сложность - `53919893334301279589334030174039261347274288845081144962207220498432`.

Затем вызовите утилиту `pow-miner` следующим образом:

```
$ crypto/pow-miner -vv -w<num-threads> -t<timeout-in-sec> <your-wallet-address> <seed> <complexity> <iterations> <pow-giver-address> <boc-filename>
```

Здесь:

- `<num-threads>` - это количество ядер процессора, которые Вы хотите использовать для майнинга.
- `<timeout-in-sec>` - это максимальное количество секунд, которое майнер будет работать, прежде чем признать неудачу.
- `<your-wallet-address>` - это адрес Вашего кошелька (возможно, еще не инициализированного). Он находится либо на мастерчейне, либо на воркчейне (обратите внимание, что для управления валидатором Вам нужен кошелек на мастерчейне).
- `<seed>` и `<complexity>` - это самые последние значения, полученные при выполнении метода get-method `get-pow-params`.
- `<pow-giver-address>` - это адрес выбранного смарт-контракта proof-of-work giver.
- `<boc-filename>` - это имя выходного файла, в котором в случае успеха будет сохранено внешнее сообщение с доказательством работы.

Например, если адрес Вашего кошелька - `kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7`, Вы можете выполнить следующее:

```
$ crypto/pow-miner -vv -w7 -t100 kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN mined.boc
```

Программа будет работать некоторое время (в данном случае не более 100 секунд) и либо завершится успешно (с нулевым кодом выхода) и сохранит требуемое доказательство работы в файл `mined.boc`, либо завершится с ненулевым кодом выхода, если доказательство работы не было найдено.

В случае неудачи Вы увидите нечто подобное:

```
   [ expected required hashes for success: 2147483648 ]
   [ hashes computed: 1192230912 ]
```

и программа завершится с ненулевым кодом выхода. Затем Вам нужно снова получить значения `seed` и `complexity` (поскольку они могли измениться за это время в результате обработки запросов от более успешных майнеров) и снова запустить `pow-miner` с новыми параметрами, повторяя процесс снова и снова до достижения успеха.

В случае успеха Вы увидите что-то вроде:

```
   [ expected required hashes for success: 2147483648 ]
   4D696E65005EFE49705690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1A1F533B3BC4F5664D6C743C1C5C74BB3342F3A7314364B3D0DA698E6C80C1EA4ACDA33755876665780BAE9BE8A4D6385A1F533B3BC4F5664D6C743C1C5C74BB3342F3A7314364B3D0DA698E6C80C1EA4
   Saving 176 bytes of serialized external message into file `mined.boc`
   [ hashes computed: 1122036095 ]
```

Затем Вы можете использовать Lite Client, чтобы отправить внешнее сообщение из файла `mined.boc` смарт-контракту proof-of-work giver (и Вы должны сделать это как можно скорее):

```
> sendfile mined.boc
... external message status is 1
```

Вы можете подождать несколько секунд и проверить состояние своего кошелька:

:::info
Пожалуйста, обратите внимание здесь и далее, что код, комментарии и/или документация могут содержать параметры, методы и определения, такие как "gtam", "nanogram" и т.д. Это наследие оригинального кода TON, разработанного в Telegram. Криптовалюта Gram никогда не выпускалась. Валютой TON является Toncoin, а валютой тестовой сети TON - Test Toncoin.
:::

```
> last
> getaccount kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7
...
account state is (account
  addr:(addr_std
    anycast:nothing workchain_id:0 address:x5690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1)
  storage_stat:(storage_info
    used:(storage_used
      cells:(var_uint len:1 value:1)
      bits:(var_uint len:1 value:111)
      public_cells:(var_uint len:0 value:0)) last_paid:1593722498
    due_payment:nothing)
  storage:(account_storage last_trans_lt:7720869000002
    balance:(currencies
      grams:(nanograms
        amount:(var_uint len:5 value:100000000000))
      other:(extra_currencies
        dict:hme_empty))
    state:account_uninit))
x{C005690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F12025BC2F7F2341000001C169E9DCD0945D21DBA0004_}
last transaction lt = 7720869000001 hash = 83C15CDED025970FEF7521206E82D2396B462AADB962C7E1F4283D88A0FAB7D4
account balance is 100000000000ng
```

Если до Вас никто не прислал действительное доказательство работы с такими `seed` и `complexity`, proof-of-work giver примет Ваше доказательство работы, и это будет отражено в балансе Вашего кошелька (после отправки внешнего сообщения может пройти 10 или 20 секунд, прежде чем это произойдет; обязательно сделайте несколько попыток и каждый раз набирайте `last`, прежде чем проверять баланс Вашего кошелька, чтобы обновить состояние Lite Client). В случае успеха Вы увидите, что баланс был увеличен (и даже то, что Ваш кошелек был создан в неинициализированном состоянии, если он не существовал ранее). В случае неудачи Вам придется получить новые значения `seed` и `complexity` и повторить процесс добычи с самого начала.

Если Вам повезло, и баланс Вашего кошелька увеличился, возможно, Вы захотите инициализировать кошелек, если он не был инициализирован ранее (более подробную информацию о создании кошелька Вы найдете в разделе `Пошаговая инструкция`):

```
> sendfile new-wallet-query.boc
... external message status is 1
> last
> getaccount kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7
...
account state is (account
  addr:(addr_std
    anycast:nothing workchain_id:0 address:x5690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1)
  storage_stat:(storage_info
    used:(storage_used
      cells:(var_uint len:1 value:3)
      bits:(var_uint len:2 value:1147)
      public_cells:(var_uint len:0 value:0)) last_paid:1593722691
    due_payment:nothing)
  storage:(account_storage last_trans_lt:7720945000002
    balance:(currencies
      grams:(nanograms
        amount:(var_uint len:5 value:99995640998))
      other:(extra_currencies
        dict:hme_empty))
    state:(account_active
      (
        split_depth:nothing
        special:nothing
        code:(just
          value:(raw@^Cell 
            x{}
             x{FF0020DD2082014C97BA218201339CBAB19C71B0ED44D0D31FD70BFFE304E0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54}
            ))
        data:(just
          value:(raw@^Cell 
            x{}
             x{00000001CE6A50A6E9467C32671667F8C00C5086FC8D62E5645652BED7A80DF634487715}
            ))
        library:hme_empty))))
x{C005690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1206811EC2F7F23A1800001C16B0BC790945D20D1929934_}
 x{FF0020DD2082014C97BA218201339CBAB19C71B0ED44D0D31FD70BFFE304E0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54}
 x{00000001CE6A50A6E9467C32671667F8C00C5086FC8D62E5645652BED7A80DF634487715}
last transaction lt = 7720945000001 hash = 73353151859661AB0202EA5D92FF409747F201D10F1E52BD0CBB93E1201676BF
account balance is 99995640998ng
```

Теперь Вы счастливый обладатель 100 Toncoin. Поздравляем!

## 3. Автоматизация процесса добычи в случае неудачи

Если Вам долгое время не удается получить Toncoin, это может произойти потому, что слишком много других пользователей одновременно занимаются добычей на одном и том же смарт-контракте proof-of-work giver. Возможно, Вам следует выбрать другой смарт-контракт proof-of-work giver из списка, приведенного выше. В качестве альтернативы Вы можете написать простой скрипт, который будет автоматически запускать `pow-miner` с правильными параметрами снова и снова до достижения успеха (определяется проверкой кода завершения работы `pow-miner`) и вызывать Lite Client с параметром `-c 'sendfile mined.boc'` для отправки внешнего сообщения сразу после его обнаружения.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/archive/precompiled-binaries.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/archive/precompiled-binaries.md
================================================
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/button'

# Предварительно скомпилированные бинарные файлы

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::caution важно
С Blueprint SDK вам больше не нужно вручную устанавливать бинарные файлы.
:::

Все бинарные файлы для разработки и тестирования предоставляются вместе с Blueprint SDK.

<Button href="/v3/documentation/smart-contracts/getting-started/javascript"
colorType="primary" sizeType={'sm'}>

Переход на Blueprint SDK

</Button>

## Предварительно скомпилированные бинарные файлы

Если вы не используете Blueprint SDK для разработки смарт-контрактов, вы можете использовать предварительно скомпилированные бинарные файлы, соответствующие вашей операционной системе и выбранным инструментам.

### Необходимые компоненты

Для локальной разработки смарт-контрактов TON *без Javascript*, необходимо подготовить бинарные файлы `func`, `fift` и `lite client` на вашем устройстве.

Вы можете скачать и настроить их ниже или изучить эту статью от TON Society:

- [Настройка среды разработки TON](https://blog.ton.org/setting-up-a-ton-development-environment)

### 1. Загрузка

Скачайте бинарные файлы из таблицы ниже. Убедитесь, что выбрали правильную версию для вашей операционной системы и установили все дополнительные зависимости:

| ОС                                 | Бинарные файлы TON                                                                             | fift                                                                                        | func                                                                                        | lite-client                                                                                        | Дополнительные зависимости                                                                                      |
| ---------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| MacOS x86-64                       | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/ton-mac-x86-64.zip)   | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/fift-mac-x86-64)   | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/func-mac-x86-64)   | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client-mac-x86-64)   |                                                                                                                 |
| MacOS arm64                        | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/ton-mac-arm64.zip)    |                                                                                             |                                                                                             |                                                                                                    | `brew install openssl ninja libmicrohttpd pkg-config`                                                           |
| Windows x86-64                     | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/ton-win-x86-64.zip)   | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/fift.exe)          | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/func.exe)          | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client.exe)          | Установите [OpenSSL 1.1.1](/ton-binaries/windows/Win64OpenSSL_Light-1_1_1q.msi) |
| Linux  x86_64 | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/ton-linux-x86_64.zip) | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/fift-linux-x86_64) | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/func-linux-x86_64) | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client-linux-x86_64) |                                                                                                                 |
| Linux  arm64                       | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/ton-linux-arm64.zip)  |                                                                                             |                                                                                             |                                                                                                    | `sudo apt install libatomic1 libssl-dev`                                                                        |

### 2. Настройка бинарных файлов

export const Highlight = ({children, color}) => (
<span
style={{
backgroundColor: color,
borderRadius: '2px',
color: '#fff',
padding: '0.2rem',
}}>
{children} </span>
);

<Tabs groupId="operating-systems">
  <TabItem value="win" label="Windows">

1. После загрузки необходимо `создать` новую папку. Например: **`C:/Users/%USERNAME%/ton/bin`** и переместить туда установленные файлы.

2. Чтобы открыть переменные среды Windows, нажмите клавиши <Highlight color="#1877F2">Win + R</Highlight> на клавиатуре, введите `sysdm.cpl` и нажмите Enter.

3. На вкладке "*Advanced*" нажмите кнопку <Highlight color="#1877F2">"Environment Variables..."</Highlight>.

4. В разделе *"User variables"* выберите переменную "*Path*" и нажмите <Highlight color="#1877F2">"Edit"</Highlight> (это обычно необходимо).

5. Чтобы добавить новое значение `(path)` к системной переменной в следующем окне, нажмите кнопку <Highlight color="#1877F2">"New"</Highlight>.
  В новом поле необходимо указать путь к папке, где хранятся ранее установленные файлы:

```
C:\Users\%USERNAME%\ton\bin\
```

6. Чтобы проверить, все ли было установлено правильно, запустите в терминале (*cmd.exe*):

```bash
fift -V -and func -V -and lite-client -V
```

7. Если вы планируете использовать fift, вам понадобиться переменная среды `FIFTPATH` с необходимыми импортами:

  1. Скачайте [fiftlib.zip](/ton-binaries/windows/fiftlib.zip)
  2. Распакуйте архив в какую-либо директорию на вашем компьютере (например, **`C:/Users/%USERNAME%/ton/lib/fiftlib`**)
  3. Создайте новую (нажмите кнопку <Highlight color="#1877F2">"New"</Highlight>) переменную среды `FIFTPATH` в разделе "*User variables*".
  4. В поле "*Variable value*" укажите путь к файлам: **`/%USERNAME%/ton/lib/fiftlib`** и нажмите <Highlight color="#1877F2">OK</Highlight>. Готово.

:::caution важно
Вместо `%USERNAME%` вам нужно вставить свой `username`.\
:::

</TabItem>
<TabItem value="mac" label="Linux / MacOS">

1. После загрузки убедитесь, что загруженные бинарные файлы могут быть выполнены, изменив их разрешения.

```bash
chmod +x func
chmod +x fift
chmod +x lite-client
```

2. Также полезно добавить эти бинарные файлы в путь (или скопировать их в `/usr/local/bin`), чтобы вы могли запускать их из любой директории.

```bash
cp ./func /usr/local/bin/func
cp ./fift /usr/local/bin/fift
cp ./lite-client /usr/local/bin/lite-client
```

3. Чтобы убедиться, что всё установлено правильно, выполните следующую команду в терминале.

```bash
fift -V && func -V && lite-client -V
```

4. Если вы планируете `использовать fift`, скачайте также [fiftlib.zip](/ton-binaries/windows/fiftlib.zip), распакуйте архив в директорию на вашем устройстве (например, `/usr/local/lib/fiftlib`) и задайте переменную среды `FIFTPATH`, указывающую на эту директорию.

```
unzip fiftlib.zip
mkdir -p /usr/local/lib/fiftlib
cp fiftlib/* /usr/local/lib/fiftlib
```

:::info Вы почти закончили :)
Не забудьте задать [переменную среды](https://stackoverflow.com/questions/14637979/how-to-permanently-set-path-on-linux-unix) `FIFTPATH`, указывающую на эту директорию.
:::

  </TabItem>
</Tabs>

## Сборка из исходного кода

Если вы не хотите использовать предварительно скомпилированные бинарные файлы и предпочитаете собрать их самостоятельно, следуйте [официальным инструкциям](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions).

Ниже приведены основные инструкции, готовые к использованию:

### Linux (Ubuntu / Debian)

```bash
sudo apt update
sudo apt install git make cmake g++ libssl-dev zlib1g-dev wget
cd ~ && git clone https://github.com/ton-blockchain/ton.git
cd ~/ton && git submodule update --init
mkdir ~/ton/build && cd ~/ton/build && cmake .. -DCMAKE_BUILD_TYPE=Release && make -j 4
```

## Другие источники для бинарных файлов

Основная команда предоставляет автоматические сборки для нескольких операционных систем через [GitHub Actions](https://github.com/ton-blockchain/ton/releases/latest).

Перейдите по указанной выше ссылке, выберите слева рабочий процесс, соответствующий вашей операционной системе, нажмите на последнее успешное выполнение (зелёная отметка), и скачайте `ton-binaries` в разделе "Artifacts".



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/archive/tg-bot-integration-py.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/archive/tg-bot-integration-py.md
================================================
import Button from '@site/src/components/button'

# TON Connect для Telegram ботов - Python

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::warning устаревшее
В этом руководстве описан устаревший метод интеграции TON Connect с ботами Telegram. Для более безопасного и актуального способа рекомендуется использовать [Telegram Mini Apps](/v3/guidelines/dapps/tma/overview для более современной и безопасной интеграции.
:::

В этом руководтсве мы создадим пример telegram-бота, поддерживающего аутентификацию через TON Connect 2.0 с использованием Python TON Connect SDK [pytonconnect](https://github.com/XaBbl4/pytonconnect).
Мы рассмотрим подключение кошелька, отправку транзакции, получение данных о подключенном кошельке и отключение кошелька.

<Button href="https://t.me/test_tonconnect_bot" colorType={'primary'} sizeType={'sm'}>

Открыть демо-бот

</Button>

<Button href="https://github.com/yungwine/ton-connect-bot" colorType={'secondary'} sizeType={'sm'}>

Ознакомиться с GitHub

</Button>

## Подготовка

### Установка библиотек

Для создания бота мы будем использовать библиотеку Python `aiogram` версии 3.0.
Для начала интеграции TON Connect в ваш Telegram-бот необходимо установить пакет `pytonconnect`.
А для использования примитивов TON и парсинга адреса пользователя нам понадобится `pytoniq-core`.
Для этого вы можете использовать pip:

```bash
pip install aiogram pytoniq-core python-dotenv
pip install pytonconnect
```

### Настройка конфигурации

Укажите в файле `.env` [токен бота](https://t.me/BotFather) и ссылку на [файл манифеста](https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest) TON Connect. Затем загрузите их в `config.py`:

```dotenv
# .env

TOKEN='1111111111:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'  # your bot token here
MANIFEST_URL='https://raw.githubusercontent.com/XaBbl4/pytonconnect/main/pytonconnect-manifest.json'
```

```python
# config.py

from os import environ as env

from dotenv import load_dotenv
load_dotenv()

TOKEN = env['TOKEN']
MANIFEST_URL = env['MANIFEST_URL']
```

## Создание простого бота

Создайте файл `main.py`, который будет содержать основной код бота:

```python
# main.py

import sys
import logging
import asyncio

import config

from aiogram import Bot, Dispatcher, F
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, CallbackQuery


logger = logging.getLogger(__file__)

dp = Dispatcher()
bot = Bot(config.TOKEN, parse_mode=ParseMode.HTML)
    

@dp.message(CommandStart())
async def command_start_handler(message: Message):
    await message.answer(text='Hi!')

async def main() -> None:
    await bot.delete_webhook(drop_pending_updates=True)  # skip_updates = True
    await dp.start_polling(bot)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())

```

## Подключение кошелька

### Хранилище TON Connect

Давайте создадим простое хранилище для TON Connect

```python
# tc_storage.py

from pytonconnect.storage import IStorage, DefaultStorage


storage = {}


class TcStorage(IStorage):

    def __init__(self, chat_id: int):
        self.chat_id = chat_id

    def _get_key(self, key: str):
        return str(self.chat_id) + key

    async def set_item(self, key: str, value: str):
        storage[self._get_key(key)] = value

    async def get_item(self, key: str, default_value: str = None):
        return storage.get(self._get_key(key), default_value)

    async def remove_item(self, key: str):
        storage.pop(self._get_key(key))

```

### Обработчик подключения

Во-первых, нам нужна функция, которая возвращает разные экземпляры для каждого пользователя:

```python
# connector.py

from pytonconnect import TonConnect

import config
from tc_storage import TcStorage


def get_connector(chat_id: int):
    return TonConnect(config.MANIFEST_URL, storage=TcStorage(chat_id))

```

Во-вторых, давайте добавим обработчик подключения в `command_start_handler()`:

```python
# main.py

@dp.message(CommandStart())
async def command_start_handler(message: Message):
    chat_id = message.chat.id
    connector = get_connector(chat_id)
    connected = await connector.restore_connection()

    mk_b = InlineKeyboardBuilder()
    if connected:
        mk_b.button(text='Send Transaction', callback_data='send_tr')
        mk_b.button(text='Disconnect', callback_data='disconnect')
        await message.answer(text='You are already connected!', reply_markup=mk_b.as_markup())
    else:
        wallets_list = TonConnect.get_wallets()
        for wallet in wallets_list:
            mk_b.button(text=wallet['name'], callback_data=f'connect:{wallet["name"]}')
        mk_b.adjust(1, )
        await message.answer(text='Choose wallet to connect', reply_markup=mk_b.as_markup())

```

Теперь, если пользователь еще не подключил кошелек, бот отправляет сообщение с кнопками для всех доступных кошельков.
Поэтому нам нужно написать функцию для обработки обратных вызовов `connect:{wallet["name"]}`:

```python
# main.py

async def connect_wallet(message: Message, wallet_name: str):
    connector = get_connector(message.chat.id)

    wallets_list = connector.get_wallets()
    wallet = None

    for w in wallets_list:
        if w['name'] == wallet_name:
            wallet = w

    if wallet is None:
        raise Exception(f'Unknown wallet: {wallet_name}')

    generated_url = await connector.connect(wallet)

    mk_b = InlineKeyboardBuilder()
    mk_b.button(text='Connect', url=generated_url)

    await message.answer(text='Connect wallet within 3 minutes', reply_markup=mk_b.as_markup())

    mk_b = InlineKeyboardBuilder()
    mk_b.button(text='Start', callback_data='start')

    for i in range(1, 180):
        await asyncio.sleep(1)
        if connector.connected:
            if connector.account.address:
                wallet_address = connector.account.address
                wallet_address = Address(wallet_address).to_str(is_bounceable=False)
                await message.answer(f'You are connected with address <code>{wallet_address}</code>', reply_markup=mk_b.as_markup())
                logger.info(f'Connected with address: {wallet_address}')
            return

    await message.answer(f'Timeout error!', reply_markup=mk_b.as_markup())


@dp.callback_query(lambda call: True)
async def main_callback_handler(call: CallbackQuery):
    await call.answer()
    message = call.message
    data = call.data
    if data == "start":
        await command_start_handler(message)
    elif data == "send_tr":
        await send_transaction(message)
    elif data == 'disconnect':
        await disconnect_wallet(message)
    else:
        data = data.split(':')
        if data[0] == 'connect':
            await connect_wallet(message, data[1])
```

Бот предоставляет пользователю 3 минуты для подключения кошелька, после чего сообщает об ошибке тайм-аута.

## Реализация запроса транзакции

Давайте рассмотрим один из примеров из статьи ["Подготовка сообщений"](/v3/guidelines/ton-connect/guidelines/preparing-messages):

```python
# messages.py

from base64 import urlsafe_b64encode

from pytoniq_core import begin_cell


def get_comment_message(destination_address: str, amount: int, comment: str) -> dict:

    data = {
        'address': destination_address,
        'amount': str(amount),
        'payload': urlsafe_b64encode(
            begin_cell()
            .store_uint(0, 32)  # op code for comment message
            .store_string(comment)  # store comment
            .end_cell()  # end cell
            .to_boc()  # convert it to boc
        )
        .decode()  # encode it to urlsafe base64
    }

    return data

```

И добавим функцию `send_transaction()` в файл `main.py`:

```python
# main.py

@dp.message(Command('transaction'))
async def send_transaction(message: Message):
    connector = get_connector(message.chat.id)
    connected = await connector.restore_connection()
    if not connected:
        await message.answer('Connect wallet first!')
        return
    
    transaction = {
        'valid_until': int(time.time() + 3600),
        'messages': [
            get_comment_message(
                destination_address='0:0000000000000000000000000000000000000000000000000000000000000000',
                amount=int(0.01 * 10 ** 9),
                comment='hello world!'
            )
        ]
    }

    await message.answer(text='Approve transaction in your wallet app!')
    await connector.send_transaction(
        transaction=transaction
    )
```

Но мы также должны обработать возможные ошибки, поэтому обернем метод `send_transaction` в выражение `try - except`:

```python
@dp.message(Command('transaction'))
async def send_transaction(message: Message):
    ...
    await message.answer(text='Approve transaction in your wallet app!')
    try:
        await asyncio.wait_for(connector.send_transaction(
            transaction=transaction
        ), 300)
    except asyncio.TimeoutError:
        await message.answer(text='Timeout error!')
    except pytonconnect.exceptions.UserRejectsError:
        await message.answer(text='You rejected the transaction!')
    except Exception as e:
        await message.answer(text=f'Unknown error: {e}')
```

## Добавление обработчика отключения

Реализация этой функции достаточно проста:

```python
async def disconnect_wallet(message: Message):
    connector = get_connector(message.chat.id)
    await connector.restore_connection()
    await connector.disconnect()
    await message.answer('You have been successfully disconnected!')
```

На данный момент проект имеет следующую структуру:

```bash
.
.env
├── config.py
├── connector.py
├── main.py
├── messages.py
└── tc_storage.py
```

А `main.py` выглядит следующим образом:

<details>
<summary>Показать main.py</summary>

```python
# main.py

import sys
import logging
import asyncio
import time

import pytonconnect.exceptions
from pytoniq_core import Address
from pytonconnect import TonConnect

import config
from messages import get_comment_message
from connector import get_connector

from aiogram import Bot, Dispatcher, F
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, CallbackQuery
from aiogram.utils.keyboard import InlineKeyboardBuilder


logger = logging.getLogger(__file__)

dp = Dispatcher()
bot = Bot(config.TOKEN, parse_mode=ParseMode.HTML)


@dp.message(CommandStart())
async def command_start_handler(message: Message):
    chat_id = message.chat.id
    connector = get_connector(chat_id)
    connected = await connector.restore_connection()

    mk_b = InlineKeyboardBuilder()
    if connected:
        mk_b.button(text='Send Transaction', callback_data='send_tr')
        mk_b.button(text='Disconnect', callback_data='disconnect')
        await message.answer(text='You are already connected!', reply_markup=mk_b.as_markup())

    else:
        wallets_list = TonConnect.get_wallets()
        for wallet in wallets_list:
            mk_b.button(text=wallet['name'], callback_data=f'connect:{wallet["name"]}')
        mk_b.adjust(1, )
        await message.answer(text='Choose wallet to connect', reply_markup=mk_b.as_markup())


@dp.message(Command('transaction'))
async def send_transaction(message: Message):
    connector = get_connector(message.chat.id)
    connected = await connector.restore_connection()
    if not connected:
        await message.answer('Connect wallet first!')
        return

    transaction = {
        'valid_until': int(time.time() + 3600),
        'messages': [
            get_comment_message(
                destination_address='0:0000000000000000000000000000000000000000000000000000000000000000',
                amount=int(0.01 * 10 ** 9),
                comment='hello world!'
            )
        ]
    }

    await message.answer(text='Approve transaction in your wallet app!')
    try:
        await asyncio.wait_for(connector.send_transaction(
            transaction=transaction
        ), 300)
    except asyncio.TimeoutError:
        await message.answer(text='Timeout error!')
    except pytonconnect.exceptions.UserRejectsError:
        await message.answer(text='You rejected the transaction!')
    except Exception as e:
        await message.answer(text=f'Unknown error: {e}')


async def connect_wallet(message: Message, wallet_name: str):
    connector = get_connector(message.chat.id)

    wallets_list = connector.get_wallets()
    wallet = None

    for w in wallets_list:
        if w['name'] == wallet_name:
            wallet = w

    if wallet is None:
        raise Exception(f'Unknown wallet: {wallet_name}')

    generated_url = await connector.connect(wallet)

    mk_b = InlineKeyboardBuilder()
    mk_b.button(text='Connect', url=generated_url)

    await message.answer(text='Connect wallet within 3 minutes', reply_markup=mk_b.as_markup())

    mk_b = InlineKeyboardBuilder()
    mk_b.button(text='Start', callback_data='start')

    for i in range(1, 180):
        await asyncio.sleep(1)
        if connector.connected:
            if connector.account.address:
                wallet_address = connector.account.address
                wallet_address = Address(wallet_address).to_str(is_bounceable=False)
                await message.answer(f'You are connected with address <code>{wallet_address}</code>', reply_markup=mk_b.as_markup())
                logger.info(f'Connected with address: {wallet_address}')
            return

    await message.answer(f'Timeout error!', reply_markup=mk_b.as_markup())


async def disconnect_wallet(message: Message):
    connector = get_connector(message.chat.id)
    await connector.restore_connection()
    await connector.disconnect()
    await message.answer('You have been successfully disconnected!')


@dp.callback_query(lambda call: True)
async def main_callback_handler(call: CallbackQuery):
    await call.answer()
    message = call.message
    data = call.data
    if data == "start":
        await command_start_handler(message)
    elif data == "send_tr":
        await send_transaction(message)
    elif data == 'disconnect':
        await disconnect_wallet(message)
    else:
        data = data.split(':')
        if data[0] == 'connect':
            await connect_wallet(message, data[1])


async def main() -> None:
    await bot.delete_webhook(drop_pending_updates=True)  # skip_updates = True
    await dp.start_polling(bot)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())

```

</details>

## Улучшение

### Добавление постоянного хранилища - Redis

В настоящее время наше хранилище TON Connect использует dict, что приводит к потере сессий после перезапуска бота.
Давайте добавим постоянное хранилище базы данных с помощью Redis:

После запуска базы данных Redis установите библиотеку Python для взаимодействия с ней:

```bash
pip install redis
```

И обновите класс `TcStorage` в `tc_storage.py`:

```python
import redis.asyncio as redis

client = redis.Redis(host='localhost', port=6379)


class TcStorage(IStorage):

    def __init__(self, chat_id: int):
        self.chat_id = chat_id

    def _get_key(self, key: str):
        return str(self.chat_id) + key

    async def set_item(self, key: str, value: str):
        await client.set(name=self._get_key(key), value=value)

    async def get_item(self, key: str, default_value: str = None):
        value = await client.get(name=self._get_key(key))
        return value.decode() if value else default_value

    async def remove_item(self, key: str):
        await client.delete(self._get_key(key))
```

### Добавление QR-кода

Установите пакет python `qrcode` для их генерации:

```bash
pip install qrcode
```

Измените функцию `connect_wallet()` так, чтобы она генерировала QR-код и отправляла его в виде фотографии пользователю:

```python
from io import BytesIO
import qrcode
from aiogram.types import BufferedInputFile


async def connect_wallet(message: Message, wallet_name: str):
    ...
    
    img = qrcode.make(generated_url)
    stream = BytesIO()
    img.save(stream)
    file = BufferedInputFile(file=stream.getvalue(), filename='qrcode')

    await message.answer_photo(photo=file, caption='Connect wallet within 3 minutes', reply_markup=mk_b.as_markup())
    
    ...
```

## Краткие сведения

Что дальше?

- Вы можете улучшить обработку ошибок в боте.
- Вы можете добавить приветственное сообщение и, например, команду `/connect_wallet`.

## См. также

- [Полный код бота](https://github.com/yungwine/ton-connect-bot)
- [Подготовка сообщений](/v3/guidelines/ton-connect/guidelines/preparing-messages)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/archive/tg-bot-integration.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/archive/tg-bot-integration.mdx
================================================
import Button from '@site/src/components/button'

# TON Connect для Telegram ботов

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::warning устаревшее
В этом руководстве описан устаревший метод интеграции TON Connect с ботами Telegram. Для более безопасного и актуального способа рекомендуется использовать [Telegram Mini Apps](/v3/guidelines/dapps/tma/overview для более современной и безопасной интеграции.
:::

В этом руководстве мы создадим пример Telegram-бота с использованием JavaScript TON Connect SDK, поддерживающего аутентификацию TON Connect 2.0. Мы рассмотрим подключение кошельков, отправку транзакций, получение информации о кошельках и отключение кошельков.

<Button href="https://t.me/ton_connect_example_bot" colorType={'primary'} sizeType={'sm'}>

Открыть демо-бот

</Button>

<Button href="https://github.com/ton-connect/demo-telegram-bot" colorType={'secondary'} sizeType={'sm'}>

Ознакомиться с GitHub

</Button>

## Ссылки на документацию

- [Документация TON Connect SDK] (https://www.npmjs.com/package/@tonconnect/sdk)

## Необходимые компоненты

- Вам нужно создать Telegram-бота с помощью [@BotFather](https://t.me/BotFather) и сохранить его токен.
- Необходимо установить Node JS (в этом руководстве используется версия 18.1.0).
- Необходимо установить Docker.

## Создание проекта

### Настройка зависимостей

Начнем с создания проекта Node.js. Мы будем использовать TypeScript и библиотеку [node-telegram-bot-api](https://www.npmjs.com/package/node-telegram-bot-api), хотя вы можете выбрать другую библиотеку по своему усмотрению. Также мы будем использовать библиотеку [qrcode](https://www.npmjs.com/package/qrcode) для генерации QR-кодов,  но вы можете заменить её любой другой аналогичной библиотекой.

Давайте создадим директорию `ton-connect-bot`. Добавьте в нее следующий файл package.json:

```json
{
  "name": "ton-connect-bot",
  "version": "1.0.0",
  "scripts": {
    "compile": "npx rimraf dist && tsc",
    "run": "node ./dist/main.js"
  },
  "dependencies": {
    "@tonconnect/sdk": "^3.0.0-beta.1",
    "dotenv": "^16.0.3",
    "node-telegram-bot-api": "^0.61.0",
    "qrcode": "^1.5.1"
  },
  "devDependencies": {
    "@types/node-telegram-bot-api": "^0.61.4",
    "@types/qrcode": "^1.5.0",
    "rimraf": "^3.0.2",
    "typescript": "^4.9.5"
  }
}
```

Запустите `npm i`, чтобы установить зависимости.

### Добавление файла tsconfig.json

Создайте файл `tsconfig.json`:

<details>
<summary>Код tsconfig.json</summary>

```json
{
  "compilerOptions": {
    "declaration": true,
    "lib": ["ESNext", "dom"],
    "resolveJsonModule": true,
    "experimentalDecorators": false,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "target": "es6",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "module": "commonjs",
    "moduleResolution": "node",
    "sourceMap": true,
    "useUnknownInCatchVariables": false,
    "noUncheckedIndexedAccess": true,
    "emitDecoratorMetadata": false,
    "importHelpers": false,
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "allowJs": true,
    "outDir": "./dist"
  },
  "include": ["src"],
  "exclude": [
    "./tests","node_modules", "lib", "types"]
}
```

</details>

[Подробнее о tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

### Добавление простого кода бота

Создайте файл `.env` и добавьте туда токен вашего бота, манифест DApp и список кошельков, которые будут кэшироваться в это время:

[Подробнее о tonconnect-manifes.json] (https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest)

```dotenv
# .env
TELEGRAM_BOT_TOKEN=<YOUR BOT TOKEN, E.G 1234567890:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA>
TELEGRAM_BOT_LINK=<YOUR TG BOT LINK HERE, E.G. https://t.me/ton_connect_example_bot>
MANIFEST_URL=https://raw.githubusercontent.com/ton-connect/demo-telegram-bot/master/tonconnect-manifest.json
WALLETS_LIST_CACHE_TTL_MS=86400000
```

Создайте директорию `src` и файл `bot.ts` внутри. Давайте создадим там экземпляр TelegramBot:

```ts
// src/bot.ts

import TelegramBot from 'node-telegram-bot-api';
import * as process from 'process';

const token = process.env.TELEGRAM_BOT_TOKEN!;

export const bot = new TelegramBot(token, { polling: true });
```

Теперь мы можем создать входной файл `main.ts` в директории `src`:

```ts
// src/main.ts
import dotenv from 'dotenv';
dotenv.config();

import { bot } from './bot';

bot.on('message', msg => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Received your message');
});
```

Все готово. Вы можете запустить `npm run compile` и `npm run start`, и отправить любое сообщение вашему боту. Бот ответит: "Received your message". Мы готовы к интеграции с TonConnect.

На данный момент у нас следующая структура файлов:

```text
ton-connect-bot
├── src
│   ├── bot.ts
│   └── main.ts
├── package.json
├── package-lock.json
├── .env
└── tsconfig.json
```

## Подключение кошелька

После установки `@tonconnect/sdk` мы можем начать с его импорта для инициализации подключений кошелька.

Мы начнем с получения списка кошельков. Нам нужны только кошельки, совместимые с http-bridge. Создайте папку `ton-connect` в `src` и добавьте туда файл `wallets.ts`:
Мы также определим функцию `getWalletInfo`, которая запрашивает подробную информацию о кошельке по его `appName`.
Разница между `name` и `appName` заключается в том, что `name` - это читаемое название кошелька, а `appName` - это уникальный идентификатор кошелька.

```ts
// src/ton-connect/wallets.ts

import { isWalletInfoRemote, WalletInfoRemote, WalletsListManager } from '@tonconnect/sdk';

const walletsListManager = new WalletsListManager({
    cacheTTLMs: Number(process.env.WALLETS_LIST_CACHE_TTL_MS)
});

export async function getWallets(): Promise<WalletInfoRemote[]> {
    const wallets = await walletsListManager.getWallets();
    return wallets.filter(isWalletInfoRemote);
}

export async function getWalletInfo(walletAppName: string): Promise<WalletInfo | undefined> {
    const wallets = await getWallets();
    return wallets.find(wallet => wallet.appName.toLowerCase() === walletAppName.toLowerCase());
}
```

Теперь нам нужно определить хранилище TonConnect. TonConnect использует `localStorage` для сохранения данных о подключении при работе в браузере, однако в среде NodeJS `localStorage` отсутствует. Поэтому нам нужно добавить собственную простую реализацию хранилища.

[Подробнее о хранилище TonConnect](https://github.com/ton-connect/sdk/tree/main/packages/sdk#init-connector)

Создайте файл `storage.ts` в директории `ton-connect`:

```ts
// src/ton-connect/storage.ts

import { IStorage } from '@tonconnect/sdk';

const storage = new Map<string, string>(); // temporary storage implementation. We will replace it with the redis later

export class TonConnectStorage implements IStorage {
  constructor(private readonly chatId: number) {} // we need to have different stores for different users

  private getKey(key: string): string {
    return this.chatId.toString() + key; // we will simply have different keys prefixes for different users
  }

  async removeItem(key: string): Promise<void> {
    storage.delete(this.getKey(key));
  }

  async setItem(key: string, value: string): Promise<void> {
    storage.set(this.getKey(key), value);
  }

  async getItem(key: string): Promise<string | null> {
    return storage.get(this.getKey(key)) || null;
  }
}
```

Мы переходим к реализации подключения кошелька.
Измените `src/main.ts` и добавьте команду `connect`. Подключение кошелька будет реализовано в обработчике этой команды.

```ts
import dotenv from 'dotenv';
dotenv.config();

import { bot } from './bot';
import { getWallets } from './ton-connect/wallets';
import TonConnect from '@tonconnect/sdk';
import { TonConnectStorage } from './ton-connect/storage';
import QRCode from 'qrcode';

bot.onText(/\/connect/, async msg => {
  const chatId = msg.chat.id;
  const wallets = await getWallets();

  const connector = new TonConnect({
    storage: new TonConnectStorage(chatId),
    manifestUrl: process.env.MANIFEST_URL
  });

  connector.onStatusChange(wallet => {
    if (wallet) {
      bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
    }
  });

  const tonkeeper = wallets.find(wallet => wallet.appName === 'tonkeeper')!;

  const link = connector.connect({
    bridgeUrl: tonkeeper.bridgeUrl,
    universalLink: tonkeeper.universalLink
  });
  const image = await QRCode.toBuffer(link);

  await bot.sendPhoto(chatId, image);
});
```

Давайте разберемся, что мы делаем. Сначала мы получаем список кошельков и создаем экземпляр TonConnect.
Затем подписываемся на изменение кошелька. Когда пользователь подключит кошелек, бот отправит сообщение `${wallet.device.appName} wallet connected!`.
Далее мы находим кошелек Tonkeeper и создаем ссылку для подключения. В завершение мы генерируем QR-код со ссылкой и отправляем его пользователю в виде фотографии.

Теперь вы можете запустить бота (`npm run compile` и `npm run start`), а затем отправить боту сообщение `/connect`. Бот должен ответить QR-кодом. Отсканируйте его кошельком Tonkeeper. В чате появится сообщение `Tonkeeper wallet connected!`.

Мы будем использовать коннектор во многих местах, поэтому давайте перенесем код его создания в отдельный файл:

```ts
// src/ton-connect/connector.ts

import TonConnect from '@tonconnect/sdk';
import { TonConnectStorage } from './storage';
import * as process from 'process';

export function getConnector(chatId: number): TonConnect {
    return new TonConnect({
        manifestUrl: process.env.MANIFEST_URL,
        storage: new TonConnectStorage(chatId)
    });
}
```

И импортируем его в `src/main.ts`

```ts
// src/main.ts

import dotenv from 'dotenv';
dotenv.config();

import { bot } from './bot';
import { getWallets } from './ton-connect/wallets';
import QRCode from 'qrcode';
import { getConnector } from './ton-connect/connector';

bot.onText(/\/connect/, async msg => {
    const chatId = msg.chat.id;
    const wallets = await getWallets();

    const connector = getConnector(chatId);

    connector.onStatusChange(wallet => {
        if (wallet) {
            bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
        }
    });

    const tonkeeper = wallets.find(wallet => wallet.appName === 'tonkeeper')!;

    const link = connector.connect({
        bridgeUrl: tonkeeper.bridgeUrl,
        universalLink: tonkeeper.universalLink
    });
    const image = await QRCode.toBuffer(link);

    await bot.sendPhoto(chatId, image);
});
```

На данный момент у нас следующая структура файлов:

```text
bot-demo
├── src
│   ├── ton-connect
│   │   ├── connector.ts
│   │   ├── wallets.ts
│   │   └── storage.ts
│   ├── bot.ts
│   └── main.ts
├── package.json
├── package-lock.json
├── .env
└── tsconfig.json
```

## Создание меню подключения кошелька

### Добавление инлайн-клавиатуры

Мы реализовали подключение кошелька Tonkeeper. Однако мы не добавили возможность подключения через универсальный QR-код для всех кошельков и не дали пользователю выбрать подходящий кошелёк. Давайте исправим это сейчас.

Для улучшения UX мы будем использовать функции Telegram `callback_query` и `inline_keyboard`. Если вы не знакомы с ними, вы можете прочитать об этом подробнее [здесь](https://core.telegram.org/bots/api#callbackquery).

Мы реализуем следующий UX для подключения кошелька:

```text
First screen:
<Unified QR>
<Open @wallet>, <Choose a wallet button (opens second screen)>, <Open wallet unified link>

Second screen:
<Unified QR>
<Back (opens first screen)>
<@wallet button (opens third screen)>, <Tonkeeper button (opens third screen)>, <Tonhub button (opens third screen)>, <...>

Third screen:
<Selected wallet QR>
<Back (opens second screen)>
<Open selected wallet link>
```

Давайте начнем с добавления инлайн-клавиатуры в обработчик команды `/connect` в файле `main.ts`

```ts
// src/main.ts
bot.onText(/\/connect/, async msg => {
    const chatId = msg.chat.id;
    const wallets = await getWallets();

    const connector = getConnector(chatId);

    connector.onStatusChange(async wallet => {
        if (wallet) {
            const walletName =
                (await getWalletInfo(wallet.device.appName))?.name || wallet.device.appName;
            bot.sendMessage(chatId, `${walletName} wallet connected!`);
        }
    });

    const link = connector.connect(wallets);
    const image = await QRCode.toBuffer(link);

    await bot.sendPhoto(chatId, image, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Choose a Wallet',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: 'Open Link',
                        url: `https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(
                            link
                        )}`
                    }
                ]
            ]
        }
    });
});
```

Нам нужно обернуть диплинк TonConnect как https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(link)}, так как Telegram позволяет использовать в инлайн-клавиатуре только ссылки формата `http`.
Сайт https://ton-connect.github.io/open-tc просто перенаправляет пользователя на ссылку, переданную в параметре `connect` запроса, что является временным решением для открытия ссылок `tc://` в Telegram.

Обратите внимание, что мы изменили аргументы вызова `connector.connect`. Теперь мы генерируем универсальную ссылку для всех кошельков.

Далее мы указываем Telegram вызвать обработчик `callback_query` со значением `{"method": "chose_wallet" }`, когда пользователь нажимает кнопку `Choose a Wallet`.

### Добавление обработчика кнопки "Choose a Wallet"

Создайте файл `src/connect-wallet-menu.ts`.

Давайте добавим туда обработчик нажатия кнопки 'Choose a Wallet':

```ts
// src/connect-wallet-menu.ts

async function onChooseWalletClick(query: CallbackQuery, _: string): Promise<void> {
    const wallets = await getWallets();

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                wallets.map(wallet => ({
                    text: wallet.name,
                    callback_data: JSON.stringify({ method: 'select_wallet', data: wallet.appName })
                })),
                [
                    {
                        text: '« Back',
                        callback_data: JSON.stringify({
                            method: 'universal_qr'
                        })
                    }
                ]
            ]
        },
        {
            message_id: query.message!.message_id,
            chat_id: query.message!.chat.id
        }
    );
}
```

Здесь мы заменяем инлайн-клавиатуру сообщения на новую, которая содержит кликабельный список кошельков и кнопку `Back`.

Теперь мы добавим глобальный обработчик `callback_query` и зарегистрируем `onChooseWalletClick`:

```ts
// src/connect-wallet-menu.ts
import { CallbackQuery } from 'node-telegram-bot-api';
import { getWallets } from './ton-connect/wallets';
import { bot } from './bot';

export const walletMenuCallbacks = { // Define buttons callbacks
    chose_wallet: onChooseWalletClick
};

bot.on('callback_query', query => { // Parse callback data and execute corresponing function
    if (!query.data) {
        return;
    }

    let request: { method: string; data: string };

    try {
        request = JSON.parse(query.data);
    } catch {
        return;
    }

    if (!walletMenuCallbacks[request.method as keyof typeof walletMenuCallbacks]) {
        return;
    }

    walletMenuCallbacks[request.method as keyof typeof walletMenuCallbacks](query, request.data);
});

// ... other code from the previous ster
async function onChooseWalletClick ...
```

Здесь мы определяем список обработчиков кнопок и парсер `callback_query`. К сожалению, колбек-данные всегда строковые, поэтому мы передаем JSON в `callback_data` и парсим его позже в обработчике `callback_query`.
Затем мы ищем запрашиваемый метод и вызываем его с переданными параметрами.

Теперь мы должны добавить импорт `connect-wallet-menu.ts` в `main.ts`.

```ts
// src/main.ts

// ... other imports

import './connect-wallet-menu';

// ... other code
```

Скомпилируйте и запустите бота. Вы можете нажать на кнопку "Choose a wallet ", и бот заменит кнопки инлайн-клавиатуры!

### Добавление обработчиков других кнопок

Давайте завершим создание меню и добавим обработчики оставшихся команд.

Для начала мы создадим служебную функцию `editQR`. Редактирование медиафайлов сообщения (QR-изображения) - задача непростая. Нам нужно сохранить изображение в файл и отправить его на сервер Telegram. Затем мы можем удалить этот файл.

```ts
// src/connect-wallet-menu.ts

// ... other code


async function editQR(message: TelegramBot.Message, link: string): Promise<void> {
    const fileName = 'QR-code-' + Math.round(Math.random() * 10000000000);

    await QRCode.toFile(`./${fileName}`, link);

    await bot.editMessageMedia(
        {
            type: 'photo',
            media: `attach://${fileName}`
        },
        {
            message_id: message?.message_id,
            chat_id: message?.chat.id
        }
    );

    await new Promise(r => fs.rm(`./${fileName}`, r));
}
```

В обработчике `onOpenUniversalQRClick` мы просто регенерируем QR-код и диплинк и изменяем сообщение:

```ts
// src/connect-wallet-menu.ts

// ... other code

async function onOpenUniversalQRClick(query: CallbackQuery, _: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const wallets = await getWallets();

    const connector = getConnector(chatId);

    connector.onStatusChange(wallet => {
        if (wallet) {
            bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
        }
    });

    const link = connector.connect(wallets);

    await editQR(query.message!, link);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [
                    {
                        text: 'Choose a Wallet',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: 'Open Link',
                        url: `https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(
                            link
                        )}`
                    }
                ]
            ]
        },
        {
            message_id: query.message?.message_id,
            chat_id: query.message?.chat.id
        }
    );
}

// ... other code
```

В обработчике `onWalletClick` мы создаем специальный QR-код и универсальную ссылку только для выбранного кошелька и изменяем сообщение.

```ts
// src/connect-wallet-menu.ts

// ... other code

async function onWalletClick(query: CallbackQuery, data: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const connector = getConnector(chatId);

    connector.onStatusChange(wallet => {
        if (wallet) {
            bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
        }
    });

    const selectedWallet = await getWalletInfo(data);
    if (!selectedWallet) {
        return;
    }

    const link = connector.connect({
        bridgeUrl: selectedWallet.bridgeUrl,
        universalLink: selectedWallet.universalLink
    });

    await editQR(query.message!, link);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [
                    {
                        text: '« Back',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: `Open ${selectedWallet.name}`,
                        url: link
                    }
                ]
            ]
        },
        {
            message_id: query.message?.message_id,
            chat_id: chatId
        }
    );
}

// ... other code
```

Теперь нам нужно зарегистрировать эти функции как колбек (`walletMenuCallbacks`):

```ts
// src/connect-wallet-menu.ts
import TelegramBot, { CallbackQuery } from 'node-telegram-bot-api';
import { getWallets } from './ton-connect/wallets';
import { bot } from './bot';
import * as fs from 'fs';
import { getConnector } from './ton-connect/connector';
import QRCode from 'qrcode';

export const walletMenuCallbacks = {
    chose_wallet: onChooseWalletClick,
    select_wallet: onWalletClick,
    universal_qr: onOpenUniversalQRClick
};

// ... other code
```

<details>
<summary>На данный момент src/connect-wallet-menu.ts выглядит следующим образом</summary>

```ts
// src/connect-wallet-menu.ts

import TelegramBot, { CallbackQuery } from 'node-telegram-bot-api';
import { getWallets, getWalletInfo } from './ton-connect/wallets';
import { bot } from './bot';
import { getConnector } from './ton-connect/connector';
import QRCode from 'qrcode';
import * as fs from 'fs';

export const walletMenuCallbacks = {
    chose_wallet: onChooseWalletClick,
    select_wallet: onWalletClick,
    universal_qr: onOpenUniversalQRClick
};

bot.on('callback_query', query => { // Parse callback data and execute corresponing function
    if (!query.data) {
        return;
    }

    let request: { method: string; data: string };

    try {
        request = JSON.parse(query.data);
    } catch {
        return;
    }

    if (!callbacks[request.method as keyof typeof callbacks]) {
        return;
    }

    callbacks[request.method as keyof typeof callbacks](query, request.data);
});


async function onChooseWalletClick(query: CallbackQuery, _: string): Promise<void> {
    const wallets = await getWallets();

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                wallets.map(wallet => ({
                    text: wallet.name,
                    callback_data: JSON.stringify({ method: 'select_wallet', data: wallet.appName })
                })),
                [
                    {
                        text: '« Back',
                        callback_data: JSON.stringify({
                            method: 'universal_qr'
                        })
                    }
                ]
            ]
        },
        {
            message_id: query.message!.message_id,
            chat_id: query.message!.chat.id
        }
    );
}

async function onOpenUniversalQRClick(query: CallbackQuery, _: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const wallets = await getWallets();

    const connector = getConnector(chatId);

    connector.onStatusChange(wallet => {
        if (wallet) {
            bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
        }
    });

    const link = connector.connect(wallets);

    await editQR(query.message!, link);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [
                    {
                        text: 'Choose a Wallet',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: 'Open Link',
                        url: `https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(
                            link
                        )}`
                    }
                ]
            ]
        },
        {
            message_id: query.message?.message_id,
            chat_id: query.message?.chat.id
        }
    );
}

async function onWalletClick(query: CallbackQuery, data: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const connector = getConnector(chatId);

    connector.onStatusChange(wallet => {
        if (wallet) {
            bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
        }
    });

    const selectedWallet = await getWalletInfo(data);
    if (!selectedWallet) {
        return;
    }

    const link = connector.connect({
        bridgeUrl: selectedWallet.bridgeUrl,
        universalLink: selectedWallet.universalLink
    });

    await editQR(query.message!, link);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [
                    {
                        text: '« Back',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: `Open ${selectedWallet.name}`,
                        url: link
                    }
                ]
            ]
        },
        {
            message_id: query.message?.message_id,
            chat_id: chatId
        }
    );
}

async function editQR(message: TelegramBot.Message, link: string): Promise<void> {
    const fileName = 'QR-code-' + Math.round(Math.random() * 10000000000);

    await QRCode.toFile(`./${fileName}`, link);

    await bot.editMessageMedia(
        {
            type: 'photo',
            media: `attach://${fileName}`
        },
        {
            message_id: message?.message_id,
            chat_id: message?.chat.id
        }
    );

    await new Promise(r => fs.rm(`./${fileName}`, r));
}
```

</details>

Скомпилируйте и запустите бота, чтобы проверить, как теперь работает подключение к кошельку.

Вы могли заметить, что мы пока не рассматривали истечение срока действия QR-кода и остановку работы коннекторов. Мы займёмся этим позже.

На данный момент у нас есть следующая структура файлов:

```text
bot-demo
├── src
│   ├── ton-connect
│   │   ├── connector.ts
│   │   ├── wallets.ts
│   │   └── storage.ts
│   ├── bot.ts
│   ├── connect-wallet-menu.ts
│   └── main.ts
├── package.json
├── package-lock.json
├── .env
└── tsconfig.json
```

## Реализация отправки транзакций

Прежде чем писать новый код для отправки транзакций, давайте оптимизируем существующий. Мы создадим новый файл для обработчиков команд бота ('/connect', '/send_tx', ...)

```ts
// src/commands-handlers.ts

import { bot } from './bot';
import { getWallets } from './ton-connect/wallets';
import QRCode from 'qrcode';
import TelegramBot from 'node-telegram-bot-api';
import { getConnector } from './ton-connect/connector';

export async function handleConnectCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;
    const wallets = await getWallets();

    const connector = getConnector(chatId);

    connector.onStatusChange(wallet => {
        if (wallet) {
            bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
        }
    });

    const link = connector.connect(wallets);
    const image = await QRCode.toBuffer(link);

    await bot.sendPhoto(chatId, image, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Choose a Wallet',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: 'Open Link',
                        url: `https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(
                            link
                        )}`
                    }
                ]
            ]
        }
    });
}
```

Давайте импортируем его в `main.ts`, а также переместим точку входа для `callback_query` из `connect-wallet-menu.ts` в `main.ts`:

```ts
// src/main.ts

import dotenv from 'dotenv';
dotenv.config();

import { bot } from './bot';
import './connect-wallet-menu';
import { handleConnectCommand } from './commands-handlers';
import { walletMenuCallbacks } from './connect-wallet-menu';

const callbacks = {
    ...walletMenuCallbacks
};

bot.on('callback_query', query => {
    if (!query.data) {
        return;
    }

    let request: { method: string; data: string };

    try {
        request = JSON.parse(query.data);
    } catch {
        return;
    }

    if (!callbacks[request.method as keyof typeof callbacks]) {
        return;
    }

    callbacks[request.method as keyof typeof callbacks](query, request.data);
});

bot.onText(/\/connect/, handleConnectCommand);
```

```ts
// src/connect-wallet-menu.ts

// ... imports


export const walletMenuCallbacks = {
    chose_wallet: onChooseWalletClick,
    select_wallet: onWalletClick,
    universal_qr: onOpenUniversalQRClick
};

async function onChooseWalletClick(query: CallbackQuery, _: string): Promise<void> {

// ... other code
```

Теперь мы можем добавить обработчик команды `send_tx`:

```ts
// src/commands-handlers.ts

// ... other code

export async function handleSendTXCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;

    const connector = getConnector(chatId);

    await connector.restoreConnection();
    if (!connector.connected) {
        await bot.sendMessage(chatId, 'Connect wallet to send transaction');
        return;
    }

    connector
        .sendTransaction({
            validUntil: Math.round(Date.now() / 1000) + 600, // timeout is SECONDS
            messages: [
                {
                    amount: '1000000',
                    address: '0:0000000000000000000000000000000000000000000000000000000000000000'
                }
            ]
        })
        .then(() => {
            bot.sendMessage(chatId, `Transaction sent successfully`);
        })
        .catch(e => {
            if (e instanceof UserRejectsError) {
                bot.sendMessage(chatId, `You rejected the transaction`);
                return;
            }

            bot.sendMessage(chatId, `Unknown error happened`);
        })
        .finally(() => connector.pauseConnection());

    let deeplink = '';
    const walletInfo = await getWalletInfo(connector.wallet!.device.appName);
    if (walletInfo) {
        deeplink = walletInfo.universalLink;
    }

    await bot.sendMessage(
        chatId,
        `Open ${walletInfo?.name || connector.wallet!.device.appName} and confirm transaction`,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Open Wallet',
                            url: deeplink
                        }
                    ]
                ]
            }
        }
    );
}
```

Здесь мы проверяем, подключен ли кошелек пользователя, и обрабатываем отправку транзакции.
Затем мы отправляем пользователю сообщение с кнопкой, которая открывает его кошелек (универсальная ссылка на кошелек без дополнительных параметров).
Обратите внимание, что эта кнопка содержит пустой диплинк. Это означает, что данные запроса на отправку транзакции проходят через http-мост, и транзакция появится в кошельке пользователя, даже если он просто откроет приложение кошелька, не нажимая кнопку.

Давайте зарегистрируем этот обработчик:

```ts
// src/main.ts

// ... other code

bot.onText(/\/connect/, handleConnectCommand);

bot.onText(/\/send_tx/, handleSendTXCommand);
```

Скомпилируйте и запустите бота, чтобы проверить, правильно ли работает отправка транзакций.

На данный момент у нас следующая структура файлов:

```text
bot-demo
├── src
│   ├── ton-connect
│   │   ├── connector.ts
│   │   ├── wallets.ts
│   │   └── storage.ts
│   ├── bot.ts
│   ├── connect-wallet-menu.ts
│   ├── commands-handlers.ts
│   └── main.ts
├── package.json
├── package-lock.json
├── .env
└── tsconfig.json
```

## Добавление отключения и отображение команд подключенного кошелька

Реализация этих команд достаточно проста:

```ts
// src/commands-handlers.ts

// ... other code

export async function handleDisconnectCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;

    const connector = getConnector(chatId);

    await connector.restoreConnection();
    if (!connector.connected) {
        await bot.sendMessage(chatId, "You didn't connect a wallet");
        return;
    }

    await connector.disconnect();

    await bot.sendMessage(chatId, 'Wallet has been disconnected');
}

export async function handleShowMyWalletCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;

    const connector = getConnector(chatId);

    await connector.restoreConnection();
    if (!connector.connected) {
        await bot.sendMessage(chatId, "You didn't connect a wallet");
        return;
    }

    const walletName =
        (await getWalletInfo(connector.wallet!.device.appName))?.name ||
        connector.wallet!.device.appName;


    await bot.sendMessage(
        chatId,
        `Connected wallet: ${walletName}\nYour address: ${toUserFriendlyAddress(
            connector.wallet!.account.address,
            connector.wallet!.account.chain === CHAIN.TESTNET
        )}`
    );
}
```

И зарегистрируем эти команды:

```ts
// src/main.ts

// ... other code

bot.onText(/\/connect/, handleConnectCommand);
bot.onText(/\/send_tx/, handleSendTXCommand);
bot.onText(/\/disconnect/, handleDisconnectCommand);
bot.onText(/\/my_wallet/, handleShowMyWalletCommand);
```

Скомпилируйте и запустите бота, чтобы проверить, правильно ли работают эти команды.

## Оптимизация

Мы реализовали все базовые команды. Но важно помнить, что каждый коннектор поддерживает открытое соединение SSE до тех пор, пока оно не будет приостановлено.
Кроме того, мы не рассмотрели случай, когда пользователь вызывает `/connect` несколько раз, или вызывает `/connect` или `/send_tx` и не сканирует QR-код. Нам необходимо установить таймаут и закрывать соединение, чтобы экономить серверные ресурсы.
Также нужно уведомлять пользователя, что срок действия QR-кода или запроса транзакции истек.

### Оптимизация отправки транзакций

Давайте создадим служебную функцию, которая оборачивает промис и отклоняет его после заданного таймаута:

```ts
// src/utils.ts

export const pTimeoutException = Symbol();

export function pTimeout<T>(
    promise: Promise<T>,
    time: number,
    exception: unknown = pTimeoutException
): Promise<T> {
    let timer: ReturnType<typeof setTimeout>;
    return Promise.race([
        promise,
        new Promise((_r, rej) => (timer = setTimeout(rej, time, exception)))
    ]).finally(() => clearTimeout(timer)) as Promise<T>;
}
```

Вы можете использовать этот код или выбрать библиотеку, которая вам больше нравится.

Давайте добавим значение параметра таймаута в `.env`

```dotenv
# .env
TELEGRAM_BOT_TOKEN=<YOUR BOT TOKEN, LIKE 1234567890:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA>
MANIFEST_URL=https://raw.githubusercontent.com/ton-connect/demo-telegram-bot/master/tonconnect-manifest.json
WALLETS_LIST_CACHE_TTL_MS=86400000
DELETE_SEND_TX_MESSAGE_TIMEOUT_MS=600000
```

Теперь улучшим функцию `handleSendTXCommand` и перенести отправку tx в `pTimeout`

```ts
// src/commands-handlers.ts

// export async function handleSendTXCommand(msg: TelegramBot.Message): Promise<void> { ...

pTimeout(
    connector.sendTransaction({
        validUntil: Math.round(
            (Date.now() + Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)) / 1000
        ),
        messages: [
            {
                amount: '1000000',
                address: '0:0000000000000000000000000000000000000000000000000000000000000000'
            }
        ]
    }),
    Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)
)
    .then(() => {
        bot.sendMessage(chatId, `Transaction sent successfully`);
    })
    .catch(e => {
        if (e === pTimeoutException) {
            bot.sendMessage(chatId, `Transaction was not confirmed`);
            return;
        }

        if (e instanceof UserRejectsError) {
            bot.sendMessage(chatId, `You rejected the transaction`);
            return;
        }

        bot.sendMessage(chatId, `Unknown error happened`);
    })
    .finally(() => connector.pauseConnection());

// ... other code
```

<details>
<summary>Полный код handleSendTXCommand</summary>

```ts
export async function handleSendTXCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;

    const connector = getConnector(chatId);

    await connector.restoreConnection();
    if (!connector.connected) {
        await bot.sendMessage(chatId, 'Connect wallet to send transaction');
        return;
    }

    pTimeout(
        connector.sendTransaction({
            validUntil: Math.round(
                (Date.now() + Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)) / 1000
            ),
            messages: [
                {
                    amount: '1000000',
                    address: '0:0000000000000000000000000000000000000000000000000000000000000000'
                }
            ]
        }),
        Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)
    )
        .then(() => {
            bot.sendMessage(chatId, `Transaction sent successfully`);
        })
        .catch(e => {
            if (e === pTimeoutException) {
                bot.sendMessage(chatId, `Transaction was not confirmed`);
                return;
            }

            if (e instanceof UserRejectsError) {
                bot.sendMessage(chatId, `You rejected the transaction`);
                return;
            }

            bot.sendMessage(chatId, `Unknown error happened`);
        })
        .finally(() => connector.pauseConnection());

    let deeplink = '';
    const walletInfo = await getWalletInfo(connector.wallet!.device.appName);
    if (walletInfo) {
        deeplink = walletInfo.universalLink;
    }

    await bot.sendMessage(
        chatId,
        `Open ${walletInfo?.name || connector.wallet!.device.appName} and confirm transaction`,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Open Wallet',
                            url: deeplink
                        }
                    ]
                ]
            }
        }
    );
}
```

</details>

Если пользователь не подтвердит транзакцию в течение `DELETE_SEND_TX_MESSAGE_TIMEOUT_MS` (10 минут), транзакция будет отменена, а бот отправит сообщение `Transaction was not confirmed`.

Вы можете установить этот параметр на `5000`, скомпилировать и перезапустить бота, чтобы протестировать его поведение.

### Оптимизация процесса подключения кошелька

В данный момент мы создаем новый коннектор на каждом шаге навигации через меню подключения кошелька.
Это неэффективно, так как мы не закрываем соединение предыдущих коннекторов при создании новых. Давайте улучшим это поведение и создадим кэш-карту для коннекторов пользователей.

<details>
<summary>Код src/ton-connect/connector.ts</summary>

```ts
// src/ton-connect/connector.ts

import TonConnect from '@tonconnect/sdk';
import { TonConnectStorage } from './storage';
import * as process from 'process';

type StoredConnectorData = {
    connector: TonConnect;
    timeout: ReturnType<typeof setTimeout>;
    onConnectorExpired: ((connector: TonConnect) => void)[];
};

const connectors = new Map<number, StoredConnectorData>();

export function getConnector(
    chatId: number,
    onConnectorExpired?: (connector: TonConnect) => void
): TonConnect {
    let storedItem: StoredConnectorData;
    if (connectors.has(chatId)) {
        storedItem = connectors.get(chatId)!;
        clearTimeout(storedItem.timeout);
    } else {
        storedItem = {
            connector: new TonConnect({
                manifestUrl: process.env.MANIFEST_URL,
                storage: new TonConnectStorage(chatId)
            }),
            onConnectorExpired: []
        } as unknown as StoredConnectorData;
    }

    if (onConnectorExpired) {
        storedItem.onConnectorExpired.push(onConnectorExpired);
    }

    storedItem.timeout = setTimeout(() => {
        if (connectors.has(chatId)) {
            const storedItem = connectors.get(chatId)!;
            storedItem.connector.pauseConnection();
            storedItem.onConnectorExpired.forEach(callback => callback(storedItem.connector));
            connectors.delete(chatId);
        }
    }, Number(process.env.CONNECTOR_TTL_MS));

    connectors.set(chatId, storedItem);
    return storedItem.connector;
}
```

</details>

Этот код может показаться немного запутанным, но давайте разберемся.
Здесь мы сохраняем коннектор, тайм-аут для его очистки и список колбеков, которые должны быть выполнены после истечения тайм-аута для каждого пользователя.

При вызове `getConnector` мы проверяем, есть ли в кэше существующий коннектор для данного `chatId` (пользователя). Если он существует, мы сбрасываем таймаут очистки и возвращаем коннектор.
Это позволяет сохранять активные коннекторы пользователей в кэше. Если в кэше нет коннектора, мы создаем новый, регистрируем функцию очистки по таймауту и возвращаем этот коннектор.

Чтобы это работало, необходимо добавить новый параметр в `.env`

```dotenv
# .env
TELEGRAM_BOT_TOKEN=<YOUR BOT TOKEN, LIKE 1234567890:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA>
MANIFEST_URL=https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json
WALLETS_LIST_CACHE_TTL_MS=86400000
DELETE_SEND_TX_MESSAGE_TIMEOUT_MS=600000
CONNECTOR_TTL_MS=600000
```

Теперь давайте используем его в handelConnectCommand

<details>
<summary>Код src/commands-handlers.ts</summary>

```ts
// src/commands-handlers.ts

import {
    CHAIN,
    isWalletInfoRemote,
    toUserFriendlyAddress,
    UserRejectsError
} from '@tonconnect/sdk';
import { bot } from './bot';
import { getWallets, getWalletInfo } from './ton-connect/wallets';
import QRCode from 'qrcode';
import TelegramBot from 'node-telegram-bot-api';
import { getConnector } from './ton-connect/connector';
import { pTimeout, pTimeoutException } from './utils';

let newConnectRequestListenersMap = new Map<number, () => void>();

export async function handleConnectCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;
    let messageWasDeleted = false;

    newConnectRequestListenersMap.get(chatId)?.();

    const connector = getConnector(chatId, () => {
        unsubscribe();
        newConnectRequestListenersMap.delete(chatId);
        deleteMessage();
    });

    await connector.restoreConnection();
    if (connector.connected) {
        const connectedName =
            (await getWalletInfo(connector.wallet!.device.appName))?.name ||
            connector.wallet!.device.appName;

        await bot.sendMessage(
            chatId,
            `You have already connect ${connectedName} wallet\nYour address: ${toUserFriendlyAddress(
                connector.wallet!.account.address,
                connector.wallet!.account.chain === CHAIN.TESTNET
            )}\n\n Disconnect wallet firstly to connect a new one`
        );

        return;
    }

    const unsubscribe = connector.onStatusChange(async wallet => {
        if (wallet) {
            await deleteMessage();

            const walletName =
                (await getWalletInfo(wallet.device.appName))?.name || wallet.device.appName;
            await bot.sendMessage(chatId, `${walletName} wallet connected successfully`);
            unsubscribe();
            newConnectRequestListenersMap.delete(chatId);
        }
    });

    const wallets = await getWallets();

    const link = connector.connect(wallets);
    const image = await QRCode.toBuffer(link);

    const botMessage = await bot.sendPhoto(chatId, image, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Choose a Wallet',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: 'Open Link',
                        url: `https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(
                            link
                        )}`
                    }
                ]
            ]
        }
    });

    const deleteMessage = async (): Promise<void> => {
        if (!messageWasDeleted) {
            messageWasDeleted = true;
            await bot.deleteMessage(chatId, botMessage.message_id);
        }
    };

    newConnectRequestListenersMap.set(chatId, async () => {
        unsubscribe();

        await deleteMessage();

        newConnectRequestListenersMap.delete(chatId);
    });
}

// ... other code
```

</details>

Мы определили `newConnectRequestListenersMap` для хранения колбека очистки последнего запроса подключения для каждого пользователя.
Если пользователь вызывает `/connect` несколько раз, бот удалит предыдущее сообщение с QR-кодом.
Кроме того, мы настроили время ожидания подключения, чтобы удалять сообщение с QR-кодом по истечении срока его действия.

Теперь мы должны удалить подписку `connector.onStatusChange` из функций `connect-wallet-menu.ts`, так как они используют один и тот же экземпляр коннектора, а одной подписки в `handleConnectCommand` достаточно.

<details>
<summary>Код src/connect-wallet-menu.ts</summary>

```ts
// src/connect-wallet-menu.ts

// ... other code

async function onOpenUniversalQRClick(query: CallbackQuery, _: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const wallets = await getWallets();

    const connector = getConnector(chatId);

    const link = connector.connect(wallets);

    await editQR(query.message!, link);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [
                    {
                        text: 'Choose a Wallet',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: 'Open Link',
                        url: `https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(
                            link
                        )}`
                    }
                ]
            ]
        },
        {
            message_id: query.message?.message_id,
            chat_id: query.message?.chat.id
        }
    );
}

async function onWalletClick(query: CallbackQuery, data: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const connector = getConnector(chatId);

    const wallets = await getWallets();

    const selectedWallet = wallets.find(wallet => wallet.name === data);
    if (!selectedWallet) {
        return;
    }

    const link = connector.connect({
        bridgeUrl: selectedWallet.bridgeUrl,
        universalLink: selectedWallet.universalLink
    });

    await editQR(query.message!, link);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [
                    {
                        text: '« Back',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: `Open ${data}`,
                        url: link
                    }
                ]
            ]
        },
        {
            message_id: query.message?.message_id,
            chat_id: chatId
        }
    );
}

// ... other code
```

</details>

Вот и все! Скомпилируйте и запустите бота и попробуйте вызвать `/connect` дважды.

### Улучшение взаимодействия с @wallet

Начиная с версии 3 TonConnect поддерживает подключение к кошелькам TWA, таким как @wallet. На данный момент в руководстве бот может быть подключен к @wallet.
Однако следует улучшить стратегию перенаправления для повышения удобства UX. Кроме того, давайте добавим кнопку `Connect @wallet` на первый экран ("Универсальный QR").

Для начала давайте создадим несколько служебных функций:

```ts
// src/utils.ts
import { encodeTelegramUrlParameters, isTelegramUrl } from '@tonconnect/sdk';

export const AT_WALLET_APP_NAME = 'telegram-wallet';

// ... other code
export function addTGReturnStrategy(link: string, strategy: string): string {
    const parsed = new URL(link);
    parsed.searchParams.append('ret', strategy);
    link = parsed.toString();

    const lastParam = link.slice(link.lastIndexOf('&') + 1);
    return link.slice(0, link.lastIndexOf('&')) + '-' + encodeTelegramUrlParameters(lastParam);
}

export function convertDeeplinkToUniversalLink(link: string, walletUniversalLink: string): string {
    const search = new URL(link).search;
    const url = new URL(walletUniversalLink);

    if (isTelegramUrl(walletUniversalLink)) {
        const startattach = 'tonconnect-' + encodeTelegramUrlParameters(search.slice(1));
        url.searchParams.append('startattach', startattach);
    } else {
        url.search = search;
    }

    return url.toString();
}
```

Параметры TonConnect в ссылках Telegram должны быть закодированы особым образом, поэтому мы используем `encodeTelegramUrlParameters` для кодирования параметра стратегии возврата.
Мы будем использовать `addTGReturnStrategy`, для предоставления правильного URL-адреса возврата демо-боту для @wallet.

Поскольку мы используем универсальный код создания QR-страниц в двух местах, мы выносим его в отдельную функцию:

```ts
// src/utils.ts

// ... other code

export async function buildUniversalKeyboard(
    link: string,
    wallets: WalletInfoRemote[]
): Promise<InlineKeyboardButton[]> {
    const atWallet = wallets.find(wallet => wallet.appName.toLowerCase() === AT_WALLET_APP_NAME);
    const atWalletLink = atWallet
        ? addTGReturnStrategy(
            convertDeeplinkToUniversalLink(link, atWallet?.universalLink),
            process.env.TELEGRAM_BOT_LINK!
        )
        : undefined;

    const keyboard = [
        {
            text: 'Choose a Wallet',
            callback_data: JSON.stringify({ method: 'chose_wallet' })
        },
        {
            text: 'Open Link',
            url: `https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(link)}`
        }
    ];

    if (atWalletLink) {
        keyboard.unshift({
            text: '@wallet',
            url: atWalletLink
        });
    }

    return keyboard;
}
```

Здесь мы добавляем отдельную кнопку для @wallet на первый экран (Универсальный QR-экран). Осталось только использовать эту функцию в
connect-wallet-menu и command-handlers:

<details>
<summary>Код src/connect-wallet-menu.ts</summary>

```ts
// src/connect-wallet-menu.ts

// ... other code

async function onOpenUniversalQRClick(query: CallbackQuery, _: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const wallets = await getWallets();

    const connector = getConnector(chatId);

    const link = connector.connect(wallets);

    await editQR(query.message!, link);

    const keyboard = await buildUniversalKeyboard(link, wallets);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [keyboard]
        },
        {
            message_id: query.message?.message_id,
            chat_id: query.message?.chat.id
        }
    );
}

// ... other code
```

</details>

<details>
<summary>Код src/commands-handlers.ts</summary>

```ts
// src/commands-handlers.ts

// ... other code

export async function handleConnectCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;
    let messageWasDeleted = false;

    newConnectRequestListenersMap.get(chatId)?.();

    const connector = getConnector(chatId, () => {
        unsubscribe();
        newConnectRequestListenersMap.delete(chatId);
        deleteMessage();
    });

    await connector.restoreConnection();
    if (connector.connected) {
        const connectedName =
            (await getWalletInfo(connector.wallet!.device.appName))?.name ||
            connector.wallet!.device.appName;
        await bot.sendMessage(
            chatId,
            `You have already connect ${connectedName} wallet\nYour address: ${toUserFriendlyAddress(
                connector.wallet!.account.address,
                connector.wallet!.account.chain === CHAIN.TESTNET
            )}\n\n Disconnect wallet firstly to connect a new one`
        );

        return;
    }

    const unsubscribe = connector.onStatusChange(async wallet => {
        if (wallet) {
            await deleteMessage();

            const walletName =
                (await getWalletInfo(wallet.device.appName))?.name || wallet.device.appName;
            await bot.sendMessage(chatId, `${walletName} wallet connected successfully`);
            unsubscribe();
            newConnectRequestListenersMap.delete(chatId);
        }
    });

    const wallets = await getWallets();

    const link = connector.connect(wallets);
    const image = await QRCode.toBuffer(link);

    const keyboard = await buildUniversalKeyboard(link, wallets);

    const botMessage = await bot.sendPhoto(chatId, image, {
        reply_markup: {
            inline_keyboard: [keyboard]
        }
    });

    const deleteMessage = async (): Promise<void> => {
        if (!messageWasDeleted) {
            messageWasDeleted = true;
            await bot.deleteMessage(chatId, botMessage.message_id);
        }
    };

    newConnectRequestListenersMap.set(chatId, async () => {
        unsubscribe();

        await deleteMessage();

        newConnectRequestListenersMap.delete(chatId);
    });
}

// ... other code
```

</details>

Теперь мы будем корректно обрабатывать TG-ссылки, когда пользователь нажимает на кнопку кошелька на втором экране (Выбор кошелька):

<details>
<summary>Код src/connect-wallet-menu.ts</summary>

```ts
// src/connect-wallet-menu.ts

// ... other code


async function onWalletClick(query: CallbackQuery, data: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const connector = getConnector(chatId);

    const selectedWallet = await getWalletInfo(data);
    if (!selectedWallet) {
        return;
    }

    let buttonLink = connector.connect({
        bridgeUrl: selectedWallet.bridgeUrl,
        universalLink: selectedWallet.universalLink
    });

    let qrLink = buttonLink;

    if (isTelegramUrl(selectedWallet.universalLink)) {
        buttonLink = addTGReturnStrategy(buttonLink, process.env.TELEGRAM_BOT_LINK!);
        qrLink = addTGReturnStrategy(qrLink, 'none');
    }

    await editQR(query.message!, qrLink);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [
                    {
                        text: '« Back',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: `Open ${selectedWallet.name}`,
                        url: buttonLink
                    }
                ]
            ]
        },
        {
            message_id: query.message?.message_id,
            chat_id: chatId
        }
    );
}

// ... other code
```

</details>

Обратите внимание, что для QR-кода и кнопки-ссылки (`qrLink` и `buttonLink`) используются разные ссылки, так как перенаправление не требуется, если пользователь сканирует QR-код через @wallet. Однако оно необходимо, если пользователь подключается к @wallet через кнопку-ссылку.

Теперь давайте добавим стратегию возврата для TG-ссылок в обработчик `send transaction`:

<details>
<summary>Код src/commands-handlers.ts</summary>

```ts
// src/commands-handlers.ts

// ... other code

export async function handleSendTXCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;

    const connector = getConnector(chatId);

    await connector.restoreConnection();
    if (!connector.connected) {
        await bot.sendMessage(chatId, 'Connect wallet to send transaction');
        return;
    }

    pTimeout(
        connector.sendTransaction({
            validUntil: Math.round(
                (Date.now() + Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)) / 1000
            ),
            messages: [
                {
                    amount: '1000000',
                    address: '0:0000000000000000000000000000000000000000000000000000000000000000'
                }
            ]
        }),
        Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)
    )
        .then(() => {
            bot.sendMessage(chatId, `Transaction sent successfully`);
        })
        .catch(e => {
            if (e === pTimeoutException) {
                bot.sendMessage(chatId, `Transaction was not confirmed`);
                return;
            }

            if (e instanceof UserRejectsError) {
                bot.sendMessage(chatId, `You rejected the transaction`);
                return;
            }

            bot.sendMessage(chatId, `Unknown error happened`);
        })
        .finally(() => connector.pauseConnection());

    let deeplink = '';
    const walletInfo = await getWalletInfo(connector.wallet!.device.appName);
    if (walletInfo) {
        deeplink = walletInfo.universalLink;
    }

    if (isTelegramUrl(deeplink)) {
        const url = new URL(deeplink);
        url.searchParams.append('startattach', 'tonconnect');
        deeplink = addTGReturnStrategy(url.toString(), process.env.TELEGRAM_BOT_LINK!);
    }

    await bot.sendMessage(
        chatId,
        `Open ${walletInfo?.name || connector.wallet!.device.appName} and confirm transaction`,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: `Open ${walletInfo?.name || connector.wallet!.device.appName}`,
                            url: deeplink
                        }
                    ]
                ]
            }
        }
    );
}

// ... other code
```

</details>

Вот и все. Теперь пользователь может подключить @wallet с помощью специальной кнопки на главном экране, а также мы обеспечили корректную стратегию возврата для TG-ссылок.

## Добавление постоянного хранилища

В данный момент мы сохраняем сессии TonConnect в объекте Map. Однако вы можете сохранить их в базе данных или другом постоянном хранилище, чтобы не терять их при перезапуске сервера.
Мы будем использовать для этого Redis, но вы можете выбрать любое постоянное хранилище.

### Настройка redis

Для начала запустите `npm i redis`.

[Смотрите подробности о пакете](https://www.npmjs.com/package/redis)

Для работы с redis необходимо запустить сервер redis. Мы будем использовать образ Docker:
`docker run -p 6379:6379 -it redis/redis-stack-server:latest`

Теперь добавьте параметр подключения redis в `.env`. Url-адрес redis по умолчанию - `redis://127.0.0.1:6379`.

```dotenv
# .env
TELEGRAM_BOT_TOKEN=<YOUR BOT TOKEN, LIKE 1234567890:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA>
MANIFEST_URL=https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json
WALLETS_LIST_CACHE_TTL_MS=86400000
DELETE_SEND_TX_MESSAGE_TIMEOUT_MS=600000
CONNECTOR_TTL_MS=600000
REDIS_URL=redis://127.0.0.1:6379
```

Давайте интегрируем redis в `TonConnectStorage`:

```ts
// src/ton-connect/storage.ts

import { IStorage } from '@tonconnect/sdk';
import { createClient } from 'redis';

const client = createClient({ url: process.env.REDIS_URL });

client.on('error', err => console.log('Redis Client Error', err));

export async function initRedisClient(): Promise<void> {
    await client.connect();
}
export class TonConnectStorage implements IStorage {
    constructor(private readonly chatId: number) {}

    private getKey(key: string): string {
        return this.chatId.toString() + key;
    }

    async removeItem(key: string): Promise<void> {
        await client.del(this.getKey(key));
    }

    async setItem(key: string, value: string): Promise<void> {
        await client.set(this.getKey(key), value);
    }

    async getItem(key: string): Promise<string | null> {
        return (await client.get(this.getKey(key))) || null;
    }
}
```

Чтобы это работало, необходимо дождаться инициализации Redis в `main.ts`. Давайте обернем код в этом файле в асинхронную функцию:

```ts
// src/main.ts
// ... imports

async function main(): Promise<void> {
    await initRedisClient();

    const callbacks = {
        ...walletMenuCallbacks
    };

    bot.on('callback_query', query => {
        if (!query.data) {
            return;
        }

        let request: { method: string; data: string };

        try {
            request = JSON.parse(query.data);
        } catch {
            return;
        }

        if (!callbacks[request.method as keyof typeof callbacks]) {
            return;
        }

        callbacks[request.method as keyof typeof callbacks](query, request.data);
    });

    bot.onText(/\/connect/, handleConnectCommand);

    bot.onText(/\/send_tx/, handleSendTXCommand);

    bot.onText(/\/disconnect/, handleDisconnectCommand);

    bot.onText(/\/my_wallet/, handleShowMyWalletCommand);
}

main();
```

## Заключение

Что дальше?

- Если вы хотите запустить бота в продакшене, вам стоит установить и использовать менеджер процессов, такой как [pm2](https://pm2.keymetrics.io/).
- Вы можете улучшить обработку ошибок в боте.

## См. также

- [Отправка сообщений](/v3/guidelines/ton-connect/guidelines/sending-messages)
- [Руководство по интеграции](/v3/guidelines/ton-connect/guidelines/integration-with-javascript-sdk)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/dapps/assets/overview.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/dapps/assets/overview.md
================================================
import Button from '@site/src/components/button'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Обзор обработки активов

В данной статье представлен **краткий обзор** того, [как работают переводы TON](/v3/documentation/dapps/assets/overview#overview-on-messages-and-transactions), какие [типы активов](/v3/documentation/dapps/assets/overview#digital-asset-types-on-ton) вы можете найти в TON, а также о том, как [взаимодействовать с ton](/v3/documentation/dapps/assets/overview#interaction-with-ton-blockchain) с помощью вашего языка программирования.Настоятельно рекомендуется ознакомиться со всей представленной ниже информацией, прежде чем переходить к последующим страницам.

## Обзор сообщений и транзакций

Покрывая полностью асинхронный формат взаимодействия, блокчейн TON содержит несколько концепций, которые нетипичны для традиционных блокчейнов. В частности, каждое взаимодействие любого субъекта с блокчейном состоит из графа асинхронно передаваемых [сообщений](/v3/documentation/smart-contracts/message-management/messages-and-transactions) между смарт-контрактами и/или внешним миром. Каждая транзакция состоит из одного входящего сообщения и до 255 исходящих сообщений.

Существует 3 типа сообщений, которые полностью описаны [здесь](/v3/documentation/smart-contracts/message-management/sending-messages#types-of-messages). Если коротко:

- [внешнее сообщение](/v3/documentation/smart-contracts/message-management/external-messages):
  - `external in message` (иногда называемое просто `external message`) — это сообщение, которое отправляется из *вне* блокчейна в смарт-контракт *внутри* блокчейна.
  - `external out message` (обычно называемое `logs message`) отправляется из *сущности блокчейна* во *внешний мир*.
- [внутреннее сообщение](/v3/documentation/smart-contracts/message-management/internal-messages) отправляется из одной *сущности блокчейна* в *другую*, может нести некоторое количество цифровых активов и произвольную часть данных.

Стандартный формат любого взаимодействия начинается с отправки внешнего сообщения на смарт-контракт `wallet`. Он, в свою очередь, аутентифицирует отправителя сообщения с помощью криптографии с открытым ключом, берет на себя оплату комиссии и отправляет внутренние сообщения блокчейна. Эта очередь сообщений образует направленный ациклический граф или дерево.

Например:

![](/img/docs/asset-processing/alicemsgDAG.svg)

- Допустим `Алиса` использует [Tonkeeper](https://tonkeeper.com/), для отправки`external message` на свой кошелек
- `external message` – это входящее сообщение для контракта `wallet A v4` с пустым отправителем
- `outgoing message` является исходящим сообщением для контракта `wallet A v4`, а также входящим сообщением для контракта `wallet B v4` с источником `wallet A v4` и пунктом назначения `wallet B v4`

В результате образуются 2 транзакции со своим набором входящих и исходящих сообщений.

Каждое действие, когда контракт принимает сообщение в качестве входных данных (инициированное им), обрабатывает его и генерирует или не генерирует исходящие сообщения в качестве выходных данных, называется `транзакцией`. Подробнее о них можно прочитать [здесь](/v3/documentation/smart-contracts/message-management/messages-and-transactions#what-is-a-transaction).

Подобные `транзакции` могут выполняться **длительный период** времени. Технически, транзакции с очередями сообщений объединяются в блоки, которые в свою очередь обрабатываются валидаторами. Асинхронная природа блокчейна TON **не позволяет предсказать хэш и lt (логическое время) транзакции** на этапе отправки сообщения.

Принятая в блок `транзакция` является окончательной и не может быть изменена.

:::info Подтверждение транзакции
Транзакции TON необратимы после всего лишь одного подтверждения. Для лучшего пользовательского опыта рекомендуется избегать ожидания дополнительных блоков после завершения транзакций в блокчейне TON. Подробнее читайте в [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

Смарт-контракты выплачивают несколько видов [комиссий](/v3/documentation/smart-contracts/transaction-fees/fees) за транзакции. Обычно они вычитаются с баланса входящего сообщения. Формат работы зависит от [режима работы сообщений](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes).Размер комиссий напрямую зависит от конфигурации воркчейна – с максимальными комиссиями в `masterchain` и существенно более низкими комиссиями в `basechain`.

## Типы цифровых активов на TON

TON имеет три типа цифровых активов.

- Toncoin, основной токен сети. Он используется для всех основных операций в блокчейне, например, для оплаты комиссий за газ или стейкинга для валидации.
- Активы контрактов, такие как токены и NFT, которые аналогичны стандартам ERC-20/ERC-721 и управляются произвольными контрактами и, таким образом, могут требовать настраиваемых правил для обработки. Вы можете найти больше информации об их обработке в статьях о [обработке NFT](/v3/guidelines/dapps/asset-processing/nft-processing/nfts) и [обработке жетонов](/v3/guidelines/dapps/asset-processing/jettons).
- Собственный токен – это особый вид активов, который можно прикрепить к любому сообщению в сети. Однако данные активы в настоящее время не используются, поскольку функциональность для выпуска новых собственных токенов закрыта.

## Взаимодействие с блокчейном TON

Основные операции в блокчейне TON можно выполнять через TonLib. Это общая библиотека, которая может быть скомпилирована вместе с узлом TON и предоставлять API для взаимодействия с блокчейном через так называемые lite server (серверы для lite clients).TonLib следует подходу без доверия, проверяя доказательства для всех входящих данных. Таким образом, при взаимодействии нет необходимости в доверенном поставщике данных.Методы, доступные TonLib, перечислены [в схеме TL](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L234). Их можно использовать как общую библиотеку через [обертки](/v3/guidelines/dapps/asset-processing/payments-processing/#sdks).

## Читать далее

После прочтения этой статьи, советуем ознакомиться со следующими разделами:

1. [Обработка платежей](/v3/guidelines/dapps/asset-processing/payments-processing), чтобы узнать, как работать с `TON coins`
2. [Обработка жетонов](/v3/guidelines/dapps/asset-processing/jettons), чтобы узнать, как работать с `jettons` (иногда называемыми `tokens`)
3. [Обработка NFT](/v3/guidelines/dapps/asset-processing/nft-processing/nfts), чтобы узнать, как работать с NFT (это особый тип  `jetton`)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/dapps/assets/usdt.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/dapps/assets/usdt.md
================================================
import Button from '@site/src/components/button'

# Обработка USDT

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Tether

Стейблкоины — это тип криптовалюты, стоимость которой привязана 1:1 к другому активу, например, фиатной валюте или золоту, для поддержания стабильной цены. До недавнего времени существовал токен jUSDT, представляющий собой обернутый токен ERC-20 Ethereum, связанный с <a href="https://bridge.ton.org" target="_blank">bridge.ton.org</a>. Но 18.04.2023 состоялся публичный запуск **встроенного** токена USD₮, выпущенного компанией <a href="https://tether.to/en/" target="_blank">Tether</a>. После запуска USD₮, jUSDT перешел в статус второго приоритета, но по-прежнему используется в качестве альтернативы или дополнения к USD₮ в различных сервисах.

В блокчейне TON USD₮ поддерживается как [жетон](/v3/guidelines/dapps/asset-processing/jettons).

:::info
Чтобы интегрировать токен Tether USD₮ в блокчейне TON, используйте адрес контракта: [EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs](https://tonviewer.com/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs?section=jetton)
:::

<Button href="https://github.com/ton-community/assets-sdk" colorType="primary" sizeType={'sm'}>Assets SDK</Button>
<Button href="/v3/guidelines/dapps/asset-processing/jettons" colorType={'secondary'} sizeType={'sm'}>Jetton Processing</Button>
<Button href="https://github.com/ton-community/tma-usdt-payments-demo?tab=readme-ov-file#tma-usdt-payments-demo" colorType={'secondary'} sizeType={'sm'}>TMA USDT payments demo</Button>

## Преимущества USD₮ на TON

### Бесшовная интеграция Telegram

[USD₮ на TON](https://ton.org/borderless) будет бесшовно интегрирован в Telegram, предлагая уникальный удобный интерфейс, который позиционирует TON как самый удобный блокчейн для транзакций USDt. Эта интеграция упростит DeFi для пользователей Telegram, сделав его более доступным и понятным.

### Низкие комиссии за транзакции

Комиссии за переводы Ethereum USD₮ рассчитываются динамически в зависимости от нагрузки на сеть. Вот почему транзакции могут стать дорогими.

```cpp
transaction_fee = gas_used * gas_price
```

- `gas_used` это количество газа, используемого при выполнении транзакции.
- `gas_price` - это стоимость одной единицы газа в Gwei, рассчитываемая динамически.

С другой стороны, средняя комиссия за отправку любой суммы USD₮ в блокчейне TON в настоящее время составляет около 0,0145 TON. Даже если цена TON увеличится в 100 раз, транзакции [останутся сверхдешевыми](/v3/documentation/smart-contracts/transaction-fees/fees#average-transaction-cost). Основная команда разработчиков TON оптимизировала смарт-контракт Tether, сделав его в три раза дешевле любого другого жетона.

### Более быстрый и масштабируемый

Высокая пропускная способность TON и быстрое время подтверждения позволяют обрабатывать транзакции USD₮ быстрее, чем когда-либо прежде.

## Дополнительные сведения

:::caution ВАЖНО

См. важные [рекомендации](/v3/guidelines/dapps/asset-processing/jettons).
:::

## См. также

- [Обработка платежей](/v3/guidelines/dapps/asset-processing/payments-processing)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/dapps/defi/coins.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/dapps/defi/coins.md
================================================
# Собственный токен: Toncoin

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Собственная криптовалюта блокчейна TON — **Toncoin**.

Комиссии за транзакции, платежи за газ (т. е. сборы за обработку сообщений смарт-контракта) и платежи за постоянное хранение оплачиваются в Toncoin.

Toncoin используется для внесения депозитов, необходимых для того, чтобы стать валидатором блокчейна.

Процесс осуществления платежей в Toncoin описан в [соответствующем разделе](/v3/guidelines/dapps/asset-processing/payments-processing).

Вы можете узнать, где купить или обменять Toncoin на [веб-сайте](https://ton.org/coin).

## Дополнительные валюты

Блокчейн TON поддерживает до 2^32 встроенных дополнительных валют.

Балансы дополнительных валют могут храниться на каждом блокчейн-аккаунте и автоматически переводиться на другие аккаунты (во внутреннем сообщении от одного смарт-контракта к другому можно указать хэш-карту значений дополнительных валют в дополнение к количеству Toncoin).

TLB: `extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32)) = ExtraCurrencyCollection;` - хэш-карта идентификатора валюты и суммы.

Однако дополнительные валюты могут только храниться и передаваться (как Toncoin) и не имеют собственного произвольного кода или функциональности.

Обратите внимание, что если будет создано большое количество дополнительных валют, аккаунты "раздуются", поскольку им нужно будет хранить их.

Таким образом, дополнительные валюты лучше всего использовать для известных децентрализованных валют (например, Wrapped Bitcoin или Ether), и создание такой дополнительной валюты должно быть довольно дорогим.

[Жетоны](/v3/documentation/dapps/defi/tokens#jettons-fungible-tokens) подходят для других задач.

На данный момент на блокчейне TON не создано дополнительных валют. Блокчейн TON имеет полную поддержку дополнительных валют для аккаунтов и сообщений, но контракт системы minter для их создания еще не создан.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/dapps/defi/subscriptions.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/dapps/defi/subscriptions.md
================================================
# Подписки на контент

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Благодаря тому, что транзакции в блокчейне TON выполняются быстро, а сетевые сборы низкие, вы можете обрабатывать повторяющиеся платежи on-chain с помощью смарт-контрактов.

Например, пользователи могут подписываться на цифровой контент (или что-либо еще) и получать ежемесячную плату в размере 1 TON.

:::tip
Эта информация относится только к кошелькам версии v4. В старых кошельках этой функции нет; она также может быть изменена в будущих версиях.
:::

:::warning
Subscription contract requires authorization exactly once, on installation; then it can withdraw TON as it pleases. Do your own research before attaching unknown subscriptions.

С другой стороны, пользователь не может установить подписку без своего ведома.
:::

## Пример процесса

- Пользователи используют кошелек v4. Он позволяет использовать дополнительные смарт-контракты, известные как плагины, для расширения его функциональности.

   После проверки их функциональности пользователь может одобрить адреса доверенных смарт-контрактов (плагинов) для своего кошелька. После этого доверенные смарт-контракты могут вывести Toncoin из кошелька. Это похоже на «Бесконечное одобрение» в некоторых других блокчейнах.

- Промежуточный смарт-контракт подписки, используется между каждым пользователем и сервисом в качестве плагина кошелька.

   Этот смарт-контракт гарантирует, что указанная сумма Toncoin будет списана с кошелька пользователя не чаще одного раза в течение указанного периода.

- Backend сервиса инициирует платежи на регулярной основе, отправляя внешнее сообщение в смарт-контракты подписки.

- И пользователь, и сервис могут решить, что подписка им больше не нужна, и прекратить ее.

## Примеры смарт-контрактов

- [Исходный код смарт-контракта Wallet v4](https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc)
- [Исходный код смарт-контракта Subscription](https://github.com/ton-blockchain/wallet-contract/blob/main/func/simple-subscription-plugin.fc)

## Реализация

Хорошим примером реализации являются децентрализованные подписки на Toncoin на приватные каналы в Telegram с помощью бота [@donate](https://t.me/donate) и кошелька [Tonkeeper](https://tonkeeper.com).



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/dapps/defi/tokens.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/dapps/defi/tokens.mdx
================================================
import Button from '@site/src/components/button'

# Токены (FT, NFT)

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

[Обзор распределенных токенов TON](https://telegra.ph/Scalable-DeFi-in-TON-03-30)

> Токены и NFT на базе TON децентрализованы, что позволяет избежать единых точек отказа и узких мест.
>
> Каждый NFT в данной коллекции представляет собой отдельный смарт-контракт. Баланс токенов для каждого пользователя хранится в отдельном кошельке пользователя.
>
> Смарт-контракты напрямую взаимодействуют друг с другом, распределяя нагрузку по всей сети.
>
> По мере роста числа пользователей и транзакций сеть поддерживает равномерную нагрузку, обеспечивая бесперебойную масштабируемость.

## Курс TON: Жетоны и NFT

:::tip
Перед началом курса убедитесь, что вы хорошо понимаете основы технологии блокчейна. Если у вас есть пробелы в знаниях, мы рекомендуем пройти курс [Основы Блокчейна с TON](https://stepik.org/course/201294/promo) ([RU версия](https://stepik.org/course/202221/), [CHN версия](https://stepik.org/course/200976/)).
Модуль 4 охватывает базовые знания о NFT и жетонах.
:::

[Курс по блокчейну TON и Телеграм](https://stepik.org/course/201855/) - это полное руководство по разработке на блокчейне TON.

Модуль 7 полностью охватывает разработку **NFT и Jettons**.

<Button href="https://stepik.org/course/176754/promo"
        colorType={'primary'} sizeType={'sm'}>

Проверьте курс по блокчейну TON

</Button>

<Button href="https://stepik.org/course/201638/promo"
        colorType={'secondary'} sizeType={'sm'}>

CHN

</Button>

<Button href="https://stepik.org/course/201855/promo"
        colorType={'secondary'} sizeType={'sm'}>

RU

</Button>

## Учебные пособия

- [Web3 Game Tutorial](/v3/guidelines/dapps/tutorials/web3-game-example) - Узнайте, как создать Web3-игру с использованием блокчейна TON.
- [Создайте свой первый жетон](/v3/guidelines/dapps/tutorials/mint-your-first-token/) - Узнайте, как развернуть и настроить свой первый жетон
- [[YouTube] TON Keeper founders Oleg Andreev and Oleg Illarionov on TON jettons](https://www.youtube.com/watch?v=oEO29KmOpv4)

### TON Speed Run

- [🚩 Challenge 1: Simple NFT Deploy](https://github.com/romanovichim/TONQuest1)
- [🚩 Challenge 2: Chatbot Contract](https://github.com/romanovichim/TONQuest2)
- [🚩 Challenge 3: Jetton Vending Machine](https://github.com/romanovichim/TONQuest3)
- [🚩 Challenge 4: Lottery/Raffle](https://github.com/romanovichim/TONQuest4)
- [🚩 Challenge 5: Create UI to interact with the contract in 5 minutes](https://github.com/romanovichim/TONQuest5)
- [🚩 Challenge 6: Analyzing NFT sales on the Getgems marketplace](https://github.com/romanovichim/TONQuest6)

## Жетоны (взаимозаменяемые токены)

### Руководства

- [Обработка жетонов TON](/v3/guidelines/dapps/asset-processing/jettons)
- [Разбор метаданных TON](/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing)

### Стандарты

- [Jettons standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)

### Смарт-контракты

- [Smart contracts implementation (FunC)](https://github.com/ton-blockchain/token-contract/)

### Jetton Deployer

Жетоны — это пользовательские взаимозаменяемые токены на блокчейне TON. Вы можете создать свой собственный токен на блокчейне TON, используя пример Jetton Deployer ниже:

- **[TON Minter](https://minter.ton.org/)** - Jetton Deployer dApp с открытым исходным кодом
- [Jetton Deployer - контракты](https://github.com/ton-defi-org/jetton-deployer-contracts) (FunC, TL-B)
- [Jetton Deployer - WebClient](https://github.com/ton-defi-org/jetton-deployer-webclient) (React, TypeScript)

### Инструменты для работы с жетонами

- [NFT Jetton Sale Contract](https://github.com/dvlkv/nft-jetton-sale-smc) - контракт продажи NFT с поддержкой жетонов
- [Scaleton](http://scaleton.io)- просмотр баланса вашего токена
- [@tegro/ton3-client](https://github.com/TegroTON/ton3-client#jettons-example) — SDK для запроса информации о жетонах

## NFT

### Стандарты

- [NFT standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)
- [SBT (Soulbound NFT) standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0085-sbt-standard.md)
- [NFTRoyalty standard extension](https://github.com/ton-blockchain/TEPs/blob/master/text/0066-nft-royalty-standard.md)

### Смарт-контракты

- [Smart contracts implementation (FunC)](https://github.com/ton-blockchain/token-contract/)
- [Getgems NFT, sale, auctions smart contracts (FunC)](https://github.com/getgems-io/nft-contracts)

### NFT minters

- [NFT Deployer](https://github.com/tondiamonds/ton-nft-deployer) от TON Diamonds (TypeScript, без комментариев)
- [NFT Minter example](https://github.com/ton-foundation/token-contract/tree/main/nft/web-example) (JavaScript, с комментариями)
- [NFT Minter using React](https://github.com/tonbuilders/tonbuilders-minter) (React, без комментариев)
- [NFT Deployer](https://github.com/anomaly-guard/nft-deployer) (Python, с комментариями)
- [NFT Minter using Golang](https://github.com/xssnick/tonutils-go#nft) (библиотека Golang, с комментариями и полными примерами)

### Инструменты для работы с NFT

- [LiberMall/tnt](https://github.com/LiberMall/tnt)-TNT - это универсальный инструмент командной строки для запроса, редактирования и создания новых невзаимозаменяемых токенов в The Open Network.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/dapps/defi/ton-payments.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/dapps/defi/ton-payments.md
================================================
# TON Payments

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

TON Payments - это платформа для каналов микроплатежей.

Она позволяет совершать мгновенные платежи без необходимости фиксации всех транзакций в блокчейне, оплаты связанных комиссий за транзакции (например, за потребленный газ) и ожидания пяти секунд, пока блок, содержащий рассматриваемые транзакции, не будет подтвержден.

Поскольку общая стоимость таких мгновенных платежей минимальна, их можно использовать для микроплатежей в играх, API и off-chain приложениях. [См. примеры](/v3/documentation/dapps/defi/ton-payments#examples).

- [Payments on TON](https://blog.ton.org/ton-payments)

## Платёжные каналы

### Смарт-контракты

- [ton-blockchain/payment-channels](https://github.com/ton-blockchain/payment-channels)

### SDK

Чтобы использовать платежные каналы, вам не нужны глубокие знания криптографии.

Вы можете использовать готовые SDK:

- [toncenter/tonweb](https://github.com/toncenter/tonweb) JavaScript SDK
- [toncenter/payment-channels-example](https://github.com/toncenter/payment-channels-example)-как использовать платежные каналыв tonweb.

### Примеры

Примеры использования платежных каналов можно найти у победителей [Hack-a-TON #1](https://ton.org/hack-a-ton-1):

- [grejwood/Hack-a-TON](https://github.com/Grejwood/Hack-a-TON)—OnlyTONs payments project ([веб-сайт](https://main.d3puvu1kvbh8ti.amplifyapp.com/), [видео](https://www.youtube.com/watch?v=38JpX1vRNTk))
- [nns2009/Hack-a-TON-1_Tonario](https://github.com/nns2009/Hack-a-TON-1_Tonario)—OnlyGrams payments project ([веб-сайт](https://onlygrams.io/), [видео](https://www.youtube.com/watch?v=gm5-FPWn1XM))
- [sevenzing/hack-a-ton](https://github.com/sevenzing/hack-a-ton)—Pay-per-Request API usage in TON ([видео](https://www.youtube.com/watch?v=7lAnbyJdpOA\&feature=youtu.be))
- [illright/diamonds](https://github.com/illright/diamonds)—Pay-per-Minute learning platform ([веб-сайт](https://diamonds-ton.vercel.app/), [видео](https://www.youtube.com/watch?v=g9wmdOjAv1s))

## См. также

- [Обработка платежей](/v3/guidelines/dapps/asset-processing/payments-processing)
- [TON Connect](/v3/guidelines/ton-connect/overview)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/dapps/oracles/about_blockchain_oracles.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/dapps/oracles/about_blockchain_oracles.md
================================================
# О оракулах

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Блокчейн-оракулы — это сущности, которые соединяют блокчейн с внешними системами, позволяя выполнять смарт-контракты на основе реальных входных данных.

## Как работают блокчейн-оракулы

Блокчейн-оракулы — это специализированные сервисы, которые действуют как мосты между реальным миром и технологией блокчейна. Они предоставляют смарт-контрактам релевантную и необходимую информацию из внешнего мира, такую ​​как курсы валют, статусы платежей или даже погодные условия. Эти данные помогают автоматизировать и выполнять условия контрактов без прямого вмешательства человека.

Блокчейн-оракулы - это специализированные сервисы, которые служат мостом между реальным миром и технологией блокчейн. Они предоставляют смарт-контрактам актуальную и необходимую информацию из внешнего мира, такую как курсы валют, статусы платежей или даже погодные условия. Эти данные помогают автоматизировать и выполнять условия контрактов без прямого вмешательства человека.

Основной принцип оракулов — их способность функционировать вне блокчейна, подключаясь к различным онлайн-источникам для сбора данных. Хотя оракулы не являются частью самого блокчейна, они играют ключевую роль в обеспечении его функциональности, выступая в качестве доверенного посредника, который надежно передает внешние данные в систему.

## Разновидности блокчейн-оракулов

Блокчейн-оракулы классифицируются по различным аспектам: механизму работы, источникам данных, направлению передачи данных и структуре управления. Давайте рассмотрим наиболее распространенные типы оракулов.

### Программные и аппаратные оракулы

Программные оракулы работают с онлайн-данными, которые хранятся в различных цифровых источниках, таких как базы данных, серверы, облачные хранилища. Аппаратные оракулы соединяют физический мир с цифровым, используя датчики и сканеры для передачи данных о реальных событиях в блокчейн.

### Входящие и исходящие оракулы

Входящие оракулы передают информацию в блокчейн, например, данные о погоде для договоров страхования. Исходящие оракулы, в свою очередь, отправляют данные из блокчейна во внешний мир, например уведомления о транзакциях. Использование обоих типов оракулов повышает общую надежность системы, обеспечивая непрерывный и точный поток данных в обоих направлениях. Это также снижает вероятность возникновения проблемы с одной точкой отказа за счет диверсификации источников и адресатов критически важных данных, снижая риск того, что сбой в одном компоненте может поставить под угрозу всю систему.

### Централизованные и децентрализованные оракулы

Централизованные оракулы контролируются одной стороной, что создает риски для безопасности и надежности. Децентрализованные оракулы используют несколько узлов для проверки данных, что делает их более безопасными и надежными.

### Оракулы для определенных смарт-контрактов

Эти оракулы разрабатываются индивидуально для определенных смарт-контрактов и могут быть не столь популярны из-за своей специфичности и высоких затрат на разработку.

### Кроссчейн-оракулы

Эти оракулы используются для передачи данных между различными блокчейнами и являются важным компонентом мостов. Они используются для децентрализованных приложений, которые используют межсетевые транзакции, такие как межсетевая передача криптоактивов из одной сети в другую.

## Применение блокчейн-оракулов

Блокчейн-оракулы строят мосты между цифровым миром блокчейнов и реальной жизнью, открывая широкий спектр применений. Давайте рассмотрим некоторые из наиболее популярных способов использования оракулов.

### DeFi (децентрализованные финансы)

Оракулы играют важную роль в экосистеме DeFi, предоставляя данные о рыночных ценах и криптовалютах. Ценовые оракулы позволяют платформам DeFi связывать стоимость токенов с реальными активами, что необходимо для контроля ликвидности и обеспечения позиций пользователей. Кроме того, оракулы жизненно важны для кредитных платформ, где точные ценовые данные обеспечивают надлежащую оценку залога и управление рисками, защищая как кредиторов, так и заемщиков. Это делает транзакции более прозрачными и безопасными, способствуя стабильности и надежности финансовых транзакций.

### Страхование

Оракулы могут автоматически считывать и анализировать данные из различных источников для определения наступления страховых событий. Это позволяет страховым компаниям автоматически выплачивать страховые возмещения, сокращая необходимость ручной обработки каждого случая и ускоряя время реагирования на страховые события.

### Логистика

Использование оракулов в логистике позволяет смарт-контрактам автоматически выполнять платежи и другие действия на основе данных, полученных от сканеров штрихкодов или датчиков на транспортных средствах. Это повышает точность и эффективность доставки за счет минимизации ошибок и задержек.

### Генерация случайных чисел

Сложно генерировать случайные числа в смарт-контрактах, поскольку все операции должны быть воспроизводимыми и предсказуемыми, что противоречит концепции случайности. Вычислительные оракулы решают эту проблему, перенося данные из внешнего мира в контракты. Они могут генерировать проверяемые случайные числа для игр и лотерей, обеспечивая честность и прозрачность результатов.

## Список оракулов в TON

- [Pyth Oracles](/v3/documentation/dapps/oracles/pyth)
- [RedStone Oracles](/v3/documentation/dapps/oracles/red_stone)




================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/dapps/oracles/pyth.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/dapps/oracles/pyth.mdx
================================================
import ThemedImage from '@theme/ThemedImage';

# Оракулы Pyth

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Как использовать данные в режиме реального времени в контрактах TON

Ценовые каналы Pyth в TON управляются через главный смарт-контракт TON Pyth, что обеспечивает бесперебойное взаимодействие с данными on-chain. В TON эти взаимодействия облегчаются специальными функциями в контракте Pyth receiver. Этот контракт служит интерфейсом для Pyth price feeds, обеспечивая поиск и обновление ценовых данных.

## Установите Pyth SDK

Установите Pyth TON SDK и другие необходимые зависимости с помощью npm или yarn:

```ts
   npm install @pythnetwork/pyth-ton-js @pythnetwork/hermes-client
   @ton/core @ton/ton @ton/crypto
```

   или

```ts
   yarn add @pythnetwork/pyth-ton-js @pythnetwork/hermes-client
   @ton/core @ton/ton @ton/crypto
```

## Напишите код клиента

Следующий фрагмент кода демонстрирует, как получать обновления цен, взаимодействовать с контрактом Pyth в TON и обновлять потоки цен:

- TON Mainnet: [EQBU6k8HH6yX4Jf3d18swWbnYr31D3PJI7PgjXT-flsKHqql](https://docs.pyth.network/price-feeds/contract-addresses/ton)
- TON Testnet: [EQB4ZnrI5qsP_IUJgVJNwEGKLzZWsQOFhiaqDbD7pTt_f9oU](https://docs.pyth.network/price-feeds/contract-addresses/ton)

В следующем примере используется контракт testnet. Для использования mainnet измените `PYTH_CONTRACT_ADDRESS_TESTNET` на `PYTH_CONTRACT_ADDRESS_MAINNET` соответственно. 

```ts
import { TonClient, Address, WalletContractV4 } from "@ton/ton";
import { toNano } from "@ton/core";
import { mnemonicToPrivateKey } from "@ton/crypto";
import { HermesClient } from "@pythnetwork/hermes-client";
import {
  PythContract,
  PYTH_CONTRACT_ADDRESS_TESTNET,
  calculateUpdatePriceFeedsFee,
} from "@pythnetwork/pyth-ton-js";
const BTC_PRICE_FEED_ID =
  "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43";
async function main() {
  // Initialize TonClient
  const client = new TonClient({
    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
    apiKey: "your-api-key-here", // Optional
  });
  // Create PythContract instance
  const contractAddress = Address.parse(PYTH_CONTRACT_ADDRESS_TESTNET);
  const contract = client.open(PythContract.createFromAddress(contractAddress));
  // Get current guardian set index
  const guardianSetIndex = await contract.getCurrentGuardianSetIndex();
  console.log("Guardian Set Index:", guardianSetIndex);
  // Get BTC price from TON contract
  const price = await contract.getPriceUnsafe(BTC_PRICE_FEED_ID);
  console.log("BTC Price from TON contract:", price);
  // Fetch latest price updates from Hermes
  const hermesEndpoint = "https://hermes.pyth.network";
  const hermesClient = new HermesClient(hermesEndpoint);
  const priceIds = [BTC_PRICE_FEED_ID];
  const latestPriceUpdates = await hermesClient.getLatestPriceUpdates(
    priceIds,
    { encoding: "hex" }
  );
  console.log("Hermes BTC price:", latestPriceUpdates.parsed?.[0].price);
  // Prepare update data
  const updateData = Buffer.from(latestPriceUpdates.binary.data[0], "hex");
  console.log("Update data:", updateData);
  // Get update fee
  const updateFee = await contract.getUpdateFee(updateData);
  console.log("Update fee:", updateFee);
  const totalFee =
    calculateUpdatePriceFeedsFee(BigInt(updateFee)) + BigInt(updateFee);
  // Update price feeds
  const mnemonic = "your mnemonic here";
  const key = await mnemonicToPrivateKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({
    publicKey: key.publicKey,
    workchain: 0,
  });
  const provider = client.open(wallet);
  await contract.sendUpdatePriceFeeds(
    provider.sender(key.secretKey),
    updateData,
    totalFee
  );
  console.log("Price feeds updated successfully.");
}
main().catch(console.error);
```

В этом фрагменте кода выполняется следующее:

1. Инициализирует `TonClient` и создает экземпляр `Pythoncontract`.
2. Извлекает текущий индекс guardian set и цену BTC из контракта TON.
3. Извлекает последние обновления цен из Hermes.
4. Подготавливает данные обновления и рассчитывает плату за обновление.
5. Обновляет информацию о ценах в контракте TON.

## Дополнительные ресурсы

Вам могут пригодиться эти дополнительные ресурсы для разработки вашего приложения TON:

- [Документация TON](https://ton.org/docs/)
- [Pyth Price Feed IDs](https://pyth.network/developers/price-feed-ids)
- [Pyth TON Contract](https://github.com/pyth-network/pyth-crosschain/tree/main/target_chains/ton/contracts)
- [Pyth TON SDK](https://github.com/pyth-network/pyth-crosschain/tree/main/target_chains/ton/sdk)
- [Пример Pyth TON](https://github.com/pyth-network/pyth-examples/tree/main/price_feeds/ton/sdk_js_usage)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/dapps/oracles/red_stone.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/dapps/oracles/red_stone.mdx
================================================
import ThemedImage from '@theme/ThemedImage';

# Оракулы RedStone

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Как оракулы RedStone работают с TON

Оракулы RedStone используют альтернативную конструкцию предоставления данных оракула смарт-контрактам. Вместо постоянного сохранения данных в хранилище контракта (поставщиками данных) информация передается on-chain только при необходимости (конечными пользователями). До этого момента данные остаются в децентрализованном слое кэша, который поддерживается шлюзами RedStone light cache и
протоколе трансляции потоковых данных. Данные передаются в контракт конечными пользователями, которые должны прикреплять подписанные
пакеты данных к своим вызовам функций. Целостность информации проверяется on-chain посредством проверки подписей.

Чтобы узнать больше о дизайне оракулов RedStone, перейдите в [документацию RedStone](https://docs.redstone.finance/docs/introduction)

## Ссылки на документацию

- [Redstone TON Connector](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/ton-connector)

## Смарт-контракты

### price_manager.fc

- Пример контракта оракула, который использует данные оракулов RedStone [price_manager.fc](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/contracts/price_manager.fc), написанный на
  FunC. Требуется [Обновление TVM 2023.07](/v3/documentation/tvm/changelog/tvm-upgrade-2023-07).

#### начальные данные

Как упоминалось выше, пакеты данных, переданные в контракт, проверяются проверкой подписи.
Чтобы быть учтенными для достижения `signer_core_threshold`, подписант, подписывающий переданные данные,
должен быть одним из `signers`, переданных в исходных данных. Также необходимо `signer_count_threshold`, чтобы быть переданным.

Из-за архитектуры контрактов TON исходные данные должны соответствовать структуре хранения контракта,
которая построена следующим образом:

```ts
  begin_cell()
    .store_uint(signer_count_threshold, 8)  /// number as passed below
    .store_uint(timestamp, TIMESTAMP_BITS)  /// initially 0 representing the epoch 0
    .store_ref(signers)                     /// serialized tuple of values passed below
  .end_cell();
```

Значение `signers` должно быть передано как сериализованный `tuple` из `int`.См. [tuple](https://github.com/ton-core/ton-core/blob/main/src/tuple/tuple.ts).

<!-- Чтобы определить начальные (хранимые) данные для контракта Prices, используйте предопределенный
класс [PriceManagerInitData.ts](../src/price-manager/PriceManagerInitData.ts). -->

В параметрах функции ниже каждый `feed_id` представляет собой строку, закодированную в `int`, что означает, что это значение,
состоящее из шестнадцатеричных значений определенных букв в строке. Например:
`'ETH'` как `int` равно `0x455448` в шестнадцатеричном или `4543560` в десятичном, как `256*256*ord('E')+256*ord('T')+ord('H')`.

Вы можете использовать: `feed_id=hexlify(toUtf8Bytes(feed_string))` для преобразования определенных значений или
[конечной точки](https://cairo-utils-web.vercel.app/)

Значение `feed_ids` должно быть передано как сериализованный `tuple` из `int`.

Значение `payload` упаковывается из массива байтов, представляющих сериализованную полезную нагрузку RedStone.См. раздел [Упаковка полезной нагрузки TON RedStone](#ton-redstone-payload-packing) ниже, а также файл [constants.fc](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/contracts/redstone/constants.fc), содержащий все необходимые константы длины `int`.

#### get_prices

```func
(cell) get_prices_v2(cell data_feed_ids, cell payload) method_id;
```

Функция обрабатывает on-chain `payload`, переданный в качестве аргумента,
и возвращает `cell` агрегированных значений каждого канала, переданного в качестве идентификатора внутри `feed_ids`.

Из-за ограничения длины метода HTTP GET в TON API v4, функция написана для TON API v2.

Это просто функции `method_id` — они не изменяют хранилище контракта и не потребляют TON.

#### OP_REDSTONE_WRITE_PRICES

Независимо от обработки на лету, также существует метод обработки `payload` on-chain, но
сохраняющий/записывающий агрегированные значения в хранилище контракта. Значения сохраняются в хранилище контракта и затем могут быть прочитаны с помощью функции `read_prices`. Метку времени последнего сохранения/записи данных в контракт можно прочитать с помощью функции `read_timestamp`.

Метод должен быть вызван как внутреннее сообщение TON. Аргументы сообщения:

- `int`, представляющий имя RedStone_Write_Prices, хешированное keccak256, как определено
  в [constants.ts](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/src/config/constants.ts)
- `cell` - ссылка, представляющая `data_feed_ids` как сериализованный `tuple` из `int`
- `cell` - ссылка, представляющая упакованную полезную нагрузку RedStone

```func
    int op = in_msg_body~load_uint(OP_NUMBER_BITS);

    if (op == OP_REDSTONE_WRITE_PRICES) {
        cell data_feeds_cell = in_msg_body~load_ref();
        cell payload_cell = in_msg_body~load_ref();

    // ...
    }
```

Это внутреннее сообщение - оно потребляет газ и изменяет хранилище контракта, поэтому должно быть оплачено TON.

Посмотрите, как это работает на: https://ton-showroom.redstone.finance/

#### read_prices

```func
(tuple) read_prices(tuple data_feed_ids) method_id;
```

Функция считывает значения, сохраняющиеся в хранилище контракта, и возвращает кортеж, соответствующий переданным `feed_ids`.
Функция не изменяет хранилище и может считывать только агрегированные значения `feed_ids`, сохраненные с помощью функции `write_prices`.

Это просто функция `method_id` - она не изменяет хранилище контракта и не потребляет TON.

#### read_timestamp

```func
(int) read_timestamp() method_id;
```

Возвращает временную метку данных, которые были в последний раз сохранены/записаны в хранилище контракта с помощью сообщения `OP_REDSTONE_WRITE_PRICES`.

Это просто функция `method_id` — она не изменяет хранилище контракта и не потребляет TON.

### price_feed.fc

Из-за архитектуры контрактов TON исходные данные должны соответствовать структуре хранения контракта,
которая построена следующим образом:

```ts
beginCell()
  .storeUint(BigInt(hexlify(toUtf8Bytes(this.feedId))), consts.DATA_FEED_ID_BS * 8)
  .storeAddress(Address.parse(this.managerAddress))
  .storeUint(0, consts.DEFAULT_NUM_VALUE_BS * 8)  /// initially 0 representing the epoch 0
  .storeUint(0, consts.TIMESTAMP_BS * 8)
  .endCell();
```

Чтобы определить исходные (хранимые) данные для контракта Price feed, используйте предопределенный
класс [PriceFeedInitData.ts](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/src/price-feed/PriceFeedInitData.ts).

#### OP_REDSTONE_FETCH_DATA

Независимо от считывания значений, сохраняющихся в контракте, из-за пределов сети,
существует возможность получения значения, хранящегося в контракте, для `feed_id` on-chain напрямую.
Необходимо вызвать внутреннее сообщение `OP_REDSTONE_FETCH_DATA`. Аргументы сообщения:

- `int`, представляющий имя `RedStone_Fetch_Data`, хешированное keccak256, как определено
  в [constants.ts](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/src/config/constants.ts)
- `int`, представляющий значение `feed_id`.
- `slice`, представляющий `initial_sender` сообщения, чтобы они могли перенести оставшийся баланс транзакции
  при возврате транзакции.

```func
    int op = in_msg_body~load_uint(OP_NUMBER_BITS);

    if (op == OP_REDSTONE_FETCH_DATA) {
        int feed_id = in_msg_body~load_uint(DATA_FEED_ID_BITS);
        cell initial_payload = in_msg_body~load_ref();

        // ...
    }
```

Возвращаемое сообщение `OP_REDSTONE_DATA_FETCHED` отправляется отправителю, содержащее `value` и `timestamp` сохраненного значения. Затем сообщение может быть извлечено отправителем и обработано или сохранено в хранилище
отправителя.
Начальная полезная нагрузка `ref` (`initial_payload`) добавляется как ссылка, содержащая, например, отправителя первого сообщения,
чтобы позволить им переносить оставшийся баланс транзакции.

```ts
begin_cell()
  .store_uint(value, MAX_VALUE_SIZE_BITS)
  .store_uint(timestamp, TIMESTAMP_BITS)
  .store_ref(initial_payload)
  .end_cell()
```

Это внутреннее сообщение — оно потребляет газ и изменяет хранилище контракта, поэтому должно быть оплачено TON.

#### get_price_and_timestamp

```func
(int, int) get_price_and_timestamp() method_id;
```

Возвращает значение и временную метку последних сохраненных/записанных данных в хранилище адаптера, отправляя сообщение `OP_REDSTONE_FETCH_DATA` и извлекая возвращенное значение сообщения `OP_REDSTONE_DATA_FETCHED`.

Это просто функция `method_id` — она не изменяет хранилище контракта и не потребляет TON.

### single_feed_man.fc

#### начальные данные

Аналогично начальным данным `prices` и `price_feed`. Из-за архитектуры контрактов TON исходные данные должны соответствовать структуре хранения контракта, которая построена следующим образом:

```ts
beginCell()
  .storeUint(BigInt(hexlify(toUtf8Bytes(this.feedId))), consts.DATA_FEED_ID_BS * 8)
  .storeUint(this.signerCountThreshold, SIGNER_COUNT_THRESHOLD_BITS)
  .storeUint(0, consts.DEFAULT_NUM_VALUE_BS * 8)
  .storeUint(0, consts.TIMESTAMP_BS * 8)
  .storeRef(serializeTuple(createTupleItems(this.signers)))
  .endCell();
```

Чтобы определить исходные (хранимые) данные для контракта Prices, используйте предопределенный
класс [SingleFeedManInitData.ts](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/src/single-feed-man/SingleFeedManInitData.ts).

Контракт, похожий на `price_manager`, но поддерживающий
только один канал, чтобы исключить необходимость взаимодействия между контрактами feed и manager.

#### get_price

```func
(int, int) get_price(cell payload) method_id;
```

Аналогично `get_prices`, но без первого аргумента (`data_feed_ids`), поскольку он был настроен во время инициализации. Возвращает также минимальную временную метку переданных пакетов данных.

#### read_price_and_timestamp

```func
(int, int) read_price_and_timestamp() method_id;
```

Работает как функция `get_price_and_timestamp`.

#### OP_REDSTONE_WRITE_PRICE

Аналогично `OP_REDSTONE_WRITE_PRICES`, но без указания первой ссылки на ячейку (`data_feed_ids`), как это было настроено во время инициализации.

```func
    int op = in_msg_body~load_uint(OP_NUMBER_BITS);

    if (op == OP_REDSTONE_WRITE_PRICE) {
        cell payload_cell = in_msg_body~load_ref();

        // ...
    }
```

### sample_consumer.fc

Пример потребителя для данных, хранящихся в `price_feed`. Работает также с `single_feed_man`.
Необходимо передать `price_feed` для вызова.

#### начальные данные

Аналогично начальным данным `price_feed`. Из-за архитектуры контрактов TON исходные данные должны соответствовать структуре хранения контракта, которая построена следующим образом:

```ts
beginCell()
  .storeAddress(Address.parse(this.feedAddress))
  .endCell();
```

Чтобы определить исходные (хранимые) данные для контракта Prices, используйте предопределенный
класс [SampleConsumerInitData.ts](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/src/sample-consumer/SampleConsumerInitData.ts).

Контракт вызывает единый канал.

#### OP_REDSTONE_READ_DATA

Существует возможность извлечения значения, хранящегося в контракте для `feed_id` on-chain напрямую.
Необходимо вызвать внутреннее сообщение `OP_REDSTONE_READ_DATA`. Аргументы сообщения:

- `slice`, представляющий `initial_sender` сообщения, чтобы позволить им переносить оставшийся баланс транзакции,
  когда возвращается транзакция.

```func
    int op = in_msg_body~load_uint(OP_NUMBER_BITS);

    if (op == OP_REDSTONE_READ_DATA) {
        cell initial_payload = in_msg_body~load_ref();

        // ...
    }
```

Возвращающееся сообщение `OP_REDSTONE_DATA_READ` отправляется отправителю, содержащее `feed_id`, `value` и `timestamp` сохраненного значения. Затем сообщение можно извлечь у отправителя и обработать или сохранить в хранилище отправителя.
Исходная полезная нагрузка `ref` (`initial_payload`) добавляется как ссылка, содержащая, например, отправителя первого сообщения,
чтобы позволить им переносить оставшийся баланс транзакции.

```ts
begin_cell()
  .store_uint(value, MAX_VALUE_SIZE_BITS)
  .store_uint(timestamp, TIMESTAMP_BITS)
  .store_ref(initial_payload)
  .end_cell()
```

Это внутреннее сообщение — оно потребляет газ и изменяет хранилище контракта, поэтому должно быть оплачено TON.

## Упаковка полезной нагрузки TON RedStone

Из-за ограничений размера сумки в TON [см.](/v3/documentation/data-formats/tlb/cell-boc),
данные полезной нагрузки RedStone, представленные в виде шестнадцатеричной строки, необходимо было передать в контракт более сложным способом.

Имея полезную нагрузку RedStone, определенную [здесь](https://docs.redstone.finance/img/payload.png),
данные должны быть переданы как ячейка, построенная следующим образом.

1. Основная _полезная нагрузка_ `cell` состоит из:

   1. метаданных в **битах уровня данных**, состоящих из частей, как на изображении:

     ![payload-metadata.png](/img/docs/oracles/red-stone/payload-metadata.png)

   1. **ref**, содержащий `udict`, индексированный последовательными натуральными числами (начиная с 0), содержащий список **data_package** `cell`.
2. Каждая _data-package_ `cell` состоит из:

   1. подпись пакета данных в **битах уровня данных**:

     ![payload-metadata.png](/img/docs/oracles/red-stone/payload-metadata.png)

   1. одной **ref** на `cell`, содержащей данные остальной части пакета данных на его **уровне данных**:

     ![payload-metadata.png](/img/docs/oracles/red-stone/data-package-data.png)

#### Текущие ограничения реализации

- Полезная нагрузка RedStone должна быть извлечена путем явного определения каналов данных,
  что приводит к **одной точке данных**, принадлежащей **одному пакету данных**.
- Размер неподписанных метаданных не должен превышать `127 - (2 + 3 + 9) = 113` байт.

#### Помощник

Метод `createPayloadCell` в файле [create-payload-cell.ts](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/src/create-payload-cell.ts)
проверяет ограничения и подготавливает данные для отправки в контракт, как описано выше.

#### Пример сериализации

На изображении ниже содержатся данные для `2` каналов, умноженные на `2` уникальных подписантов:
![payload-metadata.png](/img/docs/oracles/red-stone/sample-serialization.png)

## Возможные ошибки транзакции

- Количество подписантов, восстановленных из подписей, соответствующих `addresses`, переданным в инициализаторе,
  должно быть больше или равно `signer_count_threshold` в конструкторе для каждого канала.
  - В противном случае он выдает ошибку `300`, увеличенную на первый индекс переданного
    канала, который нарушил проверку.
- Метка времени пакетов данных должна быть не старше 15 минут относительно `block_timestamp`.
  - В противном случае он выдает ошибку `200`, увеличенной на первый индекс пакета данных полезной нагрузки, который нарушил проверку, дополнительно увеличенной на `50`, если временная метка пакета слишком в будущем.
- Внутренние сообщения потребляют газ и должны быть оплачены TON. Данные доступны на контракте
  сразу после успешного завершения транзакции.
- Другие коды ошибок определены [здесь](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/src/config/constants.ts)

## См. также

- [Документация по внутренним сообщениям](/v3/documentation/smart-contracts/message-management/internal-messages)
- [RedStone data-packing](https://docs.redstone.finance/docs/smart-contract-devs/how-it-works)
- [RedStone oracles smart-contracts](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/ton-connector/contracts)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tl.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tl.md
================================================
# TL

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

TL (Type Language - Язык типов) — язык описания структур данных.

Для структурирования полезных данных при обмене используются [схемы TL](https://github.com/ton-blockchain/ton/tree/master/tl/generate/scheme).

TL работает с 32-битными блоками. Соответственно, размер данных в TL должен быть кратен 4 байтам.
Если размер объекта не кратен 4, нам нужно добавить необходимое количество нулевых байт к кратному значению.

Числа всегда кодируются в порядке убывания.

Более подробную информацию о TL можно найти в [документации Telegram](https://core.telegram.org/mtproto/TL)

## Кодирование массива байт

Чтобы закодировать массив байт, нам сначала нужно определить его размер.
Если он меньше 254 байт, то используется кодировка с размером в 1 байт. Если больше,
то 0xFE записывается как первый байт, как показатель большого массива, и после него следуют 3 байта размера.

Например, мы кодируем массив `[0xAA, 0xBB]`, его размер равен 2. Мы используем размер 1 байт, а затем записываем сами данные, получаем `[0x02, 0xAA, 0xBB]`, готово, но видим, что конечный размер равен 3, а не кратен 4 байтам, тогда нам нужно добавить 1 байт заполнения, чтобы он стал 4. Результат: `[0x02, 0xAA, 0xBB, 0x00]`.

В случае, если нам нужно закодировать массив, размер которого будет равен, например, 396,
делаем так: 396 >= 254, поэтому используем 3 байта для кодирования размера и 1 байт индикатора превышения размера,
получаем: `[0xFE, 0x8C, 0x01, 0x00, байты массива]`, 396+4 = 400, что кратно 4, выравнивать не нужно.

## Неочевидные правила сериализации

Часто перед самой схемой пишется 4-байтовый префикс — ее идентификатор. Идентификатор схемы — это CRC32 с таблицей IEEE из текста схемы, при этом символы типа `;` и скобки `()` предварительно удаляются из текста. Сериализация схемы с префиксом идентификатора называется **упакованный**, это позволяет парсеру определить, какая схема идет перед ней, если есть несколько вариантов.

Как определить, нужно ли сериализовать как упакованный или нет? Если наша схема является частью другой схемы, то нужно посмотреть, как указывается тип поля. Если он явно указан, то мы сериализуем без префикса. Если неявно (таких типов много), то нам нужно сериализовать как упакованный. Пример:

```tlb
pub.unenc data:bytes = PublicKey;
pub.ed25519 key:int256 = PublicKey;
pub.aes key:int256 = PublicKey;
pub.overlay name:bytes = PublicKey;
```

У нас есть такие типы, если в схеме указан `PublicKey`, например `adnl.node id:PublicKey addr_list:adnl.addressList = adnl.Node`, то он явно не указан и нам нужно сериализовать с префиксом ID (упакованный). А если бы это было указано так: `adnl.node id:pub.ed25519 addr_list:adnl.addressList = adnl.Node`, то это было бы явно, и префикс был бы не нужен.

## Ссылки

*Вот [ссылка на оригинальную статью](https://github.com/xssnick/ton-deep-doc/blob/master/TL.md) [Олега Баранова](https://github.com/xssnick).*



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/block-layout.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/block-layout.md
================================================
# Расположение блоков

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::info
Чтобы максимально полно понять эту страницу, настоятельно рекомендуется ознакомиться с [языком TL-B](/v3/documentation/data-formats/tlb/cell-boc).
:::

Блок в блокчейне — это запись новых транзакций, которая после завершения добавляется в блокчейн как постоянная и неизменяемая часть этого децентрализованного реестра. Каждый блок содержит такую ​​информацию, как данные транзакции, время и ссылку на предыдущий блок, тем самым образуя цепочку блоков.

Блоки в блокчейне TON обладают довольно сложной структурой из-за общей сложности системы. На этой странице описывается структура и схема этих блоков.

## Блок

Исходная схема TL-B блока выглядит следующим образом:

```tlb
block#11ef55aa global_id:int32
    info:^BlockInfo value_flow:^ValueFlow
    state_update:^(MERKLE_UPDATE ShardState)
    extra:^BlockExtra = Block;
```

Давайте подробнее рассмотрим каждое поле.

## global_id:int32

Идентификатор сети, в которой создан этот блок. `-239` для основной сети и `-3` для тестовой сети.

## info:^BlockInfo

Это поле содержит информацию о блоке, такую ​​как его версия, порядковые номера, идентификаторы и другие флаги.

```tlb
block_info#9bc7a987 version:uint32
    not_master:(## 1)
    after_merge:(## 1) before_split:(## 1)
    after_split:(## 1)
    want_split:Bool want_merge:Bool
    key_block:Bool vert_seqno_incr:(## 1)
    flags:(## 8) { flags <= 1 }
    seq_no:# vert_seq_no:# { vert_seq_no >= vert_seqno_incr }
    { prev_seq_no:# } { ~prev_seq_no + 1 = seq_no }
    shard:ShardIdent gen_utime:uint32
    start_lt:uint64 end_lt:uint64
    gen_validator_list_hash_short:uint32
    gen_catchain_seqno:uint32
    min_ref_mc_seqno:uint32
    prev_key_block_seqno:uint32
    gen_software:flags . 0?GlobalVersion
    master_ref:not_master?^BlkMasterInfo
    prev_ref:^(BlkPrevInfo after_merge)
    prev_vert_ref:vert_seqno_incr?^(BlkPrevInfo 0)
    = BlockInfo;
```

| Поле                            | Тип                                          | Описание                                                                                                                                                              |
| ------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `version`                       | uint32                                       | Версия структуры блока.                                                                                                                               |
| `not_master`                    | (## 1)                    | Флаг, указывающий, является ли этот блок блоком мастерчейна.                                                                                          |
| `after_merge`                   | (## 1)                    | Флаг, указывающий, был ли этот блок создан сразу после слияния двух шардчейнов, поэтому у него два родительских блока                                                 |
| `before_split`                  | (## 1)                    | Флаг, указывающий, был ли этот блок создан сразу перед разделением его шардчейна                                                                                      |
| `after_split`                   | (## 1)                    | Флаг, указывающий, был ли этот блок создан сразу после разделения его шардчейна                                                                                       |
| `want_split`                    | Bool                                         | Флаг, указывающий, требуется ли разделение шардчейна.                                                                                                 |
| `want_merge`                    | Bool                                         | Флаг, указывающий, требуется ли слияние шардчейна.                                                                                                    |
| `key_block`                     | Bool                                         | Флаг, указывающий, является ли этот блок ключевым блоком.                                                                                             |
| `vert_seqno_incr`               | (## 1)                    | Увеличение вертикального порядкового номера.                                                                                                          |
| `флаги`                         | (## 8)                    | Дополнительные флаги для блока.                                                                                                                       |
| `seq_no`                        | #                                            | Порядковый номер, связанный с блоком.                                                                                                                 |
| `vert_seq_no`                   | #                                            | Вертикальный порядковый номер, связанный с блоком.                                                                                                    |
| `shard`                         | ShardIdent                                   | Идентификатор шарда, к которому принадлежит этот блок.                                                                                                |
| `gen_utime`                     | uint32                                       | Время генерации блока.                                                                                                                                |
| `start_lt`                      | uint64                                       | Начальное логическое время, связанное с блоком.                                                                                                       |
| `end_lt`                        | uint64                                       | Конечное логическое время, связанное с блоком.                                                                                                        |
| `gen_validator_list_hash_short` | uint32                                       | Короткий хэш, связанный со списком валидаторов на момент генерации этого блока.                                                                       |
| `gen_catchain_seqno`            | uint32                                       | [Catchain](/catchain.pdf) порядковый номер, связанный с этим блоком.                                                                                  |
| `min_ref_mc_seqno`              | uint32                                       | Минимальный порядковый номер указанного блока мастерчейна.                                                                                            |
| `prev_key_block_seqno`          | uint32                                       | Порядковый номер предыдущего ключевого блока.                                                                                                         |
| `gen_software`                  | GlobalVersion                                | Версия программного обеспечения, сгенерировавшего блок. Представлено только в том случае, если первый бит `version` установлен в `1`. |
| `master_ref`                    | BlkMasterInfo                                | Ссылка на главный блок, если блок не является главным. Сохраняется в ссылочном блоке.                                                 |
| `prev_ref`                      | BlkPrevInfo after_merge | Ссылка на предыдущий блок. Сохраняется в ссылочном блоке.                                                                             |
| `prev_vert_ref`                 | BlkPrevInfo 0                                | Ссылка на предыдущий блок в вертикальной последовательности, если он существует. Сохраняется в ссылочном блоке.                       |

### value_flow:^ValueFlow

В этом поле отображается поток валюты внутри блока, включая собранные комиссии и другие транзакции с валютой.

```tlb
value_flow#b8e48dfb ^[ from_prev_blk:CurrencyCollection
    to_next_blk:CurrencyCollection
    imported:CurrencyCollection
    exported:CurrencyCollection ]
    fees_collected:CurrencyCollection
    ^[
    fees_imported:CurrencyCollection
    recovered:CurrencyCollection
    created:CurrencyCollection
    minted:CurrencyCollection
    ] = ValueFlow;
```

| Поле             | Тип                                                                                 | Описание                                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `from_prev_blk`  | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Представляет поток валют из предыдущего блока.                                                 |
| `to_next_blk`    | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Представляет поток валют в следующий блок.                                                     |
| `imported`       | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Представляет собой поток валют, импортируемых в блок.                                          |
| `exported`       | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Представляет поток валют, экспортированных из блока.                                           |
| `fees_collected` | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Общая сумма сборов, собранных в блоке.                                                         |
| `fees_imported`  | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Сумма сборов, импортированных в блок. Ненулевое значение только в мастерчейне. |
| `recovered`      | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Сумма валют, восстановленных в блоке. Ненулевое значение только в мастерчейне. |
| `created`        | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Сумма новых валют, созданных в блоке. Ненулевое значение только в мастерчейне. |
| `minted`         | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Сумма валют, отчеканенных в блоке. Ненулевое значение только в мастерчейне.    |

## state_update:^(MERKLE_UPDATE ShardState)

Это поле представляет собой обновление состояния шарда.

```tlb
!merkle_update#02 {X:Type} old_hash:bits256 new_hash:bits256
    old:^X new:^X = MERKLE_UPDATE X;
```

| Поле       | Тип                       | Описание                                                                    |
| ---------- | ------------------------- | --------------------------------------------------------------------------- |
| `old_hash` | bits256                   | Старый хэш состояния шарда.                                 |
| `new_hash` | bits256                   | Новый хэш состояния шарда.                                  |
| `old`      | [ShardState](#shardstate) | Старое состояние шарда. Сохранено в ссылке. |
| `new`      | [ShardState](#shardstate) | Новое состояние шарда. Сохранено в ссылке.  |

### ShardState

`ShardState` может содержать либо информацию о шарде, либо, в случае если этот шард разделен, информацию о левой и правой разделенных частях.

```tlb
_ ShardStateUnsplit = ShardState;
split_state#5f327da5 left:^ShardStateUnsplit right:^ShardStateUnsplit = ShardState;
```

### ShardState Unsplitted

```tlb
shard_state#9023afe2 global_id:int32
    shard_id:ShardIdent
    seq_no:uint32 vert_seq_no:#
    gen_utime:uint32 gen_lt:uint64
    min_ref_mc_seqno:uint32
    out_msg_queue_info:^OutMsgQueueInfo
    before_split:(## 1)
    accounts:^ShardAccounts
    ^[ overload_history:uint64 underload_history:uint64
    total_balance:CurrencyCollection
    total_validator_fees:CurrencyCollection
    libraries:(HashmapE 256 LibDescr)
    master_ref:(Maybe BlkMasterInfo) ]
    custom:(Maybe ^McStateExtra)
    = ShardStateUnsplit;
```

| Поле                   | Тип                                                                                 | Обязательное | Описание                                                                                                                                                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `global_id`            | int32                                                                               | Да           | Идентификатор сети, к которой принадлежит этот шард. `-239` для mainnet и `-3` для testnet.                                                                                                   |
| `shard_id`             | ShardIdent                                                                          | Да           | Идентификатор шарда.                                                                                                                                                                                          |
| `seq_no`               | uint32                                                                              | Да           | Последний порядковый номер, связанный с этим шардом.                                                                                                                                                          |
| `vert_seq_no`          | #                                                                                   | Да           | Последний вертикальный порядковый номер, связанный с этим шардом.                                                                                                                                             |
| `gen_utime`            | uint32                                                                              | Да           | Время генерации, связанное с созданием шарда.                                                                                                                                                                 |
| `gen_lt`               | uint64                                                                              | Да           | Логическое время, связанное с созданием шарда.                                                                                                                                                                |
| `min_ref_mc_seqno`     | uint32                                                                              | Да           | Порядковый номер последнего упомянутого блока мастерчейна.                                                                                                                                                    |
| `out_msg_queue_info`   | OutMsgQueueInfo                                                                     | Да           | Информация об очереди исходящих сообщений этого шарда. Хранится в ссылке.                                                                                                                     |
| `before_split`         | ## 1                                                                                | Да           | Флаг, указывающий, будет ли разделение в следующем блоке этого шарда.                                                                                                                                         |
| `accounts`             | ShardAccounts                                                                       | Да           | Состояние учетных записей в шарде. Хранится в ссылке.                                                                                                                                         |
| `overload_history`     | uint64                                                                              | Да           | История событий перегрузки для шарда. Используется для балансировки нагрузки посредством шардинга.                                                                                            |
| `underload_history`    | uint64                                                                              | Да           | История событий недогрузки для шарда. Используется для балансировки нагрузки посредством шардинга.                                                                                            |
| `total_balance`        | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Да           | Общий баланс для шарда.                                                                                                                                                                                       |
| `total_validator_fees` | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Да           | Общая сумма сборов валидатора для шарда.                                                                                                                                                                      |
| `libraries`            | HashmapE 256 LibDescr                                                               | Да           | Хэш-карта описаний библиотек в этом шарде. В настоящее время непустая только в мастерчейне.                                                                                                   |
| `master_ref`           | BlkMasterInfo                                                                       | Нет          | Ссылка на информацию о главном блоке.                                                                                                                                                                         |
| `custom`               | McStateExtra                                                                        | Нет          | Дополнительные пользовательские данные для состояния шарда. Это поле присутствует только в мастерчейне и содержит все данные, специфичные для мастерчейна. Хранится в ссылке. |

### ShardState Splitted

| Поле    | Тип                                         | Описание                                                                                  |
| ------- | ------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `left`  | [ShardStateUnsplit](#shardstate-unsplitted) | Состояние левого разделенного шарда. Сохранено в ссылке.  |
| `right` | [ShardStateUnsplit](#shardstate-unsplitted) | Состояние правого разделенного шарда. Сохранено в ссылке. |

## extra:^BlockExtra

Это поле содержит дополнительную информацию о блоке.

```tlb
block_extra in_msg_descr:^InMsgDescr
    out_msg_descr:^OutMsgDescr
    account_blocks:^ShardAccountBlocks
    rand_seed:bits256
    created_by:bits256
    custom:(Maybe ^McBlockExtra) = BlockExtra;
```

| Поле             | Тип                           | Обязательное | Описание                                                                                                                                                                                                            |
| ---------------- | ----------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `in_msg_descr`   | InMsgDescr                    | Да           | Дескриптор входящих сообщений в блоке. Хранится в ссылке.                                                                                                                           |
| `out_msg_descr`  | OutMsgDescr                   | Да           | Дескриптор исходящих сообщений в блоке. Хранится в ссылке.                                                                                                                          |
| `account_blocks` | ShardAccountBlocks            | Да           | Коллекция всех транзакций, обработанных в блоке, вместе со всеми обновлениями состояний учетных записей, назначенных шарду. Хранится в ссылке.                                      |
| `rand_seed`      | bits256                       | Да           | Случайное начальное число для блока.                                                                                                                                                                |
| `created_by`     | bits256                       | Да           | Сущность (обычно открытый ключ валидатора), которая создала блок.                                                                                                                |
| `custom`         | [McBlockExtra](#mcblockextra) | Нет          | Это поле присутствует только в мастерчейне и содержит все данные, специфичные для мастерчейна. Пользовательские дополнительные данные для блока. Хранится в ссылке. |

### McBlockExtra

Это поле содержит дополнительную информацию о блоке мастерчейн.

```tlb
masterchain_block_extra#cca5
    key_block:(## 1)
    shard_hashes:ShardHashes
    shard_fees:ShardFees
    ^[ prev_blk_signatures:(HashmapE 16 CryptoSignaturePair)
    recover_create_msg:(Maybe ^InMsg)
    mint_msg:(Maybe ^InMsg) ]
    config:key_block?ConfigParams
    = McBlockExtra;
```

| Поле                  | Тип                             | Обязательное | Описание                                                                                                                                                |
| --------------------- | ------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key_block`           | ## 1                            | Да           | Флаг, указывающий, является ли блок ключевым.                                                                                           |
| `shard_hashes`        | ShardHashes                     | Да           | Хеши последних блоков соответствующих шардчейнов.                                                                                       |
| `shard_fees`          | ShardFees                       | Да           | Общая сумма сборов, собранных со всех шардов в этом блоке.                                                                              |
| `prev_blk_signatures` | HashmapE 16 CryptoSignaturePair | Да           | Подписи предыдущих блоков.                                                                                                              |
| `recover_create_msg`  | InMsg                           | Нет          | Сообщение, относящееся к восстановлению дополнительных валют, если таковые имеются. Хранится в ссылке.                  |
| `mint_msg`            | InMsg                           | Нет          | Сообщение, относящееся к чеканке дополнительных валют, если таковые имеются. Хранится в ссылке.                         |
| `config`              | ConfigParams                    | Нет          | Фактические параметры конфигурации для этого блока. Это поле присутствует только в том случае, если задано `key_block`. |

## См. также

- Оригинальное описание разметки блока из ​​технического документа



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/canonical-cell-serialization.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/canonical-cell-serialization.md
================================================
# Каноническая сериализация ячеек

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Вес ячейки

`Weight` это характеристика каждой ячейки в дереве ячеек, которая определяется следующим образом:

- Если ячейка является конечным узлом в дереве ячее: `weight = 1`;
- Для обычных ячеек (не листьев) вес — это сумма: `cell weight = children weight + 1`;
- Если ячейка является *special*, ее вес устанавливается равным нулю.

Приведенный ниже алгоритм объясняет, как и когда мы назначаем веса каждой ячейке для создания сбалансированного по весу дерева.

## Алгоритм переупорядочивания весов

Каждая ячейка является сбалансированным по весу деревом, и метод [reorder_cells()](https://github.com/ton-blockchain/ton/blob/15088bb8784eb0555469d223cd8a71b4e2711202/crypto/vm/boc.cpp#L249) переназначает веса на основе совокупного веса потомков. Порядок обхода — roots -> children. Это поиск в ширину, *вероятно*, используемый для сохранения линейности кэша. Он также запускает пересчет размера хэшей и переиндексирует bag (roots) и каждое дерево, устанавливает новые индексы для пустых ссылок. Переиндексация выполняется в глубину, хотя, возможно, есть что-то, что зависит от этого порядка индексации, поскольку в техническом описании указано, что это предпочтительнее.

Чтобы следовать сериализации bag of cells исходного узла, вам следует:

- Во-первых, если веса ячеек не установлены (узел делает это при импорте ячеек), мы устанавливаем вес для каждой ячейки на `1 + sum_child_weight`, где `sum_child_weight` — это сумма весов его дочерних узлов. Добавляем один, чтобы листья имели вес 1.

- Повторяем все корни для каждой корневой ячейки:
  - Проверьте, имеет ли каждая из его ссылок вес меньше, чем `maximum_possible_weight - 1 + ref_index`, разделенный на количество ссылок в корневой ячейке, чтобы они равномерно распределяли родительский вес, мы делаем (+ index), чтобы убедиться, что если язык при делении принимает значение 0, мы всегда получаем математически округленное число (например, для 5 / 3, c++ вернул бы значение 1, но здесь нам нужно значение 2)

  - Если какие-то ссылки нарушают это правило, мы добавляем их в список (или, что более эффективно, создаем битовую маску, как это делает исходный узел), а затем снова выполняем итерацию по ним и фиксируем их вес до `weight_left / invalid_ref_count`, где `weight_left` - это `maximum_possible_weight - 1 - sum_of_valid_refs_weights`. В коде это может быть реализовано как уменьшение переменной counter, которая сначала инициализируется значением `maximum_possible_weight - 1`, а затем уменьшается как `counter -= valid_ref_weight`. Таким образом, по сути, мы перераспределяем оставшийся вес между этими узлами (балансируем их)

- Снова перебираем корни для каждого корня:
  - Убедитесь, что новая сумма весов его ссылки меньше, чем `maximum_possible_weight`, проверьте, стала ли новая сумма меньше веса предыдущей корневой ячейки, и сопоставьте ее вес с новой суммой. (если `new_sum < root_cell_weight`, установите `root_cell_weight` равным `new_sum`)
  - Если новая сумма больше веса корня, то это должен быть особый узел, который имеет вес 0, установим его. (Увеличьте здесь количество внутренних хэшей на количество хэшей узла)

- Снова перебираем корни для каждого корня: Если это не особый узел (если его weight > 0), увеличим количество верхних хэшей на количество хэшей узла.

- Рекурсивно переиндексируем дерево:
  - Сначала мы просматриваем все корневые ячейки. Если мы не просматривали или не посещали этот узел раньше, рекурсивно проверьте все его ссылки на наличие специальных узлов. Если мы находим специальный узел, мы должны просмотреть его раньше других, это означает, что дочерние узлы этого специального узла будут первыми в списке (их индексы будут самыми низкими). Затем мы добавляем дочерние узлы других узлов (в порядке наибольшей глубины -> наибольшей высоты). Корни находятся в самом конце списка (у них самые большие индексы). Таким образом, в итоге мы получаем отсортированный список, где чем глубже находится узел, тем меньший у него индекс.

`maximum_possible_weight` это константа 64

## Обозначения

- Специальная ячейка не имеет веса (это 0)

- Убедитесь, что вес при импорте укладывается в 8 бит (weight \<= 255)

- Внутреннее количество хэшей — это сумма количества хэшей всех специальных корневых узлов

- Верхнее количество хэшей — это сумма количества хэшей всех остальных (не специальных) корневых узлов



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/cell-boc.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/cell-boc.mdx
================================================
import ThemedImage from '@theme/ThemedImage';

# Ячейки и пакеты ячеек (Cell & Bag of Cells (BoC))

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Cell

Ячейка представляет собой структуру данных в блокчейне TON. Ячейки могут хранить до 1023 бит и иметь до 4 ссылок на другие ячейки.

<br></br>
<ThemedImage
alt=""
sources={{
    light: '/img/docs/data-formats/tl-b-docs-5.png?raw=true',
    dark: '/img/docs/data-formats/tl-b-docs-5-dark.png?raw=true',
}}
/>
<br></br>

## Bag of Cells

Bag of Cells (BoC) - это формат для сериализации ячеек в массивы байтов, который более подробно описан в [схеме TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/tl/boc.tlb#L25).

<br></br>
<ThemedImage
alt=""
sources={{
    light: '/img/docs/data-formats/tl-b-docs-6.png?raw=true',
    dark: '/img/docs/data-formats/tl-b-docs-6-dark.png?raw=true',
}}
/>
<br></br>

В TON все состоит из ячеек, включая код контракта, хранимые данные, блоки, что обеспечивает упрощение и надежную гибкость процесса.

<br></br>
<ThemedImage
alt=""
sources={{
    light: '/img/docs/data-formats/tl-b-docs-4.png?raw=true',
    dark: '/img/docs/data-formats/tl-b-docs-4-dark.png?raw=true',
}}
/>
<br></br>

### Сериализация ячеек

Давайте проанализируем наш первый пример Bag of Cells :

<br></br>
<ThemedImage
alt=""
sources={{
    light: '/img/docs/data-formats/tl-b-docs-7.png?raw=true',
    dark: '/img/docs/data-formats/tl-b-docs-7-dark.png?raw=true',
}}
/>
<br></br>

```json
1[8_] -> {
  24[0AAAAA],
  7[FE] -> {
    24[0AAAAA]
  }
}
```

В этом примере у нас есть корневая ячейка размером 1 бит, которая имеет 2 ссылки: первая на 24-битную ячейку, а вторая на 7-битную ячейку, которая имеет 1 ссылку на 24-битную ячейку.

Чтобы эта структура работала так, как задумано, необходимо превратить ячейки в одну последовательность байтов. Для этого, во-первых, мы используем только уникальные типы ячеек, ниже представлены 3 из 4:

```json
1[8_]
24[0AAAAA]
7[FE]
```

:::note
Чтобы оставить только уникальные ячейки, их необходимо сравнить. Чтобы сделать это, нам нужно сравнить [хэши] (#cell-хэш) ячеек.
:::

```json
1[8_]      -> index 0 (root cell)
7[FE]      -> index 1
24[0AAAAA] -> index 2
```

Теперь давайте вычислим описания для каждой из 3 ячеек, упомянутых выше. Эти описания состоят из 2 байт, в которых хранятся флаги, содержащие информацию о длине данных и количестве связей с данными.

Первый байт - **дескриптор ссылок** - вычисляется как `r+8s+32l`, где `0 ≤ r ≤ 4` - количество ссылок ячеек, `0 ≤ s ≤ 1` - 1 для [экзотических](#special-exotic-cells) ячеек и 0 для обычных, а `0 ≤ l ≤ 3` - [уровней](#cell-level) ячейки.

Второй - **битовый дескриптор** - равен `floor(b / 8) + ceil (b / 8)`, где `0 <= b <= 1023` - количество бит в ячейке. Этот дескриптор представляет длину полных 4-битных групп данных ячейки (но не менее 1, если она не пустая).

Результат:

```json
1[8_]      -> 0201 -> 2 refs, length 1
7[FE]      -> 0101 -> 1 ref, length 1
24[0AAAAA] -> 0006 -> 0 refs, length 6
```

Для данных с неполными 4-битными группами в конец последовательности добавляется 1 бит. Это означает, что он обозначает конечный бит группы и используется для определения истинного размера неполных групп. Давайте добавим биты ниже:

```json
1[8_]      -> C0     -> 0b10000000->0b11000000
7[FE]      -> FF     -> 0b11111110->0b11111111
24[0AAAAA] -> 0AAAAA -> do not change (full groups)
```

Теперь давайте добавим индексы ссылок:

```json
0 1[8_]      -> 0201 -> refers to 2 cells with such indexes
1 7[FE]      -> 02 -> refers to cells with index 2
2 24[0AAAAA] -> no refs
```

И соединим все вместе:

```json
0201 C0     0201
0101 FF     02
0006 0AAAAA
```

И объединим это, объединив соответствующие строки в один массив байтов:
`0201c002010101ff0200060aaaaa`, размером 14 байт.

<details>
  <summary><b>Показать пример</b></summary>

```golang
func (c *Cell) descriptors() []byte {
  ceilBytes := c.bitsSz / 8
  if c.bitsSz%8 ! = 0 {
    ceilBytes++
  }

	// calc size
	ln := ceilBytes + c.bitsSz / 8

	specBit := byte(0)
	if c.special {
	  specBit = 8
	}

	return []byte{byte(len(c.refs)) + specBit + c.level*32, byte(ln)}
}
```

[Источник](https://github.com/xssnick/tonutils-go/blob/3d9ee052689376061bf7e4a22037ff131183afad/tvm/cell/serialize.go#L205)

</details>

### Упаковка Bag of Cells

Давайте упакуем ячейку из раздела выше. Мы уже сериализовали ее в плоский 14-байтовый массив.

Поэтому мы строим заголовок согласно его [схеме](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/tl/boc.tlb#L25).

```
b5ee9c72                      -> id tl-b of the BoC structure
01                            -> flags and size:(## 3), in our case the flags are all 0,
                                 and the number of bytes needed to store the number of cells is 1.
                                 we get - 0b0_0_0_00_001
01                            -> number of bytes to store the size of the serialized cells
03                            -> number of cells, 1 byte (defined by 3 bits size:(## 3), equal to 3.
01                            -> number of root cells - 1
00                            -> absent, always 0 (in current implementations)
0e                            -> size of serialized cells, 1 byte (size defined above), equal to 14
00                            -> root cell index, size 1 (determined by 3 size:(## 3) bits from header),
                                 always 0
0201c002010101ff0200060aaaaa  -> serialized cells
```

Далее мы объединяем все, что указано выше, в массив байтов в нашем окончательном BoC:
`b5ee9c7201010301000e000201c002010101ff0200060aaaaa`

Примеры реализации Bag of Cells: [Сериализация](https://github.com/xssnick/tonutils-go/blob/master/tvm/cell/serialize.go), [Десериализация](https://github.com/xssnick/tonutils-go/blob/master/tvm/cell/parse.go)

## Специальные (экзотические) ячейки

Как правило, ячейки, работающие на TON, делятся на два основных типа: обычные ячейки и специальные ячейки. Большинство ячеек, с которыми работают пользователи, являются обычными ячейками, отвечающими за перенос информации.

Тем не менее, для реализации внутренней функциональности сети иногда требуются специальные ячейки, которые используются для различных целей в зависимости от их подтипа.

## Уровень ячейки

Каждая ячейка имеет атрибут, называемый `Level`, который представлен целым числом от 0 до 3.

### Уровень обычных ячеек

Уровень обычной ячейки всегда равен максимальному из уровней всех ее ссылок:

```cpp
Lvl(c) = max(Lvl(r_0), ..., Lvl(r_i), ..., Lvl(r_e))
```

Где `i` — это индекс ссылки `c`, `e` — это количество ссылок `c`.

_Уровень обычной ячейки без ссылок равен нулю_

### Уровень экзотических ячеек

У экзотических ячеек есть разные правила установки их уровня, которые описаны в [этой](/v3/documentation/data-formats/tlb/exotic-cells) статье.

## Хэш ячейки

В большинстве случаев пользователи работают с обычными ячейками с уровнем 0, которые имеют только один хэш, называемый хэшем представления (или бесконечным хэшем).

Ячейка `c` с уровнем `Lvl(c) = l`, где `1 ≤ l ≤ 3` имеет хэш представления, а `l` **"более высокий"** хэш.

### Стандартный расчет хэша представления ячейки

Сначала нам нужно рассчитать представление ячейки (что похоже на сериализацию ячейки, описанную выше)

1. Вычислить байты дескрипторов
2. Добавить сериализованные данные ячейки
3. Для каждой ссылки ячейки добавить ее глубину
4. Для каждой ссылки ячейки добавить ее хэш представления
5. Вычислить хэш SHA256 результата

Давайте проанализируем следующие примеры:

#### Ячейка без ссылок

```json
32[0000000F]
```

1. Вычисление дескрипторов

Дескриптор ссылки равен `r+8s+32l = 0 + 0 + 0 = 0 = 00`

Дескриптор бит равен `floor(b / 8) + ceil (b / 8) = 8 = 08`

Объединив эти байты, мы получим `0008`

2. Сериализация данных ячейки

В этом случае у нас есть полные 4-битные группы, поэтому нам не нужно добавлять биты к данным ячейки. Результатом будет `0000000f`

3. Глубина ссылок

Мы пропускаем эту часть, потому что у нашей ячейки нет ссылок

4. Хэши ссылок

Мы пропускаем эту часть, потому что у нашей ячейки нет ссылок

5. Вычисление SHA256

Объединяя байты из предыдущих шагов, мы получаем `00080000000f`, а SHA256 из этой строки байтов равен `57b520dbcb9d135863fc33963cde9f6db2ded1430d88056810a2c9434a3860f9` — это хэш представления ячейки.

#### Ячейка со ссылками

```json
24[00000B] -> {
	32[0000000F],
	32[0000000F]
}
```

1. Вычисление дескрипторов

Ссылочный дескриптор равен `r+8s+32l = 2 + 0 + 0 = 0 = 02`

Битовый дескриптор равен `floor(b / 8) + ceil (b / 8) = 6 = 06`

Объединяя эти байты, получаем `0206`

2. Сериализация данных ячейки

В этом случае у нас есть полные 4-битные группы, поэтому нам не нужно добавлять биты к данным ячейки. Результатом будет `00000b`

3. Глубина ссылок

Глубина представлена ​​2 байтами. Наша ячейка имеет 2 ссылки, и глубина каждой из них равна нулю, поэтому результатом этого шага будет `00000000`.

4. Хэши ссылок

Для каждой ссылки мы добавляем ее хэш (мы вычислили выше), поэтому результат будет `57b520dbcb9d135863fc33963cde9f6db2ded1430d88056810a2c9434a3860f957b520dbcb9d135863fc33963cde9f6db2ded1430d88056810a2c9434a3860f9`

5. Вычисление SHA256

Объединяя байты из предыдущих шагов, мы получаем `020600000b0000000057b520dbcb9d135863fc33963cde9f6db2ded1430d88056810a2c9434a3860f957b520dbcb9d135863fc33963cde9f6db2ded1430d88056810a2c9434a3860f9`
а SHA256 из этой строки байтов равен `f345277cc6cfa747f001367e1e873dcfa8a936b8492431248b7a3eeafa8030e7` - это хэш представления ячейки.

### Вычисление более высоких хэшей

Более высокие хэши обычной ячейки `c` вычисляются аналогично хэшу ее представления, но с использованием более высоких хэшей ее ссылок вместо хэшей их представления.

Экзотические ячейки имеют свои собственные правила вычисления своих более высоких хэшей, которые описаны в [этой](/v3/documentation/data-formats/tlb/exotic-cells) статье.

## См. также

[//]: # "* [Оригинальная статья на RU](https://github.com/xssnick/ton-deep-doc/blob/master/Cells-BoC.md)"

- [Экзотические (специальные) ячейки](/v3/documentation/data-formats/tlb/exotic-cells)
- [Проверка доказательства Меркла](/v3/documentation/data-formats/tlb/proofs)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/crc32.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/crc32.md
================================================
# CRC32

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Обзор

CRC означает Cyclic Redundancy Check (циклическая проверка избыточности), широко используемый метод проверки целостности цифровых данных. Это алгоритм обнаружения ошибок, используемый для проверки того, возникли ли ошибки в цифровых данных во время передачи или хранения. CRC генерирует короткую контрольную сумму или хэш передаваемых или сохраняемых данных, который добавляется к данным. Когда данные принимаются или извлекаются, CRC пересчитывается и сравнивается с исходной контрольной суммой. Если две контрольные суммы совпадают, предполагается, что данные не были повреждены. Если они не совпадают, это означает, что произошла ошибка и данные необходимо повторно отправить или извлечь заново

Версия CRC32 IEEE, используемая для схем TL-B. Просмотр этого примера [NFT op code](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#tl-b-schema) позволяет лучше понять расчет TL-B для различных сообщений.

## Инструменты

### Онлайн-калькулятор

- [Пример онлайн-калькулятора](https://emn178.github.io/online-tools/crc32.html)
- [Tonwhales Introspection ID Generator](https://tonwhales.com/tools/introspection-id)

### Расширение VS Code

- [crc32-opcode-helper](https://marketplace.visualstudio.com/items?itemName=Gusarich.crc32-opcode-helper)

### Python

```python
import zlib
print(zlib.crc32(b'<TL-B>') & 0x7FFFFFFF)
```

### Go

```python
func main() {

	var schema = "some"

	schema = strings.ReplaceAll(schema, "(", "")
	schema = strings.ReplaceAll(schema, ")", "")
	data := []byte(schema)
	var crc = crc32.Checksum(data, crc32.MakeTable(crc32.IEEE))

	var b_data = make([]byte, 4)
	binary.BigEndian.PutUint32(b_data, crc)
	var res = hex.EncodeToString(b_data)
	fmt.Println(res)
}
```

### TypeScript

```typescript
import * as crc32 from 'crc-32';

function calculateRequestOpcode_1(str: string): string {
    return (BigInt(crc32.str(str)) & BigInt(0x7fffffff)).toString(16);
}

function calculateResponseOpcode_2(str: string): string {
    const a = BigInt(crc32.str(str));
    const b = BigInt(0x80000000);
    return ((a | b) < 0 ? (a | b) + BigInt('4294967296') : a | b).toString(16);
}
```




================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/exotic-cells.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/exotic-cells.md
================================================
# Экзотические ячейки

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Каждая ячейка имеет свой собственный тип, закодированный целым числом от -1 до 255.
Ячейка с типом -1 является `ordinary` ячейкой, а все остальные ячейки называются `exotic` или `special`.
Тип экзотической ячейки хранится в виде первых восьми бит ее данных. Если экзотическая ячейка имеет менее восьми бит данных, она недействительна.
В настоящее время существует 4 типа экзотических ячеек:

```json
{
  Prunned Branch: 1,
  Library Reference: 2,
  Merkle Proof: 3,
  Merkle Update: 4
}
```

### Обрезанная ветвь

Обрезанные ветви - это ячейки, которые представляют удаленные поддеревья ячеек.

Они могут иметь уровень `1 <= l <= 3` и содержать ровно `8 + 8 + 256 * l + 16 * l` бит.

Первый байт всегда `01` — тип ячейки. Второй — маска уровня обрезанной ветви. Затем идут `l * 32` байта хэшей удаленных поддеревьев, а затем `l * 2` байта глубины удаленных поддеревьев.

Уровень `l` ячейки обрезанной ветви можно назвать ее индексом Де Брейна, поскольку он определяет внешнее доказательство Меркла или обновление Меркла, во время построения которого ветвь была обрезана.

Более высокие хеши обрезанных ветвей хранятся в их данных и могут быть получены следующим образом:

```cpp
Hash_i = CellData[2 + (i * 32) : 2 + ((i + 1) * 32)]
```

### Ссылка на библиотеку

Ячейки ссылок на библиотеку используются для использования библиотек в смарт-контрактах.

Они всегда имеют уровень 0 и содержат `8 + 256` бит.

Первый байт всегда `02` - тип ячейки. Следующие 32 байта - [хеш представления](/v3/documentation/data-formats/tlb/cell-boc#standard-cell-representation-hash-calculation) ячейки библиотеки, на которую делается ссылка.

### Доказательство Меркла

Ячейки доказательства Меркла используются для проверки того, что часть данных дерева ячейки принадлежит полному дереву. Такая конструкция позволяет верификатору не хранить все содержимое дерева, при этом сохраняя возможность проверки содержимого по корневому хешу.

Доказательство Меркла имеет ровно одну ссылку, а ее уровень `0 <= l <= 3` должен быть `max(Lvl(ref) - 1, 0)`. Эти ячейки содержат ровно `8 + 256 + 16 = 280` бит.

Первый байт всегда `03` - тип ячейки. Следующие 32 байта - `Hash_1(ref)` (или `ReprHash(ref)`, если уровень ссылки равен 0). Следующие 2 байта - глубина удаленного поддерева, которое было заменено ссылкой.

Более высокие хеши `Hash_i` ячейки доказательства Меркла вычисляются аналогично более высоким хешам обычной ячейки, но вместо `Hash_i(ref)` используется `Hash_i+1(ref)`.

### Обновление Меркла

Ячейки обновления Меркла всегда имеют 2 ссылки и ведут себя как доказательство Меркла для обоих из них.

Уровень обновления Меркла `0 <= l <= 3` равен `max(Lvl(ref1) − 1, Lvl(ref2) − 1, 0)`. Они содержат ровно `8 + 256 + 256 + 16 + 16 = 552` бит.

Первый байт всегда `04` - тип ячейки. Следующие 64 байта - `Hash_1(ref1)` и `Hash_2(ref2)` - называются старым хешем и новым хешем. Затем идут 4 байта с фактической глубиной удаленного старого поддерева и удаленного нового поддерева.

## Простой пример проверки доказательства

Предположим, что есть ячейка `c`:

```json
24[000078] -> {
	32[0000000F] -> {
		1[80] -> {
			32[0000000E]
		},
		1[00] -> {
			32[0000000C]
		}
	},
	16[000B] -> {
		4[80] -> {
			267[800DEB78CF30DC0C8612C3B3BE0086724D499B25CB2FBBB154C086C8B58417A2F040],
			512[00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000064]
		}
	}
}
```

Но мы знаем только ее хэш `44efd0fdfffa8f152339a0191de1e1c5901fdcfe13798af443640af99616b977`, и мы хотим доказать, что ячейка `a` `267[800DEB78CF30DC0C8612C3B3BE0086724D499B25CB2FBBB154C086C8B58417A2F040]` на самом деле является частью `c`, не получая при этом весь `c`.
Поэтому мы просим доказывающего создать доказательство Меркла, заменив все ветви, которые нам не интересны, на ячейки обрезанных ветвей.

Первый потомок `c`, из которого нет способа добраться до `a`, это `ref1`:

```json
32[0000000F] -> {
	1[80] -> {
		32[0000000E]
	},
	1[00] -> {
		32[0000000C]
	}
}
```

Поэтому доказывающий вычисляет свой хэш (`ec7c1379618703592804d3a33f7e120cebe946fa78a6775f6ee2e28d80ddb7dc`), создает сокращенную ветвь `288[0101EC7C1379618703592804D3A33F7E120CEBE946FA78A6775F6EE2E28D80DDB7DC0002]` и заменяет `ref1` этой сокращенной ветвью.

Второй - `512[0000000...00000000064]`, поэтому проверяющий создает сокращенную ветвь, чтобы заменить и эту ячейку:

```json
24[000078] -> {
	288[0101EC7C1379618703592804D3A33F7E120CEBE946FA78A6775F6EE2E28D80DDB7DC0002],
	16[000B] -> {
		4[80] -> {
			267[800DEB78CF30DC0C8612C3B3BE0086724D499B25CB2FBBB154C086C8B58417A2F040],
			288[0101A458B8C0DC516A9B137D99B701BB60FE25F41F5ACFF2A54A2CA4936688880E640000]
		}
	}
}
```

Результат доказательства Меркла, который проверяющий отправляет верификатору (в данном примере нам), выглядит следующим образом:

```json
280[0344EFD0FDFFFA8F152339A0191DE1E1C5901FDCFE13798AF443640AF99616B9770003] -> {
	24[000078] -> {
		288[0101EC7C1379618703592804D3A33F7E120CEBE946FA78A6775F6EE2E28D80DDB7DC0002],
		16[000B] -> {
			4[80] -> {
				267[800DEB78CF30DC0C8612C3B3BE0086724D499B25CB2FBBB154C086C8B58417A2F040],
				288[0101A458B8C0DC516A9B137D99B701BB60FE25F41F5ACFF2A54A2CA4936688880E640000]
			}
		}
	}
}
```

Когда мы (проверяющий) получаем ячейку Proof, мы убеждаемся, что ее данные содержат хэш `c`, а затем вычисляем `Hash_1` из единственной ссылки Proof: `44efd0fdfffa8f152339a0191de1e1c5901fdcfe13798af443640af99616b977`, и сравниваем его с хешем `c`.

Теперь, когда мы проверили, что хеши совпадают, нам нужно углубиться в ячейку и убедиться, что там есть ячейка `a` (которая нас интересовала).

Такие доказательства многократно снижают вычислительную нагрузку и объем данных, которые необходимо отправить или сохранить в верификаторе.

## См. также

- [Примеры проверки расширенных доказательств](/v3/documentation/data-formats/tlb/proofs)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/library-cells.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/library-cells.md
================================================
# Библиотечные ячейки

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Введение

Одной из характерных особенностей того, как TON хранит данные в ячейках, является дедупликация: в хранилище сообщения, блоки, транзакции и т. д. дублирующиеся ячейки сохраняются только один раз. Это значительно уменьшает размер сериализованных данных и позволяет эффективно хранить поэтапно обновляемые данные.

По той же причине многие структуры в TON одновременно являются богатыми, удобными и эффективными: структура блока содержит одинаковые копии каждого сообщения в различных местах: в очереди сообщений, списке транзакций, обновлениях дерева Меркла и так далее: поскольку дублирование не имеет накладных расходов, мы можем хранить данные несколько раз там, где они нам нужны, не беспокоясь об эффективности.

Библиотечные ячейки используют механизм дедупликации в цепочке, что позволяет интегрировать эту технологию в пользовательские смарт-контракты.
:::info
Если вы храните код jetton-wallet в виде библиотечной ячейки (1 ячейка и 256+8 бит вместо ~20 ячеек и 6000 бит), например, то сборы за пересылку сообщения, содержащего `init_code`, будут снижены с 0,011 до 0,003 TON.
:::

## Основная информация

Рассмотрим шаг бейсчейна от блока 1'000'000 до блока 1'000'001. Хотя каждый блок содержит небольшой объем данных (обычно менее 1000 транзакций), все состояние бейсчейна содержит миллионы учетных записей, и поскольку блокчейн должен поддерживать целостность данных (в частности, для фиксации хэша корня Меркла всего состояния в блоке), все дерево состояния должно быть обновлено.

Для блокчейнов предыдущих поколений это означает, что обычно вы отслеживаете только последние состояния, поскольку хранение отдельных состояний цепи для каждого блока потребует слишком много места. Но в блокчейне TON из-за дедупликации для каждого блока вы добавляете в хранилище только новые ячейки. Это не только ускоряет обработку, но и позволяет эффективно работать с историей: проверять балансы, состояния и даже запускать методы get для любой точки истории без особых накладных расходов!

В случае, когда у нас есть семейство похожих контрактов (например, jetton-wallets), узел сохраняет дублирующие данные (одинаковый код каждого jetton-wallet) только один раз. Библиотечные ячейки позволяют использовать механизм дедупликации для таких контрактов, чтобы уменьшить плату за хранение и пересылку.

:::info Высокоуровневая аналогия
Вы можете рассматривать библиотечную ячейку как указатель C++: одна маленькая ячейка, которая указывает на большую ячейку с (возможно) большим количеством ссылок. Ссылочная ячейка (ячейка, на которую указывает библиотечная ячейка) должна существовать и быть зарегистрирована в публичном контексте (*"published"*).
:::

## Структура библиотечных ячеек

Библиотечная ячейка - это [экзотическая ячейка](/v3/documentation/data-formats/tlb/exotic-cells), которая содержит ссылку на некоторую другую статическую ячейку. В частности, она содержит 256 бит хеша указанной ячейки.

Для TVM библиотечные ячейки работают следующим образом: всякий раз, когда TVM получает команду открыть ячейку для фрагмента (инструкция TVM: `CTOS`, функциональный метод: `.begin_parse()`), он выполняет поиск ячейки с соответствующим хэшем из библиотечной ячейки в контексте библиотеки мастерчейна. Если она найдена, она открывает указанную ячейку и возвращает ее срез.

Открытие библиотечной ячейки стоит столько же, сколько открытие обычной ячейки, поэтому ее можно использовать в качестве прозрачной замены для статических ячеек, которые, однако, занимают гораздо меньше места (и, следовательно, требуют меньших затрат на хранение и отправку).

Обратите внимание, что можно создать библиотечную ячейку, которая ссылается на другую библиотечную ячейк, которая, в свою очередь, ссылается на другую, и так далее. В таком случае `.begin_parse()` вызовет исключение. Однако такая библиотека может быть развернута пошагово с помощью opcode `XLOAD`.

Еще одной важной особенностью библиотечной ячейки является то, что, поскольку она содержит хэш указанной ячейки, она в конечном итоге ссылается на некоторые статические данные. Вы не можете изменить данные, на которые ссылается эта библиотечная ячейка.

Чтобы быть найденной в контексте библиотеки мастерчейна и, следовательно, на которую ссылается библиотечная ячейка, исходная ячейка должна быть опубликована в мастерчейне. Это означает, что смарт-контракт, существующий в мастерчейне, должен добавить эту ячейку в свое состояние с флагом `public=true`. Это можно сделать с opcode `SETLIBCODE`.

## Использование в смарт-контрактах

Поскольку библиотечная ячейка ведет себя так же, как и обычная ячейка, на которую она ссылается, во всех контекстах, за исключением расчета платы, вы можете просто использовать ее вместо любой ячейки со статическими данными. Например, вы можете хранить код jetton-wallet в виде библиотечной ячейки (то есть 1 ячейка и 256+8 бит вместо обычных ~20 ячеек и 6000 бит), что приведет к уменьшению на порядок комиссий за хранение и пересылку. В частности, комиссии за пересылку сообщения `internal_transfer`, содержащего `init_code`, будут снижены с 0,011 до 0,003 TON.

### Хранение данных в библиотечной ячейке

Давайте рассмотрим пример хранения кода jetton-wallet в виде библиотечной ячейки для уменьшения комиссий. Сначала нам нужно скомпилировать jetton-wallet в обычную ячейку, содержащую его код.

Затем вам нужно создать библиотечную ячейку со ссылкой на обычную ячейку. Библиотечная ячейка содержит 8-битный тег библиотеки `0x02`, за которым следует 256-битный хэш указанной ячейки.

### Использование в Fift

По сути, вам нужно поместить тег и хэш в конструктор, а затем "закрыть конструктор как экзотическую ячейку".

Это можно сделать в конструкции Fift-asm, как [эта](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/contracts/auto/order_code.func), пример компиляции некоторого контракта непосредственно в библиотечную ячейку [здесь](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/wrappers/Order.compile.ts).

```fift
;; https://docs.ton.org/tvm.pdf, page 30
;; Library reference cell — Always has level 0, and contains 8+256 data bits, including its 8-bit type integer 2 
;; and the representation hash Hash(c) of the library cell being referred to. When loaded, a library
;; reference cell may be transparently replaced by the cell it refers to, if found in the current library context.

cell order_code() asm "<b 2 8 u, 0x6305a8061c856c2ccf05dcb0df5815c71475870567cab5f049e340bcf59251f3 256 u, b>spec PUSHREF";
```

### Использование в @тонн/тонн

В качестве альтернативы вы можете создать библиотечную ячейку полностью на уровне ts в Blueprint с помощью библиотеки `@ton/ton`:

```ts
import { Cell, beginCell } from '@ton/core';

let lib_prep = beginCell().storeUint(2,8).storeBuffer(jwallet_code_raw.hash()).endCell();
jwallet_code = new Cell({ exotic:true, bits: lib_prep.bits, refs:lib_prep.refs});
```

- Изучите исходный код [здесь](https://github.com/ton-blockchain/stablecoin-contract/blob/de08b905214eb253d27009db6a124fd1feadbf72/sandbox_tests/JettonWallet.spec.ts#L104C1-L105C90).

### Публикация обычной ячейки в контексте библиотеки мастерчейна

Практический пример доступен [здесь](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/contracts/helper/librarian.func). Ядром этого контракта является `set_lib_code(lib_to_publish, 2);` - он принимает в качестве входных данных обычную ячейку, которую нужно опубликовать, и flag=2 (означает, что все могут ее использовать).

Обратите внимание, что этот контракт, который публикует ячейку, платит за свое хранение и хранение в мастерчейне в 1000 раз больше, чем в бейсчейне. Таким образом, использование библиотечной ячейки эффективно только для контрактов, используемых тысячами пользователей.

### Тестирование в Blueprint

Чтобы проверить, как контракт, который использует библиотечные ячейки, работает в blueprint, вам нужно вручную добавить ссылочные ячейки в контекст библиотеки эмулятора blueprint. Это можно сделать следующим образом:

1. вам нужно создать словарь контекста библиотеки (Hashmap) `uint256->Cell`, где `uint256` - это хэш соответствующей ячейки.
2. установите контекст библиотеки в настройках эмулятора.

Пример того, как это можно сделать, показан [здесь](https://github.com/ton-blockchain/stablecoin-contract/blob/de08b905214eb253d27009db6a124fd1feadbf72/sandbox_tests/JettonWallet.spec.ts#L100C9-L103C32).

:::info
Обратите внимание, что текущая версия blueprint (`@ton/blueprint:0.19.0`) не обновляет автоматически контекст библиотеки, если какой-либо контракт во время эмуляции публикует новую библиотеку, вам нужно сделать это вручную.
:::

### Get Методы для контрактов на основе библиотечных ячеек

У вас есть jetton-кошелек, код которого хранится в библиотечной ячейке, и вы хотите проверить баланс.

Чтобы проверить его баланс, вам нужно выполнить get метод получения в коде. Это включает в себя:

- доступ к библиотечной ячейке
- извлечение хеша указанной ячейки
- поиск ячейки с этим хешем в коллекции библиотеки мастерчейна
- выполнение кода оттуда.

В многоуровневых решениях (LS) все эти процессы происходят за кулисами, и пользователю не нужно знать о конкретном методе хранения кода.

Однако при локальной работе все по-другому. Например, если вы используете проводник или кошелек, вы можете взять состояние учетной записи и попытаться определить ее тип — будь то NFT, кошелек, токен или аукцион.

Для обычных контрактов вы можете посмотреть доступные get методы, т. е. интерфейс, чтобы понять его. Или вы можете "забрать" состояние учетной записи в локальной псевдосети и выполнить методы там.

Для библиотечной ячейки это невозможно, поскольку она сама по себе не содержит данных. Вы должны вручную обнаружить и извлечь необходимые ячейки из контекста. Это можно сделать через LS (хотя привязки пока не поддерживают это) или через DTon.

#### Получение библиотечной ячейки с помощью Liteserver

Liteserver при запуске get методов автоматически устанавливает правильный контекст библиотеки. Если вы хотите определить тип контракта с помощью get методов или запустить get методы локально, вам нужно загрузить соответствующие ячейки с помощью метода LS [liteServer.getLibraries](https://github.com/ton-blockchain/ton/blob/4cfe1d1a96acf956e28e2bbc696a143489e23631/tl/generate/scheme/lite_api.tl#L96).

#### Получение библиотечной ячейки с помощью DTon

Вы также можете получить библиотеку с [dton.io/graphql](https://dton.io/graphql):

```
{
  get_lib(
    lib_hash: "<HASH>"
  )
}
```

а также список библиотек для определенного блока мастерчейна:

```
{
  blocks{
    libs_publishers
    libs_hash
  }
}
```

## См. также

- [Экзотические ячейки](/v3/documentation/data-formats/tlb/exotic-cells)
- [Инструкции TVM](/v3/documentation/tvm/instructions)





================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/msg-tlb.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/msg-tlb.mdx
================================================
import ThemedImage from '@theme/ThemedImage';

# Схемы сообщений TL-B

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

В этом разделе подробное объяснение схем TL-B для сообщений.

## Сообщение TL-B

### TL-B

Основное сообщение Схема TL-B объявлена как комбинация нескольких вложенных структур

```tlb
message$_ {X:Type} info:CommonMsgInfo
init:(Maybe (Either StateInit ^StateInit))
body:(Either X ^X) = Message X;

message$_ {X:Type} info:CommonMsgInfoRelaxed
init:(Maybe (Either StateInit ^StateInit))
body:(Either X ^X) = MessageRelaxed X;

_ (Message Any) = MessageAny;
```

Здесь `Message X` - это общая структура сообщения, `MessageRelaxed X` дополнительный тип с телом CommonMsgInfoRelaxed, а `Message Any` - это объединение обоих.
Структура сообщения унифицирована с X:Type, то есть является ячейкой.
Согласно TL-B мы можем объединить все данные в одной ячейке (если она уместится в 1023 бита) или использовать ссылки, объявленные с помощью символа `^`.

Сериализованное `Message X` помещается в список действий с помощью метода FunC send_raw_message(), затем смарт-контракт выполняет это действие и отправляет сообщение.

### Определение явной сериализации

Для построения допустимых двоичных данных в соответствии со структурой TL-B мы должны выполнить сериализацию, которая определяется для каждого типа рекуррентно. Это значит, что для сериализации сообщения X нам нужно знать, как сериализовать
`StateInit`, `CommonMsgInfo` и т. д.

Каждую вложенную структуру мы должны получать из другой схемы TL-B по ссылке рекуррентно, пока сериализация для верхней структуры не станет явной - каждый бит будет определен булевым или битовым типом (bits, uint, varuint).

Структуры, которые в настоящее время не используются в обычной разработке, будут отмечены `*` в столбце Тип, например \*Anycast обычно пропускается при сериализации.

### message$_

Имеется верхняя схема TL-B для всех сообщений `Message X`:

```tlb
message$_ {X:Type} info:CommonMsgInfo
init:(Maybe (Either StateInit ^StateInit))
body:(Either X ^X) = Message X;
```

| Структура      | Тип                                                               | Обязательно   | Описание                                                                                                                                                                                                       |   |
| -------------- | ----------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | - |
| message$_      | Constructor                                                       |               | Определяется по правилам конструктора. Пустой тег `$_` означает, что мы не будем добавлять никаких битов в начало                                                                                              |   |
| info           | [CommonMsgInfo](#commonmsginfo)                                   | Обязательно   | Подробные свойства сообщения определяют пункт назначения и его значение. Всегда помещаются в корневую ячейку сообщения.                                                                                        |   |
| init           | [StateInit](#stateinit-tl-b)                                      | Необязательно | Общая структура, используемая в TON для инициализации новых контрактов. Может быть записана как ссылка на ячейку или корневую ячейку.                                                                          |   |
| body           | X                                                                 | Обязательно   | Полезная нагрузка сообщения. Может быть записана как ссылка на ячейку или корневую ячейку.                                                                                                                     |   |

```tlb
nothing$0 {X:Type} = Maybe X;
just$1 {X:Type} value:X = Maybe X;
left$0 {X:Type} {Y:Type} value:X = Either X Y;
right$1 {X:Type} {Y:Type} value:Y = Either X Y;
```

Вспомним, как работают `Maybe` и `Either`, мы можем сериализовать разные случаи:

- `[CommonMsgInfo][10][StateInit][0][X]` - `Сообщение X` в одной ячейке

<br></br>
<ThemedImage
alt=""
sources={{
light: '/img/docs/data-formats/tl-b-docs-9.png?raw=true',
dark: '/img/docs/data-formats/tl-b-docs-9-dark.png?raw=true',
}}
/>
<br></br>

- `[CommonMsgInfo][11][^StateInit][1][^X]` - `Сообщение X` со ссылками

<br></br>
<ThemedImage
alt=""
sources={{
light: '/img/docs/data-formats/tl-b-docs-8.png?raw=true',
dark: '/img/docs/data-formats/tl-b-docs-8-dark.png?raw=true',
}}
/>
<br></br>

## CommonMsgInfo TL-B

### CommonMsgInfo

`CommonMsgInfo` — это список параметров, который определяет, как сообщение будет доставлено в блокчейне TON.

```tlb
//internal message
int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
  src:MsgAddressInt dest:MsgAddressInt
  value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
  created_lt:uint64 created_at:uint32 = CommonMsgInfo;

//external incoming message
ext_in_msg_info$10 src:MsgAddressExt dest:MsgAddressInt
  import_fee:Grams = CommonMsgInfo;

//external outgoing message
ext_out_msg_info$11 src:MsgAddressInt dest:MsgAddressExt
  created_lt:uint64 created_at:uint32 = CommonMsgInfo;
```

### int_msg_info$0

`int_msg_info` — это случай внутреннего сообщения. Это означает, что они могут быть отправлены между контрактами и только между контрактами.
Случай использования — обычные сообщения между контрактами.

```tlb
nanograms$_ amount:(VarUInteger 16) = Grams;
//internal message
int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
  src:MsgAddressInt dest:MsgAddressInt
  value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
  created_lt:uint64 created_at:uint32 = CommonMsgInfo;
```

| Структура                 | Тип                                                                              | Обязательно | Описание                                                                                                                                                                                                                       |
| ------------------------- | -------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| int_msg_info$0            | Constructor                                                                      | Обязательно | Значение $0 тега означает, что при сериализации CommonMsgInfo, начинающийся с 0 бита, описывает внутреннее сообщение.                                                                                                          |
| ihr_disabled              | Bool                                                                             | Обязательно | Флаг маршрутизации гиперкуба.                                                                                                                                                                                                  |
| bounce                    | Bool                                                                             | Обязательно | Сообщение должно быть отклонено, если во время обработки возникли ошибки. Если flat bounce сообщения = 1, оно вызывает bounceable.                                                                                             |
| bounced                   | Bool                                                                             | Обязательно | Флаг, описывающий, что само сообщение является результатом bounce.                                                                                                                                                             |
| src                       | [MsgAddressInt](#msgaddressint-tl-b)                                             | Обязательно | Адрес отправителя сообщения смарт-контракта.                                                                                                                                                                                   |
| dest                      | [MsgAddressInt](#msgaddressint-tl-b)                                             | Обязательно | Адрес получателя сообщения смарт-контракта.                                                                                                                                                                                    |
| value                     | [CurrencyCollection](#currencycollection)                                        | Обязательно | Структура, описывающая информацию о валюте, включая общую сумму средств, переведенных в сообщении.                                                                                                                             |
| ihr_fee                   | [VarUInteger 16](#varuinteger-n)                                                 | Обязательно | Комиссии за доставку гипермаршрутизации                                                                                                                                                                                        |
| fwd_fee                   | [VarUInteger 16](#varuinteger-n)                                                 | Обязательно | Комиссии за пересылку сообщений, назначенные валидаторами                                                                                                                                                                      |
| created_lt                | uint64                                                                           | Обязательно | Логическое время отправки сообщения, назначенное валидатором. Используется для заказа действий в смарт-контракте.                                                                                                              |
| created_at                | uint32                                                                           | Обязательно | Время Unix                                                                                                                                                                                                                     |

### ext_in_msg_info$10

`ext_in_msg_info$10` — это случай внешнего входящего сообщения. Означает, что этот тип сообщений отправляется из off-chain-пространства в контракты.
Вариант использования — запрос приложения кошелька в контракт кошелька.

```tlb
nanograms$_ amount:(VarUInteger 16) = Grams;
//external incoming message
ext_in_msg_info$10 src:MsgAddressExt dest:MsgAddressInt
  import_fee:Grams = CommonMsgInfo;
```

| Структура          | Тип                                                                  | Обязательно | Описание                                                                                                                                                                                                               |
| ------------------ | -------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ext_in_msg_info$10 | Constructor                                                          | Обязательно | Тег `$10` означает, что в сериализации CommonMsgInfo, начинающийся с `10` бит, описывает внешнее входящее сообщение.                                                                                                   |
| ihr_disabled       | Bool                                                                 | Обязательно | Флаг гипермаршрутизации. (в настоящее время всегда true)                                                                                                                                                               |
| src                | [MsgAddressExt](#msgaddressext-tl-b)                                 | Обязательно | Адрес внешнего отправителя сообщения.                                                                                                                                                                                  |
| dest               | [MsgAddressInt](#msgaddressint-tl-b)                                 | Обязательно | Адрес смарт-контракта назначения сообщения.                                                                                                                                                                            |
| import_fee         | [VarUInteger 16](#varuinteger-n)                                     | Обязательно | Плата за выполнение и доставку сообщения.                                                                                                                                                                              |

### ext_out_msg_info$11

`ext_out_msg_info$11` — это случай внешнего исходящего сообщения. Это означает, что они могут быть отправлены из контрактов в off-chain пространство.
Пример использования — логи.

```tlb
//external outgoing message
ext_out_msg_info$11 src:MsgAddressInt dest:MsgAddressExt
  created_lt:uint64 created_at:uint32 = CommonMsgInfo;
```

| Структура                           | Тип                                                                   | Обязательно | Описание                                                                                                                                                                                                                   |
| ----------------------------------- | --------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ext_out_msg_info$11                 | Constructor                                                           | Обязательно | Тег `$11` означает, что в сериализации CommonMsgInfo, начинающийся с бита `11`, описывает внешнее исходящее сообщение.                                                                                                     |
| src                                 | [MsgAddressInt](#msgaddressint-tl-b)                                  | Обязательно | Адрес отправителя сообщения смарт-контракта.                                                                                                                                                                               |
| dest                                | [MsgAddressExt](#msgaddressext-tl-b)                                  | Обязательно | Адрес внешнего назначения сообщения.                                                                                                                                                                                       |
| created_lt                          | uint64                                                                | Обязательно | Логическое время отправки сообщения, назначенное валидатором. Используется для упорядочивания действий в смарт-контракте.                                                                                                  |
| created_at                          | uint32                                                                | Обязательно | Время Unix                                                                                                                                                                                                                 |

## StateInit TL-B

StateInit служит для доставки начальных данных в контракт и используется при развертывании контракта.

```tlb
_ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
  code:(Maybe ^Cell) data:(Maybe ^Cell)
  library:(HashmapE 256 SimpleLib) = StateInit;
```

| Структура   | Тип                                       | Обязательно   | Описание                                                                                                                                                                                                                                                                                       |
| ----------- | ----------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| split_depth | (## 5)                                    | Необязательно | Параметр для highload контрактов определяет поведение разделения на несколько экземпляров в разных шардах. В настоящее время StateInit используется без него.                                                                                                                                  |
| special     | TickTock\*                                | Необязательно | Используется для вызова смарт-контрактов в каждом новом блоке блокчейна. Доступно только в мастерчейне. Обычные пользовательские контракты используются без него.                                                                                                                              |
| code        | Cell                                      | Необязательно | Сериализованный код контракта.                                                                                                                                                                                                                                                                 |
| data        | Cell                                      | Необязательно | Начальные данные контракта.                                                                                                                                                                                                                                                                    |
| library     | HashmapE 256 SimpleLib\*                  | Необязательно | В настоящее время используется StateInit без библиотек                                                                                                                                                                                                                                         |

[Общие подробные пояснения к хэшмапам](/v3/documentation/data-formats/tlb/tl-b-types#hashmap)

## MsgAddressExt TL-B

```tlb
addr_none$00 = MsgAddressExt;
addr_extern$01 len:(## 9) external_address:(bits len)
= MsgAddressExt;
```

`MsgAddress` - это схема различных сериализаций для адресов. В зависимости от того, какой участник (off-chain или смарт-контракт) отправляет сообщения, используются различные структуры.

### addr_none$00

`addr_none$00` - используется для определения нулевого адреса off-chain участника. Это означает, что мы можем отправлять внешнее сообщение контракту без уникального адреса отправителя.

```tlb
addr_none$00 = MsgAddressExt;
```

| Структура           | Тип                             | Обязательно | Описание                                                                                                                                                                                                                         |
| ------------------- | ------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| addr_none$00        | Constructor                     | Обязательно | Тег "$00" означает, что при сериализации MsgAddressExt начинается с битов "00". Это означает, что весь внешний адрес равен `00`.                                                                                                 |

### addr_extern$01

```tlb
addr_extern$01 len:(## 9) external_address:(bits len)
= MsgAddressExt;
```

| Структура                     | Тип               | Обязательно | Описание                                                                                                                                                                                                           |
| ----------------------------- | ----------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| addr_extern$01                | Constructor       | Обязательно | Тег `$01` означает, что при сериализации MsgAddressExt, начинающийся с бита `01`, описывает внешний адрес.                                                                                                         |
| len                           | ## 9              | Обязательно | То же, что и uintN - означает N-разрядное число без знака                                                                                                                                                          |
| external_address              | (bits len)        | Обязательно | Адрес - это битовая строка len, равная предыдущему "len"                                                                                                                                                           |

## MsgAddressInt TL-B

```tlb
addr_std$10 anycast:(Maybe Anycast)
workchain_id:int8 address:bits256  = MsgAddressInt;

addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)
workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
```

### addr_std$10

```tlb
addr_std$10 anycast:(Maybe Anycast)
workchain_id:int8 address:bits256  = MsgAddressInt;
```

| Структура    | Тип                | Обязательно   | Описание                                                                                                                                                                                                           |
| ------------ | ------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| addr_std$10  | Constructor        | Обязательно   | Тег `$10` означает, что в сериализации MsgAddressInt, начинающийся с `10` бит, описывает внутренний адрес.                                                                                                         |
| anycast      | Anycast\*          | Необязательно | Дополнительные данные адреса, в настоящее время не используются в обычных внутренних сообщениях                                                                                                                    |
| workchain_id | int8               | Обязательно   | Воркчейн, в котором размещен смарт-контракт адреса назначения. В настоящий момент всегда равен нулю.                                                                                                               |
| address      | (bits256)          | Обязательно   | Номер идентификатора учетной записи смарт-контракта                                                                                                                                                                |

### addr_var$11

```tlb
addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)
workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
```

| Структура    | Тип               | Обязательно    | Описание                                                                                                                                                                                                                             |
| ------------ | ----------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| addr_var$11  | Constructor       | Обязательно    | Тег `$11` означает, что в сериализации MsgAddressInt, начинающийся с `11` бит, описывает внутренний адрес контракта.                                                                                                                 |
| anycast      | Anycast\*         | Необязательно  | Дополнительные данные адреса, в настоящее время не используются в обычных внутренних сообщениях                                                                                                                                      |
| addr_len     | ## 9              | Обязательно    | То же, что и uintN - означает N-разрядное число без знака                                                                                                                                                                            |
| workchain_id | int32             | Обязательно    | Воркчейн, в котором размещен смарт-контракт адреса назначения. В настоящий момент всегда равен нулю.                                                                                                                                 |
| address      | (bits256)         | Обязательно    | Адрес полезной нагрузки (может быть идентификатором учетной записи)                                                                                                                                                                  |

## Основные используемые типы

### CurrencyCollection

```tlb
nanograms$_ amount:(VarUInteger 16) = Grams;
currencies$_ grams:Grams other:ExtraCurrencyCollection
= CurrencyCollection;
```

| Структура    | Тип                                       | Обязательно   | Описание                                                                                                                                                                                                   |
| ------------ | ----------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| currencies$_ | Constructor                               | Обязательно   | `$_` пустой тег означает, что в сериализации CurrencyCollection мы не будем добавлять никаких битов в начало                                                                                               |
| grams        | (VarUInteger 16)                          | Обязательно   | Значение сообщения в nanoTons                                                                                                                                                                              |
| other        | ExtraCurrencyCollection                   | Необязательно | ExtraCurrencyCollection — это словарь, предназначенный для дополнительных валют, который обычно пустой                                                                                                     |

- ExtraCurrencyCollection сложный тип, который обычно пишется как пустой словарь в сообщениях

### VarUInteger n

```tlb
var_uint$_ {n:#} len:(#< n) value:(uint (len * 8))
= VarUInteger n;
var_int$_ {n:#} len:(#< n) value:(int (len * 8))
= VarInteger n;
```

| Структура         | Тип                         | Обязательно   | Описание                                                                                                                                                                                                                   |
| ----------------- | --------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| var_uint$_        | Constructor                 | Обязательно   | `var_uint$_` пустой тег означает, что в сериализации CurrencyCollection мы не будем добавлять никаких битов в начало                                                                                                       |
| len               | uintN                       | Обязательно   | биты параметра len для следующего значения                                                                                                                                                                                 |
| value             | (uint (len \* 8))           | Необязательно | значение uint для целого числа, записанного в (len \* 8) бит                                                                                                                                                               |

## Пример сообщения

### Обычное внутреннее сообщение на func

```func
  var msg = begin_cell()
    .store_uint(0, 1) ;; tag
    .store_uint(1, 1) ;; ihr_disabled
    .store_uint(1, 1) ;; allow bounces
    .store_uint(0, 1) ;; not bounced itself
    .store_slice(source)
    .store_slice(destination)
    ;; serialize CurrencyCollection (see below)
    .store_coins(amount)
    .store_dict(extra_currencies)
    .store_coins(0) ;; ihr_fee
    .store_coins(fwd_value) ;; fwd_fee
    .store_uint(cur_lt(), 64) ;; lt of transaction
    .store_uint(now(), 32) ;; unixtime of transaction
    .store_uint(0,  1) ;; no init-field flag (Maybe)
    .store_uint(0,  1) ;; inplace message body flag (Either)
    .store_slice(msg_body)
  .end_cell();
```

### Обычное сообщение на func в краткой форме

Части сообщения, которые всегда перезаписываются валидаторами, можно пропустить (заполнить нулевыми битами). Отправитель сообщения здесь также пропущен, сериализован как `addr_none$00`.

```func
  cell msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(addr)
        .store_coins(amount)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_slice(message_body)
.end_cell();
```



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/proofs.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/proofs.mdx
================================================
import ThemedImage from '@theme/ThemedImage';

# Проверка доказательств (низкий уровень)

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Общие сведения

:::caution
В этом разделе описываются инструкции и руководства по взаимодействию с TON на низком уровне.
предполагается, что вы уже знакомы с [экзотическими ячейками](/v3/documentation/data-formats/tlb/exotic-cells), [языком TL-B](/v3/documentation/data-formats/tlb/tl-b-language) и
понимаете пример [простой проверки доказательств](/v3/documentation/data-formats/tlb/exotic-cells#simple-proof-verifying-example).
:::

В этой статье описаны продвинутые примеры проверки доказательств с Liteservers.

Важно проверять любые данные, которые вы получаете от узла, на предмет доверительного взаимодействия с блокчейном.
Однако статья охватывает только часть ненадежной коммуникации с Liteserver,
потому что предполагается, что вы проверили хэш блока, который вы получили от Liteserver (или любого другого источника).
Проверка хэша блока является более сложной, поскольку вам нужно синхронизировать ключевые блоки и (или) проверить подписи блоков, что будет описано в другой статье в будущем. Тем не менее даже используя только эти примеры вы уменьшаете вероятность того, что Liteserver отправит вам не те данные, которым вы поверите.

## Заголовок блока

Предположим, мы знаем ID блока:

```json
<TL BlockIdExt [wc=-1, shard=-9223372036854775808, seqno=31220993, root_hash=51ed3b9e728e7c548b15a5e5ce988b4a74984c3f8374f3f1a52c7b1f46c26406, file_hash=d4fcdc692de1a252deb379cd25774842b733e6a96525adf82b8ffc41da667bf5] >
```

И мы запрашиваем у Liteserver заголовок для этого блока. Liteserver [отвчает](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/tl/generate/scheme/lite_api.tl#L35)
содержимым `header_proof` boc.

<details>

<summary><b>Показать boc</b></summary>

```boc

b5ee9c72010207010001470009460351ed3b9e728e7c548b15a5e5ce988b4a74984c3f8374f3f1a52c7b1f46c26406001601241011ef55aaffffff110204050601a09bc7a98700000000040101dc65010000000100ffffffff000000000000000064b6c356000023d38ba64000000023d38ba64004886d00960007028101dc64fd01dc42bec400000003000000000000002e030098000023d38b96fdc401dc650048a3971c46472b85c8d761060a6e7ae9f13a90cdda815915a89597cfecb393a6b568807adfb3c1c5efc920907225175db61ca384e4f8b313799e3cbb8b7b4085284801018c6053c1185700c0fe4311d5cf8fa533ea0382e361a7b76d0cf299b75ac0356c000328480101741100d622b0d5264bcdb86a14e36fc8c349b82ae49e037002eb07079ead8b060015284801015720b6aefcbf406209522895faa6c0d10cc3315d90bcaf09791b19f595e86f8f0007

```

</details>

После десериализации boc мы получили ячейку:

```json
280[0351ED3B9E728E7C548B15A5E5CE988B4A74984C3F8374F3F1A52C7B1F46C264060016] -> {
	64[11EF55AAFFFFFF11] -> {
		640[9BC7A98700000000040101DC65010000000100FFFFFFFF000000000000000064B6C356000023D38BA64000000023D38BA64004886D00960007028101DC64FD01DC42BEC400000003000000000000002E] -> {
			608[000023D38B96FDC401DC650048A3971C46472B85C8D761060A6E7AE9F13A90CDDA815915A89597CFECB393A6B568807ADFB3C1C5EFC920907225175DB61CA384E4F8B313799E3CBB8B7B4085]
		},
		288[01018C6053C1185700C0FE4311D5CF8FA533EA0382E361A7B76D0CF299B75AC0356C0003],
		288[0101741100D622B0D5264BCDB86A14E36FC8C349B82AE49E037002EB07079EAD8B060015],
		288[01015720B6AEFCBF406209522895FAA6C0D10CC3315D90BCAF09791B19F595E86F8F0007]
	}
}
```

которую мы должны десериализовать в соответствии со схемой блока [Tlb](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L442):

```python
{
  'global_id': -239,
  'info':
    {
      'version': 0,
      'not_master': 0,
      'after_merge': 0,
      'before_split': 0,
      'after_split': 0,
      'want_split': False,
      'want_merge': True,
      'key_block': False,
      'vert_seqno_incr': 0,
      'flags': 1,
      'seqno': 31220993,
      'vert_seqno': 1,
      'shard': {'shard_pfx_bits': 0, 'workchain_id': -1, 'shard_prefix': 0},
      'gen_utime': 1689699158,
      'start_lt': 39391488000000,
      'end_lt': 39391488000004,
      'gen_validator_list_hash_short': 2288844950,
      'gen_catchain_seqno': 459393,
      'min_ref_mc_seqno': 31220989,
      'prev_key_block_seqno': 31212222,
      'gen_software': {'version': 3, 'capabilities': 46},
      'master_ref': None,
      'prev_ref': {'type_': 'prev_blk_info', 'prev': {'end_lt': 39391487000004, 'seqno': 31220992, 'root_hash': b'H\xa3\x97\x1cFG+\x85\xc8\xd7a\x06\nnz\xe9\xf1:\x90\xcd\xda\x81Y\x15\xa8\x95\x97\xcf\xec\xb3\x93\xa6', 'file_hash': b'\xb5h\x80z\xdf\xb3\xc1\xc5\xef\xc9 \x90r%\x17]\xb6\x1c\xa3\x84\xe4\xf8\xb3\x13y\x9e<\xbb\x8b{@\x85'}},
      'prev_vert_ref': None
    },
  'value_flow': None,
  'state_update': None,
  'extra': None
}
```

Теперь мы должны проверить, что `seqno` в десериализованном блоке соответствует `seqno` блока, который мы знаем, а затем вычислить hash_1 единственной
ссылки доказательства Меркла и сравнить его с хешем блока, который мы знаем:

```python
assert h_proof.refs[0].get_hash(0) == block_id.root_hash
```

Теперь мы можем доверять всем остальным данным, эта ячейка содержит

_Примеры проверки доказательства:_ [Python](https://github.com/yungwine/pytoniq-core/blob/873a96aa2256db33b8f35fbe2ab8fe8cf8ae49c7/pytoniq_core/proof/check_proof.py#L19), [Kotlin](https://github.com/andreypfau/ton-kotlin/blob/b1edc4b134e89ccf252149f27c85fd530377cebe/ton-kotlin-liteclient/src/commonMain/kotlin/CheckProofUtils.kt#L15), [C++](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/check-proof.cpp#L34)

## Полный блок

Для метода `liteserver.getBlock` проверка доказательства такая же, как описано выше, однако она содержит полные ячейки вместо сокращенных ветвей для [потока значений](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L464), [состояния обновления](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L412-L413) и [расширенного блока](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L452) схем.

## Блок шарда

Доказательства шарда — это доказательства того, что ссылка на шард фактически хранится в блоке мастерчейна, который мы предоставили Liteserver. Нам нужно проверить такие доказательства, когда мы вызываем методы `liteServer.getShardInfo`, `liteServer.getAccountState` и `liteServer.runSmcMethod`.

Давайте запросим у Liteserver информацию о шарде для блока мастерчейна, о котором мы упоминали выше:

```python
await client.raw_get_shard_info(master, wc=0)
```

Ответ Liteserver содержит BlockIdExt блока шарда:

```json
<TL BlockIdExt [wc=0, shard=-9223372036854775808, seqno=36908135, root_hash=39e5cbca5bf69750b5d9897872c3a0d7a3e614e521c53e4de728fafed38dce27, file_hash=f1f0e5cdc4b8a12cf2438dcab60f4712d1dc04f3792b1d72f2500cbf640948b7] >
```

Подтверждение шарда boc:

<details>

<summary><b>Показать boc</b></summary>

```boc

b5ee9c72010219020004b9010009460332bf3592969931ca4fbc7715494b50597f1884c0d847456029d8cf0e526e6046016f0209460351ed3b9e728e7c548b15a5e5ce988b4a74984c3f8374f3f1a52c7b1f46c26406001611245b9023afe2ffffff1100ffffffff000000000000000001dc65010000000164b6c356000023d38ba6400401dc64fd600304050628480101affe84cdd73951bce07eeaad120d00400295220d6f66f1163b5fa8668202d72b000128480101faed0dd3ca110ada3d22980e3795d2bdf15450e9159892bbf330cdfd13a3b880016e22330000000000000000ffffffffffffffff820ce9d9c3929379c82807082455cc26aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac23519b11eddc69b7e090a0b0c28480101a5a7d24057d8643b2527709d986cda3846adcb3eddc32d28ec21f69e17dbaaef000128480101deab5a5aaf79c5e24f8dcbbe51747d6804104f75f58ed5bed4702c353545c6ac00110103d0400d284801015394592e3a3f1e3bc2d4249e993d0ec1e33ca18f49533991274ebc65276cd9a5001122bf0001aaa0161d000702816000047a7172dfb88800011e8b625908200ee215f71061846393a08c682e87bc3a12aff2d246eb97a09164f5657f96f9a252ef71580fe5309a823f73f3c4c3f8ab73f5a85bbf204bfd22e68d36d0efab1818e7b428be0f1028480101b20e36a3b36a4cdee601106c642e90718b0a58daf200753dbb3189f956b494b6000101db50119963380ee3280800011e9c5cb7ee0000011e9c5cb7ee29cf2e5e52dfb4ba85aecc4bc3961d06bd1f30a7290e29f26f3947d7f69c6e713f8f872e6e25c50967921c6e55b07a38968ee0279bc958eb97928065fb204a45b88000381abc00000000000000000ee327eb25b61a8a0e001343c9b67a721dcd6500202848010150fcc05bd9723571b83316a5f650be31edb131d05fdc78d271486e5d4ef077e1001928480101e5be728200b172cf7e2356cba2ae1c6e2c790be7c03cd7814c6e6fe3080b944b0011241011ef55aaffffff111213141501a09bc7a98700000000040101dc65010000000100ffffffff000000000000000064b6c356000023d38ba64000000023d38ba64004886d00960007028101dc64fd01dc42bec400000003000000000000002e16284801018c6053c1185700c0fe4311d5cf8fa533ea0382e361a7b76d0cf299b75ac0356c00032a8a0478e0f0e601ba1161ecc1395e9a0475c4f80aadbd6c483f210e96e29cf36789e432bf3592969931ca4fbc7715494b50597f1884c0d847456029d8cf0e526e6046016f016f1718284801015720b6aefcbf406209522895faa6c0d10cc3315d90bcaf09791b19f595e86f8f00070098000023d38b96fdc401dc650048a3971c46472b85c8d761060a6e7ae9f13a90cdda815915a89597cfecb393a6b568807adfb3c1c5efc920907225175db61ca384e4f8b313799e3cbb8b7b4085688c010378e0f0e601ba1161ecc1395e9a0475c4f80aadbd6c483f210e96e29cf36789e46492304dfb6ef9149781871464af686056a9627f882f60e3b24f8c944a75ebaf016f0014688c010332bf3592969931ca4fbc7715494b50597f1884c0d847456029d8cf0e526e6046da58493ccb5da3876129b0190f3c375e69e59c3ad9ff550be708999dad1f6f39016f0014

```

</details>

И `shard_descr` boc, который мы можем использовать в качестве результата, если доверяем Liteserver.

<details>

<summary><b>Показать boc</b></summary>

```boc

b5ee9c7201010201007d0001db50119963380ee3280800011e9c5cb7ee0000011e9c5cb7ee29cf2e5e52dfb4ba85aecc4bc3961d06bd1f30a7290e29f26f3947d7f69c6e713f8f872e6e25c50967921c6e55b07a38968ee0279bc958eb97928065fb204a45b88000381abc00000000000000000ee327eb25b61a8a01001343c9b67a721dcd650020

```

</details>

После десериализации доказательства шарда boc мы получили 2 корня:

```json
[<Cell 280[0351ED3B9E728E7C548B15A5E5CE988B4A74984C3F8374F3F1A52C7B1F46C264060016] -> 1 refs>, <Cell 280[0332BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046016F] -> 1 refs>]
```

Первый — это доказательство Меркла блока мастерчейна, который мы должны проверить (используя функцию `check_block_header`):

```json
280[0351ED3B9E728E7C548B15A5E5CE988B4A74984C3F8374F3F1A52C7B1F46C264060016] -> {
	64[11EF55AAFFFFFF11] -> {
		640[9BC7A98700000000040101DC65010000000100FFFFFFFF000000000000000064B6C356000023D38BA64000000023D38BA64004886D00960007028101DC64FD01DC42BEC400000003000000000000002E] -> {
			608[000023D38B96FDC401DC650048A3971C46472B85C8D761060A6E7AE9F13A90CDDA815915A89597CFECB393A6B568807ADFB3C1C5EFC920907225175DB61CA384E4F8B313799E3CBB8B7B4085]
		},
		288[01018C6053C1185700C0FE4311D5CF8FA533EA0382E361A7B76D0CF299B75AC0356C0003],
		552[0478E0F0E601BA1161ECC1395E9A0475C4F80AADBD6C483F210E96E29CF36789E432BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046016F016F] -> {
			560[010378E0F0E601BA1161ECC1395E9A0475C4F80AADBD6C483F210E96E29CF36789E46492304DFB6EF9149781871464AF686056A9627F882F60E3B24F8C944A75EBAF016F0014],
			560[010332BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046DA58493CCB5DA3876129B0190F3C375E69E59C3AD9FF550BE708999DAD1F6F39016F0014]
		},
		288[01015720B6AEFCBF406209522895FAA6C0D10CC3315D90BCAF09791B19F595E86F8F0007]
	}
}
```

Ячейка

```json
552[0478E0F0E601BA1161ECC1395E9A0475C4F80AADBD6C483F210E96E29CF36789E432BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046016F016F] -> {
    560[010378E0F0E601BA1161ECC1395E9A0475C4F80AADBD6C483F210E96E29CF36789E46492304DFB6EF9149781871464AF686056A9627F882F60E3B24F8C944A75EBAF016F0014],
    560[010332BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046DA58493CCB5DA3876129B0190F3C375E69E59C3AD9FF550BE708999DAD1F6F39016F0014]
}
```

Является обновлением Меркла схемы TLB [ShardState](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L412-L413), поэтому нам нужно запомнить новый хэш.

После того, как мы убедились, что единственная ссылка доказзательства Меркла ячейки Hash_1 совпадает с известным нам хешем блока, и запомнили новый хеш ShardState, мы проверяем вторую ячейку `shard proof`:

```json
280[0332BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046016F] -> {
	362[9023AFE2FFFFFF1100FFFFFFFF000000000000000001DC65010000000164B6C356000023D38BA6400401DC64FD40] -> {
		288[0101AFFE84CDD73951BCE07EEAAD120D00400295220D6F66F1163B5FA8668202D72B0001],
		288[0101FAED0DD3CA110ADA3D22980E3795D2BDF15450E9159892BBF330CDFD13A3B880016E],
		204[0000000000000000FFFFFFFFFFFFFFFF820CE9D9C3929379C820] -> {
			288[0101A5A7D24057D8643B2527709D986CDA3846ADCB3EDDC32D28EC21F69E17DBAAEF0001],
			288[0101DEAB5A5AAF79C5E24F8DCBBE51747D6804104F75F58ED5BED4702C353545C6AC0011]
		},
		342[CC26AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC23519B11EDDC69B7C] -> {
			9[D000] -> {
				878[50119963380EE3280800011E9C5CB7EE0000011E9C5CB7EE29CF2E5E52DFB4BA85AECC4BC3961D06BD1F30A7290E29F26F3947D7F69C6E713F8F872E6E25C50967921C6E55B07A38968EE0279BC958EB97928065FB204A45B88000381ABC00000000000000000EE327EB25B61A88] -> {
					74[43C9B67A721DCD650000]
				}
			},
			288[01015394592E3A3F1E3BC2D4249E993D0EC1E33CA18F49533991274EBC65276CD9A50011],
			766[0001AAA0161D000702816000047A7172DFB88800011E8B625908200EE215F71061846393A08C682E87BC3A12AFF2D246EB97A09164F5657F96F9A252EF71580FE5309A823F73F3C4C3F8AB73F5A85BBF204BFD22E68D36D0EFAB1818E7B428BC] -> {
				288[010150FCC05BD9723571B83316A5F650BE31EDB131D05FDC78D271486E5D4EF077E10019],
				288[0101E5BE728200B172CF7E2356CBA2AE1C6E2C790BE7C03CD7814C6E6FE3080B944B0011]
			},
			288[0101B20E36A3B36A4CDEE601106C642E90718B0A58DAF200753DBB3189F956B494B60001]
		}
	}
}
```

Как мы видим, единственная ссылка доказательства Меркла имеет префикс `9023AFE2`, который является [ShardStateUnsplit](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L410)
префиксом схемы TLB, поэтому нам нужно сравнить эту ссылку Hash_1 с той, которую мы запомнили на предыдущем шаге:

```python
"""
Here mc_block_cell is a first shard proof root and mc_state_root is the second one.
The check_block_header_proof function returns new hash of the ShardState Merkle Update.
"""

mc_state_hash = mc_state_root[0].get_hash(0)
state_hash = check_block_header_proof(mc_block_cell[0], blk.root_hash, True)

if mc_state_hash != state_hash:
    raise ProofError('mc state hashes mismatch')
```

- _Почему?_ - потому что мы проверили доказательство заголовка блока, и это означает, что мы можем доверять другим данным ячейки. Итак, теперь мы доверяем новому хешу обновления Меркла ShardState, и чтобы доверять данным второй ячейки, нам нужно проверить, совпадают ли хеши.

Теперь давайте десериализуем вторую ячейку:

```python
{
    'global_id': -239,
    'shard_id': {'shard_pfx_bits': 0, 'workchain_id': -1, 'shard_prefix': 0},
    'seq_no': 31220993,
    'vert_seq_no': 1,
    'gen_utime': 1689699158,
    'gen_lt': 39391488000004,
    'min_ref_mc_seqno': 31220989,
    'out_msg_queue_info': <Cell 288[0101AFFE84CDD73951BCE07EEAAD120D00400295220D6F66F1163B5FA8668202D72B0001] -> 0 refs>,
    'before_split': 0,
    'accounts': <Cell 288[0101FAED0DD3CA110ADA3D22980E3795D2BDF15450E9159892BBF330CDFD13A3B880016E] -> 0 refs>,
    'overload_history': 0,
    'underload_history': 18446744073709551615,
    'total_balance': {'grams': 2364000148715550620, 'other': None},
    'total_validator_fees': {'grams': 0, 'other': None},
    'libraries': None,
    'master_ref': None,
    'custom': {
        'shard_hashes': {
            0: {'list': [{
                    'seq_no': 36908135,
                    'reg_mc_seqno': 31220993,
                    'start_lt': 39391487000000,
                    'end_lt': 39391487000005,
                    'root_hash': b"9\xe5\xcb\xca[\xf6\x97P\xb5\xd9\x89xr\xc3\xa0\xd7\xa3\xe6\x14\xe5!\xc5>M\xe7(\xfa\xfe\xd3\x8d\xce'",
                    'file_hash': b'\xf1\xf0\xe5\xcd\xc4\xb8\xa1,\xf2C\x8d\xca\xb6\x0fG\x12\xd1\xdc\x04\xf3y+\x1dr\xf2P\x0c\xbfd\tH\xb7',
                    'before_split': False,
                    'before_merge': False,
                    'want_split': False,
                    'want_merge': True,
                    'nx_cc_updated': False,
                    'flags': 0,
                    'next_catchain_seqno': 459607,
                    'next_validator_shard': 9223372036854775808,
                    'min_ref_mc_seqno': 31220989,
                    'gen_utime': 1689699153,
                    'split_merge_at': None,
                    'fees_collected': {'grams': 1016817575, 'other': None}, 'funds_created': {'grams': 1000000000, 'other': None}
                }]
            }
        },
        'config': {'config_addr': '5555555555555555555555555555555555555555555555555555555555555555', 'config': None},
        'flags': 1,
        'validator_info': {'validator_list_hash_short': 2862618141, 'catchain_seqno': 459393, 'nx_cc_updated': False},
        'prev_blocks': None,
        'after_key_block': True,
        'last_key_block': {'end_lt': 39382372000004, 'seqno': 31212222, 'root_hash': b'\xe2\x0c0\x8crt\x11\x8d\x05\xd0\xf7\x87BU\xfeZH\xddr\xf4\x12,\x9e\xac\xaf\xf2\xdf4J]\xee+', 'file_hash': b'\x01\xfc\xa6\x13PG\xee~x\x98\x7f\x15n~\xb5\x0bw\xe4\t\x7f\xa4\\\xd1\xa6\xda\x1d\xf5c\x03\x1c\xf6\x85'},
        'block_create_stats': {'type_': 'block_create_stats', 'counters': None},
        'global_balance': {'grams': 5089971531496870767, 'other': None}
    }
}
```

Поскольку мы доверяем этой ячейке, мы можем доверять данным блока шарда (`ShardStateUnsplit` -> `custom` -> `shard_hashes` -> `0 (shrdblk wc)` -> `leaf`).

## Состояние аккаунта

Давайте докажем состояние аккаунта `EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG` для того же блока мастерчейна, с которого мы начали статью.

Liteserver [ответ](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/tl/generate/scheme/lite_api.tl#L37) содержит идентификатор блока мастерчейна _(должен быть тем же, что мы отправили в ls)_, идентификатор блока шарда и `shard_proof` boc, который мы должны проверить, как описано выше,
`proof` boc и `state` boc.

<details>

<summary><b>Показать bocs</b></summary>

```boc
Proof boc:
    b5ee9c7201023d020008480100094603f93fe5eda41a6ce9ecb353fd589842bd3f5d5e73b846cb898525293fc742fd6902190209460339e5cbca5bf69750b5d9897872c3a0d7a3e614e521c53e4de728fafed38dce27001d34235b9023afe2ffffff110000000000000000000000000002332c670000000164b6c351000023d38b96fdc501dc64fd200304052848010138f8d1c6e9f798a477d13aa26cb4d6cfe1a17949ac276b2f1e0ce037a521b9bc0001221382097522af06ffaff1f0063321d90000000000000000ffffffffffffffff825d48abc1bfebfc7bc2df8993c189361000023d38b69370401dc64fd2fa78ec529bcf9931e14f9d8b27ec1469290c0baef8256d657ce573b9679c5997431fcda6bf2d0be39344a9336cfe0ae9c844a88d2bd8022102e4012a760d4db83323130104ba9157837fd7f8f8070833231301032030fdc45f2d3838090a0b284801013e38e2548c5236a9652c45e553ced677f76550097b94138a4576f122443944d400692848010159e1a18ee4e5670306b5203912c87dffc17898f0999bd128a6965027d53b6fa40215231301013fa38088aaea2b780c0d10284801016f315f25b4a39ac12c85fea4ecfe7a83e5e59d1f059783fa0c3ef2797308806100002848010188d5f8a73382aea73dede03fc3bcda2634a717ef50e7428d5a4a44c771b014b90066231301005ecd9e51e5d22a380e0f1023130100303b3b607d7ffc781112132848010182eb0e24c842092ec2705486cbbe98de8016d55f5cff4ea910471a4c3a7a1cf1003b28480101ed7e26bd36efa6d5d9b4f6aaab9813af0742a84244977f74fd4074c9c98908be000028480101ca85960e3fc3dfb6d26e83ae87a837ae5c2faf7c8d43ea177393c602fadaa0300039221100e0f41ada252e2f08141528480101d7acbb602338c86d610f35cfb362fd76fc18b1812476b6fca99a0678e665fcf50000284801014fae109c41f3d5e2be0a3ff00a007f2e50a796797700d18a7aa663e531c37180002d221100e05c33225b78bce8161728480101545b5925b3ab2a8df2470fe22a5a3c9cc64e3cb24407c26167e0fbb476e05309002c221100e03480847f372168181928480101844a14c99695506e920635d18e76d9e685adee74e5fba6f6d3b371ca77e348130029220f00d0b1cce62aecc81a1b220f00c625c7e90dfc681c1d284801019ca2157c92d49b9d051388de45d07072c78a3aa65a5b05547d94e0369aa6bdee002a284801010326812b62712345473070d679bc38cdbbce58b7a2bf6c5c6f091fc8d36e81cd001f220f00c279d628dbf2081e1f220f00c0b8f29f9d04e82021284801019143abf2a72662054eda4f4949d010c897aff4383b514b387cff790408231c6c001a28480101de5072f46a0e0ecab2bbfc2cfc62a3fe200f12d5d457df833a46eb747fa004e30059220f00c03fa2ec9ad848222328480101baee90fd11a130d6d2e2ded21ae4a7b86553116015b7e7ebfc52369534d298b20017220f00c02e722bded7282425220d00ab138e7f18482627284801017f1df311101e472b1d443334d2426fd339539f558694c60e3428221dcb1a5478001628480101e1fc242c29e519f9740ca2570d85779aed0c593cc36b59119852945988e186960015220d00a21324d3ff2828292848010199fe288fdce2606d39f9b6af72f9c2643ef06e6bacc15dd72cfa84d63c9e44a40013220d00a1e877ec8ba82a2b284801019e019e92be76a5ae7aee239299f561682afbe445dc42ee57ccc31ecb427fdf42000e220d00a1db848431a82c2d284801012345b80e66c025fb62c41261b5d230616303ec47f3bb7a255872fada62a1e8bf0010220d00a1d633bc10682e2f220d00a02ca3ddc468303128480101654781e5d466ec4ca50cb2983b20170bb5d90e2e6ab83ed7d42a829651a5eec1000a219abb19e61b8190c2587677c010ce49a93364b965f7762a9810d916b082f45e080a02bc35ebaa649b46ac72e6e4d4c1293b66d58d9ed7a54902beefd97f5bff7977dd85998b3d000023c5643934413228480101edced2278013ea497dd2e286f495b4f7f8df6ea73e08e85414fc43a611c17797000b284801018282d13bf66b9ace1fbf5d3abd1c59cc46d61af1d47af1665d3013d8f9e47488000828480101b3e9649d10ccb379368e81a3a7e8e49c8eb53f6acc69b0ba2ffa80082f70ee390001241011ef55aaffffff113536373802a09bc7a98700000000840102332c67000000010000000000000000000000000064b6c351000023d38b96fdc0000023d38b96fdc5d41c6e3c0007035701dc64fd01dc42bec400000003000000000000002e393a28480101cb54530ac857df730e82ee239b2150528c6e5f6ed3678eab6e1e789f0e3c7a5300032a8a04f2ad1ede336a68623ddabf36cb8fa405dbe70a38c453f711000f9a9f92592db0f93fe5eda41a6ce9ecb353fd589842bd3f5d5e73b846cb898525293fc742fd69021902193b3c28480101d0cf03a1058c2fd6029288951051a0d82733953c1e9181a67c502ce59b180200000b0098000023d38b69370401dc64fd2fa78ec529bcf9931e14f9d8b27ec1469290c0baef8256d657ce573b9679c5997431fcda6bf2d0be39344a9336cfe0ae9c844a88d2bd8022102e4012a760d4db0098000023d38b87bb8402332c662b4e96320f9d0afb02e5d55b6b42c3349e33540620ecc07b399211fd56e4de3e2555617cdde457cd65a0ad033aafc0c6c25df716b04e455f49179668a46300db688c0103f2ad1ede336a68623ddabf36cb8fa405dbe70a38c453f711000f9a9f92592db04a4ff9713b206e420baaee4dd21febbeb426fcd9ce158db2a56dce9188fc313e0219001b688c0103f93fe5eda41a6ce9ecb353fd589842bd3f5d5e73b846cb898525293fc742fd6987d796744ca386906016c56921370d01f72cb004a1d7c294752afe4446da07bb0219001b
State boc:
    b5ee9c720102160100033c000271c006f5bc67986e06430961d9df00433926a4cd92e597ddd8aa6043645ac20bd178222c859043259e0d9000008f1590e4d10d405786bd75534001020114ff00f4a413f4bcf2c80b030051000000e929a9a317c1b3226ce226d6d818bafe82d3633aa0f06a6c677272d1f9b760ff0d0dcf56d8400201200405020148060704f8f28308d71820d31fd31fd31f02f823bbf264ed44d0d31fd31fd3fff404d15143baf2a15151baf2a205f901541064f910f2a3f80024a4c8cb1f5240cb1f5230cbff5210f400c9ed54f80f01d30721c0009f6c519320d74a96d307d402fb00e830e021c001e30021c002e30001c0039130e30d03a4c8cb1f12cb1fcbff1213141502e6d001d0d3032171b0925f04e022d749c120925f04e002d31f218210706c7567bd22821064737472bdb0925f05e003fa403020fa4401c8ca07cbffc9d0ed44d0810140d721f404305c810108f40a6fa131b3925f07e005d33fc8258210706c7567ba923830e30d03821064737472ba925f06e30d08090201200a0b007801fa00f40430f8276f2230500aa121bef2e0508210706c7567831eb17080185004cb0526cf1658fa0219f400cb6917cb1f5260cb3f20c98040fb0006008a5004810108f45930ed44d0810140d720c801cf16f400c9ed540172b08e23821064737472831eb17080185005cb055003cf1623fa0213cb6acb1fcb3fc98040fb00925f03e20201200c0d0059bd242b6f6a2684080a06b90fa0218470d4080847a4937d29910ce6903e9ff9837812801b7810148987159f31840201580e0f0011b8c97ed44d0d70b1f8003db29dfb513420405035c87d010c00b23281f2fff274006040423d029be84c6002012010110019adce76a26840206b90eb85ffc00019af1df6a26840106b90eb858fc0006ed207fa00d4d422f90005c8ca0715cbffc9d077748018c8cb05cb0222cf165005fa0214cb6b12ccccc973fb00c84014810108f451f2a7020070810108d718fa00d33fc8542047810108f451f2a782106e6f746570748018c8cb05cb025006cf165004fa0214cb6a12cb1fcb3fc973fb0002006c810108d718fa00d33f305224810108f459f2a782106473747270748018c8cb05cb025005cf165003fa0213cb6acb1f12cb3fc973fb00000af400c9ed54
```

</details>

Когда мы проверили `доказательство шарда`, нам нужно десериализовать ячейки `proof` и `state`. Во-первых, ячейка доказательства `proof` должна иметь ровно 2 корня:

```json

[<Cell 280[0339E5CBCA5BF69750B5D9897872C3A0D7A3E614E521C53E4DE728FAFED38DCE27001D] -> 1 refs>, <Cell 280[03F93FE5EDA41A6CE9ECB353FD589842BD3F5D5E73B846CB898525293FC742FD690219] -> 1 refs>]

```

Первый корень - это доказательство Меркла для блока шарда (мы уже доказали и доверяем его хешу):

```json
280[0339E5CBCA5BF69750B5D9897872C3A0D7A3E614E521C53E4DE728FAFED38DCE27001D] -> {
	64[11EF55AAFFFFFF11] -> {
		640[9BC7A98700000000840102332C67000000010000000000000000000000000064B6C351000023D38B96FDC0000023D38B96FDC5D41C6E3C0007035701DC64FD01DC42BEC400000003000000000000002E] -> {
			608[000023D38B69370401DC64FD2FA78EC529BCF9931E14F9D8B27EC1469290C0BAEF8256D657CE573B9679C5997431FCDA6BF2D0BE39344A9336CFE0AE9C844A88D2BD8022102E4012A760D4DB],
			608[000023D38B87BB8402332C662B4E96320F9D0AFB02E5D55B6B42C3349E33540620ECC07B399211FD56E4DE3E2555617CDDE457CD65A0AD033AAFC0C6C25DF716B04E455F49179668A46300DB]
		},
		288[0101CB54530AC857DF730E82EE239B2150528C6E5F6ED3678EAB6E1E789F0E3C7A530003],
		552[04F2AD1EDE336A68623DDABF36CB8FA405DBE70A38C453F711000F9A9F92592DB0F93FE5EDA41A6CE9ECB353FD589842BD3F5D5E73B846CB898525293FC742FD6902190219] -> {
			560[0103F2AD1EDE336A68623DDABF36CB8FA405DBE70A38C453F711000F9A9F92592DB04A4FF9713B206E420BAAEE4DD21FEBBEB426FCD9CE158DB2A56DCE9188FC313E0219001B],
			560[0103F93FE5EDA41A6CE9ECB353FD589842BD3F5D5E73B846CB898525293FC742FD6987D796744CA386906016C56921370D01F72CB004A1D7C294752AFE4446DA07BB0219001B]
		},
		288[0101D0CF03A1058C2FD6029288951051A0D82733953C1E9181A67C502CE59B180200000B]
	}
}
```

Как и в проверке `доказательсва шарда`, нам нужно использовать функцию `check_block_header`: проверить, действительна ли ячейка блока, и запомнить новый хеш `StateUpdate`.

Затем мы десериализуем второй корень (назовем его `state_cell`) и проверяем, совпадает ли его Hash_1 с хешем, который мы запомнили:

```python
proof_cells = Cell.from_boc(proof)
if len(proof_cells) != 2:
    raise ProofError('expected 2 root cells in account state proof')

state_cell = proof_cells[1]

state_hash = check_block_header_proof(proof_cells[0][0], shrd_blk.root_hash, True)

if state_cell[0].get_hash(0) != state_hash:
    raise ProofError('state hashes mismatch')
```

Теперь мы можем доверять `state_cell`, который выглядит так:

<details>

<summary><b>Показать ячейку</b></summary>

```json
280[03F93FE5EDA41A6CE9ECB353FD589842BD3F5D5E73B846CB898525293FC742FD690219] -> {
	362[9023AFE2FFFFFF110000000000000000000000000002332C670000000164B6C351000023D38B96FDC501DC64FD00] -> {
		288[010138F8D1C6E9F798A477D13AA26CB4D6CFE1A17949AC276B2F1E0CE037A521B9BC0001],
		75[82097522AF06FFAFF1E0] -> {
			76[0104BA9157837FD7F8F0] -> {
				76[01032030FDC45F2D3830] -> {
					288[010159E1A18EE4E5670306B5203912C87DFFC17898F0999BD128A6965027D53B6FA40215],
					76[01013FA38088AAEA2B70] -> {
						288[010188D5F8A73382AEA73DEDE03FC3BCDA2634A717EF50E7428D5A4A44C771B014B90066],
						76[01005ECD9E51E5D22A30] -> {
							76[0100303B3B607D7FFC70] -> {
								288[0101CA85960E3FC3DFB6D26E83AE87A837AE5C2FAF7C8D43EA177393C602FADAA0300039],
								68[00E0F41ADA252E2F00] -> {
									288[01014FAE109C41F3D5E2BE0A3FF00A007F2E50A796797700D18A7AA663E531C37180002D],
									68[00E05C33225B78BCE0] -> {
										288[0101545B5925B3AB2A8DF2470FE22A5A3C9CC64E3CB24407C26167E0FBB476E05309002C],
										68[00E03480847F372160] -> {
											288[0101844A14C99695506E920635D18E76D9E685ADEE74E5FBA6F6D3B371CA77E348130029],
											60[00D0B1CCE62AECC0] -> {
												60[00C625C7E90DFC60] -> {
													288[01010326812B62712345473070D679BC38CDBBCE58B7A2BF6C5C6F091FC8D36E81CD001F],
													60[00C279D628DBF200] -> {
														60[00C0B8F29F9D04E0] -> {
															288[0101DE5072F46A0E0ECAB2BBFC2CFC62A3FE200F12D5D457DF833A46EB747FA004E30059],
															60[00C03FA2EC9AD840] -> {
																288[0101BAEE90FD11A130D6D2E2DED21AE4A7B86553116015B7E7EBFC52369534D298B20017],
																60[00C02E722BDED720] -> {
																	52[00AB138E7F1840] -> {
																		288[0101E1FC242C29E519F9740CA2570D85779AED0C593CC36B59119852945988E186960015],
																		52[00A21324D3FF20] -> {
																			288[010199FE288FDCE2606D39F9B6AF72F9C2643EF06E6BACC15DD72CFA84D63C9E44A40013],
																			52[00A1E877EC8BA0] -> {
																				288[01019E019E92BE76A5AE7AEE239299F561682AFBE445DC42EE57CCC31ECB427FDF42000E],
																				52[00A1DB848431A0] -> {
																					288[01012345B80E66C025FB62C41261B5D230616303EC47F3BB7A255872FADA62A1E8BF0010],
																					52[00A1D633BC1060] -> {
																						52[00A02CA3DDC460] -> {
																							616[BB19E61B8190C2587677C010CE49A93364B965F7762A9810D916B082F45E080A02BC35EBAA649B46AC72E6E4D4C1293B66D58D9ED7A54902BEEFD97F5BFF7977DD85998B3D000023C564393441] -> {
																								288[01018282D13BF66B9ACE1FBF5D3ABD1C59CC46D61AF1D47AF1665D3013D8F9E474880008]
																							},
																							288[0101EDCED2278013EA497DD2E286F495B4F7F8DF6EA73E08E85414FC43A611C17797000B]
																						},
																						288[0101654781E5D466EC4CA50CB2983B20170BB5D90E2E6AB83ED7D42A829651A5EEC1000A]
																					}
																				}
																			}
																		}
																	},
																	288[01017F1DF311101E472B1D443334D2426FD339539F558694C60E3428221DCB1A54780016]
																}
															}
														},
														288[01019143ABF2A72662054EDA4F4949D010C897AFF4383B514B387CFF790408231C6C001A]
													}
												},
												288[01019CA2157C92D49B9D051388DE45D07072C78A3AA65A5B05547D94E0369AA6BDEE002A]
											}
										}
									}
								},
								288[0101D7ACBB602338C86D610F35CFB362FD76FC18B1812476B6FCA99A0678E665FCF50000]
							},
							288[010182EB0E24C842092EC2705486CBBE98DE8016D55F5CFF4EA910471A4C3A7A1CF1003B],
							288[0101ED7E26BD36EFA6D5D9B4F6AAAB9813AF0742A84244977F74FD4074C9C98908BE0000]
						},
						288[0101ED7E26BD36EFA6D5D9B4F6AAAB9813AF0742A84244977F74FD4074C9C98908BE0000]
					},
					288[01016F315F25B4A39AC12C85FEA4ECFE7A83E5E59D1F059783FA0C3EF279730880610000]
				},
				288[01013E38E2548C5236A9652C45E553CED677F76550097B94138A4576F122443944D40069],
				288[0101B3E9649D10CCB379368E81A3A7E8E49C8EB53F6ACC69B0BA2FFA80082F70EE390001]
			},
			288[0101B3E9649D10CCB379368E81A3A7E8E49C8EB53F6ACC69B0BA2FFA80082F70EE390001]
		},
		868[0000000000000000FFFFFFFFFFFFFFFF825D48ABC1BFEBFC7BC2DF8993C189361000023D38B69370401DC64FD2FA78EC529BCF9931E14F9D8B27EC1469290C0BAEF8256D657CE573B9679C5997431FCDA6BF2D0BE39344A9336CFE0AE9C844A88D2BD8022102E4012A760D4DB0] -> {
			288[0101B3E9649D10CCB379368E81A3A7E8E49C8EB53F6ACC69B0BA2FFA80082F70EE390001]
		}
	}
}
```

</details>

Опять же, единственная ссылка доказательсва Меркла имеет префикс `9023AFE2`, который является [ShardStateUnsplit](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L410)
Префикс схемы TLB, поэтому мы собираемся десериализовать его в соответствии со схемой TLB:

```python
{
    'global_id': -239,
    'shard_id': {'shard_pfx_bits': 0, 'workchain_id': 0, 'shard_prefix': 0},
    'seq_no': 36908135,
    'vert_seq_no': 1,
    'gen_utime': 1689699153,
    'gen_lt': 39391487000005,
    'min_ref_mc_seqno': 31220989,
    'out_msg_queue_info': <Cell 288[010138F8D1C6E9F798A477D13AA26CB4D6CFE1A17949AC276B2F1E0CE037A521B9BC0001] -> 0 refs>,
    'before_split': 0,
    'accounts': (
        {
            50368879097771769677871174881221998657607998794347754829932074327482686052226: {
                'account': None,
                'last_trans_hash': b'd\x9bF\xacr\xe6\xe4\xd4\xc1);f\xd5\x8d\x9e\xd7\xa5I\x02\xbe\xef\xd9\x7f[\xffyw\xdd\x85\x99\x8b=',
                'last_trans_lt': 39330697000001,
                'cell': <Cell 320[649B46AC72E6E4D4C1293B66D58D9ED7A54902BEEFD97F5BFF7977DD85998B3D000023C564393441] -> 1 refs>
            }
        },
        [
            {'split_depth': 0, 'balance': {'grams': 5873792469, 'other': None}},
            {'split_depth': 0, 'balance': {'grams': 5991493155, 'other': None}},
            {'split_depth': 0, 'balance': {'grams': 63109456003, 'other': None}},
            {'split_depth': 0, 'balance': {'grams': 63822897549, 'other': None}},
            ...
            {'split_depth': 0, 'balance': {'grams': 21778458402704, 'other': None}},
            {'split_depth': 0, 'balance': {'grams': 54074699968483, 'other': None}},
            {'split_depth': 0, 'balance': {'grams': 2725956214994157511, 'other': None}}
        ]
    ),
    'overload_history': 0,
    'underload_history': 18446744073709551615,
    'total_balance': {'grams': 2725956214994157511, 'other': None},
    'total_validator_fees': {'grams': 37646260890702444, 'other': None},
    'libraries': None,
    'master_ref': {'master': {'end_lt': 39391484000004, 'seqno': 31220989, 'root_hash': b'/\xa7\x8e\xc5)\xbc\xf9\x93\x1e\x14\xf9\xd8\xb2~\xc1F\x92\x90\xc0\xba\xef\x82V\xd6W\xceW;\x96y\xc5\x99', 'file_hash': b't1\xfc\xdak\xf2\xd0\xbe94J\x936\xcf\xe0\xae\x9c\x84J\x88\xd2\xbd\x80"\x10.@\x12\xa7`\xd4\xdb'}},
    'custom': None
}
```

Здесь нам нужно поле `account`, которое имеет [ShardAccounts](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L261) тип.
`ShardAccounts` — это HashmapAugE, где key — это адрес hash_part, value имеет тип `ShardAccount`, а extra имеет тип `DeepBalanceInfo`.

Анализируя адрес `EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG`, мы получаем hash_part, равный `50368879097771769677871174881221998657607998794347754829932074327482686052226`, поэтому нам нужно
получить из хэшпама значение этого ключа:

```python
{
    50368879097771769677871174881221998657607998794347754829932074327482686052226: {
        'account': None,
        'last_trans_hash': b'd\x9bF\xacr\xe6\xe4\xd4\xc1);f\xd5\x8d\x9e\xd7\xa5I\x02\xbe\xef\xd9\x7f[\xffyw\xdd\x85\x99\x8b=',
        'last_trans_lt': 39330697000001,
        'cell': <Cell 320[649B46AC72E6E4D4C1293B66D58D9ED7A54902BEEFD97F5BFF7977DD85998B3D000023C564393441] -> 1 refs>
    }
}
```

Нам нужно запомнить `last_trans_hash` и `last_trans_lt`, потому что мы можем использовать их для получения транзакций по аккаунту, и давайте проверим всю ячейку этих данных:

```json
320[649B46AC72E6E4D4C1293B66D58D9ED7A54902BEEFD97F5BFF7977DD85998B3D000023C564393441] -> {
	288[01018282D13BF66B9ACE1FBF5D3ABD1C59CC46D61AF1D47AF1665D3013D8F9E474880008]
}
```

Как мы видим, ячейка является обычной ячейкой с уровнем 1, которая имеет только одну ссылку - обрезанные данные акканта, поэтому давайте вычислим Hash_1 этой обрезанной ветви - это хэш состояния аккаунта, которому мы можем доверять: `8282d13bf66b9ace1fbf5d3abd1c59cc46d61af1d47af1665d3013d8f9e47488`.

Теперь последний шаг - десериализация boc `state`:

```json
449[C006F5BC67986E06430961D9DF00433926A4CD92E597DDD8AA6043645AC20BD178222C859043259E0D9000008F1590E4D10D405786BD755300] -> {
	80[FF00F4A413F4BCF2C80B] -> {
		2[00] -> {
			4[40] -> {
				920[D001D0D3032171B0925F04E022D749C120925F04E002D31F218210706C7567BD22821064737472BDB0925F05E003FA403020FA4401C8CA07CBFFC9D0ED44D0810140D721F404305C810108F40A6FA131B3925F07E005D33FC8258210706C7567BA923830E30D03821064737472BA925F06E30D] -> {
					480[01FA00F40430F8276F2230500AA121BEF2E0508210706C7567831EB17080185004CB0526CF1658FA0219F400CB6917CB1F5260CB3F20C98040FB0006],
					552[5004810108F45930ED44D0810140D720C801CF16F400C9ED540172B08E23821064737472831EB17080185005CB055003CF1623FA0213CB6ACB1FCB3FC98040FB00925F03E2]
				},
				2[00] -> {
					2[00] -> {
						4[50] -> {
							242[B29DFB513420405035C87D010C00B23281F2FFF274006040423D029BE84C40],
							2[00] -> {
								97[ADCE76A26840206B90EB85FF80],
								97[AF1DF6A26840106B90EB858F80]
							}
						},
						68[B8C97ED44D0D70B1F0]
					},
					357[BD242B6F6A2684080A06B90FA0218470D4080847A4937D29910CE6903E9FF9837812801B7810148987159F3180]
				}
			},
			992[F28308D71820D31FD31FD31F02F823BBF264ED44D0D31FD31FD3FFF404D15143BAF2A15151BAF2A205F901541064F910F2A3F80024A4C8CB1F5240CB1F5230CBFF5210F400C9ED54F80F01D30721C0009F6C519320D74A96D307D402FB00E830E021C001E30021C002E30001C0039130E30D03A4C8CB1F12CB1FCBFF] -> {
				440[D207FA00D4D422F90005C8CA0715CBFFC9D077748018C8CB05CB0222CF165005FA0214CB6B12CCCCC973FB00C84014810108F451F2A702],
				448[810108D718FA00D33FC8542047810108F451F2A782106E6F746570748018C8CB05CB025006CF165004FA0214CB6A12CB1FCB3FC973FB0002],
				432[810108D718FA00D33F305224810108F459F2A782106473747270748018C8CB05CB025005CF165003FA0213CB6ACB1F12CB3FC973FB00],
				40[F400C9ED54]
			}
		}
	},
	321[000000E929A9A317C1B3226CE226D6D818BAFE82D3633AA0F06A6C677272D1F9B760FF0D0DCF56D800]
}
```

Вычислите его хэш представления и убедитесь, что он соответствует тому, который мы получили из обрезанной: `8282d13bf66b9ace1fbf5d3abd1c59cc46d61af1d47af1665d3013d8f9e47488`.

И десериализуем его в соответствии со схемой TLB [аккаунта](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L231-L233):

```python
{
    'addr': Address<EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG>,
    'storage_stat': {'used': {'cells': 22, 'bits': 5697, 'public_cells': None}, 'last_paid': 1689502130, 'due_payment': None},
    'storage': {
        'last_trans_lt': 39330697000003,
        'balance': {'grams': 5873792469, 'other': None},
        'state': {
            'type_': 'account_active',
            'state_init': {'split_depth': None, 'special': None, 'code': <Cell 80[FF00F4A413F4BCF2C80B] -> 1 refs>, 'data': <Cell 321[000000E929A9A317C1B3226CE226D6D818BAFE82D3633AA0F06A6C677272D1F9B760FF0D0DCF56D800] -> 0 refs>, 'library': None}
        }
    }
}
```

Теперь мы можем доверять данным состояния этого аккаунта.

## Транзакции аккаунта

Для запроса [liteServer.getTransactions](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/tl/generate/scheme/lite_api.tl#L71) мы должны предоставить `lt` и `hash` транзакции, с которой нужно начать.
Если мы хотим получить последние транзакции по аккауунте, мы можем получить их из `ShardAccount` (описано выше) и доверять этим `lt` и `hash`.

Когда мы получаем транзакции от Liteserver, мы получаем boc с количеством транзакций, которые мы запросили у корней. Каждый корень — это ячейка, которую мы должны десериализовать в соответствии со схемой TLB [транзакций](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L263-L269).
Для первой ячейки транзакции мы должны проверить, что ее хэш совпадает с `last_trans_hash`, который мы получили из состояния аккаунта. Затем мы запоминаем значение поля `prev_trans_hash` и сравниваем его с хешем второго корня и так далее.

## Блок транзакций

Давайте спросим Liteserver о транзакциях, принадлежащих блоку, с которого мы начали статью.
LiteServer [ответ](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/lite_api.tl#L46) содержит поле `ids` с транзакциями и `proof` boc. Сначала давайте десериализуем `proof`:

```json
280[0351ED3B9E728E7C548B15A5E5CE988B4A74984C3F8374F3F1A52C7B1F46C264060016] -> {
	64[11EF55AAFFFFFF11] -> {
		288[0101F8039FE65901BE422094ED29FA05DD4A9406708D7C54EBF7F6010F2E8A9DCBB10001],
		288[01018C6053C1185700C0FE4311D5CF8FA533EA0382E361A7B76D0CF299B75AC0356C0003],
		288[0101741100D622B0D5264BCDB86A14E36FC8C349B82AE49E037002EB07079EAD8B060015],
		545[4A33F6FD11224E018A0801116DBA929FAA60F8B9DFB39286C07FDE613D4F158E4031612597E23F312DA061732C2DB7C7C7F0BCA6295EF25D04F46FA21A055CF213A1270A80] -> {
			288[0101E057F7AA0545EF9E6BF187542A5141298303A33BA7C9CE26C71FFD9C7D2050600004],
			6[00],
			6[80] -> {
				9[4000] -> {
					605[BFB333333333333333333333333333333333333333333333333333333333333333029999999999999999999999999999999999999999999999999999999999999999CF800008F4E2E9900000] -> {
						9[5000] -> {
							288[01015EF0532AF460BCF3BECF1A94597C1EC04879E0F26BF58269D319121376AAD4730002]
						},
						9[4000] -> {
							288[0101B1E091FCB9DF53917EAA0CAE05041B3D0956242871E3CA8D6909D0AA31FF36040002]
						},
						520[7239A4AED4308E2E6AC11C880CCB29DFEE407A3E94FC1EDBDD4D29AF3B5DFEEE58A9B07203A0F457150A2BF7972DA7E2A79642DEBE792E919DE5E2FC284D2B158A]
					},
					607[BF955555555555555555555555555555555555555555555555555555555555555502AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD0000008F4E2E99000C0] -> {
						288[0101924B5992DF95114196994A6D449D89E1C002CB96C14D11C4A667F843A3FAF4410002],
						520[72899B3A210DDD28D905C583FF8559BCF73D0CF0C05C11210BD7059BAB2AB453E03524184B116C9E39D9D5293179588F4B7D8F5D8192FEFE66B9FE40A71518DBC7]
					}
				}
			},
			288[01010FC5CF36DC84BC46E7175768AB3EC0F94988D454F2C496DC1AC32E638CD3C23D0005]
		}
	}
}
```

Теперь мы должны проверить доказательство заголовка блока (чтобы доверять этим данным ячейки) и десериализовать его в соответствии со схемой блока TLB:

```python
{
    'global_id': -239,
    'info': None,
    'value_flow': None,
    'state_update': None,
    'extra': {
        'in_msg_descr': <Cell 288[0101E057F7AA0545EF9E6BF187542A5141298303A33BA7C9CE26C71FFD9C7D2050600004] -> 0 refs>,
        'out_msg_descr': ({}, [<Slice 5[00] -> 0 refs>]),
        'account_blocks': (
            {
                23158417847463239084714197001737581570653996933128112807891516801582625927987:  {
                    'account_addr': '3333333333333333333333333333333333333333333333333333333333333333',
                    'transactions': (
                        {
                            39391488000001: <Cell 288[01015EF0532AF460BCF3BECF1A94597C1EC04879E0F26BF58269D319121376AAD4730002] -> 0 refs>,
                            39391488000002: <Cell 288[0101B1E091FCB9DF53917EAA0CAE05041B3D0956242871E3CA8D6909D0AA31FF36040002] -> 0 refs>
                        },
                        [{'grams': 0, 'other': None}, {'grams': 0, 'other': None}, {'grams': 0, 'other': None}]
                    ),
                    'state_update': {'old_hash': b'9\xa4\xae\xd40\x8e.j\xc1\x1c\x88\x0c\xcb)\xdf\xee@z>\x94\xfc\x1e\xdb\xddM)\xaf;]\xfe\xeeX', 'new_hash': b'\xa9\xb0r\x03\xa0\xf4W\x15\n+\xf7\x97-\xa7\xe2\xa7\x96B\xde\xbey.\x91\x9d\xe5\xe2\xfc(M+\x15\x8a'}
                },
                38597363079105398474523661669562635951089994888546854679819194669304376546645: {
                    'account_addr': '5555555555555555555555555555555555555555555555555555555555555555',
                    'transactions': (
                        {
                            39391488000003: <Cell 288[0101924B5992DF95114196994A6D449D89E1C002CB96C14D11C4A667F843A3FAF4410002] -> 0 refs>
                        },
                    [{'grams': 0, 'other': None}]
                    ),
                    'state_update': {'old_hash': b'\x89\x9b:!\r\xdd(\xd9\x05\xc5\x83\xff\x85Y\xbc\xf7=\x0c\xf0\xc0\\\x11!\x0b\xd7\x05\x9b\xab*\xb4S\xe0', 'new_hash': b'5$\x18K\x11l\x9e9\xd9\xd5)1yX\x8fK}\x8f]\x81\x92\xfe\xfef\xb9\xfe@\xa7\x15\x18\xdb\xc7'}
                }
            },
            [{'grams': 0, 'other': None}, {'grams': 0, 'other': None}, {'grams': 0, 'other': None}]
        ),
        'rand_seed': b'\x11"N\x01\x8a\x08\x01\x11m\xba\x92\x9f\xaa`\xf8\xb9\xdf\xb3\x92\x86\xc0\x7f\xdea=O\x15\x8e@1a%',
        'created_by': b"\x97\xe2?1-\xa0as,-\xb7\xc7\xc7\xf0\xbc\xa6)^\xf2]\x04\xf4o\xa2\x1a\x05\\\xf2\x13\xa1'\n",
        'custom': None
    }
}
```

В этом случае мы должны запомнить поле `block` -> `extra` -> `account_blocks`, которое имеет тип [ShardAccountBlocks](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L282),
который является HashmapAugE, где key — это адрес hash_part, value имеет тип [AccountBlock](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L277-L280) и дополнительный тип `CurrencyCollection`:

```python
{
    23158417847463239084714197001737581570653996933128112807891516801582625927987:  {
        'account_addr': '3333333333333333333333333333333333333333333333333333333333333333',
        'transactions': (
            {
                39391488000001: <Cell 288[01015EF0532AF460BCF3BECF1A94597C1EC04879E0F26BF58269D319121376AAD4730002] -> 0 refs>,
                39391488000002: <Cell 288[0101B1E091FCB9DF53917EAA0CAE05041B3D0956242871E3CA8D6909D0AA31FF36040002] -> 0 refs>
            },
            [{'grams': 0, 'other': None}, {'grams': 0, 'other': None}, {'grams': 0, 'other': None}]
        ),
        'state_update': {'old_hash': b'9\xa4\xae\xd40\x8e.j\xc1\x1c\x88\x0c\xcb)\xdf\xee@z>\x94\xfc\x1e\xdb\xddM)\xaf;]\xfe\xeeX', 'new_hash': b'\xa9\xb0r\x03\xa0\xf4W\x15\n+\xf7\x97-\xa7\xe2\xa7\x96B\xde\xbey.\x91\x9d\xe5\xe2\xfc(M+\x15\x8a'}
    },
    38597363079105398474523661669562635951089994888546854679819194669304376546645: {
        'account_addr': '5555555555555555555555555555555555555555555555555555555555555555',
        'transactions': (
            {
                39391488000003: <Cell 288[0101924B5992DF95114196994A6D449D89E1C002CB96C14D11C4A667F843A3FAF4410002] -> 0 refs>
            },
        [{'grams': 0, 'other': None}]
        ),
        'state_update': {'old_hash': b'\x89\x9b:!\r\xdd(\xd9\x05\xc5\x83\xff\x85Y\xbc\xf7=\x0c\xf0\xc0\\\x11!\x0b\xd7\x05\x9b\xab*\xb4S\xe0', 'new_hash': b'5$\x18K\x11l\x9e9\xd9\xd5)1yX\x8fK}\x8f]\x81\x92\xfe\xfef\xb9\xfe@\xa7\x15\x18\xdb\xc7'}
    }
}
```

Теперь давайте проверим `ids`:

```python
[
    {'mode': 39, 'account': '3333333333333333333333333333333333333333333333333333333333333333', 'lt': 39391488000001, 'hash': '5ef0532af460bcf3becf1a94597c1ec04879e0f26bf58269d319121376aad473'},
    {'mode': 39, 'account': '3333333333333333333333333333333333333333333333333333333333333333', 'lt': 39391488000002, 'hash': 'b1e091fcb9df53917eaa0cae05041b3d0956242871e3ca8d6909d0aa31ff3604'},
    {'mode': 39, 'account': '5555555555555555555555555555555555555555555555555555555555555555', 'lt': 39391488000003, 'hash': '924b5992df95114196994a6d449d89e1c002cb96c14d11c4a667f843a3faf441'}
]
```

Для каждой транзакции здесь нам нужно найти ее в `account_block`, который мы запомнили, и сравнить хэши:

```python
block_trs: dict = acc_block.get(int(tr['account'], 16)).transactions[0]
block_tr: Cell = block_trs.get(tr['lt'])
assert block_tr.get_hash(0) == tr['hash']
```

:::note

В этом примере не было необходимости проверять поле `ids`, мы могли просто взять транзакции из блока аккаунта.
Но когда вы запрашиваете метод [liteServer.listBlockTransactionsExt](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/lite_api.tl#L80)
вы проверяете доказательства аналогично, но в этом случае вам действительно нужно сравнивать хеши.

:::

## Конфигурация

Давайте запросим у Liteserver 1, 4, 5, 7, 8 и 15 [параметров конфигурации](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/lite_api.tl#L83) (для [liteServer.getConfigAll](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/lite_api.tl#L82), где вы получаете все параметры, проверка доказательства та же самая).
[Ответ](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/lite_api.tl#L53) содержит `state_proof` и `config_proof`.

Сначала десериализуем ячейку `state_proof`:

```json
280[0351ED3B9E728E7C548B15A5E5CE988B4A74984C3F8374F3F1A52C7B1F46C264060016] -> {
	64[11EF55AAFFFFFF11] -> {
		640[9BC7A98700000000040101DC65010000000100FFFFFFFF000000000000000064B6C356000023D38BA64000000023D38BA64004886D00960007028101DC64FD01DC42BEC400000003000000000000002E] -> {
			608[000023D38B96FDC401DC650048A3971C46472B85C8D761060A6E7AE9F13A90CDDA815915A89597CFECB393A6B568807ADFB3C1C5EFC920907225175DB61CA384E4F8B313799E3CBB8B7B4085]
		},
		288[01018C6053C1185700C0FE4311D5CF8FA533EA0382E361A7B76D0CF299B75AC0356C0003],
		552[0478E0F0E601BA1161ECC1395E9A0475C4F80AADBD6C483F210E96E29CF36789E432BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046016F016F] -> {
			560[010378E0F0E601BA1161ECC1395E9A0475C4F80AADBD6C483F210E96E29CF36789E46492304DFB6EF9149781871464AF686056A9627F882F60E3B24F8C944A75EBAF016F0014],
			560[010332BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046DA58493CCB5DA3876129B0190F3C375E69E59C3AD9FF550BE708999DAD1F6F39016F0014]
		},
		288[01015720B6AEFCBF406209522895FAA6C0D10CC3315D90BCAF09791B19F595E86F8F0007]
	}
}
```

Для этого мы должны проверить доказательство заголовка блока и запомнить новый хэш `StateUpdate`.

Теперь десериализуем ячейку `config_proof`:

<details>

<summary><b>Показать ячейку</b></summary>

```json
280[0332BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046016F] -> {
	362[9023AFE2FFFFFF1100FFFFFFFF000000000000000001DC65010000000164B6C356000023D38BA6400401DC64FD40] -> {
		288[0101AFFE84CDD73951BCE07EEAAD120D00400295220D6F66F1163B5FA8668202D72B0001],
		288[0101FAED0DD3CA110ADA3D22980E3795D2BDF15450E9159892BBF330CDFD13A3B880016E],
		204[0000000000000000FFFFFFFFFFFFFFFF820CE9D9C3929379C820] -> {
			288[0101A5A7D24057D8643B2527709D986CDA3846ADCB3EDDC32D28EC21F69E17DBAAEF0001],
			288[0101DEAB5A5AAF79C5E24F8DCBBE51747D6804104F75F58ED5BED4702C353545C6AC0011]
		},
		342[CC26AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC23519B11EDDC69B7C] -> {
			288[0101C7DAE90A1FCEAD235CACC318A048986B2E12D0F68C136845669E02C4E28F018D0002],
			2[00] -> {
				8[D8] -> {
					2[00] -> {
						2[00] -> {
							2[00] -> {
								2[00] -> {
									2[00] -> {
										2[00] -> {
											288[0101F89085ED347F5F928A0DF7B1271F906F6E1EF43D89B5912774C8B42D0E24AB120001],
											2[00] -> {
												256[3333333333333333333333333333333333333333333333333333333333333333]
											}
										},
										4[40] -> {
											256[0000000000000000000000000000000000000000000000000000000000000000]
										}
									},
									2[00] -> {
										2[00] -> {
											2[00] -> {
												256[E56754F83426F69B09267BD876AC97C44821345B7E266BD956A7BFBFB98DF35C]
											},
											2[00] -> {
												329[01FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF800000008000000100]
											}
										},
										4[50] -> {
											1[80] -> {
												2[00] -> {
													83[BE000003BCB3670DC15540],
													83[BFFFFFFFBCBD1A94A20000]
												}
											}
										}
									}
								},
								2[00] -> {
									2[00] -> {
										2[00] -> {
											2[00] -> {
												104[C400000002000000000000002E]
											},
											288[0101C1F3C2ADA12BD901BBA1552C0C090CC3989649807C2B764D02548C1F664C20890007]
										},
										288[010187DADFBB3AE954E7F5472C46A729ED80AD087C5D9CEBB8D644D16DD73F88DF390009]
									},
									2[00] -> {
										288[01017CF937AF64AED1AB2CDD1435F8FF79F86E521320CC7B0CB30C9AAE81748124090002],
										2[00] -> {
											288[0101BEE8EB75C37500A75962E4FD99AFC62B3C9245948D2AC56061B0E21DDD6E9E840001],
											2[00] -> {
												128[00010000000080000000200000008000]
											}
										}
									}
								}
							},
							288[0101289F7704162F68EF3CC5B4865BD72067277E25B21514AB741396C54BD92294FA0009]
						},
						288[0101EF6962F43C1C86B216773B443F61829550DD9E956EE54EA3AC5C60E127DADD51000E]
					},
					288[0101112A0556A091DC4F72BD31FF2790783FB3238CE2AA41E1C137424D279664D7E3000A]
				},
				288[010124D21CF7AE96B1C55A1230E823DB0317CE24EC33E3BF2585C79605684304FAF20007]
			},
			766[0001AAA0161D000702816000047A7172DFB88800011E8B625908200EE215F71061846393A08C682E87BC3A12AFF2D246EB97A09164F5657F96F9A252EF71580FE5309A823F73F3C4C3F8AB73F5A85BBF204BFD22E68D36D0EFAB1818E7B428BC] -> {
				288[010150FCC05BD9723571B83316A5F650BE31EDB131D05FDC78D271486E5D4EF077E10019],
				288[0101E5BE728200B172CF7E2356CBA2AE1C6E2C790BE7C03CD7814C6E6FE3080B944B0011]
			},
			2[00] -> {
				83[BE000003BCB3670DC15540],
				83[BFFFFFFFBCBD1A94A20000]
			}
		}
	}
}
```

</details>

Нам нужно сравнить Hash_1 этой ссылки доказательства Меркла только с хешем, который мы получили из функции `check_block_header` выше, чтобы мы могли доверять этой ячейке:

```python
state_hash = check_block_header_proof(state_proof[0], block.root_hash, True)
if config_proof[0].get_hash(0) != state_hash:
    raise LiteClientError('hashes mismach')
```

Теперь десериализуем ячейку в соответствии со схемой `ShardStateUnsplit`:

```python
{
    'global_id': -239,
    'shard_id': {'shard_pfx_bits': 0, 'workchain_id': -1, 'shard_prefix': 0},
    'seq_no': 31220993,
    'vert_seq_no': 1,
    'gen_utime': 1689699158,
    'gen_lt': 39391488000004,
    'min_ref_mc_seqno': 31220989,
    'out_msg_queue_info': <Cell 288[0101AFFE84CDD73951BCE07EEAAD120D00400295220D6F66F1163B5FA8668202D72B0001] -> 0 refs>,
    'before_split': 0,
    'accounts': <Cell 288[0101FAED0DD3CA110ADA3D22980E3795D2BDF15450E9159892BBF330CDFD13A3B880016E] -> 0 refs>,
    'overload_history': 0,
    'underload_history': 18446744073709551615,
    'total_balance': {'grams': 2364000148715550620, 'other': None},
    'total_validator_fees': {'grams': 0, 'other': None},
    'libraries': None,
    'master_ref': None,
    'custom': {
        'shard_hashes': None,
        'config': {
            'config_addr': '5555555555555555555555555555555555555555555555555555555555555555',
            'config': {
                1: <Slice 256[3333333333333333333333333333333333333333333333333333333333333333] -> 0 refs>,
                4: <Slice 256[E56754F83426F69B09267BD876AC97C44821345B7E266BD956A7BFBFB98DF35C] -> 0 refs>,
                5: <Slice 329[01FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF800000008000000100] -> 0 refs>,
                7: <Slice 1[80] -> 1 refs>,
                8: <Slice 104[C400000002000000000000002E] -> 0 refs>,
                15: <Slice 128[00010000000080000000200000008000] -> 0 refs>}
            },
            'flags': 1,
            'validator_info': {'validator_list_hash_short': 2862618141, 'catchain_seqno': 459393, 'nx_cc_updated': False},
            'prev_blocks': None,
            'after_key_block': True,
            'last_key_block': {'end_lt': 39382372000004, 'seqno': 31212222, 'root_hash': b'\xe2\x0c0\x8crt\x11\x8d\x05\xd0\xf7\x87BU\xfeZH\xddr\xf4\x12,\x9e\xac\xaf\xf2\xdf4J]\xee+', 'file_hash': b'\x01\xfc\xa6\x13PG\xee~x\x98\x7f\x15n~\xb5\x0bw\xe4\t\x7f\xa4\\\xd1\xa6\xda\x1d\xf5c\x03\x1c\xf6\x85'},
            'block_create_stats': {'type_': 'block_create_stats', 'counters': None},
            'global_balance': {'grams': 5089971531496870767, 'other': {239: 666666666666, 4294967279: 1000000000000}}
    }
}
```

И возьмем поле `ShardStateUnsplit` -> `custom` -> `config` -> `config`, которое является хэш-картой, где key — это номер ConfigParam, а value — ячейка со значением параметра.

После десериализации всех параметров мы получили:

```python
{
    1: {
        'elector_addr': b'33333333333333333333333333333333',
    },
    4: {
        'dns_root_addr': b'\xe5gT\xf84&\xf6\x9b\t&{\xd8v\xac\x97\xc4H!4[~&k\xd9V\xa7\xbf\xbf\xb9\x8d\xf3\\',
    },
    5: {
        'blackhole_addr': b'\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff',
        'fee_burn_nom': 1,
        'fee_burn_denom': 2
    },
    7: {
        'to_mint': {'dict': {239: 666666666666, 4294967279: 1000000000000}}
    },
    8: {
        'version': 2,
        'capabilities': 46
    },
    15: {
        'validators_elected_for': 65536,
        'elections_start_before': 32768,
        'elections_end_before': 8192,
        'stake_held_for': 32768
    }
}
```

## См. также

- [Экзотические ячейки](/v3/documentation/data-formats/tlb/exotic-cells)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/tl-b-language.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/tl-b-language.mdx
================================================
import ThemedImage from '@theme/ThemedImage';

# Язык TL-B

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

TL-B (Type Language - Binary) служит для описания системы типов, конструкторов и существующих функций. Например, мы
можем использовать схемы TL-B для построения двоичных структур, связанных с блокчейном TON. Специальные парсеры TL-B могут считывать схемы для
десериализации двоичных данных в различные объекты. TL-B описывает схемы данных для объектов `Cell`. Если вы не знакомы с `Cells`, пожалуйста, прочтите статью [Ячейки пакеты Ячеек (BOC)](/v3/documentation/data-formats/tlb/cell-boc#cell).

## Общие сведения

Мы называем любой набор конструкций TL-B документами TL-B. Документ TL-B обычно состоит из объявлений типов (
т. е. их конструкторов) и функциональных комбинаторов. Объявление каждого комбинатора заканчивается точкой с запятой (`;`).

Вот пример возможного объявления комбинатора:

<br></br>
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/data-formats/tl-b-docs-2.png?raw=true',
    dark: '/img/docs/data-formats/tl-b-docs-2-dark.png?raw=true',
  }}
/>
<br></br>

## Конструкторы

Левая часть каждого уравнения описывает способ определения или сериализации значения типа, указанного в
правой части. Такое описание начинается с имени конструктора.

<br></br>
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/data-formats/tl-b-docs-3.png?raw=true',
    dark: '/img/docs/data-formats/tl-b-docs-3-dark.png?raw=true',
  }}
/>
<br></br>

Конструкторы используются для указания типа комбинатора, включая состояние при сериализации. Например, конструкторы
также могут использоваться, когда вы хотите указать `op`(код операции) в запросе к смарт-контракту в TON.

```tlb
// ....
transfer#5fcc3d14 <...> = InternalMsgBody;
// ....
```

- имя конструктора: `transfer`
- префиксный код конструктора: `#5fcc3d14`

Обратите внимание, что за каждым именем конструктора сразу следует необязательный тег конструктора, такой как `#_` или `$10`, который
описывает битовую строку, используемую для кодирования (сериализации) рассматриваемого конструктора.

```tlb
message#3f5476ca value:# = CoolMessage;
bool_true$0 = Bool;
bool_false$1 = Bool;
```

Левая часть каждого уравнения описывает способ определения или сериализации значения типа, указанного в
правой части. Такое описание начинается с имени конструктора, например `message` или `bool_true`, за которым сразу следует необязательный тег конструктора, например `#3f5476ca` или `$0`, который описывает биты, используемые для кодирования (
сериализации) рассматриваемого конструктора.

| конструктор                   | сериализация                                                |
| ----------------------------- | ----------------------------------------------------------- |
| `some#3f5476ca`               | 32-битный uint сериализуется из шестнадцатеричного значения |
| `some#5fe`                    | 12-битный uint сериализуется из шестнадцатеричного значения |
| `some$0101`                   | сериализует `0101` необработанные биты                      |
| `some` или `some#`            | сериализует `crc32(уравнение) \| 0x80000000`                |
| `some#_` или `some$_` или `_` | не сериализуется                                            |

Имена конструкторов (`some` в этом примере) используются как переменные в codegen. Например:

```tlb
bool_true$1 = Bool;
bool_false$0 = Bool;
```

Тип `Bool` имеет два тега `0` и `1`. Псевдокод Codegen может выглядеть так:

```python3

class Bool:
    tags = [1, 0]
    tags_names = ['bool_true', 'bool_false']
```

Если вы не хотите определять имя для текущего конструктора, просто передайте `_`, например, `_ a:(## 32) = 32Int;`

Теги конструктора могут быть заданы либо в двоичной (после знака доллара), либо в шестнадцатеричной нотации (после знака решетки). Если
тег не указан явно, анализатор TL-B должен вычислить 32-битный тег конструктора по умолчанию, хешируя с помощью алгоритма CRC32 текст "уравнения" с `| 0x80000000`, определяя этот конструктор определенным образом. Поэтому пустые теги
должны быть явно указаны `#_` или `$_`.

Этот тег будет использоваться для определения текущего типа битовой строки в процессе десериализации. Например, у нас есть 1 битовая строка `0`,
если мы скажем TLB проанализировать эту битовую строку в типе `Bool`, он проанализирует ее как `Bool.bool_false`.

Допустим, у нас есть более сложные примеры:

```tbl
tag_a$10 val:(## 32) = A;
tag_b$00 val(## 64) = A;
```

Если мы проанализируем `1000000000000000000000000000000000000001` (1 и 32 нуля и 1) в типе TLB `A` - сначала нам нужно получить первые
два бита для определения тега. В этом примере `10` - это два первых бита, и они представляют `tag_a`. Теперь мы знаем, что следующие 32
бита - это переменная `val`, `1` в нашем примере. Некоторые "проанализированные" переменные псевдокода могут выглядеть так:

```python3
A.tag = 'tag_a'
A.tag_bits = '10'
A.val = 1
```

Все имена конструкторов должны быть разными, а теги конструкторов для одного типа должны составлять префиксный код (иначе
десериализация не будет уникальной); т. е. ни один тег не может быть префиксом любого другого в том же типе.

Максимальное количество конструкторов для одного типа: `64`
Максимальное количество бит для тега: `63`

<b>Двоичный пример:</b>

```tlb
example_a$10 = A;
example_b$01 = A;
example_c$11 = A;
example_d$00 = A;
```

Псевдокод Codegen может выглядеть так:

```python3

class A:
    tags = [2, 1, 3, 0]
    tags_names = ['example_a', 'example_b', 'example_c', 'example_d']
```

<b>Пример шестнадцатеричного тега:</b>

```tlb
example_a#0 = A;
example_b#1 = A;
example_c#f = A;
```

Псевдокод Codegen может выглядеть так:

```python3

class A:
    tags = [0, 1, 15]
    tags_names = ['example_a', 'example_b', 'example_c']
```

Если вы используете тег `hex`, имейте в виду, что он будет сериализован как 4 бита для каждого шестнадцатеричного символа. Максимальное значение — 63-битное целое число без знака. Это означает:

```tlb
a#32 a:(## 32) = AMultiTagInt;
b#1111 a:(## 32) = AMultiTagInt;
c#5FE a:(## 32) = AMultiTagInt;
d#3F5476CA a:(## 32) = AMultiTagInt;
```

| конструктор  | сериализация                                                |
| ------------ | ----------------------------------------------------------- |
| `a#32`       | 8-битный uint сериализуется из шестнадцатеричного значения  |
| `b#1111`     | 16-битный uint сериализуется из шестнадцатеричного значения |
| `c#5FE`      | 12-битный uint сериализуется из шестнадцатеричного значения |
| `d#3F5476CA` | 32-битный uint сериализуется из шестнадцатеричного значения |

Также шестнадцатеричные значения разрешены как в верхнем, так и в нижнем регистре.

#### Подробнее о шестнадцатеричных тегах

В дополнение к классическому определению шестнадцатеричного тега, за шестнадцатеричным числом может следовать символ подчеркивания.
Это означает, что тег равен указанному шестнадцатеричному числу без младшего бита.
Например, есть такая схема:

```tlb
vm_stk_int#0201_ value:int257 = VmStackValue;
```

И тег на самом деле не равен `0x0201`. Чтобы вычислить его, нам нужно удалить LSb из двоичного представления `0x0201`:

```
0000001000000001 -> 000000100000000
```

Таким образом, тег равен 15-битному двоичному числу `0b000000100000000`.

## Определения полей

За конструктором и его необязательным тегом следуют определения полей. Каждое определение поля имеет
форму `ident:type-expr`, где ident — это идентификатор с именем поля (заменяется на подчеркивание для
анонимных полей), а type-expr — это тип поля. Тип, представленный здесь, является выражением типа, которое может включать
простые типы, параметризованные типы с подходящими параметрами или сложные выражения.

<b>В итоге все поля, определенные в типе, не должны быть больше, чем Cell (`1023` бит и `4` ссылки)</b>

### Простые типы

- `_ a:# = Type;` - `Type.a` здесь 32-битное целое число
- `_ a:(## 64) = Type;` - `Type.a` здесь 64-битное целое число
- `_ a:Owner = NFT;` - `NFT.a` здесь тип `Owner`
- `_ a:^Owner = NFT;` - `NFT.a` здесь ссылка на ячейку типа `Owner` означает, что `Owner` хранится в следующей ссылке на ячейку.

### Анонимные поля

- `_ _:# = A;` - первое поле - анонимное 32-битное целое число

### Расширяем ячейку ссылками

```tlb
_ a:(##32) ^[ b:(## 32) c:(## 32) d:(## 32)] = A;
```

- Если по какой-то причине мы хотим отделить некоторые поля в другую ячейку, мы можем использовать синтаксис `^[ ... ]`.
  В этом примере `A.a` / `A.b` / `A.c` / `A.d` - это 32-битные целые числа без знака, но `A.a` хранится в первой ячейке,
  а `A.b` / `A.c` / `A.d` хранятся в следующей ячейке (1 ссылка)

```tlb
_ ^[ a:(## 32) ^[ b:(## 32) ^[ c:(## 32) ] ] ] = A;
```

- Также допускаются цепочки ссылок. В этом примере каждая из
   переменные (`a`, `b`, `c`) хранятся в отдельных ячейках

### Параметризованные типы

Предположим, у нас есть тип `IntWithObj`:

```tlb
_ {X:Type} a:# b:X = IntWithObj X;
```

Теперь мы можем использовать его в других типах:

```tlb
_ a:(IntWithObj uint32) = IntWithUint32;
```

### Сложные выражения

- Условные поля (только для `Nat`) (`E?T` означает, что если выражение `E` истинно, то поле имеет тип `T`)
  ```tlb
  _ a:(## 1) b:a?(## 32) = Example;
  ```
  В типе `Example` переменная `b` сериализуется, только если `a` равно `1`

- Выражение умножения для создания кортежей (`x * T` означает создание кортежа длины `x` типа `T`):

  ```tlb
  a$_ a:(## 32) = A;
  b$_ b:(2 * A) = B;
  ```

  ```tlb
  _ (## 1) = Bit;
  _ 2bits:(2 * Bit) = 2Bits;
  ```

- Выборка бита (только для `Nat`) (`E . B` означает взятие бита `B` из `Nat` `E`)
  ```tlb
  _ a:(## 2) b:(a . 1)?(## 32) = Example;
  ```
  В типе `Example` переменная `b` сериализуется, только если второй бит `a` равен `1`

- Также разрешены другие операторы `Nat` (см. `Разрешенные ограничения`)

Примечание: можно объединить несколько сложных выражений:

```tlb
_ a:(## 1) b:(## 1) c:(## 2) d:(a?(b?((c . 1)?(## 64)))) = A;
```

## Встроенные типы

- `#` - `Nat` 32-битное целое число без знака
- `## x` - `Nat` с `x` битами
- `#< x` - `Nat` меньше `x` бит целое число без знака, сохраненное как `lenBits(x - 1)` бит, до 31 бита
- `#<= x` - `Nat` меньше или равно `x` бит целое число без знака, сохраненное как `lenBits(x)` бит, до 32 бит
- `Any` / `Cell` - остальные биты и ссылки ячейки
- `Int` - 257 бит
- `UInt` - 256 бит
- `Bits` - 1023 бита
- `uint1` - `uint256` - 1 - 256 бит
- `int1` - `int257` - 1 - 257 бит
- `bits1` - `bits1023` - 1 - 1023 бита
- `uint X` / `int X` / `bits X` - то же, что и `uintX`, но в этих типах можно использовать параметризованный `X`

## Ограничения

```tlb
_ flags:(## 10) { flags <= 100 } = Flag;
```

Поля `Nat` разрешены в ограничениях. В этом примере ограничение `{ flags <= 100 }` означает, что переменная `flags` меньше или
равна `100`.

Допустимые ограничения: `E` | `E = E` | `E <= E` | `E < E` | `E >= E` | `E > E` | `E + E` | `E * E` | `E ? E`

## Неявные поля

Некоторые поля могут быть неявными. Их определения заключены в фигурные
скобки (`{`, `}`), которые указывают, что поле фактически не присутствует в сериализации, но его значение должно быть выведено из других данных (обычно параметров сериализуемого типа). Пример:

```tlb
nothing$0 {X:Type} = Maybe X;
just$1 {X:Type} value:X = Maybe X;
```

```tlb
_ {x:#} a:(## 32) { ~x = a + 1 } = Example;
```

## Параметризованные типы

Переменные — т. е. (идентификаторы) ранее
определенных полей типов `#` (натуральные числа) или `Type` (тип типов) — могут использоваться в качестве параметров для параметризованных
типов. Процесс сериализации рекурсивно сериализует каждое поле в соответствии с его типом, а сериализация
значения в конечном итоге состоит из объединения битов, представляющих конструктор (т. е. тег конструктора), и
значений полей.

### Натуральные числа (`Nat`)

```tlb
_ {x:#} my_val:(## x) = A x;
```

Означает, что `A` параметризуется с помощью `x` `Nat`. В процессе десериализации мы получим x-битное целое число без знака, например.:

```tlb
_ value:(A 32) = My32UintValue;
```

Это означает, что в процессе десериализации типа `My32UintValue` мы получим 32-битное целое число без знака (из-за `32`
параметр для типа `A`)

### Типы

```tlb
_ {X:Type} my_val:(## 32) next_val:X = A X;
```

Означает, что `A` параметризуется типом `X`. В процессе десериализации мы выберем 32-битное целое число без знака, а затем
проанализируем
биты и ссылки типа `X`.

Пример использования такого параметризованного типа может быть следующим:

```tlb
_ bit:(## 1) = Bit;
_ 32intwbit:(A Bit) = 32IntWithBit;
```

В этом примере мы передаем тип `Bit` в `A` в качестве параметра.

Если вы не хотите определять тип, но хотите десериализовать по этой схеме, вы можете использовать слово `Any`:

```tlb
_ my_val:(A Any) = Example;
```

Означает, что если мы десериализуем тип `Example`, мы извлечем 32-битное целое число, а затем остаток ячейки (bits&refs) в `my_val`.

Вы можете создавать сложные типы с несколькими параметрами:

```tlb
_ {X:Type} {Y:Type} my_val:(## 32) next_val:X next_next_val:Y = A X Y;
_ bit:(## 1) = Bit;
_ a_with_two_bits:(A Bit Bit) = AWithTwoBits;
```

Также вы можете использовать частичное применение к таким параметризованным типам:

```tlb
_ {X:Type} {Y:Type} v1:X v2:Y = A X Y;
_ bit:(## 1) = Bit;
_ {X:Type} bits:(A Bit X) = BitA X;
```

Или даже к самим параметризованным типам:

```tlb
_ {X:Type} v1:X = A X;
_ {X:Type} d1:X = B X;
_ {X:Type} bits:(A (B X)) = AB X;
```

### Использование полей NAT для параметризованных типов

Вы можете использовать поля, определенные ранее, как параметры для типов. Сериализация будет определена во время выполнения.

Простой пример:

```tlb
_ a:(## 8) b:(## a) = A;
```

Это означает, что мы сохраняем размер поля `b` внутри поля `a`. Поэтому, когда мы хотим сериализовать тип `A`, нам нужно загрузить 8
битное беззнаковое целое число поля `a`, а затем использовать это число для определения размера поля `b`.

Эта стратегия также работает для параметризованных типов:

```tlb
_ {input:#} c:(## input) = B input;
_ a:(## 8) c_in_b:(B a) = A;
```

### Выражение в параметризованных типах

```tlb
_ {x:#} value:(## x) = Example (x * 2);
_ _:(Example 4) = 2BitInteger;
```

В этом примере тип "Example.value" определяется во время выполнения.

В определении `2BitInteger` мы устанавливаем значение типа `Example 4`. Для определения этого типа мы используем определение `Example (x * 2)`
и вычисляем `x` по формуле (`y = 2`, `z = 4`):

```c++
static inline bool mul_r1(int& x, int y, int z) {
  return y && !(z % y) && (x = z / y) >= 0;
}
```

Мы также можем использовать оператор сложения:

```tlb
_ {x:#} value:(## x) = ExampleSum (x + 3);
_ _:(ExampleSum 4) = 1BitInteger;
```

В определении `1BitInteger` мы устанавливаем значение типа `ExampleSum 4`. Для определения этого типа мы используем определение `ExampleSum (x + 3)`
и вычисляем `x` по формуле (`y = 3`, `z = 4`):

```c++
static inline bool add_r1(int& x, int y, int z) {
  return z >= y && (x = z - y) >= 0;
}
```

## Оператор отрицания (`~`)

Некоторые вхождения "переменных" (т. е. уже определенных полей) имеют префикс тильды (`~`). Это указывает на то, что использование переменной происходит в противоположном направлении по сравнению с обычным поведением: слева от уравнения означает, что переменная будет выведена (вычислена) на основе этого вхождения, вместо подстановки её ранее вычисленного значения; справа же это означает, что переменная не будет выводиться из типа, который мы сериализуем, а будет вычисляться во время процесса десериализации. В других словах, тильда преобразует "входной аргумент" в "выходной аргумент" или наоборот.

Простой пример оператора отрицания — определение новой переменной на основе другой переменной:

```tlb
_ a:(## 32) { b:# } { ~b = a + 100 } = B_Calc_Example;
```

После определения вы можете использовать новую переменную для передачи ее типам `Nat`:

```tlb
_ a:(## 8) { b:# } { ~b = a + 10 }
  example_dynamic_var:(## b) = B_Calc_Example;
```

Размер `example_dynamic_var` будет вычислен во время выполнения, когда мы загружаем переменную `a` и используем ее значение для определения размера `example_dynamic_var`.

Или для других типов:

```tlb
_ {X:Type} a:^X = PutToRef X;
_ a:(## 32) { b:# } { ~b = a + 100 }
  my_ref: (PutToRef b) = B_Calc_Example;
```

Также вы можете определять переменные с оператором отрицания в сложных выражениях сложения или умножения:

```tlb
_ a:(## 32) { b:# } { ~b + 100 = a }  = B_Calc_Example;
```

```tlb
_ a:(## 32) { b:# } { ~b * 5 = a }  = B_Calc_Example;
```

### Оператор отрицания (`~`) в определении типа

```tlb
_ {m:#} n:(## m) = Define ~n m;
_ {n_from_define:#} defined_val:(Define ~n_from_define 8) real_value:(## n_from_define) = Example;
```

Предположим, у нас есть класс `Define ~n m`, который принимает `m` и вычисляет `n`, загружая его из `m` битового целого числа без знака.

В типе `Example` мы сохраняем переменную, вычисленную типом `Define`, в `n_from_define`, также мы знаем, что это `8` битовое целое число без знака, потому что мы применяем тип `Define` с `Define ~n_from_define 8`. Теперь мы можем использовать переменную `n_from_define` в других типах для определения процесса сериализации.

Эта техника приводит к более сложным определениям типов (таким как Unions, Hashmaps).

```tlb
unary_zero$0 = Unary ~0;
unary_succ$1 {n:#} x:(Unary ~n) = Unary ~(n + 1);
_ u:(Unary Any) = UnaryChain;
```

Этот пример хорошо объяснен в статье [Типы TL-B](/v3/documentation/data-formats/tlb/tl-b-types#unary)
. Основная идея здесь заключается в том, что `UnaryChain` будет рекурсивно десериализоваться до достижения `unary_zero$0` (потому что мы знаем последний элемент типа `Unary X` по определению `unary_zero$0 = Unary ~0;`, а `X` вычисляется во время выполнения
из-за определения `Unary ~(n + 1)`).

Примечание: `x:(Unary ~n)` означает, что `n` определяется в процессе сериализации класса `Unary`.

## Специальные типы

В настоящее время TVM допускает типы ячеек:

- Ordinary
- PrunnedBranch
- Library
- MerkleProof
- MerkleUpdate

По умолчанию все ячейки являются `Ordinary`. И все ячейки, описанные в tlb, являются `Ordinary`.

Чтобы разрешить загрузку специальных типов в конструкторе, вам нужно добавить `!` перед конструктором.

Пример:

```tlb
!merkle_update#02 {X:Type} old_hash:bits256 new_hash:bits256
  old:^X new:^X = MERKLE_UPDATE X;

!merkle_proof#03 {X:Type} virtual_hash:bits256 depth:uint16 virtual_root:^X = MERKLE_PROOF X;
```

Эта техника позволяет коду codegen отмечать ячейки `SPECIAL`, когда вы хотите распечатать структуру, а также позволяет правильно
проверять структуры со специальными ячейками.

## Несколько экземпляров одного типа без проверки уникальности тега конструктора

Разрешается создавать несколько экземпляров одного типа в зависимости только от параметров типа.
При таком способе определения, проверка тега уникальности конструктора применяться не будет.

Пример:

```tlb
_ = A 1;
a$01 = A 2;
b$01 = A 3;
_ test:# = A 4;
```

Означает, что фактический тег для десериализации будет определяться параметром типа `A`:

```python3
# class for type `A`
class A(TLBComplex):
    class Tag(Enum):
        a = 0
        b = 1
        cons1 = 2
        cons4 = 3

    cons_len = [2, 2, 0, 0]
    cons_tag = [1, 1, 0, 0]

    m_: int = None

    def __init__(self, m: int):
        self.m_ = m

    def get_tag(self, cs: CellSlice) -> Optional["A.Tag"]:
        tag = self.m_

        if tag == 1:
            return A.Tag.cons1

        if tag == 2:
            return A.Tag.a

        if tag == 3:
            return A.Tag.b

        if tag == 4:
            return A.Tag.cons4

        return None
```

То же самое работает с несколькими параметрами:

```tlb
_ = A 1 1;
a$01 = A 2 1;
b$01 = A 3 3;
_ test:# = A 4 2;
```

Обратите внимание, что при добавлении определения параметризованного типа теги между предопределенным определением типа (`a`
и `b` в нашем примере) и параметризованным определением типа (`c` в нашем примере) должны быть уникальными:

_Недопустимый пример:_

```
a$01 = A 2 1;
b$11 = A 3 3;
c$11 {X:#} {Y:#} = A X Y;
```

_Допустимый пример:_

```tlb
a$01 = A 2 1;
b$01 = A 3 3;
c$11 {X:#} {Y:#} = A X Y;
```

## Комментарии

Комментарии такие же, как в C++

```tlb
/*
This is
a comment
*/

// This is one line comment
```

## Полезные источники

- [Описание старой версии TL](https://core.telegram.org/mtproto/TL)
- [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)
- [tlbc tool](https://github.com/ton-blockchain/ton/blob/master/crypto/tl/tlbc.cpp)
- [CPP Codegen](https://github.com/ton-blockchain/ton/blob/master/crypto/tl/tlbc-gen-cpp.cpp)
- [tonpy tlb tests](https://github.com/disintar/tonpy/blob/main/src/tonpy/tests/test_tlb.py)
- [tonpy py codegen](https://github.com/disintar/ton/blob/master/crypto/tl/tlbc-gen-py.cpp)

<hr/>

Документация предоставлена командой [Disintar](https://dton.io/).



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/tl-b-types.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/tl-b-types.mdx
================================================
import ThemedImage from '@theme/ThemedImage';

# Типы TL-B

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::caution продвинутый уровень
Эта информация **очень низкого уровня** и может быть трудной для понимания новичками.
Так что не стесняйтесь прочитать об этом позже.
:::

В этом разделе анализируются сложные и нетрадиционные структуры типизированного языка двоичных данных (TL-B). Для начала мы рекомендуем сначала прочитать [эту документацию](/v3/documentation/data-formats/tlb/tl-b-language), чтобы лучше ознакомиться с темой.

<img alt="tlb structure" src="/img/docs/tlb.drawio.svg" width={'100%'}/>

## Either

```tlb
left$0 {X:Type} {Y:Type} value:X = Either X Y;
right$1 {X:Type} {Y:Type} value:Y = Either X Y;
```

Тип Either используется, когда возможен один из двух результирующих типов. В этом случае выбор типа зависит от показанного префиксного бита. Если префиксный бит равен 0, сериализуется левый тип, а если используется префиксный бит 1, сериализуется правый.

Он используется, например, при сериализации сообщений, когда тело является либо частью основной ячейки, либо связано с другой ячейкой.

## Maybe

```tlb
nothing$0 {X:Type} = Maybe X;
just$1 {X:Type} value:X = Maybe X;
```

Тип Maybe используется в сочетании с необязательными значениями. В этих случаях, если первый бит равен 0, само значение не сериализуется (и фактически пропускается), а если значение равно 1, оно сериализуется.

## Both

```tlb
pair$_ {X:Type} {Y:Type} first:X second:Y = Both X Y;
```

Вариант типа Both используется только в сочетании с обычными парами, при этом оба типа сериализуются один за другим без условий.

## Unary

Функциональный тип Unary обычно используется для динамического изменения размера в таких структурах, как [hml_short](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb#L29).

Unary представляет два основных варианта:

```tlb
unary_zero$0 = Unary ~0;
unary_succ$1 {n:#} x:(Unary ~n) = Unary ~(n + 1);
```

### Унарная сериализация

Как правило, использовать вариант `unary_zero` довольно просто: если первый бит равен 0, то результатом всей унарной десериализации будет 0.

При этом вариант `unary_succ` более сложен, поскольку он загружается рекурсивно и имеет значение `~(n + 1)`. Это означает, что он последовательно вызывает себя, пока не достигнет `unary_zero`. Другими словами, желаемое значение будет равно количеству единиц в строке.

Например, давайте проанализируем сериализацию битовой строки `110`.

Цепочка вызовов будет следующей:

```tlb
unary_succ$1 -> unary_succ$1 -> unary_zero$0
```

Как только мы достигнем `unary_zero`, значение возвращается в конец сериализованной битовой строки аналогично рекурсивному вызову функции.

Теперь, чтобы более четко понять результат, давайте извлечем путь возвращаемого значения, который отображается следующим образом:

`0 -> ~(0 + 1) -> ~(1 + 1) -> 2`, это означает, что мы сериализовали `110` в `Unary 2`.

### Унарная десериализация

Предположим, у нас есть тип `Foo`:

```tlb
foo$_  u:(Unary 2) = Foo;
```

Согласно вышесказанному, `Foo` будет десериализован в:

<br></br>
<ThemedImage
alt=""
sources={{
light: '/img/docs/data-formats/tl-b-docs-10.png?raw=true',
dark: '/img/docs/data-formats/tl-b-docs-10-dark.png?raw=true',
}}
/>
<br></br>

```tlb
foo u:(unary_succ x:(unary_succ x:(unnary_zero)))
```

## Hashmap

Комплексный тип Hashmap используется для хранения словаря из кода смарт-контракта FunC (`dict`).

Следующие структуры TL-B используются для сериализации Hashmap с фиксированной длиной ключа:

```tlb
hm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l n)
          {n = (~m) + l} node:(HashmapNode m X) = Hashmap n X;

hmn_leaf#_ {X:Type} value:X = HashmapNode 0 X;
hmn_fork#_ {n:#} {X:Type} left:^(Hashmap n X)
           right:^(Hashmap n X) = HashmapNode (n + 1) X;

hml_short$0 {m:#} {n:#} len:(Unary ~n) {n <= m} s:(n * Bit) = HmLabel ~n m;
hml_long$10 {m:#} n:(#<= m) s:(n * Bit) = HmLabel ~n m;
hml_same$11 {m:#} v:Bit n:(#<= m) = HmLabel ~n m;

unary_zero$0 = Unary ~0;
unary_succ$1 {n:#} x:(Unary ~n) = Unary ~(n + 1);

hme_empty$0 {n:#} {X:Type} = HashmapE n X;
hme_root$1 {n:#} {X:Type} root:^(Hashmap n X) = HashmapE n X;
```

Это означает, что корневая структура использует `HashmapE` и одно из двух ее состояний: включая `hme_empty` или `hme_root`.

### Пример разбора Hashmap

В качестве примера рассмотрим следующую ячейку, заданную в двоичной форме.

```json
1[1] -> {
  2[00] -> {
    7[1001000] -> {
      25[1010000010000001100001001],
      25[1010000010000000001101111]
    },
    28[1011100000000000001100001001]
  }
}
```

Эта ячейка использует тип структуры `HashmapE` и обладает 8-битным размером ключа, а ее значения используют числовой фреймворк `uint16` (`HashmapE 8 uint16`). HashmapE использует 3 различных типа ключей:

```
1 = 777
17 = 111
128 = 777
```

Чтобы проанализировать этот Hashmap, нам нужно заранее знать, какой тип структуры использовать, `hme_empty` или `hme_root`. Это определяется путем определения `правильного префикса`. Вариант hme empty использует один бит 0 (`hme_empty$0`), а hme root использует один бит 1 (`hme_root$1`). После считывания первого бита определяется, что он равен единице (`1[1]`), то есть это вариант `hme_root`.

Теперь давайте заполним переменные структуры известными значениями, при этом начальный результат будет следующим:
`hme_root$1 {n:#} {X:Type} root:^(Hashmap 8 uint16) = HashmapE 8 uint16;`

Здесь префикс из одного бита уже считан, но внутри `{}` обозначены условия, которые не нужно считывать. Условие `{n:#}` означает, что n — это любое число uint32, тогда как `{X:Type}` означает, что X может использовать любой тип.

Следующая часть, которую нужно прочитать, — это `root:^(Hashmap 8 uint16)`, тогда как символ `^` обозначает ссылку, которую необходимо загрузить.

```json
2[00] -> {
    7[1001000] -> {
      25[1010000010000001100001001],
      25[1010000010000000001101111]
    },
    28[1011100000000000001100001001]
  }
```

#### Инициирование анализа ветвей

Согласно нашей схеме, это правильная структура `Hashmap 8 uint16`. Далее мы заполняем ее известными значениями и получаем результат:

```tlb
hm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l 8)
          {8 = (~m) + l} node:(HashmapNode m uint16) = Hashmap 8 uint16;
```

Как показано выше, теперь появились условные переменные `{l:#}` и `{m:#}`, но значения обеих переменных нам неизвестны. Также после прочтения соответствующей `label` становится ясно, что `n` участвует в уравнении `{n = (~m) + l}`, в этом случае мы вычисляем `l` и `m`, знак `сообщает нам результирующее значение ~`.

Чтобы определить значение `l`, мы должны загрузить последовательность `label:(HmLabel ~l uint16)`. Как показано ниже, `HmLabel` имеет 3 основных структурных варианта:

```tlb
hml_short$0 {m:#} {n:#} len:(Unary ~n) {n <= m} s:(n * Bit) = HmLabel ~n m;
hml_long$10 {m:#} n:(#<= m) s:(n * Bit) = HmLabel ~n m;
hml_same$11 {m:#} v:Bit n:(#<= m) = HmLabel ~n m;
```

Каждый вариант определяется соответствующим префиксом. В настоящее время наша корневая ячейка состоит из 2 нулевых битов, что отображается как: (`2[00]`). Поэтому единственным логическим вариантом является `hml_short$0`, который использует префикс, начинающийся с 0.

Заполните `hml_short` известными значениями:

```tlb
hml_short$0 {m:#} {n:#} len:(Unary ~n) {n <= 8} s:(n * Bit) = HmLabel ~n 8
```

В этом случае мы не знаем значение `n`, но поскольку оно содержит символ `~`, его можно вычислить. Для этого мы загружаем `len:(Unary ~n)`, [подробнее об Unary здесь](#unary).

В этом случае мы начали с `2[00]`, но после определения типа `HmLabel` только один из двух битов все еще существует.

Поэтому мы загружаем его и видим, что его значение равно 0, что означает, что он явно использует вариацию `unary_zero$0`. Это означает, что значение n с использованием вариации `HmLabel` равно нулю.

Далее необходимо завершить последовательность вариаций `hml_short`, используя вычисленное значение n:

```tlb
hml_short$0 {m:#} {n:#} len:0 {n <= 8} s:(0 * Bit) = HmLabel 0 8
```

Оказывается, у нас есть пустой `HmLabel`, обозначенный как, s = 0, поэтому загружать нечего.

Далее мы дополняем нашу структуру вычисленным значением `l` следующим образом:

```tlb
hm_edge#_ {n:#} {X:Type} {l:0} {m:#} label:(HmLabel 0 8)
          {8 = (~m) + 0} node:(HashmapNode m uint16) = Hashmap 8 uint16;
```

Теперь, когда мы вычислили значение `l`, мы также можем вычислить `m`, используя уравнение `n = (~m) + 0`, т. е. `m = n - 0`, m = n = 8.

После определения всех неизвестных значений теперь можно загрузить `node:(HashmapNode 8 uint16)`.

Что касается HashmapNode, у нас есть варианты:

```tlb
hmn_leaf#_ {X:Type} value:X = HashmapNode 0 X;
hmn_fork#_ {n:#} {X:Type} left:^(Hashmap n X)
           right:^(Hashmap n X) = HashmapNode (n + 1) X;
```

В этом случае мы определяем вариант не с помощью префикса, а с помощью параметра. Это означает, что если n = 0, то правильным конечным результатом будет либо `hmn_leaf`, либо `hmn_fork`.
В этом примере результат равен n = 8 (вариация hmn_fork). Мы используем вариацию `hmn_fork` и заполняем известные значения:

```tlb
hmn_fork#_ {n:#} {X:uint16} left:^(Hashmap n uint16)
           right:^(Hashmap n uint16) = HashmapNode (n + 1) uint16;
```

После ввода известных значений мы должны вычислить `HashmapNode (n + 1) uint16`. Это означает, что полученное значение n должно быть равно нашему параметру, т. е. 8.
Чтобы вычислить локальное значение n, нам нужно вычислить его с помощью следующей формулы: `n = (n_local + 1)` -> `n_local = (n - 1)` -> `n_local = (8 - 1)` -> `n_local = 7`.

```tlb
hmn_fork#_ {n:#} {X:uint16} left:^(Hashmap 7 uint16)
           right:^(Hashmap 7 uint16) = HashmapNode (7 + 1) uint16;
```

Теперь, когда мы знаем, что указанная выше формула требуется, получить конечный результат просто.
Далее мы загружаем левую и правую ветви и для каждой последующей ветви [процесс повторяется](#initiating-branch-parsing).

#### Анализ загруженных значений Hashmap

Продолжая предыдущий пример, давайте рассмотрим, как работает процесс загрузки ветвей (для значений словаря), то есть `28[10111000000000000001100001001]`

Конечным результатом снова становится `hm_edge`, и следующим шагом будет заполнение последовательности правильными известными значениями следующим образом:

```tlb
hm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l 7)
          {7 = (~m) + l} node:(HashmapNode m uint16) = Hashmap 7 uint16;
```

Далее ответ `HmLabel` загружается с использованием вариации `HmLabel`, поскольку префикс равен `10`.

```tlb
hml_long$10 {m:#} n:(#<= m) s:(n * Bit) = HmLabel ~n m;
```

Теперь давайте заполним последовательность:

```tlb
hml_long$10 {m:#} n:(#<= 7) s:(n * Bit) = HmLabel ~n 7;
```

Новая конструкция - `n:(#<= 7)`, ясно обозначает размерное значение, которое соответствует числу 7, которое на самом деле является log2 от числа + 1. Но для простоты мы могли бы посчитать количество бит, необходимых для записи числа 7.
Соответственно, число 7 в двоичной форме равно `111`; поэтому требуется 3 бита, что означает значение для `n = 3`.

```tlb
hml_long$10 {m:#} n:(## 3) s:(n * Bit) = HmLabel ~n 7;
```

Далее мы загружаем `n` в последовательность с конечным результатом `111`, который, как мы отметили выше = 7 по совпадению. Затем мы загружаем `s` в последовательность, 7 бит - `0000000`. Помните, `s` является частью ключа.

Далее мы возвращаемся к началу последовательности и заполняем полученное `l`:

```tlb
hm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel 7 7)
          {7 = (~m) + 7} node:(HashmapNode m uint16) = Hashmap 7 uint16;
```

Затем мы вычисляем значение `m`, `m = 7 - 7`, поэтому значение `m = 0`.
Поскольку значение `m = 0`, структура идеально подходит для использования с HashmapNode:

```tlb
hmn_leaf#_ {X:Type} value:X = HashmapNode 0 X;
```

Далее мы подставляем наш тип uint16 и загружаем значение. Оставшиеся 16 бит `0000001100001001` в десятичной форме составляют 777, следовательно, наше значение.

Теперь давайте восстановим ключ, мы должны объединить упорядоченный список всех частей ключа, которые были вычислены ранее.
Каждая из двух связанных частей ключа объединяется одним битом на основе того, какие ветви типа используются.
Для правой ветви добавляется бит "1", а для левой ветви добавляется бит "0". Если выше существует полная HmLabel, то ее биты добавляются к ключу.

В этом случае конкретно из HmLabel `0000000` берутся 7 бит, а перед последовательностью нулей добавляется бит "1", поскольку значение было получено из правой ветви. Конечный результат составляет 8 бит в общей сложности или `10000000`, что означает, что значение ключа равно `128`.

## Другие типы Hashmap

Теперь, когда мы обсудили Hashmap и как загрузить стандартизированный тип Hashmap, давайте объясним, как работают дополнительные типы Hashmap.

### HashmapAugE

```tlb
ahm_edge#_ {n:#} {X:Type} {Y:Type} {l:#} {m:#}
  label:(HmLabel ~l n) {n = (~m) + l}
  node:(HashmapAugNode m X Y) = HashmapAug n X Y;

ahmn_leaf#_ {X:Type} {Y:Type} extra:Y value:X = HashmapAugNode 0 X Y;

ahmn_fork#_ {n:#} {X:Type} {Y:Type} left:^(HashmapAug n X Y)
  right:^(HashmapAug n X Y) extra:Y = HashmapAugNode (n + 1) X Y;

ahme_empty$0 {n:#} {X:Type} {Y:Type} extra:Y
          = HashmapAugE n X Y;

ahme_root$1 {n:#} {X:Type} {Y:Type} root:^(HashmapAug n X Y)
  extra:Y = HashmapAugE n X Y;
```

Главное отличие между `HashmapAugE` и обычным `Hashmap` заключается в наличии поля `extra:Y` в каждом узле (а не только в листьях со значениями).

### PfxHashmap

```tlb
phm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l n)
           {n = (~m) + l} node:(PfxHashmapNode m X)
           = PfxHashmap n X;

phmn_leaf$0 {n:#} {X:Type} value:X = PfxHashmapNode n X;
phmn_fork$1 {n:#} {X:Type} left:^(PfxHashmap n X)
            right:^(PfxHashmap n X) = PfxHashmapNode (n + 1) X;

phme_empty$0 {n:#} {X:Type} = PfxHashmapE n X;
phme_root$1 {n:#} {X:Type} root:^(PfxHashmap n X)
            = PfxHashmapE n X;
```

Главное отличие между PfxHashmap и обычным Hashmap заключается в его способности хранить ключи разной длины из-за наличия узлов `phmn_leaf$0` и `phmn_fork$1`.

### VarHashmap

```tlb
vhm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l n)
           {n = (~m) + l} node:(VarHashmapNode m X)
           = VarHashmap n X;
vhmn_leaf$00 {n:#} {X:Type} value:X = VarHashmapNode n X;
vhmn_fork$01 {n:#} {X:Type} left:^(VarHashmap n X)
             right:^(VarHashmap n X) value:(Maybe X)
             = VarHashmapNode (n + 1) X;
vhmn_cont$1 {n:#} {X:Type} branch:Bit child:^(VarHashmap n X)
            value:X = VarHashmapNode (n + 1) X;

// nothing$0 {X:Type} = Maybe X;
// just$1 {X:Type} value:X = Maybe X;

vhme_empty$0 {n:#} {X:Type} = VarHashmapE n X;
vhme_root$1 {n:#} {X:Type} root:^(VarHashmap n X)
            = VarHashmapE n X;
```

Главное отличие VarHashmap от обычного Hashmap заключается в его способности хранить ключи разной длины из-за наличия узлов `vhmn_leaf$00` и ​​`vhmn_fork$01`. Кроме того, `VarHashmap` может формировать общий префикс значения (дочернюю карту) за счет `vhmn_cont$1`.

### BinTree

```tlb
bta_leaf$0 {X:Type} {Y:Type} extra:Y leaf:X = BinTreeAug X Y;
bta_fork$1 {X:Type} {Y:Type} left:^(BinTreeAug X Y)
           right:^(BinTreeAug X Y) extra:Y = BinTreeAug X Y;
```

Механизм генерации ключей двоичного дерева работает аналогично стандартизированной структуре Hashmap, но не использует метки и включает только префиксы ветвей.

## Адреса

Адреса TON формируются с помощью механизма хеширования sha256 с использованием структуры TL-B StateInit. Это означает, что адрес можно вычислить до развертывания сетевого контракта.

### Сериализация

Стандартные адреса, такие как `EQBL2_3lMiyywU17g-or8N7v9hDmPCpttzBPE2isF2GTzpK4`, используют URI base64 для кодирования байтов.
Обычно они имеют длину 36 байтов, последние 2 из которых представляют собой контрольную сумму crc16, рассчитанную с помощью таблицы XMODEM, в то время как первый байт представляет флаг, а второй представляет рабочую цепочку.
32 байта в середине представляют собой данные самого адреса (также называемые AccountID), часто представленные в схемах, таких как int256.

[Пример декодирования](https://github.com/xssnick/tonutils-go/blob/3d9ee052689376061bf7e4a22037ff131183afad/address/addr.go#L156)

## Ссылки

_Вот [ссылка на оригинальную статью](https://github.com/xssnick/ton-deep-doc/blob/master/TL-B.md) [Олега Баранова](https://github.com/xssnick)._



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/tlb-ide.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/tlb-ide.md
================================================
# Поддержка IDE

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Плагин [intellij-ton](https://github.com/andreypfau/intellij-ton) поддерживает языки программирования Fift и FunC, а также формат typed language binary (TL-B).

Кроме того, правильные спецификации синтаксиса TL-B описаны в
файле [TlbParser.bnf](https://github.com/ton-blockchain/intellij-ton/blob/main/src/main/grammar/TlbParser.bnf).



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/tlb-tools.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/tlb-tools.md
================================================
# Инструменты TL-B

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Парсеры TL-B

Парсеры TL-B помогают выполнять сериализацию базовых [типов TL-B](/v3/documentation/data-formats/tlb/tl-b-types). Каждый из них реализует типы TL-B как объект и возвращает сериализованные двоичные данные.

| Язык       | SDK                                                                                                                  | Ссылка                                                                      |
| ---------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Kotlin     | [ton-kotlin](https://github.com/ton-community/ton-kotlin/tree/main/tlb) (+ парсинг файлов `.tlb`) | https://t.me/tonkotlin                      |
| Go         | [tonutils](https://github.com/xssnick/tonutils-go/tree/master/tlb)                                                   | https://t.me/tonutils                       |
| Go         | [tongo](https://github.com/tonkeeper/tongo/tree/master/tlb) (+ парсинг файлов `.tlb`)             | https://t.me/tongo_lib |
| TypeScript | [tlb-parser](https://github.com/ton-community/tlb-parser)                                                            | -                                                                           |
| Python     | [ton-kotlin](https://github.com/disintar/tonpy) (+ парсинг файлов `.tlb`)                         | https://t.me/dtontech                       |

## Генератор TL-B

Пакет [tlb-codegen](https://github.com/ton-community/tlb-codegen) позволяет генерировать Typescript код для сериализации и десериализации структур в соответствии с предоставленной схемой TLB.

Пакет [tonpy](https://github.com/disintar/tonpy) позволяет генерировать код на Python для сериализации и десериализации структур в соответствии с предоставленной схемой TLB.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/transaction-layout.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/data-formats/tlb/transaction-layout.md
================================================
# Структура транзакции

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::info
Чтобы максимально полно понять эту страницу, настоятельно рекомендуется ознакомиться с [языком TL-B](/v3/documentation/data-formats/tlb/cell-boc).
:::

Блокчейн TON работает с использованием трех ключевых частей: учетных записей, сообщений и транзакций. На этой странице описывается структура и схема транзакций.

Транзакция — это операция, которая обрабатывает входящие и исходящие сообщения, связанные с конкретным аккаунтом, изменяя его состояние и потенциально генерируя комиссии для валидаторов.

## Транзакция

```tlb
transaction$0111 account_addr:bits256 lt:uint64
    prev_trans_hash:bits256 prev_trans_lt:uint64 now:uint32
    outmsg_cnt:uint15
    orig_status:AccountStatus end_status:AccountStatus
    ^[ in_msg:(Maybe ^(Message Any)) out_msgs:(HashmapE 15 ^(Message Any)) ]
    total_fees:CurrencyCollection state_update:^(HASH_UPDATE Account)
    description:^TransactionDescr = Transaction;
```

| Поле              | Тип                                                                                 | Обязательное | Описание                                                                                                                                                                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `account_addr`    | bits256                                                                             | Да           | Хэш-часть адреса, по которому была выполнена транзакция. [Подробнее об адресах](/v3/documentation/smart-contracts/addresses#address-of-smart-contract)                                                                         |
| `lt`              | uint64                                                                              | Да           | Представляет *Логическое время*. [Подробнее о логическом времени](/v3/documentation/smart-contracts/message-management/messages-and-transactions#what-is-a-logical-time)                                                       |
| `prev_trans_hash` | bits256                                                                             | Да           | Хэш предыдущей транзакции в этой учетной записи.                                                                                                                                                                               |
| `prev_trans_lt`   | uint64                                                                              | Да           | `lt` предыдущей транзакции в этой учетной записи.                                                                                                                                                                              |
| `now`             | uint32                                                                              | Да           | Значение `now`, которое было установлено при выполнении этой транзакции. Это временная метка Unix в секундах.                                                                                                  |
| `outmsg_cnt`      | uint15                                                                              | Да           | Количество исходящих сообщений, созданных при выполнении этой транзакции.                                                                                                                                                      |
| `orig_status`     | [AccountStatus](#accountstatus)                                                     | Да           | Состояние этой учетной записи до выполнения транзакции.                                                                                                                                                                        |
| `end_status`      | [AccountStatus](#accountstatus)                                                     | Да           | Состояние этого аккаунта после выполнения транзакции.                                                                                                                                                                          |
| `in_msg`          | (Любое сообщение)                                                | Нет          | Входящее сообщение, которое инициировало выполнение транзакции. Хранится в ссылке.                                                                                                                             |
| `out_msgs`        | HashmapE 15 ^(Любое сообщение)                                   | Да           | Словарь, содержащий список исходящих сообщений, которые были созданы при выполнении этой транзакции.                                                                                                                           |
| `total_fees`      | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Да           | Общая сумма сборов, которые были собраны при выполнении этой транзакции. Она состоит из значения *Toncoin* и, возможно, некоторых [дополнительных валют](/v3/documentation/dapps/defi/coins#extra-currencies). |
| `state_update`    | [HASH_UPDATE](#hash_update) Аккаунт                            | Да           | Структура `HASH_UPDATE`. Хранится в ссылке.                                                                                                                                                                    |
| `description`     | [TransactionDescr](#transactiondescr-types)                                         | Да           | Подробное описание процесса выполнения транзакции. Хранится в ссылке.                                                                                                                                          |

## AccountStatus

```tlb
acc_state_uninit$00 = AccountStatus;
acc_state_frozen$01 = AccountStatus;
acc_state_active$10 = AccountStatus;
acc_state_nonexist$11 = AccountStatus;
```

- `[00]`: Аккаунт не инициализирован
- `[01]`: Аккаунт заморожен
- `[10]`: Аккаунт активен
- `[11]`: Аккаунт не существует

## HASH_UPDATE

```tlb
update_hashes#72 {X:Type} old_hash:bits256 new_hash:bits256
    = HASH_UPDATE X;
```

| Поле       | Тип     | Описание                                                            |
| ---------- | ------- | ------------------------------------------------------------------- |
| `old_hash` | bits256 | Хэш состояния аккаунта до выполнения транзакции.    |
| `new_hash` | bits256 | Хэш состояния аккаунта после выполнения транзакции. |

## Типы TransactionDescr

- [Ordinary](#ordinary)
- [Storage](#storage)
- [Tick-tock](#tick-tock)
- [Split prepare](#split-prepare)
- [Split install](#split-install)
- [Merge prepare](#merge-prepare)
- [Merge install](#merge-install)

## Обычный

Это наиболее распространенный тип транзакции, и он удовлетворяет потребности большинства разработчиков. Транзакции этого типа имеют ровно одно входящее сообщение и могут создавать несколько исходящих сообщений.

```tlb
trans_ord$0000 credit_first:Bool
    storage_ph:(Maybe TrStoragePhase)
    credit_ph:(Maybe TrCreditPhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool bounce:(Maybe TrBouncePhase)
    destroyed:Bool
    = TransactionDescr;
```

| Поле           | Тип            | Обязательное | Описание                                                                                                                                                                                                   |
| -------------- | -------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `credit_first` | Bool           | Да           | Флаг, который соответствует флагу `bounce` входящего сообщения. `credit_first = !bounce`                                                                                                   |
| `storage_ph`   | TrStoragePhase | Нет          | Содержит информацию о фазе хранения при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                     |
| `credit_ph`    | TrCreditPhase  | Нет          | Содержит информацию о фазе кредита при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                      |
| `compute_ph`   | TrComputePhase | Да           | Содержит информацию о фазе вычисления при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                   |
| `action`       | TrActionPhase  | Нет          | Содержит информацию о фазе действия при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Хранится в ссылке. |
| `aborted`      | Bool           | Да           | Указывает, было ли прервано выполнение транзакции.                                                                                                                                         |
| `bounce`       | TrBouncePhase  | Нет          | Содержит информацию о фазе отказа при выполнении транзакции. [Подробнее](/v3/documentation/smart-contracts/message-management/non-bounceable-messages)                                     |
| `destroyed`    | Bool           | Да           | Указывает, была ли уничтожена учетная запись во время выполнения.                                                                                                                          |

## Storage

Транзакции этого типа могут быть введены валидаторами по их усмотрению. Они не обрабатывают входящие сообщения и не вызывают код. Их единственным эффектом является сбор комиссий за хранение с аккаунта, что влияет на статистику и баланс хранения. Если итоговый баланс *Toncoin* счета опустится ниже определенной суммы, аккаунт может быть заморожен, а его код и данные заменены их объединенным хешем.

```tlb
trans_storage$0001 storage_ph:TrStoragePhase
    = TransactionDescr;
```

| Поле         | Тип            | Описание                                                                                                                                               |
| ------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `storage_ph` | TrStoragePhase | Содержит информацию о фазе хранения при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases) |

## Tick-tock

Транзакции `Tick` и `Tock` зарезервированы для специальных системных смарт-контрактов, которые должны автоматически вызываться в каждом блоке. Транзакции `Tick` вызываются в начале каждого блока мастерчейна, а транзакции `Tock` вызываются в конце.

```tlb
trans_tick_tock$001 is_tock:Bool storage_ph:TrStoragePhase
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool = TransactionDescr;
```

| Поле         | Тип            | Обязательное | Описание                                                                                                                                                                                                   |
| ------------ | -------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `is_tock`    | Bool           | Да           | Флаг, указывающий тип транзакции. Используется для разделения транзакций `Tick` и `Tock`                                                                                                   |
| `storage_ph` | TrStoragePhase | Да           | Содержит информацию о фазе хранения при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                     |
| `compute_ph` | TrComputePhase | Да           | Содержит информацию о фазе вычисления при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                   |
| `action`     | TrActionPhase  | Нет          | Содержит информацию о фазе действия при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Хранится в ссылке. |
| `aborted`    | Bool           | Да           | Указывает, было ли прервано выполнение транзакции.                                                                                                                                         |
| `destroyed`  | Bool           | Да           | Указывает, была ли уничтожена учетная запись во время выполнения.                                                                                                                          |

## Split Prepare

:::note
Этот тип транзакции в настоящее время не используется. Информация об этом процессе не доступна.
:::

Транзакции Split инициируются в больших смарт-контрактах, которые необходимо разделить при высокой нагрузке. Контракт должен поддерживать этот тип транзакции и управлять процессом разделения для балансировки нагрузки.

Транзакции Split Prepare инициируются, когда смарт-контракт необходимо разделить. Смарт-контракт должен генерировать состояние для нового экземпляра самого себя при развертывании.

```tlb
trans_split_prepare$0100 split_info:SplitMergeInfo
    storage_ph:(Maybe TrStoragePhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool
    = TransactionDescr;
```

| Поле         | Тип            | Обязательное | Описание                                                                                                                                                                                                    |
| ------------ | -------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `split_info` | SplitMergeInfo | Да           | Информация о процессе разделения.                                                                                                                                                           |
| `storage_ph` | TrStoragePhase | Нет          | Содержит информацию о фазе хранения при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                      |
| `compute_ph` | TrComputePhase | Да           | Содержит информацию о фазе вычисления при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                    |
| `action`     | TrActionPhase  | Нет          | Содержит информацию о фазе действия при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Сохранено в ссылке. |
| `aborted`    | Bool           | Да           | Указывает, было ли прервано выполнение транзакции.                                                                                                                                          |
| `destroyed`  | Bool           | Да           | Указывает, была ли уничтожена учетная запись во время выполнения.                                                                                                                           |

## Split install

:::note
Этот тип транзакции в настоящее время не используется. Информация об этом процессе не доступна.
:::

Транзакции Split Install используются для создания новых экземпляров больших смарт-контрактов. Состояние для нового смарт-контракта генерируется транзакцией [Split Prepare](#split-prepare).

```tlb
trans_split_install$0101 split_info:SplitMergeInfo
    prepare_transaction:^Transaction
    installed:Bool = TransactionDescr;
```

| Поле                  | Тип                         | Описание                                                                                                                                 |
| --------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `split_info`          | SplitMergeInfo              | Информация о процессе разделения.                                                                                        |
| `prepare_transaction` | [Transaction](#transaction) | Информация о [транзакции, подготовленной](#split-prepare) для операции разделения. Сохраняется в ссылке. |
| `installed`           | Bool                        | Указывает, была ли установлена ​​транзакция.                                                                             |

## Merge prepare

:::note
Этот тип транзакции в настоящее время не используется. Информация об этом процессе не доступна.
:::

Транзакции Merge инициируются в больших смарт-контрактах, которые необходимо объединить после разделения из-за высокой нагрузки. Контракт должен поддерживать этот тип транзакции и управлять процессом слияния для балансировки нагрузки.

Транзакции Merge Prepare инициируются, когда необходимо объединить два смарт-контракта. Смарт-контракт должен генерировать сообщение для другого своего экземпляра, чтобы облегчить слияние.

```tlb
trans_merge_prepare$0110 split_info:SplitMergeInfo
    storage_ph:TrStoragePhase aborted:Bool
    = TransactionDescr;
```

| Поле         | Тип            | Описание                                                                                                                                               |
| ------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `split_info` | SplitMergeInfo | Информация о процессе слияния.                                                                                                         |
| `storage_ph` | TrStoragePhase | Содержит информацию о фазе хранения при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases) |
| `aborted`    | Bool           | Указывает, было ли прервано выполнение транзакции.                                                                                     |

## Merge install

:::note
Этот тип транзакции в настоящее время не используется. Информация об этом процессе не доступна.
:::

Транзакции Merge Install используются для слияния экземпляров больших смарт-контрактов. Специальное сообщение, облегчающее слияние, генерируется транзакцией [Merge Prepare](#merge-prepare).

```tlb
trans_merge_install$0111 split_info:SplitMergeInfo
    prepare_transaction:^Transaction
    storage_ph:(Maybe TrStoragePhase)
    credit_ph:(Maybe TrCreditPhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool
    = TransactionDescr;
```

| Поле                  | Тип                         | Обязательное | Описание                                                                                                                                                                                                   |
| --------------------- | --------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `split_info`          | SplitMergeInfo              | Да           | Информация о процессе слияния.                                                                                                                                                             |
| `prepare_transaction` | [Transaction](#transaction) | Да           | Информация о [транзакции, подготовленной](#merge-prepare) для операции слияния. Хранится в ссылке.                                                                         |
| `storage_ph`          | TrStoragePhase              | Нет          | Содержит информацию о фазе хранения при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                     |
| `credit_ph`           | TrCreditPhase               | Нет          | Содержит информацию о кредитной фазе при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                    |
| `compute_ph`          | TrComputePhase              | Да           | Содержит информацию о фазе вычисления при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                   |
| `action`              | TrActionPhase               | Нет          | Содержит информацию о фазе действия при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Хранится в ссылке. |
| `aborted`             | Bool                        | Да           | Указывает, было ли прервано выполнение транзакции.                                                                                                                                         |
| `destroyed`           | Bool                        | Да           | Указывает, была ли уничтожена учетная запись во время выполнения.                                                                                                                          |

## См. также

- Оригинальное описание Структуры транзакции из технического документа



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/faq.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/faq.md
================================================
# Часто задаваемые вопросы

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

В этом разделе рассматриваются самые популярные вопросы о блокчейне TON.

## Общие сведения

### Не могли бы вы поделиться кратким обзором TON?

- [Введение в The Open Network](/v3/concepts/dive-into-ton/introduction)
- [Блокчейн TON основан на консенсусе PoS](https://blog.ton.org/the-ton-blockchain-is-based-on-pos-consensus)
- [Технические документы TON](/v3/documentation/whitepapers/overview)

### Каковы некоторые из основных сходств и различий с блокчейнами EVM?

- [TVM и EVM](/v3/concepts/dive-into-ton/go-from-ethereum/tvm-vs-evm)
- [Сравнение TON, Solana и Ethereum 2.0](https://ton.org/comparison_of_blockchains.pdf)

### Есть ли у TON тестовая среда?

- [Тестовая сеть](/v3/documentation/smart-contracts/getting-started/testnet)

## TON и L2

### Почему воркчейны лучше, чем L1 → L2?

Воркчейны в TON предлагают ряд преимуществ по сравнению с традиционной архитектурой слоев L1 и L2.

1. Одним из ключевых преимуществ блокчейна является мгновенная обработка транзакций. В традиционных решениях L2 могут быть задержки при перемещении активов между слоями. Воркчейны устраняют эту проблему, обеспечивая бесперебойные и мгновенные транзакции между различными частями сети. Это особенно важно для приложений, требующих высокой скорости и низкой задержки.
2. Воркчейны поддерживают кросс-шардовую активность, что означает, что пользователи могут взаимодействовать между различными шард-цепочками или воркчейнами в пределах одной сети. В текущих решениях L2 кросс-шардовые операции часто сложны и требуют дополнительных мостов или решений по обеспечению совместимости. Например, в TON пользователи могут легко обмениваться токенами или выполнять другие транзакции между различными шардчейнами без сложных процедур.
3. Масштабируемость является одной из основных проблем для современных блокчейн-систем. В традиционных решениях L2 масштабируемость ограничена емкостью секвенсора. Если TPS (транзакций в секунду) на L2 превышает емкость секвенсора, это может привести к проблемам. В воркчейнах в TON эта проблема решается путем разделения шарда. Когда нагрузка на шард превышает его емкость, шард автоматически делится на два или более шардов, что позволяет системе масштабироваться практически без ограничений.

### Есть ли необходимость в L2 на TON?

При любой стоимости транзакции всегда будут приложения, которые не смогут выдержать такую ​​плату, но могут работать с гораздо более низкой стоимостью. Аналогично, независимо от достигнутой задержки, всегда будут приложения, которым требуется еще более низкая задержка. Поэтому вполне возможно, что в конечном итоге может возникнуть необходимость в решениях L2 на платформе TON для удовлетворения этих конкретных требований.

## Максимальная извлекаемая ценность (MEV - Maximal Extractable Value)

### Возможен ли опережающий запуск в TON?

В блокчейне TON детерминированный порядок транзакций играет ключевую роль в предотвращении опережающего запуска. Это означает, что порядок транзакций в блокчейне предопределен и детерминирован. Ни один участник не может изменить этот порядок после того, как транзакции попали в пул. Эта система исключает возможность манипулирования порядком транзакций для получения прибыли, что отличает TON от других блокчейнов, таких как Ethereum, где валидаторы могут изменять порядок транзакций в блоке, создавая возможности для MEV (максимальной извлекаемой ценности).

Кроме того, в текущей архитектуре TON отсутствует рыночный механизм определения комиссий за транзакции. Комиссии фиксированы и не подлежат изменению в зависимости от приоритетов транзакций, что делает опережение менее привлекательным. Из-за фиксированных комиссий и детерминированного порядка транзакций осуществлять опережение в TON нетривиально.

## Блок

### Какой метод RPC используется для получения информации о блоках?

Блоки, созданные валидаторами. Существующие блоки доступны через Liteservers. Liteservers доступны через Lite Clients. На основе Lite Client созданы сторонние инструменты, такие как кошельки, обозреватели, dapps и т. д.

- Чтобы получить доступ к ядру Lite Client, ознакомьтесь с этим разделом нашего GitHub: [ton-blockchain/tonlib](https://github.com/ton-blockchain/ton/tree/master/tonlib)

Кроме того, вот три высокоуровневых сторонних обозревателя блоков:

- https://explorer.toncoin.org/last
- https://toncenter.com/
- https://tonwhales.com/explorer

Подробнее читайте в разделе [Обозреватели в TON](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton) нашей документации.

### Время блока

*2-5 сек.*

:::info
Compare TON's on-chain metrics, including block time and time-to-finality, to Solana and Ethereum by reading our analysis at:

- [Документ о сравнении блокчейнов](https://ton.org/comparison_of_blockchains.pdf)
- [Таблица сравнения блокчейнов (гораздо менее информативна, чем в документе, но более наглядна)](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison)
  :::

### Время до завершения

*Менее 6 сек.*

:::info
Compare TON's on-chain metrics, including block time and time-to-finality, to Solana and Ethereum by reading our analysis at:

- [Документ о сравнении блокчейнов](https://ton.org/comparison_of_blockchains.pdf)
- [Таблица сравнения блокчейнов (гораздо менее информативна, чем в документе, но более наглядна)](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison)
  :::

### Средний размер блока

```bash
max block size param 29
max_block_bytes:2097152
```

:::info:::

### Какова структура блоков в TON?

Подробные пояснения по каждому полю макета:

- [Расположение блоков](/v3/documentation/data-formats/tlb/block-layout)

## Транзакции

### Метод RPC для получения данных транзакций

- [см. ответ выше](/v3/documentation/faq#are-there-any-standardized-protocols-for-minting-burning-and-transferring-fungible-and-non-fungible-tokens-in-transactions)

### Является ли транзакция TON асинхронной или синхронной? Можно ли получить доступ к документации, которая показывает, как работает эта система?

Асинхронные сообщения блокчейна TON:

- отправитель подготавливает тело транзакции (сообщение boc) и транслирует его через Lite Client (или инструмент более высокого уровня)
- Lite Client возвращает статус трансляции, а не результат выполнения транзакции
- отправитель проверяет желаемый результат, прослушивая состояние целевого аккаунта (адреса) или состояние всего блокчейна

Объяснение того, как работает асинхронный обмен сообщениями TON, приводится на примере, связанном со смарт-контрактами кошелька:

- [Как работают кошельки TON и как получить к ним доступ с помощью JavaScript](https://blog.ton.org/how-ton-wallets-work-and-how-to-access-them-from-javascript#1b-sending-a-transfer)

Пример передачи контракта кошелька (низкоуровневый):

- https://github.com/xssnick/tonutils-go/blob/master/example/wallet/main.go

### Можно ли определить, завершена ли транзакция на 100%? Достаточно ли запроса данных уровня транзакции для получения этой информации?

**Короткий ответ:** Чтобы убедиться, что транзакция завершена, необходимо проверить аккаунт получателя.

Чтобы узнать больше о проверке транзакций, см. следующие примеры:

- Go: [Пример кошелька](https://github.com/xssnick/tonutils-go/blob/master/example/wallet/main.go)
- Python: [Бот витрины с платежами в TON](/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot)
- JavaScript: [Бот для продажи пельменей](/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js)

### Какова структура транзакции в TON?

Подробные пояснения по каждому полю макета:

- [Макет транзакции](/v3/documentation/data-formats/tlb/transaction-layout)

### Возможна ли пакетная обработка транзакций?

Да, пакетная обработка транзакций в TON может быть выполнена двумя различными способами:

- Используя асинхронную природу TON, т. е. отправляя независимые транзакции в сеть
- Используя смарт-контракты, которые получают задачу и выполняют ее как пакет

Пример использования пакетного контракта (high-load wallet):

- https://github.com/tonuniverse/highload-wallet-api

Кошельки по умолчанию (v3/v4) также поддерживают отправку нескольких сообщений (до 4) в одной транзакции.

## Стандарты

### Какая точность валют доступна для TON?

*9 цифр*

:::info
Количество десятичных знаков, поддерживаемых основной сетью: 9 цифр.
:::

### Существуют ли стандартизированные протоколы для выпуска, сжигания и передачи взаимозаменяемых и невзаимозаменяемых токенов в транзакциях?

Невзаимозаменяемые токены (NFT):

- [TEP-62: стандарт NFT](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)
- [Документация NFT](/v3/documentation/dapps/defi/tokens#nft)

Жетоны (токены):

- [TEP-74: Стандарт Жетонов](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)
- [Обзор распределенных токенов](https://telegra.ph/Scalable-DeFi-in-TON-03-30)
- [Документация по взаимозаменяемым токенам (Жетонам)](/v3/documentation/dapps/defi/tokens#jettons-fungible-tokens)

Другие стандарты:

- https://github.com/ton-blockchain/TEPs

### Есть ли примеры разбора событий с Жетонами (токенами) и NFT?

В TON все данные передаются как boc-сообщения. Это означает, что использование NFT в транзакциях не является исключительным событием. Скорее, это обычное сообщение, которое отправляется или принимается из (NFT- или Wallet-)контракта, что очень похоже на транзакцию с использованием стандартного кошелька.

Однако некоторые API индексаторы позволяют просматривать все сообщения, отправленные в контракт или из него, и фильтровать их в соответствии с вашими конкретными требованиями.

- https://docs.tonconsole.com/tonapi/rest-api

Чтобы лучше понять, как работает этот процесс, см. раздел [Обработка платежей](/v3/guidelines/dapps/asset-processing/payments-processing).

## Структура аккаунтов

### Каков формат адреса?

- [Адрес смарт-контракта](/v3/documentation/smart-contracts/addresses)

### Возможно ли владеть именным аккаунтом, похожим на ENS

Да, используйте TON DNS:

- [TON DNS и домены](/v3/guidelines/web3/ton-dns/dns)

### Как отличить обычный аккаунт от смарт-контракта?

- [Все есть смарт-контракт](/v3/documentation/smart-contracts/addresses#everything-is-a-smart-contract)

### Как узнать, является ли адрес адресом токена?

Для **жетонов** контракт должен реализовывать [стандартный интерфейс](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) и возвращать данные с помощью методов *get_wallet_data()* или *get_jetton_data()*.

### Существуют ли какие-либо специальные аккаунты (например, аккаунты, принадлежащие сети), которые имеют правила или методы, отличные от остальных?

Внутри TON есть специальный главный блокчейн, называемый Мастерчейн. Он состоит из общесетевых контрактов с сетевой конфигурацией, контрактов, связанных с валидатором, и т. д.:

:::info
Подробнее о мастерчейне, воркчейнах и шардчейнах читайте в обзорной статье с блокчейне TON: [Блокчейн Блокчейнов](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains).
:::

Хорошим примером является смарт-контракт управления, который является частью мастерчейна:

- [Контракты управления](/v3/documentation/smart-contracts/contracts-specs/governance)

## Смарт-контракты

### Можно ли обнаружить события развертывания контракта в TON?

[Все в TON является смарт-контрактом](/v3/documentation/smart-contracts/addresses#everything-is-a-smart-contract).

Адрес аккаунта генерируется детерминированн из его *начального состояния*, которое включает *начальный код* и *начальные данные* (для кошельков начальные данные включают открытый ключ среди других параметров).
При изменении любого компонента адрес изменяется соответствующим образом.

Смарт-контракт может существовать в неинициализированном состоянии, что означает, что его состояние недоступно в блокчейне, но контракт имеет ненулевой баланс. Первоначальное состояние может быть отправлено в сеть позже с помощью внутреннего или внешнего сообщения, чтобы их можно было отслеживать для обнаружения развертывания контракта.

Чтобы защитить цепочки сообщений от остановки на несуществующих контрактах, TON использует функцию «bounce». Подробнее читайте в этих статьях:

- [Развертывание кошелька через TonLib](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment)
- [Оплата обработки запросов и отправка ответов](/v3/documentation/smart-contracts/transaction-fees/forward-fees)

### Представляет ли возможность обновления смарт-контракта угрозу для его пользователей?

В настоящее время возможность обновления смарт-контрактов является обычной практикой и широко используется в большинстве современных протоколов. Это связано с тем, что возможность обновления позволяет исправлять ошибки, добавлять новые функции и повышать безопасность.

Как снизить риски:

1. Обращайте внимание на проекты с хорошей репутацией и известными командами разработчиков.
2. Авторитетные проекты всегда проводят независимые аудиты кода, чтобы убедиться, что код безопасен и надежен. Ищите проекты, которые прошли несколько аудитов от авторитетных аудиторских фирм.
3. Активное сообщество и положительные отзывы могут служить дополнительным показателем надежности проекта.
4. Изучите, как именно проект реализует процесс обновления. Чем прозрачнее и децентрализованнее процесс, тем меньше риск для пользователей.

### Как пользователи могут быть уверены, что владелец контракта не изменит определенные условия (через обновление)?

Контракт должен быть проверен, это позволяет вам проверить исходный код и убедиться, что нет логики обновления, чтобы гарантировать, что он останется неизменным. Если в контракте действительно отсутствуют механизмы для изменения кода, условия контракта останутся неизменными после развертывания.

Иногда логика обновления может существовать, но права на изменение кода могут быть перемещены на "нулевой" адрес, что также исключает изменения.

### Возможно ли повторно развернуть код на существующий адрес или его нужно развернуть как новый контракт?

Да, это возможно. Если смарт-контракт выполняет определенные инструкции (`set_code()`), его код может быть обновлен, а адрес останется прежним.

Если контракт изначально не может выполнить `set_code()` (через свой код или выполнение другого кода, поступающего извне), то его код не может быть изменен никогда. Никто не сможет повторно развернуть контракт с другим кодом по тому же адресу.

### Можно ли удалить смарт-контракт?

Да, либо в результате накопления платы за хранение (контракт должен достичь баланса -1 TON, чтобы быть удаленным), либо путем отправки сообщения с [режимом 160](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes).

### Чувствительны ли адреса смарт-контрактов к регистру?

Да, адреса смарт-контрактов чувствительны к регистру, поскольку они генерируются с использованием [алгоритма base64](https://en.wikipedia.org/wiki/Base64). Узнать больше об адресах смарт-контрактов можно [здесь](/v3/documentation/smart-contracts/addresses).

### Совместима ли Ton Virtual Machin (TVM) с EVM?

TVM несовместима с виртуальной машиной Ethereum (EVM), поскольку TON использует совершенно другую архитектуру (TON асинхронный, а Ethereum синхронный).

[Подробнее об асинхронных смарт-контрактах](https://telegra.ph/Its-time-to-try-something-new-Asynchronous-smart-contracts-03-25).

### Можно ли писать на Solidity для TON?

В связи с этим экосистема TON не поддерживает разработку на языке программирования Solidity от Ethereum.

Но если добавить асинхронные сообщения к синтаксису Solidity и возможность взаимодействия с данными на низком уровне, то получится FunC. FunC имеет синтаксис, который является общим для большинства современных языков программирования и разработан специально для разработки на TON.

## Удаленные вызовы процедур (RPC)

### Рекомендуемые поставщики узлов для извлечения данных включают:

Типы API:

- Подробнее о различных [типах API](/v3/guidelines/dapps/apis-sdks/api-types) (индексированные, HTTP и ADNL)

Партнеры-поставщики узлов:

- https://toncenter.com/api/v2/
- [getblock.io](https://getblock.io/)
- https://www.orbs.com/ton-access/
- [toncenter/ton-http-api](https://github.com/toncenter/ton-http-api)
- [nownodes.io](https://nownodes.io/nodes)
- https://dton.io/graphql

Каталог с проектами сообщества TON:

- [ton.app](https://ton.app/)

### Ниже приведены два основных ресурса, используемых для получения информации, связанной с конечными точками публичных узлов в блокчейне TON (как для TON Mainnet, так и для TON Testnet).

- [Конфигурации сети](/v3/documentation/network/configs/network-configs)
- [Примеры и руководства](/v3/guidelines/dapps/overview#tutorials-and-examples)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/infra/crosschain/bridge-addresses.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/infra/crosschain/bridge-addresses.md
================================================
# Адреса мостов

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::caution
Чтобы точно получить текущие адреса смарт-контрактов мостов, смотрите их непосредственно в [конфигурации блокчейна](/v3/documentation/infra/crosschain/overview#blockchain-configs). Это самый безопасный способ.
:::

## Основная сеть Toncoin

### Мост Toncoin основной сети TON-Ethereum

Адрес обернутого TONCOIN - [0x582d872a1b094fc48f5de31d3b73f2d9be47def1](https://etherscan.io/token/0x582d872a1b094fc48f5de31d3b73f2d9be47def1)

Адрес моста - [Ef_dJMSh8riPi3BTUTtcxsWjG8RLKnLctNjAM4rw8NN-xWdr](https://tonscan.org/address/Ef_dJMSh8riPi3BTUTtcxsWjG8RLKnLctNjAM4rw8NN-xWdr)

Адрес коллектора - [EQCuzvIOXLjH2tv35gY4tzhIvXCqZWDuK9kUhFGXKLImgxT5](https://tonscan.org/address/EQCuzvIOXLjH2tv35gY4tzhIvXCqZWDuK9kUhFGXKLImgxT5)

Адрес управления - [Ef87m7_QrVM4uXAPCDM4DuF9Rj5Rwa5nHubwiQG96JmyAjQY](https://tonscan.org/address/Ef87m7_QrVM4uXAPCDM4DuF9Rj5Rwa5nHubwiQG96JmyAjQY)

### Мост Toncoin основной сети TON-BSC

Адрес обернутого TONCOIN - [0x76A797A59Ba2C17726896976B7B3747BfD1d220f](https://bscscan.com/token/0x76A797A59Ba2C17726896976B7B3747BfD1d220f)

Адрес моста - [Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r](https://tonscan.org/address/Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r)

Адрес коллектора - [EQAHI1vGuw7d4WG-CtfDrWqEPNtmUuKjKFEFeJmZaqqfWTvW](https://tonscan.org/address/EQAHI1vGuw7d4WG-CtfDrWqEPNtmUuKjKFEFeJmZaqqfWTvW)

Адрес управления - [Ef8OvX_5ynDgbp4iqJIvWudSEanWo0qAlOjhWHtga9u2YjVp](https://tonscan.org/address/Ef8OvX_5ynDgbp4iqJIvWudSEanWo0qAlOjhWHtga9u2YjVp)

### Оракулы основной сети Toncoin

Оракул 0 - [Ef_P2CJw784O1qVd8Qbn8RCQc4EgxAs8Ra-M3bDhZn3OfzRb](https://tonscan.org/address/Ef_P2CJw784O1qVd8Qbn8RCQc4EgxAs8Ra-M3bDhZn3OfzRb)

Оракул 1 - [Ef8DfObDUrNqz66pr_7xMbUYckUFbIIvRh1FSNeVSLWrvo1M](https://tonscan.org/address/Ef8DfObDUrNqz66pr_7xMbUYckUFbIIvRh1FSNeVSLWrvo1M)

Оракул 2 - [Ef8JKqqx4I-XECLuVhTqeY1WMgbgTp8Ld3mzN-JUogBF4ZEW-](https://tonscan.org/address/Ef8JKqx4I-XECLuVhTqeY1WMgbgTp8Ld3mzN-JUogBF4ZEW-)

Оракул 3 - [Ef8voAFh-ByCeKD3SZhjMNzioqCmDOK6S6IaeefTwYmRhgsn](https://tonscan.org/address/Ef8voAFh-ByCeKD3SZhjMNzioqCmDOK6S6IaeefTwYmRhgsn)

Оракул 4 - [Ef_uJVTTToU8b3o7-Jr5pcUqenxWzDNYpyklvhl73KSIA17M](https://tonscan.org/address/Ef_uJVTTToU8b3o7-Jr5pcUqenxWzDNYpyklvhl73KSIA17M)

Оракул 5 - [Ef93olLLWqh1OuBSTOnJKWZ4NwxNq_ELK55_h_laNPVwxcEro](https://tonscan.org/address/Ef93olLWqh1OuBSTOnJKWZ4NwxNq_ELK55_h_laNPVwxcEro)

Оракул 6 - [Ef_iUPZdKLOCrqcNpDuFGNEmiuBwMB18TBXNjDimewpDExgn](https://tonscan.org/address/Ef_iUPZdKLOCrqcNpDuFGNEmiuBwMB18TBXNjDimewpDExgn)

Оракул 7 - [Ef_tTGGToGmONePskH_Y6ZG-QLV9Kcg5DIXeKwBvCX4YifKa](https://tonscan.org/address/Ef_tTGGToGmONePskH_Y6ZG-QLV9Kcg5DIXeKwBvCX4YifKa)

Оракул 8 - [Ef94L53akPw-4gOk2uQOenUyDYLOaif2g2uRoiu1nv0cWYMC](https://tonscan.org/address/Ef94L53akPw-4gOk2uQOenUyDYLOaif2g2uRoiu1nv0cWYMC)

Адреса EVM: 0xC4c9bd836ab8b446519736166919e3d62491E041,0xCF4A7c26186aA41390E246FA04115A0495085Ab9,0x17DcaB1B1481610F6C7a7A98cf0370dC0EC704a6,0x32162CAaEd276E77EF63194820586C942009a962,0x039f4e886432bd4f3cb5062f9861EFef3F6aDA28,0xFf441F9889Aa475d9D3b1C638C59B84c5179846D,0x0933738699dc733C46A0D4CBEbDA2f842e1Ac7d9,0x7F2bbaaC14F0f1834E6D0219F8855A5F619Fe2C4,0xfc5c6A2d01A984ba9eab7CF87A6D169aA9720c0C.

## Тестовая сеть Toncoin

### Мост Toncoin тестовой сети TON-Ethereum

Адрес обернутого TONCOIN - [0xDB15ffaf2c88F2d89Db9365a5160D5b8c9448Ea6](https://goerli.etherscan.io/token/0xDB15ffaf2c88F2d89Db9365a5160D5b8c9448Ea6)

Адрес моста - [Ef-56ZiqKUbtp_Ax2Qg4Vwh7yXXJCO8cNJAb229J6XXe4-aC](https://testnet.tonscan.org/address/Ef-56ZiqKUbtp_Ax2Qg4Vwh7yXXJCO8cNJAb229J6XXe4-aC)

Адрес коллектора - [EQCA1W_I267-luVo9CzV7iCcrA1OO5vVeXD0QHACvBn1jIVU](https://testnet.tonscan.org/address/EQCA1W_I267-luVo9CzV7iCcrA1OO5vVeXD0QHACvBn1jIVU)

Адрес управления - [kf-OV1dpgFVEzEmyvAETT8gnhqZ1IqHn8RzT6dmEmvnze-9n](https://testnet.tonscan.org/address/kf-OV1dpgFVEzEmyvAETT8gnhqZ1IqHn8RzT6dmEmvnze-9n)

### Мост Toncoin тестовой сети TON-BSC

Адрес обернутого TONCOIN - [0xdb15ffaf2c88f2d89db9365a5160d5b8c9448ea6](https://testnet.bscscan.com/token/0xdb15ffaf2c88f2d89db9365a5160d5b8c9448ea6)

Адрес моста - [Ef_GmJntTDokxfhLGF1jRvMGC8Jav2V5keoNj4El2jzhHsID](https://testnet.tonscan.org/address/Ef_GmJntTDokxfhLGF1jRvMGC8Jav2V5keoNj4El2jzhHsID)

Адрес коллектора - [EQDBNfV4DQzSyzNMw6BCTSZSoUi-CzWcYNsfhKxoDqfrwFtS](https://testnet.tonscan.org/address/EQDBNfV4DQzSyzNMw6BCTSZSoUi-CzWcYNsfhKxoDqfrwFtS)

Адрес управления - [kf83VnnXuaqQV1Ts2qvUr6agacM0ydOux5NNa1mcU-cEO693](https://testnet.tonscan.org/address/kf83VnnXuaqQV1Ts2qvUr6agacM0ydOux5NNa1mcU-cEO693)

### Оракулы тестовой сети Toncoin

- Оракул 0

  Адрес TON - [Ef9fwskZLEuGDfYTRAtvt9k-mEdkaIskkUOsEwPw1wzXk7zR](https://testnet.tonscan.org/address/Ef9fwskZLEuGDfYTRAtvt9k-mEdkaIskkUOsEwPw1wzXk7zR)

  Адрес EVM - 0xe54cd631c97be0767172ad16904688962d09d2fe

- Оракул 1

  Адрес TON - [Ef8jPzrhTYloKgTCsGgEFNx7OdH-sJ98etJnwrIVSsFxH9mu](https://testnet.tonscan.org/address/Ef8jPzrhTYloKgTCsGgEFNx7OdH-sJ98etJnwrIVSsFxH9mu)

  Адрес EVM - 0xeb05E1B6AC0d574eF2CF29FDf01cC0bA3D8F9Bf1

- Оракул 2

  Адрес TON - [Ef-fxGCPuPKNR6T4GcFxNQuLU5TykLKEAtkxWEfA1wBWy6JE](https://testnet.tonscan.org/address/Ef-fxGCPuPKNR6T4GcFxNQuLU5TykLKEAtkxWEfA1wBWy6JE)

  Адрес EVM - 0xF636f40Ebe17Fb2A1343e5EEee9D13AA90888b51

## Токен основной сети

### Мост для токенов основной сети TON-Ethereum

Адрес моста Ethereum - [0xb323692b6d4DB96af1f52E4499a2bd0Ded9af3C5](https://etherscan.io/address/0xb323692b6d4DB96af1f52E4499a2bd0Ded9af3C5)

Адрес моста - [Ef-1JetbPF9ubc1ga-57oHoOyDA1IShJt-BVlJnA9rrVTfrB](https://tonscan.org/address/Ef-1JetbPF9ubc1ga-57oHoOyDA1IShJt-BVlJnA9rrVTfrB)

Адрес коллектора - [EQDF6fj6ydJJX_ArwxINjP-0H8zx982W4XgbkKzGvceUWvXl](https://tonscan.org/address/EQDF6fj6ydJJX_ArwxINjP-0H8zx982W4XgbkKzGvceUWvXl)

Адрес управления - [Ef8hHxV0v2I9FHh3CMX91WXjKaJav6SQlemEQm8ZvPBJdLde](https://tonscan.org/address/Ef8hHxV0v2I9FHh3CMX91WXjKaJav6SQlemEQm8ZvPBJdLde)

### Оракулы токенов основной сети

- Оракул 0

  Открытый ключ TON = a0993546fbeb4e8c90eeab0baa627659aee01726809707008e38d5742ea38aef

  Адрес TON - [Ef8WxwYOyAk-H0YGBc70gZFJc6oqUvcHywU-yJNBfSNh-GW9](https://tonscan.org/address/Ef8WxwYOyAk-H0YGBc70gZFJc6oqUvcHywU-yJNBfSNh-GW9)

  Адрес ETH - 0x3154E640c56D023a98890426A24D1A772f5A38B2

- Оракул 1

  Открытый ключ TON = fe0a78726a82754b62517e4b7a492e1b1a8d4c9014955d2fa8f1345f1a3eafba

  Адрес TON = [Ef8CbgwhUMYn2yHU343dcezKkvme3cyFJB7SHVY3FXhU9jqj](https://tonscan.org/address/Ef8CbgwhUMYn2yHU343dcezKkvme3cyFJB7SHVY3FXhU9jqj)

  Адрес ETH = 0x8B06A5D37625F41eE9D9F543482b6562C657EA6F

- Оракул 2

  Открытый ключ TON = 00164233e111509b0486df85d2743defd6e2525820ee7d341c8ad92ee68d41a6

  Адрес TON = [Ef-n3Vdme6nSe4FBDb3inTRF9B6lh3BbIwGlk0dDpUO5oFmH](https://tonscan.org/address/Ef-n3Vdme6nSe4FBDb3inTRF9B6lh3BbIwGlk0dDpUO5oFmH)

  Адрес ETH = 0x6D5E361F7E15ebA73e41904F4fB2A7d2ca045162

- Оракул 3

  Открытый ключ TON = 9af68ce3c030e8d21aae582a155a6f5c41ad006f9f3e4aacbb0ce579982b9ebb

  Адрес TON = [Ef9D1-FOb82pREFPgW7AlzNlZ7f0XnvmGakW23wpWeILAum9](https://tonscan.org/address/Ef9D1-FOb82pREFPgW7AlzNlZ7f0XnvmGakW23wpWeILAum9)

  Адрес ETH = 0x43931B8c29e34a8C16695408CD56327F511Cf086

- Оракул 4

  Открытый ключ TON = a4fef528b1e841f5fce752feeac0971f7df909e37ffeb3fab71c5ce8deb9f7d4

  Адрес TON = [Ef8TBPHHIowG5pGgSVX8n4KmOaX-EEjvnOSBRlQvVsJWP_WJ](https://tonscan.org/address/Ef8TBPHHIowG5pGgSVX8n4KmOaX-EEjvnOSBRlQvVsJWP_WJ)

  Адрес ETH = 0x7a0d3C42f795BA2dB707D421Add31deda9F1fEc1

- Оракул 5

  Открытый ключ TON = 58a7ab3e3ff8281b668a86ad9fe8b72f2d14df5dcc711937915dacca1b94c07d

  Адрес TON = [Ef8ceN7cTemTe4ZV6AIbg5f8LsHZsYV1UaiGntvkME0KtP45](https://tonscan.org/address/Ef8ceN7cTemTe4ZV6AIbg5f8LsHZsYV1UaiGntvkME0KtP45)

  Адрес ETH = 0x88352632350690EF22F9a580e6B413c747c01FB2

- Оракул 6

  Открытый ключ TON = db60c3f50cb0302b516cd42833c7e8cad8097ad94306564b057b16ace486fb07

  Адрес TON = [Ef8uDTu2WCcJdtuKmkDmC1yRKVxZrTp83ke5PnMECOccg3w4](https://tonscan.org/address/Ef8uDTu2WCcJdtuKmkDmC1yRKVxZrTp83ke5PnMECOccg3w4)

  Адрес ETH = 0xeB8975966dAF0C86721C14b8Bb7DFb89FCBB99cA

- Оракул 7

  Открытый ключ TON = 98c037c6d3a92d9467dc62c0e3da9bb0ad08c6b3d1284d4a37c1c5c0c081c7df

  Адрес TON = [Ef905jDDX87nPDbTSMqFB9ILVGX1zWc66PPrNhkjHrWxAnZZ](https://tonscan.org/address/Ef905jDDX87nPDbTSMqFB9ILVGX1zWc66PPrNhkjHrWxAnZZ)

  Адрес ETH = 0x48Bf4a783ECFb7f9AACab68d28B06fDafF37ac43

- Оракул 8

  Открытый ключ TON = 5503c54a1b27525376e83d6fc326090c7d9d03079f400071b8bf05de5fbba48d

  Адрес TON = [Ef9Ubg96xQ8jVKbl7QQJ1k8pClQLmO1Ci68nuNfbLdm9uS-x](https://tonscan.org/address/Ef9Ubg96xQ8jVKbl7QQJ1k8pClQLmO1Ci68nuNfbLdm9uS-x)

  Адрес ETH = 0x954AE64BB0268b06ffEFbb6f454867a5F2CB3177

## Токен тестовой сети

### Мост токена тестовой сети TON-Ethereum

Адрес моста Ethereum - [0x4Efd8f04B6fb4CFAF0cfaAC11Fb489b97DBebB60](https://goerli.etherscan.io/address/0x4Efd8f04B6fb4CFAF0cfaAC11Fb489b97DBebB60)

Адрес моста - [Ef-lJBALjXSSwSKiedKzriSHixwQUxJ1BxTE05Ur5AXwZVjp](https://testnet.tonscan.org/address/Ef-lJBALjXSSwSKiedKzriSHixwQUxJ1BxTE05Ur5AXwZVjp)

Адрес коллектора - [EQC1ZeKX1LNrlQ4bwi3je3KVM1AoZ3rkeyHM5hv9pYzmIh4v](https://testnet.tonscan.org/address/EQC1ZeKX1LNrlQ4bwi3je3KVM1AoZ3rkeyHM5hv9pYzmIh4v)

Адрес управления - [kf9NLH8CsGUkEKGYzCxaLd9Th6T5YkO-MXsCEU9Rw1fiRhf9](https://testnet.tonscan.org/address/kf9NLH8CsGUkEKGYzCxaLd9Th6T5YkO-MXsCEU9Rw1fiRhf9)

### Оракул токена тестовой сети

> То же самое с мостом тестовой сети Toncoin

- Оракул 0

  Адрес TON - [Ef9fwskZLEuGDfYTRAtvt9k-mEdkaIskkUOsEwPw1wzXk7zR](https://testnet.tonscan.org/address/Ef9fwskZLEuGDfYTRAtvt9k-mEdkaIskkUOsEwPw1wzXk7zR)

  Адрес EVM - 0xe54cd631c97be0767172ad16904688962d09d2fe

- Оракул 1

  Адрес TON - [Ef8jPzrhTYloKgTCsGgEFNx7OdH-sJ98etJnwrIVSsFxH9mu](https://testnet.tonscan.org/address/Ef8jPzrhTYloKgTCsGgEFNx7OdH-sJ98etJnwrIVSsFxH9mu)

  Адрес EVM - 0xeb05E1B6AC0d574eF2CF29FDf01cC0bA3D8F9Bf1

- Оракул 2

  Адрес TON - [Ef-fxGCPuPKNR6T4GcFxNQuLU5TykLKEAtkxWEfA1wBWy6JE](https://testnet.tonscan.org/address/Ef-fxGCPuPKNR6T4GcFxNQuLU5TykLKEAtkxWEfA1wBWy6JE)

  Адрес EVM - 0xF636f40Ebe17Fb2A1343e5EEee9D13AA90888b51



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/infra/crosschain/overview.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/infra/crosschain/overview.md
================================================
# Кросс-чейн мосты

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Децентрализованные кросс-чейн мосты работают на блокчейне TON, позволяя вам переводить активы из TON в другие блокчейны и наоборот.

## Мост Toncoin

Мост Toncoin позволяет вам переводить Toncoin между блокчейном TON и блокчейном Ethereum, а также между блокчейном TON и смарт-чейном BNB.

Мост управляется [децентрализованными оракулами](/v3/documentation/infra/crosschain/bridge-addresses).

### Как его использовать:

Фронтенд моста размещен на https://ton.org/bridge.

:::info
[Исходный код фронтенда Bridge](https://github.com/ton-blockchain/bridge)
:::

### Исходные коды смарт-контрактов TON-Ethereum

- [FunC (сторона TON)](https://github.com/ton-blockchain/bridge-func)
- [Solidity (сторона Ethereum)](https://github.com/ton-blockchain/bridge-solidity/tree/eth_mainnet)

### Исходные коды смарт-контрактов TON-BNB Smart Chain

- [FunC (сторона TON)](https://github.com/ton-blockchain/bridge-func/tree/bsc)
- [Solidity (сторона BSC)](https://github.com/ton-blockchain/bridge-solidity/tree/bsc_mainnet)

### Конфигурации блокчейна

Вы можно получить фактические адреса смарт-контрактов моста и адреса оракула, проверив соответствующую конфигурацию:

TON-Ethereum: [#71](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L738).

TON-BSC: [#72](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L739).

TON-Polygon: [#73](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L740).

### Документация

- [Как работает мост](https://github.com/ton-blockchain/TIPs/issues/24)

### Дорожная карта кросс-чейна

- https://t.me/tonblockchain/146



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/infra/minter-flow.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/infra/minter-flow.md
================================================
# Выпуск дополнительных валют

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Дополнительные валюты

Согласно [Whitepaper блокчейна TON 3.1.6](https://ton-blockchain.github.io/docs/tblkch.pdf#page=55), блокчейн TON позволяет своим пользователям определять произвольные криптовалюты или токены, помимо Toncoin, при соблюдении некоторых условий. Такие дополнительные криптовалюты идентифицируются 32-битными _currency\*ids\*. Список определенных дополнительных криптовалют является частью конфигурации блокчейна,
хранящейся в мастерчейне. Каждое внутреннее сообщение, а также баланс аккаунта содержит специальное поле для `ExtraCurrencyCollection` (набор дополнительных валют, прикрепленных к сообщению или хранящихся на балансе):

```tlb
extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32)) = ExtraCurrencyCollection;
currencies$_ grams:Grams other:ExtraCurrencyCollection = CurrencyCollection;
```

## Конфигурация дополнительной валюты

Словарь, или, точнее, `ExtraCurrencyCollection` всех валют, которые должны быть выпущены, хранится в `ConfigParam7`:

```tlb
_ to_mint:ExtraCurrencyCollection = ConfigParam 7;
```

`ConfigParam 6` содержит данные, связанные с выпуском:

```tlb
_ mint_new_price:Grams mint_add_price:Grams = ConfigParam 6;
```

`ConfigParam2` содержит адрес *Минтера*.

## Низкоуровневый процесс выпуска

В каждом блоке коллатор сравнивает старый глобальный баланс (глобальный баланс всех валют в конце предыдущего блока) с `ConfigParam7`. Если какая-либо сумма для любой валюты в `ConfigParam7` меньше, чем она есть в глобальном балансе - конфигурация недействительна. Если какая-либо сумма для любой валюты в `ConfigParam7` больше, чем она есть в глобальном балансе, будет создано сообщение о выпуске.

Это сообщение о выпуске имеет источник `-1:00000000000000000000000000000000000000000000000000000000000000000000000` и ​​_Минтер_ из `ConfigParam2` в качестве назначения и содержит излишки дополнительных валют в `ConfigParam7` по сравнению со старым глобальным балансом.

Проблема здесь в том, что сообщение о выпуске содержит только дополнительные валюты и не содержит монет TON. Это означает, что даже если *Минтер* установлен как фундаментальный смарт-контракт (представленный в `ConfigParam31`), сообщение о чеканке вызовет прерванную транзакцию: `compute_ph:(tr_phase_compute_skipped reason:cskip_no_gas)`.

## Высокоуровневый процесс выпуска

Один из возможных высокоуровневых процессов выпуска, реализованный [здесь](https://github.com/ton-blockchain/governance-contract/tree/50ed2ecacc9e3cff4c77cbcc69aa07b39f5c46a2) (проверьте файлы `*.tolk`), выглядит следующим образом:

1. Существует `ExtraCurrencyAuthorizationConfig`: это конфигурация, которая содержит информацию о том, какие контракты (адреса) имеют право запрашивать у минтера выпуск новых дополнительных валют. Эта конфигурация имеет следующую схему:

```tlb
_ (Hashmap 32 std_addr) = ExtraCurrencyAuthorizationConfig;
```

где key - `currency_id`, а `std_addr` - *админгистратор* этой валюты (может быть в любом воркчейне).
2. Минтер принимает запросы на выпуск от *администратора*, пересылает запрос на выпуск в Config, Config обновляет `ConfigParam 7` и отвечает в Минтер. Поскольку дополнительные валюты будут выпускаться в Минтере только на следующем блоке мастерчейна, вывод дополнительных валют в *администраторе* должен быть отложен. Это делается через смарт-контракт *Эхо*, а не в мастерчейне. Когда ответ от *Эхо* приходит в Минтер, он отправляет дополнительные валюты *администратору*. Итак, схема выглядит следующим образом: `Администратор -> Минтер -> Конфигурация -> Минтер -> Эхо (в другом воркчейне ждать следующего блока мастерчейна) -> Минтер -> Администратор`.

Пример такого процесса: [выпуск 200 000 000 единиц `currency_id=100`](https://testnet.tonviewer.com/transaction/20fe328c04b4896acecb6e96aaebfe6fef90dcc1441e27049302f29770904ef0)

:::danger
Каждый выпуск новой дополнительной валюты или увеличение предложения существующей требует изменения ConfigParam 7, тем самым изменяя конфигурацию и создавая новый ключевой блок. Слишком частое создание ключевого блока замедляет шарды (каждый ключевой блок приводит к ротации групп валидаторов) и синхронизации лайтклиента. Таким образом, контракты типа swap.tolk не должны использоваться в производстве. Вместо этого необходимо использовать схемы с резервами, которые минимизируют события выпуска.
:::

:::Info
Отправка дополнительной валюты в blackhole приводит к следующему результату: сумма дополнительной валюты расходуется, но, поскольку ConfigParam 7 не изменен, в следующем блоке минтер получит сожженную сумму на свой баланс.
:::

## Обзор процесса выпуска

Как выпустить свою собственную дополнительную валюту:

1. Убедитесь, что в вашей сети есть контракт Minter и установлены ConfigParam 2, ConfigParam 6.
2. Создайте контракт Currency Admin, который контролирует, как выпускается дополнительная валюта.
3. Создайте предложение валидаторам добавить адрес вашего контракта Currency Admin в ExtraCurrencyAuthorizationConfig для некоторого `currency_id` и получите его принятие.
4. Отправьте запрос `mint` из контракта Currency Admin в Minter. Подождите, пока Minter отправит обратно дополнительную валюту.







================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/mytonctrl/mytonctrl-alerting.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/mytonctrl/mytonctrl-alerting.md
================================================
# Бот оповещений MyTonCtrl

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Общие сведения

Бот оповещений MyTonCtrl — это инструмент, позволяющий получать уведомления о состоянии вашего узла через Telegram бота.
Он является частью набора инструментов MyTonCtrl и доступен как для валидаторов, так и для liteserver.

## Настройка

Чтобы настроить бота оповещений MyTonCtrl, выполните следующие действия:

### Подготовка бота

1. Перейдите на https://t.me/BotFather и создайте бота с помощью команды `/newbot`. После этого вы получите `BotToken`.
2. Перейдите к своему боту и нажмите кнопку `Start`. Это позволит вам получать сообщения от бота.
3. Если вы хотите получать сообщения от бота в группе (чате), добавьте бота в группу и дайте ему необходимые права (сделайте администратором группы).
4. Перейдите по адресу https://t.me/getmyid_bot и нажмите кнопку `Start`. Он ответит вам с вашим `ChatId`, используйте его, если хотите получать сообщения напрямую на свой аккаунт Telegram.
   Если вы хотите получать сообщения в группе, добавьте бота в группу, и он ответит с `ChatId` группы.

### Включить бота оповещений

1. Включите `alert-bot` с помощью команды

   ```bash
   MyTonCtrl> enable_mode alert-bot
   ```

2. Включите команду

   ```bash
   MyTonCtrl> set BotToken <BotToken>
   ```

3. Включите команду

   ```bash
   MyTonCtrl> set ChatId <ChatId>
   ```

4. Проверьте, может ли бот отправлять сообщения, выполнив команду

   ```bash
   MyTonCtrl> test_alert
   ```

   Вы должны получить сообщение от бота в своем аккаунте Telegram или чате.

## Поддерживаемые оповещения

Бот оповещений MyTonCtrl поддерживает следующие оповещения:

- Баланс кошелька валидатора низкий
- Использование базы данных узла превышает 80%
- Использование базы данных узла превышает 95%
- Валидатор показал низкую эффективность в раунде
- Узел не синхронизирован
- Узел не запущен (служба не работает)
- Узел не отвечает на ADNL-соединение
- За последние 6 часов валидатор не создал ни одного блока
- Во время предыдущего раунда проверки валидатор был заблокирован

## Включение(отключение) оповещений

Чтобы включить или отключить оповещения, используйте следующие команды:

- Чтобы включить оповещение, используйте команду `enable_alert <alert-name>`.
- Чтобы отключить оповещение, используйте команду `disable_alert <alert-name>`.
- Чтобы проверить статус оповещений, используйте команду `list_alerts`.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/mytonctrl/mytonctrl-errors.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/mytonctrl/mytonctrl-errors.md
================================================
# Ошибки MyTonCtrl

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Обзор

В этой статье описываются ошибки MyTonCtrl, с которыми может столкнуться пользователь.

## Распространенные ошибки

| Ошибка                                                                                                | Возможное решение                                                                                                                            |
| :---------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| Unknown module name: `name`. Available modes: `modes` | Проверьте список доступных режимов                                                                                                           |
| No mode named `name` found in current modes: `current_modes`                          | Проверьте список текущих режимов                                                                                                             |
| GetWalletFromFile error: Private key not found                                        | Проверьте путь к файлу кошелька                                                                                                              |
| Cannot get own IP address                                                                             | Проверьте доступность ресурсов https://ifconfig.me/ip и https://ipinfo.io/ip |

## Ошибки Liteserver

| Ошибка                                                        | Возможное решение                                     |
| :------------------------------------------------------------ | :---------------------------------------------------- |
| Cannot enable liteserver mode while validator mode is enabled | Используйте `disable_mode validator`. |
| LiteClient error: `error_msg`                 | Проверьте параметры MyTonCtrl для запуска Liteserver  |

## Ошибки Validator

| Ошибка                                                                                                              | Возможное решение                                                                                                                                                                                               |
| :------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ValidatorConsole error: Validator console is not settings                                           | Проверьте [статью о валидаторе](/v3/guidelines/nodes/nodes-troubleshooting#validator-console-is-not-settings)                                                                                                   |
| Cannot enable validator mode while liteserver mode is enabled                                                       | Используйте `disable_mode liteserver`                                                                                                                                                                           |
| Validator wallet not found                                                                                          | Проверьте [статью о валидаторе](/v3/guidelines/nodes/running-nodes/validator-node#view-the-list-of-wallets)                                                                                                     |
| Validator is not synchronized                                                                                       | Подождите еще или проверьте статью [ошибки синхронизации](/v3/guidelines/nodes/nodes-troubleshooting#about-no-progress-in-node-synchronization-within-3-hours)                                                  |
| Stake less than the minimum stake. Minimum stake: `minStake`                        | Используйте [`set stake {amount}`](/v3/guidelines/nodes/running-nodes/validator-node#your-validator-is-now-ready) и [проверьте параметры стейка](/v3/documentation/network/configs/blockchain-configs#param-17) |
| Don't have enough coins. stake: `stake`, account balance: `balance` | Пополните свой `balance` до `stake`                                                                                                                                                                             |

## Ошибки Nominator Pool

| Ошибка                                                                                                                           | Возможное решение                                    |
| :------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------- |
| CreatePool error: Pool with the same parameters already exists                                                   | Проверьте `pools_list` на наличие существующих пулов |
| create_single_pool error: Pool with the same parameters already exists | Проверьте `pools_list` на наличие существующих пулов |

## См. также

- [Устранение неполадок узлов](/v3/guidelines/nodes/nodes-troubleshooting)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview.mdx
================================================
# MyTonCtrl

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Общие сведения

Чтобы установить свой собственный узел и управлять им, используйте инструмент с открытым исходным кодом **MyTonCtrl**, разработанный TON Foundation. Большинство узлов TON надежны и протестированы в **MyTonCtrl**.

[MyTonCtrl](https://github.com/ton-blockchain/mytonctrl) — это консольное приложение, которое является удобной оболочкой для fift, lite-client и validator-engine-console. Оно было специально разработано для оптимизации задач управления кошельком, доменом и валидатором в операционной системе Linux.

Мы активно собираем отзывы о процессе установки. Если у вас есть какие-либо вопросы или предложения, пожалуйста, [свяжитесь с нами](https://t.me/Alexgton).

## Основные команды

### help

Без аргументов, выводит текст справки

### exit

Без аргументов, выйти из консоли.

### update

Обновление mytonctrl. Комбинации параметров:

| Формат имени                 | Формат                                                                     | Пример                                                                | Описание                                                                    |
| :--------------------------- | :------------------------------------------------------------------------- | :-------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Без аргументов               | `update`                                                                   | `update`                                                              | Обновление из текущего репозитория                                          |
| Формат URL                   | `update [https://github.com/author/repo/tree/branch]`                      | `update https://github.com/ton-blockchain/mytonctrl/tree/test`        | Обновление с указанного URL                                                 |
| Только формат ветви          | `update [BRANCH]`                                                          | `update test`                                                         | Обновление из указанной ветви текущего репозитория                          |
| Формат переопределения ветви | `update [https://github.com/authorName/repoName/tree/branchName] [BRANCH]` | `update https://github.com/ton-blockchain/mytonctrl/tree/master test` | Обновление из ветки, указанной вторым аргументом после названия репозитория |

### upgrade

Обновление узла. Комбинации параметров:

| Формат имени                 | Формат                                                                      | Пример                                                              | Описание                                                                    |
| :--------------------------- | :-------------------------------------------------------------------------- | :------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Без аргументов               | `upgrade`                                                                   | `upgrade`                                                           | Обновление из текущего репозитория                                          |
| Формат URL                   | `upgrade [https://github.com/author/repo/tree/branch]`                      | `upgrade https://github.com/ton-blockchain/ton/tree/master`         | Обновление с указанного URL                                                 |
| Только формат ветви          | `upgrade [BRANCH]`                                                          | `upgrade master`                                                    | Обновление из указанной ветки текущего репозитория                          |
| Формат переопределения ветви | `upgrade [https://github.com/authorName/repoName/tree/branchName] [BRANCH]` | `upgrade https://github.com/ton-blockchain/ton/tree/master testnet` | Обновление из ветки, указанной вторым аргументом после названия репозитория |

### status

Получаем текущего состояния mytonctrl и узла. Комбинации параметров:

| Формат имени   | Формат        | Пример        | Описание                                                                                                           |
| -------------- | ------------- | ------------- | ------------------------------------------------------------------------------------------------------------------ |
| Без аргументов | `status`      | `status`      | Полный отчет о состоянии, включая эффективность валидатора и онлайн-валидаторы                                     |
| Быстрота       | `status fast` | `status fast` | Необходимо использовать в TestNet. Отчет о состоянии без эффективности валидатора и количества онлайн-валидаторов. |

[Подробнее о выводе состояния](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-status)

### installer

Без аргументов, запускает установщик модулей TON (скрипт /usr/src/mytonctrl/mytoninstaller.py)

### status_modes

Нет аргументов, показать режимы MTC.

### status_settings

Без аргументов, показать все доступные настройки с их описанием и значениями.

### enable_mode

Включить определенный режим.

```bash
MyTonCtrl> enable_mode <mode_name>
```

Пример:

```bash
MyTonCtrl> enable_mode validator
```

### disable_mode

Отключить определенный режим.

```bash
MyTonCtrl> disable_mode <mode_name>
```

Пример:

```bash
MyTonCtrl> disable_mode validator
```

### about

Получить описание указанного режима

```bash
MyTonCtrl> about <mode_name>
```

Пример:

```bash
MyTonCtrl> about validator
```

### get

Получить значение определенного параметра в формате JSON

```bash
MyTonCtrl> get <setting_name>
```

Пример:

```bash
MyTonCtrl> get stake
```

### set

Устанавливает указанное значение заданного параметра. Пропустить проверку существующего параметра, если включен параметр `--force`

```bash
MyTonCtrl> set <setting> <value> [--force]
```

Пример:

```bash
MyTonCtrl> set stake 9000
```

### rollback

Без аргументов, откат к mytonctrl 1.0. Не следует использовать в mytonctrl 1.0.

### getconfig

Извлекает и выводит JSON-представление конфигурации, указанной с помощью `<config-id>`

```bash
MyTonCtrl> getconfig <config_id> # config id can be omitted
```

Пример:

```bash
MyTonCtrl> getconfig 0
```

### get_pool_data

Извлекает и выводит JSON-представление данных пула, указанных с помощью `<pool-name>` или `<pool-addr>`.

```bash
MyTonCtrl> get_pool_data <<pool-name> | <pool-addr>>
```

Пример:

```bash
get_pool_data pool_name # you can check possible pool names using ls /home/install_mytonctrl/.local/share/mytoncore/pools
```

## Оверлеи

Подробнее о [оверлеях читайте здесь](/v3/guidelines/nodes/custom-overlays).

### add_custom_overlay

Добавляет пользовательский оверлей с указанным `<name>`, используя конфигурацию, указанную в `<path_to_config>`

```bash
MyTonCtrl> add_custom_overlay <name> <path_to_config>
```

Пример:

```bash
add_custom_overlay custom /config.json # check link from above to know what config this command requires (/v3/guidelines/nodes/custom-overlays)
```

### list_custom_overlays

Без аргументов, выводит пользовательские оверлеи

### delete_custom_overlay

Удаляет пользовательский оверлей с указанным `<name>`

```bash
MyTonCtrl> delete_custom_overlay <name>
```

## Валидатор

### vo

Голосует за предложение, указанное в `<offer-hash>`

```bash
MyTonCtrl> vo <offer-hash> # use `ol` to get offers
```

### ve

Без аргументов, голосует за выборы

### vc

Голосует за жалобу, указанную в `<complaint-hash>`, на выборах, указанных в `<election-id>`

```bash
MyTonCtrl> vc <election-id> <complaint-hash>
```

На самом деле, даже если это сработает, вам следует использовать данные из вашего текущего состояния mytonctrl:

```bash
MyTonCtrl> vc 0 0
```

### check_ef

Выводит данные об эффективности валидатора для текущего и предыдущих раундов.

**Примечание**: данные об эффективности текущего раунда становятся более точными по мере его развития.

На основе `validator index` (можно получить с помощью команды `status`) возможны три сценария:

- **Validator index is in the range [0, `max_main_validators`)**:
  `validator efficiency` должен быть выше 90% (число может быть изменено в будущем на основе статистики) для всего раунда; в противном случае может быть наложен штраф.

- **Validator index is in the range [`max_main_validators`, `max_validators`)**:
  `validator efficiency` должен быть выше 90% (число может быть изменено в будущем на основе статистики) для всего раунда. В настоящее время штраф не применяется, но это может измениться в будущих обновлениях.

- **The user is not a validator**:
  Штрафы не применяются, но пользователь также не имеет права на вознаграждение. Нет `validator efficiency` для проверки. Это может быть вызвано низким стейком или неправильной конфигурацией узла. Кроме того, убедитесь, что `mytonctrl` работает без перебоев.

Узнайте больше о `max_validators` и `max_main_validators` [на странице параметров конфигурации](/v3/documentation/network/configs/blockchain-configs#configuration-parameters-for-the-number-of-validators-for-elections). Получите фактические значения [для mainnet](https://tonviewer.com/config#16) и [для testnet](https://testnet.tonviewer.com/config#16).

## Команды пула

Получите больше информации [на странице пула номинаторов](/v3/documentation/smart-contracts/contracts-specs/nominator-pool).

### deposit_to_pool

Вносит указанное количество `<amount>` в пул, указанный `<pool-addr>`

```bash
MyTonCtrl> deposit_to_pool <pool-addr> <amount>
```

Пример:

```bash
MyTonCtrl> deposit_to_pool kf_JcC5pn3etTAdwOnc16_tyMmKE8-ftNUnf0OnUjAIdDJpX 1
```

### withdraw_from_pool

Выводит указанное количество `<amount>` из пула, указанного `<pool-addr>`

```bash
MyTonCtrl> withdraw_from_pool <pool-addr> <amount>
```

Пример:

```bash
MyTonCtrl> withdraw_from_pool kf_JcC5pn3etTAdwOnc16_tyMmKE8-ftNUnf0OnUjAIdDJpX 1
```

### cleanup

Без аргументов, очистка базы данных валидатора

### benchmark

Без аргументов, выводит таблицу с несколькими тестами

## Единый пул

Получите дополнительную информацию [на странице единого пула номинаторов](https://docs.ton.org/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool).

### new_single_pool

Создает новый единый пул с указанными `<pool-name>` и `<owner-address>`

```bash
MyTonCtrl> new_single_pool <pool-name> <owner-address>
```

Пример:

```bash
MyTonCtrl> new_single_pool name kf9tZrL46Xjux3ZqvQFSgQkOIlteJK52slSYWbasqtOjrKUT
```

### activate_single_pool

Активирует единый пул, указанный `<pool-name>`

```bash
MyTonCtrl> activate_single_pool <pool-name> # pool name from above
```

## Управление кошельком

### Импорт кошелька

MyTonCtrl поддерживает различные типы контрактов, подобных кошельку, включая wallet-v1, wallet-v3, [lockup-wallet](https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/universal) и другие. Он предоставляет простой способ взаимодействия с этими контрактами.

#### Импорт с использованием закрытого ключа

Если у вас есть доступ к закрытому ключу, вы можете легко импортировать кошелек:

```bash
MyTonCtrl> iw <wallet-addr> <wallet-secret-key>
```

Здесь `<wallet-secret-key>` — ваш закрытый ключ в формате base64.

Пример:

```bash
MyTonCtrl> iw kf9tZrL46Xjux3ZqvQFSgQkOIlteJK52slSYWbasqtOjrKUT AAAH++/ve+/vXrvv73vv73vv73vv71DWu+/vWcpA1E777+92Ijvv73vv70iV++/ve+/vUTvv70d77+9UFjvv71277+9bO+/ve+/vXgzdzzvv71i77+977+9CjLvv73vv73vv71i77+9Bu+/vV0oJe+/ve+/vUPvv73vv73vv70=
```

#### Импорт с использованием мнемонической фразы

Если у вас есть мнемоническая фраза (последовательность из 24 слов, например `tattoo during ...`), выполните следующие действия:

1. Установите Node.js.
2. Клонируйте и установите [mnemonic2key](https://github.com/ton-blockchain/mnemonic2key):
   ```
   git clone https://github.com/ton-blockchain/mnemonic2key.git
   cd mnemonic2key
   npm install
   ```
3. Выполните следующую команду, заменив `word1`, `word2`... на вашу мнемоническую фразу, а `address` на адрес вашего контракта кошелька:
   ```
   node index.js word1 word2 ... word24 [address]
   ```
4. Скрипт сгенерирует `wallet.pk` и `wallet.addr`. Переименуйте их в `imported_wallet.pk` и `imported_wallet.addr`.
5. Скопируйте оба файла в каталог `~/.local/share/mytoncore/wallets/`.
6. Откройте консоль mytonctrl и выведите список кошельков с помощью команды `wl`.
7. Убедитесь, что кошелек был импортирован и отображает правильный баланс.
8. Теперь вы можете отправлять средства с помощью команды `mg`. Введите `mg`, чтобы просмотреть справочную документацию.
   Не забудьте заменить заполнители (слова внутри `< >`) на ваши фактические значения при запуске команд.

### Показать список кошельков

```bash
MyTonCtrl> wl
```

![](/img/docs/mytonctrl/wl.png)

### Создать новый локальный кошелек

Также вы можете создать новый пустой кошелек:

```bash
MyTonCtrl> nw <workchain-id> <wallet-name> [<version> <subwallet>]
```

Пример:

```bash
MyTonCtrl> nw 0 name v3 # by default subwallet is 0x29A9A317 + workchain
```

### Активировать локальный кошелек

Если вы хотите использовать кошелек, его необходимо активировать:

```bash
MyTonCtrl> aw <wallet-name>
```

Но перед активацией отправьте 1 Toncoin на кошелек:

```bash
MyTonCtrl> wl
Name                  Status  Balance           Ver  Wch  Address
validator_wallet_001  active  994.776032511     v1   -1   kf_dctjwS4tqWdeG4GcCLJ53rkgxZOGGrdDzHJ_mxPkm_Xct
wallet_004            uninit  0.0               v1   0    0QBxnZJq4oHVFs4ban3kJ5qllM1IQo57lIx8QP69Ue9A6Kbs

MyTonCtrl> mg validator_wallet_001 0QBxnZJq4oHVFs4ban3kJ5qllM1IQo57lIx8QP69Ue9A6Kbs 1
```

Затем активируйте его:

```bash
MyTonCtrl> aw wallet_004
ActivateWallet - OK

MyTonCtrl> wl
Name                  Status  Balance           Ver  Wch  Address
validator_wallet_001  active  994.776032511     v1   -1   kf_dctjwS4tqWdeG4GcCLJ53rkgxZOGGrdDzHJ_mxPkm_Xct
wallet_004            active  0.998256399       v1   0    kQBxnZJq4oHVFs4ban3kJ5qllM1IQo57lIx8QP69Ue9A6Psp
```

### Получить порядковый номер кошелька

```bash
MyTonCtrl> seqno <wallet-name>
```

![](/img/docs/mytonctrl/nw.png)

### Установить версию кошелька

Эта команда необходима, когда используется модифицированный кошелек с методами взаимодействия, похожими на обычный.

```bash
MyTonCtrl> swv <wallet-addr> <wallet-version>
```

Пример:

```bash
MyTonCtrl> swv kf9tZrL46Xjux3ZqvQFSgQkOIlteJK52slSYWbasqtOjrKUT v3
```

### Экспорт кошелька

Можно получить определенный адрес кошелька и секретный ключ.

```bash
MyTonCtrl> ew <wallet-name>
```

![](/img/docs/mytonctrl/ew.png)

### Удалить локальный кошелек

```bash
MyTonCtrl> dw <wallet-name>
```

![](/img/docs/mytonctrl/dw.png)

## Команды для акааунта и транзакций

### Состояние аккаунта

Чтобы проверить состояние аккаунта и историю его транзакций, используйте следующую команду:

```bash
MyTonCtrl> vas <account-addr> # for example you can get address of validator wallet by wl command and use vas to get more information
```

![](/img/docs/mytonctrl/vas.png)

### История аккаунта

Чтобы проверить историю транзакций аккаунта, используйте следующую команду, указав объем списка операций в качестве `limit`:

```bash
MyTonCtrl> vah <account-addr> <limit> # limit is just unsigned integer number
```

![](/img/docs/mytonctrl/vah.png)

### Перевод монет

Перевод монет из локального кошелька на аккаунт:

```bash
MyTonCtrl> mg <wallet-name> <account-addr | bookmark-name> <amount>
```

Пример:

```bash
MyTonCtrl> mg wallet_004 kQBxnZJq4oHVFs4ban3kJ5qllM1IQo57lIx8QP69Ue9A6Psp 1
```

:::caution
Версия кошелька 'v4' не поддерживается для передачи
:::

### Перевод монет через прокси

Перевод монет из локального кошелька на аккаунт через прокси:

```bash
MyTonCtrl> mgtp <wallet-name> <account-addr | bookmark-name> <amount>
```

Пример:

```bash
MyTonCtrl> mgtp wallet_004 kQBxnZJq4oHVFs4ban3kJ5qllM1IQo57lIx8QP69Ue9A6Psp 1
```

## Основные команды для пулов

В **MyTonCtrl** есть два типа пулов:

1. [Пул номинатора](/v3/documentation/smart-contracts/contracts-specs/nominator-pool)
2. [Единый пул номинатора](/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool)

Все они управляются следующим набором команд:

### Список пулов

```bash
MyTonCtrl> pools_list
```

![](/img/docs/mytonctrl/test-pools-list.png)

### Удалить пул

```bash
MyTonCtrl> delete_pool <pool-name>
```

### Импорт пула

Вы можете добавить уже созданный пул в список локальных пулов:

```bash
MyTonCtrl> import_pool <pool-name> <pool-addr>
```

Пример:

```bash
MyTonCtrl> import_pool name kf_JcC5pn3etTAdwOnc16_tyMmKE8-ftNUnf0OnUjAIdDJpX
```

## Закладки

Вы можете создать закладку (bookmark) для адреса аккаунта, чтобы упростить его использование.

### Создать новую закладку

```bash
MyTonCtrl> nb <bookmark-name> <account-addr | domain-name>
```

![](/img/docs/mytonctrl/nb.png)

### Показать список закладок

```bash
MyTonCtrl> bl
```

![](/img/docs/mytonctrl/bl.png)

### Удалить закладку

```bash
MyTonCtrl> db <bookmark-name> <bookmark-type>
```

![](/img/docs/mytonctrl/db.png)

## Другие команды mytonctrl

### ol

Показать список предложений

| Формат имени        | Формат           | Описание                                                                              |
| ------------------- | ---------------- | ------------------------------------------------------------------------------------- |
| Без аргументов      | `ol`             | Выводит таблицу с сокращенными хэшами.                                                |
| Вывод JSON          | `ol --json`      | Выводит JSON-представление `data`.                                                    |
| Полный вывод хэша   | `ol hash`        | Выводит таблицу с полными хэшами.                                                     |
| JSON с полным хэшем | `ol --json hash` | Выводит JSON-представление `data`. Аргумент `"hash"` в этом случае не имеет значения. |

### od

Извлекает разницу предложений

```bash
MyTonCtrl> od [offer-hash]
```

### el

Показать список записей выборов

| Формат имени                          | Формат                              | Описание                                                                   |
| ------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------- |
| Без аргументов                        | `el`                                | Выводит таблицу с сокращенными ADNL, Pubkey и Wallet.                      |
| Любая комбинация следующих аргументов | `el --json adnl pubkey wallet past` | Полные записи ADNL, Pubkey, Wallet и прошлых выборов в JSON представлении. |

Описания для каждого аргумента:

- \--json: Выводит JSON-представление данных.
- past: Включает записи прошлых выборов.
- adnl: Выводит полный ADNL.
- pubkey: Выводит полный Pubkey.
- wallet: выводит полный кошелек.

### vl

Показать активных валидаторов

| Формат имени                           | Формат                                 | Описание                                                                       |
| -------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------ |
| Без аргументов                         | `vl`                                   | Выводит таблицу с сокращенными ADNL, Pubkey и Wallet.                          |
| Любая комбинация следующих аргументов  | `vl --json adnl pubkey wallet past`    | Полные записи ADNL, Pubkey, Wallet и прошлых валидаторов в JSON представлении. |

Описания для каждого аргумента:

- \--json: выводит JSON-представление данных.
- past: включает прошлые записи валидаторов.
- adnl: выводит полный ADNL.
- pubkey: выводит полный Pubkey.
- wallet: выводит полный Wallet.
- offline: исключает онлайн-валидаторы.

### cl

Показать список жалоб

| Формат имени                          | Формат                | Описание                                              |
| ------------------------------------- | --------------------- | ----------------------------------------------------- |
| Без аргументов                        | `cl`                  | Выводит таблицу с сокращенным ADNL.                   |
| Любая комбинация следующих аргументов | `cl --json adnl past` | Полный ADNL с прошлыми жалобами в JSON представлении. |

Описания для каждого параметра:

- \--json: Выводит представление данных в формате JSON.
- past: Включает прошлые жалобы.
- adnl: Выводит полный ADNL.

## Установщик

В этом разделе описывается подконсоль `installer`, которую можно открыть командой

```bash
MyTonCtrl> installer
```

Пример:

![img.png](/img/docs/mytonctrl/installer.png)

Все команды можно вызывать напрямую из консоли MyTonCtrl

```bash
MyTonCtrl> installer [command] [args]
```

### help

выводит все доступные команды

### clear

очистка терминала

### exit

Выход из терминала mytoninstaller

### status

выводит состояние служб (полного узла, Mytoncore, V.console, Liteserver) и аргументы узла

### set_node_argument

| Формат имени                   | Формат                                      | Описание                                                                                                         |
| ------------------------------ | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Добавить или заменить аргумент | `set_node_argument [-ARG_NAME] [ARG_VALUE]` | Добавить аргумент или заменить его значение, если оно существует. `-ARG_NAME` должен иметь `-` или `--` в начале |
| Удалить аргумент               | `set_node_argument [-ARG_NAME] -d`          | Удалить аргумент из списка.                                                                                      |

Возможные аргументы:

| Имя аргумента узла | Описание                                                                                                        | Значение по умолчанию                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `threads`          | количество потоков                                                                                              | `cpus count - 1`                                                                        |
| `daemonize`        |                                                                                                                 | Нет значения                                                                            |
| `global-config`    | путь к глобальной конфигурации                                                                                  | `/usr/bin/ton/global.config.json`                                                       |
| `db`               | путь к базе данных                                                                                              | `/var/ton-work/db/`                                                                     |
| `logname`          | путь к журналам                                                                                                 | `/var/ton-work/log`                                                                     |
| `state-ttl`        | ttl состояний блокчейна, которые хранит узел                                                                    | 3600                                                                                    |
| `archive-ttl`      | ttl блоков, которые хранит узел. _Чтобы заставить узел не хранить архивные блоки, используйте значение `86400`_ | 2592000, если режим liteserver был включен во время установки, в противном случае 86400 |

Пример:

```bash
MyTonInstaller> set_node_argument --state-ttl 3601
```

Пример:

```bash
MyTonInstaller> set_node_argument --state-ttl 3601
```

### enable

Включить один из режимов, для `ton-http-api` создает конфигурацию

```bash
MyTonInstaller> enable <MODE_NAME>
```

Режимы могут иметь следующие названия:

- FN - Full Node
- VC - Validator Console
- LS - Lite Server
- DS - DHT Server
- JR - Jsonrpc
- THA - TON HTTP API
- LSP - ls proxy
- TSP - TON storage + TON storage provider

Пример:

```bash
MyTonInstaller> enable FN
```

### update

То же, что `enable` для mytoninstaller

```bash
MyTonInstaller> update FN
```

### plsc

Вывод конфигурации liteserver

Пример:

```json
{
    "ip": 1111111111,
    "port": 11111,
    "id": {
        "@type": "pub.ed25519",
        "key": "UURGaaZZjsBbKHvnrBqslHerXYbMCVDKdswKNJvAHkc="
    }
}
```

### clcf

Создать локальный файл конфигурации (по умолчанию `/usr/bin/ton/local.config.json`)

### print_ls_proxy_config

Вывод конфигурации ls proxy

### create_ls_proxy_config_file

Пока ничего не делает, на стадии этапа разработки

### drvcf

Файл конфигурации опасного восстановления валидатора

### setwebpass

Без аргументов. Установите пароль для веб-интерфейса администратора, запустите `python3 /usr/src/mtc-jsonrpc/mtc-jsonrpc.py -p`.

## См. также

- [Часто задаваемые вопросы](/v3/guidelines/nodes/faq)
- [Устранение неполадок](/v3/guidelines/nodes/nodes-troubleshooting)



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/mytonctrl/mytonctrl-status.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/mytonctrl/mytonctrl-status.mdx
================================================
# Состояние MyTonCtrl

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Вот объяснение вывода команды `status`.

![status](/img/docs/mytonctrl/status.png)

## Состояние сети TON

### Имя сети

Возможные значения: `mainnet`, `testnet`, `unknown`. `unknown` никогда не должно печататься.

### Количество валидаторов

Есть два значения: одно зеленое и одно желтое. Зеленый — это количество валидаторов онлайн, желтый — это количество всех
валидаторов.
Должно быть целым числом больше 0, MyTonCtrl получает его с помощью команды `getconfig 34`,
проверьте [этот раздел (param 32-34-and-36)](/v3/documentation/network/configs/blockchain-configs#param-32-34-and-36) для получения дополнительной информации.

### Количество шардчейнов

Должно быть целым числом больше 0, имеет зеленый цвет.

### Количество предложений

Есть два значения: одно зеленое и одно желтое. Зеленый — это количество "новых предложений", желтый — это количество "всех предложений".

### Количество жалоб

Есть два значения: одно зеленое и одно желтое. Зеленым обозначается количество "новых жалоб", желтым - количество
"всех жалоб".

### Состояние выборов

Может быть зеленый текст `open` или желтый `closed`.

## Статус локального валидатора

### Индекс валидатора

Если индекс валидатора больше или равен 0 (и так и должно быть, если режим валидатора активен), он должен быть зеленым, в противном случае — красным.

### Адрес ADNL локального валидатора

Просто адрес ADNL.

### Адрес кошелька локального валидатора

Адрес, используемый для стейкинга, должен быть действительным адресом TON. 

### Баланс кошелька локального валидатора

Баланс кошелька.

### Средняя нагрузка

Имеет формат `[int]: int, int, int`. Первый — это число процессоров, остальные представляют среднюю загрузку системы за последние 1, 5 и 15 минут.

### Средняя нагрузка на сеть

Три целых числа, та же логика, что и для `load average`: средняя загрузка системы за последние 1, 5 и 15 минут.

### Загрузка памяти

Две пары целых чисел, абсолютное и относительное использование оперативной памяти и подкачки.

### Средняя загрузка дисков

То же, что и для `memory load`, но для всех дисков.

### Состояние Mytoncore

Должен быть зеленым, показывает, сколько времени работает Mytoncore.

### Состояние локального валидатора

Должен быть зеленым, показывает, сколько времени работает локальный валидатор.

### Локальный валидатор не синхронизирован

Целое число должно быть меньше 20 (в этом случае оно будет зеленым).

### Сериализация последнего состояния локального валидатора

Показывает количество неработающих блоков мастерчейна

### Размер базы данных локального валидатора

Абсолютная загрузка должна составлять менее 1000 ГБ, относительная - менее 80%.

### Версия mytonctrl

Хэш коммита и имя ветки.

### Версия валидатора

Хэш коммита и имя ветки.

## Конфигурация сети TON

### Адрес конфигуратора

Адрес конфигуратора, проверьте [этот параметр 0](/v3/documentation/network/configs/blockchain-configs#param-0) для получения дополнительной информации.

### Адрес выборщика

Адрес выборщика, проверьте [этот параметр 1](/v3/documentation/network/configs/blockchain-configs#param-1) для получения дополнительной информации.

### Период проверки

Период проверки в секундах, проверьте [этот параметр 15](/v3/documentation/network/configs/blockchain-configs#param-15) для получения дополнительной информации.

### Продолжительность выборов

Продолжительность выборов в секундах, проверьте [этот параметр 15](/v3/documentation/network/configs/blockchain-configs#param-15) для получения дополнительной информации.

### Период удержания

Период удержания в секундах, проверьте [этот параметр 15](/v3/documentation/network/configs/blockchain-configs#param-15) для получения дополнительной информации.

### Минимальная ставка

Минимальная ставка в TON, проверьте [этот параметр 17](/v3/documentation/network/configs/blockchain-configs#param-17) для получения дополнительной информации.

### Максимальная ставка

Максимальная ставка в TON, проверьте [этот параметр 17](/v3/documentation/network/configs/blockchain-configs#param-17) для получения дополнительной информации.

## Временные метки TON

### Запуск сети TON

Время запуска текущей сети (основной или тестовой).

### Начало цикла проверки

Временная метка для начала цикла проверки; она будет выделена зеленым цветом, если соответствует будущему моменту.

### Окончание цикла проверки

Временная метка окончания цикла проверки; она будет выделена зеленым цветом, если соответствует будущему моменту.

### Начало выборов

Временная метка для начала выборов; она будет зеленого цвета, если она обозначает будущий момент.

### Окончание выборов

Временная метка для окончания выборов; она будет зеленого цвета, если она обозначает будущий момент.

### Начало следующих выборов

Временная метка начала следующих выборов; она будет зеленой, если обозначает будущий момент.



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/node-commands.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/node-commands.mdx
================================================
# Флаги командной строки узла TON

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

В этом документе описываются различные флаги и параметры, доступные при запуске узла TON. Каждый флаг имеет короткое имя, длинное имя, значение по умолчанию (если используется) и описание его функциональности.

## Общие параметры

| Опция                                                 | Описание                                                                                                                                                                                                                       | Значение по умолчанию                                   | Использование                                                                             |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `-v`, `-verbosity`                                    | Устанавливает уровень детализации вывода журнала.                                                                                                                                                                              | `INFO` (2)                                              | `-v <level>` (например, `-v 2`)                                                           |
| `-V`, `--version`                                     | Показывает информацию о сборке движка валидатора.                                                                                                                                                                              | Н/Д                                                     | `-V`                                                                                      |
| `-h`, \`--help\`\\`                                   | Выводит справочную информацию.                                                                                                                                                                                                 | Н/Д                                                     | `-h`                                                                                      |
| `-C`, `--global-config`                               | Указывает файл для чтения глобальной конфигурации (узлы начальной загрузки, общедоступные liteservers, блоки инициализации и т. д.).                                                                                           | Н/Д                                                     | `-C <file>`                                                                               |
| `-c`, `-local-config`                                 | Указывает файл для записи/чтения конфигурации локального узла (адреса, ключи и т. д.).                                                                                                                                         | Н/Д                                                     | `-c <file>`                                                                               |
| `-I`, `--ip`                                          | Указывает IP-адрес и порт экземпляра. Используется во время первого запуска.                                                                                                                                                   | Н/Д                                                     | `-I <ip:port>`                                                                            |
| `-D`, `--db`                                          | Указывает корневой каталог для баз данных.                                                                                                                                                                                     | Н/Д                                                     | `-D <path>`                                                                               |
| `-f`, `--fift-dir`                                    | Указывает каталог со скриптами Fift.                                                                                                                                                                                           | Н/Д                                                     | `-f <path>`                                                                               |
| `-d`, `--daemonize`                                   | Разделяет процесс, закрывая стандартный ввод и создавая новую сессию.                                                                                                                                                          | Отключено                                               | `-d`                                                                                      |
| `-l`, `--logname`                                     | Указывает файл для записи логов.                                                                                                                                                                                               | Н/Д                                                     | `-l <file>`                                                                               |
| `-s`, `--state-ttl`                                   | Устанавливает TTL (время жизни) для состояния в секундах.                                                                                                                                                                      | `86400` секунд (1 день)                                 | `-s <seconds>`                                                                            |
| `-m`, `--mempool-num`                                 | Указывает максимальное количество внешних сообщений в мемпуле.                                                                                                                                                                 | Неограниченное количество                               | `-m <number>`                                                                             |
| `-b`, \`--block-ttl\`\\`                              | Устанавливает TTL для блоков в секундах.                                                                                                                                                                                       | `86400` секунд (1 день)                                 | `-b <seconds>`                                                                            |
| `-A`, `--archive-ttl`                                 | Устанавливает TTL для архивных блоков в секундах.                                                                                                                                                                              | `604800` секунд (7 дней)                                | `-A <seconds>`                                                                            |
| `-K`, `--key-proof-ttl`                               | Устанавливает TTL для ключевых блоков в секундах.                                                                                                                                                                              | `315360000` секунд (10 лет)                             | `-K <seconds>`                                                                            |
| `-S`, `--sync-before`                                 | Во время начальной синхронизации загружает все блоки за последнее заданное количество секунд.                                                                                                                                  | `3600` секунд (1 час)                                   | `-S <seconds>`                                                                            |
| `-t`, `--threads`                                     | Указывает количество используемых потоков.                                                                                                                                                                                     | `7`                                                     | `-t <number>`                                                                             |
| `-u`, `--user`                                        | Изменяет пользователя, запускающего процесс.                                                                                                                                                                                   | Н/Д                                                     | `-u <username>`                                                                           |

## Дополнительные параметры

| Опция                                                     | Описание                                                                                                                                                                                                           | Значение по умолчанию                                | Использование                                                                                     |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `--shutdown-at`                                           | Планирует выключение валидатора в указанную временную метку Unix.                                                                                                                                                  | N/A                                                  | `--shutdown-at <timestamp>`                                                                       |
| `-T`, `--truncate-db`                                     | Обрезает базу данных с указанным номером последовательности как новый верхний блок мастерчейна.                                                                                                                    | N/A                                                  | `-T <seqno>`                                                                                      |
| `-U`, `--unsafe-catchain-restore`                         | Включает медленный и опасный метод восстановления catchain.                                                                                                                                                        | Отключено                                            | `-U <catchain-seqno>`                                                                             |
| `-F`, `--unsafe-catchain-rotate`                          | Включает принудительную и опасную ротацию catchain.                                                                                                                                                                | Отключено                                            | `-F <block-seqno>:<catchain-seqno>:<height>`                                                      |
| `--celldb-compress-depth`                                 | Оптимизирует CellDb, сохраняя ячейки глубиной X с целыми поддеревьями.                                                                                                                                             | `0` (отключено)                                      | `--celldb-compress-depth <depth>`                                                                 |
| `--max-archive-fd`                                        | Устанавливает ограничение на количество открытых файловых дескрипторов в менеджере архивов. `0` для неограниченного количества.                                                                                    | `0` (неограниченно)                                  | `--max-archive-fd <number>`                                                                       |
| `--archive-preload-period`                                | Предварительно загружает фрагменты архива за последние X секунд при запуске.                                                                                                                                       | `0` секунд (отключено)                               | `--archive-preload-period <seconds>`                                                              |
| `--enable-precompiled-smc`                                | Включает выполнение предварительно скомпилированных смарт-контрактов (экспериментально).                                                                                                                           | Отключено                                            | `--enable-precompiled-smc`                                                                        |
| `--disable-rocksdb-stats`.                                | Отключает сбор статистики RocksDb.                                                                                                                                                                                 | Включено                                             | `--disable-rocksdb-stats`                                                                         |
| `--nonfinal-ls`                                           | Включает специальные запросы локального состояния (LS) к нефинализированным блокам.                                                                                                                                | Отключено                                            | `--nonfinal-ls`                                                                                   |
| `--celldb-cache-size`                                     | Устанавливает размер кэша блока для RocksDb в CellDb в байтах.                                                                                                                                                     | `1G` (1 Гигабайт)                                    | `--celldb-cache-size <size>`                                                                      |
| `--celldb-direct-io`                                      | Включает режим прямого ввода-вывода для RocksDb в CellDb (применяется только при размере кэша >= 30G).                                                                                                             | Отключено                                            | `--celldb-direct-io`                                                                              |
| `--celldb-preload-all`.                                   | Предварительно загружает все ячейки из CellDb при запуске.                                                                                                                                                         | Отключено                                            | `--celldb-preload-all`                                                                            |
| `--celldb-in-memory`                                      | Сохраняет всю celldb в памяти. Для валидаторов с настройками по умолчанию размер celldb ~80-100 Гб, поэтому 128 Гб необходимо, а 256 предпочтительнее.                                                             | Отключено                                            | `--celldb-in-memory`                                                                              |
| `--catchain-max-block-delay`                              | Устанавливает задержку перед созданием нового блока catchain в секундах.                                                                                                                                           | `0.4` секунды                                        | `--catchain-max-block-delay <seconds>`                                                            |
| `--catchain-max-block-delay-slow`                         | Устанавливает максимальную задержку расширенного блока catchain для слишком длинных раундов в секундах.                                                                                                            | `1.0` секунда                                        | `--catchain-max-block-delay-slow <seconds>`                                                       |
| `--fast-state-serializer`                                 | Включает более быстрый сериализатор постоянного состояния, требует больше оперативной памяти.                                                                                                                      | Отключено                                            | `--fast-state-serializer`                                                                         |

## Параметры журналов сеансов

| Параметр                          | Описание                                                                                                          | Значение по умолчанию                          | Использование                                  |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| `--session-logs`                  | Указывает файл для статистики сеанса валидатора.                                                                  | `{logname}.session-stats`                      | `--session-logs <file>`                        |



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/node-types.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/node-types.mdx
================================================
import Button from '@site/src/components/button'

# Типы узлов TON

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

**Узел блокчейна** — это устройство, обычно компьютер, на котором работает программное обеспечение блокчейна TON, и поэтому он участвует в работе блокчейна.
В целом, узлы обеспечивают децентрализацию сети TON.

Узлы выполняют различные функции в протоколе TON:

- **Полные** и **архивные узлы** поддерживают историю блоков и транзакций блокчейна, позволяют пользователям и клиентским приложениям искать блоки и транзакции, а также отправлять новые транзакции в блокчейн;
- **Узлы валидатора** проверяют транзакции, обеспечивая безопасность блокчейна.

Ниже вы найдете более подробную информацию о каждом из этих типов узлов, а также о взаимодействии полных и архивных узлов с клиентскими приложениями.

## Полный узел

**Полный узел** — это базовый тип узла в блокчейне TON.
Они служат основой блокчейна TON, сохраняя историю его блоков — другими словами, его _текущее состояние_.

По сравнению с **архивными узлами** полные узлы сохраняют только последнюю часть состояния блокчейна, жизненно важную для обеспечения стабильности сети и работы клиентских приложений.
Полные узлы _обрезают_ состояние блокчейна TON, которое они хранят — это означает, что более ранние блоки, которые становятся ненужными для сети, автоматически удаляются полным узлом для эффективного управления объемом его данных.

Чтобы позволить клиентским приложениям искать блоки и транзакции, а также отправлять новые транзакции в блокчейн TON, полные узлы оснащены функциональностью liteserver: см. [Взаимодействие с узлами TON](#interacting-with-ton-nodes) ниже.

<Button href="/v3/guidelines/nodes/running-nodes/full-node#run-a-node-video"
colorType="primary" sizeType={'sm'}>

Запуск полного узла

</Button>

## Архивный узел

**Архивный узел** — это полный узел, который хранит всю историю блоков блокчейна TON.
Такие узлы действуют как децентрализованная точка отсчета с точки зрения обеспечения согласованности всей истории блокчейна.
Они служат бэкэндом для обозревателей блокчейна и других приложений, полагающихся на глубокую историю транзакций.

Архивные узлы не обрезают состояние блокчейна, что повышает их системные требования, особенно с точки зрения хранения.
Согласно последним оценкам, в то время как полные узлы и узлы-валидаторы требуют около 1 ТБ дискового пространства, архивным узлам потребуется около 8 ТБ для хранения полной истории блоков.

<Button href="/v3/guidelines/nodes/running-nodes/archive-node"
colorType="primary" sizeType={'sm'}>
Запуск архивного узла.
</Button>

## Узел валидатора

**Узлы-валидаторы** или **валидаторы** — это участники сети TON, которые предлагают новые блоки и проверяют транзакции в них в соответствии с механизмом TON _Proof-of-Stake_.
Таким образом валидаторы вносят вклад в общую безопасность блокчейна.

За успешное участие в процессе порверки, валидаторы получают [вознаграждения в TON](/v3/documentation/infra/nodes/validation/staking-incentives).

Чтобы иметь право предлагать и проверять блоки, валидаторы выбираются другими участниками в соответствии с количеством TON, удерживаемых у них, — другими словами, их _стейком_: чем больше TON поставлено на валидатора, тем больше у него шансов быть избранным, проверять блоки для сети и получать вознаграждения.
Как правило, операторы валидаторов мотивируют других держателей TON делать стейк с ними, чтобы получать пассивный доход от полученных вознаграждений.
Таким образом валидаторы обеспечивают стабильность сети, безопасность и способствуют ее росту.

<Button href="/v3/guidelines/nodes/running-nodes/validator-node"
colorType="primary" sizeType={'sm'}>
Запуск узла валидатора.
</Button>

## Взаимодействие с узлами TON

Узлы TON оснащены функционалом _Liteserver_, позволяющим внешним приложениям (другими словами, _легким клиентам_) взаимодействовать с блокчейном TON через них.
В большинстве случаев режим liteserver используется в полных и архивных узлах, тогда как узлы-валидаторы его не используют для повышения производительности проверки.

Режим liteserver позволяет легким клиентам отправлять транзакции через узлы TON, а также получать информацию о блоках и транзакциях с ними — например, для извлечения и обновления балансов кошельков.

У вас есть два варианта, чтобы разрешить вашему приложению легкому клиенту взаимодействовать с блокчейном TON:

1. Чтобы иметь стабильное соединение, вы можете запустить свой собственный полный или архивный узел с включенным режимом Liteserver в файле конфигурации узла.
2. Если у вас нет возможности настроить собственный узел TON с Liteserver, вы можете использовать сетку общедоступных Liteserver, предоставляемую TON Foundation. Для этой цели используйте следующие файлы конфигурации:
   - [Конфигурации общедоступного Liteserver - основная сеть](https://ton.org/global-config.json)
   - [Конфигурации общедоступного Liteserver - тестовая сеть](https://ton.org/testnet-global.config.json)

:::caution Использование общедоступных Liteserver в продакшене
Из-за постоянной высокой нагрузки на публичные Liteserver большинство из них имеют ограниченную скорость, поэтому не рекомендуется использовать их в продакшене.
Это может привести к нестабильности вашего клиентского приложения.
:::

<Button href="/v3/guidelines/nodes/running-nodes/liteserver-node"
colorType="primary" sizeType={'sm'}>
Включите Liteserver в вашем узле.
</Button>

Для взаимодействия с Liteserver вы можете использовать следующие инструменты:

- TON [ADNL API](/v3/guidelines/dapps/apis-sdks/ton-adnl-apis) как самый низкоуровневый способ взаимодействия с блокчейном;
- TON [SDK](/v3/guidelines/dapps/apis-sdks/sdk) для различных языков программирования;
- TON [API на основе HTTP](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton) предоставляющие промежуточное ПО REST API между вашим приложением и Liteserver.

<Button href="/v3/guidelines/dapps/apis-sdks/sdk"
colorType="primary" sizeType={'sm'}>
Выберите TON SDK
</Button>



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/validation/collators.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/validation/collators.md
================================================
# Обновление акселератора

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::caution в разработке
Эта функция сейчас доступна только в тестовой сети! Используйте на свой страх и риск.
:::

Главной особенностью блокчейна TON является возможность распределять обработку транзакций по узлам сети и переключение с "все проверяют все транзакции" на "каждая транзакция проверяется защищенным подмножеством валидаторов". Эта способность к бесконечному горизонтальному масштабированию пропускной способности по шардам, когда один воркчейн разделяется на необходимое количество *шардчейнов*, отличает TON от других сетей L1.

Однако необходимо регулярно менять подмножества валидаторов, которые обрабатывают тот или иной шард, чтобы предотвратить сговор. В то же время для обработки транзакций валидаторы, очевидно, должны знать состояние шарда до транзакции. Самый простой подход — потребовать, чтобы все валидаторы знали состояние всех шардов.

Этот подход хорошо работает, пока количество пользователей TON находится в диапазоне нескольких миллионов, а TPS (транзакций в секунду) составляет менее сотни. Однако в будущем, когда TON будет обрабатывать тысячи транзакций в секунду для сотен миллионов или миллиардов людей, ни один сервер не сможет поддерживать фактическое состояние всей сети. К счастью, TON был разработан с учетом таких нагрузок и поддерживает шардинг как пропускной способности, так и обновления состояния.

# Акселератор

**Акселератор** — это предстоящее обновление, разработанное для улучшения масштабируемости блокчейна. Его основные функции:

- **Частичные узлы**: узел сможет отслеживать определенные шарды блокчейна вместо всего набора шардов.
- **Инфраструктура Liteserver**: операторы Liteserver смогут настроить каждый LS для отслеживания набора шардов, а liteclients будут выбирать подходящий LS для каждого запроса.
- **Разделение Коллатор-Валидатор**: валидаторы будут отслеживать только мастерчейн, что значительно снизит их нагрузку.
  Валидатор будет использовать новые **узлы Коллатор** для сопоставления новых шард блоков.

Обновление акселлератора в настоящее время частично реализовано в тестовой сети.
Узлы тестовой сети можно настроить для мониторинга подмножества шардов, а liteclient можно настроить на такие частичные liteservers.

Разделение коллатор-валидатор еще не развернуто в тестовой сети. Однако можно протестировать некоторые его части, запустив собственные узлы коллатор.

# Частичные узлы

Раньше каждый узел TON должен был загружать все шарды блокчейна, что ограничивало масштабируемость. Вот почему основная функция обновления — разрешить узлам отслеживать только подмножество шардов.

Узел **отслеживает** шард, если он сохраняет это **состояние шарда** и загружает все новые блоки в шард.

Каждый узел всегда отслеживает мастерчейн.

У бейсчейна есть параметр `monitor_min_split` в `ConfigParam 12`, который в тестовой сети установлен на `2`.
Он делит бейсчейн на `2^monitor_min_split=4` группы шардов:

- Шарды с префиксом `0:2000000000000000`
- Шарды с префиксом `0:60000000000000000`
- Шарды с префиксом `0:a0000000000000000`
- Шарды с префиксом `0:e00000000000000000`

Узлы могут контролировать только группу шардов в целом. Например, узел может контролировать все шарды с префиксом `0:2000000000000000`
но не может отслеживать `0:1000000000000000`, не включая `0:30000000000000000`.

Гарантируется, что шарды из разных групп не будут объединяться.
Это гарантирует, что отслеживаемый шард не будет неожиданно объединяться с неконтролируемым шардом.

## Конфигурация узла

Обновите свой узел до последнего коммита ветки `testnet`.

По умолчанию узел отслеживает все шарды. Отключите это поведение, добавив флаг `-M` в `validator-engine`.
Узел с флагом `-M` отслеживает только мастерчейн. Для отслеживания шардов бейсчейна используйте флаг `--add-shard <wc:shard>`. Например:

```
validator-engine ... -M --add-shard 0:2000000000000000 --add-shard 0:e000000000000000
```

Эти флаги настраивают узел на отслеживание всех шардов с префиксами `0:20000000000000000` и ​​`0:e00000000000000000`.
Вы можете добавить эти флаги к существующему узлу или запустить новый узел с этими флагами.

**Примечание 1**: Не добавляйте эти флаги к узлу, участвующему в валидации. На данный момент валидаторы по-прежнему обязаны отслеживать все шарды (в следующих обновлениях это будет улучшено, так что валидаторы будут отслеживать только мастерчейн).

**Примечание 2**: Если установлен флаг `-M`, то узел начнет загрузку недостающих шардов, что может занять некоторое время.
То же самое верно, если новые шарды добавляются позже с помощью `--add-shard`.

**Примечание 3**: `--add-shard 0:08000000000000000` добавляет всю группу шардов с префиксом `0:2000000000000000` из-за `monitor_min_split`.

### Низкоуровневая конфигурация

Флаг `--add-shard` является сокращением для некоторых команд консоли валидатора.
Узел хранит список шардов для мониторинга в конфигурации (см. файл `db/config.json`, раздел `shards_to_monitor`).
Этот список можно изменить с помощью `validator-engine-console`:

```
add-shard <wc>:<shard>
del-shard <wc>:<shard>
```

Флаг `--add-shard X` эквивалентен команде `add-shard X`.

## Конфигурация Lite client

Если у вас есть несколько liteserver, каждый из которых настроен на мониторинг определенных шардов, вы можете перечислить их в разделе `liteservers_v2` глобальной конфигурации.
Например:

```json
{
  "liteservers_v2": [
    {
      "ip": 123456789, "port": 10001,
      "id": { "@type": "pub.ed25519", "key": "..." },
      "slices": [
        {
          "@type": "liteserver.descV2.sliceSimple",
          "shards": [
            { "workchain": 0, "shard": 2305843009213693952 },
            { "workchain": 0, "shard": -6917529027641081856 }
          ]
        }
      ]
    },
    {
      "ip": 987654321, "port": 10002,
      "id": { "@type": "pub.ed25519", "key": "..." },
      "slices": [
        {
          "@type": "liteserver.descV2.sliceSimple",
          "shards": [
            { "workchain": 0, "shard": 6917529027641081856 },
            { "workchain": 0, "shard": -2305843009213693952 }
          ]
        }
      ]
    }
  ],
  "validator": "...",
  "dht": "..."
}
```

Эта конфигурация включает два liteserver.

1. Первый отслеживает шарды с префиксами `0:20000000000000000` и ​​`0:a00000000000000000`.
2. Второй отслеживает шарды с префиксами `0:60000000000000000` и ​​`0:e00000000000000000`.

Оба liteserver отслеживают мастерчейн, явно включать мастерчейн в конфигурацию не требуется.

**Примечание:** Чтобы получить значение для `"shard": 6917529027641081856`, преобразуйте идентификатор шарда в шестнадцатеричном формате (`60000000000000000`) в десятичное число в диапазоне `[-2^63,2^63)`.

`lite-client` и `tonlib` поддерживают этот новый глобальный формат конфигурации. Клиенты выбирают подходящий liteserver для каждого запроса в зависимости от его шарда.

## Прокси liteserver

**Прокси liteserver** — это сервер, который принимает стандартные запросы liteserver и пересылает их другим liteserver.

Его основная цель — создать один liteserver, который действует как LS со всеми шардами,
при этом распределяя входящие запросы по соответствующим дочерним liteserver.
Это устраняет необходимость для клиентов поддерживать несколько TCP-соединений для разных шардов и
позволяет старым клиентам использовать шардированные liteserver через прокси.

Использование:

```
proxy-liteserver -p <tcp-port> -C global-config.json --db db-dir/ --logname ls.log
```

Перечислите все дочерние liteserver в глобальной конфигурации. Это могут быть частичные liteserver, как показано в примере выше.

Чтобы использовать прокси liteserver в клиентах, создайте новую глобальную конфигурацию с этим прокси в разделе `liteservers`. См. `db-dir/config.json`:

```json
{
   "@type" : "proxyLiteserver.config",
   "port" : 10005,
   "id" : {
      "@type" : "pub.ed25519",
      "key" : "..."
   }
}
```

Этот файл содержит порт и открытый ключ прокси liteserver, вы можете скопировать их в новую глобальную конфигурацию.

Ключ генерируется при первом запуске и остается неизменным после перезапуска.
Если вам нужно использовать существующий закрытый ключ, поместите файл закрытого ключа в `db-dir/keyring/<key-hash-hex>`
и запустите `proxy-liteserver` с флагом `--adnl-id <key-hash-hex>`.

# Разделение Колллатор-Валидатор

## Общие сведения

В настоящее время валидаторы тестовой и основной сети работают следующим образом:

1. Все валидаторы отслеживают все шарды.
2. Для каждого шарда случайным образом выбирается **группа валидаторов** для генерации и проверки новых блоков.
3. Внутри группы валидаторов, валидаторы **собирают** (генерируют) новые блоки-кандидаты по одному, другие валидаторы **проверяют** и подписывают их.

Изменения в обновлении акселлератора:

1. Валидаторы отслеживают только мастерчейн, что значительно снижает их нагрузку. (еще не включено в тестовой сети)
2. Процесс выбора групп валидаторов и подписания блоков остается неизменным.
3. Валидаторы Masterchain сопоставляют и проверяют блоки, как и раньше.
4. Сопоставление блока шарда требует мониторинга шарда. Поэтому вводится новый тип узла, называемый **коллатор**.
  Валидаторы шарда отправляют запросы узлам-коллекторам для генерации кандидатов на блоки.
5. Валидаторы по-прежнему проверяют блоки самостоятельно. Коллатор прикрепляет **сопоставленные данные** (доказательство состояния шарда) к блокам,
  что позволяет выполнять проверку без мониторинга шарда.

В текущей ветке тестовой сети валидаторам по-прежнему необходимо отслеживать все шарды.
Однако вы можете попробовать запустить Коллатор узлы и настроить валидаторы для сопоставления через них.

## Запуск коллатор узла

Обновите свой узел до [ветки accelerator](https://github.com/ton-blockchain/ton/tree/accelerator).

Чтобы настроить коллатор узел, используйте следующие команды `validator-engine-console`:

```
new-key
add-adnl <key-id-hex> 0
add-collator <key-id-hex> <wc>:<shard>
```

`new-key` и `add-adnl` создают новый адрес adnl. `add-collator` запускает коллатор узел для заданного шарда на этом адресе adnl.
Коллатор для шарда `X` может создавать блоки для всех шардов, которые являются предками или потомками `X`.
Коллатор узлы не могут создавать блоки для мастерчейна, только для бейсчейна.

В простом случае вы можете взять узел, который отслеживает все шарды, и запустить коллатор для всех шардов: `add-collator <key-id-hex> 0:80000000000000000`.

Также вы можете запустить частичный узел, который отслеживает и сортирует только подмножество шардов.
Пример: запустить узел с флагами `-M --add-shard 0:20000000000000000`, запустить коллатор с командой `add-collator <key-id-hex> 0:20000000000000000`.
Этот коллатор будет генерировать блоки в первой группе шардов.

**Примечание 1**: Коллатор узел генерирует блоки автоматически, даже без запросов от валидаторов.

**Примечание 2**: Коллатор узел, настроенный на генерацию блоков в определенном шарде, не требуется для мониторинга других шардов,
даже если исходящие очереди сообщений из соседних состояний шардов необходимы для сортировки.
Это достигается путем загрузки этих очередей сообщений с других узлов, которые контролируют соответствующие шарды.

## Настройка валидатора

Обновите валидатор до [ветки accelerator](https://github.com/ton-blockchain/ton/tree/accelerator).

По умолчанию валидаторы сами сортируют все блоки. Чтобы использовать коллатор узлы, создайте **список коллатор узлов** и предоставьте его валидатору с помощью `validator-engine-console`:

- `set-collators-list <имя_файла>` устанавливает новый список сортировщиков.
- `clear-collators-list` восстанавливает работу валидатора до состояния по умолчанию.
- `show-collators-list` отображает текущий список.

**Список коллатор узлов** — это файл json. Он содержит список идентификаторов adnl коллатор узлов для каждого шарда.

### Пример 1: коллаторы для всех шардов

```json
{
  "shards": [
    {
      "shard_id": { "workchain": 0, "shard": -9223372036854775808 },
      "self_collate": true,
      "select_mode": "random",
      "collators": [
        { "adnl_id": "jKT47N1RExRD81OzeHcH1F194oxHyHv76Im71dOuQJ0=" },
        { "adnl_id": "H39D7XTXOER9U1r/CEunpVbdmd7aNrcX0jOd8j7pItA=" }
      ]
    }
  ]
}
```

Этот список содержит два коллатора, которые могут генерировать блоки во всех шардах в бейсчейне (`shard_id` - `0:80000000000000000`).

Когда валидатору необходимо сгенерировать блок шарда, он случайным образом выбирает один из коллаторов для отправки запроса.

`"self_collate": true` означает, что если все коллаторы отключены, то валидатор будет собирать блок самостоятельно.
Рекомендуется использовать эту опцию для тестирования, поскольку валидаторы все еще могут генерировать блоки шардов.

### ### Пример 2: частичные коллатор узлы

```json
{
  "shards": [
    {
      "shard_id": { "workchain": 0, "shard": 4611686018427387904 },
      "self_collate": true,
      "select_mode": "random",
      "collators": [
        { "adnl_id": "jKT47N1RExRD81OzeHcH1F194oxHyHv76Im71dOuQJ0=" }
      ]
    },
    {
      "shard_id": { "workchain": 0, "shard": -6917529027641081856 },
      "self_collate": true,
      "select_mode": "random",
      "collators": [
        { "adnl_id": "H39D7XTXOER9U1r/CEunpVbdmd7aNrcX0jOd8j7pItA=" }
      ]
    },
    {
      "shard_id": { "workchain": 0, "shard": -2305843009213693952 },
      "self_collate": true,
      "select_mode": "random",
      "collators": []
    }
  ]
}
```

В этом списке есть один коллатор для префикса `0:40000000000000000`, один коллатор для префикса `0:a0000000000000000` и ​​ни одного коллатора для `0:e0000000000000000`.
`self_collate` - это `true`, поэтому валидатор будет сортировать самостоятельно, если ни один коллатор для шарда не будет в сети.

### Формальный протокол для выбора коллатора

**Список коллатор узлов** содержит список `shards`. Каждая запись имеет следующие параметры: `shard_id`, `select_mode`, `self_collate`, `collators`.
Чтобы сгенерировать блок в шарде `X`, валидатор делает следующее:

- Если `X` - это мастерчейн, то валидатор сам генерирует блок.
- Возьмите первую запись из `shards`, где `shard_id` пересекается с `X`.
- Валидатор периодически пингует коллаторы из списка, чтобы определить, какие из них находятся в сети и готовы ответить.
- Выберите онлайн коллатора из списка `collators`. `select_mode` определяет метод выбора:
  - `random`: случайный коллатор онлайн.
  - `ordered`: первый из списка (пропуская автономные коллаторы).
  - `round_robin`: последовательно выбирайте коллаторы (пропуская автономные коллаторы).
- Отправьте запрос выбранному коллатору.
- Если все коллаторы находятся в сети, а `self_collate` равен `true`, то валидатор сам генерирует блок.

### Статистика коллатор менеджера

Команда `collation-manager-stats` в `validator-engine-console` отображает состояние коллаторов: какие коллаторы в данный момент используются, а какие находятся в сети.

## Белый список коллаторов

По умолчанию узел коллатора принимает запросы от любого валидатора.
Вы можете включить белый список, чтобы разрешить запросы только от определенных валидаторов, используя `validator-engine-console`:

- `collator-whitelist-enable 1` включает белый список.
- `collator-whitelist-enable 0` отключает белый список.
- `collator-whitelist-add <validator-adnl-id-hex>` добавляет валидатор в белый список.
- `collator-whitelist-del <validator-adnl-id-hex>` удаляет валидатор из белого списка.

# Полные сопоставленные данные

По умолчанию валидаторы, предлагающие новый блок в наборе валидаторов, не прикрепляют данные, которые подтверждают состояние "до блокировки". Эти данные должны быть получены другими валидаторами из локально сохраненного состояния. Таким образом, старые (из главной ветви) и новые узлы могут достичь консенсуса, но новые валидаторы должны следить за всем состоянием сети.

После того, как [ton::capFullCollatedData](https://github.com/ton-blockchain/ton/blob/160b539eaad7bc97b7e238168756cca676a5f3be/validator/impl/collator-impl.h#L49) возможности в параметре конфигурации сети 8 будут включены, `collated_data` будет включен в блоки, и валидаторы смогут избавиться от мониторинга чего-либо, кроме мастерчейна: входящих данных будет достаточно для полной проверки корректности блока.

# Следующие шаги

- Полная и простая в использовании поддержка валидации с помощью коллаторов в MyTONCtrl
- Оптимизация размера `collated_data`: в настоящее время это нормально для большинства блоков, но некоторые транзакции могут вызвать чрезмерное использование данных
- Включение трансляции `collated_data`
- Поддержка автоматической оплаты сортировки от MyTONCtrl для создания рынка сопоставления данных и, таким образом, повышения надежности



================================================
FILE: i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/validation/staking-incentives.md
URL: https://github.com/ton-community/ton-docs/blob/main/i18n/ru/docusaurus-plugin-content-docs/current/v3/documentation/infra/nodes/validation/staking-incentives.md
================================================
# Награды за стейкинг

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Выборы и стейкинг

Блокчейн TON использует алгоритм консенсуса доказательства доли владения (PoS - Proof of Stake), что означает, что, как и во всех сетях PoS, безопасность и стабильность сети поддерживаются набором сетевых валидаторов. В частности, валидаторы предлагают кандидатов для новых блоков (состоящих из пакетов транзакций), в то время как другие валидаторы *проверяют* и утверждают их с помощью цифровых подписей.

Валидаторы выбираются с помощью специального [контракта управления Elector](/v3/documentation/smart-contracts/contracts-specs/governance#elector). Во время каждого раунда консенсуса кандидаты на валидаторы отправляют заявку на выборы вместе со своей долей и желаемым *max_factor* (параметром, который регулирует объем обслуживания, выполняемого валидатором за раунд консенсуса).

В процессе выбора валидатора смарт-контракт управления выбирает следующий раунд валидаторов и назначает каждому валидатору вес голоса, чтобы максимизировать их общую долю, принимая во внимание также долю валидатора и *max_factor*. В этом отношении, чем выше доля и *max_factor*, тем выше вес голоса валидатора и наоборот.

Выбранные валидаторы выбираются для защиты сети путем участия в следующем раунде консенсуса. Однако, в отличие от многих других блокчейнов, для достижения горизонтальной масштабируемости каждый валидатор проверяет только часть сети:

Для каждого шардчейна и мастерчейна существует выделенный набор валидаторов. Наборы валидаторов мастерчейна состоят из до 100 валидаторов, которые демонстрируют самый высокий вес голоса (определяется как сетевой параметр `Config16:max_main_validators`).

Напротив, каждый шардчейн проверяется набором из 23 валидаторов (определяется как сетевой параметр `Config28:shard_validators_num`) и чередуется случайным образом каждые 1000 секунд (сетевой параметр `Config28:shard_validators_lifetime`).

## Значения стейкинга: Максимально эффективный стейк

Текущий `max_factor` в конфигурации равен **3**, что означает, что стейк *наименьшего* валидатора не может быть меньше стейка *наибольшего* валидатора более чем в три раза.

Формула с конфигурационными параметрами: