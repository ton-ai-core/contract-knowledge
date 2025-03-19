# Fift: A Brief Introduction

### Nikolai Durov

### February 6, 2020

```
Abstract
The aim of this text is to provide a brief description of Fift, a new
programming language specifically designed for creating and managing
TON Blockchain smart contracts, and its features used for interaction
with the TON Virtual Machine [4] and the TON Blockchain [5].
```
## Introduction

This document provides a brief description of Fift, a stack-based general-
purpose programming language optimized for creating, debugging, and man-
aging TON Blockchain smart contracts.
Fift has been specifically designed to interact with the TON Virtual Ma-
chine (TON VM or TVM) [4] and the TON Blockchain [5]. In particular,
it offers native support for 257-bit integer arithmetic and TVM cell ma-
nipulation shared with TVM, as well as an interface to the Ed25519-based
cryptography employed by the TON Blockchain. A macro assembler for
TVM code, useful for writing new smart contracts, is also included in the
Fift distribution.
Being a stack-based language, Fift is not unlike Forth. Because of the
brevity of this text, some knowledge of Forth might be helpful for under-
standing Fift.^1 However, there are significant differences between the two
languages. For instance, Fift enforces runtime type-checking, and keeps val-
ues of different types (not only integers) in its stack.
A list of words (built-in functions, or primitives) defined in Fift, along
with their brief descriptions, is presented in Appendix A.

(^1) Good introductions to Forth exist; we can recommend [1].


```
Introduction
```
Please note that the current version of this document describes a pre-
liminary test version of Fift; some minor details are likely to change in the
future.


## Introduction


- 1 Overview Contents
- 2 Fift basics
   - 2.1 List of Fift stack value types
   - 2.2 Comments
   - 2.3 Terminating Fift
   - 2.4 Simple integer arithmetic
   - 2.5 Stack manipulation words
   - 2.6 Defining new words
   - 2.7 Named constants
   - 2.8 Integer and fractional constants, or literals
   - 2.9 String literals
   - 2.10 Simple string manipulation
   - 2.11 Boolean expressions, or flags
   - 2.12 Integer comparison operations
   - 2.13 String comparison operations
   - 2.14 Named and unnamed variables
   - 2.15 Tuples and arrays
   - 2.16 Lists
   - 2.17 Atoms
   - 2.18 Command line arguments in script mode
- 3 Blocks, loops, and conditionals
   - 3.1 Defining and executing blocks
   - 3.2 Conditional execution of blocks
   - 3.3 Simple loops
   - 3.4 Loops with an exit condition
   - 3.5 Recursion
   - 3.6 Throwing exceptions
- 4 Dictionary, interpreter, and compiler
   - 4.1 The state of the Fift interpreter
   - 4.2 Active and ordinary words
   - 4.3 Compiling literals
   - 4.4 Defining new active words
   - 4.5 Defining words and dictionary manipulation
   - 4.6 Dictionary lookup Introduction
   - 4.7 Creating and manipulating word lists
   - 4.8 Custom defining words
- 5 Cell manipulation
   - 5.1 Slice literals
   - 5.2 Builder primitives
   - 5.3 Slice primitives
   - 5.4 Cell hash operations
   - 5.5 Bag-of-cells operations
   - 5.6 Binary file I/O and Bytes manipulation
- 6 TON-specific operations
   - 6.1 Ed25519 cryptography
   - 6.2 Smart-contract address parser
   - 6.3 Dictionary manipulation
   - 6.4 Invoking TVM from Fift
- 7 Using the Fift assembler
   - 7.1 Loading the Fift assembler
   - 7.2 Fift assembler basics
   - 7.3 Pushing integer constants
   - 7.4 Immediate arguments
   - 7.5 Immediate continuations
   - 7.6 Control flow: loops and conditionals
   - 7.7 Macro definitions
   - 7.8 Larger programs and subroutines
- A List of Fift words


```
Chapter1. Overview
```
## 1 Overview Contents

Fift is a simple stack-based programming language designed for testing and
debugging the TON Virtual Machine [4] and the TON Blockchain [5], but
potentially useful for other purposes as well. When Fift is invoked (usually by
executing a binary file calledfift), it either reads, parses, and interprets one
or several source files indicated in the command line, or enters the interac-
tive mode and interprets Fift commands read and parsed from the standard
input. There is also a “script mode”, activated by command line switch-s,
in which all command line arguments except the first one are passed to the
Fift program by means of the variables$nand$#. In this way, Fift can
be used both for interactive experimentation and debugging as well as for
writing simple scripts.
All data manipulated by Fift is kept in a (LIFO) stack. Each stack
entry is supplemented by atype tag, which unambiguously determines the
type of the value kept in the corresponding stack entry. The types of values
supported by Fift includeInteger (representing signed 257-bit integers),Cell
(representing a TVM cell, which consists of up to 1023 data bits and up
to four references to other cells as explained in [4]),Slice (a partial view
of aCell used for parsing cells), andBuilder (used for building new cells).
These data types (and their implementations) are shared with TVM [4], and
can be safely passed from the Fift stack to the TVM stack and back when
necessary (e.g., when TVM is invoked from Fift by using a Fift primitive
such asrunvmcode).
In addition to the data types shared with TVM, Fift introduces some
unique data types, such asBytes(arbitrary byte sequences),String(UTF-
strings),WordList, andWordDef (used by Fift to create new “words” and
manipulate their definitions). In fact, Fift can be extended to manipulate
arbitrary “objects” (represented by the generic typeObject), provided they
are derived from C++ classtd::CntObjectin the current implementation.
Fift source files and libraries are usually kept in text files with the suf-
fix.fif. A search path for libraries and included files is passed to the Fift
executable either in a-Icommand line argument or in theFIFTPATHenviron-
ment variable. If neither is set, the default library search path/usr/lib/fift
is used.
On startup, the standard Fift library is read from the fileFift.fifbefore
interpreting any other sources. It must be present in the library search path,
otherwise Fift execution will fail.


```
Chapter1. Overview
```
A fundamental Fift data structure is its global dictionary, containing
words—or, more precisely,word definitions—that correspond both to built-
in primitives and functions and to user-defined functions.^2 A word can be
executed in Fift simply by typing its name (a UTF-8 string without space
characters) in interactive mode. When Fift starts up, some words (primi-
tives) are already defined (by some C++ code in the current implementa-
tion); other words are defined in the standard libraryFift.fif. After that,
the user may extend the dictionary by defining new words or redefining old
ones.
The dictionary is supposed to be split into severalvocabularies, orname-
spaces; however, namespaces are not implemented yet, so all words are cur-
rently defined in the same global namespace.
The Fift parser for input source files and for the standard input (in the
interactive mode) is rather simple: the input is read line-by-line, then blank
characters are skipped, and the longest prefix of the remaining line that is
(the name of) a dictionary word is detected and removed from the input
line.^3 After that, the word thus found is executed, and the process repeats
until the end of the line. When the input line is exhausted, a subsequent line
is read from the current input file or the standard input.
In order to be detected, most words require a blank character or an end-
of-line immediately after them; this is reflected by appending a space to their
names in the dictionary. Other words, calledprefix words, do not require a
blank character immediately after them.
If no word is found, the string consisting of the first remaining characters
of the input line until the next blank or end-of-line character is interpreted
as anIntegerand pushed into the stack. For instance, if we invoke Fift, type
2 3 +. (and press Enter), Fift first pushes anIntegerconstant equal to 2
into its stack, followed by another integer constant equal to 3. After that, the
built-in primitive “+” is parsed and found in the dictionary; when invoked, it
takes the two topmost elements from the stack and replaces them with their
sum ( 5 in our example). Finally, “.” is a primitive that prints the decimal
representation of the top-of-stackInteger, followed by a space. As a result,
we observe “5 ok” printed by the Fift interpreter into the standard output.
The string “ok” is printed by the interpreter whenever it finishes interpreting

(^2) Fift words are typically shorter than functions or subroutines of other programming
languages. A nice discussion and some guidelines (for Forth words) may be found in [2].
(^3) Notice that in contrast to Forth, Fift word names are case-sensitive:dupandDUPare
distinct words.


### 2.1 List of Fift stack value types

a line read from the standard input in the interactive mode.
A list of built-in words may be found in Appendix A.

## 2 Fift basics

This chapter provides an introduction into the basic features of the Fift pro-
gramming language. The discussion is informal and incomplete at first, but
gradually becomes more formal and more precise. In some cases, later chap-
ters and Appendix A provide more details about the words first mentioned
in this chapter; similarly, some tricks that will be dutifully explained in later
chapters are already used here where appropriate.

### 2.1 List of Fift stack value types

Currently, the values of the following data types can be kept in a Fift stack:

- Integer — A signed 257-bit integer. Usually denoted byx,y, orz in
    the stack notation (when the stack effect of a Fift word is described).
- Cell — A TVM cell, consisting of up to 1023 data bits and up to 4
    references to other cells (cf. [4]). Usually denoted bycor its variants,
    such asc′orc 2.
- Slice— A partial view of a TVM cell, used for parsing data fromCells.
    Usually denoted bys.
- Builder — A partially builtCell, containing up to 1023 data bits and
    up to four references; can be used to create newCells. Usually denoted
    byb.
- Null — A type with exactly one “null” value. Used to initialize new
    Boxes. Usually denoted by⊥.
- Tuple— An ordered collection of values of any of these types (not nec-
    essarily the same); can be used to represent values of arbitrary algebraic
    data types and Lisp-style lists.
- String— A (usually printable) UTF-8 string. Usually denoted byS.


```
2.4. Simple integer arithmetic
```
- Bytes— An arbitrary sequence of 8-bit bytes, typically used to repre-
    sent binary data. Usually denoted byB.
- WordList— A (partially created) list of word references, used for cre-
    ating new Fift word definitions. Usually denoted byl.
- WordDef — An execution token, usually representing the definition of
    an existing Fift word. Usually denoted bye.
- Box— A location in memory that can be used to store one stack value.
    Usually denoted byp.
- Atom— A simple entity uniquely identified by its name, a string. Can
    be used to represent identifiers, labels, operation names, tags, and stack
    markers. Usually denoted bya.
- Object— An arbitrary C++ object of any class derived from base class
    td::CntObject; may be used by Fift extensions to manipulate other
    data types and interface with other C++ libraries.

The first six types listed above are shared with TVM; the remainder are
Fift-specific. Notice that not all TVM stack types are present in Fift. For
instance, the TVMContinuationtype is not explicitly recognized by Fift; if
a value of this type ends up in a Fift stack, it is manipulated as a generic
Object.

### 2.2 Comments

Fift recognizes two kinds of comments: “// ” (which must be followed by a
space) opens a single-line comment until the end of the line, and/*defines
a multi-line comment until*/. Both words //and/* are defined in the
standard Fift library (Fift.fif).

### 2.3 Terminating Fift

The word byeterminates the Fift interpreter with a zero exit code. If a
non-zero exit code is required (for instance, in Fift scripts), one can use word
halt, which terminates Fift with the given exit code (passed as anInteger
at the top of the stack). In contrast,quitdoes not quit to the operating
system, but rather exits to the top level of the Fift interpreter.


### 2.4 Simple integer arithmetic

### 2.4 Simple integer arithmetic

When Fift encounters a word that is absent from the dictionary, but which
can be interpreted as an integer constant (or “literal”), its value is pushed
into the stack (as explained in2.8in more detail). Apart from that, several
integer arithmetic primitives are defined:

- +(x y–x+y), replaces twoIntegersxandypassed at the top of the
    stack with their sumx+y. All deeper stack elements remain intact. If
    eitherxoryis not anInteger, or if the sum does not fit into a signed
    257-bitInteger, an exception is thrown.
- -(x y–x−y), computes the differencex−yof twoIntegersxand
    y. Notice that the first argumentxis the second entry from the top
    of the stack, while the second argumentyis taken from the top of the
    stack.
- negate(x–−x), changes the sign of anInteger.
- *(x y–xy), computes the productxyof twoIntegersxandy.
- /(x y–q:=bx/yc), computes the floor-rounded quotientbx/ycof two
    Integers.
- mod(x y–r:=xmody), computes the remainderxmody=x−y·
    bx/ycof division ofxbyy.
- /mod(x y–q r), computes both the quotient and the remainder.
- /c,/r(x y–q), division words similar to/, but using ceiling rounding
    (q:=dx/ye) and nearest-integer rounding (q:=b 1 /2 +x/yc), respec-
    tively.
- /cmod,/rmod(x y–q r:=x−qy), division words similar to/mod, but
    using ceiling or nearest-integer rounding.
- <<(x y–x· 2 y), computes an arithmetic left shift of binary numberx
    byy≥ 0 positions, yieldingx· 2 y.
- >>(x y–q:=bx· 2 −yc), computes an arithmetic right shift byy≥ 0
    positions.


```
2.5. Stack manipulation words
```
- >>c,>>r(x y–q), similar to>>, but using ceiling or nearest-integer
    rounding.
- and,or,xor(x y–x⊕y), compute the bitwise AND, OR, or XOR of
    twoIntegers.
- not(x–− 1 −x), bitwise complement of anInteger.
- */(x y z–bxy/zc), “multiply-then-divide”: multiplies two integersx
    andyproducing a 513-bit intermediate result, then divides the product
    byz.
- */mod(x y z–q r), similar to*/, but computes both the quotient and
    the remainder.
- */c,*/r(x y z –q),*/cmod,*/rmod(x y z –q r), similar to*/or
    */mod, but using ceiling or nearest-integer rounding.
- *>>,*>>c,*>>r(x y z –q), similar to*/and its variants, but with
    division replaced with a right shift. Computeq =xy/ 2 zrounded in
    the indicated fashion (floor, ceiling, or nearest integer).
- <</,<</c, <</r(x y z –q), similar to*/, but with multiplication
    replaced with a left shift. Computeq= 2zx/yrounded in the indicated
    fashion (notice the different order of argumentsyandzcompared to
    */).
In addition, the word “.” may be used to print the decimal representation
of anIntegerpassed at the top of the stack (followed by a single space), and
“x.” prints the hexadecimal representation of the top-of-stack integer. The
integer is removed from the stack afterwards.
The above primitives can be employed to use the Fift interpreter in in-
teractive mode as a simple calculator for arithmetic expressions represented
in reverse Polish notation (with operation symbols after the operands). For
instance,

7 4 -.

computes 7 −4 = 3and prints “3 ok”, and

2 3 4 * +.
2 3 + 4 *.

computes2 + 3·4 = 14and(2 + 3)·4 = 20, and prints “14 20 ok”.


### 2.5 Stack manipulation words

### 2.5 Stack manipulation words

Stack manipulation words rearrange one or several values near the top of
the stack, regardless of their types, and leave all deeper stack values intact.
Some of the most often used stack manipulation words are listed below:

- dup(x–x x), duplicates the top-of-stack entry. If the stack is empty,
    throws an exception.^4
- drop(x– ), removes the top-of-stack entry.
- swap(x y–y x), interchanges the two topmost stack entries.
- rot(x y z–y z x), rotates the three topmost stack entries.
- -rot(x y z –z x y), rotates the three topmost stack entries in the
    opposite direction. Equivalent torot rot.
- over(x y–x y x), creates a copy of the second stack entry from the
    top over the top-of-stack entry.
- tuck(x y–y x y), equivalent toswap over.
- nip(x y–y), removes the second stack entry from the top. Equivalent
    toswap drop.
- 2dup(x y–x y x y), equivalent toover over.
- 2drop(x y– ), equivalent todrop drop.
- 2swap(a b c d–c d a b), interchanges the two topmost pairs of stack
    entries.
- pick(xn.. .x 0 n– xn.. .x 0 xn), creates a copy of then-th entry
    from the top of the stack, wheren≥ 0 is also passed in the stack. In
    particular,0 pickis equivalent todup, and1 picktoover.
- roll(xn.. .x 0 n–xn− 1.. .x 0 xn), rotates the topnstack entries, where
    n≥ 0 is also passed in the stack. In particular,1 rollis equivalent to
    swap, and2 rolltorot.

(^4) Notice that Fift word names are case-sensitive, so one cannot typeDUPinstead ofdup.


### 2.6 Defining new words

- -roll(xn.. .x 0 n–x 0 xn.. .x 1 ), rotates the topnstack entries in
    the opposite direction, wheren ≥ 0 is also passed in the stack. In
    particular,1 -rollis equivalent toswap, and2 -rollto-rot.
- exch(xn.. .x 0 n–x 0.. .xn), interchanges the top of the stack with
    then-th stack entry from the top, wheren≥ 0 is also taken from the
    stack. In particular,1 exchis equivalent toswap, and2 exchtoswap
    rot.
- exch2(.. .n m–... ), interchanges then-th stack entry from the top
    with them-th stack entry from the top, wheren≥ 0 ,m≥ 0 are taken
    from the stack.
- ?dup(x–x xor 0 ), duplicates anInteger x, but only if it is non-zero.
    Otherwise leaves it intact.

For instance, “5 dup * .” will compute 5 ·5 = 25and print “25 ok”.
One can use the word “.s”—which prints the contents of the entire stack,
starting from the deepest elements, without removing the elements printed
from the stack—to inspect the contents of the stack at any time, and to check
the effect of any stack manipulation words. For instance,

1 2 3 4 .s
rot .s

prints

1 2 3 4
ok
1 3 4 2
ok

When Fift does not know how to print a stack value of an unknown type,
it instead prints???.

### 2.6 Defining new words

In its simplest form, defining new Fift words is very easy and can be done
with the aid of three special words: “{”, “}”, and “:”. One simply opens the
definition with{(necessarily followed by a space), then lists all the words that


### 2.7 Named constants

constitute the new definition, then closes the definition with}(also followed
by a space), and finally assigns the resulting definition (represented by a
WordDef value in the stack) to a new word by writing: 〈new-word-name〉.
For instance,

{ dup * } : square

defines a new wordsquare, which executesdupand*when invoked. In this
way, typing5 squarebecomes equivalent to typing5 dup *, and produces
the same result ( 25 ):

5 square.

prints “25 ok”. One can also use the new word as a part of new definitions:

{ dup square square * } : **
3 **.

prints “243 ok”, which indeed is 35.
If the word indicated after “:” is already defined, it is tacitly redefined.
However, all existing definitions of other words will continue to use the old
definition of the redefined word. For instance, if we redefinesquareafter
we have already defined**5as above,**5will continue to use the original
definition ofsquare.

### 2.7 Named constants

One can define(named) constants—i.e., words that push a predefined value
when invoked—by using the defining wordconstantinstead of the defining
word “:” (colon). For instance,

1000000000 constant Gram

defines a constantGramequal toInteger 109. In other words, 1000000000
will be pushed into the stack wheneverGramis invoked:

Gram 2 *.

prints “2000000000 ok”.
Of course, one can use the result of a computation to initialize the value
of a constant:


```
2.8. Integer and fractional constants, or literals
```
Gram 1000 / constant mGram
mGram.

prints “1000000 ok”.
The value of a constant does not necessarily have to be anInteger. For
instance, one can define a string constant in the same way:

"Hello, world!" constant hello
hello type cr

prints “Hello, world!” on a separate line.
If a constant is redefined, all existing definitions of other words will con-
tinue to use the old value of the constant. In this respect, a constant does
not behave as a global variable.
One can also store two values into one “double” constant by using the
defining word2constant. For instance,

355 113 2constant pifrac

defines a new wordpifrac, which will push 355 and 113 (in that order) when
invoked. The two components of a double constant can be of different types.
If one wants to create a constant with a fixed name within a block or
a colon definition, one should use=: and2=: instead ofconstant and
2constant:

{ dup =: x dup * =: y } : setxy
3 setxy x. y. x y +.
7 setxy x. y. x y +.

produces

3 9 12 ok
7 49 56 ok

If one wants to recover the execution-time value of such a “constant”, one can
prefix the name of the constant with the word@’:

{ ."( " @’ x. .", " @’ y. .") " } : showxy
3 setxy showxy

produces

( 3 , 9 ) ok

The drawback of this approach is that@’has to look up the current definition
of constantsxandyin the dictionary each timeshowxyis executed. Variables
(cf.2.14) provide a more efficient way to achieve similar results.


### 2.8 Integer and fractional constants, or literals

### 2.8 Integer and fractional constants, or literals

Fift recognizes unnamed integer constants (calledliteralsto distinguish them
from named constants) in decimal, binary, and hexadecimal formats. Binary
literals are prefixed by0b, hexadecimal literals are prefixed by0x, and dec-
imal literals do not require a prefix. For instance,0b1011, 11 , and 0xb
represent the same integer ( 11 ). An integer literal may be prefixed by a mi-
nus sign “-” to change its sign; the minus sign is accepted both before and
after the0xand0bprefixes.
When Fift encounters a string that is absent from the dictionary but is a
valid integer literal (fitting into the 257-bit signed integer typeInteger), its
value is pushed into the stack.
Apart from that, Fift offers some support for decimal and common frac-
tions. If a string consists of two valid integer literals separated by a slash/,
then Fift interprets it as a fractional literal and represents it by twoIntegers
pandqin the stack, the numeratorpand the denominatorq. For instance,
-17/12pushes− 17 and 12 into the Fift stack (being thus equivalent to-
12 ), and-0x11/0b1100does the same thing. Decimal, binary, and hexadeci-
mal fractions, such as2.39or-0x11.ef, are also represented by two integers
pandq, whereqis a suitable power of the base (10, 2, or 16, respectively).
For instance,2.39is equivalent to239 100, and-0x11.efis equivalent to
-0x11ef 0x100.
Such a representation of fractions is especially convenient for using them
with the scaling primitive*/and its variants, thus converting common and
decimal fractions into a suitable fixed-point representation. For instance, if
we want to represent fractional amounts of Grams by integer amounts of
nanograms, we can define some helper words

1000000000 constant Gram
{ Gram * } : Gram*
{ Gram swap */r } : Gram*/

and then write2.39 Gram*/ or 17/12 Gram*/ instead of integer literals
2390000000 or 1416666667.
If one needs to use such Gram literals often, one can introduce a new
active prefix wordGR$as follows:

{ bl word (number) ?dup 0= abort"not a valid Gram amount"
1- { Gram swap */r } { Gram * } cond


```
2.10. Simple string manipulation
```
1 ’nop
} ::_ GR$

