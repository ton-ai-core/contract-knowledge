# Telegram Open Network Virtual Machine

### Nikolai Durov

### March 23, 2020

```
Abstract
The aim of this text is to provide a description of the Telegram
Open Network Virtual Machine (TON VM or TVM), used to execute
smart contracts in the TON Blockchain.
```
## Introduction

The primary purpose of the Telegram Open Network Virtual Machine (TON
VM or TVM) is to execute smart-contract code in the TON Blockchain.
TVM must support all operations required to parse incoming messages and
persistent data, and to create new messages and modify persistent data.
Additionally, TVM must meet the following requirements:

- It must provide for possible future extensions and improvements while
    retaining backward compatibility and interoperability, because the code
    of a smart contract, once committed into the blockchain, must continue
    working in a predictable manner regardless of any future modifications
    to the VM.
- It must strive to attain high “(virtual) machine code” density, so that
    the code of a typical smart contract occupies as little persistent block-
    chain storage as possible.
- It must be completely deterministic. In other words, each run of the
    same code with the same input data must produce the same result,


```
Introduction
```
```
regardless of specific software and hardware used.^1
```
The design of TVM is guided by these requirements. While this document
describes a preliminary and experimental version of TVM,^2 the backward
compatibility mechanisms built into the system allow us to be relatively
unconcerned with the efficiency of the operation encoding used for TVM
code in this preliminary version.
TVM is not intended to be implemented in hardware (e.g., in a specialized
microprocessor chip); rather, it should be implemented in software running
on conventional hardware. This consideration lets us incorporate some high-
level concepts and operations in TVM that would require convoluted mi-
crocode in a hardware implementation but pose no significant problems for a
software implementation. Such operations are useful for achieving high code
density and minimizing the byte (or storage cell) profile of smart-contract
code when deployed in the TON Blockchain.

(^1) For example, there are no floating-point arithmetic operations (which could be effi-
ciently implemented using hardware-supporteddoubletype on most modern CPUs) present
in TVM, because the result of performing such operations is dependent on the specific un-
derlying hardware implementation and rounding mode settings. Instead, TVM supports
special integer arithmetic operations, which can be used to simulate fixed-point arithmetic
if needed.
(^2) The production version will likely require some tweaks and modifications prior to
launch, which will become apparent only after using the experimental version in the test
environment for some time.


## Introduction


- 1 Overview Contents
   - 1.0 Notation for bitstrings
   - 1.1 TVM is a stack machine
   - 1.2 Categories of TVM instructions
   - 1.3 Control registers
   - 1.4 Total state of TVM (SCCCG)
   - 1.5 Integer arithmetic
- 2 The stack
   - 2.1 Stack calling conventions
   - 2.2 Stack manipulation primitives
   - 2.3 Efficiency of stack manipulation primitives
- 3 Cells, memory, and persistent storage
   - 3.1 Generalities on cells
   - 3.2 Data manipulation instructions and cells
   - 3.3 Hashmaps, or dictionaries
   - 3.4 Hashmaps with variable-length keys
- 4 Control flow, continuations, and exceptions
   - 4.1 Continuations and subroutines
   - 4.2 Control flow primitives: conditional and iterated execution
   - 4.3 Operations with continuations
   - 4.4 Continuations as objects
   - 4.5 Exception handling
   - 4.6 Functions, recursion, and dictionaries
- 5 Codepages and instruction encoding
   - 5.1 Codepages and interoperability of different TVM versions
   - 5.2 Instruction encoding
   - 5.3 Instruction encoding in codepage zero
- A Instructions and opcodes
   - A.1 Gas prices
   - A.2 Stack manipulation primitives
   - A.3 Tuple, List, and Null primitives
   - A.4 Constant, or literal primitives
   - A.5 Arithmetic primitives Introduction
   - A.6 Comparison primitives
   - A.7 Cell primitives
   - A.8 Continuation and control flow primitives
   - A.9 Exception generating and handling primitives
   - A.10 Dictionary manipulation primitives
   - A.11 Application-specific primitives
   - A.12 Debug primitives
   - A.13 Codepage primitives
- B Formal properties and specifications of TVM
   - B.1 Serialization of the TVM state
   - B.2 Step function of TVM
- C Code density of stack and register machines
   - C.1 Sample leaf function
   - C.2 Comparison of machine code for sample leaf function
   - C.3 Sample non-leaf function
   - C.4 Comparison of machine code for sample non-leaf function


### 1.0 Notation for bitstrings

## 1 Overview Contents

This chapter provides an overview of the main features and design principles
of TVM. More detail on each topic is provided in subsequent chapters.

### 1.0 Notation for bitstrings

The following notation is used for bit strings (orbitstrings)—i.e., finite strings
consisting of binary digits (bits), 0 and 1 —throughout this document.

1.0.1. Hexadecimal notation for bitstrings. When the length of a bit-
string is a multiple of four, we subdivide it into groups of four bits and
represent each group by one of sixteen hexadecimal digits 0 – 9 ,A–Fin the
usual manner: 016 ↔ 0000 , 116 ↔ 0001 ,... ,F 16 ↔ 1111. The resulting
hexadecimal string is our equivalent representation for the original binary
string.

1.0.2. Bitstrings of lengths not divisible by four. If the length of a
binary string is not divisible by four, we augment it by one 1 and several
(maybe zero) 0 s at the end, so that its length becomes divisible by four, and
then transform it into a string of hexadecimal digits as described above. To
indicate that such a transformation has taken place, a special “completion
tag”_is added to the end of the hexadecimal string. The reverse transforma-
tion (applied if the completion tag is present) consists in first replacing each
hexadecimal digit by four corresponding bits, and then removing all trailing
zeroes (if any) and the last 1 immediately preceding them (if the resulting
bitstring is non-empty at this point).
Notice that there are several admissible hexadecimal representations for
the same bitstring. Among them, the shortest one is “canonical”. It can be
deterministically obtained by the above procedure.
For example,8Acorresponds to binary string 10001010 , while8A_ and
8A0_both correspond to 100010. An empty bitstring may be represented by
either ‘’, ‘8_’, ‘0_’, ‘_’, or ‘00_’.

1.0.3. Emphasizing that a string is a hexadecimal representation of
a bitstring.Sometimes we need to emphasize that a string of hexadecimal
digits (with or without a_at the end) is the hexadecimal representation of
a bitstring. In such cases, we either prependxto the resulting string (e.g.,
x8A), or prependx{and append}(e.g.,x{2D9_}, which is 00101101100 ).


### 1.1 TVM is a stack machine

This should not be confused with hexadecimal numbers, usually prepended
by0x(e.g.,0x2D9or0x2d9, which is the integer 729).

1.0.4. Serializing a bitstring into a sequence of octets. When a bit-
string needs to be represented as a sequence of 8-bit bytes (octets), which
take values in integers 0 ... 255 , this is achieved essentially in the same fash-
ion as above: we split the bitstring into groups of eight bits and interpret
each group as the binary representation of an integer 0 ... 255. If the length
of the bitstring is not a multiple of eight, the bitstring is augmented by a
binary 1 and up to seven binary 0 s before being split into groups. The fact
that such a completion has been applied is usually reflected by a “completion
tag” bit.
For instance, 00101101100 corresponds to the sequence of two octets
(0x2d,0x90)(hexadecimal), or(45,144)(decimal), along with a completion
tag bit equal to 1 (meaning that the completion has been applied), which
must be stored separately.
In some cases, it is more convenient to assume the completion is enabled
by default rather than store an additional completion tag bit separately.
Under such conventions, 8 n-bit strings are represented byn+ 1octets, with
the last octet always equal to0x80= 128.

### 1.1 TVM is a stack machine

First of all,TVM is a stack machine. This means that, instead of keeping
values in some “variables” or “general-purpose registers”, they are kept in a
(LIFO)stack, at least from the “low-level” (TVM) perspective.^3
Most operations and user-defined functions take their arguments from the
top of the stack, and replace them with their result. For example, the inte-
ger addition primitive (built-in operation)ADDdoes not take any arguments
describing which registers or immediate values should be added together and
where the result should be stored. Instead, the two top values are taken from
the stack, they are added together, and their sum is pushed into the stack in
their place.

(^3) A high-level smart-contract language might create a visibility of variables for the
ease of programming; however, the high-level source code working with variables will be
translated into TVM machine code keeping all the values of these variables in the TVM
stack.


```
1.1. TVM is a stack machine
```
1.1.1. TVM values. The entities that can be stored in the TVM stack
will be calledTVM values, or simply values for brevity. They belong to
one of several predefinedvalue types. Each value belongs to exactly one
value type. The values are always kept on the stack along with tags uniquely
determining their types, and all built-in TVM operations (orprimitives) only
accept values of predefined types.
For example, the integer addition primitiveADDaccepts only two integer
values, and returns one integer value as a result. One cannot supplyADDwith
two strings instead of two integers expecting it to concatenate these strings
or to implicitly transform the strings into their decimal integer values; any
attempt to do so will result in a run-time type-checking exception.

1.1.2. Static typing, dynamic typing, and run-time type checking.
In some respects TVM performs a kind of dynamic typing using run-time type
checking. However, this does not make the TVM code a “dynamically typed
language” like PHP or Javascript, because all primitives accept values and
return results of predefined (value) types, each value belongs to strictly one
type, and values are never implicitly converted from one type to another.
If, on the other hand, one compares the TVM code to the conventional
microprocessor machine code, one sees that the TVM mechanism of value
tagging prevents, for example, using the address of a string as a number—
or, potentially even more disastrously, using a number as the address of
a string—thus eliminating the possibility of all sorts of bugs and security
vulnerabilities related to invalid memory accesses, usually leading to memory
corruption and segmentation faults. This property is highly desirable for
a VM used to execute smart contracts in a blockchain. In this respect,
TVM’s insistence on tagging all values with their appropriate types, instead
of reinterpreting the bit sequence in a register depending on the needs of the
operation it is used in, is just an additional run-time type-safety mechanism.
An alternative would be to somehow analyze the smart-contract code for
type correctness and type safety before allowing its execution in the VM,
or even before allowing it to be uploaded into the blockchain as the code
of a smart contract. Such a static analysis of code for a Turing-complete
machine appears to be a time-consuming and non-trivial problem (likely to
be equivalent to the stopping problem for Turing machines), something we
would rather avoid in a blockchain smart-contract context.
One should bear in mind that one always can implement compilers from
statically typed high-level smart-contract languages into the TVM code (and


```
1.1. TVM is a stack machine
```
we do expect that most smart contracts for TON will be written in such lan-
guages), just as one can compile statically typed languages into conventional
machine code (e.g., x86 architecture). If the compiler works correctly, the
resulting machine code will never generate any run-time type-checking ex-
ceptions. All type tags attached to values processed by TVM will always
have expected values and may be safely ignored during the analysis of the
resulting TVM code, apart from the fact that the run-time generation and
verification of these type tags by TVM will slightly slow down the execution
of the TVM code.

1.1.3. Preliminary list of value types.A preliminary list of value types
supported by TVM is as follows:

- Integer— Signed 257-bit integers, representing integer numbers in the
    range− 2256 ... 2256 − 1 , as well as a special “not-a-number” valueNaN.
- Cell — ATVM cell consists of at most 1023 bits of data, and of at
    most four references to other cells. All persistent data (including TVM
    code) in the TON Blockchain is represented as a collection of TVM
    cells (cf. [1, 2.5.14]).
- Tuple — An ordered collection of up to 255 components, having ar-
    bitrary value types, possibly distinct. May be used to represent non-
    persistent values of arbitrary algebraic data types.
- Null— A type with exactly one value⊥, used for representing empty
    lists, empty branches of binary trees, absence of return value in some
    situations, and so on.
- Slice— ATVM cell slice, orslicefor short, is a contiguous “sub-cell”
    of an existing cell, containing some of its bits of data and some of its
    references. Essentially, a slice is a read-only view for a subcell of a cell.
    Slices are used for unpacking data previously stored (or serialized) in a
    cell or a tree of cells.
- Builder— ATVM cell builder, orbuilderfor short, is an “incomplete”
    cell that supports fast operations of appending bitstrings and cell ref-
    erences at its end. Builders are used for packing (or serializing) data
    from the top of the stack into new cells (e.g., before transferring them
    to persistent storage).


### 1.2 Categories of TVM instructions

- Continuation— Represents an “execution token” for TVM, which may
    be invoked (executed) later. As such, it generalizes function addresses
    (i.e., function pointers and references), subroutine return addresses,
    instruction pointer addresses, exception handler addresses, closures,
    partial applications, anonymous functions, and so on.

This list of value types is incomplete and may be extended in future revisions
of TVM without breaking the old TVM code, due mostly to the fact that
all originally defined primitives accept only values of types known to them
and will fail (generate a type-checking exception) if invoked on values of new
types. Furthermore, existing value types themselves can also be extended in
the future: for example, 257-bitInteger might become 513-bitLongInteger,
with originally defined arithmetic primitives failing if either of the arguments
or the result does not fit into the original subtypeInteger. Backward com-
patibility with respect to the introduction of new value types and extension
of existing value types will be discussed in more detail later (cf.5.1.4).

### 1.2 Categories of TVM instructions

TVMinstructions, also calledprimitivesand sometimes(built-in) operations,
are the smallest operations atomically performed by TVM that can be present
in the TVM code. They fall into several categories, depending on the types
of values (cf.1.1.3) they work on. The most important of these categories
are:

- Stack (manipulation) primitives— Rearrange data in the TVM stack,
    so that the other primitives and user-defined functions can later be
    called with correct arguments. Unlike most other primitives, they are
    polymorphic, i.e., work with values of arbitrary types.
- Tuple (manipulation) primitives— Construct, modify, and decompose
    Tuples. Similarly to the stack primitives, they are polymorphic.
- Constant orliteral primitives — Push into the stack some “constant”
    or “literal” values embedded into the TVM code itself, thus providing
    arguments to the other primitives. They are somewhat similar to stack
    primitives, but are less generic because they work with values of specific
    types.


### 1.3 Control registers

- Arithmetic primitives — Perform the usual integer arithmetic opera-
    tions on values of typeInteger.
- Cell (manipulation) primitives — Create new cells and store data in
    them (cell creation primitives) or read data from previously created
    cells (cell parsing primitives). Because all memory and persistent stor-
    age of TVM consists of cells, these cell manipulation primitives actually
    correspond to “memory access instructions” of other architectures. Cell
    creation primitives usually work with values of typeBuilder, while cell
    parsing primitives work withSlices.
- Continuation andcontrol flow primitives — Create and modifyCon-
    tinuations, as well as execute existingContinuations in different ways,
    including conditional and repeated execution.
- Custom or application-specific primitives — Efficiently perform spe-
    cific high-level actions required by the application (in our case, the
    TON Blockchain), such as computing hash functions, performing ellip-
    tic curve cryptography, sending new blockchain messages, creating new
    smart contracts, and so on. These primitives correspond to standard
    library functions rather than microprocessor instructions.

### 1.3 Control registers

While TVM is a stack machine, some rarely changed values needed in almost
all functions are better passed in certain special registers, and not near the top
of the stack. Otherwise, a prohibitive number of stack reordering operations
would be required to manage all these values.
To this end, the TVM model includes, apart from the stack, up to 16
specialcontrol registers, denoted byc0toc15, orc(0)toc(15). The original
version of TVM makes use of only some of these registers; the rest may be
supported later.

1.3.1. Values kept in control registers.The values kept in control regis-
ters are of the same types as those kept on the stack. However, some control
registers accept only values of specific types, and any attempt to load a value
of a different type will lead to an exception.

1.3.2. List of control registers.The original version of TVM defines and
uses the following control registers:


```
1.4. Total state of TVM (SCCCG)
```
- c0— Contains thenext continuationorreturn continuation(similar
    to the subroutine return address in conventional designs). This value
    must be aContinuation.
- c1— Contains thealternative (return) continuation; this value must
    be a Continuation. It is used in some (experimental) control flow
    primitives, allowing TVM to define and call “subroutines with two exit
    points”.
- c2— Contains theexception handler. This value is aContinuation,
    invoked whenever an exception is triggered.
- c3— Contains thecurrent dictionary, essentially a hashmap containing
    the code of all functions used in the program. For reasons explained
    later in4.6, this value is also aContinuation, not aCellas one might
    expect.
- c4— Contains theroot of persistent data, or simply thedata. This
    value is a Cell. When the code of a smart contract is invoked, c
    points to the root cell of its persistent data kept in the blockchain
    state. If the smart contract needs to modify this data, it changesc
    before returning.
- c5 — Contains theoutput actions. It is also aCell initialized by a
    reference to an empty cell, but its final value is considered one of the
    smart contract outputs. For instance, theSENDMSGprimitive, specific
    for the TON Blockchain, simply inserts the message into a list stored
    in the output actions.
- c7— Contains theroot of temporary data. It is aTuple, initialized by
    a reference to an emptyTuplebefore invoking the smart contract and
    discarded after its termination.^4

More control registers may be defined in the future for specific TON Block-
chain or high-level programming language purposes, if necessary.

(^4) In the TON Blockchain context,c7is initialized with a singletonTuple, the only
component of which is aTuplecontaining blockchain-specific data. The smart contract is
free to modifyc7to store its temporary data provided the first component of thisTuple
remains intact.


```
1.5. Integer arithmetic
```
### 1.4 Total state of TVM (SCCCG)

The total state of TVM consists of the following components:

- Stack(cf.1.1) — Contains zero or morevalues(cf.1.1.1), each be-
    longing to one ofvalue typeslisted in1.1.3.
- Control registersc0–c15— Contain some specific values as described
    in1.3.2. (Only seven control registers are used in the current version.)
- Current continuationcc— Contains the current continuation (i.e., the
    code that would be normally executed after the current primitive is
    completed). This component is similar to the instruction pointer reg-
    ister (ip) in other architectures.
- Current codepagecp— A special signed 16-bit integer value that selects
    the way the next TVM opcode will be decoded. For example, future
    versions of TVM might use different codepages to add new opcodes
    while preserving backward compatibility.
- Gas limitsgas— Contains four signed 64-bit integers: the current gas
    limitgl, the maximal gas limitgm, the remaining gasgr, and the gas
    creditgc. Always 0 ≤gl≤gm,gc≥ 0 , andgr≤gl+gc;gcis usually
    initialized by zero,gris initialized bygl+gcand gradually decreases
    as the TVM runs. Whengrbecomes negative or if the final value ofgr
    is less thangc, anout of gasexception is triggered.

Notice that there is no “return stack” containing the return addresses of all
previously called but unfinished functions. Instead, only control registerc
is used. The reason for this will be explained later in4.1.9.
Also notice that there are no general-purpose registers, because TVM
is a stack machine (cf.1.1). So the above list, which can be summarized
as “stack, control, continuation, codepage, and gas” (SCCCG), similarly to
the classical SECD machine state (“stack, environment, control, dump”), is
indeed thetotalstate of TVM.^5

(^5) Strictly speaking, there is also the currentlibrary context, which consists of a dictionary
with 256-bit keys and cell values, used to load library reference cells of3.1.7.


### 1.5 Integer arithmetic

### 1.5 Integer arithmetic

All arithmetic primitives of TVM operate on several arguments of typeIn-
teger, taken from the top of the stack, and return their results, of the same
type, into the stack. Recall thatInteger represents all integer values in the
range− 2256 ≤x < 2256 , and additionally contains a special valueNaN(“not-
a-number”).
If one of the results does not fit into the supported range of integers—
or if one of the arguments is aNaN—then this result or all of the results
are replaced by aNaN, and (by default) an integer overflow exception is
generated. However, special “quiet” versions of arithmetic operations will
simply produceNaNs and keep going. If theseNaNs end up being used in a
“non-quiet” arithmetic operation, or in a non-arithmetic operation, an integer
overflow exception will occur.

1.5.1. Absence of automatic conversion of integers.Notice that TVM
Integers are “mathematical” integers, and not 257-bit strings interpreted dif-
ferently depending on the primitive used, as is common for other machine
code designs. For example, TVM has only one multiplication primitiveMUL,
rather than two (MULfor unsigned multiplication andIMULfor signed multi-
plication) as occurs, for example, in the popular x86 architecture.

1.5.2. Automatic overflow checks.Notice that all TVM arithmetic prim-
itives perform overflow checks of the results. If a result does not fit into the
Integertype, it is replaced by aNaN, and (usually) an exception occurs. In
particular, the result isnotautomatically reduced modulo 2256 or 2257 , as is
common for most hardware machine code architectures.

1.5.3. Custom overflow checks.In addition to automatic overflow checks,
TVM includes custom overflow checks, performed by primitivesFITSnand
UFITSn, where 1 ≤n≤ 256. These primitives check whether the value on
(the top of) the stack is an integerxin the range− 2 n−^1 ≤ x < 2 n−^1 or
0 ≤x < 2 n, respectively, and replace the value with aNaNand (optionally)
generate an integer overflow exception if this is not the case. This greatly
simplifies the implementation of arbitraryn-bit integer types, signed or un-
signed: the programmer or the compiler must insert appropriateFITSor
UFITSprimitives either after each arithmetic operation (which is more rea-
sonable, but requires more checks) or before storing computed values and
returning them from functions. This is important for smart contracts, where


```
1.5. Integer arithmetic
```
unexpected integer overflows happen to be among the most common source
of bugs.

1.5.4. Reduction modulo 2 n.TVM also has a primitiveMODPOW2n, which
reduces the integer at the top of the stack modulo 2 n, with the result ranging
from 0 to 2 n− 1.

1.5.5. Integer is 257-bit, not 256-bit. One can understand now why
TVM’sInteger is (signed) 257-bit, not 256-bit. The reason is that it is the
smallest integer type containing both signed 256-bit integers and unsigned
256-bit integers, which does not require automatic reinterpreting of the same
256-bit string depending on the operation used (cf.1.5.1).

1.5.6. Division and rounding. The most important division primitives
areDIV,MOD, andDIVMOD. All of them take two numbers from the stack,x
andy(yis taken from the top of the stack, and xis originally under it),
compute the quotientqand remainderrof the division ofxbyy(i.e., two
integers such thatx=yq+rand|r|<|y|), and return eitherq,r, or both
of them. Ifyis zero, then all of the expected results are replaced byNaNs,
and (usually) an integer overflow exception is generated.
The implementation of division in TVM somewhat differs from most
other implementations with regards to rounding. By default, these prim-
itives round to −∞, meaning that q = bx/yc, and r has the same sign
asy. (Most conventional implementations of division use “rounding to zero”
instead, meaning that r has the same sign asx.) Apart from this “floor
rounding”, two other rounding modes are available, called “ceiling rounding”
(withq =dx/ye, andr andy having opposite signs) and “nearest round-
ing” (withq = bx/y+ 1/ 2 c and|r| ≤ |y|/ 2 ). These rounding modes are
selected by using other division primitives, with lettersCandRappended
to their mnemonics. For example,DIVMODRcomputes both the quotient and
the remainder using rounding to the nearest integer.

1.5.7. Combined multiply-divide, multiply-shift, and shift-divide
operations. To simplify implementation of fixed-point arithmetic, TVM
supports combined multiply-divide, multiply-shift, and shift-divide opera-
tions with double-length (i.e., 514-bit) intermediate product. For example,
MULDIVMODRtakes three integer arguments from the stack,a,b, andc, first
computesabusing a 514-bit intermediate result, and then dividesabbyc
using rounding to the nearest integer. Ifcis zero or if the quotient does not


```
1.5. Integer arithmetic
```
fit intoInteger, either twoNaNs are returned, or an integer overflow exception
is generated, depending on whether a quiet version of the operation has been
used. Otherwise, both the quotient and the remainder are pushed into the
stack.


### 2.1 Stack calling conventions

## 2 The stack

This chapter contains a general discussion and comparison of register and
stack machines, expanded further in Appendix C, and describes the two
main classes of stack manipulation primitives employed by TVM: thebasic
and thecompound stack manipulation primitives. An informal explanation of
their sufficiency for all stack reordering required for correctly invoking other
primitives and user-defined functions is also provided. Finally, the problem
of efficiently implementing TVM stack manipulation primitives is discussed
in2.3.

### 2.1 Stack calling conventions

A stack machine, such as TVM, uses the stack—and especially the values
near the top of the stack—to pass arguments to called functions and primi-
tives (such as built-in arithmetic operations) and receive their results. This
section discusses the TVM stack calling conventions, introduces some no-
tation, and compares TVM stack calling conventions with those of certain
register machines.

2.1.1. Notation for “stack registers”. Recall that a stack machine, as
opposed to a more conventional register machine, lacks general-purpose reg-
isters. However, one can treat the values near the top of the stack as a kind
of “stack registers”.
We denote bys0ors(0)the value at the top of the stack, bys1ors(1)
the value immediately under it, and so on. The total number of values in the
stack is called itsdepth. If the depth of the stack isn, thens(0),s(1),... ,
s(n−1)are well-defined, whiles(n)and all subsequents(i)withi > nare
not. Any attempt to uses(i)withi≥nshould produce a stack underflow
exception.
A compiler, or a human programmer in “TVM code”, would use these
“stack registers” to hold all declared variables and intermediate values, simi-
larly to the way general-purpose registers are used on a register machine.

2.1.2. Pushing and popping values. When a valuexispushed into a
stack of depthn, it becomes the news0; at the same time, the olds0becomes
the news1, the olds1—the news2, and so on. The depth of the resulting
stack isn+ 1.


```
2.1. Stack calling conventions
```
Similarly, when a valuexispopped from a stack of depthn≥ 1 , it is the
old value ofs0(i.e., the old value at the top of the stack). After this, it is
removed from the stack, and the olds1becomes the news0(the new value
at the top of the stack), the olds2becomes the news1, and so on. The
depth of the resulting stack isn− 1.
If originallyn= 0, then the stack isempty, and a value cannot be popped
from it. If a primitive attempts to pop a value from an empty stack, astack
underflowexception occurs.

2.1.3. Notation for hypothetical general-purpose registers.In order
to compare stack machines with sufficiently general register machines, we will
denote the general-purpose registers of a register machine byr0,r1, and so
on, or byr(0),r(1),... ,r(n−1), wherenis the total number of registers.
When we need a specific value ofn, we will usen= 16, corresponding to the
very popular x86-64 architecture.

2.1.4. The top-of-stack registers0vs. the accumulator registerr0.
Some register machine architectures require one of the arguments for most
arithmetic and logical operations to reside in a special register called the
accumulator. In our comparison, we will assume that the accumulator is
the general-purpose registerr0; otherwise we could simply renumber the
registers. In this respect, the accumulator is somewhat similar to the top-of-
stack “register”s0of a stack machine, because virtually all operations of a
stack machine both uses0as one of their arguments and return their result
ass0.

2.1.5. Register calling conventions. When compiled for a register ma-
chine, high-level language functions usually receive their arguments in certain
registers in a predefined order. If there are too many arguments, these func-
tions take the remainder from the stack (yes, a register machine usually has
a stack, too!). Some register calling conventions pass no arguments in regis-
ters at all, however, and only use the stack (for example, the original calling
conventions used in implementations of Pascal and C, although modern im-
plementations of C use some registers as well).
For simplicity, we will assume that up tom≤nfunction arguments are
passed in registers, and that these registers arer0,r1,... ,r(m−1), in that
order (if some other registers are used, we can simply renumber them).^6

(^6) Our inclusion ofr0here creates a minor conflict with our assumption that the ac-


```
2.1. Stack calling conventions
```
2.1.6. Order of function arguments. If a function or primitive requires
margumentsx 1 ,... ,xm, they are pushed by the caller into the stack in the
same order, starting fromx 1. Therefore, when the function or primitive is
invoked, its first argumentx 1 is ins(m−1), its second argumentx 2 is in
s(m−2), and so on. The last argumentxmis ins0(i.e., at the top of the
stack). It is the called function or primitive’s responsibility to remove its
arguments from the stack.
In this respect the TVM stack calling conventions—obeyed, at least, by
TMV primitives—match those of Pascal and Forth, and are the opposite of
those of C (in which the arguments are pushed into the stack in the reverse
order, and are removed by the caller after it regains control, not the callee).
Of course, an implementation of a high-level language for TVM might
choose some other calling conventions for its functions, different from the
default ones. This might be useful for certain functions—for instance, if the
total number of arguments depends on the value of the first argument, as
happens for “variadic functions” such asscanfandprintf. In such cases,
the first one or several arguments are better passed near the top of the stack,
not somewhere at some unknown location deep in the stack.

2.1.7. Arguments to arithmetic primitives on register machines.
On a stack machine, built-in arithmetic primitives (such asADDorDIVMOD)
follow the same calling conventions as user-defined functions. In this respect,
user-defined functions (for example, a function computing the square root of
a number) might be considered as “extensions” or “custom upgrades” of the
stack machine. This is one of the clearest advantages of stack machines
(and of stack programming languages such as Forth) compared to register
machines.
In contrast, arithmetic instructions (built-in operations) on register ma-
chines usually get their parameters from general-purpose registers encoded
in the full opcode. A binary operation, such asSUB, thus requires two argu-
ments,r(i)andr(j), withiandjspecified by the instruction. A register
r(k)for storing the result also must be specified. Arithmetic operations can
take several possible forms, depending on whetheri,j, andkare allowed to
take arbitrary values:

- Three-address form — Allows the programmer to arbitrarily choose
    not only the two source registers r(i)andr(j), but also a separate

cumulator register, if present, is alsor0; for simplicity, we will resolve this problem by
assuming that the first argument to a function is passed in the accumulator.


```
2.1. Stack calling conventions
```
```
destination registerr(k). This form is common for most RISC proces-
sors, and for the XMM and AVX SIMD instruction sets in the x86-
architecture.
```
- Two-address form — Uses one of the two operand registers (usually
    r(i)) to store the result of an operation, so thatk=iis never indicated
    explicitly. Onlyiandjare encoded inside the instruction. This is the
    most common form of arithmetic operations on register machines, and
    is quite popular on microprocessors (including the x86 family).
- One-address form — Always takes one of the arguments from the ac-
    cumulatorr0, and stores the result inr0as well; theni=k= 0, and
    onlyjneeds to be specified by the instruction. This form is used by
    some simpler microprocessors (such as Intel 8080).

Note that this flexibility is available only for built-in operations, but not
for user-defined functions. In this respect, register machines are not as easily
“upgradable” as stack machines.^7

2.1.8. Return values of functions. In stack machines such as TVM,
when a function or primitive needs to return a result value, it simply pushes
it into the stack (from which all arguments to the function have already been
removed). Therefore, the caller will be able to access the result value through
the top-of-stack “register”s0.
This is in complete accordance with Forth calling conventions, but dif-
fers slightly from Pascal and C calling conventions, where the accumulator
registerr0is normally used for the return value.

2.1.9. Returning several values. Some functions might want to return
several valuesy 1 ,... ,yk, withknot necessarily equal to one. In these cases,
thekreturn values are pushed into the stack in their natural order, starting
fromy 1.
For example, the “divide with remainder” primitiveDIVMODneeds to re-
turn two values, the quotient q and the remainder r. Therefore, DIVMOD
pushesqandrinto the stack, in that order, so that the quotient is available

(^7) For instance, if one writes a function for extracting square roots, this function will
always accept its argument and return its result in the same registers, in contrast with
a hypothetical built-in square root instruction, which could allow the programmer to
arbitrarily choose the source and destination registers. Therefore, a user-defined function
is tremendously less flexible than a built-in instruction on a register machine.


```
2.1. Stack calling conventions
```
thereafter ats1 and the remainder ats0. The net effect of DIVMODis to
divide the original value ofs1by the original value of s0, and return the
quotient ins1and the remainder ins0. In this particular case the depth
of the stack and the values of all other “stack registers” remain unchanged,
becauseDIVMODtakes two arguments and returns two results. In general, the
values of other “stack registers” that lie in the stack below the arguments
passed and the values returned are shifted according to the change of the
depth of the stack.
In principle, some primitives and user-defined functions might return a
variable number of result values. In this respect, the remarks above about
variadic functions (cf.2.1.6) apply: the total number of result values and
their types should be determined by the values near the top of the stack.
(For example, one might push the return valuesy 1 ,... ,yk, and then push
their total numberkas an integer. The caller would then determine the total
number of returned values by inspectings0.)
In this respect TVM, again, faithfully observes Forth calling conventions.

2.1.10. Stack notation. When a stack of depthncontains valuesz 1 ,... ,
zn, in that order, withz 1 the deepest element andznthe top of the stack,
the contents of the stack are often represented by a listz 1 z 2.. .zn, in that
order. When a primitive transforms the original stack stateS′into a new
stateS′′, this is often written asS′–S′′; this is the so-calledstack notation.
For example, the action of the division primitiveDIVcan be described byS
x y–Sbx/yc, whereSis any list of values. This is usually abbreviated asx
y–bx/yc, tacitly assuming that all other values deeper in the stack remain
intact.
Alternatively, one can describeDIVas a primitive that runs on a stackS′
of depthn≥ 2 , dividess1bys0, and returns the floor-rounded quotient as
s0of the new stackS′′of depthn− 1. The new value ofs(i)equals the old
value ofs(i+ 1)for 1 ≤i < n− 1. These descriptions are equivalent, but
saying thatDIVtransformsx yintobx/yc, or.. .x yinto.. .bx/yc, is more
concise.
The stack notation is extensively used throughout AppendixA, where all
currently defined TVM primitives are listed.

2.1.11. Explicitly defining the number of arguments to a function.
Stack machines usually pass the current stack in its entirety to the invoked
primitive or function. That primitive or function accesses only the several
values near the top of the stack that represent its arguments, and pushes the


### 2.2 Stack manipulation primitives

return values in their place, by convention leaving all deeper values intact.
Then the resulting stack, again in its entirety, is returned to the caller.
Most TVM primitives behave in this way, and we expect most user-defined
functions to be implemented under such conventions. However, TVM pro-
vides mechanisms to specify how many arguments must be passed to a called
function (cf.4.1.10). When these mechanisms are employed, the specified
number of values are moved from the caller’s stack into the (usually initially
empty) stack of the called function, while deeper values remain in the caller’s
stack and are inaccessible to the callee. The caller can also specify how many
return values it expects from the called function.
Such argument-checking mechanisms might be useful, for example, for a
library function that calls user-provided functions passed as arguments to it.

### 2.2 Stack manipulation primitives

A stack machine, such as TVM, employs a lot of stack manipulation primi-
tives to rearrange arguments to other primitives and user-defined functions,
so that they become located near the top of the stack in correct order. This
section discusses which stack manipulation primitives are necessary and suf-
ficient for achieving this goal, and which of them are used by TVM. Some
examples of code using these primitives can be found in AppendixC.

2.2.1. Basic stack manipulation primitives.The most important stack
manipulation primitives used by TVM are the following:

- Top-of-stack exchange operation: XCHG s0,s(i)or XCHG s(i)— Ex-
    changes values of s0 and s(i). Wheni = 1, operationXCHG s1 is
    traditionally denoted bySWAP. Wheni= 0, this is aNOP(an operation
    that does nothing, at least if the stack is non-empty).
- Arbitrary exchange operation: XCHG s(i),s(j)— Exchanges values of
    s(i)ands(j). Notice that this operation is not strictly necessary, be-
    cause it can be simulated by three top-of-stack exchanges: XCHG s(i);
    XCHG s(j);XCHG s(i). However, it is useful to have arbitrary exchanges
    as primitives, because they are required quite often.
- Push operation: PUSH s(i)— Pushes a copy of the (old) value ofs(i)
    into the stack. Traditionally,PUSH s0is also denoted byDUP(it dupli-
    cates the value at the top of the stack), andPUSH s1byOVER.


```
2.2. Stack manipulation primitives
```
- Pop operation:POP s(i)— Removes the top-of-stack value and puts it
    into the (new)s(i−1), or the olds(i). Traditionally,POP s0is also
    denoted byDROP(it simply drops the top-of-stack value), andPOP s1
    byNIP.

Some other “unsystematic” stack manipulation operations might be also
defined (e.g.,ROT, with stack notationa b c– b c a). While such opera-
tions are defined in stack languages like Forth (whereDUP,DROP,OVER,NIP
andSWAPare also present), they are not strictly necessary because thebasic
stack manipulation primitiveslisted above suffice to rearrange stack registers
to allow any arithmetic primitives and user-defined functions to be invoked
correctly.

2.2.2. Basic stack manipulation primitives suffice. A compiler or a
human TVM-code programmer might use the basic stack primitives as fol-
lows.
Suppose that the function or primitive to be invoked is to be passed, say,
three argumentsx,y, andz, currently located in stack registerss(i),s(j),
ands(k). In this circumstance, the compiler (or programmer) might issue
operationPUSH s(i)(if a copy ofxis needed after the call to this primitive)
orXCHG s(i)(if it will not be needed afterwards) to put the first argument
xinto the top of the stack. Then, the compiler (or programmer) could use
eitherPUSH s(j′)orXCHG s(j′), wherej′=jorj+ 1, to putyinto the new
top of the stack.^8
Proceeding in this manner, we see that we can put the original values of
x,y, andz—or their copies, if needed—into locationss2,s1, ands0, using
a sequence of push and exchange operations (cf.2.2.4and2.2.5for a more
detailed explanation). In order to generate this sequence, the compiler will
need to know only the three valuesi,jandk, describing the old locations of
variables or temporary values in question, and some flags describing whether
each value will be needed thereafter or is needed only for this primitive or
function call. The locations of other variables and temporary values will be
affected in the process, but a compiler (or a human programmer) can easily
track their new locations.

(^8) Of course, if the second option is used, this will destroy the original arrangement of
xin the top of the stack. In this case, one should either issue aSWAPbeforeXCHG s(j′),
or replace the previous operationXCHG s(i)withXCHG s1, s(i), so thatxis exchanged
withs1from the beginning.


```
2.2. Stack manipulation primitives
```
Similarly, if the results returned from a function need to be discarded
or moved to other stack registers, a suitable sequence of exchange and pop
operations will do the job. In the typical case of one return value ins0,
this is achieved either by anXCHG s(i)or aPOP s(i)(in most cases, aDROP)
operation.^9
Rearranging the result value or values before returning from a function is
essentially the same problem as arranging arguments for a function call, and
is achieved similarly.

2.2.3. Compound stack manipulation primitives.In order to improve
the density of the TVM code and simplify development of compilers, com-
pound stack manipulation primitives may be defined, each combining up to
four exchange and push or exchange and pop basic primitives. Such com-
pound stack operations might include, for example:

- XCHG2 s(i),s(j)— Equivalent toXCHG s1,s(i);XCHG s(j).
- PUSH2 s(i),s(j)— Equivalent toPUSH s(i);PUSH s(j+ 1).
- XCPU s(i),s(j)— Equivalent toXCHG s(i);PUSH s(j).
- PUXC s(i),s(j)— Equivalent toPUSH s(i);SWAP;XCHG s(j+1). When
    j 6 =iandj 6 = 0, it is also equivalent toXCHG s(j);PUSH s(i);SWAP.
- XCHG3 s(i),s(j),s(k)— Equivalent to XCHG s2,s(i); XCHG s1,s(j);
    XCHG s(k).
- PUSH3 s(i),s(j),s(k)— Equivalent toPUSH s(i);PUSH s(j+1);PUSH
    s(k+ 2).

Of course, such operations make sense only if they admit a more compact
encoding than the equivalent sequence of basic operations. For example,
if all top-of-stack exchanges, XCHG s1,s(i)exchanges, and push and pop
operations admit one-byte encodings, the only compound stack operations
suggested above that might merit inclusion in the set of stack manipulation
primitives arePUXC,XCHG3, andPUSH3.

(^9) Notice that the most commonXCHGs(i)operation is not really required here if we
do not insist on keeping the same temporary value or variable always in the same stack
location, but rather keep track of its subsequent locations. We will move it to some other
location while preparing the arguments to the next primitive or function call.


```
2.2. Stack manipulation primitives
```
These compound stack operations essentially augment other primitives
(instructions) in the code with the “true” locations of their operands, some-
what similarly to what happens with two-address or three-address register
machine code. However, instead of encoding these locations inside the op-
code of the arithmetic or another instruction, as is customary for register
machines, we indicate these locations in a preceding compound stack ma-
nipulation operation. As already described in2.1.7, the advantage of such
an approach is that user-defined functions (or rarely used specific primitives
added in a future version of TVM) can benefit from it as well (cf.C.3for a
more detailed discussion with examples).

2.2.4. Mnemonics of compound stack operations. The mnemonics
of compound stack operations, some examples of which have been provided
in2.2.3, are created as follows.
The γ ≥ 2 formal argumentss(i 1 ),... , s(iγ)to such an operation O
represent the values in the original stack that will end up ins(γ−1),... ,
s0after the execution of this compound operation, at least if all iν, 1 ≤
ν ≤γ, are distinct and at leastγ. The mnemonic itself of the operation
O is a sequence ofγ two-letter stringsPU andXC, with PU meaning that
the corresponding argument is to be PUshed (i.e., a copy is to be created),
andXC meaning that the value is to be eXChanged (i.e., no other copy of
the original value is created). Sequences of severalPUorXCstrings may be
abbreviated to onePUorXCfollowed by the number of copies. (For instance,
we writePUXC2PUinstead ofPUXCXCPU.)
As an exception, if a mnemonic would consist of onlyPUor onlyXCstrings,
so that the compound operation is equivalent to a sequence ofmPUSHes or
eXCHanGes, the notationPUSHmorXCHGmis used instead ofPUmorXCm.

2.2.5. Semantics of compound stack operations. Each compoundγ-
ary operationOs(i 1 ),... ,s(iγ)is translated into an equivalent sequence of
basic stack operations by induction inγas follows:

- As a base of induction, ifγ = 0, the only nullary compound stack
    operation corresponds to an empty sequence of basic stack operations.
- Equivalently, we might begin the induction fromγ= 1. ThenPU s(i)
    corresponds to the sequence consisting of one basic operation PUSH
    s(i), andXC s(i)corresponds to the one-element sequence consisting
    ofXCHG s(i).


### 2.3 Efficiency of stack manipulation primitives

- Forγ≥ 1 (or forγ≥ 2 , if we useγ= 1as induction base), there are
    two subcases:
       1. Os(i 1 ),...,s(iγ), withO=XCO′, whereO′is a compound opera-
          tion of arityγ− 1 (i.e., the mnemonic ofO′consists ofγ− 1 strings
          XCandPU). Letαbe the total quantity ofPUshes inO, andβbe
          that of eXChanges, so thatα+β=γ. Then the original operation
          is translated intoXCHG s(β−1),s(i 1 ), followed by the translation
          ofO′s(i 2 ),...,s(iγ), defined by the induction hypothesis.
       2. Os(i 1 ),...,s(iγ), with O= PUO′, whereO′ is a compound op-
          eration of arity γ− 1. Then the original operation is trans-
          lated intoPUSH s(i 1 ); XCHG s(β), followed by the translation of
          O′s(i 2 + 1),...,s(iγ+ 1), defined by the induction hypothesis.^10

2.2.6. Stack manipulation instructions are polymorphic.Notice that
the stack manipulation instructions are almost the only “polymorphic” prim-
itives in TVM—i.e., they work with values of arbitrary types (including the
value types that will appear only in future revisions of TVM). For exam-
ple,SWAPalways interchanges the two top values of the stack, even if one of
them is an integer and the other is a cell. Almost all other instructions, es-
pecially the data processing instructions (including arithmetic instructions),
require each of their arguments to be of some fixed type (possibly different
for different arguments).

### 2.3 Efficiency of stack manipulation primitives

Stack manipulation primitives employed by a stack machine, such as TVM,
have to be implemented very efficiently, because they constitute more than
half of all the instructions used in a typical program. In fact, TVM performs
all these instructions in a (small) constant time, regardless of the values
involved (even if they represent very large integers or very large trees of
cells).

2.3.1. Implementation of stack manipulation primitives: using ref-
erences for operations instead of objects. The efficiency of TVM’s
implementation of stack manipulation primitives results from the fact that a

(^10) An alternative, arguably better, translation ofPUO′s(i 1 ),...,s(iγ)consists of the
translation ofO′s(i 2 ),...,s(iγ), followed byPUSH s(i 1 +α−1);XCHG s(γ−1).


```
2.3. Efficiency of stack manipulation primitives
```
typical TVM implementation keeps in the stack not the value objects them-
selves, but only the references (pointers) to such objects. Therefore, aSWAP
instruction only needs to interchange the references ats0ands1, not the
actual objects they refer to.

2.3.2. Efficient implementation of DUPand PUSHinstructions using
copy-on-write.Furthermore, aDUP(or, more generally,PUSH s(i)) instruc-
tion, which appears to make a copy of a potentially large object, also works
in small constant time, because it uses a copy-on-write technique of delayed
copying: it copies only the reference instead of the object itself, but increases
the “reference counter” inside the object, thus sharing the object between the
two references. If an attempt to modify an object with a reference counter
greater than one is detected, a separate copy of the object in question is made
first (incurring a certain “non-uniqueness penalty” or “copying penalty” for
the data manipulation instruction that triggered the creation of a new copy).

2.3.3. Garbage collecting and reference counting. When the refer-
ence counter of a TVM object becomes zero (for example, because the last
reference to such an object has been consumed by aDROPoperation or an
arithmetic instruction), it is immediately freed. Because cyclic references
are impossible in TVM data structures, this method of reference counting
provides a fast and convenient way of freeing unused objects, replacing slow
and unpredictable garbage collectors.

2.3.4. Transparency of the implementation: Stack values are “val-
ues”, not “references”.Regardless of the implementation details just dis-
cussed, all stack values are really “values”, not “references”, from the perspec-
tive of the TVM programmer, similarly to the values of all types in functional
programming languages. Any attempt to modify an existing object referred
to from any other objects or stack locations will result in a transparent re-
placement of this object by its perfect copy before the modification is actually
performed.
In other words, the programmer should always act as if the objects them-
selves were directly manipulated by stack, arithmetic, and other data trans-
formation primitives, and treat the previous discussion only as an explanation
of the high efficiency of the stack manipulation primitives.

2.3.5. Absence of circular references. One might attempt to create a
circular reference between two cells,AandB, as follows: first createAand


```
2.3. Efficiency of stack manipulation primitives
```
write some data into it; then createBand write some data into it, along
with a reference to previously constructed cellA; finally, add a reference to
BintoA. While it may seem that after this sequence of operations we obtain
a cellA, which refers toB, which in turn refers toA, this is not the case.
In fact, we obtain a new cellA′, which contains a copy of the data originally
stored into cellAalong with a reference to cellB, which contains a reference
to (the original) cellA.
In this way the transparent copy-on-write mechanism and the “everything
is a value” paradigm enable us to create new cells using only previously
constructed cells, thus forbidding the appearance of circular references. This
property also applies to all other data structures: for instance, the absence
of circular references enables TVM to use reference counting to immediately
free unused memory instead of relying on garbage collectors. Similarly, this
property is crucial for storing data in the TON Blockchain.


### 3.1 Generalities on cells

## 3 Cells, memory, and persistent storage

This chapter briefly describes TVM cells, used to represent all data structures
inside the TVM memory and its persistent storage, and the basic operations
used to create cells, write (or serialize) data into them, and read (or deseri-
alize) data from them.

### 3.1 Generalities on cells

This section presents a classification and general descriptions of cell types.

3.1.1. TVM memory and persistent storage consist of cells. Recall
that the TVM memory and persistent storage consist of(TVM) cells. Each
cell contains up to 1023 bits of data and up to four references to other cells.^11
Circular references are forbidden and cannot be created by means of TVM
(cf.2.3.5). In this way, all cells kept in TVM memory and persistent storage
constitute a directed acyclic graph (DAG).

3.1.2. Ordinary and exotic cells. Apart from the data and references,
a cell has acell type, encoded by an integer− 1... 255. A cell of type− 1
is calledordinary; such cells do not require any special processing. Cells of
other types are calledexotic, and may beloaded—automatically replaced by
other cells when an attempt to deserialize them (i.e., to convert them into
aSliceby aCTOSinstruction) is made. They may also exhibit a non-trivial
behavior when their hashes are computed.
The most common use for exotic cells is to represent some other cells—for
instance, cells present in an external library, or pruned from the original tree
of cells when a Merkle proof has been created.
The type of an exotic cell is stored as the first eight bits of its data. If an
exotic cell has less than eight data bits, it is invalid.

3.1.3. The level of a cell.Every cellchas another attributeLvl(c)called
its(de Brujn) level, which currently takes integer values in the range 0... 3.

(^11) From the perspective of low-level cell operations, these data bits and cell references
are not intermixed. In other words, an (ordinary) cell essentially is a couple consisting of
a list of up to 1023 bits and of a list of up to four cell references, without prescribing an
order in which the references and the data bits should be deserialized, even though TL-B
schemes appear to suggest such an order.


```
3.1. Generalities on cells
```
The level of an ordinary cell is always equal to the maximum of the levels of
all its childrenci:
Lvl(c) = max
1 ≤i≤r
Lvl(ci) , (1)

for an ordinary cellccontainingr references to cellsc 1 ,... , cr. Ifr= 0,
Lvl(c) = 0. Exotic cells may have different rules for setting their level.
A cell’s level affects the number ofhigher hashesit has. More precisely,
a levellcell haslhigher hashesHash 1 (c),... ,Hashl(c)in addition to its
representation hashHash(c) =Hash∞(c). Cells of non-zero level appear
insideMerkle proofs andMerkle updates, after some branches of the tree of
cells representing a value of an abstract data type are pruned.

3.1.4. Standard cell representation.When a cell needs to be transferred
by a network protocol or stored in a disk file, it must beserialized. The
standard representationCellRepr(c) =CellRepr∞(c)of a cellcas an
octet (byte) sequence is constructed as follows:

1. Two descriptor bytes d 1 andd 2 are serialized first. Byted 1 equals
    r+8s+32l, where 0 ≤r≤ 4 is the quantity of cell references contained
    in the cell, 0 ≤l ≤ 3 is the level of the cell, and 0 ≤s≤ 1 is 1 for
    exotic cells and 0 for ordinary cells. Byted 2 equalsbb/ 8 c+db/ 8 e, where
    0 ≤b≤ 1023 is the quantity of data bits inc.
2. Then the data bits are serialized asdb/ 8 e8-bit octets (bytes). Ifbis not
    a multiple of eight, a binary 1 and up to six binary 0 s are appended to
    the data bits. After that, the data is split intodb/ 8 eeight-bit groups,
    and each group is interpreted as an unsigned big-endian integer 0 ... 255
    and stored into an octet.
3. Finally, each of thercell references is represented by 32 bytes contain-
    ing the 256-bitrepresentation hashHash(ci), explained below in3.1.5,
    of the cellcireferred to.

In this way,2 +db/ 8 e+ 32rbytes ofCellRepr(c)are obtained.

3.1.5. The representation hash of a cell. The 256-bitrepresentation
hashor simplyhashHash(c)of a cellcis recursively defined as thesha256
of the standard representation of the cellc:

```
Hash(c) :=sha256
```
#### (

```
CellRepr(c)
```
#### )

#### (2)


```
3.1. Generalities on cells
```
Notice that cyclic cell references are not allowed and cannot be created by
means of the TVM (cf.2.3.5), so this recursion always ends, and the repre-
sentation hash of any cell is well-defined.

3.1.6. The higher hashes of a cell. Recall that a cell cof levellhasl
higher hashesHashi(c), 1 ≤i≤l, as well. Exotic cells have their own rules
for computing their higher hashes. Higher hashesHashi(c)of an ordinary
cellcare computed similarly to its representation hash, but using the higher
hashes Hashi(cj)of its childrencj instead of their representation hashes
Hash(cj). By convention, we setHash∞(c) :=Hash(c), andHashi(c) :=
Hash∞(c) =Hash(c)for alli > l.^12

3.1.7. Types of exotic cells. TVM currently supports the following cell
types:

- Type− 1 : Ordinary cell— Contains up to 1023 bits of data and up to
    four cell references.
- Type 1: Pruned branch cellc — May have any level 1 ≤l ≤ 3. It
    contains exactly 8 + 256l data bits: first an 8-bit integer equal to 1
    (representing the cell’s type), then itslhigher hashesHash 1 (c),... ,
    Hashl(c). The levell of a pruned branch cell may be called its de
    Brujn index, because it determines the outer Merkle proof or Merkle
    update during the construction of which the branch has been pruned.
    An attempt to load a pruned branch cell usually leads to an exception.
- Type 2:Library reference cell— Always has level 0, and contains8+256
    data bits, including its 8-bit type integer 2 and the representation hash
    Hash(c′)of the library cell being referred to. When loaded, a library
    reference cell may be transparently replaced by the cell it refers to, if
    found in the currentlibrary context.
- Type 3: Merkle proof cellc— Has exactly one referencec 1 and level
    0 ≤l≤ 3 , which must be one less than the level of its only childc 1 :

```
Lvl(c) = max(Lvl(c 1 )− 1 ,0) (3)
```
(^12) From a theoretical perspective, we might say that a cellchas an infinite sequence
of hashes
(
Hashi(c)
)
i≥ 1 , which eventually stabilizes:Hashi(c)→Hash∞(c). Then the
levellis simply the largest indexi, such thatHashi(c) 6 =Hash∞(c).


```
3.1. Generalities on cells
```
```
The 8 + 256 data bits of a Merkle proof cell contain its 8-bit type
integer 3, followed byHash 1 (c 1 )(assumed to be equal toHash(c 1 )if
Lvl(c 1 ) = 0). The higher hashesHashi(c)ofcare computed similarly
to the higher hashes of an ordinary cell, but with Hashi+1(c 1 )used
instead ofHashi(c 1 ). When loaded, a Merkle proof cell is replaced by
c 1.
```
- Type 4: Merkle update cellc— Has two childrenc 1 andc 2. Its level
    0 ≤l≤ 3 is given by

```
Lvl(c) = max(Lvl(c 1 )− 1 ,Lvl(c 2 )− 1 ,0) (4)
```
```
A Merkle update behaves like a Merkle proof for bothc 1 andc 2 , and
contains8 + 256 + 256data bits withHash 1 (c 1 )andHash 1 (c 2 ). How-
ever, an extra requirement is thatall pruned branch cellsc′ that are
descendants ofc 2 and are bound bycmust also be descendants ofc 1.^13
When a Merkle update cell is loaded, it is replaced byc 2.
```
3.1.8. All values of algebraic data types are trees of cells.Arbitrary
values of arbitrary algebraic data types (e.g., all types used in functional
programming languages) can be serialized into trees of cells (of level 0), and
such representations are used for representing such values within TVM. The
copy-on-write mechanism (cf.2.3.2) allows TVM to identify cells containing
the same data and references, and to keep only one copy of such cells. This
actually transforms a tree of cells into a directed acyclic graph (with the
additional property that all its vertices be accessible from a marked vertex
called the “root”). However, this is a storage optimization rather than an
essential property of TVM. From the perspective of a TVM code programmer,
one should think of TVM data structures as trees of cells.

3.1.9. TVM code is a tree of cells. The TVM code itself is also rep-
resented by a tree of cells. Indeed, TVM code is simply a value of some
complex algebraic data type, and as such, it can be serialized into a tree of
cells.
The exact way in which the TVM code (e.g., TVM assembly code) is
transformed into a tree of cells is explained later (cf.4.1.4and5.2), in sec-
tions discussing control flow instructions, continuations, and TVM instruc-
tion encoding.

(^13) A pruned branch cellc′of levellisboundby a Merkle (proof or update) cellcif there
are exactlylMerkle cells on the path fromcto its descendantc′, includingc.


### 3.2 Data manipulation instructions and cells

3.1.10. “Everything is a bag of cells” paradigm. As described in [1,
2.5.14], all the data used by the TON Blockchain, including the blocks them-
selves and the blockchain state, can be represented—and are represented—as
collections, or “bags”, of cells. We see that TVM’s structure of data (cf.3.1.8)
and code (cf.3.1.9) nicely fits into this “everything is a bag of cells” paradigm.
In this way, TVM can naturally be used to execute smart contracts in the
TON Blockchain, and the TON Blockchain can be used to store the code
and persistent data of these smart contracts between invocations of TVM.
(Of course, both TVM and the TON Blockchain have been designed so that
this would become possible.)

### 3.2 Data manipulation instructions and cells

The next large group of TVM instructions consists of data manipulation
instructions, also known ascell manipulation instructionsor simplycell in-
structions. They correspond to memory access instructions of other archi-
tectures.

3.2.1. Classes of cell manipulation instructions. The TVM cell in-
structions are naturally subdivided into two principal classes:

- Cell creation instructions or serialization instructions, used to con-
    struct new cells from values previously kept in the stack and previously
    constructed cells.
- Cell parsing instructionsordeserialization instructions, used to extract
    data previously stored into cells by cell creation instructions.

Additionally, there areexotic cell instructions used to create and inspect
exotic cells (cf. 3.1.2), which in particular are used to represent pruned
branches of Merkle proofs and Merkle proofs themselves.

3.2.2.Builder and Slicevalues. Cell creation instructions usually work
withBuilder values, which can be kept only in the stack (cf.1.1.3). Such
values represent partially constructed cells, for which fast operations for ap-
pending bitstrings, integers, other cells, and references to other cells can be
defined. Similarly, cell parsing instructions make heavy use ofSlicevalues,
which represent either the remainder of a partially parsed cell, or a value
(subcell) residing inside such a cell and extracted from it by a parsing in-
struction.


```
3.2. Data manipulation instructions and cells
```
3.2.3.BuilderandSlicevalues exist only as stack values.Notice that
BuilderandSliceobjects appear only as values in a TVM stack. They cannot
be stored in “memory” (i.e., trees of cells) or “persistent storage” (which is
also a bag of cells). In this sense, there are far moreCellobjects thanBuilder
orSliceobjects in a TVM environment, but, somewhat paradoxically, a TVM
program seesBuilderandSliceobjects in its stack more often thanCells. In
fact, a TVM program does not have much use forCellvalues, because they
are immutable and opaque; all cell manipulation primitives require that a
Cellvalue be transformed into either aBuilderor aSlicefirst, before it can
be modified or inspected.

3.2.4. TVM has no separateBitstring value type. Notice that TVM
offers no separate bitstring value type. Instead, bitstrings are represented by
Slices that happen to have no references at all, but can still contain up to
1023 data bits.

3.2.5. Cells and cell primitives are bit-oriented, not byte-oriented.
An important point is thatTVM regards data kept in cells as sequences
(strings, streams) of (up to 1023) bits, not of bytes. In other words, TVM
is abit-oriented machine, not a byte-oriented machine. If necessary, an ap-
plication is free to use, say, 21-bit integer fields inside records serialized into
TVM cells, thus using fewer persistent storage bytes to represent the same
data.

3.2.6. Taxonomy of cell creation (serialization) primitives.Cell cre-
ation primitives usually accept aBuilder argument and an argument rep-
resenting the value to be serialized. Additional arguments controlling some
aspects of the serialization process (e.g., how many bits should be used for
serialization) can be also provided, either in the stack or as an immediate
value inside the instruction. The result of a cell creation primitive is usually
anotherBuilder, representing the concatenation of the original builder and
the serialization of the value provided.
Therefore, one can suggest a classification of cell serialization primitives
according to the answers to the following questions:

- Which is the type of values being serialized?
- How many bits are used for serialization? If this is a variable number,
    does it come from the stack, or from the instruction itself?


```
3.2. Data manipulation instructions and cells
```
- What happens if the value does not fit into the prescribed number of
    bits? Is an exception generated, or is a success flag equal to zero silently
    returned in the top of stack?
- What happens if there is insufficient space left in theBuilder? Is an
    exception generated, or is a zero success flag returned along with the
    unmodified originalBuilder?

The mnemonics of cell serialization primitives usually begin withST. Subse-
quent letters describe the following attributes:

- The type of values being serialized and the serialization format (e.g.,I
    for signed integers,Ufor unsigned integers).
- The source of the field width in bits to be used (e.g., Xfor integer
    serialization instructions means that the bit width n is supplied in
    the stack; otherwise it has to be embedded into the instruction as an
    immediate value).
- The action to be performed if the operation cannot be completed (by
    default, an exception is generated; “quiet” versions of serialization in-
    structions are marked by aQletter in their mnemonics).

This classification scheme is used to create a more complete taxonomy of cell
serialization primitives, which can be found inA.7.1.

3.2.7. Integer serialization primitives. Integer serialization primitives
can be classified according to the above taxonomy as well. For example:

- There are signed and unsigned (big-endian) integer serialization prim-
    itives.
- The sizenof the bit field to be used ( 1 ≤n≤ 257 for signed integers,
    0 ≤n≤ 256 for unsigned integers) can either come from the top of
    stack or be embedded into the instruction itself.
- If the integerxto be serialized is not in the range− 2 n−^1 ≤x < 2 n−^1
    (for signed integer serialization) or 0 ≤x < 2 n (for unsigned integer
    serialization), a range check exception is usually generated, and ifnbits
    cannot be stored into the providedBuilder, a cell overflow exception is
    generated.


```
3.2. Data manipulation instructions and cells
```
- Quiet versions of serialization instructions do not throw exceptions;
    instead, they push-1on top of the resultingBuilderupon success, or
    return the originalBuilderwith 0 on top of it to indicate failure.

Integer serialization instructions have mnemonics likeSTU 20(“store an
unsigned 20-bit integer value”) orSTIXQ(“quietly store an integer value of
variable length provided in the stack”). The full list of these instructions—
including their mnemonics, descriptions, and opcodes—is provided inA.7.1.

3.2.8. Integers in cells are big-endian by default. Notice that the
default order of bits inIntegers serialized intoCells isbig-endian, not little-
endian.^14 In this respectTVM is a big-endian machine. However, this affects
only the serialization of integers inside cells. The internal representation of
theInteger value type is implementation-dependent and irrelevant for the
operation of TVM. Besides, there are some special primitives such asSTULE
for (de)serializing little-endian integers, which must be stored into an integral
number of bytes (otherwise “little-endianness” does not make sense, unless
one is also willing to revert the order of bits inside octets). Such primitives are
useful for interfacing with the little-endian world—for instance, for parsing
custom-format messages arriving to a TON Blockchain smart contract from
the outside world.

3.2.9. Other serialization primitives.Other cell creation primitives seri-
alize bitstrings (i.e., cell slices without references), either taken from the stack
or supplied as literal arguments; cell slices (which are concatenated to the
cell builder in an obvious way); otherBuilders (which are also concatenated);
and cell references (STREF).

3.2.10. Other cell creation primitives. In addition to the cell serial-
ization primitives for certain built-in value types described above, there are
simple primitives that create a new emptyBuilderand push it into the stack
(NEWC), or transform aBuilder into a Cell (ENDC), thus finishing the cell
creation process. AnENDCcan be combined with aSTREFinto a single in-
structionENDCST, which finishes the creation of a cell and immediately stores
a reference to it in an “outer”Builder. There are also primitives that obtain
the quantity of data bits or references already stored in aBuilder, and check
how many data bits or references can be stored.

(^14) Negative numbers are represented using two’s complement. For instance, integer− 17
is serialized by instructionSTI 8into bitstringxEF.


```
3.2. Data manipulation instructions and cells
```
3.2.11. Taxonomy of cell deserialisation primitives. Cell parsing, or
deserialization, primitives can be classified as described in3.2.6, with the
following modifications:

- They work with Slices (representing the remainder of the cell being
    parsed) instead ofBuilders.
- They return deserialized values instead of accepting them as arguments.
- They may come in two flavors, depending on whether they remove the
    deserialized portion from theSlicesupplied (“fetch operations”) or leave
    it unmodified (“prefetch operations”).
- Their mnemonics usually begin withLD(orPLDfor prefetch operations)
    instead ofST.

For example, an unsigned big-endian 20-bit integer previously serialized into
a cell by aSTU 20instruction is likely to be deserialized later by a matching
LDU 20instruction.
Again, more detailed information about these instructions is provided
inA.7.2.

3.2.12. Other cell slice primitives.In addition to the cell deserialisation
primitives outlined above, TVM provides some obvious primitives for initial-
izing and completing the cell deserialization process. For instance, one can
convert aCell into aSlice (CTOS), so that its deserialisation might begin;
or check whether aSlice is empty, and generate an exception if it is not
(ENDS); or deserialize a cell reference and immediately convert it into aSlice
(LDREFTOS, equivalent to two instructionsLDREFandCTOS).

3.2.13. Modifying a serialized value in a cell.The reader might wonder
how the values serialized inside a cell may be modified. Suppose a cell con-
tains three serialized 29-bit integers,(x,y,z), representing the coordinates of
a point in space, and we want to replaceywithy′=y+ 1, leaving the other
coordinates intact. How would we achieve this?
TVM does not offer any ways to modify existing values (cf.2.3.4and
2.3.5), so our example can only be accomplished with a series of operations
as follows:

1. Deserialize the original cell into threeIntegersx,y,zin the stack (e.g.,
    byCTOS; LDI 29; LDI 29; LDI 29; ENDS).


### 3.3 Hashmaps, or dictionaries

2. Increaseyby one (e.g., bySWAP; INC; SWAP).
3. Finally, serialize the resultingIntegers into a new cell (e.g., byXCHG
    s2; NEWC; STI 29; STI 29; STI 29; ENDC).

3.2.14. Modifying the persistent storage of a smart contract.If the
TVM code wants to modify its persistent storage, represented by the tree of
cells rooted atc4, it simply needs to rewrite control registerc4by the root
of the tree of cells containing the new value of its persistent storage. (If only
part of the persistent storage needs to be modified, cf.3.2.13.)

### 3.3 Hashmaps, or dictionaries

Hashmaps, ordictionaries, are a specific data structure represented by a tree
of cells. Essentially, a hashmap represents a map fromkeys, which are bit-
strings of either fixed or variable length, intovaluesof an arbitrary typeX,
in such a way that fast lookups and modifications be possible. While any
such structure might be inspected or modified with the aid of generic cell se-
rialization and deserialization primitives, TVM introduces special primitives
to facilitate working with these hashmaps.

3.3.1. Basic hashmap types. The two most basic hashmap types pre-
defined in TVM areHashmapEn X orHashmapE(n,X), which represents
a partially defined map fromn-bit strings (calledkeys) for some fixed 0 ≤
n≤ 1023 intovaluesof some typeX, andHashmap(n,X), which is similar
toHashmapE(n,X)but is not allowed to be empty (i.e., it must contain at
least one key-value pair).
Other hashmap types are also available—for example, one with keys of
arbitrary length up to some predefined bound (up to 1023 bits).

3.3.2. Hashmaps as Patricia trees. The abstract representation of a
hashmap in TVM is aPatricia tree, or acompact binary trie. It is a binary
tree with edges labelled by bitstrings, such that the concatenation of all edge
labels on a path from the root to a leaf equals a key of the hashmap. The
corresponding value is kept in this leaf (for hashmaps with keys of fixed
length), or optionally in the intermediate vertices as well (for hashmaps with
keys of variable length). Furthermore, any intermediate vertex must have
two children, and the label of the left child must begin with a binary zero,
while the label of the right child must begin with a binary one. This enables
us not to store the first bit of the edge labels explicitly.


```
3.3. Hashmaps, or dictionaries
```
It is easy to see that any collection of key-value pairs (with distinct keys)
is represented by a unique Patricia tree.

3.3.3. Serialization of hashmaps. The serialization of a hashmap into a
tree of cells (or, more generally, into aSlice) is defined by the following TL-B
scheme:^15

bit#_ _:(## 1) = Bit;

hm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l n)
{n = (~m) + l} node:(HashmapNode m X) = Hashmap n X;

hmn_leaf#_ {X:Type} value:X = HashmapNode 0 X;
hmn_fork#_ {n:#} {X:Type} left:^(Hashmap n X)
right:^(Hashmap n X) = HashmapNode (n + 1) X;

hml_short$0 {m:#} {n:#} len:(Unary ~n)
s:(n * Bit) = HmLabel ~n m;
hml_long$10 {m:#} n:(#<= m) s:(n * Bit) = HmLabel ~n m;
hml_same$11 {m:#} v:Bit n:(#<= m) = HmLabel ~n m;

unary_zero$0 = Unary ~0;
unary_succ$1 {n:#} x:(Unary ~n) = Unary ~(n + 1);

hme_empty$0 {n:#} {X:Type} = HashmapE n X;
hme_root$1 {n:#} {X:Type} root:^(Hashmap n X) = HashmapE n X;

true#_ = True;
_ {n:#} _:(Hashmap n True) = BitstringSet n;

3.3.4. Brief explanation of TL-B schemes. A TL-B scheme, like the
one above, includes the following components.
The right-hand side of each “equation” is a type, either simple (such as
BitorTrue) or parametrized (such asHashmap n X). The parameters of a
type must be either natural numbers (i.e., non-negative integers, which are
required to fit into 32 bits in practice), such asninHashmap n X, or other
types, such asXinHashmap n X.

(^15) A description of an older version of TL may be found athttps://core.telegram.
org/mtproto/TL.


```
3.3. Hashmaps, or dictionaries
```
The left-hand side of each equation describes a way to define, or even to
serialize, a value of the type indicated in the right-hand side. Such a descrip-
tion begins with the name of aconstructor, such ashm_edgeorhml_long,
immediately followed by an optionalconstructor tag, such as#_or$10, which
describes the bitstring used to encode (serialize) the constructor in question.
Such tags may be given in either binary (after a dollar sign) or hexadecimal
notation (after a hash sign), using the conventions described in1.0. If a tag
is not explicitly provided, TL-B computes a default 32-bit constructor tag
by hashing the text of the “equation” defining this constructor in a certain
fashion. Therefore, empty tags must be explicitly provided by#_or$_. All
constructor names must be distinct, and constructor tags for the same type
must constitute a prefix code (otherwise the deserialization would not be
unique).
The constructor and its optional tag are followed byfield definitions. Each
field definition is of the formident:type-expr, whereidentis an identifier
with the name of the field^16 (replaced by an underscore for anonymous fields),
andtype-expris the field’s type. The type provided here is atype expression,
which may include simple types or parametrized types with suitable parame-
ters.Variables—i.e., the (identifiers of the) previously defined fields of types
#(natural numbers) orType(type of types)—may be used as parameters
for the parametrized types. The serialization process recursively serializes
each field according to its type, and the serialization of a value ultimately
consists of the concatenation of bitstrings representing the constructor (i.e.,
the constructor tag) and the field values.
Some fields may beimplicit. Their definitions are surrounded by curly
braces, which indicate that the field is not actually present in the serialization,
but that its value must be deduced from other data (usually the parameters
of the type being serialized).
Some occurrences of “variables” (i.e., already-defined fields) are prefixed
by a tilde. This indicates that the variable’s occurrence is used in the op-
posite way of the default behavior: in the left-hand side of the equation, it
means that the variable will be deduced (computed) based on this occurrence,
instead of substituting its previously computed value; in the right-hand side,
conversely, it means that the variable will not be deduced from the type being
serialized, but rather that it will be computed during the deserialization pro-

(^16) The field’s name is useful for representing values of the type being defined in human-
readable form, but it does not affect the binary serialization.


```
3.3. Hashmaps, or dictionaries
```
cess. In other words, a tilde transforms an “input argument” into an “output
argument”, and vice versa.^17
Finally, some equalities may be included in curly brackets as well. These
are certain “equations”, which must be satisfied by the “variables” included in
them. If one of the variables is prefixed by a tilde, its value will be uniquely
determined by the values of all other variables participating in the equation
(which must be known at this point) when the definition is processed from
the left to the right.
A caret (ˆ) preceding a typeXmeans that instead of serializing a value
of typeX as a bitstring inside the current cell, we place this value into a
separate cell, and add a reference to it into the current cell. ThereforeˆX
means “the type of references to cells containing values of typeX”.
Parametrized type#<= pwithp:#(this notation means “pof type#”,
i.e., a natural number) denotes the subtype of the natural numbers type
#, consisting of integers 0 ...p; it is serialized intodlog 2 (p+ 1)ebits as an
unsigned big-endian integer. Type#by itself is serialized as an unsigned
32-bit integer. Parametrized type## bwithb:#<= 31 is equivalent to#<=
2 b− 1 (i.e., it is an unsignedb-bit integer).

3.3.5. Application to the serialization of hashmaps. Let us explain
the net result of applying the general rules described in3.3.4to the TL-B
scheme presented in3.3.3.
Suppose we wish to serialize a value of typeHashmapEn X for some
integer 0 ≤n≤ 1023 and some typeX(i.e., a dictionary withn-bit keys
and values of typeX, admitting an abstract representation as a Patricia tree
(cf.3.3.2)).
First of all, if our dictionary is empty, it is serialized into a single binary 0 ,
which is the tag of nullary constructorhme_empty. Otherwise, its serialization
consists of a binary 1 (the tag ofhme_root), along with a reference to a cell
containing the serialization of a value of typeHashmapn X(i.e., a necessarily
non-empty dictionary).
The only way to serialize a value of typeHashmapn X is given by the
hm_edgeconstructor, which instructs us to serialize first the labellabelof
the edge leading to the root of the subtree under consideration (i.e., the com-
mon prefix of all keys in our (sub)dictionary). This label is of typeHmLabel
l⊥ n, which means that it is a bitstring of length at mostn, serialized in such
a way that the true lengthl of the label, 0 ≤l≤n, becomes known from

(^17) This is the “linear negation” operation(−)⊥of linear logic, hence our notation ̃.


```
3.3. Hashmaps, or dictionaries
```
the serialization of the label. (This special serialization method is described
separately in3.3.6.)
The label must be followed by the serialization of anodeof typeHashmap-
Nodem X, wherem=n−l. It corresponds to a vertex of the Patricia tree,
representing a non-empty subdictionary of the original dictionary withm-bit
keys, obtained by removing from all the keys of the original subdictionary
their common prefix of lengthl.
Ifm= 0, a value of typeHashmapNode 0 Xis given by thehmn_leaf
constructor, which describes a leaf of the Patricia tree—or, equivalently, a
subdictionary with 0 -bit keys. A leaf simply consists of the corresponding
valueof typeXand is serialized accordingly.
On the other hand, ifm > 0 , a value of typeHashmapNode m X cor-
responds to a fork (i.e., an intermediate node) in the Patricia tree, and is
given by thehmn_forkconstructor. Its serialization consists of leftand
right, two references to cells containing values of typeHashmap m− 1 X,
which correspond to the left and the right child of the intermediate node in
question—or, equivalently, to the two subdictionaries of the original dictio-
nary consisting of key-value pairs with keys beginning with a binary 0 or
a binary 1 , respectively. Because the first bit of all keys in each of these
subdictionaries is known and fixed, it is removed, and the resulting (neces-
sarily non-empty) subdictionaries are recursively serialized as values of type
Hashmap m− 1 X.

3.3.6. Serialization of labels. There are several ways to serialize a label
of length at mostn, if its exact length isl≤n(recall that the exact length
must be deducible from the serialization of the label itself, while the upper
boundnis known before the label is serialized or deserialized). These ways
are described by the three constructorshml_short,hml_long, andhml_same
of typeHmLabel l⊥ n:

- hml_short— Describes a way to serialize “short” labels, of small length
    l≤n. Such a serialization consists of a binary 0 (the constructor tag
    of hml_short), followed byl binary 1 s and one binary 0 (the unary
    representation of the lengthl), followed bylbits comprising the label
    itself.
- hml_long — Describes a way to serialize “long” labels, of arbitrary
    lengthl≤n. Such a serialization consists of a binary 10 (the construc-
    tor tag ofhml_long), followed by the big-endian binary representation


```
3.3. Hashmaps, or dictionaries
```
```
of the length 0 ≤l≤nindlog 2 (n+ 1)ebits, followed bylbits com-
prising the label itself.
```
- hml_same— Describes a way to serialize “long” labels, consisting ofl
    repetitions of the same bitv. Such a serialization consists of 11 (the
    constructor tag ofhml_same), followed by the bitv, followed by the
    lengthlstored indlog 2 (n+ 1)ebits as before.

Each label can always be serialized in at least two different fashions, using
hml_shortorhml_longconstructors. Usually the shortest serialization (and
in the case of a tie—the lexicographically smallest among the shortest) is
preferred and is generated by TVM hashmap primitives, while the other
variants are still considered valid.
This label encoding scheme has been designed to be efficient for dictio-
naries with “random” keys (e.g., hashes of some data), as well as for dic-
tionaries with “regular” keys (e.g., big-endian representations of integers in
some range).

3.3.7. An example of dictionary serialization. Consider a dictionary
with three 16-bit keys 13 , 17 , and 239 (considered as big-endian integers)
and corresponding 16-bit values 169 , 289 , and 57121.
In binary form:

0000000000001101 => 0000000010101001
0000000000010001 => 0000000100100001
0000000011101111 => 1101111100100001

The corresponding Patricia tree consists of a rootA, two intermediate
nodesBandC, and three leaf nodesD,E, andF, corresponding to 13, 17,
and 239, respectively. The rootAhas only one child,B; the label on the
edgeABis00000000 = 0^8. The nodeBhas two children: its left child is
an intermediate nodeCwith the edgeBClabelled by(0)00, while its right
child is the leafFwithBF labelled by(1)1101111. Finally,Chas two leaf
childrenDandE, withCDlabelled by(0)1101andCE—by(1)0001.
The corresponding value of typeHashmapE 16 (## 16)may be written
in human-readable form as:

(hme_root$1
root:^(hm_edge label:(hml_same$11 v:0 n:8) node:(hm_fork
left:^(hm_edge label:(hml_short$0 len:$110 s:$00)


```
3.3. Hashmaps, or dictionaries
```
```
node:(hm_fork
left:^(hm_edge label:(hml_long$10 n:4 s:$1101)
node:(hm_leaf value:169))
right:^(hm_edge label:(hml_long$10 n:4 s:$0001)
node:(hm_leaf value:289))))
right:^(hm_edge label:(hml_long$10 n:7 s:$1101111)
node:(hm_leaf value:57121)))))
```
The serialization of this data structure into a tree of cells consists of six
cells with the following binary data contained in them:

A := 1
A.0 := 11 0 01000
A.0.0 := 0 110 00
A.0.0.0 := 10 100 1101 0000000010101001
A.0.0.1 := 10 100 0001 0000000100100001
A.0.1 := 10 111 1101111 1101111100100001

HereAis the root cell, A. 0 is the cell at the first reference ofA, A. 1 is
the cell at the second reference ofA, and so on. This tree of cells can be
represented more compactly using the hexadecimal notation described in1.0,
using indentation to reflect the tree-of-cells structure:

C_
C8
62_
A68054C_
A08090C_
BEFDF21

A total of 93 data bits and 5 references in 6 cells have been used to serialize
this dictionary. Notice that a straightforward representation of three 16-
bit keys and their corresponding 16-bit values would already require 96 bits
(albeit without any references), so this particular serialization turns out to
be quite efficient.

3.3.8. Ways to describe the serialization of typeX. Notice that the
built-in TVM primitives for dictionary manipulation need to know something
about the serialization of typeX; otherwise, they would not be able to work
correctly withHashmap n X, because values of type X are immediately


```
3.3. Hashmaps, or dictionaries
```
contained in the Patricia tree leaf cells. There are several options available
to describe the serialization of typeX:

- The simplest case is whenX=ˆY for some other typeY. In this case
    the serialization ofXitself always consists of one reference to a cell,
    which in fact must contain a value of typeY, something that is not
    relevant for dictionary manipulation primitives.
- Another simple case is when the serialization of any value of typeX
    always consists of 0 ≤b≤ 1023 data bits and 0 ≤r≤ 4 references. In-
    tegersbandrcan then be passed to a dictionary manipulation primitive
    as a simple description ofX. (Notice that the previous case corresponds
    tob= 0,r= 1.)
- A more sophisticated case can be described by four integers 1 ≤b 0 ,b 1 ≤
    1023 , 0 ≤ r 0 ,r 1 ≤ 4 , withbi andri used when the first bit of the
    serialization equalsi. Whenb 0 =b 1 andr 0 =r 1 , this case reduces to
    the previous one.
- Finally, the most general description of the serialization of a typeX
    is given by asplitting function splitX forX, which accepts oneSlice
    parameters, and returns twoSlices,s′ ands′′, wheres′ is the only
    prefix of sthat is the serialization of a value of typeX, ands′′ is
    the remainder ofs. If no such prefix exists, the splitting function is
    expected to throw an exception. Notice that a compiler for a high-level
    language, which supports some or all algebraic TL-B types, is likely to
    automatically generate splitting functions for all types defined in the
    program.

3.3.9. A simplifying assumption on the serialization of X. One
may notice that values of typeXalways occupy the remaining part of an
hm_edge/hme_leafcell inside the serialization of aHashmapEn X. There-
fore, if we do not insist on strict validation of all dictionaries accessed, we
may assume that everything left unparsed in anhm_edge/hme_leafcell af-
ter deserializing itslabelis a value of typeX. This greatly simplifies the
creation of dictionary manipulation primitives, because in most cases they
turn out not to need any information aboutXat all.

3.3.10. Basic dictionary operations. Let us present a classification of
basic operations with dictionaries (i.e., valuesDof typeHashmapEn X):


```
3.3. Hashmaps, or dictionaries
```
- Get(D,k)— GivenD:HashmapE(n,X)and a keyk:n·bit, returns
    the corresponding valueD[k] :X?kept inD.
- Set(D,k,x)— GivenD:HashmapE(n,X), a keyk:n·bit, and a
    valuex:X, setsD′[k]toxin a copyD′ofD, and returns the resulting
    dictionaryD′(cf.2.3.4).
- Add(D,k,x)— Similar toSet, but adds the key-value pair(k,x)to
    Donly if keykis absent inD.
- Replace(D,k,x)— Similar toSet, but changesD′[k]toxonly if key
    kis already present inD.
- GetSet,GetAdd,GetReplace— Similar toSet,Add, andRe-
    place, respectively, but returns the old value ofD[k]as well.
- Delete(D,k)— Deletes key k from dictionaryD, and returns the
    resulting dictionaryD′.
- GetMin(D), GetMax(D)— Gets the minimal or maximal key k
    from dictionaryD, along with the associated valuex:X.
- RemoveMin(D),RemoveMax(D)— Similar toGetMinandGet-
    Max, but also removes the key in question from dictionary D, and
    returns the modified dictionaryD′. May be used to iterate over all
    elements ofD, effectively using (a copy of)Ditself as an iterator.
- GetNext(D,k)— Computes the minimal keyk′> k(ork′≥kin a
    variant) and returns it along with the corresponding valuex′:X. May
    be used to iterate over all elements ofD.
- GetPrev(D,k)— Computes the maximal keyk′< k(ork′≤kin a
    variant) and returns it along with the corresponding valuex′:X.
- Empty(n)— Creates an empty dictionaryD:HashmapE(n,X).
- IsEmpty(D)— Checks whether a dictionary is empty.
- Create(n,{(ki,xi)})— Givenn, creates a dictionary from a list(ki,xi)
    of key-value pairs passed in stack.


```
3.3. Hashmaps, or dictionaries
```
- GetSubdict(D,l,k 0 )— GivenD:HashmapE(n,X)and somel-bit
    stringk 0 :l·bitfor 0 ≤l≤n, returns subdictionaryD′=D/k 0 ofD,
    consisting of keys beginning withk 0. The resultD′ may be of either
    typeHashmapE(n,X)or typeHashmapE(n−l,X).
- ReplaceSubdict(D,l,k 0 ,D′)— GivenD : HashmapE(n,X), 0 ≤
    l ≤ n, k 0 : l·bit, andD′ :HashmapE(n−l,X), replaces with D′
    the subdictionaryD/k 0 ofDconsisting of keys beginning withk 0 , and
    returns the resulting dictionaryD′′:HashmapE(n,X). Some variants
    ofReplaceSubdictmay also return the old value of the subdictionary
    D/k 0 in question.
- DeleteSubdict(D,l,k 0 )— Equivalent toReplaceSubdictwithD′
    being an empty dictionary.
- Split(D) — Given D : HashmapE(n,X), returnsD 0 := D/ 0 and
    D 1 :=D/1 :HashmapE(n− 1 ,X), the two subdictionaries ofDcon-
    sisting of all keys beginning with 0 and 1 , respectively.
- Merge(D 0 ,D 1 )— GivenD 0 andD 1 :HashmapE(n− 1 ,X), computes
    D:HashmapE(n,X), such thatD/0 =D 0 andD/1 =D 1.
- Foreach(D,f)— Executes a functionf with two argumentskand
    x, with(k,x)running over all key-value pairs of a dictionary D in
    lexicographical order.^18
- ForeachRev(D,f)— Similar to Foreach, but processes all key-
    value pairs in reverse order.
- TreeReduce(D,o,f,g)— GivenD:HashmapE(n,X), a valueo:X,
    and two functionsf :X→Y andg:Y×Y →Y, performs a “tree
    reduction” ofDby first applyingf to all the leaves, and then usingg
    to compute the value corresponding to a fork starting from the values
    assigned to its children.^19

(^18) In fact,fmay receivemextra arguments and returnmmodified values, which are
passed to the next invocation off. This may be used to implement “map” and “reduce”
operations with dictionaries.
(^19) Versions of this operation may be introduced wheref andgreceive an additional
bitstring argument, equal to the key (for leaves) or to the common prefix of all keys (for
forks) in the corresponding subtree.


### 3.4 Hashmaps with variable-length keys

3.3.11. Taxonomy of dictionary primitives.The dictionary primitives,
described in detail inA.10, can be classified according to the following cat-
egories:

- Which dictionary operation (cf.3.3.10) do they perform?
- Are they specialized for the caseX=ˆY? If so, do they represent val-
    ues of typeY byCells or bySlices? (Generic versions always represent
    values of typeXasSlices.)
- Are the dictionaries themselves passed and returned as Cells or as
    Slices? (Most primitives represent dictionaries asSlices.)
- Is the key lengthnfixed inside the primitive, or is it passed in the
    stack?
- Are the keys represented bySlices, or by signed or unsignedIntegers?

In addition, TVM includes special serialization/deserialization primitives,
such asSTDICT,LDDICT, andPLDDICT. They can be used to extract a dictio-
nary from a serialization of an encompassing object, or to insert a dictionary
into such a serialization.

### 3.4 Hashmaps with variable-length keys

TVM provides some support for dictionaries, or hashmaps, with variable-
length keys, in addition to its support for dictionaries with fixed-length keys
(as described in3.3above).

3.4.1. Serialization of dictionaries with variable-length keys. The
serialization of aVarHashmapinto a tree of cells (or, more generally, into a
Slice) is defined by a TL-B scheme, similar to that described in3.3.3:

vhm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l n)
{n = (~m) + l} node:(VarHashmapNode m X)
= VarHashmap n X;
vhmn_leaf$00 {n:#} {X:Type} value:X = VarHashmapNode n X;
vhmn_fork$01 {n:#} {X:Type} left:^(VarHashmap n X)
right:^(VarHashmap n X) value:(Maybe X)
= VarHashmapNode (n + 1) X;
vhmn_cont$1 {n:#} {X:Type} branch:bit child:^(VarHashmap n X)


```
3.4. Hashmaps with variable-length keys
```
```
value:X = VarHashmapNode (n + 1) X;
```
nothing$0 {X:Type} = Maybe X;
just$1 {X:Type} value:X = Maybe X;

vhme_empty$0 {n:#} {X:Type} = VarHashmapE n X;
vhme_root$1 {n:#} {X:Type} root:^(VarHashmap n X)
= VarHashmapE n X;

3.4.2. Serialization of prefix codes.One special case of a dictionary with
variable-length keys is that of aprefix code, where the keys cannot be prefixes
of each other. Values in such dictionaries may occur only in the leaves of a
Patricia tree.
The serialization of a prefix code is defined by the following TL-B scheme:

phm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l n)
{n = (~m) + l} node:(PfxHashmapNode m X)
= PfxHashmap n X;

phmn_leaf$0 {n:#} {X:Type} value:X = PfxHashmapNode n X;
phmn_fork$1 {n:#} {X:Type} left:^(PfxHashmap n X)
right:^(PfxHashmap n X) = PfxHashmapNode (n + 1) X;

phme_empty$0 {n:#} {X:Type} = PfxHashmapE n X;
phme_root$1 {n:#} {X:Type} root:^(PfxHashmap n X)
= PfxHashmapE n X;


### 4.1 Continuations and subroutines

## 4 Control flow, continuations, and exceptions

This chapter describescontinuations, which may represent execution tokens
and exception handlers in TVM. Continuations are deeply involved with the
control flow of a TVM program; in particular, subroutine calls and condi-
tional and iterated execution are implemented in TVM using special primi-
tives that accept one or more continuations as their arguments.
We conclude this chapter with a discussion of the problem of recursion
and of families of mutually recursive functions, exacerbated by the fact that
cyclic references are not allowed in TVM data structures (including TVM
code).

### 4.1 Continuations and subroutines

Recall (cf.1.1.3) thatContinuationvalues represent “execution tokens” that
can be executed later—for example, byEXECUTE=CALLX(“execute” or “call
indirect”) orJMPX(“jump indirect”) primitives. As such, the continuations
are responsible for the execution of the program, and are heavily used by
control flow primitives, enabling subroutine calls, conditional expressions,
loops, and so on.

4.1.1. Ordinary continuations.The most common kind of continuations
are theordinary continuations, containing the following data:

- ASlice code(cf.1.1.3and3.2.2), containing (the remainder of) the
    TVM code to be executed.
- A (possibly empty)Stack stack, containing the original contents of
    the stack for the code to be executed.
- A (possibly empty) listsaveof pairs(c(i),vi)(also called “savelist”),
    containing the values of control registers to be restored before the ex-
    ecution of the code.
- A 16-bit integer valuecp, selecting the TVM codepage used to interpret
    the TVM code fromcode.
- An optional non-negative integernargs, indicating the number of ar-
    guments expected by the continuation.


```
4.1. Continuations and subroutines
```
4.1.2. Simple ordinary continuations. In most cases, the ordinary con-
tinuations are the simplest ones, having emptystackandsave. They consist
essentially of a referencecodeto (the remainder of) the code to be executed,
and of the codepagecpto be used while decoding the instructions from this
code.

4.1.3. Current continuationcc.The “current continuation”ccis an im-
portant part of the total state of TVM, representing the code being executed
right now (cf.1.1). In particular, what we call “the current stack” (or simply
“the stack”) when discussing all other primitives is in fact the stack of the
current continuation. All other components of the total state of TVM may
be also thought of as parts of the current continuationcc; however, they
may be extracted from the current continuation and kept separately as part
of the total state for performance reasons. This is why we describe the stack,
the control registers, and the codepage as separate parts of the TVM state
in1.4.

4.1.4. Normal work of TVM, or the main loop.TVM usually performs
the following operations:
If the current continuation cc is an ordinary one, it decodes the first
instruction from theSlicecode, similarly to the way other cells are deseri-
alized by TVMLD*primitives (cf.3.2and3.2.11): it decodes the opcode
first, and then the parameters of the instruction (e.g., 4-bit fields indicating
“stack registers” involved for stack manipulation primitives, or constant val-
ues for “push constant” or “literal” primitives). The remainder of theSlice
is then put into thecodeof the newcc, and the decoded operation is exe-
cuted on the current stack. This entire process is repeated until there are no
operations left incc.code.
If thecodeis empty (i.e., contains no bits of data and no references), or if
a (rarely needed) explicit subroutine return (RET) instruction is encountered,
the current continuation is discarded, and the “return continuation” from
control registerc0 is loaded into cc instead (this process is discussed in
more detail starting in4.1.6).^20 Then the execution continues by parsing
operations from the new current continuation.

4.1.5. Extraordinary continuations.In addition to the ordinary continu-
ations considered so far (cf.4.1.1), TVM includes someextraordinary contin-

(^20) If there are no bits of data left incode, but there is still exactly one reference, an
implicitJMPto the cell at that reference is performed instead of an implicitRET.


```
4.1. Continuations and subroutines
```
uations, representing certain less common states. Examples of extraordinary
continuations include:

- The continuationec_quitwith its parameter set to zero, which rep-
    resents the end of the work of TVM. This continuation is the original
    value ofc0when TVM begins executing the code of a smart contract.
- The continuationec_until, which contains references to two other
    continuations (ordinary or not) representing the body of the loop being
    executed and the code to be executed after the loop.

Execution of an extraordinary continuation by TVM depends on its specific
class, and differs from the operations for ordinary continuations described in
4.1.4.^21

4.1.6. Switching to another continuation: JMPandRET.The process of
switching to another continuationcmay be performed by such instructions
asJMPX(which takescfrom the stack) orRET (which usesc0 asc). This
process is slightly more complex than simply setting the value ofcc toc:
before doing this, either all values or the topnvalues in the current stack
are moved to the stack of the continuationc, and only then is the remainder
of the current stack discarded.
If all values need to be moved (the most common case), and if the con-
tinuation chas an empty stack (also the most common case; notice that
extraordinary continuations are assumed to have an empty stack), then the
new stack ofcequals the stack of the current continuation, so we can simply
transfer the current stack in its entirety toc. (If we keep the current stack
as a separate part of the total state of TVM, we have to do nothing at all.)

4.1.7. Determining the numbernof arguments passed to the next
continuationc. By default,nequals the depth of the current stack. How-
ever, ifchas an explicit value ofnargs(number of arguments to be provided),
thennis computed asn′, equal toc.nargsminus the current depth ofc’s
stack.
Furthermore, there are special forms of JMPXandRET that provide an
explicit valuen′′, the number of parameters from the current stack to be
passed to continuationc. Ifn′′is provided, it must be less than or equal to

(^21) Technically, TVM may simply invoke a virtual methodrun()of the continuation
currently incc.


```
4.1. Continuations and subroutines
```
the depth of the current stack, or else a stack underflow exception occurs. If
bothn′andn′′are provided, we must haven′≤n′′, in which casen=n′is
used. Ifn′′is provided andn′is not, thenn=n′′is used.
One could also imagine that the default value ofn′′equals the depth of
the original stack, and thatn′′values are always removed from the top of
the original stack even if onlyn′of them are actually moved to the stack of
the next continuationc. Even though the remainder of the current stack is
discarded afterwards, this description will become useful later.

4.1.8. Restoring control registers from the new continuationc.After
the new stack is computed, the values of control registers present inc.save
are restored accordingly, and the current codepagecp is also set to c.cp.
Only then does TVM setccequal to the newcand begin its execution.^22

4.1.9. Subroutine calls: CALLXor EXECUTEprimitives. The execution
of continuations as subroutines is slightly more complicated than switching
to continuations.
Consider theCALLXorEXECUTEprimitive, which takes a continuationc
from the (current) stack and executes it as a subroutine.
Apart from doing the stack manipulations described in4.1.6and4.1.7
and setting the new control registers and codepage as described in4.1.8,
these primitives perform several additional steps:

1. After the topn′′values are removed from the current stack (cf.4.1.7),
    the (usually empty) remainder is not discarded, but instead is stored
    in the (old) current continuationcc.
2. The old value of the special registerc0is saved into the (previously
    empty) savelistcc.save.
3. The continuationccthus modified is not discarded, but instead is set
    as the newc0, which performs the role of “next continuation” or “return
    continuation” for the subroutine being called.
4. After that, the switching toccontinues as before. In particular, some
    control registers are restored fromc.save, potentially overwriting the
    value ofc0set in the previous step. (Therefore, a good optimization
    would be to check thatc 0 is present inc.savefrom the very beginning,
    and skip the three previous steps as useless in this case.)

(^22) The already used savelistcc.saveof the newccis emptied before the execution starts.


### 4.2 Control flow primitives: conditional and iterated execution

In this way, the called subroutine can return control to the caller by
switching the current continuation to the return continuation saved inc0.
Nested subroutine calls work correctly because the previous value ofc0ends
up saved into the newc0’s control register savelistc0.save, from which it is
restored later.

4.1.10. Determining the number of arguments passed to and/or
return values accepted from a subroutine.Similarly toJMPXandRET,
CALLXalso has special (rarely used) forms, which allow us to explicitly specify
the numbern′′ of arguments passed from the current stack to the called
subroutine (by default,n′′equals the depth of the current stack, i.e., it is
passed in its entirety). Furthermore, a second numbern′′′can be specified,
used to setnargsof the modifiedcccontinuation before storing it into the
newc0; the newnargsequals the depth of the old stack minusn′′plusn′′′.
This means that the caller is willing to pass exactlyn′′arguments to the
called subroutine, and is willing to accept exactlyn′′′results in their stead.
Such forms ofCALLXandRETare mostly intended for library functions
that accept functional arguments and want to invoke them safely. Another
application is related to the “virtualization support” of TVM, which enables
TVM code to run other TVM code inside a “virtual TVM machine”. Such
virtualization techniques might be useful for implementing sophisticated pay-
ment channels in the TON Blockchain (cf. [1, 5]).

4.1.11.CALLCC: call with current continuation. Notice that TVM sup-
ports a form of the “call with current continuation” primitive. Namely, prim-
itiveCALLCCis similar toCALLXorJMPXin that it takes a continuationcfrom
the stack and switches to it; however,CALLCCdoes not discard the previous
current continuationc′(asJMPXdoes) and does not writec′toc0(asCALLX
does), but rather pushesc′into the (new) stack as an extra argument toc.
The primitiveJMPXDATAdoes a similar thing, but pushes only the (remainder
of the) code of the previous current continuation as aSlice.

### 4.2 Control flow primitives: conditional and iterated

### execution

4.2.1. Conditional execution: IF,IFNOT,IFELSE.An important modifi-
cation ofEXECUTE(orCALLX) consists in its conditional forms. For example,
IFaccepts an integerxand a continuationc, and executesc(in the same


```
4.2. Control flow primitives: conditional and iterated execution
```
way asEXECUTE would do it) only ifxis non-zero; otherwise both values
are simply discarded from the stack. Similarly,IFNOTacceptsxandc, but
executesconly ifx= 0. Finally,IFELSEacceptsx,c, andc′, removes these
values from the stack, and executescifx 6 = 0orc′ifx= 0.

4.2.2. Iterated execution and loops. More sophisticated modifications
ofEXECUTEinclude:

- REPEAT— Takes an integernand a continuationc, and executesc n
    times.^23
- WHILE— Takesc′ andc′′, executesc′, and then takes the top valuex
    from the stack. Ifxis non-zero, it executesc′′and then begins a new
    loop by executingc′again; ifxis zero, it stops.
- UNTIL— Takesc, executes it, and then takes the top integerxfrom
    the stack. Ifxis zero, a new iteration begins; ifxis non-zero, the
    previously executed code is resumed.

4.2.3. Constant, or literal, continuations. We see that we can create
arbitrarily complex conditional expressions and loops in the TVM code, pro-
vided we have a means to push constant continuations into the stack. In fact,
TVM includes special versions of “literal” or “constant” primitives that cut
the nextnbytes or bits from the remainder of the current codecc.codeinto
a cell slice, and then push it into the stack not as aSlice(as aPUSHSLICE
does) but as a simple ordinaryContinuation(which has onlycodeandcp).
The simplest of these primitives is PUSHCONT, which has an immediate
argumentndescribing the number of subsequent bytes (in a byte-oriented
version of TVM) or bits to be converted into a simple continuation. Another
primitive isPUSHREFCONT, which removes the first cell reference from the
current continuationcc.code, converts the cell referred to into a cell slice,
and finally converts the cell slice into a simple continuation.

4.2.4. Constant continuations combined with conditional or iter-
ated execution primitives.Because constant continuations are very often
used as arguments to conditional or iterated execution primitives, combined

(^23) The implementation ofREPEATinvolves an extraordinary continuation that remembers
the remaining number of iterations, the body of the loopc, and the return continuation
c′. (The latter term represents the remainder of the body of the function that invoked
REPEAT, which would be normally stored inc0of the newcc.)


### 4.3 Operations with continuations

versions of these primitives (e.g.,IFCONTorUNTILREFCONT) may be defined
in a future revision of TVM, which combine aPUSHCONTor PUSHREFCONT
with another primitive. If one inspects the resulting code,IFCONTlooks very
much like the more customary “conditional-branch-forward” instruction.

### 4.3 Operations with continuations

4.3.1. Continuations are opaque.Notice that all continuations areopaque,
at least in the current version of TVM, meaning that there is no way to
modify a continuation or inspect its internal data. Almost the only use of a
continuation is to supply it to a control flow primitive.
While there are some arguments in favor of including support for non-
opaque continuations in TVM (along with opaque continuations, which are
required for virtualization), the current revision offers no such support.

4.3.2. Allowed operations with continuations. However, some opera-
tions with opaque continuations are still possible, mostly because they are
equivalent to operations of the kind “create a new continuation, which will
do something special, and then invoke the original continuation”. Allowed
operations with continuations include:

- Push one or several values into the stack of a continuationc (thus
    creating a partial application of a function, or a closure).
- Set the saved value of a control registerc(i)inside the savelistc.save
    of a continuationc. If there is already a value for the control register
    in question, this operation silently does nothing.

4.3.3. Example: operations with control registers. TVM has some
primitives to set and inspect the values of control registers. The most impor-
tant of them arePUSH c(i)(pushes the current value ofc(i)into the stack)
andPOP c(i)(sets the value ofc(i)from the stack, if the supplied value is
of the correct type). However, there is also a modified version of the latter
instruction, calledPOPSAVE c(i), which saves the old value ofc(i)(fori > 0 )
into the continuation atc0as described in4.3.2before setting the new value.

4.3.4. Example: setting the number of arguments to a function in
its code. The primitiveLEAVEARGS ndemonstrates another application of
continuations in an operation: it leaves only the topnvalues of the cur-
rent stack, and moves the remainder to the stack of the continuation inc0.


```
4.3. Operations with continuations
```
This primitive enables a called function to “return” unneeded arguments to
its caller’s stack, which is useful in some situations (e.g., those related to
exception handling).

4.3.5. Boolean circuits. A continuationcmay be thought of as a piece
of code with two optional exit points kept in the savelist ofc: the principal
exit point given byc.c0 :=c.save(c0), and the auxiliary exit point given
byc.c1:=c.save(c1). If executed, a continuation performs whatever action
it was created for, and then (usually) transfers control to the principal exit
point, or, on some occasions, to the auxiliary exit point. We sometimes say
that a continuationcwith both exit pointsc.c0andc.c1defined is atwo-exit
continuation, or aboolean circuit, especially if the choice of the exit point
depends on some internally-checked condition.

4.3.6. Composition of continuations. One cancompose two continu-
ationsc andc′ simply by settingc.c0 or c.c1 to c′. This creates a new
continuation denoted byc◦ 0 c′orc◦ 1 c′, which differs fromcin its savelist.
(Recall that if the savelist ofcalready has an entry corresponding to the con-
trol register in question, such an operation silently does nothing as explained
in4.3.2).
By composing continuations, one can build chains or other graphs, pos-
sibly with loops, representing the control flow. In fact, the resulting graph
resembles a flow chart, with the boolean circuits corresponding to the “con-
dition nodes” (containing code that will transfer control either toc0or toc1
depending on some condition), and the one-exit continuations corresponding
to the “action nodes”.

4.3.7. Basic continuation composition primitives. Two basic primi-
tives for composing continuations areCOMPOS(also known asSETCONT c0and
BOOLAND) andCOMPOSALT(also known asSETCONT c1andBOOLOR), which
takecandc′ from the stack, setc.c0orc.c1 toc′, and return the result-
ing continuationc′′=c◦ 0 c′ orc◦ 1 c′. All other continuation composition
operations can be expressed in terms of these two primitives.

4.3.8. Advanced continuation composition primitives.However, TVM
can compose continuations not only taken from stack, but also taken from
c0orc1, or from the current continuationcc; likewise, the result may be
pushed into the stack, stored into eitherc0orc1, or used as the new current
continuation (i.e., the control may be transferred to it). Furthermore, TVM


### 4.4 Continuations as objects

can define conditional composition primitives, performing some of the above
actions only if an integer value taken from the stack is non-zero.
For instance,EXECUTEcan be described ascc←c◦ 0 cc, with continuation
ctaken from the original stack. Similarly,JMPXiscc ←c, andRET(also
known asRETTRUEin a boolean circuit context) iscc←c0. Other interesting
primitives includeTHENRET(c′←c◦ 0 c0) andATEXIT(c0←c◦ 0 c0).
Finally, some “experimental” primitives also involvec1and◦ 1. For ex-
ample:

- RETALTorRETFALSEdoescc←c1.
- Conditional versions ofRETandRETALTmay also be useful: RETBOOL
    takes an integer xfrom the stack, and performsRETTRUE ifx 6 = 0,
    RETFALSEotherwise.
- INVERTdoesc0↔c1; if the two continuations inc0andc1represent
    the two branches we should select depending on some boolean expres-
    sion,INVERTnegates this expression on the outer level.
- INVERTCONTdoesc.c0↔c.c1to a continuationctaken from the stack.
- Variants ofATEXITincludeATEXITALT(c1←c◦ 1 c1) andSETEXITALT
    (c1←(c◦ 0 c0)◦ 1 c1).
- BOOLEVALtakes a continuationcfrom the stack and doescc←

#### (

```
(c◦ 0
(PUSH− 1 ))◦ 1 (PUSH0)
```
#### )

```
◦ 0 cc. Ifcrepresents a boolean circuit, the net
effect is to evaluate it and push either− 1 or 0 into the stack before
continuing.
```
### 4.4 Continuations as objects

4.4.1. Representing objects using continuations.Object-oriented pro-
gramming in Smalltalk (or Objective C) style may be implemented with the
aid of continuations. For this, an object is represented by a special continu-
ationo. If it has any data fields, they can be kept in the stack ofo, making
oa partial application (i.e., a continuation with a non-empty stack).
When somebody wants to invoke a methodmofowith argumentsx 1 ,x 2 ,

... ,xn, she pushes the arguments into the stack, then pushes a magic number
corresponding to the methodm, and then executesopassingn+1arguments
(cf.4.1.10). Thenouses the top-of-stack integermto select the branch with


### 4.5 Exception handling

the required method, and executes it. Ifoneeds to modify its state, it simply
computes a new continuationo′of the same sort (perhaps with the same code
aso, but with a different initial stack). The new continuationo′is returned
to the caller along with whatever other return values need to be returned.

4.4.2. Serializable objects. Another way of representing Smalltalk-style
objects as continuations, or even as trees of cells, consists in using the
JMPREFDATAprimitive (a variant ofJMPXDATA, cf.4.1.11), which takes the
first cell reference from the code of the current continuation, transforms the
cell referred to into a simple ordinary continuation, and transfers control to
it, first pushing the remainder of the current continuation as aSliceinto the
stack. In this way, an object might be represented by a cello ̃that contains
JMPREFDATAat the beginning of its data, and the actual code of the object
in the first reference (one might say that the first reference of cello ̃is the
classof objecto ̃). Remaining data and references of this cell will be used for
storing the fields of the object.
Such objects have the advantage of being trees of cells, and not just
continuations, meaning that they can be stored into the persistent storage of
a TON smart contract.

4.4.3. Unique continuations and capabilities. It might make sense (in
a future revision of TVM) to mark some continuations asunique, meaning
that they cannot be copied, even in a delayed manner, by increasing their
reference counter to a value greater than one. If an opaque continuation is
unique, it essentially becomes acapability, which can either be used by its
owner exactly once or be transferred to somebody else.
For example, imagine a continuation that represents the output stream to
a printer (this is an example of a continuation used as an object, cf.4.4.1).
When invoked with one integer argumentn, this continuation outputs the
character with code n to the printer, and returns a new continuation of
the same kind reflecting the new state of the stream. Obviously, copying
such a continuation and using the two copies in parallel would lead to some
unintended side effects; marking it as unique would prohibit such adverse
usage.

### 4.5 Exception handling

TVM’s exception handling is quite simple and consists in a transfer of control
to the continuation kept in control registerc2.


```
4.5. Exception handling
```
4.5.1. Two arguments of the exception handler: exception param-
eter and exception number. Every exception is characterized by two
arguments: theexception number(anInteger) and theexception parameter
(any value, most often a zeroInteger). Exception numbers 0–31 are reserved
for TVM, while all other exception numbers are available for user-defined
exceptions.

4.5.2. Primitives for throwing an exception. There are several spe-
cial primitives used for throwing an exception. The most general of them,
THROWANY, takes two arguments, vand 0 ≤n < 216 , from the stack, and
throws the exception with numbern and valuev. There are variants of
this primitive that assumevto be a zero integer, storenas a literal value,
and/or are conditional on an integer value taken from the stack. User-defined
exceptions may use arbitrary values asv(e.g., trees of cells) if needed.

4.5.3. Exceptions generated by TVM.Of course, some exceptions are
generated by normal primitives. For example, an arithmetic overflow excep-
tion is generated whenever the result of an arithmetic operation does not fit
into a signed 257-bit integer. In such cases, the arguments of the exception,
vandn, are determined by TVM itself.

4.5.4. Exception handling. The exception handling itself consists in a
control transfer to the exception handler—i.e., the continuation specified in
control register c2, with v andn supplied as the two arguments to this
continuation, as if aJMPtoc2had been requested withn′′= 2arguments
(cf.4.1.7and4.1.6). As a consequence,vandnend up in the top of the
stack of the exception handler. The remainder of the old stack is discarded.
Notice that if the continuation inc2has a value forc2in its savelist, it
will be used to set up the new value ofc2before executing the exception
handler. In particular, if the exception handler invokesTHROWANY, it will re-
throw the original exception with the restored value ofc2. This trick enables
the exception handler to handle only some exceptions, and pass the rest to
an outer exception handler.

4.5.5. Default exception handler.When an instance of TVM is created,
c2contains a reference to the “default exception handler continuation”, which
is anec_fatalextraordinary continuation (cf.4.1.5). Its execution leads
to the termination of the execution of TVM, with the argumentsvandn
of the exception returned to the outside caller. In the context of the TON
Blockchain,nwill be stored as a part of the transaction’s result.


```
4.5. Exception handling
```
4.5.6.TRYprimitive. ATRYprimitive can be used to implement C++-like
exception handling. This primitive accepts two continuations,candc′. It
stores the old value ofc2into the savelist ofc′, setsc2toc′, and executesc
just asEXECUTEwould, but additionally saving the old value ofc2into the
savelist of the newc0as well. Usually a version of theTRYprimitive with an
explicit number of argumentsn′′passed to the continuationcis used.
The net result is roughly equivalent to C++’s try {c } catch(...)
{ c′ }operator.

4.5.7. List of predefined exceptions. Predefined exceptions of TVM
correspond to exception numbersnin the range 0–31. They include:

- Normal termination(n= 0) — Should never be generated, but it is
    useful for some tricks.
- Alternative termination(n= 1) — Again, should never be generated.
- Stack underflow(n= 2) — Not enough arguments in the stack for a
    primitive.
- Stack overflow(n= 3) — More values have been stored on a stack than
    allowed by this version of TVM.
- Integer overflow(n= 4) — Integer does not fit into− 2256 ≤x < 2256 ,
    or a division by zero has occurred.
- Range check error(n= 5) — Integer out of expected range.
- Invalid opcode(n= 6) — Instruction or its immediate arguments can-
    not be decoded.
- Type check error(n= 7) — An argument to a primitive is of incorrect
    value type.
- Cell overflow(n= 8) — Error in one of the serialization primitives.
- Cell underflow(n= 9) — Deserialization error.
- Dictionary error(n = 10) — Error while deserializing a dictionary
    object.
- Unknown error(n= 11) — Unknown error, may be thrown by user
    programs.


### 4.6 Functions, recursion, and dictionaries

- Fatal error(n= 12) — Thrown by TVM in situations deemed impos-
    sible.
- Out of gas(n= 13) — Thrown by TVM when the remaining gas (gr)
    becomes negative. This exception usually cannot be caught and leads
    to an immediate termination of TVM.

Most of these exceptions have no parameter (i.e., use a zero integer instead).
The order in which these exceptions are checked is outlined below in4.5.8.

4.5.8. Order of stack underflow, type check, and range check ex-
ceptions. All TVM primitives first check whether the stack contains the
required number of arguments, generating a stack underflow exception if this
is not the case. Only then are the type tags of the arguments and their ranges
(e.g., if a primitive expects an argument not only to be anInteger, but also
to be in the range from 0 to 256) checked, starting from the value in the top
of the stack (the last argument) and proceeding deeper into the stack. If an
argument’s type is incorrect, a type-checking exception is generated; if the
type is correct, but the value does not fall into the expected range, a range
check exception is generated.
Some primitives accept a variable number of arguments, depending on the
values of some small fixed subset of arguments located near the top of the
stack. In this case, the above procedure is first run for all arguments from
this small subset. Then it is repeated for the remaining arguments, once
their number and types have been determined from the arguments already
processed.

### 4.6 Functions, recursion, and dictionaries

4.6.1. The problem of recursion.The conditional and iterated execution
primitives described in4.2—along with the unconditional branch, call, and
return primitives described in4.1— enable one to implement more or less
arbitrary code with nested loops and conditional expressions, with one no-
table exception: one can only create new constant continuations from parts
of the current continuation. (In particular, one cannot invoke a subroutine
from itself in this way.) Therefore, the code being executed—i.e., the current
continuation—gradually becomes smaller and smaller.^24

(^24) An important point here is that the tree of cells representing a TVM program cannot
have cyclic references, so usingCALLREFalong with a reference to a cell higher up the tree


```
4.6. Functions, recursion, and dictionaries
```
4.6.2.Y-combinator solution: pass a continuation as an argument
to itself. One way of dealing with the problem of recursion is by passing
a copy of the continuation representing the body of a recursive function as
an extra argument to itself. Consider, for example, the following code for a
factorial function:

71 PUSHINT 1
9C PUSHCONT {
22 PUSH s2
72 PUSHINT 2
B9 LESS
DC IFRET
59 ROTREV
21 PUSH s1
A8 MUL
01 SWAP
A5 DEC
02 XCHG s2
20 DUP
D9 JMPX
}
20 DUP
D8 EXECUTE
30 DROP
31 NIP

This roughly corresponds to defining an auxiliary functionbodywith three
argumentsn,x, andf, such thatbody(n,x,f)equalsxifn < 2 andf(n−
1 ,nx,f)otherwise, then invokingbody(n, 1 ,body)to compute the factorial
ofn. The recursion is then implemented with the aid of theDUP;EXECUTE
construction, orDUP;JMPXin the case of tail recursion. This trick is equivalent
to applyingY-combinator to a functionbody.

4.6.3. A variant ofY-combinator solution.Another way of recursively
computing the factorial, more closely following the classical recursive defini-
tion

```
fact(n) :=
```
#### {

```
1 ifn < 2 ,
n·fact(n−1) otherwise
```
#### (5)

would not work.


```
4.6. Functions, recursion, and dictionaries
```
is as follows:

9D PUSHCONT {
21 OVER
C102 LESSINT 2
92 PUSHCONT {
5B 2DROP
71 PUSHINT 1
}
E0 IFJMP
21 OVER
A5 DEC
01 SWAP
20 DUP
D8 EXECUTE
A8 MUL
}
20 DUP
D9 JMPX

This definition of the factorial function is two bytes shorter than the previous
one, but it uses general recursion instead of tail recursion, so it cannot be
easily transformed into a loop.

4.6.4. Comparison: non-recursive definition of the factorial func-
tion.Incidentally, a non-recursive definition of the factorial with the aid of
aREPEATloop is also possible, and it is much shorter than both recursive
definitions:

71 PUSHINT 1
01 SWAP
20 DUP
94 PUSHCONT {
66 TUCK
A8 MUL
01 SWAP
A5 DEC
}
E4 REPEAT
30 DROP


```
4.6. Functions, recursion, and dictionaries
```
4.6.5. Several mutually recursive functions. If one has a collection
f 1 ,... , fnof mutually recursive functions, one can use the same trick by
passing the whole collection of continuations{fi}in the stack as an extra
narguments to each of these functions. However, asngrows, this becomes
more and more cumbersome, since one has to reorder these extra arguments
in the stack to work with the “true” arguments, and then push their copies
into the top of the stack before any recursive call.

4.6.6. Combining several functions into one tuple. One might also
combine a collection of continuations representing functionsf 1 ,... ,fninto
a “tuple”f := (f 1 ,...,fn), and pass this tuple as one stack elementf. For
instance, whenn≤ 4 , each function can be represented by a cellf ̃i(along
with the tree of cells rooted in this cell), and the tuple may be represented by
a cell ̃f, which has references to its component cellsf ̃i. However, this would
lead to the necessity of “unpacking” the needed component from this tuple
before each recursive call.

4.6.7. Combining several functions into a selector function.Another
approach is to combine several functionsf 1 ,... ,fninto one “selector func-
tion” f, which takes an extra argumenti, 1 ≤ i≤n, from the top of the
stack, and invokes the appropriate functionfi. Stack machines such as TVM
are well-suited to this approach, because they do not require the functionsfi
to have the same number and types of arguments. Using this approach, one
would need to pass only one extra argument,f, to each of these functions,
and push into the stack an extra argumentibefore each recursive call tof
to select the correct function to be called.

4.6.8. Using a dedicated register to keep the selector function.How-
ever, even if we use one of the two previous approaches to combine all func-
tions into one extra argument, passing this argument to all mutually recursive
functions is still quite cumbersome and requires a lot of additional stack ma-
nipulation operations. Because this argument changes very rarely, one might
use a dedicated register to keep it and transparently pass it to all functions
called. This is the approach used by TVM by default.

4.6.9. Special registerc3for the selector function.In fact, TVM uses
a dedicated registerc3to keep the continuation representing the current or
global “selector function”, which can be used to invoke any of a family of
mutually recursive functions. Special primitivesCALL nnorCALLDICT nn


```
4.6. Functions, recursion, and dictionaries
```
(cf.A.8.7) are equivalent toPUSHINT nn;PUSH c3;EXECUTE, and similarly
JMP nn orJMPDICT nnare equivalent toPUSHINT nn; PUSH c3; JMPX. In
this way a TVM program, which ultimately is a large collection of mutually
recursive functions, may initializec3with the correct selector function rep-
resenting the family of all the functions in the program, and then useCALL
nnto invoke any of these functions by its index (sometimes also called the
selectorof a function).

4.6.10. Initialization ofc3.A TVM program might initializec3by means
of aPOP c3instruction. However, because this usually is the very first ac-
tion undertaken by a program (e.g., a smart contract), TVM makes some
provisions for the automatic initialization ofc3. Namely,c3is initialized by
the code (the initial value ofcc) of the program itself, and an extra zero
(or, in some cases, some other predefined numbers) is pushed into the stack
before the program’s execution. This is approximately equivalent to invok-
ingJMPDICT 0(orJMPDICT s) at the very beginning of a program—i.e., the
function with index zero is effectively themain()function for the program.

4.6.11. Creating selector functions and switch statements. TVM
makes special provisions for simple and concise implementation of selector
functions (which usually constitute the top level of a TVM program) or, more
generally, arbitraryswitchorcasestatements (which are also useful inTVM
programs). The most important primitives included for this purpose are
IFBITJMP,IFNBITJMP,IFBITJMPREF, andIFNBITJMPREF(cf.A.8.2). They
effectively enable one to combine subroutines, kept either in separate cells or
as subslices of certain cells, into a binary decision tree with decisions made
according to the indicated bits of the integer passed in the top of the stack.
Another instruction, useful for the implementation of sum-product types,
isPLDUZ(cf.A.7.2). This instruction preloads the first several bits of aSlice
into anInteger, which can later be inspected byIFBITJMPand other similar
instructions.

4.6.12. Alternative: using a hashmap to select the correct function.
Yet another alternative is to use aHashmap(cf.3.3) to hold the “collection”
or “dictionary” of the code of all functions in a program, and use the hashmap
lookup primitives (cf.A.10) to select the code of the required function, which
can then beBLESSed into a continuation (cf.A.8.5) and executed. Special
combined “lookup, bless, and execute” primitives, such asDICTIGETJMPand
DICTIGETEXEC, are also available (cf.A.10.11). This approach may be more


```
4.6. Functions, recursion, and dictionaries
```
efficient for larger programs andswitchstatements.


### 5.1 Codepages and interoperability of different TVM versions

## 5 Codepages and instruction encoding

This chapter describes the codepage mechanism, which allows TVM to be
flexible and extendable while preserving backward compatibility with respect
to previously generated code.
We also discuss some general considerations about instruction encodings
(applicable to arbitrary machine code, not just TVM), as well as the implica-
tions of these considerations for TVM and the choices made while designing
TVM’s (experimental) codepage zero. The instruction encodings themselves
are presented later in AppendixA.

### 5.1 Codepages and interoperability of different TVM

### versions

Thecodepages are an essential mechanism of backward compatibility and
of future extensions to TVM. They enable transparent execution of code
written for different revisions of TVM, with transparent interaction between
instances of such code. The mechanism of the codepages, however, is general
and powerful enough to enable some other originally unintended applications.

5.1.1. Codepages in continuations.Every ordinary continuation contains
a 16-bitcodepagefieldcp (cf.4.1.1), which determines the codepage that
will be used to execute its code. If a continuation is created by aPUSHCONT
(cf.4.2.3) or similar primitive, it usually inherits the current codepage (i.e.,
the codepage ofcc).^25

5.1.2. Current codepage.The current codepagecp(cf.1.4) is the code-
page of the current continuationcc. It determines the way the next in-
struction will be decoded fromcc.code, the remainder of the current con-
tinuation’s code. Once the instruction has been decoded and executed, it
determines the next value of the current codepage. In most cases, the cur-
rent codepage is left unchanged.
On the other hand, all primitives that switch the current continuation
load the new value ofcpfrom the new current continuation. In this way, all
code in continuations is always interpreted exactly as it was intended to be.

(^25) This is not exactly true. A more precise statement is that usually the codepage of the
newly-created continuation is a known function of the current codepage.


```
5.1. Codepages and interoperability of different TVM versions
```
5.1.3. Different versions of TVM may use different codepages.Dif-
ferent versions of TVM may use different codepages for their code. For
example, the original version of TVM might use codepage zero. A newer
version might use codepage one, which contains all the previously defined
opcodes, along with some newly defined ones, using some of the previously
unused opcode space. A subsequent version might use yet another codepage,
and so on.
However, a newer version of TVM will execute old code for codepage zero
exactly as before. If the old code contained an opcode used for some new
operations that were undefined in the original version of TVM, it will still
generate an invalid opcode exception, because the new operations are absent
in codepage zero.

5.1.4. Changing the behavior of old operations. New codepages can
also change the effects of some operations present in the old codepages while
preserving their opcodes and mnemonics.
For example, imagine a future 513-bit upgrade of TVM (replacing the
current 257-bit design). It might use a 513-bitIntegertype within the same
arithmetic primitives as before. However, while the opcodes and instructions
in the new codepage would look exactly like the old ones, they would work
differently, accepting 513-bit integer arguments and results. On the other
hand, during the execution of the same code in codepage zero, the new
machine would generate exceptions whenever the integers used in arithmetic
and other primitives do not fit into 257 bits.^26 In this way, the upgrade would
not change the behavior of the old code.

5.1.5. Improving instruction encoding. Another application for code-
pages is to change instruction encodings, reflecting improved knowledge of
the actual frequencies of such instructions in the code base. In this case,
the new codepage will have exactly the same instructions as the old one, but
with different encodings, potentially of differing lengths. For example, one
might create an experimental version of the first version of TVM, using a

(^26) This is another important mechanism of backward compatibility. All values of newly-
added types, as well as values belonging to extended original types that do not belong
to the original types (e.g., 513-bit integers that do not fit into 257 bits in the example
above), are treated by all instructions (except stack manipulation instructions, which are
naturally polymorphic, cf.2.2.6) in the old codepages as “values of incorrect type”, and
generate type-checking exceptions accordingly.


```
5.1. Codepages and interoperability of different TVM versions
```
(prefix) bitcode instead of the original bytecode, aiming to achieve higher
code density.

5.1.6. Making instruction encoding context-dependent.Another way
of using codepages to improve code density is to use several codepages with
different subsets of the whole instruction set defined in each of them, or with
the whole instruction set defined, but with different length encodings for the
same instructions in different codepages.
Imagine, for instance, a “stack manipulation” codepage, where stack ma-
nipulation primitives have short encodings at the expense of all other op-
erations, and a “data processing” codepage, where all other operations are
shorter at the expense of stack manipulation operations. If stack manip-
ulation operations tend to come one after another, we can automatically
switch to “stack manipulation” codepage after executing any such instruc-
tion. When a data processing instruction occurs, we switch back to “data
processing” codepage. If conditional probabilities of the class of the next in-
struction depending on the class of the previous instruction are considerably
different from corresponding unconditional probabilities, this technique—
automatically switching into stack manipulation mode to rearrange the stack
with shorter instructions, then switching back—might considerably improve
the code density.

5.1.7. Using codepages for status and control flags.Another potential
application of multiple codepages inside the same revision of TVM consists in
switching between several codepages depending on the result of the execution
of some instructions.
For example, imagine a version of TVM that uses two new codepages, 2
and 3. Most operations do not change the current codepage. However, the
integer comparison operations will switch to codepage 2 if the condition is
false, and to codepage 3 if it is true. Furthermore, a new operation?EXECUTE,
similar toEXECUTE, will indeed be equivalent toEXECUTEin codepage 3, but
will instead be aDROPin codepage 2. Such a trick effectively uses bit 0 of
the current codepage as a status flag.
Alternatively, one might create a couple of codepages—say, 4 and 5—
which differ only in their cell deserialisation primitives. For instance, in
codepage 4 they might work as before, while in codepage 5 they might de-
serialize data not from the beginning of aSlice, but from its end. Two new
instructions—say,CLDandSTD—might be used for switching to codepage 4


### 5.2 Instruction encoding

or codepage 5. Clearly, we have now described a status flag, affecting the
execution of some instructions in a certain new manner.

5.1.8. Setting the codepage in the code itself. For convenience, we
reserve some opcode in all codepages—say,FF n—for the instructionSETCP
n, withnfrom 0 to 255 (cf.A.13). Then by inserting such an instruction
into the very beginning of (the main function of) a program (e.g., a TON
Blockchain smart contract) or a library function, we can ensure that the code
will always be executed in the intended codepage.

### 5.2 Instruction encoding

This section discusses the general principles of instruction encoding valid for
all codepages and all versions of TVM. Later,5.3discusses the choices made
for the experimental “codepage zero”.

5.2.1. Instructions are encoded by a binary prefix code. All com-
plete instructions (i.e., instructions along with all their parameters, such as
the names of stack registerss(i)or other embedded constants) of a TVM
codepage are encoded by abinary prefix code. This means that a (finite)
binary string (i.e., a bitstring) corresponds to each complete instruction, in
such a way that binary strings corresponding to different complete instruc-
tions do not coincide, and no binary string among the chosen subset is a
prefix of another binary string from this subset.

5.2.2. Determining the first instruction from a code stream. As a
consequence of this encoding method, any binary string admits at most one
prefix, which is an encoding of some complete instruction. In particular,
the codecc.codeof the current continuation (which is aSlice, and thus a
bitstring along with some cell references) admits at most one such prefix,
which corresponds to the (uniquely determined) instruction that TVM will
execute first. After execution, this prefix is removed from the code of the
current continuation, and the next instruction can be decoded.

5.2.3. Invalid opcode.If no prefix ofcc.codeencodes a valid instruction
in the current codepage, aninvalid opcode exceptionis generated (cf.4.5.7).
However, the case of an emptycc.codeis treated separately as explained
in4.1.4(the exact behavior may depend on the current codepage).


```
5.2. Instruction encoding
```
5.2.4. Special case: end-of-code padding.As an exception to the above
rule, some codepages may accept some values ofcc.codethat are too short
to be valid instruction encodings as additional variants ofNOP, thus effectively
using the same procedure for them as for an emptycc.code. Such bitstrings
may be used for padding the code near its end.
For example, if binary string 00000000 (i.e.,x00, cf.1.0.3) is used in a
codepage to encodeNOP, its proper prefixes cannot encode any instructions.
So this codepage may accept 0 , 00 , 000 ,... , 0000000 as variants ofNOPif
this is all that is left incc.code, instead of generating an invalid opcode
exception.
Such a padding may be useful, for example, if thePUSHCONTprimitive
(cf.4.2.3) creates only continuations with code consisting of an integral
number of bytes, but not all instructions are encoded by an integral number
of bytes.

5.2.5. TVM code is a bitcode, not a bytecode. Recall that TVM is
a bit-oriented machine in the sense that itsCells (andSlices) are naturally
considered as sequences of bits, not just of octets (bytes), cf.3.2.5. Because
the TVM code is also kept in cells (cf.3.1.9and4.1.4), there is no reason
to use only bitstrings of length divisible by eight as encodings of complete
instructions. In other words, generally speaking,the TVM code is a bitcode,
not a bytecode.
That said, some codepages (such as our experimental codepage zero) may
opt to use a bytecode (i.e., to use only encodings consisting of an integral
number of bytes)—either for simplicity, or for the ease of debugging and of
studying memory (i.e., cell) dumps.^27

5.2.6. Opcode space used by a complete instruction.Recall from cod-
ing theory that the lengths of bitstringsliused in a binary prefix code satisfy
Kraft–McMillan inequality

#### ∑

```
i^2
−li≤ 1. This is applicable in particular to
```
the (complete) instruction encoding used by a TVM codepage. We say that
a particular complete instruction(or, more precisely,the encoding of a com-
plete instruction)utilizes the portion 2 −lof the opcode space, if it is encoded
by anl-bit string. One can see that all complete instructions together utilize
at most 1 (i.e., “at most the whole opcode space”).

(^27) If the cell dumps are hexadecimal, encodings consisting of an integral number of
hexadecimal digits (i.e., having length divisible by four bits) might be equally convenient.


```
5.2. Instruction encoding
```
5.2.7. Opcode space used by an instruction, or a class of instruc-
tions. The above terminology is extended to instructions (considered with
all admissible values of their parameters), or even classes of instructions (e.g.,
all arithmetic instructions). We say that an (incomplete) instruction, or a
class of instructions, occupies portionαof the opcode space, ifαis the sum
of the portions of the opcode space occupied by all complete instructions
belonging to that class.

5.2.8. Opcode space for bytecodes.A useful approximation of the above
definitions is as follows: Consider all 256 possible values for the first byte of
an instruction encoding. Suppose thatkof these values correspond to the
specific instruction or class of instructions we are considering. Then this
instruction or class of instructions occupies approximately the portionk/ 256
of the opcode space.
This approximation shows why all instructions cannot occupy together
more than the portion 256 /256 = 1of the opcode space, at least without
compromising the uniqueness of instruction decoding.

5.2.9. Almost optimal encodings. Coding theory tells us that in an op-
timally dense encoding, the portion of the opcode space used by a complete
instruction ( 2 −l, if the complete instruction is encoded inl bits) should be
approximately equal to the probability or frequency of its occurrence in real
programs.^28 The same should hold for (incomplete) instructions, or primi-
tives (i.e., generic instructions without specified values of parameters), and
for classes of instructions.

5.2.10. Example: stack manipulation primitives.For instance, if stack
manipulation instructions constitute approximately half of all instructions in
a typical TVM program, one should allocate approximately half of the opcode
space for encoding stack manipulation instructions. One might reserve the
first bytes (“opcodes”)0x00–0x7ffor such instructions. If a quarter of these
instructions areXCHG, it would make sense to reserve0x00–0x1fforXCHGs.
Similarly, if half of allXCHGs involve the top of stacks0, it would make sense
to use0x00–0x0fto encodeXCHG s0,s(i).

5.2.11. Simple encodings of instructions.In most cases,simpleencod-
ings of complete instructions are used. Simple encodings begin with a fixed

(^28) Notice that it is the probability of occurrence in the code that counts, not the proba-
bility of being executed. An instruction occurring in the body of a loop executed a million
times is still counted only once.


### 5.3 Instruction encoding in codepage zero

bitstring called theopcodeof the instruction, followed by, say, 4-bit fields
containing the indicesiof stack registerss(i)specified in the instruction, fol-
lowed by all other constant (literal, immediate) parameters included in the
complete instruction. While simple encodings may not be exactly optimal,
they admit short descriptions, and their decoding and encoding can be easily
implemented.
If a (generic) instruction uses a simple encoding with anl-bit opcode, then
the instruction will utilize 2 −lportion of the opcode space. This observation
might be useful for considerations described in5.2.9and5.2.10.

5.2.12. Optimizing code density further: Huffman codes.One might
construct optimally dense binary code for the set of all complete instructions,
provided their probabilities or frequences in real code are known. This is the
well-known Huffman code (for the given probability distribution). However,
such code would be highly unsystematic and hard to decode.

5.2.13. Practical instruction encodings.In practice, instruction encod-
ings used in TVM and other virtual machines offer a compromise between
code density and ease of encoding and decoding. Such a compromise may
be achieved by selecting simple encodings (cf.5.2.11) for all instructions
(maybe with separate simple encodings for some often used variants, such
asXCHG s0,s(i)among allXCHG s(i),s(j)), and allocating opcode space for
such simple encodings using the heuristics outlined in5.2.9and5.2.10; this
is the approach currently used in TVM.

### 5.3 Instruction encoding in codepage zero

This section provides details about the experimental instruction encoding
for codepage zero, as described elsewhere in this document (cf. AppendixA)
and used in the preliminary test version of TVM.

5.3.1. Upgradability. First of all, even if this preliminary version some-
how gets into the production version of the TON Blockchain, the codepage
mechanism (cf.5.1) enables us to introduce better versions later without
compromising backward compatibility.^29 So in the meantime, we are free to
experiment.

(^29) Notice that any modifications after launch cannot be done unilaterally; rather they
would require the support of at least two-thirds of validators.


```
5.3. Instruction encoding in codepage zero
```
5.3.2. Choice of instructions.We opted to include many “experimental”
and not strictly necessary instructions in codepage zero just to see how they
might be used in real code. For example, we have both the basic (cf.2.2.1)
and the compound (cf.2.2.3) stack manipulation primitives, as well as some
“unsystematic” ones such as ROT (mostly borrowed from Forth). If such
primitives are rarely used, their inclusion just wastes some part of the opcode
space and makes the encodings of other instructions slightly less effective,
something we can afford at this stage of TVM’s development.

5.3.3. Using experimental instructions. Some of these experimental
instructions have been assigned quite long opcodes, just to fit more of them
into the opcode space. One should not be afraid to use them just because
they are long; if these instructions turn out to be useful, they will receive
shorter opcodes in future revisions. Codepage zero is not meant to be fine-
tuned in this respect.

5.3.4. Choice of bytecode.We opted to use a bytecode (i.e., to use encod-
ings of complete instructions of lengths divisible by eight). While this may
not produce optimal code density, because such a length restriction makes
it more difficult to match portions of opcode space used for the encoding of
instructions with estimated frequencies of these instructions in TVM code
(cf.5.2.11and5.2.9), such an approach has its advantages: it admits a
simpler instruction decoder and simplifies debugging (cf.5.2.5).
After all, we do not have enough data on the relative frequencies of dif-
ferent instructions right now, so our code density optimizations are likely to
be very approximate at this stage. The ease of debugging and experimenting
and the simplicity of implementation are more important at this point.

5.3.5. Simple encodings for all instructions. For similar reasons, we
opted to use simple encodings for all instructions (cf.5.2.11 and5.2.13),
with separate simple encodings for some very frequently used subcases as
outlined in5.2.13. That said, we tried to distribute opcode space using the
heuristics described in5.2.9and5.2.10.

5.3.6. Lack of context-dependent encodings.This version of TVM also
does not use context-dependent encodings (cf.5.1.6). They may be added
at a later stage, if deemed useful.

5.3.7. The list of all instructions.The list of all instructions available in


```
5.3. Instruction encoding in codepage zero
```
codepage zero, along with their encodings and (in some cases) short descrip-
tions, may be found in AppendixA.


```
References
```
## References

[1] N. Durov,Telegram Open Network, 2017.


### A.1 Gas prices

## A Instructions and opcodes

This appendix lists all instructions available in the (experimental) codepage
zero of TVM, as explained in5.3.
We list the instructions in lexicographical opcode order. However, the
opcode space is distributed in such way as to make all instructions in each
category (e.g., arithmetic primitives) have neighboring opcodes. So we first
list a number of stack manipulation primitives, then constant primitives,
arithmetic primitives, comparison primitives, cell primitives, continuation
primitives, dictionary primitives, and finally application-specific primitives.
We use hexadecimal notation (cf. 1.0) for bitstrings. Stack registerss(i)
usually have 0 ≤i≤ 15 , andiis encoded in a 4-bit field (or, on a few rare
occasions, in an 8-bit field). Other immediate parameters are usually 4-bit,
8-bit, or variable length.
The stack notation described in 2.1.10is extensively used throughout
this appendix.

### A.1 Gas prices

The gas price for most primitives equals thebasic gas price, computed as
Pb := 10 +b+ 5r, wherebis the instruction length in bits and r is the
number of cell references included in the instruction. When the gas price
of an instruction differs from this basic price, it is indicated in parentheses
after its mnemonics, either as(x), meaning that the total gas price equals
x, or as(+x), meaningPb+x. Apart from integer constants, the following
expressions may appear:

- Cr — The total price of “reading” cells (i.e., transforming cell refer-
    ences into cell slices). Currently equal to 100 or 25 gas units per cell
    depending on whether it is the first time a cell with this hash is being
    “read” during the current run of the VM or not.
- L— The total price of loading cells. Depends on the loading action
    required.
- Bw— The total price of creating newBuilders. Currently equal to 0
    gas units per builder.
- Cw— The total price of creating newCells fromBuilders. Currently
    equal to 500 gas units per cell.


### A.2 Stack manipulation primitives

By default, the gas price of an instruction equalsP:=Pb+Cr+L+Bw+Cw.

### A.2 Stack manipulation primitives

This section includes both the basic (cf.2.2.1) and the compound (cf.2.2.3)
stack manipulation primitives, as well as some “unsystematic” ones. Some
compound stack manipulation primitives, such asXCPUorXCHG2, turn out
to have the same length as an equivalent sequence of simpler operations. We
have included these primitives regardless, so that they can easily be allocated
shorter opcodes in a future revision of TVM—or removed for good.
Some stack manipulation instructions have two mnemonics: one Forth-
style (e.g.,-ROT), the other conforming to the usual rules for identifiers (e.g.,
ROTREV). Whenever a stack manipulation primitive (e.g.,PICK) accepts an
integer parameternfrom the stack, it must be within the range 0 ... 255 ;
otherwise a range check exception happens before any further checks.

A.2.1. Basic stack manipulation primitives.

- 00 —NOP, does nothing.
- 01 —XCHG s1, also known asSWAP.
- 0 i—XCHG s(i)orXCHG s0,s(i), interchanges the top of the stack with
    s(i), 1 ≤i≤ 15.
- 10 ij—XCHG s(i),s(j), 1 ≤i < j≤ 15 , interchangess(i)withs(j).
- 11 ii—XCHG s0,s(ii), with 0 ≤ii≤ 255.
- 1 i—XCHG s1,s(i), 2 ≤i≤ 15.
- 2 i—PUSH s(i), 0 ≤ i≤ 15 , pushes a copy of the olds(i)into the
    stack.
- 20 —PUSH s0, also known asDUP.
- 21 —PUSH s1, also known asOVER.
- 3 i—POP s(i), 0 ≤i≤ 15 , pops the old top-of-stack value into the old
    s(i).
- 30 —POP s0, also known asDROP, discards the top-of-stack value.


```
A.2. Stack manipulation primitives
```
- 31 —POP s1, also known asNIP.

A.2.2. Compound stack manipulation primitives. Parameters i, j,
andkof the following primitives all are 4-bit integers in the range 0 ... 15.

- 4 ijk—XCHG3 s(i),s(j),s(k), equivalent toXCHG s2,s(i);XCHG s1,
    s(j);XCHG s0,s(k), with 0 ≤i,j,k≤ 15.
- 50 ij—XCHG2 s(i),s(j), equivalent toXCHG s1,s(i);XCHG s(j).
- 51 ij—XCPU s(i),s(j), equivalent toXCHG s(i);PUSH s(j).
- 52 ij—PUXC s(i),s(j−1), equivalent toPUSH s(i);SWAP;XCHG s(j).
- 53 ij—PUSH2 s(i),s(j), equivalent toPUSH s(i);PUSH s(j+ 1).
- 540 ijk—XCHG3 s(i),s(j),s(k)(long form).
- 541 ijk—XC2PU s(i),s(j),s(k), equivalent toXCHG2 s(i),s(j);PUSH
    s(k).
- 542 ijk—XCPUXC s(i),s(j),s(k−1), equivalent toXCHG s1,s(i);PUXC
    s(j),s(k−1).
- 543 ijk—XCPU2 s(i),s(j),s(k), equivalent toXCHG s(i);PUSH2 s(j),
    s(k).
- 544 ijk—PUXC2 s(i),s(j−1),s(k−1), equivalent toPUSH s(i);XCHG
    s2;XCHG2 s(j),s(k).
- 545 ijk—PUXCPU s(i),s(j−1),s(k−1), equivalent toPUXC s(i),s(j−
    1);PUSH s(k).
- 546 ijk—PU2XC s(i),s(j−1),s(k−2), equivalent toPUSH s(i);SWAP;
    PUXC s(j),s(k−1).
- 547 ijk—PUSH3 s(i),s(j),s(k), equivalent toPUSH s(i);PUSH2 s(j+
    1),s(k+ 1).
- 54C_— unused.

A.2.3. Exotic stack manipulation primitives.


```
A.2. Stack manipulation primitives
```
- 55 ij—BLKSWAP i+1,j+1, permutes two blockss(j+i+1).. .s(j+1)
    ands(j).. .s0, for 0 ≤i,j≤ 15. Equivalent toREVERSE i+ 1,j+ 1;
    REVERSE j+ 1,0;REVERSE i+j+ 2,0.
- 5513 —ROT2or2ROT(a b c d e f –c d e f a b), rotates the three
    topmost pairs of stack entries.
- 550 i—ROLL i+ 1, rotates the topi+ 1stack entries. Equivalent to
    BLKSWAP 1,i+ 1.
- 55 i 0 —ROLLREV i+1or-ROLL i+1, rotates the topi+1stack entries
    in the other direction. Equivalent toBLKSWAP i+ 1,1.
- 56 ii—PUSH s(ii)for 0 ≤ii≤ 255.
- 57 ii—POP s(ii)for 0 ≤ii≤ 255.
- 58 —ROT(a b c–b c a), equivalent toBLKSWAP 1,2or toXCHG2 s2,s1.
- 59 —ROTREVor-ROT(a b c–c a b), equivalent toBLKSWAP 2,1or to
    XCHG2 s2,s2.
- 5A—SWAP2or2SWAP(a b c d–c d a b), equivalent toBLKSWAP 2,2or
    toXCHG2 s3,s2.
- 5B—DROP2or2DROP(a b– ), equivalent toDROP;DROP.
- 5C—DUP2or2DUP(a b–a b a b), equivalent toPUSH2 s1,s0.
- 5D—OVER2or2OVER(a b c d–a b c d a b), equivalent toPUSH2 s3,s2.
- 5Eij—REVERSE i+ 2,j, reverses the order ofs(j+i+ 1).. .s(j)for
    0 ≤i,j≤ 15 ; equivalent to a sequence ofbi/ 2 c+ 1XCHGs.
- 5F0i—BLKDROP i, equivalent toDROPperformeditimes.
- 5Fij—BLKPUSH i,j, equivalent toPUSH s(j)performeditimes, 1 ≤
    i≤ 15 , 0 ≤j≤ 15.
- 60 —PICKorPUSHX, pops integerifrom the stack, then performsPUSH
    s(i).
- 61 —ROLLX, pops integerifrom the stack, then performsBLKSWAP 1,i.


### A.3 Tuple, List, and Null primitives

- 62 —-ROLLXorROLLREVX, pops integerifrom the stack, then performs
    BLKSWAP i,1.
- 63 —BLKSWX, pops integersi,jfrom the stack, then performsBLKSWAP
    i,j.
- 64 —REVX, pops integersi,jfrom the stack, then performsREVERSE
    i,j.
- 65 —DROPX, pops integerifrom the stack, then performsBLKDROP i.
- 66 —TUCK(ab−bab), equivalent toSWAP;OVERor toXCPU s1,s1.
- 67 —XCHGX, pops integerifrom the stack, then performsXCHG s(i).
- 68 —DEPTH, pushes the current depth of the stack.
- 69 —CHKDEPTH, pops integerifrom the stack, then checks whether
    there are at leastielements, generating a stack underflow exception
    otherwise.
- 6A—ONLYTOPX, pops integerifrom the stack, then removes all but
    the topielements.
- 6B—ONLYX, pops integerifrom the stack, then leaves only the bottom
    ielements. Approximately equivalent toDEPTH;SWAP;SUB;DROPX.
- 6C00–6C0F— reserved for stack operations.
- 6Cij—BLKDROP2 i,j, dropsistack elements under the topjelements,
    where 1 ≤i≤ 15 and 0 ≤j≤ 15. Equivalent toREVERSE i+j,0;
    BLKDROP i;REVERSE j,0.

### A.3 Tuple, List, and Null primitives

Tuples are ordered collections consisting of at most 255 TVM stack values of
arbitrary types (not necessarily the same). Tuple primitives create, modify,
and unpackTuples; they manipulate values of arbitrary types in the process,
similarly to the stack primitives. We do not recommend usingTuples of more
than 15 elements.
When aTupletcontains elementsx 1 ,... ,xn(in that order), we write
t= (x 1 ,...,xn); numbern≥ 0 is thelengthofTuple t. It is also denoted


```
A.3. Tuple, List, and Null primitives
```
by|t|. Tuples of length two are calledpairs, andTuples of length three are
triples.
Lisp-style lists are represented with the aid of pairs, i.e., tuples consisting
of exactly two elements. An empty list is represented by aNullvalue, and
a non-empty list is represented by pair(h,t), wherehis the first element of
the list, andtis its tail.

A.3.1. Null primitives. The following primitives work with (the only)
value⊥ of typeNull, useful for representing empty lists, empty branches
of binary trees, and absence of values inMaybeX types. An emptyTuple
created byNILcould have been used for the same purpose; however,Nullis
more efficient and costs less gas.

- 6D—NULLorPUSHNULL( –⊥), pushes the only value of typeNull.
- 6E—ISNULL(x–?), checks whetherxis aNull, and returns− 1 or 0
    accordingly.

A.3.2. Tuple primitives.

- 6F0n—TUPLE n(x 1.. .xn–t), creates a newTuplet= (x 1 ,...,xn)
    containingnvaluesx 1 ,... ,xn, where 0 ≤n≤ 15.
- 6F00—NIL( –t), pushes the onlyTuplet= ()of length zero.
- 6F01—SINGLE(x–t), creates a singletont:= (x), i.e., aTuple of
    length one.
- 6F02—PAIRorCONS(x y–t), creates pairt:= (x,y).
- 6F03—TRIPLE(x y z–t), creates triplet:= (x,y,z).
- 6F1k—INDEX k(t–x), returns thek-th element of aTuplet, where
    0 ≤k≤ 15. In other words, returnsxk+1ift= (x 1 ,...,xn). Ifk≥n,
    throws a range check exception.
- 6F10—FIRSTorCAR(t–x), returns the first element of aTuple.
- 6F11—SECONDorCDR(t–y), returns the second element of aTuple.
- 6F12—THIRD(t–z), returns the third element of aTuple.


```
A.3. Tuple, List, and Null primitives
```
- 6F2n—UNTUPLE n(t–x 1.. .xn), unpacks aTuplet= (x 1 ,...,xn)of
    length equal to 0 ≤n≤ 15. Iftis not aTuple, of if|t| 6=n, a type
    check exception is thrown.
- 6F21—UNSINGLE(t–x), unpacks a singletont= (x).
- 6F22—UNPAIRorUNCONS(t–x y), unpacks a pairt= (x,y).
- 6F23—UNTRIPLE(t–x y z), unpacks a triplet= (x,y,z).
- 6F3k —UNPACKFIRST k (t –x 1.. .xk), unpacks first 0 ≤ k ≤ 15
    elements of aTuplet. If|t|< k, throws a type check exception.
- 6F30—CHKTUPLE(t– ), checks whethertis aTuple.
- 6F4n—EXPLODE n(t–x 1.. .xmm), unpacks aTuplet= (x 1 ,...,xm)
    and returns its lengthm, but only ifm≤n≤ 15. Otherwise throws a
    type check exception.
- 6F5k—SETINDEX k(t x–t′), computesTuple t′that differs fromt
    only at positiont′k+1, which is set tox. In other words,|t′|=|t|,t′i=ti
    fori 6 =k+ 1, andt′k+1=x, for given 0 ≤k≤ 15. Ifk≥ |t|, throws a
    range check exception.
- 6F50—SETFIRST(t x–t′), sets the first component ofTuplettox
    and returns the resultingTuplet′.
- 6F51—SETSECOND(t x–t′), sets the second component ofTupletto
    xand returns the resultingTuplet′.
- 6F52—SETTHIRD(t x–t′), sets the third component ofTuplettox
    and returns the resultingTuplet′.
- 6F6k—INDEXQ k(t–x), returns thek-th element of aTuplet, where
    0 ≤k≤ 15. In other words, returnsxk+1ift= (x 1 ,...,xn). Ifk≥n,
    or iftisNull, returns aNullinstead ofx.
- 6F7k—SETINDEXQ k(t x–t′), sets thek-th component ofTupletto
    x, where 0 ≤k < 16 , and returns the resultingTuplet′. If|t|≤k, first
    extends the originalTupleto lengthk+1by setting all new components
    toNull. If the original value oftisNull, treats it as an emptyTuple.
    Iftis notNullorTuple, throws an exception. IfxisNulland either


```
A.3. Tuple, List, and Null primitives
```
```
|t| ≤kortisNull, then always returnst′=t(and does not consume
tuple creation gas).
```
- 6F80—TUPLEVAR(x 1.. .xnn–t), creates a newTupletof lengthn
    similarly toTUPLE, but with 0 ≤n≤ 255 taken from the stack.
- 6F81—INDEXVAR(t k–x), similar toINDEXk, but with 0 ≤k≤ 254
    taken from the stack.
- 6F82—UNTUPLEVAR(t n–x 1.. .xn), similar toUNTUPLE n, but with
    0 ≤n≤ 255 taken from the stack.
- 6F83—UNPACKFIRSTVAR(t n–x 1.. .xn), similar toUNPACKFIRST n,
    but with 0 ≤n≤ 255 taken from the stack.
- 6F84—EXPLODEVAR(t n–x 1.. .xm m), similar toEXPLODE n, but
    with 0 ≤n≤ 255 taken from the stack.
- 6F85—SETINDEXVAR(t x k –t′), similar toSETINDEX k, but with
    0 ≤k≤ 254 taken from the stack.
- 6F86—INDEXVARQ(t k–x), similar toINDEXQ n, but with 0 ≤k≤ 254
    taken from the stack.
- 6F87—SETINDEXVARQ(t x k–t′), similar toSETINDEXQ k, but with
    0 ≤k≤ 254 taken from the stack.
- 6F88—TLEN(t–n), returns the length of aTuple.
- 6F89—QTLEN(t–nor− 1 ), similar toTLEN, but returns− 1 iftis not
    aTuple.
- 6F8A—ISTUPLE(t–?), returns− 1 or 0 depending on whethertis a
    Tuple.
- 6F8B—LAST(t–x), returns the last elementt|t|of a non-emptyTuplet.
- 6F8C—TPUSHorCOMMA(t x–t′), appends a valuexto aTuple t=
    (x 1 ,...,xn), but only if the resultingTuple t′ = (x 1 ,...,xn,x)is of
    length at most 255. Otherwise throws a type check exception.


```
A.3. Tuple, List, and Null primitives
```
- 6F8D—TPOP(t–t′x), detaches the last elementx=xnfrom a non-
    emptyTuplet= (x 1 ,...,xn), and returns both the resultingTuplet′=
    (x 1 ,...,xn− 1 )and the original last elementx.
- 6FA0—NULLSWAPIF(x–xor⊥x), pushes aNullunder the topmost
    Integer x, but only ifx 6 = 0.
- 6FA1—NULLSWAPIFNOT(x–xor⊥x), pushes aNullunder the top-
    mostInteger x, but only ifx= 0. May be used for stack alignment
    after quiet primitives such asPLDUXQ.
- 6FA2—NULLROTRIF(x y–x yor ⊥x y), pushes aNull under the
    second stack entry from the top, but only if the topmostInteger yis
    non-zero.
- 6FA3—NULLROTRIFNOT(x y–x yor⊥x y), pushes aNullunder the
    second stack entry from the top, but only if the topmostInteger yis
    zero. May be used for stack alignment after quiet primitives such as
    LDUXQ.
- 6FA4—NULLSWAPIF2(x–xor⊥ ⊥x), pushes twoNulls under the
    topmost Integer x, but only if x 6 = 0. Equivalent to NULLSWAPIF;
    NULLSWAPIF.
- 6FA5—NULLSWAPIFNOT2(x–xor⊥⊥x), pushes twoNulls under the
    topmostInteger x, but only ifx= 0. Equivalent toNULLSWAPIFNOT;
    NULLSWAPIFNOT.
- 6FA6—NULLROTRIF2(x y–x yor⊥ ⊥x y), pushes twoNulls under
    the second stack entry from the top, but only if the topmostIntegery
    is non-zero. Equivalent toNULLROTRIF;NULLROTRIF.
- 6FA7—NULLROTRIFNOT2(x y –x y or⊥ ⊥x y), pushes twoNulls
    under the second stack entry from the top, but only if the topmost
    Integer yis zero. Equivalent toNULLROTRIFNOT;NULLROTRIFNOT.
- 6FBij—INDEX2 i,j (t–x), recoversx= (ti+1)j+1for 0 ≤i,j≤ 3.
    Equivalent toINDEX i;INDEX j.
- 6FB4—CADR(t–x), recoversx= (t 2 ) 1.


### A.4 Constant, or literal primitives

- 6FB5—CDDR(t–x), recoversx= (t 2 ) 2.
- 6FE_ijk—INDEX3 i,j,k(t–x), recoversx=

#### (

```
(ti+1)j+1
```
#### )

```
k+1for^0 ≤
i,j,k≤ 3. Equivalent toINDEX2 i,j;INDEX k.
```
- 6FD4—CADDR(t–x), recoversx=

#### (

```
(t 2 ) 2
```
#### )

#### 1.

- 6FD5—CDDDR(t–x), recoversx=

#### (

```
(t 2 ) 2
```
#### )

#### 2.

### A.4 Constant, or literal primitives

The following primitives push into the stack one literal (or unnamed constant)
of some type and range, stored as a part (an immediate argument) of the
instruction. Therefore, if the immediate argument is absent or too short, an
“invalid or too short opcode” exception (code 6 ) is thrown.

A.4.1. Integer and boolean constants.

- 7 i—PUSHINT xwith− 5 ≤x≤ 10 , pushes integerxinto the stack;
    hereiequals four lower-order bits ofx(i.e.,i=xmod 16).
- 70 —ZERO,FALSE, orPUSHINT 0, pushes a zero.
- 71 —ONEorPUSHINT 1.
- 72 —TWOorPUSHINT 2.
- 7A—TENorPUSHINT10.
- 7F—TRUEorPUSHINT -1.
- 80 xx—PUSHINT xxwith− 128 ≤xx≤ 127.
- 81 xxxx—PUSHINT xxxxwith− 215 ≤ xxxx < 215 a signed 16-bit
    big-endian integer.
- 81FC18—PUSHINT − 1000.
- 82 lxxx—PUSHINT xxx, where 5-bit 0 ≤l≤ 30 determines the length
    n= 8l+ 19of signed big-endian integerxxx. The total length of this
    instruction isl+ 4bytes orn+ 13 = 8l+ 32bits.
- 821005F5E100—PUSHINT 108.


```
A.4. Constant, or literal primitives
```
- 83 xx—PUSHPOW2 xx+ 1, (quietly) pushes 2 xx+1for 0 ≤xx≤ 255.
- 83FF—PUSHNAN, pushes aNaN.
- 84 xx—PUSHPOW2DEC xx+ 1, pushes 2 xx+1− 1 for 0 ≤xx≤ 255.
- 85 xx—PUSHNEGPOW2 xx+ 1, pushes− 2 xx+1for 0 ≤xx≤ 255.
- 86 , 87 — reserved for integer constants.

A.4.2. Constant slices, continuations, cells, and references. Most
of the instructions listed below push literal slices, continuations, cells, and
cell references, stored as immediate arguments to the instruction. Therefore,
if the immediate argument is absent or too short, an “invalid or too short
opcode” exception (code 6 ) is thrown.

- 88 —PUSHREF, pushes the first reference ofcc.codeinto the stack as
    aCell(and removes this reference from the current continuation).
- 89 —PUSHREFSLICE, similar toPUSHREF, but converts the cell into a
    Slice.
- 8A—PUSHREFCONT, similar toPUSHREFSLICE, but makes a simple or-
    dinaryContinuationout of the cell.
- 8Bxsss—PUSHSLICE sss, pushes the (prefix) subslice ofcc.codecon-
    sisting of its first 8 x+ 4bits and no references (i.e., essentially a bit-
    string), where 0 ≤x≤ 15. A completion tag is assumed, meaning that
    all trailing zeroes and the last binary one (if present) are removed from
    this bitstring. If the original bitstring consists only of zeroes, an empty
    slice will be pushed.
- 8B08—PUSHSLICE x8_, pushes an empty slice (bitstring‘’).
- 8B04—PUSHSLICE x4_, pushes bitstring‘0’.
- 8B0C—PUSHSLICE xC_, pushes bitstring‘1’.
- 8Crxxssss—PUSHSLICE ssss, pushes the (prefix) subslice ofcc.code
    consisting of its first 1 ≤r+ 1≤ 4 references and up to first 8 xx+ 1
    bits of data, with 0 ≤xx≤ 31. A completion tag is also assumed.


### A.5 Arithmetic primitives Introduction

- 8C01is equivalent toPUSHREFSLICE.
- 8Drxxsssss—PUSHSLICE sssss, pushes the subslice ofcc.codecon-
    sisting of 0 ≤r ≤ 4 references and up to 8 xx+ 6bits of data, with
    0 ≤xx≤ 127. A completion tag is assumed.
- 8DE_— unused (reserved).
- 8F_rxxcccc—PUSHCONT cccc, whereccccis the simple ordinary con-
    tinuation made from the first 0 ≤ r ≤ 3 references and the first
    0 ≤xx≤ 127 bytes ofcc.code.
- 9xccc—PUSHCONT ccc, pushes anx-byte continuation for 0 ≤x≤ 15.

### A.5 Arithmetic primitives

A.5.1. Addition, subtraction, multiplication.

- A0—ADD(x y–x+y), adds together two integers.
- A1—SUB(x y–x−y).
- A2—SUBR(x y–y−x), equivalent toSWAP;SUB.
- A3—NEGATE(x–−x), equivalent toMULCONST − 1 or toZERO; SUBR.
    Notice that it triggers an integer overflow exception ifx=− 2256.
- A4—INC(x–x+ 1), equivalent toADDCONST 1.
- A5—DEC(x–x− 1 ), equivalent toADDCONST − 1.
- A6cc—ADDCONST cc(x–x+cc),− 128 ≤cc≤ 127.
- A7cc—MULCONST cc(x–x·cc),− 128 ≤cc≤ 127.
- A8—MUL(x y–xy).

A.5.2. Division.
The general encoding of aDIV,DIVMOD, orMODoperation isA9mscdf, with
an optional pre-multiplication and an optional replacement of the division or
multiplication by a shift. Variable one- or two-bit fieldsm,s,c,d, andfare
as follows:


```
A.5. Arithmetic primitives
```
- 0 ≤m≤ 1 — Indicates whether there is pre-multiplication (MULDIV
    operation and its variants), possibly replaced by a left shift.
- 0 ≤s≤ 2 — Indicates whether either the multiplication or the division
    have been replaced by shifts: s= 0—no replacement,s= 1—division
    replaced by a right shift,s= 2—multiplication replaced by a left shift
    (possible only form= 1).
- 0 ≤c≤ 1 — Indicates whether there is a constant one-byte argument
    ttfor the shift operator (ifs 6 = 0). Fors= 0,c= 0. Ifc= 1, then
    0 ≤ tt ≤ 255 , and the shift is performed by tt+ 1bits. Ifs 6 = 0
    andc= 0, then the shift amount is provided to the instruction as a
    top-of-stackInteger in range 0 ... 256.
- 1 ≤d≤ 3 — Indicates which results of division are required: 1 —only
    the quotient, 2 —only the remainder, 3 —both.
- 0 ≤f≤ 2 — Rounding mode: 0 —floor, 1 —nearest integer, 2 —ceiling
    (cf.1.5.6).

Examples:

- A904—DIV(x y–q:=bx/yc).
- A905—DIVR(x y–q′:=bx/y+ 1/ 2 c).
- A906—DIVC(x y–q′′:=dx/ye).
- A908—MOD(x y–r), whereq:=bx/yc,r:=xmody:=x−yq.
- A90C—DIVMOD(x y–q r), whereq:=bx/yc,r:=x−yq.
- A90D—DIVMODR(x y–q′r′), whereq′:=bx/y+ 1/ 2 c,r′:=x−yq′.
- A90E—DIVMODC(x y–q′′r′′), whereq′′:=dx/ye,r′′:=x−yq′′.
- A924— same asRSHIFT: (x y–bx· 2 −yc) for 0 ≤y≤ 256.
- A934tt— same asRSHIFT tt+ 1: (x–bx· 2 −tt−^1 c).
- A938tt—MODPOW2 tt+ 1: (x–xmod 2tt+1).
- A985—MULDIVR(x y z–q′), whereq′=bxy/z+ 1/ 2 c.


```
A.5. Arithmetic primitives
```
- A98C—MULDIVMOD(x y z–q r), whereq:=bx·y/zc,r:=x·ymodz
    (same as*/MODin Forth).
- A9A4—MULRSHIFT(x y z–bxy· 2 −zc) for 0 ≤z≤ 256.
- A9A5—MULRSHIFTR(x y z–bxy· 2 −z+ 1/ 2 c) for 0 ≤z≤ 256.
- A9B4tt—MULRSHIFT tt+ 1(x y–bxy· 2 −tt−^1 c).
- A9B5tt—MULRSHIFTRtt+ 1(x y–bxy· 2 −tt−^1 + 1/ 2 c).
- A9C4—LSHIFTDIV(x y z–b 2 zx/yc) for 0 ≤z≤ 256.
- A9C5—LSHIFTDIVR(x y z–b 2 zx/y+ 1/ 2 c) for 0 ≤z≤ 256.
- A9D4tt—LSHIFTDIV tt+ 1(x y–b 2 tt+1x/yc).
- A9D5tt—LSHIFTDIVRtt+ 1(x y–b 2 tt+1x/y+ 1/ 2 c).

The most useful of these operations areDIV,DIVMOD,MOD,DIVR, DIVC,
MODPOW2 t, andRSHIFTR t(for integer arithmetic); andMULDIVMOD,MULDIV,
MULDIVR,LSHIFTDIVR t, andMULRSHIFTR t(for fixed-point arithmetic).

A.5.3. Shifts, logical operations.

- AAcc—LSHIFT cc+ 1(x–x· 2 cc+1), 0 ≤cc≤ 255.
- AA00—LSHIFT 1, equivalent toMULCONST 2or to Forth’s2*.
- ABcc—RSHIFT cc+ 1(x–bx· 2 −cc−^1 c), 0 ≤cc≤ 255.
- AC—LSHIFT(x y–x· 2 y), 0 ≤y≤ 1023.
- AD—RSHIFT(x y–bx· 2 −yc), 0 ≤y≤ 1023.
- AE—POW2(y– 2 y), 0 ≤y≤ 1023 , equivalent toONE;SWAP;LSHIFT.
- AF— reserved.
- B0—AND(x y–x&y), bitwise “and” of two signed integersxandy,
    sign-extended to infinity.
- B1—OR(x y–x∨y), bitwise “or” of two integers.


```
A.5. Arithmetic primitives
```
- B2—XOR(x y–x⊕y), bitwise “xor” of two integers.
- B3—NOT(x–x⊕−1 =− 1 −x), bitwise “not” of an integer.
- B4cc—FITScc+ 1(x–x), checks whetherxis acc+ 1-bit signed
    integer for 0 ≤cc≤ 255 (i.e., whether− 2 cc≤x < 2 cc). If not, either
    triggers an integer overflow exception, or replacesxwith aNaN(quiet
    version).
- B400—FITS 1orCHKBOOL(x–x), checks whetherxis a “boolean
    value” (i.e., either 0 or -1).
- B5cc—UFITS cc+ 1(x–x), checks whetherxis acc+ 1-bit unsigned
    integer for 0 ≤cc≤ 255 (i.e., whether 0 ≤x < 2 cc+1).
- B500—UFITS 1orCHKBIT, checks whetherxis a binary digit (i.e.,
    zero or one).
- B600—FITSX(x c–x), checks whetherxis ac-bit signed integer for
    0 ≤c≤ 1023.
- B601—UFITSX(x c–x), checks whetherxis ac-bit unsigned integer
    for 0 ≤c≤ 1023.
- B602—BITSIZE(x–c), computes smallestc≥ 0 such thatxfits into
    ac-bit signed integer (− 2 c−^1 ≤c < 2 c−^1 ).
- B603—UBITSIZE(x–c), computes smallestc≥ 0 such thatxfits
    into ac-bit unsigned integer ( 0 ≤ x < 2 c), or throws a range check
    exception.
- B608—MIN(x y–xory), computes the minimum of two integersx
    andy.
- B609—MAX(x y–xory), computes the maximum of two integersx
    andy.
- B60A—MINMAXorINTSORT2(x y–x yory x), sorts two integers. Quiet
    version of this operation returns twoNaNs if any of the arguments are
    NaNs.
- B60B—ABS(x–|x|), computes the absolute value of an integerx.


### A.6 Comparison primitives

A.5.4. Quiet arithmetic primitives. We opted to make all arithmetic
operations “non-quiet” (signaling) by default, and create their quiet counter-
parts by means of a prefix. Such an encoding is definitely sub-optimal. It is
not yet clear whether it should be done in this way, or in the opposite way
by making all arithmetic operations quiet by default, or whether quiet and
non-quiet operations should be given opcodes of equal length; this can only
be settled by practice.

- B7xx—QUIETprefix, transforming any arithmetic operation into its
    “quiet” variant, indicated by prefixing aQto its mnemonic. Such op-
    erations returnNaNs instead of throwing integer overflow exceptions if
    the results do not fit inIntegers, or if one of their arguments is aNaN.
    Notice that this does not extend to shift amounts and other parame-
    ters that must be within a small range (e.g., 0–1023). Also notice that
    this does not disable type-checking exceptions if a value of a type other
    thanInteger is supplied.
- B7A0—QADD(x y–x+y), always works ifxandyareIntegers, but
    returns aNaNif the addition cannot be performed.
- B7A904—QDIV(x y–bx/yc), returns aNaNify= 0, or ify=− 1 and
    x=− 2256 , or if either ofxoryis aNaN.
- B7B0—QAND(x y–x&y), bitwise “and” (similar toAND), but returns
    aNaNif eitherxoryis aNaNinstead of throwing an integer overflow
    exception. However, if one of the arguments is zero, and the other is a
    NaN, the result is zero.
- B7B1—QOR(x y–x∨y), bitwise “or”. Ifx=− 1 ory=− 1 , the result
    is always− 1 , even if the other argument is aNaN.
- B7B507—QUFITS 8(x–x′), checks whether xis an unsigned byte
    (i.e., whether 0 ≤x < 28 ), and replacesxwith aNaNif this is not the
    case; leavesxintact otherwise (i.e., ifxis an unsigned byte).

### A.6 Comparison primitives

A.6.1. Integer comparison. All integer comparison primitives return in-
teger− 1 (“true”) or 0 (“false”) to indicate the result of the comparison. We


```
A.6. Comparison primitives
```
do not define their “boolean circuit” counterparts, which would transfer con-
trol toc0orc1depending on the result of the comparison. If needed, such
instructions can be simulated with the aid ofRETBOOL.
Quiet versions of integer comparison primitives are also available, encoded
with the aid of theQUIETprefix (B7). If any of the integers being compared
areNaNs, the result of a quiet comparison will also be aNaN(“undefined”),
instead of a− 1 (“yes”) or 0 (“no”), thus effectively supporting ternary logic.

- B8—SGN(x–sgn(x)), computes the sign of an integerx:− 1 ifx < 0 ,
    0 ifx= 0, 1 ifx > 0.
- B9—LESS(x y–x < y), returns− 1 ifx < y, 0 otherwise.
- BA—EQUAL(x y–x=y), returns− 1 ifx=y, 0 otherwise.
- BB—LEQ(x y–x≤y).
- BC—GREATER(x y–x > y).
- BD—NEQ(x y–x 6 =y), equivalent toEQUAL;NOT.
- BE—GEQ(x y–x≥y), equivalent toLESS;NOT.
- BF—CMP(x y–sgn(x−y)), computes the sign ofx−y:− 1 ifx < y,
    0 ifx=y, 1 ifx > y. No integer overflow can occur here unlessxory
    is aNaN.
- C0yy—EQINT yy(x–x=yy) for− 27 ≤yy < 27.
- C000—ISZERO, checks whether an integer is zero. Corresponds to
    Forth’s0=.
- C1yy—LESSINT yy(x–x < yy) for− 27 ≤yy < 27.
- C100—ISNEG, checks whether an integer is negative. Corresponds to
    Forth’s0<.
- C101—ISNPOS, checks whether an integer is non-positive.
- C2yy—GTINT yy(x–x > yy) for− 27 ≤yy < 27.
- C200—ISPOS, checks whether an integer is positive. Corresponds to
    Forth’s0>.


```
A.6. Comparison primitives
```
- C2FF—ISNNEG, checks whether an integer is non-negative.
- C3yy—NEQINT yy(x–x 6 =yy) for− 27 ≤yy < 27.
- C4—ISNAN(x–x=NaN), checks whetherxis aNaN.
- C5—CHKNAN(x–x), throws an arithmetic overflow exception ifxis a
    NaN.
- C6— reserved for integer comparison.

A.6.2. Other comparison.
Most of these “other comparison” primitives actually compare the data
portions ofSlices as bitstrings.

- C700—SEMPTY(s–s=∅), checks whether aSlice sis empty (i.e.,
    contains no bits of data and no cell references).
- C701—SDEMPTY(s–s≈ ∅), checks whetherSlice shas no bits of
    data.
- C702—SREMPTY(s–r(s) = 0), checks whetherSliceshas no refer-
    ences.
- C703—SDFIRST(s–s 0 = 1), checks whether the first bit ofSlicesis
    a one.
- C704—SDLEXCMP(s s′–c), compares the data ofslexicographically
    with the data ofs′, returning− 1 , 0, or 1 depending on the result.
- C705—SDEQ(s s′–s≈s′), checks whether the data parts ofsands′
    coincide, equivalent toSDLEXCMP;ISZERO.
- C708—SDPFX(s s′–?), checks whethersis a prefix ofs′.
- C709—SDPFXREV(s s′–?), checks whethers′is a prefix ofs, equivalent
    toSWAP;SDPFX.
- C70A—SDPPFX(s s′–?), checks whethersis a proper prefix ofs′(i.e.,
    a prefix distinct froms′).
- C70B—SDPPFXREV(s s′–?), checks whethers′is a proper prefix ofs.


### A.7 Cell primitives

- C70C—SDSFX(s s′–?), checks whethersis a suffix ofs′.
- C70D—SDSFXREV(s s′–?), checks whethers′is a suffix ofs.
- C70E—SDPSFX(s s′–?), checks whethersis a proper suffix ofs′.
- C70F—SDPSFXREV(s s′–?), checks whethers′is a proper suffix ofs.
- C710—SDCNTLEAD0(s–n), returns the number of leading zeroes in
    s.
- C711—SDCNTLEAD1(s–n), returns the number of leading ones ins.
- C712—SDCNTTRAIL0(s–n), returns the number of trailing zeroes in
    s.
- C713—SDCNTTRAIL1(s–n), returns the number of trailing ones ins.

### A.7 Cell primitives

The cell primitives are mostly eithercell serialization primitives, which work
withBuilders, orcell deserialization primitives, which work withSlices.

A.7.1. Cell serialization primitives. All these primitives first check
whether there is enough space in the Builder, and only then check the range
of the value being serialized.

- C8—NEWC( –b), creates a new emptyBuilder.
- C9—ENDC(b–c), converts aBuilderinto an ordinaryCell.
- CAcc—STI cc+ 1(x b–b′), stores a signedcc+ 1-bit integerxinto
    Builder bfor 0 ≤cc≤ 255 , throws a range check exception ifxdoes
    not fit intocc+ 1bits.
- CBcc—STU cc+ 1(x b–b′), stores an unsignedcc+ 1-bit integerx
    intoBuilderb. In all other respects it is similar toSTI.
- CC—STREF(c b–b′), stores a reference toCellcintoBuilderb.
- CD—STBREFRorENDCST(b b′′–b), equivalent toENDC;SWAP;STREF.
- CE—STSLICE(s b–b′), storesSlicesintoBuilder b.


```
A.7. Cell primitives
```
- CF00—STIX(x b l –b′), stores a signedl-bit integer xintobfor
    0 ≤l≤ 257.
- CF01—STUX(x b l–b′), stores an unsignedl-bit integerxintobfor
    0 ≤l≤ 256.
- CF02—STIXR(b x l–b′), similar toSTIX, but with arguments in a
    different order.
- CF03—STUXR(b x l–b′), similar toSTUX, but with arguments in a
    different order.
- CF04—STIXQ(x b l–x b forb′ 0 ), a quiet version ofSTIX. If there
    is no space inb, setsb′=bandf=− 1. Ifxdoes not fit intolbits,
    setsb′=bandf= 1. If the operation succeeds,b′is the newBuilder
    andf= 0. However, 0 ≤l≤ 257 , with a range check exception if this
    is not so.
- CF05—STUXQ(x b l–b′f).
- CF06—STIXRQ(b x l–b x f orb′ 0 ).
- CF07—STUXRQ(b x l–b x f orb′ 0 ).
- CF08cc— a longer version ofSTI cc+ 1.
- CF09cc— a longer version ofSTU cc+ 1.
- CF0Acc—STIR cc+ 1(b x–b′), equivalent toSWAP;STI cc+ 1.
- CF0Bcc—STUR cc+ 1(b x–b′), equivalent toSWAP;STU cc+ 1.
- CF0Ccc—STIQ cc+ 1(x b–x b forb′ 0 ).
- CF0Dcc—STUQ cc+ 1(x b–x b forb′ 0 ).
- CF0Ecc—STIRQ cc+ 1(b x–b x f orb′ 0 ).
- CF0Fcc—STURQ cc+ 1(b x–b x f orb′ 0 ).
- CF10— a longer version ofSTREF(c b–b′).
- CF11—STBREF(b′b–b′′), equivalent toSWAP;STBREFREV.


```
A.7. Cell primitives
```
- CF12— a longer version ofSTSLICE(s b–b′).
- CF13—STB(b′b–b′′), appends all data fromBuilderb′toBuilder b.
- CF14—STREFR(b c–b′).
- CF15—STBREFR(b b′–b′′), a longer encoding ofSTBREFR.
- CF16—STSLICER(b s–b′).
- CF17—STBR(b b′–b′′), concatenates twoBuilders, equivalent toSWAP;
    STB.
- CF18—STREFQ(c b–c b− 1 orb′ 0 ).
- CF19—STBREFQ(b′b–b′b− 1 orb′′ 0 ).
- CF1A—STSLICEQ(s b–s b− 1 orb′ 0 ).
- CF1B—STBQ(b′b–b′b− 1 orb′′ 0 ).
- CF1C—STREFRQ(b c–b c− 1 orb′ 0 ).
- CF1D—STBREFRQ(b b′–b b′− 1 orb′′ 0 ).
- CF1E—STSLICERQ(b s–b s− 1 orb′′ 0 ).
- CF1F—STBRQ(b b′–b b′− 1 orb′′ 0 ).
- CF20—STREFCONST, equivalent toPUSHREF;STREFR.
- CF21—STREF2CONST, equivalent toSTREFCONST;STREFCONST.
- CF23— ENDXC(b x –c), if x 6 = 0, creates a special or exoticcell
    (cf.3.1.2) fromBuilder b. The type of the exotic cell must be stored
    in the first 8 bits ofb. Ifx= 0, it is equivalent toENDC. Otherwise
    some validity checks on the data and references of bare performed
    before creating the exotic cell.
- CF28—STILE4(x b–b′), stores a little-endian signed 32-bit integer.
- CF29—STULE4(x b–b′), stores a little-endian unsigned 32-bit integer.
- CF2A—STILE8(x b–b′), stores a little-endian signed 64-bit integer.


```
A.7. Cell primitives
```
- CF2B—STULE8(x b–b′), stores a little-endian unsigned 64-bit integer.
- CF30—BDEPTH (b –x), returns the depth ofBuilder b. If no cell
    references are stored in b, thenx = 0; otherwisexis one plus the
    maximum of depths of cells referred to fromb.
- CF31—BBITS(b–x), returns the number of data bits already stored
    inBuilderb.
- CF32—BREFS(b–y), returns the number of cell references already
    stored inb.
- CF33—BBITREFS(b–x y), returns the numbers of both data bits and
    cell references inb.
- CF35—BREMBITS(b–x′), returns the number of data bits that can
    still be stored inb.
- CF36—BREMREFS(b–y′).
- CF37—BREMBITREFS(b–x′y′).
- CF38cc—BCHKBITS cc+ 1(b–), checks whethercc+ 1bits can be
    stored intob, where 0 ≤cc≤ 255.
- CF39—BCHKBITS(b x– ), checks whetherxbits can be stored intob,
    0 ≤x≤ 1023. If there is no space forxmore bits inb, or ifxis not
    within the range 0 ... 1023 , throws an exception.
- CF3A—BCHKREFS(b y– ), checks whetheryreferences can be stored
    intob, 0 ≤y≤ 7.
- CF3B—BCHKBITREFS(b x y– ), checks whetherxbits andyreferences
    can be stored intob, 0 ≤x≤ 1023 , 0 ≤y≤ 7.
- CF3Ccc—BCHKBITSQ cc+ 1(b–?), checks whethercc+ 1bits can be
    stored intob, where 0 ≤cc≤ 255.
- CF3D—BCHKBITSQ(b x–?), checks whetherxbits can be stored into
    b, 0 ≤x≤ 1023.
- CF3E—BCHKREFSQ(b y–?), checks whetheryreferences can be stored
    intob, 0 ≤y≤ 7.


```
A.7. Cell primitives
```
- CF3F—BCHKBITREFSQ(b x y–?), checks whetherxbits andyrefer-
    ences can be stored intob, 0 ≤x≤ 1023 , 0 ≤y≤ 7.
- CF40—STZEROES(b n–b′), storesnbinary zeroes intoBuilderb.
- CF41—STONES(b n–b′), storesnbinary ones intoBuilderb.
- CF42—STSAME(b n x –b′), storesn binaryxes ( 0 ≤ x≤ 1 ) into
    Builderb.
- CFC0_xysss—STSLICECONST sss(b–b′), stores a constant subslice
    sssconsisting of 0 ≤x≤ 3 references and up to 8 y+ 1data bits, with
    0 ≤y≤ 7. Completion bit is assumed.
- CF81—STSLICECONST ‘0’orSTZERO(b–b′), stores one binary zero.
- CF83—STSLICECONST ‘1’orSTONE(b–b′), stores one binary one.
- CFA2— equivalent toSTREFCONST.
- CFA3— almost equivalent toSTSLICECONST ‘1’;STREFCONST.
- CFC2— equivalent toSTREF2CONST.
- CFE2—STREF3CONST.

A.7.2. Cell deserialization primitives.

- D0—CTOS(c–s), converts aCell into aSlice. Notice thatcmust
    be either an ordinary cell, or an exotic cell (cf.3.1.2) which is au-
    tomaticallyloaded to yield an ordinary cellc′, converted into aSlice
    afterwards.
- D1—ENDS(s– ), removes aSlice sfrom the stack, and throws an
    exception if it is not empty.
- D2cc—LDI cc+ 1(s–x s′), loads (i.e., parses) a signedcc+ 1-bit
    integerxfromSlices, and returns the remainder ofsass′.
- D3cc—LDU cc+ 1(s–x s′), loads an unsignedcc+ 1-bit integerx
    fromSlices.
- D4—LDREF(s–c s′), loads a cell referencecfroms.


```
A.7. Cell primitives
```
- D5—LDREFRTOS(s–s′s′′), equivalent toLDREF;SWAP;CTOS.
- D6cc—LDSLICE cc+ 1(s–s′′s′), cuts the nextcc+ 1bits ofsinto a
    separateSlices′′.
- D700—LDIX(s l–x s′), loads a signedl-bit ( 0 ≤l≤ 257 ) integerx
    fromSlices, and returns the remainder ofsass′.
- D701—LDUX(s l–x s′), loads an unsignedl-bit integerxfrom (the
    firstlbits of)s, with 0 ≤l≤ 256.
- D702—PLDIX(s l–x), preloads a signedl-bit integer fromSlice s,
    for 0 ≤l≤ 257.
- D703—PLDUX(s l–x), preloads an unsignedl-bit integer froms, for
    0 ≤l≤ 256.
- D704—LDIXQ(s l–x s′− 1 or s 0 ), quiet version ofLDIX: loads a
    signedl-bit integer fromssimilarly toLDIX, but returns a success flag,
    equal to− 1 on success or to 0 on failure (ifsdoes not havel bits),
    instead of throwing a cell underflow exception.
- D705—LDUXQ(s l–x s′− 1 ors 0 ), quiet version ofLDUX.
- D706—PLDIXQ(s l–x− 1 or 0 ), quiet version ofPLDIX.
- D707—PLDUXQ(s l–x− 1 or 0 ), quiet version ofPLDUX.
- D708cc—LDI cc+ 1(s–x s′), a longer encoding forLDI.
- D709cc—LDU cc+ 1(s–x s′), a longer encoding forLDU.
- D70Acc—PLDI cc+1(s–x), preloads a signedcc+1-bit integer from
    Slices.
- D70Bcc—PLDU cc+ 1(s–x), preloads an unsignedcc+ 1-bit integer
    froms.
- D70Ccc—LDIQ cc+ 1(s–x s′− 1 ors 0 ), a quiet version ofLDI.
- D70Dcc—LDUQ cc+ 1(s–x s′− 1 ors 0 ), a quiet version ofLDU.
- D70Ecc—PLDIQ cc+ 1(s–x− 1 or 0 ), a quiet version ofPLDI.


```
A.7. Cell primitives
```
- D70Fcc—PLDUQ cc+ 1(s–x− 1 or 0 ), a quiet version ofPLDU.
- D714_c—PLDUZ 32(c+ 1)(s–s x), preloads the first32(c+ 1)bits
    of Slice sinto an unsigned integerx, for 0 ≤c ≤ 7. Ifsis shorter
    than necessary, missing bits are assumed to be zero. This operation is
    intended to be used along withIFBITJMPand similar instructions.
- D718—LDSLICEX(s l–s′′s′), loads the first 0 ≤l≤ 1023 bits from
    Slicesinto a separateSlices′′, returning the remainder ofsass′.
- D719—PLDSLICEX(s l–s′′), returns the first 0 ≤l≤ 1023 bits ofs
    ass′′.
- D71A—LDSLICEXQ(s l–s′′s′− 1 ors 0 ), a quiet version ofLDSLICEX.
- D71B—PLDSLICEXQ(s l–s′− 1 or 0 ), a quiet version ofLDSLICEXQ.
- D71Ccc—LDSLICE cc+ 1(s–s′′s′), a longer encoding forLDSLICE.
- D71Dcc—PLDSLICE cc+ 1(s–s′′), returns the first 0 < cc+ 1≤ 256
    bits ofsass′′.
- D71Ecc—LDSLICEQ cc+ 1(s–s′′s′ − 1 ors 0 ), a quiet version of
    LDSLICE.
- D71Fcc — PLDSLICEQ cc+ 1 (s – s′′ − 1 or 0 ), a quiet version of
    PLDSLICE.
- D720—SDCUTFIRST(s l–s′), returns the first 0 ≤l≤ 1023 bits ofs.
    It is equivalent toPLDSLICEX.
- D721—SDSKIPFIRST(s l–s′), returns all but the first 0 ≤l≤ 1023
    bits ofs. It is equivalent toLDSLICEX;NIP.
- D722—SDCUTLAST(s l–s′), returns the last 0 ≤l≤ 1023 bits ofs.
- D723—SDSKIPLAST(s l–s′), returns all but the last 0 ≤l≤ 1023
    bits ofs.
- D724—SDSUBSTR(s l l′–s′), returns 0 ≤l′≤ 1023 bits ofsstarting
    from offset 0 ≤l ≤ 1023 , thus extracting a bit substring out of the
    data ofs.


```
A.7. Cell primitives
```
- D726—SDBEGINSX(s s′–s′′), checks whethersbegins with (the data
    bits of) s′, and removes s′ froms on success. On failure throws a
    cell deserialization exception. PrimitiveSDPFXREVcan be considered a
    quiet version ofSDBEGINSX.
- D727—SDBEGINSXQ(s s′–s′′− 1 ors 0 ), a quiet version ofSDBEGINSX.
- D72A_xsss—SDBEGINS(s–s′′), checks whethersbegins with constant
    bitstringsssof length 8 x+ 3(with continuation bit assumed), where
    0 ≤x≤ 127 , and removessssfromson success.
- D72802 —SDBEGINS ‘0’ (s– s′′), checks whether sbegins with a
    binary zero.
- D72806 —SDBEGINS ‘1’ (s– s′′), checks whether sbegins with a
    binary one.
- D72E_xsss—SDBEGINSQ(s–s′′− 1 ors 0 ), a quiet version ofSDBEGINS.
- D730—SCUTFIRST(s l r–s′), returns the first 0 ≤l≤ 1023 bits and
    first 0 ≤r≤ 4 references ofs.
- D731—SSKIPFIRST(s l r–s′).
- D732—SCUTLAST(s l r–s′), returns the last 0 ≤l≤ 1023 data bits
    and last 0 ≤r≤ 4 references ofs.
- D733—SSKIPLAST(s l r–s′).
- D734—SUBSLICE(s l r l′ r′ –s′), returns 0 ≤l′ ≤ 1023 bits and
    0 ≤r′≤ 4 references fromSlices, after skipping the first 0 ≤l≤ 1023
    bits and first 0 ≤r≤ 4 references.
- D736—SPLIT(s l r–s′s′′), splits the first 0 ≤l≤ 1023 data bits and
    first 0 ≤r≤ 4 references fromsintos′, returning the remainder ofs
    ass′′.
- D737—SPLITQ(s l r–s′s′′− 1 ors 0 ), a quiet version ofSPLIT.
- D739—XCTOS(c–s?), transforms an ordinary or exotic cell into a
    Slice, as if it were an ordinary cell. A flag is returned indicating whether
    cis exotic. If that be the case, its type can later be deserialized from
    the first eight bits ofs.


```
A.7. Cell primitives
```
- D73A—XLOAD(c–c′), loads an exotic cellcand returns an ordinary
    cellc′. Ifcis already ordinary, does nothing. Ifccannot be loaded,
    throws an exception.
- D73B—XLOADQ(c–c′− 1 orc 0 ), loads an exotic cellcasXLOAD, but
    returns 0 on failure.
- D741—SCHKBITS(s l– ), checks whether there are at leastldata bits
    inSlices. If this is not the case, throws a cell deserialisation (i.e., cell
    underflow) exception.
- D742—SCHKREFS(s r– ), checks whether there are at leastrreferences
    inSlices.
- D743—SCHKBITREFS(s l r– ), checks whether there are at least l
    data bits andrreferences inSlices.
- D745—SCHKBITSQ(s l–?), checks whether there are at leastldata
    bits inSlices.
- D746—SCHKREFSQ(s r–?), checks whether there are at leastrrefer-
    ences inSlices.
- D747—SCHKBITREFSQ(s l r–?), checks whether there are at leastl
    data bits andrreferences inSlices.
- D748—PLDREFVAR(s n–c), returns then-th cell reference ofSlices
    for 0 ≤n≤ 3.
- D749—SBITS(s–l), returns the number of data bits inSlices.
- D74A—SREFS(s–r), returns the number of references inSlices.
- D74B—SBITREFS(s–l r), returns both the number of data bits and
    the number of references ins.
- D74E_n — PLDREFIDX n (s– c), returns the n-th cell reference of
    Slices, where 0 ≤n≤ 3.
- D74C—PLDREF(s–c), preloads the first cell reference of aSlice.
- D750—LDILE4(s–x s′), loads a little-endian signed 32-bit integer.


```
A.7. Cell primitives
```
- D751—LDULE4(s–x s′), loads a little-endian unsigned 32-bit integer.
- D752—LDILE8(s–x s′), loads a little-endian signed 64-bit integer.
- D753—LDULE8(s–x s′), loads a little-endian unsigned 64-bit integer.
- D754—PLDILE4(s–x), preloads a little-endian signed 32-bit integer.
- D755—PLDULE4(s–x), preloads a little-endian unsigned 32-bit inte-
    ger.
- D756—PLDILE8(s–x), preloads a little-endian signed 64-bit integer.
- D757—PLDULE8(s–x), preloads a little-endian unsigned 64-bit inte-
    ger.
- D758—LDILE4Q (s–x s′ − 1 or s 0 ), quietly loads a little-endian
    signed 32-bit integer.
- D759—LDULE4Q (s–x s′ − 1 or s 0 ), quietly loads a little-endian
    unsigned 32-bit integer.
- D75A—LDILE8Q (s–x s′ − 1 or s 0 ), quietly loads a little-endian
    signed 64-bit integer.
- D75B—LDULE8Q (s–x s′ − 1 or s 0 ), quietly loads a little-endian
    unsigned 64-bit integer.
- D75C— PLDILE4Q(s–x− 1 or 0 ), quietly preloads a little-endian
    signed 32-bit integer.
- D75D— PLDULE4Q(s–x− 1 or 0 ), quietly preloads a little-endian
    unsigned 32-bit integer.
- D75E— PLDILE8Q(s–x− 1 or 0 ), quietly preloads a little-endian
    signed 64-bit integer.
- D75F— PLDULE8Q(s–x− 1 or 0 ), quietly preloads a little-endian
    unsigned 64-bit integer.
- D760—LDZEROES(s–n s′), returns the countnof leading zero bits
    ins, and removes these bits froms.


### A.8 Continuation and control flow primitives

- D761—LDONES(s–n s′), returns the countnof leading one bits ins,
    and removes these bits froms.
- D762—LDSAME(s x–n s′), returns the countnof leading bits equal
    to 0 ≤x≤ 1 ins, and removes these bits froms.
- D764— SDEPTH(s–x), returns the depth ofSlice s. Ifshas no
    references, thenx= 0; otherwisexis one plus the maximum of depths
    of cells referred to froms.
- D765 —CDEPTH (c – x), returns the depth of Cell c. Ifc has no
    references, thenx= 0; otherwisexis one plus the maximum of depths
    of cells referred to fromc. Ifcis aNullinstead of aCell, returns zero.

### A.8 Continuation and control flow primitives

A.8.1. Unconditional control flow primitives.

- D8—EXECUTEorCALLX(c– ),calls orexecutes continuationc(i.e.,
    cc←c◦ 0 cc).
- D9—JMPX(c– ),jumps, or transfers control, to continuationc(i.e.,
    cc←c◦ 0 c0, or rathercc←(c◦ 0 c0)◦ 1 c1). The remainder of the
    previous current continuationccis discarded.
- DApr—CALLXARGS p,r(c– ),callscontinuationcwithpparameters
    and expectingrreturn values, 0 ≤p≤ 15 , 0 ≤r≤ 15.
- DB0p—CALLXARGS p,− 1 (c– ),callscontinuationcwith 0 ≤p≤ 15
    parameters, expecting an arbitrary number of return values.
- DB1p—JMPXARGS p(c– ),jumpsto continuationc, passing only the
    top 0 ≤p≤ 15 values from the current stack to it (the remainder of
    the current stack is discarded).
- DB2r—RETARGS r,returnstoc0, with 0 ≤r≤ 15 return values taken
    from the current stack.
- DB30—RETorRETTRUE,returnsto the continuation atc0(i.e., per-
    forms cc ← c0). The remainder of the current continuation cc is
    discarded. Approximately equivalent toPUSH c0;JMPX.


```
A.8. Continuation and control flow primitives
```
- DB31—RETALTorRETFALSE,returnsto the continuation atc1(i.e.,
    cc←c1). Approximately equivalent toPUSH c1;JMPX.
- DB32—BRANCHorRETBOOL(f– ), performsRETTRUEif integerf 6 = 0,
    orRETFALSEiff= 0.
- DB34—CALLCC(c– ),call with current continuation, transfers control
    toc, pushing the old value ofccintoc’s stack (instead of discarding it
    or writing it into newc0).
- DB35—JMPXDATA(c– ), similar toCALLCC, but the remainder of the
    current continuation (the old value ofcc) is converted into aSlicebefore
    pushing it into the stack ofc.
- DB36pr—CALLCCARGS p,r(c– ), similar toCALLXARGS, but pushes
    the old value ofcc(along with the top 0 ≤p≤ 15 values from the
    original stack) into the stack of newly-invoked continuationc, setting
    cc.nargsto− 1 ≤r≤ 14.
- DB38— CALLXVARARGS(c p r – ), similar toCALLXARGS, but takes
    − 1 ≤p,r≤ 254 from the stack. The next three operations also takep
    andrfrom the stack, both in the range− 1 ... 254.
- DB39—RETVARARGS(p r– ), similar toRETARGS.
- DB3A—JMPXVARARGS(c p r– ), similar toJMPXARGS.
- DB3B—CALLCCVARARGS(c p r– ), similar toCALLCCARGS.
- DB3C—CALLREF, equivalent toPUSHREFCONT;CALLX.
- DB3D—JMPREF, equivalent toPUSHREFCONT;JMPX.
- DB3E—JMPREFDATA, equivalent toPUSHREFCONT;JMPXDATA.
- DB3F—RETDATA, equivalent toPUSH c0; JMPXDATA. In this way, the
    remainder of the current continuation is converted into a Slice and
    returned to the caller.

A.8.2. Conditional control flow primitives.

- DC—IFRET(f – ), performs aRET, but only if integerfis non-zero.
    Iffis aNaN, throws an integer overflow exception.


```
A.8. Continuation and control flow primitives
```
- DD—IFNOTRET(f– ), performs aRET, but only if integerfis zero.
- DE—IF(f c– ), performsEXECUTEforc(i.e.,executesc), but only if
    integerfis non-zero. Otherwise simply discards both values.
- DF—IFNOT(f c– ), executes continuationc, but only if integerf is
    zero. Otherwise simply discards both values.
- E0—IFJMP(f c– ), jumps toc(similarly toJMPX), but only iff is
    non-zero.
- E1—IFNOTJMP(f c– ), jumps toc(similarly toJMPX), but only iff
    is zero.
- E2—IFELSE(f c c′– ), if integerfis non-zero, executesc, otherwise
    executesc′. Equivalent toCONDSELCHK;EXECUTE.
- E300—IFREF(f– ), equivalent toPUSHREFCONT;IF, with the opti-
    mization that the cell reference is not actually loaded into aSliceand
    then converted into an ordinaryContinuationiff= 0. Similar remarks
    apply to the next three primitives.
- E301—IFNOTREF(f– ), equivalent toPUSHREFCONT;IFNOT.
- E302—IFJMPREF(f– ), equivalent toPUSHREFCONT;IFJMP.
- E303—IFNOTJMPREF(f– ), equivalent toPUSHREFCONT;IFNOTJMP.
- E304—CONDSEL(f x y–xory), if integerfis non-zero, returnsx,
    otherwise returnsy. Notice that no type checks are performed onx
    andy; as such, it is more like a conditional stack operation. Roughly
    equivalent toROT;ISZERO;INC;ROLLX;NIP.
- E305—CONDSELCHK(f x y–xory), same asCONDSEL, but first checks
    whetherxandyhave the same type.
- E308—IFRETALT(f–), performsRETALTif integerf 6 = 0.
- E309—IFNOTRETALT(f–), performsRETALTif integerf= 0.


```
A.8. Continuation and control flow primitives
```
- E30D—IFREFELSE(f c–), equivalent toPUSHREFCONT;SWAP;IFELSE,
    with the optimization that the cell reference is not actually loaded into
    aSlice and then converted into an ordinaryContinuation iff = 0.
    Similar remarks apply to the next two primitives:Cells are converted
    intoContinuations only when necessary.
- E30E—IFELSEREF(f c–), equivalent toPUSHREFCONT;IFELSE.
- E30F—IFREFELSEREF(f–), equivalent toPUSHREFCONT;PUSHREFCONT;
    IFELSE.
- E310–E31F— reserved for loops with break operators, cf.A.8.3below.
- E39_n—IFBITJMP n(x c–x), checks whether bit 0 ≤n≤ 31 is set
    in integerx, and if so, performsJMPXto continuationc. Valuexis left
    in the stack.
- E3B_n—IFNBITJMP n(x c–x), jumps tocif bit 0 ≤n≤ 31 is not
    set in integerx.
- E3D_n—IFBITJMPREF n(x–x), performs aJMPREFif bit 0 ≤n≤ 31
    is set in integerx.
- E3F_n—IFNBITJMPREF n(x–x), performs aJMPREFif bit 0 ≤n≤ 31
    is not set in integerx.

A.8.3. Control flow primitives: loops.Most of the loop primitives listed
below are implemented with the aid of extraordinary continuations, such as
ec_until(cf.4.1.5), with the loop body and the original current continua-
tionccstored as the arguments to this extraordinary continuation. Typically
a suitable extraordinary continuation is constructed, and then saved into the
loop body continuation savelist asc0; after that, the modified loop body
continuation is loaded into cc and executed in the usual fashion. All of
these loop primitives have*BRKversions, adapted for breaking out of a loop;
they additionally setc1to the original current continuation (or originalc0
for*ENDBRKversions), and save the old c1into the savelist of the original
current continuation (or of the originalc0for*ENDBRKversions).

- E4—REPEAT(n c– ), executes continuationc ntimes, if integern
    is non-negative. If n ≥ 231 or n < − 231 , generates a range check
    exception. Notice that aRETinside the code ofcworks as acontinue,


```
A.8. Continuation and control flow primitives
```
```
not as abreak. One should use either alternative (experimental) loops
or alternativeRETALT(along with aSETEXITALTbefore the loop) to
breakout of a loop.
```
- E5 —REPEATEND (n– ), similar toREPEAT, but it is applied to the
    current continuationcc.
- E6—UNTIL(c– ), executes continuationc, then pops an integer x
    from the resulting stack. Ifxis zero, performs another iteration of
    this loop. The actual implementation of this primitive involves an
    extraordinary continuation ec_until (cf.4.1.5) with its arguments
    set to the body of the loop (continuationc) and the original current
    continuationcc. This extraordinary continuation is then saved into
    the savelist of cas c.c0 and the modifiedc is then executed. The
    other loop primitives are implemented similarly with the aid of suitable
    extraordinary continuations.
- E7—UNTILEND( – ), similar toUNTIL, but executes the current contin-
    uationccin a loop. When the loop exit condition is satisfied, performs
    aRET.
- E8 — WHILE(c′ c – ), executes c′ and pops an integerx from the
    resulting stack. Ifxis zero, exists the loop and transfers control to
    the originalcc. Ifxis non-zero, executesc, and then begins a new
    iteration.
- E9—WHILEEND(c′– ), similar toWHILE, but uses the current continu-
    ationccas the loop body.
- EA—AGAIN(c– ), similar toREPEAT, but executescinfinitely many
    times. ARETonly begins a new iteration of the infinite loop, which can
    be exited only by an exception, or aRETALT(or an explicitJMPX).
- EB—AGAINEND( – ), similar toAGAIN, but performed with respect to
    the current continuationcc.
- E314—REPEATBRK(n c– ), similar toREPEAT, but also setsc1 to
    the originalccafter saving the old value ofc1into the savelist of the
    originalcc. In this wayRETALTcould be used to break out of the loop
    body.


```
A.8. Continuation and control flow primitives
```
- E315—REPEATENDBRK(n– ), similar toREPEATEND, but also setsc1
    to the originalc0after saving the old value ofc1into the savelist of
    the originalc0. Equivalent toSAMEALTSAVE;REPEATEND.
- E316—UNTILBRK(c– ), similar toUNTIL, but also modifiesc1in the
    same way asREPEATBRK.
- E317—UNTILENDBRK( – ), equivalent toSAMEALTSAVE;UNTILEND.
- E318—WHILEBRK(c′c– ), similar toWHILE, but also modifiesc1in
    the same way asREPEATBRK.
- E319—WHILEENDBRK(c– ), equivalent toSAMEALTSAVE;WHILEEND.
- E31A—AGAINBRK(c– ), similar toAGAIN, but also modifiesc1in the
    same way asREPEATBRK.
- E31B—AGAINENDBRK( – ), equivalent toSAMEALTSAVE;AGAINEND.

A.8.4. Manipulating the stack of continuations.

- ECrn—SETCONTARGS r,n(x 1 x 2.. .xrc–c′), similar toSETCONTARGS
    r, but setsc.nargsto the final size of the stack ofc′plusn. In other
    words, transformscinto aclosureor apartially applied function, with
    0 ≤n≤ 14 arguments missing.
- EC0n—SETNUMARGS norSETCONTARGS 0 ,n(c–c′), setsc.nargsto
    nplus the current depth ofc’s stack, where 0 ≤n≤ 14. Ifc.nargsis
    already set to a non-negative value, does nothing.
- ECrF — SETCONTARGSr or SETCONTARGS r,− 1 (x 1 x 2.. .xr c – c′),
    pushes 0 ≤ r≤ 15 valuesx 1 ...xr into the stack of (a copy of) the
    continuationc, starting withx 1. If the final depth ofc’s stack turns
    out to be greater thanc.nargs, a stack overflow exception is generated.
- ED0p—RETURNARGS p( – ), leaves only the top 0 ≤ p≤ 15 values
    in the current stack (somewhat similarly toONLYTOPX), with all the
    unused bottom values not discarded, but saved into continuationc0in
    the same way asSETCONTARGSdoes.
- ED10—RETURNVARARGS(p– ), similar toRETURNARGS, but with Integer
    0 ≤p≤ 255 taken from the stack.


```
A.8. Continuation and control flow primitives
```
- ED11—SETCONTVARARGS(x 1 x 2.. .xrc r n–c′), similar toSETCONTARGS,
    but with 0 ≤r≤ 255 and− 1 ≤n≤ 255 taken from the stack.
- ED12—SETNUMVARARGS(c n–c′), where− 1 ≤n≤ 255. Ifn=− 1 ,
    this operation does nothing (c′=c). Otherwise its action is similar to
    SETNUMARGS n, but withntaken from the stack.

A.8.5. Creating simple continuations and closures.

- ED1E— BLESS(s –c), transforms aSlice sinto a simple ordinary
    continuationc, withc.code=sand an empty stack and savelist.
- ED1F—BLESSVARARGS(x 1.. .xrs r n–c), equivalent toROT;BLESS;
    ROTREV;SETCONTVARARGS.
- EErn—BLESSARGS r,n(x 1.. .xr s– c), where 0 ≤ r ≤ 15 , − 1 ≤
    n ≤ 14 , equivalent to BLESS; SETCONTARGS r,n. The value of n is
    represented inside the instruction by the 4-bit integernmod 16.
- EE0n—BLESSNUMARGS norBLESSARGS 0,n(s–c), also transforms a
    Slicesinto aContinuationc, but setsc.nargsto 0 ≤n≤ 14.

A.8.6. Operations with continuation savelists and control registers.

- ED4i—PUSH c(i)orPUSHCTR c(i)( –x), pushes the current value of
    control registerc(i). If the control register is not supported in the cur-
    rent codepage, or if it does not have a value, an exception is triggered.
- ED44—PUSH c4orPUSHROOT, pushes the “global data root” cell refer-
    ence, thus enabling access to persistent smart-contract data.
- ED5i—POP c(i)orPOPCTR c(i)(x– ), pops a valuexfrom the stack
    and stores it into control registerc(i), if supported in the current code-
    page. Notice that if a control register accepts only values of a specific
    type, a type-checking exception may occur.
- ED54—POP c4orPOPROOT, sets the “global data root” cell reference,
    thus allowing modification of persistent smart-contract data.
- ED6i—SETCONT c(i)orSETCONTCTR c(i)(x c–c′), storesxinto the
    savelist of continuationcasc(i), and returns the resulting continuation
    c′. Almost all operations with continuations may be expressed in terms
    ofSETCONTCTR,POPCTR, andPUSHCTR.


```
A.8. Continuation and control flow primitives
```
- ED7i—SETRETCTR c(i)(x– ), equivalent toPUSH c0; SETCONTCTR
    c(i);POP c0.
- ED8i—SETALTCTR c(i)(x– ), equivalent toPUSH c1; SETCONTCTR
    c(i);POP c0.
- ED9i—POPSAVE c(i)orPOPCTRSAVE c(i)(x–), similar toPOP c(i),
    but also saves the old value ofc(i)into continuationc0. Equivalent
    (up to exceptions) toSAVECTR c(i);POP c(i).
- EDAi—SAVE c(i)or SAVECTR c(i)( – ), saves the current value of
    c(i)into the savelist of continuationc0. If an entry forc(i)is already
    present in the savelist ofc0, nothing is done. Equivalent toPUSH c(i);
    SETRETCTR c(i).
- EDBi—SAVEALT c(i)orSAVEALTCTR c(i)( – ), similar toSAVE c(i),
    but saves the current value ofc(i)into the savelist ofc1, notc0.
- EDCi—SAVEBOTH c(i)orSAVEBOTHCTR c(i)( – ), equivalent toDUP;
    SAVE c(i);SAVEALT c(i).
- EDE0—PUSHCTRX(i–x), similar toPUSHCTR c(i), but withi, 0 ≤i≤
    255 , taken from the stack. Notice that this primitive is one of the few
    “exotic” primitives, which are not polymorphic like stack manipulation
    primitives, and at the same time do not have well-defined types of
    parameters and return values, because the type ofxdepends oni.
- EDE1—POPCTRX(x i– ), similar toPOPCTR c(i), but with 0 ≤i≤ 255
    from the stack.
- EDE2—SETCONTCTRX(x c i–c′), similar toSETCONTCTR c(i), but with
    0 ≤i≤ 255 from the stack.
- EDF0—COMPOSorBOOLAND(c c′–c′′), computes the compositionc◦ 0 c′,
    which has the meaning of “performc, and, if successful, performc′” (if
    cis a boolean circuit) or simply “performc, then c′”. Equivalent to
    SWAP;SETCONT c0.
- EDF1—COMPOSALT or BOOLOR(c c′ – c′′), computes the alternative
    compositionc◦ 1 c′, which has the meaning of “performc, and, if not
    successful, performc′” (ifcis a boolean circuit). Equivalent toSWAP;
    SETCONT c1.


```
A.8. Continuation and control flow primitives
```
- EDF2—COMPOSBOTH(c c′–c′′), computes(c◦ 0 c′)◦ 1 c′, which has the
    meaning of “compute boolean circuitc, then computec′, regardless of
    the result ofc”.
- EDF3—ATEXIT(c– ), setsc0←c◦ 0 c0. In other words,cwill be
    executed before exiting current subroutine.
- EDF4—ATEXITALT(c– ), setsc1←c◦ 1 c1. In other words,cwill
    be executed before exiting current subroutine by its alternative return
    path.
- EDF5—SETEXITALT(c– ), setsc1 ←(c◦ 0 c0)◦ 1 c1. In this way,
    a subsequentRETALTwill first executec, then transfer control to the
    originalc0. This can be used, for instance, to exit from nested loops.
- EDF6—THENRET(c–c′), computesc′:=c◦ 0 c0
- EDF7—THENRETALT(c–c′), computesc′:=c◦ 0 c1
- EDF8—INVERT( – ), interchangesc0andc1.
- EDF9—BOOLEVAL(c–?), performscc←

#### (

```
c◦ 0 ((PUSH−1)◦ 0 cc)
```
#### )

#### ◦ 1

```
((PUSH0)◦ 0 cc). Ifcrepresents a boolean circuit, the net effect is to
evaluate it and push either− 1 or 0 into the stack before continuing.
```
- EDFA—SAMEALT( – ), setsc 1 :=c 0. Equivalent toPUSH c0;POP c1.
- EDFB—SAMEALTSAVE( – ), setsc 1 :=c 0 , but first saves the old value
    ofc 1 into the savelist ofc 0. Equivalent toSAVE c1;SAMEALT.
- EErn—BLESSARGS r,n(x 1.. .xrs–c), described inA.8.4.

A.8.7. Dictionary subroutine calls and jumps.

- F0n—CALL norCALLDICT n( –n), calls the continuation inc3, push-
    ing integer 0 ≤n≤ 255 into its stack as an argument. Approximately
    equivalent toPUSHINT n;PUSH c3;EXECUTE.
- F12_n—CALLnfor 0 ≤n < 214 ( –n), an encoding ofCALL nfor
    larger values ofn.


### A.9 Exception generating and handling primitives

- F16_n—JMP norJMPDICT n( –n), jumps to the continuation inc3,
    pushing integer 0 ≤n < 214 as its argument. Approximately equivalent
    toPUSHINT n;PUSH c3;JMPX.
- F1A_n—PREPARE norPREPAREDICT n( –n c), equivalent toPUSHINT
    n; PUSH c3, for 0 ≤n < 214. In this way, CALL nis approximately
    equivalent toPREPARE n;EXECUTE, andJMP nis approximately equiv-
    alent toPREPARE n; JMPX. One might use, for instance,CALLARGSor
    CALLCCinstead ofEXECUTEhere.

### A.9 Exception generating and handling primitives

A.9.1. Throwing exceptions.

- F22_nn—THROW nn( – 0 nn), throws exception 0 ≤nn≤ 63 with
    parameter zero. In other words, it transfers control to the continuation
    inc2, pushing 0 andnninto its stack, and discarding the old stack
    altogether.
- F26_nn—THROWIF nn(f – ), throws exception 0 ≤ nn≤ 63 with
    parameter zero only if integerf 6 = 0.
- F2A_nn—THROWIFNOTnn(f– ), throws exception 0 ≤nn≤ 63 with
    parameter zero only if integerf= 0.
- F2C4_nn—THROWnnfor 0 ≤nn < 211 , an encoding ofTHROWnnfor
    larger values ofnn.
- F2CC_nn—THROWARG nn(x–x nn), throws exception 0 ≤ nn <
    211 with parameterx, by copyingxandnninto the stack ofc2and
    transferring control toc2.
- F2D4_nn—THROWIF nn(f– ) for 0 ≤nn < 211.
- F2DC_nn—THROWARGIF nn(x f – ), throws exception 0 ≤nn < 211
    with parameterxonly if integerf 6 = 0.
- F2E4_nn—THROWIFNOT nn(f– ) for 0 ≤nn < 211.
- F2EC_nn—THROWARGIFNOT nn(x f– ), throws exception 0 ≤nn <
    211 with parameterxonly if integerf= 0.


### A.10 Dictionary manipulation primitives

- F2F0—THROWANY(n– 0 n), throws exception 0 ≤n < 216 with parame-
    ter zero. Approximately equivalent toPUSHINT 0;SWAP;THROWARGANY.
- F2F1—THROWARGANY(x n–x n), throws exception 0 ≤n < 216 with
    parameterx, transferring control to the continuation inc2. Approxi-
    mately equivalent toPUSH c2;JMPXARGS 2.
- F2F2—THROWANYIF(n f – ), throws exception 0 ≤ n < 216 with
    parameter zero only iff 6 = 0.
- F2F3—THROWARGANYIF(x n f– ), throws exception 0 ≤n < 216 with
    parameterxonly iff 6 = 0.
- F2F4—THROWANYIFNOT(n f – ), throws exception 0 ≤n < 216 with
    parameter zero only iff= 0.
- F2F5—THROWARGANYIFNOT(x n f– ), throws exception 0 ≤n < 216
    with parameterxonly iff= 0.

A.9.2. Catching and handling exceptions.

- F2FF—TRY(c c′– ), setsc2toc′, first saving the old value ofc2both
    into the savelist ofc′and into the savelist of the current continuation,
    which is stored intoc.c0andc′.c0. Then runscsimilarly toEXECUTE.
    Ifcdoes not throw any exceptions, the original value ofc2is automati-
    cally restored on return fromc. If an exception occurs, the execution is
    transferred toc′, but the original value ofc2is restored in the process,
    so thatc′can re-throw the exception byTHROWANYif it cannot handle
    it by itself.
- F3pr —TRYARGS p,r (c c′ – ), similar to TRY, but with CALLARGS
    p,r internally used instead ofEXECUTE. In this way, all but the top
    0 ≤ p≤ 15 stack elements will be saved into current continuation’s
    stack, and then restored upon return from eithercorc′, with the top
    0 ≤ r ≤ 15 values of the resulting stack ofcorc′ copied as return
    values.

### A.10 Dictionary manipulation primitives

TVM’s dictionary support is discussed at length in3.3. The basic opera-
tions with dictionaries are listed in3.3.10, while the taxonomy of dictionary


```
A.10. Dictionary manipulation primitives
```
manipulation primitives is provided in3.3.11. Here we use the concepts and
notation introduced in those sections.
Dictionaries admit two different representations as TVM stack values:

- ASliceswith a serialization of a TL-B value of typeHashmapE(n,X).
    In other words,sconsists either of one bit equal to zero (if the dic-
    tionary is empty), or of one bit equal to one and a reference to aCell
    containing the root of the binary tree, i.e., a serialized value of type
    Hashmap(n,X).
- A “maybeCell”c?, i.e., a value that is either aCell(containing a seri-
    alized value of typeHashmap(n,X)as before) or aNull(corresponding
    to an empty dictionary). When a “maybeCell”c?is used to represent
    a dictionary, we usually denote it byDin the stack notation.

Most of the dictionary primitives listed below accept and return dictionar-
ies in the second form, which is more convenient for stack manipulation.
However, serialized dictionaries inside larger TL-B objects use the first rep-
resentation.
Opcodes starting withF4andF5are reserved for dictionary operations.

A.10.1. Dictionary creation.

- 6D—NEWDICT( –D), returns a new empty dictionary. It is an alter-
    native mnemonics forPUSHNULL, cf.A.3.1.
- 6E—DICTEMPTY(D–?), checks whether dictionaryDis empty, and
    returns− 1 or 0 accordingly. It is an alternative mnemonics forISNULL,
    cf.A.3.1.

A.10.2. Dictionary serialization and deserialization.

- CE—STDICTS(s b–b′), stores aSlice-represented dictionarysinto
    Builder b. It is actually a synonym forSTSLICE.
- F400—STDICTorSTOPTREF(D b–b′), stores dictionaryDintoBuilder
    b, returing the resulting Builder b′. In other words, if Dis a cell,
    performsSTONEand STREF; if Dis Null, performsNIP andSTZERO;
    otherwise throws a type checking exception.
- F401—SKIPDICTorSKIPOPTREF(s–s′), equivalent toLDDICT;NIP.


```
A.10. Dictionary manipulation primitives
```
- F402—LDDICTS(s–s′s′′), loads (parses) a (Slice-represented) dic-
    tionarys′fromSlices, and returns the remainder ofsass′′. This is a
    “split function” for allHashmapE(n,X)dictionary types.
- F403—PLDDICTS(s–s′), preloads a (Slice-represented) dictionarys′
    fromSlices. Approximately equivalent toLDDICTS;DROP.
- F404—LDDICTorLDOPTREF(s–D s′), loads (parses) a dictionaryD
    fromSlices, and returns the remainder ofsass′. May be applied to
    dictionaries or to values of arbitrary(ˆY)?types.
- F405—PLDDICTorPLDOPTREF(s–D), preloads a dictionaryDfrom
    Slices. Approximately equivalent toLDDICT;DROP.
- F406—LDDICTQ(s–D s′− 1 ors 0 ), a quiet version ofLDDICT.
- F407—PLDDICTQ(s–D− 1 or 0 ), a quiet version ofPLDDICT.

A.10.3.Getdictionary operations.

- F40A—DICTGET(k D n–x− 1 or 0 ), looks up keyk(represented by
    aSlice, the first 0 ≤n≤ 1023 data bits of which are used as a key)
    in dictionaryDof typeHashmapE(n,X)withn-bit keys. On success,
    returns the value found as aSlicex.
- F40B—DICTGETREF(k D n–c− 1 or 0 ), similar toDICTGET, but with
    aLDREF;ENDSapplied toxon success. This operation is useful for
    dictionaries of typeHashmapE(n,ˆY).
- F40C—DICTIGET(i D n–x− 1 or 0 ), similar toDICTGET, but with
    a signed (big-endian)n-bitInteger ias a key. Ifidoes not fit inton
    bits, returns 0. Ifiis aNaN, throws an integer overflow exception.
- F40D—DICTIGETREF(i D n–c− 1 or 0 ), combinesDICTIGETwith
    DICTGETREF: it uses signedn-bitInteger ias a key and returns aCell
    instead of aSliceon success.
- F40E—DICTUGET(i D n–x− 1 or 0 ), similar toDICTIGET, but with
    unsigned(big-endian)n-bitIntegeriused as a key.
- F40F—DICTUGETREF(i D n–c− 1 or 0 ), similar toDICTIGETREF, but
    with an unsignedn-bitInteger keyi.


```
A.10. Dictionary manipulation primitives
```
A.10.4.Set/Replace/Adddictionary operations. The mnemonics of
the following dictionary primitives are constructed in a systematic fashion
according to the regular expressionDICT[,I,U](SET,REPLACE,ADD)[GET][REF]
depending on the type of the key used (a Slice or a signed or unsigned
Integer), the dictionary operation to be performed, and the way the values
are accepted and returned (asCells or asSlices). Therefore, we provide a
detailed description only for some primitives, assuming that this information
is sufficient for the reader to understand the precise action of the remaining
primitives.

- F412—DICTSET(x k D n–D′), sets the value associated withn-bit
    keyk(represented by aSliceas inDICTGET) in dictionaryD(also rep-
    resented by aSlice) to valuex(again aSlice), and returns the resulting
    dictionary asD′.
- F413—DICTSETREF(c k D n–D′), similar toDICTSET, but with the
    value set to a reference toCellc.
- F414—DICTISET(x i D n–D′), similar toDICTSET, but with the
    key represented by a (big-endian) signedn-bit integeri. Ifidoes not
    fit intonbits, a range check exception is generated.
- F415—DICTISETREF(c i D n–D′), similar toDICTSETREF, but with
    the key a signedn-bit integer as inDICTISET.
- F416—DICTUSET(x i D n–D′), similar toDICTISET, but withian
    unsignedn-bit integer.
- F417—DICTUSETREF(c i D n–D′), similar toDICTISETREF, but with
    iunsigned.
- F41A—DICTSETGET(x k D n–D′y− 1 orD′ 0 ), combinesDICTSET
    withDICTGET: it sets the value corresponding to keyktox, but also
    returns the old valueyassociated with the key in question, if present.
- F41B —DICTSETGETREF (c k D n –D′ c′ − 1 or D′ 0 ), combines
    DICTSETREFwithDICTGETREFsimilarly toDICTSETGET.
- F41C—DICTISETGET(x i D n–D′y− 1 orD′ 0 ), similar toDICTSETGET,
    but with the key represented by a big-endian signedn-bitIntegeri.


```
A.10. Dictionary manipulation primitives
```
- F41D—DICTISETGETREF(c i D n –D′ c′− 1 orD′ 0 ), a version of
    DICTSETGETREFwith signedIntegerias a key.
- F41E—DICTUSETGET(x i D n–D′y− 1 orD′ 0 ), similar toDICTISETGET,
    but withian unsignedn-bit integer.
- F41F—DICTUSETGETREF(c i D n–D′c′− 1 orD′ 0 ).
- F422—DICTREPLACE(x k D n–D′− 1 orD 0 ), aReplaceoperation,
    which is similar toDICTSET, but sets the value of keykin dictionary
    Dtoxonly if the keykwas already present inD.
- F423— DICTREPLACEREF (c k D n– D′ − 1 or D 0 ), a Replace
    counterpart ofDICTSETREF.
- F424—DICTIREPLACE(x i D n–D′− 1 orD 0 ), a version ofDICTREPLACE
    with signedn-bitIntegeriused as a key.
- F425—DICTIREPLACEREF(c i D n–D′− 1 orD 0 ).
- F426—DICTUREPLACE(x i D n–D′− 1 orD 0 ).
- F427—DICTUREPLACEREF(c i D n–D′− 1 orD 0 ).
- F42A—DICTREPLACEGET(x k D n–D′y− 1 orD 0 ), aReplace
    counterpart ofDICTSETGET: on success, also returns the old value asso-
    ciated with the key in question.
- F42B—DICTREPLACEGETREF(c k D n–D′c′− 1 orD 0 ).
- F42C—DICTIREPLACEGET(x i D n–D′y− 1 orD 0 ).
- F42D—DICTIREPLACEGETREF(c i D n–D′c′− 1 orD 0 ).
- F42E—DICTUREPLACEGET(x i D n–D′y− 1 orD 0 ).
- F42F—DICTUREPLACEGETREF(c i D n–D′c′− 1 orD 0 ).
- F432—DICTADD(x k D n–D′− 1 orD 0 ), anAddcounterpart of
    DICTSET: sets the value associated with keykin dictionaryDtox, but
    only if it is not already present inD.
- F433—DICTADDREF(c k D n–D′− 1 orD 0 ).


```
A.10. Dictionary manipulation primitives
```
- F434—DICTIADD(x i D n–D′− 1 orD 0 ).
- F435—DICTIADDREF(c i D n–D′− 1 orD 0 ).
- F436—DICTUADD(x i D n–D′− 1 orD 0 ).
- F437—DICTUADDREF(c i D n–D′− 1 orD 0 ).
- F43A—DICTADDGET(x k D n–D′− 1 orD y 0 ), anAddcounterpart
    ofDICTSETGET: sets the value associated with keykin dictionaryDto
    x, but only if keykis not already present inD. Otherwise, just returns
    the old valueywithout changing the dictionary.
- F43B—DICTADDGETREF(c k D n–D′− 1 orD c′ 0 ), anAddcoun-
    terpart ofDICTSETGETREF.
- F43C—DICTIADDGET(x i D n–D′− 1 orD y 0 ).
- F43D—DICTIADDGETREF(c i D n–D′− 1 orD c′ 0 ).
- F43E—DICTUADDGET(x i D n–D′− 1 orD y 0 ).
- F43F—DICTUADDGETREF(c i D n–D′− 1 orD c′ 0 ).

A.10.5. Builder-accepting variants of Set dictionary operations.
The following primitives accept the new value as aBuilderbinstead of a
Slicex, which often is more convenient if the value needs to be serialized from
several components computed in the stack. (This is reflected by appending
aBto the mnemonics of the correspondingSetprimitives that work with
Slices.) The net effect is roughly equivalent to convertingbinto aSlice by
ENDC;CTOSand executing the corresponding primitive listed inA.10.4.

- F441—DICTSETB(b k D n–D′).
- F442—DICTISETB(b i D n–D′).
- F443—DICTUSETB(b i D n–D′).
- F445—DICTSETGETB(b k D n–D′y− 1 orD′ 0 ).
- F446—DICTISETGETB(b i D n–D′y− 1 orD′ 0 ).
- F447—DICTUSETGETB(b i D n–D′y− 1 orD′ 0 ).


```
A.10. Dictionary manipulation primitives
```
- F449—DICTREPLACEB(b k D n–D′− 1 orD 0 ).
- F44A—DICTIREPLACEB(b i D n–D′− 1 orD 0 ).
- F44B—DICTUREPLACEB(b i D n–D′− 1 orD 0 ).
- F44D—DICTREPLACEGETB(b k D n–D′y− 1 orD 0 ).
- F44E—DICTIREPLACEGETB(b i D n–D′y− 1 orD 0 ).
- F44F—DICTUREPLACEGETB(b i D n–D′y− 1 orD 0 ).
- F451—DICTADDB(b k D n–D′− 1 orD 0 ).
- F452—DICTIADDB(b i D n–D′− 1 orD 0 ).
- F453—DICTUADDB(b i D n–D′− 1 orD 0 ).
- F455—DICTADDGETB(b k D n–D′− 1 orD y 0 ).
- F456—DICTIADDGETB(b i D n–D′− 1 orD y 0 ).
- F457—DICTUADDGETB(b i D n–D′− 1 orD y 0 ).

A.10.6.Deletedictionary operations.

- F459—DICTDEL(k D n–D′− 1 orD 0 ), deletesn-bit key, represented
    by aSlice k, from dictionaryD. If the key is present, returns the
    modified dictionaryD′and the success flag− 1. Otherwise, returns the
    original dictionaryDand 0.
- F45A—DICTIDEL(i D n–D′?), a version ofDICTDELwith the key
    represented by a signedn-bitIntegeri. If idoes not fit intonbits,
    simply returnsD 0 (“key not found, dictionary unmodified”).
- F45B—DICTUDEL(i D n–D′?), similar toDICTIDEL, but withian
    unsignedn-bit integer.
- F462—DICTDELGET(k D n –D′ x− 1 or D 0 ), deletesn-bit key,
    represented by aSlice k, from dictionaryD. If the key is present,
    returns the modified dictionaryD′, the original valuexassociated with
    the keyk(represented by aSlice), and the success flag− 1. Otherwise,
    returns the original dictionaryDand 0.


```
A.10. Dictionary manipulation primitives
```
- F463—DICTDELGETREF(k D n–D′c− 1 orD 0 ), similar toDICTDELGET,
    but with LDREF; ENDSapplied toxon success, so that the value re-
    turnedcis aCell.
- F464—DICTIDELGET(i D n–D′x− 1 orD 0 ), a variant of primitive
    DICTDELGETwith signedn-bit integerias a key.
- F465 —DICTIDELGETREF (i D n –D′ c − 1 or D 0 ), a variant of
    primitiveDICTIDELGETreturning aCellinstead of aSlice.
- F466—DICTUDELGET(i D n–D′x− 1 orD 0 ), a variant of primitive
    DICTDELGETwith unsignedn-bit integerias a key.
- F467 —DICTUDELGETREF (i D n –D′ c − 1 or D 0 ), a variant of
    primitiveDICTUDELGETreturning aCellinstead of aSlice.

A.10.7. “Maybe reference” dictionary operations. The following op-
erations assume that a dictionary is used to store valuesc? of typeCell?
(“Maybe Cell”), which can be used in particular to store dictionaries as val-
ues in other dictionaries. The representation is as follows: ifc?is aCell, it
is stored as a value with no data bits and exactly one reference to thisCell.
Ifc?isNull, then the corresponding key must be absent from the dictionary
altogether.

- F469—DICTGETOPTREF(k D n–c?), a variant of DICTGETREFthat
    returnsNullinstead of the valuec?if the keykis absent from dictio-
    naryD.
- F46A—DICTIGETOPTREF(i D n–c?), similar toDICTGETOPTREF, but
    with the key given by signedn-bitIntegeri. If the keyiis out of range,
    also returnsNull.
- F46B—DICTUGETOPTREF(i D n–c?), similar toDICTGETOPTREF, but
    with the key given by unsignedn-bitIntegeri.
- F46D —DICTSETGETOPTREF (c? k D n – D′ ̃c?), a variant of both
    DICTGETOPTREFandDICTSETGETREFthat sets the value corresponding
    to keykin dictionaryDto c?(if c?isNull, then the key is deleted
    instead), and returns the old value ̃c?(if the keykwas absent before,
    returnsNullinstead).


```
A.10. Dictionary manipulation primitives
```
- F46E—DICTISETGETOPTREF(c?i D n–D′ ̃c?), similar to primitive
    DICTSETGETOPTREF, but using signedn-bitInteger ias a key. Ifidoes
    not fit intonbits, throws a range checking exception.
- F46F—DICTUSETGETOPTREF(c?i D n–D′ ̃c?), similar to primitive
    DICTSETGETOPTREF, but using unsignedn-bitIntegerias a key.

A.10.8. Prefix code dictionary operations. These are some basic op-
erations for constructing prefix code dictionaries (cf.3.4.2). The primary
application for prefix code dictionaries is deserializing TL-B serialized data
structures, or, more generally, parsing prefix codes. Therefore, most prefix
code dictionaries will be constant and created at compile time, not by the
following primitives.
SomeGetoperations for prefix code dictionaries may be found inA.10.11.
Other prefix code dictionary operations include:

- F470—PFXDICTSET(x k D n–D′− 1 orD 0 ).
- F471—PFXDICTREPLACE(x k D n–D′− 1 orD 0 ).
- F472—PFXDICTADD(x k D n–D′− 1 orD 0 ).
- F473—PFXDICTDEL(k D n–D′− 1 orD 0 ).

These primitives are completely similar to their non-prefix code counterparts
DICTSETetc (cf.A.10.4), with the obvious difference that even aSetmay fail
in a prefix code dictionary, so a success flag must be returned byPFXDICTSET
as well.

A.10.9. Variants of GetNextandGetPrevoperations.

- F474—DICTGETNEXT(k D n–x′k′− 1 or 0 ), computes the minimal
    key k′ in dictionaryD that is lexicographically greater thank, and
    returnsk′(represented by aSlice) along with associated valuex′(also
    represented by aSlice).
- F475—DICTGETNEXTEQ(k D n–x′k′− 1 or 0 ), similar toDICTGETNEXT,
    but computes the minimal keyk′that is lexicographically greater than
    or equal tok.
- F476—DICTGETPREV(k D n–x′k′− 1 or 0 ), similar toDICTGETNEXT,
    but computes the maximal keyk′lexicographically smaller thank.


```
A.10. Dictionary manipulation primitives
```
- F477—DICTGETPREVEQ(k D n–x′k′− 1 or 0 ), similar toDICTGETPREV,
    but computes the maximal key k′ lexicographically smaller than or
    equal tok.
- F478—DICTIGETNEXT(i D n–x′i′− 1 or 0 ), similar toDICTGETNEXT,
    but interprets all keys in dictionaryDas big-endian signedn-bit in-
    tegers, and computes the minimal keyi′ that is larger thanIntegeri
    (which does not necessarily fit intonbits).
- F479—DICTIGETNEXTEQ(i D n–x′i′− 1 or 0 ).
- F47A—DICTIGETPREV(i D n–x′i′− 1 or 0 ).
- F47B—DICTIGETPREVEQ(i D n–x′i′− 1 or 0 ).
- F47C—DICTUGETNEXT(i D n–x′i′− 1 or 0 ), similar toDICTGETNEXT,
    but interprets all keys in dictionaryD as big-endian unsignedn-bit
    integers, and computes the minimal keyi′that is larger thanIntegeri
    (which does not necessarily fit intonbits, and is not necessarily non-
    negative).
- F47D—DICTUGETNEXTEQ(i D n–x′i′− 1 or 0 ).
- F47E—DICTUGETPREV(i D n–x′i′− 1 or 0 ).
- F47F—DICTUGETPREVEQ(i D n–x′i′− 1 or 0 ).

A.10.10. GetMin, GetMax,RemoveMin,RemoveMax opera-
tions.

- F482—DICTMIN(D n–x k− 1 or 0 ), computes the minimal keyk
    (represented by aSlicewithndata bits) in dictionaryD, and returns
    kalong with the associated valuex.
- F483—DICTMINREF(D n –c k − 1 or 0 ), similar toDICTMIN, but
    returns the only reference in the value as aCellc.
- F484—DICTIMIN(D n–x i− 1 or 0 ), somewhat similar toDICTMIN,
    but computes the minimal keyiunder the assumption that all keys
    are big-endian signedn-bit integers. Notice that the key and value
    returned may differ from those computed byDICTMINandDICTUMIN.


```
A.10. Dictionary manipulation primitives
```
- F485—DICTIMINREF(D n–c i− 1 or 0 ).
- F486—DICTUMIN(D n–x i− 1 or 0 ), similar toDICTMIN, but returns
    the key as an unsignedn-bitIntegeri.
- F487—DICTUMINREF(D n–c i− 1 or 0 ).
- F48A—DICTMAX(D n–x k− 1 or 0 ), computes the maximal keyk
    (represented by aSlicewithndata bits) in dictionaryD, and returns
    kalong with the associated valuex.
- F48B—DICTMAXREF(D n–c k− 1 or 0 ).
- F48C—DICTIMAX(D n–x i− 1 or 0 ).
- F48D—DICTIMAXREF(D n–c i− 1 or 0 ).
- F48E—DICTUMAX(D n–x i− 1 or 0 ).
- F48F—DICTUMAXREF(D n–c i− 1 or 0 ).
- F492—DICTREMMIN(D n–D′x k− 1 orD 0 ), computes the minimal
    keyk(represented by aSlicewithndata bits) in dictionaryD, removes
    kfrom the dictionary, and returnskalong with the associated valuex
    and the modified dictionaryD′.
- F493—DICTREMMINREF(D n–D′c k− 1 orD 0 ), similar toDICTREMMIN,
    but returns the only reference in the value as aCell c.
- F494—DICTIREMMIN(D n–D′ x i− 1 orD 0 ), somewhat similar
    toDICTREMMIN, but computes the minimal keyiunder the assumption
    that all keys are big-endian signedn-bit integers. Notice that the key
    and value returned may differ from those computed byDICTREMMINand
    DICTUREMMIN.
- F495—DICTIREMMINREF(D n–D′c i− 1 orD 0 ).
- F496—DICTUREMMIN(D n–D′x i− 1 orD 0 ), similar toDICTREMMIN,
    but returns the key as an unsignedn-bitIntegeri.
- F497—DICTUREMMINREF(D n–D′c i− 1 orD 0 ).


```
A.10. Dictionary manipulation primitives
```
- F49A—DICTREMMAX(D n–D′x k− 1 orD 0 ), computes the maximal
    keyk(represented by aSlicewithndata bits) in dictionaryD, removes
    kfrom the dictionary, and returnskalong with the associated valuex
    and the modified dictionaryD′.
- F49B—DICTREMMAXREF(D n–D′c k− 1 orD 0 ).
- F49C—DICTIREMMAX(D n–D′x i− 1 orD 0 ).
- F49D—DICTIREMMAXREF(D n–D′c i− 1 orD 0 ).
- F49E—DICTUREMMAX(D n–D′x i− 1 orD 0 ).
- F49F—DICTUREMMAXREF(D n–D′c i− 1 orD 0 ).

A.10.11. SpecialGetdictionary and prefix code dictionary opera-
tions, and constant dictionaries.

- F4A0—DICTIGETJMP(i D n– ), similar toDICTIGET(cf.A.10.12),
    but withxBLESSed into a continuation with a subsequentJMPXto it
    on success. On failure, does nothing. This is useful for implementing
    switch/caseconstructions.
- F4A1—DICTUGETJMP(i D n– ), similar toDICTIGETJMP, but performs
    DICTUGETinstead ofDICTIGET.
- F4A2—DICTIGETEXEC(i D n– ), similar toDICTIGETJMP, but with
    EXECUTEinstead ofJMPX.
- F4A3—DICTUGETEXEC(i D n– ), similar toDICTUGETJMP, but with
    EXECUTEinstead ofJMPX.
- F4A6_n—DICTPUSHCONST n( –D n), pushes a non-empty constant
    dictionaryD (as aCell?) along with its key length 0 ≤ n ≤ 1023 ,
    stored as a part of the instruction. The dictionary itself is created from
    the first of remaining references of the current continuation. In this
    way, the completeDICTPUSHCONSTinstruction can be obtained by first
    serializingxF4A8_, then the non-empty dictionary itself (one 1 bit and
    a cell reference), and then the unsigned 10-bit integern(as if by aSTU
    10 instruction). An empty dictionary can be pushed by aNEWDICT
    primitive (cf.A.10.1) instead.


```
A.10. Dictionary manipulation primitives
```
- F4A8—PFXDICTGETQ(s D n–s′x s′′− 1 ors 0 ), looks up the unique
    prefix ofSlicespresent in the prefix code dictionary (cf.3.4.2) rep-
    resented byCell?Dand 0 ≤ n≤ 1023. If found, the prefix ofsis
    returned ass′, and the corresponding value (also aSlice) asx. The
    remainder ofsis returned as aSlice s′′. If no prefix ofsis a key in
    prefix code dictionaryD, returns the unchangedsand a zero flag to
    indicate failure.
- F4A9—PFXDICTGET(s D n–s′ x s′′), similar to PFXDICTGET, but
    throws a cell deserialization failure exception on failure.
- F4AA—PFXDICTGETJMP(s D n–s′s′′ors), similar toPFXDICTGETQ,
    but on successBLESSes the valuexinto aContinuationand transfers
    control to it as if by a JMPX. On failure, returnssunchanged and
    continues execution.
- F4AB—PFXDICTGETEXEC(s D n–s′s′′), similar toPFXDICTGETJMP,
    butEXECutes the continuation found instead of jumping to it. On
    failure, throws a cell deserialization exception.
- F4AE_n—PFXDICTCONSTGETJMP norPFXDICTSWITCH n(s–s′s′′or
    s), combinesDICTPUSHCONST nfor 0 ≤n≤ 1023 withPFXDICTGETJMP.
- F4BC—DICTIGETJMPZ(i D n–ior nothing), a variant ofDICTIGETJMP
    that returns indexion failure.
- F4BD—DICTUGETJMPZ(i D n–ior nothing), a variant ofDICTUGETJMP
    that returns indexion failure.
- F4BE—DICTIGETEXECZ(i D n–ior nothing), a variant ofDICTIGETEXEC
    that returns indexion failure.
- F4BF—DICTUGETEXECZ(i D n–ior nothing), a variant ofDICTUGETEXEC
    that returns indexion failure.

A.10.12.SubDictdictionary operations.

- F4B1—SUBDICTGET(k l D n–D′), constructs a subdictionary con-
    sisting of all keys beginning with prefixk(represented by aSlice, the
    first 0 ≤l≤n≤ 1023 data bits of which are used as a key) of lengthl
    in dictionaryDof typeHashmapE(n,X)withn-bit keys. On success,


### A.11 Application-specific primitives

```
returns the new subdictionary of the same typeHashmapE(n,X)as a
SliceD′.
```
- F4B2— SUBDICTIGET(x l D n – D′), variant of SUBDICTGETwith
    the prefix represented by a signed big-endianl-bit Integer x, where
    necessarilyl≤ 257.
- F4B3—SUBDICTUGET(x l D n–D′), variant ofSUBDICTGETwith the
    prefix represented by an unsigned big-endian l-bit Integer x, where
    necessarilyl≤ 256.
- F4B5—SUBDICTRPGET(k l D n–D′), similar toSUBDICTGET, but
    removes the common prefixkfrom all keys of the new dictionaryD′,
    which becomes of typeHashmapE(n−l,X).
- F4B6—SUBDICTIRPGET(x l D n–D′), variant ofSUBDICTRPGETwith
    the prefix represented by a signed big-endianl-bit Integer x, where
    necessarilyl≤ 257.
- F4B7—SUBDICTURPGET(x l D n–D′), variant ofSUBDICTRPGETwith
    the prefix represented by an unsigned big-endianl-bitIntegerx, where
    necessarilyl≤ 256.
- F4BC–F4BF— used byDICT...Zprimitives inA.10.11.

### A.11 Application-specific primitives

Opcode rangeF8.. .FBis reserved for theapplication-specific primitives. When
TVM is used to execute TON Blockchain smart contracts, these application-
specific primitives are in fact TON Blockchain-specific.

A.11.1. External actions and access to blockchain configuration
data.Some of the primitives listed below pretend to produce some externally
visible actions, such as sending a message to another smart contract. In fact,
the execution of a smart contract in TVM never has any effect apart from
a modification of the TVM state. All external actions are collected into a
linked list stored in special registerc5(“output actions”). Additionally, some
primitives use the data kept in the first component of theTuple stored in
c7(“root of temporary data”, cf.1.3.2). Smart contracts are free to modify


```
A.11. Application-specific primitives
```
any other data kept in the cellc7, provided the first reference remains in-
tact (otherwise some application-specific primitives would be likely to throw
exceptions when invoked).
Most of the primitives listed below use 16-bit opcodes.

A.11.2. Gas-related primitives.Of the following primitives, only the first
two are “pure” in the sense that they do not usec5orc7.

- F800—ACCEPT, sets current gas limitglto its maximal allowed value
    gm, and resets the gas creditgcto zero (cf.1.4), decreasing the value
    ofgrbygcin the process. In other words, the current smart contract
    agrees to buy some gas to finish the current transaction. This action
    is required to process external messages, which bring no value (hence
    no gas) with themselves.
- F801—SETGASLIMIT(g– ), sets current gas limitglto the minimum
    ofgandgm, and resets the gas creditgcto zero. If the gas consumed
    so far (including the present instruction) exceeds the resulting value of
    gl, an (unhandled) out of gas exception is thrown before setting new
    gas limits. Notice thatSETGASLIMITwith an argumentg≥ 263 − 1 is
    equivalent toACCEPT.
- F802 — BUYGAS (x– ), computes the amount of gas that can be
    bought forxnanograms, and setsglaccordingly in the same way as
    SETGASLIMIT.
- F804—GRAMTOGAS(x–g), computes the amount of gas that can be
    bought forxnanograms. Ifxis negative, returns 0. Ifgexceeds 263 − 1 ,
    it is replaced with this value.
- F805—GASTOGRAM(g–x), computes the price ofggas in nanograms.
- F806–F80E— Reserved for gas-related primitives.
- F80F—COMMIT( – ), commits the current state of registersc4(“persis-
    tent data”) andc5(“actions”) so that the current execution is considered
    “successful” with the saved values even if an exception is thrown later.

A.11.3. Pseudo-random number generator primitives. The pseudo-
random number generator uses the random seed (parameter #6, cf.A.11.4),
an unsigned 256-bitInteger, and (sometimes) other data kept inc7. The


```
A.11. Application-specific primitives
```
initial value of the random seed before a smart contract is executed in TON
Blockchain is a hash of the smart contract address and the global block
random seed. If there are several runs of the same smart contract inside
a block, then all of these runs will have the same random seed. This can
be fixed, for example, by runningLTIME; ADDRANDbefore using the pseudo-
random number generator for the first time.

- F810—RANDU256( –x), generates a new pseudo-random unsigned
    256-bitInteger x. The algorithm is as follows: if r is the old value
    of the random seed, considered as a 32-byte array (by constructing
    the big-endian representation of an unsigned 256-bit integer), then its
    sha512(r)is computed; the first 32 bytes of this hash are stored as
    the new valuer′of the random seed, and the remaining 32 bytes are
    returned as the next random valuex.
- F811—RAND(y–z), generates a new pseudo-random integerzin the
    range 0 ...y− 1 (ory ...− 1 , ify < 0 ). More precisely, an unsigned
    random valuexis generated as inRAND256U; thenz :=bxy/ 2256 c is
    computed. Equivalent toRANDU256; MULRSHIFT 256.
- F814— SETRAND(x– ), sets the random seed to unsigned 256-bit
    Integer x.
- F815—ADDRAND(x– ), mixes unsigned 256-bitIntegerxinto the ran-
    dom seedrby setting the random seed tosha256of the concatenation
    of two 32-byte strings: the first with the big-endian representation of
    the old seedr, and the second with the big-endian representation ofx.
- F810–F81F— Reserved for pseudo-random number generator primi-
    tives.

A.11.4. Configuration primitives. The following primitives read con-
figuration data provided in theTuple stored in the first component of the
Tupleatc7. Whenever TVM is invoked for executing TON Blockchain smart
contracts, thisTupleis initialized by aSmartContractInfostructure; config-
uration primitives assume that it has remained intact.

- F82i—GETPARAM i( –x), returns thei-th parameter from theTuple
    provided atc7for 0 ≤i < 16. Equivalent toPUSH c7;FIRST;INDEX
    i. If one of these internal operations fails, throws an appropriate type
    checking or range checking exception.


```
A.11. Application-specific primitives
```
- F823—NOW( –x), returns the current Unix time as anInteger. If it
    is impossible to recover the requested value starting fromc7, throws a
    type checking or range checking exception as appropriate. Equivalent
    toGETPARAM 3.
- F824—BLOCKLT( –x), returns the starting logical time of the current
    block. Equivalent toGETPARAM 4.
- F825—LTIME( –x), returns the logical time of the current transaction.
    Equivalent toGETPARAM 5.
- F826—RANDSEED( –x), returns the current random seed as an un-
    signed 256-bitInteger. Equivalent toGETPARAM 6.
- F827—BALANCE ( –t), returns the remaining balance of the smart
    contract as aTupleconsisting of anInteger(the remaining Gram bal-
    ance in nanograms) and aMaybe Cell(a dictionary with 32-bit keys
    representing the balance of “extra currencies”). Equivalent toGETPARAM
    7. Note thatRAWprimitives such as SENDRAWMSGdo not update this
    field.
- F828—MYADDR( –s), returns the internal address of the current smart
    contract as aSlicewith aMsgAddressInt. If necessary, it can be parsed
    further using primitives such asPARSESTDADDR or REWRITESTDADDR.
    Equivalent toGETPARAM 8.
- F829—CONFIGROOT( –D), returns theMaybe CellDwith the current
    global configuration dictionary. Equivalent toGETPARAM 9.
- F830—CONFIGDICT( –D 32 ), returns the global configuration dic-
    tionary along with its key length (32). Equivalent to CONFIGROOT;
    PUSHINT 32.
- F832—CONFIGPARAM(i–c− 1 or 0 ), returns the value of the global
    configuration parameter with integer indexias aCell c, and a flag to
    indicate success. Equivalent toCONFIGDICT;DICTIGETREF.
- F833—CONFIGOPTPARAM(i–c?), returns the value of the global config-
    uration parameter with integer indexias aMaybe Cellc?. Equivalent
    toCONFIGDICT;DICTIGETOPTREF.


```
A.11. Application-specific primitives
```
- F820—F83F— Reserved for configuration primitives.

A.11.5. Global variable primitives.The “global variables” may be helpful
in implementing some high-level smart-contract languages. They are in fact
stored as components of theTupleatc7: thek-th global variable simply is
thek-th component of thisTuple, for 1 ≤k≤ 254. By convention, the 0 -th
component is used for the “configuration parameters” ofA.11.4, so it is not
available as a global variable.

- F840—GETGLOBVAR(k–x), returns thek-th global variable for 0 ≤
    k < 255. Equivalent toPUSH c7;SWAP;INDEXVARQ(cf.A.3.2).
- F85_k—GETGLOB k( –x), returns thek-th global variable for 1 ≤
    k≤ 31. Equivalent toPUSH c7;INDEXQ k.
- F860—SETGLOBVAR(x k– ), assignsxto thek-th global variable for
    0 ≤k < 255. Equivalent toPUSH c7;ROTREV;SETINDEXVARQ;POP c7.
- F87_k—SETGLOB k(x– ), assignsxto thek-th global variable for
    1 ≤k≤ 31. Equivalent toPUSH c7;SWAP;SETINDEXQ k;POP c7.

A.11.6. Hashing and cryptography primitives.

- F900—HASHCU(c–x), computes the representation hash (cf.3.1.5)
    of aCell cand returns it as a 256-bit unsigned integerx. Useful for
    signing and checking signatures of arbitrary entities represented by a
    tree of cells.
- F901—HASHSU(s–x), computes the hash of aSlicesand returns it
    as a 256-bit unsigned integerx. The result is the same as if an ordinary
    cell containing only data and references fromshad been created and
    its hash computed byHASHCU.
- F902—SHA256U(s–x), computessha256of the data bits ofSlices.
    If the bit length ofsis not divisible by eight, throws a cell underflow
    exception. The hash value is returned as a 256-bit unsigned integerx.
- F910—CHKSIGNU(h s k–?), checks the Ed25519-signaturesof a
    hashh(a 256-bit unsigned integer, usually computed as the hash of
    some data) using public keyk(also represented by a 256-bit unsigned
    integer). The signaturesmust be aSlicecontaining at least 512 data


```
A.11. Application-specific primitives
```
```
bits; only the first 512 bits are used. The result is− 1 if the signature
is valid, 0 otherwise. Notice thatCHKSIGNUis equivalent toROT;NEWB;
STU 256; ENDB;NEWC;ROTREV; CHKSIGNS, i.e., toCHKSIGNSwith the
first argumentdset to 256-bitSlice containingh. Therefore, ifhis
computed as the hash of some data, these data are hashedtwice, the
second hashing occurring insideCHKSIGNS.
```
- F911—CHKSIGNS(d s k–?), checks whethersis a valid Ed25519-
    signature of the data portion ofSlicedusing public keyk, similarly to
    CHKSIGNU. If the bit length ofSlicedis not divisible by eight, throws
    a cell underflow exception. The verification of Ed25519 signatures is
    the standard one, withsha256used to reducedto the 256-bit number
    that is actually signed.
- F912–F93F— Reserved for hashing and cryptography primitives.

A.11.7. Miscellaneous primitives.

- F940—CDATASIZEQ(c n–x y z− 1 or 0 ), recursively computes the
    count of distinct cellsx, data bitsy, and cell referencesz in the dag
    rooted at Cell c, effectively returning the total storage used by this
    dag taking into account the identification of equal cells. The values of
    x,y, andzare computed by a depth-first traversal of this dag, with a
    hash table of visited cell hashes used to prevent visits of already-visited
    cells. The total count of visited cells xcannot exceed non-negative
    Integer n; otherwise the computation is aborted before visiting the
    (n+ 1)-st cell and a zero is returned to indicate failure. IfcisNull,
    returnsx=y=z= 0.
- F941—CDATASIZE(c n–x y z), a non-quiet version ofCDATASIZEQ
    that throws a cell overflow exception (8) on failure.
- F942—SDATASIZEQ(s n–x y z− 1 or 0 ), similar toCDATASIZEQ, but
    accepting aSlicesinstead of aCell. The returned value ofxdoes not
    take into account the cell that contains the slicesitself; however, the
    data bits and the cell references ofsare accounted for inyandz.
- F943—SDATASIZE(s n–x y z), a non-quiet version ofSDATASIZEQ
    that throws a cell overflow exception (8) on failure.


```
A.11. Application-specific primitives
```
- F944–F97F— Reserved for miscellaneous TON-specific primitives that
    do not fall into any other specific category.

A.11.8. Currency manipulation primitives.

- FA00—LDGRAMSorLDVARUINT16(s–x s′), loads (deserializes) aGram
    orVarUInteger 16amount fromCellSlices, and returns the amount
    as Integer xalong with the remainder s′ of s. The expected serial-
    ization ofxconsists of a 4-bit unsigned big-endian integerl, followed
    by an 8 l-bit unsigned big-endian representation ofx. The net effect is
    approximately equivalent toLDU 4;SWAP;LSHIFT 3;LDUX.
- FA01—LDVARINT16(s–x s′), similar to LDVARUINT16, but loads a
    signed Integerx. Approximately equivalent toLDU 4;SWAP;LSHIFT 3;
    LDIX.
- FA02—STGRAMSorSTVARUINT16(b x–b′), stores (serializes) anInte-
    gerxin the range 0 ... 2120 − 1 intoBuilderb, and returns the resulting
    Builderb′. The serialization ofxconsists of a 4-bit unsigned big-endian
    integerl, which is the smallest integerl ≥ 0 , such thatx < 28 l, fol-
    lowed by an 8 l-bit unsigned big-endian representation ofx. Ifxdoes
    not belong to the supported range, a range check exception is thrown.
- FA03—STVARINT16(b x–b′), similar toSTVARUINT16, but serializes
    asigned Integerxin the range− 2119 ... 2119 − 1.
- FA04—LDVARUINT32(s–x s′), loads (deserializes) aVarUInteger
    32 from CellSlice s, and returns the deserialized value as an Inte-
    ger 0 ≤x < 2248. The expected serialization ofxconsists of a 5-bit
    unsigned big-endian integerl, followed by an 8 l-bit unsigned big-endian
    representation ofx. The net effect is approximately equivalent toLDU
    5 ;SWAP;SHIFT 3;LDUX.
- FA05— LDVARINT32(s– x s′), deserializes a VarInteger 32 from
    CellSlices, and returns the deserialized value as anInteger − 2247 ≤
    x < 2247.
- FA06—STVARUINT32(b x–b′), serializes anInteger 0 ≤x < 2248 as a
    VarUInteger 32.


```
A.11. Application-specific primitives
```
- FA07—STVARINT32(b x–b′), serializes anInteger − 2247 ≤x < 2247
    as aVarInteger 32.
- FA08–FA1F— Reserved for currency manipulation primitives.

A.11.9. Message and address manipulation primitives.The message
and address manipulation primitives listed below serialize and deserialize
values according to the following TL-B scheme (cf.3.3.4):

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

A deserializedMsgAddressis represented by aTupletas follows:

- addr_noneis represented byt= (0), i.e., aTuplecontaining exactly
    oneIntegerequal to zero.
- addr_externis represented byt= (1,s), whereSlice scontains the
    fieldexternal_address. In other words,tis a pair (aTupleconsisting
    of two entries), containing anInteger equal to one andSlices.
- addr_stdis represented byt= (2,u,x,s), whereuis either aNull(if
    anycastis absent) or aSlice s′containingrewrite_pfx(ifanycast
    is present). Next,Integer xis theworkchain_id, andSlicescontains
    theaddress.


```
A.11. Application-specific primitives
```
- addr_varis represented byt= (3,u,x,s), whereu,x, andshave the
    same meaning as foraddr_std.

The following primitives, which use the above conventions, are defined:

- FA40—LDMSGADDR(s–s′s′′), loads fromCellSlicesthe only prefix
    that is a validMsgAddress, and returns both this prefixs′ and the
    remainders′′ofsasCellSlices.
- FA41—LDMSGADDRQ(s–s′s′′− 1 ors 0 ), a quiet version ofLDMSGADDR:
    on success, pushes an extra− 1 ; on failure, pushes the originalsand a
    zero.
- FA42—PARSEMSGADDR(s–t), decomposesCellSlice scontaining a
    validMsgAddressinto aTupletwith separate fields of thisMsgAddress.
    Ifsis not a validMsgAddress, a cell deserialization exception is thrown.
- FA43—PARSEMSGADDRQ(s–t− 1 or 0 ), a quiet version ofPARSEMSGADDR:
    returns a zero on error instead of throwing an exception.
- FA44—REWRITESTDADDR (s– x y), parsesCellSlice scontaining a
    validMsgAddressInt(usually amsg_addr_std), applies rewriting from
    theanycast(if present) to the same-length prefix of the address, and
    returns both the workchainxand the 256-bit addressyas Integers.
    If the address is not 256-bit, or if s is not a valid serialization of
    MsgAddressInt, throws a cell deserialization exception.
- FA45—REWRITESTDADDRQ(s–x y− 1 or 0 ), a quiet version of primitive
    REWRITESTDADDR.
- FA46—REWRITEVARADDR(s–x s′), a variant ofREWRITESTDADDRthat
    returns the (rewritten) address as aSlices, even if it is not exactly 256
    bit long (represented by amsg_addr_var).
- FA47—REWRITEVARADDRQ(s–x s′− 1 or 0 ), a quiet version of primitive
    REWRITEVARADDR.
- FA48–FA5F— Reserved for message and address manipulation primi-
    tives.

A.11.10. Outbound message and output action primitives.


```
A.11. Application-specific primitives
```
- FB00—SENDRAWMSG(c x– ), sends a raw message contained inCell
    c, which should contain a correctly serialized objectMessage X, with
    the only exception that the source address is allowed to have dummy
    valueaddr_none(to be automatically replaced with the current smart-
    contract address), andihr_fee,fwd_fee,created_ltandcreated_at
    fields can have arbitrary values (to be rewritten with correct values
    during the action phase of the current transaction). Integer parameter
    xcontains the flags. Currentlyx= 0is used for ordinary messages;
    x= 128is used for messages that are to carry all the remaining balance
    of the current smart contract (instead of the value originally indicated
    in the message); x= 64is used for messages that carry all the re-
    maining value of the inbound message in addition to the value initially
    indicated in the new message (if bit 0 is not set, the gas fees are de-
    ducted from this amount); x′ = x+ 1 means that the sender wants
    to pay transfer fees separately;x′=x+ 2means that any errors aris-
    ing while processing this message during the action phase should be
    ignored. Finally,x′=x+ 32means that the current account must be
    destroyed if its resulting balance is zero. This flag is usually employed
    together with+128.
- FB02—RAWRESERVE(x y– ), creates an output action which would re-
    serve exactlyxnanograms (ify= 0), at mostxnanograms (ify= 2), or
    all butxnanograms (ify= 1ory= 3), from the remaining balance of
    the account. It is roughly equivalent to creating an outbound message
    carryingxnanograms (orb−xnanograms, wherebis the remaining
    balance) to oneself, so that the subsequent output actions would not
    be able to spend more money than the remainder. Bit+2inymeans
    that the external action does not fail if the specified amount cannot be
    reserved; instead, all remaining balance is reserved. Bit+8inymeans
    x←−xbefore performing any further actions. Bit+4inymeans that
    xis increased by the original balance of the current account (before the
    compute phase), including all extra currencies, before performing any
    other checks and actions. Currentlyxmust be a non-negative integer,
    andymust be in the range 0 ... 15.
- FB03— RAWRESERVEX(x D y – ), similar toRAWRESERVE, but also
    accepts a dictionaryD(represented by aCellorNull) with extra cur-
    rencies. In this way currencies other than Grams can be reserved.


### A.12 Debug primitives

- FB04—SETCODE(c– ), creates an output action that would change this
    smart contract code to that given byCell c. Notice that this change
    will take effect only after the successful termination of the current run
    of the smart contract.
- FB06—SETLIBCODE(c x– ), creates an output action that would mod-
    ify the collection of this smart contract libraries by adding or removing
    library with code given in Cell c. Ifx= 0, the library is actually
    removed if it was previously present in the collection (if not, this ac-
    tion does nothing). Ifx= 1, the library is added as a private library,
    and ifx= 2, the library is added as a public library (and becomes
    available to all smart contracts if the current smart contract resides in
    the masterchain); if the library was present in the collection before, its
    public/private status is changed according tox. Values ofxother than
    0 ... 2 are invalid.
- FB07— CHANGELIB (h x – ), creates an output action similarly to
    SETLIBCODE, but instead of the library code accepts its hash as an
    unsigned 256-bit integerh. Ifx 6 = 0and the library with hashhis
    absent from the library collection of this smart contract, this output
    action will fail.
- FB08–FB3F— Reserved for output action primitives.

### A.12 Debug primitives

Opcodes beginning with FE are reserved for thedebug primitives. These
primitives have known fixed operation length, and behave as (multibyte)
NOP operations. In particular, they never change the stack contents, and
never throw exceptions, unless there are not enough bits to completely de-
code the opcode. However, when invoked in a TVM instance with debug
mode enabled, these primitives can produce specific output into the text de-
bug log of the TVM instance, never affecting the TVM state (so that from
the perspective of TVM the behavior of debug primitives in debug mode is
exactly the same). For instance, a debug primitive might dump all or some
of the values near the top of the stack, display the current state of TVM and
so on.

A.12.1. Debug primitives as multibyte NOPs.


```
A.12. Debug primitives
```
- FEnn—DEBUG nn, for 0 ≤nn < 240 , is a two-byte NOP.
- FEFnssss—DEBUGSTR ssss, for 0 ≤n < 16 , is an(n+ 3)-byte NOP,
    with the(n+ 1)-byte “contents string”ssssskipped as well.

A.12.2. Debug primitives as operations without side-effect. Next
we describe the debug primitives that might (and actually are) implemented
in a version of TVM. Notice that another TVM implementation is free to
use these codes for other debug purposes, or treat them as multibyte NOPs.
Whenever these primitives need some arguments from the stack, they inspect
these arguments, but leave them intact in the stack. If there are insufficient
values in the stack, or they have incorrect types, debug primitives may output
error messages into the debug log, or behave as NOPs, but they cannot throw
exceptions.

- FE00—DUMPSTK, dumps the stack (at most the top 255 values) and
    shows the total stack depth.
- FE0n—DUMPSTKTOP n, 1 ≤n < 15 , dumps the topnvalues from the
    stack, starting from the deepest of them. If there ared < nvalues
    available, dumps onlydvalues.
- FE10—HEXDUMP, dumpss0in hexadecimal form, be it aSliceor an
    Integer.
- FE11—HEXPRINT, similar toHEXDUMP, except the hexadecimal repre-
    sentation ofs0is not immediately output, but rather concatenated to
    an output text buffer.
- FE12—BINDUMP, dumpss0in binary form, similarly toHEXDUMP.
- FE13—BINPRINT, outputs the binary representation ofs0to a text
    buffer.
- FE14—STRDUMP, dumps theSliceats0as an UTF-8 string.
- FE15—STRPRINT, similar toSTRDUMP, but outputs the string into a
    text buffer (without carriage return).
- FE1E—DEBUGOFF, disables all debug output until it is re-enabled by
    aDEBUGON. More precisely, this primitive increases an internal counter,
    which disables all debug operations (except DEBUGOFFandDEBUGON)
    when strictly positive.


### A.13 Codepage primitives

- FE1F—DEBUGON, enables debug output (in a debug version of TVM).
- FE2n—DUMP s(n), 0 ≤n < 15 , dumpss(n).
- FE3n—PRINT s(n), 0 ≤n < 15 , concatenates the text representation
    ofs(n)(without any leading or trailing spaces or carriage returns) to a
    text buffer which will be output before the output of any other debug
    operation.
- FEC0–FEEF— Use these opcodes for custom/experimental debug oper-
    ations.
- FEFnssss—DUMPTOSFMT ssss, dumpss0formatted according to the
    (n+ 1)-byte stringssss. This string might contain (a prefix of) the
    name of a TL-B type supported by the debugger. If the string begins
    with a zero byte, simply outputs it (without the first byte) into the
    debug log. If the string begins with a byte equal to one, concatenates
    it to a buffer, which will be output before the output of any other debug
    operation (effectively outputs a string without a carriage return).
- FEFn 00 ssss—LOGSTR ssss, stringssssisnbytes long.
- FEF000—LOGFLUSH, flushes all pending debug output from the buffer
    into the debug log.
- FEFn 01 ssss—PRINTSTR ssss, stringssssisnbytes long.

### A.13 Codepage primitives

The following primitives, which begin with byteFF, typically are used at the
very beginning of a smart contract’s code or a library subroutine to select
another TVM codepage. Notice that we expect all codepages to contain
these primitives with the same codes, otherwise switching back to another
codepage might be impossible (cf.5.1.8).

- FFnn — SETCPnn, selects TVM codepage 0 ≤ nn < 240. If the
    codepage is not supported, throws an invalid opcode exception.
- FF00—SETCP0, selects TVM (test) codepage zero as described in this
    document.


```
A.13. Codepage primitives
```
- FFFz—SETCP z− 16 , selects TVM codepagez− 16 for 1 ≤z≤ 15.
    Negative codepages− 13 ...− 1 are reserved for restricted versions of
    TVM needed to validate runs of TVM in other codepages as explained
    inB.2.6. Negative codepage− 14 is reserved for experimental code-
    pages, not necessarily compatible between different TVM implementa-
    tions, and should be disabled in the production versions of TVM.
- FFF0—SETCPX(c– ), selects codepagecwith− 215 ≤c < 215 passed
    in the top of the stack.


### B.1 Serialization of the TVM state

## B Formal properties and specifications of TVM

This appendix discusses certain formal properties of TVM that are necessary
for executing smart contracts in the TON Blockchain and validating such
executions afterwards.

### B.1 Serialization of the TVM state

Recall that a virtual machine used for executing smart contracts in a block-
chain must bedeterministic, otherwise the validation of each execution would
require the inclusion of all intermediate steps of the execution into a block,
or at least of the choices made when indeterministic operations have been
performed.
Furthermore, thestateof such a virtual machine must be (uniquely) se-
rializable, so that even if the state itself is not usually included in a block,
itshashis still well-defined and can be included into a block for verification
purposes.

B.1.1. TVM stack values.TVM stack values can be serialized as follows:

vm_stk_tinyint#01 value:int64 = VmStackValue;
vm_stk_int#0201_ value:int257 = VmStackValue;
vm_stk_nan#02FF = VmStackValue;
vm_stk_cell#03 cell:^Cell = VmStackValue;
_ cell:^Cell st_bits:(## 10) end_bits:(## 10)
{ st_bits <= end_bits }
st_ref:(#<= 4) end_ref:(#<= 4)
{ st_ref <= end_ref } = VmCellSlice;
vm_stk_slice#04 _:VmCellSlice = VmStackValue;
vm_stk_builder#05 cell:^Cell = VmStackValue;
vm_stk_cont#06 cont:VmCont = VmStackValue;

Of these,vm_stk_tinyintis never used by TVM in codepage zero; it is used
only in restricted modes.

B.1.2. TVM stack.The TVM stack can be serialized as follows:

vm_stack#_ depth:(## 24) stack:(VmStackList depth) = VmStack;
vm_stk_cons#_ {n:#} head:VmStackValue tail:^(VmStackList n)
= VmStackList (n + 1);
vm_stk_nil#_ = VmStackList 0;


```
B.1. Serialization of the TVM state
```
B.1.3. TVM control registers.Control registers in TVM can be serialized
as follows:

_ cregs:(HashmapE 4 VmStackValue) = VmSaveList;

B.1.4. TVM gas limits.Gas limits in TVM can be serialized as follows:

gas_limits#_ remaining:int64 _:^[
max_limit:int64 cur_limit:int64 credit:int64 ]
= VmGasLimits;

B.1.5. TVM library environment. The TVM library environment can
be serialized as follows:

_ libraries:(HashmapE 256 ^Cell) = VmLibraries;

B.1.6. TVM continuations. Continuations in TVM can be serialized as
follows:

vmc_std$00 nargs:(## 22) stack:(Maybe VmStack) save:VmSaveList
cp:int16 code:VmCellSlice = VmCont;
vmc_envelope$01 nargs:(## 22) stack:(Maybe VmStack)
save:VmSaveList next:^VmCont = VmCont;
vmc_quit$1000 exit_code:int32 = VmCont;
vmc_quit_exc$1001 = VmCont;
vmc_until$1010 body:^VmCont after:^VmCont = VmCont;
vmc_again$1011 body:^VmCont = VmCont;
vmc_while_cond$1100 cond:^VmCont body:^VmCont
after:^VmCont = VmCont;
vmc_while_body$1101 cond:^VmCont body:^VmCont
after:^VmCont = VmCont;
vmc_pushint$1111 value:int32 next:^VmCont = VmCont;

B.1.7. TVM state.The total state of TVM can be serialized as follows:

vms_init$00 cp:int16 step:int32 gas:GasLimits
stack:(Maybe VmStack) save:VmSaveList code:VmCellSlice
lib:VmLibraries = VmState;
vms_exception$01 cp:int16 step:int32 gas:GasLimits
exc_no:int32 exc_arg:VmStackValue
save:VmSaveList lib:VmLibraries = VmState;


### B.2 Step function of TVM

vms_running$10 cp:int16 step:int32 gas:GasLimits stack:VmStack
save:VmSaveList code:VmCellSlice lib:VmLibraries
= VmState;
vms_finished$11 cp:int16 step:int32 gas:GasLimits
exit_code:int32 no_gas:Boolean stack:VmStack
save:VmSaveList lib:VmLibraries = VmState;

When TVM is initialized, its state is described by avms_init, usually with
stepset to zero. The step function of TVM does nothing to avms_finished
state, and transforms all other states intovms_running,vms_exception, or
vms_finished, withstepincreased by one.

### B.2 Step function of TVM

A formal specification of TVM would be completed by the definition of astep
function f :VmState → VmState. This function deterministically trans-
forms a valid VM state into a valid subsequent VM state, and is allowed to
throw exceptions or return an invalid subsequent state if the original state
was invalid.

B.2.1. A high-level definition of the step function.We might present
a very long formal definition of the TVM step function in a high-level func-
tional programming language. Such a specification, however, would mostly
be useful as a reference for the (human) developers. We have chosen another
approach, better adapted to automated formal verification by computers.

B.2.2. An operational definition of the step function.Notice that the
step functionfis a well-defined computable function from trees of cells into
trees of cells. As such, it can be computed by a universal Turing machine.
Then a programPcomputingfon such a machine would provide a machine-
checkable specification of the step functionf. This programPeffectively is
anemulatorof TVM on this Turing machine.

B.2.3. A reference implementation of the TVM emulator inside
TVM.We see that the step function of TVM may be defined by a reference
implementation of a TVM emulator on another machine. An obvious idea
is to use TVM itself, since it is well-adapted to working with trees of cells.
However, an emulator of TVM inside itself is not very useful if we have
doubts about a particular implementation of TVM and want to check it. For


```
B.2. Step function of TVM
```
instance, if such an emulator interpreted aDICTISETinstruction simply by
invoking this instruction itself, then a bug in the underlying implementation
of TVM would remain unnoticed.

B.2.4. Reference implementation inside a minimal version of TVM.
We see that using TVM itself as a host machine for a reference implementa-
tion of TVM emulator would yield little insight. A better idea is to define
astripped-down version of TVM, which supports only the bare minimum
of primitives and 64-bit integer arithmetic, and provide a reference imple-
mentationP of the TVM step functionf for this stripped-down version of
TVM.
In that case, one must carefully implement and check only a handful
of primitives to obtain a stripped-down version of TVM, and compare the
reference implementationPrunning on this stripped-down version to the full
custom TVM implementation being verified. In particular, if there are any
doubts about the validity of a specific run of a custom TVM implementation,
they can now be easily resolved with the aid of the reference implementation.

B.2.5. Relevance for the TON Blockchain.The TON Blockchain adopts
this approach to validate the runs of TVM (e.g., those used for processing
inbound messages by smart contracts) when the validators’ results do not
match one another. In this case, a reference implementation of TVM, stored
inside the masterchain as a configurable parameter (thus defining the current
revision of TVM), is used to obtain the correct result.

B.2.6. Codepage− 1. Codepage− 1 of TVM is reserved for the stripped-
down version of TVM. Its main purpose is to execute the reference imple-
mentation of the step function of the full TVM. This codepage contains only
special versions of arithmetic primitives working with “tiny integers” (64-bit
signed integers); therefore, TVM’s 257-bitInteger arithmetic must be de-
fined in terms of 64-bit arithmetic. Elliptic curve cryptography primitives
are also implemented directly in codepage− 1 , without using any third-party
libraries. Finally, a reference implementation of thesha256hash function is
also provided in codepage− 1.

B.2.7. Codepage− 2. This bootstrapping process could be iterated even
further, by providing an emulator of the stripped-down version of TVM writ-
ten for an even simpler version of TVM that supports only boolean values
(or integers 0 and 1)—a “codepage− 2 ”. All 64-bit arithmetic used in code-
page− 1 would then need to be defined by means of boolean operations, thus


```
B.2. Step function of TVM
```
providing a reference implementation for the stripped-down version of TVM
used in codepage− 1. In this way, if some of the TON Blockchain validators
did not agree on the results of their 64-bit arithmetic, they could regress to
this reference implementation to find the correct answer.^30

(^30) The preliminary version of TVM does not use codepage− 2 for this purpose. This
may change in the future.


### C.1 Sample leaf function

## C Code density of stack and register machines

This appendix extends the general consideration of stack manipulation prim-
itives provided in2.2, explaining the choice of such primitives for TVM, with
a comparison of stack machines and register machines in terms of the quan-
tity of primitives used and the code density. We do this by comparing the
machine code that might be generated by an optimizing compiler for the
same source files, for different (abstract) stack and register machines.
It turns out that the stack machines (at least those equipped with the ba-
sic stack manipulation primitives described in2.2.1) have far superior code
density. Furthermore, the stack machines have excellent extendability with
respect to additional arithmetic and arbitrary data processing operations, es-
pecially if one considers machine code automatically generated by optimizing
compilers.

### C.1 Sample leaf function

We start with a comparison of machine code generated by an (imaginary)
optimizing compiler for several abstract register and stack machines, cor-
responding to the same high-level language source code that contains the
definition of a leaf function (i.e., a function that does not call any other func-
tions). For both the register machines and stack machines, we observe the
notation and conventions introduced in2.1.

C.1.1. Sample source file for a leaf function.The source file we consider
contains one functionfthat takes six (integer) arguments,a,b,c,d,e,f,
and returns two (integer) values,xand y, which are the solutions of the
system of two linear equations
{
ax+by =e
cx+dy =f

#### (6)

The source code of the function, in a programming language similar to C,
might look as follows:

(int, int) f(int a, int b, int c, int d, int e, int f) {
int D = a*d - b*c;
int Dx = e*d - b*f;
int Dy = a*f - e*c;


```
C.1. Sample leaf function
```
return (Dx / D, Dy / D);
}

We assume (cf.2.1) that the register machines we consider accept the six
parametersa.. .fin registersr0.. .r5, and return the two valuesxandyin
r0andr1. We also assume that the register machines have 16 registers, and
that the stack machine can directly accesss0tos15by its stack manipu-
lation primitives; the stack machine will accept the parameters ins5tos0,
and return the two values ins0ands1, somewhat similarly to the register
machine. Finally, we assume at first that the register machine is allowed
to destroy values in all registers (which is slightly unfair towards the stack
machine); this assumption will be revisited later.

C.1.2. Three-address register machine.The machine code (or rather the
corresponding assembly code) for a three-address register machine (cf.2.1.7)
might look as follows:

IMUL r6,r0,r3 // r6 := r0 * r3 = ad
IMUL r7,r1,r2 // r7 := bc
SUB r6,r6,r7 // r6 := ad-bc = D
IMUL r3,r4,r3 // r3 := ed
IMUL r1,r1,r5 // r1 := bf
SUB r3,r3,r1 // r3 := ed-bf = Dx
IMUL r1,r0,r5 // r1 := af
IMUL r7,r4,r2 // r7 := ec
SUB r1,r1,r7 // r1 := af-ec = Dy
IDIV r0,r3,r6 // x := Dx/D
IDIV r1,r1,r6 // y := Dy/D
RET

We have used 12 operations and at least 23 bytes (each operation uses 3 ×4 =
12 bits to indicate the three registers involved, and at least 4 bits to indicate
the operation performed; thus we need two or three bytes to encode each
operation). A more realistic estimate would be 34 (three bytes for each
arithmetic operation) or 31 bytes (two bytes for addition and subtraction,
three bytes for multiplication and division).

C.1.3. Two-address register machine. The machine code for a two-
address register machine might look as follows:


```
C.1. Sample leaf function
```
MOV r6,r0 // r6 := r0 = a
MOV r7,r1 // r7 := b
IMUL r6,r3 // r6 := r6*r3 = ad
IMUL r7,r2 // r7 := bc
IMUL r3,r4 // r3 := de
IMUL r1,r5 // r1 := bf
SUB r6,r7 // r6 := ad-bc = D
IMUL r5,r0 // r5 := af
SUB r3,r1 // r3 := de-bf = Dx
IMUL r2,r4 // r2 := ce
MOV r0,r3 // r0 := Dx
SUB r5,r2 // r5 := af-ce = Dy
IDIV r0,r6 // r0 := x = Dx/D
MOV r1,r5 // r1 := Dy
IDIV r1,r6 // r1 := Dy/D
RET

We have used 16 operations; optimistically assuming each of them (with the
exception ofRET) can be encoded by two bytes, this code would require 31
bytes.^31

C.1.4. One-address register machine. The machine code for a one-
address register machine might look as follows:

MOV r8,r0 // r8 := r0 = a
XCHG r1 // r0 <-> r1; r0 := b, r1 := a
MOV r6,r0 // r6 := b
IMUL r2 // r0 := r0*r2; r0 := bc
MOV r7,r0 // r7 := bc
MOV r0,r8 // r0 := a
IMUL r3 // r0 := ad

(^31) It is interesting to compare this code with that generated by optimizing C compilers
for the x86-64 architecture.
First of all, the integer division operation for x86-64 uses the one-address form, with
the (double-length) dividend to be supplied in accumulator pairr2:r0. The quotient is
also returned inr0. As a consequence, two single-to-double extension operations (CDQor
CQO) and at least one move operation need to be added.
Secondly, the encoding used for arithmetic and move operations is less optimistic than
in our example above, requiring about three bytes per operation on average. As a result,
we obtain a total of 43 bytes for 32-bit integers, and 68 bytes for 64-bit integers.


```
C.1. Sample leaf function
```
SUB r7 // r0 := ad-bc = D
XCHG r1 // r1 := D, r0 := b
IMUL r5 // r0 := bf
XCHG r3 // r0 := d, r3 := bf
IMUL r4 // r0 := de
SUB r3 // r0 := de-bf = Dx
IDIV r1 // r0 := Dx/D = x
XCHG r2 // r0 := c, r2 := x
IMUL r4 // r0 := ce
XCHG r5 // r0 := f, r5 := ce
IMUL r8 // r0 := af
SUB r5 // r0 := af-ce = Dy
IDIV r1 // r0 := Dy/D = y
MOV r1,r0 // r1 := y
MOV r0,r2 // r0 := x
RET

We have used 23 operations; if we assume one-byte encoding for all arithmetic
operations andXCHG, and two-byte encodings forMOV, the total size of the
code will be 29 bytes. Notice, however, that to obtain the compact code
shown above we had to choose a specific order of computation, and made
heavy use of the commutativity of multiplication. (For example, we compute
bcbeforeaf, andaf−bcimmediately afteraf.) It is not clear whether a
compiler would be able to make all such optimizations by itself.

C.1.5. Stack machine with basic stack primitives.The machine code
for a stack machine equipped with basic stack manipulation primitives de-
scribed in2.2.1might look as follows:

PUSH s5 // a b c d e f a
PUSH s3 // a b c d e f a d
IMUL // a b c d e f ad
PUSH s5 // a b c d e f ad b
PUSH s5 // a b c d e f ad b c
IMUL // a b c d e f ad bc
SUB // a b c d e f ad-bc
XCHG s3 // a b c ad-bc e f d
PUSH s2 // a b c ad-bc e f d e
IMUL // a b c ad-bc e f de


```
C.1. Sample leaf function
```
XCHG s5 // a de c ad-bc e f b
PUSH s1 // a de c ad-bc e f b f
IMUL // a de c ad-bc e f bf
XCHG s1,s5 // a f c ad-bc e de bf
SUB // a f c ad-bc e de-bf
XCHG s3 // a f de-bf ad-bc e c
IMUL // a f de-bf ad-bc ec
XCHG s3 // a ec de-bf ad-bc f
XCHG s1,s4 // ad-bc ec de-bf a f
IMUL // D ec Dx af
XCHG s1 // D ec af Dx
XCHG s2 // D Dx af ec
SUB // D Dx Dy
XCHG s1 // D Dy Dx
PUSH s2 // D Dy Dx D
IDIV // D Dy x
XCHG s2 // x Dy D
IDIV // x y
RET

We have used 29 operations; assuming one-byte encodings for all stack oper-
ations involved (includingXCHG s1,s(i)), we have used 29 code bytes as well.
Notice that with one-byte encoding, the “unsystematic” operationROT(equiv-
alent toXCHG s1; XCHG s2) would reduce the operation and byte count to

28. This shows that such “unsystematic” operations, borrowed from Forth,
may indeed reduce the code size on some occasions.
    Notice as well that we have implicitly used the commutativity of multi-
plication in this code, computingde−bfinstead ofed−bfas specified in
high-level language source code. If we were not allowed to do so, an extra
XCHG s1would need to be inserted before the thirdIMUL, increasing the total
size of the code by one operation and one byte.
    The code presented above might have been produced by a rather unso-
phisticated compiler that simply computed all expressions and subexpres-
sions in the order they appear, then rearranged the arguments near the top
of the stack before each operation as outlined in2.2.2. The only “manual”
optimization done here involves computingecbeforeaf; one can check that
the other order would lead to slightly shorter code of 28 operations and bytes
(or 29, if we are not allowed to use the commutativity of multiplication), but


```
C.1. Sample leaf function
```
theROToptimization would not be applicable.

C.1.6. Stack machine with compound stack primitives.A stack ma-
chine with compound stack primitives (cf.2.2.3) would not significantly
improve code density of the code presented above, at least in terms of bytes
used. The only difference is that, if we were not allowed to use commutativ-
ity of multiplication, the extraXCHG s1inserted before the thirdIMULmight
be combined with two previous operationsXCHG s3,PUSH s2into one com-
pound operationPUXC s2,s3; we provide the resulting code below. To make
this less redundant, we show a version of the code that computes subexpres-
sionaf beforeec as specified in the original source file. We see that this
replaces six operations (starting from line 15) with five other operations, and
disables theROToptimization:

PUSH s5 // a b c d e f a
PUSH s3 // a b c d e f a d
IMUL // a b c d e f ad
PUSH s5 // a b c d e f ad b
PUSH s5 // a b c d e f ad b c
IMUL // a b c d e f ad bc
SUB // a b c d e f ad-bc
PUXC s2,s3 // a b c ad-bc e f e d
IMUL // a b c ad-bc e f ed
XCHG s5 // a ed c ad-bc e f b
PUSH s1 // a ed c ad-bc e f b f
IMUL // a ed c ad-bc e f bf
XCHG s1,s5 // a f c ad-bc e ed bf
SUB // a f c ad-bc e ed-bf
XCHG s4 // a ed-bf c ad-bc e f
XCHG s1,s5 // e Dx c D a f
IMUL // e Dx c D af
XCHG s2 // e Dx af D c
XCHG s1,s4 // D Dx af e c
IMUL // D Dx af ec
SUB // D Dx Dy
XCHG s1 // D Dy Dx
PUSH s2 // D Dy Dx D
IDIV // D Dy x
XCHG s2 // x Dy D


```
C.1. Sample leaf function
```
IDIV // x y
RET

We have used a total of 27 operations and 28 bytes, the same as the previous
version (with theROToptimization). However, we did not use the commuta-
tivity of multiplication here, so we can say that compound stack manipulation
primitives enable us to reduce the code size from 29 to 28 bytes.
Yet again, notice that the above code might have been generated by an
unsophisticated compiler. Manual optimizations might lead to more com-
pact code; for instance, we could use compound operations such asXCHG3
to prepare in advance not only the correct values ofs0ands1for the next
arithmetic operation, but also the value ofs2for the arithmetic operation
after that. The next section provides an example of such an optimization.

C.1.7. Stack machine with compound stack primitives and manu-
ally optimized code. The previous version of code for a stack machine
with compound stack primitives can be manually optimized as follows.
By interchangingXCHGoperations with precedingXCHG,PUSH, and arith-
metic operations whenever possible, we obtain code fragmentXCHG s2,s6;
XCHG s1,s0; XCHG s0,s5, which can then be replaced by compound oper-
ationXCHG3 s6,s0,s5. This compound operation would admit a two-byte
encoding, thus leading to 27-byte code using only 21 operations:

PUSH2 s5,s2 // a b c d e f a d
IMUL // a b c d e f ad
PUSH2 s5,s4 // a b c d e f ad b c
IMUL // a b c d e f ad bc
SUB // a b c d e f ad-bc
PUXC s2,s3 // a b c ad-bc e f e d
IMUL // a b c D e f ed
XCHG3 s6,s0,s5 // (same as XCHG s2,s6; XCHG s1,s0; XCHG s0,s5)
// e f c D a ed b
PUSH s5 // e f c D a ed b f
IMUL // e f c D a ed bf
SUB // e f c D a ed-bf
XCHG s4 // e Dx c D a f
IMUL // e Dx c D af
XCHG2 s4,s2 // D Dx af e c
IMUL // D Dx af ec


### C.2 Comparison of machine code for sample leaf function

SUB // D Dx Dy
XCPU s1,s2 // D Dy Dx D
IDIV // D Dy x
XCHG s2 // x Dy D
IDIV // x y
RET

It is interesting to note that this version of stack machine code contains only
9 stack manipulation primitives for 11 arithmetic operations. It is not clear,
however, whether an optimizing compiler would be able to reorganize the
code in such a manner by itself.

### C.2 Comparison of machine code for sample leaf func-

### tion

Table 1 summarizes the properties of machine code corresponding to the same
source file described inC.1.1, generated for a hypothetical three-address
register machine (cf.C.1.2), with both “optimistic” and “realistic” instruc-
tion encodings; a two-address machine (cf.C.1.3); a one-address machine
(cf.C.1.4); and a stack machine, similar to TVM, using either only the
basic stack manipulation primitives (cf.C.1.5) or both the basic and the
composite stack primitives (cf.C.1.7).
The meaning of the columns in Table 1 is as follows:

- “Operations” — The quantity of instructions used, split into “data”
    (i.e., register move and exchange instructions for register machines, and
    stack manipulation instructions for stack machines) and “arithmetic”
    (instructions for adding, subtracting, multiplying and dividing integer
    numbers). The “total” is one more than the sum of these two, because
    there is also a one-byteRETinstruction at the end of machine code.
- “Code bytes” — The total amount of code bytes used.
- “Opcode space” — The portion of “opcode space” (i.e., of possible
    choices for the first byte of the encoding of an instruction) used by
    data and arithmetic instructions in the assumed instruction encoding.
    For example, the “optimistic” encoding for the three-address machine
    assumes two-byte encodings for all arithmetic instructions op r(i),
    r(j), r(k). Each arithmetic instruction would then consume portion


```
C.2. Comparison of machine code for sample leaf function
```
```
Operations Code bytes Opcode space
Machine data arith total data arith total data arith total
3-addr. (opt.) 0 11 12 0 22 23 0/256 64/256 65/256
3-addr. (real.) 0 11 12 0 30 31 0/256 34/256 35/256
2-addr. 4 11 16 8 22 31 1/256 4/256 6/256
1-addr. 11 11 23 17 11 29 17/256 64/256 82/256
stack (basic) 16 11 28 16 11 28 64/256 4/256 69/256
stack (comp.) 9 11 21 15 11 27 84/256 4/256 89/256
```
Table 1: A summary of machine code properties for hypothetical 3-address, 2-address,
1-address, and stack machines, generated for a sample leaf function (cf.C.1.1). The two
most important columns, reflectingcode densityandextendabilityto other operations,
are marked by bold font. Smaller values are better in both of these columns.

```
16 /256 = 1/ 16 of the opcode space. Notice that for the stack ma-
chine we have assumed one-byte encodings forXCHG s(i), PUSH s(i)
andPOP s(i)in all cases, augmented by XCHG s1,s(i)for the basic
stack instructions case only. As for the compound stack operations,
we have assumed two-byte encodings forPUSH3,XCHG3,XCHG2,XCPU,
PUXC,PUSH2, but not forXCHG s1,s(i).
```
The “code bytes” column reflects the density of the code for the specific
sample source. However, “opcode space” is also important, because it reflects
the extendability of the achieved density to other classes of operations (e.g.,
if one were to complement arithmetic operations with string manipulation
operations and so on). Here the “arithmetic” subcolumn is more important
than the “data” subcolumn, because no further data manipulation operations
would be required for such extensions.
We see that the three-address register machine with the “optimistic” en-
coding, assuming two-byte encodings for all three-register arithmetic opera-
tions, achieves the best code density, requiring only 23 bytes. However, this
comes at a price: each arithmetic operation consumes 1/16 of the opcode
space, so the four operations already use a quarter of the opcode space. At
most 11 other operations, arithmetic or not, might be added to this architec-
ture while preserving such high code density. On the other hand, when we
consider the “realistic” encoding for the three-address machine, using two-
byte encodings only for the most frequently used addition/subtraction oper-
ations (and longer encodings for less frequently used multiplication/division
operations, reflecting the fact that the possible extension operations would
likely fall in this class), then the three-address machine ceases to offer such


```
C.2. Comparison of machine code for sample leaf function
```
attractive code density.
In fact, the two-address machine becomes equally attractive at this point:
it is capable of achieving the same code size of 31 bytes as the three-address
machine with the “realistic” encoding, using only 6/256 of the opcode space
for this! However, 31 bytes is the worst result in this table.
The one-address machine uses 29 bytes, slightly less than the two-address
machine. However, it utilizes a quarter of the opcode space for its arithmetic
operations, hampering its extendability. In this respect it is similar to the
three-address machine with the “optimistic” encoding, but requires 29 bytes
instead of 23! So there is no reason to use the one-address machine at all, in
terms of extendability (reflected by opcode space used for arithmetic opera-
tions) compared to code density.
Finally, the stack machine wins the competition in terms of code density
(27 or 28 bytes), losing only to the three-address machine with the “opti-
mistic” encoding (which, however, is terrible in terms of extendability).
To summarize: the two-address machine and stack machine achieve the
best extendability with respect to additional arithmetic or data processing
instructions (using only 1/256 of code space for each such instruction), while
the stack machine additionally achieves the best code density by a small
margin. The stack machine utilizes a significant part of its code space (more
than a quarter) for data (i.e., stack) manipulation instructions; however,
this does not seriously hamper extendability, because the stack manipulation
instructions occupy a constant part of the opcode stace, regardless of all other
instructions and extensions.
While one might still be tempted to use a two-address register machine,
we will explain shortly (cf.C.3) why the two-address register machine offers
worse code density and extendability in practice than it appears based on
this table.
As for the choice between a stack machine with only basic stack manip-
ulation primitives or one supporting compound stack primitives as well, the
case for the more sophisticated stack machine appears to be weaker: it offers
only one or two fewer bytes of code at the expense of using considerably more
opcode space for stack manipulation, and the optimized code using these ad-
ditional instructions is hard for programmers to write and for compilers to
automatically generate.

C.2.1. Register calling conventions: some registers must be pre-
served by functions. Up to this point, we have considered the machine


```
C.2. Comparison of machine code for sample leaf function
```
code of only one function, without taking into account the interplay between
this function and other functions in the same program.
Usually a program consists of more than one function, and when a func-
tion is not a “simple” or “leaf” function, it must call other functions. There-
fore, it becomes important whether a called function preserves all or at least
some registers. If it preserves all registers except those used to return re-
sults, the caller can safely keep its local and temporary variables in certain
registers; however, the callee needs to save all the registers it will use for
its temporary values somewhere (usually into the stack, which also exists on
register machines), and then restore the original values. On the other hand,
if the called function is allowed to destroy all registers, it can be written in
the manner described inC.1.2,C.1.3, andC.1.4, but the caller will now be
responsible for saving all its temporary values into the stack before the call,
and restoring these values afterwards.
In most cases, calling conventions for register machines require preserva-
tion of some but not all registers. We will assume thatm≤nregisters will
be preserved by functions (unless they are used for return values), and that
these registers arer(n−m)...r(n−1). Casem= 0corresponds to the case
“the callee is free to destroy all registers” considered so far; it is quite painful
for the caller. Casem=ncorresponds to the case “the callee must preserve
all registers”; it is quite painful for the callee, as we will see in a moment.
Usually a value ofmaroundn/ 2 is used in practice.
The following sections consider casesm= 0,m= 8, andm= 16for our
register machines withn= 16registers.

C.2.2. Case m = 0: no registers to preserve. This case has been
considered and summarized inC.2and Table 1 above.

C.2.3. Casem=n= 16: all registers must be preserved.This case is
the most painful one for the called function. It is especially difficult for leaf
functions like the one we have been considering, which do not benefit at all
from the fact that other functions preserve some registers when called—they
do not call any functions, but instead must preserve all registers themselves.
In order to estimate the consequences of assumingm=n= 16, we will
assume that all our register machines are equipped with a stack, and with
one-byte instructionsPUSH r(i)andPOP r(i), which push or pop a register
into/from the stack. For example, the three-address machine code provided
inC.1.2destroys the values in registers r2, r3, r6, and r7; this means
that the code of this function must be augmented by four instructionsPUSH


```
C.2. Comparison of machine code for sample leaf function
```
```
Operations Code bytes Opcode space
Machine r data arith total data arith total data arith total
3-addr. (opt.) 4 8 11 20 8 22 31 32/256 64/256 97/256
3-addr. (real.) 4 8 11 20 8 30 39 32/256 34/256 67/256
2-addr. 5 14 11 26 18 22 41 33/256 4/256 38/256
1-addr. 6 23 11 35 29 11 41 49/256 64/256 114/256
stack (basic) 0 16 11 28 16 11 28 64/256 4/256 69/256
stack (comp.) 0 9 11 21 15 11 27 84/256 4/256 89/256
```
Table 2: A summary of machine code properties for hypothetical 3-address, 2-address, 1-
address, and stack machines, generated for a sample leaf function (cf.C.1.1), assuming all
of the 16 registers must be preserved by called functions (m=n= 16). The new column
labeledrdenotes the number of registers to be saved and restored, leading to 2 rmore
operations and code bytes compared to Table 1. Newly-addedPUSHandPOPinstructions
for register machines also utilize 32 / 256 of the opcode space. The two rows corresponding
to stack machines remain unchanged.

r2;PUSH r3;PUSH r6;PUSH r7at the beginning, and by four instructions
POP r7;POP r6;POP r3;POP r2right before theRETinstruction, in order
to restore the original values of these registers from the stack. These four
additionalPUSH/POPpairs would increase the operation count and code size
in bytes by 4 ×2 = 8. A similar analysis can be done for other register
machines as well, leading to Table 2.
We see that under these assumptions the stack machines are the obvious
winners in terms of code density, and are in the winning group with respect
to extendability.

C.2.4. Case m= 8, n= 16: registers r8.. .r15 must be preserved.
The analysis of this case is similar to the previous one. The results are
summarized in Table 3.
Notice that the resulting table is very similar to Table 1 , apart from the
“Opcode space” columns and the row for the one-address machine. Therefore,
the conclusions ofC.2still apply in this case, with some minor modifications.
We must emphasize, however, thatthese conclusions are valid only for leaf
functions, i.e., functions that do not call other functions. Any program aside
from the very simplest will have many non-leaf functions, especially if we are
minimizing resulting machine code size (which prevents inlining of functions
in most cases).

C.2.5. A fairer comparison using a binary code instead of a byte
code. The reader may have noticed that our preceding discussion ofk-


```
C.3. Sample non-leaf function
```
```
Operations Code bytes Opcode space
Machine r data arith total data arith total data arith total
3-addr. (opt.) 0 0 11 12 0 22 23 32/256 64/256 97/256
3-addr. (real.) 0 0 11 12 0 30 31 32/256 34/256 67/256
2-addr. 0 4 11 16 8 22 31 33/256 4/256 38/256
1-addr. 1 13 11 25 19 11 31 49/256 64/256 114/256
stack (basic) 0 16 11 28 16 11 28 64/256 4/256 69/256
stack (comp.) 0 9 11 21 15 11 27 84/256 4/256 89/256
```
Table 3: A summary of machine code properties for hypothetical 3-address, 2-address,
1-address and stack machines, generated for a sample leaf function (cf.C.1.1), assuming
that only the last 8 of the 16 registers must be preserved by called functions (m= 8,
n= 16). This table is similar to Table 2 , but has smaller values ofr.

address register machines and stack machines depended very much on our
insistence that complete instructions be encoded by an integer number of
bytes. If we had been allowed to use a “bit” or “binary code” instead of a
byte code for encoding instructions, we could more evenly balance the opcode
space used by different machines. For instance, the opcode ofSUBfor a three-
address machine had to be either 4-bit (good for code density, bad for opcode
space) or 12-bit (very bad for code density), because the complete instruction
has to occupy a multiple of eight bits (e.g., 16 or 24 bits), and 3 ·4 = 12of
those bits have to be used for the three register names.
Therefore, let us get rid of this restriction.
Now that we can use any number of bits to encode an instruction, we
can choose all opcodes of the same length for all the machines considered.
For instance, all arithmetic instructions can have 8-bit opcodes, as the stack
machine does, using 1 / 256 of the opcode space each; then the three-address
register machine will use 20 bits to encode each complete arithmetic instruc-
tion. AllMOVs,XCHGs,PUSHes, andPOPs on register machines can be assumed
to have 4-bit opcodes, because this is what we do for the most common stack
manipulation primitives on a stack machine. The results of these changes
are shown in Table 4.
We can see that the performance of the various machines is much more
balanced, with the stack machine still the winner in terms of the code density,
but with the three-address machine enjoying the second place it really merits.
If we were to consider the decoding speed and the possibility of parallel
execution of instructions, we would have to choose the three-address machine,
because it uses only 12 instructions instead of 21.


### C.3 Sample non-leaf function

```
Operations Code bytes Opcode space
Machine r data arith total data arith total data arith total
3-addr. 0 0 11 12 0 27.5 28.5 64/256 4/256 69/256
2-addr. 0 4 11 16 6 22 29 64/256 4/256 69/256
1-addr. 1 13 11 25 16 16.5 32.5 64/256 4/256 69/256
stack (basic) 0 16 11 28 16 11 28 64/256 4/256 69/256
stack (comp.) 0 9 11 21 15 11 27 84/256 4/256 89/256
```
Table 4: A summary of machine code properties for hypothetical 3-address, 2-address,
1-address and stack machines, generated for a sample leaf function (cf.C.1.1), assuming
that only 8 of the 16 registers must be preserved by functions (m= 8,n= 16). This
time we can use fractions of bytes to encode instructions, so as to match opcode space
used by different machines. All arithmetic instructions have 8-bit opcodes, all data/stack
manipulation instructions have 4-bit opcodes. In other respects this table is similar to
Table 3.

### C.3 Sample non-leaf function

This section compares the machine code for different register machines for a
sample non-leaf function. Again, we assume that eitherm= 0,m= 8, or
m= 16registers are preserved by called functions, withm= 8representing
the compromise made by most modern compilers and operating systems.

C.3.1. Sample source code for a non-leaf function.A sample source file
may be obtained by replacing the built-in integer type with a customRational
type, represented by a pointer to an object in memory, in our function for
solving systems of two linear equations (cf.C.1.1):

struct Rational;
typedef struct Rational *num;
extern num r_add(num, num);
extern num r_sub(num, num);
extern num r_mul(num, num);
extern num r_div(num, num);

(num, num) r_f(num a, num b, num c, num d, num e, num f) {
num D = r_sub(r_mul(a, d), r_mul(b, c)); // a*d-b*c
num Dx = r_sub(r_mul(e, d), r_mul(b, f)); // e*d-b*f
num Dy = r_sub(r_mul(a, f), r_mul(e, c)); // a*f-e*c
return (r_div(Dx, D), r_div(Dy, D)); // Dx/D, Dy/D
}


```
C.3. Sample non-leaf function
```
We will ignore all questions related to allocating new objects of typeRational
in memory (e.g., in heap), and to preventing memory leaks. We may assume
that the called subroutinesr_sub, r_mul, and so on allocate new objects
simply by advancing some pointer in a pre-allocated buffer, and that unused
objects are later freed by a garbage collector, external to the code being
analysed.
Rational numbers will now be represented by pointers, addresses, or ref-
erences, which will fit into registers of our hypothetical register machines or
into the stack of our stack machines. If we want to use TVM as an instance
of these stack machines, we should use values of typeCellto represent such
references to objects of typeRationalin memory.
We assume that subroutines (or functions) are called by a specialCALL
instruction, which is encoded by three bytes, including the specification of
the function to be called (e.g., the index in a “global function table”).

C.3.2. Three-address and two-address register machines,m= 0pre-
served registers.Because our sample function does not use built-in arith-
metic instructions at all, compilers for our hypothetical three-address and
two-address register machines will produce the same machine code. Apart
from the previously introducedPUSH r(i)andPOP r(i)one-byte instructions,
we assume that our two- and three-address machines support the following
two-byte instructions:MOV r(i),s(j),MOV s(j),r(i), andXCHG r(i),s(j), for
0 ≤i,j≤ 15. Such instructions occupy only 3/256 of the opcode space, so
their addition seems quite natural.
We first assume thatm= 0(i.e., that all subroutines are free to destroy
the values of all registers). In this case, our machine code for r_f does
not have to preserve any registers, but has to save all registers containing
useful values into the stack before calling any subroutines. A size-optimizing
compiler might produce the following code:

PUSH r4 // STACK: e
PUSH r1 // STACK: e b
PUSH r0 // .. e b a
PUSH r6 // .. e b a f
PUSH r2 // .. e b a f c
PUSH r3 // .. e b a f c d
MOV r0,r1 // b
MOV r1,r2 // c
CALL r_mul // bc


```
C.3. Sample non-leaf function
```
PUSH r0 // .. e b a f c d bc
MOV r0,s4 // a
MOV r1,s1 // d
CALL r_mul // ad
POP r1 // bc; .. e b a f c d
CALL r_sub // D:=ad-bc
XCHG r0,s4 // b ; .. e D a f c d
MOV r1,s2 // f
CALL r_mul // bf
POP r1 // d ; .. e D a f c
PUSH r0 // .. e D a f c bf
MOV r0,s5 // e
CALL r_mul // ed
POP r1 // bf; .. e D a f c
CALL r_sub // Dx:=ed-bf
XCHG r0,s4 // e ; .. Dx D a f c
POP r1 // c ; .. Dx D a f
CALL r_mul // ec
XCHG r0,s1 // a ; .. Dx D ec f
POP r1 // f ; .. Dx D ec
CALL r_mul // af
POP r1 // ec; .. Dx D
CALL r_sub // Dy:=af-ec
XCHG r0,s1 // Dx; .. Dy D
MOV r1,s0 // D
CALL r_div // x:=Dx/D
XCHG r0,s1 // Dy; .. x D
POP r1 // D ; .. x
CALL r_div // y:=Dy/D
MOV r1,r0 // y
POP r0 // x ; ..
RET

We have used 41 instructions: 17 one-byte (eightPUSH/POPpairs and one
RET), 13 two-byte (MOVandXCHG; out of them 11 “new” ones, involving the
stack), and 11 three-byte (CALL), for a total of 17 ·1 + 13·2 + 11·3 = 76
bytes.^32

(^32) Code produced for this function by an optimizing compiler for x86-64 architecture


```
C.3. Sample non-leaf function
```
C.3.3. Three-address and two-address register machines, m = 8
preserved registers. Now we have eight registers, r8 to r15, that are
preserved by subroutine calls. We might keep some intermediate values there
instead of pushing them into the stack. However, the penalty for doing so
consists in aPUSH/POP pair for every such register that we choose to use,
because our function is also required to preserve its original value. It seems
that using these registers under such a penalty does not improve the density
of the code, so the optimal code for three- and two-address machines for
m= 8preserved registers is the same as that provided inC.3.2, with a total
of 42 instructions and 74 code bytes.

C.3.4. Three-address and two-address register machines, m = 16
preserved registers. This time all registers must be preserved by the
subroutines, excluding those used for returning the results. This means that
our code must preserve the original values ofr2tor5, as well as any other
registers it uses for temporary values. A straightforward way of writing the
code of our subroutine would be to push registersr2up to, say,r8into the
stack, then perform all the operations required, usingr6–r8for intermediate
values, and finally restore registers from the stack. However, this would not
optimize code size. We choose another approach:

PUSH r0 // STACK: a
PUSH r1 // STACK: a b
MOV r0,r1 // b
MOV r1,r2 // c
CALL r_mul // bc
PUSH r0 // .. a b bc
MOV r0,s2 // a
MOV r1,r3 // d
CALL r_mul // ad
POP r1 // bc; .. a b
CALL r_sub // D:=ad-bc
XCHG r0,s0 // b; .. a D
MOV r1,r5 // f
CALL r_mul // bf
PUSH r0 // .. a D bf

with size-optimization enabled actually occupied 150 bytes, due mostly to the fact that
actual instruction encodings are about twice as long as we had optimistically assumed.


```
C.3. Sample non-leaf function
```
MOV r0,r4 // e
MOV r1,r3 // d
CALL r_mul // ed
POP r1 // bf; .. a D
CALL r_sub // Dx:=ed-bf
XCHG r0,s1 // a ; .. Dx D
MOV r1,r5 // f
CALL r_mul // af
PUSH r0 // .. Dx D af
MOV r0,r4 // e
MOV r1,r2 // c
CALL r_mul // ec
MOV r1,r0 // ec
POP r0 // af; .. Dx D
CALL r_sub // Dy:=af-ec
XCHG r0,s1 // Dx; .. Dy D
MOV r1,s0 // D
CALL r_div // x:=Dx/D
XCHG r0,s1 // Dy; .. x D
POP r1 // D ; .. x
CALL r_div // y:=Dy/D
MOV r1,r0 // y
POP r0 // x
RET

We have used 39 instructions: 11 one-byte, 17 two-byte (among them 5 “new”
instructions), and 11 three-byte, for a total of 11 ·1 + 17·2 + 11·3 = 78
bytes. Somewhat paradoxically, the code size in bytes is slightly longer than
in the previous case (cf.C.3.2), contrary to what one might have expected.
This is partially due to the fact that we have assumed two-byte encodings for
“new”MOVandXCHGinstructions involving the stack, similarly to the “old”
instructions. Most existing architectures (such as x86-64) use longer encod-
ings (maybe even twice as long) for their counterparts of our “new” move and
exchange instructions compared to the “usual” register-register ones. Taking
this into account, we see that we would have obtained here 83 bytes (versus
87 for the code inC.3.2) assuming three-byte encodings of new operations,
and 88 bytes (versus 98) assuming four-byte encodings. This shows that,
for two-address architectures without optimized encodings for register-stack


```
C.3. Sample non-leaf function
```
move and exchange operations,m= 16preserved registers might result in
slightly shorter code for some non-leaf functions, at the expense of leaf func-
tions (cf.C.2.3andC.2.4), which would become considerably longer.

C.3.5. One-address register machine, m = 0 preserved registers.
For our one-address register machine, we assume that new register-stack in-
structions work through the accumulator only. Therefore, we have three
new instructions, LD s(j)(equivalent to MOV r0,s(j)of two-address ma-
chines),ST s(j)(equivalent toMOV s(j),r0), andXCHG s(j)(equivalent to
XCHG r0,s(j)). To make the comparison with two-address machines more
interesting, we assume one-byte encodings for these new instructions, even
though this would consume 48 /256 = 3/ 16 of the opcode space.
By adapting the code provided inC.3.2to the one-address machine, we
obtain the following:

PUSH r4 // STACK: e
PUSH r1 // STACK: e b
PUSH r0 // .. e b a
PUSH r6 // .. e b a f
PUSH r2 // .. e b a f c
PUSH r3 // .. e b a f c d
LD s1 // r0:=c
XCHG r1 // r0:=b, r1:=c
CALL r_mul // bc
PUSH r0 // .. e b a f c d bc
LD s1 // d
XCHG r1 // r1:=d
LD s4 // a
CALL r_mul // ad
POP r1 // bc; .. e b a f c d
CALL r_sub // D:=ad-bc
XCHG s4 // b ; .. e D a f c d
XCHG r1
LD s2 // f
XCHG r1 // r0:=b, r1:=f
CALL r_mul // bf
POP r1 // d ; .. e D a f c
PUSH r0 // .. e D a f c bf
LD s5 // e


```
C.3. Sample non-leaf function
```
CALL r_mul // ed
POP r1 // bf; .. e D a f c
CALL r_sub // Dx:=ed-bf
XCHG s4 // e ; .. Dx D a f c
POP r1 // c ; .. Dx D a f
CALL r_mul // ec
XCHG s1 // a ; .. Dx D ec f
POP r1 // f ; .. Dx D ec
CALL r_mul // af
POP r1 // ec; .. Dx D
CALL r_sub // Dy:=af-ec
XCHG s1 // Dx; .. Dy D
POP r1 // D ; .. Dy
PUSH r1 // .. Dy D
CALL r_div // x:=Dx/D
XCHG s1 // Dy; .. x D
POP r1 // D ; .. x
CALL r_div // y:=Dy/D
XCHG r1 // r1:=y
POP r0 // r0:=x ; ..
RET

We have used 45 instructions: 34 one-byte and 11 three-byte, for a total of 67
bytes. Compared to the 76 bytes used by two- and three-address machines
inC.3.2, we see that, again, the one-address register machine code may be
denser than that of two-register machines, at the expense of utilizing more
opcode space (just as shown inC.2). However, this time the extra 3/16 of
the opcode space was used for data manipulation instructions, which do not
depend on specific arithmetic operations or user functions invoked.

C.3.6. One-address register machine, m = 8 preserved registers.
As explained inC.3.3, the preservation ofr8–r15between subroutine calls
does not improve the size of our previously written code, so the one-address
machine will use form= 8the same code provided inC.3.5.

C.3.7. One-address register machine, m= 16 preserved registers.
We simply adapt the code provided in C.3.4to the one-address register
machine:

PUSH r0 // STACK: a


```
C.3. Sample non-leaf function
```
PUSH r1 // STACK: a b
MOV r0,r1 // b
MOV r1,r2 // c
CALL r_mul // bc
PUSH r0 // .. a b bc
LD s2 // a
MOV r1,r3 // d
CALL r_mul // ad
POP r1 // bc; .. a b
CALL r_sub // D:=ad-bc
XCHG s0 // b; .. a D
MOV r1,r5 // f
CALL r_mul // bf
PUSH r0 // .. a D bf
MOV r0,r4 // e
MOV r1,r3 // d
CALL r_mul // ed
POP r1 // bf; .. a D
CALL r_sub // Dx:=ed-bf
XCHG s1 // a ; .. Dx D
MOV r1,r5 // f
CALL r_mul // af
PUSH r0 // .. Dx D af
MOV r0,r4 // e
MOV r1,r2 // c
CALL r_mul // ec
MOV r1,r0 // ec
POP r0 // af; .. Dx D
CALL r_sub // Dy:=af-ec
XCHG s1 // Dx; .. Dy D
POP r1 // D ; .. Dy
PUSH r1 // .. Dy D
CALL r_div // x:=Dx/D
XCHG s1 // Dy; .. x D
POP r1 // D ; .. x
CALL r_div // y:=Dy/D
MOV r1,r0 // y
POP r0 // x


```
C.3. Sample non-leaf function
```
#### RET

We have used 40 instructions: 18 one-byte, 11 two-byte, and 11 three-byte,
for a total of 18 ·1 + 11·2 + 11·3 = 73bytes.

C.3.8. Stack machine with basic stack primitives. We reuse the code
provided inC.1.5, simply replacing arithmetic primitives (VM instructions)
with subroutine calls. The only substantive modification is the insertion
of the previously optionalXCHG s1before the third multiplication, because
even an optimizing compiler cannot now know whether CALL r_mulis a
commutative operation. We have also used the “tail recursion optimization”
by replacing the finalCALL r_divfollowed byRETwithJMP r_div.

PUSH s5 // a b c d e f a
PUSH s3 // a b c d e f a d
CALL r_mul // a b c d e f ad
PUSH s5 // a b c d e f ad b
PUSH s5 // a b c d e f ad b c
CALL r_mul // a b c d e f ad bc
CALL r_sub // a b c d e f ad-bc
XCHG s3 // a b c ad-bc e f d
PUSH s2 // a b c ad-bc e f d e
XCHG s1 // a b c ad-bc e f e d
CALL r_mul // a b c ad-bc e f ed
XCHG s5 // a ed c ad-bc e f b
PUSH s1 // a ed c ad-bc e f b f
CALL r_mul // a ed c ad-bc e f bf
XCHG s1,s5 // a f c ad-bc e ed bf
CALL r_sub // a f c ad-bc e ed-bf
XCHG s3 // a f ed-bf ad-bc e c
CALL r_mul // a f ed-bf ad-bc ec
XCHG s3 // a ec ed-bf ad-bc f
XCHG s1,s4 // ad-bc ec ed-bf a f
CALL r_mul // D ec Dx af
XCHG s1 // D ec af Dx
XCHG s2 // D Dx af ec
CALL r_sub // D Dx Dy
XCHG s1 // D Dy Dx
PUSH s2 // D Dy Dx D


```
C.4. Comparison of machine code for sample non-leaf function
```
CALL r_div // D Dy x
XCHG s2 // x Dy D
JMP r_div // x y

We have used 29 instructions; assuming one-byte encodings for all stack
operations, and three-byte encodings forCALLandJMPinstructions, we end
up with 51 bytes.

C.3.9. Stack machine with compound stack primitives. We again
reuse the code provided inC.1.7, replacing arithmetic primitives with sub-
routine calls and making the tail recursion optimization:

PUSH2 s5,s2 // a b c d e f a d
CALL r_mul // a b c d e f ad
PUSH2 s5,s4 // a b c d e f ad b c
CALL r_mul // a b c d e f ad bc
CALL r_sub // a b c d e f ad-bc
PUXC s2,s3 // a b c ad-bc e f e d
CALL r_mul // a b c D e f ed
XCHG3 s6,s0,s5 // (same as XCHG s2,s6; XCHG s1,s0; XCHG s0,s5)
// e f c D a ed b
PUSH s5 // e f c D a ed b f
CALL r_mul // e f c D a ed bf
CALL r_sub // e f c D a ed-bf
XCHG s4 // e Dx c D a f
CALL r_mul // e Dx c D af
XCHG2 s4,s2 // D Dx af e c
CALL r_mul // D Dx af ec
CALL r_sub // D Dx Dy
XCPU s1,s2 // D Dy Dx D
CALL r_div // D Dy x
XCHG s2 // x Dy D
JMP r_div // x y

This code uses only 20 instructions, 9 stack-related and 11 control flow-
related (CALLandJMP), for a total of 48 bytes.


### C.4 Comparison of machine code for sample non-leaf function

```
Operations Code bytes Opcode space
Machine m data cont. total data cont. total data arith total
3-addr. 0,8 16 29 12 4127 12 39 42 3444 34^7678 35/256 34/256 72/256
```
```
2-addr. 0,8 16 29 12 4127 12 39 42 3444 34^7678 37/256 4/256 44/256
```
```
1-addr. 0,8 16 33 12 4528 12 40 33 3439 34^6773 97/256 64/256 164/256
stack (basic) − 18 11 29 18 33 51 64/256 4/256 71/256
stack (comp.) − 9 11 20 15 33 48 84/256 4/256 91/256
```
Table 5: A summary of machine code properties for hypothetical 3-address, 2-address,
1-address, and stack machines, generated for a sample non-leaf function (cf. C.3.1),
assumingmof the 16 registers must be preserved by called subroutines.

### C.4 Comparison of machine code for sample non-leaf

### function

Table 5 summarizes the properties of machine code corresponding to the
same source file provided in C.3.1. We consider only the “realistically”
encoded three-address machines. Three-address and two-address machines
have the same code density properties, but differ in the utilization of opcode
space. The one-address machine, somewhat surprisingly, managed to pro-
duced shorter code than the two-address and three-address machines, at the
expense of using up more than half of all opcode space. The stack machine
is the obvious winner in this code density contest, without compromizing its
excellent extendability (measured in opcode space used for arithmetic and
other data transformation instructions).

C.4.1. Combining with results for leaf functions. It is instructive
to compare this table with the results inC.2 for a sample leaf function,
summarized in Table 1 (form= 0preserved registers) and the very similar
Table 3 (form= 8preserved registers), and, if one is still interested in case
m= 16(which turned out to be worse thanm= 8in almost all situations),
also to Table 2.
We see that the stack machine beats all register machines on non-leaf
functions. As for the leaf functions, only the three-address machine with the
“optimistic” encoding of arithmetic instructions was able to beat the stack
machine, winning by 15%, by compromising its extendability. However, the
same three-address machine produces 25% longer code for non-leaf functions.


```
C.4. Comparison of machine code for sample non-leaf function
```
```
Operations Code bytes Opcode space
Machine m data cont. total data cont. total data arith total
3-addr. 0,8 16 29 12 4127 12 39 35.5 3435.5 34 69.569.5 110/256 4/256 117/256
```
```
2-addr. 0,8 16 29 12 4127 12 39 35.5 3435.5 34 69.569.5 110/256 4/256 117/256
```
```
1-addr. 0,8 16 33 12 4528 12 40 33.5 3433 34 67.5^67 112/256 4/256 119/256
stack (basic) − 18 11 29 18 33 51 64/256 4/256 71/256
stack (comp.) − 9 11 20 15 33 48 84/256 4/256 91/256
```
Table 6: A summary of machine code properties for hypothetical 3-address, 2-address,
1-address, and stack machines, generated for a sample non-leaf function (cf. C.3.1),
assumingmof the 16 registers must be preserved by called subroutines. This time we use
fractions of bytes to encode instructions, enabling a fairer comparison. Otherwise, this
table is similar to Table 5.

If a typical program consists of a mixture of leaf and non-leaf functions in
approximately equal proportion, then the stack machine will still win.

C.4.2. A fairer comparison using a binary code instead of a byte
code. Similarly to C.2.5, we may offer a fairer comparison of different
register machines and the stack machine by using arbitrary binary codes
instead of byte codes to encode instructions, and matching the opcode space
used for data manipulation and arithmetic instructions by different machines.
The results of this modified comparison are summarized in Table 6. We see
that the stack machines still win by a large margin, while using less opcode
space for stack/data manipulation.

C.4.3. Comparison with real machines. Note that our hypothetical
register machines have been considerably optimized to produce shorter code
than actually existing register machines; the latter are subject to other design
considerations apart from code density and extendability, such as backward
compatibility, faster instruction decoding, parallel execution of neighboring
instructions, ease of automatically producing optimized code by compilers,
and so on.
For example, the very popular two-address register architecture x86-64
produces code that is approximately twice as long as our “ideal” results for
the two-address machines. On the other hand, our results for the stack
machines are directly applicable to TVM, which has been explicitly designed
with the considerations presented in this appendix in mind. Furthermore, the


```
C.4. Comparison of machine code for sample non-leaf function
```
actual TVM code is evenshorter (in bytes) than shown in Table 5 because
of the presence of the two-byteCALLinstruction, allowing TVM to call up to
256 user-defined functions from the dictionary atc3. This means that one
should subtract 10 bytes from the results for stack machines in Table 5 if one
wants to specifically consider TVM, rather than an abstract stack machine;
this produces a code size of approximately 40 bytes (or shorter), almost half
that of an abstract two-address or three-address machine.

C.4.4. Automatic generation of optimized code.An interesting point
is that the stack machine code in our samples might have been generated
automatically by a very simple optimizing compiler, which rearranges values
near the top of the stack appropriately before invoking each primitive or
calling a function as explained in2.2.2and2.2.5. The only exception is the
unimportant “manual”XCHG3optimization described inC.1.7, which enabled
us to shorten the code by one more byte.
By contrast, the heavily optimized (with respect to size) code for register
machines shown inC.3.2andC.3.3is unlikely to be produced automati-
cally by an optimizing compiler. Therefore, if we had compared compiler-
generated code instead of manually-generated code, the advantages of stack
machines with respect to code density would have been even more striking.


