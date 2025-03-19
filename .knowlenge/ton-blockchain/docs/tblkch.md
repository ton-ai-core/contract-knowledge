# Telegram Open Network Blockchain

Nikolai Durov

February 8, 2020

```
Abstract
The aim of this text is to provide a detailed description of the
Telegram Open Network (TON) Blockchain.
```
## Introduction

This document provides a detailed description of the TON Blockchain, in-
cluding its precise block format, validity conditions, TON Virtual Machine
(TVM) invocation details, smart-contract creation process, and cryptographic
signatures. In this respect it is a continuation of the TON whitepaper (cf. [3]),
so we freely use the terminology introduced in that document.
Chapter 1 provides a general overview of the TON Blockchain and its de-
sign principles, with particular attention to the introduction of compatibility
and validity conditions and the implementation of message delivery guaran-
tees. More detailed information, such as the TL-B schemes that describe the
serialization of all required data structures into trees or collections (“bags”)
of cells, is provided in subsequent chapters, culminating in a complete de-
scription of the TON Blockchain (shardchain and masterchain) block layout
in Chapter 5.
A detailed description of the elliptic curve cryptography used for signing
blocks and messages, also accessible through TVM primitives, is provided in
AppendixA. TVM itself is described in a separate document (cf. [4]).
Some subjects have intentionally been left out of this document. One is
the Byzantine Fault Tolerant (BFT) protocol used by the validators to deter-
mine the next block of the masterchain or a shardchain; that subject is left
for a forthcoming document dedicated to the TON Network. And although


```
Introduction
```
this document describes the precise format of TON Blockchain blocks, and
discusses the blockchain’s validity conditions and serialized invalidity proofs,^1
it provides no details about the network protocols used to propagate these
blocks, block candidates, collated blocks, and invalidity proofs.
Similarly, this document does not provide the complete source code of
the masterchain smart contracts used to elect the validators, change the con-
figurable parameters or get their current values, or punish the validators
for their misbehavior, even though these smart contracts form an important
part of the total blockchain state and of the masterchain block zero. Instead,
this document describes the location of these smart contracts and their for-
mal interfaces.^2 The source code of these smart contracts will be provided
separately as downloadable files with comments.
Please note that the current version of this document describes a pre-
liminary test version of the TON Blockchain; some minor details are likely
to change prior to launch during the development, testing, and deployment
phases.

(^1) As of August 2018, this document does not include a detailed description of serialized
invalidity proofs, because they are likely to change significantly during the development of
the validator software. Only the general design principles for consistency conditions and
serialized invalidity proofs are discussed.
(^2) This is not included in the present version of this document, but will be provided in
a separate appendix to a future revision.


## Introduction

- 1 Overview Contents
   - 1.1 Everything is a bag of cells
   - 1.2 Principal components of a block and the blockchain state
   - 1.3 Consistency conditions
   - 1.4 Logical time and logical time intervals
   - 1.5 Total blockchain state
   - 1.6 Configurable parameters and smart contracts
   - 1.7 New smart contracts and their addresses
   - 1.8 Modification and removal of smart contracts
- 2 Message forwarding and delivery guarantees
   - 2.1 Message addresses and next-hop computation
   - 2.2 Hypercube Routing protocol
   - 2.3 Instant Hypercube Routing and combined delivery guarantees
- 3 Messages, message descriptors, and queues
   - 3.1 Address, currency, and message layout
   - 3.2 Inbound message descriptors
   - 3.3 Outbound message queue and descriptors
- 4 Accounts and transactions
   - 4.1 Accounts and their states
   - 4.2 Transactions
   - 4.3 Transaction descriptions
   - 4.4 Invoking smart contracts in TVM
- 5 Block layout
   - 5.1 Shardchain block layout
   - 5.2 Masterchain block layout
   - 5.3 Serialization of a bag of cells
- A Elliptic curve cryptography
   - A.1 Elliptic curves
   - A.2 Curve25519 cryptography
   - A.3 Ed25519 cryptography


### 1.1 Everything is a bag of cells

## 1 Overview Contents

This chapter provides an overview of the main features and design principles
of the TON Blockchain. More detail on each topic is provided in subsequent
chapters.

1.1 Everything is a bag of cells

All data in the blocks and state of the TON Blockchain is represented as a
collection ofcells(cf. [3, 2.5]). Therefore, this chapter begins with a general
discussion of cells.

1.1.1. TVM cells. Recall that the TON Blockchain, as well as the TON
Virtual Machine (TVM; cf. [4]), represents all permanently stored data as a
collectionorbagof so-calledcells. Each cell consists of up to 1023 data bits
and up to four references to other cells. Cyclic cell references are not allowed,
so the cells are usually organized intotrees of cells, or ratherdirected acyclic
graphs (DAGs) of cells.^3 Any value of an abstract algebraic (dependent) data
type may be represented (serialized) as a tree of cells. The precise way of
representing values of an abstract data type as a tree of cells is expressed by
means of aTL-B scheme.^4 A more thorough discussion of different kinds of
cells may be found in [4, 3.1].

1.1.2. Application to TON Blockchain blocks and state.The above is
particularly applicable to the blocks and state of the TON Blockchain, which
also are values of certain (quite convoluted) dependent algebraic data types.
Therefore, they are serialized according to various TL-B schemes (which are
gradually presented throughout this document), and are represented as a
collection or bag of cells.

1.1.3. The layout of a single cell. Each single cell consists of up to
1023 data bits and up to four references to other cells. When a cell is kept
in memory, its exact representation is implementation-dependent. However,

(^3) Completely identical cells are often identified in memory and in disk storage; this is
the reason why trees of cells are transparently transformed into DAGs of cells. From this
perspective, a DAG is just a storage optimization of the underlying tree of cells, irrelevant
for most considerations.
(^4) Cf. [4, 3.3.3–4], where an example is given and explained, pending a more complete
reference


```
1.1. Everything is a bag of cells
```
there is a standard representation of cells, useful, for instance, for serializing
cells for file storage or network transmission. This “standard representation”
or “standard layout”CellRepr(c)of a cellcconsists of the following:

- Twodescriptor bytescome first, sometimes denoted byd 1 andd 2. The
    first of these bytesd 1 equals (in the simplest case) the number of refer-
    ences 0 ≤r≤ 4 in the cell. The second descriptor byted 2 encodes the
    bit lengthlof the data part of the cell as follows: the first seven bits of
    d 2 equalbl/ 8 c, the number of complete data bytes present in the cell,
    while the last bit ofd 2 is thecompletion tag, equal to one ifl is not
    divisible by eight. Therefore,

```
d 2 = 2bl/ 8 c+ [lmod 8 6 = 0] =bl/ 8 c+dl/ 8 e (1)
```
```
where[A]equals one when conditionAis true, and zero otherwise.
```
- Next,dl/ 8 edata bytes follow. This means that theldata bits of the
    cell are split into groups of eight, and each group is interpreted as a
    big-endian 8-bit integer and stored into a byte. Iflis not divisible by
    eight, a single binary one and a suitable number of binary zeroes (up
    to six) are appended to the data bits, and the completion tag (the least
    significant bit of the descriptor byted 2 ) is set.
- Finally,r references to other cells follow. Each reference is normally
    represented by 32 bytes containing thesha256hash of the referenced
    cell, computed as explained below in1.1.4.

In this way, the standard representationCellRepr(c)of a cellcwithldata
bits andrreferences is2 +bl/ 8 c+dl/ 8 e+ 32rbytes long.

1.1.4. Thesha256hash of a cell. Thesha256hash of a cellcis recur-
sively defined as thesha256of the standard representationCellRepr(c)
of the cell in question:

```
Hash(c) :=sha256(c) :=sha
```
#### (

```
CellRepr(c)
```
#### )

#### (2)

Because cyclic cell references are not allowed (the relationships among all
cells must constitute a directed acyclic graph, or DAG), thesha256hash of
a cell is always well-defined.
Furthermore, becausesha256is tacitly assumed to be collision-resistant,
we assume that all the cells that we encounter are completely determined


```
1.1. Everything is a bag of cells
```
by their hashes. In particular, the cell references of a cellcare completely
determined by the hashes of the referenced cells, contained in the standard
representationCellRepr(c).

1.1.5. Exotic cells. Apart from theordinarycells (also calledsimple or
datacells) considered so far, cells of other types, calledexotic cells, some-
times appear in the actual representations of TON Blockchain blocks and
other data structures. Their representation is somewhat different; they are
distinguished by having the first descriptor byted 1 ≥ 5 (cf. [4, 3.1]).

1.1.6. External reference cells. (External) reference cells, which contain
the 32-bytesha256(c)of a “true” data cellcinstead of the data cell itself,
are one example of exotic cells. These cells can be used in the serialization
of a bag of cells corresponding to a TON Blockchain block in order to refer
to data cells absent in the serialization of the block itself, but assumed to be
present somewhere else (e.g., in the previous state of the blockchain).