makesGR$3,GR$2.39, andGR$17/12equivalent to integer literals 3000000000 ,
2390000000 , and 1416666667 , respectively. Such values can be printed in
similar form by means of the following words:

{ dup abs <# ’ # 9 times char. hold #s rot sign #>
nip -trailing0 } : (.GR)
{ (.GR) ."GR$" type space } : .GR
-17239000000 .GR

producesGR$-17.239 ok. The above definitions make use of tricks explained
in later portions of this document (especially Chapter 4 ).
We can also manipulate fractions by themselves by defining suitable “ra-
tional arithmetic words”:

// a b c d -- (a*d-b*c) b*d
{ -rot over * 2swap tuck * rot - -rot * } : R-
// a b c d -- a*c b*d
{ rot * -rot * swap } : R*
// a b --
{ swap ._ ."/". } : R.
1.7 2/3 R- R.

will output “31/30 ok”, indicating that 1. 7 − 2 /3 = 31/ 30. Here “._” is a
variant of “.” that does not print a space after the decimal representation of
anInteger.

### 2.9 String literals

String literals are introduced by means of the prefix word", which scans
the remainder of the line until the next"character, and pushes the string
thus obtained into the stack as a value of typeString. For instance,"Hello,
world!"pushes the correspondingStringinto the stack:

"Hello, world!" .s


### 2.10 Simple string manipulation

### 2.10 Simple string manipulation

The following words can be used to manipulate strings:

- "〈string〉"( –S), pushes aStringliteral into the stack.
- ."〈string〉"( – ), prints a constant string into the standard output.
- type(S– ), prints aStringStaken from the top of the stack into the
    standard output.
- cr( – ), outputs a carriage return (or a newline character) into the
    standard output.
- emit(x– ), prints a UTF-8 encoded character with Unicode codepoint
    given byInteger xinto the standard output.
- char 〈string〉( –x), pushes anInteger with the Unicode codepoint
    of the first character of〈string〉.
- bl( –x), pushes the Unicode codepoint of a space, i.e., 32.
- space( – ), prints one space, equivalent tobl emit.
- $+(S S′–S.S′), concatenates two strings.
- $len (S –x), computes the byte length (not the UTF-8 character
    length!) of a string.
- +"〈string〉" (S – S′), concatenates String S with a string literal.
    Equivalent to"〈string〉" $+.
- word(x–S), parses a word delimited by the character with the Unicode
    codepointxfrom the remainder of the current input line and pushes
    the result as aString. For instance,bl word abracadabra typewill
    print the string “abracadabra”. Ifx= 0, skips leading spaces, and
    then scans until the end of the current input line. Ifx= 32, skips
    leading spaces before parsing the next word.
- (.) (x–S), returns theString with the decimal representation of
    Integer x.


### 2.12 Integer comparison operations

- (number)(S– 0 orx 1 orx y 2 ), attempts to parse theStringSas an
    integer or fractional literal as explained in2.8.

For instance,."*","*" type,42 emit, andchar * emitare four different
ways to output a single asterisk.

### 2.11 Boolean expressions, or flags

Fift does not have a separate value type for representing boolean values.
Instead, any non-zeroInteger can be used to represent truth (with− 1 be-
ing the standard representation), while a zeroInteger represents falsehood.
Comparison primitives normally return− 1 to indicate success and 0 other-
wise.
Constantstrueandfalsecan be used to push these special integers into
the stack:

- true( –− 1 ), pushes− 1 into the stack.
- false( – 0 ), pushes 0 into the stack.

If boolean values are standard (either 0 or− 1 ), they can be manipulated
by means of bitwise logical operations and, or, xor, not (listed in 2.4).
Otherwise, they must first be reduced to the standard form using0<>:

- 0<>(x–x 6 = 0), pushes− 1 ifInteger xis non-zero, 0 otherwise.

### 2.12 Integer comparison operations

Several integer comparison operations can be used to obtain boolean values:

- <(x y–?), checks whetherx < y(i.e., pushes− 1 ifx < y, 0 otherwise).
- >,=,<>,<=,>=(x y–?), comparexandyand push− 1 or 0 depending
    on the result of the comparison.
- 0<(x–?), checks whetherx < 0 (i.e., pushes− 1 ifxis negative, 0
    otherwise). Equivalent to0 <.
- 0>,0=,0<>,0<=,0>=(x–?), comparexagainst zero.
- cmp(x y–z), pushes 1 ifx > y,− 1 ifx < y, and 0 ifx=y.


### 2.14 Named and unnamed variables

- sgn(x–y), pushes 1 ifx > 0 ,− 1 ifx < 0 , and 0 ifx= 0. Equivalent
    to0 cmp.

Example:

2 3 <.

prints “-1 ok”, because 2 is less than 3.
A more convoluted example:

{ "true " "false " rot 0= 1+ pick type 2drop } : ?.
2 3 < ?. 2 3 = ?. 2 3 > ?.

prints “true false false ok”.

### 2.13 String comparison operations

Strings can be lexicographically compared by means of the following words:

- $=(S S′–?), returns− 1 if stringsSandS′are equal, 0 otherwise.
- $cmp(S S′ –x), returns 0 if stringsS andS′ are equal,− 1 ifS is
    lexicographically less than S′, and 1 ifSis lexicographically greater
    thanS′.

### 2.14 Named and unnamed variables

In addition to constants introduced in2.7, Fift supportsvariables, which are
a more efficient way to represent changeable values. For instance, the last
two code fragments of2.7could have been written with the aid of variables
instead of constants as follows:

variable x variable y
{ dup x! dup * y! } : setxy
3 setxy x @. y @. x @ y @ +.
7 setxy x @. y @. x @ y @ +.
{ ."( " x @. .", " y @. .") " } : showxy
3 setxy showxy

producing the same output as before:


```
2.14. Named and unnamed variables
```
3 9 12 ok
7 49 56 ok
( 3 , 9 ) ok

The phrasevariable xcreates a newBox, i.e., a memory location that
can be used to store exactly one value of any Fift-supported type, and defines
xas a constant equal to thisBox:

- variable( – ), scans a blank-delimited word nameSfrom the remain-
    der of the input, allocates an emptyBox, and defines a new ordinary
    word S as a constant, which will push the newBox when invoked.
    Equivalent tohole constant.
- hole( –p), creates a newBoxpthat does not hold any value. Equiv-
    alent tonull box.
- box(x–p), creates a newBoxcontaining specified valuex. Equivalent
    tohole tuck !.

The value currently stored in aBox may be fetched by means of word@
(pronounced “fetch”), and modified by means of word!(pronounced “store”):

- @(p–x), fetches the value currently stored inBoxp.
- !(x p– ), stores new valuexintoBoxp.

Several auxiliary words exist that can modify the current value in a more
sophisticated fashion:

- +! (x p– ), increases the integer value stored inBox pbyInteger x.
    Equivalent totuck @ + swap !.
- 1+! (p– ), increases the integer value stored inBoxpby one. Equiv-
    alent to1 swap +!.
- 0! (p– ), storesInteger 0 intoBoxp. Equivalent to0 swap !.

In this way we can implement a simple counter:

variable counter
{ counter 0! } : reset-counter
{ counter @ 1+ dup counter! } : next-counter
reset-counter next-counter. next-counter. next-counter.
reset-counter next-counter.


```
2.14. Named and unnamed variables
```
produces

1 2 3 ok
1 ok

After these definitions are in place, we can even forget the definition of
counter by means of the phrase forget counter. Then the only way
to access the value of this variable is by means of reset-counter and
next-counter.
Variables are usually created byvariablewith no value, or rather with
aNullvalue. If one wishes to create initialized variables, one can use the
phrasebox constant:

17 box constant x
x 1+! x @.

prints “18 ok”. One can even define a special defining word for initialized
variables, if they are needed often:

{ box constant } : init-variable
17 init-variable x
"test" init-variable y
x 1+! x @. y @ type

prints “18 test ok”.
The variables have so far only one disadvantage compared to the con-
stants: one has to access their current values by means of an auxiliary word
@. Of course, one can mitigate this by defining a “getter” and a “setter” word
for a variable, and use these words to write better-looking code:

variable x-box
{ x-box @ } : x
{ x-box! } : x!
{ x x * 5 x * + 6 + } : f(x)
{ ."( " x. .", " f(x). .") " } : .xy
3 x! .xy 5 x! .xy

prints “( 3 , 30 ) ( 5 , 56 ) ok”, which are the points(x,f(x))on the
graph off(x) =x^2 + 5x+ 6withx= 3andx= 5.
Again, if we want to define “getters” for all our variables, we can first
define a defining word as explained in4.8, and use this word to define both
a getter and a setter at the same time:


### 2.15 Tuples and arrays

{ hole dup 1 ’ @ does create 1 ’! does create } : variable-set
variable-set x x!
variable-set y y!
{ ."x=" x. ."y=" y. ."x*y=" x y *. cr } : show
{ y 1+ y! } : up
{ x 1+ x! } : right
{ x y x! y! } : reflect
2 x! 5 y! show up show right show up show reflect show

produces

x=2 y=5 x*y=10
x=2 y=6 x*y=12
x=3 y=6 x*y=18
x=3 y=7 x*y=21
x=7 y=3 x*y=21

### 2.15 Tuples and arrays

Fift also supportsTuples, i.e., immutable ordered collections of arbitrary
values of stack value types (cf.2.1). When aTupletconsists of valuesx 1 ,

... ,xn (in that order), we writet= (x 1 ,...,xn). The numbernis called
thelengthofTuplet; it is also denoted by|t|. Tuples of length two are also
calledpairs, tuples of length three aretriples.
    - tuple(x 1.. .xnn–t), creates newTuplet:= (x 1 ,...,xn)fromn≥ 0
       topmost stack values.
    - pair(x y–t), creates new pairt= (x,y). Equivalent to2 tuple.
    - triple(x y z –t), creates new triplet = (x,y,z). Equivalent to 3
       tuple.
    - |( –t), creates an emptyTuplet= (). Equivalent to0 tuple.
    - ,(t x–t′), appendsxto the end ofTuplet, and returns the resulting
       Tuplet′.
    - .dump(x– ), dumps the topmost stack entry in the same way as.s
       dumps all stack elements.


```
2.15. Tuples and arrays
```
For instance, both

| 2 , 3 , 9 , .dump

and

2 3 9 triple .dump

construct and print triple(2, 3 ,9):

[ 2 3 9 ] ok

Notice that the components of aTupleare not necessarily of the same type,
and that a component of aTuplecan also be aTuple:

1 2 3 triple 4 5 6 triple 7 8 9 triple triple constant Matrix
Matrix .dump cr
| 1 "one" pair , 2 "two" pair , 3 "three" pair , .dump

produces

[ [ 1 2 3 ] [ 4 5 6 ] [ 7 8 9 ] ]
[ [ 1 "one" ] [ 2 "two" ] [ 3 "three" ] ] ok

Once aTuplehas been constructed, we can extract any of its components,
or completely unpack theTupleinto the stack:

- untuple (t n – x 1.. .xn), returns all components of a Tuple t =
    (x 1 ,...,xn), but only if its length is equal to n. Otherwise throws
    an exception.
- unpair(t–x y), unpacks a pairt= (x,y). Equivalent to2 untuple.
- untriple(t–x y z), unpacks a triplet= (x,y,z). Equivalent to 3
    untuple.
- explode(t–x 1.. .xnn), unpacks aTuplet= (x 1 ,...,xn)of unknown
    lengthn, and returns that length.
- count(t–n), returns the lengthn=|t|ofTuplet.
- tuple? (t – ?), checks whether tis a Tuple, and returns − 1 or 0
    accordingly.


```
2.15. Tuples and arrays
```
- [](t i–x), returns the(i+ 1)-st componentti+1ofTuple t, where
    0 ≤i <|t|.
- first(t–x), returns the first component of aTuple. Equivalent to 0
    [].
- second(t–x), returns the second component of aTuple. Equivalent
    to1 [].
- third(t–x), returns the third component of aTuple. Equivalent to
    2 [].

For instance, we can access individual elements and rows of a matrix:

1 2 3 triple 4 5 6 triple 7 8 9 triple triple constant Matrix
Matrix .dump cr
Matrix 1 [] 2 []. cr
Matrix third .dump cr

produces

[ [ 1 2 3 ] [ 4 5 6 ] [ 7 8 9 ] ]
6
[ 7 8 9 ]

Notice thatTuples are somewhat similar to arrays of other programming
languages, but are immutable: we cannot change one individual component
of aTuple. If we still want to create something like an array, we need aTuple
ofBoxes (cf.2.14):

- allot(n –t), creates aTuple that consists ofnnew emptyBoxes.
    Equivalent to| { hole , } rot times.

For instance,

10 allot constant A
| 3 box , 1 box , 4 box , 1 box , 5 box , 9 box , constant B
{ over @ over @ swap rot! swap! } : swap-values-of
{ B swap [] } : B[]
{ B[] swap B[] swap-values-of } : swap-B
{ B[] @. } : .B[]
0 1 swap-B 1 3 swap-B 0 2 swap-B
0 .B[] 1 .B[] 2 .B[] 3 .B[]


### 2.16 Lists

creates an uninitialized arrayAof length 10, an initialized arrayBof length 6,
and then interchanges some elements ofBand prints the first four elements
of the resultingB:

4 1 1 3 ok

### 2.16 Lists

Lisp-style lists can also be represented in Fift. First of all, two special words
are introduced to manipulate values of typeNull, used to represent the empty
list (not to be confused with the emptyTuple):

- null( –⊥), pushes the only value⊥of typeNull, which is also used
    to represent an empty list.
- null? (x–?), checks whetherxis aNull. Can also be used to check
    whether a list is empty.

After that,consandunconsare defined as aliases forpairandunpair:

- cons(h t–l), constructs a list from its head (first element)hand
    its tail (the list consisting of all remaining elements)t. Equivalent to
    pair.
- uncons(l–h t), decomposes a non-empty list into its head and its tail.
    Equivalent tounpair.
- car(l–h), returns the head of a list. Equivalent tofirst.
- cdr(l–t), returns the tail of a list. Equivalent tosecond.
- cadr(l–h′), returns the second element of a list. Equivalent tocdr
    car.
- list(x 1.. .xnn–l), constructs a listlof lengthnwith elementsx 1 ,
   ... ,xn, in that order. Equivalent tonull ’ cons rot times.
- .l(l– ), prints a Lisp-style listl.

For instance,


### 2.17 Atoms

2 3 9 3 tuple .dump cr
2 3 9 3 list dup .dump space dup .l cr
"test" swap cons .l cr

produces

[ 2 3 9 ]
[ 2 [ 3 [ 9 (null) ] ] ] (2 3 9)
("test" 2 3 9)

Notice that the three-element list(2 3 9)is distinct from the triple(2, 3 ,9).

### 2.17 Atoms

AnAtomis a simple entity uniquely identified by its name. Atoms can be
used to represent identifiers, labels, operation names, tags, and stack markers.
Fift offers the following words to manipulateAtoms:

- (atom)(S x–a− 1 or 0 ), returns the onlyAtomawith the name given
    byStringS. If there is no suchAtomyet, either creates it (ifIntegerx
    is non-zero) or returns a single zero to indicate failure (ifxis zero).
- atom(S–a), returns the onlyAtomawith the nameS, creating such
    an atom if necessary. Equivalent totrue (atom) drop.
- ‘〈word〉( –a), introduces anAtom literal, equal to the onlyAtom
    with the name equal to〈word〉. Equivalent to"〈word〉" atom.
- anon( –a), creates a new unique anonymousAtom.
- atom?(u–?), checks whetheruis anAtom.
- eq? (u v–?), checks whetheruandvare equalIntegers,Atoms, or
    Nulls. If they are not equal, or if they are of different types, or not of
    one of the types listed, returns zero.

```
For instance,
```
‘+ 2 ‘* 3 4 3 list 3 list .l

creates and prints the list


```
2.18. Command line arguments in script mode
```
#### (+ 2 (* 3 4))

which is the Lisp-style representation of arithmetical expression2 + 3· 4. An
interpreter for such expressions might useeq? to check the operation sign
(cf.3.5for an explanation of recursive functions in Fift):

variable ’eval
{ ’eval @ execute } : eval
{ dup tuple? {
uncons uncons uncons
null? not abort"three-element list expected"
swap eval swap eval rot
dup ‘+ eq? { drop + } {
dup ‘- eq? { drop - } {
‘* eq? not abort"unknown operation" *
} cond
} cond
} if
} ’eval!
‘+ 2 ‘* 3 4 3 list 3 list dup .l cr eval. cr

prints

(+ 2 (* 3 4))
14

If we loadLisp.fifto enable Lisp-style list syntax, we can enter

"Lisp.fif" include
( ‘+ 2 ( ‘* 3 4 ) ) dup .l cr eval. cr

with the same result as before. The word(, defined inLisp.fif, uses an
anonymousAtomcreated byanonto mark the current stack position, and
then)builds a list from several top stack entries, scanning the stack until
the anonymousAtommarker is found:

