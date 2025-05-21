Directory structure:
└──  ton-blockchain-teps/
    ├── README.md
    └── text/
        ├── 0001-tep-lifecycle.md
        ├── 0002-address.md
        ├── 0062-nft-standard.md
        ├── 0064-token-data-standard.md
        ├── 0066-nft-royalty-standard.md
        ├── 0074-jettons-standard.md
        ├── 0081-dns-standard.md
        ├── 0085-sbt-standard.md
        ├── 0089-jetton-wallet-discovery.md
        ├── 0115-ton-connect.md
        └── 0160-dispatch-queue.md


Files Content:

================================================
FILE: README.md
================================================
# TON Enhancement Proposals (TEPs)

> :warning: **WARNING:** this proposal system is experimental now, the process is a subject to change.

The main goal of TON Enhancement Proposals is to provide a convenient and formal way to propose changes to TON Blockchain
and standardize ways of interaction between different parts of ecosystem.

Proposal management is done using GitHub pull requests, the process is described formally in [TEP-1](./text/0001-tep-lifecycle.md).

## Creating TEP
1. Discuss your proposal with community first, for example in TON Dev chat ([en](https://t.me/tondev_eng)/[ru](https://t.me/tondev)).
2. Read [TEP-1](./text/0001-tep-lifecycle.md) to understand proposal management process.
3. Fork this repo and copy `./0000-template.md` to `./text/0000-my-new-standard.md` where "my-new-standard" is a short title of your TEP.
4. Fill all sections and answer questions stated in template. If you need to include images, upload them to `./assets/0000-my-new-standard/` folder.
5. Submit a pull request.

## Merged TEPs
## Active
| TEP                                          | Title                              | Type               | Created    |
|----------------------------------------------|------------------------------------|--------------------|------------|
| [1](./text/0001-tep-lifecycle.md)            | TEP Lifecycle                      | Meta               | 11.06.2022 |
| [2](./text/0002-address.md)                  | TON Addresses                      | Core               | 07.09.2019 |
| [62](./text/0062-nft-standard.md)            | NFT Standard                       | Contract Interface | 01.02.2022 |
| [64](./text/0064-token-data-standard.md)     | Token Data Standard                | Contract Interface | 03.02.2022 |
| [66](./text/0066-nft-royalty-standard.md)    | NFTRoyalty Standard Extension      | Contract Interface | 12.02.2022 |
| [74](./text/0074-jettons-standard.md)        | Fungible tokens (Jettons) standard | Contract Interface | 12.03.2022 |
| [81](./text/0081-dns-standard.md)            | TON DNS Standard                   | Contract Interface | 25.06.2022 |
| [85](./text/0085-sbt-standard.md)            | SBT Contract                       | Contract Interface | 09.08.2022 |
| [89](./text/0089-jetton-wallet-discovery.md) | Discoverable Jettons Wallets       | Contract Interface | 08.09.2022 |
| [115](./text/0115-ton-connect.md)            | TON Connect                        | Core               | 20.10.2022 |
| [160](./text/0160-dispatch-queue.md)         | Dispatch Queue                     | Core               | 13.06.2024 |


## WIP
Since standard truly become a _Standard_  not when it gets merged into this repository, but when multiple parties accept it and use to interact with each other, below we list proposals to which developers may refer in documentation and so on.
In particular "Status" below has the following sense: 
* "Proposed" - this standard hasn't implementation or implementation is used only by authors
* "Partially Deployed" - this standard is used by pair of actors (for instance one dApp and one wallet, or similar), but not by interconnected set of actors
* "Deployed" - this standard is used by multiple actors (and generally should be on the way of merging)

| TEP                                          | Title                              | Type               | Created    | Status     |
|----------------------------------------------|------------------------------------|--------------------|------------|------------|
| [91](https://github.com/ton-blockchain/TEPs/pull/91/files)            | Contract Source Registry             | Infrastructure     | 09.09.2022 | ✅Deployed✅ |
| [92](https://github.com/ton-blockchain/TEPs/pull/92/files)            | Wallet Registry                      | Infrastructure     | 11.09.2022 | Proposed    |
| [96](https://github.com/ton-blockchain/TEPs/pull/96/files)            | Dicts/Arrays in Metadata             | Contract Interface | 21.09.2022 | Proposed    |
| [104](https://github.com/ton-blockchain/TEPs/pull/104/files)          | Data Signatures                      | Contract Interface | 13.12.2022 | Proposed    |
| [121](https://github.com/ton-blockchain/TEPs/pull/121/files)          | Lockable Jetton Wallet               | Contract Interface | 13.04.2023 | Proposed    |
| [122](https://github.com/ton-blockchain/TEPs/pull/122/files)          | Onchain reveal mechanic              | Contract Interface | 31.10.2022 | ✅Deployed✅ |
| [123](https://github.com/ton-blockchain/TEPs/pull/123/files)          | Address Guideline update             | Guidelines         | 13.06.2023 | 🛠️Partially Deployed🛠️ |
| [126](https://github.com/ton-blockchain/TEPs/pull/126/files)          | Compressed NFT Standard              | Contract Interface | 28.07.2023 | 🛠️Partially Deployed🛠️ |
| [127](https://github.com/ton-blockchain/TEPs/pull/127/files)          | TON Storage in Metadata              | Contract Interface | 23.09.2023 | Proposed |
| [130](https://github.com/ton-blockchain/TEPs/pull/130/files)          | Rebase Jettons standart              | Contract Interface | 04.12.2023 | Proposed |
| [131](https://github.com/ton-blockchain/TEPs/pull/131/files)          | Referral code in Query ID            | Contract Interface | 26.12.2023 | 🛠️Partially Deployed🛠️ |
| [137](https://github.com/ton-blockchain/TEPs/pull/137/files)          | Jetton Wallet Balance Query          | Contract Interface | 09.01.2024 | Proposed |
| [140](https://github.com/ton-blockchain/TEPs/pull/140/files)          | Programmable Action Phase            | Core               | 20.01.2024 | Proposed |
| [141](https://github.com/ton-blockchain/TEPs/pull/141)                | Remote onchain execution             | Core               | 20.01.2024 | Proposed |
| [142](https://github.com/ton-blockchain/TEPs/pull/142/files)          | TBRC-20 Inscription Token Standard   | Contract Interface | 26.01.2024 | Proposed |
| [145](https://github.com/ton-blockchain/TEPs/pull/145/files)          | Metadata "Hidden" render type        | Contract Interface | 26.01.2024 | ✅Deployed✅ |
| [146](https://github.com/ton-blockchain/TEPs/pull/146/files)          | Semi-fungible token standard         | Contract Interface | 17.03.2024 | Proposed |
| [161](https://github.com/ton-blockchain/TEPs/pull/161/files)          | Proxy TON (wTON)                     | Contract Interface | 13.06.2024 | 🛠️Partially Deployed🛠️ |

================================================
FILE: text/0001-tep-lifecycle.md
================================================
- **TEP**: [1](https://github.com/ton-blockchain/TEPs/pull/1)
- **title**: TEP Lifecycle
- **status**: Active
- **type**: Meta
- **authors**: [Vladimir Lebedev](https://github.com/hacker-volodya)
- **created**: 11.06.2022
- **replaces**: -
- **replaced by**: -

# Summary

This document introduces TEP -- TON Enhancement Proposal. TEP is a design document which describes some part of TON, for example ADNL (network protocol between nodes) or NFT (interface which is common to smart contracts of a single type).

# Motivation

Current TIP system is too informal to manage the process of writing, discussing and accepting new standards efficiently. TON needs a new proposal process, which will encourage authors to do a deep dive into the topic and write down all points to have a constructive discussion with the community.

# Guide

## For authors
If you have an idea for proposal, discuss it with community, for example in TON Dev chat ([en](https://t.me/tondev_eng)/[ru](https://t.me/tondev)). Discussion may help you to quickly identify potential gaps and not to spend a lot of time on writing actual proposal if you realized that your idea is not so clear as you thought before. Also you may look through the [TEP template](/0000-template.md) and think about each section first before writing.

When you feel yourself ready to write, just fork this repo and copy the template to `./text/0000-my-new-standard.md`, where "my-new-standard" is a short title of your TEP. Fill all sections and answer questions stated in template. If you need to include images or another additional files, upload them to `./assets/0000-my-new-standard/` folder.

Try to answer questions in the template as fully as possible. When the proposal is ready, open a [pull request](https://github.com/ton-blockchain/TEPs/pulls) and be ready to discuss your proposal with the community. During the review process, make changes to your pull request if it is necessary 

## For reviewers
After a pull request was created, any developer with corresponding experience (either from TON Foundation or community) may request repo maintainers to be assigned as a reviewer for the pull request. Anyone may comment the pull request, but reviewers has to vote, whether to merge or to reject the pull request. Once the majority votes for or against, TEP will enter its final comment period.

FCP lasts 10 calendar days, in this period the TEP is advertised widely. This way all stakeholders has a chance to say their final comments
on the TEP. Sometimes the FCP has to be cancelled because new arguments/ideas were raised. In this case the discussion restarts and then reviewers has to vote again.

# Specification

This section describes your feature formally. It contains requirements, which must be followed in order to implement your TEP. To keep things formal, it is convenient to follow [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt). You should include following text at the beginning of this section:

> The key words “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY”, and “OPTIONAL” in this document are to be interpreted as described in RFC 2119.

## TEP Roles

1. Author
2. Editor
3. Reviewer

## TEP Creation

The author SHOULD copy [TEP template](/0000-template.md) to `./text/0000-my-new-standard.md` and fill all sections. The author MAY include additional files, such as images and MUST place them in `./assets/0000-my-new-standard/`. All sections described below are mandatory.

### Header
Contains some TEP properties: TEP id and pull request link, title, status, type, authors, links to replaced TEPs and links to TEPs which replaces this TEP.

### Body
1. Summary
2. Motivation
3. Guide
4. Specification
5. Drawbacks
6. Rationale and alternatives
7. Prior art
8. Unresolved questions
9. Future possibilities

## TEP Lifecycle

### Draft
Author prepares TEP and opens a pull request to this repo. If necessary, Author MAY NOT start the review process, for example, if there is some unresolved questions, which must be solved before starting the review process. However, Editor MAY close the pull request in Draft state if there is no activity for the long time.

### Review
When the TEP is ready, Author has to start the review process by changing TEP state to *Review*. Editor checks the pull request and then reviewers has to be assigned by editor (author or anyone else MAY propose reviewers to be assigned to the pull request). Reviewers share their opinions in pull request, and if there was a discussion somewhere not in pull request, they MUST summarize it in pull request comments. Reviewers has to vote for or against the proposal. Once the majority agrees, Final Comment Period starts for 10 calendar days. Anyone MAY share their thoughts about this TEP, and Editor may cancel the FCP if there is a reason for it. In this case, the review process restarts, and reviewers MUST vote one more time in order to finish pull request. When FCP is over, Editor changes the state of TEP from Review to either Active or Rejected. 

### Active
When the TEP was accepted by reviewers, it becomes Active. It is possible to make minor changes to active TEPs in order to keep TEPs up to date with the actual implementation details.

### Rejected
When the TEP is rejected, corresponding pull request MUST NOT be merged, instead it MAY be closed. However, it is ok to keep rejected pull requests open, so the Author CAN make changes to the TEP and apply for review again without losing previous discussion.

### Replaced
At some point TEP may be deprecated. When this occurs, its state changes to Replaced. It is also necessary to provide some info about replacement in TEP header: "replaces" field points from new TEP to the old one, and "replaced by" points from the old TEP to the new.

# Drawbacks

## Who has to manage the process to get pull requests closed?
There is a risk that reviewers will not review pull requests in time, because there is no explicit manager or product owner, and motivation of reviewers is not clear.

# Rationale and alternatives

**Section list** was completely taken from Rust RFC. It motivates an author to do a deep dive into the TEP argumentation before starting the discussion with the community.

**RFC 822 header** from PEP/BIP/EIP/NEP was replaced by Rust RFC header, because it helps to improve user experience with links to TEP pull request and to the author of TEP.

In NEP, proposals are finalized before the actual pull request merging and proposal review. It unnecessarily sophisticates the process of review, because it is not easy for author to make small fixes to already merged pull request. So, to simplify all the things, in TEP entire review process is kept in pull request, so it is easy to do a review "ping-pong", when the author makes quick fixes during the review to achieve consensus with the community.

# Prior art

- Ethereum Improvement Proposals: [EIP-1](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1.md)
- Near Enhancement Proposals: [NEP-1](https://github.com/near/NEPs/blob/master/neps/nep-0001.md)
- [Rust RFCs](https://github.com/rust-lang/rfcs)

# Unresolved questions

1. Who has to assign reviewers? Who exactly can be a reviewer? How they will prove their experience and who will check it?

# Future possibilities

None



================================================
FILE: text/0002-address.md
================================================
- **TEP**: [2](https://github.com/ton-blockchain/TEPs/pull/2)
- **title**: TON Addresses
- **status**: Active
- **type**: Core
- **authors**: -
- **created**: 07.09.2019
- **replaces**: -
- **replaced by**: -

# Summary

This document describes TON addresses and their representation.

# Specification

## Smart-contract addresses

Smart-contract addresses in the TON Network consist of two parts:

(a) the workchain ID (a signed 32-bit integer) and

(b) the address inside the workchain (64-512 bits depending on the workchain).

Currently, only the masterchain (workchain_id=-1) and the basic workchain (workchain_id=0) are running in the TON Blockchain Network. Both of them have 256-bit addresses, so until a new different workchains appears we assume that workchain_id is either 0 or -1 and that the address inside the workchain is exactly 256-bit.

Under the conditions stated above, the smart-contract address can be represented in the following forms:

A) "Raw": <decimal workchain_id>:<64 hexadecimal digits with address>

B) "User-friendly", which is obtained by first generating:
- one tag byte (0x11 for "bounceable" addresses, 0x51 for "non-bounceable"; add +0x80 if the address should not be accepted by software running in the mainnet network)
- one byte containing a signed 8-bit integer with the workchain_id (0x00 for the basic workchain, 0xff for the masterchain)
- 32 bytes containing 256 bits of the smart-contract address inside the workchain (big-endian)
- 2 bytes containing CRC16-CCITT of the previous 34 bytes

In case B), the 36 bytes thus obtained are then encoded using base64 (i.e., with digits, upper- and lowercase Latin letters, '/' and '+') or base64url (with '_' and '-' instead of '/' and '+'), yielding 48 printable non-space characters.

Example:

The "root dns" (a special smart contract residing in the masterchain) has the address

`-1:e56754f83426f69b09267bd876ac97c44821345b7e266bd956a7bfbfb98df35c`

in the "raw" form (notice that uppercase Latin letters 'A'..'F' may be used instead of 'a'..'f')

and

`Ef_lZ1T4NCb2mwkme9h2rJfESCE0W34ma9lWp7-_uY3zXDvq` (bounceable)

`Uf_lZ1T4NCb2mwkme9h2rJfESCE0W34ma9lWp7-_uY3zXGYv` (non-bounceable)

in the "user-friendly" form (to be displayed by user-friendly clients). 

Notice that both forms (base64 and base64url) are valid and must be accepted.

## Wallets applications

At the moment, TON wallets work with addresses as follows:

For receiving:

- Wallets display the user's address in a user-friendly bounceable or non-bounceable form (at the moment, the majority of wallet apps display bounceable form).

When sending:

1) The wallet app checks the validity of the destination address representation - its length, valid characters, prefix and checksum. If the address is not valid, then an alert is shown and the sending operation is not performed.

2) If the address has a testnet flag, and the wallet app works with the mainnet network, then an alert is shown and the sending operation is not performed.

3) The wallet app retrieve from address bounceable flag.

4) The wallet app check the destination address - if it has `unitialized` state wallet force set `bounce` field of sending message to `false` and ignore bounceable/non-bounceable flag from address representation.

5) If destination is not `unitialized` then wallet app uses the bounceable/non-bounceable flag from the address representation for the `bounce` field of sending message.

## Public keys

The ubiquitous 256-bit Ed25519 public keys can be represented in the following forms:

A) "Raw": <64 hexadecimal digits with address>

B) "User-friendly" or "armored", which is obtained by first generating:

- one tag byte 0x3E, meaning that this is a public key
- one tag byte 0xE6, meaning that this is a Ed25519 public key
- 32 bytes containing the standard binary representation of the Ed25519 public key
- 2 bytes containing the big-endian representation of CRC16-CCITT of the previous 34 bytes.

The resulting 36-byte sequence is converted into a 48-character base64 or base64url string in the standard fashion. 

For example, the Ed25519 public key `E39ECDA0A7B0C60A7107EC43967829DBE8BC356A49B9DFC6186B3EAC74B5477D` (usually represented by a sequence of 32 bytes `0xE3, 0x9E, ..., 0x7D`) has the following "armored" representation:

`Pubjns2gp7DGCnEH7EOWeCnb6Lw1akm538YYaz6sdLVHfRB2`

## ADNL address

The ADNL protocol based on 256-bit abstract addresses.

The ADNL address can be represented in the following forms:

A) "Raw": <64 hexadecimal digits with address>

B) "User-friendly" or "armored", which is obtained by first generating:

- one tag byte 0x2d, meaning that this is a ADNL address
- 32 bytes containing 256 bits of the ADNL address (big-endian)
- 2 bytes containing the big-endian representation of CRC16-CCITT of the previous 34 bytes.

The resulting 35-byte sequence is converted into a 55-character base32 string in the standard fashion.

Example:

For example ADNL address `45061C1D4EC44A937D0318589E13C73D151D1CEF5D3C0E53AFBCF56A6C2FE2BD` has the following "armored" representation:

`vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3`

# Drawbacks

- It is impossible to extract the public key from the address, which is needed for some tasks (for example, to send an encrypted message to this address). 
   Thus, until the smart contract is deployed for this address, there is no way to get the public key on-chain.

- (UI) Most OS do not allow you to select an address with double click because of '_', '-', '/', '+' base64 symbols. 

# Rationale and alternatives

- The prefix (the first byte(s)) allows you to understand exactly what type this address or key is.

- The checksum built into the address prevents the loss of funds due to a user typo.

- Built-in testnet flag prevents loss of funds by a user who mistakenly tries to send real coins to a testnet address.

- A different form of address than most other blockchains allows the user to more easily identify the TON address.


================================================
FILE: text/0062-nft-standard.md
================================================
- **TEP**: [62](https://github.com/ton-blockchain/TEPs/pull/2)
- **title**: NFT Standard
- **status**: Active
- **type**: Contract Interface
- **authors**: [EmelyanenkoK](https://github.com/EmelyanenkoK), [Tolya](https://github.com/tolya-yanot)
- **created**: 01.02.2022
- **replaces**: -
- **replaced by**: -

# Summary
A standard interface for non-fungible tokens.

# Motivation
A standard interface will greatly simplify interaction and display of different entities representing right of ownership.

NFT standard describes:

* The way of ownership changing.
* The way of association of items into collections.
* The way of deduplication of common part of collection.

# Guide
Non-Fungible Token (NFT) represents an ownership over unique digital asset (kitten images, title deeds, artworks, etc). Each separate token is an _NFT Item_. It is also convenient to gather NFT Items into an _NFT Collection_. In TON, each NFT Item and NFT Collection are separate smart contracts.

## NFT Metadata
_Main article_: TEP-64

Each NFT Item and NFT Collection itself has its own metadata (TEP-64). It contains some info about NFT, such as title and associated image. Metadata can be stored offchain (smart contract will contain only a link to json) or onchain (all data will be stored in smart contract).

Collection metadata example (offchain):
```json
{
   "image": "https://ton.org/_next/static/media/smart-challenge1.7210ca54.png",
   "name": "TON Smart Challenge #2",
   "description": "TON Smart Challenge #2 Winners Trophy",
   "social_links": []
}
```

Item metadata example (offchain):
```json
{
   "name": "TON Smart Challenge #2 Winners Trophy",
   "description": "TON Smart Challenge #2 Winners Trophy 1 place out of 181",
   "image": "https://ton.org/_next/static/media/duck.d936efd9.png",
   "content_url": "https://ton.org/_next/static/media/dimond_1_VP9.29bcaf8e.webm",
   "attributes": []
}
```

Offchain metadata is published for example on web. 

## Useful links
1. [Reference NFT implementation](https://github.com/ton-blockchain/token-contract/tree/main/nft)
2. [Getgems NFT contracts](https://github.com/getgems-io/nft-contracts)
3. [Toncli NFT scaffolding project](https://github.com/disintar/toncli/tree/master/src/toncli/projects/nft_collection) by Disintar
4. [TON NFT Deployer](https://github.com/tondiamonds/ton-nft-deployer)
5. FunC Lesson - NFT Standard ([en](https://github.com/romanovichim/TonFunClessons_Eng/blob/889424ae6a28453c4188ad65cdd9dbfeb750ecdb/10lesson/tenthlesson.md)/[ru](https://github.com/romanovichim/TonFunClessons_ru/blob/427037e7937f0e2e9caa4b866ee29f9d8e19b3c0/10lesson/tenthlesson.md))
6. [TON NFT Explorer](https://explorer.tonnft.tools/)

# Specification
The NFT collection and each NFT item are separate smart contracts.

Example: if you release a collection that contains 10 000 items, then you will deploy 10 001 smart contracts.

## NFT item smart contract
Must implement:

### Internal message handlers
### 1. `transfer`
**Request**

TL-B schema of inbound message:

`transfer#5fcc3d14 query_id:uint64 new_owner:MsgAddress response_destination:MsgAddress custom_payload:(Maybe ^Cell) forward_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell) = InternalMsgBody;`

`query_id` - arbitrary request number.

`new_owner` - address of the new owner of the NFT item.

`response_destination` - address where to send a response with confirmation of a successful transfer and the rest of the incoming message coins.

`custom_payload` - optional custom data.

`forward_amount` - the amount of nanotons to be sent to the new owner.

`forward_payload` - optional custom data that should be sent to the new owner.

**Should be rejected if:**

1. message is not from current owner.
2. there is no enough coins (with respect to NFT own storage fee guidelines) to process operation and send `forward_amount`.
3. After processing the request, the contract **must** send at least `in_msg_value - forward_amount - max_tx_gas_price` to the `response_destination` address.
   If the contract cannot guarantee this, it must immediately stop executing the request and throw error.
   `max_tx_gas_price` is the price in Toncoins of maximum transaction gas limit of NFT habitat workchain. For the basechain it can be obtained from [`ConfigParam 21`](https://github.com/ton-blockchain/ton/blob/78e72d3ef8f31706f30debaf97b0d9a2dfa35475/crypto/block/block.tlb#L660) from `gas_limit` field.

**Otherwise should do:**

1. change current owner of NFT to `new_owner` address.
2. if `forward_amount > 0` send message to `new_owner` address with `forward_amount` nanotons attached and with the following layout:
   TL-B schema: `ownership_assigned#05138d91 query_id:uint64 prev_owner:MsgAddress forward_payload:(Either Cell ^Cell) = InternalMsgBody;`
   `query_id` should be equal with request's `query_id`.
   `forward_payload` should be equal with request's `forward_payload`.
   `prev_owner` is address of the previous owner of this NFT item.
   If `forward_amount` is equal to zero, notification message should not be sent.
3. Send all excesses of incoming message coins to `response_destination` with the following layout:
   TL-B schema: `excesses#d53276db query_id:uint64 = InternalMsgBody;`
   `query_id` should be equal with request's `query_id`.

### `forward_payload` format

If you want to send a simple comment in the `forward_payload` then the `forward_payload` must starts with `0x00000000` (32-bits unsigned integer equals to zero) and the comment is contained in the remainder of the `forward_payload`.

If comment does not begin with the byte `0xff`, the comment is a text one; it can be displayed "as is" to the end user of a wallet (after filtering invalid and control characters and checking that it is a valid UTF-8 string).
For instance, users may indicate the purpose ("for coffee") of a simple transfer from their wallet to the wallet of another user in this text field.

On the other hand, if the comment begins with the byte `0xff`, the remainder is a "binary comment", which should not be displayed to the end user as text (only as hex dump if necessary).
The intended use of "binary comments" is, e.g., to contain a purchase identifier for payments in a store, to be automatically generated and processed by the store's software.

If the `forward_payload` contains a binary message for interacting with the destination smart contract (for example, with DEX), then there are no prefixes.

These rules are the same with the payload format when simply sending Toncoins from a regular wallet ([Smart Contract Guidelines: Internal Messages, 3](https://ton.org/docs/#/howto/smart-contract-guidelines?id=internal-messages)).

### 2 `get_static_data`
**Request**

TL-B schema of inbound message:

`get_static_data#2fcb26a2 query_id:uint64 = InternalMsgBody;`

`query_id` - arbitrary request number.

**should do:**

1. Send back message with the following layout and send-mode `64` (return msg amount except gas fees):
   TL-B schema: `report_static_data#8b771735 query_id:uint64 index:uint256 collection:MsgAddress = InternalMsgBody;`
   `query_id` should be equal with request's `query_id`.
   `index` - numerical index of this NFT in the collection, usually serial number of deployment.
   `collection` - address of the smart contract of the collection to which this NFT belongs.

### Get-methods
1. `get_nft_data()` returns `(int init?, int index, slice collection_address, slice owner_address, cell individual_content)`
   `init?` - if not zero, then this NFT is fully initialized and ready for interaction.
   `index` - numerical index of this NFT in the collection.  For collection-less NFT - arbitrary but constant value.
   `collection_address` - (MsgAddress) address of the smart contract of the collection to which this NFT belongs. For collection-less NFT this parameter should be addr_none;
   `owner_address` - (MsgAddress) address of the current owner of this NFT.
   `individual_content` - if NFT has collection - individual NFT content in any format;
   if NFT has no collection - NFT content in format that complies with standard [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md).

## NFT Collection smart contract
It is assumed that the smart contract of the collection deploys smart contracts of NFT items of this collection.

Must implement:

### Get-methods
1. `get_collection_data()` returns `(int next_item_index, cell collection_content, slice owner_address)`
   `next_item_index` - the count of currently deployed NFT items in collection. Generally, collection should issue NFT with sequential indexes (see Rationale(2) ). `-1` value of `next_item_index` is used to indicate non-sequential collections, such collections should provide their own way for index generation / item enumeration.
   `collection_content` - collection content in a format that complies with standard [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md).
   `owner_address` - collection owner address, zero address if no owner.
2. `get_nft_address_by_index(int index)` returns `slice address`
   Gets the serial number of the NFT item of this collection and returns the address (MsgAddress) of this NFT item smart contract.
3. `get_nft_content(int index, cell individual_content)` returns `cell full_content`
   Gets the serial number of the NFT item of this collection and the individual content of this NFT item and returns the full content of the NFT item in format that complies with standard [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md).
   As an example, if an NFT item stores a metadata URI in its content, then a collection smart contract can store a domain (e.g. "https://site.org/"), and an NFT item smart contract in its content will store only the individual part of the link (e.g "kind-cobra").
   In this example the `get_nft_content` method concatenates them and return "https://site.org/kind-cobra".

# Drawbacks
There is no way to get current owner of NFT onchain because TON is an asynchronous blockchain. When the message with info about NFT owner will be delivered, this info may become irrelevant, so we can't guarantee that current owner hasn't changed.

# Rationale and alternatives
1. "One NFT - one smart contract" simplifies fees calculation and allows to give gas-consumption guarantees.
2. NFT collection with sequential NFT index provide easy way of association and search of linked NFTs.
3. Division of NFT content into individual and common (collection) part allows to deduplicate storage as well as cheap mass update.

## Why not a single smart contract with a token_id -> owner_address dictionary?
1. Unpredictable gas consumption
   In TON, gas consumption for dictionary operations depends on exact set of keys.
   Also, TON is an asynchronous blockchain. This means that if you send a message to a smart contract, then you do not know how many messages from other users will reach the smart contract before your message.
   Thus, you do not know what the size of the dictionary will be at the moment when your message reaches the smart contract.
   This is OK with a simple wallet -> NFT smart contract interaction, but not acceptable with smart contract chains, e.g. wallet -> NFT smart contract -> auction -> NFT smart contract.
   If we cannot predict gas consumption, then a situation may occur like that the owner has changed on the NFT smart contract, but there were no enough Toncoins for the auction operation.
   Using smart contracts without dictionaries gives deterministic gas consumption.
2. Does not scale (becomes a bottleneck)
   Scaling in TON is based on the concept of sharding, i.e. automatic partitioning of the network into shardchains under load.
   The single big smart contract of the popular NFT contradicts this concept. In this case, many transactions will refer to one single smart contract.
   The TON architecture provides for sharded smart contracts(see whitepaper), but at the moment they are not implemented.

## Why are there no "Approvals"?
TON is an asynchronous blockchain, so some synchronous blockchain approaches are not suitable.

You cannot send the message "is there an approval?" because the response may become irrelevant while the response message is getting to you.

If a synchronous blockchain can check `alowance` and if everything is OK do `transferFrom` in one transaction, then in an asynchronous blockchain you will always need to send a `transferFrom` message at random, and in case of an error, catch the response message and perform rollback actions.

This is a complex and inappropriate approach.

Fortunately, all cases that arose during the discussion can be implemented by a regular transfer with notification of the new owner. In some cases, this will require an additional smart contract.

The case when you want to place NFT on several marketplaces at the same time is solved by creating auction smart contracts that first accept payment, and then NFT is sent to one of auction smart contracts.

## Why are there no obligatory royalties to the author from all sales?
In the process of developing this idea, we came to the conclusion that it is possible to guarantee royalties to the author from absolutely any sale on the blockchain only in 1 case:

All transfers must be carried out through an open long-term auction, and other types of transfers are prohibited.

If you want to transfer NFT to yourself to another wallet, then you need to start an auction and win it.

Another variation of this scheme is to make all transfers chargeable.

By prohibiting the free transfer of tokens, we make tokens inconvenient in many cases - the user simply updated the wallet, the user wants to donate NFT, the user wants to send NFT to some smart contract.

Given the poor usability and that NFTs are a general concept and not all of them are created for sale - this approach was rejected.

# Prior art
1. [Ethereum NFT Standard (EIP-721)](https://eips.ethereum.org/EIPS/eip-721)
2. [Polkadot NFT Standard (RMRK)](https://github.com/rmrk-team/rmrk-spec)
3. [Cosmos InterNFT Standards](https://github.com/interNFT/nft-rfc)
4. [Everscale NFT Standard (TIP-4.1)](https://docs.everscale.network/standard/TIP-4.1)

# Unresolved questions
1. Owner index is not implemented yet, should we implement it in future standards?
2. There is no standard methods to perform "safe transfer", which will revert ownership transfer in case of contract execution failure.

# Future possibilities
None

# Standard extensions
The functionality of the basic NFT standard can be extended:

* [NFTRoyalty](https://github.com/ton-blockchain/TEPs/blob/master/text/0066-nft-royalty-standard.md)
* [NFTBounceable (Draft)](https://github.com/ton-blockchain/TIPs/issues/67)
* [NFTEditable (Draft)](https://github.com/ton-blockchain/TIPs/issues/68)
* [NFTUpgradable (Draft)](https://github.com/ton-blockchain/TIPs/issues/69)

# TL-B schema
```
nothing$0 {X:Type} = Maybe X;
just$1 {X:Type} value:X = Maybe X;
left$0 {X:Type} {Y:Type} value:X = Either X Y;
right$1 {X:Type} {Y:Type} value:Y = Either X Y;
var_uint$_ {n:#} len:(#< n) value:(uint (len * 8))
         = VarUInteger n;

addr_none$00 = MsgAddressExt;
addr_extern$01 len:(## 9) external_address:(bits len) 
             = MsgAddressExt;
anycast_info$_ depth:(#<= 30) { depth >= 1 }
   rewrite_pfx:(bits depth) = Anycast;
addr_std$10 anycast:(Maybe Anycast) 
   workchain_id:int8 address:bits256  = MsgAddressInt;
addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9) 
   workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
_ _:MsgAddressInt = MsgAddress;
_ _:MsgAddressExt = MsgAddress;

transfer query_id:uint64 new_owner:MsgAddress response_destination:MsgAddress custom_payload:(Maybe ^Cell)  forward_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)  = InternalMsgBody;

ownership_assigned query_id:uint64 prev_owner:MsgAddress forward_payload:(Either Cell ^Cell) = InternalMsgBody;

excesses query_id:uint64 = InternalMsgBody;
get_static_data query_id:uint64 = InternalMsgBody;
report_static_data query_id:uint64 index:uint256 collection:MsgAddress = InternalMsgBody;
```

Tags were calculated via tlbc as follows (request_flag is equal to `0x7fffffff` and response flag is equal to `0x80000000`):

`crc32('transfer query_id:uint64 new_owner:MsgAddress response_destination:MsgAddress custom_payload:Maybe ^Cell forward_amount:VarUInteger 16 forward_payload:Either Cell ^Cell = InternalMsgBody') = 0x5fcc3d14 & 0x7fffffff = 0x5fcc3d14`

`crc32('ownership_assigned query_id:uint64 prev_owner:MsgAddress forward_payload:Either Cell ^Cell = InternalMsgBody') = 0x85138d91 & 0x7fffffff = 0x05138d91 `

`crc32('excesses query_id:uint64 = InternalMsgBody') = 0x553276db | 0x80000000 = 0xd53276db`

`crc32('get_static_data query_id:uint64 = InternalMsgBody') = 0x2fcb26a2 & 0x7fffffff = 0x2fcb26a2`

`crc32('report_static_data query_id:uint64 index:uint256 collection:MsgAddress = InternalMsgBody') = 0xb771735 | 0x80000000 = 0x8b771735`

# Acknowledgements
We are grateful to the [Tonwhales](https://github.com/tonwhales) developers for collaborating on the current draft of the standard 🤝

# Changelog
[01 Feb 2022](https://github.com/ton-blockchain/TIPs/issues/62#issuecomment-1027167743) 

[02 Feb 2022](https://github.com/ton-blockchain/TIPs/issues/62#issuecomment-1028289413) 

[04 Feb 2022](https://github.com/ton-blockchain/TIPs/issues/64#issuecomment-1029767906) 

[08 Feb 2022](https://github.com/ton-blockchain/TIPs/issues/62#issuecomment-1032979666) 

[11 Feb 2022](https://github.com/ton-blockchain/TIPs/issues/62#issuecomment-1036003434) 

[30 Jul 2022](https://github.com/ton-blockchain/TIPs/issues/62#issuecomment-1200095572)

31 Aug 2022 - Added `forward_payload` format. 



================================================
FILE: text/0064-token-data-standard.md
================================================
- **TEP**: [64](https://github.com/ton-blockchain/TEPs/pull/3)
- **title**: Token Data Standard
- **status**: Active
- **type**: Contract Interface
- **authors**: [EmelyanenkoK](https://github.com/EmelyanenkoK), [Tolya](https://github.com/tolya-yanot)
- **created**: 03.02.2022
- **replaces**: -
- **replaced by**: -

# Summary

A standard interface for tokens (meta)data (in particular [NFT](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md) or [Jettons](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)).

# Motivation

For applications like wallets or marketplaces it is quite useful to be able automatically retrieve information for display. Token data standard allows to simplify this process and uniform the way of token display across different applications.

# Guide

Each token (and also NFT Collection) has its own metadata. It contains some info about token, such as title and associated image. Metadata can be stored offchain (smart contract will contain only a link to json) or onchain (all data will be stored in smart contract).

## NFT Collection metadata example (offchain)

Deployed in mainnet at address: `EQD7Qtnas8qpMvT7-Z634_6G60DGp02owte5NnEjaWq6hb7v` ([explorer.tonnft.tools](https://explorer.tonnft.tools/collection/EQD7Qtnas8qpMvT7-Z634_6G60DGp02owte5NnEjaWq6hb7v))

Metadata:
```json
{
   "image": "https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/image.png",
   "name": "TON Smart Challenge #2",
   "description": "TON Smart Challenge #2 Winners Trophy",
   "social_links": [],
   "marketplace": "getgems.io"
}
```

## NFT Item metadata example (offchain)

Deployed in mainnet at address: `EQA5q4UveXaw6zx359QtgYh1L6c18X0OiAcQPhlkXufwQjOA` ([explorer.tonnft.tools](https://explorer.tonnft.tools/nft/EQA5q4UveXaw6zx359QtgYh1L6c18X0OiAcQPhlkXufwQjOA))

Metadata:
```json
{
   "name": "TON Smart Challenge #2 Winners Trophy",
   "description": "TON Smart Challenge #2 Winners Trophy 1 place out of 181",
   "image": "https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/images/943e994f91227c3fdbccbc6d8635bfaab256fbb4",
   "content_url": "https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/content/84f7f698b337de3bfd1bc4a8118cdfd8226bbadf",
   "attributes": []
}
```

## Jetton metadata example (offchain):

Deployed in mainnet at address: `EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw` ([ton.cx](https://ton.cx/address/EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw))

Metadata:
```json
{
   "name": "Huebel Bolt",
   "description": "Official token of the Huebel Company",
   "symbol": "BOLT",
   "decimals": 9,
   "image_data": "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDAuNTkgMjc2LjQ3Ij48ZGVmcz48c3R5bGU+LmF7ZmlsbDojMWQxZDFiO308L3N0eWxlPjwvZGVmcz48cGF0aCBjbGFzcz0iYSIgZD0iTTQxLjcxLDQxLjM4cS0xLjMyLDI1LjM0LTEuMjYsNTAuNjlUNDIsMTQyLjc1cTEuNDQsMjUuMzIsNC4yNiw1MC41M3Q3LDUwLjRjMS4xMSw2LjcxLDEuODksMTMuNjgsNC40OSwyMCwyLjE0LDUuMjEsNS41MywxMC41NSwxMS4yMywxMi4yNSw2LjMsMS44OSwxMi4wNi0xLjYxLDE1LjczLTYuNTQsNC4xNS01LjU5LDYuMTctMTIuNzgsOC0xOS4zOSw0LjMtMTUuMzgsNi0zMS4zOCw2LjctNDcuMjkuNzItMTYuMzcuNTUtMzIuNzguNjQtNDkuMTZsLjI2LTUxLjY3LjI2LTUxLjY3LjA2LTEyLjczYzAtMy4yMS01LTMuMjItNSwwbC0uMjUsNTAuNDItLjI2LDUwLjQyYy0uMDgsMTYuNTIsMCwzMy0uMyw0OS41Ni0uMjMsMTUuNDYtLjg5LDMxLTMuNjMsNDYuMjZhMTQ3LjkyLDE0Ny45MiwwLDAsMS01Ljc2LDIyLjQzYy0xLjc3LDUuMDgtNC4xNCwxMS4yNC05LjE2LDEzLjk0LTQuNDMsMi4zOS04Ljc1LDAtMTEuMzEtMy43My0zLjI0LTQuNzUtNC40Ni0xMC40NC01LjQ0LTE2cS00LjMxLTI0LjM5LTcuMjktNDl0LTQuNjQtNDkuMjdxLTEuNjYtMjQuNjctMi00OS40M3QuNjEtNDkuNDhxLjI0LTYuMTIuNTYtMTIuMjRjLjE2LTMuMjEtNC44NC0zLjItNSwwWiIvPjxwYXRoIGNsYXNzPSJhIiBkPSJNNDUuMyw0Mi4wOWE2Ni42Nyw2Ni42NywwLDAsMS0yOC41Mi02QTY2Ljc5LDY2Ljc5LDAsMCwxLDEwLjIsMzIuNmMtMS42Ni0xLTMuNzItMi4wOS00LjctMy44NC0xLjkzLTMuNDgsMi4wNi03LDQuNjYtOC43OGE2Mi41OSw2Mi41OSwwLDAsMSwxMi45MS02LjMzQTEwNS4zNiwxMDUuMzYsMCwwLDEsMzcuMzMsOS40OCwxOTkuNjYsMTk5LjY2LDAsMCwxLDY2Ljg3LDUuNjRjMjAuMTItMS4zOSw0MC44OS0xLDYwLjA1LDYsMy4zMSwxLjIsOSwyLjU1LDguNjcsNy0uMywzLjkxLTMuNTUsNy4yNy02LjQyLDkuNjItNi4zMiw1LjE2LTE0Ljg1LDcuMS0yMi43Myw4LjMxYTI4OSwyODksMCwwLDEtMzEuMjMsMi43NHEtMTYuNzUuNzItMzMuNTIsMC00LjItLjItOC4zNy0uNDhhMi41LDIuNSwwLDAsMCwwLDUsMzYwLjU0LDM2MC41NCwwLDAsMCw3MC44Mi0xLjg5YzktMS4xNiwxOC4zLTMsMjUuOTEtOC4xMiwzLjcyLTIuNTEsNy4zMS01Ljg4LDkuMTktMTBhMTIuNjIsMTIuNjIsMCwwLDAsMS4xNy03LjU5LDkuMjIsOS4yMiwwLDAsMC00LjI2LTUuOTFBMzcsMzcsMCwwLDAsMTI4Ljg4LDdjLTIuNTEtLjk0LTUuMDctMS43Ny03LjY1LTIuNWExMTYuMzcsMTE2LjM3LDAsMCwwLTE2LTMuMjIsMTgxLjE2LDE4MS4xNiwwLDAsMC0zMi45My0xQzUxLjE2LDEuMzksMjguODUsMy42NywxMC4wNywxNC4yLDYsMTYuNDgsMS41NiwxOS43OS4zLDI0LjU1QTguODQsOC44NCwwLDAsMCwxLjM4LDMxLjZhMTcuMzksMTcuMzksMCwwLDAsNS43Myw1QTcyLDcyLDAsMCwwLDM3LjQyLDQ2Ljc0YTY5LjE1LDY5LjE1LDAsMCwwLDcuODguMzVjMy4yMiwwLDMuMjMtNSwwLTVaIi8+PHBhdGggY2xhc3M9ImEiIGQ9Ik00NC4xNyw2NS40NmExNjkuNzksMTY5Ljc5LDAsMCwxLDU0LjE0LTguODJjMy4yMiwwLDMuMjItNSwwLTVhMTc0LjMzLDE3NC4zMywwLDAsMC01NS40Nyw5Yy0zLDEtMS43Myw1Ljg1LDEuMzMsNC44MloiLz48cGF0aCBjbGFzcz0iYSIgZD0iTTQ0LDc1Ljc2YzQuMTQsMS44Niw4LjQ0LDEuNDgsMTIuNzcuNTMsNC41LTEsOS0yLjEyLDEzLjQ2LTMuMTlMOTcuOSw2Ni41MmMzLjEzLS43NCwxLjgtNS41Ni0xLjMzLTQuODJMNzAuMzYsNjcuOTQsNTcuMzcsNzFjLTMuNC44MS03LjQ3LDEuOTMtMTAuODQuNDNhMi41OCwyLjU4LDAsMCwwLTMuNDIuODksMi41MiwyLjUyLDAsMCwwLC45LDMuNDJaIi8+PHBhdGggY2xhc3M9ImEiIGQ9Ik00Mi4zMiw4OS4yMmEzNTEuOSwzNTEuOSwwLDAsMCw1NC42Mi02LjQ5LDIuNTMsMi41MywwLDAsMCwxLjc1LTMuMDgsMi41NiwyLjU2LDAsMCwwLTMuMDgtMS43NSwzNDIuMiwzNDIuMiwwLDAsMS01My4yOSw2LjMyYy0zLjIxLjEzLTMuMjIsNS4xMywwLDVaIi8+PHBhdGggY2xhc3M9ImEiIGQ9Ik00Ny4yOSwxMDIuNjZRNzAuNzUsMTAwLjgzLDk0LDk3LjNhMi41LDIuNSwwLDAsMC0xLjMzLTQuODJxLTIyLjYsMy40Mi00NS40Miw1LjE4YTIuNTUsMi41NSwwLDAsMC0yLjUsMi41LDIuNTIsMi41MiwwLDAsMCwyLjUsMi41WiIvPjxwYXRoIGNsYXNzPSJhIiBkPSJNNDQuNzIsMTE2LjE5QTY4LjU5LDY4LjU5LDAsMCwxLDU3LjEyLDExNGM0LjQ4LS40OCw5LS45MywxMy40My0xLjM5bDI2Ljc5LTIuNzVhMi41NywyLjU3LDAsMCwwLDIuNS0yLjUsMi41MiwyLjUyLDAsMCwwLTIuNS0yLjVsLTI3LjI4LDIuOGMtNC40Ny40Ni04Ljk0LjktMTMuNDEsMS4zOWE3NC40Miw3NC40MiwwLDAsMC0xMy4yNiwyLjM1Yy0zLjA4LjkyLTEuNzcsNS43NCwxLjMzLDQuODJaIi8+PHBhdGggY2xhc3M9ImEiIGQ9Ik00NC4zMSwxMjhsNDktNS4zNGEyLjU3LDIuNTcsMCwwLDAsMi41LTIuNSwyLjUxLDIuNTEsMCwwLDAtMi41LTIuNWwtNDksNS4zNGEyLjU3LDIuNTcsMCwwLDAtMi41LDIuNSwyLjUxLDIuNTEsMCwwLDAsMi41LDIuNVoiLz48cGF0aCBjbGFzcz0iYSIgZD0iTTQ0Ljc3LDE0MS4xNEEyMjkuNDMsMjI5LjQzLDAsMCwxLDk1LjMxLDEzM2MzLjIxLS4xNSwzLjIyLTUuMTUsMC01YTIzNS40MywyMzUuNDMsMCwwLDAtNTEuODcsOC4zMWMtMy4xLjg2LTEuNzgsNS42OCwxLjMzLDQuODJaIi8+PHBhdGggY2xhc3M9ImEiIGQ9Ik00Ni4zMywxNTIuMTdhMzY3LjY5LDM2Ny42OSwwLDAsMCw0OC43My05YzMuMTEtLjc5LDEuNzktNS42Mi0xLjMzLTQuODJhMzU3LjgzLDM1Ny44MywwLDAsMS00Ny40LDguNzgsMi41OCwyLjU4LDAsMCwwLTIuNSwyLjUsMi41MSwyLjUxLDAsMCwwLDIuNSwyLjVaIi8+PHBhdGggY2xhc3M9ImEiIGQ9Ik00OCwxNjMuMTFsNDYuOTEtNy41NmEyLjUyLDIuNTIsMCwwLDAsMS43NS0zLjA4LDIuNTYsMi41NiwwLDAsMC0zLjA4LTEuNzRsLTQ2LjkxLDcuNTVhMi41MywyLjUzLDAsMCwwLTEuNzQsMy4wOEEyLjU2LDIuNTYsMCwwLDAsNDgsMTYzLjExWiIvPjxwYXRoIGNsYXNzPSJhIiBkPSJNNDguNzQsMTc0YTE4Ny42OCwxODcuNjgsMCwwLDEsNDcuNTctNi4yN2MzLjIyLDAsMy4yMy01LDAtNWExOTMuNTksMTkzLjU5LDAsMCwwLTQ4LjksNi40NWMtMy4xMS44Mi0xLjc5LDUuNjUsMS4zMyw0LjgyWiIvPjxwYXRoIGNsYXNzPSJhIiBkPSJNNDguMywxODYuOGEzNzEuOTMsMzcxLjkzLDAsMCwwLDQ1LjgtNi4zMywyLjUyLDIuNTIsMCwwLDAsMS43NC0zLjA3LDIuNTUsMi41NSwwLDAsMC0zLjA3LTEuNzVBMzYwLjIyLDM2MC4yMiwwLDAsMSw0OC4zLDE4MS44YTIuNTYsMi41NiwwLDAsMC0yLjUsMi41LDIuNTEsMi41MSwwLDAsMCwyLjUsMi41WiIvPjxwYXRoIGNsYXNzPSJhIiBkPSJNNDguMjgsMTk5LjczUTcxLjgyLDE5Nyw5NSwxOTIuMTRhMi41MywyLjUzLDAsMCwwLDEuNzUtMy4wNywyLjU1LDIuNTUsMCwwLDAtMy4wOC0xLjc1UTcxLjE3LDE5Miw0OC4yOCwxOTQuNzNhMi41OCwyLjU4LDAsMCwwLTIuNSwyLjUsMi41MSwyLjUxLDAsMCwwLDIuNSwyLjVaIi8+PHBhdGggY2xhc3M9ImEiIGQ9Ik01MiwyMTEuODlRNzQsMjA3LjYsOTYuMzIsMjA1YTIuNTcsMi41NywwLDAsMCwyLjUtMi41LDIuNTIsMi41MiwwLDAsMC0yLjUtMi41cS0yMywyLjYzLTQ1LjY3LDdhMi41MSwyLjUxLDAsMCwwLTEuNzUsMy4wN0EyLjU1LDIuNTUsMCwwLDAsNTIsMjExLjg5WiIvPjxwYXRoIGNsYXNzPSJhIiBkPSJNNTMuMzMsMjI2LjIycTIwLjQtMS40LDQwLjY2LTQuMmEyLjUzLDIuNTMsMCwwLDAsMS43NS0zLjA4LDIuNTYsMi41NiwwLDAsMC0zLjA4LTEuNzRxLTE5LjU3LDIuNy0zOS4zMyw0YTIuNTUsMi41NSwwLDAsMC0yLjUsMi41LDIuNTIsMi41MiwwLDAsMCwyLjUsMi41WiIvPjxwYXRoIGNsYXNzPSJhIiBkPSJNNTcsMjM4LjExcTE2LjgxLTMuOTIsMzMuOTItNi40YTIuNTMsMi41MywwLDAsMCwxLjc1LTMuMDgsMi41OCwyLjU4LDAsMCwwLTMuMDgtMS43NXEtMTcuMDksMi40OS0zMy45Miw2LjQxYy0zLjEzLjczLTEuODEsNS41NSwxLjMzLDQuODJaIi8+PHBhdGggY2xhc3M9ImEiIGQ9Ik01OS4zMywyNDkuMjdBMjE2LjgyLDIxNi44MiwwLDAsMCw4OCwyNDUuMDdjMy4xNC0uNjgsMS44MS01LjUtMS4zMy00LjgyYTIwNS4yOSwyMDUuMjksMCwwLDEtMjcuMzYsNCwyLjU3LDIuNTcsMCwwLDAtMi41LDIuNSwyLjUxLDIuNTEsMCwwLDAsMi41LDIuNVoiLz48cGF0aCBjbGFzcz0iYSIgZD0iTTYyLjA5LDI2Mi41NmwyMi44NS0zLjg2YTIuNTEsMi41MSwwLDAsMCwxLjc1LTMuMDcsMi41NSwyLjU1LDAsMCwwLTMuMDctMS43NWwtMjIuODYsMy44NkEyLjUyLDIuNTIsMCwwLDAsNTksMjYwLjgxYTIuNTcsMi41NywwLDAsMCwzLjA4LDEuNzVaIi8+PC9zdmc+"
}
```

This example shows us that it is possible to embed an image directly in json, without additional links.

# Specification

## Content representation
Three options can be used:

1. **Off-chain content layout**
   The first byte is `0x01` and the rest is the URI pointing to the JSON document containing the token metadata. The URI is encoded as ASCII.
   If the URI does not fit into one cell, then it uses the "Snake format" described in the "Data serialization" paragraph, the snake-format-prefix `0x00` is dropped.
2. **On-chain content layout**
   The first byte is `0x00` and the rest is key/value dictionary.
   Key is sha256 hash of string.
   Value is data encoded as described in "Data serialization" paragraph.
3. **Semi-chain content layout**
   Data encoded as described in "2. On-chain content layout".
   The dictionary must have `uri` key with a value containing the URI pointing to the JSON document with token metadata.
   Clients in this case should merge the keys of the on-chain dictionary and off-chain JSON doc.
   In case of collisions (the field exists in both off-chain data and on-chain data), on-chain values are used.

## Data serialization
Data that does not fit in one cell can be stored in two ways:

1. **Snake format** when we store part of the data in a cell and the rest of the data in the first child cell (and so recursively).
   Must be prefixed with `0x00` byte.
   TL-B scheme:
   ```
   tail#_ {bn:#} b:(bits bn) = SnakeData ~0;
   cons#_ {bn:#} {n:#} b:(bits bn) next:^(SnakeData ~n) = SnakeData ~(n + 1);
   ```
2. **Chunked format** when we store data in dictionary `chunk_index` -> `chunk`.
   Must be prefixed with `0x01` byte.
   TL-B scheme:
   ```
    chunked_data#_ data:(HashMapE 32 ^(SnakeData ~0)) = ChunkedData;
   ```

Data that fits into one cell is stored in "Snake format".

If the prefix is not `0x00` or `0x01`, then the data is probably encoded by the TL-B schema (relating to a specific smart contract), for example, like in the [DNS contract](https://github.com/ton-blockchain/TEPs/blob/master/text/0081-dns-standard.md#dns-records).

## Informal TL-B scheme:
```
text#_ {n:#} data:(SnakeData ~n) = Text;
snake#00 {n:#} data:(SnakeData ~n) = ContentData;
chunks#01 data:ChunkedData = ContentData;
onchain#00 data:(HashmapE 256 ^ContentData) = FullContent;
offchain#01 uri:Text = FullContent;
```

Note, that while TL-B scheme does not constrain bit size of each chunk it is expected that all chunks contain ceil number of bytes.

## NFT metadata attributes
1. `uri` - Optional. Used by "Semi-chain content layout". ASCII string. A URI pointing to JSON document with metadata.
2. `name` - Optional. UTF8 string. Identifies the asset.
3. `description` - Optional. UTF8 string. Describes the asset.
4. `image` - Optional. ASCII string. A URI pointing to a resource with mime type image.
5. `image_data` - Optional. Either binary representation of the image for onchain layout or base64 for offchain layout.

## Jetton metadata attributes
1. `uri` - Optional. Used by "Semi-chain content layout". ASCII string. A URI pointing to JSON document with metadata.
2. `name` - Optional. UTF8 string. The name of the token - e.g. "Example Coin".
3. `description` - Optional. UTF8 string. Describes the token - e.g. "This is an example jetton for the TON network".
4. `image` - Optional. ASCII string. A URI pointing to a jetton icon with mime type image.
5. `image_data` - Optional. Either binary representation of the image for onchain layout or base64 for offchain layout.
6. `symbol` - Optional. UTF8 string. The symbol of the token - e.g. "XMPL". Used in the form "You received 99 XMPL".
7. `decimals` - Optional. If not specified, 9 is used by default. UTF8 encoded string with number from 0 to 255. The number of decimals the token uses - e.g. 8, means to divide the token amount by 100000000 to get its user representation, while 0 means that tokens are indivisible: user representation of token number should correspond to token amount in wallet-contract storage.
   In case you specify decimals, it is highly recommended that you specify this parameter on-chain and that the smart contract code ensures that this parameter is immutable.
8. `amount_style` - Optional. Needed by external applications to understand which format for displaying the number of jettons. 
 - "n" - number of jettons (default value). If the user has 100 tokens with decimals 0, then display that user has 100 tokens
 - "n-of-total" - the number of jettons out of the total number of issued jettons. For example, totalSupply Jetton = 1000. A user has 100 jettons in the jetton wallet. For example must be displayed in the user's wallet as 100 of 1000 or in any other textual or graphical way to demonstrate the particular from the general.
 - "%" - percentage of jettons from the total number of issued jettons. For example, totalSupply Jetton = 1000. A user has 100 jettons in the jetton wallet. For example it should be displayed in the user's wallet as 10%.
9. `render_type` - Optional. Needed by external applications to understand which group the jetton belongs to and how to display it.  
 - "currency" - display as currency (default value). 
 - "game" - display for games. It should be displayed as NFT, but at the same time display the number of jettons considering the `amount_style`

# Drawbacks

None

# Rationale and alternatives

Proposed standard allows developers to extend (meta)data on demand by introducing new fields without risk of collisions. An alternative to this approach could be [predefined set of data fields](https://github.com/ton-blockchain/TIPs/issues/79) which, from first glance, could save some storage and gas fees. However, there is no reason not to store the metadata in some compact predefined form in the contract and then just render it in get method (which works offline and thus doesn't waste gas) as Data Standard suggested, allowing lower fees without sacrificing flexibility.

While on-chain data storage is preferred, off-chain/semi-chain options allow flexibly adapt tokens for required usecases.

# Prior art

1. [EIP-721](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md)
2. [OpenSea metadata guide](https://docs.opensea.io/docs/metadata-standards)

# Unresolved questions

1. Shall we authenticate offchain data to prevent it from changing? ([NoelJacob](https://github.com/ton-blockchain/TIPs/issues/64#issuecomment-1029900008))
2. Shall we support semichain layout, where only some metadata fields may be stored onchain? ([tvorogme](https://github.com/ton-blockchain/TIPs/issues/64#issuecomment-1028622110))
3. Shall we standardize attributes, traits, and non-image content? ([tolya-yanot](https://github.com/ton-blockchain/TIPs/issues/64#issuecomment-1041919338))

# Future possibilities

None

# Changelog

* 14 May 2022 - the standard is now used not only for NFT, but for all tokens in the TON. Added section "Jetton metadata attributes".

* 31 Aug 2022 - added note about data encoded in TL-B schema in "Data serialization" paragraph.

* 14 Oct 2022 - render_type and amount_style for Jetton metadata

* 20 Dec 2023 - added clarification for semi-chain data: "In case of collisions (the field exists in both off-chain data and on-chain data), on-chain values are used."



================================================
FILE: text/0066-nft-royalty-standard.md
================================================
- **TEP**: [66](https://github.com/ton-blockchain/TEPs/pull/6)
- **title**: NFTRoyalty Standard Extension
- **status**: Active
- **type**: Contract Interface
- **authors**: [EmelyanenkoK](https://github.com/EmelyanenkoK), [Tolya](https://github.com/tolya-yanot)
- **created**: 12.02.2022
- **replaces**: -
- **replaced by**: -

# Summary

Extension for [NFT Standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md).

A standardized way to retrieve royalty payment information for non-fungible tokens (NFTs) to enable universal support for royalty payments across all NFT marketplaces and ecosystem participants.

# Motivation

It is convenient to standardize royalty, so all NFT markets will pay royalty to collection author independently of how this collection was deployed.

# Guide

1. report_royalty_params example implementation: [ton-blockchain/token-contract](https://github.com/ton-blockchain/token-contract/blob/2c13d3ef61ca4288293ad65bf0cfeaed83879b93/nft/nft-collection.fc#L58-L68).
2. get_royalty_params example implementation: [ton-blockchain/token-contract](https://github.com/ton-blockchain/token-contract/blob/2c13d3ef61ca4288293ad65bf0cfeaed83879b93/nft/nft-collection.fc#L149-L153).

Royalty data example in Fift:
```
"EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N" parse-smc-addr drop 2=: royalty-addr

<b
    11 16 u, // numerator
    1000 16 u, // denominator
    royalty-addr Addr, // address to send royalty
b> =: royalty-params
```

# Specification

> The key words “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY”, and “OPTIONAL” in this document are to be interpreted as described in RFC 2119.

NFT Collection smart contract MUST implement:

(if this is a variant of NFT items without collection then NFT item smart contract MUST implement this).

#### Get-methods
1. `royalty_params()` returns `(int numerator, int denominator, slice destination)`
   Royalty share is `numerator / denominator`.
   E.g if `numerator = 11` and `denominator = 1000` then royalty share is `11 / 1000 * 100% = 1.1%`.
   `numerator` must be less `denominator`.
   `destination` - address to send royalty. Slice of type `MsgAddress`.

#### Internal messages
1. `get_royalty_params`
   **Request**
   TL-B schema of inbound message:
   `get_royalty_params#693d3950 query_id:uint64 = InternalMsgBody;`
   `query_id` - arbitrary request number.
   **Should do:**
   Send back message with the following layout and send-mode `64` (return msg amount except gas fees):
   TL-B schema `report_royalty_params#a8cb00ad query_id:uint64 numerator:uint16 denominator:uint16 destination:MsgAddress = InternalMsgBody;`

It is expected that marketplaces which want to participate in royalty payments will send `muldiv(price, numerator, denominator)` to `destination` address after NFT sale.

Marketplaces SHOULD neglect zero-value royalty payments.

Marketplaces MAY deduct gas and message fees required to send royalty from royalty amount.

## TL-B Schema
```
get_royalty_params query_id:uint64 = InternalMsgBody;
report_royalty_params query_id:uint64 numerator:uint16 denominator:uint16 destination:MsgAddress = InternalMsgBody;
```

`crc32('get_royalty_params query_id:uint64 = InternalMsgBody') = 0xe93d3950 & 0x7fffffff = 0x693d3950`

`crc32('report_royalty_params query_id:uint64 numerator:uint16 denominator:uint16 destination:MsgAddress = InternalMsgBody') = 0xa8cb00ad | 0x80000000 = 0xa8cb00ad`

# Drawbacks

There is no way to enforce royalty for each sale. There should be an option to gift NFT for free, however, it is not possible to track, was it really for free or not. See the relevant paragraph in [TEP-62](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#why-are-there-no-obligatory-royalties-to-the-author-from-all-sales).

# Rationale and alternatives

## Why can't I set a fixed amount of royalties?
We do not know in what currency the sale will take place. Percentage royalty is universal.

# Prior art

1. [EIP-2981: NFT Royalty Standard](https://eips.ethereum.org/EIPS/eip-2981)

# Unresolved questions

1. Shall we standardize internal message with royalties which markets send to the author?

# Future possibilities

None



================================================
FILE: text/0074-jettons-standard.md
================================================
- **TEP**: [74](https://github.com/ton-blockchain/TEPs/pull/4)
- **title**: Fungible tokens (Jettons) standard
- **status**: Active
- **type**: Contract Interface
- **authors**: [EmelyanenkoK](https://github.com/EmelyanenkoK), [Tolya](https://github.com/tolya-yanot)
- **created**: 12.03.2022
- **replaces**: -
- **replaced by**: -

# Summary

A standard interface for Jettons (TON fungible tokens).

# Motivation

A standard interface will greatly simplify interaction and display of different tokenized assets.

Jetton standard describes:

* The way of jetton transfers.
* The way of retrieving common information (name, circulating supply, etc) about given Jetton asset.

# Guide

## Useful links
1. [Reference jetton implementation](https://github.com/ton-blockchain/token-contract/)
2. [Jetton deployer](https://jetton.live/)
3. FunC Jetton lesson ([en](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/9lesson/ninthlesson.md)/[ru](https://github.com/romanovichim/TonFunClessons_ru/blob/main/lessons/smartcontract/9lesson/ninthlesson.md))

# Specification

Here and following we use "Jetton" with capital `J` as designation for entirety of tokens of the same type, while "jetton" with `j` as designation of amount of tokens of some type.

Jettons are organized as follows: each Jetton has master smart-contract which is used to mint new jettons, account for circulating supply and provide common information.

At the same time information about amount of jettons owned by each user is stores in decentralized manner in individual (for each owner) smart-contracts called "jetton-wallets".

Example: if you release a Jetton with circulating supply of 200 jetton which are owned by 3 people, then you will deploy 4 contracts: 1 Jetton-master and 3 jetton-wallets.

## Jetton wallet smart contract
Must implement:

### Internal message handlers
#### 1. `transfer`
**Request**

TL-B schema of inbound message:

```
transfer#0f8a7ea5 query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
                 response_destination:MsgAddress custom_payload:(Maybe ^Cell)
                 forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
                 = InternalMsgBody;
```

`query_id` - arbitrary request number.

`amount` - amount of transferred jettons in elementary units.

`destination` - address of the new owner of the jettons.

`response_destination` - address where to send a response with confirmation of a successful transfer and the rest of the incoming message Toncoins.

`custom_payload` - optional custom data (which is used by either sender or receiver jetton wallet for inner logic).

`forward_ton_amount` - the amount of nanotons to be sent to the destination address.

`forward_payload` - optional custom data that should be sent to the destination address.

**Should be rejected if:**

1. message is not from the owner.
2. there is no enough jettons on the sender wallet
3. there is no enough TON (with respect to jetton own storage fee guidelines and operation costs) to process operation, deploy receiver's jetton-wallet and send `forward_ton_amount`.
4. After processing the request, the receiver's jetton-wallet **must** send at least `in_msg_value - forward_ton_amount - 2 * max_tx_gas_price - 2 * fwd_fee` to the `response_destination` address.
   If the sender jetton-wallet cannot guarantee this, it must immediately stop executing the request and throw error.
   `max_tx_gas_price` is the price in Toncoins of maximum transaction gas limit of FT habitat workchain. For the basechain it can be obtained from [`ConfigParam 21`](https://github.com/ton-blockchain/ton/blob/78e72d3ef8f31706f30debaf97b0d9a2dfa35475/crypto/block/block.tlb#L660) from `gas_limit` field.  `fwd_fee` is forward fee for transfer request, it can be obtained from parsing transfer request message.

**Otherwise should do:**

1. decrease jetton amount on sender wallet by `amount` and send message which increase jetton amount on receiver wallet (and optionally deploy it).
2. if `forward_amount > 0` ensure that receiver's jetton-wallet send message to `destination` address with `forward_amount` nanotons attached and with the following layout:
   TL-B schema:

```
transfer_notification#7362d09c query_id:uint64 amount:(VarUInteger 16)
                              sender:MsgAddress forward_payload:(Either Cell ^Cell)
                              = InternalMsgBody;
```

`query_id` should be equal with request's `query_id`.

`amount` amount of transferred jettons.

`sender` is address of the previous owner of transferred jettons.

`forward_payload` should be equal with request's `forward_payload`.

If `forward_amount` is equal to zero, notification message should not be sent.

3. Receiver's wallet should send all excesses of incoming message coins to `response_destination` with the following layout:
   TL-B schema: `excesses#d53276db query_id:uint64 = InternalMsgBody;`
   `query_id` should be equal with request's `query_id`.

#### `forward_payload` format

If you want to send a simple comment in the `forward_payload` then the `forward_payload` must starts with `0x00000000` (32-bits unsigned integer equals to zero) and the comment is contained in the remainder of the `forward_payload`.

If comment does not begin with the byte `0xff`, the comment is a text one; it can be displayed "as is" to the end user of a wallet (after filtering invalid and control characters and checking that it is a valid UTF-8 string). 
For instance, users may indicate the purpose ("for coffee") of a simple transfer from their wallet to the wallet of another user in this text field. 

On the other hand, if the comment begins with the byte `0xff`, the remainder is a "binary comment", which should not be displayed to the end user as text (only as hex dump if necessary). 
The intended use of "binary comments" is, e.g., to contain a purchase identifier for payments in a store, to be automatically generated and processed by the store's software.

If the `forward_payload` contains a binary message for interacting with the destination smart contract (for example, with DEX), then there are no prefixes.

These rules are the same with the payload format when simply sending Toncoins from a regular wallet ([Smart Contract Guidelines: Internal Messages, 3](https://ton.org/docs/#/howto/smart-contract-guidelines?id=internal-messages)).

#### 2. `burn`
**Request**

TL-B schema of inbound message:

```
burn#595f07bc query_id:uint64 amount:(VarUInteger 16)
              response_destination:MsgAddress custom_payload:(Maybe ^Cell)
              = InternalMsgBody;
```

`query_id` - arbitrary request number.

`amount` - amount of burned jettons

`response_destination` - address where to send a response with confirmation of a successful burn and the rest of the incoming message coins.

`custom_payload` - optional custom data.

**Should be rejected if:**

1. message is not from the owner.
2. there is no enough jettons on the sender wallet
3. There is no enough TONs to send after processing the request at least `in_msg_value -  max_tx_gas_price` to the `response_destination` address.
   If the sender jetton-wallet cannot guarantee this, it must immediately stop executing the request and throw error.

**Otherwise should do:**

1. decrease jetton amount on burner wallet by `amount` and send notification to jetton master with information about burn.
2. Jetton master should send all excesses of incoming message coins to `response_destination` with the following layout:
   TL-B schema: `excesses#d53276db query_id:uint64 = InternalMsgBody;`
   `query_id` should be equal with request's `query_id`.

### Get-methods
1. `get_wallet_data()` returns `(int balance, slice owner, slice jetton, cell jetton_wallet_code)`
   `balance` - (uint256) amount of jettons on wallet.
   `owner` - (MsgAddress) address of wallet owner;
   `jetton` - (MsgAddress) address of Jetton master-address;
   `jetton_wallet_code` - (cell) with code of this wallet;

## Jetton master contract
### Get-methods
1. `get_jetton_data()` returns `(int total_supply, int mintable, slice admin_address, cell jetton_content, cell jetton_wallet_code)`
   `total_supply` - (integer) - the total number of issues jettons
   `mintable` - (-1/0) - flag which indicates whether number of jettons can increase
   `admin_address` - (MsgAddressInt) - address of smart-contrac which control Jetton
   `jetton_content` - cell - data in accordance to [Token Data Standard #64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md)
   `jetton_wallet_code` - cell - code of wallet for that jetton
2. `get_wallet_address(slice owner_address)` return `slice jetton_wallet_address`
   Returns jetton wallet address (MsgAddressInt) for this owner address (MsgAddressInt).

# TL-B schema
```
nothing$0 {X:Type} = Maybe X;
just$1 {X:Type} value:X = Maybe X;
left$0 {X:Type} {Y:Type} value:X = Either X Y;
right$1 {X:Type} {Y:Type} value:Y = Either X Y;
var_uint$_ {n:#} len:(#< n) value:(uint (len * 8))
         = VarUInteger n;

addr_none$00 = MsgAddressExt;
addr_extern$01 len:(## 9) external_address:(bits len)
             = MsgAddressExt;
anycast_info$_ depth:(#<= 30) { depth >= 1 }
   rewrite_pfx:(bits depth) = Anycast;
addr_std$10 anycast:(Maybe Anycast)
   workchain_id:int8 address:bits256  = MsgAddressInt;
addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)
   workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
_ _:MsgAddressInt = MsgAddress;
_ _:MsgAddressExt = MsgAddress;

transfer query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
           response_destination:MsgAddress custom_payload:(Maybe ^Cell)
           forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
           = InternalMsgBody;

transfer_notification query_id:uint64 amount:(VarUInteger 16)
           sender:MsgAddress forward_payload:(Either Cell ^Cell)
           = InternalMsgBody;

excesses query_id:uint64 = InternalMsgBody;

burn query_id:uint64 amount:(VarUInteger 16)
       response_destination:MsgAddress custom_payload:(Maybe ^Cell)
       = InternalMsgBody;

// ----- Unspecified by standard, but suggested format of internal message

internal_transfer  query_id:uint64 amount:(VarUInteger 16) from:MsgAddress
                     response_address:MsgAddress
                     forward_ton_amount:(VarUInteger 16)
                     forward_payload:(Either Cell ^Cell)
                     = InternalMsgBody;
burn_notification query_id:uint64 amount:(VarUInteger 16)
       sender:MsgAddress response_destination:MsgAddress
       = InternalMsgBody;
```

`crc32('transfer query_id:uint64 amount:VarUInteger 16 destination:MsgAddress response_destination:MsgAddress custom_payload:Maybe ^Cell forward_ton_amount:VarUInteger 16 forward_payload:Either Cell ^Cell = InternalMsgBody') = 0x8f8a7ea5 & 0x7fffffff = 0xf8a7ea5`

`crc32('transfer_notification query_id:uint64 amount:VarUInteger 16 sender:MsgAddress forward_payload:Either Cell ^Cell = InternalMsgBody') = 0xf362d09c & 0x7fffffff = 0x7362d09c`

`crc32('excesses query_id:uint64 = InternalMsgBody') = 0x553276db | 0x80000000 = 0xd53276db`

`crc32('burn query_id:uint64 amount:VarUInteger 16 response_destination:MsgAddress custom_payload:Maybe ^Cell = InternalMsgBody') = 0x595f07bc & 0x7fffffff = 0x595f07bc`

`crc32('internal_transfer query_id:uint64 amount:VarUInteger 16 from:MsgAddress response_address:MsgAddress forward_ton_amount:VarUInteger 16 forward_payload:Either Cell ^Cell = InternalMsgBody') = 0x978d4519 & 0x7fffffff = 0x178d4519`

`crc32('burn_notification query_id:uint64 amount:VarUInteger 16 sender:MsgAddress response_destination:MsgAddress = InternalMsgBody') = 0x7bdd97de & 0x7fffffff = 0x7bdd97de`

# Drawbacks

There is no way to get actual wallet balance onchain, because when the message with balance will arrive, wallet balance may be not actual.

# Rationale and alternatives

Distributed architecture "One wallet - one contract" well described in the [NFT standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#rationale-and-alternatives) in paragraph "Rationale".

# Prior art

1. [EIP-20 Token Standard](https://eips.ethereum.org/EIPS/eip-20)
2. [Sharded Smart Contracts for Smart Contract Developers](https://www.youtube.com/watch?v=svOadLWwYaM)

# Unresolved questions

1. There is no standard methods to perform "safe transfer", which will revert ownership transfer in case of contract execution failure.

# Future possibilities

There was an idea to implement [external message tokens](https://t.me/ton_overview/35) (by [EmelyanenkoK](https://github.com/EmelyanenkoK)).

# Changelog

31 Aug 2022 - Added `forward_payload` format. 



================================================
FILE: text/0081-dns-standard.md
================================================
- **TEP**: [81](https://github.com/ton-blockchain/TEPs/pull/5)
- **title**: TON DNS Standard
- **status**: Active
- **type**: Contract Interface
- **authors**: [EmelyanenkoK](https://github.com/EmelyanenkoK), [Tolya](https://github.com/tolya-yanot)
- **created**: 25.06.2022
- **replaces**: -
- **replaced by**: -

# Summary

TON DNS is a service for translating human-readable domain names (such as `test.ton` or `mysite.temp.ton`) into TON smart contract addresses, ADNL addresses employed by services running in the TON Network (such as TON Sites), and so on.

# Motivation

While anybody might in principle implement such a service using the TON Blockchain, 
it is useful to have such a predefined service with a wellknown interface, 
to be used by default whenever an application or a service wants to translate human-readable identifiers into addresses.

# Guide

## Useful links
1. [Reference DNS smart contracts](https://github.com/ton-blockchain/dns-contract)
2. [DNS Auction](https://dns.ton.org/) ([source code](https://github.com/ton-blockchain/dns))
3. [ton.org documentation](https://ton.org/docs/#/web3/dns)
4. Tolya answers about TON DNS (ru) - [1](https://telegra.ph/Otvety-na-voprosy-o-TON-DNS-kanalu-Investment-kingyru-CHast-1-08-05), [2](https://telegra.ph/Otvety-na-voprosy-o-TON-DNS-kanalu-Investment-kingyru-CHast-2-08-06), [3](https://telegra.ph/Otvety-na-voprosy-o-TON-DNS-kanalu-Investment-kingyru-CHast-3-08-09)

# Specification

## Domain names
TON DNS employs familiarly-looking domain names, consisting of a **UTF-8** encoded string **up to 126 bytes**, with different sections of the domain name separated by dots (".").

Bytes in range `0..32` (null character, control codes and space) inclusive are not allowed in domain names.

For instance, `test.ton` and `mysite.temp.ton` are valid TON DNS domains.

Technically, TON domains are case-sensitive, but TON apps and services convert all domains to lowercase before performing a TON DNS lookup in order to obtain case-insensitivity, so it makes no sense to register domains not in the lowercase.

Note that a particular smart contract implementation may impose additional name limits when creating subdomains (for example, to avoid similar characters to protect against phishing). But the `dnsresolve` get-method must support the domain names in the format described above.

## Domain internal representation
Internally, TON DNS transforms domain names as follows. First, a domain name is split into its components delimited by dot characters `.`. Then null characters are appended to each component, and all components are concatenated in reverse order. For example, `google.com` becomes `com\0google\0`.

## First-level domain
Currently, only domains ending in `.ton` are recognized as valid TON DNS domains.

This could change in the future. Notice, however, that it is a bad idea to define first-level domains coinciding with first-level domains already existing in the Internet, such as `.com` or `.to`, because one could then register a TON domain `google.com`, deploy a TON site there, create a hidden link to a page at this TON site from his other innocently-looking TON site, and steal `google.com` cookies from unsuspecting visitors.

## Resolving TON DNS domains
### Root DNS
First, the **root DNS smart contract** is located by inspecting the value of configuration parameter `#4` in a recent masterchain state. This parameter contains the 256-bit address of the root DNS smart contract inside the masterchain.

### dnsresolve
**Get-method**

Then a special get-method `dnsresolve` is invoked for the root DNS smart contract, with two parameters:

* The first parameter is a `CellSlice` with `8n` data bits containing the internal representation of the domain being resolved, where `n` is the length of the internal representation in bytes (at most 127).
* The second parameter is an unsigned 256-bit Integer containing the required `category`. Usually, category is sha256 hash of string. If the category is zero, then all categories are requested.

**Get-method result**

Get-method returns two values:

* The first is `8m`, the length (in bits) of the prefix of the internal representation of the domain that has been resolved, `0 < m <= n`.
* The second is a `Cell` with the TON DNS record for the required domain in the required category, or the root a `Dictionary` with 256-bit unsigned integer keys (categories) and values equal to the serializations of corresponding TON DNS records.

**Not resolved**

If this get-method fails, then the TON DNS lookup is unsuccessful.

If the domain cannot be resolved by the root DNS smart contract, i.e. if no non-empty prefix is a valid domain known to the smart contract, then `(0, null)` is returned.

In other words, `m = 0` means that the TON DNS lookup has found no data for the required domain. In that case, the TON DNS lookup is also unsuccessful.

**Resolved**

If `m = n`, then the second component of the result is either a `Cell` with a valid TON DNS record for the required domain and category, or a `Null` if there is no TON DNS record for this domain with this category.

In either case, the resolution process stops, and the TON DNS record thus obtained is deserialized and the required information (such as the type of the record and its parameters, such as a smart contract address or a ADNL address).

**Partial resolved**

Finally, if `m < n`, then the lookup is successful so far, but only a partial result is available for the `m`-byte prefix of the original internal representation of the domain.

The longest of all such prefixes known to the DNS smart contract is returned. For instance, an attempt to look up `mysite.test.ton` (i.e. `ton\0test\0mysite\0` in the internal representation) in the root DNS smart contract might return `8m=72`, corresponding to prefix `ton\0test\0`, i.e. to subdomain `test.ton` in the usual domain representation.

In that case, `dnsresolve()` returns the value for category `sha256("dns_next_resolver")` for this prefix regardless of the category originally requested by the client. By convention, category `sha256("dns_next_resolver")` contains a TON DNS Record of type `dns_next_resolver`, containing the address of next resolver smart contract (which can reside in any other workchain, such as the basechain).

If that is indeed the case, the resolution process continues by running get-method `dnsresolve` for the next resolver, with the internal representation of the domain name containing only its part unresolved so far (if we were looking up `ton\0test\0mysite\0`, and prefix `ton\0test\0` was found by the root DNS smart contract, then the next `dnsresolve` will be invoked with `mysite\0` as its first argument).

Then either the next resolver smart contract reports an error or the absence of any records for the required domain or any of its prefixes, or the final result is obtained, or another prefix and next resolver smart contract is returned. In the latter case, the process continues in the same fashion until all of the original domain is resolved.

**Null character at the beginning**

Null character `\0` at the beginning of the request represent "self".

Calling the `dnsresolve` method with one null character `\0` ("." in human-readable form) and category is correct.

In this case, the DNS smart contract can return the requested category(-ies) from its DNS records.

Example:

`dnsresolve("ton\0test\0mysite\0", 1)` is invoked for the root DNS smart contract.

Result is `8m=64`, corresponding to prefix `ton\0test`, and `dns_next_resolver` record.

`dnsresolve("\0mysite\0", 1)` is invoked for the DNS smart contract obtained from `dns_next_resolver` record.

Result is `8m=56`, corresponding to prefix `\0mysite`, and `dns_next_resolver` record.

`dnsresolve("\0", 1)` is invoked for the DNS smart contract obtained from `dns_next_resolver` record.

Result is `8m=8`, corresponding to `\0` and Cell with DNS record of category 1.

**Calling a `dnsresolve` on a non-root DNS smart contract**

Same with the `dnsresolve` on root DNS smart contract, but the initial request must start with a null character so that all types of implementations can return the correct result.

Example: `dnsresolve("\0test\0mysite\0")`.

Note that this is only required for the initial request, not during recursion.

## DNS Smart Contract
A smart contract that implements the TON DNS standard must contain a `dnsresolve` get-method that works as described above.

## DNS Records
Standard categories:

Category `sha256("dns_next_resolver")` - DNS next resolver, contains smart contract address of next DNS resolver in `dns_next_resolver` schema;

Category `sha256("wallet")` - TON Wallet, contains smart contract address in `dns_smc_address` schema;

Category `sha256("site")` - TON Site, contains ADNL address in `dns_adnl_address` schema;

TL-B Schema of DNS Records values:

```
proto_http#4854 = Protocol;
proto_list_nil$0 = ProtoList;

proto_list_next$1 head:Protocol tail:ProtoList = ProtoList;



cap_is_wallet#2177 = SmcCapability;

cap_list_nil$0 = SmcCapList;
cap_list_next$1 head:SmcCapability tail:SmcCapList = SmcCapList;

dns_smc_address#9fd3 smc_addr:MsgAddressInt flags:(## 8) { flags <= 1 }
  cap_list:flags . 0?SmcCapList = DNSRecord;
dns_next_resolver#ba93 resolver:MsgAddressInt = DNSRecord;
dns_adnl_address#ad01 adnl_addr:bits256 flags:(## 8) { flags <= 1 }
  proto_list:flags . 0?ProtoList = DNSRecord;
dns_storage_address#7473 bag_id:bits256 = DNSRecord;

_ (HashmapE 256 ^DNSRecord) = DNS_RecordSet;
```

# Drawbacks

None

# Rationale and alternatives

## Why domains are so expensive?
Without minimal price, it is possible to buy all 4-letters domains (26^4 = ~457000) for several tens of thousands TON. So, minimal price depends on the length of domain name. It is also worth noting that after a few months minimal price for all domains will decrease to 100 TON.

## Why DNS auction burns coins?
If we will not burn coins from DNS auctions, then, who we will need send money to?

## Why only ASCII domains are allowed?
If we support UTF-8, it would be possible to create domains which will look same, but still will be different domains (example.ton and ехаmрlе.ton).

## Why there is resolver for subdomains? 
It is possible to implement any logic for subdomains in custom resolver contract.

## Why domains are not bought forever?
There is a possibility that access to wallet which owns a domain will be lost, so domain will be lost forever. In TON DNS, it is required to prolong domains each year by sending at least 0.005 TON (minimal amount of TONs for message to be processed) to the contract.

# Prior art

1. [EIP-137](https://eips.ethereum.org/EIPS/eip-137)

# Unresolved questions

None

# Future possibilities

1. Implement private (encrypted) fields

# Changelog

* 20 Dec 2023 - deleted unused capabilities:
  
   ```
   cap_method_seqno#5371 = SmcCapability;
   cap_method_pubkey#71f4 = SmcCapability;
   cap_name#ff name:Text = SmcCapability;
   ```



================================================
FILE: text/0085-sbt-standard.md
================================================
- **TEP**: [85](https://github.com/ton-blockchain/TEPs/pull/85)
- **title**: SBT Contract
- **status**: Active
- **type**: Contract Interface
- **authors**: [Oleg Baranov](https://github.com/xssnick), [Narek Abovyan](https://github.com/Naltox), [Kirill Emelyanenko](https://github.com/EmelyanenkoK), [Oleg Andreev](https://github.com/oleganza)
- **created**: 09.08.2022
- **replaces**: -
- **replaced by**: -

# Summary

Soul bound token (SBT) is a special kind of NFT which can not be transferred. It includes optional certificate mechanics with revoke by authority and onchain ownership proofs. Holder can destroy his SBT in any time.

# Motivation

There is a useful type of token which allows to give social permissions/roles or certificates to some users. For example, it can be used by marketplaces to give discounts to owners of SBT, or by universities to give attestation certificates in SBT form. Mechanics with ownership proof allows to easily prove to any contract that you are an owner of some SBT.

# Specification

SBT implements [NFT standard interface](https://github.com/ton-blockchain/TIPs/issues/62) but `transfer` should always be rejected.

#### 1. `prove_ownership`

TL-B schema of inbound message:
```
prove_ownership#04ded148 query_id:uint64 dest:MsgAddress 
forward_payload:^Cell with_content:Bool = InternalMsgBody;
```
`query_id` -  arbitrary request number.

`dest` -  address of the contract to which the ownership of SBT should be proven.

`forward_payload` - arbitrary data required by target contract.

`with_content` - if true, SBT's content cell will be included in message to contract.

**Should be rejected if:**
* Sender address is not the owner's address.

**Otherwise should do:**
Send message with TL-B schema to `dest` contract:
```
ownership_proof#0524c7ae query_id:uint64 item_id:uint256 owner:MsgAddress 
data:^Cell revoked_at:uint64 content:(Maybe ^Cell) = InternalMsgBody;
```

`query_id` - request number passed in `prove_ownership`.

`item_id` -  id of NFT.

`owner` - current owner's address.

`data` - data cell passed in `prove_ownership`.

`revoked_at` - unix time when SBT was revoked, 0 if it was not.

`content` - NFT's content, it is passed if `with_content` was true in `prove_ownership`.

#### 2. `request_owner`

TL-B schema of inbound message:
```
request_owner#d0c3bfea query_id:uint64 dest:MsgAddress 
forward_payload:^Cell with_content:Bool = InternalMsgBody;
```
`query_id` -  arbitrary request number.

`dest` -  address of the contract to which the ownership of SBT should be proven.

`forward_payload` - arbitrary data required by target contract.

`with_content` - if true, SBT's content cell will be included in message to contract.

**Should do:**

Send message with TL-B schema to `dest` contract:
```
owner_info#0dd607e3 query_id:uint64 item_id:uint256 initiator:MsgAddress owner:MsgAddress 
data:^Cell revoked_at:uint64 content:(Maybe ^Cell) = InternalMsgBody;
```

`query_id` - request number passed in `prove_ownership`.

`item_id` -  id of NFT.

`initiator` - address of request initiator.

`owner` - current owner's address.

`data` - data cell passed in `prove_ownership`.

`revoked_at` - unix time when SBT was revoked, 0 if it was not.

`content` - SBT's content, it is passed if `with_content` was true in `request_owner`.

#### 3. `destroy`

TL-B schema of an internal message:
```
destroy#1f04537a query_id:uint64 = InternalMsgBody;
```
`query_id` -  arbitrary request number.

Should be rejected if:
* Sender address is not an owner's address.

Otherwise should do:
 * Set owner's address and authority to null.
 * Send message to sender with schema `excesses#d53276db query_id:uint64 = InternalMsgBody;` that will pass contract's balance amount.

#### 4. `revoke`

TL-B schema of inbound message:
```
revoke#6f89f5e3 query_id:uint64 = InternalMsgBody;
```
`query_id` -  arbitrary request number.

**Should be rejected if:**
* Sender address is not an authority's address.
* Was already revoked

**Otherwise should do:**
Set revoked_at to current unix time.

**GET methods**
1. `get_nft_data()` - same as in [NFT standard](https://github.com/ton-blockchain/TIPs/issues/62).
2. `get_authority_address()` - returns `slice`, that is authority's address. Authority can revoke SBT. 
**This method is mandatory for SBT, if there is no authority it should return addr_none (2 zero bits)**
3. `get_revoked_time()` - returns `int`, that is unix time of when it was revoked. It is 0 when not revoked.

### Implementation example
https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/sbt-item.fc

# Guide

#### Minting
It can be done using basic NFT collection, SBT should be an item. In mint message additionally authority address should be passed, [after content](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/sbt-item.fc#L90). 

Before mint, issuer is recommended to check the wallet code and confirm that it is standartized wallet and not some transferrable contract that can be sold to 3rd parties.

#### Proving you ownership to contracts
SBT contracts has a feature that let you implement interesting mechanics with contracts by proving ownership onchain. 

You can send message to SBT, and it will proxify message to target contract with its index, owner's address and initiator address in body, together with any useful for contract payload, 
this way target contract could know that you are owner of SBT which relates to expected collection. Contract could know that SBT relates to collection by calculating address of SBT using code and index, and comparing it with sender.

There are 2 methods which allow to use this functionality, **ownership proof** and **ownership info**. 
The difference is that proof can be called only by SBT owner, so it is preferred to use when you need to accept messages only from owner, for example votes in DAO.

##### Ownership proof
**SBT owner** can send message to SBT with this schema:
```
prove_ownership#04ded148 query_id:uint64 dest:MsgAddress 
forward_payload:^Cell with_content:Bool = InternalMsgBody;
```
After that SBT will send transfer to `dest` with scheme:
```
ownership_proof#0524c7ae query_id:uint64 item_id:uint256 owner:MsgAddress 
data:^Cell revoked_at:uint64 content:(Maybe ^Cell)
```

##### Ownership info
**anyone** can send message to SBT with this schema:
```
request_owner#d0c3bfea query_id:uint64 dest:MsgAddress 
forward_payload:^Cell with_content:Bool = InternalMsgBody;
```
After that SBT will send transfer to `dest` with scheme:
```
owner_info#0dd607e3 query_id:uint64 item_id:uint256 initiator:MsgAddress owner:MsgAddress 
data:^Cell revoked_at:uint64 content:(Maybe ^Cell)
```

#### Verify SBT contract example

```C
int op::ownership_proof() asm "0x0524c7ae PUSHINT";

int equal_slices (slice a, slice b) asm "SDEQ";

_ load_data() {
    slice ds = get_data().begin_parse();

    return (
        ds~load_msg_addr(),    ;; collection_addr
        ds~load_ref()          ;; sbt_code
    );
}

slice calculate_sbt_address(slice collection_addr, cell sbt_item_code, int wc, int index) {
  cell data = begin_cell().store_uint(index, 64).store_slice(collection_addr).end_cell();
  cell state_init = begin_cell().store_uint(0, 2).store_dict(sbt_item_code).store_dict(data).store_uint(0, 1).end_cell();

  return begin_cell().store_uint(4, 3)
                     .store_int(wc, 8)
                     .store_uint(cell_hash(state_init), 256)
                     .end_cell()
                     .begin_parse();
}


() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg) impure {
  slice cs = in_msg_full.begin_parse();
  int flags = cs~load_uint(4);

  slice sender_address = cs~load_msg_addr();

  int op = in_msg~load_uint(32);
  int query_id = in_msg~load_uint(64);

  if (op == op::ownership_proof()) {
    int id = in_msg~load_uint(256);

    (slice collection_addr, cell sbt_code) = load_data();
    throw_unless(403, equal_slices(sender_address, collection_addr.calculate_sbt_address(sbt_code, 0, id)));

    slice owner_addr = in_msg~load_msg_addr();
    cell payload = in_msg~load_ref();
    
    int revoked_at = in_msg~load_uint(64);
    throw_if(403, revoked_at > 0);
    
    int with_content = in_msg~load_uint(1);
    if (with_content != 0) {
        cell sbt_content = in_msg~load_ref();
    }
    
    ;;
    ;; sbt verified, do something
    ;;

    return ();
  }

  throw(0xffff);
}
```

# Rationale and alternatives

- **Why is this design the best in the space of possible designs?**

This design allows us to use SBT as certificates, with revoke and onchain proofs, and in the same time allows to make true SBT if authority in not set.

- **What other designs have been considered and what is the rationale for not choosing them?**

Initially, the design similar to ETH with address-bounded tokens was considered, but it was extended with usefull onchain proofs and revoke option.

- **What is the impact of not doing this?**

Currently, TON have no owner-bounded token standard, so it is a problem to issue tokens that cannot be transferred to 3rd parties. So, if we ignore this or any similar standard that introduces such mechanics, TON could miss some interesting and perspective products.

# Prior art

In ETH ([EIP-4973 ABT](https://eips.ethereum.org/EIPS/eip-4973)) - SBT was done as an NFT which could not be transferred between accounts at all. We did tha same but extended the logic with onchain proofs, and added authority which can revoke, so SBT can be used as fully functional certificate.
# Drawbacks

[EIP-4973 ABT](https://eips.ethereum.org/EIPS/eip-4973) has equip/unequip mechanics which allows to show/hide SBT temporarily. In current proposal we can only destroy SBT. Actually not sure that show/hide logic is needed for us. 

# Future possibilities

Standard looks finalized.



================================================
FILE: text/0089-jetton-wallet-discovery.md
================================================
- **TEP**: [89](https://github.com/ton-blockchain/TEPs/pull/89)
- **title**: Discoverable Jettons Wallets
- **status**: Active
- **type**: Contract Interface
- **authors**: [sasha1618](https://github.com/sasha1618), [EmelyanenkoK](https://github.com/EmelyanenkoK) 
- **created**: 08.09.2022 
- **replaces**: -
- **replaced by**: -

# Summary

This proposal suggest to extend standard Jetton master by adding mandatory onchain `provide_wallet_address` handler.

# Motivation

Some application may want to be able to discover their or other contract wallets for some specific Jetton Master. For instance some contract may want to obtain and store it's jetton wallet for some Jetton to handle transfer notifications from it in specific way.

# Guide

Upon receiving `provide_wallet_address` message with address in question, Jetton Master should response with message containing address.

# Specification

## New Jetton Master contracts
Example of discoverable jetton minter code can be found [here](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter-discoverable.fc)


Jetton Master should handle message

`provide_wallet_address#2c76b973 query_id:uint64 owner_address:MsgAddress include_address:Bool = InternalMsgBody;`

with TON amount higher than `5000 gas-units + msg_forward_prices.lump_price + msg_forward_prices.cell_price` = 0.0061 TON for current basechain settings (if amount is less than that it is not possible to send response) attached

and either throw an exception if amount of incoming value is not enough to calculate wallet address or
response with message (sent with mode 64)

`take_wallet_address#d1735400 query_id:uint64 wallet_address:MsgAddress owner_address:(Maybe ^MsgAddress) = InternalMsgBody;`

Note: if it is not possible to generate wallet address for address in question (for instance wrong workchain) `wallet_address` in `take_wallet_address` should be equal to `addr_none`. If `include_address` is set to `True`, `take_wallet_address` should include `owner_address` equal to `owner_address` in request (in other words response contains both owner address and associated jetton wallet address).

## Already existing Jetton Master contracts

Jettons with non-upgradable Jetton Master may spawn separate smart-contract (Jetton discovery) which implements this functionality. In this case pair of contracts (Jetton Master + Jetton Discovery) will behave the same way as new Jetton Master. For non-upgradable Jetton Master with updatable metadata it is recommended to add "wallet-discovery" key with value equal to text representaion of Jetton Discovery contract address.

## Scheme:
```
provide_wallet_address#2c76b973 query_id:uint64 owner_address:MsgAddress include_address:Bool = InternalMsgBody;
take_wallet_address#d1735400 query_id:uint64 wallet_address:MsgAddress owner_address:(Maybe ^MsgAddress) = InternalMsgBody;
```

```
crc32('provide_wallet_address query_id:uint64 owner_address:MsgAddress include_address:Bool = InternalMsgBody') = 2c76b973
crc32('take_wallet_address query_id:uint64 wallet_address:MsgAddress owner_address:Maybe ^MsgAddress = InternalMsgBody') = d1735400
```

# Drawbacks

If new applications start to heavily rely on these proposal without supporting separate Jetton Master/Jetton Discovery they may not be able to process already existing jettons.

# Rationale and alternatives

Currently it is expected that decentralised applications will work with specific wallets not with Jetton Masters. However sometimes it makes logic more complicated (especially if it is desired to create predictable contract addresses) or less straightforward for user-side checks.

# Prior art

-

# Unresolved questions

It is not possible to distinguish Jetton Discovery which consume higher than expected fee from non-Jetton Discovery contract.

# Future possibilities

-



================================================
FILE: text/0115-ton-connect.md
================================================
- **TEP**: [115](https://github.com/ton-blockchain/TEPs/blob/master/text/0115-ton-connect.md)
- **title**: TON Connect
- **status**: Active
- **type**: Core
- **authors**: @oleganza, @siandreev, subden, brainpicture, @sorokin0andrey, abogoslavskiy, @MariaBit, Olga May, Aleksei Mazelyuk, tonrostislav, KuznetsovNikita.
- **created**: 20.10.2022
- **replaces**: -
- **replaced by**: -

# Summary

TON Connect is a unified protocol for communication between TON wallets and TON apps.

# Motivation

The Open Network needs a **unified** protocol for communication between TON wallets and TON (d)apps to achieve following goals:

1. Any TON app (web / desktop / mobile / etc) can be operated by any wallet (mobile / desktop / web / browser extension / dapp browser / hardware / etc).


2. Users get a familiar and friendly experience across all TON apps.

# Guide

Apps provide the UI to an infinite range of functionality in TON based on smart contracts, but do not have immediate access to users’ funds. Therefore they are often called decentralized apps or “dapps”.

Wallets provide the UI to approving transactions and hold users’ cryptographic keys securely on their personal devices.

This separation of concerns enables rapid innovation and high level of security for the users: wallets do not need to build walled-garden ecosystems themselves, while the apps do not need to take the risk holding end users’ accounts.

TON Connect is a bridge that crosses this conceptual gap.

TON Connect, in addition to the transport layer of communication between the wallet and the app, provides methods of authorization, sending transactions to the network, interaction with smart contracts, etc.

# Specification

Docs and specs are in [https://github.com/ton-blockchain/ton-connect](https://github.com/ton-blockchain/ton-connect) repo.

At the time this PR was created (27 Feb, 2023) the revision was `acc5dd4d2106891cbfcade8d7faa58b9e16937fd`.

# Rationale and alternatives

## Unified way

Since we strive to make blockchain as convenient and user-friendly as possible, communication between any app and any wallet (mobile wallet or browser extension or something else) must work in a unified way.

This is convenient not only for users, but also for the developers of wallets and developers of dapps, which will need to support only one protocol.

Examples of other blockchains (e.g., Ethereum) that have failed to achieve a single network-wide standard show that this confuses users and makes it difficult for developers: both must understand the different types of wallets and connections.

## Sessions for rich dapps

The simplest "one-action" interaction between wallet and dapp can be done with a simple ton:// deeplink, in this variant in general it is not possible to get a response to the request or events in the runtime.

Since rich features are required for more sophisticated dapps, the TON Connect allows to establish permanent connections between the wallet and the application, get responses and events.

## SSE

TON Connect uses SSE ([Server-Sent Events](https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events)) protocol instead of websockets, because with websockets in practice there are many connectivity problems that do not have a guaranteed solution.

## Backend side

Interaction between wallet and dapp without a backend is possible only for dapp browser or browser extensions with a locally open dapp. 

If dapp and wallet are opened on different devices (for example the user opened app on desktop and wallet on mobile) an intermediary is needed for communication (relay or bridge).

Given the previous point about a unified protocol for all types of wallets in the general we need a backend intermediary in TON Connect.

TON Connect uses a simplest bridge for this. 

All messages that pass through bridge are encrypted with end-to-end encryption, which preserves the privacy of users.

Dapp browsers and browser extensions can use the JS bridge without the need to run a backend server, while the protocol remains consistent for all types of wallets.

## Common public bridge

TON Connect allows to run public bridge(s), which can use any wallets and dapps.

This option is suitable for quick implementation of TON Connect, but has several drawbacks: the public bridge can potentially get the IP addresses of wallet users, some wallets may want extra functionality of the bridge.

## Wallets can run and host own bridge

TON Connect allows wallets to run their own bridge if they don't want to use a public bridge.

Each wallet can maintain their own bridge server and are free to choose how to communicate with it.

## Dapps don't need to run bridge

In Ton Connect apps do not need to maintain their own backend to receive data from the wallets.

We believe that wallet developers have more possibilities for permanently hosting servers than dapp developers: many dapps are simple serverless web pages. Another argument is that there are many more dapps than wallets.

## Open, Free, Decentralized

The unified network-wide standard should be open-source and free.

It is important that it be decentralized, not to depend on a particular server, company or implementation.

As an example, any wallet or dapp should be able to work with this technology without someone else's centralized permission.

TON Connect satisfies these considerations.

We can give an example of the opposite concept of WalletConnect, where all wallets and apps must communicate through a single relay belonging to a particular organization. The possibility of running your own relay (bridge) in WalletConnect is in the plans.

## Wallet list

For the convenience of developers it makes sense to create a single config with a list of all the wallets and their info (eg, the bridge address).

Also, for the convenience of the user, UI can display wallets from this list, if the user does not yet have a wallet installed.

Such a list is located in the repository [https://github.com/ton-blockchain/wallets-list](https://github.com/ton-blockchain/wallets-list).

The rules for getting on this list should be simple - the correct technical implementation of TON Connect.

We note that the protocol itself does not depend on this list.

Despite some point of centralization and possible self-regulation issues, such a list would also contribute to the cross-linking and uniformity of the ecosystem.

# Future possibilities

Further development of TON Connect is expected in the addition of new RPC methods covering various functionalities.



================================================
FILE: text/0160-dispatch-queue.md
================================================
- **TEP**: [160](https://github.com/ton-blockchain/TEPs/pull/160)
- **title**: Dispatch Queue
- **status**: Implemented
- **type**: Core
- **created**: 13.06.2024
- **replaces**: -
- **replaced by**: -

# Summary
From user perspective TON functions as a multithreaded distributed operating system for decentralized applications (dApps). As any operation system TON implements scheduling mechanism for balancing resource consumption across multiple dApps. Previously this balancing was primarly based on sharding, that is moving resource-intensive processes to separate shard, however now we propose to add on top of sharding level balancing, additional introshard balancing, that will prevent a resource monopolization by single dApp that could lead to performance issues for other dApps on the same shard. In particular we propose to add additional intermediate queue between smart-contract and OutMsgQueue - the Dispatch Queue. This intermediate Queue will allow to schedule messages for processing in more distributed manner.

# Motivation

For now the only mechanism of load distribution is sharding: if some shard has too much load it may be divided to two sub-shards. While this indeed helps, there are limitations that sometimes make this mechanims not ideal on practice: finite (and relatively large) time of split/merge of shards, edgecases when load is unevenly distributed inside shard, split limit in network configuration (to make some other node mechanisms predictable) etc. This may affext user experience, in particular predictability and smoothness, since time of chain of transactions execution is dependent on other protocols simultaneously running in the network. The goal of this proposal to better distribute the load and prevent resource monopolization by single, instead providing more predictable execution time for all users and protocols.

# Guide

## Dispatch Queue
To balance load, we introduce an additional mechanism called the _Dispatch Queue_. When contract sends a message, it may either enter the Dispatch Queue (before the Collator moves some messages from the Dispatch Queue to the OutMsgQueue later on block collation) or directly enter OutMsgQueue. This intermediate step allows for a more even distribution of load among all dApps running in parallel.

The Dispatch Queue is organized as a set of outgoing message queues for each account. When the collator forwards messages to the OutMsgQueue, it maintains lt-order: a message from Account A with `lt1` will move to the OutMsgQueue before a message from Account A with `lt2` if `lt1 < lt2`. However, this order is not maintained for messages from different accounts. For example, a message from Account A with `lt1 > lt2` may be processed before a message from Account B with lt2 if there is a significant backlog of messages from Account B.

This logic is not new to TON; it previously operated at the inter-shard level: if Shard1 had a large number of incoming messages, it could fall behind in `lt` compared to Shard2, which would process all its messages without waiting for lt-parity with Shard1.

With the Dispatch Queue, we extend this behavior to the (virtual) AccountChain level, effectively unlocking fully parallel running of individual AccountChains inside ShardChains!

Another crucial rule is that the first message from a transaction (given there is no dispatching queue for the sending address) goes directly to the OutMsgQueue. This means contracts implementing a 1-message-in-1-message-out transaction logic avoid message dispatching.



# Specification

## TLB scheme changes:
Added
- `msg_envelope_v2` constructor for `MsgEnvelope` with `metadata` and `deferred_lt`
- `msg_metadata#0 depth:uint32 initiator_addr:MsgAddressInt initiator_lt:uint64 = MsgMetadata;`
- new `InMsg` and `OutMsg` constructors for messages that came in and out from DispatchQueue
- `dispatch_queue` field to `OutMsgQueueInfo` that effectively contains `mapping{Account->mapping{lt->Message}}` with augmentation that allows effecient message lt-ordering.

## Guarantees and Protocol Development Impact
If your protocol processes incoming messages without extensive transaction-graph branching, you will generally remain unaffected. However, if your protocol includes significant branching, some branches may be distributed over time to avoid interfering with other dApps operating within the same shard.

For example, in scenarios like `A-(m1)->B | A-(m2)->C | C-(m3)->B`, under low sharding, the process remains unchanged: `m1` will reach B earlier than `m3`. This holds because messages from A will always reach the OutMsgQueue of A's shard in lt order: first `m1`, then `m2`. And if shards A', B', and C' are neighbors, C's shard cannot process `m3` with lt strictly higher than `m1` first.

Currently, the TON network is configured so that all shards are neighbors. However, given the rapid user base growth, we must consider dapp protocol changes for a future with more than 16 shards, where a message from A to B may pass through an intermediate hop (see hypercube routing).

In such cases, each side of the triangle `A-(m1)->B | A-(m2)->C | C-(m3)->B` may include more edges: `A-(m1)->B` could become `A-(m1)->[Intermediate hop]-(m1)->B`, transforming the triangle into a polygon with less predictable order. If your protocol requires strict ordering, it can be achieved through an additional "synchronization" account S, as messages from S to B will be processed in the order they were sent from account S.

## Additional Features
With introduction of dispatch queue we additionally extend message envelopes (structures that wrap messages during routing in TON) to contain metadata such as the original transaction ID (in the form of `initiator_addr:MsgAddressInt initiator_lt:uint64`) and depth in the graph. This helps indexers manage very large transaction chains (sometimes called "traces").

# Drawbacks

1. This is significant and deep change of how node process messages that adds additional complexity.
2. This introduce some (but limited, and it may be limited further) way for collators to reorder and prioritize some messages, that open possibilities of MEV, which may be considered controversial.


# Rationale and alternatives

Despite being quite significant, Dispatch Queue actually doesn't affect behavior of all other parts of the system, because validators continue to import messages from OutMsgQueue the same way, sharding works the same way etc.

Among alternatives we considered message postponement inside OutMsgQueue which, howver, requres more significant changes on sharding/collation levels and also has less flexibility.

# Future possibilities

Dispatching rules, the rules of in which order messages from Dispatch QUeue goes to OutMsgQueue, maybe developed further to better suit practcal needs. This changes won't require consensus. Some additional fields in the metadata were added to give collator more context during dispatching (it probably won't be used in the first implementation). Besides it is possible that in the future som of metadata, in particular `initiator_addr` may be done accessible to TVM runtime.


