# GitHub Docs Parser - Part 2

RLDP transfers are utilized for sending large amounts of data. A random `transfer_id` is generated, and the data is then processed using the FEC algorithm.

The resulting segments are wrapped in a `rldp.messagePart` structure and sent to the peer until the peer responds with `rldp.complete` or a timeout occurs.

Once the receiver has gathered the necessary `rldp.messagePart` pieces to reconstruct the complete message, it concatenates them, decodes them using FEC, and then deserializes the resulting byte array into either an `rldp.query` or `rldp.answer` structure, depending on the type indicated by the `tl prefix id`.

### FEC

Valid Forward Error Correction (FEC) algorithms suitable for RLDP include RoundRobin, Online, and RaptorQ. 

Currently, [RaptorQ](https://www.qualcomm.com/media/documents/files/raptorq-technical-overview.pdf) is used for data encoding.

#### RaptorQ

The core concept of RaptorQ is the division of data into symbols, which are blocks of a fixed, predetermined size.

These blocks are organized into matrices, where discrete mathematical operations are performed. This process enables the creation of an almost limitless number of symbols from the same original data. 

All the generated symbols are combined and sent to the recipient, allowing for the recovery of lost packets without the need for additional requests to the server. This method uses fewer packets than would be required if the same pieces of data were sent repeatedly.

The symbols are transmitted to the peer until they confirm that all data has been received and successfully restored (decoded) by applying the same discrete operations.

[[Please see implementation example of RaptorQ in Golang]](https://github.com/xssnick/tonutils-go/tree/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/rldp/raptorq).

## RLDP-HTTP

To interact with TON Sites, the RLDP (Reverse Lightweight Data Protocol) is used to wrap HTTP requests. The host sets up their site on any standard HTTP web server and runs `rldp-http-proxy` alongside it.

All incoming requests from the TON network are directed to the proxy via the RLDP protocol. The proxy then converts these requests into standard HTTP format and calls the original web server locally.

On the user's side, they launch a proxy, such as [Tonutils Proxy](https://github.com/xssnick/TonUtils-Proxy), to access the .ton sites. All traffic is wrapped in the reverse order: requests are sent to the local HTTP proxy, which then forwards them via RLDP to the remote TON site.

HTTP communication within RLDP is structured using TL formats:

```tlb
http.header name:string value:string = http.Header;
http.payloadPart data:bytes trailer:(vector http.header) last:Bool = http.PayloadPart;
http.response http_version:string status_code:int reason:string headers:(vector http.header) no_payload:Bool = http.Response;

http.request id:int256 method:string url:string http_version:string headers:(vector http.header) = http.Response;
http.getNextPayloadPart id:int256 seqno:int max_chunk_size:int = http.PayloadPart;
```

This is not pure HTTP in text form; everything is wrapped in a binary TL and unwrapped before being sent to the web server or browser by the proxy itself.

The scheme of work is as follows:
* Client sends `http.request`
* The server checks the `Content-Length` header when receiving a request
  * If not 0, sends a `http.getNextPayloadPart` request to the client
  * When receiving a request, the client sends `http.payloadPart` - the requested body piece depending on `seqno` and `max_chunk_size`.
  * The server repeats requests, incrementing `seqno`, until it receives all the chunks from the client, i.e. until the `last:Bool` field of the last chunk received is true.
* After processing the request, the server sends `http.response`, the client checks the `Content-Length` header
  * If it is not 0, then sends a `http.getNextPayloadPart` request to the server, and the operations are repeated, as in the case of the client but vice-versa.

## Request the TON site

To understand how RLDP works, let's look at an example of getting data from the TON site `foundation.ton`. 

Assuming say we have already got its ADNL address by calling the Get method of the NFT-DNS contract, [determined the address and port of the RLDP service using DHT](https://github.com/xssnick/ton-deep-doc/blob/master/DHT.md), and [connected to it over ADNL UDP](https://github.com/xssnick/ton-deep-doc/blob/master/ADNL-UDP-Internal.md).

### Send a GET request to `foundation.ton`

To accomplish this, please complete the following structure:

```tlb
http.request id:int256 method:string url:string http_version:string headers:(vector http.header) = http.Response;
```

Serialize `http.request` by filling in the fields:

```
e191b161                                                           -- TL ID http.request      
116505dac8a9a3cdb464f9b5dd9af78594f23f1c295099a9b50c8245de471194   -- id           = {random}
03 474554                                                          -- method       = string `GET`
16 687474703a2f2f666f756e646174696f6e2e746f6e2f 00                 -- url          = string `http://foundation.ton/`
08 485454502f312e31 000000                                         -- http_version = string `HTTP/1.1`
01000000                                                           -- headers (1)
   04 486f7374 000000                                              -- name         = Host
   0e 666f756e646174696f6e2e746f6e 00                              -- value        = foundation.ton
```

Now let's wrap our serialized `http.request` into `rldp.query` and serialize it too:

```
694d798a                                                              -- TL ID rldp.query
184c01cb1a1e4dc9322e5cabe8aa2d2a0a4dd82011edaf59eb66f3d4d15b1c5c      -- query_id        = {random}
0004040000000000                                                      -- max_answer_size = 257 KB, can be any sufficient size that we accept as headers
258f9063                                                              -- timeout (unix)  = 1670418213
34 e191b161116505dac8a9a3cdb464f9b5dd9af78594f23f1c295099a9b50c8245   -- data (http.request)
   de4711940347455416687474703a2f2f666f756e646174696f6e2e746f6e2f00
   08485454502f312e310000000100000004486f73740000000e666f756e646174
   696f6e2e746f6e00 000000
```

### Encoding and sending packets

We now need to apply the FEC RaptorQ algorithm to our data.

First, we will create an encoder, which requires us to convert the resulting byte array into symbols of a fixed size. In this case, the symbol size is 768 bytes.

To achieve this, we'll divide the array into segments of 768 bytes each. If the last segment is smaller than 768 bytes, we will pad it with zero bytes to reach the required size.

Our current array is 156 bytes long, which means it will consist of only one segment. To make it 768 bytes, we need to add 612 zero bytes for padding.

Additionally, the constants chosen for the encoder depend on the data size and the symbol size. For more detailed information, you can refer to the RaptorQ documentation. However, to simplify the process and avoid complex mathematical calculations, we recommend using a pre-existing library that implements this encoding.

Please see the examples:

* [[Example of creating an encoder]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/rldp/raptorq/encoder.go#L15)  
* [[Symbol encoding example]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/raptorq/solver.go#L26)

Symbols are encoded and transmitted in a round-robin manner. We start with an initial sequence number, `seqno`, set to 0, and increment it by 1 for each subsequent encoded packet. For instance, if we have two symbols, we first encode and send the first symbol, then increase `seqno` by 1. Next, we encode and send the second symbol and again increase `seqno` by 1. After that, we return to the first symbol and increment `seqno` (which is now 2) by another 1.

This process continues until we receive a message indicating that the peer has accepted the data.

Having created the encoder, we are now ready to send data. To do this, we will fill in the TL schema:

```tlb
fec.raptorQ data_size:int symbol_size:int symbols_count:int = fec.Type;

rldp.messagePart transfer_id:int256 fec_type:fec.Type part:int total_size:long seqno:int data:bytes = rldp.MessagePart;
```

* `transfer_id` - random int256, the same for all messageParts within the same data transfer.
*  `fec_type` is `fec.raptorQ`.
   * `data_size` = 156
   * `symbol_size` = 768
   * `symbols_count` = 1
*  `part` in our case always 0, can be used for transfers that hit the size limit.
*  `total_size` = 156. The size of our transfer data.
*  `seqno` - for the first packet will be equal to 0, and for each subsequent packet it will increase by 1, will be used as parameter to decode and encode symbol.
*  `data` - our encoded symbol, 768 bytes in size.

After serializing `rldp.messagePart`, wrap it in `adnl.message.custom` and send it over ADNL UDP.

We will send packets in a continuous loop, incrementing the `seqno` each time, until we either receive the `rldp.complete` message from the peer or reach a timeout. Once we have sent a number of packets equal to the number of our symbols, we can slow down the transmission and send additional packets, for example, once every 10 milliseconds or even less frequently.

These extra packets are intended for recovery in case of data loss, as UDP is a fast but unreliable protocol.

[[Please see implementation example]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/rldp.go#L249).

### Processing the response from `foundation.ton`

During the sending process, we can expect a response from the server. In our case, we are waiting for `rldp.answer` containing `http.response`.

The response will arrive in the same format as it was sent during the request, but the `transfer_id` will be inverted (each byte will undergo an `XOR` operation with `0xFF`).

We will receive `adnl.message.custom` messages that include `rldp.messagePart`.

First, we need to extract FEC information from the initial message received during the transfer. Specifically, we are looking for the `data_size`, `symbol_size`, and `symbols_count` parameters from the `fec.raptorQ` messagePart structure.

These parameters are essential for initializing the RaptorQ decoder. [[Please see the example]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/rldp.go#L137).

After initialization, we add the received symbols along with their `seqno` to our decoder. Once we have gathered the minimum required number of symbols, equal to `symbols_count`, we can attempt to decode the full message. If successful, we will send `rldp.complete`. [[Please see the example]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/rldp.go#L168).

The result will be a `rldp.answer` message containing the same `query_id` as in the sent `rldp.query`. The data must include `http.response`.

```tlb
http.response http_version:string status_code:int reason:string headers:(vector http.header) no_payload:Bool = http.Response;
```

The main fields are generally straightforward, as they function similarly to those in HTTP.

One notable flag is `no_payload`. If this flag is set to true, it indicates that there is no body in the response, meaning `Content-Length` is 0. In this case, the response from the server can be considered received.

If `no_payload` is false, this means there is content in the response, and we need to retrieve it. To do this, we should send a request using the TL schema `http.getNextPayloadPart`, which should be wrapped in `rldp.query`.

```tlb
http.getNextPayloadPart id:int256 seqno:int max_chunk_size:int = http.PayloadPart;
```

`id` must match the value sent in `http.request`, `seqno` should be 0, and increment by 1 for each subsequent part. The `max_chunk_size` indicates the largest chunk size we can accept, with a typical value of 128 KB (131072 bytes). 

In response, we will receive the following information:

```tlb
http.payloadPart data:bytes trailer:(vector http.header) last:Bool = http.PayloadPart;
```

If `last` is true, then we have reached the end. We can combine all the pieces to create a complete response body, such as HTML.

## References

Here is the [link to the original article](https://github.com/xssnick/ton-deep-doc/blob/master/RLDP.md) - _[Oleg Baranov](https://github.com/xssnick)._

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/addresses.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/addresses.md
================================================
import Feedback from '@site/src/components/Feedback';

# Smart contract addresses

This section describes the specifics of smart contract addresses on the TON Blockchain. It also explains how actors are synonymous with smart contracts on TON.

## Everything is a smart contract

On TON, smart contracts are built using the [Actor model](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#single-actor). In fact, actors on TON are technically represented as smart contracts. This means that even your wallet is a simple actor (and a smart contract).

Typically, actors process incoming messages, change their internal states, and generate outbound messages as a result. That's why every actor (i.e., smart contract) on TON Blockchain must have an address, so it can receive messages from other actors.

:::info EVM EXPERIENCE
On the Ethereum Virtual Machine (EVM), addresses are completely separate from smart contracts. Feel free to learn more about the differences by reading our article ["Six unique aspects of TON Blockchain that will surprise Solidity developers"](https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers) - _Tal Kol_.
:::

## Address of smart contract

Smart contract addresses on TON typically consist of two main components:

* **(workchain_id)**: Denotes the workchain ID (a signed 32-bit integer)

* **(account_id)** Denotes the address of the account (64-512 bits, depending on the workchain)

In the raw address overview section of this documentation, we'll discuss how  **(workchain_id, account_id)** pairs are presented.

### WorkChain ID and Account ID

#### Workchain ID

[As we've seen before](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#workchain-blockchain-with-your-own-rules), it is possible to create as many as `2^32` workchains operating on TON Blockchain. We also noted how 32-bit prefix smart contract addresses identify and are linked to smart contract addresses within different workchains. This allows smart contracts to send and receive messages to and from different workchains on TON Blockchain.

Nowadays, only the Masterchain (workchain_id=-1) and occasionally the basic workchain (workchain_id=0) are running in TON Blockchain.

Both of them have 256-bit addresses, therefore, we assume that the workchain_id is either 0 or -1, and the address within the workchain is precisely 256 bits.


#### Account ID

All account IDs on TON use 256-bit addresses on the Masterchain and Basechain (also referred to as the basic workchain).

In fact, an Account ID (**account_id**) is defined as the result of applying a hash function (specifically SHA-256) to a smart contract object. Every smart contract operating on the TON Blockchain stores two main components:

1. _Compiled code_. The logic of the smart contract, compiled into bytecode.
2. _Initial state_. The contract's values at the moment it is deployed on-chain.

To derive the contract's address, you calculate the hash of the **(Initial code, Initial state)** pair. We won’t explore how the [TVM](/v3/documentation/tvm/tvm-overview) works at this time, but it is important to understand that account IDs on TON follow this formula:

**account_id = hash(initial code, initial state)**

Later in this documentation, we will dive deeper into the technical specifications of the TVM and TL-B scheme. Now that we are familiar with how the **account_id** is generated and how it interacts with smart contract addresses on TON, let’s discuss Raw and User-Friendly addresses.




## Addresses state

Each address can be in one of possible states:

- `nonexist` - there were no accepted transactions on this address, so it doesn't have any data (or the contract was deleted). We can say that initially all 2<sup>256</sup> address are in this state.
- `uninit` - address has some data, which contains balance and meta info. At this state address doesn't have any smart contract code/persistent data yet. An address enters this state, for example, when it was in a nonexist state, and another address sent tokens to it.
- `active` - address has smart contract code, persistent data and balance. At this state it can perform some logic during the transaction and change its persistent data. An address enters this state when it was `uninit` and there was an incoming message with state_init param (note, that to be able to deploy this address, hash of `state_init` and `code` must be equal to address).
- `frozen` - address cannot perform any operations, this state contains only two hashes of the previous state (code and state cells respectively). When an address's storage charge exceeds its balance, it goes into this state. To unfreeze it, you can send an internal message with `state_init` and `code` which store the hashes described earlier and some Toncoin. It can be difficult to recover it, so you should not allow this situation. There is a project to unfreeze the address, which you can find [here](https://unfreezer.ton.org/).

## Raw and user-friendly addresses

After providing a brief overview of how smart contract addresses on TON leverage workchains and account IDs (for the Masterchain and Basechain specifically), it is important to understand that these addresses are expressed in two main formats:

* **Raw addresses**: Original full representation of smart contract addresses.
* **User-friendly addresses**: User-friendly addresses are an enhanced format of raw address that employ better security and ease of use.

Below, we’ll explain more about the differences between these two address types and dive deeper into why user-friendly addresses are used on TON.

### Raw address

Raw smart contract addresses consist of a workchain ID and account ID *(workchain_id, account_id)* and are displayed in the following format:

* [decimal workchain_id\]:[64 hexadecimal digits with account_id\]


Provided below, is an example of a raw smart contract address using a  workchain ID and account ID together (expressed as **workchain_id** and **account_id**):

`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

Notice the `-1` at the start of the address string, which denotes a _workchain_id_ that belongs to the Masterchain.

:::note
Uppercase letters (such as 'A', 'B', 'C', 'D' etc.) may be used in address strings instead of their lowercase counterparts (such as 'a', 'b', 'c', 'd' etc.).
:::

#### Issues with raw addresses

Using the Raw Address form presents two main issues:

1. When using the raw address format, it's not possible to verify addresses to eliminate errors prior to sending a transaction.
   This means that if you accidentally add or remove characters in the address string prior to sending the transaction, your transaction will be sent to the wrong destination, resulting in loss of funds.
2. When using the raw address format, it's impossible to add special flags like those used when sending transactions that employ user-friendly addresses.
   To help you better understand this concept, we’ll explain which flags can be used below.

### User-friendly address

User-friendly addresses were developed to secure and simplify the experience for TON users who share addresses on the internet (for example, on public messaging platforms or via their email service providers), as well as in the real world.

#### User-friendly address structure

User-friendly addresses are made up of 36 bytes in total and are obtained by generating the following components in order:

1. _[flags - 1 byte]_ — Flags that are pinned to addresses change the way smart contracts react to the received message.
   Flags types that employ the user-friendly address format include:

   - isBounceable. Denotes a bounceable or non-bounceable address type. (_0x11_ for "bounceable", _0x51_ for "non-bounceable")
   - isTestnetOnly. Denotes an address type used for testnet purposes only. Addresses beginning with _0x80_ should not be accepted by software running on the production network
   - isUrlSafe. Denotes a deprecated flag that is defined as URL-safe for an address. All addresses are then considered URL-safe.
2. _\[workchain_id - 1 byte]_ — The workchain ID (_workchain_id_) is defined by a signed 8-bit integer _workchain_id_.  
(_0x00_ for the BaseChain, _0xff_ for the MasterChain)
3. _\[account_id - 32 byte]_ — The account ID is made up of a ([big-endian](https://www.freecodecamp.org/news/what-is-endianness-big-endian-vs-little-endian/)) 256-bit address in the workchain.
4. _\[address verification - 2 bytes]_ —  In user-friendly addresses, address verification is composed of a CRC16-CCITT signature from the previous 34 bytes. ([Example](https://github.com/andreypfau/ton-kotlin/blob/ce9595ec9e2ad0eb311351c8a270ef1bd2f4363e/ton-kotlin-crypto/common/src/crc32.kt))
   In fact, the idea pertaining to verification for user-friendly addresses is quite similar to the [Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm), which is used on all credit cards to prevent users from entering non-existing card numbers by mistake.

The addition of these 4 main components means that: `1 + 1 + 32 + 2 = 36` bytes in total (per user-friendly address).

To generate a user-friendly address, the developer must encode all 36 bytes using either:
- _base64_ (i.e., with digits, upper and lowercase Latin letters, '/' and '+')
- _base64url_ (with '_' and '-' instead of '/' and '+')

After this process is complete, the generation of a user-friendly address with a length of 48 non-spaced characters is finalized.

:::info DNS ADDRESS FLAGS
On TON, DNS addresses such as mywallet.ton are sometimes used instead of raw and user-friendly addresses. DNS addresses are made up of user-friendly addresses and include all the required flags that allow developers to access all the flags from the DNS record within the TON domain.
:::

#### User-friendly address encoding examples

For example, the "test giver" smart contract (a special smart contract residing in the testnet masterchain that sends 2 test tokens to anyone who requests them) makes use of the following raw address:

`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

The above "test giver" raw address must be converted into the user-friendly address form. This is obtained using either the base64 or base64url forms (that we introduced previously) as follows:

* `kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny` (base64)
* `kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny` (base64url)

:::info
Notice that both forms (_base64_ and _base64url_) are valid and must be accepted!
:::

#### Bounceable vs non-bounceable addresses

The core idea behind the bounceable address flag is sender's funds security.

For example, if the destination smart contract does not exist, or if an issue happens during the transaction, the message will be "bounced" back to the sender and constitute the remainder of the original value of the transaction (minus all transfer and gas fees).
In relation to bounceable addresses specifically:

1. The **bounceable=false** flag generally means the receiver is a wallet.
2. The **bounceable=true** flag typically denotes a custom smart contract with its own application logic (for example, a DEX). In this example, non-bounceable messages should not be sent because of security reasons.

Feel free to read more on this topic in our documentation to gain a better understanding of [non-bounceable messages](/v3/documentation/smart-contracts/message-management/non-bounceable-messages).

#### Armored base64 representations

Additional binary data related to TON Blockchain employs similar "armored" base64 user-friendly address representations. These differentiate from one another depending on the first 4 characters of their byte tag. For example, 256-bit Ed25519 public keys are represented by first creating a 36-byte sequence using the below process in order:

- A single byte tag using the _0x3E_ format denotes a public key
- A single byte tag using the _0xE6_ format denotes a Ed25519 public key
- 32 bytes containing the standard binary representation of the Ed25519 public key
- 2 bytes containing the big-endian representation of CRC16-CCITT of the previous 34 bytes


The resulting 36-byte sequence is converted into a 48-character base64 or base64url string in the standard fashion. For example, the Ed25519 public key `E39ECDA0A7B0C60A7107EC43967829DBE8BC356A49B9DFC6186B3EAC74B5477D` (usually represented by a sequence of 32 bytes such as:  `0xE3, 0x9E, ..., 0x7D`) presents itself through the "armored" representation as follows:

`Pubjns2gp7DGCnEH7EOWeCnb6Lw1akm538YYaz6sdLVHfRB2`


### Converting user-friendly addresses and raw addresses

The simplest way to convert user-friendly and raw addresses is to use one of several TON APIs and other tools, including:

* [ton.org/address](https://ton.org/address)
* [dton.io API method](https://dton.io/api/address/0:867ac2b47d1955de6c8e23f57994fad507ea3bcfe2a7d76ff38f29ec46729627)
* [toncenter API methods in mainnet](https://toncenter.com/api/v2/#/accounts/pack_address_packAddress_get)
* [toncenter API methods in testnet](https://testnet.toncenter.com/api/v2/#/accounts/pack_address_packAddress_get)

Additionally, there are two ways to convert user-friendly and raw addresses for wallets using JavaScript:

* [Convert address from/to user-friendly or raw form using ton.js](https://github.com/ton-org/ton-core/blob/main/src/address/Address.spec.ts)
* [Convert address from/to user-friendly or raw form using tonweb](https://github.com/toncenter/tonweb/tree/master/src/utils#address-class)

It's also possible to make use of similar mechanisms using [SDKs](/v3/guidelines/dapps/apis-sdks/sdk).

### Address examples

Learn more examples on TON Addresses in the [TON cookbook](/v3/guidelines/dapps/cookbook#working-with-contracts-addresses).

## Possible problems

When interacting with the TON blockchain, it's crucial to understand the implications of transferring TON coins to `uninit` wallet addresses. This section outlines the various scenarios and their outcomes to provide clarity on how such transactions are handled.

### What happens when you transfer Toncoin to an uninit address?

#### Transaction with `state_init` included

If you include the `state_init` (which consists of the wallet or smart contract's code and data) with your transaction. The smart contract is deployed first using the provided `state_init`. After deployment, the incoming message is processed, similar to sending to an already initialized account.

#### Transaction without `state_init` and `bounce` flag set

The message cannot be delivered to the `uninit` smart contract, and it will be bounced back to the sender. After deducting the consumed gas fees, the remaining amount is returned to the sender's address.

#### Transaction without `state_init` and `bounce` flag unset

The message cannot be delivered, but it will not bounce back to the sender. Instead, the sent amount will be credited to the receiving address, increasing its balance even though the wallet is not yet initialized. They will be stored there until the address holder deploys a smart wallet contract and then they can access the balance.

#### How to do it right

The best way to deploy a wallet is to send some TON to its address (which is not yet initialized) with the `bounce` flag cleared. After this step, the owner can deploy and initialize the wallet using funds at the current uninitialized address. This step usually occurs on the first wallet operation.

### The TON blockchain implements protection against erroneous transactions

In the TON blockchain, standard wallets and apps automatically manage the complexities of transactions to uninitialized addresses by using bounceable and non-bounceable address, which are described [here](#bounceable-vs-non-bounceable-addresses). It is common practice for wallets, when sending coins to non-initialized addresses, to send coins to both bounceable and non-bounceable addresses without return.

If you need to quickly get an address in bounceable/non-bounceable form, this can be done [here](https://ton.org/address/).

### Responsibility for custom products

If you are developing a custom product on the TON blockchain, it is essential to implement similar checks and logic:

Ensure your application verifies whether the recipient address is initialized before sending funds.
Based on the address state, use bounceable addresses for user smart contracts with custom application logic to ensure funds are returned. Use non-bounceable addresses for wallets.


<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/contracts-specs/examples.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/contracts-specs/examples.md
================================================
import Feedback from '@site/src/components/Feedback';

# Examples of smart contracts 

On this page, you can find TON smart contract references implemented for various program software.

:::info
Make sure you have thoroughly tested contracts before using them in a production environment. This is a critical step to ensure the proper functioning and security of your software.
:::

## FunC smart contracts

###  Production-used contracts
| Contracts                                                                                                                                                                                                                                                                                                     | Description                                                                                                                                                                  |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [wallet-contract](https://github.com/ton-blockchain/wallet-contract) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/wallet-contract&name=wallet-contract)</small>                                                                                         | Wallet v4 is the proposed version of the wallet to replace v3 or older wallets                                                                                               |
| [liquid-staking-contract](https://github.com/ton-blockchain/liquid-staking-contract/) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/liquid-staking-contract/&name=liquid-staking-contract)</small>                                                       | Liquid Staking (LSt) is a protocol that connects TON holders of all calibers with hardware node operators to participate in TON Blockchain validation through asset pooling. |
| [modern_jetton](https://github.com/EmelyanenkoK/modern_jetton) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/EmelyanenkoK/modern_jetton&name=modern_jetton)</small>                                                                                                     | Implementation of standard jetton with additional withdraw_tons and withdraw_jettons.                                                                                        |
| [highloadwallet-v3](https://github.com/ton-blockchain/highload-wallet-contract-v3)                                                                                                                                                                                                                            | This wallet is designed for those who need to send transactions at very high rates, such as crypto exchanges.                                                                |
| [stablecoin-contract](https://github.com/ton-blockchain/stablecoin-contract)                                                                                                                                                                                                                                  | Jetton-with-governance FunC smart contracts, used for stablecoins such as USDt.                                                                                              |
| [governance-contract](https://github.com/ton-blockchain/governance-contract) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/governance-contract&name=governance-contract)</small>                                                                         | Core TON Blockchain contracts `elector-code.fc` and `config-code.fc`.                                                                                                        |
| [bridge-func](https://github.com/ton-blockchain/bridge-func) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/bridge-func&name=bridge-func)</small>                                                                                                         | TON-EVM Toncoin Bridge.                                                                                                                                                      |
| [token-bridge-func](https://github.com/ton-blockchain/token-bridge-func) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/token-bridge-func&name=token-bridge-func)</small>                                                                                 | TON-EVM token bridge - FunC smart contracts.                                                                                                                                 |
| [lockup-wallet-contract/universal](https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/universal) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/universal&name=lockup-wallet-contract/universal)</small> | The universal lockup wallet is a contract that can store locked and restricted coins.                                                                                        |
| [lockup-wallet-contract/vesting](https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/vesting) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/vesting&name=lockup-wallet-contract/vesting)</small>         | Vesting wallet smart-contract                                                                                                                                                |
| [multisig-contract](https://github.com/ton-blockchain/multisig-contract) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/multisig-contract&name=multisig-contract)</small>                                                                                 | `(n, k)`-multisig wallet is a wallet with `n` private keys holders, which accepts requests to send messages if the request collects at least `k` signatures of the holders.  |
| [token-contract](https://github.com/ton-blockchain/token-contract) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/token-contract&name=token-contract)</small>                                                                                             | Fungible, Non-Fungible, Semi-Fungible Tokens Smart Contracts                                                                                                                 |
| [dns-contract](https://github.com/ton-blockchain/dns-contract) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/dns-contract&name=dns-contract)</small>                                                                                                     | Smart contracts of `.ton` zone.                                                                                                                                              |
| [nominator-pool](https://github.com/ton-blockchain/nominator-pool) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/nominator-pool&name=nominator-pool)</small>                                                                                             | Nominator Pool smart contract                                                                                                                                                |
| [single-nominator-pool](https://github.com/orbs-network/single-nominator) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/nominator-pool&name=nominator-pool)</small>                                                                                      | Single Nominator Pool smart contract                                                                                                                                         |
| [vesting-contract](https://github.com/ton-blockchain/vesting-contract) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/vesting-contract&name=vesting-contract)</small>                                                                                         | The Vesting contract allows you to lock a certain amount of Toncoin for a specified time and gradually unlock them.                                                                                                                                                |
| [storage](https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont&name=storage)</small>                                       | TON Storage provider and fabric contracts                                                                                                                                    |

### Ecosystem contracts
| Contracts                                                                                                                                                                                                                                                                                                  | Description                                                                                                                                 |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| [telemint](https://github.com/TelegramMessenger/telemint) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/TelegramMessenger/telemint&name=telemint)</small>                                                                                                            | Telegram Usenames(`nft-item.fc`) and Telegram Numbers(`nft-item-no-dns.fc`) contracts.                                                      |
| [capped-fungible-token](https://github.com/TonoxDeFi/capped-fungible-token) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/TonoxDeFi/capped-fungible-token&name=capped-fungible-token)</small>                                                                        | Basic implementation of smart contracts for Jetton Wallet and Jetton Minter                                                                 |
| [gusarich-airdrop](https://github.com/Gusarich/airdrop/tree/main/contracts)                                                                                                          | Implementation of a Scalable Airdrop System for the TON blockchain. It can be used to distribute Jettons on-chain to any number of wallets. |
| [getgems-io/nft-contracts](https://github.com/getgems-io/nft-contracts/tree/main/packages/contracts/sources) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/getgems-io/nft-contracts/tree/main/packages/contracts/sources&name=getgems-io/nft-contracts)</small>      | Getgems NFT Contracts                                                                                                                       |
| [lockup-wallet-deployment](https://github.com/ton-defi-org/lockup-wallet-deployment) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ton-defi-org/lockup-wallet-deployment&name=lockup-wallet-deployment)</small>                                                      | Deploy and run lockup Contract end to end                                                                                                   |
| [WTON](https://github.com/TonoxDeFi/WTON) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/TonoxDeFi/WTON&name=WTON)</small>                                                                                                                                            | This smart contract provides an implementation of wrapped Toncoin, called WTON                                                              |
| [wton-contract](https://github.com/ton-community/wton-contract) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ton-community/wton-contract&name=wton-contract)</small>                                                                                                | wTON contracts                                                                                                                              |
| [contract-verifier-contracts](https://github.com/ton-community/contract-verifier-contracts) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ton-community/contract-verifier-contracts&name=contract-verifier-contracts)</small>                                        | Sources registry contracts which stores an on-chain proof per code cell hash.                                                               |
| [vanity-contract](https://github.com/ton-community/vanity-contract) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ton-community/vanity-contract&name=vanity-contract)</small>                                                                                        | Smart contract that allows to "mine" any suitable address for any contract.                                                                 |
| [ton-config-smc](https://github.com/ton-foundation/ton-config-smc) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ton-foundation/ton-config-smc&name=ton-config-smc)</small>                                                                                          | Simple contract for storing versioned data in TON Blockchain.                                                                               |
| [ratelance](https://github.com/ProgramCrafter/ratelance/tree/main/contracts/func) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ProgramCrafter/ratelance/tree/main/contracts/func&name=ratelance)</small>                                                            | Ratelance is freelance platform that seeks to remove barriers between potential employers and workers.                                      |
| [logger.fc](https://github.com/tonwhales/ton-contracts/blob/master/contracts/logger.fc) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/tonwhales/ton-contracts/blob/master/contracts/logger.fc&name=logger.fc)</small>                                                | Contract that saves data in the local storage.                                                                                              |
| [ton-nominators](https://github.com/tonwhales/ton-nominators) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/tonwhales/ton-nominators&name=ton-nominators)</small>                                                                                                    | Ton Whales Nominator pool source code.                                                                                                      |
| [ton-link-contract-v3](https://github.com/ton-link/ton-link-contract-v3) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ton-link/ton-link-contract-v3&name=ton-link-contract-v3)</small>                                                                              | Ton-link allows smart contracts to access data outside of the blockchain while maintaining data security.                                   |
| [delab-team/fungible-token](https://github.com/delab-team/contracts/tree/main/fungible-token) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/delab-team/contracts/tree/main/fungible-token&name=delab-team/fungible-token)</small>                                    | DeLab TON fungible-token implementation                                                                                                     |
| [whitelisted-wallet.fc](https://github.com/tonwhales/ton-contracts/blob/master/contracts/whitelisted-wallet.fc) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/tonwhales/ton-contracts/blob/master/contracts/whitelisted-wallet.fc&name=whitelisted-wallet.fc)</small> | Simple Whitelisted Wallet Contract                                                                                                          |
| [delab-team/jetton-pool](https://github.com/delab-team/contracts/tree/main/jetton-pool) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/delab-team/contracts/tree/main/jetton-pool&name=delab-team/jetton-pool)</small>                                                | The Jetton Pool TON smart contract is designed to create farming pools.                                                                     |
| [ston-fi/contracts](https://github.com/ston-fi/dex-core/tree/main/contracts) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ston-fi/dex-core/tree/main/contracts&name=ston-fi/contracts)</small>                                                                      | Stonfi DEX core contracts                                                                                                                   |
| [onda-ton](https://github.com/0xknstntn/onda-ton) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/0xknstntn/onda-ton&name=onda-ton)</small>                                                                                                                            | Onda Lending Pool - Core smart contracts of the first lending protocol on TON                                                               |
| [ton-stable-timer](https://github.com/ProgramCrafter/ton-stable-timer) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ProgramCrafter/ton-stable-timer&name=ton-stable-timer)</small>                                                                                  | TON Stable Timer contract                                                                                                                   |
| [HipoFinance/contract](https://github.com/HipoFinance/contract) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/HipoFinance/contract&name=HipoFinance)</small>                                                                                                         | hTON is a decentralized, permission-less, open-source liquid staking protocol on TON Blockchain                                             |

### Learning contracts

| Contracts                                                                                                                                                                                                                                                                                                                             | Description                                                             |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| [counter.fc](https://github.com/ton-community/blueprint/blob/main/example/contracts/counter.fc) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ton-community/blueprint/blob/main/example/contracts/counter.fc&name=counter.fc)</small>                                                              | Counter smart contract with comments.                                   |
| [simple-distributor](https://github.com/ton-community/simple-distributor) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/ton-community/simple-distributor&name=simple-distributor)</small>                                                                                                          | Simple TON distributor.                                                 |
| [ping-pong.fc](https://github.com/tonwhales/ton-nft/blob/main/packages/nft/ping-pong/ping-pong.fc) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/tonwhales/ton-nft/blob/main/packages/nft/ping-pong/ping-pong.fc&name=ping-pong.fc)</small>                                                        | Simple contract to test sending Toncoin in different modes.             |
| [ton-random](https://github.com/puppycats/ton-random) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/puppycats/ton-random&name=ton-random)</small>                                                                                                                                                  | Two contracts that will help you in generating random numbers on-chain. |
| [Blueprint simple contract](https://github.com/liminalAngel/1-func-project/blob/master/contracts/main.fc) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/liminalAngel/1-func-project/blob/master/contracts/main.fc&name=simple_contract)</small>                                                    | Example smart contract                                                  |
| [Blueprint jetton_minter.fc](https://github.com/liminalAngel/func-blueprint-tutorial/blob/master/6/contracts/jetton_minter.fc) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/liminalAngel/func-blueprint-tutorial/blob/master/6/contracts/jetton_minter.fc&name=jetton_minter.fc)</small> | Smart contract example to mint Jettons on-chain.                        |
| [Simple TON DNS Subdomain manager](https://github.com/Gusarich/simple-subdomain) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/Gusarich/simple-subdomain&name=Simple_TON_DNS_Subdomain_manager)</small>                                                                                            | TON DNS subdomains manager.                                             |
| [disintar/sale-dapp](https://github.com/disintar/sale-dapp/tree/master/func) <br /> <small>🪄 [Run in WebIDE](https://ide.ton.org/?importURL=https://github.com/disintar/sale-dapp/tree/master/func&name=disintar/sale-dapp)</small>                                                                                                    | React + NFT sale DApp with FunC                                         |


### TON smart challenges

#### TON Smart Challenge 1
* https://github.com/nns2009/TON-FunC-contest-1/tree/main
* https://github.com/pyAndr3w/func-contest1-solutions
* https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest1

#### TON Smart Challenge 2
* https://github.com/ton-blockchain/func-contest2-solutions
* https://github.com/nns2009/TON-FunC-contest-2
* https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest2

#### TON Smart Challenge 3
* https://github.com/nns2009/TON-FunC-contest-3
* https://github.com/shuva10v/func-contest3-solutions
* https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest3

#### TON Smart Challenge 4

* https://github.com/akifoq/tsc4 (TOP optimized)
* https://github.com/Gusarich/tsc4
* https://github.com/Skydev0h/tsc4
* https://github.com/aSpite/tsc4-contracts (FunC solution)
* [https://github.com/ProgramCrafter/tsc4](https://github.com/ProgramCrafter/tsc4/tree/c1616e12d1b449b01fdcb787a3aa8442e671371e/contracts) (FunC solution)

## Fift smart contracts

* [CreateState.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/CreateState.fif)
* [asm-to-cpp.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/asm-to-cpp.fif)
* [auto-dns.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/auto-dns.fif)
* [complaint-vote-req.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/complaint-vote-req.fif)
* [complaint-vote-signed.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/complaint-vote-signed.fif)
* [config-proposal-vote-req.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/config-proposal-vote-req.fif)
* [config-proposal-vote-signed.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/config-proposal-vote-signed.fif)
* [create-config-proposal.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/create-config-proposal.fif)
* [create-config-upgrade-proposal.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/create-config-upgrade-proposal.fif)
* [create-elector-upgrade-proposal.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/create-elector-upgrade-proposal.fif)
* [envelope-complaint.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/envelope-complaint.fif)
* [gen-zerostate-test.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/gen-zerostate-test.fif)
* [gen-zerostate.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/gen-zerostate.fif)
* [highload-wallet-v2-one.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet-v2-one.fif)
* [highload-wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet-v2.fif)
* [highload-wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet.fif)
* [manual-dns-manage.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/manual-dns-manage.fif)
* [new-auto-dns.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-auto-dns.fif)
* [new-highload-wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet-v2.fif)
* [new-highload-wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet.fif)
* [new-manual-dns.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-manual-dns.fif)
* [new-pinger.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-pinger.fif)
* [new-pow-testgiver.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-pow-testgiver.fif)
* [new-restricted-wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-restricted-wallet.fif)
* [new-restricted-wallet2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-restricted-wallet2.fif)
* [new-restricted-wallet3.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-restricted-wallet3.fif)
* [new-testgiver.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-testgiver.fif)
* [new-wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet-v2.fif)
* [new-wallet-v3.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet-v3.fif)
* [new-wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet.fif)
* [show-addr.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/show-addr.fif)
* [testgiver.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/testgiver.fif)
* [update-config-smc.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/update-config-smc.fif)
* [update-config.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/update-config.fif)
* [update-elector-smc.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/update-elector-smc.fif)
* [validator-elect-req.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/validator-elect-req.fif)
* [validator-elect-signed.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/validator-elect-signed.fif)
* [wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v2.fif)
* [wallet-v3.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v3.fif)
* [wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet.fif)
* [wallet-v3-code.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v3-code.fif)

## FunC libraries and helpers

* https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc
* https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/crypto/elliptic-curves
* https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/math
* https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/messages
* https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/slices
* https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/strings
* https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/tuples
* https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/utils
* https://github.com/disintar/sale-dapp/tree/master/func

## Add reference

If you want to share a new example smart contract, make your PR for this [page](https://github.com/ton-community/ton-docs/tree/main/docs/v3/documentation/smart-contracts/contracts-specs/examples.md).

## See also

* [Develop Smart Contracts Introduction](/v3/documentation/smart-contracts/overview)
* [How to work with wallet smart contracts](/v3/guidelines/smart-contracts/howto/wallet)
* [[You Tube] Ton Dev Study FunC & BluePrint lessons](https://www.youtube.com/watch?v=7omBDfSqGfA&list=PLtUBO1QNEKwtO_zSyLj-axPzc9O9rkmYa)


<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/contracts-specs/governance.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/contracts-specs/governance.md
================================================
import Feedback from '@site/src/components/Feedback';

# Governance contracts

In TON, a set of special smart contracts controls consensus parameters for node operation - including TVM, catchain, fees, and chain topology - and how these parameters are stored and updated. Unlike older blockchains that hardcode these parameters, TON enables transparent on-chain governance. The current governance contracts include the **Elector**, **Config**, and **DNS** contracts, with expansion plans (e.g., extra-currency **Minter**).

## Elector

The **Elector** smart contract manages validator elections, validation rounds, and reward distribution. To become a validator and interact with the Elector, follow the [validator instructions](https://ton.org/validator).

### Data storage

The Elector stores:

- Non-withdrawn Toncoin in the `credits` hashmap.
- New validator applications in the `elect` hashmap.
- Past election data in the `past_elections` hashmap (including complaints and `frozen` stakes held for `stake_held_for` periods, defined in **ConfigParam 15**).

### Key functions

1. **Process validator applications**
2. **Conduct elections**
3. **Handle validator misbehavior reports**
4. **Distribute validation rewards**

#### Processing applications

To apply, a validator must:

1. Send a message to the Elector with their ADNL address, public key, `max_factor`, and stake (TON amount).
2. The Elector validates the parameters and either registers the application or refunds the stake.  
   _Note:_ Only masterchain addresses can apply.

### Conducting elections

The Elector is a special smart contract that triggers **Tick and Tock transactions** (forced executions at the start and end of each block). It checks whether it’s time to conduct a new election during each block.

**Process details:**

- Take applications with stake ≥ `min_stake` (**ConfigParam 17**).
- Arrange candidates by stake in descending order.
- If applicants exceed `max_validators` (**ConfigParam 16**), discard the lowest-staked candidates.
- For each subset size `i` (from 1 to remaining candidates):
  - Assume the `i`-th candidate (lowest in the subset) defines the baseline.
  - Calculate effective stake (`true_stake`) for each `j`-th candidate (`j < i`) as:

```
min(stake[i] * max_factor[j], stake[j])
```

- Track the subset with the highest **total effective stake (TES)**.
- Submit the winning validator set to the **Config** contract.
- Return unused stakes and excess amounts (e.g., `stake[j] - min(stake[i] * max_factor[j], stake[j])`) to `credits`.

**Example breakdown**:

- **Case 1**: 9 candidates stake 100,000 TON (`max_factor=2.7`), 1 candidate stakes 10,000.

  - _Without the 10k candidate_: TES = 900,000.
  - _With the 10k candidate_: TES = 9 \* 27,000 + 10,000 = 253,000.
  - **Result**: 10k candidate is excluded.

- **Case 2**: 1 candidate stakes 100,000 (`max_factor=2.7`), 9 stake 10,000.
  - Effective stake for the 100k candidate: `10,000 * 2.7 = 27,000`.
  - Excess: `100,000 - 27,000 = 73,000` → sent to `credits`.
  - **Result**: All 10 participate.

**Election constraints**:

- `min_validators` ≤ participants ≤ `max_validators` (**ConfigParam 16**).
- Stakes must satisfy:
  - `min_stake` ≤ stake ≤ `max_stake`
  - `min_total_stake` ≤ total stake ≤ `max_total_stake`
  - Stake ratios ≤ `max_stake_factor` (**ConfigParam 17**).
- If conditions aren’t met, elections **postponed**.

### Process of reporting validator misbehavior

Each validator is periodically assigned the duty to create new blocks, with the frequency of assignments determined by their weight. After a validation round, anyone can audit the blocks to check whether the actual number of blocks produced by a validator significantly deviates from the expected number (based on their weight). A statistically significant underperformance (e.g., fewer blocks created than expected) constitutes misbehavior.

To report misbehavior, a user must:

1. Generate a **Merkle proof** demonstrating the validator's failure to produce the expected blocks.
2. Propose a fine proportional to the severity of the offense.
3. Submit the proof and fine proposal to the Elector contract, covering the associated storage costs.

The Elector registers the complaint in the `past_elections` hashmap. Current round validators then verify the complaint. If the proof is valid and the proposed fine aligns with the severity of the misbehavior, validators vote on the complaint. Approval requires agreement from over **two-thirds of the total validator weight** (not just a majority of participants).

The fine is deducted from the validator's `frozen` stake in the relevant `past_elections` record if approved. These funds stay locked for the period defined by **ConfigParam 15** (`stake_held_for`).

#### Distributing rewards

The Elector releases `frozen` stakes and rewards (gas fees + block rewards) proportionally to past validators. Funds move to `credits`, and the election record clears from `past_elections`.

### Current Elector state

Track live data (elections, stakes, complaints) via this [dapp](https://1ixi1.github.io/elector/).

## Config

The **Config** contract manages TON’s configuration parameters, validator set updates, and proposal voting.

### Validator set updates

1. The **Elector** notifies **Config** of a new validator set.
2. **Config** stores it in **ConfigParam 36** (_next validators_).
3. At the scheduled time (`utime_since`), **Config**:
   - Moves the old set to **ConfigParam 32** (_previous validators_).
   - Promotes **ConfigParam 36** to **ConfigParam 34** (_current validators_).

### Proposal/voting mechanism

1. **Submit a proposal**: Pay storage fees to propose parameter changes.
2. **Vote**: Validators (from **ConfigParam 34**) sign approval messages.
3. **Outcome**:
   - **Approved**: After `min_wins` rounds (**ConfigParam 11**) with ≥3/4 weighted votes.
   - **Rejected**: After `max_losses` rounds.
   - _Critical parameters_ (**ConfigParam 10**) require more rounds.

#### Emergency updates

- Reserved indexes (`-999`, `-1000`, `-1001`) allow urgent updates to **Config**/**Elector** code.
- A temporary emergency key (assigned to the TON Foundation in 2021) accelerated fixes but couldn't alter contracts.
- **Key retired** on Nov 22, 2023 (**block 34312810**), replaced with zeros.
- Later patched to a fixed byte sequence (`sha256("Not a valid curve point")`) to prevent exploits.

**Historical uses**:

- **Apr 2022**: Increased gas limits (**blocks 19880281/19880300**) to unblock elections.
- **Mar 2023**: Raised `special_gas_limit` to 25M (**block 27747086**) for election throughput.

## See also

- [Precompiled contracts](/v3/documentation/smart-contracts/contracts-specs/precompiled-contracts)

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/contracts-specs/highload-wallet.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/contracts-specs/highload-wallet.md
================================================
import Feedback from '@site/src/components/Feedback';

# Highload wallet contracts

When working with many messages in a short period, there is a need for special wallet called Highload wallet. Highload wallet v2 was the main wallet on TON for a long time, but you had to be very careful with it. Otherwise, you could [lock all funds](https://t.me/tonstatus/88). 

[With the advent of Highload Wallet V3](https://github.com/ton-blockchain/Highload-wallet-contract-v3), this problem has been solved at the contract architecture level and consumes less gas. This chapter will cover the basics of Highload Wallet V3 and important nuances to remember.

## Highload wallet v3

This wallet is made for who need to send transactions at very high rates. For example, crypto exchanges.

- [Source code](https://github.com/ton-blockchain/Highload-wallet-contract-v3)

Any given external message (transfer request) to a Highload v3 contains:
- a signature (512 bits) in the top level cell - the other parameters are in the ref of that cell
- subwallet ID (32 bits)
- message to send as a ref (the serialized internal message that will be sent)
- send mode for the message (8 bits)
- composite query ID - 13 bits of "shift" and 10 bits of "bit number", however the 10 bits of bit number can only go up to 1022, not 1023, and also the last such usable query ID (8388605) is reserved for emergencies and should not be normally used
- created at, or message timestamp
- timeout

Timeout is stored in Highload as a parameter and is checked against the timeout in all requests - so the timeout for all requests is equal. The message should be not older than timeout at the time of arrival to the Highload wallet, or in code it is required that `created_at > now() - timeout`. Query IDs are stored for the purposes of replay protection for at least timeout and possibly up to 2 * timeout, however one should not expect them to be stored for longer than timeout. Subwallet ID is checked against the one stored in the wallet. Inner ref's hash is checked along with the signature against the public key of the wallet.

Highload v3 can only send 1 message from any given external message, however it can send that message to itself with a special op code, allowing one to set any action cell on that internal message invocation, effectively making it possible to send up to 254 messages per 1 external message (possibly more if another message is sent to Highload wallet again among these 254).

Highload v3 will always store the query ID (replay protection) once all the checks pass, however a message may not be sent due to some conditions, including but not limited to:
- **containing state init** (such messages, if required, may be sent using the special op code to set the action cell after an internal message from Highload wallet to itself)
- not enough balance
- invalid message structure (that includes external out messages - only internal messages may be sent straight from the external message)

Highload v3 will never execute multiple externals containing the same `query_id` **and** `created_at` - by the time it forgets any given `query_id`, the `created_at` condition will prevent such a message from executing. This effectively makes `query_id` **and** `created_at` together the "primary key" of a transfer request for Highload v3.

When iterating (incrementing) query ID, it is cheaper (in terms of TON spent on fees) to iterate through bit number first, and then the shift, like when incrementing a regular number. After you've reached the last query ID (remember about the emergency query ID - see above), you can reset query ID to 0, but if Highload's timeout period has not passed yet, then the replay protection dictionary will be full and you will have to wait for the timeout period to pass.


## Highload wallet v2

:::danger
Legacy contract, it is suggest to use Highload wallet v3.
:::

This wallet is made for those who need to send hundreds of transactions in a short period of time. For example, crypto exchanges.

It allows you to send up to `254` transactions in one smart contract call. It also uses a slightly different approach to solve replay attacks instead of seqno, so you can call this wallet several times at once to send even thousands of transactions in a second.

:::caution Limitations
Note, when dealing with Highload wallet the following limits need to be checked and taken into account.
:::

1. **Storage size limit.** Currently, size of contract storage should be less than 65535 cells. If size of
old_queries will grow above this limit, exception in ActionPhase will be thrown and transaction will fail.
Failed transaction may be replayed.
2. **Gas limit.** Currently, gas limit is 1'000'000 GAS units, that means that there is a limit of how much
old queries may be cleaned in one tx. If number of expired queries will be higher, contract will stuck.

That means that it is not recommended to set too high expiration date:
the number of queries during expiration time span should not exceed 1000.

Also, the number of expired queries cleaned in one transaction should be below 100.

## How to

You can also read [Highload wallet tutorials](/v3/guidelines/smart-contracts/howto/wallet#-high-load-wallet-v3) article.

Wallet source code:
 * [ton/crypto/smartcont/Highload-wallet-v2-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet-v2.fif)

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/contracts-specs/nominator-pool.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/contracts-specs/nominator-pool.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# Nominator pool

A Nominator Pool is a smart contract that allows one or more nominators to lend Toncoin for validator staking. It ensures validator funds are used exclusively for validation and guarantees proper reward distribution.

## Architecture

![image](/img/nominator-pool/nominator-pool.png)

## Limits

The pool is designed for large amounts of coins, prioritizing security and code simplicity. It doesn't support small deposits or a large number of nominators. The target configuration is:

- Minimum nominator stake: 10,000 TON
- Maximum nominators per pool: 40 (untested beyond this limit)

## Fees

In the TON blockchain, the validator cycle is approximately 18 hours, and there are roughly 40.5 validation rounds per month (assuming a 30-day month).

Here's the breakdown of costs based on participation:

- **Participating in only odd or even cycles (half of the rounds):**

  - Rounds per month: ~20.25
  - Cost per round: ~5 Toncoins
  - `total cost = 20.25 * 5 -> ~101.25 Toncoins`

- **Participating in both odd and even cycles (all rounds):**
  - Rounds per month: ~40.5
  - Cost per round : ~ 5 Toncoins
  - `total cost = 40.5 * 5 -> ~202.50 Toncoins`

## Reward distribution

After each validation round, the pool recovers its stake plus rewards from the elector contract. Rewards are split as follows:

```
validator_reward = (reward * validator_reward_share) / 10000
nominators_reward = reward - validator_reward
```

Nominators receive shares proportional to their stakes. For example, if two nominators are in the pool with stakes of 100k and 300k TON, the first one will take 25% and the second 75% of the `nominators_reward`.

### Slashing

For validation fines:

1. Deduct from validator funds first
2. If insufficient, deduct from nominators proportionally
3. Pool design ensures validator funds always cover the maximum possible fines

## Validator requirements

The pool participates in validation only when:

- Validator funds exceed `min_validator_stake`
- Validator funds cover maximum possible fines (based on network config)

## Nominator's messages

To interact with the nominator pool, nominators send simple messages with a text comment (from any wallet application) to the pool smart contract.
All messages must be sent in **bounceable mode** to prevent fund loss from errors.

### Deposit

Send a message with the comment "d" and amount ≥ `min_nominator_stake + 1 TON`.

Deposits:

- Credit immediately if pool inactive (`state == 0`)
- Queue as `pending_deposit_amount` if pool active
- Reject if `max_nominators_count` reached

### Withdrawal

Send a message with the comment "w" and 1 TON for fees:

- Executes immediately if funds are available
- Queues as `withdraw_request` otherwise
- Full withdrawal only (no partial withdrawals)

## Validator withdraw

The validator can withdraw from the pool all the Toncoins that do not belong to the nominators.

## Key management

Participants must safeguard private keys:

- Lost nominator wallet = lost pool funds
- Lost validator wallet = lost validator funds

:::info
Losing one participant's private key does not impact other participants in the pool.
:::

## Emergency operations

If the validator becomes inactive, any party can send operational messages such as `process withdraw requests`, `update current validator set`, `new_stake`, and `recover_stake` to enable nominator withdrawals. The validator software `mytonctrl` does this automatically.

## Voting for network config proposals

The pool implements weighted voting for network config proposals:

1. Proposals announced via [@tonblockchain](https://t.me/tonblockchain) or [@tonstatus](https://t.me/tonstatus) with HEX hashes like `D855FFBCF813E50E10BEAB902D1177529CE79785CAE913EB96A72AE8EFBCBF47`
2. Nominators vote by sending a message to the nominator pool:
   - `y<HASH>` to support
   - `n<HASH>` to oppose
     > Please attach a small amount of tokens (minimum 1 TON) to this message to cover the network fee. Any unspent TON will be automatically returned to your wallet.
3. Validator submits final vote based on pool consensus
4. Votes expire after 30 days

## Get methods

#### Get-method get_pool_data

Returns complete pool state information as a tuple containing:

1. `state` (uint)  
   Current operational state:  
    `0` = Not validating  
    `1` = Stake request sent  
    `2` = Validation confirmed

2. `nominators_count` (uint)  
   Active nominators count

3. `stake_amount_sent` (nanotons)  
   The current validation stake amount

4. `validator_amount` (nanotons)  
   Validator's owned funds

5. `validator_address` (uint, immutable)  
   Validator wallet address. Convert with `"-1:" + dec_to_hex(validator_address)`.

6. `validator_reward_share` (uint, immutable)  
   Validator's reward percentage. For example 4000 = 40%

```
validator_reward = (reward * validator_reward_share) / 10000
```

7. `max_nominators_count` (uint, immutable)  
   Maximum allowed nominators, typically 40

8. `min_validator_stake` (nanotons, immutable)  
   Minimum validator stake requirement

9. `min_nominator_stake` (nanotons, immutable)  
   Minimum nominator deposit

10. `nominators` (Cell)  
    Raw dictionary of active nominators

11. `withdraw_requests` (Cell)  
    Raw dictionary of pending withdrawals

12. `stake_at` (uint)  
    Next validation round ID, which is supposed to start at [`utime_since`](/v3/documentation/network/configs/blockchain-configs#configuration-parameters-4)

13. `saved_validator_set_hash` (uint)  
    Technical validator info

14. `validator_set_changes_count` (uint)  
    Technical validator info

15. `validator_set_change_time` (uint)  
    Technical validator info

16. `stake_held_for` (uint)  
    Stake lock duration

17. `config_proposal_votings` (Cell)  
    Raw dictionary of active proposal votes

#### Get-method list_nominators

Returns an array of all nominators with their:

1. `address` (uint)  
   BaseChain address. Convert with `"0:" + dec_to_hex(address)`.
2. `amount` (nanotons)  
   Active stake balance
3. `pending_deposit_amount` (nanotons)  
   Queued deposit amount
4. `withdraw_request` (int)  
   `-1` indicates active withdrawal request

#### Get-method get_nominator_data

Returns detailed nominator information for the specified address.

> Address must be in raw format without the `0:` prefix.

1. `amount` (nanotons) - Active stake
2. `pending_deposit_amount` (nanotons) - Queued deposit
3. `withdraw_request` (int) - Withdrawal flag (`-1` if active)

Throws an `86` error if there is no such nominator in the pool.

**Example**:  
For nominator `EQA0i8-CdGnF_DhUHHf92R1ONH6sIA9vLZ_WLcCIhfBBXwtG`:

```bash
get_nominator_data 0x348bcf827469c5fc38541c77fdd91d4e347eac200f6f2d9fd62dc08885f0415f
```

### Voting Methods

#### Get-method list_votes

Returns all active proposals with the following:

1. `proposal_hash` (uint) - Convert with `dec_to_hex()`
2. `votes_create_time` (uint) - Unix timestamp

#### Get-method list_voters

Returns voting details per proposal:

1. `address` (uint)
   - Nominator: `"0:" + dec_to_hex(address)`
   - Validator: `"-1:" + dec_to_hex(address)`
2. `support` (int)
   - `-1` = For
   - `0` = Against
3. `vote_time` (uint) - Unix timestamp

**Note**: Voting results calculated off-chain

## Integration into wallet applications

For deposits, withdrawals, and votes, send simple messages to the pool with the desired text comments as described above. When sending a deposit, you can store the amount in the local storage. When sending a re-deposit, add it to this amount, too.

Call the get method `get_nominator_data(your_address)` and calculate profit as:

```python
current_profit = (amount + pending_deposit_amount) - sent_amount_stored_in_local_storage
```

To obtain the pool's complete state, you need to query both `get_pool_data` and `list_nominators`.

## See also

- [Nominator pool contract](https://github.com/ton-blockchain/nominator-pool)
- [Usage guide](/v3/guidelines/smart-contracts/howto/nominator-pool)

<Feedback />



================================================
FILE: docs/v3/documentation/smart-contracts/contracts-specs/precompiled-contracts.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/contracts-specs/precompiled-contracts.md
================================================
import Feedback from '@site/src/components/Feedback';

# Precompiled contracts

A _precompiled smart contract_ is a contract with a C++ implementation in the node. When a validator processes a transaction for such a contract, it can execute this native implementation instead of TVM. This improves performance and reduces computation fees.

## Config

The list of precompiled contracts is stored in the masterchain configuration:

```
precompiled_smc#b0 gas_usage:uint64 = PrecompiledSmc;
precompiled_contracts_config#c0 list:(HashmapE 256 PrecompiledSmc) = PrecompiledContractsConfig;
_ PrecompiledContractsConfig = ConfigParam 45;
```

The `list:(HashmapE 256 PrecompiledSmc)` represents a mapping of `(code_hash -> precompiled_smc)`. A contract is considered _precompiled_ if its code hash exists in this map.

## Contract execution

Transactions for precompiled smart contracts (those with code hashes in `ConfigParam 45`) follow this execution flow:

1. Retrieve the `gas_usage` value from the masterchain config
2. If the contract balance cannot cover the `gas_usage` cost, the compute phase fails with `cskip_no_gas`
3. Execution proceeds via one of two paths:
   - **TVM execution**: Used if precompiled execution is disabled or the C++ implementation is unavailable in the node version. TVM runs with a 1M gas limit.
   - **Native execution**: Used when precompiled implementation is both enabled and available, executing the C++ code directly
4. Compute phase values are overridden:
   - `gas_used` set to `gas_usage`
   - `vm_steps`, `vm_init_state_hash`, and `vm_final_state_hash` set to zero
5. Computation fees are calculated based on `gas_usage` rather than actual TVM gas consumption

For precompiled contracts executed in TVM, the 17th element of `c7` contains the `gas_usage` value (accessible via `GETPRECOMPILEDGAS`). Non-precompiled contracts return `null` for this value.

**Note**: Enable precompiled contract execution by running `validator-engine` with the `--enable-precompiled-smc` flag. Both execution methods produce identical transactions, allowing validators with and without C++ implementations to coexist in the network. This enables gradual adoption when adding new entries to `ConfigParam 45`.

## Available implementations

Hic sunt dracones.

## See also

- [Governance contracts](/v3/documentation/smart-contracts/contracts-specs/governance)

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool.md
================================================
import Feedback from '@site/src/components/Feedback';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Single nominator pool

The [single nominator](https://github.com/ton-blockchain/single-nominator) contract is a security-focused smart contract that lets validators securely stake Toncoins without needing other participants. Designed for validators with sufficient self-stake, it keeps signing keys separate from staked funds using a cold wallet for maximum security. The contract provides an alternative simplified implementation for the [nominator pool](/v3/documentation/smart-contracts/contracts-specs/nominator-pool) smart contract that supports a single nominator only. The benefit of this implementation is that it's more secure since the attack surface is considerably smaller. This is due to a massive reduction in the complexity of the nominator pool that has to support multiple third-party nominators.

## The go-to solution for validators

This smart contract is the recommended solution for TON validators with a sufficient stake to validate independently. Other options include:

1. **Hot wallet**  
   [Standard wallet implementation](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc)  
   *Risk*: Vulnerable to theft if the validator node is compromised

2. **Restricted wallet**  
   [Legacy implementation](https://github.com/EmelyanenkoK/nomination-contract/blob/master/restricted-wallet/wallet.fc)  
   *Issues*: Unmaintained and susceptible to gas drainage attacks

3. **Nominator pool**  
   [Single-nominator setup](https://github.com/ton-blockchain/nominator-pool)  
   *Drawback*: Unnecessary complexity for solo validators

For a complete feature comparison, see:  
[Comparison of existing alternatives](#comparison-of-existing-alternatives)


## Official code hash

Check this in https://verifier.ton.org before sending funds to a live contract.

Single nominator v1.0

```
pCrmnqx2/+DkUtPU8T04ehTkbAGlqtul/B2JPmxx9bo=
```

Single nominator v1.1 (with withdrawals by comment)

```
zA05WJ6ywM/g/eKEVmV6O909lTlVrj+Y8lZkqzyQT70=
```

## Architecture

The architecture is nearly identical to the [nominator pool](https://github.com/ton-blockchain/nominator-pool) contract:

![image](/img/nominator-pool/single-nominator-architecture.png)

### Separation to two roles

- _Owner_ - cold wallet (private key that is not connected to the Internet) that owns the funds used for staking and acts as the single nominator
- _Validator_ - the wallet whose private key is on the validator node (can sign blocks but can't steal the funds used for stake)

### Workflow

1. _Owner_ holds the funds for staking ($$$) in their secure cold wallet
2. _Owner_ deposits the funds ($$$) in the _SingleNominator_ contract (this contract)
3. _MyTonCtrl_ starts running on the validator node connected to the Internet
4. _MyTonCtrl_ uses _Validator_ wallet to instruct _SingleNominator_ to enter the next election cycle
5. _SingleNominator_ sends the stake ($$$) to the _Elector_ for one cycle
6. The election cycle is over, and stake can be recovered
7. _MyTonCtrl_ uses _Validator_ wallet to instruct _SingleNominator_ to recover the stake from the election cycle
8. _SingleNominator_ recovers the stake ($$$) of the previous cycle from the _Elector_
9. Steps 4-8 repeat as long as _Owner_ is happy to keep validating
10. _Owner_ withdraws the funds ($$$) from the _SingleNominator_ contract and takes them back home

## Mitigated attack vectors

- The validator node requires a hot wallet to sign new blocks. This wallet is inherently insecure because its private key is connected to the Internet. Even if this key is compromised, the _Validator_ cannot extract the funds used for validation. Only _Owner_ can withdraw these funds.

- Even if the _Validator_ wallet is compromised, _Owner_ can tell _SingleNominator_ to change the validator address. This will prevent the attacker from interacting with _SingleNominator_ further. There is no race condition here; _Owner_ will always take precedence.

- The _SingleNominator_ balance holds the principal staking funds only—its balance is not used for gas fees. Gas money for entering election cycles is held in the _Validator_ wallet. This prevents an attacker who compromised the validator from draining the principal via a gas spending attack.

- _SingleNominator_ verifies the format of all operations given by _Validator_ to ensure it doesn't forward invalid messages to the _Elector_.

- In an emergency, for example, if the _Elector_ contract was upgraded and changed its interface, _Owner_ can still send any raw message as _SingleNominator_ to recover the stake from _Elector_.

- In an extreme emergency, _Owner_ can set the code of _SingleNominator_ and override its current logic to address unforeseen circumstances.

The standard [nominator pool](https://github.com/ton-blockchain/nominator-pool) can't prevent all attack scenarios - a malicious validator operator could potentially steal from nominators. This risk doesn't exist with _SingleNominator_ since both the _Owner_ and _Validator_  are controlled by the same entity.

### Security audits

Certik conducted a full security audit, which is available in this repo: [Certik audit](https://github.com/ton-blockchain/single-nominator/blob/main/certik-audit.pdf).

## Comparison of existing alternatives

Assuming that you are a validator with enough stake to validate independently, these are the alternative setups you can use with MyTonCtrl:

### 1. Simple hot wallet

This basic setup connects MyTonCtrl directly to the [standard wallet](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc) holding your funds. Because this wallet remains internet-connected, it operates as a hot wallet.

![image](/img/nominator-pool/hot-wallet.png)

This is insecure because an attacker can get the private key as soon as it's connected to the Internet. With the private key, the attacker can send the staking funds to anyone.

### 2. Restricted wallet

This setup replaces the standard wallet with a [restricted-wallet](https://github.com/EmelyanenkoK/nomination-contract/blob/master/restricted-wallet/wallet.fc) that allows outgoing transactions to be sent only to restricted destinations such as the _Elector_ and the owner's address.

![image](/img/nominator-pool/restricted-wallet.png)

The restricted wallet is unmaintained (replaced by nominator-pool) and has unresolved attack vectors like gas drainage attacks. Since the same wallet holds gas fees and the stake principal in the same balance, an attacker who compromises the private key can generate transactions that will cause significant principal losses. In addition, there's a race condition between the attacker and the owner when trying to withdraw due to seqno collisions.

### 3. Nominator pool

The [nominator-pool](https://github.com/ton-blockchain/nominator-pool) was the first to introduce a clear separation between the stake owners (nominators) and the validator connected to the Internet. This setup supports up to 40 nominators staking together on the same validator.

![image](/img/nominator-pool/nominator-pool.png)

The nominator pool contract is overly complex due to the support of 40 concurrent nominators. In addition, the contract has to protect the nominators from the contract deployer because those are separate entities. This setup is considered ok but is very difficult to audit in full due to the size of the attack surface. The solution makes sense mostly when the validator does not have enough stake to validate alone or wants to do a rev-share with third-party stakeholders.

### 4. Single nominator

This is the setup implemented in this repo. It's a very simplified version of the nominator pool that supports a single nominator. There is no need to protect this nominator from the contract deployer, as they are the same entity.

![image](/img/nominator-pool/single-nominator-architecture.png)

If you have a single nominator who holds all stakes for validation, this is the most secure setup you can use. In addition to its simplicity, this contract provides the owner multiple emergency safeguards to recover stakes even in extreme scenarios like _Elector_ upgrades that break the recover stake interface.

## Owner only messages

The nominator owner can perform 4 operations:

#### 1. Withdraw
Used to withdraw funds to the owner's wallet. To withdraw the funds the owner should send a message with a body that includes: opcode=0x1000 (32 bits), query_id (64 bits) and withdraw amount (stored as coin variable). The nominator contract will send the funds with BOUNCEABLE flag and mode=64. <br/><br/>
In case the owner is using a **hot wallet** (not recommended), [withdraw-deeplink.ts](https://github.com/ton-blockchain/single-nominator/blob/main/scripts/ts/withdraw-deeplink.ts) can be used to generate a deeplink to initiate a withdrawal from tonkeeper wallet. <br/>

Command line: `ts-node scripts/ts/withdraw-deeplink.ts single-nominator-addr withdraw-amount` where:

- single-nominator-addr is the single nominator address the owner wishes to withdraw from.
- withdraw-amount is the amount to withdraw. The nominator contract will leave 1 TON in the contract, so the amount sent to the owner's address will be the minimum between the requested amount and the contract balance - 1.

The owner should run the deeplink from a phone with the tonkeeper wallet.

If the owner is using a **cold wallet** (recommended), [withdraw.fif](https://github.com/ton-blockchain/single-nominator/blob/main/scripts/fift/withdraw.fif) can be used to generate a boc body that includes the withdraw opcode and the amount to withdraw.

Command line: `fift -s scripts/fif/withdraw.fif withdraw-amount` where withdraw-amount is the amount to withdraw from the nominator contract to the owner's wallet. As described above, the nominator contract will leave at least 1 TON in the contract.

This script will generate a boc body (named withdraw.boc) that should be signed and sent from the owner's wallet.

From the black computer, the owner should run the following:

- create and sign the tx: `fift -s wallet-v3.fif my-wallet single_nominator_address sub_wallet_id seqno amount -B withdraw.boc` where my-wallet is the owner's pk file (without extension). The amount of 1 TON should be enough to pay fees (the remaining amount will be returned to the owner). The withdraw.boc is the boc generated above.
- from a computer with access to the internet, run: `lite-client -C global.config.json -c 'sendfile wallet-query.boc'` to send the boc file (wallet-query.boc) generated in the previous step.

### 2. Change validator

Used to change the validator address. The validator can only send NEW_STAKE and RECOVER_STAKE to the elector. If the validator's private key is compromised, the validator's address can be changed. The funds are safe in this case, as only the owner can withdraw them.

In case the owner is using a **hot wallet** (not recommended), [change-validator-deeplink.ts](https://github.com/ton-blockchain/single-nominator/blob/main/scripts/ts/change-validator-deeplink.ts) can be used to generate a deeplink to change the validator address.

Command line: `ts-node scripts/ts/change-validator-deeplink.ts single-nominator-addr new-validator-address` where:

- single-nominator-addr is the single nominator address.
- new-validator-address (defaults to ZERO address) is the address of the new validator. If you want to disable the validator immediately and only later set a new validator, it might be convenient to set the validator address to the ZERO address.

The owner should run the deeplink from a phone with a tonkeeper wallet.

If the owner is using a **cold wallet** (recommended), [change-validator.fif](https://github.com/ton-blockchain/single-nominator/blob/main/scripts/fift/change-validator.fif) can be used to generate a boc body that includes the change-validator opcode and the new validator address.

Command line: `fift -s scripts/fif/change-validator.fif new-validator-address`.
This script will generate a boc body (change-validator.boc) that should be signed and sent from the owner's wallet.

From the black computer, the owner should run the following:

- create and sign the tx: `fift -s wallet-v3.fif my-wallet single_nominator_address sub_wallet_id seqno amount -B change-validator.boc` where my-wallet is the owner's pk file (without extension). The amount of 1 TON should be enough to pay fees (the remaining amount will be returned to the owner). The change-validator.boc is the boc generated above.
- from a computer with access to the internet, run: `lite-client -C global.config.json -c 'sendfile wallet-query.boc'` to send the boc file (wallet-query.boc) generated in the previous step.

### 3. Send raw msg

This opcode is not expected to be used under normal conditions.

It can be used to send **any** message from the nominator contract (it must be signed and sent from the owner's wallet).

Use this opcode to recover funds from a changed Elector contract address where standard RECOVER_STAKE fails. The owner must construct a custom message containing the following:
- `opcode=0x7702` (32 bits)
- `query_id` (64 bits)
- `mode` (8 bits)
- The raw message cell reference

### 4. Upgrade

This emergency opcode (0x9903) should only be used to upgrade the nominator contract in critical situations. The message must include:
- `opcode=0x9903` (32 bits)
- `query_id` (64 bits)
- New contract code cell reference

## See also

- [Single nominator pool](https://github.com/ton-blockchain/single-nominator)
- [How to use single nominator pool](/v3/guidelines/smart-contracts/howto/single-nominator-pool)
- [Orbs single nominator pool contract(legacy)](https://github.com/orbs-network/single-nominator)

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/contracts-specs/vesting-contract.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/contracts-specs/vesting-contract.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# Vesting contract

The vesting contract is a smart contract implementation on the TON blockchain, enabling secure, scheduled distribution of Toncoin assets. This contract provides a robust framework for token management, ensuring the controlled release of funds based on predetermined schedules and conditions.

## Core functionality

The contract is a secure escrow service that locks a specified amount of Toncoin for a defined period and gradually releases it according to configurable parameters. This mechanism ensures predictable token distribution while maintaining strict control over asset release schedules.

## Contract parameters

During deployment, the system establishes the following parameters, which cannot be changed and remain fixed throughout the entire duration of the contract:

| Parameter                | Description                                     | Example values       |
| ------------------------ | ----------------------------------------------- | -------------------- |
| `vesting_total_amount`   | Total locked Toncoins (in nanotons)             | 500 TON              |
| `vesting_start_time`     | Unix timestamp marking vesting period beginning | Current time + delay |
| `vesting_total_duration` | Total vesting period duration (seconds)         | 31104000 (one year)  |
| `unlock_period`          | Time interval between releases (seconds)        | 2592000 (monthly)    |
| `cliff_duration`         | Initial lock period before first release        | 5184000 (two months) |
| `vesting_sender_address` | Authorized address for locked funds management  | Configurable         |
| `owner_address`          | Beneficiary address for Toncoin distribution    | Configurable         |

You can acquire these specific parameters using the `get_vesting_data()` method.

The parameters must satisfy these conditions:

```
vesting_total_duration > 0
vesting_total_duration <= 135 years (2^32 seconds)
unlock_period > 0
unlock_period <= vesting_total_duration
cliff_duration >= 0
cliff_duration < vesting_total_duration
vesting_total_duration mod unlock_period == 0
cliff_duration mod unlock_period == 0
```

Before sending Toncoins to the deployed smart contract, users can verify parameter compliance using the get method, even though the contract itself does not perform these checks.

## Lock mechanism

Before `vesting_start_time`, the contract locks the entire `vesting_total_amount`.

Starting at `vesting_start_time`, it unlocks the amount proportionately. For example, if the `vesting_total_duration` is 10 months, the `unlock_period` is 1 month, and the `vesting_total_amount` is 500 TON, then the contract unlocks 50 TON (500 \* 10/100) each month, fully releasing all 500 TON in 10 months.

If a cliff period exists, no amount unlocks during that time. Once the cliff period ends, the contract unlocking according to the same formula. For instance, with a `cliff_period` of 3 months, the contract unlocks nothing in the first 3 months, then unlocks 150 TON at once, followed by 50 TON each month thereafter.

You can use the `get_locked_amount(int at_time)` method to calculate how much will be locked at a specific time. The contract allows you to transfer locked Toncoins only to whitelisted addresses or the `vesting_sender_address`. Once unlocked, you can freely send the Toncoins wherever you like.

## Whitelist

A whitelist contains addresses to which you can send Toncoins, even if the coins remain locked.

The `get_whitelist()` method retrieves all whitelist addresses as a list of (wc, hash_part) tuples. You can use the `is_whitelisted(slice address)` method to check if a specific address is on the whitelist.

The `vesting_sender_address` can add new addresses to the whitelist at any time using the `op::add_whitelist` message, but no addresses can be removed from the whitelist. You can always send locked coins to the `vesting_sender_address` without adding it to the whitelist.

## Top-up

You can send Toncoins to the vesting contract from any address.

## Wallet smart contract

This [contract](https://github.com/ton-blockchain/vesting-contract/blob/2a63cb96942332abf92ed8425b37645fe4f41f86/contracts/vesting_wallet.fc#L366) is similar to the [standard wallet V3 smart contract](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc).

The contract maintains `seqno`, `subwallet_id`, and `public_key`, accepts external messages in the same format, and offers get-methods `seqno()`, `get_subwallet_id()`, and `get_public_key()`. Unlike standard wallets, this vesting contract restricts sending to one message at a time.

## Send

The public key owner can initiate the sending of Toncoins from the vesting contract by an external message, just like in standard wallets.

The owner initiates Toncoin transfers by sending an `op::send` internal message from their owner address. In typical usage, the same user owns both the public key and the `owner address`.

## Whitelist restrictions

The contract restricts messages sent to the `vesting_sender_address` by allowing only `send_mode == 3`.

Users typically add addresses to the whitelist to enable validation using locked coins or staking locked coins in pools.

Whitelisted addresses must adhere to these restrictions to prevent Toncoin theft:

- Only `send_mode == 3` is permitted
- Messages must be bounceable
- No `state_init` attachments are allowed

System elector addresses accept only these operations:

- `op::elector_new_stake`
- `op::elector_recover_stake`
- `op::vote_for_complaint`
- `op::vote_for_proposal`

System config addresses accept only:

- `op::vote_for_proposal`

Other whitelisted destinations permit:

- Empty messages and empty text messages
- Text messages starting with "d," "w," "D," or "W"
- Specific operations:
  - `op::single_nominator_pool_withdraw`
  - `op::single_nominator_pool_change_validator`
  - `op::ton_stakers_deposit`
  - `op::jetton_burn`
  - `op::ton_stakers_vote`
  - `op::vote_for_proposal`
  - `op::vote_for_complaint`

Addresses outside the whitelist operate without restrictions. Unlocked Toncoins remain unrestricted regardless of destination, including whitelisted addresses and `vesting_sender_address`.

## Project structure

- `contracts` - source code of all the smart contracts of the project and their dependencies.
- `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
- `tests` - tests for the contracts.
- `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

```bash
npx blueprint build` or `yarn blueprint build`
```

### Test

```bash
npx blueprint test` or `yarn blueprint test`
```

### Deploy or run another script

```bash
npx blueprint run` or `yarn blueprint run`
```

### Add a new contract

```bash
npx blueprint create ContractName` or `yarn blueprint create ContractName`
```

## See also

- [Single nominator](/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool)
- [vesting-contract](https://github.com/ton-blockchain/vesting-contract)

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/contracts-specs/wallet-contracts.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/contracts-specs/wallet-contracts.md
================================================
import Feedback from '@site/src/components/Feedback';

import ConceptImage from '@site/src/components/conceptImage';
import ThemedImage from '@theme/ThemedImage';

# Wallet contracts

You may have heard about different versions of wallets on TON Blockchain. But what do these versions actually mean, and how do they differ?

In this article, we’ll explore the various versions and modifications of TON wallets.

:::info
Before we start, there are some terms and concepts that you should be familiar with to fully understand the article:

- [Message management](/v3/documentation/smart-contracts/message-management/messages-and-transactions), because this is the main functionality of the wallets.
- [FunC language](/v3/documentation/smart-contracts/func/overview), because we will heavily rely on implementations made using it.
  :::

## Common concept

To break the tension, we should first understand that wallets are not a specific entity in the TON ecosystem. They are still just smart contracts consisting of code and data, and, in that sense, are equal to any other actor (i.e., smart contract) in TON.

Like your own custom smart contract, or any other one, wallets can receive external and internal messages, send internal messages and logs, and provide `get methods`.
So the question is: what functionality do they provide and how it differs between versions?

You can consider each wallet version as a smart-contract implementation providing a standard external interface, allowing different external clients to interact with the wallets in the same way. You can find these implementations in FunC and Fift languages in the main TON monorepo:

- [ton/crypto/smartcont/](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/)

## Basic wallets

### Wallet contracts hashes

Here, you can find the current hashes of the wallet contract code versions.  
For detailed specifications of each wallet contract, please refer to the page.
For detailed specifications of each wallet contract, please refer further down the page or check the [ContractSources.md](https://github.com/toncenter/tonweb/blob/update_contracts/src/contract/ContractSources.md).

<details>
  <summary> Show wallet contracts hashes table </summary>

| Contract version         | Hash                                     |
|--------------------------|------------------------------------------|
| [walletv1r1](#wallet-v1) | `oM/CxIruFqJx8s/AtzgtgXVs7LEBfQd/qqs7tgL2how=` |
| [walletv1r2](#wallet-v1) | `1JAvzJ+tdGmPqONTIgpo2g3PcuMryy657gQhfBfTBiw=` |
| [walletv1r3](#wallet-v1) | `WHzHie/xyE9G7DeX5F/ICaFP9a4k8eDHpqmcydyQYf8=` |
| [walletv2r1](#wallet-v2) | `XJpeaMEI4YchoHxC+ZVr+zmtd+xtYktgxXbsiO7mUyk=` |
| [walletv2r2](#wallet-v2) | `/pUw0yQ4Uwg+8u8LTCkIwKv2+hwx6iQ6rKpb+MfXU/E=` |
| [walletv3r1](#wallet-v3) | `thBBpYp5gLlG6PueGY48kE0keZ/6NldOpCUcQaVm9YE=` |
| [walletv3r2](#wallet-v3) | `hNr6RJ+Ypph3ibojI1gHK8D3bcRSQAKl0JGLmnXS1Zk=` |
| [walletv4r1](#wallet-v4) | `ZN1UgFUixb6KnbWc6gEFzPDQh4bKeb64y3nogKjXMi0=` |
| [walletv4r2](#wallet-v4) | `/rX/aCDi/w2Ug+fg1iyBfYRniftK5YDIeIZtlZ2r1cA=` |
| [walletv5r1](#wallet-v5) | `IINLe3KxEhR+Gy+0V7hOdNGjDwT3N9T2KmaOlVLSty8=` |

</details>

**Note:** These hashes can also be found in the explorers.

### Wallet V1 {#wallet-v1}

This is the simplest one. It only allows you to send four transactions at a time and doesn't check anything besides your signature and seqno.

Wallet source code:

- [ton/crypto/smartcont/wallet-code.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet.fif)

This version isn’t even used in regular apps because it has some major issues:

- No easy way to retrieve the seqno and public key from the contract.
- No `valid_until` check, so you can't be sure that the transaction won't be confirmed too late.

The first issue was fixed in `V1R2` and `V1R3`. The `R` stands for **revision**. Usually, revisions are just small updates that only add get methods; you can find all of those in the changes history of `new-wallet.fif`. Hereinafter, we will consider only the latest revisions.

Nevertheless, because each subsequent version inherits the functionality of the previous one, we should still stick to it, as this will help us with later versions.

#### Official code hashes

| Contract version | Hash                                     |
|------------------|------------------------------------------|
| walletv1r1       | `oM/CxIruFqJx8s/AtzgtgXVs7LEBfQd/qqs7tgL2how=` |
| walletv1r2       | `1JAvzJ+tdGmPqONTIgpo2g3PcuMryy657gQhfBfTBiw=` |
| walletv1r3       | `WHzHie/xyE9G7DeX5F/ICaFP9a4k8eDHpqmcydyQYf8=` |


#### Persistent memory layout

- <b>seqno</b>: 32-bit long sequence number.
- <b>public-key</b>: 256-bit long public key.

#### External message body layout

1. Data:
   - <b>signature</b>: 512-bit long ed25519 signature.
   - <b>msg-seqno</b>: 32-bit long sequence number.
   - <b>(0-4)mode</b>: up to four 8-bit long integer's defining sending mode for each message.
2. Up to 4 references to cells containing messages.

As you can see, the main functionality of the wallet is to provide a safe way to communicate with the TON blockchain from the outside world. The `seqno` mechanism protects against replay attacks, and the `Ed25519 signature` provides authorized access to wallet functionality. We will not dwell in detail on each of these mechanisms, as they are described in detail in the [external message](/v3/documentation/smart-contracts/message-management/external-messages) documentation page and are quite common among smart contracts receiving external messages. The payload data consists of up to 4 references to cells and the corresponding number of modes, which will be directly transferred to the [send_raw_message(cell msg, int mode)](/v3/documentation/smart-contracts/func/docs/stdlib#send_raw_message) method.

:::caution
Note that the wallet doesn't provide any validation for internal messages you send through it. It is the programmer's (i.e., the external client’s) responsibility to serialize the data according to the [internal message layout](/v3/documentation/smart-contracts/message-management/sending-messages#message-layout).
:::

#### Exit codes

| Exit code | Description                                    |
| --------- | ---------------------------------------------- |
| 0x21      | `seqno` check failed, reply protection accured |
| 0x22      | `Ed25519 signature` check failed               |
| 0x0       | Standard successful execution exit code.       |

:::info
Note that [TVM](/v3/documentation/tvm/tvm-overview) has [standart exit codes](/v3/documentation/tvm/tvm-exit-codes) (`0x0` - is one of them), so you can get one of them too, if you run out of [gas](/v3/documentation/smart-contracts/transaction-fees/fees), for example, you will get `0xD` code.
:::

#### Get methods

1. int seqno() returns current stored seqno.
2. int get_public_key returns current stored public key.


### Wallet V2 {#wallet-v2}

Wallet source code:

- [ton/crypto/smartcont/wallet-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-code.fc)

This version introduces the `valid_until` parameter, which is used to set a time limit for a transaction in case you don't want it to be confirmed too late. This version also does not have the get-method for the public key, which was added in `V2R2`.

All differences compared to the previous version are a consequence of adding the `valid_until` functionality. A new exit code was added: `0x23`, marking the failure of the valid_until check. Additionally, a new UNIX-time field has been added to the external message body layout, setting the time limit for the transaction. All get methods remain the same.

#### Official code hashes

| Contract version      | Hash                                     |
|-----------------------|------------------------------------------|
| walletv2r1 | `XJpeaMEI4YchoHxC+ZVr+zmtd+xtYktgxXbsiO7mUyk=` |
| walletv2r2 | `/pUw0yQ4Uwg+8u8LTCkIwKv2+hwx6iQ6rKpb+MfXU/E=` |

#### External message body layout

1. Data:
   - <b>signature</b>: 512-bit long ed25519 signature.
   - <b>msg-seqno</b>: 32-bit long sequence number.
   - <b>valid-until</b>: 32-bit long Unix-time integer.
   - <b>(0-4)mode</b>: up to four 8-bit long integer's defining sending mode for each message.
2. Up to 4 references to cells containing messages.


### Wallet V3 {#wallet-v3}

This version introduces the `subwallet_id` parameter, which allows you to create multiple wallets using the same public key (so you can have only one seed phrase and multiple wallets). As before, `V3R2` only adds the get-method for the public key.

Wallet source code:

- [ton/crypto/smartcont/wallet3-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc)

Essentially, `subwallet_id` is just a number added to the contract state when it’s deployed. Since the contract address in TON is a hash of its state and code, the wallet address will change with a different `subwallet_id`. This version is the most widely used right now. It covers most use cases and remains clean, simple, and mostly the same as previous versions. All get methods remain the same.


#### Official code hashes

| Contract version       | Hash                                     |
|------------------------|------------------------------------------|
| walletv3r1 | `thBBpYp5gLlG6PueGY48kE0keZ/6NldOpCUcQaVm9YE=` |
| walletv3r2 | `hNr6RJ+Ypph3ibojI1gHK8D3bcRSQAKl0JGLmnXS1Zk=` |


#### Persistent memory layout

- <b>seqno</b>: 32-bit sequence number.
- <b>subwallet</b>: 32-bit subwallet ID.
- <b>public-key</b>: 256-bit public key.

#### External message layout

1. Data:
   - <b>signature</b>: 512-bit ed25519 signature.
   - <b>subwallet-id</b>: 32-bit subwallet ID.
   - <b>msg-seqno</b>: 32-bit sequence number.
   - <b>valid-until</b>: 32-bit UNIX time integer.
   - <b>(0-4)mode</b>: Up to four 8-bit integers defining the sending mode for each message.
2. Up to 4 references to cells containing messages.

#### Exit codes

| Exit code | Description                                                             |
|-----------| ----------------------------------------------------------------------- |
| 0x23      | `valid_until` check failed; transaction confirmation attempted too late |
| 0x23      | `Ed25519 signature` check failed                                        |
| 0x21      | `seqno` check failed; reply protection triggered                        |
| 0x22      | `subwallet-id` does not match the stored one                            |
| 0x0       | Standard successful execution exit code.                                |


### Wallet V4 {#wallet-v4}

This version retains all the functionality of the previous versions but also introduces something very powerful: `plugins`.

Wallet source code:

- [ton-blockchain/wallet-contract](https://github.com/ton-blockchain/wallet-contract)

This feature allows developers to implement complex logic that works in tandem with a user's wallet. For example, a DApp may require a user to pay a small amount of coins every day to use certain features. In this case, the user would need to install the plugin on their wallet by signing a transaction. The plugin would then send coins to the destination address daily when requested by an external message.

#### Official code hashes

| Contract version       | Hash                                     |
|------------------------|------------------------------------------|
| walletv4r1 | `ZN1UgFUixb6KnbWc6gEFzPDQh4bKeb64y3nogKjXMi0=` |
| walletv4r2 | `/rX/aCDi/w2Ug+fg1iyBfYRniftK5YDIeIZtlZ2r1cA=` |
| walletv5r1 | `IINLe3KxEhR+Gy+0V7hOdNGjDwT3N9T2KmaOlVLSty8=` |


#### Plugins

Plugins are essentially other smart contracts on TON that developers are free to implement as they wish. In relation to the wallet, they are simply addresses of smart contracts stored in a [dictionary](/v3/documentation/smart-contracts/func/docs/dictionaries) in the wallet's persistent memory. These plugins are allowed to request funds and remove themselves from the "allowed list" by sending internal messages to the wallet.

#### Persistent memory layout

- <b>seqno</b>: 32-bit long sequence number.
- <b>subwallet-id</b>: 32-bit long subwallet-id.
- <b>public-key</b>: 256-bit long public key.
- <b>plugins</b>: dictionary containing plugins(may be empty)

#### Receiving internal messages

All previous versions of wallets had a straightforward implementation for receiving internal messages. They simply accepted incoming funds from any sender, ignoring the internal message body if present, or in other words, they had an empty recv_internal method. However, as mentioned earlier, the fourth version of the wallet introduces two additional available operations. Let's take a look at the internal message body layout:

- <b>op-code?</b>: 32-bit long operation code. This is an optional field; any message containing less than 32 bits in the message body, an incorrect op-code, or a sender address that isn't registered as a plugin will be considered as simple transfer, similar to previous wallet versions.
- <b>query-id</b>: 64-bit long integer. This field has no effect on the smart contract's behavior; it is used to track chains of messages between contracts.

1. op-code = 0x706c7567, request funds operation code.
   - <b>toncoins</b>: VARUINT16 amount of requested toncoins.
   - <b>extra_currencies</b>: Dictionary containing the amount of requested extra currencies (may be empty).
2. op-code = 0x64737472, request removal of plugin-sender from the "allowed list".

#### External message body layout

- <b>signature</b>: 512-bit long ed25519 signature.
- <b>subwallet-id</b>: 32-bit long subwallet ID.
- <b>valid-until</b>: 32-bit long Unix-time integer.
- <b>msg-seqno</b>: 32-bit long sequence integer.
- <b>op-code</b>: 32-bit long operation code.

1. op-code = 0x0, simple send.
   - <b>(0-4)mode</b>: up to four 8-bit long integer's defining sending mode for each message.
   - <b>(0-4)messages</b>:Up to four references to cells containing messages.
2. op-code = 0x1, deploy and install plugin.
   - <b>workchain</b>: 8-bit long integer.
   - <b>balance</b>: VARUINT16 toncoins amount of initial balance.
   - <b>state-init</b>: Cell reference containing plugin initial state.
   - <b>body</b>: Cell reference containing body.
3. op-code = 0x2/0x3, install plugin/remove plugin.
   - <b>wc_n_address</b>: 8-bit long workchain_id + 256-bit long plugin address.
   - <b>balance</b>: VARUINT16 toncoins amount of initial balance.
   - <b>query-id</b>: 64-bit long integer.

As you can see, the fourth version still provides standard functionality through the `0x0` op-code, similar to previous versions. The `0x2` and `0x3` operations allow manipulation of the plugins dictionary. Note that in the case of `0x2`, you need to deploy the plugin with that address yourself. In contrast, the `0x1` op-code also handles the deployment process with the state_init field.

:::tip
If `state_init` doesn't make much sense from its name, take a look at the following references:

- [addresses-in-ton-blockchain](/v3/documentation/smart-contracts/addresses#workchain-id-and-account-id)
- [send-a-deploy-message](/v3/documentation/smart-contracts/func/cookbook#how-to-send-a-deploy-message-with-stateinit-only-with-stateinit-and-body)
- [internal-message-layout](/v3/documentation/smart-contracts/message-management/sending-messages#message-layout)
  :::

#### Exit codes

| Exit code | Description                                                             |
|-----------| ----------------------------------------------------------------------- |
| 0x24      | `valid_until` check failed, transaction confirmation attempted too late |
| 0x23      | `Ed25519 signature` check failed                                        |
| 0x21      | `seqno` check failed, reply protection triggered                        |
| 0x22      | `subwallet-id` does not match the stored one                            |
| 0x27      | Plugins dictionary manipulation failed (0x1-0x3 recv_external op-codes) |
| 0x50      | Not enough funds for the funds request                                  |
| 0x0       | Standard successful execution exit code.                                |

#### Get methods

1. int seqno() returns current stored seqno.
2. int get_public_key() returns current stored public key.
3. int get_subwallet_id() returns current subwallet ID.
4. int is_plugin_installed(int wc, int addr_hash) checks if plugin with defined workchain ID and address hash is installed.
5. tuple get_plugin_list() returns list of plugins.


### Wallet V5 {#wallet-v5}

It is the most modern wallet version at the moment, developed by the Tonkeeper team, aimed at replacing V4 and allowing arbitrary extensions.
<br></br>
<ThemedImage
alt=""
sources={{
        light: '/img/docs/wallet-contracts/wallet-contract-V5.png?raw=true',
        dark: '/img/docs/wallet-contracts/wallet-contract-V5_dark.png?raw=true',
    }}
/>
<br></br><br></br><br></br>
The V5 wallet standard offers many benefits that improve the experience for both users and merchants. V5 supports gas-free transactions, account delegation and recovery, subscription payments using tokens and Toncoin, and low-cost multi-transfers. In addition to retaining the previous functionality (V4), the new contract allows you to send up to 255 messages at a time.

Wallet source code:

- [ton-blockchain/wallet-contract-v5](https://github.com/ton-blockchain/wallet-contract-v5)

TL-B scheme:

- [ton-blockchain/wallet-contract-v5/types.tlb](https://github.com/ton-blockchain/wallet-contract-v5/blob/main/types.tlb)

:::caution
In contrast to previous wallet version specifications, we will rely on [TL-B](/v3/documentation/data-formats/tlb/tl-b-language) scheme, due to the relative complexity of this wallet version's interface implementation. We will provide some description for each of those. Nevertheless, a basic understanding is still required, in combination with the wallet source code, it should be enough.
:::

#### Official code hash

| Contract version       | Hash                                     |
|------------------------|------------------------------------------|
| walletv5r1 | `IINLe3KxEhR+Gy+0V7hOdNGjDwT3N9T2KmaOlVLSty8=` |


#### Persistent memory layout

```
contract_state$_
    is_signature_allowed:(## 1)
    seqno:#
    wallet_id:(## 32)
    public_key:(## 256)
    extensions_dict:(HashmapE 256 int1) = ContractState;
```

As you can see, the `ContractState`, compared to previous versions, hasn't undergone major changes. The main difference is the new `is_signature_allowed` 1-bit flag, which restricts or allows access through the signature and stored public key. We will describe the importance of this change in later topics.

#### Authentification process

```
signed_request$_             // 32 (opcode from outer)
  wallet_id:    #            // 32
  valid_until:  #            // 32
  msg_seqno:    #            // 32
  inner:        InnerRequest //
  signature:    bits512      // 512
= SignedRequest;             // Total: 688 .. 976 + ^Cell

internal_signed#73696e74 signed:SignedRequest = InternalMsgBody;

internal_extension#6578746e
    query_id:(## 64)
    inner:InnerRequest = InternalMsgBody;

external_signed#7369676e signed:SignedRequest = ExternalMsgBody;
```

Before we get to the actual payload of our messages — `InnerRequest` — let's first look at how version 5 differs from previous versions in the authentication process. The `InternalMsgBody` combinator describes two ways to access wallet actions through internal messages. The first method is one we are already familiar with from version 4: authentication as a previously registered extension, the address of which is stored in `extensions_dict`. The second method is authentication through the stored public key and signature, similar to external requests.

At first, this might seem like an unnecessary feature, but it actually enables requests to be processed through external services (smart contracts) that are not part of your wallet's extension infrastructure—a key feature of V5. Gas-free transactions rely on this functionality.

Note that simply receiving funds is still an option. Practically, any received internal message that doesn't pass the authentication process will be considered as transfer.

#### Actions

The first thing that we should notice is `InnerRequest`, which we have already seen in the authentication process. In contrast to the previous version, both external and internal messages have access to the same functionality, except for changing the signature mode (i.e., the `is_signature_allowed` flag).

```
out_list_empty$_ = OutList 0;
out_list$_ {n:#}
    prev:^(OutList n)
    action:OutAction = OutList (n + 1);

action_send_msg#0ec3c86d mode:(## 8) out_msg:^(MessageRelaxed Any) = OutAction;

// Extended actions in V5:
action_list_basic$_ {n:#} actions:^(OutList n) = ActionList n 0;
action_list_extended$_ {m:#} {n:#} action:ExtendedAction prev:^(ActionList n m) = ActionList n (m+1);

action_add_ext#02 addr:MsgAddressInt = ExtendedAction;
action_delete_ext#03 addr:MsgAddressInt = ExtendedAction;
action_set_signature_auth_allowed#04 allowed:(## 1) = ExtendedAction;

actions$_ out_actions:(Maybe OutList) has_other_actions:(## 1) {m:#} {n:#} other_actions:(ActionList n m) = InnerRequest;
```

We can consider `InnerRequest` as two lists of actions: the first, `OutList`, is an optional chain of cell references, each containing a send message request led by the message mode. The second, `ActionList,` is led by a one-bit flag, `has_other_actions`, which marks the presence of extended actions, starting from the first cell and continuing as a chain of cell references. We are already familiar with the first two extended actions, `action_add_ext` and `action_delete_ext`, followed by the internal address that we want to add or delete from the extensions dictionary. The third, `action_set_signature_auth_allowed`, restricts or allows authentication through the public key, leaving the only way to interact with the wallet through extensions. This functionality might be extremely important in the case of a lost or compromised private key.

:::info
Note that the maximum number of actions is 255; this is a consequence of the realization through the [c5](/v3/documentation/tvm/tvm-overview#results-of-tvm-execution) TVM register. Technically, you can make a request with empty `OutAction` and `ExtendedAction`, but in that case, it will be similar to just receiving funds.
:::

#### Exit codes

| Exit code | Description                                                                       |
|-----------| --------------------------------------------------------------------------------- |
| 0x84      | Authentication attempt through signature while it's disabled                      |
| 0x85      | `seqno` check failed, reply protection occurred                                   |
| 0x86      | `wallet-id` does not correspond to the stored one                                 |
| 0x87      | `Ed25519 signature` check failed                                                  |
| 0x88      | `valid-until` check failed                                                        |
| 0x89      | Enforce that `send_mode` has the +2 bit (ignore errors) set for external message. |
| 0x8A      | `external-signed` prefix doesn't correspond to the received one                   |
| 0x8B      | Add extension operation was not successful                                        |
| 0x8C      | Remove extension operation was not successful                                     |
| 0x8D      | Unsupported extended message prefix                                               |
| 0x8E      | Tried to disable auth by signature while the extension dictionary is empty        |
| 0x8F      | Attempt to set signature to an already set state                                  |
| 0x90      | Tried to remove the last extension when signature is disabled                     |
| 0x91      | Extension has the wrong workchain                                                 |
| 0x92      | Tried to change signature mode through external message                           |
| 0x93      | Invalid `c5`, `action_send_msg` verification failed                               |
| 0x0       | Standard successful execution exit code.                                          |

:::danger
Note that the `0x8E`, `0x90`, and `0x92` wallet exit codes are designed to prevent you from losing access to wallet functionality. Nevertheless, you should still remember that the wallet doesn't check whether the stored extension addresses actually exist in TON. You can also deploy a wallet with initial data consisting of an empty extensions dictionary and restricted signature mode. In that case, you will still be able to access the wallet through the public key until you add your first extension. So, be careful with these scenarios.
:::

#### Get methods

1. int is_signature_allowed() returns stored `is_signature_allowed` flag.
2. int seqno() returns current stored seqno.
3. int get_subwallet_id() returns current subwallet ID.
4. int get_public_key() returns current stored public key.
5. cell get_extensions() returns extensions dictionary.

#### Preparing for gasless transactions

As was said, before v5, the wallet smart contract allowed the processing of internal messages signed by the owner. This also allows you to make gasless transactions, e.g., payment of network fees when transferring USDt in USDt itself. The common scheme looks like this:

![image](/img/gasless.jpg)

:::tip
Consequently, there will be services (such as [Tonkeeper's Battery](https://blog.ton.org/tonkeeper-releases-huge-update#tonkeeper-battery)) that provide this functionality: they pay the transaction fees in TONs on behalf of the user, but charge a fee in tokens.
:::

#### Flow

1. When sending USDt, the user signs one message containing two outgoing USDt transfers:
   1. USDt transfer to the recipient's address.
   2. Transfer of a small amount of USDt in favor of the Service.
2. This signed message is sent off-chain by HTTPS to the Service backend. The Service backend sends it to the TON blockchain, paying Toncoins for network fees.

Beta version of the gasless backend API is available on [tonapi.io/api-v2](https://tonapi.io/api-v2). If you are developing any wallet app and have feedback about these methods please share it ton [@tonapitech](https://t.me/tonapitech) chat.

Wallet source code:

- [ton-blockchain/wallet-contract-v5](https://github.com/ton-blockchain/wallet-contract-v5)


## Special wallets

Sometimes the functionality of basic wallets isn't enough. That's why there are several types of specialized wallet: `high-load`, `lockup` and `restricted`.

Let's have a look at them.

### Highload wallets

When working with many messages in a short period, there is a need for special wallet called Highload Wallet. Read [the article](/v3/documentation/smart-contracts/contracts-specs/highload-wallet) for more information.

### Lockup wallet

If you, for some reason, need to lock coins in a wallet for some time without the possibility to withdraw them before that time passes, have a look at the lockup wallet.

It allows you to set the time until which you won't be able to withdraw anything from the wallet. You can also customize it by setting unlock periods so that you will be able to spend some coins during these set periods.

For example: you can create a wallet which will hold 1 million coins with total vesting time of 10 years. Set the cliff duration to one year, so the funds will be locked for the first year after the wallet is created. Then, you can set the unlock period to one month, so `1'000'000 TON / 120 months = ~8333 TON` will unlock every month.

Wallet source code:

- [ton-blockchain/lockup-wallet-contract](https://github.com/ton-blockchain/lockup-wallet-contract)

### Restricted wallet

This wallet's function is to act like a regular wallet, but restrict transfers to only one pre-defined destination address. You can set the destination when you create this wallet and then you'll be only able to transfer funds from it to that address. But note that you can still transfer funds to validation contracts so you can run a validator with this wallet.

Wallet source code:

- [EmelyanenkoK/nomination-contract/restricted-wallet](https://github.com/EmelyanenkoK/nomination-contract/tree/master/restricted-wallet)

## Conclusion

As you see, there are many different versions of wallets in TON. But in most cases, you only need `V3R2` or `V4R2`. You can also use one of the special wallets if you want to have some additional functionality like a periodic unlocking of funds.

## See also

- [Working with wallet smart contracts](/v3/guidelines/smart-contracts/howto/wallet)
- [Sources of basic wallets](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont)
- [More technical description of versions](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md)
- [Wallet V4 sources and detailed description](https://github.com/ton-blockchain/wallet-contract)
- [Lockup wallet sources and detailed description](https://github.com/ton-blockchain/lockup-wallet-contract)
- [Restricted wallet sources](https://github.com/EmelyanenkoK/nomination-contract/tree/master/restricted-wallet)
- [Gasless transactions on TON](https://medium.com/@buidlingmachine/gasless-transactions-on-ton-75469259eff2)

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/fift/fift-and-tvm-assembly.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/fift/fift-and-tvm-assembly.md
================================================
import Feedback from '@site/src/components/Feedback';

# Fift and TVM assembly

Fift is a stack-based programming language with TON-specific features that can work with cells. TVM assembly is another stack-based language designed for TON that also handles cells. What's the difference between them?

## Key differences

Fift executes at **compile-time** - when your compiler builds the smart contract code BOC after processing FunC code. Fift can appear in different forms:

```
// Tuple primitives
x{6F0} @Defop(4u) TUPLE
x{6F00} @Defop NIL
x{6F01} @Defop SINGLE
x{6F02} dup @Defop PAIR @Defop CONS
```
> TVM opcode definitions in Asm.fif

```
"Asm.fif" include
<{ SETCP0 DUP IFNOTRET // Return if recv_internal
   DUP 85143 INT EQUAL OVER 78748 INT EQUAL OR IFJMP:<{ // "seqno" and "get_public_key" get-methods
     1 INT AND c4 PUSHCTR CTOS 32 LDU 32 LDU NIP 256 PLDU CONDSEL  // cnt or pubk
   }>
   INC 32 THROWIF    // Fail unless recv_external
   9 PUSHPOW2 LDSLICEX DUP 32 LDU 32 LDU 32 LDU     // signature in_msg subwallet_id valid_until msg_seqno cs
   NOW s1 s3 XCHG LEQ 35 THROWIF    // signature in_msg subwallet_id cs msg_seqno
   c4 PUSH CTOS 32 LDU 32 LDU 256 LDU ENDS    // signature in_msg subwallet_id cs msg_seqno stored_seqno stored_subwallet public_key
   s3 s2 XCPU EQUAL 33 THROWIFNOT    // signature in_msg subwallet_id cs public_key stored_seqno stored_subwallet
   s4 s4 XCPU EQUAL 34 THROWIFNOT    // signature in_msg stored_subwallet cs public_key stored_seqno
   s0 s4 XCHG HASHSU    // signature stored_seqno stored_subwallet cs public_key msg_hash
   s0 s5 s5 XC2PU    // public_key stored_seqno stored_subwallet cs msg_hash signature public_key
   CHKSIGNU 35 THROWIFNOT    // public_key stored_seqno stored_subwallet cs
   ACCEPT
   WHILE:<{
     DUP SREFS    // public_key stored_seqno stored_subwallet cs _51
   }>DO<{    // public_key stored_seqno stored_subwallet cs
     8 LDU LDREF s0 s2 XCHG    // public_key stored_seqno stored_subwallet cs _56 mode
     SENDRAWMSG
   }>    // public_key stored_seqno stored_subwallet cs
   ENDS SWAP INC    // public_key stored_subwallet seqno'
   NEWC 32 STU 32 STU 256 STU ENDC c4 POP
}>c
```
> wallet_v3_r2.fif

The last code fragment resembles TVM assembly because most of it actually is TVM assembly. Here's why:

Imagine explaining programming concepts to a trainee. Your instructions become part of their program, processed twice - similar to how opcodes in capital letters (SETCP0, DUP, etc.) are processed by both Fift and TVM.

Think of Fift as a teaching language where you can introduce high-level concepts to a learner. Just as a trainee programmer gradually absorbs and applies new concepts, Fift allows you to define custom commands and abstractions. The Asm[Tests].fif file demonstrates this perfectly - it's essentially a collection of TVM opcode definitions.

TVM assembly, in contrast, is like the trainee's final working program. While it operates with fewer built-in features (it can't perform cryptographic signing, for instance), it has direct access to the blockchain environment during contract execution. Where Fift works at compile-time to shape the contract's code, TVM assembly runs that code on the actual blockchain.

## Smart contract usage

### [Fift] including large BoCs in contracts

When using `toncli`, you can include large BoCs by:

1. Editing `project.yaml` to include `fift/blob.fif`:
```yaml
contract:
  fift:
    - fift/blob.fif
  func:
    - func/code.fc
```

2. Adding the BoC to `fift/blob.boc`

3. Including this code in `fift/blob.fif`:
```
<b 8 4 u, 8 4 u, "fift/blob.boc" file>B B>boc ref, b> <s @Defop LDBLOB
```

Now you can access the blob in your contract:
```
cell load_blob() asm "LDBLOB";

() recv_internal() {
    send_raw_message(load_blob(), 160);
}
```

### [TVM assembly] converting integers to strings

Fift primitives can't convert integers to strings at runtime because Fift operates at compile-time. For runtime conversion, use TVM assembly like this solution from TON Smart Challenge 3:

```
tuple digitize_number(int value)
  asm "NIL WHILE:<{ OVER }>DO<{ SWAP TEN DIVMOD s1 s2 XCHG TPUSH }> NIP";

builder store_number(builder msg, tuple t)
  asm "WHILE:<{ DUP TLEN }>DO<{ TPOP 48 ADDCONST ROT 8 STU SWAP }> DROP";

builder store_signed(builder msg, int v) inline_ref {
  if (v < 0) {
    return msg.store_uint(45, 8).store_number(digitize_number(-v));
  } elseif (v == 0) {
    return msg.store_uint(48, 8);
  } else {
    return msg.store_number(digitize_number(v));
  }
}
```

### [TVM assembly] efficient modulo multiplication

Compare these implementations:

```
int mul_mod(int a, int b, int m) inline_ref {               ;; 1232 gas units
  (_, int r) = muldivmod(a % m, b % m, m);
  return r;
}
int mul_mod_better(int a, int b, int m) inline_ref {        ;; 1110 gas units
  (_, int r) = muldivmod(a, b, m);
  return r;
}
int mul_mod_best(int a, int b, int m) asm "x{A988} s,";     ;; 65 gas units
```

The `x{A988}` opcode implements an optimized division operation with built-in multiplication (as specified in [section 5.2 Division](/v3/documentation/tvm/instructions#A988)). This specialized instruction directly computes just the modulo remainder of the operation, skipping unnecessary computation steps. The `s,` suffix then handles the result storage - it takes the resulting slice from the stack's top and efficiently writes it into the target builder. Together, this combination delivers substantial gas savings compared to conventional approaches.
<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/fift/fift-deep-dive.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/fift/fift-deep-dive.md
================================================
import Feedback from '@site/src/components/Feedback';

# Fift deep dive

Fift is a high-level stack-based language used for local manipulation of cells and other TVM primitives. Its primary purpose is to compile TVM assembly code into contract code as a bag-of-cells (BoC).

:::caution
**Advanced topic notice**
This section covers low-level interactions with TON's implementation details. Before proceeding, ensure you have:

- Solid experience with stack-based programming paradigms
- Understanding of virtual machine architectures
- Familiarity with low-level data structures
:::

## Simple arithmetic

Use the Fift interpreter as a calculator with reverse Polish notation:

```
6 17 17 * * 289 + .
2023 ok
```

This example calculates:

1. `17 * 17 = 289`
2. `6 * 289 = 1734`
3. `1734 + 289 = 2023`

## Standard output

```
27 emit ."[30;1mgrey text" 27 emit ."[37m"
grey text ok
```

- `emit` prints the Unicode character corresponding to the number on top of the stack
- `."..."` outputs a constant string  

## Defining functions (Fift words)

To define a word, follow these steps:  

1. **Enclose the word's effects** in curly braces `{}`.  
2. **Add a colon `:`** after the closing brace.  
3. **Specify the word's name** after the colon.

First line defines a word `increment` that increases `x` by `1`.

**Examples:**  
```  
{ x 1 + } : increment
{ minmax drop } : min
{ minmax nip } : max
```  
> Fift.fif

In TON, multiple **defining words** exist, not just `:`. They differ in behavior:  

- **Active words** – Operate inside curly braces `{}`.
- **Prefix words** – Do not require a trailing space .

```  
{ bl word 1 2 ' (create) } "::" 1 (create)  
{ bl word 0 2 ' (create) } :: :  
{ bl word 2 2 ' (create) } :: :_  
{ bl word 3 2 ' (create) } :: ::_  
{ bl word 0 (create) } : create  
``` 

> Fift.fif

## Conditional execution

Execute code blocks conditionally using `cond`:

```
{ { ."true " } { ."false " } cond } : ?.   4 5 = ?.  4 5 < ?.
false true  ok
{ ."hello " } execute ."world"
hello world ok
```

## Loops

Use loop primitives for repetitive operations:

```
// ( l c -- l') Removes first c elements from list l
{ ' safe-cdr swap times } : list-delete-first
```

> GetOpt.fif

Loop word `times` takes two arguments - let's call them `cont` and `n` - and executes `cont` `n` times.
Here `list-delete-first` takes continuation of `safe-cdr` (command deleting head from Lisp-style list), places it under `c` and then `c` times removes head from list present on stack.
`while`/`until` provide conditional looping.

## Comments

Comments in Fift are defined in `Fift.fif` and come in two forms:
1. **Single-line comments**: Start with `//` and continue to the end of the line
2. **Multiline comments**: Start with `/*` and end with `*/`

```
{ 0 word drop 0 'nop } :: //
{ char " word 1 { swap { abort } if drop } } ::_ abort"
{ { bl word dup "" $= abort"comment extends after end of file" "*/" $= } until 0 'nop } :: /*
```
> Fift.fif

#### How comments work

Fift programs are sequences of words that transform the stack or define new words. Comments must work even during word definitions, requiring them to be **active words** (defined with `::`).

Breaking down the `//` definition:
1. `0` - Pushes zero onto the stack
2. `word` - Reads characters until reaching one matching the top stack value (zero is special - skips leading spaces then reads to end of line)
3. `drop` - Removes the comment text from the stack
4. `0` - Pushes zero again (number of results for `::` definition)
5. `'nop` - Pushes an execution token that does nothing (equivalent to `{ nop }`)


## Using Fift for defining TVM assembly codes

```fift
x{00} @Defop NOP
{ 1 ' @addop does create } : @Defop
{ tuck sbitrefs @ensurebitrefs swap s, } : @addop
{ @havebitrefs ' @| ifnot } : @ensurebitrefs
{ 2 pick brembitrefs 1- 2x<= } : @havebitrefs
{ rot >= -rot <= and } : 2x<=
...
```
> Asm.fif (lines order reversed)

### How @Defop works
`@Defop` checks available space for the opcode using `@havebitrefs`. If space is insufficient, it writes to another builder via `@|` (implicit jump). 

**Important:** Always use `x{A988} @addop` instead of `x{A988} s,` to avoid compilation failures when space is limited.

### Including cells in contracts
You can embed large bag-of-cells into contracts:
```fift
<b 8 4 u, 8 4 u, "fift/blob.boc" file>B B>boc ref, b> <s @Defop LDBLOB
```

This defines an opcode that:
1. Writes `x{88}` (`PUSHREF`) when included in the program
2. Adds a reference to the specified bag-of-cells
3. Pushes the cell to TVM stack when executing `LDBLOB`

## Special features

### Ed25519 cryptography
Fift provides built-in support for Ed25519 cryptographic operations:
- **`newkeypair`** - Generates a private-public key pair  
- **`priv>pub`** - Derives a public key from a private key  
- **`ed25519_sign[_uint]`** - Creates a signature for given data using a private key  
- **`ed25519_chksign`** - Verifies an Ed25519 signature  

### TVM interaction
- **`runvmcode` and similar commands** - Executes TVM with a code slice taken from the stack  

### File operations
- **Save BoC to file**:  
  ```fift
  boc>B ".../contract.boc" B>file
  ```

## Continue learning  
- [Fift: A Brief Introduction](https://docs.ton.org/fiftbase.pdf) - _Nikolai Durov_  

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/fift/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/fift/overview.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Button from "@site/src/components/button";

# Overview

Fift is a stack-based programming language specifically designed for developing, debugging, and managing TON Blockchain smart contracts. It provides optimized interaction with:

- TON Virtual Machine (TVM)
- TON Blockchain infrastructure

```fift
{ ."hello " } execute ."world"
hello world ok
```

:::info
While most smart contract development doesn't require Fift, it becomes essential for:

- Solving unique technical challenges
- Low-level TVM interactions
- Advanced contract debugging

**Recommended resources**:

- [TVM Retracer](https://retracer.ton.org/)
:::

<Button
  href="https://blog.ton.org/introduction-to-fift"
  colorType="primary"
  sizeType={"sm"}
>
  Introduction To Fift
</Button>

<Button
  href="https://www.youtube.com/watch?v=HVsveTmVowc&list=PLtUBO1QNEKwttRsAs9eacL2oCMOhWaOZs"
  colorType="secondary"
  sizeType={"sm"}
>
  His majesty Fift
</Button>

<br></br>
<br></br>

## Documentation

- [Fift: A Brief Introduction](https://ton.org/fiftbase.pdf)
- [TON Virtual Machine](/v3/documentation/tvm/tvm-overview)

## Examples

- [Fift smart contract examples](/v3/documentation/smart-contracts/contracts-specs/examples#fift-smart-contracts)

## Tutorials

- [Introduction To Fift](https://blog.ton.org/introduction-to-fift)
- [His majesty Fift](https://www.youtube.com/watch?v=HVsveTmVowc&list=PLtUBO1QNEKwttRsAs9eacL2oCMOhWaOZs)
  - [Russian version](https://www.youtube.com/playlist?list=PLyDBPwv9EPsCYG-hR4N5FRTKUkfM8POgh)
created - _@MarcoDaTr0p0je & @Wikimar_

## Source code

- [Standard smart contracts in Fift](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont)

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/func/changelog.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/func/changelog.md
================================================
import Feedback from '@site/src/components/Feedback';

# History of FunC 

## Initial version
The initial version of FunC was developed by Telegram, but active development stopped after May 2020.
We refer to the May 2020 release as the "initial" version.

## Version 0.1.0
Released in [May 2022](https://github.com/ton-blockchain/ton/releases/tag/v2022.05/).

**New features:**
- [Constants](/v3/documentation/smart-contracts/func/docs/literals_identifiers#constants/)
- [Extended string literals](/v3/documentation/smart-contracts/func/docs/literals_identifiers#string-literals/)
- [Semver pragmas](/v3/documentation/smart-contracts/func/docs/compiler_directives#pragma-version/)
- [Includes](/v3/documentation/smart-contracts/func/docs/compiler_directives#pragma-version/)

**Fixes:**
- Resolved rare bugs in `Asm.fif`.


## Version 0.2.0
Released in [Aug 2022](https://github.com/ton-blockchain/ton/releases/tag/v2022.08/).

**New features:**
- Unbalanced `if/else` branches, where some branches return a value while others do not.

**Fixes:**
- FunC incorrectly handles `while(false)` loops [(#377)](https://github.com/ton-blockchain/ton/issues/377/).
- FunC generates incorrect code for `if/else` branches [(#374)](https://github.com/ton-blockchain/ton/issues/374/).
- FunC incorrectly returns from conditions in inline functions [(#370)](https://github.com/ton-blockchain/ton/issues/370/).
- `Asm.fif`: splitting large function bodies incorrectly interferes with inline [(#375)](https://github.com/ton-blockchain/ton/issues/375/).



## Version 0.3.0
Released in [Oct 2022](https://github.com/ton-blockchain/ton/releases/tag/v2022.10/).

**New features:**
- Support for [multiline `asm` statements](/v3/documentation/smart-contracts/func/docs/functions#multiline-asms).
- Allow duplicate definitions of identical constants and `asm` statements.
- Enable bitwise operations for constants.

## Version 0.4.0
Released in [Jan 2023](https://github.com/ton-blockchain/ton/releases/tag/v2023.01/).

**New features:**
- [`try/catch` statements](/v3/documentation/smart-contracts/func/docs/statements#try-catch-statements)
- [`throw_arg` functions](/v3/documentation/smart-contracts/func/docs/builtins#throwing-exceptions)
- Support for in-place modification and mass assignment of global variables, e.g., `a~inc()` and `(a, b) = (3, 5)`, where `a` is global.


**Fixes:**
- Disallowed ambiguous modification of local variables after their usage in the same expression. For example, `var x = (ds, ds~load_uint(32), ds~load_unit(64));` is forbidden, while `var x = (ds~load_uint(32), ds~load_unit(64), ds);` is allowed. 
- Allowed empty inline functions.
- Fixed a rare optimization bug in `while` loops.


<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/func/cookbook.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/func/cookbook.md
================================================
import Feedback from '@site/src/components/Feedback';

# FunC cookbook
The FunC cookbook was created to consolidate all the knowledge and best practices from experienced FunC developers in one place. The goal is to make it easier for future developers to build smart contracts efficiently.

Unlike the official [FunC documentation](/v3/documentation/smart-contracts/func/docs/types), this guide focuses on solving everyday challenges that FunC developers encounter during smart contract development.

## Basics

### How to write an if statement

Let's say we want to check if any event is relevant. To do this, we use the flag variable. Remember that in FunC `true` is `-1` and `false` is `0`.

To check whether an event is relevant, use a flag variable. In FunC, `true` is represented by `-1`, and `false` is `0`.

```func
int flag = 0; ;; false

if (flag) { 
    ;; do something
}
else {
    ;; reject the transaction
}
```
**Note:** The `==` operator is unnecessary, as `0` already evaluates to `false`, and any nonzero value is considered `true`.

**Reference:** [`If statement` in docs](/v3/documentation/smart-contracts/func/docs/statements#if-statements)

### How to write a repeat loop
A repeat loop helps execute an action a fixed number of times. The example below demonstrates exponentiation:

```func
int number = 2;
int multiplier = number;
int degree = 5;

repeat(degree - 1) {

    number *= multiplier;
}
```

**Reference:** [`Repeat loop` in docs](/v3/documentation/smart-contracts/func/docs/statements#repeat-loop)

### How to write a while loop

A while loop is useful when the number of iterations is unknown. The following example processes a `cell` which can store up to four references to other cells:

```func
cell inner_cell = begin_cell() ;; Create a new empty builder
        .store_uint(123, 16) ;; Store uint with value 123 and length 16 bits
        .end_cell(); ;; Convert builder to a cell

cell message = begin_cell()
        .store_ref(inner_cell) ;; Store cell as reference
        .store_ref(inner_cell)
        .end_cell();

slice msg = message.begin_parse(); ;; Convert cell to slice
while (msg.slice_refs_empty?() != -1) { ;; We should remind that -1 is true
    cell inner_cell = msg~load_ref(); ;; Load cell from slice msg
    ;; do something
}
```

**References:**
- [`While loop` in docs](/v3/documentation/smart-contracts/func/docs/statements#while-loop)
- [`Cell` in docs](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage)
- [`slice_refs_empty?()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#slice_refs_empty)
- [`store_ref()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#store_ref)
- [`begin_cell()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#begin_cell)
- [`end_cell()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#end_cell)
- [`begin_parse()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#begin_parse)

### How to write a do until loop
Use a `do-until` loop when the loop must execute at least once.

```func 
int flag = 0;

do {
    ;; do something even flag is false (0) 
} until (flag == -1); ;; -1 is true
```

**Reference:** [`Until loop` in docs](/v3/documentation/smart-contracts/func/docs/statements#until-loop)

### How to determine if slice is empty

Before working with a `slice`, checking whether it contains any data is essential to ensure proper processing. The `slice_empty?()` method can be used for this purpose. However, it returns `0` (`false`) if the slice contains at least one `bit` of data or one `ref`.

```func
;; Creating empty slice
slice empty_slice = "";
;; `slice_empty?()` returns `true` because the slice doesn't have any `bits` and `refs`.
empty_slice.slice_empty?();

;; Creating slice which contains bits only
slice slice_with_bits_only = "Hello, world!";
;; `slice_empty?()` returns `false` because the slice has `bits`.
slice_with_bits_only.slice_empty?();

;; Creating slice which contains refs only
slice slice_with_refs_only = begin_cell()
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_empty?()` returns `false` because the slice has `refs`.
slice_with_refs_only.slice_empty?();

;; Creating slice which contains bits and refs
slice slice_with_bits_and_refs = begin_cell()
    .store_slice("Hello, world!")
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_empty?()` returns `false` because the slice has `bits` and `refs`.
slice_with_bits_and_refs.slice_empty?();
```
**References:**
- [`slice_empty?()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#slice_empty)
- [`store_slice()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#store_slice)
- [`store_ref()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#store_ref)
- [`begin_cell()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#begin_cell)
- [`end_cell()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#end_cell)
- [`begin_parse()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#begin_parse)


### How to determine if slice is empty (no bits, but may have refs)

If only the presence of `bits` matters and `refs` in `slice` can be ignored, use the `slice_data_empty?()`.

```func 
;; Creating empty slice
slice empty_slice = "";
;; `slice_data_empty?()` returns `true` because the slice doesn't have any `bits`.
empty_slice.slice_data_empty?();

;; Creating slice which contains bits only
slice slice_with_bits_only = "Hello, world!";
;; `slice_data_empty?()` returns `false` because the slice has  `bits`.
slice_with_bits_only.slice_data_empty?();

;; Creating slice which contains refs only
slice slice_with_refs_only = begin_cell()
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_data_empty?()` returns `true` because the slice doesn't have any `bits`
slice_with_refs_only.slice_data_empty?();

;; Creating slice which contains bits and refs
slice slice_with_bits_and_refs = begin_cell()
    .store_slice("Hello, world!")
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_data_empty?()` returns `false` because the slice has `bits`.
slice_with_bits_and_refs.slice_data_empty?();
```

**References:**
- [`slice_data_empty?()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#slice_data_empty)
- [`store_slice()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#store_slice)
- [`store_ref()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#store_ref)
- [`begin_cell()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#begin_cell)
- [`end_cell()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#end_cell)
- [`begin_parse()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#begin_parse)


### How to determine if slice is empty (no refs, but may have bits)

In case we are only interested in `refs`, we should check their presence using `slice_refs_empty?()`.

If only `refs` are of interest, their presence can be checked using the `slice_refs_empty?()`.

```func 
;; Creating empty slice
slice empty_slice = "";
;; `slice_refs_empty?()` returns `true` because the slice doesn't have any `refs`.
empty_slice.slice_refs_empty?();

;; Creating slice which contains bits only
slice slice_with_bits_only = "Hello, world!";
;; `slice_refs_empty?()` returns `true` because the slice doesn't have any `refs`.
slice_with_bits_only.slice_refs_empty?();

;; Creating slice which contains refs only
slice slice_with_refs_only = begin_cell()
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_refs_empty?()` returns `false` because the slice has `refs`.
slice_with_refs_only.slice_refs_empty?();

;; Creating slice which contains bits and refs
slice slice_with_bits_and_refs = begin_cell()
    .store_slice("Hello, world!")
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_refs_empty?()` returns `false` because the slice has `refs`.
slice_with_bits_and_refs.slice_refs_empty?();
```

**References:**
- [`slice_refs_empty?()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#slice_refs_empty)
- [`store_slice()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#store_slice)
- [`store_ref()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#store_ref)
- [`begin_cell()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#begin_cell)
- [`end_cell()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#end_cell)
- [`begin_parse()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#begin_parse)

### How to determine if a cell is empty

To check whether a `cell` contains any data, it must first be converted into a `slice`.
- If only `bits` matter, use `slice_data_empty?()`.
- If only `refs` matter, use `slice_refs_empty?()`.
- If the presence of any data (`bits` or `refs`) needs to be checked, use `slice_empty?()`.

```func
cell cell_with_bits_and_refs = begin_cell()
    .store_uint(1337, 16)
    .store_ref(null())
    .end_cell();

;; Change the `cell` type to slice with `begin_parse()`.
slice cs = cell_with_bits_and_refs.begin_parse();

;; Determine if the slice is empty.
if (cs.slice_empty?()) {
    ;; Cell is empty
}
else {
    ;; Cell is not empty
}
```

**References:**
- [`slice_empty?()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#slice_empty)
- [`begin_cell()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#begin_cell)
- [`store_uint()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#store_uint)
- [`end_cell()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#end_cell)
- [`begin_parse()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#begin_parse)

### How to determine if a dict is empty
The `dict_empty?()` checks whether a dictionary contains any data. This method is functionally equivalent to `cell_null?()`, as a `null` cell typically represents an empty dictionary.

```func
cell d = new_dict();
d~udict_set(256, 0, "hello");
d~udict_set(256, 1, "world");

if (d.dict_empty?()) { ;; Determine if the dict is empty
    ;; dict is empty
}
else {
    ;; dict is not empty
}
```

**References:**
- [`dict_empty?()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#dict_empty)
- [`new_dict()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#new_dict), creating an empty dict
- [`dict_set()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_set), adding some elements in dict `d` with function, so it is not empty

### How to determine if a tuple is empty

When working with `tuples`, checking for existing values before extracting them is crucial. Extracting a value from an empty tuple will result in an error:
["not a tuple of valid size" - `exit code 7`](/v3/documentation/tvm/tvm-exit-codes#7)

```func
;; Declare tlen function because it's not presented in stdlib
(int) tlen (tuple t) asm "TLEN";

() main () {
    tuple t = empty_tuple();
    t~tpush(13);
    t~tpush(37);

    if (t.tlen() == 0) {
        ;; tuple is empty
    }
    else {
        ;; tuple is not empty
    }
}
```
**Note:** 
We are defining the `tlen` assembly function. You can find more details [here](/v3/documentation/smart-contracts/func/docs/functions#assembler-function-body-definition) and a see a [list of assembler commands](/v3/documentation/tvm/instructions).

**References:**
- [`empty_tuple?()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#empty_tuple)
- [`tpush()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#tpush)
- [`Exit codes` in docs](/v3/documentation/tvm/tvm-exit-codes)

### How to determine if a lisp-style list is empty

We can use the [cons](/v3/documentation/smart-contracts/func/docs/stdlib/#cons) function to add an element to determine if a lisp-style list is empty. For example, adding 100 to the list ensures it is not empty.


```func
tuple numbers = null();
numbers = cons(100, numbers);

if (numbers.null?()) {
    ;; list-style list is empty
} else {
    ;; list-style list is not empty
}
```

### How to determine a state of the contract is empty
Consider a smart contract with a `counter` that tracks the number of transactions. This variable does not exist in the contract state during the first transaction because it is empty. 
It is important to handle this scenario by checking if the state is empty and initializing the `counter` accordingly.

```func
;; `get_data()` will return the data cell from contract state
cell contract_data = get_data();
slice cs = contract_data.begin_parse();

if (cs.slice_empty?()) {
    ;; Contract data is empty, so we create counter and save it
    int counter = 1;
    ;; Create cell, add counter and save in contract state
    set_data(begin_cell().store_uint(counter, 32).end_cell());
}
else {
    ;; Contract data is not empty, so we get our counter, increase it and save
    ;; we should specify correct length of our counter in bits
    int counter = cs~load_uint(32) + 1;
    set_data(begin_cell().store_uint(counter, 32).end_cell());
}
```

**Note:**
The contract state can be determined as empty by verifying whether the [cell is empty](/v3/documentation/smart-contracts/func/cookbook#how-to-determine-if-a-cell-is-empty).


**References:**
- [`get_data()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#get_data)
- [`begin_parse()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#begin_parse)
- [`slice_empty?()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_empty)
- [`set_data?()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#set_data)

### How to build an internal message cell

When a smart contract needs to send an internal message, it must first construct the message as a `cell`. This includes specifying technical flags, the recipient's address, and additional data.

```func
;; We use literal `a` to get valid address inside slice from string containing address 
slice addr = "EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx"a;
int amount = 1000000000;
;; we use `op` for identifying operations
int op = 0;

cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(op, 32)
.end_cell();

send_raw_message(msg, 3); ;; mode 3 - pay fees separately and ignore errors 
```
**Note:**
- In this example, we use the literal `a` to obtain an address. More details on string literals can be found in the [documentation](/v3/documentation/smart-contracts/func/docs/literals_identifiers#string-literals). 
- You can find more details in the [documentation](/v3/documentation/smart-contracts/message-management/sending-messages). A direct link to the [layout](/v3/documentation/smart-contracts/message-management/sending-messages#message-layout) is also available.

**References:**
- [`begin_cell()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#begin_cell)
- [`store_uint()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#store_uint)
- [`store_slice()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#store_slice)
- [`store_coins()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#store_coins)
- [`end_cell()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#end_cell)
- [`send_raw_message()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#send_raw_message)

### How to contain a body as a ref in an internal message cell

The message body can contain `int`, `slices`, or `cells` following flags and other technical data. If a `cell` is used, a bit must be set to `1` before calling `store_ref()`, indicating that the `cell` will be included.

Alternatively, if there is sufficient space, the message body can be stored in the same `cell` as the header. In this case, the bit should be set to `0`.

```func
;; We use literal `a` to get valid address inside slice from string containing address 
slice addr = "EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx"a;
int amount = 1000000000;
int op = 0;
cell message_body = begin_cell() ;; Creating a cell with message
    .store_uint(op, 32)
    .store_slice("❤")
.end_cell();
    
cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1) ;; default message headers (see sending messages page)
    .store_uint(1, 1) ;; set bit to 1 to indicate that the cell will go on
    .store_ref(message_body)
.end_cell();

send_raw_message(msg, 3); ;; mode 3 - pay fees separately and ignore errors 
```

**Note:**
- In this example, we use the literal `a` to obtain an address. More details on string literals can be found in the [documentation](/v3/documentation/smart-contracts/func/docs/literals_identifiers#string-literals).
- The example uses [`mode 3`](/v3/documentation/smart-contracts/message-management/sending-messages#mode3), which ensures the contract deducts the specified amount while covering the transaction fee from the contract balance and ignoring errors.
  - `mode 64` returns all received tokens, subtracting the commission.
  - `mode 128` transfers the entire balance.
- The [message](/v3/documentation/smart-contracts/func/cookbook#how-to-build-an-internal-message-cell) is constructed with the body added separately.
  

**References:**
- [`begin_cell()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#begin_cell)
- [`store_uint()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#store_uint)
- [`store_slice()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#store_slice)
- [`store_coins()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#store_coins)
- [`end_cell()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#end_cell)
- [`send_raw_message()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#send_raw_message)

### How to contain a body as a slice in an internal message cell

A message body can be sent as either a `cell` or a `slice`. In this example, the body is sent inside a `slice`.

```func 
;; We use literal `a` to get valid address inside slice from string containing address 
slice addr = "EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx"a;
int amount = 1000000000;
int op = 0;
slice message_body = "❤"; 

cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(op, 32)
    .store_slice(message_body)
.end_cell();

send_raw_message(msg, 3); ;; mode 3 - pay fees separately and ignore errors 
```
**Note:**
- The literal `a` is used to obtain an address. See the [documentation](/v3/documentation/smart-contracts/func/docs/literals_identifiers#string-literals) for details on string literals.
- The example uses `mode 3`, `mode 64`, and `mode 128`, as described above.
- The [message](/v3/documentation/smart-contracts/func/cookbook#how-to-build-an-internal-message-cell) is constructed with the body included as a slice.

### How to iterate tuples (both directions)

When working with arrays or stacks in FunC, tuples are essential. The first step is learning how to iterate through tuple values for processing.

```func
(int) tlen (tuple t) asm "TLEN";
forall X -> (tuple) to_tuple (X x) asm "NOP";

() main () {
    tuple t = to_tuple([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    int len = t.tlen();
    
    int i = 0;
    while (i < len) {
        int x = t.at(i);
        ;; do something with x
        i = i + 1;
    }

    i = len - 1;
    while (i >= 0) {
        int x = t.at(i);
        ;; do something with x
        i = i - 1;
    }
}
```

**Note:**
- The `tlen` assembly function is declared [here](/v3/documentation/smart-contracts/func/docs/functions#assembler-function-body-definition). You can read more about it and explore a [list of all assembler commands](/v3/documentation/tvm/instructions).
- The `to_tuple` function is also declared. This function converts any input into a tuple, so use it carefully.



### How to write custom functions using asm keyword


Many features we use in FunC come from pre-prepared methods inside `stdlib.fc`. However, we have many more capabilities, and learning to write custom functions unlocks new possibilities.

For example, while `tpush`, which adds an element to a `tuple`, exists, there is no built-in `tpop` function. In such cases, we must implement it ourselves.

```func
;; ~ means it is modifying method
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP"; 
```
We must determine its length if we want to iterate over a `tuple`. We can achieve this by writing a new function using the `TLEN` asm instruction.

```func
int tuple_length (tuple t) asm "TLEN";
```

Examples of functions from `stdlib.fc`:

```func
slice begin_parse(cell c) asm "CTOS";
builder begin_cell() asm "NEWC";
cell end_cell(builder b) asm "ENDC";
```

**References:**
- [`modifying method` in docs](/v3/documentation/smart-contracts/func/docs/statements#modifying-methods)
- [`stdlib` in docs](/v3/documentation/smart-contracts/func/docs/stdlib)
- [`TVM instructions` in docs](/v3/documentation/tvm/instructions)

### Iterating n-nested tuples


Sometimes, we need to iterate through nested tuples. The following example iterates through a tuple formatted as: `[[2,6],[1,[3,[3,5]]], 3]` starting from the head.


```func
int tuple_length (tuple t) asm "TLEN";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";
forall X -> int is_tuple (X x) asm "ISTUPLE";
forall X -> tuple cast_to_tuple (X x) asm "NOP";
forall X -> int cast_to_int (X x) asm "NOP";
forall X -> (tuple) to_tuple (X x) asm "NOP";

;; Define a global variable
global int max_value;

() iterate_tuple (tuple t) impure {
    repeat (t.tuple_length()) {
        var value = t~tpop();
        if (is_tuple(value)) {
            tuple tuple_value = cast_to_tuple(value);
            iterate_tuple(tuple_value);
        }
        else {
            if(value > max_value) {
                max_value = value;
            }
        }
    }
}

() main () {
    tuple t = to_tuple([[2,6], [1, [3, [3, 5]]], 3]);
    int len = t.tuple_length();
    max_value = 0; ;; Reset max_value;
    iterate_tuple(t); ;; Iterate tuple and find max value
    ~dump(max_value); ;; 6
}
```

**References:**
- [`global variables` in docs](/v3/documentation/smart-contracts/func/docs/global_variables)
- [`~dump` in docs](/v3/documentation/smart-contracts/func/docs/builtins#dump-variable)
- [`TVM instructions` in docs](/v3/documentation/tvm/instructions) 


### Basic operations with tuples

```func
(int) tlen (tuple t) asm "TLEN";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";

() main () {
    ;; creating an empty tuple
    tuple names = empty_tuple(); 
    
    ;; push new items
    names~tpush("Naito Narihira");
    names~tpush("Shiraki Shinichi");
    names~tpush("Akamatsu Hachemon");
    names~tpush("Takaki Yuichi");
    
    ;; pop last item
    slice last_name = names~tpop();

    ;; get first item
    slice first_name = names.first();

    ;; get an item by index
    slice best_name = names.at(2);

    ;; getting the length of the list 
    int number_names = names.tlen();
}
```

### Resolving type X

If a tuple contains various data types X (cell, slice, int, tuple, etc.), we may need to check the value and cast it accordingly before processing.

```func
forall X -> int is_null (X x) asm "ISNULL";
forall X -> int is_int (X x) asm "<{ TRY:<{ 0 PUSHINT ADD DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_cell (X x) asm "<{ TRY:<{ CTOS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_slice (X x) asm "<{ TRY:<{ SBITS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_tuple (X x) asm "ISTUPLE";
forall X -> int cast_to_int (X x) asm "NOP";
forall X -> cell cast_to_cell (X x) asm "NOP";
forall X -> slice cast_to_slice (X x) asm "NOP";
forall X -> tuple cast_to_tuple (X x) asm "NOP";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";

forall X -> () resolve_type (X value) impure {
    ;; Value here is of type X, since we dont know what is the exact value - we would need to check what is the value and then cast it
    
    if (is_null(value)) {
        ;; do something with the null
    }
    elseif (is_int(value)) {
        int valueAsInt = cast_to_int(value);
        ;; do something with the int
    }
    elseif (is_slice(value)) {
        slice valueAsSlice = cast_to_slice(value);
        ;; do something with the slice
    }
    elseif (is_cell(value)) {
        cell valueAsCell = cast_to_cell(value);
        ;; do something with the cell
    }
    elseif (is_tuple(value)) {
        tuple valueAsTuple = cast_to_tuple(value);
        ;; do something with the tuple
    }
}

() main () {
    ;; creating an empty tuple
    tuple stack = empty_tuple();
    ;; let's say we have tuple and do not know the exact types of them
    stack~tpush("Some text");
    stack~tpush(4);
    ;; we use var because we do not know type of value
    var value = stack~tpop();
    resolve_type(value);
}
```

**Reference:** [`TVM instructions` in docs](/v3/documentation/tvm/instructions) 


### How to get current time

```func
int current_time = now();
  
if (current_time > 1672080143) {
    ;; do some stuff 
}
```

### How to generate a random number

:::caution draft

This method is not cryptographically secure.
For more details, see [Random number generation](/v3/guidelines/smart-contracts/security/random-number-generation) section.
:::

```func
randomize_lt(); ;; do this once

int a = rand(10);
int b = rand(1000000);
int c = random();
```

### Modulo operations

As an example, let’s say we need to perform the following calculation for all 256 numbers: 

`(xp + zp) * (xp - zp)`.

Since these operations are commonly used in cryptography, we utilize the modulo operator for montgomery curves.

**Note:**
Variable names like `xp+zp` are valid as long as there are no spaces between the operators.

```func
(int) modulo_operations (int xp, int zp) {  
   ;; 2^255 - 19 is a prime number for montgomery curves, meaning all operations should be done against its prime
   int prime = 57896044618658097711785492504343953926634992332820282019728792003956564819949; 

   ;; muldivmod handles the next two lines itself
   ;; int xp+zp = (xp + zp) % prime;
   ;; int xp-zp = (xp - zp + prime) % prime;
   (_, int xp+zp*xp-zp) = muldivmod(xp + zp, xp - zp, prime);
   return xp+zp*xp-zp;
}
```

**Reference:** [`muldivmod` in docs](/v3/documentation/tvm/instructions#A98C)


### How to throw errors

```func
int number = 198;

throw_if(35, number > 50); ;; the error will be triggered only if the number is greater than 50

throw_unless(39, number == 198); ;; the error will be triggered only if the number is NOT EQUAL to 198

throw(36); ;; the error will be triggered anyway
```

[Standard TVM exception codes](/v3/documentation/tvm/tvm-exit-codes)

### Reversing tuples
Since tuples behave as stacks in FunC, sometimes we need to **reverse** them to access data from the opposite end.

```func
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";
int tuple_length (tuple t) asm "TLEN";
forall X -> (tuple) to_tuple (X x) asm "NOP";

(tuple) reverse_tuple (tuple t1) {
    tuple t2 = empty_tuple();
    repeat (t1.tuple_length()) {
        var value = t1~tpop();
        t2~tpush(value);
    }
    return t2;
}

() main () {
    tuple t = to_tuple([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    tuple reversed_t = reverse_tuple(t);
    ~dump(reversed_t); ;; [10 9 8 7 6 5 4 3 2 1]
}
```

**Reference:** [`tpush()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#tpush)


### How to remove an item with a certain index from the list

```func
int tlen (tuple t) asm "TLEN";

(tuple, ()) remove_item (tuple old_tuple, int place) {
    tuple new_tuple = empty_tuple();

    int i = 0;
    while (i < old_tuple.tlen()) {
        int el = old_tuple.at(i);
        if (i != place) {
            new_tuple~tpush(el);
        }
        i += 1;  
    }
    return (new_tuple, ());
}

() main () {
    tuple numbers = empty_tuple();

    numbers~tpush(19);
    numbers~tpush(999);
    numbers~tpush(54);

    ~dump(numbers); ;; [19 999 54]

    numbers~remove_item(1); 

    ~dump(numbers); ;; [19 54]
}
```

### Determine if the slices are equal

There are two main ways to check if two slices are equal:
- Comparing their hashes.
- Using the SDEQ asm instruction.

```func
int are_slices_equal_1? (slice a, slice b) {
    return a.slice_hash() == b.slice_hash();
}

int are_slices_equal_2? (slice a, slice b) asm "SDEQ";

() main () {
    slice a = "Some text";
    slice b = "Some text";
    ~dump(are_slices_equal_1?(a, b)); ;; -1 = true

    a = "Text";
    ;; We use literal `a` to get valid address inside slice from string containing address
    b = "EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF"a;
    ~dump(are_slices_equal_2?(a, b)); ;; 0 = false
}
```

**References:**
- [`slice_hash()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_hash)
- [`SDEQ` in docs](/v3/documentation/tvm/instructions#C705)

### Determine if the cells are equal
We can determine if two cells are equal by comparing their hashes.

```func
int are_cells_equal? (cell a, cell b) {
    return a.cell_hash() == b.cell_hash();
}

() main () {
    cell a = begin_cell()
            .store_uint(123, 16)
            .end_cell();

    cell b = begin_cell()
            .store_uint(123, 16)
            .end_cell();

    ~dump(are_cells_equal?(a, b)); ;; -1 = true
}
```

**Reference:** [`cell_hash()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#cell_hash)

### Determine if the tuples are equal
A more advanced approach involves iterating through tuples and comparing each value recursively. Since tuples can contain different data types, we must check and cast values dynamically.

```func
int tuple_length (tuple t) asm "TLEN";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";
forall X -> int cast_to_int (X x) asm "NOP";
forall X -> cell cast_to_cell (X x) asm "NOP";
forall X -> slice cast_to_slice (X x) asm "NOP";
forall X -> tuple cast_to_tuple (X x) asm "NOP";
forall X -> int is_null (X x) asm "ISNULL";
forall X -> int is_int (X x) asm "<{ TRY:<{ 0 PUSHINT ADD DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_cell (X x) asm "<{ TRY:<{ CTOS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_slice (X x) asm "<{ TRY:<{ SBITS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_tuple (X x) asm "ISTUPLE";
int are_slices_equal? (slice a, slice b) asm "SDEQ";

int are_cells_equal? (cell a, cell b) {
    return a.cell_hash() == b.cell_hash();
}

(int) are_tuples_equal? (tuple t1, tuple t2) {
    int equal? = -1; ;; initial value to true
    
    if (t1.tuple_length() != t2.tuple_length()) {
        ;; if tuples are differ in length they cannot be equal
        return 0;
    }

    int i = t1.tuple_length();
    
    while (i > 0 & equal?) {
        var v1 = t1~tpop();
        var v2 = t2~tpop();
        
        if (is_null(t1) & is_null(t2)) {
            ;; nulls are always equal
        }
        elseif (is_int(v1) & is_int(v2)) {
            if (cast_to_int(v1) != cast_to_int(v2)) {
                equal? = 0;
            }
        }
        elseif (is_slice(v1) & is_slice(v2)) {
            if (~ are_slices_equal?(cast_to_slice(v1), cast_to_slice(v2))) {
                equal? = 0;
            }
        }
        elseif (is_cell(v1) & is_cell(v2)) {
            if (~ are_cells_equal?(cast_to_cell(v1), cast_to_cell(v2))) {
                equal? = 0;
            }
        }
        elseif (is_tuple(v1) & is_tuple(v2)) {
            ;; recursively determine nested tuples
            if (~ are_tuples_equal?(cast_to_tuple(v1), cast_to_tuple(v2))) {
                equal? = 0;
            }
        }
        else {
            equal? = 0;
        }

        i -= 1;
    }

    return equal?;
}

() main () {
    tuple t1 = cast_to_tuple([[2, 6], [1, [3, [3, 5]]], 3]);
    tuple t2 = cast_to_tuple([[2, 6], [1, [3, [3, 5]]], 3]);

    ~dump(are_tuples_equal?(t1, t2)); ;; -1 
}
```

**References:**
- [`cell_hash()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#cell_hash)
- [`TVM instructions` in docs](/v3/documentation/tvm/instructions)

### Generate an internal address

When deploying a new contract, we need to generate its internal address because it is initially unknown. Suppose we already have `state_init`, which contains the code and data of the new contract.

This function creates an internal address corresponding to the `MsgAddressInt` TLB.

```func
(slice) generate_internal_address (int workchain_id, cell state_init) {
    ;; addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;

    return begin_cell()
        .store_uint(2, 2) ;; addr_std$10
        .store_uint(0, 1) ;; anycast nothing
        .store_int(workchain_id, 8) ;; workchain_id: -1
        .store_uint(cell_hash(state_init), 256)
    .end_cell().begin_parse();
}

() main () {
    slice deploy_address = generate_internal_address(workchain(), state_init);
    ;; then we can deploy new contract
}
```
**Note:** In this example, we use `workchain()` to retrieve the WorkChain ID. You can learn more about the WorkChain ID in [docs](/v3/documentation/smart-contracts/addresses#workchain-id).

**Reference:** [`cell_hash()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#cell_hash)

### Generate an external address

We use the TL-B scheme from [block.tlb](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L101C1-L101C12) to determine the address format to generate an external address.

```func
(int) ubitsize (int a) asm "UBITSIZE";

slice generate_external_address (int address) {
    ;; addr_extern$01 len:(## 9) external_address:(bits len) = MsgAddressExt;
    
    int address_length = ubitsize(address);
    
    return begin_cell()
        .store_uint(1, 2) ;; addr_extern$01
        .store_uint(address_length, 9)
        .store_uint(address, address_length)
    .end_cell().begin_parse();
}
```
Since we need to find the exact number of bits occupied by the address, we must [declare an asm function](#how-to-write-custom-functions-using-asm-keyword) with the `UBITSIZE` opcode. This function will return the minimum number of bits required to store a given number.

**Reference:** [TVM instructions in docs](/v3/documentation/tvm/instructions#B603)

### How to store and load dictionary in a local storage

The logic for loading a dictionary from local storage is as follows:

```func
slice local_storage = get_data().begin_parse();
cell dictionary_cell = new_dict();
if (~ slice_empty?(local_storage)) {
    dictionary_cell = local_storage~load_dict();
}
```

Storing the dictionary follows a similar approach, ensuring data persistence.


```func
set_data(begin_cell().store_dict(dictionary_cell).end_cell());
```

**References:**
- [`get_data()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#get_data)
- [`new_dict()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#new_dict)
- [`slice_empty?()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_empty)
- [`load_dict()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#load_dict)
- [`~` in docs](/v3/documentation/smart-contracts/func/docs/statements#unary-operators)

### How to send a simple message
To send a simple message with a comment, prepend the message body with `32 bits` set to `0`, indicating that it is a `comment`.

```func
cell msg = begin_cell()
    .store_uint(0x18, 6) ;; flags
    .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; destination address
    .store_coins(100) ;; amount of nanoTons to send
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(0, 32) ;; zero opcode - means simple transfer message with comment
    .store_slice("Hello from FunC!") ;; comment
.end_cell();
send_raw_message(msg, 3); ;; mode 3 - pay fees separately, ignore errors
```

**Reference:** [`Message layout` in docs](/v3/documentation/smart-contracts/message-management/sending-messages)

### How to send a message with an incoming account

A proxy contract can facilitate secure message exchange if interaction between a user and the main contract is needed.

```func
() recv_internal (slice in_msg_body) {
    {-
        This is a simple example of a proxy-contract.
        It will expect in_msg_body to contain message mode, body and destination address to be sent to.
    -}

    int mode = in_msg_body~load_uint(8); ;; first byte will contain msg mode
    slice addr = in_msg_body~load_msg_addr(); ;; then we parse the destination address
    slice body = in_msg_body; ;; everything that is left in in_msg_body will be our new message's body

    cell msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(addr)
        .store_coins(100) ;; just for example
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
        .store_slice(body)
    .end_cell();
    send_raw_message(msg, mode);
}
```

**References:**
- [`Message layout` in docs](/v3/documentation/smart-contracts/message-management/sending-messages)
- [`load_msg_addr()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#load_msg_addr)

### How to send a message with the entire balance

To transfer the entire balance of a smart contract, use send `mode 128`. This is particularly useful for proxy contracts that receive payments and forward them to the main contract.

```func
cell msg = begin_cell()
    .store_uint(0x18, 6) ;; flags
    .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; destination address
    .store_coins(0) ;; we don't care about this value right now
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(0, 32) ;; zero opcode - means simple transfer message with comment
    .store_slice("Hello from FunC!") ;; comment
.end_cell();
send_raw_message(msg, 128); ;; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract
```

**References:**
- [`Message layout` in docs](/v3/documentation/smart-contracts/message-management/sending-messages)
- [`Message modes` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#send_raw_message)

### How to send a message with a long text comment

A `cell` can store up to 127 characters (`<1023 bits`). 
A sequence of linked cells ("snake cells") must be used if more space is required.

```func
{-
    If we want to send a message with really long comment, we should split the comment to several slices.
    Each slice should have <1023 bits of data (127 chars).
    Each slice should have a reference to the next one, forming a snake-like structure.
-}

cell body = begin_cell()
    .store_uint(0, 32) ;; zero opcode - simple message with comment
    .store_slice("long long long message...")
    .store_ref(begin_cell()
        .store_slice(" you can store string of almost any length here.")
        .store_ref(begin_cell()
            .store_slice(" just don't forget about the 127 chars limit for each slice")
        .end_cell())
    .end_cell())
.end_cell();

cell msg = begin_cell()
    .store_uint(0x18, 6) ;; flags
    ;; We use literal `a` to get valid address inside slice from string containing address 
    .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; destination address
    .store_coins(100) ;; amount of nanoTons to send
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1) ;; default message headers (see sending messages page)
    .store_uint(1, 1) ;; we want to store body as a ref
    .store_ref(body)
.end_cell();
send_raw_message(msg, 3); ;; mode 3 - pay fees separately, ignore errors
```

**Reference:** [`Internal messages` in docs](/v3/documentation/smart-contracts/message-management/internal-messages)

### How to get only data bits from a slice (without refs)

If `refs` within a `slice` are unnecessary, only the raw data bits can be extracted for further processing.

```func
slice s = begin_cell()
    .store_slice("Some data bits...")
    .store_ref(begin_cell().end_cell()) ;; some references
    .store_ref(begin_cell().end_cell()) ;; some references
.end_cell().begin_parse();

slice s_only_data = s.preload_bits(s.slice_bits());
```

**References:**
- [`Slice primitives` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#slice-primitives)
- [`preload_bits()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#preload_bits)
- [`slice_bits()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_bits)

### How to define a custom modifying method
Modifying methods allow data to be updated within the same variable, similar to references in other programming languages.

```func
(slice, (int)) load_digit (slice s) {
    int x = s~load_uint(8); ;; load 8 bits (one char) from slice
    x -= 48; ;; char '0' has code of 48, so we substract it to get the digit as a number
    return (s, (x)); ;; return our modified slice and loaded digit
}

() main () {
    slice s = "258";
    int c1 = s~load_digit();
    int c2 = s~load_digit();
    int c3 = s~load_digit();
    ;; here s is equal to "", and c1 = 2, c2 = 5, c3 = 8
}
```

**Reference:** [`Modifying methods` in docs](/v3/documentation/smart-contracts/func/docs/statements#modifying-methods)

### How to raise number to the power of n

```func
;; Unoptimized variant
int pow (int a, int n) {
    int i = 0;
    int value = a;
    while (i < n - 1) {
        a *= value;
        i += 1;
    }
    return a;
}

;; Optimized variant
(int) binpow (int n, int e) {
    if (e == 0) {
        return 1;
    }
    if (e == 1) {
        return n;
    }
    int p = binpow(n, e / 2);
    p *= p;
    if ((e % 2) == 1) {
        p *= n;
    }
    return p;
}

() main () {
    int num = binpow(2, 3);
    ~dump(num); ;; 8
}
```

### How to convert string to int

```func
slice string_number = "26052021";
int number = 0;

while (~ string_number.slice_empty?()) {
    int char = string_number~load_uint(8);
    number = (number * 10) + (char - 48); ;; we use ASCII table
}

~dump(number);
```

### How to convert int to string

```func
int n = 261119911;
builder string = begin_cell();
tuple chars = null();
do {
    int r = n~divmod(10);
    chars = cons(r + 48, chars);
} until (n == 0);
do {
    int char = chars~list_next();
    string~store_uint(char, 8);
} until (null?(chars));

slice result = string.end_cell().begin_parse();
~dump(result);
```

### How to iterate dictionaries
Dictionaries are useful for managing large datasets. The built-in methods `dict_get_min?` and `dict_get_max` retrieve the minimum and maximum key values, while `dict_get_next?` allows dictionary iteration.

```func
cell d = new_dict();
d~udict_set(256, 1, "value 1");
d~udict_set(256, 5, "value 2");
d~udict_set(256, 12, "value 3");

;; iterate keys from small to big
(int key, slice val, int flag) = d.udict_get_min?(256);
while (flag) {
    ;; do something with pair key->val
    
    (key, val, flag) = d.udict_get_next?(256, key);
}
```

**References:**
- [`Dictonaries primitives` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#dictionaries-primitives)
- [`dict_get_max?()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get_max)
- [`dict_get_min?()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get_min)
- [`dict_get_next?()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get_next)
- [`dict_set()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_set)

### How to delete value from dictionaries

```func
cell names = new_dict();
names~udict_set(256, 27, "Alice");
names~udict_set(256, 25, "Bob");

names~udict_delete?(256, 27);

(slice val, int key) = names.udict_get?(256, 27);
~dump(val); ;; null() -> means that key was not found in a dictionary
```

### How to iterate a cell tree recursively

Each `cell` can store up to `1023 bits` of data and `4 refs`. A tree of cells can be used to handle more complex data structures, requiring recursive iteration.

```func
forall X -> int is_null (X x) asm "ISNULL";
forall X -> (tuple, ()) push_back (tuple tail, X head) asm "CONS";
forall X -> (tuple, (X)) pop_back (tuple t) asm "UNCONS";

() main () {
    ;; just some cell for example
    cell c = begin_cell()
        .store_uint(1, 16)
        .store_ref(begin_cell()
            .store_uint(2, 16)
        .end_cell())
        .store_ref(begin_cell()
            .store_uint(3, 16)
            .store_ref(begin_cell()
                .store_uint(4, 16)
            .end_cell())
            .store_ref(begin_cell()
                .store_uint(5, 16)
            .end_cell())
        .end_cell())
    .end_cell();

    ;; creating tuple with no data, which plays the role of stack
    tuple stack = null();
    ;; bring the main cell into the stack to process it in the loop
    stack~push_back(c);
    ;; do it until stack is not null
    while (~ stack.is_null()) {
        ;; get the cell from the stack and convert it to a slice to be able to process it
        slice s = stack~pop_back().begin_parse();

        ;; do something with s data

        ;; if the current slice has any refs, add them to stack
        repeat (s.slice_refs()) {
            stack~push_back(s~load_ref());
        }
    }
}
```

**References:**
- [`Lisp-style lists` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#lisp-style-lists)
- [`null()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#null)
- [`slice_refs()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_refs)

### How to iterate through lisp-style list
A tuple can hold up to 255 values. If more space is needed, a lisp-style list can be used by nesting tuples within tuples, effectively bypassing the limit.

```func
forall X -> int is_null (X x) asm "ISNULL";
forall X -> (tuple, ()) push_back (tuple tail, X head) asm "CONS";
forall X -> (tuple, (X)) pop_back (tuple t) asm "UNCONS";

() main () {
    ;; some example list
    tuple l = null();
    l~push_back(1);
    l~push_back(2);
    l~push_back(3);

    ;; iterating through elements
    ;; note that this iteration is in reversed order
    while (~ l.is_null()) {
        var x = l~pop_back();

        ;; do something with x
    }
}
```

**References:**
- [`Lisp-style lists` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#lisp-style-lists)
- [`null()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#null)

### How to send a deploy message (with stateInit only, with stateInit and body)

```func
() deploy_with_stateinit(cell message_header, cell state_init) impure {
  var msg = begin_cell()
    .store_slice(begin_parse(msg_header))
    .store_uint(2 + 1, 2) ;; init:(Maybe (Either StateInit ^StateInit))
    .store_uint(0, 1) ;; body:(Either X ^X)
    .store_ref(state_init)
    .end_cell();

  ;; mode 64 - carry the remaining value in the new message
  send_raw_message(msg, 64); 
}

() deploy_with_stateinit_body(cell message_header, cell state_init, cell body) impure {
  var msg = begin_cell()
    .store_slice(begin_parse(msg_header))
    .store_uint(2 + 1, 2) ;; init:(Maybe (Either StateInit ^StateInit))
    .store_uint(1, 1) ;; body:(Either X ^X)
    .store_ref(state_init)
    .store_ref(body)
    .end_cell();

  ;; mode 64 - carry the remaining value in the new message
  send_raw_message(msg, 64); 
}
```

### How to build a stateInit cell

```func
() build_stateinit(cell init_code, cell init_data) {
  var state_init = begin_cell()
    .store_uint(0, 1) ;; split_depth:(Maybe (## 5))
    .store_uint(0, 1) ;; special:(Maybe TickTock)
    .store_uint(1, 1) ;; (Maybe ^Cell)
    .store_uint(1, 1) ;; (Maybe ^Cell)
    .store_uint(0, 1) ;; (HashmapE 256 SimpleLib)
    .store_ref(init_code)
    .store_ref(init_data)
    .end_cell();
}
```

### How to calculate a contract address (using stateInit)

```func
() calc_address(cell state_init) {
  var future_address = begin_cell() 
    .store_uint(2, 2) ;; addr_std$10
    .store_uint(0, 1) ;; anycast:(Maybe Anycast)
    .store_uint(0, 8) ;; workchain_id:int8
    .store_uint(cell_hash(state_init), 256) ;; address:bits256
    .end_cell();
}
```

### How to update the smart contract logic

Below is an example of a simple `CounterV1` smart contract that allows the counter to be incremented and includes logic for updating the contract.
```func
() recv_internal (slice in_msg_body) {
    int op = in_msg_body~load_uint(32);
    
    if (op == op::increase) {
        int increase_by = in_msg_body~load_uint(32);
        ctx_counter += increase_by;
        save_data();
        return ();
    }

    if (op == op::upgrade) {
        cell code = in_msg_body~load_ref();
        set_code(code);
        return ();
    }
}
```
After interacting with the contract, you may realize that the functionality for decrementing the counter is missing. To fix this, copy the code from `CounterV1` and add a new `decrease` function next to the existing `increase` function. Your updated code will look like this:


```func
() recv_internal (slice in_msg_body) {
    int op = in_msg_body~load_uint(32);
    
    if (op == op::increase) {
        int increase_by = in_msg_body~load_uint(32);
        ctx_counter += increase_by;
        save_data();
        return ();
    }

    if (op == op::decrease) {
        int decrease_by = in_msg_body~load_uint(32);
        ctx_counter -= increase_by;
        save_data();
        return ();
    }

    if (op == op::upgrade) {
        cell code = in_msg_body~load_ref();
        set_code(code);
        return ();
    }
}
```

Once the `CounterV2` smart contract is ready, you need to compile it off-chain into a `cell` and send an upgrade message to the `CounterV1` contract:


```javascript
await contractV1.sendUpgrade(provider.sender(), {
    code: await compile('ContractV2'),
    value: toNano('0.05'),
});
```

**References:**
- [Is it possible to redeploy code to an existing address, or does it have to be deployed as a new contract?](/v3/documentation/faq#is-it-possible-to-redeploy-code-to-an-existing-address-or-must-it-be-deployed-as-a-new-contract)
- [`set_code()` in docs](/v3/documentation/smart-contracts/func/docs/stdlib#set_code)






<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/func/docs/builtins.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/func/docs/builtins.md
================================================
import Feedback from '@site/src/components/Feedback';

# Built-ins

This section covers extra language constructs that are not part of the core but are still important for functionality. 
Although they could be implemented in [stdlib.fc](/v3/documentation/smart-contracts/func/docs/stdlib/),
keeping them as built-in features allows the FunC optimizer to work more efficiently.

## Throwing exceptions

FunC provides several built-in primitives for throwing exceptions:
- **Conditional exceptions:** `throw_if` and `throw_unless`
- **Unconditional exception:** `throw`

In `throw_if` and `throw_unless`, the first argument (the error code) defines the exception type,
while the second argument (the condition) determines whether the exception is thrown.
Meanwhile, the `throw` function takes only one argument—the error code—since it always triggers an exception.

FunC also includes parameterized versions of these primitives:
- **Conditional exceptions with parameters:** `throw_arg_if` and `throw_arg_unless`
- **Unconditional exception with a parameter:** `throw_arg`

In these versions, the first argument is an exception parameter of any type, the second defines the error code, and the third argument—used when needed—is a condition that determines whether the exception is thrown.

## Booleans
- `true` is an alias for `-1`. 
- `false` is an alias for `0`.

## Dumping a variable
Use the `~dump` function to output a variable to the debug log.

## Dumping a string
Use the `~strdump` function to output a string to the debug log.

## Integer operations
- `muldiv` performs a multiply-then-divide operation. 
It uses a 513-bit intermediate result to prevent overflow if the final result fits within 257 bits.
- `divmod` takes two numbers as input and returns the quotient and remainder of their division.


## Other primitives
- `null?` checks if the given argument is `null`. In FunC, the value `null` belongs to the TVM type `Null`, which represents the absence of a value for certain atomic types. See [null values](/v3/documentation/smart-contracts/func/docs/types#null-values) for details.
- `touch` and `~touch` push a variable to the top of the stack.
- `at` returns the value of a tuple element at the specified position.
<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/func/docs/comments.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/func/docs/comments.md
================================================
import Feedback from '@site/src/components/Feedback';

# Comments

FunC supports both single-line and multi-line comments.

**Single-line** comments start with `;;` (double semicolon). Example:

```func
int x = 1; ;; assigns 1 to x
```

**Multi-line** comments begin with `{-` and end with `-}`.
Unlike other languages, FunC allows nested multi-line comments.
Example:

```func
{- This is a multi-line comment
    {- This is a comment inside a comment -}
-}
```


Additionally, single-line comments `;;` can appear inside multi-line comments, and they take precedence over multi-line comments `{- -}`. In the following example:

```func
{-
  Start of the comment

;; This comment’s ending is itself commented out -> -}

const a = 10;

;; This comment’s beginning is itself commented out -> {-

  End of the comment
-}
```

Here, `const a = 10;` is inside a multi-line comment and is effectively commented out.
<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/func/docs/compiler_directives.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/func/docs/compiler_directives.md
================================================
import Feedback from '@site/src/components/Feedback';

# Compiler directives
Compiler directives are keywords that begin with `#`, instructing the compiler to perform specific actions, enforce checks, or modify parameters.

These directives can only be used at the outermost level of a source file and cannot be placed inside function definitions.

## #include
The `#include` directive enables the inclusion of another FunC source file parsed in place of the directive.

**Syntax:**

```func
#include "filename.fc";
```

Files are automatically checked for multiple inclusions. By default, the compiler will ignore redundant inclusions if the same file is included more than once. A warning will be issued if the verbosity level is 2 or higher.

If an error occurs while parsing an included file, the compiler displays an inclusion stack, showing the locations of each file in the inclusion chain.

## #pragma
The `#pragma` directive provides additional information to the compiler beyond what the language conveys.


### #pragma version
The `#pragma` version directive enforces using a specific FunC compiler version when compiling the file.

The version is specified in **semantic versioning (semver)** format: _a.b.c_, where:
- _a_ is the major version;
- _b_ is the minor version;
- _c_ is the patch version.

**Supported comparison operators**

Developers can specify version constraints using the following operators:

* _a.b.c_ or _=a.b.c_—Requires **exactly** version _a.b.c_ of the compiler;
* _>a.b.c_—Requires the compiler version to be **greater** than _a.b.c._;
  * _>=a.b.c_—Requires the compiler version to be **greater** than or **equal** to _a.b.c_;
* _\<a.b.c_— Requires the compiler version to be **less** than _a.b.c_;
  * _\<=a.b.c_—Requires the compiler version to be **less** than or **equal** to _a.b.c_;
* _^a.b.c_—Requires the major compiler version to be **equal** to the _a_ part and the minor to be **no lower** than the _b_ part;
  * _^a.b_—Requires the major compiler version to be **equal* to _a_ part and minor be **no lower** than _b_ part;
  * _^a_—Requires the major compiler version to be **no lower** than _a_ part.

For comparison operators (_=_, _>_, _>=_, _\<_, _\<=_) , omitted parts default to zero.
For example:

* _>a.b_ is equivalent to _>a.b.0_ and **does not** match version _a.b.0._;
* _\<=a_ is equivalent to _\<=a.0.0_ and **does not** match version _a.0.1_ version;
* _^a.b.0_ is **not the same** as _^a.b_

**Examples:**
-  _^a.1.2_ matches _a.1.3_ but not _a.2.3_ or _a.1.0_;
- _^a.1_ matches all of them.

The `#pragma` version directive can be used multiple times, and the compiler must satisfy all specified conditions.

### #pragma not-version

The syntax of `#pragma not-version` is identical to `#pragma version`, but it fails if the specified condition is met.

This directive is applicable for blocking specific compiler versions known to have issues.


### #pragma allow-post-modification
_Introduced in FunC v0.4.1_

Using a variable before it is modified within the same expression is prohibited by default.

For example, the following code **will not compile**:

```func
(x, y) = (ds, ds~load_uint(8))
```

However, this version is **valid**:

```func
(x, y) = (ds~load_uint(8), ds)
```
To override this restriction, use `#pragma allow-post-modification`. This allows variables to be modified after usage in mass assignments and function calls while sub-expressions are still computed **left to right**.

In the following example, `x` will contain the initial value of `ds`:
```func
#pragma allow-post-modification
(x, y) = (ds, ds~load_bits(8)); 
```

Here, in `f(ds, ds~load_bits(8));`:
- The first argument of `f` will contain the initial value of `ds`.
- The second argument will contain the 8-bit-modified value of `ds`.

`#pragma allow-post-modification` works only for code after the pragma.

### #pragma compute-asm-ltr
_Introduced in FunC v0.4.1_

`asm` declarations can override the order of argument evaluation. For example, in the following expression:

```func
idict_set_ref(ds~load_dict(), ds~load_uint(8), ds~load_uint(256), ds~load_ref())
```

The execution order is:
1. `load_ref()`
2. `load_uint(256)`
3. `load_dict()`
4. `load_uint(8)`
   
This happens due to the corresponding `asm` declaration:

```func
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
```
Here, the `asm(value index dict key_len)` notation dictates a reordering of arguments.


To ensure strict left-to-right computation order, use `#pragma compute-asm-ltr`. With this directive enabled, the same function call:

```func
#pragma compute-asm-ltr
...
idict_set_ref(ds~load_dict(), ds~load_uint(8), ds~load_uint(256), ds~load_ref());
```

will be evaluated in the following order:
1. `load_dict()`
2. `load_uint(8)`
3. `load_uint(256)`
4. `load_ref()`

All `asm` reordering will occur only after computation.

`#pragma compute-asm-ltr` works only for code after the pragma.


**Note:** `#pragma compute-asm-ltr` applies only to the code after the directive in the file.
<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/func/docs/dictionaries.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/func/docs/dictionaries.md
================================================
import Feedback from '@site/src/components/Feedback';

# Dictionaries in TON

Smart contracts in TON can utilize dictionaries structured as ordered key-value mappings. Internally, these dictionaries are represented as tree-like structures composed of cells.

:::warning
Handling potentially large trees of cells in TON introduces several important considerations:

1. **Gas consumption for updates**
- Every update operation generates many new cells, costing 500 gas, as detailed on the [TVM instructions](/v3/documentation/tvm/instructions#gas-prices) page. 
- Careless updates can lead to excessive gas usage, potentially causing operations to fail due to gas exhaustion.
- Example: This issue occurred with the **Wallet bot** using the **highload-v2 wallet**. Each iteration's unbounded loop and expensive dictionary updates led to gas depletion. As a result, the bot triggered repeated transactions, eventually draining its balance ([see transaction details](https://tonviewer.com/transaction/fd78228f352f582a544ab7ad7eb716610668b23b88dae48e4f4dbd4404b5d7f6)).


2. **Storage limitation**
- A binary tree containing **N** key-value pairs requires **N-1 forks**, resulting in **at least 2N-1 cells**. 
- Since smart contract storage in TON is capped at 65,536 unique cells, the maximum number of dictionary entries is approximately 32,768. This limit may be slightly higher if some cells are reused within the structure.

:::

## Dictionary kinds

### "Hash" map

Hashmaps are the most widely used dictionary type in TON. They have a dedicated set of TVM opcodes for manipulation and are commonly used in smart contracts (see [TVM instructions](/v3/documentation/tvm/instructions#quick-search) - Dictionary manipulation).


Hashmaps map fixed-length keys, which are defined as an argument to all functions, to value slices. Despite the "hash" in its name, entries are ordered and allow efficient access to elements by key and retrieval of the previous or next key-value pair. Since values share space with internal node tags and possibly key fragments within the same cell, they cannot utilize the full 1023 bits. In such cases, the `~udict_set_ref` function often helps.

An empty hashmap is represented as `null` in TVM, meaning it is not stored as a cell. A single bit is first saved to store a dictionary in a cell (0 for empty, 1 otherwise), 
followed by a reference if the hashmap is not empty. This makes `store_maybe_ref` and `store_dict` interchangeable. Some smart contract developers use `load_dict` to load a `Maybe ^Cell` from an incoming message or storage.


**Available hashmap operations:**
- Load from a slice, store to a builder;
- Get/Set/Delete a value by key;
- Replace a value (update an existing key) or add a new value (if the key is absent);
- Move to the next/previous key-value pair (entries are ordered by keys, enabling [iteration](/v3/documentation/smart-contracts/func/cookbook#how-to-iterate-dictionaries) if gas constraints allow);
- Retrieve the minimal or maximal key with its value;
- Fetch and execute a function (continuation) by key.

To prevent gas exhaustion, smart contracts should limit the number of dictionary updates per transaction. If a contract's balance is used to maintain the hashmap under specific conditions, it can send itself a message to continue processing in another transaction.


:::info

TVM provides instructions for retrieving a subdictionary—a subset of entries within a given key range. These operations (`SUBDICTGET` and similar) are currently untested and can only be explored at the TVM assembly level.

:::

#### Hashmap examples

To illustrate, let's examine a hashmap that maps 257-bit integer keys to empty value slices. This type of hashmap serves as a presence indicator, storing only the existence of elements.

You can quickly check this by running the following Python script. If needed, you can use a different SDK instead of `pytoniq`:


```python
import pytoniq
k = pytoniq.HashMap(257)
em = pytoniq.begin_cell().to_slice()
k.set(5, em)
k.set(7, em)
k.set(5 - 2**256, em)
k.set(6 - 2**256, em)
print(str(pytoniq.begin_cell().store_maybe_ref(k.serialize()).end_cell()))
```

This structure forms a binary tree, which appears balanced except for the root cell:

```
1[80] -> {
	2[00] -> {
		265[9FC00000000000000000000000000000000000000000000000000000000000000080] -> {
			4[50],
			4[50]
		},
		266[9FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF40] -> {
			2[00],
			2[00]
		}
	}
}
```


For further [examples of hashmap parsing](/v3/documentation/data-formats/tlb/tl-b-types#hashmap-parsing-example), refer to the official documentation.

### Augmented maps 
Augmented maps with additional data in each node are used internally by TON validators to calculate the total balance of all contracts in a shard. By storing the total subtree balance in each node, validators can quickly validate updates. There are no TVM primitives for working with these maps.



### Prefix dictionary

:::info
Testing shows that documentation on prefix dictionaries is insufficient. Avoid using them in production contracts unless you fully understand how the relevant opcodes, such as `PFXDICTSET`, work.
:::

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/func/docs/functions.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/func/docs/functions.md
================================================
import Feedback from '@site/src/components/Feedback';

# Functions
A FunC program is a list of function declarations, function definitions, and global variable declarations. This section focuses on function declarations and definitions.

Every function declaration or definition follows a common pattern, after which one of three elements appears:

- A single semicolon `;` indicates that the function is declared but not yet defined. Its definition must appear later in the same file or a different file processed before the current one by the FunC compiler. For example:
  ```func
  int add(int x, int y);
  ```
  This declares a function named `add` with the type `(int, int) → int` but does not define it.

- An assembler function body definition defines the function using low-level TVM primitives for use in a FunC program. For example:
  ```func
  int add(int x, int y) asm "ADD";
  ```
  This defines the function `add` using the TVM opcode `ADD`, keeping its type as `(int, int) → int`.

- A standard function body uses a block statement, the most common way to define functions. For example:
  ```func
  int add(int x, int y) {
    return x + y;
  }
  ```
  This is a standard definition of the `add` function.

## Function declaration
As mentioned earlier, every function declaration or definition follows a common pattern. The general form is:
```func
[<forall declarator>] <return_type> <function_name>(<comma_separated_function_args>) <specifiers>
```
where `[ ... ]` represents an optional entry.

### Function name

A function name can be any valid [identifier](/v3/documentation/smart-contracts/func/docs/literals_identifiers#identifiers). Additionally, it may start with the symbols `.` or `~`, which have specific meanings explained in the [Statements](/v3/documentation/smart-contracts/func/docs/statements#methods-calls) section.

For example, `udict_add_builder?`, `dict_set`, and `~dict_set` are all valid function names, and each is distinct. These functions are defined in [stdlib.fc](/v3/documentation/smart-contracts/func/docs/stdlib).

#### Special function names
FunC (specifically, the Fift assembler) reserves several function names with predefined [IDs](/v3/documentation/smart-contracts/func/docs/functions#method_id):

- `main` and `recv_internal` have `id = 0`
- `recv_external` has `id = -1`
- `run_ticktock` has `id = -2`

Every program must include a function with `id = 0`, meaning it must define either `main` or `recv_internal`.The `run_ticktock` function is used in ticktock transactions of special smart contracts.

#### Receive internal

The `recv_internal` function is invoked when a smart contract receives **an inbound internal message**. When the [TVM initializes](/v3/documentation/tvm/tvm-overview#initialization-of-tvm), certain variables are automatically placed on the stack. By specifying arguments in `recv_internal`, the smart contract can access some of these values. Any values not explicitly referenced in the function parameters will remain unused at the bottom of the stack.

The following `recv_internal` function declarations are all valid. Functions with fewer parameters consume slightly less gas, as each unused argument results in an additional `DROP` instruction:

```func

() recv_internal(int balance, int msg_value, cell in_msg_cell, slice in_msg) {}
() recv_internal(int msg_value, cell in_msg_cell, slice in_msg) {}
() recv_internal(cell in_msg_cell, slice in_msg) {}
() recv_internal(slice in_msg) {}
```

#### Receive external
The `recv_external` function handles **inbound external messages**.

### Return type

The return type can be any atomic or composite type, as described in the [Types](/v3/documentation/smart-contracts/func/docs/types) section. For example, the following function declarations are valid:
```func
int foo();
(int, int) foo'();
[int, int] foo''();
(int → int) foo'''();
() foo''''();
```

FunC also supports **type inference**. For example:
```func
_ pyth(int m, int n) {
  return (m * m - n * n, 2 * m * n, m * m + n * n);
}
```
This is a valid definition of the function `pyth`, which has the inferred type `(int, int) → (int, int, int)`. 
It computes Pythagorean triples based on the given input values.

### Function arguments

In function arguments, commas separate it. The following types of argument declarations are valid:

- Ordinary declaration: an argument is declared using **its type** followed by **its name**. Example: `int x` declares an argument named `x` of type `int` in the function declaration: `() foo(int x);`.

- Unused argument declaration: only its type needs to be specified. Example:
  ```func
  int first(int x, int) {
    return x;
  }
  ```
  This is a valid function definition of type `(int, int) → int`. 


- Argument with inferred type declaration: If an argument's type is not explicitly declared, it is inferred by the type-checker.
  For example,
  ```func
  int inc(x) {
    return x + 1;
  }
  ```
  This defines a function `inc` with the inferred type `int → int`, meaning `x` is automatically recognized as an `int`.


**Argument tensor representation**

Even though a function may appear to take multiple arguments, it takes a single [tensor-type](/v3/documentation/smart-contracts/func/docs/types#tensor-types) argument. For more details on this distinction, refer to the [Function application](/v3/documentation/smart-contracts/func/docs/statements#function-application) section. 
However, for convenience, the individual components of this tensor are conventionally referred to as "function arguments."

### Function calls

#### Non-modifying methods

:::info
A non-modifying function supports a shorthand method call syntax using `.`
:::

```func
example(a);
a.example();
```

A function with at least **one argument**, it can be called a **non-modifying method**. For example, the function `store_uint` has the type `(builder, int, int) → builder`, where:
- The second argument is the value to store.
- The third argument is the bit length.

The function `begin_cell` creates a new `builder`. The following two code snippets are equivalent:

```func
builder b = begin_cell();
b = store_uint(b, 239, 8);
```
```func
builder b = begin_cell();
b = b.store_uint(239, 8);
```
So the first argument of a function can be passed to it being located before the function name, if separated by `.`. The code can be further simplified:

The function's first argument is passed before the function name, separated by `.`. The syntax can be further condensed into a single statement:

```func
builder b = begin_cell().store_uint(239, 8);
```

It is also possible to chain multiple method calls:
```func
builder b = begin_cell().store_uint(239, 8)
                        .store_int(-1, 16)
                        .store_uint(0xff, 10);
```

#### Modifying functions
:::info
A modifying function supports a short form using the `~` and `.` operators.
:::


If:
- The first argument of a function has type `A`.
- The function's return type is `(A, B)`, where `B` is any arbitrary type.

Then, the function can be called a modifying method.

Modifying functions change their first argument. They assign the first component of the returned value to the variable initially passed as the first argument.
The following calls are equivalent:

```func
a~example(); ;;Modifying method syntax
a = example(a); ;;Standard function call
```

**Example:** `load_uint`

Suppose `cs` is a cell slice, and `load_uint` has type `(slice, int) → (slice, int)`. It means:
- `load_uint` takes a cell slice and several bits to load.
- It returns the remaining slice and the loaded value.

The following calls are equivalent:

```func
(cs, int x) = load_uint(cs, 8); ;; Standard function call
```
```func
(cs, int x) = cs.load_uint(8); ;; Method call syntax
```
```func
int x = cs~load_uint(8); ;; Modifying method syntax
```

**Modifying methods with no return value**

Sometimes, a function only modifies its first argument without returning a meaningful value. To enable modifying method syntax, such functions should return a unit type () as the second component.

For example, suppose we want to define a function `inc` of type `int → int`, which increments an integer. To use it as a modifying method, we define it as follows:

```func
(int, ()) inc(int x) {
  return (x + 1, ());
}
```

Now, the function can be used in modifying method syntax:

```func
x~inc(); ;;Equivalent to x = inc(x);
```
This will increment `x` in place.

#### `.` and `~` in function names

Suppose we want to use `inc` as a non-modifying method. We can write:

```func
(int y, _) = inc(x);
```

However, we can also define `inc` as a modifying method:

```func
int inc(int x) {
  return x + 1;
}
(int, ()) ~inc(int x) {
  return (x + 1, ());
}
```
Now, we can call it in different ways:
```func
x~inc(); ;; Modifies x
int y = inc(x); ;; Doesn't modify x
int z = x.inc(); ;; Also doesn't modify x
```
**How FunC resolves function calls**
- If a function is called with `.` (e.g., `x.foo()`), the compiler looks for a `.foo` definition.
- If a function is called with `~` (e.g., `x~foo()`), the compiler looks for a `~foo` definition.
- If neither `.foo` nor `~foo` is defined, the compiler falls back to the regular `foo` definition.


### Specifiers

In FunC, function specifiers modify the behavior of functions. There are three types:
1. `impure`
2. `inline`/ `inline_ref`
3. `method_id`

One, multiple, or none can be used in a function declaration. However, they must appear in a specific order (e.g., `impure` must come before `inline`).


#### Impure specifier

The `impure` specifier indicates that a function has side effects, such as modifying contract storage, sending messages, or throwing exceptions.
If a function is not marked as `impure` and its result is unused, the FunC compiler may delete the function call for optimization.

For example, in the [stdlib.fc](/v3/documentation/smart-contracts/func/docs/stdlib) function:

```func
int random() impure asm "RANDU256";
```
Here, `RANDU256` changes the internal state of the random number generator. The `impure` keyword prevents the compiler from removing this function call.


#### Inline specifier

A function marked as `inline` is directly substituted into the code wherever it is called.
Recursive calls are not allowed for inline functions.

**Example**

```func
(int) add(int a, int b) inline {
    return a + b;
}
```
Since the `add` function is marked with the `inline` specifier, the compiler substitutes `add(a, b)` with `a + b` directly in the code, eliminating the function call overhead.


Another example of using `inline` from [ICO-Minter.fc](https://github.com/ton-blockchain/token-contract/blob/f2253cb0f0e1ae0974d7dc0cef3a62cb6e19f806/ft/jetton-minter-ICO.fc#L16):

```func
() save_data(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) impure inline {
  set_data(begin_cell()
            .store_coins(total_supply)
            .store_slice(admin_address)
            .store_ref(content)
            .store_ref(jetton_wallet_code)
           .end_cell()
          );
}
```

#### Inline_ref specifier
When a function is marked with the `inline_ref` specifier, its code is stored in a separate cell. Each time the function is called, TVM executes a `CALLREF` command. This works similarly to `inline`, but with a key difference—since the same cell can be reused multiple times without duplication, `inline_ref` is generally more efficient regarding code size. The only case where `inline` might be preferable is if the function is called just once. However, recursive calls to `inline_ref` functions remain impossible, as TVM cells do not support cyclic references.


#### method_id

In a TVM program, every function has an internal integer ID that determines how it can be called. 
By default, ordinary functions are assigned sequential numbers starting from `1`, while contract get-methods use `crc16` hashes of their names.
The `method_id(<some_number>)` specifier allows you to set a function's ID to a specific value manually. 
If no ID is specified, the default is calculated as `(crc16(<function_name>) & 0xffff) | 0x10000`. 
If a function has the `method_id` specifier, it can be invoked by its name as a get-method in lite client or TON explorer.

:::warning Important limitations and recommendations
**19-bit limitation**: Method IDs are limited to 19 bits by the TVM assembler, meaning the valid range is **0 to 524,287** (2^19 - 1).

**Reserved ranges**:
- **0-999**: Reserved for system functions (approximate range)
- **Special functions**: `main`/`recv_internal` (id=0), `recv_external` (id=-1), `run_ticktock` (id=-2)  
- **65536+**: Default range for user functions when using automatic generation `(crc16() & 0xffff) | 0x10000`

**Best practice**: It's recommended to **avoid setting method IDs manually** and rely on automatic generation instead. Manual assignment can lead to conflicts and unexpected behavior.
:::

<details>
<summary><b>Technical details about method_id parsing</b></summary>

While the FunC compiler can initially accept larger hex values during parsing, the actual limitation comes from the TVM assembler which restricts method IDs to 19 bits (`@procdictkeylen = 19` in Asm.fif).

The parsing of the hexadecimal string for `method_id` is handled by functions in `crypto/common/bigint.hpp` (specifically `AnyIntView::parse_hex_any` called via `td::string_to_int256` and `BigInt<257>::parse_hex`).

`AnyIntView::parse_hex_any` first performs a basic check on the length of the hex string:
```cpp
if ((j - i - (p > 0)) * 4 > (max_size() - 1) * word_shift + word_bits - 2) {
  return 0; // Invalid if too long
}
```

For `BigInt<257>` (which is `td::BigIntG<257, td::BigIntInfo>`):
- `Tr` is `BigIntInfo`.
- `word_bits` (bits in a word) is 64.
- `word_shift` (effective bits used per word in normalization) is 52. (Source: `crypto/common/bigint.hpp`)
- `max_size()` (maximum words for `BigInt<257>`) is `(257 + 52 - 1) / 52 + 1 = 6` words.

Let's plug these values into the length check formula:
`(max_size() - 1) * word_shift + word_bits - 2`
`(6 - 1) * 52 + 64 - 2 = 5 * 52 + 62 = 260 + 62 = 322` bits.

A 65-character hex string represents \( 65 times 4 = 260 \) bits.
The calculated bit limit for the quick check is 322 bits. Since `260` is not greater than `322`, such a number (65 hex digits) can *pass* this initial length check. This check is designed to quickly reject inputs that are grossly too large. The `-2` offers a slight margin.

After this initial parsing into internal `digits_`, `parse_hex_any` calls `normalize_bool_any()`. This function converts the internal representation into a canonical signed form.
If `normalize_bool_any()` returns `false`, it indicates an overflow during this canonicalization. This can happen even if the number passed the initial length check, for example, if a carry propagates such that it requires more than `max_size()` words to represent in the specific signed format, or if the most significant word itself overflows. In such a case, `parse_hex_any` invalidates the `BigInt` and returns `0`, leading to `td::string_to_int256` returning a `null RefInt256` and FunC reporting an "invalid integer constant".
</details>

**Example**
```func
int get_counter() method_id {
  load_data();
  return ctx_counter;
}
```

### Polymorphism with forall
Before any function declaration or definition, there can be `forall` type variables declarator. It has the following syntax:

A function definition can include a `forall` type variable declaration before its declaration or implementation. The syntax is:

```func
forall <comma_separated_type_variables_names> ->
```

Here, type variable names can be any [identifier](/v3/documentation/smart-contracts/func/docs/literals_identifiers#identifiers) but are typically written in capital letters.

For example,
```func
forall X, Y -> [Y, X] pair_swap([X, Y] pair) {
  [X p1, Y p2] = pair;
  return [p2, p1];
}
```


This function takes a tuple of exactly two elements, where each component can be of any type that fits in a single stack entry. It swaps the two values. For instance:
- `pair_swap([2, 3])` returns `[3, 2]`;
- `pair_swap([1, [2, 3, 4]])` returns `[[2, 3, 4], 1]`.

In this example, `X` and `Y` are [type variables](/v3/documentation/smart-contracts/func/docs/types#polymorphism-with-type-variables). When the function is called, these variables are replaced with actual types, and the function executes accordingly. Even though the function is polymorphic, the compiled assembly code remains the same for any type substitution. This is possible due to the polymorphic nature of stack manipulation operations. However, other forms of polymorphism, such as `ad-hoc` polymorphism with type classes, are not currently supported.

It is important to note that `X` and `Y` must each have a type width of 1, meaning they should fit within a single stack entry. This means you can't use `pair_swap` on a tuple like `[(int, int), int]` because type `(int, int)` has a width of 2, taking up two stack entries instead of one.


## Assembler function body definition

In FunC, functions can be defined directly using assembler code. This is done using the `asm` keyword, followed by one or more assembler commands written as strings.
For example, the following function increments an integer and then negates it:

```func
int inc_then_negate(int x) asm "INC" "NEGATE";
```
– a function that increments an integer and then negates it. Calls to this function will be translated to 2 assembler commands `INC` and `NEGATE`. An alternative way to define the function is:

When called, this function is directly translated into the two assembler commands, `INC` and `NEGATE`.
Alternatively, the function can be written as:

```func
int inc_then_negate'(int x) asm "INC NEGATE";
```
Here, `INC NEGATE` is treated as a single assembler command by FunC, but the Fift assembler correctly interprets it as two separate commands.

:::info
The list of assembler commands can be found here: [TVM instructions](/v3/documentation/tvm/instructions).
:::

### Rearranging stack entries
Sometimes, the order in which function arguments are passed may not match the expected order of an assembler command. Similarly, the returned values may need to be arranged differently. While this can be done manually using stack manipulation primitives, FunC automatically handles it.

:::info
When manually rearranging arguments, they are computed in the new order. To overwrite this behavior use `#pragma compute-asm-ltr`: [compute-asm-ltr](/v3/documentation/smart-contracts/func/docs/compiler_directives#pragma-compute-asm-ltr)
:::

For instance, the assembler command `STUXQ` takes an integer, a builder, and another integer as input. It then returns the builder and an integer flag indicating whether the operation succeeded. We can define the corresponding function as follows:

```func
(builder, int) store_uint_quite(int x, builder b, int len) asm "STUXQ";
```
However, if we need to rearrange the order of arguments, we can specify them explicitly in the `asm` declaration:

```func
(builder, int) store_uint_quite(builder b, int x, int len) asm(x b len) "STUXQ";
```
So you can indicate the required order of arguments after the `asm` keyword.

This allows us to control the order in which arguments are passed to the assembler command.

Similarly, we can rearrange return values using the following notation:

```func
(int, builder) store_uint_quite(int x, builder b, int len) asm( -> 1 0) "STUXQ";
```



Here, the numbers indicate the order of return values, where `0` represents the deepest stack entry.

Additionally, we can combine these techniques:
```func
(int, builder) store_uint_quite(builder b, int x, int len) asm(x b len -> 1 0) "STUXQ";
```

### Multiline asms
Multiline assembler commands, including Fift code snippets, can be defined using triple-quoted strings `"""`.

```func
slice hello_world() asm """
  "Hello"
  " "
  "World"
  $+ $+ $>s
  PUSHSLICE
""";
```

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/func/docs/global_variables.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/func/docs/global_variables.md
================================================
import Feedback from '@site/src/components/Feedback';

# Global variables

A FunC program primarily consists of function declarations/definitions and global variable declarations. 
This section focuses on the latter.

**A global variable** is declared using the `global` keyword, followed by the variable's type and name. For example:

```func
global ((int, int) -> int) op;
```
Here's a simple program demonstrating how to use a global functional variable:

```func
int check_assoc(int a, int b, int c) {
  return op(op(a, b), c) == op(a, op(b, c));
}

int main() {
  op = _+_;
  return check_assoc(2, 3, 9);
}
```

In this example, the global variable `op` is assigned the addition operator `_+_`. The program then verifies the associativity of addition using three sample integers: 2, 3, and 9.

Under the hood, global variables in FunC are stored in the `c7` control register of the TVM, with a maximum limit of 31 variables.


In FunC, you can _omit the type_ of global variable. 
In this case, the compiler determines the type based on how the variable is used. 
For example, you can rewrite the previous program like this:

```func
global op;

int check_assoc(int a, int b, int c) {
  return op(op(a, b), c) == op(a, op(b, c));
}

int main() {
  op = _+_;
  return check_assoc(2, 3, 9);
}
```

**Declaring multiple global variables**

FunC allows users to declare multiple global variables using a single `global` keyword. 
The following examples are equivalent:

```func
global int A;
global cell B;
global C;
```
```func
global int A, cell B, C;
```

**Restrictions on global and local variable names**

A local variable **cannot** have the same name as a previously declared global variable. The following example is invalid and will not compile:

```func
global cell C;

int main() {
  int C = 3; ;; Error: cannot declare a local variable with the same name as a global variable
  return C;
}
```
However, the following example is valid:

```func
global int C;

int main() {
  int C = 3;
  return C;
}
```

In this case, `int C = 3;` is not declaring a new local variable 
but instead assigning value `3` to the global variable `C`. 
This behavior is explained in more detail in the section on [statements](/v3/documentation/smart-contracts/func/docs/statements#variable-declaration).
<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/func/docs/literals_identifiers.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/func/docs/literals_identifiers.md
================================================
import Feedback from '@site/src/components/Feedback';

# Literals and identifiers
## Number literals

FunC supports decimal and hexadecimal integer literals, including those with leading zeros.

Examples of valid literals: `0`, `123`, `-17`, `00987`, `0xef`, `0xEF`, `0x0`, `-0xfFAb`, `0x0001`, `-0`, and `-0x0`.

## String literals

In FunC, strings are enclosed in double quotes `"`, like `"this is a string"`.<br />
You can optionally specify a type after the string literal, such as `"string"u`.<br />
Special characters like `\n` are not supported, but you can create multi-line <br />  strings simply by writing the text across multiple lines, like this:
```
;; somewhere inside of a function body

var a = """
   hash me baby one more time
"""h;
var b = a + 42;

b; ;; 623173419
```

FunC supports the following string types:
* without type – Used for `asm` function definitions and defining a slice constant from an ASCII string.
* `s`— Defines a raw slice constant using its contents (hex-encoded and optionally bit-padded).
* `a`— Creates a slice constant containing a `MsgAddressInt` structure from a given address.
* `u`— Converts an ASCII string into an integer constant, representing its hex values.
* `h`— Generates an integer constant from the first 32 bits of the string's SHA-256 hash.
* `H`— Generates an integer constant from the full 256-bit SHA-256 hash of the string.
* `c`— Generates an integer constant from the `crc32` value of the string.

**Examples**
The following string literals produce these corresponding constants:

* `"string"`  &rarr;  `x{737472696e67}` (slice constant)
* `"abcdef"s` &rarr; `x{abcdef}` (slice constant)
* `"Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF"a` &rarr; `x{9FE6666666666666666666666666666666666666666666666666666666666666667_}` (slice constant representing an: `addr_std$10 anycast:none$0 workchain_id:int8=0xFF address:bits256=0x33...33`)
* `"NstK"u` &rarr; `0x4e73744b` (integer constant)
* `"transfer(slice, int)"h` &rarr; `0x7a62e8a8` (integer constant)
* `"transfer(slice, int)"H` &rarr; `0x7a62e8a8ebac41bd6de16c65e7be363bc2d2cbc6a0873778dead4795c13db979` (integer constant)
* `"transfer(slice, int)"c` &rarr; `2235694568` (integer constant)

## Identifiers

FunC allows a broad range of identifiers for functions and variable names. 
Any **single-line string** that meets the following conditions qualifies as a valid identifier:
- It **does not** contain special symbols: `;`, `,`, `(`, `)`, `[`, `]`, spaces including tabs, `~`, and `.`.
- It **does not** start as a comment or a string literal (i.e., with `"` at the beginning). 
- It is **not** a number literal.
- It is **not** an underscore `_`.
- It is **not** a reserved keyword. Exception: if it starts with a backtick `` ` ``, it must also end with a backtick and cannot contain any additional backticks inside.
- It is **not** a name of a [builtin](https://github.com/ton-blockchain/ton/blob/5c392e0f2d946877bb79a09ed35068f7b0bd333a/crypto/func/builtins.cpp#L1133).

Additionally, **function** names in function definitions can start with `.` or `~`.

Examples of valid identifiers:
- `query`, `query'`, `query''`
- `elem0`, `elem1`, `elem2`
- `CHECK`
- `_internal_value`
- `message_found?`
- `get_pubkeys&signatures`
- `dict::udict_set_builder`
- `_+_` (the standard addition operator for `(int, int) -> int` in prefix notation, although it is already defined).
- `fatal!`

**Naming conventions:**

- **Apostrophe `'` at the end:** used when a variable is a modified version of its original value. 

  - Example: 
  almost all modifying built-in primitives for hashmap manipulation 
  (except those with the prefix `~`) return a new version of the hashmap, often with extra data. 
  The updated version is typically named with the same identifier, adding a `'` suffix.

- **Question mark (?) at the end:** typically used for boolean variables or functions that return a success flag.
  - Example: `udict_get?` from [stdlib.fc](/v3/documentation/smart-contracts/func/docs/stdlib), which checks if a value exists.


**Invalid identifiers:**
- `take(first)Entry` - contains parentheses `()`
- `"not_a_string` - starts with a `"` like a string literal
- `msg.sender` - includes a `.` which is not allowed
- `send_message,then_terminate` - contains a `,` which is not allowed 
- `_` - just an underscore, which is not valid on its own

**Less common but valid identifiers:**
- `123validname`
- `2+2=2*2`
- `-alsovalidname`
- `0xefefefhahaha`
- `{hehehe}`
- ``pa{--}in"`aaa`"``

**More invalid identifiers:**
- ``pa;;in"`aaa`"`` - contains `;`, which is prohibited
- `{-aaa-}` - contains `{}` incorrectly
- `aa(bb` - contains an opening parenthesis without closing it
- `123` - a number literal, not an identifier

**Special identifiers in backticks:**

FunC allows identifiers enclosed in backticks `` ` ``. These identifiers can contain any characters except:
- Newline characters `\n`
- Backticks `` ` `` themselves except the opening and closing ones.

**Examples of valid backtick-quoted identifiers:**

- `I'm a variable too`
- `any symbols ; ~ () are allowed here...`

## Constants
FunC allows defining **compile-time constants** that are substituted and pre-computed during compilation.

**Syntax:**

```func
const optional-type identifier = value-or-expression;
```

- `optional-type` (e.g., `int` or `slice`) is optional but improves readability and ensures type correctness.
- `value-or-expression`can be a literal or a pre-computable expression involving literals and constants.

**Example usage:**

```func
const int101 = 101;                 // Numeric constant
const str1 = "const1", str2 = "aabbcc"s; // String constants
const int int240 = ((int1 + int2) * 10) << 3; // Computed constant
const slice str2r = str2;           // Constant referencing another constant
```


Since numeric constants are replaced during compilation,
all optimizations and pre-computations apply efficiently—unlike the older approach using inline `PUSHINT` assembly.



<Feedback />



================================================
FILE: docs/v3/documentation/smart-contracts/func/docs/statements.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/func/docs/statements.md
================================================
import Feedback from '@site/src/components/Feedback';

# Statements

This section briefly overviews FunC statements, which form the core of function bodies.

## Expression statements
The most common type of statement is the expression statement—an expression followed by `;`. As a rule, all sub-expressions are evaluated from left to right, 
except in cases where [asm stack rearrangement](/v3/documentation/smart-contracts/func/docs/functions#rearranging-stack-entries) explicitly defines the order.

### Variable declaration
Local variables must be initialized at the time of declaration. Here are some examples:

```func
int x = 2;
var x = 2;
(int, int) p = (1, 2);
(int, var) p = (1, 2);
(int, int, int) (x, y, z) = (1, 2, 3);
(int x, int y, int z) = (1, 2, 3);
var (x, y, z) = (1, 2, 3);
(int x = 1, int y = 2, int z = 3);
[int, int, int] [x, y, z] = [1, 2, 3];
[int x, int y, int z] = [1, 2, 3];
var [x, y, z] = [1, 2, 3];
```


A variable can be redeclared in the same scope. For example, the following code is valid:

```func
int x = 2;
int y = x + 1;
int x = 3;
```

In this case, 
the second occurrence of `int x` is not a new declaration but a compile-time check ensuring that `x` has type `int`. The third line is equivalent to `x = 3;`.


**Variable redeclaration in nested scopes**

In nested scopes, a new variable with the same name can be declared, just like in C:

```func
int x = 0;
int i = 0;
while (i < 10) {
  (int, int) x = (i, i + 1);
  ;; Here x is a variable of type (int, int)
  i += 1;
}
;; Here, x refers to the original variable of type int declared above
```

However, as mentioned in the [Global variables](/v3/documentation/smart-contracts/func/docs/global_variables/) section, 
global variables **cannot** be redeclared.


Since variable declarations are **expression statements**, constructs like `int x = 2;` are valid expressions. 
For instance:
`int y = (int x = 3) + 1;`
Here, `x` is declared and assigned `3`, and `y` is assigned `4`.


#### Underscore

The underscore `_` is used when a value is not needed. 
For example, if `foo` is a function of type `int -> (int, int, int)`, 
you can retrieve only the first return value while ignoring the rest:
```func
(int fst, _, _) = foo(42);
```



### Function application

A function call in FunC follows a conventional syntax: 
the function name is followed by its arguments, separated by commas.

```func
;; Suppose foo has type (int, int, int) -> int
int x = foo(1, 2, 3);
```

However, unlike many conventional languages, FunC treats functions as taking a single argument. 
In the example above, `foo` is a function that takes one tuple argument of type `(int, int, int)`.

**Function composition**

To illustrate how function arguments work in FunC, consider a function `bar` of type `int -> (int, int, int)`. Since `foo` expects a single tuple argument, you can pass the entire result of `bar(42)` directly into `foo`:

```func
int x = foo(bar(42));
```

This is equivalent to the longer form:

```func
(int a, int b, int c) = bar(42);
int x = foo(a, b, c);
```



Also Haskell-style calls are possible, but not always (to be fixed later):

FunC also supports **Haskell-style** function application, but with some limitations:

```func
;; Suppose foo has type int -> int -> int -> int
;; i.e., it is curried
(int a, int b, int c) = (1, 2, 3);
int x = foo a b c; ;; Valid syntax
```
However, direct application with literals does not compile:

```func
;; int y = foo 1 2 3; ERROR: won't compile
```

Instead, parentheses are required:

```func
int y = foo (1) (2) (3); ;; Valid syntax
```
### Lambda expressions
Lambda expressions are not yet supported in FunC.

### Methods calls

#### Non-modifying methods

In FunC, a function with at least one argument can be called a non-modifying method using the dot `.` syntax.

For example, the function `store_uint` has the type `(builder, int, int)  → builder`, where:
- The first argument is a builder object.
- The second argument is the value to store.
- The third argument is the bit length.

The function `begin_cell()` creates a new builder.
These two ways of calling `store_uint` are equivalent:

```func
builder b = begin_cell();
b = store_uint(b, 239, 8);
```
```func
builder b = begin_cell();
b = b.store_uint(239, 8);
```

The dot `.` syntax allows the first argument of a function to be placed before the function name, 
simplifying the code further:

```func
builder b = begin_cell().store_uint(239, 8);
```
Multiple non-modifying methods can be chained together:

```func
builder b = begin_cell().store_uint(239, 8)
                        .store_int(-1, 16)
                        .store_uint(0xff, 10);
```




#### Modifying methods

If a function’s first argument is of type `A` and its return value follows the structure `(A, B)`, 
where `B` is an arbitrary type, the function can be used as a modifying method. 

A modifying method modifies its first argument by assigning the first component of the returned value to the original variable. These methods may take additional arguments and return extra values, but their primary purpose is to update the first argument.

For example, consider a cell slice `cs` and the function `load_uint`, which has the type: `load_uint(slice, int) → (slice, int)`.

This function takes a cell slice and a number of bits to load, returning the remaining slice and the loaded value. The following three calls are equivalent:


```func
(cs, int x) = load_uint(cs, 8);
(cs, int x) = cs.load_uint(8);
int x = cs~load_uint(8);
```

Without return values
Sometimes, a function can be used as a modifying method even when it doesn’t return a meaningful value—only modifying its first argument. 
This can be achieved using unit types.

For example, consider an increment function `inc` of type `int -> int`. It should be redefined as a function of type `int -> (int, ())` to use it as a modifying method: 

```func
(int, ()) inc(int x) {
  return (x + 1, ());
}
```

Now, the following code increments `x`:

```func
x~inc();
```

#### `.` and `~` in function names

Suppose we want to use `inc` as a non-modifying method. We can write:

```func
(int y, _) = inc(x);
```

However, we can also define `inc` as a modifying method:

```func
int inc(int x) {
  return x + 1;
}
(int, ()) ~inc(int x) {
  return (x + 1, ());
}
```
Now, we can call it in different ways:
```func
x~inc(); ;; Modifies x
int y = inc(x); ;; Doesn't modify x
int z = x.inc(); ;; Also doesn't modify x
```


**How FunC resolves function calls**
- If a function is called with `.` (e.g., `x.foo()`), the compiler looks for a `.foo` definition.
- If a function is called with `~` (e.g., `x~foo()`), the compiler looks for a `~foo` definition.
- If neither `.foo` nor `~foo` is defined, the compiler falls back to the regular `foo` definition.



### Operators
Note that all the unary and binary operators are currently integer operators. Logical operators are bitwise integer operators (cf. [absence of boolean type](/v3/documentation/smart-contracts/func/docs/types#no-boolean-type)).


#### Unary operators

FunC supports two unary operators:
- `~` is bitwise not (priority 75)
- `-` is integer negation (priority 20)

These operators must be separated from the arguments:
- `- x` - Negates x.
- `-x` - Interpreted as a single identifier, not an operation.

#### Binary operators

With priority 30 (left-associative):

- `*` is integer multiplication
- `/` is integer division (floor)
- `~/` is integer division (round)
- `^/` is integer division (ceil)
- `%` is integer reduction by modulo (floor)
- `~%` is integer reduction by modulo (round)
- `^%` is integer reduction by modulo (ceil)
- `/%` returns the quotient and the remainder
- `&` is bitwise AND

With priority 20 (left-associative):
- `+` is integer addition
- `-` is integer subtraction
- `|` is bitwise OR
- `^` is bitwise XOR

With priority 17 (left-associative):
- `<<` is bitwise left shift
- `>>` is bitwise right shift
- `~>>` is bitwise right shift (round)
- `^>>` is bitwise right shift (ceil)

With priority 15 (left-associative):
- `==` is integer equality check
- `!=` is integer inequality check
- `<` is integer comparison
- `<=` is integer comparison
- `>` is integer comparison
- `>=` is integer comparison
- `<=>` is integer comparison (returns -1, 0 or 1)

They also should be separated from the argument:
- `x + y` -  Proper spacing between operands.
- `x+y` - Interpreted as a single identifier, not an operation.

#### Conditional operator

FunC supports the standard conditional (ternary) operator with the following syntax:
```func
<condition> ? <consequence> : <alternative>
```
For example:
```func
x > 0 ? x * fac(x - 1) : 1;
```
Priority 13.

#### Assignments
Priority 10.

Supports simple assignment `=` and compound assignment operators: `+=`, `-=`, `*=`, `/=`, `~/=`, `^/=`, `%=`, `~%=`, `^%=`, `<<=`, `>>=`, `~>>=`, `^>>=`, `&=`, `|=`, `^=`.



## Loops
FunC supports `repeat`, `while`, and `do { ... } until` loops. The `for` loop is not supported.

### Repeat loop
The `repeat` loop uses the `repeat` keyword followed by an `int`  expression. It executes the code a specified number of times.

**Examples:**
```func
int x = 1;
repeat(10) { ;;Repeats the block 10 times
  x *= 2;
}
;; x = 1024
```
```func
int x = 1, y = 10;
repeat(y + 6) { ;;Repeats the block 16 times
  x *= 2;
}
;; x = 65536
```

If the repetition count is negative, the loop does not execute:
```func
int x = 1;
repeat(-1) {
  x *= 2;
}
;; x = 1
```

A range check exception is thrown if the repetition count is less than `-2³¹` or greater than `2³¹ - 1`.

### While loop

The `while` loop follows standard syntax:

```func
int x = 2;
while (x < 100) {
  x = x * x;
}
;; x = 256
```
Note that the truth value of condition `x < 100` is of type `int` (cf. [absence of boolean type](/v3/documentation/smart-contracts/func/docs/types#no-boolean-type)).


### Until loop

The `do { ... } until` loop has the following syntax:

```func
int x = 0;
do {
  x += 3;
} until (x % 17 == 0);
;; x = 51
```




## If statements

**Examples**

Standard `if` statement:
```func
if (flag) {
  do_something();
}
```

Negated condition, which is equivalent to `if` (`~flag`):
```func

ifnot (flag) {
  do_something();
}
```

`If-else` statement:
```func
if (flag) {
  do_something();
} else {
  do_alternative();
}
```

```func
;; Some specific features
if (flag1) {
  do_something1();
} else {
  do_alternative4();
}
```

Curly brackets `{}` are required for `if` statements. The following code will not compile:
```func
if (flag1)
  do_something();
```

## Try-catch statements
*Available in FunC since v0.4.0*

The `try` block executes a section of code. 
If an error occurs, all changes made within the `try` block are completely rolled back, and the `catch` block is executed instead. The `catch` block receives two arguments:
- `x`: the exception parameter, which can be of any type
- `n`: the error code, an integer


Unlike many other languages, in FunC, all changes are **undone** if an error occurs inside the `try` block. These modifications include updates to local and global variables and changes to storage registers (`c4` for storage, `c5`for action/messages, `c7` for context, etc.). 
Any contract storage updates and outgoing messages are also reverted.

However, certain TVM state parameters are not rolled back, such as:
- Codepage settings
- Gas counters
As a result, all gas consumed within the `try` block is still accounted for, and any operations that modify gas limits (e.g., `accept_message` or `set_gas_limit`) will remain in effect.

**Exception parameter handling**

Since the exception parameter can be of any type, which may vary depending on the exception, FunC cannot determine its type at compile time. This requires the developer to manually cast the exception parameter when necessary, as shown in the type-casting example below.


**Examples**

Basic `try-catch` usage:
```func
try {
  do_something();
} catch (x, n) {
  handle_exception();
}
```

Casting the exception parameter:
```func
forall X -> int cast_to_int(X x) asm "NOP";
...
try {
  throw_arg(-1, 100);
} catch (x, n) {
  x.cast_to_int();
  ;; x = -1, n = 100
  return x + 1;
}
```

Variable reset on exception:
```func
int x = 0;
try {
  x += 1;
  throw(100);
} catch (_, _) {
}
```

In this last example, although `x` is incremented inside the `try` block, the modification is **rolled back** due to the exception, so `x` remains `0`.

## Block statements

Block statements are supported as well, creating a new nested scope:
```func
int x = 1;
builder b = begin_cell();
{
  builder x = begin_cell().store_uint(0, 8);
  b = x;
}
x += 1;
```

In this example, the inner block introduces a new `builder` variable named `x`, which exists only within that scope. 
The outer `x` remains unchanged and can be used after the block ends.

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/func/docs/stdlib.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/func/docs/stdlib.mdx
================================================
---
toc_min_heading_level: 2
toc_max_heading_level: 6
---

import Feedback from "@site/src/components/Feedback";

# FunC standard library

:::info
This section covers the [stdlib.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc) library,
which provides standard functions for FunC.
:::

The FunC standard library serves as a wrapper around the most commonly used TVM assembly commands that aren’t built-in.
For detailed descriptions of these commands, refer to the [TVM documentation](/v3/documentation/tvm/tvm-overview).
Some explanations in this document adapted from there.

Some functions in the library are commented out, meaning they have already been optimized and integrated as built-in operations.
However, their type signatures and behaviors remain unchanged.

Additionally, some less frequently used TVM commands are not yet included in the standard library. These may be added in future updates.

## Tuple manipulation primitives

Most function names and types in this section are self-explanatory.
For more details on polymorphic functions, refer to the [Polymorphism with forall](/v3/documentation/smart-contracts/func/docs/functions#polymorphism-with-forall) section.

**Note:** Currently, values of atomic type `tuple` cannot be converted into composite tuple types (e.g.,`[int, cell]`) and vice versa.

### Lisp-style lists

Lists can be represented as nested 2-element tuples. Empty list is conventionally represented as TVM `null` value (it can be obtained by calling `null()`). For example, the tuple `(1, (2, (3, null)))` represents the list `[1, 2, 3]`. Elements of a list can be of different types.

Lists in FunC are represented as nested two-element tuples. An empty list is conventionally represented by the TVM `null` value, which can be obtained using `null()`.
For example, the tuple `(1, (2, (3, null)))` corresponds to the list `[1, 2, 3]`. Lists in FunC can contain elements of different types.

#### cons

```func
forall X -> tuple cons(X head, tuple tail) asm "CONS";
```

Adds an element to the beginning of a lisp-style list.

#### uncons

```func
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";
```

Extracts the head and tail of a lisp-style list.

#### list_next

```func
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";
```

Extracts the head and tail of a lisp-style list. It can be used as a [(non-)modifying method](/v3/documentation/smart-contracts/func/docs/statements#methods-calls).

**Example**

```func
() foo(tuple xs) {
    (_, int x) = xs.list_next(); ;; get the first element, `_` means do not use tail list
    int y = xs~list_next(); ;; pop the first element
    int z = xs~list_next(); ;; pop the second element
}
```

#### car

```func
forall X -> X car(tuple list) asm "CAR";
```

Returns the head of a lisp-style list.

#### cdr

```func
tuple cdr(tuple list) asm "CDR";
```

Returns the tail of a lisp-style list.

### Other tuple primitives

#### empty_tuple

```func
tuple empty_tuple() asm "NIL";
```

Creates an empty tuple (0 elements).

#### tpush

```func
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";
```

Appends a value to the tuple `(x1, ..., xn)`, forming `(x1, ..., xn, x)`. The resulting tuple must not exceed 255 elements,
or a type check exception is thrown.

#### single

```func
forall X -> [X] single(X x) asm "SINGLE";
```

Creates a tuple with a single element—singleton

#### unsingle

```func
forall X -> X unsingle([X] t) asm "UNSINGLE";
```

Unpacks a singleton.

#### pair

```func
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";
```

Creates a two-element tuple (pair).

#### unpair

```func
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";
```

Unpacks a pair into two separate values.

#### triple

```func
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";
```

Creates a three-element tuple (triple).

#### untriple

```func
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";
```

Unpacks a triple into three separate values.

#### tuple4

```func
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";
```

Creates a four-element tuple.

#### untuple4

```func
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";
```

Unpacks a four-element tuple into four separate values.

_Tuple element access_

#### first

```func
forall X -> X first(tuple t) asm "FIRST";
```

Returns the first element of a tuple.

#### second

```func
forall X -> X second(tuple t) asm "SECOND";
```

Returns the second element of a tuple.

#### third

```func
forall X -> X third(tuple t) asm "THIRD";
```

Returns the third element of a tuple.

#### fourth

```func
forall X -> X fourth(tuple t) asm "3 INDEX";
```

Returns the fourth element of a tuple.

_Pair and triple element access_

#### pair_first

```func
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";
```

Returns the first element of a pair.

#### pair_second

```func
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";
```

Returns the second element of a pair.

#### triple_first

```func
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";
```

Returns the first element of a triple.

#### triple_second

```func
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";
```

Returns the second element of a triple.

#### triple_third

```func
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";
```

Returns the third element of a triple.

## Domain specific primitives

### Extracting info from c7

The [c7 special register](/v3/documentation/tvm/tvm-overview#control-registers) holds useful data about smart contract execution.
The following primitives facilitate easy retrieval of this information:

#### now

```func
int now() asm "NOW";
```

Returns the current Unix timestamp as an integer.

#### my_address

```func
slice my_address() asm "MYADDR";
```

Retrieves the smart contract’s internal address as a Slice containing `MsgAddressInt`. If needed, it can be further processed using functions like `parse_std_addr`.

#### get_balance

```func
[int, cell] get_balance() asm "BALANCE";
```

Returns the smart contract's balance as a `tuple`:

- `int`: The remaining balance in nanotoncoins.
- `cell`: A dictionary (with 32-bit keys) containing balances of extra currencies.

Since this is retrieved during the compute phase, the balance reflects the incoming message `value`, with `storage_fee` and `import_fee` already subtracted.

:::warning
Raw primitives such as `send_raw_message` do not update this field.
:::

#### cur_lt

```func
int cur_lt() asm "LTIME";
```

Returns the logical time of the current transaction.

#### block_lt

```func
int block_lt() asm "BLOCKLT";
```

Returns the logical time at the beginning of the current block.

#### config_param

```func
cell config_param(int x) asm "CONFIGOPTPARAM";
```

Returns the value of the global configuration parameter with integer index `i` as `cell` or `null` value.

#### my_code

```func
cell my_code() asm "MYCODE";
```

Retrieves the smart contract's code from `c7`.

:::warning
This function is not included in the standard library, but is often sought by developers.
You need to manually add initialization it to your contract system, with the `asm` word specified as shown in the snippet above.
:::

### Hashes

#### cell_hash

```func
int cell_hash(cell c) asm "HASHCU";
```

Calculates the representation hash of the given `cell c` and returns it as a 256-bit unsigned integer `x`.
This function is handy for signing and verifying signatures of arbitrary entities structured as a tree of cells.

#### slice_hash

```func
int slice_hash(slice s) asm "HASHSU";
```

Computes the hash of the given `slice s` and returns it as a 256-bit unsigned integer `x`.
The result is equivalent to creating a standard cell containing only the data and references
from `s` and then computing its hash using `cell_hash`.

#### string_hash

```func
int string_hash(slice s) asm "SHA256U";
```

Calculates the SHA-256 hash of the data bits in the given `slice s`.
A cell underflow exception is thrown if the bit length of `s` is not a multiple of eight.
The hash is returned as a 256-bit unsigned integer `x`.

### Signature checks

#### check_signature

```func
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";
```

Checks whether the given `signature` is a valid Ed25519 signature of the provided
`hash` using the specified `public key`. The `hash` and `public key` are both 256-bit unsigned integers. The `signature` must be at least 512 bits long, and only the first 512 bits are used.
If the signature is valid, the function returns `-1`; otherwise, it returns `0`.

Remember that `CHKSIGNU` converts the hash into a 256-bit slice and then calls `CHKSIGNS`.
This means that if the `hash` was initially generated from some data,
that data gets hashed _twice_—the first time when creating the hash and the second time within `CHKSIGNS`.

#### check_data_signature

```func
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";
```

Verifies whether the given `signature` is a valid Ed25519 signature for the data contained in the `slice data`,
using the specified `public key`, just like `check_signature`.
A cell underflow exception is thrown if the data's bit length is not a multiple of eight.
The verification follows the standard Ed25519 process,
where SHA-256 is used to derive a 256-bit number from `data`, which is then signed.

### Computation of BoC size

The following functions help calculate storage fees for user-provided data.

#### compute_data_size?

```func
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
```

Returns `(x, y, z, -1)` or `(null, null, null, 0)`. It recursively calculates the number of unique cells `x`, data bits `y`, and cell references `z` in the **directed acyclic graph (DAG)** at `cell c`. This provides the total storage used by the DAG while recognizing identical cells.

The computation uses a depth-first traversal with a hash table to track visited cells, preventing redundant visits.
If the total amount of visited cells `x` exceeds `max_cells`, the process stops before visiting the `(max_cells + 1)` -th cell, and the function returns `0` to indicate failure. If `c` is `null`, the function returns `x = y = z = 0`.

#### slice_compute_data_size?

```func
(int, int, int, int) slice_compute_data_size?(slice s, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
```

It works similarly to `compute_data_size?` but takes a `slice s` instead of a `cell`. The result `x` does not include the cell that contains the slice `s`, but `y` and `z` account for the data bits and cell references inside `s`.

#### compute_data_size

```func
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
```

A strict version of `compute_data_size?` that throws a cell overflow exception (8) if the computation fails.

#### slice_compute_data_size

```func
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
```

A strict version of `slice_compute_data_size?` that throws a cell overflow exception (8) if the computation fails.

### Persistent storage save and load

#### get_data

```func
cell get_data() asm "c4 PUSH";
```

Returns the persistent contract storage cell, which can be later parsed or modified using slice and builder functions.

#### set_data

```func
() set_data(cell c) impure asm "c4 POP";
```

Sets cell `c` as persistent contract data. You can update the persistent contract storage with this primitive.

### Continuation primitives

#### get_c3

```func
cont get_c3() impure asm "c3 PUSH";
```

The `c3` register typically holds a continuation set up by the contract code.
It is used for function calls.
The primitive returns the current value of `c3`.

#### set_c3

```func
() set_c3(cont c) impure asm "c3 POP";
```

Updates the `c3` value to modify the contract’s execution code at runtime. The current code and function call stack remain unchanged, but future function calls use the updated code.

#### bless

```func
cont bless(slice s) impure asm "BLESS";
```

Converts a `slice s` into a basic continuation `c`, where `c.code = s`, an empty stack and a savelist.

### Gas related primitives

#### accept_message

```func
() accept_message() impure asm "ACCEPT";
```

This function sets the current gas limit `gl` to its maximum possible value `gm` and resets the gas credit `gc` to zero.
At the same time, it deducts the previous gas credit `gc` from the remaining gas reserve `gr`.
Simply put, the smart contract agrees to purchase gas to complete the transaction.
This function is required when processing external messages that do not carry any value and do not provide gas.

For more details,
follow the [Accept message effects](/v3/documentation/smart-contracts/transaction-fees/accept-message-effects) section.

#### set_gas_limit

```func
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
```

This function sets the gas limit `gl` to the smaller of two values: the provided `limit` or the maximum allowed gas `gm`.
It also resets the gas credit `gc` to zero. If the contract already uses more gas than this new limit `gl`, including the current instruction, an out-of-gas exception is triggered before the new limit is applied.

Remember that if the `limit` is `2^63 − 1` or higher, calling `set_gas_limit` works the same as calling `accept_message`.

For more details,
follow the [Accept message effects](/v3/documentation/smart-contracts/transaction-fees/accept-message-effects) section.

#### commit

```func
() commit() impure asm "COMMIT";
```

Saves the current state of persistent storage `c4` and action registers `c5`, ensuring execution succeeds with these stored values,
even if an exception occurs later.

#### buy_gas

```func
() buy_gas(int gram) impure asm "BUYGAS";
```

:::caution
The `BUYGAS` opcode is currently not implemented.
:::

This function calculates how much gas can be purchased for the `gram` nanotoncoins and updates the gas limit `gl` accordingly,
similar to `set_gas_limit`.

### Actions primitives

#### raw_reserve

```func
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
```

The `raw_reserve` function creates an output action
that reserves a specific amount of nanotoncoins from the account’s remaining balance.
The behavior depends on the `mode` parameter:

- If `mode = 0`, exactly the `amount` of nanotoncoins is reserved.
- If `mode = 2`, up to the `amount` of nanotoncoins is reserved.
- If `mode = 1` or `mode = 3`, all but the `amount` of nanotoncoins is reserved.

This process is equivalent to generating an outbound message that transfers the `amount` of nanotoncoins or `b − amount` nanotoncoins,
where `b` represents the remaining balance, to the sender. This ensures that subsequent output actions cannot exceed the remaining funds.

**Mode Flags**

- **Bit +2** in `mode`: prevents failure if the specified `amount` cannot be reserved. Instead, the entire remaining balance is reserved.
- **Bit +8** in `mode`: negates `amount` (`amount <- -amount`) before executing further actions.
- **Bit +4** in `mode`: increases `amount` by the original balance of the current account before the compute phase,
  including all extra currencies, before performing any other checks and actions.

**Constraints**

- The `amount` must be a non-negative integer.
- `mode` must be within the range `0..15`.

#### raw_reserve_extra

```func
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
```

Similar to `raw_reserve`, but it also supports an `extra_amount` dictionary.
This dictionary, given as a `cell` or `null`, allows reserving currencies other than Toncoin.

#### send_raw_message

```func
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
```

This function sends a raw message stored in `msg`. This message must contain a properly serialized `Message X` object, with a few exceptions.
The source address can have a dummy value `addr_none`, which the current smart contract address will automatically replace. The fields `ihr_fee`, `fwd_fee`, `created_lt`, and `created_at` can hold arbitrary values, as they will be updated with the correct ones during the action phase of the transaction. The integer parameter `mode` specifies the flags.

Currently, there are **3 modes** and **4 flags** available for messages.
A single mode can be combined with multiple flags or none to form the desired `mode`.
The combination is achieved by **summing** their values. The table below provides descriptions of the available modes and flags.

| Mode  | Description                                                                                                     |
| :---- | :-------------------------------------------------------------------------------------------------------------- |
| `0`   | Sends an ordinary message.                                                                                      |
| `64`  | Transfers the full remaining value of the inbound message and the initially specified amount.                   |
| `128` | Transfers the entire remaining balance of the current smart contract instead of the initially specified amount. |

| Flag  | Description                                                                                              |
| :---- | :------------------------------------------------------------------------------------------------------- |
| `+1`  | Pays transfer fees separately from the message value.                                                    |
| `+2`  | Ignores certain errors that occur while processing the message during the action phase (see note below). |
| `+16` | Bounces the transaction if the action fails. Has no effect if `+2` is used.                              |
| `+32` | Destroys the current account if its resulting balance is zero (commonly used with `mode = 128`).         |

:::info +2 flag
The `+2` flag ignores specific errors that may occur while processing a message during the action phase. These include:

1. Insufficient Toncoins:
   - Not enough value to transfer with the message (the entire inbound message value has been used).
   - Insufficient funds to process the message.
   - Not enough attached value to cover forwarding fees.
   - Insufficient extra currency to send with the message.
   - Not enough funds to pay for an outbound external message.
2. Message exceeds size limits (see the [Message size](/v3/documentation/smart-contracts/message-management/sending-messages#message-size) section for details).
3. Excessive Merkle depth in the message.

However, the `+2` flag does not ignore errors in the following cases:

1. The message format is invalid.
2. Both `64` and `128` modes are used simultaneously.
3. The outbound message contains invalid libraries in `StateInit`.
4. The external message is not ordinary or includes the `+16` or `+32` flag.
   :::

:::warning

1. **+16 flag** should not be used in external messages (e.g., to wallets), as there is no sender to receive the bounced message.
2. **+2 flag** is important in external messages (e.g., to wallets).
   :::

You can view a detailed example [here](/v3/documentation/smart-contracts/message-management/sending-messages#example-jetton-transfer-pitfall).

#### set_code

```func
() set_code(cell new_code) impure asm "SETCODE";
```

Generates an output action to update the smart contract's code to the one provided in the `new_code` cell.
This change occurs only after the smart contract completes its current execution.
See also [set_c3](/v3/documentation/smart-contracts/func/docs/stdlib#set_c3).

### Random number generator primitives

The pseudo-random number generator relies on a random seed, a 256-bit unsigned integer, and sometimes additional data stored in [c7](/v3/documentation/tvm/tvm-overview#control-registers).
Before a smart contract executes in the TON Blockchain, its initial random seed is derived from a hash of the smart contract address and the global block random seed. If the same smart contract runs multiple times within a block, each run will use the same random seed. This can be adjusted by calling `randomize_ltbefore` using the pseudo-random number generator for the first time.

:::caution
Remember that the random numbers generated by the functions below can be predicted unless additional techniques are used.

- [Random number generation](/v3/guidelines/smart-contracts/security/random-number-generation)

:::

#### random

```func
int random() impure asm "RANDU256";
```

Generates a new pseudo-random 256-bit unsigned integer `x`. The process works as follows:

- Let `r` be the previous random seed, a 32-byte array constructed from the big-endian representation of a 256-bit unsigned integer.
- Compute `sha512(r)`.
- The first 32 bytes of the hash become the new seed `r'`.
- The remaining 32 bytes are returned as the new random value `x`.

#### rand

```func
int rand(int range) impure asm "RAND";
```

Generates a new pseudo-random integer `z` in the range `0..range−1` (or `range..−1` if `range < 0`). More precisely, an unsigned random value `x` is generated as in `random`; then `z := x * range / 2^256` is
computed.

Produces a pseudo-random integer `z` within the range `0..range−1` (or `range..−1` if `range < 0`).

- First, an unsigned random value `x` is generated using `random()`.
- Then, `z := x * range / 2^256` is calculated.

#### get_seed

```func
int get_seed() impure asm "RANDSEED";
```

Returns the current random seed as a 256-bit unsigned integer.

#### set_seed

```func
int set_seed(int seed) impure asm "SETRAND";
```

Sets the random seed to a specified 256-bit unsigned integer `seed`.

#### randomize

```func
() randomize(int x) impure asm "ADDRAND";
```

Mixes an unsigned 256-bit integer `x` into a random seed `r` by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with a big-endian representation of the old seed `r`, and the second with a big-endian representation of `x`.

Mixes a 256-bit unsigned integer `x` into the random seed `r` by updating`r` to `sha256(r || x)`, where:

- `r` is the previous seed, represented as a 32-byte big-endian array.
- `x` is also converted into a 32-byte big-endian array.
  T- he new seed is the SHA-256 hash of their concatenation.

#### randomize_lt

```func
() randomize_lt() impure asm "LTIME" "ADDRAND";
```

Equivalent to calling `randomize(cur_lt());`.

### Address manipulation primitives

The functions below handle the serialization and deserialization of values based on the following TL-B scheme.

```func
addr_none$00 = MsgAddressExt;

addr_extern$01 len:(## 8) external_address:(bits len)
             = MsgAddressExt;

anycast_info$_ depth:(#<= 30) { depth >= 1 }
  rewrite_pfx:(bits depth) = Anycast;

addr_std$10 anycast:(Maybe Anycast)
  workchain_id:int8 address:bits256 = MsgAddressInt;

addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)
  workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
_ _:MsgAddressInt = MsgAddress;
_ _:MsgAddressExt = MsgAddress;

int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
  src:MsgAddress dest:MsgAddressInt
  value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
  created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;

ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
  created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
```

- `addr_none` is represented by `t = (0)`, i.e., a tuple containing exactly
  one integer that equals zero
- `addr_extern` is represented by `t = (1, s)`, where slice `s` contains the
  field `external_address`. In other words, `t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`
- `addr_std` is represented by `t = (2, u, x, s)`, where `u` is either `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if `anycast` is present). Next, integer `x` is the `workchain_id`, and slice `s` contains the address
- `addr_var` is represented by `t = (3, u, x, s)`, where `u`, `x`, and `s` have the same meaning as for `addr_std`

A deserialized `MsgAddress`cis represented as a tuple `t` with the following structure:

- `addr_none` is represented as `t = (0)`, a single-element tuple where the integer is zero.
- `addr_extern` is represented as `t = (1, s)`, where `s` is a slice containing `external_address`. In other words, `t` is a pair with the first element being `1` and the second being `s`.
- `addr_std` is represented as `t = (2, u, x, s)`, where:
  - `u` is `null` if `anycast` is absent or a slice `s'` containing `rewrite_pfx` if `anycast` is present.
  - `x` is the `workchain_id`.
  - `s` is a slice containing the address.
- addr_var is represented as `t = (3, u, x, s)`, where `u`, `x,` and `s` follow the same structure as `addr_std`.

#### load_msg_addr

```func
(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";
```

Extracts a valid `MsgAddress` prefix from `slice s` and returns the extracted prefix `s'` and the remaining part `s''`.

#### parse_addr

```func
tuple parse_addr(slice s) asm "PARSEMSGADDR";
```

Splits `slice s`, which holds a valid `MsgAddress`, into tuple `t`, separating its fields. If `s` is invalid, a cell deserialization exception is raised.

#### parse_std_addr

```func
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";
```

Extracts a valid `MsgAddressInt`, typically `msg_addr_std`, from `slice s`, modifies the address prefix if `anycast` is present, and returns the workchain and 256-bit address as integers. A cell `deserialization` exception is triggered if the address isn't 256-bit
or `s` isn't a valid `MsgAddressInt` serialization.

#### parse_var_addr

```func
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";
```

A modified version of `parse_std_addr` that returns the modified address as `slice s`,
even if its length is not exactly 256 bits, as in `msg_addr_var`.

## Debug primitives

Debug primitives help inspect the state of various variables while running tests or executing console scripts.

#### ~dump

```func
forall X -> () ~dump(X value) impure asm "s0 DUMP";
```

Prints the given value. Multiple values can be output as a tuple, e.g.,`~dump([v1, v2, v3])`.

#### ~strdump

```func
() ~strdump(slice str) impure asm "STRDUMP";
```

Prints a string. The bit length of the slice parameter must be a multiple of 8.

#### dump_stack

```func
() dump_stack() impure asm "DUMPSTK";
```

Prints the current stack up to the top 255 values and displays the total stack depth.

## Slice primitives

A primitive _loads_ data when it returns both the extracted data and the remainder of the slice.
It can be used as a [modifying method](/v3/documentation/smart-contracts/func/docs/statements#modifying-methods).
A primitive _preloads_ data when it returns only the extracted data, leaving the original slice unchanged. It can be used as a [non-modifying method](/v3/documentation/smart-contracts/func/docs/statements#non-modifying-methods).
Unless specified otherwise, loading and preloading primitives read data from the beginning of the slice.

#### begin_parse

```func
slice begin_parse(cell c) asm "CTOS";
```

Converts a `cell` into a `slice`. The input `c` must be either an ordinary or exotic cell.
See [TVM.pdf](https://ton.org/tvm.pdf), 3.1.2. If `c` is exotic, it is automatically converted into an ordinary cell `c'`
before being transformed into a `slice`.

#### end_parse

```func
() end_parse(slice s) impure asm "ENDS";
```

Checks if the `slice s` is empty. It throws an exception if it is not.

#### load_ref

```func
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";
```

Loads the first reference from a slice.

#### preload_ref

```func
cell preload_ref(slice s) asm "PLDREF";
```

Preloads the first reference from a slice.

#### load_int

```func
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
```

Loads a signed `len`-bit integer from a slice.

#### load_uint

```func
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
```

Loads an unsigned `len`-bit integer from a slice.

#### preload_int

```func
;; int preload_int(slice s, int len) asm "PLDIX";
```

Preloads a signed `len`-bit integer from a slice.

#### preload_uint

```func
;; int preload_uint(slice s, int len) asm "PLDUX";
```

Preloads an unsigned `len`-bit integer from a slice.

#### load_bits

```func
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
```

Loads the first `0 ≤ len ≤ 1023` bits from `slice s` into a new slice `s''`.

#### preload_bits

```func
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
```

Preloads the first `0 ≤ len ≤ 1023` bits from `slice s` into a new slice `s''`.

#### load_coins

```func
(slice, int) load_coins(slice s) asm( -> 1 0) "LDGRAMS";
```

Loads serialized amount of Toncoins, which is an unsigned integer up to `2^120 - 1`.

#### skip_bits

```func
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";
```

Returns all bits of `s` except for the first `len` bits, where `0 ≤ len ≤ 1023`.

#### first_bits

```func
slice first_bits(slice s, int len) asm "SDCUTFIRST";
```

Returns the first `len` bits of `s`, where `0 ≤ len ≤ 1023`.

#### skip_last_bits

```func
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";
```

Returns all bits of `s` except for the last `len` bits, where `0 ≤ len ≤ 1023`.

#### slice_last

```func
slice slice_last(slice s, int len) asm "SDCUTLAST";
```

Returns the last `len` bits of `s`, where `0 ≤ len ≤ 1023`.

#### load_dict

```func
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";
```

Loads a dictionary `D` from slice `s`. It can be used for dictionaries or to values of arbitrary `Maybe ^Y` types (returns `null` if the `nothing` constructor is used).

#### preload_dict

```func
cell preload_dict(slice s) asm "PLDDICT";
```

Preloads a dictionary `D` from slice `s`.

#### skip_dict

```func
slice skip_dict(slice s) asm "SKIPDICT";
```

Loads a dictionary as `load_dict` but returns only the remainder of the slice.

### Slice size primitives

#### slice_refs

```func
int slice_refs(slice s) asm "SREFS";
```

Returns the number of references in slice `s`.

#### slice_bits

```func
int slice_bits(slice s) asm "SBITS";
```

Returns the number of data bits in slice `s`.

#### slice_bits_refs

```func
(int, int) slice_bits_refs(slice s) asm "SBITREFS";
```

Returns both the number of data bits and the number of references in `s`.

#### slice_empty?

```func
int slice_empty?(slice s) asm "SEMPTY";
```

Checks whether slice `s` is empty (i.e., contains no bits of data and no cell references).

#### slice_data_empty?

```func
int slice_data_empty?(slice s) asm "SDEMPTY";
```

Checks whether slice `s` has no bits of data.

#### slice_refs_empty?

```func
int slice_refs_empty?(slice s) asm "SREMPTY";
```

Checks whether slice `s` has no references.

#### slice_depth

```func
int slice_depth(slice s) asm "SDEPTH";
```

Returns the depth of slice `s`.
If `s` has no references, it returns `0`;
otherwise, the returned value is one plus the maximum depths of cells referred to from `s`.

## Builder primitives

A primitive _stores_ a value `x` in a builder `b` by returning a modified version `b'` with `x` added at the end. It can also be used as a [non-modifying method](/v3/documentation/smart-contracts/func/docs/statements#non-modifying-methods).
Each of the following primitives first checks for enough space in the `builder` and then verifies the range of the serialized value.

#### begin_cell

```func
builder begin_cell() asm "NEWC";
```

Creates a new empty `builder`.

#### end_cell

```func
cell end_cell(builder b) asm "ENDC";
```

Converts a `builder` into a standard `cell`.

#### store_ref

```func
builder store_ref(builder b, cell c) asm(c b) "STREF";
```

Stores a reference to cell `c` in builder `b`.

#### store_uint

```func
builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
```

Stores an unsigned `len`-bit integer `x` in `b`, where `0 ≤ len ≤ 256`.

#### store_int

```func
builder store_int(builder b, int x, int len) asm(x b len) "STIX";
```

Stores a signed `len`-bit integer `x` in `b`, where `0 ≤ len ≤ 257`.

#### store_slice

```func
builder store_slice(builder b, slice s) asm "STSLICER";
```

Stores slice `s` in builder `b`.

#### store_grams

```func
builder store_grams(builder b, int x) asm "STGRAMS";
```

#### store_coins

```func
builder store_coins(builder b, int x) asm "STGRAMS";
```

Serializes an integer `x` in the range `0..2^120 − 1` into builder `b`. The serialization consists of:

- A 4-bit unsigned big-endian integer `l`, the smallest `l ≥ 0` such that `x < 2^8l`.
- An `8l`-bit unsigned big-endian representation of `x`.

A range check exception is thrown if `x` is outside the supported range.

This is the standard way of storing Toncoins.

#### store_dict

```func
builder store_dict(builder b, cell c) asm(c b) "STDICT";
```

Stores a dictionary `D` represented by cell `c` or `null` into builder `b`. Stores a 1-bit and a reference to `c` if `c` is not `null`; otherwise, stores a 0-bit.

#### store_maybe_ref

```func
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";
```

The same as `store_dict`.

### Builder size primitives

#### builder_refs

```func
int builder_refs(builder b) asm "BREFS";
```

Returns the number of cell references currently stored in builder `b`.

#### builder_bits

```func
int builder_bits(builder b) asm "BBITS";
```

Returns the number of data bits currently stored in builder `b`.

#### builder_depth

```func
int builder_depth(builder b) asm "BDEPTH";
```

Returns the depth of builder `b`. If `b` contains no cell references, it returns `0`. Otherwise, it returns `1` plus the maximum depth among the referenced cells.

## Cell primitives

#### cell_depth

```func
int cell_depth(cell c) asm "CDEPTH";
```

Returns the depth of the given `cell c`. If `c` has no references, the function returns `0`. Otherwise, it returns `1` plus the maximum depth among all cells referenced by `c`. If `c` is `null` instead of a cell, the function returns `0`.

#### cell_null?

```func
int cell_null?(cell c) asm "ISNULL";
```

Checks whether the given `cell c` is `null`. In most cases, a `null` cell represents an empty dictionary. FunC also includes a polymorphic `null?` built-in function. See [built-in](/v3/documentation/smart-contracts/func/docs/builtins#other-primitives) for more details.

## Dictionaries primitives

:::caution
The dictionary primitives below are low-level and do not verify whether the cell structure matches the expected operation.
Using a dictionary operation on a "non-dictionary" cell results in **undefined behavior**. The same applies when using keys of different lengths or types, such as writing to a dictionary using an 8-bit signed key and a 7-bit unsigned key.

In most cases, this will cause an exception. However, in rare cases, it may lead to incorrect values being written or read. Developers should avoid such code.
:::

As stated in [TVM.pdf](https://ton.org/tvm.pdf):

> Dictionaries can be represented in two different ways as TVM stack values:
>
> 1. **As a slice `s`** containing the serialized TL-B value of type `HashmapE(n, X)`. In simpler terms, `s` consists either of a single `0` bit if the dictionary is empty or a `1` bit followed by a reference to a cell containing the binary tree's root—essentially, a serialized value of type `Hashmap(n, X)`.
>
> 2. **As a `Maybe cell (c^?)`**, which is either a cell that contains a serialized `Hashmap(n, X)` same as above or `null`, indicating an empty dictionary. See [null values](/v3/documentation/smart-contracts/func/docs/types#null-values) for details. When using this format, the dictionary is typically referred to as `D`.
>
> Most dictionary-related operations use the second format because it is easier to manipulate on the stack. However, when dictionaries are serialized within larger TL-B objects, they follow the first representation.

In FunC, dictionaries are also represented as `cells` with the implicit assumption that they can be `null`. There are no separate types for dictionaries with different key lengths or value types—after all, this is FunC, not FunC++.

### Taxonomy note

A dictionary primitive interprets dictionary keys in one of three ways:

1. Unsigned `l`-bit integers (denoted by **u**);
2. Signed `l`-bit integers (denoted by **i**);
3. `l`-bit slices (**no prefix**).

The naming convention of dictionary primitives reflects these distinctions. For example:

- `udict_set` is a set-by-key function for dictionaries with unsigned integer keys.
- `idict_set` is the equivalent function for signed integer keys.
- `dict_set` applies to dictionaries with slice keys.

In function titles, an **empty prefix** indicates slice keys.
Additionally, some primitives have counterparts prefixed with `~`, enabling them to be used as [modifying methods](/v3/documentation/smart-contracts/func/docs/statements#modifying-methods).

### Dictionary values

Values in a dictionary can be stored in two ways:

1. As a **subslice** within an inner dictionary cell.
2. As a **reference** to a separate cell.

In the first case, even if a value is small enough to fit within a cell, it may not fit within the dictionary.
This is because a segment of the corresponding key may already occupy part of the inner cell’s space.

The second method, while ensuring storage, is less efficient regarding gas consumption.
Storing a value this way is functionally equivalent to inserting a slice with no data bits and a single reference to the value,
as in the first method.

#### dict_set

```func
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
```

This function updates the dictionary `dict` by setting the value corresponding to the `key_len`-bit key `index` to `value`, a slice, and returns the updated dictionary.

#### dict_set_ref

```func
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
```

This is similar to `dict_set`, but it sets the value to a reference of cell `value`.

#### dict_get?

```func
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
```

Searches for the key `index` in the `dict` dictionary with `key_len`-bit keys. It retrieves the associated value as a `slice` and returns a success flag of `-1` if found. If not found, it returns `(null, 0)`.

#### dict_get_ref?

```func
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
```

Similar to`dict_get?`, but it returns the first reference of the found value.

#### dict_get_ref

```func
cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
```

This variant of `dict_get_ref?` returns `null` if the key `index` is absent in the dictionary `dict`.

#### dict_set_get_ref

```func
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
```

This function sets the value associated with the `index` to `value`. If the `value` is `null`, the key is deleted.
It then returns the old value or `null` if it wasn't present.

#### dict_delete?

```func
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
```

This function deletes the `key_len`-bit key `index` from the dictionary `dict`. It returns the modified dictionary and a success flag of `-1` if successful.
If the key is not found, it returns the original dictionary and `0`.

#### dict_delete_get?

```func
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
```

Deletes the `key_len`-bit key `index` from the dictionary `dict`. If the key is found, it returns the modified dictionary, the original value associated with the key as a Slice, and the success flag `-1`. If the key is not found, it returns `(dict, null, 0)`.

#### dict_add?

```func
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
```

This `add` operation is similar to `dict_set` but only sets the value if the key `index` does not already exist in the dictionary `dict`. It returns the modified dictionary and a success flag of `-1` or `(dict, 0)`.

#### dict_replace?

```func
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
```

This `replace` operation works like `dict_set`, but it only updates the value for the `index` if the key is already present in the dictionary `dict`. It returns the modified dictionary and a success flag of `-1` or `(dict, 0)`.

### Builder counterparts

The following primitives accept a builder as the new value instead of a slice, making them more convenient when the value needs to be serialized from multiple components computed on the stack. Functionally, this is equivalent to converting the builder into a slice and executing the corresponding primitive listed above.

#### dict_set_builder

```func
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
```

It works similarly to `dict_set` but takes a builder as input.

#### dict_add_builder?

```func
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
```

Similar to `dict_add?`, but uses a builder.

#### dict_replace_builder?

```func
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
```

Similar to`dict_replace?`, but uses a builder.

#### dict_delete_get_min

```func
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
```

Finds the smallest key `k` in the dictionary `dict`, removes it, and returns `(dict', k, x, -1)`, where `dict'` is the updated dictionary and `x` is the value associated with `k`. If the dictionary is empty, it returns `(dict, null, null, 0)`.

Note: The key returned by `idict_delete_get_min` may differ from that returned by `dict_delete_get_min` and `udict_delete_get_min`.

#### dict_delete_get_max

```func
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
```

Finds the largest key `k` in the dictionary `dict`, removes it, and returns `(dict', k, x, -1)`, where `dict'` is the updated dictionary and `x` is the value associated with `k`. If the dictionary is empty, it returns `(dict, null, null, 0)`.

#### dict_get_min?

```func
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
```

Finds the smallest key `k` in the dictionary `dict` and returns `(k, x, -1)`, where `x` is the value associated with `k`. If the dictionary is empty, it returns `(null, null, 0)`.

#### dict_get_max?

```func
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
```

Finds the largest key `k` in the dictionary `dict` and returns `(k, x, -1)`, where `x` is the value associated with `k`. If the dictionary is empty, it returns `(null, null, 0)`.

#### dict_get_min_ref?

```func
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
```

Same as `dict_get_min?` but it returns a reference.

#### dict_get_max_ref?

```func
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
```

Same as `dict_get_max?` but it returns a reference.

#### dict_get_next?

```func
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
```

Finds the smallest key `k` in `dict` that is greater than the `pivot`. Returns `k`, associated value, and a success flag. If the dictionary is empty, it returns `(null, null, 0)`.

#### dict_get_nexteq?

```func
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
```

Similar to `dict_get_next?`, but instead finds the smallest key `k` that is greater than or equal to the `pivot`.

#### dict_get_prev?

```func
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
```

Similar to `dict_get_next?`, but instead finds the largest key `k` that is less than the `pivot`.

#### dict_get_preveq?

```func
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";
```

Similar to `dict_get_prev?`, but instead finds the largest key `k` that is less than or equal to the `pivot`.

#### new_dict

```func
cell new_dict() asm "NEWDICT";
```

Creates an empty dictionary, which is represented as a `null` value—a special case of `null()`.

#### dict_empty?

```func
int dict_empty?(cell c) asm "DICTEMPTY";
```

Checks whether a dictionary is empty. Equivalent to `cell_null?`.

## Prefix dictionaries primitives

TVM supports dictionaries with non-fixed length keys that follow a prefix code structure, meaning no key is a prefix of another key.
Learn more in the [TVM instruction](/v3/documentation/tvm/tvm-overview) section.

#### pfxdict_get?

```func
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
```

Searches for the unique prefix of a slice `key` in the prefix code dictionary `dict`. If found, returns `(s', x, s'', -1)`, where:

- `s'` is the matching prefix of `s`,
- `x` is the corresponding value (a slice),
- `s''` is the remaining part of `s`,
- `-1` indicates success.

If no matching prefix is found, returns `(null, null, s, 0)`, where `s` remains unchanged and `0` indicates failure.

#### pfxdict_set?

```func
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
```

Works like `dict_set` but fails if the given key is a prefix of an existing key in dict. Returns a flag indicating success.

#### pfxdict_delete?

```func
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";
```

Similar to `dict_delete?`.

## Special primitives

#### null

```func
forall X -> X null() asm "PUSHNULL";
```

In TVM, the `Null` type in FunC represents the absence of a value for any atomic type, meaning `null` can take on any atomic type.

#### ~impure_touch

```func
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";
```

Marks a variable as used, ensuring the code generated isn't removed during optimization, even if it's not impure. See [Impure specifier](/v3/documentation/smart-contracts/func/docs/functions#impure-specifier) section.

## Other primitives

#### min

```func
int min(int x, int y) asm "MIN";
```

Computes the minimum of two integers `x` and `y`.

#### max

```func
int max(int x, int y) asm "MAX";
```

Computes the maximum of two integers `x` and `y`.

#### minmax

```func
(int, int) minmax(int x, int y) asm "MINMAX";
```

Returns `(min(x, y), max(x, y))`, sorting two integers.

#### abs

```func
int abs(int x) asm "ABS";
```

Computes the absolute value of `x`.

<Feedback />



================================================
FILE: docs/v3/documentation/smart-contracts/func/docs/types.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/func/docs/types.md
================================================
import Feedback from '@site/src/components/Feedback';

# Types

:::info

FunC documentation was initially written by _[@akifoq](https://github.com/akifoq/)_.

:::

FunC includes several built-in types that serve as the foundation of the language.


## Atomic types
- `int` is a 257-bit signed integer type. Overflow checks are enabled by default and trigger an exception if exceeded.

- `cell` is a TVM cell type used to store persistent data in the TON Blockchain. Data is organized in trees of cells, with each cell containing up to 1023 bits of arbitrary data and up to four references to other cells. Cells function as memory units in stack-based TVMs.

- `slice` is a read-only view of a cell that allows sequential access to its data and references. A cell can be converted into a slice, extracting stored bits and references without modifying the original cell.

- `builder` is a mutable structure used to construct cells by adding data and references before finalizing them into a new cell.

- `tuple` is an ordered collection of up to 255 elements, each capable of holding a value of any type.

- `cont` is a TVM continuation used to manage execution flow in TVM programs. Although a low-level construct, it provides flexible execution control.

Each of these types occupies a single slot in the TVM stack.

### No boolean type
FunC does not have a dedicated boolean type.
Instead, booleans are represented as integers:
- `false` is `0`, `true` is `-1` (a 257-bit integer with all bits set to 1).
- Logical operations are performed using bitwise operations. 
- In conditional checks, any nonzero integer is treated as `true`.

### Null values
In FunC, the `null` value of the TVM type `Null` represents the absence of a value for a given atomic type. While `null` is generally not allowed, some standard library functions handle it in specific ways:
- Some functions that return an atomic type may return `null` in some instances. 
- Others may expect an atomic type as input but can also accept `null` without errors. 
- This behavior is explicitly defined in the function specification.
By default, `null` values are not permitted and will cause a runtime exception.

Additionally, an atomic type `A` can be implicitly transformed into `A^?` (also known as `Maybe A`), 
allowing a variable of type `A` to store either a valid value or `null`. 
This transformation happens automatically and is not enforced by the type checker.


## Hole type
FunC has support for type inference. Types `_` and `var` represent type "holes" which can later be filled with some actual type during type checking. For example, `var x = 2;` is a definition of variable `x` equal to `2`. The type checker can infer that `x` has type `int`, because `2` has type `int`, and the left and right sides of the assignment must have equal types.

FunC supports type inference. The hole types `_` and `var` serve as placeholders that are resolved during type checking.
For example, in the declaration:
```func
var x = 2;
 ``` 

The type checker determines that `x` is of type `int` since `2` is an `int`, 
and both sides of the assignment must have matching types.


## Composite types
Types can be combined to form more complex structures.

### Functional type

A functional type is written in the form `A -> B`, where:
- `A` is the input type, which is called domain.
- `B` is the output type, which is called codomain.

**Example:**
The type `int -> cell` represents a function that:
- Takes an integer as input.
- Returns a TVM cell as output.

Internally, values of functional types are represented as **continuations**.

### Tensor types

Tensor types represent ordered collections of values and are written in the form `(A, B, ...)`. 
These types occupy multiple TVM stack entries, unlike atomic types, which use a single entry.

**Example:**

If a function `foo` has the type `int -> (int, int)`, 
it takes one integer as input and returns a pair of integers as output. 
A call to this function may look like: `(int a, int b) = foo(42);`. 
Internally, the function consumes one stack entry and produces two.


**Type representation**
Although the values `(2, (3, 9))` of type `(int, (int, int))` and `(2, 3, 9)` of type `(int, int, int)` are stored identically as three stack entries `(2, 3, and 9)`, FunC treats them as distinct types.
For instance, the following code **will not compile**:

```func
(int a, int b, int c) = (2, (3, 9));
 ```
Since FunC strictly enforces type consistency, these structures cannot be mixed.


**Special case: unit type`()`**

The unit type `()` is used to indicate that:
- A function does not return a value or
- A function takes no arguments

**Examples**
- `print_int` has the type `int -> ()`, meaning it takes an integer but returns nothing.
- random has the type `() -> int`, meaning it takes no arguments but returns an integer.
- The unit type `()` has a single value, also written as `()`, occupying **zero stack** entries.

Type of form `(A)` is considered by type checker as the same type as `A`.

**Note:** A type written as `(A)` is treated as identical to `A` by the FunC type checker.

### Tuples types

Tuple types in FunC are written in the form `[A, B, ...]` and represent TVM tuples with a fixed length and known component types at compile time.

For example, `[int, cell]` defines a tuple with exactly two elements:
- The first element is an integer.
- The second element is a cell.

The type `[]` represents an empty tuple with a unique value—the empty tuple itself.

**Note:** unlike the unit type `()`, an empty tuple `[]` occupies one stack entry.



## Polymorphism with type variables

FunC features a **custom type system** with support for polymorphic functions.
For example, consider the following function:

```func
forall X -> (X, X) duplicate(X value) {
  return (value, value);
}
```
is a polymorphic function which takes a (single stack entry) value and returns two copies of this value. `duplicate(6)` will produce values `6 6`, and `duplicate([])` will produce two copies `[] []` of an empty tuple.

This **polymorphic function** takes a single stack entry and returns two copies of the input value.
- Calling `duplicate(6)` produces `6 6`.
- Calling `duplicate([])` produces two copies of an empty tuple: `[] []`.

In this example, `X` is a type variable that allows the function to operate on values of any type.

For more details, see the [Functions](/v3/documentation/smart-contracts/func/docs/functions#polymorphism-with-forall) section.

## User-defined types

Currently, FunC does not support defining custom types beyond the type constructions described above.

## Type width
Every value in FunC occupies a certain number of stack entries. 
If this number is consistent for all values of a given type, it is called the **type width**.
At the moment, polymorphic functions can only be defined for types with a fixed and predefined type width.

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/func/libraries.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/func/libraries.md
================================================
import Feedback from '@site/src/components/Feedback';

# FunC SDK and libraries  

## Standard libraries

 - [stdlib](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc/): the FunC standard library 
 - [mathlib](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/mathlib.fc/): the FunC fixed-point math library
 
## Libraries from community

 - [continuation-team/openlib.func](https://github.com/continuation-team/openlib.func/): reduces transaction fees in common scenarios.
  - [open-contracts/utils](https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/utils/): utility library.
 - [open-contracts/strings](https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/strings/): provides string manipulation functions.
 - [open-contracts/math](https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/math/): extends FunC arithmetic operations with additional math functions.
 - [open-contracts/tuples](https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/tuples/): collection of tuple-related functions for FunC.
 - [open-contracts/crypto](https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/crypto/): provides cryptographic operations for secp256k1 curves.
 - [toncli/test-libs](https://github.com/disintar/toncli/tree/master/src/toncli/lib/test-libs/): supports TLB operations, including message and type parsing and generation.
 - [ston-fi/funcbox](https://github.com/ston-fi/funcbox/): collection of FunC snippets and utilities.

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/func/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/func/overview.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'

# Overview

__FunC__ is a high-level language used to program smart contracts on TON.

FunC is a domain-specific, C-like, statically typed language. Here is a simple example of a method for sending money written in FunC:

```func
() send_money(slice address, int amount) impure inline {
    var msg = begin_cell()
        .store_uint(0x10, 6) ;; nobounce
        .store_slice(address)
        .store_coins(amount)
        .end_cell();

    send_raw_message(msg, 64);
}
```

The compiler converts FunC programs into Fift assembler code, generating the corresponding bytecode for the [TON Virtual Machine](/v3/documentation/tvm/tvm-overview/).

Developers and engineers can use its bytecode, which is structured as a [tree of cells](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage/) like all data in the TON Blockchain, to create smart contracts or run it on a local instance of the TVM.

<Button href="/v3/documentation/smart-contracts/func/cookbook" colorType={'primary'} sizeType={'sm'}>

  FunC cookbook

</Button>


<Button href="/v3/documentation/smart-contracts/func/docs/types" colorType={'secondary'} sizeType={'sm'}>

  FunC documentation

</Button>


## Compiler

### Compile with JS

Using the Blueprint framework is the most convenient and quickest way to begin developing and compiling smart contracts.
Read more in the [Blueprint](/v3/documentation/smart-contracts/getting-started/javascript/) section.

```bash
npm create ton@latest
```

### Compile with original binaries

If you want to use the native FunC language locally, you need to set up the TON compiler binaries on your machine.
FunC compiler binaries for Windows, macOS (Intel/M1), and Ubuntu can be downloaded from:
* [Environment setup page](/v3/documentation/archive/precompiled-binaries/)

:::info
Alternatively, you can create binaries from source code,
such as the [compiler's source code for FunC](https://github.com/ton-blockchain/ton/tree/master/crypto/func/).
Read [how to compile](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#func) it from sources.
:::

## TON Blockchain course

The [TON Blockchain course](https://stepik.org/course/176754/) includes Module 4,
which covers FunC and smart contract development.


<Button href="https://stepik.org/course/176754/promo"
        colorType={'primary'} sizeType={'sm'}>

Check TON Blockchain course

</Button>


<Button href="https://stepik.org/course/201638/promo"
        colorType={'secondary'} sizeType={'sm'}>

CHN

</Button>


<Button href="https://stepik.org/course/201855/promo"
        colorType={'secondary'} sizeType={'sm'}>

RU

</Button>


## Tutorials

:::tip starter tip
The best place to start developing with FunC is the [Introduction](/v3/documentation/smart-contracts/overview/) section.
:::

Below, you can find additional materials shared by community experts:

  - [Challenge 1: Simple NFT deploy](https://github.com/romanovichim/TONQuest1/)
  - [Challenge 2: Chatbot contract](https://github.com/romanovichim/TONQuest2/)
  - [Challenge 3: Jetton vending machine](https://github.com/romanovichim/TONQuest3/)
  - [Challenge 4: Lottery/raffle](https://github.com/romanovichim/TONQuest4/)
  - [Challenge 5: Create UI to interact with the contract in 5 minutes](https://github.com/romanovichim/TONQuest5/)
  - [Challenge 6: Analyzing NFT sales on the Getgems marketplace](https://github.com/romanovichim/TONQuest6/)
* [Func & Blueprint](https://www.youtube.com/watch?v=7omBDfSqGfA&list=PLtUBO1QNEKwtO_zSyLj-axPzc9O9rkmYa/) - _@MarcoDaTr0p0je_
* [TON hello world: step-by-step guide for writing your first smart contract](https://ton-community.github.io/tutorials/02-contract/)
* [TON hello world: step-by-step guide for testing your first smart contract](https://ton-community.github.io/tutorials/04-testing/)
* [10 FunC lessons](https://github.com/romanovichim/TonFunClessons_Eng/) - _@romanovichim_, using a blueprint
* [10 FunC lessons (RU)](https://github.com/romanovichim/TonFunClessons_ru/) - _@romanovichim_, using a blueprint
* [FunC quiz](https://t.me/toncontests/60/) - _Vadim_. It is good for self-checking and will take 10–15 minutes. The questions are mainly about FunС, with a few general questions about TON.
* [FunC quiz (RU)](https://t.me/toncontests/58?comment=14888/) - _Vadim_

## Contests

Joining [contests](https://t.me/toncontests/) is a great way to learn FunC.
You can also review past competitions to learn more.

#### Contests legacy

| Contest                  | Tasks                                                    | Solutions                                                              |
|--------------------------|----------------------------------------------------------|------------------------------------------------------------------------|
| TSC #5 (Dec 2023)  | [Tasks](https://github.com/ton-community/tsc5/)           |                                                                        |
| TSC #4 (Sep 2023) | [Tasks](https://github.com/ton-community/tsc4/)           | [Solutions](/v3/documentation/smart-contracts/contracts-specs/examples#ton-smart-challenge-4)   |
| TSC #3 (Dec 2022)  | [Tasks](https://github.com/ton-blockchain/func-contest3/) | [Solutions](https://github.com/nns2009/TON-FunC-contest-3/)             |
| TSC #2 (Jul 2022)      | [Tasks](https://github.com/ton-blockchain/func-contest2/) | [Solutions](https://github.com/ton-blockchain/func-contest2-solutions/) |
| TSC #1 (Mar 2022)     | [Tasks](https://github.com/ton-blockchain/func-contest1/) | [Solutions](https://github.com/ton-blockchain/func-contest1-solutions/) |

## Smart contract examples

Follow [this link](/v3/documentation/smart-contracts/contracts-specs/examples/) to find various standard smart contracts,
such as wallets, electors that manage validation on TON, multi-signature wallets, etc. These can serve as helpful learning references.


## Changelog
[History of FunC](/v3/documentation/smart-contracts/func/changelog/)



<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/getting-started/ide-plugins.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/getting-started/ide-plugins.md
================================================
import Feedback from '@site/src/components/Feedback';

# IDE plugins

Select the IDE or editor in the table of contents on the right and install the relevant plugin for your language of choice.

Using the [TON Web IDE](https://ide.ton.org/), you can try FunC or Tact online without installing anything locally.

## IntelliJ IDEs

### FunC

![](/img/docs/ton-jetbrains-plugin.png)

:::info
This plugin can be used with any JetBrains product.
(IntelliJ IDEA, WebStorm, PyCharm, CLion, etc.)
:::

There are several ways to install a plugin:
- Find plugin directly in the IDE plugins section with "**TON**" keywords
- [Marketplace link](https://plugins.jetbrains.com/plugin/23382-ton)
- [GitHub repository](https://github.com/ton-blockchain/intellij-ton)

### Tact

There are several ways to install a plugin:
- Find the plugin directly in the IDE plugins section with "**Tact**" keywords
- [Marketplace link](https://plugins.jetbrains.com/plugin/27290-tact)
- [GitHub repository](https://github.com/tact-lang/intelli-tact)

## VS Code

Visual Studio Code is a free and popular IDE for developers.

### FunC

- [Marketplace link](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode)
- [GitHub repository](https://github.com/ton-foundation/vscode-func)

### Tact

- [Marketplace link](https://marketplace.visualstudio.com/items?itemName=tonstudio.vscode-tact)
- [Open VSX registry link](https://open-vsx.org/extension/tonstudio/vscode-tact)
- [GitHub repository](https://github.com/tact-lang/tact-language-server)

## Sublime Text

### FunC

- [GitHub repository](https://github.com/savva425/func_plugin_sublimetext3)

### Tact

- [Package Control link](https://packagecontrol.io/packages/Tact)
- [GitHub repository](https://github.com/tact-lang/tact-sublime)

## Vim

All-in-one Vim 8+ plugin for Tact language.

- [GitHub repository](https://github.com/tact-lang/tact.vim)

## Neovim

To enable syntax highlighting in Neovim, follow the installation instructions in the [nvim-treesitter quickstart guide](https://github.com/nvim-treesitter/nvim-treesitter#quickstart).

To make sure `.tact` extension is properly recognized, install the [tact.vim](https://github.com/tact-lang/tact.vim) plugin.

## Helix

To enable support of the Tact language, refer to the following instructions:

1. For latest syntax highlighting, setup [tree-sitter-tact](https://github.com/tact-lang/tree-sitter-tact#helix)
2. For editor intelligence, setup [tact-language-server](https://github.com/tact-lang/tact-language-server#other-editors)

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/getting-started/javascript.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/getting-started/javascript.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'


# Blueprint

![Blueprint](/img/blueprint/logo.svg)

A development environment for TON for writing, testing, and deploying smart contracts.

## Quick start

Run the following in terminal to create a new project and follow the on-screen instructions:

```bash
npm create ton@latest
```


<Button href="https://www.youtube.com/watch?v=7omBDfSqGfA&list=PLtUBO1QNEKwtO_zSyLj-axPzc9O9rkmYa" colorType={'secondary'} sizeType={'sm'}>

Watch video tutorials

</Button>


### Core features

- Streamlined workflow for building, testing and deploying smart contracts
- Dead simple deployment to mainnet/testnet using your favorite wallet (eg. Tonkeeper)
- Blazing fast testing of multiple smart contracts in an isolated blockchain running in-process

### Tech stack
- Compiling FunC with https://github.com/ton-community/func-js (no cli)
- Compiling Tact with https://github.com/tact-lang/tact
- Testing smart contracts with https://github.com/ton-org/sandbox
- Deploying smart contracts with TON Connect 2.0 compatible wallets or a `ton://` deeplink

### Requirements

- [Node.js](https://nodejs.org/) with a recent version like v18, verify version with `node -v`
- IDE with TypeScript and TON support:
  - [Visual Studio Code](https://code.visualstudio.com/) with the [FunC plugin](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode) or [Tact plugin](https://marketplace.visualstudio.com/items?itemName=tonstudio.vscode-tact)
  - [IntelliJ IDEA](https://www.jetbrains.com/idea/) with the [TON Development plugin](https://plugins.jetbrains.com/plugin/23382-ton)

## References

### GitHub

- https://github.com/ton-org/blueprint

### Materials

- [Blueprint using on DoraHacks stream](https://www.youtube.com/watch?v=5ROXVM-Fojo)
- [Create a new project](https://github.com/ton-org/blueprint#create-a-new-project)
- [Develop a new smart contract](https://github.com/ton-org/blueprint#develop-a-new-contract)
- [[YouTube] Func with Blueprint EN](https://www.youtube.com/watch?v=7omBDfSqGfA&list=PLtUBO1QNEKwtO_zSyLj-axPzc9O9rkmYa) ([RU version](https://youtube.com/playlist?list=PLyDBPwv9EPsA5vcUM2vzjQOomf264IdUZ))


## See also

* [Develop smart contract introduction](/v3/documentation/smart-contracts/overview)
* [How to work with wallet smart contracts](/v3/guidelines/smart-contracts/howto/wallet)
* [SDKs](/v3/guidelines/dapps/apis-sdks/sdk)


<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/getting-started/testnet.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/getting-started/testnet.md
================================================
import Feedback from '@site/src/components/Feedback';

# Understanding Testnet

Use the TON test network for development and testing purposes.

:::info
Coins in the test network have no value, and the network can be reset at any time.
:::

* Testnet global configuration: https://ton.org/testnet-global.config.json
* Get free test coins from the [@test_giver_ton_bot](https://t.me/testgiver_ton_bot)
* Check the testnet status in the Telegram channel: [@testnetstatus](https://t.me/testnetstatus)

### Core services

For convenience, nearly the entire mainnet infrastructure (wallets, APIs, bridges, etc.) has been replicated in the test network.

* Explorer: https://testnet.tonscan.org
* Web wallet: https://wallet.ton.org/?testnet=true
* Browser extension: use [mainnet browser extension](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd) and [do this](https://github.com/toncenter/ton-wallet#switch-between-mainnettestnet-in-extension).
* Testnet TON Center API: https://testnet.toncenter.com
* Testnet HTTP API: https://testnet.tonapi.io/
* Testnet bridge: https://bridge.ton.org/?testnet=true
* Testnet dTON GraphQL: https://testnet.dton.io/

## TON Ecosystem services Testnet

### Wallets
- To use [Tonkeeper's testnet](https://tonkeeper.com/), tap the Wallets list and then Add Wallet, then use Testnet Account button.
* Testnet CryptoBot: https://t.me/CryptoTestnetBot
* Special link for TON Space Testnet: https://t.me/wallet/start?startapp=tonspace_settings
* https://multisig.ton.org/?testnet=true

### Explorers 

* https://testnet.tonscan.org
* https://testnet.tonviewer.com
* https://test-explorer.toncoin.org
* https://tonsandbox.com/explorer
* https://testnet.ton.cx

### Other services
* https://minter.ton.org/?testnet=true
* https://dns.ton.org/?testnet=true
* https://vesting.ton.org/?testnet=true
* https://teststaking.xyz
* https://testnet.getgems.io
* https://app.hipo.finance/#/network=testnet/
* https://testnet-elections.toncenter.com/getValidationCycles?limit=2&return_participants=true



<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/limits.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/limits.md
================================================
# TON Blockchain limits

This document contains the current limits and metrics used in the TON blockchain.

:::info
You can check all the blockchain parameters live in the explorer:[Tonviewer](https://tonviewer.com/config) or [Tonscan](https://tonscan.org/config).

Parameters defined in the code can be found in the [source code repository](https://github.com/ton-blockchain/ton).
:::

## Message and transaction limits

<!-- &nbsp; represents a non-breaking space in HTML -->

| Name                       | Description                                              | Value    | Type   | Defined&nbsp;in |
| -------------------------- | -------------------------------------------------------- | -------- | ------ | --------------- |
| `max_size`                 | Maximum external message size in bytes                   | 65535    | uint32 | [mc-config.h](https://github.com/ton-blockchain/ton/blob/master/crypto/block/mc-config.h)     |
| `max_depth`                | Maximum external message depth                           | 512      | uint16 | [mc-config.h](https://github.com/ton-blockchain/ton/blob/master/crypto/block/mc-config.h)     |
| `max_msg_bits`             | Maximum message size in bits                             | 2097152  | uint32 | [mc-config.h](https://github.com/ton-blockchain/ton/blob/master/crypto/block/mc-config.h)     |
| `max_msg_cells`            | Maximum number of cells a message can occupy             | 8192     | uint32 | [mc-config.h](https://github.com/ton-blockchain/ton/blob/master/crypto/block/mc-config.h)     |
| `max_vm_data_depth`        | Maximum cell depth in messages and c4 & c5 registers     | 512      | uint16 | [mc-config.h](https://github.com/ton-blockchain/ton/blob/master/crypto/block/mc-config.h)     |
| `max_actions`              | Maximum amount of actions                                | 256      | uint32 | [transaction.h](https://github.com/ton-blockchain/ton/blob/master/crypto/block/transaction.h)   |
| `max_library_cells`        | Maximum number of library cells in library               | 1000     | uint32 | [mc-config.h](https://github.com/ton-blockchain/ton/blob/master/crypto/block/mc-config.h)     |
| `max_acc_state_cells`      | Maximum number of cells that an account state can occupy | 65536    | uint32 | [mc-config.h](https://github.com/ton-blockchain/ton/blob/master/crypto/block/mc-config.h)     |
| `max_acc_state_bits`       | Maximum account state size in bits                       | 67043328 | uint32 | [cells x size](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage)    |
| `max_acc_public_libraries` | Maximum amount of public libraries for account           | 256      | uint32 | [mc-config.h](https://github.com/ton-blockchain/ton/blob/master/crypto/block/mc-config.h)     |

## Gas and fee parameters

| Name                | Description                                                         | Value    | Type       | Defined&nbsp;in |
| ------------------- | ------------------------------------------------------------------- | -------- | ---------- | --------------- |
| `free_stack_depth`  | Stack depth without gas consumption                                 | 32       | enum_value | [vm.h](https://github.com/ton-blockchain/ton/blob/master/crypto/vm/vm.h)            |
| `runvm_gas_price`   | VM start gas consumption                                            | 40       | enum_value | [vm.h](https://github.com/ton-blockchain/ton/blob/master/crypto/vm/vm.h)            |
| `flat_gas_limit`    | Gas below `flat_gas_limit` is provided at price of `flat_gas_price` | 100      | uint64     | [config21](/v3/documentation/network/configs/blockchain-configs#param-20-and-21)        |
| `flat_gas_price`    | Costs of launching the TON Virtual Machine                          | 40000    | uint64     | [config21](/v3/documentation/network/configs/blockchain-configs#param-20-and-21)        |
| `gas_price`         | Price of gas in the network in nanotons per 65536 gas units         | 26214400 | uint64     | [config21](/v3/documentation/network/configs/blockchain-configs#param-20-and-21)        |
| `special_gas_limit` | Limit on gas for special (system) contract transactions             | 1000000  | uint64     | [config21](/v3/documentation/network/configs/blockchain-configs#param-20-and-21)        |
| `gas_limit`         | Maximum amount of gas per transaction                               | 1000000  | uint64     | [config21](/v3/documentation/network/configs/blockchain-configs#param-20-and-21)        |
| `gas_credit`        | Gas credit for checking external messages                           | 10000    | uint64     | [config21](/v3/documentation/network/configs/blockchain-configs#param-20-and-21)        |
| `block_gas_limit`   | Maximum gas per block                                               | 10000000 | uint64     | [config21](/v3/documentation/network/configs/blockchain-configs#param-20-and-21)        |

## Storage fees and limits

| Name               | Description                                  | Value      | Type   | Defined&nbsp;in |
| ------------------ | -------------------------------------------- | ---------- | ------ | --------------- |
| `freeze_due_limit` | Storage fees (nanoTON) for contract freezing | 100000000  | uint64 | [config21](/v3/documentation/network/configs/blockchain-configs#param-20-and-21)        |
| `delete_due_limit` | Storage fees (nanoTON) for contract deletion | 1000000000 | uint64 | [config21](/v3/documentation/network/configs/blockchain-configs#param-20-and-21)        |
| `bit_price_ps`     | Storage price for one bit for 65536 seconds  | 1          | uint64 | [config18](/v3/documentation/network/configs/blockchain-configs#param-18)        |
| `cell_price_ps`    | Storage price for one cell for 65536 seconds | 500        | uint64 | [config18](/v3/documentation/network/configs/blockchain-configs#param-18)        |

## Block size limits

| Name                  | Description                                  | Value    | Type   | Defined&nbsp;in |
| --------------------- | -------------------------------------------- | -------- | ------ | --------------- |
| `bytes_underload`     | Block size limit for underload state         | 131072   | uint32 | [config23](/v3/documentation/network/configs/blockchain-configs#param-22-and-23)        |
| `bytes_soft_limit`    | Block size soft limit                        | 524288   | uint32 | [config23](/v3/documentation/network/configs/blockchain-configs#param-22-and-23)        |
| `bytes_hard_limit`    | Absolute maximum block size in bytes         | 1048576  | uint32 | [config23](/v3/documentation/network/configs/blockchain-configs#param-22-and-23)        |
| `gas_underload`       | Block gas limit for underload state          | 2000000  | uint32 | [config23](/v3/documentation/network/configs/blockchain-configs#param-22-and-23)        |
| `gas_soft_limit`      | Block gas soft limit                         | 10000000 | uint32 | [config23](/v3/documentation/network/configs/blockchain-configs#param-22-and-23)        |
| `gas_hard_limit`      | Absolute maximum block gas                   | 20000000 | uint32 | [config23](/v3/documentation/network/configs/blockchain-configs#param-22-and-23)        |
| `lt_delta_underload`  | Logical time delta limit for underload state | 1000     | uint32 | [config23](/v3/documentation/network/configs/blockchain-configs#param-22-and-23)        |
| `lt_delta_soft_limit` | Logical time delta soft limit                | 5000     | uint32 | [config23](/v3/documentation/network/configs/blockchain-configs#param-22-and-23)        |
| `lt_delta_hard_limit` | Absolute maximum logical time delta          | 10000    | uint32 | [config23](/v3/documentation/network/configs/blockchain-configs#param-22-and-23)        |

## Message forwarding costs

| Name         | Description                                          | Value      | Type   | Defined&nbsp;in |
| ------------ | ---------------------------------------------------- | ---------- | ------ | --------------- |
| `lump_price` | Base price for message forwarding                    | 400000     | uint64 | [config25](/v3/documentation/network/configs/blockchain-configs#param-24-and-25)        |
| `bit_price`  | Cost per 65536 bit of message forwarding             | 26214400   | uint64 | [config25](/v3/documentation/network/configs/blockchain-configs#param-24-and-25)        |
| `cell_price` | Cost per 65536 cells of message forwarding           | 2621440000 | uint64 | [config25](/v3/documentation/network/configs/blockchain-configs#param-24-and-25)        |
| `ihr_factor` | Factor for immediate hypercube routing cost          | 98304      | uint32 | [config25](/v3/documentation/network/configs/blockchain-configs#param-24-and-25)        |
| `first_frac` | Fraction for first transition in message route       | 21845      | uint32 | [config25](/v3/documentation/network/configs/blockchain-configs#param-24-and-25)        |
| `next_frac`  | Fraction for subsequent transitions in message route | 21845      | uint32 | [config25](/v3/documentation/network/configs/blockchain-configs#param-24-and-25)        |

## MasterChain specific parameters

| Name                     | Description                                     | Value       | Type   | Defined&nbsp;in |
| ------------------------ | ----------------------------------------------- | ----------- | ------ | --------------- |
| `mc_bit_price_ps`        | Storage price for one bit for 65536 seconds     | 1000        | uint64 | [config18](/v3/documentation/network/configs/blockchain-configs#param-18)        |
| `mc_cell_price_ps`       | Storage price for one cell for 65536 seconds    | 500000      | uint64 | [config18](/v3/documentation/network/configs/blockchain-configs#param-18)        |
| `mc_flat_gas_limit`      | Gas below `flat_gas_limit` on MasterChain       | 100         | uint64 | [config20](/v3/documentation/network/configs/blockchain-configs#param-20-and-21)        |
| `mc_flat_gas_price`      | VM launch cost on MasterChain                   | 1000000     | uint64 | [config20](/v3/documentation/network/configs/blockchain-configs#param-20-and-21)        |
| `mc_gas_price`           | Gas price on MasterChain                        | 655360000   | uint64 | [config20](/v3/documentation/network/configs/blockchain-configs#param-20-and-21)        |
| `mc_special_gas_limit`   | Special contract gas limit on MasterChain       | 70000000    | uint64 | [config20](/v3/documentation/network/configs/blockchain-configs#param-20-and-21)        |
| `mc_gas_limit`           | Maximum gas per transaction on MasterChain      | 1000000     | uint64 | [config20](/v3/documentation/network/configs/blockchain-configs#param-20-and-21)        |
| `mc_gas_credit`          | Gas credit for checking external messages       | 10000       | uint64 | [config20](/v3/documentation/network/configs/blockchain-configs#param-20-and-21)        |
| `mc_block_gas_limit`     | Maximum gas per MasterChain block               | 2500000     | uint64 | [config20](/v3/documentation/network/configs/blockchain-configs#param-20-and-21)        |
| `mc_freeze_due_limit`    | Storage fees for contract freezing              | 100000000   | uint64 | [config20](/v3/documentation/network/configs/blockchain-configs#param-20-and-21)        |
| `mc_delete_due_limit`    | Storage fees for contract deletion              | 1000000000  | uint64 | [config20](/v3/documentation/network/configs/blockchain-configs#param-20-and-21)        |
| `mc_bytes_underload`     | Block size limit for underload state            | 131072      | uint32 | [config22](/v3/documentation/network/configs/blockchain-configs#param-22-and-23)        |
| `mc_bytes_soft_limit`    | Block size soft limit                           | 524288      | uint32 | [config22](/v3/documentation/network/configs/blockchain-configs#param-22-and-23)        |
| `mc_bytes_hard_limit`    | Absolute maximum block size in bytes            | 1048576     | uint32 | [config22](/v3/documentation/network/configs/blockchain-configs#param-22-and-23)        |
| `mc_gas_underload`       | Block gas limit for underload state             | 200000      | uint32 | [config22](/v3/documentation/network/configs/blockchain-configs#param-22-and-23)        |
| `mc_gas_soft_limit`      | Block gas soft limit                            | 1000000     | uint32 | [config22](/v3/documentation/network/configs/blockchain-configs#param-22-and-23)        |
| `mc_gas_hard_limit`      | Absolute maximum block gas                      | 2500000     | uint32 | [config22](/v3/documentation/network/configs/blockchain-configs#param-22-and-23)        |
| `mc_lump_price`          | Base price for message forwarding               | 10000000    | uint64 | [config24](/v3/documentation/network/configs/blockchain-configs#param-24-and-25)        |
| `mc_bit_price`           | Cost per 65536 bit of message forwarding        | 655360000   | uint64 | [config24](/v3/documentation/network/configs/blockchain-configs#param-24-and-25)        |
| `mc_cell_price`          | Cost per 65536 cells of message forwarding      | 65536000000 | uint64 | [config24](/v3/documentation/network/configs/blockchain-configs#param-24-and-25)        |
| `mc_ihr_factor`          | Factor for immediate hypercube routing cost     | 98304       | uint32 | [config24](/v3/documentation/network/configs/blockchain-configs#param-24-and-25)        |
| `mc_first_frac`          | Fraction for first transition in message route  | 21845       | uint32 | [config24](/v3/documentation/network/configs/blockchain-configs#param-24-and-25)        |
| `mc_next_frac`           | Fraction for subsequent transitions in route    | 21845       | uint32 | [config24](/v3/documentation/network/configs/blockchain-configs#param-24-and-25)        |
| `mc_lt_delta_underload`  | Logical time delta limit for underload state    | 1000        | uint32 | [config22](/v3/documentation/network/configs/blockchain-configs#param-22-and-23)        |
| `mc_lt_delta_soft_limit` | Logical time delta soft limit                   | 5000        | uint32 | [config22](/v3/documentation/network/configs/blockchain-configs#param-22-and-23)        |
| `mc_lt_delta_hard_limit` | Absolute maximum logical time delta             | 10000       | uint32 | [config22](/v3/documentation/network/configs/blockchain-configs#param-22-and-23)        |
| `mc_catchain_lifetime`   | MasterChain catchain groups lifetime in seconds | 250         | uint32 | [config28](/v3/documentation/network/configs/blockchain-configs#param-28)        |

## Validator parameters

| Name                        | Description                                         | Value      | Type   | Defined&nbsp;in |
| --------------------------- | --------------------------------------------------- | ---------- | ------ | --------------- |
| `shard_catchain_lifetime`   | ShardChain catchain groups lifetime in seconds      | 250        | uint32 | [config28](/v3/documentation/network/configs/blockchain-configs#param-28)        |
| `shard_validators_lifetime` | ShardChain validators group lifetime in seconds     | 1000       | uint32 | [config28](/v3/documentation/network/configs/blockchain-configs#param-28)        |
| `shard_validators_num`      | Number of validators in ShardChain validation group | 23         | uint32 | [config28](/v3/documentation/network/configs/blockchain-configs#param-28)        |
| `masterchain_block_fee`     | Reward for block creation                           | 1700000000 | Grams  | [config14](/v3/documentation/network/configs/blockchain-configs#param-14)        |
| `basechain_block_fee`       | BaseChain block fee                                 | 1000000000 | Grams  | [config14](/v3/documentation/network/configs/blockchain-configs#param-14)        |

## Time parameters

| Name          | Description                                  | Value | Type     | Defined&nbsp;in |
| ------------- | -------------------------------------------- | ----- | -------- | --------------- |
| `utime_since` | Initial Unix timestamp for price application | 0     | UnixTime | [config18](/v3/documentation/network/configs/blockchain-configs#param-18)        |



================================================
FILE: docs/v3/documentation/smart-contracts/message-management/ecosystem-messages-layout.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/message-management/ecosystem-messages-layout.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import ConceptImage from "@site/src/components/conceptImage";
import ThemedImage from "@theme/ThemedImage";

# Ecosystem messages layout

## Sending messages

<div class="text--center">
  <ThemedImage
    alt="Diagram of message sending flow"
    sources={{
      light:
        "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_1.svg?raw=true",
      dark: "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_1_dark.svg?raw=true",
    }}
  />
</div>

## Deploying a contract

<div class="text--center">
  <ThemedImage
    alt="Diagram of contract deployment process"
    sources={{
      light:
        "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_2.svg?raw=true",
      dark: "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_2_dark.svg?raw=true",
    }}
  />
</div>

## Burn jettons

- Implementation: [modern_jetton](https://github.com/EmelyanenkoK/modern_jetton/blob/master/contracts/op-codes.func) smart contract
  <div class="text--center">
    <ThemedImage
      alt="Diagram of jetton burning process"
      sources={{
        light:
          "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_3.svg?raw=true",
        dark: "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_3_dark.svg?raw=true",
      }}
    />
  </div>

## Request jetton wallet address

- Implementation: [modern_jetton](https://github.com/EmelyanenkoK/modern_jetton/blob/master/contracts/op-codes.func) smart contract
  <div class="text--center">
    <ThemedImage
      alt="Diagram of wallet address request flow"
      sources={{
        light:
          "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_4.svg?raw=true",
        dark: "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_4_dark.svg?raw=true",
      }}
    />
  </div>

## Transfer jettons

- Implementation: [modern_jetton](https://github.com/EmelyanenkoK/modern_jetton/blob/master/contracts/op-codes.func) smart contract
  <div class="text--center">
    <ThemedImage
      alt="Diagram of jetton transfer process"
      sources={{
        light:
          "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_5.svg?raw=true",
        dark: "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_5_dark.svg?raw=true",
      }}
    />
  </div>

## Mint jettons

- Implementation: [minter-contract](https://github.com/ton-blockchain/minter-contract/blob/main/contracts/imports/op-codes.fc) smart contract
  <div class="text--center">
    <ThemedImage
      alt="Diagram of jetton minting process"
      sources={{
        light:
          "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_6.png?raw=true",
        dark: "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_6_dark.png?raw=true",
      }}
    />
  </div>

## Prove SBT ownership to contract

- Implementation: [nft_contract](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/op-codes.fc) smart contract
  <div class="text--center">
    <ThemedImage
      alt="Diagram of SBT ownership verification"
      sources={{
        light:
          "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_7.svg?raw=true",
        dark: "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_7_dark.svg?raw=true",
      }}
    />
  </div>

## Transfer NFT

- Implementation: [nft_contract](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/op-codes.fc) smart contract
  <div class="text--center">
    <ThemedImage
      alt="Diagram of NFT transfer process"
      sources={{
        light:
          "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_8.svg?raw=true",
        dark: "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_8_dark.svg?raw=true",
      }}
    />
  </div>

## Mint NFT

:::info
Not specified by NFT standard in /ton-blockchain/token-contract
:::

<div class="text--center">
  <ThemedImage
    alt="Diagram of NFT minting process"
    sources={{
      light:
        "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_9.svg?raw=true",
      dark: "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_9_dark.svg?raw=true",
    }}
  />
</div>

## Batch mint NFT

:::info
Not specified by NFT standard in /ton-blockchain/token-contract
:::

<div class="text--center">
  <ThemedImage
    alt="Diagram of batch NFT minting process"
    sources={{
      light:
        "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_10.svg?raw=true",
      dark: "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_10_dark.svg?raw=true",
    }}
  />
</div>

## Destroy SBT by user

- Implementation: [nft_contracts](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/op-codes.fc) smart contract
  <div class="text--center">
    <ThemedImage
      alt="Diagram of user-initiated SBT destruction"
      sources={{
        light:
          "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_11.svg?raw=true",
        dark: "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_11_dark.svg?raw=true",
      }}
    />
  </div>

## Destroy SBT by admin

- Implementation: [nft_contracts](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/op-codes.fc) smart contract
  <div class="text--center">
    <ThemedImage
      alt="Diagram of admin-initiated SBT destruction"
      sources={{
        light:
          "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_12.svg?raw=true",
        dark: "/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_12_dark.svg?raw=true",
      }}
    />
  </div>

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/message-management/external-messages.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/message-management/external-messages.md
================================================
import Feedback from '@site/src/components/Feedback';

# External messages

External messages are `sent from the outside` to the smart contracts residing in TON Blockchain to make them perform certain actions.

For instance, a wallet smart contract expects to receive external messages containing orders (e.g., internal messages to be sent from the wallet smart contract) signed by the wallet's owner. When such an external message is received by the wallet smart contract, it first checks the signature, then accepts the message (by running the TVM primitive `ACCEPT`), and then performs whatever actions are required.

## Replay protection

:::caution
Stay vigilant and check replay protection in contracts for external-in messages.
:::

Notice that all external messages must be protected against replay attacks. The validators normally remove an external message from the pool of suggested external messages (received from the network); however, in some situations another validator could process the same external message twice (thus creating a second transaction for the same external message, leading to the duplication of the original action). Even worse, a `malicious actor could extract` the external message from the block containing the processing transaction and re-send it later. This could force a wallet smart contract to repeat a payment.

The simplest way to protect smart contracts from replay attacks related to external messages is to store a 32-bit counter `cur-seqno` in the persistent data of the smart contract, and to expect a `req-seqno` value in (the signed part of) any inbound external messages. Then an external message is accepted only if both the signature is valid and `req-seqno` equals `cur-seqno`. After successful processing, the `cur-seqno` value in the persistent data is increased by one, so the same external message will never be accepted again.

And one could also include an `expire-at` field in the external message, and accept an external message only if the current Unix time is less than the value of this field. This approach can be used in conjunction with `seqno`; alternatively, the receiving smart contract could store the set of (the hashes of) all recent (not expired) accepted external messages in its persistent data, and reject a new external message if it is a duplicate of one of the stored messages. Some garbage collection of expired messages in this set should also be performed to avoid bloating the persistent data.

:::note  
In general, an external message begins with a 256-bit signature (if needed), a 32-bit `req-seqno` (if needed), a 32-bit `expire-at` (if needed), and possibly a 32-bit `op` and other required parameters depending on `op`. The layout of external messages does not need to be as standardized as that of internal messages because external messages are not used for interaction between different smart contracts (written by different developers and managed by different owners).  
:::

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/message-management/internal-messages.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/message-management/internal-messages.md
================================================
import Feedback from '@site/src/components/Feedback';

# Internal messages

## Overview

Smart contracts interact with each other by sending so-called **internal messages**. When an internal message reaches its intended destination, an ordinary transaction is created on behalf of the destination account, and the internal message is processed as specified by the code and the persistent data of this account (smart contract).

:::info
In particular, the processing transaction can create one or several outbound internal messages, some of which may be addressed to the source address of the internal message being processed. This can be used to create simple "client-server applications" when a query is encapsulated in an internal message and sent to another smart contract, which processes the query and sends back a response again as an internal message.
:::

This approach requires distinguishing whether an internal message is a:

1. **Query** - initiating an action/request
2. **Response** - replying to a query
3. **Simple transfer** - requiring no processing (like basic value transfers)

Additionally, when receiving responses, there must be a clear way to match them to their original queries.

To implement this, the following message layout approaches are recommended (note: TON Blockchain imposes no message body restrictions - these are purely advisory):

### Internal message structure

The body of the message can be embedded into the message itself or stored in a separate cell referenced by the message, as indicated by the TL-B scheme fragment:

```tlb
message$_ {X:Type} ... body:(Either X ^X) = Message X;
```

The receiving smart contract should accept at least internal messages with embedded message bodies (whenever they fit into the cell containing the message). Suppose it accepts message bodies in separate cells (using the `right` constructor of `(Either X ^X)`). In that case, the processing of the inbound message should not depend on the specific embedding option chosen for the message body. On the other hand, it is perfectly valid not to support message bodies in separate cells for simpler queries and responses.

### Internal message body

The message body typically begins with the following fields:

- A 32-bit (big-endian) unsigned integer `op`, identifying the `operation` to be performed or the `method` of the smart contract to be invoked.
- A 64-bit (big-endian) unsigned integer `query_id`, used in all query-response internal messages to indicate that a response is related to a query (the `query_id` of a response must be equal to the `query_id` of the corresponding query). If `op` is not a query-response method (e.g., it invokes a method that is not expected to send an answer), then `query_id` may be omitted.
- The remainder of the message body is specific for each supported value of `op`.

### Simple message with a comment

If `op` is zero, the message is a "simple transfer message with the comment". The comment is contained in the remainder of the message body (without any `query_id` field, i.e., starting from the fifth byte). If it does not begin with the byte `0xff`, the comment is a text one; it can be displayed "as is" to the end user of a wallet (after filtering out invalid and control characters and checking that it is a valid UTF-8 string).

When a comment is long enough that it doesn’t fit in a cell, the non-fitting end of the line is put to the first reference of the cell. This process continues recursively to describe comments that don’t fit in two or more cells:

```
root_cell("0x00000000" - 32 bit, "string" up to 123 bytes)
 ↳1st_ref("string continuation" up to 127 bytes)
 ↳1st_ref("string continuation" up to 127 bytes)
 ↳....
```

The same format is used for comments for NFT and [jetton](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#forward_payload-format) transfers.

For instance, users may indicate the purpose of a simple transfer from their wallet to another user’s wallet in this text field. On the other hand, if the comment begins with the byte `0xff`, the remainder is a "binary comment", which should not be displayed to the end user as text (only as a hex dump if necessary). The intended use of "binary comments" is, e.g., to contain a purchase identifier for payments in a store, to be automatically generated and processed by the store’s software.

Most smart contracts should not perform non-trivial actions or reject the inbound message on receiving a simple transfer message. In this way, once `op` is found to be zero, the smart contract function for processing inbound internal messages (usually called `recv_internal()`) should immediately terminate with a zero exit code indicating success (e.g., by throwing exception `0`, if the smart contract has installed no custom exception handler). This will lead to the receiving account being credited with the value transferred by the message without any further effect.

### Messages with encrypted comments

If `op` is `0x2167da4b`, then the message is a transfer message with the encrypted comment. This message is serialized as follows:

Input:

- `pub_1` and `priv_1` - Ed25519 public and private keys of the sender, 32 bytes each.
- `pub_2` - Ed25519 public key of the receiver, 32 bytes.
- `msg` - a message to be encrypted, arbitrary byte string. `len(msg) <= 960`.

#### Encryption algorithm

1. Calculate `shared_secret` using `priv_1` and `pub_2`.
2. Let `salt` be the [bas64url representation](/v3/documentation/smart-contracts/addresses#user-friendly-address) of the sender wallet address with `isBounceable=1` and `isTestnetOnly=0`.
3. Select byte string `prefix` of length between 16 and 31 such that `len(prefix+msg)` is divisible by 16. The first byte of `prefix` equals `len(prefix)`, and the other bytes are random. Let `data = prefix + msg`.
4. Let `msg_key` be the first 16 bytes of `hmac_sha512(salt, data)`.
5. Calculate `x = hmac_sha512(shared_secret, msg_key)`. Let `key=x[0:32]` and `iv=x[32:48]`.
6. Encrypt `data` using AES-256 in CBC mode with `key` and `iv`.
7. Construct the encrypted comment:
   1. `pub_xor = pub_1 ^ pub_2` - 32 bytes. This allows each party to decrypt the message without looking up the other’s public key.
   2. `msg_key` - 16 bytes.
   3. Encrypted `data`.
8. The body of the message starts with the 4-byte tag `0x2167da4b`. Then, this encrypted comment is stored:
   1. The byte string is divided into segments and is stored in a chain of cells `c_1,...,c_k` (`c_1` is the root of the body). Each cell (except for the last one) has a reference to the next.
   2. `c_1` contains up to 35 bytes (not including the 4-byte tag); all other cells contain up to 127 bytes.
   3. This format has limitations: `k <= 16`, max string length is 1024.

Comments for NFT and jetton transfers follow the same format. Note that the public key of the sender and receiver addresses (not jetton-wallet addresses) should be used.

:::info  
Learn from examples of the message encryption algorithm:

- [encryption.js](https://github.com/toncenter/ton-wallet/blob/master/src/js/util/encryption.js)
- [SimpleEncryption.cpp](https://github.com/ton-blockchain/ton/blob/master/tonlib/tonlib/keys/SimpleEncryption.cpp)
  :::

### Simple transfer messages without comments

A simple transfer message without comment has an empty body even without an `op` field.
The above considerations apply to such messages as well. Note that such messages should have their bodies embedded into the message cell.

### Distinction between query and response messages

We expect "query" messages to have an `op` with the high-order bit clear, i.e., in the range `1 .. 2^31-1`, and "response" messages to have an `op` with the high-order bit set, i.e., in the range `2^31 .. 2^32-1`. If a method is neither a query nor a response (so that the corresponding message body does not contain a `query_id` field), it should use an `op` in the "query" range `1 .. 2^31 - 1`.

### Handling of standard response messages

There are some "standard" response messages with the `op` equal to `0xffffffff` and `0xfffffffe`. In general, the values of `op` from `0xfffffff0` to `0xffffffff` are reserved for such standard responses.

- `op` = `0xffffffff` means "operation not supported". It is followed by the 64-bit `query_id` extracted from the original query and the 32-bit `op` of the original query. All but the simplest smart contracts should return this error when they receive a query with an unknown `op` in the range `1 .. 2^31-1`.
- `op` = `0xfffffffe` means "operation not allowed". It is followed by the 64-bit `query_id` of the original query, followed by the 32-bit `op` extracted from the original query.

Notice that unknown "responses" (with an `op` in the range `2^31 .. 2^32-1`) should be ignored (in particular, no response with an `op` equal to `0xffffffff` should be generated in response to them), just as unexpected bounced messages (with the "bounced" flag set).

## Known op codes

:::info
Also op-code, op::code and operational code
:::

| Contract type | Hex code   | OP::code                                                                                                                               |
| ------------- | ---------- |----------------------------------------------------------------------------------------------------------------------------------------|
| Global        | 0x00000000 | Text comment                                                                                                                           |
| Global        | 0xffffffff | Bounce                                                                                                                                 |
| Global        | 0x2167da4b | [Encrypted comment](/v3/documentation/smart-contracts/message-management/internal-messages#messages-with-encrypted-comments)           |
| Global        | 0xd53276db | Excesses                                                                                                                               |
| Elector       | 0x4e73744b | New stake                                                                                                                              |
| Elector       | 0xf374484c | New stake confirmation                                                                                                                 |
| Elector       | 0x47657424 | Recover stake request                                                                                                                  |
| Elector       | 0x47657424 | Recover stake response                                                                                                                 |
| Wallet        | 0x0f8a7ea5 | Jetton transfer                                                                                                                        |
| Wallet        | 0x235caf52 | [Jetton call to](https://testnet.tonviewer.com/transaction/1567b14ad43be6416e37de56af198ced5b1201bb652f02bc302911174e826ef7)           |
| Jetton        | 0x178d4519 | Jetton internal transfer                                                                                                               |
| Jetton        | 0x7362d09c | Jetton notify                                                                                                                          |
| Jetton        | 0x595f07bc | Jetton burn                                                                                                                            |
| Jetton        | 0x7bdd97de | Jetton burn notification                                                                                                               |
| Jetton        | 0xeed236d3 | Jetton set status                                                                                                                      |
| Jetton-Minter | 0x642b7d07 | Jetton mint                                                                                                                            |
| Jetton-Minter | 0x6501f354 | Jetton change admin                                                                                                                    |
| Jetton-Minter | 0xfb88e119 | Jetton claim admin                                                                                                                     |
| Jetton-Minter | 0x7431f221 | Jetton drop admin                                                                                                                      |
| Jetton-Minter | 0xcb862902 | Jetton change metadata                                                                                                                 |
| Jetton-Minter | 0x2508d66a | Jetton upgrade                                                                                                                         |
| Vesting       | 0xd372158c | [Top up](https://github.com/ton-blockchain/liquid-staking-contract/blob/be2ee6d1e746bd2bb0f13f7b21537fb30ef0bc3b/PoolConstants.ts#L28) |
| Vesting       | 0x7258a69b | Add whitelist                                                                                                                          |
| Vesting       | 0xf258a69b | Add whitelist response                                                                                                                 |
| Vesting       | 0xa7733acd | Send                                                                                                                                   |
| Vesting       | 0xf7733acd | Send response                                                                                                                          |
| Dedust        | 0x9c610de3 | Dedust swap extout                                                                                                                     |
| Dedust        | 0xe3a0d482 | Dedust swap jetton                                                                                                                     |
| Dedust        | 0xea06185d | Dedust swap internal                                                                                                                   |
| Dedust        | 0x61ee542d | Swap external                                                                                                                          |
| Dedust        | 0x72aca8aa | Swap peer                                                                                                                              |
| Dedust        | 0xd55e4686 | Deposit liquidity internal                                                                                                             |
| Dedust        | 0x40e108d6 | Deposit liquidity jetton                                                                                                               |
| Dedust        | 0xb56b9598 | Deposit liquidity all                                                                                                                  |
| Dedust        | 0xad4eb6f5 | Pay out from pool                                                                                                                      |
| Dedust        | 0x474а86са | Payout                                                                                                                                 |
| Dedust        | 0xb544f4a4 | Deposit                                                                                                                                |
| Dedust        | 0x3aa870a6 | Withdrawal                                                                                                                             |
| Dedust        | 0x21cfe02b | Create vault                                                                                                                           |
| Dedust        | 0x97d51f2f | Create volatile Pool                                                                                                                   |
| Dedust        | 0x166cedee | Cancel deposit                                                                                                                         |
| StonFi        | 0x25938561 | Swap internal                                                                                                                          |
| StonFi        | 0xf93bb43f | Payment request                                                                                                                        |
| StonFi        | 0xfcf9e58f | Provide liquidity                                                                                                                      |
| StonFi        | 0xc64370e5 | Swap success                                                                                                                           |
| StonFi        | 0x45078540 | Swap success ref                                                                                                                       |

:::info
[DeDust docs](https://docs.dedust.io/docs/swaps)

[StonFi docs](https://docs.ston.fi/docs/developer-section/architecture#calls-descriptions)
:::

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/message-management/message-modes-cookbook.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/message-management/message-modes-cookbook.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import ConceptImage from "@site/src/components/conceptImage";
import ThemedImage from "@theme/ThemedImage";

# Message modes cookbook

Understanding the modes and flags for sending messages ensures your smart contracts behave as intended. This section illustrates their practical application through specific examples.

:::info IMPORTANT
You can check [this example](https://testnet.tonviewer.com/transaction/42ed45726e4fe994b7fd6dbf953a2ac24ecd77753858abeda9d6755c664a537a) as a real-world validation.
:::

#### Message value and account balance

The contract reflects all TON tokens it holds in its `balance`. Some of these tokens are also assigned to the currently processed incoming `message`. This mechanism is effective because any TON transaction involving a [non-system contract](/v3/documentation/smart-contracts/contracts-specs/governance) processes exactly one incoming message at a time.

> To better understand the `balance` inside the TVM, refer to how the [get_balance](/v3/documentation/smart-contracts/func/docs/stdlib/#get_balance) function operates.

Therefore, any blockchain payment may come either:

- From the incoming message's `value`.
  Contracts pay computation fees this way unless they call [accept_message](/v3/documentation/smart-contracts/transaction-fees/accept-message-effects), which prevents malicious actors from spending the contract's balance to process their data
- From the contract's `balance`, which leaves the incoming TON amount untouched during the transaction
  This approach currently applies to storage fees in workchains 0 and -1 and for the most common actions

#### Fees

Actual transaction fees will vary depending on the blockchain configuration, the smart contract code, and other factors. When a message is received, storage and gas fees will consume part of the contract `balance` if the message `value` [is above a certain amount](/v3/documentation/tvm/tvm-overview#when-the-compute-phase-is-skipped).

According to the [transaction flow](/v3/documentation/tvm/tvm-overview#transactions-and-phases), each transaction consists of five distinct phases:

- **Storage phase**  
   Handles storage fee and `in_msg` import fee.

- **Credit phase**  
   The `in_msg` value [is credited](https://github.com/ton-blockchain/ton/blob/7151ff26279fef6dcfa1f47fc0c5b63677ae2458/crypto/block/transaction.cpp#L959-L981) to the account balance.

- **Compute phase**  
   Executes the smart contract code via TVM.

- **Action phase**  
   Processes transaction outputs including `SENDRAWMSG` operations.

- **Bounce phase**  
   Manages message bounce handling when applicable.

#### Execution order notes:

For non-bounceable messages:
Credit → Storage → Compute → Action → Bounce

For bounceable messages:
Storage → Credit → Compute → Action → Bounce

> Compute, Action and Bounce phases may be skipped

#### Fee deduction sequence

1. Storage fees
2. Message import fees
3. Computation gas fees
4. Action processing fees + forward fees

#### Example of calculation

| Fee in explorer                                                                                       | Value       | How it's obtained               |
| :---------------------------------------------------------------------------------------------------- | :---------- | :------------------------------ |
| Total fee                                                                                             | 0.001982134 | gas + storage + action + import |
| Fwd. fee                                                                                              | 0.001       | fwd_fee + action_fee + ihr_fee  |
| Gas fee                                                                                               | 0.0011976   | compute phase, gas used         |
| Storage fee                                                                                           | 0.000000003 | storage phase, account only     |
| Action fee                                                                                            | 0.000133331 | action phase, cost per action   |
| Import fee (hidden)                                                                                   | 0.0006512   | cost of import of in_ext_msg    |
| [Forward fee](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#formula-1) (each msg) | 0.000266669 | cost of fwd of in_msg           |
| [IHR fee](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#ihr) (each msg)           | 0.0006      | cost of ihr fwd of in_msg       |

:::info IMPORTANT
The table is populated using [this example transaction](https://tonviewer.com/transaction/b5e14a9c4a4e982fda42d6079c3f84fa48e76497a8f3fca872f9a3737f1f6262).

For live calculations, refer to the [**fee calculator**](/v3/documentation/smart-contracts/transaction-fees/fees#basic-fees-formula).
:::

The transaction fees used in these examples are hypothetical and for illustrative purposes only. Any fees other than message forwarding are outside the scope of this article.
Funds included with an ignored message will still be [credited to the receiving address](https://testnet.tonviewer.com/transaction/8a388731812c80ab9b0ea9531108425488af5def854e4bd6f0ed47362b56d557).

## 1. (Mode 0, flag 0) basic message {#mode0}

State before transaction: Account A has 1 TON, Account B has 1 TON

**A** sent 0.1 TON to **B**, [msg_fwd_fees](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#forward-fees) are 0.004 TON, actual received value will be 0.096 TON, `fwd_fee` and `action_fee` are deducted from `value`.

State after the transaction: Account A has 0.9 TON, Account B has 1.096 TON

<br></br>
<div class="text--center">
  <ThemedImage
    alt=""
    sources={{
      light:
        "/img/docs/message-modes-cookbook/send_regular_message_1.png?raw=true",
      dark: "/img/docs/message-modes-cookbook/send_regular_message_1_dark.png?raw=true",
    }}
  />
</div>
<br></br>

## 2. (Mode 0, flag 2) error‐silent message {#mode2}

:::info
Please note that omitting the `+2` flag may be unsafe. For more information, refer to [this section](/v3/documentation/smart-contracts/message-management/sending-messages#mode3).
:::

State before transaction: Account A has 1 TON, Account B has 1 TON

**A** sent 0.1 TON to **B**. The `msg_fwd_fees` are 0.004 TON, and the actual received value will be 0.096 TON. The `fwd_fee` and `action_fee` are deducted from `value`.
In case of an error during [action phase](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes), the message will be skipped instead of throwing an [exit code](/v3/documentation/tvm/tvm-exit-codes#standard-exit-codes).

State after the transaction: Account A has 0.9 TON, Account B has 1.096 TON

:::info tip
If no errors occur, the result is the same as [mode = 0](#mode0).
:::

<br></br>
<div class="text--center">
  <ThemedImage
    alt=""
    sources={{
      light:
        "/img/docs/message-modes-cookbook/send_regular_message_2.png?raw=true",
      dark: "/img/docs/message-modes-cookbook/send_regular_message_2_dark.png?raw=true",
    }}
  />
</div>
<br></br>

## 3. (Mode 0, flag 16) bounce on action error {#mode16}

State before transaction: Account A has 1 TON, Account B has 1 TON

**A** sent 0.1 TON to **B**. The `msg_fwd_fees` are 0.004 TON, and the actual received value will be 0.096 TON. The `fwd_fee` and `action_fee` are deducted from `value`.
In case of an error during [action phase](https://retracer.ton.org/?tx=e9dccba82badc0d742f14eff41c203280f380e87180b5314fcfd742856e598f7&testnet=true), the message will bounce and `total_fee` + `fwd_fee` will be deducted from `value`.

State after the transaction with error: Account A has 1 - ([total_fee](/v3/documentation/smart-contracts/transaction-fees/fees#basic-fees-formula) + `fwd_fee`) TON, Account B has 1 TON

<br></br>
<div class="text--center">
  <ThemedImage
    alt=""
    sources={{
      light:
        "/img/docs/message-modes-cookbook/send_regular_message_3_error.png?raw=true",
      dark: "/img/docs/message-modes-cookbook/send_regular_message_3_error_dark.png?raw=true",
    }}
  />
</div>
<br></br>

:::info tip
If no errors occur, the result is the same as [mode = 0](#mode0).

The key difference is that `flag 16` creates bounces for [action phase errors](/v3/documentation/tvm/tvm-exit-codes#standard-exit-codes). In contrast, the message's [built‐in bounce flag](/v3/guidelines/smart-contracts/howto/wallet#internal-message-creation) handles protocol‐level failures like:

- The destination contract does not exist.
- The destination contract throws an unhandled exception.
  :::

<br></br>
<div class="text--center">
  <ThemedImage
    alt=""
    sources={{
      light:
        "/img/docs/message-modes-cookbook/send_regular_message_3_noerror.png?raw=true",
      dark: "/img/docs/message-modes-cookbook/send_regular_message_3_noerror_dark.png?raw=true",
    }}
  />
</div>
<br></br>

## 4. (Mode 0, flag 1) separate fees {#mode1}

:::info
Please note that using only this flag is unsafe, for more information refer to [this section](/v3/documentation/smart-contracts/message-management/sending-messages#mode3).
:::

State before the transaction: Account A has 1 TON, Account B has 1 TON

**A** sent 0.1 TON to **B**. The `msg_fwd_fees` are 0.004 TON, and the actual received value will be 0.1 TON. The `fwd_fee` and `action_fee` are deducted from the `balance`.

State after the transaction: Account A has 0.896 TON, Account B has 1.1 TON

<br></br>
<div class="text--center">
  <ThemedImage
    alt=""
    sources={{
      light:
        "/img/docs/message-modes-cookbook/send_regular_message_4.png?raw=true",
      dark: "/img/docs/message-modes-cookbook/send_regular_message_4_dark.png?raw=true",
    }}
  />
</div>
<br></br>

## 5. (Mode 0, flag 17) separate fees and bounce on action error {#mode17}

State before the transaction: Account A has 1 TON, Account B has 1 TON

**A** sent 0.1 TON to **B**. The `msg_fwd_fees` are 0.004 TON, and the actual received value will be 0.1 TON. The `fwd_fee` and `action_fee` are deducted from the `balance`.
In case of an error [during the action phase](https://retracer.ton.org/?tx=e9dccba82badc0d742f14eff41c203280f380e87180b5314fcfd742856e598f7&testnet=true), the message will bounce and `total_fee` + `fwd_fee` will be deducted from `value`.

State after the transaction with an error: Account A has 1 - ([total_fee](/v3/documentation/smart-contracts/transaction-fees/fees#basic-fees-formula) + `fwd_fee`) TON, Account B has 1 TON

<br></br>
<div class="text--center">
  <ThemedImage
    alt=""
    sources={{
      light:
        "/img/docs/message-modes-cookbook/send_regular_message_5_error.png?raw=true",
      dark: "/img/docs/message-modes-cookbook/send_regular_message_5_error_dark.png?raw=true",
    }}
  />
</div>
<br></br>

:::info tip
If no errors occur, the result is the same as [mode = 0, flag = 1](#mode1).
:::

<br></br>
<div class="text--center">
  <ThemedImage
    alt=""
    sources={{
      light:
        "/img/docs/message-modes-cookbook/send_regular_message_5_noerror.png?raw=true",
      dark: "/img/docs/message-modes-cookbook/send_regular_message_5_noerror_dark.png?raw=true",
    }}
  />
</div>
<br></br>

## 6. (Mode 64, flag 0) carry forward the remaining value {#mode64}

State before the transaction: Account A has 1 TON, Account B has 1 TON, Account C has 1 TON

**A** sent 0.1 TON to **B** after that **B** sent 0.5 TON to **C** with `mode` = 64, `msg_fwd_fees` are 0.004 TON, actual received `value` will be 0.6 TON, total_fee + `fwd_fee` are deducted from `value`.

State after the transaction: Account A has 0.896 TON, Account B has 0.5 TON, Account C has 1.6 - (total_fee + `fwd_fee`) TON

:::info
You might check [this example](https://testnet.tonviewer.com/transaction/f63ab35f34e342cdd249f13018d5034ce3d80c488628d5a4db0a43163fa50adb).
Please note that `storage_fee` is included in `total_fee` but is always paid from the contract `balance`.
:::

:::warning
Please note that `SENDRAWMSG` doesn't update the balance.

If you try to send multiple messages (e.g., mode 0 **and** mode 64), you'll get exit code 37.
:::

<br></br>
<div class="text--center">
  <ThemedImage
    alt=""
    sources={{
      light:
        "/img/docs/message-modes-cookbook/carry_remaining_value_6.png?raw=true",
      dark: "/img/docs/message-modes-cookbook/carry_remaining_value_6_dark.png?raw=true",
    }}
  />
</div>
<br></br>

## 7. (Mode 64, flag 1) carry forward with separate fees {#mode65}

State before the transaction: Account A has 1 TON, Account B has 1 TON, Account C has 1 TON

**A** sent 0.1 TON to **B** after that **B** sent 0.5 TON to **C** with `mode` = 65, `msg_fwd_fees` are 0.004 TON, actual received value will be 0.6 TON, total_fee + `fwd_fee` are deducted from `balance`.

State after the transaction: Account A has 0.896 TON, Account B has 0.5 - (total_fee + `fwd_fee`) TON, Account C has 1.6 TON

:::info
You might check [this example](https://testnet.tonviewer.com/transaction/ad93e784453b573d737d9d928b4377ff3779177753e05629e54f6629556568ad).
Please note that `storage_fee` is included in `total_fee` but is always paid from the contract `balance`.
:::

<br></br>
<div class="text--center">
  <ThemedImage
    alt=""
    sources={{
      light:
        "/img/docs/message-modes-cookbook/carry_remaining_value_7.png?raw=true",
      dark: "/img/docs/message-modes-cookbook/carry_remaining_value_7_dark.png?raw=true",
    }}
  />
</div>
<br></br>

## 8. (Mode 64, flag 16) bounce‐protected carry forward {#mode80}

State before the transaction: Account A has 1 TON, Account B has 1 TON, Account C has 1 TON

**A** sent 0.1 TON to **B** after that **B** sent 0.5 TON to **C** with `mode` = 80, `msg_fwd_fees` are 0.004 TON, actual received value will be 0.6 TON, total_fee + `fwd_fee` are deducted from `value`.
If an error occurs during the action phase, the message will bounce, and `total_fee` + `fwd_fee` will be deducted from the `value`.

State after the transaction with an error: Account A has 1 - (total_fee + `fwd_fee`) TON, Account B has 1 TON, Account C has 1 TON

<br></br>
<div class="text--center">
  <ThemedImage
    alt=""
    sources={{
      light:
        "/img/docs/message-modes-cookbook/carry_remaining_value_8_error.png?raw=true",
      dark: "/img/docs/message-modes-cookbook/carry_remaining_value_8_error_dark.png?raw=true",
    }}
  />
</div>
<br></br>

:::info tip
If no errors occur, the result is the same as [mode = 64, flag 0](#mode64). This mode is widely used in TON for jetton transfers. You can [check it in the C5 action list](https://retracer.ton.org/?tx=6489d60d9197c0be7ee64b0812139d82221e8f94c6e378c356acc10f9067310c) of the jetton wallet.
:::

<br></br>
<div class="text--center">
  <ThemedImage
    alt=""
    sources={{
      light:
        "/img/docs/message-modes-cookbook/carry_remaining_value_8_noerror.png?raw=true",
      dark: "/img/docs/message-modes-cookbook/carry_remaining_value_8_noerror_dark.png?raw=true",
    }}
  />
</div>
<br></br>

## 9. (Mode 64, flag 17) bounce‐protected carry forward with separate fees {#mode81}

State before the transaction: Account A has 1 TON, Account B has 1 TON, Account C has 1 TON

**A** sent 0.1 TON to **B** after that **B** sent 0.5 TON to **C** with `mode` = 81, `msg_fwd_fees` are 0.004 TON, actual received value will be 0.6 TON, total_fee + `fwd_fee` are deducted from `balance`.
If an error occurs during the action phase, the message will bounce, and `total_fee` + `fwd_fee` will be deducted from the `value`.

State after the transaction with an error: Account A has 1 - (total_fee + `fwd_fee`) TON, Account B has 1 TON, Account C has 1 TON

<br></br>
<div class="text--center">
  <ThemedImage
    alt=""
    sources={{
      light:
        "/img/docs/message-modes-cookbook/carry_remaining_value_9_error.png?raw=true",
      dark: "/img/docs/message-modes-cookbook/carry_remaining_value_9_error_dark.png?raw=true",
    }}
  />
</div>
<br></br>

:::info tip
If no errors occur, the result is the same as [mode = 65](#mode65).
:::

<br></br>
<div class="text--center">
  <ThemedImage
    alt=""
    sources={{
      light:
        "/img/docs/message-modes-cookbook/carry_remaining_value_9_noerror.png?raw=true",
      dark: "/img/docs/message-modes-cookbook/carry_remaining_value_9_noerror_dark.png?raw=true",
    }}
  />
</div>
<br></br>

## 10. (Mode 128, flag 0) send whole balance {#mode128}

State before the transaction: Account A has 1 TON, Account B has 1 TON, Account C has 1 TON

**A** sent 0.1 TON to **B** after that **B** sent 0.5 TON to **C** with `mode` = 128, `msg_fwd_fees` are 0.004 TON, the actual received value will be 1.1 - total_fee TON, total_fee is deducted from `value`.

State after the transaction: Account A has 0.896 TON, Account B has 0 TON, Account C has 2.1 - (total_fee + `fwd_fee`) TON

<br></br>
<div class="text--center">
  <ThemedImage
    alt=""
    sources={{
      light:
        "/img/docs/message-modes-cookbook/carry_remaining_value_10.png?raw=true",
      dark: "/img/docs/message-modes-cookbook/carry_remaining_value_10_dark.png?raw=true",
    }}
  />
</div>
<br></br>

## 11. (Mode 128, flag 16) send the whole balance bounce‐protected {#mode144}

State before the transaction: Account A has 1 TON, Account B has 1 TON, Account C has 1 TON

**A** sent 0.1 TON to **B** after that **B** sent 0.5 TON to **C** with `mode` = 144, `msg_fwd_fees` are 0.004 TON, the actual received value will be 1.1 - total_fee TON, total_fee is deducted from `value`.

State after the transaction with an error: Account A has 1 - (total_fee + `fwd_fee`) TON, Account B has 1 TON, Account C has 1 TON

<br></br>
<div class="text--center">
  <ThemedImage
    alt=""
    sources={{
      light:
        "/img/docs/message-modes-cookbook/carry_remaining_value_11_error.png?raw=true",
      dark: "/img/docs/message-modes-cookbook/carry_remaining_value_11_error_dark.png?raw=true",
    }}
  />
</div>
<br></br>

:::info tip
If no errors occur, the result is the same as [mode = 128](#mode128). This mode is widely used in TON for jetton transfers. You can [check it in the C5 action list](https://retracer.ton.org/?tx=e4f31e37eec74a8cfcecdad9246a6bbf3da20c4edb3635150cb0fa54b9def558) of the jetton wallet.
:::

<br></br>
<div class="text--center">
  <ThemedImage
    alt=""
    sources={{
      light:
        "/img/docs/message-modes-cookbook/carry_remaining_value_11_noerror.png?raw=true",
      dark: "/img/docs/message-modes-cookbook/carry_remaining_value_11_noerror_dark.png?raw=true",
    }}
  />
</div>
<br></br>

## 12. (Mode 128, flag 32) send the whole balance and destroy the contract {#mode160}

State before the transaction: Account A has 1 TON, Account B has 1 TON, Account C has 1 TON

**A** sent 0.1 TON to **B**, and after that, **B** sent 0.5 TON to **C** with `mode` = 160. The `msg_fwd_fees` are 0.004 TON. The actual received value will be 1.1 - total_fee TON, with total_fee deducted from `value`.

State after the transaction: Account A has 0.896 TON, Account B has 0 TON and `nonexist`, Account C has 2.1 - (total_fee + `fwd_fee`) TON

When the balance reaches 0 TON, destroy the contract.

<br></br>
<div class="text--center">
  <ThemedImage
    alt=""
    sources={{
      light:
        "/img/docs/message-modes-cookbook/carry_remaining_value_12.png?raw=true",
      dark: "/img/docs/message-modes-cookbook/carry_remaining_value_12_dark.png?raw=true",
    }}
  />
</div>
<br></br>

[cb]: https://github.com/ton-blockchain/ton/blob/7151ff26279fef6dcfa1f47fc0c5b63677ae2458/crypto/block/block.tlb#L263C1-L265C20
[msg]: /v3/documentation/data-formats/tlb/msg-tlb#commonmsginfo
[storage_fee]: /v3/documentation/smart-contracts/transaction-fees/fees-low-level#storage-fee
[account_storage]: https://github.com/ton-blockchain/ton/blob/7151ff26279fef6dcfa1f47fc0c5b63677ae2458/crypto/block/transaction.cpp#L651-L675
[in_msg_import]: https://github.com/ton-blockchain/ton/blob/7151ff26279fef6dcfa1f47fc0c5b63677ae2458/crypto/block/transaction.cpp#L783-L816

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/message-management/messages-and-transactions.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/message-management/messages-and-transactions.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import ConceptImage from "@site/src/components/conceptImage";
import ThemedImage from "@theme/ThemedImage";

# Messages and transactions

TON is an asynchronous blockchain with a complex structure that is very different from other blockchains. Because of this, new developers often have questions about low-level things in TON. In this article, we will examine one such question related to message delivery.

## What is a message?

A message is a packet of data exchanged between actors (users, applications, or smart contracts). It typically contains information instructing the receiver on what action to perform, such as updating storage or sending a new message.

<br></br>
<div class="text--center">
  <ThemedImage
    alt="Message diagram"
    sources={{
      light: "/img/docs/message-delivery/message_delivery_1.png?raw=true",
      dark: "/img/docs/message-delivery/message_delivery_1_dark.png?raw=true",
    }}
  />
</div>
<br></br>

Working with this type of communication is reminiscent of launching a satellite into space. While we know the message we've created, observation after launch is required to determine the outcome.

## What is a transaction?

A transaction in TON consists of the following:

- The incoming message that initially triggers the contract (special ways to trigger exist)
- Contract actions caused by the incoming message, such as an update to the contract's storage (optional)
- Outgoing messages generated and sent to other actors (optional)

> Technically, a contract can be triggered through special functions such as [Tick-tock](/v3/documentation/data-formats/tlb/transaction-layout#tick-tock). Still, this function is more used for internal TON Blockchain core contracts.

> Not every transaction results in outgoing messages or updates to the contract's storage - this depends on the actions defined by the contract's code.


<br></br>
<ThemedImage
  alt="Transaction diagram"
  sources={{
    light: "/img/docs/message-delivery/message_delivery_2.png?raw=true",
    dark: "/img/docs/message-delivery/message_delivery_2_dark.png?raw=true",
  }}
/>
<br></br>

If we look at Ethereum or almost any other synchronous blockchain, each transaction can contain several smart contract calls. For example, DEXs perform multiple exchanges in one transaction if there is no liquidity for the selected trading pair.

In an asynchronous system, you can't get a response from the destination smart contract in the same transaction. Depending on the length of the route between source and destination, a contract call may take a few blocks to process.

Achieving the infinite sharding paradigm requires full parallelization, ensuring that each transaction executes independently of others. Therefore, instead of transactions that affect and change the state of many contracts simultaneously, each transaction in TON is only executed on a single smart contract, and smart contracts communicate through messages. That way, smart contracts can only interact with each other by calling their functions with special messages and getting a response to them via other messages later.

:::info
See [transaction layout](/v3/documentation/data-formats/tlb/transaction-layout) for complete transaction details.
:::

### Transaction outcome

There is a [TVM exit code](/v3/documentation/tvm/tvm-exit-codes) for a transaction that had a compute phase. If it is not 0 or 1, then there was an error.
Also, TVM [compute phase may be skipped](/v3/documentation/tvm/tvm-overview#when-the-compute-phase-is-skipped) for reasons like lack of funds or state.

:::info for toncenter api v3
One should use `tx.description.action` to determine a successful `transaction.success  && tx.description.compute_ph.success`:
:::

```json
"transactions": [
    {
      "description": {
        . . . . . . . .
        "action": {
          "valid": true,
          "success": true,
         . . . . . . . .
          },
. . . . . . . .
        "destroyed": false,
        "compute_ph": {
          "mode": 0,
          "type": "vm",
          "success": true,
```

The transaction may have one of three results:

- Success, exit code 0 or 1
- Fail, `aborted: true` without execution
- Fail, [exit code](/v3/documentation/tvm/tvm-exit-codes), `aborted: true`

:::info for toncenter api v3
`aborted: true` is a TON Center field. Transaction has no such field.
:::

## What is a logical time?

In a system with asynchronous and parallel smart contract calls, it can be hard to define the order of actions to process. That's why each message in TON has its _Logical time_ or _Lamport time_ (later just _lt_). This time is used to understand which event caused another and what a validator needs to process first.

It is strictly guaranteed that the transaction resulting from a message will have a _lt_ greater than the _lt_ of the message. Likewise, the _lt_ of a message sent in some transaction is strictly greater than the _lt_ of the transaction that caused it. In addition, messages sent from one account and transactions on one account are strictly ordered.

<br></br>
<ThemedImage
  alt="Logical time sequence"
  sources={{
    light: "/img/docs/message-delivery/message_delivery_3.png?raw=true",
    dark: "/img/docs/message-delivery/message_delivery_3_dark.png?raw=true",
  }}
/>
<br></br>

For the case in the image, it turns out: `in_msg_lt < tx0_lt < out_msg_lt`

Thanks to this, we always know the order of transactions, received messages and sent messages for every account.

Moreover, if account _A_ sends two messages to account _B_, it is guaranteed that the message with a lower _lt_ will be processed earlier:

If `msg1_lt < msg2_lt` => `tx1_lt < tx2_lt`.

<br></br>
<div class="text--center">
  <ThemedImage
    alt="Message order guarantee"
    sources={{
      light: "/img/docs/message-delivery/message_delivery_5.png?raw=true",
      dark: "/img/docs/message-delivery/message_delivery_5_dark.png?raw=true",
    }}
  />
</div>
<br></br>

Otherwise, an attempt to synchronize delivery would require knowing the state of all the others before processing one shard, thereby breaking parallelization and destroying efficient sharding.

For each block, we can define the _lt_ span as starting from the first transaction and ending with the _lt_ of the last event in the block (message or transaction). Blocks are ordered like other events in TON, so if one block depends on the other, it has a higher _lt_. The child block in a shard has a higher _lt_ than its parent. A masterchain block's _lt_ is higher than the _lts_ of shard blocks that it lists since a master block depends on listed shard blocks. Each shard block contains an ordered reference to the latest (at the moment of shard block creation) master block, and thus, the shard block _lt_ is higher than the referenced master block _lt_.

## Message delivery

TON guarantees reliable delivery of all internal messages - the destination account will always receive them. The network ensures messages cannot be lost between sender and recipient during transit.
Validators control external messages' initial acceptance into blocks. However, once an external message enters the incoming message queue, it receives the same delivery guarantee as internal messages.


### Delivery order

Therefore, it seems like _lt_ solves the issue about message delivery order because we know that a transaction with a lower _lt_ will be processed first. But this doesn't work in every scenario.

Suppose there are two contracts - _A_ and _B_. _A_ receives an external message, which triggers it to send two internal messages to _B_. Let's call these messages _1_ and _2_. In this simple case, we can be 100% sure that _1_ will be processed by _B_ before _2_ because it has a lower _lt_.

<br></br>
<div class="text--center">
  <ThemedImage
    alt="Simple message order"
    sources={{
      light: "/img/docs/message-delivery/msg-delivery-1.png?raw=true",
      dark: "/img/docs/message-delivery/msg-delivery-1-dark.png?raw=true",
    }}
  />
</div>
<br></br>

But this is just a simple case when we have only two contracts. How does our system work in more complex cases?

### Several smart contracts

Consider three contracts - _A_, _B_, and _C_. When contract _A_ sends two internal messages (_1_ to _B_ and _2_ to _C_) in a single transaction, the messages are created in strict order (_1_ first, then _2_). However, their processing order at the destinations isn't guaranteed because:

1. **Network paths may differ**: The routes to _B_ and _C_ might involve different validator sets
2. **Shard chain effects**: If _B_ and _C_ are in separate shard chains, messages may traverse different numbers of blocks
3. **Asynchronous processing**: Each shard chain progresses independently, potentially causing delivery timing variations

While the sending order is preserved at the source, TON's decentralized sharded architecture means the receiving order can't be predetermined.

For better clarity, suppose our contracts send back messages `msg1'` and `msg2'` after `msg1` and `msg2` executed by `B` and `C` contracts. As a result, it will apply `tx2'` and `tx1'` to contract `A`.
We have two possible traces for these transactions,

1. The first possible order is `tx1'_lt < tx2'_lt`:

<br></br>
<div class="text--center">
  <ThemedImage
    alt="Complex message order 1"
    sources={{
      light: "/img/docs/message-delivery/message_delivery_6.png?raw=true",
      dark: "/img/docs/message-delivery/message_delivery_6_dark.png?raw=true",
    }}
  />
</div>
<br></br>

2. The second possible order is `tx2'_lt < tx1'_lt`:

<br></br>
<div class="text--center">
  <ThemedImage
    alt="Complex message order 2"
    sources={{
      light: "/img/docs/message-delivery/message_delivery_7.png?raw=true",
      dark: "/img/docs/message-delivery/message_delivery_7_dark.png?raw=true",
    }}
  />
</div>
<br></br>

The same happens in the reverse case, when two contracts, _B_ and _C_, send a message to one contract, _A_. Even if message `B -> A` was sent before `C -> A`, we can't know which one will be delivered first. The `B -> A` route may require more shard chain hops.

<br></br>
<div class="text--center">
  <ThemedImage
    alt="Reverse message flow"
    sources={{
      light: "/img/docs/message-delivery/msg-delivery-3.png?raw=true",
      dark: "/img/docs/message-delivery/msg-delivery-3_dark.png?raw=true",
    }}
  />
</div>
<br></br>

There can be many scenarios of smart contract interactions, and in any scenario with more than 2 contracts, the order of message delivery may be arbitrary. The only guarantee is that messages from contract _A_ to contract _B_ will be processed in order of their logical time. Some examples are below.

<br></br>
<div class="text--center">
  <ThemedImage
    alt="Multi-contract scenario 1"
    sources={{
      light: "/img/docs/message-delivery/msg-delivery-4.png?raw=true",
      dark: "/img/docs/message-delivery/msg-delivery-4_dark.png?raw=true",
    }}
  />
</div>
<br></br>

<br></br>
<div class="text--center">
  <ThemedImage
    alt="Multi-contract scenario 2"
    sources={{
      light: "/img/docs/message-delivery/msg-delivery-5.png?raw=true",
      dark: "/img/docs/message-delivery/msg-delivery-5_dark.png?raw=true",
    }}
  />
</div>
<br></br>

<br></br>
<div class="text--center">
  <ThemedImage
    alt="Multi-contract scenario 3"
    sources={{
      light: "/img/docs/message-delivery/msg-delivery-6.png?raw=true",
      dark: "/img/docs/message-delivery/msg-delivery-6-dark.png?raw=true",
    }}
  />
</div>
<br></br>

## Conclusion

The TON blockchain's asynchronous structure creates challenges for message delivery guarantees. Logical time helps to establish event and transaction order but doesn't guarantee message delivery order between multiple smart contracts due to varying routes in shard chains. Despite these complexities, TON ensures internal message delivery, maintaining network reliability. Developers must adapt to these nuances to harness TON's full potential in building innovative decentralized applications.

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/message-management/non-bounceable-messages.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/message-management/non-bounceable-messages.md
================================================
import Feedback from '@site/src/components/Feedback';

# Non-bounceable messages

export const Highlight = ({children, color}) => (
<span
style={{
backgroundColor: color,
borderRadius: '2px',
color: '#fff',
padding: '0.2rem',
}}>
{children}
</span>
);

Most internal messages between contracts should be bounceable (with the "bounce" bit set). This ensures:

1. If the destination contract doesn't exist or fails to process the message:

   - The message bounces back
   - Returns remaining value (minus fees)
   - Contains:
     - `0xffffffff` (32-bit)
     - Original message body (256-bit)
     - "bounce" flag cleared
     - "bounced" flag set

2. Contracts must:
   - Check the "bounced" flag on all incoming messages
   - Either:
     - Accept silently (terminate with exit code 0)
     - Identify and handle the failed request
   - Never execute the bounced message's original query

:::info
The query contained in the body of a bounced message <Highlight color="#186E8A">should never be executed</Highlight>.
:::

Non-bounceable messages are essential for account initialization. A new account cannot be created without receiving at least one non-bounceable internal message containing its `StateInit` (with contract code and initial data).

For all other cases:

- The message body should typically be empty
- Only use when bounce handling isn't needed
- Avoid them for regular contract interactions

## Best practice

It is a good idea not to allow the end user (e.g., of a wallet) to send unbounceable messages containing large amounts of value (e.g., more than five Toncoins) or to warn them if they do. To prevent loss of big funds, break process in two steps:

1.  Send a small amount first, initialize the new smart contract
2.  Next, send a more considerable amount.

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/message-management/sending-messages.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/message-management/sending-messages.md
================================================
import Feedback from '@site/src/components/Feedback';

# Sending messages

Composition, parsing, and sending messages lie at the intersection of [TL-B schemas](/v3/documentation/data-formats/tlb/tl-b-language), [transaction phases, and TVM](/v3/documentation/tvm/tvm-overview).

Indeed, FunC exposes the [send_raw_message](/v3/documentation/smart-contracts/func/docs/stdlib#send_raw_message) function which expects a serialized message as an argument.

Since TON is a comprehensive system with wide functionality, messages that need to support all of this functionality may appear quite complicated. However, most of that functionality is not used in common scenarios, and message serialization, in most cases, can be simplified to:

```func
 cell msg = begin_cell()
 .store_uint(0x18, 6)
 .store_slice(addr)
 .store_coins(amount)
 .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
 .store_slice(message_body)
 .end_cell();
```

Therefore, the developer should not worry; if something in this document seems incomprehensible on first reading, that's okay. Just grasp the general idea.

Sometimes, the word **`gram`** appears in the documentation, primarily in code examples; it is simply an outdated name for **Toncoin**.

Let's dive in!

## Types of messages

There are three types of messages:

- **External** - messages sent from outside the blockchain to a smart contract inside the blockchain. Smart contracts should explicitly accept such messages during the so-called `credit_gas`. The node should not accept the message into a block or relay it to other nodes if it is not accepted.
- **Internal** - messages sent from one blockchain entity to another. In contrast to external messages, such messages may carry some TON and pay for themselves. Thus, smart contracts that receive such messages may not accept them. In this case, gas will be deducted from the message value.
- **Logs** - messages sent from a blockchain entity to the outer world. Generally, there is no mechanism for sending such messages out of the blockchain. While all nodes in the network have a consensus on whether a message was created, there are no rules for processing them. Logs may be directly sent to `/dev/null`, logged to disk, saved in an indexed database, or even sent by non-blockchain means (email/telegram/sms); these are at the sole discretion of the given node.

## Message layout

We will start with the internal message layout.

TL-B scheme, which describes messages that smart contracts can send, is as follows:

```tlb
message$_ {X:Type} info:CommonMsgInfoRelaxed
 init:(Maybe (Either StateInit ^StateInit))
 body:(Either X ^X) = MessageRelaxed X;
```

Let's put it into words: The serialization of any message consists of three fields:

- `info`, a header that describes the source, destination, and other metadata.
- `init`, a field that is only required for initializing messages.
- `body`, the message payload.

`Maybe` and `Either` and other types of expressions mean the following:

- When we have the field `info:CommonMsgInfoRelaxed`, it means that the serialization of `CommonMsgInfoRelaxed` is injected directly into the serialization cell.
- When we have the field `body:(Either X ^X)`, it means that when we (de)serialize some type `X`, we first put one `either` bit, which is `0` if `X` is serialized to the same cell, or `1` if it is serialized to the separate cell.
- When we have the field `init:(Maybe (Either StateInit ^StateInit))`, we first put `0` or `1` depending on whether this field is empty. If it is not empty, we serialize `Either StateInit ^StateInit` (again, put one `either` bit, which is `0` if `StateInit` is serialized to the same cell or `1` if it is serialized to a separate cell).

Let's focus on one particular `CommonMsgInforRelaxed` type, the internal message definition declared with the `int_msg_info$0` constructor.

```tlb
int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
 src:MsgAddress dest:MsgAddressInt
 value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
 created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
```

It starts with the 1-bit prefix `0`.

Then, there are three 1-bit flags:

- Whether Instant Hypercube Routing is disabled (currently always true)
- Whether a message should be bounced if there are errors during its processing
- Whether the message itself is the result of a bounce.

Then, source and destination addresses are serialized, followed by the message value and four integers related to message forwarding fees and time.

If a message is sent from the smart contract, some fields will be rewritten to the correct values. In particular, the validator will rewrite `bounced`, `src`, `ihr_fee`, `fwd_fee`, `created_lt`, and `created_at`. That means two things: first, another smart contract while handling the message may trust those fields (sender may not forge source address, `bounced` flag, etc.), and second, during serialization, we may put to those fields any valid values because those values will be overwritten anyway.

Straight-forward serialization of the message would be as follows:

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

However, instead of serializing all fields step-by-step, developers usually use shortcuts. Thus, let's consider how messages can be sent from the smart contract using an example from [elector-code](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/elector-code.fc#L153).

```func
() send_message_back(addr, ans_tag, query_id, body, grams, mode) impure inline_ref {
 ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
 var msg = begin_cell()
 .store_uint(0x18, 6)
 .store_slice(addr)
 .store_coins(grams)
 .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
 .store_uint(ans_tag, 32)
 .store_uint(query_id, 64);
 if (body >= 0) {
 msg~store_uint(body, 32);
 }
 send_raw_message(msg.end_cell(), mode);
}
```

First, it combined `0b011000` into the `0x18` value. What is this?

- The first bit is a `0` - 1-bit prefix, which indicates that it is `int_msg_info`.

- Then there are 3 bits `1`, `1`, and `0`, meaning Instant Hypercube Routing is disabled, messages can be bounced, and that message is not the result of bouncing itself.
- Then, there should be a sender address; however, since it will be rewritten with the same effect, any valid address may be stored there. The shortest valid address serialization is that of `addr_none`, which serializes as a two-bit string `00`.

Thus, `.store_uint(0x18, 6)` is the optimized serialization method for the tag and the first four fields.

The following line serializes the destination address.

Then, we should serialize values. Generally, the message value is a `CurrencyCollection` object with the following scheme:

```tlb
nanograms$_ amount:(VarUInteger 16) = Grams;

extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32))
 = ExtraCurrencyCollection;

currencies$_ grams:Grams other:ExtraCurrencyCollection
 = CurrencyCollection;
```

This scheme means the message may carry the dictionary of additional _extra-currencies_ with the TON value. However, we may neglect it and assume that the message value is serialized as number of nanotons as variable integer and "`0` - empty dictionary bit".

Indeed, in the elector code above, we serialize coins amounts via `.store_coins(toncoins)` but then just put a string of zeros with a length equal to `1 + 4 + 4 + 64 + 32 + 1 + 1`. What is it?

- The first bit stands for empty extra-currencies dictionary.
- Then we have two 4-bit long fields. They encode 0 as `VarUInteger 16`. Since `ihr_fee` and `fwd_fee` will be overwritten, we may as well put them as zeroes.
- Then we put zero to the `created_lt` and `created_at` fields. Those fields will also be overwritten; however, in contrast to fees, these fields have a fixed length and are thus encoded as 64- and 32-bit long strings.
  > _We had already serialized the message header and passed to init/body at that moment_
- Next zero-bit means that there is no `init` field.
- The last zero-bit means that msg_body will be serialized in-place.
- After that, the message body (with an arbitrary layout) is encoded.

Instead of individual serialization of 14 parameters, we execute 4 serialization primitives.

## Full scheme

The entire scheme of the message layout and the layout of all constituting fields, as well as the scheme of ALL objects in TON, are presented in [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb).

## Message size

:::info cell size
Note that any [Cell](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage) may contain up to `1023` bits. If you need to store more data, you should split it into chunks and store it in reference cells.
:::

For example, if your message body is 900 bits long, you can't store it in the same cell as the message header. Including the message header fields would make the total cell size exceed 1023 bits, triggering a `cell overflow` exception during serialization.

In this case, use `1` instead of `0` for the in-place message body flag (Either), which will store the message body in a separate reference cell.

Those things should be handled carefully because some fields have variable sizes.

For instance, `MsgAddress` may be represented by four constructors:

- `addr_none`
- `addr_std`
- `addr_extern`
- `addr_var`

With length from 2 bits for `addr_none` to 586 bits for `addr_var` in the largest form.

The same stands for nanotons' amounts, which is serialized as `VarUInteger 16`.
That means 4 bits indicating the byte length of the integer and then bytes for the integer itself.

That way:

- `0` nanotons serialized as `0b0000` (4 bits indicating zero-length byte string + no bytes)
- `100000000000000000` nanotons (100,000,000 TON) serializes as:
  `0b10000000000101100011010001010111100001011101100010100000000000000000`
  (where `0b1000` specifies 8 bytes length followed by the 8-byte value)

:::info message size
Note that the message has general size limits and cell count limits, too,
e.g., the maximum message size must not exceed `max_msg_bits`, and the number of cells per message must not exceed `max_msg_cells`.

More configuration parameters and their values can be found [here](/v3/documentation/network/configs/blockchain-configs#param-43).
:::

## Message modes

:::info
For the latest information, refer to the [message modes cookbook](/v3/documentation/smart-contracts/message-management/message-modes-cookbook).
:::

As you may have noticed, we send messages using `send_raw_message`, which also accepts a mode parameter and consumes the message. This mode determines how the message is sent, including whether to pay for gas separately and how to handle errors. The TON Virtual Machine (TVM) processes messages differently depending on the mode value. It’s important to note that the mode parameter consists of two components, **mode** and **flag**, which serve different purposes:

- **Mode**: Defines the basic behavior when sending a message, such as whether to carry a balance or wait for message processing results. Different mode values represent different sending characteristics, which can be combined to meet specific requirements.
- **Flag**: Acts as an addition to the mode, configuring specific message behaviors, such as paying transfer fees separately or ignoring processing errors. The flag is added to the mode to create the final message-sending configuration.

When using the `send_raw_message` function, choosing the appropriate combination of mode and flag for your needs is crucial. Refer to the following table to determine the best mode for your use case:

| Mode  | Description                                                                                                            |
| :---- | :--------------------------------------------------------------------------------------------------------------------- |
| `0`   | Ordinary message                                                                                                       |
| `64`  | Carry all the remaining value of the inbound message in addition to the value initially indicated in the new message   |
| `128` | Carry all the remaining balance of the current smart contract instead of the value originally indicated in the message |

| Flag  | Description                                                                             |
| :---- | :-------------------------------------------------------------------------------------- |
| `+1`  | Pay transfer fees separately from the message value                                     |
| `+2`  | Ignore some errors arising while processing this message during the action phase        |
| `+16` | In the case of action failure, bounce the transaction. No effect if `+2` is used.       |
| `+32` | Destroy the current account if its resulting balance is zero (often used with Mode 128) |

:::info +16 Flag
If a contract receives a bounceable message, it processes the `storage` phase **before** the `credit` phase. Otherwise, it processes the `credit` phase **before** the `storage` phase.

For more details, check the [source code with checks for the `bounce-enable` flag](https://github.com/ton-blockchain/ton/blob/master/validator/impl/collator.cpp#L2810).
:::

:::warning

1. **+16 flag** - do not use it in external messages (e.g., to wallets) because there is no sender to receive the bounced message.

2. **+2 flag** - important in external messages (e.g. to wallets).

:::

## Recommended approach: mode=3 {#mode3}

```func
send_raw_message(msg, SEND_MODE_PAY_FEES_SEPARATELY | SEND_MODE_IGNORE_ERRORS); ;; stdlib.fc L833
```

The `mode=3` combines the `0` mode and two flags:

- `+1` : Pay transfer fees separately from the message value
- `+2` : Suppresses specific errors during message processing

This combination is the standard method for sending messages in TON.

---

### Behavior without +2 flag

If the `IGNORE_ERRORS` flag is omitted and a message fails to process (e.g., due to insufficient balance), the transaction reverts. For wallet contracts, this prevents updates to critical data like the `seqno`.

```func
throw_unless(33, msg_seqno == stored_seqno);
throw_unless(34, subwallet_id == stored_subwallet);
throw_unless(35, check_signature(slice_hash(in_msg), signature, public_key));
accept_message();
set_data(begin_cell()
 .store_uint(stored_seqno + 1, 32)
 .store_uint(stored_subwallet, 32)
 .store_uint(public_key, 256)
 .store_dict(plugins)
 .end_cell());
commit(); ;; This will be reverted on action error.
```

As a result, unprocessed external messages can be replayed until they expire or drain the contract's balance.

---

### Error handling with +2 flag

The `IGNORE ERRORS` flag (`+2`) suppresses these specific errors during the Action Phase:

#### Suppressed errors

1. **Insufficient funds**

   - Message transfer value exhaustion
   - Insufficient balance for message processing
   - Inadequate attached value for forwarding fees
   - Missing extra currency for message transfer
   - Insufficient funds for external message delivery

2. **[Oversized message](#message-size)**

3. **Excessive Merkle depth**

   Message exceeds allowed Merkle tree complexity.

#### Non-suppressed errors

1. Malformed message structure
2. Conflicting mode flags (`+64` and `+128` used together)
3. Invalid libraries in `StateInit` of the outbound message
4. Non-ordinary external messages (e.g., using `+16` or `+32` flags)

---

### Security considerations

#### Current mitigations

- Most wallet apps auto-include `IGNORE_ERRORS` in transactions
- Wallet UIs often display transaction simulation results
- V5 wallets enforce `IGNORE_ERRORS` usage
- Validators limit message replays per block

#### Potential risks

- **Race conditions** causing stale backend balance checks
- **Legacy wallets** (V3/V4) without enforced checks
- **Incomplete validations** by wallet applications

---

### Example: jetton transfer pitfall

Consider this simplified Jetton wallet code:

```func
() send_jettons(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure inline_ref {
int jetton_amount = in_msg_body~load_coins();
balance -= jetton_amount;
send_raw_message(msg, SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_BOUNCE_ON_ACTION_FAIL);
save_data(status, balance, owner_address, jetton_master_address); }
```

If a transfer using `mode=3` fails due to a suppressed error:

1. Transfer action is not executed
2. Contract state updates persist (no rollback)
3. **Result:** permanent loss of `jetton_amount` from the balance

**Best practice**

Always pair `IGNORE_ERRORS` with robust client-side validations and real-time balance checks to prevent unintended state changes.

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/overview.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'

# Introduction

Smart contract creation, development, and deployment on TON Blockchain leverages the [TON Virtual Machine (TVM)](/v3/documentation/smart-contracts/overview#ton-virtual-machine-tvm) and one of the following programming languages:

* [Tact](/v3/documentation/smart-contracts/overview#-tact)
* [FunC](/v3/documentation/smart-contracts/overview#-func)

## Quick start: your first smart contract

Write and deploy your first smart contract with the *Blueprint* framework.

Blueprint is a development environment for writing, testing, and deploying smart contracts.
To create a new demo project, use the following command:

```bash
npm create ton@latest
```


<Button href="/v3/documentation/smart-contracts/getting-started/javascript" colorType="primary" sizeType={'sm'}>

Read more

</Button>


<Button href="https://stepik.org/course/176754/" colorType={'secondary'} sizeType={'sm'}>

TON Blockchain course

</Button>



## Getting started

### Fun and easy tutorials

Kickstart your journey with our beginner-friendly guides:
* [TON Hello World: Step-by-step guide for writing your first smart contract](https://helloworld.tonstudio.io/02-contract/)
* TON tutorials
  - [🚩 Challenge 1: Simple NFT Deploy](https://github.com/romanovichim/TONQuest1)
  - [🚩 Challenge 2: Chatbot Contract](https://github.com/romanovichim/TONQuest2)
  - [🚩 Challenge 3: Jetton Vending Machine](https://github.com/romanovichim/TONQuest3)
  - [🚩 Challenge 4: Lottery/Raffle](https://github.com/romanovichim/TONQuest4)
  - [🚩 Challenge 5: Create UI to interact with the contract in 5 minutes](https://github.com/romanovichim/TONQuest5)
  - [🚩 Challenge 6: Analyzing NFT sales on the Getgems marketplace](https://github.com/romanovichim/TONQuest6)
* [TON development playlist](https://www.youtube.com/playlist?list=PLQ5rEj25H3U2P5qp7nsgVtNGYxEojnnez) [[RU version]](https://www.youtube.com/playlist?list=PLOIvUFGfwP93tZI_WnaLyJsZlskU4ao92)

### TON course

:::tip
Before starting the course, make sure you have a solid understanding of the basics of blockchain technology. If you have gaps in your knowledge, we recommend taking the [**Blockchain Basics with TON**](https://stepik.org/course/201294/promo) ([RU version](https://stepik.org/course/202221/), [CHN version](https://stepik.org/course/200976/)) course.
:::

We are proud to present the __TON Blockchain Course__, a comprehensive guide to the TON Blockchain. The course is designed for developers who want to learn how to create smart contracts and decentralized applications on the TON Blockchain.

It consists of __nine modules__ and covers the basics of the TON Blockchain, the smart contract development lifecycle, the FunC programming language, and the TON Virtual Machine (TVM).

<Button href="https://stepik.org/course/176754/promo"
        colorType={'primary'} sizeType={'sm'}>

Check TON course

</Button>


<Button href="https://stepik.org/course/201638/promo"
        colorType={'secondary'} sizeType={'sm'}>

CHN

</Button>


<Button href="https://stepik.org/course/201855/promo"
        colorType={'secondary'} sizeType={'sm'}>

RU

</Button>


### Comprehensive guides

For those who prefer detail and nuance, visit:

* [How to work with wallet smart contracts](/v3/guidelines/smart-contracts/howto/wallet)



## Examples of smart contracts

Explore ready-made smart contract examples and tools provided by the TON community.

:::info little tip
Feel free to focus on smart contracts written in FunC. It is often better to focus on smart contracts written in FunC (.fc) instead of the lower-level Fift (.fif) language.
:::

Standard examples of smart contracts on TON include wallets, electors (which manage validation on TON), and multi-signature wallets, which can serve as references when studying.


<Button href="/v3/documentation/smart-contracts/contracts-specs/examples" colorType={'primary'} sizeType={'sm'}>

Open examples

</Button>



## Smart contract best practices

TON offers endless possibilities. Learn how to make the most of them while adhering to recommended guidelines.

* [Smart contract guidelines](/v3/guidelines/smart-contracts/guidelines)

## TON Virtual Machine (TVM)

Discover the engine that runs your smart contracts.

- [TVM overview](/v3/documentation/tvm/tvm-overview)



## Programming languages

### 📘 FunC

The tailor-made language for TON smart contracts.


<Button href="/v3/documentation/smart-contracts/func/overview" colorType={'primary'} sizeType={'sm'}>

FunC overview

</Button>


### 📒 Tact

Tact is a fresh programming language for TON Blockchain, focused on efficiency and ease of development. It is a good fit for complex smart contracts, quick onboarding and rapid prototyping.

Developed by [TON Studio](https://tonstudio.io), powered by the community — by the end of 2024, the number of _unique code_[^1] contracts deployed on the Mainnet reached almost 28 thousand, of which about 33% were written in Tact.

View some of the selected projects: [Tact in production](https://github.com/tact-lang/awesome-tact#tact-in-production-).

[^1]: The "unique code" means that each contract in the data sample has at least one TVM instruction that differs from the other contracts, excluding many preprocessed wallets with everything inlined — even seqno and a public key for signature verification!

<Button href="/v3/documentation/smart-contracts/tact"
        colorType={'primary'} sizeType={'sm'}>

Read more

</Button>

<Button href="https://tact-lang.org/"
        colorType={'secondary'} sizeType={'sm'}>

Official website

</Button>

<Button href="https://docs.tact-lang.org/"
        colorType={'secondary'} sizeType={'sm'}>

Tact docs

</Button>

<Button href="https://github.com/tact-lang/awesome-tact"
        colorType="secondary" sizeType={'sm'}>

Awesome Tact

</Button>

### 📗 Tolk

A new language for writing smart contracts in TON. Think of Tolk as the "**next‑generation FunC**"

:::caution
Under active development.
:::

<Button href="/v3/documentation/smart-contracts/tolk/overview" colorType={'primary'} sizeType={'sm'}>

Tolk overview

</Button>

### 📕 Fift (advanced)

:::caution advanced level
Only for the brave!
:::


<Button href="/v3/documentation/smart-contracts/fift/overview" colorType={'primary'} sizeType={'sm'}>

Fift overview

</Button>


## Community tools

* [MyLocalTON](/v3/guidelines/nodes/running-nodes/running-a-local-ton) — MyLocalTON is used to run a private TON Blockchain in your local environment.
* [tonwhales.com/tools/boc](https://tonwhales.com/tools/boc) — BOC parser
* [tonwhales.com/tools/introspection-id](https://tonwhales.com/tools/introspection-id) — crc32 generator
* [@orbs-network/ton-access](https://www.orbs.com/ton-access/) — decentralized API gateway


## Further reading

Enhance your skillset with these community-driven educational resources.

* [Smart Contracts Guidelines](/v3/guidelines/smart-contracts/guidelines)
* [TON FunC Learning Path](https://blog.ton.org/func-journey) ([RU version](https://github.com/romanovichim/TonFunClessons_ru))
* [YouTube Tutorials](https://www.youtube.com/@TONDevStudy) [[RU version]](https://www.youtube.com/@WikiMar)
* [TON development playlist](https://www.youtube.com/playlist?list=PLQ5rEj25H3U2P5qp7nsgVtNGYxEojnnez) [[RU version]](https://www.youtube.com/playlist?list=PLOIvUFGfwP93tZI_WnaLyJsZlskU4ao92)


## Additional resources

* [What is blockchain? What is a smart contract? What is gas?](https://blog.ton.org/what-is-blockchain)
* [Understanding Transaction Fees](/v3/guidelines/smart-contracts/fee-calculation)


<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/shards/infinity-sharding-paradigm.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/shards/infinity-sharding-paradigm.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# Infinity Sharding Paradigm


## Understanding split merge in TON Blockchain
The TON (The Open Network) blockchain introduces innovative mechanisms for scalability and efficiency. One of the key features is **split-merge**, a fundamental component of its architecture. This article outlines the core principles of split-merge within the Infinite Sharding Paradigm (ISP) framework.

#### ISP and its application
At the heart of TON's design is the ISP, which treats each account as its own **AccountChain**—a unique chain of transactions associated with a single account. These AccountChains are grouped into ShardChain blocks to improve processing efficiency. The state of a ShardChain is derived from the combined states of all the AccountChains it contains. As a result, a ShardChain block can be viewed as a collection of virtual blocks corresponding to individual accounts.

- **ShardState**: approximated as `Hashmap(n, AccountState)`, where `n` is the bit length of the `account_id`.
- **ShardBlock**: approximated as `Hashmap(n, AccountBlock)`.

Each ShardChain block is uniquely identified by a combination consisting of the `workchain_id` and a binary prefix `s` of the `account_id`.

## Algorithm for deciding whether to split or merge
The decision to split or merge shards proceeds as follows:
1. Each block is evaluated using key metrics, such as block size, gas consumption, and logical time (LT) delta.
2. These metrics are used to determine whether the block is **overloaded** or **underloaded**.
3. Each shard maintains a history of overload and underload events. Based on recent trends, it sets `want_split` or `want_merge` flags.
4. Validators make split or merge decisions using these flags by configuration parameters.

### 1. Evaluating the current block state
Each block includes three core parameters that are used to assess load:
1. **Block size estimate:** an estimated value computed during block collation (not the actual block size).
2. **Gas consumption:** total gas consumed by all transactions in the block, excluding ticktock, mint, and recover transactions.
3. **LT delta:** the difference between the block's starting and ending logical times.

### 2. Block limits and classification

Limits for these metrics are defined in [configuration parameters 22 and 23](/v3/documentation/network/configs/blockchain-configs#param-22-and-23).
Each parameter has three thresholds: **underload**, **soft**, and **hard**:

#### Threshold table

| **Parameter**     | **Underload / Soft / Hard (BaseChain)** | **Underload / Soft / Hard (MasterChain)** |
|------------------|------------------------------------------|-------------------------------------------|
| Block size        | 128 / 256 / 512 KiB                     | N/A                                       |
| Gas consumption   | 2M / 10M / 20M                          | 200K / 1M / 2.5M                           |
| LT delta          | 1000 / 5000 / 10000                     | Same as BaseChain                         |

A **medium limit** is also defined as `(soft + hard) / 2`.

Each parameter is classified as follows:
- `0` - underload limit is not reached.
- `1` - underload limit is exceeded.
- `2` - soft limit is exceeded.
- `3` - medium limit is exceeded.
- `4` - hard limit is exceeded.

The block classification is the maximum of the three individual classifications (`Classification of size`, `Classification of gas`, `Classification of lt delta`).

Example: size = 2, gas = 3, lt = 1 → block classification = 3.

Based on classification:
- 0 (Underload): merge candidate.
- 2 (Soft): internal messages are no longer processed; candidate for split.
- 3 (Medium): external messages are skipped.

### 3. Overload and underload determination

Additional heuristics are applied beyond classification based on the message queue status:

* A block is **overloaded** if:
  * Classification ≥ `2` (soft) and message queue size ≤ `SPLIT_MAX_QUEUE_SIZE = 100000`
  * Dispatch queue limit is reached, and message queue size ≤ `SPLIT_MAX_QUEUE_SIZE = 100000`
  * Message queue size is  ≥ `FORCE_SPLIT_QUEUE_SIZE = 4096`, and ≤ `SPLIT_MAX_QUEUE_SIZE = 100000`
* A block is **underloaded** if:
  * Classification = `0` (underload) and message queue size ≤ `MERGE_MAX_QUEUE_SIZE = 2047`


### 4. Deciding whether to split or merge

Each block maintains a history of underload and overload conditions — represented as a 64-bit mask tracking the status of the last 64 blocks. This mask is used to determine whether a shard should split or merge.

The underload and overload histories are evaluated using a weighted formula:

`one_bits(mask & 0xffff) * 3 + one_bits(mask & 0xffff0000) * 2 + one_bits(mask & 0xffff00000000) - (3 + 2 + 1) * 16 * 2 / 3`

Here, `one_bits` counts the number of `1`-bits in the mask. Lower-order bits correspond to the most recent blocks.

The respective `want_merge` or `want_split` flag is set if the computed weight is non-negative.

### 5. Final decision

Validators decide to split or merge shards using `want_split` and `want_merge` flags and [workchain configuration parameters](/v3/documentation/network/configs/blockchain-configs#param-12).

Validators determine whether to split or merge shards based on the `want_split` and `want_merge` flags, along with [WorkChain configuration parameters](/v3/documentation/network/configs/blockchain-configs#param-12):

- If a shard's depth is less than `min_split`, it will split.
- If a shard's depth exceeds `max_split`, it will merge.
- Shards at `min_split` depth cannot merge; shards at `max_split` depth cannot split.
- If the block has the `want_split` flag, the shard will split.
- The shards will merge if both the block and its sibling have the `want_merge` flag.

Shards perform the split or merge after a delay of `split_merge_delay = 100` seconds from the decision.


## Messages and instant hypercube routing (IHR)

In the infinite sharding paradigm, each account or smart contract is treated as if it were a part of its own ShardChain.
Interactions between accounts occur exclusively through message passing, following the **actor model**, where accounts act as actors.
An efficient messaging system between ShardChains is essential for the operation of the TON blockchain. A key feature supporting this is **Instant Hypercube Routing**, which enables near-instantaneous message delivery and processing across ShardChains. Messages created in one ShardChain block are processed in the next block of the target ShardChain — regardless of how many messages are in the system.

### Current Status of IHR

:::info Important Clarification
**Instant Hypercube Routing (IHR) is an alternative mechanism for message delivery without intermediate hops.** However, it is important to understand that:

- **IHR is not implemented** and is not yet fully specified
- **IHR is only relevant** when there are more than 16 shards and not all shards are neighbors to each other
- **Current network settings forbid splitting deeper than 16 shards**, so IHR is not relevant in any practical sense today

Currently, TON uses standard **Hypercube Routing (HR)** for message delivery between shards, which routes messages through intermediate shards when necessary. IHR would provide a more direct routing mechanism, but only becomes necessary in much larger shard configurations than are currently possible.
:::

### Message Routing Mechanisms

TON blockchain supports two conceptual message routing mechanisms:

1. **Hypercube Routing (HR)** - Currently implemented mechanism that routes messages between shards through intermediate hops when necessary
2. **Instant Hypercube Routing (IHR)** - Alternative mechanism (not implemented) that would allow direct message delivery without intermediate hops

The choice between these mechanisms would depend on the network topology and shard configuration, but given current limitations on shard depth, only HR is relevant.

## Sharding example

![](/img/docs/blockchain-fundamentals/shardchains.png)

In the diagram above:
- The shards of a WorkChain are shown over time and separated by dashed lines.
- Blocks 222, 223, and 224 correspond to MasterChain block `seqno = 102`. Block 222 belongs to one shard, while blocks 223 and 224 belong to another.
- If a split or merge event occurs, the affected shards pause operations until the next MasterChain block is produced.

In summary, **split-merge** in the TON blockchain is a sophisticated yet efficient mechanism that enhances scalability and inter-shard communication. It exemplifies TON's approach to solving core blockchain challenges by prioritizing efficiency and global consistency.


## Sharding details

#### Split and non-split parts of shardchain

A ShardChain block and its corresponding state are divided into two components:
1. **Split part:** conforms to the ISP (Independent State Part) form and contains account-specific data.
2. **Non-split part:** contains data related to interactions with other blocks and external systems.


#### Interaction with other blocks

The non-split parts are vital in maintaining global consistency across the network. They address both internal and external local consistency conditions and are responsible for:

- Forwarding messages between ShardChains
- Facilitating cross-shard transactions
- Guaranteeing delivery and verifying a block's initial state against its predecessor

#### Inbound and outbound messages

Key components of the non-split part include:
- **InMsgDescr**: describes all messages imported into the block. These messages are either:
  - processed by a block or transit transaction, i.e., temporarily forwarded as per `Hypercube Routing`.
- **OutMsgDescr**: describes all messages exported or generated by the block. These may be:
  - newly generated messages from a transaction in the block or
  - transit messages are forwarded to a destination outside the current ShardChain forwarded from `InMsgDescr`.

#### Block header and validator signatures

The block header, part of the non-split section, includes metadata such as:
- `workchain_id`
- Binary prefix of `account_ids`
- Block sequence number. The smallest non-negative integer greater than its predecessors' sequence numbers.
- Logical time and UNIX time of generation
- Hashes of:
  - The block's predecessor(s) (two, in the case of a merge)
  - The block's initial and final states
  - The latest known MasterChain block at the time of block generation

After the block is created, validator signatures are appended to produce a signed block.


#### Outbound message queue

The `OutMsgQueue` is another crucial non-split component of the ShardChain state. It holds undelivered outbound messages, as recorded in `OutMsgDescr`, from either the latest block or one of its predecessors.
Each outgoing message is initially placed in `OutMsgQueue`, which remains until it is successfully delivered to its target.

#### Shard split and merge mechanics

Shard configurations can change over time due to split or merge events in dynamic sharding. These changes are coordinated via the MasterChain.
When a split or merge is triggered, the affected shards pause and wait for the next MasterChain block before resuming activity.

## See also

* [Block layout](/v3/documentation/data-formats/tlb/block-layout)
* [Whitepapers](/v3/documentation/whitepapers/overview)

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/shards/shards-intro.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/shards/shards-intro.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# Shards

Sharding is a well-established concept that originated in  [database design](https://en.wikipedia.org/wiki/Shard_(database_architecture)). It refers to splitting a single logical dataset into multiple independent databases that don’t share resources and can run across different servers.
In simple terms, sharding enables horizontal scalability—breaking down data into smaller, manageable parts that can be processed in parallel. This technique has been crucial in the evolution from traditional data systems to [big data](https://en.wikipedia.org/wiki/Big_data).
As datasets grow beyond the capacity of conventional systems, sharding becomes the only practical way to scale effectively.

**Sharding in TON Blockchain**

TON uses sharding to handle a high volume of transactions efficiently.
The TON blockchain architecture includes one MasterChain and up to 2<sup>32</sup> WorkChains. Each WorkChain functions as an independent blockchain with its own rules. Furthermore, each WorkChain can be divided into up to 2<sup>60</sup> ShardChains or sub-shards, each responsible for a portion of the WorkChain’s state.

Currently, TON operates with only one WorkChain, known as the BaseChain.

The core principle behind sharding in TON is parallelism:
For example, if account A sends a message to account B and account C sends a message to account D, both transactions can be processed asynchronously and independently.


In the BaseChain (`workchain = 0`), the default configuration includes a single shard with the identifier `0x8000000000000000` which is `1000000000000000000000000000000000000000000000000000000000000000` in binary.
The MasterChain (`workchain = -1`) always operates with exactly one shard.

## MasterChain

The MasterChain is the main blockchain in the TON network. It stores the network configuration and the final states of all WorkChains. The MasterChain can be considered the core directory or the single source of truth for all shards and chains in the ecosystem.
It contains essential protocol-level information, including:
- The current network configuration;
- The list of active validators and their stakes;
- All active WorkChains and their corresponding ShardChains;
- The most recent block hashes of every WorkChain and ShardChain.

This data is key to maintaining consensus and ensuring all network parts are synchronized and operating securely.

## WorkChain

The MasterChain is divided into individual blockchains called WorkChains. Each WorkChain is customized for specific transaction types or use cases and operates in parallel within the TON network.

## Uniqueness

Two key architectural decisions set the TON blockchain apart from other sharded blockchains.

First, TON implements dynamic segmentation of the blockchain based on the network load. When the number of transactions reaches a critical threshold, the blockchain splits into two ShardChains. If the load on a shard continues to increase, it splits again—and this process continues recursively as needed. Conversely, when the transaction volume decreases, shards can merge back together. This adaptive sharding model enables the network to create as many shards as necessary at any given time.

Second, TON employs a non-fixed shard count. Unlike platforms such as Ethereum 2.0, which supports a fixed number of shards, e.g., 64, TON allows the number of shards to scale dynamically based on demand, with a theoretical upper limit of 2<sup>60</sup> shards per WorkChain. This virtually limitless capacity means the system could assign over 100 million shards to every person on Earth and still have resources remaining. This approach enables truly dynamic scalability — a necessity given the unpredictable nature of global network demand.


![](/img/docs/blockchain-fundamentals/scheme.png)

## Splitting

In the TON blockchain, the sequence of transactions associated with a single account, e.g., `Tx1 -> Tx2 -> Tx3 -> ...`, is called an **AccountChain**. This highlights that it is a linear transaction history specific to one account. Multiple **AccountChains** are grouped within a single shard, forming a **ShardChain**, hereinafter simply as a “shard”. A shard is responsible for storing and processing all transactions within its scope, with each transaction chain corresponding to a particular group of accounts.


These account groups are determined by a shared binary prefix, which clusters accounts into the same shard. This binary prefix is embedded in the shard ID, which is represented as a 64-bit integer with the following structure: `<binary prefix>100000...`. For example, a shard with the ID `1011100000...` contains all accounts that begin with the binary prefix `1011`.

When the number of transactions within a shard grows beyond a certain threshold, the shard splits into two new shards. These new shards are assigned IDs based on the parent shard’s prefix: `<parent prefix>01000...` and `<parent prefix>11000...`. They then become responsible for accounts starting with `<parent prefix>0` and `<parent prefix>1`, respectively. Block sequence numbers (seqnos) in the new shards continue from the parent shard’s last seqno plus one. After the split, the new shards operate independently and may progress at different rates, leading to divergent seqnos.

**Simple example**

![](/img/docs/blockchain-fundamentals/shardchains-split.png)

MasterChain block contains information about the state of all shards in its header. Once a shard block is included in the header, it is considered final and cannot be reverted.


**Real example**

* MasterChain block `seqno=34607821` includes two shards:
  * `(0,4000000000000000,40485798)`
  * and `(0,c000000000000000,40485843)`

  [View source](https://toncenter.com/api/v2/shards?seqno=34607821)

* The shard `4000000000000000` splits into two:
`shard=2000000000000000` and `shard=6000000000000000`
In the following MasterChain block `seqno=34607822`, three shards are listed:
  * `(0,c000000000000000,40485844)`,
  * `(0,2000000000000000,40485799)`,
  * and `(0,6000000000000000,40485799)`


  [View source](https://toncenter.com/api/v2/shards?seqno=34607822)

  Note: The two new shards start with the same seqno but have different shard IDs.

* After 100 more MasterChain blocks (at `seqno=34607921`), the shard states have diverged:
  * `(0,2000000000000000,40485901)`
  * `(0,6000000000000000,40485897)`

  [View source](https://toncenter.com/api/v2/shards?seqno=34607921)


## Merging

When the shard load decreases, they can merge into a single shard.
* Two shards are eligible to merge if they share a common parent. In this case, their shard IDs will follow the format `<parent prefix>010...` and `<parent prefix>110...`. The resulting merged shard will have the ID `<parent prefix>10...`.
* For example, `10010...` + `10110...` merge into `1010...`.
* The first block of the merged shard will have `seqno = max(seqno1, seqno2) + 1`.

**Simple example**

![](/img/docs/blockchain-fundamentals/shardchains-merge.png)

**Actual example**

* In Masterchain block `seqno=34626306`, two of the five shards with the latest blocks:
   `(0,a000000000000000,40492030)` and `(0,e000000000000000,40492216)`
    merged into a single shard with the block: `(0,c000000000000000,40492217)`

  [View before merge](https://toncenter.com/api/v2/shards?seqno=34626306)

  [View after merge](https://toncenter.com/api/v2/shards?seqno=34626307)

## See also

* [Infinity sharding paradigm](/v3/documentation/smart-contracts/shards/infinity-sharding-paradigm)
* [Whitepapers](/v3/documentation/whitepapers/overview)

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/tact.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/tact.mdx
================================================
---
title: Tact language
---

import Feedback from "@site/src/components/Feedback";
import Button from "@site/src/components/button";

# Tact language

Tact is a fresh programming language for TON Blockchain, focused on efficiency and ease of development. It is a good fit for complex smart contracts, quick onboarding and rapid prototyping.

Developed by [TON Studio](https://tonstudio.io), powered by the community — at the start of 2025, the number of _unique code_[^1] contracts deployed on the mainnet reached almost 28 thousand, of which about 33% were written in Tact. You can view some selected projects here: [Tact in production](#tact-in-production).

[^1]: The "unique code" means that each contract in the data sample has at least one TVM instruction that differs from the other contracts, excluding many preprocessed wallets with everything inlined — even seqno and a public key for signature verification!

Tact has undergone a comprehensive security audit by [Trail of Bits](https://www.trailofbits.com), a leading Web3 security firm.

<Button href="https://ide.ton.org/"
        colorType={'primary'} sizeType={'sm'}>

Try it online!

</Button>

<Button href="https://docs.tact-lang.org/"
        colorType={'secondary'} sizeType={'sm'}>

Tact documentation

</Button>

<Button href="https://github.com/tact-lang/awesome-tact"
        colorType="secondary" sizeType={'sm'}>

Awesome Tact

</Button>

## Features

The most prominent and distinctive features of Tact are:

- Familiar and user-friendly TypeScript-like syntax.
- Strong static type system with built-in [Structs], [Messages], and [maps], among others.
- First-class [maps] support, with many methods and a convenient [`foreach` statement][foreach] for traversing.
- Automatic (de)serialization of incoming messages and data structures.
- Automatic routing of [internal, external, and bounced messages][recvfun].
- Automatic handling of message types, including [binary, text, and fallback slices][recv].
- No boilerplate functions for [sending messages] and deploying child contracts.
- Reusable behaviors through [traits].
- Support for low-level programming with [`asm` functions][asmfun].
- Generation of [single-file TypeScript wrappers] for convenient interactions with compiled contracts, which include:
  - Type definitions for [Structs] and [Messages] observable in the [compilation report].
  - Corresponding `storeStructureName()` and `loadStructureName()` functions for (de)serialization.
  - All global and contract-level constants.
  - Bi-directional records of exit codes: from their names to numbers and vice versa.
  - Opcodes of all [Messages].
  - A contract wrapper class with various helper functions for initialization, deployment, and message exchange.
- Rich [standard library][stdlib].
- Extensive [documentation].
- Robust [tooling](#tooling).
- ...and there's much more to come!

[Structs]: https://docs.tact-lang.org/book/structs-and-messages#structs
[Messages]: https://docs.tact-lang.org/book/structs-and-messages#messages
[maps]: https://docs.tact-lang.org/book/maps
[foreach]: https://docs.tact-lang.org/book/statements#foreach-loop
[recv]: https://docs.tact-lang.org/book/receive/
[recvfun]: https://docs.tact-lang.org/book/contracts/#receiver-functions
[sending messages]: https://docs.tact-lang.org/book/send/#message-sending-functions
[traits]: https://docs.tact-lang.org/book/types/#traits
[asmfun]: https://docs.tact-lang.org/book/assembly-functions/
[single-file TypeScript wrappers]: https://docs.tact-lang.org/book/compile/#wrap
[compilation report]: https://docs.tact-lang.org/book/compile/#report
[stdlib]: https://docs.tact-lang.org/ref/
[documentation]: https://docs.tact-lang.org/

## Security

- [Security audit of Tact by the Trail of Bits (2025, PDF)](https://github.com/trailofbits/publications/blob/master/reviews/2025-01-ton-studio-tact-compiler-securityreview.pdf)
  - Backup link: [PDF Report](https://github.com/tact-lang/website/blob/416073ed4056034639de257cb1e2815227f497cb/pdfs/2025-01-ton-studio-tact-compiler-securityreview.pdf)

## Tact in production

Some selected software and applications based on contracts written in Tact, deployed in production, and consumed by end users:

###### Open source or source available

- [Proof-of-capital](https://github.com/proof-of-capital/TON) - [proof-of-capital](https://proofofcapital.org/) is a market-making smart contract that protects interests of all holders.
  - See the [security audit report](https://raw.githubusercontent.com/nowarp/public-reports/master/2025-01-proof-of-capital.pdf) by [Nowarp](https://nowarp.io).

###### Closed source

- [Tradoor](https://tradoor.io) - Fast and social DEX on TON.
  - See the [security audit report](https://www.tonbit.xyz/reports/Tradoor-Smart-Contract-Audit-Report-Summary.pdf) by TonBit.
- [PixelSwap](https://www.pixelswap.io) - First modular and upgradeable DEX on TON.
  - See the [security audit report](https://github.com/trailofbits/publications/blob/master/reviews/2024-12-pixelswap-dex-securityreview.pdf) by Trail of Bits.
- [GasPump](https://gaspump.tg) - TON memecoin launchpad and trading platform.

See [Tact in production](https://github.com/tact-lang/awesome-tact#tact-in-production-) on the Awesome Tact list.

## Installation

### Compiler

The Tact compiler is distributed as an [NPM package](https://www.npmjs.com/package/@tact-lang/compiler) bundled with the [Tact standard library](https://docs.tact-lang.org/ref/).

The recommended Node.js version is 22 or higher, while the minimum version is 18.

Use your favorite package manager to install it into a Node.js project:

```bash
# yarn is recommended, but not required
yarn add @tact-lang/compiler

# you can also use npm
npm i @tact-lang/compiler@latest

# or pnpm
pnpm add @tact-lang/compiler

# or bun
bun add @tact-lang/compiler
```

Alternatively, you can install it globally as such:

```bash
npm i -g @tact-lang/compiler
```

It will make the `tact` compiler available on your PATH, as well as:

- a convenient `unboc` disassembler of a contract's code compiled into a [bag of cells](/v3/documentation/data-formats/tlb/cell-boc#bag-of-cells) `.boc` format.
- a formatter `tact-fmt`, which can format or check the formatting of individual Tact files and directories.

### Tooling

###### Extensions and plugins

- [VS Code extension](https://marketplace.visualstudio.com/items?itemName=tonstudio.vscode-tact) - powerful and feature-rich extension for Visual Studio Code (VSCode) and VSCode-based editors like VSCodium, Cursor, Windsurf, and others.
  - Get it on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=tonstudio.vscode-tact).
  - Get it on the [Open VSX Registry](https://open-vsx.org/extension/tonstudio/vscode-tact).
  - Or install from the [`.vsix` files in nightly releases](https://github.com/tact-lang/tact-language-server/releases).
- [JetBrains IDEs plugin](https://plugins.jetbrains.com/plugin/27290-tact#) - provides syntax highlighting, code navigation, and more.
- [Language Server (LSP Server)](https://github.com/tact-lang/tact-language-server) - supports Sublime Text, (Neo)Vim, Helix, and other editors with LSP support.
- [tact.vim](https://github.com/tact-lang/tact.vim) - Vim 8+ plugin.
- [tact-sublime](https://github.com/tact-lang/tact-sublime) - Sublime Text 4 package.
  - Get it on the [Package Control](https://packagecontrol.io/packages/Tact).

###### Security

- [Misti](https://github.com/nowarp/misti) - Static smart contract analyzer.
- [TON Symbolic Analyzer (TSA)](https://github.com/espritoxyz/tsa) - Static smart contract analysis tool based on symbolic execution.

###### Utility

- Formatter (`tact-fmt`) — The official formatter. It ships with the Tact Language Server, VS Code extension, and as a standalone binary with the compiler. You can invoke it by running `npx tact-fmt` in your Tact projects.
- BoC Disassembler (`unboc`) — Disassembler for [`.boc`](/v3/documentation/data-formats/tlb/cell-boc#bag-of-cells) files. Ships as a standalone binary with the compiler. You can invoke it by running `npx unboc` in your Tact projects.

### Getting started

For a quick start, read the ["Let's start!"](https://docs.tact-lang.org/#start) mini-guide in the Tact documentation. It uses the [Blueprint](https://github.com/ton-community/blueprint) development environment for writing, testing, and deploying smart contracts on TON Blockchain.

If you want more manual control, use [tact-template](https://github.com/tact-lang/tact-template). It's a ready-to-use template with the development environment set up, including the Tact compiler with TypeScript + Jest, a local TON emulator, AI-based editor support, and examples of how to run tests.

```shell
git clone --depth 1 https://github.com/tact-lang/tact-template
```

## Community

If you can’t find the answer in the [docs](https://docs.tact-lang.org), or you’ve tried to do some local testing and it still didn’t help — don’t hesitate to reach out to Tact’s flourishing community:

- [`@tactlang` on Telegram](https://t.me/tactlang) - Main community chat and discussion group.
- [`@tactlang_ru` on Telegram](https://t.me/tactlang_ru) _(Russian)_
- [`@tact_kitchen` on Telegram](https://t.me/tact_kitchen) - Channel with updates from the team.
- [`@tact_language` on X/Twitter](https://x.com/tact_language)
- [`tact-lang` organization on GitHub](https://github.com/tact-lang)
- [`@ton_studio` on Telegram](https://t.me/ton_studio)
- [`@thetonstudio` on X/Twitter](https://x.com/thetonstudio)

## Contributing

Contributions are welcome! To help develop the compiler, see the [contributing guide](https://github.com/tact-lang/tact/blob/main/dev-docs/CONTRIBUTING.md).

<Feedback />



================================================
FILE: docs/v3/documentation/smart-contracts/tolk/changelog.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/tolk/changelog.md
================================================
import Feedback from '@site/src/components/Feedback';

# History of Tolk

Once new versions of Tolk are released, they are mentioned here.


## v0.99

1. Universal `createMessage`
2. Universal `createExternalLogMessage`
3. Sharding — calculate addresses "close to another contract"


## v0.13

1. Auto-packing to/from cells/builders/slices
2. Type `address`
3. Lateinit variables
4. Defaults for parameters


## v0.12

1. Structures `struct A { ... }`
2. Generics `struct<T>` and `type<T>`
3. Methods `fun Point.getX(self)`
4. Rename stdlib functions to short methods


## v0.11

1. Type aliases `type NewName = <existing type>`
2. Union types `T1 | T2 | ...`
3. Pattern matching for types
4. Operators `is` and `!is`
5. Pattern matching for expressions
6. Semicolon for the last statement in a block can be omitted


## v0.10

1. Fixed-width integers: `int32`, `uint64`, etc. [Details](https://github.com/ton-blockchain/ton/pull/1559)
2. Type `coins` and function `ton("0.05")`
3. `bytesN` and `bitsN` types (backed by slices at TVM level)
4. Replace `"..."c` postfixes with `stringCrc32("...")` functions
5. Support `0b...` number literals along with `0x...`
6. Trailing comma support


## v0.9

1. Nullable types `int?`, `cell?`, etc.; null safety
2. Standard library (asm definitions) updated to reflect nullability
3. Smart casts, like in TypeScript in Kotlin
4. Operator `!` (non-null assertion)
5. Code after `throw` is treated as unreachable
6. The `never` type


## v0.8

1. Syntax `tensorVar.0` and `tupleVar.0` (both for reading and writing)
2. Allow `cell`, `slice`, etc. to be valid identifiers (not keywords)


## v0.7

1. Under the hood: refactor compiler internals; AST-level semantic analysis kernel
2. Under the hood: rewrite the type system from Hindley-Milner to static typing
3. Clear and readable error messages on type mismatch
4. Generic functions `fun f<T>(...)` and instantiations like `f<int>(...)`
5. The `bool` type; type casting via `value as T`


## v0.6

The first public release. Here are some notes about its origin: 


## How Tolk was born

In June 2024, I created a pull request [FunC v0.5.0](https://github.com/ton-blockchain/ton/pull/1026).
Besides this PR, I've written a roadmap for what can be enhanced in FunC, syntactically and semantically.

Instead of merging v0.5.0 and continuing to develop FunC, we decided to **fork** it.
To leave FunC untouched as it is. As it always was. And to develop a new language driven by a fresh and new name.

For several months, I have worked on Tolk privately. I have implemented a giant list of changes.
And it's not only about the syntax. For instance, Tolk has an internal AST representation that is completely missed in FunC.

On TON Gateway, from 1 to 2 November in Dubai, I gave a speech presenting Tolk to the public, and we released it the same day.
The video is available [on YouTube](https://www.youtube.com/watch?v=Frq-HUYGdbI).

Here is the very first pull request: ["Tolk Language: next-generation FunC"](https://github.com/ton-blockchain/ton/pull/1345).

The first version of the Tolk Language is v0.6, a metaphor of FunC v0.5 that missed a chance to occur.


## Meaning of the name "Tolk"

**Tolk** is a wonderful word. 

In English, it's consonant with *talk*. Because, generally, what do we need a language for? We need it *to talk* to computers. 

In all Slavic languages, the root *tolk* and the phrase *"to have tolk"* means "to make sense"; "to have deep internals".

But actually, **TOLK** is an abbreviation.  
You know, that TON is **The Open Network**.  
By analogy, TOLK is **The Open Language K**.   

What is K, will you ask? Probably, "kot" — the nick of Nikolay Durov? Or Kolya? Kitten? Kernel? Kit? Knowledge?  
The right answer — none of this. This letter does not mean anything. It's open.  
*The Open Letter K*

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/tolk/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/tolk/overview.mdx
================================================
---
title: Overview
---

import Feedback from "@site/src/components/Feedback";
import Button from "@site/src/components/button";

# Tolk language: overview

**Tolk** is a new language for writing smart contracts in TON.
Tolk compiler is a fork of FunC compiler, introducing familiar syntax similar to TypeScript
but leaving all low-level optimizations untouched. Think of Tolk as the next‑generation FunC.

```tolk
import "utils.tolk"

struct Storage {
    counter: int32;
}

fun Storage.load() {
    return Storage.fromCell(contract.getData());
}

fun onInternalMessage(msgValue: int, msgFull: cell, msgBody: slice) {
    var cs = msgFull.beginParse();
    var flags = cs.loadMessageFlags();
    if (isMessageBounced(flags)) {
        return;
    }
    ...
}

get currentCounter(): int32 {
    val st = Storage.load();
    return st.counter;
}
```

<details>
  <summary><b>See same logic implemented with FunC</b></summary>

```func
#include "utils.fc";

global int ctx_counter;

int load_data() impure {
  slice cs = get_data().begin_parse();
  ctx_counter = cs~load_uint(32);
}

() recv_internal(int msg_value, cell msg_full, slice msg_body) impure {
  slice cs = msg_full.begin_parse();
  int flags = cs.load_uint(4);
  if (flags & 1) {
    return ();
  }
  ...
}

int currentCounter() method_id {
  load_data(); ;; fills global variables
  return ctx_counter;
}
```

</details>

<Button
  href="https://github.com/ton-blockchain/convert-func-to-tolk"
  colorType={"primary"}
  sizeType={"sm"}
>
  Try a FunC → Tolk converter
</Button>
<Button
  href="/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-short"
  colorType={"secondary"}
  sizeType={"sm"}
>
  Tolk vs FunC differences
</Button>
<div style={{ height: "2em" }}></div>

## Motivation behind Tolk

FunC is awesome.
It is low-level and encourages a programmer to think about compiler internals.
It gives complete control over TVM assembler, allowing a programmer to make his contract as effective as possible.
If you get used to it, you love it.

But there is a problem.
FunC is **functional C**, and it's for ninja.
If you are keen on Lisp and Haskell, you'll be happy.
But if you are a JavaScript / Go / Kotlin developer, its syntax is peculiar for you, leading to occasional mistakes.
A struggle with syntax may decrease your motivation for digging into TON.

Imagine what if there was a language that was smart and low-level but not functional and not like C?
Leaving all beauty and complexity inside, what if it would be more similar to popular languages at first glance?

That's what Tolk is about.

## Migrating from FunC to Tolk

If you know FunC and want to try a new syntax, your way is:

1. Read [Tolk vs FunC: in short](/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-short).
2. With a blueprint, create a new Tolk contract (for example, a counter) and experiment around it. Remember that almost all stdlib functions are renamed to ~~verbose~~ clear names. Here is [a mapping](/v3/documentation/smart-contracts/tolk/tolk-vs-func/stdlib).
3. Try a [converter](https://github.com/ton-blockchain/convert-func-to-tolk) for your existing contracts or one from [FunC contracts](/v3/documentation/smart-contracts/contracts-specs/examples). Remember that contracts written in Tolk from scratch look nicer than auto-converted ones. For instance, using logical operators instead of bitwise tremendously increases code readability.

## How to try Tolk if you don't know FunC

:::tip Currently, this documentation assumes that you know FunC
This section describes the **Tolk vs FunC** differences.
Later, it will be adapted to land newcomers. Moreover, FunC will eventually become deprecated for onboarding,
and all code snippets throughout the documentation will be rewritten for Tolk.
:::

If you are new to TON, your way is:

1. Dig into [this documentation](/v3/documentation/smart-contracts/overview) to acquire basic on development in TON. No matter your language, you must be aware of cells, slices, and TON asynchronous nature.
2. Facing FunC snippets, you can still use FunC or try to express the same in Tolk. If FunC syntax is peculiar to you, don't worry: the goal of Tolk is to fix this issue precisely.
3. Once you understand what's happening, try using Tolk with [blueprint](https://github.com/ton-org/blueprint).

## Tooling around Tolk language

Sources of the Tolk compiler are a part of the `ton-blockchain` [repo](https://github.com/ton-blockchain/ton).
Besides the compiler, we have:

1. [tolk-js](https://github.com/ton-blockchain/tolk-js) — a WASM wrapper for Tolk compiler.
2. [JetBrains IDE plugin](https://github.com/ton-blockchain/intellij-ton) supports Tolk besides FunC, Fift, TL/B, and Tact.
3. [VS Code Extension](https://github.com/ton-blockchain/tolk-vscode) enabling Tolk Language support.
4. [Converter from FunC to Tolk](https://github.com/ton-blockchain/convert-func-to-tolk) — convert a `.fc` file to a `.tolk` file with a single `npx` command.
5. Tolk Language is available in [blueprint](https://github.com/ton-org/blueprint).

## Is Tolk production-ready?

The Tolk compiler, a fork of the FunC compiler, is deemed production-ready, albeit somewhat experimental at the moment.

Undiscovered bugs may exist, potentially inherited from FunC or attributable to TVM characteristics.
Anyway, no matter your language, you should cover your contracts with tests to reach high reliability.

## Roadmap

The first released version of Tolk is v0.6, emphasizing [missing](/v3/documentation/smart-contracts/tolk/changelog#how-tolk-was-born) FunC v0.5.

Here are some points to investigate:

- type system improvements
- gas and stack optimizations, AST inlining
- extending and maintaining stdlib
- some ABI (how explorers "see" bytecode)
- gas and fee management in general

The following strategic milestone for **Tolk v1.0** is structures with auto-serialization into cells (almost done).

This milestone eliminates manual manipulations with builders and slices, allowing data and messages to be described declaratively.
Closely related to this is the **ABI (interface) of contracts**.
Well-designed structures make up the majority of an ABI.

## Issues and contacts

If you face an issue, connect to developer society on [TON Dev Chats](https://t.me/addlist/1r5Vcb8eljk5Yzcy) or create GitHub issues.

## See also

- [Tolk vs FunC: in short](/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-short)

<Feedback />



================================================
FILE: docs/v3/documentation/smart-contracts/tolk/tolk-vs-func/create-message.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/tolk/tolk-vs-func/create-message.md
================================================
import Feedback from '@site/src/components/Feedback';

# Universal createMessage

In FunC, you had to compose message cells manually and regularly face code like:
```func
cell m = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(sender_address)
    .store_coins(50000000)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_uint(0x178d4519, 32)
    .store_uint(query_id, 64)
    ...
    .end_cell();
send_raw_message(m, 0);
```

In Tolk, you use a high-level function — and it's even more gas-effective:
```tolk
val reply = createMessage({
    bounce: true,
    value: ton("0.05"),
    dest: senderAddress,
    body: RequestedInfo { ... }
});
reply.send(SEND_MODE_REGULAR);
```


## Key features of createMessage

1. Supports extra currencies
2. Supports `stateInit` (code+data) with automatic address computation
3. Supports different WorkChains
4. Supports sharding (formerly splitDepth)
5. Integrated with auto-serialization of `body`
6. Automatically detects **body ref or not**
7. More efficient than handwritten code
         

## The concept is based on union types

There is a huge variety of interacting between contracts. When you explore FunC implementations, you notice that:
* sometimes, you "send to an address (slice)"
* ... but sometimes, you "build the address (builder) manually"
* sometimes, you compose `StateInit` from code+data
* ... but sometimes, you already have `StateInit` as a ready cell
* sometimes, you send a message to basechain
* ... but sometimes, you have the `MY_WORKCHAIN` constant and use it everywhere
* sometimes, you just attach tons (**msg value**)
* ... but sometimes, you also need extra currencies
* etc.

**How can we describe such a vast variety of options? The solution is union types!**

Let's start exploring this idea by looking at how extra currencies are supported.


## Extra currencies: union

When you don't need them, you just attach **msg value** as tons:
```tolk
value: someTonAmount
```

When you need them, you attach tons AND extra currencies dict:
```tolk
value: (someTonAmount, extraDict)
```

How does it work? Because the field `value` is a union:
```tolk
// how it is declared in stdlib
type ExtraCurrenciesDict = dict;

struct CreateMessageOptions<TBody> {
    ...
    /// message value: attached tons (or tons + extra currencies)
    value: coins | (coins, ExtraCurrenciesDict)
```

That's it! You just attach tons OR tons with extra, and the compiler takes care of composing this into a cell.


## Destination: union

The same idea of union types spreads onto **destination** of a message.
```tolk
dest: someAddress,
dest: (workchain, hash)
```

It's either an address, OR a OR (WorkChain + hash), OR ...:
```tolk
struct CreateMessageOptions<TBody> {
    ...
    /// destination is either a provided address, or is auto-calculated by stateInit
    dest: address |             // either just send a message to some address
          builder |             // ... or a manually constructed builder with a valid address
          (int8, uint256) |     // ... or to workchain + hash (also known as accountID)
          AutoDeployAddress;    // ... or "send to stateInit" aka deploy (address auto-calculated)
```

**That's indeed the TypeScript way** — but it works at compile-time!


## StateInit and WorkChains

Let's start from an example. From a jetton minter, you are deploying a jetton wallet.
You know wallet's code and initial data:
```tolk
val walletInitialState: ContractState = {
    code: ...,   // probably, kept in minter's storage
    data: ...,   // zero balance, etc. (initial wallet's storage)
};
```

Now, from a minter, you want to send a message to a wallet. But since you are not sure whether the wallet already exists onchain, you attach its code+data: 
if a wallet doesn't exist, it's immediately initialized with that code. 
So, where should you send a message to? What is **destination**? The answer is: **destination is the wallet's StateInit**. 
You need to send a message to a `walletInitialState` because, in TON, the address of a contract is — by definition — a hash of its initial state:

```tolk
// address auto-calculated, code+data auto-attached
dest: {
    stateInit: walletInitialState
}
```

In more complex tasks, you can configure additional fields:
```tolk
dest: {
    workchain: ...,     // by default, 0 (basechain)
    stateInit: ...,     // either code+data OR a ready cell
    toShard:   ...,     // by default, null (no sharding) 
}
```

That's the essence of `AutoDeployAddress`. Here is how it's declared in stdlib:
```tolk
// declared in stdlib
struct AutoDeployAddress {
    workchain: int8 = BASECHAIN;
    stateInit: ContractState | cell;
    toShard: AddressShardingOptions? = null;
}
```


## Sharding: deploying "close to" another contract

The `createMessage` interface also supports initializing contracts in specific shards. Say you're writing sharded jettons, and you want every jetton wallet to be in the same shard as the owner's wallet.


In other words, your intention is:
* a jetton wallet must be **close to** the owner's wallet
* this *closeness* is determined by a shard depth (syn. _fixed prefix length_, syn. _split depth_)

Let's illustrate it with numbers for `shard depth` = 8:

| Title                | Addr hash (256 bits) | Comment                              |
|----------------------|----------------------|--------------------------------------|
| closeTo (owner addr) | `01010101...xxx`     | owner's wallet                       |
| shardPrefix          | `01010101`           | first 8 bits of closeTo              |
| stateInitHash        | `yyyyyyyy...yyy`     | calculated by code+data              |
| result (JW addr)     | `01010101...yyy`     | jetton wallet in same shard as owner |

That's how you do it:
```tolk
dest: {
    stateInit: walletInitialState,
    toShard: {
        closeTo: ownerAddress,
        fixedPrefixLength: 8
    }
}
```

Technically, **shard depth** must be a part of `StateInit` (besides code+data) — for correct initialization inside the blockchain.
The compiler automatically embeds it.

But semantically, **shard depth** alone makes no sense. That's why **shard depth + closeTo** is a single entity:
```tolk
// how it is declared in stdlib
struct AutoDeployAddress {
    ...
    toShard: AddressShardingOptions? = null;
}

struct AddressShardingOptions {
    fixedPrefixLength: uint5;    // shard depth, formerly splitDepth
    closeTo: address;
}
```


## Body ref or not: compile-time calculation

In TON Blockchain, according to the specification, a message is a cell (flags, dest address, stateInit, etc.), 
and its *body* can be either inlined into the same cell or can be placed into its own cell (and be a ref).

In FunC, you had to manually calculate whether it's safe to embed body (you did it *on paper* or dynamically).  
In Tolk, you just pass `body`, and the compiler does all calculations for you:
```tolk
createMessage({
    ...
    body: RequestedInfo { ... }    // no `toCell`! just pass an object
});
```

The rules are the following:
1) if `body` is small, it's embedded directly into a message cell
2) if `body` is large or unpredictable, it's wrapped into a ref

Why not make a ref always? Because creating cells is expensive. Avoiding cells for small bodies is crucial for gas consumption.

Interestingly, whether the body is **small** is determined **AT COMPILE TIME — no runtime checks are needed**.
How? Thanks to generics! Here’s how `createMessage` is declared:

```tolk
fun createMessage<TBody>(options: CreateMessageOptions<TBody>): OutMessage;

struct CreateMessageOptions<TBody> {
    ...
    body: TBody;
}
```

Hence, when you pass `body: RequestedInfo {...}`, then `TBody = RequestedInfo`, and the compiler estimates its size:
* it's **small** if its maximum size is less than 500 bits and 2 refs — then **no ref**
* it's **large** if >= 500 bits or >= 2 refs — then "ref"
* it's **unpredictable** if contains `builder` or `slice` inside — then **ref**

**Even if body is large/unpredictable, you can force it to be inlined** by wrapping into a special type:
```tolk
// potentialy 620 bits (if all coins are billions of billions)
// by default, compiler will make a ref
struct ProbablyLarge { 
    a: (coins, coins, coins, coins, coins) 
}  

val contents: ProbablyLarge = { ... };  // but you are sure: coins are small
createMessage({                         // so, you take the risks
    body: UnsafeBodyNoRef {             // and force "no ref"
        bodyForceNoRef: contents,
    }

// here TBody = UnsafeBodyNoRef<ProbablyLarge>
```

If `body` is already a cell, it will be left as a ref, without any surprise:
```tolk
createMessage({
    body: someCell,       // ok, just a cell, keep it as a ref

// here TBody = cell 
```

That's why, don't pass `body: someObj.toCell()`, pass just `body: someObj`, let the compiler take care of everything.


## Body is not restricted to structures

In practice, you use `createMessage` to send a message (sic!) to another contract — in the exact format as the receiver expects. 
You declare a struct with 32-bit opcode and some data in it.
```tolk
struct (0xd53276db) Excesses {
    queryId: uint64;
}

val excessesMsg = createMessage({
   ...
   body: Excesses {
       queryId: input.queryId,
   }
});
excessesMsg.send(SEND_MODE_IGNORE_ERRORS);
```

This works perfectly, as expected. But an interesting fact—this also works:

```tolk
// just an example, that even this would work
val excessesMsg = createMessage({
   ...
   body: (0xd53276db as int32, input.queryId)
});
excessesMsg.send(SEND_MODE_IGNORE_ERRORS);
```

Even this is okay, it is inferred as `createMessage<(int32, uint64)>(...)` and encoded correctly.

The example above just illustrates the power of the type system, no more.


## Body can be empty

If you don't need any `body` at all, just leave it out:
```tolk
createMessage({
    bounce: true,
    dest: somewhere,
    value: remainingBalance
});
```

A curious reader might ask, "what's the type of `body` here? How is it expressed in the type system?" The answer is: `never`.


Actually, `CreateMessageOptions` is declared like this:
```tolk
// declared in stdlib
struct CreateMessageOptions<TBody = never> {
    ...
    body: TBody;
}
```

Hence, when we miss `body` in `createMessage`, it leads to the default `TBody = never`. 
And by convention, fields having `never` type are not required in a literal. 
It's not that obvious, but it is definitely beautiful.


## Don't confuse StateInit and code+data, they are different

It's incorrect to say that **StateInit is code+data**, because in TON, a full **StateInit** cell contents is richer (consider block.tlb):
- it also contains fixed_prefix_length (formerly split_depth),
- it also contains ticktock info
- it also contains a library cell
- code and data are actually optional

For instance, when sending a message to another shard, fixed_prefix_length is automatically set by the compiler (from `toShard.fixedPrefixLength`).

That's why a structure **code+data** is named `ContractState`, NOT `StateInit`:
```tolk
// in stdlib
struct ContractState {
    code: cell;
    data: cell;
}
```

And that's why a field `stateInit: ContractState | cell` is named **stateInit**, 
emphasizing that `StateInit` can be initialized automatically from `ContractState` (or can be a well-formed **rich** cell).


## Why not send, but createMessage?

You might ask: "why do we follow the pattern `val msg = createMessage(...); msg.send(mode)` instead of just `send(... + mode)` ?"

Typically, yes — you send a message immediately after composing it.
But there are also advanced use cases:

* not just send, but send and estimate fees,
* or estimate fees without sending,
* or get a message hash,
* or save a message cell to storage for later sending,
* or even push it to an action phase.

So, composing a message cell and THEN doing some action with it is a more flexible pattern.

Moreover, following this pattern requires you to give **a name** to a variable. 
Advice is not to name it "m" or "msg," but to give a descriptive name like "excessesMsg" or "transferMsg":
```tolk
val excessesMsg = createMessage({
    ...
});
excessesMsg.send(mode);
// also possible
excessesMsg.sendAndEstimateFee(mode);
```

This strategy makes the code **easier to read** later. You see — okay, this is about excesses, this one is about burn notification, etc. 
As opposed to a potential `send(...)` function, you have to dig into what body is actually being sent to understand what’s going on.



## Why not provide a separate deploy function?

You might also ask: why do we join `stateInit` as a **destination** for other use cases? Why not make a `deploy()` function that accepts code+data and drops stateInit from a **regular** createMessage?

The answer lies in terminology. Yes, **attaching stateInit** is often referred to as **deployment**, but it's an inaccurate term. **TON Blockchain doesn't have a dedicated deployment mechanism.** You send a message to some *void*  — and if this *void* doesn't exist, but you've attached a way to initialize it (code+data) — it's initialized immediately and accepts your message.


If you wish to emphasize the deployment, give it *a name*:
```tolk
val deployMsg = createMessage({
    ...
});
deployMsg.send(mode);
```
 

## Universal createExternalLogMessage

The philosophy is similar to `createMessage`. But **external outs** don't have **bounce**; you don't attach tons, etc. So, options for creating are different.

**Currently, external messages are used only for emitting logs (for viewing them in indexers).** 
But theoretically, they can be extended to **send messages to the offchain**.

Example:
```tolk
val emitMsg = createExternalLogMessage({
    dest: createAddressNone(),
    body: DepositEvent { ... }
});
emitMsg.send(SEND_MODE_REGULAR);
```

**Available options for external-out messages** are only `dest` and `body`, actually:
```tolk
struct CreateExternalLogMessageOptions<TBody = never> {
    /// destination is either an external address or a pattern to calculate it
    dest: address |         // either some valid external/none address (not internal!)
          builder |         // ... or a manually constructed builder with a valid external address
          ExtOutLogBucket;  // ... or encode topic/eventID in destination
    
    /// body is any serializable object (or just miss this field for empty body)
    body: TBody;
}
```

So, as for `createMessage` — just pass `someObject`, do NOT call `toCell()`, let the compiler decide whether it fits into the same cell or not. 
`UnsafeBodyNoRef` is also applicable.

**Emitting external logs, example 1**:
```tolk
struct DepositData {
    amount: coins;
    ...
}

val emitMsg = createExternalLogMessage({
    dest: ExtOutLogBucket { topic: 123 },   // 123 for indexers
    body: DepositData { ... }
});
emitMsg.send(SEND_MODE_REGULAR);
```

**Emitting external logs, example 2**:
```tolk
struct (0x12345678) DepositEvent {
    amount: coins;
    ...
}

createExternalLogMessage({
    dest: createAddressNone(),
    body: DepositEvent { ... }   // 0x12345678 for indexers
});    
```

`ExtOutLogBucket` is a variant of a custom external address for emitting logs **to the outer world.** 
It includes some **topic** (arbitrary number), that determines the format of the message body. 
In the example above, you emit **deposit event** (reserving topic `deposit` = 123) — 
and external indexers will index your emitted logs by destination address without parsing body.



<Feedback />



================================================
FILE: docs/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-detail.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-detail.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# Tolk vs FunC: in detail

A huge list is below. Will anyone have enough patience to read it up to the end?..

:::tip There is a compact version
Here: [Tolk vs FunC: in short](/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-short)
:::


### Traditional comments


<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{';; comment'}</code></td>
    <td><code>{'// comment'}</code></td>
  </tr>
  <tr>
    <td><code>{'{- multiline comment -}'}</code></td>
    <td><code>{'/* multiline comment */'}</code></td>
  </tr>
  </tbody>
</table>



### 2+2 is 4, not an identifier. Identifiers can only be alpha-numeric


In FunC, almost any character can be a part of the identifier.
For example, `2+2` (without a space) is an identifier.
You can even declare a variable with such a name.

In Tolk, spaces are not mandatory. `2+2` is 4, as expected. `3+~x` is `3 + (~ x)`, and so on.

<table className="cmp-func-tolk-table different-col-widths">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'return 2+2;  ;; undefined function `2+2`'}</code></td>
    <td><code>{'return 2+2;  // 4'}</code></td>
  </tr>
  </tbody>
</table>

More precisely, an identifier can start from <code style={{display: 'inline-block'}}>{'[a-zA-Z$_]'}</code>
and be continued with <code style={{display: 'inline-block'}}>{'[a-zA-Z0-9$_]'}</code>. Note that `?`, `:`, and others are not valid symbols, and `found?` and `op::increase` are invalid identifiers.

Note, that `cell`, `slice`, etc. are valid identifiers: `var cell = ...` or even `var cell: cell = ...` is okay. (like in TypeScript, `number` is a valid identifier)

You can use backticks to surround an identifier, and then it can contain any symbols (similar to Kotlin and some other languages). This potential usage is to allow keywords to be used as identifiers in case of code generation by a scheme, for example.

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'const op::increase = 0x1234;'}</code></td>
    <td><code>{'const OP_INCREASE = 0x1234;'}</code></td>
  </tr>
  <tr>
    <td><code dangerouslySetInnerHTML={{__html: ';; even 2%&!2 is valid<br>int 2+2 = 5;'}}></code></td>
    <td><code dangerouslySetInnerHTML={{__html: '// don\'t do like this :)<br>var \`2+2\` = 5;'}}></code></td>
  </tr>
  </tbody>
</table>


### Impure by default, compiler won't drop user function calls


FunC has an `impure` function specifier. When absent, a function is treated as pure. If its result is unused, its call is deleted by the compiler.

Though this behavior is documented, it is very unexpected to newcomers.
For instance, various functions that don't return anything (throw an exception on mismatch, for example)
are silently deleted. This situation is spoilt by FunC not checking and validating the function body,
allowing impure operations inside pure functions.

In Tolk, all functions are impure by default. You can mark a function pure with annotation,
and then impure operations are forbidden in its body (exceptions, globals modification, calling non-pure functions, etc.).



### New functions syntax: fun keyword, @ attributes, types on the right (like in TypeScript, Kotlin, Python, etc.)


<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'cell parse_data(slice cs) { }'}</code></td>
    <td><code>{'fun parse_data(cs: slice): cell { }'}</code></td>
  </tr>
  <tr>
    <td><code>{'(cell, int) load_storage() { }'}</code></td>
    <td><code>{'fun load_storage(): (cell, int) { }'}</code></td>
  </tr>
  <tr>
    <td><code>{'() main() { ... }'}</code></td>
    <td><code>{'fun main() { ... }'}</code></td>
  </tr>
  </tbody>
</table>

Types of variables — also to the right:

<table className="cmp-func-tolk-table different-col-widths">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'slice cs = ...;'}</code></td>
    <td><code>{'var cs: slice = ...;'}</code></td>
  </tr>
  <tr>
    <td><code>{'(cell c, int n) = parse_data(cs);'}</code></td>
    <td><code>{'var (c: cell, n: int) = parse_data(cs);'}</code></td>
  </tr>
  <tr>
    <td><code>{'global int stake_at;'}</code></td>
    <td><code>{'global stake_at: int;'}</code></td>
  </tr>
  </tbody>
</table>

Modifiers `inline` and others — with annotations:

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code dangerouslySetInnerHTML={{__html: '<br>int f(cell s) inline {'}}></code></td>
    <td><code dangerouslySetInnerHTML={{__html: '@inline<br>fun f(s: cell): int {'}}></code></td>
  </tr>
  <tr>
    <td><code dangerouslySetInnerHTML={{__html: '<br>() load_data() impure inline_ref {'}}></code></td>
    <td><code dangerouslySetInnerHTML={{__html: '@inline_ref<br>fun load_data() {'}}></code></td>
  </tr>
  <tr>
    <td><code>{'global int stake_at;'}</code></td>
    <td><code>{'global stake_at: int;'}</code></td>
  </tr>
  </tbody>
</table>

`forall` — this way:

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'forall X -> tuple cons(X head, tuple tail)'}</code></td>
    <td><code dangerouslySetInnerHTML={{__html: 'fun cons&lt;X&gt;(head: X, tail: tuple): tuple'}}></code></td>
  </tr>
  </tbody>
</table>

`asm` implementation — like in FunC, but being properly aligned, it looks nicer:
```tolk
@pure
fun third<X>(t: tuple): X
    asm "THIRD";

@pure
fun iDictDeleteGet(dict: cell, keyLen: int, index: int): (cell, slice, int)
    asm(index dict keyLen) "DICTIDELGET NULLSWAPIFNOT";

@pure
fun mulDivFloor(x: int, y: int, z: int): int
    builtin;
```

There is also a `@deprecated` attribute, not affecting compilation, but for a human and IDE.


### get instead of method_id


In FunC, `method_id` (without arguments) declared a get method. In Tolk, you use a straightforward syntax:

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'int seqno() method_id { ... }'}</code></td>
    <td><code>{'get seqno(): int { ... }'}</code></td>
  </tr>
  </tbody>
</table>

Both `get methodName()` and `get fun methodName()` are acceptable.

For `method_id(xxx)` (uncommon in practice, but valid), there is an attribute:

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code dangerouslySetInnerHTML={{__html: '<br>() after_code_upgrade(cont old_code) impure method_id(1666)'}}></code></td>
    <td><code dangerouslySetInnerHTML={{__html: '@method_id(1666)<br>fun afterCodeUpgrade(oldCode: continuation)'}}></code></td>
  </tr>
  </tbody>
</table>


### It's essential to declare types of parameters (though optional for locals)


```tolk
// not allowed
fun do_smth(c, n)
// types are mandatory
fun do_smth(c: cell, n: int)
```

If parameter types are mandatory, the return type is not (it's often obvious or verbose). If omitted, it's auto-inferred:
```tolk
fun x() { ... }  // auto infer from return statements
```

For local variables, types are also optional:
```tolk
var i = 10;                      // ok, int
var b = beginCell();             // ok, builder
var (i, b) = (10, beginCell());  // ok, two variables, int and builder

// types can be specified manually, of course:
var b: builder = beginCell();
var (i: int, b: builder) = (10, beginCell());
```

Defaults for parameters are supported:
```tolk
fun increment(x: int, by: int = 1) {
    return x + by
}
```


### Variables are not allowed to be redeclared in the same scope


```tolk
var a = 10;
...
var a = 20;  // error, correct is just `a = 20`
if (1) {
    var a = 30;  // it's okay, it's another scope
}
```

As a consequence, partial reassignment is not allowed:
```tolk
var a = 10;
...
var (a, b) = (20, 30);  // error, releclaration of a
```

Note, that it's not a problem for `loadUint()` and other methods. In FunC, they returned a modified object, so a pattern `var (cs, int value) = cs.load_int(32)` was quite common. In Tolk, such methods mutate an object: `var value = cs.loadInt(32)`, so redeclaration is unlikely to be needed.

```tolk
fun send(msg: cell) {
    var msg = ...;  // error, redeclaration of msg

    // solution 1: intruduce a new variable
    var msgWrapped = ...;
    // solution 2: use `redef`, though not recommended
    var msg redef = ...;
```


### String postfixes removed, compile-time functions introduced


Tolk removes the old FunC-style string postfixes (`"..."c`, etc.) in favor of a **more transparent and more flexible approach**.

<table className="cmp-func-tolk-table">
    <thead>
    <tr>
        <th>FunC</th>
        <th>Tolk</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td><code>{'"..."c'}</code></td>
        <td><code>{'stringCrc32("...")'}</code></td>
    </tr>
    <tr>
        <td>—</td>
        <td><code>{'stringCrc16("...")'}</code></td>
    </tr>
    <tr>
        <td><code>{'"..."H'}</code></td>
        <td><code>{'stringSha256("...")'}</code></td>
    </tr>
    <tr>
        <td><code>{'"..."h'}</code></td>
        <td><code>{'stringSha256_32("...")'}</code></td>
    </tr>
    <tr>
        <td><code>{'"..."a'}</code></td>
        <td><code>{'address("...")'}</code></td>
    </tr>
    <tr>
        <td><code>{'"..."s'}</code></td>
        <td><code>{'stringHexToSlice("...")'}</code></td>
    </tr>
    <tr>
        <td><code>{'"..."u'}</code></td>
        <td><code>{'stringToBase256("...")'}</code></td>
    </tr>
    </tbody>
</table>

These functions:
* compile-time only
* for constant strings only
* can be used in constant initialization

```tolk
// type will be `address`
const BASIC_ADDR = address("EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF");

// return type will be `int`
fun minihashDemo() {
    return stringSha256_32("transfer(slice, int)");
}
```

The naming highlights that these functions have arrived from string postfixes and operate on string values.
Remember that at runtime, there are no strings, only slices.


### Trailing comma support


Tolk now supports trailing commas in the following contexts:
* tensors
* tuples
* function calls
* function parameters

```tolk
var items = (
    totalSupply,
    verifiedCode,
    validatorsList,
);
```

Note that `(5)` is not a tensor. It's just the integer `5` in parentheses.
With a trailing comma `(5,)` it's still `(5)`.


### Optional semicolon for the last statement in a block


In Tolk, you can omit the semicolon after the final statement in a block.
While semicolons are still required between statements, the trailing semicolon on the last statement is now optional.

```tolk
fun f(...) {
	doSomething();
	return result   // <-- valid without semicolon
}

// or
if (smth) {
	return 1
} else {
	return 2
}
```


### Function ton("...") for human-readable amounts of Toncoins


<table className="cmp-func-tolk-table">
    <thead>
    <tr>
        <th>FunC</th>
        <th>Tolk</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td><code>{'int cost = 50000000;'}</code></td>
        <td><code>{'val cost = ton("0.05");'}</code></td>
    </tr>
    <tr>
        <td><code>{'const ONE_TON = 1000000000;'}</code></td>
        <td><code>{'const ONE_TON = ton("1");'}</code></td>
    </tr>
    </tbody>
</table>

The function `ton()` only accepts constant values (e.g., `ton(some_var)` is invalid).
Its type is `coins` (not `int`!), although it's still a regular `int` from the TVM point of view.
Arithmetic over `coins` degrade to `int` (for example, `cost << 1` is valid, `cost + ton("0.02")` also).


### Changes in the type system


FunC's type system is based on Hindley-Milner. This is a common approach for functional languages, where types are inferred from usage through unification.

In Tolk v0.7, the type system is rewritten from scratch.
In order to add booleans, fixed-width integers, nullability, structures, and generics, we must have a static type system (like TypeScript or Rust).
Because Hindley-Milner will clash with structure methods, struggle with proper generics, and become entirely impractical for union types (despite claims that it was _designed for union types_).

We have the following types:
- `int`, `bool`, `cell`, `slice`, `builder`, untyped `tuple`
- typed tuple `[T1, T2, ...]`
- tensor `(T1, T2, ...)`
- callables `(TArgs) -> TResult`
- nullable types `T?`, compile-time null safety
- union types `T1 | T2 | ...`, handled with pattern matching
- `coins` and function `ton("0.05")`
- `int32`, `uint64`, and other fixed-width integers (just int at TVM) [details](https://github.com/ton-blockchain/ton/pull/1559)
- `bytesN` and `bitsN`, similar to `intN` (backed by slices at TVM)
- `address` (internal/external/none, still a slice at TVM)
- `void` (more canonical to be named `unit`, but `void` is more reliable)
- `self`, to make chainable methods, described below; actually it's not a type, it can only occur instead of return type of a function
- `never` (an always-throwing function returns `never`, for example; an _impossible type_ is also `never`)
- structures and generics

The type system obeys the following rules:
- variable types can be specified manually or are inferred from declarations, and never change after being declared
- function parameters must be strictly typed
- function return types, if unspecified, inferred from return statements similar to TypeScript; in case of recursion (direct or indirect), the return type must be explicitly declared somewhere
- generic functions are supported


### Clear and readable error messages on type mismatch


In FunC, due to Hindley-Milner, type mismatch errors are very hard to understand:
```
error: previous function return type (int, int)
cannot be unified with implicit end-of-block return type (int, ()):
cannot unify type () with int
```

In Tolk, they are human-readable:
```
1) can not assign `(int, slice)` to variable of type `(int, int)`
2) can not call method for `builder` with object of type `int`
3) can not use `builder` as a boolean condition
4) missing `return`
...
```


### bool type, casting boolVar as int


Under the hood, **`bool` is still -1 and 0 at TVM level**, but from the type system's perspective, `bool` and `int` are now different.

Comparison operators `== / >= /...` return `bool`. Logical operators `&& ||` return `bool`. Constants `true` and `false` have the `bool` type.
Lots of stdlib functions now return `bool`, not `int` (having -1 and 0 at runtime):
```tolk
var valid = isSignatureValid(...);    // bool
var end = cs.isEnd();                 // bool
```

Operator `!x` supports both `int` and `bool`. Condition of `if` and similar accepts both `int` (!= 0) and `bool`.
Logical `&&` and `||` accept both `bool` and `int`, preserving compatibility with constructs like `a && b` where `a` and `b` are integers (!= 0).

Arithmetic operators are restricted to integers, only bitwise and logical allowed for bools:
```tolk
valid && end;    // ok
valid & end;     // ok, bitwise & | ^ also work if both are bools
if (!end)        // ok

if (~end)        // error, use !end
valid + end;     // error
8 & valid;       // error, int & bool not allowed
```

Note, that logical operators `&& ||` (missed in FunC) use IF/ELSE asm representation always.
In the future, for optimization, they could be automatically replaced by `& |` when it's safe (example: `a > 0 && a < 10`).
To manually optimize gas consumption, you can still use `& |` (allowed for bools), but remember, that they are not short-circuit.

**`bool` can be cast to `int` via `as` operator**:
```tolk
var i = boolValue as int;  // -1 / 0
```

There are no runtime transformations. `bool` is guaranteed to be -1/0 at TVM level, so this is type-only casting.
But generally, if you need such a cast, probably you're doing something wrong (unless you're doing a tricky bitwise optimization).


### Generic functions and instantiations like f&lt;int&gt;(...)


Tolk introduces properly made generic functions. Their syntax reminds mainstream languages:
```tolk
fun replaceNulls<T1, T2>(tensor: (T1?, T2?), v1IfNull: T1, v2IfNull: T2): (T1, T2) {
    var (a, b) = tensor;
    return (a == null ? v1IfNull : a, b == null ? v2IfNull : b);
}
```

A generic parameter `T` may be something complex.
```tolk
fun duplicate<T>(value: T): (T, T) {
    var copy: T = value;
    return (value, copy);
}

duplicate(1);         // duplicate<int>
duplicate([1, cs]);   // duplicate<[int, slice]>
duplicate((1, 2));    // duplicate<(int, int)>
```

Or even functions, it also works:
```tolk
fun callAnyFn<TObj, TResult>(f: TObj -> TResult, arg: TObj) {
    return f(arg);
}

fun callAnyFn2<TObj, TCallback>(f: TCallback, arg: TObj) {
    return f(arg);
}
```

Note that while generic `T` is mostly detected from arguments, there are no such obvious corner cases when `T` does not depend on arguments:
```tolk
fun tupleLast<T>(t: tuple): T
    asm "LAST";

var last = tupleLast(t);    // error, can not deduce T
```

To make this valid, `T` should be provided externally:
```tolk
var last: int = tupleLast(t);       // ok, T=int
var last = tupleLast<int>(t);       // ok, T=int
var last = tupleLast(t) as int;     // ok, T=int

someF(tupleLast(t));       // ok, T=(paremeter's declared type)
return tupleLast(t);       // ok if function specifies return type
```

Also note that `T` for asm functions must occupy one stack slot, whereas for a user-defined function, `T` could be of any shape. Otherwise, asm body is unable to handle it properly.


### Another naming for recv_internal / recv_external

```tolk
fun onInternalMessage
fun onExternalMessage
fun onTickTock
fun onSplitPrepare
fun onSplitInstall
```

All parameter types and their order rename the same, only naming is changed. `fun main` is also available.


### #include → import. Strict imports


<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'#include "another.fc";'}</code></td>
    <td><code>{'import "another.tolk"'}</code></td>
  </tr>
  </tbody>
</table>

In Tolk, you can not use a symbol from `a.tolk` without importing this file. In other words, **import what you use**.

All stdlib functions are available out of the box. Downloading stdlib and `#include "stdlib.fc"` is unnecessary. See below about embedded stdlib.

There is still a global scope of naming. If `f` is declared in two different files, it's an error. We `import` a whole file with no per-file visibility, and the `export` keyword is now supported but probably will be in the future.


### #pragma → compiler options


In FunC, **experimental** features like `allow-post-modifications` were turned on by a pragma in `.fc` files (leading to problems when some files contain it, some don't). Indeed, it's not a pragma for a file, it's a compilation option.

In Tolk, all pragmas were removed. `allow-post-modification` and `compute-asm-ltr` were merged into Tolk sources (as if they were always on in FunC). Instead of pragmas, there is now an ability to pass experimental options.

As for now, there is one experimental option introduced — `remove-unused-functions`, which doesn't include unused symbols to Fift output.

`#pragma version xxx` was replaced by `tolk xxx` (no >=, just a strict version). It's good practice to annotate the compiler version you are using. If it doesn't match, Tolk will show a warning.
```tolk
tolk 0.12
```

### Late symbols resolving. AST representation


In FunC, like in С, you can not access a function declared below:
```func
int b() { a(); }   ;; error
int a() { ... }    ;; since it's declared below
```

To avoid an error, a programmer should first create a forward declaration. The reason is that symbol resolution is performed right during parsing.

Tolk compiler separates these two steps. At first, it does parsing, and then it does symbol resolving. Hence, a snippet above would not be erroneous.

It sounds simple, but internally, it's a very huge job. To make this available, I've introduced an intermediate AST representation, which was completely missed in FunC. That's an essential point for future modifications and performing semantic code analysis.


### null keyword


Creating null values and checking variables on null looks very pretty now.

<table className="cmp-func-tolk-table different-col-widths">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'a = null()'}</code></td>
    <td><code>{'a = null'}</code></td>
  </tr>
  <tr>
    <td><code>{'if (null?(a))'}</code></td>
    <td><code>{'if (a == null)'}</code></td>
  </tr>
  <tr>
    <td><code>{'if (~ null?(b))'}</code></td>
    <td><code>{'if (b != null)'}</code></td>
  </tr>
  <tr>
    <td><code>{'if (~ cell_null?(c))'}</code></td>
    <td><code>{'if (c != null)'}</code></td>
  </tr>
  </tbody>
</table>


### throw and assert keywords


Tolk dramatically simplifies working with exceptions.

If FunC has `throw()`, `throw_if()`, `throw_arg_if()`, and the same for unless, Tolk has only two primitives: `throw` and `assert`.

<table className="cmp-func-tolk-table different-col-widths">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'throw(excNo)'}</code></td>
    <td><code>{'throw excNo'}</code></td>
  </tr>
  <tr>
    <td><code>{'throw_arg(arg, excNo)'}</code></td>
    <td><code>{'throw (excNo, arg)'}</code></td>
  </tr>
  <tr>
    <td><code>{'throw_unless(excNo, condition)'}</code></td>
    <td><code>{'assert(condition, excNo)'}</code></td>
  </tr>
  <tr>
    <td><code>{'throw_if(excNo, condition)'}</code></td>
    <td><code>{'assert(!condition, excNo)'}</code></td>
  </tr>
  </tbody>
</table>

Note, that `!condition` is possible since logical NOT is available, see below.

There is a long (verbose) syntax of `assert(condition, excNo)`:
```tolk
assert(condition) throw excNo;
// with a possibility to include arg to throw
```

Also, Tolk swaps `catch` arguments: it's `catch (excNo, arg)`, both optional (since arg is most likely empty).

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'try { } catch (_, _) { }'}</code></td>
    <td><code>{'try { } catch { }'}</code></td>
  </tr>
  <tr>
    <td><code>{'try { } catch (_, excNo) { }'}</code></td>
    <td><code>{'try { } catch(excNo) { }'}</code></td>
  </tr>
  <tr>
    <td><code>{'try { } catch (arg, excNo) { }'}</code></td>
    <td><code>{'try { } catch(excNo, arg) { }'}</code></td>
  </tr>
  </tbody>
</table>


### do ... until → do ... while


<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'do { ... } until (~ condition);'}</code></td>
    <td><code>{'do { ... } while (condition);'}</code></td>
  </tr>
  <tr>
    <td><code>{'do { ... } until (condition);'}</code></td>
    <td><code>{'do { ... } while (!condition);'}</code></td>
  </tr>
  </tbody>
</table>

Note, that `!condition` is possible since logical NOT is available, see below.


### Operator precedence became identical to C++ / JavaScript


In FunC, such code `if (slices_equal() & status == 1)` is parsed as `if( (slices_equal()&status) == 1 )`. This approach is a reason for various errors in real-world contracts.

In Tolk, `&` has a lower priority, which is identical to C++ and JavaScript.

Moreover, Tolk fires errors on potentially wrong operators' usage to eliminate such errors:
```tolk
if (flags & 0xFF != 0)
```

will lead to a compilation error (similar to gcc/clang):
```
& has lower precedence than ==, probably this code won't work as you expected.  Use parenthesis: either (... & ...) to evaluate it first, or (... == ...) to suppress this error.
```

Hence, you should rewrite the code:
```tolk
// either to evaluate it first (our case)
if ((flags & 0xFF) != 0)
// or to emphasize the behavior (not our case here)
if (flags & (0xFF != 0))
```

I've also added a diagnostic for a common mistake in bitshift operators: `a << 8 + 1` is equivalent to `a << 9`, probably unexpected.

```
int result = a << 8 + low_mask;

error: << has lower precedence than +, probably this code won't work as you expected.  Use parenthesis: either (... << ...) to evaluate it first, or (... + ...) to suppress this error.
```

Operators `~% ^% /% ~/= ^/= ~%= ^%= ~>>= ^>>=` no longer exist.


### Immutable variables, declared via val


Like in Kotlin: `var` for mutable, `val` for immutable, optionally followed by a type. FunC has no analogue of `val`.
```tolk
val flags = msgBody.loadMessageFlags();
flags &= 1;         // error, modifying an immutable variable

val cs: slice = c.beginParse();
cs.loadInt(32);     // error, since loadInt() mutates an object
cs.preloadInt(32);  // ok, it's a read-only method
```

Parameters of a function are mutable, but since they are copied by value, called arguments aren't changed. Exactly like in FunC, just to clarify.
```tolk
fun some(x: int) {
    x += 1;
}

val origX = 0;
some(origX);      // origX remains 0

fun processOpIncrease(msgBody: slice) {
    val flags = msgBody.loadInt(32);
    ...
}

processOpIncrease(msgBody);  // by value, not modified
```

In Tolk, a function can declare `mutate` parameters. It's a generalization of FunC `~` tilda functions, read below.


### Deprecated command-line options removed


Command-line flags `-A`, `-P`, and others were removed. Default behavior
```
/path/to/tolk {inputFile}
```
is more than enough. Use `-v` to print version and exit. Use `-h` for all available command-line flags.

Only one input file can be passed, others should be `import`'ed.


### stdlib functions renamed to ~~verbose~~ clear names, camelCase style


All names in the standard library were reconsidered. Now, functions are called using longer but clear names.

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code dangerouslySetInnerHTML={{__html: 'cur_lt()<br>car(l)<br>get_balance().pair_first()<br>raw_reserve(count)<br>dict~idict_add?(...)<br>dict~udict::delete_get_max()<br>t~tpush(triple(x, y, z))<br>s.slice_bits()<br>~dump(x)<br>...'}}></code></td>
    <td><code dangerouslySetInnerHTML={{__html: 'blockchain.logicalTime()<br>listGetHead(l)<br>contract.getOriginalBalance()<br>reserveToncoinsOnBalance(count)<br>dict.iDictSetIfNotExists(...)<br>dict.uDictDeleteLastAndGet()<br>t.push([x, y, z])<br>s.remainingBitsCount()<br>debug.print(x)<br>...'}}></code></td>
  </tr>
  </tbody>
</table>

A former "stdlib.fc" was split into multiple files: common.tolk, tvm-dicts.tolk, and others.

Continue here: [Tolk vs FunC: standard library](/v3/documentation/smart-contracts/tolk/tolk-vs-func/stdlib).


### stdlib is now embedded, not downloaded from GitHub


<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td>
      <ol style={{margin: 0}}>
        <li>Download stdlib.fc from GitHub</li>
        <li>Save into your project</li>
        <li>`#include "stdlib.fc";`</li>
        <li>Use standard functions</li>
      </ol>
    </td>
    <td>
      <ol style={{margin: 0}}>
        <li>Use standard functions</li>
      </ol>
    </td>
  </tr>
  </tbody>
</table>

In Tolk, stdlib a part of distribution. Standard library is inseparable, since keeping a triple **language, compiler, stdlib** together is the only correct way to maintain release cycle.

It works in such a way. Tolk compiler knows how to locate a standard library. If a user has installed an apt package, stdlib sources were also downloaded and exist on a hard disk, so the compiler locates them by system paths. If a user uses a WASM wrapper, they are provided by tolk-js. And so on.

Standard library is split into multiple files: `common.tolk` (most common functions), `gas-payments.tolk` (calculating gas fees), `tvm-dicts.tolk`, and others. Functions from `common.tolk` are available always (a compiler implicitly imports it). Other files are needed to be explicitly imported:
```tolk
import "@stdlib/tvm-dicts"   // ".tolk" optional

...
var dict = createEmptyDict();
dict.iDictSet(...);
```

Mind the rule **import what you use**, it's applied to `@stdlib/...` files also (with the only exception of `common.tolk`).

JetBrains IDE plugin automatically discovers stdlib folder and inserts necessary imports as you type.


### Logical operators && ||, logical not !


In FunC, there are only bitwise operators `~ & | ^`. Developers making first steps, thinking "okay, no logical, I'll use bitwise in the same manner", often do errors, since operator behavior is completely different:

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>`a & b`</th>
    <th>`a && b`</th>
  </tr>
  </thead>
  <tbody>
  <tr><td colSpan={2}>sometimes, identical:</td></tr>
  <tr>
    <td><code>{'0 & X = 0'}</code></td>
    <td><code>{'0 & X = 0'}</code></td>
  </tr>
  <tr>
    <td><code>{'-1 & X = -1'}</code></td>
    <td><code>{'-1 & X = -1'}</code></td>
  </tr>
  <tr><td colSpan={2}>but generally, not:</td></tr>
  <tr>
    <td><code>{'1 & 2 = 0'}</code></td>
    <td><code>{'1 && 2 = -1 (true)'}</code></td>
  </tr>
  </tbody>
</table>

<table className="cmp-func-tolk-table different-col-widths">
  <thead>
  <tr>
    <th>`~ found`</th>
    <th>`!found`</th>
  </tr>
  </thead>
  <tbody>
  <tr><td colSpan={2}>sometimes, identical:</td></tr>
  <tr>
    <td><code>{'true (-1) → false (0)'}</code></td>
    <td><code>{'-1 → 0'}</code></td>
  </tr>
  <tr>
    <td><code>{'false (0) → true (-1)'}</code></td>
    <td><code>{'0 → -1'}</code></td>
  </tr>
  <tr><td colSpan={2}>but generally, not:</td></tr>
  <tr>
    <td><code>{'1 → -2'}</code></td>
    <td><code>{'1 → 0 (false)'}</code></td>
  </tr>
  </tbody>
</table>

<table className="cmp-func-tolk-table different-col-widths">
  <thead>
  <tr>
    <th><code>condition & f()</code></th>
    <th><code>condition && f()</code></th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code className="inline">f()</code> is called always</td>
    <td><code className="inline">f()</code> is called only if <code className="inline">condition</code></td>
  </tr>
  </tbody>
</table>

<table className="cmp-func-tolk-table different-col-widths">
  <thead>
  <tr>
    <th><code>condition | f()</code></th>
    <th><code>condition || f()</code></th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code className="inline">f()</code> is called always</td>
    <td><code className="inline">f()</code> is called only if <code className="inline">condition</code> is false</td>
  </tr>
  </tbody>
</table>

Tolk supports logical operators. They behave exactly as you get used to (right column). For now, `&&` and `||` sometimes produce not optimal Fift code, but in the future, Tolk compiler will become smarter in this case. It's negligible, just use them like in other languages.

<table className="cmp-func-tolk-table different-col-widths">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'if (~ found?)'}</code></td>
    <td><code>{'if (!found)'}</code></td>
  </tr>
  <tr>
    <td><code dangerouslySetInnerHTML={{__html: 'if (~ found?) {<br>    if (cs~load_int(32) == 0) {<br>        ...<br>    }<br>}'}}></code></td>
    <td><code dangerouslySetInnerHTML={{__html: 'if (!found && cs.loadInt(32) == 0) {<br>    ...<br>}'}}></code></td>
  </tr>
  <tr>
    <td><code>{'ifnot (cell_null?(signatures))'}</code></td>
    <td><code>{'if (signatures != null)'}</code></td>
  </tr>
  <tr>
    <td><code>{'elseifnot (eq_checksum)'}</code></td>
    <td><code>{'else if (!eqChecksum)'}</code></td>
  </tr>
  </tbody>
</table>

Keywords `ifnot` and `elseifnot` were removed, since now we have logical not (for optimization, Tolk compiler generates `IFNOTJMP`, btw). The `elseif` keyword  was replaced by the traditional `else if`.

Remember that a boolean `true`, transformed `as int`, is -1, not 1. It's a TVM representation.


### Indexed access tensorVar.0 and tupleVar.0


Use `tensorVar.{i}` to access i-th component of a tensor. Modifying it will change the tensor.
```tolk
var t = (5, someSlice, someBuilder);   // 3 stack slots
t.0         			// 5
t.0 = 10;   			// t is now (10, ...)
t.0 += 1;               // t is now (11, ...)
increment(mutate t.0);  // t is now (12, ...)
t.0.increment();        // t is now (13, ...)

t.1         // slice
t.100500    // compilation error
```

Use `tupleVar.{i}` to access i-th element of a tuple (does INDEX under the hood). Modifying it will change the tuple (does SETINDEX under the hood).
```tolk
var t = [5, someSlice, someBuilder];   // 1 tuple on a stack with 3 items
t.0                     // "0 INDEX", reads 5
t.0 = 10;               // "0 SETINDEX", t is now [10, ...]
t.0 += 1;               // also works: "0 INDEX" to read 10, "0 SETINDEX" to write 11
increment(mutate t.0);  // also, the same way
t.0.increment();        // also, the same way

t.1         // "1 INDEX", it's slice
t.100500    // compilation error
```

It also works for untyped tuples, though the compiler can't guarantee index correctness.
```tolk
var t = createEmptyTuple();
t.tuplePush(5);
t.0                     // will head 5
t.0 = 10                // t will be [10]
t.100500                // will fail at runtime
```

It works for nesting `var.{i}.{j}`. It works for nested tensor, nested tuples, tuples nested into tensors.
It works for `mutate`. It works for globals.
```tolk
t.1.2 = 10;    // "1 INDEX" + "2 SETINDEX" + "1 SETINDEX"
t.1.2 += 10;   // "1 INDEX" + "2 INDEX" + sum + "2 SETINDEX" + "1 SETINDEX"

globalTuple.1.2 += 10;  // "GETGLOB" + ... + "SETGLOB"
```


### Type address



In TVM, all **binary data** is just **a slice.** Same goes for addresses: while TL-B describes the entity `MsgAddress` (internal/external/none/var address),

and TVM assembler has instructions to load/validate addresses, nevertheless: at the low level, it's just a slice.
That's why in FunC's standard library `loadAddress` returned `slice`, and `storeAddress` accepted `slice`.

Tolk introduces the dedicated `address` type. It's still a TVM slice at runtime (internal/external/none),
but it differs from an **abstract slice** from the type system point of view:


1) Integrated with auto-serialization: compiler knows how to pack/unpack it (`LDMSGADDR` and `STSLICE`)
2) Comparable: operators `==` and `!=` work on addresses:
```tolk
if (senderAddress == msg.owner)
```
3) Introspectable: `address.isNone()`, `address.isInternal()`, `address.isExternal()`, `address.getWorkchain()` and `address.getWorkchainAndHash()` (valid for internal addresses)

Passing a slice instead leads to an error:
```tolk
var a: slice = s.loadAddress();  // error, can not assign `address` to `slice`
```

**Embedding a const address into a contract**

Use the built-in `address()` function, which accepts a standard address. In FunC, there was a postfix `"..."a` that returned a slice.
```tolk
address("EQCRDM9h4k3UJdOePPuyX40mCgA4vxge5Dc5vjBR8djbEKC5")
address("0:527964d55cfa6eb731f4bfc07e9d025098097ef8505519e853986279bd8400d8")
```

**Casting `slice` to `address` and vice versa**

If you have a raw slice, which is actually an address, you can cast it via `as` operator.
In practice, this can occur if you've composed an address with a builder, having manually written its binary representation:
```tolk
var b = beginCell()
       .storeUint(0b01)   // addr_extern
       ...;
var s = b.endCell().beginParse();
return s as address;   // `slice` as `address`
```

A reversed cast also is valid: `someAddr as slice` (why would you need it, is an open question, though).

**Different types of addresses**

According to a standard, there are different types of addresses. The most frequently used is a **standard address** — just and address of a smart contract, like `EQ...`. But also, there are **external** and **none** addresses. In a binary TL-B representation,
* `10` (**internal** prefix) + `0` (anycast, always 0) + workchain (8 bits) + hash (256 bits) — that's `EQ...`: it's 267 bits
* `01` (**external** prefix) + len (9 bits) + len bits — external addresses
* `00` (**none** prefix) — address **none**, 2 bits


The `address` type can hold any of these. Most often, it's an internal address. But the type system does not restrict it exactly: this can't be done without heavy runtime checks.

So, if `address` comes from an untrusted input, you should probably validate it:
```tolk
val newOwner = msg.nextOwnerAddress;
assert(newOwner.isInternal()) throw 403;
assert(newOwner.getWorkchain() == BASECHAIN) throw 403;
```

All in all, if you don't trust inputs — you should validate everything: numbers, payload, and addresses particularly.
But if an input comes from a trusted source (your own contract storage, for example) — of course, you can rely on its contents.
The compiler does not insert hidden instructions.
Just remember, that `address` in general can hold all valid types.


### Type aliases type NewName = &lt;existing type&gt;


Tolk supports type aliases, similar to TypeScript and Rust.
An alias creates a new name for an existing type but **remains interchangeable with it**.

```tolk
type UserId = int32;
type MaybeOwnerHash = bytes32?;

fun calcHash(id: UserId): MaybeOwnerHash { ... }

var id: UserId = 1;       // ok
var num: int = id;        // ok
var h = calcHash(id);
if (h != null) {
    h as slice;           // bytes32 as slice
}
```


### Nullable types T?, null safety, smart casts, operator !


Tolk has nullable types: `int?`, `cell?`, and `T?` in general (even for tensors).
Non-nullable types, such as `int` and `cell`, can never hold null values.

The compiler enforces **null safety**: you cannot use nullable types without first checking for null.
Fortunately, these checks integrate smoothly and organically into the code thanks to smart casts.
Smart casts are purely a compile-time feature — they do not consume gas or extra stack space.

```tolk
var value = x > 0 ? 1 : null;  // int?

value + 5;               // error
s.storeInt(value);       // error

if (value != null) {
    value + 5;           // ok, smart cast
    s.storeInt(value);   // ok, smart cast
}
```

Remember that when a variable's type is not specified, it's auto-inferred from the assignment and never changes:
```tolk
var i = 0;
i = null;       // error, can't assign `null` to `int`
i = maybeInt;   // error, can't assign `int?` to `int`
```

Such a code will not work. You must **explicitly declare the variable as nullable**::
```tolk
// incorrect
var i = null;
if (...) {
    i = 0;     // error
}

// correct
var i: int? = null;
// or
var i = null as int?;
```

Smart casts (similar to TypeScript and Kotlin) make it easier to deal with nullable types, allowing code like this:
```tolk
if (lastCell != null) {
    // here lastCell is `cell`, not `cell?`
}
```
```tolk
if (lastCell == null || prevCell == null) {
    return;
}
// both lastCell and prevCell are `cell`
```
```tolk
var x: int? = ...;
if (x == null) {
    x = random();
}
// here x is `int`
```
```tolk
while (lastCell != null) {
    lastCell = lastCell.beginParse().loadMaybeRef();
}
// here lastCell is 100% null
```
```tolk
// t: (int, int)?
t.0                // error
t!.0               // ok
if (t.0 != null) {
    t.0            // ok
}
```

Note that smart casts don't work for globals; they only work for local vars.

Tolk has the `!` operator (non-null assertion, compile-time only), like `!` in TypeScript and `!!` in Kotlin.
If you are certain that a variable is not null,
this operator allows you to skip the compiler's check.
```tolk
fun doSmth(c: cell);

fun analyzeStorage(nCells: int, lastCell: cell?) {
    if (nCells) {           // then lastCell 100% not null
        doSmth(lastCell!);  // use ! for this fact
    }
}
```

In practice, you'll use this operator working with low-level dicts API.
Tolk will have a high-level `map<K,V>` in the future.
For now, working with dicts will require the `!` operator.
```tolk
// it returns either (slice, true) or (null, false)
@pure
fun dict.iDictGet(self, keyLen: int, key: int): (slice?, bool)
    asm(key self keyLen) "DICTIGET" "NULLSWAPIFNOT";

var (cs, exists) = myDict.iDictGet(...);
// if exists is true, cs is not null
if (exists) {
    cs!.loadInt(32);
}
```

You can also declare **always-throwing functions** that return `never`:
```tolk
fun alwaysThrows(): never {
    throw 123;
}

fun f(x: int) {
    if (x > 0) {
        return x;
    }
    alwaysThrows();
    // no `return` statement needed
}
```

The `never` type implicitly occurs when a condition can never happen:
```tolk
var v = 0;
// prints a warning
if (v == null) {
    // v is `never`
    v + 10;   // error, can not apply `+` `never` and `int`
}
// v is `int` again
```

If you encounter `never` in compilation errors, there is most likely a warning in the preceding code.

Non-atomic nullable are also allowed: `(int, int)?`, `(int?, int?)?`, or even `()?`. Then,
a special *value presence* stack slot is implicitly added.
It holds `0` if a value is null, and not 0 (currently, -1) if not null:
```tolk
// t: (int, int)?
t = (1, 2);    // 1 2 -1
t = (3, 4);    // 3 4 -1
t = null;      // null null 0

// t: ()?
t = ();         // -1
t = null;       // 0
```

All in all, nullability is a significant step forward for type safety and reliability.
Nullable types eliminate runtime errors, enforcing correct handling of optional values.


### Union types T1 | T2 | ..., operators match, is, !is


Union types allow a variable to hold multiple possible types, similar to TypeScript.
```tolk
fun whatFor(a: bits8 | bits256): slice | UserId { ... }

var result = whatFor(...);  // slice | UserId
```

Nullable types `T?` are now formally `T | null`.
Union types have intersection properties. For instance, `B | C` can be passed/assigned to `A | B | C | D`.

The only way to work with unions from code is **pattern matching**:
```tolk
match (result) {
    slice  => { /* result is smart-casted to slice  */ }
    UserId => { /* result is smart-casted to UserId */ }
}
```

Example:
```tolk
match (result) {
    slice => {
        return result.loadInt(32);
    }
    UserId => {
        if (result < 0) {
            throw 123;
        }
        return loadUser(result).parentId;
    }
}
```

`match` must cover all union cases (should be *exhaustive*). It can also be **used as an expression**:
```tolk
type Pair2 = (int, int);
type Pair3 = (int, int, int);

fun getLast(tensor: Pair2 | Pair3) {
    return match (tensor) {
        Pair2 => tensor.1,
        Pair3 => tensor.2,
    }
}
```

Syntax details:
* commas are optional with {} but required for expressions
* a trailing comma is allowed
* semicolon is not required after `match` used as a statement
* for match-expressions, its arm can terminate, then its type is considered `never`:
```tolk
return match (msg) {
    ...
    CounterReset => throw 403,  // forbidden
}
```

Variable declaration inside `match` is allowed:
```tolk
match (val v = getPair2Or3()) {
    Pair2 => {
        // use v.0 and v.1
    }
    Pair3 => {
        // use v.0, v.1, and v.2
    }
}
```

<details>
<summary>How are union types represented on the stack, at the TVM level?</summary>

Internally, at the TVM level, they are stored as tagged unions, like enums in Rust:
* each type is assigned a unique type ID, which is stored alongside the value
* the union occupies N + 1 stack slots, where N is the maximum size of any type in the union
* a nullable type `T?` is just a union with null (type ID = 0); `int?` and other atomics still use 1 stack slot

```tolk
var v: int | slice;    // 2 stack slots: value and typeID
                       // - int:   (100, 0xF831)
                       // - slice: (CS{...}, 0x29BC)
match (v) {
    int =>     // IF TOP == 0xF831 { ... }
        // v.slot1 contains int, can be used in arithmetics
    slice =>   // ELSE { IF TOP == 0x29BC { ... } }
        // v.slot1 contains slice, can be used to loadInt()
}

fun complex(v: int | slice | (int, int)) {
    // Stack representation:
    // - int:        (null, 100, 0xF831)
    // - slice:      (null, CS{...}, 0x29BC)
    // - (int, int): (200, 300, 0xA119)
}

complex(v);   // passes (null, v.slot1, v.typeid)
complex(5);   // passes (null, 5, 0xF831)
```
</details>

Besides `match`, you can test a union type by `is`. Smart casts work as expected:
```tolk
fun f(v: cell | slice | builder) {
    if (v is cell) {
        v.cellHash();
    } else {
        // v is `slice | builder`
        if (v !is builder) { return; }
        // v is `slice`
        v.sliceHash();
    }
    // v is `cell | slice`
    if (v is int) {
        // v is `never`
        // a warning is also printed, condition is always false
    }
}
```


### Pattern matching for expressions (switch-like behavior)


`match` can also be used for **constant expressions**, similar to `switch`:
```tolk
val nextValue = match (curValue) {
    1 => 0,
    0 => 1,
    else => -1
};
```

Rules:
* only constant expressions are allowed on the left-hand side (1, SOME_CONST, 2 + 3)
* branches can contain `return` and `throw`
* `else` is required for expression form but optional for statement form:
```tolk
// statement form
match (curValue) {
    1 => { nextValue = 0 }
    0 => { nextValue = 1 }
    -1 => throw NEGATIVE_NOT_ALLOWED
}

// expression form, else branch required
val nextValue = match (curValue) {
    ...
    else => <expression>
}
```


### Structures {'struct A { ... }'}


Looks like TypeScript — but works in TVM!
```tolk
struct Point {
    x: int;
    y: int;
}

fun calcMaxCoord(p: Point) {
    return p.x > p.y ? p.x : p.y;
}

// declared like a JS object
var p: Point = { x: 10, y: 20 };
calcMaxCoord(p);

// called like a JS object
calcMaxCoord({ x: 10, y: 20 });

// works with shorthand syntax
fun createPoint(x: int, y: int): Point {
    return { x, y };
}
```

* a struct is just **a named tensor**
* `Point` is identical to `(int, int)` at the TVM level
* field access `p.x` works like accessing tensor elements `t.0`, for reading and writing

This means **no bytecode overhead** — you can replace unreadable tensors with clean, structured types.

Fields can be separated by `;` or `,` (both are valid, like in TypeScript). Trailing commas are allowed.

When creating a structure, you can specify `StructName { ... }` or simply `{ ... }` if the type is clear from the context (e.g., return type or assignment):
```tolk
var s: StoredInfo = { counterValue, ... };
var s: (int, StoredInfo) = (0, { counterValue, ... });

// also valid, but not preferred
var s = StoredInfo { counterValue, ... };
```

Default values for fields are supported:
```tolk
struct DefDemo {
    f1: int = 0;
    f2: int? = null;
    f3: (int, coins) = (0, ton("0.05"));
}

var d: DefDemo = {};         // ok
var d: DefDemo = { f2: 5 };  // ok
```

Structs can have methods as extension functions, read below.


### Generic structs and aliases


They exist only at the type level (no runtime cost).
```tolk
struct Container<T> {
    isAllowed: bool;
    element: T?;
}

struct Nothing {}

type Wrapper<T> = Nothing | Container<T>;
```

Example usage:
```tolk
fun checkElement(c: Container<T>) {
    return c.element != null;
}

var c: Container<int32> = { isAllowed: false, element: null };

var v: Wrapper<int> = Nothing {};
var v: Wrapper<int32> = Container { value: 0 };
```

Since it's a generic, you should specify type arguments when using it:
```tolk
fun getItem(c: Container)        // error, specify type arguments
fun getItem(c: Container<int>)   // ok
fun getItem<T>(c: Container<T>)  // ok

var c: Container = { ... }       // error, specify type arguments
var c: Container<int> = { ... }  // ok
```

When you declare a generic function, the compiler can automatically infer type arguments for a call:
```tolk
fun doSmth<T>(value: Container<T>) { ... }

doSmth({ item: 123 });         // T = int
doSmth({ item: cellOrNull });  // T = cell?
```

Demo: `Response<TResult, TError>`:
```tolk
struct Ok<TResult> { result: TResult; }
struct Err<TError> { err: TError; }

type Response<R, E> = Ok<R> | Err<E>;

fun tryLoadMore(slice: slice): Response<cell, int32> {
    return ...
        ? Ok { result: ... }
        : Err { err: ErrorCodes.NO_MORE_REFS };
}

match (val r = tryLoadMore(inMsg)) {
    Ok => { r.result }
    Err => { r.err }
}
```


### Methods: for any types, including structures


Methods are declared as extension functions, similar to Kotlin.
A method can accept the first `self` parameter (then it's an instance method) or not accept it (then it's a static method).
```tolk
fun Point.getX(self) {
    return self.x
}

fun Point.create(x: int, y: int): Point {
    return { x, y }
}
```

Methods can be created **for any type**, including aliases, unions, and built-in types:
```tolk
fun int.isZero(self) {
    return self == 0;
}

type MyMessage = CounterIncrement | ...;

fun MyMessage.parse(self) { ... }
// this is identical to
// fun (CounterIncrement | ...).parse(self)
```

Methods perfectly work with `asm`, since `self` is just a regular variable:
```tolk
@pure
fun tuple.size(self): int
    asm "TLEN";
```

By default, **`self` is immutable**. It means that you can't modify it or call mutating methods.
To make `self` mutable, you should explicitly declare `mutate self`:
```tolk
fun Point.assignX(mutate self, x: int) {
    self.x = x;   // without mutate, an error "modifying immutable object"
}

fun builder.storeInt32(mutate self, v: int32): self {
    return self.storeInt(v, 32);
}
```

Methods for generic structs created seamlessly.
Note, that no extra `<T>` is required: while parsing the receiver type, compiler treats unknown symbols as generic arguments.
```tolk
struct Container<T> {
    item: T;
}

// compiler treats T (unknown symbol) as a generic parameter
fun Container<T>.getItem(self) {
    return self.item;
}

// and this is a specialization for integer containers
fun Container<int>.getItem(self) {
    ...
}
```

Another example:
```tolk
struct Pair<T1, T2> {
    first: T1;
    second: T2;
}

// both <T1,T2>, <A,B>, etc. work: any unknown symbols
fun Pair<A, B>.create(f: A, s: B): Pair<A, B> {
    return {
        first: f,
        second: s,
    }
}
```

Similarly, any unknown symbol (typically, `T`) can be used to make a method accepting anything:
```tolk
// any receiver
fun T.copy(self): T {
    return self;
}

// any nullable receiver
fun T?.isNull(self): bool {
    return self == null;
}
```

When you call `someObj.method()`, multiple methods with the same name may exist and theoretically be acceptable:
```tolk
fun T.copy(self) { ... }
fun int.copy(self) { ... }

someVar.copy();   // ???
```

So, the compiler performs matching to find as precise method as follows:
1) Search for exact type receiver like `int.copy` (most practical cases finish here)
2) Search for non-generic receivers that are acceptable (like `int32.copy` / `int?.copy`)
3) Search for generic receivers except `T` (like `Container<T>.copy`)
4) Search for `T` receivers (`T.copy`)

```tolk
fun int.copy(self) { ... }
fun T.copy(self) { ... }

6.copy()              // int.copy (rule 1)
(6 as int32).copy()   // int.copy (rule 2)
(6 as int32?).copy()  // T.copy with T=int? (rule 4)
```

```tolk
type MyMessage = CounterIncrement | CounterReset;
fun MyMessage.check() { ... }
fun CounterIncrement.check() { ... }

MyMessage{...}.check()         // first (rule 1)
CounterIncrement{...}.check()  // second (rule 1)
CounterReset{...}.check()      // first (rule 2)
```

In case of ambiguity, an error is printed:
```tolk
fun int?.doSmth(self) { ... }
fun int64.doSmth(self) { ... }

var v: int32;
v.doSmth();   // error: no exact match, but two possible acceptable receivers
```

You can assign a generic function to the variable, but you should explicitly specify types:
```tolk
fun genericFn<T>(v: T) { ... }
fun Container<T>.getItem(self) { ... }

var callable1 = genericFn<slice>;
var callable2 = Container<int32>.getItem;
callable2(someContainer32);   // pass it as self
```


### No tilda ~ methods, mutate keyword instead


This change is so huge that it's described on a separate page: [Tolk mutability](/v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability).


### Auto-packing to/from cells/builders/slices


Having any struct, you can unpack in from a cell or pack and object to a cell:
```tolk
struct Point {
    x: int8;
    y: int8;
}

var value: Point = { x: 10, y: 20 };

// makes a cell containing "0A14"
var c = value.toCell();
// back to { x: 10, y: 20 }
var p = Point.fromCell(c);
```

Continue reading on a separate page: [Auto-packing to/from cells](/v3/documentation/smart-contracts/tolk/tolk-vs-func/pack-to-from-cells).


### Universal createMessage: avoid manual cells composition


No more manual `beginCell().storeUint(...).storeRef(...)` boilerplate. Just describe the message in a literal, and let the compiler do the rest.
```tolk
val reply = createMessage({
    bounce: false,
    value: ton("0.05"),
    dest: senderAddress,
    body: RequestedInfo { ... }
});
reply.send(SEND_MODE_REGULAR);
```

Continue reading on a separate page: [Universal createMessage](/v3/documentation/smart-contracts/tolk/tolk-vs-func/create-message).


<hr />

<h3>Tolk vs FunC gas consumption</h3>

:::tip The same or slightly less
If you transform FunC code line-by-line (for example, using a [converter](https://github.com/ton-blockchain/convert-func-to-tolk)),
you'll have the same results or even a bit better.
:::

Since Tolk is a fork of FunC, part of its core remains unchanged — particularly the stack manipulation logic.
Yes, Tolk is a completely different language, with its own syntax and semantics,
but its low-level internal representation is exactly the same as FunC's.
As a result, the syntax has no impact on gas consumption.
In fact, it's even slightly lower, since the strict type system
gives the compiler more room for optimizations.

However, once Tolk v1.0 is released, it will be significantly more efficient.
Auto-serialized structures, automatic message construction, and other features will be
noticeably cheaper than manual work with builders and slices — almost always.

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-short.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-short.md
================================================
import Feedback from '@site/src/components/Feedback';

# Tolk vs FunC: in short

Tolk is much more similar to TypeScript and Kotlin than C and Lisp. 
But it still gives you complete control over the TVM assembler since it has a FunC kernel inside.

1. Functions are declared via `fun`, get methods via `get`, variables via `var`, immutable variables via `val`, putting types on the right; parameter types are mandatory; return type can be omitted (auto inferred), as well as for locals; specifiers `inline` and others are `@` attributes
```tolk
global storedV: int;

fun parseData(cs: slice): cell {
    var flags: int = cs.loadMessageFlags();
    ...
}

@inline
fun sum(a: int, b: int) {   // auto inferred int
    val both = a + b;       // same
    return both;
}

get currentCounter(): int { ... }
```
2. No `impure`, it's by default, the Tolk compiler won't drop user function calls
3. Not `recv_internal` and `recv_external`, but `onInternalMessage` and `onExternalMessage`
4. `2+2` is 4, not an identifier; identifiers are alpha-numeric; use naming `const OP_INCREASE` instead of `const op::increase`; `cell` and `slice` are valid identifiers (not keywords)
5. Logical operators AND `&&`, OR `||`, NOT `!` are supported
6. Syntax improvements:
    - `;; comment` → `// comment`
    - `{- comment -}` → `/* comment */`
    - `#include` → `import`, with a strict rule **import what you use**
    - `~ found` → `!found` (for true/false only, obviously) (true is -1, like in FunC)
    - `v = null()` → `v = null`
    - `null?(v)` → `v == null`, same for `builder_null?` and others
    - `~ null?(v)` → `c != null`
    - `throw(excNo)` → `throw excNo`
    - `catch(_, _)` → `catch`
    - `catch(_, excNo)` → `catch(excNo)`
    - `throw_unless(excNo, cond)` → `assert(cond, excNo)`
    - `throw_if(excNo, cond)` → `assert(!cond, excNo)`
    - `return ()` → `return`
    - `do ... until (cond)` → `do ... while (!cond)`
    - `elseif` → `else if`
    - `ifnot (cond)` → `if (!cond)`
    - `"..."c` → `stringCrc32("...")` (and other postfixes also)
7. A function can be called even if declared below; forward declarations not needed; the compiler at first does parsing, and then it does symbol resolving; there is now an AST representation of source code
8. stdlib functions renamed to ~~verbose~~ clear names, camelCase style; it's now embedded, not downloaded from GitHub; it's split into several files; common functions available always, more specific available with `import "@stdlib/tvm-dicts"`, IDE will suggest you; here is [a mapping](/v3/documentation/smart-contracts/tolk/tolk-vs-func/stdlib)
9. No `~` tilda methods; `cs.loadInt(32)` modifies a slice and returns an integer; `b.storeInt(x, 32)` modifies a builder; `b = b.storeInt()` also works since it is not only modifies but returns; chained methods work identically to JS, they return `self`; everything works exactly as expected, similar to JS; no runtime overhead, exactly same Fift instructions; custom methods are created with ease; tilda `~` does not exist in Tolk at all; [more details here](/v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability)
10. Clear and readable error messages on type mismatch
11. `bool` type support
12. Indexed access `tensorVar.0` and `tupleVar.0` support
13. Nullable types `T?`, null safety, smart casts, operator `!`
14. Union types and pattern matching (for types and for expressions, switch-like behavior)
15. Type aliases are supported
16. Structures are supported
17. Generics are supported
18. Methods (as extension functions) are supported
19. Trailing comma is supported
20. Semicolon after the last statement in a block is optional
21. Fift output contains original .tolk lines as comments
22. [Auto-packing](/v3/documentation/smart-contracts/tolk/tolk-vs-func/pack-to-from-cells) to/from cells — for any types
23. [Universal createMessage](/v3/documentation/smart-contracts/tolk/tolk-vs-func/create-message) to avoid manual cells composition

#### Tooling around
- JetBrains plugin exists
- VS Code extension [exists](https://github.com/ton-blockchain/tolk-vscode)
- WASM wrapper for blueprint [exists](https://github.com/ton-blockchain/tolk-js)
- And even a converter from FunC to Tolk [exists](https://github.com/ton-blockchain/convert-func-to-tolk)

## See also

- [Tolk vs FunC: in detail](/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-detail)

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability.mdx
================================================
---
title: "Tolk vs FunC: mutability"
---

import Feedback from '@site/src/components/Feedback';

# Mutability in Tolk vs tilda functions in FunC

:::tip TLDR
- no `~` tilda methods
- `cs.loadInt(32)` modifies a slice and returns an integer
- `b.storeInt(x, 32)` modifies a builder
- `b = b.storeInt()` also works since it not only modifies but returns
- chained methods work identically to JS; they return `self`
- everything works exactly as expected, similar to JS
- no runtime overhead, the same Fift instructions
- custom methods are created with ease
- tilda `~` does not exist in Tolk at all
:::

This is a drastic change. If FunC has `.methods()` and `~methods()`, Tolk has only a dot, and the only way to call a method is `.method()`. The method may or may not *mutate* an object. Also, there is a behavioral and semantic difference between FunC and the list.

The goal is to have calls identical to JS and other languages:

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'int flags = cs~load_uint(32);'}</code></td>
    <td><code>{'var flags = cs.loadUint(32);'}</code></td>
  </tr>
  <tr>
    <td><code>{'(cs, int flags) = cs.load_uint(32);'}</code></td>
    <td><code>{'var flags = cs.loadUint(32);'}</code></td>
  </tr>
  <tr>
    <td><code>{'(slice cs2, int flags) = cs.load_uint(32);'}</code></td>
    <td><code dangerouslySetInnerHTML={{__html: 'var cs2 = cs;<br>var flags = cs2.loadUint(32);'}}></code></td>
  </tr>
  <tr>
    <td><code dangerouslySetInnerHTML={{__html: 'slice data = get_data()<br>             .begin_parse();<br>int flag = data~load_uint(32);'}}></code></td>
    <td><code dangerouslySetInnerHTML={{__html: 'val flag = contract.getData()<br>           .beginParse()<br>           .loadUint(32);'}}></code></td>
  </tr>
  <tr>
    <td><code>{'dict~udict_set(...);'}</code></td>
    <td><code>{'dict.uDictSet(...);'}</code></td>
  </tr>
  <tr>
    <td><code>{'b~store_uint(x, 32);'}</code></td>
    <td><code>{'b.storeInt(x, 32);'}</code></td>
  </tr>
  <tr>
    <td><code>{'b = b.store_int(x, 32);'}</code></td>
    <td><code dangerouslySetInnerHTML={{__html: 'b.storeInt(x, 32);<br><br>// also works<br>b = b.storeUint(32);'}}></code></td>
  </tr>
  <tr>
    <td><code dangerouslySetInnerHTML={{__html: 'b = b.store_int(x, 32)<br>     .store_int(y, 32);'}}></code></td>
    <td><code dangerouslySetInnerHTML={{__html: 'b.storeInt(x, 32)<br> .storeInt(y, 32);<br><br>// b = ...; also works'}}></code></td>
  </tr>
  </tbody>
</table>

Tolk offers a mutability conception to make this available, a generalization of what a `~` tilda means in FunC.


###  By default, all arguments are copied by value (identical to FunC)


```tolk
fun someFn(x: int) {
    x += 1;
}

var origX = 0;
someFn(origX);  // origX remains 0
someFn(10);     // ok, just int
origX.someFn(); // still allowed (but not recommended), origX remains 0
```

The same goes for cells, slices, whatever:
```tolk
fun readFlags(cs: slice) {
    return cs.loadInt(32);
}

var flags = readFlags(msgBody);  // msgBody is not modified
// msgBody.loadInt(32) will read the same flags
```

This means that when you call a function, you are sure that the original data has not been modified.

### mutate keyword and mutating functions


But if you add the `mutate` keyword to a parameter, it will make a passed argument mutable. To avoid unexpected mutations, you must specify `mutate` when calling it, also:
```tolk
fun increment(mutate x: int) {
    x += 1;
}

// it's correct, simple and straightforward
var origX = 0;
increment(mutate origX);  // origX becomes 1

// these are compiler errors
increment(origX);         // error, unexpected mutation
increment(10);            // error, not lvalue
origX.increment();        // error, not a method, unexpected mutation
val constX = getSome();
increment(mutate constX); // error, it's immutable since `val`
```

Same for slices and any other types:
```tolk
fun readFlags(mutate cs: slice) {
    return cs.loadInt(32);
}

val flags = readFlags(mutate msgBody);
// msgBody.loadInt(32) will read the next integer
```

It's a generalization. A function may have several mutate parameters:
```tolk
fun incrementXY(mutate x: int, mutate y: int, byValue: int) {
    x += byValue;
    y += byValue;
}

incrementXY(mutate origX, mutate origY, 10);   // both += 10
```

*You may ask — is it just passing by reference? It effectively is, but since "ref" is an overloaded term in TON (cells and slices have refs), the keyword `mutate` was chosen.*

### By default, self in methods is immutable


Methods — unlike global functions `fun f()` — are declared as `fun receiver_type.f()`.
If a method accepts `self`, it's an instance method (if not, it's a static one).
```tolk
fun int.assertNotEq(self, throwIfEq: int) {
    if (self == throwIfEq) {
        throw 100;
    }
}

someN.assertNotEq(10);
10.assertNotEq(10);      // also ok, since self is not mutating
```

`self` by default is immutable. Think of it like a **read-only method**.
```tolk
fun slice.readFlags(self) {
    return self.loadInt(32);  // error, modifying immutable variable
}

fun slice.preloadInt32(self) {
    return self.preloadInt(32);  // ok, it's a read-only method
}
```

Combining `mutate` and `self`, we get mutating methods.

### mutate self is a method, called via dot, mutating an object


As follows:
```tolk
fun slice.readFlags(mutate self) {
    return self.loadInt(32);
}

val flags = msgBody.readFlags(); // pretty obvious

fun int.increment(mutate self) {
    self += 1;
}

var origX = 10;
origX.increment();    // 11
10.increment();       // error, not lvalue

// even this is possible
fun int.incrementWithY(mutate self, mutate y: int, byValue: int) {
    self += byValue;
    y += byValue;
}

origX.incrementWithY(mutate origY, 10);   // both += 10
```

If you look into stdlib, you'll notice that many functions actually **mutate self**, meaning they are methods of modifying an object. Tuples, dictionaries, and so on. In FunC, they were usually called via tilda.
```tolk
@pure
fun tuple.push<X>(mutate self, value: X): void
    asm "TPUSH";

t.push(1);
```

### return self makes a method chainable


It is precisely like `return self` in Python or `return this` in JavaScript. That makes methods like `storeInt()` and others chainable.
```tolk
fun builder.storeInt32(mutate self, x: int): self {
    self.storeInt(x, 32);
    return self;

    // this would also work as expected (the same Fift code)
    // return self.storeInt(x, 32);
}

var b = beginCell().storeInt(1, 32).storeInt32(2).storeInt(3, 32);
b.storeInt32(4);     // works without assignment, since mutates b
b = b.storeInt32(5); // and works with assignment, since also returns
```

Pay attention to the return type, it's `self`. You should specify it; otherwise, the compilation will fail if left empty. Probably, in the future, it will be correct.

### mutate self and asm functions


While it's evident for user-defined functions, one could be interested in how to make an `asm` function with such behavior. To answer this question, we should look under the hood at how mutation works inside the compiler.

When a function has `mutate` parameters, it actually implicitly returns them, and they are implicitly assigned to arguments. It's better by example:
```tolk
// actually returns (int, void)
fun increment(mutate x: int): void { ... }

// actually does: (x', _) = increment(x); x = x'
increment(mutate x);

// actually returns (int, int, (slice, cell))
fun f2(mutate x: int, mutate y: int): (slice, cell) { ... }

// actually does: (x', y', r) = f2(x, y); x = x'; y = y'; someF(r)
someF(f2(mutate x, mutate y));

// when `self`, it's the same
// actually does: (cs', r) = loadInt(cs, 32); cs = cs'; flags = r
flags = cs.loadInt(32);
```

So, an `asm` function should place `self'` onto a stack before its return value:
```tolk
// "TPUSH" pops (tuple) and pushes (tuple')
// so, self' = tuple', and return an empty tensor
// `void` is a synonym for an empty tensor
fun tuple.push<X>(mutate self, value: X): void
    asm "TPUSH";

// "LDU" pops (slice) and pushes (int, slice')
// with asm(-> 1 0), we make it (slice', int)
// so, self' = slice', and return int
fun slice.loadMessageFlags(mutate self): int
    asm(-> 1 0) "4 LDU";
```

Note, that to return self, you don't have to do anything special, just specify a return type. The compiler will do the rest.
```tolk
// "STU" pops (int, builder) and pushes (builder')
// with asm(op self), we put arguments to correct order
// so, self' = builder', and return an empty tensor
// but to make it chainable, `self` instead of `void`
fun builder.storeMessageOp(mutate self, op: int): self
    asm(op self) "32 STU";
```

It's doubtful you'll have to do such tricks. Most likely, you'll write wrappers around existing functions:
```tolk
// just do it like this, without asm; it's the same effective

@inline
fun slice.myLoadMessageFlags(mutate self): int {
    return self.loadUint(4);
}

@inline
fun builder.myStoreMessageOp(mutate self, flags: int): self {
    return self.storeUint(32, flags);
}
```

### Do I need @inline for simple functions/methods?


For now, better do it, yes. In most examples above, `@inline` was omitted for clarity. Without `@inline`, it will be a separate TVM continuation with jumps in/out. With `@inline`, a function will be generated, but inlined by Fift, like the `inline` specifier in FunC.

In the future, Tolk will automatically detect simple functions and perform true inlining on the AST level. Such functions won't be even generated to Fift. The compiler would decide, better than a human, whether to inline, to make a ref, etc. But it will take some time for Tolk to become so smart :)

For now, please specify the `@inline` attribute.

<Feedback />



================================================
FILE: docs/v3/documentation/smart-contracts/tolk/tolk-vs-func/pack-to-from-cells.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/tolk/tolk-vs-func/pack-to-from-cells.md
================================================
---
title: "Auto packing to/from cells"
---

import Feedback from '@site/src/components/Feedback';

# Auto-packing to/from cells/slices/builders

A short demo of how it looks:
```tolk
struct Point {
    x: int8;
    y: int8;
}

var value: Point = { x: 10, y: 20 };

// makes a cell containing "0A14"
var c = value.toCell();   
// back to { x: 10, y: 20 }   
var p = Point.fromCell(c);
```


## Key features of auto-serialization


* Supports all types: unions, tensors, nullables, generics, atomics, ...
* Allows you to specify serialization prefixes (particularly, opcodes)
* Allows you to manage cell references and when to load them
* Lets you control error codes and other behavior
* Unpacks data from a cell or a slice, mutate it or not
* Packs data to a cell or a builder
* Warns if data potentially exceeds 1023 bits
* More efficient than manual serialization



## List of supported types and how they are serialized

A small reminder: Tolk has `intN` types (`int8`, `uint64`, etc.). Of course, they can be nested, like nullable `int32?` or a tensor `(uint5, int128)`. 
They are just integers at the TVM level, they can hold any value at runtime: **overflow only happens at serialization**. 
For example, if you assign 256 to uint8, asm command "8 STU" will fail with code 5 (integer out of range).


| Type                      | TL-B equivalent                          | Serialization notes                 |
|---------------------------|------------------------------------------|-------------------------------------|
| `int8`, `uint55`, etc.    | same as TL-B                             | `N STI` / `N STU`                   |
| `coins`                   | TL-B varint16                            | `STGRAMS`                           |
| `bytes8`, `bits123`, etc. | just N bits                              | runtime check + `STSLICE` (1)       |
| `address`                 | MsgAddress (internal/external/none)      | `STSLICE` (2)                       |
| `bool`                    | one bit                                  | `1 STI`                             |
| `cell`                    | untyped reference, TL-B `^Cell`          | `STREF`                             |
| `cell?`                   | maybe reference, TL-B `(Maybe ^Cell)`    | `STOPTREF`                          |
| `Cell<T>`                 | typed reference, TL-B `^T`               | `STREF`                             |
| `Cell<T>?`                | maybe typed reference, TL-B `(Maybe ^T)` | `STOPTREF`                          |
| `RemainingBitsAndRefs`    | rest of slice                            | `STSLICE`                           |
| `builder`                 | only for writing, not for reading        | `STBR`                              |
| `slice`                   | only for writing, not for reading        | `STSLICE`                           |
| `T?`                      | TL-B `(Maybe T)`                         | `1 STI` + IF ...                    |
| `T1 \| T2`                | TL-B `(Either T1 T2)`                    | `1 STI` + IF ... + ELSE ... (3)     |
| `T1 \| T2 \| ...`         | TL-B multiple constructors               | IF ... + ELSE IF ... + ELSE ... (4) |
| `(T1, T2)`                | TL-B `(Pair T1 T2)` = one by one         | pack T1 + pack T2                   |
| `(T1, T2, ...)`           | nested pairs = one by one                | pack T1 + pack T2 + ...             |
| `SomeStruct`              | fields one by one                        | like a tensor                       |


* (1) By analogy with `intN`, there is are `bytesN` types. It's just a `slice` under the hood: the type shows how to serialize this slice. 
By default, before `STSLICE`, the compiler inserts runtime checks (get bits/refs count + compare with N + compare with 0). 
These checks ensure that serialized binary data will be correct, but they cost gas. 
However, if you guarantee that a slice is valid (for example, it comes from trusted sources), pass an option `skipBitsNFieldsValidation` to disable runtime checks.

* (2) In TVM, all addresses are also plain slices. Type `address` indicates that it's a slice containing *some* valid address (internal/external/none). 
It's packed with `STSLICE` (no runtime checks) and loaded with `LDMSGADDR`. 

Don't confuse `address none` with null! `None` is a valid address (two zero bits), whereas `address?` is `maybe address` (bit "0" OR bit "1" + address).

* (3) TL-B Either is expressed with a union `T1 | T2`. For example, `int32 | int64` is packed as ("0" + 32-bit int OR "1" + 64-bit int). 

However, if T1 and T2 are both structures with manual serialization prefixes, those prefixes are used instead of a 0/1 bit.

* (4) To (un)pack a union, say, `Msg1 | Msg2 | Msg3`, we need serialization prefixes. For structures, you can specify them manually 
(or the compiler will generate them right here). For primitives, like `int32 | int64 | int128 | int256`, the compiler generates a prefix tree 
(00/01/10/11 in this case). Read **auto-generating serialization prefixes** below.



## Some examples of valid types

```tolk
struct A {
    f1: int8;      // just int8
    f2: int8?;     // maybe int8
    f3: address;   // internal/external/none
    f4: bool;      // TRUE (-1) serialized as bit '1'
    f5: B;         // embed fields of struct B
    f6: B?;        // maybe B
    f7: coins;     // used for money amounts

    r1: cell;         // always-existing untyped ref
    r2: Cell<B>;      // typed ref
    r3: Cell<int32>?; // optional ref that stores int32

    u1: int32 | int64;  // Either
    u2: B | C;          // also Either
    u3: B | C | D;      // manual or autogenerated prefixes
    u4: bits4 | bits8?; // autogenerated prefix tree

    // even this works
    e: Point | Cell<Point>;

    // rest of slice
    rest: RemainingBitsAndRefs;  
}
```


## Serialization prefixes and opcodes

Declaring a struct, there is a special syntax to provide pack prefixes. 

Typically, you'll use 32-bit prefixes for messages opcodes, or arbitrary prefixes is case you'd like to express TL-B multiple constructors.


```tolk
struct (0x7362d09c) TransferNotification {
    queryId: uint64;
    ...
}
```

Prefixes **can be of any width**, they are not restricted to be 32 bit.
* `0x000F` — 16-bit prefix
* `0x0F` — 8-bit prefix
* `0b010` — 3-bit prefix
* `0b00001111` — 8-bit prefix


Declaring messages with 32-bit opcodes does not differ from declaring any other structs. Say, you the following TL-B scheme:


```tl-b
asset_simple$001 workchain:int8 ptr:bits32 = Asset;
asset_booking$1000 order_id:uint64 = Asset;
...
```

You can express the same with structures and union types:
```tolk
struct (0b001) AssetSimple {
    workchain: int8;
    ptr: bits32;
}

struct (0b1000) AssetBooking {
    orderId: uint64;
}

type Asset = AssetSimple | AssetBooking | ...;

struct ProvideAssetMessage {
    ...
    asset: Asset;
}
```

When deserializing, `Asset` will follow manually provided prefixes:
```tolk
// msg.asset is parsed as '001' + int8 + bits32 OR ...
val msg = ProvideAssetMessage.fromSlice(s);

// now, msg.asset is just a union
// you can match it
match (msg.asset) {
    AssetSimple => {   // smart cast
        msg.asset.workchain
        msg.asset.ptr
    }
    ...
}
// or test with `is` operator
if (msg.asset is AssetBooking) {
    ...
}
// or do any other things with a union:
// prefixes play their role only in deserialization process
```

When serializing, everything also works as expected:
```tolk
val out: ProvideAssetMessage = {
    ...,
    asset: AssetSimple {   // will be serialized as
        workchain: ...,    // '001' + int8 + bits32
        ptr: ...
    }
}
```

Note that if a struct has a manual pack prefix, it does not matter whether this struct is inside any union or not.
```tolk
struct (0x1234) MyData {
    ...
}

MyData.fromSlice(s)  // expected to be "1234..." (hex)
data.toCell()        // "1234..."
```

That's why, when you declare outgoing messages with 32-bit opcodes and just serialize them, that opcodes are included in binary data.


## What can NOT be serialized

* `int` can't be serialized, it does not define binary width; use `int32`, `uint64`, etc.
* `slice`, for the same reason; use `address` or `bitsN`
* tuples, not implemented
* `A | B` (and `A|B|C|...` in general) if A has manual serialization prefix, B not (because it seems like a bug in your code)
* `int32 | A` (and `primitives|...|structs` in general) if A has manual serialization prefix (because it's not definite what prefixes to use for primitives)

Example of invalid:
```tolk
struct (0xFF) A {}
struct B {}   // forgot prefix

fun invalidDemo(obj: A | B) {
    // (it's better to fire an error than to generate '0'+'FF'+dataA OR '1'+dataB)
    obj.toCell();   // error: A has prefix, B not
}
```


## Error messages if serialization unavailable

If you, by mistake, use unsupported types, Tolk compiler will fire a meaningful error. Example:
```tolk
struct ExtraData {
    owner: address;
    lastTime: int;
}

struct Storage {
    ...
    more: Cell<ExtraData>;
}

Storage.fromSlice("");
```

fires an error:
```
auto-serialization via fromSlice() is not available for type `Storage`
because field `Storage.more` of type `Cell<ExtraData>` can't be serialized
because type `ExtraData` can't be serialized
because field `ExtraData.lastTime` of type `int` can't be serialized
because type `int` is not serializable, it doesn't define binary width
hint: replace `int` with `int32` / `uint64` / `coins` / etc.
```


## Controlling cell references. Typed cells

Tolk gives you full control over how your data is placed in cells and how cells reference each other. 
When you declare fields in a struct, there is no compiler magic of reordering fields, making any implicit references, etc. 
As follows, whenever you need to place data in a ref, you do it manually. As well as you manually control, when contents of that ref is loaded.

There are two types of references: typed and untyped.

```tolk
struct NftCollectionStorage {
    ownerAddress: address;
    nextItemIndex: uint64;
    content: cell;                       // untyped
    nftItemCode: cell;                   // untyped
    royaltyParams: Cell<RoyaltyParams>;  // typed
}

struct RoyaltyParams {
    numerator: uint16;
    denominator: uint16;
    royaltyAddress: address;
}
```

When you call `NftCollectionStorage.fromSlice` (or fromCell), the process is as follows:
1) read address (slice.loadAddress)
2) read uint64 (slice.loadUint 64)
3) read three refs (slice.loadRef); do not unpack them: we just have pointers to cells

Note, that `royaltyParams` is `Cell<T>`, not `T` itself. You can NOT access `numerator`, etc. To load those fields, you should manually unpack that ref:
```tolk
// error: field does not exist in type `Cell<RoyaltyParams>`
st.royaltyParams.numerator

// that's the way
val rp = st.royaltyParams.load();   // Cell<T> -> T
rp.numerator

// alternatively
val rp = RoyaltyParams.fromCell(st.royaltyParams);
```

And vice versa: when composing such a struct, you should assign a typed cell to a field:
```tolk
val st: NftCollectionStorage = {
    ...
    // error
    royaltyParams: RoyaltyParams{ ... }
    // correct
    royaltyParams: RoyaltyParams{ ... }.toCell()
}
```

Probably, you've guessed that `T.toCell()` makes `Cell<T>`, actually. That's true:
```tolk
val c = p.toCell();  // Point to Cell<Point>
val p2 = c.load();   // Cell<Point> to Point
```

With types cells, you can express snake data:
```tolk
struct Snake {
    data: bits1023;
    next: Cell<Snake>?;
}
```

So, typed cells are a powerful mechanism to express the contents of referenced cells. 
Note that `Cell<address>` or even `Cell<int32 | int64>` is also okay, you are not restricted to structures.

When it comes to untyped cells — just `cell` — they also denote references, but don't denote their inner contents, don't have the `.load()` method. 

It's just _some cell_, like code/data of a contract or an untyped nft content.



## Remaining data after reading

Suppose you have struct Point (x int8, y int8), and read from a slice with contents "0102FF". 
Byte "01" for x, byte "02" for y, and the remaining "FF" — is it correct?

**By default, this is incorrect**. By default, functions `fromCell` and `fromSlice` ensure the slice end after reading. 
In this case, exception 9 ("cell underflow") is thrown.

But you can override this behavior with an option:
```tolk
Point.fromSlice(s, {
    assertEndAfterReading: false
})
```


## UnpackOptions and PackOptions

They allow you to control behavior of `fromCell`, `toCell`, and similar functions:
```tolk
MyMsg.fromSlice(s, {
    throwIfOpcodeDoesNotMatch: 0xFFFF
})
```

Serialization functions have the second optional parameter, actually:
```tolk
fun T.fromSlice(rawSlice: slice, options: UnpackOptions = {}): T;
```

When you don't pass it, default options are used. But you can overload some of the options.

For deserialization (`fromCell` and similar), there are now two available options:

| Field of UnpackOptions      | Description                                                                                                                                                                                                                                                                                                 |
|-----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `assertEndAfterReading`     | after finished reading all fields from a cell/slice, call `slice.assertEnd` to ensure no remaining data left; it's the default behavior, it ensures that you've fully described data you're reading with a struct; for struct `Point`, input "0102" is ok, "0102FF" will throw excno 9; **default: true**   |
| `throwIfOpcodeDoesNotMatch` | this excNo is thrown if opcode doesn't match, e.g. for `struct (0x01) A` given input "88..."; similarly, for a union type, this is thrown when none of the opcodes match; **default: 63**                                                                                                                   |

For serialization (`toCell` and similar), there is now one option:

| Field of PackOptions        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `skipBitsNFieldsValidation` | when a struct has a field of type `bits128` and similar (it's a slice under the hood), by default, compiler inserts runtime checks (get bits/refs count + compare with 128 + compare with 0); these checks ensure that serialized binary data will be correct, but they cost gas; however, if you guarantee that a slice is valid (for example, it comes from trusted sources), set this option to true to disable runtime checks; *note: `int32` and other are always validated for overflow without any extra gas, so this flag controls only rarely used `bytesN` / `bitsN` types;* **default: false**  |


## Full list of serialization functions

Each of them can be controlled by `PackOptions` described above.

1) `T.toCell()` — convert anything to a cell. Example:
```tolk
contract.setData(storage.toCell());
```
Internally, a builder is created, all fields are serialized one by one, and a builder is flushed (beginCell() + serialize fields + endCell()).

2) `builder.storeAny<T>(v)` — similar to `builder.storeUint()` and others, but allows storing structures. Example:
```tolk
var b = beginCell()
       .storeUint(32)
       .storeAny(msgBody)  // T=MyMsg here
       .endCell();
```


## Full list of deserialization functions

Each of them can be controlled by `UnpackOptions` described above.

1) `T.fromCell(c)` — parse anything from a cell. Example:
```tolk
var st = MyStorage.fromCell(contract.getData());
```
Internally, a cell is unpacked to a slice, and that slice is parsed (c.beginParse() + read from slice).

2) `T.fromSlice(s)` — parse anything from a slice. Example:
```tolk
var msg = CounterIncrement.fromSlice(cs);
```
All fields are read from a slice immediately. If a slice is corrupted, an exception is thrown (most likely, excode 9 "cell underflow"). Note, that a passed slice is NOT mutated, its internal pointer is NOT shifted. If you need to mutate it, like `cs.loadInt()`, consider calling `cs.loadAny<Increment>()`.

3) `slice.loadAny<T>` — parse anything from a slice, shifting its internal pointer. Similar to `slice.loadUint()` and others, but allows loading structures. Example:
```tolk
var st: MyStorage = cs.loadAny();     // or cs.loadAny<MyStorage>()
cs.loadAny<int32>();                  // = cs.loadInt(32)
```
Similar to `MyStorage.fromSlice(cs)`, but called as a method and mutates the slice. Note: `options.assertEndAfterReading` is ignored by this function, because it's actually intended to read data from the middle.

4) `slice.skipAny<T>` — skip anything in a slice, shifting its internal pointer. Similar to `slice.skipBits()` and others, but allows skipping structures. Example:
```tolk
struct TwoInts { a: int32; b: int32; }
cs.skipAny<TwoInts>();    // skips 64 bits
cs.skipAny<int32>();      // = cs.skipBits(32)
```


## Special type RemainingBitsAndRefs

It's a built-in type to get "all the rest" slice tail on reading. Example:
```tolk
struct JettonMessage {
     // ... some fields
     forwardPayload: RemainingBitsAndRefs;
}
```

When you deserialize JettonMessage, forwardPayload contains _everything left after reading fields above_. Essentially, it's an alias to a slice which is handled specially while unpacking:


```
type RemainingBitsAndRefs = slice;
```


## Auto-generating prefixes for unions


We've mentioned multiple times, that `T1 | T2` is encoded as TL-B Either: bit '0' + T1 OR bit '1' + T2. But what about wider unions? Say,

```tolk
struct WithUnion {
    f: int8 | int16 | int32;
}
```

In this case, **the compiler auto-generates a prefix tree**. This field will be packed as: '00' + int8 OR '01' + int16 OR '10' + int32. 
On deserialization, the same format is expected (prefix '11' will throw an exception).

Same for structs without a manually specified prefix:
```tolk
struct A { ... }    // 0x... prefixes not specified
struct B { ... }
struct C { ... }

struct WithUnion {
    // simple either ('0' + A OR '1' + B)
    e: A | B;
    // auto-generated prefix tree
    f: A | B | C;
    // even this works, why not
    g: A | int32 | C | bits128;
}
```

When declaring a struct, you can manually specify serialization prefix (32-bit prefixes for messages are called opcodes, but prefixes in general can be of any length):
```tolk
struct (0x01) WithPrefixLen8 { ... }
struct (0x00FF) WithPrefixLen16 { ... }
struct (0b1100) WithPrefixLen4 { ... }

struct WithUnion {
    // manual prefixes will be used, not 0/1
    e: WithPrefixLen8 | WithPrefixLen16;
    // also, no auto-generation
    f: WithPrefixLen8 | WithPrefixLen16 | WithPrefixLen4;
}
```

**If you specify prefixes manually, they will be used in (de)serialization**. 
Moreover: since a prefix exists for a struct, when deserializing a struct itself (not inside a union), a prefix is expected to be contained in binary data:
```tolk
// s should be "00FF..."
WithPrefixLen16.fromSlice(s)
// c will be "00FF..."
WithPrefixLen16{...}.toCell()
```

So, the rules are quite simple:
* if you specify prefixes manually, they will be used (no matter within a union or not)
* if you don't specify any prefixes, the compiler auto-generates a prefix tree
* if you specify prefix for A, but forgot prefix for B, `A | B` can't be serialized
* either (0/1) is just a prefix tree for two cases

**How can I specify a serialization prefix for non-struct?** Currently, there is no way to write something like `Prefixed<int32, 0b0011>`. 
But you can just create a struct with a single field:
```tolk
struct (0b0011) MyPrefixedInt {
    value: int32;
}
```
It will have no overhead against just `int32`, the same slot on a stack, just adding a prefix for (de)serialization.


## What if data exceeds 1023 bits

Struct fields are serialized one-by-one. So, if you have a large structure, its content may not fit into a cell. 
Tolk compiler calculates the maximum size of every serialized struct, and if it potentially exceeds 1023 bits, fires an error. Your choice is
1) either to suppress the error by placing an annotation above a struct; it means "okay, I understand"
2) or repack your data by splitting into multiple cells

Why do we say "potentially"? Because for many types, their size can vary:
* `int8?` is either one or nine bits
* `coins` is variadic: from 4 bits (small values) up to 124 bits
* `address` is internal (267 bits), or external (up to 521 bits), or none (2 bits); but since external addresses are very rare, estimation is "from 2 to 267 bits"

So, suppose you have:
```tolk
struct MoneyInfo {
    fixed: bits800;
    wallet1: coins;
    wallet2: coins;
}
```

When you try to (de)serialize it, the compiler calculates its size, and prints an error:
```
struct `MoneyInfo` can exceed 1023 bits in serialization (estimated size: 808..1048 bits)
... (and some instructions, what you should do)
```

Actually, you have two choices:

1) you definitely know, that `coins` fields will be relatively small, and this struct will 100% fit in reality; then, suppress the error using an annotation:
```tolk
@overflow1023_policy("suppress")
struct MoneyInfo {
    ...
}
```

2) or you really expect billions of billions in `coins`, so data really can exceed; in this case, you should extract some fields into a separate cell; for example, store 800 bits as a ref; or extract other 2 fields and ref them:
```tolk
// you can extract the first field
struct MoneyInfo {
    fixed: Cell<bits800>;
    wallet1: coins;
    wallet2: coins;
}

// or extract other 2 fields
struct WalletsBalances {
    wallet1: coins;
    wallet2: coins;
}
struct MoneyInfo {
    fixed: bits800;
    balances: Cell<WalletsBalances>;
}
```

Generally, you leave more frequently used fields directly and place less-frequent fields to another ref. 
All in all, the compiler indicates on potential cell overflow, and it's your choice how to overcome this.

Probably, in the future, there will be more policies (besides "suppress") — for example, to auto-repack fields. For now, it's absolutely straightforward.


## Write builder, read slice

Since Tolk remains low-level whenever you need, it allows doing tricky things. Suppose you manually create an address from bits:
```tolk
var addrB = beginCell()
           .storeUint(0b01)   // addr_extern
           ...;
```
And you want to use this `addrB` (it's `builder`! not `address`) to write into a storage:
```tolk
struct MyStorage {
    ...
    addr: address;
}

var st: MyStorage;
st.addr = addrB;   // error, can not assign `builder` to `address`
```
Of course, you can do `addrB.endCell().beginParse() as address`, but creating a cell is expensive. How can you write `addrB` directly?

The solution is: if you want `builder` for writing, and `address` for reading... Do exactly what you want!
```tolk
struct MyStorageData<T> {
    ...
    addr: T;
}

type MyStorage = MyStorageData<address>;
type MyStorageForWrite = MyStorageData<builder>;
```

The same technique can be combined with `RemainingBitsAndRefs` and some more cases. 
Moreover, for performance optimizations, you can create different "views" over the same data. Don't underestimate generics and the type system in general.


### Integration with message sending and receiving

Tolk v0.13 doesn't provide any helpers for composing and sending messages. It's the task for future releases.

So, for now, you can declare outgoing messages with structures, but you still manually create a message cell. 
Thanks to `builder.storeAny`, you can prepare message body and write it automatically:
```tolk
struct (0x...) SomeOutgoingMessage {
    ...
}

val outBody: SomeOutgoingMessage = { 
    ... 
};

// the same as you do now
val out = beginCell()
         .storeUint(0x18, 6)    // bounceable
         ...                    // all the header
         // but auto-serialize body (inline)
         .storeAny(outBody)
         // or — embed body as a ref
         .storeRef(outBody.toCell());

// same as before, but with auto-serialized body
sendRawMessage(out.endCell(), mode);
```


<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/tolk/tolk-vs-func/stdlib.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/tolk/tolk-vs-func/stdlib.md
================================================
import Feedback from '@site/src/components/Feedback';

# Tolk vs FunC: standard library

FunC has a rich [standard library](/v3/documentation/smart-contracts/func/docs/stdlib),
known as *"stdlib.fc"* file. It's quite low-level and contains many `asm` functions
closely related to [TVM instructions](/v3/documentation/tvm/instructions/).

Tolk also has a standard library based on a FunC one. Three main differences:
1. It's split into multiple files: `common.tolk`, `tvm-dicts.tolk`, and others. Functions from `common.tolk` are always available. Functions from other files are available after import:
```tolk
import "@stdlib/tvm-dicts"

beginCell()          // available always
createEmptyDict()    // available due to import
```
2. You don't need to download it from GitHub; it's a part of Tolk distribution. 
3. Tolk has functions and methods (called via dot), lots of global FunC functions became methods of builder/slice/etc. (and can't be called as functions)


## Functions vs methods

In FunC, there are no methods, actually. All functions are global-scoped.  
You just call any function via dot:
```func
;; FunC
cell config_param(int x) asm "CONFIGOPTPARAM";

config_param(16);   ;; ok
16.config_param();  ;; also ok...
```

So, when you call `b.end_cell()`, you actually call a global function `end_cell`. 
Since all functions are global-scoped, there are no "short methods."
```func
someTuple.tuple_size();
;; why not someTuple.size()? because it's a global function:
;; int tuple_size(tuple t)
```

**Tolk separates functions and methods** like it's done in most languages:
1) functions can NOT be called via dot, only methods can
2) methods can have short names, they don't conflict

```tolk
// FunC
someCell.cell_hash();     // or cell_hash(someCell)
someSlice.slice_hash();

// Tolk
someCell.hash();          // the only possible
someSlice.hash();
```


## A list of renamed functions

If the **Required import** column is empty, a function is available without imports.

Note that some functions were deleted because they either can be expressed syntactically,
or they were very uncommon in practice.

The table is "sorted" in a way how functions are declared in stdlib.fc:

| FunC name                         | Tolk name                          | Required import |
|-----------------------------------|------------------------------------|-----------------|
| empty_tuple                       | createEmptyTuple                   |                 |
| t~tpush                           | t.push(v)                          |                 |
| first(t) or dot t.first()         | t.first()                          |                 |
| at(t,i) or dot t.at(i)            | t.get(i) or just t.0 etc.          |                 |
| touch(v) or dot                   | v.stackMoveToTop()                 | tvm-lowlevel    |
| impure_touch                      | *(deleted)*                        |                 |
| single                            | *(deleted)*                        |                 | 
| unsingle                          | *(deleted)*                        |                 | 
| pair                              | *(deleted)*                        |                 | 
| unpair                            | *(deleted)*                        |                 | 
| triple                            | *(deleted)*                        |                 | 
| untriple                          | *(deleted)*                        |                 | 
| tuple4                            | *(deleted)*                        |                 | 
| untuple4                          | *(deleted)*                        |                 | 
| second                            | *(deleted)*                        |                 | 
| third                             | *(deleted)*                        |                 | 
| fourth                            | *(deleted)*                        |                 | 
| pair_first                        | *(deleted)*                        |                 | 
| pair_second                       | *(deleted)*                        |                 | 
| triple_first                      | *(deleted)*                        |                 | 
| triple_second                     | *(deleted)*                        |                 | 
| triple_third                      | *(deleted)*                        |                 | 
| minmax                            | minMax                             |                 |
| now                               | blockchain.now                     |                 |
| my_address                        | contract.getAddress                |                 |
| get_balance + pair_first          | contract.getOriginalBalance        |                 |
| cur_lt                            | blockchain.logicalTime             |                 |
| block_lt                          | blockchain.currentBlockLogicalTime |                 |
| cell_hash(c) or dot               | c.hash()                           |                 |
| slice_hash(s) or dot              | s.hash()                           |                 |
| string_hash(s) or dot             | s.bitsHash()                       |                 |
| check_signature                   | isSignatureValid                   |                 |
| check_data_signature              | isSliceSignatureValid              |                 |
| compute_data_size(c) or dot       | c.calculateSizeStrict()            |                 |
| slice_compute_data_size(s) or dot | s.calculateSizeStrict()            |                 |
| c.compute_data_size?() or dot     | c.calculateSize()                  |                 |
| slice_compute_data_size?() or dot | s.calculateSize()                  |                 |
| ~dump                             | debug.print                        |                 |
| ~strdump                          | debug.printString                  |                 |
| dump_stack                        | debug.dumpStack                    |                 |
| get_data                          | contract.getData                   |                 |
| set_data                          | contract.setData                   |                 |
| get_c3                            | getTvmRegisterC3                   | tvm-lowlevel    |
| set_c3                            | setTvmRegisterC3                   | tvm-lowlevel    |
| bless                             | transformSliceToContinuation       | tvm-lowlevel    |
| accept_message                    | acceptExternalMessage              |                 |
| set_gas_limit                     | setGasLimit                        |                 |
| buy_gas                           | *(deleted)*                        |                 |
| commit                            | commitContractDataAndActions       |                 |
| divmod                            | divMod                             |                 |
| moddiv                            | modDiv                             |                 |
| muldiv                            | mulDivFloor                        |                 |
| muldivr                           | mulDivRound                        |                 |
| muldivc                           | mulDivCeil                         |                 |
| muldivmod                         | mulDivMod                          |                 |
| begin_parse                       | beginParse                         |                 |
| end_parse(s) or dot               | s.assertEnd()                      |                 |
| load_ref                          | loadRef                            |                 |
| preload_ref                       | preloadRef                         |                 |
| load_int                          | loadInt                            |                 |
| load_uint                         | loadUint                           |                 |
| preload_int                       | preloadInt                         |                 |
| preload_uint                      | preloadUint                        |                 |
| load_bits                         | loadBits                           |                 |
| preload_bits                      | preloadBits                        |                 |
| load_grams                        | loadCoins                          |                 |
| load_coins                        | loadCoins                          |                 |
| skip_bits                         | s.skipBits                         |                 |
| first_bits                        | getFirstBits                       |                 |
| skip_last_bits                    | removeLastBits                     |                 |
| slice_last                        | getLastBits                        |                 |
| load_dict                         | loadDict                           |                 |
| preload_dict                      | preloadDict                        |                 |
| skip_dict                         | skipDict                           |                 |
| load_maybe_ref                    | loadMaybeRef                       |                 |
| preload_maybe_ref                 | preloadMaybeRef                    |                 |
| cell_depth(c) or dot              | c.depth()                          |                 |
| slice_refs(s) or dot              | s.remainingRefsCount()             |                 |
| slice_bits(s) or dot              | s.remainingBitsCount()             |                 |
| slice_bits_refs(s) or dot         | s.remainingBitsAndRefsCount()      |                 |
| slice_empty?(s) or dot            | s.isEnd()                          |                 |
| slice_data_empty?(s) or dot       | s.isEndOfBits()                    |                 |
| slice_refs_empty?(s) or dot       | s.isEndOfRefs()                    |                 |
| slice_depth(s) or dot             | s.depth()                          |                 |
| equal_slice_bits(a,b) or dot      | a.bitsEqual(b)                     |                 |
| builder_refs(b) or dot            | b.refsCount()                      |                 |
| builder_bits(b) or dot            | b.bitsCount()                      |                 |
| builder_depth(b) or dot           | b.depth()                          |                 |
| begin_cell                        | beginCell                          |                 |
| end_cell                          | endCell                            |                 |
| store_ref                         | storeRef                           |                 |
| store_uint                        | storeUint                          |                 |
| store_int                         | storeInt                           |                 |
| store_slice                       | storeSlice                         |                 |
| store_grams                       | storeCoins                         |                 |
| store_coins                       | storeCoins                         |                 |
| store_dict                        | storeDict                          |                 |
| store_maybe_ref                   | storeMaybeRef                      |                 |
| store_builder                     | storeBuilder                       |                 |
| load_msg_addr                     | loadAddress                        |                 |
| parse_addr                        | *(deleted)*                        |                 |
| parse_std_addr                    | parseStandardAddress               |                 |
| parse_var_addr                    | *(deleted)*                        |                 |
| config_param                      | blockchain.configParam             |                 |
| raw_reserve                       | reserveToncoinsOnBalance           |                 |
| raw_reserve_extra                 | reserveExtraCurrenciesOnBalance    |                 |
| send_raw_message                  | sendRawMessage                     |                 |
| set_code                          | contract.setCodePostponed          |                 |
| random                            | random.uint256                     |                 |
| rand                              | random.range                       |                 |
| get_seed                          | random.getSeed                     |                 |
| set_seed                          | random.setSeed                     |                 |
| randomize                         | random.initializeBy                |                 |
| randomize_lt                      | random.initialize                  |                 |
| dump                              | debug.print                        |                 |
| strdump                           | debug.printString                  |                 |
| dump_stk                          | debug.dumpStack                    |                 |
| empty_list                        | createEmptyList                    | lisp-lists      |
| cons                              | listPrepend                        | lisp-lists      |
| uncons                            | listSplit                          | lisp-lists      |
| list_next                         | listNext                           | lisp-lists      |
| car                               | listGetHead                        | lisp-lists      |
| cdr                               | listGetTail                        | lisp-lists      |
| new_dict                          | createEmptyDict                    | tvm-dicts       |
| dict_empty?(d) or dot             | d.dictIsEmpty                      | tvm-dicts       |
| idict_set_ref                     | iDictSetRef                        | tvm-dicts       |
| udict_set_ref                     | uDictSetRef                        | tvm-dicts       |
| idict_get_ref                     | iDictGetRefOrNull                  | tvm-dicts       |
| idict_get_ref?                    | iDictGetRef                        | tvm-dicts       |
| udict_get_ref?                    | uDictGetRef                        | tvm-dicts       |
| idict_set_get_ref                 | iDictSetAndGetRefOrNull            | tvm-dicts       |
| udict_set_get_ref                 | iDictSetAndGetRefOrNull            | tvm-dicts       |
| idict_delete?                     | iDictDelete                        | tvm-dicts       |
| udict_delete?                     | uDictDelete                        | tvm-dicts       |
| idict_get?                        | iDictGet                           | tvm-dicts       |
| udict_get?                        | uDictGet                           | tvm-dicts       |
| idict_delete_get?                 | iDictDeleteAndGet                  | tvm-dicts       |
| udict_delete_get?                 | uDictDeleteAndGet                  | tvm-dicts       |
| udict_set                         | uDictSet                           | tvm-dicts       |
| idict_set                         | iDictSet                           | tvm-dicts       |
| dict_set                          | sDictSet                           | tvm-dicts       |
| udict_add?                        | uDictSetIfNotExists                | tvm-dicts       |
| udict_replace?                    | uDictSetIfExists                   | tvm-dicts       |
| idict_add?                        | iDictSetIfNotExists                | tvm-dicts       |
| idict_replace?                    | iDictSetIfExists                   | tvm-dicts       |
| udict_set_builder                 | uDictSetBuilder                    | tvm-dicts       |
| idict_set_builder                 | iDictSetBuilder                    | tvm-dicts       |
| dict_set_builder                  | sDictSetBuilder                    | tvm-dicts       |
| udict_add_builder?                | uDictSetBuilderIfNotExists         | tvm-dicts       |
| udict_replace_builder?            | uDictSetBuilderIfExists            | tvm-dicts       |
| idict_add_builder?                | iDictSetBuilderIfNotExists         | tvm-dicts       |
| idict_replace_builder?            | iDictSetBuilderIfExists            | tvm-dicts       |
| udict_delete_get_min              | uDictDeleteFirstAndGet             | tvm-dicts       |
| idict_delete_get_min              | iDictDeleteFirstAndGet             | tvm-dicts       |
| dict_delete_get_min               | sDictDeleteFirstAndGet             | tvm-dicts       |
| udict_delete_get_max              | uDictDeleteLastAndGet              | tvm-dicts       |
| idict_delete_get_max              | iDictDeleteLastAndGet              | tvm-dicts       |
| dict_delete_get_max               | sDictDeleteLastAndGet              | tvm-dicts       |
| udict_get_min?                    | uDictGetFirst                      | tvm-dicts       |
| udict_get_max?                    | uDictGetLast                       | tvm-dicts       |
| udict_get_min_ref?                | uDictGetFirstAsRef                 | tvm-dicts       |
| udict_get_max_ref?                | uDictGetLastAsRef                  | tvm-dicts       |
| idict_get_min?                    | iDictGetFirst                      | tvm-dicts       |
| idict_get_max?                    | iDictGetLast                       | tvm-dicts       |
| idict_get_min_ref?                | iDictGetFirstAsRef                 | tvm-dicts       |
| idict_get_max_ref?                | iDictGetLastAsRef                  | tvm-dicts       |
| udict_get_next?                   | uDictGetNext                       | tvm-dicts       |
| udict_get_nexteq?                 | uDictGetNextOrEqual                | tvm-dicts       |
| udict_get_prev?                   | uDictGetPrev                       | tvm-dicts       |
| udict_get_preveq?                 | uDictGetPrevOrEqual                | tvm-dicts       |
| idict_get_next?                   | iDictGetNext                       | tvm-dicts       |
| idict_get_nexteq?                 | iDictGetNextOrEqual                | tvm-dicts       |
| idict_get_prev?                   | iDictGetPrev                       | tvm-dicts       |
| idict_get_preveq?                 | iDictGetPrevOrEqual                | tvm-dicts       |
| udict::delete_get_min             | uDictDeleteFirstAndGet             | tvm-dicts       |
| idict::delete_get_min             | iDictDeleteFirstAndGet             | tvm-dicts       |
| dict::delete_get_min              | sDictDeleteFirstAndGet             | tvm-dicts       |
| udict::delete_get_max             | uDictDeleteLastAndGet              | tvm-dicts       |
| idict::delete_get_max             | iDictDeleteLastAndGet              | tvm-dicts       |
| dict::delete_get_max              | sDictDeleteLastAndGet              | tvm-dicts       |
| pfxdict_get?                      | prefixDictGet                      | tvm-dicts       |
| pfxdict_set?                      | prefixDictSet                      | tvm-dicts       |
| pfxdict_delete?                   | prefixDictDelete                   | tvm-dicts       |


## A list of added functions

Tolk standard library has some functions missing in FunC but is pretty typical for everyday tasks.

Since Tolk is actively developed, and its standard library changes, it better considers the `tolk-stdlib/` folder
in sources [here](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont/tolk-stdlib).
Besides functions, there some constants were added: `SEND_MODE_*`, `RESERVE_MODE_*`, etc.

When FunC becomes deprecated, the documentation about Tolk stdlib will be rewritten entirely, anyway.

Remember that all the functions above are wrappers over the TVM assembler. If something is missing,
you can quickly wrap any TVM instruction yourself.


## Some functions became mutating, not returning a copy

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'int flags = cs~load_uint(32);'}</code></td>
    <td><code>{'var flags = cs.loadUint(32);'}</code></td>
  </tr>
  <tr>
    <td><code>{'dict~udict_set(...);'}</code></td>
    <td><code>{'dict.uDictSet(...);'}</code></td>
  </tr>
  <tr>
    <td>...</td>
    <td>...</td>
  </tr>
  </tbody>
</table>

Most FunC functions used with `~` tilda in practice now mutate the object; see examples above.

For example, if you used `dict~udict_set(…)`, just use `dict.uDictSet(…)`, and everything is fine. 
But if you used `dict.udict_set(…)` to obtain a copy, you'll need to express it another way.

[Read about mutability](/v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability).


## How does embedded stdlib work under the hood?

As told above, all standard functions are available out of the box. 
You need `import` for non-common functions (it's intentional), but still, no external downloads.

It works the following way.

The first thing the Tolk compiler does at the start is locate the stdlib folder by searching predefined paths relative to an executable binary. 
For example, if you launch the Tolk compiler from a package installed (e.g. `/usr/bin/tolk`), locate stdlib in `/usr/share/ton/smartcont`. 
You may pass the `TOLK_STDLIB` env variable if you have a non-standard installation. It's standard practice for compilers.

A WASM wrapper [tolk-js](https://github.com/ton-blockchain/tolk-js) also contains stdlib. 
So, when you take tolk-js or blueprint, all stdlib functions are still available out of the box.

JetBrains and VS Code IDE plugins also auto-locate stdlib to provide auto-completion. 
If you use blueprint, it automatically installs tolk-js; therefore, folder `node_modules/@ton/tolk-js/` exists in your project file structure.
Inside are `common.tolk`, `tvm-dicts.tolk`, and others. 

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/transaction-fees/accept-message-effects.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/transaction-fees/accept-message-effects.md
================================================
import Feedback from '@site/src/components/Feedback';

# Accept message effects

The `accept_message` and `set_gas_limit` TVM primitives play a crucial role in managing gas limits and transaction processing in TON smart contracts. While their basic functionality is documented in the [stdlib reference](/v3/documentation/smart-contracts/func/docs/stdlib#accept_message), their effects on transaction processing, gas limits, and contract balances can be complex and have important security implications. This page explores these effects in detail, particularly focusing on how they impact external and internal message processing.

## External messages

External messages follow this processing flow:
- The `gas_limit` is initially set to `gas_credit` [Param20/Param21](/v3/documentation/network/configs/blockchain-configs#param-20-and-21), which equals 10k gas units.
- During credit spending, a contract must call `accept_message` to `set_gas_limit`, indicating its readiness to pay processing fees.
- If `gas_credit` is depleted or computation completes without `accept_message`, the message is discarded (as if it never existed).
- Otherwise, a new gas limit is set to either:
  - `contract_balance/gas_price` (with `accept_message`)
  - A custom value (with `set_gas_limit`).
- After transaction completion, full computation fees are deducted from the contract balance (making `gas_credit` truly a credit, not free gas).


If an error occurs after `accept_message` (in either Compute or Action phase):
- The transaction is recorded on the blockchain
- Fees are deducted from the contract balance
- Storage remains unchanged
- Actions are not applied

**Critical security consideration**

If a contract accepts an external message and then throws an exception (due to invalid message data or serialization errors), it:
- Pays for processing
- Cannot prevent message replay
- Will continue accepting the same message until its balance is depleted

## Internal message 

When a contract receives an internal message from another contract:
- Default gas limit: `message_value`/`gas_price` (message covers its own processing)
- The contract can modify this limit using `accept_message`/`set_gas_limit`

Note that manual settings of gas limits do not interfere with bouncing behavior; messages will be bounced if sent in bounceable mode and contain enough money to pay for their processing and the creation of bounce messages.

:::info example
**Case 1:**
If you send a bounceable message with 0.1 TON in the basechain that is accepted by a contract with a 1 TON balance, and the computation costs 0.005 TON, with a message fee of 0.001 TON, then the bounce message will contain `0.1 - 0.005 - 0.001` = `0.094` TON.

**Case 2:**
If in the same example, the computation cost is 0.5 (instead of 0.005), there will be no bounce (the message balance would be `0.1 - 0.5 - 0.001 = -0.401`, thus no bounce), and the contract balance will be `1 + 0.1 - 0.5` = `0.6` TON.
:::

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/transaction-fees/fees-low-level.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/transaction-fees/fees-low-level.md
================================================
import Feedback from '@site/src/components/Feedback';

# Low-level fees overview

:::caution
This section describes instructions and manuals for interacting with TON at a low level.
Here you will find the **raw formulas** for calculating commissions and fees on TON.
However, most of them are **already implemented through opcodes**!
So, you **use them instead of manual calculations**.
:::

This document provides a general idea of transaction fees on TON and particularly computation fees for the FunC code. There is also a [detailed specification in the TVM whitepaper](https://ton.org/tvm.pdf).

## Transactions and phases

As was described in the [TVM overview](/v3/documentation/tvm/tvm-overview), transaction execution consists of a few phases. During those phases, the corresponding fees may be deducted. There is a [high-level fees overview](/v3/documentation/smart-contracts/transaction-fees/fees).

## Storage fee

TON validators collect storage fees from smart contracts.

Storage fees are collected from the smart contract `balance` at the **Storage phase** of **any** transaction due to storage payments for the account state (including smart-contract code and data, if present) up to the present time. Even if a contract receives 1 nanoton, it will pay all the debt since the last payment. The smart contract may be frozen as a result. **Only unique hash cells are counted for storage and forward fees i.e. 3 identical hash cells are counted as one**. In particular, it [deduplicates](/v3/documentation/data-formats/tlb/library-cells) data: if there are several equivalent sub-cells referenced in different branches, their content is only stored once.

It's important to keep in mind that on TON you pay for both the execution of a smart contract and for the **used storage** (check [@thedailyton article](https://telegra.ph/Commissions-on-TON-07-22)), `storage_fee` depends on your contract size: number of cells and sum of bits from that cells. It means you have to pay a storage fee for having TON Wallet (even if it's very-very small).

If you have not used your TON Wallet for a significant period of time (1 year), _you will have to pay a significantly larger commission than usual because the wallet pays commission on sending and receiving transactions_.

:::info **Note**:
When a message is bounced from the contract, the contract will pay its current `storage_fee`
:::

### Formula

You can approximately calculate storage fees for smart contracts using this formula:

```cpp
storage_fee = ceil(
                  (account.bits * bit_price
                  + account.cells * cell_price)
               * time_delta / 2 ^ 16)

```

Let's examine each value more closely:

- `storage_fee` — price for storage for `time_delta` seconds
- `account.cells` — count of cells used by smart contract
- `account.bits` — count of bits used by smart contract
- `cell_price` — price of single cell
- `bit_price` — price of single bit

Both `cell_price` and `bit_price` could be obtained from Network Config [param 18](/v3/documentation/network/configs/blockchain-configs#param-18).

Current values are:

- Workchain.
  ```cpp
  bit_price_ps:1
  cell_price_ps:500
  ```
- Masterchain.
  ```cpp
  mc_bit_price_ps:1000
  mc_cell_price_ps:500000
  ```

### Calculator example

You can use this JS script to calculate storage price for 1 MB in the workchain for 1 year

```js live
// Welcome to LIVE editor!
// feel free to change any variables
// Source code uses RoundUp for the fee amount, so does the calculator

function storageFeeCalculator() {
  const size = 1024 * 1024 * 8; // 1MB in bits
  const duration = 60 * 60 * 24 * 365; // 1 Year in secs

  const bit_price_ps = 1;
  const cell_price_ps = 500;

  const pricePerSec =
    size * bit_price_ps + +Math.ceil(size / 1023) * cell_price_ps;

  let fee = Math.ceil((pricePerSec * duration) / 2 ** 16) * 10 ** -9;
  let mb = (size / 1024 / 1024 / 8).toFixed(2);
  let days = Math.floor(duration / (3600 * 24));

  let str = `Storage Fee: ${fee} TON (${mb} MB for ${days} days)`;

  return str;
}
```

## Computation fees

### Gas

All computation costs are nominated in gas units. The price of gas units is determined by this [chain config](/v3/documentation/network/configs/blockchain-configs#param-20-and-21) (Config 20 for masterchain and Config 21 for basechain) and may be changed only by consensus of validators. Note that unlike in other systems, the user cannot set his own gas price, and there is no fee market.

Current settings in basechain are as follows: 1 unit of gas costs 400 nanotons.

### TVM instructions cost

On the lowest level (TVM instruction execution) the gas price for most primitives
equals the _basic gas price_, computed as `P_b := 10 + b + 5r`,
where `b` is the instruction length in bits and `r` is the
number of cell references included in the instruction.

Apart from those basic fees, the following fees appear:

| Instruction             | GAS price | Description                                                                                                                                                                                   |
| ----------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Creation of cell        | **500**   | Operation of transforming builder to cell.                                                                                                                                                    |
| Parsing cell firstly    | **100**   | Operation of transforming cells into slices first time during current transaction.                                                                                                            |
| Parsing cell repeatedly | **25**    | Operation of transforming cells into slices, which already has parsed during same transaction.                                                                                                |
| Throwing exception      | **50**    |                                                                                                                                                                                               |
| Operation with tuple    | **1**     | This price will multiply by the quantity of tuple's elements.                                                                                                                                 |
| Implicit Jump           | **10**    | It is paid when all instructions in the current continuation cell are executed. However, there are references in that continuation cell, and the execution flow jumps to the first reference. |
| Implicit Back Jump      | **5**     | It is paid when all instructions in the current continuation are executed and execution flow jumps back to the continuation from which the just finished continuation was called.             |
| Moving stack elements   | **1**     | Price for moving stack elements between continuations. It will charge correspond gas price for every element. However, the first 32 elements moving is free.                                  |

### FunC constructions gas fees

Almost all FunC functions used in this article are defined in [stablecoin stdlib.fc contract](https://github.com/ton-blockchain/stablecoin-contract) (actually, stdlib.fc with new opcodes is currently **under development** and **not yet presented on the mainnet repos**, but you can use `stdlib.fc` from [stablecoin](https://github.com/ton-blockchain/ton) source code as reference) which maps FunC functions to Fift assembler instructions. In turn, Fift assembler instructions are mapped to bit-sequence instructions in [asm.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/fift/lib/Asm.fif). So if you want to understand how much exactly the instruction call will cost you, you need to find `asm` representation in `stdlib.fc`, then find bit-sequence in `asm.fif` and calculate instruction length in bits.

However, generally, fees related to bit-lengths are minor in comparison with fees related to cell parsing and creation, as well as jumps and just number of executed instructions.

So, if you try to optimize your code start with architecture optimization, the decreasing number of cell parsing/creation operations, and then with the decreasing number of jumps.

### Operations with cells

Just an example of how proper cell work may substantially decrease gas costs.

Let's imagine that you want to add some encoded payload to the outgoing message. Straightforward implementation will be as follows:

```cpp
slice payload_encoding(int a, int b, int c) {
  return
    begin_cell().store_uint(a,8)
                .store_uint(b,8)
                .store_uint(c,8)
    .end_cell().begin_parse();
}

() send_message(slice destination) impure {
  slice payload = payload_encoding(1, 7, 12);
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(destination)
    .store_coins(0)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(0x33bbff77, 32) ;; op-code (see smart-contract guidelines)
    .store_uint(cur_lt(), 64)  ;; query_id (see smart-contract guidelines)
    .store_slice(payload)
  .end_cell();
  send_raw_message(msg, 64);
}
```

What is the problem with this code? `payload_encoding` to generate a slice bit-string, first create a cell via `end_cell()` (+500 gas units). Then parse it `begin_parse()` (+100 gas units). The same code can be written without those unnecessary operations by changing some commonly used types:

```cpp
;; we add asm for function which stores one builder to the another, which is absent from stdlib
builder store_builder(builder to, builder what) asm(what to) "STB";

builder payload_encoding(int a, int b, int c) {
  return
    begin_cell().store_uint(a,8)
                .store_uint(b,8)
                .store_uint(c,8);
}

() send_message(slice destination) impure {
  builder payload = payload_encoding(1, 7, 12);
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(destination)
    .store_coins(0)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(0x33bbff77, 32) ;; op-code (see smart-contract guidelines)
    .store_uint(cur_lt(), 64)  ;; query_id (see smart-contract guidelines)
    .store_builder(payload)
  .end_cell();
  send_raw_message(msg, 64);
}
```

By passing bit-string in the another form (builder instead of slice) we substantially decrease computation cost by very slight change in code.

### Inline and inline_refs

By default, when you have a FunC function, it gets its own `id`, stored in a separate leaf of id->function dictionary, and when you call it somewhere in the program, a search of the function in dictionary and subsequent jump occur. Such behavior is justified if your function is called from many places in the code and thus jumps allow to decrease the code size (by storing a function body once). However, if the function is only used once or twice, it is often much cheaper to declare this function as `inline` or `inline_ref`. `inline` modificator places the body of the function right into the code of the parent function, while `inline_ref` places the function code into the reference (jumping to the reference is still much cheaper than searching and jumping to the dictionary entry).

### Dictionaries

Dictionaries on TON are introduced as trees (DAGs to be precise) of cells. That means that if you search, read, or write to the dictionary, you need to parse all cells of the corresponding branch of the tree. That means that

- a) dicts operations are not fixed in gas costs (since the size and number of nodes in the branch depend on the given dictionary and key)
- b) it is expedient to optimize dict usage by using special instructions like `replace` instead of `delete` and `add`
- c) developer should be aware of iteration operations (like next and prev) as well `min_key`/`max_key` operations to avoid unnecessary iteration through the whole dict

### Stack operations

Note that FunC manipulates stack entries under the hood. That means that the code:

```cpp
(int a, int b, int c) = some_f();
return (c, b, a);
```

will be translated into a few instructions which changes the order of elements on the stack.

When the number of stack entries is substantial (10+), and they are actively used in different orders, stack operations fees may become non-negligible.

## Forward fees

Internal messages define an `ihr_fee` in Toncoins, which is subtracted from the value attached to the message and awarded to the validators of the destination shardchain if they include the message through the IHR mechanism. The `fwd_fee` is the original total forwarding fee paid for using the HR mechanism; it is automatically computed from the [24 and 25 configuration parameters](/v3/documentation/network/configs/blockchain-configs#param-24-and-25) and the size of the message at the time the message is generated. Note that the total value carried by a newly created internal outbound message equals the sum of the value, `ihr_fee`, and `fwd_fee`. This sum is deducted from the balance of the source account. Of these components, only the `ihr_fee` value is credited to the destination account upon message delivery. The `fwd_fee` is collected by the validators on the HR path from the source to the destination, and the `ihr_fee` is either collected by the validators of the destination shardchain (if the message is delivered via IHR) or credited to the destination account.

### IHR

:::info What is IHR?
[**Instant Hypercube Routing (IHR)**](/v3/documentation/smart-contracts/shards/infinity-sharding-paradigm#messages-and-instant-hypercube-routing-instant-hypercube-routing) is an alternative mechanism for message delivery without intermediate hops between shards. To understand why IHR is not currently relevant:

- **IHR is not implemented** and is not yet fully specified
- **IHR would only be relevant** when the network has more than 16 shards and not all shards are neighbors to each other
- **Current network settings forbid splitting deeper than 16 shards**, which means IHR is not relevant in any practical sense

In the current TON network configuration, all message routing uses standard **Hypercube Routing (HR)**, which can handle message delivery efficiently with the current shard topology. The `ihr_fee` field exists in the message structure for future compatibility, but serves no functional purpose today. 

If you set the `ihr_fee` to a non-zero value, it will always be added to the message value upon receipt. For now, there are no practical reasons to do this.
:::

### Formula

```cpp
// In_msg and Ext_msg are using the same method of calculation
// It is called import_fee or in_fwd_fee for the Ext_msg
// https://github.com/ton-blockchain/ton/blob/7151ff26279fef6dcfa1f47fc0c5b63677ae2458/crypto/block/transaction.cpp#L2071-L2090

// bits in the root cell of a message are not included in msg.bits (lump_price pays for them)
msg_fwd_fees = (lump_price
             + ceil(
                (bit_price * msg.bits + cell_price * msg.cells) / 2^16)
             );

ihr_fwd_fees = ceil((msg_fwd_fees * ihr_price_factor) / 2^16);

total_fwd_fees = msg_fwd_fees + ihr_fwd_fees; // ihr_fwd_fees - is 0 for external messages
```

:::info IMPORTANT
Please note that `msg_fwd_fees` above includes `action_fee` below. For a basic message this fee = lump_price = 400000 nanotons, action_fee = (400000 \* 21845) / 65536 = 133331. Or approximately a third of the `msg_fwd_fees`.

`fwd_fee` = `msg_fwd_fees` - `action_fee` = 266669 nanotons = 0,000266669 TON
:::

## Action fee

The action fee is deducted from the balance of the source account during the processing of the action list, which occurs after the Computing phase. Practically, the only action for which you pay an action fee is `SENDRAWMSG`. Other actions, such as `RAWRESERVE` or `SETCODE`, do not incur any fee during the action phase.

```cpp
action_fee = floor((msg_fwd_fees * first_frac)/ 2^16);  //internal

action_fee = msg_fwd_fees;  //external
```

[`first_frac`](/v3/documentation/network/configs/blockchain-configs#param-24-and-25) is part of the 24 and 25 parameters (for master chain and work chain) of the TON Blockchain. Currently, both are set to a value of 21845, which means that the `action_fee` is approximately a third of the `msg_fwd_fees`. In the case of an external message action, `SENDRAWMSG`, the `action_fee` is equal to the `msg_fwd_fees`.

:::tip
Remember that an action register can contain up to 255 actions, which means that all formulas related to `fwd_fee` and `action_fee` will be computed for each `SENDRAWMSG` action, resulting in the following sum:

```cpp
total_fees = sum(action_fee) + sum(total_fwd_fees);
```

:::

Starting from the fourth [global version](https://github.com/ton-blockchain/ton/blob/master/doc/GlobalVersions.md) of TON, if a "send message" action fails, the account is required to pay for processing the cells of the message, referred to as the `action_fine`.

```cpp
fine_per_cell = floor((cell_price >> 16) / 4)

max_cells = floor(remaining_balance / fine_per_cell)

action_fine = fine_per_cell * min(max_cells, cells_in_msg);
```

## Fee's config file

All fees are nominated in nanotons or nanotons multiplied by 2^16 to [maintain accuracy while using integer](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#forward-fees) and may be changed. The config file represents the current fee cost.

- storage_fees = [p18](https://tonviewer.com/config#18)
- in_fwd_fees = [p24](https://tonviewer.com/config#24), [p25](https://tonviewer.com/config#25)
- computation_fees = [p20](https://tonviewer.com/config#20), [p21](https://tonviewer.com/config#21)
- action_fees = [p24](https://tonviewer.com/config#24), [p25](https://tonviewer.com/config#25)
- out_fwd_fees = [p24](https://tonviewer.com/config#24), [p25](https://tonviewer.com/config#25)

:::info
[A direct link to the mainnet live config file](https://tonviewer.com/config).

For educational purposes [example of the old one](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05).
:::

## References

- Based on @thedailyton [article](https://telegra.ph/Fees-calculation-on-the-TON-Blockchain-07-24) from July 24th

## See also

- [TON fees overview](/v3/documentation/smart-contracts/transaction-fees/fees)
- [Transactions and phases](/v3/documentation/tvm/tvm-overview#transactions-and-phases)
- [Fees calculation](/v3/guidelines/smart-contracts/fee-calculation)

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/transaction-fees/fees.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/transaction-fees/fees.md
================================================
import Feedback from '@site/src/components/Feedback';

# Transaction fees

Every TON user should keep in mind that _commission depends on many factors_.

## Gas

All [computation costs](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#computation-fees) are nominated in gas units and fixed in a certain gas amount.

The price of gas units is determined by the [chain configuration](https://tonviewer.com/config#20) and may be changed only by consensus of validators. Note that unlike in other systems, the user cannot set his own gas price, and there is no fee market.

Current settings in basechain are as follows: 1 unit of gas costs 400 nanotons.

```cpp
1 gas = 26214400 / 2^16 nanotons = 0.000 000 4 TON
```

Current settings in masterchain are as follows: 1 unit of gas costs 10000 nanotons.

```cpp
1 gas = 655360000 / 2^16 nanotons = 0.000 01 TON
```

### Average transaction cost

> **TLDR:** Today, basic transaction costs around **~0.0025 TON**

Even if TON price increases 100 times, transactions will remain ultra-cheap; about $0.01. Moreover, validators may lower this value if they see commissions have become expensive [read why they're interested](#gas-changing-voting-process).

:::info
The current gas amount is written in the Network Config [param 20](https://tonviewer.com/config#20) and [param 21](https://tonviewer.com/config#21) for masterchain and basechain respectively.
:::

### Gas changing voting process

The gas fee, like many other parameters of TON, is configurable and may be changed by a special vote made in the mainnet.

Changing any parameter requires approval from 66% of the validators' votes.

#### Could gas cost more?

> _Does it mean that one day gas prices could rise by 1,000 times or even more?_

Technically, yes; but in fact, no.

Validators receive a small fee for processing transactions, and charging higher commissions would lead to a decrease in the number of transactions, making the validating process less beneficial.

### How are fees calculated?

Fees on TON are difficult to calculate in advance, as their amount depends on transaction run time, account status, message content and size, blockchain network settings, and a number of other variables that cannot be calculated until the transaction is sent.

That is why NFT marketplaces typically require an extra amount of TON (~1 TON) and refund the remaining amount (1 - transaction_fee) after the transaction.

:::info
Each contract should check incoming messages for the amount of TON attached to ensure it is enough to cover the fees.

Check the [low-level fees overview](/v3/documentation/smart-contracts/transaction-fees/fees-low-level) to learn more about the formulas for calculating commissions and [fees calculation](/v3/guidelines/smart-contracts/fee-calculation) to learn how to calculate fees in FunC contracts using the new TVM opcodes.
:::

However, let's read more about how fees are supposed to function on TON.

## Basic fees formula

Fees on TON are calculated by this formula:

```cpp
transaction_fee = storage_fees
                + in_fwd_fees // also named import_fee
                + computation_fees
                + action_fees
                + out_fwd_fees
```

```jsx live
// Welcome to LIVE editor!
// feel free to change any variables
// Check https://retracer.ton.org/?tx=b5e14a9c4a4e982fda42d6079c3f84fa48e76497a8f3fca872f9a3737f1f6262

function FeeCalculator() {
  // https://tonviewer.com/config#25
  const lump_price = 400000;
  const bit_price = 26214400;
  const cell_price = 2621440000;
  const ihr_price_factor = 98304;
  const first_frac = 21845;
  const nano = 10 ** -9;
  const bit16 = 2 ** 16;

  const ihr_disabled = 0; // First of all define is ihr gonna be counted

  let fwd_fee =
    lump_price + Math.ceil((bit_price * 0 + cell_price * 0) / bit16);

  if (ihr_disabled) {
    var ihr_fee = 0;
  } else {
    var ihr_fee = Math.ceil((fwd_fee * ihr_price_factor) / bit16);
  }

  let total_fwd_fees = fwd_fee + ihr_fee;
  let gas_fees = 0.0011976; // Gas fees out of scope here
  let storage_fees = 0.000000003; // And storage fees as well
  let total_action_fees = +((fwd_fee * first_frac) / bit16).toFixed(9);
  let import_fee =
    lump_price + Math.ceil((bit_price * 528 + cell_price * 1) / bit16);
  let total_fee =
    gas_fees + storage_fees + total_action_fees * nano + import_fee * nano;

  return (
    <div>
      <p> Total fee: {+total_fee.toFixed(9)} TON</p>
      <p> Action fee: {+(total_action_fees * nano).toFixed(9)} TON </p>
      <p> Fwd fee: {+(total_fwd_fees * nano).toFixed(9)} TON </p>
      <p> Import fee: {+(import_fee * nano).toFixed(9)} TON </p>
      <p> IHR fee: {+(ihr_fee * nano).toFixed(9)} TON </p>
    </div>
  );
}
```

## Elements of transaction fee

- `storage_fees` is the amount you pay for storing a smart contract in the blockchain. In fact, you pay for every second the smart contract is stored on the blockchain.
  - _Example_: your TON wallet is also a smart contract, and it pays a storage fee every time you receive or send a transaction. Read more about [how storage fees are calculated](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#storage-fee).
- `in_fwd_fees` is a charge for importing messages only from outside the blockchain, e.g. `external` messages. Every time you make a transaction, it must be delivered to the validators who will process it. For ordinary messages from contract to contract this fee is not applicable. Read [the TON Blockchain paper](https://docs.ton.org/tblkch.pdf) to learn more about inbound messages.
  - _Example_: each transaction you make with your wallet app (like Tonkeeper) requires first to be distributed among validation nodes.
- `computation_fees` is the amount you pay for executing code in the virtual machine. The larger the code, the more fees must be paid.
  - _Example_: each time you send a transaction with your wallet (which is a smart contract), you execute the code of your wallet contract and pay for it.
- `action_fees` is a charge for sending outgoing messages made by a smart contract, updating the smart contract code, updating the libraries, etc.
- `out_fwd_fees` stands for a charge for sending messages outside the TON Blockchain to interact with off-chain services (e.g., logs) and external blockchains.

## FAQ

Here are the most frequently asked questions by visitors of TON:

### Fees for sending TON?

The average fee for sending any amount of TON is 0.0055 TON.

### Fees for sending Jettons?

The average fee for sending any amount of a custom Jettons is 0.037 TON.

### Cost of minting NFTs?

The average fee for minting one NFT is 0.08 TON.

### Cost of saving data in TON?

Saving 1 MB of data for one year on TON will cost 6.01 TON. Note that you usually don't need to store large amounts of data on-chain. Consider using [TON Storage](/v3/guidelines/web3/ton-storage/storage-daemon) if you need decentralized storage.

### Is it possible to send a gasless transaction?

In TON, gasless transactions are possible using [wallet v5](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts#preparing-for-gasless-transactions) a relayer that pays the gas fee for transaction.

### How to calculate fees?

There is an article about [fee calculation](/v3/guidelines/smart-contracts/fee-calculation) in TON Blockchain.

## References

- Based on the [@thedailyton article](https://telegra.ph/Commissions-on-TON-07-22) - _[menschee](https://github.com/menschee)_

## See also

- [Low-level fees overview](/v3/documentation/smart-contracts/transaction-fees/fees-low-level)—read about the formulas for calculating commissions.
- [Smart contract function to calculate forward fees in FunC](https://github.com/ton-blockchain/token-contract/blob/main/misc/forward-fee-calc.fc)

<Feedback />




================================================
FILE: docs/v3/documentation/smart-contracts/transaction-fees/forward-fees.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/smart-contracts/transaction-fees/forward-fees.md
================================================
import Feedback from '@site/src/components/Feedback';

# Forward fees

This page explains how smart contracts handle message forwarding fees and value transfers between contracts.

## Overview

When a smart contract sends a query to another smart contract, it must pay for:
- Sending the internal message (message forwarding fees)
- Processing the message (gas fees)
- Sending back the answer, if required (message forwarding fees)

## Standard message handling

:::note
In most cases, the sender:
1. Attaches a small amount of Toncoin (typically one Toncoin) to the internal message
2. Sets the "bounce" flag (sends a bounceable internal message)

The receiver then returns the unused portion of the received value with the answer, deducting message forwarding fees. This is typically done using `SENDRAWMSG` with `mode = 64`.
:::

## Message bouncing

### Automatic bouncing

If the receiver cannot parse the received message and terminates with a non-zero exit code (for example, due to an unhandled cell deserialization exception), the message automatically bounces back to its sender. The bounced message:
- Has its "bounce" flag cleared
- Has its "bounced" flag set
- Contains 32 bits `0xffffffff` followed by 256 bits from the original message

### Handling bounced messages

Always check the "bounced" flag of incoming internal messages before parsing the `op` field. This prevents processing a bounced message as a new query.

If the "bounced" flag is set:
- You can identify the failed query by deserializing `op` and `query_id`
- Take appropriate action based on the failure
- Alternatively, terminate with zero exit code to ignore bounced messages

:::note
The "bounced" flag cannot be forged because it's rewritten during sending. If a message has the "bounced" flag set, it's definitely a result of a bounced message from the receiver.
:::

## Error handling

If the receiver successfully parses the incoming query but:
- The requested method `op` is not supported
- Another error condition is met

Send a response with `op` equal to `0xffffffff` or another appropriate value using `SENDRAWMSG` with `mode = 64`.

## Value transfer with confirmation

Some operations require both value transfer and confirmation. For example, the validator elections smart contract receives:
- An election participation request
- The stake as the attached value

### Implementation

1. The sender attaches exactly one Toncoin to the intended value
2. If an error occurs (e.g., stake not accepted):
   - Return the full received amount (minus processing fees)
   - Include an error message using `SENDRAWMSG` with `mode = 64`
3. On success:
   - Create a confirmation message
   - Return exactly one Toncoin (minus message transferring fees)
   - Use `SENDRAWMSG` with `mode = 1`

<Feedback />




================================================
FILE: docs/v3/documentation/ton-documentation.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/ton-documentation.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'
import Player from '@site/src/components/player'

# TON documentation

Welcome to the official **TON Blockchain** development documentation!

This resource provides everything you need to *build*, *test*, and *deploy* applications on the TON Blockchain.

This is a collaborative, open-source initiative, and **contributions are always welcome**. All documentation can be edited via GitHub by following [these instructions](/v3/contribute).


* _The TON Hello World_ series provides detailed step-by-step guides to wallets, smart contracts, mini apps, and testing and debugging smart contracts on TON.
* _Get started with TON_ is a step-by-step guide to interacting with TON Blockchain - complete with a video tutorial.


<Button href="https://helloworld.tonstudio.io/01-wallet/"
        colorType="primary" sizeType={'sm'}>

TON Hello World

</Button>


<Button href="/v3/guidelines/get-started-with-ton" colorType={'secondary'} sizeType={'sm'}>

Get started with TON

</Button>


### Blockchain Basics with TON

This course introduces the fundamentals of blockchain technology with a practical focus on the TON ecosystem. You'll gain a solid understanding of how blockchain works and explore its wide range of applications.


<Button href="https://stepik.org/course/201294/promo"
        colorType={'primary'} sizeType={'sm'}>

Check Blockchain Basics course

</Button>


<Button href="https://stepik.org/course/200976/promo"
        colorType={'secondary'} sizeType={'sm'}>

CHN

</Button>


<Button href="https://stepik.org/course/202221/promo"
        colorType={'secondary'} sizeType={'sm'}>

RU

</Button>


### TON course

We're excited to offer the **TON Blockchain course** — a comprehensive, hands-on learning path for developers. This course guides you through creating smart contracts and decentralized applications on the TON Blockchain in an interactive and engaging format.
The course consists of 9 modules, covering:
* The basics of the TON Blockchain
* The FunC programming language
* The TON Virtual Machine (TVM)

<Button href="https://stepik.org/course/176754/promo"
        colorType={'primary'} sizeType={'sm'}>

Check TON Blockchain course

</Button>


<Button href="https://stepik.org/course/201638/promo"
        colorType={'secondary'} sizeType={'sm'}>

CHN

</Button>


<Button href="https://stepik.org/course/201855/promo"
        colorType={'secondary'} sizeType={'sm'}>

RU

</Button>



## Development modules

If you're new to TON Blockchain development, we recommend starting from the beginning and progressing through each topic.

###  Foundational concepts

- [The Open Network](/v3/concepts/dive-into-ton/introduction) - a high-level overview of the TON Blockchain.
- [Blockchain of blockchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains) - a down-to-earth explanation of the TON Blockchain.
- [Smart contract addresses](/v3/documentation/smart-contracts/addresses) - an in-depth look at how addresses are structured and used.
- [Cells as a data structure](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage) - a high-level overview of TON's core data structure.
- [TON Networking](/v3/concepts/dive-into-ton/ton-blockchain/ton-networking) - an overview of peer-to-peer protocols within TON.
- [TON Virtual Machine (TVM)](/v3/documentation/tvm/tvm-overview) - an introduction to how smart contracts are executed.
- [Transactions and phases](/v3/documentation/tvm/tvm-overview#transactions-and-phases) - a detailed explanation of the transaction lifecycle.
- [Transaction fees](/v3/documentation/smart-contracts/transaction-fees/fees) - a high-level explanation of transaction fees.

### Infrastructure

- [Node types](/v3/documentation/infra/nodes/node-types) - a detailed overview of the different types of nodes in the TON network.
- [Run a full node](/v3/guidelines/nodes/running-nodes/full-node) - a step-by-step guide to setting up and running a full TON node.
- [TON DNS & Sites](/v3/guidelines/web3/ton-dns/dns) - an in-depth explanation of the TON DNS system and how to host decentralized websites.
- [TON Storage](/v3/guidelines/web3/ton-storage/storage-daemon) -a comprehensive guide to the TON Storage.

### Additional resources

- [**FAQ**](/v3/documentation/faq) - Frequently Asked Questions
- [FunC documentation](/v3/documentation/smart-contracts/func/overview)
- [Fift documentation](/v3/documentation/smart-contracts/fift/overview)

## Smart contracts development
Smart contracts are the building blocks of decentralized applications (dApps) on the TON Blockchain.
If you're looking to develop your dApps, it's essential to understand how a smart contract works within the TON ecosystem.


<Button href="/v3/documentation/smart-contracts/overview"
        colorType="primary" sizeType={'sm'}>

Getting started

</Button>


<Button href="/v3/documentation/smart-contracts/getting-started/javascript" colorType={'secondary'} sizeType={'sm'}>

Use Blueprint

</Button>


<br></br><br></br>

The following resources provide valuable information for developing smart contracts on the TON Blockchain:

* [TON Hello World: Step-by-step guide for writing your first smart contract](https://helloworld.tonstudio.io/02-contract/) - a step-by-step guide for writing your first smart contract. Offers an accessible and concise introduction to the fundamentals of using JavaScript.
* [How to work with wallet smart contracts](/v3/guidelines/smart-contracts/howto/wallet) - a detailed and structured explanation of smart contract basics, utilizing both JavaScript and Go.
* [Learn smart contracts by examples](/v3/documentation/smart-contracts/contracts-specs/examples) - a collection of examples demonstrating smart contract development using the FunC and Fift languages.
* [Speed run TON](/v3/documentation/smart-contracts/contracts-specs/examples) - 6 interactive challenges and step-by-step tutorials to learn smart contracts development.


## DApp development
Decentralized applications (DApps) run on a peer-to-peer network—such as the TON Blockchain—rather than on a single server.
They function similarly to traditional web applications but are built on a blockchain, making them *decentralized*, meaning no single entity controls the application.

<Button href="/v3/guidelines/dapps/overview/" colorType={'primary'} sizeType={'sm'}>

Getting started

</Button>


### DeFi development

Explore key tools and concepts for building decentralized finance (DeFi) applications on the TON Blockchain:

* [TON Connect](/v3/guidelines/ton-connect/overview) — an integration and authentication for dApps.
* [Off-chain payments processing](/v3/guidelines/dapps/asset-processing/payments-processing) — examples and concepts for processing payments.
* [TON Jetton processing](/v3/guidelines/dapps/asset-processing/jettons) — examples and concepts for processing Jettons.
* [Fungible (FT) / Non-fungible (NFT) tokens](/v3/documentation/dapps/defi/tokens) — smart contracts, examples, and tools.

Take your first steps in building decentralized applications with this comprehensive guide:

- [TON Hello World: Step by step guide for building your first web client](https://helloworld.tonstudio.io/03-client/)

### APIs and SDKs

* [APIs](/v3/guidelines/dapps/apis-sdks/api-types)
* [SDKs](/v3/guidelines/dapps/apis-sdks/sdk)

## FAQ (Frequently Asked Questions)

Don’t forget to check out the [FAQ](/v3/documentation/faq) section.

<Feedback />




================================================
FILE: docs/v3/documentation/tvm/changelog/tvm-upgrade-2023-07.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/tvm/changelog/tvm-upgrade-2023-07.md
================================================
import Feedback from '@site/src/components/Feedback';

# TVM upgrade Jul 2023

:::tip
This upgrade was [launched](https://t.me/tonblockchain/223) on the Mainnet in Dec 2023.
:::

## `c7`

`c7` is a register that stores important information needed for contract execution, like time, network configurations, and others.

**Changes to `c7` tuple**

The `c7` tuple has been expanded from 10 to 14 elements:
- **10:** `cell` containing the code of the smart contract itself.
- **11:** `[integer, maybe_dict]`: TON value of the incoming message, including any extracurrency.
- **12:** `integer`, representing fees collected during the storage phase.
- **13:** `tuple` containing information about previous blocks.

**Explanation**



**10:** The smart contract code is now stored as executable data in the TVM, not a cell. This allows it to authorize other contracts of the same type—for example, a jetton-wallet authorizing another jetton-wallet. 

Currently, the code cell must be explicitly stored in storage, making storage and `init_wrapper` more complex than they could be. 
Using **10** for code aligns with the Everscale TVM update.


**11:** The incoming message value is placed on the stack when the TVM starts. If needed during execution, it must be stored as a global variable or passed as a local variable. At the FunC level, this appears as an additional `msg_value` argument in all functions.

By storing it in **11**, we mirror the behavior of the contract balance, which is available both on the stack and in `c7`.


**12:** Currently, the only way to determine storage fees is by:
1. Storing the balance from the previous transaction. 
2. Estimating the gas usage in that transaction. 
3. Comparing it to the current balance minus the message value.

However, a more direct method to account for storage fees is often needed.

**13:** There is no built-in way to retrieve data from previous blocks.
One of TON’s key features is that every structure is a Merkle-proof-friendly tree of cells. Additionally, TVM is optimized for:
- Cell-based computations. 
- Efficient handling of Merkle proofs.

By integrating block information into the TVM context, several trustless mechanisms become possible:
- **Cross-contract verification:** contract _A_ can verify transactions on contract _B_ without B’s cooperation. 
- **Broken message chain recovery:** a recovery contract can fetch and validate proofs for transactions that occurred but were later reverted. 
- **On-chain validation:** access to MasterChain block hashes enables functions like fisherman validation mechanisms.

Block identifiers follow this structure:

```
[ wc:Integer shard:Integer seqno:Integer root_hash:Integer file_hash:Integer ] = BlockId;
[ last_mc_blocks:[BlockId0, BlockId1, ..., BlockId15]
  prev_key_block:BlockId ] : PrevBlocksInfo
```  

This includes:
- The last 16 MasterChain block IDs, or fewer if the masterchain sequence number is below 16. 
- The most recent key block.

**Why not include shardblocks data?**
- Including shardblocks data could cause data availability issues due to merge/split events. 
- However, this data isn’t strictly necessary, as any event or data can be verified using MasterChain blocks.


## New opcodes

When determining the gas cost for new opcodes, follow this rule of thumb:
- The cost should not be lower than the standard value (calculated from opcode length). 
- The execution time should not exceed **20 ns per gas unit**.

### Opcodes to work with new c7 values
26 gas for each, except for `PREVMCBLOCKS` and `PREVKEYBLOCK` (34 gas).

Each opcode consumes 26 gas, except for `PREVMCBLOCKS` and `PREVKEYBLOCK`, which require 34 gas.

| Fift syntax | Stack             | Description                                                               |
|:-|:------------------|:--------------------------------------------------------------------------|
| `MYCODE` | _`- c`_           | Retrieves the smart contract's code from `c7`.                            |
| `INCOMINGVALUE` | _`- t`_           | Retrieves the value of the incoming message from `c7`.                    |
| `STORAGEFEES` | _`- i`_           | Retrieves the storage phase fees from `c7`.                               |
| `PREVBLOCKSINFOTUPLE` | _`- t`_           | Retrieves `PrevBlocksInfo`: `[last_mc_blocks, prev_key_block]` from `c7`. |
| `PREVMCBLOCKS` | _`- t`_           | Retrieves only `last_mc_blocks`.                                          |
| `PREVKEYBLOCK` | _`- t`_           | Retrieves only `prev_key_block`.                                          |
| `GLOBALID` | _`- i`_           | Retrieves `global_id` from network config  **19**.                        |

## Gas

| Fift syntax | Stack            | Description                                                                                 |
|:-|:-----------------|:--------------------------------------------------------------------------------------------|
| `GASCONSUMED` | _`- g_c`_        | Returns the total gas consumed by the VM so far, including this instruction .<br/>_26 gas_. |

## Arithmetics
New variants of [the division opcode](/v3/documentation/tvm/instructions) `A9mscdf` have been introduced.

New `d=0` variant:
- Takes an additional integer from the stack. 
- Adds it to the intermediate value before performing division or right shift.
- Returns both the quotient and remainder, just like `d=3`.

**Quiet variants** are also available. For example, `QMULADDDIVMOD` or `QUIET MULADDDIVMOD`.

**Error handling**

Non-quiet operations throw an integer overflow exception if:
- The result exceeds `257-bit` integers. 
- The divider is **zero**.

Quiet operations handle errors differently:
- If a value doesn't fit, they return `NaN`.
- If the divider is zero, they return `two NaNs`.

**Gas cost calculation**

Gas cost is determined as 10 plus the opcode length:
- Most opcodes require **26 gas**.
- `LSHIFT#/RSHIFT#` cost an additional **8 gas**.
- Quiet variants also require an extra **8 gas**.

| Fift syntax                          | Stack                                                    |
|:-------------------------------------|:---------------------------------------------------------|
| `MULADDDIVMOD`                       | _`x y w z - q=floor((xy+w)/z) r=(xy+w)-zq`_              |
| `MULADDDIVMODR`                      | _`x y w z - q=round((xy+w)/z) r=(xy+w)-zq`_              |
| `MULADDDIVMODC`                      | _`x y w z - q=ceil((xy+w)/z) r=(xy+w)-zq`_               |
| `ADDDIVMOD`                          | _`x w z - q=floor((x+w)/z) r=(x+w)-zq`_                  |
| `ADDDIVMODR`                         | _`x w z - q=round((x+w)/z) r=(x+w)-zq`_                  |
| `ADDDIVMODC`                         | _`x w y - q=ceil((x+w)/z) r=(x+w)-zq`_                   |
| `ADDRSHIFTMOD`                       | _`x w z - q=floor((x+w)/2^z) r=(x+w)-q*2^z`_             |
| `ADDRSHIFTMODR`                      | _`x w z - q=round((x+w)/2^z) r=(x+w)-q*2^z`_             |
| `ADDRSHIFTMODC`                      | _`x w z - q=ceil((x+w)/2^z) r=(x+w)-q*2^z`_              |
| `z ADDRSHIFT#MOD`                    | _`x w - q=floor((x+w)/2^z) r=(x+w)-q*2^z`_               |
| `z ADDRSHIFTR#MOD`                   | _`x w - q=round((x+w)/2^z) r=(x+w)-q*2^z`_               |
| `z ADDRSHIFTC#MOD`                   | _`x w - q=ceil((x+w)/2^z) r=(x+w)-q*2^z`_                |
| `MULADDRSHIFTMOD`                    | _`x y w z - q=floor((xy+w)/2^z) r=(xy+w)-q*2^z`_         |
| `MULADDRSHIFTRMOD`                   | _`x y w z - q=round((xy+w)/2^z) r=(xy+w)-q*2^z`_         |
| `MULADDRSHIFTCMOD`                   | _`x y w z - q=ceil((xy+w)/2^z) r=(xy+w)-q*2^z`_          |
| `z MULADDRSHIFT#MOD`                 | _`x y w - q=floor((xy+w)/2^z) r=(xy+w)-q*2^z`_           |
| `z MULADDRSHIFTR#MOD`                | _`x y w - q=round((xy+w)/2^z) r=(xy+w)-q*2^z`_           |
| `z MULADDRSHIFTC#MOD`                | _`x y w - q=ceil((xy+w)/2^z) r=(xy+w)-q*2^z`_            |
| `LSHIFTADDDIVMOD`                    | _`x w z y - q=floor((x*2^y+w)/z) r=(x*2^y+w)-zq`_        |
| `LSHIFTADDDIVMODR`                   | _`x w z y - q=round((x*2^y+w)/z) r=(x*2^y+w)-zq`_        |
| `LSHIFTADDDIVMODC`                   | _`x w z y - q=ceil((x*2^y+w)/z) r=(x*2^y+w)-zq`_         |
| `y LSHIFT#ADDDIVMOD`                 | _`x w z - q=floor((x*2^y+w)/z) r=(x*2^y+w)-zq`_          |
| `y LSHIFT#ADDDIVMODR`                | _`x w z - q=round((x*2^y+w)/z) r=(x*2^y+w)-zq`_          |
| `y LSHIFT#ADDDIVMODC`                | _`x w z - q=ceil((x*2^y+w)/z) r=(x*2^y+w)-zq`_           |

## Stack operations

**Previous limitations**
- All stack operation arguments are limited to 256. 
- This makes managing deep stack elements difficult when the stack grows beyond 256. 
- In most cases, this limit is not imposed for safety reasons—it's not about preventing excessive computation costs.


For certain mass stack operations, such as `ROLLREV`, computation time scales linearly with the argument value, and as a result, the gas cost also increases linearly.

**Updated behavior**

The argument limits for the following operations have been removed:
- `PICK`, `ROLL`, `ROLLREV`, `BLKSWX`, `REVX`, `DROPX`, `XCHGX`, `CHKDEPTH`, `ONLYTOPX`, `ONLYX`.

**Gas cost adjustments for large arguments**

Certain operations now consume additional gas when arguments exceed 255:
- `ROLL`, `ROLLREV`, `REVX`, `ONLYTOPX`: additional gas cost is calculated as: `max(arg−255,0)`. _For arguments ≤ 255, gas consumption remains unchanged_.

- `BLKSWX`: additional gas cost is determined by: `max(arg1+arg2-255,0)`. _This differs from previous behavior, where both arguments were limited to 255_.




## Hashes

Previously, TVM supported only two hash operations:
- Computing the representation hash of a `cell` or `slice`.
- Calculating the SHA-256 hash of data, but only for inputs up to 127 bytes, as this is the maximum data that fits into a single cell.

**New hash operations (`HASHEXT[A][R]_(HASH)`)**
A new family of hash operations has been introduced to extend TVM's hashing capabilities:

| Fift syntax        | Stack                    | Description                                                                     |
|:-------------------|:-------------------------|:--------------------------------------------------------------------------------|
| `HASHEXT_(HASH)`   | _`s_1 ... s_n n - h`_    | Computes the hash of the concatenation of slices or builders `s_1...s_n`.       |
| `HASHEXTR_(HASH)`  | _`s_n ... s_1 n - h`_    | Same as `HASHEXT_(HASH)`, but the arguments are given in reverse order.         |
| `HASHEXTA_(HASH)`  | _`b s_1 ... s_n n - b'`_ | Appends the resulting hash to a builder `b` instead of pushing it to the stack. |
| `HASHEXTAR_(HASH)` | _`b s_n ... s_1 n - b'`_ | Same as `HASHEXTA_(HASH)`, but with arguments in reverse order.                 |


**Key behavior and constraints**
- Only the bits from the root cells of `s_i` are used for hashing.
- Each chunk `s_i` may contain a non-integer number of bytes, but the total number of bits across all chunks must be divisible by 8.
- TON follows most-significant bit ordering, meaning that bits from the first slice become the most significant when concatenating two slices with non-integer byte lengths.

**Gas consumption**

- Gas cost depends on the number of hashed bytes and the chosen algorithm.
- An additional 1 gas unit is consumed per chunk.
- Gas usage is rounded down.

**Hashing result format**

If `[A]` is not enabled, the result is returned as an unsigned integer if it fits within 256 bits. Otherwise, it is returned as a tuple of integers.


| **Algorithm**  | **Implementation**                                | **Gas cost (per byte)** | **Hash size** |
|----------------|---------------------------------------------------|-------------------------|---------------|
| **SHA-256**    | OpenSSL                                           | 1/33                    | 256 bits      |
| **SHA-512**    | OpenSSL                                           | 1/16                    | 512 bits      |
| **BLAKE2B**    | OpenSSL                                           | 1/19                    | 512 bits      |
| **KECCAK-256** | [Ethereum-compatible](http://keccak.noekeon.org/) | 1/11                    | 256 bits      |
| **KECCAK-512** | [Ethereum-compatible](http://keccak.noekeon.org/) | 1/6                     | 512 bits      |


## Crypto
Currently, the only cryptographic algorithm available is `CHKSIGN`: it checks the `Ed25519`-signature of a hash `h` for a public key `k`.
- For compatibility with previous generation blockchains such as Bitcoin and Ethereum, we must also check `secp256k1` signatures.
- For modern cryptographic algorithms, the bare minimum includes curve addition and multiplication.
- For compatibility with Ethereum 2.0 PoS and some other modern cryptography, we need the BLS-signature scheme on the `bls12-381` curve.
- For some secure hardware, one of `secp256r1`, `P256`, or `prime256v1` is needed.



### secp256k1
Used for Bitcoin/Ethereum signatures. This implementation uses the [libsecp256k1 library](https://github.com/bitcoin-core/secp256k1).

| Fift syntax | Stack | Description                                                                                                                                                                                                                                                                                                                                  |
|:-|:-|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ECRECOVER` | _`hash v r s - 0 or h x1 x2 -1`_ | Recovers the public key from the signature, similar to Bitcoin/Ethereum operations. It takes a 32-byte hash as uint256 `hash`, a 65-byte signature as uint8 `v`, and uint256 `r` and `s`. Returns `0` on failure or the public key and `-1` on success. The 65-byte public key is returned as uint8 `h`, uint256 `x1`, `x2`. <br/>_1526 gas_ |

### secp256r1
Uses OpenSSL implementation. The interface is similar to `CHKSIGNS`/`CHKSIGNU`. It is compatible with Apple Secure Enclave.




| Fift syntax     | Stack           | Description                                                                                                                                                                                                                                                                                                                                                                                     |
|:----------------|:----------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `P256_CHKSIGNS` | _`d sig k - ?`_ | Checks the `secp256r1` signature `sig` of the data portion of slice `d` and the public key `k`. Returns `-1` on success or `0` on failure. <br/> The public key is a 33-byte slice (encoded according to Section 2.3.4, point 2 of [SECG SEC 1](https://www.secg.org/sec1-v2.pdf)). <br/> The signature `sig` is a 64-byte slice (two 256-bit unsigned integers `r` and `s`). <br/> _3526 gas_. |
| `P256_CHKSIGNU` | _`h sig k - ?`_ | It is the same as `P256_CHKSIGNS`, but the signed data is a 32-byte encoding of the 256-bit unsigned integer `h`. <br/> _3526 gas_.                                                                                                                                                                                                                                                             |

### Ristretto
 
Extended documentation is available [here](https://ristretto.group/). Curve25519 is known for its high performance but has a drawback: group elements can have multiple representations. Simple cryptographic protocols like Schnorr signatures and Diffie-Hellman use workarounds to address this issue, but these solutions break key derivation and key blinding schemes. More complex protocols like Bulletproofs cannot rely on these tricks.

**Ristretto** solves this problem by providing an arithmetic abstraction over Curve25519, ensuring each group element has a unique representation. It acts as a compression and decompression layer, maintaining the speed of Curve25519 while making cryptographic protocols easier to implement correctly. One key advantage of Ristretto is that it allows the seamless performance of Curve25519 operations, though the reverse is not true. 

As a result, adding Ristretto support effectively means adding both Ristretto and Curve25519 operations in a single step.


The implementation is based on [libsodium](https://github.com/jedisct1/libsodium/).

**Representation in TVM**
- All ristretto-255 points are represented as 256-bit unsigned integers. 
- Invalid points cause a `range_chk` throw in non-quiet operations.
- The zero point is represented as integer `0`.

| Fift syntax | Stack | Description                                                                                                   |
|:-|:-|:--------------------------------------------------------------------------------------------------------------|
| `RIST255_FROMHASH` | _`h1 h2 - x`_ | Generates a valid point `x` from a 512-bit hash (two 256-bit integers).<br/>_626 gas_.                        |
| `RIST255_VALIDATE` | _`x -`_ | Verifies that `x` is a valid curve point representation. If invalid, throws `range_chk`.<br/>_226 gas_        |
| `RIST255_ADD` | _`x y - x+y`_ | Adds two points on the curve.<br/>_626 gas_                                                                   |
| `RIST255_SUB` | _`x y - x-y`_ | Subtracts one curve point from another. <br/>_626 gas_                                                        |
| `RIST255_MUL` | _`x n - x*n`_ | Multiplies a curve point `x` by a scalar `n`.<br/>Any `n` is valid, including negative.<br/>_2026 gas_.       |
| `RIST255_MULBASE` | _`n - g*n`_ | Multiplies the generator point `g` by a scalar `n`.<br/>Any `n` is valid, including negative.<br/>_776 gas_   |
| `RIST255_PUSHL` | _`- l`_ | Pushes the integer `l=2^252+27742317777372353535851937790883648493`, which is the group`s order.<br/>_26 gas_ |
| `RIST255_QVALIDATE` | _`x - 0 or -1`_ | Quiet version of `RIST255_VALIDATE`.<br/>_234 gas_.                                                           |
| `RIST255_QADD` | _`x y - 0 or x+y -1`_ | Quiet version of `RIST255_ADD`. <br/>_634 gas_.                                                               |
| `RIST255_QSUB` | _`x y - 0 or x-y -1`_ | Quiet version of `RIST255_SUB`.<br/>_634 gas_.                                                                |
| `RIST255_QMUL` | _`x n - 0 or x*n -1`_ | Quiet version of `RIST255_MUL`.<br/>_2034 gas_.                                                               |
| `RIST255_QMULBASE` | _`n - 0 or g*n -1`_ | Quiet version of `RIST255_MULBASE`.<br/>_784 gas_.                                                            |

### BLS12-381
Operations on the pairing-friendly BLS12-381 curve using the [BLST](https://github.com/supranational/blst) implementation. It includes operations for the BLS signature scheme, which is based on this curve.

BLS values are represented in TVM in the following way:
- G1-points and public keys: 48-byte slice.
- G2-points and signatures: 96-byte slice.
- Elements of field FP: 48-byte slice.
- Elements of field FP2: 96-byte slice.
- Messages: slice. Several bits should be divisible by 8.

**Handling input sizes**
- If an input point or field element exceeds 48/96 bytes, only the first 48/96 bytes are considered.
- If an input slice is too short or a message's bit size isn't divisible by 8, a cell underflow exception is thrown.

#### High-level operations
These high-level operations are designed to verify BLS signatures efficiently.

| Fift syntax | Stack                                      | Description                                                                                                                                                                             |
|:-|:-------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `BLS_VERIFY` | _`pk msg sgn - bool`_                      | Checks a BLS signature. It returns true  if valid, false otherwise.<br/>_61034 gas_.                                                                                                    |
| `BLS_AGGREGATE` | _`sig_1 ... sig_n n - sig`_                | Aggregates signatures. `n>0`. Throws an exception if `n=0` or if any `sig_i` is invalid .<br/>_`gas=n*4350-2616`_.                                                                      |
| `BLS_FASTAGGREGATEVERIFY`- | _`pk_1 ... pk_n n msg sig - bool`_         | Checks an aggregated BLS signature for keys `pk_1...pk_n` and a message `msg`. It returns false if `n=0`.<br/>_`gas=58034+n*3000`_.                                                     |
| `BLS_AGGREGATEVERIFY` | _`pk_1 msg_1 ... pk_n msg_n n sgn - bool`_ | Checks an aggregated BLS signature for multiple key-message pairs `pk_1 msg_1...pk_n msg_n`. Returns true if valid, false otherwise. Returns false if `n=0`.<br/>_`gas=38534+n*22500`_ |


`VERIFY` instructions
- These instructions do not throw exceptions for invalid signatures or public keys. 
- The only exceptions occur due to cell underflow errors. 
- If verification fails, it returns false.

#### Low-level operations
These operations perform arithmetic computations on group elements.

| Fift syntax | Stack | Description                                                                                                                                                                                                                      |
|:-|:-|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `BLS_G1_ADD` | _`x y - x+y`_ | Performs addition on G1.<br/>_3934 gas_.                                                                                                                                                                                         |
| `BLS_G1_SUB` | _`x y - x-y`_ | Performs subtraction on G1.<br/>_3934 gas_.                                                                                                                                                                                      |
| `BLS_G1_NEG` | _`x - -x`_ | Performs negation on G1.<br/>_784 gas_.                                                                                                                                                                                          |
| `BLS_G1_MUL` | _`x s - x*s`_ | Multiplies G1 point `x` by scalar `s`.<br/>Any `s` is valid, including negative.<br/>_5234 gas_.                                                                                                                                 |
| `BLS_G1_MULTIEXP` | _`x_1 s_1 ... x_n s_n n - x_1*s_1+...+x_n*s_n`_ | Calculates `x_1*s_1+...+x_n*s_n` for G1 points `x_i` and scalars `s_i`. Returns zero point if `n=0`.<br/>Any `s_i` is valid, including negative.<br/>_`gas=11409+n*630+n/floor(max(log2(n),4))*8820`_.                           |
| `BLS_G1_ZERO` | _`- zero`_ | Pushes zero point in G1.<br/>_34 gas_.                                                                                                                                                                                           |
| `BLS_MAP_TO_G1` | _`f - x`_ | Converts an FP element `f` to a G1 point.<br/>_2384 gas_.                                                                                                                                                                        |
| `BLS_G1_INGROUP` | _`x - bool`_ | Checks whether the slice `x` represents a valid element of G1.<br/>_2984 gas_.                                                                                                                                                   |
| `BLS_G1_ISZERO` | _`x - bool`_ | Checks if G1 point `x` is equal to zero.<br/>_34 gas_.                                                                                                                                                                           |
| `BLS_G2_ADD` | _`x y - x+y`_ | Performs addition on G2.<br/>_6134 gas_.                                                                                                                                                                                         |
| `BLS_G2_SUB` | _`x y - x-y`_ | Performs subtraction on G2.<br/>_6134 gas_.                                                                                                                                                                                      |
| `BLS_G2_NEG` | _`x - -x`_ | Performs negation on G2.<br/>_1584 gas_.                                                                                                                                                                                         |
| `BLS_G2_MUL` | _`x s - x*s`_ | Multiplies G2 point `x` by scalar `s`.<br/>Any `s` is valid, including negative.<br/>_10584 gas_.                                                                                                                                |
| `BLS_G2_MULTIEXP` | _`x_1 s_1 ... x_n s_n n - x_1*s_1+...+x_n*s_n`_ | Calculates `x_1*s_1+...+x_n*s_n` for G2 points `x_i` and scalars `s_i`. Returns zero point if `n=0`.<br/>Any `s_i` is valid, including negative.<br/>_`gas=30422+n*1280+n/floor(max(log2(n),4))*22840`_ .                        |
| `BLS_G2_ZERO` | _`- zero`_ | Pushes zero point in G2.<br/>_34 gas_.                                                                                                                                                                                           |
| `BLS_MAP_TO_G2` | _`f - x`_ | Converts an FP2 element `f` to a G2 point.<br/>_7984 gas_.                                                                                                                                                                       |
| `BLS_G2_INGROUP` | _`x - bool`_ | Checks whether the slice `x` represents a valid element of G2.<br/>_4284 gas_.                                                                                                                                                   |
| `BLS_G2_ISZERO` | _`x - bool`_ | Checks if G2 point `x` is equal to zero.<br/>_34 gas_.                                                                                                                                                                           |
| `BLS_PAIRING` | _`x_1 y_1 ... x_n y_n n - bool`_ | Given G1 points `x_i` and G2 points `y_i`, calculates and multiply pairings of `x_i,y_i`. Returns true if the result is the multiplicative identity in FP12, false otherwise. Returns false if `n=0`.<br/>_`gas=20034+n*11800`_. |
| `BLS_PUSHR` | _`- r`_ | Pushes the order of G1 and G2, approximately `2^255` .<br/>_34 gas_.                                                                                                                                                             |


`INGROUP` and `ISZERO` do not throw exceptions for invalid points except in cases of cell underflow; instead, they return false.

Other arithmetic operations throw an exception if the curve points are invalid. However, they do not verify whether a given point belongs to group G1 or G2. To ensure group membership, use the `INGROUP` instruction.


## RUNVM


Currently, TVM does not provide a mechanism for executing external untrusted code within a secure sandbox environment. In other words, any external code invoked has unrestricted access and can permanently modify the contract's code and data or trigger actions such as transferring all funds.

The `RUNVM` instruction creates an isolated VM instance, allowing code execution while safely retrieving data such as stack state, registers, and gas consumption. This ensures the caller's state remains unaffected. This allows arbitrary code to run safely, which is helpful for [v4-style plugins](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts#wallet-v4), Tact's `init`-style subcontract calculations, and similar use cases.

| Fift syntax | Stack | Description                                                                                                                                                                                                                                                                                                                                                                                                          |
|:-|:-|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `flags RUNVM` | _`x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]`_ | Executes a child VM with the given `code` and stack values `x_1 ... x_n`. Returns the modified stack `x'_1 ... x'_m` along with an exit code. <br/> Flags determine other arguments and return values. See details below.|
| `RUNVMX` | _`x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] flags - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]`_ | It is the same as `RUNVM` but retrieves flags from the stack.                                                                                                                                                                                                                                                                                                                                                        |


Flags operate similarly to `RUNVMX` in Fift:

- `+1`: sets `c3` to code.
- `+2`: pushes an implicit `0` before executing the code.
- `+4`: takes persistent data `c4` from the stack and returns its final value.
- `+8`: takes the gas limit `g_l` from the stack and returns the consumed gas `g_c`.
- `+16`: takes `c7` (smart contract context) from the stack.
- `+32`: returns the final value of `c5` (actions).
- `+64`: pops the hard gas limit `g_m` enabled by `ACCEPT` from the stack.
- `+128`: enables "isolated gas consumption", meaning the child VM maintains a separate set of visited cells and a `chksgn` counter.
- `+256`: pops an integer `r` and ensures exactly `r` values are returned from the top of the stack:
  - If `RUNVM` call succeeds and `r` is set, it returns `r` elements. If `r` is not set, it returns all available elements.
  - If `RUNVM` is successful but lacks elements on the stack, meaning the stack depth is less than `r`, it is treated as an exception in the child VM. The `exit_code` is set to `-3`, and `exit_arg` is set to `0`, so `0` is returned as the only stack element.
  - If `RUNVM` fails with an exception, only one element is returned, `exit_arg`, which should not be confused with `exit_code`.
  - In the case of running out of gas, `exit_code` is set to `-14`, and `exit_arg` contains the amount of gas.

Gas cost:
- 66 gas;
- 1 gas for each stack element passed to the child VM (the first 32 elements are free);
- 1 gas for each stack element returned from the child VM (the first 32 elements are free).



## Sending messages

Calculating the cost of sending a message within a contract is difficult. This leads to **approximations**, for example, as seen in [jettons](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc#L94), and makes it **impossible** to:
- Bounce a request back if the action phase is incorrect.
- Accurately subtract the sum of a message’s constant contract logic fee and gas expenses from the incoming message.


`SENDMSG`
The `SENDMSG` instruction:
- Takes a `cell` and a `mode` as input.
- Creates an output action and returns the fee for generating a message.

The **mode** behaves similarly to `SENDRAWMSG`, with additional effects:
- `+1024` – fee estimation only, does not create an action.
- `+64` – uses the entire balance of the incoming message as the outgoing value. This is slightly inaccurate since gas expenses that cannot be precomputed are ignored.
- `+128` – substitutes the value of the contract’s entire balance before the computation phase starts. This is slightly inaccurate since gas expenses are not estimated before computation completion and ignored.

**Additional message handling flags**

A `+16` flag has been added for the following operations:
- `SENDRAWMSG`
- `RAWRESERVE` 
- `SETLIBCODE` 
- `CHANGELIB`

**Effect:** if the action fails, a bounce transaction is triggered.  
**Exception:** the flag has **no effect** if `+2` is used.

## Security audits

The upgrade to the TON Virtual Machine (TVM) was analyzed for security risks and potential vulnerabilities.

**Audit firm**: Trail of Bits  
**Audit report**: [TON Blockchain TVM Upgrade](https://docs.ton.org/audits/TVM_Upgrade_ToB_2023.pdf)

<Feedback />




================================================
FILE: docs/v3/documentation/tvm/changelog/tvm-upgrade-2024-04.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/tvm/changelog/tvm-upgrade-2024-04.md
================================================
import Feedback from '@site/src/components/Feedback';

# TVM upgrade Apr 2024

## Introduction of new instructions for low fees calculation

:::tip
This upgrade is active on the Mainnet since Mar 16, 2024. See the details [here](https://t.me/tonstatus/101). A preview of the update for blueprints is available in the following packages: `@ton/sandbox@0.16.0-tvmbeta.3`, `@ton-community/func-js@0.6.3-tvmbeta.3`, and `@ton-community/func-js-bin@0.4.5-tvmbeta.3`.
:::

This update is enabled with Config8 `version >= 6`.

## `c7`

The `c7` tuple has been extended from 14 to 16 elements as follows:
* **14**: a tuple containing various config parameters as cell slices. If a parameter is absent from the config, its value is null.
  * **0**: `StoragePrices` from `ConfigParam 18`. Not the entire dictionary but the specific `StoragePrices` entry corresponding to the current time.
  * **1**: `ConfigParam 19` - global ID.
  * **2**: `ConfigParam 20` - MasterChain gas prices.
  * **3**: `ConfigParam 21` - gas prices.
  * **4**: `ConfigParam 24` - MasterChain forward fees.
  * **5**: `ConfigParam 25` - forward fees.
  * **6**: `ConfigParam 43` - size limits.
* **15**: "[Due payment](https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L237)" - current debt for the storage fee in nanotons. `asm` opcode: `DUEPAYMENT`.
* **16**: "Precompiled gas usage" - gas usage for the current contract if precompiled as defined in ConfigParam 45; null otherwise. 
`asm` opcode: `GETPRECOMPILEDGAS`.



The extension of `c7` with unpacked config parameters aims to improve efficiency. Now, this data is retrieved from the global configuration by the transaction executor, making it readily available in the executor's memory. Previously, the smart contract had to fetch each parameter one by one from the configuration dictionary. This method was costly and gas-inefficient, as the cost depended on the number of parameters.

**Due payment field**

The due payment field is crucial for accurately managing storage fees. Here's how it works:
- When a message is sent in the default (bounceable) mode to a smart contract, storage fees are either:
  - **Deducted**, or 
  - **Added** to the `due_payment` field, which stores the storage fee-related debt.
- These adjustments happen **before** the message value is added to the contract's balance.
- If the contract processes the message and sends back excess gas with `mode=64`, the following occurs:
  - If the contract's balance reaches 0, storage fees will accumulate in the `due_payment` field on subsequent transactions instead of being deducted from incoming messages. 
  - This results in the debt silently accumulating until the account is frozen.

The `DUEPAYMENT` opcode allows developers to explicitly account for or withhold storage fees, preventing potential issues.


## New opcodes

### Opcodes for new `c7` values
Each opcode consumes **26 gas**, except for `SENDMSG`, due to cell operations.

|Fift syntax | Stack | Description                                                                                                                             |
|:-|:--------------------|:----------------------------------------------------------------------------------------------------------------------------------------|
| `UNPACKEDCONFIGTUPLE` | _`- c`_             | Retrieves the tuple of config slices from `c7`.                                                                                         |
| `DUEPAYMENT` | _`- i`_             | Retrieves the value of due payment from `c7`.                                                                                           |
| `GLOBALID` | _`- i`_             | Retrieves `ConfigParam 19` from `c7` instead of the configuration dictionary.                                                             |
| `SENDMSG` | _`msg mode - i`_    | Retrieves `ConfigParam 24/25` (message prices) and `ConfigParam 43` (`max_msg_cells`) from `c7` rather than from the config dictionary. |

### Opcodes to process config parameters
 

Introducing the configuration tuple in the TON transaction executor makes parsing fee parameters more cost-effective. However, smart contracts may require updates to interpret new configuration parameter constructors as they are introduced. 

To address this, special opcodes for fee calculation are introduced. These opcodes:
- Retrieve parameters from `c7`. 
- Calculate fees in the same way as the executor.

As new parameter constructors are introduced, these opcodes are updated accordingly. This ensures that smart contracts can rely on these instructions for fee calculation without needing to interpret each new constructor.

Each opcode consumes 26 gas.


| Fift syntax           | Stack                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|:----------------------|:-------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GETGASFEE`           | _`gas_used is_mc - price`_           | Calculates the computation cost in nanotons for a transaction that consumes `gas_used` gas.                                                                                                                                                                                                                                                                                                                                                                |
| `GETSTORAGEFEE`       | _`cells bits seconds is_mc - price`_ | Calculates the storage fees in nanotons for the contract based on current storage prices.`cells` and `bits` represent the size of the [`AccountState`](https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L247) with deduplication, including the root cell.                                                                                                                                       |
| `GETFORWARDFEE`       | _`cells bits is_mc - price`_         | Calculates forward fees in nanotons for an outgoing message. `is_mc` is true if the source or the destination is in the MasterChain and false if both are in the basechain. **Note:** `cells` and `bits` in the message should be counted with deduplication and the _root-not-counted_ rules.                                                                                                                                                             |
| `GETPRECOMPILEDGAS`   | _`- null`_                           | Reserved; currently returns null. It returns the cost of contract execution in gas units if the contract is _precompiled_.                                                                                                                                                                                                                                                                                                                                 |
| `GETORIGINALFWDFEE`   | _`fwd_fee is_mc - orig_fwd_fee`_     | Calculates `fwd_fee * 2^16 / first_frac`. It can be used to get the original `fwd_fee` of the message as a replacement for hardcoded values like [this](https://github.com/ton-blockchain/token-contract/blob/21e7844fa6dbed34e0f4c70eb5f0824409640a30/ft/jetton-wallet.fc#L224C17-L224C46) from the `fwd_fee` parsed from an incoming message. `is_mc` is true if the source or destination is in the MasterChain and false if both are in the basechain. |
| `GETGASFEESIMPLE`     | _`gas_used is_mc - price`_           | Calculates the additional computation cost in nanotons for a transaction that consumes additional `gas_used` gas. This is the same as `GETGASFEE`, but without the flat price calculated as `(gas_used * price) / 2^16.`                                                                                                                                                                                                                                   |
| `GETFORWARDFEESIMPLE` | _`cells bits is_mc - price`_         | Calculates the additional forward cost in nanotons for a message containing additional `cells` and `bits`. This is the same as `GETFORWARDFEE`, but without the lump price calculated as `(bits * bit_price + cells * cell_price) / 2^16)`.                                                                                                                                                                                                                |

**Note:** `gas_used`, `cells`, `bits`, and `time_delta` are integers in the range `0..2^63-1`.

### Cell-level operations
These operations work with Merkle proofs, where cells can have a non-zero level and multiple hashes. Each operation consumes 26 gas.

| Fift syntax | Stack | Description                         |
|:-|:-|:------------------------------------|
| `CLEVEL` | _`cell - level`_ | Returns the level of the cell.      |
| `CLEVELMASK` | _`cell - level_mask`_ | Returns the level mask of the cell. |
| `i CHASHI` | _`cell - hash`_ | Returns the `i`-th hash of the cell.      |
| `i CDEPTHI` | _`cell - depth`_ | Returns the `i`-th depth of the cell.     |
| `CHASHIX` | _`cell i - depth`_ | Returns the `i`-th hash of the cell.     |
| `CDEPTHIX` | _`cell i - depth`_ | Returns the `i`-th depth of the cell.    |

The value of `i` is in the range `0..3`.

<Feedback />




================================================
FILE: docs/v3/documentation/tvm/changelog/tvm-upgrade-2025-02.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/tvm/changelog/tvm-upgrade-2025-02.md
================================================
import Feedback from '@site/src/components/Feedback';

# TVM upgrade Feb 2025


:::tip
This upgrade is active on the Mainnet since February 13, 2025. See details [here](https://t.me/tonstatus/153).
:::

This update is enabled with Config8 `version >= 9`.

## c7 tuple extension

The `c7` tuple parameter number **13** (previous blocks info tuple) now has a third element, containing IDs of the last 16 masterchain blocks with seqno divisible by 100.

Example: if the last masterchain block seqno is `19071`, the list contains block IDs with seqnos `19000, 18900, ..., 17500`.


## New TVM instructions - cryptographic and continuation operations

| Fift syntax                        | Stack                         | Description                                                                                                                                                                                                           |
| :--------------------------------- | :---------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SECP256K1_XONLY_PUBKEY_TWEAK_ADD` | *`key tweak - 0 or f x y -1`* | Performs `secp256k1_xonly_pubkey_tweak_add`. Inputs are two 256-bit unsigned integers (`key`, `tweak`). Returns a 65-byte public key as `uint8 f`, `uint256 x`, `uint256 y` (similar to `ECRECOVER`). Gas cost: 1276. |
| `mask SETCONTCTRMANY`              | *`cont - cont'`*              | For each bit set in `mask` (range 0..255), applies `c[i] PUSHCTR SWAP c[i] SETCONTCNR` to the continuation. Efficiently updates multiple continuations.                                                               |
| `SETCONTCTRMANYX`                  | *`cont mask - cont'`*         | Same as `SETCONTCTRMANY`, but reads `mask` from the stack.                                                                                                                                                            |
| `PREVMCBLOCKS_100`                 | *`- list`*                    | Returns the new third element in `c7[13]`: a list of 16 recent masterchain block IDs (where seqno is divisible by 100).                                                                                               |

## Execution and gas logic improvements

* When the `RAWRESERVE` action uses flag 4, the original balance is calculated as `balance - msg_balance_remaining`. Previously, this calculation did not work correctly if the storage fee exceeded the original balance.
* The gas cost for continuation jumps deeper than 8 levels is increased by one additional gas unit per extra level.
* Jumps to continuations with non-null control data now execute without error.
* The `RESERVE` action in mode +2 supports reserving extra currencies in addition to TON.
* Executing contract code from a library cell does not consume additional gas.
* Accounts with previously locked highload-v2 wallets are assigned higher gas limits to enable unlocking and improved operation.

## Error handling improvements

If these instructions encounter multiple error conditions, the TVM prioritizes `stk_und` (stack underflow) over other errors.

| Fift syntax           | Stack                                | Description                                                                                                                                                                                                                                                                                                           |
| --------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GETGASFEE`           | *`gas_used is_mc - price`*           | Calculates the computation cost in nanotons for a transaction that consumes `gas_used` gas.                                                                                                                                                                                                                           |
| `GETSTORAGEFEE`       | *`cells bits seconds is_mc - price`* | Calculates the storage fees in nanotons for the contract based on current storage prices. `cells` and `bits` represent the size of the [`AccountState`](https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L247) with deduplication, including the root cell. |
| `GETFORWARDFEE`       | *`cells bits is_mc - price`*         | Calculates forward fees in nanotons for an outgoing message. `is_mc` is true if the source or the destination is in the MasterChain and false if both are in the basechain.                                                                                                                                           |
| `GETORIGINALFWDFEE`   | *`fwd_fee is_mc - orig_fwd_fee`*     | Calculates `fwd_fee * 2^16 / first_frac`. Used to derive the original forwarding fee.                                                                                                                                                                                                                                 |
| `GETGASFEESIMPLE`     | *`gas_used is_mc - price`*           | Computes simplified gas cost using `(gas_used * price) / 2^16`.                                                                                                                                                                                                                                                       |
| `GETFORWARDFEESIMPLE` | *`cells bits is_mc - price`*         | Computes simplified forwarding fee using `(bits * bit_price + cells * cell_price) / 2^16`.                                                                                                                                                                                                                            |
| `HASHEXT`             | *`cell i - hash`*                    | Computes an extended hash of a cell at the given index.                                                                                                                                                                                                                                                               |
| `PFXDICTSET`          | *`x k D n – D0 −1 or D 0`*           | Sets a value in a prefix code dictionary. Fails if prefix constraints are violated.                                                                                                                                                                                                                                   |
| `PFXDICTREPLACE`      | *`x k D n – D0 −1 or D 0`*           | Replaces a value in a prefix code dictionary if constraints are satisfied.                                                                                                                                                                                                                                            |
| `PFXDICTADD`          | *`x k D n – D0 −1 or D 0`*           | Adds an entry to a prefix code dictionary. Fails if entry already exists.                                                                                                                                                                                                                                             |
| `PFXDICTDEL`          | *`k D n – D0 −1 or D 0`*             | Deletes an entry from a prefix code dictionary.                                                                                                                                                                                                                                                                     
## Emulator and validator improvements

Validator nodes now perform more reliable IP discovery by retrying DHT queries, making it easier to locate updated peers during upgrades or restarts. The validator console also displays dashed names and shard formats in a more readable format, helping operators better monitor network activity.

In the emulator, handling of library cells and extra currency operations has been improved to provide more accurate behavior during local testing. Support for extra currencies has been refined across both `rungetmethod` and reserve modes, ensuring compatibility for contracts that rely on multi-currency interactions.

## TL-B schema fixes

* Corrected CRC computations ensuring accurate validation of TL-B schema data.
* Fixed incorrect tags in Merkle proofs, improving proof reliability.
* Improved handling of `advance_ext` for better spec alignment.
* Fixed `NatWidth` print function to properly display natural width representations.

<Feedback />



================================================
FILE: docs/v3/documentation/tvm/specification/runvm.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/tvm/specification/runvm.mdx
================================================
import Feedback from '@site/src/components/Feedback';


# RUNVM specification

Currently, TVM does not provide a mechanism for executing external untrusted code within a secure sandbox environment. In other words, any external code invoked has unrestricted access and can permanently modify the contract's code and data or trigger actions such as transferring all funds.

The `RUNVM` instruction creates an isolated VM instance, allowing code execution while safely retrieving data such as stack state, registers, and gas consumption. This ensures the caller's state remains unaffected. This allows arbitrary code to run safely, which is helpful for [v4-style plugins](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts#wallet-v4), Tact's `init`-style subcontract calculations, and similar use cases.

| Fift syntax | Stack | Description                                                                                                                                                                                                                                                                                                                                                                                                          |
|:-|:-|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `flags RUNVM` | _`x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]`_ | Executes a child VM with the given `code` and stack values `x_1 ... x_n`. Returns the modified stack `x'_1 ... x'_m` along with an exit code. <br/> Flags determine other arguments and return values. See details below.|
| `RUNVMX` | _`x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] flags - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]`_ | It is the same as `RUNVM` but retrieves flags from the stack.                                                                                                                                                                                                                                                                                                                                                        |


Flags operate similarly to `RUNVMX` in Fift:

- `+1`: sets `c3` to code.
- `+2`: pushes an implicit `0` before executing the code. Note, it only works with +1 flag set
- `+4`: takes persistent data `c4` from the stack and returns its final value.
- `+8`: takes the gas limit `g_l` from the stack and returns the consumed gas `g_c`.
- `+16`: takes `c7` (smart contract context) from the stack.
- `+32`: returns the final value of `c5` (actions).
- `+64`: pops the hard gas limit `g_m` enabled by `ACCEPT` from the stack.
- `+128`: enables "isolated gas consumption", meaning the child VM maintains a separate set of visited cells and a `chksgn` counter.
- `+256`: pops an integer `r` and ensures exactly `r` values are returned from the top of the stack:
  - If `RUNVM` call succeeds and `r` is set, it returns `r` elements. If `r` is not set, it returns all available elements.
  - If `RUNVM` is successful but lacks elements on the stack, meaning the stack depth is less than `r`, it is treated as an exception in the child VM. The `exit_code` is set to `-3`, and `exit_arg` is set to `0`, so `0` is returned as the only stack element.
  - If `RUNVM` fails with an exception, only one element is returned, `exit_arg`, which should not be confused with `exit_code`.
  - In the case of running out of gas, `exit_code` is set to `-14`, and `exit_arg` contains the amount of gas.

Gas cost:
- 66 gas;
- 1 gas for each stack element passed to the child VM (the first 32 elements are free);
- 1 gas for each stack element returned from the child VM (the first 32 elements are free).

## See also

- [TVM instructions](/v3/documentation/tvm/instructions)

<Feedback />




================================================
FILE: docs/v3/documentation/tvm/tvm-exit-codes.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/tvm/tvm-exit-codes.md
================================================
---
title: Exit codes
---

import Feedback from '@site/src/components/Feedback';

Each transaction on TON Blockchain comprises [multiple phases](/v3/documentation/tvm/tvm-overview#transactions-and-phases). An _exit code_ is a 32-bit signed integer that indicates whether the [compute](#compute) or [action](#action) phase succeeded. When unsuccessful, it contains the exception code that occurred. Each exit code represents a specific exception or transaction outcome.

Exit codes 0 and 1 indicate standard (successful) execution of the [compute phase](#compute). Exit (or [result](#action)) code 0 indicates the standard (successful) execution of the [action phase](#action). Any other exit code indicates that a specific exception has occurred and that the transaction wasn't successful in one way or another, i.e., the transaction was reverted or the inbound message has bounced back.

> TON Blockchain reserves exit code values from 0 to 127, while Tact utilizes exit codes from 128 to 255. Note that exit codes used by Tact indicate contract errors, which can occur when using Tact-generated FunC code and are therefore thrown in the transaction's [compute phase](#compute) and not during the compilation.

The range from 256 to 65535 is free for developer-defined exit codes.

:::note
While exit codes are 32-bit signed integers in the TON, attempting to throw an exit code outside the 16-bit unsigned integer range (0-65535) will trigger an error with [exit code 5](#5). This intentionally prevents the artificial generation of specific exit codes like [-14](#-14).
:::

## Table of exit codes {#standard-exit-codes}

The following table lists exit codes with an origin (where it can occur) and a short description. The table doesn't list the exit codes from contracts. To see such exit codes, refer to the source code of the specific contract.

| Exit code | Origin                                 | Brief description                                                                                      |
| :-------- | :------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| 0         | [Compute][c] and [action][a] phases    | Standard successful execution exit code.                                                               |
| 1         | [Compute phase][c]                     | Alternative successful execution exit code. Reserved, but doesn't occur.                               |
| 2         | [Compute phase][c]                     | Stack underflow.                                                                                       |
| 3         | [Compute phase][c]                     | Stack overflow.                                                                                        |
| 4         | [Compute phase][c]                     | Integer overflow.                                                                                      |
| 5         | [Compute phase][c]                     | Range check error — some integer is out of its expected range.                                         |
| 6         | [Compute phase][c]                     | Invalid [TVM][tvm] opcode.                                                                             |
| 7         | [Compute phase][c]                     | Type check error.                                                                                      |
| 8         | [Compute phase][c]                     | Cell overflow.                                                                                         |
| 9         | [Compute phase][c]                     | Cell underflow.                                                                                        |
| 10        | [Compute phase][c]                     | Dictionary error.                                                                                      |
| 11        | [Compute phase][c]                     | As described in [TVM][tvm] documentation: "Unknown error, may be thrown by user programs"              |
| 12        | [Compute phase][c]                     | Fatal error thrown by [TVM][tvm] in unexpected situations                                              |
| 13        | [Compute phase][c]                     | Out of gas error.                                                                                      |
| -14       | [Compute phase][c]                     | Equivalent to code 13. A negative value prevents [imitation](#13)                                      |
| 14        | [Compute phase][c]                     | VM virtualization error (reserved but unused)                                                          |
| 32        | [Action phase][a]                      | Action list is invalid.                                                                                |
| 33        | [Action phase][a]                      | Action list is too long.                                                                               |
| 34        | [Action phase][a]                      | Action is invalid or not supported.                                                                    |
| 35        | [Action phase][a]                      | Invalid source address in outbound message.                                                            |
| 36        | [Action phase][a]                      | Invalid destination address in outbound message.                                                       |
| 37        | [Action phase][a]                      | Not enough Toncoin.                                                                                    |
| 38        | [Action phase][a]                      | Not enough extra currencies.                                                                           |
| 39        | [Action phase][a]                      | Outbound message does not fit into a cell after rewriting.                                             |
| 40        | [Action phase][a]                      | Cannot process a message — not enough funds, the message is too large, or its Merkle depth is too big. |
| 41        | [Action phase][a]                      | Library reference is null during library change action.                                                |
| 42        | [Action phase][a]                      | Library change action error.                                                                           |
| 43        | [Action phase][a]                      | Exceeded the maximum number of cells in the library or the maximum depth of the Merkle tree.           |
| 50        | [Action phase][a]                      | Account state size exceeded limits.                                                                    |
| 128       | Tact compiler ([Compute phase][c])     | Null reference exception. Configurable since Tact 1.6.                                                 |
| 129       | Tact compiler ([Compute phase][c])     | Invalid serialization prefix.                                                                          |
| 130       | Tact compiler ([Compute phase][c])     | Invalid incoming message — there's no receiver for the opcode of the received message.                 |
| 131       | Tact compiler ([Compute phase][c])     | Constraints error. Reserved, but never thrown.                                                         |
| 132       | Tact compiler ([Compute phase][c])     | Access denied — someone other than the owner sent a message to the contract.                           |
| 133       | Tact compiler ([Compute phase][c])     | Contract stopped. Reserved, but never thrown.                                                          |
| 134       | Tact compiler ([Compute phase][c])     | Invalid argument.                                                                                      |
| 135       | Tact compiler ([Compute phase][c])     | Code of a contract was not found.                                                                      |
| 136       | Tact compiler ([Compute phase][c])     | Invalid standard address.                                                                              |
| ~~137~~   | ~~Tact compiler ([Compute phase][c])~~ | ~~Masterchain support is not enabled for this contract.~~ Removed since Tact 1.6                       |
| 138       | Tact compiler ([Compute phase][c])     | Not a basechain address.                                                                               |

:::note
The exit code 65535 (`0xffff`) typically indicates the same issue as exit code `130` - an unrecognized message opcode. It is assigned manually when developing contracts rather than generated by [TVM][tvm] or the Tact compiler.
:::

## Exit codes in Blueprint projects {#blueprint}

In [Blueprint][bp] tests, exit codes from the [compute phase](#compute) are specified in the `exitCode` field of the object argument for the `toHaveTransaction()` method of the `expect()` matcher. The field for the result codes (exit codes from the [action phase](#action)) in the same `toHaveTransaction()` method is called `actionResultCode`.

Note that to do so, you'll have to do a couple of type checks before that:

```typescript
it('tests something, you name it', async () => {
  // Send a specific message to our contract and store the results
  const res = await your_contract_name.send(…);

  // Now, we have access to an array of executed transactions,
  // with the second one (index 1) being the one that we look for
  const tx = res.transactions[1]!;

  // To do something useful with it, let's ensure that its type is 'generic'
  // and that the compute phase wasn't skipped
  if (tx.description.type === "generic"
 && tx.description.computePhase.type === "vm") {
    // Finally, we're able to peek into the transaction for general details freely,
    // such as printing out the exit code of the compute phase if we so desire
 console.log(tx.description.computePhase.exitCode);
 }

  // ...
});
```

## Compute phase {#compute}

The [TVM][tvm] initialization and all computations occur during the [compute phase][c]. If this phase fails (resulting in an exit code other than 0 or 1), the transaction skips the [action phase](#action) and proceeds to generate bounce messages for transactions initiated by inbound messages.

### 0: Normal termination {#0}

This exit (or [result](#action)) code indicates a successful completion of the [compute](#compute) (or [action](#action)) phase of the transaction.

### 1: Alternative termination {#1}

This is an alternative exit code for successfully executing the [compute phase](#compute). Reserved, but never occurs.

### 2: Stack underflow {#2}

If some operation consumed more elements than there were on the stack, the error with exit code 2 is thrown: `Stack underflow`.

```tact
asm fun drop() { DROP }

contract Loot {
 receive("I solemnly swear that I'm up to no good") {
 try {
 // Removes 100 elements from the stack, causing an underflow
 repeat (100) { drop() }
 } catch (exitCode) {
 // exitCode is 2
 }
 }
}
```

### 3: Stack overflow {#3}

When you copy too many elements into a closure continuation, the system throws an error with exit code 3: `Stack overflow`. This error rarely occurs unless you work deep in Fift and TVM assembly trenches.

```tact
// Remember, kids, don't try to overflow the stack at home!
asm fun stackOverflow() {
 x{} SLICE        // s
 BLESS            // c
 0 SETNUMARGS     // c'
 2 PUSHINT        // c' 2
 SWAP             // 2 c'
 1 -1 SETCONTARGS // ← this blows up
}

contract ItsSoOver {
 receive("I solemnly swear that I'm up to no good") {
 try {
 stackOverflow();
 } catch (exitCode) {
 // exitCode is 3
 }
 }
}
```

### 4: Integer overflow {#4}

If the value in calculation goes beyond the range from `-2^{256} to 2^{256} - 1` inclusive, or there's an attempt to divide or modulo by zero, an error with exit code 4 is thrown: `Integer overflow`.

```tact
let x = -pow(2, 255) - pow(2, 255); // -2^{256}

try {
 -x; // integer overflow by negation
 // since the max positive value is 2^{256} - 1
} catch (exitCode) {
 // exitCode is 4
}

try {
 x / 0; // division by zero!
} catch (exitCode) {
 // exitCode is 4
}

try {
 x * x * x; // integer overflow!
} catch (exitCode) {
 // exitCode is 4
}

// There can also be an integer overflow when doing:
// addition (+),
// subtraction (-),
// division (/) by a negative number or modulo (%) by zero
```

### 5: Integer out of expected range {#5}

Range check error — some integers are out of their expected range. Any attempt to store an unexpected amount of data or specify an out-of-bounds value throws an error with exit code 5: `Integer out of expected range`.

Examples of specifying an out-of-bounds value:

```tact
try {
 // Repeat only operates on an inclusive range from 1 to 2^{31} - 1
 // and any valid integer value greater than that causes an error with exit code 5
 repeat (pow(2, 55)) {
 dump("smash. logs. I. must.");
 }
} catch (exitCode) {
 // exitCode is 5
}

try {
 // Builder.storeUint() function can only use up to 256 bits, so 512 is too much:
 let s: Slice = beginCell().storeUint(-1, 512).asSlice();
} catch (exitCode) {
 // exitCode is 5
}
```

### 6: Invalid opcode {#6}

If you specify an instruction that the current [TVM][tvm] version does not define or try to set an unsupported [code page](/v3/documentation/tvm/tvm-overview#tvm-state), the system throws an error with exit code 6: `Invalid opcode`.

```tact
// There's no such codepage, and attempt to set it fails
asm fun invalidOpcode() { 42 SETCP }

contract OpOp {
 receive("I solemnly swear that I'm up to no good") {
 try {
 invalidOpcode();
 } catch (exitCode) {
 // exitCode is 6
 }
 }
}
```

### 7: Type check error {#7}

If an argument to a primitive is of an incorrect value type or there's any other mismatch in types during the [compute phase](#compute), an error with exit code 7 is thrown: `Type check error`.

```tact
// The actual returned value type doesn't match the declared one
asm fun typeCheckError(): map<Int, Int> { 42 PUSHINT }

contract VibeCheck {
 receive("I solemnly swear that I'm up to no good") {
 try {
 // The 0th index doesn't exist
 typeCheckError().get(0)!!;
 } catch (exitCode) {
 // exitCode is 7
 }
 }
}
```

### 8: Cell overflow {#8}

> `Cell` is a [primitive][p] and a data structure, which ordinarly consists of up to 1023 continuously laid out bits and up to 4 references (refs) to other cells.

A 'Builder' is utilized to create a 'Cell'. If you attempt to store more than 1023 bits of data or exceed 4 references to other cells, an error with exit code 8 is thrown: `Cell overflow`.

```tact
// Too much bits
try {
 let data = beginCell()
 .storeInt(0, 250)
 .storeInt(0, 250)
 .storeInt(0, 250)
 .storeInt(0, 250)
 .storeInt(0, 24) // 1024 bits!
 .endCell();
} catch (exitCode) {
 // exitCode is 8
}

// Too much refs
try {
 let data = beginCell()
 .storeRef(emptyCell())
 .storeRef(emptyCell())
 .storeRef(emptyCell())
 .storeRef(emptyCell())
 .storeRef(emptyCell()) // 5 refs!
 .endCell();
} catch (exitCode) {
 // exitCode is 8
}
```

### 9: Cell underflow {#9}

> `Cell` is a [primitive][p] and a data structure, which ordinarly consists of up to 1023 continuously laid out bits and up to 4 references (refs) to other cells.

To parse a `Cell`, a `Slice` is used. If you try to load more data or references than `Slice` contains, an error with exit code 9 is thrown: `Cell underflow`.

```tact
// Too few bits
try {
 emptySlice().loadInt(1); // 0 bits!
} catch (exitCode) {
 // exitCode is 9
}

// Too few refs
try {
 emptySlice().loadRef(); // 0 refs!
} catch (exitCode) {
 // exitCode is 9
}
```

### 10: Dictionary error {#10}

In Tact, the `map<K, V>` type is an abstraction over the ["hash" map dictionaries of FunC](/v3/documentation/smart-contracts/func/docs/dictionaries#hash-map) and underlying [`HashmapE` type](/v3/documentation/data-formats/tlb/tl-b-types#hashmap) of [TL-B][tlb] and [TVM][tvm].

If there is an incorrect manipulation of dictionaries, such as improper assumptions about their memory layout, an error with exit code 10 is thrown: `Dictionary error`. Note that Tact prevents you from getting this error unless you do Fift and TVM assembly work yourself:

```tact
/// Pre-computed Int to Int dictionary with two entries — 0: 0 and 1: 1
const cellWithDictIntInt: Cell = cell("te6cckEBBAEAUAABAcABAgPQCAIDAEEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMLMbT1U=");

/// Tries to preload a dictionary from a Slice as a map<Int, Cell>
asm fun toMapIntCell(x: Slice): map<Int, Cell> { PLDDICT }

contract DictPic {
 receive("I solemnly swear that I'm up to no good") {
 try {
 // The code misinterprets the Int to Int dictionary as a map<Int, Cell>
 let m: map<Int, Cell> = toMapIntCell(cellWithDictIntInt.beginParse());

 //The error happens only when we touch it
 m.get(0)!!;
 } catch (exitCode) {
 // exitCode is 10
 }
 }
}
```

### 11: "Unknown" error {#11}

Described in [TVM][tvm] docs as "Unknown error, may be thrown by user programs", although most commonly used for problems with queueing a message send or problems with [get-methods](/v3/guidelines/smart-contracts/get-methods).

```tact
try {
 // Unlike nativeSendMessage, which uses SENDRAWMSG, this one uses SENDMSG,
 // and therefore fails in the Compute phase when the message is ill-formed
 nativeSendMessageReturnForwardFee(emptyCell(), 0);
} catch (exitCode) {
 // exitCode is 11
}
```

### 12: Fatal error {#12}

Fatal error. Thrown by TVM in situations deemed impossible.

### 13: Out of gas error {#13}

If there isn't enough gas to end computations in the [compute phase](#compute), the error with exit code 13 is thrown: `Out of gas error`.

But this code isn't immediately shown as is. Instead, the bitwise NOT operation is applied, changing the value from `13` to `-14`. Only then is the code shown.

This design prevents user contracts from artificially producing the `-14` code since all functions that throw exit codes can only specify integers ranging from `0 to 65535` inclusive.

```tact
try {
 repeat (pow(2, 31) - 1) {}
} catch (exitCode) {
 // exitCode is -14
}
```

### -14: Out of gas error {#-14}

See [exit code 13](#13).

### 14: Virtualization error {#14}

Virtualization error related to [prunned branch cells](/v3/documentation/data-formats/tlb/exotic-cells#pruned-branch). Reserved, but never thrown.

## Action phase {#action}

The [action phase][a] is processed after the successful execution of the [compute phase](#compute). It attempts to perform the actions stored in the action list by [TVM][tvm] during the compute phase.

Some actions may fail during processing, in which case the system may skip them or revert the entire transaction, depending on the action modes. Developers call the code that indicates the resulting state of the [action phase][a] a _result code_. Since this code serves the same purpose as the compute phase's exit code, developers commonly refer to it as an exit code too.

### 32: Action list is invalid {#32}

If the list of actions contains [exotic cells][exotic], an action entry cell does not have references, or some action entry cell couldn't be parsed, an error with exit code 32 is thrown: `Action list is invalid`.

Aside from this exit code, there's a boolean flag `valid`, which you can find under `description.actionPhase.valid` in the transaction results when working with [Sandbox and Blueprint](#blueprint). The transaction can set this flag to `false` even when the action phase throws some other exit code.

### 33: Action list is too long {#33}

If you queue more than 255 actions for execution, the [action phase](#action) throws an error with exit code 33: `Action list is too long`.

```tact
// For example, let's attempt to queue reservations of a specific amount of nanoToncoins
// This won't fail in the compute phase but will result in exit code 33 in the action phase
repeat (256) {
 nativeReserve(ton("0.001"), ReserveAtMost);
}
```

### 34: Invalid or unsupported action {#34}

Currently, only four actions are supported: changing the contract code, sending a message, reserving a specific amount of `nanoToncoins`, and changing the library cell. If there's any issue with the specified action (invalid message, unsupported action, etc.), an error with exit code 34 is thrown: `Invalid or unsupported action`.

```tact
// For example, let's try to send an ill-formed message:
nativeSendMessage(emptyCell(), 0); // won't fail in compute phase,
 // but will result in exit code 34 in the action phase
```

### 35: Invalid source address in outbound message {#35}

If the source address in the outbound message isn't equal to [`addr_none`](/v3/documentation/data-formats/tlb/msg-tlb#addr_none00) or to the address of the contract that initiated this message, an error with exit code 35 is thrown: `Invalid source address in the outbound message`.

### 36: Invalid destination address in outbound message {#36}

Suppose the destination address in the outbound message is invalid. In that case, e.g., it doesn't conform to the relevant [TL-B][tlb] schemas, contains an unknown workchain ID, or has an invalid length for the given workchain, an error with exit code 36 is thrown: `Invalid destination address in the outbound message`.

:::note
If the [optional flag +2][flag2] is set, this error will not be thrown, and the given message will not be sent.
:::

### 37: Not enough Toncoin {#37}

If all funds of the inbound message with [mode 64](/v3/documentation/smart-contracts/message-management/message-modes-cookbook#mode64) had been already consumed and there's not enough funds to pay for the failed action, or the [TL-B][tlb] layout of the provided value ([`CurrencyCollection`](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection)) is invalid, or there are not enough funds to pay forward fees or not enough funds after deducting fees, an error with exit code 37 is thrown: `Not enough Toncoin`.

:::note
If the [optional flag +2][flag2] is set, this error will not be thrown, and the given message will not be sent.
:::

### 38: Not enough extra currencies {#38}

Besides the native currency, Toncoin, TON Blockchain supports up to 2^{32} extra currencies. They differ from making new jettons because extra currencies are natively supported — one can potentially specify an extra [`HashmapE`](/v3/documentation/data-formats/tlb/tl-b-types#hashmap) of extra currency amounts in addition to the Toncoin amount in the internal message to another contract. Unlike Jettons, extra currencies can only be stored and transferred and do not have any other functionality.

Currently, **there are no extra currencies** on TON Blockchain, but the exit code 38 is reserved for cases when there is not enough extra currency to send the specified amount: `Not enough extra currencies`.

:::note
[Extra currencies](/v3/documentation/dapps/defi/coins) in TON Docs.

[Extra currency mining](/v3/documentation/infra/minter-flow) in TON Docs.
:::

### 39: Outbound message doesn't fit into a cell {#39}

When processing the message, TON Blockchain tries to pack it according to the [relevant TL-B schemas](/v3/documentation/data-formats/tlb/msg-tlb). If it cannot, an error with exit code 39 is thrown: `Outbound message doesn't fit into a cell`.

:::note
If the [optional flag +2][flag2] is set, this error will not be thrown, and the given message will not be sent.
:::

### 40: Cannot process a message {#40}

If there are insufficient funds to process all the cells in a message, the message is too large, or its Merkle depth is too big, an error with exit code 40 is thrown: `Cannot process a message`.

:::note
If the [optional flag +2][flag2] is set, this error will not be thrown, and the given message will not be sent.
:::

### 41: Library reference is null {#41}

If the library reference was required during the library change action but was null, an error with exit code 41 is thrown: `Library reference is null`.

### 42: Library change action error {#42}

If an error occurs during an attempt to perform a library change action, an error with exit code 42 is thrown: `Library change action error`.

### 43: Library limits exceeded {#43}

Suppose the maximum number of cells in the library or the maximum depth of the Merkle tree is exceeded. In that case, an error with exit code 43 is thrown: `Library limits exceeded`.

### 50: Account state size exceeded limits {#50}

If the account state (contract storage, essentially) exceeds any of the limits specified in [config param 43 of TON Blockchain](/v3/documentation/network/configs/blockchain-configs#param-43) by the end of the [action phase](#action), an error with exit code `50` is thrown: `Account state size exceeded limits`.

If the configuration is absent, the default values are:

- `max_msg_bits` equals `2^{21}` — maximum message size in bits.
- `max_msg_cells` equals `2^{13}` — maximum number of cells a message can occupy.
- `max_library_cells` equals `1000` — maximum number of cells that can be used as [library reference cells][lib].
- `max_vm_data_depth` equals `2^{9}` — maximum cells depth in messages and account state.
- `ext_msg_limits.max_size` equals `65535` — maximum external message size in bits.
- `ext_msg_limits.max_depth` equals `2^{9}` — maximum external message depth.
- `max_acc_state_cells` equals `2^{16}` — maximum number of cells an account state can occupy.
- `max_acc_state_bits` equals `2^{16} * 1023` — maximum account state size in bits.
- `max_acc_public_libraries` equals `2^{8}` — maximum number of [library reference cells][lib] that an account state can use on the masterchain.
- `defer_out_queue_size_limit` equals `2^{8}` — maximum number of outbound messages to be queued (regards validators and collators).

## Tact compiler

Tact utilizes exit codes from `128` to `255`. Note that exit codes used by Tact indicate contract errors that can occur when using Tact-generated FunC code and are therefore thrown in the transaction's [compute phase](#compute) and not during the compilation.

The list of exit codes for the Tact compiler is in the [Tact docs](https://docs.tact-lang.org/book/exit-codes/#tact-compiler).

[c]: /v3/documentation/tvm/tvm-overview#compute-phase
[a]: /v3/documentation/tvm/tvm-overview#transactions-and-phases
[flag2]: /v3/documentation/smart-contracts/message-management/message-modes-cookbook#mode2
[tlb]: /v3/documentation/data-formats/tlb/tl-b-language
[lib]: /v3/documentation/data-formats/tlb/exotic-cells#library-reference
[p]: /v3/documentation/smart-contracts/func/docs/types#atomic-types
[tvm]: /v3/documentation/tvm/tvm-overview
[bp]: https://github.com/ton-org/blueprint
[fift]: /v3/documentation/fift/fift-and-tvm-assembly

<Feedback />



================================================
FILE: docs/v3/documentation/tvm/tvm-initialization.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/tvm/tvm-initialization.md
================================================
import Feedback from '@site/src/components/Feedback';

# TVM initialization

:::info
To maximize your comprehension of this page,
it is highly recommended to familiarize yourself with the [TL-B language](/v3/documentation/data-formats/tlb/cell-boc).
- [TVM retracer](https://retracer.ton.org/)
  :::

TVM is invoked during the computing phase of ordinary and other transactions.

## Initial state

A new instance of TVM is initialized before executing a smart contract as follows:

- The original **cc**, current continuation, is initialized using the cell slice created from the `code` section of the smart contract. If the account is frozen or uninitialized, the code must be provided in the `init` field of the incoming message.

- The **cp**, current TVM codepage, is set to the default value of 0. If the smart contract needs to use another TVM codepage _x_, it must switch to it by using `SETCODEPAGE` _x_ as the first instruction in its code.

- The **gas limits** values are initialized based on the results of the credit phase.

- The **library context** computation is [described below](#library-context).

- The **stack** initialization process depends on the event that triggered the transaction, and its contents are [described below](#stack).

- Control register **c0** is initialized with the extraordinary continuation `ec_quit` with parameter 0. When executed, this continuation terminates TVM with exit code 0.

- Control register **c1** is initialized with the extraordinary continuation `ec_quit` with parameter 1. When invoked, it terminates TVM with exit code 1. Both exit codes 0 and 1 are considered successful terminations of TVM.

- Control register **c2** is initialized with the extraordinary continuation `ec_quit_exc`. When invoked, it takes the top integer from the stack equal to the exception number and terminates TVM with that exit code. By default, all exceptions terminate the smart contract execution with the exception number as the exit code.

- Control register **c3** is initialized with the cell containing the smart contract code, similar to **cc** described above.

- Control register **c4** is initialized with the smart contract's persistent data from its `data` section. If the account is frozen or uninitialized, this data must be provided in the `init` field of the incoming message. Only the root of the data is loaded initially; TVM loads additional cells by their references when accessed, enabling a virtual memory mechanism.

- Control register **c5** is initialized with an empty cell. The "output action" primitives of TVM, such as `SENDMSG`, accumulate output actions (for example, outbound messages) in this register, which are performed upon successful termination of the smart contract. The TL-B scheme for its serialization is [described below](#control-register-c5).

- Control register **c7** (root of temporary data) is initialized as a tuple, and its structure is [described below](#control-register-c7).

## Library context

A smart contract's library context/environment is a hashmap that maps 256-bit cell hashes to the corresponding cells. When an external cell reference is accessed during the smart contract's execution, the cell is looked up in the library environment, and the external cell reference is transparently replaced by the found cell.

The library environment for a smart contract invocation is computed as follows:
1. The global library environment for the current workchain is taken from the current state of the MasterChain.
2. It's augmented by the local library environment of the smart contract, stored in the `library` field of the smart contract's state. Only 256-bit keys equal to the hashes of the corresponding value cells are considered. The local environment takes precedence if a key is present in both the global and local library environments.
3. Finally, it's augmented by the `library` field of the `init` field of the incoming message. If the account is frozen or uninitialized, the `library` field of the message is used instead of the local library environment. The message library has lower precedence than local and global library environments.

The most common way to create shared libraries for TVM is to publish a reference to the library's root cell in the MasterChain.

## Stack

The TVM stack is initialized after the initial state of the TVM is set up. The contents of the stack depend on the event that triggered the transaction:
- Internal message
- External message
- Tick-tock
- Split prepare
- Merge install

The last item pushed to the stack is always the _function selector_, an _integer_ that identifies the event that caused the transaction.

### Internal message

In the case of an internal message, the stack is initialized by pushing the arguments to the `main()` function of the smart contract as follows:
- The balance _b_ of the smart contract is passed as an _integer_ amount of nanotons after crediting the value of the inbound message.
- The balance _b_<sub>m</sub> of the inbound message _m_ is passed as an _integer_ amount of nanotons.
- The inbound message _m_ is passed as a cell, which contains a serialized value of type _Message X_, where _X_ is the message body type.
- The body _m_<sub>b</sub> of the inbound message, equal to the value of the `body` field of _m_, is passed as a cell slice.
- The function selector _s_, normally equal to 0.

After that, the smart contract's code, equal to its initial value of **c3**, is executed. It selects the correct function based on _s_, which is expected to process the remaining arguments and terminate.

### External message

An inbound external message is processed similarly to the [internal message described above](#internal-message), with the following modifications:
- The function selector _s_ is set to -1.
- The balance _b_<sub>m</sub> of the inbound message is always 0.
- The initial current gas limit _g_<sub>l</sub> is always 0. However, the initial gas credit _g_<sub>c</sub> > 0.

The smart contract must terminate with either _g_<sub>c</sub> = 0 or _g_<sub>r</sub> ≥ _g_<sub>c</sub>. If this condition isn't met, the transaction and the block containing it are considered invalid. Validators or collators proposing a block candidate must ensure that transactions processing inbound external messages are valid and exclude invalid ones.

### Tick and tock

In the case of tick and tock transactions, the stack is initialized by pushing the arguments to the `main()` function of the smart contract as follows:
- The balance _b_ of the current account is passed as an _integer_ amount of nanotons.
- The 256-bit address of the current account inside the MasterChain as an unsigned _integer_.
- An integer equal to 0 for tick transactions and to -1 for tock transactions.
- The function selector _s_, equal to -2.

### Split prepare

In the case of a split prepare transaction, the stack is initialized by pushing the arguments to the `main()` function of the smart contract as follows:
- The balance _b_ of the current account is passed as an _integer_ amount of nanotons.
- A _slice_ containing _SplitMergeInfo_.
- The 256-bit address of the current account.
- The 256-bit address of the sibling account.
- An integer 0 ≤ _d_ ≤ 63, equal to the position of the only bit in which the addresses of the current and sibling accounts differ.
- The function selector _s_, equal to -3.

### Merge install

In the case of a merge install transaction, the stack is initialized by pushing the arguments to the `main()` function of the smart contract as follows:
- The balance _b_ of the current account (already combined with the nanoton balance of the sibling account) is passed as an _integer_ amount of nanotons.
- The balance _b'_ of the sibling account, taken from the inbound message _m_, is passed as an _integer_ amount of nanotons.
- A merge prepare transaction automatically generates the message _m_ from the sibling account. Its `init` field contains the final state of the sibling account. The message is passed as a cell, which contains a serialized value of type _Message X_, where _X_ is the message body type.
- A _StateInit _ represents the state of the sibling account.
- A _slice_ containing _SplitMergeInfo_.
- The 256-bit address of the current account.
- The 256-bit address of the sibling account.
- An integer 0 ≤ _d_ ≤ 63, equal to the position of the only bit in which the addresses of the current and sibling accounts differ.
- The function selector _s_, equal to -4.

## Control register c5

The output actions of a smart contract are accumulated in the cell stored in the control register **c5**: the cell contains the last action in the list and a reference to the previous one, forming a linked list.

The list can also be serialized as a value of type _OutList n_, where _n_ is the length of the list:

```tlb
out_list_empty$_ = OutList 0;

out_list$_ {n:#}
  prev:^(OutList n)
  action:OutAction
  = OutList (n + 1);

out_list_node$_
  prev:^Cell
  action:OutAction = OutListNode;
```

The list of possible actions includes:
- `action_send_msg` — for sending an outbound message
- `action_set_code` — for setting an opcode
- `action_reserve_currency` — for storing a currency collection
- `action_change_library` — for changing the library

As described in the corresponding TL-B scheme:

```tlb
action_send_msg#0ec3c86d
  mode:(## 8) 
  out_msg:^(MessageRelaxed Any) = OutAction;
  
action_set_code#ad4de08e
  new_code:^Cell = OutAction;
  
action_reserve_currency#36e6b809
  mode:(## 8)
  currency:CurrencyCollection = OutAction;

libref_hash$0
  lib_hash:bits256 = LibRef;
libref_ref$1
  library:^Cell = LibRef;
action_change_library#26fa1dd4
  mode:(## 7) { mode <= 2 }
  libref:LibRef = OutAction;
```

## Control register c7

Control register **c7** contains the root of temporary data as a tuple, formed by a _SmartContractInfo_ type, which includes basic blockchain context data such as time, global config, etc. The following TL-B scheme describes it:

```tlb
smc_info#076ef1ea
  actions:uint16 msgs_sent:uint16
  unixtime:uint32 block_lt:uint64 trans_lt:uint64 
  rand_seed:bits256 balance_remaining:CurrencyCollection
  myself:MsgAddressInt global_config:(Maybe Cell) = SmartContractInfo;
```

The first component of this tuple is an _integer_ value, always equal to 0x076ef1ea, followed by nine named fields:

| Field               | Type                                                                                | Description                                                                                                                                                                                         |
|---------------------|-------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `actions`           | uint16                                                                              | Initially set to 0, but incremented by one whenever a non-RAW output action primitive is executed                                                                                                   |
| `msgs_sent`         | uint16                                                                              | Number of messages sent                                                                                                                                                                             |
| `unixtime`          | uint32                                                                              | Unix timestamp in seconds                                                                                                                                                                           |
| `block_lt`          | uint64                                                                              | Represents the logical time of the previous block of this account. [More about logical time](/v3/documentation/smart-contracts/message-management/messages-and-transactions#what-is-a-logical-time) |
| `trans_lt`          | uint64                                                                              | Represents the logical time of the previous transaction of this account                                                                                                                             |
| `rand_seed`         | bits256                                                                             | Initialized deterministically starting from `rand_seed` of the block, the account address, the hash of the incoming message being processed (if any), and the transaction logical time `trans_lt`   |
| `balance_remaining` | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Remaining balance of the smart contract                                                                                                                                                             |
| `myself`            | [MsgAddressInt](/v3/documentation/data-formats/tlb/msg-tlb#msgaddressint-tl-b)      | Address of this smart contract                                                                                                                                                                      |
| `global_config`     | (Maybe Cell)                                                                        | Contains information about the global config                                                                                                                                                        |

Note that in the upcoming upgrade to the TVM, the **c7** tuple was extended from 10 to 14 elements. Read more about it [here](/v3/documentation/tvm/changelog/tvm-upgrade-2023-07).

## See also

- Original description of [TVM initialization](https://docs.ton.org/tblkch.pdf#page=89&zoom=100) from the whitepaper
<Feedback />




================================================
FILE: docs/v3/documentation/tvm/tvm-overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/tvm/tvm-overview.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'

# Overview of TVM

The TON Virtual Machine (TVM) executes all TON smart contracts. TVM operates on the **stack principle**, which ensures efficiency and ease of implementation.

This document provides a high-level overview of how TVM processes transactions.

:::tip
- **TVM source**: [TVM C++ implementation](https://github.com/ton-blockchain/ton/tree/master/crypto/vm)
- [TVM retracer](https://retracer.ton.org/)
:::

## TON course: TVM

:::tip
Before starting the course, ensure you have a solid understanding of blockchain basics. If you need to fill knowledge gaps, consider taking the [Blockchain basics with TON](https://stepik.org/course/201294/promo) course ([RU version](https://stepik.org/course/202221/), [CHN version](https://stepik.org/course/200976/)).
:::

The [TON blockchain course](https://stepik.org/course/176754/) is a comprehensive guide to TON blockchain development. Module 2 covers **TVM**, transactions, scalability, and business cases in detail.

<Button href="https://stepik.org/course/176754/promo"
        colorType={'primary'} sizeType={'sm'}>

Explore TON blockchain course

</Button>

<Button href="https://stepik.org/course/201638/promo"
        colorType={'secondary'} sizeType={'sm'}>

CHN

</Button>

<Button href="https://stepik.org/course/201855/promo"
        colorType={'secondary'} sizeType={'sm'}>

RU

</Button>

## Transactions and phases

When an event occurs on an account in the TON blockchain, it triggers a **transaction**. The most common event is receiving a message, but other events like `tick-tock`, `merge`, and `split` can also initiate transactions.

Each transaction consists of up to five phases:

1. **Storage phase**: calculates storage fees for the contract based on the space it occupies in the blockchain state. Learn more in [storage fees](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#storage-fee).
2. **Credit phase**: updates the contract's balance by accounting for incoming message values and storage fees.
3. **Compute phase**: executes the contract code on TVM. The result includes `exit_code`, `actions`, `gas_details`, `new_storage`, and other data.
4. **Action phase**: processes actions from the compute phase if it succeeds. Actions may include sending messages, updating contract code, or modifying libraries. If an action fails, for example, due to lack of funds, the transaction may revert or skip the action, depending on its mode (`send-or-revert` or `try-send-if-no-ignore`).
5. **Bounce phase**: if the compute phase fails (`exit_code >= 2`), this phase generates a bounce message for transactions initiated by an incoming message.

## Compute phase

The compute phase involves executing the contract code on TVM.

:::tip
- **TVM 4.3.5**: [TON Blockchain paper](https://docs.ton.org/assets/files/tblkch-6aaf006b94ee2843a982ebf21d7c1247.pdf)
:::

### When the compute phase is skipped

The compute phase may be skipped under certain conditions, such as when the account is missing, uninitialized, or frozen, or when the incoming message lacks code or data fields. These scenarios are represented by specific constructors:

- `cskip_no_state$00`: the account or message lacks a valid state (for example, [missing code or data](https://testnet.tonviewer.com/transaction/7e78394d082882375a5d21affa6397dec60fc5a3ecbea87f401b0e460fb5c80c)).
- `cskip_bad_state$01`: the message contains an invalid state (for example, incorrect hash) for a frozen or uninitialized account.
- `cskip_no_gas$10`: the account lacks enough funds to cover gas costs (less than ~0.00004 TON as of [August 2024](https://testnet.tonviewer.com/transaction/9789306d7b29318c90477aa3df6599ee4a897031162ad41a24decb87db65402b)).

### TVM state

At any point, the TVM state is defined by six properties:
- **Stack**: a last-in-first-out data structure.
- **Control registers**: up to 16 variables that can be directly accessed during execution.
- **Current continuation**: describes the sequence of instructions being executed.
- **Current codepage**: specifies the TVM version in use.
- **Gas limits**: includes the current gas limit (`g<sub>l</sub>`), maximum gas limit (`g<sub>m</sub>`), remaining gas (`g<sub>r</sub>`), and gas credit (`g<sub>c</sub>`).
- **Library context**: a hashmap of libraries available for TVM.

### TVM as a stack machine

TVM operates as a stack machine, supporting seven variable types:
- **Non-cell types**:
  - Integer: signed 257-bit integers.
  - Tuple: ordered collections of up to 255 elements.
  - Null.
- **Cell types**:
  - Cell: basic data structure for storing information.
  - Slice: allows reading data from a cell.
  - Builder: enables creating new cells.
  - Continuation: treats a cell as a source of TVM instructions.

### Control registers

- `c0`: stores the next or return continuation, similar to a return address.
- `c1`: stores the alternative continuation.
- `c2`: contains the exception handler. Continuation.
- `c3`: holds the current dictionary like a hashmap of functions codes. Continuation.
- `c4`: stores the persistent data (contract's `data` section). Cell.
- `c5`: contains output actions. Cell.
- `c7`: stores temporary data. Tuple.

### Initializing TVM

TVM initializes during the compute phase and executes commands/opcodes from the **current continuation** until no more commands remain. For a detailed explanation, see [TVM initialization](/v3/documentation/tvm/tvm-initialization).

## TVM instructions

For a complete list of TVM instructions, visit [TVM instructions](/v3/documentation/tvm/instructions).

### Results of TVM execution

Besides `exit_code` and gas consumption, TVM outputs:
- `c4`: the new `data` cell for the contract (if execution succeeds).
- `c5`: a cell containing output actions.

Other register values are discarded. Note:
- The maximum cell depth during execution is `<1024`, but `c4` and `c5` must not exceed a depth of `512`.
- A contract can't create more than 255 output actions.

:::tip
To send more than 255 messages, a contract can send a message to itself with a request to process the remaining messages. See an example in the [highload wallet contract](https://github.com/ton-blockchain/highload-wallet-contract-v3/blob/main/contracts/highload-wallet-v3.func#L50).
:::

## See also

- [TVM instructions](/v3/documentation/tvm/instructions)
- [TON TVM concepts](https://ton.org/tvm.pdf) (may include outdated information)

<Feedback />




================================================
FILE: docs/v3/documentation/whitepapers/overview.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/whitepapers/overview.md
================================================
import Feedback from '@site/src/components/Feedback';

# Whitepapers

This section contains the original documentation written by _Dr. Nikolai Durov_, providing a comprehensive overview of all aspects of TON.


## Original documentation

:::info
The code, comments, and documentation may reference "gram" and "nanogram." These are remnants of the original TON code developed by Telegram. Gram cryptocurrency was never issued. The official currency of TON is Toncoin, while the currency of the TON Testnet is Test Toncoin.
:::



* [TON Whitepaper](https://docs.ton.org/ton.pdf) - an overview of the TON (The Open Network) Blockchain.

* [TON Virtual Machine](https://docs.ton.org/tvm.pdf) description may contain outdated opcode information; the current list is available in the [TVM instruction](/v3/documentation/tvm/tvm-overview) section.

* [TON Blockchain](https://docs.ton.org/tblkch.pdf) description, which may contain outdated information.

* [Catchain Consensus Protocol](https://docs.ton.org/catchain.pdf) – an explanation of the Byzantine Fault Tolerant (BFT) consensus protocol utilized by the TON Blockchain for block creation.
  
* [Fift Documentation](https://docs.ton.org/fiftbase.pdf) – a guide to the Fift programming language and its application within TON.


## Translations
- [TON Whitepapers in Russian](https://github.com/Korolyow/TON_docs_ru) – a community-created Russian version of the TON Whitepapers. The TON Foundation cannot guarantee the quality of the translation. 
- [TON Whitepapers in Traditional Chinese](https://github.com/awesome-doge/TON_Paper/blob/main/zh_ton.pdf) – a community-created Traditional Chinese version of the TON Whitepapers. The TON Foundation cannot guarantee the quality of the translation. 
- [TON Whitepapers in Simplified Chinese](https://github.com/kojhliang/Ton_White_Paper_SC/blob/main/Ton%E5%8C%BA%E5%9D%97%E9%93%BE%E7%99%BD%E7%9A%AE%E4%B9%A6_%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%E7%89%88.pdf) – a community-created Simplified Chinese version of the TON Whitepapers. The TON Foundation cannot guarantee the quality of the translation.

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/apis-sdks/api-keys.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/apis-sdks/api-keys.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# How to retrieve a TON Center API key

## Overview

When using the TON HTTP API, a token (API key) is generally not required. However, having a key removes request limitations. There are several available plans, all of which can be viewed in Toncenter mini app.

## How to get a key

To get a key, visit [@toncenter](https://t.me/toncenter), press the `start` button, and follow the on-screen instructions.

![Telegram Bot](/img/registration-process/telegram-bot.png)

Press the `Manage API Keys` or `Toncenter` button to open the Telegram Mini App.

![Toncenter Main Mini App](/img/registration-process/toncenter-main-miniapp.png)

Press `Create API Key`.

![Create API Key](/img/registration-process/create-api-key.png)

Fill in the required fields and press `Create`. That's it! Your API key is now ready for use in requests.

## How to update the subscription plan

To update your subscription plan, follow these steps:

- Click the `MANAGE` at the top of the app to open the plan selection window.
- Choose a plan and click `Purchase Subscription`.
- Send the required amount of TON to the provided address.

## Troubleshooting

If the TON Center mini app does not work properly, your Telegram app may be outdated. Try updating Telegram and try again.

<Feedback />



================================================
FILE: docs/v3/guidelines/dapps/apis-sdks/api-types.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/apis-sdks/api-types.md
================================================
import Feedback from '@site/src/components/Feedback';

# API types

**High availability blockchain APIs are essential for developing secure, efficient, and scalable applications on TON.**

- [TON HTTP API](/v3/guidelines/dapps/apis-sdks/ton-http-apis) — An API that allows working with the _indexed blockchain information_.
- [TON ADNL API](/v3/guidelines/dapps/apis-sdks/ton-adnl-apis) — A secure API for communicating with TON using the ADNL protocol.
  
:::tip TON Infrastructure Status
* [status.toncenter](https://status.toncenter.com/) - Displays various node activity statistics from the last hour.
* [Tonstat.us](https://tonstat.us/) - A real-time Grafana dashboard, updated every 5 minutes.
:::

## TON Center APIs
- [TON Index](https://toncenter.com/api/v3/) - Collects data from a full node into a PostgreSQL database and provides a convenient API for accessing indexed blockchain data.
- [toncenter/v2](https://toncenter.com/) - Enables HTTP access to TON Blockchain, allowing developers to retrieve account and wallet information, look up blocks and transactions, send messages to the blockchain, call smart contract methods, and more.

## Third-party APIs
- [tonapi.io](https://docs.tonconsole.com/tonapi) - A fast indexed API that provides basic data about accounts, transactions, blocks, application-specific data about NFT, auctions, jettons, TON DNS, and subscriptions. It also offers annotated transaction chain data.
- [TONX API](https://docs.tonxapi.com/) - Designed for seamless dApp development, this API provides easy access to various tools and data.
- [dton.io](https://dton.io/graphql/) - A GraphQL API that delivers data on accounts, transactions, and blocks, as well as application-specific data about NFT, auctions, jettons, and TON DNS.
- [ton-api-v4](https://mainnet-v4.tonhubapi.com) - A lightweight API optimized for speed through aggressive CDN caching
- [docs.nftscan.com](https://docs.nftscan.com/reference/ton/model/asset-model) - NFT APIs for TON Blockchain.
- [everspace.center](https://everspace.center/toncoin) - A simple RPC API for accessing TON Blockchain.


## Additional APIs

### Toncoin rate APIs

* https://docs.tonconsole.com/tonapi/rest-api/rates
* https://coinmarketcap.com/api/documentation/v1/ 
* https://apiguide.coingecko.com/getting-started


### Address convert APIs


:::info
It is preferable to convert addresses using a local algorithm. See [Addresses](/v3/documentation/smart-contracts/addresses) section of documentation for details.
:::


#### From friendly to raw form

/api/v2/unpackAddress

Curl
```curl
curl -X 'GET' \
'https://toncenter.com/api/v2/unpackAddress?address=EQApAj3rEnJJSxEjEHVKrH3QZgto_MQMOmk8l72azaXlY1zB' \
-H 'accept: application/json'
```

Response body
```curl
{
"ok": true,
"result": "0:29023deb1272494b112310754aac7dd0660b68fcc40c3a693c97bd9acda5e563"
}
```

#### From friendly to raw form

/api/v2/packAddress

Curl
```curl
curl -X 'GET' \
'https://toncenter.com/api/v2/packAddress?address=0%3A29023deb1272494b112310754aac7dd0660b68fcc40c3a693c97bd9acda5e563' \
-H 'accept: application/json'
```

Response body
```json
{
  "ok": true,
  "result": "EQApAj3rEnJJSxEjEHVKrH3QZgto/MQMOmk8l72azaXlY1zB"
}
```



## See also
* [TON HTTP API](/v3/guidelines/dapps/apis-sdks/ton-http-apis)
* [List of SDKs](/v3/guidelines/dapps/apis-sdks/sdk)
* [TON cookbook](/v3/guidelines/dapps/cookbook)

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/apis-sdks/getblock-ton-api.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/apis-sdks/getblock-ton-api.md
================================================
import Feedback from '@site/src/components/Feedback';

# HTTP API by GetBlock

:::tip TON infrastructure status
* [status.toncenter](https://status.toncenter.com/) - Provides various statistics of node activity in the last hour.
* [Tonstat.us](https://tonstat.us/) - A real-time Grafana dashboard that updates every 5 minutes.
  :::

This guide covers essential steps in acquiring and using private RPC endpoints by GetBlock to access TON Blockchain.

:::info
[GetBlock](https://getblock.io/) is a Web3 infrastructure provider that offers HTTP-based API endpoints for clients to interact with multiple blockchain networks, including TON.
:::

## How to access TON Blockchain endpoints
To start using GetBlock’s endpoints, users need to log in to their accounts, and retrieve a TON endpoint URL. Follow these instructions:

### 1. Create a GetBlock account
Visit the GetBlock [website](https://getblock.io/?utm_source=external&utm_medium=article&utm_campaign=ton_docs) and click on the "Get Started for Free" button. Sign up using your email address or by connecting your MetaMask wallet.

![**GetBlock.io_main_page**](/img/docs/getblock-img/unnamed-2.png?=RAW)


### 2. Select TON Blockchain
After signing in, go to the "My Endpoints" section. Choose TON from the "Protocols" dropdown menu and select the desired network and API type (JSON-RPC or JSON-RPC(v2)).

![**GetBlock_account__dashboard**](/img/docs/getblock-img/unnamed-4.png)

### 3. Generate your endpoint URL
Click the **Get** button to generate your TON Blockchain endpoint URL. The structure of the endpoint will be: `https://go.getblock.io/[ACCESS TOKEN]/`.

Access tokens act as unique identifiers for your requests, eliminating the need for separate API keys or authorization headers.

Users have the flexibility to generate multiple endpoints, roll tokens if compromised, or delete unused endpoints.

![**GetBlock_account_endpoints**](/img/docs/getblock-img/unnamed-3.png)

Now, you can use these URLs to interact with TON Blockchain, query data, send transactions, and build decentralized applications without the hassle of infrastructure setup and maintenance.

### Free requests and user limits

Each registered user receives 40,000 free requests per day, with a cap of 60 requests per second (RPS). This balance is renewed daily and can be used for any supported blockchain.

### Shared nodes

- Entry-level opportunity where same nodes are utilized by several clients simultaneously;
- Rate limit increased to 200 RPS;
- Well-suited for individual use or for applications that have lower transaction volumes and resource requirements compared to fully-scaled production applications;
- A more affordable option for individual developers or small teams with limited budgets.

Shared nodes provide a cost-effective solution for accessing TON Blockchain infrastructure without the need for significant upfront investment or commitment.

As developers scale their applications and require additional resources, they can easily upgrade their subscription plans or transition to dedicated nodes if necessary.

### Dedicated nodes

- One node is exclusively allocated to a single client;
- No request limits;
- Opens access to archive nodes, a variety of server locations, and custom settings;
- Guarantees premium-level service and support to clients.

This is a next-level solution for developers and decentralized applications (dApps) that require enhanced throughput, higher speed of node connection, and guaranteed resources as they scale.

## How to use TON HTTP API by GetBlock

In this section, we delve into the practical usage of the TON HTTP API provided by GetBlock. We explore the examples to showcase how to effectively utilize the generated endpoints for your blockchain interactions.

### Examples of common API calls

You can use the `/getAddressBalance` method to get the balance for a specific TON address:

```
curl --location --request GET 'https://go.getblock.io/[ACCESS-TOKEN]/getAddressBalance?address=EQDXZ2c5LnA12Eum-DlguTmfYkMOvNeFCh4rBD0tgmwjcFI-' \    
--header 'Content-Type: application/json' 
```

Make sure to replace `ACCESS-TOKEN` with your actual access token provided by GetBlock.

This will output the balance in nanotons.

![**getAddressBalance_response_on_TON_Blockchain**](/img/docs/getblock-img/unnamed-2.png)

Some other available methods to query the TON blockchain:

| # | Method | Endpoint           | Description                                                                                                |
|---|--------|--------------------|------------------------------------------------------------------------------------------------------------|
| 1 | GET    | getAddressState    | Returns the current state of a specified address (uninitialized, active, or frozen). |
| 2 | GET    | getMasterchainInfo | Fetches the state of the masterchain.                                                   |
| 3 | GET    | getTokenData       | Retrieves details about an NFT or jetton associated with the address.                          |
| 4 | GET    | packAddress        | Converts a TON address from raw format to human-readable format.                                    |
| 5 | POST   | sendBoc            | Sends serialized BOC files with external messages for blockchain execution.                   |

For a comprehensive list of methods and detailed API documentation, please refer to GetBlock's [documentation](https://getblock.io/docs/ton/json-rpc/ton_jsonrpc/).

### Deploying smart contracts

Developers can utilize the TON library to deploy and interact with contracts. The library will initialize a client to connect to the network via the GetBlock HTTP API endpoints.

![**Image from TON Blueprint IDE**](/img/docs/getblock-img/unnamed-6.png)

By following this guide, developers can easily access TON Blockchain using GetBlock's infrastructure. Whether you're working on decentralized applications (dApps) or simply querying data, GetBlock simplifies the process by offering ready-to-use HTTP API endpoints with various features.

Feel free to learn more at the [website](https://getblock.io/?utm_source=external&utm_medium=article&utm_campaign=ton_docs) or drop a line to GetBlock’s support via live chat, [Telegram](https://t.me/GetBlock_Support_Bot), or a website form.


<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/apis-sdks/overview.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/apis-sdks/overview.md
================================================
import Feedback from '@site/src/components/Feedback';

# Overview

This article helps you choose the right tools for application development in TON Ecosystem.

## TMA development

* Use [Mini Apps SDKs](/v3/guidelines/dapps/tma/overview#mini-apps-sdks) for [Telegram Mini Apps](/v3/guidelines/dapps/tma/overview) development.
* Choose [JS/TS-based SDK](/v3/guidelines/dapps/apis-sdks/sdk#typescript--javascript) to interact with TON Blockchain.

## DApps development

* Use Tolk, FunC, or Tact [programming languages](/v3/documentation/smart-contracts/overview#programming-languages) to develop TON Blockchain smart contracts for your [DApp](/v3/guidelines/dapps/overview).
* To interacts with TON Blockchain and process its data, choose one of the listed [SDKs](/v3/guidelines/dapps/apis-sdks/sdk). One of the most popular languages for this purpose include:
    * [JavaScript/TypeScript](/v3/guidelines/dapps/apis-sdks/sdk#typescript--javascript)
    * [Go](/v3/guidelines/dapps/apis-sdks/sdk#go)
    * [Python](/v3/guidelines/dapps/apis-sdks/sdk#python)
* To integrate user authentication and payments processing via with their TON wallets, use [TON Connect](/v3/guidelines/ton-connect/overview).

## TON data analytics

Developers often need to run analytical queries on top of on-chain data—for example, to track historical changes and aggregate data from multiple accounts. 
Since blockchains are not designed for analytical workloads, you need to build an indexing pipeline and run off-chain analytical queries. Creating such pipelines
from scratch can be resource-consuming, so you can use one of these alternatives:
* [Dune analytics](https://dune.com/queries?category=canonical&namespace=ton) provides tables with TON data, including raw transactions and messages, jetton events, and DEX trades. Dune allows building custom charts and dashboards, fetch query results via API and set up alerts. Before writing queries, check [this guide](https://dune.com/ton_foundation/ton-quick-start) for best practices, tips, and tricks.
* Dune integration is runs on the public data lake from the [ton-etl](https://github.com/re-doubt/ton-etl/blob/main/datalake/README.md) project. This parsing and decoding pipeline dumps raw and decoded data into an S3 bucket __s3://ton-blockchain-public-datalake/v1/__ in AVRO format. The bucket is publicly available and everyone can use it with [Amazon Athena](https://aws.amazon.com/athena/) (see [DDLs](https://github.com/re-doubt/ton-etl/blob/main/datalake/athena_ddl.sql)) or Apache Spark. The data updates daily.
* If you need real-time on-chain data tracking, you can run your own [TON node](/v3/documentation/infra/nodes/node-types) and launch [ton-etl](https://github.com/re-doubt/ton-etl/blob/main/README.md) or [ton-index-worker](https://github.com/toncenter/ton-index-worker).
* [Chainbase](https://docs.chainbase.com/catalog/Ton/Overview) offers a set of raw and decoded tables with TON data. It allows you to run SQL queries and fetch results via API.

## Infrastructure status

* [status.toncenter](https://status.toncenter.com/) - Displays various node activity statistics from the last hour.
* [Tonstat.us](https://tonstat.us/) - A real-time Grafana dashboard, updated every 5 minutes.


## See also

* [SDKs](/v3/guidelines/dapps/apis-sdks/sdk)
* [TMA tutorials](/v3/guidelines/dapps/tma/tutorials/step-by-step-guide)
* [TON Connect tutorials](/v3/guidelines/ton-connect/guidelines/how-ton-connect-works)
* [Payments processing](/v3/guidelines/dapps/asset-processing/payments-processing)

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/apis-sdks/sdk.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/apis-sdks/sdk.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# SDKs

Easily navigate to your preferred programming language using the right sidebar.


## Overview

There are different ways to connect to the blockchain:
1. RPC data provider or other API – Requires stability and security from a third-party service.
2. ADNL connection - Connects to a [liteserver](/v3/guidelines/nodes/running-nodes/liteserver-node). While it may be inaccessible at times, it cannot provide false data due to built-in validation.
3. Tonlib binary - Also connects to a liteserver, inheriting the same advantages and limitations. However, your application includes a dynamically loaded library compiled externally.
4. Offchain-only - These SDKs allow you to create and serialize cells, which can then be sent to APIs.


### TypeScript / JavaScript

| Library |	Blockchain connection |	Description |
|---------|------------------|--------------|
|[ton](https://github.com/ton-org/ton)|via RPC ([Orbs](https://www.orbs.com/ton-access/) / [Toncenter](https://toncenter.com/api/v2/) / etc)|Convenient client library with wallet wrappers for developing dApps on TON Blockchain.|
|[tonweb](https://github.com/toncenter/tonweb)|via RPC ([Orbs](https://www.orbs.com/ton-access/) / [Toncenter](https://toncenter.com/api/v2/) / etc)|Old-style TON JS SDK, with minimal external dependencies, extensively tested in production.|
|[tonkite/adnl](https://github.com/tonkite/adnl)|[ADNL](/v3/documentation/network/protocols/adnl/adnl-tcp) natively / via WebSocket| ADNL TypeScript implementation. |
|[tonutils](https://github.com/thekiba/tonutils)|Native [ADNL](/v3/documentation/network/protocols/adnl/adnl-tcp)| TypeScript-based interface for TON application development. Due to native ADNL dependency, it cannot be used in browsers.|
|[foton](https://foton.sh/)|via RPC ([Orbs](https://www.orbs.com/ton-access/) / [Toncenter](https://toncenter.com/api/v2/) / etc)|TypeScript toolkit for interacting with TON wallets and blockchain. Wraps existing solutions (Blueprint and TON Connect) into one API.|

### Java
| Library |	Blockchain connection |	Description |
|---------|------------------|--------------|
| [ton4j](https://github.com/neodix42/ton4j) | Tonlib binary | Java SDK for The Open Network (TON) |


### Python

<!-- tonsdk dropped due to invalid cells serialization, it is deprecated now -->

| Library |	Blockchain connection |	Description |
|---------|------------------|--------------|
|[pytoniq](https://github.com/yungwine/pytoniq) |Native ADNL| Python SDK with native LiteClient and other ADNL-based protocols. |
|[tonutils](https://github.com/nessshon/tonutils) |	via RPC ([TONAPI](https://tonapi.io/api-v2) / [Toncenter](https://toncenter.com/api/v3/)) / Native ADNL ([pytoniq](https://github.com/yungwine/pytoniq))| High-level OOP library for interacting with TON Blockchain. |
|[pytonlib](https://github.com/toncenter/pytonlib)|Tonlib binary| Standalone Python library based on libtonlibjson. |



### C#

| Library |	Blockchain connection |	Description |
|---------|------------------|--------------|
|[TonSdk.NET](https://github.com/continuation-team/TonSdk.NET)|Native ADNL or RPC|Native C# SDK for The Open Network. |
|[justdmitry/TonLib.NET](https://github.com/justdmitry/TonLib.NET) |Tonlib binary|.NET SDK for The Open Network, connecting via libtonlibjson.|


### Rust

| Library |	Blockchain connection |	Description |
|---------|------------------|--------------|
|[tonlib-rs](https://github.com/ston-fi/tonlib-rs)|Tonlib binary| Rust SDK for TON, using binary dependency from TON monorepo.|
|[getgems-io/ton-grpc](https://github.com/getgems-io/ton-grpc)|Tonlib binary| Rust bindings for tonlibjson with additional services.|


### Go

| Library |	Blockchain connection |	Description |
|---------|------------------|--------------|
|[tonutils-go](https://github.com/xssnick/tonutils-go)|Native ADNL|Golang library for interacting with TON.|
|[tongo](https://github.com/tonkeeper/tongo)|Native ADNL|Go implementation of TON Blockchain libraries.|
|[tonlib-go](https://github.com/ton-blockchain/tonlib-go)|Tonlib binary|Official bindings for libtonlibjson.|


### SDKs for other languages

| Library | 	Language                                                                                           |	Blockchain connection |	Description |
|---------|-----------------------------------------------------------------------------------------------------|-------|--------------|
|[ton-kotlin](https://github.com/ton-community/ton-kotlin)| Kotlin                                                                                              |Native ADNL |Kotlin/Multiplatform SDK for The Open Network.|
|[tonlib-java](https://github.com/ton-blockchain/tonlib-java)	| Java                                                                                                |	Tonlib bin	 | JVM wrapper for TonLib, usable with Java, Scala, Kotlin, etc.|
|[ayrat555/ton](https://github.com/ayrat555/ton) | Elixir                                                                                              | *offchain-only* | TON SDK for Elixir.|
|[C++ Tonlib](https://github.com/ton-blockchain/ton/tree/master/example/cpp)| C++                                                                                                 |Tonlib binary|Official examples on smart contract interaction from the TON monorepo.|.
|[Java Tonlib](https://github.com/ton-blockchain/tonlib-java)| Java                                                                                                |Tonlib binary|Official Java-based examples from the TON monorepo.|
|[labraburn/SwiftyTON](https://github.com/labraburn/SwiftyTON)| Swift                                                                                               |Tonlib binary|Native Swift wrapper for tonlib with async/await support.|
|[tonlib-xcframework](https://github.com/labraburn/tonlib-xcframework)| Swift                                                                                               |Tonlib binary|Tonlib build helper for iOS, supporting all architectures.|
|[labraburn/node-tonlib](https://github.com/labraburn/node-tonlib)| NodeJS                                                                                              |Tonlib binary|C++ addon for NodeJS to work with tonlibjson.|
|[olifanton/ton](https://github.com/olifanton/ton)| PHP                                                                                                 |via RPC ([Orbs](https://www.orbs.com/ton-access/) / [Toncenter](https://toncenter.com/api/v2/) / etc)|PHP SDK with TON primitives and smart contract tools.|
|[mytonlib](https://github.com/igroman787/mytonlib)| Python | Native ADNL                                                                                         | Native Python SDK library for working with The Open Network |
|[TonTools](https://github.com/yungwine/TonTools)| Python | via RPC ([Orbs](https://www.orbs.com/ton-access/) / [Toncenter](https://toncenter.com/api/v2/) / etc)|High-level OOP Python library for interacting with TON.|
|[tonpy](https://github.com/disintar/tonpy)| Python | Native ADNL                                                                                         | PPython package providing TON Blockchain interaction. |
|[tvm_valuetypes](https://github.com/toncenter/tvm_valuetypes)| Python | *offchain-only*                                                                                     | Utilities for handling TVM types. |
|[pytvm](https://github.com/yungwine/pytvm) | Python | *offchain*                                                                                          | Python TVM emulator using C++ bindings. |
|[pytoniq-core](https://github.com/yungwine/pytoniq-core) | Python |	*offchain-only* | Transport-free, powerful SDK. |
<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/apis-sdks/ton-adnl-apis.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/apis-sdks/ton-adnl-apis.md
================================================
import Feedback from '@site/src/components/Feedback';

# TON ADNL API

There are several ways to connect to blockchain:
1. RPC data provider or another API - In most cases, you must *rely* on its stability and security.
2. **ADNL connection** - You connect to a [liteserver](/v3/guidelines/nodes/running-nodes/liteserver-node). While it may sometimes be inaccessible, a built-in validation mechanism (implemented in the library) ensures it cannot provide false data.
3. Tonlib binary - Like ADNL, you connect to a liteserver and face the same benefits and downsides. However, your application also includes a dynamically loaded library compiled externally.
4. Offchain-only – Some SDKs allow you to create and serialize cells, which you can then send to APIs.

Clients connect directly to liteservers (nodes) using a binary protocol.

The client downloads keyblocks, the current state of an account, and their **Merkle proofs**, ensuring the validity of received data.

For read operations (such as get-method calls), the client launches a local TVM with a downloaded and verified state. There's no need to download the full blockchain state—the client only retrieves what’s required for the operation.

You can connect to public liteservers from the global config ([Mainnet](https://ton.org/global-config.json) or [Testnet](https://ton.org/testnet-global.config.json)) or run your own [liteserver](/v3/documentation/infra/nodes/node-types) and manage it with [ADNL SDKs](/v3/guidelines/dapps/apis-sdks/sdk#overview).

Read more about [Merkle proofs](/v3/documentation/data-formats/tlb/proofs) at [TON whitepaper](https://ton.org/ton.pdf) 2.3.10, 2.3.11.

Public liteservers (from the global config) help you quickly get started with TON. You can use them to learn TON programming or for applications and scripts that do not require 100% uptime. 

For production infrastructure, consider using a well-prepared setup:
- [Run your own liteserver](/v3/guidelines/nodes/running-nodes/liteserver-node), 
- Use Liteserver premium providers via [@liteserver_bot](https://t.me/liteserver_bot)

## Pros & cons

- ✅ Reliable - Uses an API with Merkle proof hashes to verify incoming binary data.  
- ✅ Secure - Since it checks Merkle proofs, you can even use untrusted liteservers.  
- ✅ Fast - Connects directly to TON Blockchain nodes instead of relying on HTTP middleware. 

- ❌ Complex - Requires time to set up and understand. 
- ❌ Back-end first - Not compatible with web frontends (built for a non-HTTP protocol) unless you use an HTTP-ADNL proxy.

## API reference

Requests and responses follow the [TL](/v3/documentation/data-formats/tl) schema, which allows you to generate a typed interface for a specific programming language.

[TonLib TL schema](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl)

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/apis-sdks/ton-http-apis.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/apis-sdks/ton-http-apis.md
================================================
import Feedback from '@site/src/components/Feedback';

# TON HTTP-based APIs

There are different ways to connect to TON Blockchain:
1. **RPC data provider or another API** - You must rely on its stability and security.
2. ADNL connection - Connect to a [liteserver](/v3/guidelines/nodes/running-nodes/liteserver-node). While it may be inaccessible at times, it cannot provide false data due to library-implemented validation.
3. Tonlib binary - Also connects to a liteserver, so it shares the same advantages and limitations. However, your application includes a dynamically loaded library compiled externally.
4. Offchain-only - These SDKs allow you to create and serialize cells, which you can then send to APIs.

## Pros & Cons

- ✅ Easy-to-use - Ideal for newcomers exploring TON.
- ✅ Web-oriented - Suitable for loading data from TON smart contracts via the web and sending messages.

- ❌ Simplified - Does not provide indexed TON API data.
- ❌ HTTP-middleware dependency - Server responses cannot be fully trusted unless augmented with [merkle proofs](/v3/documentation/data-formats/tlb/proofs) to verify authenticity.



## RPC nodes

:::tip TON infrastructure status
* [status.toncenter](https://status.toncenter.com/) - Displays various node activity statistics from the last hour.
* [Tonstat.us](https://tonstat.us/) - A real-time Grafana dashboard, updated every 5 minutes.
:::

* [QuickNode](https://www.quicknode.com/chains/ton?utm_source=ton-docs) - A top-tier blockchain node provider, offering fast access, smart DNS routing, and load-balanced scalability.
* [Chainstack](https://chainstack.com/build-better-with-ton/) — Provides RPC nodes and indexers in multiple regions with geo and load balancing.
* [Tatum](https://docs.tatum.io/reference/rpc-ton) — Offers TON RPC node access and developer tools in a simple interface.
* [GetBlock nodes](https://getblock.io/nodes/ton/) — Enables developers to connect and test DApps using GetBlock’s nodes.
* [TON access](https://www.orbs.com/ton-access/) - A public HTTP API for The Open Network (TON).
* [TON Center](https://toncenter.com/api/v2/) — A community-hosted project for quick API access. (Get an API key [@tonapibot](https://t.me/tonapibot))
* [ton-node-docker](https://github.com/fmira21/ton-node-docker) - A Docker Full Node and TON Center API.
* [toncenter/ton-http-api](https://github.com/toncenter/ton-http-api) — Allows you to run your own RPC node.
* [nownodes.io](https://nownodes.io/nodes) — Provides full nodes and blockbook explorers via API.
* [Chainbase](https://chainbase.com/chainNetwork/TON) — A node API and data infrastructure for TON.

## Indexer

### TON Center TON index

Indexers allow you to list jetton wallets, NFTs, and transactions using filters, rather than retrieving only specific ones.

- Public TON index can be used for free tests and development; [premium](https://t.me/tonapibot) plans are available for production at [toncenter.com/api/v3/](https://toncenter.com/api/v3/).
- Run your own TON index with [Worker](https://github.com/toncenter/ton-index-worker/tree/36134e7376986c5517ee65e6a1ddd54b1c76cdba) and [TON index API wrapper](https://github.com/toncenter/ton-indexer).

### Anton

Anton is an open-source TON Blockchain indexer written in Go and licensed under Apache 2.0. It offers a scalable, flexible way for developers to access and analyze blockchain data. Developers can also add custom smart contracts with custom message schemas.

* [Project GitHub](https://github.com/tonindexer/anton) - Run your own indexer.
* [Swagger API documentation](https://github.com/tonindexer/anton), [API query examples](https://github.com/tonindexer/anton/blob/main/docs/API.md) - Learn how to use Anton.
* [Apache superset](https://github.com/tonindexer/anton) - Visualize blockchain data.

### GraphQL nodes

GraphQL nodes also function as indexers.

* [dton.io](https://dton.io/graphql) - Provides contract data according to contract type. It also supports transaction emulation and execution trace retrieval.
## Other APIs

* [TonAPI](https://docs.tonconsole.com/tonapi) - A user-friendly API that abstracts low-level smart contract details for a streamlined experience.

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/asset-processing/compressed-nfts.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/asset-processing/compressed-nfts.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# Compressed NFT processing

## Introduction

Compressed NFT (cNFT) is a specialized digital asset format that optimizes data storage. Data compression algorithms reduce file sizes while preserving each asset’s uniqueness. This process saves server space and lowers data storage and transmission costs. In addition, Merkle trees minimize storage requirements and enhance the efficiency of cNFT collections.

## Features

- **Resource savings**: Merkle trees store only essential data, reducing gas costs and network load.  
- **Improved scalability**: Efficient contracts can handle large NFT volumes without performance loss.  
- **Optimized data storage**: Keeping minimal on-chain information boosts system responsiveness and saves space.  
- **Enhanced security**: Merkle trees enable fast data integrity checks and robust asset protection.  
- **Cost reduction**: Shift minting costs to end users and create “virtual” on-chain items only when needed.

## Supporting compressed NFT in wallets and marketplaces

**Current limitations**  
Most popular wallets and marketplaces do not display unclaimed cNFTs or NFTs from collections that are not official partners. For example, the Telegram wallet and the Getgems marketplace index only the first 200 items for unofficial collections, which poses challenges for larger collections.

**Attack scenario**  
A malicious actor could create hundreds of thousands of NFTs at minimal cost, forcing marketplaces to store all related data—even if the attacker does not host the items but generates them on demand.

**Potential solution**  
Provide a dedicated interface where users can claim their cNFTs. Once claimed, NFTs are indexed and displayed in wallets and marketplaces as standard NFTs, ensuring better visibility and accessibility.

## Configuration and deployment guide

### NFT collection and item preparation

Before deployment, you need to prepare the metadata and images for your NFTs.

#### Metadata preparation

- **Collection metadata**  
  Create a `collection.json` file that includes the required fields as specified in the [NFT token data standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#nft-collection-metadata-example-offchain).  
  **Example:**

  ```json
  {
      "name": "<collection name>",
      "description": "<collection description>",
      "image": "<link to the image (e.g. https://yourdomain.com/logo.png)>"
  }
  ```

* **NFT item metadata**  
    For each NFT, create a separate JSON file (e.g., `0.json`, `1.json`, etc.) with the required fields as specified in the [NFT token data standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#nft-item-metadata-example-offchain).  
    **Example:**
    
    ```json
    {
        "name": "<item name>",
        "description": "<item description>",
        "image": "<link to the image (e.g. https://yourdomain.com/0.png)>"
    }
    ```

#### Resource preparation

* **Images**: Prepare images for the collection (for example, `logo.png` for the avatar) and for each NFT (for example, `0.png`, `1.png`, etc.).
* **JSON files**: Host your `collection.json` and NFT JSON files on a publicly accessible server or repository. Ensure each file has a unique URL.

> **Note:** All images and JSON files must be directly accessible via their URLs.

### TON Connect manifest preparation

Create a [TON Connect manifest](https://github.com/ton-blockchain/ton-connect/blob/main/requests-responses.md#app-manifest) JSON file to describe your application during the wallet connection process.  
**Example:**

```json
{
  "url": "<app url>",
  "name": "<app name>",
  "iconUrl": "<app icon url>"
}
```

> **Note:** Ensure that this file is publicly accessible via its URL.

### Owner list preparation

Prepare an `owners.txt` file that lists the addresses of NFT owners, one per line. The first address corresponds to item index `0`, the second to item index `1`, and so on.  
**Example:**

```text
UQDYzZmfsrGzhObKJUw4gzdeIxEai3jAFbiGKGwxvxHinf4K
UQCDrgGaI6gWK-qlyw69xWZosurGxrpRgIgSkVsgahUtxZR0
```

### Infrastructure preparation
Set up a server to host your API and the interface for claiming NFTs. Also, obtain a domain for accessing the API. In this example, a local test deployment is run on a home machine using ngrok to create a public URL.

### Claiming API and interface setup

1.  **Clone the repository**  
    Clone the project containing all necessary source files:
    
    ```bash
    git clone https://github.com/nessshon/cnft-toolbox 
    ````

2.  **Install dependencies**  
    Install Docker, Docker Compose, and ngrok, and ensure they are properly configured on your machine.
    
3.  **Create a Telegram bot**  
    Create a Telegram bot and obtain its API token.
    
4.  **Expose your API**  
    Use ngrok to create a public URL for testing:
    
    ```bash
    ngrok http 8080 
    ```

    **For production:** Set up a custom domain and configure Nginx to proxy requests to your API on port 8080. This involves:
    
    * Registering a domain and pointing it to your server.
    * Configuring Nginx to proxy requests to your API on port 8080.
5.  **Create a `.env` file**  
    Duplicate the `env.example` file to `.env` and update it with your specific configuration. The table below describes each key:
    
    | **Key** | **Description** | **Example** | **Notes** |
    | --- | --- | --- | --- |
    | `PORT` | Port on which the API will run. | `8080` |     |
    | `ADMIN_USERNAME` | Admin username for accessing restricted functionalities. | `admin` |     |
    | `ADMIN_PASSWORD` | Admin password for accessing restricted functionalities. | `password` |     |
    | `DEPTH` | Depth for the NFT collection (max items = `2^DEPTH`; maximum DEPTH is 30). | `20` |     |
    | `IS_TESTNET` | Specify if you are connecting to the TON testnet (`true`) or mainnet (`false`). | `true` or `false` |     |
    | `POSTGRES_PASSWORD` | Password for PostgreSQL authentication. | `secret` |     |
    | `POSTGRES_DB` | Name of the PostgreSQL database. | `merkleapi` |     |
    | `POSTGRES_URI` | Full connection URI for PostgreSQL. | `postgresql://postgres:secret@db:5432/merkleapi` |     |
    | `BOT_TOKEN` | Token for your Telegram bot (from [@BotFather](https://t.me/BotFather)). | `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11` | Used for the NFT claiming interface. |
    | `API_BASE_URL` | External domain of your API. | `https://example.ngrok.io` | Replace with your public URL (e.g., via ngrok). |
    | `TONCONNECT_MANIFEST_URL` | URL for the TON Connect manifest file. | `https://example.com/tonconnect-manifest.json` | Replace with the public URL of your manifest file. |
    | `COLLECTION_ADDRESS` | Address of the NFT collection. |     | Fill this in **after** deploying the collection. |
    
6.  **Start the API and database**  
    Run the following command to start the API and database:
    
    ```bash
    docker-compose up -d db api 
    ```

7.  **Migrate the database**  
    Create the required tables in the database:
    
    ```bash
    docker-compose exec api /ctl migrate 
    ```

8.  **Add owners**  
    Place your `owners.txt` file (containing owner addresses) into the `api` folder, then run:
    
    ```bash
    docker-compose exec api /ctl add /api/owners.txt 
    ```

9.  **Rediscover items**  
    In your browser, navigate to `<API_URI>/admin/rediscover` and log in using your `ADMIN_USERNAME` and `ADMIN_PASSWORD`. If successful, you will see `ok` in the browser. After a short time (depending on the number of items), a file (e.g., `1.json`) appears in the `api/apidata/upd` folder.
    
10. **Generate an update**  
    Run the following command to generate an update:
    
    ```bash
    docker-compose exec api /ctl genupd <path-to-update-file> <collection-owner> <collection-meta> <item-meta-prefix> <royalty-base> <royalty-factor> <royalty-recipient> <api-uri-including-v1> 
    ```

    Replace the placeholders as follows:
    
    * **`<path-to-update-file>`**: Path to the update file created in step 9 (e.g., `api/apidata/upd/1.json`).
    * **`<collection-owner>`**: Address of the NFT collection owner.
    * **`<collection-meta>`**: Full URL to the collection metadata file (e.g., `https://yourdomain.com/collection.json`).
    * **`<item-meta-prefix>`**: Common prefix for item metadata (for example, if item 0 has metadata at `https://yourdomain.com/0.json`, use `https://yourdomain.com/`).
    * **`<royalty-base>`**: Numerator for royalties (for example, `10` for 10% if royalty-factor is 100).
    * **`<royalty-factor>`**: Denominator for royalties (for example, `100`).
    * **`<royalty-recipient>`**: Address receiving royalties (this can be the same as `<collection-owner>`).
    * **`<api-uri-including-v1>`**: Public API URL with the `/v1` postfix (for example, if you used `https://yourapi.com/admin/rediscover` to generate the update file, use `https://yourapi.com/v1` here).
11. **Invoke the `ton://` deeplink**  
    After generating the update, a `ton://` link appears in the console logs. Follow the link and confirm the transaction. For convenience, you can paste the link into a QR code generator and scan the QR code with the Tonhub wallet (on testnet or mainnet).
    
12. **Set the collection address**  
    In your browser, navigate to `<API_URI>/admin/setaddr/<collection-address>`, replacing `<collection-address>` with the address observed during the deployment step.
    
13. **Wait for confirmation**  
    Monitor the container API logs until you see a message indicating a `committed state`.
    
    ```bash
    docker-compose logs api 
    ```

14. **Deployment complete!**
    

### Run the Telegram bot for NFT claiming interface

1.  **Update the `.env` file**  
    Add the `COLLECTION_ADDRESS` obtained during deployment to your `.env` file.
    
2.  **Start the Telegram bot**  
    Run the following command to start the bot:
    
    ```bash
    docker-compose up -d redis bot 
    ```

3.  **Interact with the bot**  
    Open Telegram, navigate to your bot, and follow its instructions to claim NFTs or perform other actions.
    
4.  **Done!**
    

### Updating owners

Follow these steps to update the list of owners and integrate the changes into your NFT collection:

1.  **Prepare the new owners file**  
    Create a `new-owners.txt` file with the new owner addresses and place it in the `api` folder.
    
2.  **Add new owners**  
    Run:
    
    ```bash
    docker-compose exec api /ctl add /api/new-owners.txt 
    ```

3.  **Rediscover items**  
    In your browser, navigate to `<API_URI>/admin/rediscover` and log in with your `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
    
4.  **Locate the update file**  
    After rediscovering, locate the new update file in the `api/apidata/upd` folder (for example, `2.json` if the previous update was `1.json`).
    
5.  **Generate an update**  
    Run:
    
    ```bash
    docker-compose exec api /ctl genupd <path-to-update-file> <collection-address> 
    ```

    Replace `<path-to-update-file>` with the new update file’s path (e.g., `api/apidata/upd/2.json`) and `<collection-address>` with the NFT collection address.
    
6.  **Invoke the `ton://` deeplink**  
    Follow the generated `ton://` link and confirm the transaction. You may also generate a QR code from the link and scan it with the Tonhub wallet.
    
7.  **Wait for confirmation**  
    Monitor the container API logs until you see a message indicating a `committed state`.
    
    ```bash
    docker-compose logs api 
    ```
   
8.  **Done!**
    

Conclusion
----------

The Compressed NFT standard transforms the creation and management of NFT collections by offering a scalable, cost-effective solution for mass NFT production. By addressing the limitations of existing standards, this approach paves the way for broader adoption and innovative applications of NFT technology in community building and marketing campaigns.

See also
--------

* [Understanding compressed NFT on the TON blockchain](https://ambiguous-mandrill-06a.notion.site/Understanding-compressed-NFT-on-the-TON-blockchain-753ffbcbd1684aef963b5cfb6db93e55)
* [Compressed NFT standard implementation](https://github.com/ton-community/compressed-nft-contract)
* [Reference augmenting API implementation](https://github.com/ton-community/compressed-nft-api)
* [NFT collection metadata example](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#nft-collection-metadata-example-offchain)
* [NFT item metadata example](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#nft-item-metadata-example-offchain)
* [Compressed NFT toolbox](https://github.com/nessshon/cnft-toolbox)

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/asset-processing/jettons.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/asset-processing/jettons.md
================================================
import Feedback from '@site/src/components/Feedback';

import ThemedImage from '@theme/ThemedImage';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/button';

# Jetton processing

## Best practices on jettons processing

Jettons are tokens on TON Blockchain, similar to ERC-20 tokens on Ethereum.

:::info Transaction confirmation
TON transactions become irreversible after a single confirmation. To enhance UX/UI, avoid unnecessary waiting times.
:::

#### Withdrawal

[Highload wallet v3](/v3/documentation/smart-contracts/contracts-specs/highload-wallet#highload-wallet-v3): v3 is the latest solution on TON Blockchain and the gold standard for jetton withdrawals. It enables batched withdrawals.

[Batched withdrawals](https://github.com/toncenter/examples/blob/main/withdrawals-jettons-highload-batch.js): Allow multiple withdrawals to be processed in batches, ensuring fast and cost-effective transactions.

#### Deposits
:::info
It is recommended to set up multiple MEMO deposit wallets for better performance.
:::

[Memo deposits](https://github.com/toncenter/examples/blob/main/deposits-jettons.js): This method lets you use a single deposit wallet, with users adding a memo for identification. It eliminates the need to scan the entire blockchain, though it may be slightly less convenient for users.

[Memo-less deposits](https://github.com/gobicycle/bicycle): This alternative exists but is more difficult to integrate. We can assist with implementation if you prefer this approach. Please notify us before proceeding.

### Additional info

:::caution Transaction notification
Each service in the ecosystem is expected to set `forward_ton_amount` to 0.000000001 TON (1 nanoton) when withdrawing a token to send a jetton Notify on [successful transfer](https://testnet.tonviewer.com/transaction/a0eede398d554318326b6e13081c2441f8b9a814bf9704e2e2f44f24adb3d407), otherwise the transfer will not be compliant. It will not be able to be processed by other CEXs and services.
:::

- Prefer to the official JS library from TON Foundation, [tonweb](https://github.com/toncenter/tonweb), for a JS lib example.

- For Java, consider [ton4j](https://github.com/neodix42/ton4j/tree/main). 

- For Go, use [tonutils-go](https://github.com/xssnick/tonutils-go). Currently, we recommend the JS library.


## Content list


:::tip
The following documents provide details on jetton architecture and core TON concepts, which differ from EVM-like and other blockchains. Understanding these concepts is crucial and will greatly aid in grasping TON’s functionality.
:::

This document covers the following topics in order:
1. Overview, 
2. Architecture,
2. Jetton master contract (token minter),
3. Jetton wallet contract (user wallet),
4. Message layouts,
4. Jetton processing (off-chain),
5. Jetton processing (on-chain),
6. Wallet processing,
7. Best practices.

## Overview

:::info
TON transactions are irreversible after just one confirmation. To clearly understand this process, readers should be familiar with the basic principles of asset processing described in [this section of our documentation](/v3/documentation/dapps/assets/overview). It is particularly important to understand [contracts](/v3/documentation/smart-contracts/addresses#everything-is-a-smart-contract), [wallets](/v3/guidelines/smart-contracts/howto/wallet), [messages](/v3/documentation/smart-contracts/message-management/messages-and-transactions), and the deployment process.
:::

:::info
For the best user experience, avoid waiting for additional blocks once transactions are finalized on TON Blockchain. Read more in the [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

Quick jump to the core description of jetton processing:

<Button href="/v3/guidelines/dapps/asset-processing/jettons#accepting-jettons-from-users-through-a-centralized-wallet" colorType={'primary'} sizeType={'sm'}>Centralized Processing</Button>
<Button href="/v3/guidelines/dapps/asset-processing/jettons#accepting-jettons-from-user-deposit-addresses"
        colorType="secondary" sizeType={'sm'}>
  On-chain processing
</Button>

<br></br><br></br>


TON Blockchain and its ecosystem classify fungible tokens (FTs) as jettons. Because TON Blockchain applies sharding, its fungible token implementation differs from similar blockchain models.

This analysis provides a deeper look into the formal standards detailing jetton [behavior](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) and [metadata](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md). A less formal, sharding-focused overview of jetton architecture is available in our [anatomy of jettons blog post](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons).

We have also included details about our third-party open-source TON payment processor ([bicycle](https://github.com/gobicycle/bicycle)), which allows users to deposit and withdraw both Toncoin and jettons using a separate deposit address without a text memo.



## Jetton architecture

Standardized tokens on TON are implemented using a set of smart contracts, including:
* [Jetton master](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter.fc) smart contract
* [Jetton wallet](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc) smart contracts

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/asset-processing/jetton_contracts.png?raw=true',
        dark: '/img/docs/asset-processing/jetton_contracts_dark.png?raw=true',
    }}
/>
<br></br>

## Jetton master smart contract
Standardized tokens on TON use a set of smart contracts, including:

- Jetton master smart contract: Stores general information about the jetton, such as total supply, a metadata link, or the metadata itself.

- Jetton wallet smart contracts: Used for transactions and balance management.

:::warning Beware of jetton scams
Anyone can create a counterfeit version of a valuable jetton by using an arbitrary name, ticker, or image that closely resembles the original. However, counterfeit jettons can be identified by their addresses.
:::

Jettons with the symbol TON or those containing system notification messages such as ERROR or SYSTEM should be displayed in a way that prevents confusion with TON transfers or system notifications. Sometimes, scammers design the `symbol`, `name`, and `image` to mimic the original and mislead users.

To prevent fraud, verify the **original jetton address** (jetton master contract) for specific jetton types. Alternatively, **check the project’s official social media** or website for **accurate information**. Use [Tonkeeper ton-assets list](https://github.com/tonkeeper/ton-assets) ton-assets list to verify assets.


### Retrieving jetton data

To retrieve specific jetton data, use the contract's `get_jetton_data()` method.

This method returns the following data:

| Name                 | Type    | Description          |
|----------------------|---------|----------------------|
| `total_supply`       | `int`   | The total number of issued jettons measured in indivisible units. |
| `mintable`           | `int`   | Indicates whether new jettons can be minted (-1 for mintable, 0 for non-mintable). |
| `admin_address`      | `slice` |                   |
| `jetton_content`     | `cell`  | Data formatted according to [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md), check [jetton metadata parsing page](/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing) for more. |
| `jetton_wallet_code` | `cell`  |                      |


You can also use the [TON Center API](https://toncenter.com/api/v3/#/default/get_jetton_masters_api_v3_jetton_masters_get) `/jetton/masters` method to retrieve already decoded jetton data and metadata. We have also developed methods for (js) [tonweb](https://github.com/toncenter/tonweb/blob/master/src/contract/token/ft/JettonMinter.js#L85) and (js) [ton-core/ton](https://github.com/ton-core/ton/blob/master/src/jetton/jettonMaster.ts#L28), (go) [tongo](https://github.com/tonkeeper/tongo/blob/master/liteapi/jetton.go#L48) and (go) [tonutils-go](https://github.com/xssnick/tonutils-go/blob/33fd62d754d3a01329ed5c904db542ab4a11017b/ton/jetton/jetton.go#L79), (python) [pytonlib](https://github.com/toncenter/pytonlib/blob/d96276ec8a46546638cb939dea23612876a62881/pytonlib/client.py#L742), and many other [SDKs](/v3/guidelines/dapps/apis-sdks/sdk).

The example of using [Tonweb](https://github.com/toncenter/tonweb) to run a get method and get url for off-chain metadata:

```js
import TonWeb from "tonweb";
const tonweb = new TonWeb();
const JettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: "<jetton_MASTER_ADDRESS>"});
const data = await JettonMinter.getjettonData();
console.log('Total supply:', data.totalSupply.toString());
console.log('URI to off-chain metadata:', data.jettonContentUri);
```

### Jetton minter

Jettons can be either `mintable` or `non-mintable`.

If they are non-mintable, no additional tokens can be minted. To mint jettons for the first time, refer to the [mint your first jetton](/v3/guidelines/dapps/tutorials/mint-your-first-token) page.

If jettons are mintable, the [minter contract](https://github.com/ton-blockchain/minter-contract/blob/main/contracts/jetton-minter.fc) includes a function to mint additional jettons. The admin can trigger this function by sending an internal message with a specified opcode from the admin address.

If the jetton admin wants to restrict jetton creation, there are three approaches:

1. If the contract code cannot be updated, the admin can transfer ownership to the zero address, preventing further minting but also blocking metadata changes.
2. If the source code can be modified, a method can be added to disable minting once triggered.
3. If the contract can be updated, restrictions can be added to the deployed contract.

## Jetton wallet smart contract
`Jetton wallet` contracts are used to **send**, **receive**, and **burn** jettons. Each _jetton wallet contract_ stores wallet balance information for specific users.
In certain cases, token wallets are used for individual token holders for each token type.

`Jetton wallets` should not be confused with blockchain wallets used for storing only the Toncoin asset (e.g., v3R2 wallets, highload wallets). Jetton wallets are dedicated to managing specific jetton types.

### Jetton wallet deployment
When `transferring jettons` between wallets, transactions require TON to cover network **gas fees**. The recipient does not need to deploy a jetton wallet beforehand. If the sender has enough TON to cover fees, the recipient’s jetton wallet will be deployed automatically.

### Retrieving jetton wallet addresses for a given user
To get the `address` of a `jetton wallet` using the `owner address` (the TON wallet address), the `jetton main contract` provides the `get_wallet_address(slice owner_address)` method.

<Tabs groupId="retrieve-wallet-address">
<TabItem value="api" label="API">

> Run `get_wallet_address(slice owner_address)` through `/runGetMethod` method from the [TON Center API](https://toncenter.com/api/v3/#/default/run_get_method_api_v3_runGetMethod_post). In real cases (not test ones) it is important to always check that wallet indeed is attributed to desired jetton Master. Check the code example for more.

</TabItem>
<TabItem value="js" label="js">

```js
import TonWeb from 'tonweb';
const tonweb = new TonWeb();
const JettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, { address: '<jetton_MASTER_ADDRESS>' });
const jettonWalletAddress = await JettonMinter.getjettonWalletAddress(new TonWeb.utils.Address('<OWNER_WALLET_ADDRESS>'));

// It is important to always check that wallet indeed is attributed to desired jetton Master:
const jettonWallet = new TonWeb.token.jetton.jettonWallet(tonweb.provider, {
  address: jettonWalletAddress
});
const jettonData = await jettonWallet.getData();
if (jettonData.JettonMinterAddress.toString(false) !== JettonMinter.address.toString(false)) {
  throw new Error('jetton minter address from jetton wallet doesnt match config');
}

console.log('jetton wallet address:', jettonWalletAddress.toString(true, true, true));
```

</TabItem>
</Tabs>

:::tip
For more examples, read the [TON cookbook](/v3/guidelines/dapps/cookbook#tep-74-jettons-standard).
:::


### Retrieving data for a specific jetton wallet

To retrieve the wallet’s account balance, owner identification information, and other details related to a specific jetton wallet contract, use the get_wallet_data() method within the jetton wallet contract.

This method returns the following data:

| Name                 | Type    |
|----------------------|---------|
| `balance`            | int     |
| `owner`              | slice   |
| `jetton`             | slice   |
| `jetton_wallet_code` | cell    |

<Tabs groupId="retrieve-jetton-wallet-data">
<TabItem value="api" label="API">

> Use the `/jetton/wallets` get method from the [TON Center API](https://toncenter.com/api/v3/#/default/get_jetton_wallets_api_v3_jetton_wallets_get) to retrieve previously decoded jetton wallet data.

</TabItem>

<TabItem value="js" label="js">

```js
import TonWeb from "tonweb";
const tonweb = new TonWeb();
const walletAddress = "EQBYc3DSi36qur7-DLDYd-AmRRb4-zk6VkzX0etv5Pa-Bq4Y";
const jettonWallet = new TonWeb.token.jetton.jettonWallet(tonweb.provider,{address: walletAddress});
const data = await jettonWallet.getData();
console.log('jetton balance:', data.balance.toString());
console.log('jetton owner address:', data.ownerAddress.toString(true, true, true));
// It is important to always check that jetton Master indeed recognize wallet
const JettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: data.JettonMinterAddress.toString(false)});
const expectedjettonWalletAddress = await JettonMinter.getjettonWalletAddress(data.ownerAddress.toString(false));
if (expectedjettonWalletAddress.toString(false) !== new TonWeb.utils.Address(walletAddress).toString(false)) {
  throw new Error('jetton minter does not recognize the wallet');
}

console.log('jetton master address:', data.JettonMinterAddress.toString(true, true, true));
```

</TabItem>
</Tabs>

## Message layouts

:::tip Messages
Read more about messages [here](/v3/documentation/smart-contracts/message-management/messages-and-transactions).
:::

Communication between jetton wallets and TON wallets follows this sequence:

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/asset-processing/jetton_transfer.png?raw=true',
        dark: '/img/docs/asset-processing/jetton_transfer_dark.png?raw=true',
    }}
/>
<br></br>

#### Message 0
`Sender -> sender's jetton wallet`. _Transfer_ message contains the following data:

| Name                   | Type       | Description                                                                                                                                                                                                             |
|------------------------|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `query_id`             | uint64     | Links the three messaging types—transfer, transfer notification, and excesses—to each other. To ensure this process works correctly, **always use a unique query ID**. |
| `amount`               | coins      | Tthe total `ton coin` amount sent with the message.                                                                                                                                                                |
| `destination`          | address    | The address of the new owner of the jettons                                                                                                                                                                                 |
| `response_destination` | address    | The wallet address used to return remaining Toncoin through the excesses message.                                                                                                                                                 |
| `custom_payload`       | maybe cell | Always at least 1 bit in size. Custom data used by either the sender or receiver jetton wallet for internal logic.                                                                                                        |
| `forward_ton_amount`   | coins      | Must be greater than 0 to send a transfer notification message with a `forward payload`. It is **part of `amount` value** and **must be lesser than `amount`**.                                                      |
| `forward_payload`      | maybe cell | Always at least 1 bit in size. If the first 32 bits equal 0x0, it is a simple message.                                                                                                                                            |


#### Message 2'
The `payee’s jetton wallet` → payee. Transfer notification message. This is sent only if `forward_ton_amount` is not zero and contains the following data:

| Name              | Type    |
|-------------------|---------|
| `query_id`        | uint64  |
| `amount`          | coins   |
| `sender`          | address |
| `forward_payload` | cell    |

In this case, the `sender` address refers to Alice’s `jetton wallet`.

#### Message 2''
`payee's jetton wallet -> Sender`. Excess message body. This is sent only if there are remaining Toncoin after paying the fees. Contains the following data:

| Name                 | Type           |
|----------------------|----------------|
| `query_id`           | uint64         |

:::tip jettons standard
A detailed description of the jetton wallet contract fields is available in the [TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) `jetton standard`.
:::

## How to send jetton transfers with comments and notifications

This transfer require some ton coins for **fees** and **transfer notification message**.

To send **comment** you need to set up `forward payload`. Set **first 32 bits to 0x0** and add **custom text**, `forward payload` is sent in internal `jetton notify 0x7362d09c` message. It will only be generated if `forward_ton_amount` > 0.

:::info
Recommended `forward_ton_amount` for a jetton transfer with a comment: 1 nanoton.
:::

Finally, to retrieve `Excess 0xd53276db` message you must set up `response destination`.

Sometimes you may get a `709` error when sending a jetton. This error indicates that the amount of Toncoin attached to the message is not enough to send it. Make sure `Toncoin > to_nano(TRANSFER_CONSUMPTION) + forward_ton_amount`, which is usually >0.04 unless the payload being forwarded is very large. The fee depends on various factors, including the jetton code data and whether the recipient needs to deploy a new jetton wallet.
It is recommended to add a supply of Toncoin to the message and set your address as the `response_destination` to receive `Excess 0xd53276db` messages. For example, you can add 0.05 TON to the message by setting `forward_ton_amount` to 1 nanoton (this amount of TON will be attached to the `jetton notify 0x7362d09c` message).

You may also encounter the error [`cskip_no_gas`](/v3/documentation/tvm/tvm-overview#when-the-compute-phase-is-skipped), which indicates that the tokens were successfully transferred, but no other computations were performed. This is a common situation when the `forward_ton_amount` value is 1 nanoton.

:::tip
Check [best practices](/v3/guidelines/dapps/asset-processing/jettons#best-practices) for the _"send jettons with comments"_ example.
:::


## Jetton off-chain processing
:::info Transaction confirmation
TON transactions are irreversible after just one confirmation. To provide the best user experience, avoid waiting on additional blocks once transactions are finalized on the TON Blockchain. Read more in [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

There are two ways to accept jettons:
- Using a **centralized hot wallet**.
- Using a wallet with a **separate address** for **each individual user**.

For security reasons,  it is best to use **separate hot wallets** for different jettons (many wallets for each asset type).

When processing funds, it is also recommended to use a cold wallet for storing excess funds that are not involved in automatic deposit and withdrawal processes.

### Adding new jettons for asset processing and initial verification

1. Find the correct [smart contract address](/v3/guidelines/dapps/asset-processing/jettons#jetton-master-smart-contract).
2. Get [metadata](/v3/guidelines/dapps/asset-processing/jettons#retrieving-jetton-data).
3. Check for [scams](/v3/guidelines/dapps/asset-processing/jettons#jetton-master-smart-contract).

### Identifying an unknown jetton when receiving a transfer notification message

If your wallet receives a transfer notification message regarding an unknown jetton, a jetton wallet has been created to hold that specific jetton.

The sender address of the internal message containing the body of the `Transfer Notification` is the address of the new jetton wallet.
This should not be confused with the `sender` field in the [body](/v3/guidelines/dapps/asset-processing/jettons#message-2) of the `Transfer Notification`.

1. Get the jetton master address for the new jetton wallet by [retrieving the wallet data] (/v3/guidelines/dapps/asset-processing/jettons#retrieving-data-for-a-specific-jetton-wallet).
2. Get the jetton wallet address for your wallet address (as the owner) using the jetton master contract: [How to get the jetton wallet address for a given user](#retrieving-jetton-wallet-addresses-for-a-given-user).
3. Compare the address returned by the master contract and the actual wallet token address. If they match, that's perfect. If not, you've probably received a scam token that's counterfeit.
4. Retrieve jetton metadata: [How to retrieve jetton metadata](#retrieving-jetton-data).
5. Check the `symbol` and `name` fields for signs of fraud. Warn the user if necessary. [Adding new jettons for asset processing and initial verification](#adding-new-jettons-for-asset-processing-and-initial-verification).


### Accepting jettons from users through a centralized wallet

:::info
To prevent transaction bottlenecks in a single wallet, distribute deposits across multiple wallets and expand as needed.
:::

:::warning Transaction notification:
Each service in the ecosystem is expected to set `forward_ton_amount` to 0.000000001 TON (1 nanoton) when withdrawing a token, in order to send a token notification upon [a successful transfer](https://testnet.tonviewer.com/transaction/a0eede398d554318326b6e13081c2441f8b9a814bf9704e2e2f44f24adb3d407), otherwise the transfer will not be compliant and will not be processed by other CEXs and services.
:::

In this scenario, the payment service creates a unique memo identifier for each sender, revealing the
centralized wallet address and the amounts being sent. The sender sends tokens
to the specified centralized address with a mandatory comment in the comment.

**Pros of this method:** This method is very simple as there are no additional fees when accepting tokens and they are extracted directly to a hot wallet.

**Cons of this method:** This method requires all users to attach a comment to the transfer, which can lead to more deposit errors (forgotten memos, incorrect memos, etc.), and therefore a greater burden on the support staff.

Tonweb examples:

1. [Accepting jetton deposits to an individual HOT wallet with comments (memo)](https://github.com/toncenter/examples/blob/main/deposits-jettons.js)
2. [Jettons withdrawals example](https://github.com/toncenter/examples/blob/main/withdrawals-jettons.js)

#### Preparations

1. [Prepare a list of accepted jettons](/v3/guidelines/dapps/asset-processing/jettons#adding-new-jettons-for-asset-processing-and-initial-verification) (jetton master addresses).
2. Deploy hot wallet (using v3R2 if no jetton withdrawals are expected; highload v3 - if jetton withdrawals are expected). [Wallet deployment](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment).
3. Perform a test jetton transfer using the hot wallet address to initialize the wallet.

#### Processing incoming jettons
1. Download the list of accepted jettons.
2. [Retrieve the jetton wallet address](#retrieving-jetton-wallet-addresses-for-a-given-user) for your deployed hot wallet.
3. Retrieve the jetton master address for each jetton wallet using [retrieving wallet data](/v3/guidelines/dapps/asset-processing/jettons#retrieving-data-for-a-specific-jetton-wallet).
4. Compare the jetton master contract addresses from step 1. and step 3 (immediately above). If the addresses do not match, you should report an address validation error to jetton.
5. Retrieve the list of recent unprocessed transactions using the hot wallet account and repeat (sorting each transaction one at a time). See: [Check contract transactions](/v3/guidelines/dapps/asset-processing/payments-processing#check-contracts-transactions).
6. Check the input message (in_msg) for transactions and extract the source address from the input message. [Tonweb example](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L84).
7. If the source address matches the address in the jetton wallet, then the transaction should be processed further. If not, then skip the transaction processing and check the next transaction.
8. Make sure the message body is not empty and that the first 32 bits of the message match the `transfer notification` opcode `0x7362d09c`. [Tonweb example](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L91) If the message body is empty or the opcode is invalid, skip the transaction.
9. Read other message body data, including `query_id`, `amount`, `sender`, `forward_payload`. [jetton contract message layouts](/v3/guidelines/dapps/asset-processing/jettons#message-layouts), [Tonweb example](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L105).
10. Try extracting text comments from the `forward_payload` data. The first 32 bits should correspond to the text comment opcode `0x00000000`, and the rest to the UTF-8 encoded text. [Tonweb example](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L110).
11. If the `forward_payload` data is empty or the operation code is invalid - skip the transaction.
12. Compare the received comment with the saved notes. If there is a match (user identification is always possible) - make the transfer.
13. Restart from step 5 and repeat the process until you have gone through the entire list of transactions.

### Accepting jettons from user deposit addresses

To accept jettons from user deposit addresses, the payment service must create an individual address (deposit) for each participant. The service includes multiple parallel processes, such as creating new deposits, scanning blocks for transactions, and withdrawing funds from deposits to a hot wallet.

Since a hot wallet can use one jetton wallet for each jetton type, multiple wallets must be created to initiate deposits. To create many wallets while managing them with one seed phrase (or private key), specify a different subwallet_id when creating a wallet. On TON, version v3 wallets and higher support subwallet creation.


#### Creating a subwallet in Tonweb

```js
const WalletClass = tonweb.wallet.all['v3R2'];
const wallet = new WalletClass(tonweb.provider, {
    publicKey: keyPair.publicKey,
    wc: 0,
    walletId: <SUBWALLET_ID>,
});
```

#### Preparation

1. [Prepare a list of accepted jettons](#adding-new-jettons-for-asset-processing-and-initial-verification).
2. Deploy a hot wallet (using v3R2 if no jetton withdrawals are expected; highload v3 - if jetton withdrawals are expected). [Wallet deployment](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment).

#### Creating deposits

1. Accept a request to create a new deposit for the user.
2. Generate a new subwallet address (/v3R2) based on the hot wallet seed. [Creating a subwallet in Tonweb](#creating-a-subwallet-in-tonweb)
3. The receiving address can be provided to the user as the address used for jetton deposits (this is the address
of the owner of the jetton deposit wallet). No wallet initialization is required, this can
be done when withdrawing jettons from the deposit.
4. For this address, the jetton wallet address must be calculated through the jetton main contract.
[How to get the jetton wallet address for a given user](#retrieving-jetton-wallet-addresses-for-a-given-user).
5. Add the jetton wallet address to the address pool for transaction monitoring and save the subwallet address.

#### Processing transactions

:::info Transaction confirmation
TON transactions are irreversible after one confirmation. To enhance user experience, avoid waiting for additional blocks once transactions are finalized on TON Blockchain. Read more in [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

It is not always possible to determine the exact amount of jettons received from a message, as jetton wallets cannot send `transfer notification`, `excesses` and `internal transfer` messages. They are not standardized. This means that there is no guarantee that an `internal transfer` message can be decoded.

Therefore, to determine the amount received in a wallet, it is necessary to query balances using the get method. To obtain key data when querying balances, blocks are used according to the account state for a specific block in the chain.

[Preparing to accept a block with Tonweb](https://github.com/toncenter/tonweb/blob/master/src/test-block-subscribe.js).

The process is:

1. Prepare to accept a block (by preparing the system to accept new blocks).
2. Extract a new block and store the ID of the previous block.
3. Get transactions from blocks.
4. Filter transactions to only use addresses from the jetton wallet pool for deposit.
5. Decode messages using the `transfer notification` body to get more details, including the
`sender` address, jetton `amount`, and comment. (See: [Processing incoming jettons](#processing-incoming-jettons)).
6. If there is at least one transaction with undecodeable output messages (the message body does not contain opcodes for
`transfer notification` and opcodes for `excesses`) or no output messages in
an account, the jetton balance must be queried using the get method for the current block, while the previous
block is used to calculate the balance difference. Now the overall change in the deposit balance is revealed due to the transactions in the block.
7. The transaction data can be used as an identifier for an unidentified jettons transfer (without a `transfer notification`) if there is one such transaction or the block data (if there are multiple in the block).
8. Now you need to check to make sure the deposit balance is correct. If the deposit balance is enough to initiate a transfer between the hot wallet and an existing jetton wallet, you need to withdraw the jettons to make sure the wallet balance has decreased.
9. Restart from step 2 and repeat the entire process.

#### Withdrawals made from deposits

Transfers should not be made from a deposit to a hot wallet with each deposit replenishment due to TON gas fees. Set a minimum jetton threshold before transferring.

By default, jetton deposit wallets are uninitialized since storage fees are not required. Deposit wallets can be deployed when sending transfer messages and immediately destroyed. Engineers must use a special mechanism for message sending [128 + 32](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes).


1. Get the list of deposits marked for withdrawal to the hot wallet
2. Get the stored owner addresses for each deposit
3. Messages are then sent to each owner address (by bundling several such messages into a batch) from the high-load
wallet with an attached TON jetton amount. This is determined by adding the fees used to initialize the v3R2 wallet + the fees for sending a message with the `transfer` body + an arbitrary TON amount associated with `forward_ton_amount`
(if necessary). The attached TON amount is determined by adding the fees for initializing the v3R2 wallet (value) +
the fees for sending a message with the `transfer` body (value) + an arbitrary TON amount
for `forward_ton_amount` (value) (if necessary).
4. When the balance on the address becomes non-zero, the account status is changed. Wait a few seconds and check the status of the
account, it will soon change from `nonexists` to `uninit`.
5. For each owner address (with `uninit` status), an external message with v3R2 wallet
init and a body with the message `transfer` must be sent to deposit to the jetton wallet = 128 + 32. For `transfer`, the user must specify the hot wallet address as `destination` and `response destination`.
A text comment can be added to make it easier to identify the transfer.
6. Jetton delivery can be verified using the deposit address to the hot wallet address,
taking into account [processing incoming jettons information found here](#processing-incoming-jettons).

### Jetton withdrawals

:::info Important
**It is recommended that you** read and **understand** the [how jetton transfer works](/v3/guidelines/dapps/asset-processing/jettons#overview) and [how to send jettons with a comment](/v3/guidelines/dapps/asset-processing/jettons#jetton-off-chain-processing) articles before reading this section.

Below, you will find a step-by-step guide on how to process jetton withdrawals.
:::

To withdraw jettons, the wallet sends messages with a `transfer` body to the corresponding jetton wallet.
The jetton wallet then sends the jettons to the recipient. It is important to attach some TON (at least 1 nanoTON)
as the `forward_ton_amount` (and an optional comment to the `forward_payload`) to trigger a `transfer notification`.
See: [Jetton contract message layouts](/v3/guidelines/dapps/asset-processing/jettons#message-layouts).

#### Preparation

1. Prepare a list of jettons to withdraw: [Adding new jettons for asset processing and initial verification](#adding-new-jettons-for-asset-processing-and-initial-verification)
2. Initiate hot wallet deployment. Highload v3 is recommended. [Deploy wallet](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment)
3. Perform a jetton transfer using the hot wallet address to initialize the jetton wallet and fund its balance.

#### Processing withdrawals

1. Download the list of processed jettons
2. Get the jetton wallet addresses for the deployed hot wallet: [How to get jetton wallet addresses for a given user](#retrieving-jetton-wallet-addresses-for-a-given-user)
3. Get the primary jetton addresses for each jetton wallet: [How to get data for jetton wallets](#retrieving-data-for-a-specific-jetton-wallet).

  The `jetton` parameter is required (which is actually the address of the primary jetton contract).

4. Compare the addresses from the primary jetton contracts from step 1 and step 3. If the addresses do not match, then a jetton address validation error should be reported.

5. Receive withdrawal requests that actually specify the jetton type, amount to be transferred, and the recipient wallet address.

6. Check the jetton wallet balance to ensure there are enough funds for the withdrawal.
7. Create a [message](/v3/guidelines/dapps/asset-processing/jettons#message-0).
8. When using a wallet with high load, it is recommended to collect a batch of messages and send one batch at a time to optimize fees.
9. Keep an expiration time for outgoing external messages (this is the time until the wallet successfully
processes the message, after which the wallet will no longer accept the message)
10. Send a single message or multiple messages (message batch).
11. Get a list of the latest unprocessed transactions in the hot wallet account and retry it.
Learn more here: [Check contract transactions](/v3/guidelines/dapps/asset-processing/payments-processing#check-contracts-transactions),
[Tonweb example](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-single-wallet.js#L43) or
use the TON Center API method `/getTransactions`.
12. View the outgoing messages in the account.
13. If there is a message with the `transfer` operation code, it should be decoded to obtain the `query_id` value.
The received `query_id` should be marked as successfully sent.
14. If the time required to process the current transaction being scanned is greater than the expiration time and no outgoing message with the given `query_id`
is found, the query should optionally be marked as expired and safely resent.
15. Find the incoming messages in the account.
16. If there is a message that uses the `Excess 0xd53276db` opcode, the message should be decoded and the `query_id` value extracted. The `query_id` found should be marked as successfully delivered.
17. Proceed to step 5. Expired queries that were not successfully sent should be returned to the output list.

## Jetton on-chain processing

Generally, to accept and process jettons, a message handler responsible for internal messages uses the `op=0x7362d09c` op code.

:::info Transaction Confirmation
TON transactions are irreversible after one confirmation. For the best user experience, it is recommended to avoid waiting for additional blocks after completing transactions on the TON blockchain. Read more in the [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

### On-chain processing recommendations
Below is a `list of best practices` to keep in mind when **doing on-chain jetton processing**:

1. **Identify incoming jettons** using their wallet type, not their master jetton contract. In other words, your contract should communicate (receive and send messages) with a specific jetton wallet (not some unknown wallet using a specific master jetton contract).

2. When linking a jetton wallet and a master jetton, **check** that the **connection is bidirectional**, with the wallet recognizing the master contract and vice versa. For example, if your contract system receives a notification from a jetton wallet (which considers its MySuperJetton to be its master contract), its transfer information should be displayed to the user before showing the `symbol`, `name`, and `image` of the MySuperJetton contract, check that the MySuperJetton wallet is using the correct contract system. In turn, if your contract system for some reason needs to send tokens using the MySuperJetton or MySuperJetton master contracts, check that the X wallet, like the wallet, uses the same contract parameters.
Also, before sending a `transfer` request to X, make sure it recognizes MySuperJetton as its master.
3. The **true power** of decentralized finance (DeFi) comes from the ability to stack protocols on top of each other like Lego blocks. For example, say Token A is swapped for Token B, which in turn is then used as leverage in a lending protocol (where the user provides liquidity), which is then used to buy an NFT and so on. So think about how a contract can serve not only off-chain users, but also on-chain entities by attaching a tokenized value to a transfer notification, adding a custom payload that can be sent with the transfer notification. 
4. **Remember** that not all contracts follow the same standards. Unfortunately, some tokens can be hostile (using attack vectors) and are designed solely to attack unsuspecting users. For security purposes, if the protocol in question is composed of many contracts, do not create a large number of token wallets of the same type. In particular, do not send tokens within the protocol between a deposit contract, a storage contract, or a user account contract, etc. Attackers can intentionally interfere with contract logic by spoofing transfer notifications, token amounts, or payload parameters. Reduce the potential attack surface by using only one wallet in the system per token (for all deposits and withdrawals).
5. It is also **often a good idea** to create subcontracts for each individual token to reduce the likelihood of address spoofing (e.g. where a transfer message is sent to token B using a contract intended for token A).
6. **It is strongly recommended** to work with indivisible units of tokens at the contract level. Logic related to decimal numbers is usually used to improve the display user interface and is not related to the numerical record keeping on the chain.

Learn **more** about [Secure Smart Contract Programming in FunC by CertiK](https://blog.ton.org/secure-smart-contract-programming-in-func). It is recommended to **handle all smart contract exceptions,** so they are never skipped during application development.

## Jetton Wallet Processing Guidelines
In general, all verification procedures used to process jetton offline are also applicable to wallets. For jetton wallet processing, our most important recommendations are as follows:

1. When a wallet receives a transfer notification from an unknown jetton wallet, it is **vital** to trust the jetton wallet and its master address, as it may be a malicious fake. To protect yourself, verify the jetton master (master contract) using the address it provides to ensure that your verification processes recognize the jetton wallet as legitimate. Once you trust the wallet and it has been verified as legitimate, you can allow it to access your account balances and other data in the wallet. If the jetton Master does not recognize this wallet, it is recommended not to initiate or disclose your jetton transfers at all and only show incoming TON transfers (Toncoin attached to transfer notifications).

2. In practice, if a user wants to interact with jetton and not the jetton wallet. In other words, users send wTON/oUSDT/jUSDT, jUSDC, jDAI instead of `EQAjN...`/`EQBLE...`
etc. Often this means that when a user initiates a jetton transfer, the wallet will ask the corresponding jetton master which jetton wallet (owned by the user) should initiate the transfer request. **It is important to never blindly trust** this data from the Master (master contract). Always verify that the jetton wallet actually belongs to the jetton Master it claims to belong to before sending a transfer request to a jetton wallet.
3. **Please be aware** that hostile jetton masters/jetton wallets **may change** their wallets/Masters over time. Therefore, it is imperative that users perform due diligence and verify the legitimacy of any wallets they interact with before each use.
4. **Always make sure** that you display tokens in your interface in a way that **does not mix with TON transfers**, system notifications, etc. Even the `symbol`, `name`, and `image` parameters
can be crafted to mislead users, making victims potential victims of fraud. There have been several cases of malicious tokens being used to simulate TON transfers, notification errors, rewards, or asset freeze announcements.
5. **Always be on guard against potential attackers** creating fake tokens, it is always a good idea to provide users with the functionality needed to eliminate unwanted tokens from their main user interface.


Authors are _[kosrk](https://github.com/kosrk)_, _[krigga](https://github.com/krigga)_, _[EmelyanenkoK](https://github.com/EmelyanenkoK/)_ and _[tolya-yanot](https://github.com/tolya-yanot/)_.


## Best practices

For ready-to-test examples, check [SDKs](/v3/guidelines/dapps/asset-processing/jettons#sdks)  and run them. The following code snippets help understand jetton processing with  practical examples.


### Send jettons with comment
<Tabs groupId="code-examples">
<TabItem value="tonweb" label="JS (tonweb)">

<details>
<summary>
Source code
</summary>

```js
// first 4 bytes are tag of text comment
const comment = new Uint8Array([... new Uint8Array(4), ... new TextEncoder().encode('text comment')]);

await wallet.methods.transfer({
  secretKey: keyPair.secretKey,
  toAddress: jetton_WALLET_ADDRESS, // address of jetton wallet of jetton sender
  amount: TonWeb.utils.toNano('0.05'), // total amount of TONs attached to the transfer message
  seqno: seqno,
  payload: await jettonWallet.createTransferBody({
    jettonAmount: TonWeb.utils.toNano('500'), // jetton amount (in basic indivisible units)
    toAddress: new TonWeb.utils.Address(WALLET2_ADDRESS), // recepient user's wallet address (not jetton wallet)
    forwardAmount: TonWeb.utils.toNano('0.01'), // some amount of TONs to invoke Transfer notification message
    forwardPayload: comment, // text comment for Transfer notification message
    responseAddress: walletAddress // return the TONs after deducting commissions back to the sender's wallet address
  }),
  sendMode: 3,
}).send()
```

</details>

</TabItem>
<TabItem value="tonutils-go" label="Golang">

<details>
<summary>
Source code
</summary>

```go
client := liteclient.NewConnectionPool()

// connect to testnet lite server
err := client.AddConnectionsFromConfigUrl(context.Background(), "https://ton.org/global.config.json")
if err != nil {
   panic(err)
}

ctx := client.StickyContext(context.Background())

// initialize ton api lite connection wrapper
api := ton.NewAPIClient(client)

// seed words of account, you can generate them with any wallet or using wallet.NewSeed() method
words := strings.Split("birth pattern then forest walnut then phrase walnut fan pumpkin pattern then cluster blossom verify then forest velvet pond fiction pattern collect then then", " ")

w, err := wallet.FromSeed(api, words, wallet.V3R2)
if err != nil {
   log.Fatalln("FromSeed err:", err.Error())
   return
}

token := jetton.NewJettonMasterClient(api, address.MustParseAddr("EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw"))

// find our jetton wallet
tokenWallet, err := token.GetJettonWallet(ctx, w.WalletAddress())
if err != nil {
   log.Fatal(err)
}

amountTokens := tlb.MustFromDecimal("0.1", 9)

comment, err := wallet.CreateCommentCell("Hello from tonutils-go!")
if err != nil {
   log.Fatal(err)
}

// address of receiver's wallet (not token wallet, just usual)
to := address.MustParseAddr("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N")
transferPayload, err := tokenWallet.BuildTransferPayload(to, amountTokens, tlb.ZeroCoins, comment)
if err != nil {
   log.Fatal(err)
}

// your TON balance must be > 0.05 to send
msg := wallet.SimpleMessage(tokenWallet.Address(), tlb.MustFromTON("0.05"), transferPayload)

log.Println("sending transaction...")
tx, _, err := w.SendWaitTransaction(ctx, msg)
if err != nil {
   panic(err)
}
log.Println("transaction confirmed, hash:", base64.StdEncoding.EncodeToString(tx.Hash))
```

</details>

</TabItem>
<TabItem value="TonTools" label="Python">

<details>
<summary>
Source code
</summary>

```py
my_wallet = Wallet(provider=client, mnemonics=my_wallet_mnemonics, version='v4r2')

# for TonCenterClient and LsClient
await my_wallet.transfer_jetton(destination_address='address', jetton_master_address=jetton.address, jettons_amount=1000, fee=0.15) 

# for all clients
await my_wallet.transfer_jetton_by_jetton_wallet(destination_address='address', jetton_wallet='your jetton wallet address', jettons_amount=1000, fee=0.1)  
```

</details>

</TabItem>

<TabItem value="pytoniq" label="Python">

<details>
<summary>
Source code
</summary>

```py
from pytoniq import LiteBalancer, WalletV4R2, begin_cell
import asyncio

mnemonics = ["your", "mnemonics", "here"]

async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()

    wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)
    USER_ADDRESS = wallet.address
    jetton_MASTER_ADDRESS = "EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE"
    DESTINATION_ADDRESS = "EQAsl59qOy9C2XL5452lGbHU9bI3l4lhRaopeNZ82NRK8nlA"

    USER_jetton_WALLET = (await provider.run_get_method(address=jetton_MASTER_ADDRESS,
                                                        method="get_wallet_address",
                                                        stack=[begin_cell().store_address(USER_ADDRESS).end_cell().begin_parse()]))[0].load_address()
    forward_payload = (begin_cell()
                      .store_uint(0, 32) # TextComment op-code
                      .store_snake_string("Comment")
                      .end_cell())
    transfer_cell = (begin_cell()
                    .store_uint(0xf8a7ea5, 32)          # jetton Transfer op-code
                    .store_uint(0, 64)                  # query_id
                    .store_coins(1 * 10**9)             # jetton amount to transfer in nanojetton
                    .store_address(DESTINATION_ADDRESS) # Destination address
                    .store_address(USER_ADDRESS)        # Response address
                    .store_bit(0)                       # Custom payload is None
                    .store_coins(1)                     # Ton forward amount in nanoton
                    .store_bit(1)                       # Store forward_payload as a reference
                    .store_ref(forward_payload)         # Forward payload
                    .end_cell())

    await wallet.transfer(destination=USER_jetton_WALLET, amount=int(0.05*1e9), body=transfer_cell)
    await provider.close_all()

asyncio.run(main())
```

</details>

</TabItem>
</Tabs>


### Accept jetton transfer with comment parse

<Tabs groupId="parse-code-examples">
<TabItem value="tonweb" label="JS (tonweb)">

<details>
<summary>
Source code
</summary>

```ts
import {
    Address,
    TonClient,
    Cell,
    beginCell,
    storeMessage,
    jettonMaster,
    OpenedContract,
    jettonWallet,
    Transaction
} from '@ton/ton';


export async function retry<T>(fn: () => Promise<T>, options: { retries: number, delay: number }): Promise<T> {
    let lastError: Error | undefined;
    for (let i = 0; i < options.retries; i++) {
        try {
            return await fn();
        } catch (e) {
            if (e instanceof Error) {
                lastError = e;
            }
            await new Promise(resolve => setTimeout(resolve, options.delay));
        }
    }
    throw lastError;
}

export async function tryProcessjetton(orderId: string) : Promise<string> {

    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: 'TONCENTER-API-KEY', // https://t.me/tonapibot
    });

    interface jettonInfo {
        address: string;
        decimals: number;
    }

    interface jettons {
        JettonMinter : OpenedContract<jettonMaster>,
        jettonWalletAddress: Address,
        jettonWallet: OpenedContract<jettonWallet>
    }

    const MY_WALLET_ADDRESS = 'INSERT-YOUR-HOT-WALLET-ADDRESS'; // your HOT wallet

    const jettonS_INFO : Record<string, jettonInfo> = {
        'jUSDC': {
            address: 'EQB-MPwrd1G6WKNkLz_VnV6WqBDd142KMQv-g1O-8QUA3728', //
            decimals: 6
        },
        'jUSDT': {
            address: 'EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA',
            decimals: 6
        },
    }
    const jettons: Record<string, jettons> = {};

    const prepare = async () => {
        for (const name in jettonS_INFO) {
            const info = jettonS_INFO[name];
            const jettonMaster = client.open(jettonMaster.create(Address.parse(info.address)));
            const userAddress = Address.parse(MY_WALLET_ADDRESS);

            const jettonUserAddress =  await jettonMaster.getWalletAddress(userAddress);
          
            console.log('My jetton wallet for ' + name + ' is ' + jettonUserAddress.toString());

            const jettonWallet = client.open(jettonWallet.create(jettonUserAddress));

            //const jettonData = await jettonWallet;
            const jettonData = await client.runMethod(jettonUserAddress, "get_wallet_data")

            jettonData.stack.pop(); //skip balance
            jettonData.stack.pop(); //skip owneer address
            const adminAddress = jettonData.stack.readAddress();


            if (adminAddress.toString() !== (Address.parse(info.address)).toString()) {
                throw new Error('jetton minter address from jetton wallet doesnt match config');
            }

            jettons[name] = {
                JettonMinter: jettonMaster,
                jettonWalletAddress: jettonUserAddress,
                jettonWallet: jettonWallet
            };
        }
    }

    const jettonWalletAddressTojettonName = (jettonWalletAddress : Address) => {
        const jettonWalletAddressString = jettonWalletAddress.toString();
        for (const name in jettons) {
            const jetton = jettons[name];

            if (jetton.jettonWallet.address.toString() === jettonWalletAddressString) {
                return name;
            }
        }
        return null;
    }

    // Subscribe
    const Subscription = async ():Promise<Transaction[]> =>{

      const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: 'TONCENTER-API-KEY', // https://t.me/tonapibot
      });

        const myAddress = Address.parse('INSERT-YOUR-HOT-WALLET'); // Address of receiver TON wallet
        const transactions = await client.getTransactions(myAddress, {
            limit: 5,
        });
        return transactions;
    }

    return retry(async () => {

        await prepare();
        const Transactions = await Subscription();

        for (const tx of Transactions) {

            const sourceAddress = tx.inMessage?.info.src;
            if (!sourceAddress) {
                // external message - not related to jettons
                continue;
            }

            if (!(sourceAddress instanceof Address)) {
                continue;
            }

            const in_msg = tx.inMessage;

            if (in_msg?.info.type !== 'internal') {
                // external message - not related to jettons
                continue;
            }

            // jetton master contract address check
            const jettonName = jettonWalletAddressTojettonName(sourceAddress);
            if (!jettonName) {
                // unknown or fake jetton transfer
                continue;
            }

            if (tx.inMessage === undefined || tx.inMessage?.body.hash().equals(new Cell().hash())) {
                // no in_msg or in_msg body
                continue;
            }

            const msgBody = tx.inMessage;
            const sender = tx.inMessage?.info.src;
            const originalBody = tx.inMessage?.body.beginParse();
            let body = originalBody?.clone();
            const op = body?.loadUint(32);
            if (!(op == 0x7362d09c)) {
                continue; // op != transfer_notification
            }

            console.log('op code check passed', tx.hash().toString('hex'));

            const queryId = body?.loadUint(64);
            const amount = body?.loadCoins();
            const from = body?.loadAddress();
            const maybeRef = body?.loadBit();
            const payload = maybeRef ? body?.loadRef().beginParse() : body;
            const payloadOp = payload?.loadUint(32);
            if (!(payloadOp == 0)) {
                console.log('no text comment in transfer_notification');
                continue;
            }

            const comment = payload?.loadStringTail();
            if (!(comment == orderId)) {
                continue;
            }
            
            console.log('Got ' + jettonName + ' jetton deposit ' + amount?.toString() + ' units with text comment "' + comment + '"');
            const txHash = tx.hash().toString('hex');
            return (txHash);
        }
        throw new Error('Transaction not found');
    }, {retries: 30, delay: 1000});
}
```

</details>

</TabItem>
<TabItem value="tonutils-go" label="Golang">

<details>
<summary>
Source code
</summary>

```go
import (
	"context"
	"fmt"
	"log"

	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/jetton"
	"github.com/xssnick/tonutils-go/tvm/cell"
)

const (
	MainnetConfig   = "https://ton.org/global.config.json"
	TestnetConfig   = "https://ton.org/global.config.json"
	MyWalletAddress = "INSERT-YOUR-HOT-WALLET-ADDRESS"
)

type jettonInfo struct {
	address  string
	decimals int
}

type jettons struct {
	JettonMinter        *jetton.Client
	jettonWalletAddress string
	jettonWallet        *jetton.WalletClient
}

func prepare(api ton.APIClientWrapped, jettonsInfo map[string]jettonInfo) (map[string]jettons, error) {
	userAddress := address.MustParseAddr(MyWalletAddress)
	block, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		return nil, err
	}

	jettons := make(map[string]jettons)

	for name, info := range jettonsInfo {
		jettonMaster := jetton.NewjettonMasterClient(api, address.MustParseAddr(info.address))
		jettonWallet, err := jettonMaster.GetjettonWallet(context.Background(), userAddress)
		if err != nil {
			return nil, err
		}

		jettonUserAddress := jettonWallet.Address()

		jettonData, err := api.RunGetMethod(context.Background(), block, jettonUserAddress, "get_wallet_data")
		if err != nil {
			return nil, err
		}

		slice := jettonData.MustCell(0).BeginParse()
		slice.MustLoadCoins() // skip balance
		slice.MustLoadAddr()  // skip owneer address
		adminAddress := slice.MustLoadAddr()

		if adminAddress.String() != info.address {
			return nil, fmt.Errorf("jetton minter address from jetton wallet doesnt match config")
		}

		jettons[name] = jettons{
			JettonMinter:        jettonMaster,
			jettonWalletAddress: jettonUserAddress.String(),
			jettonWallet:        jettonWallet,
		}
	}

	return jettons, nil
}

func jettonWalletAddressTojettonName(jettons map[string]jettons, jettonWalletAddress string) string {
	for name, info := range jettons {
		if info.jettonWallet.Address().String() == jettonWalletAddress {
			return name
		}
	}
	return ""
}

func GetTransferTransactions(orderId string, foundTransfer chan<- *tlb.Transaction) {
	jettonsInfo := map[string]jettonInfo{
		"jUSDC": {address: "EQB-MPwrd1G6WKNkLz_VnV6WqBDd142KMQv-g1O-8QUA3728", decimals: 6},
		"jUSDT": {address: "EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA", decimals: 6},
	}

	client := liteclient.NewConnectionPool()

	cfg, err := liteclient.GetConfigFromUrl(context.Background(), MainnetConfig)
	if err != nil {
		log.Fatalln("get config err: ", err.Error())
	}

	// connect to lite servers
	err = client.AddConnectionsFromConfig(context.Background(), cfg)
	if err != nil {
		log.Fatalln("connection err: ", err.Error())
	}

	// initialize ton api lite connection wrapper
	api := ton.NewAPIClient(client, ton.ProofCheckPolicySecure).WithRetry()
	master, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		log.Fatalln("get masterchain info err: ", err.Error())
	}

	// address on which we are accepting payments
	treasuryAddress := address.MustParseAddr("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N")

	acc, err := api.GetAccount(context.Background(), master, treasuryAddress)
	if err != nil {
		log.Fatalln("get masterchain info err: ", err.Error())
	}

	jettons, err := prepare(api, jettonsInfo)
	if err != nil {
		log.Fatalln("can't prepare jettons data: ", err.Error())
	}

	lastProcessedLT := acc.LastTxLT

	transactions := make(chan *tlb.Transaction)

	go api.SubscribeOnTransactions(context.Background(), treasuryAddress, lastProcessedLT, transactions)

	log.Println("waiting for transfers...")

	// listen for new transactions from channel
	for tx := range transactions {
		if tx.IO.In == nil || tx.IO.In.MsgType != tlb.MsgTypeInternal {
			// external message - not related to jettons
			continue
		}

		msg := tx.IO.In.Msg
		sourceAddress := msg.SenderAddr()

		// jetton master contract address check
		jettonName := jettonWalletAddressTojettonName(jettons, sourceAddress.String())
		if len(jettonName) == 0 {
			// unknown or fake jetton transfer
			continue
		}

		if msg.Payload() == nil || msg.Payload() == cell.BeginCell().EndCell() {
			// no in_msg body
			continue
		}

		msgBodySlice := msg.Payload().BeginParse()

		op := msgBodySlice.MustLoadUInt(32)
		if op != 0x7362d09c {
			continue // op != transfer_notification
		}

		// just skip bits
		msgBodySlice.MustLoadUInt(64)
		amount := msgBodySlice.MustLoadCoins()
		msgBodySlice.MustLoadAddr()

		payload := msgBodySlice.MustLoadMaybeRef()
		payloadOp := payload.MustLoadUInt(32)
		if payloadOp == 0 {
			log.Println("no text comment in transfer_notification")
			continue
		}

		comment := payload.MustLoadStringSnake()
		if comment != orderId {
			continue
		}

		// process transaction
		log.Printf("Got %s jetton deposit %d units with text comment %s\n", jettonName, amount, comment)
		foundTransfer <- tx
	}
}
```

</details>
</TabItem>

<TabItem value="pythoniq" label="Python">

<details>
<summary>
Source code
</summary>

```py
import asyncio

from pytoniq import LiteBalancer, begin_cell

MY_WALLET_ADDRESS = "EQAsl59qOy9C2XL5452lGbHU9bI3l4lhRaopeNZ82NRK8nlA"


async def parse_transactions(provider: LiteBalancer, transactions):
    for transaction in transactions:
        if not transaction.in_msg.is_internal:
            continue
        if transaction.in_msg.info.dest.to_str(1, 1, 1) != MY_WALLET_ADDRESS:
            continue

        sender = transaction.in_msg.info.src.to_str(1, 1, 1)
        value = transaction.in_msg.info.value_coins
        if value != 0:
            value = value / 1e9

        if len(transaction.in_msg.body.bits) < 32:
            print(f"TON transfer from {sender} with value {value} TON")
            continue

        body_slice = transaction.in_msg.body.begin_parse()
        op_code = body_slice.load_uint(32)
        if op_code != 0x7362D09C:
            continue

        body_slice.load_bits(64)  # skip query_id
        jetton_amount = body_slice.load_coins() / 1e9
        jetton_sender = body_slice.load_address().to_str(1, 1, 1)
        if body_slice.load_bit():
            forward_payload = body_slice.load_ref().begin_parse()
        else:
            forward_payload = body_slice

        jetton_master = (
            await provider.run_get_method(
                address=sender, method="get_wallet_data", stack=[]
            )
        )[2].load_address()
        jetton_wallet = (
            (
                await provider.run_get_method(
                    address=jetton_master,
                    method="get_wallet_address",
                    stack=[
                        begin_cell()
                        .store_address(MY_WALLET_ADDRESS)
                        .end_cell()
                        .begin_parse()
                    ],
                )
            )[0]
            .load_address()
            .to_str(1, 1, 1)
        )

        if jetton_wallet != sender:
            print("FAKE jetton Transfer")
            continue

        if len(forward_payload.bits) < 32:
            print(
                f"jetton transfer from {jetton_sender} with value {jetton_amount} jetton"
            )
        else:
            forward_payload_op_code = forward_payload.load_uint(32)
            if forward_payload_op_code == 0:
                print(
                    f"jetton transfer from {jetton_sender} with value {jetton_amount} jetton and comment: {forward_payload.load_snake_string()}"
                )
            else:
                print(
                    f"jetton transfer from {jetton_sender} with value {jetton_amount} jetton and unknown payload: {forward_payload} "
                )

        print(f"Transaction hash: {transaction.cell.hash.hex()}")
        print(f"Transaction lt: {transaction.lt}")


async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()
    transactions = await provider.get_transactions(address=MY_WALLET_ADDRESS, count=5)
    await parse_transactions(provider, transactions)
    await provider.close_all()


if __name__ == "__main__":
    asyncio.run(main())
```

</details>
</TabItem>
</Tabs>

## SDKs
You can find a list of SDKs for different languages ​​(JS, Python, Golang, C#, Rust, etc.) list [here](/v3/guidelines/dapps/apis-sdks/sdk).

## See also

* [Payments processing](/v3/guidelines/dapps/asset-processing/payments-processing)
* [NFT processing on TON](/v3/guidelines/dapps/asset-processing/nft-processing/nfts)
* [Metadata parsing on TON](/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing)

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/asset-processing/mass-mint-tools.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/asset-processing/mass-mint-tools.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# Mass minting tools

In an era of launching major on-chain projects with millions of users, peak loads can impact the user experience across entire TON Ecosystem.

To prevent these issues and ensure a smooth launch, we recommend using the high-load distribution system provided on this page.

### Mass sender

:::info
Recommended for token airdrops. Battle-tested on Notcoin and DOGS in September.

:::

Access: [Mass sender](https://docs.tonconsole.com/tonconsole/jettons/mass-sending)

Specification:
- Directly distributes tokens, with the project covering gas fees during claims.
- Low network load (latest versions are optimized).
- Self-regulates load by slowing distribution when network activity is high.

### Mintless jettons

Access: [Mintless jettons](/v3/guidelines/dapps/asset-processing/mintless-jettons)

:::info
  battle-tested on HAMSTER
:::

Specification:
- Users claim airdrop tokens without transactions,
- Projects don't earn from claims,
- Minimal network load.


### TokenTable v4

:::info
  battle-tested on Avacoin, DOGS
:::

Access: [www.tokentable.xyz](https://www.tokentable.xyz/)

- Higher network load than mass sender, as users make transactions when claiming,
- Projects can also earn from user claims,
- Projects pay TokenTable for setup.


### Gigadrop

:::info
  battle-tested on HAMSTER
:::

Access: [gigadrop.io](https://gigadrop.io/)

- Higher network load than mass sender, as users make transactions when claiming,
- Flexible load control,
- Claim integration within your app,
- Projects can also earn from user claims.

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/asset-processing/mintless-jettons.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/asset-processing/mintless-jettons.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# Mintless jettons processing

## Introduction

:::info
To understand this document, you should be familiar with the basic principles of asset processing outlined in [payments processing section](/v3/guidelines/dapps/asset-processing/payments-processing) and [jetton processing](/v3/guidelines/dapps/asset-processing/jettons).
:::

TON has introduced [mintless jettons](https://github.com/ton-community/mintless-jetton?tab=readme-ov-file), an innovative extension of the Jetton standard.

This extension enables decentralized, [merkle-proof](/v3/documentation/data-formats/tlb/exotic-cells#merkle-proof) airdrops without requiring traditional minting processes.

## Overview

Mintless jettons are an extension ([TEP-177](https://github.com/ton-blockchain/TEPs/pull/177) and [TEP-176](https://github.com/ton-blockchain/TEPs/pull/176)) of the standard jetton implementation ([TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)) on TON Blockchain.

This implementation enables large-scale, decentralized airdrops to millions of users while minimizing costs and blockchain load.

### Basic features

- **Scalability**: Traditional minting processes can be resource-intensive and costly when distributing tokens to a vast number of users.
- **Efficiency**: By utilizing merkle trees, mintless jettons store a single hash representing all airdropped amounts, reducing storage requirements.
- **User-friendly airdrops**: Users receive jettons immediately, ready for transactions like sending and swapping—without needing to withdraw or claim them first.

## Supporting mintless jettons in on-chain protocols

Because mintless jettons extend the standard jettons, you can interact with them the same way you would with USDT, NOT, Scale, or STON—no additional steps required.

## Supporting mintless jettons in wallet applications

Wallet applications play a key role in improving the user experience with mintless jettons:

- **Display unclaimed jettons**: Wallets should show users the jettons they are eligible to claim based on the merkle tree data.
- **Automated claim process**: When users initiate an outgoing transfer, wallets should automatically include the necessary merkle proof in the transfer message's custom payload.

Wallets can achieve this by:

Integrating with the off-chain API specified in the [custom payload API](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-example-offchain):
  - Check if the jetton is mintless.
  - Verify whether the wallet owner has claimed it.
  - If unclaimed, retrieve data from the custom payload API and add the off-chain balance to the on-chain one.
  - If the user hasn’t claimed the airdrop, retrieve the custom payload and initialization data from the Custom Payload API and include it in the `transfer` message to the jetton wallet.

Using a custom API:
  - Download the airdrop tree from `mintless_merkle_dump_uri` in the jetton metadata.
  - Parse the data as explained in section 6 below.
  - Make the parsed result available via API.

:::info
Wallets are not required to support mintless claims, including indexing airdrop trees. Wallet applications may charge the jetton issuer for this service.
:::
## Supporting mintless jettons in dApps (DEX/Lending platforms)

Because wallet applications handle claims automatically, dApps don’t need special logic for mintless jettons. dApps can use APIs (such as TonAPI or Ton Center API) to display unclaimed balances.

To improve the user experience, dApps can check if the user's wallet application supports a specific mintless jetton. If unsupported, retrieve the airdrop proof and initialization data from the jetton API and include it in the transfer message.

## Deploy a mintless jetton

Deploying a mintless jetton involves several steps:

1. Prepare a merkle tree:
  - Generate a merkle tree with all airdrop recipients and their respective amounts.
  - Compute the root `merkle_hash`.

2. Deploy a jetton master contract:
  - Include the `merkle_hash` in the contract's storage.
  - Ensure the contract complies with the extended jetton standard; you may use the [mintless jetton standard implementation](https://github.com/ton-community/mintless-jetton) as an example.

3. Provide merkle proofs:
  - Host the merkle tree data off-chain.
  - Implement the custom payload API to allow wallets to fetch the necessary proofs.

4. Update metadata:
  - Add `mintless_merkle_dump_uri` and `custom_payload_api_uri` to the token's metadata as per the [metadata standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md).

5. Request support from wallets:
  - Ask wallet applications to index your mintless jetton.

By following these steps, you can deploy a mintless jetton that users can seamlessly claim during regular transactions.

## Retrieving airdrop information

Auditing the airdrop and verifying the total supply involves a few steps.

### Accessing the merkle dump
- Download the merkle tree data from the `mintless_merkle_dump_uri` in the metadata. It can be stored in TON Storage, IPFS, a web 2.0 resource, or other formats. This file contains `HashMap{address -> airdrop_data}` as a BoC file. The `airdrop_data` includes the amount, Unix timestamp from which the claim is available (`start_from`), and Unix timestamp when the claim expires (`expired_at`).

### Checking integrity
- Compare the mintless merkle dump cell hash with the hash stored in the jetton minter. You can retrieve the latter on-chain using the `get_mintless_airdrop_hashmap_root` get-method of the minter contract.

### Verifying balances
- Use the merkle tree to confirm individual balances and ensure they add up to the expected total supply.

## Tooling

Several utilities can help with these processes.

### mintless-proof-generator (from Core)

1. **Compile the utility**:

```bash
git clone https://github.com/ton-blockchain/ton
```

```bash
cd ton
```

```bash
git checkout testnet
```

```bash
mkdir build && cd build
```

```bash
cmake ../
```

```bash
make mintless-proof-generator
```

- The compiled file is stored as `build/crypto/mintless-proof-generator`.

2. **Run a check**:

```bash
build/crypto/mintless-proof-generator parse <input-boc> <output-file>
```
This utility will print the mintless merkle dump cell hash and store to `<output-file>` the list of all airdrops in `<address> <amount> <start_from> <expired_at>` format (one airdrop per line).

You can additionally generate all merkle proofs (needed for `custom_payload_api_uri`) via the `mintless-proof-generator make_all_proofs <input-boc> <output-file>` command.

### mintless-toolbox (from Tonkeeper)

1. **Compile the utility**:
```bash
git clone https://github.com/tonkeeper/mintless-toolbox.git
```

```bash
cd mintless-toolbox
```

```bash
make
```

2. **Run a check**:

```bash
./bin/mintless-cli dump <airdrop-filename>
```
- This utility reads an airdrop file and prints it to the console in the format: `address,amount,start_from,expire_at`.

By auditing the merkle tree and contract data, stakeholders can verify the integrity of the airdrop and token supply.

## Conclusion

Mintless jettons provide an efficient and scalable solution for large-scale token airdrops on TON Blockchain. By extending the standard jetton implementation, they reduce costs and blockchain load while maintaining security and decentralization.

Supporting mintless jettons across smart contracts, wallet applications, and dApps ensures a seamless user experience and drives adoption. Deploying and auditing mintless jettons requires careful implementation of merkle trees and compliance with extended standards, contributing to a transparent and robust token ecosystem.


## See also

- [Understanding mintless jettons: a comprehensive guide](https://gist.github.com/EmelyanenkoK/bfe633bdf8e22ca92a5138e59134988f) - the original post.
- [Mintless jetton standard implementation](https://github.com/ton-community/mintless-jetton)
- [Jetton offchain payloads TEP](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-example-offchain)
- [Jetton metadata standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md)

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing.md
================================================
import Feedback from '@site/src/components/Feedback';

# Metadata parsing

The metadata standard covering NFTs, NFT collections, and jettons, is outlined in TON Enhancement Proposal 64 [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md).

On TON, entities can have three types of metadata: on-chain, semi-chain, and off-chain.
- **On-chain metadata:** stored inside the blockchain, including the name, attributes, and image.
- **Off-chain metadata:** stored using a link to a metadata file hosted outside the chain.
- **Semi-chain metadata:** a hybrid approach that allows storing small fields such as names or attributes on the blockchain while hosting the image off-chain and storing only a link to it.

## Snake data encoding
The Snake encoding format allows part of the data to be stored in a standardized cell, while the remaining portion is stored in a child cell recursively. The Snake encoding format must be prefixed using the 0x00 byte. The TL-B scheme:


```tlb
tail#_ {bn:#} b:(bits bn) = SnakeData ~0;
cons#_ {bn:#} {n:#} b:(bits bn) next:^(SnakeData ~n) = SnakeData ~(n + 1);
```

The Snake format stores additional data in a cell when the data exceeds the maximum size that a single cell can store. It does this by placing part of the data in the root cell and the remaining portion in the first child cell, continuing recursively until all data is stored.

Below is an example of Snake format encoding and decoding in TypeScript:
```typescript
export function makeSnakeCell(data: Buffer): Cell {
  const chunks = bufferToChunks(data, 127)

  if (chunks.length === 0) {
    return beginCell().endCell()
  }

  if (chunks.length === 1) {
    return beginCell().storeBuffer(chunks[0]).endCell()
  }

  let curCell = beginCell()

  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunk = chunks[i]

    curCell.storeBuffer(chunk)

    if (i - 1 >= 0) {
      const nextCell = beginCell()
      nextCell.storeRef(curCell)
      curCell = nextCell
    }
  }

  return curCell.endCell()
}

export function flattenSnakeCell(cell: Cell): Buffer {
  let c: Cell | null = cell;

  const bitResult = new BitBuilder();
  while (c) {
    const cs = c.beginParse();
    if (cs.remainingBits === 0) {
      break;
    }

    const data = cs.loadBits(cs.remainingBits);
    bitResult.writeBits(data);
    c = c.refs && c.refs[0];
  }

  const endBits = bitResult.build();
  const reader = new BitReader(endBits);

  return reader.loadBuffer(reader.remaining / 8);
}
```

The 0x00 byte prefix is not always required in the root cell when using the Snake format, such as with off-chain NFT content. Additionally, cells are filled with bytes instead of bits to simplify parsing. To prevent issues when adding a reference in a child cell after it has already been written to its parent cell, the Snake cell is constructed in reverse order.

## Chunked encoding

The chunked encoding format stores data using a dictionary structure, mapping a chunk_index to a chunk. Chunked encoding must be prefixed with the 0x01 byte. The TL-B scheme:

```tlb
chunked_data#_ data:(HashMapE 32 ^(SnakeData ~0)) = ChunkedData;
```

Below is an example of chunked data decoding in TypeScript:

```typescript
interface ChunkDictValue {
  content: Buffer;
}
export const ChunkDictValueSerializer = {
  serialize(src: ChunkDictValue, builder: Builder) {},
  parse(src: Slice): ChunkDictValue {
    const snake = flattenSnakeCell(src.loadRef());
    return { content: snake };
  },
};

export function ParseChunkDict(cell: Slice): Buffer {
  const dict = cell.loadDict(
    Dictionary.Keys.Uint(32),
    ChunkDictValueSerializer
  );

  let buf = Buffer.alloc(0);
  for (const [_, v] of dict) {
    buf = Buffer.concat([buf, v.content]);
  }
  return buf;
}
```

## NFT metadata attributes

| Attribute     | Type         | Requirement | Description                                                                                                                                                        |
|---------------|--------------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `uri`         | ASCII string       | optional    | A URI pointing to the JSON document with metadata used by the "Semi-chain content layout." |
| `name`        | UTF8 string  | optional    | Identifies the asset.                                                                            |
| `description` | UTF8 string  | optional    | Describes the asset.                                                                              |
| `image`       | ASCII string | optional   | A URI pointing to a resource with a MIME type image.                                             |
| `image_data`  | binary*      | optional | Either a binary representation of the image for the on-chain layout or base64 for the off-chain layout.  |   


## Jetton metadata attributes
1. `uri` - Optional. Used by "Semi-chain content layout". ASCII string. A URI pointing to JSON document with metadata.
2. `name` - Optional. UTF8 string. Identifies the asset.
3. `description` - Optional. UTF8 string. Describes the asset.
4. `image` - Optional. ASCII string. A URI pointing to a resource with a mime type image.
5. `image_data` - Optional. Either a binary representation of the image for onchain layout or base64 for offchain layout.
6. `symbol` - Optional. UTF8 string. The symbol of the token - e.g. "XMPL". Used in the form "You received 99 XMPL".
7. `decimals` - Optional. If not specified, 9 is used by default. UTF8 encoded string with number from 0 to 255. The number of decimals the token uses - e.g. 8, means that the token amount must be divided by 100000000 to get its custom representation.
8. `amount_style` - Optional. Necessary for external applications to understand the format of displaying the number of tokens.
 - "n" - Displays the number of jettons as-is. For example, if a user has 100 tokens with 0 decimals, it displays "100 tokens".
 - "n-of-total" - Displays the number of jettons relative to the total supply. If totalSupply = 1000 and a user holds 100 jettons, it is displayed as "100 of 1000".
 - "%" - Displays jettons as a percentage of the total supply. If totalSupply = 1000 and a user holds 100 jettons, it is displayed as "10%".
9. `render_type` - Optional. Required by external applications to understand which group a token belongs to and how to display it. 
 - "currency" - Displays as a currency (default value). 
 - "game" - Displays as an NFT while also considering the `amount_style`.




| Attribute     | Type             | Requirement                                                                                                                                                                                                                                                                                             | Description |
|---------------|------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
|`uri`| ASCII string     | optional                                                                                                                                                                                                                                                                                                | A URI pointing to the JSON document with metadata used by the "Semi-chain content layout."            |
|`name`| UTF8 string      | optional                                                                                                                                                                                                                                                                                                |Identifies the asset|
|`description`| UTF8 string      | optional                                                                                                                                                                                                                                                                                                |Describes the asset|
|`image`| ASCII string | optional                                                                                                                                                                                                                                                                                                |A URI pointing to a resource with a mime type image|
|`image_data`| binary*                 | optional                                                                                                                                                                                                                                                                                                |Either a binary representation of the image of an on-chain layout or base64 for off-chain layout|
|`symbol` |UTF8 string| optional                                                                                                                                                                                                                                                                                                | Token symbol - for example, "XMPL" and uses the form "You have received 99 XMPL"|
|`decimals`|UTF8 string| optional                                                                                                                                                                                                                                                                                                |The number of decimal places used by the token. If not specified, the default is 9. A UTF8-encoded string with numbers from 0 to 255. - for example, 8 means that the token amount must be divided by 100000000 to get its custom representation.|
|`amount_style`||optional| Required by external applications to understand the format of displaying the number of tokens. Defined using _n_, _n-of-total_, _%_.                                                                                                                                                                   |
|`render_type`||optional| Needed by external applications to understand what group a token belongs to and how to display it. "currency" - displays as currency (default). "game" - display used for games, displays as NFT, but also displays the number of tokens and respects the amount_style value. |


> `amount_style` parameters:
* _n_ - number of jettons (default value). If the user has 100 tokens with 0 decimals, then it displays that the user has 100 tokens.
* _n-of-total_ - the number of jettons out of the total number of issued jettons. For example, if the totalSupply of jettons is 1000 and the user has 100 jettons in their wallet, it must be displayed in the user's wallet as 100 of 1000 or in another textual or graphical way to demonstrate the ratio of user tokens to the total amount of tokens available.
* _%_ - the percentage of jettons from the total number of jettons issued. For example, if the total number of tokens is 1000 and the user has 100 tokens, the percentage should be displayed as 10% of the user's wallet balance (100 ÷ 1000 = 0.1 or 10%).

> `render_type` parameters:
* _currency_ - displayed as a currency (default value).
* _game_ - display used for games that appears as an NFT but also displays the number of tokens and takes into account the `amount_style` value.

## Parsing metadata
To parse metadata, NFT data must first be obtained from the blockchain. To better understand this process, consider reading the [retrieving NFT data](/v3/guidelines/dapps/asset-processing/nft-processing/nfts#retrieving-nft-data) section of our TON asset processing documentation section.

After on-chain NFT data is retrieved, it must be parsed. To carry out this process, the NFT content type must be determined by reading the first byte that makes up the inner workings of the NFT.

### Off-chain
f the metadata byte string starts with 0x01, it signifies off-chain NFT content. The remaining portion of the NFT content is decoded using the Snake encoding format as an ASCII string. Once the NFT URL is obtained and the NFT identification data is retrieved, the process is complete. Here is an example of a URL using off-chain NFT content metadata parsing:: 
`https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/95/meta.json`

URL contents (from directly above):
```json
{
   "name": "TON Smart Challenge #2 Winners Trophy",
   "description": "TON Smart Challenge #2 Winners Trophy 1 place out of 181",
   "image": "https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/images/943e994f91227c3fdbccbc6d8635bfaab256fbb4",
   "content_url": "https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/content/84f7f698b337de3bfd1bc4a8118cdfd8226bbadf",
   "attributes": []
}
```

### On-chain and semi-chain
If the metadata byte string starts with `0x00`, it indicates on-chain or semi-chain NFT metadata.

The metadata is stored in a dictionary where the key is the SHA256 hash of the attribute name, and the value is the data stored using the Snake or Chunked format.

To determine the NFT type, a developer must read known NFT attributes such as `uri`, `name`, `image`, `description`, and `image_data`. If the `uri` field is present within the metadata, it indicates a semi-chain layout, requiring the off-chain content specified in uri to be downloaded and merged with the dictionary values.

Examples:

On-chain NFT: [EQBq5z4N_GeJyBdvNh4tPjMpSkA08p8vWyiAX6LNbr3aLjI0](https://getgems.io/collection/EQAVGhk_3rUA3ypZAZ1SkVGZIaDt7UdvwA4jsSGRKRo-MRDN/EQBq5z4N_GeJyBdvNh4tPjMpSkA08p8vWyiAX6LNbr3aLjI0)

Semi-chain NFT: [EQB2NJFK0H5OxJTgyQbej0fy5zuicZAXk2vFZEDrqbQ_n5YW](https://getgems.io/nft/EQB2NJFK0H5OxJTgyQbej0fy5zuicZAXk2vFZEDrqbQ_n5YW)

On-chain jetton master: [EQA4pCk0yK-JCwFD4Nl5ZE4pmlg4DkK-1Ou4HAUQ6RObZNMi](https://tonscan.org/jetton/EQA4pCk0yK-JCwFD4Nl5ZE4pmlg4DkK-1Ou4HAUQ6RObZNMi)

On-chain NFT parser: [stackblitz/ton-onchain-nft-parser](https://stackblitz.com/edit/ton-onchain-nft-parser?file=src%2Fmain.ts)

## Important notes on NFT metadata
1. For NFT metadata, the `name`, `description`, and `image`(or `image_data`) fields are required to display the NFT.
2. For jetton metadata, the `name`, `symbol`, `decimals` and `image`(or `image_data`) fields are primary.
3. Anyone can create an NFT or Jetton using any `name`, `description`, or `image`. To prevent scams and confusion, apps should clearly distinguish NFTs from other assets.
4. Some items may include a `video` field linking to video content associated with the NFT or jetton.


## References
* [TON Enhancement Proposal 64 (TEP-64)](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md)

## See also
* [TON NFT processing](/v3/guidelines/dapps/asset-processing/nft-processing/nfts)
* [TON jetton processing](/v3/guidelines/dapps/asset-processing/jettons)
* [Mint your first jetton](/v3/guidelines/dapps/tutorials/mint-your-first-token)

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/asset-processing/nft-processing/nfts.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/asset-processing/nft-processing/nfts.md
================================================
import Feedback from '@site/src/components/Feedback';

# NFT processing

## Overview

This section provides a comprehensive understanding of NFTs on TON Blockchain. Readers will learn how to interact with NFTs and accept them through transactions.
The following information assumes familiarity with our previous [section on Toncoin payment processing](/v3/guidelines/dapps/asset-processing/payments-processing) and a basic understanding of programmatic interactions with wallet smart contracts.


## Understanding the basics of NFTs

NFTs operating on TON Blockchain are represented by the  [TEP-62](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md) and [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md) standards.

TON is designed for high performance, incorporating automatic sharding based on contract addresses to optimize NFT provisioning. To maintain efficiency, each NFT operates under its own smart contract. This enables collections of any size while minimizing development costs and performance bottlenecks. However, this structure introduces new considerations for NFT collection development.

Since each NFT has its own smart contract, it is not possible to retrieve details of all NFTs in a collection through a single contract. Instead, querying both the collection contract and each individual NFT contract is required to gather complete collection data. Similarly, tracking NFT transfers necessitates monitoring all transactions related to each NFT within a collection.

### NFT collections
An NFT Collection contract serves as an index and storage for NFT content. It should implement the following interfaces:
#### Get method `get_collection_data`
```
(int next_item_index, cell collection_content, slice owner_address) get_collection_data()
```
General collection information retrieval, including:

  1. `next_item_index` – Indicates the total number of NFTs in an ordered collection and the next available index for minting. For unordered collections, this value is -1, meaning a unique tracking mechanism (e.g., a TON DNS domain hash) is used.
  2. `collection_content` – A cell storing collection content in a TEP-64-compatible format.
  3. `owner_address` - A slice containing the collection owner’s address (can be empty).

#### Get method `get_nft_address_by_index`
```
(slice nft_address) get_nft_address_by_index(int index)
```
This method can be used to verify an NFT’s authenticity and confirm its membership in a specific collection. Additionally, it allows users to retrieve an NFT’s address by providing its collection index.


#### Get method `get_nft_content`
```
(cell full_content) get_nft_content(int index, cell individual_content)
```
Retrieving full NFT content
1. First, obtain the individual_content using the `get_nft_data()` method.
2. Then, call `get_nft_content()` with the NFT index and `individual_content`.
3. The method returns a TEP-64 cell containing the NFT’s full content.


### NFT Items
Basic NFTs should implement:

#### Get method `get_nft_data()`
```
(int init?, int index, slice collection_address, slice owner_address, cell individual_content) get_nft_data()
```

#### Inline message handler for `transfer`
```
transfer#5fcc3d14 query_id:uint64 new_owner:MsgAddress response_destination:MsgAddress custom_payload:(Maybe ^Cell) forward_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell) = InternalMsgBody
```
To facilitate an NFT transfer, a transfer message containing specific parameters is required:
1. `OP` - `0x5fcc3d14` - A constant defined in the TEP-62 standard.
2. `queryId` - `uint64` - A unique identifier to track the message.
3. `newOwnerAddress` - `MsgAddress` - The recipient’s smart contract address.
4. `responseAddress` - `MsgAddress` - Address for returning unused funds (e.g., when sending extra TON to cover fees).
5. `forwardAmount` - `Coins` - The amount of TON forwarded with the message (typically 0.01 TON). This funds an internal notification message to the `newOwnerAddress` upon successful receipt of the NFT.
6. `forwardPayload` - `Slice | Cell` - Optional data included in the ownership_assigned notification message.

This message (as explained above) is the primary way to interact with an NFT that changes ownership after receiving a notification as a result of the above message.

For example, this type of message above is often used to send an NFT Item smart contract from a wallet smart contract. When the NFT smart contract receives this message and executes it, the NFT contract storage (internal contract data) is updated along with the owner ID. In this way, the NFT item (contract) changes owners correctly. This process details a standard NFT transfer.

In this case, the transfer amount should be set to an appropriate value (0.01 TON for a regular wallet, or more if you want to execute the contract by transferring the NFT) to ensure that the new owner receives a notice of the ownership transfer. This is important because the new owner will not be notified that they have received the NFT without this notice.

## Retrieving NFT data

Most SDKs provide built-in methods to retrieve NFT data, including: [tonweb(js)](https://github.com/toncenter/tonweb/blob/b550969d960235314974008d2c04d3d4e5d1f546/src/contract/token/nft/NftItem.js#L38), [tonutils-go](https://github.com/xssnick/tonutils-go/blob/fb9b3fa7fcd734eee73e1a73ab0b76d2fb69bf04/ton/nft/item.go#L132), [pytonlib](https://github.com/toncenter/pytonlib/blob/d96276ec8a46546638cb939dea23612876a62881/pytonlib/client.py#L771), and more.

To fetch NFT details, the `get_nft_data()` method is used. For example, to verify the NFT at `EQB43-VCmf17O7YMd51fAvOjcMkCw46N_3JMCoegH_ZDo40e`(also known as [foundation.ton](https://tonscan.org/address/EQB43-VCmf17O7YMd51fAvOjcMkCw46N_3JMCoegH_ZDo40e) domain).

First, it is necessary to execute the get method by using the toncenter.com API:
```
curl -X 'POST' \
  'https://toncenter.com/api/v2/runGetMethod' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "address": "EQB43-VCmf17O7YMd51fAvOjcMkCw46N_3JMCoegH_ZDo40e",
  "method": "get_nft_data",
  "stack": []
}'
```
The response is generally something similar to the following:
```json
{
  "ok": true,
  "result": {
    "@type": "smc.runResult",
    "gas_used": 1581,
    "stack": [
      // init
      [ "num", "-0x1" ],
      // index
      [ "num", "0x9c7d56cc115e7cf6c25e126bea77cbc3cb15d55106f2e397562591059963faa3" ],
      // collection_address
      [ "cell", { "bytes": "te6cckEBAQEAJAAAQ4AW7psr1kCofjDYDWbjVxFa4J78SsJhlfLDEm0U+hltmfDtDcL7" } ],
      // owner_address
      [ "cell", { "bytes": "te6cckEBAQEAJAAAQ4ATtS415xpeB1e+YRq/IsbVL8tFYPTNhzrjr5dcdgZdu5BlgvLe" } ],
      // content
      [ "cell", { "bytes": "te6cckEBCQEA7AABAwDAAQIBIAIDAUO/5NEvz/d9f/ZWh+aYYobkmY5/xar2cp73sULgTwvzeuvABAIBbgUGAER0c3/qevIyXwpbaQiTnJ1y+S20wMpSzKjOLEi7Jwi/GIVBAUG/I1EBQhz26hlqnwXCrTM5k2Qg5o03P1s9x0U4CBUQ7G4HAUG/LrgQbAsQe0P2KTvsDm8eA3Wr0ofDEIPQlYa5wXdpD/oIAEmf04AQe/qqXMblNo5fl5kYi9eYzSLgSrFtHY6k/DdIB0HmNQAQAEatAVFmGM9svpAE9og+dCyaLjylPtAuPjb0zvYqmO4eRJF0AIDBvlU=" } ]
    ],
    "exit_code": 0,
    "@extra": "1679535187.3836682:8:0.06118075068995321"
  }
}
```
Return parameters:
- `init` - `boolean` - -1 if the NFT is initialized.
- `index` - `uint256` - NFT’s position in the collection.
- `collection_address` - `Cell` - Address of the collection contract.
- `owner_address` - `Cell` - Current NFT owner’s address.
- `content` - `Cell` - NFT content (parsed according to TEP-64).

## Retrieving all NFTs within a collection
The process varies based on whether the collection is ordered or unordered.

### Ordered collections
Retrieving all NFTs in an ordered collection is relatively simple, since the number of NFTs to retrieve is already known and their addresses are easy to obtain. To complete this process, you need to perform the following steps in this order:
1. Call the `get_collection_data` method using the Ton Center API on the collection contract and retrieve the `next_item_index` value from the response.
2. Use the `get_nft_address_by_index` method, passing in the `i` index value (initially set to 0) to retrieve the address of the first NFT in the collection.
3. Retrieve the NFT item data using the address obtained in the previous step. Then check that the initial NFT collection smart contract matches the NFT collection smart contract reported by the NFT item itself (to ensure that the collection has not appropriated another user's NFT smart contract).
4. Call the `get_nft_content` method with `i` and `individual_content` from the previous step.
5. Increment `i` by 1 and repeat steps 2-5 until `i` equals `next_item_index`.
6. At this point, you will have the information you need from the collection and its individual items.


### Unordered collections
Retrieving a list of NFTs in an unordered collection is more difficult because there is no built-in way to retrieve the addresses of NFTs that belong to the collection. Therefore, it is necessary to parse all the transactions in the collection contract and inspect all the outgoing messages to determine which ones correspond to NFTs that belong to the collection.

To do this, it is necessary to extract the NFT data and call the `get_nft_address_by_index` method on the collection with the ID returned by the NFT. If the NFT contract address and the address returned by the `get_nft_address_by_index` method match, it means that the NFT belongs to the current collection. However, parsing all the messages in the collection can be a lengthy process and may require archive nodes.

##  Working with NFTs outside of TON

### Sending NFTs

To transfer an NFT ownership, it is necessary to send an internal message from the NFT owner’s wallet to the NFT contract by creating a cell that contains a transfer message. This can be accomplished using libraries (such as [tonweb(js)](https://github.com/toncenter/tonweb/blob/b550969d960235314974008d2c04d3d4e5d1f546/src/contract/token/nft/NftItem.js#L65), [ton(js)](https://github.com/getgems-io/nft-contracts/blob/debcd8516b91320fa9b23bff6636002d639e3f26/packages/contracts/nft-item/NftItem.data.ts#L102), [tonutils-go(go)](https://github.com/xssnick/tonutils-go/blob/fb9b3fa7fcd734eee73e1a73ab0b76d2fb69bf04/ton/nft/item.go#L132)) for the specific language.

Once a transfer message has been created, it must be sent to the NFT item's contract address from the owner's wallet contract, specifying a sufficient amount of TON to cover the corresponding transaction fee.

To transfer an NFT from another user to yourself, it is necessary to use TON Connect 2.0 or a simple QR code that contains a ton:// link. For example:
`ton://transfer/{nft_address}?amount={message_value}&bin={base_64_url(transfer_message)}`

### Receiving NFTs
The process of tracking NFTs sent to a certain smart contract address (i.e. a user's wallet) is similar to the mechanism used to track payments. This is completed by listening to all new transactions in your wallet and parsing them. 

The next steps may vary depending on the specific use case. Let’s examine several different scenarios below.

#### Service waiting for known NFT address transfers:
- Check for new transactions sent from the NFT item's smart contract address.
- Read the first 32 bits of the message body using the `uint` type and check that it is equal to `op::ownership_assigned()`(`0x05138d91`)
- Read the next 64 bits from the message body as `query_id`.
- Read the address from the message body as `prev_owner_address`.
- Now you can manage your new NFT.
  
#### Service listening to all types of NFT transfer:
- Verify all new transactions and ignore those with a body length less than 363 bits (OP - 32, QueryID - 64, Address - 267).
- Repeat the steps detailed in the previous list above.
- If the process works correctly, you need to verify the authenticity of the NFT by analyzing it and the collection it belongs to. Next, you need to verify that the NFT belongs to the specified collection. More information on this process can be found in the section "Getting All NFTs of a Collection". This process can be simplified by using a whitelist of NFTs or collections.
- Now you can manage your new NFT.

#### Tying NFT transfers to internal transactions:

When receiving a transaction of this type, you must repeat the steps in the previous list. Once this process is complete, you can extract the `RANDOM_ID` parameter by reading the uint32 from the message body after reading the `prev_owner_address` value.

#### NFTs sent without a notification message:
All of the strategies outlined above rely on the services correctly creating a forward message with the NFT transfer. If they don't do this, we won't know that they transferred the NFT to us. However, there are a few workarounds:

All of the strategies outlined above rely on the service correctly creating a forward message within the NFT transfer. If this process is not carried out, it won’t be clear whether the NFT was transferred to the correct party. However, there are a several workarounds that are possible in this scenario:

- If a small number of NFTs is expected, it is possible to periodically parse them and verify if the owner has changed to the corresponding contract type.
- If a large number of NFTs is expected, it is possible to parse all new blocks and verify if there were any calls sent to the NFT destination using the `op::transfer` method. If a transaction like this is initiated, it is possible to verify the NFT owner and receive the transfer.
- If it's not possible to parse new blocks within the transfer, it is possible for users to trigger NFT ownership verification processes themselves. This way, it is possible to trigger the NFT ownership verification process after transferring an NFT without a notification.

## Interacting with NFTs from smart contracts

Now that we’ve covered the basics of sending and receiving NFTs, let’s explore how to receive and transfer NFTs from smart contracts using the [NFT Sale](https://github.com/ton-blockchain/token-contract/blob/1ad314a98d20b41241d5329e1786fc894ad811de/nft/nft-sale.fc) contract example.

### Sending NFTs

In this example, the NFT transfer message is found on [line 67](https://github.com/ton-blockchain/token-contract/blob/1ad314a98d20b41241d5329e1786fc894ad811de/nft/nft-sale.fc#L67):

```
var nft_msg = begin_cell()
  .store_uint(0x18, 6)
  .store_slice(nft_address)
  .store_coins(0)
  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
  .store_uint(op::transfer(), 32)
  .store_uint(query_id, 64)
  .store_slice(sender_address) ;; new_owner_address
  .store_slice(sender_address) ;; response_address
  .store_int(0, 1) ;; empty custom_payload
  .store_coins(0) ;; forward amount to new_owner_address
  .store_int(0, 1); ;; empty forward_payload


send_raw_message(nft_msg.end_cell(), 128 + 32);
```
Let's examine each line of code:
- `store_uint(0x18, 6)` - Stores message flags.
- `store_slice(nft_address)` - Stores the message destinations (NFT addresses).
- `store_coins(0)` -  Sets the amount of TON to send with the message to 0. The 128 [message mode](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes) is used to send the message with its remaining balance. To send a specific amount instead of the user’s entire balance, this value must be adjusted. It should be large enough to cover gas fees and any forwarding amounts.
- `store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)`  -  Leaves the remaining components of the message header empty..
- `store_uint(op::transfer(), 32)` - Marks the start of the msg_body. The transfer OP code is used to signal to the receiver that this is a transfer ownership message.
- `store_uint(query_id, 64)` - Stores query_id
- `store_slice(sender_address) ;; new_owner_address` - The first stored address is used for transferring NFTs and sending notifications.
- `store_slice(sender_address) ;; response_address` - The second stored address serves as the response address.
- `store_int(0, 1)` - Sets the custom payload flag to 0, indicating that no custom payload is required.
- `store_coins(0)` - Specifies the amount of TON to be forwarded with the message. While it is set to 0 in this example, it is recommended to set it to a higher amount (at least 0.01 TON) to create a forward message and notify the new owner that they have received the NFT. The amount should be sufficient to cover any associated fees and costs.
- `.store_int(0, 1)` - Custom payload flag. This should be set to 1 if your service needs to pass the payload as a reference.

### Receiving NFTs
Once we've sent the NFT, it is critical to determine when it has been received by the new owner. A good example of how to do this can be found in the same NFT sale smart contract:

```
slice cs = in_msg_full.begin_parse();
int flags = cs~load_uint(4);

if (flags & 1) {  ;; ignore all bounced messages
    return ();
}
slice sender_address = cs~load_msg_addr();
throw_unless(500, equal_slices(sender_address, nft_address));
int op = in_msg_body~load_uint(32);
throw_unless(501, op == op::ownership_assigned());
int query_id = in_msg_body~load_uint(64);
slice prev_owner_address = in_msg_body~load_msg_addr();
```
Let's again examine each line of code:

- `slice cs = in_msg_full.begin_parse();` - Parses the incoming message.
- `int flags = cs~load_uint(4);` - Loads flags from the first 4 bits of the message.
- `if (flags & 1) { return (); } ;; ignore all bounced messages` - Ignores all bounced messages. This step ensures that messages encountering errors during transaction receipt and being returned to the sender are disregarded. It’s essential to apply this check to all incoming messages unless there's a specific reason not to.
- `slice sender_address = cs~load_msg_addr();` - Loads the sender's address from the message. In this case, it is an NFT address.
- `throw_unless(500, equal_slices(sender_address, nft_address));` - Verifies that the sender is indeed the expected NFT that should have been transferred via the contract. Parsing NFT data from smart contracts can be challenging, so in most cases, the NFT address is predefined at contract creation.
- `int op = in_msg_body~load_uint(32);` - Loads the message OP code.
- `throw_unless(501, op == op::ownership_assigned());` - Ensures that the received OP code matches the ownership assigned constant value.
- `slice prev_owner_address = in_msg_body~load_msg_addr();` - Extracts the previous owner’s address from the incoming message body and loads it into the `prev_owner_address` variable. This can be useful if the previous owner decides to cancel the contract and have the NFT returned to them.

Now that we have successfully parsed and validated the notification message, we can proceed with the business logic that initiates a sale smart contract. This contract manages NFT item sales, including auctions on platforms such as getgems.io.

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/asset-processing/payments-processing.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/asset-processing/payments-processing.md
================================================
import Feedback from '@site/src/components/Feedback';


import Button from '@site/src/components/button'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Payments processing

This page **explains how to process** (send and accept) digital assets on TON Blockchain. While it primarily focuses on handling TON coins, the **theoretical concepts** are also relevant for processing `jettons`.

:::tip
It's recommended to review the [Asset processing overview](/v3/documentation/dapps/assets/overview) before reading this tutorial.
:::

## Wallet smart contract

Wallet smart contracts on the TON Network allow external actors to interact with blockchain entities. They serve the following purposes: 
* Authenticating the owner: Rejects requests that attempt to process transactions or pay fees on behalf of unauthorized users.
* Providing replay protection: Prevents the repeated execution of the same request, such as sending assets to another smart contract multiple times.
* Initiating arbitrary interactions with other smart contracts.

The standard solution for authentication relies on public-key cryptography. The `wallet` stores the public key and verifies that any incoming request is signed by the corresponding private key, which is known only to the owner.

The solution for replay protection varies. Generally, a request contains a fully formed inner message that the `wallet` sends to the network. However, different approaches exist for preventing replay attacks.

### Seqno-based wallets
Seqno-based wallets use a simple `seqno` method to process messages. Each message includes a special seqno integer that must match the counter stored in the wallet smart contract. The `wallet` updates this counter with each request, ensuring that no request is processed twice. There are multiple versions of seqno-based wallets, which may differ in publicly available methods. These variations include: the ability to limit requests by expiration time and the ability to operate multiple wallets with the same public key. However, this approach has a limitation: requests must be sent sequentially. Any gap in the `seqno` sequence will prevent the processing of all subsequent requests.

### High-load wallets
High-load wallets take a different approach by storing the identifiers of non-expired processed requests in the smart contract’s storage. Each new request is checked against previously processed ones, and any detected duplicates are dropped. Since expired requests are removed over time, the contract does not store all requests indefinitely. This method allows multiple requests to be processed in parallel without interference. However, it requires more sophisticated monitoring to track request processing.


### Wallet deployment
To deploy a wallet via TonLib, follow these steps:
1. Generate a private/public key pair using [createNewKey](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L244) or its wrapper functions (example in [tonlib-go](https://github.com/mercuryoio/tonlib-go/tree/master/v2#create-new-private-key)). The private key is generated locally and never leaves the host machine.
2. Form [InitialAccountWallet](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L62) structure corresponding to one of the available wallet versions. Currently, the supported `wallets` are: `wallet.v3`, `wallet.v4`, `wallet.highload.v1`, `wallet.highload.v2` are available.
3. Calculate the address of the new `wallet` smart contract using the [getAccountAddress](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L283) method. It is recommended to use revision 0 by default. Deploy wallets in the basechain `workchain=0`     to minimize processing and storage fees.
4. Send some Toncoin to the calculated address. The transfer should be made in `non-bounce` mode since the wallet address has no code yet and cannot process incoming messages. The `non-bounce` flag ensures that if processing fails, the funds are not returned via a bounce message. Warning: Avoid using the non-bounce flag for other transactions, especially when transferring large sums, as the bounce mechanism provides protection against mistakes.
5. Form the desired [action](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L154), such as `actionNoop` for deploy only. Then use [createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L292) and [sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L300) to initiate interactions with the blockchain.
6. Check the contract’s status after a few seconds using the [getAccountState](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L288) method.

:::tip
Read more on the [Wallet tutorial](/v3/guidelines/smart-contracts/howto/wallet#-deploying-a-wallet).
:::

### Checking wallet address validity

Most SDKs automatically verify a wallet address during creation or transaction preparation, so additional manual validation is usually unnecessary.

<Tabs groupId="address-examples">

  <TabItem value="Tonweb" label="JS (Tonweb)">

  ```js
    const TonWeb = require("tonweb")
    TonWeb.utils.Address.isValid('...')
  ```

  </TabItem>
  <TabItem value="GO" label="tonutils-go">

  ```python
  package main

  import (
    "fmt"
    "github.com/xssnick/tonutils-go/address"
  )

  if _, err := address.ParseAddr("EQCD39VS5j...HUn4bpAOg8xqB2N"); err != nil {
    return errors.New("invalid address")
  }
  ```


  </TabItem>
  <TabItem value="Java" label="Ton4j">

  ```javascript
  try {
    Address.of("...");
    } catch (e) {
    // not valid address
  }
  ```

  </TabItem>
  <TabItem value="Kotlin" label="ton-kotlin">

```javascript
  try {
    AddrStd("...")
  } catch(e: IllegalArgumentException) {
      // not valid address
  }
```

  </TabItem>
</Tabs>

:::tip
Full Address description on the [Smart contract addresses](/v3/documentation/smart-contracts/addresses) page.
:::


## Working with transfers

### Check contract's transactions
To retrieve a smart contract's transactions, use the [getTransactions](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get). method. This method fetches up to 10 transactions starting from a specified `last_transaction_id` and earlier. To process all incoming transactions, follow these steps:
1. Obtain the latest `last_transaction_id` using [getAddressInformation](https://toncenter.com/api/v2/#/accounts/get_address_information_getAddressInformation_get).
2. Load 10 transactions using the `getTransactions` method.
3. Process transactions where the source field in the incoming message is not empty and the destination field matches the account address.
4. Retrieve the next 10 transactions and repeat steps 2 and 3 until all incoming transactions are processed.

### Retrieve incoming/outgoing transactions
It is possible to track message flows during transaction processing. Since the message flow forms a DAG (Directed Acyclic Graph), follow these steps:
1. Use the [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) to obtain the current transaction.
2. Identify incoming transactions by checking out_msg with [tryLocateResultTx](https://testnet.toncenter.com/api/v2/#/transactions/get_try_locate_result_tx_tryLocateResultTx_get).
3. Identify outgoing transactions by checking in_msg with [tryLocateSourceTx](https://testnet.toncenter.com/api/v2/#/transactions/get_try_locate_source_tx_tryLocateSourceTx_get).

<Tabs groupId="example-outgoing-transaction">
<TabItem value="JS" label="JS">

```ts
import { TonClient, Transaction } from '@ton/ton';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { CommonMessageInfoInternal } from '@ton/core';

async function findIncomingTransaction(client: TonClient, transaction: Transaction): Promise<Transaction | null> {
  const inMessage = transaction.inMessage?.info;
  if (inMessage?.type !== 'internal') return null;
  return client.tryLocateSourceTx(inMessage.src, inMessage.dest, inMessage.createdLt.toString());
}

async function findOutgoingTransactions(client: TonClient, transaction: Transaction): Promise<Transaction[]> {
  const outMessagesInfos = transaction.outMessages.values()
    .map(message => message.info)
    .filter((info): info is CommonMessageInfoInternal => info.type === 'internal');
  
  return Promise.all(
    outMessagesInfos.map((info) => client.tryLocateResultTx(info.src, info.dest, info.createdLt.toString())),
  );
}

async function traverseIncomingTransactions(client: TonClient, transaction: Transaction): Promise<void> {
  const inTx = await findIncomingTransaction(client, transaction);
  // now you can traverse this transaction graph backwards
  if (!inTx) return;
  await traverseIncomingTransactions(client, inTx);
}

async function traverseOutgoingTransactions(client: TonClient, transaction: Transaction): Promise<void> {
  const outTxs = await findOutgoingTransactions(client, transaction);
  // do smth with out txs
  for (const out of outTxs) {
    await traverseOutgoingTransactions(client, out);
  }
}

async function main() {
  const endpoint = await getHttpEndpoint({ network: 'testnet' });
  const client = new TonClient({
    endpoint,
    apiKey: '[API-KEY]',
  });
  
  const transaction: Transaction = ...; // Obtain first transaction to start traversing
  await traverseIncomingTransactions(client, transaction);
  await traverseOutgoingTransactions(client, transaction);
}

main();
```

</TabItem>
</Tabs>

### Send payments

:::tip
Learn the basics of payment processing from the [TMA USDT Payments demo](https://github.com/ton-community/tma-usdt-payments-demo).
:::

1. The service must deploy a `wallet` and keep it funded to prevent contract destruction due to storage fees. Storage fees are typically less than 1 Toncoin per year.
2. The service should collect the `destination_address` and an optional `comment` from the user. To avoid duplicate outgoing payments with the same (`destination_address`, `value`, `comment`), either prohibit unfinished payments with identical parameters or schedule payments so that a new payment starts only after the previous one is confirmed.
3. Create [msg.dataText](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L103) with `comment` as text.
4. Create [msg.message](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L113) which includes `destination_address`, empty `public_key`, `amount`, and `msg.dataText`.
5. Create the [Action](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L154) that should contain a set of outgoing messages.
6. Use [createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L292) and [sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L300) to submit the payment to the blockchain.
7. The service should regularly poll the [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) method of the `wallet` contract. By matching confirmed transactions with outgoing payments (`destination_address`, `value`, `comment`) the service can mark payments as finished and retrieve and display the transaction hash and logical time (lt) to the user.
8. Requests sent to `v3` of `high-load` have a 60-second expiration time by default. After expiration, unprocessed requests can be safely resent following steps 3-6.

:::caution
If the attached `value` is too small, the transaction may fail with the error `cskip_no_gas`. n this case, Toncoins will be transferred, but no logic will be executed on the recipient's side (the TVM will not launch). Read more [here](/v3/documentation/network/configs/blockchain-configs#param-20-and-21). 
:::

### Get the transaction ID

It may be confusing that to get more information about a transaction, the user must scan the blockchain via the [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) function.
It is not possible to get the transaction ID immediately after sending the message, as the transaction must first be confirmed by the blockchain network.
To understand the required pipeline, carefully read [Send payments](/v3/guidelines/dapps/asset-processing/payments-processing/#send-payments), especially the 7th point.

## Invoice-based approach
To accept payments based on attached comments, the service should:
1. Deploy the `wallet` contract.
2. Generate a unique `invoice` for each user. A uuid32 string is sufficient for invoice identification.
3. Users should send payments to the service’s `wallet` contract with the `invoice` as a comment.
4. Service should regularly poll the [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) method for the `wallet` contract.
5. For each new transaction extract the incoming message, match the comment against stored invoice data, and deposit the Toncoin value into the user's account.

To calculate the **incoming message value** that a message brings to a contract, we need to analyze the transaction. This happens when a message enters the contract. The transaction can be retrieved using [getTransactions](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L268). For an incoming wallet transaction, the correct data consists of one incoming message and zero outgoing messages. Otherwise, either an outgoing message is sent to the wallet, in which case the owner spends the Toncoin, or the wallet is not deployed and the incoming transaction is returned.

In any case, in general, the amount a message brings to a contract can be calculated as the incoming message value minus the sum of the outgoing message values minus the fee: `value_{in_msg} - SUM(value_{out_msg}) - fee`. Technically, the transaction view contains three different fields with `fee` in the name: `fee`, `storage_fee` and `other_fee`, i.e. the total fee, the portion of the fee related to storage costs, and the portion of the fee related to processing the transaction. Only the first one should be used.



### Invoices with TON Connect

Best for dApps that require multiple transactions within a session or a persistent wallet connection.

**Advantages**
- ✅ Permanent communication channel with the wallet.
- ✅ Users only scan a QR code once.
- ✅ Can track transaction confirmation via the returned BOC.
- ✅ Ready-made SDKs and UI kits for various platforms.

**Disadvantages**
- ❌ If only one payment is needed, users must connect the wallet and confirm the transaction
- ❌ More complex integration than a ton:// link.


<Button href="/v3/guidelines/ton-connect/overview/"
colorType="primary" sizeType={'lg'}>

Learn more

</Button>


### Invoices with ton:// link

:::warning
The Ton link is deprecated. Avoid using it.
:::

If you need an easy integration for a simple user flow, it is suitable to use the ton:// link.
It is best suited for one-time payments and invoices.

```bash
ton://transfer/<destination-address>?
    [nft=<nft-address>&]
    [fee-amount=<nanocoins>&]
    [forward-amount=<nanocoins>] 
```

**Advantages**
- ✅ Easy integration.
- ✅ No need to connect a wallet.

**Disadvantages**
- ❌ Users must scan a new QR code for each payment.
- ❌ Cannot track if the user signed the transaction.
- ❌ No information about the user’s address.
- ❌ Requires workarounds for platforms where links are not clickable (e.g., Telegram Desktop bots).



[Learn more about TON links here](https://github.com/tonkeeper/wallet-api#payment-urls).

## Explorers

The official TON blockchain explorer: https://tonscan.org.

To generate a transaction link in the explorer, the service needs to get the lt (logical time), the transaction hash, and the account address (the address of the account for which the lt and txhash were obtained using the [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) method). Then https://tonscan.org and https://explorer.toncoin.org/ can display the page for this transaction in the following format:

`https://tonviewer.com/transaction/{txhash as base64url}`

`https://tonscan.org/tx/{lt as int}:{txhash as base64url}:{account address}`

`https://explorer.toncoin.org/transaction?account={account address}&lt={lt as int}&hash={txhash as base64url}`

Note: tonviewer and tonscan also support external-in message hashes instead of transaction hashes for explorer links. This is useful when generating an external message and needing an instant transaction link. Learn more about transactions and messages hashes [here](/v3/guidelines/dapps/cookbook#how-to-find-transaction-or-message-hash).
 
## Best practices

### Wallet creation

<Tabs groupId="example-create_wallet">
<TabItem value="JS" label="JS">

- **toncenter:**
  - [Wallet creation + get wallet address](https://github.com/toncenter/examples/blob/main/common.js)

- **ton-community/ton:**
  - [Wallet creation + get balance](https://github.com/ton-community/ton#usage)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**
  - [Wallet creation + get balance](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#wallet)

</TabItem>

<TabItem value="Python" label="Python">

- **psylopunk/pythonlib:**
  - [Wallet creation + get wallet address](https://github.com/psylopunk/pytonlib/blob/main/examples/generate_wallet.py)
  
- **yungwine/pytoniq:**
```py
import asyncio

from pytoniq.contract.wallets.wallet import WalletV4R2
from pytoniq.liteclient.balancer import LiteBalancer


async def main():
    provider = LiteBalancer.from_mainnet_config(2)
    await provider.start_up()

    mnemonics, wallet = await WalletV4R2.create(provider)
    print(f"{wallet.address=} and {mnemonics=}")

    await provider.close_all()


if __name__ == "__main__":
    asyncio.run(main())
```

</TabItem>

</Tabs>


### Wallet creation for different shards

When under heavy load, TON Blockchain may split into [shards](/v3/documentation/smart-contracts/shards/shards-intro)to distribute network activity. A shard is similar to a network segment in Web3.

Just as we distribute service infrastructure in the Web2 world to be as close to the end user as possible, in TON we can deploy contracts that will reside in the same shard as the user's wallet or any other contract that interacts with it.

For example, a DApp that collects fees from users for a future airdrop service could prepare separate wallets for each shard to improve the user experience during peak load days. To achieve maximum processing speed, you would need to deploy one collector wallet per shard.

The shard prefix `SHARD_INDEX` of a contract is determined by the first 4 bits of its address hash.
To deploy a wallet to a specific shard, you can use logic based on the following code snippet:

```javascript

import { NetworkProvider, sleep } from '@ton/blueprint';
import { Address, toNano } from "@ton/core";
import {mnemonicNew, mnemonicToPrivateKey} from '@ton/crypto';
import { WalletContractV3R2 } from '@ton/ton';

export async function run(provider?: NetworkProvider) {
  if(!process.env.SHARD_INDEX) {
    throw new Error("Shard index is not specified");
  }

    const shardIdx = Number(process.env.SHARD_INDEX);
    let testWallet: WalletContractV3R2;
    let mnemonic:  string[];
    do {
        mnemonic   = await mnemonicNew(24);
        const keyPair = await mnemonicToPrivateKey(mnemonic);
        testWallet = WalletContractV3R2.create({workchain: 0, publicKey: keyPair.publicKey});
    } while(testWallet.address.hash[0] >> 4 !== shardIdx);

    console.log("Mnemonic for shard found:", mnemonic);
    console.log("Wallet address:",testWallet.address.toRawString());
}

if(require.main === module) {
run();
}

```
In the case of a wallet contract, `subwalletId` can be used instead of a mnemonic, however `subwalletId` is not supported by [wallet applications](https://ton.org/wallets).

Once deployment is complete, you can begin processing using the following algorithm:

1. User visits the DApp and requests an action.
2. The DApp chooses the closest wallet (matching by 4-bit shard prefix).
3. The DApp generates a payload for sending fees to the selected wallet.

This way, you can provide the best user experience regardless of the current network load.


### Toncoin deposits (get Toncoins)

<Tabs groupId="example-toncoin_deposit">
<TabItem value="JS" label="JS">

- **toncenter:**
  - [Process Toncoins deposit](https://github.com/toncenter/examples/blob/main/deposits.js)
  - [Process Toncoins deposit multi wallets](https://github.com/toncenter/examples/blob/main/deposits-multi-wallets.js)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**

<details>
<summary>Checking deposits</summary>

```go
package main 

import (
	"context"
	"encoding/base64"
	"log"

	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/ton"
)

const (
	num = 10
)

func main() {
	client := liteclient.NewConnectionPool()
	err := client.AddConnectionsFromConfigUrl(context.Background(), "https://ton.org/global.config.json")
	if err != nil {
		panic(err)
	}

	api := ton.NewAPIClient(client, ton.ProofCheckPolicyFast).WithRetry()

	accountAddr := address.MustParseAddr("0QA__NJI1SLHyIaG7lQ6OFpAe9kp85fwPr66YwZwFc0p5wIu")

	// we need fresh block info to run get methods
	b, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	// we use WaitForBlock to make sure block is ready,
	// it is optional but escapes us from liteserver block not ready errors
	res, err := api.WaitForBlock(b.SeqNo).GetAccount(context.Background(), b, accountAddr)
	if err != nil {
		log.Fatal(err)
	}

	lastTransactionId := res.LastTxHash
	lastTransactionLT := res.LastTxLT

	headSeen := false

	for {
		trxs, err := api.ListTransactions(context.Background(), accountAddr, num, lastTransactionLT, lastTransactionId)
		if err != nil {
			log.Fatal(err)
		}

		for i, tx := range trxs {
			// should include only first time lastTransactionLT
			if !headSeen {
				headSeen = true
			} else if i == 0 {
				continue
			}

			if tx.IO.In == nil || tx.IO.In.Msg.SenderAddr().IsAddrNone() {
				// external message should be omitted
				continue
			}

      if tx.IO.Out != nil {
				// no outgoing messages - this is incoming Toncoins
				continue
			}

			// process trx
			log.Printf("found in transaction hash %s", base64.StdEncoding.EncodeToString(tx.Hash))
		}

		if len(trxs) == 0 || (headSeen && len(trxs) == 1) {
			break
		}

		lastTransactionId = trxs[0].Hash
		lastTransactionLT = trxs[0].LT
	}
}
```

</details>
</TabItem>

<TabItem value="Python" label="Python">

- **yungwine/pytoniq:**

<summary>Checking deposits</summary>

```python
import asyncio

from pytoniq_core import Transaction

from pytoniq import LiteClient, Address

MY_ADDRESS = Address("kf8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM_BP")


async def main():
    client = LiteClient.from_mainnet_config(ls_i=0, trust_level=2)

    await client.connect()

    last_block = await client.get_trusted_last_mc_block()

    _account, shard_account = await client.raw_get_account_state(MY_ADDRESS, last_block)
    assert shard_account

    last_trans_lt, last_trans_hash = (
        shard_account.last_trans_lt,
        shard_account.last_trans_hash,
    )

    while True:
        print(f"Waiting for{last_block=}")

        transactions = await client.get_transactions(
            MY_ADDRESS, 1024, last_trans_lt, last_trans_hash
        )
        toncoin_deposits = [tx for tx in transactions if filter_toncoin_deposit(tx)]
        print(f"Got {len(transactions)=} with {len(toncoin_deposits)=}")

        for deposit_tx in toncoin_deposits:
            # Process toncoin deposit transaction
            print(deposit_tx.cell.hash.hex())

        last_trans_lt = transactions[0].lt
        last_trans_hash = transactions[0].cell.hash


def filter_toncoin_deposit(tx: Transaction):
    if tx.out_msgs:
        return False

    if tx.in_msg:
        return False

    return True


if __name__ == "__main__":
    asyncio.run(main())
```

</TabItem>
</Tabs>

### Toncoin withdrawals (send Toncoins)

<Tabs groupId="example-toncoin_withdrawals">
<TabItem value="JS" label="JS">

- **toncenter:**
  - [Withdraw Toncoins from a wallet in batches](https://github.com/toncenter/examples/blob/main/withdrawals-highload-batch.js)
  - [Withdraw Toncoins from a wallet](https://github.com/toncenter/examples/blob/main/withdrawals-highload.js)

- **ton-community/ton:**
  - [Withdraw Toncoins from a wallet](https://github.com/ton-community/ton#usage)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**
  - [Withdraw Toncoins from a wallet](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#wallet)

</TabItem>

<TabItem value="Python" label="Python">

- **yungwine/pytoniq:**

```python
import asyncio

from pytoniq_core import Address
from pytoniq.contract.wallets.wallet import WalletV4R2
from pytoniq.liteclient.balancer import LiteBalancer


MY_MNEMONICS = "one two tree ..."
DESTINATION_WALLET = Address("Destination wallet address")


async def main():
    provider = LiteBalancer.from_mainnet_config()
    await provider.start_up()

    wallet = await WalletV4R2.from_mnemonic(provider, MY_MNEMONICS)

    await wallet.transfer(DESTINATION_WALLET, 5)
    
    await provider.close_all()


if __name__ == "__main__":
    asyncio.run(main())
```

</TabItem>

</Tabs>

### Get contract's transactions

<Tabs groupId="example-get_transactions">
<TabItem value="JS" label="JS">

- **ton-community/ton:**
  - [Client with getTransaction method](https://github.com/ton-community/ton/blob/master/src/client/TonClient.ts)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**
  - [Get transactions](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#account-info-and-transactions)

</TabItem>

<TabItem value="Python" label="Python">

- **yungwine/pytoniq:**
  - [Get transactions](https://github.com/yungwine/pytoniq/blob/master/examples/transactions.py)

</TabItem>

</Tabs>

## SDKs

A full list of SDKs for various programming languages (JS, Python, Golang, etc.) is available [here](/v3/guidelines/dapps/apis-sdks/sdk).

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/cookbook.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/cookbook.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import ThemedImage from '@theme/ThemedImage';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';


# TON cookbook

During product development, various questions often arise regarding interactions with different contracts on TON. This document aims to gather the best practices from developers and share them with the community.


## Working with contracts' addresses

### How to convert (user-friendly \<-\> raw), assemble, and extract addresses from strings?

TON addresses uniquely identify contracts on the blockchain, indicating their workchain and original state hash. [Two common formats](/v3/documentation/smart-contracts/addresses#raw-and-user-friendly-addresses) are: **raw** (workchain and HEX-encoded hash separated by the ":" character) and **user-friendly** (base64-encoded with certain flags).

```
User-friendly: EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
Raw: 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e
```

To obtain a TON address object from a string in your SDK, you can use the following code:

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
import { Address } from "@ton/core";


const address1 = Address.parse('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF');
const address2 = Address.parse('0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e');

// toStrings arguments: urlSafe, bounceable, testOnly
// defaults values: true, true, false

console.log(address1.toString()); // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
console.log(address1.toRawString()); // 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e

console.log(address2.toString()); // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
console.log(address2.toRawString()); // 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e
```

</TabItem>
<TabItem value="js-tonweb" label="JS (tonweb)">

```js
const TonWeb = require('tonweb');

const address1 = new TonWeb.utils.Address('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF');
const address2 = new TonWeb.utils.Address('0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e');

// toString arguments: isUserFriendly, isUrlSafe, isBounceable, isTestOnly

console.log(address1.toString(true, true, true)); // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
console.log(address1.toString(isUserFriendly = false)); // 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e

console.log(address1.toString(true, true, true)); // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
console.log(address2.toString(isUserFriendly = false)); // 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e
```

</TabItem>
<TabItem value="go" label="Go">

```go
package main

import (
	"fmt"

	"github.com/xssnick/tonutils-go/address"
)

func main() {
	address1 := address.MustParseAddr("EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF")
	address2 := address.MustParseRawAddr("0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e")

	fmt.Println(address1.String()) // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
	fmt.Println(rawAddr(address1)) // 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e

	fmt.Println(address2.String()) // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
	fmt.Println(rawAddr(address2)) // 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e
}

func rawAddr(addr *address.Address) string {
	return fmt.Sprintf("%v:%x", addr.Workchain(), addr.Data())
}
```

</TabItem>
<TabItem value="py" label="Python">

```py
from pytoniq_core import Address

address1 = Address('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF')
address2 = Address('0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e')

# to_str() arguments: is_user_friendly, is_url_safe, is_bounceable, is_test_only

print(address1.to_str(is_user_friendly=True, is_bounceable=True, is_url_safe=True))  # EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
print(address1.to_str(is_user_friendly=False))  # 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e

print(address2.to_str(is_user_friendly=True, is_bounceable=True, is_url_safe=True))  # EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
print(address2.to_str(is_user_friendly=False))  # 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e
```

</TabItem>
</Tabs>

### Flags in user-friendly addresses

There are two flags in user-friendly addresses: **bounceable**/**non-bounceable** and **testnet**/**any-net**. These flags are represented in the first character of the address, which corresponds to the first 6 bits of the address encoding. These flags can be detected by looking at the first character, according to [TEP-2](https://github.com/ton-blockchain/TEPs/blob/master/text/0002-address.md#smart-contract-addresses):

| Address beginning | Binary form | Bounceable | Testnet-only |
|:-----------------:|:-----------:|:----------:|:------------:|
|        E...       |  000100.01  |    yes     |   no         |
|        U...       |  010100.01  |     no     |   no         |
|        k...       |  100100.01  |    yes     |   yes        |
|        0...       |  110100.01  |     no     |   yes        |

:::tip
The testnet-only flag does not appear in the blockchain. The non-bounceable flag only affects message transfers: when used as a destination, it prevents the message from being bounced.
:::

Also, in some libraries, you may notice a serialization parameter called `urlSafe`. Тhe base64 format is not URL safe, which means that some characters (namely, `+` and `/`) can cause issues when transmitting an address in a link. When `urlSafe = true`, all `+` symbols are replaced with `-`, and all `/` symbols are replaced with `_`. You can obtain these address formats using the following code:

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
import { Address } from "@ton/core";

const address = Address.parse('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF');

// toStrings arguments: urlSafe, bounceable, testOnly
// defaults values: true, true, false

console.log(address.toString()); // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHFэ
console.log(address.toString({urlSafe: false})) // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff+W72r5gqPrHF
console.log(address.toString({bounceable: false})) // UQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPuwA
console.log(address.toString({testOnly: true})) // kQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPgpP
console.log(address.toString({bounceable: false, testOnly: true})) // 0QDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPleK
```

</TabItem>
<TabItem value="js-tonweb" label="JS (tonweb)">

```js
const TonWeb = require('tonweb');

const address = new TonWeb.utils.Address('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF');

// toString arguments: isUserFriendly, isUrlSafe, isBounceable, isTestOnly

console.log(address.toString(true, true, true, false)); // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
console.log(address.toString(true, false, true, false)); // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff+W72r5gqPrHF
console.log(address.toString(true, true, false, false)); // UQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPuwA
console.log(address.toString(true, true, true, true)); // kQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPgpP
console.log(address.toString(true, true, false, true)); // 0QDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPleK
```

</TabItem>
<TabItem value="go" label="Go">

```go
package main

import (
	"fmt"
	"github.com/xssnick/tonutils-go/address"
)

func main() {
	address := address.MustParseAddr("EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF")

	fmt.Println(address.String()) // EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
	address.SetBounce(false)
	fmt.Println(address.String()) // UQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPuwA
	address.SetBounce(true)
	address.SetTestnetOnly(true) // kQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPgpP
	fmt.Println(address.String())
	address.SetBounce(false) // 0QDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPleK
	fmt.Println(address.String())
}
```

</TabItem>
<TabItem value="py" label="Python">

```py
from pytoniq_core import Address

address = Address('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF')

# to_str() arguments: is_user_friendly, is_url_safe, is_bounceable, is_test_only

print(address.to_str(is_user_friendly=True, is_bounceable=True, is_url_safe=True, is_test_only=False))  # EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
print(address.to_str(is_user_friendly=True, is_bounceable=True, is_url_safe=False, is_test_only=False))  # EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff+W72r5gqPrHF
print(address.to_str(is_user_friendly=True, is_bounceable=False, is_url_safe=True, is_test_only=False))  # UQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPuwA
print(address.to_str(is_user_friendly=True, is_bounceable=True, is_url_safe=True, is_test_only=True))  # kQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPgpP
print(address.to_str(is_user_friendly=True, is_bounceable=False, is_url_safe=True, is_test_only=True))  # 0QDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPleK
```

</TabItem>
</Tabs>


### How to check the validity of a TON address?


<Tabs groupId="address-examples">

<TabItem value="Tonweb" label="JS (Tonweb)">

```js

const TonWeb = require("tonweb")

TonWeb.utils.Address.isValid('...')
```

</TabItem>
<TabItem value="GO" label="tonutils-go">

```python
package main

import (
    "fmt"
    "github.com/xssnick/tonutils-go/address"
)

if _, err := address.ParseAddr("EQCD39VS5j...HUn4bpAOg8xqB2N"); err != nil {
 return errors.New("invalid address")
}
```


</TabItem>
<TabItem value="Java" label="ton4j">

  ```javascript
    /* Maven
    <dependency>
      <groupId>io.github.neodix42</groupId>
      <artifactId>address</artifactId>
      <version>0.3.2</version>
    </dependency>
    */

    try {
    Address.of("...");
    } catch (Exception e) {
    // not valid address
    }
  ```

</TabItem>
<TabItem value="Kotlin" label="ton-kotlin">

```javascript
try {
    AddrStd("...")
} catch(e: IllegalArgumentException) {
   // not valid address
}
```

</TabItem>
</Tabs>


## Standard wallets in TON Ecosystem

### How to transfer TON and send a text message to another wallet

#### Sending messages

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_1.svg?raw=true',
    dark: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_1_dark.svg?raw=true',
  }}
/>
</div>
<br></br>

#### Deploying a contract

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_2.svg?raw=true',
    dark: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_2_dark.svg?raw=true',
  }}
/>
</div>
<br></br>

Most SDKs follow a similar process for sending messages from your wallet:
- Create a wallet wrapper (object) of the correct version, typically v3r2 (see also [wallet versions](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts)), your secret key and workchain (usually 0 for the [BaseChain](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#workchain-a-blockchain-with-your-own-rules)).
- Create a blockchain wrapper (or "client")—an object that routes requests to the API or lite servers, depending on your setup.
- **Open** the contract in the blockchain wrapper. This ensures that the contract object is linked to an actual account on either the TON Mainnet or Testnet.
- Form messages you want to send and initiate the transaction. You can send up to 4 messages per request, as detailed in the [advanced manual](/v3/guidelines/smart-contracts/howto/wallet#sending-multiple-messages-simultaneously).

<Tabs groupId="code-examples">
<TabItem value="js-ton-v4" label="JS (@ton) for Wallet V4">

```js
import { TonClient, WalletContractV4, internal } from "@ton/ton";
import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";

const client = new TonClient({
  endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  apiKey: 'your-api-key', // Optional, but note that without api-key you need to send requests once per second, and with 0.25 seconds
});

// Convert mnemonics to private key
let mnemonics = "word1 word2 ...".split(" ");
let keyPair = await mnemonicToPrivateKey(mnemonics);

// Create wallet contract
let workchain = 0; // Usually you need a workchain 0
let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
let contract = client.open(wallet);

// Create a transfer
let seqno: number = await contract.getSeqno();
await contract.sendTransfer({
  seqno,
  secretKey: keyPair.secretKey,
  messages: [internal({
    value: '1',
    to: 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N',
    body: 'Example transfer body',
  })]
});
```

</TabItem>

<TabItem value="js-ton-v5" label="JS (@ton) for Wallet V5">

```js
import { TonClient, WalletContractV5R1, internal, SendMode } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";

const client = new TonClient({
  endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  apiKey: 'your-api-key', // Optional, but note that without api-key you need to send requests once per second, and with 0.25 seconds
});

// Convert mnemonics to private key
let mnemonics = "word1 word2 ...".split(" ");
let keyPair = await mnemonicToPrivateKey(mnemonics);

// Create wallet contract
let wallet = WalletContractV5R1.create({
  publicKey: keyPair.publicKey,
  workChain: 0, // Usually you need a workchain 0
});
let contract = client.open(wallet);

// Create a transfer
let seqno: number = await contract.getSeqno();
await contract.sendTransfer({
  secretKey: keyPair.secretKey,
  seqno,
  sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
  messages: [
    internal({
      to: 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N',
      value: '0.05',
      body: 'Example transfer body',
    }),
  ],
});
```

</TabItem>

<TabItem value="ton-kotlin" label="ton-kotlin">

```kotlin
// Setup liteClient
val context: CoroutineContext = Dispatchers.Default
val json = Json { ignoreUnknownKeys = true }
val config = json.decodeFromString<LiteClientConfigGlobal>(
    URI("https://ton.org/global-config.json").toURL().readText()
)
val liteClient = LiteClient(context, config)

val WALLET_MNEMONIC = "word1 word2 ...".split(" ")

val pk = PrivateKeyEd25519(Mnemonic.toSeed(WALLET_MNEMONIC))
val walletAddress = WalletV3R2Contract.address(pk, 0)
println(walletAddress.toString(userFriendly = true, bounceable = false))

val wallet = WalletV3R2Contract(liteClient, walletAddress)
runBlocking {
    wallet.transfer(pk, WalletTransfer {
        destination = AddrStd("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N")
        bounceable = true
        coins = Coins(100000000) // 1 ton in nanotons
        messageData = org.ton.contract.wallet.MessageData.raw(
            body = buildCell {
                storeUInt(0, 32)
                storeBytes("Comment".toByteArray())
            }
        )
        sendMode = 0
    })
}
```
</TabItem>

<TabItem value="py" label="Python">

```py
from pytoniq import LiteBalancer, WalletV4R2
import asyncio

mnemonics = ["your", "mnemonics", "here"]

async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()

    wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)

    transfer = {
        "destination": "DESTINATION ADDRESS HERE",    # please remember about bounceable flags
        "amount":      int(10**9 * 0.05),             # amount sent, in nanoTON
        "body":        "Example transfer body",       # may contain a cell; see next examples
    }

    await wallet.transfer(**transfer)
    await provider.close_all()

asyncio.run(main())
```

</TabItem>

</Tabs>

### Writing comments: long strings in snake format

Sometimes, it's necessary to store large strings in cells, but the maximum size for a cell is 1023 bits. In these cases, you can use snake cells, which reference other cells recursively.

<Tabs groupId="code-examples">
<TabItem value="js-tonweb" label="JS (tonweb)">

```js
const TonWeb = require("tonweb");

function writeStringTail(str, cell) {
    const bytes = Math.floor(cell.bits.getFreeBits() / 8); // 1 symbol = 8 bits
    if(bytes < str.length) { // if we can't write all string
        cell.bits.writeString(str.substring(0, bytes)); // write part of string
        const newCell = writeStringTail(str.substring(bytes), new TonWeb.boc.Cell()); // create new cell
        cell.refs.push(newCell); // add new cell to current cell's refs
    } else {
        cell.bits.writeString(str); // write all string
    }

    return cell;
}

function readStringTail(slice) {
    const str = new TextDecoder('ascii').decode(slice.array); // decode uint8array to string
    if (cell.refs.length > 0) {
        return str + readStringTail(slice.refs[0]); // read next cell
    } else {
        return str;
    }
}

let cell = new TonWeb.boc.Cell();
const str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In euismod, ligula vel lobortis hendrerit, lectus sem efficitur enim, vel efficitur nibh dui a elit. Quisque augue nisi, vulputate vitae mauris sit amet, iaculis lobortis nisi. Aenean molestie ultrices massa eu fermentum. Cras rhoncus ipsum mauris, et egestas nibh interdum in. Maecenas ante ipsum, sodales eget suscipit at, placerat ut turpis. Nunc ac finibus dui. Donec sit amet leo id augue tempus aliquet. Vestibulum eu aliquam ex, sit amet suscipit odio. Vestibulum et arcu dui.";
cell = writeStringTail(str, cell);
const text = readStringTail(cell.beginParse());
console.log(text);
```

</TabItem>
</Tabs>

Many SDKs already offer functions to parse and store long strings in this format. Alternatively, you can use recursion to handle these strings or optimize with "tail calls."

Don't forget that the comment message in a snake cell has 32 zero bits (i.e., its opcode is 0).

## TEP-74 (jettons standard)

### How to calculate the user's jetton wallet address (offchain)?

To calculate a user's jetton wallet address, use the `get_wallet_address` method from the jetton master contract with the user's address. You can also call the master contract directly or use the `getWalletAddress` method provided in the JettonMaster SDK.

:::info
The `JettonMaster` in `@ton/ton` provides this functionality, although it lacks other features.
:::

<Tabs groupId="code-examples">
<TabItem value="user-jetton-wallet-method-js" label="@ton/ton">

```js
const { Address, beginCell } = require("@ton/core")
const { TonClient, JettonMaster } = require("@ton/ton")

const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
});

const jettonMasterAddress = Address.parse('...') // for example EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE
const userAddress = Address.parse('...')

const jettonMaster = client.open(JettonMaster.create(jettonMasterAddress))
console.log(await jettonMaster.getWalletAddress(userAddress))
```
</TabItem>

<TabItem value="user-jetton-wallet-get-method-js" label="Manually call get-method">

```js
const { Address, beginCell } = require("@ton/core")
const { TonClient } = require("@ton/ton")

async function getUserWalletAddress(userAddress, jettonMasterAddress) {
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });
    const userAddressCell = beginCell().storeAddress(userAddress).endCell()
    const response = await client.runMethod(jettonMasterAddress, "get_wallet_address", [
        {type: "slice", cell: userAddressCell}
    ])
    return response.stack.readAddress()
}
const jettonMasterAddress = Address.parse('...') // for example EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE
const userAddress = Address.parse('...')

getUserWalletAddress(userAddress, jettonMasterAddress)
    .then((jettonWalletAddress) => {console.log(jettonWalletAddress)})
```
</TabItem>

<TabItem value="ton-kotlin" label="ton-kotlin">

```kotlin
// Setup liteClient
val context: CoroutineContext = Dispatchers.Default
val json = Json { ignoreUnknownKeys = true }
val config = json.decodeFromString<LiteClientConfigGlobal>(
    URI("https://ton.org/global-config.json").toURL().readText()
)
val liteClient = LiteClient(context, config)

val USER_ADDR = AddrStd("Wallet address")
val JETTON_MASTER = AddrStd("Jetton Master contract address") // for example EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE

// we need to send regular wallet address as a slice
val userAddressSlice = CellBuilder.beginCell()
    .storeUInt(4, 3)
    .storeInt(USER_ADDR.workchainId, 8)
    .storeBits(USER_ADDR.address)
    .endCell()
    .beginParse()

val response = runBlocking {
    liteClient.runSmcMethod(
        LiteServerAccountId(JETTON_MASTER.workchainId, JETTON_MASTER.address),
        "get_wallet_address",
        VmStackValue.of(userAddressSlice)
    )
}

val stack = response.toMutableVmStack()
val jettonWalletAddress = stack.popSlice().loadTlb(MsgAddressInt) as AddrStd
println("Calculated Jetton wallet:")
println(jettonWalletAddress.toString(userFriendly = true))

```
</TabItem>

<TabItem value="py" label="Python">

```py
from pytoniq import LiteBalancer, begin_cell
import asyncio

async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()

    JETTON_MASTER_ADDRESS = "EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE"
    USER_ADDRESS = "EQAsl59qOy9C2XL5452lGbHU9bI3l4lhRaopeNZ82NRK8nlA"


    result_stack = await provider.run_get_method(address=JETTON_MASTER_ADDRESS, method="get_wallet_address",
                                                   stack=[begin_cell().store_address(USER_ADDRESS).end_cell().begin_parse()])
    jetton_wallet = result_stack[0].load_address()
    print(f"Jetton wallet address for {USER_ADDRESS}: {jetton_wallet.to_str(1, 1, 1)}")
    await provider.close_all()

asyncio.run(main())
```
</TabItem>

</Tabs>

### How to calculate a user's jetton wallet address (offline)?

Although it is a common approach, [calling the GET method](/v3/guidelines/smart-contracts/get-methods#calling-get-methods-from-code) every time to retrieve the wallet address can be slow and resource-intensive. 
However, if you know the jetton wallet code and storage structure, you can calculate the wallet address without making network requests.

<Tabs groupId="code-examples">
<TabItem value="ts-ton" label="TS (@ton/ton)">

```ts
import { Cell, contractAddress, toNano, TupleBuilder } from "@ton/core";
import { ContractProvider, Address, Contract, Sender, StateInit } from "@ton/core";
import { Blockchain, createShardAccount } from "@ton/sandbox";

// ------------------------------------------------------------------------------------------------------------------------------------------------
//const USDTMasterAddress = Address.parse('EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs')  // EQC7aZ-_G_tWeSn0GZ0HclwZvGIBp-CRrSsbMibTHN6l4kr7
//const NOTMasterAddress = Address.parse('EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT')   // EQA9idRBK7TY1AF0L2CpuxrwdjPr7qzKSQjbgakURWGQRdOW
//const HMSTRMasterAddress = Address.parse('EQAJ8uWd7EBqsmpSWaRdf_I-8R8-XHwh3gsNKhy-UrdrPcUo') // EQDXT5HaCnuwzBff8tjwAmGvs9N9MEbqOXDIY_KepS9yYyMo
//const DOGSMasterAddress = Address.parse('EQCvxJy4eG8hyHBFsZ7eePxrRsUQSFE_jpptRAYBmcG_DOGS')  // EQCRgs1d1M91dm2hHeF8luXBH-aIF9PT-T2jlocQXiYBvAGY
//const STONMasterAddress = Address.parse('EQA2kCVNwVsil2EM2mB0SkXytxCqQjS4mttjDpnXmwG9T6bO')  // EQCx5ruSqFmw5LYxJ6iksuCuRLsNpgTjWcCuW6jm8BhaLOTK
// ------------------------------------------------------------------------------------------------------------------------------------------------


export class MyContract implements Contract {
    readonly address: Address