1.1.7. Transparency of reference cells with respect to most oper-
ations. Most cell operations do not observe any reference cells or other
“exotic” kinds of cells; they see only data cells, with any reference cell trans-
parently replaced by the cell referred to. For example, when thetransparent
cell hashHash[(c)is recursively computed, the hash of a reference cell is set
to be equal to the hash of the cell referred to, not the hash of the standard
representation of the reference cell.

1.1.8. Transparent hash and representation hash of a cell. In this
way,sha256[(c) =Hash[(c)is thetransparent hashof a cellc(or the tree
of cells rooted inc).
However, sometimes we need to reason about the exact representation of
a tree of cells present in a block. To this end, arepresentation hashHash](c)
is defined, which is not transparent with respect to reference cells and other
exotic types of cells. We often say that the representation hash ofcis “the”
hash ofc, because it is the most frequently used hash of a cell.

1.1.9. Use of representation hashes for signatures.Signatures are an
excellent example of the application of representation hashes. For instance:

- Validators sign the representation hash of a block, not just its trans-
    parent hash, because they need to certify that the block does contain
    the required data, not just some external references to them.


### 1.2 Principal components of a block and the blockchain state

- When external messages are signed and sent by off-chain parties (e.g.,
    human clients using an application to initiate blockchain transactions),
    if external references may be present in some of these messages, it is
    the representation hashes of the messages that must be signed.

1.1.10. Higher hashes of a cell.In addition to the transparent and repre-
sentation hashes of a cellc, a sequence ofhigher hashesHashi(c),i= 1, 2 ,...
may be defined, which eventually stabilizes atHash∞(c). (More detail may
be found in [4, 3.1].)

1.2 Principal components of a block and the blockchain

state

This section briefly describes the principal components of a block and of the
blockchain state, without delving too much into the details.

1.2.1. The Infinite Sharding Paradigm (ISP) applied to blockchain
block and state. Recall that according to the Infinite Sharding Paradigm,
each account can be considered as lying in its separate “accountchain”, and
the (virtual) blocks of these accountchains are then grouped into shardchain
blocks for efficiency purposes. Specifically, the state of a shardchain consists,
roughly speaking, of the states of all its “accountchains” (i.e., of all accounts
assigned to it); similarly, a block of a shardchain essentially consists of a
collection of virtual “blocks” for some accounts assigned to the shardchain.^5
We can summarize this as follows:

```
ShardState≈Hashmap(n,AccountState) (3)
ShardBlock≈Hashmap(n,AccountBlock) (4)
```
wherenis the bit length of theaccount_id, andHashmap(n,X)describes a
partial map 2 n99KXfrom bitstrings of lengthninto values of typeX.
Recall that each shardchain—or, more precisely, each shardchain block^6 —
corresponds to all accountchains that belong to the same “workchain” (i.e.,
have the sameworkchain_id=w) and have anaccount_idbeginning with

(^5) If there are no transactions related to an account, the corresponding virtual block is
empty and is omitted in the shardchain block
(^6) Recall that TON Blockchain supportsdynamicsharding, so the shard configuration
may change from block to block because of shard merge and split events. Therefore, we
cannot simply say that each shardchain corresponds to a fixed set of accountchains.


```
1.2. Principal components of a block and the blockchain state
```
the same binary prefixs, so that(w,s)completely determines a shard. There-
fore, the above hashmaps must contain only keys beginning with prefixs.
We will see in a moment that the above description is only an approx-
imation: the state and block of the shardchain need to contain some extra
data that are not split according to theaccount_idas suggested by (3).

1.2.2. Split and non-split part of the shardchain block and state.A
shardchain block and its state may each be classified into two distinct parts.
The parts with the ISP-dictated form of (3) will be called thesplit parts of
the block and its state, while the remainder will be called thenon-splitparts.

1.2.3. Interaction with other blocks and the outside world. Global
and local consistency conditions.The non-split parts of the shardchain
block and its state are mostly related to the interaction of this block with
some other “neighboring” blocks. The global consistency conditions of the
blockchain as a whole are reduced to internal consistency conditions of sep-
arate blocks by themselves as well as external local consistency conditions
between certain blocks (cf.1.3).
Most of these local consistency conditions are related to message for-
warding between different shardchains, transactions involving more than one
shardchain, and message delivery guarantees. However, another group of
local consistency conditions relates a block with its immediate antecessors
and successors inside a shardchain; for instance, the initial state of a block
usually must coincide with the final state of its immediate antecessor.^7

1.2.4. Inbound and outbound messages of a block.The most impor-
tant components of the non-split part of a shardchain block are the following:

- InMsgDescr — The description of all messages “imported” into this
    block (i.e., either processed by a transaction included in the block, or
    forwarded to an output queue, in the case of a transit message travelling
    along the path dictated by Hypercube Routing).
- OutMsgDescr— The description of all messages “exported” or “gen-
    erated” by the block (i.e., either messages generated by a transaction
    included in the block, or transit messages with destination not belong-
    ing to the current shardchain, forwarded fromInMsgDescr).

(^7) This condition applies if there is exactly one immediate antecessor (i.e., if a shardchain
merge event did not occur immediately before the block in question); otherwise, this
condition becomes more convoluted.


```
1.2. Principal components of a block and the blockchain state
```
1.2.5. Block header. Another non-split component of a shardchain block
is theblock header, which contains general information such as(w,s)(i.e.,
theworkchain_idand the common binary prefix of allaccount_ids assigned
to the current shardchain), the block’ssequence number(defined to be the
smallest non-negative integer larger than the sequence numbers of its prede-
cessors),logical time, andgeneration unixtime. It also contains the hash of
the immediate antecessor of the block (or of its two immediate antecessors
in the case of a preceding shardchain merge event), the hashes of its initial
and final states (i.e., of the states of the shardchain immediately before and
immediately after processing the current block), and the hash of the most
recent masterchain block known when the shardchain block was generated.

1.2.6. Validator signatures, signed and unsigned blocks. The block
described so far is anunsigned block; it is generated in its entirety and con-
sidered as a whole by the validators. When the validators ultimately sign
it, thesigned blockis created, consisting of the unsigned block along with a
list of validator signatures (of a certain representation hash of the unsigned
block, cf.1.1.9). This list of signatures is also a non-split component of
the (signed) block; however, since it lies outside the unsigned block, it is
somewhat different from the other data kept in a block.

1.2.7. Outbound message queue of a shardchain. Similarly, the most
important non-split part of the shardchain state isOutMsgQueue, the out-
bound message queue. It containsundeliveredmessages included intoOutMs-
gDescr, either by the last shardchain block leading to this state or by one of
its antecessors.
Originally, each outbound message is included intoOutMsgQueue; it is
removed from the queue only after it has either been included into theInMs-
gDescrof a block of a “neighboring” shardchain (the next one with respect
to Hypercube Routing), or has been delivered to (i.e., has appeared in the
InMsgDescr of) its ultimate destination shardchain via Instant Hypercube
Routing. In both cases, thereason for the removal of a message from the
OutMsgQueue is made explicit in theOutMsgDescr of the block in which
such a state transformation has occurred.

1.2.8. Layout ofInMsgDescr,OutMsgDescrandOutMsgQueue.All
of the most important non-split shardchain data structures related to mes-
sages are organized ashashmapsordictionaries(implemented by means of
Patricia trees serialized into a tree of cells as described in [4, 3.3]), with the


```
1.2. Principal components of a block and the blockchain state
```
following keys:

- The inbound message descriptionInMsgDescruses the 256-bit message
    hash as a key.
- The outbound message descriptionOutMsgDescruses the 256-bit mes-
    sage hash as a key.
- The outbound message queueOutMsgQueueuses the 352-bit concate-
    nation of the 32-bit destinationworkchain_id, the first 64 bits of des-
    tination addressaccount_id, and the 256-bit message hash as a key.

1.2.9. The split part of the block: transaction chains.The split part
of a shardchain block consists of a hashmap mapping some of the accounts
assigned to the shardchain to “virtual accountchain blocks” AccountBlock,
cf. (3). Such a virtual accountchain block consists of a sequential list of
transactionsrelated to that account.

1.2.10. Transaction description. Each transaction is described in the
block by an instance of theTransactiontype, which contains in particular
the following information:

- A reference to exactly oneinbound message(which must be present in
    InMsgDescras well) that has beenprocessedby the transaction.
- References to several (maybe zero)outbound messages (also present
    inOutMsgDescrand most likely included inOutMsgQueue) that have
    beengeneratedby the transaction.
The transaction consists of an invocation of TVM (cf. [4]) with the code
of the smart contract corresponding to the account in question loaded into
the virtual machine, and with the data root cell of the smart contract loaded
into the virtual machine’s registerc4. The inbound message itself is passed in
the stack as an argument to the smart contract’smain()function, along with
some other important data, such as the amount of TON Grams and other
defined currencies attached to the message, the sender account address, the
current balance of the smart contract, and so on.
In addition to the information listed above, aTransactioninstance also
contains the original and final states of the account (i.e., of the smart con-
tract), as well as some of the TVM running statistics (gas consumed, gas
price, instructions performed, cells created/destroyed, virtual machine ter-
mination code, etc.).


```
1.2. Principal components of a block and the blockchain state
```
1.2.11. The split part of the shardchain state: account states. Re-
call that, according to (3), the split part of the shardchain state consists
of a hashmap mapping each “defined” account identifier (belonging to the
shardchain in question) to thestateof the corresponding account, given by
an instance of theAccountStatetype.

1.2.12. Account state.The account state itself approximately consists of
the following data:

- Itsbalancein Grams and (optionally) in some other defined cryptocur-
    rencies/tokens.
- Thesmart-contract code, or the hash of the smart-contract code if it
    will be provided (uploaded) later by a separate message.
- The persistentsmart-contract data, which can be empty for simple
    smart contracts. It is a tree of cells, the root of which is loaded into
    registerc4during smart-contract execution.
- Its storage usage statistics, including the number of cells and bytes
    kept in the persistent storage of the smart contract (i.e., inside the
    blockchain state) and the last time a storage usage payment was exacted
    from this account.
- An optionalformal interface description(intended for smart contracts)
    and/oruser public information(intended mostly for human users and
    organizations).

Notice that there is no distinction between “smart contract” and “account”
in the TON Blockchain. Instead, “simple” or “wallet” accounts, typically
employed by human users and their cryptocurrency wallet applications for
simple cryptocurrency transfers, are just simple smart contracts with stan-
dard (shared) code and with persistent data consisting of the public key of
the wallet (or several public keys in the case of a multi-signature wallet;
cf.1.7.6for more detail).

1.2.13. Masterchain blocks. In addition to shardchain blocks and their
states, the TON Blockchain containsmasterchain blocksand themasterchain
state (also called theglobal state). The masterchain blocks and state are
quite similar to the shardchain blocks and state considered so far, with some
notable differences:


### 1.3 Consistency conditions

- The masterchain cannot be split or merged, so a masterchain block
    usually has exactly one immediate antecessor. The sole exception is the
    “masterchain block zero”, distinguished by having a sequence number
    equal to zero; it has no antecessors at all, and contains the initial
    configuration of the whole TON Blockchain (e.g., the original set of
    validators).
- The masterchain blocks contain another important non-split structure:
    ShardHashes, a binary tree with a list of all defined shardchains along
    with the hashes of the latest block inside each of the listed shardchains.
    It is the inclusion of a shardchain block into this structure that makes
    a shardchain block “canonical”, and enables other shardchains’ blocks
    to refer to data (e.g., outbound messages) contained in the shardchain
    block.
- The state of the masterchain contains global configuration parameters
    of the whole TON Blockchain, such as the minimum and maximum
    gas prices, the supported versions of TVM, the minimum stake for the
    validator candidates, the list of alternative cryptocurrencies supported
    in addition to Grams, the total amount of Grams issued so far, and
    the current set of validators responsible for creating and signing new
    blocks, along with their public keys.
- The state of the masterchain also contains the code of the smart con-
    tracts used to elect the subsequent sets of validators and to modify
    the global configuration parameters. The code of these smart contracts
    itself is a part of the global configuration parameters and can be mod-
    ified accordingly. In this respect, this code (along with the current
    values of these parameters) functions like a “constitution” for the TON
    Blockchain. It is initially established in masterchain block zero.
- There are no transit messages through the masterchain: each inbound
    message must have a destination inside the masterchain, and each out-
    bound message must have a source inside the masterchain.

1.3 Consistency conditions

In addition to the data structures contained in the block and in the blockchain
state, which are serialized into bags of cells according to certain TL-B schemes


```
1.3. Consistency conditions
```
explained in detail later (cf. Chapters 3 – 5 ), an important component of the
blockchain layout is theconsistency conditionsbetween data kept inside one
or in different blocks (as mentioned in1.2.3). This section describes in detail
the function of consistency conditions in the blockchain.

1.3.1. Expressing consistency conditions.In principle, dependent data
types (such as those used in TL-B) could be used not only to describe the
serialization of block data, but also to express conditions imposed on the
components of such data types. (For instance, one could define data type
OrderedIntPair, with pairs of integers (x,y), such thatx < y, as values.)
However, TL-B currently is not expressive enough to encode all the consis-
tency conditions we need, so we opt for a semi-formalized approach in this
text. In the future, we may present a subsequent complete formalization in
a suitable proof assistant such as Coq.

1.3.2. Importance of consistency conditions. The consistency condi-
tions ultimately are at least as important as the “unrestricted” data struc-
tures on which they are imposed, especially in the blockchain context. For
instance, the consistency conditions ensure that the state of an account does
not change between blocks, and that it can change within a block only as
a result of a transaction. In this way, the consistency conditions ensure
the safe storage of cryptocurrency balances and other information inside the
blockchain.

1.3.3. Kinds of consistency conditions.There are several kinds of con-
sistency conditions imposed on the TON Blockchain:

- Global conditions— Express the invariants throughout the entire TON
    Blockchain. For instance, themessage delivery guarantees, which as-
    sert that each message generated must be delivered to its destination
    account and delivered exactly once, are part of the global conditions.
- Internal (local) conditions — Express the conditions imposed on the
    data kept inside one block. For example, each transaction included in
    the block (i.e., present in the transaction list of some account) processes
    exactly one inbound message; this inbound message must be listed in
    theInMsgDescrstructure of the block as well.
- External (local) conditions— Express the conditions imposed on the
    data of different blocks, usually belonging to the same or to neighbor-


```
1.3. Consistency conditions
```
```
ing shardchains (with respect to Hypercube Routing). Therefore, the
external conditions come in several flavors:
```
- Antecessor/successor conditions— Express the conditions imposed
    on the data of some block and of its immediate antecessor or (in
    the case of a preceding shardchain merge event) two immediate
    antecessors. The most important of these conditions is the one
    stating that the initial state for a shardchain block must coincide
    with final shardchain state of the immediate antecessor block, pro-
    vided no shardchain split/merge event happened in between.
- Masterchain/shardchain conditions— Express the conditions im-
    posed on a shardchain block and on the masterchain block that
    refers to it in itsShardHasheslist or is referred to in the header
    of the shardchain block.
- Neighbor (block) conditions— Express the relations between the
    blocks of neighboring shardchains with respect to Hypercube Rout-
    ing. The most important of these conditions express the relation
    between theInMsgDescrof a block and theOutMsgQueueof the
    state of a neighboring block.

1.3.4. Decomposition of global and local conditions into simpler
local conditions. Theglobal consistency conditions, such as the message
delivery guarantees, are truly necessary for the blockchain to work properly;
however, they are hard to enforce and verify directly. Therefore, we instead
introduce a lot of simplerlocal consistency conditions, which are easier to
enforce and verify since they involve only one block, or perhaps two adjacent
blocks. These local conditions are chosen in such a fashion that the desired
global conditions are logical consequences of (the conjunction of) all the
local conditions. In this respect, we say that the global conditions have been
“decomposed” into simpler local conditions.
Sometimes a local condition still turns out to be too cumbersome to
enforce or verify. In that case it is decomposed further, into even simpler
local conditions.

1.3.5. Decomposition may require additional data structures and
additional internal consistency conditions. The decomposition of a
condition into simpler local consistency conditions sometimes requires the
introduction of additional data structures. For example, theInMsgDescr


```
1.3. Consistency conditions
```
explicitly lists all inbound messages processed in a block, even if this list
might have been obtained by scanning the list of all the transactions present
in the block. However,InMsgDescrgreatly simplifies the neighbor conditions
related to message forwarding and routing, which ultimately add up to the
global message delivery guarantees.
Notice that the introduction of such additional data structures is a sort
of “database denormalization” (i.e., it leads to some redundancy, or to some
data being present more than once), and therefore more internal consistency
conditions need to be imposed (e.g., if some data are now present in two
copies, we must require that these two copies coincide). For instance, once we
introduceInMsgDescrto facilitate message forwarding between shardchains,
we need to introduce internal consistency conditions relatingInMsgDescrto
the transaction list of the same block.

1.3.6. Correct serialization conditions.Apart from the high-level inter-
nal consistency conditions, which treat the contents of a block as a value of
an abstract data type, there are some lower-level internal consistency con-
ditions, called “(correct) serialization conditions”, which ensure that the tree
of cells present in the block is indeed a valid serialization of a value of the
expected abstract data type. Such serialization conditions can be automati-
cally generated from the TL-B scheme describing the abstract data type and
its serialization into a tree of cells.
Notice that the serialization conditions are a set of mutually recursive
predicates on cells or cell slices. For example, if a value of typeAconsists
of a 32-bit magic numbermA, a 64-bit integerl, and two references to cells
containing values of typesBandC, respectively, then the correct serialization
condition for values of typeAwill require a cell or a cell slice to contain
exactly 96 data bits and two cell referencesr 1 andr 2 , with the additional
requirements that the first 32 data bits containmA, and the two cells referred
to byr 1 andr 2 satisfy the serialization conditions for values of typesBandC,
respectively.

1.3.7. Constructive elimination of existence quantifiers. The local
conditions one might want to impose sometimes arenon-constructible, mean-
ing that they do not necessarily contain an explanation of why they are true.
A typical example of such a conditionCis given by

```
C:≡∀(x:X)∃(y:Y)A(x,y) , (5)
```

```
1.3. Consistency conditions
```
“for anyxfromX, there is ayfromY such that conditionA(x,y)holds”.
Even if we knowC to be true, we do not have a way of quickly finding a
y:Y, such thatA(x,y), for a givenx:X. As a consequence, the verification
ofCmay be quite time-consuming.
In order to simplify the verification of local conditions, they are made
constructible(i.e., verifiable in bounded time) by adding somewitnessdata
structures. For instance, conditionC of (5) may be transformed by adding
a new data structuref:X→Y (a mapffromXtoY) and imposing the
following conditionC′instead:

```
C′:≡∀(x:X)A
```
#### (

```
x,f(x)
```
#### )

#### . (6)

Of course, the “witness” valuef(x) :Y may be included inside the (modified)
data typeXinstead of being kept in a separate tablef.

1.3.8. Example: consistency condition forInMsgDescr.For instance,
the consistency condition betweenX:=InMsgDescr, the list of all inbound
messages processed in a block, andY :=Transactions, the list of all trans-
actions present in a block, is of the above sort: “For any input messagex
present inInMsgDescr, a transactionymust be present in the block such that
yprocessesx”.^8 The procedure of∃-elimination described in1.3.7leads us
to introduce an additional field in the inbound message descriptors ofIn-
MsgDescr, containing a reference to the transaction in which the message is
actually processed.

1.3.9. Constructive elimination of logical disjunctions. Similarly to
the transformation described in1.3.7, condition

```
D:≡∀(x:X)
```
#### (

```
A 1 (x)∨A 2 (x)
```
#### )

#### , (7)

“for allxfromX, at least one ofA 1 (x)andA 2 (x)holds”, may be transformed
into a functioni:X→ 2 ={ 1 , 2 }and a new condition

```
D′:≡∀(x:X)Ai(x)(x) (8)
```
This is a special case of the existential quantifier elimination considered be-
fore forY= 2 ={ 1 , 2 }. It may be useful whenA 1 (x)andA 2 (x)are compli-
cated conditions that cannot be verified quickly, so that it is useful to know
in advance which of them is in fact true.

(^8) This example is a bit simplified since it does not take into account the presence of
transit messages inInMsgDescr, which are not processed by any explicit transaction.


```
1.3. Consistency conditions
```
For instance,InMsgDescr, as considered in1.3.8, can contain both mes-
sages processed in the block and transit messages. We might introduce a field
in the inbound message description to indicate whether the message is tran-
sit or not, and, in the latter case, include a witness field for the transaction
processing the message.

1.3.10. Constructivization of conditions.This process of eliminating the
non-constructible logical binders∃(existence quantifier) and (sometimes)∨
(logical disjunction) by introducing additional data structures and fields—
that is, the process of making a condition constructible—will be calledcon-
structivization. If taken to its theoretical limit, this process leads to logical
formulas containing only universal quantifiers and logical conjunctions, at
the expense of adding some witness fields into certain data structures.

1.3.11. Validity conditions for a block. Ultimately, all of the internal
conditions for a block, along with the local antecessor and neighbor conditions
involving this block and another previously generated block, constitute the
validity conditionsfor a shardchain or masterchain block. A block isvalid
if it satisfies the validity conditions. It is the responsibility of validators to
generate valid blocks, as well as check the validity of blocks generated by
other validators.

1.3.12. Witnesses of the invalidity of a block.If a block does not satisfy
all of the validity conditionsC 1 ,... ,Cn(i.e., the conjunctionV :≡

#### ∧

iCiof
the validity conditions), it isinvalid. This means that it satisfies the “invalid-
ity condition”¬V =

#### ∨

i¬Ci. If all of theCi—and hence, alsoV—have been
“constructivized” in the sense described in1.3.10, so that they contain only
logical conjunctions and universal quantifiers (and simple atomic proposi-
tions), then¬V contains only logical disjunctions and existential quantifiers.
Then a constructivization of¬V may be defined, which would involve an
invalidity witness, starting with an indexiof the specific validity condition
Ciwhich fails.
Such invalidity witnesses may also be serialized and presented to other
validators or committed into the masterchain to prove that a specific block
or block candidate is in fact invalid. Therefore, the construction and serial-
ization of invalidity witnesses is an important part of a Proof-of-Stake (PoS)
blockchain design.^9

(^9) It is interesting to note that this part of the work can be done almost automatically.


```
1.3. Consistency conditions
```
1.3.13. Minimizing the size of witnesses. An important consideration
for the design of the local conditions, their decomposition into simpler condi-
tions, and their constructivization is to make the verification of each condition
as simple as possible. However, another requirement is that we should min-
imize the size of witnesses both for a condition (so that block size does not
grow too much during the constructivization process) and for its negation
(so that the invalidity proofs have bounded size, which simplifies their verifi-
cation, transmission, and inclusion into the masterchain). These two design
principles are sometimes at odds, and a compromise must be then sought.

1.3.14. Minimizing the size of Merkle proofs. The consistency condi-
tions are originally intended to be processed by a party who already has all
the relevant data (e.g., all the blocks mentioned in the condition). On some
occasions, however, they must be verified by a party who does not have all
the blocks in question, but knows only their hashes. For example, suppose
that a block invalidity proof were augmented by the signature of a validator
that had signed an invalid block (and therefore would have to be punished).
In this case, the signature would contain only the hash of the wrongly signed
block; the block itself would have to be recovered from a different place before
verifying the block invalidity proof.
A compromise between providing only the hash of the supposedly invalid
block and providing the entire invalid block along with the invalidity witness
is to augment the invalidity witness by a Merkle proof starting from the hash
of the block (i.e., of the root cell of the block). Such a proof would include
all the cells referred to in the invalidity witness, along with all the cells on
the paths from these cells to the root cells and the hashes of their siblings.
Then an invalidity proof becomes self-contained enough to provide sufficient
justification on its own for punishing a validator. For example, the invalidity
proof suggested above might be presented to a smart contract residing in the
masterchain that punishes the validators for incorrect behavior.
Since such an invalidity proof must be augmented by a Merkle proof, it
makes sense to write the consistency conditions so that the Merkle proofs for
their negations would be as small as possible. In particular, each individual
condition must be as “local” as possible (i.e., involve a minimal number of
cells). This also optimizes the verification time of the invalidity proof.

1.3.15. Collated data for the external conditions. When a validator
suggests an unsigned block to the other validators of a shardchain, these
other validators must check the validity of this block candidate—i.e., verify


```
1.3. Consistency conditions
```
that it satisfies all of the internal and external local consistency conditions.
While the internal conditions do not require any extra data in addition to
the block candidate itself, the external conditions need some other blocks, or
at least some information out of those blocks. Such additional information
may be extracted from those blocks, along with all cells on the paths from
the cells containing the required additional information to the root cell of
the corresponding blocks and the hashes of the siblings of the cells on these
paths, to present a Merkle proof that can be processed without knowledge
of the referred blocks themselves.
This additional information, calledcollated data, is serialized as a bag of
cells and presented by the validator along with the unsigned block candidate
itself. The block candidate along with the collated data is called acollated
block.

1.3.16. Conditions for a collated block. Theexternal consistency con-
ditions for a block candidate are thus (automatically) transformed intoin-
ternal consistency conditions for a collated block, which greatly simplifies
and speeds up their verification by the other validators. However, some
data—such as the final state of the immediate antecessor of the block being
validated—is not collated. Instead, all validators are supposed to keep a local
copy of this data.

1.3.17. Representation conditions and representation hashes.Notice
that once Merkle proofs are included into a collated block, the consistency
conditions must take into account which data (i.e., which cells) are actually
present in the collated block, and not just referred to by their hashes. This
leads to a new group of conditions, calledrepresentation conditions, which
must be able to distinguish an external cell reference (usually represented
by its 256-bit hash) from the cell itself. A validator can be punished for
suggesting a collated block that does not contain all of the expected collated
data inside, even if the block candidate itself is valid.
This also leads to the utilization ofrepresentation hashesinstead oftrans-
parent hashesfor collated blocks.

1.3.18. Verification in the absence of the collated data.Notice that a
block must still be verifiable in the absence of the collated data; otherwise, no
party except the validators would be able to check a previously committed
block by its own means. In particular, witnesses cannot be included into
the collated data: they must reside in the block itself. The collated data


```
1.3. Consistency conditions
```
must contain only some portions of neighboring blocks referred to in the
principal block along with suitable Merkle proofs, which can be reconstructed
by anybody who has the referenced blocks themselves.

1.3.19. Inclusion of Merkle proofs in the block itself.Notice that on
some occasions Merkle proofs must be embedded into the block itself, and
not just into collated data. For instance:

- During Instant Hypercube Routing (IHR), a message may be included
    directly into theInMsgDescrof a block of the destination shardchain,
    without travelling all the way along the edges of the hypercube. In
    this case, a Merkle proof of the existence of the message in theOutMs-
    gDescrof a block of the originating shardchain must be included into
    InMsgDescralong with the message itself.
- An invalidity proof, or another proof of validator misbehavior, may
    be committed into the masterchain by including it in the body of a
    message sent to a special smart contract. In this case, the invalidity
    proof must include some cells along with a Merkle proof, which must
    therefore be contained in a message body.
- Similarly, a smart contract defining a payment channel, or another kind
    of side-chain, may accept finalization messages or misbehavior proof
    messages that contain suitable Merkle proofs.
- The final state of a shardchain is not included into a shardchain block.
    Instead, only the cells that have been modified are included; those cells
    that are inherited from the old state are referred to by their hashes,
    along with suitable Merkle proofs consisting of the cells on the path
    from the root of the old state to the cells of the old state referred to.

1.3.20. Provisions for handling incomplete data. As we have seen, it
is necessary to include incomplete data and Merkle proofs into the body of a
block, into the body of some messages contained in a block, and into the state.
This necessity is reflected by some extra representation conditions, as well
as provisions for the messages (and by extension, the cell trees processed
by TVM) to contain incomplete data (external cell references and Merkle
proofs). In most cases, such external cell references contain only the 256-bit
sha256hash of a cell along with a flag; if a smart contract attempts to inspect
the contents of such a cell by aCTOSprimitive (e.g., for deserialization), an


### 1.4 Logical time and logical time intervals

exception is triggered. However, an external reference to such a cell can be
stored into the smart contract’s persistent storage, and both the transparent
and the representation hashes of such a cell can be computed.

1.4 Logical time and logical time intervals

This section takes a closer look at so-calledlogical time, extensively used in
the TON Blockchain for message forwarding and message delivery guaran-
tees, among other purposes.

1.4.1. Logical time.A component of the TON Blockchain that also plays
an important role in message delivery is thelogical time, usually denoted by
Lt. It is a non-negative 64-bit integer, assigned to certain events roughly as
follows:

```
If an eventelogically depends on eventse 1 ,... ,en, thenLt(e)
is the smallest non-negative integer greater than allLt(ei).
```
In particular, ifn= 0(i.e., ifedoes not depend on any prior events), then
Lt(e) = 0.

1.4.2. A relaxed variant of logical time. On some occasions we relax
the definition of logical time, requesting only that

```
Lt(e)>Lt(e′) wheneveree′(i.e.,elogically depends one′), (9)
```
without insisting thatLt(e)be the smallest non-negative integer with this
property. In such cases we can speak aboutrelaxedlogical time, as opposed
to thestrictlogical time defined above (cf.1.4.1). Notice, however, that the
condition (9) is a fundamental property of logical time and cannot be relaxed
further.

1.4.3. Logical time intervals. It makes sense to assign to some events or
collections of eventsCanintervalof logical timesLt•(C) = [Lt−(C),Lt+(C)),
meaning that the collection of eventsCtook place in the specified “interval”
of logical times, whereLt−(C)<Lt+(C)are some integers (64-bit integers
in practice). In this case, we can say thatC beginsat logical timeLt−(C),
andendsat logical timeLt+(C).
By default, we assumeLt+(e) =Lt(e)+1andLt−(e) =Lt(e)for simple
or “atomic” events, assuming that they last exactly one unit of logical time.


```
1.4. Logical time and logical time intervals
```
In general, if we have a single valueLt(C)as well as logical time interval
Lt•(C) = [Lt−(C),Lt+(C)), we always require that

```
Lt(C)∈[Lt−(C),Lt+(C)) (10)
```
or, equivalently,
Lt−(C)≤Lt(C)<Lt+(C) (11)

In most cases, we chooseLt(C) =Lt−(C).

1.4.4. Requirements for logical time intervals. The three principal
requirements for logical time intervals are:

- 0 ≤Lt−(C)<Lt+(C)are non-negative integers for any collection of
    eventsC.
- Ife′≺e(i.e., if an atomic eventelogically depends on another atomic
    evente′), thenLt•(e′)<Lt•(e)(i.e.,Lt+(e′)≤Lt−(e)).
- IfC⊃D(i.e., if a collection of eventsCcontains another collection of
    eventsD), thenLt•(C)⊃Lt•(D), i.e.,

```
Lt−(C)≤Lt−(D)<Lt+(D)≤Lt+(C) (12)
```
```
In particular, ifCconsists of atomic eventse 1 ,... ,en, thenLt−(C)≤
infiLt−(ei)≤infiLt(ei)andLt+(C)≥supiLt+(ei)≥1+supiLt(ei).
```
1.4.5. Strict, or minimal, logical time intervals.One can assign to any
finite collection of atomic eventsE={e}related by a causality relation (par-
tial order)≺, and all subsetsC⊂E,minimallogical time intervals. That
is, among all assignments of logical time intervals satisfying the conditions
listed in1.4.4, we choose the one having allLt+(C)−Lt−(C)as small as
possible, and if several assignments with this property exist, we choose the
one that has the minimumLt−(C)as well.
Such an assignment can be achieved by first assigning logical timeLt(e)
to all atomic eventse ∈Eas described in1.4.1, then settingLt−(C) :=
infe∈CLt(e)andLt+(C) := 1 + supe∈CLt(e)for anyC⊂E.
In most cases when we need to assign logical time intervals, we use the
minimal logical time intervals just described.


### 1.5 Total blockchain state

1.4.6. Logical time in the TON Blockchain. The TON Blockchain
assigns logical time and logical time intervals to several of its components.
For instance, each outbound message created in a transaction is assigned
itslogical creation time; for this purpose, the creation of an outbound message
is considered an atomic event, logically dependent on the previous message
created by the same transaction, as well as on the previous transaction of the
same account, on the inbound message processed by the same transaction,
and on all events contained in the blocks referred to by hashes contained in
the block with the same transaction. As a consequence,outbound messages
created by the same smart contract have strictly increasing logical creation
times.The transaction itself is considered a collection of atomic events, and
is assigned a logical time interval (cf.4.2.1for a more precise description).
Each block is a collection of transaction and message creation events, so
it is assigned a logical time interval, explicitly mentioned in the header of the
block.

1.5 Total blockchain state

This section discusses the total state of the TON Blockchain, as well as the
states of separate shardchains and the masterchain. For example, the pre-
cise definition of the state of the neighboring shardchains becomes crucial for
correctly formalizing the consistency condition asserting that the validators
for a shardchain must import the oldest messages from the union ofOutMs-
gQueues taken from the states of all neighboring shardchains (cf.2.2.5).

1.5.1. Total state defined by a masterchain block.Every masterchain
block contains a list of all currently active shards and of the latest blocks
for each of them. In this respect,every masterchain block defines the corre-
sponding total state of the TON Blockchain, since it fixes the state of every
shardchain, and of the masterchain as well.
An important requirement imposed on this list of the latest blocks for all
shardchain blocks is that, if a masterchain blockBlistsSas the latest block
of some shardchain, and a newer masterchain blockB′, withBas one of its
antecessors, listsS′as the latest block of the same shardchain, thenSmust
be one of the antecessors ofS′.^10 This condition makes the total state of the

(^10) In order to express this condition correctly in the presence of dynamic sharding, one
should fix some accountξ, and consider the latest blocksSandS′of the shardchains
containingξin the shard configurations of bothBandB′, since the shards containingξ


### 1.6 Configurable parameters and smart contracts

TON blockchain defined by a subsequent masterchain blockB′compatible
with the total state defined by a previous blockB.

1.5.2. Total state defined to by a shardchain block.Every shardchain
block contains the hash of the most recent masterchain block in its header.
Consequently, all the blocks referred to in that masterchain block, along with
their antecessors, are considered “known” or “visible” to the shardchain block,
and no other blocks are visible to it, with the sole exception of its antecessors
inside its proper shardchain.
In particular, when we say that a blockmustimport in itsInMsgDescrthe
messages from theOutMsgQueueof the states of all neighboring shardchains,
it means that precisely the blocks of other shardchains visible to that block
must be taken into account, and at the same time the block cannot contain
messages from “invisible” blocks, even if they are otherwise correct.

1.6 Configurable parameters and smart contracts

Recall that the TON Blockchain has several so-called “configurable param-
eters” (cf. [3]), which are either certain values or certain smart contracts
residing in the masterchain. This section discusses the storage of and access
to these configurable parameters.

1.6.1. Examples of configurable parameters. The properties of the
blockchain controlled by configurable parameters include:

- The minimum stake for validators.
- The maximum size of the group of elected validators.
- The maximum number of blocks for which the same group of validators
    are responsible.
- The validator election process.
- The validator punishing process.
- The currently active and the next elected set of validators.

might be different inBandB′.


```
1.6. Configurable parameters and smart contracts
```
- The process of changing configurable parameters, and the address of the
    smart contractγresponsible for holding the values of the configurable
    parameters and for modifying their values.

1.6.2. Location of the values of configurable parameters.The config-
urable parameters are kept in the persistent data of a special configuration
smart contractγresiding in the masterchain of the TON Blockchain. More
precisely, the first reference of the root cell of the persistent data of that
smart contract is a dictionary mapping 64-bit keys (parameter numbers) to
the values of the corresponding parameters; each value is serialized into a
cell slice according to the type of that value. If a value is a “smart contract”
(necessarily residing in the masterchain), its 256-bit account address is used
instead.

1.6.3. Quick access through the header of masterchain blocks. To
simplify access to the current values of configurable parameters, and to
shorten the Merkle proofs containing references to them, the header of each
masterchain block contains the address of smart contractγ. It also contains
a direct cell reference to the dictionary containing all values of configurable
parameters, which lies in the persistent data ofγ. Additional consistency
conditions ensure that this reference coincides with the one obtained by in-
specting the final state of smart contractγ.

1.6.4. Getting values of configurable parameters by get methods.
The configuration smart contractγprovides access to some of configurable
parameters by means of “get methods”. These special methods of the smart
contract do not change its state, but instead return required data in the
TVM stack.

1.6.5. Getting values of configurable parameters by get messages.
Similarly, the configuration smart contract γ may define some “ordinary”
methods (i.e., special inbound messages) to request the values of certain con-
figuration parameters, which will be sent in the outbound messages generated
by the transaction processing such an inbound message. This may be useful
for some other fundamental smart contracts that need to know the values of
certain configuration parameters.

1.6.6. Values obtained by get methods may be different from those
obtained through the block header. Notice that the state of the con-
figuration smart contractγ, including the values of configurable parameters,


```
1.6. Configurable parameters and smart contracts
```
may change several times inside a masterchain block, if there are several
transactions processed byγin that block. As a consequence, the values ob-
tained by invoking get methods ofγ, or sending get messages toγ, may be
different from those obtained by inspecting the reference in the block header
(cf.1.6.3), which refers to thefinal state of the configurable parameters in
the block.

1.6.7. Changing the values of configurable parameters. The proce-
dure for changing the values of configurable parameters is defined in the
code of smart contractγ. For most configurable parameters, calledordinary,
any validator may suggest a new value by sending a special message with
the number of the parameter and its proposed value toγ. If the suggested
value is valid, further voting messages from the validators are collected by
the smart contract, and if more than two-thirds each of the current and next
sets of validators support the proposal, the value is changed.
Some parameters, such as the current set of validators, cannot be changed
in this way. Instead, the current configuration contains a parameter with the
address of smart contractνresponsible for electing the next set of validators,
and smart contractγaccepts messages only from this smart contractνto
modify the value of the configuration parameter containing the current set
of validators.

1.6.8. Changing the validator election procedure. If the validator
election procedure ever needs to be changed, this can be accomplished by first
committing a new validator election smart contract into the masterchain, and
then changing the ordinary configurable parameter containing the addressν
of the validator election smart contract. This will require two-thirds of the
validators to accept the proposal in a vote as described above in1.6.7.

1.6.9. Changing the procedure of changing configurable parame-
ters. Similarly, the address of the configuration smart contract itself is a
configurable parameter and may be changed in this fashion. In this way,
most fundamental parameters and smart contracts of the TON Blockchain
may be modified in any direction agreed upon by the qualified majority of
the validators.

1.6.10. Initial values of the configurable parameters.The initial values
of most configurable parameters appear in block zero of the masterchain as
part of the masterchain’s initial state, which is explicitly present with no


### 1.7 New smart contracts and their addresses

omissions in this block. The code of all fundamental smart contracts is
also present in the initial state. In this way, the original “constitution” and
configuration of the TON Blockchain, including the original set of validators,
is made explicit in block zero.

1.7 New smart contracts and their addresses

This section discusses the creation and initialization of new smart contracts—
in particular, the origin of their initial code, persistent data, and balance. It
also discusses the assignment of account addresses to new smart contracts.

1.7.1. Description valid only for masterchain and basic workchain.
The mechanisms for creating new smart contracts and assigning their ad-
dresses described in this section are valid only for the basic workchain and
the masterchain. Other workchains may define their own mechanisms for
dealing with these problems.

1.7.2. Transferring cryptocurrency to uninitialized accounts. First
of all,it is possible to send messages, including value-bearing messages, to
previously unmentioned accounts.If an inbound message arrives at a shard-
chain with a destination addressηcorresponding to an undefined account,
it is processed by a transaction as if the code of the smart contract were
empty (i.e., consisting of an implicitRET). If the message is value-bearing,
this leads to the creation of an “uninitialized account”, which may have a
non-zero balance (if value-bearing messages have been sent to it),^11 but has
no code and no data. Because even an uninitialized account occupies some
persistent storage (needed to hold its balance), some small persistent-storage
payments will be exacted from time to time from the account’s balance, until
it becomes negative.

1.7.3. Initializing smart contracts by constructor messages. An ac-
count, or smart contract, is created by sending a specialconstructor message
M to its addressη. The body of such a message contains the tree of cells
with the initial code of the smart contract (which may be replaced by its
hash in some situations), and the initial data of the smart contract (maybe
empty; it can be replaced by its hash). The hash of the code and of the data

(^11) Value-bearing messages with thebounceflag set will not be accepted by an uninitial-
ized account, but will be “bounced” back.


```
1.7. New smart contracts and their addresses
```
contained in the constructor message must coincide with the addressηof the
smart contract; otherwise, it is rejected.
After the code and data of the smart contract are initialized from the
body of the constructor message, the remainder of the constructor message
is processed by a transaction (thecreating transactionfor smart contractη)
by invoking TVM in a manner similar to that used for processing ordinary
inbound messages.

1.7.4. Initial balance of a smart contract. Notice that the construc-
tor message usually must bear some value, which will be transferred to the
balance of the newly-created smart contract; otherwise, the new smart con-
tract would have a balance of zero and would not be able to pay for storing
its code and data in the blockchain. The minimum balance required from
a newly-created smart contract is a linear (more precisely, affine) function
of the storage it uses. The coefficients of this function may depend on the
workchain; in particular, they are higher in the masterchain than in the basic
workchain.

1.7.5. Creating smart contracts by external constructor messages.
In some cases, it is necessary to create a smart contract by a constructor
message that cannot bear any value—for instance, by a constructor message
“from nowhere” (an external inbound message). Then one should first transfer
a sufficient amount of funds to the uninitialized smart contract as explained
in1.7.2, and only then send a constructor message “from nowhere”.

1.7.6. Example: creating a cryptocurrency wallet smart contract.
An example of the above situation is provided by cryptocurrency wallet ap-
plications for human users, which must create a special wallet smart contract
in the blockchain in which to keep the user’s funds. This can be achieved as
follows:

- The cryptocurrency wallet application generates a new cryptographic
    public/private key pair (typically for Ed25519 elliptic curve cryptogra-
    phy, supported by special TVM primitives) for signing the user’s future
    transactions.
- The cryptocurrency wallet application knows the code of the smart
    contract to be created (which typically is the same for all users), as
    well as the data, which typically consists of the public key of the wallet


```
1.7. New smart contracts and their addresses
```
```
(or of its hash) and is generated at the very beginning. The hash of this
information is the addressξof the wallet smart contract to be created.
```
- The wallet application may display the user’s addressξ, and the user
    may start to receive funds to her uninitialized accountξ—for example,
    by buying some cryptocurrency at an exchange, or by asking a friend
    to transfer a small sum.
- The wallet application can inspect the shardchain containing account
    ξ(in the case of a basic workchain account) or the masterchain (in the
    case of a masterchain account), either by itself or using a blockchain
    explorer, and check the balance ofξ.
- If the balance is sufficient, the wallet application may create and sign
    (with the user’s private key) the constructor message (“from nowhere”),
    and submit it for inclusion to the validators or the collators for the
    corresponding blockchain.
- Once the constructor message is included into a block of the blockchain
    and processed by a transaction, the wallet smart contract is finally
    created.
- When the user wants to transfer some funds to some other user or smart
    contractη, or wants to send a value-bearing message toη, she uses her
    wallet application to create the messagemthat she wants her wallet
    smart contractξto send toη, envelopeminto a special “message from
    nowhere”m′with destinationξ, and signm′with her private key. Some
    provisions against replay attacks must be made, as explained in2.2.1.
- The wallet smart contract receives messagem′and checks the validity
    of the signature with the aid of the public key stored in its persistent
    data. If the signature is correct, it extracts embedded messagemfrom
    m′and sends it to its intended destinationη, with the indicated amount
    of funds attached to it.
- If the user does not need to immediately start transferring funds, but
    only wants to passively receive some funds, she may keep her account
    uninitialized as long as she wants (provided the persistent storage pay-
    ments do not lead to the exhaustion of its balance), thus minimizing
    the storage profile and persistent storage payments of the account.


### 1.8 Modification and removal of smart contracts

- Notice that the wallet application may create for the human user the
    illusion that the funds are kept in the application itself, and provide an
    interface to transfer funds or send arbitrary messages “directly” from
    the user’s accountξ. In reality, all these operations will be performed
    by the user’s wallet smart contract, which effectively acts as a proxy
    for such requests. We see that a cryptocurrency wallet is a simple
    example of amixed application, having an on-chain part (the wallet
    smart contract, used as a proxy for outbound messages) and an off-
    chain part (the external wallet application running on a user’s device
    and keeping the private account key).

Of course, this is just one way of dealing with the simplest user wallet smart
contracts. One can create multi-signature wallet smart contracts, or create
a shared wallet with internal balances kept inside it for each of its individual
users, and so on.

1.7.7. Smart contracts may be created by other smart contracts.
Notice that a smart contract may generate and send a constructor message
while processing any transaction. In this way, smart contracts may auto-
matically create new smart contracts, if they need to, without any human
intervention.

1.7.8. Smart contracts may be created by wallet smart contracts.
On the other hand, a user may compile the code for her new smart contractν,
generate the corresponding constructor messagem, and use the wallet appli-
cation to force her wallet smart contractξto send messagemtoνwith an
adequate amount of funds, thus creating the new smart contractν.

1.8 Modification and removal of smart contracts

This section explains how the code and state of a smart contract may be
changed, and how and when a smart contract may be destroyed.

1.8.1. Modification of the data of a smart contract. The persistent
data of a smart contract is usually modified as a result of executing the
code of the smart contract in TVM while processing a transaction, triggered
by an inbound message to the smart contract. More specifically, the code
of the smart contract has access to the old persistent storage of the smart
contract via TVM control registerc4, and may modify the persistent storage
by storing another value intoc4before normal termination.


```
1.8. Modification and removal of smart contracts
```
Normally, there are no other ways to modify the data of an existing
smart contract. If the code of the smart contract does not provide any ways
to modify the persistent data (e.g., if it is a simple wallet smart contract
as described in1.7.6, which initializes the persistent data with the user’s
public key and does not intend to ever change it), then it will be effectively
immutable—unless the code of the smart contract is modified first.

1.8.2. Modification of the code of a smart contract.Similarly, the code
of an existing smart contract may be modified only if some provisions for such
an upgrade are present in the current code. The code is modified by invoking
TVM primitiveSETCODE, which sets the root of the code for the current smart
contract from the top value in the TVM stack. The modification is applied
only after the normal termination of the current transaction.
Typically, if the developer of a smart contract wants to be able to upgrade
its code in the future, she provides a special “code upgrade method” in the
original code of the smart contract, which invokesSETCODEin response to
certain inbound “code upgrade” messages, using the new code sent in the
message itself as an argument toSETCODE. Some provisions must be made
to protect the smart contract from unauthorized replacement of the code;
otherwise, control of the smart contract and the funds on its balance could
be lost. For example, code upgrade messages might be accepted only from
a trusted source address, or they might be protected by requiring a valid
cryptographic signature and a correct sequence number.

1.8.3. Keeping the code or data of the smart contract outside the
blockchain. The code or data of the smart contract may be kept outside
the blockchain and be represented only by their hashes. In such cases, only
empty inbound messages may be processed, as well as messages carrying a
correct copy of the smart-contract code (or its portion relevant for process-
ing the specific message) and its data inside special fields. An example of
such a situation is given by the uninitialized smart contracts and constructor
messages described in1.7.

1.8.4. Using code libraries. Some smart contracts may share the same
code, but use different data. One example of this is wallet smart contracts
(cf.1.7.6), which are likely to use the same code (throughout all wallets
created by the same software), but with different data (because each wallet
must use its own pair of cryptographic keys). In this case, the code for all
the wallet smart contracts is best committed by the developer into a shared


```
1.8. Modification and removal of smart contracts
```
library; this library would reside in the masterchain, and be referred to by its
hash using a special “external library cell reference” as the root of the code
of each wallet smart contract (or as a subtree inside that code).
Notice that even if the library code becomes unavalable—for example,
because its developer stops paying for its storage in the masterchain—it
is still possible to use the smart contracts referring to this library, either
by committing the library again into the masterchain, or by including its
relevant parts inside a message sent to the smart contract. This external cell
reference resolution mechanism is discussed in more detail later in4.4.3.

1.8.5. Destroying smart contracts.Notice that a smart contract cannot
really be destroyed until its balance becomes zero or negative. It may become
negative as a result of collecting persistent storage payments, or after send-
ing a value-bearing outbound message transferring almost all of its previous
balance.
For example, a user may decide to transfer all remaining funds from her
wallet to another wallet or smart contract. This may be useful, for instance,
if one wants to upgrade the wallet, but the wallet smart contract does not
have any provisions for future upgrades; then one can simply create a new
wallet and transfer all funds to it.

1.8.6. Frozen accounts. When the balance of an account becomes non-
positive after a transaction, or smaller than a certain workchain-dependent
minimum, the account isfrozenby replacing all its code and data by a single
32-byte hash. This hash is kept afterwards for some time (e.g., a couple of
months) to prevent recreation of the smart contract by its original creating
transaction (which still has the correct hash, equal to the account address),
and to allow its owner to recreate the account by transferring some funds and
sending a message containing the account’s code and data, to be reinstated
in the blockchain. In this respect, frozen accounts are similar to uninitialized
accounts; however, the hash of the correct code and data for a frozen account
is not necessarily equal to the account address, but is kept separately.
Notice that frozen accounts may have a negative balance, indicating that
persistent storage payments are due. An account cannot be unfrozen until
its balance becomes positive and larger than a prescribed minimum value.


### 2.1 Message addresses and next-hop computation

## 2 Message forwarding and delivery guarantees

This chapter discusses the forwarding of messages inside the TON Blockchain,
including the Hypercube Routing (HR) and Instant Hypercube Routing
(IHR) protocols. It also describes the provisions required to implement the
message delivery guarantees and the FIFO ordering guarantee.

2.1 Message addresses and next-hop computation

This section explains the computation of transit and next-hop addresses by
the variant of the hypercube routing algorithm employed in TON Blockchain.
The hypercube routing protocol itself, which uses the concepts and next-hop
address computation algorithm introduced in this section, is presented in the
next section.

2.1.1. Account addresses.Thesource addressanddestination addressare
always present in any message. Normally, they are(full) account addresses.
A full account address consists of aworkchain_id(a signed 32-bit big-endian
integer defining a workchain), followed by a (usually) 256-bitinternal address
oraccount identifier account_id (which may also be interpreted as an un-
signed big-endian integer) defining the account within the chosen workchain.
Different workchains may use account identifiers that are shorter or longer
than the “standard” 256 bits used in the masterchain (workchain_id=− 1 )
and in the basic workchain (workchain_id= 0). To this end, the masterchain
state contains a list of all workchains defined so far, along with their account
identifier lengths. An important restriction is that theaccount_id for any
workchain must be at least 64 bits long.
In what follows, we often consider only the case of 256-bit account ad-
dresses for simplicity. Only the first 64 bits of theaccount_idare relevant
for the purposes of message routing and shardchain splitting.

2.1.2. Source and destination addresses of a message. Any message
has both asource addressand adestination address. Its source address is
the address of the account (smart contract) that has created the message
while processing some transaction; the source address cannot be changed
or set arbitrarily, and smart contracts heavily rely on this property. By
contrast, when a message is created, any well-formed destination address
may be chosen; after that, the destination address cannot be changed.


```
2.1. Message addresses and next-hop computation
```
2.1.3. External messages with no source or destination address.
Some messages can have no source or no destination address (though at least
one of them must be present), as indicated by special flags in the message
header. Such messages are theexternal messagesintended for the interaction
of the TON Blockchain with the outside world—human users and their cryp-
towallet applications, off-chain and mixed applications and services, other
blockchains, and so on.
External messages are never routed inside the TON Blockchain. Instead,
“messages from nowhere” (i.e., with no source address) are directly included
into theInMsgDescrof a destination shardchain block (provided some con-
ditions are met) and processed by a transaction in that very block. Similarly,
“messages to nowhere” (i.e., with no TON Blockchain destination address),
also known aslog messages, are also present only in the block containing the
transaction that generated such a message.^12
Therefore, external messages are almost irrelevant for the discussion of
message routing and message delivery guarantees. In fact, the message deliv-
ery guarantees for outbound external messages are trivial (at most, the mes-
sage must be included into theLogMsgpart of the block), and for inbound
external messages there are none, since the validators of a shardchain block
are free to include or ignore suggested inbound external messages at their
discretion (e.g., according to the processing fee offered by the message).^13
In what follows, we focus on “usual” or “internal” messages, which have
both a source and a destination address.

2.1.4. Transit and next-hop addresses. When a message needs to be
routed through intermediate shardchains before reaching its intended desti-
nation, it is assigned atransit address and anext-hop addressin addition
to the (immutable) source and destination addresses. When a copy of the

(^12) “Messages to nowhere” may have some special fields in their body indicating their des-
tination outside the TON Blockchain—for instance, an account in some other blockchain,
or an IP address and port—which may be interpreted by the third-party software appro-
priately. Such fields are ignored by the TON Blockchain.
(^13) The problem of bypassing possible validator censorship—which could happen, for in-
stance, if all validators conspire not to include external messages sent to accounts belonging
to some set of blacklisted accounts—is dealt with separately elsewhere. The main idea is
that the validators may be forced to promise to include a message with a known hash in
a future block, without knowing anything about the identity of the sender or the receiver;
they will have to keep this promise afterwards when the message itself with pre-agreed
hash is presented.


```
2.1. Message addresses and next-hop computation
```
message resides inside a transit shardchain awaiting its relay to its next hop,
thetransit addressis its intermediate address lying in the transit shardchain,
as if belonging to a special message-relay smart contract whose only job is
to relay the unchanged message to the next shardchain on the route. The
next-hop addressis the address in a neighboring shardchain (or, on some rare
occasions, in the same shardchain) to which the message needs to be relayed.
After the message is relayed, the next-hop address usually becomes the tran-
sit address of the copy of the message included in the next shardchain.
Immediately after an outbound message is created in a shardchain (or in
the masterchain), its transit address is set to its source address.^14

2.1.5. Computation of the next-hop address for hypercube routing.
The TON Blockchain employs a variant of hypercube routing. This means
that the next-hop address is computed from the transit address (originally
equal to the source address) as follows:

1. The (big-endian signed) 32-bitworkchain_id components of both the
    transit address and destination address are split into groups ofn 1 bits
    (currently,n 1 = 32), and they are scanned from the left (i.e., the most
    significant bits) to the right. If one of the groups in the transit address
    differs from the corresponding group in the destination address, then
    the value of this group in the transit address is replaced by its value in
    the destination address to compute the next-hop address.
2. If the workchain_id parts of the transit and destination addresses
    match, then a similar process is applied to theaccount_idparts of the
    addresses: Theaccount_idparts, or rather their first (most significant)
    64 bits, are split into groups ofn 2 bits (currently,n 2 = 4bit groups are
    used, corresponding to the hexadecimal digits of the address) starting
    from the most significant bit, and are compared starting from the left.
    The first group that differs is replaced in the transit address with its
    value in the destination address to compute the next-hop address.
3. If the first 64 bits of theaccount_id parts of the transit and desti-
    nation addresses match as well, then the destination account belongs
    to the current shardchain, and the message should not be forwarded

(^14) However, the internal routing process described in2.1.11is applied immediately after
that, which may further modify the transit address.


```
2.1. Message addresses and next-hop computation
```
```
outside the current shardchain at all. Instead, it must be processed by
a transaction inside it.
```
2.1.6. Notation for the next-hop address.We denote by

```
NextHop(ξ,η) (13)
```
the next-hop address computed for current (source or transit) addressξand
destination addressη.

2.1.7. Support for anycast addresses. “Large” smart contracts, which
can have separate instances in different shardchains, may be reached using
anycast destination addresses. These addresses are supported as follows.
An anycast address (η,d)consists of a usual addressη along with its
“splitting depth”d≤ 31. The idea is that the message may be delivered to
any address differing fromηonly in the firstdbits of the internal address
part (i.e., not including the workchain identifier, which must match exactly).
This is achieved as follows:

- The effective destination addressη ̃is computed from(η,d)by replacing
    the firstdbits of the internal address part ofηwith the corresponding
    bits taken from the source addressξ.
- All computations ofNextHop(ν,η)are replaced byNextHop(ν,η ̃),
    forν =ξ as well as for all other intermediate addressesν. In this
    way, Hypercube Routing or Instant Hypercube Routing will ultimately
    deliver the message to the shardchain containingη ̃.
- When the message is processed in its destination shardchain (the one
    containing addressη ̃), it may be processed by an accountη′of the same
    shardchain differing fromηandη ̃only in the firstdbits of the internal
    address part. More precisely, if the common shard address prefix iss,
    so that only internal addresses starting with binary stringsbelong to
    the destination shard, thenη′is computed fromηby replacing the first
    min(d,|s|)bits of the internal address part ofηwith the corresponding
    bits ofs.

That said, we tacitly ignore the existence of anycast addresses and the addi-
tional processing they require in the following discussions.


```
2.1. Message addresses and next-hop computation
```
2.1.8. Hamming optimality of the next-hop address algorithm.No-
tice that the specific hypercube routing next-hop computation algorithm ex-
plained in2.1.5may potentially be replaced by another algorithm, provided
it satisfies certain properties. One of these properties is theHamming opti-
mality, meaning that the Hamming (L 1 ) distance fromξtoηequals the sum
of Hamming distances fromξtoNextHop(ξ,η)and fromNextHop(ξ,η)
toη:

```
‖ξ−η‖ 1 =
```
#### ∥

```
∥ξ−NextHop(ξ,η)
```
#### ∥

#### ∥

#### 1 +

#### ∥

```
∥NextHop(ξ,η)−η
```
#### ∥

#### ∥

#### 1 (14)

Here‖ξ−η‖ 1 is theHamming distancebetweenξandη, equal to the number
of bit positions in whichξandηdiffer:^15

```
‖ξ−η‖ 1 =
```
#### ∑

```
i
```
```
|ξi−ηi| (15)
```
Notice that in general one should expect only an inequality in (14), follow-
ing from the triangle inequality for theL 1 -metric. Hamming optimality essen-
tially means thatNextHop(ξ,η)lies on one of the (Hamming) shortest paths
fromξtoη. It can also be expressed by saying thatν=NextHop(ξ,η)is
always obtained fromξby changing the values of bits at some positions to
their values inη: for any bit positioni, we haveνi=ξiorνi=ηi.^16

2.1.9. Non-stopping ofNextHop. Another important property of the
NextHopis itsnon-stopping, meaning thatNextHop(ξ,η) =ξis possible
only whenξ=η. In other words, if we have not yet arrived atη, the next
hop cannot coincide with our current position.
This property implies that the path fromξ to η—i.e., the sequence of
intermediate addressesξ(0):=ξ,ξ(n):=NextHop(ξ(n−1),η)—will gradually
stabilize atη: for someN≥ 0 , we haveξ(n)=ηfor alln≥N. Indeed, one
can always takeN:=‖ξ−η‖ 1.

2.1.10. Convexity of the HR path with respect to sharding.A con-
sequence of Hamming optimality property (14) is what we call theconvexity

(^15) When the addresses involved are of different lengths (e.g., because they belong to
different workchains), one should consider only the first 96 bits of the addresses in the
above formula.
(^16) Instead of Hamming optimality, we might have considered the equivalent property
ofKademlia optimality, written for the Kademlia (or weightedL 1 ) distance as given by
‖ξ−η‖K:=
∑
i^2 −i|ξi−ηi|instead of the Hamming distance.


```
2.1. Message addresses and next-hop computation
```
of the path fromξ to ηwith respect to sharding. Namely, if ξ(0) := ξ,
ξ(n):=NextHop(ξ(n−1),η)is the computed path fromξtoη, andNis the
first index such thatξ(N)=η, andS is a shard of some workchain in any
shard configuration, then the indicesiwithξ(i)residing in shardSconstitute
a subinterval in[0,N]. In other words, if integers 0 ≤i≤j≤k≤N are
such thatξ(i),ξ(k)∈S, thenξ(j)∈Sas well.
This convexity property is important for some proofs related to message
forwarding in the presence of dynamic sharding.

2.1.11. Internal routing.Notice that the next-hop address computed ac-
cording to the rules defined in2.1.5may belong to the same shardchain as
the current one (i.e., the one containing the transit address). In that case,
the “internal routing” occurs immediately, the transit address is replaced by
the value of the computed next-hop address, and the next-hop address com-
putation step is repeated until a next-hop address lying outside the current
shardchain is obtained. The message is then kept in the transit output queue
according to its computed next-hop address, with its last computed transit
address as the “intermediate owner” of the transit message. If the current
shardchain splits into two shardchains before the message is forwarded fur-
ther, it is the shardchain containing the intermediate owner that inherits this
transit message.
Alternatively, we might go on computing the next-hop addresses only to
find out that the destination address already belongs to the current shard-
chain. In that case, the message will be processed (by a transaction) inside
this shardchain instead of being forwarded further.

2.1.12. Neighboring shardchains.Two shards in a shard configuration—
or the two corresponding shardchains—are said to beneighbors, orneigh-
boring shardchains, if one of them contains a next-hop address for at least
one combination of allowed source and destination addresses, while the other
contains the transit address for the same combination. In other words, two
shardchains are neighbors if a message can be forwarded directly from one
of them into the other via Hypercube Routing.
The masterchain is also included in this definition, as if it were the only
shardchain of the workchain withworkchain_id=− 1. In this respect, it is
a neighbor of all the other shardchains.

2.1.13. Any shard is a neighbor of itself. Notice that a shardchain is
always considered a neighbor of itself. This may seem redundant, because we


```
2.1. Message addresses and next-hop computation
```
always repeat the next-hop computation described in2.1.5until we obtain
a next-hop address outside the current shardchain (cf.2.1.11). However,
there are at least two reasons for such an arrangement:

- Some messages have the source and the destination address inside the
    same shardchain, at least when the message is created. However, if
    such a message is not processed immediately in the same block where
    it has been created, it must be added to the outbound message queue
    of its shardchain, and be imported as an inbound message (with an
    entry in theInMsgDescr) in one of the subsequent blocks of the same
    shardchain.^17
- Alternatively, the next-hop address may originally be in some other
    shardchain that later gets merged with the current shardchain, so that
    the next hop becomes inside the same shardchain. Then the message
    will have to be imported from the outbound message queue of the
    merged shardchain, and forwarded or processed accordingly to its next-
    hop address, even though they reside now inside the same shardchain.

2.1.14. Hypercube Routing and the ISP.Ultimately, the Infinite Shard-
ing Paradigm (ISP) applies here: a shardchain should be considered a provi-
sional union of accountchains, grouped together solely to minimize the block
generation and transmission overhead.
The forwarding of a message runs through several intermediate account-
chains, some of which can happen to lie in the same shard. In this case,
once a message reaches an accountchain lying in this shard, it is immediately
(“internally”) routed inside that shard until the last accountchain lying in
the same shard is reached (cf.2.1.11). Then the message is enqueued in the
output queue of that last accountchain.^18

2.1.15. Representation of transit and next-hop addresses. Notice
that the transit and next-hop addresses differ from the source address only
in theworkchain_idand in the first (most significant) 64 bits of the account
address. Therefore, they may be represented by 96-bit strings. Furthermore,

(^17) Notice that the next-hop and internal-routing computations are still applied to such
messages, since the current shardchain may be split before the message is processed. In this
case, the new sub-shardchain containing the destination address will inherit the message.
(^18) We may define the (virtual) output queue of an account(chain) as the subset of the
OutMsgQueueof the shard currently containing that account that consists of messages
with transit addresses equal to the address of the account.


### 2.2 Hypercube Routing protocol

theirworkchain_id usually coincides with the workchain_id of either the
source address or the destination address; a couple of bits may be used to
indicate this situation, thus further reducing the space required to represent
the transit and next-hop addresses.
In fact, the required storage may be reduced even further by observ-
ing that the specific hypercube routing algorithm described in2.1.5always
generates intermediate (i.e., transit and next-hop) addresses that coincide
with the destination address in their firstkbits, and with the source ad-
dress in their remaining bits. Therefore, one might use just the values
0 ≤ktr,knh ≤ 96 to fully specify the transit and next-hop addresses. One
might also notice thatk′:=knhturns out to be a fixed function ofk:=ktr
(for instance,k′=k+n 2 =k+ 4fork≥ 32 ), and therefore include only one
7-bit value ofkin the serialization.
Such optimizations have the obvious disadvantage that they rely too much
on the specific routing algorithm used, which can be changed in the future, so
they are used in3.1.15with a provision to specify more general intermediate
addresses if necessary.

2.1.16. Message envelopes.The transit and next-hop addresses of a for-
warded message are not included in the message itself, but are kept in a spe-
cialmessage envelope, which is a cell (or a cell slice) containing the transit
and next-hop addresses with the above optimizations, some other informa-
tion relevant for forwarding and processing, and a reference to a cell contain-
ing the unmodified original message. In this way, a message can easily be
“extracted” from its original envelope (e.g., the one present in theInMsgDe-
scr) and be put into another envelope (e.g., before being included into the
OutMsgQueue).
In the representation of a block as a tree, or rather a DAG, of cells,
the two different envelopes will contain references to a shared cell with the
original message. If the message is large, this arrangement avoids the need
to keep more than one copy of the message in the block.

2.2 Hypercube Routing protocol

This section exposes the details of the hypercube routing protocol employed
by the TON Blockchain to achieve guaranteed delivery of messages between
smart contracts residing in arbitrary shardchains. For the purposes of this
document, we will refer to the variant of hypercube routing employed by the


```
2.2. Hypercube Routing protocol
```
TON Blockchain as Hypercube Routing (HR).

2.2.1. Message uniqueness. Before continuing, let us observe that any
(internal) message isunique. Recall that a message contains its full source
address along with its logical creation time, and all outbound messages cre-
ated by the same smart contract have strictly increasing logical creation
times (cf.1.4.6); therefore, the combination of the full source address and
the logical creation time uniquely defines the message. Since we assume the
chosen hash functionsha256to be collision resistant,a message is uniquely
determined by its hash, so we can identify two messages if we know that their
hashes coincide.
This does not extend to external messages “from nowhere”, which have
no source addresses. Special care must be taken to prevent replay attacks re-
lated to such messages, especially by designers of user wallet smart contracts.
One possible solution is to include a sequence number in the body of such
messages, and keep the count of external messages already processed inside
the smart-contract persistent data, refusing to process an external message
if its sequence number differs from this count.

2.2.2. Identifying messages with equal hashes. The TON Blockchain
assumes that two messages with the same hashes coincide, and treats either
of them as a redundant copy of the other. As explained above in2.2.1, this
does not lead to any unexpected effects for internal messages. However, if
one sends two coinciding “messages from nowhere” to a smart contract, it
may happen that only one of them will be delivered—or both. If their action
is not supposed to be idempotent (i.e., if processing the message twice has a
different effect from processing it once), some provisions should be made to
distinguish the two messages, for instance by including a sequence number
in them.
In particular, theInMsgDescrandOutMsgDescr use the (unenveloped)
message hash as a key, tacitly assuming that distinct messages have distinct
hashes. In this way, one can trace the path and the fate of a message across
different shardchains by looking up the message hash in theInMsgDescrand
OutMsgDescrof different blocks.

2.2.3. The structure ofOutMsgQueue.Recall that the outbound mes-
sages — both those created inside the shardchain, and transit messages pre-
viously imported from a neighboring shardchain to be relayed to the next-
hop shardchain — are accumulated in theOutMsgQueue, which is part of the


```
2.2. Hypercube Routing protocol
```
stateof the shardchain (cf.1.2.7). In contrast withInMsgDescrandOutMs-
gDescr, the key inOutMsgQueueis not the message hash, but its next-hop
address—or at least its first 96 bits—concatenated with the message hash.
Furthermore, theOutMsgQueueis not just a dictionary (hashmap), map-
ping its keys into (enveloped) messages. Rather, it is amin-augmented dic-
tionary with respect to the logical creation time, meaning that each node of
the Patricia tree representingOutMsgQueuehas an additional value (in this
case, an unsigned 64-bit integer), and that this augmentation value in each
fork node is set to be equal to the minimum of the augmentation values of its
children. The augmentation value of a leaf equals the logical creation time
of the message contained in that leaf; it need not be stored explicitly.

2.2.4. Inspecting theOutMsgQueue of a neighbor. Such a structure
for theOutMsgQueue enables the validators of a neighboring shardchain to
inspect it to find its part (Patricia subtree) relevant to them (i.e., consisting
of messages with the next-hop address belonging to the neighboring shard
in question—or having the next-hop address with a given binary prefix), as
well as quickly compute the “oldest” (i.e., with the minimum logical creation
time) message in that part.
Furthermore, the shard validators do not even need to track the total state
of all their neighboring shardchains—they only need to keep and update a
copy of theirOutMsgQueue, or even of its subtree related to them.

2.2.5. Logical time monotonicity: importing the oldest message
from the neighbors. The first fundamental local condition of message
forwarding, called(message import) (logical time) monotonicity condition,
may be summarized as follows:

```
While importing messages into theInMsgDescr of a shardchain
block from theOutMsgQueues of its neighboring shardchains, the
validators must import the messages in the increasing order of
their logical time; in the case of a tie, the message with the smaller
hash is imported first.
```
More precisely, each shardchain block contains the hash of a masterchain
block (assumed to be “the latest” masterchain block at the time of the shard-
chain block’s creation), which in turn contains the hashes of the most recent
shardchain blocks. In this way, each shardchain block indirectly “knows”


```
2.2. Hypercube Routing protocol
```
the most recent state of all other shardchains, and especially its neighboring
shardchains, including theirOutMsgQueues.^19
Now an alternative equivalent formulation of the monotonicity condition
is as follows:

```
If a message is imported into theInMsgDescrof the new block, its
logical creation time cannot be greater than that of any message
left unimported in theOutMsgQueueof the most recent state of
any of the neighboring shardchains.
```
It is this form of the monotonicity condition that appears in the local con-
sistency conditions of the TON Blockchain blocks and is enforced by the
validators.

2.2.6. Witnesses to violations of the message import logical time
monotonicity condition. Notice that if this condition is not fulfilled, a
small Merkle proof witnessing its failure may be constructed. Such a proof
will contain:

- A path in theOutMsgQueueof a neighbor from the root to a certain
    messagemwith small logical creation time.
- A path in theInMsgDescr of the block under consideration showing
    that the key equal toHash(m)is absent inInMsgDescr(i.e., thatm
    has not been included in the current block).
- A proof thatmhas not been included in a preceding block of the same
    shardchain, using the block header information containing the smallest
    and the largest logical time of all messages imported into the block (cf.
    2.3.4–2.3.7for more information).
- A path inInMsgDescrto another included messagem′, such that either
    Lt(m′)>Lt(m), orLt(m′) =Lt(m)andHash(m′)>Hash(m).

2.2.7. Deleting a message from OutMsgQueue. A message must be
deleted fromOutMsgQueue sooner or later; otherwise, the storage used by
OutMsgQueuewould grow to infinity. To this end, several “garbage collection

(^19) In particular, if the hash of a recent block of a neighboring shardchain is not yet
reflected in the latest masterchain block, its modifications toOutMsgQueuemust not be
taken into account.


```
2.2. Hypercube Routing protocol
```
rules” are introduced. They allow the deletion of a message fromOutMs-
gQueueduring the evaluation of a block only if an explicit special “delivery
record” is present in theOutMsgDescr of that block. This record contains
either a reference to the neighboring shardchain block that has included the
message into itsInMsgDescr(the hash of the block is sufficient, but collated
material for the block may contain the relevant Merkle proof), or a Merkle
proof of the fact that the message has been delivered to its final destination
via Instant Hypercube Routing.

2.2.8. Guaranteed message delivery via Hypercube Routing.In this
way, a message cannot be deleted from the outbound message queue unless
it has been either relayed to its next-hop shardchain or delivered to its final
destination (cf.2.2.7). Meanwhile, the message import monotonicity con-
dition (cf.2.2.5) ensures that any message will sooner or later be relayed
into the next shardchain, taking into account other conditions which require
the validators to use at least half of the block’s space or gas limits for im-
porting inbound internal messages (otherwise the validators might choose to
create empty blocks or import only external messages even in the presence
of non-empty outbound message queues at their neighbors).

2.2.9. Message processing order. When several imported messages are
processed by transactions inside a block, themessage processing order con-
ditions ensure that older messages are processed first. More precisely, if a
block contains two transactionstandt′of the same account, which process
inbound messagesm andm′, respectively, andLt(m)< Lt(m′), then we
must haveLt(t)<Lt(t′).

2.2.10. FIFO guarantees of Hypercube Routing.The message process-
ing order conditions (cf.2.2.9), along with the message import monotonicity
conditions (cf.2.2.5), imply theFIFO guarantees for Hypercube Routing.
Namely, if a smart contractξcreates two messagesmandm′with the same
destinationη, andm′ is generated later thanm (meaning that m ≺ m′,
henceLt(m)<Lt(m′)), thenmwill be processed byηbeforem′. This is so
because both messages will follow the same routing steps on the path fromξ
toη(the Hypercube Routing algorithm described in2.1.5is deterministic),
and in all outbound queues and inbound message descriptionsm′will appear
“after”m.^20

(^20) This statement is not as trivial as it seems at first, because some of the shardchains


```
2.2. Hypercube Routing protocol
```
If message m′ can be delivered to B via Instant Hypercube Routing,
this is not necessarily true anymore. Therefore, a simple way of ensuring
FIFO message delivery discipline between a pair of smart contracts consists
in setting a special bit in the message header preventing its delivery via IHR.

2.2.11. Delivery uniqueness guarantees of Hypercube Routing.No-
tice that the message import monotonicity conditions also imply theunique-
ness of the delivery of any message via Hypercube Routing—i.e., that it
cannot be imported and processed by the destination smart contract more
than once. We will see later in2.3that enforcing delivery uniqueness when
both Hypercube Routing and Instant Hypercube Routing are active is more
complicated.

2.2.12. An overview of Hypercube Routing. Let us summarize all
routing steps performed to deliver an internal messagemcreated by source
accountξ 0 to destination accountη. We denote byξk+1:=NextHop(ξk,η),
k= 0, 1 , 2 ,...the intermediate addresses dictated by HR for forwarding the
messagemto its final destinationη. LetSkbe the shard containingξk.

- [Birth] — Messagemwith destinationηis created by a transactiont
    belonging to an accountξ 0 residing in some shardchainS 0. The logical
    creation timeLt(m)is fixed at this point and included into the message
    m.
- [ImmediateProcessing?] — If the destinationη resides in the same
    shardchainS 0 , the message may be processed in the same block it was
    generated in. In this case,mis included intoOutMsgDescrwith a flag
    indicating it has been processed in this very block and need not be for-
    warded further. Another copy ofmis included intoInMsgDescr, along
    with the usual data describing the processing of inbound messages.
    (Notice thatmis not included into theOutMsgQueueofS 0 .)

involved may split or merge during the routing. A correct proof may be obtained by
adopting the ISP perspective to HR as explained in2.1.14and observing thatm′will
always be behindm, either in terms of the intermediate accountchain reached or, if they
happen to be in the same accountchain, in terms of logical creation time.
A crucial observation is that “at any given moment of time” (logically; a more precise
description would be “in the total state obtained after processing any causally closed subset
Fof blocks”), the intermediate accountchains belonging to the same shard are contiguous
on the path fromξtoη(i.e., cannot have accountchains belonging to some other shard in
between). This is a “convexity property” (cf.2.1.10) of the Hypercube Routing algorithm
described in2.1.5.


```
2.2. Hypercube Routing protocol
```
- [InitialInternalRouting] — Ifmeither has a destination outsideS 0 , or
    is not processed in the same block where it was generated, the internal
    routing procedure described in2.1.11is applied, until an indexk is
    found such thatξklies inS 0 , butξk+1=NextHop(ξk,η)does not (i.e.,
    Sk=S 0 , butSk+1 6 =S 0 ). Alternatively, this process stops ifξk=ηor
    ξkcoincides withηin its first 96 bits.
- [OutboundQueuing] — The messagemis included intoOutMsgDescr
    (with the key equal to its hash), with an envelope containing its transit
    addressξkand next-hop addressξk+1as explained in2.1.16and2.1.15.
    The same enveloped message is also included in theOutMsgQueueof
    the state ofSk, with the key equal to the concatenation of the first 96
    bits of its next-hop addressξk+1(which may be equal toηifηbelongs
    toSk) and the message hashHash(m).
- [QueueWait] — Messagemwaits in theOutMsgQueueof shardchainSk
    to be forwarded further. In the meantime, shardchainSkmay split or
    merge with other shardchains; in that case, the new shardSk′containing
    the transit addressξkinheritsmin itsOutMsgQueue.
- [ImportInbound] — At some point in the future, the validators for the
    shardchainSk+1containing the next-hop addressξk+1scan theOutMs-
    gQueuein the state of shardchainSkand decide to import messagem
    in keeping with the monotonicity condition (cf.2.2.5) and other condi-
    tions. A new block for shardchainSk+1is generated, with an enveloped
    copy ofmincluded in itsInMsgDescr. The entry inInMsgDescrcon-
    tains also thereason for importingminto this block, with a hash of
    the most recent block of shardchainS′k, and the previous next-hop and
    transit addressesξk andξk+1, so that the corresponding entry in the
    OutMsgQueueofSk′ can be easily located.
- [Confirmation] — This entry in theInMsgDescrofSk+1also serves as a
    confirmation forSk′. In a later block ofSk′, messagemmust be removed
    from theOutMsgQueueofS′k; this modification is reflected in a special
    entry in theOutMsgDescrof the block ofSk′ that performs this state
    modification.
- [Forwarding?] — If the final destination η of mdoes not reside in
    Sk+1, the message isforwarded. Hypercube Routing is applied until


### 2.3 Instant Hypercube Routing and combined delivery guarantees

```
some ξl,l > k, and ξl+1= NextHop(ξl,η)are obtained, such that
ξl lies inSk+1, but ξl+1does not (cf.2.1.11). After that, a newly-
enveloped copy ofmwith transit address set toξland next-hop address
ξl+1 is included into both theOutMsgDescr of the current block of
Sk+1and theOutMsgQueueof the new state ofSk+1. The entry ofm
inInMsgDescr contains a flag indicating that the message has been
forwarded; the entry in OutMsgDescr contains the newly-enveloped
message and a flag indicating that this is a forwarded message. Then all
the steps starting from [OutboundQueueing] are repeated, forlinstead
ofk.
```
- [Processing?] — If the final destinationηofmresides inSk+1, then
    the block of Sk+1 that imported the message must process it by a
    transaction tincluded in the same block. In this case, InMsgDescr
    contains a reference totby its logical timeLt(t), and a flag indicating
    that the message has been processed.

The above message routing algorithm does not take into account some fur-
ther modifications required to implement Instant Hypercube Routing (IHR).
For instance, a message may bediscarded after being imported (listed in
InMsgDescr) into its final or intermediate shardchain block, because a proof
of delivery via IHR to the final destination is presented. In this case, such
a proof must be included intoInMsgDescr to explain why the message was
not forwarded further or processed.

2.3 Instant Hypercube Routing and combined delivery

guarantees

This section describes the Instant Hypercube Routing protocol, normally
applied by TON Blockchain in parallel to the previously discussed Hypercube
Routing protocol to achieve faster message delivery. However, when both
Hypercube Routing and Instant Hypercube Routing are applied to the same
message in parallel, achieving delivery and unique delivery guarantees is more
complicated. This topic is also discussed in this section.

2.3.1. An overview of Instant Hypercube Routing.Let us explain the
major steps applied when the Instant Hypercube Routing (IHR) mechanism
is applied to a message. (Notice that normally both the usual HR and IHR


```
2.3. Instant Hypercube Routing and combined delivery guarantees
```
work in parallel for the same message; some provisions must be taken to
guarantee the uniqueness of delivery of any message.)
Consider the routing and delivery of the same messagemwith sourceξ
and destinationηas discussed in2.2.12:

- [NetworkSend] — After the validators ofS 0 have agreed on and signed
    the block containing the creating transaction tfor m, and observed
    that the destinationηofmdoes not reside insideS 0 , they may send
    a datagram (encrypted network message), containing the messagem
    along with a Merkle proof of its inclusion into theOutMsgDescr of
    the block just generated, to the validator group of the shardchainT
    currently owning the destinationη.
- [NetworkReceive] — If the validators of shardchainT receive such a
    message, they check its validity starting from the most recent master-
    chain block and the shardchain block hashes listed in it, including the
    most recent “canonical” block of shardchainS 0 as well. If the message
    is invalid, they silently discard it. If that block of shardchainS 0 has
    a larger sequence number than the one listed in the most recent mas-
    terchain block, they may either discard it or postpone the verification
    until the next masterchain block appears.
- [InclusionConditions] — The validators check inclusion conditions for
    messagem. In particular, they must check that this message has not
    been delivered before, and that theOutMsgQueues of the neighbors do
    not have unprocessed outbound messages with destinations inT with
    smaller logical creation times thanLt(m).
- [Deliver] — The validators deliver and process the message, by includ-
    ing it into theInMsgDescrof the current shardchain block along with
    a bit indicating that it is an IHR message, the Merkle proof of its inclu-
    sion into theOutMsgDescr of the original block, and the logical time
    of the transactiont′processing this inbound message into the currently
    generated block.
- [Confirm] — Finally, the validators send encrypted datagrams to all
    the validator groups of the intermediate shardchains on the path from
    ξ toη, containing a Merkle proof of the inclusion of messageminto
    theInMsgDescr of its final destination. The validators of an interme-
    diate shardchain may use this proof todiscard the copy of message


```
2.3. Instant Hypercube Routing and combined delivery guarantees
```
```
mtravelling by the rules of HR, by importing the message into their
InMsgDescr along with the Merkle proof of final delivery and setting
a flag indicating that the message has been discarded.
```
The overall procedure is even simpler than that for Hypercube Routing.
Notice, however, that IHR comes with no delivery or FIFO guarantees: the
network datagram may be lost in transit, or the validators of the destination
shardchain may decide not to act on it, or they may discard it due to buffer
overflow. This is the reason why IHR is used as a complement to HR, and
not as a replacement.

2.3.2. Overall eventual delivery guarantees.Notice that the combina-
tion of HR and IHR guarantees the ultimate delivery of any internal message
to its final destination. Indeed, the HR by itself is guaranteed to deliver any
message eventually, and the HR for messagemcan be cancelled at an inter-
mediate stage only by a Merkle proof of delivery ofmto its final destination
(via IHR).

2.3.3. Overall unique delivery guarantees. However, theuniqueness
of message delivery for the combination of HR and IHR is more difficult
to achieve. In particular, one must check the following conditions, and, if
necessary, be able to provide short Merkle proofs that they do or don’t hold:

- When a messagemis imported into its next intermediate shardchain
    block via HR, we must check thatmhas not already been imported
    via HR.
- Whenmis imported and processed in its final destination shardchain,
    we must check thatmhas not already been processed. If it has, there
    are three subcases:
       - Ifmis being considered for import via HR, and it has already
          been imported via HR, it must not be imported at all.
       - Ifmis being considered for import via HR, and it has already
          been imported via IHR (but not HR), then it must be imported
          and immediately discarded (without being processed by a trans-
          action). This is necessary to removemfrom theOutMsgQueueof
          its previous intermediate shardchain.


```
2.3. Instant Hypercube Routing and combined delivery guarantees
```
- Ifmis being considered for import via IHR, and it has already
    been imported via either IHR or HR, it must not be imported at
    all.

2.3.4. Checking whether a message has already been delivered to
its final destination.Consider the following general algorithm for checking
whether a messagemhas already been delivered to its final destinationη:
One can simply scan the last several blocks belonging to the shardchain
containing the destination address, starting from the latest block and working
backwards through the previous block references. (If there are two previous
blocks—i.e., if a shardchain merge event occurred at some point—one would
follow the chain containing the destination address.) TheInMsgDescr of
each of these blocks can be checked for an entry with keyHash(m). If such
an entry is found, the messagem has already been delivered, and we can
easily construct a Merkle proof of this fact. If we do not find such an entry
before arriving at a blockBwithLt+(B)<Lt(m), implying thatmcould
not be delivered inBor any of its predecessors, then the messagemdefinitely
has not been delivered yet.
The obvious disadvantage of this algorithm is that, if messagemis very
old (and most likely delivered a long time ago), meaning that it has a small
value ofLt(m), then a large number of blocks will need to be scanned before
yielding an answer. Furthermore, if the answer is negative, the size of the
Merkle proof of this fact will increase linearly with the number of blocks
scanned.

2.3.5. Checking whether an IHR message has already been deliv-
ered to its final destination. To check whether an IHR messagemhas
already been delivered to its destination shardchain, we can apply the gen-
eral algorithm described above (cf.2.3.4), modified to inspect only the last
cblocks for some small constantc (say, c= 8). If no conclusion can be
reached after inspecting these blocks, then the validators for the destination
shardchain may simply discard the IHR message instead of spending more
resources on this check.

2.3.6. Checking whether an HR message has already been delivered
via HR to its final destination or an intermediate shardchain. To
check whether an HR-received messagem (or rather, a messagem being
considered for import via HR) has already been imported via HR, we can
use the following algorithm: Letξkbe the transit address ofm(belonging to


```
2.3. Instant Hypercube Routing and combined delivery guarantees
```
a neighboring shardchainSk) andξk+1be its next-hop address (belonging to
the shardchain under consideration). Since we are considering the inclusion
ofm, mmust be present in theOutMsgQueue of the most recent state of
shardchainSk, withξk andξk+1indicated in its envelope. In particular, (a)
the message has been included intoOutMsgQueue, and we may even know
when, because the entry inOutMsgQueuesometimes contains the logical time
of the block where it has been added, and (b) it has not yet been removed
fromOutMsgQueue.
Now, the validators of the neighboring shardchain are required to remove
a message fromOutMsgQueue as soon as they observe that message (with
transit and next-hop addressesξkandξk+1in its envelope) has been imported
into theInMsgDescr of the message’s next-hop shardchain. Therefore, (b)
implies that the message could have been imported into theInMsgDescr
of a preceding block only if this preceding block is very new (i.e., not yet
known to the most recent neighboring shardchain block). Therefore, only
a very limited number of preceding blocks (typically one or two, at most)
need to be scanned by the algorithm described in2.3.4to conclude that
the message has not yet been imported.^21 In fact, if this check is performed
by the validators or collators for the current shardchain themselves, it can
be optimized by keeping in memory theInMsgDescrs of the several latest
blocks.

2.3.7. Checking whether an HR message has already been delivered
via IHR to its final destination.Finally, to check whether an HR message
has already been delivered to its final destination via IHR, one can use the
general algorithm described in2.3.4. In contrast with2.3.5, we cannot abort
the verification process after scanning a fixed number of the latest blocks in
the destination shardchain, because HR messages cannot be dropped without
a reason.
Instead, we indirectly bound the number of blocks to be inspected by
forbidding the inclusion of IHR messagem into a blockB of its destina-
tion shardchain if there are already more than, say,c= 8blocksB′in the
destination shardchain withLt+(B′)≥Lt(m).
Such a condition effectively restricts the time interval after the creation
of messagemin which it could have been delivered via IHR, so that only a
small number of blocks of the destination shardchain (at mostc) will need

(^21) One must not only look up the keyHash(m)in theInMsgDescrof these blocks, but
also check the intermediate addresses in the envelope of the corresponding entry, if found.


```
2.3. Instant Hypercube Routing and combined delivery guarantees
```
to be inspected.
Notice that this condition nicely aligns with the modified algorithm de-
scribed in2.3.5, effectively forbidding the validators from importing the
newly-received IHR message if more thanc= 8steps are needed to check
that it had not been imported already.


### 3.1 Address, currency, and message layout

## 3 Messages, message descriptors, and queues

This chapter presents the internal layout of individual messages, message
descriptors (such asInMsgDescrorOutMsgDescr), and message queues (such
asOutMsgQueue). Enveloped messages (cf.2.1.16) are also discussed here.
Notice that most general conventions related to messages must be obeyed
by all shardchains, even if they do not belong to the basic shardchain; other-
wise, messaging and interaction between different workchains would not be
possible. It is theinterpretationof the message contents and theprocessing
of messages, usually by some transactions, that differs between workchains.

3.1 Address, currency, and message layout

This chapter begins with some general definitions, followed by the precise
layout of addresses used for serializing source and destination addresses in a
message.

3.1.1. Some standard definitions. For the reader’s convenience, we re-
produce here several general TL-B definitions.^22 These definitions are used
below in the discussion of address and message layout, but otherwise are not
related to the TON Blockchain.

unit$_ = Unit;
true$_ = True;
// EMPTY False;
bool_false$0 = Bool;
bool_true$1 = Bool;
nothing$0 {X:Type} = Maybe X;
just$1 {X:Type} value:X = Maybe X;
left$0 {X:Type} {Y:Type} value:X = Either X Y;
right$1 {X:Type} {Y:Type} value:Y = Either X Y;
pair$_ {X:Type} {Y:Type} first:X second:Y = Both X Y;

bit$_ _:(## 1) = Bit;

3.1.2. TL-B scheme for addresses. The serialization of source and des-
tination addresses is defined by the following TL-B scheme:

(^22) A description of an older version of TL may be found athttps://core.telegram.
org/mtproto/TL. Alternatively, an informal introduction to TL-B schemes may be found
in [4, 3.3.4].


```
3.1. Address, currency, and message layout
```
addr_none$00 = MsgAddressExt;
addr_extern$01 len:(## 8) external_address:(len * Bit)
= MsgAddressExt;
anycast_info$_ depth:(## 5) rewrite_pfx:(depth * Bit) = Anycast;
addr_std$10 anycast:(Maybe Anycast)
workchain_id:int8 address:uint256 = MsgAddressInt;
addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)
workchain_id:int32 address:(addr_len * Bit) = MsgAddressInt;
_ MsgAddressInt = MsgAddress;
_ MsgAddressExt = MsgAddress;

The two last lines define typeMsgAddressto be the internal union of types
MsgAddressIntandMsgAddressExt(not to be confused with their external
unionEither MsgAddressInt MsgAddressExtas defined in3.1.1), as if the
preceding four lines had been repeated with the right-hand side replaced by
MsgAddress. In this way, typeMsgAddresshas four constructors, and types
MsgAddressIntandMsgAddressExtare both subtypes ofMsgAddress.

3.1.3. External addresses. The first two constructors, addr_none and
addr_extern, are used for source addresses of “messages from nowhere”
(inbound external messages), and for destination addresses of “messages to
nowhere” (outbound external messages). Theaddr_externconstructor de-
fines an “external address”, which is ignored by the TON Blockchain software
altogether (which treatsaddr_externas a longer variant ofaddr_none), but
may be used by external software for its own purposes. For example, a special
external service may inspect the destination address of all outbound external
messages found in all blocks of the TON Blockchain, and, if a special magic
number is present in theexternal_addressfield, parse the remainder as an
IP address and UDP port or a (TON Network) ADNL address, and send a
datagram with a copy of the message to the network address thus obtained.

3.1.4. Internal addresses. The two remaining constructors, addr_std
andaddr_var, represent internal addresses. The first of them,addr_std,
represents a signed 8-bitworkchain_id(sufficient for the masterchain and for
the basic workchain) and a 256-bit internal address in the selected workchain.
The second of them,addr_var, represents addresses in workchains with a
“large”workchain_id, or internal addresses of length not equal to 256. Both
of these constructors have an optional anycast value, absent by default,


```
3.1. Address, currency, and message layout
```
which enables “address rewriting” when present.^23
The validators must useaddr_stdinstead ofaddr_varwhenever possible,
but must be ready to acceptaddr_varin inbound messages. Theaddr_var
constructor is intended for future extensions.
Notice thatworkchain_idmust be a valid workchain identifier enabled in
the current masterchain configuration, and the length of the internal address
must be in the range allowed for the indicated workchain. For example,
one cannot useworkchain_id= 0(basic workchain) orworkchain_id=− 1
(masterchain) with addresses that are not exactly 256 bits long.

3.1.5. Representing Gram currency amounts. Amounts of Grams are
expressed with the aid of two types representing variable-length unsigned
or signed integers, plus a typeGrams explicitly dedicated to representing
non-negative amounts of nanograms, as follows:

var_uint$_ {n:#} len:(#< n) value:(uint (len * 8))
= VarUInteger n;
var_int$_ {n:#} len:(#< n) value:(int (len * 8))
= VarInteger n;
nanograms$_ amount:(VarUInteger 16) = Grams;

If one wants to representxnanograms, one selects an integer` < 16 such
thatx < 28 `, and serializes first`as an unsigned 4-bit integer, thenxitself
as an unsigned 8 `-bit integer. Notice that four zero bits represent a zero
amount of Grams.
Recall (cf. [3, A]) that the original total supply of Grams is fixed at
five billion (i.e., 5 · 1018 < 263 nanograms), and is expected to grow very
slowly. Therefore, all the amounts of Grams encountered in practice will fit
in unsigned or even signed 64-bit integers. The validators may use the 64-bit
integer representation of Grams in their internal computations; however, the
serialization of these values the blockchain is another matter.

3.1.6. Representing collections of arbitrary currencies. Recall that
the TON Blockchain allows its users to define arbitrary cryptocurrencies

(^23) Address rewritingis a feature used to implement “anycast addresses” employed by
the so-calledlargeorglobalsmart contracts (cf. [3, 2.3.18]), which can have instances in
several shardchains. When address rewriting is enabled, a message may be routed to and
processed by a smart contract with an address coinciding with the destination address up
to the firstdbits, whered≤ 32 is the “splitting depth” of the smart contract indicated in
theanycast.depthfield (cf.2.1.7). Otherwise, the addresses must match exactly.


```
3.1. Address, currency, and message layout
```
or tokens apart from the Gram, provided some conditions are met. Such
additional cryptocurrencies are identified by 32-bitcurrency_ids. The list of
defined additional cryptocurrencies is a part of the blockchain configuration,
stored in the masterchain.
When some amounts of one or several such cryptocurrencies need to be
represented, a dictionary (cf. [4, 3.3]) with 32-bitcurrency_ids as keys and
VarUInteger 32values is used:

extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32))
= ExtraCurrencyCollection;
currencies$_ grams:Grams other:ExtraCurrencyCollection
= CurrencyCollection;

The value attached to an internal message is represented by a value of
theCurrencyCollectiontype, which may describe a certain (non-negative)
amount of (nano)grams as well as some additional currencies, if needed. No-
tice that if no additional currencies are required,otherreduces to just one
zero bit.

3.1.7. Message layout. A message consists of itsheader followed by its
body, orpayload. The body is essentially arbitrary, to be interpreted by the
destination smart contract. The message header is standard and is organized
as follows:

int_msg_info$0 ihr_disabled:Bool bounce:Bool
src:MsgAddressInt dest:MsgAddressInt
value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
created_lt:uint64 created_at:uint32 = CommonMsgInfo;
ext_in_msg_info$10 src:MsgAddressExt dest:MsgAddressInt
import_fee:Grams = CommonMsgInfo;
ext_out_msg_info$11 src:MsgAddressInt dest:MsgAddressExt
created_lt:uint64 created_at:uint32 = CommonMsgInfo;

tick_tock$_ tick:Bool tock:Bool = TickTock;

_ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
code:(Maybe ^Cell) data:(Maybe ^Cell)
library:(Maybe ^Cell) = StateInit;


```
3.1. Address, currency, and message layout
```
message$_ {X:Type} info:CommonMsgInfo
init:(Maybe (Either StateInit ^StateInit))
body:(Either X ^X) = Message X;

The meaning of this scheme is as follows.
TypeMessage Xdescribes a message with the body (or payload) of type
X. Its serialization starts withinfoof typeCommonMsgInfo, which comes
in three flavors: for internal messages, inbound external messages, and out-
bound external messages, respectively. All of them have a source address
src and destination address dest, which are external or internal accord-
ing to the chosen constructor. Apart from that, an internal message may
bear somevaluein Grams and other defined currencies (cf.3.1.6), and all
messages generated inside the TON Blockchain have a logical creation time
created_lt(cf.1.4.6) and creation unixtimecreated_at, both automat-
ically set by the generating transaction. The creation unixtime equals the
creation unixtime of the block containing the generating transaction.

3.1.8. Forwarding and IHR fees. Total value of an internal mes-
sage. Internal messages define anihr_feein Grams, which is subtracted
from the value attached to the message and awarded to the validators of the
destination shardchain if they include the message by the IHR mechanism.
Thefwd_feeis the original total forwarding fee paid for using the HR mech-
anism; it is automatically computed from some configuration parameters and
the size of the message at the time the message is generated.
Notice that the total value carried by a newly-created internal outbound
message equals the sum ofvalue,ihr_fee, andfwd_fee. This sum is de-
ducted from the balance of the source account. Of these components, only
valueis always credited to the destination account on message delivery. The
fwd_feeis collected by the validators on the HR path from the source to
the destination, and theihr_feeis either collected by the validators of the
destination shardchain (if the message is delivered via IHR), or credited to
the destination account.

3.1.9. Code and data portions contained in a message.Apart from the
common message information stored ininfo, a message can contain portions
of the destination smart contract’s code and data. This feature is used, for
instance, in the so-calledconstructor messages(cf.1.7.3), which are simply
internal or inbound external messages withcodeand possibly datafields
defined in theirinitportions. If the hash of these fields is correct, and the


```
3.1. Address, currency, and message layout
```
destination smart contract has no code or data, the values from the message
are used instead.^24

3.1.10. Using code and data for other purposes. Workchains other
than the masterchain and the basic workchain are free to use the trees of
cells referred to in thecode,data, andlibraryfields for their own purposes.
The messaging system itself makes no assumptions about their contents; they
become relevant only when a message is processed by a transaction.

3.1.11. Absence of an explicit gas price and gas limit. Notice that
messages do not have an explicit gas price and gas limit. Instead, the gas
price is set globally by the validators for each workchain (it is a special
configurable parameter), and the gas limit for each transaction has also a
default value, which is a configurable parameter; the smart contract itself
may lower the gas limit during its execution if so desired.
For internal messages, the initial gas limit cannot exceed the Gram value
of the message divided by the current gas price. For inbound external mes-
sages, the initial gas limit is very small, and the true gas limit is set by the
receiving smart contract itself, when itacceptsthe inbound message by the
corresponding TVM primitive.

3.1.12. Deserialization of a message payload.The payload, or body, of
a message is deserialized by the receiving smart contract when executed by
TVM. The messaging system itself makes no assumptions about the internal
format of the payload. However, it makes sense to describe the serialization of
supported inbound messages by TL or TL-B schemes with 32-bit constructor
tags, so that the developers of other smart contracts will know the interface
supported by a specific smart contract.
A message is always serialized inside the blockchain as the last field in
a cell. Therefore, the blockchain software may assume that whatever bits
and references left unparsed after parsing the fields of aMessagepreceding
bodybelong to the payloadbody:X, without knowing anything about the
serialization of the typeX.

(^24) More precisely, the information from theinitfield of an inbound message is used
either when the receiving account is uninitialized or frozen with the hash ofStateInit
equal to the one expected by the account, or when the receiving account is active, and its
code or data is an external hash reference matching the hash of the code or data received
in theStateInitof the message.


```
3.1. Address, currency, and message layout
```
3.1.13. Messages with empty payloads.The payload of a message may
happen to be an empty cell slice, having no data bits and no references. By
convention, such messages are used for simple value transfers. The receiving
smart contract is normally expected to process such messages quietly and to
terminate successfully (with a zero exit code), although some smart contracts
may perform non-trivial actions even when receiving a message with empty
payload. For example, a smart contract may check the resulting balance,
and, if it becomes sufficient for a previously postponed action, trigger this
action. Alternatively, the smart contract might want to remember in its per-
sistent storage the amount received and the corresponding sender, in order,
for instance, to distribute some tokens later to each sender proportionally to
the funds transferred.
Notice that even if a smart contract makes no special provisions for mes-
sages with empty payloads and throws an exception while processing such
messages, the received value (minus the gas payment) will still be added to
the balance of the smart contract.

3.1.14. Message source address and logical creation time determine
its generating block. Notice thatthe source address and the logical cre-
ation time of an internal or an outbound external message uniquely determine
the block in which the message has been generated. Indeed, the source ad-
dress determines the source shardchain, and the blocks of this shardchain
are assigned non-intersecting logical time intervals, so only one of them may
contain the indicated logical creation time. This is the reason why no explicit
mention of the generating block is needed in messages.

3.1.15. Enveloped messages. Message envelopes are used for attaching
routing information, such as the current (transit) address and the next-hop
address, to inbound, transit, and outbound messages (cf.2.1.16). The mes-
sage itself is kept in a separate cell and referred to from the message envelope
by a cell reference.

interm_addr_regular$0 use_src_bits:(#<= 96)
= IntermediateAddress;
interm_addr_simple$10 workchain_id:int8 addr_pfx:(64 * Bit)
= IntermediateAddress;
interm_addr_ext$11 workchain_id:int32 addr_pfx:(64 * Bit)
= IntermediateAddress;
msg_envelope cur_addr:IntermediateAddress


### 3.2 Inbound message descriptors

```
next_addr:IntermediateAddress fwd_fee_remaining:Grams
msg:^(Message Any) = MsgEnvelope;
```
The IntermediateAddresstype is used to describe the intermediate ad-
dresses of a message—that is, its current (or transit) addresscur_addr, and
its next-hop addressnext_addr. The first constructorinterm_addr_regular
represents the intermediate address using the optimization described in2.1.15,
by storing the number of the first bits of the intermediate address that are the
same as in the source address; the two other explicitly store the workchain
identifier and the first 64 bits of the address inside that workchain (the re-
maining bits can be taken from the source address). Thefwd_fee_remaining
field is used to explicitly represent the maximum amount of message forward-
ing fees that can be deducted from the message value during the remaining
HR steps; it cannot exceed the value of fwd_feeindicated in the message
itself.

3.2 Inbound message descriptors

This section discussesInMsgDescr, the structure containing a description of
all inbound messages imported into a block.^25

3.2.1. Types and sources of inbound messages.Each inbound message
mentioned inInMsgDescris described by a value of typeInMsg(an “inbound
message descriptor”), which specifies the source of the message, the reason for
its being imported into this block, and some information about its “fate”—its
processing by a transaction or forwarding inside the block.
Inbound messages may be classified as follows:

- Inbound external messages— Need no additional reason for being im-
    ported into the block, but must be immediately processed by a trans-
    action in the same block.
- Internal IHR messages with destination addresses in this block— The
    reason for their being imported into the block includes a Merkle proof of
    their generation (i.e., their inclusion inOutMsgDescr of their original
    block). Such a message must be immediately delivered to its final
    destination and processed by a transaction.

(^25) Strictly speaking,InMsgDescris thetypeof this structure; we deliberately use the
same notation to describe the only instance of this type in a block.


```
3.2. Inbound message descriptors
```
- Internal messages with destinations in this block— The reason for their
    inclusion is their presence inOutMsgQueueof the most recent state of
    a neighboring shardchain,^26 or their presence inOutMsgDescrof this
    very block. This neighboring shardchain is completely determined by
    the transit address indicated in the forwarded message envelope, which
    is replicated in InMsg as well. The “fate” of this message is again
    described by a reference to the processing transaction inside the current
    block.
- Immediately routed internal messages— Essentially a subclass of the
    previous class of messages. In this case, the imported message is one
    of the outbound messages generated in this very block.
- Transit internal messages— Have the same reason for inclusion as the
    previous class of messages. However, they are not processed inside the
    block, but internally forwarded intoOutMsgDescrandOutMsgQueue.
    This fact, along with a reference to the new envelope of the transit
    message, must be registered inInMsg.
- Discarded internal messages with destinations in this block— An in-
    ternal message with a destination in this block may be imported and
    immediately discarded instead of being processed by a transaction if it
    has already been received and processed via IHR in a preceding block
    of this shardchain. In this case, a reference to the previous processing
    transaction must be provided.
- Discarded transit internal messages— Similarly, a transit message may
    be discarded immediately after import if it has already been delivered
    via IHR to its final destination. In this case, a Merkle proof of its
    processing in the final block (as an IHR message) is required.

3.2.2. Descriptor of an inbound message. Each inbound message is
described by an instance of theInMsgtype, which has six constructors cor-
responding to the cases listed above in3.2.1:

msg_import_ext$000 msg:^(Message Any) transaction:^Transaction
= InMsg;
msg_import_ihr$010 msg:^(Message Any) transaction:^Transaction

(^26) Recall that a shardchain is considered a neighbor of itself.


```
3.2. Inbound message descriptors
```
ihr_fee:Grams proof_created:^Cell = InMsg;
msg_import_imm$011 in_msg:^MsgEnvelope
transaction:^Transaction fwd_fee:Grams = InMsg;
msg_import_fin$100 in_msg:^MsgEnvelope
transaction:^Transaction fwd_fee:Grams = InMsg;
msg_import_tr$101 in_msg:^MsgEnvelope out_msg:^MsgEnvelope
transit_fee:Grams = InMsg;
msg_discard_fin$110 in_msg:^MsgEnvelope transaction_id:uint64
fwd_fee:Grams = InMsg;
msg_discard_tr$111 in_msg:^MsgEnvelope transaction_id:uint64
fwd_fee:Grams proof_delivered:^Cell = InMsg;

Notice that the processing transaction is referred to in the first four construc-
tors directly by a cell reference toTransaction, even though the logical time
of the transactiontransaction_lt:uint64would suffice for this purpose.
Internal consistency conditions ensure that the transaction referred to does
belong to the destination smart contract indicated in the message, and that
the inbound message processed by that transaction is indeed the one being
described in thisInMsginstance.
Furthermore, notice thatmsg_import_immcould be distinguished from
msg_import_finby observing that it is the only case when the logical cre-
ation time of the message being processed is greater than or equal to the
(minimal) logical time of the block importing the message.

3.2.3. Collecting forwarding and transit fees from imported mes-
sages. TheInMsg structure is also used to indicate the forwarding and
transit fees collected from inbound messages. The fee itself is indicated in
ihr_fee,fwd_fee, ortransit_feefields; it is absent only in inbound ex-
ternal messages, which use other mechanisms to reward the validators for
importing them. The fees must satisfy the following internal consistency
conditions:

- For external messages (msg_import_ext), there is no forwarding fee.
- For IHR-imported internal messages (msg_import_ihr), the fee equals
    ihr_fee, which must coincide with theihr_feevalue indicated in the
    message itself. Notice thatfwd_feeorfwd_fee_remainingare never
    collected from IHR-imported messages.


```
3.2. Inbound message descriptors
```
- For internal messages delivered to their destination (msg_import_fin
    andmsg_import_imm), the fee equals thefwd_fee_remainingof the
    enveloped inbound messagein_msg. Note that it cannot exceed the
    fwd_feevalue indicated in the message itself.
- For transit messages (msg_import_tr), the fee equals the difference
    between thefwd_fee_remainingvalues indicated in thein_msgand
    out_msgenvelopes.
- For discarded messages, the fee also equals the fwd_fee_remaining
    indicated inin_msg.

3.2.4. Imported value of an inbound message.Each imported message
imports some value—a certain amount of one or more cryptocurrencies—into
the block. This imported value is computed as follows:

- An external message imports no value.
- An IHR-imported message imports itsvalueplus itsihr_fee.
- A delivered or transit internal message imports itsvalueplus itsihr_fee
    plus the value offwd_fee_remainingof itsin_msgenvelope.
- A discarded message imports thefwd_fee_remainingof itsin_msg
    envelope.

Notice that the forwarding and transit fees collected from an imported mes-
sage do not exceed its imported value.

3.2.5. Augmented hashmaps, or dictionaries.Before continuing, let us
discuss the serialization ofaugmentedhashmaps, or dictionaries.
Augmented hashmaps are key-value storage structures with n-bit keys
and values of some typeX, similar to the ordinary hashmaps described in
[4, 3.3]. However, each intermediate node of the Patricia tree representing
an augmented hashmap isaugmentedby a value of typeY.
These augmentation values must satisfy certainaggregation conditions.
Typically,Y is an integer type, and the aggregation condition is that the
augmentation value of a fork must equal the sum of the augmentation values
of its two children. In general, afork evaluation functionS:Y×Y→Y or
S:Y →Y →Y is used instead of the sum. The augmentation value of a
leaf is usually computed from the value stored in that leaf by means of aleaf


```
3.2. Inbound message descriptors
```
evaluation functionL:X→Y. The augmentation value of a leaf may be
stored explicitly in the leaf along with the value; however, in most cases there
is no need for this, because the leaf evaluation functionLis very simple.

3.2.6. Serialization of augmented hashmaps. The serialization of aug-
mented hashmaps withn-bit keys, values of typeX, and augmentation values
of typeY is given by the following TL-B scheme, which is an extension of
the one provided in [4, 3.3.3]:

ahm_edge#_ {n:#} {X:Type} {Y:Type} {l:#} {m:#}
label:(HmLabel ~l n) {n = (~m) + l}
node:(HashmapAugNode m X Y) = HashmapAug n X Y;
ahmn_leaf#_ {X:Type} {Y:Type} extra:Y value:X
= HashmapAugNode 0 X Y;
ahmn_fork#_ {n:#} {X:Type} {Y:Type}
left:^(HashmapAug n X Y) right:^(HashmapAug n X Y) extra:Y
= HashmapAugNode (n + 1) X Y;

ahme_empty$0 {n:#} {X:Type} {Y:Type} extra:Y
= HashmapAugE n X Y;
ahme_root$1 {n:#} {X:Type} {Y:Type} root:^(HashmapAug n X Y)
extra:Y = HashmapAugE n X Y;

3.2.7. Augmentation ofInMsgDescr.The collection of inbound message
descriptors is augmented by a vector of two currency values, representing the
imported value and the forwarding and transit fees collected from a message
or a collection of messages:

import_fees$_ fees_collected:Grams
value_imported:CurrencyCollection = ImportFees;

3.2.8. Structure ofInMsgDescr.Now theInMsgDescritself is defined as
an augmented hashmap, with 256-bit keys (equal to the representation hashes
of imported messages), values of typeInMsg(cf.3.2.2), and augmentation
values of typeImportFees(cf.3.2.7):

_ (HashmapAugE 256 InMsg ImportFees) = InMsgDescr;

This TL-B notation uses an anonymous constructor_to defineInMsgDescr
as a synonym for another type.


### 3.3 Outbound message queue and descriptors

3.2.9. Aggregation rules for InMsgDescr. The fork evaluation and
leaf evaluation functions (cf.3.2.5) are not included explicitly in the above
notation, because the dependent types of TL-B are not expressive enough for
this purpose. In words, the fork evaluation function is just the componentwise
addition of twoImportFeesinstances, and the leaf evaluation function is
defined by the rules listed in3.2.3and3.2.4. In this way, the root of the
Patricia tree representing an instance ofInMsgDescrcontains anImportFees
instance with the total value imported by all inbound messages, and with
the total forwarding fees collected from them.

3.3 Outbound message queue and descriptors

This section discussesOutMsgDescr, the structure representing all outbound
messages of a block, along with their envelopes and brief descriptions of the
reasons for including them intoOutMsgDescr. This structure also describes
all modifications ofOutMsgQueue, which is a part of the shardchain state.

3.3.1. Types of outbound messages.Outbound messages may be classi-
fied as follows:

- External outbound messages, or “messages to nowhere” — Generated by
    a transaction inside this block. The reason for including such a message
    intoOutMsgDescris simply a reference to its generating transaction.
- Immediately processed internal outbound messages— Generated and
    processed in this very block, and not included intoOutMsgQueue. The
    reason for including such a message is a reference to its generating trans-
    action, and its “fate” is described by a reference to the corresponding
    entry inInMsgDescr.
- Ordinary (internal) outbound messages— Generated in this block and
    included intoOutMsgQueue.
- Transit (internal) outbound messages— Imported into theInMsgDescr
    of the same block and routed via HR until a next-hop address outside
    the current shard is obtained.

3.3.2. Message dequeueing records. Apart from the above types of
outbound messages,OutMsgDescr can contain special “message dequeueing


```
3.3. Outbound message queue and descriptors
```
records”, which indicate that a message has been removed from theOutMs-
gQueuein this block. The reason for this removal is indicated in the message
deletion record; it consists of a reference to the enveloped message being
deleted, and of the logical time of the neighboring shardchain block that has
this enveloped message in itsInMsgDescr.
Notice that on some occasions a message may be imported from the
OutMsgQueueof the current shardchain, internally routed, and then included
intoOutMsgDescr andOutMsgQueueagain with a different envelope.^27 In
this case, a variant of the transit outbound message description is used, which
doubles as a message dequeueing record.

3.3.3. Descriptor of an outbound message.Each outbound message is
described by an instance ofOutMsg:

msg_export_ext$000 msg:^(Message Any)
transaction:^Transaction = OutMsg;
msg_export_imm$010 out_msg:^MsgEnvelope
transaction:^Transaction reimport:^InMsg = OutMsg;
msg_export_new$001 out_msg:^MsgEnvelope
transaction:^Transaction = OutMsg;
msg_export_tr$011 out_msg:^MsgEnvelope
imported:^InMsg = OutMsg;
msg_export_deq$110 out_msg:^MsgEnvelope
import_block_lt:uint64 = OutMsg;
msg_export_tr_req$111 out_msg:^MsgEnvelope
imported:^InMsg = OutMsg;

The last two descriptions have the effect of removing (dequeueing) the mes-
sage fromOutMsgQueueinstead of inserting it. The last one re-inserts the
message intoOutMsgQueuewith a new envelope after performing the internal
routing (cf.2.1.11).

3.3.4. Exported value of an outbound message.Each outbound mes-
sage described by anOutMsgexports some value—a certain amount of one
or more cryptocurrencies—from the block. This exported value is computed
as follows:

(^27) This situation is rare and occurs only after shardchain merge events. Normally the
messages imported from theOutMsgQueueof the same shardchain have destinations inside
this shardchain, and are processed accordingly instead of being re-queued.


```
3.3. Outbound message queue and descriptors
```
- An external outbound message exports no value.
- An internal message, generated in this block, exports itsvalueplus its
    ihr_feeplus itsfwd_fee. Notice thatfwd_feemust be equal to the
    fwd_fee_remainingindicated in theout_msgenvelope.
- A transit message exports itsvalueplus itsihr_feeplus the value of
    fwd_fee_remainingof itsout_msgenvelope.
- The same holds formsg_export_tr_req, the constructor ofOutMsg
    used for re-inserted dequeued messages.
- A message dequeueing record (msg_export_deq; cf.3.3.2) exports no
    value.

3.3.5. Structure ofOutMsgDescr.TheOutMsgDescr itself is simply an
augmented hashmap (cf.3.2.5), with 256-bit keys (equal to the representa-
tion hash of the message), values of typeOutMsg, and augmentation values
of typeCurrencyCollection:

_ (HashmapAugE 256 OutMsg CurrencyCollection) = OutMsgDescr;

The augmentation is theexported valueof the corresponding message, aggre-
gated by means of the sum, and computed at the leaves as explained in3.3.4.
In this way, the total exported value appears near the root of the Patricia
tree representingOutMsgDescr.
The most important consistency condition forOutMsgDescr is that its
entry with keykmust be anOutMsgdescribing a messagemwith represen-
tation hashHash[(m) =k.

3.3.6. Structure ofOutMsgQueue.Recall (cf.1.2.7) thatOutMsgQueue
is a part of the blockchain state, not of a block. Therefore, a block contains
only hash references to its initial and final state, and its newly-created cells.
The structure ofOutMsgQueueis simple: it is just an augmented hashmap
with 352-bit keys and values of typeOutMsg:

_ (HashmapAugE 352 OutMsg uint64) = OutMsgQueue;

The key used for an outbound messagemis the concatenation of its 32-bit
next-hopworkchain_id, the first 64 bits of the next-hop address inside that
workchain, and the representation hashHash[(m)of the messagemitself.


```
3.3. Outbound message queue and descriptors
```
The augmentation is by the logical creation timeLt(m)of messagemat the
leaves, and by the minimum of the augmentation values of the children at
the forks.
The most important consistency condition forOutMsgQueueis that the
value at keykmust indeed contain an enveloped message with the expected
next-hop address and representation hash.

3.3.7. Consistency conditions forOutMsg.Several internal consistency
conditions are imposed onOutMsginstances present inOutMsgDescr. They
include the following:

- Each of the first three constructors of outbound message descriptions
    includes a reference to the generating transaction. This transaction
    must belong to the source account of the message, it must contain a
    reference to the specified message as one of its outbound messages,
    and it must be recoverable by looking it up by its account_idand
    transaction_id.
- msg_export_trandmsg_export_tr_reqmust refer to anInMsg in-
    stance describing the same message (in a different original envelope).
- If one of the first four constructors is used, the message must be absent
    in the initialOutMsgQueueof the block; otherwise, it must be present.
- If msg_export_deqis used, the message must be absent in the final
    OutMsgQueueof the block; otherwise, it must be present.
- If a message is not mentioned inOutMsgDescr, it must be the same in
    the initial and finalOutMsgQueues of the block.


### 4.1 Accounts and their states

## 4 Accounts and transactions

This chapter discusses the layout ofaccounts(orsmart contracts) and their
statein the TON Blockchain. It also considerstransactions, which are the
only way to modify the state of an account, and to process inbound messages
and generate new outbound messages.

4.1 Accounts and their states

Recall that asmart contractand anaccountare the same thing in the context
of the TON Blockchain, and that these terms can be used interchangeably, at
least as long as only small (or “usual”) smart contracts are considered. Alarge
smart contract may employ several accounts lying in different shardchains of
the same workchain for load balancing purposes.
An account isidentifiedby its full address, and iscompletely describedby
its state. In other words, there is nothing else in an account apart from its
address and state.

4.1.1. Account addresses.In general, an account is completely identified
by its full address, consisting of a 32-bitworkchain_id, and the (usually
256-bit)internal address oraccount identifier account_idinside the chosen
workchain. In the basic workchain (workchain_id= 0) and in the master-
chain (workchain_id=− 1 ) the internal address is always 256-bit. In these
workchains,^28 account_id cannot be chosen arbitrarily, but must be equal
to the hash of the initial code and data of the smart contract; otherwise, it
will be impossible to initialize the account with the intended code and data
(cf.1.7.3), and to do anything with the accumulated funds in the account
balance.

4.1.2. Zero account. By convention, the zero account or account with
zero address accumulates the processing, forwarding, and transit fees, as
well as any other payments collected by the validators of the masterchain
or a workchain. Furthermore, the zero account is a “large smart contract”,
meaning that each shardchain has its instance of the zero account, with the
most significant bits of the address adjusted to lie in the shard. Any funds
transferred to the zero account, intentionally or by accident, are effectively

(^28) For simplicity, we sometimes treat the masterchain as just another workchain with
workchain_id=− 1.


```
4.1. Accounts and their states
```
a gift for the validators. For example, a smart contract might destroy itself
by sending all its funds to the zero account.

4.1.3. Small and large smart contracts.By default, smart contracts are
“small”, meaning that they have one account address belonging to exactly
one shardchain at any given moment of time. However, one can create a
“large smart contract of splitting depthd”, meaning that up to 2 dinstances
of the smart contract may be created, with the firstdbits of the original
address of the smart contract replaced by arbitrary bit sequences.^29 One can
send messages to such smart contracts using internal anycast addresses with
anycastset tod(cf.3.1.2). Furthermore, the instances of the large smart
contract are allowed to use this anycast address as the source address of their
generated messages.
An instance of a large smart contract is an account with non-zeromaximal
splitting depthd.

4.1.4. The three kinds of accounts.There are three kinds of accounts:

- Uninitialized— The account only has a balance; its code and data have
    not yet been initialized.
- Active— The account’s code and data have been initialized as well.
- Frozen— The account’s code and data have been replaced by a hash,
    but the balance is still stored explicitly. The balance of a frozen account
    may effectively become negative, reflecting due storage payments.

4.1.5. Storage profile of an account.Thestorage profileof an account is
a data structure describing the amount of persistent blockchain state storage
used by that account. It describes the total amount of cells, data bits, and
internal and external cell references used.

storage_used$_ cells:(VarUInteger 7) bits:(VarUInteger 7)
ext_refs:(VarUInteger 7) int_refs:(VarUInteger 7)
public_cells:(VarUInteger 7) = StorageUsed;

(^29) In fact, up to the firstdbits are replaced in such a way that each shard contains
at most one instance of the large smart contract, and that shards(w,s)with prefixsof
length|s|≤dcontain exactly one instance.


```
4.1. Accounts and their states
```
The same typeStorageUsedmay represent the storage profile of a message,
as required, for instance, to computefwd_fee, the total forwarding fee for
Hypercube Routing. The storage profile of an account has some additional
fields indicating the last time when the storage fees were exacted:

storage_info$_ used:StorageUsed last_paid:uint32
due_payment:(Maybe Grams) = StorageInfo;

Thelast_paidfield contains either the unixtime of the most recent storage
payment collected (usually this is the unixtime of the most recent transac-
tion), or the unixtime when the account was created (again, by a transac-
tion). Thedue_paymentfield, if present, accumulates the storage payments
that could not be exacted from the balance of the account, represented by a
strictly positive amount of nanograms; it can be present only for uninitial-
ized or frozen accounts that have a balance of zero Grams (but may have
non-zero balances in other cryptocurrencies). Whendue_paymentbecomes
larger than the value of a configurable parameter of the blockchain, the ac-
count is destroyed altogether, and its balance, if any, is transferred to the
zero account.

4.1.6. Account description.The state of an account is represented by an
instance of typeAccount, described by the following TL-B scheme:^30

account_none$0 = Account;
account$1 addr:MsgAddressInt storage_stat:StorageInfo
storage:AccountStorage = Account;

account_storage$_ last_trans_lt:uint64
balance:CurrencyCollection state:AccountState
= AccountStorage;

account_uninit$00 = AccountState;
account_active$1 _:StateInit = AccountState;
account_frozen$01 state_hash:uint256 = AccountState;

acc_state_uninit$00 = AccountStatus;
acc_state_frozen$01 = AccountStatus;

(^30) This scheme uses anonymous constructors and anonymous fields, both represented by
an underscore_.


```
4.1. Accounts and their states
```
acc_state_active$10 = AccountStatus;
acc_state_nonexist$11 = AccountStatus;

tick_tock$_ tick:Bool tock:Bool = TickTock;

_ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
code:(Maybe ^Cell) data:(Maybe ^Cell)
library:(Maybe ^Cell) = StateInit;

Notice thataccount_frozencontains the representation hash of an instance
ofStateInit, instead of that instance itself, which would otherwise be con-
tained in anaccount_active;account_uninitis similar toaccount_frozen,
but it does not contain an explicitstate_hash, because it is assumed to be
equal to the internal address of the account (account_id), already present
in theaddrfield. Thesplit_depthfield is present and non-zero only in
instances of large smart contracts. Thespecialfield may be present only
in the masterchain—and within the masterchain, only in somefundamental
smart contracts required for the whole system to function.
The storage statistics kept instorage_statreflect the total storage usage
of cell slice storage. In particular, the bits and cells used to store the
balanceare also reflected instorage_stat.
When a non-existent account needs to be represented, theaccount_none
constructor is used.

4.1.7. Account state as a message from an account to its future
self. Notice that the account state is very similar to a message sent from
an account to its future self participating in the next transaction, for the
following reasons:

- The account state does not change between two consecutive transac-
    tions of the same account, so it is completely similar in this respect to
    a message sent from the earlier transaction to the later one.
- When a transaction is processed, its inputs are an inbound message
    and the previous account state; its outputs are outbound messages
    generated and the next account state. If we treat the state as a special
    kind of message, we see that every transaction has exactly two inputs
    (the account state and an inbound message) and at least one output.


```
4.1. Accounts and their states
```
- Both a message and the account state can carry code and data in an
    instance ofStateInit, and some value in theirbalance.
- An account is initialized by a constructor message, which essentially
    carries the future state and balance of the account.
- On some occasions messages are converted into account states, and
    vice versa. For instance, when a shardchain merge event occurs, and
    two accounts that are instances of the same large contract need to be
    merged, one of them is converted into a message sent to the other
    one (cf.4.2.11). Similarly, when a shardchain split event occurs, and
    an instance of a large smart contract needs to be split into two, this
    is achieved by a special transaction that creates the new instance by
    means of a constructor message sent from the previously existing in-
    stance to the new one (cf.4.2.10).
- One may say that a message is involved in transferring some infor-
    mation across space (between different shardchains, or at least ac-
    countchains), while an account state transfers informationacross time
    (from the past to the future of the same account).

4.1.8. Differences between messages and account states. Of course,
there are important differences, too. For example:

- The account state is transferred only “in time” (for a shardchain block to
    its successor), but never “in space” (from one shardchain to another).
    As a consequence, this transfer is done implicitly, without creating
    complete copies of the account state anywhere in the blockchain.
- Storage payments collected by the validators for keeping the account
    state usually are considerably smaller than message forwarding fees for
    the same amount of data.
- When an inbound message is delivered to an account, it is the code
    from the account that is invoked, not the code from the message.

4.1.9. The combined state of all accounts in a shard. The split part
of the shardchain state (cf.1.2.1and1.2.2) is given by

_ (HashmapAugE 256 Account CurrencyCollection) = ShardAccounts;


```
4.1. Accounts and their states
```
This is simply a dictionary with 256-bitaccount_ids as keys and correspond-
ing account states as values, sum-augmented by the balances of the accounts.
In this way the sum of balances of all accounts in a shardchain is computed,
so that one can easily check the total amount of cryptocurrency “stored” in
a shard.
Internal consistency conditions ensure that the address of an account
referred to by keykinSmartAccounts is indeed equal tok. An additional
internal consistency condition requires that all keyskbegin with the shard
prefixs.

4.1.10. Account owner and interface descriptions. One may want to
include some optional information in a controlled account. For example, an
individual user or a company may want to add a text description field to their
wallet account, with the user’s or company’s name or address (or their hash,
if the information should not be made publicly available). Alternatively, a
smart contract may offer a machine-readable or human-readable description
of its supported methods and their intended application, which might be
used by advanced wallet applications to construct drop-down menus and
forms helping a human user to create valid messages to be sent to that smart
contract.
One way of including such information is to reserve, say, the second ref-
erence in thedatacell of the state of an account for a dictionary with 64-bit
keys (corresponding to some identifiers of the standard types of extra data
one might want to store) and corresponding values. Then a blockchain ex-
plorer would be able to extract the required value, along with a Merkle proof
if necessary.
A better way of doing this is by defining someget methodsin the smart
contract.

4.1.11. Get methods of a smart contract.Get methodsare executed by
a stand-alone instance of TVM with the account’s code and data loaded into
it. The required parameters are passed on the stack (say, a magic number
indicating the field to be fetched or the specific get method to be invoked),
and the results are returned on the TVM stack as well (say, a cell slice
containing the serialization of a string with the account owner’s name).
As a bonus, get methods may be used to get answers to more sophisti-
cated queries than just fetching a constant object. For instance, TON DNS
registry smart contracts provide get methods to look up a domain string in
the registry and return the corresponding record, if found.


### 4.2 Transactions

By convention, get methods use largenegative32-bit or 64-bit indices or
magic numbers, and internal functions of a smart contract use consecutive
positive indices, to be used in TVM’sCALLDICTinstruction. Themain()
function of a smart contract, used to process inbound messages in ordinary
transactions, always has index zero.

4.2 Transactions

According to the Infinite Sharding Paradigm and the actor model, the three
principal components of the TON Blockchain areaccounts(along with their
states),messages,andtransactions. Previous sections have already discussed
the first two; this section considers transactions.
In contrast with messages, which have essentially the same headers through-
out all workchains of the TON Blockchain, and accounts, which have at least
some common parts (the address and the balance), our discussion of trans-
actions is necessarily limited to the masterchain and the basic workchain.
Other workchains may define completely different kinds of transactions.

4.2.1. Logical time of a transaction. Each transactionthas a logical
time intervalLt•(t) = [Lt−(t),Lt+(t))assigned to it (cf.1.4.6and1.4.3).
By convention, a transactiontgeneratingnoutbound messagesm 1 ,... ,mn
is assigned a logical time interval of lengthn+ 1, so that

```
Lt+(t) =Lt−(t) +n+ 1. (16)
```
We also setLt(t) :=Lt−(t), and assign the logical creation time of message
mi, where 1 ≤i≤n, by

```
Lt(mi) =Lt−(mi) :=Lt−(t) +i, Lt+(mi) :=Lt−(mi) + 1. (17)
```
In this way, each generated outbound message is assigned its own unit interval
inside the logical time intervalLt•(t)of transactiont.

4.2.2. Logical time uniquely identifies transactions and outbound
messages of an account. Recall that the conditions imposed on logical
time imply thatLt−(t)≥Lt+(t′)for any preceding transactiont′of the same
accountξ, and thatLt−(t)>Lt(m)ifmis the inbound message processed
by transactiont. In this way, the logical time intervals of transactions of
the same account do not intersect each other, and as a consequence, the
logical time intervals of all outbound messages generated by an account do


```
4.2. Transactions
```
not intersect each other either. In other words, allLt(m)are different, when
mruns through all outbound messages of the same accountξ.
In this way,Lt(t)andLt(m), when combined with an account identifier
ξ, uniquely determine a transactiont or an outbound messagemof that
account. Furthermore, if one has an ordered list of all transactions of an
account along with their logical times, it is easy to find the transaction that
generated a given outbound messagem, simply by looking up the transaction
twith logical timeLt(t)nearest toLt(m)from below.

4.2.3. Generic components of a transaction. Each transactiontcon-
tains or indirectly refers to the following data:

- The accountξto which the transaction belongs.
- The logical timeLt(t)of the transaction.
- One or zero inbound messagesmprocessed by the transaction.
- The number of generated outbound messagesn≥ 0.
- The outbound messagesm 1 ,... ,mn.
- The initial state of accountξ(including its balance).
- The final state of accountξ(including its balance).
- The total fees collected by the validators.
- A detailed description of the transaction containing all or some data
    needed to validate it, including the kind of the transaction (cf.4.2.4)
    and some of the intermediate steps performed.

Of these components, all but the very last one are quite general and might
appear in other workchains as well.

4.2.4. Kinds of transactions.There are different kinds of transactions al-
lowed in the masterchain and the shardchains.Ordinarytransactions consist
in the delivery of one inbound message to an account, and its processing by
that account’s code; this is the most common kind of transaction. Addition-
ally, there are several kinds ofexotictransactions.
Altogether, there are six kinds of transactions:


```
4.2. Transactions
```
- Ordinary transactions— Belong to an accountξ. They process exactly
    one inbound messagem(described inInMsgDescrof the encompassing
    block) with destinationξ, compute the new state of the account, and
    generate several outbound messages (registered inOutMsgDescr) with
    sourceξ.
- Storage transactions— Can be inserted by validators at their discre-
    tion. They do not process any inbound message and do not invoke any
    code. Their only effect is to collect storage payments from an account,
    affecting its storage statistics and its balance. If the resulting Gram
    balance of the account becomes less than a certain amount, the account
    may be frozen and its code and data replaced by their combined hash.
- Tick transactions— Automatically invoked for certain special accounts
    (smart contracts) in the masterchain that have thetickflag set in
    their state, as the very first transactions in every masterchain block.
    They have no inbound message, but may generate outbound messages
    and change the account state. For instance, validator elections are
    performed by tick transactions of special smart contracts in the mas-
    terchain.
- Tock transactions — Similarly automatically invoked as the very last
    transactions in every masterchain block for certain special accounts.
- Split transactions — Invoked as the last transactions of shardchain
    blocks immediately preceding a shardchain split event. They are trig-
    gered automatically for instances of large smart contracts that need to
    produce a new instance after splitting.
- Merge transactions — Similarly invoked as the first transactions of
    shardchain blocks immediately after a shardchain merge event, if an
    instance of a large smart contract needs to be merged with another
    instance of the same smart contract.

Notice that out of these six kinds of transactions, only four can occur in the
masterchain, and another subset of four can occur in the basic workchain.

4.2.5. Phases of an ordinary transaction. An ordinary transaction
is performed in several phases, which may be thought of as several “sub-
transactions” tightly bound into one:


```
4.2. Transactions
```
- Storage phase— Collects due storage payments for the account state
    (including smart-contract code and data, if present) up to the present
    time. The smart contract may be frozen as a result. If the smart
    contract did not exist before, the storage phase is absent.
- Credit phase— The account is credited with the value of the inbound
    message received.
- Computing phase— The code of the smart contract is invoked inside
    an instance of TVM with adequate parameters, including a copy of the
    inbound message and of the persistent data, and terminates with an exit
    code, the new persistent data, and anaction list(which includes, for
    instance, outbound messages to be sent). The processing phase may
    lead to the creation of a new account (uninitialized or active), or to
    the activation of a previously uninitialized or frozen account. Thegas
    payment, equal to the product of the gas price and the gas consumed,
    is exacted from the account balance.
- Action phase— If the smart contract has terminated successfully (with
    exit code 0 or 1), the actions from the list are performed. If it is
    impossible to perform all of them—for example, because of insufficient
    funds to transfer with an outbound message—then the transaction is
    aborted and the account state is rolled back. The transaction is also
    aborted if the smart contract did not terminate successfully, or if it was
    not possible to invoke the smart contract at all because it is uninitialized
    or frozen.
- Bounce phase— If the transaction has been aborted, and the inbound
    message has itsbounceflag set, then it is “bounced” by automatically
    generating an outbound message (with the bounceflag clear) to its
    original sender. Almost all value of the original inbound message (mi-
    nus gas payments and forwarding fees) is transferred to the generated
    message, which otherwise has an empty body.

4.2.6. Bouncing inbound messages to non-existent accounts.Notice
that if an inbound message with itsbounceflag set is sent to a previously
non-existent account, and the transaction is aborted (for instance, because
there is no code and data with the correct hash in the inbound message, so
the virtual machine could not be invoked at all), then the account is not


```
4.2. Transactions
```
created even as an uninitialized account, since it would have zero balance
and no code and data anyways.^31

4.2.7. Processing of an inbound message is split between computing
and action phases. Notice that the processing of an inbound message is
in fact split into two phases: thecomputing phase and the action phase.
During the computing phase, the virtual machine is invoked and the necessary
computations are performed, but no actions outside the virtual machine are
taken. In other words,the execution of a smart contract in TVM has no side
effects; there is no way for a smart contract to interact with the blockchain
directly during its execution. Instead, TVM primitives such asSENDMSG
simply store the required action (e.g., the outbound message to be sent) into
the action list being gradually accumulated in TVM control registerc5. The
actions themselves are postponed until the action phase, during which the
user smart contract is not invoked at all.

4.2.8. Reasons for splitting the processing into computation and
action phases.Some reasons for such an arrangement are:

- It is simpler to abort the transaction if the smart contract eventually
    terminates with an exit code other than 0 or 1.
- The rules for processing output actions may be changed without mod-
    ifying the virtual machine. (For instance, new output actions may be
    introduced.)
- The virtual machine itself may be modified or even replaced by another
    one (for instance, in a new workchain) without changing the rules for
    processing output actions.
- The execution of the smart contract inside the virtual machine is com-
    pletely isolated from the blockchain and is apure computation. As a
    consequence, this execution may bevirtualized inside the virtual ma-
    chine itself by means of TVM’sRUNVMprimitive, a useful feature for
    validator smart contracts and for smart contracts controlling payment

(^31) In particular, if a user mistakenly sends some funds to a non-existent address in a
bounceable message, the funds will not be wasted, but rather will be returned (bounced)
back. Therefore, a user wallet application should set thebounceflag in all generated mes-
sages by default unless explicitly instructed otherwise. However, non-bounceable messages
are indispensable in some situations (cf.1.7.6).


```
4.2. Transactions
```
```
channels and other sidechains. Additionally, the virtual machine may
beemulatedinside itself or a stripped-down version of itself, a useful
feature for validating the execution of smart contracts inside TVM.^32
```
4.2.9. Storage, tick, and tock transactions. Storage transactions are
very similar to a stand-alone storage phase of an ordinary transaction. Tick
and tock transactions are similar to ordinary transactions without credit and
bounce phases, because there is no inbound message.

4.2.10. Split transactions.Split transactions in fact consist of two trans-
actions. If an accountξneeds to be split into two accountsξandξ′:

- First asplit prepare transaction, similar to a tock transaction (but in
    a shardchain instead of the masterchain), is issued for account ξ. It
    must be the last transaction forξ in a shardchain block. The output
    of the processing stage of a split prepare transaction consists not only
    of the new state of accountξ, but also of the new state of accountξ′,
    represented by a constructor message toξ′(cf.4.1.7).
- Then asplit install transaction is added for accountξ′, with a refer-
    ence to the corresponding split prepare transaction. The split install
    transaction must be the only transaction for a previously non-existent
    accountξ′in the block. It effectively sets the state ofξ′as defined by
    the split prepare transaction.

4.2.11. Merge transactions.Merge transactions also consist of two trans-
actions each. If an accountξ′needs to be merged into accountξ:

- First amerge prepare transactionis issued forξ′, which converts all of
    its persistent state and balance into a special constructor message with
    destinationξ(cf.4.1.7).
- Then amerge install transaction forξ, referring to the corresponding
    merge prepare transaction, processes that constructor message. The
    merge install transaction is similar to a tick transaction in that it must
    be the first transaction forξin a block, but it is located in a shardchain
    block, not in the masterchain, and it has a special inbound message.

(^32) A reference implementation of a TVM emulator running in a stripped-down version
of TVM may be committed into the masterchain to be used when a disagreement between
the validators on a specific run of TVM arises. In this way, flawed implementations of
TVM may be detected. The reference implementation then serves as an authoritative
source on the operational semantics of TVM. (Cf. [4, B.2])


```
4.2. Transactions
```
4.2.12. Serialization of a general transaction. Any transaction con-
tains the fields listed in4.2.3. As a consequence, there are some common
components in all transactions:

transaction$_ account_addr:uint256 lt:uint64 outmsg_cnt:uint15
orig_status:AccountStatus end_status:AccountStatus
in_msg:(Maybe ^(Message Any))
out_msgs:(HashmapE 15 ^(Message Any))
total_fees:Grams state_update:^(MERKLE_UPDATE Account)
description:^TransactionDescr = Transaction;

!merkle_update#02 {X:Type} old_hash:uint256 new_hash:uint256
old:^X new:^X = MERKLE_UPDATE X;

The exclamation mark in the TL-B declaration of amerkle_updateindicates
special processing required for such values. In particular, they must be kept
in a separate cell, which must be marked asexoticby a bit in its header
(cf. [4, 3.1]).
A full explanation of the serialization of TransactionDescr, which de-
scribes one transaction according to its kind listed in4.2.4, can be found
in4.3.

4.2.13. Representation of outbound messages generated by a trans-
action. The outbound messages generated by a transactiontare kept in
a dictionary out_msgs with 15-bit keys equal to 0, 1,... ,n− 1 , where
n=outmsg_cntis the number of generated outbound messages. Message
mi+1 with index 0 ≤ i < n must have Lt(mi+1) = Lt(t) +i+ 1, and
Lt(t) =Lt−(t)is explicitly stored in theltfield.

4.2.14. Consistency conditions for transactions. The common serial-
ization of the fields present in aTransaction, independent of its type and
description, enables us to impose several “external” consistency conditions
on any transaction. The most important of them involves thevalue flowin-
side the transaction: the sum of all inputs (the import value of the inbound
message plus the original balance of the account) must equal the sum of all
outputs (the resulting balance of the account, plus the sum of the export
values of all outbound messages, plus all storage, processing, and forwarding
fees collected by the validators). In this way, a surface inspection of a trans-
action, which processes an inbound message with an import value of 1 Gram


```
4.2. Transactions
```
received by an account with an initial balance of 10 Grams, generating an
outbound message with an export value of 100 Grams in the process, will
reveal its invalidity even before checking all the details of the TVM execution.
Other consistency conditions may slightly depend on the description of
the transaction. For instance, the inbound message processed by an ordinary
transaction must be registered in theInMsgDescrof the encompassing block,
and the corresponding record must contain a reference to this transaction.
Similarly, all outbound messages generated by all transactions (with the ex-
ception of one special message generated by a split prepare or merge prepare
transaction) must be registered inOutMsgDescr.

4.2.15. Collection of all transactions of an account.All transactions in
a block belonging to the same accountξare collected into an “accountchain
block” AccountBlock, which essentially is a dictionarytransactionswith
64-bit keys, each equal to the logical time of the corresponding transaction:

acc_trans$_ account_addr:uint256
transactions:(HashmapAug 64 ^Transaction Grams)
state_update:^(MERKLE_UPDATE Account)
= AccountBlock;

Thetransactionsdictionary is sum-augmented by a Gramsvalue, which
aggregates the total fees collected from these transactions.
In addition to this dictionary, anAccountBlockcontains a Merkle update
(cf. [4, 3.1]) of the total state of the account. If an account did not exist
before the block, its state is represented by anaccount_none.

4.2.16. Consistency conditions forAccountBlocks. There are several
general consistency conditions imposed on anAccountBlock. In particular:

- The transaction appearing as a value in the augmentedtransactions
    dictionary must have itsltvalue equal to its key.
- All transactions must belong to an account whose addressaccount_addr
    is indicated in theAccountBlock.
- Iftandt′are two transactions withLt(t)<Lt(t′), and their keys are
    consecutive intransactions, meaning that there is no transactiont′′
    withLt(t)<Lt(t′′)<Lt(t′), then the final state oftmust correspond
    to the initial state oft′(their hashes as explicitly indicated in the Merkle
    updates must be equal).


### 4.3 Transaction descriptions

- Iftis the transaction with minimalLt(t), its initial state must coincide
    with the initial state as indicated instate_updateof theAccountBlock.
- Iftis the transaction with maximalLt(t), its final state must coincide
    with the final state as indicated instate_updateof theAccountBlock.
- The list of transactions must be non-empty.

These conditions simply express the fact that the state of an account may
change only as the result of performing a transaction.

4.2.17. Collection of all transactions in a block. All transactions in a
block are represented by (cf.1.2.1):

_ (HashmapAugE 256 AccountBlock Grams) = ShardAccountBlocks;

4.2.18. Consistency conditions for the collection of all transactions.
Again, consistency conditions are imposed on this structure, requiring that
the value at keyξ be anAccountBlock with address equal toξ. Further
consistency conditions relate this structure with the initial and final states
of the shardchain indicated in the block, requiring that:

- IfShardAccountBlockhas no keyξ, then the state of accountξin the
    initial and in the final state of the block must coincide (or it must be
    absent from both).
- Ifξ is present inShardAccountBlock, its initial and final states as in-
    dicated inAccountBlockmust match those indicated in the initial and
    final states of the shardchain block, expressed by instances ofShardAc-
    counts(cf.4.1.9).

These conditions express that the shardchain state is indeed composed out
of the states of separate accountchains.

4.3 Transaction descriptions

This section presents the specific TL-B schemes for transaction descriptions
according to the classification provided in4.2.4.


```
4.3. Transaction descriptions
```
4.3.1. Reasons for omitting data from a transaction description.A
transaction description for a blockchain featuring a Turing-complete virtual
machine for smart-contract execution is necessarily incomplete. Indeed, a
truly complete description would contain all the intermediate states of the
virtual machine after each instruction is executed, something that cannot fit
into a blockchain block of a reasonable size. Therefore, the description of
such a transaction is likely to contain only the total number of steps and the
hashes of the initial and final states of the virtual machine. The validation of
such a transaction will necessarily involve the execution of the smart contract
to reproduce all the intermediate steps and the final result.
If we compress the sequence of all intermediate steps of the virtual ma-
chine into just the hashes of the initial and final states, then no transaction
details at all need to be included: a validator able to check the execution of
the virtual machine by itself would also be able to check all the other actions
of the transaction starting from its initial data without these details.

4.3.2. Reasons for including data into a transaction description.
The above considerations notwithstanding, there are still several reasons to
introduce some details in the transaction description:

- We want to impose external consistency conditions on the transaction,
    so that at least the validity of the value flow inside the transaction
    and the validity of inbound and outbound messages can be quickly
    checked without invoking the virtual machine (cf.4.2.14). This at least
    guarantees the invariance of the total amount of each cryptocurrency
    in the blockchain, even if it does not guarantee the correctness of its
    distribution.
- We want to be able to trace principal state changes of an account (such
    as its being created, activated, or frozen) by inspecting the data stored
    in the transaction description, without figuring out the missing details
    of the transaction. This simplifies the verification of the consistency
    conditions between the accountchain and shardchain states in a block.
- Finally, certain information—such as the total steps of the virtual
    machine, the hashes of its initial and final states, the total gas con-
    sumed, and the exit code—might considerably simplify the debugging
    and implementation of the TON Blockchain software. (This informa-
    tion would help a human programmer understand what has happened
    in a particular blockchain block.)


```
4.3. Transaction descriptions
```
On the other hand, we want to minimize the size of each transaction, be-
cause we want to maximize the number of transactions that can fit into each
(bounded-size) block. Therefore, all information not required for one of the
above reasons is omitted.

4.3.3. Description of a storage phase. The storage phase is present in
several kinds of transactions, so a common representation for this phase is
used:

tr_phase_storage$_ storage_fees_collected:Grams
storage_fees_due:(Maybe Grams)
status_change:AccStatusChange
= TrStoragePhase;

acst_unchanged$0 = AccStatusChange; // x -> x
acst_frozen$10 = AccStatusChange; // init -> frozen
acst_deleted$11 = AccStatusChange; // frozen -> deleted

4.3.4. Description of a credit phase. The credit phase can result in the
collection of some due payments:

tr_phase_credit$_ due_fees_collected:(Maybe Grams)
credit:CurrencyCollection = TrCreditPhase;

The sum ofdue_fees_collectedandcreditmust equal the value of the
message received, plus itsihr_feeif the message has not been received via
IHR (otherwise theihr_feeis awarded to the validators).

4.3.5. Description of a computing phase.The computing phase consists
in invoking TVM with correct inputs. On some occasions, TVM cannot be
invoked at all (e.g., if the account is absent, not initialized, or frozen, and the
inbound message being processed has no code or data fields or these fields
have an incorrect hash); this is reflected by corresponding constructors.

tr_phase_compute_skipped$0 reason:ComputeSkipReason
= TrComputePhase;
tr_phase_compute_vm$1 success:Bool msg_state_used:Bool
account_activated:Bool gas_fees:Grams
_:^[ gas_used:(VarUInteger 7)
gas_limit:(VarUInteger 7) gas_credit:(Maybe (VarUInteger 3))


```
4.3. Transaction descriptions
```
mode:int8 exit_code:int32 exit_arg:(Maybe int32)
vm_steps:uint32
vm_init_state_hash:uint256 vm_final_state_hash:uint256 ]
= TrComputePhase;
cskip_no_state$00 = ComputeSkipReason;
cskip_bad_state$01 = ComputeSkipReason;
cskip_no_gas$10 = ComputeSkipReason;

The TL-B construct_:ˆ[...] describes a reference to a cell containing the
fields listed inside the square brackets. In this way, several fields can be
moved from a cell containing a large record into a separate subcell.

4.3.6. Skipped computing phase. If the computing phase has been
skipped, possible reasons include:

- The absence of funds to buy gas.
- The absence of a state (i.e., smart-contract code and data) in both the
    account (non-existing, uninitialized, or frozen) and the message.
- An invalid state passed in the message (i.e., the state’s hash differs
    from the expected value) to a frozen or uninitialized account.

4.3.7. Valid computing phase. If there is no reason to skip the comput-
ing phase, TVM is invoked and the results of the computation are logged.
Possible parameters are as follows:

- Thesuccessflag is set if and only ifexit_codeis either 0 or 1.
- Themsg_state_usedparameter reflects whether the state passed in
    the message has been used. If it is set, theaccount_activatedflag re-
    flects whether this has resulted in the activation of a previously frozen,
    uninitialized or non-existent account.
- Thegas_feesparameter reflects the total gas fees collected by the val-
    idators for executing this transaction. It must be equal to the product
    ofgas_usedandgas_pricefrom the current block header.
- The gas_limit parameter reflects the gas limit for this instance of
    TVM. It equals the lesser of either the Grams credited in the credit
    phase from the value of the inbound message divided by the current
    gas price, or the global per-transaction gas limit.


```
4.3. Transaction descriptions
```
- Thegas_creditparameter may be non-zero only for external inbound
    messages. It is the lesser of either the amount of gas that can be paid
    from the account balance or the maximum gas credit.
- Theexit_codeandexit_argsparameters represent the status values
    returned by TVM.
- Thevm_init_state_hashandvm_final_state_hashparameters are
    the representation hashes of the original and resulting states of TVM,
    andvm_stepsis the total number of steps performed by TVM (usu-
    ally equal to two plus the number of instructions executed, including
    implicitRETs).^33

4.3.8. Description of the action phase.The action phase occurs after a
valid computation phase. It attempts to perform the actions stored by TVM
during the computing phase into theaction list. It may fail, because the
action list may turn out to be too long, contain invalid actions, or contain
actions that cannot be completed (for instance, because of insufficient funds
to create an outbound message with the required value).

tr_phase_action$_ success:Bool valid:Bool no_funds:Bool
status_change:AccStatusChange
total_fwd_fees:(Maybe Grams) total_action_fees:(Maybe Grams)
result_code:int32 result_arg:(Maybe int32) tot_actions:int16
spec_actions:int16 msgs_created:int16
action_list_hash:uint256 tot_msg_size:StorageUsed
= TrActionPhase;

4.3.9. Description of the bounce phase.

tr_phase_bounce_negfunds$00 = TrBouncePhase;
tr_phase_bounce_nofunds$01 msg_size:StorageUsed
req_fwd_fees:Grams = TrBouncePhase;
tr_phase_bounce_ok$1 msg_size:StorageUsed
msg_fees:Grams fwd_fees:Grams = TrBouncePhase;

4.3.10. Description of an ordinary transaction.

(^33) Notice that this record does not represent a change in the state of the account, because
the transaction may still be aborted during the action phase. In that case, the new
persistent data indirectly referenced byvm_final_state_hashwill be discarded.


```
4.3. Transaction descriptions
```
trans_ord$0000 storage_ph:(Maybe TrStoragePhase)
credit_ph:(Maybe TrCreditPhase)
compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
aborted:Bool bounce:(Maybe TrBouncePhase)
destroyed:Bool
= TransactionDescr;

Several consistency conditions are imposed on this structure:

- actionis absent if and only if the computing phase was unsuccessful.
- Theabortedflag is set either if there is no action phase or if the action
    phase was unsuccessful.
- The bounce phase occurs only if theabortedflag is set and the inbound
    message was bounceable.

4.3.11. Description of a storage transaction. A storage transaction
consists just of one stand-alone storage phase:

trans_storage$0001 storage_ph:TrStoragePhase
= TransactionDescr;

4.3.12. Description of tick and tock transactions.Tick and tock trans-
actions are similar to ordinary transactions without an inbound message, so
there are no credit or bounce phases:

trans_tick_tock$001 is_tock:Bool storage:TrStoragePhase
compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
aborted:Bool destroyed:Bool = TransactionDescr;

4.3.13. Split prepare and install transactions. A split prepare trans-
action is similar to a tock transaction in a masterchain, but it must gener-
ate exactly one special constructor message; otherwise, the action phase is
aborted.

split_merge_info$_ cur_shard_pfx_len:(## 6)
acc_split_depth:(## 6) this_addr:uint256 sibling_addr:uint256
= SplitMergeInfo;
trans_split_prepare$0100 split_info:SplitMergeInfo
compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)


### 4.4 Invoking smart contracts in TVM

aborted:Bool destroyed:Bool
= TransactionDescr;
trans_split_install$0101 split_info:SplitMergeInfo
prepare_transaction:^Transaction
installed:Bool = TransactionDescr;

Notice that the split install transaction for the new sibling accountξ′refers to
its corresponding split prepare transaction of the previously existing account
ξ.

4.3.14. Merge prepare and install transactions.A merge prepare trans-
action converts the state and balance of an account into a message, and a
subsequent merge install transaction processes this state:

trans_merge_prepare$0110 split_info:SplitMergeInfo
storage_ph:TrStoragePhase aborted:Bool
= TransactionDescr;
trans_merge_install$0111 split_info:SplitMergeInfo
prepare_transaction:^Transaction
credit_ph:(Maybe TrCreditPhase)
compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
aborted:Bool destroyed:Bool
= TransactionDescr;

4.4 Invoking smart contracts in TVM

This section describes the exact parameters with which TVM is invoked
during the computing phase of ordinary and other transactions.

4.4.1. Smart-contract code. Thecodeof a smart contract is normally
a part of the account’s persistent state, at least if the account is active
(cf.4.1.6). However, a frozen or uninitialized (or non-existent) account has
no persistent state, with the possible exception of the account’s balance and
the hash of its intended state (equal to the account address for uninitialized
accounts). In this case, the code must be supplied in theinitfield of the
inbound message being processed by the transaction (cf.3.1.7).

4.4.2. Smart-contract persistent data. Thepersistent data of a smart
contract is kept alongside its code, and remarks similar to those made above
in4.4.1apply. In this respect, the code and persistent data of a smart


```
4.4. Invoking smart contracts in TVM
```
contract are just two parts of its persistent state, which differ only in the
way they are treated by TVM during smart-contract execution.

4.4.3. Smart-contract library environment.Thelibrary environmentof
a smart contract is a hashmap mapping 256-bit cell (representation) hashes
into the corresponding cells themselves. When an external cell reference is
accessed during the execution of a smart contract, the cell referred to is looked
up in the library environment and the external cell reference is transparently
replaced by the cell found.
The library environment for an invocation of a smart contract is computed
as follows:

1. The global library environment for the workchain in question is taken
    from the current state of the masterchain.^34
2. Next, it is augmented by the local library environment of the smart con-
    tract, stored in thelibraryfield of the smart contract’s state. Only
    256-bit keys equal to the hashes of the corresponding value cells are
    taken into account. If a key is present in both the global and lo-
    cal library environments, the local environment takes precedence while
    merging the two library environments.
3. Finally, the message library stored in the libraryfield of theinit
    field of the inbound message is similarly taken into account. Notice,
    however, that if the account is frozen or uninitialized, thelibrary
    field of the message is part of the suggested state of the account, and
    is used instead of the local library environment in the previous step.
    The message library has lower precedence than both the local and the
    global library environments.

4.4.4. The initial state of TVM.A new instance of TVM is initialized
prior to the execution of a smart contract as follows:

- The originalcc(current continuation) is initialized using the cell slice
    created from the cellcode, containing the code of the smart contract
    computed as described in4.4.1.

(^34) The most common way of creating shared libraries for TVM is to publish a reference
to the root cell of the library in the masterchain.


```
4.4. Invoking smart contracts in TVM
```
- Thecp(TVM codepage) is set to zero. If the smart contract wants to
    use another TVM codepagex, it must switch to it by usingSETCODEPAGE
    xas the first instruction of its code.
- Control registerc0(return continuation) is initialized by extraordinary
    continuationec_quitwith parameter 0. When executed, this contin-
    uation leads to a termination of TVM with exit code 0.
- Control registerc1(alternative return continuation) is initialized by
    extraordinary continuationec_quitwith parameter 1. When invoked,
    it leads to a termination of TVM with exit code 1. (Notice that termi-
    nating with exit code 0 or 1 is considered a successful termination.)
- Control registerc2(exception handler) is initialized by extraordinary
    continuationec_quit_exc. When invoked, it takes the top integer from
    the stack (equal to the exception number) and terminates TVM with
    exit code equal to that integer. In this way, by default all exceptions
    terminate the smart-contract execution with exit code equal to the
    exception number.
- Control registerc3(code dictionary) is initialized by the cell with the
    smart-contract code, similarly to the initial current continuation (cc).
- Control registerc4(root of persistent data) is initialized by the persis-
    tent data of the smart contract.^35
- Control registerc5(root of actions) is initialized by an empty cell. The
    “output action” primitives of TVM, such asSENDMSG, usec5to accumu-
    late the list of actions (e.g., outbound messages) to be performed upon
    successful termination of the smart contract (cf.4.2.7and4.2.8).
- Control register c7(root of temporary data) is initialized by a sin-
    gletonTuple, the only component of which is a Tuple containing an
    instance ofSmartContractInfowith smart contract balance and other
    useful information (cf.4.4.10). The smart contract may replace the
    temporary data, especially all components of theTupleatc7but the
    first one, with whatever other temporary data it may require. However,

(^35) The persistent data of the smart contract need not be loaded in its entirety for this to
occur. Instead the root is loaded, and TVM may load other cells by their references from
the root only when they are accessed, thus providing a form of virtual memory.


```
4.4. Invoking smart contracts in TVM
```
```
the original content of theSmartContractInfoat the first component of
theTupleheld inc7is inspected and sometimes modified bySENDMSG
TVM primitives and other “output action” primitives of TVM.
```
- Thegas limitsgas= (gm,gl,gc,gr)are initialized as follows:
    - Themaximal gas limit gm is set to the lesser of either the total
       Gram balance of the smart contract (after the the credit phase—
       i.e., combined with the value of the inbound message) divided by
       the current gas price, or the per-execution global gas limit.^36
    - Thecurrent gas limit glis set to the lesser of either the Gram
       value of the inbound message divided by the gas price, or the
       global per-execution gas limit. In this way, alwaysgl≤gm. For
       inbound external messagesgl = 0, since they cannot carry any
       value.
    - The gas credit gcis set to zero for inbound internal messages,
       and to the lesser of eithergm or a fixed small value (the default
       external message gas credit, a configurable parameter) for inbound
       external messages.
    - Finally, theremaining gas limit gris automatically initialized by
       gl+gc.

4.4.5. The initial stack of TVM for processing an internal mes-
sage. After TVM is initialized as described in4.4.4, its stack is initialized
by pushing the arguments to themain()function of the smart contract as
follows:

- The Gram balancebof the smart contract (after crediting the value of
    the inbound message) is passed as anInteger amount of nanograms.
- The Gram balancebm of inbound messagemis passed as anInteger
    amount of nanograms.
- The inbound messagemis passed as a cell, which contains a serialized
    value of typeMessageX, whereXis the type of the message body.

(^36) Both the global gas limit and the gas price are configurable parameters determined
by the current state of the masterchain.


```
4.4. Invoking smart contracts in TVM
```
- The bodymb:Xof the inbound message, equal to the value of field
    bodyofm, is passed as a cell slice.
- Finally, thefunction selector s, anInteger normally equal to zero, is
    pushed into the stack.

After that, the code of the smart contract, equal to its initial value ofc3, is
executed. It selects the correct function according tos, which is expected to
process the remaining arguments to the function and terminate afterwards.

4.4.6. Processing an inbound external message. An inbound exter-
nal message is processed similarly to4.4.4and 4.4.5, with the following
modifications:

- The function selectorsis set to− 1 , not to 0.
- The Gram balancebmof inbound message is always 0.
- The initial current gas limitglis always 0. However, the initial gas
    creditgc> 0.

The smart contract must terminate withgc= 0orgr≥gc; otherwise, the
transaction and the block containing it are invalid. Validators or collators
suggesting a block candidate must never include transactions processing in-
bound external messages that are invalid.

4.4.7. Processing tick and tock transactions.The TVM stack for pro-
cessing tick and tock transactions (cf.4.2.4) is initialized by pushing the
following values:

- The Gram balancebof the current account in nanograms (anInteger).
- The 256-bit addressξ of the current account inside the masterchain,
    represented by an unsignedInteger.
- An integer equal to 0 for tick transactions and to− 1 for tock transac-
    tions.
- The function selectors, equal to− 2.

4.4.8. Processing split prepare transactions. For processing split pre-
pare transactions (cf.4.3.13), the TVM stack is initialized by pushing the
following values:


```
4.4. Invoking smart contracts in TVM
```
- The Gram balancebof the current account.
- ASlicecontainingSplitMergeInfo(cf.4.3.13).
- The 256-bit addressξof the current account.
- The 256-bit addressξ ̃of the sibling account.
- An integer 0 ≤d≤ 63 , equal to the position of the only bit in whichξ
    andξ ̃differ.
- The function selectors, equal to− 3.

4.4.9. Processing merge install transactions. For processing merge
install transactions (cf.4.3.14), the TVM stack is initialized by pushing the
following values:

- The Gram balancebof the current account (already combined with the
    Gram balance of the sibling account).
- The Gram balanceb′ of the sibling account, taken from the inbound
    messagem.
- The messagemfrom the sibling account, automatically generated by
    a merge prepare transaction. Itsinitfield contains the final stateS ̃
    of the sibling account.
- The stateS ̃of the sibling account, represented by aStateInit(cf.3.1.7).
- ASlicecontainingSplitMergeInfo(cf.4.3.13).
- The 256-bit addressξof the current account.
- The 256-bit addressξ ̃of the sibling account.
- An integer 0 ≤d≤ 63 , equal to the position of the only bit in whichξ
    andξ ̃differ.
- The function selectors, equal to− 4.

4.4.10. Smart-contract information. The smart-contract information
structureSmartContractInfo, passed in the first component of theTuplecon-
tained in control registerc7, is also aTuplecontaining the following data:


```
4.4. Invoking smart contracts in TVM
```
[ magic:0x076ef1ea actions:Integer msgs_sent:Integer
unixtime:Integer block_lt:Integer trans_lt:Integer
rand_seed:Integer balance_remaining:[Integer (Maybe Cell)]
myself:MsgAddressInt global_config:(Maybe Cell)
] = SmartContractInfo;

In other words, the first component of this tuple is anIntegermagicalways
equal to0x076ef1ea, the second component is anIntegeractions, originally
initialized by zero, but incremented by one whenever an output action is
installed by a non-RAWoutput action primitive of the TVM, and so on. The
remaining balance is represented by a pair, i.e., a two-component Tuple:
the first component is the nanogram balance, and the second component is a
dictionary with 32-bit keys representing all other currencies, if any (cf.3.1.6).
Therand_seedfield (an unsigned 256-bit integer) here is initialized deter-
ministically starting from therand_seedof the block, the account address,
the hash of the inbound message being processed (if any), and the transaction
logical timetrans_lt.

4.4.11. Serialization of output actions. Theoutput actionsof a smart
contract are accumulated in a linked list stored in control registerc5. The
list of output actions is serialized as a value of typeOutListn, wherenis
the length of the list:

out_list_empty$_ = OutList 0;
out_list$_ {n:#} prev:^(OutList n) action:OutAction
= OutList (n + 1);
action_send_msg#0ec3c86d out_msg:^(Message Any) = OutAction;
action_set_code#ad4de08e new_code:^Cell = OutAction;


### 5.1 Shardchain block layout

## 5 Block layout

This chapter presents the block layout used by the TON Blockchain, combin-
ing the data structures described separately in previous chapters to produce a
complete description of a shardchain block. In addition to the TL-B schemes
that define the representation of a shardchain block by a tree of cells, this
chapter describes exact serialization formats for the resulting bags (collec-
tions) of cells, which are necessary to represent a shardchain block as a file.
Masterchain blocks are similar to shardchain blocks, but have some ad-
ditional fields. The necessary modifications are discussed separately in5.2.

5.1 Shardchain block layout

This section lists the data structures that must be contained in a shardchain
block and in the shardchain state, and concludes by presenting a formal TL-B
scheme for a shardchain block.

5.1.1. Components of the shardchain state.The shardchain state con-
sists of:

- ShardAccounts, the split part of the shardchain state (cf.1.2.2) con-
    taining the state of all accounts assigned to this shard (cf.4.1.9).
- OutMsgQueue, the output message queue of the shardchain (cf.3.3.6).
- SharedLibraries, the description of all shared libraries of the shardchain
    (for now, non-empty only in the masterchain).
- The logical time and the unixtime of the last modification of the state.
- The total balance of the shard.
- A hash reference to the most recent masterchain block, indirectly de-
    scribing the state of the masterchain and, through it, the state of all
    other shardchains of the TON Blockchain (cf.1.5.2).

5.1.2. Components of a shardchain block. A shardchain block must
contain:

- A list ofvalidator signatures(cf.1.2.6), which is external with respect
    to all other contents of the block.


```
5.1. Shardchain block layout
```
- BlockHeader, containing general information about the block (cf.1.2.5)
- Hash references to the immediately preceding block or blocks of the
    same shardchain, and to the most recent masterchain block.
- InMsgDescr andOutMsgDescr, the inbound and outbound message
    descriptors (cf.3.2.8and3.3.5).
- ShardAccountBlocks, the collection of all transactions processed in the
    block (cf.4.2.17) along with all updates of the states of the accounts
    assigned to the shard. This is thesplit part of the shardchain block
    (cf.1.2.2).
- Thevalue flow, describing the total value imported from the preceding
    blocks of the same shardchain and from inbound messages, the total
    value exported by outbound message, the total fees collected by val-
    idators, and the total value remaining in the shard.
- AMerkle update (cf. [4, 3.1]) of the shardchain state. Such a Merkle
    update contains the hashes of the initial and final shardchain states
    with respect to the block, along with all new cells of the final state
    that have been created while processing the block.^37

5.1.3. Common parts of the block layout for all workchains.Recall
that different workchains may define their own rules for processing messages,
other types of transactions, other components of the state, and other ways to
serialize all this data. However, some components of the block and its state
must be common for all workchains in order to maintain the interoperability
between different workchains. Such common components include:

- OutMsgQueue, the outbound message queue of a shardchain, which is
    scanned by neighboring shardchains for messages addressed to them.
- The outer structure ofInMsgDescr as a hashmap with 256-bit keys
    equal to the hashes of the imported messages. (The inbound message
    descriptors themselves need not have the same structure.)

(^37) In principle, an experimental version of TON Blockchain might choose to keep only
the hashes of the initial and final states of the shardchain. The Merkle update increases
the block size, but it is handy for full nodes that want to keep and update their copy of
the shardchain state. Otherwise, the full nodes would have to repeat all the computations
contained in a block to compute the updated state of the shardchain by themselves.


```
5.1. Shardchain block layout
```
- Some fields in the block header identifying the shardchain and the
    block, along with the paths from the block header to the other infor-
    mation indicated in this list.
- The value flow information.

5.1.4. TL-B scheme for the shardchain state. The shardchain state
(cf.1.2.1and5.1.1) is serialized according to the following TL-B scheme:

ext_blk_ref$_ start_lt:uint64 end_lt:uint64
seq_no:uint32 hash:uint256 = ExtBlkRef;

master_info$_ master:ExtBlkRef = BlkMasterInfo;

shard_ident$00 shard_pfx_bits:(## 6)
workchain_id:int32 shard_prefix:uint64 = ShardIdent;

shard_state shard_id:ShardIdent
out_msg_queue:OutMsgQueue
total_balance:CurrencyCollection
total_validator_fees:CurrencyCollection
accounts:ShardAccounts
libraries:(HashmapE 256 LibDescr)
master_ref:(Maybe BlkMasterInfo)
custom:(Maybe ^McStateExtra)
= ShardState;

The fieldcustomis usually present only in the masterchain and contains all
the masterchain-specific data. However, other workchains may use the same
cell reference to refer to their specific state data.

5.1.5. Shared libraries description. Shared libraries currently can be
present only in masterchain blocks. They are described by an instance of
HashmapE(256,LibDescr), where the 256-bit key is the representation hash
of the library, andLibDescrdescribes one library:

shared_lib_descr$00 lib:^Cell publishers:(Hashmap 256 True)
= LibDescr;

Herepublishersis a hashmap with keys equal to the addresses of all ac-
counts that have published the corresponding shared library. The shared


```
5.1. Shardchain block layout
```
library is preserved as long as at least one account keeps it in its published
libraries collection.

5.1.6. TL-B scheme for an unsigned shardchain block. The precise
format of anunsigned(cf.1.2.6) shardchain block is given by the following
TL-B scheme:

block_info version:uint32
not_master:(## 1)
after_merge:(## 1) before_split:(## 1) flags:(## 13)
seq_no:# vert_seq_no:#
shard:ShardIdent gen_utime:uint32
start_lt:uint64 end_lt:uint64
master_ref:not_master?^BlkMasterInfo
prev_ref:seq_no?^(BlkPrevInfo after_merge)
prev_vert_ref:vert_seq_no?^(BlkPrevInfo 0)
= BlockInfo;

prev_blk_info#_ {merged:#} prev:ExtBlkRef
prev_alt:merged?ExtBlkRef = BlkPrevInfo merged;

unsigned_block info:^BlockInfo value_flow:^ValueFlow
state_update:^(MERKLE_UPDATE ShardState)
extra:^BlockExtra = Block;

block_extra in_msg_descr:^InMsgDescr
out_msg_descr:^OutMsgDescr
account_blocks:ShardAccountBlocks
rand_seed:uint256
custom:(Maybe ^McBlockExtra) = BlockExtra;

The fieldcustomis usually present only in the masterchain and contains all
the masterchain-specific data. However, other workchains may use the same
cell reference to refer to their specific block data.

5.1.7. Description of total value flow through a block.The total value
flow through a block is serialized according to the following TL-B scheme:

value_flow _:^[ from_prev_blk:CurrencyCollection
to_next_blk:CurrencyCollection


```
5.1. Shardchain block layout
```
```
imported:CurrencyCollection
exported:CurrencyCollection ]
fees_collected:CurrencyCollection
_:^[
fees_imported:CurrencyCollection
created:CurrencyCollection
minted:CurrencyCollection
] = ValueFlow;
```
Recall that_:ˆ[.. .]is a TL-B construction indicating that a group of fields
has been moved into a separate cell. The last three fields may be non-zero
only in masterchain blocks.

5.1.8. Signed shardchain block. A signed shardchain block is just an
unsigned block augmented by a collection of validator signatures:

ed25519_signature#5 R:uint256 s:uint256 = CryptoSignature;

signed_block block:^Block blk_serialize_hash:uint256
signatures:(HashmapE 64 CryptoSignature)
= SignedBlock;

Theserialization hashblk_serialize_hashof the unsigned blockblockis
essentially a hash of a specific serialization of the block into an octet string
(cf.5.3.12 for a more detailed explanation). The signatures collected in
signaturesare Ed25519-signatures (cf.A.3) made with a validator’s private
keys of thesha256of the concatenation of the 256-bit representation hash of
the blockblockand of its 256-bit serialization hashblk_serialize_hash.
The 64-bit keys in dictionarysignaturesrepresent the first 64 bits of the
public keys of the corresponding validators.

5.1.9. Serialization of a signed block.The overall procedure of serializing
and signing a block may be described as follows:

1. An unsigned blockBis generated, transformed into a complete bag of
    cells (cf.5.3.2), and serialized into an octet stringSB.
2. Validators sign the 256-bit combined hash

```
HB:=sha256
```
#### (

```
Hash∞(B).HashM(SB)
```
#### )

#### (18)

```
of the representation hash ofBand of the Merkle hash of its serializa-
tionSB.
```

### 5.2 Masterchain block layout

3. A signed shardchain blockB ̃is generated fromBand these validator
    signatures as described above (cf.5.1.8).
4. This signed block B ̃ is transformed into an incomplete bag of cells,
    which contains only the validator signatures, but the unsigned block
    itself is absent from this bag of cells, being its only absent cell.
5. This incomplete bag of cells is serialized, and its serialization is prepended
    to the previously constructed serialization of the unsigned block.

The result is the serialization of the signed block into an octet string. It may
be propagated by network or stored into a disk file.

5.2 Masterchain block layout

Masterchain blocks are very similar to shardchain blocks of the basic work-
chain. This section lists some of the modifications needed to obtain the
description of a masterchain block from the description of a shardchain block
given in5.1.

5.2.1. Additional components present in the masterchain state. In
addition to the components listed in5.1.1, the masterchain state must con-
tain:

- ShardHashes— Describes the current shard configuration, and contains
    the hashes of the latest blocks of the corresponding shardchains.
- ShardFees— Describes the total fees collected by the validators of each
    shardchain.
- ShardSplitMerge — Describes future shard split/merge events. It is
    serialized as a part ofShardHashes.
- ConfigParams— Describes the values of all configurable parameters of
    the TON Blockchain.

5.2.2. Additional components present in masterchain blocks. In
addition to the components listed in5.1.2, each masterchain block must
contain:


```
5.2. Masterchain block layout
```
- ShardHashes — Describes the current shard configuration, and con-
    tains the hashes of the latest blocks of the corresponding shardchains.
    (Notice that this component is also present in the masterchain state.)

5.2.3. Description of ShardHashes. ShardHashes is represented by a
dictionary with 32-bitworkchain_ids as keys, and “shard binary trees”, rep-
resented by TL-B type BinTree ShardDescr, as values. Each leaf of this
shard binary tree contains a value of typeShardDescr, which describes a sin-
gle shard by indicating the sequence numberseq_no, the logical timelt, and
the hashhashof the latest (signed) block of the corresponding shardchain.

bt_leaf$0 {X:Type} leaf:X = BinTree X;
bt_fork$1 {X:Type} left:^(BinTree X) right:^(BinTree X)
= BinTree X;

fsm_none$0 = FutureSplitMerge;
fsm_split$10 mc_seqno:uint32 = FutureSplitMerge;
fsm_merge$11 mc_seqno:uint32 = FutureSplitMerge;

shard_descr$_ seq_no:uint32 lt:uint64 hash:uint256
split_merge_at:FutureSplitMerge = ShardDescr;

_ (HashmapE 32 ^(BinTree ShardDescr)) = ShardHashes;

Fieldsmc_seqnooffsm_splitandfsm_mergeare used to signal future shard
merge or split events. Shardchain blocks referring to masterchain blocks with
sequence numbers up to, but not including, the one indicated inmc_seqnoare
generated in the usual way. Once the indicated sequence number is reached,
a shard merge or split event must occur.
Notice that the masterchain itself is omitted fromShardHashes(i.e., 32-
bit index− 1 is absent from this dictionary).

5.2.4. Description ofShardFees. ShardFeesis a masterchain structure
used to reflect the total fees collected so far by the validators of a shardchain.
The total fees reflected in this structure are accumulated in the masterchain
by crediting them to a special account, whose address is a configurable pa-
rameter. Typically this account is the smart contract that computes and
distributes the rewards to all validators.

bta_leaf$0 {X:Type} {Y:Type} leaf:X extra:Y = BinTreeAug X Y;


```
5.2. Masterchain block layout
```
bta_fork$1 {X:Type} {Y:Type} left:^(BinTreeAug X Y)
right:^(BinTreeAug X Y) extra:Y = BinTreeAug X Y;

_ (HashmapAugE 32 ^(BinTreeAug True CurrencyCollection)
CurrencyCollection) = ShardFees;

The structure ofShardFeesis similar to that ofShardHashes(cf.5.2.3), but
the dictionary and binary trees involved are augmented by currency values,
equal to thetotal_validator_feesvalues of the final states of the corre-
sponding shardchain blocks. The value aggregated at the root ofShardFees
is added together with thetotal_validator_feesof the masterchain state,
yielding the total TON Blockchain validator fees. The increase of the value
aggregated at the root ofShardFeesfrom the initial to the final state of a
masterchain block is reflected in thefees_importedin the value flow of that
masterchain block.

5.2.5. Description of ConfigParams. Recall that the configurable pa-
rametersor theconfiguration dictionaryis a dictionaryconfigwith 32-bit
keys kept inside the first cell reference of the persistent data of the configu-
ration smart contractγ(cf.1.6). The addressγof the configuration smart
contract and a copy of the configuration dictionary are duplicated in fields
config_addrandconfigof aConfigParams structure, explicitly included
into masterchain state to facilitate access to the current values of the config-
urable parameters (cf.1.6.3):

_ config_addr:uint256 config:^(Hashmap 32 ^Cell)
= ConfigParams;

5.2.6. Masterchain state data.The data specific to the masterchain state
is collected intoMcStateExtra, already mentioned in5.1.4:

masterchain_state_extra#cc1f
shard_hashes:ShardHashes
shard_fees:ShardFees
config:ConfigParams
= McStateExtra;

5.2.7. Masterchain block data. Similarly, the data specific to the mas-
terchain blocks is collected intoMcBlockExtra:


### 5.3 Serialization of a bag of cells

masterchain_block_extra#cc9f
shard_hashes:ShardHashes
= McBlockExtra;

5.3 Serialization of a bag of cells

The description provided in the previous section defines the way a shardchain
block is represented as a tree of cells. However, this tree of cells needs to
be serialized into a file, suitable for disk storage or network transfer. This
section discusses the standard ways of serializing a tree, a DAG, or a bag of
cells into an octet string.

5.3.1. Transforming a tree of cells into a bag of cells. Recall that
values of arbitrary (dependent) algebraic data types are represented in the
TON Blockchain bytrees of cells. Such a tree of cells is transformed into a
directed acyclic graph, orDAG, of cells, by identifying identical cells in the
tree. After that, we might replace each of the references of each cell by the
32-byte representation hash of the cell referred to and obtain abag of cells.
By convention, the root of the original tree of cells is a marked element of the
resulting bag of cells, so that anybody receiving this bag of cells and knowing
the marked element can reconstruct the original DAG of cells, hence also the
original tree of cells.

5.3.2. Complete bags of cells.Let us say that a bag of cells iscompleteif
it contains all cells referred to by any of its cells. In other words, a complete
bag of cells does not have any “unresolved” hash references to cells outside
that bag of cells. In most cases, we need to serialize only complete bags of
cells.

5.3.3. Internal references inside a bag of cells. Let us say that a
reference of a cellcbelonging to a bag of cellsBisinternal (with respect to
B)if the cellcireferred to by this reference belongs toBas well. Otherwise,
the reference is calledexternal. A bag of cells is complete if and only if all
references of its constituent cells are internal.

5.3.4. Assigning indices to the cells from a bag of cells. Letc 0 ,... ,
cn− 1 be thendistinct cells belonging to a bag of cellsB. We can list these
cells in some order, and then assign indices from 0 ton− 1 , so that cellci
gets indexi. Some options for ordering cells are:


```
5.3. Serialization of a bag of cells
```
- Order cells by their representation hash. ThenHash(ci)<Hash(cj)
    wheneveri < j.
- Topological order: if cellcirefers to cellcj, theni < j. In general, there
    is more than one topological order for the same bag of cells. There are
    two standard ways for constructing topological orders:
       - Depth-first order: apply a depth-first search to the directed acyclic
          graph of cells starting from its root (i.e., marked cell), and list cells
          in the order they are visited.
       - Breadth-first order: same as above, but applying a breadth-first
          search.

Notice that the topological order always assigns index 0 to the root cell of a
bag of cells constructed from a tree of cells. In most cases, we opt to use a
topological order, or the depth-first order if we want to be more specific.
If cells are listed in a topological order, then the verification that there
are no cyclic references in a bag of cells is immediate. On the other hand,
ordering cells by their representation hash simplifies the verification that
there are no duplicates in a serialized bag of cells.

5.3.5. Outline of serialization process. The serialization process of a
bag of cellsBconsisting ofncells can be outlined as follows:

1. List the cells fromBin a topological order:c 0 ,c 1 ,... ,cn− 1. Thenc 0
    is the root cell ofB.
2. Choose an integers, such thatn≤ 2 s. Represent each cellciby an
    integral number of octets in the standard way (cf.1.1.3or [4, 3.1.4]),
    but using unsigned big-endians-bit integerjinstead of hashHash(cj)
    to represent internal references to cellcj(cf.5.3.6below).
3. Concatenate the representations of cellscithus obtained in the increas-
    ing order ofi.
4. Optionally, an index can be constructed that consists of n+ 1 t-bit
    integer entriesL 0 ,... ,Ln, whereLiis the total length (in octets) of
    the representations of cellscjwithj≤i, and integert≥ 0 is chosen so
    thatLn≤ 2 t.


```
5.3. Serialization of a bag of cells
```
5. The serialization of the bag of cells now consists of a magic number
    indicating the precise format of the serialization, followed by integers
    s≥ 0 ,t≥ 0 ,n≤ 2 s, an optional index consisting ofd(n+1)t/ 8 eoctets,
    andLnoctets with the cell representations.
6. An optional CRC32 may be appended to the serialization for integrity
    verification purposes.

If an index is included, any cellciin the serialized bag of cells may be easily
accessed by its indexiwithout deserializing all other cells, or even without
loading the entire serialized bag of cells in memory.

5.3.6. Serialization of one cell from a bag of cells.More precisely, each
individual cellc=ciis serialized as follows, providedsis a multiple of eight
(usuallys= 8, 16 , 24 , or 32 ):

1. Two descriptor bytesd 1 andd 2 are computed similarly to [4, 3.1.4] by
    settingd 1 =r+ 8s+ 16h+ 32landd 2 =bb/ 8 c+db/ 8 c, where:
       - 0 ≤r≤ 4 is the number of cell references present in cellc; ifcis
          absent from the bag of cells being serialized and is represented by
          its hashes only, thenr= 7.^38
       - 0 ≤b≤ 1023 is the number of data bits in cellc.
       - 0 ≤l≤ 3 is the level of cellc(cf. [4, 3.1.3]).
       - s= 1for exotic cells ands= 0for ordinary cells.
       - h= 1if the cell’s hashes are explicitly included into the serial-
          ization; otherwise,h= 0. (Whenr = 7, we must always have
          h= 1.)

```
For absent cells (i.e., external references), onlyd 1 is present, always
equal to23 + 32l.
```
2. Two bytes d 1 andd 2 (if r < 7 ) or one byted 1 (ifr = 7) begin the
    serialization of cellc.

(^38) Notice that these “absent cells” are different from the library reference and external
reference cells, which are kinds of exotic cells (cf. [4, 3.1.7]). Absent cells, by contrast, are
introduced only for the purpose of serializing incomplete bags of cells, and can never be
processed by TVM.


```
5.3. Serialization of a bag of cells
```
3. Ifh= 1, the serialization is continued byl+ 132-byte higher hashes
    ofc(cf. [4, 3.1.6]):Hash 1 (c),... ,Hashl+1(c) =Hash∞(c).
4. After that,db/ 8 edata bytes are serialized, by splittingbdata bits into
    8-bit groups and interpreting each group as a big-endian integer in the
    range 0 ... 255. Ifbis not divisible by 8 , then the data bits are first
    augmented by one binary 1 and up to six binary 0 , so as to make the
    number of data bits divisible by eight.^39
5. Finally,rcell references to cellscj 1 ,... ,cjr are encoded by means ofr
    s-bit big-endian integersj 1 ,... ,jr.^40

5.3.7. A classification of serialization schemes for bags of cells. A
serialization scheme for a bag of cells must specify the following parameters:

- The 4-byte magic number prepended to the serialization.
- The number of bits sused to represent cell indices. Usuallysis a
    multiple of eight (e.g., 8 , 16 , 24 , or 32 ).
- The number of bits t used to represent offsets of cell serializations
    (cf.5.3.5). Usuallytis also a multiple of eight.
- A flag indicating whether an index with offsetsL 0 ,... ,Lnof cell seri-
    alizations is present. This flag may be combined withtby settingt= 0
    when the index is absent.
- A flag indicating whether the CRC32-C of the whole serialization is
    appended to it for integrity verification purposes.

5.3.8. Fields present in the serialization of a bag of cells.In addition
to the values listed in5.3.7, fixed by the choice of a serialization scheme
for bags of cells, the serialization of a specific bag of cells must specify the
following parameters:

- The total number of cellsnpresent in the serialization.

(^39) Notice that exotic cells (withs= 1) always haveb≥ 8 , with the cell type encoded in
the first eight data bits (cf. [4, 3.1.7]).
(^40) If the bag of cells is not complete, some of these cell references may refer to cellsc′
absent from the bag of cells. In that case, special “absent cells” withr= 7are included into
the bag of cells and are assigned some indicesj. These indices are then used to represent
references to absent cells.


```
5.3. Serialization of a bag of cells
```
- The number of “root cells”k≤npresent in the serialization. The root
    cells themselves arec 0 ,... ,ck− 1. All other cells present in the bag of
    cells are expected to be reachable by chains of references starting from
    the root cells.
- The number of “absent cells”l≤n−k, which represent cells that are
    actually absent from this bag of cells, but are referred to from it. The
    absent cells themselves are represented by cn−l,... , cn− 1 , and only
    these cells may (and also must) have r= 7. Complete bags of cells
    havel= 0.
- The total length in bytesLnof the serialization of all cells. If the index
    is present,Lnmight not be stored explicitly since it can be recovered
    as the last entry of the index.

5.3.9. TL-B scheme for serializing bags of cells. Several TL-B con-
structors can be used to serialize bags of cells into octet (i.e., 8-bit byte)
sequences. The only one that is currently used to serialize new bags of cell is

serialized_boc#b5ee9c72 has_idx:(## 1) has_crc32c:(## 1)
has_cache_bits:(## 1) flags:(## 2) { flags = 0 }
size:(## 3) { size <= 4 }
off_bytes:(## 8) { off_bytes <= 8 }
cells:(##(size * 8))
roots:(##(size * 8)) { roots >= 1 }
absent:(##(size * 8)) { roots + absent <= cells }
tot_cells_size:(##(off_bytes * 8))
root_list:(roots * ##(size * 8))
index:has_idx?(cells * ##(off_bytes * 8))
cell_data:(tot_cells_size * [ uint8 ])
crc32c:has_crc32c?uint32
= BagOfCells;

Fieldcellsisn,rootsisk,absentisl, andtot_cells_sizeisLn(the total
size of the serialization of all cells in bytes). If an index is present, parameters
s/ 8 andt/ 8 are serialized separately assizeandoff_bytes, respectively,
and the flaghas_idxis set. The index itself is contained inindex, present
only ifhas_idxis set. The fieldroot_listcontains the (zero-based) indices
of the root nodes of the bag of cells.


```
5.3. Serialization of a bag of cells
```
Two older constructors are still supported in the bag-of-cells deserializa-
tion functions:

serialized_boc_idx#68ff65f3 size:(## 8) { size <= 4 }
off_bytes:(## 8) { off_bytes <= 8 }
cells:(##(size * 8))
roots:(##(size * 8)) { roots = 1 }
absent:(##(size * 8)) { roots + absent <= cells }
tot_cells_size:(##(off_bytes * 8))
index:(cells * ##(off_bytes * 8))
cell_data:(tot_cells_size * [ uint8 ])
= BagOfCells;

serialized_boc_idx_crc32c#acc3a728 size:(## 8) { size <= 4 }
off_bytes:(## 8) { off_bytes <= 8 }
cells:(##(size * 8))
roots:(##(size * 8)) { roots = 1 }
absent:(##(size * 8)) { roots + absent <= cells }
tot_cells_size:(##(off_bytes * 8))
index:(cells * ##(off_bytes * 8))
cell_data:(tot_cells_size * [ uint8 ])
crc32c:uint32 = BagOfCells;

5.3.10. Storing compiled TVM code in files. Notice that the above
procedure for serializing bags of cells may be used to serialize compiled smart
contracts and other TVM code. One must define a TL-B constructor similar
to the following:

compiled_smart_contract
compiled_at:uint32 code:^Cell data:^Cell
description:(Maybe ^TinyString)
_:^[ source_file:(Maybe ^TinyString)
compiler_version:(Maybe ^TinyString) ]
= CompiledSmartContract;

tiny_string#_ len:(#<= 126) str:(len * [ uint8 ]) = TinyString;

Then a compiled smart contract may be represented by a value of typeCom-
piledSmartContract, transformed into a tree of cells and then into a bag of


```
5.3. Serialization of a bag of cells
```
cells, and then serialized using one of the constructors listed in5.3.9. The
resulting octet string may be then written into a file with suffix.tvc(“TVM
smart contract”), and this file may be used to distribute the compiled smart
contract, download it into a wallet application for deploying into the TON
Blockchain, and so on.

5.3.11. Merkle hashes for an octet string.On some occasions, we must
define a Merkle hashHashM(s)of an arbitrary octet stringsof length|s|.
We do this as follows:

- If|s|≤ 256 octets, then the Merkle hash ofsis just itssha256:

```
HashM(s) :=sha256(s) if|s|≤ 256. (19)
```
- If|s|> 256 , letn= 2kbe the largest power of two less than|s|(i.e.,
    k:=blog 2 (|s|−1)c,n:= 2k). Ifs′is the prefix ofsof lengthn, ands′′
    is the suffix ofsof length|s|−n, so thatsis the concatenations′.s′′
    ofs′ands′′, we define

```
HashM(s) :=sha256
```
#### (

```
int 64 (|s|).HashM(s′).HashM(s′′)
```
#### )

#### (20)

```
In other words, we concatenate the 64-bit big-endian representation
of |s| and the recursively computed Merkle hashes ofs′ ands′′, and
computesha256of the resulting string.
```
One can check thatHashM(s) =HashM(t)for octet stringssandtof length
less than 264 − 256 impliess=tunless a hash collision forsha256has been
found.

5.3.12. The serialization hash of a block. The construction of5.3.11
is applied in particular to the serialization of the bag of cells representing an
unsigned shardchain or masterchain block. The validators sign not only the
representation hash of the unsigned block, but also the “serialization hash”
of the unsigned block, defined asHashM of the serialization of the unsigned
block. In this way, the validators certify that this octet string is indeed a
serialization of the corresponding block.


```
References
```
## References

[1] Daniel J. Bernstein,Curve25519: New Diffie–Hellman Speed Records
(2006), in: M. Yung, Ye. Dodis, A. Kiayas et al,Public Key Cryptogra-
phy, Lecture Notes in Computer Science 3958 , pp. 207–228. Available at
https://cr.yp.to/ecdh/curve25519-20060209.pdf.

[2] Daniel J. Bernstein, Niels Duif, Tanja Lange et al., High-
speed high-security signatures (2012), Journal of Cryptographic Engi-
neering 2 (2), pp. 77–89. Available at https://ed25519.cr.yp.to/
ed25519-20110926.pdf.

[3] N. Durov,Telegram Open Network, 2017.

[4] N. Durov,Telegram Open Network Virtual Machine, 2018.


### A.1 Elliptic curves

## A Elliptic curve cryptography

This appendix contains a formal description of the elliptic curve cryptography
currently used in TON, particularly in the TON Blockchain and the TON
Network.
TON uses two forms of elliptic curve cryptography: Ed25519 is used for
cryptographic Schnorr signatures, while Curve25519 is used for asymmetric
cryptography. These curves are used in the standard way (as defined in
the original articles [1] and [2] by D. Bernstein and RFCs 7748 and 8032);
however, some serialization details specific to TON must be explained. One
unique adaptation of these curves for TON is that TON supports automatic
conversion of Ed25519 keys into Curve25519 keys, so that the same keys can
be used for signatures and for asymmetric cryptography.

A.1 Elliptic curves

Some general facts on elliptic curves over finite fields, relevant for elliptic
curve cryptography, are collected in this section.

A.1.1. Finite fields. We consider elliptic curves over finite fields. For
the purposes of the Curve25519 and Ed25519 algorithms, we will be mostly
concerned with elliptic curves over the finite prime fieldk:=Fpof residues
modulop, wherep= 2^255 − 19 is a prime number, and over finite extensions
FqofFp, especially the quadratic extensionFp 2.^41

A.1.2. Elliptic curves. Anelliptic curve E= (E,O)over a fieldkis a
geometrically integral smooth projective curveE/kof genusg= 1, along
with a markedk-rational pointO∈E(k). It is well-known that an elliptic
curveEover a fieldkcan be represented in (generalized) Weierstrass form:

```
y^2 +a 1 xy+a 3 y=x^3 +a 2 x^2 +a 4 x+a 6 for somea 1 ,... ,a 6 ∈k. (21)
```
More precisely, this is only the affine part of the elliptic curve, written in
coordinates (x,y). For any field extension K of k, E(K) consists of all
solutions(x,y)∈K^2 of equation (21), calledfinite points ofE(K), along
with a point at infinity, which is the marked pointO.

(^41) Arithmetic modulopfor a moduluspnear a power of two can be implemented very
efficiently. On the other hand, residues modulo 2255 − 19 can be represented by 255-bit
integers. This is the reason this particular value ofphas been chosen by D. Bernstein.


```
A.1. Elliptic curves
```
A.1.3. Weierstrass form in homogeneous coordinates. In homoge-
neous coordinates[X:Y :Z], (21) corresponds to

```
Y^2 Z+a 1 XY Z+a 3 Y Z^2 =X^3 +a 2 X^2 Z+a 4 XZ^2 +a 6 Z^3 (22)
```
WhenZ 6 = 0, we can setx:=X/Z,y:=Y/Z, and obtain a solution(x,y)
of (21) (i.e., a finite point ofE). On the other hand, the only solution (up
to proportionality) of (22) withZ = 0is[0 : 1 : 0]; this is the point at
infinityO.

A.1.4. Standard Weierstrass form. When the characteristicchark of
fieldkis 6 = 2, 3 , the Weierstrass form of (21) or (22) can be simplified with
the aid of linear transformationsy′:=y+a 1 x/2 +a 3 / 2 ,x′:=x+a 2 / 3 , thus
makinga 1 =a 3 =a 2 = 0and obtaining

```
y^2 =x^3 +a 4 x+a 6 (23)
```
and
Y^2 Z=X^3 +a 4 XZ^2 +a 6 Z^3 (24)

Such an equation defines an elliptic curve if and only if the cubic polynomial
P(x) :=x^3 +a 4 x+a 6 has no multiple roots, i.e., if the discriminantD:=
− 4 a^34 − 27 a^26 is non-zero.

A.1.5. Addition of points on elliptic curveE.LetKbe a field extension
of fieldk, and letE= (E,O)be any elliptic curve in Weierstrass form defined
overk. Then any linel ⊂P^2 K intersects the elliptic curveE(K)(which is
the base change of curveEto fieldK, i.e., the curve defined by the same
equations over a larger fieldK) at exactly three pointsP,Q,R, considered
with multiplicities. We define theaddition of pointson elliptic curveE(or
rather the addition of itsK-valued pointsE(K)) by requiring that

```
P+Q+R=O whenever{P,Q,R}=l∩Efor some linel⊂P^2 K. (25)
```
It is well-known that this requirement defines a unique commutative law
[+] :E×kE →Eon the points of the elliptic curveE, havingOas its
neutral element. When elliptic curve E is represented by its Weierstrass
form (21), one can write explicit formulas expressing the coordinatesxP+Q,
yP+Qof the sumP+Qof twoK-valued pointsP,Q∈E(K)of elliptic curve
Eas rational functions of the coordinatesxP,yP,xQ,yQ∈K of pointsP
andQand of the coefficientsai∈kof (21).


```
A.1. Elliptic curves
```
A.1.6. Power maps.SinceE(K)is an abelian group, one can definemul-
tiplesorpowers [n]Xfor any pointX ∈E(K)and any integern∈Z. If
n= 0, then[0]X=O; ifn > 0 , then[n]X= [n−1]X+X; ifn < 0 , then
[n]X =−[−n]X. The map[n] = [n]E : E→Eforn 6 = 0is anisogeny,
meaning that it is a non-constant homomorphism for the group law ofE:

```
[n](P+Q) = [n]P+ [n]Q for anyP,Q∈E(K)andn∈Z. (26)
```
In particular,[−1]E:E→E,P 7→ −P, is an involutive automorphism of
elliptic curveE. IfEis in Weierstrass form,[−1]E maps(x,y)7→(x,−y),
and two pointsP,Q∈E(Fq)have equalx-coordinates if and only ifQ=±P.

A.1.7. The order of the group of rational points ofE. LetEbe an
elliptic curve defined over a finite base fieldk, and letK=Fqbe a finite
extension ofk. ThenE(Fq)is a finite abelian group. By a well-known result
of Hasse, the ordernof this group is not too distant fromq:

```
n=|E(Fq)|=q−t+ 1 wheret^2 ≤ 4 q, i.e.,|t|≤ 2
```
#### √

```
q. (27)
```
We will be mostly interested in the caseK=k=Fp, withq=pa prime
number.

A.1.8. Cyclic subgroups of large prime order. Elliptic curve cryptog-
raphy is usually performed using elliptic curves that admit a (necessarily
cyclic) subgroupC⊂E(Fq)of prime order`. Equivalently, a rational point
G ∈ E(Fq)of prime order` may be given; then C can be recovered as
the cyclic subgroup〈G〉generated by G. In order to verify that a point
G∈ E(Fq)generates a cyclic group of prime order`, one can check that
G 6 =O, but[`]G=O.
By the Legendre theorem, `is necessarily a divisor of the order n =
|E(Fq)|of the finite abelian groupE(Fq):

```
n=|E(Fq)|=c` for some integerc≥ 1 (28)
```
The integercis called thecofactor; one usually wants the cofactor to be as
small as possible, so as to make`=n/cas large as possible. Recall thatn
always has the same order of magnitude asqby (27), so it cannot be changed
much by varyingEonceqis fixed.


```
A.1. Elliptic curves
```
A.1.9. Data for elliptic curve cryptography.In order to define specific
elliptic curve cryptography, one must fix a finite base fieldFq (if q = p
is a prime, it is sufficient to fix primep), an elliptic curveE/Fq (usually
represented by the coefficients of its Weierstrass form (23) or (21)), the base
pointO (which usually is the point at infinity of an elliptic curve written
in Weierstrass form), and the generatorG∈E(Fq)(usually determined by
its coordinates(x,y)with respect to the equation of the elliptic curve) of a
cyclic subgroup of large prime order`. Prime number`and the cofactorc
are usually also part of the elliptic cryptography data.

A.1.10. Main operations of elliptic curve cryptography.Elliptic curve
cryptography usually deals with a fixed cyclic subgroupC of a large prime
order`inside the group of points of an elliptic curveEover a finite fieldFq.
A generatorGofCis usually fixed. It is usually assumed that, given a point
X ofC, one cannot find its “discrete logarithm baseG” (i.e., a residuen
modulo`such thatX= [n]G) faster than inO(

#### √

`)operations. The most
important operations used in elliptic curve cryptography are the addition of
points fromC⊂E(Fq)and the computation of their powers, or multiples.

A.1.11. Private and public keys for elliptic curve cryptography.
Usually a private key for elliptic curve cryptography described by the data
listed inA.1.9is a “random” integer 0 < a < `, called thesecret exponent,
and the corresponding public key is the point A := [a]G (or just its x-
coordinatexA), suitably serialized.

A.1.12. Montgomery curves.Elliptic curves with the specific Weierstrass
equation

```
y^2 =x^3 +Ax^2 +x whereA= 4a− 2 for somea∈k,a 6 = 0,a 6 = 1 (29)
```
are called Montgomery curves. They have the convenient property that
xP+QxP−Qcan be expressed as a simple rational function ofxP andxQ:

```
xP+QxP−Q=
```
#### (

```
xPxQ−A
xP−xQ
```
#### ) 2

#### (30)

This means thatxP+Q can be computed providedxP−Q, xP, and xQ are
known. In particular, ifxP,x[n]P, andx[n+1]Pare known, thenx[2n]P,x[2n+1]P,
andx[2n+2]Pcan be computed. Using the binary representation of 0 < n < 2 s,
one can computex[bn/ 2 s−ic]P,x[bn/ 2 s−ic+1]P fori= 0, 1 ,... ,s, thus obtaining


### A.2 Curve25519 cryptography

x[n]P (this algorithm for quickly computingx[n]P starting fromxP on Mont-
gomery curves is called aMontgomery ladder). Hence we see the importance
of Montgomery curves for elliptic curve cryptography.

A.2 Curve25519 cryptography

This section describes the well-known Curve25519 cryptography proposed by
Daniel Bernstein [1] and its usage in TON.

A.2.1. Curve25519.Curve25519 is defined as the Montgomery curve

```
y^2 =x^3 +Ax^2 +x overFp, wherep= 2^255 − 19 andA= 486662. (31)
```
The order of this curve is 8 `, where`is a prime number, andc= 8is the
cofactor. The cyclic subgroup of order `is generated by a pointG with
xG= 9(this determinesGup to the sign ofyG, which is unimportant). The
order of the quadratic twist 2 y^2 = x^3 +Ax^2 +xof Curve25519 is 4 `′for
another prime number`′.^42

A.2.2. Parameters of Curve25519. The parameters of Curve25519 are
as follows:

- Base field: Prime finite fieldFpforp= 2^255 − 19.
- Equation:y^2 =x^3 +Ax^2 +xforA= 486662.
- Base pointG: Characterized byxG= 9(nine is the smallest positive
    integerx-coordinate of a generator of the subgroup of large prime order
    ofE(Fp)).
- Order ofE(Fp):

```
|E(Fp)|=p−t+ 1 = 8`, where (32)
`= 2^252 + 27742317777372353535851937790883648493 is prime.
(33)
```
(^42) Actually, D. Bernstein choseA= 486662because it is the smallest positive integer
A≡2 (mod 4)such that both the corresponding Montgomery curve (31) overFpforp=
2255 − 19 and the quadratic twist of this curve have small cofactors. Such an arrangement
avoids the necessity to check whether anx-coordinatexP∈Fpof a pointPdefines a point
(xP,yP)∈F^2 plying on the Montgomery curve itself or on its quadratic twist.


```
A.2. Curve25519 cryptography
```
- Order ofE ̃(Fp), whereE ̃is the quadratic twist ofE:
    |E ̃(Fp)|=p+t+ 1 = 2p+ 2− 8 `= 4`′, where (34)
       `′= 2^253 − 55484635554744707071703875581767296995 is prime.
          (35)

A.2.3. Private and public keys for standard Curve25519 cryptog-
raphy. A private key for Curve25519 cryptography is usually defined as a
secret exponenta, while the corresponding public key isxA, thex-coordinate
of pointA:= [a]G. This is usually sufficient for performing ECDH (elliptic
curve Diffie–Hellman key exchange) and asymmetric elliptic curve cryptog-
raphy, as follows:
If a party wants to send a messageMto another party, which has public
keyxA(and private keya), the following computations are performed. A
one-time random secret exponentbis generated, andxB :=x[b]Gandx[b]A
are computed using a Montgomery ladder. After that, the messageM is
encrypted by a symmetric cypher such as AES using the 256-bit “shared
secret” S :=x[b]A as a key, and 256-bit integer (“one-time public key”)xB
is prepended to the encrypted message. Once the party with public keyxA
receives this message, it can computex[a]B starting fromxB (transmitted
with the encrypted message) and the private keya. Sincex[a]B =x[ab]G=
x[b]A = S, the receiving party recovers the shared secretS and is able to
decrypt the remainder of the message.

A.2.4. Public and private keys for TON Curve25519 cryptography.
TON uses another form for public and private keys of Curve25519 cryptog-
raphy, borrowed from Ed25519 cryptography.
A private key for TON Curve25519 cryptography is just a random 256-bit
stringk. It is used by computingsha512(k), taking the first 256 bits of the
result, interpreting them as a little-endian 256-bit integera, clearing bits 0 ,
1 , 2 , and 255 ofa, and setting bit 254 so as to obtain a value 2254 ≤a < 2255 ,
divisible by eight. The valueathus obtained is thesecret exponent corre-
sponding tok; meanwhile, the remaining 256 bits ofsha512(k)constitute
thesecret saltk′′.
The public key corresponding tok—or to the secret exponenta—is just
thex-coordinatexAof the pointA:= [a]G. OnceaandxAare computed,
they are used in exactly the same way as inA.2.3. In particular, ifxAneeds
to be serialized, it is serialized into 32 octets as an unsigned little-endian
256-bit integer.


### A.3 Ed25519 cryptography

A.2.5. Curve25519 is used in the TON Network. Notice that the
asymmetric Curve25519 cryptography described inA.2.4is extensively used
by the TON Network, especially the ADNL (Abstract Datagram Network
Layer) protocol. However, TON Blockchain needs elliptic curve cryptography
mostly for signatures. For this purpose, Ed25519 signatures described in the
next section are used.

A.3 Ed25519 cryptography

Ed25519 cryptography is extensively used for fast cryptographic signatures
by both the TON Blockchain and the TON Network. This section describes
the variant of Ed25519 cryptography used by TON. An important differ-
ence from the standard approaches (as defined by D. Bernstein et al. in [2])
is that TON provides automatic conversion of private and public Ed25519
keys into Curve25519 keys, so that the same keys could be used both for
encrypting/decrypting and for signing messages.

A.3.1. Twisted Edwards curves. A twisted Edwards curve Ea,d with
parametersa 6 = 0andd 6 = 0,aover a fieldkis given by equation

```
Ea,d: ax^2 +y^2 = 1 +dx^2 y^2 overk (36)
```
Ifa= 1, this equation defines an (untwisted) Edwards curve. PointO(0,1)
is usually chosen as the marked point ofEa,d.

A.3.2. Twisted Edwards curves are birationally equivalent to Mont-
gomery curves.A twisted Edwards curveEa,dis birationally equivalent to
a Montgomery elliptic curve

```
MA:v^2 =u^3 +Au^2 +u (37)
```
whereA= 2(a+d)/(a−d)andd/a= (A−2)/(A+ 2). The birational
equivalenceφ:Ea,d99KMAand its inverseφ−^1 are given by

```
φ: (x,y)7→
```
#### (

```
1 +y
1 −y
```
#### ,

```
c(1 +y)
x(1−y)
```
#### )

#### (38)

and

```
φ−^1 : (u,v)7→
```
#### (

```
cu
v
```
#### ,

```
u− 1
u+ 1
```
#### )

#### (39)


```
A.3. Ed25519 cryptography
```
where

```
c=
```
#### √

#### A+ 2

```
a
```
#### (40)

Notice thatφtransforms the marked pointO(0,1)ofEa,dinto the marked
point ofMA(i.e., its point at infinity).

A.3.3. Addition of points on a twisted Edwards curve.SinceEa,dis
birationally equivalent to an elliptic curveMA, the addition of points onMA
can be transferred toEa,dby setting

```
P+Q:=φ−^1
```
#### (

```
φ(P) +φ(Q)
```
#### )

```
for anyP,Q∈Ea,d(k). (41)
```
Notice that the marked pointO(0,1)is the neutral element with respect to
this addition, and that−(xP,yP) = (−xP,yP).

A.3.4. Formulas for adding points on a twisted Edwards curve.The
coordinatesxP+QandyP+Qadmit simple expressions as rational functions
ofxP,yP,xQ,yQ:

```
xP+Q=
```
```
xPyQ+xQyP
1 +dxPxQyPyQ
```
#### (42)

```
yP+Q=
```
```
yPyQ−axPxQ
1 −dxPxQyPyQ
```
#### (43)

These expressions can be efficiently computed, especially ifa=− 1. This
is the reason twisted Edwards curves are important for fast elliptic curve
cryptography.

A.3.5. Ed25519 twisted Edwards curve. Ed25519 is the twisted Ed-
wards curveE− 1 ,doverFp, wherep= 2^255 − 19 is the same prime number
as that used for Curve25519, andd=−(A−2)/(A+ 2) =− 121665 / 121666 ,
whereA= 486662is the same as in the equation (31):

```
−x^2 +y^2 = 1−
```
#### 121665

#### 121666

```
x^2 y^2 forx,y∈Fp,p= 2^255 − 19. (44)
```
In this way, Ed25519-curveE− 1 ,dis birationally equivalent to Curve25519
(31), and one can useE− 1 ,dand formulas (42)–(43) for point addition on
either Ed25519 or Curve25519, using (38) and (39) to convert points on
Ed25519 into corresponding points on Curve25519, and vice versa.


```
A.3. Ed25519 cryptography
```
A.3.6. Generator of Ed25519.The generator of Ed25519 is the pointG′
withy(G′) = 4/ 5 and 0 ≤x(G′)< peven. According to (38), it corresponds
to the point(u,v)of Curve25519 withu= (1 + 4/5)/(1− 4 /5) = 9(i.e., to
the generatorGof Curve25519 chosen inA.2.2). In particular,G=φ(G′),
G′generates a cyclic subgroup of the same large prime order`given in (32),
and for any integera,
φ([a]G′) = [a]G. (45)

In this way, we can perform computations with Curve25519 and its generator
G, or with Ed25519 and generatorG′, and obtain essentially the same results.

A.3.7. Standard representation of points on Ed25519.A pointP(x,y)
on Ed25519 may be represented by its two coordinatesxP andyP, residues
modulop= 2^255 − 19. In their turn, both these coordinates may be repre-
sented by unsigned 255- or 256-bit integers 0 ≤xP,yP < p < 2255.
However, a more compact representation of P by one little-endian un-
signed 256-bit integerP ̃ is commonly used (and is used by TON as well).
Namely, the 255 lower-order bits ofP ̃ containyP, 0 ≤yP < p < 2255 , and
bit 255 is used to storexPmod 2, the lower-order bit ofxP. SinceyP always
determinesxPup to sign (i.e., up to replacingxPwithp−xP),xPandp−xP
can always be distinguished by their lower-order bit,pbeing odd.
If it is sufficient to know±Pup to sign, one can ignorexP mod 2and con-
sider only the little-endian 255-bit integeryP, setting the bit 255 arbitrarily,
ignoring its previously defined value, or clearing it.

A.3.8. Private key for Ed25519. Aprivate key for Ed25519 is just an
arbitrary 256-bit stringk. Asecret exponentaandsecret saltk′′are derived
fromkby first computingsha512(k), and then taking the first 256 bits of
thissha512as the little-endian representation ofa(but with bits 255, 2, 1,
and 0 cleared, and bit 254 set); the last 256 bits ofsha512(k)then constitute
k′′.
This is essentially the same procedure as described inA.2.4, but with
Curve25519 replaced by the birationally equivalent curve Ed25519. (In fact,
it is the other way around: this procedure is standard for Ed25519-based
elliptic curve cryptography, and TON extends the procedure to Curve25519.)

A.3.9. Public key for Ed25519. Apublic key corresponding to a private
keyk for Ed25519 is the standard representation (cf.A.3.7) of the point
A= [a]G′, whereais the secret exponent (cf.A.3.8) defined by the private
keyk.


```
A.3. Ed25519 cryptography
```
Notice thatφ(A)is the public key for Curve25519 defined by the same
private keyk according to A.2.4and (45). In this way, we can convert
public keys for Ed25519 into corresponding public keys for Curve25519, and
vice versa. Private keys do not need to be transformed at all.

A.3.10. Cryptographic Ed25519-signatures.If a message (octet string)
Mneeds to be signed by a private keykdefining secret exponentaand secret
saltk′′, the following computations are performed:

- r:=sha512(k′′|M), interpreted as a little-endian 512-bit integer. Here
    s|tdenotes the concatenation of octet stringssandt.
- R:= [r]G′is a point on Ed25519.
- R ̃is the standard representation (cf.A.3.7) of pointRas a 32-octet
    string.
- s:=r+a·sha512(R ̃|A ̃|M) mod`, encoded as a little-endian 256-bit
    integer. HereA ̃is the standard representation of pointA= [a]G′, the
    public key corresponding tok.

The (Schnorr) signature is a 64-octet string(R,s ̃ ), consisting of the standard
representation of the pointRand of the 256-bit integers.

A.3.11. Checking Ed25519-signatures. In order to verify signature
(R,s ̃ )of a messageM, supposedly made by the owner of the private key
kcorresponding to a known public keyA, the following steps are performed:

- Points[s]G′andR+ [sha512(R ̃|A ̃|M)]Aof Ed25519 are computed.
- If these two points coincide, the signature is correct.