variable ’)
{ ") without (" abort } ’)!
{ ’) @ execute } : )
{ null { -rot 2dup eq? not } { swap rot cons } while 2drop
} : list-until-marker
{ anon dup ’) @ 2 { ’)! list-until-marker } does ’)! } : (


```
Chapter3. Blocks, loops, and conditionals
```
### 2.18 Command line arguments in script mode

The Fift interpreter can be invoked inscript mode by passing-sas a com-
mand line option. In this mode, all further command line arguments are
not scanned for Fift startup command line options. Rather, the next argu-
ment after-sis used as the filename of the Fift source file, and all further
command line arguments are passed to the Fift program by means of special
words$nand$#:

- $#( –x), pushes the total number of command-line arguments passed
    to the Fift program.
- $n( –S), pushes then-th command-line argument as aStringS. For
    instance,$0pushes the name of the script being executed,$1the first
    command line argument, and so on.
- $()(x–S), pushes thex-th command-line argument similarly to$n,
    but withInteger xtaken from the stack.

Additionally, if the very first line of a Fift source file begins with the two
characters “#!”, this line is ignored. In this way simple Fift scripts can be
written in a *ix system. For instance, if

#!/usr/bin/fift -s
{ ."usage: " $0 type ." <num1> <num2>" cr
."Computes the product of two integers." cr 1 halt } : usage
{ ’ usage if } : ?usage
$# 2 <> ?usage
$1 (number) 1- ?usage
$2 (number) 1- ?usage
*. cr

is saved into a file cmdline.fif in the current directory, and its execu-
tion bit is set (e.g., bychmod 755 cmdline.fif), then it can be invoked
from the shell or any other program, provided the Fift interpreter is in-
stalled as/usr/bin/fift, and its standard libraryFift.fifis installed as
/usr/lib/fift/Fift.fif:

$ ./cmdline.fif 12 -5

prints

-60

when invoked from a *ix shell such as the Bourne–again shell (Bash).


```
3.2. Conditional execution of blocks
```
## 3 Blocks, loops, and conditionals

Similarly to the arithmetic operations, the execution flow in Fift is controlled
by stack-based primitives. This leads to an inversion typical of reverse Polish
notation and stack-based arithmetic: one first pushes a block representing
a conditional branch or the body of a loop into the stack, and then invokes
a conditional or iterated execution primitive. In this respect, Fift is more
similar to PostScript than to Forth.

### 3.1 Defining and executing blocks

A block is normally defined using the special words “{” and “}”. Roughly
speaking, all words listed between{and}constitute the body of a new block,
which is pushed into the stack as a value of typeWordDef. A block may be
stored as a definition of a new Fift word by means of the defining word “:”
as explained in2.6, or executed by means of the wordexecute:

17 { 2 * } execute.

prints “34 ok”, being essentially equivalent to “17 2 * .”. A slightly more
convoluted example:

{ 2 * } 17 over execute swap execute.

applies “anonymous function” x 7→ 2 xtwice to 17 , and prints the result
2 ·(2·17) = 68. In this way a block is an execution token, which can be
duplicated, stored into a constant, used to define a new word, or executed.
The word’recovers the current definition of a word. Namely, the con-
struct’ 〈word-name〉pushes the execution token equivalent to the current
definition of the word〈word-name〉. For instance,

’ dup execute

is equivalent todup, and

’ dup : duplicate

definesduplicateas a synonym for (the current definition of)dup.
Alternatively, we can duplicate a block to define two new words with the
same definition:

{ dup * }
dup : square : **2

defines bothsquareand**2to be equivalent todup *.


```
3.3. Simple loops
```
### 3.2 Conditional execution of blocks

Conditional execution of blocks is achieved using the wordsif,ifnot, and
cond:

- if (x e– ), executes e (which must be an execution token, i.e., a
    WordDef),^5 but only ifIntegerxis non-zero.
- ifnot(x e– ), executes execution tokene, but only ifIntegerxis zero.
- cond(x e e′– ), ifIntegerxis non-zero, executese, otherwise executes
    e′.

For instance, the last example in2.12can be more conveniently rewritten
as

{ { ."true " } { ."false " } cond } : ?.
2 3 < ?. 2 3 = ?. 2 3 > ?.

still resulting in “true false false ok”.
Notice that blocks can be arbitrarily nested, as already shown in the
previous example. One can write, for example,

{ ?dup
{ 0<
{ ."negative " }
{ ."positive " }
cond
}
{ ."zero " }
cond
} : chksign
-17 chksign

to obtain “negative ok”, because− 17 is negative.

(^5) AWordDef is more general than aWordList. For instance, the definition of the
primitive+is aWordDef, but not aWordList, because+is not defined in terms of other
Fift words.


### 3.4 Loops with an exit condition

### 3.3 Simple loops

The simplest loops are implemented bytimes:

- times(e n– ), executeseexactlyntimes, ifn≥ 0. Ifnis negative,
    throws an exception.

For instance,

1 { 10 * } 70 times.

computes and prints 1070.
We can use this kind of loop to implement a simple factorial function:

{ 0 1 rot { swap 1+ tuck * } swap times nip } : fact
5 fact.

prints “120 ok”, because5! = 1· 2 · 3 · 4 ·5 = 120.
This loop can be modified to compute Fibonacci numbers instead:

{ 0 1 rot { tuck + } swap times nip } : fibo
6 fibo.

computes the sixth Fibonacci numberF 6 = 13.

### 3.4 Loops with an exit condition

More sophisticated loops can be created with the aid ofuntilandwhile:

- until(e – ), executese, then removes the top-of-stack integer and
    checks whether it is zero. If it is, then begins a new iteration of the
    loop by executinge. Otherwise exits the loop.
- while(e e′ – ), executese, then removes and checks the top-of-stack
    integer. If it is zero, exits the loop. Otherwise executese′, then begins
    a new loop iteration by executinge and checking the exit condition
    afterwards.

For instance, we can compute the first two Fibonacci numbers greater than
1000:

{ 1 0 rot { -rot over + swap rot 2dup >= } until drop
} : fib-gtr
1000 fib-gtr..


### 3.5 Recursion

prints “1597 2584 ok”.
We can use this word to compute the first 70 decimal digits of the golden
ratioφ= (1 +

#### √

#### 5)/ 2 ≈ 1. 61803 :

1 { 10 * } 70 times dup fib-gtr */.

prints “ 161803 ... 2604 ok”.

### 3.5 Recursion

Notice that, whenever a word is mentioned inside a{ ...}block, the current
(compile-time) definition is included in theWordListbeing created. In this
way we can refer to the previous definition of a word while defining a new
version of it:

{ +. } : print-sum
{ ."number ". } :.
{ 1+. } : print-next
2. 3. 2 3 print-sum 7 print-next

produces “number 2 number 3 5 number 8 ok”. Notice that print-sum
continues to use the original definition of “.”, butprint-nextalready uses
the modified “.”.
This feature may be convenient on some occasions, but it prevents us
from introducing recursive definitions in the most straightforward fashion.
For instance, the classical recursive definition of the factorial

{ ?dup { dup 1- fact * } { 1 } cond } : fact

will fail to compile, becausefacthappens to be an undefined word when the
definition is compiled.
A simple way around this obstacle is to use the word@’(cf.4.6) that
looks up the current definition of the next word during the execution time
and then executes it, similarly to what we already did in2.7:

{ ?dup { dup 1- @’ fact * } { 1 } cond } : fact
5 fact.

produces “120 ok”, as expected.
However, this solution is rather inefficient, because it uses a dictionary
lookup each timefactis recursively executed. We can avoid this dictionary
lookup by using variables (cf.2.14and2.7):


```
3.5. Recursion
```
variable ’fact
{ ’fact @ execute } : fact
{ ?dup { dup 1- fact * } { 1 } cond } ’fact!
5 fact.

This somewhat longer definition of the factorial avoids dictionary lookups at
execution time by introducing a special variable’factto hold the final def-
inition of the factorial.^6 Thenfactis defined to execute whateverWordDef
is currently stored in’fact, and once the body of the recursive definition
of the factorial is constructed, it is stored into this variable by means of the
phrase’fact !, which replaces the more customary phrase: fact.
We could rewrite the above definition by using special “getter” and “setter”
words for vector variable’factas we did for variables in2.14:

variable ’fact
{ ’fact @ execute } : fact
{ ’fact! } : :fact
forget ’fact
{ ?dup { dup 1- fact * } { 1 } cond } :fact
5 fact.

If we need to introduce a lot of recursive and mutually-recursive definitions,
we might first introduce a custom defining word (cf.4.8) for simultaneously
defining both the “getter” and the “setter” words for anonymous vector vari-
ables, similarly to what we did in2.14:

{ hole dup 1 { @ execute } does create 1 ’! does create
} : vector-set
vector-set fact :fact
{ ?dup { dup 1- fact * } { 1 } cond } :fact
5 fact.

The first three lines of this fragment definefactand:factessentially in
the same way they had been defined in the first four lines of the previous
fragment.
If we wish to makefactunchangeable in the future, we can add aforget
:factline once the definition of the factorial is complete:

(^6) Variables that hold aWordDef to beexecuted later are calledvector variables. The
process of replacingfactwith’fact @ execute, where’factis a vector variable, is
calledvectorization.


```
3.5. Recursion
```
{ hole dup 1 { @ execute } does create 1 ’! does create
} : vector-set
vector-set fact :fact
{ ?dup { dup 1- fact * } { 1 } cond } :fact
forget :fact
5 fact.

Alternatively, we can modify the definition ofvector-setin such a way that
:factwould forget itself once it is invoked:

{ hole dup 1 { @ execute } does create
bl word tuck 2 { (forget)! } does swap 0 (create)
} : vector-set-once
vector-set-once fact :fact
{ ?dup { dup 1- fact * } { 1 } cond } :fact
5 fact.

However, some vector variables must be modified more than once, for
instance, to modify the behavior of the comparison wordlessin a merge
sort algorithm:

{ hole dup 1 { @ execute } does create 1 ’! does create
} : vector-set
vector-set sort :sort
vector-set merge :merge
vector-set less :less
{ null null rot
{ dup null? not }
{ uncons swap rot cons -rot } while drop
} : split
{ dup null? { drop } {
over null? { nip } {
over car over car less ’ swap if
uncons rot merge cons
} cond
} cond
} :merge
{ dup null? {
dup cdr null? {


### 3.6 Throwing exceptions

split sort swap sort merge
} ifnot
} ifnot
} :sort
forget :merge
forget :sort
// set ‘less‘ to compare numbers, sort a list of numbers
’ < :less
3 1 4 1 5 9 2 6 5 9 list
dup .l cr sort .l cr
// set ‘less‘ to compare strings, sort a list of strings
{ $cmp 0< } :less
"once" "upon" "a" "time" "there" "lived" "a" "kitten" 8 list
dup .l cr sort .l cr

producing the following output:

(3 1 4 1 5 9 2 6 5)
(1 1 2 3 4 5 5 6 9)
("once" "upon" "a" "time" "there" "lived" "a" "kitten")
("a" "a" "kitten" "lived" "once" "there" "time" "upon")

### 3.6 Throwing exceptions

Two built-in words are used to throw exceptions:

- abort(S– ), throws an exception with an error message taken from
    StringS.
- abort"〈message〉"(x– ), throws an exception with the error message
    〈message〉ifxis a non-zero integer.

The exception thrown by these words is represented by the C++ exception
fift::IntErrorwith its value equal to the specified string. It is normally
handled within the Fift interpreter itself by aborting all execution up to
the top level and printing a message with the name of the source file being
interpreted, the line number, the currently interpreted word, and the specified
error message. For instance:

{ dup 0= abort"Division by zero" / } : safe/
5 0 safe/.


### 4.1 The state of the Fift interpreter

prints “safe/: Division by zero”, without the usual “ok”. The stack is
cleared in the process.
Incidentally, when the Fift interpreter encounters an unknown word that
cannot be parsed as an integer literal, an exception with the message “-?” is
thrown, with the effect indicated above, including the stack being cleared.

## 4 Dictionary, interpreter, and compiler

In this chapter we present several specific Fift words for dictionary manipu-
lation and compiler control. The “compiler” is the part of the Fift interpreter
that builds lists of word references (represented byWordListstack values)
from word names; it is activated by the primitive “{” employed for defining
blocks as explained in2.6and3.1.
Most of the information included in this chapter is rather sophisticated
and may be skipped during a first reading. However, the techniques described
here are heavily employed by the Fift assembler, used to compile TVM code.
Therefore, this section is indispensable if one wishes to understand the cur-
rent implementation of the Fift assembler.

### 4.1 The state of the Fift interpreter

The state of the Fift interpreter is controlled by an internal integer variable
called state, currently unavailable from Fift itself. When stateis zero,
all words parsed from the input (i.e., the Fift source file or the standard
input in the interactive mode) are looked up in the dictionary and immedi-
ately executed afterwards. Whenstateis positive, the words found in the
dictionary are not executed. Instead, they (or rather the references to their
current definitions) arecompiled, i.e., added to the end of theWordListbeing
constructed.
Typically, stateequals the number of the currently open blocks. For
instance, after interpreting “{ 0= { ."zero"” the state variable will be
equal to two, because there are two nested blocks. TheWordList being
constructed is kept at the top of the stack.
The primitive “{” simply pushes a new emptyWordListinto the stack,
and increasesstateby one. The primitive “}” throws an exception ifstate
is already zero; otherwise it decreasesstateby one, and leaves the resulting


### 4.3 Compiling literals

WordListin the stack, representing the block just constructed.^7 After that,
if the resulting value ofstateis non-zero, the new block is compiled as a
literal (unnamed constant) into the encompassing block.

### 4.2 Active and ordinary words

All dictionary words have a special flag indicating whether they areactive
words orordinary words. By default, all words are ordinary. In particular,
all words defined with the aid of “:” andconstantare ordinary.
When the Fift interpreter finds a word definition in the dictionary, it
checks whether it is an ordinary word. If it is, then the current word definition
is either executed (ifstateis zero) or “compiled” (ifstateis greater than
zero) as explained in4.1.
On the other hand, if the word is active, then it is always executed, even
ifstateis positive. An active word is expected to leave some valuesx 1.. .xn
n ein the stack, wheren≥ 0 is an integer,x 1 ...xnarenvalues of arbitrary
types, andeis an execution token (a value of typeWordDef). After that,
the interpreter performs different actions depending onstate: ifstateis
zero, thennis discarded andeis executed, as if anip executephrase were
found. Ifstateis non-zero, then this collection is “compiled” in the current
WordList(located immediately belowx 1 in the stack) in the same way as if
the(compile)primitive were invoked. This compilation amounts to adding
some code to the end of the currentWordListthat would pushx 1 ,... ,xn
into the stack when invoked, and then adding a reference toe(representing
a delayed execution ofe). Ifeis equal to the special value’nop, representing
an execution token that does nothing when executed, then this last step is
omitted.

### 4.3 Compiling literals

When the Fift interpreter encounters a word that is absent from the dictio-
nary, it invokes the primitive(number)to attempt to parse it as an integer
or fractional literal. If this attempt succeeds, then the special value’nopis
pushed, and the interpretation proceeds in the same way as if an active word

(^7) The word}also transforms thisWordListinto aWordDef, which has a different type
tag and therefore is a different Fift value, even if the same underlying C++ object is used
by the C++ implementation.


```
4.5. Defining words and dictionary manipulation
```
were encountered. In other words, ifstateis zero, then the literal is sim-
ply left in the stack; otherwise,(compile)is invoked to modify the current
WordListso that it would push the literal when executed.

### 4.4 Defining new active words

New active words are defined similarly to new ordinary words, but using “::”
instead of “:”. For instance,

{ bl word 1 ’ type } :: say

defines the active wordsay, which scans the next blank-separated word after
itself and compiles it as a literal along with a reference to the current defini-
tion oftypeinto the currentWordList(ifstateis non-zero, i.e., if the Fift
interpreter is compiling a block). When invoked, this addition to the block
will push the stored string into the stack and executetype, thus printing the
next word aftersay. On the other hand, ifstateis zero, then these two
actions are performed by the Fift interpreter immediately. In this way,

1 2 say hello +.

will print “hello3 ok”, while

{ 2 say hello +. } : test
1 test 4 test

will print “hello3 hello6 ok”.
Of course, a block may be used to represent the required action instead
of’ type. For instance, if we want a version ofsaythat prints a space after
the stored word, we can write

{ bl word 1 { type space } } :: say
{ 2 say hello +. } : test
1 test 4 test

to obtain “hello 3 hello 6 ok”.
Incidentally, the words"(introducing a string literal) and."(printing a
string literal) can be defined as follows:

{ char " word 1 ’nop } ::_ "
{ char " word 1 ’ type } ::_ ."

The new defining word “::_” defines an activeprefix word, i.e., an active
word that does not require a space afterwards.


### 4.5 Defining words and dictionary manipulation

### 4.5 Defining words and dictionary manipulation

Defining wordsare words that define new words in the Fift dictionary. For
instance, “:”, “::_”, andconstantare defining words. All of these defining
words might have been defined using the primitive(create); in fact, the user
can introduce custom defining words if so desired. Let us list some defining
words and dictionary manipulation words:

- create 〈word-name〉(e– ), defines a new ordinary word with the name
    equal to the next word scanned from the input, usingWordDef eas its
    definition. If the word already exists, it is tacitly redefined.
- (create)(e S x– ), creates a new word with the name equal toString
    S and definition equal to WordDef e, using flags passed in Integer
    0 ≤x≤ 3. If bit+1is set inx, creates an active word; if bit+2is set
    inx, creates a prefix word.
- : 〈word-name〉(e– ), defines a new ordinary word〈word-name〉in
    the dictionary usingWordDefeas its definition. If the specified word
    is already present in the dictionary, it is tacitly redefined.
- forget 〈word-name〉( – ), forgets (removes from the dictionary) the
    definition of the specified word.
- (forget)(S– ), forgets the word with the name specified inStringS.
    If the word is not found, throws an exception.
- :_ 〈word-name〉(e– ), defines a new ordinaryprefixword〈word-name〉,
    meaning that a blank or an end-of-line character is not required by the
    Fift input parser after the word name. In all other respects it is similar
    to “:”.
- :: 〈word-name〉(e– ), defines a newactiveword〈word-name〉in the
    dictionary usingWordDefeas its definition. If the specified word is
    already present in the dictionary, it is tacitly redefined.
- ::_ 〈word-name〉(e– ), defines a new activeprefixword〈word-name〉,
    meaning that a blank or an end-of-line character is not required by the
    Fift input parser after the word name. In all other respects it is similar
    to “::”.


### 4.6 Dictionary lookup Introduction

- constant 〈word-name〉(x– ), defines a new ordinary word〈word-name〉
    that would push the given valuexwhen invoked.
- 2constant 〈word-name〉(x y– ), defines a new ordinary word named
    〈word-name〉that would push the given valuesxandy(in that order)
    when invoked.
- =: 〈word-name〉(x– ), defines a new ordinary word〈word-name〉that
    would push the given valuexwhen invoked, similarly toconstant, but
    works inside blocks and colon definitions.
- 2=: 〈word-name〉(x y– ), defines a new ordinary word〈word-name〉
    that would push the given valuesxandy(in that order) when invoked,
    similarly to2constant, but works inside blocks and colon definitions.

Notice that most of the above words might have been defined in terms of
(create):

{ bl word 1 2 ’ (create) } "::" 1 (create)
{ bl word 0 2 ’ (create) } :: :
{ bl word 2 2 ’ (create) } :: :_
{ bl word 3 2 ’ (create) } :: ::_
{ bl word 0 (create) } : create
{ bl word (forget) } : forget

### 4.6 Dictionary lookup

The following words can be used to look up words in the dictionary:

- ’ 〈word-name〉( –e), pushes the definition of the word〈word-name〉,
    recovered at the compile time. If the indicated word is not found,
    throws an exception. Notice that ’ 〈word-name〉 executeis always
    equivalent to〈word-name〉for ordinary words, but not for active words.
- nop( – ), does nothing.
- ’nop( –e), pushes the default definition ofnop—an execution token
    that does nothing when executed.
- find (S –e − 1 or e 1 or 0 ), looks up String S in the dictionary
    and returns its definition as aWordDef eif found, followed by− 1 for
    ordinary words or 1 for active words. Otherwise pushes 0.


### 4.7 Creating and manipulating word lists

- (’) 〈word-name〉( – e), similar to ’, but returns the definition of
    the specified word at execution time, performing a dictionary lookup
    each time it is invoked. May be used to recover current values of con-
    stants inside word definitions and other blocks by using the phrase(’)
    〈word-name〉 execute.
- @’ 〈word-name〉( –e), similar to(’), but recovers the definition of
    the specified word at execution time, performing a dictionary lookup
    each time it is invoked, and then executes this definition. May be
    used to recover current values of constants inside word definitions and
    other blocks by using the phrase@’ 〈word-name〉, equivalent to(’)
    〈word-name〉 execute, cf.2.7.
- [compile] 〈word-name〉( – ), compiles〈word-name〉as if it were an or-
    dinary word, even if it is active. Essentially equivalent to’ 〈word-name〉
    execute.
- words( – ), prints the names of all words currently defined in the
    dictionary.

### 4.7 Creating and manipulating word lists

In the Fift stack, lists of references to word definitions and literals, to be
used as blocks or word definitions, are represented by the values of the type
WordList. Some words for manipulatingWordLists include:

- {( –l), an active word that increases internal variablestateby one
    and pushes a new emptyWordListinto the stack.
- }(l–e), an active word that transforms aWordListl into aWord-
    Def (an execution token)e, thus making all further modifications ofl
    impossible, and decreases internal variablestateby one and pushes
    the integer 1 , followed by a’nop. The net effect is to transform the
    constructedWordListinto an execution token and push this execution
    token into the stack, either immediately or during the execution of an
    outer block.
- ({)( –l), pushes an emptyWordListinto the stack.
- (})(l–e), transforms aWordListinto an execution token, making all
    further modifications impossible.


### 4.8 Custom defining words

- (compile)(l x 1.. .xnn e–l′), extendsWordList lso that it would
    push 0 ≤n≤ 255 valuesx 1 ,... , xn into the stack and execute the
    execution tokenewhen invoked, where 0 ≤n≤ 255 is anInteger. Ife
    is equal to the special value’nop, the last step is omitted.
- does(x 1.. .xnn e–e′), creates a new execution tokene′that would
    pushnvaluesx 1 ,... ,xninto the stack and then executee. It is roughly
    equivalent to a combination of({),(compile), and(}).

### 4.8 Custom defining words

The worddoesis actually defined in terms of simpler words:

{ swap ({) over 2+ -roll swap (compile) (}) } : does

It is especially useful for defining custom defining words. For instance,
constantand2constantmay be defined with the aid ofdoesandcreate:

{ 1 ’nop does create } : constant
{ 2 ’nop does create } : 2constant

Of course, non-trivial actions may be performed by the words defined by
means of such custom defining words. For instance,

{ 1 { type space } does create } : says
"hello" says hello
"unknown error" says error
{ hello error } : test
test

will print “hello unknown error ok”, becausehellois defined by means
of a custom defining wordsaysto print “hello” whenever invoked, and
similarlyerrorprints “unknown error” when invoked. The above definitions
are essentially equivalent to

{ ."hello" } : hello
{ ."unknown error" } : error

However, custom defining words may perform more sophisticated actions
when invoked, and preprocess their arguments at compile time. For instance,
the message can be computed in a non-trivial fashion:


### 5.1 Slice literals

"Hello, " "world!" $+ says hw

defines wordhw, which prints “Hello, world!” when invoked. The string with
this message is computed once at compile time (whensaysis invoked), not
at execution time (whenhwis invoked).

## 5 Cell manipulation

We have discussed the basic Fift primitives not related to TVM or the TON
Blockchain so far. Now we will turn to TON-specific words, used to manip-
ulateCells.

### 5.1 Slice literals

Recall that a (TVM)Cellconsists of at most 1023 data bits and at most four
references to otherCells, aSliceis a read-only view of a portion of aCell, and
aBuilderis used to create newCells. Fift has special provisions for defining
Sliceliterals (i.e., unnamed constants), which can also be transformed into
Cellsif necessary.
Slice literals are introduced by means of active prefix wordsx{andb{:

- b{〈binary-data〉}( –s), creates aSlicesthat contains no references
    and up to 1023 data bits specified in〈binary-data〉, which must be a
    string consisting only of the characters ‘ 0 ’ and ‘ 1 ’.
- x{〈hex-data〉}( –s), creates aSlicesthat contains no references and
    up to 1023 data bits specified in〈hex-data〉. More precisely, each hex
    digit from〈hex-data〉is transformed into four binary digits in the usual
    fashion. After that, if the last character of〈hex-data〉is an underscore_,
    then all trailing binary zeroes and the binary one immediately preceding
    them are removed from the resulting binary string (cf. [4, 1.0] for more
    details).

In this way,b{00011101}andx{1d}both push the sameSliceconsisting of
eight data bits and no references. Similarly,b{111010}andx{EA_}push the
sameSliceconsisting of six data bits. An emptySlicecan be represented as
b{}orx{}.
If one wishes to define constant Slices with someCell references, the
following words might be used:


### 5.2 Builder primitives

- |_(s s′–s′′), given twoSlicessands′, creates a newSlices′′, which is
    obtained fromsby appending a new reference to aCell containings′.
- |+(s s′–s′′), concatenates twoSlicessands′. This means that the
    data bits of the newSlices′′are obtained by concatenating the data
    bits ofsand s′, and the list ofCell references ofs′′ is constructed
    similarly by concatenating the corresponding lists forsands′.

### 5.2 Builder primitives

The following words can be used to manipulateBuilders, which can later be
used to construct newCells:

- <b( –b), creates a new emptyBuilder.
- b>(b–c), transforms aBuilderbinto a newCellccontaining the same
    data asb.
- i,(b x y–b′), appends the big-endian binary representation of a signed
    y-bit integerxtoBuilder b, where 0 ≤y≤ 257. If there is not enough
    room inb(i.e., ifbalready contains more than 1023 −ydata bits), or
    ifIntegerxdoes not fit intoybits, an exception is thrown.
- u, (b x y– b′), appends the big-endian binary representation of an
    unsigned y-bit integerxto Builder b, where 0 ≤ y ≤ 256. If the
    operation is impossible, an exception is thrown.
- ref,(b c–b′), appends toBuilder ba reference toCellc. Ifbalready
    contains four references, an exception is thrown.
- s,(b s–b′), appends data bits and references taken fromSlice sto
    Builder b.
- sr, (b s–b′), constructs a new Cell containing all data and refer-
    ences fromSlice s, and appends a reference to this cell toBuilder b.
    Equivalent to<b swap s, b> ref,.
- $,(b S–b′), appendsStringStoBuilder b. The string is interpreted
    as a binary string of length 8 n, wherenis the number of bytes in the
    UTF-8 representation ofS.


```
5.2. Builder primitives
```
- B,(b B–b′), appendsBytesBtoBuilderb.
- b+(b b′–b′′), concatenates twoBuildersbandb′.
- bbits(b–x), returns the number of data bits already stored inBuilderb.
    The resultxis anInteger in the range 0 ... 1023.
- brefs (b – x), returns the number of references already stored in
    Builder b. The resultxis anInteger in the range 0 ... 4.
- bbitrefs(b–x y), returns both the number of data bitsxand the
    number of referencesyalready stored inBuilderb.
- brembits(b–x), returns the maximum number of additional data bits
    that can be stored inBuilderb. Equivalent tobbits 1023 swap -.
- bremrefs(b–x), returns the maximum number of additional cell ref-
    erences that can be stored inBuilder b.
- brembitrefs(b–x y), returns both the maximum number of additional
    data bits 0 ≤x≤ 1023 and the maximum number of additional cell
    references 0 ≤y≤ 4 that can be stored inBuilder b.

The resultingBuilder may be inspected by means of the non-destructive
stack dump primitive.s, or by the phraseb> <s csr.. For instance:

{ <b x{4A} s, rot 16 u, swap 32 i, .s b> } : mkTest
17239 -1000000001 mkTest
<s csr.

outputs

BC{000e4a4357c46535ff}
ok
x{4A4357C46535FF}
ok

One can observe that.sdumps the internal representation of aBuilder, with
two tag bytes at the beginning (usually equal to the number of cell references
already stored in theBuilder, and to twice the number of complete bytes
stored in theBuilder, increased by one if an incomplete byte is present). On


### 5.3 Slice primitives

the other hand,csr. dumps aSlice(constructed from aCellby<s, cf.5.3)
in a form similar to that used byx{to defineSliceliterals (cf.5.1).
Incidentally, the wordmkTestshown above (without the.sin its defini-
tion) corresponds to the TL-B constructor

test#4a first:uint16 second:int32 = Test;

and may be used to serialize values of this TL-B type.

### 5.3 Slice primitives

The following words can be used to manipulate values of the typeSlice, which
represents a read-only view of a portion of aCell. In this way data previously
stored into aCell may be deserialized, by first transforming aCell into a
Slice, and then extracting the required data from thisSlice step-by-step.

- <s(c–s), transforms aCellcinto aSlicescontaining the same data.
    It usually marks the start of the deserialization of a cell.
- s>(s– ), throws an exception ifSlicesis non-empty. It usually marks
    the end of the deserialization of a cell, checking whether there are any
    unprocessed data bits or references left.
- i@(s x–y), fetches a signed big-endianx-bit integer from the first
    xbits ofSlices. Ifscontains less thanxdata bits, an exception is
    thrown.
- i@+(s x–y s′), fetches a signed big-endianx-bit integer from the first
    xbits ofSlicessimilarly toi@, but returns the remainder ofsas well.
- i@? (s x–y− 1 or 0 ), fetches a signed integer from aSlicesimilarly to
    i@, but pushes integer− 1 afterwards on success. If there are less than
    xbits left ins, pushes integer 0 to indicate failure.
- i@?+(s x–y s′− 1 ors 0 ), fetches a signed integer fromSlice sand
    computes the remainder of thisSlice similarly toi@+, but pushes− 1
    afterwards to indicate success. On failure, pushes the unchangedSlices
    and 0 to indicate failure.
- u@,u@+,u@?,u@?+, counterparts ofi@,i@+,i@?,i@?+for deserializing
    unsigned integers.


```
5.3. Slice primitives
```
- B@(s x–B), fetches firstxbytes (i.e., 8 xbits) fromSlices, and returns
    them as aBytesvalueB. If there are not enough data bits ins, throws
    an exception.
- B@+(s x–B s′), similar toB@, but returns the remainder ofSlicesas
    well.
- B@? (s x–B− 1 or 0 ), similar toB@, but uses a flag to indicate failure
    instead of throwing an exception.
- B@?+(s x–B s′− 1 ors 0 ), similar toB@+, but uses a flag to indicate
    failure instead of throwing an exception.
- $@,$@+,$@?,$@?+, counterparts ofB@,B@+,B@?,B@?+, returning the
    result as a (UTF-8)Stringinstead of aBytesvalue. These primitives
    do not check whether the byte sequence read is a valid UTF-8 string.
- ref@(s–c), fetches the first reference fromSlice sand returns the
    Cellcreferred to. If there are no references left, throws an exception.
- ref@+(s–s′c), similar toref@, but returns the remainder ofsas well.
- ref@? (s–c− 1 or 0 ), similar to ref@, but uses a flag to indicate
    failure instead of throwing an exception.
- ref@?+(s–s′c− 1 ors 0 ), similar toref@+, but uses a flag to indicate
    failure instead of throwing an exception.
- empty?(s–?), checks whether aSliceis empty (i.e., has no data bits
    and no references left), and returns− 1 or 0 accordingly.
- remaining(s–x y), returns both the number of data bitsxand the
    number of cell referencesyremaining inSlices.
- sbits(s–x), returns the number of data bitsxremaining inSlices.
- srefs(s– x), returns the number of cell references xremaining in
    Slices.
- sbitrefs (s – x y), returns both the number of data bits x and
    the number of cell referencesy remaining inSlice s. Equivalent to
    remaining.


```
5.3. Slice primitives
```
- $>s(S–s), transformsStringS into aSlice. Equivalent to<b swap
    $, b> <s.
- s>c(s–c), creates aCellcdirectly from aSlices. Equivalent to<b
    swap s, b>.
- csr. (s– ), recursively prints aSlices. On the first line, the data
    bits ofsare displayed in hexadecimal form embedded into anx{...}
    construct similar to the one used forSlice literals (cf.5.1). On the
    next lines, the cells referred to bysare printed with larger indentation.

For instance, values of the TL-B typeTestdiscussed in5.2

test#4a first:uint16 second:int32 = Test;

may be deserialized as follows:

{ <s 8 u@+ swap 0x4a <> abort"constructor tag mismatch"
16 u@+ 32 i@+ s> } : unpackTest
x{4A4357C46535FF} s>c unpackTest swap..

prints “17239 -1000000001 ok” as expected.
Of course, if one needs to check constructor tags often, a helper word can
be defined for this purpose:

{ dup remaining abort"references in constructor tag"
tuck u@ -rot u@+ -rot <> abort"constructor tag mismatch"
} : tag?
{ <s x{4a} tag? 16 u@+ 32 i@+ s> } : unpackTest
x{4A4357C46535FF} s>c unpackTest swap..

We can do even better with the aid of active prefix words (cf.4.2and4.4):

{ dup remaining abort"references in constructor tag"
dup 256 > abort"constructor tag too long"
tuck u@ 2 { -rot u@+ -rot <> abort"constructor tag mismatch" }
} : (tagchk)
{ [compile] x{ 2drop (tagchk) } ::_ ?x{
{ [compile] b{ 2drop (tagchk) } ::_ ?b{
{ <s ?x{4a} 16 u@+ 32 i@+ s> } : unpackTest
x{4A4357C46535FF} s>c unpackTest swap..


### 5.5 Bag-of-cells operations

A shorter but less efficient solution would be to reuse the previously defined
tag?:

{ [compile] x{ drop ’ tag? } ::_ ?x{
{ [compile] b{ drop ’ tag? } ::_ ?b{
x{11EF55AA} ?x{11E} dup csr.
?b{110} csr.

first outputs “x{F55AA}”, and then throws an exception with the message
“constructor tag mismatch”.

### 5.4 Cell hash operations

There are few words that operate onCells directly. The most important of
them computes the(sha256-based) representation hashof a given cell (cf. [4,
3.1]), which can be roughly described as thesha256hash of the cell’s data
bits concatenated with recursively computed hashes of the cells referred to
by this cell:

- hashB (c – B), computes thesha256-based representation hash of
    Cell c (cf. [4, 3.1]), which unambiguously definesc and all its de-
    scendants (provided there are no collisions for sha256). The result
    is returned as aBytesvalue consisting of exactly 32 bytes.
- hashu(c–x), computes thesha256-based representation hash ofcas
    above, but returns the result as a big-endian unsigned 256-bitInteger.
- shash(s–B), computes thesha256-based representation hash of a
    Sliceby first transforming it into a cell. Equivalent tos>c hashB.

### 5.5 Bag-of-cells operations

Abag of cells is a collection of one or more cells along with all their descen-
dants. It can usually be serialized into a sequence of bytes (represented by
aBytesvalue in Fift) and then saved into a file or transferred by network.
Afterwards, it can be deserialized to recover the original cells. The TON
Blockchain systematically represents different data structures (including the
TON Blockchain blocks) as a tree of cells according to a certain TL-B scheme
(cf. [5], where this scheme is explained in detail), and then these trees of cells
are routinely imported into bags of cells and serialized into binary files.
Fift words for manipulating bags of cells include:


```
5.6. Binary file I/O and Bytes manipulation
```
- B>boc(B–c), deserializes a “standard” bag of cells (i.e., a bag of cells
    with exactly one root cell) represented byBytesB, and returns the
    rootCell c.
- boc+>B(c x–B), creates and serializes a “standard” bag of cells, con-
    taining one root Cell c along with all its descendants. An Integer
    parameter 0 ≤x≤ 31 is used to pass flags indicating the additional
    options for bag-of-cells serialization, with individual bits having the
    following effect:
       - +1enables bag-of-cells index creation (useful for lazy deserializa-
          tion of large bags of cells).
       - +2includes the CRC32-C of all data into the serialization (useful
          for checking data integrity).
       - +4explicitly stores the hash of the root cell into the serialization
          (so that it can be quickly recovered afterwards without a complete
          deserialization).
       - +8stores hashes of some intermediate (non-leaf) cells (useful for
          lazy deserialization of large bags of cells).
       - +16stores cell cache bits to control caching of deserialized cells.

```
Typical values ofxarex= 0orx= 2for very small bags of cells (e.g.,
TON Blockchain external messages) andx= 31for large bags of cells
(e.g., TON Blockchain blocks).
```
- boc>B(c–B), serializes a small “standard” bag of cells with rootCellc
    and all its descendants. Equivalent to0 boc+>B.

For instance, the cell created in5.2with a value of TL-BTesttype may be
serialized as follows:

{ <b x{4A} s, rot 16 u, swap 32 i, b> } : mkTest
17239 -1000000001 mkTest boc>B Bx.

outputs “B5EE9C7201040101000000000900000E4A4357C46535FF ok”. Here
Bx.is the word that prints the hexadecimal representation of aBytesvalue.


### 5.6 Binary file I/O and Bytes manipulation

### 5.6 Binary file I/O and Bytes manipulation

The following words can be used to manipulate values of typeBytes (ar-
bitrary byte sequences) and to read them from or write them into binary
files:

- B{〈hex-digits〉}( –B), pushes aBytesliteral containing data repre-
    sented by an even number of hexadecimal digits.
- Bx. (B – ), prints the hexadecimal representation of aBytes value.
    Each byte is represented by exactly two uppercase hexadecimal digits.
- file>B (S –B), reads the (binary) file with the name specified in
    StringSand returns its contents as aBytesvalue. If the file does not
    exist, an exception is thrown.
- B>file(B S– ), creates a new (binary) file with the name specified in
    StringSand writes data fromBytesBinto the new file. If the specified
    file already exists, it is overwritten.
- file-exists?(S–?), checks whether the file with the name specified
    inStringSexists.

For instance, the bag of cells created in the example in5.5can be saved to
disk assample.bocas follows:

{ <b x{4A} s, rot 16 u, swap 32 i, b> } : mkTest
17239 -1000000001 mkTest boc>B "sample.boc" B>file

It can be loaded and deserialized afterwards (even in another Fift session)
by means offile>BandB>boc:

{ <s 8 u@+ swap 0x4a <> abort"constructor tag mismatch"
16 u@+ 32 i@+ s> } : unpackTest
"sample.boc" file>B B>boc unpackTest swap..

prints “17239 -1000000001 ok”.
Additionally, there are several words for directly packing (serializing) data
intoBytesvalues, and unpacking (deserializing) them afterwards. They can
be combined withB>fileandfile>Bto save data directly into binary files,
and load them afterwards.


```
Chapter6. TON-specific operations
```
- Blen(B–x), returns the length of aBytesvalueBin bytes.
- BhashB(B –B′), computes thesha256hash of aBytes value. The
    hash is returned as a 32-byteBytesvalue.
- Bhashu(B–x), computes thesha256hash of aBytesvalue and returns
    the hash as an unsigned 256-bit big-endian integer.
- B=(B B′–?), checks whether twoBytessequences are equal.
- Bcmp(B B′–x), lexicographically compares twoBytessequences, and
    returns− 1 , 0 , or 1 , depending on the comparison result.
- B>i@(B x–y), deserializes the firstx/ 8 bytes of aBytesvalueBas a
    signed big-endianx-bitIntegery.
- B>i@+(B x–B′y), deserializes the firstx/ 8 bytes ofBas a signed big-
    endianx-bitIntegerysimilarly toB>i@, but also returns the remaining
    bytes ofB.
- B>u@,B>u@+, variants ofB>i@andB>i@+deserializing unsigned inte-
    gers.
- B>Li@,B>Li@+,B>Lu@,B>Lu@+, little-endian variants ofB>i@,B>i@+,
    B>u@,B>u@+.
- B|(B x–B′ B′′), cuts the firstxbytes from aBytesvalue B, and
    returns both the first xbytes (B′) and the remainder (B′′) as new
    Bytesvalues.
- i>B(x y–B), stores a signed big-endiany-bitIntegerxinto aBytes
    valueBconsisting of exactlyy/ 8 bytes. Integerymust be a multiple
    of eight in the range 0 ... 256.
- u>B (x y –B), stores an unsigned big-endiany-bitInteger xinto a
    BytesvalueBconsisting of exactlyy/ 8 bytes, similarly toi>B.
- Li>B,Lu>B, little-endian variants ofi>Bandu>B.
- B+(B′B′′–B), concatenates twoBytessequences.


### 6.2 Smart-contract address parser

## 6 TON-specific operations

This chapter describes the TON-specific Fift words, with the exception of the
words used forCellmanipulation, already discussed in the previous chapter.

### 6.1 Ed25519 cryptography

Fift offers an interface to the same Ed25519 elliptic curve cryptography used
by TVM, described in AppendixAof [5]:

- now( –x), returns the current Unixtime as anInteger.
- newkeypair( –B B′), generates a new Ed25519 private/public key
    pair, and returns both the private keyBand the public keyB′as 32-
    byteBytesvalues. The quality of the keys is good enough for testing
    purposes. Real applications must feed enough entropy into OpenSSL
    PRNG before generating Ed25519 keypairs.
- priv>pub(B–B′), computes the public key corresponding to a pri-
    vate Ed25519 key. Both the public keyB′and the private keyBare
    represented by 32-byteBytesvalues.
- ed25519_sign(B B′–B′′), signs dataBwith the Ed25519 private
    keyB′(a 32-byteBytesvalue) and returns the signature as a 64-byte
    BytesvalueB′′.
- ed25519_sign_uint(x B′–B′′), converts a big-endian unsigned 256-
    bit integerxinto a 32-byte sequence and signs it using the Ed25519
    private keyB′similarly toed25519_sign. Equivalent toswap 256 u>B
    swap ed25519_sign. The integerxto be signed is typically computed
    as the hash of some data.
- ed25519_chksign(B B′B′′–?), checks whetherB′is a valid Ed25519
    signature of dataBwith the public keyB′′.

### 6.2 Smart-contract address parser

Two special words can be used to parse TON smart-contract addresses in
human-readable (base64 or base64url) forms:


### 6.3 Dictionary manipulation

- smca>$(x y z –S), packs a standard TON smart-contract address
    with workchainx(a signed 32-bitInteger) and in-workchain addressy
    (an unsigned 256-bitInteger) into a 48-character stringS(the human-
    readable representation of the address) according to flags z. Possi-
    ble individual flags inzare: +1for non-bounceable addresses,+2for
    testnet-only addresses, and+4for base64url output instead of base64.
- $>smca(S–x y z− 1 or 0 ), unpacks a standard TON smart-contract
    address from its human-readable string representation S. On suc-
    cess, returns the signed 32-bit workchainx, the unsigned 256-bit in-
    workchain addressy, the flags z (where +1means that the address
    is non-bounceable,+2that the address is testnet-only), and− 1. On
    failure, pushes 0.

A sample human-readable smart-contract address could be deserialized and
displayed as follows:

"Ef9Tj6fMJP-OqhAdhKXxq36DL-HYSzCc3-9O6UNzqsgPfYFX"
$>smca 0= abort"bad address"
rot. swap x.. cr

outputs “-1 538fa7...0f7d 0”, meaning that the specified address is in
workchain− 1 (the masterchain of the TON Blockchain), and that the 256-bit
address inside workchain− 1 is 0x538... f7d.

### 6.3 Dictionary manipulation

Fift has several words forhashmapor(TVM) dictionarymanipulation, cor-
responding to values of TL-B typeHashmapE n Xas described in [4, 3.3].
These (TVM) dictionaries are not to be confused with the Fift dictionary,
which is a completely different thing. A dictionary of TL-B typeHashmapE
n X is essentially a key-value collection with distinct n-bit keys (where
0 ≤n≤ 1023 ) and values of an arbitrary TL-B typeX. Dictionaries are
represented by trees of cells (the complete layout may be found in [4, 3.3])
and stored as values of typeCellorSlicein the Fift stack. Sometimes empty
dictionaries are represented by theNullvalue.

- dictnew ( – D), pushes a Null value that represents a new empty
    dictionary.


```
6.3. Dictionary manipulation
```
- idict!(v x D n–D′− 1 orD 0 ), adds a new valuev(represented by a
    Slice) with key given by signed big-endiann-bit integerxinto dictionary
    D(represented by aCellor aNull) withn-bit keys, and returns the new
    dictionaryD′and− 1 on success. Otherwise the unchanged dictionary
    Dand 0 are returned.
- idict!+(v x D n–D′− 1 orD 0 ), adds a new key-value pair(x,v)
    into dictionaryDsimilarly toidict!, but fails if the key already exists
    by returning the unchanged dictionaryDand 0.
- b>idict!,b>idict!+, variants ofidict! andidict!+accepting the
    new valuevin aBuilderinstead of aSlice.
- udict!,udict!+,b>udict!,b>udict!+, variants ofidict!,idict!+,
    b>idict!,b>idict!+, but with an unsignedn-bit integerxused as a
    key.
- sdict!,sdict!+,b>sdict!,b>sdict!+, variants ofidict!,idict!+,
    b>idict!,b>idict!+, but with the firstndata bits ofSlicexused as
    a key.
- idict@(x D n–v− 1 or 0 ), looks up the key represented by signed
    big-endiann-bitInteger xin the dictionary represented byCell D. If
    the key is found, returns the corresponding value as aSlicevand− 1.
    Otherwise returns 0.
- idict@- (x D n– D′ v − 1 or D 0 ), looks up the key represented
    by signed big-endiann-bitInteger xin the dictionary represented by
    Cell D. If the key is found, deletes it from the dictionary and returns
    the modified dictionaryD′, the corresponding value as aSlice v, and
    − 1. Otherwise returns the unmodified dictionaryDand 0.
- idict-(x D n–D′− 1 orD 0 ), deletes integer keyxfrom dictionary
    Dsimilarly toidict@-, but does not return the value corresponding
    toxin the old dictionaryD.
- udict@,udict@-,udict-, variants ofidict@, idict@-,idict-, but
    with anunsigned big-endiann-bitInteger xused as a key.
- sdict@,sdict@-,sdict-, variants ofidict@, idict@-,idict-, but
    with the key provided in the firstnbits ofSlicek.


### 6.4 Invoking TVM from Fift

- dictmap(D n e–s′), applies execution tokene(i.e., an anonymous
    function) to each of the key-value pairs stored in a dictionaryDwith
    n-bit keys. The execution token is executed once for each key-value
    pair, with aBuilder band aSlicev(containing the value) pushed into
    the stack before executinge. After the executionemust leave in the
    stack either a modifiedBuilderb′(containing all data frombalong with
    the new valuev′) and− 1 , or 0 indicating failure. In the latter case,
    the corresponding key is omitted from the new dictionary.
- dictmerge(D D′n e–D′′), combines two dictionariesDandD′with
    n-bit keys into one dictionaryD′′with the same keys. If a key is present
    in only one of the dictionariesDandD′, this key and the correspond-
    ing value are copied verbatim to the new dictionary D′′. Otherwise
    the execution token (anonymous function)eis invoked to merge the
    two values vand v′ corresponding to the same keyk inDandD′,
    respectively. Beforeeis invoked, aBuilder band twoSlicesvandv′
    representing the two values to be merged are pushed. After the execu-
    tioneleaves either a modifiedBuilder b′(containing the original data
    frombalong with the combined value) and− 1 , or 0 on failure. In the
    latter case, the corresponding key is omitted from the new dictionary.

Fift also offers some support for prefix dictionaries:

- pfxdict! (v k s n–s′− 1 or s 0 ), adds key-value pair(k,v), both
    represented bySlices, into a prefix dictionaryswith keys of length at
    mostn. On success, returns the modified dictionarys′ and− 1. On
    failure, returns the original dictionarysand 0.
- pfxdict!+ (v k s n–s′ − 1 ors 0 ), adds key-value pair(k,v)into
    prefix dictionaryssimilarly topfxdict!, but fails if the key already
    exists.
- pfxdict@(k s n–v− 1 or 0 ), looks up keyk(represented by aSlice)
    in the prefix dictionaryswith the length of keys limited bynbits. On
    success, returns the value foundvand− 1. On failure, returns 0.

### 6.4 Invoking TVM from Fift

TVM can be linked with the Fift interpreter. In this case, several Fift prim-
itives become available that can be used to invoke TVM with arguments


```
6.4. Invoking TVM from Fift
```
provided from Fift. The arguments can be prepared in the Fift stack, which
is passed in its entirety to the new instance of TVM. The resulting stack and
the exit code are passed back to Fift and can be examined afterwards.

- runvmcode (.. .s–.. .x), invokes a new instance of TVM with the
    current continuationccinitialized fromSlices, thus executing codes
    in TVM. The original Fift stack (withouts) is passed in its entirety as
    the initial stack of TVM. When TVM terminates, its resulting stack is
    used as the new Fift stack, with the exit codexpushed at its top. Ifx
    is non-zero, indicating that TVM has been terminated by an unhandled
    exception, the next stack entry from the top contains the parameter
    of this exception, andxis the exception code. All other entries are
    removed from the stack in this case.
- runvmdict(.. .s–.. .x), invokes a new instance of TVM with the cur-
    rent continuation ccinitialized fromSlice ssimilarly to runvmcode,
    but also initializes the special registerc3 with the same value, and
    pushes a zero into the initial TVM stack before the TVM execution
    begins. In a typical applicationSlice sconsists of a subroutine selec-
    tion code that uses the top-of-stackInteger to select the subroutine
    to be executed, thus enabling the definition and execution of several
    mutually-recursive subroutines (cf. [4, 4.6] and7.8). The selector equal
    to zero corresponds to themain()subroutine in a large TVM program.
- runvm(.. .s c–.. .x c′), invokes a new instance of TVM with both
    the current continuationccand the special registerc3initialized from
    Slice s, similarly torunvmdict(without pushing an extra zero to the
    initial TVM stack; if necessary, it can be pushed explicitly unders),
    and also initializes special register c4(the “root of persistent data”,
    cf. [4, 1.4]) withCell c. The final value ofc4is returned at the top
    of the final Fift stack as anotherCell c′. In this way one can emulate
    the execution of smart contracts that inspect or modify their persistent
    storage.
- runvmctx(.. .s c t–.. .x c′), a variant ofrunvmthat also initializes
    c7(the “context”) withTuplet. In this way the execution of a TVM
    smart contract inside TON Blockchain can be completely emulated, if
    the correct context is loaded intoc7(cf. [5, 4.4.10]).


```
6.4. Invoking TVM from Fift
```
- gasrunvmcode(.. .s z –.. .x z′), a gas-aware version ofrunvmcode
    that accepts an extraIntegerargumentz(the original gas limit) at the
    top of the stack, and returns the gas consumed by this TVM run as a
    new top-of-stackInteger valuez′.
- gasrunvmdict(.. .s z–.. .x z′), a gas-aware version ofrunvmdict.
- gasrunvm(.. .s c z–.. .x c′z′), a gas-aware version ofrunvm.
- gasrunvmctx(.. .s c t z–.. .x c′z′), a gas-aware version ofrunvmctx.

For example, one can create an instance of TVM running some simple code
as follows:

2 3 9 x{1221} runvmcode .s

The TVM stack is initialized by three integers 2 , 3 , and 9 (in this order; 9
is the topmost entry), and then theSlice x{1221}containing 16 data bits
and no references is transformed into a TVM continuation and executed.
By consulting Appendix A of [4], we see thatx{12}is the code of the TVM
instructionXCHG s1, s2, and thatx{21}is the code of the TVM instruction
OVER(not to be confused with the Fift primitiveover, which incidentally has
the same effect on the stack). The result of the above execution is:

execute XCHG s1,s2
execute OVER
execute implicit RET
3 2 9 2 0
ok

Here 0 is the exit code (indicating successful TVM termination), and3 2 9
2 is the final TVM stack state.
If an unhandled exception is generated during the TVM execution, the
code of this exception is returned as the exit code:

2 3 9 x{122} runvmcode .s

produces

execute XCHG s1,s2
handling exception code 6: invalid or too short opcode
default exception handler, terminating vm with exit code 6
0 6
ok


```
7.2. Fift assembler basics
```
Notice that TVM is executed with internal logging enabled, and its log is
displayed in the standard output.
Simple TVM programs may be represented bySliceliterals with the aid
of thex{...}construct similarly to the above examples. More sophisticated
programs are usually created with the aid of the Fift assembler as explained
in the next chapter.

## 7 Using the Fift assembler

TheFift assembleris a short program (currently less than 30KiB) written
completely in Fift that transforms human-readable mnemonics of TVM in-
structions into their binary representation. For instance, one could write<{
s1 s2 XCHG OVER }>sinstead ofx{1221}in the example discussed in6.4,
provided the Fift assembler has been loaded beforehand (usually by the
phrase"Asm.fif" include).

### 7.1 Loading the Fift assembler

The Fift assembler is usually located in fileAsm.fifin the Fift library direc-
tory (which usually contains standard Fift library files such asFift.fif).
It is typically loaded by putting the phrase"Asm.fif" includeat the very
beginning of a program that needs to use Fift assembler:

- include(S – ), loads and interprets a Fift source file from the path
    given byStringS. If the filenameSdoes not begin with a slash, the Fift
    include search path, typically taken from theFIFTPATHenvironment
    variable or the-Icommand-line argument of the Fift interpreter (and
    equal to/usr/lib/fiftif both are absent), is used to locateS.

The current implementation of the Fift assembler makes heavy use of custom
defining words (cf.4.8); its source can be studied as a good example of how
defining words might be used to write very compact Fift programs (cf. also
the original edition of [1], where a simple 8080 Forth assembler is discussed).
In the future, almost all of the words defined by the Fift assembler will
be moved to a separate vocabulary (namespace). Currently they are defined
in the global namespace, because Fift does not support namespaces yet.


### 7.2 Fift assembler basics

### 7.2 Fift assembler basics

The Fift assembler inherits from Fift its postfix operation notation, i.e., the
arguments or parameters are written before the corresponding instructions.
For instance, the TVM assembler instruction represented asXCHG s1,s2in
[4] is represented in the Fift assembler ass1 s2 XCHG.
Fift assembler code is usually opened by a special opening word, such as
<{, and terminated by a closing word, such as}>or}>s. For instance,

"Asm.fif" include
<{ s1 s2 XCHG OVER }>s
csr.

compiles two TVM instructionsXCHG s1,s2andOVER, and returns the result
as aSlice (because}>sis used). The resultingSlice is displayed bycsr.,
yielding

x{1221}

One can use Appendix A of [4] and verify thatx{12}is indeed the (codepage
zero) code of the TVM instructionXCHG s1,s2, and thatx{21}is the code
of the TVM instructionOVER(not to be confused with Fift primitiveover).
In the future, we will assume that the Fift assember is already loaded and
omit the phrase"Asm.fif" includefrom our examples.
The Fift assembler uses the Fift stack in a straightforward fashion, using
the top several stack entries to hold aBuilderwith the code being assembled,
and the arguments to TVM instructions. For example:

- <{( –b), begins a portion of Fift assembler code by pushing an empty
    Builder into the Fift stack (and potentially switching the namespace
    to the one containing all Fift assembler-specific words). Approximately
    equivalent to<b.
- }>(b–b′), terminates a portion of Fift assembler code and returns the
    assembled portion as aBuilder (and potentially recovers the original
    namespace). Approximately equivalent tonopin most situations.
- }>c(b–c), terminates a portion of Fift assembler code and returns
    the assembled portion as aCell (and potentially recovers the original
    namespace). Approximately equivalent tob>.


### 7.3 Pushing integer constants

- }>s(b–s), terminates a portion of Fift assembler code similarly to}>,
    but returns the assembled portion as aSlice. Equivalent to}>c <s.
- OVER(b –b′), assembles the code of the TVM instruction OVERby
    appending it to the Builder at the top of the stack. Approximately
    equivalent tox{21} s,.
- s1( –s), pushes a specialSliceused by the Fift assembler to represent
    the “stack register”s1of TVM.
- s0.. .s15( –s), words similar tos1, but pushing theSlicerepresent-
    ing other “stack registers” of TVM. Notice thats16.. .s255must be
    accessed using the words().
- s() (x–s), takes anInteger argument 0 ≤ x≤ 255 and returns a
    specialSlice used by the Fift assembler to represent “stack register”
    s(x).
- XCHG(b s s′–b′), takes two specialSlices representing two “stack regis-
    ters”s(i)ands(j)from the stack, and appends toBuilder bthe code
    for the TVM instructionXCHG s(i),s(j).

In particular, note that the wordOVERdefined by the Fift assembler has a
completely different effect from Fift primitiveover.
The actual action ofOVERand other Fift assembler words is somewhat
more complicated than that ofx{21} s,. If the new instruction code does
not fit into theBuilderb(i.e., ifbwould contain more than 1023 data bits after
adding the new instruction code), then this and all subsequent instructions
are assembled into a newBuilder ̃b, and the oldBuilderbis augmented by
a reference to theCellobtained from ̃bonce the generation of ̃bis finished.
In this way long stretches of TVM code are automatically split into chains
of validCells containing at most 1023 bits each. Because TVM interprets a
lonely cell reference at the end of a continuation as an implicitJMPREF, this
partitioning of TVM code into cells has almost no effect on the execution.

### 7.3 Pushing integer constants

The TVM instructionPUSHINT x, pushing anInteger constantxwhen in-
voked, can be assembled with the aid of Fift assembler wordsINTorPUSHINT:


### 7.4 Immediate arguments

- PUSHINT(b x–b′), assembles TVM instructionPUSHINT xinto aBuilder.
- INT(b x–b′), equivalent toPUSHINT.

Notice that the argument toPUSHINTis anIntegervalue taken from the Fift
stack and is not necessarily a literal. For instance,<{ 239 17 * INT }>sis
a valid way to assemble aPUSHINT 4063instruction, because 239 ·17 = 4063.
Notice that the multiplication is performed by Fift during assemble time, not
during the TVM runtime. The latter computation might be performed by
means of<{ 239 INT 17 INT MUL }>s:

<{ 239 17 * INT }>s dup csr. runvmcode .s 2drop
<{ 239 INT 17 INT MUL }>s dup csr. runvmcode .s 2drop

produces

x{810FDF}
execute PUSHINT 4063
execute implicit RET
4063 0
ok
x{8100EF8011A8}
execute PUSHINT 239
execute PUSHINT 17
execute MUL
execute implicit RET
4063 0
ok

Notice that the Fift assembler chooses the shortest encoding of thePUSHINTx
instruction depending on its argumentx.

### 7.4 Immediate arguments

Some TVM instructions (such asPUSHINT) accept immediate arguments.
These arguments are usually passed to the Fift word assembling the cor-
responding instruction in the Fift stack. Integer immediate arguments are
usually represented byIntegers, cells byCells, continuations byBuilders and
Cells, and cell slices bySlices. For instance,17 ADDCONSTassembles TVM
instruction ADDCONST 17, and x{ABCD_} PUSHSLICEassembles PUSHSLICE
xABCD_:


### 7.5 Immediate continuations

239 <{ 17 ADDCONST x{ABCD_} PUSHSLICE }>s dup csr.
runvmcode. swap. csr.

produces

x{A6118B2ABCD0}
execute ADDINT 17
execute PUSHSLICE xABCD_
execute implicit RET
0 256 x{ABCD_}

On some occasions, the Fift assembler pretends to be able to accept imme-
diate arguments that are out of range for the corresponding TVM instruction.
For instance,ADDCONST xis defined only for− 128 ≤x < 128 , but the Fift
assembler accepts239 ADDCONST:

17 <{ 239 ADDCONST }>s dup csr. runvmcode .s

produces

x{8100EFA0}
execute PUSHINT 239
execute ADD
execute implicit RET
256 0

We can see that “ADDCONST 239” has been tacitly replaced by PUSHINT
239 andADD. This feature is convenient when the immediate argument to
ADDCONSTis itself a result of a Fift computation, and it is difficult to esti-
mate whether it will always fit into the required range.
In some cases, there are several versions of the same TVM instructions,
one accepting an immediate argument and another without any arguments.
For instance, there are bothLSHIFT n and LSHIFT instructions. In the
Fift assembler, such variants are assigned distinct mnemonics. In partic-
ular,LSHIFT nis represented byn LSHIFT#, andLSHIFTis represented by
itself.

### 7.5 Immediate continuations

When an immediate argument is a continuation, it is convenient to create
the correspondingBuilder in the Fift stack by means of a nested<{.. .}>
construct. For instance, TVM assembler instructions


```
7.5. Immediate continuations
```
#### PUSHINT 1

#### SWAP

#### PUSHCONT {

#### MULCONST 10

#### }

#### REPEAT

can be assembled and executed by

7
<{ 1 INT SWAP <{ 10 MULCONST }> PUSHCONT REPEAT }>s dup csr.
runvmcode drop.

producing

x{710192A70AE4}
execute PUSHINT 1
execute SWAP
execute PUSHCONT xA70A
execute REPEAT
repeat 7 more times
execute MULINT 10
execute implicit RET
repeat 6 more times
...
repeat 1 more times
execute MULINT 10
execute implicit RET
repeat 0 more times
execute implicit RET
10000000

More convenient ways to use literal continuations created by means of the
Fift assembler exist. For instance, the above example can be also assembled
by

<{ 1 INT SWAP CONT:<{ 10 MULCONST }> REPEAT }>s csr.

or even

<{ 1 INT SWAP REPEAT:<{ 10 MULCONST }> }>s csr.


### 7.6 Control flow: loops and conditionals

both producing “x{710192A70AE4} ok”.
Incidentally, a better way of implementing the above loop is by means of
REPEATEND:

7 <{ 1 INT SWAP REPEATEND 10 MULCONST }>s dup csr.
runvmcode drop.

or

7 <{ 1 INT SWAP REPEAT: 10 MULCONST }>s dup csr.
runvmcode drop.

both produce “x{7101E7A70A}” and output “ 10000000 ” after seven iterations
of the loop.
Notice that several TVM instructions that store a continuation in a sep-
arate cell reference (such asJMPREF) accept their argument in a Cell, not
in aBuilder. In such situations, the<{ ... }>cconstruct can be used to
produce this immediate argument.

### 7.6 Control flow: loops and conditionals

Almost all TVM control flow instructions—such asIF,IFNOT,IFRET,IFNOTRET,
IFELSE,WHILE,WHILEEND,REPEAT,REPEATEND,UNTIL, andUNTILEND—can
be assembled similarly toREPEAT andREPEATEND in the examples of 7.5
when applied to literal continuations. For instance, TVM assembler code

DUP
PUSHINT 1
AND
PUSHCONT {
MULCONST 3
INC
}
PUSHCONT {
RSHIFT 1
}
IFELSE

which computes 3 n+ 1orn/ 2 depending on whether its argumentnis odd
or even, can be assembled and applied ton= 7by


```
7.6. Control flow: loops and conditionals
```
#### <{ DUP 1 INT AND

#### IF:<{ 3 MULCONST INC }>ELSE<{ 1 RSHIFT# }>

}>s dup csr.
7 swap runvmcode drop.

producing

x{2071B093A703A492AB00E2}
ok
execute DUP
execute PUSHINT 1
execute AND
execute PUSHCONT xA703A4
execute PUSHCONT xAB00
execute IFELSE
execute MULINT 3
execute INC
execute implicit RET
execute implicit RET
22 ok

Of course, a more compact and efficient way to implement this conditional
expression would be

<{ DUP 1 INT AND
IF:<{ 3 MULCONST INC }>ELSE: 1 RSHIFT#
}>s dup csr.

or

<{ DUP 1 INT AND
CONT:<{ 3 MULCONST INC }> IFJMP
1 RSHIFT#
}>s dup csr.

both producing the same code “x{2071B093A703A4DCAB00}”.
Fift assembler words that can be used to produce such “high-level” condi-
tionals and loops includeIF:<{,IFNOT:<{,IFJMP:<{,}>ELSE<{,}>ELSE:,
}>IF,REPEAT:<{,UNTIL:<{,WHILE:<{,}>DO<{,}>DO:,AGAIN:<{,}>AGAIN,
}>REPEAT, and}>UNTIL. Their complete list can be found in the source file


### 7.7 Macro definitions

Asm.fif. For instance, an UNTIL loop can be created byUNTIL:<{ ... }>
or<{ ... }>UNTIL, and a WHILE loop byWHILE:<{ ... }>DO<{ ... }>.
If we choose to keep a conditional branch in a separate cell, we can use
the<{ ... }>cconstruct along with instructions such asIFJMPREF:

<{ DUP 1 INT AND
<{ 3 MULCONST INC }>c IFJMPREF
1 RSHIFT#
}>s dup csr.
3 swap runvmcode .s

has the same effect as the code from the previous example when executed,
but it is contained in two separate cells:

x{2071B0E302AB00}
x{A703A4}
execute DUP
execute PUSHINT 1
execute AND
execute IFJMPREF (2946....A1DD)
execute MULINT 3
execute INC
execute implicit RET
10 0

### 7.7 Macro definitions

Because TVM instructions are implemented in the Fift assembler using Fift
words that have a predictable effect on the Fift stack, the Fift assembler
is automatically a macro assembler, supporting macro definitions. For in-
stance, suppose that we wish to define a macro definitionRANGE x y, which
checks whether the TVM top-of-stack value is between integer literalsxand
y(inclusive). This macro definition can be implemented as follows:

{ 2dup > ’ swap if
rot DUP rot GEQINT SWAP swap LEQINT AND
} : RANGE
<{ DUP 17 239 RANGE IFNOT: DROP ZERO }>s dup csr.
66 swap runvmcode drop.


### 7.8 Larger programs and subroutines

which produces

x{2020C210018100F0B9B0DC3070}
execute DUP
execute DUP
execute GTINT 16
execute SWAP
execute PUSHINT 240
execute LESS
execute AND
execute IFRET
66

Notice thatGEQINTandLEQINTare themselves macro definitions defined in
Asm.fif, because they do not correspond directly to TVM instructions. For
instance,xGEQINTcorresponds to the TVM instructionGTINT x− 1.
Incidentally, the above code can be shortened by two bytes by replacing
IFNOT: DROP ZEROwithAND.

### 7.8 Larger programs and subroutines

Larger TVM programs, such as TON Blockchain smart contracts, typically
consist of several mutually recursive subroutines, with one or several of them
selected as top-level subroutines (called main() or recv_internal() for
smart contracts). The execution starts from one of the top-level subrou-
tines, which is free to call any of the other defined subroutines, which in turn
can call whatever other subroutines they need.
Such TVM programs are implemented by means of a selector function,
which accepts an extra integer argument in the TVM stack; this integer
selects the actual subroutine to be invoked (cf. [4, 4.6]). Before execution, the
code of this selector function is loaded both into special registerc3and into
the current continuationcc. The selector of the main function (usually zero)
is pushed into the initial stack, and the TVM execution is started. Afterwards
a subroutine can be invoked by means of a suitable TVM instruction, such as
CALLDICT n, wherenis the (integer) selector of the subroutine to be called.
The Fift assembler offers several words facilitating the implementation of
such large TVM programs. In particular, subroutines can be defined sep-
arately and assigned symbolic names (instead of numeric selectors), which


```
7.8. Larger programs and subroutines
```
can be used to call them afterwards. The Fift assembler automatically cre-
ates a selector function from these separate subroutines and returns it as the
top-level assembly result.
Here is a simple example of such a program consisting of several subrou-
tines. This program computes the complex number(5 +i)^4 ·(239−i):

"Asm.fif" include

#### PROGRAM{

NEWPROC add
NEWPROC sub
NEWPROC mul

sub <{ s3 s3 XCHG2 SUB s2 XCHG0 SUB }>s PROC

// compute (5+i)^4 * (239-i)
main PROC:<{
5 INT 1 INT // 5+i
2DUP
mul CALL
2DUP
mul CALL
239 INT -1 INT
mul JMP
}>

add PROC:<{
s1 s2 XCHG
ADD -ROT ADD SWAP
}>

// a b c d -- ac-bd ad+bc : complex number multiplication
mul PROC:<{
s3 s1 PUSH2 // a b c d a c
MUL // a b c d ac
s3 s1 PUSH2 // a b c d ac b d
MUL // a b c d ac bd


```
7.8. Larger programs and subroutines
```
SUB // a b c d ac-bd
s4 s4 XCHG2 // ac-bd b c a d
MUL // ac-bd b c ad
-ROT MUL ADD
}>

}END>s
dup csr.
runvmdict .s

This program produces:

x{FF00F4A40EF4A0F20B}
x{D9_}
x{2_}
x{1D5C573C00D73C00E0403BDFFC5000E_}
x{04A81668006_}
x{2_}
x{140CE840A86_}
x{14CC6A14CC6A2854112A166A282_}
implicit PUSH 0 at start
execute SETCP 0
execute DICTPUSHCONST 14 (xC_,1)
execute DICTIGETJMP
execute PUSHINT 5
execute PUSHINT 1
execute 2DUP
execute CALLDICT 3
execute SETCP 0
execute DICTPUSHCONST 14 (xC_,1)
execute DICTIGETJMP
execute PUSH2 s3,s1
execute MUL
...
execute ROTREV
execute MUL
execute ADD
execute implicit RET
114244 114244 0


```
7.8. Larger programs and subroutines
```
Some observations and comments based on the previous example follow:

- A TVM program is opened byPROGRAM{and closed by either}END>c
    (which returns the assembled program as a Cell) or }END>s(which
    returns aSlice).
- A new subroutine is declared by means of the phraseNEWPROC 〈name〉.
    This declaration assigns the next positive integer as a selector for the
    newly-declared subroutine, and stores this integer into the constant
    〈name〉. For instance, the above declarations defineadd,sub, andmul
    as integer constants equal to 1, 2, and 3, respectively.
- Some subroutines are predeclared and do not need to be declared again
    byNEWPROC. For instance,mainis a subroutine identifier bound to the
    integer constant (selector) 0.
- Other predefined subroutine selectors such asrecv_internal(equal
    to 0 ) orrecv_external(equal to− 1 ), useful for implementing TON
    Blockchain smart contracts (cf. [5, 4.4]), can be declared by means of
    constant(e.g.,-1 constant recv_external).
- A subroutine can be defined either with the aid of the wordPROC, which
    accepts the integer selector of the subroutine and theSlicecontaining
    the code for this subroutine, or with the aid of the construct〈selector〉
    PROC:<{ ... }>, convenient for defining larger subroutines.
- CALLDICT andJMPDICT instructions may be assembled with the aid
    of the wordsCALLandJMP, which accept the integer selector of the
    subroutine to be called as an immediate argument passed in the Fift
    stack.
- The current implementation of the Fift assembler collects all subrou-
    tines into a dictionary with 14-bit signed integer keys. Therefore, all
    subroutine selectors must be in the range− 213 ... 213 − 1.
- If a subroutine with an unknown selector is called during runtime, an
    exception with code 11 is thrown by the code automatically inserted
    by the Fift assembler. This code also automatically selects codepage
    zero for instruction encoding by means of aSETCP0instruction.


```
7.8. Larger programs and subroutines
```
- The Fift assembler checks that all subroutines declared byNEWPROCare
    actually defined byPROCorPROC:<{before the end of the program. It
    also checks that a subroutine is not redefined.

One should bear in mind that very simple programs (including the sim-
plest smart contracts) may be made more compact by eliminating this general
subroutine selection machinery in favor of custom subroutine selection code
and removing unused subroutines. For instance, the above example can be
transformed into

<{ 11 THROWIF
CONT:<{ s3 s1 PUSH2 MUL s3 s1 PUSH2 MUL SUB
s4 s4 XCHG2 MUL -ROT MUL ADD }>
5 INT 1 INT 2DUP s4 PUSH CALLX
2DUP s4 PUSH CALLX
ROT 239 INT -1 INT ROT JMPX
}>s
dup csr.
runvmdict .s

which produces

x{F24B9D5331A85331A8A15044A859A8A075715C24D85C24D8588100EF7F58D9}
implicit PUSH 0 at start
execute THROWIF 11
execute PUSHCONT x5331A85331A8A15044A859A8A0
execute PUSHINT 5
execute PUSHINT 1
execute 2DUP
execute PUSH s4
execute EXECUTE
execute PUSH2 s3,s1
execute MUL
...
execute XCHG2 s4,s4
execute MUL
execute ROTREV
execute MUL
execute ADD


```
7.8. Larger programs and subroutines
```
execute implicit RET
114244 114244 0


```
References
```
## References

[1] L. Brodie,Starting Forth: Introduction to the FORTH Language and
Operating System for Beginners and Professionals, 2nd edition, Prentice
Hall, 1987. Available athttps://www.forth.com/starting-forth/.

[2] L. Brodie, Thinking Forth: A language and philosophy for solving
problems, Prentice Hall, 1984. Available at [http://thinking-forth.](http://thinking-forth.)
sourceforge.net/.

[3] N. Durov,Telegram Open Network, 2017.

[4] N. Durov,Telegram Open Network Virtual Machine, 2018.

[5] N. Durov,Telegram Open Network Blockchain, 2018.


```
AppendixA.List of Fift words
```
## A List of Fift words

This Appendix provides an alphabetic list of almost all Fift words—including
primitives and definitions from the standard libraryFift.fif, but excluding
Fift assembler words defined inAsm.fif(because the Fift assembler is simply
an application from the perspective of Fift). Some experimental words have
been omitted from this list. Other words may have been added to or removed
from Fift after this text was written. The list of all words available in your
Fift interpreter may be inspected by executingwords.
Each word is described by its name, followed by its stack notation in
parentheses, indicating several values near the top of the Fift stack before
and after the execution of the word; all deeper stack entries are usually
assumed to be left intact. After that, a text description of the word’s effect
is provided. If the word has been discussed in a previous section of this
document, a reference to this section is included.
Active words and active prefix words that parse a portion of the input
stream immediately after their occurrence are listed here in a modified way.
Firstly, these words are listed alongside the portion of the input that they
parse; the segment of each entry that is actually a Fift word is underlined
for emphasis. Secondly, their stack effect is usually described from the user’s
perspective, and reflects the actions performed during the execution phase
of the encompassing blocks and word definitions.
For example, the active prefix wordB{, used for definingBytes literals
(cf.5.6), is listed asB{〈hex-digits〉}, and its stack effect is shown as ( –
B) instead of ( –B 1 e), even though the real effect of the execution of the
active wordB{during the compilation phase of an encompassing block or
word definition is the latter one (cf.4.2).

- !(x p– ), stores new valuexintoBoxp, cf.2.14.
- "〈string〉"( –S), pushes aStringliteral into the stack, cf.2.9and2.10.
- #(x S–x′S′), performs one step of the conversion ofInteger xinto
    its decimal representation by appending toStringSone decimal digit
    representingxmod 10. The quotientx′:=bx/ 10 cis returned as well.
- #> (S – S′), finishes the conversion of an Integer into its human-
    readable representation (decimal or otherwise) started with<#by re-
    versingStringS. Equivalent to$reverse.


```
AppendixA.List of Fift words
```
- #s(x S–x′S′), performs#one or more times until the quotientx′
    becomes non-positive. Equivalent to{ # over 0<= } until.
- $#( –x), pushes the total number of command-line arguments passed
    to the Fift program, cf.2.18. Defined only when the Fift interpreter
    is invoked in script mode (with the-scommand line argument).
- $(〈string〉) ( –... ), looks up the word$〈string〉during execu-
    tion time and executes its current definition. Typically used to access
    the current values of command-line arguments, e.g.,$(2)is essentially
    equivalent to@’ $2.
- $()(x–S), pushes thex-th command-line argument similarly to$n,
    but withInteger x≥ 0 taken from the stack, cf.2.18. Defined only
    when the Fift interpreter is invoked in script mode (with the-scom-
    mand line argument).
- $+(S S′–S.S′), concatenates two strings, cf.2.10.
- $, (b S –b′), appendsString S toBuilder b, cf.5.2. The string is
    interpreted as a binary string of length 8 n, wherenis the number of
    bytes in the UTF-8 representation ofS.
- $n ( – S), pushes the n-th command-line argument as a StringS,
    cf.2.18. For instance,$0pushes the name of the script being executed,
    $1the first command line argument, and so on. Defined only when the
    Fift interpreter is invoked in script mode (with the-scommand line
    argument).
- $=(S S′ –?), returns− 1 if stringsS andS′ are equal, 0 otherwise,
    cf.2.13. Equivalent to$cmp 0=.
- $>s(S–s), transforms theString Sinto aSlice, cf.5.3. Equivalent
    to<b swap $, b> <s.
- $>smca(S–x y z− 1 or 0 ), unpacks a standard TON smart-contract
    address from its human-readable string representationS, cf.6.2. On
    success, returns the signed 32-bit workchain x, the unsigned 256-bit
    in-workchain addressy, the flagsz(where+1means that the address
    is non-bounceable,+2that the address is testnet-only), and− 1. On
    failure, pushes 0.


```
AppendixA.List of Fift words
```
- $@(s x–S), fetches the firstxbytes (i.e., 8 xbits) fromSlices, and
    returns them as a UTF-8String S, cf.5.3. If there are not enough
    data bits ins, throws an exception.
- $@+(s x–S s′), similar to$@, but returns the remainder ofSlice sas
    well, cf.5.3.
- $@? (s x–S− 1 or 0 ), similar to$@, but uses a flag to indicate failure
    instead of throwing an exception, cf.5.3.
- $@?+(s x–S s′− 1 ors 0 ), similar to$@+, but uses a flag to indicate
    failure instead of throwing an exception, cf.5.3.
- $cmp(S S′ –x), returns 0 if stringsS andS′ are equal,− 1 ifS is
    lexicographically less than S′, and 1 ifSis lexicographically greater
    thanS′, cf.2.13.
- $len (S –x), computes the byte length (not the UTF-8 character
    length!) of a string, cf.2.10.
- $pos(S S′–xor− 1 ), returns the position (byte offset)xof the first
    occurence of substringS′in stringSor− 1.
- $reverse(S–S′), reverses the order of UTF-8 characters inStringS.
    IfSis not a valid UTF-8 string, the return value is undefined and may
    be also invalid.
- %1<<(x y–z), computesz:=xmod 2y=x&(2y−1)for twoIntegers
    xand 0 ≤y≤ 256.
- ’ 〈word-name〉( –e), returns the execution token equal to the current
    (compile-time) definition of〈word-name〉, cf.3.1. If the specified word
    is not found, throws an exception.
- ’nop( –e), pushes the default definition ofnop—an execution token
    that does nothing when executed, cf.4.6.
- (’) 〈word-name〉( –e), similar to’, but returns the definition of the
    specified word at execution time, performing a dictionary lookup each
    time it is invoked, cf.4.6. May be used to recover the current values of
    constants inside word definitions and other blocks by using the phrase
    (’) 〈word-name〉 execute.


```
AppendixA.List of Fift words
```
- (-trailing)(S x–S′), removes fromStringSall trailing characters
    with UTF-8 codepointx.
- (.) (x–S), returns theString with the decimal representation of
    Integer x. Equivalent todup abs <# #s rot sign #> nip.
- (atom)(S x–a− 1 or 0 ), returns the onlyAtomawith the name given
    byStringS, cf.2.17. If there is no suchAtomyet, either creates it (if
    Integer xis non-zero) or returns a single zero to indicate failure (ifx
    is zero).
- (b.) (x–S), returns theString with the binary representation of
    Integer x.
- (compile)(l x 1.. .xnn e–l′), extendsWordList lso that it would
    push 0 ≤n≤ 255 valuesx 1 ,... , xn into the stack and execute the
    execution tokene when invoked, where 0 ≤ n ≤ 255 is anInteger,
    cf.4.7. Ifeis equal to the special value’nop, the last step is omitted.
- (create)(e S x– ), creates a new word with the name equal toStringS
    and definition equal toWordDef e, using flags passed inInteger 0 ≤
    x≤ 3 , cf.4.5. If bit+1is set inx, creates an active word; if bit+2is
    set inx, creates a prefix word.
- (def?)(S–?), checks whether the wordSis defined.
- (dump)(x–S), returns aString with a dump of the topmost stack
    valuex, in the same format as employed by.dump.
- (execute)(x 1.. .xnn e–... ), executes execution tokene, but first
    checks that there are at least 0 ≤n≤ 255 values in the stack apart
    fromnandethemselves. It is a counterpart of(compile)that may
    be used to immediately “execute” (perform the intended runtime action
    of) an active word after its immediate execution, as explained in4.2.
- (forget)(S– ), forgets the word with the name specified inStringS,
    cf.4.5. If the word is not found, throws an exception.
- (number)(S – 0 orx 1 orx y 2 ), attempts to parse theString Sas
    an integer or fractional literal, cf.2.10and2.8. On failure, returns a
    single 0. On success, returnsx 1 ifSis a valid integer literal with value
    x, orx y 2 ifSis a valid fractional literal with valuex/y.


```
AppendixA.List of Fift words
```
- (x.) (x–S), returns theStringwith the hexadecimal representation
    ofInteger x.
- ({)( –l), pushes an emptyWordListinto the stack, cf.4.7
- (})(l–e), transforms aWordListinto an execution token (WordDef),
    making all further modifications impossible, cf.4.7.
- *(x y–xy), computes the productxyof twoIntegersxandy, cf.2.4.
- */(x y z–bxy/zc), “multiply-then-divide”: multiplies two integersx
    andyproducing a 513-bit intermediate result, then divides the product
    byz, cf.2.4.
- */c (x y z –dxy/ze), “multiply-then-divide” with ceiling rounding:
    multiplies two integersxandyproducing a 513-bit intermediate result,
    then divides the product byz, cf.2.4.
- */cmod(x y z–q r), similar to*/c, but computes both the quotient
    q:=dxy/zeand the remainderr:=xy−qz, cf.2.4.
- */mod(x y z –q r), similar to*/, but computes both the quotient
    q:=bxy/zcand the remainderr:=xy−qz, cf.2.4.
- */r(x y z–q:=bxy/z+ 1/ 2 c), “multiply-then-divide” with nearest-
    integer rounding: multiplies two integersxandywith 513-bit interme-
    diate result, then divides the product byz, cf.2.4.
- */rmod(x y z–q r), similar to*/r, but computes both the quotient
    q:=bxy/z+ 1/ 2 cand the remainderr:=xy−qz, cf.2.4.
- *>>(x y z–q), similar to*/, but with division replaced with a right
    shift, cf.2.4. Computesq:=bxy/ 2 zcfor 0 ≤z≤ 256. Equivalent to
    1<< */.
- *>>c(x y z–q), similar to*/c, but with division replaced with a right
    shift, cf.2.4. Computesq:=dxy/ 2 zefor 0 ≤z≤ 256. Equivalent to
    1<< */c.
- *>>r(x y z–q), similar to*/r, but with division replaced with a
    right shift, cf.2.4. Computesq := bxy/ 2 z+ 1/ 2 cfor 0 ≤z ≤ 256.
    Equivalent to1<< */r.


```
AppendixA.List of Fift words
```
- *mod(x y z–r), similar to*/mod, but computes only the remainder
    r:=xy−qz, whereq:=bxy/zc. Equivalent to*/mod nip.
- +(x y–x+y), computes the sumx+yof twoIntegersxandy, cf.2.4.
- +! (x p– ), increases the integer value stored inBox pbyInteger x,
    cf.2.14. Equivalent totuck @ + swap !.
- +"〈string〉" (S – S′), concatenates String S with a string literal,
    cf.2.10. Equivalent to"〈string〉" $+.
- ,(t x–t′), appendsxto the end ofTuplet, and returns the resulting
    Tuplet′, cf.2.15.
- -(x y–x−y), computes the differencex−yof twoIntegersxandy,
    cf.2.4.
- -! (x p– ), decreases the integer value stored inBoxpbyIntegerx.
    Equivalent toswap negate swap +!.
- -1( –− 1 ), pushesInteger − 1.
- -1<< (x –− 2 x), computes − 2 x for 0 ≤ x ≤ 256. Approximately
    equivalent to1<< negateor-1 swap <<, but works forx= 256as
    well.
- -roll(xn.. .x 0 n–x 0 xn.. .x 1 ), rotates the topnstack entries in the
    opposite direction, wheren≥ 0 is also passed in the stack, cf.2.5. In
    particular,1 -rollis equivalent toswap, and2 -rollto-rot.
- -rot(x y z –z x y), rotates the three topmost stack entries in the
    opposite direction, cf.2.5. Equivalent torot rot.
- -trailing(S–S′), removes fromStringSall trailing spaces. Equiv-
    alent tobl (-trailing).
- -trailing0(S–S′), removes fromStringSall trailing ‘ 0 ’ characters.
    Equivalent tochar 0 (-trailing).
-. (x– ), prints the decimal representation ofInteger x, followed by a
    single space, cf.2.4. Equivalent to._ space.


```
AppendixA.List of Fift words
```
- ."〈string〉"( – ), prints a constant string into the standard output,
    cf.2.10.
- ._(x– ), prints the decimal representation ofInteger xwithout any
    spaces. Equivalent to(.) type.
- .dump(x– ), dumps the topmost stack entry in the same way as.s
    dumps all stack elements, cf.2.15. Equivalent to(dump) type space.
- .l(l– ), prints a Lisp-style listl, cf.2.16.
- .s ( – ), dumps all stack entries starting from the deepest, leaving
    them intact, cf.2.5. Human-readable representations of stack entries
    are output separated by spaces, followed by an end-of-line character.
- .sl( – ), dumps all stack entries leaving them intact similarly to.s,
    but showing each entry as a List-style listlas.ldoes.
- .tc( – ), outputs the total number of allocated cells into the standard
    error stream.
- /(x y–q:=bx/yc), computes the floor-rounded quotientbx/ycof two
    Integers, cf.2.4.
- /* 〈multiline-comment〉 */( – ), skips a multi-line comment delim-
    ited by word “*/” (followed by a blank or an end-of-line character),
    cf.2.2.
- // 〈comment-to-eol〉( – ), skips a single-line comment until the end
    of the current line, cf.2.2.
- /c(x y–q:=dx/ye), computes the ceiling-rounded quotientdx/yeof
    twoIntegers, cf.2.4.
- /cmod(x y –q r), computes both the ceiling-rounded quotientq :=
    dx/yeand the remainderr:=x−qy, cf.2.4.
- /mod(x y–q r), computes both the floor-rounded quotientq:=bx/yc
    and the remainderr:=x−qy, cf.2.4.
- /r(x y–q), computes the nearest-integer-rounded quotientbx/y+1/ 2 c
    of twoIntegers, cf.2.4.


```
AppendixA.List of Fift words
```
- /rmod(x y–q r), computes both the nearest-integer-rounded quotient
    q:=bx/y+ 1/ 2 cand the remainderr:=x−qy, cf.2.4.
- 0 ( – 0 ), pushesInteger 0.
- 0! (p– ), storesInteger 0 intoBoxp, cf.2.14. Equivalent to0 swap
    !.
- 0<(x–?), checks whetherx < 0 (i.e., pushes− 1 ifxis negative, 0
    otherwise), cf.2.12. Equivalent to0 <.
- 0<=(x–?), checks whetherx≤ 0 (i.e., pushes− 1 ifxis non-positive,
    0 otherwise), cf.2.12. Equivalent to0 <=.
- 0<>(x–?), checks whetherx 6 = 0(i.e., pushes− 1 ifxis non-zero, 0
    otherwise), cf.2.12. Equivalent to0 <>.
- 0=(x–?), checks whetherx= 0(i.e., pushes− 1 ifxis zero, 0 other-
    wise), cf.2.12. Equivalent to0 =.
- 0>(x–?), checks whetherx > 0 (i.e., pushes− 1 ifxis positive, 0
    otherwise), cf.2.12. Equivalent to0 >.
- 0>=(x–?), checks whetherx≥ 0 (i.e., pushes− 1 ifxis non-negative,
    0 otherwise), cf.2.12. Equivalent to0 >=.
- 1 ( – 1 ), pushesInteger 1.
- 1+(x–x+ 1), computesx+ 1. Equivalent to1 +.
- 1+! (p– ), increases the integer value stored inBoxpby one, cf.2.14.
    Equivalent to1 swap +!.
- 1-(x–x− 1 ), computesx− 1. Equivalent to1 -.
- 1-! (p– ), decreases the integer value stored inBoxpby one. Equiv-
    alent to-1 swap +!.
- 1<<(x– 2 x), computes 2 xfor 0 ≤x≤ 255. Equivalent to1 swap <<.
- 1<<1-(x– 2 x− 1 ), computes 2 x− 1 for 0 ≤x≤ 256. Almost equivalent
    to1<< 1-, but works forx= 256.


```
AppendixA.List of Fift words
```
- 2 ( – 2 ), pushesInteger 2.
- 2*(x– 2 x), computes 2 x. Equivalent to2 *.
- 2+(x–x+ 2), computesx+ 2. Equivalent to2 +.
- 2-(x–x− 2 ), computesx− 2. Equivalent to2 -.
- 2/(x–bx/ 2 c), computesbx/ 2 c. Equivalent to2 /or to1 >>.
- 2=: 〈word-name〉(x y– ), an active variant of2constant: defines a
    new ordinary word〈word-name〉that would push the given values x
    andywhen invoked, cf.2.7.
- 2constant(x y – ), scans a blank-delimited word nameS from the
    remainder of the input, and defines a new ordinary wordSas a double
    constant, which will push the given valuesxandy(of arbitrary types)
    when invoked, cf.4.5.
- 2drop(x y– ), removes the two topmost stack entries, cf.2.5. Equiv-
    alent todrop drop.
- 2dup(x y– x y x y), duplicates the topmost pair of stack entries,
    cf.2.5. Equivalent toover over.
- 2over(x y z w–x y z w x y), duplicates the second topmost pair of
    stack entries.
- 2swap(a b c d–c d a b), interchanges the two topmost pairs of stack
    entries, cf.2.5.
- : 〈word-name〉(e– ), defines a new ordinary word〈word-name〉in the
    dictionary usingWordDef eas its definition, cf.4.5. If the specified
    word is already present in the dictionary, it is tacitly redefined.
- :: 〈word-name〉(e– ), defines a new active word〈word-name〉in the
    dictionary usingWordDef eas its definition, cf.4.5. If the specified
    word is already present in the dictionary, it is tacitly redefined.
- ::_ 〈word-name〉(e– ), defines a new active prefix word〈word-name〉
    in the dictionary using WordDef e as its definition, cf.4.5. If the
    specified word is already present in the dictionary, it is tacitly redefined.


```
AppendixA.List of Fift words
```
- :_ 〈word-name〉(e– ), defines a new ordinary prefix word〈word-name〉
    in the dictionary using WordDef e as its definition, cf.4.5. If the
    specified word is already present in the dictionary, it is tacitly redefined.
- <(x y–?), checks whetherx < y(i.e., pushes− 1 ifInteger xis less
    thanInteger y, 0 otherwise), cf.2.12.
- <#( –S), pushes an emptyString. Typically used for starting the con-
    version of anInteger into its human-readable representation, decimal
    or in another base. Equivalent to"".
- <<(x y–x· 2 y), computes an arithmetic left shift of binary numberx
    byy≥ 0 positions, yieldingx· 2 y, cf.2.4.
- <</(x y z–q), computesq:=b 2 zx/ycfor 0 ≤z≤ 256 producing a
    513-bit intermediate result, similarly to*/, cf.2.4. Equivalent to1<<
    swap */.
- <</c(x y z–q), computesq:=d 2 zx/yefor 0 ≤z≤ 256 producing a
    513-bit intermediate result, similarly to*/c, cf.2.4. Equivalent to1<<
    swap */c.
- <</r(x y z–q), computesq:=b 2 zx/y+1/ 2 cfor 0 ≤z≤ 256 producing
    a 513-bit intermediate result, similarly to*/r, cf.2.4. Equivalent to
    1<< swap */r.
- <=(x y–?), checks whetherx≤y(i.e., pushes− 1 ifInteger xis less
    than or equal toInteger y, 0 otherwise), cf.2.12.
- <>(x y–?), checks whetherx 6 =y(i.e., pushes− 1 ifIntegersxandy
    are not equal, 0 otherwise), cf.2.12.
- <b( –b), creates a new emptyBuilder, cf.5.2.
- <s(c–s), transforms aCellcinto aSlicescontaining the same data,
    cf.5.3. It usually marks the start of the deserialization of a cell.
- =(x y–?), checks whetherx=y(i.e., pushes− 1 ifIntegersxandy
    are equal, 0 otherwise), cf.2.12.


```
AppendixA.List of Fift words
```
- =: 〈word-name〉(x– ), an active variant ofconstant: defines a new
    ordinary word〈word-name〉that would push the given valuexwhen
    invoked, cf.2.7.
- >(x y–?), checks whetherx > y(i.e., pushes− 1 ifIntegerxis greater
    thanInteger y, 0 otherwise), cf.2.12.
- >= (x y– ?), checks whetherx≥ y (i.e., pushes− 1 ifInteger xis
    greater than or equal toIntegery, 0 otherwise), cf.2.12.
- >>(x y–q:=bx· 2 −yc), computes an arithmetic right shift of binary
    numberxby 0 ≤y≤ 256 positions, cf.2.4. Equivalent to1<< /.
- >>c(x y–q:=dx· 2 −ye), computes the ceiling-rounded quotientqof
    xby 2 yfor 0 ≤y≤ 256 , cf.2.4. Equivalent to1<< /c.
- >>r(x y–q:=bx· 2 −y+ 1/ 2 c), computes the nearest-integer-rounded
    quotientqofxby 2 yfor 0 ≤y≤ 256 , cf.2.4. Equivalent to1<< /r.
- ?dup(x–x xor 0 ), duplicates anInteger x, but only if it is non-zero,
    cf.2.5. Otherwise leaves it intact.
- @(p–x), fetches the value currently stored inBoxp, cf.2.14.
- @’ 〈word-name〉( –e), recovers the definition of the specified word
    at execution time, performing a dictionary lookup each time it is in-
    voked, and then executes this definition, cf.2.7 and 4.6. May be
    used to recover current values of constants inside word definitions and
    other blocks by using the phrase@’ 〈word-name〉, equivalent to(’)
    〈word-name〉 execute.
- B+(B′B′′–B), concatenates twoBytesvalues, cf.5.6.
- B,(b B–b′), appendsBytesB toBuilder b, cf.5.2. If there is no
    room inbforB, throws an exception.
- B= (B B′ – ?), checks whether two Bytes sequences are equal, and
    returns− 1 or 0 depending on the comparison outcome, cf.5.6.
- B>Li@(B x–y), deserializes the firstx/ 8 bytes of aBytesvalueBas
    a signed little-endianx-bitIntegery, cf.5.6.


```
AppendixA.List of Fift words
```
- B>Li@+(B x–B′y), deserializes the firstx/ 8 bytes ofBas a signed
    little-endianx-bitInteger ysimilarly toB>Li@, but also returns the
    remaining bytes ofB, cf.5.6.
- B>Lu@(B x–y), deserializes the firstx/ 8 bytes of aBytesvalueBas
    an unsigned little-endianx-bitIntegery, cf.5.6.
- B>Lu@+(B x–B′y), deserializes the firstx/ 8 bytes ofBas an unsigned
    little-endianx-bitInteger ysimilarly toB>Lu@, but also returns the
    remaining bytes ofB, cf.5.6.
- B>boc(B–c), deserializes a “standard” bag of cells (i.e., a bag of cells
    with exactly one root cell) represented by Bytes B, and returns the
    rootCell c, cf.5.5.
- B>file(B S – ), creates a new (binary) file with the name specified
    inStringSand writes data fromBytesBinto the new file, cf.5.6. If
    the specified file already exists, it is overwritten.
- B>i@(B x–y), deserializes the firstx/ 8 bytes of aBytesvalueBas
    a signed big-endianx-bitIntegery, cf.5.6.
- B>i@+(B x–B′y), deserializes the firstx/ 8 bytes ofBas a signed big-
    endianx-bitIntegerysimilarly toB>i@, but also returns the remaining
    bytes ofB, cf.5.6.
- B>u@(B x–y), deserializes the firstx/ 8 bytes of aBytesvalueBas
    an unsigned big-endianx-bitIntegery, cf.5.6.
- B>u@+(B x–B′ y), deserializes the firstx/ 8 bytes ofB as an un-
    signed big-endian x-bit Integery similarly toB>u@, but also returns
    the remaining bytes ofB, cf.5.6.
- B@(s x–B), fetches the firstxbytes (i.e., 8 xbits) fromSlices, and
    returns them as aBytesvalueB, cf.5.3. If there are not enough data
    bits ins, throws an exception.
- B@+(s x–B s′), similar toB@, but returns the remainder ofSlicesas
    well, cf.5.3.
- B@? (s x–B− 1 or 0 ), similar toB@, but uses a flag to indicate failure
    instead of throwing an exception, cf.5.3.


```
AppendixA.List of Fift words
```
- B@?+(s x–B s′− 1 ors 0 ), similar toB@+, but uses a flag to indicate
    failure instead of throwing an exception, cf.5.3.
- Bcmp(B B′–x), lexicographically compares twoBytessequences, and
    returns− 1 , 0 , or 1 , depending on the comparison result, cf.5.6.
- Bhash(B–x), deprecated version ofBhashu. UseBhashuorBhashB
    instead.
- BhashB(B–B′), computes thesha256hash of aBytesvalue, cf.5.6.
    The hash is returned as a 32-byteBytesvalue.
- Bhashu(B–x), computes thesha256hash of aBytesvalue, cf.5.6.
    The hash is returned as a big-endian unsigned 256-bitIntegervalue.
- Blen(B–x), returns the length of aBytesvalueBin bytes, cf.5.6.
- Bx. (B – ), prints the hexadecimal representation of aBytes value,
    cf.5.6. Each byte is represented by exactly two uppercase hexadecimal
    digits.
- B{〈hex-digits〉}( –B), pushes aBytesliteral containing data repre-
    sented by an even number of hexadecimal digits, cf.5.6.
- B|(B x–B′ B′′), cuts the firstxbytes from aBytesvalue B, and
    returns both the first xbytes (B′) and the remainder (B′′) as new
    Bytesvalues, cf.5.6.
- Li>B(x y–B), stores a signed little-endiany-bitIntegerxinto aBytes
    valueBconsisting of exactlyy/ 8 bytes. Integerymust be a multiple
    of eight in the range 0 ... 256 , cf.5.6.
- Lu>B(x y –B), stores an unsigned little-endiany-bit Integer xinto
    aBytes valueBconsisting of exactlyy/ 8 bytes. Integerymust be a
    multiple of eight in the range 0 ... 256 , cf.5.6.
- [( – ), opens an internal interpreter session even ifstateis greater
    than zero, i.e., all subsequent words are executed immediately instead
    of being compiled.
- [](t i–x), returns the(i+ 1)-st componentti+1ofTuple t, where
    0 ≤i <|t|, cf.2.15.


```
AppendixA.List of Fift words
```
- [compile] 〈word-name〉( – ), compiles〈word-name〉as if it were an
    ordinary word, even if it is active, cf.4.6. Essentially equivalent to’
    〈word-name〉 execute.
- ](x 1.. .xn n– ), closes an internal interpreter session opened by[
    and invokes(compile)or(execute)afterwards depending on whether
    stateis greater than zero. For instance,{ [ 2 3 + 1 ] * }is equiv-
    alent to{ 5 * }.
- ‘〈word〉( –a), introduces anAtomliteral, equal to the onlyAtomwith
    the name equal to〈word〉, cf.2.17. Equivalent to"〈word〉" atom.
- abort(S– ), throws an exception with an error message taken from
    StringS, cf.3.6.
- abort"〈message〉"(x– ), throws an exception with the error message
    〈message〉if theInteger xis non-zero, cf.3.6.
- abs(x–|x|), computes the absolute value|x|= max(x,−x)ofInte-
    gerx. Equivalent todup negate max.
- allot(n–t), creates a new array, i.e., aTuplethat consists ofnnew
    emptyBoxes, cf.2.15. Equivalent to| { hole , } rot times.
- and(x y–x&y), computes the bitwise AND of twoIntegers, cf.2.4.
- anon( –a), creates a new unique anonymousAtom, cf.2.17.
- atom(S–a), returns the onlyAtomawith the nameS, creating such
    an atom if necessary, cf.2.17. Equivalent totrue (atom) drop.
- atom?(u–?), checks whetheruis anAtom, cf.2.17.
- b+(b b′–b′′), concatenates twoBuildersbandb′, cf.5.2.
- b. (x– ), prints the binary representation of anInteger x, followed by
    a single space. Equivalent tob._ space.
- b._(x– ), prints the binary representation of anIntegerxwithout any
    spaces. Equivalent to(b.) type.
- b>(b–c), transforms aBuilderbinto a newCellccontaining the same
    data asb, cf.5.2.


```
AppendixA.List of Fift words
```
- b>idict! (v x D n–D′− 1 orD 0 ), adds a new valuev(represented
    by aBuilder) with key given by signed big-endiann-bit integerxinto
    dictionaryDwithn-bit keys, and returns the new dictionaryD′ and
    − 1 on success, cf.6.3. Otherwise the unchanged dictionaryDand 0
    are returned.
- b>idict!+(v x D n–D′− 1 orD 0 ), adds a new key-value pair(x,v)
    into dictionaryDsimilarly tob>idict!, but fails if the key already
    exists by returning the unchanged dictionaryDand 0 , cf.6.3.
- b>sdict!(v k D n–D′− 1 orD 0 ), adds a new valuev(represented by
    aBuilder) with key given by the firstnbits ofSlicekinto dictionaryD
    withn-bit keys, and returns the new dictionaryD′and− 1 on success,
    cf.6.3. Otherwise the unchanged dictionaryDand 0 are returned.
- b>sdict!+(v k D n–D′− 1 orD 0 ), adds a new key-value pair(k,v)
    into dictionaryDsimilarly tob>sdict!, but fails if the key already
    exists by returning the unchanged dictionaryDand 0 , cf.6.3.
- b>udict! (v x D n–D′− 1 orD 0 ), adds a new valuev(represented
    by aBuilder) with key given by unsigned big-endiann-bit integerx
    into dictionaryDwithn-bit keys, and returns the new dictionaryD′
    and− 1 on success, cf.6.3. Otherwise the unchanged dictionaryDand
    0 are returned.
- b>udict!+(v x D n–D′− 1 orD 0 ), adds a new key-value pair(x,v)
    into dictionaryDsimilarly tob>udict!, but fails if the key already
    exists by returning the unchanged dictionaryDand 0 , cf.6.3.
- bbitrefs(b–x y), returns both the number of data bitsxand the
    number of referencesyalready stored inBuilderb, cf.5.2.
- bbits(b–x), returns the number of data bits already stored inBuilderb.
    The resultxis anInteger in the range 0 ... 1023 , cf.5.2.
- bl( –x), pushes the Unicode codepoint of a space, i.e., 32, cf.2.10.
- boc+>B(c x–B), creates and serializes a “standard” bag of cells, con-
    taining one rootCell c along with all its descendants, cf. 5.5. An


```
AppendixA.List of Fift words
```
```
Integerparameter 0 ≤x≤ 31 is used to pass flags indicating the addi-
tional options for bag-of-cells serialization, with individual bits having
the following effect:
```
- +1enables bag-of-cells index creation (useful for lazy deserializa-
    tion of large bags of cells).
- +2includes the CRC32-C of all data into the serialization (useful
    for checking data integrity).
- +4explicitly stores the hash of the root cell into the serialization
    (so that it can be quickly recovered afterwards without a complete
    deserialization).
- +8stores hashes of some intermediate (non-leaf) cells (useful for
    lazy deserialization of large bags of cells).
- +16stores cell cache bits to control caching of deserialized cells.

```
Typical values ofxarex= 0orx= 2for very small bags of cells (e.g.,
TON Blockchain external messages) andx= 31for large bags of cells
(e.g., TON Blockchain blocks).
```
- boc>B(c–B), serializes a small “standard” bag of cells with rootCellc
    and all its descendants, cf.5.5. Equivalent to0 boc+>B.
- box(x–p), creates a newBoxcontaining specified valuex, cf.2.14.
    Equivalent tohole tuck !.
- brefs (b – x), returns the number of references already stored in
    Builder b, cf.5.2. The resultxis anIntegerin the range 0 ... 4.
- brembitrefs(b–x y), returns both the maximum number of additional
    data bits 0 ≤x≤ 1023 and the maximum number of additional cell
    references 0 ≤y≤ 4 that can be stored inBuilder b, cf.5.2.
- brembits (b –x), returns the maximum number of additional data
    bits that can be stored inBuilderb, cf.5.2. Equivalent tobbits 1023
    swap -.
- bremrefs(b–x), returns the maximum number of additional cell ref-
    erences that can be stored inBuilder b, cf.5.2.


```
AppendixA.List of Fift words
```
- bye( – ), quits the Fift interpreter to the operating system with a zero
    exit code, cf.2.3. Equivalent to0 halt.
- b{〈binary-data〉}( –s), creates aSlicesthat contains no references
    and up to 1023 data bits specified in〈binary-data〉, which must be a
    string consisting only of the characters ‘ 0 ’ and ‘ 1 ’, cf.5.1.
- caddr(l–h′′), returns the third element of a list. Equivalent tocddr
    car.
- cadr(l–h′), returns the second element of a list, cf.2.16. Equivalent
    tocdr car.
- car(l–h), returns the head of a list, cf.2.16. Equivalent tofirst.
- cddr(l –t′), returns the tail of the tail of a list. Equivalent tocdr
    cdr.
- cdr(l–t), returns the tail of a list, cf.2.16. Equivalent tosecond.
- char 〈string〉( –x), pushes anInteger with the Unicode codepoint
    of the first character of〈string〉, cf.2.10. For instance,char * is
    equivalent to 42.
- chr(x–S), returns a newStringSconsisting of one UTF-8 encoded
    character with Unicode codepointx.
- cmp(x y–z), compares twoIntegersxandy, and pushes 1 ifx > y,
    − 1 ifx < y, and 0 ifx=y, cf.2.12. Approximately equivalent to-
    sgn.
- cond(x e e′– ), ifIntegerxis non-zero, executese, otherwise executes
    e′, cf.3.2.
- cons(h t–l), constructs a list from its head (first element)hand its
    tail (the list consisting of all remaining elements)t, cf.2.16. Equivalent
    topair.
- constant(x– ), scans a blank-delimited word nameS from the re-
    mainder of the input, and defines a new ordinary wordSas a constant,
    which will push the given valuex(of arbitrary type) when invoked,
    cf.4.5and2.7.


```
AppendixA.List of Fift words
```
- count(t–n), returns the lengthn=|t|ofTuplet, cf.2.15.
- cr( – ), outputs a carriage return (or a newline character) into the
    standard output, cf.2.10.
- create(e– ), defines a new ordinary word with the name equal to the
    next word scanned from the input, usingWordDef eas its definition,
    cf.4.5. If the word already exists, it is tacitly redefined.
- csr. (s– ), recursively prints a Slices, cf.5.3. On the first line,
    the data bits ofsare displayed in hexadecimal form embedded into
    anx{...}construct similar to the one used forSlice literals (cf.5.1).
    On the next lines, the cells referred to bysare printed with larger
    indentation.
- def? 〈word-name〉( –?), checks whether the word〈word-name〉 is
    defined at execution time, and returns− 1 or 0 accordingly.
- depth( –n), returns the current depth (the total number of entries)
    of the Fift stack as anInteger n≥ 0.
- dictmap(D n e–D′), applies execution tokene(i.e., an anonymous
    function) to each of the key-value pairs stored in a dictionaryDwith
    n-bit keys, cf.6.3. The execution token is executed once for each key-
    value pair, with aBuilderband aSlicev(containing the value) pushed
    into the stack before executinge. After the executionemust leave in
    the stack either a modifiedBuilder b′(containing all data frombalong
    with the new valuev′) and− 1 , or 0 indicating failure. In the latter
    case, the corresponding key is omitted from the new dictionary.
- dictmerge (D D′ n e – D′′), combines two dictionaries D and D′
    withn-bit keys into one dictionaryD′′with the same keys, cf.6.3.
    If a key is present in only one of the dictionariesDandD′, this key
    and the corresponding value are copied verbatim to the new dictionary
    D′′. Otherwise the execution token (anonymous function)eis invoked
    to merge the two valuesv andv′ corresponding to the same keyk
    inDandD′, respectively. Beforeeis invoked, aBuilder band two
    Slicesvandv′representing the two values to be merged are pushed.
    After the executione leaves either a modifiedBuilder b′ (containing
    the original data frombalong with the combined value) and− 1 , or 0


```
AppendixA.List of Fift words
```
```
on failure. In the latter case, the corresponding key is omitted from
the new dictionary.
```
- dictnew( –D), pushes theNullvalue that represents a new empty
    dictionary, cf.6.3. Equivalent tonull.
- does(x 1.. .xnn e–e′), creates a new execution tokene′that would
    push n values x 1 ,... , xn into the stack and then execute e when
    invoked, cf. 4.7. It is roughly equivalent to a combination of ({),
    (compile), and(}).
- drop(x– ), removes the top-of-stack entry, cf.2.5.
- dup(x–x x), duplicates the top-of-stack entry, cf.2.5. If the stack is
    empty, throws an exception.
- ed25519_chksign(B B′B′′–?), checks whetherB′is a valid Ed25519-
    signature of dataBwith the public keyB′′, cf.6.1.
- ed25519_sign(B B′–B′′), signs dataBwith the Ed25519 private
    keyB′(a 32-byteBytesvalue) and returns the signature as a 64-byte
    BytesvalueB′′, cf.6.1.
- ed25519_sign_uint(x B′–B′′), converts a big-endian unsigned 256-
    bit integerxinto a 32-byte sequence and signs it using the Ed25519
    private keyB′similarly toed25519_sign, cf.6.1. Equivalent toswap
    256 u>B swap ed25519_sign. The integerxto be signed is typically
    computed as the hash of some data.
- emit(x– ), prints a UTF-8 encoded character with Unicode codepoint
    given byInteger xinto the standard output, cf.2.10. For instance, 42
    emitprints an asterisk “*”, and916 emitprints a Greek Delta “∆”.
    Equivalent tochr type.
- empty?(s–?), checks whether aSliceis empty (i.e., has no data bits
    and no references left), and returns− 1 or 0 accordingly, cf.5.3.
- eq? (u v–?), checks whetheruandvare equalIntegers,Atoms, or
    Nulls, cf.2.17. If they are not equal, or if they are of different types,
    or not of one of the types listed, returns zero.


```
AppendixA.List of Fift words
```
- exch(xn.. .x 0 n–x 0.. .xn), interchanges the top of the stack with
    then-th stack entry from the top, wheren≥ 0 is also taken from the
    stack, cf.2.5. In particular,1 exchis equivalent toswap, and2 exch
    toswap rot.
- exch2(.. .n m–... ), interchanges then-th stack entry from the top
    with them-th stack entry from the top, wheren≥ 0 ,m≥ 0 are taken
    from the stack, cf.2.5.
- execute(e–... ), executes the execution token (WordDef)e, cf.3.1.
- explode(t–x 1.. .xnn), unpacks aTuplet= (x 1 ,...,xn)of unknown
    lengthn, and returns that length, cf.2.15.
- false( – 0 ), pushes 0 into the stack, cf.2.11. Equivalent to 0.
- file-exists?(S–?), checks whether the file with the name specified
    inStringSexists, cf.5.6.
- file>B (S –B), reads the (binary) file with the name specified in
    StringS and returns its contents as aBytesvalue, cf.5.6. If the file
    does not exist, an exception is thrown.
- find (S –e − 1 or e 1 or 0 ), looks up String S in the dictionary
    and returns its definition as aWordDef eif found, followed by− 1 for
    ordinary words or 1 for active words, cf.4.6. Otherwise pushes 0.
- first(t–x), returns the first component of aTuple, cf.2.15. Equiv-
    alent to0 [].
- fits(x y–?), checks whetherInteger xis a signedy-bit integer (i.e.,
    whether− 2 y−^1 ≤x < 2 y−^1 for 0 ≤y≤ 1023 ), and returns− 1 or 0
    accordingly.
- forget( – ), forgets (removes from the dictionary) the definition of
    the next word scanned from the input, cf.4.5.
- gasrunvm(.. .s c z–.. .x c′z′), a gas-aware version ofrunvm, cf.6.4:
    invokes a new instance of TVM with both the current continuationcc
    and the special registerc3initialized fromSlices, and initializes special
    registerc4(the “root of persistent data”, cf. [4, 1.4]) withCellc. Then


```
AppendixA.List of Fift words
```
```
starts the new TVM instance with the gas limit set toz. The actually
consumed gasz′is returned at the top of the final Fift stack, and the
final value ofc4is returned immediately below the top of the final Fift
stack as anotherCell c′.
```
- gasrunvmcode(.. .s z–.. .x z′), a gas-aware version ofrunvmcode,
    cf.6.4: invokes a new instance of TVM with the current continuation
    ccinitialized fromSlicesand with the gas limit set toz, thus executing
    codesin TVM. The original Fift stack (without s) is passed in its
    entirety as the initial stack of the new TVM instance. When TVM
    terminates, its resulting stack is used as the new Fift stack, with the
    exit codexand the actually consumed gasz′pushed at its top. Ifxis
    non-zero, indicating that TVM has been terminated by an unhandled
    exception, the next stack entry from the top contains the parameter
    of this exception, andxis the exception code. All other entries are
    removed from the stack in this case.
- gasrunvmctx(.. .s c t z–.. .x c′z′), a gas-aware version ofrunvmctx,
    cf.6.4. Differs fromgasrunmvin that it initializesc7withTuplet.
- gasrunvmdict(.. .s z–.. .x z′), a gas-aware version ofrunvmdict,
    cf. 6.4: invokes a new instance of TVM with the current continua-
    tion ccinitialized fromSlice sand sets the gas limit toz similarly
    togasrunvmcode, but also initializes the special registerc3with the
    same value, and pushes a zero into the initial TVM stack before the
    TVM execution begins. The actually consumed gas is returned as an
    Integer z′. In a typical applicationSlicesconsists of a subroutine se-
    lection code that uses the top-of-stackIntegerto select the subroutine
    to be executed, thus enabling the definition and execution of several
    mutually-recursive subroutines (cf. [4, 4.6] and7.8). The selector equal
    to zero corresponds to themain()subroutine in a large TVM program.
- halt(x– ), quits to the operating system similarly tobye, but uses
    Integer xas the exit code, cf.2.3.
- hash(c –x), a deprecated version of hashu. Use hashu or hashB
    instead.
- hashB (c – B), computes thesha256-based representation hash of
    Cell c(cf. [4, 3.1]), which unambiguously definescand all its descen-


```
AppendixA.List of Fift words
```
```
dants (provided there are no collisions forsha256), cf.5.4. The result
is returned as aBytesvalue consisting of exactly 32 bytes.
```
- hashu(c–x), computes thesha256-based representation hash ofCellc
    similarly tohashB, but returns the result as a big-endian unsigned 256-
    bitInteger.
- hold(S x–S′), appends toString Sone UTF-8 encoded character
    with Unicode codepointx. Equivalent tochr $+.
- hole( –p), creates a newBoxpthat does not hold any value, cf.2.14.
    Equivalent tonull box.
- i,(b x y–b′), appends the big-endian binary representation of a signed
    y-bit integerxtoBuilder b, where 0 ≤y≤ 257 , cf.5.2. If there is not
    enough room inb(i.e., ifbalready contains more than 1023 −ydata
    bits), or ifIntegerxdoes not fit intoybits, an exception is thrown.
- i>B(x y–B), stores a signed big-endiany-bitInteger xinto aBytes
    valueBconsisting of exactlyy/ 8 bytes. Integerymust be a multiple
    of eight in the range 0 ... 256 , cf.5.6.
- i@(s x–y), fetches a signed big-endianx-bit integer from the firstx
    bits ofSlices, cf.5.3. Ifscontains less thanxdata bits, an exception
    is thrown.
- i@+(s x–y s′), fetches a signed big-endianx-bit integer from the first
    xbits ofSlicessimilarly toi@, but returns the remainder ofsas well,
    cf.5.3.
- i@? (s x–y− 1 or 0 ), fetches a signed big-endian integer from aSlice
    similarly toi@, but pushes integer− 1 afterwards on success, cf.5.3. If
    there are less thanxbits left ins, pushes integer 0 to indicate failure.
- i@?+(s x–y s′− 1 ors 0 ), fetches a signed big-endian integer from
    Slicesand computes the remainder of thisSlice similarly toi@+, but
    pushes− 1 afterwards to indicate success, cf.5.3. On failure, pushes
    the unchangedSlice sand 0 to indicate failure.
- idict! (v x D n–D′− 1 orD 0 ), adds a new valuev(represented
    by a Slice) with key given by signed big-endiann-bit integerxinto


```
AppendixA.List of Fift words
```
```
dictionaryDwithn-bit keys, and returns the new dictionaryD′ and
− 1 on success, cf.6.3. Otherwise the unchanged dictionaryDand 0
are returned.
```
- idict!+(v x D n–D′− 1 orD 0 ), adds a new key-value pair(x,v)
    into dictionaryDsimilarly toidict!, but fails if the key already exists
    by returning the unchanged dictionaryDand 0 , cf.6.3.
- idict-(x D n–D′− 1 orD 0 ), deletes the key represented by signed
    big-endiann-bitIntegerxfrom the dictionary represented byCellD,
    cf.6.3. If the key is found, deletes it from the dictionary and returns
    the modified dictionaryD′and− 1. Otherwise returns the unmodified
    dictionaryDand 0.
- idict@(x D n–v− 1 or 0 ), looks up key represented by signed big-
    endiann-bitIntegerxin the dictionary represented byCellorNullD,
    cf.6.3. If the key is found, returns the corresponding value as aSlicev
    and− 1. Otherwise returns 0.
- idict@- (x D n– D′ v − 1 or D 0 ), looks up the key represented
    by signed big-endiann-bitInteger xin the dictionary represented by
    Cell D, cf. 6.3. If the key is found, deletes it from the dictionary
    and returns the modified dictionaryD′, the corresponding value as a
    Slice v, and− 1. Otherwise returns the unmodified dictionaryDand
    0.
- if(x e– ), executes execution token (i.e., aWordDef)e, but only if
    Integer xis non-zero, cf.3.2.
- ifnot(x e– ), executes execution tokene, but only ifIntegerxis zero,
    cf.3.2.
- include(S – ), loads and interprets a Fift source file from the path
    given byString S, cf.7.1. If the filename Sdoes not begin with a
    slash, the Fift include search path, typically taken from theFIFTPATH
    environment variable or the -I command-line argument of the Fift
    interpreter (and equal to/usr/lib/fiftif both are absent), is used
    to locateS.


```
AppendixA.List of Fift words
```
- list(x 1.. .xn n –l), constructs a listl of lengthnwith elements
    x 1 ,... ,xn, in that order, cf.2.16. Equivalent tonull ’ cons rot
    times.
- max(x y–z), computes the maximumz:= max(x,y)of twoIntegers
    xandy. Equivalent tominmax nip.
- min(x y–z), computes the minimumz:= min(x,y)of twoIntegersx
    andy. Equivalent tominmax drop.
- minmax(x y–z t), computes both the minimumz:= min(x,y)and
    the maximumt:= max(x,y)of twoIntegersxandy.
- mod(x y–r:=xmody), computes the remainderxmody=x−y·
    bx/ycof division ofxbyy, cf.2.4.
- negate(x–−x), changes the sign of anInteger, cf.2.4.
- newkeypair( –B B′), generates a new Ed25519 private/public key
    pair, and returns both the private key B and the public keyB′ as
    32-byteBytesvalues, cf.6.1. The quality of the keys is good enough
    for testing purposes. Real applications must feed enough entropy into
    OpenSSL PRNG before generating Ed25519 keypairs.
- nil( –t), pushes the emptyTuplet= (). Equivalent to0 tuple.
- nip(x y–y), removes the second stack entry from the top, cf.2.5.
    Equivalent toswap drop.
- nop( – ), does nothing, cf.4.6.
- not (x–− 1 −x), computes the bitwise complement of an Integer,
    cf.2.4.
- now( –x), returns the current Unixtime as anInteger, cf.6.1.
- null( –⊥), pushes theNullvalue, cf.2.16
- null!(p– ), stores aNullvalue intoBoxp. Equivalent tonull swap
    !.
- null?(x–?), checks whetherxisNull, cf.2.16.


```
AppendixA.List of Fift words
```
- or(x y–x|y), computes the bitwise OR of twoIntegers, cf.2.4.
- over(x y–x y x), creates a copy of the second stack entry from the
    top over the top-of-stack entry, cf.2.5.
- pair(x y–t), creates new pairt= (x,y), cf.2.15. Equivalent to 2
    tupleor to| rot , swap ,.
- pfxdict! (v k s n–s′− 1 or s 0 ), adds key-value pair(k,v), both
    represented bySlices, into a prefix dictionaryswith keys of length at
    mostn, cf.6.3. On success, returns the modified dictionarys′and− 1.
    On failure, returns the original dictionarysand 0.
- pfxdict!+ (v k s n–s′ − 1 ors 0 ), adds key-value pair(k,v)into
    prefix dictionaryssimilarly topfxdict!, but fails if the key already
    exists, cf.6.3.
- pfxdict@(k s n–v− 1 or 0 ), looks up keyk(represented by aSlice) in
    the prefix dictionaryswith the length of keys limited bynbits, cf.6.3.
    On success, returns the value found as aSlicevand− 1. On failure,
    returns 0.
- pick(xn.. .x 0 n–xn.. .x 0 xn), creates a copy of then-th entry from
    the top of the stack, wheren≥ 0 is also passed in the stack, cf.2.5.
    In particular,0 pickis equivalent todup, and1 picktoover.
- priv>pub(B–B′), computes the public key corresponding to a private
    Ed25519 key, cf.6.1. Both the public keyB′and the private keyB
    are represented by 32-byteBytesvalues.
- quit(...– ), exits to the topmost level of the Fift interpreter (without
    printing anokin interactive mode) and clears the stack, cf.2.3.
- ref,(b c–b′), appends toBuilderba reference toCellc, cf.5.2. Ifb
    already contains four references, an exception is thrown.
- ref@(s–c), fetches the first reference from theSlice sand returns
    theCellcreferred to, cf.5.3. If there are no references left, throws an
    exception.
- ref@+(s–s′c), fetches the first reference from theSlicessimilarly to
    ref@, but returns the remainder ofsas well, cf.5.3.


```
AppendixA.List of Fift words
```
- ref@? (s–c − 1 or 0 ), fetches the first reference from the Slice s
    similarly toref@, but uses a flag to indicate failure instead of throwing
    an exception, cf.5.3.
- ref@?+(s–s′c− 1 ors 0 ), similar toref@+, but uses a flag to indicate
    failure instead of throwing an exception, cf.5.3.
- remaining(s–x y), returns both the number of data bitsxand the
    number of cell referencesyremaining in theSlices, cf.5.3.
- reverse(x 1.. .xny 1.. .ymn m–xn.. .x 1 y 1.. .ym), reverses the order
    ofnstack entries located immediately below the topmostmelements,
    where both 0 ≤m,n≤ 255 are passed in the stack.
- roll(xn.. .x 0 n–xn− 1.. .x 0 xn), rotates the top nstack entries,
    wheren≥ 0 is also passed in the stack, cf.2.5. In particular,1 roll
    is equivalent toswap, and2 rolltorot.
- rot(x y z–y z x), rotates the three topmost stack entries.
- runvm(.. .s c–.. .x c′), invokes a new instance of TVM with both
    the current continuationccand the special registerc3initialized from
    Slices, and initializes special registerc4(the “root of persistent data”,
    cf. [4, 1.4]) withCell c, cf.6.4. In contrast withrunvmdict, does not
    push an implicit zero into the initial TVM stack; if necessary, it can be
    explicitly passed unders. The final value ofc4is returned at the top
    of the final Fift stack as anotherCell c′. In this way one can emulate
    the execution of smart contracts that inspect or modify their persistent
    storage.
- runvmcode (.. .s–.. .x), invokes a new instance of TVM with the
    current continuationccinitialized fromSlices, thus executing codes
    in TVM, cf.6.4. The original Fift stack (withouts) is passed in its
    entirety as the initial stack of the new TVM instance. When TVM
    terminates, its resulting stack is used as the new Fift stack, with the
    exit codexpushed at its top. Ifxis non-zero, indicating that TVM
    has been terminated by an unhandled exception, the next stack entry
    from the top contains the parameter of this exception, andxis the
    exception code. All other entries are removed from the stack in this
    case.


```
AppendixA.List of Fift words
```
- runvmctx(.. .s c t–.. .x c′), a variant ofrunvmthat also initializesc7
    (the “context register” of TVM) withTuplet, cf.6.4.
- runvmdict (.. .s–.. .x), invokes a new instance of TVM with the
    current continuationccinitialized fromSlicessimilarly torunvmcode,
    but also initializes the special registerc3 with the same value, and
    pushes a zero into the initial TVM stack before start, cf.6.4. In a
    typical applicationSlicesconsists of a subroutine selection code that
    uses the top-of-stackInteger to select the subroutine to be executed,
    thus enabling the definition and execution of several mutually-recursive
    subroutines (cf. [4, 4.6] and7.8). The selector equal to zero corresponds
    to themain()subroutine in a large TVM program.
- s,(b s–b′), appends data bits and references taken from Slicesto
    Builderb, cf.5.2.
- s>(s– ), throws an exception ifSlicesis non-empty, cf.5.3. It usually
    marks the end of the deserialization of a cell, checking whether there
    are any unprocessed data bits or references left.
- s>c(s–c), creates aCellcdirectly from aSlices, cf.5.3. Equivalent
    to<b swap s, b>.
- sbitrefs(s–x y), returns both the number of data bitsxand the
    number of cell referencesyremaining inSlices, cf.5.3. Equivalent to
    remaining.
- sbits(s–x), returns the number of data bitsxremaining inSlices,
    cf.5.3.
- sdict!(v k D n–D′− 1 orD 0 ), adds a new valuev(represented by
    aSlice) with key given by the firstnbits ofSlicekinto dictionaryD
    withn-bit keys, and returns the new dictionaryD′and− 1 on success,
    cf.6.3. Otherwise the unchanged dictionaryDand 0 are returned.
- sdict!+(v k D n–D′ − 1 orD 0 ), adds a new key-value pair(k,v)
    into dictionaryDsimilarly tosdict!, but fails if the key already exists
    by returning the unchanged dictionaryDand 0 , cf.6.3.
- sdict-(x D n–D′− 1 orD 0 ), deletes the key given by the firstndata
    bits ofSlicexfrom the dictionary represented byCellD, cf.6.3. If the


```
AppendixA.List of Fift words
```
```
key is found, deletes it from the dictionary and returns the modified
dictionaryD′and− 1. Otherwise returns the unmodified dictionaryD
and 0.
```
- sdict@(k D n–v− 1 or 0 ), looks up the key given by the firstndata
    bits ofSlicexin the dictionary represented byCellorNullD, cf.6.3.
    If the key is found, returns the corresponding value as aSlice vand
    − 1. Otherwise returns 0.
- sdict@-(x D n–D′v − 1 orD 0 ), looks up the key given by the
    firstn data bits ofSlice xin the dictionary represented byCell D,
    cf.6.3. If the key is found, deletes it from the dictionary and returns
    the modified dictionaryD′, the corresponding value as aSlice v, and
    − 1. Otherwise returns the unmodified dictionaryDand 0.
- second(t –x), returns the second component of a Tuple, cf.2.15.
    Equivalent to1 [].
- sgn(x–y), computes the sign of anInteger x(i.e., pushes 1 ifx > 0 ,
    − 1 ifx < 0 , and 0 ifx= 0), cf.2.12. Equivalent to0 cmp.
- shash(s–B), computes thesha256-based representation hash of a
    Slice by first transforming it into a cell, cf.5.4. Equivalent tos>c
    hashB.
- sign(S x–S′), appends a minus sign “-” toStringSifInteger xis
    negative. Otherwise leavesSintact.
- single(x–t), creates new singletont= (x), i.e., a one-elementTuple.
    Equivalent to1 tuple.
- skipspc( – ), skips blank characters from the current input line until
    a non-blank or an end-of-line character is found.
- smca>$(x y z –S), packs a standard TON smart-contract address
    with workchainx(a signed 32-bitInteger) and in-workchain addressy
    (an unsigned 256-bitInteger) into a 48-character stringS(the human-
    readable representation of the address) according to flagsz, cf.6.2.
    Possible individual flags in z are: +1for non-bounceable addresses,
    +2for testnet-only addresses, and+4for base64url output instead of
    base64.


```
AppendixA.List of Fift words
```
- space( – ), outputs a single space. Equivalent tobl emitor to." ".
- sr,(b s–b′), constructs a newCellcontaining all data and references
    fromSlices, and appends a reference to this cell toBuilderb, cf.5.2.
    Equivalent tos>c ref,.
- srefs(s– x), returns the number of cell references xremaining in
    Slices, cf.5.3.
- swap(x y–y x), interchanges the two topmost stack entries, cf.2.5.
- ten( – 10 ), pushesInteger constant 10.
- third(t–x), returns the third component of aTuple, cf.2.15. Equiv-
    alent to2 [].
- times(e n– ), executes execution token (WordDef)eexactlyntimes,
    ifn≥ 0 , cf.3.3. Ifnis negative, throws an exception.
- triple(x y z–t), creates new triplet= (x,y,z), cf.2.15. Equivalent
    to3 tuple.
- true( –− 1 ), pushes− 1 into the stack, cf.2.11. Equivalent to-1.
- tuck(x y–y x y), equivalent toswap over, cf.2.5.
- tuple(x 1.. .xnn–t), creates newTuplet:= (x 1 ,...,xn)fromn≥
    0 topmost stack values, cf.2.15. Equivalent todup 1 reverse | {
    swap , } rot times, but more efficient.
- tuple? (t – ?), checks whether tis a Tuple, and returns − 1 or 0
    accordingly.
- type(s– ), prints aString staken from the top of the stack into the
    standard output, cf.2.10.
- u, (b x y– b′), appends the big-endian binary representation of an
    unsignedy-bit integerxtoBuilder b, where 0 ≤y≤ 256 , cf.5.2. If
    the operation is impossible, an exception is thrown.
- u>B (x y –B), stores an unsigned big-endiany-bitInteger xinto a
    Bytes value Bconsisting of exactly y/ 8 bytes. Integerymust be a
    multiple of eight in the range 0 ... 256 , cf.5.6.


```
AppendixA.List of Fift words
```
- u@(s x–y), fetches an unsigned big-endianx-bit integer from the first
    xbits ofSlices, cf.5.3. Ifscontains less thanxdata bits, an exception
    is thrown.
- u@+(s x–y s′), fetches an unsigned big-endianx-bit integer from the
    firstxbits ofSlicessimilarly tou@, but returns the remainder ofsas
    well, cf.5.3.
- u@? (s x–y− 1 or 0 ), fetches an unsigned big-endian integer from
    aSlice similarly tou@, but pushes integer− 1 afterwards on success,
    cf.5.3. If there are less thanxbits left ins, pushes integer 0 to indicate
    failure.
- u@?+(s x–y s′− 1 ors 0 ), fetches an unsigned big-endian integer from
    Slicesand computes the remainder of thisSlice similarly tou@+, but
    pushes− 1 afterwards to indicate success, cf.5.3. On failure, pushes
    the unchangedSlice sand 0 to indicate failure.
- udict! (v x D n–D′− 1 orD 0 ), adds a new valuev(represented
    by aSlice) with key given by big-endian unsignedn-bit integerxinto
    dictionaryDwithn-bit keys, and returns the new dictionaryD′ and
    − 1 on success, cf.6.3. Otherwise the unchanged dictionaryDand 0
    are returned.
- udict!+(v x D n–D′− 1 orD 0 ), adds a new key-value pair(x,v)
    into dictionaryDsimilarly toudict!, but fails if the key already exists
    by returning the unchanged dictionaryDand 0 , cf.6.3.
- udict-(x D n–D′− 1 orD 0 ), deletes the key represented by unsigned
    big-endiann-bitIntegerxfrom the dictionary represented byCellD,
    cf.6.3. If the key is found, deletes it from the dictionary and returns
    the modified dictionaryD′and− 1. Otherwise returns the unmodified
    dictionaryDand 0.
- udict@(x D n–v− 1 or 0 ), looks up key represented by unsigned big-
    endiann-bitIntegerxin the dictionary represented byCellorNullD,
    cf.6.3. If the key is found, returns the corresponding value as aSlicev
    and− 1. Otherwise returns 0.
- udict@-(x D n–D′ v− 1 orD 0 ), looks up the key represented by
    unsigned big-endiann-bitInteger xin the dictionary represented by


```
AppendixA.List of Fift words
```
```
Cell D, cf. 6.3. If the key is found, deletes it from the dictionary
and returns the modified dictionaryD′, the corresponding value as a
Slice v, and− 1. Otherwise returns the unmodified dictionaryDand
0.
```
- ufits(x y–?), checks whetherInteger xis an unsignedy-bit integer
    (i.e., whether 0 ≤ x < 2 y for 0 ≤ y≤ 1023 ), and returns− 1 or 0
    accordingly.
- uncons(l–h t), decomposes a non-empty list into its head and its tail,
    cf.2.16. Equivalent tounpair.
- undef? 〈word-name〉( –?), checks whether the word〈word-name〉is
    undefined at execution time, and returns− 1 or 0 accordingly.
- unpair(t–x y), unpacks a pairt= (x,y), cf.2.15. Equivalent to 2
    untuple.
- unsingle (t – x), unpacks a singleton t = (x). Equivalent to 1
    untuple.
- until(e– ), an until loop, cf.3.4: executesWordDef e, then removes
    the top-of-stack integer and checks whether it is zero. If it is, then
    begins a new iteration of the loop by executinge. Otherwise exits the
    loop.
- untriple(t–x y z), unpacks a triplet= (x,y,z), cf.2.15. Equivalent
    to3 untuple.
- untuple (t n – x 1.. .xn), returns all components of a Tuple t =
    (x 1 ,...,xn), but only if its length is equal ton, cf.2.15. Otherwise
    throws an exception.
- variable( – ), scans a blank-delimited word nameSfrom the remain-
    der of the input, allocates an emptyBox, and defines a new ordinary
    word S as a constant, which will push the newBox when invoked,
    cf.2.14. Equivalent tohole constant.
- while(e e′ – ), a while loop, cf.3.4: executesWordDef e, then re-
    moves and checks the top-of-stack integer. If it is zero, exits the loop.
    Otherwise executesWordDef e′, then begins a new loop iteration by
    executingeand checking the exit condition afterwards.


```
AppendixA.List of Fift words
```
- word(x–s), parses a word delimited by the character with the Unicode
    codepointxfrom the remainder of the current input line and pushes the
    result as aString, cf.2.10. For instance,bl word abracadabra type
    will print the string “abracadabra”. Ifx= 0, skips leading spaces,
    and then scans until the end of the current input line. Ifx= 32, skips
    leading spaces before parsing the next word.
- words( – ), prints the names of all words currently defined in the
    dictionary, cf.4.6.
- x.(x– ), prints the hexadecimal representation (without the0xprefix)
    of anIntegerx, followed by a single space. Equivalent tox._ space.
- x._(x– ), prints the hexadecimal representation (without the0xpre-
    fix) of anIntegerxwithout any spaces. Equivalent to(x.) type.
- xor(x y–x⊕y), computes the bitwise eXclusive OR of twoIntegers,
    cf.2.4.
- x{〈hex-data〉}( –s), creates aSlicesthat contains no references and
    up to 1023 data bits specified in〈hex-data〉, cf.5.1. More precisely,
    each hex digit from〈hex-data〉is transformed into four binary digits
    in the usual fashion. After that, if the last character of〈hex-data〉
    is an underscore_, then all trailing binary zeroes and the binary one
    immediately preceding them are removed from the resulting binary
    string (cf. [4, 1.0] for more details). For instance,x{6C_}is equivalent
    tob{01101}.
- {( –l), an active word that increases internal variablestateby one
    and pushes a new emptyWordListinto the stack, cf.4.7.
- |( –t), creates an emptyTuple t= (), cf.2.15. Equivalent tonil
    and to0 tuple.
- |+(s s′ –s′′), concatenates twoSlicessands′, cf.5.1. This means
    that the data bits of the newSlice s′′are obtained by concatenating
    the data bits ofsands′, and the list ofCell references ofs′′is con-
    structed similarly by concatenating the corresponding lists forsands′.
    Equivalent to<b rot s, swap s, b> <s.


```
AppendixA.List of Fift words
```
- |_(s s′–s′′), given twoSlicessands′, creates a newSlice s′′, which
    is obtained fromsby appending a new reference to aCellcontaining
    s′, cf.5.1. Equivalent to<b rot s, swap s>c ref, b> <s.
- }(l–e), an active word that transforms aWordListlinto aWordDef
    (an execution token)e, thus making all further modifications oflim-
    possible, and decreases internal variablestateby one; then pushes the
    integer 1 , followed by a’nop, cf.4.7. The net effect is to transform the
    constructedWordListinto an execution token and push this execution
    token into the stack, either immediately or during the execution of an
    outer block.


