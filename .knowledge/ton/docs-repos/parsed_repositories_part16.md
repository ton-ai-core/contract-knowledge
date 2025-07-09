# GitHub Docs Parser - Part 16

            repeat (100) { drop() }
        } catch (exitCode) {
            // exitCode is 2
        }
    }
}
```

:::note[Useful links:]

  [TVM is a stack machine](https://docs.ton.org/learn/tvm-instructions/tvm-overview#tvm-is-a-stack-machine) in TON Docs.

:::

### 3: Stack overflow {#3}

If there are too many elements copied into a closure continuation, an error with exit code $3$ is thrown: `Stack overflow`. This occurs rarely unless you're deep in the [Fift and TVM assembly](https://docs.ton.org/develop/fift/fift-and-tvm-assembly) trenches:

```tact
// Remember kids, don't try to overflow the stack at home!
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

:::note[Useful links:]

  [TVM is a stack machine](https://docs.ton.org/learn/tvm-instructions/tvm-overview#tvm-is-a-stack-machine) in TON Docs.

:::

### 4: Integer overflow {#4}

If the [value in a calculation](/book/integers#operations) goes beyond the range from $-2^{256}$ to $2^{256} - 1$ inclusive, or there's an attempt to [divide](/book/operators#binary-divide) or perform [modulo](/book/operators#binary-modulo) by zero, an error with exit code $4$ is thrown: `Integer overflow`.

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

// There can also be an integer overflow when performing:
// addition (+),
// subtraction (-),
// division (/) by a negative number or modulo (%) by zero
```

### 5: Integer out of expected range {#5}

A range check error occurs when [some integer](/book/integers#operations) is out of its expected range. Any attempt to store an unexpected amount of data or specify an out-of-bounds value throws an error with exit code $5$: `Integer out of expected range`.

Examples of specifying an out-of-bounds value:

```tact
try {
    // Repeat only operates on an inclusive range from 1 to 2^{31} - 1
    // Any valid integer value greater than that causes an error with exit code 5
    repeat (pow(2, 55)) {
        dump("smash. logs. I. must.");
    }
} catch (exitCode) {
    // exitCode is 5
}

try {
    // Builder.storeUint() function can only use up to 256 bits, thus 512 is too much:
    let s: Slice = beginCell().storeUint(-1, 512).asSlice();
} catch (exitCode) {
    // exitCode is 5
}
```

### 6: Invalid opcode {#6}

If you specify an instruction that is not defined in the current [TVM][tvm] version or attempt to set an unsupported [code page](https://docs.ton.org/v3/documentation/tvm/tvm-overview#tvm-state), an error with exit code $6$ is thrown: `Invalid opcode`.

```tact
// There's no such code page, and an attempt to set it fails
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

If an argument to a primitive is of an incorrect value type or there is any other mismatch in types during the [compute phase](#compute), an error with exit code $7$ is thrown: `Type check error`.

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

From the [Cells, Builders and Slices page](/book/cells#cells) of the Book:

> [`Cell{:tact}`][cell] is a [primitive][p] and a data structure, which [ordinarily](/book/cells#cells-kinds) consists of up to 1023 continuously laid out bits and up to 4 references (refs) to other cells.

To construct a [`Cell{:tact}`][cell], a [`Builder{:tact}`][builder] is used. If you try to store more than 1023 bits of data or more than 4 references to other cells, an error with exit code $8$ is thrown: `Cell overflow`.

This error can be triggered by [manual construction](/book/cells#cnp-manually) of the cells via [relevant `Builder{:tact}` methods](/ref/core-cells#builder) or when [using structs and Messages and their convenience methods](/book/cells#cnp-structs).

```tact
// Too many bits
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

// Too many refs
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

From the [Cells, Builders and Slices page](/book/cells#cells) of the Book:

> `Cell{:tact}` is a [primitive][p] and a data structure, which [ordinarily](/book/cells#cells-kinds) consists of up to 1023 continuously laid-out bits and up to 4 references (refs) to other cells.

To parse a [`Cell{:tact}`][cell], a [`Slice{:tact}`][slice] is used. If you try to load more data or references than a `Slice{:tact}` contains, an error with exit code 9 is thrown: `Cell underflow`.

The most common cause of this error is a mismatch between the expected and actual memory layouts of the cells, so it's recommended to [use structs and Messages for parsing](/book/cells#cnp-structs) the cells instead of [manual parsing](/book/cells#cnp-manually) via [relevant `Slice{:tact}` methods](/ref/core-cells#slice).

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

In Tact, the [`map<K, V>{:tact}`](/book/maps) type is an abstraction over the ["hash" map dictionaries of TVM](/book/maps#low-level-representation).

If there is incorrect manipulation of dictionaries, such as improper assumptions about their memory layout, an error with exit code $10$ is thrown: `Dictionary error`. Note that Tact prevents you from getting this error unless you perform [TVM assembly](https://docs.ton.org/develop/fift/fift-and-tvm-assembly) work yourself:

```tact
/// Pre-computed Int to Int dictionary with two entries — 0: 0 and 1: 1
const cellWithDictIntInt: Cell = cell("te6cckEBBAEAUAABAcABAgPQCAIDAEEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMLMbT1U=");

/// Tries to preload a dictionary from a Slice as a map<Int, Cell>
asm fun toMapIntCell(x: Slice): map<Int, Cell> { PLDDICT }

contract DictPic {
    receive("I solemnly swear that I'm up to no good") {
        try {
            // The Int to Int dictionary is being misinterpreted as a map<Int, Cell>
            let m: map<Int, Cell> = toMapIntCell(cellWithDictIntInt.beginParse());

            // And the error happens only when we touch it
            m.get(0)!!;
        } catch (exitCode) {
            // exitCode is 10
        }
    }
}
```

### 11: "Unknown" error {#11}

Described in the [TVM][tvm] docs as "Unknown error, may be thrown by user programs," although most commonly used for problems with queuing a message send or problems with [getters](/book/functions#get).

In particular, if you try to send an ill-formed message on-chain or to call a non-existent getter function off-chain, an exit code 11 will be thrown.

```tact
try {
    // Unlike sendRawMessage which uses SENDRAWMSG, this one uses SENDMSG,
    // and therefore fails in Compute phase when the message is ill-formed
    sendRawMessageReturnForwardFee(emptyCell(), 0);
} catch (exitCode) {
    // exitCode is 11
}
```

### 12: Fatal error {#12}

Fatal error. Thrown by TVM in situations deemed impossible.

### 13: Out of gas error {#13}

If there isn't enough gas to complete computations in the [compute phase](#compute), an error with exit code $13$ is thrown: `Out of gas error`.

However, this code isn't immediately shown as is — instead, the bitwise NOT operation is applied, changing the value from $13$ to $-14$. Only then is the code displayed.

This is done to prevent the resulting code ($-14$) from being produced artificially in user contracts, as all functions that can [throw an exit code](/ref/core-debug) can only specify integers in the range from $0$ to $65535$ inclusive.

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

Virtualization error related to [pruned branch cells](/book/cells#cells-kinds). Reserved but never thrown.

## Action phase {#action}

The [action phase][a] is processed after the successful execution of the [compute phase](#compute). It attempts to perform the actions stored in the action list by [TVM][tvm] during the compute phase.

Some actions may fail during processing, in which case those actions may be skipped or the whole transaction may revert depending on the mode of actions. The code indicating the resulting state of the [action phase][a] is called a _result code_. Since it is also a 32-bit signed integer that essentially serves the same purpose as the _exit code_ of the [compute phase](#compute), it is common to call the result code an exit code as well.

### 32: Action list is invalid {#32}

If the list of actions contains [exotic cells](/book/cells#cells-kinds), an action entry cell does not have references, or some action entry cell cannot be parsed, an error with exit code 32 is thrown: `Action list is invalid`.

:::note

  Aside from this exit code, there is a boolean flag `valid`, which you can find under `description.actionPhase.valid` in the transaction results when working with [Sandbox and Blueprint](#blueprint). A transaction can set this flag to `false` even when there is some other exit code thrown from the action phase.

:::

### 33: Action list is too long {#33}

If there are more than 255 actions queued for execution, the [action phase](#action) will throw an error with an exit code 33: `Action list is too long`.

```tact
// For example, let's attempt to queue reservation of a specific amount of nanoToncoins
// This won't fail in the compute phase, but will result in exit code 33 in the action phase
repeat (256) {
    nativeReserve(ton("0.001"), ReserveAtMost);
}
```

### 34: Invalid or unsupported action {#34}

There are only four supported actions at the moment: changing the contract code, sending a message, reserving a specific amount of [nanoToncoins](/book/integers#nanotoncoin), and changing the library cell. If there is any issue with the specified action (invalid message, unsupported action, etc.), an error with exit code $34$ is thrown: `Invalid or unsupported action`.

```tact
// For example, let's try to send an ill-formed message:
sendRawMessage(emptyCell(), 0); // won't fail in the compute phase,
                                   // but will result in exit code 34 in the Action phase
```

### 35: Invalid source address in outbound message {#35}

If the source address in the outbound message is not equal to [`addr_none`](https://docs.ton.org/develop/data-formats/msg-tlb#addr_none00) or to the address of the contract that initiated this message, an error with exit code $35$ is thrown: `Invalid source address in outbound message`.

### 36: Invalid destination address in outbound message {#36}

If the destination address in the outbound message is invalid, e.g., it does not conform to the relevant [TL-B][tlb] schemas, contains an unknown workchain ID, or has an invalid length for the given workchain, an error with exit code $36$ is thrown: `Invalid destination address in outbound message`.

:::note

  If the [optional flag +2](/book/message-mode#optional-flags) is set, this error won't be thrown, and the given message won't be sent.

:::

### 37: Not enough Toncoin {#37}

If all funds of the inbound message with [base mode 64](/book/message-mode#base-modes) set have already been consumed and there are not enough funds to pay for the failed action, or the [TL-B][tlb] layout of the provided value ([`CurrencyCollection`](https://docs.ton.org/develop/data-formats/msg-tlb#currencycollection)) is invalid, or there are not enough funds to pay [forward fees](https://docs.ton.org/develop/smart-contracts/guidelines/processing) or not enough funds after deducting fees, an error with exit code $37$ is thrown: `Not enough Toncoin`.

:::note

  If the [optional flag +2](/book/message-mode#optional-flags) is set, this error won't be thrown and the given message won't be sent.

:::

### 38: Not enough extra currencies {#38}

Besides the native currency, Toncoin, TON Blockchain supports up to $2^{32}$ extra currencies. They differ from creating new [Jettons](/cookbook/jettons) because extra currencies are natively supported — one can potentially just specify an extra [`HashmapE`](https://docs.ton.org/develop/data-formats/tl-b-types#hashmap) of extra currency amounts in addition to the Toncoin amount in the internal message to another contract. Unlike Jettons, extra currencies can only be stored and transferred and do not have any other functionality.

At the moment, **there are no extra currencies** on TON Blockchain, but the exit code $38$ for cases when there is not enough extra currency to send the specified amount is already reserved: `Not enough extra currencies`.

:::note[Useful links:]

  [Extra currencies](https://docs.ton.org/develop/dapps/defi/coins) in TON Docs.\
  [Extra currency mining](https://docs.ton.org/develop/research-and-development/minter-flow) in TON Docs.

:::

### 39: Outbound message doesn't fit into a cell {#39}

When processing the message, TON Blockchain tries to pack it according to the [relevant TL-B schemas](https://docs.ton.org/develop/data-formats/msg-tlb), and if it cannot, an error with exit code $39$ is thrown: `Outbound message doesn't fit into a cell`.

:::note

  If attempts at sending the message fail multiple times and the [optional flag +2](/book/message-mode#optional-flags) is set, this error won't be thrown and the given message won't be sent.

:::

### 40: Cannot process a message {#40}

If there are not enough funds to process all the cells in a message, the message is too large, or its Merkle depth is too big, an error with exit code $40$ is thrown: `Cannot process a message`.

:::note

  If the [optional flag +2](/book/message-mode#optional-flags) is set, this error won't be thrown and the given message won't be sent.

:::

### 41: Library reference is null {#41}

If a library reference is required during a library change action but is null, an error with exit code $41$ is thrown: `Library reference is null`.

### 42: Library change action error {#42}

If there's an error during an attempt at a library change action, an error with exit code $42$ is thrown: `Library change action error`.

### 43: Library limits exceeded {#43}

If the maximum number of cells in the library is exceeded or the maximum depth of the Merkle tree is exceeded, an error with exit code $43$ is thrown: `Library limits exceeded`.

### 50: Account state size exceeded limits {#50}

If the account state (contract storage, essentially) exceeds any of the limits specified in [config param 43 of TON Blockchain](https://docs.ton.org/develop/howto/blockchain-configs#param-43) by the end of the [action phase](#action), an error with exit code $50$ is thrown: `Account state size exceeded limits`.

If the configuration is absent, the default values are:

* `max_msg_bits` is equal to $2^{21}$ — maximum message size in bits.
* `max_msg_cells` is equal to $2^{13}$ — maximum number of [cells][cell] a message can occupy.
* `max_library_cells` is equal to $1000$ — maximum number of [cells][cell] that can be used as [library reference cells](/book/cells#cells-kinds).
* `max_vm_data_depth` is equal to $2^{9}$ — maximum [cells][cell] [depth](/book/cells#cells-representation) in messages and account state.
* `ext_msg_limits.max_size` is equal to $65535$ — maximum external message size in bits.
* `ext_msg_limits.max_depth` is equal to $2^{9}$ — maximum external message [depth](/book/cells#cells-representation).
* `max_acc_state_cells` is equal to $2^{16}$ — maximum number of [cells][cell] that an account state can occupy.
* `max_acc_state_bits` is equal to $2^{16} \times 1023$ — maximum account state size in bits.
* `max_acc_public_libraries` is equal to $2^{8}$ — maximum number of [library reference cells](/book/cells#cells-kinds) that an account state can use on the masterchain.
* `defer_out_queue_size_limit` is equal to $2^{8}$ — maximum number of outbound messages to be queued (regarding validators and collators).

## Tact compiler

Tact utilizes exit codes from $128$ to $255$. Note that exit codes used by Tact indicate contract errors, which can occur when using Tact-generated code and are therefore thrown in the transaction's [compute phase](#compute), not during compilation.

### 128: Null reference exception {#128}

If there is a non-null assertion, such as the [`!!{:tact}`](/book/operators#unary-non-null-assert) operator, and the checked value is [`null{:tact}`](/book/optionals), an error with exit code $128$ is thrown: `Null reference exception`.

This behavior can be modified by setting the [`nullChecks`](/book/config#safety-nullchecks) option to `false`, which will disable runtime null checks and would allow to save some gas. However, it is recommended to use it only for well-tested contracts, as it can lead to less recognizable type errors reported by TVM.

```tact
let gotcha: String? = null;

try {
    // Asserting that the value isn't null, which isn't the case!
    dump(gotcha!!);
} catch (exitCode) {
    // exitCode is 128
}
```

<Badge text="Available since Tact 1.6.6" variant="tip" size="medium"/> Access this exit code value 128 with the `TactExitCodeNullReferenceException` [constant][const].

### 129: Invalid serialization prefix {#129}

If there is an attempt to parse (deserialize) a [`Cell{:tact}`][cell] or [`Slice{:tact}`][slice] into a [message struct][message] and the parsed opcode prefix doesn't match the expected target one, an error with exit code $129$ is thrown: `Invalid serialization prefix`.

Thus, this error can occur whenever there is an opcode mismatch when using either of the following functions:

1. [`Message.fromCell{:tact}`](/ref/core-cells#messagefromcell)
2. [`Message.fromSlice(){:tact}`](/ref/core-cells#messagefromslice)

```tact
fun example() {
    // This cell contains a 32-bit opcode prefix (0x00000001)
    let cellOne = MsgOne {}.toCell();

    try {
        // This is a failed attempt to parse one message that has an opcode of 1 (0x00000001)
        // from a Cell with another message that has an opcode of 2 (0x00000002)
        let msgTwo = MsgTwo.fromCell(cellOne);
        dump(msgTwo.toCell());
    } catch (exitCode) {
        // exitCode is 129
    }
}

// An empty message struct with an opcode of 1 (0x00000001)
message(1) MsgOne {}

// An empty message struct with an opcode of 2 (0x00000002)
message(2) MsgTwo {}
```

Additionally, this error can happen if one hijacks the contract code before deployment and changes the opcodes of the [message structs][message] expected to be received in the contract.

<Badge text="Available since Tact 1.6.6" variant="tip" size="medium"/> Access this exit code value 129 with the `TactExitCodeInvalidSerializationPrefix` [constant][const].

### 130: Invalid incoming message {#130}

If the received internal or external message is not handled by the contract, an error with exit code $130$ is thrown: `Invalid incoming message`. It usually happens when the contract does not have a receiver for the particular message and its opcode prefix: a 32-bit integer header.

Consider the following contract:

```tact
import "@stdlib/deploy";

contract Dummy with Deployable {}
```

If you try to send any message except for [`Deploy{:tact}`](/ref/stdlib-deploy#deploy), provided by [`@stdlib/deploy`](/ref/stdlib-deploy), the contract will not have a receiver for it and thus will throw an error with exit code $130$.

This exit code is never thrown for mishandled or unrecognized [bounced messages](/book/bounced).

<Badge text="Available since Tact 1.6.6" variant="tip" size="medium"/> Access this exit code value 130 with the `TactExitCodeInvalidIncomingMessage` [constant][const].

### 131: Constraints error {#131}

Constraints error. Reserved, but never thrown.

<Badge text="Available since Tact 1.6.6" variant="tip" size="medium"/> Access this exit code value 131 with the `TactExitCodeConstraintsError` [constant][const].

### 132: Access denied {#132}

If you use the [`Ownable{:tact}`](/ref/stdlib-ownable#ownable) [trait][trait] from the [`@stdlib/ownable`](/ref/stdlib-ownable) library, the helper function `requireOwner(){:tact}` provided by it will throw an error with exit code $132$ if the sender of the inbound message does not match the specified owner: `Access denied`.

```tact
import "@stdlib/ownable";

contract Hal9k with Ownable {
    owner: Address;

    init(owner: Address) {
        self.owner = owner; // set the owner address upon deployment
    }

    receive("I'm sorry Dave, I'm afraid I can't do that.") {
        // Checks that the message sender's address equals the owner address,
        // and if not — throws an error with exit code 132.
        self.requireOwner();

        // ... you do you ...
    }
}
```

<Badge text="Available since Tact 1.6.6" variant="tip" size="medium"/> Access this exit code value 132 with the `TactExitCodeAccessDenied` [constant][const].

### 133: Contract stopped {#133}

A message has been sent to a "stopped" contract: a contract that inherits the [`Stoppable{:tact}`](/ref/stdlib-stoppable#stoppable) trait and has the `self.stopped{:tact}` flag set to `true{:tact}`.

<Badge text="Available since Tact 1.6.6" variant="tip" size="medium"/> Access this exit code value 133 with the `ContractStopped` [constant][const].

### 134: Invalid argument {#134}

If there is an invalid or unexpected argument value, an error with exit code $134$ is thrown: `Invalid argument`.

Here are some of the functions in Tact which can throw an error with this exit code:

1. [`Int.toFloatString(digits){:tact}`](/ref/core-strings#inttofloatstring): if `digits` is not in the interval $0 < digits < 78$.

2. [`String.fromBase64(){:tact}`](/ref/core-strings#stringfrombase64) and [`Slice.fromBase64(){:tact}`](/ref/core-cells#slicefrombase64): if the given [`String{:tact}`][p] or [`Slice{:tact}`][slice] contains non-Base64 characters.

```tact
try {
    // 0 is the code of NUL in ASCII, and it is not valid Base64
    let code: Slice = beginCell().storeUint(0, 8).asSlice().fromBase64();
} catch (exitCode) {
    // exitCode is 134
}
```

<Badge text="Available since Tact 1.6.6" variant="tip" size="medium"/> Access this exit code value 134 with the `TactExitCodeInvalidArgument` [constant][const].

### 135: Code of a contract was not found {#135}

If the code of the contract is missing or does not match the one saved in TypeScript wrappers, an error with exit code $135$ will be thrown: `Code of a contract was not found`.

<Badge text="Available since Tact 1.6.6" variant="tip" size="medium"/> Access this exit code value 135 with the `TactExitCodeContractCodeNotFound` [constant][const].

### 136: Invalid standard address {#136}

A value of type [`Address{:tact}`][p] is considered a valid internal standard address if:

* It occupies $267$ bits: $3$ bits for its tag prefix, $8$ bits for the [chain ID](https://docs.ton.org/learn/overviews/addresses#workchain-id), and $256$ bits for the [account ID](https://docs.ton.org/learn/overviews/addresses#account-id).
* Its prefix is `0b100`, meaning it's an [`addr_std` in TL-B notation](https://docs.ton.org/v3/documentation/data-formats/tlb/msg-tlb#addr_std10) with no optional data.

Such checks are currently only performed in the [`Slice.asAddress(){:tact}`](/ref/core-cells#sliceasaddress) function. If any of the above is false, the function throws an error with exit code $136$: `Invalid standard address`.

```tact
let basechainID = 0;
let addrSlice = beginCell()
    .storeUint(0b10_1, 3) // unsupported prefix!
    .storeInt(basechainID, 8) // chain ID 0
    .storeUint(0, 42) // and a wrong size of the account ID!
    .asSlice();

try {
    // The tag prefix and account ID are both incorrect
    dump(addrSlice.asAddress(basechainID));
} catch (exitCode) {
    // exitCode is 136
}
```

<Badge text="Available since Tact 1.6.6" variant="tip" size="medium"/> Access this exit code value 136 with the `TactExitCodeInvalidStandardAddress` [constant][const].

### 137: Masterchain support is not enabled for this contract {#137}

<Badge text="Removed since Tact 1.6" variant="tip" size="medium"/><p/>

Prior to removal, any attempts to point to the masterchain (ID $-1$) or otherwise interact with it without enabling masterchain support threw an exception with exit code $137$: `Masterchain support is not enabled for this contract`.

```tact
let masterchainID = -1;

try {
    // Zero address in masterchain without the config option set
    dump(newAddress(masterchainID, 0));
} catch (exitCode) {
    // exitCode is 137
}
```

### 138: Not a basechain address {#138}

<Badge text="Available since Tact 1.6.3" variant="tip" size="medium"/><p/>

The value of type [`Address{:tact}`][p] belongs to a basechain, when its [chain ID](https://docs.ton.org/learn/overviews/addresses#workchain-id) is equal to 0.

Such check is currently only performed in the [`forceBasechain(){:tact}`](/ref/core-addresses#forcebasechain) function. If the address does not belong to a basechain, i.e., its chain ID isn't 0, the function throws an error with exit code 138: `Not a basechain address`.

```tact
let someBasechainAddress: Address =
    newAddress(0, 0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8);

let someMasterchainAddress: Address =
    newAddress(-1, 0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8);

// Does not throw because the chain ID is 0
forceBasechain(someBasechainAddress);

try {
    // Throws because the chain ID is -1 (masterchain)
    forceBasechain(someMasterchainAddress);
} catch (exitCode) {
    // exitCode is 138
}
```

<Badge text="Available since Tact 1.6.6" variant="tip" size="medium"/> Access this exit code value 138 with the `TactExitCodeNotBasechainAddress` [constant][const].

[p]: /book/types#primitive-types
[trait]: /book/types/#traits
[cell]: /book/cells
[builder]: /book/cells#builders
[slice]: /book/cells#slices
[message]: /book/structs-and-messages#messages
[const]: /book/constants

[tlb]: https://docs.ton.org/develop/data-formats/tl-b-language
[tvm]: https://docs.ton.org/learn/tvm-instructions/tvm-overview
[bp]: https://github.com/ton-org/blueprint
[sb]: https://github.com/ton-org/sandbox
[jest]: https://jestjs.io



================================================
FILE: docs/src/content/docs/book/expressions.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/book/expressions.mdx
================================================
---
title: Expressions
description: "This page lists all the expressions in Tact"
---

import { Badge } from '@astrojs/starlight/components';

Every operator in Tact forms an expression, but there's much more to uncover, as Tact offers a wide range of expressive options to choose from.

:::note

  The current maximum allowed nesting level of expressions is 83. An attempt to write a deeper expression will result in a compilation error:

  ```tact
  fun elegantWeaponsForCivilizedAge(): Int {
      return
      ((((((((((((((((((((((((((((((((
          ((((((((((((((((((((((((((((((((
              (((((((((((((((((((( // 84 parens, compilation error!
                  42
              ))))))))))))))))))))
          ))))))))))))))))))))))))))))))))
      ))))))))))))))))))))))))))))))));
  }
  ```

:::

## Literals

Literals represent values in Tact. These are fixed values—not variables—that you _literally_ provide in your code. All literals in Tact are expressions themselves.

You can also call [extension functions](/book/functions#extensions) defined on certain [primitive types][p] directly on their corresponding literal values:

```tact
// Calling toString() defined for Int on an integer literal:
42.toString();

// Calling asComment() defined for String on a string literal:
"Tact is awesome!".asComment();
```

### Integer literals

Integer literals can be written in [decimal](/book/integers#decimal) (base $10$), [hexadecimal](/book/integers#hexadecimal) (base $16$), [octal](/book/integers#octal) (base $8$), and [binary](/book/integers#binary) (base $2$) notations:

* A [_decimal_ integer](/book/integers#decimal) literal is a sequence of digits ($\mathrm{0 - 9}$).

* A leading $\mathrm{0x}$ (or $\mathrm{0X}$) indicates a [hexadecimal integer](/book/integers#hexadecimal) literal. They can include digits ($\mathrm{0 - 9}$) and the letters $\mathrm{a - f}$ and $\mathrm{A - F}$. Note that the case of a character does not change its value. Therefore, $\mathrm{0xa}$ = $\mathrm{0xA}$ = 10 and $\mathrm{0xf}$ = $\mathrm{0xF}$ = 15.

* A leading $\mathrm{0o}$ (or $\mathrm{0O}$) indicates an [octal integer](/book/integers#octal) literal. They can include only the digits $\mathrm{0 - 7}$.

* A leading $\mathrm{0b}$ (or $\mathrm{0B}$) indicates a [binary integer](/book/integers#binary) literal. They can include only the digits $0$ and $1$.

:::caution
  Be wary that in Tact, integer literals with a leading $0$ are still considered decimals, unlike in JavaScript/TypeScript, where a leading $0$ indicates an octal!
:::

Some examples of integer literals:

```tact
// decimal, base 10:
0, 42, 1_000, 020

// hexadecimal, base 16:
0xABC, 0xF, 0x0011

// octal, base 8:
0o777, 0o001

// binary, base 2:
0b01111001_01101111_01110101_00100000_01100001_01110010_01100101_00100000_01100001_01110111_01100101_01110011_01101111_01101101_01100101
```

Read more about integers and the [`Int{:tact}`](/book/integers) type on the dedicated page: [Integers](/book/integers).

### Boolean literals

The [`Bool{:tact}`](/book/types#booleans) type has only two literal values: `true{:tact}` and `false{:tact}`.

```tact
true == true;
true != false;
```

Read more about booleans and the [`Bool{:tact}`](/book/types#booleans) type in the dedicated chapter: [Booleans](/book/types#booleans).

### String literals

A string literal is zero or more characters enclosed in double (`"`) quotation marks. All string literals are objects of the [`String{:tact}`][p] type.

```tact
"foo";
"1234";
```

Tact strings support a range of [escape sequences](https://en.wikipedia.org/wiki/Escape_sequence) starting with a backslash `\\` character:

* `\\{:tact}` — literal backslash
* `\"{:tact}` — double quote
* `\n{:tact}` — newline
* `\r{:tact}` — carriage return
* `\t{:tact}` — tab
* `\v{:tact}` — vertical tab
* `\b{:tact}` — backspace
* `\f{:tact}` — form feed
* `\x00{:tact}` through `\xFF{:tact}` — [code point](https://en.wikipedia.org/wiki/Code_point), must be exactly two hex digits long
* `\u0000{:tact}` through `\uFFFF{:tact}` — [Unicode code point][unicode], must be exactly four hex digits long
* `\u{0}{:tact}` through `\u{10FFFF}{:tact}` — [Unicode code point][unicode], can be from 1 to 6 hex digits long

[unicode]: https://en.wikipedia.org/wiki/Unicode#Codespace_and_code_points

```tact
// \\
"escape \\ if \\ you \\ can \\";

// \"
"this \"literally\" works";

// \n
"line \n another line";

// \r
"Shutters \r Like \r This \r One";

// \t
"spacing \t granted!";

// \v
"those \v words \v are \v aligned";

// \b
"rm\b\bcreate!";

// \f
"form \f feed";

// \x00 - \xFF
"this \x22literally\x22 works"; // \x22 represents a double quote

// \u0000 - \uFFFF
"danger, \u26A1 high voltage \u26A1"; // \u26A1 represents the ⚡ emoji

// \u{0} - \u{10FFFF}
"\u{1F602} LOL \u{1F602}"; // \u{1F602} represents the 😂 emoji

// This Unicode code point is outside of valid range 000000–10FFFF
"\u{FFFFFF}"; // COMPILATION ERROR!
```

:::note

  Read more about strings and the [`String{:tact}`][p] type:\
  [Primitive types in the Book][p]\
  [Strings and StringBuilders in the Reference](/ref/core-strings)

:::

### `null` literal

The `null{:tact}` value is written with a `null{:tact}` literal. It is **not** an [identifier](#identifiers) and does not refer to any object. It is also **not** an instance of a [primitive type][p]. Instead, `null{:tact}` represents a lack of identification and the intentional absence of any value.

```tact
let var: Int? = null; // variable which can hold a null value
var = 42;
if (var != null) {
    var!! + var!!;
}
```

Read more about working with `null{:tact}` on the dedicated page: [Optionals](/book/optionals).

### Map literals

<Badge text="Available since Tact 1.6.7" variant="tip" size="medium"/><p/>

Map literals create maps by enclosing a comma-delimited list of zero or more predefined key-value pairs in curly braces.

```tact
// A compile-time map literal
let myMap: map<Int as uint8, Int as int13> = map<Int as uint8, Int as int13> {
    // Key expression: Value expression
    1 + 2: 10 * pow2(3), // key 3, value 80
    1 + 3: 20 * pow2(4), // key 4, value 320
};
myMap.get(3)!!; // 80
myMap.get(4)!!; // 320
```

Read more: [Initialize a map with a literal](/book/maps#initialize).

:::note

  Support for runtime initialization values that are not resolved at [compile-time](/ref/core-comptime) is planned for future Tact releases.

:::

## Identifiers

An identifier is a sequence of characters in the code that _identifies_ a [variable](/book/statements#let), [constant](/book/constants), [function](/book/functions), as well as a [Struct][s], [Message][m], [contract](/book/contracts), [trait](/book/types#traits), or their fields and methods. Identifiers are case-sensitive and not quoted.

In Tact, identifiers may contain Latin lowercase letters `a-z`, Latin uppercase letters `A-Z`, underscores `_`, and digits $\mathrm{0 - 9}$, but may not start with a digit. No other symbols are allowed, and Unicode identifiers are prohibited.

Note that identifiers for [primitive types][p] start with an uppercase letter. User-defined [composite types](/book/types#composite-types), such as [Structs][s] and [Messages][m], must also be capitalized.

:::caution

  All identifiers starting with `__gen` and `__tact` are not allowed and are instead reserved for internal use by the compiler.

:::

## Instantiation

You can create instances of [structs][s] and [message structs][m].

```tact
struct StExample {
    fieldInit: Int = 1;
    fieldUninit: Int;
}

fun example() {
    // Instance with default value of fieldInit
    StExample { fieldUninit: 2 };

    // Instance with both fields set
    StExample {
        fieldInit: 0,
        fieldUninit: 2, // trailing comma is allowed
    };
}
```

## Field access

You can directly access fields of [structs][s] and [message structs][m].

```tact
struct StExample {
    fieldInit: Int = 1;
    fieldUninit: Int;
}

fun example(): Int {
    let struct: StExample = StExample { fieldUninit: 2 }; // instantiation

    struct.fieldInit;          // access a field
    return struct.fieldUninit; // return field value from the function
}
```

## Extension function call

[Extension functions](/book/functions#extensions) are defined only on specific types. They can be called similarly to method calls in many other languages:

```tact
42.toString(); // toString() is a stdlib function that is defined on Int type
```

## Static function call

A [global function](/book/functions#fun-global) or a [internal function](/book/functions#fun-internal) of a [contract](/book/contracts) can be called from anywhere in the function body:

```tact
contract ExampleContract {
    receive() {
        now(); // now() is a static function of stdlib
        let expiration: Int = now() + 1000; // operation and variable definition
        expiration = self.answerQuestion(); // internal function
    }
    fun answerQuestion(): Int {
        return 42;
    }
}
```

## `initOf` {#initof}

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

The expression `initOf{:tact}` computes the initial state, i.e., `StateInit{:tact}`, of a [contract](/book/contracts):

```tact
//                     argument values of contract or init() parameters
//                     ↓   ↓
initOf ExampleContract(42, 100); // returns a Struct StateInit{}
//     ---------------
//     ↑
//     name of the contract
//     ↓
//     ---------------
initOf ExampleContract(
    42,  // first argument
    100, // second argument; a trailing comma is allowed
);
```

The `StateInit{:tact}` is a [struct][s] consisting of the following fields:

Field  | Type                  | Description
:----- | :-------------------- | :----------
`code` | [`Cell{:tact}`][cell] | The initial code of the [contract](/book/contracts) (compiled bitcode)
`data` | [`Cell{:tact}`][cell] | The initial data of the [contract](/book/contracts) (parameters of the [`init(){:tact}`](/book/contracts#init-function) function or [contract parameters](/book/contracts#parameters))

:::note

  For workchain 0, the [`Address{:tact}`][p] of the current contract obtained by calling the [`myAddress(){:tact}`](/ref/core-contextstate#myaddress) function is identical to the one that can be obtained by calling the [`contractAddress(){:tact}`](/ref/core-addresses#contractaddress) function with the initial state of the current contract computed via `initOf{:tact}`:

  ```tact {6}
  contract TheKingPrawn {
      receive("keeping the address") {
          let myAddr1 = myAddress();
          let myAddr2 = contractAddress(initOf TheKingPrawn());

          myAddr1 == myAddr2; // true
      }
  }
  ```

  However, if you only need the address of the current contract at runtime and not its `StateInit{:tact}`, use the [`myAddress(){:tact}`](/ref/core-contextstate#myaddress) function, as it consumes **significantly** less gas.

:::

## `codeOf` {#codeof}


<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/>
<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

The expression `codeOf{:tact}` returns a [`Cell{:tact}`][cell] containing the code of a [contract](/book/contracts):

```tact
codeOf ExampleContract; // a Cell with ExampleContract code
//     ---------------
//     ↑
//     name of the contract
```

If `codeOf{:tact}` is used for the current contract, its result is equivalent to calling [`myCode(){:tact}`](/ref/core-contextstate#mycode).

```tact
contract ExampleContract() {
    receive() {
        myCode() == codeOf ExampleContract; // true
    }
}
```

If you only need the code of a given contract and not its [`StateInit{:tact}`](#initof), prefer using `codeOf ContractName{:tact}` over [`initOf ContractName(param1, param2, ...){:tact}`](#initof) to **significantly** reduce gas usage.

[p]: /book/types#primitive-types
[cell]: /book/cells#cells
[s]: /book/structs-and-messages#structs
[m]: /book/structs-and-messages#messages



================================================
FILE: docs/src/content/docs/book/external.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/book/external.mdx
================================================
---
title: External Messages
description: "External messages don't have a sender and can be sent by anyone from off-chain."
---

:::caution
  This page is under reconstruction as per [#384](https://github.com/tact-lang/tact-docs/issues/384). All anchor links (`#`) may change in the future!
:::

:::caution
  External message support must be explicitly enabled in the project configuration.
  Without enabling it, compilation will fail.
:::

External messages are messages that don't have a sender and can be sent by anyone in the world. External messages are useful tools for integrating with off-chain systems or for general contract maintenance. Handling external messages differs from handling internal messages. In this section, we will cover how to handle external messages.

## How External Messages are Different

External messages differ from internal messages in the following ways:

### Contracts Pay for Gas Usage Themselves

When processing internal messages, the sender usually pays for gas usage. When processing external messages, the contract pays for gas usage. This means that you need to be careful with gas usage in external messages. You should always test your contracts' gas usage and verify that everything is working as intended.

### Messages Have to Be Accepted Manually

External messages are not accepted automatically. You need to accept them manually. This is done by calling the `acceptMessage` function. If you don't call the `acceptMessage` function, the message will be rejected. This mechanism prevents the spamming of external messages.

### 10k Gas Limit Before Message Acceptance

The 10k gas amount is a very small limit, and Tact itself can consume a sizable amount of gas before it even reaches your code. You should always test the gas usage of your contracts and verify that everything is working as intended.

:::tip[Hey there!]

  The 10k gas limit for external messages is based on the parameter set by the validator for the entire blockchain in the `gas_limit` field. You can refer to:
  - https://docs.ton.org/develop/smart-contracts/guidelines/accept#external-messages
  - https://docs.ton.org/develop/howto/blockchain-configs#param-20-and-21

:::

### Unbounded Gas Usage After Message Acceptance

After accepting a message, the contract can use as much gas as it wants. This is allowed to let the contract carry out any kind of processing. You should always test the gas usage of your contracts, verify everything is working as intended, and avoid possible vulnerabilities that could drain the contract balance.

### No Context Available

When processing an external message, the `context` and `sender` functions are not available. This is because there is no context available for external messages. Therefore, you cannot use the `context` and `sender` functions in external messages. You need to carefully test your contract to ensure that it does not use the `context` and `sender` functions.

## Enable external message receivers support

You can enable the external message support in the [`tact.config.json`](/book/config) by setting the [`external`](/book/config#options-external) option to `true{:json}`.

```json title="tact.config.json" {8}
{
  "projects": [
    {
      "name": "some_prefix",
      "path": "./contract.tact",
      "output": "./contract_output",
      "options": {
        "external": true
      }
    }
  ]
}
```

## External receivers

External receivers are defined in the same way as internal ones, but using the `external` keyword instead of `receive`:

```tact
contract SampleContract {
    external("Check Timeout") {

        // Check for contract timeout
        require(self.timeout > now(), "Not timed out");

        // Accept message
        acceptMessage();

        // Timeout processing
        self.onTimeout();
    }
}
```

External receivers follow the same execution order conventions as [internal receivers](/book/receive).

## Contract storage handling

External message receivers handle contract storage just as [internal message receivers](/book/receive#contract-storage-handling) do. In addition, the empty [`return{:tact}` statement](/book/statements#return) and the [`throw(0){:tact}`](/ref/core-debug#throw) patterns [work the same](/book/receive#contract-storage-handling).



================================================
FILE: docs/src/content/docs/book/func.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/book/func.mdx
================================================
---
title: Compatibility with FunC
description: "Tact compiles to FunC and maps all its entities directly to various FunC and TL-B types."
---

Tact itself compiles to FunC and maps all its entities directly to various FunC and TL-B types.

## Convert types

[Primitive types](/book/types#primitive-types) in Tact are directly mapped to FunC ones.

All rules about copying variables are the same. One of the main differences is that there are no visible mutation operators in Tact, and most [`Slice{:tact}`](/book/cells#slices) operations mutate variables in place.

## Convert serialization

Serialization of [structs][struct] and [Messages](/book/structs-and-messages#messages) in Tact is automatic, unlike FunC, where you need to define serialization logic manually.

Tact's auto-layout algorithm is greedy. This means that it takes the next variable, calculates its size, and tries to fit it into the current cell. If it doesn't fit, it creates a new cell and continues. All inner structs for auto-layout are flattened before allocation.

All optional types are serialized as `Maybe` in TL-B, except for [`Address{:tact}`](/book/types#primitive-types).

There is no support for `Either` since it does not define which variant to pick during serialization in some cases.

### Examples

```tact
// _ value1:int257 = SomeValue;
struct SomeValue {
    value1: Int; // Default is 257 bits
}
```

```tact
// _ value1:int256 value2:uint32 = SomeValue;
struct SomeValue {
    value1: Int as int256;
    value2: Int as uint32;
}
```

```tact
// _ value1:bool value2:Maybe bool = SomeValue;
struct SomeValue {
    value1: Bool;
    value2: Bool?;
}
```

```tact
// _ cell:^cell = SomeValue;
struct SomeValue {
    cell: Cell; // Always stored as a reference
}
```

```tact
// _ cell:^slice = SomeValue;
struct SomeValue {
    cell: Slice; // Always stored as a reference
}
```

```tact
// _ value1:int256 value2:int256 value3:int256 ^[value4:int256] = SomeValue;
struct SomeValue {
    value1: Int as int256;
    value2: Int as int256;
    value3: Int as int256;
    value4: Int as int256;
}
```

```tact
// _ value1:int256 value2:int256 value3:int256 ^[value4:int256] flag:bool = SomeValue;
struct SomeValue {
    value1: Int as int256;
    value2: Int as int256;
    value3: Int as int256;
    flag: Bool; // Flag is written before value4 to prevent auto-layout from allocating it to the next cell
    value4: Int as int256;
}
```

```tact
// _ value1:int256 value2:int256 value3:int256 ^[value4:int256 flag:bool] = SomeValue;
struct SomeValue {
    value1: Int as int256;
    value2: Int as int256;
    value3: Int as int256;
    value4: Int as int256;
    flag: Bool;
}
```

```tact
// _ value1:int256 value2:^TailString value3:int256 = SomeValue;
struct SomeValue {
    value1: Int as int256;
    value2: String;
    value3: Int as int256;
}
```

## Convert received messages to `op` operations

Tact generates a unique `op` for every received typed message, but it can be overridden.

The following code in FunC:

```func
() recv_internal(int msg_value, cell in_msg_cell, slice in_msg) impure {
    ;; incoming message code...

    ;; Receive MessageWithGeneratedOp message
    if (op == 1180414602) {
        ;; code...
    }

    ;; Receive MessageWithOverwrittenOp message
    if (op == 291) {
        ;; code...
    }

}
```

Becomes this in Tact:

```tact
message MessageWithGeneratedOp {
    amount: Int as uint32;
}

message(0x123) MessageWithOverwrittenOp {
    amount: Int as uint32;
}

contract Contract {
    // Contract Body...

    receive(msg: MessageWithGeneratedOp) {
        // code...
    }

    receive(msg: MessageWithOverwrittenOp) {
        // code...
    }

}
```

## Convert `get`-methods

You can express everything except `list-style-lists` in Tact that would be compatible with FunC's `get`-methods.

### Primitive return type

If a `get`-method returns a primitive in FunC, you can implement it the same way in Tact.

The following code in FunC:

```func
int seqno() method_id {
    return 0;
}
```

Becomes this in Tact:

```tact
get fun seqno(): Int {
    return 0;
}
```

### Tensor return types

In FunC, there is a difference between the tensor types `(int, int){:func}` and `(int, (int)){:func}`, but for TVM there is no difference; they both represent a stack of two integers.

To convert the tensor returned from a FunC `get`-method, you need to define a [struct][struct] that has the same field types as the tensor and in the same order.

The following code in FunC:

```func
(int, slice, slice, cell) get_wallet_data() method_id {
    return ...;
}
```

Becomes this in Tact:

```tact
struct JettonWalletData {
    balance: Int;
    owner: Address;
    master: Address;
    walletCode: Cell;
}

contract JettonWallet {
    get fun get_wallet_data(): JettonWalletData {
        return ...;
    }
}
```

### Tuple return type

In FunC, if you are returning a tuple instead of a tensor, you need to follow the same process used for a tensor type but define the return type of a `get`-method as optional.

The following code in FunC:

```func
[int, int] get_contract_state() method_id {
    return ...;
}
```

Becomes this in Tact:

```tact
struct ContractState {
    valueA: Int;
    valueB: Int;
}

contract StatefulContract {
    get fun get_contract_state(): ContractState? {
        return ...;
    }
}
```

### Mixed tuple and tensor return types

When some of the returned values are tuples within a tensor, you need to define a struct as in the previous steps, and the tuple itself must be defined as a separate [struct][struct].

The following code in FunC:

```func
(int, [int, int]) get_contract_state() method_id {
    return ...;
}
```

Becomes this in Tact:

```tact
struct ContractStateInner {
    valueA: Int;
    valueB: Int;
}

struct ContractState {
    valueA: Int;
    valueB: ContractStateInner;
}

contract StatefulContract {
    get fun get_contract_state(): ContractState {
        return ...;
    }
}
```

### Arguments mapping

Conversion of arguments for `get` methods is straightforward. Each argument is mapped _as-is_ to a FunC argument, and each tuple is mapped to a [struct][struct].

The following FunC code:

```func
(int, [int, int]) get_contract_state(int arg1, [int,int] arg2) method_id {
    return ...;
}
```

becomes this in Tact:

```tact
struct ContractStateArg2 {
    valueA: Int;
    valueB: Int;
}

struct ContractStateInner {
    valueA: Int;
    valueB: Int;
}

struct ContractState {
    valueA: Int;
    valueB: ContractStateInner;
}

contract StatefulContract {
    get fun get_contract_state(arg1: Int, arg2: ContractStateArg2): ContractState {
        return ContractState {
            valueA: arg1,
            valueB: ContractStateInner {
                valueA: arg2.valueA,
                valueB: arg2.valueB, // trailing comma is allowed
            }, // trailing comma is allowed
        };
    }
}
```

[struct]: /book/structs-and-messages#structs



================================================
FILE: docs/src/content/docs/book/functions.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/book/functions.mdx
================================================
---
title: Functions
description: "Global, asm, native functions, as well as receivers, getters, and internal functions, plus the many attributes that allow for great flexibility and expressivity in the Tact language"
---

import { Badge, CardGrid, LinkCard } from '@astrojs/starlight/components';

Tact offers a diverse set of function kinds and attributes that provide great flexibility and expressivity. While some functions stand out, many of their [parts and behaviors are common](#commonalities).

<CardGrid>
  <LinkCard
    title="Receiver functions"
    href="#receivers"
  />
  <LinkCard
    title="Regular functions"
    href="#fun"
  />
  <LinkCard
    title="Extension functions"
    href="#extends"
  />
  <LinkCard
    title="Extension mutation functions"
    href="#mutates"
  />
  <LinkCard
    title="Getter functions"
    href="#get"
  />
  <LinkCard
    title="Init function"
    href="#init"
  />
  <LinkCard
    title="Native functions"
    href="#native"
  />
  <LinkCard
    title="Assembly functions"
    href="#asm"
  />
  <LinkCard
    title="Inheritance"
    href="#inheritance"
  />
  <LinkCard
    title="Inlining"
    href="#inline"
  />
  <LinkCard
    title="Commonalities"
    href="#commonalities"
  />
  <LinkCard
    title="Low-level representation"
    href="#low-level-representation"
  />
</CardGrid>

## Receiver functions {#receivers}

Receiver functions are special functions responsible for [receiving messages](/book/receive) in contracts and can be defined only within a contract or trait.

```tact
contract Counter(counter: Int) {
    // This means that this contract can receive the Increment message body,
    // and this function would be called to handle such messages.
    receive(msg: Increment) {
        self.counter += 1;
    }
}

message Increment {}
```

There are three kinds of receiver functions in Tact:

* [`receive(){:tact}`](#receive), which receives internal messages from other contracts.
* [`bounced(){:tact}`](#bounced), which is processed when an outgoing message from this contract bounces back.
* [`external(){:tact}`](#external), which doesn't have a sender and can be sent by anyone in the world.

### `receive` — internal message receivers {#receive}

<Badge text="Contract scope" variant="note" size="medium"/><p/>

The most common receiver functions, `receive(){:tact}`, handle incoming messages from other contracts.

```tact
// This contract defines various kinds of receivers in their
// order of handling the corresponding incoming messages.
contract OrderOfReceivers() {
    // Empty receiver
    receive() {
        inMsg().bits; // 0
    }

    // Text receiver
    receive("yeehaw!") {
        inMsg().asString(); // "yeehaw!"
    }

    // Catch-all String receiver
    receive(str: String) {
        // ...
    }

    // Binary message receiver
    receive(msg: FancyMessage) {
        // ...
    }

    // Catch-all Slice receiver
    receive(rawMsg: Slice) {
        // ...
    }
}

message FancyMessage {}
```

Read more about them on their dedicated page: [Receive messages](/book/receive).

### `bounced` — bounced internal message receivers {#bounced}

<Badge text="Contract scope" variant="note" size="medium"/><p/>

The `bounced(){:tact}` is a special kind of receivers which handle outgoing messages that were sent from this contract and bounced back to it.

```tact
contract Bouncy() {
    // Handles empty message bodies
    receive() {
        // Sending a message...
        message(MessageParameters{
            to: sender(),
            value: ton("0.1"),
            body: BB {}.toCell(), // ...with a BB message body
        });
    }

    // If the BB message body wasn't successfully processed by the recipient,
    // it can bounce back to our contract, in which case the following receiver
    // will handle it.
    bounced(msg: bounced<BB>) {
        // ...
    }
}

message BB {}
```

Read more about them on their dedicated page: [Bounced messages](/book/bounced).

### `external` — external message receivers {#external}

<Badge text="Contract scope" variant="note" size="medium"/><p/>

The `external(){:tact}` is a special kind of receivers which handle external messages — they are sent from the off-chain world and do not have a sender address on the blockchain. Such messages are often sent to wallet contracts to process specific messages or simply to send funds to another wallet contract.

```tact
contract FeaturelessWallet(publicKey: Int as uint256) {
    external(msg: MessageWithSignedData) {
        // Can't be replied to as there's no sender!
        // Thus, many checks are required.
        throwUnless(35, msg.bundle.verifySignature(self.publicKey));
    }
}

message MessageWithSignedData {
    bundle: SignedBundle;
    walletId: Int as int32;
    seqno: Int as uint32;
}
```

Read more about them on their dedicated page: [External messages](/book/external).

## `fun` — regular functions {#fun}

<Badge text="Any scope" title="These functions can be declared or defined within contracts and at the top level" variant="note" size="medium"/><p/>

Regular functions are defined using the `fun{:tact}` keyword.

```tact
fun add(a: Int, b: Int): Int {
    return a + b;
}
```

Read about common aspects of functions: [Commonalities](#commonalities).

### Global functions {#fun-global}

<Badge text="Global scope" variant="note" size="medium"/><p/>

Regular functions that can be defined only at the top (module) level are called global. They differ from [internal functions](#fun-internal) not only in the scope, but also in available [attributes](#commonalities-attributes).

```tact
fun reply(msgBody: Cell) {
    message(MessageParameters {
        to: sender(),
        value: 0,
        mode: SendRemainingValue | SendIgnoreErrors,
        body: msgBody,
    });
}
```

The following attributes can be specified for global functions:

* [`inline{:tact}`](#inline) — embeds the function contents at the call site.
* [`extends{:tact}`](#extends) — makes it an [extension function](#extends).
* [`mutates{:tact}`](#mutates), along with [`extends{:tact}`](#extends) — makes it an [extension mutation function](#mutates).

These attributes _cannot_ be specified:

* [`abstract{:tact}`](#abstract), [`virtual{:tact}`](#virtual) and [`override{:tact}`](#override) — global functions cannot be defined within a contract or a trait.
* [`get{:tact}`](#get) — global functions cannot be [getters](#get).

### Internal functions {#fun-internal}

<Badge text="Contract scope" variant="note" size="medium"/><p/>

These functions behave similarly to private methods in popular object-oriented languages — they are internal to contracts and can be called by prefixing their names with a special [identifier `self{:tact}`](/book/contracts#self). That is why internal (or member) functions are sometimes referred to as "contract methods".

Internal functions can access the contract's [persistent state variables](/book/contracts#variables) and [constants](/book/contracts#constants).

They can only be called from [receivers](#receivers), [getters](#get), and other internal functions, but not from other contracts.

```tact
contract InternalFun(stopped: Bool) {
    // Let's define an internal function to ensure that the contract was not stopped.
    fun requireNotStopped() {
        throwUnless(TactExitCodeContractStopped, !self.stopped);
    }
    // And use that internal function within a getter.
    get fun veryImportantComputation(): Int {
        // Internal function calls are prefixed with `self`
        self.requireNotStopped();
        return 2 + 2;
    }
}
```

The following attributes can be specified for internal functions with no prior attributes:

* [`inline{:tact}`](#inline) — embeds the function contents at the call site.
* [`abstract{:tact}`](#abstract), [`virtual{:tact}`](#virtual) and [`override{:tact}`](#override) — function [inheritance](#inheritance).
* [`get{:tact}`](#get) — internal functions can become [getters](#get).

These attributes _cannot_ be specified:

* [`extends{:tact}`](#extends) — internal function cannot become an [extension function](#extends).
* [`mutates{:tact}`](#mutates) — internal function cannot become an [extension mutation function](#mutates).

## Extensions

<Badge text="Global scope" variant="note" size="medium"/><p/>

[Extension functions](#extends) provide a clean way to organize and extend code by allowing you to add new behaviors to existing types. The [extension _mutation_ functions](#mutates) also allow you to modify the value they operate on. Both kinds of extension functions can be called methods and both use special attributes: [`extends{:tact}`](#extends) and [`mutates{:tact}`](#mutates), respectively.

### `extends` — extension functions {#extends}

<Badge text="Global scope" title="This attribute can be applied to top-level functions only" variant="note" size="medium"/><p/>

The `extends{:tact}` attribute can be applied to all top level functions, transforming them into statically dispatched methods on the extended type. These methods are called _extension functions_.

To define an extension function, add an `extends{:tact}` attribute to any [global function](#fun-global) and name its first parameter as `self`. The type of `self` is the type that is being extended.

```tact
// Extension function that compares two instances of the `StdAddress` type.
extends fun equals(self: StdAddress, other: StdAddress): Bool {
    if (self.workchain == other.workchain && self.address == other.address) {
        return true;
    }
    return false;
}
```

The special `self{:tact}` identifier inside an extension function is a copy of the value of the extended type. In other words, it is the argument value passed to the `self` parameter.

```tact
// Let's define a variable to call the `equals()` extension function on.
let addr = parseStdAddress(
    address("EQAFmjUoZUqKFEBGYFEMbv-m61sFStgAfUR8J6hJDwUU09iT").asSlice(),
);

// You can call extension functions on instances of the extended type,
// such as variables...
addr.equals(addr); // true

// ...literals and structure instances...
StdAddress {
    workchain: addr.workchain,
    address: addr.address,
}.equals(addr); // true

// ...or any other values of that type.
parseStdAddress(
    address("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N").asSlice()
).equals(addr); // false
```

Most of the standard library functions that work with values of the [`Builder{:tact}`][builder] type are extension functions on that type. As such, they do not modify the original value they are applied to.

To preserve newly created values with extension functions, use intermediary assignments or make a long chained call in a single assignment.

```tact
let builder = beginCell();
let cell = builder
    .storeUint(42, 7)
    .storeInt(42, 7)
    .storeBool(true)
    .storeSlice(slice)
    .storeCoins(42)
    .storeAddress(address)
    .storeRef(cell)
    .endCell();
// Notice that the chained extension function call did not change
// the `builder` variable itself, which is still holding an empty Builder.
builder.refs(); // 0
builder.bits(); // 0
```

The first parameter of extension functions must be named `self`. Failure to do so leads to a compilation error.

Additionally, naming the first parameter of any non-extension function as `self{:tact}` leads to a compilation error too.

```tact
// COMPILATION ERROR! Extend function must have first parameter named "self"
extends fun add(this: Int, other: Int): Int {
    //          ~~~~~~~~~
    return this + other;
}

// COMPILATION ERROR! Parameter name "self" is reserved for functions with "extends"
fun add(self: Int, other: Int): Int {
    //  ~~~~~~~~~
    return self + other;
}
```

The following additional attributes can be specified:

* [`inline{:tact}`](#inline) — embeds the function contents at the call site.
* [`mutates{:tact}`](#mutates) — makes it into an [extension mutation function](#mutates).

These attributes _cannot_ be specified:

* [`abstract{:tact}`](#abstract), [`virtual{:tact}`](#virtual) and [`override{:tact}`](#override) — extension functions cannot be defined within a contract or a trait.
* [`get{:tact}`](#get) — extension functions cannot become [getters](#get).

### `mutates` — extension mutation functions {#mutates}

<Badge text="Global scope" title="This attribute can be applied to top-level functions only" variant="note" size="medium"/><p/>

The `mutates{:tact}` attribute can be applied to [extension functions](#extends) only, which enables the persistence of the modifications made to the value of the extended type through the `self{:tact}` identifier. They allow mutations, and so they are called _extension mutation functions_.

The extension _mutation_ functions replace the value of the extended type with the new one at the end of its execution. That value would change only upon the assignment to `self{:tact}` within the function body.

To define an extension mutation function, add a `mutates{:tact}` attribute to the existing [extension function](#extends).

```tact
// Like the `skipBool` extension mutation function, but usable in chain calls.
extends mutates fun chainSkipBool(self: Slice): Slice {
    self.skipBool();

    // Notice that returning the `self` value gives a copy of the slice,
    // but not a mutable reference to it. Therefore, chaining of mutation functions
    // is not very useful in most cases, and may lead to seemingly weird errors.
    return self;
}
```

For extension mutation functions, the special `self{:tact}` identifier refers to the value of the extended type, and changes made to it will persist after the function call.

```tact
// It is most useful to call extension mutation functions on instances
// of the extended type that can keep the change stored either temporarily, i.e.,
// within the current transaction, or permanently — in the contract's state.
contract Mut(val: Slice) {
    receive() {
        let valTmp = beginCell().storeBool(true).storeInt(42, 7).asSlice();
        valTmp.chainSkipBool().loadInt(7); // 42
        self.val.chainSkipBool().loadInt(7); // 42
        // Now, `valTmp` holds a slice without one bit, i.e.,
        // only the value 42 stored using 7 bits. The `self.val` holds its original
        // slice but without one bit from its front.
    }
}
```

Extension mutation functions cannot modify [constants](/book/constants) because they are immutable.

```tact
// Constant of the Int type
const VAL: Int = 10;

// Extension mutation function for the Int type
extends mutates fun divideInHalf(self: Int) { self /= 2 }

fun noEffect() {
    VAL; // 10
    VAL.divideInHalf();
    VAL; // still 10
}
```

The following additional attributes can be specified:

* [`inline{:tact}`](#inline) — embeds the function contents at the call site.

These attributes _cannot_ be specified:

* [`abstract{:tact}`](#abstract), [`virtual{:tact}`](#virtual) and [`override{:tact}`](#override) — extension mutation functions cannot be defined within a contract or a trait.
* [`get{:tact}`](#get) — extension mutation functions cannot become [getters](#get).

### Static extension functions {#extends-static}

There is no such attribute yet, so the special static extension functions in the standard library of Tact are introduced directly by the compiler:

* [`Message.opcode(){:tact}`](/ref/core-cells#messageopcode)
* [`Message.fromCell(){:tact}`](/ref/core-cells#messagefromcell)
* [`Message.fromSlice(){:tact}`](/ref/core-cells#messagefromslice)
* [`Struct.fromCell(){:tact}`](/ref/core-cells#structfromcell)
* [`Struct.fromSlice(){:tact}`](/ref/core-cells#structfromslice)

## `get fun` — off-chain getter functions {#get}

<Badge text="Contract scope" variant="note" size="medium"/><p/>

The special `get{:tact}` attribute cannot be combined with any other attribute. It is applied to [internal functions](#fun-internal), transforming them into so-called _getter functions_ (or getters for short). These functions are externally accessible off-chain, allowing direct reading of contract state without regular message passing.

```tact
contract StaleCounter(val: Int as uint32) {
    // Getter function that simply returns the current value of the state variable
    get fun value(): Int {
        return self.val;
    }

    // Getter function that performs basic calculations
    get fun valuePlus(another: Int): Int {
        return self.val + another;
    }
}
```

Despite the restriction on attributes, getter functions can still be considered internal or contract methods — calling them from within another contract function is possible. In those cases, their behavior would be identical to calling an internal function through `self{:tact}`, including any state modifications those functions can perform.

However, most of the time, getter functions are there to be called from the off-chain world. And when they are called that way and not via `self{:tact}`, their state modifications no longer persist between transactions (changes are discarded).

```tact
contract WillNotBudge(val: Int) {
    get fun changeVal() {
        self.val = randomInt();
        self.val; // ?, it is random!
        // However, after this function is done,
        // the self.val will be reset to its value prior to this function call.
    }
}
```

Furthermore, when **not** used as internal functions, getters do not pay the [compute fees](https://docs.ton.org/develop/howto/fees-low-level#computation-fees) and have their gas limits to prevent infinite loops or endless transactions. That is, getters can perform arbitrary computations if their internal gas limit is not surpassed in a single transaction.

Those gas limits depend on the API provider used to call a certain getter, but they are usually around 100 million gas units per getter call.

With that in mind, getters are most commonly used for fetching the current state of contract's persistent state variables. To do so in a convenient matter, Tact allows you to view the contract itself as a [struct][struct] of contract variables, i.e., to use `self{:tact}` to refer to the contract itself and return all of its state variable values at once in a single getter.

```tact
contract ManyFields(
    f1: Int,
    f2: Int,
    // ...
    f42: Int,
) {
    // Notice that the return type of this get function coincides
    // with the name of the contract, which makes that return type
    // view the contract as a struct of its variables.
    get fun state(): ManyFields {
        return self; // you do not have to list all fields of a contract for this
    }
}
```

Keep in mind that getters can obtain the contract's data only off-chain. However, for one contract to retrieve data from another contract on-chain, it must exchange messages with it. Since communication is asynchronous, the received data might become irrelevant or invalid because, by the time the message with that data reaches your contract, the actual state of variables on another contract might have changed already.

Thus, efficient data exchange is only feasible in contract systems where you have control over the source code of all contracts or when the interface and behavior of some contracts are defined strictly according to some [standards](https://github.com/ton-blockchain/teps), such as [Jettons](/cookbook/jettons) or [NFTs](/cookbook/nfts).

Even in such cases, contracts on TON exchange messages as signals to perform a certain action on or with the sent data but never merely to read the state of another contract.

### Method IDs

Like other functions in TON contracts, getters have their _unique_ associated function selectors, which are 19-bit signed integer identifiers commonly called [_method IDs_](#low-level-representation).

Method IDs of getters are derived from their names using the [CRC16](https://en.wikipedia.org/wiki/Cyclic_redundancy_check) algorithm as follows: `(crc16(<function_name>) & 0xffff) | 0x10000`. In addition, the Tact compiler conditionally reserves some method IDs for use in [getters of supported interfaces](/book/contracts#interfaces), namely: 113617 for `supported_interfaces`, 115390 for `lazy_deployment_completed`, and 121275 for `get_abi_ipfs`.

Thus, getters and their method IDs are an important part of the contract interfaces, to the point where explorers tend to recognize contracts based not on their entire code, but on the set of getters they expose to the off-chain world.

### Explicit resolution of method ID collisions

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

Sometimes, getters with different names end up with the same method ID. If this happens, you can either rename some of the getters or manually specify the method ID as a [compile-time](/ref/core-comptime) expression like so:

```tact
contract ManualMethodId() {
    const methodId: Int = 16384 + 42;

    get(self.methodId)
    fun methodId1(): Int {
        return self.methodId;
    }

    get(crc32("crc32") + 42 & 0x3ffff | 0x4000)
    fun methodId2(): Int {
        return crc32("crc32") + 42 & 0x3ffff | 0x4000;
    }
}
```

Unlike getters, method IDs for [internal functions](#fun-internal) and some special functions are obtained sequentially: integers in the inclusive range from -4 to 0 are given to [certain message handlers](https://docs.ton.org/v3/documentation/smart-contracts/func/docs/functions#special-function-names), while internal functions are numbered with method IDs starting at $1$ and going up to $2^{14} - 1$ inclusive.

Since method IDs are 19-bit signed integers and some of them are reserved, only the inclusive ranges from $-2^{18}$ to $-5$ and from $2^{14}$ to $2^{18} - 1$ are free to be used by users. It is recommended to specify method IDs only in these ranges to avoid collisions.

Furthermore, as the algorithm for generating method IDs only produces positive values and IDs -4 to 0 are reserved, by manually specifying negative IDs from $-2^{18}$ up to $-5$, you can guarantee that there would be no collisions with any other getters.

```tact
contract AntiPositive() {
    // This getter's manually specified method ID
    // will not collide with any autogenerated IDs
    get(-42) fun negAns(): Int {
        return -42;
    }

    get fun posAns(): Int {
        return 42;
    }
}
```

### Off-chain calls

You can call getter functions off-chain by using either a [proxy HTTP API](https://docs.ton.org/v3/guidelines/dapps/apis-sdks/ton-http-apis) or a [secure ADNL API](https://docs.ton.org/v3/guidelines/dapps/apis-sdks/ton-adnl-apis) for direct connections to TON nodes. For your convenience, there are many [SDKs for various general-purpose programming languages](https://docs.ton.org/v3/guidelines/dapps/apis-sdks/sdk). And to call getter functions locally, use the Tact-generated [contract wrapper class](/book/debug#wrappers-contract).

Notice that in those APIs and SDKs, getters are often referred to as _get methods_, as they are, in fact, callable methods of contracts that behave somewhat similarly to get methods in many object-oriented programming languages.

If the contract is already deployed to the testnet or the mainnet, some TON Blockchain explorers allow you to call get methods directly from their interface, providing their names and input stack arguments. As with other ways of calling getters, if you try to call a non-existent getter, an [exit code 11](/book/exit-codes#11) will be thrown: `"Unknown" error`.

## `init` — constructor function {#init}

<Badge text="Contract scope" variant="note" size="medium"/><p/>

The special constructor function `init(){:tact}` is run upon deployment of the contract. Unlike [contract parameters](/book/contracts#parameters), it performs a delayed initialization of the contract data, overriding the values of persistent state variables on-chain.

```tact
contract Example {
    // Persistent state variables
    var1: Int = 0; // initialized with default value 0
    var2: Int;     // must be initialized in the init() function
    var3: Int = 7; // initialized with default value 7

    // Constructor function, which is run only once
    init() {
        self.var2 = 42;
        self.var3 = 32; // overrides the default to 32
    }
}
```

For every receiver that doesn't alter the contract's variables, Tact optimizes away unnecessary storage overrides. However, contracts cannot benefit from such optimizations if the `init(){:tact}` function is present. That is because for contracts with `init(){:tact}` every receiver has to check whether the `init(){:tact}` function has run already and did that only once, and to do so, a special flag is implicitly stored in the contract's persistent state.

Effectively, the behavior or `init(){:tact}` function can be simulated when using contract parameters instead — through adding a special [`Bool{:tact}`](/book/types#booleans) field and a function that would be used in place of the `init(){:tact}`. That function would be called at the beginning of every receiver, while the boolean field would be used as a flag.

```tact
contract CounterBuiltinInit {
    // Persistent state variables
    counter: Int as uint32;

    // Constructor function, which is run only once
    init() {
        self.counter = 0;
    }

    receive() {
        cashback(sender());
    }

    receive(_: Increment) {
        self.counter += 1;
    }

    get fun counter(): Int {
        return self.counter;
    }
}

contract CounterDIYInit(
    // Persistent state variables
    initialized: Bool, // set this field to `false` during deployment
    counter: Int as uint32, // value of this field will be overridden in the `customInit()`
) {
    // Internal function, which will be used in place of a pseudo-constructor function
    fun customInit() {
        // Stop further actions if this customInit() function was called before
        if (self.initialized) {
            return;
        }
        // Initialize
        self.initialized = true;
        self.counter = 0;
    }

    receive() {
        // Don't forget to add this call at the start of every receiver
        // that can be used for deployments.
        self.customInit();
        cashback(sender());
    }

    receive(_: Increment) {
        // Don't forget to add this call at the start of every receiver
        // that can be used for deployments.
        self.customInit();
        self.counter += 1;
    }

    get fun counter(): Int {
        return self.counter;
    }

}

message Increment {}
```

None of the [attributes](#commonalities-attributes) can be specified for the `init(){:tact}` function.

Read more about the `init(){:tact}` on its dedicated section: [Constructor function `init(){:tact}`](/book/contracts#init-function).

## `native` — foreign function interfaces {#native}

<Badge text="Global scope" variant="note" size="medium"/><p/>

Native functions are Tact's [FFI](https://en.wikipedia.org/wiki/Foreign_function_interface) to FunC — they allow direct bindings to imported FunC functions. In order to declare them, you have to import a `.fc` or `.func` file first. Granted, the FunC's [standard library file, `stdlib.fc`](https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/std/stdlib.fc), is always imported for you.

Consider the following FunC file:

```func title="import_me.fc"
;; Notice the tensor return type (int, int),
;; which means we would have to define at least one
;; Tact structure to bind to this function.
(int, int) keccak512(slice s) impure asm "ONE HASHEXT_KECCAK512 UNPAIR";
```

In Tact code, one could access that function as follows:

```tact
// 1. Import the FunC file that contains the function.
import "./import_me.fc";

// 2. Declare the native function binding.
@name(keccak512) // name of the target FunC function
native keccak512(s: Slice): HashPair;
//     ^^^^^^^^^ name of the Tact function bind,
//               which can be the identical to its FunC counterpart

// 3. Define the necessary structs for the bind.
//    In our case, it is the HashPair structure to capture multiple return values.
struct HashPair {
    h1: Int;
    h2: Int;
}

// 4. Use the function whenever you would like.
//    It has the same properties as regular global functions.
fun example() {
    let res = keccak512(emptySlice());
    res.h1; // 663...lots of digits...092
    res.h2; // 868...lots of digits...990
}
```

The following attributes can be specified for `native{:tact}` functions:

* [`inline{:tact}`](#inline) — embeds the function contents at the call site.
* [`extends{:tact}`](#extends) — makes it an [extension function](#extends).
* [`mutates{:tact}`](#mutates), along with [`extends{:tact}`](#extends) — makes it an [extension mutation function](#mutates).

These attributes _cannot_ be specified:

* [`abstract{:tact}`](#abstract), [`virtual{:tact}`](#virtual) and [`override{:tact}`](#override) — native functions cannot be defined within a contract or a trait.
* [`get{:tact}`](#get) — native functions cannot be [getters](#get).

## `asm` — assembly functions {#asm}

<Badge text="Global scope" variant="note" size="medium"/>
<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

Assembly functions are top-level functions that allow you to write Tact assembly. Unlike all other functions, their bodies consist only of TVM instructions and some other primitives that serve as arguments to the instructions.

Furthermore, `asm{:tact}` functions are nearly devoid of all abstractions and give direct access to the underlying stack and register contents on which TVM operates.

```tact
// Simple assembly function that creates a new `Builder`.
asm fun beginCell(): Builder { NEWC }

// Like nativeReserve(), but also allows reserving extra currencies.
asm fun extraReserve(
    // Toncoin amount
    nativeAmount: Int,

    // A map of 32-bit extra currency IDs to VarUInt32 amounts
    extraAmountMap: map<Int as uint32, Int as varuint32>,

    // Reservation mode
    mode: Int,
) { RAWRESERVEX }

// Assembly function as an extension function for the `Builder` type.
asm(value self) extends fun storeBool(self: Builder, value: Bool): Builder { 1 STI }
```

Read more about them on their dedicated page: [Assembly functions](/book/assembly-functions).

## Inheritance

<Badge text="Contract scope" title="Functions can only be inherited from traits and never at the top level" variant="note" size="medium"/><p/>

The `with{:tact}` keyword allows a contract to inherit a [trait][trait] with all its constants, fields, and functions, including those transitively inherited from other traits associated with the specified trait.

In particular, all functions of the trait become accessible in the contract, regardless of any inheritance-related attributes, such as `abstract{:tact}`, `virtual{:tact}`, or `override{:tact}`.

You can allow a contract inheriting a [trait][trait] to modify a [internal function](#fun-internal) marked with the `virtual{:tact}` keyword by using `override{:tact}`. A function can also be marked as `abstract{:tact}`, in which case the inheriting contract must define its implementation.

```tact
trait FilterTrait with Ownable {
    // Virtual functions can be overridden by users of this trait
    virtual fun filterMessage(): Bool {
        return sender() != self.owner;
    }

    abstract fun specialFilter(): Bool;

    // Receivers can be inherited, but cannot be overridden
    receive() { cashback(sender()) }
}

contract Filter() with FilterTrait {
    // Overriding the default behavior of the FilterTrait
    override fun filterMessage(): Bool {
        return true;
    }

    override fun specialFilter(): Bool {
        return true;
    }
}
```

{/* TODO: inheritance table as per https://github.com/tact-lang/tact/issues/3030 */}

### `abstract` {#abstract}

<Badge text="Contract scope" title="This attribute can be applied to internal functions only" variant="note" size="medium"/><p/>

The `abstract{:tact}` attribute allows declaring a [internal function](#fun-internal) with no body given at declaration. Functions with this attribute are meant to be overridden later in the inheritance hierarchy by either an intermediate trait or the contract inheriting it.

```tact
trait DelayedOwnable {
    owner: Address;

    abstract fun requireOwner();

    abstract fun requireOwnerDelayed(bigBadName: Int);
}

contract Ownership(owner: Address) with DelayedOwnable {
    // All functions marked as abstract must be defined
    // in the contract that inherits them.
    override fun requireOwner() {
        throwUnless(TactExitCodeAccessDenied, sender() == self.owner);
    }

    // The signature of the overridden function must match its inherited abstract
    // counterpart on everything except parameter names. Notice the rename
    // of the `bigBadName` parameter to `timestamp` in the function below.
    override fun requireOwnerDelayed(timestamp: Int) {
        throwUnless(TactExitCodeAccessDenied, now() >= timestamp);
        throwUnless(TactExitCodeAccessDenied, sender() == self.owner);
    }
}
```

### `virtual` {#virtual}

<Badge text="Contract scope" title="This attribute can be applied to internal functions only" variant="note" size="medium"/><p/>

The `virtual{:tact}` attribute allows a [internal function](#fun-internal) to be overridden later in the inheritance hierarchy by either an intermediate trait or the contract inheriting it.

This attribute is similar to the [`abstract{:tact}`](#abstract) attribute, except that you do not have to override bodies of functions with the `virtual{:tact}` attribute. But if you decide to override the function body, you may do it in any trait that depends on this trait and not only in the resulting contract.

```tact
import "@stdlib/ownable";

trait DeployableFilterV1 with Ownable {
    // Virtual functions can be optionally overridden by users of this trait.
    virtual fun filter() {
        // Not an owner
        throwUnless(TactExitCodeAccessDenied, sender() == self.owner);
    }

    // Whereas internal functions with an abstract attribute must be overridden
    // by the contract that will import this trait or any of the traits that depend on this trait.
    abstract fun specialFilter();

    // Receivers are inherited too,
    // but they cannot defined be virtual or abstract
    receive() { cashback(sender()) }
}

trait DeployableFilterV2 with DeployableFilterV1 {
    override fun filter() {
        // Not an owner
        throwUnless(TactExitCodeAccessDenied, sender() == self.owner);

        // Message carries too little Toncoin for our tastes
        throwUnless(TactExitCodeAccessDenied, context().value < ton("1"));
    }
}

contract Auth(owner: Address) with DeployableFilterV2 {
    override fun specialFilter() {
        if (randomInt() < 10) {
            throw(TactExitCodeAccessDenied);
        }
    }

    receive(_: TopSecretRequest) {
        self.filter();
        self.specialFilter();

        // ...subsequent logic...
    }
}

message TopSecretRequest {}
```

### `override` {#override}

<Badge text="Contract scope" title="This attribute can be applied to internal functions only" variant="note" size="medium"/><p/>

The `override{:tact}` attribute is used to override an inherited [internal function](#fun-internal) that has either a [`virtual{:tact}`](#virtual) or [`abstract{:tact}`](#abstract) attribute specified in the declaration of that function in one of the parent traits.

## Commonalities

Functions commonly share the same aspects, parts, or behavior. For example, due to the nature of TVM, Tact uses the [call by value](https://en.wikipedia.org/wiki/Evaluation_strategy#Call_by_value) parameter-passing and binding strategy, which applies to all function kinds. That is, the evaluated value of any variable passed in a function call or assigned in the [`let{:tact}`](/book/statements#let) or [assignment](/book/statements#assignment) statement is copied.

Therefore, there are no modifications of the original values in different scopes, except for the [extension _mutation_ functions](#mutates). And even so, those functions do not mutate the original value denoted by the `self{:tact}` keyword — instead, they discard the old value and replace it with the new one obtained at the end of the function body.

The above applies to all functions except for [receivers](#receivers), because they cannot be called directly and are only executed upon receiving specific messages.

### Scope {#commonalities-scope}

All kinds of functions vary in scope: some can only be defined at the top level, such as [global functions](#fun-global), while others can only be defined within contracts and traits, such as [internal functions](#fun-internal) or [receivers](#receivers).

Functions are hoisted upon declaration, such that the ones declared earlier might call those declared later and vice versa.

```tact
// Global function first() is defined prior to the second() function,
// but we can call the second() one just fine.
fun first(): Bool {
    return second(true); // always true
}

// Global function second() is defined after the first() function,
// and call to the first() function works as expected.
fun second(flag: Bool): Bool {
    if (flag) {
        return true;
    }
    return first(); // always true, because of the prior condition
}
```

### Attributes {#commonalities-attributes}

Function attributes modify a function's behavior and typically restrict it to a specific scope.

Attribute                      | Scope    | Can be applied to
:----------------------------- | :------- | :----------------
[`extends{:tact}`](#extends)   | global   | All global functions
[`mutates{:tact}`](#mutates)   | global   | Functions with `extends{:tact}` attribute
[`virtual{:tact}`](#virtual)   | contract | Internal functions
[`abstract{:tact}`](#abstract) | contract | Internal functions
[`override{:tact}`](#override) | contract | Internal functions that were previously marked with `virtual{:tact}` or `abstract{:tact}`
[`inline{:tact}`](#inline)     | any      | All functions except for receivers and getters
[`get{:tact}`](#get)           | contract | Internal functions — turns them into getters

Notice that the "contract" scope also includes the [traits][trait].

### Naming and namespaces {#commonalities-naming}

Function names follow the standard Tact [identifier naming conventions](/book/expressions#identifiers).

```tact
abstract fun azAZ09_();
```

[Internal functions](#fun-internal) and [getters](#get) exist in a namespace separate from the contract's fields. For example, a persistent state variable named `value` can co-exist with a getter function named `value()`, which is very convenient in many cases.

However, identifiers of internal functions within a single contract must be distinct, as are identifiers of all top-level functions. The only exceptions are [extensions](#extensions), which can have the same identifiers, provided that the extended types of their `self` parameter differ.

```tact
// COMPILATION ERROR! Static function "globName" already exists
fun globName() {}
fun globName() {}
//  ~~~~~~~~~~~~~

// No errors, because despite the same identifiers,
// the types of the `self` parameter are different
extends fun doWith(self: Int) {}
extends fun doWith(self: Slice) {}
```

### Return values {#commonalities-return}

All functions return a value. If the function does not have an explicit return type specified, it has an implicit return type of `void` — a pseudo-value that represents "nothing" in the Tact compiler. This also applies to the functions that do not allow specifying a return type, such as [receivers](#receivers) or [`init(){:tact}`](#init).

Moreover, execution of any function can be ended prematurely with the [`return{:tact}` statement](/book/statements#return). This is also true for receiver functions and `init(){:tact}` function, where empty `return{:tact}` statements are allowed.

```tact
contract GreedyCashier(owner: Address) {
    receive() {
        // Stop the execution if the message is not from an `owner`.
        if (sender() != self.owner) {
            return;
        }
        // Otherwise, forward excesses back to the sender.
        cashback(sender());
    }
}
```

To return multiple values in a function, aggregate the values in a [struct][struct].

```tact
fun minmax(a: Int, b: Int): MinMax {
    if (a < b) {
        return MinMax { min: a, max: b };
    }
    return MinMax { min: b, max: a };
}

struct MinMax {
    min: Int;
    max: Int;
}
```

[Reachability](/book/statements#return) of `return{:tact}` statements should always be evident to the compiler. Otherwise, a compilation error will occur.

### Recursion {#commonalities-recursion}

Recursive functions are allowed, including the mutually recursive functions. There is no upper limit on the recursion depth or the number of calls — computations will continue until there is no more gas to spend.

```tact
fun produceOneFrom(a: Int): Int {
    if (a <= 1) { return 1 }
    return alsoProduceOneFrom(a - 1);
}

fun alsoProduceOneFrom(b: Int): Int {
    if (b <= 1) { return 1 }
    return produceOneFrom(b - 1);
}

fun example(someA: Int, someB: Int) {
    // This sum will always be 2, regardless of values of `someA` and `someB`.
    // The only exception is when their values are too big and there is not
    // enough gas to finish the computations, in which case the transaction
    // will fail with an exit code -14: Out of gas error.
    produceOneFrom(someA) + alsoProduceOneFrom(someB); // 2
}
```

### Code embedding with `inline` {#inline}

<Badge text="Any scope" title="This attribute can be applied to functions within contracts and functions at the top level" variant="note" size="medium"/><p/>

The `inline{:tact}` attribute embeds the code of the function to its call sites, which eliminates the overhead of the calls but potentially increases the code size if the function is called from multiple places.

This attribute can improve performance of large infrequently called functions or small, alias-like functions. It can be combined with any other attribute except for [`get{:tact}`](#get).

```tact
inline fun add(a: Int, b: Int) {
    // The following addition will be performed in-place,
    // at all the `add()` call sites.
    return a + b;
}
```

### Trailing comma {#commonalities-comma}

All functions, except for [receiver functions](#receivers), can have a trailing comma in their definitions (parameter lists) and calls (argument lists):

```tact
fun foo(
    a: Int, // trailing comma in parameter lists is allowed
) {}

fun bar() {
    foo(
        5, // trailing comma in argument lists is allowed too!
    );
}
```

### Trailing semicolon {#commonalities-colon}

The last [statement](/book/statements) inside the function body has a trailing semicolon — it can be freely omitted, which is useful for writing one-liners.

```tact
inline fun getCoinsStringOf(val: Int) { return val.toFloatString(9) }
```

When declaring an [internal function](#fun-internal) with [`abstract{:tact}`](#abstract) or [`virtual{:tact}`](#virtual) attributes, Tact allows you to omit a semicolon if it is the last function in the [trait's][trait] body.

```tact
trait CompositionVII {
    abstract fun paintedWithOil(preliminary: Bool): Bool // no semicolon needed
}

contract Abstractionism() with CompositionVII {
    override fun paintedWithOil(preliminary: Bool): Bool {
        if (preliminary) {
            return false; // perhaps, watercolors were used...
        }
        return true;
    }
}
```

### Wildcard parameters {#commonalities-wildcard}

<Badge text="Available since Tact 1.6.1" variant="tip" size="medium"/><p/>

For all kinds of functions, naming a parameter with an underscore `_{:tact}` causes its value to be considered unused and discarded. This is useful when you do not access the parameter but want to include it in the signature for possible overrides. Note that such a wildcard parameter name `_{:tact}` cannot be accessed.

```tact
trait WildThing {
    // Using wildcards for parameter names
    virtual fun assure(_: Int, _: Int): Bool {
        return true;
    }
}

contract YouMakeMyHeartSing() with WildThing {
    // And then overriding them with concrete names
    override fun assure(a: Int, b: Int): Bool {
        return a + b == b + a;
    }

    // Wildcards are also useful when you do not intend to
    // use the contents of the message and only handle the proper one
    receive(_: FieldsDoNotLie) {
        // ...
    }
}

message FieldsDoNotLie {}
```

## Low-level representation

On [TVM][tvm] level, contracts and their functions are often represented as a dictionary (or ["hashmap"](/book/maps#low-level-representation)) of methods, from their numeric method IDs to their respective bodies composed of TVM instructions. Each function then is a method that transforms the stack and TVM registers.

A function call is, essentially, a call into the dictionary using the function's ID, after which:
1. Function arguments are pushed onto the stack
2. The function executes, manipulating the stack
3. Return values are left on top of the stack, provoking another dictionary call or resulting in the end of the transaction

When a so-called ["selector hack"](/book/config#optimizations-internalexternalreceiversoutsidemethodsmap) optimization is enabled, if the number of defined receivers is small, they are stored outside of that map as plain instruction sequences. That saves gas but can cause the contract to be incorrectly recognized and misparsed by some explorers and user wallets, which expect the root of the contract's code (the root cell) to point at the method dictionary.

[p]: /book/types#primitive-types
[struct]: /book/structs-and-messages#structs
[cell]: /book/cells#cells
[builder]: /book/cells#builders
[slice]: /book/cells#slices
[trait]: /book/types#traits

[tvm]: https://docs.ton.org/learn/tvm-instructions/tvm-overview



================================================
FILE: docs/src/content/docs/book/gas-best-practices.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/book/gas-best-practices.mdx
================================================
---
title: Gas best practices
description: "Anti-patterns, suboptimal approaches that increase gas usage, and best practices of cheap runtime execution that Tact smart contract developers should be aware of."
---

import { Badge } from '@astrojs/starlight/components';

There are several anti-patterns that unnecessarily increase gas usage or are suboptimal in most cases. Below, we discuss various trade-offs when writing gas-efficient and safe Tact smart contracts.

Suggestions are given in no particular order as a simple and quick checklist to see how your contract is doing regarding gas usage. You don't have to check all the points, but try to follow as many as possible without neglecting the [security best practices](/book/security-best-practices).

:::note

  Tact compiler is continuously evolving, so some points below may become outdated and removed or replaced. Please check this page periodically for updates.

:::

## General considerations

### Prefer contract parameters to `init()` and contract fields

If you require some on-chain deployment logic that runs just once after the contract's deployment is completed, then use the lazy initialization strategy provided by the [`init(){:tact}` function](/book/contracts#init-function). It uses an extra bit in the contract's persistent state, runs extra checks upon receiving any message, and disables storage write optimizations of Tact compiler.

However, most contracts do not require lazy initialization and define their initial data only when the contract is first deployed, with everything for it prepared off-chain. Therefore, prefer using [contract parameters syntax](/book/contracts#parameters) to define the data of the contract's persistent storage that way.

```tact
contract ContractParams(
    // Persistent state variables declared via the contract parameters syntax
    val1: Int as uint64, // `as`-annotations are supported
    val2: String,
) {
    // For deployments
    receive() { cashback(sender()) }
}
```

```ts
// TypeScript wrappers generated by Tact compiler
import { ContractParams } from '../wrappers/ContractParams';

// Various utility libraries
import { NetworkProvider } from '@ton/blueprint';
import { toNano } from '@ton/core';

// Default deployment function / script of the Blueprint
export async function run(provider: NetworkProvider) {
  const contract = provider.open(await ContractParams.fromInit(
    42,                  // `val1` in the contract
    "The time has come", // `val2` in the contract
  ));
  await playground.send(
    provider.sender(),
    { value: toNano('0.05') },
    null, // because there's a `null` message body
          // `receive()` function in the contract
  );
  await provider.waitForDeploy(playground.address);
}
```

### Do not deploy contracts with `Deployable` trait

The `Deployable{:tact}` trait is now deprecated and should only be used if you require the `queryId`, which serves as a unique identifier for tracing transactions across multiple contracts.

Instead of inheriting the `Deployable{:tact}` trait, prefer having a simple receiver for the empty message body and deploying your contracts with it.

```tact
contract Friendly {
    // This is when you DO want to send excesses back
    receive() { cashback(sender()) } // expects a `null` body
}

contract Scrooge {
    // This is when you don't want to send excesses back
    receive() {} // expects a `null` body
}
```

### Use `BasechainAddress` struct and related functions for runtime manipulations on addresses in the base workchain

<Badge text="Available since Tact 1.6.3" variant="tip" size="medium"/><p/>

Almost all contracts on TON are deployed on the basechain — a [workchain with ID 0][workchain-id]. The [`BasechainAddress{:tact}`](/ref/core-addresses#basechainaddress) [struct][struct] and related functions were introduced to allow optimal handling of basechain addresses at runtime.

A frequent use-case for basechain addresses is checking message sender addresses for validity, i.e., if a contract needs to make sure the incoming message comes from a specific contract deployed in the basechain, it can use the [`StateInit.hasSameBasechainAddress(){:tact}`](/ref/core-addresses#stateinithassamebasechainaddress) extension function.

```tact
contract Child(parentAddr: Address) {
    receive() {
        // Forward surplus to the parent address
        cashback(self.parentAddr);
    }
}

contract Parent() {
    receive() {
        // Ensure that the message came from the child contract
        let childContract = initOf Child(myAddress());
        require(
            childContract.hasSameBasechainAddress(sender()),
            "Message must come from the Child contract",
        );

        // ...subsequent logic...
    }
}
```

To ensure that a certain [`Address{:tact}`][p] is in the basechain and can be represented by the `BasechainAddress{:tact}`, you can use the [`forceBasechain(){:tact}`](/ref/core-addresses#forcebasechain) function first.

See other functions related to the `BasechainAddress{:tact}` struct:

* [`emptyBasechainAddress(){:tact}`](/ref/core-addresses#emptybasechainaddress)
* [`newBasechainAddress(){:tact}`](/ref/core-addresses#newbasechainaddress)
* [`contractBasechainAddress(){:tact}`](/ref/core-addresses#contractbasechainaddress)

### Pay attention to "500+ gas" badge

Some functions in the Tact documentation are annotated with a special badge, "500+ gas", which marks the functions that use 500 gas units or more. It is placed right under the function name heading and looks like this: <Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/>

If you use one of those functions, consider finding cheaper alternatives.

### Inline functions that are rarely called

Some [kinds of functions](/book/functions) allow their code to be inlined by adding an `inline` annotation. If the function is used often, this might result in a significant increase in contract code size, but generally, it allows to save gas on redundant function calls.

Furthermore, you might reach for the [experimental `inline` field](/book/config#experimental-inline) in `tact.config.json`, which enables the inlining of all functions that can be inlined.

This advice needs benchmarks to decide its usefulness on a case-by-case basis.

### Prefer manipulating strings off-chain

Strings on-chain are represented as [slices][slice], which are expensive for handling Unicode strings and quite costly even for ASCII ones. Prefer not to manipulate strings on-chain.

### Prefer arithmetic to branching operators

On average, branching uses many more instructions than equivalent arithmetic. Common examples of branching are the [`if...else{:tact}`](/book/statements#if-else) statement and the ternary operator [`?:{:tact}`](/book/operators#ternary).

Use arithmetic and standard library functions over branching or complex control flow whenever possible.

```tact
// If the forwardAmount is non-negative, this
msg.forwardAmount > 0 ? 2 : 1;

// is more expensive than doing this
1 + sign(msg.forwardAmount);
```

### Prefer specialized math functions to general ones

Specialized math functions are cheaper than general ones as they require fewer stack manipulations and often use more efficient [TVM instructions][tvm-instruction].

If you only need to obtain logarithms to the base 2, use the [`log2(){:tact}`](/ref/core-math#log2) function over the general [`log(){:tact}`](/ref/core-math#log) function.

If you only need to obtain powers of 2, use the [`pow2(){:tact}`](/ref/core-math#pow2) function over the general [`pow(){:tact}`](/ref/core-math#pow) function.

```tact
let num = 42;

// Use this instead of log(num, 2)
log2(num);

// Use this instead of pow(num, 2)
pow2(num);
```

### Asm functions

Many commonly used [TVM instructions][tvm-instruction] expect the same values but in a different order on the stack. Often, the code you write will result in instructions defined by your logic intermittent with stack-manipulation instructions, such as `SWAP` or [`ROT`](https://docs.ton.org/v3/documentation/tvm/instructions#58), which would've been unnecessary if the positioning of values on the stack was better planned before.

On the other hand, if you know the layout and boundaries of your data, the generic choice of underlying instructions might be suboptimal in terms of gas usage or code size.

In both cases, you can use assembly functions (or `asm` functions for short) to manually describe the logic by writing a series of [TVM instructions][tvm-instruction]. If you know what you're doing, `asm` functions can offer you the smallest possible gas usage and the most control over [TVM][tvm] execution.

Read more about them on their dedicated page: [Assembly functions](/book/assembly-functions).

### Disable run-time `safety` checks for well-tested contracts

:::caution

  Proceed only if you have a comprehensive contract test suite and are about to apply various other security measures, such as audits. The following is not guidance but is an illustration of what can be done to maximize gas efficiency when you are sure of the safety of your contracts.

:::

When using the unwrapping [non-null assertion `!!`](/book/operators/#unary-non-null-assert) operator, you can decrease its gas consumption at the expense of its runtime `null{:tact}` checks. Thus, you should only disable such checks when you are sure there will not be a runtime `null{:tact}` present in the given branch of your code.

```tact
fun example() {
    let val: Int? = 42;
    if (val == null) {
        return;
    }
    // At this point we know that `val` is not null,
    // so we can safely disable runtime checks of the !! operator in the config
    val!!; // 42
}
```

To disable runtime `null{:tact}` checks of the `!!` operator, set the [`nullChecks`](/book/config#safety-nullchecks) field to `false{:json}` in your [`tact.config.json`](/book/config).

```json title="tact.config.json" {9}
{
  "projects": [
    {
      "name": "contract",
      "path": "./your-contract-file.tact",
      "output": "./output",
      "options": {
        "safety": {
          "nullChecks": false
        }
      }
    }
  ]
}
```

## Receiving messages

### Prefer binary receivers to text receivers

Tact automatically handles various message body types, including binary and string (text) ones. Both message bodies start with a 32-bit integer header (or tag) called an [opcode](/book/structs-and-messages#message-opcodes), which helps distinguish their following contents.

To prevent conflicts with binary message bodies which are usually sent on the blockchain, the string (text) receivers skip the opcode and instead route based on the hash of the message body contents — an expensive operation that requires more than 500 units of gas.

While text receivers are convenient during development in testing, when preparing your contract for production you should replace all text receivers with binary ones and create relevant [message structs][message] even if they'll be empty and only their opcodes will be used.

```tact
message(1) One {}
message(2) Two {}

contract Example() {
    // Prefer this
    receive(_: One) {
        // ...
    }
    receive(_: Two) {
        // ...
    }

    // Over this
    receive("one") {
        // ...
    }
    receive("two") {
        // ...
    }
}
```

### Prefer `inMsg()` to `Message.toSlice()`

<Badge text="Available since Tact 1.6.7" variant="tip" size="medium"/><p/>

When working with an incoming message, prefer using the [`inMsg(){:tact}`](/ref/core-contextstate#inmsg) function over the [`Message.toSlice(){:tact}`](/ref/core-cells#messagetoslice) extension function, because the `inMsg(){:tact}` function provides direct access to the incoming message body [`Slice{:tact}`][p], while `msg.toSlice(){:tact}` performs redundant operations to recreate that `Slice{:tact}`.

```tact
contract Example() {
    receive(msg: SomeMessage) {
        // Prefer this
        let body = inMsg();

        // over this
        let sameBody = msg.toSlice();
    }
}
```

### Avoid internal contract functions

The [internal functions](/book/contracts#internal-functions) of a contract (often called contract methods) are similar to global functions, except that they can access the contract's [storage variables](/book/contracts#variables) and [constants](/book/contracts#constants).

However, they push the contract's variables on the stack at the start of their execution and pop them off afterward. This creates lots of unnecessary stack-manipulation instructions and consumes gas.

If your contract method does not access any of its persistent state variables, move it outside the contract and make it a global, module-level function instead.

### Use `sender()` over `context().sender`

When you receive an internal message, you can obtain the address of the contract that has sent it. This can be done by calling the [`sender()`](/ref/core-contextstate#sender) function or by accessing the `.sender` field of the `Context{:tact}` [struct][struct] after calling the [`context()`](/ref/core-contextstate#context) function.

If you only need the sender's address and no additional context on the incoming message that is contained in the `Context{:tact}` struct, then use the [`sender()`](/ref/core-contextstate#sender) function as it is less gas-consuming.

```tact /sender\\(\\)/
message(MessageParameters {
    to: sender(),
    value: ton("0.05"),
});
```

### Use `throwUnless()` over `require()`

The [`require(){:tact}`](/ref/core-debug#require) function is convenient for stating assumptions in code, especially in debug environments. Granted, currently, it generates [exit codes](/book/exit-codes) greater than $2^{11}$, making it a bit expensive compared to alternatives.

If you're ready for production and are willing to sacrifice some convenience for gas, use [`throwUnless(){:tact}`](/ref/core-debug#throwunless) function, keep track of your exit codes by declaring them as [constants](/book/constants), and keep exit codes within the inclusive range of $256-2^{11}$. It's essential to respect the latter range because the exit code values from 0 to 255 are reserved by [TVM][tvm] and the Tact compiler.

```tact
const SOMETHING_BAD_1: Int = 700;
const SOMETHING_BAD_2: Int = 701; // it is convenient to increment by 1

fun example() {
    throwUnless(SOMETHING_BAD_1, now() > 1000);
    throwUnless(SOMETHING_BAD_2, now() > 1000000);
}
```

### Use `SignedBundle` to verify signatures in external message receivers

When handling [external messages](/book/external), the [`SignedBundle{:tact}`](/ref/core-crypto#signedbundle) [struct][struct] provides a gas-efficient way to verify message signatures. This approach is particularly useful for wallet contracts and other contracts that need secure user authorization.

The `SignedBundle{:tact}` contains both the signature and the non-serialized data of the enclosing struct or message struct that is being signed, allowing for convenient verification with the [`SignedBundle.verifySignature(){:tact}`](/ref/core-crypto#signedbundleverifysignature) extension function.

```tact
contract Wallet(publicKey: Int as uint256) {
    external(msg: SomeWalletOperation) {
        // Verifying the signature before accepting the message
        require(msg.bundle.verifySignature(self.publicKey), "Invalid signature");

        // Now it's safe to accept it
        acceptMessage();

        // ...and proceed further...
    }
}

message SomeWalletOperation {
    // You must set the SignedBundle as the first field
    bundle: SignedBundle;

    // Some data to be signed
    walletId: Int as int32;
    seqno: Int as uint32;
}
```

## Sending messages

### Prefer `message()` and `cashback()` to `self.forward()`, `self.reply()`, and `self.notify()`

Every [contract](/book/contracts) in Tact implicitly [inherits](/book/contracts#traits) the `BaseTrait{:tact}` trait, which contains a number of [internal functions](/book/contracts#internal-functions) for any contract. Those internal functions are gas-expensive for the same reasons as stated earlier.

Calls to `self.forward(){:tact}`, `self.reply(){:tact}` and `self.notify(){:tact}` can be replaced with respective calls to the [`send(){:tact}`](/ref/core-send#send) or [`message(){:tact}`](/ref/core-send#message) functions with suitable values.

Moreover, if all you want is to forward the remaining value back to the sender, it is best to use the [`cashback(){:tact}`](/ref/core-send#cashback) function instead of `self.notify(){:tact}` function.

```tact
// This
self.forward(sender(), null, false, initOf SomeContract());

// could be replaced with this
let initState = initOf SomeContract();
send(SendParameters {
    to: sender(),
    mode: SendRemainingValue | SendIgnoreErrors,
    bounce: false,
    value: 0,
    code: initState.code,
    data: initState.data,
    body: null,
})

// This
self.reply(null);

// should be replaced with this
message(MessageParameters {
    body: null,
    to: sender(),
    mode: SendRemainingValue | SendIgnoreErrors,
    bounce: true,
    value: 0,
});

// And this
self.notify(null);

// should be replaced with this
cashback(sender());
```

### Use `deploy()` function for on-chain deployments

There are many [message-sending functions](/book/send#message-sending-functions), and the [`deploy(){:tact}`](/ref/core-send#deploy) function is optimized for cheaper on-chain deployments compared to the [`send(){:tact}`](/ref/core-send#send) function.

```tact
deploy(DeployParameters {
    init: initOf SomeContract(), // with initial code and data of SomeContract
                                 // and with an empty message body
    mode: SendIgnoreErrors,      // skip the message in case of errors
    value: ton("1"),             // send 1 Toncoin (1_000_000_000 nanoToncoin)
});
```

### Use `message()` function for non-deployment messages

There are many [message-sending functions](/book/send#message-sending-functions), and the [`message(){:tact}`](/ref/core-send#message) function is optimized for cheaper non-deployment regular messages compared to the [`send(){:tact}`](/ref/core-send#send) function.

```tact
message(MessageParameters {
    to: addrOfSomeInitializedContract,
    value: ton("1"), // sending 1 Toncoin (1_000_000_000 nanoToncoin),
                     // with an empty message body
});
```

## Applied examples of best gas practices

Tact has a growing set of contracts benchmarked against their reference FunC implementations. We fine-tune each Tact contract following the gas-preserving approaches discussed on this page while staying true to the original code and without doing precompilation or excessive ASM usage.

See those examples with recommendations applied:

- [Jetton Wallet contract](https://github.com/tact-lang/jetton/blob/9db75a5a828e9093be5c425605c5f5c9903f505d/src/contracts/jetton-wallet.tact)
- [Jetton Minter contract](https://github.com/tact-lang/jetton/blob/9db75a5a828e9093be5c425605c5f5c9903f505d/src/contracts/jetton-minter.tact)
- [Escrow contract](https://github.com/tact-lang/tact/blob/73fb52b2c8b4e8b2309e0aae4dcc0f8cb35117ea/src/benchmarks/contracts/escrow.tact)

[p]: /book/types#primitive-types
[slice]: /book/cells#slices
[struct]: /book/structs-and-messages#structs
[message]: /book/structs-and-messages#messages

[tvm]: https://docs.ton.org/learn/tvm-instructions/tvm-overview
[tvm-instruction]: https://docs.ton.org/v3/documentation/tvm/instructions
[workchain-id]: https://docs.ton.org/learn/overviews/addresses#workchain-id
[account-id]: https://docs.ton.org/learn/overviews/addresses#account-id



================================================
FILE: docs/src/content/docs/book/import.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/book/import.mdx
================================================
---
title: Importing code
description: "Tact allows you to import Tact and FunC code and has a versatile set of standard libraries."
---

Tact allows you to import Tact and [FunC](https://docs.ton.org/develop/func/overview) code. Any given `.tact` or `.fc`/`.func` file can be imported into your project using the `import{:tact}` keyword.

Additionally, the Tact compiler has a versatile set of standard libraries which come bundled in but are not included right away. See [Standard libraries overview](/ref/standard-libraries).

:::caution

  All imported code is combined together with yours, so it's important to avoid name collisions and always double-check the sources!

  Moreover, imports are transitive and are always automatically exported — if an `a.tact` imports `b.tact`, which in turn imports `c.tact`, then all the definitions from `c.tact` are immediately accessible in `a.tact` without an explicit import of `c.tact` to it.

  ```tact title="c.tact"
  trait StatelessGetters {
      get fun bar(): Int { return 42 }
      get fun baz(): Int { return 43 }
  }
  ```

  ```tact title="b.tact"
  import "c.tact";
  ```

  ```tact title="a.tact"
  import "b.tact";

  // Definitions available in "c.tact" are now available in this file
  // due to their transitive import from the "b.tact" file.
  contract Transitive() with StatelessGetters {}
  ```

  This behavior may change in future major releases.

:::

## Import Tact code

It's possible to import any Tact code using the `import{:tact}` statement by providing a relative path to the target `.tact` file like so:

```tact
import "./relative/path/to/the/target/tact/file.tact";
```

Specifying parent directories (`../`) is also possible:

```tact
import "../subfolder/imported/file.tact";
```

## Import FunC code

It's possible to import code written in FunC directly, just as it's done with Tact code imports:

```tact
// Relative import
import "./relative/path/to/the/target/func/file.fc";

// Specifying parent directories
import "../subfolder/imported/func/file.fc";
```

However, in order to use functions from such files, one has to declare them as [`native{:tact}` functions](/book/functions#native) first. For example, when the standard library [`@stdlib/dns`](/ref/stdlib-dns) uses a `dns.fc` FunC file, it maps FunC functions to Tact ones like so:

```tact
// FunC code located in a file right next to the current Tact one:
import "./dns.fc";

// Mapping function signatures from FunC to Tact:
@name(dns_string_to_internal)
native dnsStringToInternal(str: String): Slice?;
```

## Standard libraries

See [Standard libraries overview](/ref/standard-libraries).



================================================
FILE: docs/src/content/docs/book/index.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/book/index.mdx
================================================
---
title: Book overview
description: "Book section — an introductory book about the Tact language"
---

import { LinkCard, CardGrid, Steps } from '@astrojs/starlight/components';

Welcome to **The Tact Book** section (or simply **The Book**) — an introductory book about the Tact language. It is a cohesive and streamlined sequence of educational materials about Tact. Whenever there's an existing explanation of a broader TON concept in the main TON documentation, this Book tries to reference it as well.

In general, it assumes that you are reading it in sequence from front to back. Later parts build on concepts presented in earlier parts, and earlier parts might not delve into details of a particular topic but will revisit the topic in a later part.

The Book also assumes that you have written code in another programming language but does not make any assumptions about which one. We have tried to make the material broadly accessible to those from a wide variety of programming backgrounds. We do not spend a lot of time talking about what programming _is_ or how to think about it. If you are entirely new to programming, you would be better served by reading a [book that specifically provides an introduction to programming](https://johnwhitington.net/ocamlfromtheverybeginning/index.html).

Here are its main contents:

<Steps>

1. #### Quick start

   The Book begins with a few scenic tours and cheat sheets to get you started immediately. First, it briefly discusses TON Blockchain and how smart contracts work there, then gives an overview of many syntax and semantical aspects of the Tact language.

   <CardGrid>
     <LinkCard
       title="Learn Tact in Y minutes"
       href="/book/learn-tact-in-y-minutes"
     />
   </CardGrid>

2. #### Fundamentals of Tact

   The subsection [Fundamentals of Tact](/book/types) describes the type system: primitive and composite types, then the structure of each Tact contract, and lists all the defined exit codes, i.e., possible error points.

   <CardGrid>
     <LinkCard
       title="Type system overview"
       href="/book/types"
     />
   </CardGrid>

3. #### Expressiveness

   The [Expressiveness](/book/operators) subsection starts with the list of available operators and gradually builds up, eventually reaching the description of functions and their interactions. Finally, it descends to discuss functions closest to how the TON Virtual Machine (TVM) actually operates — assembly functions.

   <CardGrid>
     <LinkCard
       title="Operators"
       href="/book/operators"
     />
   </CardGrid>

4. #### Communication

   TON is a distributed blockchain based on the idea of the [actor model](https://en.wikipedia.org/wiki/Actor_model). Therefore, the means of communication is one of the most important aspects.

   The [Communication](/book/receive) subsection covers everything you want and need to know about sending and receiving messages, as well as the general transaction flow.

   <CardGrid>
     <LinkCard
       title="Receive messages"
       href="/book/receive"
     />
   </CardGrid>

5. #### Going places

   Finally, to put all our Tact and TON knowledge into action, it is necessary to have auxiliary tools and concise descriptions of their use.

   The subsection [Going places](/book/compile) explains how to compile, debug, and test Tact contracts locally. From there, it moves on to provide descriptions of deploying contracts to the TON Blockchain.

   Lastly, it shows how to further tweak the compiler with its configuration options, interface with existing FunC code, and discusses best practices for securing your smart contracts.

   <CardGrid>
     <LinkCard
       title="Compilation"
       href="/book/compile"
     />
   </CardGrid>

</Steps>



================================================
FILE: docs/src/content/docs/book/integers.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/book/integers.mdx
================================================
---
title: Integers
description: "Arithmetic in smart contracts on TON is always done with integers and never with floats"
---

import { Badge } from '@astrojs/starlight/components';

Arithmetic in smart contracts on TON is always performed with integers and never with floating-point numbers, since floats are [unpredictable](https://learn.microsoft.com/en-us/cpp/build/why-floating-point-numbers-may-lose-precision). Therefore, a strong emphasis is placed on integers and their handling.

The only primitive number type in Tact is `Int{:tact}`, for $257$-bit signed integers.\
It's capable of storing integers between $-2^{256}$ and $2^{256} - 1.$

## Notation

Tact supports various ways of writing primitive values of `Int{:tact}` as [integer literals](/book/expressions#integer-literals).

Most of the notations allow adding underscores (`_`) between digits, except for:
* Representations in strings, as seen in the [nano-tons](#nanotoncoin) case.
* Decimal numbers written with a leading zero $0.$ Their use is generally discouraged; see [below](#decimal).

Additionally, consecutive underscores, as in $4\_\_2$, or trailing underscores, as in $42\_$, are **not** allowed.

### Decimal

The most common and widely used way of representing numbers is using the [decimal numeral system](https://en.wikipedia.org/wiki/Decimal): $123456789.$\
You can use underscores (`_`) to improve readability: $123\_456\_789$ is equal to $123456789.$

:::caution
  Alternatively, you can prefix the number with one $0$, which prohibits the use of underscores and only allows decimal digits: $0123 = 123.$
  Note that using this notation with a leading zero is **strongly discouraged** due to possible confusion with octal integer literals in TypeScript, which is often used alongside Tact to develop and test contracts.
:::

### Hexadecimal

Represent numbers using the [hexadecimal numeral system](https://en.wikipedia.org/wiki/Hexadecimal), denoted by the $\mathrm{0x}$ (or $\mathrm{0X}$) prefix: $\mathrm{0xFFFFFFFFF}$.
Use underscores (`_`) to improve readability: $\mathrm{0xFFF\_FFF\_FFF}$ is equal to $\mathrm{0xFFFFFFFFF}$.

### Octal

Represent numbers using the [octal numeral system](https://en.wikipedia.org/wiki/Octal), denoted by the $\mathrm{0o}$ (or $\mathrm{0O}$) prefix: $\mathrm{0o777777777}$.
Use underscores (`_`) to improve readability: $\mathrm{0o777\_777\_777}$ is equal to $\mathrm{0o777777777}$.

### Binary

Represent numbers using the [binary numeral system](https://en.wikipedia.org/wiki/Binary_number), denoted by the $\mathrm{0b}$ (or $\mathrm{0B}$) prefix: $\mathrm{0b111111111}$.
Use underscores (`_`) to improve readability: $\mathrm{0b111\_111\_111}$ is equal to $\mathrm{0b111111111}$.

### NanoToncoin

Arithmetic with dollars requires two decimal places after the dot — these are used for the cents value. But how would we represent the number \$$1.25$ if we are only able to work with integers? The solution is to work with _cents_ directly. In this way, \$$1.25$ becomes $125$ cents. We simply remember that the two rightmost digits represent the numbers after the decimal point.

Similarly, working with Toncoin, the main currency of TON Blockchain, requires nine decimal places instead of two. One can say that nanoToncoin is one-billionth ($\frac{1}{10^{9}}$) of a Toncoin.

Therefore, the amount of $1.25$ Toncoin, which can be represented in Tact as [`ton("1.25"){:tact}`](/ref/core-comptime#ton), is actually the number $1250000000$. We refer to such numbers as _nanoToncoin(s)_ (or _nano-ton(s)_) rather than _cents_.

## Serialization

When encoding `Int{:tact}` values to persistent state (fields or parameters of [contracts](/book/contracts) and fields of [traits](/book/types#traits)), it is usually better to use smaller representations than 257 bits to reduce [storage costs](https://docs.ton.org/develop/smart-contracts/fees#storage-fee). The use of such representations is also called "serialization" because they represent the native [TL-B][tlb] types on which TON Blockchain operates.

The persistent state size is specified in every declaration of a state variable after the `as{:tact}` keyword:

```tact
contract SerializationExample {
    // persistent state variables
    oneByte: Int as int8 = 0; // ranges from -128 to 127 (takes 8 bits = 1 byte)
    twoBytes: Int as int16;   // ranges from -32,768 to 32,767 (takes 16 bits = 2 bytes)

    init() {
        // needs to be initialized in the init() because it does not have a default value
        self.twoBytes = 55*55;
    }
}
```

Integer serialization is also available for the fields of [structs](/book/structs-and-messages#structs) and [Messages](/book/structs-and-messages#messages), as well as in the key/value types of [maps](/book/maps):

```tact
struct StSerialization {
    martin: Int as int8;
}

message MsgSerialization {
    seamus: Int as int8;
    mcFly: map<Int as int8, Int as int8>;
}
```

The motivation is very simple:
* Storing 1000 257-bit integers in the state [costs](https://docs.ton.org/develop/smart-contracts/fees#how-to-calculate-fees) about 0.184 TON per year.
* Storing 1000 32-bit integers only costs 0.023 TON per year by comparison.

:::note

  Serialization limits apply only to the contract state between transactions and are **not** imposed on the temporary [TVM][tvm] memory, which operates only on 257-bit integers.

  Attempts to assign out-of-bounds values will result in [exit code 5](/book/exit-codes#5) being thrown at the very end of the [compute phase](https://docs.ton.org/learn/tvm-instructions/tvm-overview#compute-phase): `Integer out of expected range`.

:::

### Common serialization types

Name             | [TL-B][tlb]                 | Inclusive range             | Space taken
:--------------: | :-------------------------: | :-------------------------: | :------------------------:
`uint8{:tact}`   | [`uint8`][tlb-builtin]      | $0$ to $2^{8} - 1$          | $8$ bits = $1$ byte
`uint16{:tact}`  | [`uint16`][tlb-builtin]     | $0$ to $2^{16} - 1$         | $16$ bits = $2$ bytes
`uint32{:tact}`  | [`uint32`][tlb-builtin]     | $0$ to $2^{32} - 1$         | $32$ bits = $4$ bytes
`uint64{:tact}`  | [`uint64`][tlb-builtin]     | $0$ to $2^{64} - 1$         | $64$ bits = $8$ bytes
`uint128{:tact}` | [`uint128`][tlb-builtin]    | $0$ to $2^{128} - 1$        | $128$ bits = $16$ bytes
`uint256{:tact}` | [`uint256`][tlb-builtin]    | $0$ to $2^{256} - 1$        | $256$ bits = $32$ bytes
`int8{:tact}`    | [`int8`][tlb-builtin]       | $-2^{7}$ to $2^{7} - 1$     | $8$ bits = $1$ byte
`int16{:tact}`   | [`int16`][tlb-builtin]      | $-2^{15}$ to $2^{15} - 1$   | $16$ bits = $2$ bytes
`int32{:tact}`   | [`int32`][tlb-builtin]      | $-2^{31}$ to $2^{31} - 1$   | $32$ bits = $4$ bytes
`int64{:tact}`   | [`int64`][tlb-builtin]      | $-2^{63}$ to $2^{63} - 1$   | $64$ bits = $8$ bytes
`int128{:tact}`  | [`int128`][tlb-builtin]     | $-2^{127}$ to $2^{127} - 1$ | $128$ bits = $16$ bytes
`int256{:tact}`  | [`int256`][tlb-builtin]     | $-2^{255}$ to $2^{255} - 1$ | $256$ bits = $32$ bytes
`int257{:tact}`  | [`int257`][tlb-builtin]     | $-2^{256}$ to $2^{256} - 1$ | $257$ bits = $32$ bytes + $1$ bit
`coins{:tact}`   | [`VarUInteger 16`][varuint] | $0$ to $2^{120} - 1$        | Between $4$ and $124$ bits, [see below](#serialization-varint)

### Arbitrary types of fixed bit-width {#serialization-fixed}

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

In addition to [common serialization types](#common-serialization-types), it is possible to specify arbitrary bit-width integers by using the prefix `int` or `uint`, followed by digits. For example, writing `int7{:tact}` refers to a signed $7$-bit integer.

The minimum allowed bit-width of an `Int{:tact}` type is $1$, while the maximum is $257$ for the `int` prefix (signed integers) and $256$ for the `uint` prefix (unsigned integers).

Name             | [TL-B][tlb]            | Inclusive range                 | Space taken
:--------------: | :--------------------: | :-----------------------------: | :---------:
`uintX{:tact}`   | [`uintX`][tlb-builtin] | $0$ to $2^{X} - 1$              | $X$ bits, where $X$ is between $1$ and $256$
`intX{:tact}`    | [`intX`][tlb-builtin]  | $-2^{X - 1}$ to $2^{X - 1} - 1$ | $X$ bits, where $X$ is between $1$ and $257$

### Types of variable bit-width {#serialization-varint}

Name           | [TL-B][tlb]                 | Inclusive range      | Space taken
:------------: | :-------------------------: | :------------------: | :-------------------------
`coins{:tact}` | [`VarUInteger 16`][varuint] | $0$ to $2^{120} - 1$ | between $4$ and $124$ bits

In Tact, the variable `coins{:tact}` format is an alias to [`VarUInteger 16`][varuint] in [TL-B][tlb] representation, i.e. it takes a variable bit length depending on the optimal number of bytes needed to store the given integer and is commonly used for storing [nanoToncoin](/book/integers#nanotoncoin) amounts.

This serialization format consists of two [TL-B fields](https://docs.ton.org/develop/data-formats/tl-b-language#field-definitions):

* `len`, a $4$-bit unsigned big-endian integer storing the byte length of the provided value
* `value`, an $8 * len$-bit unsigned big-endian representation of the provided value

That is, integers serialized as `coins{:tact}` occupy between $4$ and $124$ bits ($4$ bits for `len` and $0$ to $15$ bytes for `value`) and have values in the inclusive range from $0$ to $2^{120} - 1$.

Examples:

```tact
struct Scrooge {
    // len: 0000, 4 bits (always)
    // value: none!
    // in total: 4 bits
    a: Int as coins = 0; // 0000

    // len: 0001, 4 bits
    // value: 00000001, 8 bits
    // in total: 12 bits
    b: Int as coins = 1; // 0001 00000001

    // len: 0010, 4 bits
    // value: 00000001 00000010, 16 bits
    // in total: 20 bits
    c: Int as coins = 258; // 0010 00000001 00000010

    // len: 1111, 4 bits
    // value: hundred twenty 1's in binary
    // in total: 124 bits
    d: Int as coins = pow(2, 120) - 1; // hundred twenty 1's in binary
}
```

Name               | [TL-B][tlb]                 | Inclusive range             | Space taken
:----------------: | :-------------------------: | :-------------------------: | :-------------------------
`varuint16{:tact}` | [`VarUInteger 16`][varuint] | same as `coins{:tact}`      | same as `coins{:tact}`
`varint16{:tact}`  | `VarInteger 16`             | $-2^{119}$ to $2^{119} - 1$ | between $4$ and $124$ bits
`varuint32{:tact}` | [`VarUInteger 32`][varuint] | $0$ to $2^{248} - 1$        | between $5$ and $253$ bits
`varint32{:tact}`  | `VarInteger 32`             | $-2^{247}$ to $2^{247} - 1$ | between $5$ and $253$ bits

<p/><Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

The `varuint16{:tact}` format is equivalent to [`coins{:tact}`](#serialization-varint). Its signed variant, `varint16{:tact}`, has the same memory layout except for the signed `value` field, which allows a different range of values: from $-2^{119}$ to $2^{119} - 1$, including both endpoints.

To store greater values, use the `varuint32{:tact}` and `varint32{:tact}` formats. These are serialized almost identically to `coins{:tact}` and other smaller variable integer formats but use a $5$-bit `len` field for storing the byte length. This allows the `value` to use up to $248$ bits for storing the actual number, meaning that both `varuint32{:tact}` and `varint32{:tact}` can occupy up to $253$ bits in total.

Examples:

```tact
struct BradBit {
    // len: 00000, 5 bits
    // value: none!
    // in total: 5 bits
    a: Int as varuint32 = 0; // 00000

    // len: 00001, 5 bits
    // value: 00000001, 8 bits
    // in total: 13 bits
    b: Int as varuint32 = 1; // 00001 00000001

    // len: 00010, 5 bits
    // value: 00000001 00000010, 16 bits
    // in total: 21 bits
    c: Int as varuint32 = 258; // 00010 00000001 00000010

    // len: 11111, 5 bits
    // value: two hundred and forty-eight 1's in binary
    // in total: 253 bits
    d: Int as varuint32 = pow(2, 248) - 1; // two hundred and forty-eight 1's in binary
}
```

:::note

  Read more on serialization here: [Compatibility with FunC](/book/func#convert-serialization)

:::

## Operations

All runtime calculations with numbers are performed at 257 bits, so [overflows](https://en.wikipedia.org/wiki/Integer_overflow) are quite rare. Nevertheless, if any math operation overflows, an exception will be thrown, and the transaction will fail. You could say that Tact's math is safe by default.

Note that there is no problem with mixing variables of [different state sizes](#serialization) in the same calculation. At runtime, they are all the same type no matter what — 257-bit signed integers, so overflows won't occur at this stage.

However, this can still lead to **errors** in the [compute phase](https://docs.ton.org/learn/tvm-instructions/tvm-overview#compute-phase) of the transaction. Consider the following example:

```tact
contract ComputeErrorsOhNo {
    oneByte: Int as uint8; // persistent state variable, max value is 255

    init() {
        self.oneByte = 255; // initial value is 255, everything fits
    }

    // Empty receiver for the deployment
    receive() {
        // Forward the remaining value in the
        // incoming message back to the sender
        cashback(sender());
    }

    receive("lets break it") {
        let tmp: Int = self.oneByte * 256; // no runtime overflow
        self.oneByte = tmp; // whoops, tmp value is out of expected range of oneByte
    }
}
```

Here, `oneByte` is serialized as a [`uint8`](#common-serialization-types), which occupies only one byte and ranges from $0$ to $2^{8} - 1$, which is $255$. When used in runtime calculations, no overflow occurs since everything is calculated as $257$-bit signed integers. However, the moment we decide to store the value of `tmp` back into `oneByte`, we get an error with [exit code 5](/book/exit-codes#5), which states the following: `Integer out of expected range`.

:::caution

  Therefore, be **very** careful with numbers and always double-check calculations when using serialization.

:::

[tvm]: https://docs.ton.org/learn/tvm-instructions/tvm-overview
[tlb]: https://docs.ton.org/develop/data-formats/tl-b-language
[tlb-builtin]: https://docs.ton.org/develop/data-formats/tl-b-language#built-in-types
[varuint]: https://docs.ton.org/develop/data-formats/msg-tlb#varuinteger-n



================================================
FILE: docs/src/content/docs/book/learn-tact-in-y-minutes.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/book/learn-tact-in-y-minutes.mdx
================================================
---
title: Learn Tact in Y minutes
description: "Take a whirlwind tour of the Tact smart contract programming language. A scenic voyage inspired by the famous learnXinYminutes website."
---

Tact is a fresh programming language for TON Blockchain that is focused on efficiency and ease of development. It is a good fit for complex smart contracts, quick onboarding, and rapid prototyping.

You can try Tact without installing anything locally using the [Web IDE](https://ide.ton.org). In addition, most examples below have an "Open in Web IDE" button for your convenience.

## Comments

```tact
// Single-line (//) comments for occasional and casual annotations

/// Documentation comments that support Markdown
```

:::note

  There are also C-like multiline comments `/* ... */`, but their use is discouraged in favor of consecutive single-line documentation comments `///`.

:::

## "Hello, World!" {#hello-world}

```tact
// Defining a contract
contract HelloWorld {
    // Listens to incoming Ping messages
    receive(msg: Ping) {
        // Sends a Pong reply message
        reply(Pong {}.toCell());
    }

    // Listens to incoming Hello messages
    receive(msg: Hello) {
        // Replies with the received Hello message
        reply(msg.toCell());
    }

    // Listens to incoming empty messages,
    // which are very handy and cheap for the deployments.
    receive() {
        // Forward the remaining value in the
        // incoming message back to the sender.
        cashback(sender());
    }
}

// A helper inlined function to send binary messages.
// See the "Primitive types" section below for more info about cells.
inline fun reply(msgBody: Cell) {
    message(MessageParameters {
        to: sender(),
        value: 0,
        mode: SendRemainingValue | SendIgnoreErrors,
        body: msgBody,
    });
}

// Empty message structs with specified 32-bit integer prefix.
// See the "Structs and message structs" section below for more info.
message(1) Ping {}
message(2) Pong {}
message(3) Hello {}
```

## Primitive types

```tact
fun showcase() {
    // There are two main groups of primitive types in Tact: integers and cells.
    // All other primitive types are derivatives of those two.

    // ---
    // Integers,
    // always 257-bit signed in runtime operations,
    // but may have different lengths in persistent contract's state (storage)
    // ---

    let one_plus_one: Int = 1 + 1; // 2
    let two_by_two: Int = 2 / 2;   // 1
    let three_by_two: Int = 3 / 2; // 1, because the division operator rounds
                                   // toward -∞, which is identical to // operator
                                   // from Python

    let one_billion = 1_000_000_000; // decimal
    let binary_mask = 0b1_1111_1111; // binary
    let permissions = 0o7_5_5;       // octal
    let heHex = 0xFF80_0000_0000;    // hexadecimal

    let nanoToncoin: Int = 1;    // 1 nanoToncoin = 0.000,000,001 Toncoin
    let toncoin: Int = ton("1"); // 1 Toncoin = 1,000,000,000 nanoToncoin


    // ---
    // Booleans: true and false.
    // They take only 1 bit in persistent storage.
    // ---

    let factual: Bool = !!(true || false);
    let fax: Bool = true && factual;


    // ---
    // Addresses of smart contracts,
    // deterministically obtained by combining the initial code and initial data.
    // ---

    // Address of the current contract
    let myAddr: Address = myAddress();

    // You can parse the Address to view components of the standard address:
    // * a workchain ID: 8-bit signed Int
    // * and an account ID: 256-bit unsigned Int
    let addrComponents: StdAddress = parseStdAddress(myAddr.asSlice());
    addrComponents.workchain; // 0, basechain: the most commonly used workchain on TON
    addrComponents.address;   // ...lots of digits...


    // ---
    // Cells, Builders, Slices.
    // ---

    // Cell is an immutable data structure that can contain up to 1023 bits
    // with up to 4 reference to other cells. Cyclic references are prohibited.
    let emptyC: Cell = emptyCell();

    // Cells are a fundamental primitive and data structure on TON Blockchain:
    // contracts communicate and interact by sending and receiving cells while
    // their code and data are themselves stored as cells on the blockchain
    // the code and the data of each contract are cells and contracts
    // communicate and interact by sending and receiving cells.
    //
    // Furthermore, all data layouts are also expressed in terms of cells and
    // cell (de)serialization primitives. That said, Tact provides declarative means
    // to express (de)serialization to and from cells conveniently —
    // see the "Structs and message structs" subsection below for more info.

    // Builder is an immutable primitive to construct (compose) cells.
    let bb: Builder = beginCell()
        .storeUint(42, 6)  // storing 42 using 6 bits
        .storeInt(42, 7)   // storing 42 using 7 bits (signed Int)
        .storeBool(true)   // writing 1 as a single bit
        .storeBit(true)    // alias to storeBool()
        .storeCoins(40)    // common way of storing nanoToncoins
        .storeAddress(myAddress())
        .storeRef(emptyC); // storing a reference
    let composed: Cell = bb.endCell();

    // Slice is a mutable primitive to deconstruct (parse) cells.
    let target: Slice = composed.asSlice(); // let's start parsing `composed` Cell

    // The type ascription is optional for most cases except for maps
    // and optional types, but we'll discuss those in the
    // "Composite types" section below.
    let fortyTwo = target.loadUint(6); // taking 6 bits out of the `target` Slice,
                                       // mutating it in the process

    // If you don't want the result, you can ignore it with a wildcard.
    let _ = target.loadInt(7);

    // Finally, there are methods to skip the value, i.e., to discard it.
    target.skipBool();

    // Manual composition and parsing of Cells is tedious,
    // error-prone and is generally not recommended.
    // Instead, prefer using structures: struct and message struct types.
    // See the "Composite types" section below for more info.


    // ---
    // Strings are immutable sequences of characters,
    // which are used mainly to send and receive text message bodies.
    // ---

    // String literals are wrapped in double-quotes and can contain escape sequences,
    // but they intentionally cannot be concatenated via any operators.
    let str: String = "I am a string literal, 👻!"; // see the "Expressions" section for more

    // Strings are useful for storing text,
    // so they can be converted to a Cell type to be used as message bodies.
    let noComments: Cell = "yes comments".asComment(); // prefixes a string with 32 zero bits
}

// Finally, under the hood, Address and String types are a Slice,
// although with a well-defined distinct data layout for each.
//
// While implicit type conversions aren't allowed in Tact,
// there are extension functions that can be used for those purposes,
// such as String.asSlice() or Address.asSlice().
//
// Advanced users can introduce their own casts by using assembly functions.
// See the "Functions" section below for more info.

// An empty contract needed for the showcase above to work.
contract MyContract() {}
```

Read more: [Primitive types](/book/types#primitive-types).

## Composite types

### Optionals {#composite-optionals}

```tact
fun showcase() {
    // An optional is a value than can be of any type or null.
    // Null is a special value that represents the intentional
    // absence of any other value.

    // Int keys to Int values.
    // Type ascription of optionals is mandatory.
    let optionalVal: Int? = null;
    optionalVal = 255;

    // If you're certain that the value isn't null at a given moment,
    // use the non-null assertion operator !! to access it.
    dump(optionalVal!!);

    // If you are not certain, then it is better to explicitly compare
    // the value to null to avoid errors at runtime.
    if (optionalVal != null) {
        // here we go!
    } else {
        // not happening right now
    }
}

// You can make almost any variable or field optional by adding
// a question mark (?) after its type name.
// The only exceptions are map<K, V> and bounced<Message>,
// in which you cannot make the inner key/value type (in the case of a map)
// or the inner message struct (in the case of a bounced) optional.
```

Read more: [Optionals](/book/optionals).

### Maps {#composite-maps}

```tact
fun showcase() {
    // The composite type map<K, V> is used to associate
    // keys of type K with corresponding values of type V.

    // A map of Int keys to Int values.
    // Type ascription is mandatory.
    let myMap: map<Int, Int> = emptyMap();

    // Maps have a number of built-in methods.
    myMap.set(0, 10);          // key 0 now points to value 10
    myMap.set(0, 42);          // overriding the value under key 0 with 42
    myMap.get(0)!!;            // 42, because get can return null if the key doesn't exist
    myMap.replace(1, 55);      // false, because there was no key 1 and map didn't change
    myMap.replaceGet(0, 10)!!; // 42, because the key 0 exists and the old value there was 42
    myMap.get(0)!!;            // 10, since we've just replaced the value with .replaceGet
    myMap.del(0);              // true, because the map contained an entry under key 0
    myMap.del(0);              // false and not an error, because deletion is idempotent
    myMap.exists(0);           // false, there is no entry under key 0
    myMap.isEmpty();           // true, there is no other entries

    // Statically known `.set`s can be replaced by map literals.
    // That way, map entries will be defined at compile-time and consume much less gas.
    let myMap2: map<Int as uint8, Int as int13> = map<Int as uint8, Int as int13> {
        // Key expression: Value expression
        1 + 2: 10 * pow2(3), // key 3, value 80
        1 + 3: 20 * pow2(4), // key 4, value 320
    };

    // In most cases, to compare two maps it's sufficient to use the shallow
    // comparison via the equality == and inequality != operators.
    myMap == emptyMap(); // true

    // To traverse maps, the foreach statement is used.
    // See the "Statements" section below for more info.
    foreach (k, v in myMap) {
        // ...do something for each entry, if any
    }

    // There are many other allowed kinds of map value types for Int keys
    let _: map<Int, Bool> = emptyMap();    // Int keys to Bool values
    let _: map<Int, Cell> = emptyMap();    // Ints to Cells
    let _: map<Int, Address> = emptyMap(); // Ints to Addresses
    let _: map<Int, AnyStruct> = emptyMap();  // Ints to some structs
    let _: map<Int, AnyMessage> = emptyMap(); // Ints to some message structs

    // And all the same value types for maps with Address keys are also allowed.
    let _: map<Address, Int> = emptyMap();     // Address keys to Int values
    let _: map<Address, Bool> = emptyMap();    // Addresses to Bools
    let _: map<Address, Cell> = emptyMap();    // Addresses to Cells
    let _: map<Address, Address> = emptyMap(); // Addresses to Addresses
    let _: map<Address, AnyStruct> = emptyMap();  // Addresses to some structs
    let _: map<Address, AnyMessage> = emptyMap(); // Addresses to some message structs

    // Under the hood, empty maps are nulls, which is why it's important to provide a type ascription.
    let _: map<Int, Int> = null; // like emptyMap(), but less descriptive and generally discouraged

    // Furthermore, as with many other types, maps are just Cells with a distinct data layout.
    // Therefore, you can type cast any map back to its underlying Cell type.
    myMap.asCell();
}

// Serialization of integer keys or values is possible but only meaningful
// for maps as fields of structures and maps in the contract's persistent state.
// See the "Structs and message structs" and "Persistent state"
// sections below for more info.

// Finally, mind the limits — maps are quite gas-expensive
// and have an upper limit of around 32k entries for the whole contract.
//
// On TON, contracts are very limited in their state, and for large
// or unbounded (infinitely large) maps, it is better to use contract sharding
// and essentially make the entire blockchain part of your maps.
//
// See this approach in action for the Jetton (token)
// contract system by the end of this tour.

// The following are dummy structures needed for the showcase above to work.
struct AnyStruct { field: Int }
message AnyMessage { field: Int }
```

Read more:

* [Maps in the Book](/book/maps).
* [Map-based array data structure in the Cookbook](/cookbook/data-structures#array).

### Structs and message structs {#composite-structures}

```tact
// Structs and message structs allow multiple values to be packed together
// in a single type. They are very useful for (de)serialization of Cells
// and for usage as parameters or return types in functions.

// Struct containing a single value
struct One { number: Int; }

// Struct with default fields, fields of optional types, and nested structs
struct Params {
    name: String = "Satoshi"; // default value

    age: Int?; // field with an optional type Int?
               // and an implicit default value of null

    val: One; // nested struct One
}

// You can instruct how to (de)compose the Cells to and from structs
// by specifying certain serialization options after the `as` keyword.
struct SeriesXX {
    i64: Int as int64;  // signed 64-bit integer
    u32: Int as uint32; // unsigned 32-bit integer
    ufo51: Int as uint51; // uneven formats are allowed too,
                          // so this is an unsigned 51-bit integer

    // In general, uint1 through uint256 and int1 through int257
    // are valid serialization formats for integer values.
    maxi: Int as int257; // Int is serialized as int257 by default,
                         // but now it is explicitly specified

    // If this struct will be obtained from some Slice,
    // you can instruct the compiler to place the remainder of that Slice
    // as the last field of the struct, and even type cast the value
    // of that field to Cell, Builder or Slice at runtime.
    lastFieldName: Cell as remaining; // there can only be a single `remaining` field,
                                      // and it must be the last one in the struct
}

// The order of fields matters, as it corresponds to the resulting
// memory layout when the struct will be used to compose a Cell
// or to parse a Slice back to the struct.
struct Order {
    first: Int;     // 257 continuously laid out bits
    second: Cell;   // up to 1023 bits,
                    // which will be placed in a separate ref
                    // when composing a Cell
    third: Address; // 267 bits
}

// Message structs are almost the same as regular structs,
// but they have a 32-bit integer header in their serialization.
// This unique numeric ID is commonly referred to as an opcode (operation code),
// and it allows message structs to be used with special receiver functions
// that distinguish incoming messages based on this ID.
message ImplicitlyAssignedId {} // no fields,
                                // but not empty because of the automatically
                                // generated and implicitly set 32-bit Int opcode

// You can manually override an opcode with any compile-time expression
// that evaluates to a non-negative 32-bit integer.

// This message has an opcode of 898001897, which is the evaluated
// integer value of the specified compile-time expression.
message((crc32("Tact") + 42) & 0xFFFF_FFFF) MsgWithExprOpcode {
    // All the contents are defined identical to regular structs.
    field1: Int as uint4;         // serialization
    field2: Bool?;                // optionals
    field3: One;                  // nested structs
    field4: ImplicitlyAssignedId; // nested message structs
}

// Some usage examples.
fun usage() {
    // Instantiation of a struct.
    // Notice the lack of the "new" keyword used for this in many
    // other traditional languages.
    let val: One = One { number: 50 };

    // You can omit the fields with default values.
    let _ = Params { val }; // the field punning works —
                           // instead of `val: val` you could write just `val`

    // Convert a struct to a Cell or a Slice.
    let valCell = val.toCell();
    let valSlice = val.toSlice();

    // Obtain a struct from a Cell or a Slice.
    let _ = One.fromCell(valCell);
    let _ = One.fromSlice(valSlice);

    // Conversion works both ways.
    One.fromCell(val.toCell()).toCell() == valCell;
    One.fromSlice(val.toSlice()).toSlice() == valSlice;
}
```

Read more: [Structs and Messages](/book/structs-and-messages).

## Operators

```tact
fun showcase() {
    // Let's omit the type ascriptions and let the compiler infer the types.
    let five = 5; // = is an assignment operator,
                  // but it can be a part of the assignment statement only,
                  // because there is no assignment expression
    let four = 4;

    // Most operators below have augmented assignment versions, like +=, -=, etc.
    // See the "Statements" section below for more info.

    // Common arithmetic operators have predictable precedences.
    five + four - five * four / five % four; // 9

    // You can change order of operations with parentheses.
    (five + (four - five)) * four / (five % four); // 16

    // The % is the modulo, not the remainder operator.
    1 % five;  // 1
    1 % -five; // -4

    // Negation and bitwise NOT.
    -five;    // -5: negation of 5
    ~five;    // -6: bitwise NOT of 5
    -(~five); // 6: bitwise NOT, then negation
    ~(-five); // 4: negation, then bitwise NOT

    // Bitwise shifts.
    five << 2; // 20
    four >> 2; // 1
    -four >> 2; // -1, because negation is applied first
                // and >> performs arithmetic or sign-propagating right shift

    // Other common bitwise operators.
    five & four; // 4, due to bitwise AND
    five | four; // 5, due to bitwise OR
    five ^ four; // 1, due to bitwise XOR

    // Relations.
    five == four;     // false
    five != four;     // true
    five > four;      // true
    five < four;      // false
    five - 1 >= four; // true
    five - 1 <= four; // true

    // Logical checks.
    !(five == 5);       // false, because of the inverse ! operator
    false && five == 5; // false, because && is short-circuited
    true || five != 5;  // true, because || is also short-circuited

    // The non-null assertion operator raises a compilation error if the value
    // is null or if the type of the value is not optional,
    // i.e., it can never be null.
    let maybeFive: Int? = five;
    maybeFive!!; // 5

    // Ternary operator ?: is right-associative.
    false ? 1 : (false ? 2 : 3); // 3
    false ? 1 : true ? 2 : 3;    // 2
}
```

Read more: [Operators](/book/operators).

## Expressions

```tact /StdAddress/
contract MyContract() {
    fun showcase() {
        // Integer literals.
        0; 42; 1_000; 020; // decimal, base 10
        0xABC; 0xf; 0x001; // hexadecimal, base 16
        0o777; 0o00000001; // octal, base 8
        0b111010101111010; // binary, base 2

        // Boolean literals.
        true; false;

        // String literals.
        "You can be The Good Guy or the guy who saves the world... You can't be both.";
        "1234"; // a string, not a number
        "👻"; // strings support Unicode
        "\\ \" \n \r \t \v \b \f \x00 through \xFF"; // common escape sequences
        "\u0000 through \uFFFF and \u{0} through \u{10FFFF}"; // unicode escape sequences

        // `null` and `self` literals.
        null; // not an instance of a primitive type, but
              // a special value that represents the intentional absence
              // of any other value

        self; // used to reference the current contract from within
              // and the value of the currently extended type inside
              // the extension function. See the "Functions" section below for more.

        // Map literals.
        map<Int, Int as coins> { 11: 11 };

        // Identifiers, with usual naming conventions:
        // They may contain Latin lowercase letters `a-z`,
        // Latin uppercase letters `A-Z`, underscores `_`,
        // and digits 0 - 9, but may not start with a digit.
        // No other symbols are allowed, and Unicode identifiers are prohibited.
        // They also cannot start with __gen or __tact since those prefixes
        // are reserved by the Tact compiler.
        let azAZ09_ = 5; azAZ09_;

        // Instantiations or instance expressions of structs and message structs.
        let addr = BasechainAddress { hash: null, };

        // Field access.
        addr.hash; // null
        self.MOON_RADIUS_KM; // 1738, a contract-level constant
                             // defined below this function

        // Extension function calls (methods).
        self.MOON_RADIUS_KM.toString(); // "1738"
        self.notify("Cashback".asComment()); // rather expensive,
                                             // use cashback() instead
        "hey".asComment(); // allowed on literals

        // Global function calls.
        now(); // UNIX timestamp in seconds
        cashback(sender());

        // Some of the functions can be computed at compile-time given enough data.
        sha256("hey, I'll produce the SHA256 number at compile-time");

        // But there are special, compile-time-only functions.
        let _: Address = address("EQDtFpEwcFAEcRe5mLVh2N6C0x-_hJEM7W61_JLnSF74p4q2");
        let _: Cell = cell("te6cckEBAQEAAgAAAEysuc0="); // an empty Cell
        let _: Slice = slice("te6cckEBAQEADgAAGEhlbGxvIHdvcmxkIXgtxbw="); // a Slice with Hello world!
        let _: Slice = rawSlice("000DEADBEEF000"); // CS{Cell{03f...430} bits: 588..644; refs: 1..1}
        let _: Int = ascii("⚡"); // 14850721 or 0xE29AA1, 3 bytes in total
        let _: Int = crc32("000DEADBEEF000"); // 1821923098
        let _: Int = ton("1"); // 10^9 nanoToncoin = one Toncoin,
                               // the main currency of TON Blockchain

        // initOf, which obtains the initial code and initial data
        // of the given contract, i.e., it's initial state.
        initOf MyContract(); // StateInit { code, data }

        // codeOf, which only obtains the code.
        codeOf MyContract;
    }

    // Constants support compile-time expressions
    const MOON_RADIUS_KM: Int = 1730 + (8 | 8);
}
```

Read more: [Expressions](/book/expressions).

## Statements and control flow {#statements}

```tact
fun showcase() {
    // As we've seen above, the let statement defines new variables.
    // You must always provide an initial value, but type ascriptions
    // aren't mandatory except for maps and null values.
    let theAnswer = 42;                // type ascription is not required here,
    let m: map<Int, Int> = emptyMap(); // but we must specify it for maps
    let opt: Int? = null;              // and when assigning a null value.

    // Block statement creates an enclosed scope.
    {
        // theAnswer is accessible here
        let privateVal = theAnswer + 27;
        // but privateVal is no longer visible after this block ends.
    }

    // Assignment statement allows reassigning variables.
    theAnswer = -(~theAnswer + 1);

    // Almost every binary operator can form an augmented assignment,
    // except for relational and equality ones,
    // and excluding the assignment operator itself.
    theAnswer += 5; // equivalent to: theAnswer = theAnswer + 5;
    theAnswer -= 5; // equivalent to: theAnswer = theAnswer - 5;
    theAnswer *= 5; // and so on, see the Operators page for more.

    // Destructuring assignment is a concise way to
    // unpack structures into distinct variables.
    let st = StdAddress { workchain: 0, address: 0 }; // let statement
    let StdAddress { address, .. } = st;              // destructuring statement
    //               -------  --
    //               ↑        ↑
    //               |        ignores all unspecified fields
    //               Int as uint256,
    //               a variable out of the second field of StdAddress struct
    address; // 0

    // You can also define new names for variables
    // derived from the struct fields.
    let StdAddress { address: someNewName, .. } = st;
    someNewName; // 0

    // Conditional branching with if...else.
    if (false) { // curly brackets (code blocks) are required!
        // ...then branch
    } else if (false) {
        // ...else branch
    } else {
        // ...last else
    }

    // Try and try...catch, with partial rollback.
    try {
        throw(777);
    } catch (exitCode) { // 777
        // An exit code is an integer that indicates whether the transaction
        // was successful, and if not — holds the code of the exception that occurred.
        //
        // The catch block that can catch run-time (compute phase) exit codes
        // will roll back almost all changes made in the try block,
        // except for: codepage changes, gas usage counters, etc.
        //
        // See the "Testing and debugging" section below for more info.
    }

    // Repeat something N times.
    repeat (2003) {
        dump("mine"); // greet the Nemo
    }

    // Loop with a pre-condition: while.
    while (theAnswer > 42) {
        theAnswer /= 5;
    }

    // Loop with a post-condition: do...until.
    do {
        // This block will be executed at least once,
        // because the condition in the until close
        // is checked after each iteration.
        m = emptyMap();
    } until (false);

    // Traverse over all map entries with foreach.
    m.set(100, 456);
    m.set(23, 500);
    foreach (key, value in m) { // or just k, v: naming is up to you
        // Goes from smaller to bigger keys:
        // first iteration key = 23
        // second iteration key = 100
    }

    // If you don't want key, value, or both, then use a wildcard.
    let len = 0;
    foreach (_, _ in m) {
        len += 1; // don't mind me, just counting the size of the map
    }

    // Finally, return statement works as usual.
    return; // implicitly produces nothing (named "void" in the compiler)
    // return 5; // would explicitly produce 5
}
```

Read more: [Statements](/book/statements).

## Functions

```tact
// Global function with parameters and return type.
fun add(a: Int, b: Int): Int {
    return a + b;
}

// Global function have a set of optional attributes that can change their demeanor.
// For example, inline attribute will make the body of this
// function inlined in all places where this function is called,
// increasing the total code size and possibly reducing computational fees.
inline fun reply(str: String) {
    message(MessageParameters {
        to: sender(),
        value: 0,
        mode: SendRemainingValue | SendIgnoreErrors,
        body: str.asComment(),
    });
}

// The extends attribute allows to implement extension functions for any type.
// Its first parameter in the signature must be named self,
// and its type is the type this function is extending.
// Think of extension functions as very flexible method definitions
// in popular programming languages.
extends fun toCoinsString2(self: Int): String {
    return self.toFloatString(9);
}

/// On top of the extends attribute, you may add the mutates attribute,
/// which would allow mutating the value of the currently extended type.
extends mutates fun hippityHoppity(self: Int) {
    // ...something that would mutate `self`
    self += 1;
}

/// Tact allows you to import Tact and FunC files.
/// To bind to or wrap the respective functions in FunC,
/// the so-called native functions are used.
///
/// Prior to defining them, make sure to add the
/// required `import "./path/to/file.fc";` on top of the file.
@name(get_data) // here, import is not needed,
                // because the stdlib.fc is always implicitly imported
native getData(): Cell;

/// Finally, there are advanced module-level functions that allow you
/// to write Tact assembly. Unlike all other functions, their bodies consist
/// only of TVM instructions and some other primitives as arguments to instructions.
asm fun rawReserveExtra(amount: Int, extraAmount: Cell, mode: Int) { RAWRESERVEX }

// Examples of calling the functions defined above
fun showcase() {
    // Global function
    add(1, 2); // 3

    // Inlined global function
    reply("Viltrum Empire");

    // Extension function
    5.toCoinsString2(); // 0.000000005

    // Extension mutation function
    let val = 10;
    val.hippityHoppity();
    val; // 11

    // Native function, called just like global functions
    getData(); // Cell with the contract's persistent storage data.

    // Assembly function, called just like global functions
    rawReserveExtra(ton("0.1"), emptyCell(), 0);
}

// The functions discussed above are helpful but not mandatory for
// the contracts to operate, unlike the receiver functions,
// which can only be defined at the contract and trait level.
//
// See the "Contracts and traits" section below for more info.
```

Read more: [Functions](/book/functions).

## Message exchange and communication {#messaging}

```tact
// On TON, contracts cannot read each other's states and cannot synchronously
// call each other's functions. Instead, the actor model of communication is
// applied — contracts send or receive asynchronous messages that may or may not
// influence each other's state.
//
// Each message is a Cell with a well-defined, complex structure of serialization.
// However, Tact provides you with simple abstractions to send, receive, and
// (de)serialize messages to and from various structures.
//
// Each message has a so-called message body,
// which can be represented by message structs with certain opcodes.
message(123) MyMsg { someVal: Int as uint8 }

// Messages can also omit their bodies, or have them be empty,
// in which case they won't have any opcode and could only be handled
// by the empty message body receiver or "empty receiver" for short.
//
// See the "Contracts and traits" section below for more info.

// Finally, sending messages is not free and requires
// some forward fees to be paid upfront.
fun examples() {
    // To keep some amount of nanoToncoins on the balance,
    // use nativeReserve() prior to calling message-sending functions:
    nativeReserve(ton("0.01"), ReserveAtMost);

    // There are many message-sending functions for various cases.
    // See the links given right after this code block.
    //
    // This is most general and simple function to send an internal message:
    message(MessageParameters {
        // Recipient address.
        to: address("UQDtFpEwcFAEcRe5mLVh2N6C0x-_hJEM7W61_JLnSF74p9dz"),

        // Optional message body.
        body: null, // empty body, no opcodes, nothing

        // Some nanoToncoins to send, possibly none.
        value: 0, // do not attach any nanoToncoins to the message

        // Configure various modes of sending the message in regards to how
        // the funds will be charged, how message will be processed, etc.
        mode: SendPayFwdFeesSeparately | SendIgnoreErrors,

        // Whether to allow this message to bounce back to this contract
        // in case the recipient contract doesn't exist or wasn't able to
        // process the message.
        bounce: true, // to handle messages that bounced back, a special bounced
                      // receiver function is used. See the "Contracts and traits"
                      // section below for more info.
    });

    // To do refunds and forward excess values from the incoming message
    // back to the original sender, use the cashback message-sending function:
    cashback(sender());

    // Note that all message-sending functions only queue the messages when called.
    // The actual processing and sending will be done in the next, action phase
    // of the transaction, where many messages can fail for various reasons.
    //
    // For example, if the remaining value from the incoming message was used by
    // the first function, the subsequent functions that would try to do the same
    // will fail. The optional SendIgnoreErrors flag seen above hides those failures
    // and ignores the unprocessed messages. It's not a silver bullet, and you're
    // advised to always double-check the message flow in your contracts.
}

// Already bounced messages cannot be sent by any contract and are guaranteed
// to be received only by the current contract that did sent them as internal
// messages first.
//
// Additionally, external messages cannot be sent by the contract,
// only processed by it.
//
// To receive internal messages (bounced or sent directly) and external messages,
// provide corresponding receiver functions. See the "Contracts and traits"
// section below for more info.
//
// To organize child-parent contract message exchange, see the "Jetton contracts"
// section below.
```

Read more:

* [Receive messages](/book/receive).
* [Send messages](/book/send).
* [Message-sending functions](/book/send#message-sending-functions).
* [Message mode](/book/message-mode).

## Contracts and traits

```tact
// Tact allows you to import Tact and FunC code.
// Additionally, there's a versatile set of standard libraries
// which come bundled in with a compiler, but are not included
// in projects right away.
//
// To import a standard library, instead of specifying a path to a file
// start the import string with @stdlib/.
import "@stdlib/ownable"; // for the Ownable trait

// Traits have the same structure as contracts and are used
// to provide some means of inheritance and common code reuse.
//
// Like contracts, traits can also inherit other traits.
trait MyTrait with Ownable {
    owner: Address; // required field from the Ownable trait

    // Within traits and contracts, you can define scoped functions
    // and only accessible from them or their successors. Those functions
    // are often called internal functions.
    //
    // If you won't be using any contract fields, it's better to define
    // such functions as global, i.e., on the top-level.
    fun addIfOwner(a: Int, b: Int): Int {
        self.requireOwner();
        return a + b;
    }

    // Adding an abstract attribute to the internal function requires us
    // to omit their body definitions and demand that from contracts that
    // will inherit the trait.
    abstract fun trust(msg: MyMsg);

    // Adding a virtual attribute to the internal function allows their
    // body definitions to be be overridden in the contracts that will
    // inherit the trait.
    virtual fun verify(msg: MyMsg) {
        self.requireOwner();
        require(msg.someVal > 42, "Too low!");
    }
}

// Contract definitions in Tact conveniently represent smart contracts
// on TON Blockchain. They hold all variables, functions, getters and receivers,
// while providing accessible abstractions for working with them.
contract MyContract(
    // Persistent state variables of the contract:
    owner: Address, // required field from the Ownable trait
    accumulator: Int as uint8,
    // Their default or initial values are supplied during deployment.
) with MyTrait, Ownable {

    // The internal message receiver is a function that handles messages received
    // by this contract on-chain: from other contracts and never from outside.
    receive(msg: MyMsg) {
        self.requireOwner();
        self.accumulator += msg.someVal;

        // Send a message back to the sender() with MyMsg
        message(MessageParameters {
            to: sender(),
            value: ton("0.04"),
            body: MyMsg{ someVal: self.accumulator }.toCell(),
        });
    }

    // For deployments, it is common to use the following receiver
    // often called an "empty receiver", which handles `null` (empty)
    // message bodies of internal messages.
    receive() {
        // Forward the remaining value in the
        // incoming message (surplus) back to the sender.
        cashback(sender());
    }

    // The bounced message receiver is a function that handles messages sent
    // from this contract and bounced back to it because of a malformed payload or
    // some issues on the recipient side.
    bounced(msg: bounced<MyMsg>) {
        // Bounced message bodies are limited by their first 256 bits, which
        // means that excluding their 32-bit opcode there are only 224 bits left
        // for other contents of MyMsg.
        //
        // Thus, in message structs prefer to put small important fields first.
        require(msg.someVal > 42, "Unexpected bounce!");
        self.accumulator = msg.someVal;
    }

    // The external message receiver is a function that handles messages sent
    // to this contract from outside the blockchain. That is often the case
    // for user wallets, where apps that present some UI for them have to
    // communicate with contracts on chain to perform transfers on their behalf.
    external(msg: MyMsg) {
        // There is no sender, i.e., calling sender() here won't work.
        // Additionally, there are no guarantees that the received message
        // is authentic and is not malicious. Therefore, when receiving
        // such messages one has to first check the signature to validate the sender,
        // and explicitly agree to accept the message and fund its processing
        // in the current transaction with acceptMessage() function.
        require(msg.someVal > 42, "Nothing short of 42 is allowed!");
        self.accumulator = msg.someVal;
        acceptMessage();
    }

    // Getter functions or get methods are special functions that can only
    // be called from within this contract or off-chain, and never by other contracts.
    // They cannot modify the contract's state and they do not affect its balance.
    // The IO analogy would be that they can only "read", not "write".
    get fun data(): MyContract {
        // This getter returns the current state of the contract's variables,
        // which is convenient for tests but not advised for production.
        return self;
    }

    // Finally, for each inherited trait contract may override its virtual internal
    // functions and it MUST override its abstract internal functions as to provide
    // their defined bodies.
    override fun trust(msg: MyMsg) {
        require(msg.someVal == 42, "Always bring your towel with you");
    }
}

// Message struct with 123 as its 32-bit opcode.
message(123) MyMsg {
    someVal: Int as uint8;
}
```

Read more: [Contracts](/book/contracts).

## Constants

```tact
// Global, top-level constants.
// Type ascription is mandatory.
const MY_CONSTANT: Int =
    ascii("⚡"); // expressions are computed at compile-time

// Trait-level constants.
trait MyTrait {
    const I_AM_ON_THE_TRAIT_LEVEL: Int = 420;

    // On the trait-level, you can make constants abstract,
    // which requires the contracts that inherit this trait
    // to override those constants with some values.
    abstract const OVERRIDE_ME: Int;

    // Virtual constants allow overrides, but do not require them.
    virtual const YOU_CAN_OVERRIDE_ME: Int = crc32("babecafe");
}

// Contract-level constants.
contract MyContract() with MyTrait {
    const iAmOnTheContractLevel: Int = 4200;

    // Because this contract inherits from MyTrait,
    // the I_AM_ON_THE_TRAIT_LEVEL constant is also in scope of this contract,
    // but we cannot override it.

    // However, we can override the virtual constant.
    override const YOU_CAN_OVERRIDE_ME: Int = crc32("deadbeef");

    // And we MUST override and define the value of the abstract constant.
    override const OVERRIDE_ME: Int = ton("0.5");
}

// All constants are inlined, i.e., their values are embedded in the resulting
// code in all places where their values are referenced in Tact code.
//
// The main difference is the scope — global can be referenced
// from anywhere, while contract and trait-level constants are
// only accessible within them via `self` references.
```

Read more: [Constants](/book/constants).

## Persistent state {#state}

```tact
// Contracts can define state variables that persist between contract calls,
// and thus commonly referred to as storage variables.
// Contracts in TON pay rent in proportion to the amount of persistent space
// they consume, so compact representations via serialization are encouraged.
// Unlike variables, constants do not consume space in the persistent state.

contract StateActor(
    // Persistent state variables
    oneByte: Int as uint8,  // ranges from -128 to 127
    twoBytes: Int as int16, // ranges from -32,768 to 32,767
    currency: Int as coins, // variable bit-width format, which occupies
                            // between 4 and 124 bits
                            // and ranges from 0 to 2^120 - 1
) {

    receive() {
        // Serialization to smaller values only applies for the state between
        // transactions and incoming or outgoing message bodies.
        // This is because at runtime everything is computed
        // at their maximum capacity and all integers are assumed to
        // be 257-bit signed ones.
        //
        // That is, the following would not cause any runtime overflows,
        // but will throw an out of range error only after the execution of
        // this receiver is completed.
        self.oneByte = -1;  // this won't fail immediately
        self.oneByte = 500; // and this won't fail right away either

    } // only here, at the end of the compute phase,
      // would an error be thrown with exit code 5:
      // Integer out of expected range
}
```

Read more: [Persistent state variables](/book/contracts#variables).

## Testing and debugging {#debug}

```tact
fun showcase() {
    // An exit code is an integer that indicates whether the transaction
    // was successful and, if not — holds the code of the exception that occurred.
    //
    // They are the simplest litmus tests for your contracts,
    // indicating what happened and, if you are lucky, where, and why.
    try {
        dump(
            beginCell()
            .storeInt(0, 250)
            .storeInt(0, 250)
            .storeInt(0, 250)
            .storeInt(0, 250)
            .storeUint(0, 24) // oh no, we're trying to store 1024 bits,
                              // while cells can only store up to 1023 bits
        );
    } catch (exitCode) {
        // exitCode is 8, which means the cell overflow has happened somewhere.
        // However, there is no clear indication there just from the code alone —
        // you need to either view transaction logs or know many pitfalls in advance.
        //
        // Additionally, runtime computations aren't free and require gas to be spent.
        // The catch block can revert the state before the try block,
        // but it cannot revert the gas spent for computations in the try block.
    }

    // Contrary to this reactive approach, we can be proactive and state
    // our expectations upfront with require() function.
    // It will also throw an exit code, but this time we can map that exit code
    // onto the error message and trace our way back to the this call to require().
    require(now() >= 1000, "We're too early, now() is less than 1000");

    // Sometimes, its also helpful to log the events as they unfold to view
    // the data off-chain. Use the emit() message-sending function for this.
    emit("Doing X, then Y, currently at R".asComment());
}

// Those tools are handy, but they are not enough.
// To fully understand what went wrong, you might need to read the TON Virtual
// Machine (TVM) execution logs when running contracts in the Sandbox.
// And to ensure that encountered issues won't happen again, do write tests
// in Tact and TypeScript using the Sandbox + Jest toolkit provided by
// the Blueprint framework or tact-template.
```

Read more:

* [Debugging and testing](/book/debug).
* [Exit codes](/book/exit-codes).
* [Gas best practices](/book/gas-best-practices).
* [Security best practices](/book/security-best-practices).
* [Transaction retracer on retracer.ton.org](https://retracer.ton.org/).
* [Blueprint framework on GitHub](https://github.com/ton-org/blueprint).
* [tact-template on GitHub](https://github.com/tact-lang/tact-template).

## Contract deployment {#deploy}

```tact
fun showcase() {
    // Contract deployment is done by sending messages. For deployments,
    // one must send the new contract's initial state, i.e.,
    // its initial code and initial data, to its Address,
    // which is deterministically obtained from the initial state.
    deploy(DeployParameters {
        // Use initOf expression to provide initial code and data
        init: initOf MyContract(),
        // Attaching 1 Toncoin, which will be used to pay various fees
        value: ton("1"),
        // Notice that we do not need to explicitly specify the Address.
        // That's because it will be computed on the fly from the initial package.
    });
}

// However, before your contracts can start deploying other contracts on-chain,
// it is common to first send an external message to your TON wallet from off-chain.
// Then, your wallet will be the contract that deploys the target one.

// An empty contract needed for the showcase above to work.
contract MyContract() {}
```

Read more: [Deployment](/book/deploy).

## Example contracts {#examples}

Let's put our newly acquired information of syntax and some semantics to the test.

### Counter contract {#examples-counter}

```tact
// Defining a new Message type, which has one field
// and an automatically assigned 32-bit opcode prefix
message Add {
    // unsigned integer value stored in 4 bytes
    amount: Int as uint32;
}

// Defining a contract
contract SimpleCounter(
    // Persistent state variables of the contract:
    counter: Int as uint32, // actual value of the counter
    id: Int as uint32, // a unique id to deploy multiple instances
                       // of this contract in a same workchain
    // Their default or initial values are supplied during deployment.
) {
    // Registers a receiver of empty messages from other contracts.
    // It handles internal messages with `null` body
    // and is very handy and cheap for the deployments.
    receive() {
        // Forward the remaining value in the
        // incoming message back to the sender.
        cashback(sender());
    }

    // Registers a binary receiver of the Add message bodies.
    receive(msg: Add) {
        self.counter += msg.amount; // <- increase the counter
        // Forward the remaining value in the
        // incoming message back to the sender.
        cashback(sender());
    }

    // A getter function, which can only be called from off-chain
    // and never by other contracts. This one is useful to see the counter state.
    get fun counter(): Int {
        return self.counter; // <- return the counter value
    }

    // Another getter function, but for the id:
    get fun id(): Int {
        return self.id; // <- return the id value
    }
}
```

### Jetton contracts {#examples-jetton}

The tokens on TON Blockchain are commonly called Jettons. The distinction is made because they work differently from ERC-20 tokens or others.

This is due to the scalable and distributed approach that works best on TON: instead of having a single giant contract with a big hashmap of addresses of token holders, Jettons instead have a single minter contract that creates individual contracts called Jetton wallets per each holder.

For more, refer to the following resources:

* [TON Jettons Processing](https://docs.ton.org/v3/guidelines/dapps/asset-processing/jettons) in TON Docs.
* Jetton standards: [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md), [TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md), and [TEP-89](https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md).

#### JettonWallet

```tact
/// Child contract per each holder of N amount of given Jetton (token)
contract JettonWallet(
    /// Balance in Jettons.
    balance: Int as coins,

    /// Address of the user's wallet which owns this JettonWallet, and messages
    /// from whom should be recognized and fully processed.
    owner: Address,

    /// Address of the main minting contract,
    /// which deployed this Jetton wallet for the specific user's wallet.
    master: Address,
) {
    /// Registers a binary receiver of the JettonTransfer message body.
    /// Transfers Jettons from the current owner to the target user's JettonWallet.
    /// If that wallet does not exist, it is deployed on-chain in the same transfer.
    receive(msg: JettonTransfer) {
        // Ensure the basechain (workchain ID = 0)
        require(parseStdAddress(msg.destination.asSlice()).workchain == 0, "Invalid destination workchain");
        // Ensure the owner.
        require(sender() == self.owner, "Incorrect sender");

        // Ensure the balance does not go negative.
        self.balance -= msg.amount;
        require(self.balance >= 0, "Incorrect balance after send");
        // Ensure the payload has enough bits.
        require(msg.forwardPayload.bits() >= 1, "Invalid forward payload");

        let ctx = context();
        // msg.forwardTonAmount cannot be negative
        // because its serialized as "coins"
        let fwdCount = 1 + sign(msg.forwardTonAmount);

        // Ensure there are enough Toncoin for transferring Jettons.
        require(
            ctx.value >
            msg.forwardTonAmount + fwdCount * ctx.readForwardFee() +
            (2 * getComputeFee(GAS_FOR_TRANSFER, false) + MIN_TONCOIN_FOR_STORAGE),
            "Insufficient amount of TON attached",
        );

        // Transfer Jetton from the current owner to the target user's JettonWallet.
        // If that wallet does not exist, it is deployed on-chain in the same transfer.
        deploy(DeployParameters {
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: JettonTransferInternal{
                queryId: msg.queryId,
                amount: msg.amount,
                sender: self.owner,
                responseDestination: msg.responseDestination,
                forwardTonAmount: msg.forwardTonAmount,
                forwardPayload: msg.forwardPayload,
            }.toCell(),
            // Notice that we do not need to explicitly specify the Address,
            // because it will be computed on the fly from the initial package.
            init: initOf JettonWallet(0, msg.destination, self.master),
        });
    }

    /// Registers a binary receiver of messages with JettonTransferInternal opcode.
    /// Those are expected to be sent from the JettonMinter
    /// or from other JettonWallets, and indicate incoming Jetton transfers.
    receive(msg: JettonTransferInternal) {
        self.balance += msg.amount;

        // This message should come only from JettonMinter,
        // or from other JettonWallet.
        let wallet: StateInit = initOf JettonWallet(0, msg.sender, self.master);
        if (sender() != contractAddress(wallet)) {
            require(self.master == sender(), "Incorrect sender");
        }

        let ctx: Context = context();
        let msgValue: Int = ctx.value;
        let tonBalanceBeforeMsg = myBalance() - msgValue;

        // If there are some funds to forward a message
        // let's notify the user's wallet about the Jetton transfer we just got.
        if (msg.forwardTonAmount > 0) {
            let fwdFee: Int = ctx.readForwardFee();
            msgValue -= msg.forwardTonAmount + fwdFee;
            message(MessageParameters {
                to: self.owner,
                value: msg.forwardTonAmount,
                mode: SendPayFwdFeesSeparately,
                bounce: false,
                body: JettonNotification{
                    queryId: msg.queryId,
                    amount: msg.amount,
                    sender: msg.sender,
                    forwardPayload: msg.forwardPayload,
                }.toCell(),
            });
        }

        // In general, let's try to reserve minimal amount of Toncoin
        // to keep this contract running and paying storage fees.
        nativeReserve(max(tonBalanceBeforeMsg, MIN_TONCOIN_FOR_STORAGE), ReserveAtMost);

        // And forward excesses (cashback) to the original sender.
        if (msg.responseDestination != null && msgValue > 0) {
            message(MessageParameters {
                to: msg.responseDestination!!,
                value: msgValue,
                mode: SendRemainingBalance + SendIgnoreErrors,
                bounce: false,
                body: JettonExcesses{ queryId: msg.queryId }.toCell(),
            });
        }
    }

    /// Registers a binary receiver of messages with JettonBurn opcode.
    receive(msg: JettonBurn) {
        // Ensure the owner.
        require(sender() == self.owner, "Incorrect sender");

        // Ensure the balance does not go negative.
        self.balance -= msg.amount;
        require(self.balance >= 0, "Incorrect balance after send");

        // Ensure there are enough Toncoin for transferring Jettons.
        let ctx = context();
        let fwdFee: Int = ctx.readForwardFee();
        require(
            ctx.value >
            (fwdFee + 2 * getComputeFee(GAS_FOR_BURN, false)),
            "Insufficient amount of TON attached",
        );

        // Send a message to the JettonMinter to reduce the total supply
        // of the Jettons. That is, to burn some.
        message(MessageParameters {
            to: self.master,
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: JettonBurnNotification{
                queryId: msg.queryId,
                amount: msg.amount,
                sender: self.owner,
                responseDestination: msg.responseDestination,
            }.toCell(),
        });
    }

    /// Registers a bounced binary receiver of messages
    /// with the JettonTransferInternal opcode.
    /// It handles such outgoing messages that bounced back to this contract.
    bounced(msg: bounced<JettonTransferInternal>) { self.balance += msg.amount; }

    /// Registers a bounced binary receiver of messages
    /// with the JettonBurnNotification opcode.
    /// It handles such outgoing messages that bounced back to this contract.
    bounced(msg: bounced<JettonBurnNotification>) { self.balance += msg.amount; }

    /// An off-chain getter function which returns useful data about this wallet.
    get fun get_wallet_data(): JettonWalletData {
        return JettonWalletData{
            balance: self.balance,
            owner: self.owner,
            master: self.master,
            code: myCode(),
        };
    }
}

//
// Helper structs, message structs and constants,
// which would otherwise be imported from another file
//

struct JettonWalletData {
    balance: Int;
    owner: Address;
    master: Address;
    code: Cell;
}

message(0xf8a7ea5) JettonTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address?;
    customPayload: Cell?;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

message(0x178d4519) JettonTransferInternal {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    responseDestination: Address?;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

message(0x7362d09c) JettonNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    forwardPayload: Slice as remaining;
}

message(0x595f07bc) JettonBurn {
    queryId: Int as uint64;
    amount: Int as coins;
    responseDestination: Address?;
    customPayload: Cell?;
}

message(0x7bdd97de) JettonBurnNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    responseDestination: Address?;
}

message(0xd53276db) JettonExcesses {
    queryId: Int as uint64;
}

const GAS_FOR_BURN: Int = 6000;
const GAS_FOR_TRANSFER: Int = 8000;
const MIN_TONCOIN_FOR_STORAGE: Int = ton("0.01");
```

#### JettonMinter

It is a parent contract that deploys individual [Jetton wallets](#jettonwallet) per each holder.

See: [`JettonMinter` in tact-lang/jetton repository](https://github.com/tact-lang/jetton/blob/9db75a5a828e9093be5c425605c5f5c9903f505d/src/contracts/jetton-minter.tact).



================================================
FILE: docs/src/content/docs/book/lifecycle.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/book/lifecycle.mdx
================================================
---
title: Message Lifecycle
description: "Every transaction on TON Blockchain has multiple stages, where the compute and action stages are the most important for the message lifecycle."
---

There are several stages of message processing by a contract. While there are more stages, we will focus on the most important ones:

## Receive Phase

This phase combines multiple low-level phases.

It starts by adding a **message value to the contract balance**. The value of an incoming message is the maximum price that a contract can pay for gas to process this message. The contract can overwrite this limit, but it is not recommended and is suitable only for advanced developers since it could lead to a contract being drained. The maximum amount of gas that a contract can spend in a single transaction is 1 million, which currently equals 0.4 TON for basechain. If the message value is zero, execution is aborted.

Then, a (usually small) amount of nanotons gets subtracted from the contract balance for storage. This means that you cannot perfectly predict balance changes and must adjust your code to account for this instability.

Next, it deploys the contract if it has not yet been deployed and if the message contains the init package. If the init package is not present, this step is skipped.

## Compute Phase

This phase executes the code of a smart contract and produces either a list of actions or an exception. Currently, only two types of actions are supported: **send message** and **reserve**.

Sending a message could use a fixed value or a dynamic value like the **remaining value of a message**, which is the remaining value of the incoming message. A message can be sent with the flag `SendIgnoreErrors`, which causes errors during message sending to be ignored and the execution to continue to the next action. This flag is useful when you have multiple actions. When sending a message with some value, this value is first subtracted from the incoming message value and only then, if necessary, from the contract balance (before processing).

## Action Phase

Actions are executed in sequence, but bear in mind:
**AN EXCEPTION DURING THE PROCESSING OF ACTIONS WILL NOT REVERT THE TRANSACTION**

For example, if you subtract 1 TON from a customer's balance and then send an invalid message, it could lead to a situation where the customer's balance is reduced, but the customer does not receive it.



================================================
FILE: docs/src/content/docs/book/maps.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/book/maps.mdx
================================================
---
title: Maps
description: "The composite type map is used as a way to associate keys with corresponding values of various types."
---

import { Badge } from '@astrojs/starlight/components';

The [composite type](/book/types#composite-types) `map<K, V>{:tact}` is used as a way to associate keys of type `K{:tact}` with corresponding values of type `V{:tact}`.

For example, `map<Int, Int>{:tact}` uses the [`Int{:tact}`][int] type for its keys and values:

```tact
struct IntToInt {
    counters: map<Int, Int>;
}
```

Since maps can use any given [struct][struct] or [message struct][message] as their [value types](#allowed-types), nested maps can be created via helper structures like this:

```tact
// A `map<Address, Int>` packed into the `AllowanceMap` structure
struct AllowanceMap { unbox: map<Address, Int> }

contract NestedMaps {
    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }

    get fun test(): Int {
        // An outer map `map<Address, AllowanceMap>`,
        // with `AllowanceMap` structs as values,
        // each containing maps of type `map<Address, Int>`
        let allowances: map<Address, AllowanceMap> = emptyMap();

        // An inner map in the `unbox` field of the `AllowanceMap` struct
        let allowance = AllowanceMap { unbox: emptyMap() };

        // Setting the inner map entry
        allowance.unbox.set(myAddress(), 42);

        // Setting the outer map entry
        allowances.set(myAddress(), allowance);

        // Produces 42
        return allowances.get(myAddress())!!.unbox.get(myAddress())!!;
    }
}
```

Keep in mind that on [TVM][tvm], maps are represented as the [`Cell{:tact}`][cell] type, which is very gas-intensive. Also, nested maps will reach the [limits](#limits-and-drawbacks) faster than regular maps.

## Allowed types

Allowed key types:

* [`Int{:tact}`][int]
* [`Address{:tact}`][p]

Allowed value types:

* [`Int{:tact}`][int]
* [`Bool{:tact}`](/book/types#booleans)
* [`Cell{:tact}`][cell]
* [`Address{:tact}`][p]
* any [struct][struct] type, except for [map literals](#initialize)
* any [Message][message] type, except for [map literals](#initialize)

Neither key nor value types can be made [optional](/book/optionals).

```tact
// COMPILATION ERROR! Map key types cannot be optional
let myMap: map<Int?, Int> = emptyMap();
//             ~~~~
```

## Serialization

It is possible to perform [integer serialization](/book/integers#common-serialization-types) of map keys, values, or both to [preserve space and reduce storage costs](/book/integers#serialization):

```tact
struct SerializedMapInside {
    // Both keys and values here are serialized as 8-bit unsigned integers,
    // thus preserving space and reducing storage costs:
    countersButCompact: map<Int as uint8, Int as uint8>;
}
```

Since map keys can only be of fixed width, [variable integer types](/book/integers#serialization-varint) are not allowed for them. Instead, use [fixed-width serialization formats](/book/integers#serialization-fixed).

However, map values of type [`Int{:tact}`][int] can have either [fixed](/book/integers#serialization-fixed) or [variable](/book/integers#serialization-varint) bit-length serialization formats specified.

No other [allowed key or value types](#allowed-types) besides [`Int{:tact}`][int] have serialization formats available.

:::note

  Read more about serialization in Tact: [Compatibility with FunC](/book/func#convert-serialization).

:::

## Low-level representation

On [TVM][tvm], maps are represented as a [`Cell{:tact}`][cell] type, and it's possible to construct and parse them directly. However, doing so is highly error-prone and quite messy, which is why Tact provides maps as a standalone composite type with many of the helper methods [described below](#operations).

Essentially, maps are cells with a special bits layouts, which have many supporting TVM instructions for their modification and usage. They are broadly called ["hashmaps"](https://docs.ton.org/v3/documentation/data-formats/tlb/tl-b-types#hashmap), although they are closer to balanced trees.

Maps always have fixed key lengths which can be one of two kinds: long and short. For the distinction and composition of maps with either of key types, see the [description of the `.deepEquals(){:tact}`](#deepequals) map method.

## Operations

### Declare, `emptyMap()` {#emptymap}

```tact
// K and V correspond to the key and value types of the target map
fun emptyMap(): map<K, V>;
```

Declaring a map as a [local variable](/book/statements#let), using the `emptyMap(){:tact}` function from the standard library:

```tact
let fizz: map<Int, Int> = emptyMap();
let fizz: map<Int, Int> = null; // identical to the previous line, but less descriptive
```

Declaring a map as a [persistent state variable](/book/contracts#variables):

```tact
contract Example {
    fizz: map<Int, Int>; // Int keys to Int values
    init() {
        self.fizz = emptyMap(); // redundant and can be removed!
    }
}
```

Note that [persistent state variables](/book/contracts#variables) of type `map<K, V>{:tact}` are initialized empty by default and do not need default values or initialization in the [`init(){:tact}` function](/book/contracts#init-function).

### Initialize with a map literal {#initialize}

<Badge text="Available since Tact 1.6.7" variant="tip" size="medium"/><p/>

```tact
// K and V correspond to the key and value types of the target map
map<K, V> { key1: value1, key2: value2, /* ... */, keyN: valueN };
```

Map literals are expressions that provide a concise and gas-effective way to create maps. First goes the `map<K, V>{:tact}` type expression, then a curly-brace enclosed comma-delimited list of zero or more predefined key-value pairs.

:::note
  While [struct][struct] and [message struct][message] types are generally [allowed as map values](#allowed-types), they are currently **not supported** within map literals. Attempts to use them as such lead to compilation errors.
:::

```tact
// Declaring a map as a local variable via a map literal expression
let myMap: map<Int as uint8, Int as uint16> = map<Int as uint8, Int as uint16> {
    // Key: Value
    1: 100, // key 1, value 100
    2: 200, // key 2, value 200
};

// However, if you specify the type of ascription in the let statement,
// it should exactly match the one in the map literal, or it will not compile.
let mismatch: map<Address, Cell> = map<Address, Int> {}; // COMPILATION ERROR! Type mismatch
```

Map literals with an empty body are also supported. They produce the same value as the [`emptyMap(){:tact}`](#emptymap) function and also require type ascriptions for the variable definition.

```tact
let myMap: map<Int as uint8, Cell> = map<Int as uint8, Cell> {};
let myMap2: map<Int as uint8, Cell> = emptyMap();

myMap == myMap2; // true
```

Since map literals define map entries at compile-time, they are significantly less gas consuming compared to a series of consecutive [`.set(){:tact}`](#set) calls.

```tact
// If at least some entries are known in advance, prefer doing this
let myMap: map<Int as uint8, Int as uint16> = map<Int as uint8, Int as uint16> {
    1: 100,
    2: 200,
};

// Over this
let myMap2: map<Int as uint8, Int as uint16> = emptyMap();
myMap2.set(1, 100);
myMap2.set(2, 200);

// Because maps composed either way are equivalent
myMap == myMap2; // true
```

Notice that keys and values of the [`Int{:tact}`][int] type must be defined with [storage annotations via `as{:tact}` keyword](/book/integers#serialization).

```tact
let smartMoney: map<Int as uint8, Int as coins> = map<Int as uint8, Int as coins> {};

// Notice that annotations are checked and
let tryAndSerializeMe = map<Int as uint1, Int as uint8> {
    1: 100,
    2: 200, // COMPILATION ERROR! bitLength is too small
};

// If you explicitly specify the type of ascription in the let statement,
// it should exactly match the one in the map literal, or it will not compile.
let nope: map<Int as uint8, Int as coins> = map<Int as int257, Int as varuint32> {};
//                                          ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                                          COMPILATION ERROR! Type mismatch
```

When using the same key for the multiple entries, the last occurrence of each key-value pair takes precedence. That is, if there are multiple entries with the same key, only the last one will be used.

```tact
let allTheSame: map<Int as int16, Int as int16> = map<Int as int16, Int as int16> {
    1: 100,
    1: 200,
    1: 300,
    1: 400,
};
allTheSame.get(1)!!; // 400
```

Both keys and values can be arbitrary compile-time expressions as long as their resulting types match the respective key-value types of the map literal.

```tact
fun getExchangesList(): map<Address, Cell> {
    return map<Address, Cell> {
        address("UQD5vcDeRhwaLgAvralVC7sJXI-fc2aNcMUXqcx-BQ-OWi5c"): "One Known eXchange".asComment(),
        address("UQABGo8KCza3ea8DNHMnSWZmbRzW-05332eTdfvW-XDQEmnJ"): "yRacket".asComment(),
    };
}
```

:::note

  Support for runtime initialization values that are not resolved at [compile-time](/ref/core-comptime) is planned for future Tact releases.

:::

### Set values, `.set()` {#set}

```tact
// K and V correspond to the key and value types of the given map
extends mutates fun set(self: map<K, V>, key: K, val: V?);
```

To set or replace the value under a key, call the `.set(){:tact}` [method](/book/functions#extensions), which is accessible for all maps.

```tact
// Empty map
let fizz: map<Int, Int> = emptyMap();

// Setting a couple of values under different keys
fizz.set(7, 7);
fizz.set(42, 42);

// Overriding one of the existing key-value pairs
fizz.set(7, 68); // key 7 now points to value 68
```

### Get values, `.get()` {#get}

```tact
// K and V correspond to the key and value types of the given map
extends fun get(self: map<K, V>, key: K): V?;
```

You can check if a key is found in the map by calling the `.get(){:tact}` [method](/book/functions#extensions), which is accessible for all maps. This will return [`null{:tact}`](/book/optionals) if the key is missing or the value if the key is found.

```tact
// Empty map
let fizz: map<Int, Int> = emptyMap();

// Setting a value
fizz.set(68, 0);

// Getting the value by its key
let gotButUnsure: Int? = fizz.get(68);          // returns Int or null, therefore the type is Int?
let mustHaveGotOrErrored: Int = fizz.get(68)!!; // explicitly asserting that the value must not be null,
                                                // which may crash at runtime if the value is, in fact, null

// Alternatively, we can check for the key in an if statement
if (gotButUnsure != null) {
    // Hooray, let's use !! without fear now and cast Int? to Int
    let definitelyGotIt: Int = fizz.get(68)!!;
} else {
    // Do something else...
}
```

### Replace values, `.replace()` {#replace}

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
// K and V correspond to the key and value types of the given map
extends mutates fun replace(self: map<K, V>, key: K, val: V?): Bool;
```

To replace the value associated with a key, if such a key exists, use the `.replace(){:tact}` [method](/book/functions#extensions). It returns `true{:tact}` upon successful replacement and `false{:tact}` otherwise.

```tact
// Empty map
let fizz: map<Int, Int> = emptyMap();

// Setting a couple of values under different keys
fizz.set(7, 70);
fizz.set(42, 42);

// Overriding one of the existing key-value pairs
let replaced1 = fizz.replace(7, 68); // key 7 now points to value 68
replaced1; // true

// Trying to replace the value of a non-existing key does nothing
let replaced2 = fizz.replace(8, 68); // no key 8, so nothing was altered
replaced2; // false
```

If the given value is [`null{:tact}`](/book/optionals) and the key exists, the entry is deleted from the map.

```tact
// Empty map
let fizz: map<Int, Int> = emptyMap();

// Setting a couple of values under different keys
fizz.set(7, 70);
fizz.set(42, 42);

// Overriding one of the existing key-value pairs
let replaced1 = fizz.replace(7, null); // the entry under key 7 is now deleted
replaced1; // true

// Trying to replace the value of a non-existing key does nothing
let replaced2 = fizz.replace(8, null); // no key 8, so nothing was altered
replaced2; // false
```

### Replace and get old value, `.replaceGet()` {#replaceget}

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
// K and V correspond to the key and value types of the given map
extends mutates fun replaceGet(self: map<K, V>, key: K, val: V?): V?;
```

Like [`.replace()`](#replace), but instead of returning a [`Bool{:tact}`](/book/types#booleans), it returns the old (pre-replacement) value on a successful replacement and [`null{:tact}`](/book/optionals) otherwise.

```tact
// Empty map
let fizz: map<Int, Int> = emptyMap();

// Setting a couple of values under different keys
fizz.set(7, 70);
fizz.set(42, 42);

// Overriding one of the existing key-value pairs
let oldVal1 = fizz.replaceGet(7, 68); // key 7 now points to value 68
oldVal1; // 70

// Trying to replace the value of a non-existing key-value pair will do nothing
let oldVal2 = fizz.replaceGet(8, 68); // no key 8, so nothing was altered
oldVal2; // null
```

If the given value is [`null{:tact}`](/book/optionals) and the key exists, the entry will be deleted from the map.

```tact
// Empty map
let fizz: map<Int, Int> = emptyMap();

// Setting a couple of values under different keys
fizz.set(7, 70);
fizz.set(42, 42);

// Overriding one of the existing key-value pairs
let oldVal1 = fizz.replaceGet(7, null); // the entry under key 7 is now deleted
oldVal1; // 70

// Trying to replace the value of a non-existing key-value pair will do nothing
let oldVal2 = fizz.replaceGet(8, null); // no key 8, so nothing was altered
oldVal2; // null
```

### Delete entries, `.del()` {#del}

```tact
// K and V correspond to the key and value types of the given map
extends mutates fun del(self: map<K, V>, key: K): Bool;
```

To delete a single key-value pair (a single entry), use the `.del(){:tact}` [method](/book/functions#extensions). It returns `true{:tact}` in the case of successful deletion and `false{:tact}` otherwise.

```tact
// Empty map
let fizz: map<Int, Int> = emptyMap();

// Setting a couple of values under different keys
fizz.set(7, 123);
fizz.set(42, 321);

// Deleting one of the keys
let deletionSuccess: Bool = fizz.del(7); // true, because the map contained the entry under key 7
fizz.del(7);                             // false, because the map no longer has an entry under key 7

// Note that assigning the `null` value to a key when using the `.set()` method
//   is equivalent to calling `.del()`, although this approach is much less descriptive
//   and is generally discouraged:
fizz.set(42, null); // the entry under key 42 is now deleted
```

To delete all the entries from the map, re-assign the map using the `emptyMap(){:tact}` function:

```tact
// Empty map
let fizz: map<Int, Int> = emptyMap();

// Setting a couple of values under different keys
fizz.set(7, 123);
fizz.set(42, 321);

// Deleting all of the entries at once
fizz = emptyMap();
fizz = null; // identical to the previous line, but less descriptive
```

With this approach, all previous entries of the map are completely discarded from the contract, even if the map was declared as a persistent state variable. As a result, assigning maps to `emptyMap(){:tact}` **does not** incur any hidden or sudden [storage fees](https://docs.ton.org/develop/smart-contracts/fees#storage-fee).

### Check if entry exists, `.exists()` {#exists}

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
// K and V correspond to the key and value types of the given map
extends fun exists(self: map<K, V>, key: K): Bool;
```

The `.exists(){:tact}` [method](/book/functions#extensions) on maps returns `true{:tact}` if a value under the given key exists in the map and `false{:tact}` otherwise.

```tact
let fizz: map<Int, Int> = emptyMap();
fizz.set(0, 0);

if (fizz.exists(2 + 2)) { // false
    dump("Something doesn't add up!");
}

if (fizz.exists(1 / 2)) { // true
    dump("I told a fraction joke once. It was half funny.");
}

if (fizz.get(1 / 2) != null) { // also true, but consumes more gas
    dump("Gotta pump more!");
}
```

:::note

  Calling `m.exists(key){:tact}` is more gas-efficient than executing `m.get(key) != null{:tact}`, although both approaches yield the same results.

:::

### Check if empty, `.isEmpty()` {#isempty}

```tact
// K and V correspond to the key and value types of the given map
extends fun isEmpty(self: map<K, V>): Bool;
```

The `.isEmpty(){:tact}` [method](/book/functions#extensions) on maps returns `true{:tact}` if the map is empty and `false{:tact}` otherwise:

```tact
let fizz: map<Int, Int> = emptyMap();

if (fizz.isEmpty()) {
    dump("Empty maps are empty, duh!");
}

// Note that comparing the map to `null` behaves the same as the `.isEmpty()` method,
// although such a direct comparison is much less descriptive and is generally discouraged:
if (fizz == null) {
    dump("Empty maps are null, which isn't obvious");
}
```

### Compare with `.deepEquals()` {#deepequals}

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/>
<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
// K and V correspond to the key and value types of the given map
extends fun deepEquals(self: map<K, V>, other: map<K, V>): Bool;
```

The `.deepEquals(){:tact}` [method](/book/functions#extensions) on maps returns `true{:tact}` if all entries of the map match corresponding entries of another map, ignoring possible differences in the [underlying serialization logic][hashmap]. Returns `false{:tact}` otherwise.

```tact
let fizz: map<Int, Int> = emptyMap();
let buzz: map<Int, Int> = emptyMap();

fizz.set(1, 2);
buzz.set(1, 2);

fizz.deepEquals(buzz); // true
fizz == buzz;          // true, and uses much less gas to compute
```

Using `.deepEquals(){:tact}` is very important in cases where a map comes from a third-party source that doesn't provide any guarantees about the [serialization layout][hashmap]. For one such example, consider the following code:

```typescript title="some-typescript-code.ts"
// First map, with long labels
const m1 = beginCell()
    .storeUint(2, 2) // long label
    .storeUint(8, 4) // key length
    .storeUint(1, 8) // key
    .storeBit(true)  // value
    .endCell();

// Second map, with short labels
const m2 = beginCell()
    .storeUint(0, 1)           // short label
    .storeUint(0b111111110, 9) // key length
    .storeUint(1, 8)           // key
    .storeBit(true)            // value
    .endCell();
```

Here, both maps are formed manually and both contain the same key-value pair. If you were to send both of these maps in a message to a Tact contract and then compare them with `.deepEquals(){:tact}` and the [equality operator `=={:tact}`](/book/operators#binary-equality), the former would produce `true{:tact}` because both maps have the same entry, while the latter would produce `false{:tact}` as it performs only a shallow comparison of map hashes, which differ since the maps are serialized differently.

:::note

  This function is very gas expensive, and for the majority of cases it will be sufficient to use the shallow comparison via the [equality `=={:tact}`](/book/operators#binary-equality) or [inequality `!={:tact}`](/book/operators#binary-equality) operators.

:::

### Convert to a `Cell`, `.asCell()` {#ascell}

```tact
// K and V correspond to the key and value types of the given map
extends fun asCell(self: map<K, V>): Cell?;
```

To cast maps back to the [underlying](#low-level-representation) [`Cell{:tact}`][cell] type, use the `.asCell(){:tact}` [method](/book/functions#extensions). Since maps are initialized to `null{:tact}`, calling `.asCell(){:tact}` on a map with no values assigned will return `null{:tact}` and **not** an empty [`Cell{:tact}`][cell].

As an example, this method is useful for sending small maps directly in the body of a reply:

```tact
contract Example {
    // Persistent state variables
    fizz: map<Int, Int>; // our map

    // Constructor (initialization) function of the contract
    init() {
        // Setting a bunch of values
        self.fizz.set(0, 3);
        self.fizz.set(1, 14);
        self.fizz.set(2, 15);
        self.fizz.set(3, 926);
        self.fizz.set(4, 5_358_979_323_846);
    }

    // Internal message receiver, which responds to empty messages
    receive() {
        // Here we're converting the map to a Cell and making a reply with it
        self.reply(self.fizz.asCell()!!); // explicitly asserting that the map isn't null
    }
}
```

### Traverse over entries {#traverse}

To iterate over map entries, there is a [`foreach{:tact}`](/book/statements#foreach-loop) loop statement:

```tact {9-11}
// Empty map
let fizz: map<Int, Int> = emptyMap();

// Setting a couple of values under different keys
fizz.set(42, 321);
fizz.set(7, 123);

// Iterating in sequential order: from the smallest keys to the biggest ones
foreach (key, value in fizz) {
    dump(key); // Will dump 7 on the first iteration, then 42 on the second
}
```

Read more about it: [`foreach{:tact}` loop in Book→Statements](/book/statements#foreach-loop).

Note that it is also possible to use maps as simple arrays if you define a `map<Int, V>{:tact}` with an [`Int{:tact}`][int] type for the keys, any allowed `V{:tact}` type for the values, and keep track of the number of items in a separate variable:

```tact
contract Iteration {
    // Persistent state variables
    counter: Int as uint32;    // Counter of map entries, serialized as a 32-bit unsigned integer
    record: map<Int, Address>; // Int to Address map

    // Constructor (initialization) function of the contract
    init() {
        self.counter = 0; // Setting the self.counter to 0
    }

    // Internal message receiver, which responds to a String message "Add"
    receive("Add") {
        // Get the Context struct
        let ctx: Context = context();
        // Set the entry: counter Int as the key, ctx.sender Address as the value
        self.record.set(self.counter, ctx.sender);
        // Increase the counter
        self.counter += 1;
    }

    // Internal message receiver, which responds to a String message "Send"
    receive("Send") {
        // Loop until reaching the value of self.counter (over all the self.record entries)
        let i: Int = 0; // Declare i as usual for loop iterations
        while (i < self.counter) {
            send(SendParameters {
                bounce: false,              // Do not bounce back this message
                to: self.record.get(i)!!,   // Set the sender address, knowing that key i exists in the map
                value: ton("0.0000001"),    // 100 nanoToncoin (nano-tons)
                mode: SendIgnoreErrors,     // Send ignoring any transaction errors
                body: "SENDING".asComment() // String "SENDING" converted to a Cell as a message body
            });
            i += 1; // Don't forget to increase i
        }
    }

    // Getter function for obtaining the value of self.record
    get fun map(): map<Int, Address> {
        return self.record;
    }

    // Getter function for obtaining the value of self.counter
    get fun counter(): Int {
        return self.counter;
    }
}
```

It's often useful to set an upper-bound restriction on such maps, so that you [don't hit the limits](#limits-and-drawbacks).

:::caution

  Note that manually keeping track of the number of items or checking the length of such maps is very error-prone and generally discouraged. Instead, try to wrap your map into a [struct][struct] and define [extension functions](/book/functions#extensions) on it. See an example in the Cookbook: [How to emulate an array using a map wrapped in a struct](/cookbook/data-structures#array).

:::

:::note

  See other examples of map usage in the Cookbook:\
  [How to emulate a stack using a map wrapped in a struct](/cookbook/data-structures#stack)\
  [How to emulate a circular buffer using a map wrapped in a struct](/cookbook/data-structures#circular-buffer)

:::

## Limits and drawbacks

While maps can be convenient to work with on a small scale, they cause a number of issues if the number of items is unbounded and the map significantly grows in size:

* As the upper bound of the smart contract state size is around $65\,000$ items of type [`Cell{:tact}`][cell], it constrains the storage limit of maps to about $30\,000$ key-value pairs for the whole contract.

* The more entries you have in a map, the higher [compute fees](https://docs.ton.org/develop/howto/fees-low-level#computation-fees) you will incur. Thus, working with large maps makes compute fees difficult to predict and manage.

* Using a large map in a single contract does not allow distributing its workload. Hence, this can significantly degrade overall performance compared to using a smaller map along with multiple interacting smart contracts.

To resolve such issues, you can set an upper-bound restriction on a map as a constant and check against it every time you set a new value in the map:

```tact
contract Example {
    // Declare a compile-time constant upper-bound for our map
    const MaxMapSize: Int = 42;

    // Persistent state variables
    arr: map<Int, Int>; // "array" of Int values as a map
    arrLength: Int = 0; // length of the "array", defaults to 0

    // Internal function for pushing an item to the end of the "array"
    fun arrPush(item: Int) {
        if (self.arrLength >= self.MaxMapSize) {
            // Do something, for example, stop the operation
        } else {
            // Proceed with adding a new item
            self.arr.set(self.arrLength, item);
            self.arrLength += 1;
        }
    }
}
```

If you still need a large or unbounded (infinitely large) map, it is better to architect your smart contracts according to the [asynchronous and actor-based model of TON blockchain](https://docs.ton.org/learn/overviews/ton-blockchain). That is, use contract sharding and essentially make the entire blockchain part of your map(s).

{/*
  TODO: Add reference to sharding page as per: https://github.com/tact-lang/tact-docs/issues/155
*/}

[p]: /book/types#primitive-types
[int]: /book/integers
[cell]: /book/cells#cells
[struct]: /book/structs-and-messages#structs
[message]: /book/structs-and-messages#messages

[hashmap]: https://docs.ton.org/develop/data-formats/tl-b-types#hashmap
[tvm]: https://docs.ton.org/learn/tvm-instructions/tvm-overview



================================================
FILE: docs/src/content/docs/book/message-mode.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/book/message-mode.mdx
================================================
---
title: Message mode
description: "Messages are sent with the mode param of the struct SendParameters. It's an Int value, which is combined from base modes and optional flags, which are also Int values"
---

import { Badge } from '@astrojs/starlight/components';

As previously mentioned, messages sent via the [`send(){:tact}`](/ref/core-send#send) function utilize the `mode` parameter of the `SendParameters{:tact}` structure. The `mode` is an [`Int{:tact}`][int] value, which is combined from base modes and optional flags, which are also [`Int{:tact}`][int] values.

It's possible to use raw [`Int{:tact}`][int] values and manually provide them for the `mode`, but for your convenience there is a set of constants you may use to easily construct the compound `mode`. Take a look at the following tables for more information on base modes and optional flags.

Note that there are other [message-sending functions](/book/send#message-sending-functions) — they do not use the `SendParameters{:tact}` [struct](/book/structs-and-messages#structs), but accept the `mode` as one of their parameters.

## Base modes

Mode value | Constant name                 | Description
---------: | :---------------------------- | -----------
$0$        | <Badge text="Since Tact 1.6" variant="tip"/> `SendDefaultMode{:tact}` | Ordinary message (default).
$64$       | `SendRemainingValue{:tact}`   | Carries all the remaining value of the inbound message in addition to the value initially indicated in the new message.
$128$      | <Badge text="Use with caution" title="Careless use can result in a total balance loss" variant="danger"/> `SendRemainingBalance{:tact}` | Carries **all the remaining balance** of the current smart contract instead of the value originally indicated in the message.
$1024$     | <Badge text="Since Tact 1.5" variant="tip"/> `SendOnlyEstimateFee{:tact}` | Doesn't send the message, only estimates the forward fees if the [message-sending function](/book/send#message-sending-functions) computes these.

The base mode `SendRemainingValue{:tact}` does **not** take previous actions into account, i.e., it doesn't recalculate the remaining value of the incoming message based on previously sent messages or actions performed during the [action phase](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases).

Unlike `SendRemainingValue{:tact}`, the base mode `SendRemainingBalance{:tact}` always calculates the current value of the contract balance, which can help solve problems with [complex outbound message processing](/book/send#outbound-message-processing).

However, be **very** careful when using `SendRemainingBalance{:tact}`, because it works with the balance of the entire contract, and any mistake with it can lead to a total loss of funds.

## Optional flags

Flag value | Constant name                        | Description
---------: | :----------------------------------- | -----------
$+1$       | ~~`SendPayGasSeparately{:tact}`~~    | <Badge text="Deprecated since Tact 1.6.5" variant="tip"/><p/> Use `SendPayFwdFeesSeparately{:tact}` instead.
$+1$       | `SendPayFwdFeesSeparately{:tact}`    | Pay [forward fees][fwdfee] separately from the message value.
$+2$       | `SendIgnoreErrors{:tact}`            | Ignore any errors arising while processing this message during the action phase.
$+16$      | `SendBounceIfActionFail{:tact}`      | Bounce the transaction in case of any errors during the action phase. Has no effect if flag $+2$, `SendIgnoreErrors{:tact}`, is used.
$+32$      | `SendDestroyIfZero{:tact}`           | The current account (contract) will be destroyed if its resulting balance is zero. This flag is often used with mode $128$, `SendRemainingBalance{:tact}`.

Messages that are sent with the optional flag `SendPayFwdFeesSeparately{:tact}` and with their Toncoin `value` explicitly set to 0 will not carry any Toncoin with them, and thus, will not be able to bounce back if there would be an error in the transaction processing them on the recipient side.

## Combining modes with flags

To create the [`Int{:tact}`][int] value for the `mode` field of `SendParameters{:tact}`, you simply combine a base mode with optional flags using the [bitwise OR](/book/operators#binary-bitwise-or) operation.

For example, if you want to send a regular message and pay transfer fees separately, use the default mode $0$ and add flag $+1$ to obtain `mode = 1`, which is equivalent to using the constant `SendPayFwdFeesSeparately{:tact}`.

Alternatively, if you want to send the entire contract balance and destroy it immediately, use mode $128$ and add flag $+32$ to get `mode = 160`, which is equivalent to `SendRemainingBalance | SendDestroyIfZero{:tact}`.

Here's how the latter example would look in code:

```tact
let to: Address = address("...");
let value: Int = ton("1");
send(SendParameters {
    to: to,
    value: value,
    mode: SendRemainingBalance | SendDestroyIfZero,
    body: "Hello, World!".asComment(),
});
```

Note that there can be only **one** [base mode](#base-modes), but the number of [optional flags](#optional-flags) may vary: you can use all, none, or only some of them.

:::caution

  While adding ([`+{:tact}`](/book/operators#binary-add)) base modes together with optional flags is possible, it is discouraged due to the possibility of obtaining incorrect values. Instead, use the [bitwise OR `|{:tact}`](/book/operators#binary-bitwise-or), as it is specifically designed for correctly combining flags and performing bit manipulations of the `mode`.

:::

## Functions with implicit mode

Some [message-sending functions](/book/send#message-sending-functions) do not allow setting a mode by passing an argument. This is because their internal logic requires a specific fixed set of modes to be used instead:

* [`emit(){:tact}`](/ref/core-send#emit) sends a message with the `SendDefaultMode{:tact}` ($0$).
* [`self.reply(){:tact}`](/ref/core-base#self-reply), [`self.notify(){:tact}`](/ref/core-base#self-notify), and [`self.forward(){:tact}`](/ref/core-base#self-forward) all use the `SendRemainingValue{:tact}` mode unless the [`self.storageReserve{:tact}`](/ref/core-base#self-storagereserve) constant is overridden to be greater than $0$, in which case they attempt to use the `SendRemainingBalance{:tact}` mode.

[int]: /book/integers

[fwdfee]: https://docs.ton.org/develop/howto/fees-low-level#forward-fees



================================================
FILE: docs/src/content/docs/book/operators.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/book/operators.mdx
================================================
---
title: Operators
description: "This page lists all the operators in Tact in decreasing order of their precedence, with examples of usage"
prev:
  link: /book/exit-codes
  label: Exit codes
---

Almost every contract operates on data: transforming some values into others. The scope may vary, but operators lie at the core of such modifications.

This page lists all the operators in Tact in decreasing order of their [precedence](#precedence), with examples of usage.

:::note

  Note that there are no implicit type conversions in Tact, so operators can't be used to, say, add values of different types or compare them in terms of equality without explicitly casting them to the same type. That is done with certain functions from the standard library. See [`Int.toString(){:tact}`](/ref/core-strings#inttostring) for an example of such a function.

:::

## Table of operators {#table}

The following table lists operators in order of decreasing [precedence](#precedence), from highest to lowest.

Brief description | Operators
:---------------- | :--------
Parentheses       | [`(){:tact}`][paren]
Unary postfix     | [`!!{:tact}`][nna]
Unary prefix      | [`+{:tact}`][plus] &nbsp; [`-{:tact}`][neg] &nbsp; [`!{:tact}`][inv] &nbsp; [`~{:tact}`][b-not]
Multiplicative    | [`*{:tact}`][mul] &nbsp; [`/{:tact}`][div] &nbsp; [`%{:tact}`][mod]
Additive          | [`+{:tact}`][add] &nbsp; [`-{:tact}`][sub]
Shift             | [`>>{:tact}`][shr] &nbsp; [`<<{:tact}`][shl]
Relational        | [`>{:tact}`][gt] &nbsp; [`>={:tact}`][ge] &nbsp; [`<{:tact}`][lt] &nbsp; [`<={:tact}`][le]
Equality          | [`=={:tact}`][eq] &nbsp; [`!={:tact}`][eq]
Bitwise AND       | [`&{:tact}`][b-and]
Bitwise XOR       | [`^{:tact}`][b-xor]
Bitwise OR        | [`\|{:tact}`][b-or]
Logical AND       | [`&&{:tact}`][l-and]
Logical OR        | [`\|\|{:tact}`][l-or]
Ternary           | [`?:{:tact}`][ternary]
Assignment        | [`={:tact}`][assign] and [all augmented assignment operators](#augmented-assignment)

[paren]: #parentheses

[nna]: #unary-non-null-assert
[plus]: #unary-plus
[neg]: #unary-negate
[inv]: #unary-inverse
[b-not]: #unary-bitwise-not

[mul]: #binary-multiply
[div]: #binary-divide
[mod]: #binary-modulo

[add]: #binary-add
[sub]: #binary-subtract

[shr]: #binary-bitwise-shift-right
[shl]: #binary-bitwise-shift-left

[gt]: #binary-greater
[ge]: #binary-greater-equal
[lt]: #binary-less
[le]: #binary-less-equal

[eq]: #binary-equality

[b-and]: #binary-bitwise-and
[b-xor]: #binary-bitwise-xor
[b-or]: #binary-bitwise-or

[l-and]: #binary-logical-and
[l-or]: #binary-logical-or

[ternary]: #ternary

[assign]: #assignment

## Precedence

All operators on this page are given in order of decreasing precedence, from highest to lowest. Precedence is used to determine which operator should be considered in a particular situation. Whenever ambiguity arises, Tact prefers operators with higher precedence over those with lower precedence.

For example, the minus sign (`-{:tact}`) may be considered either a subtraction operator or a negation operator, which reverses the sign of the expression from plus to minus or vice versa. As the latter has a higher precedence over the former, in cases of ambiguity between the two, Tact will first consider `-{:tact}` as a negation operator. Only if that interpretation does not make sense for the given expression will Tact consider it as a subtraction operator.

Consider the following code:

```tact
5 + -5; // here, the minus sign would be viewed as a negation operator
5 -5;   // while here it would be viewed as a subtraction operator, despite formatting
```

Even though this example may be simple, neglecting precedence rules can often lead to confusing situations with operators. The correct order of operations can be ensured by wrapping every operation in [parentheses](#parentheses), since parentheses have the highest precedence of all expressions and operators.

## Parentheses, `()` {#parentheses}

Parentheses (also called round brackets, `(){:tact}`) are more punctuation symbols than actual operators, but their [precedence](#precedence) is higher than the precedence of any other operator. Use parentheses to override the order of operations:

```tact
5 * 5 - 2;   // 23
5 * (5 - 2); // 15
```

:::note

  The current maximum allowed nesting level of expressions is 83. An attempt to write a deeper expression will result in a compilation error:

  ```tact
  fun elegantWeaponsForCivilizedAge(): Int {
      return
      ((((((((((((((((((((((((((((((((
          ((((((((((((((((((((((((((((((((
              (((((((((((((((((((( // 84 parens, compilation error!
                  42
              ))))))))))))))))))))
          ))))))))))))))))))))))))))))))))
      ))))))))))))))))))))))))))))))));
  }
  ```

:::

## Unary

Unary here means that they are applied only to one operand of the given expression. All unary operators, except for the [non-null assertion](#unary-non-null-assert), have the same [precedence](#precedence).

Unary operators can be one of two types:

* Prefix — placed before the expression.
* Postfix (or suffix) — placed after the expression.

### Non-null assert, `!!` {#unary-non-null-assert}

The unary double-exclamation mark (_non-null assertion_) operator `!!{:tact}` is a postfix operator that enforces non-`null{:tact}` values and allows direct access to the value of the optional variable if it's not `null{:tact}`. Otherwise, it raises a compilation error if the compiler can track it, and if not, throws an exception with [exit code 128](/book/exit-codes#128): `Null reference exception`. It can be applied to any optional variable regardless of its non-`null{:tact}` type.

:::note

  Read more about optional variables and fields here: [Optionals](/book/optionals)

:::

### Plus, `+` {#unary-plus}

The unary plus sign operator `+{:tact}` is a prefix operator that does not alter the value it is applied to. Essentially, it works similar to an [identity function](https://en.wikipedia.org/wiki/Identity_function), but it can only be applied to values of type [`Int{:tact}`][int]:

```tact
let two: Int = +2;
+ two;     // 2
+(+(+2));  // any number of applications gives back the original value, which is 2
- + - two; // 2
+ - + two; // -2
```

### Negate, `-` {#unary-negate}

The unary minus sign (_negation_) operator `-{:tact}` is a prefix operator, which reverses the sign of the expression. It can only be applied to values of type [`Int{:tact}`][int]:

```tact
let five: Int = 5;
five + -five; // here, the minus sign is a negation operator, not a subtraction operator
-(-1);        // double application gives back the original value, which is 1
--1;          // 1
```

### Inverse, `!` {#unary-inverse}

The unary exclamation mark (_inversion_) operator `!{:tact}` is a prefix operator, which inverts the boolean value of the expression—changing `true{:tact}` to `false{:tact}`, and vice versa. It can only be applied to values of type [`Bool{:tact}`][bool]:

```tact
let iLikeTact: Bool = true;
!iLikeTact; // false
!false;     // true
!(!false);  // false
!!false;    // false
```

### Bitwise NOT, `~` {#unary-bitwise-not}

The unary tilde (_bitwise NOT_) operator `~{:tact}` is a prefix operator, which inverts or _flips_ each bit in the binary representation of the expression — changing each $1$ to $0$, and vice versa. It can only be applied to values of type [`Int{:tact}`][int]:

```tact
let answer: Int = 42;
~answer;    // -43
~(~answer); // 42
~(~0);      // 0
~~0;        // 0
```

## Binary

Binary operators are split into several subsections, in order of decreasing [precedence](#precedence). Operators within each subsection have the same [precedence](#precedence) as the subsection itself.

### Multiplication {#binary-multiplication}

Multiply, divide, or obtain a remainder.

#### Multiply, `*` {#binary-multiply}

The binary asterisk (_multiplication_) operator `*{:tact}` is used for multiplication of two values. It can cause [integer overflows](/book/integers#operations).

It can only be applied to values of type [`Int{:tact}`][int]:

```tact
let two: Int = 2;
two * two;         // 4
0 * 1_000_000_000; // 0
-1 * 5;            // -5

pow(2, 255) * pow(2, 255); // build error: integer overflow!
```

#### Divide, `/` {#binary-divide}

The binary slash (_division_) operator `/{:tact}` is used for integer division of two values, which truncates toward zero if the result is positive and away from zero if the result is negative. This is also called [rounding down](https://en.wikipedia.org/wiki/Rounding#Rounding_down) or rounding toward $-∞$.

An attempt to divide by zero results in an error with [exit code 4](/book/exit-codes#4): `Integer overflow`.

It can only be applied to values of type [`Int{:tact}`][int]:

```tact
let two: Int = 2;
two / 2; // 1
two / 1; // 2
-1 / 5;  // -1
-1 / -5; // 0
1 / -5;  // -1
1 / 5;   // 0
6 / 5;   // 1, rounding down
-6 / 5;  // -2, rounding down (toward -∞)
```

:::note

  The following relationship between the division and [modulo](#binary-modulo) operators always holds for the `Int{:tact}` type:

  ```tact
  a / b * b + a % b == a; // true for any Int values of `a` and `b`,
                          //   except when `b` is equal to 0 and we divide `a` by 0,
                          //   which is an attempt to divide by zero resulting in an error
  ```

:::

#### Modulo, `%` {#binary-modulo}

The binary percent sign (_modulo_) operator `%{:tact}` is used for obtaining the modulo of integer division, which must not be confused with obtaining the remainder. For two values with the same sign, modulo and remainder operations are equivalent, but when the operands have different signs, the modulo result always has the same sign as the _divisor_ (the value on the right), while the remainder has the same sign as the _dividend_ (the value on the left). This difference can cause the results to differ by one unit of the _divisor_.

It can only be applied to values of type [`Int{:tact}`][int]:

```tact
let two: Int = 2;
two % 2; // 0
two % 1; // 0

1 % 5;   // 1
-1 % 5;  // 4
1 % -5;  // -4
-1 % -5; // -1
```

The simplest way to avoid confusion between obtaining the modulo and obtaining the remainder is to [use only unsigned integers](/book/security-best-practices#misuse-of-signed-integers). Alternatively, consider using the [`abs(){:tact}`](/ref/core-math#abs) function to ensure non-negative values:

```tact
abs(-1) % abs(-5); // 1
```

:::note

  The following relationship between the [division](#binary-divide) and modulo operators always holds for the `Int{:tact}` type:

  ```tact
  a / b * b + a % b == a; // true for any Int values of `a` and `b`,
                          //   except when `b` is equal to 0 and we divide `a` by 0,
                          //   which is an attempt to divide by zero and results in an error
  ```

:::

:::note

  Did you know that in JavaScript, `%{:tact}` works as a _remainder_ operator and not a _modulo_ operator (as it does in Tact)?\
  [Remainder (%) - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder#description)\
  [Modulo - Wikipedia](https://en.wikipedia.org/wiki/Modulo)

:::

### Addition {#binary-addition}

Add or subtract.

#### Add, `+` {#binary-add}

The binary plus (_addition_) operator `+{:tact}` is used for adding numbers together. Going beyond the maximum value of an [`Int{:tact}`][int] will result in an error with [exit code 4](/book/exit-codes#4): `Integer overflow`.

It can only be applied to values of type [`Int{:tact}`][int]:

```tact
let two: Int = 2;
two + 2; // 4
-1 + 1;  // 0

pow(2, 254) + pow(2, 254);     // 2 * 2^{254}
pow(2, 255) + pow(2, 255);     // build error: integer overflow!
pow(2, 255) - 1 + pow(2, 255); // 2^{256} - 1, maximal value of any integer in Tact!
```

#### Subtract, `-` {#binary-subtract}

The binary minus (_subtraction_) operator `-{:tact}` is used for subtracting numbers from each other. Going beyond the minimum value of an [`Int{:tact}`][int] will result in an error with [exit code 4](/book/exit-codes#4): `Integer overflow`.

It can only be applied to values of type [`Int{:tact}`][int]:

```tact
let two: Int = 2;
two - 2; // 0
-1 - 1;  // -2

pow(2, 254) - pow(2, 254); // 0
pow(2, 255) - pow(2, 255); // 0
pow(2, 256) - pow(2, 256); // build error: integer overflow!
```

### Bitwise shifts {#binary-bitwise-shifts}

Shift bits to the left or to the right.

#### Shift right, `>>` {#binary-bitwise-shift-right}

The binary double greater than (_bitwise shift right_) operator `>>{:tact}` returns an integer whose binary representation is the _left operand_ value shifted by the _right operand_ number of bits to the right. Excess bits shifted off to the right are discarded, and copies of the leftmost bit are shifted in from the left. This operation is also called "sign-propagating right shift" or "arithmetic right shift" because the sign of the resulting number is the same as the sign of the _left operand_. This is a more efficient way to divide the _left operand_ by $2^n$, where $n$ is equal to the _right operand_.

Can only be applied to values of type [`Int{:tact}`][int]:

```tact
let two: Int = 2;
two >> 1;  // 1
-two >> 1; // -1, because >> performs arithmetic shift right,
           // which preserves the sign of the left operand

4 >> 1; // 2
5 >> 1; // 2, due to flooring of integer values

pow(2, 254) >> 254; // 1
```

:::note

  [Bit shifts - Wikipedia](https://en.wikipedia.org/wiki/Bitwise_operation#Bit_shifts)\
  [Bit manipulation - Wikipedia](https://en.wikipedia.org/wiki/Bit_manipulation)

:::

#### Shift left, `<<` {#binary-bitwise-shift-left}

The binary double less-than (_bitwise shift left_) operator `<<{:tact}` returns an integer whose binary representation is the _left operand_ value shifted to the left by the number of bits specified by the _right operand_. Excess bits shifted off from the left are discarded, and zero bits are shifted in from the right. This is a more efficient way to multiply the _left operand_ by $2^n$, where $n$ is equal to the _right operand_. Exceeding the maximum value of an [`Int{:tact}`][int] will result in an error with [exit code 4](/book/exit-codes#4): `Integer overflow`.

Can only be applied to values of type [`Int{:tact}`][int]:

```tact
let two: Int = 2;
two << 1; // 4
1 << 5;   // 1 * 2^5, which is 32
2 << 5;   // 2 * 2^5, which is 64

pow(2, 254) == (1 << 254); // true
pow(2, 254) == 1 << 254; // true, no parentheses needed due to higher precedence of << over ==
pow(2, 255) == 1 << 255; // true, but we're very close to overflow here!
```

:::note

  [Bit shifts - Wikipedia](https://en.wikipedia.org/wiki/Bitwise_operation#Bit_shifts)\
  [Bit manipulation - Wikipedia](https://en.wikipedia.org/wiki/Bit_manipulation)

:::

### Relation {#binary-relation}

Find greater, smaller, or equal values.

#### Greater than, `>` {#binary-greater}

The binary _greater than_ operator `>{:tact}` returns `true{:tact}` if the left operand is greater than the right operand and `false{:tact}` otherwise. Can only be applied to values of type [`Int{:tact}`][int]:

```tact
let two: Int = 2;
two > 2; // false
-1 > -3; // true
```

#### Greater than or equal to, `>=` {#binary-greater-equal}

The binary _greater than or equal to_ operator `>={:tact}` returns `true{:tact}` if the left operand is greater than or equal to the right operand and `false{:tact}` otherwise. Can only be applied to values of type [`Int{:tact}`][int]:

```tact
let two: Int = 2;
two >= 2; // true
-1 >= -3; // true
```

#### Less than, `<` {#binary-less}

The binary _less than_ operator `<{:tact}` returns `true{:tact}` if the left operand is less than the right operand, and `false{:tact}` otherwise. It can only be applied to values of type [`Int{:tact}`][int]:

```tact
let two: Int = 2;
two < 2; // false
-1 < -3; // false
```

#### Less than or equal to, `<=` {#binary-less-equal}

The binary _less than or equal to_ operator `<={:tact}` returns `true{:tact}` if the left operand is less than or equal to the right operand, and `false{:tact}` otherwise. It can only be applied to values of type [`Int{:tact}`][int]:

```tact
let two: Int = 2;
two <= 2; // true
-1 <= -3; // false
```

### Equality and inequality, `==` `!=` {#binary-equality}

The binary equality (_equal_) operator `=={:tact}` checks whether its two operands are _equal_, returning a result of type [`Bool{:tact}`][bool].

The binary inequality (_not equal_) operator `!={:tact}` checks whether its two operands are _not equal_, returning a result of type [`Bool{:tact}`][bool].

Both operators require operands to be of the same type, and neither operator performs implicit type conversions, except for the [`Cell{:tact}`][cell] and [`Slice{:tact}`][slice] types, which are implicitly compared by their hashes.

Both operators can be applied to the following list of types and values:

* [`Int{:tact}`][int]
* [`Bool{:tact}`][bool]
* [`Address{:tact}`][p]
* [`Cell{:tact}`][cell], implicitly compared via [`Cell.hash(){:tact}`](/ref/core-cells#cellhash)
* [`Slice{:tact}`][slice], implicitly compared via [`Slice.hash(){:tact}`](/ref/core-cells#slicehash)
* [`String{:tact}`][p]
* [`map<K, V>{:tact}`](/book/maps), but only if their key and value types are identical
* [Optionals and `null{:tact}` value](/book/optionals)

```tact
// Int:
2 == 3; // false
2 != 3; // true

// Bool:
true == true;  // true
false != true; // true

// Address:
myAddress() == myAddress(); // true
myAddress() != myAddress(); // false

// Cell:
emptyCell() == emptyCell(); // true
emptyCell() != emptyCell(); // false

// Slice:
"A".asSlice() == "A".asSlice(); // true
"A".asSlice() != "A".asSlice(); // false

// String:
"A" == "A"; // true
"A" != "A"; // false

// map<K, V>:
let map1: map<Int, Int> = emptyMap();
let map2: map<Int, Int> = emptyMap();
map1 == map2; // true
map1 != map2; // false

// Optionals and null values themselves
let nullable: Int? = null;
nullable == null; // true
null == null;     // true
nullable != null; // false
null != null;     // false

let anotherNullable: Int? = 5;
nullable == anotherNullable; // false
nullable != anotherNullable; // true
```

:::note

  The binary equality `=={:tact}` and inequality `!={:tact}` operators implicitly compare [maps](/book/maps) by the hashes of their respective [cells][cell] via the [`hash(){:tact}`](/ref/core-cells#cellhash) extension function. While this is acceptable in the majority of cases—since most map serializers behave identically to the serializer from TON Blockchain sources—it is still possible to obtain false-negative results if a map is serialized manually or if the serialization logic is modified in certain libraries.

  If you need to guarantee that compared maps are equal and are willing to pay significantly more gas, use the [`map.deepEquals(){:tact}`](/book/maps#deepequals) function.

:::

### Bitwise AND, `&` {#binary-bitwise-and}

The binary ampersand (_bitwise AND_) operator `&{:tact}` applies a [bitwise AND](https://en.wikipedia.org/wiki/Bitwise_operation#AND), which performs the [logical AND](#binary-logical-and) operation on each pair of corresponding bits of the operands. This is useful when we want to clear selected bits of a number, where each bit represents an individual flag or a boolean state. This makes it possible to "store" up to 257 boolean values per integer, as all integers in Tact are 257-bit signed.

It can only be applied to values of type [`Int{:tact}`][int]:

```tact
let two: Int = 2;
two & 1; // 0
4 & 1;   // 0
3 & 1;   // 1
1 & 1;   // 1

255 & 0b00001111;        // 15
0b11111111 & 0b00001111; // 15
```

:::note

  [Bitwise AND - Wikipedia](https://en.wikipedia.org/wiki/Bitwise_operation#AND)\
  [Bit manipulation - Wikipedia](https://en.wikipedia.org/wiki/Bit_manipulation)

:::

### Bitwise XOR, `^` {#binary-bitwise-xor}

The binary caret (_bitwise XOR_) operator `^{:tact}` applies a [bitwise XOR](https://en.wikipedia.org/wiki/Bitwise_operation#XOR), performing the [logical exclusive OR](https://en.wikipedia.org/wiki/Exclusive_or) operation on each pair of corresponding bits of the operands. The result in each position is $1$ if exactly one of the bits is $1$, or $0$ if both bits are $0$ or both bits are $1$. Thus, it compares two bits, yielding $1$ if the bits are different and $0$ if they are the same.

It is useful for inverting selected bits of an operand (also called toggling or flipping), as any bit can be toggled by "XORing" it with $1$.

It can only be applied to values of type [`Int{:tact}`][int]:

```tact
let two: Int = 2;
two ^ 3; // 1
4 ^ 1;   // 5
3 ^ 1;   // 2
1 ^ 1;   // 0

255 ^ 0b00001111;        // 240
0b11111111 ^ 0b00001111; // 240
```

:::note

  [Bitwise XOR - Wikipedia](https://en.wikipedia.org/wiki/Bitwise_operation#XOR)\
  [Bit manipulation - Wikipedia](https://en.wikipedia.org/wiki/Bit_manipulation)

:::

### Bitwise OR, `|` {#binary-bitwise-or}

The binary bar (_bitwise OR_) operator `|{:tact}` applies a [bitwise OR](https://en.wikipedia.org/wiki/Bitwise_operation#OR), which performs the [logical OR](#binary-logical-or) operation on each pair of corresponding bits of the operands. This is useful when we want to apply a specific [bitmask](https://en.wikipedia.org/wiki/Mask_(computing)).

For example, _bitwise OR_ is commonly used in Tact to [combine base modes with optional flags](/book/message-mode#combining-modes-with-flags) by masking specific bits to $1$ in order to construct a target [message `mode`](/book/message-mode).

Can only be applied to values of type [`Int{:tact}`][int]:

```tact
let two: Int = 2;
two | 1; // 3
4 | 1;   // 5
3 | 1;   // 3
1 | 1;   // 1

255 | 0b00001111;        // 255
0b11111111 | 0b00001111; // 255
```

:::note

  [Bitwise OR - Wikipedia](https://en.wikipedia.org/wiki/Bitwise_operation#OR)\
  [Bit manipulation - Wikipedia](https://en.wikipedia.org/wiki/Bit_manipulation)

:::

### Logical AND, `&&` {#binary-logical-and}

The binary logical AND ([logical conjunction](https://en.wikipedia.org/wiki/Logical_conjunction)) operator `&&{:tact}` returns `true{:tact}` if both operands are `true{:tact}` and `false{:tact}` otherwise. It's short-circuited, meaning that it immediately evaluates the entire expression as `false{:tact}` if the left operand is `false{:tact}`, without evaluating the right one.

Can only be applied to values of type [`Bool{:tact}`][bool]:

```tact
let iLikeTact: Bool = true;
iLikeTact && true;  // true, evaluated both operands
iLikeTact && false; // false, evaluated both operands
false && iLikeTact; // false, didn't evaluate iLikeTact
```

### Logical OR, `||` {#binary-logical-or}

The binary logical OR ([logical disjunction](https://en.wikipedia.org/wiki/Logical_disjunction)) operator `||{:tact}` returns `false{:tact}` only if both operands are `false{:tact}`, and `true{:tact}` otherwise. It is short-circuited, meaning that it immediately evaluates the whole expression as `true{:tact}` if the left operand is `true{:tact}`, without evaluating the right one.

This operator can only be applied to values of type [`Bool{:tact}`][bool]:

```tact
let iLikeSnails: Bool = false;
iLikeSnails || true;  // true, evaluated both operands
iLikeSnails || false; // false, evaluated both operands
true || iLikeSnails;  // true, didn't evaluate iLikeSnails
```

## Ternary, `?:` {#ternary}

The conditional (_ternary_) operator is the only Tact operator that takes three operands: a condition followed by a question mark (`?{:tact}`), then an expression to execute if the condition evaluates to `true{:tact}`, followed by a colon (`:{:tact}`), and finally the expression to execute if the condition evaluates to `false{:tact}`. This operator is frequently used as an alternative to an [`if...else{:tact}`](/book/statements#if-else) statement.

The condition must resolve to type [`Bool{:tact}`][bool]:

```tact
// condition
// ↓
true ? "incredibly so" : "absolutely not"; // "incredibly so"
//     ---------------   ----------------
//     ↑                 ↑
//     |                 alternative, when condition is false
//     |
//     consequence, when condition is true

2 + 2 == 4 ? true : false; // true
```

The ternary operator is the only operator with right associativity, besides [assignment-related ones](#assignment). This means that in ambiguous situations, Tact will prefer the longest matching sequence. In short, this makes bracket-less nesting of ternary operators possible, but only for alternative cases (the part that comes after the colon sign `:{:tact}`):

```tact
// don't need additional parentheses for alternative cases
false ? 1 : (false ? 2 : 3); // 3
false ? 1 : false ? 2 : 3;   // also 3
false ? 1 : true ? 2 : 3;    // 2

// need additional parentheses for consequence cases (parts between ? and :)
false ? (false ? 1 : 2) : 3; // 3
false ? false ? 1 : 2 : 3;   // SYNTAX ERROR!
true  ? (false ? 1 : 2) : 3; // 2
```

## Assignment, `=` {#assignment}

The assignment operator `={:tact}` is used to assign a value to a variable or to a field of a [structure](/book/structs-and-messages). The assignment is a statement, and it does not return a value.

```tact
let someVar: Int = 5;    // assignment operator = is used here...
someVar = 4;             // ...and here
someVar = (someVar = 5); // SYNTAX ERROR!
```

### Augmented assignment

Augmented (or compound) assignment operators such as `+={:tact}` combine an operation with an [assignment](#assignment). An augmented assignment is a statement and does not return a value.

Augmented assignments are semantically equivalent to regular assignments but include an operation:

```tact
let value: Int = 5;

// this:
value += 5;
// is equivalent to this:
value = value + 5;
```

List of augmented assignment operators:

* `+={:tact}`, which uses the [addition operator `+{:tact}`](#binary-add). Can only be applied to values of type [`Int{:tact}`][int].
* `-={:tact}`, which uses the [subtraction operator `-{:tact}`](#binary-subtract). Can only be applied to values of type [`Int{:tact}`][int].
* `*={:tact}`, which uses the [multiplication operator `*{:tact}`](#binary-multiply). Can only be applied to values of type [`Int{:tact}`][int].
* `/={:tact}`, which uses the [division operator `/{:tact}`](#binary-divide). Can only be applied to values of type [`Int{:tact}`][int].
* `%={:tact}`, which uses the [modulo operator `%{:tact}`](#binary-modulo). Can only be applied to values of type [`Int{:tact}`][int].
* `&={:tact}`, which uses the [bitwise AND operator `&{:tact}`](#binary-bitwise-and). Can only be applied to values of type [`Int{:tact}`][int].
* `^={:tact}`, which uses the [bitwise XOR operator `^{:tact}`](#binary-bitwise-xor). Can only be applied to values of type [`Int{:tact}`][int].
* `|={:tact}`, which uses the [bitwise OR operator `|{:tact}`](#binary-bitwise-or). Can only be applied to values of type [`Int{:tact}`][int].
* `&&={:tact}`, which uses the [logical AND operator `&&{:tact}`](#binary-logical-and). Can only be applied to values of type [`Bool{:tact}`][p]. Available since Tact 1.6.
* `||={:tact}`, which uses the [logical OR operator `||{:tact}`](#binary-logical-or). Can only be applied to values of type [`Bool{:tact}`][p]. Available since Tact 1.6.
* `<<={:tact}`, which uses the [bitwise shift left operator `<<{:tact}`](#binary-bitwise-shift-left). Can only be applied to values of type [`Int{:tact}`][int]. Available since Tact 1.6.
* `>>={:tact}`, which uses the [bitwise shift right operator `>>{:tact}`](#binary-bitwise-shift-right). Can only be applied to values of type [`Int{:tact}`][int]. Available since Tact 1.6.

```tact
let value: Int = 5;

// +=
value + 5;         // adds 5
value = value + 5; // adds 5 and assigns result back
value += 5;        // also adds 5 and assigns result back

// -=
value - 5;         // subtracts 5
value = value - 5; // subtracts 5 and assigns result back
value -= 5;        // also subtracts 5 and assigns result back

// *=
value * 5;         // multiplies by 5
value = value * 5; // multiplies by 5 and assigns result back
value *= 5;        // also multiplies by 5 and assigns result back

// /=
value / 5;         // divides by 5
value = value / 5; // divides by 5 and assigns result back
value /= 5;        // also divides by 5 and assigns result back

// %=
value % 5;         // gets modulo by 5
value = value % 5; // gets modulo by 5 and assigns result back
value %= 5;        // also gets modulo by 5 and assigns result back

// &=
value & 5;         // bitwise ANDs with 5
value = value & 5; // bitwise ANDs with 5 and assigns result back
value &= 5;        // also bitwise ANDs with 5 and assigns result back

// ^=
value ^ 5;         // bitwise XORs with 5
value = value ^ 5; // bitwise XORs with 5 and assigns result back
value ^= 5;        // also bitwise XORs with 5 and assigns result back

// |=
value | 5;         // bitwise ORs with 5
value = value | 5; // bitwise ORs with 5 and assigns result back
value |= 5;        // also bitwise ORs with 5 and assigns result back

//
// The following augmented assignment operators are available since Tact 1.6
//

// <<=
value << 5;         // bitwise shifts left by 5
value = value << 5; // bitwise shifts left by 5 and assigns result back
value <<= 5;        // also bitwise shifts left by 5 and assigns result back

// >>=
value >> 5;         // bitwise shifts right by 5
value = value >> 5; // bitwise shifts right by 5 and assigns result back
value >>= 5;        // also bitwise shifts right by 5 and assigns result back

let bValue: Bool = true;

// &&=
bValue && false;          // logically ANDs with false
bValue = bValue && false; // logically ANDs with false and assigns result back
bValue &&= false;         // also logically ANDs with false and assigns result back

// ||=
bValue || true;          // logically ORs with true
bValue = bValue || true; // logically ORs with true and assigns result back
bValue ||= true;         // also logically ORs with true and assigns result back
```

[p]: /book/types#primitive-types
[bool]: /book/types#booleans
[int]: /book/integers
[cell]: /book/cells#cells
[slice]: /book/cells#slices



================================================
FILE: docs/src/content/docs/book/optionals.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/book/optionals.mdx
================================================
---
title: Optionals
description: "Data types that can contain the null value in addition to values of their encapsulated primitive or struct types."
---

As mentioned in the [type system overview](/book/types#optionals), all [primitive types](/book/types#primitive-types), [structs][struct], and [message structs][message] can be made nullable. That is, [variables](/book/statements#let), [function parameters](/book/functions), [contract parameters](/book/contracts#parameters) and [structure fields][structure] of primitive or struct types can hold the special `null{:tact}` value that represents the intentional absence of any other value.

Such data types that may or may not contain the `null{:tact}` value are called _optionals_.

You can make a primitive or struct type into an optional by adding a question mark `?{:tact}` after its type declaration.

```tact
struct StOpt {
    // Optionals as struct fields
    opt: Int?; // Int or null
}

message MsOpt {
    // Optionals as message fields
    opt: StOpt?; // notice how the struct StOpt is used in this definition
}

contract Optionals(
    // Optionals as contract parameters
    opt: Int?,
    address: Address?,
) {
    // Optionals as function parameters
    fun reset(opt: Int?) {
        self.opt = opt;
        self.address = null; // explicit null value
    }

    receive(msg: MsOpt) {
        // Optionals as local variables
        let opt: Int? = 12;

        // Explicit check of the message struct field
        if (msg.opt != null) {
            // Non-null assertion to work with its inner value
            self.reset(msg.opt!!.opt);
        }
    }
}
```

Since [`map<K, V>{:tact}`](/book/maps) and [`bounced<Msg>{:tact}`](/book/bounced) are not primitive or struct types, they cannot be made optional. Furthermore, their inner key-value types (in the case of a map) and the inner [message struct][message] (in the case of a bounced constructor) cannot be optional too.

```tact
// COMPILATION ERROR! Map key types cannot be optional
let myMap: map<Int?, Int> = emptyMap();
//             ~~~~
```

Creating a nested optional type by adding multiple question marks `?{:tact}` is not allowed, as optionals are neither a primitive nor a struct type.

```tact
// COMPILATION ERROR! Nested optional types are not allowed
fun invalidNestedOptional(a: Int??) {}
//                           ~~~~~
```

Optional fields of [structures][structure] that are not defined implicitly hold the `null{:tact}` value by default. That said, optionals as local variables as optionals require initialization.

```tact
struct StOpt {
    // Defaults to null
    nullDef: Int?;
}

fun locVar() {
    // Requires an initial value: either null or a value of the Int type
    let mayBeeBayBee: Int? = null;
}
```

When initializing a new local variable to `null{:tact}` in the [`let{:tact}` statement](/book/statements#let), you must explicitly provide the type ascription as it cannot be inferred.

```tact
let opt: Int? = null;
let myMap: map<Int, Int> = emptyMap(); // = null, since empty maps are nulls
```

You can assign the current value of one optional to another if their types match. However, to access the non-`null{:tact}` value of an optional in an expression, you must use the [non-null assertion operator `!!{:tact}`](/book/operators#unary-non-null-assert).

Attempts to assign or directly access an optional value in an expression will result in a compilation error.

```tact
let opt1: Int? = 42;
let opt2: Int? = 378;
opt1 = opt2; // 378

let notOpt: Int = 42;
notOpt = opt2!!; // opt2 isn't null, so notOpt is 378
notOpt = opt2;   // COMPILATION ERROR! Type mismatch
```

To access the non-`null{:tact}` value of an optional in an expression, you must use the [non-null assertion operator `!!{:tact}`](/book/operators#unary-non-null-assert) to unwrap the value. If you are sure the value is not `null{:tact}` at the time of the assertion, use the `!!{:tact}` operator directly, without prior [`if...else{:tact}`](/book/statements#if-else) checks.

In the general case it is better to explicitly check for `null{:tact}` before asserting its absence. Otherwise, when the value is `null{:tact}`, assertions with `!!{:tact}` operator will result in a compilation error if the compiler can track it at compile-time, or, if it cannot, in an exception with [exit code 128](/book/exit-codes#128): `Null reference exception`.

```tact
fun misplacedCourage(opt: Int?) {
    // `opt` could be null, and the following assertion could throw an exit code 128:
    dump(opt!!);
}
```

## Serialization

When serialized to a [`Cell{:tact}`][cell] or to [contract's persistent state](/book/contracts#variables), optionals occupy no less than one bit and, at most, one bit on top of the size of the wrapped type.

That is, if their value is `null{:tact}`, only a single 0 bit is stored in a [`Builder{:tact}`][builder]. Otherwise, a single 1 bit is stored, followed by the non-`null{:tact}` value.

Deserialization works inversely. First, a single bit is loaded from a [`Slice{:tact}`][slice]. If it is 0, the value is read as `null{:tact}`. If it is 1, then the value is loaded from the following data bits.

```tact
struct Wasp {
    hasSting: Bool?, // 2 bits max: 1 for the optional, 0 or 1 for the boolean
    stingLength: Int?, // 258 bits max: 1 for the optional, 0 or 257 for the integer
}
```

Optionals can have serialization annotations provided after the `as{:tact}` keyword and have all the same serialization options as their encapsulated primitive or struct types. As such, the optional [`Int?{:tact}`](/book/integers) type has the most serialization formats available.

```tact
contract IntResting(
    // Persistent state variables (contract parameters)
    maybeOneByte: Int? as int8, // takes either 1 (when null) or 9 (when not null) bits
    maybeTwoBytes: Int? as int16, // takes either 1 or 17 bits
    maybeCoins: Int? as coins,  // takes either 1 or up to 125 bits, depending on the value
) {
    // ...
}
```

[cell]: /book/cells#cells
[builder]: /book/cells#builders
[slice]: /book/cells#slices
[struct]: /book/structs-and-messages#structs
[message]: /book/structs-and-messages#messages
[structure]: /book/structs-and-messages



================================================
FILE: docs/src/content/docs/book/receive.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/book/receive.mdx
================================================
---
title: Receive messages
description: "The most common type of message is the internal message - a message sent from one contract to another"
prev:
  link: /book/functions
  label: Functions
---

import { Badge } from '@astrojs/starlight/components';

TON is a distributed blockchain, which means that communication between smart contracts is performed by sending and receiving messages. The most common type of message is the _internal message_ — a message sent from one contract (or a wallet) to another.

When processing an incoming message, no other message can interrupt the execution of a smart contract. On top of that, [message-sending functions](/book/send#message-sending-functions) and underlying TVM instructions do not deliver outgoing messages immediately but instead [queue them to be sent after the end of computations](/book/send#outbound-message-processing) in a separate phase of the current transaction. Thus, [reentrancy](https://en.wikipedia.org/wiki/Reentrancy_(computing)) of messages is not possible.

## Receive internal messages

To receive a message of the required type, you need to declare a receiver function. For example, `receive("increment"){:tact}`. This notation means the declaration of a receiver function that will be called when a text with the value `"increment"{:tact}` is sent to the contract. The function body can modify the state of the contract and send messages to other contracts. It is impossible to call a receiver directly. If you need to reuse some logic, you can declare a function and call it from the receiver.

### Empty receiver

This receiver specifically handles internal messages with no contents, i.e., the `null{:tact}` body. Note that as a function, it's own body doesn't have to be empty.

```tact
contract Emptiness() {
    // This receiver handles `null` (empty) message bodies of internal messages.
    receive() {
        // Although you can use this receiver for anything,
        // it's most common to utilize it for deployments and forward excess funds
        // from the incoming message back to the sender's address.
        cashback(sender());
    }
}
```

### Text receivers

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

There are two kinds of text receivers:

* `receive("..."){:tact}` — the exact text receiver that handles specific string comments with the maximum length of 123 bytes
* `receive(str: String){:tact}` — the catch-all string receiver that handles arbitrary string comments

Processing and distinguishing text receivers, e.g., the comment receiver `receive("..."){:tact}` and the string receiver `receive(str: String){:tact}`, costs significantly more gas than [processing binary ones](#binary-receivers), such as `receive(){:tact}` or `receive(msg: MyMessage){:tact}`. Thus, it is recommended to [prefer binary receivers to text receivers](/book/gas-best-practices#prefer-binary-receivers-to-text-receivers).

```tact
contract CertainMD() {
    receive("time changes everything") {
        message(MessageParameters {
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
            body: "Doing things changes things. Not doing things leaves things exactly as they were".asComment(),
        });
    }

    receive(str: String) {
        message(MessageParameters {
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
            body: "Do I get bonus points if I act like I care?".asComment(),
        });
    }
}
```

### Binary receivers

If the message body starts with a recognized [opcode](/book/structs-and-messages#message-opcodes) of 4 non-zero bytes, that internal message will be handled with a corresponding binary receiver `receive(msg: MessageStruct){:tact}` or the catch-all slice receiver `receive(msg: Slice){:tact}`, if there is no binary receiver for that opcode.

```tact
// This message struct overrides its unique id (opcode) with 411,
// which allows message bodies that start with such opcodes
// to be recognized and handled by the respective binary receiver function.
message(411) HandleMe {}

contract Handler() {
    receive(msg: HandleMe) {
        let body = inMsg();
        body.preloadUint(32) == HandleMe.opcode(); // true
    }
}
```

## Wildcard parameters

Naming the parameter of a receiver function with an underscore `_{:tact}` makes its value considered unused and discarded. This is useful when you don't need to inspect the message received and only want it to convey a specific opcode.

```tact
message(42) UniverseCalls {}

contract Example() {
    receive(_: UniverseCalls) {
        // Got a message with opcode 42
        UniverseCalls.opcode(); // 42
    }
}
```

Read more about other common function aspects: [Commonalities on the Functions page](/book/functions#commonalities).

## Processing order

All receiver functions are processed in the order they are listed below. The first receiver that matches the message type processes the message:

* `receive(){:tact}` - called when an empty message is sent to the contract
* `receive("message"){:tact}` - called when a text message with a specific comment is sent to the contract (maximum `"message"{:tact}` length is 123 bytes)
* `receive(str: String){:tact}` - called when an arbitrary text message is sent to the contract
* `receive(msg: MyMessage){:tact}` - called when a binary message of type `MyMessage` is sent to the contract
* `receive(msg: Slice){:tact}` - called when a binary message of unknown type is sent to the contract

For example, an empty message gets processed by `receive(){:tact}` and not by `receive(msg: Slice){:tact}`, because the former occurs before the latter in the above list. Similarly, a message with the specific comment `"message"{:tact}` gets processed by `receive("message"){:tact}` and not by `receive(str: String){:tact}`.

```tact
message MyMessage {
    value: Int;
}

contract MyContract {
    receive() {
        // ...
    }
    receive("message") {
        // ...
    }
    receive(str: String) {
        // ...
    }
    receive(msg: MyMessage) {
        // ...
    }
    receive(msg: Slice) {
        // ...
    }
}
```

In a contract, the order of declaration of receivers has no effect on how receivers process messages. Hence, changing the order of receivers in the above contract produces an equivalent contract.

Contracts are not required to declare receivers for all possible message types. If a contract does not have a receiver for a specific message type, the message will be processed by the next receiver that matches the message type in the receiver execution order list. For example, if we remove the receiver `receive("message"){:tact}` in the above contract, then when a message with the comment `"message"{:tact}` arrives, it will be processed by `receive(str: String){:tact}`. yet, the message with an empty comment `""{:tact}` will be processed by the empty body receiver, `receive(){:tact}`.

Note that the receiver `receive(msg: Slice){:tact}` acts as a fallback that catches all messages that did not match previous receivers in the execution order list. If there is no receiver to process a message type and the fallback receiver `receive(msg: Slice){:tact}` is not declared, the transaction will fail with exit code [130](/book/exit-codes/#130).

## Incoming funds

Receivers accept all incoming funds by default. That is, without explicitly sending a message that will refund spare Toncoin with the [`cashback(){:tact}`](/ref/core-send#cashback) function, the contract will keep all the incoming message value.

```tact
contract ToCashOrNotToCash() {
    receive() {
        // Forward the remaining value in the
        // incoming message back to the sender.
        cashback(sender());
    }

    receive(_: Greed) {
        // Unlike the previous one, this receiver does not return surplus Toncoin,
        // and keeps all the incoming message value minus necessary fees.
    }
}

message Greed {}
```

To check the amount of Toncoin (native coins) the incoming message carries with it, you can use the [`context(){:tact}`](/ref/core-contextstate#context) function and access the `value` field of its resulting [struct](/book/structs-and-messages#structs). Note, however, that the exact value by which the balance will be increased will be less than `context().value{:tact}` since the [compute fee](https://docs.ton.org/v3/documentation/smart-contracts/transaction-fees/fees-low-level#computation-fees) for contract execution will be deducted from this value.

```tact /context\(\).value/
contract WalletV4(
    // ...contract variables...
) {
    // ...
    receive(msg: PluginRequestFunds) {
        require(
            myBalance() - context().value >= msg.amount,
            "The balance is too low to fulfill the plugin request!",
        );
        // ...
    }
}

message(0x706c7567) PluginRequestFunds {
    queryId: Int as uint64;
    amount: Int as coins;
    extra: Cell?;
}
```

## Carry-value pattern

Contracts cannot call each other's [getters](/book/functions#get) or retrieve data from other contracts synchronously. If you were to send the current values of the state variables to another contract, they would almost always become stale by the time the message carrying them is processed at the destination.

To circumvent that, use the carry-value pattern, which involves passing state or data along the chain of required operations rather than attempting to store and retrieve the data in a synchronous fashion. Instead of querying data, each contract in the message chain receives some input, processes it, and passes the result or the new payload to the next contract in the sequence of sent messages. This way, messages work as signals to perform certain actions on or with the sent data.

For example, upon receiving a message request to perform a [Jetton](/cookbook/jettons) transfer from the current owner to the target user's [Jetton Wallet](/cookbook/jettons#jetton-wallet-contract), Jetton Wallet contracts ensure the validity of the request from the standpoint of their current state. If everything is fine, they modify their token balance and always send the deployment message, regardless of whether the target Jetton Wallet exists or not.

That is because it is impossible to obtain confirmation of the contract deployment synchronously. At the same time, sending a deployment message means attaching the [`StateInit{:tact}`](/book/expressions#initof) code and data of the future contract to the regular message and letting the TON Blockchain itself figure out whether the target contract is deployed or not, and discarding that `init` bundle if the destination contract is already deployed.

```tact
/// Child contract per each holder of N amount of given Jetton (token)
contract JettonWallet(
    /// Balance in Jettons.
    balance: Int as coins,

    /// Address of the user's wallet which owns this JettonWallet, and messages
    /// from whom should be recognized and fully processed.
    owner: Address,

    /// Address of the main minting contract,
    /// which deployed this Jetton wallet for the specific user's wallet.
    master: Address,
) {
    /// Registers a binary receiver of the JettonTransfer message body.
    receive(msg: JettonTransfer) {
        // ...prior checks and update of the `self.balance`...

        // Transfers Jetton from the current owner to the target user's JettonWallet.
        // If that wallet does not exist, it is deployed on-chain in the same transfer.
        deploy(DeployParameters {
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: JettonTransferInternal{
                queryId: msg.queryId, // Int as uint64
                amount: msg.amount, // Int as coins
                sender: self.owner, // Address
                responseDestination: msg.responseDestination, // Address?
                forwardTonAmount: msg.forwardTonAmount, // Int as coins
                forwardPayload: msg.forwardPayload, // Slice as remaining
            }.toCell(),
            // Notice that we do not need to explicitly specify the target address,
            // because it will be computed on the fly from the initial package.
            //
            // The `msg.destination` is the regular wallet address of the new owner
            // of those Jettons and not the future address of the target Jetton Wallet itself.
            init: initOf JettonWallet(0, msg.destination, self.master),
        });
    }
}
```

## Contract storage handling

Blockchain keeps each smart contract's code and data in its state. After receiving a message, the contract's storage data is loaded, and once processing in the receiver is complete, a new state of the contract is saved.

The loads and stores are managed by Tact, which implicitly adds relevant code during compilation. That way, the user only needs to think of using receivers to handle message bodies.

As Tact writes relevant code to automatically save the contract's state after the end of each receiver's logic, you can safely skip some of the steps in your code and jump to the end of processing the receiver with the [`return{:tact}` statement](/book/statements#return).

```tact {5}
contract GreedyCashier(owner: Address) {
    receive() {
        // Stop the execution if the message is not from an `owner`.
        if (sender() != self.owner) {
            return;
        }
        // Otherwise, forward excesses back to the sender.
        cashback(sender());
    }
}
```

If the Tact compiler can deduce that a certain receiver does not modify the contract's state, then the storage-saving logic is omitted, and some extra gas is saved as a result.

Furthermore, to make an early exit from the receiver without saving the new contract's state, use the [`throw(0){:tact}`](/ref/core-debug#throw) idiom. It will immediately and successfully terminate the execution of the compute phase of the contract and skip the code generated by Tact to save the contract's state. Conversely, changes to data made before calling `throw(){:tact}` in with this function will be lost unless you manually save them beforehand.

That said, when using the `throw(0){:tact}` idiom, make sure to double-check and test cover your every move so that the contract's data won't become corrupt or inadvertently gone.

```tact {18-20}
// This function manually saves contract data Cell
asm fun customSetData(data: Cell) { c4 POP }

contract WalletV4(
    seqno: Int as uint32,
    // ...other parameters...
) {
    // ...
    external(_: Slice) {
        // ...various prior checks...

        acceptMessage();
        self.seqno += 1;

        // Manually saving the contract's state
        customSetData(self.toCell());

        // And halting the transaction to prevent a secondary save implicitly
        // added by Tact after the main execution logic of the receiver
        throw(0);
    }
}
```



================================================
FILE: docs/src/content/docs/book/security-best-practices.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/book/security-best-practices.mdx
================================================
---
title: Security best practices
description: "Several anti-patterns and potential attack vectors, as well as best practices, that Tact smart contract developers should be aware of"
---

[//]: # (✅❌)

There are several anti-patterns and potential attack vectors that Tact smart contract developers should be aware of. These can affect the security, efficiency, and correctness of the contracts. Below we discuss the do's and don'ts specific to writing and maintaining secure Tact smart contracts.

For a deeper understanding, refer to the following resources:

* [Smart contracts guidelines in TON Docs](https://docs.ton.org/v3/guidelines/smart-contracts/guidelines)
* [Secure Smart Contract Programming in TON Docs](https://docs.ton.org/v3/guidelines/smart-contracts/security/secure-programming)
* [Curated list of awesome TON security resources](https://github.com/Polaristow/awesome-ton-security/blob/main/README.md)

In addition, consider reading the detailed article by CertiK, a Web3 smart contract auditor: [Secure Smart Contract Programming in Tact: Popular Mistakes in the TON Ecosystem](https://www.certik.com/resources/blog/secure-smart-contract-programming-in-tact-popular-mistakes-in-the-ton).

## Sending sensitive data on-chain

The entire smart contract computation is transparent, and if you have confidential values at runtime, they can be retrieved through simple emulation.

##### Do's ✅

Do **not** send or store sensitive data on-chain.

##### Don'ts ❌

```tact
message Login {
    privateKey: Int as uint256;
    signature: Slice;
    data: Slice;
}

contract Test() {
    receive(msg: Login) {
        let publicKey = getPublicKey(msg.privateKey);

        require(checkDataSignature(msg.data, msg.signature, publicKey), "Invalid signature!");
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }
}
```

## Misuse of signed integers

Unsigned integers are safer because they prevent most errors by design, while signed integers can have unpredictable consequences if not used carefully. Therefore, signed integers should be used only when absolutely necessary.

##### Do's ✅

Prefer to use unsigned integers unless signed integers are required.

##### Don'ts ❌

The following is an example of the incorrect use of a signed integer. In the `Vote{:tact}` [Message][message], the type of the `votes` field is `Int as int32{:tact}`, which is a 32-bit signed integer. This can lead to spoofing if an attacker sends a negative number of votes instead of a positive one.

```tact
message Vote { votes: Int as int32 }

contract VoteCounter(
    votes: Int as uint32,
) {
    receive(msg: Vote) {
        self.votes += msg.votes;
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }
}
```

## Invalid throw values

[Exit codes](/book/exit-codes) 0 and 1 indicate normal execution of the compute phase of the transaction. Execution can be unexpectedly aborted by calling a [`throw(){:tact}`](/ref/core-debug#throw) or [similar functions](/ref/core-debug) directly with exit codes 0 and 1. This can make debugging very difficult since such aborted execution would be indistinguishable from a normal one.

##### Do's ✅

Prefer to use the [`require(){:tact}`](/ref/core-debug#require) function to state expectations.

```tact
require(isDataValid(msg.data), "Invalid data!");
```

##### Don'ts ❌

Don't throw 0 or 1 directly.

```tact
throw(0);
throw(1);
```

## Insecure random numbers

Generating truly secure random numbers in TON is challenging. The [`random()`](/ref/core-random#random) function is pseudo-random and depends on [logical time](https://docs.ton.org/develop/smart-contracts/guidelines/message-delivery-guarantees#what-is-a-logical-time). An attacker can predict the randomized number by [brute-forcing](https://en.wikipedia.org/wiki/Brute-force_attack) the logical time in the current block.

##### Do's ✅

* For critical applications, **avoid relying solely on on-chain solutions**.

* Use [`random(){:tact}`](/ref/core-random#random) with randomized logical time to enhance security by making predictions harder for attackers without access to a validator node. Note, however, that it is still **not entirely foolproof**.

* Consider using the **commit-and-disclose scheme**:
1. Participants generate random numbers off-chain and send their hashes to the contract.
2. Once all hashes are received, participants disclose their original numbers.
3. Combine the disclosed numbers (e.g., summing them) to produce a secure random value.

For more details, refer to the [Secure Random Number Generation page in TON Docs](https://docs.ton.org/v3/guidelines/smart-contracts/security/random-number-generation).

##### Don'ts ❌

Don't rely on the [`random(){:tact}`](/ref/core-random#random) function.

```tact
if (random(1, 10) == 7) {
    // ...subsequent logic...
}
```

Don't use randomization in [`external(){:tact}`](/book/external) message receivers, as it remains vulnerable even with randomized logical time.

## Optimized message handling

String parsing from human-friendly formats into machine-readable binary structures should be done **off-chain**. This approach ensures that only optimized and compact messages are sent to the blockchain, minimizing computational and storage costs while avoiding unnecessary gas overhead.

##### Do's ✅

Perform string parsing from human-readable formats into machine-readable binary structures **off-chain** to keep the contract efficient.

```tact
message Sample { parsedField: Slice }

contract Example() {
    receive(msg: Sample) {
        // Process msg.parsedField directly
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }
}
```

##### Don'ts ❌

Avoid parsing strings from human-readable formats into binary structures **on-chain**, as this increases computational overhead and gas costs.

```tact
message Sample { field: String }

contract Example {
    receive(msg: Sample) {
        // Parsing occurs on-chain, which is inefficient
        let parsed = field.fromBase64();
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }
}
```

## Gas limitation

Be careful with the `Out of gas error`. It cannot be handled, so try to pre-calculate the gas consumption for each receiver [using tests](/book/debug#tests) whenever possible. This will help avoid wasting extra gas, as the transaction will fail anyway.

##### Do's ✅

```tact
message Vote { votes: Int as int32 }

contract VoteCounter() {
    const voteGasUsage = 10000; // precompute with tests

    receive(msg: Vote) {
        require(context().value > getComputeFee(self.voteGasUsage, false), "Not enough gas!");
        // ...subsequent logic...
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }
}
```

## Identity validation

Always validate the identity of the sender if your contract logic revolves around trusted senders. This can be done using the [`Ownable{:tact}`](/ref/stdlib-ownable) trait or using [state init](/book/expressions#initof) validation. You can read more about [Jetton validation](/cookbook/jettons#accepting-jetton-transfer) and [NFT validation](/cookbook/nfts#accepting-nft-ownership-assignment).

##### Do's ✅

Use the [`Ownable{:tact}`](/ref/stdlib-ownable) trait.

```tact
import "@stdlib/ownable";

message Inc { amount: Int as uint32 }

contract Counter with Ownable {
    owner: Address;
    val: Int as uint32;

    init() {
        self.owner = address("...SOME ADDRESS...");
        self.val = 0;
    }

    receive(msg: Inc) {
        self.requireOwner();
        self.val += msg.amount;
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }
}
```

##### Don'ts ❌

Do not execute a message without validating the sender's identity!

```tact
contract Jetton {
    myJettonWalletAddress: Address;
    myJettonAmount: Int as coins = 0;

    init(jettonWalletCode: Cell, jettonMasterAddress: Address) {
        self.myJettonWalletAddress = calculateJettonWalletAddress(
            myAddress(),
            jettonMasterAddress,
            jettonWalletCode,
        );
    }

    receive(msg: JettonTransferNotification) {
        // There's no check of the ownership here!
        self.myJettonAmount += msg.amount;
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }
}
```

## Replay protection

Replay protection is a security mechanism that prevents an attacker from reusing a previous message. More information about replay protection can be found on the [External messages page in TON Docs](https://docs.ton.org/develop/smart-contracts/guidelines/external-messages).

##### Do's ✅

To differentiate messages, always include and validate a unique identifier, such as `seqno`. Update the identifier after successful processing to avoid duplicates.

Alternatively, you can implement replay protection similar to the one in the [highload v3 wallet](https://github.com/ton-blockchain/highload-wallet-contract-v3/blob/main/contracts/highload-wallet-v3.func#L60), which is not based on `seqno`.

```tact
message MsgWithSignedData {
    bundle: SignedBundle;
    seqno: Int as uint64;
    rawMsg: Cell;
}

contract Sample(
    publicKey: Int as uint256,
    seqno: Int as uint64,
) {
    external(msg: MsgWithSignedData) {
        require(msg.bundle.verifySignature(self.publicKey), "Invalid signature");
        require(msg.seqno == self.seqno, "Invalid seqno");
        acceptMessage();
        self.seqno += 1;
        sendRawMessage(msg.rawMsg, 0);
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }
}
```

##### Don'ts ❌

Do not rely on signature verification without the inclusion of a sequence number. Messages without replay protection can be resent by attackers because there is nothing to distinguish a valid original message from a replayed one.

```tact
message Msg {
    newMessage: Cell;
    signature: Slice;
}

contract Sample(
    publicKey: Int as uint256,
) {
    external(msg: Msg) {
        require(
            checkDataSignature(msg.toSlice(), msg.signature, self.publicKey),
            "Invalid signature",
        );
        acceptMessage();
        sendRawMessage(msg.newMessage, 0);
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }
}
```

## Preventing front-running with signature verification

In TON blockchain, all pending messages are publicly visible in the mempool.
Front-running can occur when an attacker observes a pending transaction containing a valid signature and quickly submits their own transaction using the same signature before the original transaction is processed.

##### Do's ✅

Include critical parameters like the recipient address (`to`) within the data that is signed. This ensures that the signature is valid only for the intended operation and recipient, preventing attackers from reusing the signature for their benefit. Also, implement replay protection to prevent the same signed message from being used multiple times.

```tact
struct RequestBody {
    to: Address;
    seqno: Int as uint64;
}

message(0x988d4037) Request {
    signature: Slice as bytes64;
    requestBody: RequestBody;
}

contract SecureChecker(
    publicKey: Int as uint256,
    seqno: Int as uint64, // Add seqno for replay protection
) {
    receive(request: Request) {
        // Verify the signature against the reconstructed data hash
        require(checkSignature(request.requestBody.toCell().hash(), request.signature, self.publicKey), "Invalid signature!");

        // Check replay protection
        require(request.requestBody.seqno == self.seqno, "Invalid seqno"); // Assuming external message with seqno
        self.seqno += 1; // Increment seqno after successful processing

        // Ensure the message is sent to the address specified in the signed data
        message(MessageParameters {
            to: request.requestBody.to, // Use the 'to' from the signed request
            value: 0,
            mode: SendRemainingBalance, // Caution: sending the whole balance!
            bounce: false,
            body: "Your action payload here".asComment(), // Example body
        });
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }

    get fun seqno(): Int {
        return self.seqno;
    }
}

```

Remember to also implement [replay protection](#replay-protection) to prevent reusing the same signature even if it's correctly targeted.

##### Don'ts ❌

Do not sign data without including essential context like the recipient address. An attacker could intercept the message, copy the signature, and replace the recipient address in their own transaction, effectively redirecting the intended action or funds.

```tact
message(0x988d4037) Request {
    signature: Slice as bytes64;
    data: Slice as remaining; // 'to' address is not part of the signed data
}

contract InsecureChecker(
    publicKey: Int as uint256,
) {
    receive(request: Request) {
        // The signature only verifies 'request.data', not the intended recipient.
        if (checkDataSignature(request.data.hash(), request.signature, self.publicKey)) {
            // Attacker can see this message, copy the signature, and send their own
            // message to a different 'to' address before this one confirms.
            // The 'sender()' here is the original sender, but the attacker can initiate
            // a similar transaction targeting themselves or another address.
            message(MessageParameters {
                to: sender(), // Vulnerable: recipient isn't verified by the signature
                value: 0,
                mode: SendRemainingBalance, // Caution: sending the whole balance!
                bounce: false,
            });
        }
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }
}
```
:::caution[Sandbox Limitations]
This specific front-running scenario is not reproducible in the `@ton/sandbox` environment due to differences in transaction processing and the absence of a mempool compared to the real network. Always be mindful that local testing environments like the sandbox may not fully capture all real-world network conditions and potential attack vectors.
:::

Furthermore, once a signature is used in a transaction, it becomes publicly visible on the blockchain. Without proper replay protection, anyone can potentially reuse this signature and the associated data in a new transaction if the contract logic doesn't prevent it.

## Race condition of messages

A message cascade can be processed over many blocks. Assume that while one message flow is running, an attacker can initiate a second message flow in parallel. That is, if a property was checked at the beginning, such as whether the user has enough tokens, do not assume that it will still be satisfied at the third stage in the same contract.

## Handle/Send bounced messages

Send messages with the bounce flag set to `true{:tact}`, which is the default for the [`send(){:tact}`](/ref/core-send#send), [`message(){:tact}`](/ref/core-send#message), and [`deploy(){:tact}`](/ref/core-send#deploy) functions. Messages bounce when the execution of a contract fails. You may want to handle this by rolling back the state of the contract using [`try...catch{:tact}`](/book/statements#try-catch) statements and performing additional processing depending on your logic.

##### Do's ✅

Handle bounced messages via a [bounced message receiver](/book/bounced/#bounced-message-receiver) to correctly react to failed messages.

```tact
contract JettonWalletSample(
    owner: Address,
    master: Address,
    balance: Int,
) {
    const minTonsForStorage: Int = ton("0.01");
    const gasConsumption: Int = ton("0.01");

    receive(msg: TokenBurn) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Invalid sender");

        self.balance = self.balance - msg.amount;
        require(self.balance >= 0, "Invalid balance");

        let fwdFee: Int = ctx.readForwardFee();
        require(
            ctx.value >
            fwdFee + 2 * self.gasConsumption + self.minTonsForStorage,
            "Invalid value - Burn",
        );

        message(MessageParameters {
            to: self.master,
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: TokenBurnNotification {
                queryId: msg.queryId,
                amount: msg.amount,
                owner: self.owner,
                response_destination: self.owner,
            }.toCell(),
        });
    }

    bounced(src: bounced<TokenBurnNotification>) {
        self.balance = self.balance + src.amount;
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }
}
```

## Transaction and phases

From the [Sending messages page](/book/send#outbound-message-processing) of the Book:

> Each transaction on TON Blockchain consists of multiple phases. Outbound messages are evaluated in the compute phase but are **not** sent in that phase. Instead, they're queued in order of appearance for the action phase, where all actions listed in the compute phase, such as outbound messages or reserve requests, are executed.

Hence, if the compute phase fails, [registers](https://docs.ton.org/v3/documentation/tvm/tvm-overview#control-registers) `c4` (persistent data) and `c5` (actions) won't be updated. However, it is possible to manually save their state using the [`commit(){:tact}`](/ref/core-contextstate#commit) function.

## Return gas excesses carefully

If excess gas is not returned to the sender, the funds will accumulate in your contracts over time. This isn't terrible in principle, just a suboptimal practice. You can add a function to rake out excess, but popular contracts like TON Jetton still return it to the sender with the [Message][message] using the `0xd53276db` opcode.

##### Do's ✅

Return excesses using a [Message][message] with the `0xd53276db` opcode.

```tact
message(0xd53276db) Excesses {}
message Vote { votes: Int as int32 }

contract Sample(
    votes: Int as uint32,
) {
    receive(msg: Vote) {
        self.votes += msg.votes;

        message(MessageParameters {
            to: sender(),
            value: 0,
            mode: SendRemainingValue | SendIgnoreErrors,
            body: Excesses {}.toCell(),
        });
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }
}
```

## Pulling data from another contract

Contracts in the blockchain can reside in separate shards processed by another set of validators. This means that one contract cannot pull data from another contract. Specifically, no contract can call a [getter function](/book/functions#get) from another contract.

Thus, any on-chain communication is asynchronous and done by sending and receiving messages.

##### Do's ✅

Exchange messages to pull data from another contract.

```tact
message GetMoney {}
message ProvideMoney {}
message TakeMoney { money: Int as coins }

contract OneContract(
    money: Int as coins,
) {
    receive(msg: ProvideMoney) {
        message(MessageParameters {
            to: sender(),
            value: 0,
            mode: SendRemainingValue | SendIgnoreErrors,
            body: TakeMoney { money: self.money }.toCell(),
        });
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }
}

contract AnotherContract(
    oneContractAddress: Address,
) {
    receive(_: GetMoney) {
        message(MessageParameters {
            to: self.oneContractAddress,
            value: 0,
            mode: SendRemainingValue | SendIgnoreErrors,
            bounce: false,
            body: ProvideMoney {}.toCell(),
        });
    }

    receive(msg: TakeMoney) {
        require(sender() == self.oneContractAddress, "Invalid money provider!");
        // ...further processing...
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }
}
```

## Pay attention to `safety` option set of `tact.config.json`

The security of the Tact compiler can be hardened or slightly relaxed by tweaking the [`safety`](/book/config#options-safety) option set in the [`tact.config.json`](/book/config).

Use those settings **wisely** — disabling them often gives performance boosts at the cost of runtime checks and reduced contract safety. On the flip side, enabling them would harden the contracts but make them a bit more expensive to execute.

[struct]: /book/structs-and-messages#structs
[message]: /book/structs-and-messages#messages



================================================
FILE: docs/src/content/docs/book/send.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/book/send.mdx
================================================
---
title: Sending messages
description: "TON Blockchain is message-based — to communicate with other contracts and to deploy new ones, you need to send messages."
---

import { Badge } from '@astrojs/starlight/components';

TON Blockchain is message-based — to communicate with other contracts and to deploy new ones, you need to send messages.

Messages in Tact are commonly composed using a built-in [struct][struct] `SendParameters{:tact}`, which consists of the following fields:

Field    | Type                   | Description
:------- | :--------------------- | :----------
`mode`   | [`Int{:tact}`][int]    | An 8-bit value that configures how to send a message; defaults to $0$. See: [Message `mode`](/book/message-mode).
`body`   | [`Cell?{:tact}`][cell] | [Optional][opt] message body as a [`Cell{:tact}`][cell].
`code`   | [`Cell?{:tact}`][cell] | [Optional][opt] initial code of the contract (compiled bitcode).
`data`   | [`Cell?{:tact}`][cell] | [Optional][opt] initial data of the contract (arguments of the [`init(){:tact}` function](/book/contracts#init-function) or values of [contract parameters](/book/contracts#parameters)).
`value`  | [`Int{:tact}`][int]    | The amount of [nanoToncoins][nano] you want to send with the message. This value is used to cover [forward fees][fwdfee] unless the optional flag [`SendPayFwdFeesSeparately{:tact}`](/book/message-mode#optional-flags) is used.
`to`     | [`Address{:tact}`][p]  | Recipient internal [`Address{:tact}`][p] on TON Blockchain.
`bounce` | [`Bool{:tact}`][p]     | When set to `true` (default), the message bounces back to the sender if the recipient contract doesn't exist or wasn't able to process the message.

The fields `code` and `data` are what's called an [init package](/book/expressions#initof), which is used in deployments of new contracts.

## Send a simple reply {#send-simple-reply}

The simplest message is a reply to an incoming message that returns all excess value from the message:

```tact
self.reply("Hello, World!".asComment()); // asComment converts a String to a Cell with a comment
```

## Send message

If you need more advanced logic, you can use the `send(){:tact}` function and the `SendParameters{:tact}` [struct][struct] directly.

In fact, the previous example with [`self.reply(){:tact}`](#send-simple-reply) can be made using the following call to the `send(){:tact}` function:

```tact
send(SendParameters {
    // bounce is set to true by default
    to: sender(), // sending message back to the sender
    value: 0, // don't add Toncoin to the message...
    mode: SendRemainingValue | SendIgnoreErrors, // ...except for the ones received from the sender due to SendRemainingValue
    body: "Hello, World".asComment(), // asComment converts a String to a Cell with a comment
});
```

Another example sends a message to the specified [`Address{:tact}`][p] with a `value` of 1 TON and the `body` as a comment containing the [`String{:tact}`][p] `"Hello, World!"{:tact}`:

```tact
let recipient: Address = address("...");
let value: Int = ton("1");
send(SendParameters {
    // bounce is set to true by default
    to: recipient,
    value: value,
    mode: SendIgnoreErrors, // skip the message in case of errors
    body: "Hello, World!".asComment(),
});
```

The [optional flag](/book/message-mode#optional-flags) `SendIgnoreErrors{:tact}` means that if an error occurs during [message sending](#outbound-message-processing), it will be ignored, and the given message will be skipped. Message-related [action phase][phases] [exit codes](/book/exit-codes) that might be thrown without the `SendIgnoreErrors{:tact}` set are:

* $36$: [`Invalid destination address in outbound message`](/book/exit-codes#36)
* $37$: [`Not enough Toncoin`](/book/exit-codes#37)
* $39$: [`Outbound message doesn't fit into a cell`](/book/exit-codes#39)
* $40$: [`Cannot process a message`](/book/exit-codes#40)

## Send typed message

To send a typed message, you can use the following code:

```tact
let recipient: Address = address("...");
let value: Int = ton("1");
send(SendParameters {
    // bounce is set to true by default
    to: recipient,
    value: value,
    mode: SendIgnoreErrors, // skip the message in case of errors
    body: SomeMessage { arg1: 123, arg2: 1234 }.toCell(),
});
```

## Deploy contract

To deploy a contract, you need to calculate its address and initial state with [`initOf{:tact}`](/book/expressions#initof), then send them in the initialization message:

```tact
let init: StateInit = initOf SecondContract(arg1, arg2);
let address: Address = contractAddress(init);
let value: Int = ton("1");
send(SendParameters {
    // bounce is set to true by default
    to: address,
    value: value,
    mode: SendIgnoreErrors, // skip the message in case of errors
    code: init.code,
    data: init.data,
    body: "Hello, World!".asComment(), // not necessary, can be omitted
});
```

<p/><Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

For cheaper on-chain deployments, prefer using the [`deploy(){:tact}`](/ref/core-send#deploy) function instead. It computes the address of the contract based on its initial code and data and efficiently composes the resulting message:

```tact
deploy(DeployParameters {
    // bounce is set to true by default
    init: initOf SecondContract(arg1, arg2), // initial code and data
    mode: SendIgnoreErrors, // skip the message in case of errors
    value: ton("1"), // a whole Toncoin
    body: "Hello, World!".asComment(), // not necessary, can be omitted
});
```

## Outbound message processing

Each transaction on TON Blockchain consists of [multiple phases][phases]. Outbound messages are evaluated in the [compute phase][compute], but are **not** sent in that phase. Instead, they are queued for execution in the [action phase][phases] in the order of their appearance in the compute phase. The queue is called an _output action list_, which contains other actions such as [reservations](/ref/core-contextstate#nativereserve).

Outgoing message sends may fail in the [action phase][phases] due to insufficient [action fees](https://docs.ton.org/develop/howto/fees-low-level#action-fee) or [forward fees][fwdfee], in which case they will not bounce and **will not revert** the transaction. This can happen because all values are calculated in the [compute phase][compute], all fees are computed by its end, and exceptions do not roll back the transaction during the action phase.

To skip or ignore the queued messages at the [action phase][phases] in case they cannot be sent, set the optional [`SendIgnoreErrors{:tact}`](/book/message-mode#optional-flags) flag when composing the message.

Consider the following example:

```tact
// This contract initially has 0 nanoToncoins on the balance
contract FailureIsNothingButAnotherStep {
    // All the funds it obtains are from inbound internal messages
    receive() {
        // 1st outbound message evaluated and queued (but not yet sent)
        send(SendParameters {
            to: sender(),
            value: ton("0.042"), // plus forward fee due to SendPayFwdFeesSeparately
            mode: SendIgnoreErrors | SendPayFwdFeesSeparately,
            // body is null by default
        });

        // 2nd outbound message evaluated and queued,
        // but not yet sent, and never will be!
        send(SendParameters {
            to: sender(),
            value: 0,
            mode: SendRemainingValue | SendIgnoreErrors,
            // body is null by default
        });
    } // exit code 37 during action phase!
}
```

There, the second message will not actually be sent:

* After finishing the [compute phase][compute], the remaining value $\mathrm{R}$ of the contract is computed.

* During outbound message processing and assuming that sufficient value was provided in the inbound message, the first message leaves $\mathrm{R} - (0.042 + \mathrm{forward\_fees})$ [nanoToncoins][nano] on the balance.

* When the second message is processed, the contract attempts to send $\mathrm{R}$ [nanoToncoins][nano], but fails because a smaller amount remains.

* Thus, an error with [exit code 37](/book/exit-codes#37) is thrown: `Not enough Toncoin`.

Note that such failures are not exclusive to the [`send(){:tact}`](/ref/core-send#send) function and may also occur when using other [message-sending functions](#message-sending-functions).

For instance, let us replace the first call to the [`send(){:tact}`](/ref/core-send#send) function in the previous example with the [`emit(){:tact}`](/ref/core-send#emit) function. The latter queues the message using the default mode, i.e. 0, and spends some [nanoToncoins][nano] to pay the [forward fees][fwdfee].

If a subsequent message is then sent with a [`SendRemainingValue{:tact}`](/book/message-mode#base-modes) base mode, it will cause the same error as before:

```tact
// This contract initially has 0 nanoToncoins on the balance
contract IfItDiesItDies {
    // All the funds it obtains are from inbound internal messages
    receive() {
        // 1st outbound message evaluated and queued (but not yet sent)
        // with the mode 0, which is the default
        emit("Have you seen this message?".asComment());

        // 2nd outbound message evaluated and queued,
        // but not yet sent, and never will be!
        send(SendParameters {
            to: sender(),
            value: 0,
            bounce: false, // brave and bold
            mode: SendRemainingValue,
            body: "Not this again!".asComment(),
        });
    } // exit code 37 during action phase!
}
```

:::note

  To avoid dealing with similar cases and to simplify future [debugging sessions](/book/debug), consider having only one call to one of the [message-sending functions](#message-sending-functions) per [receiver function](/book/receive).

  Alternatively, see the suggested solutions below.

:::

The previous examples discussed a case where the contract has 0 [nanoToncoins][nano] on the balance, which is rather rare—in most real-world scenarios, some funds would be present. As such, it is usually better to use the [`SendRemainingBalance{:tact}`](/book/message-mode#base-modes) base mode, paired with the _necessary_ call to the [`nativeReserve(){:tact}`](/ref/core-contextstate#nativereserve) function.

Like outbound messages, [reserve requests](/ref/core-contextstate#nativereserve) are queued during the [compute phase][compute] and executed during the [action phase][phases].

```tact
// This contract has some Toncoins on the balance, e.g., 0.2 or more
contract MyPrecious {
    // Extra funds can be received via a "topup" message
    receive("topup") {}

    // The rest of the logic is expressed here
    receive() {
        // 1st outbound message evaluated and queued (but not yet sent)
        // with the mode 0, which is the default
        emit("Have you seen this message?".asComment());

        // Try to keep most of the balance from before this transaction
        // Note that nativeReserve() only queues an action to be performed during the action phase
        nativeReserve(ton("0.05"), ReserveAtMost | ReserveAddOriginalBalance);
        //            -----------  -------------   -------------------------
        //            ↑            ↑               ↑
        //            |            |               keeping the balance from before compute phase start
        //            |            might keep less, but will not fail in doing so
        //            just a tad more on top of the balance, for the fees

        // 2nd outbound message evaluated and queued
        // with SendRemainingBalance mode
        send(SendParameters {
            to: sender(),
            value: 0,
            mode: SendRemainingBalance, // because of the prior nativeReserve(),
                                        // using this mode is safe and will keep
                                        // the original balance plus a little more
            body: "I give you my all! Well, all that's not mine!".asComment(),
        });
    }
}
```

If, instead, you want all outgoing messages to preserve a fixed amount of funds on the balance and **send the rest of the balance**, consider using one of the following functions. Note that these functions require a prior override of the [`self.storageReserve{:tact}`](/ref/core-base#self-storagereserve) constant:

* [`self.reply(){:tact}`](/ref/core-base#self-reply)
* [`self.notify(){:tact}`](/ref/core-base#self-notify)
* [`self.forward(){:tact}`](/ref/core-base#self-forward)

If you take only one thing away from this section, please remember this: be very careful with the [base modes](/book/message-mode#base-modes) of the message-sending functions, including the [implicitly set modes](/book/message-mode#functions-with-implicit-mode).

## Message sending limits

In total, there can be no more than 255 actions queued for execution, meaning that the maximum allowed number of messages sent per transaction is 255.

Attempts to queue more throw an exception with an [exit code 33](/book/exit-codes#33) during the [action phase][phases]: `Action list is too long`.

## Message-sending functions

Read more about all message-sending functions in the Reference:

* [`send(){:tact}`](/ref/core-send#send)
* [`message(){:tact}`](/ref/core-send#message)
* [`deploy(){:tact}`](/ref/core-send#deploy)
* [`emit(){:tact}`](/ref/core-send#emit)
* [`cashback(){:tact}`](/ref/core-send#cashback)
* [`self.notify(){:tact}`](/ref/core-base#self-notify)
* [`self.reply(){:tact}`](/ref/core-base#self-reply)
* [`self.forward(){:tact}`](/ref/core-base#self-forward)
* [`sendRawMessage(){:tact}`](/ref/core-send#sendrawmessage)
* [`sendRawMessageReturnForwardFee(){:tact}`](/ref/core-send#sendrawmessagereturnforwardfee)

[p]: /book/types#primitive-types
[int]: /book/integers
[cell]: /book/cells#cells
[struct]: /book/structs-and-messages#structs
[opt]: /book/optionals
[nano]: /book/integers#nanotoncoin

[phases]: https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases
[compute]: https://docs.ton.org/learn/tvm-instructions/tvm-overview#compute-phase
[nano]: /book/integers#nanotoncoin
[fwdfee]: https://docs.ton.org/develop/howto/fees-low-level#forward-fees



================================================
FILE: docs/src/content/docs/book/statements.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/book/statements.mdx
================================================
---
title: Statements
description: "This page lists all the statements in Tact that can appear anywhere in function bodies."
---

import { Badge } from '@astrojs/starlight/components';

The following statements can appear anywhere in a [function](/book/functions) body.

## `let` statement {#let}

The `let{:tact}` statement allows local and [block](#block)-scoped variable definitions. In Tact, variables are mutable, but **require** to be initialized with an expression.

However, type ascriptions can be omitted, and Tact will infer the type of the new variable from the computed value of the expression:

```tact
let value: Int = 123; // full definition with type and value
let vInferred = 123;  // inferred type Int from the mandatory value

let vExplicitCtx: Context = context(); // explicit type Context, a built-in struct
let vCtx = context();                  // inferred type Context
```

Note that the initial value of `null{:tact}` can mean either an empty [`map<K, V>{:tact}`](/book/maps) with arbitrary `K{:tact}` and `V{:tact}` types or the intentional absence of any other value for the [optional](/book/optionals) type. Therefore, whenever you declare a [`map<K, V>{:tact}`](/book/maps) or assign a [`null{:tact}`](/book/optionals) value, you must explicitly specify the type, as it cannot be inferred:

```tact
let vOptional: Int? = null; // explicit type Int or null
let vOptInt = 42;           // implicit type Int
vOptInt = null;             // COMPILATION ERROR, type mismatch!
let vOpt = null;            // COMPILATION ERROR, cannot infer type!

let vMap: map<Int, Int> = emptyMap(); // explicit type map<Int, Int>
let vMapWithSerialization: map<Int as uint8, Int as uint8> = emptyMap();
```

Naming a local variable with an underscore `_{:tact}` causes its value to be considered unused and discarded. This is useful if you do not need the return value of a function with side effects and want to explicitly mark the variable as unused. Note that such wildcard variable name `_{:tact}` cannot be accessed:

```tact
let _ = someFunctionWithSideEffects(); // with type inference
let _: map<Int, Int> = emptyMap();     // with explicit type

dump(_); // COMPILATION ERROR! Cannot access _
```

## `return` statement {#return}

The `return{:tact}` statement ends [function](/book/functions) execution and specifies a value to be returned to the [function](/book/functions) caller.

```tact
// Simple wrapper over stdlib function now()
fun getTimeFromNow(offset: Int): Int {
    return now() + offset;
}
```

If the function does not have an explicit return type, it has an implicit return type of `void`. As such, the `return{:tact}` statement must be empty.

```tact
extends mutates fun equalize(self: Int, num: Int) {
    if (self == num) {
        return;
    } else {
        self = num;
        return;
    }
}
```

All statements after the `return{:tact}` statement are unreachable and will not be executed. Such statements are detected by the Tact compiler, producing an "Unreachable code" error.

This is done to help avoid potential logical errors in the code, although `return{:tact}`-reachability analysis is not almighty and might reject valid examples.

```tact
extends mutates fun equalize(self: Int, num: Int) {
    if (self == num) {
        return;
    } else {
        self = num;
        return;
    }

    throw(42); // COMPILATION ERROR! Unreachable statement
//  ~~~~~~~~~
}

fun retWhenNot(flag: Bool): Int {
    if (flag) {
        throw(200);
    } else {
        return 42;
    }

    return 1000; // COMPILATION ERROR! Unreachable statement
//  ~~~~~~~~~~~
}

fun throwWrapped(code: Int) {
    throw(code);
}

// The following function always throws, but this cannot be
// determined without a thorough inter-procedural analysis
// and, as such, compiler won't allow it.
//
// COMPILATION ERROR! Function does not always return a result
fun triggerCompiler(): Int {
//  ~~~~~~~~~~~~~~~
    throwWrapped(42);
}
```

## Block

A block statement is used to group zero or more statements. The block is delimited by a pair of braces ("curly braces", `{}{:tact}`) and contains a list of zero or more statements and declarations.

Some statements, such as [`let{:tact}`](#let) or [`return{:tact}`](#return), must end with a terminating semicolon `;{:tact}`. However, the semicolon of the last statement in the block is optional and may be omitted.

```tact
{ // <- start of the block
    // arbitrary statements:
    let value: Int = 2 + 2;
    dump(value);
} // <- end of the block

{ dump(2 + 2) } // a block with only one statement,
                // omitting the last and only semicolon

{
    let nah = 3 * 3 * 3; // a block with two statements,
    let yay = nah + 42   // but without the last semicolon
}
```

## Expression

An expression statement is an expression used in a place where a statement is expected. The expression is evaluated, and its result is discarded. Therefore, it makes sense only for expressions that have side effects, such as [printing to the debug console](/ref/core-debug#dump) or executing an [extension mutation function](/book/functions#mutates).

```tact
dump(2 + 2); // stdlib function
```

## Assignment

Assignment statements use an [assignment operator](/book/operators#assignment) (`={:tact}`) or [augmented assignment operators](/book/operators#augmented-assignment) (assignments combined with an operation):

```tact
let value: Int = 0; // definition
value = 5;          // assignment
value += 5;         // augmented assignment (one of many)
```

:::note

  Read more about assignment and augmented assignment in their dedicated section: [assignment operators](/book/operators#assignment).

:::

## Destructuring assignment

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

The destructuring assignment is a concise way to unpack [structs][struct] and [Messages][message] into distinct variables. It mirrors the [instantiation syntax](/book/expressions#instantiation), but instead of creating a new structure it binds every field or some of the fields to their respective variables.

The syntax is derived from the [`let` statement](#let), and instead of specifying the variable name directly, it involves specifying the structure type on the left side of the [assignment operator `={:tact}`](/book/operators#assignment), which corresponds to the structure type of the value on the right side.

```tact {9}
// Definition of Example
struct Example { number: Int }

// An arbitrary helper function
fun get42(): Example { return Example { number: 42 } }

fun basic() {
    // Basic syntax of destructuring assignment (to the left of "="):
    let Example { number } = get42();
    //  -------   ------     -------
    //  ↑         ↑          ↑
    //  |         |          gives the Example struct
    //  |         definition of "number" variable, derived
    //  |         from the field "number" in Example struct
    //  target structure type "Example"
    //  to destructure fields from

    // Same as above, but with an instantiation
    // to showcase how destructuring syntax mirrors it:
    let Example { number } = Example { number: 42 };
    //                       ----------------------
    //                       ↑
    //                       instantiation of Example struct

    // Above examples of syntax are roughly equivalent
    // to the following series of statements:
    let example = Example { number: 42 };
    let number = example.number;
}
```

Just like in [instantiation](/book/expressions#instantiation), a trailing comma is allowed.

```tact
struct Example { number: Int }

fun trailblazing() {
    let Example {
        number,     // trailing comma inside variable list
    } = Example {
        number: 42, // trailing comma inside field list
    };
}
```

:::note

  [Augmented assignment operators](/book/operators#augmented-assignment) do not make sense for such assignments and will therefore be reported as parsing errors:

  ```tact
  struct Example { number: Int }
  fun get42(): Example { return Example { number: 42 } }

  fun basic() {
      let Example { number } += get42();
      //                     ^ this will result in the parse error:
      //                     expected "="
  }
  ```

:::

To create a binding under a different variable name, specify it after the semicolon `:{:tact}`.

```tact
// Similar definition, but this time the field is called "field", not "number"
struct Example { field: Int }

fun naming(s: Example) {
    let Example { field: varFromField } = s;
    //                   ------------     ↑
    //                   ↑                |
    //                   |                instance of Example struct, received
    //                   |                as a parameter of the function "naming"
    //                   definition of "varFromField" variable, derived
    //                   from the field "field" in Example struct
}
```

Note that the order of bindings doesn't matter — all fields retain their values and types under their names regardless of the order in which they appear in their definition in the respective [struct][struct] or [Message][message].

```tact
// "first" goes first, then goes "second"
struct Two { first: Int; second: String }

fun order(s: Two) {
    let Two { second, first } = s;
    //        ------  -----
    //        ↑       ↑
    //        |       this variable will be of type Int,
    //        |       same as the "first" field in struct Two
    //        this variable will be of type String,
    //        same as the "second" field in struct Two
}
```

Destructuring assignment is exhaustive and requires specifying all the fields as variables. To deliberately ignore some of the fields, use an underscore `_{:tact}`, which discards the relevant field's value. Note that such wildcard variable name `_{:tact}` cannot be accessed:

```tact
// "first" goes first, then goes "second"
struct Two { first: Int; second: String }

fun discard(s: Two) {
    let Two { second: _, first } = s;
    //              ---
    //              ↑
    //              discards the "second" field, only taking the "first"
}
```

To completely ignore the rest of the fields, use `..` at the end of the list:

```tact
struct Many { one: Int; two: Int; three: Int; fans: Int }

fun ignore(s: Many) {
    let Many { fans, .. } = s;
    //               --
    //               ↑
    //               ignores all the unspecified fields,
    //               defining only "fans"
}
```

:::caution

  At the moment, destructuring of nested [structs][struct] or [Messages][message] isn't allowed. That is, the following won't work:

  ```tact
  struct First { nested: Second }
  struct Second { field: Int }

  fun example() {
      let prep = First { nested: Second { field: 42 } };
      let First { nested: Second { field: thing } } = prep;
      //                         ^ this will result in the parse error:
      //                         expected "," or "}"
  }
  ```

:::

## Branches

Control the flow of the code.

### `if...else` {#if-else}

:::caution

  Curly brackets (code blocks) are required!

:::

When executing an `if...else{:tact}` statement, first, the specified condition is evaluated. If the resulting value is `true{:tact}`, the following statement block is executed. Otherwise, if the condition evaluates to `false{:tact}`, the optional `else{:tact}` block is executed. If the `else{:tact}` block is missing, nothing happens, and execution continues further.

Regular `if{:tact}` statement:

```tact
// condition
// ↓
if (true) { // consequence, when condition is true
    dump(2 + 2);
}
```

With `else{:tact}` block:

```tact
// condition
// ↓
if (2 + 2 == 4) {
    // consequence, when condition is true
    dump(true);
} else {
    // alternative, when condition is false
    dump(false);
}
```

With nested `if...else{:tact}`:

```tact
// condition
// ↓
if (2 + 2 == 3) {
    // consequence, when condition is true
    dump("3?");
//        condition2
//        ↓
} else if (2 + 2 == 4) {
    // another consequence, when condition2 is true
    dump(true);
} else {
    // alternative, when both condition and condition2 are false
    dump(false);
}
```

:::note

  Tact also has a ternary expression `?:{:tact}`, which is described earlier in the Book: [Ternary](/book/operators#ternary).

:::

### `try...catch` {#try-catch}

The `try...catch{:tact}` statement consists of a `try{:tact}` block and an optional `catch{:tact}` block, which receives an [`Int{:tact}`][int] [exit code](/book/exit-codes) as its only argument. The code in the `try{:tact}` block is executed first, and if it fails, the code in the `catch{:tact}` block will be executed, and changes made in the `try{:tact}` block will be rolled back, if possible.

:::note

  Note that some TVM state parameters, such as codepage and gas counters, will not be rolled back. That is, all gas usage in the `try{:tact}` block will be taken into account, and the effects of opcodes that change the gas limit will be preserved.

:::

Regular `try{:tact}` statement:

```tact
fun braveAndTrue() {
    // Let's try and do something erroneous
    try {
        throw(1042); // throwing with exit code 1042
    }

    // The following will be executed as the erroneous code above was wrapped in a try block
    dump(1042);
}
```

With `catch (e){:tact}` block:

```tact
fun niceCatch() {
    // Let's try and do something erroneous
    try {
        throw(1042); // throwing with exit code 1042
    } catch (err) {
        dump(err);       // this will dump the exit code caught, which is 1042
    }
}
```

With nested `try...catch{:tact}`:

```tact
try {
    // Preparing an x equal to 0, in such a way that the Tact compiler won't realize it (yet!)
    let xs: Slice = beginCell().storeUint(0, 1).endCell().beginParse();
    let x: Int = xs.loadUint(1); // 0

    try {
        throw(101);     // 1. throws with exit code 101
    } catch (err) {     // 2. catches the error and captures its exit code (101) as err
        return err / x; // 3. divides err by x, which is zero, throwing with exit code 4
    }

} catch (err) {         // 4. catches the new error and captures its exit code (4) as err
    //   ^^^ this works without name collisions because the previous err
    //       has a different scope and is only visible inside the previous catch block

    dump(err);          // 5. dumps the last caught exit code (4)
}
```

Note that similar to the [`let{:tact}` statement](#let), the captured [exit code](/book/exit-codes) in the `catch (){:tact}` clause can be discarded by specifying an underscore `_{:tact}` in its place:

```tact
try {
    throw(42);
} catch (_) {
    dump("I don't know the exit code anymore");
}
```

:::note

  Read more about exit codes on the dedicated page: [Exit codes in the Book](/book/exit-codes).

:::

## Loops

Conditionally repeat certain blocks of code multiple times.

### `repeat` {#repeat-loop}

The `repeat{:tact}` loop executes a block of code a specified number of times. The number of repetitions should be given as a positive 32-bit [`Int{:tact}`][int] in the inclusive range from $1$ to $2^{31} - 1$. If the value is greater, an error with [exit code 5](/book/exit-codes#5), `Integer out of expected range`, will be thrown.

If the specified number of repetitions is equal to $0$ or any negative number in the inclusive range from $-2^{256}$ to $-1$, it is ignored, and the code block is not executed at all.

```tact
let twoPow: Int = 1;

// Repeat exactly 10 times
repeat (10) {
    twoPow *= 2;
}

// Skipped
repeat (-1) {
    twoPow *= 3333;
}

twoPow; // 1024
```

### `while` {#while-loop}

The `while{:tact}` loop continues executing the block of code as long as the given condition is `true{:tact}`.

In the following example, the value of `x` is decremented by 1 on each iteration, so the loop will run 10 times:

```tact
let x: Int = 10;
while (x > 0) {
    x -= 1;
}
```

### `do...until` {#do-until-loop}

The `do...until{:tact}` loop is a post-test loop that executes the block of code at least once and then continues to execute it until the given condition becomes `true{:tact}`.

In the following example, the value of `x` is decremented by 1 on each iteration, so the loop will run 10 times:

```tact
let x: Int = 10;
do {
    x -= 1;  // executes this code block at least once
} until (x <= 0);
```

### `foreach` {#foreach-loop}

The `foreach{:tact}` loop operates on key-value pairs (entries) of the [`map<K, V>{:tact}`](/book/maps) type in sequential order: from the smallest keys of the map to the biggest ones.

This loop executes a block of code for each entry in the given map, capturing the key and value on each iteration. This is handy when you don't know in advance how many items there are in the map or don't want to explicitly look for each of the entries using the [`get(){:tact}`](/book/maps#get) [method](/book/functions#extensions) of maps.

Note that the names of captured keys and values in each iteration are arbitrary and can be any valid Tact identifier, provided they are new to the current scope. The most common options are: `k` and `v`, or `key` and `value`.

In the following example, the map `cells` has $4$ entries, so the loop will run $4$ times:

```tact
// Empty map
let cells: map<Int, Cell> = emptyMap();

// Setting four entries
cells.set(1, beginCell().storeUint(100, 16).endCell());
cells.set(2, beginCell().storeUint(200, 16).endCell());
cells.set(3, beginCell().storeUint(300, 16).endCell());
cells.set(4, beginCell().storeUint(400, 16).endCell());

// A variable for summing up the values
let sum: Int = 0;

// For each key and value pair in the cells map, do:
foreach (key, value in cells) { // or just k, v
    let s: Slice = value.beginParse(); // convert Cell to Slice
    sum += s.loadUint(16);             // sum the Slice values
}
dump(sum); // 1000
```

It's also possible to iterate over a map in contract storage, and over maps as members of instances of [structure](/book/structs-and-messages) types:

```tact
import "@stdlib/deploy";

struct Fizz { oh_my: map<Int, Int> }
message Buzz { oh_my: map<Int, Int> }

contract Iterated {
    oh_my: map<Int, Int>;

    receive("call to iterate!") {
        let oh_my: map<Int, Int> = emptyMap();
        oh_my.set(0, 42);
        oh_my.set(1, 27);

        self.oh_my = oh_my; // assigning local map to the storage one
        let fizz = Fizz { oh_my }; // field punning
        let buzz = Buzz { oh_my }; // field punning

        // Iterating over map in contract storage
        foreach (key, value in self.oh_my) {
            // ...
        }

        // Iterating over map member of a struct Fizz instance
        foreach (key, value in fizz.oh_my) {
            // ...
        }

        // Iterating over map member of a Message Buzz instance
        foreach (key, value in buzz.oh_my) {
            // ...
        }
    }
}
```

Similar to the [`let{:tact}` statement](#let), either of the captured key or value (or both) can be discarded by specifying an underscore `_{:tact}` in their place:

```tact
// Empty map
let quartiles: map<Int, Int> = emptyMap();

// Setting some entries
quartiles.set(1, 25);
quartiles.set(2, 50);
quartiles.set(3, 75);

// Discarding captured keys
// without modifying them in the map itself
foreach (_, value in quartiles) {}

// Discarding captured values
// without modifying them in the map itself
foreach (key, _ in quartiles) {}

// Discarding both keys and values
// without modifying them in the map itself
foreach (_, _ in quartiles) {
    // Can't access via _, but can do desired operations
    // n times, where n is the current length of the map
}
```

:::caution

  At the moment, `foreach{:tact}` works only with explicitly provided map identifiers and nested identifier constructions, like `foo.bar.targetMap{:tact}` or `self.baz.targetMap{:tact}`. That is, returning a map from a function and trying to iterate over its entries won't work:

  ```tact
  foreach (k, v in emptyMap()) {
  //               ^ this will give the following error message:
  //                 foreach is only allowed over maps that are path expressions,
  //                 i.e. identifiers, or sequences of direct contract/struct/message accesses,
  //                 like "self.foo" or "self.structure.field"
  }
  ```

  Trying to iterate over a map member of a [struct][struct] returned from a function also won't work, because the function call is an expression and neither an identifier nor a nested identifier access:

  ```tact
  foreach (k, v in genCoolStruct().map) {
  //               ^ this will give the following error message:
  //                 foreach is only allowed over maps that are path expressions,
  //                 i.e. identifiers, or sequences of direct contract/struct/message accesses,
  //                 like "self.foo" or "self.structure.field"
  }
  ```

:::

:::note

  For additional loop examples, see: [Loops in Tact-By-Example](https://tact-by-example.org/04-loops).

:::

[int]: /book/integers
[struct]: /book/structs-and-messages#structs
[message]: /book/structs-and-messages#messages



================================================
FILE: docs/src/content/docs/book/structs-and-messages.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/book/structs-and-messages.mdx
================================================
---
title: Structs and Messages
description: "Structs can define complex data types that contain multiple fields of different types, while Messages also have a 32-bit header and are convenient for receiving and sending message bodies on TON Blockchain."
---

import { Badge } from '@astrojs/starlight/components';

Tact supports a number of [primitive data types](/book/types#primitive-types) that are tailored for smart contract use. However, using individual means of storage often becomes cumbersome, so there are [structs](#structs) and [Messages](#messages), which allow combining types together.

After successful compilation, Tact produces a [compilation report](/book/compile), which features all the declared structs and Messages, including those from the Core standard library. See the [Structures section of the compilation report](/book/compile#structures) for details.

:::caution

  Currently, circular types are **not** possible. This means that struct or message struct `A` can't have a field of struct or message struct type `B` if `B` has a field of type `A`.

  Therefore, the following code **won't** compile:

  ```tact
  struct A {
      circularFieldA: B;
  }

  struct B {
      impossibleFieldB: A;
  }
  ```

:::

## Structs

Structs can define complex data types that contain multiple fields of different types. They can also be nested.

```tact
struct Point {
    x: Int as int64;
    y: Int as int64;
}

struct Line {
    start: Point;
    end: Point;
}
```

Structs can also contain default fields and define fields of [optional types](/book/optionals). This can be useful if you have a lot of fields but don't want to keep specifying common values for them in [new instances](#instantiate).

```tact
struct Params {
    name: String = "Satoshi"; // default value

    age: Int?; // field with an optional type Int?
               // and default value of null

    point: Point; // nested structs
}
```

Structs are also useful as return values from getters or other internal functions. They effectively allow a single getter to return multiple values.

```tact
contract StructsShowcase {
    params: Params; // struct as a contract's persistent state variable

    init() {
        self.params = Params {
            point: Point {
                x: 4,
                y: 2,
            },
        };
    }

    get fun params(): Params {
        return self.params;
    }
}
```

Note that the last semicolon `;` in a struct definition is optional and may be omitted:

```tact
struct Mad { ness: Bool }

struct MoviesToWatch {
    wolverine: String;
    redFunnyGuy: String
}
```

The order of fields matters, as it corresponds to the resulting memory layout in [TL-B schemas](https://docs.ton.org/develop/data-formats/tl-b-language). However, unlike some languages with manual memory management, Tact does not have any padding between fields.

Consequently, structs cannot be empty and must declare at least one field.

## Messages

Messages can hold [structs](#structs) in them:

```tact
struct Point {
    x: Int;
    y: Int;
}

message Add {
    point: Point; // holds a struct Point
}
```

### Message opcodes

Messages are almost the same as [structs](#structs), with the only difference being that Messages have a 32-bit integer header in their serialization containing their unique numeric id, commonly referred to as an _opcode_ (operation code). This allows Messages to be used with [receivers](/book/receive), since the contract can distinguish different types of messages based on this id.

Tact automatically generates these unique ids (opcodes) for every received Message, which can be observed in the [Structures section of the compilation report](/book/compile#structures).

Additionally and unlike regular [structs](#structs), this allows Messages to be declared empty:

```tact
message TotallyValid {}
```

However, opcodes can be overridden manually:

```tact
// This Message overrides its unique id (opcode) with 411,
// which allows it to be recognized in the receiver functions.
message(411) InfoNotification {}

// This Message overrides its opcode with 0x7362d09c
message(0x7362d09c) TokenNotification {
    forwardPayload: Slice as remaining;
}

// Since those Messages have unique opcode prefixes,
// incoming message bodies can be differentiated based on them.
contract OpcodeRecognition {
    receive(msg: InfoNotification) {
        // ...
    }

    receive(msg: TokenNotification) {
        // ...
    }
}
```

This is useful in cases where you want to handle certain opcodes of a given smart contract, such as the [Jetton standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md). The messages and their respective opcodes that this contract can process are defined [here in the Tact's Jetton implementation](https://github.com/tact-lang/jetton/blob/3f02e1065b871cbab300e019f578c3fb0b19effa/src/contracts/base/messages.tact). They serve as an interface to the smart contract.

<Badge text="Available since Tact 1.6" variant="tip" size="small"/> A message opcode can be any [compile-time](/ref/core-comptime) expression that evaluates to a positive 32-bit integer, so the following is also valid:

```tact
// This Message overrides its unique id (opcode) with 898001897,
// which is the evaluated integer value of the specified compile-time expression
message((crc32("Tact") + 42) & 0xFFFF_FFFF) MsgWithExprOpcode {
    field: Int as uint4;
}
```

:::note

  For more in-depth information on this, see:\
  [Convert received messages to `op` operations](/book/func#convert-received-messages-to-op-operations)\
  [Internal message body layout in TON Docs](https://docs.ton.org/develop/smart-contracts/guidelines/internal-messages#internal-message-body)\
  [Messages of the Jetton implementation in Tact](https://github.com/tact-lang/jetton/blob/3f02e1065b871cbab300e019f578c3fb0b19effa/src/contracts/base/messages.tact)\
  [Common examples of working with Fungible Tokens (Jettons) in Tact](/cookbook/jettons)

:::

<Badge text="Available since Tact 1.6.7" variant="tip" size="small"/> A message opcode can be obtained by calling the `opcode()` method on any message type:

```tact
message(0x777) TripleAxe {
    prize: Int as uint32;
}

contract Example {
    receive(msg: TripleAxe) {
        dump(TripleAxe.opcode()); // 0x777
   }
}
```

## Operations

### Instantiate

The creation of [struct](#structs) and [Message](#messages) instances resembles [function calls](/book/expressions#static-function-call), but instead of parentheses `(){:tact}`, one needs to specify arguments in braces `{}{:tact}` (curly brackets):

```tact
struct StA {
    field1: Int;
    field2: Int;
}

message MsgB {
    field1: String;
    field2: String;
}

fun example() {
    // Instance of a struct StA
    StA {
        field1: 42,
        field2: 68 + 1, // trailing comma is allowed
    };

    // Instance of a Message MsgB
    MsgB {
        field1: "May the 4th",
        field2: "be with you!", // trailing comma is allowed
    };
}
```

When the name of a variable or constant assigned to a field coincides with the name of that field, Tact provides a handy syntactic shortcut sometimes called field punning. With it, you don't have to type more than necessary:

```tact
struct PopQuiz {
    vogonsCount: Int;
    nicestNumber: Int;
}

fun example() {
    // Let's introduce a couple of variables
    let vogonsCount: Int = 42;
    let nicestNumber: Int = 68 + 1;

    // You may instantiate the struct as usual and assign variables to fields,
    // but that can be a bit repetitive and tedious at times
    PopQuiz { vogonsCount: vogonsCount, nicestNumber: nicestNumber };

    // Let's use field punning and type less,
    // because our variable names happen to be the same as the field names
    PopQuiz {
        vogonsCount,
        nicestNumber, // trailing comma is allowed here too!
    };
}
```

:::note

  Because instantiation is an expression in Tact, it's also described on the related page: [Instantiation expression](/book/expressions#instantiation).

:::

### Convert to a `Cell`, `.toCell()` {#tocell}

It is possible to convert an arbitrary [struct](#structs) or [Message](#messages) to the [`Cell{:tact}`][cell] type by using the `.toCell(){:tact}` [extension function](/book/functions#extensions):

```tact
struct Big {
    f1: Int;
    f2: Int;
    f3: Int;
    f4: Int;
    f5: Int;
    f6: Int;
}

fun conversionFun() {
    dump(Big {
        f1: 10000000000, f2: 10000000000, f3: 10000000000,
        f4: 10000000000, f5: 10000000000, f6: 10000000000,
    }.toCell()); // x{...cell with references...}
}
```

:::note

  See these extension functions in the Reference:\
  [`Struct.toCell(){:tact}`](/ref/core-cells#structtocell)\
  [`Message.toCell(){:tact}`](/ref/core-cells#messagetocell)

:::

### Obtain from a `Cell` or `Slice`, `.fromCell()` and `.fromSlice()` {#fromcellslice}

Instead of manually parsing a [`Cell{:tact}`][cell] or [`Slice{:tact}`][slice] via a series of relevant `Slice{:tact}` extension function calls, one can use `.fromCell(){:tact}` and `.fromSlice(){:tact}` [extension functions](/book/functions#extensions) to convert the provided `Cell{:tact}` or `Slice{:tact}` into the needed [struct](#structs) or [Message](#messages).

These extension functions only attempt to parse a [`Cell{:tact}`][cell] or [`Slice{:tact}`][slice] according to the structure of your struct or Message. In case the layouts don't match, various exceptions may be thrown — make sure to wrap your code in [`try...catch{:tact}`](/book/statements#try-catch) blocks to prevent unexpected results.

```tact
struct Fizz { foo: Int }
message(100) Buzz { bar: Int }

fun constructThenParse() {
    let fizzCell = Fizz { foo: 42 }.toCell();
    let buzzCell = Buzz { bar: 27 }.toCell();

    let parsedFizz: Fizz = Fizz.fromCell(fizzCell);
    let parsedBuzz: Buzz = Buzz.fromCell(buzzCell);
}
```

:::note

  See these extension functions in the Reference:\
  [`Struct.fromCell(){:tact}`][st-fc]\
  [`Struct.fromSlice(){:tact}`][st-fs]\
  [`Message.fromCell(){:tact}`][msg-fc]\
  [`Message.fromSlice(){:tact}`][msg-fs]

:::

### Conversion laws

Whenever one converts between [`Cell{:tact}`][cell]/[`Slice{:tact}`][slice] and [struct](#structs)/[Message](#messages) via `.toCell(){:tact}` and `.fromCell(){:tact}` functions, the following laws hold:

* For any instance of type [struct](#structs)/[Message](#messages), calling `.toCell(){:tact}` on it and then applying `Struct.fromCell(){:tact}` (or `Message.fromCell(){:tact}`) to the result gives back a copy of the original instance:

```tact {8-9,13-14}
struct ArbitraryStruct { fieldNotFound: Int = 404 }
message(0x2A) ArbitraryMessage {}

fun lawOne() {
    let structInst = ArbitraryStruct {};
    let messageInst = ArbitraryMessage {};

    ArbitraryStruct.fromCell(structInst.toCell());   // = structInst
    ArbitraryMessage.fromCell(messageInst.toCell()); // = messageInst

    // Same goes for Slices, with .toCell().asSlice() and .fromSlice()

    ArbitraryStruct.fromSlice(structInst.toCell().asSlice());   // = structInst
    ArbitraryMessage.fromSlice(messageInst.toCell().asSlice()); // = messageInst
}
```

* For any [`Cell{:tact}`][cell] with the same [TL-B](https://docs.ton.org/develop/data-formats/tl-b-language) layout as a given [struct](#structs)/[Message](#messages), calling `Struct.fromCell(){:tact}` (or `Message.fromCell(){:tact}`) on it and then converting the result to a [`Cell{:tact}`][cell] via `.toCell(){:tact}` will give a copy of the original [`Cell{:tact}`][cell]:

```tact {9-10,15-16}
struct ArbitraryStruct { val: Int as uint32 }
message(0x2A) ArbitraryMessage {}

fun lawTwo() {
    // Using 32 bits to store 42 just so this cellInst can be
    // reused for working with both ArbitraryStruct and ArbitraryMessage
    let cellInst = beginCell().storeUint(42, 32).endCell();

    ArbitraryStruct.fromCell(cellInst).toCell();  // = cellInst
    ArbitraryMessage.fromCell(cellInst).toCell(); // = cellInst

    // Same goes for Slices, with .fromSlice() and .toCell().asSlice()
    let sliceInst = cellInst.asSlice();

    ArbitraryStruct.fromSlice(sliceInst).toCell().asSlice();  // = sliceInst
    ArbitraryMessage.fromSlice(sliceInst).toCell().asSlice(); // = sliceInst
}
```

[st-fc]: /ref/core-cells#structfromcell
[st-fs]: /ref/core-cells#structfromslice
[msg-fc]: /ref/core-cells#messagefromcell
[msg-fs]: /ref/core-cells#messagefromslice

[p]: /book/types#primitive-types
[cell]: /book/cells#cells
[slice]: /book/cells#slices



================================================
FILE: docs/src/content/docs/book/types.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/book/types.mdx
================================================
---
title: Type system overview
description: "Every variable, item, and value in Tact programs has a type"
prev:
  link: /book/learn-tact-in-y-minutes
  label: Learn Tact in Y minutes
---

Every variable, item, and value in Tact programs has a type. They can be:

* One of the [primitive types](#primitive-types)
* Or one of the [composite types](#composite-types)

Additionally, many of these types [can be made nullable](#optionals).

## Primitive types

Tact supports a number of primitive data types that are tailored for smart contract use:

* [`Int{:tact}`](/book/integers) — All numbers in Tact are $257$-bit signed integers, but [smaller representations](/book/integers#serialization) can be used to reduce storage costs.
* [`Bool{:tact}`](#booleans) — Classical boolean with `true{:tact}` and `false{:tact}` values.
* `Address{:tact}` — Standard [smart contract address](https://docs.ton.org/learn/overviews/addresses#address-of-smart-contract) in TON Blockchain.
* [`Cell{:tact}`](/book/cells#cells), [`Builder{:tact}`](/book/cells#builders), [`Slice{:tact}`](/book/cells#slices) — Low-level primitives of [TVM][tvm].
* `String{:tact}` — Immutable text strings.
* `StringBuilder{:tact}` — Helper type that allows you to concatenate strings in a gas-efficient way.

[tvm]: https://docs.ton.org/learn/tvm-instructions/tvm-overview

### Booleans {#booleans}

The primitive type `Bool{:tact}` is the classical boolean type, which can hold only two values: `true{:tact}` and `false{:tact}`. It is convenient for boolean and logical operations, as well as for storing flags.

There are no implicit type conversions in Tact, so addition ([`+{:tact}`](/book/operators#binary-add)) of two boolean values is not possible. However, many comparison [operators](/book/operators) are available, such as:

* `&&{:tact}` for [logical AND](/book/operators#binary-logical-and) with its [augmented assignment version `&&={:tact}`](/book/operators#augmented-assignment),
* `||{:tact}` for [logical OR](/book/operators#binary-logical-or) with its [augmented assignment version `||={:tact}`](/book/operators#augmented-assignment),
* `!{:tact}` for [logical inversion](/book/operators#unary-inverse),
* `=={:tact}` and `!={:tact}` for checking [equality](/book/operators#binary-equality),
* and `!!{:tact}` for [non-null assertion](/book/optionals).

Persisting bools to state is very space-efficient, as they only occupy 1 bit. Storing 1000 bools in state [costs](https://ton.org/docs/develop/smart-contracts/fees#how-to-calculate-fees) about $0.00072$ TON per year.

## Composite types

Using individual means of storage often becomes cumbersome, so there are ways to combine multiple [primitive types](#primitive-types) together to create composite types:

* [Maps](#maps) — associations of keys with values.
* [Structs and Messages](#structs-and-messages) — data structures with typed fields.
* [Optionals](#optionals) — `null{:tact}` values for variables, parameters, and fields of [structs and Messages](#structs-and-messages).

In addition to the composite types above, Tact provides a special type constructor [`bounced<T>{:tact}`](/book/bounced), which can only be specified in [bounced message receivers](/book/bounced).

While [contracts](#contracts) and [traits](#traits) are also considered a part of the Tact type system, one cannot pass them around like [structs and Messages](#structs-and-messages). Instead, it is possible to obtain the initial state of a given contract by using the [`initOf{:tact}`](/book/expressions#initof) expression.

It is also possible to obtain only the code of a given contract by using the [`codeOf{:tact}`](/book/expressions#codeof) expression.

### Maps

The type [`map<K, V>{:tact}`][maps] is used as a way to associate keys of type `K{:tact}` with corresponding values of type `V{:tact}`.

Example of a [`map<K, V>{:tact}`][maps]:

```tact
let mapExample: map<Int, Int> = emptyMap(); // empty map with Int keys and values
```

Learn more about them on the dedicated page: [Maps][maps].

[maps]: /book/maps

### Structs and Messages

[Structs][structs] and [Messages][messages] are the two main ways of combining multiple [primitive types](#primitive-types) into a composite one.

Example of a [struct][structs]:

```tact
struct Point {
    x: Int;
    y: Int;
}
```

Example of a [Message][messages]:

```tact
// Custom numeric id of the Message
message(0x11111111) SetValue {
    key: Int;
    value: Int?; // Optional, Int or null
    coins: Int as coins; // Serialization into TL-B types
}
```

Learn more about them on the dedicated page: [structs and Messages][s-n-m].

[s-n-m]: /book/structs-and-messages
[structs]: /book/structs-and-messages#structs
[messages]: /book/structs-and-messages#messages

### Optionals

All [primitive types](#primitive-types), as well as [structs and Messages](#structs-and-messages), can be nullable and hold a special `null{:tact}` value.

Example of an [optional][optionals]:

```tact
let opt: Int? = null; // Int or null, explicitly assigned null
```

Learn more about them on the dedicated page: [Optionals][optionals].

[optionals]: /book/optionals

### Contracts

[Contracts](/book/contracts) in Tact conveniently represent smart contracts on TON blockchain. They hold all [functions](/book/functions), [getters](/book/functions#get), and [receivers](/book/functions#receivers) of a TON contract, and much more.

Example of a [contract](/book/contracts):

```tact
contract HelloWorld {
    // Persistent state variable
    counter: Int;

    // Constructor function init(), where all the variables are initialized
    init() {
        self.counter = 0;
    }

    // Internal message receiver, which responds to a string message "increment"
    receive("increment") {
        self.counter += 1;
    }

    // Getter function with return type Int
    get fun counter(): Int {
        return self.counter;
    }
}
```

Read more about them on the dedicated page: [Contracts](/book/contracts).

### Traits

Tact doesn't support classical class inheritance but instead introduces the concept of _traits_, which can be viewed as abstract contracts (like abstract classes in popular object-oriented languages). They have the same structure as [contracts](#contracts) but can't [initialize persistent state variables](/book/contracts#init-function).

A trait can also allow the contract inheriting it to override the behavior of its [functions](/book/functions#inheritance) and the values of its [constants](/book/constants#virtual-and-abstract-constants).

Example of a trait [`Ownable{:tact}`](/ref/stdlib-ownable#ownable) from [`@stdlib/ownable`](/ref/stdlib-ownable):

```tact
trait Ownable {
    // Persistent state variable, which cannot be initialized in the trait
    owner: Address;

    // Internal function
    fun requireOwner() {
        throwUnless(TactExitCodeAccessDenied, context().sender == self.owner);
    }

    // Getter function with return type Address
    get fun owner(): Address {
        return self.owner;
    }
}
```

And the [contract](#contracts) that uses the trait [`Ownable{:tact}`](/ref/stdlib-ownable#ownable):

```tact
contract Treasure with Ownable {
    // Persistent state variable, which MUST be defined in the contract
    owner: Address;

    // Constructor function init(), where all the variables are initialized on-chain
    init(owner: Address) {
        self.owner = owner;
    }
}
```

Alternatively, a contract may use the [contract parameter syntax](/book/contracts#parameters), in which case it must list all the persistent state variables inherited from all of its traits:

```tact
contract Treasure(
    // Persistent state variable, to be defined at deployment
    owner: Address,
) with Ownable {}
```



================================================
FILE: docs/src/content/docs/book/upgrades.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/book/upgrades.mdx
================================================
---
title: Contract upgrades
description: "The Tact compiler allows, but does not encourage, code changes or upgrades after the contract is deployed."
---

The Tact compiler allows, but does not encourage, code changes or upgrades after the contract is deployed. While nice in theory, runtime code replacements introduce possible security, stability, and trust issues.

The latter is not negligible — many people expect smart contracts to behave like regular contracts, i.e., something that can be changed or reverted only by introducing a different contract, and **not** by modifying the existing one. Giving the owner a way to replace the code of an entire smart contract is usually considered a bad practice that can easily lead to rug pulls or other malicious actions that result in the loss of funds for the smart contract users.

It's safer to impose some restrictions, such as a time-locked upgrade that is applied only after it has been thoroughly tested and discussed within your community. For a sample implementation, read the following Cookbook page at your discretion and apply at your own risk: [Code and data upgrades](/cookbook/upgrades).



================================================
FILE: docs/src/content/docs/cookbook/access.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/cookbook/access.mdx
================================================
---
title: Access control
description: "This page lists common examples of working with privileges, ownership, and access control."
---

This page lists common examples of working with privileges, ownership, and access control.

## How to check sender privileges using the Ownable trait

```tact
// Ownable has to be imported from stdlib
import "@stdlib/ownable";

message FooBarMsg {
    newVal: Int as uint32;
}

// Ownable trait can limit certain actions to the owner only
contract SenderChecker with Ownable {
    // Persistent state variables
    owner: Address; // Ownable trait requires you to add this exact state variable
    val: Int as uint32; // some value

    init() {
        // We can initialize owner to any value we want, the deployer in this case:
        self.owner = sender();
        self.val = 0;
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }

    receive("inc") {
        self.requireOwner(); // Throws exit code 132 if the sender isn't the owner
        self.val += 1;
    }

    receive(msg: FooBarMsg) {
        self.requireOwner(); // Throws exit code 132 if the sender isn't the owner
        self.val = msg.newVal;
    }
}
```

:::note[Useful links:]

  [`trait Ownable{:tact}` in Core library](/ref/stdlib-ownable#ownable)

:::

:::tip[Hey there!]

  Didn't find your favorite example of access control? Have cool implementations in mind? [Contributions are welcome!](https://github.com/tact-lang/tact/issues)

:::



================================================
FILE: docs/src/content/docs/cookbook/algo.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/cookbook/algo.mdx
================================================
---
title: Algorithms
description: "Common algorithm implementations in Tact, generally geared towards contract development"
---

An algorithm is a finite sequence of rigorous instructions, typically used to solve a class of specific problems or to perform a computation.

:::danger[Not implemented]

  This page is a stub. [Contributions are welcome!](https://github.com/tact-lang/tact/issues)

:::



================================================
FILE: docs/src/content/docs/cookbook/data-structures.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/cookbook/data-structures.mdx
================================================
---
title: Data structures
description: "This page lists a handy collection of data structures implemented in Tact for your day-to-day needs and beyond."
---

Data structures are formats for data organization, management, and storage that are usually chosen for efficient access to data. More precisely, a data structure is a collection of data values, the relationships among them, and the functions or operations that can be applied to the data.

This page lists a handy collection of data structures implemented in Tact for your day-to-day needs and beyond.

All of the data structures listed here are made using the built-in [`map<K, V>{:tact}`][map] type. For a description and basic usage of maps, see the [dedicated page in the Book][map].

## Array

An [array](https://en.wikipedia.org/wiki/Array_(data_structure)) is a data structure consisting of a continuous block of memory, which represents a collection of elements of the same memory size, each identified by at least one array key or _index_.

The following example emulates an array using a [`map<Int, V>{:tact}`][map] wrapped in a [struct][struct], where `V{:tact}` can be any of the [allowed value types](/book/maps#allowed-types) of the map:

```tact
struct Array {
    // An array of Int values as a map of Ints to Ints,
    // with serialization of its keys to uint16 to save space
    m: map<Int as uint16, Int>;

    // Length of the array, defaults to 0
    length: Int = 0;
}

// Compile-time constant upper bound for our map representing an array.
const MaxArraySize: Int = 5_000; // 5,000 entries max, to stay reasonably far from limits

// Extension mutation function for adding new entries to the end of the array
extends mutates fun append(self: Array, item: Int) {
    require(self.length + 1 <= MaxArraySize, "No space in the array left for new items!");

    self.m.set(self.length, item); // set the entry (key-value pair)
    self.length += 1; // increase the length field
}

// Extension mutation function for inserting new entries at the given index
extends mutates fun insert(self: Array, item: Int, idx: Int) {
    require(self.length + 1 <= MaxArraySize, "No space in the array left for new items!");
    require(idx >= 0, "Index of the item cannot be negative!");
    require(idx < self.length, "Index is out of array bounds!");

    // Move all items from idx to the right
    let i: Int = self.length; // not a typo, as we need to start from the non-existing place
    while (i > idx) {
        // Note that we use the !! operator, as we know for sure the value would be there
        self.m.set(i, self.m.get(i - 1)!!);
        i -= 1;
    }

    // Insert the new item
    self.m.set(idx, item); // set the entry (key-value pair)
    self.length += 1; // increase the length field
}

// Extension function for getting the value at the given index
extends fun getIdx(self: Array, idx: Int): Int {
    require(self.length > 0, "No items in the array!");
    require(idx >= 0, "Index of the item cannot be negative!");
    require(idx < self.length, "Index is out of array bounds!");

    // Note that we use the !! operator, as we know for sure the value would be there
    return self.m.get(idx)!!;
}

// Extension function for returning the last value
extends fun getLast(self: Array): Int {
    require(self.length > 0, "No items in the array!");

    // Note that we use the !! operator, as we know for sure the value would be there
    return self.m.get(self.length - 1)!!;
}

// Extension mutation function for deleting an entry at the given index and returning its value
extends mutates fun deleteIdx(self: Array, idx: Int): Int {
    require(self.length > 0, "No items in the array to delete!");
    require(idx >= 0, "Index of the item cannot be negative!");
    require(idx < self.length, "Index is out of array bounds!");

    // Remember the value that is going to be deleted
    let memorized: Int = self.m.get(idx)!!;

    // Move all items from idx onwards to the left
    let i: Int = idx;
    while (i + 1 < self.length) {
        // Note that we use the !! operator, as we know for sure the value would be there
        self.m.set(i, self.m.get(i + 1)!!);
        i += 1;
    }

    self.m.set(self.length - 1, null); // delete the last entry
    self.length -= 1; // decrease the length field

    return memorized;
}

// Extension mutation function for deleting the last entry and returning its value
extends fun deleteLast(self: Array): Int {
    require(self.length > 0, "No items in the array!");

    // Note that we use the !! operator, as we know for sure the value would be there
    let lastItem: Int = self.m.get(self.length - 1)!!;
    self.m.set(self.length - 1, null); // delete the entry
    self.length -= 1; // decrease the length field

    return lastItem;
}

// Extension function for deleting all items in the Array
extends mutates fun deleteAll(self: Array) {
    self.m = emptyMap();
    self.length = 0;
}

// Global static function for creating an empty Array
fun emptyArray(): Array {
    return Array { m: emptyMap(), length: 0 }; // length defaults to 0
}

// Contract emulating an Array using the map
contract MapAsArray {
    // Persistent state variables
    array: Array;

    // Constructor (initialization) function of the contract
    init() {
        self.array = emptyArray();
    }

    // Internal message receiver, which responds to a `null` message body
    // If used for deployment, forwards the remaining value back to the sender
    receive() { cashback(sender()) }

    // Internal message receiver, which responds to a String message "append"
    receive("append") {
        // Add a new item
        self.array.append(42);
    }

    // Internal message receiver, which responds to a String message "delete_5th"
    receive("delete_5th") {
        // Remove the 5th item if it exists and reply back with its value, or raise an error
        self.reply(self.array.deleteIdx(4).toCoinsString().asComment()); // index offset 0 + 4 gives the 5th item
    }

    // Internal message receiver, which responds to a String message "del_last"
    receive("del_last") {
        // Remove the last item and reply back with its value, or raise an error
        self.reply(self.array.deleteLast().toCoinsString().asComment());
    }

    // Internal message receiver, which responds to a String message "get_last"
    receive("get_last") {
        // Reply back with the latest item in the array if it exists, or raise an error
        self.reply(self.array.getLast().toCoinsString().asComment());
    }

    // Internal message receiver, which responds to a String message "delete_all"
    receive("delete_all") {
        self.array.deleteAll();
    }
}
```

## Stack

A [stack](https://en.wikipedia.org/wiki/Stack_(abstract_data_type)) is a data structure consisting of a collection of elements with two main operations:

* push, which adds an element to the end of the collection
* pop, which removes the most recently added element

The following example emulates a stack using a [`map<Int, V>{:tact}`][map] wrapped in a [struct][struct], where `V{:tact}` can be any of the [allowed value types](/book/maps#allowed-types) of the map:

```tact
struct Stack {
    // A stack of Int values as a map of Ints to Ints,
    // with serialization of its keys to uint16 to save space
    m: map<Int as uint16, Int>;

    // Length of the stack, defaults to 0
    length: Int = 0;
}

// Compile-time constant upper bound for our map representing a stack.
const MaxStackSize: Int = 5_000; // 5,000 entries max, to stay reasonably far from limits

// Extension mutation function for adding new entries to the end of the stack
extends mutates fun push(self: Stack, item: Int) {
    require(self.length + 1 <= MaxStackSize, "No space in the stack left for new items!");

    self.m.set(self.length, item); // set the entry (key-value pair)
    self.length += 1; // increase the length field
}

// Extension mutation function for deleting the last entry and returning its value
extends mutates fun pop(self: Stack): Int {
    require(self.length > 0, "No items in the stack to delete!");

    // Note that we use the !! operator, as we know for sure that the value will be there
    let lastItem: Int = self.m.get(self.length - 1)!!;
    self.m.set(self.length - 1, null); // delete the entry
    self.length -= 1; // decrease the length field

    return lastItem;
}

// Extension function for returning the last value
extends fun peek(self: Stack): Int {
    require(self.length > 0, "No items in the stack!");

    // Note that we use the !! operator, as we know for sure that the value will be there
    return self.m.get(self.length - 1)!!;
}

// Extension function for deleting all items in the Stack
extends mutates fun deleteAll(self: Stack) {
    self.m = emptyMap();
    self.length = 0;
}

// Global static function for creating an empty Stack
fun emptyStack(): Stack {
    return Stack { m: emptyMap(), length: 0 }; // length defaults to 0
}

contract MapAsStack {
    // Persistent state variables
    stack: Stack; // our stack, which uses the map

    // Constructor (initialization) function of the contract
    init() {
        self.stack = emptyStack();
    }

    // Internal message receiver, which responds to a `null` message body
    // If used for deployment, forwards the remaining value back to the sender
    receive() { cashback(sender()) }

    // Internal message receiver, which responds to a String message "push"
    receive("push") {
        // Add a new item
        self.stack.push(42);
    }

    // Internal message receiver, which responds to a String message "pop"
    receive("pop") {
        // Remove the last item and reply with it
        self.reply(self.stack.pop().toCoinsString().asComment());
    }

    // Internal message receiver, which responds to a String message "peek"
    receive("peek") {
        // Reply back with the latest item in the map if it exists, or raise an error
        self.reply(self.stack.peek().toCoinsString().asComment());
    }

    // Internal message receiver, which responds to a String message "delete_all"
    receive("delete_all") {
        self.stack.deleteAll();
    }

    // Getter function for obtaining the stack
    get fun stack(): map<Int as uint16, Int> {
        return self.stack.m;
    }

    // Getter function for obtaining the current length of the stack
    get fun length(): Int {
        return self.stack.length;
    }
}
```

## Circular buffer

A [circular buffer](https://en.wikipedia.org/wiki/Circular_buffer) (circular queue, cyclic buffer, or ring buffer) is a data structure that uses a single, fixed-size [buffer](https://en.wikipedia.org/wiki/Data_buffer) as if it were connected end-to-end.

The following example emulates a circular buffer using a [`map<Int, V>{:tact}`][map] wrapped in a [struct][struct], where `V{:tact}` can be any of the [allowed value types](/book/maps#allowed-types) of the map:

```tact
struct CircularBuffer {
    // A circular buffer of Int values as a map of Ints to Ints,
    // with serialization of its keys to uint8 to save space
    m: map<Int as uint8, Int>;

    // Length of the circular buffer; defaults to 0
    length: Int = 0;

    // Current index into the circular buffer; defaults to 0
    start: Int = 0;
}

// Compile-time constant upper bound for our map representing a circular buffer.
const MaxCircularBufferSize: Int = 5;

// Extension mutation function for putting new items into the circular buffer
extends mutates fun put(self: CircularBuffer, item: Int) {
    if (self.length < MaxCircularBufferSize) {
        self.m.set(self.length, item); // store the item
        self.length += 1; // increase the length field
    } else {
        self.m.set(self.start, item); // store the item, overriding previous entry
        self.start = (self.start + 1) % MaxCircularBufferSize; // update starting position
    }
}

// Extension mutation function for getting an item from the circular buffer
extends mutates fun getIdx(self: CircularBuffer, idx: Int): Int {
    require(self.length > 0, "No items in the circular buffer!");
    require(idx >= 0, "Index of the item cannot be negative!");

    if (self.length < MaxCircularBufferSize) {
        // Note that we use the !! operator as we know for sure that the value will be there
        return self.m.get(idx % self.length)!!;
    }

    // Return the value rotating around the circular buffer, also guaranteed to be there
    return self.m.get((self.start + idx) % MaxCircularBufferSize)!!;
}

// Extension function for iterating over all items in the circular buffer and dumping them to the console
extends fun printAll(self: CircularBuffer) {
    let i: Int = self.start;
    repeat (self.length) {
        dump(self.m.get(i)!!); // !! tells the compiler this can't be null
        i = (i + 1) % MaxCircularBufferSize;
    }
}

// Extension function for deleting all items from the CircularBuffer
extends mutates fun deleteAll(self: CircularBuffer) {
    self.m = emptyMap();
    self.length = 0;
    self.start = 0;
}

// Global static function for creating an empty CircularBuffer
fun emptyCircularBuffer(): CircularBuffer {
    // Length and start default to 0
    return CircularBuffer { m: emptyMap(), length: 0, start: 0 };
}

// This contract records the last 5 timestamps of when a "timer" message was received
contract MapAsCircularBuffer {
    // Persistent state variables
    cBuf: CircularBuffer; // our circular buffer, which uses a map

    // Constructor (initialization) function of the contract
    init() {
        self.cBuf = emptyCircularBuffer();
    }

    // Internal message receiver, which responds to a `null` message body
    // If used for deployment, forwards the remaining value back to the sender
    receive() { cashback(sender()) }

    // Internal message receiver, which responds to a String message "timer"
    // and records the timestamp when it receives such a message
    receive("timer") {
        let timestamp: Int = now();
        self.cBuf.put(timestamp);
    }

    // Internal message receiver, which responds to a String message "get_first"
    // and replies with the first item of the circular buffer
    receive("get_first") {
        self.reply(self.cBuf.getIdx(0).toCoinsString().asComment());
    }

    // Internal message receiver, which responds to a String message "print_all"
    receive("print_all") {
        self.cBuf.printAll();
    }

    // Internal message receiver, which responds to a String message "delete_all"
    receive("delete_all") {
        self.cBuf.deleteAll();
    }
}
```

:::note

  This example is adapted from the [Arrays page in Tact-By-Example](https://tact-by-example.org/04-arrays).

:::

:::tip[Hey there!]

  Didn't find your favorite example of working with data structures? Have cool implementations in mind? [Contributions are welcome!](https://github.com/tact-lang/tact/issues)

:::

[map]: /book/maps
[struct]: /book/structs-and-messages#structs



================================================
FILE: docs/src/content/docs/cookbook/dexes/dedust.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/cookbook/dexes/dedust.mdx
================================================
---
title: DeDust.io
description: "This page lists examples of working with DeDust, a decentralized exchange and automated market maker built natively on TON Blockchain and DeDust Protocol."
sidebar:
  order: 1
---

[DeDust](https://dedust.io) is a decentralized exchange (DEX) and automated market maker (AMM) built natively on [TON Blockchain](https://ton.org) and [DeDust Protocol 2.0](https://docs.dedust.io/reference/tlb-schemes). DeDust is designed with meticulous attention to user experience (UX), gas efficiency, and extensibility.

Before going further, familiarize yourself with the following:

* [Receiving messages](/book/receive/)
* [Sending messages](/book/send/)
* [Fungible Tokens (Jettons)](/cookbook/jettons/)
* [DeDust Docs: Concepts](https://docs.dedust.io/docs/concepts)

## Swaps

Read more about swaps in the [DeDust documentation](https://docs.dedust.io/docs/swaps).

:::caution

  It is important to ensure that contracts are deployed. Sending funds to an inactive contract could result in irretrievable loss.

:::

All kinds of swaps use the `SwapStep{:tact}` and `SwapParams{:tact}` structures:

```tact
/// https://docs.dedust.io/reference/tlb-schemes#swapstep
struct SwapStep {
    // The pool that will perform the swap, e.g., pairs like TON/USDT or USDT/DUST
    poolAddress: Address;

    // The kind of swap to do: can only be 0 as of now
    kind: Int as uint1 = 0;

    // Minimum output of the swap
    // If the actual value is less than specified, the swap will be rejected
    limit: Int as coins = 0;

    // Reference to the next step, which can be used for multi-hop swaps
    // The type here is actually `SwapStep?`,
    // but specifying recursive types isn't allowed in Tact yet
    nextStep: Cell?;
}

/// https://docs.dedust.io/reference/tlb-schemes#swapparams
struct SwapParams {
    // Specifies a deadline to reject the swap if it arrives at the pool late
    // Accepts the number of seconds passed since the UNIX Epoch
    // Defaults to 0, which removes the deadline
    deadline: Int as uint32 = 0;

    // Specifies an address where funds will be sent after the swap
    // Defaults to `null`, causing the swap to use the sender's address
    recipientAddress: Address? = null;

    // Referral address required for the DeDust referral program
    // Defaults to `null`
    referralAddress: Address? = null;

    // Custom payload that will be attached to the fund transfer upon a successful swap
    // Defaults to `null`
    fulfillPayload: Cell? = null;

    // Custom payload that will be attached to the fund transfer upon a rejected swap
    // Defaults to `null`
    rejectPayload: Cell? = null;
}
```

### Swap Toncoin for any Jetton

:::note
The guides below use the [Jetton vault](https://docs.dedust.io/docs/concepts#vault). To obtain its address for your Jetton, refer to [this guide](https://docs.dedust.io/docs/swaps#step-1-find-the-vault-scale).
:::

```tact
/// https://docs.dedust.io/reference/tlb-schemes#message-swap
message(0xea06185d) NativeSwap {
    // Unique identifier used to trace transactions across multiple contracts
    // Defaults to 0, which means we don't mark messages to trace their chains
    queryId: Int as uint64 = 0;

    // Toncoin amount for the swap
    amount: Int as coins;

    // Inlined fields of SwapStep struct
    poolAddress: Address;
    kind: Int as uint1 = 0;
    limit: Int as coins = 0;
    nextStep: SwapStep? = null;

    // Set of parameters relevant for the whole swap
    swapParams: SwapParams;
}

// Let's say `swapAmount` is `ton("0.1")`, which is 10000000 nanoToncoins
fun swapToncoinForUSDT(swapAmount: Int) {
    send(SendParameters {
        // Address of the TON vault to send the message to
        to: address("EQDa4VOnTYlLvDJ0gZjNYm5PXfSmmtL6Vs6A_CZEtXCNICq_"),
        // Amount to swap plus a trade fee
        value: swapAmount + ton("0.2"),
        body: NativeSwap {
            amount: swapAmount,
            // Address of the swap pool, which is the TON/USDT pair in this case
            poolAddress: address("EQA-X_yo3fzzbDbJ_0bzFWKqtRuZFIRa1sJsveZJ1YpViO3r"),
            // Set of parameters relevant for the whole swap
            swapParams: SwapParams {}, // use defaults
        }.toCell(),
    });
}

//
// Helper structs described earlier on this page
//

struct SwapStep {
    poolAddress: Address;
    kind: Int as uint1 = 0;
    limit: Int as coins = 0;
    nextStep: Cell?;
}

struct SwapParams {
    deadline: Int as uint32 = 0;
    recipientAddress: Address? = null;
    referralAddress: Address? = null;
    fulfillPayload: Cell? = null;
    rejectPayload: Cell? = null;
}
```

### Swap a Jetton for another Jetton or Toncoin

```tact
/// https://docs.dedust.io/reference/tlb-schemes#message-swap-1
message(0xe3a0d482) JettonSwapPayload {
    // Inlined fields of SwapStep struct
    poolAddress: Address;
    kind: Int as uint1 = 0;
    limit: Int as coins = 0;
    nextStep: SwapStep? = null;

    // Set of parameters relevant for the entire swap
    swapParams: SwapParams;
}

/// NOTE: To calculate and provide the Jetton wallet address for the target user,
///       make sure to check the links after this code snippet.
fun swapJetton(targetJettonWalletAddress: Address) {
    send(SendParameters {
        to: targetJettonWalletAddress,
        value: ton("0.3"),
        body: JettonTransfer {
            // Unique identifier used to trace transactions across multiple contracts.
            // Set to 0, which means we don't mark messages to trace their chains.
            queryId: 0,
            // Jetton amount for the swap.
            amount: 10, // NOTE: change to your amount
            // Address of the Jetton vault to send the message to.
            destination: address("EQAYqo4u7VF0fa4DPAebk4g9lBytj2VFny7pzXR0trjtXQaO"),
            // Address to return any exceeding funds.
            responseDestination: myAddress(),
            forwardTonAmount: ton("0.25"),
            forwardPayload: JettonSwapPayload {
                // Address of the swap pool, which is the TON/USDT pair in this case.
                poolAddress: address("EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs"),
                // Set of parameters relevant for the entire swap.
                swapParams: SwapParams {}, // use defaults
            }.toCell(),
        }.toCell(),
    });
}

//
// Helper structs described earlier on this page
//

struct SwapStep {
    poolAddress: Address;
    kind: Int as uint1 = 0;
    limit: Int as coins = 0;
    nextStep: Cell?;
}

struct SwapParams {
    deadline: Int as uint32 = 0;
    recipientAddress: Address? = null;
    referralAddress: Address? = null;
    fulfillPayload: Cell? = null;
    rejectPayload: Cell? = null;
}

//
// Messages from the Jetton standard
//

message(0xf8a7ea5) JettonTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address;
    customPayload: Cell? = null;
    forwardTonAmount: Int as coins;
    forwardPayload: Cell?; // slightly adjusted
}
```

:::note[Useful links:]

  [Retrieving Jetton wallet address in TON Docs](https://docs.ton.org/develop/dapps/asset-processing/jettons#retrieving-jetton-wallet-addresses-for-a-given-user)\
  [How to calculate user's Jetton wallet address (offline)?](https://docs.ton.org/v3/guidelines/dapps/cookbook#how-to-calculate-users-jetton-wallet-address-offline)

:::

## Liquidity Provisioning

To provide liquidity to a particular DeDust pool, you must provide both assets. The pool will then issue special _LP tokens_ to the depositor's address.

Read more about liquidity provisioning in the [DeDust documentation](https://docs.dedust.io/docs/liquidity-provisioning).

```tact
/// https://docs.dedust.io/reference/tlb-schemes#message-deposit_liquidity-1
message(0x40e108d6) JettonDepositLiquidity {
    // Pool type: 0 for volatile, 1 for stable
    // A volatile pool is based on the "Constant Product" formula
    // A stable-swap pool is optimized for assets of near-equal value,
    // e.g., USDT/USDC, TON/stTON, etc.
    poolType: Int as uint1;

    // Provided assets
    asset0: Asset;
    asset1: Asset;

    // Minimal amount of LP tokens to be received
    // If less liquidity is provided, the provisioning will be rejected
    // Defaults to 0, making this value ignored
    minimalLpAmount: Int as coins = 0;

    // Target amount of the first asset
    targetBalances0: Int as coins;

    // Target amount of the second asset
    targetBalances1: Int as coins;

    // Custom payload attached to the transaction if the provisioning is successful
    // Defaults to `null`, which means no payload
    fulfillPayload: Cell? = null;

    // Custom payload attached to the transaction if the provisioning is rejected
    // Defaults to `null`, which means no payload
    rejectPayload: Cell? = null;
}

/// https://docs.dedust.io/reference/tlb-schemes#message-deposit_liquidity
message(0xd55e4686) NativeDepositLiquidity {
    // Unique identifier used to trace transactions across multiple contracts
    // Defaults to 0, which means messages are not marked to trace their chains
    queryId: Int as uint64 = 0;

    // Toncoin amount for the deposit
    amount: Int as coins;

    // Inlined fields of JettonDepositLiquidity message without the opcode prefix
    poolType: Int as uint1;
    asset0: Asset;
    asset1: Asset;
    minimalLpAmount: Int as coins = 0;
    targetBalances0: Int as coins;
    targetBalances1: Int as coins;
    fulfillPayload: Cell? = null;
    rejectPayload: Cell? = null;
}

/// https://docs.dedust.io/reference/tlb-schemes#asset
struct Asset {
    // Specify 0 for native (TON) and omit all following fields
    // Specify 1 for Jetton, then you must set non-null values for the following fields
    type: Int as uint4;

    workchain: Int as uint8 = 0; // Both these zeros will be removed during the .build() function. Only type will remain.
    address: Int as uint256 = 0;
}

const PoolTypeVolatile: Int = 0;
const PoolTypeStable: Int = 1;

const AssetTypeNative: Int = 0b0000;
const AssetTypeJetton: Int = 0b0001;

const JettonProvideLpGas: Int = ton("0.5");
const JettonProvideLpGasFwd: Int = ton("0.4");
const TonProvideLpGas: Int = ton("0.15");

// This example directly uses the provided `myJettonWalletAddress`.
// In real-world scenarios, it's more reliable to calculate this address on-chain or save it during initialization to prevent any issues.
fun provideLiquidity(myJettonWalletAddress: Address) {
    let jettonMasterRaw = parseStdAddress(
        address("EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs").asSlice(),
    );

    // Step 1. Prepare input
    let jettonAmount = ton("1");
    let tonAmount = ton("1");

    let asset0 = Asset {
        type: AssetTypeNative,
    };
    let asset1 = Asset {
        type: AssetTypeJetton,
        workchain: jettonMasterRaw.workchain,
        address: jettonMasterRaw.address,
    };

    // Step 2. Deposit Jetton to Vault
    let jettonDepositBody = JettonDepositLiquidity {
        poolType: PoolTypeVolatile,
        asset0,
        asset1,
        targetBalances0: tonAmount,
        targetBalances1: jettonAmount,
    }.build();
    // Notice .build() instead of .toCell(),
    // since we want some custom serialization logic.

    send(SendParameters {
        to: myJettonWalletAddress,
        value: JettonProvideLpGas,
        body: JettonTransfer {
            queryId: 42,
            amount: jettonAmount,
            // Jetton Vault
            destination: address("EQAYqo4u7VF0fa4DPAebk4g9lBytj2VFny7pzXR0trjtXQaO"),
            responseDestination: myAddress(),
            forwardTonAmount: JettonProvideLpGasFwd,
            forwardPayload: jettonDepositBody,
        }.toCell(),
    });

    // Step 3. Deposit TON to Vault
    let nativeDepositBody = NativeDepositLiquidity {
        queryId: 42,
        amount: tonAmount,
        poolType: PoolTypeVolatile,
        asset0,
        asset1,
        targetBalances0: tonAmount,
        targetBalances1: jettonAmount,
    }.build();
    // Notice .build() instead of .toCell(),
    // since we want some custom serialization logic.

    send(SendParameters {
        to: address("EQDa4VOnTYlLvDJ0gZjNYm5PXfSmmtL6Vs6A_CZEtXCNICq_"),
        value: tonAmount + TonProvideLpGas,
        body: nativeDepositBody,
    });
}

//
// Helper extension functions to build respective structures and messages
//

extends fun build(self: Asset): Cell {
    let assetBuilder = beginCell().storeUint(self.type, 4);

    if (self.type == AssetTypeNative) {
        return assetBuilder.endCell();
    }

    if (self.type == AssetTypeJetton) {
        return assetBuilder
            .storeUint(self.workchain, 8)
            .storeUint(self.address, 256)
            .endCell();
    }

    // Unknown asset type
    return beginCell().endCell();
}

extends fun build(self: JettonDepositLiquidity): Cell {
    return beginCell()
        .storeUint(0x40e108d6, 32)
        .storeUint(self.poolType, 1)
        .storeSlice(self.asset0.build().asSlice())
        .storeSlice(self.asset1.build().asSlice())
        .storeCoins(self.minimalLpAmount)
        .storeCoins(self.targetBalances0)
        .storeCoins(self.targetBalances1)
        .storeMaybeRef(self.fulfillPayload)
        .storeMaybeRef(self.rejectPayload)
        .endCell();
}

extends fun build(self: NativeDepositLiquidity): Cell {
    return beginCell()
        .storeUint(0xd55e4686, 32)
        .storeUint(self.queryId, 64)
        .storeCoins(self.amount)
        .storeUint(self.poolType, 1)
        .storeSlice(self.asset0.build().asSlice())
        .storeSlice(self.asset1.build().asSlice())
        .storeRef(
            beginCell()
                .storeCoins(self.minimalLpAmount)
                .storeCoins(self.targetBalances0)
                .storeCoins(self.targetBalances1)
                .endCell(),
        )
        .storeMaybeRef(self.fulfillPayload)
        .storeMaybeRef(self.rejectPayload)
        .endCell();
}

//
// Messages from the Jetton standard
//

message(0xf8a7ea5) JettonTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address?;
    customPayload: Cell? = null;
    forwardTonAmount: Int as coins;
    forwardPayload: Cell?; // Slightly adjusted
}
```

### Withdraw liquidity

To withdraw liquidity, burning LP tokens is required. You can refer to examples of Jetton burning in the [respective section of the Jettons Cookbook page](/cookbook/jettons#burning-jetton). However, more Toncoin should be added than for a normal burn, since adding too few may result in LP tokens being burned but no liquidity (or only partial liquidity) being sent from the pool. Therefore, consider attaching at least $0.5$ Toncoin — the excess amount will be returned.

:::tip[Hey there!]

Didn't find your favorite example of DeDust interaction? Have cool implementations in mind? [Contributions are welcome!](https://github.com/tact-lang/tact/issues)

:::



================================================
FILE: docs/src/content/docs/cookbook/dexes/stonfi.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/cookbook/dexes/stonfi.mdx
================================================
---
title: STON.fi
description: "This page lists examples of working with STON.fi, a decentralized automated market maker built on TON Blockchain."
sidebar:
  order: 2
---

[STON.fi](https://ston.fi) is a decentralized automated market maker (AMM) built on [TON blockchain](https://ton.org), providing virtually zero fees, low slippage, an extremely easy interface, and direct integration with TON wallets.

:::caution

  The examples on this page use STON.fi's API v2, which is currently under development. Thus, all addresses are given in [testnet][testnet].

  Proceed with caution and vigilance — do not attempt to send funds from the mainnet to the testnet and vice versa.

:::

Before going further, familiarize yourself with the following:

* [Receiving messages](/book/receive/)
* [Sending messages](/book/send/)
* [Fungible Tokens (Jettons)](/cookbook/jettons/)
* [STON.fi Docs: Glossary](https://docs.ston.fi/docs/user-section/glossary)
* [STON.fi Docs: Architecture](https://docs.ston.fi/docs/developer-section/architecture)

## Swaps

Read more about swaps in the [STON.fi documentation](https://docs.ston.fi/docs/developer-section/api-reference-v2/example_swap).

Swaps use the `StonfiSwap{:tact}` [Message][message] and the `SwapAdditionalData{:tact}` [struct][struct]:

```tact
/// https://docs.ston.fi/docs/developer-section/api-reference-v2/router#swap-0x6664de2a
message(0x6664de2a) StonfiSwap {
    // Address of the other Router token wallet
    otherTokenWallet: Address;

    // Where to send refunds upon a failed swap
    refundAddress: Address;

    // Where to send excesses upon a successful swap
    excessesAddress: Address;

    // UNIX timestamp of execution deadline for the swap
    deadline: Int as uint64;

    // Reference to another Cell with additional data,
    // using Tact's greedy auto-layout mechanism
    additionalData: SwapAdditionalData;
}

/// https://docs.ston.fi/docs/developer-section/api-reference-v2/router#additional_data-body
struct SwapAdditionalData {
    // Minimum required amount of tokens to receive
    // Defaults to 1, which causes the swap to fail
    //                only if no tokens are received
    minOut: Int as coins = 1;

    // Where to send tokens upon a successful swap
    receiverAddress: Address;

    // Forward fees for the `customPayload` if it's not `null`
    // Defaults to 0
    fwdGas: Int as coins = 0;

    // Custom payload that will be sent upon a successful swap
    // Defaults to `null`, which means no payload
    customPayload: Cell? = null;

    // Forward fees for `refundPayload` if it's not `null`
    // Defaults to 0
    refundFwdGas: Int as coins = 0;

    // Custom payload that will be sent upon a failed swap
    // Defaults to `null`, which means no payload
    refundPayload: Cell? = null;

    // Referral fee, between 0 (no fee) and 100 (1%)
    // Defaults to 10, which means 0.1% fee
    refFee: Int as uint16 = 10;

    // Address of the referral
    // Defaults to `null`
    referralAddress: Address? = null;
}
```

The [STON.fi SDK](https://github.com/ston-fi/sdk) defines some [constants to deal with fees](https://github.com/ston-fi/sdk/blob/786ece758794bd5c575db8b38f5e5de19f43f0d1/packages/sdk/src/contracts/dex/v2_1/router/BaseRouterV2_1.ts). Note that these are hardcoded values, but the best practice is to [calculate fees dynamically using current config params](https://docs.ton.org/v3/guidelines/smart-contracts/fee-calculation) instead.

```tact
/// Hardcoded fee value to pay for sending a message to the Jetton wallet
const FeeSwapJettonToJetton: Int = ton("0.3");
/// Hardcoded fee value to pay forward fees from the Jetton wallet
const FeeSwapJettonToJettonFwd: Int = ton("0.24");

/// Hardcoded fee value to pay for sending a message to the Jetton wallet
const FeeSwapJettonToToncoin: Int = ton("0.3");
/// Hardcoded fee value to pay for sending a message to the Jetton wallet
const FeeSwapJettonToToncoinFwd: Int = ton("0.24");

/// Hardcoded fee value to pay for sending a message and subsequent forwarding
const FeeSwapToncoinToJetton: Int = ton("0.01") + ton("0.3");
```

:::note[Useful links:]

  [Fees Calculation in TON Docs][fees-calc]

:::

### Jetton to Jetton {#swaps-jetton-to-jetton}

:::caution

  The following example uses STON.fi's API v2, which is currently under development. Thus, all addresses are given in [testnet][testnet].

  In addition, some variables such as `offerAmount` are hardcoded for demonstration purposes. Don't forget to change them in real-life scenarios.

:::

```tact
// CPI Router v2.1.0
const RouterAddress: Address = address("kQALh-JBBIKK7gr0o4AVf9JZnEsFndqO0qTCyT-D-yBsWk0v");

// Router Jetton Wallet address
const RouterJettonWallet: Address = address("kQAtX3x2s-wMtYTz8CfmAyloHAB73vONzJM5S2idqXl-_5xK");

/// NOTE: To calculate and provide the Jetton wallet address for the target user,
///       make sure to check the links after this code snippet.
fun jettonToJetton(myJettonWalletAddress: Address) {
    // Amount of Jettons to swap
    let offerAmount: Int = 100_000;

    // Prepare the payload
    let forwardPayload = StonfiSwap {
        otherTokenWallet: RouterJettonWallet,
        refundAddress: myAddress(),
        excessesAddress: myAddress(),
        // Deadline is set to 10,000 seconds from now
        deadline: now() + 10_000,
        additionalData: SwapAdditionalData { receiverAddress: myAddress() },
    };

    // Start a swap with the message to the Jetton wallet
    send(SendParameters {
        to: myJettonWalletAddress,
        value: FeeSwapJettonToJetton,
        body: JettonTransfer {
            queryId: 42,
            amount: offerAmount,
            destination: RouterAddress,
            responseDestination: myAddress(),
            forwardTonAmount: FeeSwapJettonToJettonFwd,
            forwardPayload: forwardPayload.toCell(),
        }.toCell(),
    });
}

//
// Helper structures and constants described earlier on this page
//

message(0x6664de2a) StonfiSwap {
    otherTokenWallet: Address;
    refundAddress: Address;
    excessesAddress: Address;
    deadline: Int as uint64;
    additionalData: SwapAdditionalData;
}

struct SwapAdditionalData {
    minOut: Int as coins = 1;
    receiverAddress: Address;
    fwdGas: Int as coins = 0;
    customPayload: Cell? = null;
    refundFwdGas: Int as coins = 0;
    refundPayload: Cell? = null;
    refFee: Int as uint16 = 10;
    referralAddress: Address? = null;
}

const FeeSwapJettonToJetton: Int = ton("0.3");
const FeeSwapJettonToJettonFwd: Int = ton("0.24");

//
// Messages from the Jetton standard
//

message(0xf8a7ea5) JettonTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address?;
    customPayload: Cell? = null;
    forwardTonAmount: Int as coins;
    forwardPayload: Cell?; // slightly adjusted
}
```

:::note[Useful links:]

  [Retrieving Jetton wallet address in TON Docs][jetton-addr-online]\
  [How to calculate user's Jetton wallet address (offline)?][jetton-addr-offline]\
  [Discoverable Jetton wallets][discoverable-jetton-wallets]\
  [Fees Calculation in TON Docs][fees-calc]

:::

### Jetton to Toncoin {#swaps-jetton-to-toncoin}

A Jetton to Toncoin swap is very similar to a [Jetton to Jetton swap](#swaps-jetton-to-jetton), with the only difference being that the `RouterJettonWallet{:tact}` address is replaced with `RouterProxyTonWallet{:tact}`.

:::caution

  The following example uses STON.fi's API v2, which is currently under development. Thus, all addresses are given in [testnet][testnet].

  In addition, some variables, such as `offerAmount`, are hardcoded for demonstration purposes. Don't forget to change them in real-life scenarios.

:::

```tact
// CPI Router v2.1.0
const RouterAddress: Address = address("kQALh-JBBIKK7gr0o4AVf9JZnEsFndqO0qTCyT-D-yBsWk0v");

// Router's pTON address
const RouterProxyTonWallet: Address = address("kQBbJjnahBMGbMUJwhAXLn8BiigcGXMJhSC0l7DBhdYABhG7");

/// NOTE: To calculate and provide the Jetton wallet address for the target user,
///       make sure to check links after this code snippet
fun jettonToToncoin(myJettonWalletAddress: Address) {
    // Amount of Jettons to swap
    let offerAmount: Int = 100_000;

    // Prepare the payload
    let forwardPayload = StonfiSwap {
        otherTokenWallet: RouterProxyTonWallet,
        refundAddress: myAddress(),
        excessesAddress: myAddress(),
        // Deadline is set to 10,000 seconds from now
        deadline: now() + 10_000,
        additionalData: SwapAdditionalData { receiverAddress: myAddress() },
    };

    // Start a swap with the message to the Jetton wallet
    send(SendParameters {
        to: myJettonWalletAddress,
        value: FeeSwapJettonToToncoin,
        body: JettonTransfer {
            queryId: 42,
            amount: offerAmount,
            destination: RouterAddress,
            responseDestination: myAddress(),
            forwardTonAmount: FeeSwapJettonToToncoinFwd,
            forwardPayload: forwardPayload.toCell(),
        }.toCell(),
    });
}

//
// Helper messages, structs, and constants described earlier on this page
//

message(0x6664de2a) StonfiSwap {
    otherTokenWallet: Address;
    refundAddress: Address;
    excessesAddress: Address;
    deadline: Int as uint64;
    additionalData: SwapAdditionalData;
}

struct SwapAdditionalData {
    minOut: Int as coins = 1;
    receiverAddress: Address;
    fwdGas: Int as coins = 0;
    customPayload: Cell? = null;
    refundFwdGas: Int as coins = 0;
    refundPayload: Cell? = null;
    refFee: Int as uint16 = 10;
    referralAddress: Address? = null;
}

const FeeSwapJettonToToncoin: Int = ton("0.3");
const FeeSwapJettonToToncoinFwd: Int = ton("0.24");

//
// Messages from the Jetton standard
//

message(0xf8a7ea5) JettonTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address?;
    customPayload: Cell? = null;
    forwardTonAmount: Int as coins;
    forwardPayload: Cell?; // slightly adjusted
}
```

:::note[Useful links:]

  [Retrieving Jetton wallet address in TON Docs][jetton-addr-online]\
  [How to calculate user's Jetton wallet address (offline)?][jetton-addr-offline]\
  [Discoverable Jetton wallets][discoverable-jetton-wallets]\
  [Fees Calculation in TON Docs][fees-calc]

:::

### Toncoin to Jetton {#swaps-jetton-to-toncoin}

To swap Toncoin to Jetton, STON.fi requires the use of a so-called proxy Toncoin wallet (or pTON for short). To interact with it properly, we need to introduce a `ProxyToncoinTransfer{:tact}` [Message][message]:

```tact
/// https://github.com/ston-fi/sdk/blob/786ece758794bd5c575db8b38f5e5de19f43f0d1/packages/sdk/src/contracts/pTON/v2_1/PtonV2_1.ts
message(0x01f3835d) ProxyToncoinTransfer {
    // Unique identifier used to trace transactions across multiple contracts
    // Defaults to 0, which means we don't mark messages to trace their chains
    queryId: Int as uint64 = 0;

    // Toncoin amount for the swap
    tonAmount: Int as coins;

    // Address to send refunds to upon a failed swap
    refundAddress: Address;

    // Optional custom payload to attach to the swap
    // Defaults to `null`
    forwardPayload: Cell?;
}
```

Notice that `ProxyToncoinTransfer{:tact}` is quite similar to `JettonTransfer{:tact}`, except that it doesn't require any addresses other than the refund address, nor does it require any forward amounts to be specified.

:::caution

  The following example uses STON.fi's API v2, which is currently under development. Thus, all addresses are given in [testnet][testnet].

  In addition, some variables such as `offerAmount` are hardcoded for demonstration purposes. Don't forget to change them in real-life scenarios.

:::

```tact
// Router's pTON wallet address
const RouterProxyTonWallet: Address = address("kQBbJjnahBMGbMUJwhAXLn8BiigcGXMJhSC0l7DBhdYABhG7");

// Router's Jetton wallet address
const RouterJettonWallet: Address = address("kQAtX3x2s-wMtYTz8CfmAyloHAB73vONzJM5S2idqXl-_5xK");

fun toncoinToJetton() {
    // Amount of Toncoin to swap
    let offerAmount: Int = 1_000;

    // Prepare the payload
    let forwardPayload = StonfiSwap {
        otherTokenWallet: RouterJettonWallet,
        refundAddress: myAddress(),
        excessesAddress: myAddress(),
        // Deadline is set to 10,000 seconds from now
        deadline: now() + 10_000,
        additionalData: SwapAdditionalData { receiverAddress: myAddress() },
    };

    // Start a swap with the message to the proxy Toncoin wallet
    send(SendParameters {
        to: RouterProxyTonWallet,
        value: FeeSwapToncoinToJetton + offerAmount,
        body: ProxyToncoinTransfer {
            tonAmount: offerAmount,
            refundAddress: myAddress(),
            forwardPayload: forwardPayload.toCell(),
        }.toCell(),
    });
}

//
// Helper structures and constants described earlier on this page
//

message(0x01f3835d) ProxyToncoinTransfer {
    queryId: Int as uint64 = 0;
    tonAmount: Int as coins;
    refundAddress: Address;
    forwardPayload: Cell?;
}

message(0x6664de2a) StonfiSwap {
    otherTokenWallet: Address;
    refundAddress: Address;
    excessesAddress: Address;
    deadline: Int as uint64;
    additionalData: SwapAdditionalData;
}

struct SwapAdditionalData {
    minOut: Int as coins = 1;
    receiverAddress: Address;
    fwdGas: Int as coins = 0;
    customPayload: Cell? = null;
    refundFwdGas: Int as coins = 0;
    refundPayload: Cell? = null;
    refFee: Int as uint16 = 10;
    referralAddress: Address? = null;
}

const FeeSwapToncoinToJetton: Int = ton("0.3");
```

:::note[Useful links:]

  [Fees Calculation in TON Docs][fees-calc]

:::

## Liquidity provision

Read more about liquidity provision in the [STON.fi documentation](https://docs.ston.fi/docs/developer-section/api-reference-v2/example_lp_provide).

STON.fi allows you to deposit liquidity by specifying only one type of token. The pool will automatically perform the swap and mint liquidity provider (LP) tokens. To do this, you need to set the `bothPositive` field of the `ProvideLiquidity{:tact}` [Message][message] to `false{:tact}`.

Liquidity deposits use the `ProvideLiquidity{:tact}` [Message][message] and `ProvideLiquidityAdditionalData{:tact}` [struct][struct]:

```tact
/// https://docs.ston.fi/docs/developer-section/api-reference-v2/router#provide_lp-0x37c096df
message(0x37c096df) ProvideLiquidity {
    // Address of the other Router token wallet
    otherTokenWallet: Address;

    // Where to send refunds if provisioning fails
    refundAddress: Address;

    // Where to send excesses if provisioning succeeds
    excessesAddress: Address;

    // UNIX timestamp of execution deadline for the provisioning
    deadline: Int as uint64;

    // Reference to another Cell with additional data,
    // using Tact's greedy auto-layout mechanism
    additionalData: ProvideLiquidityAdditionalData;
}

/// https://docs.ston.fi/docs/developer-section/api-reference-v2/router#additional_data-body-1
struct ProvideLiquidityAdditionalData {
    // Minimum required amount of LP tokens to receive
    // Defaults to 1, which causes the provisioning to fail
    //                only if no tokens are received
    minLpOut: Int as coins = 1;

    // Where to send LP tokens if provisioning succeeds
    receiverAddress: Address;

    // Should both tokens in a pair have a positive quantity?
    // If not, then the pool will perform an additional swap for the lacking token.
    // Defaults to `true`, meaning the deposit will only go through
    // when both token amounts are non-zero.
    bothPositive: Bool = true;

    // Forward fees for the `customPayload` if it is not `null`
    // Defaults to 0
    fwdGas: Int as coins = 0;

    // Custom payload that will be sent if provisioning succeeds
    // Defaults to `null`, meaning no payload
    customPayload: Cell? = null;
}
```

The [STON.fi SDK](https://github.com/ston-fi/sdk) defines some [constants to deal with fees](https://github.com/ston-fi/sdk/blob/786ece758794bd5c575db8b38f5e5de19f43f0d1/packages/sdk/src/contracts/dex/v2_1/router/BaseRouterV2_1.ts). Note that these are hardcoded values, but the best practice is to [calculate fees dynamically using current config parameters](https://docs.ton.org/v3/guidelines/smart-contracts/fee-calculation) instead.

```tact
/// Hardcoded fee value to pay for sending a liquidity provisioning message
/// when depositing a certain amount of Jettons
const FeeSingleSideProvideLpJetton: Int = ton("1");

/// Hardcoded fee value to pay forward fees of subsequent messages for liquidity provisioning
const FeeSingleSideProvideLpJettonFwd: Int = ton("0.8");

/// Hardcoded fee value to pay for sending a liquidity provisioning message
/// when depositing a certain amount of Toncoins
const FeeSingleSideProvideLpToncoin: Int = ton("0.01") + ton("0.8");
```

:::note[Useful links:]

  [Fees Calculation in TON Docs][fees-calc]

:::

### Jetton deposit

:::caution

  The following example uses STON.fi's API v2, which is currently under development. Thus, all addresses are given in [testnet][testnet].

  In addition, some variables such as `offerAmount` are hardcoded for demonstration purposes. Don't forget to change them in real-life scenarios.

:::

```tact
// CPI Router v2.1.0
const RouterAddress: Address = address("kQALh-JBBIKK7gr0o4AVf9JZnEsFndqO0qTCyT-D-yBsWk0v");

// Router's pTON wallet address
const RouterProxyTonWallet: Address = address("kQBbJjnahBMGbMUJwhAXLn8BiigcGXMJhSC0l7DBhdYABhG7");

// Router's Jetton wallet address
const RouterJettonWallet: Address = address("kQAtX3x2s-wMtYTz8CfmAyloHAB73vONzJM5S2idqXl-_5xK");

/// NOTE: To calculate and provide the Jetton wallet address for the target user,
///       make sure to check the links after this code snippet.
fun jettonDeposit(myJettonWalletAddress: Address) {
    // Amount of Jettons for liquidity provisioning
    let offerAmount = 100_000;

    // Prepare the payload
    let forwardPayload = ProvideLiquidity {
        otherTokenWallet: RouterProxyTonWallet,
        refundAddress: myAddress(),
        excessesAddress: myAddress(),
        // Deadline is set to 1,000 seconds from now
        deadline: now() + 1_000,
        additionalData: ProvideLiquidityAdditionalData {
            receiverAddress: myAddress(),
            bothPositive: false, // i.e., single side
        },
    };

    send(SendParameters {
        to: myJettonWalletAddress,
        value: FeeSingleSideProvideLpJetton,
        body: JettonTransfer {
            queryId: 42,
            amount: offerAmount,
            destination: RouterAddress,
            responseDestination: myAddress(),
            forwardTonAmount: FeeSingleSideProvideLpJettonFwd,
            forwardPayload: forwardPayload.toCell(),
        }.toCell(),
    });
}

//
// Helper structures and constants described earlier on this page
//

message(0x37c096df) ProvideLiquidity {
    otherTokenWallet: Address;
    refundAddress: Address;
    excessesAddress: Address;
    deadline: Int as uint64;
    additionalData: ProvideLiquidityAdditionalData;
}

struct ProvideLiquidityAdditionalData {
    minLpOut: Int as coins = 1;
    receiverAddress: Address;
    bothPositive: Bool = true;
    fwdGas: Int as coins = 0;
    customPayload: Cell? = null;
}

const FeeSingleSideProvideLpJetton: Int = ton("1");
const FeeSingleSideProvideLpJettonFwd: Int = ton("0.8");

//
// Messages from the Jetton standard
//

message(0xf8a7ea5) JettonTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address?;
    customPayload: Cell? = null;
    forwardTonAmount: Int as coins;
    forwardPayload: Cell?; // slightly adjusted
}
```

### Toncoin deposit

:::caution

  The following example uses STON.fi's API v2, which is currently under development. Thus, all addresses are given on [testnet][testnet].

  In addition, some variables, such as `offerAmount`, are hardcoded for demonstration purposes. Don't forget to change them in real-life scenarios.

:::

```tact
// Router's pTON wallet address
const RouterProxyTonWallet: Address = address("kQBbJjnahBMGbMUJwhAXLn8BiigcGXMJhSC0l7DBhdYABhG7");

// Router's Jetton wallet address
const RouterJettonWallet: Address = address("kQAtX3x2s-wMtYTz8CfmAyloHAB73vONzJM5S2idqXl-_5xK");

fun toncoinDeposit() {
    // Amount of Jettons for liquidity provisioning
    let offerAmount = 100_000;

    // Prepare the payload
    let forwardPayload = ProvideLiquidity {
        otherTokenWallet: RouterJettonWallet,
        refundAddress: myAddress(),
        excessesAddress: myAddress(),
        deadline: now() + 1000,
        additionalData: ProvideLiquidityAdditionalData {
            receiverAddress: myAddress(),
            bothPositive: false, // i.e. single side
        },
    };

    send(SendParameters {
        to: RouterProxyTonWallet,
        value: FeeSingleSideProvideLpToncoin + offerAmount,
        body: ProxyToncoinTransfer {
            queryId: 42,
            tonAmount: offerAmount,
            refundAddress: myAddress(),
            forwardPayload: forwardPayload.toCell(),
        }.toCell(),
    });
}

//
// Helper messages, structs, and constants described earlier on this page
//

message(0x01f3835d) ProxyToncoinTransfer {
    queryId: Int as uint64 = 0;
    tonAmount: Int as coins;
    refundAddress: Address;
    forwardPayload: Cell?;
}

message(0x37c096df) ProvideLiquidity {
    otherTokenWallet: Address;
    refundAddress: Address;
    excessesAddress: Address;
    deadline: Int as uint64;
    additionalData: ProvideLiquidityAdditionalData;
}

struct ProvideLiquidityAdditionalData {
    minLpOut: Int as coins = 1;
    receiverAddress: Address;
    bothPositive: Bool = true;
    fwdGas: Int as coins = 0;
    customPayload: Cell? = null;
}

const FeeSingleSideProvideLpToncoin: Int = ton("0.01") + ton("0.8");
```

### Withdraw liquidity

To withdraw liquidity, burning LP tokens is required. You can refer to examples of Jetton burning in the [respective section of the Jettons Cookbook page](/cookbook/jettons#burning-jetton). However, more Toncoin should be added than for a normal burn, since adding too little may result in LP tokens being burned but no (or only partial) liquidity being sent from the pool. Therefore, consider attaching at least $0.5$ Toncoin — any excess amount will be returned.

:::tip[Hey there!]

Didn't find your favorite example of STON.fi interaction? Have cool implementations in mind? [Contributions are welcome!](https://github.com/tact-lang/tact/issues)

:::

[struct]: /book/structs-and-messages#structs
[message]: /book/structs-and-messages#messages

[testnet]: https://docs.ton.org/v3/documentation/smart-contracts/getting-started/testnet
[jetton-addr-online]: https://docs.ton.org/develop/dapps/asset-processing/jettons#retrieving-jetton-wallet-addresses-for-a-given-user
[jetton-addr-offline]: https://docs.ton.org/v3/guidelines/dapps/cookbook#how-to-calculate-users-jetton-wallet-address-offline
[discoverable-jetton-wallets]: https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md
[fees-calc]: https://docs.ton.org/v3/guidelines/smart-contracts/fee-calculation



================================================
FILE: docs/src/content/docs/cookbook/index.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/cookbook/index.mdx
================================================
---
title: Cookbook overview
description: "The Cookbook section focuses on everyday tasks that every Tact developer resolves during the development of smart contracts."
---

import { LinkCard, Card, CardGrid, Steps } from '@astrojs/starlight/components';

The main reason for creating the Tact Cookbook is to gather all the experiences of Tact developers in one place so that future developers can use it. This section of the documentation focuses on everyday tasks that every Tact developer resolves during the development of smart contracts.

Use it as a recipe book for cooking up delightful smart contracts on TON Blockchain without reinventing the wheel in the process.

For DeFi-specific elaborate recipes that include smart contracts, auxiliary scripts, and testing suites, see the [Tact's DeFi Cookbook on GitHub](https://github.com/tact-lang/defi-cookbook).

<Steps>

1. #### Single contract {#single-contract}

   The following pages focus on single-contract examples and cover a wide range of topics:

   <CardGrid>
     <LinkCard
       title="1️⃣ Single-contract communication"
       href="/cookbook/single-communication"
     />
     <LinkCard
       title="⚙️ Type conversion"
       href="/cookbook/type-conversion"
     />
     <LinkCard
       title="📦 Data structures"
       href="/cookbook/data-structures"
     />
     <LinkCard
       title="🤖 Algorithms"
       href="/cookbook/algo"
     />
     <LinkCard
       title="📆 Time and date"
       href="/cookbook/time"
     />
     <LinkCard
       title="⚠️ Access control"
       href="/cookbook/access"
     />
     <LinkCard
       title="✨ Randomness"
       href="/cookbook/random"
     />
     <LinkCard
       title="🔄 Code upgrades"
       href="/cookbook/upgrades"
     />
     <LinkCard
       title="🤔 Miscellaneous"
       href="/cookbook/misc"
     />
   </CardGrid>

2. #### Multiple contracts {#multiple-contracts}

   The following pages focus on multi-contract examples, exploring the scalable nature of TON Blockchain:

   <CardGrid>
     <LinkCard
       title="🧮 Multi-contract communication"
       href="/cookbook/multi-communication"
     />
     <LinkCard
       title="💎 Fungible Tokens (Jettons)"
       href="/cookbook/jettons"
     />
     <LinkCard
       title="🖼️ Non-Fungible Tokens (NFTs)"
       href="/cookbook/nfts"
     />
   </CardGrid>

   Additionally, there are examples of working with popular TON DEXes (Decentralized EXchanges), which often require many contracts and complex logic:

   <CardGrid>
     <LinkCard
       title="DeDust.io"
       href="/cookbook/dexes/dedust"
     />
     <LinkCard
       title="STON.fi"
       href="/cookbook/dexes/stonfi"
     />
   </CardGrid>

3. #### DeFi Cookbook on GitHub {#defi-cookbook}

   As an extension of this Cookbook, we've made a special GitHub repository for elaborate recipes that include smart contracts, auxiliary scripts, and testing suites. Here are some of the recipes of the [Tact's DeFi Cookbook on GitHub](https://github.com/tact-lang/defi-cookbook):

   <CardGrid>
     <LinkCard
       title="Receive Jettons"
       href="https://github.com/tact-lang/defi-cookbook/tree/main/jettons/receive-jettons"
     />
     <LinkCard
       title="Receive USDT"
       href="https://github.com/tact-lang/defi-cookbook/tree/main/jettons/receive-usdt"
     />
     <LinkCard
       title="Send Jettons"
       href="https://github.com/tact-lang/defi-cookbook/tree/main/jettons/send-jettons"
     />
     <LinkCard
       title="Send USDT"
       href="https://github.com/tact-lang/defi-cookbook/tree/main/jettons/send-usdt"
     />
     <LinkCard
       title="Mint USDT"
       href="https://github.com/tact-lang/defi-cookbook/tree/main/jettons/mint-usdt"
     />
     <LinkCard
       title="Onchain API"
       href="https://github.com/tact-lang/defi-cookbook/tree/main/jettons/onchain-api"
     />
   </CardGrid>

</Steps>



================================================
FILE: docs/src/content/docs/cookbook/jettons.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/cookbook/jettons.mdx
================================================
---
title: Fungible Tokens (Jettons)
description: "Common examples of working with Fungible Tokens (Jettons) in Tact"
---

This page lists common examples of working with [Fungible Tokens (Jettons)](https://docs.ton.org/develop/dapps/asset-processing/jettons).

Jettons are token standards on the TON Blockchain, designed to create fungible tokens (similar to ERC-20 on Ethereum) using a decentralized approach. They are implemented as a pair of smart contracts, typically consisting of two core components:

* Jetton Master Contract (Jetton master)
* Jetton Wallet Contract (Jetton wallet)

These contracts interact with each other to manage token supply, distribution, transfers, and other operations related to the Jetton.

## Jetton Master Contract

The Jetton Master Contract serves as the central entity for a given Jetton. It maintains critical information about the Jetton itself. Key responsibilities and data stored in the Jetton Master Contract include:

* Jetton metadata: Information such as the token's name, symbol, total supply, and decimals.

* Minting and burning: When new Jettons are minted (created), the Jetton Master manages the creation process and distributes them to the appropriate wallets. It also manages the burning (destruction) of tokens as needed.

* Supply management: The Jetton Master keeps track of the total supply of Jettons and ensures proper accounting of all issued Jettons.

## Jetton Wallet Contract

The Jetton Wallet Contract represents an individual holder's token wallet and is responsible for managing the balance and token-related operations for a specific user. Each user or entity holding Jettons will have its own unique Jetton Wallet Contract. Key features of the Jetton Wallet Contract include:

* Balance tracking: The wallet contract stores the user's token balance.

* Token transfers: The wallet is responsible for handling token transfers between users. When a user sends Jettons, the Jetton Wallet Contract ensures proper transfer and communication with the recipient's wallet. The Jetton Master is not involved in this activity and does not create a bottleneck. Wallets can effectively utilize TON's sharding capability.

* Token burning: The Jetton Wallet interacts with the Jetton Master to burn tokens.

* Owner control: The wallet contract is owned and controlled by a specific user, meaning that only the owner of the wallet can initiate transfers or other token operations.

## Examples

The following are common examples of working with Jettons.

For larger Jetton recipes that include smart contracts, auxiliary scripts, and testing suites, see the [Tact's DeFi Cookbook on GitHub](https://github.com/tact-lang/defi-cookbook).

### Accepting Jetton transfer

The transfer notification message has the following structure:

```tact
message(0x7362d09c) JettonTransferNotification {
    // Unique identifier used to trace transactions across multiple contracts
    // Defaults to 0, which means we don't mark messages to trace their chains
    queryId: Int as uint64 = 0;

    // Amount of Jettons transferred
    amount: Int as coins;

    // Address of the sender of the Jettons
    sender: Address;

    // Optional custom payload
    forwardPayload: Slice as remaining;
}
```

Use the [receiver](/book/receive) function to accept token notification messages.

:::caution

  The sender of transfer notifications must be validated!

:::

The sender of a transfer notification must be validated because malicious actors could attempt to spoof notifications from an unauthorized account. If this validation is not performed, the contract may accept unauthorized transactions, leading to potential security vulnerabilities.

Validation is performed using the Jetton address from the contract:

1. Sender sends a message with `0xf8a7ea5` as its 32-bit header (opcode) to their Jetton wallet.
2. The Jetton wallet transfers funds to the contract's Jetton wallet.
3. After successfully accepting the transfer, the contract's Jetton wallet sends a transfer notification to its owner contract.
4. The contract validates the Jetton message.

You may obtain the contract's Jetton wallet address using the [`contractAddress(){:tact}`](/ref/core-addresses#contractaddress) function or calculating this address offchain.

To obtain the Jetton wallet's state init, you need the wallet's data and code. While there is a common structure for the initial data layout, it may differ in some cases, such as with [USDT](#usdt-jetton-operations).

Since notifications originate from your contract's Jetton wallet, the function [`myAddress(){:tact}`](/ref/core-contextstate#myaddress) should be used in the `ownerAddress` field.

:::caution

  Notifications are not always guaranteed to be sent. By default, the implementation does not send a notification if the `forwardAmount` is set to zero. Therefore, in such cases, you cannot rely on notifications being sent.

:::

```tact
struct JettonWalletData {
    balance: Int as coins;
    ownerAddress: Address;
    jettonMasterAddress: Address;
    jettonWalletCode: Cell;
}

fun calculateJettonWalletAddress(
    ownerAddress: Address,
    jettonMasterAddress: Address,
    jettonWalletCode: Cell,
): Address {
    let initData = JettonWalletData {
        balance: 0,
        ownerAddress,
        jettonMasterAddress,
        jettonWalletCode,
    };

    return contractAddress(StateInit {
        code: jettonWalletCode,
        data: initData.toCell(),
    });
}

message(0x7362d09c) JettonTransferNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    forwardPayload: Slice as remaining;
}

contract Example {
    myJettonWalletAddress: Address;
    myJettonAmount: Int as coins = 0;

    init(jettonWalletCode: Cell, jettonMasterAddress: Address) {
        self.myJettonWalletAddress = calculateJettonWalletAddress(
            myAddress(),
            jettonMasterAddress,
            jettonWalletCode,
        );
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }

    receive(msg: JettonTransferNotification) {
        require(
            sender() == self.myJettonWalletAddress,
            "Notification not from your jetton wallet!",
        );

        self.myJettonAmount += msg.amount;

        // Forward excesses
        self.forward(msg.sender, null, false, null);
    }
}
```

### Sending Jetton transfer

A Jetton transfer is the process of sending a specified amount of Jettons from one wallet (contract) to another.

To send a Jetton transfer, use the [`send(){:tact}`](/book/send) function.

```tact
message(0xf8a7ea5) JettonTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address?;
    customPayload: Cell? = null;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

const JettonTransferGas: Int = ton("0.05");

struct JettonWalletData {
    balance: Int as coins;
    ownerAddress: Address;
    jettonMasterAddress: Address;
    jettonWalletCode: Cell;
}

fun calculateJettonWalletAddress(
    ownerAddress: Address,
    jettonMasterAddress: Address,
    jettonWalletCode: Cell,
): Address {
    let initData = JettonWalletData {
        balance: 0,
        ownerAddress,
        jettonMasterAddress,
        jettonWalletCode,
    };

    return contractAddress(StateInit {
        code: jettonWalletCode,
        data: initData.toCell(),
    });
}

message Withdraw {
    amount: Int as coins;
}

contract Example {
    myJettonWalletAddress: Address;
    myJettonAmount: Int as coins = 0;

    init(jettonWalletCode: Cell, jettonMasterAddress: Address) {
        self.myJettonWalletAddress = calculateJettonWalletAddress(
            myAddress(),
            jettonMasterAddress,
            jettonWalletCode,
        );
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }

    receive(msg: Withdraw) {
        require(
            msg.amount <= self.myJettonAmount,
            "Not enough funds to withdraw",
        );

        send(SendParameters {
            to: self.myJettonWalletAddress,
            value: JettonTransferGas,
            body: JettonTransfer {
                // Unique identifier used to trace transactions across multiple contracts
                queryId: 42,
                // Jetton amount to transfer
                amount: msg.amount,
                // Where to transfer Jettons:
                // this is the address of the Jetton wallet
                // owner and not the Jetton wallet itself
                destination: sender(),
                // Where to send a confirmation notice of a successful transfer
                // and the remainder of the incoming message value
                responseDestination: sender(),
                // Can be used for custom logic of the Jettons themselves,
                // or set to null otherwise
                customPayload: null,
                // Amount to transfer with JettonTransferNotification,
                // which is needed for the execution of custom logic
                forwardTonAmount: 1, // if it's 0, the notification won't be sent!
                // Compile-time way of expressing:
                //     beginCell().storeUint(0xF, 4).endCell().beginParse()
                // For more complicated transfers, adjust accordingly
                forwardPayload: rawSlice("F"),
            }.toCell(),
        });
    }
}
```

### Burning Jetton

Jetton burning is the process of permanently removing a specified amount of Jettons from circulation, with no possibility of recovery.

```tact
message(0x595f07bc) JettonBurn {
    queryId: Int as uint64;
    amount: Int as coins;
    responseDestination: Address?;
    customPayload: Cell? = null;
}

const JettonBurnGas: Int = ton("0.05");

struct JettonWalletData {
    balance: Int as coins;
    ownerAddress: Address;
    jettonMasterAddress: Address;
    jettonWalletCode: Cell;
}

fun calculateJettonWalletAddress(
    ownerAddress: Address,
    jettonMasterAddress: Address,
    jettonWalletCode: Cell,
): Address {
    let initData = JettonWalletData {
        balance: 0,
        ownerAddress,
        jettonMasterAddress,
        jettonWalletCode,
    };

    return contractAddress(StateInit {
        code: jettonWalletCode,
        data: initData.toCell(),
    });
}

message ThrowAway {
    amount: Int as coins;
}

contract Example {
    myJettonWalletAddress: Address;
    myJettonAmount: Int as coins = 0;

    init(jettonWalletCode: Cell, jettonMasterAddress: Address) {
        self.myJettonWalletAddress = calculateJettonWalletAddress(
            myAddress(),
            jettonMasterAddress,
            jettonWalletCode,
        );
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }

    receive(msg: ThrowAway) {
        require(
            msg.amount <= self.myJettonAmount,
            "Not enough funds to throw away",
        );

        send(SendParameters {
            to: self.myJettonWalletAddress,
            value: JettonBurnGas,
            body: JettonBurn {
                // Unique identifier used to trace transactions across multiple contracts
                queryId: 42,
                // Jetton amount you want to burn
                amount: msg.amount,
                // Destination address for a confirmation notice of a successful burn
                // and the remainder of the incoming message value
                responseDestination: sender(),
                // Can be used for custom logic of Jettons;
                // if unused, it can be set to null
                customPayload: null,
            }.toCell(),
        });
    }
}
```

### USDT Jetton operations

Operations with USDT (on TON) remain the same, except that `JettonWalletData` will have the following structure:

```tact
struct JettonWalletData {
    status: Int as uint4;
    balance: Int as coins;
    ownerAddress: Address;
    jettonMasterAddress: Address;
}

// The function to calculate the wallet address may look like this:
fun calculateJettonWalletAddress(
    ownerAddress: Address,
    jettonMasterAddress: Address,
    jettonWalletCode: Cell,
): Address {
    let initData = JettonWalletData {
        status: 0,
        balance: 0,
        ownerAddress,
        jettonMasterAddress,
    };

    return contractAddress(StateInit {
        code: jettonWalletCode,
        data: initData.toCell(),
    });
}
```

### Onchain metadata creation

```tact
/// https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-example-offchain
fun composeJettonMetadata(
    // Full name
    name: String,

    // Text description of the Jetton
    description: String,

    // "Stock ticker" symbol without the $ prefix, like USDT or SCALE
    symbol: String,

    // Link to the image
    image: String,

    // There could be other data, see:
    // https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-attributes
): Cell {
    let dict: map<Int as uint256, Cell> = emptyMap();
    dict.set(sha256("name"), name.asMetadataCell());
    dict.set(sha256("description"), description.asMetadataCell());
    dict.set(sha256("symbol"), symbol.asMetadataCell());
    dict.set(sha256("image"), image.asMetadataCell());

    return beginCell()
        .storeUint(0, 8) //                a null byte prefix
        .storeMaybeRef(dict.asCell()!!) // 1 as a single bit, then a reference
        .endCell();
}

// Taking flight!
fun poorMansLaunchPad() {
    let jettonMetadata = composeJettonMetadata(
        "Best Jetton",
        "A very descriptive description describing the Jetton descriptively",
        "JETTON",
        "...link to ipfs or somewhere trusted...",
    );
}

// Prefixes the String with a single null byte and converts it to a Cell
// The null byte prefix is used to express metadata in various standards, like NFT or Jetton
inline extends fun asMetadataCell(self: String): Cell {
    return beginTailString().concat(self).toCell();
}
```

:::note[Useful links:]

  [Token Data Standard in TEPs](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-attributes)

:::

:::tip[Hey there!]

  Didn't find your favorite example of Jetton usage? Have cool implementations in mind? [Contributions are welcome!](https://github.com/tact-lang/tact/issues)

  For complete and exhaustive Jetton recipes that include smart contracts, auxiliary scripts, and testing suites, see the [Tact's DeFi Cookbook on GitHub](https://github.com/tact-lang/defi-cookbook).

:::



================================================
FILE: docs/src/content/docs/cookbook/misc.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/cookbook/misc.mdx
================================================
---
title: Miscellaneous
description: "Various niche examples which don't yet have a dedicated page but are useful and interesting nonetheless."
---

Various niche examples which don't yet have a dedicated page but are useful and interesting nonetheless.

## How to throw errors

The `throw(){:tact}` function in a contract is useful when we don't know how often to perform a specific action.

It allows intentional exception or error handling, which leads to the termination of the current transaction and reverts any state changes made during that transaction.

```tact
let number: Int = 198;

// the error will be triggered anyway
try {
    throw(36);
} catch (exitCode) {}

// the error will be triggered only if the number is greater than 50
try {
    throwIf(35, number > 50);
} catch (exitCode) {}

// the error will be triggered only if the number is NOT EQUAL to 198
try {
    throwUnless(39, number == 198);
} catch (exitCode) {}
```

:::note[Useful links:]

  [`throw(){:tact}` in Core library](/ref/core-debug#throw)\
  [Errors in Tact-By-Example](https://tact-by-example.org/03-errors)

:::

:::tip[Hey there!]

  Didn't find your favorite example of working with something niche? Have cool implementations in mind? [Contributions are welcome!](https://github.com/tact-lang/tact/issues)

:::



================================================
FILE: docs/src/content/docs/cookbook/multi-communication.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/cookbook/multi-communication.mdx
================================================
---
title: Multi-contract communication
description: "Common examples of communication between multiple deployed contracts on the blockchain"
prev:
  link: /cookbook/misc
  label: Miscellaneous
---

:::danger[Not implemented]

  This page is a stub. [Contributions are welcome!](https://github.com/tact-lang/tact/issues)

:::



================================================
FILE: docs/src/content/docs/cookbook/nfts.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/cookbook/nfts.mdx
================================================
---
title: Non-Fungible Tokens (NFTs)
description: "Common examples of working with Non-Fungible Tokens (NFTs) in Tact"
---

This page lists common examples of working with [NFTs](https://docs.ton.org/develop/dapps/asset-processing/nfts).

## Accepting NFT ownership assignment

The notification message of assigned NFT ownership has the following structure:

```tact
message(0x05138d91) NFTOwnershipAssigned {
    queryId: Int as uint64;
    previousOwner: Address;
    forwardPayload: Slice as remaining;
}
```

Use the [receiver](/book/receive) function to accept the notification message.

:::caution

  The sender of the notification must be validated!

:::

Validation can be done in two ways:

1. Directly store the NFT item address and validate against it.

```tact
message(0x05138d91) NFTOwnershipAssigned {
    queryId: Int as uint64;
    previousOwner: Address;
    forwardPayload: Slice as remaining;
}

contract SingleNft {
    nftItemAddress: Address;

    init(nftItemAddress: Address) {
        self.nftItemAddress = nftItemAddress;
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }

    receive(msg: NFTOwnershipAssigned) {
        require(self.nftItemAddress == sender(), "NFT contract is not the sender");

        // your logic of processing NFT ownership assignment notification
    }
}
```

2. Use [`StateInit{:tact}`](/book/expressions#initof) and the derived address of the NFT item.

```tact
message(0x05138d91) NFTOwnershipAssigned {
    queryId: Int as uint64;
    previousOwner: Address;
    forwardPayload: Slice as remaining;
}

struct NFTItemInitData {
    index: Int as uint64;
    collectionAddress: Address;
}

inline fun calculateNFTAddress(index: Int, collectionAddress: Address, nftCode: Cell): Address {
    let initData = NFTItemInitData {
        index,
        collectionAddress,
    };

    return contractAddress(StateInit { code: nftCode, data: initData.toCell() });
}

contract NftInCollection {
    nftCollectionAddress: Address;
    nftItemIndex: Int as uint64;
    nftCode: Cell;

    init(nftCollectionAddress: Address, nftItemIndex: Int, nftCode: Cell) {
        self.nftCollectionAddress = nftCollectionAddress;
        self.nftItemIndex = nftItemIndex;
        self.nftCode = nftCode;
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }

    receive(msg: NFTOwnershipAssigned) {
        let expectedNftAddress = calculateNFTAddress(self.nftItemIndex, self.nftCollectionAddress, self.nftCode); // or you can even store expectedNftAddress
        require(expectedNftAddress == sender(), "NFT contract is not the sender");

        // your logic of processing NFT ownership assignment notification
    }
}
```

Since the initial data layout of the NFT item can vary, the first approach is often more suitable.

## Transferring an NFT item

To send an NFT item transfer, use the [`send(){:tact}`](/book/send) function.

```tact
message(0x5fcc3d14) NFTTransfer {
    queryId: Int as uint64;
    newOwner: Address; // Address of the new owner of the NFT item.
    responseDestination: Address; // Address to send a response confirming a successful transfer and the remaining incoming message coins.
    customPayload: Cell? = null; // Optional custom data. In most cases, this should be null.
    forwardAmount: Int as coins; // The amount of nanotons to be sent to the new owner.
    forwardPayload: Slice as remaining; // Optional custom data that should be sent to the new owner.
}

contract Example {
    nftItemAddress: Address;

    init(nftItemAddress: Address) {
        self.nftItemAddress = nftItemAddress;
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }

    // ... add more code from previous examples ...

    receive("transfer") {
        send(SendParameters {
            to: self.nftItemAddress,
            value: ton("0.1"),
            body: NFTTransfer {
                queryId: 42,
                // FIXME: Change this according to your needs.
                newOwner: sender(),
                responseDestination: myAddress(),
                customPayload: null,
                forwardAmount: 1,
                forwardPayload: rawSlice("F"), // Precomputed beginCell().storeUint(0xF, 4).endCell().beginParse()
            }.toCell(),
        });
    }
}
```

## Get NFT static info

Note that TON Blockchain does not allow contracts to call each other's [getters](https://docs.tact-lang.org/book/contracts#getter-functions). To retrieve data from another contract, you must exchange messages.

```tact
message(0x2fcb26a2) NFTGetStaticData {
    queryId: Int as uint64;
}

message(0x8b771735) NFTReportStaticData {
    queryId: Int as uint64;
    index: Int as uint256;
    collection: Address;
}

struct NFTItemInitData {
    index: Int as uint64;
    collectionAddress: Address;
}

inline fun calculateNFTAddress(index: Int, collectionAddress: Address, nftCode: Cell): Address {
    let initData = NFTItemInitData {
        index,
        collectionAddress,
    };

    return contractAddress(StateInit { code: nftCode, data: initData.toCell() });
}

contract Example {
    nftCollectionAddress: Address;
    nftItemIndex: Int as uint64;
    nftCode: Cell;

    init(nftCollectionAddress: Address, nftItemIndex: Int, nftCode: Cell) {
        self.nftCollectionAddress = nftCollectionAddress;
        self.nftItemIndex = nftItemIndex;
        self.nftCode = nftCode;
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }

    // ... add more code from previous examples ...

    receive("get static data") {
        // FIXME: Put proper address("[NFT_ADDRESS]") here
        let nftAddress = sender();
        send(SendParameters {
            to: nftAddress,
            value: ton("0.1"),
            body: NFTGetStaticData {
                queryId: 42,
            }.toCell(),
        });
    }

    receive(msg: NFTReportStaticData) {
        let expectedNftAddress = calculateNFTAddress(msg.index, msg.collection, self.nftCode);
        require(expectedNftAddress == sender(), "NFT contract is not the sender");

        // Save NFT static data or do something
    }
}
```

## Get NFT royalty params

NFT royalty parameters are described [here](https://github.com/ton-blockchain/TEPs/blob/master/text/0066-nft-royalty-standard.md).

```tact
message(0x693d3950) NFTGetRoyaltyParams {
    queryId: Int as uint64;
}

message(0xa8cb00ad) NFTReportRoyaltyParams {
    queryId: Int as uint64;
    numerator: Int as uint16;
    denominator: Int as uint16;
    destination: Address;
}

contract Example {
    nftCollectionAddress: Address;

    init(nftCollectionAddress: Address) {
        self.nftCollectionAddress = nftCollectionAddress;
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }

    // ... add more code from previous examples ...

    receive("get royalty params") {
        send(SendParameters {
            to: self.nftCollectionAddress,
            value: ton("0.1"),
            body: NFTGetRoyaltyParams {
                queryId: 42,
            }.toCell(),
        });
    }

    receive(msg: NFTReportRoyaltyParams) {
        require(self.nftCollectionAddress == sender(), "NFT collection contract is not the sender");

        // Do something with msg
    }
}
```

## NFT Collection methods


:::caution

  These methods are not part of any standard, and they will only work with [this specific implementation](https://github.com/ton-blockchain/token-contract/blob/main/nft/nft-collection.fc). Please keep this in mind before using them.

:::

Note that only NFT owners are allowed to use these methods.

### Deploy NFT

```tact
message(0x1) NFTDeploy {
    queryId: Int as uint64;
    itemIndex: Int as uint64;
    amount: Int as coins; // amount to send when deploying NFT
    nftContent: Cell;
}

contract Example {
    nftCollectionAddress: Address;

    init(nftCollectionAddress: Address) {
        self.nftCollectionAddress = nftCollectionAddress;
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }

    // ... add more code from previous examples ...

    receive("deploy") {
        send(SendParameters {
            to: self.nftCollectionAddress,
            value: ton("0.14"),
            body: NFTDeploy {
                queryId: 42,
                itemIndex: 42,
                amount: ton("0.1"),
                nftContent: beginCell().endCell(), // FIXME: Replace with your content, usually generated off-chain
            }.toCell(),
        });
    }
}
```

### Change owner

```tact
message(0x3) NFTChangeOwner {
    queryId: Int as uint64;
    newOwner: Address;
}

contract Example {
    nftCollectionAddress: Address;

    init(nftCollectionAddress: Address) {
        self.nftCollectionAddress = nftCollectionAddress;
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value to the sender
    receive() { cashback(sender()) }

    // ... add more code from previous examples ...

    receive("change owner") {
        send(SendParameters {
            to: self.nftCollectionAddress,
            value: ton("0.05"),
            body: NFTChangeOwner {
                queryId: 42,
                // FIXME: Replace with the appropriate address("NEW_OWNER_ADDRESS")
                newOwner: sender(),
            }.toCell(),
        });
    }
}
```

## On-chain metadata creation

### NFT Collection {#onchain-metadata-nft-collection}

```tact
/// https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#nft-metadata-attributes
fun composeCollectionMetadata(
    // Full name
    name: String,

    // Text description of the collection
    description: String,

    // Link to the image
    image: String,

    // There could be other data, see:
    // https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#nft-metadata-attributes
): Cell {
    let dict: map<Int as uint256, Cell> = emptyMap();
    dict.set(sha256("name"), name.asMetadataCell());
    dict.set(sha256("description"), description.asMetadataCell());
    dict.set(sha256("image"), image.asMetadataCell());

    return beginCell()
        .storeUint(0, 8) //                a null byte prefix
        .storeMaybeRef(dict.asCell()!!) // 1 as a single bit, then a reference
        .endCell();
}

// Taking flight!
fun poorMansLaunchPad() {
    let collectionMetadata = composeCollectionMetadata(
        "Best Collection",
        "A very descriptive description describing the collection descriptively",
        "...link to IPFS or somewhere trusted...",
    );
}

// Prefixes the String with a single null byte and converts it to a Cell.
// The null byte prefix is used to express metadata in various standards, like NFT or Jetton.
inline extends fun asMetadataCell(self: String): Cell {
    return beginTailString().concat(self).toCell();
}
```

:::note[Useful links:]

  [Token Data Standard in TEPs](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#nft-metadata-attributes)\
  [Off-chain NFT metadata by GetGems](https://github.com/getgems-io/nft-contracts/blob/main/docs/metadata.md)

:::

### NFT Item {#onchain-metadata-nft-item}

```tact
/// https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#nft-metadata-attributes
fun composeItemMetadata(
    // Full name
    name: String,

    // Text description of the NFT
    description: String,

    // Link to the image
    image: String,

    // There could be other data, see:
    // https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#nft-metadata-attributes
): Cell {
    let dict: map<Int as uint256, Cell> = emptyMap();
    dict.set(sha256("name"), name.asMetadataCell());
    dict.set(sha256("description"), description.asMetadataCell());
    dict.set(sha256("image"), image.asMetadataCell());

    return beginCell()
        .storeUint(0, 8) //                a null byte prefix
        .storeMaybeRef(dict.asCell()!!) // 1 as a single bit, then a reference
        .endCell();
}

// Taking flight!
fun poorMansLaunchPad() {
    let itemMetadata = composeItemMetadata(
        "Best Item",
        "A very descriptive description describing the item descriptively",
        "...link to ipfs or somewhere trusted...",
    );
}

// Prefixes the String with a single null byte and converts it to a Cell
// The null byte prefix is used to express metadata in various standards, like NFT or Jetton
inline extends fun asMetadataCell(self: String): Cell {
    return beginTailString().concat(self).toCell();
}
```

:::note[Useful links:]

  [Token Data Standard in TEPs](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#nft-metadata-attributes)\
  [Off-chain NFT metadata by GetGems](https://github.com/getgems-io/nft-contracts/blob/main/docs/metadata.md)

:::

:::tip[Hey there!]

  Didn't find your favorite example of NFT communication? Have cool implementations in mind? [Contributions are welcome!](https://github.com/tact-lang/tact/issues)

:::



================================================
FILE: docs/src/content/docs/cookbook/random.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/cookbook/random.mdx
================================================
---
title: Randomness
description: "Common examples of working with random numbers, uncertainty, and randomness in general"
---

This page lists examples of working with random numbers, uncertainty, and randomness in general.

## How to generate a random number

```tact
// Declare a variable to store the random number
let number: Int = 0;

// Generate a new random number, which is an unsigned 256-bit integer
number = randomInt();

// Generate a random number between 1 and 12
number = random(1, 12);
```

:::note[Useful links:]

  [`randomInt(){:tact}` in Core library](/ref/core-random#randomint)\
  [`random(){:tact}` in Core library](/ref/core-random#random)

:::

:::tip[Hey there!]

  Didn't find your favorite example of working with randomness? Have cool implementations in mind? [Contributions are welcome!](https://github.com/tact-lang/tact/issues)

:::



================================================
FILE: docs/src/content/docs/cookbook/single-communication.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/cookbook/single-communication.mdx
================================================
---
title: Single-contract communication
description: "Common examples of communication between a single deployed contract and other contracts on blockchain"
prev:
  link: /cookbook
  label: Cookbook overview
---

This page lists examples of communication between a single deployed contract and other contracts on blockchain.

For examples of communication between multiple deployed contracts, see: [Multi-contract communication](/cookbook/multi-communication).

## How to make a basic reply

```tact
contract Example {
    receive() {
        self.reply("Hello, World!".asComment()); // asComment converts a String to a Cell with a comment
    }
}
```

## How to send a simple message

```tact
contract Example {
    receive() {
        send(SendParameters {
            bounce: true, // default
            to: sender(), // or another destination address
            value: ton("0.01"), // attached amount of TON to send
            body: "Hello from Tact!".asComment(), // comment (optional)
        });
    }
}
```

## How to send a message with the entire balance

If we need to send the whole balance of the smart contract, we should use the `SendRemainingBalance{:tact}` send mode. Alternatively, we can use `mode: 128{:tact}`, which has the same meaning.

```tact
contract Example {
    receive() {
        send(SendParameters {
            // bounce = true by default
            to: sender(), // send the message back to the original sender
            value: 0,
            mode: SendRemainingBalance, // or mode: 128
            body: "Hello from Tact!".asComment(), // comment (optional)
        });
    }
}
```

## How to send a message with the remaining value

If we want to send a reply to the same sender, we can use the mode `SendRemainingValue{:tact}` (i.e. `mode: 64{:tact}`), which carries all the remaining value of the inbound message in addition to the value initially indicated in the new message.

```tact
contract Example {
    receive() {
        send(SendParameters {
            // bounce = true by default
            to: sender(), // send the message back to the original sender
            value: 0,
            mode: SendRemainingValue,
            body: "Hello from Tact!".asComment(), // comment (optional)
        });
    }
}
```

It's often useful to add the `SendIgnoreErrors{:tact}` flag too, in order to ignore any errors arising while processing this message during the action phase:

```tact
contract Example {
    receive() {
        send(SendParameters {
            // bounce = true by default
            to: sender(), // send the message back to the original sender
            value: 0,
            mode: SendRemainingValue | SendIgnoreErrors, // prefer using | over + for the mode
            body: "Hello from Tact!".asComment(), // comment (optional)
        });
    }
}
```

The latter example is identical to using the [`self.reply(){:tact}` function](#how-to-make-a-basic-reply).

## How to send a message with a long text comment

If we need to send a message with a lengthy text comment, we should create a [`String{:tact}`](/book/types#primitive-types) consisting of more than 127 characters. To do this, we can utilize the [`StringBuilder{:tact}`](/book/types#primitive-types) primitive type and its methods `beginComment(){:tact}` and `append(){:tact}`. Prior to sending, we should convert this string into a cell using the `toCell(){:tact}` method.

```tact
contract Example {
    receive() {
        let comment: StringBuilder = beginComment();
        let longString = "..."; // Some string with more than 127 characters.
        comment.append(longString);

        send(SendParameters {
            // bounce = true by default
            to: sender(),
            value: 0,
            mode: SendIgnoreErrors,
            body: comment.toCell(),
        });
    }
}
```

:::note[Useful links:]

  ["Sending messages" in the Book](/book/send#send-message)\
  ["Message `mode`" in the Book](/book/message-mode)\
  [`StringBuilder{:tact}` in the Book](/book/types#primitive-types)\
  [`Cell{:tact}` in Core library](/ref/core-cells)

:::

## How to commit the state for the sequence number

To prevent the possibility of replay attacks, you can use unique identifiers, such as `seqno`. Yet, the changes made to it must persist. To do so, the [`commit(){:tact}`](/ref/core-contextstate#commit) function is used.

```tact {20}
message MsgWithSignedData {
    bundle: SignedBundle;
    seqno: Int as uint64;
    someExtraData: Cell;
}

contract Sample(
    publicKey: Int as uint256,
    seqno: Int as uint64,
) {
    external(msg: MsgWithSignedData) {
        // Various checks with accepting the external message processing afterwards
        require(msg.bundle.verifySignature(self.publicKey), "Invalid signature");
        require(msg.seqno == self.seqno, "Invalid seqno");
        acceptMessage();

        // Since we have done all the checks we can now safely increase the number,
        // then commit the state of persistent data and output actions,
        // and, finally, save that state early, before any further actions take place.
        self.seqno += 1;
        commit();
        setData(self.toCell());

        // And now you can safely do something with the rest of the message,
        // knowing that the `self.seqno` change will not be reverted in case of errors
        throw(42); // this will prevent subsequent code from executing,
        //            but will not fail the transaction!
    }

    // Empty receiver for the deployment,
    // which forwards the remaining value back to the sender
    receive() { cashback(sender()) }
}
```

:::tip[Hey there!]

  Didn't find your favorite example of single-contract communication? Have cool implementations in mind? [Contributions are welcome!](https://github.com/tact-lang/tact/issues)

:::



================================================
FILE: docs/src/content/docs/cookbook/time.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/cookbook/time.mdx
================================================
---
title: Time and date
description: "Common examples of working with time and date in Tact"
---

## How to get the current time

Use the `now(){:tact}` method to obtain the current standard [Unix time](https://en.wikipedia.org/wiki/Unix_time).

If you need to store the time in a state or encode it in a message, use the following [serialization](/book/integers#serialization): `Int as uint32{:tact}`.

```tact
let currentTime: Int = now();

if (currentTime > 1672080143) {
    // do something
}
```

:::note[Useful links:]

  [`now(){:tact}` in Core library](/ref/core-contextstate#now)\
  ["Current Time" in Tact-By-Example](https://tact-by-example.org/04-current-time)

:::

:::tip[Hey there!]

  Didn't find your favorite example of working with time and date? Have cool implementations in mind? [Contributions are welcome!](https://github.com/tact-lang/tact/issues)

:::



================================================
FILE: docs/src/content/docs/cookbook/type-conversion.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/cookbook/type-conversion.mdx
================================================
---
title: Type conversion
description: "Common examples of converting between primitive types and obtaining them from composite types"
---

This page shows examples of converting between [primitive types][p] and obtaining them from [composite types](/book/types#composite-types).

## `Int` ↔ `String` {#int-string}

### How to convert a `String` to an `Int`

```tact
// Define a new extension function for type String that returns a value of type Int
// Caution: produces unexpected results when the String contains non-numeric characters!
extends fun toInt(self: String): Int {
    // Cast the String as a Slice for parsing
    let string: Slice = self.asSlice();

    // A variable to store the accumulated number
    let acc: Int = 0;

    // Loop until the String is empty
    while (!string.empty()) {
        let char: Int = string.loadUint(8); // load 8 bits (1 byte) from the Slice
        acc = (acc * 10) + (char - 48); //     use ASCII table to get numeric value
        // Note that this approach would produce unexpected results
        //   when the starting String contains non-numeric characters!
    }

    // Produce the resulting number
    return acc;
}

fun runMe() {
    let string: String = "26052021";
    dump(string.toInt());
}
```

### How to convert an `Int` to a `String`

```tact
let number: Int = 261119911;

// Converting the [number] to a String
let numberString: String = number.toString();

// Converting the [number] to a float String,
//   where the passed argument 3 is the exponent of 10^{-3} in the resulting float String,
//   and it can be any integer between 0 and 76, inclusive.
let floatString: String = number.toFloatString(3);

// Converting the [number] as coins to a human-readable String
let coinsString: String = number.toCoinsString();

dump(numberString); // "261119911"
dump(floatString); //  "261119.911"
dump(coinsString); //  "0.261119911"
```

:::note[Useful links:]

  [`Int.toString(){:tact}` in Core library](/ref/core-strings#inttostring)\
  [`Int.toFloatString(){:tact}` in Core library](/ref/core-strings#inttofloatstring)\
  [`Int.toCoinsString(){:tact}` in Core library](/ref/core-strings#inttocoinsstring)

:::

## `Struct` or `Message` ↔ `Cell` or `Slice` {#structmessage-cellslice}

### How to convert an arbitrary `Struct` or `Message` to a `Cell` or a `Slice`

```tact {19-20, 22-23}
struct Profit {
    big: String?;
    dict: map<Int, Int as uint64>;
    energy: Int;
}

message(0x45) Nice {
    maybeStr: String?;
}

fun convert() {
    let st = Profit {
        big: null,
        dict: null,
        energy: 42,
    };
    let msg = Nice { maybeStr: "Message of the day!" };

    st.toCell();
    msg.toCell();

    st.toCell().asSlice();
    msg.toCell().asSlice();
}
```

:::note[Useful links:]

  [`Struct.toCell(){:tact}` in Core library](/ref/core-cells#structtocell)\
  [`Message.toCell(){:tact}` in Core library](/ref/core-cells#messagetocell)

:::

### How to convert a `Cell` or a `Slice` to an arbitrary `Struct` or `Message`

```tact {19-20, 22-23}
struct Profit {
    big: String?;
    dict: map<Int, Int as uint64>;
    energy: Int;
}

message(0x45) Nice {
    maybeStr: String?;
}

fun convert() {
    let stCell = Profit {
        big: null,
        dict: null,
        energy: 42,
    }.toCell();
    let msgCell = Nice { maybeStr: "Message of the day!" }.toCell();

    Profit.fromCell(stCell);
    Nice.fromCell(msgCell);

    Profit.fromSlice(stCell.asSlice());
    Nice.fromSlice(msgCell.asSlice());
}
```

:::note[Useful links:]

  [`Struct.fromCell(){:tact}` in Core library](/ref/core-cells#structfromcell)\
  [`Struct.fromSlice(){:tact}` in Core library](/ref/core-cells#structfromslice)\
  [`Message.fromCell(){:tact}` in Core library](/ref/core-cells#messagefromcell)\
  [`Message.fromSlice(){:tact}` in Core library](/ref/core-cells#messagefromslice)

:::

:::tip[Hey there!]

  Didn't find your favorite example of type conversion? Have a cool implementation in mind? [Contributions are welcome!](https://github.com/tact-lang/tact/issues)

:::

[p]: /book/types#primitive-types



================================================
FILE: docs/src/content/docs/cookbook/upgrades.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/cookbook/upgrades.mdx
================================================
---
title: Code and data upgrades
description: "This page lists examples of traits that can be used to allow upgrading the code or data of your smart contracts."
---

Traits and helper functions that can be used to upgrade your smart contract's code, data, or both.

:::caution

  Information is provided "as is," without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and noninfringement. In no event shall TON Studio and the Tact compiler authors be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the information or the use or other dealings in the information.

:::

## Direct upgrade

```tact
import "@stdlib/ownable";

/// Message for upgrading contract code and data.
message Upgrade {
    /// New code of the contract.
    /// Defaults to `null`, which keeps the previous code.
    code: Cell? = null;

    /// New data of the contract.
    /// Defaults to `null`, which keeps the previous data.
    data: Cell? = null;
}

/// Implements a basic upgrade mechanism with owner validation.
trait Upgradable with Ownable {
    /// Contract owner address that can perform upgrades.
    owner: Address;

    /// Current contract version, auto-increments after each upgrade.
    /// Meant to be private and only accessible through the relevant getter.
    _version: Int as uint32;

    /// Checks the sender, performs an upgrade, and increments the version.
    receive(msg: Upgrade) {
        let ctx = context();
        self.validateUpgrade(ctx, msg);
        self.upgrade(ctx, msg);

        self._version += 1;
    }

    /// Checks that the sender is the owner.
    /// Can be overridden.
    virtual inline fun validateUpgrade(_: Context, __: Upgrade) {
        self.requireOwner();
    }

    /// Sets the code if it's not `null`.
    /// Sets the data if it's not `null`.
    /// Can be overridden.
    virtual inline fun upgrade(_: Context, msg: Upgrade) {
        if (msg.code != null) {
            // Change of code will be applied at the end of this transaction
            setCode(msg.code!!);
        }
        if (msg.data != null) {
            // Change of data will be immediate
            setData(msg.data!!);

            // By the end of every transaction,
            // the Tact compiler automatically adds a call to setData() for your convenience.
            // However, we've already set the data ourselves,
            // so let's stop the execution now to prevent a secondary call to setData().
            throw(0);
        }
    }

    /// A getter to check if the contract uses this trait.
    get fun isUpgradable(): Bool {
        return true;
    }

    /// A getter returning the current version of the contract.
    get fun version(): Int {
        return self._version;
    }
}

/// Change of code will be applied by the end of the current transaction.
asm fun setCode(code: Cell) { SETCODE }
```

## Time-locked upgrade

This upgrade is performed in two steps by sending two messages:

1. An `Upgrade{:tact}` message specifying a timeout before the upgrade can be completed.
2. A `Confirm{:tact}` message, after which the last received `Upgrade{:tact}` is applied.

If the second message is sent before the timeout expires, the contract will throw an error and will not be upgraded.

```tact
import "@stdlib/ownable";

/// Message for upgrading contract code and data with a timeout.
message Upgrade {
    /// New code of the contract.
    /// Defaults to `null`, which keeps the previous code.
    code: Cell? = null;

    /// New data of the contract.
    /// Defaults to `null`, which keeps the previous data.
    data: Cell? = null;

    /// Delay in seconds before upgrade can be confirmed.
    /// Defaults to zero, which means the upgrade can be confirmed immediately.
    /// Unused in `Upgradable` trait.
    timeout: Int = 0;
}

/// Message for confirming delayed upgrade execution.
/// Must be sent after the timeout specified in the `Upgrade` message has elapsed.
/// Can only be processed by contracts that implement the `DelayedUpgradable` trait.
message Confirm {}

/// Extended version of `Upgradable` that adds a delay mechanism.
///
/// The upgrade process happens in two steps:
/// 1. Owner initiates an upgrade by sending the `Upgrade` message.
/// 2. After a timeout period, the owner confirms the upgrade by sending the `Confirm` message.
trait DelayedUpgradable with Upgradable {
    /// Contract owner address that can perform upgrades.
    owner: Address;

    /// Current contract version, auto-increments after each upgrade.
    /// Meant to be private and only accessible through the relevant getter.
    _version: Int as uint32;

    /// Timestamp in seconds of the last `Upgrade` message arrival.
    /// Used to enforce a timeout period before the confirmation.
    initiatedAt: Int;

    /// Contains new code, new data, and a timeout period.
    upgradeInfo: Upgrade;

    /// Confirms and executes a pending upgrade only after `upgradeInfo.timeout`
    /// seconds have passed since the last `_initiatedAt`.
    receive(msg: Confirm) {
        require(now() >= self.initiatedAt + self.upgradeInfo.timeout, "DelayedUpgradable: Cannot confirm upgrade before timeout");

        if (self.upgradeInfo.code != null) {
            // Change of code will be applied at the end of this transaction
            setCode(self.upgradeInfo.code!!);
        }
        if (self.upgradeInfo.data != null) {
            // Change of data will be immediate
            setData(self.upgradeInfo.data!!);

            // By the end of every transaction,
            // the Tact compiler automatically adds a call to setData() for your convenience.
            // However, we have already set the data ourselves,
            // so let us stop the execution now to prevent a secondary call to setData().
            throw(0);
        }
    }

    /// Instead of performing an upgrade right away,
    /// saves details for delayed execution.
    override inline fun upgrade(_: Context, msg: Upgrade) {
        self.upgradeInfo = msg;
        self.initiatedAt = now();
    }
}

//
// Helper traits and functions described earlier on this page
//

trait Upgradable with Ownable {
    owner: Address;
    _version: Int as uint32;

    receive(msg: Upgrade) {
        let ctx = context();
        self.validateUpgrade(ctx, msg);
        self.upgrade(ctx, msg);

        self._version += 1;
    }

    virtual inline fun validateUpgrade(_: Context, __: Upgrade) {
        self.requireOwner();
    }

    virtual inline fun upgrade(_: Context, msg: Upgrade) {
        if (msg.code != null) {
            setCode(msg.code!!);
        }
        if (msg.data != null) {
            setData(msg.data!!);
            throw(0);
        }
    }

    get fun isUpgradable(): Bool {
        return true;
    }

    get fun version(): Int {
        return self._version;
    }
}

asm fun setCode(code: Cell) { SETCODE }
```



================================================
FILE: docs/src/content/docs/ecosystem/index.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ecosystem/index.mdx
================================================
---
title: Ecosystem overview
description: "Ecosystem section — a bird-eye overview of the Tact ecosystem, tools, and ways you can start contributing"
---

import { CardGrid, LinkCard, Steps } from '@astrojs/starlight/components';

Welcome to the **Ecosystem** section — a bird-eye overview of the Tact ecosystem, its tools, and the ways you can start contributing to those and beyond!

Here are its main contents:

<Steps>

1. #### Security audits

   In addition to optimizing gas usage and reducing fees, the security of the Tact ecosystem is of utmost priority. That is why there is a dedicated page for miscellaneous security audits, assessments, and reports for the Tact compiler and Tact smart contracts.

   <CardGrid>
     <LinkCard
       title="Go to Security audits"
       href="/ecosystem/security-audits"
     />
   </CardGrid>

2. #### Tools

   Tools is a list of official and community-made tools made specifically for Tact or those that interact well with the language and other tools. Each tool has brief usage details and additional information, which sometimes is missing from their respective documentation or is a convenient summary available only in the Tact documentation.
   
   <CardGrid>
    <LinkCard
      title="TypeScript"
      href="/ecosystem/typescript"
    />
    <LinkCard
      title="VS Code Extension"
      href="/ecosystem/vscode"
    />
    <LinkCard
      title="JetBrains IDEs Plugin"
      href="/ecosystem/jetbrains"
    />
    <LinkCard
      title="Misti Static Analyzer"
      href="/ecosystem/misti"
    />
   </CardGrid>

</Steps>



================================================
FILE: docs/src/content/docs/ecosystem/jetbrains.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ecosystem/jetbrains.mdx
================================================
---
title: Tact plugin for JetBrains IDEs
description: "Provides rich support for the Tact language: syntax highlighting, error diagnostics, snippets, hover info, and more"
---

Provides rich support for the Tact language:

- Semantic syntax highlighting
- Code completion, snippets, imports completion
- Go to definition, implementation, type definition
- Find all references, workspace symbol search, symbol renaming
- Types and documentation on hover
- Inlay hints for types, parameter names, and more
- Lenses with usages count and VCS author
- On-the-fly inspections with quick fixes
- Signature help inside calls and `initOf`
- Build single contract or projects from `tact.config.json` via Run configuration
- Formatting with shortcut and on save

Plugin on the JetBrains Marketplace: [Tact](https://plugins.jetbrains.com/plugin/27290-tact)

## Quick start

1. Open your JetBrains IDE (IntelliJ IDEA, PyCharm, WebStorm, etc.)
2. Navigate to the **Plugin Marketplace** by selecting `File > Settings/Preferences > Plugins`.
3. In the Plugin Marketplace's search bar, type "Tact". You will see a dropdown with the extension provided by `TON Studio`.
4. Click the **Install** button next to the plugin name. Wait for the installation to complete.
5. Once the plugin is installed, you will be prompted to restart your JetBrains IDE. Click the **Restart** button to apply changes.
6. After restarting, the Tact plugin should now be successfully installed in your JetBrains IDE.

## Troubleshooting

If you encounter issues during the installation process, please consult the [plugin's GitHub repository](https://github.com/tact-lang/intelli-tact) for solutions and further information.

## References and Resources

- [Plugin on GitHub](https://github.com/tact-lang/intelli-tact)
- [Plugin on the JetBrains Marketplace](https://plugins.jetbrains.com/plugin/27290-tact)



================================================
FILE: docs/src/content/docs/ecosystem/misti.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ecosystem/misti.mdx
================================================
---
title: Misti Static Analyzer
description: "Static analysis of Tact contracts, custom detectors, and CI/CD integration"
next:
  label: Awesome Tact
---

[Misti](https://nowarp.io/tools/misti/) is a static program analysis tool that supports Tact.

## What is Misti?

* **Static Program Analysis**: Misti analyzes code without executing it, scanning for [bugs and security flaws](https://nowarp.io/tools/misti/docs/detectors) by examining its structure and syntax. This approach catches issues early, preventing them from reaching production.
* **Custom Detectors**: Customize Misti to your specific needs by creating [custom detectors](https://nowarp.io/tools/misti/docs/hacking/custom-detector). This helps identify vulnerabilities that generic tools might miss, ensuring a thorough review of your code.
* **CI/CD Integration**: [Integrate](https://nowarp.io/tools/misti/docs/tutorial/ci-cd) Misti into your CI/CD pipeline to ensure continuous code quality checks, catching issues before they make it to production.

## Resources

* [GitHub](https://github.com/nowarp/misti)
* [Telegram Community](https://t.me/misti_dev)
* [Misti Documentation](https://nowarp.io/tools/misti/)



================================================
FILE: docs/src/content/docs/ecosystem/security-audits.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ecosystem/security-audits.mdx
================================================
---
title: Security audits
description: "Various security assessments, audits, and reports for the Tact compiler, Tact smart contracts, and other components in the Tact ecosystem"
---

In addition to optimizing gas usage and reducing fees, the security of the Tact ecosystem is paramount. This includes the safety of the Tact compiler, other Tact-related tools, and smart contracts written in Tact.

This page lists various security assessments, audits, and reports for the Tact compiler, Tact smart contracts, and other components in the Tact ecosystem.

## Tact compiler {#compiler}

### 2025-01: Security Assessment by Trail of Bits {#202501-trailofbits-tact}

The security audit for Tact 1.5.0 has been completed by [Trail of Bits](https://www.trailofbits.com/), a leading Web3 security firm.

By the end, no high-severity vulnerabilities were found. That said, some bugs and points of improvement were discovered and addressed in a new [Tact 1.5.4 bugfix release][1.5.4].

The complete report is available on the Trail of Bits GitHub repository, as well as on the Tact website and its repository as a backup:

* [Original PDF, Trail of Bits repository](https://github.com/trailofbits/publications/blob/master/reviews/2025-01-ton-studio-tact-compiler-securityreview.pdf)
* [Same PDF, Tact website](https://tact-lang.org/assets/pdfs/2025-01-ton-studio-tact-compiler-securityreview.pdf)
* [Same PDF, backup in the website repository](https://github.com/tact-lang/website/blob/416073ed4056034639de257cb1e2815227f497cb/pdfs/2025-01-ton-studio-tact-compiler-securityreview.pdf)

Upgrade to the newest Tact version: [Compiler upgrades](https://docs.tact-lang.org/book/compile/#upgrades).

[1.5.0]: https://www.npmjs.com/package/@tact-lang/compiler/v/1.5.0
[1.5.4]: https://www.npmjs.com/package/@tact-lang/compiler/v/1.5.4



================================================
FILE: docs/src/content/docs/ecosystem/typescript.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ecosystem/typescript.mdx
================================================
---
title: TypeScript libraries
description: "The Tact compiler automatically generates wrapper code for use with @ton/ton and @ton/core libraries."
prev:
  link: /ecosystem/security-audits
  label: Security audits
---

The Tact language has built-in support for the [@ton/ton](https://github.com/ton-org/ton) and [@ton/core](https://github.com/ton-org/ton-core) TypeScript libraries. The compiler automatically generates code for these libraries, so you can use [@tact-lang/emulator](https://github.com/tact-lang/tact-emulator) or [@ton/sandbox](https://github.com/ton-org/sandbox), which work on top of them.

## Tact contract in TypeScript

The compiler generates files named `{project}_{contract}.ts` for each contract in your [project](/book/config#projects), which contain ready-to-use, strongly typed wrappers for working with it in any TypeScript-powered environment: for [testing, debugging, and scripting](/book/debug), [deployments](/book/deploy), etc.

Read more: [TypeScript wrappers on the Compilation page](/book/compile#wrap-ts).



================================================
FILE: docs/src/content/docs/ecosystem/vscode.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ecosystem/vscode.mdx
================================================
---
title: VS Code extension
description: "Extensive support for the Tact language in Visual Studio Code: syntax highlighting, error diagnostics, snippets, hover info, and more"
---

Provides extensive support for the Tact language in Visual Studio Code (VSCode):

- [Semantic syntax highlighting][l1]
- [Code completion][l2] with [auto import][l3], [postfix completion][l4], snippets, and [imports completion][l5]
- Go to [definition][l6], implementation, and [type definition][l7]
- Find all references, workspace symbol search, and symbol renaming
- Types and documentation on hover
- Inlay hints [for types][l8], [parameter names][l9], and [more][l10]
- On-the-fly inspections with quick fixes
- Signature help inside calls, `initOf`, and struct initialization
- [Lenses][l11] with implementation/reference counts
- [Gas estimates][l12] for assembly functions
- Build and test projects based on Blueprint and Tact Template
- Integration with the Tact compiler and [Misti static analyzer](/ecosystem/misti)

[l1]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/highlighting.md
[l2]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/completion.md
[l3]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/completion.md#auto-import
[l4]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/completion.md#postfix-completion
[l5]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/completion.md#imports-completion
[l6]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/navigation.md#go-to-definition
[l7]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/navigation.md#go-to-type-definition
[l8]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/inlay-hints.md#type-hints
[l9]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/inlay-hints.md#parameter-hints
[l10]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/inlay-hints.md#additional-hints
[l11]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/code-lenses.md
[l12]: https://github.com/tact-lang/tact-language-server/blob/master/docs/manual/features/gas-calculation.md

## Quick start

Download the extension for VS Code and VSCode-based editors like VSCodium, Cursor, Windsurf, and others:

- Get it on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=tonstudio.vscode-tact).
- Get it on the [Open VSX Registry](https://open-vsx.org/extension/tonstudio/vscode-tact).
- Or install from the [`.vsix` files in nightly releases](https://github.com/tact-lang/tact-language-server/releases).

For non-VSCode-based editors, install the [Language Server (LSP Server)](https://github.com/tact-lang/tact-language-server). It supports Sublime Text, (Neo)Vim, Helix, and any other editor with LSP support.

## Installation manual for VSCode

1. Open Visual Studio Code (VSCode).

2. Navigate to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window. It looks like a square within a square.

3. In the Extensions view, type "Tact Language". You should see a dropdown with the extension "Tact Language" provided by [TON Studio](https://tonstudio.io). You'll see other extensions previously made by the community, but you should use the one from TON Studio, as it is officially supported and developed by the Tact team.

4. Click on the "Install" button next to the extension name. Wait until the installation is complete.

5. Once the extension is installed, you may need to reload VS Code. You might see a Reload button next to the extension. Click this button when it appears.

## References and resources

- [Extension on GitHub](https://github.com/tact-lang/tact-language-server)
- [Extension on the Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=tonstudio.vscode-tact)
- [Extension on the Open VSX Registry](https://open-vsx.org/extension/tonstudio/vscode-tact)



================================================
FILE: docs/src/content/docs/index.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/index.mdx
================================================
---
title: Learn all about programming in Tact
description: Tact is a powerful programming language for TON Blockchain focused on efficiency and simplicity. It is designed to be easy to learn and use, and to be a good fit for smart contracts.
template: doc
tableOfContents: false
hero:
  tagline: Tact is a powerful programming language for TON Blockchain focused on efficiency and simplicity. It is designed to be easy to learn and use, and to be a good fit for smart contracts. Tact is a statically typed language with a simple syntax and a powerful type system.
  image:
    dark: /public/logomark-light.png
    light: /public/logomark-dark.png
    alt: Tact logo
  actions:
    - text: 📚 Book
      link: /book
      variant: minimal
      icon: right-arrow

    - text: 🍲 Cookbook
      link: /cookbook
      variant: minimal
      icon: right-arrow

    - text: 🔬 Reference
      link: /ref
      variant: minimal
      icon: right-arrow

    - text: 🗺️ Ecosystem
      link: /ecosystem
      variant: minimal
      icon: right-arrow
---

import { LinkCard, CardGrid, Tabs, TabItem, Steps } from '@astrojs/starlight/components';

## 🚀 Let's start! {#start}

<p>ㅤ</p>

<Steps>

1. #### Ensure that the supported version of Node.js is installed and available {#start-1}

   To check it, run `node --version{:shell}` — it should show you the version 22.0.0 or later.

2. #### Run the following command {#start-2}

   It will create a new project with a simple counter contract:

   <Tabs>
     <TabItem label="yarn" icon="seti:yarn">
       ```shell
       # recommended
       yarn create ton simple-counter --type tact-counter --contractName SimpleCounter
       ```
     </TabItem>
     <TabItem label="npm" icon="seti:npm">
       ```shell
       npm create ton@latest -- simple-counter --type tact-counter --contractName SimpleCounter
       ```
     </TabItem>
     <TabItem label="pnpm" icon="pnpm">
       ```shell
       pnpm create ton@latest simple-counter --type tact-counter --contractName SimpleCounter
       ```
     </TabItem>
     <TabItem label="bun" icon="bun">
       ```shell
       bun create ton@latest simple-counter --type tact-counter --contractName SimpleCounter
       ```
     </TabItem>
   </Tabs>

3. #### That's it! {#start-3}

   Your first contract project has already been written and compiled!

   Check it out by moving into the relevant directory — `cd simple-counter/contracts{:shell}`. Here's what it would look like:

   ```tact
   message Add {
       queryId: Int as uint64;
       amount: Int as uint32;
   }

   contract SimpleCounter(
       id: Int as uint32,
       counter: Int as uint32,
   ) {
       // Empty receiver for the deployment
       receive() {
           // Forward the remaining value in the
           // incoming message back to the sender
           cashback(sender());
       }

       receive(msg: Add) {
           self.counter += msg.amount;

           // Forward the remaining value in the
           // incoming message back to the sender
           cashback(sender());
       }

       get fun counter(): Int {
           return self.counter;
       }

       get fun id(): Int {
           return self.id;
       }
   }
   ```

   To re-compile or deploy, refer to the commands in the scripts section of `package.json` in the root of this newly created project and to the documentation of [Blueprint](https://github.com/ton-org/blueprint) — this is the tool we've used to create and compile your first simple counter contract in Tact. Blueprint can do much more than that: including tests, customizations, and more.

</Steps>

## 🤔 Where to go next? {#next}

<p>ㅤ</p>

<Steps>

1. #### Have some blockchain knowledge already? {#next-1}

   See the [Tact Cookbook](/cookbook), which is a handy collection of everyday tasks (and solutions) every Tact developer faces during smart contract development. Use it to avoid reinventing the wheel.

   Alternatively, check the following scenic tours and cheat sheets to get started right away:

   <CardGrid>
     <LinkCard
       title="⚡ Learn Tact in Y minutes"
       href="/book/learn-tact-in-y-minutes"
     />
   </CardGrid>

   {/*

   <CardGrid>
     <LinkCard
       title="💎 Coming from FunC (TON)"
       href="/book/cs/from-func"
     />
     <LinkCard
       title="🔷 Coming from Solidity (Ethereum)"
       href="/book/cs/from-solidity"
     />
   </CardGrid>

   */}

2. #### Want to know more? {#next-2}

   For further guidance on compilation, testing, and deployment see the respective pages:

   * [Testing and debugging](/book/debug) page tells you everything about debugging Tact contracts
   * [Deployment](/book/deploy) page shows what deployment looks like and helps you harness the powers of [Blueprint](https://github.com/ton-org/blueprint) for it.

   For custom plugins for your favorite editor and other tooling see the [Ecosystem](/ecosystem) section.

   Alternatively, take a look at the following broader sections:

   * [Book](/book) helps you learn the language step-by-step
   * [Cookbook](/cookbook) gives you ready-made recipes of Tact code
   * [Reference](/ref) provides a complete glossary of the standard library, grammar and evolution process
   * Finally, [Ecosystem](/ecosystem) describes "what's out there" in the Tact's and TON's ecosystems

   <CardGrid>
     <LinkCard
       title="📚 Read the Book of Tact"
       href="/book"
     />
     <LinkCard
       title="🍲 Grind the Cookbook"
       href="/cookbook"
     />
     <LinkCard
       title="🔬 Skim the Reference"
       href="/ref"
     />
     <LinkCard
       title="🗺️ Embrace the Ecosystem"
       href="/ecosystem"
     />
   </CardGrid>

3. #### Feeling a bit uncomfortable? {#next-3}

   If you ever get stuck, try searching — the search box is at the top of the documentation. There is also a handy <kbd>Ctrl</kbd> + <kbd>K</kbd> shortcut to focus and start the search as you type.

   If you can't find the answer in the docs, or you've tried to do some local testing and it still didn't help — don't hesitate to reach out to Tact's flourishing community:

   <CardGrid>
     <LinkCard
       title="✈️ Telegram Group"
       href="https://t.me/tactlang"
     />
     <LinkCard
       title="🐦 X/Twitter"
       href="https://twitter.com/tact_language"
     />
   </CardGrid>

   Good luck on your coding adventure with ⚡ Tact!

</Steps>



================================================
FILE: docs/src/content/docs/ref/core-addresses.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/core-addresses.mdx
================================================
---
title: Addresses
description: "Various Address functions from the Core library of Tact"
---

import { Badge } from '@astrojs/starlight/components';

`Address{:tact}` represents a standard [smart contract address](https://docs.ton.org/v3/concepts/dive-into-ton/ton-blockchain/smart-contract-addresses#address-of-smart-contract) on TON Blockchain.

See also:

* [`myAddress(){:tact}` function in the context and state reference](/ref/core-contextstate#myaddress).
* Address-oriented extension functions for [`Builder{:tact}`][builder] and [`Slice{:tact}`][slice] types on their reference page: [Cells, Builders and Slices](/ref/core-cells).

## newAddress

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

```tact
fun newAddress(chain: Int, hash: Int): Address;
```

Creates a new [`Address{:tact}`][p] based on the [`chain` ID][workchain-id] and the [SHA-256](/ref/core-crypto#sha256) encoded [`hash` value (account ID)][account-id].

This function tries to resolve constant values at [compile-time](/ref/core-comptime) whenever possible.

Attempts to specify an uncommon `chain` ID (not -1 or 0) detectable at [compile-time](/ref/core-comptime) will result in a compilation error.

Usage example:

```tact
let oldTonFoundationAddr: Address =
    newAddress(0, 0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8);
    //         ↑  ↑
    //         |  SHA-256 hash of contract's init package (StateInit)
    //         chain ID: 0 is a workchain, -1 is a masterchain
```

:::caution

  Make sure you specify only supported workchain IDs: 0 for the basechain and -1 for the masterchain.

:::

:::note[Useful links:]

  [`chain` (Workchain ID) in TON Docs][workchain-id]\
  [`hash` (Account ID) in TON Docs][account-id]\
  [Contract's init package (`StateInit{:tact}`)](/book/expressions#initof)

:::

## contractAddress

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

```tact
fun contractAddress(s: StateInit): Address;
```

Computes the smart contract's [`Address{:tact}`][p] in the workchain ID 0 (basechain) using the [`StateInit{:tact}`][initpkg] `s` of the contract. An alias to `contractAddressExt(0, s.code, s.data){:tact}`.

Usage example:

```tact
let s: StateInit = initOf SomeContract();
let foundMeSome: Address = contractAddress(s);
let andSomeMore: Address = contractAddressExt(0, s.code, s.data);

foundMeSome == andSomeMore; // true
```

## contractAddressExt

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

```tact
fun contractAddressExt(chain: Int, code: Cell, data: Cell): Address;
```

Computes the smart contract's [`Address{:tact}`][p] in the given `chain` ID using the contract's `code` and its initial state `data`. Use the [`initOf{:tact}`][initpkg] expression to obtain the initial `code` and initial `data` of a given contract.

This function lets you specify arbitrary `chain` IDs, including the common -1 (masterchain) and 0 (basechain) ones.

Usage example:

```tact
let initPkg: StateInit = initOf SomeContract();
let hereBeDragons: Address = contractAddressExt(0, initPkg.code, initPkg.data);
```

## contractHash

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
fun contractHash(code: Cell, data: Cell): Int;
```

Computes and returns an [`Int{:tact}`][int] value of the [SHA-256](/ref/core-crypto#sha256) hash of the `code` and `data` of the given contract. To assemble the `code` and `data` cells together for hashing, the [standard `Cell{:tact}` representation](/book/cells#cells-representation) is used.

This hash is commonly called the [account ID][account-id]. Together with the [workchain ID][workchain-id], it deterministically forms the address of the contract on TON Blockchain.

Usage example:

```tact
let initPkg: StateInit = initOf SomeContract();
let accountId: Int = contractHash(initPkg.code, initPkg.data);
let basechainAddr: Address = newAddress(0, accountId);
let basechainAddr2: Address = contractAddressExt(0, initPkg.code, initPkg.data);

basechainAddr == basechainAddr2; // true
```

:::note[Useful links:]

  [`chain` (Workchain ID) in TON Docs][workchain-id]\
  [`hash` (Account ID) in TON Docs][account-id]\
  [Contract's init package (`StateInit{:tact}`)][initpkg]\
  [Standard `Cell{:tact}` representation](/book/cells#cells-representation)

:::

## forceBasechain

<Badge text="Available since Tact 1.6.3" variant="tip" size="medium"/><p/>

```tact
fun forceBasechain(address: Address);
```

Checks whether the `address` is in the basechain, i.e., its [chain ID][workchain-id] is 0. If it is not, throws an exception with [exit code 138](/book/exit-codes#9): `Not a basechain address`.

Usage examples:

```tact
let someBasechainAddress: Address =
    newAddress(0, 0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8);

let someMasterchainAddress: Address =
    newAddress(-1, 0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8);

// Does not throw because the chain ID is 0
forceBasechain(someBasechainAddress);

try {
    // Throws because the chain ID is -1 (masterchain)
    forceBasechain(someMasterchainAddress);
} catch (exitCode) {
    // exitCode is 138
}
```

## forceWorkchain

<Badge text="Available since Tact 1.6.4" variant="tip" size="medium"/><p/>

```tact
fun forceWorkchain(address: Address, workchain: Int, errorCode: Int);
```

Parameterized version of [`forceBasechain(){:tact}`](#forcebasechain).

Checks whether the `address` is in the `workchain`, i.e., its [chain ID](https://docs.ton.org/learn/overviews/addresses#workchain-id) is equal to `workchain`. If it is not, throws an exception with exit code `errorCode`.

Usage examples:

```tact
let someBasechainAddress: Address =
    newAddress(0, 0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8);

let someMasterchainAddress: Address =
    newAddress(-1, 0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8);

// Does not throw because the chain ID matches workchain parameter
forceWorkchain(someBasechainAddress, 0, 593);
forceWorkchain(someMasterchainAddress, -1, 593);

try {
    // Throws because the chain ID is 0 which doesn't match the workchain parameter, -1
    forceWorkchain(someBasechainAddress, -1, 593);
} catch (exitCode) {
    // exitCode is 593
}
```

## parseStdAddress

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun parseStdAddress(slice: Slice): StdAddress;
```

Converts a `slice` containing an address into the `StdAddress{:tact}` [struct][struct] and returns it.

The `StdAddress{:tact}` is a built-in struct that consists of:

Field       | Type                           | Description
:---------- | :----------------------------- | :----------
`workchain` | [`Int as int8{:tact}`][int]    | Workchain ID of the address, usually $0$ (basechain) or $-1$ (masterchain)
`address`   | [`Int as uint256{:tact}`][int] | Address in the specified `workchain`

Attempts to pass a [`Slice{:tact}`][slice] that cannot be parsed as a `StdAddress{:tact}` or to load more data than the given [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let addr = address("EQDtFpEwcFAEcRe5mLVh2N6C0x-_hJEM7W61_JLnSF74p4q2");
let parsedAddr = parseStdAddress(addr.asSlice());

parsedAddr.workchain; // 0
parsedAddr.address;   // 107...lots of digits...287

// Using newAddress() function with the contents of StdAddress will yield the initial Address:
let addr2: Address = newAddress(parsedAddr.workchain, parsedAddr.address);
addr2 == addr; // true
```

:::note

  For parsing addresses of variable length, see the [`parseVarAddress(){:tact}`](#parsevaraddress) function.

:::

## parseVarAddress

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>
<Badge text="Deprecated since Tact 1.6.8" variant="tip" size="medium"/><p/>

```tact
fun parseVarAddress(slice: Slice): VarAddress;
```

This function has been deprecated since Tact 1.6.8. Any usages of this function will be reported as an error.
`VarAddress` since [TVM 10](https://github.com/ton-blockchain/ton/blob/master/doc/GlobalVersions.md#version-10) is mostly useless as it throws exit code 9 in many cases.

Converts a `slice` containing an address of variable length into the `VarAddress{:tact}` [struct][struct] and returns it.

The `VarAddress{:tact}` is a built-in struct consisting of:

Field       | Type                         | Description
:---------- | :--------------------------- | :----------
`workchain` | [`Int as int32{:tact}`][int] | Workchain ID of the variable-length address
`address`   | [`Slice{:tact}`][slice]      | Address in the specified `workchain`

Attempts to pass a [`Slice{:tact}`][slice] that cannot be parsed as a `VarAddress{:tact}` or to load more data than the given [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let varAddrSlice = beginCell()
    .storeUint(6, 3)     // to recognize the following as a VarAddress
    .storeUint(123, 9)   // make address occupy 123 bits
    .storeUint(234, 32)  // specify workchain ID of 234
    .storeUint(345, 123) // specify address of 345
    .asSlice();
let parsedVarAddr = parseVarAddress(varAddrSlice);

parsedVarAddr.workchain;             // 234
parsedVarAddr.address;               // CS{Cell{002...2b3} bits: 44..167; refs: 0..0}
parsedVarAddr.address.loadUint(123); // 345
```

:::caution

  Variable-length addresses are intended for future extensions, and while validators must be ready to accept them in inbound messages, the standard (non-variable) addresses are used whenever possible.

:::

## StateInit.hasSameBasechainAddress

<Badge text="Available since Tact 1.6.1" variant="tip" size="medium"/><p/>

```tact
extends fun hasSameBasechainAddress(self: StateInit, address: Address): Bool;
```

Extension function for the [`StateInit{:tact}`][initpkg] [struct][struct].

Checks if the given `address` corresponds to the contract address in the [workchain ID][workchain-id] 0 (basechain) derived from the [`StateInit{:tact}`](/book/expressions#initof) `self{:tact}`. Returns `true{:tact}` if the addresses match and `false{:tact}` otherwise.

This function works correctly only for basechain addresses. It may produce false positives or negatives if the specified `address` or the address derived from the `StateInit{:tact}` `self{:tact}` has a non-zero workchain ID.

Attempts to pass an [`Address{:tact}`][p] that cannot be parsed as a [`StdAddress{:tact}`](#parsestdaddress) throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

```tact
contract Parent() {
    receive() {
        let childContract = initOf Child(myAddress());

        // If you are working with contracts on the basechain, this
        let expensiveCheck = contractAddress(childContract) == sender();

        // is more expensive than doing this
        let cheaperCheck = childContract.hasSameBasechainAddress(sender());

        // while the results are the same
        expensiveCheck == cheaperCheck; // true
    }
}

contract Child(parentAddr: Address) {
    receive() {
        // Forwards surplus to the parent address by sending a message
        // with an empty body and all remaining funds from the received message
        cashback(self.parentAddr);
    }
}
```

## Address.asSlice

```tact
extends fun asSlice(self: Address): Slice;
```

Extension function for the [`Address{:tact}`][p] type.

Casts the [`Address{:tact}`][p] back to the underlying [`Slice{:tact}`][slice] and returns it. The inverse of [`Slice.asAddressUnsafe(){:tact}`](/ref/core-cells#sliceasaddressunsafe).

Usage example:

```tact
let a: Address = myAddress();
let fizz: Slice = beginCell().storeAddress(a).asSlice();
let buzz: Slice = a.asSlice(); // cheap, unlike the previous statement

fizz == buzz; // true
```

## Address.toString

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

```tact
extends fun toString(self: Address): String;
```

Extension function for the [`Address{:tact}`][p] type.

Returns a [`String{:tact}`][p] from an [`Address{:tact}`][p].

Usage example:

```tact
let community: Address = address("UQDpXLZKrkHsOuE_C1aS69C697wE568vTnqSeRfBXZfvmVOo");
let fizz: String = community.toString();
```

## BasechainAddress

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
struct BasechainAddress {
    hash: Int?;
}
```

Struct representing a basechain address.

A basechain address (workchain $0$) can be either empty (null hash) or contain a 256-bit hash value.

## emptyBasechainAddress

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
inline fun emptyBasechainAddress(): BasechainAddress;
```

Creates and returns an empty basechain address with a null hash.

When serialized, an empty basechain address is represented as `addr_none`.

Usage example:

```tact
fun example() {
    let emptyAddr: BasechainAddress = emptyBasechainAddress();
    emptyAddr.hash == null; // true
}
```

## newBasechainAddress

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
inline fun newBasechainAddress(hash: Int): BasechainAddress;
```

Creates and returns a new basechain address with the specified hash value.

Usage example:

```tact
fun example() {
    let addr: BasechainAddress = newBasechainAddress(0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8);
}
```

## contractBasechainAddress

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
inline fun contractBasechainAddress(s: StateInit): BasechainAddress;
```

Creates and returns a basechain address derived from a contract's `StateInit` (code and data).

Usage example:

```tact
fun example() {
    let code: Cell = loadCell(); // load contract code
    let data: Cell = loadCell(); // load contract data
    let state: StateInit = StateInit { code, data };
    let addr: BasechainAddress = contractBasechainAddress(state);
}
```

[p]: /book/types#primitive-types
[bool]: /book/types#booleans
[int]: /book/integers
[nano]: /book/integers#nanotoncoin
[cell]: /book/cells#cells
[builder]: /book/cells#builders
[slice]: /book/cells#slices
[struct]: /book/structs-and-messages#structs
[opt]: /book/optionals

[initpkg]: /book/expressions#initof

[fwdfee]: https://docs.ton.org/develop/howto/fees-low-level#forward-fees
[workchain-id]: https://docs.ton.org/learn/overviews/addresses#workchain-id
[account-id]: https://docs.ton.org/learn/overviews/addresses#account-id



================================================
FILE: docs/src/content/docs/ref/core-base.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/core-base.mdx
================================================
---
title: Base trait
description: "Every contract and trait in Tact implicitly inherits the BaseTrait trait"
prev:
  link: /ref/evolution/otp-006
  label: "OTP-006: Contract Package"
---

Every [contract](/book/contracts) in Tact implicitly [inherits](/book/contracts#traits) the `BaseTrait{:tact}` trait, which contains a number of [internal functions](/book/contracts#internal-functions) for any contract and a constant `self.storageReserve{:tact}` aimed at advanced users of Tact.

:::tip

  Prior to 1.6.0, `BaseTrait{:tact}` was also implicitly inherited by traits, but now you must explicitly specify `with BaseTrait{:tact}` for your traits to use it.

:::

## Constants

### self.storageReserve {#self-storagereserve}

```tact
virtual const storageReserve: Int = 0;
```

Usage example:

```tact
contract AllYourStorageBelongsToUs {
    // This would change the behavior of the self.forward() function,
    // causing it to try reserving this amount of nanoToncoins before
    // forwarding a message with SendRemainingBalance mode
    override const storageReserve: Int = ton("0.1");
}
```

## Functions

### self.reply {#self-reply}

```tact
virtual fun reply(body: Cell?);
```

A similar but more gas-efficient version of calling the [`self.forward(){:tact}`](#self-forward) function with the following arguments:

```tact
self.forward(sender(), body, true, null);
//           ↑         ↑     ↑     ↑
//           |         |     |     init: StateInit?
//           |         |     bounce: Bool
//           |         body: Cell?
//           to: Address
```

Usage example:

```tact
// This message can bounce back to us!
self.reply("Beware, this is my reply to you!".asComment());
```

### self.notify {#self-notify}

```tact
virtual fun notify(body: Cell?);
```

A similar but more gas-efficient version of calling the [`self.forward(){:tact}`](#self-forward) function with the following arguments:

```tact
self.forward(sender(), body, false, null);
//           ↑         ↑     ↑      ↑
//           |         |     |      init: StateInit?
//           |         |     bounce: Bool
//           |         body: Cell?
//           to: Address
```

Usage example:

```tact
// This message won't bounce!
self.notify("Beware, this is my reply to you!".asComment());
```

### self.forward {#self-forward}

```tact
virtual fun forward(to: Address, body: Cell?, bounce: Bool, init: StateInit?);
```

[Queues the message](/book/send#outbound-message-processing) (bounceable or non-bounceable) to be sent to the specified address `to`. Optionally, you may provide a `body` for the message and the [`init` package](/book/expressions#initof).

When the [`self.storageReserve{:tact}`](#self-storagereserve) constant is overridden to be greater than 0, it also attempts to reserve the `self.storageReserve{:tact}` amount of [nanoToncoins][nano] from the remaining balance before sending the message in the [`SendRemainingBalance{:tact}`](/book/message-mode#base-modes) ($128$) mode.

In case the reservation attempt fails, or in the default case without the attempt, the message is sent with the [`SendRemainingValue{:tact}`](/book/message-mode#base-modes) ($64$) mode instead.

:::note

  Note that `self.forward(){:tact}` never sends additional [nanoToncoins][nano] on top of what's available in the balance.\
  To send more [nanoToncoins][nano] with a single message, use the [`send(){:tact}`](/ref/core-send#send) function.

:::

Usage example:

```tact
import "@stdlib/ownable";

message PayoutOk {
    address: Address;
    value: Int as coins;
}

contract Payout with Ownable {
    completed: Bool;
    owner: Address;

    init(owner: Address) {
        self.owner = owner;
        self.completed = false;
    }

    // ... some actions here ...

    // Bounced receiver function, which is called when the specified outgoing message bounces back
    bounced(msg: bounced<PayoutOk>) {
        // Reset completed flag if our message bounced
        self.completed = false;

        // Send a notification that the payout failed, using the remaining funds to process this send
        self.forward(self.owner, "Payout failed".asComment(), false, null);
    }
}
```

[nano]: /book/integers#nanotoncoin



================================================
FILE: docs/src/content/docs/ref/core-cells.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/core-cells.mdx
================================================
---
title: Cells, Builders and Slices
description: "Various Cell, Builder, and Slice functions from the Core library of Tact"
---

import { Badge } from '@astrojs/starlight/components';

[`Cell{:tact}`][cell] is a low-level [primitive][p] that represents data in TON Blockchain. Cells consist of $1023$ bits of data with up to $4$ references to other cells. They are read-only and immutable, and cannot have cyclic references.

[`Builder{:tact}`][builder] is an immutable [primitive][p] to construct cells, and [`Slice{:tact}`][slice] is a mutable [primitive][p] to parse them.

:::note

  Be very careful when constructing and parsing cells manually, and always make sure to document their desired layout: a strict order of values and types for serialization and deserialization.

  To do so, advanced users are recommended to use [Type Language - Binary (TL-B) schemas][tlb].

  Additionally, every user is recommended to use [structs][struct] and their [methods](/book/functions#extensions), such as [`Struct.toCell(){:tact}`](#structtocell) and [`Struct.fromCell(){:tact}`](#structfromcell), instead of manually constructing and parsing cells, because structs and [Messages][message] are closest to being the [living TL-B schemas of your contracts](/book/cells#cnp-structs).

:::

## beginCell

```tact
fun beginCell(): Builder;
```

Creates a new empty [`Builder{:tact}`][builder].

Usage example:

```tact
let fizz: Builder = beginCell();
```

## emptyCell

```tact
fun emptyCell(): Cell;
```

Creates and returns an empty [`Cell{:tact}`][cell] (without data and references). An alias to `beginCell().endCell(){:tact}`.

Usage example:

```tact
let fizz: Cell = emptyCell();
let buzz: Cell = beginCell().endCell();

fizz == buzz; // true
```

## emptySlice

```tact
fun emptySlice(): Slice;
```

Creates and returns an empty [`Slice{:tact}`][slice] (without data and references). An alias to `emptyCell().asSlice(){:tact}`.

Usage example:

```tact
let fizz: Slice = emptySlice();
let buzz: Slice = emptyCell().asSlice();

fizz == buzz; // true
```

## Cell

A section to group all extension and extension mutation functions for the [`Cell{:tact}`][cell] type.

### Cell.beginParse

```tact
extends fun beginParse(self: Cell): Slice;
```

Extension function for the [`Cell{:tact}`][cell] type.

Opens the [`Cell{:tact}`][cell] for parsing and returns it as a [`Slice{:tact}`][slice].

Usage example:

```tact
let c: Cell = emptyCell();
let fizz: Slice = c.beginParse();
```

### Cell.depth

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
extends fun depth(self: Cell?): Int;
```

Extension function for the [`Cell{:tact}`][cell] type.

Computes and returns the [`Int{:tact}`][int] [depth][std-repr] of the [`Cell{:tact}`][cell]. Produces $0$ if the [`Cell{:tact}`][cell] has no references. Otherwise, it returns $1$ plus the maximum of the depths of the referenced cells. If `self{:tact}` is [`null{:tact}`][null], returns $0$.

Usage example:

```tact
let c: Cell = beginCell().storeInt(42, 7).endCell();
let depth: Int = c.depth(); // 0
```

### Cell.computeDataSize

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/>
<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
extends fun computeDataSize(self: Cell?, maxCells: Int): DataSize;
```

Extension function for the [`Cell{:tact}`][cell] type.

Computes and returns the number of distinct cells, bits, and refs in the [`Cell{:tact}`][cell] by using a [depth-first search (DFS)][dfs] algorithm, recursively traversing each referenced cell. This function is computationally expensive and can consume a lot of [gas][gas]. If `self{:tact}` is [`null{:tact}`][null], returns a `DataSize{:tact}` with all fields set to $0$.

The results are packed into a `DataSize{:tact}` [struct][struct] consisting of:

Field   | Type                | Description
:------ | :------------------ | :----------
`cells` | [`Int{:tact}`][int] | The total number of nested cells, including the starting one
`bits`  | [`Int{:tact}`][int] | The total number of bits in all nested cells, including the starting one
`refs`  | [`Int{:tact}`][int] | The total number of refs in all nested cells, including the starting one

If the specified `maxCells` value is insufficient to traverse all cells including the starting one, an exception with [exit code 8](/book/exit-codes#8) is thrown: `Cell overflow`.

Attempts to specify a negative value for `maxCells` throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Usage example:

```tact
let c: Cell = beginCell().storeInt(42, 7).storeRef(emptyCell()).endCell();
try {
    let dataSize: DataSize = c.computeDataSize(2);
    dataSize.cells; // 2
    dataSize.bits;  // 7
    dataSize.refs;  // 1
} catch (exitCode) {
    // if maxCells was insufficient to traverse the cell
    // and all of its references, the exitCode here would be 8
}
```

### Cell.hash

```tact
extends fun hash(self: Cell): Int;
```

Extension function for the [`Cell{:tact}`][cell] type.

Calculates and returns an [`Int{:tact}`][int] value of the [SHA-256][sha-2] hash of the [standard `Cell{:tact}` representation][std-repr] of the given [`Cell{:tact}`][cell].

Usage example:

```tact
let c: Cell = emptyCell();
let fizz: Int = c.hash();
```

### Cell.asSlice

```tact
extends fun asSlice(self: Cell): Slice;
```

Extension function for the [`Cell{:tact}`][cell] type.

Converts the Cell to a [`Slice{:tact}`][slice] and returns it. An alias to `self.beginParse(){:tact}`.

Usage example:

```tact
let c: Cell = emptyCell();
let fizz: Slice = c.asSlice();
```

## Builder

A section to group all extension and extension mutation functions for the [`Builder{:tact}`][builder] type.

### Builder.endCell

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

```tact
extends fun endCell(self: Builder): Cell;
```

Extension function for the [`Builder{:tact}`][builder] type.

Converts a [`Builder{:tact}`][builder] into an ordinary [`Cell{:tact}`][cell].

Usage example:

```tact
let b: Builder = beginCell();
let fizz: Cell = b.endCell();
```

### Builder.storeUint

```tact
extends fun storeUint(self: Builder, value: Int, bits: Int): Builder;
```

Extension function for the [`Builder{:tact}`][builder] type.

Stores an unsigned `bits`-bit `value` into the copy of the [`Builder{:tact}`][builder] for 0 ≤ `bits` ≤ 256. Returns that copy.

Attempts to store a negative `value` or provide an insufficient or out-of-bounds `bits` number throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Attempts to store more data than the [`Builder{:tact}`][builder] `self{:tact}` can fit throw an exception with [exit code 8](/book/exit-codes#8): `Cell overflow`.

Usage example:

```tact
let b: Builder = beginCell();
let fizz: Builder = b.storeUint(42, 6);
```

### Builder.storeInt

```tact
extends fun storeInt(self: Builder, value: Int, bits: Int): Builder;
```

Extension function for the [`Builder{:tact}`][builder] type.

Stores a signed `bits`-bit `value` into the copy of the [`Builder{:tact}`][builder] for 0 ≤ `bits` ≤ 257. Returns that copy.

Attempts to provide an insufficient or out-of-bounds `bits` number throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Attempts to store more data than the [`Builder{:tact}`][builder] `self{:tact}` can fit throw an exception with [exit code 8](/book/exit-codes#8): `Cell overflow`.

Usage example:

```tact
let b: Builder = beginCell();
let fizz: Builder = b.storeInt(42, 7);
```

### Builder.storeBool

```tact
extends fun storeBool(self: Builder, value: Bool): Builder;
```

Extension function for the [`Builder{:tact}`][builder] type.

Stores a [`Bool{:tact}`][bool] `value` into the copy of the [`Builder{:tact}`][builder]. Writes 1 as a single bit if `value` is `true{:tact}`, and writes 0 otherwise. Returns that copy of the [`Builder{:tact}`][builder].

Attempts to store more data than the [`Builder{:tact}`][builder] `self{:tact}` can fit throw an exception with [exit code 8](/book/exit-codes#8): `Cell overflow`.

Usage example:

```tact
let b: Builder = beginCell();
let fizz: Builder = b.storeBool(true);  // writes 1
let buzz: Builder = b.storeBool(false); // writes 0
```

### Builder.storeBit

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
extends fun storeBit(self: Builder, value: Bool): Builder;
```

Extension function for the [`Builder{:tact}`][builder] type.

An alias to [`Builder.storeBool(){:tact}`](#builderstorebool).

Attempts to store more data than the [`Builder{:tact}`][builder] `self{:tact}` can fit throw an exception with [exit code 8](/book/exit-codes#8): `Cell overflow`.

Usage example:

```tact
let b: Builder = beginCell();
let fizz: Builder = b.storeBit(true);  // writes 1
let buzz: Builder = b.storeBit(false); // writes 0
```

### Builder.storeBuilder

```tact
extends fun storeBuilder(self: Builder, other: Builder): Builder;
```

Extension function for the [`Builder{:tact}`][builder] type.

Appends all data from the `other` builder to the copy of the `self` builder. Returns that copy.

Attempts to store more data than the [`Builder{:tact}`][builder] `self{:tact}` can fit throw an exception with [exit code 8](/book/exit-codes#8): `Cell overflow`.

Usage example:

```tact
fun example(op: Int, queryId: Int, payload: Builder) {
   let msgBody = beginCell().storeUint(op, 32).storeUint(queryId, 64);
   if (payload.bits() != 0) {
       msgBody = msgBody.storeBuilder(payload); // assignment is important here
   }
}
```

### Builder.storeSlice

```tact
extends fun storeSlice(self: Builder, slice: Slice): Builder;
```

Extension function for the [`Builder{:tact}`][builder] type.

Stores a `slice` into a copy of the [`Builder{:tact}`][builder]. Returns that copy.

Attempts to store more data than the [`Builder{:tact}`][builder] `self{:tact}` can fit throw an exception with [exit code 8](/book/exit-codes#8): `Cell overflow`.

Usage example:

```tact
let b: Builder = beginCell();
let s: Slice = emptyCell().asSlice();
let fizz: Builder = b.storeSlice(s);
```

### Builder.storeCoins

```tact
extends fun storeCoins(self: Builder, value: Int): Builder;
```

Extension function for the [`Builder{:tact}`][builder] type.

Stores (serializes) an unsigned [`Int{:tact}`][int] `value` in the range from $0$ to $2^{120}-1$ inclusive into a copy of the [`Builder{:tact}`][builder]. The serialization of `value` consists of a $4$-bit unsigned big-endian integer $l$, which is the smallest integer $l ≥ 0$ such that `value` $< 2^{8 * l}$, followed by an $8 * l$-bit unsigned big-endian representation of `value`. Returns that copy of the [`Builder{:tact}`][builder].

Attempts to store an out-of-bounds `value` throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Attempts to store more data than the [`Builder{:tact}`][builder] `self{:tact}` can fit throw an exception with [exit code 8](/book/exit-codes#8): `Cell overflow`.

This is the most common way of storing [nanoToncoins](/book/integers#nanotoncoin).

Usage example:

```tact
let b: Builder = beginCell();
let fizz: Builder = b.storeCoins(42);
```

:::note[Useful links:]

  [Special `coins{:tact}` serialization type](/book/integers#serialization-varint)

:::

### Builder.storeVarUint16

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
extends fun storeVarUint16(self: Builder, value: Int): Builder;
```

Extension function for the [`Builder{:tact}`][builder] type.

An alias to [`Builder.storeCoins(){:tact}`](#builderstorecoins).

Attempts to store more data than the [`Builder{:tact}`][builder] `self{:tact}` can fit throw an exception with [exit code 8](/book/exit-codes#8): `Cell overflow`.

Usage example:

```tact
let b: Builder = beginCell();
let fizz: Builder = b.storeVarUint16(42);
```

:::note[Useful links:]

  [Types of variable bit-width](/book/integers#serialization-varint)

:::

### Builder.storeVarInt16

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
extends fun storeVarInt16(self: Builder, value: Int): Builder;
```

Extension function for the [`Builder{:tact}`][builder] type.

Similar to [`Builder.storeCoins(){:tact}`](#builderstorecoins), but with a different `value` range: from $-2^{119}$ to $2^{119}-1$ inclusive.

Attempts to store an out-of-bounds `value` throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Attempts to store more data than the [`Builder{:tact}`][builder] `self{:tact}` can fit throw an exception with [exit code 8](/book/exit-codes#8): `Cell overflow`.

Usage example:

```tact
let b: Builder = beginCell();
let fizz: Builder = b.storeVarInt16(-42);
```

:::note[Useful links:]

  [Types of variable bit-width](/book/integers#serialization-varint)

:::

### Builder.storeVarUint32

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
extends fun storeVarUint32(self: Builder, value: Int): Builder;
```

Extension function for the [`Builder{:tact}`][builder] type.

Stores (serializes) an unsigned [`Int{:tact}`][int] `value` in the range from $0$ to $2^{248}-1$ inclusive into a copy of the [`Builder{:tact}`][builder]. The serialization of `value` consists of a $5$-bit unsigned big-endian integer $l$, which is the smallest integer $l ≥ 0$ such that `value` $< 2^{8 * l}$, followed by an $8 * l$-bit unsigned big-endian representation of `value`. Returns that copy of the [`Builder{:tact}`][builder].

Attempts to store an out-of-bounds `value` throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Attempts to store more data than the [`Builder{:tact}`][builder] `self{:tact}` can fit throw an exception with [exit code 8](/book/exit-codes#8): `Cell overflow`.

Usage example:

```tact
let b: Builder = beginCell();
let fizz: Builder = b.storeVarUint32(420000);
```

:::note[Useful links:]

  [Types of variable bit-width](/book/integers#serialization-varint)

:::

### Builder.storeVarInt32

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
extends fun storeVarInt32(self: Builder, value: Int): Builder;
```

Extension function for the [`Builder{:tact}`][builder] type.

Similar to [`Builder.storeVarUint32(){:tact}`](#builderstorevaruint32), but with a different `value` range: from $-2^{247}$ to $2^{247} - 1$ inclusive.

Attempts to store an out-of-bounds `value` throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Attempts to store more data than the [`Builder{:tact}`][builder] `self{:tact}` can fit throw an exception with [exit code 8](/book/exit-codes#8): `Cell overflow`.

Usage example:

```tact
let b: Builder = beginCell();
let fizz: Builder = b.storeVarInt32(-420000);
```

:::note[Useful links:]

  [Types of variable bit-width](/book/integers#serialization-varint)

:::

### Builder.storeAddress

```tact
extends fun storeAddress(self: Builder, address: Address): Builder;
```

Extension function for the [`Builder{:tact}`][builder] type.

Stores the `address` in a copy of the [`Builder{:tact}`][builder]. Returns that copy.

Attempts to store an `address` into the [`Builder{:tact}`][builder] `self{:tact}`, if `self{:tact}` cannot fit it, throw an exception with [exit code 8](/book/exit-codes#8): `Cell overflow`.

Attempts to store more data than the [`Builder{:tact}`][builder] `self{:tact}` can fit throw an exception with [exit code 8](/book/exit-codes#8): `Cell overflow`.

Usage example:

```tact
let b: Builder = beginCell();
let fizz: Builder = b.storeAddress(myAddress());
```

### Builder.storeBasechainAddress

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
extends fun storeBasechainAddress(self: Builder, address: BasechainAddress): Builder;
```

Extension function for the [`Builder{:tact}`][builder] type.

Stores the basechain `address` in the copy of the [`Builder{:tact}`][builder] and returns that copy.

If the address has a `null{:tact}` hash, stores two zero bits `0b00` (`addr_none`). Otherwise, stores the full address with the three-bit prefix `0b100`, followed by the 8-bit workchain ID set to 0 and the 256-bit hash.

Attempts to store more data than the [`Builder{:tact}`][builder] `self{:tact}` can fit throw an exception with [exit code 8](/book/exit-codes#8): `Cell overflow`.

Usage example:

```tact
fun example() {
    let addr: BasechainAddress = newBasechainAddress(0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8);
    let b: Builder = beginCell();
    let b2: Builder = b.storeBasechainAddress(addr);
}
```

### Builder.storeRef

```tact
extends fun storeRef(self: Builder, cell: Cell): Builder;
```

Extension function for the [`Builder{:tact}`][builder] type.

Stores a reference `cell` into a copy of the [`Builder{:tact}`][builder]. Returns that copy.

As a single [`Cell{:tact}`][cell] can store up to $4$ references, attempts to store more throw an exception with [exit code 8](/book/exit-codes#8): `Cell overflow`.

Usage example:

```tact
let b: Builder = beginCell();
let fizz: Builder = b.storeRef(emptyCell());
```

### Builder.storeMaybeRef

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
extends fun storeMaybeRef(self: Builder, cell: Cell?): Builder;
```

Extension function for the [`Builder{:tact}`][builder] type.

If the `cell` is not `null{:tact}`, stores $1$ as a single bit and then a reference to `cell` into a copy of the [`Builder{:tact}`][builder]. Returns that copy.

If the `cell` is `null{:tact}`, stores only $0$ as a single bit into the copy of the [`Builder{:tact}`][builder]. Returns that copy.

As a single [`Cell{:tact}`][cell] can store up to $4$ references, attempts to store more throw an exception with [exit code 8](/book/exit-codes#8): `Cell overflow`.

Usage example:

```tact
let b: Builder = beginCell();
let fizz: Builder = b
    .storeMaybeRef(emptyCell()) // stores a single 1 bit, then an empty cell
    .storeMaybeRef(null);       // stores only a single 0 bit
```

### Builder.refs

```tact
extends fun refs(self: Builder): Int;
```

Extension function for the [`Builder{:tact}`][builder] type.

Returns the number of cell references already stored in the [`Builder{:tact}`][builder] as an [`Int{:tact}`][int].

Usage example:

```tact
let b: Builder = beginCell();
let fizz: Int = b.refs(); // 0
```

### Builder.bits

```tact
extends fun bits(self: Builder): Int;
```

Extension function for the [`Builder{:tact}`][builder] type.

Returns the number of data bits already stored in the [`Builder{:tact}`][builder] as an [`Int{:tact}`][int].

Usage example:

```tact
let b: Builder = beginCell();
let fizz: Int = b.bits(); // 0
```

### Builder.depth

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
extends fun depth(self: Builder): Int;
```

Extension function for the [`Builder{:tact}`][builder] type.

Computes and returns the [`Int{:tact}`][int] [depth][std-repr] of the [`Builder{:tact}`][builder]. Produces $0$ if the [`Builder{:tact}`][builder] has no references stored so far, otherwise $1$ plus the maximum depth of the referenced cells.

Usage example:

```tact
let b: Builder = beginCell().storeInt(42, 7);
let depth: Int = b.depth(); // 0
```

### Builder.asSlice

```tact
extends fun asSlice(self: Builder): Slice;
```

Extension function for the [`Builder{:tact}`][builder] type.

Converts the [`Builder{:tact}`][builder] into a [`Slice{:tact}`][slice] and returns it. An alias to `self.endCell().beginParse(){:tact}`.

Usage example:

```tact
let b: Builder = beginCell();
let fizz: Slice = b.asSlice();
```

### Builder.asCell

```tact
extends fun asCell(self: Builder): Cell;
```

Extension function for the [`Builder{:tact}`][builder] type.

Converts the [`Builder{:tact}`][builder] into a [`Cell{:tact}`][cell] and returns it. An alias to `self.endCell(){:tact}`.

Usage example:

```tact
let b: Builder = beginCell();
let fizz: Cell = b.asCell();
```

## Slice

A section to group all extension and extension mutation functions for the [`Slice{:tact}`][slice] type.

### Slice.loadUint

```tact
extends mutates fun loadUint(self: Slice, l: Int): Int;
```

Extension mutation function for the [`Slice{:tact}`][slice] type.

Loads and returns an unsigned `l`-bit [`Int{:tact}`][int] from the [`Slice{:tact}`][slice], for $0 ≤ l ≤ 256$.

Attempts to specify an out-of-bounds `l` value throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Attempts to load more data than the [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s: Slice = beginCell().storeUint(42, 7).asSlice();
let fizz: Int = s.loadUint(7);
```

### Slice.preloadUint

```tact
extends fun preloadUint(self: Slice, l: Int): Int;
```

Extension function for the [`Slice{:tact}`][slice] type.

Preloads and returns an unsigned `l`-bit [`Int{:tact}`][int] from the [`Slice{:tact}`][slice], for $0 ≤ l ≤ 256$. Doesn't modify the [`Slice{:tact}`][slice].

Attempts to specify an out-of-bounds `l` value throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Attempts to preload more data than the [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s: Slice = beginCell().storeUint(42, 7).asSlice();
let fizz: Int = s.preloadUint(7);
```

### Slice.loadInt

```tact
extends mutates fun loadInt(self: Slice, l: Int): Int;
```

Extension mutation function for the [`Slice{:tact}`][slice] type.

Loads and returns a signed `l`-bit [`Int{:tact}`][int] from the [`Slice{:tact}`][slice], for $0 ≤ l ≤ 257$.

Attempts to specify an out-of-bounds `l` value throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Attempts to load more data than the [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s: Slice = beginCell().storeInt(42, 7).asSlice();
let fizz: Int = s.loadInt(7);
```

### Slice.preloadInt

```tact
extends fun preloadInt(self: Slice, l: Int): Int;
```

Extension function for the [`Slice{:tact}`][slice] type.

Preloads and returns a signed `l`-bit [`Int{:tact}`][int] from the [`Slice{:tact}`][slice], for $0 ≤ l ≤ 257$. Doesn't modify the [`Slice{:tact}`][slice].

Attempts to specify an out-of-bounds `l` value throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Attempts to preload more data than the [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s: Slice = beginCell().storeInt(42, 7).asSlice();
let fizz: Int = s.preloadInt(7);
```

### Slice.loadBits

```tact
extends mutates fun loadBits(self: Slice, l: Int): Slice;
```

Extension mutation function for the [`Slice{:tact}`][slice] type.

Loads $0 ≤$ `l` $≤ 1023$ bits from the [`Slice{:tact}`][slice] and returns them as a separate [`Slice{:tact}`][slice].

Attempts to specify an out-of-bounds `l` value throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Attempts to load more data than the [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s: Slice = beginCell().storeInt(42, 7).asSlice();
let fizz: Slice = s.loadBits(7);
```

### Slice.preloadBits

```tact
extends fun preloadBits(self: Slice, l: Int): Slice;
```

Extension function for the [`Slice{:tact}`][slice] type.

Preloads $0 ≤$ `l` $≤ 1023$ bits from the [`Slice{:tact}`][slice] and returns them as a separate [`Slice{:tact}`][slice]. Doesn't modify the original [`Slice{:tact}`][slice].

Attempts to specify an out-of-bounds `l` value throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Attempts to preload more data than the [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s: Slice = beginCell().storeInt(42, 7).asSlice();
let fizz: Slice = s.preloadBits(7);
```

:::note

  In order to reduce gas usage, prefer using this function over calling [`Slice.firstBits(){:tact}`](#slicefirstbits), since the latter is less optimized.

:::

### Slice.skipBits

```tact
extends mutates fun skipBits(self: Slice, l: Int);
```

Extension mutation function for the [`Slice{:tact}`][slice] type.

Loads all but the first $0 ≤$ `l` $≤ 1023$ bits from the [`Slice{:tact}`][slice].

Attempts to specify an out-of-bounds `l` value throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Attempts to load more data than the [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s: Slice = beginCell().storeInt(42, 7).asSlice();
s.skipBits(5);                   // all but first 5 bits
let fizz: Slice = s.loadBits(1); // load only 1 bit
```

### Slice.skipLastBits

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
extends fun skipLastBits(self: Slice, len: Int);
```

Extension function for the [`Slice{:tact}`][slice] type.

Preloads all but the last $0 ≤$ `len` $≤ 1023$ bits from the [`Slice{:tact}`][slice].

Attempts to specify an out-of-bounds `len` value throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Attempts to preload more data than the [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s: Slice = beginCell().storeInt(42, 7).asSlice();
let allButLastFive: Slice = s.skipLastBits(5); // all but last 5 bits,
                                               // i.e. only the first 2
```

### Slice.loadBool

```tact
extends mutates fun loadBool(self: Slice): Bool;
```

Extension mutation function for the [`Slice{:tact}`][slice] type.

Loads a single bit and returns a [`Bool{:tact}`][bool] value from the [`Slice{:tact}`][slice]. Reads `true{:tact}` if the loaded bit is equal to $1$, and reads `false{:tact}` otherwise.

Attempts to load more data than the [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s: Slice = beginCell().storeBool(true).asSlice();
let fizz: Bool = s.loadBool(); // true
```

### Slice.skipBool

<Badge text="Available since Tact 1.6.2" variant="tip" size="medium"/><p/>

```tact
extends mutates fun skipBool(self: Slice);
```

Extension mutation function for the [`Slice{:tact}`][slice] type.

Skips a single bit from the [`Slice{:tact}`][slice]. Similar to discarding the return value of `Slice.loadBool()`.

Attempts to skip more data than the [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s: Slice = beginCell()
    .storeBool(true)
    .storeUint(42, 7)
    .asSlice();

s.skipBool();
let fizz: Int = s.loadUint(7); // 42
```

### Slice.loadBit

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
extends mutates fun loadBit(self: Slice): Bool;
```

Extension mutation function for the [`Slice{:tact}`][slice] type.

An alias to [`Slice.loadBool(){:tact}`](#sliceloadbool).

Usage example:

```tact
let s: Slice = beginCell().storeBit(true).asSlice();
let fizz: Bool = s.loadBit(); // true
```

### Slice.loadCoins

```tact
extends mutates fun loadCoins(self: Slice): Int;
```

Extension mutation function for the [`Slice{:tact}`][slice] type.

Loads and returns a [serialized](#builderstorecoins) unsigned [`Int{:tact}`][int] value in the range from $0$ to $2^{120} - 1$ inclusive from the [`Slice{:tact}`][slice]. This value usually represents the amount in [nanoToncoins](/book/integers#nanotoncoin).

Attempts to load more data than the [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s: Slice = beginCell().storeCoins(42).asSlice();
let fizz: Int = s.loadCoins(); // 42
```

:::note[Useful links:]

  [Special `coins{:tact}` serialization type](/book/integers#serialization-varint)

:::

### Slice.skipCoins

<Badge text="Available since Tact 1.6.2" variant="tip" size="medium"/><p/>

```tact
extends mutates fun skipCoins(self: Slice);
```

Extension mutation function for the [`Slice{:tact}`][slice] type.

Skips a serialized unsigned [`Int{:tact}`][int] value in the range from $0$ to $2^{120} - 1$ inclusive from the [`Slice{:tact}`][slice]. Similar to discarding the return value of `Slice.loadCoins()`.

Attempts to skip more data than the [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s: Slice = beginCell()
    .storeCoins(239)
    .storeUint(42, 7)
    .asSlice();

s.skipCoins();
let fizz: Int = s.loadUint(7); // 42
```

### Slice.loadVarUint16

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
extends mutates fun loadVarUint16(self: Slice): Int;
```

Extension mutation function for the [`Slice{:tact}`][slice] type.

An alias to [`Slice.loadCoins(){:tact}`](#sliceloadcoins).

Usage example:

```tact
let s: Slice = beginCell().storeVarUint16(42).asSlice();
let fizz: Int = s.loadVarUint16(); // 42
```

:::note[Useful links:]

  [Types of variable bit-width](/book/integers#serialization-varint)

:::

### Slice.skipVarUint16

<Badge text="Available since Tact 1.6.2" variant="tip" size="medium"/><p/>

```tact
extends mutates fun skipVarUint16(self: Slice);
```

Extension mutation function for the [`Slice{:tact}`][slice] type.

Alias to `Slice.skipCoins()`.

Usage example:

```tact
let s: Slice = beginCell()
    .storeVarUint16(239)
    .storeUint(42, 7)
    .asSlice();

s.skipVarUint16();
let fizz: Int = s.loadUint(7); // 42
```

### Slice.loadVarInt16

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
extends mutates fun loadVarInt16(self: Slice): Int;
```

Extension mutation function for the [`Slice{:tact}`][slice] type.

Similar to [`Slice.loadCoins(){:tact}`](#sliceloadcoins), but with a different `value` range: from $-2^{119}$ to $2^{119} - 1$ inclusive.

Attempts to load more data than [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s: Slice = beginCell().storeVarInt16(-42).asSlice();
let fizz: Int = s.loadVarInt16(); // -42
```

:::note[Useful links:]

  [Types of variable bit-width](/book/integers#serialization-varint)

:::

### Slice.skipVarInt16

<Badge text="Available since Tact 1.6.2" variant="tip" size="medium"/><p/>

```tact
extends mutates fun skipVarInt16(self: Slice);
```

Extension mutation function for the [`Slice{:tact}`][slice] type.

Similar to `Slice.skipCoins()`, but with a different `value` range: from $-2^{119}$ to $2^{119} - 1$ inclusive.

Attempts to skip more data than the [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s: Slice = beginCell()
    .storeVarInt16(-239)
    .storeUint(42, 7)
    .asSlice();

s.skipVarInt16();
let fizz: Int = s.loadUint(7); // 42
```

### Slice.loadVarUint32

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
extends mutates fun loadVarUint32(self: Slice): Int;
```

Loads and returns a [serialized](#builderstorevaruint32) unsigned [`Int{:tact}`][int] value in the range from $0$ to $2^{248} - 1$ inclusive from the [`Slice{:tact}`][slice].

Attempts to load more data than [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s: Slice = beginCell().storeVarUint32(420000).asSlice();
let fizz: Int = s.loadVarUint32(); // 420000
```

:::note[Useful links:]

  [Types of variable bit-width](/book/integers#serialization-varint)

:::

### Slice.skipVarUint32

<Badge text="Available since Tact 1.6.2" variant="tip" size="medium"/><p/>

```tact
extends mutates fun skipVarUint32(self: Slice);
```

Extension mutation function for the [`Slice{:tact}`][slice] type.

Skips a serialized unsigned [`Int{:tact}`][int] value in the range from $0$ to $2^{248} - 1$ inclusive from the [`Slice{:tact}`][slice]. Similar to discarding the return value of `Slice.loadVarUint32()`.

Attempts to skip more data than the [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s: Slice = beginCell()
    .storeVarUint32(239)
    .storeUint(42, 7)
    .asSlice();

s.skipVarUint32();
let fizz: Int = s.loadUint(7); // 42
```

### Slice.loadVarInt32

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
extends mutates fun loadVarInt32(self: Slice): Int;
```

Similar to [`Slice.loadVarUint32(){:tact}`](#sliceloadvaruint32), but with a different `value` range: from $-2^{247}$ to $2^{247} - 1$ inclusive.

Attempts to load more data than [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s: Slice = beginCell().storeVarInt32(-420000).asSlice();
let fizz: Int = s.loadVarInt32(); // -420000
```

:::note[Useful links:]

  [Types of variable bit-width](/book/integers#serialization-varint)

:::

### Slice.skipVarInt32

<Badge text="Available since Tact 1.6.2" variant="tip" size="medium"/><p/>

```tact
extends mutates fun skipVarInt32(self: Slice);
```

Extension mutation function for the [`Slice{:tact}`][slice] type.

Similar to `Slice.skipVarUint32()`, but with a different `value` range: from $-2^{247}$ to $2^{247} - 1$ inclusive.

Attempts to skip more data than the [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s: Slice = beginCell()
    .storeVarInt32(-239)
    .storeUint(42, 7)
    .asSlice();

s.skipVarInt32();
let fizz: Int = s.loadUint(7); // 42
```

### Slice.loadAddress

```tact
extends mutates fun loadAddress(self: Slice): Address;
```

Extension mutation function for the [`Slice{:tact}`][slice] type.

Loads and returns an [`Address{:tact}`][p] from the [`Slice{:tact}`][slice].

Attempts to load more data than [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s: Slice = beginCell().storeAddress(myAddress()).asSlice();
let fizz: Address = s.loadAddress();
```

### Slice.skipAddress

<Badge text="Available since Tact 1.6.2" variant="tip" size="medium"/><p/>

```tact
extends mutates fun skipAddress(self: Slice);
```

Extension mutation function for the [`Slice{:tact}`][slice] type.

Skips an [`Address{:tact}`][p] from the [`Slice{:tact}`][slice].

Attempts to skip more data than [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s1: Slice = beginCell()
    .storeAddress(myAddress())
    .storeUint(42, 32)
    .asSlice();

s1.skipAddress();
let fizz: Int = s1.loadUint(32); // 42
```

### Slice.loadRef

```tact
extends mutates fun loadRef(self: Slice): Cell;
```

Extension mutation function for the [`Slice{:tact}`][slice] type.

Loads the next reference from the [`Slice{:tact}`][slice] as a [`Cell{:tact}`][cell].

Attempts to load more data than [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage examples:

```tact
let s1: Slice = beginCell().storeRef(emptyCell()).asSlice();
let fizz: Cell = s1.loadRef();

let s2: Slice = beginCell()
    .storeRef(emptyCell())
    .storeRef(s1.asCell())
    .asSlice();
let ref1: Cell = s2.loadRef();
let ref2: Cell = s2.loadRef();
ref1 == ref2; // false
```

### Slice.preloadRef

```tact
extends fun preloadRef(self: Slice): Cell;
```

Extension function for the [`Slice{:tact}`][slice] type.

Preloads the next reference from the [`Slice{:tact}`][slice] as a [`Cell{:tact}`][cell]. Doesn't modify the original [`Slice{:tact}`][slice].

Attempts to preload more data than the [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage examples:

```tact
let s1: Slice = beginCell().storeRef(emptyCell()).asSlice();
let fizz: Cell = s1.preloadRef(); // doesn't modify s1

let s2: Slice = beginCell()
    .storeRef(emptyCell())
    .storeRef(s1.asCell())
    .asSlice();

let ref1: Cell = s2.preloadRef();
let ref2: Cell = s2.preloadRef();
ref1 == ref2; // true
```

### Slice.skipRef

<Badge text="Available since Tact 1.6.2" variant="tip" size="medium"/><p/>

```tact
extends mutates fun skipRef(self: Slice);
```

Extension mutation function for the [`Slice{:tact}`][slice] type.

Skips the next reference from the [`Slice{:tact}`][slice]. Similar to discarding the return value of `Slice.loadRef()`.

Attempts to skip more data than the [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s1: Slice = beginCell()
    .storeRef(emptyCell())
    .storeUint(42, 32)
    .asSlice();

s1.skipRef();
let fizz: Int = s1.loadUint(32); // 42
```


### Slice.loadMaybeRef

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
extends mutates fun loadMaybeRef(self: Slice): Cell?;
```

Extension mutation function for the [`Slice{:tact}`][slice] type.

Loads a single bit from the [`Slice{:tact}`][slice]: if it's $1$, the referenced [`Cell{:tact}`][cell] is loaded and returned. If the loaded bit is $0$, nothing else is loaded and `null{:tact}` is returned.

Attempts to load more data than the [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s = msg.asSlice();
let outActions = s.loadMaybeRef();

if (outActions != null) {
    let actions = outActions!!;
    // process actions
}
```

### Slice.preloadMaybeRef

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
extends fun preloadMaybeRef(self: Slice): Cell?;
```

Extension function for the [`Slice{:tact}`][slice] type.

Preloads a single bit from the [`Slice{:tact}`][slice]: if it's $1$, the referenced [`Cell{:tact}`][cell] is preloaded and returned. If the preloaded bit is $0$, `null{:tact}` is returned. Doesn't modify the original [`Slice{:tact}`][slice].

Attempts to preload more data than the [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage examples:

```tact
let s1: Slice = beginCell().storeMaybeRef(emptyCell()).asSlice();
let fizz: Cell = s1.preloadMaybeRef(); // returns emptyCell() and doesn't modify s1

let s2: Slice = beginCell()
    .storeMaybeRef(null)
    .storeMaybeRef(s1.asCell())
    .asSlice();

let ref1: Cell = s2.preloadMaybeRef(); // returns null and doesn't modify s2
let ref2: Cell = s2.preloadMaybeRef(); // same effect
ref1 == null; // true
ref1 == ref2; // true
```

### Slice.skipMaybeRef

<Badge text="Available since Tact 1.6.2" variant="tip" size="medium"/><p/>

```tact
extends mutates fun skipMaybeRef(self: Slice);
```

Extension mutation function for the [`Slice{:tact}`][slice] type.

Skips `Cell?` from the [`Slice{:tact}`][slice]. Similar to discarding the return value of `Slice.loadMaybeRef()`.

Attempts to skip more data than the [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s1: Slice = beginCell()
    .storeMaybeRef(emptyCell())
    .storeUint(42, 32)
    .asSlice();

s1.skipMaybeRef();
let fizz: Int = s1.loadUint(32); // 42
```

### Slice.refs

```tact
extends fun refs(self: Slice): Int;
```

Extension function for the [`Slice{:tact}`][slice] type.

Returns the number of references in the [`Slice{:tact}`][slice] as an [`Int{:tact}`][int].

Usage example:

```tact
let s: Slice = beginCell().storeRef(emptyCell()).asSlice();
let fizz: Int = s.refs();
```

### Slice.bits

```tact
extends fun bits(self: Slice): Int;
```

Extension function for the [`Slice{:tact}`][slice] type.

Returns the number of data bits in the [`Slice{:tact}`][slice] as an [`Int{:tact}`][int].

Usage example:

```tact
let s: Slice = beginCell().storeRef(emptyCell()).asSlice();
let fizz: Int = s.bits();
```

### Slice.firstBits

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
extends fun firstBits(self: Slice, len: Int): Slice;
```

Extension function for the [`Slice{:tact}`][slice] type.

Preloads the first $0 ≤$ `len` $≤ 1023$ bits from the [`Slice{:tact}`][slice].

Attempts to specify an out-of-bounds `len` value throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Attempts to preload more data than the [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s: Slice = beginCell().storeInt(42, 7).asSlice();
let firstFive: Slice = s.firstBits(5); // first 5 bits
```

:::note

  In order to reduce gas usage, prefer calling [`Slice.preloadBits(){:tact}`](#slicepreloadbits) over using this function, since the former is more optimized.

:::

### Slice.lastBits

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
extends fun lastBits(self: Slice, len: Int): Slice;
```

Extension function for the [`Slice{:tact}`][slice] type.

Preloads the last $0 ≤$ `len` $≤ 1023$ bits from the [`Slice{:tact}`][slice].

Attempts to specify an out-of-bounds `len` value throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Attempts to preload more data than the [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let s: Slice = beginCell().storeInt(42, 7).asSlice();
let lastFive: Slice = s.lastBits(5); // last 5 bits
```

### Slice.depth

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
extends fun depth(self: Slice): Int;
```

Extension function for the [`Slice{:tact}`][slice] type.

Computes and returns the [`Int{:tact}`][int] [depth][std-repr] of the [`Slice{:tact}`][slice]. Produces $0$ if the [`Slice{:tact}`][slice] has no references. Otherwise, it returns $1$ plus the maximum of the depths of the referenced cells.

Usage example:

```tact
let s: Slice = beginCell().storeInt(42, 7).asSlice();
let depth: Int = s.depth(); // 0
```

### Slice.computeDataSize

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/>
<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
extends fun computeDataSize(self: Slice, maxCells: Int): DataSize;
```

Extension function for the [`Slice{:tact}`][slice] type.

Similar to [`Cell.computeDataSize(){:tact}`](#cellcomputedatasize), but does not take into account the cell that contains the [`Slice{:tact}`][slice] itself. However, it accounts for its bits and refs.

The results are packed into a `DataSize{:tact}` [struct][struct] consisting of:

Field   | Type                | Description
:------ | :------------------ | :----------
`cells` | [`Int{:tact}`][int] | The total number of nested cells, including the starting one
`bits`  | [`Int{:tact}`][int] | The total number of bits in all nested cells, including the starting one
`refs`  | [`Int{:tact}`][int] | The total number of refs in all nested cells, including the starting one

If the specified `maxCells` value is insufficient to traverse all cells **not** including the starting one, an exception with [exit code 8](/book/exit-codes#8) is thrown: `Cell overflow`.

Attempts to specify a negative value for `maxCells` throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Usage example:

```tact
let s: Slice = beginCell().storeInt(42, 7).storeRef(emptyCell()).asSlice();
try {
    let dataSize: DataSize = s.computeDataSize(1);
    dataSize.cells; // 1
    dataSize.bits;  // 7
    dataSize.refs;  // 1
} catch (exitCode) {
    // if maxCells was insufficient to traverse the cell
    // and all of its references, the exitCode here would be 8
}
```

### Slice.empty

```tact
extends fun empty(self: Slice): Bool;
```

Extension function for the [`Slice{:tact}`][slice] type.

Checks whether the [`Slice{:tact}`][slice] is empty (i.e., contains no bits of data and no cell references). Returns `true{:tact}` if it is empty, `false{:tact}` otherwise.

Usage example:

```tact
let s: Slice = beginCell().storeRef(emptyCell()).asSlice();
let fizz: Bool = s.empty();                     // false
let buzz: Bool = beginCell().asSlice().empty(); // true
```

:::note

  Unlike [`Slice.endParse(){:tact}`](#sliceendparse), this function does not throw any exceptions, even when the [`Slice{:tact}`][slice] is empty.

:::

### Slice.dataEmpty

```tact
extends fun dataEmpty(slice: Slice): Bool;
```

Extension function for the [`Slice{:tact}`][slice] type.

Checks whether the [`Slice{:tact}`][slice] has no bits of data. Returns `true{:tact}` if it has no data, `false{:tact}` otherwise.

Usage example:

```tact
let s: Slice = beginCell().storeRef(emptyCell()).asSlice();
let fizz: Bool = s.dataEmpty();  // true

let s2: Slice = beginCell().storeInt(42, 7).asSlice();
let buzz: Bool = s2.dataEmpty(); // false
```

### Slice.refsEmpty

```tact
extends fun refsEmpty(slice: Slice): Bool;
```

Extension function for the [`Slice{:tact}`][slice] type.

Checks whether the [`Slice{:tact}`][slice] has no references. Returns `true{:tact}` if it has no references, `false{:tact}` otherwise.

Usage example:

```tact
let s: Slice = beginCell().storeRef(emptyCell()).asSlice();
let fizz: Bool = s.refsEmpty();                     // false
let buzz: Bool = beginCell().asSlice().refsEmpty(); // true
```

### Slice.endParse

```tact
extends fun endParse(self: Slice);
```

Extension function for the [`Slice{:tact}`][slice] type.

Checks whether the [`Slice{:tact}`][slice] is empty (i.e., contains no bits of data and no cell references). If it is not, it throws an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage examples:

```tact {2,6}
let emptyOne: Slice = emptySlice();
emptyOne.endParse(); // nothing, as it's empty

let paul: Slice = "Fear is the mind-killer".asSlice();
try {
    paul.endParse(); // throws exit code 9
}
```

### Slice.hash

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

```tact
extends fun hash(self: Slice): Int;
```

Extension function for the [`Slice{:tact}`][slice] type.

Calculates and returns an [`Int{:tact}`][int] value of the [SHA-256][sha-2] hash of the [standard `Cell{:tact}` representation][std-repr] of the given [`Slice{:tact}`][slice].

Usage example:

```tact
let s: Slice = beginCell().asSlice();
let fizz: Int = s.hash();
```

### Slice.hashData

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
extends fun hashData(self: Slice): Int;
```

Extension function for the [`Slice{:tact}`][slice] type.

Calculates and returns an [`Int{:tact}`][int] value of the [SHA-256][sha-2] hash of the data bits from the given [`Slice{:tact}`][slice], which should have a number of bits divisible by 8.

Unlike [`sha256(){:tact}`](/ref/core-crypto#sha256), this function is gas-efficient and **only** hashes the data of the given [`Slice{:tact}`][slice], i.e. up to 1023 bits, ignoring the refs.

Attempts to specify a [`Slice{:tact}`][slice] with a number of bits **not** divisible by 8 throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage examples:

```tact
// Base64-encoded BoC with "Hello, World!"
let short: Slice = slice("te6cckEBAQEADgAAGEhlbGxvIHdvcmxkIXgtxbw=");

// It's enough to only take the hash of the data
sha256(short) == short.hashData(); // true

// But if we construct a slice larger than 1023 bits with all refs combined,
// we must use sha256() or we'll get skewed results or even collisions

let tmp: Builder = beginCell();
repeat (127) { tmp = tmp.storeUint(69, 8) } // storing 127 bytes
let ref: Cell = beginCell().storeUint(33, 8).endCell();
let long: Slice = tmp.storeRef(ref).asSlice(); // plus a ref with a single byte

// Hashing just the data bits in the current slice isn't enough
sha256(long) == long.hashData(); // false!
```

### Slice.asCell

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

```tact
extends fun asCell(self: Slice): Cell;
```

Extension function for the [`Slice{:tact}`][slice] type.

Converts the [`Slice{:tact}`][slice] to a [`Cell{:tact}`][cell] and returns it. An alias to `beginCell().storeSlice(self).endCell(){:tact}`.

Usage example:

```tact
let s: Slice = beginCell().asSlice();
let fizz: Cell = s.asCell();
let buzz: Cell = beginCell().storeSlice(s).endCell();

fizz == buzz; // true
```

### Slice.asString

```tact
extends fun asString(self: Slice): String;
```

Extension function for the [`Slice{:tact}`][slice] type.

Casts the [`Slice{:tact}`][slice] to a [`String{:tact}`][p] and returns it. The inverse of [`String.asSlice(){:tact}`](/ref/core-strings#stringasslice).

Usage example:

```tact
let s: String = "Keep your Slices close, but your Strings closer.";
let fizz: String = s;
let buzz: String = s.asSlice().asString();

fizz == buzz; // true
```

### Slice.fromBase64

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

```tact
extends fun fromBase64(self: Slice): Slice;
```

Extension function for the [`Slice{:tact}`][slice] type.

Returns a new [`Slice{:tact}`][slice] from the decoded [Base64](https://en.wikipedia.org/wiki/Base64) [`Slice{:tact}`][slice].

Note that this function is limited and only takes the first 1023 bits of data from the given [`Slice{:tact}`][slice], without throwing an exception if the [`Slice{:tact}`][slice] has more data (i.e., when it has any references).

If the given [`Slice{:tact}`][slice] contains characters not from the Base64 set, an exception with [exit code 134](/book/exit-codes#134) will be thrown: `Invalid argument`.

Usage example:

```tact
let s: Slice = "SSBhbSBHcm9vdC4=".asSlice();
let fizz: Slice = s.fromBase64();
```

### Slice.asAddress

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
extends fun asAddress(self: Slice, chain: Int): Address;
```

Extension function for the [`Slice{:tact}`][slice] type.

Casts the [`Slice{:tact}`][slice] to an [`Address{:tact}`][p] on a given `chain` ID and returns it. It is the inverse of [`Address.asSlice(){:tact}`](/ref/core-addresses#addressasslice) and a safe but more gas-expensive version of [`Slice.asAddressUnsafe(){:tact}`](#sliceasaddressunsafe).

Attempts to specify a [`Slice{:tact}`][slice] with an invalid [account ID](https://docs.ton.org/learn/overviews/addresses#account-id) length throw an error with [exit code 136](/book/exit-codes#): `Invalid standard address`.

Attempts to specify a [`Slice{:tact}`][slice] with an invalid tag prefix (not `0b100`) or with an invalid [account ID](https://docs.ton.org/learn/overviews/addresses#account-id) length (not 256 bits) throw an error with [exit code 136](/book/exit-codes#): `Invalid standard address`.

Usage example:

```tact
let a: Address = myAddress(); // let's assume we're in a basechain
let a2: Address = a.asSlice().asAddress(0); // so the chain ID is 0

a == a2; // true
```

:::note

  Because of the checks performed, this function is more gas-expensive than its unsafe but cheaper counterpart: [`Slice.asAddressUnsafe(){:tact}`](#sliceasaddressunsafe).

:::

### Slice.asAddressUnsafe

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
extends fun asAddressUnsafe(self: Slice): Address;
```

Extension function for the [`Slice{:tact}`][slice] type.

Unsafely casts the [`Slice{:tact}`][slice] to an [`Address{:tact}`][p] and returns it. The inverse of [`Address.asSlice(){:tact}`](/ref/core-addresses#addressasslice).

This function does **not** perform any checks on the contents of the [`Slice{:tact}`][slice].

Usage example:

```tact
let a: Address = myAddress();
let a2: Address = a.asSlice().asAddressUnsafe();

a == a2; // true
```

:::caution

  Use it only if you want to optimize the code for gas and can guarantee in advance that the [`Slice{:tact}`][slice] contains the data of an [`Address{:tact}`][p].

  Otherwise, use the safer but more gas-expensive [`Slice.asAddress(){:tact}`](#sliceasaddress) function.

:::

## Struct.toCell

```tact
extends fun toCell(self: Struct): Cell;
```

Extension function for any [struct][struct] type.

Converts the struct to a [`Cell{:tact}`][cell] and returns it.

Usage example:

```tact
struct GuessCoin {
    probably: Int as coins;
    nothing: Int as coins;
}

fun coinCell(): Cell {
    let s: GuessCoin = GuessCoin { probably: 42, nothing: 27 };
    let fizz: Cell = s.toCell();

    return fizz; // "x{12A11B}"
}
```

## Struct.toSlice

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
extends fun toSlice(self: Struct): Slice;
```

Extension function for any [struct][struct] type.

Converts the struct to a [`Slice{:tact}`][slice] and returns it. An alias to `self.toCell().asSlice(){:tact}`.

Usage example:

```tact
struct GuessCoin {
    probably: Int as coins;
    nothing: Int as coins;
}

fun coinSlice(): Slice {
    let s: GuessCoin = GuessCoin { probably: 42, nothing: 27 };
    let fizz: Slice = s.toSlice();

    return fizz; // "CS{Cell{000612a11b} bits: 0..24; refs: 0..0}"
}
```

## Struct.fromCell

```tact
fun Struct.fromCell(cell: Cell): Struct;
```

Extension function for any [struct][struct] type.

Converts a [`Cell{:tact}`][cell] into the specified struct and returns that struct.

Attempts to pass a [`Cell{:tact}`][cell] with a layout different from the specified struct or to load more data than the [`Cell{:tact}`][cell] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage examples:

```tact
struct GuessCoin {
    probably: Int as coins;
    nothing: Int as coins;
}

fun directParse(payload: Cell): GuessCoin {
    return GuessCoin.fromCell(payload);
}

fun cautiousParse(payload: Cell): GuessCoin? {
    let coin: GuessCoin? = null;
    try {
        coin = GuessCoin.fromCell(payload);
    } catch (e) {
        dump("Cell payload doesn't match GuessCoin struct!");
    }
    return coin;
}
```

## Struct.fromSlice

```tact
fun Struct.fromSlice(slice: Slice): Struct;
```

Extension function for any [Struct][struct] type.

Converts a [`Slice{:tact}`][slice] into the specified struct and returns that struct.

Attempts to pass a [`Slice{:tact}`][slice] with a layout different from the specified struct or to load more data than the [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage examples:

```tact
struct GuessCoin {
    probably: Int as coins;
    nothing: Int as coins;
}

fun directParse(payload: Slice): GuessCoin {
    return GuessCoin.fromSlice(payload);
}

fun cautiousParse(payload: Slice): GuessCoin? {
    let coin: GuessCoin? = null;
    try {
        coin = GuessCoin.fromSlice(payload);
    } catch (e) {
        dump("Slice payload doesn't match GuessCoin struct!");
    }
    return coin;
}
```

## Message.toCell

```tact
extends fun toCell(self: Message): Cell;
```

Extension function for any [Message][message] type.

Converts the [Message][message] to a [`Cell{:tact}`][cell] and returns it.

Usage example:

```tact
message GuessCoin {
    probably: Int as coins;
    nothing: Int as coins;
}

fun coinCell(): Cell {
    let s: GuessCoin = GuessCoin { probably: 42, nothing: 27 };
    let fizz: Cell = s.toCell();

    return fizz; // "x{AB37107712A11B}"
}
```

## Message.toSlice

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
extends fun toSlice(self: Message): Slice;
```

Extension function for any [Message][message] type.

Converts the [Message][message] to a [`Slice{:tact}`][slice] and returns it. An alias to `self.toCell().asSlice(){:tact}`.

Usage example:

```tact
message GuessCoin {
    probably: Int as coins;
    nothing: Int as coins;
}

fun coinSlice(): Slice {
    let s: GuessCoin = GuessCoin { probably: 42, nothing: 27 };
    let fizz: Slice = s.toSlice();

    return fizz; // "CS{Cell{000eab37107712a11b} bits: 0..56; refs: 0..0}"
}
```

## Message.fromCell

```tact
fun Message.fromCell(cell: Cell): Message;
```

Extension function for any [Message][message] type.

Converts a [`Cell{:tact}`][cell] into the specified [Message][message] and returns that [Message][message].

Attempts to pass a [`Cell{:tact}`][cell] that contains an [opcode prefix][opcode] of a different message throw an exception with [exit code 129](/book/exit-codes#129): `Invalid serialization prefix`.

Attempts to pass a [`Cell{:tact}`][cell] with a layout different from the specified [Message][message] or to load more data than a [`Cell{:tact}`][cell] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage examples:

```tact
message(0x777) TripleAxe {
    prize: Int as uint32;
}

fun directParse(payload: Cell): TripleAxe {
    return TripleAxe.fromCell(payload);
}

fun cautiousParse(payload: Cell): TripleAxe? {
    let coin: TripleAxe? = null;
    try {
        coin = TripleAxe.fromCell(payload);
    } catch (e) {
        dump("Cell payload doesn't match TripleAxe Message!");
    }
    return coin;
}
```

## Message.fromSlice

```tact
fun Message.fromSlice(slice: Slice): Message;
```

Extension function for any [Message][message] type.

Converts a [`Slice{:tact}`][slice] into the specified [Message][message] and returns that [Message][message].

Attempts to pass a [`Slice{:tact}`][slice] that contains an [opcode prefix][opcode] of a different message throw an exception with [exit code 129](/book/exit-codes#129): `Invalid serialization prefix`.

Attempts to pass a [`Slice{:tact}`][slice] with a layout different from the specified [Message][message] or to load more data than a [`Slice{:tact}`][slice] contains throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage examples:

```tact
message(0x777) TripleAxe {
    prize: Int as uint32;
}

fun directParse(payload: Slice): TripleAxe {
    return TripleAxe.fromSlice(payload);
}

fun cautiousParse(payload: Slice): TripleAxe? {
    let coin: TripleAxe? = null;
    try {
        coin = TripleAxe.fromSlice(payload);
    } catch (e) {
        dump("Slice payload doesn't match TripleAxe Message!");
    }
    return coin;
}
```

## Message.opcode

<Badge text="Available since Tact 1.6.7" variant="tip" size="medium"/><p/>

```tact
fun Message.opcode(): Int;
```

Extension function for any [Message][message] type.

Returns the [opcode][opcode] of the [Message][message].

Usage example:

```tact
message(0x777) TripleAxe {
    prize: Int as uint32;
}

contract Example {
    receive(msg: TripleAxe) {
        dump(TripleAxe.opcode()); // 0x777
   }
}
```

## Contract.toCell

<Badge text="Available since Tact 1.6.12" variant="tip" size="medium"/><p/>

```tact
extends fun toCell(self: Contract): Cell;
```

Extension function for any [contract][contract] type.

Converts the contract state to a [`Cell{:tact}`][cell] and returns it.

Usage example:

```tact
contract Example {
    probably: Int as coins = 42;
    nothing: Int as coins = 27;

    get fun asCell(): Cell {
        return self.toCell();
    }
}
```

:::note

    If a contract doesn't use [contract parameters](/book/contracts#parameters), the resulting `Cell{:tact}` or `Slice{:tact}` will contain a leading one bit representing the [lazy initialization bit](/book/functions/#init).

:::

## Contract.toSlice

<Badge text="Available since Tact 1.6.12" variant="tip" size="medium"/><p/>

```tact
extends fun toSlice(self: Contract): Slice;
```

Extension function for any [contract][contract] type.

Converts the contract state to a [`Slice{:tact}`][slice] and returns it. An alias to `self.toCell().asSlice(){:tact}`.

Usage example:

```tact
contract Example {
    probably: Int as coins = 42;
    nothing: Int as coins = 27;

    get fun asSlice(): Slice {
        return self.toSlice();
    }
}
```

:::note

    If a contract doesn't use [contract parameters](/book/contracts#parameters), the resulting `Cell{:tact}` or `Slice{:tact}` will contain a leading one bit representing the [lazy initialization bit](/book/functions/#init).

:::

## Contract.fromCell

<Badge text="Available since Tact 1.6.13" variant="tip" size="medium"/><p/>

```tact
fun fromCell(cell: Cell): Contract;
```

Extension function for any [contract][contract] type.

Converts a [`Cell{:tact}`][cell] into the specified contract struct and returns it.

Usage example:

```tact
contract GuessCoinContract {
    probably: Int as coins = 42;
    nothing: Int as coins = 27;

    receive() { cashback(sender()) }
}

fun directParse(payload: Cell): GuessCoinContract {
    return GuessCoinContract.fromCell(payload);
}

fun cautiousParse(payload: Cell): GuessCoinContract? {
    let coin: GuessCoinContract? = null;
    try {
        coin = GuessCoinContract.fromCell(payload);
    } catch (e) {
        dump("Cell payload doesn't match GuessCoinContract struct!");
    }
    return coin;
}
```

## Contract.fromSlice

<Badge text="Available since Tact 1.6.13" variant="tip" size="medium"/><p/>

```tact
fun fromSlice(slice: Slice): Contract;
```

Extension function for any [contract][contract] type.

Converts a [`Slice{:tact}`][slice] into the specified contract struct and returns it.

Usage example:

```tact
contract GuessCoinContract {
    probably: Int as coins = 42;
    nothing: Int as coins = 27;

    receive() { cashback(sender()) }
}

fun directParse(payload: Slice): GuessCoinContract {
    return GuessCoinContract.fromSlice(payload);
}

fun cautiousParse(payload: Slice): GuessCoinContract? {
    let coin: GuessCoinContract? = null;
    try {
        coin = GuessCoinContract.fromSlice(payload);
    } catch (e) {
        dump("Slice payload doesn't match GuessCoinContract struct!");
    }
    return coin;
}
```

[p]: /book/types#primitive-types
[bool]: /book/types#booleans
[int]: /book/integers
[cell]: /book/cells#cells
[builder]: /book/cells#builders
[slice]: /book/cells#slices
[map]: /book/maps
[struct]: /book/structs-and-messages#structs
[contract]: /book/contracts
[message]: /book/structs-and-messages#messages
[opcode]: /book/structs-and-messages#message-opcodes
[null]: /book/optionals

[std-repr]: /book/cells#cells-representation

[tlb]: https://docs.ton.org/develop/data-formats/tl-b-language
[sha-2]: https://en.wikipedia.org/wiki/SHA-2#Hash_standard
[dfs]: https://en.wikipedia.org/wiki/Depth-first_search
[gas]: https://docs.ton.org/v3/documentation/smart-contracts/transaction-fees/fees#gas



================================================
FILE: docs/src/content/docs/ref/core-comptime.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/core-comptime.mdx
================================================
---
title: Compile-time
description: "Various compile-time global functions from the Core library of Tact"
---

import { Badge } from '@astrojs/starlight/components';

This page lists all the built-in [global functions](/book/functions#fun-global) that are evaluated at the time of building the Tact project and cannot work with non-constant runtime data. These functions are commonly referred to as "compile-time functions" or _comptime_ functions for short.

## address

```tact
fun address(s: String): Address;
```

A compile-time function that converts a [`String{:tact}`][p] containing an address into the [`Address{:tact}`][p] type and embeds it into the contract.

Usage example:

```tact
contract Example {
    // Persistent state variables
    addr: Address =
        address("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N"); // works at compile-time!
}
```

:::note

  The `address("...Address..."){:tact}` in Tact is equivalent to `"...Address..."a{:func}` in FunC.

:::

## cell

```tact
fun cell(bocBase64: String): Cell;
```

A compile-time function that embeds a base64-encoded [BoC][boc] `bocBase64` as a [`Cell{:tact}`][cell] into the contract.

Usage example:

```tact
contract Example {
    // Persistent state variables
    stored: Cell =
        // Init package for Wallet V3R1 as a base64-encoded BoC
        cell("te6cckEBAQEAYgAAwP8AIN0gggFMl7qXMO1E0NcLH+Ck8mCDCNcYINMf0x/TH/gjE7vyY+1E0NMf0x/T/9FRMrryoVFEuvKiBPkBVBBV+RDyo/gAkyDXSpbTB9QC+wDo0QGkyMsfyx/L/8ntVD++buA="); // works at compile-time!
}
```

## slice

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun slice(bocBase64: String): Slice;
```

A compile-time function that embeds a base64-encoded [BoC][boc] `bocBase64` as a [`Slice{:tact}`][slice] into the contract.

Usage example:

```tact
contract Example {
    // Persistent state variables
    stored: Slice =
        // Works at compile-time!
        slice("te6cckEBAQEADgAAGEhlbGxvIHdvcmxkIXgtxbw="); // Hello world!
}
```

## rawSlice

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun rawSlice(hex: String): Slice;
```

A compile-time function that converts the `hex` [`String{:tact}`][p], containing hex-encoded and optionally bit-padded contents, into a [`Slice{:tact}`][slice] and embeds it into the contract.

Contents are bit-padded if there is an underscore `_` at the very end of the [`String{:tact}`][p]. Padding removes all trailing zeros and the last $1$ bit before them:

```tact
// Not bit-padded
rawSlice("4a").loadUint(8); // 74, or 1001010 in binary

// Bit-padded
rawSlice("4a_").loadUint(6); // 18, or 10010 in binary
```

Note that this function is limited and only allows specifying up to $1023$ bits.

Usage example:

```tact
contract Example {
    // Persistent state variables
    stored: Slice =
        rawSlice("000DEADBEEF000");  // CS{Cell{03f...430} bits: 588..644; refs: 1..1}
    bitPadded: Slice =
        rawSlice("000DEADBEEF000_"); // CS{Cell{03f...e14} bits: 36..79; refs: 0..0}
}
```

:::note

  The `rawSlice("...Hex contents..."){:tact}` in Tact is equivalent to `"...Hex contents..."s{:func}` in FunC.

:::

## ascii

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun ascii(str: String): Int;
```

A compile-time function that concatenates the numerical values of the characters in the non-empty string `str` into one value of the [`Int{:tact}`][int] type. This function works only for strings occupying up to 32 bytes, allowing the representation of up to 32 [ASCII codes](https://en.wikipedia.org/wiki/ASCII#Control_code_chart) or up to 8 [Unicode code points](https://en.wikipedia.org/wiki/List_of_Unicode_characters) of 4 bytes each, so the resulting non-negative integer fits into 256 bits.

To understand how the `ascii` function works, consider the following pseudo-Tact example involving hexadecimal escape sequences:

```tact
ascii("NstK") == ascii("\x4e\x73\x74\x4b") == 0x4e73744b == 1316189259
```

Each ASCII character in the string `"NstK"` is represented by its hexadecimal escape sequence, which is then converted to the corresponding integer value by concatenating all the bytes.

The `ascii` builtin assumes the string is encoded in UTF-8. For example, the `⚡` character's UTF-8 encoding is `0xE2 0x9A 0xA1`, so `0xE2` will be the most significant byte.

The builtin can be used to create human-readable encodings for some actions or operations.

Usage example:

```tact
message(42) Action {
  action: Int as uint256;
}

contract Example {
    receive(msg: Action) {
        if (msg.action == ascii("start")) {
            // Do something
        } else if (msg.action == ascii("stop")) {
            // Do something else
        }
    }
}
```

:::note

  The `ascii("...String contents..."){:tact}` in Tact is almost equivalent to `"...String contents..."u{:func}` in FunC.
  But FunC does not support Unicode code point escapes or hexadecimal escape sequences.

:::

## crc32

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun crc32(str: String): Int;
```

A compile-time function that computes a checksum using the [CRC-32](https://en.wikipedia.org/wiki/Cyclic_redundancy_check) algorithm and embeds the resulting [`Int{:tact}`][int] value into the contract.

Usage example:

```tact
contract Example {
    // Persistent state variables
    checksum: Int = crc32("000DEADBEEF000"); // 1821923098
}
```

:::note

  The `crc32("...String contents..."){:tact}` in Tact is equivalent to `"...String contents..."c{:func}` in FunC.

:::

## ton

```tact
fun ton(value: String): Int;
```

A compile-time function that converts the given Toncoin `value` from a human-readable format [`String{:tact}`][p] to the [nanoToncoin](/book/integers#nanotoncoin) [`Int{:tact}`][int] format.

Usage example:

```tact
contract Example {
    // Persistent state variables
    one: Int = ton("1");            // One Toncoin, which is equivalent to 10^9 nanoToncoins
    pointOne: Int = ton("0.1");     // 0.1 Toncoin, which is equivalent to 10^8 nanoToncoins
    nano: Int = ton("0.000000001"); // 10^-9 Toncoin, which is equivalent to 1 nanoToncoin
                                    // Works at compile-time!
}
```

[p]: /book/types#primitive-types
[bool]: /book/types#booleans
[int]: /book/integers
[cell]: /book/cells#cells
[slice]: /book/cells#slices

[boc]: /book/cells#cells-boc

[crc]: https://en.wikipedia.org/wiki/Cyclic_redundancy_check



================================================
FILE: docs/src/content/docs/ref/core-contextstate.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/core-contextstate.mdx
================================================
---
title: Context and state
description: "Contextual and state-related functions and structs from the Core library of Tact"
---

import { Badge } from '@astrojs/starlight/components';

Contextual and state-related functions and structs.

## Time

### now

```tact
fun now(): Int;
```

Returns the current [Unix time](https://en.wikipedia.org/wiki/Unix_time).

Usage example:

```tact
let timeOffset: Int = now() + 1000; // thousand seconds from now()
```

### curLt

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
fun curLt(): Int;
```

Returns the [`Int{:tact}`][int] value of the [logical time][lt] of the current transaction.

Usage example:

```tact
let lt: Int = curLt();
nativeRandomize(lt); // Equivalent to calling nativeRandomizeLt()
```

:::note[Useful links:]

  [Random seed in Wikipedia][seed]\
  [`nativeRandomize{:tact}`](/ref/core-random#nativerandomize)\
  [`nativeRandomizeLt{:tact}`](/ref/core-random#nativerandomizelt)\
  [Other random-related functions in the Core library](/ref/core-random)

:::

### blockLt

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
fun blockLt(): Int;
```

Returns the [`Int{:tact}`][int] value of the [starting logical time][lt] of the current block.

Usage example:

```tact
let time: Int = blockLt();
```

## Incoming message

### sender

```tact
fun sender(): Address;
```

Returns the [`Address{:tact}`][p] of the sender of the current message.

Usage example:

```tact
contract MeSee {
    receive() {
        let whoSentMeMessage: Address = sender();
    }
}
```

:::caution

  Behavior is undefined for [getter functions](/book/contracts#getter-functions), because they cannot have a sender nor can they send messages.

:::

:::note

  In order to reduce gas usage, prefer using this function over calling [`context().sender{:tact}`](#context) when you only need to know the sender of the message.

:::

### inMsg

<Badge text="Available since Tact 1.6.7" variant="tip" size="medium"/><p/>

```tact
fun inMsg(): Slice;
```

Returns the [`Slice{:tact}`][slice] with the original, raw body of the [received message](/book/receive).

That `Slice{:tact}` can:

* be empty, which means the contract has received an empty message body that is handled in the empty receiver `receive(){:tact}` or the catch-all slice receiver `receive(msg: Slice){:tact}`;
* start with 4 zero bytes, which means the contract has received a text message that is handled in the relevant receiver:
  * the exact text receiver `receive("message"){:tact}`,
  * the catch-all string receiver `receive(msg: String){:tact}`,
  * or the catch-all slice receiver `receive(msg: Slice){:tact}`;
* start with 4 bytes of a non-zero message opcode that the corresponding binary receiver `receive(msg: MessageStruct){:tact}` or the catch-all slice receiver `receive(msg: Slice){:tact}` would handle.

Usage examples:

```tact
// This contract defines various kinds of receivers in their
// order of handling the corresponding incoming messages.
contract OrderOfReceivers() {
    receive() {
        let body = inMsg();
        body.bits(); // 0
    }

    receive("yeehaw!") {
        let body = inMsg();
        body.loadUint(32); // 0
        body.hash() == "yeehaw!".asSlice().hash(); // true
    }

    receive(str: String) {
        let body = inMsg();
        body.loadUint(32); // 0
        body == str.asSlice(); // true
    }

    receive(msg: Emergency) {
        let body = inMsg();
        body.preloadUint(32); // 911
    }

    receive(rawMsg: Slice) {
        let body = inMsg();
        body == rawMsg; // true
    }
}

message(911) Emergency {}
```

### context

```tact
fun context(): Context;
```

Returns `Context{:tact}` [struct][struct], which consists of:

Field        | Type                    | Description
:----------- | :---------------------- | :----------
`bounceable` | [`Bool{:tact}`][bool]   | Indicates whether the received message can [bounce back](https://docs.ton.org/v3/documentation/smart-contracts/message-management/non-bounceable-messages).
`sender`     | [`Address{:tact}`][p]   | Internal address of the sender on the TON Blockchain.
`value`      | [`Int{:tact}`][int]     | Amount of [nanoToncoin][nano] in the received message.
`raw`        | [`Slice{:tact}`][slice] | The remainder of the received message as a [`Slice{:tact}`][slice]. It follows the [internal message layout](https://docs.ton.org/develop/smart-contracts/messages#message-layout) of TON, starting from the destination [`Address{:tact}`][p] (`MsgAddressInt` in [TL-B notation](https://docs.ton.org/develop/data-formats/tl-b-language)).

Usage example:

```tact
let ctx: Context = context();
require(ctx.value != 68 + 1, "Invalid amount of nanoToncoins, bye!");
```

:::note

  If you only need to know who sent the message, use the [`sender(){:tact}`](#sender) function, as it is less gas-consuming.

:::

### Context.readForwardFee

```tact
extends fun readForwardFee(self: Context): Int;
```

Extension function for the [`Context{:tact}`](#context) [struct][struct].

Reads the [forward fee][forward-fee] provided in the incoming message and applies the [`getOriginalFwdFee(){:tact}`](/ref/core-gas#getoriginalfwdfee) to it to calculate its approximate original value. Returns this value as an [`Int{:tact}`][int] amount of [nanoToncoin][nano].

Usage example:

```tact
let origFwdFee: Int = context().readForwardFee();
```

:::note[Useful links:]

  [`getOriginalFwdFee(){:tact}`](/ref/core-gas#getoriginalfwdfee)\
  [Other fees and gas-related functions in the Core library](/ref/core-gas)

:::

## Contract and transaction state

### myAddress

```tact
fun myAddress(): Address;
```

Returns the address of the current smart contract as an [`Address{:tact}`][p].

Usage example:

```tact
let meMyselfAndI: Address = myAddress();
```

:::note[Useful links:]

  [Other address-related functions in the Core library](/ref/core-addresses)

:::

### myCode

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
fun myCode(): Cell;
```

Returns the smart contract code [`Cell{:tact}`][cell] obtained from the `c7` [register][registers].

Usage example:

```tact
let code: Cell = myCode();
```

### myStorageDue

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun myStorageDue(): Int;
```

Returns the [nanoToncoin][nano] [`Int{:tact}`][int] amount of the accumulated [storage fee][storage-fee] debt. Storage fees are deducted from the incoming message value before the new contract balance is calculated.

Usage example:

```tact
let debt: Int = myStorageDue();
```

:::note[Useful links:]

  [`getStorageFee(){:tact}`](/ref/core-gas#getstoragefee)\
  [Other fees and gas-related functions in the Core library](/ref/core-gas)

:::

### myBalance

```tact
fun myBalance(): Int;
```

Returns the [nanoToncoin][nano] [`Int{:tact}`][int] balance of the smart contract as it was at the start of the [compute phase](https://docs.ton.org/learn/tvm-instructions/tvm-overview#compute-phase) of the current transaction.

Usage example:

```tact
let iNeedADolla: Int = myBalance();
```

:::caution

  Beware that [all message-sending functions](/book/send#message-sending-functions) of Tact can change the _actual_ balance of the contract, but they **won't** update the value returned by this function.

:::

### gasConsumed

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun gasConsumed(): Int;
```

Returns the [nanoToncoin][nano] [`Int{:tact}`][int] amount of [gas][gas] consumed by [TVM][tvm] in the current transaction so far. The resulting value includes the cost of calling this function.

Usage example:

```tact
let gas: Int = gasConsumed();
```

:::note[Useful links:]

  [Gas in TON Docs][gas]\
  [Other fees and gas-related functions in the Core library](/ref/core-gas)

:::

### nativeReserve

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

```tact
fun nativeReserve(amount: Int, mode: Int);
```

Executes the [`RAWRESERVE`](https://docs.ton.org/v3/documentation/tvm/instructions#FB02) instruction with the specified `amount` and `mode`. It queues the reservation of the specific `amount` of [nanoToncoin][nano] from the remaining account balance per the given `mode`.

The reservation action is queued to the _output action list_, which contains other actions such as [message sends](/book/send#outbound-message-processing). In fact, the `RAWRESERVE` instruction is roughly equivalent to creating an outbound message carrying the specified `amount` of nanoToncoin or `b - amount` of nanoToncoin, where `b` is the remaining balance, to oneself. This ensures that subsequent output actions cannot spend more money than the remainder.

It is possible to use raw [`Int{:tact}`][int] values and manually provide them for the `mode`, but for your convenience, there is a set of constants you may use to construct the compound `mode` with ease. Take a look at the following tables for more information on [base modes](#nativereserve-base-modes), [optional flags](#nativereserve-optional-flags), and how you can [combine them together](#nativereserve-combining-modes-with-flags).

:::caution

  Currently, `amount` must be a non-negative integer, and `mode` must be in the range $0..31$, inclusive.

  Additionally, attempts to queue more than $255$ reservations in one transaction throw an exception with [exit code 33](/book/exit-codes#33): `Action list is too long`.

:::

#### Base modes {#nativereserve-base-modes}

The resulting `mode` value can have the following base modes:

Mode value | Constant name                 | Description
---------: | :---------------------------- | -----------
$0$        | `ReserveExact{:tact}`         | Reserves exactly the specified `amount` of [nanoToncoin][nano].
$1$        | `ReserveAllExcept{:tact}`     | Reserves all but the specified `amount` of [nanoToncoin][nano].
$2$        | `ReserveAtMost{:tact}`        | Reserves at most the specified `amount` of [nanoToncoin][nano].

#### Optional flags {#nativereserve-optional-flags}

Additionally, the resulting `mode` can have the following optional flags added:

Flag value | Constant name                      | Description
---------: | :--------------------------------- | -----------
$+4$       | `ReserveAddOriginalBalance{:tact}` | Increases the `amount` by the original balance of the current account (before the compute phase), including all extra currencies.
$+8$       | `ReserveInvertSign{:tact}`         | Negates the `amount` value before performing the reservation.
$+16$      | `ReserveBounceIfActionFail{:tact}` | Bounces the transaction if the reservation fails.

#### Combining modes with flags {#nativereserve-combining-modes-with-flags}

To construct the [`Int{:tact}`][int] value for the `mode` parameter, combine base modes with optional flags by applying the [bitwise OR](/book/operators#binary-bitwise-or) operation:

```tact
nativeReserve(ton("0.1"), ReserveExact | ReserveBounceIfActionFail);
//            ----------  ----------------------------------------
//            ↑           ↑
//            |           mode, which would bounce the transaction if exact reservation fails
//            amount of nanoToncoins to reserve
```

### setData

<Badge text="Available since Tact 1.7" variant="tip" size="medium"/>
<Badge text="DANGEROUS" title="Applies irreversible modifications to the contract — use only when you know what you are doing!" variant="danger" size="medium"/><p/>

```tact
fun setData(data: Cell);
```

Replaces the current contract's state data [`Cell{:tact}`][cell] with the new `data`. It is useful only in exceptional cases, such as contract upgrades, data migrations, or when processing external messages with a catch-all [`Slice{:tact}`][slice] receiver for maximum efficiency. Otherwise, do **not** use this function, as it immediately and permanently overrides the state with no ability to recover, which can result in the loss of funds and partial or full corruption of the contract's data.

:::caution

  When using this function, make sure that all logical code branches within your receiver end with a call to the [`throw(0){:tact}`](/ref/core-debug#throw) function to terminate the execution of the contract early and prevent the automatic contract's data save implicitly added by Tact after the end of each receiver. Conversely, your manual changes to data made with this function will be lost.

:::

Usage example:

```tact {13}
contract WalletV4(
    seqno: Int as uint32,
    // ...other parameters...
) {
    // ...
    external(_: Slice) {
        // ...various prior checks...

        acceptMessage();
        self.seqno += 1;

        // Manually saving the contract's state
        setData(self.toCell());

        // And halting the transaction to prevent a secondary save implicitly
        // added by Tact after the main execution logic of the receiver
        throw(0);
    }
}
```

:::note

  Tact automatically saves the contract's state after the end of each receiver's logic even when `return{:tact}` statements are used for early termination. Thus, this function is almost never needed in regular contracts.

  However, if you intend to use the `throw(0){:tact}` pattern to terminate the compute phase and save the state yourself or you want to replace the data when upgrading the contract, this function becomes useful. That said, make sure to double-check and test cover your every move such that the contract's data won't become corrupt or inadvertently gone.

:::

### commit

```tact
fun commit();
```

Commits the current state of [registers][registers] `c4` (persistent data) and `c5` (actions), so that the current execution is considered "successful" with the saved values even if an exception in the compute phase is thrown later.

Usage example:

```tact {12}
contract WalletV4(
    seqno: Int as uint32,
    // ...other parameters...
) {
    // ...
    external(_: Slice) {
        // ...various prior checks...

        acceptMessage();
        self.seqno += 1;
        setData(self.toCell());
        commit(); //  now, transaction is considered "successful"
        throw(42); // and this won't fail it
    }
}
```

## Blockchain state

### getConfigParam

```tact
fun getConfigParam(id: Int): Cell?;
```

Loads a [configuration parameter](https://docs.ton.org/develop/howto/blockchain-configs) of TON Blockchain by its `id` number.

Usage examples:

```tact
// Parameter 0, address of a special smart contract that stores the blockchain's configuration
let configAddrAsCell: Cell = getConfigParam(0)!!;

// Parameter 18, configuration for determining the prices for data storage
let dataStorageFeeConfig: Cell = getConfigParam(18)!!;
```

:::note

  The standard library [`@stdlib/config`](/ref/stdlib-config) provides two related helper functions:\
  [`getConfigAddress(){:tact}`](/ref/stdlib-config#getconfigaddress) for retrieving config [`Address{:tact}`][p]\
  [`getElectorAddress(){:tact}`](/ref/stdlib-config#getconfigaddress) for retrieving elector [`Address{:tact}`][p]

  Read more about other parameters: [Config Parameters in TON Docs](https://docs.ton.org/develop/howto/blockchain-configs).

:::

[p]: /book/types#primitive-types
[bool]: /book/types#booleans
[int]: /book/integers
[nano]: /book/integers#nanotoncoin
[cell]: /book/cells#cells
[slice]: /book/cells#slices
[struct]: /book/structs-and-messages#structs

[forward-fee]: https://docs.ton.org/v3/documentation/smart-contracts/transaction-fees/forward-fees
[storage-fee]: https://docs.ton.org/v3/documentation/smart-contracts/transaction-fees/fees-low-level#storage-fee
[registers]: https://docs.ton.org/learn/tvm-instructions/tvm-overview#control-registers

[gas]: https://docs.ton.org/v3/documentation/smart-contracts/transaction-fees/fees#gas
[tvm]: https://docs.ton.org/learn/tvm-instructions/tvm-overview
[lt]: https://docs.ton.org/v3/documentation/smart-contracts/message-management/messages-and-transactions#what-is-a-logical-time
[seed]: https://en.wikipedia.org/wiki/Random_seed



================================================
FILE: docs/src/content/docs/ref/core-crypto.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/core-crypto.mdx
================================================
---
title: Cryptography
description: "Various cryptographic functions from the Core library of Tact"
---

import { Badge } from '@astrojs/starlight/components';

Various cryptographic global functions. Crypto-oriented extension functions for [`Cell{:tact}`][cell], [`Builder{:tact}`][builder], and [`Slice{:tact}`][slice] types are listed on their reference page: [Cells, Builders and Slices](/ref/core-cells).

## checkSignature

```tact
fun checkSignature(hash: Int, signature: Slice, publicKey: Int): Bool;
```

Checks the [Ed25519][ed] `signature` of the 256-bit unsigned [`Int{:tact}`][int] `hash` using a `publicKey`, represented by a 256-bit unsigned [`Int{:tact}`][int]. The signature must contain at least 512 bits of data, but only the first 512 bits are used.

Returns `true{:tact}` if the signature is valid, `false{:tact}` otherwise.

Usage example:

```tact {19-24}
message ExtMsg {
    signature: Slice;
    data: Cell;
}

contract Showcase {
    // Persistent state variables
    pub: Int as uint256; // public key as a 256-bit unsigned Int

    // Constructor function init(), where all variables are initialized
    init(pub: Int) {
        self.pub = pub; // storing the public key upon contract initialization
    }

    // External message receiver, which accepts message ExtMsg
    external(msg: ExtMsg) {
        let hash: Int = beginCell().storeRef(msg.data).endCell().hash();
        let check: Bool = checkSignature(hash, msg.signature, self.pub);
        //                               ----  -------------  --------
        //                               ↑     ↑              ↑
        //                               |     |              publicKey stored in our contract
        //                               |     signature obtained from the received message
        //                               hash calculated using the data from the received message
        // ... follow-up logic ...
    }
}
```

:::caution

  The first 10 calls of this function are very cheap regarding gas usage. However, the 11th call and onward consume more than 4 thousand gas units.

:::

## checkDataSignature

```tact
fun checkDataSignature(data: Slice, signature: Slice, publicKey: Int): Bool;
```

Checks the [Ed25519][ed] `signature` of the `data` using a `publicKey`, similar to [`checkSignature(){:tact}`](#checksignature). If the bit length of `data` is not divisible by 8, this function throws an error with [exit code 9](/book/exit-codes#9): `Cell underflow`. Verification itself is done indirectly on a [SHA-256][sha-2] hash of the `data`.

Returns `true{:tact}` if the signature is valid, `false{:tact}` otherwise.

Usage example:

```tact
let data: Slice = someData;
let signature: Slice = someSignature;
let publicKey: Int = 42;

let check: Bool = checkDataSignature(data, signature, publicKey);
```

:::caution

  The first 10 calls of this function are very cheap regarding gas usage. However, the 11th call and onward consume more than 4 thousand gas units.

:::

## SignedBundle

<Badge text="Available since Tact 1.6.6" variant="tip" size="medium"/><p/>

```tact
struct SignedBundle {
    /// A 512-bit Ed25519 signature of the `signedData`.
    signature: Slice as bytes64;

    /// The remaining non-serialized data of the enclosing struct or message struct,
    /// which was used to obtain the 512-bit Ed25519 `signature`.
    signedData: Slice as remaining;
}
```

A [struct][struct] that contains a 512-bit [Ed25519][ed] signature and the data it signs.

See the usage example for the [`SignedBundle.verifySignature(){:tact}`](#signedbundleverifysignature) function.

## SignedBundle.verifySignature

<Badge text="Available since Tact 1.6.6" variant="tip" size="medium"/><p/>

```tact
extends fun verifySignature(self: SignedBundle, publicKey: Int): Bool;
```

Extension function for the [`SignedBundle{:tact}`](#signedbundle) [struct][struct].

Checks whether `self.signedData` was signed by the 512-bit [Ed25519][ed] signature `self.signature`, using the given `publicKey`. Returns `true` if the signature is valid, `false` otherwise.

Usage example:

```tact
contract Example(publicKey: Int as uint256) {
    external(msg: MessageWithSignedData) {
        // Checks that the signature of the SignedBundle from the incoming external
        // message wasn't forged and made by the owner of this self.publicKey with
        // its respective private key managed elsewhere.
        throwUnless(35, msg.bundle.verifySignature(self.publicKey));

        // ...rest of the checks and code...
    }
}

message MessageWithSignedData {
    // The `bundle.signature` contains the 512-bit Ed25519 signature
    // of the remaining data fields of this message struct,
    // while `bundle.signedData` references those data fields.
    // In this case, the fields are `walletId` and `seqno`.
    bundle: SignedBundle;

    // These fields are common to external messages to user wallets.
    walletId: Int as int32;
    seqno: Int as uint32;
}
```

## sha256

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

```tact
fun sha256(data: Slice): Int;
fun sha256(data: String): Int;
```

Computes and returns the [SHA-256][sha-2] hash as a $256$-bit unsigned [`Int{:tact}`][int] from the passed [`Slice{:tact}`][slice] or [`String{:tact}`][p] `data`, which should have a number of bits divisible by $8$.

In case `data` is a [`Slice{:tact}`][slice], it must have no more than a single reference per cell, because only the first reference of each nested cell will be taken into account.

This function tries to resolve constant string values at [compile-time](/ref/core-comptime) whenever possible.

Attempts to specify a [`Slice{:tact}`][slice] or [`String{:tact}`][p] with a number of bits **not** divisible by $8$ throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage examples:

```tact
sha256(beginCell().asSlice());
sha256("Hello, world!"); // will be resolved at compile-time
sha256(someVariableElsewhere); // will try to resolve at compile-time,
                               // and fall back to run-time evaluation
```

:::tip[Before Tact 1.6]

  Previously, if a [`String{:tact}`][p] value couldn't be resolved during [compile-time](/ref/core-comptime), the hash was calculated at runtime by the [TVM][tvm] itself. This caused collisions of strings with more than 127 bytes if their first 127 bytes were the same.

  That's because all [SHA-256][sha-2]-related instructions of the [TVM][tvm] consider only the data bits, ignoring possible references to other cells needed to form larger strings.

  Therefore, in general, and in versions of Tact prior to 1.6, it is preferable to use statically known strings whenever possible. When in doubt, use strings of up to 127 bytes long.

:::

## keccak256

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/>
<Badge text="Available since Tact 1.6.6" variant="tip" size="medium"/><p/>

```tact
fun keccak256(data: Slice): Int;
```

Computes and returns the Ethereum-compatible [Keccak-256](https://en.wikipedia.org/wiki/SHA-3) hash as a 256-bit unsigned [`Int{:tact}`][int] from the passed [`Slice{:tact}`][slice] `data`.

The `data` slice should have a number of bits divisible by 8 and no more than a single reference per cell, because only the first reference of each nested cell will be taken into account.

Attempts to specify a [`Slice{:tact}`][slice] with a number of bits **not** divisible by 8 throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage examples:

```tact
contract Examples() {
    receive(rawMsg: Slice) {
        // Hash incoming message body Slice
        let hash: Int = keccak256(rawMsg);

        // Process data that spans multiple cells
        let b: Builder = beginCell()
            .storeUint(123456789, 32)
            .storeRef(beginCell().storeString("Extra data in a ref").endCell());
        let largeDataHash: Int = keccak256(b.asSlice());

        // Match Ethereum's hash format
        let ethAddress: String = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
        let ethAddressHash: Int = keccak256(ethAddress.asSlice());
    }
}
```

:::note

  Crypto extension functions for [`Cell{:tact}`][cell], [`Builder{:tact}`][builder], and [`Slice{:tact}`][slice] types are listed on their reference page: [Cells, Builders and Slices](/ref/core-cells).

:::

[p]: /book/types#primitive-types
[int]: /book/integers
[cell]: /book/cells#cells
[builder]: /book/cells#builders
[slice]: /book/cells#slices
[struct]: /book/structs-and-messages#structs
[message]: /book/structs-and-messages#messages

[tvm]: https://docs.ton.org/learn/tvm-instructions/tvm-overview
[ed]: https://en.wikipedia.org/wiki/EdDSA#Ed25519
[sha-2]: https://en.wikipedia.org/wiki/SHA-2#Hash_standard

[round-up]: https://en.wikipedia.org/wiki/Rounding#Rounding_up
[round-down]: https://en.wikipedia.org/wiki/Rounding#Rounding_down



================================================
FILE: docs/src/content/docs/ref/core-debug.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/core-debug.mdx
================================================
---
title: Debug
description: "Various debugging functions from the Core library of Tact"
---

import { Badge } from '@astrojs/starlight/components';

List of functions commonly used for debugging smart contracts in Tact.

Read more about debugging on the dedicated page: [Debugging](/book/debug).

## require

```tact
fun require(condition: Bool, error: String);
```

Checks the `condition` and throws an error with an [exit code](/book/exit-codes) generated from the `error` message if the `condition` is `false{:tact}`. Otherwise, does nothing.

This function is similar to [`throwUnless(){:tact}`](#throwunless), but instead of using the error code directly, it generates it based on the given error message [`String{:tact}`][p].

The algorithm for generating the exit code works as follows:

* First, the [SHA-256](https://en.wikipedia.org/wiki/SHA-2#Hash_standard) hash of the `error` message [`String{:tact}`][p] is obtained.
* Then, its value is read as a 32-bit [big-endian](https://en.wikipedia.org/wiki/Endianness) number modulo 63000 plus 1000, in that order.
* Finally, it's put into the [`.md` compilation report file](/book/compile#report), which resides with the other compilation artifacts in your project's `outputs/` or `build/` directories.

The generated exit code is guaranteed to be outside the common 0–255 range reserved for TVM and Tact contract errors, which makes it possible to distinguish exit codes from `require(){:tact}` and any other [standard exit codes](/book/exit-codes).

Usage examples:

```tact
// now() has to return a value greater than 1000, otherwise an error message will be thrown
require(now() > 1000, "We're in the first 1000 seconds of 1 January 1970!");

try {
    // The following will never be true, so this require would always throw
    require(now() < -1, "Time is an illusion. Lunchtime doubly so.");
} catch (e) {
    // e will be outside of range 0-255
    dump(e);
}
```

## dump

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

```tact
fun dump(arg);
```

Prints the argument `arg` to the contract's debug console. Evaluated only if the `debug` option in the [configuration file](/book/config) is set to `true{:json}`. Otherwise does nothing.

This function is computationally expensive and consumes a lot of gas because it prints the location from which it was called—i.e., the filename, line, and column numbers—and the original expression that was the `arg` argument.

Can be applied to the following list of types and values:

* [`Int{:tact}`][int]
* [`Bool{:tact}`][bool]
* [`Address{:tact}`][p]
* [`Cell{:tact}`][cell], [`Builder{:tact}`][builder], or [`Slice{:tact}`][slice]
* [`String{:tact}`][p]
* [`map<K, V>{:tact}`](/book/maps)
* [Optionals and `null{:tact}` value](/book/optionals)
* `void`, which is implicitly returned when a function doesn't have a return value defined

Usage examples:

```tact
// Int
dump(42); // prints:
          // File filename.tact:2:1
          // dump(42)
          // 42

// Bool
dump(true);
dump(false);

// Address
dump(myAddress());

// Cell, Builder, or Slice
dump(emptyCell());  // Cell
dump(beginCell());  // Builder
dump(emptySlice()); // Slice

// String
dump("Hello, my name is...");

// Maps
let m: map<Int, Int> = emptyMap();
m.set(2 + 2, 4);
dump(m);

// Special values
dump(null);
dump(emit("msg".asComment())); // As emit() function doesn't return a value, dump() would print #DEBUG#: void.
```

:::note[Useful links:]

  [Debug with `dump(){:tact}`](/book/debug#tests-dump)

:::

## dumpStack

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

```tact
fun dumpStack();
```

Prints the total stack depth and up to 255 of its values from the top to the contract's debug console. The values are positioned bottom-up—from the deepest value on the left to the topmost value on the right. Evaluated only if the `debug` option in the [configuration file](/book/config) is set to `true{:json}`. Otherwise does nothing.

Usage example:

```tact
dumpStack(); // prints:
             // File filename.tact:1:1
             // dumpStack()
             // stack(3 values) : 100000000 C{96...C7} 0
```

:::note[Useful links:]

  [Debug with `dump(){:tact}`](/book/debug#tests-dump)\
  [Assembly functions](/book/assembly-functions)

:::

## throw

```tact
fun throw(code: Int);
```

Unconditionally throws an exception with an error `code`.

Execution of the current context stops, statements after `throw` are not executed, and control is passed to the first [`try...catch{:tact}` block](/book/statements#try-catch) on the call stack. If there is no `try{:tact}` or `try...catch{:tact}` block among calling functions, [TVM](https://docs.ton.org/learn/tvm-instructions/tvm-overview) terminates the transaction.

Attempts to specify a `code` outside the range $0-65535$ cause an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Usage examples:

```tact {2,7}
fun thisWillTerminateAbruptly() {
    throw(1042); // throwing with exit code 1042
}

fun butThisWont() {
    try {
        throw(1042); // throwing with exit code 1042
    }

    // ... follow-up logic ...
}
```

## throwIf

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
fun throwIf(code: Int, condition: Bool);
```

Similar to [`throw(){:tact}`](#throw), but throws an error `code` only if `condition` holds, i.e. is equal to `true{:tact}`. Doesn't throw otherwise.

Attempts to specify a `code` outside the range $0-65535$ cause an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Usage example:

```tact {11}
contract Ownership {
    owner: Address;

    init() {
        self.owner = myAddress();
    }

    receive() {
        // Check whether the sender is the owner of the contract,
        // and throw exit code 1024 if not
        throwIf(1024, sender() != self.owner);
    }
}
```

## throwUnless

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
fun throwUnless(code: Int, condition: Bool);
```

Similar to [`throw(){:tact}`](#throw), but throws an error `code` only if `condition` does **not** hold, i.e. if `condition` is not equal to `true{:tact}`. Doesn't throw otherwise.

This function is also similar to [`require(){:tact}`](#require), but uses the specified `code` directly instead of generating one based on a given error message [`String{:tact}`][p].

Attempts to specify a `code` outside the range $0-65535$ cause an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Usage example:

```tact {11}
contract Ownership {
    owner: Address;

    init() {
        self.owner = myAddress();
    }

    receive() {
        // Check whether the sender is the owner of the contract,
        // and throw exit code 1024 if not
        throwUnless(1024, sender() == self.owner);
    }
}
```

## nativeThrow

<Badge text="Deprecated since Tact 1.6" variant="tip" size="medium"/><p/>

Use [`throw(){:tact}`](#throw) instead.

```tact
fun nativeThrow(code: Int);
```

An alias to [`throw(){:tact}`](#throw).

## nativeThrowIf

<Badge text="Deprecated since Tact 1.6" variant="tip" size="medium"/><p/>

Use [`throwIf(){:tact}`](#throwif) instead.

```tact
fun nativeThrowIf(code: Int, condition: Bool);
```

An alias to [`throwIf(){:tact}`](#throwif).

## nativeThrowUnless

<Badge text="Deprecated since Tact 1.6" variant="tip" size="medium"/><p/>

Use [`throwUnless(){:tact}`](#throwunless) instead.

```tact
fun nativeThrowUnless(code: Int, condition: Bool);
```

An alias to [`throwUnless(){:tact}`](#throwunless).

[p]: /book/types#primitive-types
[bool]: /book/types#booleans
[int]: /book/integers
[cell]: /book/cells#cells
[builder]: /book/cells#builders
[slice]: /book/cells#slices



================================================
FILE: docs/src/content/docs/ref/core-gas.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/core-gas.mdx
================================================
---
title: Gas and fees
description: "Storage fee, forward fee, compute fee and gas-management functions from the Core library of Tact"
---

import { Badge } from '@astrojs/starlight/components';

List of the general fee and gas-management functions. For the context and state-related functions, see:

* [`myStorageDue(){:tact}`](/ref/core-contextstate#mystoragedue)
* [`gasConsumed(){:tact}`](/ref/core-contextstate#gasconsumed)

## getStorageFee

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun getStorageFee(cells: Int, bits: Int, seconds: Int, isMasterchain: Bool): Int;
```

Calculates and returns the [storage fee][storage-fee] in [nanoToncoin][nano] [`Int{:tact}`][int] for storing a contract with a given number of `cells` and `bits` for a number of `seconds`. Uses the prices of the [masterchain][masterchain] if `isMasterchain` is `true{:tact}`, otherwise the prices of the [basechain][basechain]. The current prices are obtained from [config param 18 of TON Blockchain](https://docs.ton.org/develop/howto/blockchain-configs#param-18).

Note that specifying values of `cells` and `bits` higher than their maximum values listed in [account state limits (`max_acc_state_cells` and `max_acc_state_bits`)](/book/exit-codes#50) will have the same result as specifying the exact limits. In addition, make sure you take into account the [deduplication of cells with the same hash][deduplication].

Attempts to specify a negative number of `cells`, `bits`, or `seconds` throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Usage example:

```tact
let fee: Int = getStorageFee(1_000, 1_000, 1_000, false);
//                           -----  -----  -----  -----
//                           ↑      ↑      ↑      ↑
//                           |      |      |      Isn't on the masterchain,
//                           |      |      |      but on the basechain
//                           |      |      Number of seconds to calculate
//                           |      |      the storage fee for
//                           |      Number of bits in a contract
//                           Number of cells in a contract
```

:::note[Useful links:]

  [Storage fee in TON Docs][storage-fee]\
  [Storage fee calculation in TON Docs][storage-fee-calc]

:::

## getComputeFee

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun getComputeFee(gasUsed: Int, isMasterchain: Bool): Int;
```

Calculates and returns the [compute fee][compute-fee] in [nanoToncoin][nano] [`Int{:tact}`][int] for a transaction that consumed a `gasUsed` amount of [gas][gas]. Uses the prices of the [masterchain][masterchain] if `isMasterchain` is `true{:tact}`, otherwise the prices of the [basechain][basechain]. The current prices are obtained from [config param 20 for the masterchain and config param 21 for the basechain][param-20-21] of TON Blockchain.

When `gasUsed` is less than a certain threshold called [`flat_gas_limit`][param-20-21], there's a minimum price to pay based on the value of [`flat_gas_price`][param-20-21]. The less gas used below this threshold, the higher the minimum price will be. See the example for [`getSimpleComputeFee(){:tact}`](#getsimplecomputefee) to derive that threshold.

Attempts to specify a negative value of `gasUsed` throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Usage example:

```tact
let fee: Int = getComputeFee(1_000, false);
//                           -----  -----
//                           ↑      ↑
//                           |      Isn't on the masterchain,
//                           |      but on the basechain
//                           Number of gas units
//                           consumed per transaction
```

:::note[Useful links:]

  [Compute fee in TON Docs][compute-fee]\
  [Compute fee calculation in TON Docs][compute-fee-calc]\
  [`getSimpleComputeFee(){:tact}`](#getsimplecomputefee)

:::

## getSimpleComputeFee

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun getSimpleComputeFee(gasUsed: Int, isMasterchain: Bool): Int;
```

Similar to [`getComputeFee(){:tact}`](#getcomputefee), but without the [`flat_gas_price`][param-20-21], i.e. without the minimum price to pay if `gasUsed` is less than a certain threshold called [`flat_gas_limit`][param-20-21]. Calculates and returns only the `gasUsed` multiplied by the current gas price.

Attempts to specify a negative value for `gasUsed` throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Usage example:

```tact
let fee = getComputeFee(0, false);
let feeNoFlat = getSimpleComputeFee(0, false);
let maxFlatPrice = fee - feeNoFlat;
```

:::note[Useful links:]

  [Compute fee in TON Docs][compute-fee]\
  [Compute fee calculation in TON Docs][compute-fee-calc]\
  [`getComputeFee(){:tact}`](#getcomputefee)

:::

## getForwardFee

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun getForwardFee(cells: Int, bits: Int, isMasterchain: Bool): Int;
```

Calculates and returns the [forward fee][forward-fee] in [nanoToncoin][nano] as an [`Int{:tact}`][int] for an outgoing message consisting of a given number of `cells` and `bits`. Uses the prices of the [masterchain][masterchain] if `isMasterchain` is `true{:tact}`, or the prices of the [basechain][basechain] otherwise. The current prices are obtained from [config param 24 for the masterchain and config param 25 for the basechain][param-24-25] of TON Blockchain.

If both the source and the destination addresses are on the [basechain][basechain], specify `isMasterchain` as `false{:tact}`. Otherwise, specify `true{:tact}`.

Note that specifying values of `cells` and `bits` higher than their maximum values listed in [account state limits (`max_msg_cells` and `max_msg_bits`)](/book/exit-codes#50) will have the same result as specifying the exact limits.

However, regardless of the values of `cells` and `bits`, this function always adds the minimum price based on the value of [`lump_price`][param-24-25]. See the example for [`getSimpleForwardFee(){:tact}`](#getsimpleforwardfee) to derive it. In addition, make sure you account for the [deduplication of cells with the same hash][deduplication]; for example, the root cell and its data bits do not count toward the forward fee and are covered by the [`lump_price`][param-24-25].

Attempts to specify a negative number of `cells` or `bits` throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Usage example:

```tact
let fee: Int = getForwardFee(1_000, 1_000, false);
//                           -----  -----  -----
//                           ↑      ↑      ↑
//                           |      |      Both source and destination
//                           |      |      are not on the masterchain,
//                           |      |      but on the basechain
//                           |      Number of bits in a message
//                           Number of cells in a message
```

:::note[Useful links:]

  [Forward fee in TON Docs][forward-fee]\
  [Forward fee calculation in TON Docs][forward-fee-calc]\
  [`CDATASIZEQ` instruction for computing the number of distinct cells, data bits and refs in a `Cell{:tact}`](https://docs.ton.org/v3/documentation/tvm/instructions#F940)\
  [`getSimpleForwardFee(){:tact}`](#getsimpleforwardfee)\
  [`getOriginalFwdFee(){:tact}`](#getoriginalfwdfee)

:::

## getSimpleForwardFee

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun getSimpleForwardFee(cells: Int, bits: Int, isMasterchain: Bool): Int;
```

Similar to [`getForwardFee(){:tact}`](#getforwardfee), but without the [`lump_price`][param-24-25], i.e. without the minimum price to pay regardless of the amounts of `cells` or `bits`. Calculates and returns only the `cells` multiplied by the current cell price plus the `bits` multiplied by the current bit price.

Attempts to specify a negative number of `cells` or `bits` throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Usage example:

```tact
let fee = getForwardFee(1_000, 1_000, false);
let feeNoLump = getSimpleForwardFee(1_000, 1_000, false);
let lumpPrice = fee - feeNoLump;
```

:::note[Useful links:]

  [Forward fee in TON Docs][forward-fee]\
  [Forward fee calculation in TON Docs][forward-fee-calc]\
  [`getForwardFee(){:tact}`](#getforwardfee)

:::

## getOriginalFwdFee

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

```tact
fun getOriginalFwdFee(fwdFee: Int, isMasterchain: Bool): Int;
```

Calculates and returns the so-called _original_ [forward fee][forward-fee] in [nanoToncoin][nano] [`Int{:tact}`][int] for a message based on the given `fwdFee` of this message, which can be obtained by calling [`getForwardFee(){:tact}`](#getforwardfee). If both the source and the destination addresses are in the [basechain][basechain], specify `isMasterchain` as `false{:tact}`. Otherwise, specify `true{:tact}`.

The result is computed using the [`first_frac`][param-24-25] value, which is obtained from [config param 24 for the masterchain and config param 25 for the basechain][param-24-25] of TON Blockchain. Due to the current value of `first_frac` for all workchains, this function performs a cheaper equivalent calculation of `fwdFee * 3 / 2`. This ratio might change, so it is better not to hardcode it and use this function instead.

This function can be useful when the outgoing message depends heavily on the structure of the incoming message, so you can try to approximate the forward fee for your outgoing message based on the fee the sender paid. Calculating the exact fee with [nanoToncoin][nano]-level precision can be very expensive, so the approximation given by this function is often good enough.

Attempts to specify a negative value of `fwdFee` throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Usage example:

```tact
// Context.readForwardFee() applies getOriginalFwdFee() at the end
let origFwdFee: Int = context().readForwardFee();

// Therefore, calling getOriginalFwdFee() on that value is redundant
let origFwdFee2: Int = getOriginalFwdFee(origFwdFee, false);

// ⌈(2 * origFwdFee2) / origFwdFee⌉ is equal to 3
muldivc(2, origFwdFee2, origFwdFee) == 3; // true, but this relation
                                          // can change in the future
```

:::note[Useful links:]

  [Forward fee in TON Docs][forward-fee]\
  [Forward fee calculation in TON Docs][forward-fee-calc]\
  [`getForwardFee(){:tact}`](#getforwardfee)\
  [`Context.readForwardFee(){:tact}`](/ref/core-contextstate#contextreadforwardfee)

:::

## setGasLimit

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
fun setGasLimit(limit: Int);
```

Sets the [`gas_limit`][param-20-21] to the [`Int{:tact}`][int] `limit` and resets the [`gas_credit`][param-20-21] to 0. Note that specifying a `limit` higher than the maximum allowed value of $2^{63} - 1$ will have the same result as specifying that exact maximum or calling [`acceptMessage(){:tact}`](#acceptmessage).

Attempts to specify a negative or insufficient value of `limit` will cause an exception with [exit code -14](/book/exit-codes#-14): `Out of gas error`.

Usage example:

```tact
setGasLimit(42000);
```

:::note

  For more details, see: [Accept Message Effects in TON Docs](https://docs.ton.org/develop/smart-contracts/guidelines/accept).

:::

## acceptMessage

```tact
fun acceptMessage();
```

Agrees to buy some [gas][gas] to finish the current transaction by setting the [`gas_limit`][param-20-21] to its maximum allowed value of $2^{63}-1$ and resetting the [`gas_credit`][param-20-21] to 0. This action is required to process external messages, which bring no value (hence no gas) with them.

Usage example:

```tact {10}
contract Timeout {
    timeout: Int;

    init() {
        self.timeout = now() + 5 * 60; // 5 minutes from now
    }

    external("timeout") {
        if (now() > self.timeout) {
            acceptMessage(); // start accepting external messages once timeout has passed
        }
    }
}
```

:::note

  For more details, see: [Accept Message Effects in TON Docs](https://docs.ton.org/develop/smart-contracts/guidelines/accept).

:::

[p]: /book/types#primitive-types
[int]: /book/integers
[nano]: /book/integers#nanotoncoin
[cell]: /book/cells#cells
[slice]: /book/cells#slices
[masterchain]: https://docs.ton.org/v3/documentation/smart-contracts/shards/shards-intro#masterchain

[tvm]: https://docs.ton.org/learn/tvm-instructions/tvm-overview
[basechain]: https://docs.ton.org/v3/documentation/smart-contracts/addresses#workchain-id
[deduplication]: https://docs.ton.org/v3/documentation/data-formats/tlb/library-cells

[storage-fee]: https://docs.ton.org/v3/documentation/smart-contracts/transaction-fees/fees-low-level#storage-fee
[storage-fee-calc]: https://docs.ton.org/v3/guidelines/smart-contracts/fee-calculation#storage-fee

[gas]: https://docs.ton.org/v3/documentation/smart-contracts/transaction-fees/fees#gas
[compute-fee]: https://docs.ton.org/v3/documentation/smart-contracts/transaction-fees/fees-low-level#computation-fees
[compute-fee-calc]: https://docs.ton.org/v3/guidelines/smart-contracts/fee-calculation#computation-fee
[param-20-21]: https://docs.ton.org/v3/documentation/network/configs/blockchain-configs#param-20-and-21

[forward-fee]: https://docs.ton.org/v3/documentation/smart-contracts/transaction-fees/forward-fees
[forward-fee-calc]: https://docs.ton.org/v3/guidelines/smart-contracts/fee-calculation#forward-fee
[param-24-25]: https://docs.ton.org/v3/documentation/network/configs/blockchain-configs#param-24-and-25



================================================
FILE: docs/src/content/docs/ref/core-math.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/core-math.mdx
================================================
---
title: Math
description: "Various math helper functions from the Core library of Tact"
---

import { Badge } from '@astrojs/starlight/components';

Various math helper functions.

## min

```tact
fun min(x: Int, y: Int): Int;
```

Computes and returns the [minimum](https://en.wikipedia.org/wiki/Maximum_and_minimum) of two [`Int{:tact}`][int] values `x` and `y`.

Usage examples:

```tact
min(1, 2);        // 1
min(2, 2);        // 2
min(007, 3);      // 3
min(0x45, 3_0_0); // 69, nice
//  ↑     ↑
//  69    300
```

## max

```tact
fun max(x: Int, y: Int): Int;
```

Computes and returns the [maximum](https://en.wikipedia.org/wiki/Maximum_and_minimum) of two [`Int{:tact}`][int] values `x` and `y`.

Usage examples:

```tact
max(1, 2);        // 2
max(2, 2);        // 2
max(007, 3);      // 7
max(0x45, 3_0_0); // 300
//  ↑     ↑
//  69    300
```

## abs

```tact
fun abs(x: Int): Int;
```

Computes and returns the [absolute value](https://en.wikipedia.org/wiki/Absolute_value) of the [`Int{:tact}`][int] value `x`.

Usage examples:

```tact
abs(42);        // 42
abs(-42);       // 42
abs(-(-(-42))); // 42
```

## sign

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
fun sign(x: Int): Int;
```

Computes and returns the sign of the [`Int{:tact}`][int] value `x`. Produces $1$ if `x` is positive, $-1$ if `x` is negative, and $0$ if `x` is $0$.

Usage examples:

```tact
sign(42);        // 1
sign(-42);       // -1
sign(-(-42));    // 1
sign(-(-(-42))); // -1
sign(0);         // 0
```

## sqrt

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/>
<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
fun sqrt(num: Int): Int;
```

Computes the [square root](https://en.wikipedia.org/wiki/Square_root) of the [`Int{:tact}`][int] value `num`. Returns the result rounded to the nearest integer. If there are two equally close integers, rounding is done toward the even one.

Attempts to specify a negative value for `num` throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Usage examples:

```tact
sqrt(4);  // 2
sqrt(3);  // 2
sqrt(2);  // 1
sqrt(1);  // 1
sqrt(0);  // 0
sqrt(-1); // ERROR! Exit code 5: Integer out of expected range
```

## divc

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
fun divc(x: Int, y: Int): Int;
```

Computes and returns the [rounded up][round-up] result of division of the [`Int{:tact}`][int] `x` by the [`Int{:tact}`][int] `y`.

Attempts to divide by `y` equal to $0$ throw an exception with [exit code 4](/book/exit-codes#4): `Integer overflow`.

Usage examples:

```tact
divc(4, 2);  // 2
divc(3, 2);  // 2
divc(-4, 2); // -2
divc(-3, 2); // -1
```

## muldivc

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
fun muldivc(x: Int, y: Int, z: Int): Int;
```

Computes and returns the [rounded up][round-up] result of `(x * y) / z{:tact}`.

If the value in calculation goes beyond the range from $-2^{256}$ to $2^{256} - 1$ inclusive, or if there is an attempt to divide by `z` equal to $0$, an exception with [exit code 4](/book/exit-codes#4) is thrown: `Integer overflow`.

Usage examples:

```tact
muldivc(4, 1, 2);  // 2
muldivc(3, 1, 2);  // 2
muldivc(-4, 1, 2); // -2
muldivc(-3, 1, 2); // -1
muldivc(-3, 0, 2); // 0
muldivc(-3, 0, 0); // ERROR! Exit code 4: Integer overflow
```

## mulShiftRight

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
fun mulShiftRight(x: Int, y: Int, z: Int): Int;
```

Computes and returns the [rounded down][round-down] result of `(x * y) / 2^z{:tact}`. It is a more gas-efficient equivalent of performing the [bitwise shift right](/book/operators#binary-bitwise-shift-right) on the result of multiplication of [`Int{:tact}`][int] `x` by [`Int{:tact}`][int] `y`, where [`Int{:tact}`][int] `z` is the right operand of the shift.

If the value in calculation goes beyond the range from $-2^{256}$ to $2^{256} - 1$ inclusive, an exception with [exit code 4](/book/exit-codes#4) is thrown: `Integer overflow`.

Attempts to specify any value of `z` outside the inclusive range from $0$ to $256$ throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Usage examples:

```tact
mulShiftRight(5, 5, 2);  // 6
mulShiftRight(5, 5, 1);  // 12
mulShiftRight(5, 5, 0);  // 25
mulShiftRight(5, 5, -1); // ERROR! Exit code 5: Integer out of expected range
```

## mulShiftRightRound

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
fun mulShiftRightRound(x: Int, y: Int, z: Int): Int;
```

Similar to [`mulShiftRight(){:tact}`](#mulshiftright), but instead of [rounding down][round-down], the result value is rounded to the nearest integer. If there are two equally close integers, rounding is done toward the even one.

If the value in calculation goes beyond the range from $-2^{256}$ to $2^{256} - 1$ inclusive, an exception with [exit code 4](/book/exit-codes#4) is thrown: `Integer overflow`.

Attempts to specify any value of `z` outside the inclusive range from $0$ to $256$ throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Usage examples:

```tact
mulShiftRightRound(5, 5, 2);  // 6
mulShiftRightRound(5, 5, 1);  // 13
mulShiftRightRound(5, 5, 0);  // 25
mulShiftRightRound(5, 5, -1); // ERROR! Exit code 5: Integer out of expected range
```

## mulShiftRightCeil

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
fun mulShiftRightCeil(x: Int, y: Int, z: Int): Int;
```

Similar to [`mulShiftRight(){:tact}`](#mulshiftright), but instead of [rounding down][round-down], the result value is [rounded up][round-up].

If the value in calculation goes beyond the range from $-2^{256}$ to $2^{256} - 1$ inclusive, an exception with [exit code 4](/book/exit-codes#4) is thrown: `Integer overflow`.

Attempts to specify any value of `z` outside the inclusive range from $0$ to $256$ throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Usage examples:

```tact
mulShiftRightCeil(5, 5, 2);  // 7
mulShiftRightCeil(5, 5, 1);  // 13
mulShiftRightCeil(5, 5, 0);  // 25
mulShiftRightCeil(5, 5, -1); // ERROR! Exit code 5: Integer out of expected range
```

## log

```tact
fun log(num: Int, base: Int): Int;
```

Computes and returns the [logarithm](https://en.wikipedia.org/wiki/Logarithm) of a number `num` $> 0$ to the base `base` $≥ 2$. Results are [rounded down][round-down].

Attempts to specify a non-positive `num` value or a `base` less than 2 throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Usage examples:

```tact
log(1000, 10); // 3, as 10^3 is 1000
//  ↑     ↑             ↑       ↑
//  num   base          base    num

log(1001, 10);  // 3
log(999, 10);   // 2
try {
    log(-1000, 10); // exit code 5 because of the non-positive num
}
log(1024, 2);   // 10
try {
    log(1024, -2);  // exit code 5 because the base is less than 1
}
```

:::note

  If you only need to obtain logarithms to the base 2, use the [`log2(){:tact}`](#log2) function, as it's more gas-efficient.

:::

## log2

```tact
fun log2(num: Int): Int;
```

Similar to [`log(){:tact}`](#log), but sets the `base` to 2.

Attempts to specify a non-positive `num` value throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Usage example:

```tact
log2(1024); // 10, as 2^10 is 1024
//   ↑                ↑       ↑
//   num              base₂   num
```

:::note

  In order to reduce gas usage, prefer using this function over calling [`log(){:tact}`](#log) when you only need to obtain logarithms to the base 2.

:::

## pow

```tact
fun pow(base: Int, exp: Int): Int;
```

Computes and returns the [exponentiation](https://en.wikipedia.org/wiki/Exponentiation) involving two numbers: the `base` and the exponent (or _power_) `exp`. Exponent `exp` must be non-negative; otherwise, an exception with [exit code 5](/book/exit-codes#5) is thrown: `Integer out of expected range`.

This function tries to resolve constant values at [compile-time](/ref/core-comptime) whenever possible.

Usage examples:

```tact
contract Example {
    // Persistent state variables
    p23: Int = pow(2, 3); // raises 2 to the 3rd power, which is 8
    one: Int = pow(5, 0); // raises 5 to the power 0, which always produces 1
                          // works at compile-time!

    // Internal message receiver
    receive() {
        pow(self.p23, self.one + 1); // 64, works at run-time too!
        try {
            pow(0, -1); // exit code 5: Integer out of expected range
        }
    }
}
```

:::note

  If you only need to obtain powers of $2$, use the [`pow2(){:tact}`](#pow2) function, as it's more gas-efficient.

:::

:::note

  List of functions that only work at compile-time: [API Comptime](/ref/core-comptime).

:::

## pow2

```tact
fun pow2(exp: Int): Int;
```

Similar to [`pow(){:tact}`](#pow), but sets the `base` to $2$. The exponent `exp` must be non-negative; otherwise, an error with [exit code 5](/book/exit-codes#5) will be thrown: `Integer out of expected range`.

This function tries to resolve constant values at [compile-time](/ref/core-comptime) whenever possible.

Usage examples:

```tact
contract Example {
    // Persistent state variables
    p23: Int = pow2(3); // raises 2 to the 3rd power, which is 8
    one: Int = pow2(0); // raises 2 to the power 0, which always produces 1
                        // works at compile-time!

    // Internal message receiver, which accepts message ExtMsg
    receive() {
        pow2(self.one + 1); // 4, works at run-time too!
        try {
            pow(-1); // exit code 5: Integer out of expected range
        }
    }
}
```

:::note

  In order to reduce gas usage, prefer using this function over calling [`pow(){:tact}`](#pow) when you only need to obtain powers of $2$.

:::

:::note

  List of functions that only work at compile-time: [API Comptime](/ref/core-comptime).

:::

[p]: /book/types#primitive-types
[int]: /book/integers

[round-up]: https://en.wikipedia.org/wiki/Rounding#Rounding_up
[round-down]: https://en.wikipedia.org/wiki/Rounding#Rounding_down



================================================
FILE: docs/src/content/docs/ref/core-random.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/core-random.mdx
================================================
---
title: Random number generation
description: "Various random number generation functions from the Core library of Tact"
---

import { Badge } from '@astrojs/starlight/components';

Random number generation for Tact smart contracts.

## Common

### random

```tact
fun random(min: Int, max: Int): Int;
```

Generates and returns a new pseudo-random unsigned [`Int{:tact}`][int] value `x` in the provided semi-closed interval: `min` $≤$ `x` $<$ `max`, or `min` $≥$ `x` $>$ `max` if both `min` and `max` are negative. Note that the `max` value is never included in the interval.

Usage examples:

```tact
random(42, 43); // 42, always
random(0, 42);  // 0-41, but never 42
```

### randomInt

```tact
fun randomInt(): Int;
```

Generates and returns a new pseudo-random unsigned 256-bit [`Int{:tact}`][int] value `x`.

The algorithm works as follows: first, the `sha512(r){:tact}` is computed. There, `r` is an old value of the random seed, which is taken as a 32-byte array constructed from the big-endian representation of an unsigned 256-bit [`Int{:tact}`][int]. The first 32 bytes of this hash are stored as the new value `r'` of the random seed, and the remaining 32 bytes are returned as the next random value `x`.

Usage example:

```tact
let allYourRandomBelongToUs: Int = randomInt(); // ???, it's random :)
```

## Advanced

Various niche, dangerous, or unstable features which can produce unexpected results and are meant to be used by more experienced users.

:::caution

  Proceed with caution.

:::

### getSeed

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
fun getSeed(): Int;
```

Generates and returns an unsigned 256-bit [`Int{:tact}`][int] [seed][seed] for the random number generator. The resulting seed is commonly used with the [`setSeed(){:tact}`](#setseed) and [`nativeRandomize(){:tact}`](#nativerandomize) functions.

Usage example:

```tact
let seed: Int = getSeed();
setSeed(seed); // From now on, the results of the pseudorandom number generator
               // are completely determined by the seed, which can be handy in tests,
               // but must not be used in production code!
```

:::note[Useful links:]

  [Random seed in Wikipedia][seed]\
  [`setSeed(){:tact}`](#setseed)\
  [`nativeRandomize(){:tact}`](#nativerandomize)

:::

### setSeed

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
fun setSeed(seed: Int);
```

Sets the [seed][seed] of the random number generator to the unsigned 256-bit [`Int{:tact}`][int] `seed`, which can be obtained with the [`getSeed(){:tact}`](#getseed) function.

Attempts to specify a negative value for `seed` throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Usage example:

```tact
let seed: Int = getSeed();
setSeed(seed); // From now on, the results of the pseudorandom number generator
               // are completely determined by the seed, which can be handy in tests,
               // but must not be used in production code!
```

:::note[Useful links:]

  [Random seed in Wikipedia][seed]\
  [`getSeed(){:tact}`](#getseed)

:::

### nativePrepareRandom

```tact
fun nativePrepareRandom();
```

Prepares the random number generator by using [`nativeRandomizeLt(){:tact}`](#nativerandomizelt). Automatically called by the [`randomInt(){:tact}`](#randomint) and [`random(){:tact}`](#random) functions.

Usage example:

```tact
nativePrepareRandom(); // Prepare the RNG
// ... do your random things ...
```

### nativeRandomize

```tact
fun nativeRandomize(x: Int);
```

Randomizes the pseudorandom number generator with the specified unsigned 256-bit [`Int{:tact}`][int] `x` by mixing it with the current [seed][seed]. The new seed is the unsigned 256-bit [`Int{:tact}`][int] value of the [SHA-256](/ref/core-crypto#sha256) hash of the concatenated old seed and `x` in their 32-byte strings [big-endian](https://en.wikipedia.org/wiki/Endianness) representation.

Attempts to specify a negative value for `x` throw an exception with [exit code 5](/book/exit-codes#5): `Integer out of expected range`.

Usage example:

```tact
nativeRandomize(42);        // Now, random numbers are less predictable
let idk: Int = randomInt(); // ???, it's random,
                            // but the seed was adjusted deterministically!
```

:::note[Useful links:]

  [Random seed in Wikipedia][seed]

:::

### nativeRandomizeLt

```tact
fun nativeRandomizeLt();
```

Randomizes the random number generator with the [logical time][lt] of the current transaction. Equivalent to calling `nativeRandomize(curLt()){:tact}`.

Usage example:

```tact
nativeRandomizeLt();        // Now, random numbers are unpredictable for users,
                            // but still may be affected by validators or collators
                            // as they determine the seed of the current block.
let idk: Int = randomInt(); // ???, it's random!
```

:::note[Useful links:]

  [Random seed in Wikipedia][seed]\
  [`nativeRandomize{:tact}`](#nativerandomize)\
  [`curLt(){:tact}`](/ref/core-contextstate#curlt)

:::

### nativeRandom

```tact
fun nativeRandom(): Int;
```

Generates and returns a 256-bit random number just like [`randomInt(){:tact}`](#randomint) but does not initialize the random generator with [`nativePrepareRandom(){:tact}`](#nativepreparerandom) beforehand.

:::note

  Do not use this function directly — prefer using [`randomInt(){:tact}`](#randomint) instead.

:::

### nativeRandomInterval

```tact
fun nativeRandomInterval(max: Int): Int;
```

Generates and returns a 256-bit random number in the range from 0 to `max`, similar to [`random(){:tact}`](#random), but doesn't initialize the random generator with [`nativePrepareRandom(){:tact}`](#nativepreparerandom) beforehand.

:::note

  Don't use this function directly — prefer using [`random(){:tact}`](#random) instead.

:::

[int]: /book/integers

[lt]: https://docs.ton.org/v3/documentation/smart-contracts/message-management/messages-and-transactions#what-is-a-logical-time
[seed]: https://en.wikipedia.org/wiki/Random_seed



================================================
FILE: docs/src/content/docs/ref/core-send.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/core-send.mdx
================================================
---
title: Communication and messaging
description: "Main functions for sending messages in the Core library of Tact"
---

import { Badge } from '@astrojs/starlight/components';

Primary [message-sending functions](/book/send#message-sending-functions).

To perform [nanoToncoin][nano] reservations, use [`nativeReserve(){:tact}`](/ref/core-contextstate#nativereserve) function from the [context and state-related functions reference page](/ref/core-contextstate).

## Common

### send

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

```tact
fun send(params: SendParameters);
```

[Queues the message](/book/send#outbound-message-processing) to be sent using a [`SendParameters{:tact}`](/book/send) [struct][struct].

Attempts to queue more than 255 messages throw an exception with [exit code 33](/book/exit-codes#33): `Action list is too long`.

Usage example:

```tact
send(SendParameters {
    to: sender(),    // back to the sender,
    value: ton("1"), // with 1 Toncoin (1_000_000_000 nanoToncoin),
                     // and no message body
});
```

:::note[Useful links:]

  [Sending messages in the Book](/book/send)\
  [Message `mode` in the Book](/book/message-mode)\
  [Single-contract communication in the Cookbook](/cookbook/single-communication)\
  [`nativeReserve(){:tact}`](/ref/core-contextstate#nativereserve)

:::

### message

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/>
<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
fun message(params: MessageParameters);
```

[Queues the message](/book/send#outbound-message-processing) to be sent using the `MessageParameters{:tact}` [struct][struct]. Allows for cheaper non-deployment regular messages compared to the [`send(){:tact}`](#send) function.

The `MessageParameters{:tact}` [struct][struct] is similar to the [`SendParameters{:tact}`](/book/send) [struct][struct], but without the `code` and `data` fields.

Attempts to queue more than 255 messages throw an exception with an [exit code 33](/book/exit-codes#33): `Action list is too long`.

Usage example:

```tact
message(MessageParameters {
    to: sender(),    // back to the sender,
    value: ton("1"), // with 1 Toncoin (1_000_000_000 nanoToncoin),
                     // and no message body
});
```

:::note[Useful links:]

  [Sending messages in the Book](/book/send)\
  [Message `mode` in the Book](/book/message-mode)\
  [`nativeReserve(){:tact}`](/ref/core-contextstate#nativereserve)

:::

### deploy

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/>
<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
fun deploy(params: DeployParameters);
```

[Queues](/book/send#outbound-message-processing) the [contract deployment message](/book/deploy) to be sent using the `DeployParameters{:tact}` [struct][struct]. Allows for cheaper on-chain deployments compared to the [`send(){:tact}`](#send) function.

The `DeployParameters{:tact}` [struct][struct] consists of the following fields:

Field    | Type                          | Description
:------- | :---------------------------- | :----------
`mode`   | [`Int{:tact}`][int]           | An 8-bit value that configures how to send a message, defaults to $0$. See: [Message `mode`](/book/message-mode).
`body`   | [`Cell?{:tact}`][cell]        | [Optional][opt] message body as a [`Cell{:tact}`][cell].
`value`  | [`Int{:tact}`][int]           | The amount of [nanoToncoins][nano] you want to send with the message. This value is used to cover [forward fees][fwdfee] unless the optional flag [`SendPayFwdFeesSeparately{:tact}`](/book/message-mode#optional-flags) is used.
`bounce` | [`Bool{:tact}`][p]            | When set to `true` (default), the message bounces back to the sender if the recipient contract doesn't exist or isn't able to process the message.
`init`   | [`StateInit{:tact}`][initpkg] | [Initial package][initpkg] of the contract (initial code and initial data). See: [`initOf{:tact}`][initpkg].

Attempts to queue more than 255 messages throw an exception with an [exit code 33](/book/exit-codes#33): `Action list is too long`.

Usage example:

```tact
deploy(DeployParameters {
    init: initOf SomeContract(), // with initial code and data of SomeContract
                                 // and no additional message body
    mode: SendIgnoreErrors,      // skip the message in case of errors
    value: ton("1"),             // send 1 Toncoin (1_000_000_000 nanoToncoin)
});
```

:::note[Useful links:]

  [Sending messages in the Book](/book/send)\
  [Message `mode` in the Book](/book/message-mode)\
  [`nativeReserve(){:tact}`](/ref/core-contextstate#nativereserve)

:::

### cashback

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/>
<Badge text="Available since Tact 1.6.1" variant="tip" size="medium"/><p/>

```tact
fun cashback(to: Address);
```

[Queues](/book/send#outbound-message-processing) an empty message to be sent with the [`SendRemainingValue{:tact}`](/book/message-mode#base-modes) mode with the [`SendIgnoreErrors{:tact}`](/book/message-mode/#optional-flags) to the destination address `to`. It is the most gas-efficient way to send the remaining value from the incoming message to the given address.

This function won't forward excess values if any other [message-sending functions](/book/send#message-sending-functions) were called in the same receiver before.

Attempts to queue more than 255 messages throw an exception with [exit code 33](/book/exit-codes#33): `Action list is too long`.

Usage examples:

```tact
// Forward the remaining value back to the sender
cashback(sender());

// The cashback() function above is cheaper, but functionally
// equivalent to the following call to the message() function
message(MessageParameters {
    mode: SendRemainingValue | SendIgnoreErrors,
    body: null,
    value: 0,
    to: sender(),
    bounce: false,
});
```

### emit

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

```tact
fun emit(body: Cell);
```

[Queues the message](/book/send#outbound-message-processing) `body` to be sent to the outer world for the purpose of logging and analyzing it later off-chain. The message does not have a recipient and is more gas-efficient compared to using any other [message-sending functions](/book/send#message-sending-functions) of Tact.

The message is sent with the default mode: [`SendDefaultMode`](/book/message-mode#base-modes) ($0$).

Attempts to queue more than $255$ messages throw an exception with an [exit code 33](/book/exit-codes#33): `Action list is too long`.

Usage example:

```tact
emit("Catch me if you can, Mr. Holmes".asComment()); // asComment() converts a String to a Cell
```

:::note

  To analyze `emit(){:tact}` calls, one must look at the [external messages](/book/external) produced by the contract.

  Read more: [Logging via `emit(){:tact}`](/book/debug#logging).

:::

## Advanced

Various niche, dangerous, or unstable features which can produce unexpected results and are meant to be used by more experienced users.

:::caution

  Proceed with caution.

:::

### sendRawMessage

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/>
<Badge text="Available since Tact 1.6.6" variant="tip" size="medium"/><p/>

```tact
fun sendRawMessage(msg: Cell, mode: Int);
```

[Queues the message](/book/send#outbound-message-processing) to be sent by specifying the complete `msg` cell and the [message `mode`](/book/message-mode).

Attempts to queue more than $255$ messages throw an exception with [exit code 33](/book/exit-codes#33): `Action list is too long`.

:::note

  Prefer using the more user-friendly [`message(){:tact}`](#message), [`deploy(){:tact}`](#deploy), or [`send(){:tact}`](#send) functions unless you have a complex logic that cannot be expressed otherwise.

:::

### sendRawMessageReturnForwardFee

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/>
<Badge text="Available since Tact 1.6.6" variant="tip" size="medium"/><p/>

```tact
fun sendRawMessageReturnForwardFee(msg: Cell, mode: Int): Int;
```

Similar to [`sendRawMessage(){:tact}`](#sendrawmessage), but also calculates and returns the [forward fee][fwdfee] in [nanoToncoin][nano].

The `sendRawMessageReturnForwardFee(){:tact}` function may throw the following exit codes:

* 5: [Integer out of expected range] - Thrown if the message mode is invalid.
* 7: [Type check error] - Thrown if any of the blockchain config, contract balance or incoming message value are invalid.
* 11: ["Unknown" error] - Thrown if the message cell is ill-formed or the TVM config is invalid.
* 33: [Action list is too long] — Thrown when attempting to queue more than 255 messages.

### nativeSendMessage

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/>
<Badge text="Deprecated since Tact 1.6.6" variant="tip" size="medium"/><p/>

Use [`sendRawMessage(){:tact}`](#sendrawmessage) instead.

```tact
fun nativeSendMessage(msg: Cell, mode: Int);
```

[Queues the message](/book/send#outbound-message-processing) to be sent by specifying the complete `msg` cell and the [message `mode`](/book/message-mode).

Attempts to queue more than $255$ messages throw an exception with [exit code 33](/book/exit-codes#33): `Action list is too long`.

### nativeSendMessageReturnForwardFee

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/>
<Badge text="Deprecated since Tact 1.6.6" variant="tip" size="medium"/><p/>

Use [`sendRawMessageReturnForwardFee(){:tact}`](#sendrawmessagereturnforwardfee) instead.

```tact
fun nativeSendMessageReturnForwardFee(msg: Cell, mode: Int): Int;
```

Similar to [`sendRawMessage(){:tact}`](#sendrawmessage), but also calculates and returns the [forward fee][fwdfee] in [nanoToncoin][nano].

Attempts to queue more than $255$ messages throw an exception with [exit code 33](/book/exit-codes#33): `Action list is too long`.

[p]: /book/types#primitive-types
[bool]: /book/types#booleans
[int]: /book/integers
[cell]: /book/cells#cells
[slice]: /book/cells#slices
[struct]: /book/structs-and-messages#structs
[opt]: /book/optionals

[msg-queue]: /book/send#outbound-message-processing
[nano]: /book/integers#nanotoncoin
[initpkg]: /book/expressions#initof

[fwdfee]: https://docs.ton.org/develop/howto/fees-low-level#forward-fees
[workchain-id]: https://docs.ton.org/learn/overviews/addresses#workchain-id
[account-id]: https://docs.ton.org/learn/overviews/addresses#account-id

[Integer out of expected range]: /book/exit-codes#5
[Type check error]: /book/exit-codes#7
["Unknown" error]: /book/exit-codes#11
[Action list is too long]: /book/exit-codes#33



================================================
FILE: docs/src/content/docs/ref/core-strings.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/core-strings.mdx
================================================
---
title: Strings and StringBuilders
description: "Various String and StringBuilder functions from the Core library of Tact"
---

import { Badge } from '@astrojs/starlight/components';

Strings are immutable sequences of characters, which means that once a [`String{:tact}`][p] is created, it cannot be changed. Strings are useful for storing text, so they can be converted to a [`Cell{:tact}`][cell] type to be used as message bodies.

To concatenate strings use a [`StringBuilder{:tact}`][p].

To use [`String{:tact}`][p] literals directly, see: [String literals](/book/expressions#string-literals).

:::note

  Strings on-chain are represented as [slices][slice], which are expensive for handling Unicode strings and quite costly even for ASCII ones. Prefer not to manipulate strings on-chain.

:::

## beginString

```tact
fun beginString(): StringBuilder;
```

Creates and returns an empty [`StringBuilder{:tact}`][p].

Usage example:

```tact
let fizz: StringBuilder = beginString();
```

## beginComment

```tact
fun beginComment(): StringBuilder;
```

Creates and returns an empty [`StringBuilder{:tact}`][p] for building a comment string, which prefixes the resulting [`String{:tact}`][p] with four null bytes. [This format](https://docs.ton.org/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing#snake-data-encoding) is used for passing text comments as message bodies.

Usage example:

```tact
let fizz: StringBuilder = beginComment();
```

## beginTailString

```tact
fun beginTailString(): StringBuilder;
```

Creates and returns an empty [`StringBuilder{:tact}`][p] for building a tail string, which prefixes the resulting [`String{:tact}`][p] with a single null byte. This format is used in various standards such as NFT or Jetton.

Usage example:

```tact
let fizz: StringBuilder = beginTailString();
```

## beginStringFromBuilder

```tact
fun beginStringFromBuilder(b: StringBuilder): StringBuilder;
```

Creates and returns a new [`StringBuilder{:tact}`][p] from an existing [`StringBuilder{:tact}`][p] `b`. Useful when you need to serialize an existing [`String{:tact}`][p] to a [`Cell{:tact}`][cell] along with other data.

Usage example:

```tact
let fizz: StringBuilder = beginStringFromBuilder(beginString());
```

## StringBuilder

### StringBuilder.append

```tact
extends mutates fun append(self: StringBuilder, s: String);
```

Extension mutation function for the [`StringBuilder{:tact}`][p] type.

Appends a [`String{:tact}`][p] `s` to the [`StringBuilder{:tact}`][p].

Usage example:

```tact
let fizz: StringBuilder = beginString();
fizz.append("oh");
fizz.append("my");
fizz.append("Tact!");
```

### StringBuilder.concat

```tact
extends fun concat(self: StringBuilder, s: String): StringBuilder;
```

Extension function for the [`StringBuilder{:tact}`][p] type.

Returns a new [`StringBuilder{:tact}`][p] after concatenating it with a [`String{:tact}`][p] `s`. It can be chained, unlike [`StringBuilder.append(){:tact}`](#stringbuilderappend).

Usage example:

```tact
let fizz: StringBuilder = beginString()
    .concat("oh")
    .concat("my")
    .concat("Tact!");
```

### StringBuilder.toString

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

```tact
extends fun toString(self: StringBuilder): String;
```

Extension function for the [`StringBuilder{:tact}`][p] type.

Returns a built [`String{:tact}`][p] from a [`StringBuilder{:tact}`][p].

Usage example:

```tact
let fizz: StringBuilder = beginString();
let buzz: String = fizz.toString();
```

### StringBuilder.toCell

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

```tact
extends fun toCell(self: StringBuilder): Cell;
```

Extension function for the [`StringBuilder{:tact}`][p] type.

Returns an assembled [`Cell{:tact}`][cell] from a [`StringBuilder{:tact}`][p].

Usage example:

```tact
let fizz: StringBuilder = beginString();
let buzz: Cell = fizz.toCell();
```

### StringBuilder.toSlice

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

```tact
extends fun toSlice(self: StringBuilder): Slice;
```

Extension function for the [`StringBuilder{:tact}`][p] type.

Returns an assembled [`Cell{:tact}`][cell] as a [`Slice{:tact}`][slice] from a [`StringBuilder{:tact}`][p]. An alias to [`self.toCell().asSlice(){:tact}`](/ref/core-cells#cellasslice).

Usage example:

```tact
let s: StringBuilder = beginString();
let fizz: Slice = s.toSlice();
let buzz: Slice = s.toCell().asSlice();

fizz == buzz; // true
```

## String

### String.hashData

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

```tact
extends fun hashData(self: String): Int;
```

Extension function for the [`String{:tact}`][p] type.

Calculates and returns an [`Int{:tact}`][int] value of the [SHA-256][sha-2] hash of the data bits from the given [`String{:tact}`][p], which should have a number of bits divisible by 8.

Unlike [`sha256(){:tact}`](/ref/core-crypto#sha256), this function is gas-efficient and **only** hashes up to 127 bytes of the given string. Using longer strings will cause collisions if their first 127 bytes are the same.

Attempts to specify a [`String{:tact}`][p] with a number of bits **not** divisible by 8 throw an exception with [exit code 9](/book/exit-codes#9): `Cell underflow`.

Usage example:

```tact
let roll: Int = "Never gonna give you up!".hashData(); // just the hash of the data
```

### String.asSlice

```tact
extends fun asSlice(self: String): Slice;
```

Extension function for the [`String{:tact}`][p] type.

Casts the [`String{:tact}`][p] back to the underlying [`Slice{:tact}`][slice] and returns it. The inverse of [`Slice.asString(){:tact}`](/ref/core-cells#sliceasstring).

Usage example:

```tact
let s: String = "It's alive! It's alive!!!";
let fizz: Slice = s.asSlice();
let buzz: Slice = s.asSlice().asString().asSlice();

fizz == buzz; // true
```

:::note

  See how the `String.asSlice{:tact}` function can be used in practice: [How to convert a `String` to an `Int`](/cookbook/type-conversion#how-to-convert-a-string-to-an-int).

:::

### String.asComment

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

```tact
extends fun asComment(self: String): Cell;
```

Extension function for the [`String{:tact}`][p] type.

Returns a [`Cell{:tact}`][cell] from a [`String{:tact}`][p] by prefixing the latter with four null bytes. This format is used for passing text comments as message bodies.

Usage example:

```tact
let s: String = "When life gives you lemons, call them 'yellow oranges' and sell them for double the price.";
let fizz: Cell = s.asComment();

let b: StringBuilder = beginComment();
b.append(s);
let buzz: Cell = b.toCell();

fizz == buzz; // true
```

### String.fromBase64

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

```tact
extends fun fromBase64(self: String): Slice;
```

Extension function for the [`String{:tact}`][p] type.

Returns a [`Slice{:tact}`][slice] from the decoded [Base64](https://en.wikipedia.org/wiki/Base64) [`String{:tact}`][p]. An alias to `self.asSlice().fromBase64(){:tact}`.

Note that this function is limited and only takes the first 1023 bits of data from the given [`String{:tact}`][p], without throwing an exception when the [`String{:tact}`][p] is larger (i.e., contains more than 1023 bits of data).

If the given [`String{:tact}`][p] contains characters not from the Base64 set, an exception with [exit code 134](/book/exit-codes#134) will be thrown: `Invalid argument`.

Usage example:

```tact
let s: String = "SGVyZSdzIEpvaG5ueSE=";
let fizz: Slice = s.fromBase64();
let buzz: Slice = s.asSlice().fromBase64();

fizz == buzz; // true
```

## Int.toString

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

```tact
extends fun toString(self: Int): String;
```

Extension function for the [`Int{:tact}`][int] type.

Returns a [`String{:tact}`][p] from an [`Int{:tact}`][int] value.

Usage example:

```tact
let fizz: String = (84 - 42).toString();
```

## Int.toFloatString

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

```tact
extends fun toFloatString(self: Int, digits: Int): String;
```

Extension function for the [`Int{:tact}`][int] type.

Returns a [`String{:tact}`][p] from an [`Int{:tact}`][int] value using a [fixed-point representation](https://en.wikipedia.org/wiki/Fixed-point_arithmetic) of a fractional number, where `self` is the significant part of the number and `digits` is the number of digits in the fractional part.

More precisely, `digits` is an exponentiation parameter of the expression $10^{-\mathrm{digits}}$, which gives the represented fractional number when multiplied by the actual [`Int{:tact}`][int] value. Parameter `digits` is required to be in the closed interval: $0 < \mathrm{digits} < 78$. Otherwise, an exception with [exit code 134](/book/exit-codes#134) will be thrown: `Invalid argument`.

Usage example:

```tact
let fizz: String = (42).toFloatString(9); // "0.000000042"
```

## Int.toCoinsString

<Badge text="500+ gas" title="Uses 500 gas units or more" variant="danger" size="medium"/><p/>

```tact
extends fun toCoinsString(self: Int): String;
```

Extension function for the [`Int{:tact}`][int] type.

Returns a [`String{:tact}`][p] from an [`Int{:tact}`][int] value using a [fixed-point representation](https://en.wikipedia.org/wiki/Fixed-point_arithmetic) of a fractional number. An alias to `self.toFloatString(9){:tact}`.

This is used to represent [nanoToncoin](/book/integers#nanotoncoin) [`Int{:tact}`][int] values using strings.

Usage example:

```tact
let nanotons: Int = 42;
let fizz: String = nanotons.toCoinsString();
let buzz: String = nanotons.toFloatString(9);

fizz == buzz; // true, both store "0.000000042"
```

[p]: /book/types#primitive-types
[bool]: /book/types#booleans
[int]: /book/integers
[cell]: /book/cells#cells
[slice]: /book/cells#slices

[sha-2]: https://en.wikipedia.org/wiki/SHA-2#Hash_standard



================================================
FILE: docs/src/content/docs/ref/evolution/otp-001.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/evolution/otp-001.mdx
================================================
---
title: "OTP-001: Supported Interfaces"
description: "This proposal recommends a way to introspect smart contracts and find out what interfaces they support"
sidebar:
  order: 1
---

This proposal recommends a way to introspect smart contracts and find out what interfaces they support.

## Motivation

Currently, it is impossible to guess what a user wants to do with a contract or to determine clearly what a transaction is about, because there is no explicit method for identifying the contract's purpose. Humans generally have to remember or guess the purpose in most cases.

## Guide

When a human signs a transaction, they need to clearly understand what they are doing: minting, token transfer, staking, DAO voting. While Ethereum wallets support signing arbitrary structures, it is still not clear what you are signing and what the implications of doing so are. Similarly, explorers cannot clearly display what is happening.

Working with a specific contract begins with performing introspection—figuring out what the contract declares about itself. Once an app knows what a contract is about, it can build a good UI, show transaction history, and verify what a human attempts to sign.

This proposal describes a way to report which interfaces a contract supports.

Interfaces are defined in a free-form specification. Unlike most other approaches, this proposal defines an interface not only as the technical interface of a contract (get methods, internal messages, etc.) but also as a description of its behavior. Attaching a hash of the representation of a technical interface of a contract could cause conflicts between different standards, which is why this proposal defines interfaces loosely. It also allows an interface to be more fluid; for example, a token that cannot be transferred could simply be a contract that has a method `can_transfer` returning `false`. This would indicate that this token does not support transfers at all, without needing to implement the transfer method.

Interface IDs are hashes of reverse domain names (similar to packages in Java). This approach avoids name clashes between different teams if they want to build something exclusively for themselves.

## Specification

In order to support introspection, the contract MUST implement the `supports_interface` GET method:

```(int...) supported_interfaces()```
This method returns a list of supported interface codes. The first value MUST be `hash("org.ton.introspection.v0")` = `123515602279859691144772641439386770278`.
If the first value is incorrect, the app MUST stop attempting to introspect the contract.
Example:
```func
_ supported_interfaces() method_id {
    return (123515602279859691144772641439386770278);
}
```

The hash of an interface is defined as the SHA256 hash truncated to 128 bits.

## Drawbacks

This proposal doesn't guarantee that the contract will behave correctly according to an interface. Also, it doesn't provide a guaranteed way to avoid name clashes between different interfaces. This is a non-goal for this proposal.

This proposal isn't tied to a specific technical interface. This could lead to multiple interfaces that do the same thing but have different IDs. This is a non-goal for this proposal, since a centralized registry would be very useful for existing interfaces, and a custom one would mostly be used in-house.

## Rationale and alternatives

- Why 128 bit? We are looking at a global namespace that we need to maintain without conflicts. We cannot use anything much smaller since the probability of conflicts would be much higher. We are looking at UUID-like entropy, which is exactly 128-bit and time-proven. More than 128 bits would be too wasteful.
- Why freeform? As mentioned earlier, it is easier just to define an ID to start work early and then eventually build a standard. Additionally, interfaces (like ERC20) are usually not just technical interfaces but also include a set of rules defining how to work with them.
- Why not find out what a contract supports by decompiling? Explicit is always better than implicit in open-world scenarios. We cannot rely on our "disassembling" capabilities to perform introspection; even small errors could be fatal.
- Why not a hash of representation? Right now, there are no compilers that support this approach. Also, this proposal is future-proof. If anyone wants to build something more automated, they could easily produce their own hashes using their own rules while keeping everything consistent for external observers.

## Prior art

[Ethereum Interface Detection](https://eips.ethereum.org/EIPS/eip-165)



================================================
FILE: docs/src/content/docs/ref/evolution/otp-002.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/evolution/otp-002.mdx
================================================
---
title: "OTP-002: Contract ABI"
description: "This proposal defines an ABI to communicate with deployed smart contracts."
sidebar:
  order: 2
---

The contract's Application Binary Interface (ABI) defines a format containing information about the contract's receivers, data structures, getters, etc.

## Motivation

An ABI is a tool that allows developers to generate convenient bindings, UIs, and so on. A beneficial consumer use case would be a DAO, as it would enable users to confirm exactly what the DAO is attempting to do before signing a transaction.

## Specification

An ABI is defined as a JSON file, usually with an `.abi` extension:

```json
{
  "name": "MyContract",
  "types": [
    {
      "name": "StateInit",
      "header": null,
      "fields": [
        {
          "name": "code",
          "type": {
            "kind": "simple",
            "type": "cell",
            "optional": false
          }
        },
        {
          "name": "data",
          "type": {
            "kind": "simple",
            "type": "cell",
            "optional": false
          }
        }
      ]
    },
    // ...etc.
  ],
  "receivers": [
    {
      "receiver": "internal",
      "message": {
        "kind": "text",
        "text": "Vote!"
      }
    },
    {
      "receiver": "internal",
      "message": {
        "kind": "typed",
        "type": "Deploy"
      }
    }
  ],
  "getters": [
    {
      "name": "gas",
      "methodId": 92180,
      "arguments": [],
      "returnType": {
        "kind": "simple",
        "type": "int",
        "optional": false,
        "format": 257
      }
    }
  ],
  "errors": {
    "2": {
      "message": "Stack underflow"
    },
    "3": {
      "message": "Stack overflow"
    }
    // ...etc.
  },
  "interfaces": [
    "org.ton.introspection.v0",
    "org.ton.abi.ipfs.v0",
    "org.ton.deploy.lazy.v0",
    "org.ton.debug.v0"
  ]
}
```

## Drawbacks

- The ABI is in JSON format, which is both human- and machine-readable, but not the most compact. A binary representation could be better but is not critical for now.

- The ABI has no strict JSON or TypeScript schema defined and thus is subject to frequent changes.

## Prior art

- [OTP-001](/ref/evolution/otp-001): A complementary proposal that provides additional context.



================================================
FILE: docs/src/content/docs/ref/evolution/otp-003.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/evolution/otp-003.mdx
================================================
---
title: "OTP-003: Self-ABI reporting"
description: "This proposal defines how to report the contract's ABI using an IPFS link"
sidebar:
  order: 3
---

This proposal defines how to report the contract's ABI using an IPFS link.

## Motivation

Usually, the ABI is supplied separately using a third-party service or via a repository on GitHub. This proposal suggests adding a new method of self-reporting the contract's ABI using a link to IPFS. This will allow us to avoid any third-party dependency and enable anyone to build tools that rely on the ABI, such as explorers, wallets, etc.

## Specification

To support this proposal, the contract should implement OTP-001 and report an interface `org.ton.abi.ipfs.v0`. Then implement a get method `get_abi_ipfs` that returns a string with an IPFS link to the ABI file. The link should be in the format `ipfs://<hash>`.

## Drawbacks

- There is no way to upgrade the ABI without updating the contract. This drawback exists only for hardcoded links.



================================================
FILE: docs/src/content/docs/ref/evolution/otp-004.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/evolution/otp-004.mdx
================================================
---
title: "OTP-004: Auto Encoder"
description: "This proposal defines a way to automatically build a serialization layout for a given structure."
sidebar:
  order: 4
---

This proposal defines a way to automatically build a serialization layout for a given structure.

## Motivation

Designing a serialization layout in TLB is a very risky task. Developers have to take care of the size limitations of cells and remember how many bits are used by each field. This is a very error-prone task, and it is very easy to make a mistake. This proposal aims to solve this problem by providing a way to automatically build a serialization layout for a given structure.

## Specification

We define an auto-encoder as an eager algorithm that builds a serialization layout for a given structure. The algorithm is defined as follows:

```text
Define available references and bits in a current cell 
   as `available_references` and `available_bits` respectively.
   NOTE: There must be at least one reference reserved for the serialization tail and one 
         bit for an optional flag. Depending on the context, more references or bits may be reserved. 

For each field in A:
    (size_bits, size_ref) = get_field_max_size(field);
    if (available_bits >= size_bits && available_references >= size_ref) {
        Push field to a current cell
    } else {
        available_references = (1023 - 1);
        available_bits = (4 - 1);
        Allocate a new tail and continue from the current field
    }
```

## Drawbacks

- This is an implicit algorithm. It is unclear whether the results of this allocator have to be checked to ensure compatible serialization.



================================================
FILE: docs/src/content/docs/ref/evolution/otp-005.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/evolution/otp-005.mdx
================================================
---
title: "OTP-005: Argument-addressable contracts"
description: "This proposal defines a way to address contracts by their arguments instead of their initial data"
sidebar:
  order: 5
---

This proposal defines a way to address contracts by their arguments instead of by their initial data.

## Motivation

Initial data can differ significantly from the arguments. This proposal allows us to avoid executing untrusted code from another contract in the context of the current one or executing TVM code off-chain for deployment, which could be risky in some cases.

## Specification

This specification defines a way to write arguments into an initial data cell to be read by the contract code during deployment.

### Prefix

The prefix is defined by the smart contract itself, but by default it is assumed to be a `single zero bit`. This prefix is used by the contract code to distinguish between deployed and not-deployed states.

### Arguments encoding

Arguments are encoded using [Auto Encoder](/ref/evolution/otp-004).

### Contract Requirements

- A contract MUST expose a `lazy_deployment_completed` get method that returns `true` if the contract is deployed and `false` otherwise.
- A contract MUST expose the `org.ton.deploy.lazy.v0` interface.

## Drawbacks

- Contracts could be in a semi-deployed state.
- There are multiple ways to write arguments, resulting in different initial data and different addresses.
- You can deploy a pre-initialized contract that would have a different address despite being fully functional.
- Gas usage upon deployment is unpredictable. Deployments are usually expensive, but this proposal makes them even more expensive.



================================================
FILE: docs/src/content/docs/ref/evolution/otp-006.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/evolution/otp-006.mdx
================================================
---
title: "OTP-006: Contract Package"
description: "This proposal defines a way to package compiled contracts, their dependencies, and all related metadata into a single file."
sidebar:
  order: 6
---

This proposal defines a way to package a compiled contract, its dependencies, and all related metadata into a single file.

## Motivation

A unified package format is needed to simplify the process of deploying and upgrading contracts using various tools without the need to configure them.

## Specification

The contract package is defined as a JSON file, usually with a `.pkg` extension:

```json
{
  "name": "ContractName",
  "code": "...base64-encoded BoC...",
  "abi": "...an ABI as a string to be uploaded as is to IPFS or Ton Storage...",
  "init": {
    "kind": "direct", // contract can be deployed as is
    "args": [], // arguments in ABI-like format
    "prefix": { // optional prefix for init()
      "bits": 1, // number of bits
      "value": 0 // value of the prefix
    },
    "deployment": {
      "kind": "system-cell",
      "system": null // removed in Tact 1.6.0
    }
  },
  "sources": {
    "contracts/stdlib.fc": "...base64-encoded source file...",
    "contracts/contract_name.tact": "...base64-encoded source file..."
  },
  "compiler": {
    "name": "tact",
    "version": "1.5.3",
    "parameters": "{...}" // a JSON as a string with an entrypoint and compilation options
  }
}
```

The schema of the specification is typed and accessible via:

```ts
import type { PackageFileFormat } from '@tact-lang/compiler';
```

## Drawbacks

None

## Reference

- Bags of Cells (BoC): https://docs.ton.org/develop/data-formats/cell-boc#packing-a-bag-of-cells
- [OTP-002](/ref/evolution/otp-002): Contract ABI



================================================
FILE: docs/src/content/docs/ref/evolution/overview.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/evolution/overview.mdx
================================================
---
title: Evolution overview
description: "The Evolution sub-section contains all standards that are defined by the Tact Foundation and are used in the evolution process of the Tact and TON ecosystem."
sidebar:
  label: Overview
  order: 0
---

import { LinkCard, CardGrid } from '@astrojs/starlight/components';

This sub-section contains all standards defined by the Tact Foundation that are used in the evolution process of the Tact and TON ecosystem. Additionally, it features TEPs (TON Enhancement Proposals) and the up-to-date changelog of Tact updates.

## Open Tact Proposals (OTPs)

<CardGrid>
  <LinkCard
    title="OTP-001"
    href="/ref/evolution/otp-001"
  />
  <LinkCard
    title="OTP-002"
    href="/ref/evolution/otp-002"
  />
  <LinkCard
    title="OTP-003"
    href="/ref/evolution/otp-003"
  />
  <LinkCard
    title="OTP-004"
    href="/ref/evolution/otp-004"
  />
  <LinkCard
    title="OTP-005"
    href="/ref/evolution/otp-005"
  />
  <LinkCard
    title="OTP-006"
    href="/ref/evolution/otp-006"
  />
</CardGrid>

## TON Enhancement Protocols (TEPs)

The main goal of TON Enhancement Proposals is to provide a convenient and formal way to propose changes to TON Blockchain and standardize interactions between different parts of the ecosystem. Proposal management is done using GitHub pull requests; the process is formally described in [TEP-1](https://github.com/ton-blockchain/TEPs/blob/master/text/0001-tep-lifecycle.md).

List of [merged TEPs](https://github.com/ton-blockchain/TEPs#merged-teps).

## Changelog

All notable changes to the main Tact repository are documented in the [CHANGELOG.md](https://github.com/tact-lang/tact/blob/main/dev-docs/CHANGELOG.md) and [CHANGELOG-DOCS.md](https://github.com/tact-lang/tact/blob/main/dev-docs/CHANGELOG-DOCS.md).



================================================
FILE: docs/src/content/docs/ref/index.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/index.mdx
================================================
---
title: Reference overview
description: "Reference section — a place for discovering Tact's standard library, grammar specification, and evolution process"
---

import { LinkCard, CardGrid, Steps } from '@astrojs/starlight/components';

Welcome to the **Reference** section of the Tact documentation — a place for discovering Tact's standard library, grammar specification, and evolution process.

Here are its main contents:

<Steps>

1. #### Core library

   [Core library](/ref/core-base) gives a comprehensive list of auto-included functions, traits, and other constructs with examples of their usage.

   <CardGrid>
     <LinkCard
       title="Go to the Core library"
       href="/ref/core-base"
     />
   </CardGrid>

2. #### Standard libraries

   The [Standard libraries](/ref/standard-libraries) subsection explains how to use the bundled libraries and lists all their contents with examples of their usage.
   
   <CardGrid>
     <LinkCard
       title="Go to Standard libraries"
       href="/ref/standard-libraries"
     />
   </CardGrid>

3. #### Specification

   The [Specification](/ref/spec) page is aimed at more experienced programmers but can still be very handy for quickly grasping all possible syntax in the language.
   
   <CardGrid>
     <LinkCard
       title="Go to the Specification"
       href="/ref/spec"
     />
   </CardGrid>

4. #### Evolution

   Finally, the [Evolution](/ref/evolution/overview) subsection gives insight into important decisions about language semantics, Tact's future, and links to the up-to-date changelog of Tact updates.
   
   <CardGrid>
     <LinkCard
       title="Go to the Evolution"
       href="/ref/evolution/overview"
     />
   </CardGrid>

</Steps>



================================================
FILE: docs/src/content/docs/ref/spec.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/spec.mdx
================================================
---
title: Tact Specification
description: "The Tact grammar used in its compiler is defined using the .peggy grammars, based on Parsing Expression Grammars (PEGs). PEGs provide a formal method for describing syntax, similar to regular expressions and context-free grammars."
pagefind: false  # hide the page from the search index
---

:::danger[Not implemented]
  This page is a stub and needs to be implemented as per [#76](https://github.com/tact-lang/tact-docs/issues/76).
:::



================================================
FILE: docs/src/content/docs/ref/standard-libraries.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/standard-libraries.mdx
================================================
---
title: Standard libraries overview
description: "Some libraries come bundled with the Tact compiler but aren't automatically included in your project until explicitly imported."
prev:
  link: /ref/core-advanced
  label: Advanced
---

Some libraries (also referred to as standard libraries or stdlibs) come bundled with the Tact compiler but aren't automatically included in your project until explicitly imported.

To import any standard library, use the [`import{:tact}` keyword](/book/import) followed by the name of that library in a [string][p], like so:

```tact
// This would include everything from @stdlib/deploy into your codebase:
import "@stdlib/deploy";
```

## List of standard libraries: {#list}

Library                  | Description                                                      | Commonly used APIs
:----------------------- | :--------------------------------------------------------------- | :-----------------
[`@stdlib/config`][1]    | Retrieval of config and elector addresses.                       | [`getConfigAddress(){:tact}`][gca], [`getElectorAddress(){:tact}`][gea]
[`@stdlib/content`][2]   | Encoding off-chain link [strings][p] into a [`Cell{:tact}`][cell]. | [`createOffchainContent(){:tact}`][coff]
[`@stdlib/deploy`][3]    | Unified mechanism for deployments.                               | **Deprecated**: [`Deployable{:tact}`][dep], [`FactoryDeployable{:tact}`][fcd]
[`@stdlib/dns`][4]       | Resolution of [DNS][dns] names.                                  | [`DNSResolver{:tact}`][dnsr], [`dnsInternalVerify(){:tact}`][dnsi]
[`@stdlib/ownable`][5]   | Traits for ownership management.                                 | [`Ownable{:tact}`][own], [`OwnableTransferable{:tact}`][ownt]
[`@stdlib/stoppable`][6] | Traits that allow contracts to be stopped. Requires [@stdlib/ownable][5]. | [`Stoppable{:tact}`][stp], [`Resumable{:tact}`][res]

[1]: /ref/stdlib-config
[gca]: /ref/stdlib-config#getconfigaddress
[gea]: /ref/stdlib-config#getelectoraddress

[2]: /ref/stdlib-content
[coff]: /ref/stdlib-content#createoffchaincontent

[3]: /ref/stdlib-deploy
[dep]: /ref/stdlib-deploy#deployable
[fcd]: /ref/stdlib-deploy#factorydeployable

[4]: /ref/stdlib-dns
[dnsr]: /ref/stdlib-dns#dnsresolver
[dnsi]: /ref/stdlib-dns#dnsinternalverify

[5]: /ref/stdlib-ownable
[own]: /ref/stdlib-ownable#ownable
[ownt]: /ref/stdlib-ownable#ownabletransferable

[6]: /ref/stdlib-stoppable
[stp]: /ref/stdlib-stoppable#stoppable
[res]: /ref/stdlib-stoppable#resumable

[p]: /book/types#primitive-types
[cell]: /book/cells#cells
[dns]: https://docs.ton.org/participate/web3/dns



================================================
FILE: docs/src/content/docs/ref/stdlib-config.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/stdlib-config.mdx
================================================
---
title: "@stdlib/config"
description: "Provides functions for config and elector address retrieval"
---

Provides functions for config and elector address retrieval.

To use this library, import `@stdlib/config`:

```tact
import "@stdlib/config";
```

## Functions

### getConfigAddress

```tact
fun getConfigAddress(): Address;
```

Retrieves config parameter $0$ as an [`Address{:tact}`][p].

Source code:

```tact
fun getConfigAddress(): Address {
    let cell: Cell = getConfigParam(0)!!;
    let sc: Slice = cell.beginParse();
    return newAddress(-1, sc.loadUint(256));
}
```

### getElectorAddress

```tact
fun getElectorAddress(): Address;
```

Retrieves config parameter $1$ as an [`Address{:tact}`][p].

Source code:

```tact
fun getElectorAddress(): Address {
    let cell: Cell = getConfigParam(1)!!;
    let sc: Slice = cell.beginParse();
    return newAddress(-1, sc.loadUint(256));
}
```

## Sources

* [config.tact](https://github.com/tact-lang/tact/blob/61541b7783098e1af669faccd7d2334c10981c72/stdlib/libs/config.tact)

[p]: /book/types#primitive-types



================================================
FILE: docs/src/content/docs/ref/stdlib-content.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/stdlib-content.mdx
================================================
---
title: "@stdlib/content"
description: "Provides a function for encoding an off-chain link from a String to a Cell"
---

Provides a function for encoding an off-chain link from a [`String{:tact}`][p] to a [`Cell{:tact}`][cell].

To use this library, import `@stdlib/content`:

```tact
import "@stdlib/content";
```

## Functions

### createOffchainContent

```tact
fun createOffchainContent(link: String): Cell;
```

Encodes an off-chain `link` from a [`String{:tact}`][p] to a [`Cell{:tact}`][cell].

Source code:

```tact
fun createOffchainContent(link: String): Cell {
    let builder: StringBuilder = beginStringFromBuilder(beginCell().storeUint(0x01, 8));
    builder.append(link);
    return builder.toCell();
}
```

## Sources

* [content.tact](https://github.com/tact-lang/tact/blob/61541b7783098e1af669faccd7d2334c10981c72/stdlib/libs/content.tact)

[p]: /book/types#primitive-types
[cell]: /book/cells#cells



================================================
FILE: docs/src/content/docs/ref/stdlib-deploy.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/stdlib-deploy.mdx
================================================
---
title: "@stdlib/deploy"
description: "Provides unified mechanisms for deployments"
---

import { Badge } from '@astrojs/starlight/components';

Provides unified mechanisms for deployments.

To use this library, import `@stdlib/deploy`:

```tact
import "@stdlib/deploy";
```

## Messages

### Deploy

Message struct used in a receiver of the **deprecated** [`Deployable{:tact}`](#deployable) trait.

```tact
message Deploy {
    /// Unique identifier for tracking transactions across multiple contracts.
    queryId: Int as uint64;
}
```

### DeployOk

Forwarded message struct used in **deprecated** [`Deployable{:tact}`](#deployable) and [`FactoryDeployable{:tact}`](#factorydeployable) traits.

```tact
message DeployOk {
    /// Unique identifier for tracking transactions across multiple contracts.
    queryId: Int as uint64;
}
```

### FactoryDeploy

Message struct used in a receiver of the **deprecated** [`FactoryDeployable{:tact}`](#factorydeployable) trait.

```tact
message FactoryDeploy {
    /// Unique identifier for tracking transactions across multiple contracts.
    queryId: Int as uint64;

    /// Address to forward `DeployOk` message to.
    cashback: Address;
}
```

## Traits

### Deployable

<Badge text="Deprecated since Tact 1.6" variant="tip" size="medium"/><p/>

The trait `Deployable{:tact}` provides a unified mechanism for deployments by implementing a simple receiver for the [`Deploy{:tact}`](#deploy) message.

All contracts are deployed by sending them a message. While any message can be used for this purpose, you can use the special [`Deploy{:tact}`](#deploy) message.

This message has a single field, `queryId`, provided by the deployer and is usually set to zero. If the deployment succeeds, the contract will reply with a [`DeployOk{:tact}`](#deployok) message and echo the same `queryId` in the response.

Beware that the receiver handling the `Deploy{:tact}` message sends the `DeployOk{:tact}` reply using the [`self.reply(){:tact}`](/ref/core-base#self-reply) function, which returns all excessive funds from the incoming message back to the sender. That is, contracts deployed using the `Deployable{:tact}` trait have a balance of 0 Toncoin after the deployment is completed.

Source code:

```tact
trait Deployable {
    receive(deploy: Deploy) {
        self.notify(DeployOk { queryId: deploy.queryId }.toCell());
    }
}
```

Usage example:

```tact /Deployable/
import "@stdlib/deploy";

contract ExampleContract with Deployable {
    // Now, this contract has a receiver for the Deploy message
}
```

Unless you need the `queryId`, use a `null` message body receiver instead of this trait.

```tact
contract ExampleContract {
    // Forwards the remaining value in the
    // incoming message back to the sender
    receive() { cashback(sender()) }
}
```

### FactoryDeployable

<Badge text="Deprecated since Tact 1.6" variant="tip" size="medium"/><p/>

The trait `FactoryDeployable{:tact}` provides a convenient unified mechanism for chained deployments.

Source code:

```tact
trait FactoryDeployable {
    receive(deploy: FactoryDeploy) {
        self.forward(deploy.cashback, DeployOk{queryId: deploy.queryId}.toCell(), false, null);
    }
}
```

Usage example:

```tact /FactoryDeployable/
import "@stdlib/deploy";

contract ExampleContract with FactoryDeployable {
    // Now, this contract has a receiver for the FactoryDeploy message
}
```

Unless you need the `queryId`, use a `null` message body receiver instead of this trait.

```tact
contract ExampleContract {
    // Forwards the remaining value in the
    // incoming message back to the sender
    receive() { cashback(sender()) }
}
```

## Sources

* [deploy.tact](https://github.com/tact-lang/tact/blob/61541b7783098e1af669faccd7d2334c10981c72/stdlib/libs/deploy.tact)



================================================
FILE: docs/src/content/docs/ref/stdlib-dns.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/stdlib-dns.mdx
================================================
---
title: "@stdlib/dns"
description: "Provides means for resolving DNS names on TON"
---

Provides means for resolving [DNS](https://docs.ton.org/participate/web3/dns) names.

To use this library, import `@stdlib/dns`:

```tact
import "@stdlib/dns";
```

## Structures

### DNSResolveResult

```tact
struct DNSResolveResult {
    prefix: Int;
    record: Cell?;
}
```

## Functions

### dnsStringToInternal

```tact
@name(dns_string_to_internal)
native dnsStringToInternal(str: String): Slice?;
```

Converts a DNS string to a [`Slice{:tact}`][slice] or [`null{:tact}`](/book/optionals) if conversion is impossible.

Source code (FunC): [dns.fc#L1](https://github.com/tact-lang/tact/blob/e69c7fc99dc9be3fa5ff984456c03ffe8fed3677/stdlib/libs/dns.fc#L1)

### dnsInternalNormalize

```tact
@name(dns_internal_normalize)
native dnsInternalNormalize(src: Slice): Slice;
```

Normalizes the internal DNS representation of the [`Slice{:tact}`][slice]. The provided [`Slice{:tact}`][slice] must not have any references; otherwise, an exception with [exit code 134](/book/exit-codes#134) will be thrown: `Invalid argument`.

Source code (FunC): [dns.fc#L125](https://github.com/tact-lang/tact/blob/e69c7fc99dc9be3fa5ff984456c03ffe8fed3677/stdlib/libs/dns.fc#L125)

### dnsInternalVerify

```tact
@name(dns_internal_verify)
native dnsInternalVerify(subdomain: Slice): Bool;
```

Verifies the internal DNS representation of the subdomain [`Slice{:tact}`][slice].

Source code (FunC): [dns.fc#L81](https://github.com/tact-lang/tact/blob/e69c7fc99dc9be3fa5ff984456c03ffe8fed3677/stdlib/libs/dns.fc#L81)

### dnsExtractTopDomainLength

```tact
fun dnsExtractTopDomainLength(subdomain: Slice): Int;
```

Calculates the length of the top domain in the `subdomain` [`Slice{:tact}`][slice].

Source code:

```tact
fun dnsExtractTopDomainLength(subdomain: Slice): Int {
    let i: Int = 0;
    let needBreak: Bool = false;
    do {
        let char: Int = subdomain.loadUint(8); // We do not check domain.length because it MUST contain a \0 character
        needBreak = char == 0;
        if (!needBreak) {
            i += 8;
        }
    } until (needBreak);
    require(i != 0, "Invalid DNS name");
    return i;
}
```

### dnsExtractTopDomain

```tact
fun dnsExtractTopDomain(subdomain: Slice): Slice;
```

Extracts the top domain from a `subdomain` [`Slice{:tact}`][slice].

Source code:

```tact
fun dnsExtractTopDomain(subdomain: Slice): Slice {
    let len: Int = dnsExtractTopDomainLength(subdomain);
    return subdomain.loadBits(len);
}
```

### dnsResolveNext

```tact
fun dnsResolveNext(address: Address): Cell;
```

Resolves an `address` [`Address{:tact}`][p] into a [`Cell{:tact}`][cell].

Source code:

```tact
fun dnsResolveNext(address: Address): Cell {
    return beginCell()
        .storeUint(0xba93, 16)
        .storeAddress(address)
        .endCell();
}
```

### dnsResolveWallet

```tact
fun dnsResolveWallet(address: Address): Cell;
```

Resolves a wallet `address` [`Address{:tact}`][p] into a [`Cell{:tact}`][cell].

Source code:

```tact
fun dnsResolveWallet(address: Address): Cell {
    return beginCell()
        .storeUint(0x9fd3, 16)
        .storeAddress(address)
        .storeUint(0, 8)
        .endCell();
}
```

## Traits

### DNSResolver

The trait `DNSResolver` provides two helper functions for DNS resolution:

1. A [getter function](/book/functions#get) `dnsresolve(){:tact}`, which corresponds to its [FunC variant](https://docs.ton.org/develop/howto/subresolvers#dnsresolve-code).
2. A virtual function `doResolveDNS(){:tact}`, which creates a struct [DNSResolveResult](#dnsresolveresult) from subdomain [`Slice{:tact}`][slice] bits.

Source code:

```tact
trait DNSResolver {
    get fun dnsresolve(subdomain: Slice, category: Int): DNSResolveResult {
        // Normalize
        let delta: Int = 0;
        if (subdomain.preloadUint(8) == 0) {
            subdomain.loadUint(8); // Skip first byte
            delta += 8;
        }

        // Check correctness
        require(dnsInternalVerify(subdomain), "Invalid DNS name");

        // Resolve
        let res: DNSResolveResult = self.doResolveDNS(subdomain, category);
        return DNSResolveResult { prefix: res.prefix + delta, record: res.record };
    }
    virtual fun doResolveDNS(subdomain: Slice, category: Int): DNSResolveResult {
        return DNSResolveResult { prefix: subdomain.bits(), record: null };
    }
}
```

Usage example:

```tact
import "@stdlib/dns";

contract ExampleContract with DNSResolver {
    // Now, this contract has:
    // 1. A dnsresolve getter function.
    // 2. A doResolveDNS virtual function.
}
```

## Sources

* [dns.tact](https://github.com/tact-lang/tact/blob/61541b7783098e1af669faccd7d2334c10981c72/stdlib/libs/dns.tact)
* [dns.fc](https://github.com/tact-lang/tact/blob/e69c7fc99dc9be3fa5ff984456c03ffe8fed3677/stdlib/libs/dns.fc)

[p]: /book/types#primitive-types
[cell]: /book/cells#cells
[slice]: /book/cells#slices



================================================
FILE: docs/src/content/docs/ref/stdlib-ownable.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/stdlib-ownable.mdx
================================================
---
title: "@stdlib/ownable"
description: "Provides traits for ownable contracts, which are commonly required by other traits."
---

Provides [traits](/book/types#composite-types) for ownable contracts. These traits are commonly required by other traits.

To use this library, import `@stdlib/ownable`:

```tact
import "@stdlib/ownable";
```

## Messages

### ChangeOwner

```tact
message ChangeOwner {
    queryId: Int as uint64;
    newOwner: Address;
}
```

### ChangeOwnerOk

```tact
message ChangeOwnerOk {
    queryId: Int as uint64;
    newOwner: Address;
}
```

## Traits

### Ownable

The [trait](/book/types#composite-types) `Ownable{:tact}` declares an owner (non-editable) of a [contract](/book/contracts) and provides a helper function `requireOwner(){:tact}`, which checks that a message was sent by the owner.

This [trait](/book/types#composite-types) requires a field `owner: Address{:tact}` to be declared and exposes a [getter function](/book/functions#get) `owner(){:tact}`, which reads it from the [contract](/book/contracts).

Source code:

```tact
@interface("org.ton.ownable")
trait Ownable {
    owner: Address;

    fun requireOwner() {
        throwUnless(TactExitCodeAccessDenied, sender() == self.owner);
    }

    get fun owner(): Address {
        return self.owner;
    }
}
```

Usage example:

```tact /Ownable/
import "@stdlib/ownable";

contract ExampleContract with Ownable {
    owner: Address;

    init(owner: Address) {
        self.owner = owner;
    }
}
```

### OwnableTransferable

`OwnableTransferable{:tact}` is an extension of [`Ownable{:tact}`](#ownable) that allows transferring ownership of a contract to another address. It provides a secure handler for the [message struct](/book/structs-and-messages#messages) [`ChangeOwner{:tact}`](#changeowner), which can only be processed when sent by the current owner.

If the ownership transfer request succeeds, the contract will reply with a [`ChangeOwnerOk{:tact}`](#changeownerok) [Message](/book/structs-and-messages#messages).

Source code:

```tact
@interface("org.ton.ownable.transferable.v2")
trait OwnableTransferable with Ownable {
    owner: Address;

    receive(msg: ChangeOwner) {
        // Check if the sender is the owner
        self.requireOwner();

        // Update owner
        self.owner = msg.newOwner;

        // Reply result
        self.reply(ChangeOwnerOk { queryId: msg.queryId, newOwner: msg.newOwner }.toCell());
    }
}
```

Usage example:

```tact /OwnableTransferable/
import "@stdlib/ownable";

contract ExampleContract with OwnableTransferable {
    owner: Address;

    init(owner: Address) {
        self.owner = owner;
    }
}
```

## Sources

* [ownable.tact](https://github.com/tact-lang/tact/blob/61541b7783098e1af669faccd7d2334c10981c72/stdlib/libs/ownable.tact)



================================================
FILE: docs/src/content/docs/ref/stdlib-stoppable.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/ref/stdlib-stoppable.mdx
================================================
---
title: "@stdlib/stoppable"
description: "Provides traits that allow stopping a contract, which is useful for emergency or maintenance modes"
---

Provides [traits](/book/types#composite-types) that allow stopping a [contract](/book/contracts). Useful for emergency or maintenance modes. Requires an [`Ownable{:tact}`](/ref/stdlib-ownable#ownable) trait from [`@stdlib/ownable`](/ref/stdlib-ownable). This trait manages a single flag `stopped` in the contract, and handling the stopped state must be done in the contract itself.

To use this library, import `@stdlib/stoppable`:

```tact
import "@stdlib/stoppable"; // this would automatically import @stdlib/ownable too!
```

## Traits

### Stoppable

[Trait](/book/types#composite-types) `Stoppable{:tact}` implements a receiver for the [Message](/book/structs-and-messages#messages) [string](/book/types#primitive-types) "Stop" that can be sent by the owner. It implements the `stopped(){:tact}` [getter function](/book/functions#get) that returns `true{:tact}` if the contract is stopped (or `false{:tact}` otherwise) and provides private (non-getter) functions `requireNotStopped(){:tact}` and `requireStopped(){:tact}`.

Source code:

```tact
@interface("org.ton.stoppable")
trait Stoppable with Ownable {
    /// Whether the contract is stopped.
    stopped: Bool;

    /// The owner of the contract.
    owner: Address;

    /// Requires the contract to be not stopped.
    ///
    /// #### Error codes
    ///
    /// * 133 — if the contract is stopped
    ///
    fun requireNotStopped() {
        throwUnless(TactExitCodeContractStopped, !self.stopped);
    }

    /// Requires the contract to be stopped.
    fun requireStopped() {
        require(self.stopped, "Contract not stopped");
    }

    /// Receiver for the message `"Stop"` that stops the contract.
    ///
    /// Can only be called by the owner and if the contract is not stopped already.
    receive("Stop") {
        self.requireOwner();
        self.requireNotStopped();
        self.stopped = true;
        self.reply("Stopped".asComment());
    }

    /// Returns `true` if the contract is stopped (or `false` otherwise).
    get fun stopped(): Bool {
        return self.stopped;
    }
}
```

Usage example:

```tact /Stoppable/
import "@stdlib/ownable";
import "@stdlib/stoppable";

contract MyContract with Stoppable {
    owner: Address;
    stopped: Bool;

    init(owner: Address) {
        self.owner = owner;
        self.stopped = false;
    }
}
```

### Resumable

The `Resumable{:tact}` [trait](/book/types#composite-types) extends the [`Stoppable{:tact}`](#stoppable) trait and allows resuming [contract](/book/contracts) execution.

Source code:

```tact
@interface("org.ton.resumable")
trait Resumable with Stoppable {
    /// Whether the contract is stopped.
    stopped: Bool;

    /// The owner of the contract.
    owner: Address;

    /// Receiver for the message `"Resume"` that resumes the contract execution.
    ///
    /// Can only be called by the owner and if the contract is stopped.
    receive("Resume") {
        self.requireOwner();
        self.requireStopped();
        self.stopped = false;
        self.reply("Resumed".asComment());
    }
}
```

Usage example:

```tact /Resumable/
import "@stdlib/ownable";
import "@stdlib/stoppable";

contract MyContract with Resumable {
    owner: Address;
    stopped: Bool;

    init(owner: Address) {
        self.owner = owner;
        self.stopped = false;
    }
}
```

## Sources

* [stoppable.tact](https://github.com/tact-lang/tact/blob/22647aada5fdfcbc27c5d8cae6faadbfd2bf3fc1/src/stdlib/stdlib/libs/stoppable.tact)



================================================
FILE: docs/src/content/docs/zh-cn/book/bounced.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/bounced.mdx
================================================
---
title: 回退消息
description: 当一个智能合约发送消息时，如果消息的回退标志被设置为 true，那么一旦消息未被正确处理，它将回退给发送者。
---

当智能合约发送一个消息，并且标志 `bounce` 设置为 `true{:tact}` 时，这时如果消息未被正确处理，它将回退给发送者。 这在您想确保消息已正确处理时很有用，且如果消息没有被正确处理——将会回退更改。

## 注意事项

目前，在 TON 中被回退的消息在消息体中仅有 224 个可用数据位，且不包含任何引用。 这意味着您无法从被回退的消息中恢复大部分数据。 这是目前 TON 区块链的局限性，将来会得到修复。 Tact能够帮助您检查消息是否符合限制，如果不符合，它会建议为回退消息的接收者使用特殊的类型构造器`bounced<T>{:tact}`，该构造器会生成符合要求限制的一部分消息。

## 回退消息接收器 {#bounced-message-receiver}

:::caution

  目前暂不支持文本消息的回退。

:::

要接收被回退的消息，您需要定义一个 `bounced(){:tact}` [接收函数](/zh-cn/book/contracts#receiver-functions) 在你的 [智能合约](/zh-cn/book/contracts) 或者一个 [特性](/zh-cn/book/types#traits) 当中:

```tact {2-4}
contract MyContract {
    bounced(msg: bounced<MyMessage>) {
        // ...
    }
}
```

要手动处理被回退的消息，您可以使用一个回退定义，直接处理原始的 [`Slice{:tact}`](/zh-cn/book/cells#slices)。 请注意，这样的接收器将获得由您的智能合约产生的**“所有”**被回退的消息：

```tact /rawMsg: Slice/
contract MyContract {
    bounced(rawMsg: Slice) {
        // ...
    }
}
```



================================================
FILE: docs/src/content/docs/zh-cn/book/cells.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/cells.mdx
================================================
---
title: Cells、Builders 和 Slices
description: Cells、Builders 和 Slices 是 TON 区块链的底层单元
---

[Cells](#cells)、[Builders](#builders) 和 [Slices](#slices) 是 TON 区块链的底层 [primitives][p]。 TON 区块链的虚拟机 [TVM][tvm] 使用cell来表示持久存储中的所有数据结构，以及内存中的大部分数据结构。

## Cells {#cells}

`Cell{:tact}`是一种 [primitive][p] 和数据结构，它[通常](#cells-kinds)由多达 $1023$ 个连续排列的比特和多达 $4$ 个指向其他 cell 的引用(refs)组成。 循环引用在 [TVM][tvm] 中是被禁止的，因此无法通过 TVM 的机制创建循环引用。这意味着，单元（cells）可以被视为自身的 [四叉树][quadtree] 或 [有向无环图（DAG）](https://en.wikipedia.org/wiki/Directed_acyclic_graph)。 智能合约代码本身由树形结构的cell表示。

单元（Cells）和[单元原语](#cells-immutability)是以位（bit）为导向的，而非字节（byte）为导向的：[TVM][tvm] 将存储在单元中的数据视为最多 $1023$ 位的序列（字符串或流），而不是字节。 如有必要，合约可以自由使用 $21$-bit 整数字段，并将其序列化为 [TVM][tvm] cell，从而使用更少的持久存储字节来表示相同的数据。

### 种类 {#cells-kinds}

虽然 [TVM][tvm] 类型 [`Cell{:tact}`](#cells) 指的是所有cell，但存在不同的cell类型，其内存布局也各不相同。 [前面](#cells) 描述的通常被称为 _普通_ (或简单) cell--这是最简单、最常用的cell，只能包含数据。 绝大多数关于cell及其用法的描述、指南和 [参考文献](/zh-cn/ref/core-cells) 都假定是普通cell。

其他类型的cell统称为 _exotic_ cell (或特殊cell)。 它们有时会出现在 TON 区块链上的区块和其他数据结构的实际表示中。 它们的内存布局和用途与普通cell大不相同。

所有cell的种类 (或子类型) 都由 $-1$ 和 $255$之间的整数编码。 普通cell用 $-1$编码，特殊cell可用该范围内的任何其他整数编码。 奇异cell的子类型存储在其数据的前 $8$ 位，这意味着有效的奇异cell总是至少有 $8$ 个数据位。

[TVM][tvm] 目前支持以下exotic cell子类型：

- [Pruned branch cell][c-pruned]，子类型编码为 $1$ - 它们代表删除的cell子树。
- [Library reference cell][c-library]，子类型编码为 $2$ - 它们用于存储库，通常在 [masterchain](/zh-cn/book/masterchain) 上下文中使用。
- [Merkle proof cell][c-mproof]，子类型编码为 $3$ - 它们用于验证其他cell的树数据的某些部分是否属于完整树。
- [Merkle update cell][c-mupdate]，子类型编码为 $4$ - 它们总是有两个引用，对这两个引用的行为类似于[默克尔证明][mproof]。

:::note[Useful links:]

  [TON Docs 中的Pruned branch cells][c-pruned]\
  [TON Docs 中的 Merkle 证明cell][c-mproof]\
  [TON Docs 中的 Merkle 更新cell][c-mupdate]\
  [TON Docs 中的简单证明验证示例][mproof]

:::

[c-pruned]: https://docs.ton.org/develop/data-formats/exotic-cells#pruned-branch
[c-library]: https://docs.ton.org/develop/data-formats/library-cells
[c-mproof]: https://docs.ton.org/develop/data-formats/exotic-cells#merkle-proof
[c-mupdate]: https://docs.ton.org/develop/data-formats/exotic-cells#merkle-update
[mproof]: https://docs.ton.org/develop/data-formats/exotic-cells#simple-proof-verifying-example

### Levels {#cells-levels}

作为 [四叉树][quadtree]，每个单元格都有一个名为 _level_ 的属性，它由 $0$ 和 $3$之间的整数表示。 [普通](#cells-kinds) cell的级别总是等于其所有引用级别的最大值。 也就是说，没有引用的普通 cell 的层级为 $0$。

[Exotic](#cells-kinds) cell有不同的规则来决定它们的层级，这些规则在[TON Docs 的本页](https://docs.ton.org/develop/data-formats/exotic-cells)上有描述。

### 序列化 {#cells-serialization}

在通过网络传输 cell 或在磁盘上存储 cell 之前，必须对其进行序列化。 有几种常用格式，如[标准 `Cell{:tact}` 表示法](#cells-representation)和 [BoC](#cells-boc)。

#### 标准表示法 {#cells-representation}

标准 [`Cell{:tact}`](#cells) 表示法是 [tvm.pdf](https://docs.ton.org/tvm.pdf) 中首次描述的 cells 通用序列化格式。 它的算法以八进制（字节）序列表示cell，首先将称为描述符的第一个 $2$ 字节序列化：

- _引用描述符_（Refs descriptor）根据以下公式计算：$r + 8 _ k + 32 _ l$，其中 $r$ 是 cell 中包含的引用数量（介于 $0$ 和 $4$ 之间），$k$ 是 cell 类型的标志（$0$ 表示[普通](#cells-kinds)，$1$ 表示[特殊](#cells-kinds)），$l$ 是
  cell 的[层级](#cells-levels)（介于 $0$ 和 $3$ 之间）。
- _位描述符_（Bits descriptor）根据以下公式计算：$\lfloor\frac{b}{8}\rfloor + \lceil\frac{b}{8}\rceil$，其中 $b$ 是 cell 中的位数（介于 $0$ 和 $1023$ 之间）。

然后，cell 本身的数据位被序列化为 $\lceil\frac{b}{8}\rceil$ $8$-bit octets（字节）。 如果 $b$ 不是 8 的倍数，则在数据位上附加一个二进制 $1$ 和最多六个二进制 $0$s。

接下来， $2$ 字节存储了引用的深度，即Cell树根（当前Cell）和最深引用（包括它）之间的cells数。 例如，如果一个cell只包含一个引用而没有其他引用，则其深度为 $1$，而被引用cell的深度为 $0$。

最后，为每个参考cell存储其标准表示的 [SHA-256][sha-2] 哈希值，每个参考cell占用 $32$ 字节，并递归重复上述算法。  请注意，不允许循环引用cell，因此递归总是以定义明确的方式结束。

如果我们要计算这个cell的标准表示的哈希值，就需要将上述步骤中的所有字节连接在一起，然后使用 [SHA-256][sha-2] 哈希值进行散列。 这是[TVM][tvm]的[`HASHCU`和`HASHSU`指令](https://docs.ton.org/learn/tvm-instructions/instructions)以及 Tact 的[`Cell.hash(){:tact}`](/zh-cn/ref/core-cells#cellhash)和[`Slice.hash(){:tact}`](/zh-cn/ref/core-cells#slicehash)函数背后的算法。

#### Bag of Cells {#cells-boc}

如 [boc.tlb](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/tl/boc.tlb#L25) [TL-B schema][tlb] 所述，Bag of Cells（简称 _BoC_）是一种将cell序列化和去序列化为字节数组的格式。

在 TON Docs 中阅读有关 BoC 的更多信息：[Bag of Cells](https://docs.ton.org/develop/data-formats/cell-boc#bag-of-cells)。

:::note

  关于[`cell{:tact}`](#cells)序列化的高级信息：[Canonical `Cell{:tact}` 序列化](https://docs.ton.org/develop/research-and-development/boc)。

:::

### 不变性 (Immutability) {#cells-immutability}

cell是只读和不可变的，但 [TVM][tvm] 中有两组主要的 [ordinary](#cells-kinds) cell操作指令：

- cell创建（或序列化）指令，用于根据先前保存的值和cell构建新cell；
- cell解析（或反序列化）指令，用于提取或加载之前通过序列化指令存储到cell中的数据。

此外，还有专门针对 [exotic](#cells-kinds) cell的指令来创建这些cell并期望它们的值。 此外，[exotic](#cells-kinds) cell 有专门的指令来创建它们并预期它们的值。不过，[普通(ordinary)](#cells-kinds) cell解析指令仍可用于 [exotic](#cells-kinds) cell，在这种情况下，它们会在反序列化尝试中被自动替换为 [普通(ordinary)](#cells-kinds) cell。

所有cell操作指令都需要将 [`Cell{:tact}`](#cells) 类型的值转换为 [`Builder{:tact}`](#builders)或 [`Slice{:tact}`](#slices)类型，然后才能修改或检查这些cell。

## Builders

`Builder{:tact}` 是一种用于使用cell创建指令的cell操作[基元][p]。 它们就像cell一样不可改变，可以用以前保存的值和cell构建新的cell。 与cells不同，`Builder{:tact}`类型的值只出现在[TVM][tvm]堆栈中，不能存储在持久存储中。 举例来说，这意味着类型为 `Builder{:tact}` 的持久存储字段实际上是以cell的形式存储的。

`Builder{:tact}` 类型表示部分组成的cell，为其定义了追加整数、其他cell、引用其他cell等快速操作：

- [核心库中的 `Builder.storeUint(){:tact}`][b-2]
- [核心库中的 `Builder.storeInt(){:tact}`][b-3]
- [核心库中的 `Builder.storeBool(){:tact}`][b-4]
- [核心库中的 `Builder.storeSlice(){:tact}`][b-5]
- [核心库中的 `Builder.storeCoins(){:tact}`][b-6]
- [核心库中的 `Builder.storeAddress(){:tact}`][b-7]
- [核心库中的 `Builder.storeRef(){:tact}`][b-8]

虽然您可以使用它们来[手动构建](#cnp-manually) cell，但强烈建议使用[结构体][structs]：[使用结构体构建cell](#cnp-structs)。

## Slices {#slices}

`Slice{:tact}` 是使用cell解析指令的cell操作[基元][p]。 与cell不同，它们是可变的，可以通过序列化指令提取或加载之前存储在cell中的数据。 此外，与cell不同，`Slice{:tact}` 类型的值只出现在 [TVM][tvm] 堆栈中，不能存储在持久存储区中。 举例来说，这就意味着类型为 `Slice{:tact}` 的持久存储字段实际上是以cell的形式存储的。

`Slice{:tact}` 类型表示部分解析cell的剩余部分，或位于此类cell内并通过解析指令从中提取的值（子cell）：

- [核心库中的`Slice.loadUint(){:tact}`][s-2]
- [核心库中的`Slice.loadInt(){:tact}`][s-3]
- [核心库中的`Slice.loadBool(){:tact}`][s-4]
- [核心库中的`Slice.loadBits(){:tact}`][s-5]
- [核心库中的`Slice.loadCoins(){:tact}`][s-6]
- [核心库中的`Slice.loadAddress(){:tact}`][s-7]
- [核心库中的`Slice.loadRef(){:tact}`][s-8]

虽然您可以将它们用于cell的 [手动解析](#cnp-manually)，但强烈建议使用 [结构体][structs]：[使用结构体解析cell](#cnp-structs)。

## 序列化类型

与 [`Int{:tact}`](/zh-cn/book/integers)类型的序列化选项类似，`Cell{:tact}`、`Builder{:tact}` 和`Slice{:tact}` 在以下情况下也有不同的值编码方式：

- 作为[合约](/zh-cn/book/contracts)和[特性](/zh-cn/book/types#traits)的[存储变量](/zh-cn/book/contracts#variables)，
- 以及 [Structs](/zh-cn/book/structs and-messages#structs) 和 [Messages](/zh-cn/book/structs and-messages#messages) 的字段。

```tact {2-3}
contract SerializationExample {
    someCell: Cell as remaining;
    someSlice: Slice as bytes32;

    // Constructor function,
    // necessary for this example contract to compile
    init() {
        self.someCell = emptyCell();
        self.someSlice = beginCell().storeUint(42, 256).asSlice();
    }
}
```

### `remaining` {#serialization-remaining}

`remaining{:tact}` 序列化选项可应用于 [`Cell{:tact}`](#cells)、[`Builder{:tact}`](#builders)和 [`Slice{:tact}`](#slices)类型的值。

它通过直接存储和加载cell值而不是作为引用来影响cell值的构建和解析过程。 它通过直接存储和加载cell值而不是作为引用来影响cell值的构建和解析过程。 与 [cell操作指令](#cells-immutability) 相似，指定 `remaining{:tact}` 就像使用 [`Builder.storeSlice(){:tact}`][b-5] 和 [`Slice.loadBits(){:tact}`][s-5] 而不是 [`Builder.storeRef(){:tact}`][b-8] 和 [`Slice.loadRef(){:tact}`][s-8]，后者是默认使用的。

此外，Tact 产生的 [TL-B][tlb] 表示也会发生变化：

```tact {3-5, 8-10}
contract SerializationExample {
    // By default
    cRef: Cell;    // ^cell in TL-B
    bRef: Builder; // ^builder in TL-B
    sRef: Slice;   // ^slice in TL-B

    // With `remaining`
    cRem: Cell as remaining;    // remainder<cell> in TL-B
    bRem: Builder as remaining; // remainder<builder> in TL-B
    sRem: Slice as remaining;   // remainder<slice> in TL-B

    // Constructor function,
    // necessary for this example contract to compile
    init() {
        self.cRef = emptyCell();
        self.bRef = beginCell();
        self.sRef = emptySlice();
        self.cRem = emptyCell();
        self.bRem = beginCell();
        self.sRem = emptySlice();
    }
}
```

其中，[TL-B][tlb] 语法中的 `^cell`、`^builder` 和 `^slice` 分别表示对 [`cell{:tact}`](#cells)、[`builder{:tact}`](#builders)和 [`slice{:tact}`](#slices)值的引用、而 `cell`、`builder` 或 `slice` 的 `remainder<…>` 则表示给定值将直接存储为 `Slice{:tact}`，而不是作为引用。

现在，举一个真实世界的例子，想象一下你需要注意到智能合约中的入站 [jetton][jetton] 传输并做出反应。 相应的 [信息][消息] 结构如下： 相应的 [信息][消息] 结构如下：

```tact /remaining/
message(0x7362d09c) JettonTransferNotification {
    queryId: Int as uint64;             // arbitrary request number to prevent replay attacks
    amount: Int as coins;               // amount of jettons transferred
    sender: Address;                    // address of the sender of the jettons
    forwardPayload: Slice as remaining; // optional custom payload
}
```

合同中的 [receiver][recv] 应该是这样的：

```tact
receive(msg: JettonTransferNotification) {
    // ... you do you ...
}
```

收到 [jetton][jetton] 传输通知消息后，其cell体会被转换为 [`Slice{:tact}`](#slices)，然后解析为 `JettonTransferNotification{:tact}` [消息][message]。在此过程结束时，`forwardPayload` 将包含原始信息cell的所有剩余数据。 在此过程结束时，`forwardPayload` 将包含原始信息cell的所有剩余数据。

在这里，将 `forwardPayload: Slice as remaining` 字段放在 `JettonTransferNotification{:tact}` [消息][message]中的任何其他位置都不会违反 [jetton][jetton] 标准。 这是因为 Tact 禁止在[Structs][结构]和[Messages][消息]的最后一个字段之外的任何字段中使用 `as remaining{:tact}`，以防止滥用合同存储空间并减少 gas 消耗。

:::note

  注意，通过 `as remaining{:tact}` 序列化的cell不能是 [可选](/zh-cn/book/optionals)。  也就是说，指定类似 `Cell? as remaining{:tact}`, `Builder? as remaining{:tact}` 或 `Slice? as remaining{:tact}` 会导致编译错误。

  另外请注意，将 `Cell{:tact}` 指定为[map](/zh-cn/book/maps) 值类型的 `remaining{:tact}` 会被视为错误，无法编译。

:::

### `bytes32` {#serialization-bytes32}

:::note

  由 [#94](https://github.com/tact-lang/tact-docs/issues/94) 解决。

:::

### `bytes64` {#serialization-bytes64}

:::note

  由 [#94](https://github.com/tact-lang/tact-docs/issues/94) 解决。

:::

## 操作

### 构建和解析 {#operations-cnp}

在 Tact 中，至少有两种构建和解析cell的方法：

- [手动](#cnp-manually)，其中涉及积极使用[`Builder{:tact}`](#builders)、[`Slice{:tact}`](#slices)和[相关方法](/zh-cn/ref/core-cells)。
- [使用结构体](#cnp-structs)，这是一种值得推荐且更加方便的方法。

#### 手动 {#cnp-manually}

| 通过 `Builder{:tact}`进行建造                | 通过 `slice{:tact}` 进行解析                |
| :------------------------------------- | :------------------------------------ |
| [`beginCell(){:tact}`][b-1]            | [`Cell.beginParse(){:tact}`][s-1]     |
| [`.storeUint(42, 7){:tact}`][b-2]      | [`Slice.loadUint(7){:tact}`][s-2]     |
| [`.storeInt(42, 7){:tact}`][b-3]       | [`Slice.loadInt(7){:tact}`][s-3]      |
| [`.storeBool(true){:tact}`][b-4]       | [`Slice.loadBool(true){:tact}`][s-4]  |
| [`.storeSlice(slice){:tact}`][b-5]     | [`Slice.loadBits(slice){:tact}`][s-5] |
| [`.storeCoins(42){:tact}`][b-6]        | [`Slice.loadCoins(42){:tact}`][s-6]   |
| [`.storeAddress(address){:tact}`][b-7] | [`Slice.loadAddress(){:tact}`][s-7]   |
| [`.storeRef(cell){:tact}`][b-8]        | [`Slice.loadRef(){:tact}`][s-8]       |
| [`.endCell(){:tact}`][b-9]             | [`Slice.endParse(){:tact}`][s-9]      |

[b-1]: /zh-cn/ref/core-cells#begincell
[b-2]: /zh-cn/ref/core-cells#builderstoreuint
[b-3]: /zh-cn/ref/core-cells#builderstoreint
[b-4]: /zh-cn/ref/core-cells#builderstorebool
[b-5]: /zh-cn/ref/core-cells#builderstoreslice
[b-6]: /zh-cn/ref/core-cells#builderstorecoins
[b-7]: /zh-cn/ref/core-cells#builderstoreaddress
[b-8]: /zh-cn/ref/core-cells#builderstoreref
[b-9]: /zh-cn/ref/core-cells#builderendcell
[s-1]: /zh-cn/ref/core-cells#cellbeginparse
[s-2]: /zh-cn/ref/core-cells#sliceloaduint
[s-3]: /zh-cn/ref/core-cells#sliceloadint
[s-4]: /zh-cn/ref/core-cells#sliceloadbool
[s-5]: /zh-cn/ref/core-cells#sliceloadbits
[s-6]: /zh-cn/ref/core-cells#sliceloadcoins
[s-7]: /zh-cn/ref/core-cells#sliceloadaddress
[s-8]: /zh-cn/ref/core-cells#sliceloadref
[s-9]: /zh-cn/ref/core-cells#sliceendparse

#### Using Structs {#cnp-structs}

[结构][struct]和[消息][messages]几乎就是活生生的[TL-B 模式][tlb]。 也就是说，它们本质上是用可维护、可验证和用户友好的 Tact 代码表达的[TL-B 模式][tlb]。 也就是说，它们本质上是用可维护、可验证和用户友好的 Tact 代码表达的[TL-B 模式][tlb]。

强烈建议使用它们及其 [方法](/zh-cn/book/functions#extension-function)，如 [`Struct.toCell(){:tact}`][st-tc]和 [`Struct.fromCell(){:tact}`][st-fc]，而不是手动构造和解析cell，因为这样可以得到更多声明性和不言自明的合约。

[上文](#cnp-manually)的手动解析示例可以使用[Structs][struct]重新编写，如果愿意，还可以使用字段的描述性名称：

```tact /fromCell/ /toCell/
// First Struct
struct Showcase {
    id: Int as uint8;
    someImportantNumber: Int as int8;
    isThatCool: Bool;
    payload: Slice;
    nanoToncoins: Int as coins;
    wackyTacky: Address;
    jojoRef: Adventure; // another Struct
}

// Here it is
struct Adventure {
    bizarre: Bool = true;
    time: Bool = false;
}

fun example() {
    // Basics
    let s = Showcase.fromCell(
        Showcase{
            id: 7,
            someImportantNumber: 42,
            isThatCool: true,
            payload: emptySlice(),
            nanoToncoins: 1330 + 7,
            wackyTacky: myAddress(),
            jojoRef: Adventure{ bizarre: true, time: false },
        }.toCell());
    s.isThatCool; // true
}
```

请注意，Tact 的自动布局算法是贪婪的。 请注意，Tact 的自动布局算法是贪婪的。例如，`struct Adventure{:tact}` 占用的空间很小，它不会以引用 [`Cell{:tact}`](#cells) 的形式存储，而是直接以 [`Slice{:tact}`](#slices) 的形式提供。

通过使用 [结构][struct] 和 [消息][messages]，而不是手动 [`Cell{:tact}`](#cells) 组成和解析，这些细节将被简化，在优化布局发生变化时也不会造成任何麻烦。

:::note[Useful links:]

  [Convert serialization](/zh-cn/book/func#convert-serialization)
  [核心库中的 `Struct.toCell(){:tact}` ][st-tc]\
  [核心库中的 `Struct.fromCell(){:tact}`][st-fc]\
  [核心库中的 `Struct.fromSlice(){:tact}`中][st-fs]\
  [核心库中的 `Message.toCell(){:tact}`][msg-tc]\
  [核心库中的 `Message.fromCell(){:tact}`][msg-fc]\
  [核心库中的 `Message.fromSlice(){:tact}`][msg-fs]

:::

[st-tc]: /zh-cn/ref/core-cells#structtocell
[st-fcc]: /zh-cn/ref/core-cells#structfromcell
[st-fs]: /zh-cn/ref/core-cells#structfromslice
[msg-tc]: /zh-cn/ref/core-cells#messagetocell
[msg-fc]: /zh-cn/ref/core-cells#messagefromcell
[msg-fs]: /zh-cn/ref/core-cells#messagefromslice

### 检查是否为空 {#operations-empty}

[`Cell{:tact}`](#cells)和[`Builder{:tact}`](#builders)都不能直接检查空性，需要先将它们转换为[`Slice{:tact}`](#slices)。

要检查是否有任何位，请使用[`Slice.dataEmpty(){:tact}`][s-de]。要检查是否存在引用，请使用[`Slice.refsEmpty(){:tact}`][s-re]。要同时检查这两项，请使用[`Slice.empty(){:tact}`][s-e]。 要检查是否存在引用，请使用 [`Slice.refsEmpty(){:tact}`][s-re]。 要同时检查这两个文件，请使用 [`Slice.empty(){:tact}`][s-e]。

如果[`Slice{:tact}`](#slices)不完全为空，也要抛出[exit code 9](/zh-cn/book/exit-codes#9)，请使用[`Slice.endParse(){:tact}`][s-ep]。

```tact
// Preparations
let someCell = beginCell().storeUint(42, 7).endCell();
let someBuilder = beginCell().storeRef(someCell);

// Obtaining our Slices
let slice1 = someCell.asSlice();
let slice2 = someBuilder.asSlice();

// .dataEmpty()
slice1.dataEmpty(); // false
slice2.dataEmpty(); // true

// .refsEmpty()
slice1.refsEmpty(); // true
slice2.refsEmpty(); // false

// .empty()
slice1.empty(); // false
slice2.empty(); // false

// .endParse()
try {
    slice1.endParse();
    slice2.endParse();
} catch (e) {
    e; // 9
}
```

:::note[Useful links:]

  [核心库中的 `Cell.asSlice(){:tact}`](/zh-cn/ref/core-cells#cellasslice)\
  [核心库中的 `Builder.asSlice(){:tact}`](/zh-cn/ref/core-cells#builderasslice)\
  [核心库中的 `Slice.dataEmpty(){:tact}`][s-de]\
  [核心库中的 `Slice.refsEmpty(){:tact}`][s-re]\
  [核心库中的 `Slice.empty(){:tact}`][s-e]\
  [核心库中的 `Slice.endParse(){:tact}`][s-ep]

:::

[s-de]: /zh-cn/ref/core-cells#slicedataempty
[s-re]: /zh-cn/ref/core-cells#slicerefsempty
[s-e]: /zh-cn/ref/core-cells#sliceempty
[s-ep]: /zh-cn/ref/core-cells#sliceendparse

### 检查是否相等 {#operations-equal}

不能使用二进制相等 [`=={:tact}`][bin-eq] 或不等式 [`!={:tact}`][bin-eq] 操作符直接比较 [`Builder{:tact}`](#builders) 类型的值。 但是，[`cell{:tact}`](#cells)和[`slice{:tact}`](#slices)类型的值可以。

直接比较：

```tact
let a = beginCell().storeUint(123, 8).endCell();
let aSlice = a.asSlice();

let b = beginCell().storeUint(123, 8).endCell();
let bSlice = b.asSlice();

let areCellsEqual = a == b; // true
let areCellsNotEqual = a != b; // false

let areSlicesEqual = aSlice == bSlice; // true
let areSlicesNotEqual = aSlice != bSlice; // false
```

请注意，通过 `=={:tact}` 或 `!={:tact}` 操作符进行的直接比较隐含地使用了[标准 `Cell{:tact}` 表示法](#cells-representation)的 [SHA-256](https://en.wikipedia.org/wiki/SHA-2#Hash_standard) 哈希值。

还可使用 `Cell.hash(){:tact}` 或 `Slice.hash(){:tact}` 进行显式比较：

```tact
let a = beginCell().storeUint(123, 8).endCell();
let aSlice = a.asSlice();

let b = beginCell().storeUint(123, 8).endCell();
let bSlice = b.asSlice();

let areCellsEqual = a.hash() == b.hash(); // true
let areCellsNotEqual = a.hash() != b.hash(); // false

let areSlicesEqual = aSlice.hash() == bSlice.hash(); // true
let areSlicesNotEqual = aSlice.hash() != bSlice.hash(); // false
```

:::note[Useful links:]

  [核心库中的 `Cell.hash(){:tact}`](/zh-cn/ref/core-cells#cellhash)/
  [核心库中的 `Slice.hash(){:tact}`](/zh-cn/ref/core-cells#slicehash)/
  [`=={:tact}`和`!={:tact}`][bin-eq]。

:::

[p]: /zh-cn/book/types#primitive-types
[struct]: /zh-cn/book/structs-and-messages#structs
[message]: /zh-cn/book/structs-and-messages#messages
[recv]: /zh-cn/book/contracts#receiver-functions
[tvm]: https://docs.ton.org/learn/tvm-instructions/tvm-overview
[tlb]: https://docs.ton.org/develop/data-formats/tl-b-language
[jetton]: https://docs.ton.org/develop/dapps/asset-processing/jettons
[sha-2]: https://en.wikipedia.org/wiki/SHA-2#Hash_standard
[四叉树]: https://en.wikipedia.org/wiki/Quadtree
[bin-eq]: /zh-cn/book/operators#binary-equality



================================================
FILE: docs/src/content/docs/zh-cn/book/config.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/config.mdx
================================================
---
title: 配置
description: Tact编译器的行为可以通过其配置文件自定义：
---

`tact.config.json` 是 Tact 项目的入口点。它是一个 JSON 文件，包含所有项目和编译器参数的列表。

本页列出了 [模式](#schema)中的所有配置选项。 请查看右侧的目录，以方便浏览。 请查看右侧的目录，以方便浏览。

:::note

  对该文件的唯一要求是它是一个有效的 JSON 文件，包含 [适当的字段](#schema)，因此可以任意命名。  不过，将配置文件命名为 `tact.config.json` 是所有使用 Tact 的工具都鼓励和支持的通用约定。

:::

## `$schema` {#schema}

编辑器可使用[JSON 模式](https://json-schema.org/) 文件提供自动完成和悬停提示：[configSchema.json](http://raw.githubusercontent.com/tact-lang/tact/main/src/config/configSchema.json)。

只需在配置文件顶部添加 `$schema` 字段即可：

```json title="tact.config.json" {2}
{
  "$schema": "http://raw.githubusercontent.com/tact-lang/tact/main/src/config/configSchema.json",
  "projects": []
}
```

## `项目` {#projects}

带有相应编译选项的 Tact 项目列表。 每个 `.tact` 文件都代表自己的 Tact 项目。 每个 `.tact` 文件都代表自己的 Tact 项目。

```json title="tact.config.json" {3,4}
{
  "projects": [
    { },
    { }
  ]
}
```

### `name` {#projects-name}

`name` 是项目的名称。 所有生成的文件都以此名称为前缀。

在[Blueprint][bp]中，`name`指的是合约本身的名称。

```json title="tact.config.json" {4,7}
{
  "projects": [
    {
      "name": "some_prefix"
    },
    {
      "name": "ContractUnderBlueprint"
    }
  ]
}
```

### `path` {#projects-path}

项目 Tact 文件的路径。 每个项目只能指定一个 Tact 文件。 每个项目只能指定一个 Tact 文件。

在 [Blueprint][bp]中，`path` 被`wrapper/ContractName.compile 中的`target`字段所取代。 默认情况下，或在“compilables/ContractName.compile.ts”中，如果你有 `separateCompilables`，则在 [`blueprint.config.ts\`][bp-config] 中设置的选项。

```json title="tact.config.json" {5}
{
  "projects": [
    {
      "name": "some_prefix",
      "path": "./contract.tact"
    }
  ]
}
```

### `output` {#projects-output}

`output` 是放置所有生成文件的目录路径。

在 [Blueprint][bp] 中，`output` 未被使用，并且所有生成的文件总是放在 `build/ProjectName/` 中。

```json title="tact.config.json" {6}
{
  "projects": [
    {
      "name": "some_prefix",
      "path": "./contract.tact",
      "output": "./contract_output"
    }
  ]
}
```

### `options` {#projects-options}

项目的编译选项。

在[Blueprint][bp]中，它们作为默认设置，除非在`wrappers/ContractName.compile.ts`中修改为默认设置，或者在`compilables/ContractName.compile.ts`中修改（如果您在[`blueprint.config.ts`][bp-config]中设置了`separateCompilables`选项）。

```json title="tact.config.json" {7,11}
{
  "projects": [
    {
      "name": "some_prefix",
      "path": "./contract.tact",
      "output": "./contract_output",
      "options": {}
    },
    {
      "name": "ContractUnderBlueprint",
      "options": {}
    }
  ]
}
```

#### `debug` {#options-debug}

默认为 `false{:json}`。

如果设置为`true{:json}`，则启用合约的调试输出，并允许使用[`dump(){:tact}`](/zh-cn/ref/core-debug#dump)函数，这对[调试目的](/zh-cn/book/debug)很有用。 启用此选项后，合约将报告它是在调试模式下使用 `supported_interfaces` 方法编译的。

```json title="tact.config.json" {8,14}
{
  "projects": [
    {
      "name": "some_prefix",
      "path": "./contract.tact",
      "output": "./contract_output",
      "options": {
        "debug": true
      }
    },
    {
      "name": "ContractUnderBlueprint",
      "options": {
        "debug": true
      }
    }
  ]
}
```

:::note

  更多信息，请访问专用页面：[调试](/zh-cn/book/debug)。

:::

#### `masterchain` {#options-masterchain}

默认为 `false{:json}`。

如果设置为 `true{:json}`，则启用 [masterchain](/zh-cn/book/masterchain) 支持。

```json title="tact.config.json" {8,14}
{
  "projects": [
    {
      "name": "some_prefix",
      "path": "./contract.tact",
      "output": "./contract_output",
      "options": {
        "masterchain": true
      }
    },
    {
      "name": "ContractUnderBlueprint",
      "options": {
        "masterchain": true
      }
    }
  ]
}
```

:::note

  阅读更多内容请访问专页：[主链](/zh-cn/book/masterchain)。

:::

#### `external` {#options-external}

默认为 `false{:json}`。

如果设置为 `true{:json}`，则启用对 [external](/zh-cn/book/external) 消息接收器的支持。

```json title="tact.config.json" {8,14}
{
  "projects": [
    {
      "name": "some_prefix",
      "path": "./contract.tact",
      "output": "./contract_output",
      "options": {
        "external": true
      }
    },
    {
      "name": "ContractUnderBlueprint",
      "options": {
        "external": true
      }
    }
  ]
}
```

:::note

  更多信息，请访问专用页面：[外部信息](/zh-cn/book/external)。

:::

#### `ipfsAbiGetter` {#options-ipfsabigetter}

默认为 `false{:json}`。

如果设置为 `true{:json}`，则可生成带有描述合约 ABI 的 IPFS 链接的[getter](/zh-cn/book/contracts#getter-functions)。

```json title="tact.config.json" {8,14}
{
  "projects": [
    {
      "name": "some_prefix",
      "path": "./contract.tact",
      "output": "./contract_output",
      "options": {
        "ipfsAbiGetter": true
      }
    },
    {
      "name": "ContractUnderBlueprint",
      "options": {
        "ipfsAbiGetter": true
      }
    }
  ]
}
```

:::note

  阅读更多专页: [OTP-003: Self-ABI reporting](/zh-cn/ref/evolution/otp-003)。

:::

#### `interfacesGetter` {#options-interfacesgetter}

默认为 `false{:json}`。

如果设置为 `true{:json}`，则可生成包含合约所提供接口列表的 [getter](/zh-cn/book/contracts#getter-functions)。

```json title="tact.config.json" {8,14}
{
  "projects": [
    {
      "name": "some_prefix",
      "path": "./contract.tact",
      "output": "./contract_output",
      "options": {
        "interfacesGetter": true
      }
    },
    {
      "name": "ContractUnderBlueprint",
      "options": {
        "interfacesGetter": true
      }
    }
  ]
}
```

:::note

  了解更多信息：[支持的接口](/zh-cn/book/contracts#interfaces)。

:::

#### `experimental` {#options-experimental}

将来可能会取消的试验性选项。 谨慎使用！

```json title="tact.config.json" {8,14}
{
  "projects": [
    {
      "name": "some_prefix",
      "path": "./contract.tact",
      "output": "./contract_output",
      "options": {
        "experimental": {}
      }
    },
    {
      "name": "ContractUnderBlueprint",
      "options": {
        "experimental": {}
      }
    }
  ]
}
```

##### `inline` {#experimental-inline}C

默认为 `false{:json}`。

如果设置为`true{:json}`，则启用合约中所有函数的内联。 这可以减少Gas使用，但代价是合约更大。

```json title="tact.config.json" {9,17}
{
  "projects": [
    {
      "name": "some_prefix",
      "path": "./contract.tact",
      "output": "./contract_output",
      "options": {
        "experimental": {
          "inline": true
        }
      }
    },
    {
      "name": "ContractUnderBlueprint",
      "options": {
        "experimental": {
          "inline": true
        }
      }
    }
  ]
}
```

### `mode` {#projects-mode}

项目的编译模式。 有效值为

| 值                                | 说明                                                     |
| :------------------------------- | :----------------------------------------------------- |
| `"full"{:json}`                  | (默认) 运行整个编译管道并发布FunC 代码，BoC 和各种实用文件，包括TypeScript的包装文件。 |
| `"fullWithDecompilation"{:json}` | 运行整个编译管道，如 `“full”{:json}`，并以 BoC 格式反编译生成的二进制代码。       |
| `"funcOnly"{:json}`              | 只输出中间 FunC 代码，阻止进一步编译。                                 |
| `"checkOnly"{:json}`             | 仅执行语法和类型检查，阻止进一步编译。                                    |

在 [Blueprint][bp] 中，`mode` 始终设置为`"full"{:json}`，且不可覆盖。

```json title="tact.config.json" {7,13}
{
  "projects": [
    {
      "name": "some_prefix",
      "path": "./contract.tact",
      "output": "./contract_output",
      "mode": "full"
    },
    {
      "name": "func_only",
      "path": "./contract.tact",
      "output": "./contract_output",
      "mode": "funcOnly"
    }
  ]
}
```

## Full example

```json title="tact.config.json" copy=false
{
  "$schema": "http://raw.githubusercontent.com/tact-lang/tact/main/src/config/configSchema.json",
  "projects": [
    {
      "name": "basic",
      "path": "./basic.tact",
      "output": "./basic_output",
      "mode": "full"
    },
    {
      "name": "func_only",
      "path": "./basic.tact",
      "output": "./basic_output",
      "mode": "funcOnly"
    },
    {
      "name": "debugPrefix",
      "path": "./contracts/contract.tact",
      "output": "./contracts/output",
      "options": {
        "debug": true
      }
    },
    {
      "name": "ContractUnderBlueprint",
      "options": {
        "debug": false,
        "masterchain": false,
        "external": false,
        "ipfsAbiGetter": true,
        "interfacesGetter": true,
        "experimental": {
          "inline": false
        }
      }
    }
  ]
}
```

[bp]: https://github.com/ton-org/blueprint
[bp-config]: https://github.com/ton-org/blueprint/tree/main?tab=readme-ov-file#configuration



================================================
FILE: docs/src/content/docs/zh-cn/book/constants.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/constants.mdx
================================================
---
title: 常数
description: 无法通过重新赋值更改的不可变值
---

Tact 中的常量可以比流行语言中的常量更先进一些：它们可以是虚拟的、抽象的。 智能合约通常需要实现多个特征，有时您需要在编译时配置其中的一些特征。 禁止使用trait中的构造函数，因为它们的行为不可预测。 因此，我们必须使用常量和字段来传递值。 主合约的任务是为所有特征实现数值和常量。

## 简单常数

让我们从一个简单的常数开始。 这是一个在编译时定义的值，不能更改。 您可以在顶层或合约/trait中定义常量。 让我们在顶层定义一个常量：

```tact
const MY_CONSTANT: Int = 42;
```

特征和合约也类似：

```tact
trait MyTrait {
    const MY_CONSTANT: Int = 42;
}

contract MyContract {
    const MY_CONSTANT: Int = 42;
}
```

## 虚拟常量和抽象常量 {#virtual-and-abstract-constants}

虚拟常量是可以在trait中定义但在合约中改变的常量。 当您需要在编译时配置某些特征时，它非常有用。 让我们定义一个虚拟常量和一个抽象常量： 当您需要在编译时配置某些特征时，它非常有用。 让我们定义一个虚拟常量和一个抽象常量：

```tact
trait MyTrait {
    virtual const MY_FEE: Int = ton("1.0");
}

trait MyAbstractTrait {
    abstract const MY_DEV_FEE: Int;
}
```

现在，您可以覆盖合约中的默认设置：

```tact
contract MyContract with
    MyTrait,
    MyAbstractTrait, // trailing comma is allowed
{
    override const MY_FEE: Int = ton("0.5");
    override const MY_DEV_FEE: Int = ton("1000");
}
```

这对于帮助编译器在编译时获得某些值可能非常有用，例如，您可以启用或禁用功能，而无需修改代码，也不会浪费 gas 。

```tact
trait Treasure {
    virtual const ENABLE_TIMELOCK: Bool = true;

    receive("Execute") {
        if (self.ENABLE_TIMELOCK) {
            //
            // This branch would be removed in compile time if ENABLE_TIMELOCK is false
            //
        }
    }
}

contract MyContract with Treasure {
    override const ENABLE_TIMELOCK: Bool = false;
}
```



================================================
FILE: docs/src/content/docs/zh-cn/book/contracts.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/contracts.mdx
================================================
---
title: 合约
description: Tact 中的合约类似于受欢迎的面向对象语言中的类，除了它们的实例被部署在区块链上，不能像结构和信息那样传递
---

Tact 中的合约类似于流行的面向对象语言中的类，只是它们的实例部署在区块链上，不能像 [结构和信息](/zh-cn/book/structs-and-messages) 那样被传递。

## 自引用 {#self}

合约和[trait][trait]有一个内置的[标识符](/zh-cn/book/expressions#identifiers) `self{:tact}`，用于引用它们的字段（持久状态[变量](#variables)和[常量](#constants)）和方法（[内部函数](#internal-functions)）：

```tact
contract Example {
    // persistent state variables
    foo: Int;

    init() {
        self.foo = 42; // <- referencing variable foo through self.
    }
}
```

## 结构

每份合约可包括:

- [可继承trait](#traits)
- [支持的接口](#interfaces)
- [持久状态变量](#variables)
- [构造函数 `init(){:tact}`](#init-function)
- [合约常量](#constants)
- [Getter 函数](#getter-functions)
- [Receiver 功能](#receiver-functions)
- [内部功能](#internal-functions)

### 继承trait， `with{:tact}` {#traits}

合约可以继承[traits][trait]的所有声明和定义，并覆盖它们的某些默认行为。 除此之外，每个合约和trait都隐式继承了特殊的[`BaseTrait{:tact}` trait](/zh-cn/ref/core-base)。

要继承[trait][trait]，请在合约声明中的关键字`with{:tact}`后指定其名称。 要同时继承多个性状，请在逗号分隔的列表中指定它们的名称，并在后面加上逗号。

```tact /with/
trait InheritMe {}
trait InheritMeToo {}

// A contract inheriting a single trait
contract Single with InheritMe {}

// A contract inheriting multiple traits
contract Plural with
    InheritMe,
    InheritMeToo, // trailing comma is allowed
{}
```

由于[traits][trait]不允许有[`init(){:tact}`函数](#init-function)，因此继承了声明了任何[持久状态变量](#variables)的trait的合约必须通过提供自己的[`init(){:tact}`函数](#init-function)来初始化这些变量。

```tact
trait Supe { omelander: Bool }

contract Vot with Supe {
    init() {
        self.omelander = true;
    }
}
```

如果在trait中声明或定义了内部函数和常量，则可将其标记为[虚拟或抽象](/zh-cn/book/functions#virtual-and-abstract-functions)，并在从trait继承的合约中重写。

### 支持的接口，`@interface(…)` {#interfaces}

如果不查看源代码，就很难弄清一个合约是做什么的，有哪些[receiver](#receiver-functions)和[getter](#getter-functions)。 有时，无法获得或无法访问源代码，剩下的办法就是尝试拆解合约，并以这种方式对其进行回推，这是一种非常混乱且容易出错的方法，其收益会递减，而且没有真正的可重复性。

为了解决这个问题，创建了 [OTP-001：支持的接口](/zh-cn/ref/evolution/otp-001)。 据此，Tact 合约[可以报告](/zh-cn/book/config#options-interfacesgetter) 支持的接口列表，作为特殊的 `supported_interfaces` [getter](#getter-functions) 的返回值。 该getter可以通过任何TON区块链浏览器在链下访问——只需指定`supported_interfaces`作为执行的方法，返回一个十六进制值的列表。

这些十六进制值被截断为受支持接口的原始[`String{:tact}`][p]值的[SHA-256](https://en.wikipedia.org/wiki/SHA-2#Hash_standard)哈希值的前 128 位。 此列表中的第一个值**必须**等于[十六进制表示法](/zh-cn/book/integers#hexadecimal)中的$\mathrm{0x5cec3d5d2cae7b1e84ec39d64a851b66}$，这是`"org.ton.introspection.v0"{:tact}`的SHA-256 Hash的前半部分。 如果第一个值是错误的，就必须停止回推合约，因为它不符合 [支持的接口](/zh-cn/ref/evolution/otp-001) 建议。

要声明支持某个接口，可在 contract 和[trait][trait]声明之前添加一个或多个`@interface("…"){:tact}`属性：

```tact
@interface("His name is")
@interface("John")
contract SeeNah with Misc {
    // ...
}

@interface("name_of_your_org - miscellaneous")
trait Misc {
    // ...
}
```

Tact 有一小套在特定条件下提供的接口：

- `"org.ton.abi.ipfs.v0"{:tact}`，根据 [OTP-003: Self-ABI Reporting](/zh-cn/ref/evolution/otp-003) - 通过 [`ipfsAbiGetter`](/zh-cn/book/config#options-ipfsabigetter)配置属性选择加入
- `"org.ton.deploy.lazy.v0"{:tact}`，符合[OTP-005：参数可寻址合约](/zh-cn/ref/evolution/otp-005)
- `"org.ton.debug.v0"{:tact}`，但只有在启用了[调试模式](/zh-cn/book/debug#debug-mode)时才会这样做
- `"org.ton.chain.any.v0"{:tact}` 如果启用了 [masterchain](/zh-cn/book/masterchain) 支持，否则为 `"org.ton.chain.workchain.v0"{:tact}`

[标准库](/zh-cn/ref/standard-libraries)中的一些[traits][trait]也定义了它们的接口：

- [`Ownable{:tact}`](/zh-cn/ref/stdlib-ownable#ownable) trait 指定`"org.ton.ownable"{:tact}`
- [`OwnableTransferable{:tact}`](/zh-cn/ref/stdlib-ownable#ownabletransferable) trait 指定`"org.ton.ownable.transferable.v2"{:tact}`
- [`Stoppable{:tact}`](/zh-cn/ref/stdlib-stoppable#stoppable) trait 指定`"org.ton.stoppable"{:tact}`
- [`Resumable{:tact}`](/zh-cn/ref/stdlib-stoppable#resumable) trait 指定`"org.ton.resumable"{:tact}`

要启用 `supported_interfaces` [getter](#getter-functions) 生成并在 Tact 合约中使用 `@interface(){:tact}` 属性，请修改项目根目录下的 [`tact.config.json`](/zh-cn/book/config) 文件（如果该文件不存在，则创建该文件），并 [将 `interfacesGetter` 属性设置为 `true{:json}`](/zh-cn/book/config#options-interfacesgetter)。

如果您的项目基于 [Blueprint][bp]，您可以在合约的编译配置中启用`supported_interfaces`，这些配置位于名为`wrappers/`的目录中：

```typescript title="wrappers/YourContractName.compile.ts" {7}
import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
  lang: 'tact',
  target: 'contracts/your_contract_name.tact',
  options: {
    interfacesGetter: true, // ← that's the stuff!
  }
};
```

除此之外，[`tact.config.json`](/zh-cn/book/config) 仍然可以用于 [Blueprint][bp] 项目。 除此之外，[Blueprint][bp] 项目中仍可使用 [`tact.config.json`](/zh-cn/book/config)。 在这种情况下，除非在 `wrappers/` 中进行修改，否则 [`tact.config.json`](/zh-cn/book/config)中指定的值将作为默认值。

:::note

  如果你有 `separateCompilables` 选项设置为 `true{:typescript}` 在 [`blueprint.config.ts`][bp-config]，然后`.compile.ts`文件将位于`compilables/`目录中，**不**位于`wrapper/`。

:::

:::caution

  请注意，添加接口并不能保证合约实际实现任何特定功能，也不能保证以任何特定方式实现这些功能。 这只是一种可验证的链外承诺，即合约中可能包含某些特定代码。 您应该相信但要核实这些说法。

  此外，不同接口之间也不能保证不会发生名称冲突，尽管这种情况不太可能发生，因为即使是 SHA-256 的前 128 位也能提供足够的[抗碰撞性](https://en.wikipedia.org/wiki/Collision_resistance)。
:::

:::

### 持久状态变量 {#variables}

合约可以定义在合约调用之间持续存在的状态变量。 合约可以定义在合约调用之间持续存在的状态变量。 TON 中的合约[支付租金](https://docs.ton.org/develop/smart-contracts/fees#storage-fee) 与它们消耗的持久空间成正比，因此鼓励[通过序列化进行紧凑表示](/zh-cn/book/integers#serialization)。

```tact
contract Example {
    // persistent state variables
    val: Int;              // Int
    val32: Int as uint32;  // Int serialized to an 32-bit unsigned
    mapVal: map<Int, Int>; // Int keys to Int values
    optVal: Int?;          // Int or null
}
```

状态变量必须有默认值或在 [`init(){:tact}`](#init-function) 函数中初始化，该函数在部署合约时运行。 唯一的例外是 [`map<K, V>{:tact}`](/zh-cn/book/maps) 类型的持久状态变量，因为它们默认初始化为空。

:::note

  请注意，Tact 也支持非持续状态的局部变量，请参阅：[变量声明](/zh-cn/book/statements#let)。

:::

### 合约常量 {#constants}

与 [变量](#variables) 不同，常量不能更改。 它们的值是在_编译时_计算的，在执行过程中不会改变。 它们的值是在 _编译时_ 计算的，在执行过程中不会改变。

在合约外定义的常量（全局常量）和在合约内定义的常量（合约常量）没有太大区别。 项目中的其他合约可以使用外部定义的常量。 项目中的其他合约可以使用外部定义的合约。

常量初始化必须相对简单，并且只依赖于编译时已知的值。 例如，如果您将两个数字相加，编译器会在编译过程中计算出结果，并将结果放入已编译的代码中。

您可以在 [接收器(getter)](#receiver-functions) 和 [获取器(getter)](#getter-functions) 中读取常量。

与[合约变量](#variables)不同，**合约常量不会占用持久状态**的空间。 它们的值直接存储在合约的代码 [`cell`](/zh-cn/book/cells#cells)中。 它们的值直接存储在合约的代码 [`cell{:tact}`](/zh-cn/book/cells#cells)中。

```tact
// global constants are calculated in compile-time and cannot change
const GlobalConst1: Int = 1000 + ton("42") + pow(10, 9);

contract Example {
    // contract constants are also calculated in compile-time and cannot change
    const ContractConst1: Int = 2000 + ton("43") + pow(10, 9);

    // contract constants can be an easy alternative to enums
    const StateUnpaid: Int = 0;
    const StatePaid: Int = 1;
    const StateDelivered: Int = 2;
    const StateDisputed: Int = 3;

    get fun sum(): Int {
        // access constants from anywhere
        return GlobalConst1 + self.ContractConst1 + self.StatePaid;
    }
}
```

有关常量的更多信息，请访问其专门页面：[常量](/zh-cn/book/constants)。

### 构造函数 `init()` {#init-function}

在部署合约时，会运行构造函数 `init(){:tact}`。

如果合约有任何[持久状态变量](#variables)没有指定默认值，则必须在此函数中初始化它们。

```tact
contract Example {
    // persistent state variables
    var1: Int = 0; // initialized with default value 0
    var2: Int;     // must be initialized in the init() function

    // constructor function
    init() {
        self.var2 = 42;
    }
}
```

如果合约没有任何持久状态变量，或者它们都指定了默认值，可以完全省略 `init(){:tact}` 函数声明。 这是因为除非明确声明，否则所有合约中都默认存在空的 `init(){:tact}` 函数。

下面是一个有效空合约的示例：

```tact
contract IamEmptyAndIKnowIt {}
```

为方便起见，`init(){:tact}` 的参数列表可以使用逗号：

```tact
contract TheySeeMeTrailing {
    init(
        param1: Int,
        param2: Int, // trailing comma is allowed
    ) {
        // ...
    }
}
```

:::note

  要获取 [内部函数](#internal-functions)、[接收器](#receiver-functions) 或 [getters](#getter-functions) 中目标合约的初始状态，请使用 [`initOf{:tact}`](/zh-cn/book/expressions#initof)表达式。

:::

### 获取器(getter)功能 {#getter-functions}

[获取(getter)函数](/zh-cn/book/functions#getter-functions) **无法从其他合约访问，仅导出到链下世界**。

此外，**获取器不能修改合约的状态变量**，只能读取它们的值并在表达式中使用。

```tact
contract HelloWorld {
    foo: Int;

    init() {
        self.foo = 0;
    }

    // getter function with return type Int
    get fun foo(): Int {
        return self.foo; // can't change self.foo here
    }
}
```

请在其专门章节中阅读更多相关信息：[获取函数](/zh-cn/book/functions#getter-functions)

### 接收器(Receiver)功能 {#receiver-functions}

Tact 中的[接收器(Receiver)函数](/zh-cn/book/functions#receiver-functions)可以是以下三种之一：

- [`receive(){:tact}`](/zh-cn/book/receive)，用于接收内部消息（来自其他合约）。
- [`bounced(){:tact}`](/zh-cn/book/bounced)，当该合约发出的消息被退回时会调用。
- [`external(){:tact}`](/zh-cn/book/external)，没有发送者，世界上任何人都可以发送。

```tact
message CanBounce {
    counter: Int;
}

contract HelloWorld {
    counter: Int;

    init() {
        self.counter = 0;
    }

    get fun counter(): Int {
        return self.counter;
    }

    // internal message receiver, which responds to a string message "increment"
    receive("increment") {
        self.counter += 1;

        // sending the message back to the sender
        send(SendParameters {
            to: sender(),
            value: 0,
            mode: SendRemainingValue | SendIgnoreErrors,
            body: CanBounce{counter: self.counter}.toCell(),
        });
    }

    // bounced message receiver, which is called when the message bounces back to this contract
    bounced(src: bounced<MsBounced>) {
        self.counter = 0; // reset the counter in case message bounced
    }

    // external message receiver, which responds to off-chain message "hello, it's me"
    external("hello, it's me") {
        // can't be replied to as there's no sender!
        self.counter = 0;
    }
}
```

用下划线`_{:tact}`命名接收函数的参数时，其值将被视为未使用的值并被丢弃。 这在您不需要检查收到的消息且只希望其传达特定操作码时非常有用：

```tact
message(42) UniverseCalls {}

contract Example {
    receive(_: UniverseCalls) {
        // Got a Message with opcode 42
    }
}
```

### 内部函数 {#internal-functions}

这些函数的行为类似于流行的面向对象语言中的私有方法——它们是合约的内部函数，可以通过在其前缀添加特殊的[标识符 `self{:tact}`](#self)来调用。 因此，内部函数有时也被称为 "合约方法"。

内部函数可以访问合约的[持久状态变量](#variables)和[常量](#constants)。

它们只能从[接收器](#receiver-functions)、[获取器](#getter-functions)和其他内部函数中调用，而不能从其他合约或[`init(){:tact}`](#init-function)中调用。

```tact
contract Functions {
    val: Int = 0;

    // this contract method can only be called from within this contract and access its variables
    fun onlyZeros() {
        require(self.val == 0, "Only zeros are permitted!");
    }

    // receiver function, which calls the internal function onlyZeros
    receive("only zeros") {
        self.onlyZeros();
    }
}
```

:::note

  请注意，Tact 还支持其他类型的函数，请参阅[函数](/zh-cn/book/functions)。

:::

[p]: /zh-cn/book/types#primitive-types
[trait]: /zh-cn/book/types#traits
[bp]: https://github.com/ton-org/blueprint
[bp-config]: https://github.com/ton-org/blueprint/tree/main?tab=readme-ov-file#configuration



================================================
FILE: docs/src/content/docs/zh-cn/book/cs/from-func.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/cs/from-func.mdx
================================================
---
title: 来自 FunC
description: 从 FunC 快速过渡到 Tact 的小窍门
sidebar:
  order: 1
---

:::danger[Not implemented]

  此页面等待编写 [#54](https://github.com/tact-lang/tact-docs/issues/54)

:::



================================================
FILE: docs/src/content/docs/zh-cn/book/cs/from-solidity.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/cs/from-solidity.mdx
================================================
---
title: 来自 Solidity
description: 从Solidity快速过渡到Tact，从以太坊过渡到TON区块链的备忘单
sidebar:
  order: 2
---

:::danger[Not implemented]

  此页面等待编写 [#67](https://github.com/tact-lang/tact-docs/issues/67)

:::



================================================
FILE: docs/src/content/docs/zh-cn/book/debug.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/debug.mdx
================================================
---
title: 调试 Tact 合约
description: 在 Tact 代码中显示问题或错误的各种方式
---

import { LinkCard, CardGrid, Steps, Tabs, TabItem } from '@astrojs/starlight/components';

作为智能合约开发人员，我们编写的代码并不总是能实现我们的预期。 有时，它做的事情完全不同！ 当意外发生时，接下来的任务就是找出原因。 为此，有多种方法可以揭示代码中的问题或 "错误"。 让我们开始_调试_！ 有时，它做的事情完全不同！ 当意外发生时，接下来的任务就是找出原因。 为此，有多种方法可以揭示代码中的问题或 "错误"。 让我们开始_调试_！

<CardGrid>
  <LinkCard
    title="General approach"
    href="#approach"
  />
  <LinkCard
    title="Debug mode"
    href="#debug-mode"
  />
  <LinkCard
    title="Structure of tests"
    href="#tests-structure"
  />
  <LinkCard
    title="Dump values"
    href="#tests-dump"
  />
  <LinkCard
    title="Expect certain states"
    href="#tests-errors"
  />
  <LinkCard
    title="Send messages"
    href="#tests-send"
  />
  <LinkCard
    title="Observe fees"
    href="#tests-fees"
  />
  <LinkCard
    title="Expect exit codes"
    href="#tests-errors"
  />
  <LinkCard
    title="Simulate time"
    href="#tests-time"
  />
  <LinkCard
    title="Emit and log messages"
    href="#logging"
  />
  <LinkCard
    title="Handle bounced messages"
    href="#bounced"
  />
  <LinkCard
    title="Experimental lab setup"
    href="#lab"
  />
</CardGrid>

## 一般方法 {#approach}

目前，Tact 还没有步进式调试器。 目前，Tact 还没有步进式调试器。 尽管如此，仍然可以使用["printf 调试"](https://en.wikipedia.org/wiki/Debugging#printf_debugging) 方法。

这包括在整个代码中主动调用 [`dump(){:tact}`][dump]和 [`dumpStack(){:tact}`](/zh-cn/ref/core-debug#dumpstack)函数，并观察特定时间点的变量状态。 请注意，这些函数只在 [调试模式](#debug-mode) 下工作，否则不会执行。

:::note

  请参阅如何使用 [`dump(){:tact}`][dump]进行调试：[使用 `dump() 调试{:tact}`](#tests-dump)。

:::

除了转储值之外，使用一些断言函数通常也很有帮助，例如 [`require(){:tact}`](/zh-cn/ref/core-debug#require)、[`nativeThrowIf(){:tact}`](/zh-cn/ref/core-debug#nativethrowif) 和 [`nativeThrowUnless(){:tact}`](/zh-cn/ref/core-debug#nativethrowunless)。 它们有助于明确说明你的假设，并方便设置 "绊线"，以便在将来发现问题。

如果您没有找到或无法解决您的问题，请尝试在 Tact 的[Telegram 聊天][tg]中询问社区；如果您的问题或疑问与 TON 的关系大于与 Tact 的关系，请进入[TON Dev Telegram 聊天](https://t.me/tondev_eng)。

## 常用调试功能 {#debug-functions}

Tact 提供了大量对调试有用的各种函数：[核心库 → 调试](/zh-cn/ref/core-debug)。

## 在编译选项中启用调试模式 {#debug-mode}

为了使 [`dump(){:tact}`][dump]或 [`dumpStack(){:tact}`](/zh-cn/ref/core-debug#dumpstack)等函数正常工作，需要启用调试模式。

最简单和推荐的方法是修改项目根目录下的 [`tact.config.json`](/zh-cn/book/config) 文件（如果还不存在，则创建该文件），并 [将 `debug` 属性设置为 `true{:json}`](/zh-cn/book/config#options-debug)。

如果您正在处理基于 [Blueprint][bp] 的项目，可以在合约的编译配置中启用调试模式，这些配置位于名为 `wrappers/` 的目录中：

```typescript title="wrappers/YourContractName.compile.ts" {7}
import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
  lang: 'tact',
  target: 'contracts/your_contract_name.tact',
  options: {
    debug: true, // ← that's the stuff!
  }
};
```

请注意，从 0.20.0 开始的 [Blueprint][bp] 版本会自动为新合约启用 `wrappers/` 中的调试模式。

除此之外，[`tact.config.json`](/zh-cn/book/config) 仍然可以用于 [Blueprint][bp] 项目。 除此之外，[Blueprint][bp] 项目中仍可使用 [`tact.config.json`](/zh-cn/book/config)。 在这种情况下，除非在 `wrappers/` 中修改，否则 [`tact.config.json`](/zh-cn/book/config)中指定的值将作为默认值。

:::note

  如果在 [`blueprint.config.ts`][bp-config] 文件中将 `separateCompilables` 选项设置为 `true{:typescript}`，那么 `.compile.ts` 文件将位于 `compilables/` 目录中，而**不会**位于 `wrappers/` 目录中。

:::

:::note

  阅读更多关于配置和 [`tact.config.json`](/zh-cn/book/config) 文件的信息：[配置](/zh-cn/book/config)。\
  查看如何使用 [`dump(){:tact}`][dump] 进行调试：[使用 `dump(){:tact}` 调试](#tests-dump)。

:::

## 在 Blueprint 中编写测试，使用 Sandbox 和 Jest {#tests}

[Blueprint][bp] 是一个流行的开发框架，用于在 TON 区块链上编写、测试和部署智能合约。

为了测试智能合约，它使用了本地 TON 区块链模拟器[Sandbox][sb]和 JavaScript 测试框架[Jest][jest]。

无论何时创建一个新的 [Blueprint][bp] 项目，或在现有项目中使用 "blueprint create "命令，都会创建一个新的合约以及测试套件文件。

这些文件被放在`tests/`文件夹中，并用[Jest][jest]执行。  默认情况下，除非指定特定组或测试关闭，否则所有测试都会运行。 有关其他选项，请参阅 Jest CLI 中的简要文档：`jest --help`。

### 测试文件的结构 {#tests-structure}

假设我们有一份名为 `Playground` 的合约，写在 `contracts/playground.tact` 文件中。 假设我们有一份名为 `Playground` 的合约，写在 `contracts/playground.tact` 文件中。 如果我们通过 [Blueprint][bp] 创建了该合约，那么它也会为我们创建一个 `tests/Playground.spec.ts` 测试套件文件。

测试文件包含一个 `describe(){:typescript}` [Jest][jest] 函数调用，表示一个测试组。

在该组中，有三个变量在所有测试中都可用：

- `blockchain` - 由[沙盒][sb]提供的本地区块链实例
- `deployer` — 一个 TypeScript 封装器，用于部署我们的 `Playground` 合约或我们希望部署的任何其他合约
- `playground` - 我们的 `Playground` 合约的 TypeScript 封装器

:::note

  常见的错误是更新`.tact`代码后直接运行测试，而没有先进行构建。 更新 `.tact` 代码和运行测试而不先进行构建是一个常见错误。 这是因为 [Blueprint][bp] 中的测试依赖于 Tact 编译器生成的 TypeScript 封装程序，并与最新的构建程序一起工作。

  这就是为什么每次更改 Tact 代码时，都要确保在执行测试套件之前使用 `npx blueprint build` 进行构建。  为了您的方便，您可以将构建和测试合并为一个命令，如[实验室设置](#lab-4)中所示。

:::

然后，调用一个 `beforeEach(){:tact}` [Jest][jest] 函数--它指定了在每个后续测试闭包之前要执行的所有代码。

:::note

  强烈建议不要修改 `beforeEach(){:tact}` 中的内容，除非您确实需要为每个测试闭包设置某些特定行为，或者 [`init(){:tact}`](/zh-cn/book/contracts#init-function)函数的参数发生了变化。

:::

最后，通过调用 `it(){:tact}` [Jest][jest] 函数来描述每个测试闭包--这就是实际编写测试的地方。

一个最简单的测试闭包示例如下：

```typescript
it('should deploy', async () => {
  // The check is done inside beforeEach, so this can be empty
});
```

### 使用 `dump()` 调试 {#tests-dump}

要查看 [`dump(){:tact}`][dump]函数调用的结果，并使用["printf 调试"](#approach) 方法，就必须

1. 在代码的相关位置调用 [`dump(){:tact}`][dump]和其他[常用调试函数](#debug-functions)。
2. 运行 [Jest][jest]测试，这些测试将调用目标函数并向目标接收器发送信息。

假设你已经创建了一个 [新计数器合约项目](/zh-cn/#start)，让我们来看看它是如何实际运行的。

首先，让我们在 `contracts/simple_counter.tact` 中调用 [`dump(){:tact}`][dump]，这将把 `msg{:tact}` [Struct][struct] 中传递的 `amount` 输出到合约的调试控制台：

```tact title="contracts/simple_counter.tact" {3}
// ...
receive(msg: Add) {
    dump(msg.amount);
    // ...
}
// ...
```

接下来，让我们注释掉 `tests/SimpleCounter.spec.ts` 文件中所有现有的 `it(){:typescript}` 测试闭包。 然后再加上下面一条： 然后再加上下面一条：

```typescript title="tests/SimpleCounter.spec.ts"
it('should dump', async () => {
  await playground.send(
    deployer.getSender(),
    { value: toNano('0.5') },
    { $$type: 'Add', queryId: 1n, amount: 1n },
  );
});
```

它向我们合约的 `receive(msg: Add){:tact}` [接收器](/zh-cn/book/receive) 发送信息，而不存储[发送结果](#tests-send)。

现在，如果我们使用 `yarn build{:shell}` 构建我们的合约，并使用 `yarn test{:shell}` 运行我们的测试套件，我们将在测试日志中看到以下内容：

```txt
console.log
  #DEBUG#: [DEBUG] File contracts/simple_counter.tact:17:9
  #DEBUG#: 1

    at SmartContract.runCommon (node_modules/@ton/sandbox/dist/blockchain/SmartContract.js:221:21)
```

这是由我们上面的 [`dump(){:tact}`][dump]调用产生的。

:::note

  了解有关在测试中向合约发送消息的更多信息：[向合约发送消息](#tests-send)。

:::

### 使用`expect()`说明期望 {#tests-expect}

编写测试不可或缺的部分是确保你的期望与观察到的现实相吻合。 编写测试不可或缺的部分是确保你的期望与观察到的现实相吻合。 为此，[Jest][jest] 提供了一个函数 `expect(){:tact}`，使用方法如下：

1. 首先，提供一个观测变量。
2. 然后，调用特定的方法来检查该变量的某个属性。

下面是一个更复杂的示例，它使用 `expect(){:tact}` 函数来检查计数器合约是否确实正确地增加了计数器：

```typescript
it('should increase counter', async () => {
  const increaseTimes = 3;
  for (let i = 0; i < increaseTimes; i++) {
    console.log(`increase ${i + 1}/${increaseTimes}`);

    const increaser = await blockchain.treasury('increaser' + i);

    const counterBefore = await simpleCounter.getCounter();
    console.log('counter before increasing', counterBefore);

    const increaseBy = BigInt(Math.floor(Math.random() * 100));
    console.log('increasing by', increaseBy);

    const increaseResult = await simpleCounter.send(
      increaser.getSender(),
      { value: toNano('0.05') },
      { $$type: 'Add', queryId: 0n, amount: increaseBy }
    );

    expect(increaseResult.transactions).toHaveTransaction({
      from: increaser.address,
      to: simpleCounter.address,
      success: true,
    });

    const counterAfter = await simpleCounter.getCounter();
    console.log('counter after increasing', counterAfter);

    expect(counterAfter).toBe(counterBefore + increaseBy);
  }
});
```

:::note

  请参阅 [Sandbox][sb] 文档中的更多测试示例：\
  [测试流程](https://github.com/ton-org/sandbox/blob/main/docs/testing-key-points.md)\
  [为 Tact 编写测试](https://github.com/ton-org/sandbox/blob/main/docs/tact-testing-examples.md)

:::

### 实用方法 {#tests-jest-utils}

由 [Blueprint][bp] 生成的测试文件导入了 `@ton/test-utils` 库，该库为 `expect(){:typescript}` [Jest][jest] 函数的结果类型提供了一些额外的辅助方法。  请注意，`toEqual(){:typescript}` 等常规方法仍然存在，随时可以使用。

#### toHaveTransaction

方法 `expect(…).toHaveTransaction(){:typescript}` 检查事务列表中是否有符合你指定的某些属性的事务：

```typescript {2}
const res = await yourContractName.send(…);
expect(res.transactions).toHaveTransaction({
  // For example, let's check that a transaction to your contract was successful:
  to: yourContractName.address,
  success: true,
});
```

要了解此类属性的完整列表，请查看编辑器或集成开发环境提供的自动完成选项。

#### toEqualCell

方法 `expect(…).toEqualCell(){:typescript}` 检查两个 [cell](/zh-cn/book/cells#cells)是否相等：

```typescript {3}
expect(oneCell).toEqualCell(anotherCell);
```

#### toEqualSlice

方法 `expect(…).toEqualSlice(){:typescript}` 检查两个 [slices](/zh-cn/book/cells#slices) 是否相等：

```typescript {3}
expect(oneSlice).toEqualSlice(anotherSlice);
```

#### toEqualAddress

方法 `expect(…).toEqualAddress(){:typescript}` 检查两个 [地址](/zh-cn/book/types#primitive-types)是否相等：

```typescript {3}
expect(oneAddress).toEqualAddress(anotherAddress)；
```

### 发送信息至 {#tests-send}

要向合约发送消息，请在其 TypeScript 封装器上使用 `.send(){:typescript}` 方法，如下所示：

```typescript
// It accepts 3 arguments:
await yourContractName.send(
  // 1. sender of the message
  deployer.getSender(), // this is a default treasury, can be replaced

  // 2. value and (optional) bounce, which is true by default
  { value: toNano('0.5'), bounce: false },

  // 3. a message body, if any
  'Look at me!',
);
```

消息体可以是简单的字符串，也可以是指定 [消息](/zh-cn/book/structs-and-messages#messages)类型字段的对象：

```typescript {4-8}
await yourContractName.send(
  deployer.getSender(),
  { value: toNano('0.5') },
  {
    $$type: 'NameOfYourMessageType',
    field1: 0n, // bigint zero
    field2: 'yay',
  },
);
```

通常情况下，存储此类发送的结果非常重要，因为它们包含发生的事件、进行的事务和发送的外部信息：

```typescript
const res = await yourContractName.send(…);
// res.events - 发生的事件数组
// res.externals - 外部输出消息数组
// res.transactions - 完成的交易数组
```

这样，我们就可以轻松地过滤或检查某些交易：

```typescript
expect(res.transactions).toHaveTransaction(…);
```

### 观察费用和数值 {#tests-fees}

[沙盒][sb]提供了一个辅助函数 `printTransactionFees(){:typescript}`，它可以漂亮地打印所提供交易的所有值和费用。  它对观察 [nano Toncoins](/zh-cn/book/integers#nanotoncoin)的流动非常方便。

要使用它，请在测试文件顶部修改来自 `@ton/sandbox` 的导入：

```typescript
import { Blockchain, SandboxContract, TreasuryContract, printTransactionFees } from '@ton/sandbox';
//                                                      ^^^^^^^^^^^^^^^^^^^^
```

然后，提供一个事务数组作为参数，就像这样：

```typescript
printTransactionFees(res.transactions);
```

要处理计算和操作 [阶段](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)的总费用或费用的单个值，请逐个检查每笔交易：

```typescript {11,17,21}
// Storing the transaction handled by the receiver in a separate constant
const receiverHandledTx = res.transactions[1];
expect(receiverHandledTx.description.type).toEqual('generic');

// Needed to please TypeScript
if (receiverHandledTx.description.type !== 'generic') {
  throw new Error('Generic transaction expected');
}

// Total fees
console.log('Total fees: ', receiverHandledTx.totalFees);

// Compute fee
const computeFee = receiverHandledTx.description.computePhase.type === 'vm'
  ? receiverHandledTx.description.computePhase.gasFees
  : undefined;
console.log('Compute fee: ', computeFee);

// Action fee
const actionFee = receiverHandledTx.description.actionPhase?.totalActionFees;
console.log('Action fee: ', actionFee);

// Now we can do some involved checks, like limiting the fees to 1 Toncoin
expect(
  (computeFee ?? 0n)
  + (actionFee ?? 0n)
).toBeLessThanOrEqual(toNano('1'));
```

:::note

  [沙盒][sb] 还有更多的实用功能，通常非常有用。 [沙盒][sb]还有很多实用功能，通常都很方便。 例如，它提供了 `prettyLogTransaction(){:typescript}` 和 `prettyLogTransactions(){:typescript}`，分别对单个或多个事务进行操作，并漂亮地打印地址之间的值流。

:::

### 有故意错误的交易 {#tests-errors}

有时，进行负面测试也很有用，它可以故意出错并抛出特定的[退出码](/zh-cn/book/exit-codes)。

[Blueprint][bp]中此类[Jest][jest]测试闭包的示例：

```typescript title="tests/YourTestFileHere.spec.ts" {9,15}
it('throws specific exit code', async () => {
  // Send a specific message to our contract and store the results
  const res = await your_contract_name.send(
    deployer.getSender(),
    {
      value: toNano('0.5'), // value in nanoToncoins sent
      bounce: true,         // (default) bounceable message
    },
    'the message your receiver expects', // ← change it to yours
  );

  // Expect the transaction to our contract fail with a certain exit code
  expect(res.transactions).toHaveTransaction({
    to: your_contract_name.address,
    exitCode: 5, // ← change it to yours
  });
});
```

请注意，要跟踪具有特定退出码的事务，只需在 `expect(){:typescript}` 方法的 `toHaveTransaction(){:typescript}` 对象参数中指定 `exitCode` 字段即可。

不过，通过指定收件人地址 `to`来缩小范围是很有用的，这样 Jest 就只能查看我们发送给合约的消息所引起的事务。

### 模拟时间流逝 {#tests-time}

由 [Sandbox][bp] 提供的本地区块链实例中的 Unix 时间从 `beforeEach(){:typescript}` 块中创建这些实例的时刻开始。

```typescript {2}
beforeEach(async () => {
  blockchain = await Blockchain.create(); // ← here
  // ...
});
```

在此之前，我们曾被警告不要修改 `beforeEach(){:typescript}` 块，除非我们真的需要这样做。 而现在，我们要做的，就是稍稍推翻时间和时空旅行。 而现在，为了超越时间并进行一些时光旅行，我们这样做。

让我们在末尾添加下面一行，将 `blockchain.now` 明确设置为处理部署消息的时间：

```typescript {3}
beforeEach(async () => {
  // ...
  blockchain.now = deployResult.transactions[1].now;
});
```

现在，我们可以在测试子句中操作时间了。 现在，我们可以在测试子句中操作时间了。 例如，让我们在部署一分钟后进行一次交易，两分钟后再进行一次交易：

```typescript {2,4}
it('your test clause title', async () => {
  blockchain.now += 60; // 60 seconds late
  const res1 = await yourContractName.send(…);
  blockchain.now += 60; // another 60 seconds late
  const res2 = await yourContractName.send(…);
});
```

## 通过 `emit` 记录 {#logging}

[全局静态函数](/zh-cn/book/functions#global-static-functions) [`emit(){:tact}`](/zh-cn/ref/core-send#emit)向外部世界发送信息--它没有特定的接收者。

该功能对于记录和分析链外数据非常方便，只需查看合约生成的 [external messages](/zh-cn/book/external) 即可。

### 本地沙箱测试中的日志 {#logging-local}

在 [Sandbox][sb] 中部署时，您可以从 [receiver function](/zh-cn/book/contracts#receiver-functions) 中调用 [`emit(){:tact}`](/zh-cn/ref/core-send#emit)，然后观察已发送的 [external messages](/zh-cn/book/external) 列表：

```typescript {9-10}
it('emits', async () => {
  const res = await simpleCounter.send(
    deployer.getSender(),
    { value: toNano('0.05') },
    'emit_receiver', // ← change to the message your receiver handles
  );

  console.log("Address of our contract: " + simpleCounter.address);
  console.log(res.externals); // ← here one would see results of emit() calls,
                              //   and all external messages in general
});
```

### 已部署合约的日志 {#logging-deployed}

TON 区块链上的每笔交易都[包含`out_msgs`](https://docs.ton.org/develop/data-formats/transaction-layout#transaction) - 这是一个字典，保存着执行交易时创建的传出消息列表。

要查看字典中 [`emit(){:tact}`](/zh-cn/ref/core-send#emit)的日志，请查找没有收件人的外部消息。  在各种 TON 区块链探索器中，此类交易将被标记为 "外部输出(external-out)"，目的地指定为"-"或 "空"。

请注意，有些探索者会为你反序列化发送的信息体，而有些则不会。 不过，您可以随时在本地[自行解析](#logging-parsing)。

### 解析已发送信息的正文 {#logging-parsing}

请参考以下示例：

```tact
// We have a Struct
struct Ballroom {
    meme: Bool;
    in: Int;
    theory: String;
}

// And a simple contract,
contract Bonanza {
    // which can receive a String message,
    receive("time to emit") {
        // emit a String
        emit("But to the Supes? Absolutely diabolical.".asComment());

        // and a Struct
        emit(Ballroom { meme: true, in: 42, theory: "Duh" }.toCell());
    }
}
```

现在，让我们为 "Bonanza "合约制作一个简单的 [测试条款](#tests-structure)：

```typescript /bonanza/
it('emits', async () => {
  const res = await bonanza.send(
    deployer.getSender(),
    { value: toNano('0.05') },
    'time to emit',
  );
});
```

在这里，`res` 对象的`externals`字段将包含已发送的[外部信息](/zh-cn/book/external) 列表。  让我们访问它，以解析通过调用 Tact 代码中的 [`emit(){:tact}`](/zh-cn/ref/core-send#emit)（或简称 _emitted_）发送的第一条信息：

```typescript /body/
it('emits', async () => {
  // ... prior code ...

  // We'll need only the body of the observed message:
  const firstMsgBody = res.externals[0].body;

  // Now, let's parse it, knowing that it's a text message.
  // NOTE: In a real-world scenario,
  //       you'd want to check that first or wrap this in a try...catch
  const firstMsgText = firstMsgBody.asSlice().loadStringTail();

  // "But to the Supes? Absolutely diabolical."
  console.log(firstMsgText);
});
```

要解析第二条发出的信息，我们可以手动使用一堆 `.loadSomething(){:typescript}` 函数，但这样做太麻烦了--如果 `Ballroom{:tact}` [Struct][struct] 的字段发生变化，就需要重新开始。  当你以这种方式编写大量测试时，可能会适得其反。

幸运的是，Tact 编译器会自动为合约生成 TypeScript 绑定（或封装），在测试套件中重新使用它们非常容易。  它们不仅有一个你正在测试的合约的包装器，而且还导出了一堆辅助函数来存储或加载合约中定义的 [Structs][struct] 和 [Messages][message] 。 后者的命名方式与 [Structs][struct] 和 [Messages][message] 一样，只是在前面加上了 `load` 前缀。

例如，在我们的例子中，我们需要一个名为 `loadBallroom(){:typescript}` 的函数，用于将 [`Slice{:tact}`][slice]解析为 TypeScript 中的 `Ballroom{:tact}` [Struct][struct] 。  要导入它，要么键入名称，让集成开发环境建议自动导入，要么查看测试套件文件的顶部--应该有类似的一行：

```typescript
import { Bonanza } from '../wrappers/Bonanza';
//              ^ here you could import loadBallroom
```

现在，让我们来解析第二条发出的信息：

```typescript
it('emits', async () => {
  // ... prior code ...

  // We'll need only the body of the observed message:
  const secondMsgBody = res.externals[1].body;

  // Now, let's parse it, knowing that it's the Ballroom Struct.
  // NOTE: In a real-world scenario,
  //       you'd want to check that first or wrap this in a try...catch
  const secondMsgStruct = loadBallroom(secondMsgBody.asSlice());

  // { '$$type': 'Ballroom', meme: true, in: 42n, theory: 'Duh' }
  console.log(secondMsgStruct);
});
```

请注意，即使在我们的测试套件之外，也可以解析已部署合约的发射信息。 您只需获取已触发的消息体，然后像上面的示例一样，在 `@ton/core` 库旁使用自动生成的 Tact 的 TypeScript 绑定。

## 处理退回消息 {#bounced}

当 [sent](/zh-cn/book/send) 带有 `bounce: true{:tact}`时，消息可以在出现错误时退回. 确保编写相关的 [`bounced(){:tact}`](/zh-cn/book/bounced)消息[接收器](/zh-cn/book/contracts#receiver-functions)，并优雅地处理被退回的消息：

```tact
bounced(msg: YourMessage) {
    // ...alright squad, let's bounce!...
}
```

请记住，在 TON 中被退回的消息正文中只有 $224$ 个可用数据位，而且没有任何引用，因此无法从中恢复很多数据。  不过，您仍然可以看到消息是否被退回，从而可以创建更稳健的合约。

了解更多关于退回消息和接收者的信息：[退回消息](/zh-cn/book/bounced)。

## 实验室设置 {#lab}

如果你对 [Blueprint][bp] 的测试设置感到不知所措，或者只是想快速测试一些东西，不用担心--有一种方法可以建立一个简单的游戏场作为实验实验室，来测试你的想法和假设。

<Steps>

1. #### 创建新的Blueprint项目 {#lab-1}

   这将防止任意代码和测试污染您现有的程序。

   新项目可以取任何名字，但我会取名为 "Playground"，以表达正确的意图。

   要创建它，请运行以下命令：

   <Tabs>
     <TabItem label="yarn" icon="seti:yarn">
       ```shell
       # recommended
       yarn create ton tact-playground --type tact-empty --contractName Playground
       ```
     </TabItem>
     <TabItem label="npm" icon="seti:npm">
       ```shell
       npm create ton@latest -- tact-playground --type tact-empty --contractName Playground
       ```
     </TabItem>
     <TabItem label="pnpm" icon="pnpm">
       ```shell
       pnpm create ton@latest tact-playground --type tact-empty --contractName Playground
       ```
     </TabItem>
     <TabItem label="bun" icon="bun">
       ```shell
       bun create ton@latest tact-playground --type tact-empty --contractName Playground
       ```
     </TabItem>
   </Tabs>

   从 0.20.0 开始的 [Blueprint][bp] 版本会自动为新合约启用 `wrappers/` 中的调试模式，因此我们只需调整测试套件并准备好我们的 `Playground` 合约即可进行测试。

2. #### 更新测试套件 {#lab-2}

   移动到新创建的 `tact-playground/` 项目，在 `tests/Playground.spec.ts` 中，将 `"should deploy"{:tact}` 测试闭包改为以下内容：

   ```typescript title="tests/Playground.spec.ts"
   it('plays', async () => {
     const res = await playground.send(
       deployer.getSender(),
       { value: toNano('0.5') }, // ← here you may increase the value in nanoToncoins sent
       'plays',
     );

     console.log("Address of our contract: " + playground.address);
     console.log(res.externals); // ← here one would see results of emit() calls
   });
   ```

3. #### 修改合约 {#lab-3}

   用以下代码替换`contracts/playground.tact`中的代码：

   ```tact title="contracts/playground.tact" {4-6}
   contract Playground {
       receive() { cashback(sender()) } // for the deployment

       receive("plays") {
           // NOTE: write your test logic here!
       }
   }
   ```

   此设置的基本思想是将要测试的代码放入 [receiver function](/zh-cn/book/contracts#receiver-functions) 中，以响应 [string](/zh-cn/book/types#primitive-types) 消息 `"plays"{:tact}`。

   请注意，您仍然可以在[接收器](/zh-cn/book/contracts#receiver-functions) 之外编写任何有效的 Tact 代码。  但为了测试它，你需要在其中编写相关的测试逻辑。

4. #### 我们来测试一下！ 我们来测试一下！ {#lab-4}

   这样，我们的实验装置就完成了。  要执行我们为 "Playground "合约准备的单个测试，请运行以下程序：

   ```shell
   yarn test -t plays
   ```

   从现在起，您只需修改 Tact 合约文件中已测试的 [receiver function](/zh-cn/book/contracts#receiver-functions) 的内容，然后重新运行上述命令，就可以对某些内容进行测试。  重复该过程，直到您测试了想要测试的内容。

   为了简化和更干净的输出，您可以在 `package.json` 中为 `scripts` 添加一个新字段，这样您只需运行 `yarn lab{:shell}` 即可在一个字段中完成构建和测试。

   在 Linux 或 macOS 上，它看起来就像这样：

   ```json title="package.json" {3}
   {
     "scripts": {
       "lab": "blueprint build --all 1>/dev/null && yarn test -t plays"
     }
   }
   ```

   下面是它在 Windows 上的样子：

   ```json title="package.json" {3-4}
   {
     "scripts": {
       "build": "blueprint build --all | out-null",
       "lab": "yarn build && yarn test -t plays"
     }
   }
   ```

   要运行

   ```shell
   yarn lab
   ```

</Steps>

[dump]: /zh-cn/ref/core-debug#dump
[struct]: /zh-cn/book/structs-and-messages#structs
[message]: /zh-cn/book/structs-and-messages#messages
[cell]: /zh-cn/book/cells#cells
[slice]: /zh-cn/book/cells#slices
[tg]: https://t.me/tactlang
[bp]: https://github.com/ton-org/blueprint
[bp-config]: https://github.com/ton-org/blueprint/tree/main?tab=readme-ov-file#configuration
[sb]: https://github.com/ton-org/sandbox
[jest]: https://jestjs.io



================================================
FILE: docs/src/content/docs/zh-cn/book/deploy.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/deploy.mdx
================================================
---
title: 部署
description: 将Tact 合约部署到 TON Blockchain 测试网或主网的常见方法
prev:
  link: /zh-cn/book/message-mode
  label: 消息模式
---

Tact Deployer 是一个与 [TON Verifier](https://verifier.ton.org) 集成的小型库，可让您使用自己喜欢的钱包安全地部署合约，而无需管理密钥或手动部署合约。  Tact Deployer 还能自动验证合约的源代码，确保编译器不受损害。

## 要求

要使用 Tact Deployer，您的合约必须具有 `@stdlib/deploy` 包中的 `Deployer` 特性。

## 安装

要在项目中添加 Tact 部署器，只需使用 `yarn`：

```bash
yarn add @tact-lang/deployer
```

## 如何使用

当你使用 Tact 构建智能合约时，它会生成一个包（\*.pkg）文件，其中包含所构建智能合约的所有必要信息。 要在TON中部署智能合约，您需要发送附有`init`数据的消息。

```typescript
import * as fs from 'fs';
import * as path from 'path';
import { Address, contractAddress } from "ton";
import { SampleTactContract } from "./output/sample_SampleTactContract";
import { prepareTactDeployment } from "@tact-lang/deployer";

// Parameters
const testnet = true;                                 // Flag for testnet or mainnet
const packageName = 'sample_SampleTactContract.pkg';  // Name of your package to deploy
const outputPath = path.resolve(__dirname, 'output'); // Path to output directory
const owner = Address.parse('<put_address_here>');    // Our sample contract has an owner
const init = await SampleTactContract.init(owner);    // Create initial data for our contract

// Calculations
const address = contractAddress(0, init);     // Calculate contract address. MUST match with the address in the verifier
const data = init.data.toBoc();               // Create init data
const pkg = fs.readFileSync(                  // Read package file
    path.resolve(outputPath, packageName)
);

// Prepare deploy
const link = await prepareTactDeployment({ pkg, data, testnet });

// Present a deployment link and contract address
console.log('Address: ' + address.toString({ testOnly: testnet }));
console.log('Deploy link: ' + link);
```

点击此链接后，您就可以部署和验证您的智能合约。



================================================
FILE: docs/src/content/docs/zh-cn/book/exit-codes.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/exit-codes.mdx
================================================
---
title: 退出码(Exit codes)
description: 退出码是一个32位签名的整数，表示交易的计算或动作阶段是否成功。 如果不是，请保存异常代码
---

TON Blockchain上的每笔交易都包含[多个阶段](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transaction-and-stage)。 _退出码_ 是一个 $32$位符号整数 这表明交易的 [计算(compute)](#compute) 或 [动作(action)](#action) 阶段是成功的。 如果没有，则保留例外的代码。 每个退出码代表自己的异常或交易结果。

退出码 $0$ 和 $1$ 表示正常(成功)执行 [计算阶段](#compute)。 退出 (或 [result](#action)) 代码 $0$ 表示了[动作阶段] (#action)的正常执行(成功)。 任何其他退出代码都表示发生了某种异常，交易以某种方式没有成功，即交易被退回或入站（inbound）报文被弹回。

TON 区块链保留从 $0$ 到 $127$的退出码值，而 Tact 使用从 $128$ 到 $255$的退出码。 注意, Tact使用的退出码表示使用Tact生成FunC代码时可能发生合约错误。 因此被扔进交易的[计算阶段](#compute)，而不是在编译过程中。

从 $256$ 到 $65535$ 的范围内，开发人员可自由定义退出码。

:::note

  虽然在 TON Blockchain 上退出（或 [结果](#action)）码是一个 $32$-bit 有符号整数，但尝试 [抛出](/zh-cn/ref/core-debug) 超出 $16$-bit 无符号整数（$0 - 65535$）范围的退出码将导致一个 [退出码 5](#5) 的错误。 这是故意这样做的，目的是防止某些退出代码被人为产生，例如[退出代码 -14](#-14)。

:::

## 退出码列表 {#table}

下表列出了每个退出码的来源（可能出现的位置）和简短说明。 该表没有列出 [`require()`](/zh-cn/ref/core-debug#require) 的退出码，因为它是根据具体的 `error` 消息 [String][p] 生成的。

| 退出码          | 来源                        | 说明
| :-------------- | :-------------------------- | :---
| [$0$](#0)       | [计算][c]和[动作][a]阶段    | 标准成功执行退出码
| [$1$](#1)       | [计算阶段][c]               | 替代成功的执行退出码。 保留，但不会出现。
| [$2$](#2)       | [计算阶段][c]               | 堆栈下溢。
| [$3$](#3)       | [计算阶段][c]               | 堆栈溢出。
| [$4$](#4)       | [计算阶段][c]               | 整数溢出。
| [$5$](#5)       | [计算阶段][c]               | 范围检查错误 — 某些整数超出预期范围。
| [$6$](#6)       | [计算阶段][c]               | 无效的 [TVM][tvm] opcode
| [$7$](#7)       | [计算阶段][c]               | 类型检查错误。
| [$8$](#8)       | [计算阶段][c]               | Cell 溢出。
| [$9$](#9)       | [计算阶段][c]               | cell下溢。
| [$10$](#10)     | [计算阶段][c]               | 字典错误。
| [$11$](#11)     | [计算阶段][c]               | [TVM][tvm] 文档被描述为“未知错误，可能会被用户程序抛出”。
| [$12$](#12)     | [计算阶段][c]               | 致命错误。 由于被认为是不可能的情况而由 [TVM][tvm] 抛出。
| [$13$](#13)     | [计算阶段][c]               |  gas 耗尽错误。
| [$-14$](#-14)   | [计算阶段][c]               | 与 $13$ 相同。 负数，因此[无法伪造](#13)。
| [$14$](#14)     | [计算阶段][c]               | 虚拟机虚拟化错误。 保留，但从未抛出。
| [$32$](#32)     | [行动阶段][a]               | 操作列表(Action list)无效。
| [$33$](#33)     | [行动阶段][a]               | 操作列表太长。
| [$34$](#34)     | [行动阶段][a]               | 行动无效或不支持。如果无法执行当前操作，则在行动阶段设置
| [$35$](#35)     | [行动阶段][a]               | 发送消息中无效的源地址。
| [$36$](#36)     | [行动阶段][a]               | 发送消息中无效的目标地址。
| [$37$](#37)     | [动作阶段][a]               | 没有足够的Toncoin。
| [$38$](#38)     | [动作阶段][a]               | 额外代币不足。
| [$39$](#39)     | [行动阶段][a]               | 发送消息在重写后不适合在cell中。
| [$40$](#40)     | [行动阶段][a]               | 无法处理一条消息 — 资金不足，信息过大，或者它的 Merkle 深度过大。
| [$41$](#41)     | [行动阶段][a]               | 在库更改操作期间，库引用是无效的。
| [$42$](#42)     | [行动阶段][a]               | 库更改动作错误。
| [$43$](#43)     | [行动阶段][a]               | 超出库中cell的最大数目或默克尔树的最大深度。
| [$50$](#50)     | [行动阶段][a]               | 账户状态大小超过限制。
| [$128$](#128)   | Tact 编译器 ([计算阶段][c]) | 空引用异常。
| [$129$](#129)   | Tact 编译器 ([计算阶段][c]) | 无效的序列化前缀。
| [$130$](#130)   | Tact 编译器 ([计算阶段][c]) | 无效的收到消息 — 没有接收消息的验证码。
| [$131$](#131)   | Tact 编译器 ([计算阶段][c]) | 限制错误。 保留，但从未抛出。
| [$132$](#132)   | Tact 编译器 ([计算阶段][c]) | 拒绝访问 - 所有者以外的其他人向合约发送了信息
| [$133$](#133)   | Tact 编译器 ([计算阶段][c]) | 合约已中止。 保留，但从未抛出。
| [$134$](#134)   | Tact 编译器 ([计算阶段][c]) | 无效参数。
| [$135$](#135)   | Tact 编译器 ([计算阶段][c]) | 未找到合约代码 - 字典调用的假标记
| ~[$136$](#136)~ | Tact 编译器 ([计算阶段][c]) | 无效地址。
| ~[$137$](#137)~ | Tact 编译器 ([计算阶段][c]) | 此合约未启用主链支持

:::note

  通常情况下，您可能会遇到退出码 $65535$ （或 `0xffff`），其含义通常与 [exit code 130](#13) 相同--接收到的操作码对合约来说是未知的，因为没有接收器期待它。 在编写合约时，退出码 $65535$ 由开发人员设置，而不是由 [TVM][tvm] 或 Tact 编译器设置。

:::

[c]: https://docs.ton.org/learn/tvm-instructions/tvm-overview#compute-phase
[a]: https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases

## 在Blueprint项目中退出码 {#blueprint}

在[Blueprint][bp]测试中，[计算阶段](#compute)的退出码在`expect(){:typescript}` 匹配器的 `toHaveTransaction(){:typescript}` 方法的对象参数的 `exitCode` 字段中指定。 相同的 `toHaveTransaction(){:typescript}` 方法的 [result](#action) 代码(#action) 的退出码，称为`actionResultCode`。

:::note

  了解更多有关期望特定退出码的信息：[故意出错的事务](/zh-cn/book/debug#tests-errors)。

:::

此外， 我们可以查看[发送消息到合约](/zh-cn/book/debug#tests-send)的结果，并发现每个交易的阶段及其值。 包括[计算阶段](#compute)(#compute)(或[行动阶段](#action))的退出(或结果)代码。

请注意，为了做到这一点，您必须先进行几种类型的检查才能做到：

```typescript
it('tests something, you name it', async () => {
  // Send a specific message to our contract and store the results
  const res = await your_contract_name.send(…);

  // Now, we have an access to array of executed transactions,
  // with the second one (index 1) being the one that we look for
  const tx = res.transactions[1]!;

  // To do something useful with it, let's ensure that it's type is 'generic'
  // and that the compute phase in it wasn't skipped
  if (tx.description.type === "generic"
      && tx.description.computePhase.type === "vm") {
    // Finally, we're able to freely peek into the transaction for general details,
    // such as printing out the exit code of the compute phase if we so desire
    console.log(tx.description.computePhase.exitCode);
  }

  // ...
});
```

## 如果没有足够的 TON 来处理计算阶段，则会抛出此错误。

### 0: Normal termination {#0}

该退出码表示事务的计算阶段已成功完成。

## 计算阶段 {#compute}

[TVM][tvm] 初始化和所有计算都发生在 [计算阶段][c] 中。

如果计算阶段失败（产生的退出代码不是 [$0$](#0) 或 [$1$](#1) ），事务将跳过[操作阶段](#action)，进入反弹阶段。 在其中，回弹消息是为入站消息发起的交易形成的。

### 1: Alternative termination {#1}

这是成功执行[计算阶段](#compute)的替代退出码。 保留，但从未发生。

### 2: Stack underflow {#2}

如果某些操作消耗的元素多于堆栈上的元素，则退出码 $2$ 的错误就会抛出：“堆栈溢出”。

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

:::note[Useful links:]

  [TVM 是一台堆栈机](https://docs.ton.org/learn/tvm-instructions/tvm-overview#tvm-is-a-stack-machine)

:::

### 3: Stack overflow {#3}

如果有太多元素被复制到关闭继续或存储在堆栈上， 退出码 $3$ 出错："堆栈溢出"。 很少出现，除非你深陷 [Fift 和 TVM 组装](https://docs.ton.org/develop/fift/fift-and-tvm-assembly) 战壕：

```tact
// Remember kids, don't try to overflow the stack at home!
asm fun stackOverflow() {
    <{
    }>CONT // c
    0 SETNUMARGS // c'
    2 PUSHINT // c' 2
    SWAP // 2 c'
    1 -1 SETCONTARGS // <- this blows up
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

:::note[Useful links:]

  [TVM 是一台堆栈机](https://docs.ton.org/learn/tvm-instructions/tvm-overview#tvm-is-a-stack-machine)

:::

### 4: Integer overflow {#4}

整数溢出。整数不适合 $-2^{256} \leq x < 2^{256}$ 或发生了零除法

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

### 5: Integer out of range {#5}

范围检查错误 — 某些整数超出预期范围。 I.e. 任何试图存储意外数量的数据或指定一个超出范围的值会造成退出码 $5$的错误：“整数超出范围”。

指定非边界值的示例：

```tact
try {
    // Repeat only operates on inclusive range from 1 to 2^{31} - 1
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

如果您指定了在当前 [TVM][tvm] 版本中未定义的指令，退出码 $6$ 将会丢失一个错误：“无效的opcode”。

```tact
// No such thing
asm fun invalidOpcode() { x{D7FF} @addop }

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

如果原始参数的值类型不正确，或在[计算阶段](#compute)中的类型中存在任何其他不匹配的类型， 退出码 $7$ 出错："类型检查错误"。

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

来自书的[Cells, Builders and Slices page](/zh-cn/book/cells#cells)

> [`cell{:tact}`][cell]是一种[基元][p]和数据结构，它[通常](/zh-cn/book/cells#cells-kinds)由最多 $1023$ 个连续排列的位和最多 $4$ 个指向其他cell的引用（refs）组成。

要构建一个 [`cellent{:tact}`][cell], 使用 [`Builder{:tact}`][builder] 如果尝试存储的数据超过 $1023$ 位，或对其他cell的引用超过 $4$ ，则会出现退出码为 $8$ 的错误："`Cell overflow`。

这个错误可以由[手动construction](/zh-cn/book/cells#cnp-manual y) 通过[relevant `Builder.storeSomething(){:tact}`方法](/zh-cn/ref/core-cells) 或[使用结构和消息及其方便方法](/zh-cn/book/cells#cnp-structs) 触发。

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

来自书的[Cells, Builders and Slices page](/zh-cn/book/cells#cells)

> `Cell{:tact}`是一种[基元][p]和数据结构，它[通常](/zh-cn/book/cells#cells-kinds)由最多 $1023$ 个连续排列的位和最多 $4$ 个指向其他cell的引用（refs）组成。

若要解析[`cell{:tact}`][cell]，请使用 [`slice{:tact}`][slice] 如果你试图加载比`slice{:tact}`更多的数据或引用，则退出码 $9$ 的错误就会抛出：“cell下溢”。

此错误的最常见原因是cell的预期内存布局和实际内存布局不匹配， 因此建议[使用结构和消息进行解析](/zh-cn/book/cells#cnp-structs) ，而不是[手动解析](/zh-cn/book/cells#cnp-manually) 通过 [relevant `Slice.loadSomething(){:tact}`方法](/zh-cn/ref/core-cells)。

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

在 Tact 中，[`map<K, V>{:tact}`](/zh-cn/book/maps) 类型是对 [FunC 的 "hash" map 字典](https://docs.ton.org/develop/func/dictionaries#hashmap) 和 [TL-B][tlb] 及 [TVM][tvm] 的底层 [`HashmapE` 类型](https://docs.ton.org/develop/data-formats/tl-b-types#hashmap) 的一种抽象。

如果不正确地操纵字典，如对其内存布局的错误假设， 退出码 $10$ 出错：\`字典错误'。 请注意，除非您自己使用 [Fift 和 TVM assembly](https://docs.ton.org/develop/fift/fift-and-tvm-assembly) ，否则您无法获得此错误：

```tact
/// Pre-computed Int to Int dictionary with two entries — 0: 0 and 1: 1
const cellWithDictIntInt: Cell = cell("te6cckEBBAEAUAABAcABAgPQCAIDAEEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMLMbT1U=");

/// Tries to preload a dictionary from a Slice as a map<Int, Cell>
asm fun toMapIntCell(x: Slice): map<Int, Cell> { PLDDICT }

contract DictPic {
    receive("I solemnly swear that I'm up to no good") {
        try {
            // The Int to Int dictionary is being misinterpreted as a map<Int, Cell>
            let m: map<Int, Cell> = toMapIntCell(cellWithDictIntInt.beginParse());

            // And the error happens only when we touch it
            m.get(0)!!;
        } catch (exitCode) {
            // exitCode is 10
        }
    }
}
```

### 11: "Unknown" error {#11}

在[TVM][tvm]文档中被描述为 "未知错误，可能由用户程序抛出"，但最常用于队列消息发送问题或[get-methods](https://docs.ton.org/develop/smart-contracts/guidelines/get-methods)问题。

```tact
try {
    // Unlike sendRawMessage which uses SENDRAWMSG, this one uses SENDMSG,
    // and therefore fails in Compute phase when the message is ill-formed
    sendRawMessageReturnForwardFee(emptyCell(), 0);
} catch (exitCode) {
    // exitCode is 11
}
```

### 12: Fatal error {#12}

致命错误。 由于被认为是不可能的情况而由 TVM 抛出。

### 13: Out of gas error {#13}

如果没有足够的 gas 在[计算阶段](#compute)中结束计算, 则退出码 $13$ 的错误将会抛出: \` gas 错误'.

但是这个代码并不会立即按原样显示——而是应用了按位非运算，从而将值从$13$变为$-14$。 只有那时才显示代码。

这样做是为了防止在用户合约中人为地生成结果代码 ($-14$)，因为所有可以[抛出退出码](/zh-cn/ref/core-debug)的函数只能指定从 $0$ 到 $65535$ （含）范围内的整数。

```tact
try {
    repeat (pow(2, 31) - 1) {}
} catch (exitCode) {
    // exitCode is -14
}
```

### \-14: Out of gas error {#-14}

见[退出码13](#13)。

### 14: Virtualization error {#14}

虚拟化错误，与 [prunned branch cells](/zh-cn/book/cells#cells-kinds) 有关。 保留，但从未抛出。

## 行动阶段 {#action}

[操作阶段][a] 是在成功执行 [计算阶段](#compute) 后处理的。 它试图在计算阶段执行由 [TVM][tvm] 存储在行动列表中的动作。

有些操作可能在处理过程中失败。 在这种情况下，这些行动可能被跳过或整个交易可能会根据行动方式恢复。 表明[行动阶段][a] 结果状态的代码被称为 _结果代码(result code)_ 。 因为它也是一个 $32$位签名的整数，它基本上与[计算阶段](#compute)的 _export 代码](#compute)具有相同的用途， 通常将结果代码称为退出码。

### 32: Action list is invalid {#32}

如果操作列表包含[外来的cell](/zh-cn/book/cells#cells-kinds)，则操作项cell没有引用，或者某些操作项cell无法解析， 退出码 $32$ 出错："行动列表无效"。

:::note

  除了这个退出码之外，还有一个布尔值标志`valid`，你可以在“描述”下找到。 与 [Sandbox 和 Blueprint](#blueprint) 工作时，交易结果中的ctionPhase.valid`。 交易可以将这个标志设置为 `false\` ，即使有其它退出码从操作阶段扔出。

:::

### 33: Action list is too long {#33}

如果排队等待执行的操作超过 $255$ ，[操作阶段](#action) 将抛出错误，退出码为 $33$："操作列表太长"。

```tact
// For example, let's attempt to queue reservation of specific amount of nanoToncoins
// This won't fail in compute phase, but will result in exit code 33 in Action phase
repeat (256) {
    nativeReserve(ton("0.001"), ReserveAtMost);
}
```

### 34: Invalid or unsupported action {#34}

此刻只有四个支持的动作：更改合约代码，发送一条消息， 保留特定数量的 [nanoToncoins](/zh-cn/book/integers#nanotoncoin) 并更改library cell。 如果指定动作有任何问题 (无效消息，不支持的动作等)，则退出码 $34$ 的错误将被抛出：\`无效或不支持的动作'。

```tact
// For example, let's try to send an ill-formed message:
sendRawMessage(emptyCell(), 0); // won't fail in compute phase,
                                   // but will result in exit code 34 in Action phase
```

### 35: Invalid source address in outbound message {#35}

如果出站消息中的源地址不等于[`addr_none`](https://docs.ton.org/develop/data-formats/msg-tlb#addr_none00)，或是引发此消息的合约地址， 退出码 $35$ 出错：\`出站消息中无效的源地址'。

### 36: Invalid destination address in outbound message {#36}

如果出站消息中的目标地址无效，例如： 它不符合相关的 [TL-B][tlb] 模式，其中包含未知的工作链ID或它对给定的工作链有无效的长度， 退出码 $36$ 出现错误: "发送消息中无效的目标地址"。

:::note

  如果设置了[可选标记 +2](/zh-cn/book/message-mode#optional-flags)，则不会抛出此错误，也不会发送给定的信息。

:::

### 37: Not enough Toncoin {#37}

如果带有[基本模式 64](/zh-cn/book/message-mode#base-modes)设置的入站消息的所有资金已被消耗，并且没有足够的资金支付失败操作的费用，或者提供的值的 [TL-B][tlb] 布局（[`CurrencyCollection`](https://docs.ton.org/develop/data-formats/msg-tlb#currencycollection)）无效，或者没有足够的资金支付[转发费用](https://docs.ton.org/develop/smart-contracts/guidelines/processing)，或在扣除费用后资金不足，则会抛出错误，退出码为 $37$：`Not enough Toncoin`。

:::note

  如果设置了[可选标记 +2](/zh-cn/book/message-mode#optional-flags)，则不会抛出此错误，也不会发送给定的信息。

:::

### 38: Not enough extra currencies {#38}

除了本地货币Toncoin外，TON区块链支持最多 $2^{32}$ 种额外货币。 它们与创建新的[Jetton](/zh-cn/cookbook/jettons) 不同，因为额外的货币是原生支持的——可以在发送给另一个合约的内部消息中，除了 Toncoin 金额之外，额外指定一个额外货币金额的 [`HashmapE`](https://docs.ton.org/develop/data-formats/tl-b-types#hashmap)。 与 Jettons 不同，额外货币只能存储和转移，没有任何其他功能。

目前，TON 区块链上**没有额外的货币**，但当没有足够的额外货币来发送指定数量的货币时，退出代码 $38$ 已被保留：没有足够的额外货币"。

:::note[Useful links:]

  [TON文档中](https://docs.ton.org/develop/dapps/defi/coins)的[额外货币](https://docs.ton.org/develop/dapps/defi/coins)。\
  TON文档中的[额外货币挖掘](https://docs.ton.org/develop/research-and-development/minter-flow)。

:::

### 39: Outbound message doesn't fit into a cell {#39}

在处理消息时，TON 区块链会尝试根据[相关的 TL-B 模式](https://docs.ton.org/develop/data-formats/msg-tlb)对其进行打包，如果无法打包，则会抛出退出码为 $39$ 的错误：`Outbound message doesn't fit into a cell`。

:::note

  如果多次尝试发送消息失败，并且设置了[可选标记 +2](/zh-cn/book/message-mode#optional-flags)，则不会抛出此错误，也不会发送给定的信息。

:::

### 40: Cannot process a message {#40}

如果没有足够的资金处理消息中的所有cell， 消息过大或它的 Merkle 深度过大， 退出码 $40$ 出错：\`无法处理消息'。

### 41: Library reference is null {#41}

如果在库更改操作过程中需要库引用，但该引用为空，则会出现退出代码为 $41$ 的错误："库引用为空"。

### 42: Library change action error {#42}

如果尝试修改库时出现错误，退出码 $42$ 将会丢失: \`Library 更改操作错误'。

### 43: Library limits exceeded {#43}

如果超出库中cell的最大数目或超过Merkle树的最大深度， 退出码 $43$ 出错：`库限制已超过`。

### 50: Account state size exceeded limits {#50}

如果账户状态（本质上是合约存储）在[动作阶段](#action)结束时超过了 [TON Blockchain 配置参数 43](https://docs.ton.org/develop/howto/blockchain-configs#param-43)中规定的任意限制，则会抛出退出码为 $50$ 的错误：`Account state size exceeded limits`。

如果配置不存在，默认值为：

- `max_msg_bits` 等于 $2^{21}$ — 消息的最大大小（位）。
- `max_msg_cells`等于2^{13}$ — 最高数量的 [cells][cell] 一个消息可以占用。
- `max_library_cells` 等于 $1000$ - 可用作[库参考cells](/zh-cn/book/cells#cells-kinds)的[cells][cell]的最大数量。
- `max_vm_data_depth` 等于 $2^{9}$ — 最大 [cells][cell] 消息和帐户状态深度。
- `ext_msg_limits.max_size` 等于 $65535$ - 外部信息的最大位数。
- `ext_msg_limits.max_depth` 等于2 ^{9}$ — 最大外部消息 [depth](/zh-cn/book/cells#cells-representation).
- `max_acc_state_cells` 等于2 ^{16}$ — 最高数量的 [cells][cell] 账户状态可以占用。
- `max_acc_state_bits` 等于 $2^{16} \times 1023$ — 帐户状态的最大大小（位）。
- `max_acc_public_libraries` 等于 $2^{8}$，即账户状态在[主链](/zh-cn/book/masterchain)上可使用的[库引用单元](/zh-cn/book/cells#cells-kinds)的最大数量。
- `deleger_out_queue_size_limit` 等于2 ^{8}$ — — 最大数量的出站消息队列(关于验证器和校验器)。

## Tact 编译器

Tact 使用从 $128$ 到 $255$的退出码。 请注意，Tact 使用的退出代码表示在使用 Tact 生成的 FunC 代码时可能出现的合约错误，因此在事务的[计算阶段](#compute)而不是在编译期间抛出。

### 128: Null reference exception {#128}

如果有一个非空断言，例如 [`!!{:tact}`](/zh-cn/book/operators#unary-non-null-assert)操作符，而检查值是 [`null{:tact}`](/zh-cn/book/optionals)，则会抛出一个退出码为 $128$ 的错误："空引用异常"。

```tact
let gotcha: String? = null;

try {
    // Asserting that the value isn't null, which isn't the case!
    dump(gotcha!!);
} catch (exitCode) {
    exitCode; // 128
}
```

### 129: Invalid serialization prefix {#129}

保留，但由于有许多事先检查，除非在部署前劫持合约代码并更改合约中预期接收的 [信息][message] 的操作码，否则不会抛出。

### 130: Invalid incoming message {#130}

如果收到的内部或外部信息未被合约处理，则会出现退出码为 $130$ 的错误："Invalid incoming message"。 它通常发生在合约没有特定消息的接收器及其opcode 前缀(32位整数头)。

考虑下列合约：

```tact
import "@stdlib/deploy";

contract Dummy with Deployable {}
```

如果尝试发送任何消息，除了 [`@stdlib/deploy`](/zh-cn/ref/stdlib-deploy)提供的 [`部署{:tact}`](/zh-cn/ref/stdlib-deploy#deploy)，合约将没有接收器，因此会抛出错误，退出码为 $130$。

### 131: Constraints error {#131}

限制错误。 保留，但从未抛出。

### 132: Access denied {#132}

如果使用[`@stdlib/ownable`](/zh-cn/ref/stdlib-ownable)库中的[`Ownable{:tact}`](/zh-cn/ref/stdlib-ownable#ownable) [trait][ct]，由它提供的辅助函数 `requireOwner(){:tact}` 会在入站消息的发件人与指定的所有者不匹配时抛出一个退出码为 $132$ 的错误：`Access denied`。

```tact
import "@stdlib/ownable";

contract Hal9k with Ownable {
    owner: Address;

    init(owner: Address) {
        self.owner = owner; // set the owner address upon deployment
    }

    receive("I'm sorry Dave, I'm afraid I can't do that.") {
        // Checks that the message sender's address equals to the owner address,
        // and if not — throws an error with exit code 132.
        self.requireOwner();

        // ... you do you ...
    }
}
```

### 133: Contract stopped {#133}

合约已停止 - 已向停止的合约发送信息 保留。

### 134: Invalid argument {#134}

如果参数值无效或出乎意料，则会出现退出码为 $134$ 的错误："无效参数"。

以下是Tact 中的一些函数，这些函数可能导致此退出码出现错误：

1. [`Int.toFloatString(digits){:tact}`](/zh-cn/ref/core-strings#inttofloatstring)：如果 `digits` 不在区间：$0 < $ `digits` $ < 78$。

2. [`String.fromBase64(){:tact}`](/zh-cn/ref/core-strings#stringfrombase64)和[`Slice.fromBase64(){:tact}`](/zh-cn/ref/core-strings#slicefrombase64)：如果给定的[`String{:tact}`][p]或[`Slice{:tact}`][slice]包含非 Base64 字符。

```tact
try {
    // 0 is code of NUL in ASCII and it is not valid Base64
    let code: Slice = beginCell().storeUint(0, 8).asSlice().fromBase64();
} catch (exitCode) {
    // exitCode is 134
}
```

### 135: Code of a contract was not found {#135}

如果合约代码与 TypeScript 封装程序中保存的代码不匹配，则会出现退出码为 $135$ 的错误："未找到合约代码"。

### 136: Invalid address {#136}

类型 [`Address{:tact}`][p] 的值在如下情况下有效：

- 它占用 $267$ 位： $11$ 位用于链 ID 前缀， $256$ 位用于[地址本身](https://docs.ton.org/learn/overviews/addresses#address-of-smart-contract)。
- 它属于两者之一：basechain(ID $0$) 或masterchain (ID $-1$)，后者需要启用 [masterchain support](/zh-cn/book/masterchain#support)。

如果 [`地址{:tact}`][p]无效，则会出现退出码为 $136$ 的错误：`无效地址`。

```tact
// Only basechain (ID 0) or masterchain (ID -1) are supported by Tact
let unsupportedChainID = 1;

try {
    // Zero address in unsupported workchain
    dump(newAddress(unsupportedChainID, 0));
} catch (exitCode) {
    // exitCode is 136
}
```

### 137: Masterchain support is not enabled for this contract {#137}

在未[启用主链支持](/zh-cn/book/masterchain#support)的情况下，任何指向主链（ID $-1$）或以其他方式与之交互的尝试都会产生异常，退出码为 $137$："此合约未启用主链支持"。

```tact
let masterchainID = -1;

try {
    // Zero address in masterchain without the config option set
    dump(newAddress(masterchainID, 0));
} catch (exitCode) {
    // exitCode is 137
}
```

[p]: /zh-cn/book/types#primitive-types
[ct]: /zh-cn/book/types#composite-types
[cell]: /zh-cn/book/cells
[builder]: /zh-cn/book/cells#builders
[slice]: /zh-cn/book/cells#slices
[message]: /zh-cn/book/structs-and-messages#messages
[tlb]: https://docs.ton.org/develop/data-formats/tl-b-language
[tvm]: https://docs.ton.org/learn/tvm-instructions/tvm-overview
[bp]: https://github.com/ton-org/blueprint
[sb]: https://github.com/ton-org/sandbox
[jest]: https://jestjs.io



================================================
FILE: docs/src/content/docs/zh-cn/book/expressions.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/expressions.mdx
================================================
---
title: 表达式
description: 此页列出了Tact中的所有表达式
---

Tact 中的每个运算符都能构成一个表达式，但 Tact 还提供了更多的表达式选项供您选择。

:::note

  当前允许的最大嵌套级别是 $83$。 试图写入更深的表达式会导致编译错误：

```tact
fun elegantWeaponsForCivilizedAge(): Int {
    return
    ((((((((((((((((((((((((((((((((
        ((((((((((((((((((((((((((((((((
            (((((((((((((((((((( // 84 parens, compilation error!
                42
            ))))))))))))))))))))
        ))))))))))))))))))))))))))))))))
    ))))))))))))))))))))))))))))))));
}
```

:::

## 字面量

字面量表示 Tact 中的值。 这些是固定值，而不是变量，是您在代码中实际提供的。 Tact 中的所有字面量都是表达式本身。

您还可以调用定义在某些 [基元类型][p]上的 [扩展函数](/zh-cn/book/functions#extension-function)，这些 [基元类型][p] 与字面值相对应：

```tact
// Calling toString() defined for Int on a integer literal:
42.toString();

// Calling asComment() defined for String on a string literal:
"Tact is awesome!".asComment();C
```

### 整数字面量 {#integer-literals}

整数字面量可以使用以下表示法编写：[十进制](/zh-cn/book/integers#decimal)（基数 $10$）、[十六进制](/zh-cn/book/integers#hexadecimal)（基数 $16$）、[八进制](/zh-cn/book/integers#octal)（基数 $8$）和[二进制](/zh-cn/book/integers#binary)（基数 $2$）表示法：

- 一个 [_十进制_ 整数](/zh-cn/book/integers#decimal) 字面量是一个数字序列（$\mathrm{0 - 9}$）。

- 一个前导的 $\mathrm{0x}$（或 $\mathrm{0X}$）表示一个 [十六进制整数](/zh-cn/book/integers#hexadecimal) 字面量。 它们可以包括数字（$\mathrm{0 - 9}$）和字母 $\mathrm{a - f}$ 和 $\mathrm{A - F}$。 请注意，字符的大小写不会改变其值。 前导 $\mathrm{0x}$（或 $\mathrm{0X}$）表示[十六进制整数](/zh-cn/book/integers#hexadecimal) 字面量。 它们可以包括数字（$\mathrm{0 - 9}$）和字母 $\mathrm{a - f}$ 和 $\mathrm{A - F}$。 请注意，字符的大小写不会改变其值。 因此：$\mathrm{0xa}$ = $\mathrm{0xA}$ = $10$ 和 $\mathrm{0xf}$ = $\mathrm{0xF}$ = $15$。

- 前导 $\mathrm{0o}$（或 $\mathrm{0O}$）表示 [八进制整数](/zh-cn/book/integers#octal) 字面量。 它们只能包括数字 $\mathrm{0 - 7}$。

- 前导 $\mathrm{0b}$（或 $\mathrm{0B}$）表示 [二进制整数](/zh-cn/book/integers#binary) 字面量。 它们只能包括数字 $0$ 和 $1$。 它们只能包括数字 $0$ 和 $1$。

:::caution
  需要注意的是，在 Tact 中，以 $0$ 为前导的整数字面量仍被视为小数，而在 JavaScript/TypeScript 中，以 $0$ 为前导的整数字面量表示八进制！
:::

整数字面量的一些示例：

```tact
// decimal, base 10:
0, 42, 1_000, 020

// hexadecimal, base 16:
0xABC, 0xF, 0x0011

// octal, base 8:
0o777, 0o001

// binary, base 2:
0b01111001_01101111_01110101_00100000_01100001_01110010_01100101_00100000_01100001_01110111_01100101_01110011_01101111_01101101_01100101
```

有关整数和 [`Int{:tact}`](/zh-cn/book/integers)类型的更多信息，请访问专门页面：[整数](/zh-cn/book/integers)。

### 布尔字面量

[`Bool{:tact}`](/zh-cn/book/types#booleans)类型只有两个字面值：`true{:tact}`和`false{:tact}`。

```tact
true == true;
true != false;
```

有关布尔和 [`Bool{:tact}`](/zh-cn/book/types#booleans)类型的更多信息，请参阅专门章节：[布尔](/zh-cn/book/types#booleans)。

### 字符串字面量 {#string-literals}

字符串字面量是用双引号（`"`"）括起来的零个或多个字符。 字符串字面量是用双引号（`"`"）括起来的零个或多个字符。 所有字符串字面量都是 [`String{:tact}`][p]类型的对象。

```tact
"foo";
"1234";
```

Tact 字符串支持一系列从反斜杠字符开始的[转义序列](https://en.wikipedia.org/wiki/Escape_sequence)：

- `\\{:tact}` - 字面反斜线
- `\"{:tact}` - 双引号
- `\n{:tact}` - 换行
- `\r{:tact}` - 回车
- `\t{:tact}` - 制表符
- `\v{:tact}` — 垂直制表符 (vertical tab)。
- `\b{:tact}` — 退格符 (backspace)。
- `\f{:tact}` — 换页符 (form feed)。
- `\x00{:tact}`至`\xFF{:tact}` - [代码点](https://en.wikipedia.org/wiki/Code_point)，长度必须正好是两个十六进制数字
- `\u0000{:tact}`至`\uFFFF{:tact}` - [Unicode 代码点][unicode]，长度必须正好是四个十六进制数字
- `\u{0}{:tact}` 到 `\u{10FFFF}{:tact}` - [Unicode 代码点][unicode]，长度可以是 $1$ 到 $6$ 的十六进制数

[unicode]: https://en.wikipedia.org/wiki/Unicode#Codespace_and_code_points

```tact
// \\
"escape \\ if \\ you \\ can \\";

// \"
"this \"literally\" works";

// \n
"line \n another line";

// \r
"Shutters \r Like \r This \r One";

// \t
"spacing \t granted!";

// \v
"those \v words \v are \v aligned";

// \b
"rm\b\bcreate!";

// \f
"form \f feed";

// \x00 - \xFF
"this \x22literally\x22 works"; // \x22 represents a double quote

// \u0000 - \uFFFF
"danger, \u26A1 high voltage \u26A1"; // \u26A1 represents the ⚡ emoji

// \u{0} - \u{10FFFF}
"\u{1F602} LOL \u{1F602}"; // \u{1F602} represents the 😂 emoji
```

:::note

  阅读更多关于字符串和[`String{:tact}`][p]类型：\
  [书中的原始类型][p]\
  [参考资料中的字符串和字符串构造器](/zh-cn/ref/core-strings)的内容

:::

### `null` 字面量

`空{:tact}`值将以`null{:tact}` 字面形式写入。 它**不是**[标识符](#identifiers)，也不指向任何对象。 它也**不是**[原始类型][p]的实例。 相反，`null{:tact}` 表示缺乏识别以及故意不设置任何值。

```tact
let var: Int? = null; // variable, which can hold null value
var = 42;
if (var != null) {
    var!! + var!!;
}
```

有关使用 `null{:tact}`的更多信息，请访问专门页面：[选项](/zh-cn/book/optionals)。

## 标识符 {#identifiers}

标识符是代码中的一串字符，用于标识[变量](/zh-cn/book/statements#let)、[常量](/zh-cn/book/constants)、[映射](/zh-cn/book/maps)和[函数](/zh-cn/book/functions)，以及[结构][s]、[消息][m]、[合约](/zh-cn/book/contracts)、[trait](/zh-cn/book/types#traits)或它们的字段和方法。 标识符区分大小写，不加引号。 标识符区分大小写，不加引号。

在 Tact 中，标识符可以包含拉丁小写字母 (`a-z`)、拉丁大写字母 (`A-Z`)、下划线 (`_`)和数字 ($\mathrm{0 - 9}$)，但不能以数字开头。  标识符与 [字符串](#string-literals) 的区别在于，字符串是数据，而标识符是代码的一部分。

请注意，当[基元类型][p]的标识符以大写字母开头时。 请注意，当[基元类型][p]的标识符以大写字母开头时。 已使用定义的 [复合类型](/zh-cn/book/types#composite-types)，如 [Structs][s] 和 [Messages][m] 也必须大写。

## 实例化 {#instantiation}

您可以创建以下类型的实例：

- [结构][s]
- [信息][m]

```tact
struct StExample {
    fieldInit: Int = 1;
    fieldUninit: Int;
}

fun example() {
    // Instance with default value of fieldInit
    StExample{ fieldUninit: 2 };

    // Instance with both fields set
    StExample{
        fieldInit: 0,
        fieldUninit: 2, // trailing comma is allowed
    };
}
```

## 字段访问

您可以直接访问以下类型的字段：

- [结构][s]
- [信息][m]

```tact
struct StExample {
    fieldInit: Int = 1;
    fieldUninit: Int;
}

fun example(): Int {
    let struct: StExample = StExample{ fieldUninit: 2 }; // instantiation

    struct.fieldInit;          // access a field
    return struct.fieldUninit; // return field value from the function
}
```

## 扩展函数调用

[扩展函数](/zh-cn/book/functions#extension-function)仅在特定类型中定义。  它们的调用方式类似于许多其他语言中的方法调用：

```tact
42.toString(); // toString() is a stdlib function that is defined on Int type
```

## 静态函数调用 {#static-function-call}

在函数体的任何位置，都可以调用全局 [static function](/zh-cn/book/functions#global-static-functions) 或 [contract](/zh-cn/book/contracts) 的内部函数：

```tact
contract ExampleContract {
    receive() {
        now(); // now() is a static function of stdlib
        let expiration: Int = now() + 1000; // operation and variable definition
        expiration = self.answerQuestion(); // internal function
    }
    fun answerQuestion(): Int {
        return 42;
    }
}
```

## `initOf`

表达式 `initOf{:tact}` 计算 [contract](/zh-cn/book/contracts) 的初始状态 (`StateInit{:tact}`)：

```tact
//                     argument values for the init() function of the contract
//                     ↓   ↓
initOf ExampleContract(42, 100); // returns a Struct StateInit{}
//     ---------------
//     ↑
//     name of the contract
//     ↓
//     ---------------
initOf ExampleContract(
    42,  // first argument
    100, // second argument, trailing comma is allowed
);
```

其中，`StateInit{:tact}`是一个内置[结构][s]，由以下部分组成：

| 字段   | 类型                  | 说明
| :----- | :-------------------- | :---
| `code` | [`Cell{:tact}`][cell] | [合约](/zh-cn/book/contracts)的初始代码（编译后的字节码）
| `data` | [`Cell{:tact}`][cell] | [合约](/zh-cn/book/contracts)的初始数据（合约的 `init(){:tact}`函数参数）

[p]: /zh-cn/book/types#primitive-types
[cell]: /zh-cn/book/cells#cells
[s]: /zh-cn/book/structs-and-messages#structs
[m]: /zh-cn/book/structs-and-messages#messages



================================================
FILE: docs/src/content/docs/zh-cn/book/external.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/external.mdx
================================================
---
title: 外部信息
description: 外部信息没有发件人，任何人都可以从链下发送信息
---

:::caution
  根据[#384](https://github.com/tact-lang/tact-docs/issues/384)，该页面正在重新构建中。 所有锚点链接 (#\`) 将来可能会改变！
:::

:::caution
  必须在项目配置中明确启用外部信息支持。
  如果不启用它，编译工作就会失败。
:::

外部信息是没有发件人的信息，世界上任何人都可以发送。 外部信息是与链外系统集成或对合约进行一般维护的良好工具。 处理外部信息与处理内部信息不同。 本节将介绍如何处理外部信息。

## 外部信息有何不同

外部消息不同于内部消息，其方式如下：

### 合约自行支付gas使用费

在处理内部信息时，发件人通常会支付gas使用费。 在处理外部信息时，合同支付gas使用费。 这意味着您需要谨慎使用外部信息中的 gas 。 您应该经常测试合约的gas使用情况，并确认一切正常。

### 信息必须手动接收

外部信息不会自动接收。 您需要手动接受它们。 这是通过调用 `acceptMessage` 函数实现的。 如果不调用 `acceptMessage` 函数，信息将被拒绝。 这样做是为了防止外部信息垃圾消息。

### 接受信息前的 10k  gas 限值

10k  gas 是一个非常小的限制，而 Tact 本身在到达你的代码之前就已经消耗了相当数量的 gas 。  您接受 gas 后，合约可以随意使用 gas 。 这样做是为了允许合约进行任何类型的处理。 您应该经常测试合约的 gas 使用情况，并验证一切正常，避免出现可能耗尽合约余额的漏洞。

:::tip[Hey there!]

  外部信息的 10k gas限制是基于
  验证器为整个区块链的 "gas_limit "字段设置的参数。 您可以在这里带上
  引用：

- https://docs.ton.org/develop/smart-contracts/guidelines/accept#external-messages
- https://docs.ton.org/develop/howto/blockchain-configs#param-20-and-21

:::

### 接受消息后未限定的gas使用

您接受 gas 后，合约可以随意使用 gas 。 这样做是为了允许合约进行任何类型的处理。 您应该经常测试合约的 gas 使用情况，并验证一切正常，避免出现可能耗尽合约余额的漏洞。

### 暂无可用上下文

处理外部消息时，`context` 和 `sender` 两个函数不可用。 这是因为外部信息没有上下文。 这意味着您不能在外部信息中使用 `context` 和 `sender` 函数。 您需要仔细测试您的合约，确保它没有使用 `context` 和 `sender` 函数。

## 启用外部信息支持

要启用外部信息支持，请在项目配置文件中启用：

```json
{
  "options": {
    "external": true
  }
}
```

## 外部接收器(External receivers)

外部接收器的定义方式与内部接收器相同，但使用“external”关键字而不是“receive”关键字：

```tact
contract SampleContract {
    external("Check Timeout") {

        // Check for contract timeout
        require(self.timeout > now(), "Not timeouted");

        // Accept message
        acceptMessage();

        // Timeout processing
        self.onTimeouted();
    }
}
```



================================================
FILE: docs/src/content/docs/zh-cn/book/func.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/func.mdx
================================================
---
title: 与 func 的兼容性
description: Tact 编译为 FunC，并将其所有实体直接映射到各种 FunC 和 TL-B 类型。
---

Tact 本身编译为 FunC，并将其所有实体直接映射到各种 FunC 和 TL-B 类型。

## 转换类型 {#convert-types}

Tact 中的 [原始类型](/zh-cn/book/types#primitive-types)可直接映射到 FunC 中的类型。

复制变量的所有规则都是一样的。 所有关于复制变量的规则都是一样的。其中一个最大的不同是，在 Tact 中没有可见的突变(mutation)操作符，大多数 [`slice{:tact}`](/zh-cn/book/cells#slices)操作都是就地突变变量。

## 转换序列化 {#convert-serialization}

在 Tact 中，[Structs](/zh-cn/book/structs-and-messages#structs)和[Messages](/zh-cn/book/structs-and-messages#messages)的序列化是自动进行的，不像 FunC 需要手动定义序列化逻辑。

Tact 的自动布局算法是贪婪的。 这意味着它会获取下一个变量，计算其大小，并尝试将其放入当前cell中。 如果不合适，它会创建一个新cell并继续。 自动布局的所有内部结构在分配前都会被扁平化。

除了 [`Address{:tact}`](/zh-cn/book/types#primitive-types) 以外，所有可选类型在 TL-B 中都序列化为 `Maybe`。

没有对 `Either` 的支持，因为它没有定义在某些情况下序列化时应选择什么。

### 实例

```tact
// _ value1:int257 = SomeValue;
struct SomeValue {
    value1: Int; // Default is 257 bits
}
```

```tact
// _ value1:int256 value2:uint32 = SomeValue;
struct SomeValue {
    value1: Int as int256;
    value2: Int as uint32;
}
```

```tact
// _ value1:bool value2:Maybe bool = SomeValue;
struct SomeValue {
    value1: Bool;
    value2: Bool?;
}
```

```tact
// _ cell:^cell = SomeValue;
struct SomeValue {
    cell: Cell; // Always stored as a reference
}
```

```tact
// _ cell:^slice = SomeValue;
struct SomeValue {
    cell: Slice; // Always stored as a reference
}
```

```tact
// _ value1:int256 value2:int256 value3:int256 ^[value4:int256] = SomeValue;
struct SomeValue {
    value1: Int as int256;
    value2: Int as int256;
    value3: Int as int256;
    value4: Int as int256;
}
```

```tact
// _ value1:int256 value2:int256 value3:int256 ^[value4:int256] flag:bool = SomeValue;
struct SomeValue {
    value1: Int as int256;
    value2: Int as int256;
    value3: Int as int256;
    flag: Bool; // Flag is written before value4 to avoid auto-layout to allocate it to the next cell
    value4: Int as int256;
}
```

```tact
// _ value1:int256 value2:int256 value3:int256 ^[value4:int256 flag:bool] = SomeValue;
struct SomeValue {
    value1: Int as int256;
    value2: Int as int256;
    value3: Int as int256;
    value4: Int as int256;
    flag: Bool;
}
```

```tact
// _ value1:int256 value2:^TailString value3:int256 = SomeValue;
struct SomeValue {
    value1: Int as int256;
    value2: String;
    value3: Int as int256;
}
```

## 将收到的信息转换为 `op` 操作 {#convert-received-messages-to-op-operations}

Tact 会为每条接收到的键入信息生成一个唯一的 `op`，但它可以被覆盖。

下面是 FunC 中的代码

```func
() recv_internal(int msg_value, cell in_msg_cell, slice in_msg) impure {
    ;; incoming message code...

    ;; Receive MessageWithGeneratedOp message
    if (op == 1180414602) {
        ;; code...
    }

    ;; Receive MessageWithOverwrittenOP message
    if (op == 291) {
        ;; code...
    }

}
```

在 Tact 中变成了这样：

```tact
message MessageWithGeneratedOp {
    amount: Int as uint32;
}

message(0x123) MessageWithOverwrittenOP {
    amount: Int as uint32;
}

contract Contract {
    // Contract Body...

    receive(msg: MessageWithGeneratedOp) {
        // code...
    }

    receive(msg: MessageWithOverwrittenOP) {
        // code...
    }

}
```

## 转换 `get`-methods

你可以用与 FunC 的 `get` 方法兼容的 Tact 来表达除 `list-style-lists` 以外的所有内容。

### 基本返回类型

如果一个 `get` 方法在 FunC 中返回一个基元，那么在 Tact 中也可以用同样的方法实现它。

下面是 FunC 中的代码

```func
int seqno() method_id {
    return 0;
}
```

在 Tact 中变成了这样：

```tact
get fun seqno(): Int {
    return 0;
}
```

### 张量(Tensor)返回类型

在 FunC 中，张量类型 `(int, int){:func}` 和 `(int, (int)){:func}` 是有区别的，但对于 TVM 来说没有区别，它们都表示两个整数的堆栈。

要转换从 FunC `get` 方法返回的张量，需要定义一个 [Struct](/zh-cn/book/structs-and-messages#structs)，它与张量的字段类型相同，顺序也相同。

下面是 FunC 中的代码

```func
(int, slice, slice, cell) get_wallet_data() method_id {
    return ...;
}
```

在 Tact 中变成了这样：

```tact
struct JettonWalletData {
    balance: Int;
    owner: Address;
    master: Address;
    walletCode: Cell;
}

contract JettonWallet {
    get fun get_wallet_data(): JettonWalletData {
        return ...;
    }
}
```

### 元组(Tuple)返回类型

在 FunC 中，如果返回的是元组而不是张量，则需要遵循张量类型的流程，但要将 “get ”方法的返回类型定义为可选类型。

下面是 FunC 中的代码

```func
[int, int] get_contract_state() method_id {
    return ...;
}
```

在 Tact 中变成了这样：

```tact
struct ContractState {
    valueA: Int;
    valueB: Int;
}

contract StatefulContract {
    get fun get_contract_state(): ContractState? {
        return ...;
    }
}
```

### 混合元组(tuple)和张量(tensor)返回类型

如果某些张量是元组，则需要像前面的步骤一样定义结构体，而元组必须定义为单独的 [Struct](/zh-cn/book/structs-and-messages#structs)。

下面是 FunC 中的代码

```func
(int, [int, int]) get_contract_state() method_id {
    return ...;
}
```

在 Tact 中变成了这样：

```tact
struct ContractStateInner {
    valueA: Int;
    valueB: Int;
}

struct ContractState {
    valueA: Int;
    valueB: ContractStateInner;
}

contract StatefulContract {
    get fun get_contract_state(): ContractState {
        return ...;
    }
}
```

### 参数映射

get方法参数的转换过程非常直接。 每个参数按原样映射为 FunC 的参数，每个元组映射为一个 [Struct](/zh-cn/book/structs-and-messages#structs)。

下面是 FunC 中的代码

```func
(int, [int, int]) get_contract_state(int arg1, [int,int] arg2) method_id {
    return ...;
}
```

在 Tact 中变成了这样：

```tact
struct ContractStateArg2 {
    valueA: Int;
    valueB: Int;
}

struct ContractStateInner {
    valueA: Int;
    valueB: Int;
}

struct ContractState {
    valueA: Int;
    valueB: ContractStateInner;
}

contract StatefulContract {
    get fun get_contract_state(arg1: Int, arg2: ContractStateArg2): ContractState {
        return ContractState {
            valueA: arg1,
            valueB: ContractStateInner {
                valueA: arg2.valueA,
                valueB: arg2.valueB, // trailing comma is allowed
            }, // trailing comma is allowed
        };
    }
}
```



================================================
FILE: docs/src/content/docs/zh-cn/book/functions.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/functions.mdx
================================================
---
title: 函数
description: 全局、汇编、本地函数，以及接收器、获取器和存储函数，加上许多允许Tact语言具有极大灵活性和表达能力的属性
---

import { Badge } from '@astrojs/starlight/components';

在 Tact 中，函数可以通过不同的方式定义：

- 全局静态函数
- 扩展函数
- 可变函数
- 原生函数
- 接收器(Receiver)函数
- 获取器(getter)函数

除了 [接收器函数](#receiver-functions)，所有函数的定义（参数列表）和调用（参数列表）都可以使用逗号：

```tact
fun foo(
    a: Int, // trailing comma in parameter lists is allowed
) {}

fun bar() {
    foo(
        5, // trailing comma in argument lists is allowed too!
    );
}
```

## 全局静态函数 {#global-static-functions}

您可以在程序的任何地方定义全局函数：

```tact
fun customPow(a: Int, c: Int): Int {
  let res: Int = 1;
  repeat(c) {
    res *= a;
  }
  return res;
}
```

## 虚拟和抽象函数 {#virtual-and-abstract-functions}

如果 [traits](/zh-cn/book/types#traits) 有 `virtual{:tact}` 关键字，则可以使用 `override{:tact}` 允许继承 [traits](/zh-cn/book/types#traits) 的合约修改内部函数。  函数也可以标记为 `abstract{:tact}`，在这种情况下，继承合约必须定义其实现：

```tact
trait FilterTrait with Ownable {
    // 此 trait 的用户可以重写虚拟函数
    virtual fun filterMessage()：Bool {
        return sender() != self.owner;
    }

    abstract fun specialFilter()：Bool;
}

带有 FilterTrait 的合约 Filter {
    // 覆盖 FilterTrait 的默认行为
    override fun filterMessage()：Bool {
        return true;
    }

    override fun specialFilter()：Bool {
        return true;
    }
}
```

## 扩展函数 {#extension-function}

扩展函数允许你为任何可能的类型实现扩展。

> **警告**
> 第一个参数的名称必须名为 `self`，该参数的类型必须是你要扩展的类型。

```tact
extends fun pow(self: Int, c: Int) {
  let res: Int = 1;
  repeat(c) {
    res = res * self;
  }
  return res;
}
```

## 可变函数

可变函数是对值进行变更，将其替换为执行结果。 可变函数是对数值进行变异，用执行结果代替数值。 要执行突变，函数必须改变 `self` 值。

```tact
extends mutates fun customPow(self: Int, c: Int) {
    let res: Int = 1;
    repeat(c) {
        res *= self;
    }
    self = res;
}
```

## 原生函数

原生函数是 FunC 函数的直接绑定：

> **注**
> 原生函数也可以是可变函数和扩展函数。

```tact
@name(store_uint)
native storeUint(s: Builder, value: Int, bits: Int): Builder;

@name(load_int)
extends mutates native loadInt(self: Slice, l: Int): Int;
```

## 接收器函数 {#receiver-functions}

接收器函数是负责在合约中接收信息的特殊函数，只能在合约或trait中定义。

```tact
contract Treasure {
    // This means that this contract can receive the comment "Increment" and this function would be called for such messages
    receive("Increment") {
        self.counter += 1;
    }
}
```

## 获取器函数 {#getter-functions}

获取器函数定义智能合约上的获取器，只能在合约或特征中定义。
Getter 函数不能用来读取其他合约的状态：如果您需要获取一些数据，您需要通过发送带有请求的消息和定义接收器来读取请求答案。

```tact
contract Treasure {
    get fun counter(): Int {
        return self.counter;
    }
}
```

### 明确解决方法 ID 碰撞的问题

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

与 TON 合约中的其他函数一样，getter 函数都有其 _唯一_ 的关联函数选择器，它们是 $19$ 位有符号整数标识符，通常称为 _方法 ID_。

getter 的方法 ID 是使用 [CRC16](https://en.wikipedia.org/wiki/Cyclic_redundancy_check) 算法从其名称派生的，如下所示：`(crc16(<function_name>) & 0xffff) | 0x10000`。此外，Tact 编译器有条件地保留一些方法 ID 用于[支持的接口的 getter](/book/contracts#interfaces)，即：$113617$ 用于 `supported_interfaces`，$115390$ 用于 `lazy_deployment_completed`，以及 $121275$ 用于 `get_abi_ipfs`。

有时，不同名称的 getter 最终会得到相同的方法 ID。如果发生这种情况，您可以重命名某些 getter，或者手动指定方法 ID 作为[编译时](/zh-cn/ref/core-comptime)表达式，如下所示：


```tact
contract ManualMethodId {
    const methodId: Int = 16384 + 42;

    get(self.methodId) fun methodId1(): Int {
        return self.methodId;
    }

    get(crc32("crc32") + 42 & 0x3ffff | 0x4000)
    fun methodId2(): Int {
        return 0;
    }
}
```

请注意，_不能_使用 TVM 保留的方法 ID，也不能使用某些初始正整数，因为编译器会将其用作函数选择器。

用户指定的方法 ID 是 19 位有符号整数，因此可以使用从 $-2^{18}$ 到 $-5$ 以及从 $2^{14}$ 到 $2^{18}$ 的整数。- 1$.

此外，还有一些方法 ID 是为 Tact 编译器在编译过程中插入的获取器保留的，它们是 113617、115390 和 121275。



================================================
FILE: docs/src/content/docs/zh-cn/book/import.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/import.mdx
================================================
---
title: 导入代码
description: Tact 允许您导入 Tact 和 FunC 代码，并拥有一套通用的标准库
---

Tact 允许您导入 Tact 和 [FunC](https://docs.ton.org/develop/func/overview) 代码--任何给定的 `.tact` 或 `.fc`/`.func` 文件都可以使用 `import{:tact}` 关键字导入到您的项目中。

此外，Tact 编译器还拥有一套通用的标准库，这些标准库捆绑在 Tact 编译器中，但并不立即包含在 Tact 编译器中，请参阅 [标准库概述](/zh-cn/ref/standard-libraries)。

:::caution

  注意：所有导入的代码都会与您的代码合并在一起，因此必须避免名称冲突，并始终仔细检查源代码！

:::

## 导入 Tact 代码

使用 `import{:tact}` 语句并提供目标 `.tact` 文件的相对路径，可以导入任何 Tact 代码：

```tact
import "./relative/path/to/the/target/tact/file.tact";
```

也可以指定父目录 (`../`)：

```tact
import "../subfolder/imported/file.tact";
```

## 导入 FunC 代码

可以直接导入用FunC代码编写的代码，就像导入Tact代码一样：

```tact
// Relative import
import "./relative/path/to/the/target/func/file.fc";

// Specifying parent directories
import "../subfolder/imported/func/file.fc";
```

但要使用此类文件中的函数，必须先将它们声明为 `native` 函数。 例如，当标准库 [@stdlib/dns](/zh-cn/ref/stdlib-dns) 使用 `dns.fc` FunC 文件时，它会将 FunC 函数映射到 Tact 函数，如下所示：

```tact
// FunC code located in a file right next to the current Tact one:
import "./dns.fc";

// Mapping function signatures from FunC to Tact:
@name(dns_string_to_internal)
native dnsStringToInternal(str: String): Slice?;
```

## 标准库

参见 [标准库概述](/zh-cn/ref/standard-libraries)。



================================================
FILE: docs/src/content/docs/zh-cn/book/index.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/index.mdx
================================================
---
title: 图书概览
description: 书籍部分 - 关于 Tact 语言的入门书籍
---

import { LinkCard, CardGrid, Steps } from '@astrojs/starlight/components';

欢迎阅读**Tact Book**部分（或简称**The Book**）--一本关于Tact语言的入门书籍。

以下是其主要内容：

<Steps>

1. #### 速查表

   [Cheatsheets](/zh-cn/book/cs/from-func) 是关于 Tact 语法和习语的快速介绍，并与其他区块链语言（如 FunC（也在 TON 上）和 Solidity（以太坊区块链））进行了比较。  尽快使用这些来过渡到Tact。

   <CardGrid>
     <LinkCard
       title="Go to the first cheatsheet"
       href="/zh-cn/book/cs/from-func"
     />
   </CardGrid>

2. #### Book

   [**Tact Book**](/zh-cn/book/types) 是一套连贯、精简的 Tact 教育资料。 一般来说，它假定您是按从前到后的顺序阅读的。 后面的部分以前面部分的概念为基础，前面的部分可能不会深入探讨某个特定主题的细节，但会在后面的部分重新讨论该主题。 一般来说，它假定您是按从前到后的顺序阅读的。 后面的部分以前面部分的概念为基础，前面的部分可能不会深入探讨某个特定主题的细节，但会在后面的部分重新讨论该主题。

   此外，文档的语言部分也有许多参考资料，其中对语言的许多基元进行了更详细的描述。 此外，文档的语言部分也有许多参考资料，其中对语言的许多基元进行了更详细的描述。 此外，只要 TON 主文档中对更广泛的 TON 概念已有解释，本书也会尽量参考。

   本书还假定你用另一种编程语言编写过代码，但并不假定是哪一种。 我们努力让来自不同编程背景的人都能广泛获取这些材料。 我们没有花很多时间来讨论编程是什么或如何思考编程。 如果你是编程新手，最好阅读专门介绍编程的书籍。 我们努力使这些材料对各种编程背景的人都可以广泛理解。 我们没有花费很多时间去讨论编程是什么或如何思考编程。 如果你是编程新手，最好阅读专门介绍编程的书籍。

   <CardGrid>
     <LinkCard
       title="Proceed to the Book itself"
       href="/zh-cn/book/types"
     />
   </CardGrid>

</Steps>



================================================
FILE: docs/src/content/docs/zh-cn/book/integers.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/integers.mdx
================================================
---
title: 整数
description: TON 智能合约中的算术运算始终使用整数，从不使用浮点数
---

import { Badge } from '@astrojs/starlight/components';

TON 智能合约中的算术运算始终使用整数，从不使用浮点数，因为浮点数是[不可预测的](https://learn.microsoft.com/en-us/cpp/build/why-floating-point-numbers-may-lose-precision)。 因此，重点应放在整数及其处理上。

`Int{:tact}` 是一个 257 位的有符号整数类型。
它能够存储 $-2^{256}$ 和 $2^{256} - 1$ 之间的整数。

## 表示法

Tact 支持多种方式编写 `Int{:tact}` 的原始值作为[整数字面量](/zh-cn/book/expressions#integer-literals)。

大多数符号允许在数字之间添加下划线 (`_`)，但下列符号除外：

- 字符串表示法，如 [NanoToncoins](#nanotoncoin) 案例所示。
- 带前导零的十进制数 $0$。一般不鼓励使用，参见 [下文](#decimal)。

此外，**不允许**在 $4\_\_2$ 中连续使用多个下划线，或在 $42\_$ 中使用尾部下划线。

### 十进制 {#decimal}

最常见、最常用的数字表示方法，使用[十进制数字系统](https://en.wikipedia.org/wiki/Decimal)： $123456789$。\
您可以使用下划线（`_`）来提高可读性： $123\_456\_789$ 等于 $123456789$。

:::caution
  或者，您也可以在数字前加上一个 $0$，这样就禁止使用下划线，只允许使用十进制数字：$0123 = 123.$
  注意，**强烈建议**使用这种带前导零的符号，因为可能会与 TypeScript 中的八进制整数字面混淆，而 TypeScript 通常与 Tact 一起用于开发和测试合约。
:::

### 十六进制 {#hexadecimal}

使用[十六进制数字系统](https://en.wikipedia.org/wiki/Hexadecimal)表示数字，用 $\mathrm{0x}$（或 $\mathrm{0X}$）前缀表示：$\mathrm{0xFFFFFFFFF}$。
使用下划线（`_`）提高可读性：$\mathrm{0xFFF\_FFFF\_FFF}$ 等于 $\mathrm{0xFFFFFFFFF}$。

### 八进制 {#octal}

使用[八进制数字系统](https://en.wikipedia.org/wiki/Octal)表示数字，用 $\mathrm{0o}$（或 $\mathrm{0O}$）前缀表示：$\mathrm{0o777777777}$。
使用下划线（`_`）提高可读性：$\mathrm{0o777\_777\_777}$ 等于 $\mathrm{0o777777777}$。

### 二进制 {#binary}

使用[二进制数字系统](https://en.wikipedia.org/wiki/Binary_number)表示数字，用 $\mathrm{0b}$（或 $\mathrm{0B}$）前缀表示：$\mathrm{0b111111111}$。
使用下划线（`_`）提高可读性：$\mathrm{0b111\_111\_111}$ 等于 $\mathrm{0b111111111}$。

### NanoToncoins {#nanotoncoin}

与美元的运算要求小数点后保留两位小数——这些用于表示美分(cents)的值。 但是，如果我们只能用整数来表示数字 \$$1.25$ ，我们该如何表示呢？ 解决的办法是直接使用 _cents_。 这样， \$$1.25$ 就变成了 $125$ 美分。 我们只需记住最右边的两位数代表小数点后的数字。

同样，在使用 TON 区块链的主要货币 Toncoin 时，需要九位小数，而不是两位小数。 可以说，nanoToncoin是Toncoin的 $\frac{1}{10^{9}}\mathrm{th}$。

因此， $1.25$ Toncoin 的数量，可以用 Tact 表示为 [`ton("1.25"){:tact}`](/zh-cn/ref/core-comptime#ton)，实际上就是数字 $1250000000$。 我们称这样的数字为_nanoToncoin(s)_（或_nano-ton(s)）而不是_美分_。

## 序列化 {#serialization}

将 `Int{:tact}` 值编码为持久状态（[contracts](/zh-cn/book/contracts) 和 [traits](/zh-cn/book/types#traits) 的字段）时，通常最好使用比 $257$-bits 更小的表示形式，以降低[存储成本](https://docs.ton.org/develop/smart-contracts/fees#storage-fee)。 这些表示法的使用也被称为 "序列化"，因为它们代表了 TON 区块链运行的本地[TL-B][tlb]类型。

持久状态大小在状态变量的每个声明中都会在 `as{:tact}`关键字后指定：

```tact
contract SerializationExample {
    // persistent state variables
    oneByte: Int as int8 = 0; // ranges from -128 to 127 (takes 8 bit = 1 byte)
    twoBytes: Int as int16;   // ranges from -32,768 to 32,767 (takes 16 bit = 2 bytes)

    init() {
        // needs to be initialized in the init() because it doesn't have the default value
        self.twoBytes = 55*55;
    }
}
```

整数序列化也适用于 [Structs](/zh-cn/book/structs-and-messages#structs) 和 [Messages](/zh-cn/book/structs-and-messages#messages) 的字段，以及 [maps](/zh-cn/book/maps) 的键/值类型：

```tact
struct StSerialization {
    martin: Int as int8;
}

message MsgSerialization {
    seamus: Int as int8;
    mcFly: map<Int as int8, Int as int8>;
}
```

动机很简单：

- 在状态中存储 $1000$ 个 $257$ 位的整数[成本](https://docs.ton.org/develop/smart-contracts/fees#how-to-calculate-fees)大约为每年 $0.184$ TON。
- 相比之下，存储 $1000$ $32$-bit 整数每年只需花费 $0.023$ ton 。

### 常见序列化类型 {#common-serialization-types}

|  名称              | [TL-B][tlb]                 |      包含的范围                  |                          占用空间                          |
| :--------------: | :-------------------------: | :-------------------------: | :----------------------------------------------------: |
| `uint8{:tact}`   | [`uint8`][tlb-builtin]      | $0$ to $2^{8} - 1$          |                   $8$ bits = $1$ byte                  |
| `uint16{:tact}`  | [`uint16`][tlb-builtin]     | $0$ to $2^{16} - 1$         |                  $16$ bits = $2$ bytes                 |
| `uint32{:tact}`  | [`uint32`][tlb-builtin]     | $0$ to $2^{32} - 1$         |                  $32$ bits = $4$ bytes                 |
| `uint64{:tact}`  | [`uint64`][tlb-builtin]     | $0$ to $2^{64} - 1$         |                  $64$ bits = $8$ bytes                 |
| `uint128{:tact}` | [`uint128`][tlb-builtin]    | $0$ to $2^{128} - 1$        |                 $128$ bits = $16$ bytes                |
| `uint256{:tact}` | [`uint256`][tlb-builtin]    | $0$ to $2^{256} - 1$        |                 $256$ bits = $32$ bytes                |
| `int8{:tact}`    | [`int8`][tlb-builtin]       | $-2^{7}$ to $2^{7} - 1$     |                   $8$ bits = $1$ byte                  |
| `int16{:tact}`   | [`int16`][tlb-builtin]      | $-2^{15}$ to $2^{15} - 1$   |                  $16$ bits = $2$ bytes                 |
| `int32{:tact}`   | [`int32`][tlb-builtin]      | $-2^{31}$ to $2^{31} - 1$   |                  $32$ bits = $4$ bytes                 |
| `int64{:tact}`   | [`int64`][tlb-builtin]      | $-2^{63}$ to $2^{63} - 1$   |                  $64$ bits = $8$ bytes                 |
| `int128{:tact}`  | [`int128`][tlb-builtin]     | $-2^{127}$ to $2^{127} - 1$ |                 $128$ bits = $16$ bytes                |
| `int256{:tact}`  | [`int256`][tlb-builtin]     | $-2^{255}$ to $2^{255} - 1$ |                 $256$ bits = $32$ bytes                |
| `int257{:tact}`  | [`int257`][tlb-builtin]     | $-2^{256}$ to $2^{256} - 1$ |            $257$ bits = $32$ bytes + $1$ bit           |
| `coins{:tact}`   | [`VarUInteger 16`][varuint] | $0$ to $2^{120} - 1$        | between $4$ and $124$ bits，[见下文](#serialization-coins) |

### 任意位宽类型

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

除了 [常见序列化类型](#common-serialization-types)，还可以使用前缀 `int` 或 `uint` 后跟数字来指定任意位宽的整数。 例如，写入 `int7{:tact}` 表示有符号 $7$- 位整数。

`Int{:tact}` 类型的最小允许位宽是 $1$，而对于 `int` 前缀（有符号整数）最大是 $257$，对于 `uint` 前缀（无符号整数）最大是 $256$。

|  名称              | [TL-B][tlb]            |      包含的范围                      |                     占用空间                     |
| :--------------: | :--------------------: | :-----------------------------: | :------------------------------------------: |
| `uintX{:tact}`   | [`uintX`][tlb-builtin] | $0$ to $2^{X} - 1$              | $X$ bits, where $X$ is between $1$ and $256$ |
| `intX{:tact}`    | [`intX`][tlb-builtin]  | $-2^{X - 1}$ to $2^{X - 1} - 1$ | $X$ bits, where $X$ is between $1$ and $257$ |

### 变量 `coins` 类型 {#serialization-coins}

在 Tact 中，`coins{:tact}` 是[TL-B][tlb]表示法中[`VarUInteger 16`][varuint]的别名，即根据存储给定整数所需的最佳字节数，它的位长是可变的，通常用于存储[nanoToncoin](/zh-cn/book/integers#nanotoncoin)金额。

这种序列化格式包括两个 [TL-B 字段](https://docs.ton.org/develop/data-formats/tl-b-language#field-definitions)：

- `len`，一个 $4$位无符号大二进制整数，存储所提供值的字节长度
- `value`，即所提供值的 $8 * len$ 位无符号大二进制表示法

也就是说，序列化为 `coins{:tact}` 的整数占用 $4$ 至 $124$ 位（`len`为$4$ 位，`value`为 $0$ 至 $15$ 字节），其值范围为 $0$ 至 $2^{120} - 1$ 之间。

例如

```tact
struct Scrooge {
    // len: 0000, 4 bits (always)
    // value: none!
    // in total: 4 bits
    a: Int as coins = 0; // 0000

    // len: 0001, 4 bits
    // value: 00000001, 8 bits
    // in total: 12 bits
    b: Int as coins = 1; // 0001 00000001

    // len: 0010, 4 bits
    // value: 00000001 00000010, 16 bits
    // in total: 20 bits
    c: Int as coins = 258; // 0010 00000001 00000010

    // len: 1111, 4 bits
    // value: hundred twenty 1's in binary
    // in total: 124 bits
    d: Int as coins = pow(2, 120) - 1; // hundred twenty 1's in binary
}
```

:::note

  点击此处阅读有关序列化的更多信息：[与 FunC 兼容](/zh-cn/book/func#convert-serialization)

:::

## 操作 {#operations}

所有数字的运行时计算都是在 257 位完成的，因此 [溢出](https://en.wikipedia.org/wiki/Integer_overflow) 非常罕见。  不过，如果任何数学运算出现溢出，就会抛出异常，事务也会失败。 可以说，Tact 的数学默认是安全的。

请注意，在同一计算中混合使用 [不同状态大小](#serialization) 的变量是没有问题的。  在运行时，无论是什么，它们都是相同类型的——$257$-bit带符号，因此不会发生溢出。

然而，这仍可能导致交易的[计算阶段](https://docs.ton.org/learn/tvm-instructions/tvm-overview#compute-phase)**错误**。 请看下面的例子：

```tact
contract ComputeErrorsOhNo {
    oneByte: Int as uint8; // persistent state variable, max value is 255

    init() {
        self.oneByte = 255; // initial value is 255, everything fits
    }

    receive() { cashback(sender()) } // for the deployment

    receive("lets break it") {
        let tmp: Int = self.oneByte * 256; // no runtime overflow
        self.oneByte = tmp; // whoops, tmp value is out of the expected range of oneByte
    }
}
```

这里，`oneByte` 被序列化为 [`uint8`](#common-serialization-types)，只占用一个字节，范围从 $0$ 到 $2^8 - 1$，即 $255$。 在运行时计算中使用时，不会发生溢出，所有计算结果都是 $257$- 位有符号整数。 但是，就在我们决定将 `tmp` 的值存储回 `oneByte` 的那一刻，我们收到了一个错误，[退出码 5](/zh-cn/book/exit-codes#5)，错误信息如下：整数超出预期范围。

:::caution
  因此，在使用序列化时，对数字要**非常**小心，并始终仔细检查计算结果。
:::

[tlb]: https://docs.ton.org/develop/data-formats/tl-b-language
[tlb-builtin]: https://docs.ton.org/develop/data-formats/tl-b-language#built-in-types
[varuint]: https://docs.ton.org/develop/data-formats/msg-tlb#varuinteger-n



================================================
FILE: docs/src/content/docs/zh-cn/book/lifecycle.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/lifecycle.mdx
================================================
---
title: 消息生命周期
description: 在TON区块链上的每笔交易都有多个阶段，其中计算和操作阶段是消息生命周期中最重要的。
---

合约对消息的处理有几个阶段，其中还有更多的阶段，但我们将集中讨论最重要的几个阶段：

## 接收阶段

该阶段结合了多个低级阶段。 

它首先会在合约余额**中添加一个**消息值。 输入消息的价值是合约为处理此消息所能支付的gas的最高价格。 合约可以覆盖此限制，但不建议这样做，只有高级开发人员才适合这样做，因为这可能导致合约被耗尽。 100万个gas是一个合约中合约可以花费的最大金额，目前相当于Basechain的0.4 TON。 如果消息值为零，则执行中止。

然后，一些（通常是少量的）nanotons从合约余额中扣除用于存储。 这意味着您无法完美预测平衡的变化，必须根据这种不稳定性调整代码。

然后，如果合约尚未部署，且消息中包含初始包(init package)，则会部署合约。 如果初始化包不存在，它将被忽略。

## 计算阶段

该阶段执行智能合约的代码，并产生一系列操作或异常。 目前，仅支持两种类型的动作：**发送消息**（send message）和 **保留**（reserve）。

发送消息可以使用固定值或动态值，例如**消息的剩余值** - 传入消息的剩余值。 发送消息时可以使用 `SendIgnoreErrors` 标记，这样就可以忽略消息发送过程中出现的错误，并继续下一步操作。 如果您有多个操作，该标记非常有用。 在发送带有某个值的消息时，它首先从接收值中减去该值，然后才从合约余额中减去该值（在处理之前）。

## 行动阶段

动作按顺序执行，但请注意：\
**处理动作时发生异常不会回滚交易**。

例如，如果从客户的余额中扣除 1 Ton，然后发送一条无效消息，这可能会导致客户的余额被扣减，但客户却无法收到相应的金额。



================================================
FILE: docs/src/content/docs/zh-cn/book/maps.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/maps.mdx
================================================
---
title: Maps
description: 复合类型映射用于将键与各种类型的相应值关联起来
---

import { Badge } from '@astrojs/starlight/components';

[复合类型](/zh-cn/book/types#composite-types) `map<K, V>{:tact}` 用于将 `K{:tact}` 类型的键与 `V{:tact}` 类型的相应值关联起来。

例如，`map<Int, Int>{:tact}` 使用 [`Int{:tact}`][int] 类型作为其键和值：

```tact
struct IntToInt {
    counters: map<Int, Int>;
}
```

## 允许的类型 {#allowed-types}

允许的键(key)类型

- [`Int{:tact}`][int]
- [`Address{:tact}`][p]

允许的值(value)类型：

- [`Int{:tact}`][int]
- [`Bool{:tact}`](/zh-cn/book/types#booleans)
- [`Cell{:tact}`][cell]
- [`Address{:tact}`][p]
- [Struct](/zh-cn/book/structs-and-messages#structs)
- [Message](/zh-cn/book/structs-and-messages#messages)

## 操作

### Declare, `emptyMap()` {#emptymap}

作为[局部变量](/zh-cn/book/statements#let)，使用标准库的 `emptyMap(){:tact}` 函数：

```tact
let fizz: map<Int, Int> = emptyMap();
let fizz: map<Int, Int> = null; // identical to the previous line, but less descriptive
```

作为 [持久状态变量](/zh-cn/book/contracts#variables)：

```tact
contract Example {
    fizz: map<Int, Int>; // Int keys to Int values
    init() {
        self.fizz = emptyMap(); // redundant and can be removed!
    }
}
```

请注意，类型为 `map<K, V>{:tact}` 的 [持久状态变量](/zh-cn/book/contracts#variables) 默认为空，不需要默认值，也不需要在 [`init(){:tact}` 函数](/zh-cn/book/contracts#init-function)中进行初始化。

### 设置值，`.set()` {#set}

要设置或替换键下的值，请调用 `.set(){:tact}` [方法](/zh-cn/book/functions#extension-function)，所有 map 都可以使用该方法。

```tact
// Empty map
let fizz: map<Int, Int> = emptyMap();

// Setting a couple of values under different keys
fizz.set(7, 7);
fizz.set(42, 42);

// Overriding one of the existing key-value pairs
fizz.set(7, 68); // key 7 now points to value 68
```

### 获取值，`.get()` {#get}

通过调用 `.get(){:tact}` [方法](/zh-cn/book/functions#extension-function)，检查是否在map中找到了键，所有map都可以访问该方法。 如果键丢失，则返回 `null{:tact}`；如果键找到，则返回值。

```tact
// Empty map
let fizz: map<Int, Int> = emptyMap();

// Setting a value
fizz.set(68, 0);

// Getting the value by its key
let gotButUnsure: Int? = fizz.get(68);          // returns Int or null, therefore the type is Int?
let mustHaveGotOrErrored: Int = fizz.get(68)!!; // explicitly asserting that the value must not be null,
                                                // which may crush at runtime if the value is, in fact, null

// Alternatively, we can check for the key in the if statement
if (gotButUnsure != null) {
    // Hooray, let's use !! without fear now and cast Int? to Int
    let definitelyGotIt: Int = fizz.get(68)!!;
} else {
    // Do something else...
}
```

### 替换值 `.replace()` {#replace}

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

要替换某个键下的值，如果存在这样的键，请使用 `.replace(){:tact}` [方法](/zh-cn/book/functions#extension-function)。 它在成功替换时返回 `true{:tact}`，否则返回 `false{:tact}`。

```tact
// Empty map
let fizz: map<Int, Int> = emptyMap();

// Setting a couple of values under different keys
fizz.set(7, 70);
fizz.set(42, 42);

// Overriding one of the existing key-value pairs
let replaced1 = fizz.replace(7, 68); // key 7 now points to value 68
replaced1; // true

// Trying to replace the value in a non-existing key-value pair will do nothing
let replaced2 = fizz.replace(8, 68); // no key 8, so nothing was altered
replaced2; // false
```

如果给定值是[`null{:tact}`](/zh-cn/book/optionals)并且键存在，地图中的条目将被删除。

```tact
// Empty map
let fizz: map<Int, Int> = emptyMap();

// Setting a couple of values under different keys
fizz.set(7, 70);
fizz.set(42, 42);

// Overriding one of the existing key-value pairs
let replaced1 = fizz.replace(7, null); // the entry under key 7 is now deleted
replaced1; // true

// Trying to replace the value in a non-existing key-value pair will do nothing
let replaced2 = fizz.replace(8, null); // no key 8, so nothing was altered
replaced2; // false
```

### 替换并获取旧值，`.replaceGet()` {#replaceget}

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

类似于 [`.replace()`](#replace)，但在成功替换时返回旧的（替换前的）值，否则返回 [`null{:tact}`](/zh-cn/book/optionals)，而不是返回一个 [`Boolean{:tact}`](/zh-cn/book/types#booleans)。

```tact
// Empty map
let fizz: map<Int, Int> = emptyMap();

// Setting a couple of values under different keys
fizz.set(7, 70);
fizz.set(42, 42);

// Overriding one of the existing key-value pairs
let oldVal1 = fizz.replaceGet(7, 68); // key 7 now points to value 68
oldVal1; // 70

// Trying to replace the value in a non-existing key-value pair will do nothing
let oldVal2 = fizz.replaceGet(8, 68); // no key 8, so nothing was altered
oldVal2; // null
```

如果给定值是[`null{:tact}`](/zh-cn/book/optionals)，并且键存在，则条目将从映射中删除。

```tact
// Empty map
let fizz: map<Int, Int> = emptyMap();

// Setting a couple of values under different keys
fizz.set(7, 70);
fizz.set(42, 42);

// Overriding one of the existing key-value pairs
let oldVal1 = fizz.replaceGet(7, null); // the entry under key 7 is now deleted
oldVal1; // 70

// Trying to replace the value in a non-existing key-value pair will do nothing
let oldVal2 = fizz.replaceGet(8, null); // no key 8, so nothing was altered
oldVal2; // null
```

### 删除条目，`.del()` {#del}

要删除单个键值对（单个条目），请使用 `.del(){:tact}` [方法](/zh-cn/book/functions#extension-function)。 如果删除成功，则返回 `true{:tact}`，否则返回 `false{:tact}`。

```tact
// Empty map
let fizz: map<Int, Int> = emptyMap();

// Setting a couple of values under different keys
fizz.set(7, 123);
fizz.set(42, 321);

// Deleting one of the keys
let deletionSuccess: Bool = fizz.del(7); // true, because map contained the entry under key 7
fizz.del(7);                             // false, because map no longer has an entry under key 7

// Note, that assigning the `null` value to the key when using the `.set()` method
//   is equivalent to calling `.del()`, although such approach is much less descriptive
//   and is generally discouraged:
fizz.set(42, null); // the entry under key 42 is now deleted
```

要删除映射表中的所有条目，请使用 `emptyMap(){:tact}` 函数重新分配映射表：

```tact
// Empty map
let fizz: map<Int, Int> = emptyMap();

// Setting a couple of values under different keys
fizz.set(7, 123);
fizz.set(42, 321);

// Deleting all of the entries at once
fizz = emptyMap();
fizz = null; // identical to the previous line, but less descriptive
```

通过这种方法，即使映射被声明为其持久状态变量，映射的所有先前条目也会被从合约中完全丢弃。 因此，将映射(map)赋值为 `emptyMap(){:tact}` **不会**产生任何隐藏或意外的[存储费用](https://docs.ton.org/develop/smart-contracts/fees#storage-fee)。

### 检查条目是否存在, `.exists()` {#exists}

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

map上的 `.exists(){:tact}` [方法](/zh-cn/book/functions#extension-function)，如果给定键下的值在map中存在，则返回 `true{:tact}`，否则返回 `false{:tact}`。

```tact
let fizz: map<Int, Int> = emptyMap();
fizz.set(0, 0);

if (fizz.exists(2 + 2)) { // false
    dump("Something doesn't add up!");
}

if (fizz.exists(1 / 2)) { // true
    dump("I told a fraction joke once. It was half funny.");
}

if (fizz.get(1 / 2) != null) { // also true, but consumes more gas
    dump("Gotta pump more!");
}
```

:::note

  调用`m.exists(key){:tact}`比执行`m.get(key) != null{:tact}` 更省 gas，尽管两种方法产生的结果是一样的。

:::

### 检查是否为空，`.isEmpty()` {#isempty}

map上的 `.isEmpty(){:tact}` [方法](/zh-cn/book/functions#extension-function) 如果map为空，则返回 `true{:tact}`，否则返回 `false{:tact}`：

```tact
let fizz: map<Int, Int> = emptyMap();

if (fizz.isEmpty()) {
    dump("Empty maps are empty, duh!");
}

// Note, that comparing the map to `null` behaves the same as `.isEmpty()` method,
// although such direct comparison is much less descriptive and is generally discouraged:
if (fizz == null) {
    dump("Empty maps are null, which isn't obvious");
}
```

### 与 `.deepEquals()` 进行比较 {#deepequals}

<Badge text="Available since Tact 1.5" variant="tip" size="medium"/><p/>

`.deepEquals(){:tact}` [方法](/zh-cn/book/functions#extension-function) 在映射上返回 `true{:tact}`，如果映射的所有条目都与另一个映射的相应条目匹配，忽略在[底层序列化逻辑][hashmap]中可能存在的差异。 返回 `false{:tact}` 。

```tact
let fizz: map<Int, Int> = emptyMap();
let buzz: map<Int, Int> = emptyMap();

fizz.set(1, 2);
buzz.set(1, 2);

fizz.deepEquals(buzz); // true
fizz == buzz;          // true, and uses much less gas to compute
```

使用 `.deepEquals(){:tact}`非常重要，因为map来自第三方源，它没有提供关于[序列化布局][hashmap] 的任何保证。 例如，考虑以下代码：

```typescript title="some-typescript-code.ts"
// First map, with long labels
const m1 = beginCell()
    .storeUint(2, 2) // long label
    .storeUint(8, 4) // key length
    .storeUint(1, 8) // key
    .storeBit(true)  // value
    .endCell();

// Second map, with short labels
const m2 = beginCell()
    .storeUint(0, 1)           // short label
    .storeUint(0b111111110, 9) // key length
    .storeUint(1, 8)           // key
    .storeBit(true)            // value
    .endCell();
```

在这里，两张map都是手动形成的，两张map都包含相同的键值。 如果你要在消息中将这两张map发送给Tact合约，然后将它们与`.deepEquals(){:tact}` 和 [equality operator `=={:tact}`](/zh-cn/book/operators#binary-equality)进行比较，前者将产生`true{:tact}` ，因为两张map都有相同的条目， 后者会产生`false{:tact}` ，因为它只能对map哈希进行浅色比较。 由于map的序列化不同，情况也不同。

:::note

  此函数的gas成本非常高，在大多数情况下，使用 [等于 `=={:tact}`](/zh-cn/book/operators#binary-equality) 或 [不等于 `!={:tact}`](/zh-cn/book/operators#binary-equality) 操作符进行浅层比较已足够。

:::

### 转换为 `Cell`, `.asCell()` {#ascell}

在map上使用 `.asCell(){:tact}` [方法](/zh-cn/book/functions#extension-function)，将其所有值转换为 [`cell{:tact}`][cell] 类型。 请注意，[`Cell{:tact}`][cell] 类型最多只能存储 1023 位，因此将更大的映射转换为cell会导致错误。

例如，这种方法适用于在回复正文中直接发送小map：

```tact
contract Example {
    // Persistent state variables
    fizz: map<Int, Int>; // our map

    // Constructor (initialization) function of the contract
    init() {
        // Setting a bunch of values
        self.fizz.set(0, 3);
        self.fizz.set(1, 14);
        self.fizz.set(2, 15);
        self.fizz.set(3, 926);
        self.fizz.set(4, 5_358_979_323_846);
    }

    // Internal message receiver, which responds to empty messages
    receive() {
        // Here we're converting the map to a Cell and making a reply with it
        self.reply(self.fizz.asCell());
    }
}
```

### 遍历条目 {#traverse}

要遍历map条目，有一个 [`foreach{:tact}`](/zh-cn/book/statements#foreach-loop)循环语句：

```tact
// Empty map
let fizz: map<Int, Int> = emptyMap();

// Setting a couple of values under different keys
fizz.set(42, 321);
fizz.set(7, 123);

// Iterating over in a sequential order: from the smallest keys to the biggest ones
foreach (key, value in fizz) {
    dump(key); // will dump 7 on the first iteration, then 42 on the second
}
```

了解更多相关信息：[`foreach{:tact}` loop in Book→Statements](/zh-cn/book/statements#foreach-loop).

请注意，也可以将 map 作为简单数组使用，只要定义一个 `map<Int, V>{:tact}`，键为 [`Int{:tact}`][int] 类型，值为任何允许的 `V{:tact}` 类型，并跟踪单独变量中的项数即可：

```tact
contract Iteration {
    // Persistent state variables
    counter: Int as uint32;    // counter of map entries, serialized as a 32-bit unsigned
    record: map<Int, Address>; // Int to Address map

    // Constructor (initialization) function of the contract
    init() {
        self.counter = 0; // Setting the self.counter to 0
    }

    // Internal message receiver, which responds to a String message "Add"
    receive("Add") {
        // Get the Context Struct
        let ctx: Context = context();
        // Set the entry: counter Int as a key, ctx.sender Address as a value
        self.record.set(self.counter, ctx.sender);
        // Increase the counter
        self.counter += 1;
    }

    // Internal message receiver, which responds to a String message "Send"
    receive("Send") {
        // Loop until the value of self.counter (over all the self.record entries)
        let i: Int = 0; // declare usual i for loop iterations
        while (i < self.counter) {
           send(SendParameters {
                bounce: false,              // do not bounce back this message
                to: self.record.get(i)!!,   // set the sender address, knowing that key i exists in the map
                value: ton("0.0000001"),    // 100 nanoToncoins (nano-tons)
                mode: SendIgnoreErrors,     // send ignoring errors in transaction, if any
                body: "SENDING".asComment() // String "SENDING" converted to a Cell as a message body
            });
            i += 1; // don't forget to increase the i
        }
    }

    // Getter function for obtaining the value of self.record
    get fun map(): map<Int, Address> {
        return self.record;
    }

    // Getter function for obtaining the value of self.counter
    get fun counter(): Int {
        return self.counter;
    }
}
```

在此类map上设置上限限制通常很有用，这样就不会[触及极限](#limits-and-drawbacks)。

:::caution

  请注意，手动记录项目数或检查此类map的长度非常容易出错，一般不建议使用。 相反，请尝试将您的map封装到 [Struct](/zh-cn/book/structs-and-messages#structs) 中，并在其上定义 [extension functions](/zh-cn/book/functions#extension-function) 。 参见 Cookbook 中的示例：[如何使用包裹在 Struct 中的 map 来模拟数组](/zh-cn/cookbook/data-structures#array)。

:::

:::note

  查看 Cookbook 中有关 map 使用的其他示例：\
  [如何使用包裹在 Struct 中的 map 来模拟堆栈](/zh-cn/cookbook/data-structures#stack)\
  [如何使用包裹在 Struct 中的 map 来模拟循环缓冲区](/zh-cn/cookbook/data-structures#circular-buffer)

:::

## 序列化

可以对映射键、值或两者进行[整数序列化](/zh-cn/book/integers#common-serialization-types)，以[保留空间并降低存储成本](/zh-cn/book/integers#serialization)：

```tact
struct SerializedMapInside {
    // Both keys and values here would be serialized as 8-bit unsigned integers,
    // thus preserving the space and reducing storage costs:
    countersButCompact: map<Int as uint8, Int as uint8>;
}
```

:::note

  了解其他序列化选项：[与 FunC 兼容](/zh-cn/book/func#convert-serialization)。

:::

## 局限性和缺点 {#limits-and-drawbacks}

虽然map在小范围内使用起来很方便，但如果项目数量不受限制，map的大小会大幅增加，就会产生很多问题：

- 由于智能合约状态大小的上限约为 $65\,000$ 项类型为 [`Cell{:tact}`][cell]，因此整个合约的映射存储上限约为 $30\,000$ 键值对。

- map中的条目越多，[计算费](https://docs.ton.org/develop/howto/fees-low-level#computation-fees) 就越高。 因此，处理大型map使得计算费用难以预测和管理。

- 在单个合约中使用大型map无法分散工作量。 在单个合约中使用大型map无法分散工作量。 因此，与使用较小的map和大量交互式智能合约相比，这可能会使整体性能大打折扣。

要解决此类问题，可以将map上的上限限制设置为常数，并在每次为map设置新值时对其进行检查：

```tact
contract Example {
    // Declare a compile-time constant upper-bound for our map
    const MaxMapSize: Int = 42;

    // Persistent state variables
    arr: map<Int, Int>; // "array" of Int values as a map
    arrLength: Int = 0; // length of the "array", defaults to 0

    // Internal function for pushing an item to the end of the "array"
    fun arrPush(item: Int) {
        if (self.arrLength >= self.MaxMapSize) {
            // Do something, stop the operation, for example
        } else {
            // Proceed with adding new item
            self.arr.set(self.arrLength, item);
            self.arrLength += 1;
        }
    }
}
```

如果您仍然需要大map或无约束（无限大）map，最好按照[TON 区块链的异步和基于角色的模型](https://docs.ton.org/learn/overviews/ton-blockchain)来构建您的智能合约。 也就是说，使用合约分片，让整个区块链成为map的一部分。

[p]: /zh-cn/book/types#primitive-types
[int]: /zh-cn/book/integers
[cell]: /zh-cn/book/cells#cells

[hashmap]: https://docs.ton.org/develop/data-formats/tl-b-types#hashmap
[tvm]: https://docs.ton.org/learn/tvm-instructions/tvm-overview



================================================
FILE: docs/src/content/docs/zh-cn/book/masterchain.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/masterchain.mdx
================================================
---
title: 主链
description: 在 TON 区块链中，一条名为主链的特殊链用于同步消息路由和交易执行，因此网络中的节点可以固定多链状态中的某个特定点，并就该状态达成共识
---

:::caution

  除非将[配置文件](/zh-cn/book/config)中的 `masterchain` 选项设置为 `true{:json}`，否则主链地址将被视为无效。

:::

在 TON 区块链中，一条名为["主链"](https://docs.ton.org/learn/overviews/ton-blockchain#masterchain-blockchain-of-blockchains) 的特殊链用于同步消息路由和交易执行，因此网络中的节点可以固定多链状态中的某个特定点，并就该状态达成共识。

主链存储[网络配置](/zh-cn/ref/core-advanced#getconfigparam)以及所有[工作链](https://docs.ton.org/learn/overviews/ton-blockchain#workchain-blockchain-with-your-own-rules)的最终状态。 它承载着基本的协议信息，包括当前设置、活动验证器及其质押列表、活动工作链以及相关的[分块链](https://docs.ton.org/develop/blockchain/shards)。 最重要的是，它为所有工作链和分块链维护最新的区块哈希值记录，从而在整个网络中达成共识。

## 主链如何保护合约

Tact 强制所有合约使用 [basechain](https://docs.ton.org/develop/blockchain/shards)，即 ID 为 $0$ 的默认工作链。 这样做是为了防止在合约中使用主链地址。

在未[启用主链支持](#support)的情况下，任何指向主链或以其他方式与之交互的尝试都会产生异常，并显示[退出码 137](/zh-cn/book/exit-codes#137)： 此合约未启用 “主链支持”。

也就是说，意外部署到主链、从主链账户接收消息、向此类账户发送消息以及使用主链地址或其链 ID ($-1$) 都是默认禁止的。

## 在编译选项中启用主链支持 {#support}

:::caution

大多数合约不需要部署在主链上，也不需要在主链上进行任何交互。 这是因为主链主要用于投票或存储库。 如果不需要参与这些活动，就不需要启用主链支持。

:::

如果您确实需要主链支持，最简单也是最推荐的方法是修改项目根目录下的 [`tact.config.json`](/zh-cn/book/config) 文件（如果还不存在，则创建该文件），并 [将 `masterchain` 属性设置为 `true{:json}`](/zh-cn/book/config#options-masterchain)。

如果您正在开发基于 [Blueprint][bp] 的项目，可以在合约的编译配置中启用主链支持，这些配置位于名为 `wrappers/` 的目录中：

```typescript title="wrappers/YourContractName.compile.ts" {7}
import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
  lang: 'tact',
  target: 'contracts/your_contract_name.tact',
  options: {
    masterchain: true, // ← that's the stuff!
  }
};
```

不过，[Blueprint][bp] 项目中仍可使用 [`tact.config.json`](/zh-cn/book/config)。 不过，[Blueprint][bp] 项目中仍可使用 [`tact.config.json`](/zh-cn/book/config)。 在这种情况下，除非在 `wrappers/` 中修改，否则 [`tact.config.json`](/zh-cn/book/config)中指定的值将作为默认值。

:::note

  如果你有 `separateCompilables` 选项设置为 `true{:typescript}` 在 [`blueprint.config. . s`][bp-config]，然后`.compile.ts`文件将位于`compilables/`目录中，**不**位于`wrapper/`。

:::

[bp]: https://github.com/ton-org/blueprint
[bp-config]: https://github.com/ton-org/blueprint/tree/main?tab=readme-ov-file#configuration



================================================
FILE: docs/src/content/docs/zh-cn/book/message-mode.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/message-mode.mdx
================================================
---
title: Message `mode`
description: 消息以结构 SendParameters 的模式参数发送。 它是一个 Int 值，由基本模式和可选标记（也是 Int 值）组合而成
---

import { Badge } from '@astrojs/starlight/components';

如前所述，消息是通过结构体 `SendParameters{:tact}` 的 `mode` 参数发送的。 这是一个[`Int{:tact}`][int]值，由基本模式和可选标志组合而成，这些也是[`Int{:tact}`][int]值。

您可以使用原始的 [`Int{:tact}`][int]值，并手动为 `mode` 提供这些值，但为了方便起见，您可以使用一组常量来轻松构建复合 `mode`。有关基本模式和可选标记的更多消息，请参阅下表。 有关基本模式和可选标记的更多消息，请参阅下表。

## 基本模式 {#base-modes}

|         模式值 | 常量名称                                                                  | 说明                           |
| ----------: | :-------------------------------------------------------------------- | ---------------------------- |
| $0$C        | <Badge text="Since Tact 1.6" variant="tip"/> `SendDefaultMode{:tact}` | 普通消息（默认）。                    |
|  $64$       | `SendRemainingValue{:tact}`                                           | 除了新信息中最初显示的值外，还携带所有入站信息的剩余值. |
|  $128$      | `SendRemainingBalance{:tact}`                                         | 携带当前智能合约的所有余额，而不是消息中最初显示的值。  |

## 可选标记 {#optional-flags}

|        标志值 | 常量名称                            | 说明                                                                     |
| ---------: | :---------------------------------- | ---------------------------------------------------------------------- |
| $+1$       | ~~`SendPayGasSeparately{:tact}`~~   | 将转发费用与消息价值分开支付。                                                        |
| $+1$       | `SendPayFwdFeesSeparately{:tact}`   | 自 Tact 1.6.5 起已弃用 将转发费用与消息价值分开支付。                                                        |
| $+2$       | `SendIgnoreErrors{:tact}`           | 忽略行动阶段处理该消息时出现的任何错误。                                                   |
| $+16$      | `SendBounceIfActionFail{:tact}`     | 如果在行动阶段出现任何错误，则退回交易。 如果使用了标志 $+2$, `SendIgnoreErrors{:tact}`，则没有影响。    |
| $+32$      | `SendDestroyIfZero{:tact}`          | 如果当前账户的余额为零，则必须销毁该账户（通常与模式 $128$, `SendRemainingBalance{:tact}` 一起使用）。 |

## 将模式与标志(flags)相结合 {#combining-modes-with-flags}

要为 `SendParameters{:tact}` 的 `mode` 字段创建 [`Int{:tact}`][int] 值，只需通过 [bitwise OR](/zh-cn/book/operators#binary-bitwise-or) 运算将基本模式与可选标记结合起来。

例如，如果您想分别发送普通消息和支付转账费用，请使用模式 $0$（默认）和标志 $+1$，以获得 `mode` $= 1$，这等同于使用 `SendPayFwdFeesSeparately{:tact}` 常量。

或者，如果要发送全部合约余额并立即销毁，使用模式 $128$ 和标志 $+32$，得到 `mode` $= 160$，相当于 `SendRemainingBalance | SendDestroyIfZero{:tact}` 常量。

下面是后一个示例的代码：

```tact
let to: Address = address("...");
let value: Int = ton("1");
send(SendParameters {
    to: to,
    value: value,
    mode: SendRemainingBalance | SendDestroyIfZero,
    body: "Hello, World!".asComment(),
});
```

:::caution

  请注意，虽然可以将（[`+{:tact}`](/zh-cn/book/operators#binary-add)）基本模式与可选标志一起添加，但由于可能会出现多余的值，因此不鼓励这样做。  请使用位wise OR ([`|{:tact}`](/zh-cn/book/operators#binary-bitwise-or))，因为它是为处理此类标志和对 `mode` 的位操作而设计的。

:::

:::note

  还要注意的是，[基本模式](#base-modes) 只能有一种，但[可选标记](#optional-flags) 的数量可以不同：可以全部使用，也可以不使用或只使用其中一些。

:::

[int]: /zh-cn/book/integers



================================================
FILE: docs/src/content/docs/zh-cn/book/operators.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/operators.mdx
================================================
---
title: 运算符
description: 本页按照[优先级](#precedence)的递减顺序列出了 Tact 中的所有运算符，并附有使用示例
prev:
  link: /zh-cn/book/exit-codes
  label: 退出码
---

几乎所有合约都对数据进行操作：将某些值转换成另一个值。 范围可能各不相同，但运营商是此类修改的核心。 范围可能会有所不同，但运算符是此类修改的核心。

本页按照[优先级](#precedence) 的递减顺序列出了 Tact 中的所有运算符，并附有使用示例。

:::note

  需要注意的是，Tact 中没有隐式类型转换，因此运算符不能用来添加不同类型的值，或者在不明确转换为相同类型的情况下比较它们的相等性。 这是通过标准库中的某些函数实现的。 需要注意的是，Tact 中没有隐式类型转换，因此运算符不能用来添加不同类型的值，或者在不明确转换为相同类型的情况下比较它们的相等性。 这是通过标准库中的某些函数实现的。 请参阅 [`Int.toString(){:tact}`](/zh-cn/ref/core-strings#inttostring)，了解此类函数的示例。

:::

## 运算符列表 {#table}

下表列出了按 [优先级](#precedence)：从高到低递减的运算符。

| 简要说明              | 运算符
| :-------------------- | :-----
| 括号                  | [`(){:tact}`][paren]
| 一元后缀              | [`!!{:tact}`][nna]
| 一元前缀              | [`+{:tact}`][plus] &nbsp; [`-{:tact}`][neg] &nbsp; [`!{:tact}`][inv] &nbsp; [`~{:tact}`][b-not]
| 乘法                  | [`*{:tact}`][mul] &nbsp; [`/{:tact}`][div] &nbsp; [`%{:tact}`][mod]
| 加法                  | [`+{:tact}`][add] &nbsp; [`-{:tact}`][sub]
| 移位                  | [`>>{:tact}`][shr] &nbsp; [`<<{:tact}`][shl]
| 关系运算符            | [`>{:tact}`][gt] &nbsp; [`>={:tact}`][ge] &nbsp; [`<{:tact}`][lt] &nbsp; [`<={:tact}`][le]
| 等式                  | [`=={:tact}`][eq] &nbsp; [`!={:tact}`][eq]
| 按位与(Bitwise AND)   | [`&{:tact}`][b-and]
| 按位异或(Bitwise XOR) | [`^{:tact}`][b-xor]
| 按位或(Bitwise OR)    | [`\|{:tact}`][b-or]
| 逻辑与(Logical AND)   | [`&&{:tact}`][l-and]
| 逻辑或(Logical OR)    | [`\|\|{:tact}`][l-or]
| 三元                  | [`?:{:tact}`][ternary]
| 赋值                  | [`={:tact}`][assign] 和 [所有增强赋值运算符](#augmented-assignment)

[paren]: #parentheses
[nna]: #unary-non-null-assert
[plus]: #unary-plus
[neg]: #unary-negate
[inv]: #unary-inverse
[b-not]: #unary-bitwise-not
[mul]: #binary-multiply
[div]: #binary-divide
[mod]: #binary-modulo
[add]: #binary-add
[sub]: #binary-subtract
[shr]: #binary-bitwise-shift-right
[shl]: #binary-bitwise-shift-left
[gt]: #binary-greater
[ge]: #binary-greater-equal
[lt]: #binary-less
[le]: #binary-less-equal
[eq]: #binary-equality
[b-and]: #binary-bitwise-and
[b-xor]: #binary-bitwise-xor
[b-or]: #binary-bitwise-or
[l-and]: #binary-logical-and
[l-or]: #binary-logical-or
[ternary]: #ternary
[assign]: #assignment

## 优先级 {#precedence}

本页所有运算符的优先级从高到低依次递减。 优先级用于选择在特定情况下考虑哪个运算符。 每当出现模棱两可的情况时，Tact 会优先选择优先级较高的运算符，而不是优先级较低的运算符。

例如，减号 (`-{:tact}`) 可被视为减法运算符或否定运算符，它将表达式的正负符号颠倒过来，反之亦然。  由于在两者有歧义的情况下，后者的优先级高于前者，Tact 将首先把 `-{:tact}` 视为否定操作符。 如果这对给定表达式没有意义，它才会将其视为减法运算符。

请看下面的代码

```tact
5 + -5; // 在这里，减号将被视为否定运算符
5 -5; // 而在这里，尽管有格式限制，它仍将被视为减法运算符
```

尽管这个例子可能很简单，但忽略优先级规则往往会导致运算符出现混乱的情况。 由于括号在所有表达式和运算符中具有最高优先级，因此用[括号](#parentheses)封装每个操作可以确保正确的操作顺序。

## 括号，`()` {#parentheses}

括号（也可称为圆括号，`(){:tact}`）与其说是实际的运算符，不如说是一种标点符号，但其 [优先级](#precedence) 高于任何其他运算符的优先级。 使用括号可覆盖运算顺序：

```tact
5 * 5 - 2;   // 23
5 * (5 - 2); // 15
```

:::note

  当前允许的最大嵌套级别是 $83$。 试图写入更深的表达式会导致编译错误：

```tact
fun elegantWeaponsForCivilizedAge(): Int {
    return
    ((((((((((((((((((((((((((((((((
        ((((((((((((((((((((((((((((((((
            (((((((((((((((((((( // 84 parens, compilation error!
                42
            ))))))))))))))))))))
        ))))))))))))))))))))))))))))))))
    ))))))))))))))))))))))))))))))));
}
```

:::

## 一元

这里的 "一元 "是指只应用于给定表达式的一个操作数。 除了[非空断言](#unary-non-null-assert)，所有一元运算符都具有相同的[优先级](#precedence)。

一元运算符可以是两种类型之一：

- 前缀(Prefix) - 放在表达式之前。
- 后缀(Postfix 或 suffix) - 放在表达式之后。

### 非空断言，`!!` {#unary-non-null-assert}

一元双叹号（_非空断言_）运算符 `!{:tact}`是一个后缀运算符，它强制执行非`null{:tact}`值，如果可选变量不是`null{:tact}`，则允许直接访问可选变量的值。  否则，如果编译器可以跟踪，则引发编译错误；如果不能跟踪，则抛出[退出码 128](/zh-cn/book/exit-codes#128)异常：空引用异常"。 可以适用于任何可选变量，无论其非`null{:tact}`类型如何。

:::note

  点击此处了解更多有关可选变量和字段的信息：[可选变量](/zh-cn/book/optionals)

:::

### 加号，`+` {#unary-plus}

虽然 Tact 编译器的语法中指定了一元加号运算符 `+{:tact}`，但它只作为 [二元运算符](#binary-add) 存在。

### 否定，`-` {#unary-negate}

一元减号（_negation_）运算符 `-{:tact}` 是一个前缀运算符，用于反转表达式的符号。  只能应用于 [`Int{:tact}`][int]类型的值：

```tact
let five: Int = 5;
five + -five; // here, the minus sign is a negation operator, not a subtraction operator
-(-1);        // double application gives back the original value, which is 1
--1;          // 1
```

### 反转，`!` {#unary-inverse}

一元感叹号（_inversion_）运算符 `!{:tact}` 是一个前缀运算符，用于反转表达式的布尔值——将 `true{:tact}` 变为 `false{:tact}`，反之亦然。只 只能应用于 [`Bool{:tact}`][bool]类型的值：

```tact
let iLikeTact: Bool = true;
!iLikeTact; // false
!false;     // true
!(!false);  // false
!!false;    // false
```

### 按位非，`~` {#unary-bitwise-not}

单引号 tilde（_bitwise not_）运算符 `~{:tact}` 是一个前缀运算符，它将表达式二进制表示中的每一位反转或_flip_，即把 $1$ 改为 $0$，反之亦然。  只能应用于 [`Int{:tact}`][int]类型的值：

```tact
let answer: Int = 42;
~answer;    // -43
~(~answer); // 42
~(~0);      // 0
~~0;        // 0
```

## 二进制

二进制运算符按[优先级](#precedence)递减的顺序分成几个小节。 每个小节中的操作符与小节本身具有相同的 [优先级](#precedence)。

### 乘法 {#binary-multiplication}

乘、除或求余数。

#### 乘法，`*` {#binary-multiply}

二进制星号 (_multiplication_) 运算符 `*{:tact}` 用于两个值的乘法运算。  可能导致 [整数溢出](/zh-cn/book/integers#operations)。

只能应用于 [`Int{:tact}`][int]类型的值：

```tact
let two: Int = 2;
two * two;         // 4
0 * 1_000_000_000; // 0
-1 * 5;            // -5

pow(2, 255) * pow(2, 255); // build error: integer overflow!
```

#### 除法，`/` {#binary-divide}

二进制斜线 (_division_) 运算符 `/{:tact}` 用于两个值的整除，如果结果为正，则向零截断，如果结果为负，则从零截断。这也叫[向下舍入](https://en.wikipedia.org/wiki/Rounding#Rounding_down)（或向 $-\infty$ 舍入）。 这也叫 [向下舍入](https://en.wikipedia.org/wiki/Rounding#Rounding_down)（或向 $-∞$ 舍入）。

如果尝试除以零，则会出现[退出码 4](/zh-cn/book/exit-codes#4)错误：整数溢出。

只能应用于 [`Int{:tact}`][int] 类型的值：

```tact
let two: Int = 2;
two / 2; // 1
two / 1; // 2
-1 / 5;  // -1
-1 / -5; // 0
1 / -5;  // -1
1 / 5;   // 0
6 / 5;   // 1, rounding down
-6 / 5;  // -2, rounding down (towards -∞)
```

:::note

  请注意，对于 `Int{:tact}` 类型，除法运算符和模数运算符之间的以下关系始终成立：

```tact
a / b * b + a % b == a; // true for any Int values of `a` and `b`,
                        //   except when `b` is equal to 0 and we divide `a` by 0,
                        //   which is an attempt to divide by zero resulting in an error
```

:::

#### 取模, `%` {#binary-modulo}

二进制百分号 (_modulo_) 运算符 `%{:tact}` 用于获取整数除法的模数，不能与获取余数混淆。  对于符号相同的两个值，模运算和余运算是等价的，但当操作数的符号不同时，模运算的结果总是与 _除数_（右边的值）的符号相同，而余运算的结果与 _除数_（左边的值）的符号相同，这可能使它们相差一个单位的 _除数_。

只能应用于 [`Int{:tact}`][int]类型的值：

```tact
let two: Int = 2;
two % 2; // 0
two % 1; // 1

1 % 5;   // 1
-1 % 5;  // 4
1 % -5;  // -4
-1 % -5; // -1
```

避免两者混淆的最简单方法是通过 [`abs(x: Int){:tact}`](/zh-cn/ref/core-math#abs)优先使用正值：

```tact
abs(-1) % abs(-5); // 1
```

:::note

  你知道吗，在JavaScript中`%{:tact}`作为_余数_运算符使用，而不是像Tact中那样的_模_运算符（像在Tact中那样）？\
  [余数 (%) - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder#description)\
  [模 - 维基百科](https://en.wikipedia.org/wiki/Modulo)

:::

### 加法 {#binary-addition}

加法或减法。

#### 添加，`+` {#binary-add}

二进制加法运算符 `+{:tact}` 用于将数字相加。 超出 [`Int{:tact}`][int]的最大值将导致[退出码 4](/zh-cn/book/exit-codes#4)错误：整数溢出"。

只能应用于 [`Int{:tact}`][int]类型的值：

```tact
let two: Int = 2;
two + 2; // 4
-1 + 1;  // 0

pow(2, 254) + pow(2, 254);     // 2 * 2^254
pow(2, 255) + pow(2, 255);     // build error: integer overflow!
pow(2, 255) - 1 + pow(2, 255); // 2^256 - 1, maximal value of any integer in Tact!
```

#### 减法，`-` {#binary-subtract}

二进制减号（_subtraction_）运算符 `-{:tact}` 用于将数字相减。 二进制减号（_subtraction_）运算符 `-{:tact}` 用于将数字相减。 超出 [`Int{:tact}`][int]的最小值将导致[退出码 4](/zh-cn/book/exit-codes#4)错误：整数溢出。

只能应用于 [`Int{:tact}`][int]类型的值：

```tact
let two: Int = 2;
two - 2; // 0
-1 - 1;  // -2

pow(2, 254) - pow(2, 254); // 0
pow(2, 255) - pow(2, 255); // 0
pow(2, 256) - pow(2, 256); // build error: integer overflow!
```

### 按位移位 {#binary-bitwise-shifts}

向左或向右移动位。

#### 右移，`>>` {#binary-bitwise-shift-right}

二进制 double greater than（_比特向右移动_）运算符 `>>{:tact}` 返回一个整数，其二进制表示为 _左操作数_ 的值向右移动了 _右操作数_ 的位数。 向右移位的多余位被丢弃，最左边位的副本从左边移入。 这种操作也称为 "符号向右移动 "或 "算术向右移动"，因为结果数字的符号与左操作数的符号相同。 这是一种更有效的方法，即用 $2^n$ 除以 _左操作数_ ，其中 $n$ 等于 _右操作数_。

只能应用于 [`Int{:tact}`][int] 类型的值：

```tact
let two: Int = 2;
two >> 1; // 1
4 >> 1;   // 2
5 >> 1;   // 2, due to flooring of integer values

pow(2, 254) >> 254; // 1
```

:::note

  [Bit shifts - Wikipedia](https://en.wikipedia.org/wiki/Bitwise_operation#Bit_shifts)\
  [Bit manipulation - Wikipedia](https://en.wikipedia.org/wiki/Bit_manipulation)

:::

#### 左移，`<<` {#binary-bitwise-shift-left}

二进制双大于号（_bitwise shift left_）运算符 `<<{:tact}` 返回一个整数，其二进制表示为左操作数的值向左移动右操作数的位数。 向左移位的多余比特被丢弃，零比特从右边移入。 这是一种更有效的方法，可以将 _左操作数_ 乘以 $2^n$，其中 $n$ 等于 _右操作数_。 超出 [`Int{:tact}`][int] 的最大值将导致[退出码 4](/zh-cn/book/exit-codes#4) 错误：整数溢出。

只能应用于 [`Int{:tact}`][int] 类型的值：

```tact
let two: Int = 2;
two << 1; // 4
1 << 5;   // 1 * 2^5, which is 32
2 << 5;   // 2 * 2^5, which is 64

pow(2, 254) == (1 << 254); // true
pow(2, 254) == 1 << 254; // true, no parentheses needed due to higher precedence of >> over ==
pow(2, 255) == 1 << 255; // true, but we're very close to overflow here!
```

:::note

  [Bit shifts - Wikipedia](https://en.wikipedia.org/wiki/Bitwise_operation#Bit_shifts)\
  [Bit manipulation - Wikipedia](https://en.wikipedia.org/wiki/Bit_manipulation)

:::

### 关系 {#binary-relation}

查找更大、更小或相等的数值。

#### 大于，`>` {#binary-greater}

二进制 _大于_ 运算符 `>{:tact}` 如果左操作数大于右操作数，则返回 `true{:tact}`，否则返回 `false{:tact}`。 只能应用于 [`Int{:tact}`][int]类型的值：

```tact
let two: Int = 2;
two > 2; // false
-1 > -3; // true
```

#### 大于或等于，`>=` {#binary-greater-equal}

二进制 _大于或等于_ 运算符 `>={:tact}` 如果左操作数大于或等于右操作数，则返回 `true{:tact}`，否则返回 `false{:tact}`。  只能应用于 [`Int{:tact}`][int]类型的值：

```tact
let two: Int = 2;
two >= 2; // true
-1 >= -3; // true
```

#### 小于，`<` {#binary-less}

二进制 _小于_ 运算符 `<{:tact}` 如果左操作数小于右操作数，则返回 `true{:tact}`，否则返回 `false{:tact}`。  只能应用于 [`Int{:tact}`][int]类型的值：

```tact
let two: Int = 2;
two < 2; // false
-1 < -3; // false
```

#### 小于或等于，`<=` {#binary-less-equal}

二进制 _小于或等于_ 运算符 `<={:tact}` 如果左操作数小于或等于右操作数，则返回 `true{:tact}`，否则返回 `false{:tact}`。  只能应用于 [`Int{:tact}`][int]类型的值：

```tact
let two: Int = 2;
two <= 2; // true
-1 <= -3; // false
```

### 等于与不等于，`==` `!=` {#binary-equality}

二进制相等（_equal_）运算符 `=={:tact}` 检查其两个操作数是否_equal_，返回结果类型 [`Bool{:tact}`][bool]。

二进制不等（_not equal_）运算符 `!={:tact}` 检查其两个操作数是否_not equal_，返回一个 [`Bool{:tact}`][bool] 类型的结果。

除了 [`Cell{:tact}`][cell]和 [`Slice{:tact}`][slice]类型会通过哈希值进行隐式比较外，这两种操作符都要求操作数为相同类型，并且都不执行隐式类型转换。

这两种运算符都可以应用于下列类型和值：

- [`Int{:tact}`][int]
- [`Bool{:tact}`][bool]
- [`Address{:tact}`][p]
- [`Cell{:tact}`][cell]，通过`Cell.hash(){:tact}`隐式比较
- [`Slice{:tact}`][slice]，通过`Slice.hash(){:tact}`隐式比较
- [`String{:tact}`][p]
- [`map<K, V>{:tact}`](/zh-cn/book/maps)，但前提是它们的键和值类型相同
- [Optionals and `null{:tact}` value](/zh-cn/book/optionals)

```tact
// Int:
2 == 3; // false
2 != 3; // true

// Bool:
true == true;  // true
false != true; // true

// Address:
myAddress() == myAddress(); // true
myAddress() != myAddress(); // false

// Cell:
emptyCell() == emptyCell(); // true
emptyCell() != emptyCell(); // false

// Slice:
"A".asSlice() == "A".asSlice(); // true
"A".asSlice() != "A".asSlice(); // false

// String:
"A" == "A"; // true
"A" != "A"; // false

// map<K, V>:
let map1: map<Int, Int> = emptyMap();
let map2: map<Int, Int> = emptyMap();
map1 == map2; // true
map1 != map2; // false

// Optionals and null values themselves
let nullable: Int? = null;
nullable == null; // true
null == null;     // true
nullable != null; // false
null != null;     // false

let anotherNullable: Int? = 5;
nullable == anotherNullable; // false
nullable != anotherNullable; // true
```

:::note

  二进制相等 `=={:tact}` 和不等式 `!={:tact}` 运算符通过[`Cell.hash(){:tact}`](/zh-cn/ref/core-cells#cellhash)函数，隐式地通过各自[cell][cell]的哈希值比较[maps](/zh-cn/book/maps)。 虽然这在大多数情况下没有问题，因为大多数映射序列化器的工作原理与 TON 区块链源中的序列化器相同，但通过手动序列化映射或更改某些库中序列化器的逻辑，仍有可能得到错误的负面结果。

  如果你需要保证比较的映射是相等的，并且愿意为此支付更多的gas，可以使用 [`map.deepEquals(){:tact}`](/zh-cn/book/maps#deepequals) 函数。

:::

### 按位与，`&` {#binary-bitwise-and}

二进制与（_按位与_）运算符 `&{:tact}` 执行[按位与](https://en.wikipedia.org/wiki/Bitwise_operation#AND)操作，该操作对操作数中每一对对应的位执行[逻辑与](#binary-logical-and)运算。 二进制安培（_比特 AND_）运算符 `&{:tact}` 应用[比特 AND](https://en.wikipedia.org/wiki/Bitwise_operation#AND)，对操作数的每一对相应比特执行[逻辑 AND](#binary-bitwise-and)运算。 当我们要清除一个数字的选定位时，这一点非常有用，因为每个位都代表一个单独的标志或布尔状态，这使得每个整数可以 "存储 "多达 $257$ 个布尔值，因为 Tact 中的所有整数都是 $257$- 位有符号的。

只能应用于 [`Int{:tact}`][int]类型的值：

```tact
let two: Int = 2;
two & 1; // 0
4 & 1;   // 0
3 & 1;   // 1
1 & 1;   // 1

255 & 0b00001111;        // 15
0b11111111 & 0b00001111; // 15
```

:::note

  [Bitwise AND - Wikipedia](https://en.wikipedia.org/wiki/Bitwise_operation#AND)\
  [Bit manipulation - Wikipedia](https://en.wikipedia.org/wiki/Bit_manipulation)

:::

### 按位异或，`^` {#binary-bitwise-xor}

二进制插入符号（_按位异或_）运算符 `^{:tact}` 执行[按位异或](https://en.wikipedia.org/wiki/Bitwise_operation#XOR)操作，该操作对操作数中每一对对应的位执行[逻辑异或](https://en.wikipedia.org/wiki/Exclusive_or)运算。 如果只有一个位是 $1$，则每个位置的结果都是 $1$ ，但如果两个位都是 $0$ 或两个位都是 $1$，则结果都是 $0$。 在此，它对两个bit进行比较，如果两个bit不同则给出$1$，如果相同则给出$0$。

这对于反转操作数的选定位（也称为切换或翻转）很有用，因为任何位都可以通过与 $1$ 进行"异或"来切换。

只能应用于 [`Int{:tact}`][int]类型的值：

```tact
let two: Int = 2;
two ^ 3; // 1
4 ^ 1;   // 0
3 ^ 1;   // 3
1 ^ 1;   // 0

255 ^ 0b00001111;        // 240
0b11111111 ^ 0b00001111; // 240
```

:::note

  [Bitwise XOR - Wikipedia](https://en.wikipedia.org/wiki/Bitwise_operation#XOR)\
  [Bit manipulation - Wikipedia](https://en.wikipedia.org/wiki/Bit_manipulation)

:::

### 按位或，`|` {#binary-bitwise-or}

二进制竖线（_按位或_）运算符 `|{:tact}` 执行[按位或](https://en.wikipedia.org/wiki/Bitwise_operation#OR)操作，该操作对操作数中每一对对应的位执行[逻辑或](#binary-logical-or)运算。 当我们要应用特定的 [bitmask](https://en.wikipedia.org/wiki/Mask_(computing)) 时，这很有用。

例如，_按位或_ 通常用于 Tact 中通过掩码特定位为 $1$ 来[结合基本模式和可选标志](/zh-cn/book/message-mode#combining-modes-with-flags)，以构造目标[消息模式](/zh-cn/book/message-mode)。

只能应用于 [`Int{:tact}`][int]类型的值：

```tact
let two: Int = 2;
two | 1; // 3
4 | 1;   // 5
3 | 1;   // 3
1 | 1;   // 1

255 | 0b00001111;        // 255
0b11111111 | 0b00001111; // 255
```

:::note

  [Bitwise OR - Wikipedia](https://en.wikipedia.org/wiki/Bitwise_operation#OR)\
  [Bit manipulation - Wikipedia](https://en.wikipedia.org/wiki/Bit_manipulation)

:::

### 逻辑与, `&&` {#binary-logical-and}

二进制逻辑 AND（[逻辑连接](https://en.wikipedia.org/wiki/Logical_conjunction)）运算符 `&&{:tact}` 如果两个操作数都是 `true{:tact}`，则返回 `true{:tact}`，否则返回 `false{:tact}`。 它是短路的，也就是说，如果左操作数是 `false{:tact}`，它会立即将整个表达式求值为 `false{:tact}`，而不求值右操作数。 这是短路的，意味着如果左操作数为`false{:tact}`，它将立即将整个表达式评估为`false{:tact}`，而不会评估右操作数。

只能应用于 [`Bool{:tact}`][bool]类型的值：

```tact
let iLikeTact: Bool = true;
iLikeTact && true;  // true, evaluated both operands
iLikeTact && false; // false, evaluated both operands
false && iLikeTact; // false, didn't evaluate iLikeTact
```

### 逻辑或，`||` {#binary-logical-or}

二进制逻辑或（[逻辑或](https://en.wikipedia.org/wiki/Logical_disjunction)）运算符 `||{:tact}` 仅当两个操作数都为 `false{:tact}` 时返回 `false{:tact}`，否则返回 `true{:tact}`。 它是短路的，也就是说，如果左操作数是 `true{:tact}`，它会立即将整个表达式评估为 `true{:tact}`，而不评估右操作数。

只能应用于 [`Bool{:tact}`][bool]类型的值：

```tact
let iLikeSnails: Bool = false;
iLikeSnails || true;  // true, evaluated both operands
iLikeSnails || false; // false, evaluated both operands
true || iLikeSnails;  // true, didn't evaluate iLikeSnails
```

## 三元，`?:` {#ternary}

条件（_ternary_）运算符是唯一一个包含三个操作数的 Tact 运算符：一个条件，后面跟一个问号（`?{:tact}`），然后是如果条件被评估为`true{:tact}`时要执行的表达式，后面跟一个冒号（`:{:tact}`），最后是如果条件被评估为`false{:tact}`时要执行的表达式。  该运算符常用于替代 [`if...else{:tact}`](/zh-cn/book/statements#if-else) 语句。

条件必须解析为类型[`Bool{:tact}`][bool]:

```tact
// condition
// ↓
true ? "incredibly so" : "absolutely not"; // "incredibly so"
//     ---------------   ----------------
//     ↑                 ↑
//     |                 alternative, when condition is false
//     |
//     consequence, when condition is true

2 + 2 == 4 ? true : false; // true
```

三元运算符是除 [赋值相关运算符](#assignment) 外唯一具有右关联性的运算符。 这意味着，在模棱两可的情况下，Tact 会优先选择最长的匹配序列。 简而言之，这使得三元运算符的无括号嵌套成为可能，但仅限于替代情况（冒号 `:{:tact}` 后面的部分）：

```tact
// don't need additional parentheses for alternative cases
false ? 1 : (false ? 2 : 3); // 3
false ? 1 : false ? 2 : 3;   // also 3
false ? 1 : true ? 2 : 3;    // 2

// need additional parentheses for consequence cases (parts in-between ? and :)
false ? (false ? 1 : 2) : 3; // 3
false ? false ? 1 : 2 : 3;   // SYNTAX ERROR!
true  ? (false ? 1 : 2) : 3; // 2
```

## 赋值，`=` {#assignment}

赋值操作符 `={:tact}` 用于为变量或 [Message](/zh-cn/book/structs-and-messages#messages) 或 [Struct](/zh-cn/book/structs-and-messages#structs) 的属性赋值。  赋值是一个语句，不返回值。

```tact
let someVar: Int = 5;    // assignment operator = is used here...
someVar = 4;             // ...and here
someVar = (someVar = 5); // SYNTAX ERROR!
```

### 增强赋值 {#augmented-assignment}

增强（或复合）赋值运算符，如 `+={:tact}`，将操作与 [赋值](#assignment) 结合起来。  增强赋值是一个语句，不返回值。

增强赋值在语义上等价于常规赋值，但附带一个操作：

```tact
let value: Int = 5;

// this:
value += 5;
// is equivalent to this:
value = value + 5;
```

增强赋值运算符列表：

- `+={:tact}`，使用 [加法运算符 `+{:tact}`](#binary-add)。  只能应用于 [`Int{:tact}`][int]类型的值。
- `-={:tact}`，使用 [减法运算符 `-{:tact}`](#binary-subtract)。  只能应用于 [`Int{:tact}`][int]类型的值。
- `*={:tact}`，使用 [乘法运算符 `*{:tact}`](#binary-multiply)。  只能应用于 [`Int{:tact}`][int]类型的值。
- `/={:tact}`，使用 [除法运算符 `/{:tact}`](#binary-divide)。  只能应用于 [`Int{:tact}`][int]类型的值。
- `%={:tact}`，使用 [modulo 运算符 `%{:tact}`](#binary-modulo)。  只能应用于 [`Int{:tact}`][int]类型的值。
- `&={:tact}`，使用 [bitwise AND 运算符 `&{:tact}`](#binary-bitwise-and)。 只能应用于 [`Int{:tact}`][int]类型的值。
- `^={:tact}`，它使用 [bitwise XOR 运算符 `^{:tact}`](#binary-bitwise-xor)。  只能应用于 [`Int{:tact}`][int]类型的值。
- `|={:tact}`，它使用 [bitwise OR 运算符 `|{:tact}`](#binary-bitwise-or)。 只能应用于 [`Int{:tact}`][int]类型的值。

```tact
let value: Int = 5;

// +=
value + 5;         // adds 5
value = value + 5; // adds 5 and assigns result back
value += 5;        // also adds 5 and assigns result back

// -=
value - 5;         // subtracts 5
value = value - 5; // subtracts 5 and assigns result back
value -= 5;        // also subtracts 5 and assigns result back

// *=
value * 5;         // multiplies by 5
value = value * 5; // multiplies by 5 and assigns result back
value *= 5;        // also multiplies by 5 and assigns result back

// /=
value / 5;         // divides by 5
value = value / 5; // divides by 5 and assigns result back
value /= 5;        // also divides by 5 and assigns result back

// %=
value % 5;         // gets modulo by 5
value = value % 5; // gets modulo by 5 and assigns result back
value %= 5;        // also gets modulo by 5 and assigns result back

// &=
value & 5;         // bitwise ANDs 5
value = value & 5; // bitwise ANDs 5 and assigns result back
value &= 5;        // also bitwise ANDs 5 and assigns result back

// ^=
value ^ 5;         // bitwise XORs 5
value = value ^ 5; // bitwise XORs 5 and assigns result back
value ^= 5;        // also bitwise XORs 5 and assigns result back

// |=
value | 5;         // bitwise ORs 5
value = value | 5; // bitwise ORs 5 and assigns result back
value |= 5;        // also bitwise ORs 5 and assigns result back
```

[p]: /zh-cn/book/types#primitive-types
[bool]: /zh-cn/book/types#booleans
[int]: /zh-cn/book/integers
[cell]: /zh-cn/book/cells#cells
[slice]: /zh-cn/book/cells#slices



================================================
FILE: docs/src/content/docs/zh-cn/book/optionals.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/optionals.mdx
================================================
---
title: 可选项
---

[类型系统概述](/zh-cn/book/types#optionals)中提到，所有[原始类型](/zh-cn/book/types#primitive-types)、[结构体](/zh-cn/book/structs-and-messages#structs)和[消息](/zh-cn/book/structs-and-messages#messages)都可以为空。 也就是说，它们不一定有任何值，除了 `null{:tact}` —— 一个特殊的值，表示故意缺少任何其他值。

[变量](/zh-cn/book/statements#let)或[结构](/zh-cn/book/structs-and-messages#structs)和[消息](/zh-cn/book/structs-and-messages#messages)中可容纳 `null{:tact}` 的字段被称为"可选项"。 当变量不一定被使用时，它们对减少状态大小很有用。

在变量或字段的类型声明后添加问号 (`?{:tact}`)，就可以将其设为可选变量或字段。 唯一的例外是 [`map<K, V>{:tact}`](/zh-cn/book/maps)和 [`bounced<Msg>{:tact}`](/zh-cn/book/bounced)，你不能让它们、内部键/值类型（如果是 map）或内部[消息](/zh-cn/book/structs-and-messages#messages)（如果是 bounced）成为可选项。

未定义的可选变量或可选字段默认持有`null{:tact}`值。 您必须先检查`null{:tact}`，否则无法访问它们。 但如果你确定它们在某一时刻不是 `null{:tact}`，可以使用[非空断言操作符 `!!{:tact}`](/zh-cn/book/operators#unary-non-null-assert)访问它们的值。

在未使用 [`!!{:tact}`](/zh-cn/book/operators#unary-non-null-assert)或未事先检查 `null{:tact}` 的情况下尝试访问可选变量或可选字段的值，如果编译器可以跟踪，则会导致编译错误；如果不能跟踪，则会导致[退出码 128](/zh-cn/book/exit-codes#128)异常：空引用异常。

可选项举例：

```tact
struct StOpt {
    opt: Int?; // Int or null
}

message MsOpt {
    opt: StOpt?; // Notice, how the struct StOpt is used in this definition
}

contract Optionals {
    opt: Int?;
    address: Address?;

    init(opt: Int?) { // optionals as parameters
        self.opt = opt;
        self.address = null; // explicit null value
    }

    receive(msg: MsOpt) {
        let opt: Int? = 12; // defining a new variable
        if (self.opt != null) { // explicit check
            self.opt = opt!!; // using !! as we know that opt value isn't null
        }
    }
}
```



================================================
FILE: docs/src/content/docs/zh-cn/book/programmatic.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/programmatic.mdx
================================================
---
title: Programmatic API
description: 在Node.js和浏览器项目中使用 Tact编译器作为库的方法
---

您可以在节点和浏览器环境中从代码中调用 Tact 编译器。

:::caution

  该应用程序接口尚未发布。 它将在 1.0.0 版本中发布。

:::

## 在浏览器中运行编译器

```ts
import { run } from "@tact-lang/compiler";

// Virtual FS
const fs = {
  ["main.tact"]: Buffer.from("...").toString("base64"),
};

const config = {
  projects: [
    {
      name: "Sample",
      path: "main.tact",
      output: "./output",
    },
  ],
};

// Run compiler
let successful = await run({ config, fs });

// NOTE: Output from is written to the same fs object.
```

## 合约验证

您可以使用 `verify` 函数验证编译后的软件包。

```ts
import { verify } from "@tact-lang/compiler";
const pkg: string = '...';
const res = await verify(pkg);
```



================================================
FILE: docs/src/content/docs/zh-cn/book/receive.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/receive.mdx
================================================
---
title: 接收消息
description: 最常见的消息类型是内部消息 - 从一个合约发送到另一个合约的消息
prev:
  link: /zh-cn/book/functions
  label: 函数
---

TON 是一个分布式区块链，这意味着合约之间的通信是通过发送和接收信息完成的。  最常见的消息类型是内部消息――从一个合约(或一个钱包)发给另一个合约。

## 接收内部消息

要接收所需类型的消息，您需要声明一个接收函数，例如`receive("increment"){:tact}`。 此符号表示接收器函数的声明，当具有值 `"increment"{:tact}` 的文本被发送到合约时，将调用该函数。 函数体可以修改合约的状态，并向其他合约发送消息。 不可能直接调用`receiver`。 如果需要重用某些逻辑，可以声明一个函数，然后从`receiver`中调用。

有多个接收函数。 所有接收函数的处理顺序如下：

- `receive(){:tact}` - 向合约发送空消息时调用。
- `receive("message"){:tact}` - 向合约发送带有特定注释的文本消息时调用。
- `receive(str: String){:tact}` - 向合约发送任意文本消息时调用。
- `receive(msg: MyMessage){:tact}`-当向合约发送 `MyMessage` 类型的二进制消息时调用。
- `receive(msg: Slice){:tact}` - 向合约发送未知类型的二进制消息时调用。

```tact
message MyMessage {
    value: Int;
}

contract MyContract {
    receive() {
        // ...
    }
    receive("message") {
        // ...
    }
    receive(str: String) {
        // ...
    }
    receive(msg: MyMessage) {
        // ...
    }
    receive(msg: Slice) {
        // ...
    }
}
```

用下划线`_{:tact}`命名接收函数的参数时，其值将被视为未使用的值并被丢弃。  当您不需要检查接收到的消息，而只想让它传达特定的操作码时，这就很有用了：

```tact
message(42) UniverseCalls {}

contract Example {
    receive(_: UniverseCalls) {
        // Got a Message with opcode 42
    }
}
```



================================================
FILE: docs/src/content/docs/zh-cn/book/security-best-practices.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/security-best-practices.mdx
================================================
---
title: 最佳安全实践
description: Tact 智能合约开发者应当意识到的几个反模式、潜在攻击向量以及最佳实践。
---

[//]: # "✅❌"

Tact 智能合约开发者应该意识到一些反模式和潜在的攻击矢量。 这可能影响合约的安全性、效率和正确性。 以下我们将讨论编写和维护安全的 Tact 智能合约的具体注意事项。

为了加深理解，请参考以下资源：

- [TON文档中的智能合约指南](https://docs.ton.org/v3/guidelines/smart-contracts/guidelines)
- [TON Docs中的安全智能合约编程](https://docs.ton.org/v3/guidelines/smart-contracts/security/secure-programming)
* [令人惊叹的 TON 安全资源精选列表](https://github.com/Polaristow/awesome-ton-security/blob/main/README.md)

## 在链上发送敏感数据

整个智能合约计算是透明的，如果您在运行时有一些保密值，就可以通过简单的仿真来检索它们。

##### Do's ✅

**不**发送或存储在链上的敏感数据。

##### Don'ts ❌

```tact
message Login {
    privateKey: Int as uint256;
    signature: Slice;
    data: Slice;
}

contract Test {
    receive() { cashback(sender()) } // for the deployment

    receive(msg: Login) {
        let publicKey = getPublicKey(msg.privateKey);

        require(checkDataSignature(msg.data, msg.signature, publicKey), "Invalid signature!");
    }
}
```

## 滥用有符号整数

无符号整数较安全，因为它们能防止大部分设计错误，而已签名整数如果不认真使用，可能会产生不可预测的后果。 因此，只有在绝对必要时才能使用经签名的整数。

##### Do's ✅

优先使用无符号整数，除非有符号整数。

##### Don'ts ❌

下面是一个使用有符号整数的不正确的例子。 在`Vote{:tact}` [Message][message]中，`votes` 字段的类型是`Int as int32{:tact}`，这是一个32-bit有符号整数。 如果攻击者发送负数投票而不是正数，这可能导致欺骗。

```tact
message Vote { votes: Int as int32 }

contract Sample {
    votes: Int as uint32 = 0;

    receive(msg: Vote) {
        self.votes += msg.votes;
    }
}
```

## 无效的抛出值

[退出码](/zh-cn/book/exit-codes) $0$ 和 $1$ 表示交易的计算阶段正常执行。 如果调用一个 [`throw(){:tact}`](/zh-cn/ref/core-debug#throw) 或[类似的函数](/zh-cn/ref/core-debug) 直接带有退出码 $0$ 和 $1$ ，执行可能会意外中止. 这可能使调试非常困难，因为这种中止的执行与正常的执行无法区分。

##### Do's ✅

最好使用 [`require(){:tact}`](/zh-cn/ref/core-debug#require) 函数来阐明期望状态。

```tact
require(isDataValid(msg.data), "Invalid data!")；
```

##### Don'ts ❌

不要直接抛出 $0$ 或 $1$。

```tact
throw(0);
throw(1);
```

## 不安全的随机数字

在TON中生成真正安全的随机数字是一项挑战。 [`random()`](/zh-cn/ref/core-random#random)函数是伪随机的，取决于[逻辑时间](https://docs.ton.org/develop/smart-contracts/guidelines/message-delivery-guarantees#what-is-a-logical-time)。 黑客可以通过 [brute-forcing](https://en.wikipedia.org/wiki/Brute-force_attack) 当前区块中的逻辑时间来预测随机数。

##### Do's ✅

- 对于关键应用 **避免仅仅依赖于链上的解决方案**。

- 使用 [`random(){:tact}`](/zh-cn/ref/core-random#random) 与随机逻辑时间，以提高安全性，使攻击者更难预测而不访问验证节点。 但是，请注意，它仍然**不是完全万无一失的**。

- 考虑使用 **提交和披露方案**：
  1. 参与者在链外随机生成数字，并将其散列发送到合约中。
  2. 一旦收到所有哈希，参与者就公布其原始数字。
  3. 结合公开的数字（例如，将它们相加）以生成一个安全的随机值。

有关更多详细信息，请参阅 [TON 文档中的安全随机数生成页面](https://docs.ton.org/v3/guidelines/smart-contracts/security/random-number-generation)。

##### Don'ts ❌

不要依赖[`random(){:tact}`](/zh-cn/ref/core-random#random)函数。

```tact
if (random(1, 10) == 7) {
  ... send reward ...
}
```

不在 `external_message` 接收器中使用随机化，因为即使在随机逻辑时间内它仍然很脆弱。

## 优化消息处理

从人类友好的格式解析为机器可读的二进制结构的字符串解析工作应在**链下**完成。 这种办法确保只向区块链发送最优化和紧凑的消息，尽量减少计算和储存费用，同时避免不必要的气体间接费用。

##### Do's ✅

执行从可读格式解析为机器可读二进制结构**链下**的字符串以保持合约效率。

```tact
message Sample {
    parsedField: Slice;
}

contract Example {
    receive(msg: Sample) {
        // Process msg.parsedField directly
    }
}
```

##### Don'ts ❌

避免将字符串从可读格式解析为二进制结构**在链上**，因为这会增加计算开销和Gas成本。

```tact
message Sample { field: String }

contract Example {
    receive(msg: Sample) {
        // Parsing occurs on-chain, which is inefficient
        let parsed = field.fromBase64();
    }
}
```

## Gas限制

小心“Gas用尽错误”。 这无法处理，因此请尽量为每个接收者预先计算 gas 消耗[使用测试](/zh-cn/book/debug#tests)。 这将有助于避免浪费额外的gas，因为交易无论如何都会失败。

##### Do's ✅

```tact
message Vote { votes: Int as int32 }

contract Example {
    const voteGasUsage = 10000; // precompute with tests

    receive(msg: Vote) {
        require(context().value > getComputeFee(self.voteGasUsage, false), "Not enough gas!");
    }
}
```

## 身份验证

如果您的合约逻辑围绕可信的发件人运行，总是验证发件人的身份。 这可以使用 [`Ownable{:tact}`](/zh-cn/ref/stdlib-ownable) 特性或使用 [state init](/zh-cn/book/expressions#initof) 验证。 您可以阅读更多关于[Jetton validation](/zh-cn/cookbook/jettons#accepting-jetton-transfer)和[NFT validation](/zh-cn/cookbook/nfts#accepting-nft-ownership-assignment)的信息。

##### Do's ✅

使用 [`Ownable{:tact}`](/zh-cn/ref/stdlib-ownable) 特性.

```tact
import "@stdlib/ownable";

contract Counter with Ownable {
    owner: Address;
    val: Int as uint32;

    init() {
        self.owner = address("OWNER_ADDRESS");
        self.val = 0;
    }

    receive("admin-double") {
        self.requireOwner();
        self.val = self.val * 2;
    }
}
```

##### Don'ts ❌

不要在不验证发件人身份的情况下执行消息！

```tact
contract Example {
    myJettonWalletAddress: Address;
    myJettonAmount: Int as coins = 0;

    init(jettonWalletCode: Cell, jettonMasterAddress: Address) {
        self.myJettonWalletAddress = calculateJettonWalletAddress(
            myAddress(),
            jettonMasterAddress,
            jettonWalletCode,
        );
    }

    receive() { cashback(sender()) } // for the deployment

    receive(msg: JettonTransferNotification) {
        self.myJettonAmount += msg.amount;
    }
}
```

## 重放保护

重放保护是一种安全机制，防止攻击者重用以前的消息。 有关重放保护的更多信息，请参阅[TON 文档中的外部信息页面](https://docs.ton.org/develop/smart-contracts/guidelines/external-messages)。

##### Do's ✅

要区分消息，总是包含和验证独特的标识符，例如“seqno”。 成功处理后更新标识符以避免重复。

或者，您可以实现类似于[highload v3 wallet](https://github.com/ton-blockchain/highload-wallet-contract-v3/blob/main/contracts/highload-wallet-v3.func#L60)中的重放保护，这种保护不基于`seqno`。

```tact
message Msg {
    newMessage: Cell;
    signature: Slice;
}

struct DataToVerify {
    seqno: Int as uint64;
    message: Cell;
}

contract Sample {
    publicKey: Int as uint256;
    seqno: Int as uint64;

    init(publicKey: Int, seqno: Int) {
        self.publicKey = publicKey;
        self.seqno = seqno;
    }

    external(msg: Msg) {
        require(checkDataSignature(DataToVerify{
            seqno: self.seqno,
            message: msg.newMessage
        }.toSlice(), msg.signature, self.publicKey), "Invalid signature");
        acceptMessage();
        self.seqno += 1;
        sendRawMessage(msg.newMessage, 0);
    }
}
```

##### Don'ts ❌

不要依赖签名验证而不包含序列号。 没有重播保护的消息可能会被攻击者重发，因为没有方式区分有效的原始消息和重播的消息。

```tact
message Msg {
    newMessage: Cell;
    signature: Slice;
}

contract Sample {
    publicKey: Int as uint256;

    init(publicKey: Int, seqno: Int) {
        self.publicKey = publicKey;
    }

    external(msg: Msg) {
        require(checkDataSignature(msg.toSlice(), msg.signature, self.publicKey), "Invalid signature");
        acceptMessage();
        sendRawMessage(msg.newMessage, 0);
    }
}
```

## 消息的竞争条件

消息级联可以在很多区块上处理。 假定一个消息流正在运行，攻击者可以同时启动第二个消息流。 也就是说，如果一个属性在开始时被检查，例如用户是否有足够的Tokens，但不假定在同一合约的第三阶段仍会满足这一要求。

## 处理/发送退回消息

发送反弹标志(bounce flag)设置为 `true{:tact}`的信息，这是 [`send(){:tact}`](/zh-cn/ref/core-send#send)函数的默认设置。 消息在合约执行失败后退出。 您可能希望通过在 [`try...catch{:tact}`](/zh-cn/book/statements#try-catch) 语句中封装代码来回滚合约状态，并根据您的逻辑进行一些额外处理，从而解决这个问题。

##### Do's ✅

通过[bounced message receiver](/zh-cn/book/bounced/#bounced-message-receiver)处理退信以正确响应失败的信息。

```tact
contract JettonDefaultWallet {
    const minTonsForStorage: Int = ton("0.01");
    const gasConsumption: Int = ton("0.01");

    balance: Int;
    owner: Address;
    master: Address;

    init(master: Address, owner: Address) {
        self.balance = 0;
        self.owner = owner;
        self.master = master;
    }

    receive(msg: TokenBurn) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Invalid sender");

        self.balance = self.balance - msg.amount;
        require(self.balance >= 0, "Invalid balance");

        let fwdFee: Int = ctx.readForwardFee();
        require(ctx.value > fwdFee + 2 * self.gasConsumption + self.minTonsForStorage, "Invalid value - Burn");

        send(SendParameters {
            to: self.master,
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: TokenBurnNotification{
                queryId: msg.queryId,
                amount: msg.amount,
                owner: self.owner,
                response_destination: self.owner
            }.toCell()
        });
    }

    bounced(src: bounced<TokenBurnNotification>) {
        self.balance = self.balance + src.amount;
    }
}
```

## 交易和阶段

来自本书的 [发送信息页面](/zh-cn/book/send#outbound-message-processing)：

> TON Blockchain上的每笔交易由多个阶段组成。 发送信息是在计算阶段进行评估，但是在该阶段**不是**发送。 相反，它们会按出现的先后顺序排队进入行动阶段，在该阶段，计算阶段列出的所有行动（如向外发送消息或储备请求）都会被执行。

因此，如果计算阶段失败，[寄存器](https://docs.ton.org/v3/documentation/tvm/tvm-overview#control-registers) `c4`（持久性数据）和`c5`（操作）将不会更新。 但是，可以使用[`commit(){:tact}`](/zh-cn/ref/core-advanced/#commit)函数手动保存其状态。

## 小心退回多余 gas

如果多余 gas不退还给发送者，资金将会随着时间的推移累积在您的合约中。 原则上没有任何可怕之处，只是一种不理想的做法。 您可以添加一个函数来清除多余部分，但流行的合约，如ton Jetton，仍然通过带有`0xd53276db`操作码的[消息][message]返回给发送者。

##### Do's ✅

使用 `0xd5276db` opcode的[消息][message] 返回过剩的 gas。

```tact
message(0xd53276db) Excesses {}
message Vote { votes: Int as int32 }

contract Sample {
    votes: Int as uint32 = 0;

    receive(msg: Vote) {
        self.votes += msg.votes;

        send(SendParameters {
            to: sender(),
            value: 0,
            mode: SendRemainingValue | SendIgnoreErrors,
            body: Excesses{}.toCell(),
        });
    }
}
```

另外，您可以充分利用[`notify(){:tact}`](/zh-cn/ref/core-base/#self-notify) 或 [`forward(){:tact}`](/zh-cn/ref/core-base/#self-forward) 标准函数。

```tact
message(0xd53276db) Excesses {}
message Vote { votes: Int as int32 }

contract Sample {
    votes: Int as uint32 = 0;

    receive(msg: Vote) {
        self.votes += msg.votes;

        self.notify(Excesses{}.toCell());
    }
}
```

## 从其他合约中提取数据

区块链中的合约可以驻留在不同的分片中，由其他验证器处理，这意味着一个合约无法从其他合约中获取数据。 也就是说，任何合约都不能从其他合约调用[getter function](/zh-cn/book/functions#getter-functions))。

因此，任何链上的通信都是异步的，都是通过发送和接收信息来进行的。

##### Do's ✅

交换消息以从其他合约中提取数据。

```tact
message ProvideMoney {}
message TakeMoney { money: Int as coins }

contract OneContract {
    money: Int as coins;

    init(money: Int) {
        self.money = money;
    }

    receive(msg: ProvideMoney) {
        self.reply(TakeMoney{money: self.money}.toCell());
    }
}

contract AnotherContract {
    oneContractAddress: Address;

    init(oneContractAddress: Address) {
        self.oneContractAddress = oneContractAddress;
    }

    receive("get money") {
        self.forward(self.oneContractAddress, ProvideMoney{}.toCell(), false, null);
    }

    receive(msg: TakeMoney) {
        require(sender() == self.oneContractAddress, "Invalid money provider!");
        // Money processing
    }
}
```

[struct]: /zh-cn/book/structs-and-messages#structs
[message]: /zh-cn/book/structs-and-messages#messages



================================================
FILE: docs/src/content/docs/zh-cn/book/send.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/send.mdx
================================================
---
title: 发送消息
description: TON 区块链是基于消息的--要与其他合约通信和部署新合约，您需要发送消息。
---

TON 区块链是基于消息的--要与其他合约通信和部署新合约，您需要发送消息。

Tact 中的消息通常使用内置[Struct](/zh-cn/book/structs-and-messages#structs) `SendParameters{:tact}`组成，它由以下部分组成：

| 字段       | 类型                     | 说明                                                                                                                                  |
| :------- | :--------------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| `bounce` | [`Bool{:tact}`][p]     | 如果设置为`true`（默认），当接收合约不存在或无法处理消息时，消息会退回给发送者。                                                                                         |
| `to`     | [`Address{:tact}`][p]  | TON 区块链中的内部接收器 [`Address{:tact}`][p]。                                                                                               |
| `value`  | [`Int{:tact}`][int]    | 消息中要发送的[nanoToncoins][nano]的金额。 此值通常用于支付[转发费用][fwdfee]，除非使用了可选标志[`SendPayFwdFeesSeparately{:tact}`](/zh-cn/book/message-mode#optional-flags)。 |
| `mode`   | [`Int{:tact}`][int]    | 一个 8 位值，用于配置发送消息的方式，默认值为 $0$。 参见：[消息`模式`](/zh-cn/book/message-mode)。 见：[消息`mode`](/zh-cn/book/message-mode).                                    |
| `body`   | [`Cell?{:tact}`][cell] | [可选][opt]消息正文作为[`Cell{:tact}`][cell]                                                                                                |
| `code`   | [`Cell?{:tact}`][cell] | [可选][opt] 合约的初始代码（编译后的字节码）                                                                                                          |
| `data`   | [`Cell?{:tact}`][cell] | [可选][opt]合约的初始数据（合约的[`init(){:tact}`函数](/zh-cn/book/contracts#init-function)的参数）                                                          |

字段 `code` 和 `data` 被称为[初始化包](/zh-cn/book/expressions#initof)，它用于新合约的部署。

## 发送简单回复 {#send-simple-reply}

最简单的消息是回复收到的消息，返回消息的所有过剩值：

```tact
self.reply("Hello, World!".asComment()); // asComment converts a String to a Cell with a comment
```

## 发送消息 {#send-message}

如果需要更高级的逻辑，可以直接使用 `send(){:tact}` 函数和 `SendParameters{:tact}` [Struct](/zh-cn/book/structs-and-messages#structs) 。

事实上，前面使用 [`self.reply(){:tact}`](#send-simple-reply) 的示例可以通过调用下面的 `send(){:tact}` 函数来实现：

```tact
send(SendParameters {
    // bounce is set to true by default
    to: sender(), // sending message back to the sender
    value: 0, // don't add Toncoins to the message...
    mode: SendRemainingValue | SendIgnoreErrors, // ...except for ones received from the sender due to SendRemainingValue
    body: "Hello, World".asComment(), // asComment converts a String to a Cell with a comment
});
```

另一个示例是向指定的 [`Address{:tact}`][p]发送一条消息，消息的`值`为 $1$ TON，`body`为带有 [`String{:tact}`][p] `"Hello, World!"{:tact}`的注释：

```tact
let recipient: Address = address("...");
let value: Int = ton("1");
send(SendParameters {
    // bounce is set to true by default
    to: recipient,
    value: value,
    mode: SendIgnoreErrors, // will send the message despite any errors
    body: "Hello, World!".asComment(),
});
```

[可选标记](/zh-cn/book/message-mode#optional-flags) `SendIgnoreErrors{:tact}`表示即使在发送消息过程中发生错误，也会继续发送下一条消息。 **在发送阶段，没有错误会导致交易回滚。**

## 发送输入的消息

要发送二进制类型的消息，您可以使用以下代码：

```tact
let recipient: Address = address("...");
let value: Int = ton("1");
send(SendParameters {
    // bounce is set to true by default
    to: recipient,
    value: value,
    mode: SendIgnoreErrors, // don't stop in case of errors
    body: SomeMessage{arg1: 123, arg2: 1234}.toCell(),
});
```

## 部署合约

要部署一个合约，你需要用 [`initOf{:tact}`](/zh-cn/book/expressions#initof)计算它的地址和初始状态，然后在初始化消息中发送它们：

```tact
let init: StateInit = initOf SecondContract(arg1, arg2);
let address: Address = contractAddress(init);
let value: Int = ton("1");
send(SendParameters {
    // bounce is set to true by default
    to: address,
    value: value,
    mode: SendIgnoreErrors, // don't stop in case of errors
    code: init.code,
    data: init.data,
    body: "Hello, World!".asComment(), // not necessary, can be omitted
});
```

## 外发消息处理 {#outbound-message-processing}

TON 区块链上的每笔交易都由 [多个阶段][phases] 组成。 发送消息是在[计算阶段][compute]进行评估，但是在该阶段**不是**发送。 相反，它们将按照出现顺序排入[操作阶段][phases]，在[计算阶段][compute]中列出的所有操作，如外向消息或[储备请求](/zh-cn/ref/core-contextstate#nativereserve)，都会在此阶段执行。

由于所有值都是在[计算阶段][compute]中计算的，所有费用都是在计算结束前计算的，而且在[操作阶段][phases]中出现异常时不会恢复交易，因此向外发送消息可能会因[操作费](https://docs.ton.org/develop/howto/fees-low-level#action-fee) 或[转发费][fwdfee]不足而失败，不会出现跳转。

请看下面的例子：

```tact
// This contract initially has 0 nanoToncoins on the balance
contract FailureIsNothingButAnotherStep {
    // And all the funds it gets are obtained from inbound internal messages
    receive() {
        // 1st outbound message evaluated and queued (but not sent yet)
        send(SendParameters {
            to: sender(),
            value: ton("0.042"), // plus forward fee due to SendPayFwdFeesSeparately
            mode: SendIgnoreErrors | SendPayFwdFeesSeparately,
        });

        // 2nd outbound message evaluated and queued (but not sent yet, and never will be!)
        send(SendParameters {
            to: sender(),
            value: 0,
            mode: SendRemainingValue | SendIgnoreErrors,
        });
    }
}
```

在那里，第二条消息实际上不会被发送：

- [计算阶段][compute]结束后，计算合约的剩余价值 $\mathrm{R}$。

- 在出站消息处理过程中，假设入站消息中提供了足够的金额，第一条消息会在余额上留下 $\mathrm{R} - (0.042 + \mathrm{forward\_fees})$ [nanoToncoins](/zh-cn/book/integers#nanotoncoin) 。

- 处理第二条消息时，合约会尝试发送 $\mathrm{R}$ [nano Toncoins](/zh-cn/book/integers#nanotoncoin)，但发送失败，因为剩余的金额已经较少。

:::note

  有关所有消息发送功能的更多消息，请参阅参考资料：

- [`send(){:tact}`](/zh-cn/ref/core-send#send)
- [`emit(){:tact}`](/zh-cn/ref/core-send#emit)
- [`self.notify(){:tact}`](/zh-cn/ref/core-base#self-notify)
- [`self.reply(){:tact}`](/zh-cn/ref/core-base#self-reply)
- [`self.forward(){:tact}`](/zh-cn/ref/core-base#self-forward)
- [`sendRawMessage(){:tact}`](/zh-cn/ref/core-send#sendrawmessage)

:::

[p]: /zh-cn/book/types#primitive-types
[int]: /zh-cn/book/integers
[cell]: /zh-cn/book/cells#cells
[opt]: /zh-cn/book/optionals
[phases]: https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phasesC
[compute]: https://docs.ton.org/learn/tvm-instructions/tvm-overview#compute-phase
[nano]: /zh-cn/book/integers#nanotoncoin
[fwdfee]: https://docs.ton.org/develop/howto/fees-low-level#forward-fees



================================================
FILE: docs/src/content/docs/zh-cn/book/statements.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/statements.mdx
================================================
---
title: 语句
description: 此页面列出所有Tact语句，这些语句可以显示在函数的任何位置
---

import { Badge } from '@astrojs/starlight/components';

以下语句可出现在 [function](/zh-cn/book/functions) 主体的任何位置。

## `let`语句 {#let}

`let{:tact}` 语句允许声明局部变量和 [block](#block)-scoped 变量。

在Tact中，声明一个局部变量总是需要一个初始值。 但是，也可以省略类型标注，Tact 会尝试从初始值推断类型：

```tact
let value: Int = 123; // full definition with type and value
let vInferred = 123;  // inferred type Int

let vExplicitCtx: Context = context(); // explicit type Context, a built-in Struct
let vCtx = context();                  // inferred type Context
```

请注意，`null{:tact}`的初始值既可以指具有任意 `K{:tact}`和 `V{:tact}`类型的空[`map<K, V>{:tact}`](/zh-cn/book/maps)，也可以指故意不为[optional](/zh-cn/book/optionals)类型设置任何其他值。  这就是为什么在声明 [optional](/zh-cn/book/optionals) 或 [`map<K, V>{:tact}`](/zh-cn/book/maps)时，需要明确指定类型，因为无法推断：

```tact
let vOptional: Int? = null; // explicit type Int or null
let vOptInt = 42;           // implicit type Int
vOptInt = null;             // COMPILATION ERROR!

let vMap: map<Int, Int> = emptyMap(); // explicit type map<Int, Int>
let vMapWithSerialization: map<Int as uint8, Int as uint8> = emptyMap();
```

用下划线 `_{:tact}` 命名局部变量时，其值将被视为未使用并丢弃。 当你不需要某个函数的返回值（有副作用），并想明确地将变量标记为未使用时，这种方法就很有用。 注意，不能访问通配符变量名 `_{:tact}`： 当你不需要某个函数的返回值（有副作用），并想明确地将变量标记为未使用时，这种方法就很有用。 注意，不能访问通配符变量名 `_{:tact}`：

```tact
let _ = someFunctionWithSideEffects(); // with type inference
let _: map<Int, Int> = emptyMap();     // with explicit type

dump(_); // COMPILATION ERROR! Cannot access _
```

## `return` 语句 {#return}

`return{:tact}` 语句结束 [function](/zh-cn/book/functions) 的执行，并指定要返回给 [function](/zh-cn/book/functions) 调用者的值。

```tact
// Simple wrapper over stdlib function now()
fun getTimeFromNow(offset: Int): Int {
    return now() + offset;
}
```

## Block

块语句用于组合零个或多个语句。 块语句用于组合零个或多个语句。 块由一对大括号（"大括号"、`{}{:tact}`）分隔，包含一个由零个或多个语句和声明组成的列表。

某些语句，如 [`let{:tact}`](#let) 或 [`return{:tact}`](#return)，必须以结束分号 `;{:tact}` 结束。  不过，语块中最后一条语句的分号是可选的，可以省略。

```tact
{ // <- start of the block
    // arbitrary statements:
    let value: Int = 2 + 2;
    dump(value);
} // <- end of the block

{ dump(2 + 2) } // a block with only one statement,
                // omitted the last and only semicolon

{
    let nah = 3 * 3 * 3; // a block with two statements,
    let yay = nah + 42   // but without the last semicolon
}
```

## 表达式

表达式语句是一种表达式，用于预期需要语句的地方。  表达式被求值后，其结果将被丢弃--因此，它只适用于有副作用的表达式，如执行函数或更新变量。

```tact
dump(2 + 2); // stdlib function
```

## 赋值

赋值语句使用 [赋值运算符](/zh-cn/book/operators#assignment) (`={:tact}`)或 [增强赋值运算符](/zh-cn/book/operators#augmented-assignment) (赋值与运算相结合)：

```tact
let value: Int = 0; // definition
value = 5;          // assignment
value += 5;         // augmented assignment (one of the many, see below)
```

:::note

  有关赋值和增强赋值的更多信息，请参阅其专门章节：[赋值运算符](/zh-cn/book/operators#assignment)。

:::

## 解构赋值

<Badge text="Available since Tact 1.6" variant="tip" size="medium"/><p/>

解构赋值是一种简洁的方法，可以将[结构][s]和[消息][m]解包为不同的变量。 它镜像了[实例化语法](/zh-cn/book/expressions#instantiation)，但不是创建新的[结构体][s]或[消息][m]，而是将每个字段或部分字段绑定到它们各自的变量。

该语法源于 [`let`语句](#let)，它不是直接指定变量名，而是在[赋值运算符 `={:tact}`](/zh-cn/book/operators#assignment)的左侧指定结构类型，与右侧值的结构类型相对应。

```tact {9}
// Definition of Example
struct Example { number: Int }

// An arbitrary helper function
fun get42(): Example { return Example { number: 42 } }

fun basic() {
    // Basic syntax of destructuring assignment (to the left of "="):
    let Example { number } = get42();
    //  -------   ------     -------
    //  ↑         ↑          ↑
    //  |         |          gives the Example Struct
    //  |         definition of "number" variable, derived
    //  |         from the field "number" in Example Struct
    //  target structure type "Example"
    //  to destructure fields from

    // Same as above, but with an instantiation
    // to showcase how destructuring syntax mirrors it:
    let Example { number } = Example { number: 42 };
    //                       ----------------------
    //                       ↑
    //                       instantiation of Example Struct

    // Above examples of syntax are roughly equivalent
    // to the following series of statements:
    let example = Example { number: 42 };
    let number = example.number;
}
```

就像在[实例化](/zh-cn/book/expressions#instantiation)中一样，允许使用尾随逗号。

```tact
struct Example { number: Int }

fun trailblazing() {
    let Example {
        number,     // trailing comma inside variable list
    } = Example {
        number: 42, // trailing comma inside field list
    };
}
```

:::note

  [增强赋值运算符](/zh-cn/book/operators#augmented-assignment) 对此类赋值没有意义，因此会被报告为解析错误：

```tact
struct Example { number: Int }
fun get42(): Example { return Example { number: 42 } }

fun basic() {
    let Example { number } += get42();
    //                     ^ this will result in the parse error:
    //                     expected "="
}
```

:::

要创建一个不同变量名下的绑定，请在分号`:{:tact} `之后指定它。

```tact
// Similar definition, but this time field is called "field", not "number"
struct Example { field: Int }

fun naming(s: Example) {
    let Example { field: varFromField } = s;
    //                   ------------     ↑
    //                   ↑                |
    //                   |                instance of Example Struct, received
    //                   |                as a parameter of the function "naming"
    //                   definition of "varFromField" variable, derived
    //                   from the field "field" in Example Struct
}
```

请注意，绑定的顺序无关紧要——所有字段都保留其名称下的值和类型，不管它们在各自的 [Struct][s] 或 [Message][m] 中在定义中的顺序。

```tact
// "first" goes first, then goes "second"
struct Two { first: Int; second: String }

fun order(s: Two) {
    let Two { second, first } = s;
    //        ------  -----
    //        ↑       ↑
    //        |       this variable will be of type Int,
    //        |       same as the "first" field on Struct Two
    //        this variable will be of type String,
    //        same as the "second" field in Struct Two
}
```

解构赋值是彻底的，并且需要将所有字段指定为变量。 要故意忽略某些字段，可以使用下划线 `_{:tact}`，这将丢弃被考虑的字段的值。 注意，这些通配符变量名 `_{:tact}` 无法访问：

```tact
// "first" goes first, then goes "second"
struct Two { first: Int; second: String }

fun discard(s: Two) {
    let Two { second: _, first } = s;
    //              ---
    //              ↑
    //              discards the "second" field, only taking the "first"
}
```

若要完全忽略其余字段，请在列表末尾使用 `..` ：

```tact
struct Many { one: Int; two: Int; three: Int; fans: Int }

fun ignore(s: Many) {
    let Many { fans, .. } = s;
    //               --
    //               ↑
    //               ignores all the unspecified fields,
    //               defining only "fans"
}
```

:::caution

  目前，不允许对嵌套的[结构体][s]或[消息][m]进行解构。 也就是说，以下将不工作:

```tact
struct First { nested: Second }
struct Second { field: Int }

fun example() {
    let prep = First { nested: Second { field: 42 } };
    let First { nested: { field: thing } } = prep;
    //                  ^ this will result in the parse error:
    //                  expected "_", "A".."Z", or "a".."z"
}
```

:::

## Branches

控制代码流

### `if...else` {#if-else}

:::caution

  需要使用大括号（代码块）！

:::

在执行 `if...else{:tact}` 语句时，首先会对指定条件进行评估。 如果结果值为 `true{:tact}`，则执行下面的语句块。  否则，如果条件评估结果为 `false{:tact}`，将执行可选的 `else{:tact}` 块。 如果缺少 `else{:tact}` 块，则什么也不会发生，执行仍将继续。

常规 `if{:tact}` 语句：

```tact
// condition
// ↓
if (true) { // consequence, when condition is true
    dump(2 + 2);
}
```

`else{:tact}` 块：

```tact
// condition
// ↓
if (2 + 2 == 4) {
    // consequence, when condition is true
    dump(true);
} else {
    // alternative, when condition is false
    dump(false);
}
```

使用嵌套的 `if...else{:tact}`：

```tact
// condition
// ↓
if (2 + 2 == 3) {
    // consequence, when condition is true
    dump("3?");
//        condition2
//        ↓
} else if (2 + 2 == 4) {
    // another consequence, when condition2 is true
    dump(true);
} else {
    // alternative, when both condition and condition2 are false
    dump(false);
}
```

:::note

  Tact 也有一个三元表达式 `?:{:tact}`，在本书前面已有介绍：[三元表达式](/zh-cn/book/operators#ternary)。

:::

### `try...catch` {#try-catch}

`try...catch{:tact}`语句由一个 `try{:tact}`块和一个可选的 `catch{:tact}`块组成，它接收一个 [`Int{:tact}`][int][退出码](/zh-cn/book/exit-codes)作为唯一参数。 首先执行 `try{:tact}` 块中的代码，如果失败，则执行 `catch{:tact}` 块中的代码，并尽可能回滚 `try{:tact}` 块中的更改。

:::note

  请注意，某些 TVM 状态参数（如编码页和 gas 计数器）不会回滚。 也就是说，`try{:tact}`程序块中的所有 gas 使用量都将被考虑在内，而改变 gas 限值的操作码的效果也将被保留。 也就是说，`try{:tact}` 程序块中的所有 gas 使用量都将被考虑在内，而改变 gas 限值的操作码的效果也将被保留。

:::

常规 `try{:tact}` 语句：

```tact
fun braveAndTrue() {
    // Lets try and do something erroneous
    try {
        throw(1042); // throwing with exit code 1042
    }

    // The following will be executed as the erroneous code above was wrapped in a try block
    dump(1042);
}
```

用 `catch (e){:tact}` 块：

```tact
fun niceCatch() {
    // Lets try and do something erroneous
    try {
        throw(1042); // throwing with exit code 1042
    } catch (err) {
        dump(err);       // this will dump the exit code caught, which is 1042
    }
}
```

使用嵌套的 `try...catch{:tact}`：

```tact
try {
    // Preparing an x equal to 0, in such a way that Tact compiler won't realize it (yet!)
    let xs: Slice = beginCell().storeUint(0, 1).endCell().beginParse();
    let x: Int = xs.loadUint(1); // 0

    try {
        throw(101);     // 1. throws with exit code 101
    } catch (err) {     // 2. catches the error and captures its exit code (101) as err
        return err / x; // 3. divides err by x, which is zero, throwing with exit code 4
    }

} catch (err) {         // 4. catches the new error and captures its exit code (4) as err
    //   ^^^ this works without name collisions because the previous err
    //       has a different scope and is only visible inside the previous catch block

    dump(err);          // 5. dumps the last caught exit code (4)
}
```

请注意，与 [`let{:tact}` 语句](#let)类似，在 `catch (){:tact}` 子句中捕获的[退出码](/zh-cn/book/exit-codes)可以通过指定下划线 `_{:tact}` 来丢弃：

```tact
try {
    throw(42);
} catch (_) {
    dump("I don't know the exit code anymore");
}
```

:::note

  在专用页面上阅读更多有关退出码的信息：[本书中的退出码](/zh-cn/book/exit-codes)。

:::

## 循环

有条件地多次重复某些代码块。

### `repeat` {#repeat-loop}

`repeat{:tact}` 循环执行一段代码指定的次数。 重复次数应以正 $32$-bit [`Int{:tact}`][int]的形式给出，范围从 $1$ 到 2^{31} - 1$。 如果数值更大，则会出现[退出码 5](/zh-cn/book/exit-codes#5)，"整数超出预期范围 "的错误。

如果指定的重复次数等于 $0$ 或包含范围 $-2^{256}$ 至 $-1$ 中的任何负数，则忽略该值，不执行代码块。

```tact
let twoPow: Int = 1;

// Repeat exactly 10 times
repeat (10) {
    twoPow *= 2;
}

// Skipped
repeat (-1) {
    twoPow *= 3333;
}

twoPow; // 1024
```

### `while` {#while-loop}

只要给定条件为 `true{:tact}`，`while{:tact}` 循环就会继续执行代码块。

在下面的示例中，每次迭代时，`x` 的值都会递减 $1$，因此循环将运行 $10$ 次：

```tact
let x: Int = 10;
while (x > 0) {
    x -= 1;
}
```

### `do...until` {#do-until-loop}

`do...until{:tact}`循环是一个后测试循环，它至少执行一次代码块，然后继续执行，直到给定条件变为 `true{:tact}`。

在下面的示例中，每次迭代时，`x` 的值都会递减 $1$，因此循环将运行 $10$ 次：

```tact
let x: Int = 10;
do {
    x -= 1;  // executes this code block at least once
} until (x <= 0);
```

### `foreach` {#foreach-loop}

`foreach{:tact}` 循环按顺序对 [`map<K, V>{:tact}`](/zh-cn/book/maps) 类型的键值对（条目）进行操作：从 map 的最小键到最大键。

该循环为给定映射中的每个条目执行一个代码块，每次迭代都会捕获键和值。 该循环为给定映射中的每个条目执行一个代码块，每次迭代都会捕获键和值。 当您事先不知道map中有多少个条目，或不想明确地使用map的 [`.get(){:tact}`](/zh-cn/book/maps#get) [method](/zh-cn/book/functions#extension-function) 查找每个条目时，这将非常方便。

请注意，每次迭代时捕获的键和值对的名称是任意的，可以是任何有效的 Tact 标识符，只要它们是当前作用域的新标识符即可。  最常见的选项是：`k` 和 `v`，或者 `key` 和 `value`。

在下面的示例中，地图 `cells` 有 $4$ 个条目，因此循环将运行 $4$ 次：

```tact
// Empty map
let cells: map<Int, Cell> = emptyMap();

// Setting four entries
cells.set(1, beginCell().storeUint(100, 16).endCell());
cells.set(2, beginCell().storeUint(200, 16).endCell());
cells.set(3, beginCell().storeUint(300, 16).endCell());
cells.set(4, beginCell().storeUint(400, 16).endCell());

// A variable for summing up the values
let sum: Int = 0;

// For each key and value pair in cells map, do:
foreach (key, value in cells) { // or just k, v
    let s: Slice = value.beginParse(); // convert Cell to Slice
    sum += s.loadUint(16);             // sum the Slice values
}
dump(sum); // 1000
```

还可以遍历合约存储中的映射，以及作为 [Struct](/zh-cn/book/structs-and-messages#structs) 或 [Message](/zh-cn/book/structs-and-messages#messages) 类型实例成员的映射：

```tact
import "@stdlib/deploy";

struct Fizz { oh_my: map<Int, Int> }
message Buzz { oh_my: map<Int, Int> }

contract Iterated {
    oh_my: map<Int, Int>;

    receive("call to iterate!") {
        let oh_my: map<Int, Int> = emptyMap();
        oh_my.set(0, 42);
        oh_my.set(1, 27);

        self.oh_my = oh_my; // assigning local map to the storage one
        let fizz = Fizz{ oh_my }; // field punning
        let buzz = Buzz{ oh_my }; // field punning

        // Iterating over map in contract storage
        foreach (key, value in self.oh_my) {
            // ...
        }

        // Iterating over map member of a Struct Fizz instance
        foreach (key, value in fizz.oh_my) {
            // ...
        }

        // Iterating over map member of a Message Buzz instance
        foreach (key, value in buzz.oh_my) {
            // ...
        }
    }
}
```

请注意，与 [`let{:tact}` 语句](#let)类似，可以通过指定下划线 `_{:tact}` 来丢弃捕获的键或值（或两者）：

```tact
// Empty map
let quartiles: map<Int, Int> = emptyMap();

// Setting some entries
quartiles.set(1, 25);
quartiles.set(2, 50);
quartiles.set(3, 75);

// Discarding captured keys
// without modifying them in the map itself
foreach (_, value in quartiles) {}

// Discarding captured values
// without modifying them in the map itself
foreach (key, _ in quartiles) {}

// Discarding both keys and values
// without modifying them in the map itself
foreach (_, _ in quartiles) {
    // Can't access via _, but can do desired operations
    // n times, where n is the current length of the map
}
```

:::caution

  请注意，目前 `foreach{:tact}` 只适用于明确提供的映射标识符和嵌套标识符结构，如 `foo.bar.targetMap{:tact}` 或 `self.baz.targetMap{:tact}`。  也就是说，从函数中返回一个映射并试图遍历其条目是行不通的：

```tact
foreach (k, v in emptyMap()) {
//               ^ this will give the following error message:
//                 foreach is only allowed over maps that are path expressions,
//                 i.e. identifiers, or sequences of direct contract/struct/message accesses,
//                 like "self.foo" or "self.structure.field"
}
```

  试图遍历函数返回的 [Struct](/zh-cn/book/structs-and-messages#structs)的 map 成员也是行不通的，因为函数调用是一种表达式，而不是标识符或嵌套标识符访问：

```tact
foreach (k, v in genCoolStruct().map) {
//               ^ this will give the following error message:
//                 foreach is only allowed over maps that are path expressions,
//                 i.e. identifiers, or sequences of direct contract/struct/message accesses,
//                 like "self.foo" or "self.structure.field"
}
```

:::

:::note

  有关其他循环示例，请参阅[循环示例](https://tact-by-example.org/04-loops)。

:::

[int]: /zh-cn/book/integers
[s]: /zh-cn/book/structs-and-messages#structs
[m]: /zh-cn/book/structs-and-messages#messages



================================================
FILE: docs/src/content/docs/zh-cn/book/structs-and-messages.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/structs-and-messages.mdx
================================================
---
title: 结构(Structs)和消息(Messages)
description: 结构可以定义包含不同类型多个字段的复杂数据类型，而消息还具有 32 位头，并且可以方便地在 TON Blockchain 上接收和发送消息体。
---

Tact 支持许多专为智能合约使用而定制的 [原始数据类型](/zh-cn/book/types#primitive-types)。 不过，使用单独的存储方式往往会变得繁琐，因此有 [Structs](#structs) 和 [Messages](#messages)可以将类型组合在一起。 不过，使用单独的存储方式往往会变得繁琐，因此有 [Structs](#structs) 和 [Messages](#messages)可以将类型组合在一起。

:::caution

  **警告**：目前不支持循环类型。 **警告**：目前无法**循环**类型。 这意味着结构/消息 **A** 的字段不能与结构/消息 **B** 的字段相同。

  因此，以下代码**无法**编译：

```tact
struct A {
    circularFieldA: B;
}

struct B {
    impossibleFieldB: A;
}
```

:::

## 结构 {#structs}

结构体可以定义包含多个不同类型字段的复杂数据类型。 它们还可以嵌套。 它们还可以嵌套。

```tact
struct Point {
    x: Int as int64;
    y: Int as int64;
}

struct Line {
    start: Point;
    end: Point;
}
```

结构体还可以包含默认字段，并定义[可选类型](/zh-cn/book/optionals)的字段。 结构体还可以包含默认字段和定义[可选类型]字段（/book/optionals）。 如果您有很多字段，但又不想一直在 [new instances](#instantiate) 中为它们指定通用值，那么这将非常有用。

```tact
struct Params {
    name: String = "Satoshi"; // default value

    age: Int?; // field with an optional type Int?
               // and default value of null

    point: Point; // nested Structs
}
```

结构体还可用作获取器(getters)或其他内部函数的返回值。  它们有效地允许单个获取器返回多个返回值。

```tact
contract StructsShowcase {
    params: Params; // Struct as a contract's persistent state variable

    init() {
        self.params = Params{
            point: Point{
                x: 4,
                y: 2,
            },
        };
    }

    get fun params(): Params {
        return self.params;
    }
}
```

请注意，结构声明中的最后一个分号 `;`是可选项，可以省略：

```tact
struct Mad { ness: Bool }

struct MoviesToWatch {
    wolverine: String;
    redFunnyGuy: String
}
```

字段的顺序很重要，因为它与[TL-B 模式](https://docs.ton.org/develop/data-formats/tl-b-language) 中的内存布局一致。  不过，与某些采用手动内存管理的语言不同，Tact 在字段之间没有任何填充。

## 消息 {#messages}

消息中可以包含 [结构体](#structs)：

```tact
struct Point {
    x: Int;
    y: Int;
}

message Add {
    point: Point; // holds a struct Point
}
```

消息与 [结构体](#structs)几乎相同，唯一不同的是，消息在序列化时有一个 32 位整数头，包含唯一的数字 id，通常称为 _opcode_（操作码）。  这使得消息可以与 [接收者(receivers)](/zh-cn/book/receive) 一起使用，因为合约可以根据这个 id 区分不同类型的消息。

Tact 会为每个接收到的消息自动生成这些唯一 ID（操作码），但也可以手动覆盖：

```tact
// This Message overwrites its unique id with 0x7362d09c
message(0x7362d09c) TokenNotification {
    forwardPayload: Slice as remaining;
}
```

这对于要处理特定智能合约的某些操作码（如 [Jetton standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)）的情况非常有用。  该合约能够处理的操作码简表为[此处以 FunC 表示](https://github.com/ton-blockchain/token-contract/blob/main/ft/op-codes.fc)。 它们是智能合约的接口。

:::note

  更深入的消息请参见：\
  [Convert received messages to `op` operations](/zh-cn/book/func#convert-received-messages-to-op-operations)\
  [Internal message body layout in TON Docs](https://docs.ton.org/develop/smart-contracts/guidelines/internal-messages#internal-message-body)\
  [Messages of the Jetton implementation in Tact](https://github.com/tact-lang/jetton/blob/3f02e1065b871cbab300e019f578c3fb0b19effa/src/contracts/base/messages.tact)\
  [Common examples of working with Fungible Tokens (Jettons) in Tact](/zh-cn/cookbook/jettons)

:::

## 操作

### 实例化 {#instantiate}

创建 [Struct](#structs) 和 [Message](#messages) 实例类似于 [function calls](/zh-cn/book/expressions#static-function-call)，但需要用大括号 `{}{:tact}`（大括号）代替小括号 `(){:tact}`指定参数：

```tact
struct StA {
    field1: Int;
    field2: Int;
}

message MsgB {
    field1: String;
    field2: String;
}

fun example() {
    // Instance of a Struct StA
    StA{
        field1: 42,
        field2: 68 + 1, // trailing comma is allowed
    };

    // Instance of a Message MsgB
    MsgB{
        field1: "May the 4th",
        field2: "be with you!", // trailing comma is allowed
    };
}
```

当分配给字段的变量或常量的名称与该字段的名称相同时，Tact 提供了一种方便的语法捷径，有时称为字段戏法。 有了它，你就不必输入多余的内容：

```tact
struct PopQuiz {
    vogonsCount: Int;
    nicestNumber: Int;
}

fun example() {
    // Let's introduce a couple of variables
    let vogonsCount: Int = 42;
    let nicestNumber: Int = 68 + 1;

    // You may instantiate the Struct as usual and assign variables to fields,
    // but that is a bit repetitive and tedious at times
    PopQuiz{ vogonsCount: vogonsCount, nicestNumber: nicestNumber };

    // Let's use field punning and type less,
    // because our variable names happen to be the same as field names
    PopQuiz{
        vogonsCount,
        nicestNumber, // trailing comma is allowed here too!
    };
}
```

:::note

  因为实例化是 Tact 中的一个表达式，所以在相关页面中也有描述：[实例化表达式](/zh-cn/book/expressions#instantiation)。

:::

### 转换为 `Cell`, `.toCell()` {#tocell}

通过使用 `.toCell(){:tact}` [扩展函数](/zh-cn/book/functions#extension-function)，可以将任意 [Struct](#structs) 或 [Message](#messages) 转换为 [`cell{:tact}`][cell] 类型：

```tact
struct Big {
    f1: Int;
    f2: Int;
    f3: Int;
    f4: Int;
    f5: Int;
    f6: Int;
}

fun conversionFun() {
    dump(Big{
        f1: 10000000000, f2: 10000000000, f3: 10000000000,
        f4: 10000000000, f5: 10000000000, f6: 10000000000,
    }.toCell()); // x{...cell with references...}
}
```

:::note

  参见参考资料中的扩展函数：
  [`Struct.toCell(){:tact}`](/zh-cn/ref/core-cells#structtocell)/
  [`Message.toCell(){:tact}`](/zh-cn/ref/core-cells#messagetocell)。

:::

### 从 `Cell` 或 `Slice` 获取，`.fromCell()` 和 `.fromSlice()` {#fromcellslice}

无需通过一系列相关的 `.loadSomething(){:tact}` 函数调用来手动解析 [`Cell{:tact}`][cell] 或 [`Slice{:tact}`][slice]，而是可以使用 `.fromCell(){:tact}` 和 `.fromSlice(){:tact}` [扩展函数](/zh-cn/book/functions#extension-function)。这些扩展函数将所提供的 [`Cell{:tact}`][cell] 或 [`Slice{:tact}`][slice] 转换为所需的 [Struct](#structs) 或 [Message](#messages)。

这些扩展函数仅尝试根据 [Struct](#structs) 或 [Message](#messages) 的结构解析 [`Cell{:tact}`][cell] 或 [`Slice{:tact}`][slice]。 如果布局不匹配，可能会抛出各种异常--确保用 [`try...catch{:tact}`](/zh-cn/book/statements#try-catch)块封装代码，以防止意外结果。

```tact
struct Fizz { foo: Int }
message(100) Buzz { bar: Int }

fun constructThenParse() {
    let fizzCell = Fizz{foo: 42}.toCell();
    let buzzCell = Buzz{bar: 27}.toCell();

    let parsedFizz: Fizz = Fizz.fromCell(fizzCell);
    let parsedBuzz: Buzz = Buzz.fromCell(buzzCell);
}
```

:::note

  参见参考资料中的扩展函数：
  [`Struct.fromCell(){:tact}`][st-fc]/
  [`Struct.fromSlice(){:tact}`][st-fs]/
  [`Message.fromCell(){:tact}`][msg-fc]/
  [`Message.fromSlice(){:tact}`][msg-fs]/ 。

:::

### 转换法

只要通过 `.toCell(){:tact}` 和 `.fromCell(){:tact}` 函数在 [`cell{:tact}`][cell]/[`slice{:tact}`][slice] 和 [结构体](#structs)/[消息](#messages) 之间进行转换，以下规律就会成立：

- 对于任何 [Struct](#structs)/[Message](#messages)类型的实例，调用`.toCell(){:tact}`，然后对结果应用`Struct.fromCell(){:tact}`（或`Message.fromCell(){:tact}`），就会得到原始实例的副本：

```tact {8-9,13-14}
struct ArbitraryStruct { fieldNotFound: Int = 404 }
message(0x2A) ArbitraryMessage {}

fun lawOne() {
    let structInst = ArbitraryStruct{};
    let messageInst = ArbitraryMessage{};

    ArbitraryStruct.fromCell(structInst.toCell());   // = structInst
    ArbitraryMessage.fromCell(messageInst.toCell()); // = messageInst

    // Same goes for Slices, with .toCell().asSlice() and .fromSlice()

    ArbitraryStruct.fromSlice(structInst.toCell().asSlice());   // = structInst
    ArbitraryMessage.fromSlice(messageInst.toCell().asSlice()); // = messageInst
}
```

- 对于任何与给定 [Struct](#structs)/[Message](#messages) 具有相同 [TL-B](https://docs.ton.org/develop/data-formats/tl-b-language) 布局的 [`cell{:tact}`][cell]，调用 `Struct.fromCell(){:tact}`（或 `Message.fromCell(){:tact}`），然后通过 `.toCell(){:tact}` 将结果转换为 [`Cell{:tact}`][cell]，就会得到原始 [`cell{:tact}`][cell] 的副本：

```tact {9-10,15-16}
struct ArbitraryStruct { val: Int as uint32 }
message(0x2A) ArbitraryMessage {}

fun lawTwo() {
    // Using 32 bits to store 42 just so this cellInst can be
    // reused for working with both ArbitraryStruct and ArbitraryMessage
    let cellInst = beginCell().storeUint(42, 32).endCell();

    ArbitraryStruct.fromCell(cellInst).toCell();  // = cellInst
    ArbitraryMessage.fromCell(cellInst).toCell(); // = cellInst

    // Same goes for Slices, with .fromSlice() and .toCell().asSlice()
    let sliceInst = cellInst.asSlice();

    ArbitraryStruct.fromSlice(sliceInst).toCell().asSlice();  // = sliceInst
    ArbitraryMessage.fromSlice(sliceInst).toCell().asSlice(); // = sliceInst
}
```

[st-fc]: /zh-cn/ref/core-cells#structfromcell
[st-fs]: /zh-cn/ref/core-cells#structfromslice
[msg-fc]: /zh-cn/ref/core-cells#messagefromcell
[msg-fs]: /zh-cn/ref/core-cells#messagefromslice
[p]: /zh-cn/book/types#primitive-types
[cell]: /zh-cn/book/cells#cells
[slice]: /zh-cn/book/cells#slices



================================================
FILE: docs/src/content/docs/zh-cn/book/types.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/types.mdx
================================================
---
title: 类型系统概述
description: Tact 程序中的每个变量、项目和值都有一个类型
prev:
  link: /zh-cn/book/cs/from-solidity
  label: 来自Solidity
---

Tact 程序中的每个变量、项目和值都有一个类型。 它们可以是

- [原始类型](#primitive-types) 之一
- 或 [复合类型](#composite-types)

此外，这些类型中的许多类型[可以变为空值](#optionals)。

## 原始类型 {#primitive-types}

Tact 支持许多专为智能合约定制的原始数据类型：

- `Int{:tact}` — Tact 中的所有数字都是 257 位有符号整数，但可以使用[较小的表示方法](/zh-cn/book/integers#serialization)来减少存储成本。
- `Bool{:tact}` — 经典布尔类型，具有 `true{:tact}` 和 `false{:tact}` 值。
- `Address{:tact}` — TON 区块链中的标准[智能合约地址](https://docs.ton.org/learn/overviews/addresses#address-of-smart-contract)。
- [`Cell{:tact}`](/zh-cn/book/cells#cells)、[`Builder{:tact}`](/zh-cn/book/cells#builders)、[`Slice{:tact}`](/zh-cn/book/cells#slices) — [TVM][tvm] 的底层基元。
- `String{:tact}` — 不可变的文本字符串。
- `StringBuilder{:tact}` — 辅助类型，允许以节省 gas 的方式连接字符串。

[tvm]: https://docs.ton.org/learn/tvm-instructions/tvm-overview

### 布尔值 {#booleans}

原始类型 `Bool{:tact}` 是经典的布尔类型，只能容纳两个值：`true{:tact}` 和 `false{:tact}`。它便于布尔和逻辑运算，也便于存储标志。 它便于布尔和逻辑运算，也便于存储标志。

Tact 中没有隐式类型转换，因此两个布尔值的加法（[`+{:tact}`](/zh-cn/book/operators#binary-add)）是不可能的。这里有许多比较[运算符](/zh-cn/book/operators)，例如： 这里有许多比较[运算符](/zh-cn/book/operators)，例如：

- `&&{:tact}` 为 [logical AND](/zh-cn/book/operators#binary-logical-and)
- `||{:tact}` 为 [logical OR](/zh-cn/book/operators#binary-logical-or)
- `!{:tact}` 为 [logical inversion](/zh-cn/book/operators#unary-inverse)
- `=={:tact}` 和 `!={:tact}` 用于检查[相等](/zh-cn/book/operators#binary-equality)
- `!{:tact}` 表示[非空断言](/zh-cn/book/optionals)

将布尔值持久化到状态中非常节省空间，因为它们只占用1位。 在状态中存储 1000 个布尔值每年大约花费 $0.00072$ TON。

## 复合类型 {#composite-types}

使用单独的存储手段往往会变得繁琐，因此有办法将多个[原始类型](#primitive-types)组合在一起，创建复合类型：

- [Maps](#maps) - 键与值的关联。
- 复合类型，如[结构体和消息](#structs-and-messages)
- [可选项](#optionals) - [结构体和消息](#structs-and-messages)变量或字段的`null{:tact}`值。

除上述复合类型外，Tact 还提供了一种特殊的类型构造函数[`bounced<T>{:tact}`](/zh-cn/book/bounced)，它只能在[回退消息接收器(bounced message receivers)](/zh-cn/book/bounced)中指定。

请注意，虽然[合约](#contracts)和[trait](#traits)也被视为Tact类型系统的一部分，但我们不能像[结构体和消息](#structs-and-messages)那样传递它们。 相反，我们可以使用 [`initOf{:tact}`](/zh-cn/book/expressions#initof)表达式来获取给定合约的初始状态。

### Maps

类型[`map<K, V>{:tact}`][maps]用于将类型`K{:tact}`的键与类型`V{:tact}`的相应值关联起来。

示例[`map<K, V>{:tact}`][maps]

```tact
let mapExample: map<Int, Int> = emptyMap(); // empty map with Int keys and values
```

在专用页面了解更多关于他们的信息： [Maps][maps]。

[maps]: /zh-cn/book/maps

### 结构和消息 {#structs-and-messages}

[结构][structs]和[消息][messages]是将多个[原始类型](#primitive-types)组合成复合类型的两种主要方式。

[Struct][structs] 示例：

```tact
struct Point {
    x: Int;
    y: Int;
}
```

[Message][messages] 示例：

```tact
// Custom numeric id of the Message
message(0x11111111) SetValue {
    key: Int;
    value: Int?; // Optional, Int or null
    coins: Int as coins; // Serialization into TL-B types
}
```

有关它们的更多消息，请访问专门页面：[结构和消息][s-n-m]。

[s-n-m]: /zh-cn/book/structs-and-messages
[structs]: /zh-cn/book/structs-and-messages#structs
[messages]: /zh-cn/book/structs-and-messages#messages

### 可选项 {#optionals}

所有[原始类型](#primitive-types)以及[结构体和消息](#structs-and-messages)都可以为空，并持有一个特殊的 `null{:tact}`值。

[可选项][optionals]示例：

```tact
let opt: Int? = null; // Int or null, with explicitly assigned null
```

在专门页面了解更多信息：[可选项][optionals]。

[optionals]: /zh-cn/book/optionals

### 合约 {#contracts}

TON区块链上的[合约](/zh-cn/book/contracts)在Tact中作为智能合约的主要入口。 它包含了一个TON合约的所有[functions](/zh-cn/book/functions)、[getters](/zh-cn/book/functions#getter-functions)和[receivers](/zh-cn/book/functions#receiver-functions)等多种内容。

[合约示例](/zh-cn/book/contracts)：

```tact
contract HelloWorld {
    // Persistent state variable
    counter: Int;

    // Constructor function init(), where all the variables are initialized
    init() {
        self.counter = 0;
    }

    // Internal message receiver, which responds to a string message "increment"
    receive("increment") {
        self.counter += 1;
    }

    // Getter function with return type Int
    get fun counter(): Int {
        return self.counter;
    }
}
```

or [Contracts](#contracts) and [Traits](#traits)

### Traits

Tact 不支持经典的类继承，而是引入了**trait**（traits）的概念。它们的结构与抽象合约（类似于流行的面向对象语言中的抽象类）相同。 它们的结构与[合约](#contracts) 相同，但不能[初始化持久状态变量](/zh-cn/book/contracts#init-function)。

trait还可以让继承它的合约重写其[函数](/zh-cn/book/functions#virtual-and-abstract-functions)的行为和[常量](/zh-cn/book/constants#virtual-and-abstract-constants)的值。

来自 [`@stdlib/ownable`](/zh-cn/ref/stdlib-ownable) 的 trait [`Ownable`](/zh-cn/ref/stdlib-ownable#ownable) 示例：

```tact
trait Ownable {
    // Persistent state variable, which cannot be initialized in the trait
    owner: Address;

    // Internal function
    fun requireOwner() {
        throwUnless(TactExitCodeAccessDenied, context().sender == self.owner);
    }

    // Getter function with return type Address
    get fun owner(): Address {
        return self.owner;
    }
}
```

而 [合约](#contracts) 使用了 trait [`Ownable{:tact}`](/zh-cn/ref/stdlib-ownable#ownable)：

```tact
contract Treasure with Ownable {
    // Persistent state variable, which MUST be defined in the contract
    owner: Address;

    // Constructor function init(), where all the variables are initialized
    init(owner: Address) {
        self.owner = owner;
    }
}
```



================================================
FILE: docs/src/content/docs/zh-cn/book/upgrades.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/book/upgrades.mdx
================================================
---
title: 合约升级
description: Tact 目前不允许合约升级，因为 Tact 合约比 `func` 中的合约更复杂。
---

Tact目前不允许升级合约，因为Tact合约比FunC合约更复杂。 理论上是可行的，但所需的工具并不在这里。



================================================
FILE: docs/src/content/docs/zh-cn/cookbook/access.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/cookbook/access.mdx
================================================
---
title: 访问控制
description: 此页列出了使用特权、所有权和访问控制的常见例子
---

本页列出了使用权限、所有权和访问控制的常见示例。

## 如何使用 Ownable trait检查发件人权限

```tact
// Ownable has to be imported from stdlib:
import "@stdlib/ownable";

message FooBarMsg {
    newVal: Int as uint32;
}

// Ownable trait can limit certain actions to the owner only
contract SenderChecker with Ownable {
    // Persistent state variables
    owner: Address;     // Ownable trait requires you to add this exact state variable
    val: Int as uint32; // some value

    init() {
        // we can initialize owner to any value we want, the deployer in this case:
        self.owner = sender();
        self.val = 0;
    }

    receive() { cashback(sender()) } // for the deployment

    receive("inc") {
        self.requireOwner(); // throws exit code 132 if the sender isn't an owner
        self.val += 1;
    }

    receive(msg: FooBarMsg) {
        self.requireOwner(); // throws exit code 132 if the sender isn't an owner
        self.val = msg.newVal;
    }
}
```

:::note[Useful links:]

  [核心库中的 `trait Ownable{:tact}`](/zh-cn/ref/stdlib-ownable#ownable)

:::

:::tip[Hey there!]

  没有找到您最喜欢的访问控制范例？  您有很酷的实施方案吗？ [欢迎投稿！](https://github.com/tact-lang/tact/issues)

:::



================================================
FILE: docs/src/content/docs/zh-cn/cookbook/algo.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/cookbook/algo.mdx
================================================
---
title: 算法
description: Tact的通用算法实现通常面向合约开发
---

算法是严格指令的有限序列，通常用于解决一类特定问题或进行计算。

:::danger[Not implemented]

  这页是一个存根页面。 本页为残页。 [欢迎投稿！](https://github.com/tact-lang/tact/issues)

:::



================================================
FILE: docs/src/content/docs/zh-cn/cookbook/data-structures.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/cookbook/data-structures.mdx
================================================
---
title: 数据结构
description: 本页列出了在 Tact 中实现的数据结构的便捷集合，可满足您的日常及其他需求
---

数据结构是数据组织、管理和存储格式，通常是为了高效访问数据而选择的。 更确切地说，数据结构是数据值、数据间关系以及可用于数据的函数或操作的集合。 更确切地说，数据结构是数据值、数据间关系以及可用于数据的函数或操作的集合。

本页列出了一系列在 Tact 中实现的数据结构，方便您满足日常及其他需求。

这里列出的所有数据结构都是使用内置的 [`map<K, V>{:tact}`][map]类型制作的。  有关map的描述和基本用法，请参阅[本书专页][map]。

## 数组（array） {#array}

[数组](https://en.wikipedia.org/wiki/Array_(data_structure)) 是一种数据结构，由连续的内存块组成，代表相同内存大小的元素集合，每个元素至少由一个数组键或 _index_ 标识。

下面的示例使用[结构](/zh-cn/book/structs-and-messages#structs)包装的[`map<Int, V>{:tact}`][map]模拟数组，其中`V{:tact}`可以是 map 的任何[允许值类型](/zh-cn/book/maps#allowed-types)：

```tact
struct Array {
    m: map<Int as uint16, Int>; // array of Int values as a map of Ints to Ints,
                                // with serialization of its keys to uint16 to save space
    length: Int = 0;            // length of the array, defaults to 0
}

// Compile-time constant upper bound for our map representing an array.
const MaxArraySize: Int = 5_000; // 5,000 entries max, to stay reasonably far from limits

// Extension mutation function for adding new entries to the end of the array
extends mutates fun append(self: Array, item: Int) {
    require(self.length + 1 <= MaxArraySize, "No space in the array left for new items!");

    self.m.set(self.length, item); // set the entry (key-value pair)
    self.length += 1;              // increase the length field
}

// Extension mutation function for inserting new entries at the given index
extends mutates fun insert(self: Array, item: Int, idx: Int) {
    require(self.length + 1 <= MaxArraySize, "No space in the array left for new items!");
    require(idx >= 0, "Index of the item cannot be negative!");
    require(idx < self.length, "Index is out of array bounds!");

    // Move all items from idx to the right
    let i: Int = self.length; // not a typo, as we need to start from the non-existing place
    while (i > idx) {
        // Note, that we use !! operator as we know for sure that the value would be there
        self.m.set(i, self.m.get(i - 1)!!);
        i -= 1;
    }

    // And put the new item in
    self.m.set(idx, item); // set the entry (key-value pair)
    self.length += 1;      // increase the length field
}

// Extension function for getting the value at the given index
extends fun getIdx(self: Array, idx: Int): Int {
    require(self.length > 0, "No items in the array!");
    require(idx >= 0, "Index of the item cannot be negative!");
    require(idx < self.length, "Index is out of array bounds!");

    // Note, that we use !! operator as we know for sure that the value would be there
    return self.m.get(idx)!!;
}

// Extension function for returning the last value
extends fun getLast(self: Array): Int {
    require(self.length > 0, "No items in the array!");

    // Note, that we use !! operator as we know for sure that the value would be there
    return self.m.get(self.length - 1)!!;
}

// Extension mutation function for deleting and entry at the given index and returning its value
extends mutates fun deleteIdx(self: Array, idx: Int): Int {
    require(self.length > 0, "No items in the array to delete!");
    require(idx >= 0, "Index of the item cannot be negative!");
    require(idx < self.length, "Index is out of array bounds!");

    // Remember the value, which is going to be deleted
    let memorized: Int = self.m.get(idx)!!;

    // Move all items from idx and including to the left
    let i: Int = idx;
    while (i + 1 < self.length) {
        // Note, that we use !! operator as we know for sure that the value would be there
        self.m.set(i, self.m.get(i + 1)!!);
        i += 1;
    }

    self.m.set(self.length - 1, null); // delete the last entry
    self.length -= 1;                  // decrease the length field

    return memorized;
}

// Extension mutation function for deleting the last entry and returning its value
extends fun deleteLast(self: Array): Int {
    require(self.length > 0, "No items in the array!");

    // Note, that we use !! operator as we know for sure that the value would be there
    let lastItem: Int = self.m.get(self.length - 1)!!;
    self.m.set(self.length - 1, null); // delete the entry
    self.length -= 1;                  // decrease the length field

    return lastItem;
}

// Extension function for deleting all items in the Array
extends mutates fun deleteAll(self: Array) {
    self.m = emptyMap();
    self.length = 0;
}

// Global static function for creating an empty Array
fun emptyArray(): Array {
    return Array{m: emptyMap(), length: 0}; // length defaults to 0
}

// Contract, with emulating an Array using the map
contract MapAsArray {
    // Persistent state variables
    array: Array;

    // Constructor (initialization) function of the contract
    init() {
        self.array = emptyArray();
    }

    receive() { cashback(sender()) } // for the deployment

    // Internal message receiver, which responds to a String message "append"
    receive("append") {
        // Add a new item
        self.array.append(42);
    }

    // Internal message receiver, which responds to a String message "delete_5h"
    receive("delete_5th") {
        // Remove the 5th item if it exists and reply back with its value, or raise an error
        self.reply(self.array.deleteIdx(4).toCoinsString().asComment()); // index offset 0 + 4 gives the 5th item
    }

    // Internal message receiver, which responds to a String message "del_last"
    receive("del_last") {
        // Remove the last item and reply back with its value, or raise an error
        self.reply(self.array.deleteLast().toCoinsString().asComment());
    }

    // Internal message receiver, which responds to a String message "get_last"
    receive("get_last") {
        // Reply back with the latest item in the array if it exists, or raise an error
        self.reply(self.array.getLast().toCoinsString().asComment());
    }

    // Internal message receiver, which responds to a String message "delete_all"
    receive("delete_all") {
        self.array.deleteAll();
    }
}
```

## 堆栈(Stack) {#stack}

[堆栈](https://en.wikipedia.org/wiki/Stack_(abstract_data_type)) 是一种由元素集合组成的数据结构，主要有两种操作：

- push，将一个元素添加到集合的末尾
- pop，移除最近添加的元素

下面的示例使用[结构](/zh-cn/book/structs-and-messages#structs)包装的[`map<Int, V>{:tact}`][map]模拟堆栈，其中 `V{:tact}`可以是 map 的任何[允许值类型](/zh-cn/book/maps#allowed-types)：

```tact
struct Stack {
    m: map<Int as uint16, Int>; // stack of Int values as a map of Ints to Ints,
                                // with serialization of its keys to uint16 to save space
    length: Int = 0;            // length of the stack, defaults to 0
}

// Compile-time constant upper bound for our map representing an stack.
const MaxStackSize: Int = 5_000; // 5,000 entries max, to stay reasonably far from limits

// Extension mutation function for adding new entries to the end of the stack
extends mutates fun push(self: Stack, item: Int) {
    require(self.length + 1 <= MaxStackSize, "No space in the stack left for new items!");

    self.m.set(self.length, item); // set the entry (key-value pair)
    self.length += 1;              // increase the length field
}

// Extension mutation function for deleting the last entry and returning its value
extends mutates fun pop(self: Stack): Int {
    require(self.length > 0, "No items in the stack to delete!");

    // Note, that we use !! operator as we know for sure that the value would be there
    let lastItem: Int = self.m.get(self.length - 1)!!;
    self.m.set(self.length - 1, null); // delete the entry
    self.length -= 1;                  // decrease the length field

    return lastItem;
}

// Extension function for returning the last value
extends fun peek(self: Stack): Int {
    require(self.length > 0, "No items in the stack!");

    // Note, that we use !! operator as we know for sure that the value would be there
    return self.m.get(self.length - 1)!!;
}

// Extension function for deleting all items in the Stack
extends mutates fun deleteAll(self: Stack) {
    self.m = emptyMap();
    self.length = 0;
}

// Global static function for creating an empty Stack
fun emptyStack(): Stack {
    return Stack{m: emptyMap(), length: 0}; // length defaults to 0
}

contract MapAsStack {
    // Persistent state variables
    stack: Stack; // our stack, which uses the map

    // Constructor (initialization) function of the contract
    init() {
        self.stack = emptyStack();
    }

    receive() { cashback(sender()) } // for the deployment

    // Internal message receiver, which responds to a String message "push"
    receive("push") {
        // Add a new item
        self.stack.push(42);
    }

    // Internal message receiver, which responds to a String message "pop"
    receive("pop") {
        // Remove the last item and reply with it
        self.reply(self.stack.pop().toCoinsString().asComment());
    }

    // Internal message receiver, which responds to a String message "peek"
    receive("peek") {
        // Reply back with the latest item in the map if it exists, or raise an error
        self.reply(self.stack.peek().toCoinsString().asComment());
    }

    // Internal message receiver, which responds to a String message "delete_all"
    receive("delete_all") {
        self.stack.deleteAll();
    }

    // Getter function for obtaining the stack
    get fun stack(): map<Int as uint16, Int> {
        return self.stack.m;
    }

    // Getter function for obtaining the current length of the stack
    get fun length(): Int {
        return self.stack.length;
    }
}
```

## 循环缓冲区 (Circular buffer) {#circular-buffer}

[循环缓冲区](https://en.wikipedia.org/wiki/Circular_buffer)（循环队列、循环缓冲区或环形缓冲区）是一种数据结构，它使用单个固定大小的[缓冲区](https://en.wikipedia.org/wiki/Data_buffer)，就像端对端连接一样。

下面的示例使用包裹在 [Struct](/zh-cn/book/structs-and-messages#structs) 中的 [`map<Int, V>{:tact}`][map]模拟循环缓冲区，其中 `V{:tact}` 可以是 map 的任何 [允许值类型](/zh-cn/book/maps#allowed-types)：

```tact
struct CircularBuffer {
    m: map<Int as uint8, Int>; // circular buffer of Int values as a map of Ints to Ints,
                               // with serialization of its keys to uint8 to save space
    length: Int = 0;           // length of the circular buffer, defaults to 0
    start: Int = 0;            // current index into the circular buffer, defaults to 0
}

// Compile-time constant upper bound for our map representing a circular buffer.
const MaxCircularBufferSize: Int = 5;

// Extension mutation function for putting new items to the circular buffer
extends mutates fun put(self: CircularBuffer, item: Int) {
    if (self.length < MaxCircularBufferSize) {
        self.m.set(self.length, item); // store the item
        self.length += 1;              // increase the length field
    } else {
        self.m.set(self.start, item);                          // store the item, overriding previous entry
        self.start = (self.start + 1) % MaxCircularBufferSize; // update starting position
    }
}

// Extension mutation function for getting an item from the circular buffer
extends mutates fun getIdx(self: CircularBuffer, idx: Int): Int {
    require(self.length > 0, "No items in the circular buffer!");
    require(idx >= 0, "Index of the item cannot be negative!");

    if (self.length < MaxCircularBufferSize) {
        // Note, that we use !! operator as we know for sure that the value would be there
        return self.m.get(idx % self.length)!!;
    }

    // Return the value rotating around the circular buffer, also guaranteed to be there
    return self.m.get((self.start + idx) % MaxCircularBufferSize)!!;
}

// Extension function for iterating over all items in the circular buffer and dumping them to the console
extends fun printAll(self: CircularBuffer) {
    let i: Int = self.start;
    repeat (self.length) {
        dump(self.m.get(i)!!); // !! tells the compiler this can't be null
        i = (i + 1) % MaxCircularBufferSize;
    }
}

// Extension function for deleting all items in the CircularBuffer
extends mutates fun deleteAll(self: CircularBuffer) {
    self.m = emptyMap();
    self.length = 0;
    self.start = 0;
}

// Global static function for creating an empty CircularBuffer
fun emptyCircularBuffer(): CircularBuffer {
    return CircularBuffer{m: emptyMap(), length: 0, start: 0}; // length and start default to 0
}

// This contract records the last 5 timestamps of when "timer" message was received
contract MapAsCircularBuffer {
    // Persistent state variables
    cBuf: CircularBuffer; // our circular buffer, which uses a map

    // Constructor (initialization) function of the contract
    init() {
        self.cBuf = emptyCircularBuffer();
    }

    receive() { cashback(sender()) } // for the deployment

    // Internal message receiver, which responds to a String message "timer"
    // and records the timestamp when it receives such message
    receive("timer") {
        let timestamp: Int = now();
        self.cBuf.put(timestamp);
    }

    // Internal message receiver, which responds to a String message "get_first"
    // and replies with the first item of the circular buffer
    receive("get_first") {
        self.reply(self.cBuf.getIdx(0).toCoinsString().asComment());
    }

    // Internal message receiver, which responds to a String message "print_all"
    receive("print_all") {
        self.cBuf.printAll();
    }

    // Internal message receiver, which responds to a String message "delete_all"
    receive("delete_all") {
        self.cBuf.deleteAll();
    }
}
```

:::note

  本例改编自[Tact-By-Example 中的 Arrays 页面](https://tact-by-example.org/04-arrays)。

:::

:::tip[Hey there!]

  没有找到您最喜欢的使用数据结构的示例？  您有很酷的实施方案吗？ [欢迎投稿！](https://github.com/tact-lang/tact/issues)

:::

[map]: /zh-cn/book/maps



================================================
FILE: docs/src/content/docs/zh-cn/cookbook/dexes/dedust.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/cookbook/dexes/dedust.mdx
================================================
---
title: DeDust.io
description: "[DeDust](https://dedust.io)是基于[TON Blockchain](https://ton.org)和[DeDust Protocol 2.0](https://docs.dedust.io/reference/tlb-schemes)的去中心化交易所（DEX）和自动做市商（AMM）。 DeDust 的设计非常注重用户体验（UX）、 gas 效率和可扩展性。"
sidebar:
  order: 1
---

[DeDust](https://dedust.io)是基于[TON Blockchain](https://ton.org)和[DeDust Protocol 2.0](https://docs.dedust.io/reference/tlb-schemes)的去中心化交易所（DEX）和自动做市商（AMM）。 DeDust 的设计非常注重用户体验（UX）、 gas 效率和可扩展性。

在进一步介绍之前，请自己熟悉以下内容：

- [接收消息](/zh-cn/book/receive/)
- [发送消息](/zh-cn/book/send/)
- [可替代代币（Jettons）](/zh-cn/cookbook/jettons/)
- [DeDust Docs: Concepts](https://docs.dedust.io/docs/concepts)

## Swaps

阅读更多关于 [DeDust 文档](https://docs.dedust.io/docs/swaps)中的swaps。

:::caution

  确保部署合约非常重要。 向不活动的合约发送资金可能造成不可挽回的损失。

:::

所有类型的交换都使用 `SwapStep{:tact}` 和 `SwapParams{:tact}` 的结构：

```tact
/// https://docs.dedust.io/reference/tlb-schemes#swapstep
struct SwapStep {
    // The pool that will do the swapping, i.e. pairs like TON/USDT or USDT/DUST
    poolAddress: Address;

    // A kind of swap to make, can only be 0 as of now
    kind: Int as uint1 = 0;

    // Minimum output of the swap
    // If the actual value is less than specified, the swap will be rejected
    limit: Int as coins = 0;

    // Reference to the next step, which can be used for multi-hop swaps
    // The type here is actually `SwapStep?`,
    // but specifying recursive types isn't allowed in Tact yet
    nextStep: Cell?;
}

/// https://docs.dedust.io/reference/tlb-schemes#swapparams
struct SwapParams {
    // Specifies a deadline for the swap to reject the swap coming to the pool late
    // Accepts the number of seconds passed since the UNIX Epoch
    // Defaults to 0, which removes the deadline
    deadline: Int as uint32 = 0;

    // Specifies an address where funds will be sent after the swap
    // Defaults to `null`, which makes the swap use the sender's address
    recipientAddress: Address? = null;

    // Referral address, required for the referral program of DeDust
    // Defaults to `null`
    referralAddress: Address? = null;

    // Custom payload that will be attached to the fund transfer upon a successful swap
    // Defaults to `null`
    fulfillPayload: Cell? = null;

    // Custom payload that will be attached to the fund transfer upon a rejected swap
    // Defaults to `null`
    rejectPayload: Cell? = null;
}
```

### 将 Toncoin 兑换为任意 Jetton

:::note
以下指南使用了 [Jetton Vault](https://docs.dedust.io/docs/concepts#vault)。 要获取您的Jetton地址，请参阅[本指南](https://docs.dedust.io/docs/swaps#step-1-find-the-vault-scale)。
:::

```tact
/// https://docs.dedust.io/reference/tlb-schemes#message-swap
message(0xea06185d) NativeSwap {
    // Unique identifier used to trace transactions across multiple contracts
    // Defaults to 0, which means we don't mark messages to trace their chains
    queryId: Int as uint64 = 0;

    // Toncoin amount for the swap
    amount: Int as coins;

    // Inlined fields of SwapStep Struct
    poolAddress: Address;
    kind: Int as uint1 = 0;
    limit: Int as coins = 0;
    nextStep: SwapStep? = null;

    // Set of parameters relevant for the whole swap
    swapParams: SwapParams;
}

// Let's say `swapAmount` is `ton("0.1")`, which is 10000000 nanoToncoins
fun swapToncoinForUSDT(swapAmount: Int) {
    send(SendParameters {
        // Address of TON vault to send the message to
        to: address("EQDa4VOnTYlLvDJ0gZjNYm5PXfSmmtL6Vs6A_CZEtXCNICq_"),
        // Amount to swap plus a trade fee
        value: swapAmount + ton("0.2"),
        body: NativeSwap{
            amount: swapAmount,
            // Address of the swap pool, which is the TON/USDT pair in this case
            poolAddress: address("EQA-X_yo3fzzbDbJ_0bzFWKqtRuZFIRa1sJsveZJ1YpViO3r"),
            // Set of parameters relevant for the whole swap
            swapParams: SwapParams{}, // use defaults
        }.toCell(),
    });
}

//
// Helper Structs described earlier on this page
//

struct SwapStep {
    poolAddress: Address;
    kind: Int as uint1 = 0;
    limit: Int as coins = 0;
    nextStep: Cell?;
}

struct SwapParams {
    deadline: Int as uint32 = 0;
    recipientAddress: Address? = null;
    referralAddress: Address? = null;
    fulfillPayload: Cell? = null;
    rejectPayload: Cell? = null;
}
```

### 将一种 Jetton 交换为另一种 Jetton 或 Toncoin。

```tact
/// https://docs.dedust.io/reference/tlb-schemes#message-swap-1
message(0xe3a0d482) JettonSwapPayload {
    // Inlined fields of SwapStep Struct
    poolAddress: Address;
    kind: Int as uint1 = 0;
    limit: Int as coins = 0;
    nextStep: SwapStep? = null;

    // Set of parameters relevant for the whole swap
    swapParams: SwapParams;
}

/// NOTE: To calculate and provide Jetton wallet address for the target user,
///       make sure to check links after this code snippet
fun swapJetton(targetJettonWalletAddress: Address) {
    send(SendParameters {
        to: targetJettonWalletAddress,
        value: ton("0.3"),
        body: JettonTransfer{
            // Unique identifier used to trace transactions across multiple contracts
            // Set to 0, which means we don't mark messages to trace their chains
            queryId: 0,
            // Jetton amount for the swap
            amount: 10, // NOTE: change to yours
            // Address of the Jetton vault to the send message to
            destination: address("EQAYqo4u7VF0fa4DPAebk4g9lBytj2VFny7pzXR0trjtXQaO"),
            // Where to return the exceeding funds
            responseDestination: myAddress(),
            forwardTonAmount: ton("0.25"),
            forwardPayload: JettonSwapPayload{
                // Address of the swap pool, which is the TON/USDT pair in this case
                poolAddress: address("EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs"),
                // Set of parameters relevant for the whole swap
                swapParams: SwapParams{}, // use defaults
            }.toCell(),
        }.toCell(),
    });
}

//
// Helper Structs described earlier on this page
//

struct SwapStep {
    poolAddress: Address;
    kind: Int as uint1 = 0;
    limit: Int as coins = 0;
    nextStep: Cell?;
}

struct SwapParams {
    deadline: Int as uint32 = 0;
    recipientAddress: Address? = null;
    referralAddress: Address? = null;
    fulfillPayload: Cell? = null;
    rejectPayload: Cell? = null;
}

//
// Messages from the Jetton standard
//

message(0xf8a7ea5) JettonTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address;
    customPayload: Cell? = null;
    forwardTonAmount: Int as coins;
    forwardPayload: Cell?; // slightly adjusted
}
```

:::note[Useful links:]

  [在 TON Docs检索](https://docs.ton.org/develop/dapps/asset-processing/jettons#retaining-jetton-wallet-addresses-for-a-ginde-user).\
  [如何计算用户的 Jetton 钱包地址 (offline)?](https://docs.ton.org/v3/guidelines/dapps/cookbook#how to calyse-users-jetton-wallet-addresss-offline)

:::

## 流动资金

为了向特定的DeDust池提供流动资金，您必须提供这两种资产。 然后，池将向存款人地址颁发特别 _LP tokens_。

阅读更多关于[DeDust文档](https://docs.dedust.io/docs/liquidity-provisioning)中的流动资金配置。

```tact
import "@stdlib/deploy";

/// https://docs.dedust.io/reference/tlb-schemes#message-deposit_liquidity-1
message(0x40e108d6) JettonDepositLiquidity {
    // Pool type: 0 for volatile, 1 for stable
    // Volatile pool is based on the "Constant Product" formula
    // Stable-swap pool is optimized for assets of near-equal value,
    // e.g. USDT/USDC, TON/stTON, etc.
    poolType: Int as uint1;

    // Provided assets
    asset0: Asset;
    asset1: Asset;

    // Minimal amount of LP tokens to be received
    // If there's less liquidity provided, the provisioning will be rejected
    // Defaults to 0, makes this value ignored
    minimalLpAmount: Int as coins = 0;

    // Target amount of the first asset
    targetBalances0: Int as coins;

    // Target amount of the second asset
    targetBalances1: Int as coins;

    // Custom payload attached to the transaction if the provisioning is successful
    // Defaults to `null`, which means no payload
    fulfillPayload: Cell? = null;

    // Custom payload attached to the transaction if the provisioning is rejected
    // Defaults to `null`, which means no payload
    rejectPayload: Cell? = null;
}

/// https://docs.dedust.io/reference/tlb-schemes#message-deposit_liquidity
message(0xd55e4686) NativeDepositLiquidity {
    // Unique identifier used to trace transactions across multiple contracts
    // Defaults to 0, which means we don't mark messages to trace their chains
    queryId: Int as uint64 = 0;

    // Toncoin amount for the deposit
    amount: Int as coins;

    // Inlined fields of JettonDepositLiquidity Message without the opcode prefix
    poolType: Int as uint1;
    asset0: Asset;
    asset1: Asset;
    minimalLpAmount: Int as coins = 0;
    targetBalances0: Int as coins;
    targetBalances1: Int as coins;
    fulfillPayload: Cell? = null;
    rejectPayload: Cell? = null;
}

/// https://docs.dedust.io/reference/tlb-schemes#asset
struct Asset {
    // Specify 0 for native (TON) and omit all following fields
    // Specify 1 for Jetton and then you must set non-null values for the following fields
    type: Int as uint4;

    workchain: Int as uint8 = 0; // Both this zeroes will be removed during .build() function. Only type will remain.
    address: Int as uint256 = 0;
}

const PoolTypeVolatile: Int = 0;
const PoolTypeStable: Int = 1;

const AssetTypeNative: Int = 0b0000;
const AssetTypeJetton: Int = 0b0001;

const JettonProvideLpGas: Int = ton("0.5");
const JettonProvideLpGasFwd: Int = ton("0.4");
const TonProvideLpGas: Int = ton("0.15");

// This example directly uses the provided `myJettonWalletAddress`
// In real-world scenarios, it's more reliable to calculate this address on-chain or save it during initialization to prevent any issues
fun provideLiquidity(myJettonWalletAddress: Address) {
    let jettonMasterRaw = parseStdAddress(
        address("EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs")
        .asSlice()
    );

    // Step 1. Prepare input
    let jettonAmount = ton("1");
    let tonAmount = ton("1");

    let asset0 = Asset{
        type: AssetTypeNative,
    };
    let asset1 = Asset{
        type: AssetTypeJetton,
        workchain: jettonMasterRaw.workchain,
        address: jettonMasterRaw.address,
    };

    // Step 2. Deposit Jetton to Vault
    let jettonDepositBody = JettonDepositLiquidity{
        poolType: PoolTypeVolatile,
        asset0,
        asset1,
        targetBalances0: tonAmount,
        targetBalances1: jettonAmount,
    }.build(); // notice the .build() and not .toCell(),
               // since we want some custom serialization logic!

    send(SendParameters {
        to: myJettonWalletAddress,
        value: JettonProvideLpGas,
        body: JettonTransfer{
            queryId: 42,
            amount: jettonAmount,
            // Jetton Vault
            destination: address("EQAYqo4u7VF0fa4DPAebk4g9lBytj2VFny7pzXR0trjtXQaO"),
            responseDestination: myAddress(),
            forwardTonAmount: JettonProvideLpGasFwd,
            forwardPayload: jettonDepositBody,
        }.toCell()
    });

    // Step 3. Deposit TON to Vault
    let nativeDepositBody = NativeDepositLiquidity{
        queryId: 42,
        amount: tonAmount,
        poolType: PoolTypeVolatile,
        asset0,
        asset1,
        targetBalances0: tonAmount,
        targetBalances1: jettonAmount,
    }.build(); // notice the .build() and not .toCell(),
               // since we want some custom serialization logic!

    send(SendParameters {
        to: address("EQDa4VOnTYlLvDJ0gZjNYm5PXfSmmtL6Vs6A_CZEtXCNICq_"),
        value: tonAmount + TonProvideLpGas,
        body: nativeDepositBody,
    });
}

//
// Helper extension functions to build respective Structs and Messages
//

extends fun build(self: Asset): Cell {
    let assetBuilder = beginCell()
        .storeUint(self.type, 4);

    if (self.type == AssetTypeNative) {
        return assetBuilder.endCell();
    }

    if (self.type == AssetTypeJetton) {
        return assetBuilder
            .storeUint(self.workchain, 8)
            .storeUint(self.address, 256)
            .endCell();
    }

    // Unknown asset type
    return beginCell().endCell();
}

extends fun build(self: JettonDepositLiquidity): Cell {
    return beginCell()
        .storeUint(0x40e108d6, 32)
        .storeUint(self.poolType, 1)
        .storeSlice(self.asset0.build().asSlice())
        .storeSlice(self.asset1.build().asSlice())
        .storeCoins(self.minimalLpAmount)
        .storeCoins(self.targetBalances0)
        .storeCoins(self.targetBalances1)
        .storeMaybeRef(self.fulfillPayload)
        .storeMaybeRef(self.rejectPayload)
        .endCell();
}

extends fun build(self: NativeDepositLiquidity): Cell {
    return beginCell()
        .storeUint(0xd55e4686, 32)
        .storeUint(self.queryId, 64)
        .storeCoins(self.amount)
        .storeUint(self.poolType, 1)
        .storeSlice(self.asset0.build().asSlice())
        .storeSlice(self.asset1.build().asSlice())
        .storeRef(
            beginCell()
                .storeCoins(self.minimalLpAmount)
                .storeCoins(self.targetBalances0)
                .storeCoins(self.targetBalances1)
                .endCell()
        )
        .storeMaybeRef(self.fulfillPayload)
        .storeMaybeRef(self.rejectPayload)
        .endCell();
}

//
// Messages from the Jetton standard
//

message(0xf8a7ea5) JettonTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address?;
    customPayload: Cell? = null;
    forwardTonAmount: Int as coins;
    forwardPayload: Cell?; // slightly adjusted
}
```

### 提取流动资金

要提取流动性，需要销毁的 LP 代币。 您可以参考 [Jettons Cookbook 页面中有关 Jetton 销毁的相关部分](/zh-cn/cookbook/jettons#burning-jetton) 的示例。 然而，应该添加比正常销毁更多的 Toncoin，因为如果添加的 Toncoin 太少，可能会导致 LP 代币被销毁，但不会从池中发送任何（或仅部分）流动性。 因此，请考虑至少附上 $0.5$ Toncoin - 超额部分将予以退还。

:::tip[Hey there!]

没有找到您最喜欢的 Dedust 交互的例子？ 您有很酷的实施方案吗？ [欢迎贡献！](https://github.com/tact-lang/tact/issues)

:::



================================================
FILE: docs/src/content/docs/zh-cn/cookbook/dexes/stonfi.mdx
URL: https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/zh-cn/cookbook/dexes/stonfi.mdx
================================================
---
title: STON.fi
description: 这个页面列出了与STON.fi合作的示例，这是一个基于TON Blockchain 的分散自动化市场制造商。
sidebar:
  order: 2
---

[STON.fi](https://ston.fi)是一个建立在[TON 区块链](https://ton.org)上的去中心化自动做市商（AMM），提供几乎零费用、低滑点、极其简单的界面以及与 TON 钱包的直接集成。

:::caution

  此页面上的示例使用了STON.fi的 API v2, 目前正在开发中。 因此，所有地址都在 [testnet][testnet] 中。

  慎重行事——不试图将资金从主网送到测试网，反之亦然。

:::

在进一步介绍之前，请自己熟悉以下内容：

- [接收消息](/zh-cn/book/receive/)
- [发送消息](/zh-cn/book/send/)
- [可替代代币（Jettons）](/zh-cn/cookbook/jettons/)
- [STONFi 文档：术语表](https://docs.ston.fi/docs/user-section/glossary)
- [STON.fi文档：架构](https://docs.ston.fi/docs/developer-section/architecture)

## Swaps

在 [STON.fi 文档](https://docs.ston.fi/docs/developer-section/api-reference-v2/example_swap)中阅读更多关于 Swaps 的信息。

Swaps使用 `StonfiSwap{:tact}` [Message][message] 和 `SwapAdditionalData{:tact}` [Struct][struct]

```tact
/// https://docs.ston.fi/docs/developer-section/api-reference-v2/router#swap-0x6664de2a
message(0x6664de2a) StonfiSwap {
    // Address of the other Router token wallet
    otherTokenWallet: Address;

    // Where to send refunds upon a failed swap
    refundAddress: Address;

    // Where to send excesses upon a successful swap
    excessesAddress: Address;

    // UNIX timestamp of execution deadline for the swap
    deadline: Int as uint64;

    // Reference to another Cell with additional data,
    // using the Tact's greedy auto-layout mechanism
    additionalData: SwapAdditionalData;
}

/// https://docs.ston.fi/docs/developer-section/api-reference-v2/router#additional_data-body
struct SwapAdditionalData {
    // Minimum required amount of tokens to receive
    // Defaults to 1, which causes the swap to fail
    //                only if no tokens are received
    minOut: Int as coins = 1;

    // Where to send tokens upon a successful swap
    receiverAddress: Address;

    // Forward fees for the `customPayload` if it's not `null`
    // Defaults to 0
    fwdGas: Int as coins = 0;

    // Custom payload that will be sent upon a successful swap
    // Defaults to `null`, which means no payload
    customPayload: Cell? = null;

    // Forward fees for `refundPayload` if it's not `null`
    // Defaults to 0
    refundFwdGas: Int as coins = 0;

    // Custom payload that will be sent upon a failed swap
    // Defaults to `null`, which means no payload
    refundPayload: Cell? = null;

    // Referral fee, between 0 (no fee) and 100 (1%)
    // Defaults to 10, which means 0.1% fee
    refFee: Int as uint16 = 10;

    // Address of the referral
    // Defaults to `null`
    referralAddress: Address? = null;
}
```

[STON.fi SDK](https://github.com/ston-fi/sdk) 定义了一些[常量用于处理费用](https://github.com/ston-fi/sdk/blob/1c8c6678858956f6d9a0e70b9f80628319dbe2ce/packages/sdk/src/contracts/dex/v2_1/router/BaseRouterV2_1.ts)。 请注意这些是硬编码值，但最佳做法是[用当前配置参数动态计算费用](https://docs.ton.org/v3/guidelines/smart-contracts/fee-calculation)

```tact
/// Hardcoded fee value to pay for sending a message to the Jetton wallet
const FeeSwapJettonToJetton: Int = ton("0.3");
/// Hardcoded fee value to pay forward fees from the Jetton wallet
const FeeSwapJettonToJettonFwd: Int = ton("0.24");

/// Hardcoded fee value to pay for sending a message to the Jetton wallet
const FeeSwapJettonToToncoin: Int = ton("0.3");
/// Hardcoded fee value to pay for sending a message to the Jetton wallet
const FeeSwapJettonToToncoinFwd: Int = ton("0.24");

/// Hardcoded fee value to pay for sending a message and subsequent forwarding
const FeeSwapToncoinToJetton: Int = ton("0.01") + ton("0.3");
```

:::note[Useful links:]

  [TON 文档中的费用计算][fees-calc]

:::

### Jetton to Jetton {#swaps-jetton-to-jetton}

:::caution

  下面的示例使用了STON.fi的 API v2, 目前正在开发中。 因此，所有地址都在 [testnet][testnet] 中。

  此外，有些变量，如`offerAmount`，为了演示目的而硬编码。 别忘了在真实生活的场景中更改它们。

:::

```tact
// CPI Router v2.1.0
const RouterAddress: Address =
    address("kQALh-JBBIKK7gr0o4AVf9JZnEsFndqO0qTCyT-D-yBsWk0v");

// Router Jetton Wallet address
const RouterJettonWallet: Address =
    address("kQAtX3x2s-wMtYTz8CfmAyloHAB73vONzJM5S2idqXl-_5xK");

/// NOTE: To calculate and provide Jetton wallet address for the target user,
///       make sure to check links after this code snippet
fun jettonToJetton(myJettonWalletAddress: Address) {
    // Amount of Jettons to swap
    let offerAmount: Int = 100_000;

    // Prepare the payload
    let forwardPayload = StonfiSwap{
        otherTokenWallet: RouterJettonWallet,
        refundAddress: myAddress(),
        excessesAddress: myAddress(),
        // Deadline is set to 10,000 seconds from now
        deadline: now() + 10_000,
        additionalData: SwapAdditionalData{ receiverAddress: myAddress() },
    };

    // Start a swap with the message to the Jetton wallet
    send(SendParameters {
        to: myJettonWalletAddress,
        value: FeeSwapJettonToJetton,
        body: JettonTransfer{
            queryId: 42,
            amount: offerAmount,
            destination: RouterAddress,
            responseDestination: myAddress(),
            forwardTonAmount: FeeSwapJettonToJettonFwd,
            forwardPayload: forwardPayload.toCell(),
        }.toCell(),
    });
}

//
// Helper Messages, Structs and constants described earlier on this page
//

message(0x6664de2a) StonfiSwap {
    otherTokenWallet: Address;
    refundAddress: Address;
    excessesAddress: Address;
    deadline: Int as uint64;
    additionalData: SwapAdditionalData;
}

struct SwapAdditionalData {
    minOut: Int as coins = 1;
    receiverAddress: Address;
    fwdGas: Int as coins = 0;
    customPayload: Cell? = null;
    refundFwdGas: Int as coins = 0;
    refundPayload: Cell? = null;
    refFee: Int as uint16 = 10;
    referralAddress: Address? = null;
}

const FeeSwapJettonToJetton: Int = ton("0.3");
const FeeSwapJettonToJettonFwd: Int = ton("0.24");

//
// Messages from the Jetton standard
//

message(0xf8a7ea5) JettonTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address?;
    customPayload: Cell? = null;
    forwardTonAmount: Int as coins;
    forwardPayload: Cell?; // slightly adjusted
}
```

:::note[Useful links:]

  [在 TON 文档中检索 Jetton 钱包地址][jetton-addr-online]\
  [如何计算用户的 Jetton 钱包地址（离线）?][jetton-addr-offline]\
  [可发现的 Jetton 钱包][discoverable-jetton-wallets]\
  [TON 文档中的费用计算][fees-calc]

:::

### Jetton to Toncoin {#swaps-jetton-to-toncoin}

Jetton to Toncoin swap与[Jetton to Jetton swap](#swaps-jetton-to-jetton) 非常相似，唯一不同的是，`RouterJettonWallet{:tact}`地址被替换为 `RouterProxyTonWallet{:tact} ` 。

:::caution

  下面的示例使用了STON.fi的 API v2, 目前正在开发中。 因此，所有地址都在 [testnet][testnet] 中。

  此外，有些变量，如`offerAmount`，为了演示目的而硬编码。 别忘了在真实生活的场景中更改它们。

:::

```tact
// CPI Router v2.1.0
const RouterAddress: Address =
    address("kQALh-JBBIKK7gr0o4AVf9JZnEsFndqO0qTCyT-D-yBsWk0v");

// Router's pTON address
const RouterProxyTonWallet: Address =
    address("kQBbJjnahBMGbMUJwhAXLn8BiigcGXMJhSC0l7DBhdYABhG7");

/// NOTE: To calculate and provide Jetton wallet address for the target user,
///       make sure to check links after this code snippet
fun jettonToToncoin(myJettonWalletAddress: Address) {
    // Amount of Jettons to swap
    let offerAmount: Int = 100_000;

    // Prepare the payload
    let forwardPayload = StonfiSwap{
        otherTokenWallet: RouterProxyTonWallet,
        refundAddress: myAddress(),
        excessesAddress: myAddress(),
        // Deadline is set to 10,000 seconds from now
        deadline: now() + 10_000,
        additionalData: SwapAdditionalData{ receiverAddress: myAddress() },
    };

    // Start a swap with the message to the Jetton wallet
    send(SendParameters {
        to: myJettonWalletAddress,
        value: FeeSwapJettonToToncoin,
        body: JettonTransfer{
            queryId: 42,
            amount: offerAmount,
            destination: RouterAddress,
            responseDestination: myAddress(),
            forwardTonAmount: FeeSwapJettonToToncoinFwd,
            forwardPayload: forwardPayload.toCell(),
        }.toCell(),
    });
}

//
// Helper Messages, Structs and constants described earlier on this page
//

message(0x6664de2a) StonfiSwap {
    otherTokenWallet: Address;
    refundAddress: Address;
    excessesAddress: Address;
    deadline: Int as uint64;
    additionalData: SwapAdditionalData;
}

struct SwapAdditionalData {
    minOut: Int as coins = 1;
    receiverAddress: Address;
    fwdGas: Int as coins = 0;
    customPayload: Cell? = null;
    refundFwdGas: Int as coins = 0;
    refundPayload: Cell? = null;
    refFee: Int as uint16 = 10;
    referralAddress: Address? = null;
}

const FeeSwapJettonToToncoin: Int = ton("0.3");
const FeeSwapJettonToToncoinFwd: Int = ton("0.24");

//
// Messages from the Jetton standard
//

message(0xf8a7ea5) JettonTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address?;
    customPayload: Cell? = null;
    forwardTonAmount: Int as coins;
    forwardPayload: Cell?; // slightly adjusted
}
```

:::note[Useful links:]

  [在 TON 文档中检索 Jetton 钱包地址][jetton-addr-online]\
  [如何计算用户的 Jetton 钱包地址（离线）?][jetton-addr-offline]\
  [可发现的 Jetton 钱包][discoverable-jetton-wallets]\
  [TON 文档中的费用计算][fees-calc]

:::

### Toncoin 交换至 Jetton {#swaps-jetton-to-toncoin}

要将 Toncoin 兑换为 Jetton，STON.fi 需要使用一种被称为代理 Toncoin 钱包（简称 pTON）的工具。 要与它进行适当的互动，我们需要引入一个 `ProxyToncoinTransfer{:tact}` [Message][message]

```tact
/// https://github.com/ston-fi/sdk/blob/786ece758794bd5c575db8b38f5e5de19f43f0d1/packages/sdk/src/contracts/pTON/v2_1/PtonV2_1.ts
message(0x01f3835d) ProxyToncoinTransfer {
    // Unique identifier used to trace transactions across multiple contracts
    // Defaults to 0, which means we don't mark messages to trace their chains
    queryId: Int as uint64 = 0;

    // Toncoin amount for the swap
    tonAmount: Int as coins;

    // Where to send refunds upon a failed swap
    refundAddress: Address;

    // Optional custom payload to attach to the swap
    // Defaults to `null`
    forwardPayload: Cell?;
}
```

请注意，`ProxyToncoinTransfer{:tact}`与`JettonTransfer{:tact}`相似， 但不要求除退款地址以外的任何地址，也不要求指定任何预付金额。

:::caution

  下面的示例使用了STON.fi的 API v2, 目前正在开发中。 因此，所有地址都在 [testnet][testnet] 中。

  此外，有些变量，如`offerAmount`，为了演示目的而硬编码。 别忘了在真实生活的场景中更改它们。

:::

```tact
// Router's pTON wallet address
const RouterProxyTonWallet: Address
    = address("kQBbJjnahBMGbMUJwhAXLn8BiigcGXMJhSC0l7DBhdYABhG7");

// Router's Jetton wallet address
const RouterJettonWallet: Address =
    address("kQAtX3x2s-wMtYTz8CfmAyloHAB73vONzJM5S2idqXl-_5xK");

fun toncoinToJetton() {
    // Amount of Toncoin to swap
    let offerAmount: Int = 1_000;

    // Prepare the payload
    let forwardPayload = StonfiSwap{
        otherTokenWallet: RouterJettonWallet,
        refundAddress: myAddress(),
        excessesAddress: myAddress(),
        // Deadline is set to 10,000 seconds from now
        deadline: now() + 10_000,
        additionalData: SwapAdditionalData{ receiverAddress: myAddress() },
    };

    // Start a swap with the message to the proxy Toncoin wallet
    send(SendParameters {
        to: RouterProxyTonWallet,
        value: FeeSwapToncoinToJetton + offerAmount,
        body: ProxyToncoinTransfer{
            tonAmount: offerAmount,
            refundAddress: myAddress(),
            forwardPayload: forwardPayload.toCell(),
        }.toCell(),
    });
}

//
// Helper Messages, Structs and constants described earlier on this page
//

message(0x01f3835d) ProxyToncoinTransfer {
    queryId: Int as uint64 = 0;
    tonAmount: Int as coins;
    refundAddress: Address;
    forwardPayload: Cell?;
}

message(0x6664de2a) StonfiSwap {
    otherTokenWallet: Address;
    refundAddress: Address;
    excessesAddress: Address;
    deadline: Int as uint64;
    additionalData: SwapAdditionalData;
}

struct SwapAdditionalData {
    minOut: Int as coins = 1;
    receiverAddress: Address;
    fwdGas: Int as coins = 0;
    customPayload: Cell? = null;
    refundFwdGas: Int as coins = 0;
    refundPayload: Cell? = null;
    refFee: Int as uint16 = 10;
    referralAddress: Address? = null;
}

const FeeSwapToncoinToJetton: Int = ton("0.3");
```

:::note[Useful links:]

  [TON 文档中的费用计算][fees-calc]

:::

## 流动资金

阅读更多关于[STON.fi documentation](https://docs.ston.fi/docs/developer-section/api-reference-v2/example_lp_provide)中流动资金条款的信息。

STON.fi 允许您只指定一种代币来存入流动性--池将自动执行交换并铸造流动性提供者（LP）代币。 要做到这一点，您需要将 `ProvideLiquidity{:tact}` [Message][message] 的 `bothPositive` 字段设置为 `false{:tact}`。

流动性存款使用 `ProvideLiquidity{:tact}` [Message][message] 和 `ProvideLiquidityAdditionalData{:tact}` [Struct][struct]

```tact
/// https://docs.ston.fi/docs/developer-section/api-reference-v2/router#provide_lp-0x37c096df
message(0x37c096df) ProvideLiquidity {
    // Address of the other Router token wallet
    otherTokenWallet: Address;

    // Where to send refunds if provisioning fails
    refundAddress: Address;

    // Where to send excesses if provisioning succeeds
    excessesAddress: Address;

    // UNIX timestamp of execution deadline for the provisioning
    deadline: Int as uint64;

    // Reference to another Cell with additional data,
    // using the Tact's greedy auto-layout mechanism
    additionalData: ProvideLiquidityAdditionalData;
}

/// https://docs.ston.fi/docs/developer-section/api-reference-v2/router#additional_data-body-1
struct ProvideLiquidityAdditionalData {
    // Minimum required amount of LP tokens to receive
    // Defaults to 1, which causes the provisioning to fail
    //                only if no tokens are received
    minLpOut: Int as coins = 1;

    // Where to send LP tokens if provisioning succeeds
    receiverAddress: Address;

    // Should both tokens in a pair have a positive quantity?
    // If not, then the pool would perform an additional swap for the lacking token
    // Defaults to `true`, which means that deposit would only go through
    //                     when both token amounts are non-zero
    bothPositive: Bool = true;

    // Forward fees for the `customPayload` if it's not `null`
    // Defaults to 0
    fwdGas: Int as coins = 0;

    // Custom payload that will be sent if provisioning succeeds
    // Defaults to `null`, which means no payload
    customPayload: Cell? = null;
}
```

[STON.fi SDK](https://github.com/ston-fi/sdk) 定义了一些[常量用于处理费用](https://github.com/ston-fi/sdk/blob/786ece758794bd5c575db8b38f5e5de19f43f0d1/packages/sdk/src/contracts/dex/v2_1/router/BaseRouterV2_1.ts)。 请注意这些是硬编码值，但最佳做法是[用当前配置参数动态计算费用](https://docs.ton.org/v3/guidelines/smart-contracts/fee-calculation)

```tact
/// Hardcoded fee value to pay for sending a liquidity provisioning message
/// when depositing a certain amount of Jettons
const FeeSingleSideProvideLpJetton: Int = ton("1");

/// Hardcoded fee value to pay forward fees of subsequent messages for liquidity provisioning
const FeeSingleSideProvideLpJettonFwd: Int = ton("0.8");

/// Hardcoded fee value to pay for sending a liquidity provisioning message
/// when depositing a certain amount of Toncoins
const FeeSingleSideProvideLpToncoin: Int = ton("0.01") + ton("0.8");
```

:::note[Useful links:]

  [TON 文档中的费用计算][fees-calc]

:::

### 存入 Jetton

:::caution

  下面的示例使用了STON.fi的 API v2, 目前正在开发中。 因此，所有地址都在 [testnet][testnet] 中。

  此外，有些变量，如`offerAmount`，为了演示目的而硬编码。 别忘了在真实生活的场景中更改它们。

:::

```tact
// CPI Router v2.1.0
const RouterAddress: Address =
    address("kQALh-JBBIKK7gr0o4AVf9JZnEsFndqO0qTCyT-D-yBsWk0v");

// Router's pTON wallet address
const RouterProxyTonWallet: Address =
    address("kQBbJjnahBMGbMUJwhAXLn8BiigcGXMJhSC0l7DBhdYABhG7");

// Router's Jetton wallet address
const RouterJettonWallet: Address =
    address("kQAtX3x2s-wMtYTz8CfmAyloHAB73vONzJM5S2idqXl-_5xK");

/// NOTE: To calculate and provide Jetton wallet address for the target user,
///       make sure to check links after this code snippet
fun jettonDeposit(myJettonWalletAddress: Address) {
    // Amount of Jettons for liquidity provisioning
    let offerAmount = 100_000;

    // Prepare the payload
    let forwardPayload = ProvideLiquidity{
        otherTokenWallet: RouterProxyTonWallet,
        refundAddress: myAddress(),
        excessesAddress: myAddress(),
        // Deadline is set to 1,000 seconds from now
        deadline: now() + 1_000,
        additionalData: ProvideLiquidityAdditionalData{
            receiverAddress: myAddress(),
            bothPositive: false, // i.e. single side
        },
    };

    send(SendParameters {
        to: myJettonWalletAddress,
        value: FeeSingleSideProvideLpJetton,
        body: JettonTransfer{
            queryId: 42,
            amount: offerAmount,
            destination: RouterAddress,
            responseDestination: myAddress(),
            forwardTonAmount: FeeSingleSideProvideLpJettonFwd,
            forwardPayload: forwardPayload.toCell(),
        }.toCell(),
    });
}

//
// Helper Messages, Structs and constants described earlier on this page
//

message(0x37c096df) ProvideLiquidity {
    otherTokenWallet: Address;
    refundAddress: Address;
    excessesAddress: Address;
    deadline: Int as uint64;
    additionalData: ProvideLiquidityAdditionalData;
}

struct ProvideLiquidityAdditionalData {
    minLpOut: Int as coins = 1;
    receiverAddress: Address;
    bothPositive: Bool = true;
    fwdGas: Int as coins = 0;
    customPayload: Cell? = null;
}

const FeeSingleSideProvideLpJetton: Int = ton("1");
const FeeSingleSideProvideLpJettonFwd: Int = ton("0.8");

//
// Messages from the Jetton standard
//

message(0xf8a7ea5) JettonTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address?;
    customPayload: Cell? = null;
    forwardTonAmount: Int as coins;
    forwardPayload: Cell?; // slightly adjusted
}
```

### 存入 Toncoin

:::caution

  下面的示例使用了STON.fi的 API v2, 目前正在开发中。 因此，所有地址都在 [testnet][testnet] 中。

  此外，有些变量，如`offerAmount`，为了演示目的而硬编码。 别忘了在真实生活的场景中更改它们。

:::

```tact
// Router's pTON wallet address
const RouterProxyTonWallet: Address =
    address("kQBbJjnahBMGbMUJwhAXLn8BiigcGXMJhSC0l7DBhdYABhG7");

// Router's Jetton wallet address
const RouterJettonWallet: Address =
    address("kQAtX3x2s-wMtYTz8CfmAyloHAB73vONzJM5S2idqXl-_5xK");

fun toncoinDeposit() {
    // Amount of Jettons for liquidity provisioning
    let offerAmount = 100_000;

    // Prepare the payload
    let forwardPayload = ProvideLiquidity{
        otherTokenWallet: RouterJettonWallet,
        refundAddress: myAddress(),
        excessesAddress: myAddress(),
        deadline: now() + 1000,
        additionalData: ProvideLiquidityAdditionalData{
            receiverAddress: myAddress(),
            bothPositive: false, // i.e. single side
        },
    };

    send(SendParameters {
        to: RouterProxyTonWallet,
        value: FeeSingleSideProvideLpToncoin + offerAmount,
        body: ProxyToncoinTransfer{
            queryId: 42,
            tonAmount: offerAmount,
            refundAddress: myAddress(),
            forwardPayload: forwardPayload.toCell(),
        }.toCell(),
    });
}

//
// Helper Messages, Structs and constants described earlier on this page
//

message(0x01f3835d) ProxyToncoinTransfer {
    queryId: Int as uint64 = 0;
    tonAmount: Int as coins;
    refundAddress: Address;
    forwardPayload: Cell?;
}

message(0x37c096df) ProvideLiquidity {
    otherTokenWallet: Address;
    refundAddress: Address;
    excessesAddress: Address;
    deadline: Int as uint64;
    additionalData: ProvideLiquidityAdditionalData;
}

struct ProvideLiquidityAdditionalData {
    minLpOut: Int as coins = 1;
    receiverAddress: Address;
    bothPositive: Bool = true;
    fwdGas: Int as coins = 0;
    customPayload: Cell? = null;
}

const FeeSingleSideProvideLpToncoin: Int = ton("0.01") + ton("0.8");
```

### 提取流动资金

要提取流动性，需要燃烧的 LP 代币。 您可以参考 [Jettons Cookbook 页面中有关 Jetton 销毁的相关部分](/zh-cn/cookbook/jettons#burning-jetton) 的示例。 然而，应该添加比正常销毁更多的 Toncoin，因为如果添加的 Toncoin 太少，可能会导致 LP 代币被销毁，但不会从池中发送任何（或仅部分）流动性。 因此，请考虑至少附上 $0.5$ Toncoin - 超额部分将予以退还。

:::tip[Hey there!]

找不到您最喜欢的 STON.fi 交互的例子吗？ 您有很酷的实施方案吗？ [欢迎贡献！](https://github.com/tact-lang/tact/issues)

:::

[struct]: /zh-cn/book/structs-and-messages#structs
[message]: /zh-cn/book/structs-and-messages#messages
[testnet]: https://docs.ton.org/v3/documentation/smart-contracts/getting-started/testnet