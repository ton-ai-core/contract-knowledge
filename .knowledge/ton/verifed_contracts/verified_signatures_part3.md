(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data();
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y);
int max(int x, int y);
(int, int) minmax(int x, int y);
int abs(int x);

slice begin_parse(cell c);
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s);
cell preload_ref(slice s);
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s);
slice skip_bits(slice s, int len);
slice first_bits(slice s, int len);
slice skip_last_bits(slice s, int len);
slice slice_last(slice s, int len);
(slice, cell) load_dict(slice s);
cell preload_dict(slice s);
slice skip_dict(slice s);

(slice, cell) load_maybe_ref(slice s);
cell preload_maybe_ref(slice s);
builder store_maybe_ref(builder b, cell c);

int cell_depth(cell c);

int slice_refs(slice s);
int slice_bits(slice s);
(int, int) slice_bits_refs(slice s);
int slice_depth(slice s);

int builder_refs(builder b);
int builder_bits(builder b);
int builder_depth(builder b);

builder begin_cell();
cell end_cell(builder b);
builder store_ref(builder b, cell c);
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s);
builder store_grams(builder b, int x);
builder store_dict(builder b, cell c);

(slice, slice) load_msg_addr(slice s);
tuple parse_addr(slice s);
(int, int) parse_std_addr(slice s);
(int, slice) parse_var_addr(slice s);

cell idict_set_ref(cell dict, int key_len, int index, cell value);
cell udict_set_ref(cell dict, int key_len, int index, cell value);
cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);
cell new_dict();

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x);

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x);
(slice, int) load_coins(slice s);

int equal_slices (slice a, slice b);
builder store_builder(builder to, builder from);
```

## 6b95a6418b9c9d2359045d1e7559b8d549ae0e506f24caab58fa30c8fb1feb86/imports/stdlib.fc

```fc
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail);

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list);

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list);

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list);

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list);

;;; Creates tuple with zero elements.
tuple empty_tuple();

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value);

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x);

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t);

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y);

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t);

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t);

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t);

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t);

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t);

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p);

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p);

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p);

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p);

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p);

;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null();

;;; Moves a variable [x] to the top of the stack

;;; Returns the current Unix time as an Integer
int now();

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address();

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance();

;;; Returns the logical time of the current transaction.
int cur_lt();

;;; Returns the starting logical time of the current block.
int block_lt();

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c);

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s);

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s);

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key);

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key);

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data();

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y);

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y);

;;; Sorts two integers.
(int, int) minmax(int x, int y);

;;; Computes the absolute value of an integer [x].
int abs(int x);

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}

;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c);

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s);

;;; Preloads the first reference from the slice.
cell preload_ref(slice s);

{- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s);
(slice, int) load_coins(slice s);

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len);

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len);

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len);

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len);

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s);

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s);

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s);

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s);

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s);

;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c);

{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s);

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s);

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s);

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).

;;; Checks whether `slice` [s] has no bits of data.

;;; Checks whether `slice` [s] has no references.

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s);

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b);

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b);

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b);

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell();

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b);

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c);

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";

;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s);

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x);
builder store_coins(builder b, int x);

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c);

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c);

{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
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
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s);

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s);

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s);

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s);

{-
  # Dictionary primitives
-}

;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value);

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value);

cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict();
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.

{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x);
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
;;; Returns the current random seed as an unsigned 256-bit Integer.
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b);
int equal_slices(slice a, slice b);

;;; Concatenates two builders
builder store_builder(builder to, builder from);
```

## 6b95a6418b9c9d2359045d1e7559b8d549ae0e506f24caab58fa30c8fb1feb86/nft-fixprice-sale-v4r1.fc

```fc
;; NFT sale smart contract v4
;; base on nft-fixprice-sale-v3r3.fc
;; + feature sale for jetton
;; https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v4r1.fc

#include "imports/stdlib.fc";
#include "op-codes.fc";

int min_gas_amount();
int min_gas_amount_jetton();

_ load_data() inline;
        ;; max size = 1 + 267 + 267 + 132 + 32 + 64 + 1 = 764

_ load_static_data(cell static_data_cell) inline;

() save_data(int is_complete,
    set_data(
        begin_cell()
    );

() send_jettons(slice jetton_wallet, int query_id, slice address, int amount, slice response_address, int fwd_amount) impure inline;

() transfer_nft(slice nft_address, int query_id, slice new_owner_address) impure inline_ref;

() send_money(slice address, int amount) impure inline;

_ buy_logic(int price, int input_money, cell static_data_cell);

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

        ;; way to fix unexpected troubles with sale contract
        ;; for example if some one transfer nft to this contract

        ;; check workchain

        ;; load amount

        ;; check jetton address

        ;; return jettons back if complete or if not allowed jetton or not initialized

        ;; return back if wrong amount

    ;; Throw if sale is complete

_ get_fix_price_data_v4() method_id;
```

## 6b95a6418b9c9d2359045d1e7559b8d549ae0e506f24caab58fa30c8fb1feb86/op-codes.fc

```fc
;; NFTEditable

;; SBT
```

## 6cf7ba3c5e09312c5465ad6e42cce4a5a1df77881947462abfea88aac15cb28b/contracts/imports/error-codes.fc

```fc
const int error::unknown_op;
const int error::wrong_workchain;

const int error::malformed_forward_payload;
const int error::not_enough_tons;

const int error::unknown_action;
const int error::unknown_action_bounced;
```

## 6cf7ba3c5e09312c5465ad6e42cce4a5a1df77881947462abfea88aac15cb28b/contracts/imports/messages.fc

```fc
;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
const int msg_flag::non_bounceable;
const int msg_flag::bounceable;

;; send_raw_message modes
const REVERT_ON_ERRORS;
const PAY_FEES_SEPARATELY;
const IGNORE_ERRORS;
const SELFDESTRUCT_ON_EMPTY;
const CARRY_REMAINING_GAS;
const CARRY_REMAINING_BALANCE;

builder store_msg_flag(builder b, int msg_flag) inline;

{-
  Helpers below fill in default/overwritten values of message layout:
  Relevant part of TL-B schema:
  ... other:ExtraCurrencyCollection ihr_fee:Grams fwd_fee:Grams created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  bits      1                               4             4                64                32
  ... init:(Maybe (Either StateInit ^StateInit))  body:(Either X ^X) = Message X;
  bits      1      1(if prev is true)                   1

-}

builder store_msgbody_prefix_stateinit(builder b, cell state_init, cell ref) inline;
builder store_msgbody_prefix_slice(builder b) inline;
builder store_msgbody_prefix_ref(builder b, cell ref) inline;

(slice, ()) skip_bounce_flag(slice s) impure inline {

builder store_op(builder b, int op) inline;
builder store_query_id(builder b, int query_id) inline;
```

## 6cf7ba3c5e09312c5465ad6e42cce4a5a1df77881947462abfea88aac15cb28b/contracts/imports/op-codes.fc

```fc
const int op::excesses;
```

## 6cf7ba3c5e09312c5465ad6e42cce4a5a1df77881947462abfea88aac15cb28b/contracts/imports/params.fc

```fc
#include "error-codes.fc";

const int workchain;

() force_chain(slice addr) impure;
```

## 6cf7ba3c5e09312c5465ad6e42cce4a5a1df77881947462abfea88aac15cb28b/contracts/imports/stdlib.fc

```fc
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail);

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list);

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list);

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list);

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list);

;;; Creates tuple with zero elements.
tuple empty_tuple();

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value);

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x);

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t);

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y);

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t);

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t);

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t);

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t);

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t);

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p);

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p);

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p);

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p);

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p);

;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null();

;;; Moves a variable [x] to the top of the stack

;;; Returns the current Unix time as an Integer
int now();

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address();

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance();

;;; Returns the logical time of the current transaction.
int cur_lt();

;;; Returns the starting logical time of the current block.
int block_lt();

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c);

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s);

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s);

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key);

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key);

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data();

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y);

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y);

;;; Sorts two integers.
(int, int) minmax(int x, int y);

;;; Computes the absolute value of an integer [x].
int abs(int x);

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}

;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c);

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s);

;;; Preloads the first reference from the slice.
cell preload_ref(slice s);

  {- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s);
(slice, int) load_coins(slice s);

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len);

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len);

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len);

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len);

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s);

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s);

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s);

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s);

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s);

;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c);

{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s);

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s);

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s);

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).

;;; Checks whether `slice` [s] has no bits of data.

;;; Checks whether `slice` [s] has no references.

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s);

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b);

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b);

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b);

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell();

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b);

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c);

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";

;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s);

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x);
builder store_coins(builder b, int x);

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c);

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c);

{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
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
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s);

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s);

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s);

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s);

{-
  # Dictionary primitives
-}

;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value);

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value);

cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict();
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.

{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x);
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
;;; Returns the current random seed as an unsigned 256-bit Integer.
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b);
int equal_slices(slice a, slice b);

;;; Concatenates two builders
builder store_builder(builder to, builder from);
```

## 6cf7ba3c5e09312c5465ad6e42cce4a5a1df77881947462abfea88aac15cb28b/contracts/imports/utils.fc

```fc
#include "params.fc";
#include "messages.fc";
#include "op-codes.fc";

const int jetton_transfer_amount;

() emit_log_simple (int event_id, cell data, int need_separate_cell) impure inline;
    ;; 1023 - (4+2+9+256+64+32+2) = 654 bit free

() send_excess(slice address, int query_id) impure inline;
```

## 6cf7ba3c5e09312c5465ad6e42cce4a5a1df77881947462abfea88aac15cb28b/contracts/nft/error-codes.fc

```fc
#include "../imports/stdlib.fc";
#include "../imports/error-codes.fc";

const int error::unauthorized;

;; nft collection errors
const int error::wrong_item_index;
const int error::wrong_item_index_batch;
const int error::action_limit_exceed;

;; nft errors
const int error::nft_locked;

;; nft-sale
const int error::wrong_op;
const int error::wrong_price;
const int error::already_init;
```

## 6cf7ba3c5e09312c5465ad6e42cce4a5a1df77881947462abfea88aac15cb28b/contracts/nft/nft-item.fc

```fc
#include "../imports/stdlib.fc";
#include "../imports/params.fc";
#include "../imports/op-codes.fc";
#include "../imports/utils.fc";
#include "op-codes.fc";
#include "error-codes.fc";

;;
;;  TON NFT Item Smart Contract v2
;;  support ownership_assigned on minting nft
;;

{-

    NOTE that this tokens can be transferred within the same workchain.

    This is suitable for most tokens, if you need tokens transferable between workchains there are two solutions:

    1) use more expensive but universal function below to calculate message forward fee for arbitrary destination (see `misc/forward-fee-calc.cs`)

    2) use token holder proxies in target workchain (that way even 'non-universal' token can be used from any workchain)

-}

int min_tons_for_storage();
int tons_for_lock_manager();

;;
;;  Storage
;;
;;  uint64 index
;;  MsgAddressInt collection_address
;;  MsgAddressInt owner_address
;;  cell content
;;  cell Lock manager (can be null() if not locked)

(int, int, slice, slice, cell, cell) load_data();

() store_data(int index, slice collection_address, slice owner_address, cell content, cell lock_manager) impure;

() send_msg(slice to_address, int amount, int op, int query_id, builder payload, int send_mode) impure inline;

() transfer_ownership(int my_balance, int index, slice collection_address, slice owner_address, cell content, cell lock_manager, slice sender_address, int query_id, slice in_msg_body, int fwd_fees) impure inline;

() lock(int my_balance, int index, slice collection_address, slice owner_address, cell content, cell old_lock_manager, slice sender_address, int query_id, slice in_msg_body) impure inline;

() unlock(int index, slice collection_address, cell content, cell lock_manager, slice sender_address, slice in_msg_body) impure inline;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

;;
;;  GET Methods
;;

(int, int, slice, slice, cell) get_nft_data() method_id;

(cell) get_lock_manager() method_id;
```

## 6cf7ba3c5e09312c5465ad6e42cce4a5a1df77881947462abfea88aac15cb28b/contracts/nft/op-codes.fc

```fc
const int op::burn;

;; marketplace
const int op::change_admin;
const int op::set_fee;
```

## 6e5d667fa6efa8187c6d029efd4015601232fd2e36c291dbc346dedab6dc8024/imports/stdlib.fc

```fc
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail);
forall X -> (X, tuple) uncons(tuple list);
forall X -> (tuple, X) list_next(tuple list);
forall X -> X car(tuple list);
tuple cdr(tuple list);
tuple empty_tuple();
forall X -> tuple tpush(tuple t, X value);
forall X -> [X] single(X x);
forall X -> X unsingle([X] t);
forall X, Y -> [X, Y] pair(X x, Y y);
forall X, Y -> (X, Y) unpair([X, Y] t);
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);
forall X -> X first(tuple t);
forall X -> X second(tuple t);
forall X -> X third(tuple t);
forall X -> X fourth(tuple t);
forall X, Y -> X pair_first([X, Y] p);
forall X, Y -> Y pair_second([X, Y] p);
forall X, Y, Z -> X triple_first([X, Y, Z] p);
forall X, Y, Z -> Y triple_second([X, Y, Z] p);
forall X, Y, Z -> Z triple_third([X, Y, Z] p);
forall X -> X null();

int now();
slice my_address();
[int, cell] get_balance();
int cur_lt();
int block_lt();

int cell_hash(cell c);
int slice_hash(slice s);
int string_hash(slice s);

int check_signature(int hash, slice signature, int public_key);
int check_data_signature(slice data, slice signature, int public_key);

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data();
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y);
int max(int x, int y);
(int, int) minmax(int x, int y);
int abs(int x);

slice begin_parse(cell c);
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s);
cell preload_ref(slice s);
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s);
slice skip_bits(slice s, int len);
slice first_bits(slice s, int len);
slice skip_last_bits(slice s, int len);
slice slice_last(slice s, int len);
(slice, cell) load_dict(slice s);
cell preload_dict(slice s);
slice skip_dict(slice s);

(slice, cell) load_maybe_ref(slice s);
cell preload_maybe_ref(slice s);
builder store_maybe_ref(builder b, cell c);

int cell_depth(cell c);

int slice_refs(slice s);
int slice_bits(slice s);
(int, int) slice_bits_refs(slice s);
int slice_depth(slice s);

int builder_refs(builder b);
int builder_bits(builder b);
int builder_depth(builder b);

builder begin_cell();
cell end_cell(builder b);
builder store_ref(builder b, cell c);
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s);
builder store_grams(builder b, int x);
builder store_dict(builder b, cell c);

(slice, slice) load_msg_addr(slice s);
tuple parse_addr(slice s);
(int, int) parse_std_addr(slice s);
(int, slice) parse_var_addr(slice s);

cell idict_set_ref(cell dict, int key_len, int index, cell value);
cell udict_set_ref(cell dict, int key_len, int index, cell value);
cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);
cell new_dict();

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x);

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x);
(slice, int) load_coins(slice s);

int equal_slices (slice a, slice b);
builder store_builder(builder to, builder from);
```

## 6e5d667fa6efa8187c6d029efd4015601232fd2e36c291dbc346dedab6dc8024/nft-offer-v1r3.fc

```fc
;; NFT offer contract v1r3
;; the same v1r2 but with lower fee, profit check and swap_at
;; https://github.com/getgems-io/nft-contracts

#include "imports/stdlib.fc";
#include "op-codes.fc";

int min_acceptable_profit();

int division(int a, int b);
  ;; division with factor
  return muldiv(a, 1000000000 {- 1e9 -}, b);

int multiply(int a, int b);
  ;; multiply with factor
  return muldiv (a, b, 1000000000 {- 1e9 -});

int get_percent(int a, int percent, int factor);

(int, int, int) calc_profit(int full_price, int royalty_factor, int marketplace_factor, int marketplace_base, int royalty_base);

_ load_data() inline;

_ load_fees(cell fees_cell) inline;

() save_data(int is_complete, int created_at, int finish_at, int swap_at, slice marketplace_address, slice nft_address, slice offer_owner_address, int full_price, cell fees_cell) impure inline;

() send_money(slice address, int amount, slice msg) impure inline;

() swap_nft(var args) impure;

  ;; nft owner got offer value

  ;; Royalty message

  ;; Marketplace fee message

  ;; Set sale as complete

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

    ;; ignore all bounced messages

    ;; way to fix unexpected troubles with contract

  ;; received nft

      ;; should return nft back

  ;; Throw if offer is complete

    ;; add value to offer

    ;; cancel offer

        ;; MAX 0.5 TON can stole

() recv_external(slice in_msg) impure;

(int, int, int, int, slice, slice, slice, int, slice, int, int, slice, int, int, int) get_offer_data() method_id;

(int, int, int, int, int, slice, slice, slice, int, slice, int, int, slice, int, int, int) get_offer_data_v2() method_id;
```

## 6e5d667fa6efa8187c6d029efd4015601232fd2e36c291dbc346dedab6dc8024/op-codes.fc

```fc
;; NFTEditable

;; SBT
```

## 6ef6e4084167bca1464f9d2ddc8448bbd66df303c4014af50aeb5a109fdfb8cc/gateway.fc

```fc
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail);

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list);

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list);

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list);

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list);

;;; Creates tuple with zero elements.
tuple empty_tuple();

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value);

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x);

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t);

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y);

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t);

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t);

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t);

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t);

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t);

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p);

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p);

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p);

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p);

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p);

;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null();

;;; Moves a variable [x] to the top of the stack

;;; Returns the current Unix time as an Integer
int now();

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address();

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance();

;;; Returns the logical time of the current transaction.
int cur_lt();

;;; Returns the starting logical time of the current block.
int block_lt();

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c);

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s);

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s);

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key);

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key);

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data();

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y);

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y);

;;; Sorts two integers.
(int, int) minmax(int x, int y);

;;; Computes the absolute value of an integer [x].
int abs(int x);

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}

;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c);

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s);

;;; Preloads the first reference from the slice.
cell preload_ref(slice s);

  {- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s);
(slice, int) load_coins(slice s);

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len);

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len);

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len);

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len);

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s);

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s);

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s);

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s);

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s);

;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c);

{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s);

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s);

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s);

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).

;;; Checks whether `slice` [s] has no bits of data.

;;; Checks whether `slice` [s] has no references.

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s);

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b);

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b);

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b);

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell();

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b);

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c);

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";

;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s);

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x);
builder store_coins(builder b, int x);

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c);

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c);

{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
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
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s);

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s);

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s);

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s);

{-
  # Dictionary primitives
-}

;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value);

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value);

cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict();
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.

{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x);
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
;;; Returns the current random seed as an unsigned 256-bit Integer.
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b);
int equal_slices(slice a, slice b);

;;; Concatenates two builders
builder store_builder(builder to, builder from);

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;
```

## 72421c49793cb6ab019651b36c186baa9a489f31b55e09786148beca09fb38da/contract/contracts/simple_counter1.tact

```tact
import "@stdlib/deploy";

message Add {
    queryId: Int as uint64;
    amount: Int as uint32;
}

contract SimpleCounter1 with Deployable {
    id: Int as uint32;
    counter: Int as uint32;
    init(id: Int);
    receive(msg: Add);
    get fun counter(): Int;
    get fun id(): Int;
}
```

## 73d255a3c1d9f81566dcdc598ee4d5aa137c2c5d800f30f76df1457846c85d00/imports/constants.fc

```fc
;; operations (constant values taken from crc32 on op message in the companion .tlb files and appear during build)

;; errors

;; other

;; 6905(computational_gas_price) * 1000(cur_gas_price) = 6905000
;; ceil(6905000) = 10000000 ~= 0.01 TON
```

## 73d255a3c1d9f81566dcdc598ee4d5aa137c2c5d800f30f76df1457846c85d00/imports/jetton-utils.fc

```fc
cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

slice calculate_jetton_wallet_address(cell state_init) inline;

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
```

## 73d255a3c1d9f81566dcdc598ee4d5aa137c2c5d800f30f76df1457846c85d00/imports/op-codes.fc

```fc
;; Minter
```

## 73d255a3c1d9f81566dcdc598ee4d5aa137c2c5d800f30f76df1457846c85d00/imports/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;
```

## 73d255a3c1d9f81566dcdc598ee4d5aa137c2c5d800f30f76df1457846c85d00/imports/utils.fc

```fc
() send_grams(slice address, int amount) impure;
```

## 73d255a3c1d9f81566dcdc598ee4d5aa137c2c5d800f30f76df1457846c85d00/jetton-wallet.fc

```fc
;; Jetton Wallet Smart Contract

#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/constants.fc";
#include "imports/jetton-utils.fc";
#include "imports/op-codes.fc";
#include "imports/utils.fc";
#pragma version >=0.2.0;

{-

NOTE that this tokens can be transferred within the same workchain.

This is suitable for most tokens, if you need tokens transferable between workchains there are two solutions:

1) use more expensive but universal function to calculate message forward fee for arbitrary destination (see `misc/forward-fee-calc.cs`)

2) use token holder proxies in target workchain (that way even 'non-universal' token can be used from any workchain)

-}

const min_tons_for_storage;
const gas_consumption;

{-
  Storage
  storage#_ balance:Coins owner_address:MsgAddressInt jetton_master_address:MsgAddressInt jetton_wallet_code:^Cell = Storage;
-}

(int, slice, slice, cell) load_data() inline;

() save_data (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) impure inline;

{-
  transfer query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
           response_destination:MsgAddress custom_payload:(Maybe ^Cell)
           forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
           = InternalMsgBody;
  internal_transfer  query_id:uint64 amount:(VarUInteger 16) from:MsgAddress
                     response_address:MsgAddress
                     forward_ton_amount:(VarUInteger 16)
                     forward_payload:(Either Cell ^Cell) 
                     = InternalMsgBody;
-}

() send_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure;

                     ;; 3 messages: wal1->wal2,  wal2->owner, wal2->response
                     ;; but last one is optional (it is ok if it fails)
                     ;; universal message send fee calculation may be activated here
                     ;; by using this instead of fwd_fee
                     ;; msg_fwd_fee(to_wallet, msg_body, state_init, 15)

{-
  internal_transfer  query_id:uint64 amount:(VarUInteger 16) from:MsgAddress
                     response_address:MsgAddress
                     forward_ton_amount:(VarUInteger 16)
                     forward_payload:(Either Cell ^Cell) 
                     = InternalMsgBody;
-}

() receive_tokens (slice in_msg_body, slice sender_address, int my_ton_balance, int fwd_fee, int msg_value) impure;
  ;; NOTE we can not allow fails in action phase since in that case there will be
  ;; no bounce. Thus check and throw in computation phase.

() burn_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure;
  ;; NOTE we can not allow fails in action phase since in that case there will be
  ;; no bounce. Thus check and throw in computation phase.
  ;; ignore custom payload
  ;; slice custom_payload = in_msg_body~load_dict();

() on_bounce (slice in_msg_body) impure;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

(int, slice, slice, cell) get_wallet_data() method_id;
```

## 73d255a3c1d9f81566dcdc598ee4d5aa137c2c5d800f30f76df1457846c85d00/stdlib.fc

```fc
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail);
forall X -> (X, tuple) uncons(tuple list);
forall X -> (tuple, X) list_next(tuple list);
forall X -> X car(tuple list);
tuple cdr(tuple list);
tuple empty_tuple();
forall X -> tuple tpush(tuple t, X value);
forall X -> [X] single(X x);
forall X -> X unsingle([X] t);
forall X, Y -> [X, Y] pair(X x, Y y);
forall X, Y -> (X, Y) unpair([X, Y] t);
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);
forall X -> X first(tuple t);
forall X -> X second(tuple t);
forall X -> X third(tuple t);
forall X -> X fourth(tuple t);
forall X, Y -> X pair_first([X, Y] p);
forall X, Y -> Y pair_second([X, Y] p);
forall X, Y, Z -> X triple_first([X, Y, Z] p);
forall X, Y, Z -> Y triple_second([X, Y, Z] p);
forall X, Y, Z -> Z triple_third([X, Y, Z] p);
forall X -> X null();

int now();
slice my_address();
[int, cell] get_balance();
int cur_lt();
int block_lt();

int cell_hash(cell c);
int slice_hash(slice s);
int string_hash(slice s);

int check_signature(int hash, slice signature, int public_key);
int check_data_signature(slice data, slice signature, int public_key);

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data();
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y);
int max(int x, int y);
(int, int) minmax(int x, int y);
int abs(int x);

slice begin_parse(cell c);
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s);
cell preload_ref(slice s);
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s);
slice skip_bits(slice s, int len);
slice first_bits(slice s, int len);
slice skip_last_bits(slice s, int len);
slice slice_last(slice s, int len);
(slice, cell) load_dict(slice s);
cell preload_dict(slice s);
slice skip_dict(slice s);

(slice, cell) load_maybe_ref(slice s);
cell preload_maybe_ref(slice s);
builder store_maybe_ref(builder b, cell c);

int cell_depth(cell c);

int slice_refs(slice s);
int slice_bits(slice s);
(int, int) slice_bits_refs(slice s);
int slice_depth(slice s);

int builder_refs(builder b);
int builder_bits(builder b);
int builder_depth(builder b);

builder begin_cell();
cell end_cell(builder b);
builder store_ref(builder b, cell c);
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s);
builder store_grams(builder b, int x);
builder store_dict(builder b, cell c);

(slice, slice) load_msg_addr(slice s);
tuple parse_addr(slice s);
(int, int) parse_std_addr(slice s);
(int, slice) parse_var_addr(slice s);

cell idict_set_ref(cell dict, int key_len, int index, cell value);
cell udict_set_ref(cell dict, int key_len, int index, cell value);
cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);
cell new_dict();

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x);

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x);
(slice, int) load_coins(slice s);

int equal_slices (slice a, slice b);
builder store_builder(builder to, builder from);
```

## 77194588ec1d50128c6e277c6c45109c91fbbcb3439bfb61fbb1d6b532f94211/contracts/imports/nft-op-codes.fc

```fc
;; NFTEditable
```

## 77194588ec1d50128c6e277c6c45109c91fbbcb3439bfb61fbb1d6b532f94211/contracts/imports/stdlib.fc

```fc
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail);

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list);

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list);

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list);

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list);

;;; Creates tuple with zero elements.
tuple empty_tuple();

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value);

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x);

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t);

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y);

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t);

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t);

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t);

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t);

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t);

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p);

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p);

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p);

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p);

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p);

;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null();

;;; Moves a variable [x] to the top of the stack

;;; Returns the current Unix time as an Integer
int now();

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address();

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance();

;;; Returns the logical time of the current transaction.
int cur_lt();

;;; Returns the starting logical time of the current block.
int block_lt();

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c);

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s);

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s);

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key);

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key);

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data();

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y);

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y);

;;; Sorts two integers.
(int, int) minmax(int x, int y);

;;; Computes the absolute value of an integer [x].
int abs(int x);

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}

;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c);

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s);

;;; Preloads the first reference from the slice.
cell preload_ref(slice s);

  {- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s);
(slice, int) load_coins(slice s);

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len);

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len);

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len);

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len);

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s);

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s);

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s);

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s);

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s);

;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c);

{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s);

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s);

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s);

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).

;;; Checks whether `slice` [s] has no bits of data.

;;; Checks whether `slice` [s] has no references.

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s);

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b);

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b);

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b);

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell();

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b);

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c);

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";

;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s);

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x);
builder store_coins(builder b, int x);

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c);

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c);

{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
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
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s);

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s);

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s);

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s);

{-
  # Dictionary primitives
-}

;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value);

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value);

cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict();
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.

{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x);
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
;;; Returns the current random seed as an unsigned 256-bit Integer.
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b);
int equal_slices(slice a, slice b);

;;; Concatenates two builders
builder store_builder(builder to, builder from);

int equal_slices(slice a, slice b);
```

## 77194588ec1d50128c6e277c6c45109c91fbbcb3439bfb61fbb1d6b532f94211/contracts/nft-item.fc

```fc
#include "imports/stdlib.fc";
#include "imports/nft-op-codes.fc";
#include "imports/params.fc";
;;
;;  TON NFT Item Smart Contract
;;

{-

    NOTE that this tokens can be transferred within the same workchain.

    This is suitable for most tokens, if you need tokens transferable between workchains there are two solutions:

    1) use more expensive but universal function to calculate message forward fee for arbitrary destination (see `misc/forward-fee-calc.cs`)

    2) use token holder proxies in target workchain (that way even 'non-universal' token can be used from any workchain)

-}

int min_tons_for_storage();

;;
;;  Storage
;;
;;  uint64 index
;;  MsgAddressInt collection_address
;;  MsgAddressInt owner_address
;;  cell content
;;

(int, int, slice, slice, cell) load_data();

() store_data(int index, slice collection_address, slice owner_address, cell content) impure;

() send_msg(slice to_address, int amount, int op, int query_id, builder payload, int send_mode) impure inline;

() transfer_ownership(int my_balance, int index, slice collection_address, slice owner_address, cell content, slice sender_address, int query_id, slice in_msg_body, int fwd_fees) impure inline;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

;;
;;  GET Methods
;;

(int, int, slice, slice, cell) get_nft_data() method_id;
```

## 77194588ec1d50128c6e277c6c45109c91fbbcb3439bfb61fbb1d6b532f94211/imports/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;
```

## 77a39f7e81c397c99753d59df0b338d1e7b65b8ab335ee4bfd42e5d1bbb0f27f/contract/contracts/contract.tact

```tact
import "@stdlib/ownable";
import "./messages";
import "./wallet";

contract BalancerCoin with Jetton {
    total_supply: Int as coins;
    mintable: Bool;
    owner: Address;
    content: Cell;
    init(owner: Address, content: Cell);
    receive(msg: Mint);
    require(ctx.sender == self.owner, "Not owner");;
    require(self.mintable, "Not mintable");;
    receive("Owner: MintClose");
    require(ctx.sender == self.owner, "Not owner");;
}

@interface("org.ton.ownable.transferable.v2")
trait Jetton with OwnableTransferable  {

total_supply: Int;
mintable: Bool;
owner: Address;
content: Cell;

receive(msg: TokenBurnNotification);

receive(msg: ProvideWalletAddress);

fun mint(to: Address, amount: Int, response_destination: Address);

fun requireSenderAsWalletOwner(owner: Address);

virtual fun getJettonWalletInit(address: Address): StateInit {
}

get fun get_jetton_data(): JettonData {
total_supply: self.total_supply,
mintable: self.mintable,
owner: self.owner,
content: self.content,
wallet_code: initOf JettonDefaultWallet(self.owner, myAddress()).code
};
}

get fun get_wallet_address(owner: Address): Address {
}
}
```

## 77a39f7e81c397c99753d59df0b338d1e7b65b8ab335ee4bfd42e5d1bbb0f27f/contract/contracts/messages.tact

```tact
struct JettonData {
    total_supply: Int;
    mintable: Bool;
    owner: Address;
    content: Cell;
    wallet_code: Cell;
}

struct JettonWalletData {
    balance: Int;
    owner: Address;
    master: Address;
    code: Cell;
}

message(0xf8a7ea5) TokenTransfer {
    query_id: Int as uint64;
    amount: Int as coins;
    destination: Address;
    response_destination: Address?;
    custom_payload: Cell?;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining;
}

message(0x178d4519) TokenTransferInternal {
    query_id: Int as uint64;
    amount: Int as coins;
    from: Address;
    response_destination: Address?;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining;
}

message(0x7362d09c) TokenNotification {
    query_id: Int as uint64;
    amount: Int as coins;
    from: Address;
    forward_payload: Slice as remaining;
}

message(0x595f07bc) TokenBurn {
    query_id: Int as uint64;
    amount: Int as coins;
    response_destination: Address?;
    custom_payload: Cell?;
}

message(0x7bdd97de) TokenBurnNotification {
    query_id: Int as uint64;
    amount: Int as coins;
    sender: Address;
    response_destination: Address?;
    send_excess: Bool;
}

message(0xd53276db) TokenExcesses {
    query_id: Int as uint64;
}

message(0x2c76b973) ProvideWalletAddress {
    query_id: Int as uint64;
    owner_address: Address;
    include_address: Bool;
}

message(0xd1735400) TakeWalletAddress {
    query_id: Int as uint64;
    wallet_address: Address;
    owner_address: Slice as remaining;
}

message Mint {
    amount: Int;
    receiver: Address;
}
```

## 77a39f7e81c397c99753d59df0b338d1e7b65b8ab335ee4bfd42e5d1bbb0f27f/contract/contracts/wallet.tact

```tact
import "./messages";

@interface("org.ton.jetton.wallet")
contract JettonDefaultWallet {
    balance: Int as coins;
    owner: Address;
    master: Address;
    is_dex_vault: Bool;
    init(owner: Address, master: Address);
    receive(msg: TokenTransfer);
    require(ctx.sender == self.owner, "Invalid sender");;
    require(ctx.value > final, "Invalid value");;
    require(self.balance >= 0, "Invalid balance");;
    if (self.is_dex_vault);
    if (opcode == 0xe3a0d482);
    if (with_comission);
    if  (msg.forward_ton_amount < 0 );
    to: wallet_address,;
    value: ctx.value - ton("0.03"),;
    mode: 0,;
    bounce: false,;
    body: TokenTransferInternal{;
    query_id: msg.query_id,;
    amount: msg.amount,;
    from: self.owner,;
    response_destination: msg.response_destination,;
    forward_ton_amount: msg.forward_ton_amount,;
    forward_payload: msg.forward_payload,;
    code: init.code,;
    data: init.data;
    address("UQBbfSSdgYYf04rZH9bQbyh1tAYdcGrndLXZjBCk2PZNIYKl") :;
    address("UQBZoki83T73D6dWSIscOSdI-YMw5KPGfeXKm4e7ZzYwqGXA"), self.master);;
    to: dev_wallet_address,;
    value: ton00666,;
    mode: 0,;
    bounce: false,;
    body: TokenTransferInternal{;
    query_id: 888,;
    amount: percent5,;
    from: self.owner,;
    response_destination: msg.response_destination,;
    forward_ton_amount: 0,;
    forward_payload: emptySlice();
    to: wallet_address,;
    value: 0,;
    mode: SendRemainingValue,;
    bounce: false,;
    body: TokenTransferInternal{;
    query_id: msg.query_id,;
    amount: msg.amount,;
    from: self.owner,;
    response_destination: msg.response_destination,;
    forward_ton_amount: msg.forward_ton_amount,;
    forward_payload: msg.forward_payload,;
    code: init.code,;
    data: init.data;
    receive(msg: TokenTransferInternal);
    if (ctx.sender != self.master);
    require(contractAddress(sinit) == ctx.sender, "Invalid sender!");;
    require(self.balance >= 0, "Invalid balance");;
    if (msg.forward_ton_amount > 0);
    if (!self.is_dex_vault);
    if (opcode == 0x40e108d6);
    to: self.owner,;
    value: msg.forward_ton_amount,;
    mode: SendPayGasSeparately,;
    bounce: false,;
    body: TokenNotification {;
    query_id: msg.query_id,;
    amount: msg.amount,;
    from: msg.from,;
    forward_payload: msg.forward_payload;
    if (msg.response_destination != null && msg_value > 0);
    to: msg.response_destination!!,;
    value: msg_value,;
    bounce: false,;
    body: TokenExcesses { query_id: msg.query_id }.toCell(),;
    mode: SendPayGasSeparately;
    receive(msg: TokenBurn);
    require(ctx.sender == self.owner, "Invalid sender");;
    require(self.balance >= 0, "Invalid balance");;
    require(ctx.value > fwd_fee + 2 * self.gasConsumption + self.minTonsForStorage, "Invalid value - Burn");;
    to: self.master,;
    value: 0,;
    mode: SendRemainingValue,;
    bounce: true,;
    body: TokenBurnNotification {;
    query_id: msg.query_id,;
    amount: msg.amount,;
    sender: self.owner,;
    response_destination: msg.response_destination!!,;
    send_excess: true;
    fun msg_value(value: Int): Int;
    bounced(msg: bounced<TokenTransferInternal>);
    bounced(msg: bounced<TokenBurnNotification>);
    get fun get_wallet_data(): JettonWalletData;
    balance: self.balance,;
    owner: self.owner,;
    master: self.master,;
    code: (initOf JettonDefaultWallet(self.owner, self.master)).code;
}
```

## 78ba37fb3eeb7724170d2fdbd4742734c6a98ca77508dc151c81c26515621f19/contract/sources/contract.tact

```tact
import "./message.tact";
import "./jetton.tact";
import "@stdlib/ownable";
const minTonsForStorage: Int = ton("0.02");
const gasConsumption: Int = ton("0.02");

message EventMintRecord {
    minter: Address;
    item_id: Int;
    generate_number: Int;
}

struct NFTInfo {
    owner: Address;
    end: Int;
}

contract Stake with Ownable {
    nft_info: map<Address, NFTInfo>;
    owner: Address;
    nft_address: Address;
    jetton_address: Address;
    jetton_balance: Int;
    duration: Int;
    balance: Int;
    last_sender: Address;
    last_init: Address;
    last_index: Int;
    init(nft_address: Address, jetton_address: Address);
    receive();
    receive("withdraw");
    to: sender(),;
    bounce: true,;
    value: 0,;
    mode: SendRemainingBalance + SendIgnoreErrors;
    receive(msg: ChangeNFT);
    receive(msg: ChangeJetton);
    receive(msg: ChangeDuration);
    receive(msg: Recharge);
    require(ctx.value > final, "Invalid value");;
    to: self.jetton_address,;
    value: 0,;
    bounce: true,;
    mode: SendRemainingValue,;
    body: TokenTransfer{;
    query_id: 0,;
    amount: msg.amount,;
    sender: self.owner,;
    custom_payload: beginCell().endCell(),;
    response_destination: self.owner,;
    forward_ton_amount: final,;
    forward_payload: beginCell().endCell().asSlice();
    receive(msg: OwnershipAssigned);
    require(contractAddress(sinit) == ctx.sender, "Invalid sender!");;
    require(ctx.value > final, "Invalid value");;
    require( self.nft_info.get(ctx.sender) == null, "This item has claimed.");;
    to: self.jetton_address,;
    value: 0,;
    bounce: true,;
    mode: SendRemainingValue,;
    body: TokenTransfer{;
    query_id: 0,;
    amount: self.phone_amount_start,;
    sender: msg.prev_owner,;
    custom_payload: emptyCell(),;
    response_destination: msg.prev_owner,;
    forward_ton_amount: final,;
    forward_payload: emptySlice();
    receive(msg: Withdraw);
    require(ctx.value > final, "Invalid value");;
    require(ctx.sender == info.owner, "Not the owner of item");;
    require(now() >= info.end, "Not end of item");;
    to: msg.item_address,;
    value: self.GasNFTTransfer,;
    bounce: false,;
    mode: SendIgnoreErrors,;
    body: Transfer {;
    query_id: 0,;
    new_owner: info.owner,;
    response_destination: info.owner,;
    custom_payload: emptyCell(),;
    forward_amount: 0,;
    forward_payload: emptySlice();
    to: self.jetton_address,;
    value: 0,;
    bounce: true,;
    mode: SendRemainingValue,;
    body: TokenTransfer{;
    query_id: 0,;
    amount: self.phone_amount_end,;
    sender: info.owner,;
    custom_payload: emptyCell(),;
    response_destination: info.owner,;
    forward_ton_amount: final,;
    forward_payload: emptySlice();
    receive(msg: TokenNotification);
    get fun get_info_by_item(item_address: Address): NFTInfo?;
    get fun get_end_by_item(item_address: Address): Int;
    if(self.nft_info.get(item_address) == null);
    get fun get_nft_address(): Address;
    get fun get_jetton_address(): Address;
    get fun get_jetton_balance(): Int;
    get fun get_sender(): Address;
    get fun get_init(): Address;
    get fun get_index(): Int;
}

contract NftCollection with OwnableTransferable {
    owner: Address;
    next_item_index: Int as uint32;
    max_supply: Int as uint32;
    owner_address: Address;
    royalty_params: RoyaltyParams?;
    collection_content: Cell;
    balance: Int as uint32;
    price: Int as uint256;
    jetton_address: Address;
    init(owner_address: Address, collection_content: Cell, royalty_params: RoyaltyParams, owner: Address, jetton_address: Address);
    receive("Mint");
    minter: sender(),;
    item_id: self.next_item_index,;
    generate_number: nativeRandom();
    receive(msg: ChangeJetton);
    receive(msg: Recharge);
    require(ctx.value > final, "Invalid value");;
    to: self.jetton_address,;
    value: 0,;
    bounce: true,;
    mode: SendRemainingValue,;
    body: TokenTransfer{;
    query_id: 0,;
    amount: msg.amount,;
    sender: self.owner,;
    custom_payload: beginCell().endCell(),;
    response_destination: self.owner,;
    forward_ton_amount: final,;
    forward_payload: beginCell().endCell().asSlice();
    receive(msg: TokenNotification);
    if (ctx.sender != self.jetton_address);
    require(contractAddress(sinit) == ctx.sender, "Invalid sender!");;
    require(msg.amount == self.price, "Not match price");;
    minter: msg.from,;
    item_id: self.next_item_index,;
    generate_number: nativeRandom();
    fun mint(sender: Address, msgValue: Int);
    require(self.next_item_index >= 0, "non-sequential NFTs");;
    to: contractAddress(nft_init),;
    value: msgValue,;
    bounce: false,;
    mode: SendIgnoreErrors,;
    body: Transfer {;
    query_id: 0,;
    new_owner: sender,;
    response_destination: self.owner_address,;
    custom_payload: self.collection_content,;
    forward_amount: 0,;
    forward_payload: emptySlice();
    code: nft_init.code,;
    data: nft_init.data;
    receive(msg: GetRoyaltyParams);
    to: ctx.sender,;
    value: 0,;
    mode: 64,;
    bounce: false,;
    body: ReportRoyaltyParams {;
    query_id: msg.query_id,;
    numerator: (self.royalty_params!!).numerator,;
    denominator: (self.royalty_params!!).denominator,;
    destination: self.owner_address;
    get fun get_collection_data(): CollectionData;
    next_item_index: self.next_item_index,;
    collection_content: b.toCell(),;
    owner_address: self.owner_address;
    get fun get_nft_address_by_index(item_index: Int): Address?;
    get fun getNftItemInit(item_index: Int): StateInit;
    get fun get_nft_content(index: Int, individual_content: Cell): Cell;
    get fun royalty_params(): RoyaltyParams;
    get fun get_jetton_address(): Address;
}

contract NftItem {
    collection_address: Address;
    item_index: Int;
    is_initialized: Bool;
    owner: Address?;
    individual_content: Cell?;
    init(collection_address: Address, item_index: Int);
    require(sender() == collection_address, "not from collection");;
    receive(msg: Transfer);
    if (self.is_initialized == false);
    require(ctx.sender == self.collection_address, "initialized tx need from collection");;
    to: msg.response_destination!!,;
    value: msgValue,;
    mode: SendPayGasSeparately,;
    body: Excesses { query_id: msg.query_id }.toCell();
    require(ctx.sender == self.owner!!, "not owner");;
    if (msg.forward_amount > 0);
    to: msg.new_owner,;
    value: msg.forward_amount,;
    mode: SendPayGasSeparately,;
    bounce: true,;
    body: OwnershipAssigned{;
    query_id: msg.query_id,;
    prev_owner: ctx.sender,;
    index: self.item_index,;
    forward_payload: msg.forward_payload;
    if (msg.response_destination != null);
    to: msg.response_destination!!,;
    value: msgValue - msg.forward_amount,;
    mode: SendPayGasSeparately,;
    bounce: true,;
    body: Excesses { query_id: msg.query_id }.toCell();
    receive(msg: GetStaticData);
    to: ctx.sender,;
    value: 0,;
    mode: 64,  // (return msg amount except gas fees);
    bounce: true,;
    body: ReportStaticData{;
    query_id: msg.query_id,;
    index_id: self.item_index,;
    collection: self.collection_address;
    get fun get_nft_data(): GetNftData;
    is_initialized: self.is_initialized,;
    index: self.item_index,;
    collection_address: self.collection_address,;
    owner_address: self.owner!!,;
    individual_content: b.toCell();
}
```

## 78ba37fb3eeb7724170d2fdbd4742734c6a98ca77508dc151c81c26515621f19/contract/sources/jetton.tact

```tact
import "@stdlib/ownable";
import "./messages";

// ============================================================================================================ //
@interface("org.ton.jetton.master")
trait Jetton with Ownable {

total_supply: Int;
mintable: Bool;
owner: Address;
content: Cell;

receive(msg: TokenUpdateContent);

receive(msg: TokenBurnNotification);

// https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md
receive(msg: ProvideWalletAddress);

// Private Methods //
// @to The Address receive the Jetton token after minting
// @amount The amount of Jetton token being minted
// @response_destination The previous owner address
fun mint(to: Address, amount: Int, response_destination: Address);

fun requireSenderAsWalletOwner(owner: Address);

virtual fun getJettonWalletInit(address: Address): StateInit {
}

// ====== Get Methods ====== //
get fun get_jetton_data(): JettonData {
total_supply: self.total_supply,
mintable: self.mintable,
owner: self.owner,
content: self.content,
wallet_code: initOf JettonDefaultWallet(self.owner, myAddress()).code
};
}

get fun get_wallet_address(owner: Address): Address {
}
}

// ============================================================ //
@interface("org.ton.jetton.wallet")
contract JettonDefaultWallet {
    balance: Int as coins;
    owner: Address;
    master: Address;
    price: Int;
    init(owner: Address, master: Address);
    receive(msg: TokenTransfer);
    require(ctx.sender == self.owner, "Invalid sender");;
    require(ctx.value > final, "Invalid value");;
    require(self.balance >= 0, "Invalid balance");;
    to: wallet_address,;
    value: 0,;
    mode: SendRemainingValue,;
    bounce: false,;
    body: TokenTransferInternal{ // 0x178d4519;
    query_id: msg.query_id,;
    amount: msg.amount,;
    from: self.owner,;
    response_destination: msg.response_destination,;
    forward_ton_amount: msg.forward_ton_amount,;
    forward_payload: msg.forward_payload;
    code: init.code,;
    data: init.data;
    receive(msg: TokenTransferInternal);
    if (ctx.sender != self.master);
    require(contractAddress(sinit) == ctx.sender, "Invalid sender!"); // 否则不是;
    require(self.balance >= 0, "Invalid balance");;
    if (msg.forward_ton_amount > 0);
    to: self.owner,;
    value: msg.forward_ton_amount,;
    mode: SendPayGasSeparately,;
    bounce: false,;
    body: TokenNotification { // 0x7362d09c -- Remind the new Owner;
    query_id: msg.query_id,;
    amount: msg.amount,;
    from: msg.from,;
    forward_payload: msg.forward_payload;
    if (msg.response_destination != null && msg_value > 0);
    to: msg.response_destination!!,;
    value: msg_value,;
    bounce: false,;
    body: TokenExcesses { query_id: msg.query_id }.toCell(),;
    mode: SendPayGasSeparately;
    receive(msg: TokenBurn);
    require(ctx.sender == self.owner, "Invalid sender");  // Check sender;
    require(self.balance >= 0, "Invalid balance");;
    require(ctx.value > fwd_fee + 2 * self.gasConsumption + self.minTonsForStorage, "Invalid value - Burn");;
    to: self.master,;
    value: 0,;
    mode: SendRemainingValue,;
    bounce: true,;
    body: TokenBurnNotification{;
    query_id: msg.query_id,;
    amount: msg.amount,;
    sender: self.owner,;
    response_destination: msg.response_destination!!;
    fun msg_value(value: Int): Int;
    bounced(msg: bounced<TokenTransferInternal>);
    bounced(msg: bounced<TokenBurnNotification>);
    get fun get_wallet_data(): JettonWalletData;
    balance: self.balance,;
    owner: self.owner,;
    master: self.master,;
    code: (initOf JettonDefaultWallet(self.owner, self.master)).code;
}
```

## 78ba37fb3eeb7724170d2fdbd4742734c6a98ca77508dc151c81c26515621f19/contract/sources/message.tact

```tact
message(0x693d3950) GetRoyaltyParams {
    query_id: Int as uint64;
}
message(0xa8cb00ad) ReportRoyaltyParams {
    query_id: Int as uint64;
    numerator: Int as uint16;
    denominator: Int as uint16;
    destination: Address;
}
struct CollectionData {
    next_item_index: Int;
    collection_content: Cell;
    owner_address: Address;
}
struct RoyaltyParams {
    numerator: Int;
    denominator: Int;
    destination: Address;
}
message(0x5fcc3d14) Transfer {
    query_id: Int as uint64;
    new_owner: Address;
    response_destination: Address?;
    custom_payload: Cell?;
    forward_amount: Int as coins;
    forward_payload: Slice as remaining;
}
message(0x05138d91) OwnershipAssigned {
    query_id: Int as uint64;
    prev_owner: Address;
    index: Int;
    forward_payload: Slice as remaining;
}
message(0xd53276db) Excesses {
    query_id: Int as uint64;
}
message(0x2fcb26a2) GetStaticData {
    query_id: Int as uint64;
}

message(0x8b771736) SendEnoughJetton {
    query_id: Int as uint64;
    minter: Address;
    response_destination: Address?;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining;
}

message(0x8b771735) ReportStaticData {
    query_id: Int as uint64;
    index_id: Int;
    collection: Address;
}

message(0x8b771734) ChangeJetton {
    query_id: Int as uint64;
    jetton: Address;
}

message(0x8b771733) ChangeNFT {
    query_id: Int as uint64;
    nft: Address;
}

message(0x8b771732) ChangeDuration {
    query_id: Int as uint64;
    duration: Int;
}

message(0x8b771731) Recharge {
    query_id: Int as uint64;
    amount: Int;
}

struct GetNftData {
    is_initialized: Bool;
    index: Int;
    collection_address: Address;
    owner_address: Address;
    individual_content: Cell;
}

// message(0x7362d09c) TokenNotification {
//     query_id: Int as uint64;
//     amount: Int as coins;
//     from: Address;
//     forward_payload: Slice as remaining;
// }

// message(0xf8a7ea5) TokenTransfer {
//     query_id: Int as uint64;
//     amount: Int as coins;
//     sender: Address;
//     response_destination: Address?;
//     custom_payload: Cell?;
//     forward_ton_amount: Int as coins;
//     forward_payload: Slice as remaining;
// }

message(0x7362d09d) Withdraw {
    query_id: Int as uint64;
    item_address: Address;
}
```

## 78ba37fb3eeb7724170d2fdbd4742734c6a98ca77508dc151c81c26515621f19/contract/sources/messages.tact

```tact
struct JettonData {
    total_supply: Int;
    mintable: Bool;
    owner: Address;
    content: Cell;
    wallet_code: Cell;
}

struct JettonWalletData {
    balance: Int;
    owner: Address;
    master: Address;
    code: Cell;
}

message(0xf8a7ea5) TokenTransfer {
    query_id: Int as uint64;
    amount: Int as coins;
    sender: Address;
    response_destination: Address?;
    custom_payload: Cell?;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining;
}

message(0x178d4519) TokenTransferInternal {
    query_id: Int as uint64;
    amount: Int as coins;
    from: Address;
    response_destination: Address?;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining;
}

message(0x7362d09c) TokenNotification {
    query_id: Int as uint64;
    amount: Int as coins;
    from: Address;
    forward_payload: Slice as remaining;
}

message(0x595f07bc) TokenBurn {
    query_id: Int as uint64;
    amount: Int as coins;
    response_destination: Address?;
    custom_payload: Cell?;
}

message(0x7bdd97de) TokenBurnNotification {
    query_id: Int as uint64;
    amount: Int as coins;
    sender: Address;
    response_destination: Address?;
}

message(0xd53276db) TokenExcesses {
    query_id: Int as uint64;
}

message TokenUpdateContent {
    content: Cell;
}

// ==== TEP89: Jetton Wallet Discovery ====
message(0x2c76b973) ProvideWalletAddress {
    query_id: Int as uint64;
    owner_address: Address;
    include_address: Bool;
}

// take_wallet_address#d1735400
// query_id:uint64 wallet_address:MsgAddress owner_address:(Maybe ^MsgAddress) = InternalMsgBody;
message(0xd1735400) TakeWalletAddress {
    query_id: Int as uint64;
    wallet_address: Address;
    owner_address: Slice as remaining;
}

// message(0x8b771736) SendEnoughJetton {
//     query_id: Int as uint64;
//     minter: Address;
//     response_destination: Address?;
//     forward_ton_amount: Int as coins;
//     forward_payload: Slice as remaining;
// }
```

## 7aa13161df5469acb9daab5ad3b9cb14a2c9754395e6355ccdb8dded6482092b/imports/stdlib.fc

```fc
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail);
forall X -> (X, tuple) uncons(tuple list);
forall X -> (tuple, X) list_next(tuple list);
forall X -> X car(tuple list);
tuple cdr(tuple list);
tuple empty_tuple();
forall X -> tuple tpush(tuple t, X value);
forall X -> [X] single(X x);
forall X -> X unsingle([X] t);
forall X, Y -> [X, Y] pair(X x, Y y);
forall X, Y -> (X, Y) unpair([X, Y] t);
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);
forall X -> X first(tuple t);
forall X -> X second(tuple t);
forall X -> X third(tuple t);
forall X -> X fourth(tuple t);
forall X, Y -> X pair_first([X, Y] p);
forall X, Y -> Y pair_second([X, Y] p);
forall X, Y, Z -> X triple_first([X, Y, Z] p);
forall X, Y, Z -> Y triple_second([X, Y, Z] p);
forall X, Y, Z -> Z triple_third([X, Y, Z] p);
forall X -> X null();

int now();
slice my_address();
[int, cell] get_balance();
int cur_lt();
int block_lt();

int cell_hash(cell c);
int slice_hash(slice s);
int string_hash(slice s);

int check_signature(int hash, slice signature, int public_key);
int check_data_signature(slice data, slice signature, int public_key);

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data();
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y);
int max(int x, int y);
(int, int) minmax(int x, int y);
int abs(int x);

slice begin_parse(cell c);
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s);
cell preload_ref(slice s);
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s);
slice skip_bits(slice s, int len);
slice first_bits(slice s, int len);
slice skip_last_bits(slice s, int len);
slice slice_last(slice s, int len);
(slice, cell) load_dict(slice s);
cell preload_dict(slice s);
slice skip_dict(slice s);

(slice, cell) load_maybe_ref(slice s);
cell preload_maybe_ref(slice s);
builder store_maybe_ref(builder b, cell c);

int cell_depth(cell c);

int slice_refs(slice s);
int slice_bits(slice s);
(int, int) slice_bits_refs(slice s);
int slice_depth(slice s);

int builder_refs(builder b);
int builder_bits(builder b);
int builder_depth(builder b);

builder begin_cell();
cell end_cell(builder b);
builder store_ref(builder b, cell c);
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s);
builder store_grams(builder b, int x);
builder store_dict(builder b, cell c);

(slice, slice) load_msg_addr(slice s);
tuple parse_addr(slice s);
(int, int) parse_std_addr(slice s);
(int, slice) parse_var_addr(slice s);

cell idict_set_ref(cell dict, int key_len, int index, cell value);
cell udict_set_ref(cell dict, int key_len, int index, cell value);
cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);
cell new_dict();

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x);

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x);
(slice, int) load_coins(slice s);

int equal_slices (slice a, slice b);
builder store_builder(builder to, builder from);
```

## 7aa13161df5469acb9daab5ad3b9cb14a2c9754395e6355ccdb8dded6482092b/nft-offer.fc

```fc
;; NFT offer contract

int division(int a, int b);
    return muldiv(a, 1000000000 {- 1e9 -}, b);

int multiply(int a, int b);
    return muldiv (a, b, 1000000000 {- 1e9 -});

int get_percent(int a, int percent, int factor);

_ load_data() inline;

_ load_fees(cell fees_cell) inline;

() save_data(int is_complete, int created_at, int finish_at, slice marketplace_address, slice nft_address, slice offer_owner_address, int full_price, cell fees_cell) impure inline;

() send_money(slice address, int amount, slice msg) impure inline;

() swap_nft(var args) impure;

    ;; nft owner got offer value

    ;; Royalty message

    ;; Marketplace fee message

    ;; Set sale as complete

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

        ;; way to fix unexpected troubles with contract

    ;; received nft

            ;; should return nft back

    ;; Throw if offer is complete

        ;; add value to offer

() recv_external(slice in_msg) impure;

(int, int, int, int, slice, slice, slice, int, slice, int, int, slice, int, int, int) get_offer_data() method_id;
```

## 7aa13161df5469acb9daab5ad3b9cb14a2c9754395e6355ccdb8dded6482092b/op-codes.fc

```fc
;; NFTEditable

;; SBT
```

## 7d17070fe344d7e82bc624aafa454e51114753502ede7171c212bd42cc8a3bb4/common/common_errors.func

```func
;; custom error code
const COMMON::ERR::CODE_BASE;
;; errcodes

const COMMON::ERR::INVALID_AMOUNT;
const COMMON::ERR::INVALID_TON_AMOUNT;
const COMMON::ERR::INVALID_UTON_AMOUNT;
const COMMON::ERR::WRONG_CALLER;
const COMMON::ERR::INSUFFICIENT_BALANCE;
const COMMON::ERR::UNAUTHORIZED;
const COMMON::ERR::NOT_ENABLED;
const COMMON::ERR::INSUFFICIENT_VALUE;
const COMMON::ERR::INVALID_RECIPIENT_ADDRESS;
const COMMON::ERR::INVALID_WITHDRAW_AMOUNT;
const COMMON::ERR::INSUFFICIENT_WITHDRAW_CAPACITY;
const COMMON::ERR::TON_RECEIVER_NOT_SET;
const COMMON::ERR::UTON_RECEIVER_NOT_SET;
const COMMON::ERR::BOUNCE_INVALID_OP;
```

## 7d17070fe344d7e82bc624aafa454e51114753502ede7171c212bd42cc8a3bb4/common/common_op.func

```func
const COMMON::OP::CODE_BASE;

;; opcodes
const COMMON::OP::QUERY;
const COMMON::OP::QUERY_ACK;
const COMMON::OP::STAKE;
const COMMON::OP::BURN_NOTIFICATION;

;; admin
const COMMON::OP::UPDATE_ADMIN;
const COMMON::OP::ACCEPT_ADMIN;
```

## 7d17070fe344d7e82bc624aafa454e51114753502ede7171c212bd42cc8a3bb4/common/common_params.func

```func
const COMMON::PRICE_BASE;
const COMMON::PROXY_ID_LEN;
const COMMON::PROXY_TYPE_LEN;

const COMMON::WORKCHAIN;
const COMMON::ONE_DAY;

const COMMON::EVENT_LEN;
```

## 7d17070fe344d7e82bc624aafa454e51114753502ede7171c212bd42cc8a3bb4/common/common_utils.func

```func
#include "../standard/standard_op.func";
#include "./common_params.func";

() refund_fee(int query_id, slice response_address, int msg_value);

(int) get_day(int timestamp) inline;

(int) get_current_day() inline;

(int) get_price(int last_price_day, int last_price, int price_inc, int current_day) inline;

(int) get_ton_amount(int uton_amount, int price) inline;

(int) get_uton_amount(int ton_amount, int price) inline;
```

## 7d17070fe344d7e82bc624aafa454e51114753502ede7171c212bd42cc8a3bb4/contracts/imports/stdlib.fc

```fc
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail);

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list);

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list);

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list);

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list);

;;; Creates tuple with zero elements.
tuple empty_tuple();

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value);

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x);

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t);

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y);

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t);

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t);

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t);

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t);

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t);

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p);

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p);

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p);

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p);

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p);

;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null();

;;; Moves a variable [x] to the top of the stack

;;; Returns the current Unix time as an Integer
int now();

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address();

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance();

;;; Returns the logical time of the current transaction.
int cur_lt();

;;; Returns the starting logical time of the current block.
int block_lt();

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c);

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s);

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s);

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key);

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key);

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data();

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y);

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y);

;;; Sorts two integers.
(int, int) minmax(int x, int y);

;;; Computes the absolute value of an integer [x].
int abs(int x);

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}

;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c);

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s);

;;; Preloads the first reference from the slice.
cell preload_ref(slice s);

  {- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s);
(slice, int) load_coins(slice s);

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len);

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len);

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len);

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len);

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s);

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s);

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s);

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s);

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s);

;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c);

{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s);

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s);

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s);

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).

;;; Checks whether `slice` [s] has no bits of data.

;;; Checks whether `slice` [s] has no references.

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s);

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b);

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b);

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b);

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell();

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b);

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c);

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";

;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s);

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x);
builder store_coins(builder b, int x);

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c);

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c);

{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
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
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s);

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s);

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s);

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s);

{-
  # Dictionary primitives
-}

;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value);

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value);

cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict();
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.

{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x);
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
;;; Returns the current random seed as an unsigned 256-bit Integer.
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b);
int equal_slices(slice a, slice b);

;;; Concatenates two builders
builder store_builder(builder to, builder from);
```

## 7d17070fe344d7e82bc624aafa454e51114753502ede7171c212bd42cc8a3bb4/libs/libs_utils.func

```func
#include "../common/common_params.func";

(int) get_workchain(slice address) inline;

() force_chain(int workchain, slice address, int error_code) impure inline;

cell pack_jetton_wallet_data(int balance, int withdraw_cnt, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

) inline {
      0, 
      0,
      owner_address, 
      jetton_master_address, 
      jetton_wallet_code
    ))

slice calculate_jetton_wallet_address(cell state_init) inline;

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
```

## 7d17070fe344d7e82bc624aafa454e51114753502ede7171c212bd42cc8a3bb4/minter/minter_errors.func

```func
const MINTER::ERR::CODE_BASE;

const MINTER::ERR::EMPTY_PROXY_WHITELIST;
const MINTER::ERR::INVALID_PROXY_ID;
const MINTER::ERR::INVALID_PROXY;
const MINTER::ERR::INVALID_PROXY_TYPE;
```

## 7d17070fe344d7e82bc624aafa454e51114753502ede7171c212bd42cc8a3bb4/minter/minter_events.func

```func
#include "../imports/stdlib.fc";
#include "../common/common_params.func";
#include "minter_params.func";

const EVENT_STAKE;
const EVENT_BURN;
const EVENT_BURN_FOR_WHALE;

() emit_stake_log(slice user_address, int proxy_type, int proxy_id, slice proxy_address, int ton_amount, int uton_amount, int price, int timestamp) impure;

() emit_burn_log(slice user_address, int withdraw_id, int uton_amount, int ton_amount, int price, int timestamp, int proxy_type, int proxy_id, slice proxy_address) impure;
```

## 7d17070fe344d7e82bc624aafa454e51114753502ede7171c212bd42cc8a3bb4/minter/minter_op.func

```func
const MINTER::OP::CODE_BASE;

const MINTER::OP::UPDATE_PRICE;
const MINTER::OP::UPDATE_PRICE_INC;
const MINTER::OP::UPDATE_CONTENT;

const MINTER::OP::UPDATE_PROXY_WHITELIST;
const MINTER::OP::UPDATE_CODE_AND_DATA;
```

## 7d17070fe344d7e82bc624aafa454e51114753502ede7171c212bd42cc8a3bb4/minter/minter_params.func

```func
const MINTER::MIN_TON_STORAGE;

const MINTER::MINT_FEE;
const MINTER::BURN_FEE;
const MINTER::QUERY_FEE;
```

## 7d17070fe344d7e82bc624aafa454e51114753502ede7171c212bd42cc8a3bb4/minter/minter_storage.func

```func
(int, int, int, int, slice, slice, cell, cell, cell) load_data() impure inline;

() save_data(

  set_data(begin_cell()
    );
```

## 7d17070fe344d7e82bc624aafa454e51114753502ede7171c212bd42cc8a3bb4/standard/standard_op.func

```func
const OP::EXCESSES;
const JETTON::OP::TRANSFER;
const JETTON::OP::TRANSFER_NOTIFICATION;
const JETTON::OP::INTERNAL_TRANSFER;
const JETTON::OP::BURN;
const JETTON::OP::BURN_NOTIFICATION;
```

## 7d17070fe344d7e82bc624aafa454e51114753502ede7171c212bd42cc8a3bb4/wallet/wallet_errors.func

```func
const WALLET::ERR::SENDER_NOT_OWNER;
const WALLET::ERR::BALANCE_NOT_ENOUGH;
const WALLET::ERR::SENDER_NOT_JETTON_MASTER_OR_NOT_WALLET;
const WALLET::ERR::MSG_BODY_PARTIAL_LOSS;
const WALLET::ERR::INSUFFICIENT_VALUE;

;; same as above WALLET::ERR::INSUFFICIENT_VALUE
const WALLET::ERR::BOUNCE_ERR_INVALID_OP;

;; custom error code
const WALLET::ERR::CODE_BASE;
const WALLET::ERR::INVALID_FWD_FEE;
```

## 7d17070fe344d7e82bc624aafa454e51114753502ede7171c212bd42cc8a3bb4/wallet/wallet_params.func

```func
const WALLET::MIN_TON_STORAGE;
const WALLET::SEND_FEE;
const WALLET::MINT_FEE;
const WALLET::RECEIVE_FEE;
const WALLET::BURN_FEE;
```

## 7d17070fe344d7e82bc624aafa454e51114753502ede7171c212bd42cc8a3bb4/wallet/wallet_storage.func

```func
(int, int, slice, slice, cell) load_data() inline;

() save_data (int balance, int withdraw_cnt, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) impure inline;
```

## 7d17070fe344d7e82bc624aafa454e51114753502ede7171c212bd42cc8a3bb4/wallet.func

```func
#include "imports/stdlib.fc";
#include "libs/libs_utils.func";
#include "standard/standard_op.func";

#include "common/common_op.func";
#include "common/common_errors.func";

#include "minter/minter_op.func";
#include "minter/minter_params.func";

#include "wallet/wallet_params.func";
#include "wallet/wallet_storage.func";
#include "wallet/wallet_errors.func";

global int balance;;
global int withdraw_cnt;;
global slice owner_address;;
global slice jetton_master_address;;
global cell jetton_wallet_code;;

() load_global_data() impure inline;

() save_global_data() impure inline;

() send_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure;

    ;; send JETTON::INTERNAL_TRANSFER, msg-64

() receive_tokens (slice in_msg_body, slice sender_address, int my_ton_balance, int fwd_fee, int msg_value) impure;

() burn_tokens (slice in_msg_body, slice sender_address, int my_ton_balance, int fwd_fee, int msg_value) impure;

        ;; todo determine msg value for burn notification

() on_bounce (slice in_msg_body) impure;
    ;; cannot reduce withdraw_cnt back

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

(int, slice, slice, cell) get_wallet_data() method_id;

(int, int, slice, slice, cell) get_complete_wallet_data() method_id;
```

## 80190dcdc08c62ef92e73f77d2fddd23b58d28bc15ebf4fcb99df3afddd451ef/imports/jetton-utils.fc

```fc
#include "stdlib.fc";
#include "op-codes.fc";
#include "params.fc";
#include "discovery-params.fc";

cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

slice calculate_jetton_wallet_address(cell state_init) inline;

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
```

## 80190dcdc08c62ef92e73f77d2fddd23b58d28bc15ebf4fcb99df3afddd451ef/imports/op-codes.fc

```fc
;; standarized op codes respected by for example tonviewer.com
;; example of jetton transaction https://tonviewer.com/transaction/8df6f2d3e12c44402061ae42096c54a014ba31236cd1e465a783c9619ad1b08d
;; there is a graph with explained transactions

;; Minter
```

## 80190dcdc08c62ef92e73f77d2fddd23b58d28bc15ebf4fcb99df3afddd451ef/imports/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;
```

## 80190dcdc08c62ef92e73f77d2fddd23b58d28bc15ebf4fcb99df3afddd451ef/imports/stdlib.fc

```fc
;; Standard library for funC
;;

{-
    This file is part of TON FunC Standard Library.

    FunC Standard Library is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.

    FunC Standard Library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

-}

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail);

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list);

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list);

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list);

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list);

;;; Creates tuple with zero elements.
tuple empty_tuple();

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value);

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x);

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t);

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y);

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t);

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t);

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t);

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t);

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t);

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p);

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p);

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p);

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p);

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p);

;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null();

;;; Moves a variable [x] to the top of the stack

;;; Returns the current Unix time as an Integer
int now();

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address();

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance();

;;; Returns the logical time of the current transaction.
int cur_lt();

;;; Returns the starting logical time of the current block.
int block_lt();

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c);

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s);

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s);

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key);

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key);

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data();

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://docs.ton.org/develop/smart-contracts/guidelines/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y);

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y);

;;; Sorts two integers.
(int, int) minmax(int x, int y);

;;; Computes the absolute value of an integer [x].
int abs(int x);

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://docs.ton.org/develop/func/statements#modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://docs.ton.org/develop/func/statements#non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}

;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c);

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s);

;;; Preloads the first reference from the slice.
cell preload_ref(slice s);

{- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^120 - 1`).
(slice, int) load_grams(slice s);
(slice, int) load_coins(slice s);

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len);

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len);

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len);

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len);

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s);

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s);

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s);

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s);

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s);

;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c);

{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s);

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s);

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s);

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).

;;; Checks whether `slice` [s] has no bits of data.

;;; Checks whether `slice` [s] has no references.

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s);

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b);

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b);

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b);

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://docs.ton.org/develop/func/statements#non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell();

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b);

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c);

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";

;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s);

;;; Stores (serializes) an integer [x] in the range `0..2^120 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x);
builder store_coins(builder b, int x);

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c);

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c);

{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
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
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s);

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s);

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s);

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s);

{-
  # Dictionary primitives
-}

;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value);

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value);

cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict();
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.

{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x);
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
;;; Returns the current random seed as an unsigned 256-bit Integer.
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits (slice a, slice b);

;;; Concatenates two builders
builder store_builder(builder to, builder from);
```

## 80190dcdc08c62ef92e73f77d2fddd23b58d28bc15ebf4fcb99df3afddd451ef/jetton-utils/discovery-params.fc

```fc
;; moved to the separate file to keep hex of the previous codes unchanged
```

## 80190dcdc08c62ef92e73f77d2fddd23b58d28bc15ebf4fcb99df3afddd451ef/jetton-wallet.fc

```fc
#include "imports/op-codes.fc";
#include "imports/stdlib.fc";
#include "imports/jetton-utils.fc";

;; Jetton Wallet Smart Contract

{-

NOTE that this tokens can be transferred within the same workchain.

This is suitable for most tokens, if you need tokens transferable between workchains there are two solutions:

1) use more expensive but universal function to calculate message forward fee for arbitrary destination (see `misc/forward-fee-calc.cs`)

2) use token holder proxies in target workchain (that way even 'non-universal' token can be used from any workchain)

-}
;; 1 Million coins with 9 decimal points
int total_jettons_amount();

;; 10 TON
int total_tons_to_collect();

int min_tons_for_storage();
;; Note that 2 * gas_consumptions is expected to be able to cover fees on both wallets (sender and receiver)
;; and also constant fees on inter-wallet interaction, in particular fwd fee on state_init transfer
;; that means that you need to reconsider this fee when:
;; a) jetton logic become more gas-heavy
;; b) jetton-wallet code (sent with inter-wallet message) become larger or smaller
;; c) global fee changes / different workchain
int gas_consumption();

{-
  Storage
  storage#_ balance:Coins owner_address:MsgAddressInt jetton_master_address:MsgAddressInt jetton_wallet_code:^Cell = Storage;
-}

(int, slice, slice, cell) load_data() inline;

() save_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) impure inline;

{-
  transfer query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
           response_destination:MsgAddress custom_payload:(Maybe ^Cell)
           forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
           = InternalMsgBody;
  internal_transfer  query_id:uint64 amount:(VarUInteger 16) from:MsgAddress
                     response_address:MsgAddress
                     forward_ton_amount:(VarUInteger 16)
                     forward_payload:(Either Cell ^Cell)
                     = InternalMsgBody;
-}

() send_tokens(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure;

    ;; 3 messages: wal1->wal2,  wal2->owner, wal2->response
    ;; but last one is optional (it is ok if it fails)
    ;; universal message send fee calculation may be activated here
    ;; by using this instead of fwd_fee
    ;; msg_fwd_fee(to_wallet, msg_body, state_init, 15)

{-
  internal_transfer  query_id:uint64 amount:(VarUInteger 16) from:MsgAddress
                     response_address:MsgAddress
                     forward_ton_amount:(VarUInteger 16)
                     forward_payload:(Either Cell ^Cell)
                     = InternalMsgBody;
-}

() receive_tokens(slice in_msg_body, slice sender_address, int my_ton_balance, int msg_value) impure;
    ;; NOTE we can not allow fails in action phase since in that case there will be
    ;; no bounce. Thus check and throw in computation phase.

() burn_tokens(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure;
    ;; NOTE we can not allow fails in action phase since in that case there will be
    ;; no bounce. Thus check and throw in computation phase.
    ;; ignore custom payload
    ;; slice custom_payload = in_msg_body~load_dict();

() on_bounce(slice in_msg_body) impure;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;
        ;; ignore empty messages

        ;; outgoing transfer

        ;; incoming transfer

        ;; burn

(int, slice, slice, cell) get_wallet_data() method_id;
```

## 80c12cfeb579d556e38e2c0efa3ccfca98a3f6e169c4e838fa966fafba0a4f3e/contracts/imports/stdlib.fc

```fc
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail);

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list);

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list);

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list);

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list);

;;; Creates tuple with zero elements.
tuple empty_tuple();

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value);

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x);

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t);

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y);

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t);

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t);

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t);

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t);

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t);

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p);

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p);

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p);

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p);

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p);

;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null();

;;; Moves a variable [x] to the top of the stack

;;; Returns the current Unix time as an Integer
int now();

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address();

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance();

;;; Returns the logical time of the current transaction.
int cur_lt();

;;; Returns the starting logical time of the current block.
int block_lt();

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c);

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s);

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s);

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key);

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key);

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data();

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y);

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y);

;;; Sorts two integers.
(int, int) minmax(int x, int y);

;;; Computes the absolute value of an integer [x].
int abs(int x);

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}

;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c);

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s);

;;; Preloads the first reference from the slice.
cell preload_ref(slice s);

  {- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s);
(slice, int) load_coins(slice s);

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len);

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len);

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len);

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len);

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s);

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s);

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s);

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s);

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s);

;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c);

{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s);

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s);

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s);

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).

;;; Checks whether `slice` [s] has no bits of data.

;;; Checks whether `slice` [s] has no references.

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s);

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b);

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b);

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b);

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell();

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b);

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c);

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";

;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s);

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x);
builder store_coins(builder b, int x);

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c);

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c);

{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
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
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s);

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s);

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s);

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s);

{-
  # Dictionary primitives
-}

;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value);

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value);

cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict();
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.

{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x);
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
;;; Returns the current random seed as an unsigned 256-bit Integer.
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b);
int equal_slices(slice a, slice b);

;;; Concatenates two builders
builder store_builder(builder to, builder from);
```

## 80c12cfeb579d556e38e2c0efa3ccfca98a3f6e169c4e838fa966fafba0a4f3e/contracts/jetton_wallet.fc

```fc
#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/constants.fc";
#include "imports/jetton-utils.fc";
#include "imports/op-codes.fc";
#include "imports/utils.fc";
#pragma version >=0.2.0;

const min_tons_for_storage;
const gas_consumption;

;; Transfers locked until Feb 2, 2025.
const transfer_unlock_time;

int is_address_allowed(slice addr) inline;

(int, slice, slice, cell) load_data() inline;

() save_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) impure inline;

() send_tokens(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure;

() receive_tokens (slice in_msg_body, slice sender_address, int my_ton_balance, int fwd_fee, int msg_value) impure;

() burn_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure;
    ;; NOTE we can not allow fails in action phase since in that case there will be
    ;; no bounce. Thus check and throw in computation phase.
    ;; ignore custom payload
    ;; slice custom_payload = in_msg_body~load_dict();

() on_bounce (slice in_msg_body) impure;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

(int, slice, slice, cell) get_wallet_data() method_id;
```

## 80c12cfeb579d556e38e2c0efa3ccfca98a3f6e169c4e838fa966fafba0a4f3e/imports/constants.fc

```fc
;; operations (constant values taken from crc32 on op message in the companion .tlb files and appear during build)

;; errors

;; other

;; 6905(computational_gas_price) * 1000(cur_gas_price) = 6905000
;; ceil(6905000) = 10000000 ~= 0.01 TON
```

## 80c12cfeb579d556e38e2c0efa3ccfca98a3f6e169c4e838fa966fafba0a4f3e/imports/jetton-utils.fc

```fc
cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

slice calculate_jetton_wallet_address(cell state_init) inline;

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
```

## 80c12cfeb579d556e38e2c0efa3ccfca98a3f6e169c4e838fa966fafba0a4f3e/imports/op-codes.fc

```fc
;; Minter
```

## 80c12cfeb579d556e38e2c0efa3ccfca98a3f6e169c4e838fa966fafba0a4f3e/imports/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;
```

## 80c12cfeb579d556e38e2c0efa3ccfca98a3f6e169c4e838fa966fafba0a4f3e/imports/utils.fc

```fc
() send_grams(slice address, int amount) impure;
```

## 820392b07c5f21c30fee69e888577da46a7513be8941a9446792c0b369900fa6/proxy-wallet.fc

```fc
;; t.me/xJetSwapBot proxy wallet contract by github.com/delpydoc

const op::swap;
const op::upgrade;
const op::transfer_notification;

global slice store::platform_address;;
global cell store::user_id;;

() load_data() impure;

() save_data() impure;

() execute_commands(slice task) impure;

() handle_transaction(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure inline;

() on_upgrade(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure method_id (0x137);

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

;; Get methods
int codebase_version() method_id;
```

## 820392b07c5f21c30fee69e888577da46a7513be8941a9446792c0b369900fa6/stdlib.fc

```fc
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail);

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list);

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list);

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list);

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list);

;;; Creates tuple with zero elements.
tuple empty_tuple();

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value);

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x);

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t);

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y);

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t);

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t);

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t);

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t);

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t);

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p);

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p);

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p);

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p);

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p);

;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null();

;;; Moves a variable [x] to the top of the stack

;;; Returns the current Unix time as an Integer
int now();

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address();

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance();

;;; Returns the logical time of the current transaction.
int cur_lt();

;;; Returns the starting logical time of the current block.
int block_lt();

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c);

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s);

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s);

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key);

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key);

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data();

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y);

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y);

;;; Sorts two integers.
(int, int) minmax(int x, int y);

;;; Computes the absolute value of an integer [x].
int abs(int x);

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}

;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c);

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s);

;;; Preloads the first reference from the slice.
cell preload_ref(slice s);

  {- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s);
(slice, int) load_coins(slice s);

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len);

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len);

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len);

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len);

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s);

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s);

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s);

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s);

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s);

;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c);

{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s);

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s);

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s);

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).

;;; Checks whether `slice` [s] has no bits of data.

;;; Checks whether `slice` [s] has no references.

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s);

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b);

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b);

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b);

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell();

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b);

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c);

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";

;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s);

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x);
builder store_coins(builder b, int x);

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c);

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c);

{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
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
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s);

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s);

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s);

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s);

{-
  # Dictionary primitives
-}

;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value);

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value);

cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict();
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.

{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x);
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
;;; Returns the current random seed as an unsigned 256-bit Integer.
;;; Sets the random seed to unsigned 256-bit seed.
;; () set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b);
int equal_slices(slice a, slice b);

;;; Concatenates two builders
builder store_builder(builder to, builder from);
```

## 82566ad72b6568fe7276437d3b0c911aab65ed701c13601941b2917305e81c11/common/messages.func

```func
const NORMAL;
const PAID_EXTERNALLY;
const IGNORE_ERRORS;

const DESTROY_IF_ZERO;
const CARRY_REMAINING_GAS;
const CARRY_ALL_BALANCE;

() send_empty_message(int amount, slice to, int mode) impure inline_ref;

() send_simple_message(int amount, slice to, cell body, int mode) impure inline_ref;

() send_message_nobounce(int amount, slice to, cell body, int mode) impure inline_ref;

() send_message_with_stateinit(int amount, slice to, cell state_init, cell body, int mode) impure inline_ref;
```

## 82566ad72b6568fe7276437d3b0c911aab65ed701c13601941b2917305e81c11/common/stdlib.func

```func
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

(int) divc (int x, int y);
slice preload_bits_offset(slice s, int offset, int len);

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail);

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list);

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list);

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list);

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list);

;;; Creates tuple with zero elements.
tuple empty_tuple();

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value);

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x);

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t);

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y);

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t);

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t);

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t);

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t);

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t);

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p);

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p);

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p);

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p);

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p);

;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null();

;;; Moves a variable [x] to the top of the stack

;;; Returns the current Unix time as an Integer
int now();

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address();

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance();

;;; Returns the logical time of the current transaction.
int cur_lt();

;;; Returns the starting logical time of the current block.
int block_lt();

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c);

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s);

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s);

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key);

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key);

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data();

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y);

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y);

;;; Sorts two integers.
(int, int) minmax(int x, int y);

;;; Computes the absolute value of an integer [x].
int abs(int x);

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}

;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c);

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s);

;;; Preloads the first reference from the slice.
cell preload_ref(slice s);

  {- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s);
(slice, int) load_coins(slice s);

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len);

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len);

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len);

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len);

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s);

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s);

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s);

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s);

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s);

;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c);

{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s);

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s);

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s);

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).

;;; Checks whether `slice` [s] has no bits of data.

;;; Checks whether `slice` [s] has no references.

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s);

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b);

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b);

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b);

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell();

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b);

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c);

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";

;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s);

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x);
builder store_coins(builder b, int x);

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c);

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c);

{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
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
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s);

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s);

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s);

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s);

{-
  # Dictionary primitives
-}

;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value);

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value);

cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict();
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.

{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x);
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
;;; Returns the current random seed as an unsigned 256-bit Integer.
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b);
int equal_slices(slice a, slice b);

;;; Concatenates two builders
builder store_builder(builder to, builder from);
```

## 82566ad72b6568fe7276437d3b0c911aab65ed701c13601941b2917305e81c11/common/utils1.func

```func
const FWD_GAS;

() send_payload(slice caller, cell payload) impure inline_ref;

(int) get_workchain(slice address) inline;

() force_chain(int workchain, slice address, int error_code) impure inline;
```

## 82566ad72b6568fe7276437d3b0c911aab65ed701c13601941b2917305e81c11/contracts/staking/gas_fn.fc

```fc
cell get_gas_config_param(int wc) inline;

(slice, (int, int)) load_gas_flat_pfx(slice param) inline {

(slice, int) load_gas_prices(slice param) inline;

(slice, (int, int, int)) load_gas_limits_prices(slice param) inline_ref {

(int, int, int) get_gas_limits_prices(int wc) inline;

int get_gas_fee(int gas_amount, int wc) inline_ref;
```

## 82566ad72b6568fe7276437d3b0c911aab65ed701c13601941b2917305e81c11/pool/amm.func

```func
(int, int, int) get_amount_out(int has_ref, int amount_in, int reserve_in, int reserve_out) inline;

() _mint_lp(int query_id, slice to, int amount) impure inline;
```

## 82566ad72b6568fe7276437d3b0c911aab65ed701c13601941b2917305e81c11/pool/errors.func

```func
const NO_LIQUIDITY;
const ZERO_OUTPUT;
const INVALID_CALLER;
const INSUFFICIENT_GAS;
const FEE_OUT_RANGE;
const INVALID_TOKEN;
const LOW_AMOUNT;
const LOW_LIQUIDITY;
const WRONG_K;
const MATH_ERROR;
const INVALID_RECIPIENT;

const WRONG_OP;
```

## 82566ad72b6568fe7276437d3b0c911aab65ed701c13601941b2917305e81c11/pool/get.func

```func
;; get methods
(int, int, slice, slice, int, int, int, slice, int, int) get_pool_data() method_id;

(int, int, int) get_expected_outputs(int amount, slice token_wallet) method_id;

;; estimate expected lp tokens minted when providing liquidity
(int) get_expected_tokens(int amount0, int amount1) method_id;

(int, int) get_expected_liquidity(int jetton_amount) method_id;

slice get_lp_account_address(slice owner_address) method_id;

;; standard jetton 'get' methods 
(int, int, slice, cell, cell) get_jetton_data() method_id;

slice get_wallet_address(slice owner_address) method_id;
```

## 82566ad72b6568fe7276437d3b0c911aab65ed701c13601941b2917305e81c11/pool/getter.func

```func
;; handle onchain 'get' calls

(int) handle_getter_messages(int msg_value, int fwd_fee, int op, int query_id, slice sender_address, slice in_msg_body) impure inline;

        ;; Reference implementation:
        ;; https://github.com/ton-blockchain/token-contract/blob/920c5aa3a33ede6405b5653147895c9e27bfe535/ft/jetton-minter-discoverable.fc#L100
```

## 82566ad72b6568fe7276437d3b0c911aab65ed701c13601941b2917305e81c11/pool/jetton-utils.func

```func
cell pack_jetton_lp_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

cell calculate_jetton_lp_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

slice calculate_jetton_lp_wallet_address(cell state_init) inline;

slice calculate_user_jetton_lp_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
```

## 82566ad72b6568fe7276437d3b0c911aab65ed701c13601941b2917305e81c11/pool/lp_account-utils.func

```func
cell pack_lp_account_data(slice user_address, slice pool_address, int amount0, int amount1) inline;

cell calculate_lp_account_state_init(slice user_address, slice pool_address, cell lp_account_code) inline;

slice calculate_lp_account_address(cell state_init) inline;

slice calculate_user_lp_account_address(slice user_address, slice pool_address, cell lp_account_code) inline;
```

## 82566ad72b6568fe7276437d3b0c911aab65ed701c13601941b2917305e81c11/pool/op.func

```func
const transfer;
const transfer_notification;
const internal_transfer;
const excesses;
const burn;
const burn_notification;

const provide_wallet_address;
const take_wallet_address;

const swap;
const provide_lp;
const pay_to;

;; swap callbacks opcodes
const swap_refund_no_liq;
const swap_refund_reserve_err;

const swap_ok_ref;
const swap_ok;
const burn_ok;
const refund_ok;

const collect_fees;
const set_fees;
const reset_gas;
const add_liquidity;
const cb_add_liquidity;
const cb_refund_me;

;; async "get" calls
const getter_pool_data;
const getter_expected_outputs;
const getter_lp_account_address;
const getter_expected_tokens;
const getter_expected_liquidity;
```

## 82566ad72b6568fe7276437d3b0c911aab65ed701c13601941b2917305e81c11/pool/params.func

```func
const WORKCHAIN;

const REQUIRED_TON_RESERVE;
const REQUIRED_FEES_MINT;
const REQUIRED_MIN_LIQUIDITY;
const REQUIRED_MIN_COLLECT_FEES;
;; according to https://ton.org/docs/#/smart-contracts/tvm-instructions/instructions, coins are in the range 0...2^120 - 1
const MAX_COINS;
const PROVIDE_ADD_GAS_CONSUMPTION;
const FEE_DIVIDER;
const MIN_FEE;
const MAX_FEE;

const HOLE_ADDRESS;
slice addr_none();
const URI_BASE;
const URI_END;
```

## 82566ad72b6568fe7276437d3b0c911aab65ed701c13601941b2917305e81c11/pool/router-calls.func

```func
() handle_router_messages(int op, int query_id, int my_balance, int msg_value, slice in_msg_body) impure inline;

        ;; refund if not enough liquidity or not enough output or output less than min_out

            ;; swap token0 for token1

            ;; refund if not enough balance or exceed max balance

            ;; swap token1 for token0

            ;; refund if not enough balance or exceed max balance

        ;; ruote to lp_account
```

## 82566ad72b6568fe7276437d3b0c911aab65ed701c13601941b2917305e81c11/pool/storage.func

```func
global slice storage::router_address;;
global int storage::lp_fee;;
global int storage::protocol_fee;;
global int storage::ref_fee;;
global slice storage::token0_address;;
global slice storage::token1_address;;
global int storage::total_supply_lp;;
global int storage::collected_token0_protocol_fee;;
global int storage::collected_token1_protocol_fee;;
global slice storage::protocol_fee_address;;
global int storage::reserve0;;
global int storage::reserve1;;
global cell storage::jetton_lp_wallet_code;;
global cell storage::lp_account_code;;

() load_storage() impure inline;

() save_storage() impure inline;
```

## 82566ad72b6568fe7276437d3b0c911aab65ed701c13601941b2917305e81c11/pool/utils1.func

```func
int sqrt(int x) inline;

() call_pay_to(int amount, int mode, int query_id, slice to_address, int exit_code, int amount0_out, int amount1_out) impure inline_ref;

slice address_to_hex_string(int value) inline;
```

## 82566ad72b6568fe7276437d3b0c911aab65ed701c13601941b2917305e81c11/pool.func

```func
#pragma version >=0.2.0;

#include "common/stdlib.func";
#include "common/gas.func";
#include "common/messages.func";
#include "pool/op.func";
#include "pool/params.func";
#include "pool/errors.func";
#include "common/utils.func";
#include "pool/storage.func";
#include "pool/utils1.func";
#include "pool/jetton-utils.func";
#include "pool/lp_account-utils.func";
#include "pool/amm.func"; 
#include "pool/get.func"; 
#include "pool/router-calls.func"; 
#include "pool/getter.func"; 

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

    ;; Sent by LP wallet after burning LP jettons to release liquidity

    ;; get shares

    ;; both are positive

    ;; Sent by user's lp_account after adding liquidity
    ;; not throwable

      ;; handle initial liquidity

    ;; checks if
    ;; - the user will get less than the minimum amount of liquidity
    ;; - reserves exceeds max supply
      ;; state_init needed since lp_account might be already destroyed

    ;; Sent by user's lp_account after adding liquidity
    ;; throwable

  ;; handle swap, provide_lp and governance messages

  ;; called by anyone

  ;; make sure that the message has a valid opcode
```

## 8278f4c5233de6fbedc969af519344a7a9bffc544856dba986a95c0bcf8571c9/imports/stdlib.fc

```fc
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail);
forall X -> (X, tuple) uncons(tuple list);
forall X -> (tuple, X) list_next(tuple list);
forall X -> X car(tuple list);
tuple cdr(tuple list);
tuple empty_tuple();
forall X -> tuple tpush(tuple t, X value);
forall X -> [X] single(X x);
forall X -> X unsingle([X] t);
forall X, Y -> [X, Y] pair(X x, Y y);
forall X, Y -> (X, Y) unpair([X, Y] t);
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);
forall X -> X first(tuple t);
forall X -> X second(tuple t);
forall X -> X third(tuple t);
forall X -> X fourth(tuple t);
forall X, Y -> X pair_first([X, Y] p);
forall X, Y -> Y pair_second([X, Y] p);
forall X, Y, Z -> X triple_first([X, Y, Z] p);
forall X, Y, Z -> Y triple_second([X, Y, Z] p);
forall X, Y, Z -> Z triple_third([X, Y, Z] p);
forall X -> X null();

int now();
slice my_address();
[int, cell] get_balance();
int cur_lt();
int block_lt();

int cell_hash(cell c);
int slice_hash(slice s);
int string_hash(slice s);

int check_signature(int hash, slice signature, int public_key);
int check_data_signature(slice data, slice signature, int public_key);

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data();
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y);
int max(int x, int y);
(int, int) minmax(int x, int y);
int abs(int x);

slice begin_parse(cell c);
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s);
cell preload_ref(slice s);
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s);
slice skip_bits(slice s, int len);
slice first_bits(slice s, int len);
slice skip_last_bits(slice s, int len);
slice slice_last(slice s, int len);
(slice, cell) load_dict(slice s);
cell preload_dict(slice s);
slice skip_dict(slice s);

(slice, cell) load_maybe_ref(slice s);
cell preload_maybe_ref(slice s);
builder store_maybe_ref(builder b, cell c);

int cell_depth(cell c);

int slice_refs(slice s);
int slice_bits(slice s);
(int, int) slice_bits_refs(slice s);
int slice_depth(slice s);

int builder_refs(builder b);
int builder_bits(builder b);
int builder_depth(builder b);

builder begin_cell();
cell end_cell(builder b);
builder store_ref(builder b, cell c);
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s);
builder store_grams(builder b, int x);
builder store_dict(builder b, cell c);

(slice, slice) load_msg_addr(slice s);
tuple parse_addr(slice s);
(int, int) parse_std_addr(slice s);
(int, slice) parse_var_addr(slice s);

cell idict_set_ref(cell dict, int key_len, int index, cell value);
cell udict_set_ref(cell dict, int key_len, int index, cell value);
cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);
cell new_dict();

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x);

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x);
(slice, int) load_coins(slice s);

int equal_slices (slice a, slice b);
builder store_builder(builder to, builder from);
```

## 8278f4c5233de6fbedc969af519344a7a9bffc544856dba986a95c0bcf8571c9/nft-fixprice-sale-v2.fc

```fc
;; NFT sale smart contract v2

int min_gas_amount();

_ load_data() inline;

_ load_fees(cell fees_cell) inline;

() save_data(int is_complete, int created_at, slice marketplace_address, slice nft_address, slice nft_owner_address, int full_price, cell fees_cell) impure inline;

() send_money(slice address, int amount) impure inline;

() buy(var args) impure;

    ;; Owner message

    ;; Royalty message

    ;; Marketplace fee message

    ;; Set sale as complete

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

    ;; Throw if sale is complete

() recv_external(slice in_msg) impure;

(int, int, int, slice, slice, slice, int, slice, int, slice, int) get_sale_data() method_id;
```

## 8278f4c5233de6fbedc969af519344a7a9bffc544856dba986a95c0bcf8571c9/op-codes.fc

```fc
;; NFTEditable

;; SBT
```

## 829fabbd9ca8e05fab9ca40d8e0beaf368de3820a6aded9b776692589c4b0008/contract/contracts/sample_jetton.tact

```tact
import "@stdlib/ownable";

message Mint {
    amount: Int;
    receiver: Address;
}

message MintPublic {
    amount: Int;
}

contract SampleJetton with Jetton {
    totalSupply: Int as coins;
    owner: Address;
    content: Cell;
    mintable: Bool;
    max_supply: Int as coins;
    init(owner: Address, content: Cell, max_supply: Int);
    receive(msg: Mint);
    require(ctx.sender == self.owner, "Not Owner");;
    require(self.mintable, "Can't Mint Anymore");;
    receive(msg: MintPublic);
    require(self.mintable, "Can't Mint Anymore");;
    receive("Owner: MintClose");
    require(ctx.sender == self.owner, "Not Owner");;
}

struct JettonData {
    totalSupply: Int;
    mintable: Bool;
    owner: Address;
    content: Cell;
    walletCode: Cell;
}

// ============================================================================================================ //
@interface("org.ton.jetton.master")
trait Jetton with Ownable {

totalSupply: Int; // Already set initially
mintable: Bool;
owner: Address;
content: Cell;

max_supply: Int; // This is not in the TEP-74 interface

receive(msg: TokenUpdateContent);

receive(msg: TokenBurnNotification);

// @to The Address receive the Jetton token after minting
// @amount The amount of Jetton token being minted
// @response_destination The previous owner address
fun mint(to: Address, amount: Int, response_destination: Address);

fun requireWallet(owner: Address);

virtual fun getJettonWalletInit(address: Address): StateInit {
}

// ====== Get Methods ====== //
get fun get_jetton_data(): JettonData {
totalSupply: self.totalSupply,
mintable: self.mintable,
owner: self.owner,
content: self.content,
walletCode: code
};
}

get fun get_wallet_address(owner: Address): Address {
}
}
// ============================================================ //
@interface("org.ton.jetton.wallet")
contract JettonDefaultWallet {
    balance: Int;
    owner: Address;
    master: Address;
    init(master: Address, owner: Address);
    receive(msg: TokenTransfer);
    require(ctx.sender == self.owner, "Invalid sender");;
    require(ctx.value > min(final, ton("0.01")), "Invalid value!!");;
    require(self.balance >= 0, "Invalid balance");;
    to: walletAddress,;
    value: 0,;
    mode: SendRemainingValue,;
    bounce: false,;
    body: TokenTransferInternal{;
    queryId: msg.queryId,;
    amount: msg.amount,;
    from: self.owner,;
    response_destination: msg.response_destination,;
    forward_ton_amount: msg.forward_ton_amount,;
    forward_payload: msg.forward_payload;
    code: init.code,;
    data: init.data;
    receive(msg: TokenTransferInternal);
    if (ctx.sender != self.master);
    require(contractAddress(sinit) == ctx.sender, "Invalid sender!");;
    require(self.balance >= 0, "Invalid balance");;
    if (msg.forward_ton_amount > 0);
    to: self.owner,;
    value: msg.forward_ton_amount,;
    mode: SendPayGasSeparately + SendIgnoreErrors,;
    bounce: false,;
    body: TokenNotification {;
    queryId: msg.queryId,;
    amount: msg.amount,;
    from: msg.from,;
    forward_payload: msg.forward_payload;
    if (msg.response_destination != null);
    to: msg.response_destination,;
    value: msgValue,;
    bounce: false,;
    body: TokenExcesses {;
    queryId: msg.queryId;
    mode: SendIgnoreErrors;
    receive(msg: TokenBurn);
    require(ctx.sender == self.owner, "Invalid sender");  // Check sender;
    require(self.balance >= 0, "Invalid balance");;
    require(ctx.value > fwdFee + 2 * self.gasConsumption + self.minTonsForStorage, "Invalid value - Burn");;
    to: self.master,;
    value: 0,;
    mode: SendRemainingValue,;
    bounce: true,;
    body: TokenBurnNotification{;
    queryId: msg.queryId,;
    amount: msg.amount,;
    owner: self.owner,;
    response_destination: self.owner;
    get fun msgValue(value: Int): Int;
    bounced(src: bounced<TokenTransferInternal>);
    bounced(src: bounced<TokenBurnNotification>);
    get fun get_wallet_data(): JettonWalletData;
    balance: self.balance,;
    owner: self.owner,;
    master: self.master,;
    walletCode: (initOf JettonDefaultWallet(self.master, self.owner)).code;
}

struct JettonWalletData {
    balance: Int;
    owner: Address;
    master: Address;
    walletCode: Cell;
}

message(0xf8a7ea5) TokenTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    response_destination: Address;
    custom_payload: Cell?;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining;
}

message(0x178d4519) TokenTransferInternal {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    response_destination: Address;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining;
}

message(0x7362d09c) TokenNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    forward_payload: Slice as remaining;
}

message(0x595f07bc) TokenBurn {
    queryId: Int as uint64;
    amount: Int as coins;
    owner: Address;
    response_destination: Address;
}

message(0x7bdd97de) TokenBurnNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    owner: Address;
    response_destination: Address?;
}

message(0xd53276db) TokenExcesses {
    queryId: Int as uint64;
}

message TokenUpdateContent {
    content: Cell;
}
```

## 82a82800c0c330167026dd27d6b78c016a7fbbe0529e370fe39a1e4663155964/contract/contracts/contract.tact

```tact
import "@stdlib/ownable";
import "./messages";
import "./jetton";

contract FeeJetton with Jetton {
    total_supply: Int as coins;
    mintable: Bool;
    owner: Address;
    content: Cell;
    init(owner: Address, content: Cell);
    receive(msg: Mint);
    require(ctx.sender == self.owner, "Not owner");;
    require(self.mintable, "Not mintable");;
    receive("Owner: MintClose");
    require(ctx.sender == self.owner, "Not owner");;
}

@interface("org.ton.ownable.transferable.v2")
trait Jetton with OwnableTransferable {
total_supply: Int;
mintable: Bool;
owner: Address;
content: Cell;

receive(msg: TokenBurnNotification);

receive(msg: ProvideWalletAddress);

fun mint(to: Address, amount: Int, response_destination: Address);

fun requireSenderAsWalletOwner(owner: Address);

virtual fun getJettonWalletInit(address: Address): StateInit {
}

get fun get_jetton_data(): JettonData {
total_supply: self.total_supply,
mintable: self.mintable,
owner: self.owner,
content: self.content,
wallet_code: initOf JettonDefaultWallet(self.owner, myAddress()).code
};
}

get fun get_wallet_address(owner: Address): Address {
}
}
```

## 82a82800c0c330167026dd27d6b78c016a7fbbe0529e370fe39a1e4663155964/contract/contracts/jetton.tact

```tact
import "./messages";

@interface("org.ton.jetton.wallet")
contract JettonDefaultWallet {
    balance: Int as coins;
    owner: Address;
    master: Address;
    is_dex_vault: Bool;
    init(owner: Address, master: Address);
    receive(msg: TokenTransfer);
    require(ctx.sender == self.owner, "Invalid sender");;
    require(ctx.value > final, "Invalid value");;
    require(self.balance >= 0, "Invalid balance");;
    if (!msg.forward_payload.empty() && msg.forward_payload.refs() >= 1);
    if (fwdSlice.bits() >= 32 && fwdSlice.loadUint(32) == 0xe3a0d482);
    if (with_fee);
    if (msg.forward_ton_amount < 0);
    to: wallet_address,;
    value: ctx.value - ton("0.03"),;
    mode: 0,;
    bounce: false,;
    body: TokenTransferInternal{;
    query_id: msg.query_id,;
    amount: msg.amount,;
    from: self.owner,;
    response_destination: msg.response_destination,;
    forward_ton_amount: msg.forward_ton_amount,;
    forward_payload: msg.forward_payload;
    code: init.code,;
    data: init.data;
    to: fee_wallet_address,;
    value: ton_for_fee,;
    mode: 0,;
    bounce: false,;
    body: TokenTransferInternal{;
    query_id: 888,;
    amount: calculated_fee,;
    from: self.owner,;
    response_destination: msg.response_destination,;
    forward_ton_amount: 0,;
    forward_payload: emptySlice();
    to: wallet_address,;
    value: 0,;
    mode: SendRemainingValue,;
    bounce: false,;
    body: TokenTransferInternal{;
    query_id: msg.query_id,;
    amount: msg.amount,;
    from: self.owner,;
    response_destination: msg.response_destination,;
    forward_ton_amount: msg.forward_ton_amount,;
    forward_payload: msg.forward_payload;
    code: init.code,;
    data: init.data;
    receive(msg: TokenTransferInternal);
    if (ctx.sender != self.master);
    require(contractAddress(sinit) == ctx.sender, "Invalid sender!");;
    require(self.balance >= 0, "Invalid balance");;
    if (msg.forward_ton_amount > 0);
    if (!self.is_dex_vault && msg.forward_payload.refs() >= 1);
    if (fwdSlice.bits() >= 32 && fwdSlice.loadUint(32) == 0x40e108d6);
    to: self.owner,;
    value: msg.forward_ton_amount,;
    mode: SendPayGasSeparately,;
    bounce: false,;
    body: TokenNotification {;
    query_id: msg.query_id,;
    amount: msg.amount,;
    from: msg.from,;
    forward_payload: msg.forward_payload;
    if (msg.response_destination != null && msg_value > 0);
    to: msg.response_destination!!,;
    value: msg_value,;
    bounce: false,;
    body: TokenExcesses { query_id: msg.query_id }.toCell(),;
    mode: SendPayGasSeparately;
    receive(msg: TokenBurn);
    require(ctx.sender == self.owner, "Invalid sender");;
    require(self.balance >= 0, "Invalid balance");;
    require(ctx.value > fwd_fee + 2 * self.gasConsumption + self.minTonsForStorage, "Invalid value - Burn");;
    to: self.master,;
    value: 0,;
    mode: SendRemainingValue,;
    bounce: true,;
    body: TokenBurnNotification {;
    query_id: msg.query_id,;
    amount: msg.amount,;
    sender: self.owner,;
    response_destination: msg.response_destination!!,;
    send_excess: true;
    fun msg_value(value: Int): Int;
    bounced(msg: bounced<TokenTransferInternal>);
    bounced(msg: bounced<TokenBurnNotification>);
    get fun get_wallet_data(): JettonWalletData;
    balance: self.balance,;
    owner: self.owner,;
    master: self.master,;
    code: (initOf JettonDefaultWallet(self.owner, self.master)).code;
    get fun is_dexvault(): Bool;
}
```

## 82a82800c0c330167026dd27d6b78c016a7fbbe0529e370fe39a1e4663155964/contract/contracts/messages.tact

```tact
struct JettonData {
    total_supply: Int;
    mintable: Bool;
    owner: Address;
    content: Cell;
    wallet_code: Cell;
}

struct JettonWalletData {
    balance: Int;
    owner: Address;
    master: Address;
    code: Cell;
}

message(0xf8a7ea5) TokenTransfer {
    query_id: Int as uint64;
    amount: Int as coins;
    destination: Address;
    response_destination: Address?;
    custom_payload: Cell?;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining;
}

message(0x178d4519) TokenTransferInternal {
    query_id: Int as uint64;
    amount: Int as coins;
    from: Address;
    response_destination: Address?;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining;
}

message(0x7362d09c) TokenNotification {
    query_id: Int as uint64;
    amount: Int as coins;
    from: Address;
    forward_payload: Slice as remaining;
}

message(0x595f07bc) TokenBurn {
    query_id: Int as uint64;
    amount: Int as coins;
    response_destination: Address?;
    custom_payload: Cell?;
}

message(0x7bdd97de) TokenBurnNotification {
    query_id: Int as uint64;
    amount: Int as coins;
    sender: Address;
    response_destination: Address?;
    send_excess: Bool;
}

message(0xd53276db) TokenExcesses {
    query_id: Int as uint64;
}

message(0x2c76b973) ProvideWalletAddress {
    query_id: Int as uint64;
    owner_address: Address;
    include_address: Bool;
}

message(0xd1735400) TakeWalletAddress {
    query_id: Int as uint64;
    wallet_address: Address;
    owner_address: Slice as remaining;
}

message Mint {
    amount: Int;
    receiver: Address;
}
```

## 82d0cbb2c28375979678d6eb6897c96b68329fb31ea56f97b01fae7237d01fca/skip.fc

```fc
() recv_internal (cell in_msg_full, slice in_msg_body) impure;
```

## 82d0cbb2c28375979678d6eb6897c96b68329fb31ea56f97b01fae7237d01fca/stdlib.fc

```fc
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail);

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list);

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list);

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list);

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list);

;;; Creates tuple with zero elements.
tuple empty_tuple();

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value);

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x);

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t);

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y);

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t);

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t);

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t);

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t);

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t);

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p);

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p);

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p);

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p);

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p);

;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null();

;;; Moves a variable [x] to the top of the stack

;;; Returns the current Unix time as an Integer
int now();

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address();

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance();

;;; Returns the logical time of the current transaction.
int cur_lt();

;;; Returns the starting logical time of the current block.
int block_lt();

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c);

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s);

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s);

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key);

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key);

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data();

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y);

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y);

;;; Sorts two integers.
(int, int) minmax(int x, int y);

;;; Computes the absolute value of an integer [x].
int abs(int x);

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}

;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c);

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s);

;;; Preloads the first reference from the slice.
cell preload_ref(slice s);

  {- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s);
(slice, int) load_coins(slice s);

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len);

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len);

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len);

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len);

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s);

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s);

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s);

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s);

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s);

;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c);

{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s);

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s);

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s);

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).

;;; Checks whether `slice` [s] has no bits of data.

;;; Checks whether `slice` [s] has no references.

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s);

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b);

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b);

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b);

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell();

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b);

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c);

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";

;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s);

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x);
builder store_coins(builder b, int x);

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c);

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c);

{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
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
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s);

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s);

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s);

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s);

{-
  # Dictionary primitives
-}

;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value);

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value);

cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict();
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.

{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x);
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
;;; Returns the current random seed as an unsigned 256-bit Integer.
;;; Sets the random seed to unsigned 256-bit seed.
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits (slice a, slice b);

;;; Concatenates two builders
builder store_builder(builder to, builder from);
```

## 84d0ae717efd23eecceb3a565e25fc5fb2e066f03bcf3672a7dd69aefa389db2/contracts/gas.fc

```fc
#include "workchain.fc";

const ONE_TON;

const MIN_STORAGE_DURATION;

;;# Precompiled constants
;;
;;All of the contents are result of contract emulation tests
;;

;;## Minimal fees
;;
;;- Transfer [/sandbox_tests/JettonWallet.spec.ts#L935](L935) `0.028627415` TON
;;- Burn [/sandbox_tests/JettonWallet.spec.ts#L1185](L1185) `0.016492002` TON

;;## Storage
;;
;;Get calculated in a separate test file [/sandbox_tests/StateInit.spec.ts](StateInit.spec.ts)

;;- `JETTON_WALLET_BITS` [/sandbox_tests/StateInit.spec.ts#L92](L92)
const JETTON_WALLET_BITS;

;;- `JETTON_WALLET_CELLS`: [/sandbox_tests/StateInit.spec.ts#L92](L92)
const JETTON_WALLET_CELLS;

;; difference in JETTON_WALLET_BITS/JETTON_WALLET_INITSTATE_BITS is difference in
;; StateInit and AccountStorage (https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)
;; we count bits as if balances are max possible
;;- `JETTON_WALLET_INITSTATE_BITS` [/sandbox_tests/StateInit.spec.ts#L95](L95)
const JETTON_WALLET_INITSTATE_BITS;
;;- `JETTON_WALLET_INITSTATE_CELLS` [/sandbox_tests/StateInit.spec.ts#L95](L95)
const JETTON_WALLET_INITSTATE_CELLS;

;; jetton-wallet.fc#L163 - maunal bits counting
const BURN_NOTIFICATION_BITS;
const BURN_NOTIFICATION_CELLS;

;;## Gas
;;
;;Gas constants are calculated in the main test suite.
;;First the related transaction is found, and then it's
;;resulting gas consumption is printed to the console.

;;- `SEND_TRANSFER_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L753](L753)
const SEND_TRANSFER_GAS_CONSUMPTION;

;;- `RECEIVE_TRANSFER_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L762](L762)
const RECEIVE_TRANSFER_GAS_CONSUMPTION;

;;- `SEND_BURN_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L1032](L1032)
const SEND_BURN_GAS_CONSUMPTION;

;;- `RECEIVE_BURN_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L1033](L1033)
const RECEIVE_BURN_GAS_CONSUMPTION;

int calculate_jetton_wallet_min_storage_fee() inline;

int forward_init_state_overhead() inline;

() check_amount_is_enough_to_transfer(int msg_value, int forward_ton_amount, int fwd_fee) impure inline;

    ;; 3 messages: wal1->wal2,  wal2->owner, wal2->response
    ;; but last one is optional (it is ok if it fails)

() check_amount_is_enough_to_burn(int msg_value) impure inline;
```

## 84d0ae717efd23eecceb3a565e25fc5fb2e066f03bcf3672a7dd69aefa389db2/contracts/imports/stdlib_modern.fc

```fc
;; Standard library for funC
;;

{-
    This file is part of TON FunC Standard Library.

    FunC Standard Library is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.

    FunC Standard Library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

-}

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail);

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list);

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list);

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list);

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list);

;;; Creates tuple with zero elements.
tuple empty_tuple();

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value);

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x);

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t);

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y);

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t);

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t);

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t);

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t);

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t);

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p);

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p);

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p);

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p);

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p);

;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null();

;;; Moves a variable [x] to the top of the stack

;;; Returns the current Unix time as an Integer
int now();

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address();

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance();

;;; Returns the logical time of the current transaction.
int cur_lt();

;;; Returns the starting logical time of the current block.
int block_lt();

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c);

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s);

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s);

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key);

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key);

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data();

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
;;() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y);

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y);

;;; Sorts two integers.
(int, int) minmax(int x, int y);

;;; Computes the absolute value of an integer [x].
int abs(int x);

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}

;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c);

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s);

;;; Preloads the first reference from the slice.
cell preload_ref(slice s);

{- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s);
(slice, int) load_coins(slice s);

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len);

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len);

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len);

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len);

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s);

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s);

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s);

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s);

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s);

;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c);

{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s);

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s);

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s);

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).

;;; Checks whether `slice` [s] has no bits of data.

;;; Checks whether `slice` [s] has no references.

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s);

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b);

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b);

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b);

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell();

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b);

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c);

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";

;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s);

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x);
builder store_coins(builder b, int x);

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c);

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c);

{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
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
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s);

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s);

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s);

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s);

{-
  # Dictionary primitives
-}

;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value);

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value);

cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict();
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.

{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x);
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
;;; Returns the current random seed as an unsigned 256-bit Integer.
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slices_bits(slice a, slice b);
;;; Checks whether b is a null. Note, that FunC also has polymorphic null? built-in.
;;; Concatenates two builders
builder store_builder(builder to, builder from);

;; CUSTOM:

;; TVM UPGRADE 2023-07 https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07
;; In mainnet since 20 Dec 2023 https://t.me/tonblockchain/226

;;; Retrieves code of smart-contract from c7
cell my_code();

;;; Creates an output action and returns a fee for creating a message. Mode has the same effect as in the case of SENDRAWMSG

int gas_consumed();

;; TVM V6 https://github.com/ton-blockchain/ton/blob/testnet/doc/GlobalVersions.md#version-6

int get_compute_fee(int workchain, int gas_used);
int get_storage_fee(int workchain, int seconds, int bits, int cells);
int get_forward_fee(int workchain, int bits, int cells);
int get_precompiled_gas_consumption();

int get_simple_compute_fee(int workchain, int gas_used);
int get_simple_forward_fee(int workchain, int bits, int cells);
int get_original_fwd_fee(int workchain, int fwd_fee);
int my_storage_due();

tuple get_fee_cofigs();

;; BASIC

const int TRUE;
const int FALSE;

const int MASTERCHAIN;
const int BASECHAIN;

;;; skip (Maybe ^Cell) from `slice` [s].

(slice, int) ~load_bool(slice s) inline;

builder store_bool(builder b, int value) inline;

;; ADDRESS NONE
;; addr_none$00 = MsgAddressExt; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L100

builder store_address_none(builder b) inline;

slice address_none();

int is_address_none(slice s) inline;

;; MESSAGE

;; The message header info is organized as follows:

;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L126
;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
;; src:MsgAddressInt dest:MsgAddressInt
;; value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
;; created_lt:uint64 created_at:uint32 = CommonMsgInfo;

;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L135
;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
;; src:MsgAddress dest:MsgAddressInt
;; value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
;; created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;

;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L123C1-L124C33
;; currencies$_ grams:Grams other:ExtraCurrencyCollection = CurrencyCollection;

;; MSG FLAGS

const int BOUNCEABLE;
const int NON_BOUNCEABLE;

;; store msg_flags and address none
builder store_msg_flags_and_address_none(builder b, int msg_flags) inline;

;; load msg_flags only
(slice, int) ~load_msg_flags(slice s) inline;
;;; @param `msg_flags` - 4-bit
int is_bounced(int msg_flags) inline;

;; after `grams:Grams` we have (1 + 4 + 4 + 64 + 32) zeroes - zeroed extracurrency, ihr_fee, fwd_fee, created_lt and created_at
const int MSG_INFO_REST_BITS;

;; MSG

;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L155
;; message$_ {X:Type} info:CommonMsgInfo
;;  init:Maybe (Either StateInit ^StateInit)
;;  body:(Either X ^X) = Message X;
;;
;;message$_ {X:Type} info:CommonMsgInfoRelaxed
;;  init:(Maybe (Either StateInit ^StateInit))
;;  body:(Either X ^X) = MessageRelaxed X;
;;
;;_ (Message Any) = MessageAny;

;; if have StateInit (always place StateInit in ref):
;; 0b11 for `Maybe (Either StateInit ^StateInit)` and 0b1 or 0b0 for `body:(Either X ^X)`

const int MSG_WITH_STATE_INIT_AND_BODY_SIZE;
const int MSG_HAVE_STATE_INIT;
const int MSG_STATE_INIT_IN_REF;
const int MSG_BODY_IN_REF;

;; if no StateInit:
;; 0b0 for `Maybe (Either StateInit ^StateInit)` and 0b1 or 0b0 for `body:(Either X ^X)`

const int MSG_ONLY_BODY_SIZE;

builder store_statinit_ref_and_body_ref(builder b, cell state_init, cell body) inline;

builder store_only_body_ref(builder b, cell body) inline;

builder store_prefix_only_body(builder b) inline;

;; parse after sender_address
(slice, int) ~retrieve_fwd_fee(slice in_msg_full_slice) inline;

;; MSG BODY

;; According to the guideline, it is recommended to start the body of the internal message with uint32 op and uint64 query_id

const int MSG_OP_SIZE;
const int MSG_QUERY_ID_SIZE;

(slice, int) ~load_op(slice s) inline;
builder store_op(builder b, int op) inline;

(slice, int) ~load_query_id(slice s) inline;
builder store_query_id(builder b, int query_id) inline;

;; SEND MODES - https://docs.ton.org/tvm.pdf page 137, SENDRAWMSG

;; For `send_raw_message` and `send_message`:

;;; x = 0 is used for ordinary messages; the gas fees are deducted from the senging amount; action phaes should NOT be ignored.
const int SEND_MODE_REGULAR;
;;; +1 means that the sender wants to pay transfer fees separately.
const int SEND_MODE_PAY_FEES_SEPARATELY;
;;; + 2 means that any errors arising while processing this message during the action phase should be ignored.
const int SEND_MODE_IGNORE_ERRORS;
;;; + 32 means that the current account must be destroyed if its resulting balance is zero.
const int SEND_MODE_DESTROY;
;;; x = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message.
const int SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE;
;;; x = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message).
const int SEND_MODE_CARRY_ALL_BALANCE;
;;; in the case of action fail - bounce transaction. No effect if SEND_MODE_IGNORE_ERRORS (+2) is used. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int SEND_MODE_BOUNCE_ON_ACTION_FAIL;

;; Only for `send_message`:

;;; do not create an action, only estimate fee. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int SEND_MODE_ESTIMATE_FEE_ONLY;

;; Other modes affect the fee calculation as follows:
;; +64 substitutes the entire balance of the incoming message as an outcoming value (slightly inaccurate, gas expenses that cannot be estimated before the computation is completed are not taken into account).
;; +128 substitutes the value of the entire balance of the contract before the start of the computation phase (slightly inaccurate, since gas expenses that cannot be estimated before the completion of the computation phase are not taken into account).

;; RESERVE MODES - https://docs.ton.org/tvm.pdf page 137, RAWRESERVE

;;; Creates an output action which would reserve exactly x nanograms (if y = 0).
const int RESERVE_REGULAR;
;;; Creates an output action which would reserve at most x nanograms (if y = 2).
;;; Bit +2 in y means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved.
const int RESERVE_AT_MOST;
;;; in the case of action fail - bounce transaction. No effect if RESERVE_AT_MOST (+2) is used. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int RESERVE_BOUNCE_ON_ACTION_FAIL;

;; TOKEN METADATA
;; https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md

;; Key is sha256 hash of string. Value is data encoded as described in "Data serialization" paragraph.
;; Snake format - must be prefixed with 0x00 byte

;; On-chain content layout The first byte is 0x00 and the rest is key/value dictionary.
cell create_token_onchain_metadata(cell content_dict) inline;
```

## 84d0ae717efd23eecceb3a565e25fc5fb2e066f03bcf3672a7dd69aefa389db2/contracts/jetton-minter.fc

```fc
;; Jetton minter smart contract

#pragma version >=0.4.3;

#include "stdlib.fc";
#include "op-codes.fc";
#include "workchain.fc";
#include "jetton-utils.fc";
#include "gas.fc";

global int merkle_root;;
;; storage#_ total_supply:Coins admin_address:MsgAddress next_admin_address:MsgAddress jetton_wallet_code:^Cell metadata_uri:^Cell = Storage;
(int, slice, slice, cell, cell) load_data() impure inline;

() save_data(int total_supply, slice admin_address, slice next_admin_address, cell jetton_wallet_code, cell metadata_uri) impure inline;

() send_to_jetton_wallet(slice to_address, cell jetton_wallet_code, int ton_amount, cell master_msg, int need_state_init) impure inline;

    ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733

() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure;

        ;; process only mint bounces

        ;; see internal_transfer TL-B layout in jetton.tlb

        ;; a little more than needed, it’s ok since it’s sent by the admin and excesses will return back

        ;; see burn_notification TL-B layout in jetton.tlb

            ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733

        ;; see provide_wallet_address TL-B layout in jetton.tlb

        ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733

cell build_content_cell(slice metadata_uri) inline;

(int, int, slice, cell, cell) get_jetton_data() method_id;

slice get_wallet_address(slice owner_address) method_id;

(cell, int) get_wallet_state_init_and_salt(slice owner_address) method_id;

slice get_next_admin_address() method_id;

int get_mintless_airdrop_hashmap_root() method_id;
```

## 84d0ae717efd23eecceb3a565e25fc5fb2e066f03bcf3672a7dd69aefa389db2/contracts/jetton-utils.fc

```fc
#include "stdlib.fc";
#include "workchain.fc";

const int STATUS_SIZE;
const int MERKLE_ROOT_SIZE;
const int SALT_SIZE;
const int ITERATION_NUM;

cell pack_jetton_wallet_data(int status, int balance, slice owner_address, slice jetton_master_address, int merkle_root, int salt) inline;
    ;; Note that for

int hash_sha256(builder b);

;; Trick for gas saving originally created by @NickNekilov
int calculate_account_hash_cheap(int code_hash, int code_depth, int data_hash, int data_depth) inline;
        ;; refs_descriptor:bits8 bits_descriptor:bits8
            ;; refs_descriptor: ref_count + ((exotic? & 1) * 8) + (mask * 32)
            ;; we have 2 refs (code+data), non-exotic, zero mask
            ;; bits_descriptor: floor(bit_count/8) + ceil(bit_count/8)
            ;; we have 5 bit of data, bits_descriptor = 0 + 1 = 1
            ;; data: actual data: (split_depth, special,code, data, library) and also 3 bit for ceil number of bits
            ;; [0b00110] + [0b100]
        ;;depth descriptors
        ;; ref hashes

builder calculate_account_hash_base_slice(int code_hash, int code_depth, int data_depth) inline;
    ;; refs_descriptor:bits8 bits_descriptor:bits8
            ;; refs_descriptor: ref_count + ((exotic? & 1) * 8) + (mask * 32)
            ;; we have 2 refs (code+data), non-exotic, zero mask
            ;; bits_descriptor: floor(bit_count/8) + ceil(bit_count/8)
            ;; we have 5 bit of data, bits_descriptor = 0 + 1 = 1
            ;; data: actual data: (split_depth, special,code, data, library) and also 3 bit for ceil number of bits
            ;; [0b00110] + [0b100]
    ;;depth descriptors
    ;; ref hashes

int calculate_account_hash_cheap_with_base_builder(builder base_builder, int data_hash) inline;

builder calculate_jetton_wallet_address(cell state_init) inline;
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L105
    addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;
    -}

builder pack_jetton_wallet_data_builder_base(int status, int balance, slice owner_address, slice jetton_master_address, int merkle_root) inline;

builder pack_jetton_wallet_data_hash_base(builder wallet_data_base) inline;
    ;; refs_descriptor:bits8 bits_descriptor:bits8
            ;; refs_descriptor: ref_count + ((exotic? & 1) * 8) + (mask * 32)
            ;; we have 0 refs , non-exotic, zero mask
            ;;0 |
            ;; bits_descriptor: floor(bit_count/8) + ceil(bit_count/8)
            ;; we have 4+4+267+267+256+10 = 808 bit of data, bits_descriptor = 101 + 101 = 202
    ;;depth descriptors

int calculate_jetton_wallet_data_hash_cheap(builder base, int salt) inline;
           ;; salt 10 bits, no trailing bits needed

cell calculate_jetton_wallet_state_init_internal(slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int merkle_root, int salt) inline;
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L144
    _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
    code:(Maybe ^Cell) data:(Maybe ^Cell)
    library:(Maybe ^Cell) = StateInit;
  -}

[cell, int] calculate_jetton_wallet_properties_cheap(slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int merkle_root) inline;
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L144
    _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
    code:(Maybe ^Cell) data:(Maybe ^Cell)
    library:(Maybe ^Cell) = StateInit;
  -}

[cell, int] calculate_jetton_wallet_properties(slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int merkle_root) inline;
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L144
    _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
    code:(Maybe ^Cell) data:(Maybe ^Cell)
    library:(Maybe ^Cell) = StateInit;
  -}

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int merkle_root) inline;

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int merkle_root) inline;

() check_either_forward_payload(slice s) impure inline;
        ;; forward_payload in ref
    ;; else forward_payload in slice - arbitrary bits and refs
```

## 84d0ae717efd23eecceb3a565e25fc5fb2e066f03bcf3672a7dd69aefa389db2/contracts/op-codes.fc

```fc
;; common

const op::transfer;
const op::transfer_notification;
const op::internal_transfer;
const op::excesses;
const op::burn;
const op::burn_notification;

const op::provide_wallet_address;
const op::take_wallet_address;

const op::top_up;

const error::invalid_op;
const error::wrong_op;
const error::not_owner;
const error::not_valid_wallet;
const error::wrong_workchain;

;; jetton-minter

const op::mint;
const op::change_admin;
const op::claim_admin;
const op::upgrade;
const op::change_metadata_uri;
const op::drop_admin;
const op::merkle_airdrop_claim;

;; jetton-wallet
const error::balance_error;
const error::not_enough_gas;
const error::invalid_message;
const error::airdrop_already_claimed;
const error::airdrop_not_ready;
const error::airdrop_finished;
const error::unknown_custom_payload;
const error::non_canonical_address;
```

## 84d0ae717efd23eecceb3a565e25fc5fb2e066f03bcf3672a7dd69aefa389db2/contracts/workchain.fc

```fc
#include "stdlib.fc";
#include "op-codes.fc";

const MY_WORKCHAIN;

int is_same_workchain(slice addr) inline;

() check_same_workchain(slice addr) impure inline;
```

## 84dafa449f98a6987789ba232358072bc0f76dc4524002a5d0918b9a75d2d599/wallet_v3_r2.fif

```fif
#!/usr/bin/fift -s
"Asm.fif" include

// New advanced wallet code adapted from `auto/wallet3-code.fif`
<{ SETCP0 DUP IFNOTRET // return if recv_internal
   DUP 85143 INT EQUAL OVER 78748 INT EQUAL OR IFJMP:<{ // "seqno" and "get_public_key" get-methods
     1 INT AND c4 PUSHCTR CTOS 32 LDU 32 LDU NIP 256 PLDU CONDSEL  // cnt or pubk
   }>
   INC 32 THROWIF	// fail unless recv_external
   9 PUSHPOW2 LDSLICEX DUP 32 LDU 32 LDU 32 LDU 	//  signature in_msg subwallet_id valid_until msg_seqno cs
   NOW s1 s3 XCHG LEQ 35 THROWIF	//  signature in_msg subwallet_id cs msg_seqno
   c4 PUSH CTOS 32 LDU 32 LDU 256 LDU ENDS	//  signature in_msg subwallet_id cs msg_seqno stored_seqno stored_subwallet public_key
   s3 s2 XCPU EQUAL 33 THROWIFNOT	//  signature in_msg subwallet_id cs public_key stored_seqno stored_subwallet
   s4 s4 XCPU EQUAL 34 THROWIFNOT	//  signature in_msg stored_subwallet cs public_key stored_seqno
   s0 s4 XCHG HASHSU	//  signature stored_seqno stored_subwallet cs public_key msg_hash
   s0 s5 s5 XC2PU	//  public_key stored_seqno stored_subwallet cs msg_hash signature public_key
   CHKSIGNU 35 THROWIFNOT	//  public_key stored_seqno stored_subwallet cs
   ACCEPT
   WHILE:<{
     DUP SREFS	//  public_key stored_seqno stored_subwallet cs _51
   }>DO<{	//  public_key stored_seqno stored_subwallet cs
     8 LDU LDREF s0 s2 XCHG	//  public_key stored_seqno stored_subwallet cs _56 mode
     SENDRAWMSG
   }>	//  public_key stored_seqno stored_subwallet cs
   ENDS SWAP INC	//  public_key stored_subwallet seqno'
   NEWC 32 STU 32 STU 256 STU ENDC c4 POP
}>c
```

## 88410c220f822181668269ce83eb9cc0d3b39c21999c8b55de03360a20e7c282/common.fc

```fc
const int one_ton;
const int dns_next_resolver_prefix;

const int op::fill_up;
const int op::outbid_notification;
const int op::change_dns_record;
const int op::dns_balance_release;

const int op::telemint_msg_deploy;
const int op::teleitem_msg_deploy;
const int op::teleitem_start_auction;
const int op::teleitem_cancel_auction;
const int op::teleitem_bid_info;
const int op::teleitem_return_bid;
const int op::teleitem_ok;

const int op::nft_cmd_transfer;
const int op::nft_cmd_get_static_data;
const int op::nft_cmd_edit_content;
const int op::nft_answer_ownership_assigned;
const int op::nft_answer_excesses;

const int op::ownership_assigned;
const int op::excesses;
const int op::get_static_data;
const int op::report_static_data;
const int op::get_royalty_params;
const int op::report_royalty_params;

const int err::invalid_length;
const int err::invalid_signature;
const int err::wrong_subwallet_id;
const int err::not_yet_valid_signature;
const int err::expired_signature;
const int err::not_enough_funds;
const int err::wrong_topup_comment;
const int err::unknown_op;
const int err::uninited;
const int err::too_small_stake;
const int err::expected_onchain_content;
const int err::forbidden_not_deploy;
const int err::forbidden_not_stake;
const int err::forbidden_topup;
const int err::forbidden_transfer;
const int err::forbidden_change_dns;
const int err::forbidden_touch;
const int err::no_auction;
const int err::forbidden_auction;
const int err::already_has_stakes;
const int err::auction_already_started;
const int err::invalid_auction_config;
const int err::incorrect_workchain;
const int err::no_first_zero_byte;
const int err::bad_subdomain_length;

const int min_tons_for_storage;
const int workchain;

int equal_slices(slice a, slice b);
builder store_builder(builder to, builder from);
slice zero_address();
(slice, int) skip_first_zero_byte?(slice cs) asm "x{00} SDBEGINSQ";

() force_chain(slice addr) impure inline;

;; "ton\0test\0" -> "ton"
int get_top_domain_bits(slice domain) inline;

_ load_text(slice cs) inline;

_ load_text_ref(slice cs) inline;

builder store_text(builder b, slice text) inline;

(slice, slice) unpack_token_info(cell c) inline;

cell pack_token_info(slice name, slice domain);

cell pack_state_init(cell code, cell data) inline;

cell pack_init_int_message(slice dest, cell state_init, cell body) inline;

() send_msg(slice to_address, int amount, int op, int query_id, builder payload, int mode) impure inline;

slice calculate_address(int wc, cell state_init) inline;

(int, slice) unpack_item_config(cell c) inline;

cell pack_item_config(int item_index, slice collection_address) inline;

(cell, cell) unpack_item_data() inline;

cell pack_nft_royalty_params(int numerator, int denominator, slice destination) inline;

(int, int, slice) unpack_nft_royalty_params(cell c) inline;

cell pack_item_data(cell config, cell state) inline;

cell pack_item_content(cell nft_content, cell dns, cell token_info) inline;

(cell, cell, cell) unpack_item_content(cell c) inline;

(slice, cell, cell, cell) unpack_item_state(cell c) inline;

cell pack_item_state(slice owner_address, cell content, cell auction, cell royalty_params) inline;

_ save_item_data(config, state) impure inline;

cell pack_item_state_init(int item_index, cell item_code) inline;

cell pack_teleitem_msg_deploy(slice sender_address, int bid, cell info, cell content, cell auction_config, cell royalty_params) inline;

(slice, int, cell, cell, cell, cell) unpack_teleitem_msg_deploy(slice cs) inline;

(int, int, int, cell, cell, slice, cell) unpack_collection_data() inline;

_ save_collection_data(int touched, int subwallet_id, int owner_key, cell content, cell item_code, slice full_domain, cell royalty_params) impure inline;

_ unpack_signed_cmd(slice cs) inline;

_ unpack_deploy_msg(slice cs) inline;

;;teleitem_last_bid bidder_address:MsgAddressInt bid:Grams bid_ts:uint32 = TeleitemLastBid;
(slice, int, int) unpack_last_bid(cell c) inline;
cell pack_last_bid(slice bidder_address, int bid, int bid_ts) inline;

;;teleitem_auction_state$_ last_bid:(Maybe ^TeleitemLastBid) min_bid:Grams end_time:uint32 = TeleitemAuctionState;
(cell, int, int) unpack_auction_state(cell c) inline;
cell pack_auction_state(cell last_bid, int min_bid, int end_time) inline;

(slice, int, int, int, int, int) unpack_auction_config(cell c) inline;

;;teleitem_auction$_ state:^TeleitemAuctionState config:^TeleitemConfig = TeleitemAuction;
(cell, cell) unpack_auction(cell c) inline;

cell pack_auction(cell state, cell config) inline;

(int, slice, slice, cell, int, slice) unpack_nft_cmd_transfer(slice cs) inline;
```

## 88410c220f822181668269ce83eb9cc0d3b39c21999c8b55de03360a20e7c282/nft-collection-no-dns.fc

```fc
_ unwrap_signed_cmd(slice signed_cmd, int public_key, int subwallet_id, int msg_value) impure;

_ unpack_deploy_msg_v2(slice cs) inline;
const int err::invalid_sender_address;
const int op::telemint_msg_deploy_v2;
slice check_restrictions(cell restrictions, slice sender_address) impure inline;

() deploy_item(slice sender_address, int bid, cell item_code, slice cmd, slice full_domain, cell default_royalty_params) impure;

() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure;

        ;; NB: it is not possible to recover any money transferred to this account
        ;; so we return back all transfers except ones with comment #topup in it

() recv_external(slice in_msg) impure;

;; Get methods

(int, cell, slice) get_collection_data() method_id;

slice get_nft_address_by_index(int index) method_id;

cell get_nft_content(int index, cell individual_nft_content) method_id;
```

## 88410c220f822181668269ce83eb9cc0d3b39c21999c8b55de03360a20e7c282/stdlib.fc

```fc
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail);

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list);

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list);

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list);

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list);

;;; Creates tuple with zero elements.
tuple empty_tuple();

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value);

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x);

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t);

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y);

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t);

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t);

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t);

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t);

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t);

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p);

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p);

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p);

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p);

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p);

;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null();

;;; Moves a variable [x] to the top of the stack

;;; Returns the current Unix time as an Integer
int now();

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address();

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance();

;;; Returns the logical time of the current transaction.
int cur_lt();

;;; Returns the starting logical time of the current block.
int block_lt();

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c);

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s);

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s);

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key);

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key);

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data();

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y);

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y);

;;; Sorts two integers.
(int, int) minmax(int x, int y);

;;; Computes the absolute value of an integer [x].
int abs(int x);

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}

;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c);

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s);

;;; Preloads the first reference from the slice.
cell preload_ref(slice s);

  {- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s);
(slice, int) load_coins(slice s);

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len);

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len);

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len);

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len);

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s);

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s);

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s);

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s);

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s);

;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c);

{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s);

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s);

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s);

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).

;;; Checks whether `slice` [s] has no bits of data.

;;; Checks whether `slice` [s] has no references.

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s);

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b);

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b);

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b);

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell();

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b);

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c);

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";

;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s);

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x);
builder store_coins(builder b, int x);

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c);

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c);

{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
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
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s);

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s);

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s);

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s);

{-
  # Dictionary primitives
-}

;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value);

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value);

cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict();
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.

{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x);
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
;;; Returns the current random seed as an unsigned 256-bit Integer.
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits (slice a, slice b);

;;; Concatenates two builders
builder store_builder(builder to, builder from);
```

## 88fbf818e47d5f328f7dc34bad4323bb28a12ec6c75ce9ec25d77746c56e1ded/stdlib.fc

```fc
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail);
forall X -> (X, tuple) uncons(tuple list);
forall X -> (tuple, X) list_next(tuple list);
forall X -> X car(tuple list);
tuple cdr(tuple list);
tuple empty_tuple();
forall X -> tuple tpush(tuple t, X value);
forall X -> [X] single(X x);
forall X -> X unsingle([X] t);
forall X, Y -> [X, Y] pair(X x, Y y);
forall X, Y -> (X, Y) unpair([X, Y] t);
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);
forall X -> X first(tuple t);
forall X -> X second(tuple t);
forall X -> X third(tuple t);
forall X -> X fourth(tuple t);
forall X, Y -> X pair_first([X, Y] p);
forall X, Y -> Y pair_second([X, Y] p);
forall X, Y, Z -> X triple_first([X, Y, Z] p);
forall X, Y, Z -> Y triple_second([X, Y, Z] p);
forall X, Y, Z -> Z triple_third([X, Y, Z] p);
forall X -> X null();

int now();
slice my_address();
[int, cell] get_balance();
int cur_lt();
int block_lt();

int cell_hash(cell c);
int slice_hash(slice s);
int string_hash(slice s);

int check_signature(int hash, slice signature, int public_key);
int check_data_signature(slice data, slice signature, int public_key);

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data();
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y);
int max(int x, int y);
(int, int) minmax(int x, int y);
int abs(int x);

slice begin_parse(cell c);
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s);
cell preload_ref(slice s);
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s);
slice skip_bits(slice s, int len);
slice first_bits(slice s, int len);
slice skip_last_bits(slice s, int len);
slice slice_last(slice s, int len);
(slice, cell) load_dict(slice s);
cell preload_dict(slice s);
slice skip_dict(slice s);

(slice, cell) load_maybe_ref(slice s);
cell preload_maybe_ref(slice s);
builder store_maybe_ref(builder b, cell c);

int cell_depth(cell c);

int slice_refs(slice s);
int slice_bits(slice s);
(int, int) slice_bits_refs(slice s);
int slice_depth(slice s);

int builder_refs(builder b);
int builder_bits(builder b);
int builder_depth(builder b);

builder begin_cell();
cell end_cell(builder b);
builder store_ref(builder b, cell c);
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s);
builder store_grams(builder b, int x);
builder store_dict(builder b, cell c);

(slice, slice) load_msg_addr(slice s);
tuple parse_addr(slice s);
(int, int) parse_std_addr(slice s);
(int, slice) parse_var_addr(slice s);

cell idict_set_ref(cell dict, int key_len, int index, cell value);
cell udict_set_ref(cell dict, int key_len, int index, cell value);
cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);
cell new_dict();

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x);

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x);
(slice, int) load_coins(slice s);
```

## 88fbf818e47d5f328f7dc34bad4323bb28a12ec6c75ce9ec25d77746c56e1ded/uni-lockup-wallet.fc

```fc
;; Restricted wallet initialized by a third party (a variant of restricted-wallet3-code.fc)
;; Allows to add more locked budget after initialization

_ is_whitelisted?(addr, allowed_destinations) {

_ check_message_destination(msg, allowed_destinations) inline_ref;
    ;; external messages are always valid

_ unpack_data();

_ pack_data(int seqno, int subwallet_id, int public_key, int config_public_key, cell allowed_destinations, int total_locked_value, cell
locked, int total_restricted_value, cell restricted) {

(cell, int) lock_grams(cell locked, int total, int ts, int value);

(cell, int) unlock_grams(cell locked, int total, int now_ts);

() recv_internal(int msg_value, cell in_msg_cell, slice in_msg) impure;
    ;; ignore all bounced messages
    ;; simple transfer with comment, return

() recv_external(slice in_msg) impure;

;; Get methods

int seqno() method_id;

int wallet_id() method_id;

int get_public_key() method_id;

;; the next three methods are mostly for testing

(int, int, int) get_balances_at(int time) method_id;

(int, int, int) get_balances() method_id;

int check_destination(slice destination) method_id;
```

## 89468f02c78e570802e39979c8516fc38df07ea76a48357e0536f2ba7b3ee37b/contracts/workchain.fc

```fc
#include "stdlib.fc";
#include "op-codes.fc";

const MY_WORKCHAIN;

int is_same_workchain(slice addr) inline;

() check_same_workchain(slice addr) impure inline;
```

## 89468f02c78e570802e39979c8516fc38df07ea76a48357e0536f2ba7b3ee37b/gas.fc

```fc
#include "workchain.fc";

const ONE_TON;

const MIN_STORAGE_DURATION;

;;# Precompiled constants
;;
;;All of the contents are result of contract emulation tests
;;

;;## Minimal fees
;;
;;- Transfer [/sandbox_tests/JettonWallet.spec.ts#L935](L935) `0.028627415` TON
;;- Burn [/sandbox_tests/JettonWallet.spec.ts#L1185](L1185) `0.016492002` TON

;;## Storage
;;
;;Get calculated in a separate test file [/sandbox_tests/StateInit.spec.ts](StateInit.spec.ts)

;;- `JETTON_WALLET_BITS` [/sandbox_tests/StateInit.spec.ts#L92](L92)
const JETTON_WALLET_BITS;

;;- `JETTON_WALLET_CELLS`: [/sandbox_tests/StateInit.spec.ts#L92](L92)
const JETTON_WALLET_CELLS;

;; difference in JETTON_WALLET_BITS/JETTON_WALLET_INITSTATE_BITS is difference in
;; StateInit and AccountStorage (https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)
;; we count bits as if balances are max possible
;;- `JETTON_WALLET_INITSTATE_BITS` [/sandbox_tests/StateInit.spec.ts#L95](L95)
const JETTON_WALLET_INITSTATE_BITS;
;;- `JETTON_WALLET_INITSTATE_CELLS` [/sandbox_tests/StateInit.spec.ts#L95](L95)
const JETTON_WALLET_INITSTATE_CELLS;

;; jetton-wallet.fc#L163 - maunal bits counting
const BURN_NOTIFICATION_BITS;
const BURN_NOTIFICATION_CELLS;

;;## Gas
;;
;;Gas constants are calculated in the main test suite.
;;First the related transaction is found, and then it's
;;resulting gas consumption is printed to the console.

;;- `SEND_TRANSFER_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L853](L853)
const SEND_TRANSFER_GAS_CONSUMPTION;

;;- `RECEIVE_TRANSFER_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L862](L862)
const RECEIVE_TRANSFER_GAS_CONSUMPTION;

;;- `SEND_BURN_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L1154](L1154)
const SEND_BURN_GAS_CONSUMPTION;

;;- `RECEIVE_BURN_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L1155](L1155)
const RECEIVE_BURN_GAS_CONSUMPTION;

int calculate_jetton_wallet_min_storage_fee() inline;

int forward_init_state_overhead() inline;

() check_amount_is_enough_to_transfer(int msg_value, int forward_ton_amount, int fwd_fee) impure inline;

    ;; 3 messages: wal1->wal2,  wal2->owner, wal2->response
    ;; but last one is optional (it is ok if it fails)

() check_amount_is_enough_to_burn(int msg_value) impure inline;
```

## 89468f02c78e570802e39979c8516fc38df07ea76a48357e0536f2ba7b3ee37b/jetton-utils.fc

```fc
#include "workchain.fc";

const int STATUS_SIZE;

cell pack_jetton_wallet_data(int status, int balance, slice owner_address, slice jetton_master_address) inline;

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L144
    _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
    code:(Maybe ^Cell) data:(Maybe ^Cell)
    library:(Maybe ^Cell) = StateInit;
  -}

slice calculate_jetton_wallet_address(cell state_init) inline;
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L105
    addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;
    -}

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

() check_either_forward_payload(slice s) impure inline;
        ;; forward_payload in ref
    ;; else forward_payload in slice - arbitrary bits and refs
```

## 89468f02c78e570802e39979c8516fc38df07ea76a48357e0536f2ba7b3ee37b/jetton-wallet.fc

```fc
;; Jetton Wallet Smart Contract

#pragma version >=0.4.3;

#include "stdlib.fc";
#include "op-codes.fc";
#include "workchain.fc";
#include "jetton-utils.fc";
#include "gas.fc";

{-
  Storage

  Note, status==0 means unlocked - user can freely transfer and recieve jettons (only admin can burn).
        (status & 1) bit means user can not send jettons
        (status & 2) bit means user can not receive jettons.
  Master (minter) smart-contract able to make outgoing actions (transfer, burn jettons) with any status.

  storage#_ status:uint4
            balance:Coins owner_address:MsgAddressInt
            jetton_master_address:MsgAddressInt = Storage;
-}

(int, int, slice, slice) load_data() inline;

() save_data(int status, int balance, slice owner_address, slice jetton_master_address) impure inline;

() send_jettons(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure inline_ref;
    ;; see transfer TL-B layout in jetton.tlb

    ;; see internal TL-B layout in jetton.tlb

    ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733

() receive_jettons(slice in_msg_body, slice sender_address, int my_ton_balance, int msg_value) impure inline_ref;
    ;; see internal TL-B layout in jetton.tlb

        ;; see transfer_notification TL-B layout in jetton.tlb

        ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733

        ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733

() burn_jettons(slice in_msg_body, slice sender_address, int msg_value) impure inline_ref;

    ;; see burn_notification TL-B layout in jetton.tlb

    ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733

() on_bounce(slice in_msg_body) impure inline;

() recv_internal(int my_ton_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

    ;; outgoing transfer

    ;; incoming transfer

    ;; burn

(int, slice, slice, cell) get_wallet_data() method_id;

int get_status() method_id;
```

## 89468f02c78e570802e39979c8516fc38df07ea76a48357e0536f2ba7b3ee37b/op-codes.fc

```fc
;; common

const op::transfer;
const op::transfer_notification;
const op::internal_transfer;
const op::excesses;
const op::burn;
const op::burn_notification;

const op::provide_wallet_address;
const op::take_wallet_address;

const op::top_up;

const error::invalid_op;
const error::wrong_op;
const error::not_owner;
const error::not_valid_wallet;
const error::wrong_workchain;

;; jetton-minter

const op::mint;
const op::change_admin;
const op::claim_admin;
const op::upgrade;
const op::call_to;
const op::change_metadata_uri;

;; jetton-wallet

const op::set_status;

const error::contract_locked;
const error::balance_error;
const error::not_enough_gas;
const error::invalid_message;
```

## 89468f02c78e570802e39979c8516fc38df07ea76a48357e0536f2ba7b3ee37b/stdlib.fc

```fc
;; Standard library for funC
;;

{-
    This file is part of TON FunC Standard Library.

    FunC Standard Library is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.

    FunC Standard Library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

-}

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail);

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list);

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list);

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list);

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list);

;;; Creates tuple with zero elements.
tuple empty_tuple();

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value);

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x);

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t);

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y);

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t);

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t);

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t);

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t);

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t);

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p);

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p);

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p);

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p);

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p);

;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null();

;;; Moves a variable [x] to the top of the stack

;;; Returns the current Unix time as an Integer
int now();

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address();

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance();

;;; Returns the logical time of the current transaction.
int cur_lt();

;;; Returns the starting logical time of the current block.
int block_lt();

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c);

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s);

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s);

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key);

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key);

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data();

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
;;() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y);

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y);

;;; Sorts two integers.
(int, int) minmax(int x, int y);

;;; Computes the absolute value of an integer [x].
int abs(int x);

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}

;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c);

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s);

;;; Preloads the first reference from the slice.
cell preload_ref(slice s);

{- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s);
(slice, int) load_coins(slice s);

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len);

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len);

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len);

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len);

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s);

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s);

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s);

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s);

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s);

;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c);

{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s);

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s);

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s);

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).

;;; Checks whether `slice` [s] has no bits of data.

;;; Checks whether `slice` [s] has no references.

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s);

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b);

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b);

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b);

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell();

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b);

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c);

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";

;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s);

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x);
builder store_coins(builder b, int x);

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c);

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c);

{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
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
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s);

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s);

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s);

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s);

{-
  # Dictionary primitives
-}

;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value);

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value);

cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict();
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.

{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x);
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
;;; Returns the current random seed as an unsigned 256-bit Integer.
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slices_bits(slice a, slice b);
;;; Checks whether b is a null. Note, that FunC also has polymorphic null? built-in.
;;; Concatenates two builders
builder store_builder(builder to, builder from);

;; CUSTOM:

;; TVM UPGRADE 2023-07 https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07
;; In mainnet since 20 Dec 2023 https://t.me/tonblockchain/226

;;; Retrieves code of smart-contract from c7
cell my_code();

;;; Creates an output action and returns a fee for creating a message. Mode has the same effect as in the case of SENDRAWMSG

;; TVM V6 https://github.com/ton-blockchain/ton/blob/testnet/doc/GlobalVersions.md#version-6

int get_compute_fee(int workchain, int gas_used);
int get_storage_fee(int workchain, int seconds, int bits, int cells);
int get_forward_fee(int workchain, int bits, int cells);
int get_precompiled_gas_consumption();

int get_simple_compute_fee(int workchain, int gas_used);
int get_simple_forward_fee(int workchain, int bits, int cells);
int get_original_fwd_fee(int workchain, int fwd_fee);
int my_storage_due();

tuple get_fee_cofigs();

;; BASIC

const int TRUE;
const int FALSE;

const int MASTERCHAIN;
const int BASECHAIN;

;;; skip (Maybe ^Cell) from `slice` [s].

(slice, int) ~load_bool(slice s) inline;

builder store_bool(builder b, int value) inline;

;; ADDRESS NONE
;; addr_none$00 = MsgAddressExt; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L100

builder store_address_none(builder b) inline;

slice address_none();

int is_address_none(slice s) inline;

;; MESSAGE

;; The message header info is organized as follows:

;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L126
;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
;; src:MsgAddressInt dest:MsgAddressInt
;; value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
;; created_lt:uint64 created_at:uint32 = CommonMsgInfo;

;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L135
;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
;; src:MsgAddress dest:MsgAddressInt
;; value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
;; created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;

;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L123C1-L124C33
;; currencies$_ grams:Grams other:ExtraCurrencyCollection = CurrencyCollection;

;; MSG FLAGS

const int BOUNCEABLE;
const int NON_BOUNCEABLE;

;; store msg_flags and address none
builder store_msg_flags_and_address_none(builder b, int msg_flag) inline;

;; load msg_flags only
(slice, int) ~load_msg_flags(slice s) inline;
;;; @param `msg_flags` - 4-bit
int is_bounced(int msg_flags) inline;

;; after `grams:Grams` we have (1 + 4 + 4 + 64 + 32) zeroes - zeroed extracurrency, ihr_fee, fwd_fee, created_lt and created_at
const int MSG_INFO_REST_BITS;

;; MSG

;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L155
;; message$_ {X:Type} info:CommonMsgInfo
;;  Maybe (Either StateInit ^StateInit)
;;  body:(Either X ^X) = Message X;
;;
;;message$_ {X:Type} info:CommonMsgInfoRelaxed
;;  init:(Maybe (Either StateInit ^StateInit))
;;  body:(Either X ^X) = MessageRelaxed X;
;;
;;_ (Message Any) = MessageAny;

;; if have StateInit (always place StateInit in ref):
;; 0b11 for `Maybe (Either StateInit ^StateInit)` and 0b1 or 0b0 for `body:(Either X ^X)`

const int MSG_WITH_STATE_INIT_AND_BODY_SIZE;
const int MSG_HAVE_STATE_INIT;
const int MSG_STATE_INIT_IN_REF;
const int MSG_BODY_IN_REF;

;; if no StateInit:
;; 0b0 for `Maybe (Either StateInit ^StateInit)` and 0b1 or 0b0 for `body:(Either X ^X)`

const int MSG_ONLY_BODY_SIZE;

builder store_statinit_ref_and_body_ref(builder b, cell state_init, cell body) inline;

builder store_only_body_ref(builder b, cell body) inline;

builder store_prefix_only_body(builder b) inline;

;; parse after sernder_address
(slice, int) ~retrieve_fwd_fee(slice in_msg_full_slice) inline;

;; MSG BODY

;; According to the guideline, it is recommended to start the body of the internal message with uint32 op and uint64 query_id

const int MSG_OP_SIZE;
const int MSG_QUERY_ID_SIZE;

(slice, int) ~load_op(slice s) inline;
builder store_op(builder b, int op) inline;

(slice, int) ~load_query_id(slice s) inline;
builder store_query_id(builder b, int query_id) inline;

;; SEND MODES - https://docs.ton.org/tvm.pdf page 137, SENDRAWMSG

;; For `send_raw_message` and `send_message`:

;;; x = 0 is used for ordinary messages; the gas fees are deducted from the senging amount; action phaes should NOT be ignored.
const int SEND_MODE_REGULAR;
;;; +1 means that the sender wants to pay transfer fees separately.
const int SEND_MODE_PAY_FEES_SEPARATELY;
;;; + 2 means that any errors arising while processing this message during the action phase should be ignored.
const int SEND_MODE_IGNORE_ERRORS;
;;; + 32 means that the current account must be destroyed if its resulting balance is zero.
const int SEND_MODE_DESTROY;
;;; x = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message.
const int SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE;
;;; x = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message).
const int SEND_MODE_CARRY_ALL_BALANCE;
;;; in the case of action fail - bounce transaction. No effect if SEND_MODE_IGNORE_ERRORS (+2) is used. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int SEND_MODE_BOUNCE_ON_ACTION_FAIL;

;; Only for `send_message`:

;;; do not create an action, only estimate fee. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int SEND_MODE_ESTIMATE_FEE_ONLY;

;; Other modes affect the fee calculation as follows:
;; +64 substitutes the entire balance of the incoming message as an outcoming value (slightly inaccurate, gas expenses that cannot be estimated before the computation is completed are not taken into account).
;; +128 substitutes the value of the entire balance of the contract before the start of the computation phase (slightly inaccurate, since gas expenses that cannot be estimated before the completion of the computation phase are not taken into account).

;; RESERVE MODES - https://docs.ton.org/tvm.pdf page 137, RAWRESERVE

;;; Creates an output action which would reserve exactly x nanograms (if y = 0).
const int RESERVE_REGULAR;
;;; Creates an output action which would reserve at most x nanograms (if y = 2).
;;; Bit +2 in y means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved.
const int RESERVE_AT_MOST;
;;; in the case of action fail - bounce transaction. No effect if RESERVE_AT_MOST (+2) is used. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int RESERVE_BOUNCE_ON_ACTION_FAIL;

;; TOKEN METADATA
;; https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md

;; Key is sha256 hash of string. Value is data encoded as described in "Data serialization" paragraph.
;; Snake format - must be prefixed with 0x00 byte

;; On-chain content layout The first byte is 0x00 and the rest is key/value dictionary.
cell create_token_onchain_metadata(cell content_dict) inline;
```

## 89d964bb4d167d20b7eae8f22b62554fddac30112908d4545ce18ee2c25504f0/stdlib.fc

```fc
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail);

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list);

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list);

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list);

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list);

;;; Creates tuple with zero elements.
tuple empty_tuple();

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value);

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x);

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t);

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y);

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t);

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t);

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t);

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t);

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t);

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p);

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p);

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p);

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p);

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p);

;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null();

;;; Moves a variable [x] to the top of the stack

;;; Returns the current Unix time as an Integer
int now();

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address();

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance();

;;; Returns the logical time of the current transaction.
int cur_lt();

;;; Returns the starting logical time of the current block.
int block_lt();

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c);

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s);

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s);

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key);

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key);

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data();

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y);

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y);

;;; Sorts two integers.
(int, int) minmax(int x, int y);

;;; Computes the absolute value of an integer [x].
int abs(int x);

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}

;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c);

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s);

;;; Preloads the first reference from the slice.
cell preload_ref(slice s);

  {- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s);
(slice, int) load_coins(slice s);

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len);

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len);

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len);

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len);

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s);

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s);

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s);

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s);

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s);

;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c);

{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s);

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s);

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s);

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).

;;; Checks whether `slice` [s] has no bits of data.

;;; Checks whether `slice` [s] has no references.

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s);

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b);

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b);

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b);

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell();

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b);

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c);

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";

;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s);

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x);
builder store_coins(builder b, int x);

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c);

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c);

{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
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
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s);

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s);

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s);

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s);

{-
  # Dictionary primitives
-}

;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value);

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value);

cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict();
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.

{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x);
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
;;; Returns the current random seed as an unsigned 256-bit Integer.
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits (slice a, slice b);

;;; Concatenates two builders
builder store_builder(builder to, builder from);
```

## 89d964bb4d167d20b7eae8f22b62554fddac30112908d4545ce18ee2c25504f0/wallet_v3r2.fc

```fc
#include "stdlib.fc";

() recv_internal(slice in_msg) impure;
  ;; do nothing for internal messages

() recv_external(slice in_msg) impure;

;; Get methods

int seqno() method_id;

int get_public_key() method_id;
```

## 8b5ffc9ebfd39064d8d5f56e4659c826bb7593923f5ca48728be4d60af6f51f9/dns-utils.fc

```fc
const int one_month;
const int one_year;
const int auction_start_time;
const int one_ton;
const int dns_next_resolver_prefix;

const int dns_config_id;

const int op::fill_up;
const int op::outbid_notification;
const int op::change_dns_record;
const int op::process_governance_decision;
const int op::dns_balance_release;

int mod(int x, int y);

slice zero_address();

;; "ton\0test\0" -> "ton"
int get_top_domain_bits(slice domain);

slice read_domain_from_comment(slice in_msg_body);

int check_domain_string(slice domain);
            ;; we can do it because additional UTF-8 character's octets >= 128 -- https://www.ietf.org/rfc/rfc3629.txt

(int, int) get_min_price_config(int domain_char_count);

int get_min_price(int domain_bits_length, int now_time);
```

## 8b5ffc9ebfd39064d8d5f56e4659c826bb7593923f5ca48728be4d60af6f51f9/imports/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;
```

## 8b5ffc9ebfd39064d8d5f56e4659c826bb7593923f5ca48728be4d60af6f51f9/nft-item.fc

```fc
;; Domain smart contract (implement NFT item interface)

int min_tons_for_storage();

const auction_start_duration;
const auction_end_duration;
const auction_prolongation;

;;  MsgAddressInt max_bid_address
;;  Coins max_bid_amount
;;  int auction_end_time
(slice, int, int) unpack_auction(cell auction);

cell pack_auction(slice max_bid_address, int max_bid_amount, int auction_end_time);

;;
;;  Storage
;;
;;  uint256 index
;;  MsgAddressInt collection_address
;;  MsgAddressInt owner_address
;;  cell content
;;  cell domain - e.g contains "alice" (without ending \0) for "alice.ton" domain
;;  cell auction - auction info
;;  int last_fill_up_time

(int, int, slice, slice, cell, cell, cell, int) load_data();

() store_data(int index, slice collection_address, slice owner_address, cell content, cell domain, cell auction, int last_fill_up_time) impure;

() send_msg(slice to_address, int amount, int op, int query_id, builder payload, int send_mode) impure inline;

() transfer_ownership(int my_balance, int index, slice collection_address, slice owner_address, cell content, slice sender_address, int query_id, slice in_msg_body, int fwd_fees, cell domain, cell auction) impure inline;

() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure;

            ;; if owner send bid right after auction he can restore it by transfer resonse message

;;
;;  GET Methods
;;

(int, int, slice, slice, cell) get_nft_data() method_id;

slice get_editor() method_id;

slice get_domain() method_id;

(slice, int, int) get_auction_info() method_id;

int get_last_fill_up_time() method_id;

(int, cell) dnsresolve(slice subdomain, int category) method_id;
```

## 8b5ffc9ebfd39064d8d5f56e4659c826bb7593923f5ca48728be4d60af6f51f9/op-codes.fc

```fc
;; NFTEditable
```

## 8b5ffc9ebfd39064d8d5f56e4659c826bb7593923f5ca48728be4d60af6f51f9/stdlib.fc

```fc
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail);
forall X -> (X, tuple) uncons(tuple list);
forall X -> (tuple, X) list_next(tuple list);
forall X -> X car(tuple list);
tuple cdr(tuple list);
tuple empty_tuple();
forall X -> tuple tpush(tuple t, X value);
forall X -> [X] single(X x);
forall X -> X unsingle([X] t);
forall X, Y -> [X, Y] pair(X x, Y y);
forall X, Y -> (X, Y) unpair([X, Y] t);
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);
forall X -> X first(tuple t);
forall X -> X second(tuple t);
forall X -> X third(tuple t);
forall X -> X fourth(tuple t);
forall X, Y -> X pair_first([X, Y] p);
forall X, Y -> Y pair_second([X, Y] p);
forall X, Y, Z -> X triple_first([X, Y, Z] p);
forall X, Y, Z -> Y triple_second([X, Y, Z] p);
forall X, Y, Z -> Z triple_third([X, Y, Z] p);
forall X -> X null();

int now();
slice my_address();
[int, cell] get_balance();
int cur_lt();
int block_lt();

int cell_hash(cell c);
int slice_hash(slice s);
int string_hash(slice s);

int check_signature(int hash, slice signature, int public_key);
int check_data_signature(slice data, slice signature, int public_key);

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data();
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y);
int max(int x, int y);
(int, int) minmax(int x, int y);
int abs(int x);

slice begin_parse(cell c);
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s);
cell preload_ref(slice s);
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s);
slice skip_bits(slice s, int len);
slice first_bits(slice s, int len);
slice skip_last_bits(slice s, int len);
slice slice_last(slice s, int len);
(slice, cell) load_dict(slice s);
cell preload_dict(slice s);
slice skip_dict(slice s);

(slice, cell) load_maybe_ref(slice s);
cell preload_maybe_ref(slice s);
builder store_maybe_ref(builder b, cell c);

int cell_depth(cell c);

int slice_refs(slice s);
int slice_bits(slice s);
(int, int) slice_bits_refs(slice s);
int slice_depth(slice s);

int builder_refs(builder b);
int builder_bits(builder b);
int builder_depth(builder b);

builder begin_cell();
cell end_cell(builder b);
builder store_ref(builder b, cell c);
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s);
builder store_grams(builder b, int x);
builder store_dict(builder b, cell c);

(slice, slice) load_msg_addr(slice s);
tuple parse_addr(slice s);
(int, int) parse_std_addr(slice s);
(int, slice) parse_var_addr(slice s);

cell idict_set_ref(cell dict, int key_len, int index, cell value);
cell udict_set_ref(cell dict, int key_len, int index, cell value);
cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);
cell new_dict();

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x);

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x);
(slice, int) load_coins(slice s);

int equal_slices (slice a, slice b);
builder store_builder(builder to, builder from);
```

## 8b711e6809672c0335dc61d1da1dcc4059c973248af707bd586245085ea70b32/common.fc

```fc
const int one_ton;
const int dns_next_resolver_prefix;

const int op::fill_up;
const int op::outbid_notification;
const int op::change_dns_record;
const int op::dns_balance_release;

const int op::telemint_msg_deploy;
const int op::teleitem_msg_deploy;
const int op::teleitem_start_auction;
const int op::teleitem_cancel_auction;
const int op::teleitem_bid_info;
const int op::teleitem_return_bid;
const int op::teleitem_ok;

const int op::nft_cmd_transfer;
const int op::nft_cmd_get_static_data;
const int op::nft_cmd_edit_content;
const int op::nft_answer_ownership_assigned;
const int op::nft_answer_excesses;

const int op::ownership_assigned;
const int op::excesses;
const int op::get_static_data;
const int op::report_static_data;
const int op::get_royalty_params;
const int op::report_royalty_params;

const int err::invalid_length;
const int err::invalid_signature;
const int err::wrong_subwallet_id;
const int err::not_yet_valid_signature;
const int err::expired_signature;
const int err::not_enough_funds;
const int err::wrong_topup_comment;
const int err::unknown_op;
const int err::uninited;
const int err::too_small_stake;
const int err::expected_onchain_content;
const int err::forbidden_not_deploy;
const int err::forbidden_not_stake;
const int err::forbidden_topup;
const int err::forbidden_transfer;
const int err::forbidden_change_dns;
const int err::forbidden_touch;
const int err::no_auction;
const int err::forbidden_auction;
const int err::already_has_stakes;
const int err::auction_already_started;
const int err::invalid_auction_config;
const int err::incorrect_workchain;
const int err::no_first_zero_byte;
const int err::bad_subdomain_length;

const int min_tons_for_storage;
const int workchain;

int equal_slices(slice a, slice b);
builder store_builder(builder to, builder from);
slice zero_address();
(slice, int) skip_first_zero_byte?(slice cs) asm "x{00} SDBEGINSQ";

() force_chain(slice addr) impure inline;

;; "ton\0test\0" -> "ton"
int get_top_domain_bits(slice domain) inline;

_ load_text(slice cs) inline;

_ load_text_ref(slice cs) inline;

builder store_text(builder b, slice text) inline;

(slice, slice) unpack_token_info(cell c) inline;

cell pack_token_info(slice name, slice domain);

cell pack_state_init(cell code, cell data) inline;

cell pack_init_int_message(slice dest, cell state_init, cell body) inline;

() send_msg(slice to_address, int amount, int op, int query_id, builder payload, int mode) impure inline;

slice calculate_address(int wc, cell state_init) inline;

(int, slice) unpack_item_config(cell c) inline;

cell pack_item_config(int item_index, slice collection_address) inline;

(cell, cell) unpack_item_data() inline;

cell pack_nft_royalty_params(int numerator, int denominator, slice destination) inline;

(int, int, slice) unpack_nft_royalty_params(cell c) inline;

cell pack_item_data(cell config, cell state) inline;

cell pack_item_content(cell nft_content, cell dns, cell token_info) inline;

(cell, cell, cell) unpack_item_content(cell c) inline;

(slice, cell, cell, cell) unpack_item_state(cell c) inline;

cell pack_item_state(slice owner_address, cell content, cell auction, cell royalty_params) inline;

_ save_item_data(config, state) impure inline;

cell pack_item_state_init(int item_index, cell item_code) inline;

cell pack_teleitem_msg_deploy(slice sender_address, int bid, cell info, cell content, cell auction_config, cell royalty_params) inline;

(slice, int, cell, cell, cell, cell) unpack_teleitem_msg_deploy(slice cs) inline;

(int, int, int, cell, cell, slice, cell) unpack_collection_data() inline;

_ save_collection_data(int touched, int subwallet_id, int owner_key, cell content, cell item_code, slice full_domain, cell royalty_params) impure inline;

_ unpack_signed_cmd(slice cs) inline;

_ unpack_deploy_msg(slice cs) inline;

;;teleitem_last_bid bidder_address:MsgAddressInt bid:Grams bid_ts:uint32 = TeleitemLastBid;
(slice, int, int) unpack_last_bid(cell c) inline;
cell pack_last_bid(slice bidder_address, int bid, int bid_ts) inline;

;;teleitem_auction_state$_ last_bid:(Maybe ^TeleitemLastBid) min_bid:Grams end_time:uint32 = TeleitemAuctionState;
(cell, int, int) unpack_auction_state(cell c) inline;
cell pack_auction_state(cell last_bid, int min_bid, int end_time) inline;

(slice, int, int, int, int, int) unpack_auction_config(cell c) inline;

;;teleitem_auction$_ state:^TeleitemAuctionState config:^TeleitemConfig = TeleitemAuction;
(cell, cell) unpack_auction(cell c) inline;

cell pack_auction(cell state, cell config) inline;

(int, slice, slice, cell, int, slice) unpack_nft_cmd_transfer(slice cs) inline;
```

## 8b711e6809672c0335dc61d1da1dcc4059c973248af707bd586245085ea70b32/nft-item-no-dns-cheap-delayed.fc

```fc
const int cheap_min_tons_for_storage;
const int cheap_minting_price;
const int max_duration;

int send_money(int my_balance, slice address, int value) impure;

(int, slice, cell) maybe_end_auction(int my_balance, slice owner, cell auction, cell royalty_params, int is_external) impure;
    ;; should end auction
        ;; no stakes were made
        ;; NB: owner is not null now

(int, cell) process_new_bid(int my_balance, slice new_bid_address, int new_bid, cell auction) impure;
        ;; for maybe_end_auction
    ;; step is at least GR$1

cell prepare_auction(cell auction_config);
    ;; check beneficiary address

cell deploy_item(int my_balance, slice msg);
    ;; Do not throw errors here!

slice transfer_ownership(int my_balance, slice owner_address, slice in_msg_body, int fwd_fees) impure inline;

() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure;

        ;; sender do not pay for auction with its message

        ;; if owner send bid right after auction he can restore it by transfer response message

() recv_external(slice in_msg) impure;

;;
;;  GET Methods
;;

(int, int, slice, slice, cell) get_nft_data() method_id;

slice get_telemint_token_name() method_id;

(slice, int, int, int, int) get_telemint_auction_state() method_id;

(slice, int, int, int, int, int) get_telemint_auction_config() method_id;
        ;; Do not throw error, so it is easy to check if get_telemint_auction_config method exists

(int, int, slice) royalty_params() method_id;
```

## 8b711e6809672c0335dc61d1da1dcc4059c973248af707bd586245085ea70b32/stdlib.fc

```fc
;; Standard library for funC
;;

{-
    This file is part of TON FunC Standard Library.

    FunC Standard Library is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.

    FunC Standard Library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

-}

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail);

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list);

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list);

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list);

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list);

;;; Creates tuple with zero elements.
tuple empty_tuple();

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value);

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x);

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t);

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y);

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t);

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t);

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t);

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t);

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t);

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p);

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p);

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p);

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p);

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p);

;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null();

;;; Moves a variable [x] to the top of the stack

;;; Returns the current Unix time as an Integer
int now();

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address();

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance();

;;; Returns the logical time of the current transaction.
int cur_lt();

;;; Returns the starting logical time of the current block.
int block_lt();

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c);

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s);

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s);

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key);

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key);

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data();

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://docs.ton.org/develop/smart-contracts/guidelines/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y);

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y);

;;; Sorts two integers.
(int, int) minmax(int x, int y);

;;; Computes the absolute value of an integer [x].
int abs(int x);

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://docs.ton.org/develop/func/statements#modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://docs.ton.org/develop/func/statements#non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}

;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c);

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s);

;;; Preloads the first reference from the slice.
cell preload_ref(slice s);

  {- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^120 - 1`).
(slice, int) load_grams(slice s);
(slice, int) load_coins(slice s);

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len);

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len);

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len);

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len);

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s);

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s);

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s);

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s);

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s);

;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c);

{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s);

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s);

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s);

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).

;;; Checks whether `slice` [s] has no bits of data.

;;; Checks whether `slice` [s] has no references.

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s);

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b);

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b);

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b);

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://docs.ton.org/develop/func/statements#non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell();

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b);

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c);

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";

;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s);

;;; Stores (serializes) an integer [x] in the range `0..2^120 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x);
builder store_coins(builder b, int x);

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c);

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c);

{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
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
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s);

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s);

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s);

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s);

{-
  # Dictionary primitives
-}

;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value);

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value);

cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict();
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.

{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x);
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
;;; Returns the current random seed as an unsigned 256-bit Integer.
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits (slice a, slice b);

;;; Concatenates two builders
builder store_builder(builder to, builder from);
```

## 8d28ea421b77e805fea52acf335296499f03aec8e9fd21ddb5f2564aa65c48de/contracts/gas.fc

```fc
#include "workchain.fc";

const ONE_TON;

const MIN_STORAGE_DURATION;

;;# Precompiled constants
;;
;;All of the contents are result of contract emulation tests
;;

;;## Minimal fees
;;
;;- Transfer [/sandbox_tests/JettonWallet.spec.ts#L935](L935) `0.028627415` TON
;;- Burn [/sandbox_tests/JettonWallet.spec.ts#L1185](L1185) `0.016492002` TON

;;## Storage
;;
;;Get calculated in a separate test file [/sandbox_tests/StateInit.spec.ts](StateInit.spec.ts)

;;- `JETTON_WALLET_BITS` [/sandbox_tests/StateInit.spec.ts#L92](L92)
const JETTON_WALLET_BITS;

;;- `JETTON_WALLET_CELLS`: [/sandbox_tests/StateInit.spec.ts#L92](L92)
const JETTON_WALLET_CELLS;

;; difference in JETTON_WALLET_BITS/JETTON_WALLET_INITSTATE_BITS is difference in
;; StateInit and AccountStorage (https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)
;; we count bits as if balances are max possible
;;- `JETTON_WALLET_INITSTATE_BITS` [/sandbox_tests/StateInit.spec.ts#L95](L95)
const JETTON_WALLET_INITSTATE_BITS;
;;- `JETTON_WALLET_INITSTATE_CELLS` [/sandbox_tests/StateInit.spec.ts#L95](L95)
const JETTON_WALLET_INITSTATE_CELLS;

;; jetton-wallet.fc#L163 - maunal bits counting
const BURN_NOTIFICATION_BITS;
const BURN_NOTIFICATION_CELLS;

;;## Gas
;;
;;Gas constants are calculated in the main test suite.
;;First the related transaction is found, and then it's
;;resulting gas consumption is printed to the console.

;;- `SEND_TRANSFER_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L853](L853)
const SEND_TRANSFER_GAS_CONSUMPTION;

;;- `RECEIVE_TRANSFER_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L862](L862)
const RECEIVE_TRANSFER_GAS_CONSUMPTION;

;;- `SEND_BURN_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L1154](L1154)
const SEND_BURN_GAS_CONSUMPTION;

;;- `RECEIVE_BURN_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L1155](L1155)
const RECEIVE_BURN_GAS_CONSUMPTION;

int calculate_jetton_wallet_min_storage_fee() inline;

int forward_init_state_overhead() inline;

() check_amount_is_enough_to_transfer(int msg_value, int forward_ton_amount, int fwd_fee) impure inline;

    ;; 3 messages: wal1->wal2,  wal2->owner, wal2->response
    ;; but last one is optional (it is ok if it fails)

() check_amount_is_enough_to_burn(int msg_value) impure inline;
```

## 8d28ea421b77e805fea52acf335296499f03aec8e9fd21ddb5f2564aa65c48de/contracts/jetton-utils.fc

```fc
#include "workchain.fc";

const int STATUS_SIZE;

builder pack_jetton_wallet_data_builder(int status, int balance, slice owner_address, slice jetton_master_address) inline;

cell pack_jetton_wallet_data(int status, int balance, slice owner_address, slice jetton_master_address) inline;

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L144
    _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
    code:(Maybe ^Cell) data:(Maybe ^Cell)
    library:(Maybe ^Cell) = StateInit;
  -}

slice calculate_jetton_wallet_address(cell state_init) inline;
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L105
    addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;
    -}

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

() check_either_forward_payload(slice s) impure inline;
        ;; forward_payload in ref
    ;; else forward_payload in slice - arbitrary bits and refs
```

## 8d28ea421b77e805fea52acf335296499f03aec8e9fd21ddb5f2564aa65c48de/contracts/jetton-wallet.fc

```fc
;; Jetton Wallet Smart Contract

#pragma version >=0.4.3;

#include "stdlib.fc";
#include "op-codes.fc";
#include "workchain.fc";
#include "jetton-utils.fc";
#include "gas.fc";

{-
  Storage

  storage#_ status:uint4
            balance:Coins owner_address:MsgAddressInt
            jetton_master_address:MsgAddressInt = Storage;
-}

(int, int, slice, slice) load_data() inline;

() save_data(int status, int balance, slice owner_address, slice jetton_master_address) impure inline;

() send_jettons(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure inline_ref;
    ;; see transfer TL-B layout in jetton.tlb
    ;; int outgoing_transfers_unlocked = ((status & 1) == 0);
    ;;throw_unless(error::contract_locked, outgoing_transfers_unlocked);

    ;; see internal TL-B layout in jetton.tlb

    ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733

() receive_jettons(slice in_msg_body, slice sender_address, int my_ton_balance, int msg_value) impure inline_ref;
    ;; int incoming_transfers_locked = ((status & 2) == 2);
    ;; throw_if(error::contract_locked, incoming_transfers_locked);
    ;; see internal TL-B layout in jetton.tlb

        ;; see transfer_notification TL-B layout in jetton.tlb

        ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733

        ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733

() burn_jettons(slice in_msg_body, slice sender_address, int msg_value) impure inline_ref;

    ;; see burn_notification TL-B layout in jetton.tlb

    ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733

() on_bounce(slice in_msg_body) impure inline;

() recv_internal(int my_ton_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

    ;; outgoing transfer

    ;; incoming transfer

    ;; burn

(int, slice, slice, cell) get_wallet_data() method_id;

int get_status() method_id;
```

## 8d28ea421b77e805fea52acf335296499f03aec8e9fd21ddb5f2564aa65c48de/contracts/op-codes.fc

```fc
;; common

const op::transfer;
const op::transfer_notification;
const op::internal_transfer;
const op::excesses;
const op::burn;
const op::burn_notification;

const op::provide_wallet_address;
const op::take_wallet_address;

const op::top_up;

const error::invalid_op;
const error::wrong_op;
const error::not_owner;
const error::not_valid_wallet;
const error::wrong_workchain;

;; jetton-minter

const op::mint;
const op::change_admin;
const op::claim_admin;
const op::drop_admin;
const op::upgrade;
const op::change_metadata_uri;

;; jetton-wallet

const op::set_status;

const error::contract_locked;
const error::balance_error;
const error::not_enough_gas;
const error::invalid_message;
```

## 8d28ea421b77e805fea52acf335296499f03aec8e9fd21ddb5f2564aa65c48de/contracts/stdlib.fc

```fc
;; Standard library for funC
;;

{-
    This file is part of TON FunC Standard Library.

    FunC Standard Library is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.

    FunC Standard Library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

-}

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail);

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list);

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list);

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list);

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list);

;;; Creates tuple with zero elements.
tuple empty_tuple();

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value);

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x);

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t);

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y);

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t);

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t);

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t);

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t);

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t);

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p);

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p);

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p);

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p);

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p);

;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null();

;;; Moves a variable [x] to the top of the stack

;;; Returns the current Unix time as an Integer
int now();

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address();

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance();

;;; Returns the logical time of the current transaction.
int cur_lt();

;;; Returns the starting logical time of the current block.
int block_lt();

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c);

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s);

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s);

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key);

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key);

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data();

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
;;() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y);

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y);

;;; Sorts two integers.
(int, int) minmax(int x, int y);

;;; Computes the absolute value of an integer [x].
int abs(int x);

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}

;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c);

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s);

;;; Preloads the first reference from the slice.
cell preload_ref(slice s);

{- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s);
(slice, int) load_coins(slice s);

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len);

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len);

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len);

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len);

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s);

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s);

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s);

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s);

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s);

;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c);

{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s);

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s);

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s);

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).

;;; Checks whether `slice` [s] has no bits of data.

;;; Checks whether `slice` [s] has no references.

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s);

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b);

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b);

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b);

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell();

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b);

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c);

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";

;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s);

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x);
builder store_coins(builder b, int x);

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c);

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c);

{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
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
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s);

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s);

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s);

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s);

{-
  # Dictionary primitives
-}

;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value);

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value);

cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict();
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.

{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x);
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
;;; Returns the current random seed as an unsigned 256-bit Integer.
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slices_bits(slice a, slice b);
;;; Checks whether b is a null. Note, that FunC also has polymorphic null? built-in.
;;; Concatenates two builders
builder store_builder(builder to, builder from);

;; CUSTOM:

;; TVM UPGRADE 2023-07 https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07
;; In mainnet since 20 Dec 2023 https://t.me/tonblockchain/226

;;; Retrieves code of smart-contract from c7
cell my_code();

;;; Creates an output action and returns a fee for creating a message. Mode has the same effect as in the case of SENDRAWMSG

int gas_consumed();

;; TVM V6 https://github.com/ton-blockchain/ton/blob/testnet/doc/GlobalVersions.md#version-6

int get_compute_fee(int workchain, int gas_used);
int get_storage_fee(int workchain, int seconds, int bits, int cells);
int get_forward_fee(int workchain, int bits, int cells);
int get_precompiled_gas_consumption();

int get_simple_compute_fee(int workchain, int gas_used);
int get_simple_forward_fee(int workchain, int bits, int cells);
int get_original_fwd_fee(int workchain, int fwd_fee);
int my_storage_due();

tuple get_fee_cofigs();

;; BASIC

const int TRUE;
const int FALSE;

const int MASTERCHAIN;
const int BASECHAIN;

;;; skip (Maybe ^Cell) from `slice` [s].

(slice, int) ~load_bool(slice s) inline;

builder store_bool(builder b, int value) inline;

;; ADDRESS NONE
;; addr_none$00 = MsgAddressExt; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L100

builder store_address_none(builder b) inline;

slice address_none();

int is_address_none(slice s) inline;

;; MESSAGE

;; The message header info is organized as follows:

;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L126
;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
;; src:MsgAddressInt dest:MsgAddressInt
;; value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
;; created_lt:uint64 created_at:uint32 = CommonMsgInfo;

;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L135
;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
;; src:MsgAddress dest:MsgAddressInt
;; value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
;; created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;

;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L123C1-L124C33
;; currencies$_ grams:Grams other:ExtraCurrencyCollection = CurrencyCollection;

;; MSG FLAGS

const int BOUNCEABLE;
const int NON_BOUNCEABLE;

;; store msg_flags and address none
builder store_msg_flags_and_address_none(builder b, int msg_flags) inline;

;; load msg_flags only
(slice, int) ~load_msg_flags(slice s) inline;
;;; @param `msg_flags` - 4-bit
int is_bounced(int msg_flags) inline;

;; after `grams:Grams` we have (1 + 4 + 4 + 64 + 32) zeroes - zeroed extracurrency, ihr_fee, fwd_fee, created_lt and created_at
const int MSG_INFO_REST_BITS;

;; MSG

;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L155
;; message$_ {X:Type} info:CommonMsgInfo
;;  init:Maybe (Either StateInit ^StateInit)
;;  body:(Either X ^X) = Message X;
;;
;;message$_ {X:Type} info:CommonMsgInfoRelaxed
;;  init:(Maybe (Either StateInit ^StateInit))
;;  body:(Either X ^X) = MessageRelaxed X;
;;
;;_ (Message Any) = MessageAny;

;; if have StateInit (always place StateInit in ref):
;; 0b11 for `Maybe (Either StateInit ^StateInit)` and 0b1 or 0b0 for `body:(Either X ^X)`

const int MSG_WITH_STATE_INIT_AND_BODY_SIZE;
const int MSG_HAVE_STATE_INIT;
const int MSG_STATE_INIT_IN_REF;
const int MSG_BODY_IN_REF;

;; if no StateInit:
;; 0b0 for `Maybe (Either StateInit ^StateInit)` and 0b1 or 0b0 for `body:(Either X ^X)`

const int MSG_ONLY_BODY_SIZE;

builder store_statinit_ref_and_body_ref(builder b, cell state_init, cell body) inline;

builder store_only_body_ref(builder b, cell body) inline;

builder store_prefix_only_body(builder b) inline;

;; parse after sender_address
(slice, int) ~retrieve_fwd_fee(slice in_msg_full_slice) inline;

;; MSG BODY

;; According to the guideline, it is recommended to start the body of the internal message with uint32 op and uint64 query_id

const int MSG_OP_SIZE;
const int MSG_QUERY_ID_SIZE;

(slice, int) ~load_op(slice s) inline;
builder store_op(builder b, int op) inline;

(slice, int) ~load_query_id(slice s) inline;
builder store_query_id(builder b, int query_id) inline;

;; SEND MODES - https://docs.ton.org/tvm.pdf page 137, SENDRAWMSG

;; For `send_raw_message` and `send_message`:

;;; x = 0 is used for ordinary messages; the gas fees are deducted from the senging amount; action phaes should NOT be ignored.
const int SEND_MODE_REGULAR;
;;; +1 means that the sender wants to pay transfer fees separately.
const int SEND_MODE_PAY_FEES_SEPARATELY;
;;; + 2 means that any errors arising while processing this message during the action phase should be ignored.
const int SEND_MODE_IGNORE_ERRORS;
;;; + 32 means that the current account must be destroyed if its resulting balance is zero.
const int SEND_MODE_DESTROY;
;;; x = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message.
const int SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE;
;;; x = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message).
const int SEND_MODE_CARRY_ALL_BALANCE;
;;; in the case of action fail - bounce transaction. No effect if SEND_MODE_IGNORE_ERRORS (+2) is used. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int SEND_MODE_BOUNCE_ON_ACTION_FAIL;

;; Only for `send_message`:

;;; do not create an action, only estimate fee. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int SEND_MODE_ESTIMATE_FEE_ONLY;

;; Other modes affect the fee calculation as follows:
;; +64 substitutes the entire balance of the incoming message as an outcoming value (slightly inaccurate, gas expenses that cannot be estimated before the computation is completed are not taken into account).
;; +128 substitutes the value of the entire balance of the contract before the start of the computation phase (slightly inaccurate, since gas expenses that cannot be estimated before the completion of the computation phase are not taken into account).

;; RESERVE MODES - https://docs.ton.org/tvm.pdf page 137, RAWRESERVE

;;; Creates an output action which would reserve exactly x nanograms (if y = 0).
const int RESERVE_REGULAR;
;;; Creates an output action which would reserve at most x nanograms (if y = 2).
;;; Bit +2 in y means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved.
const int RESERVE_AT_MOST;
;;; in the case of action fail - bounce transaction. No effect if RESERVE_AT_MOST (+2) is used. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int RESERVE_BOUNCE_ON_ACTION_FAIL;

;; TOKEN METADATA
;; https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md

;; Key is sha256 hash of string. Value is data encoded as described in "Data serialization" paragraph.
;; Snake format - must be prefixed with 0x00 byte

;; On-chain content layout The first byte is 0x00 and the rest is key/value dictionary.
cell create_token_onchain_metadata(cell content_dict) inline;
```

## 8d28ea421b77e805fea52acf335296499f03aec8e9fd21ddb5f2564aa65c48de/contracts/workchain.fc

```fc
#include "stdlib.fc";
#include "op-codes.fc";

const MY_WORKCHAIN;

int is_same_workchain(slice addr) inline;

() check_same_workchain(slice addr) impure inline;
```

## 8dc55c74d79634b47c99d7d0eeb31aa5ed343d85662542c6c7a6b307eb951ceb/imports/constants.fc

```fc
#pragma version >=0.4.3;

const int err::insufficient_fee;
const int err::insufficient_funds;
const int err::access_denied;
const int err::only_basechain_allowed;
const int err::receiver_is_sender;
const int err::stopped;
const int err::invalid_op;
const int err::invalid_comment;

const int err::not_accepting_loan_requests;
const int err::unable_to_participate;
const int err::too_soon_to_participate;
const int err::not_ready_to_finish_participation;
const int err::too_soon_to_finish_participation;
const int err::vset_not_changed;
const int err::vset_not_changeable;

const int err::unexpected_storage_price_format;
const int err::unexpected_gas_price_format;
const int err::unexpected_msg_forward_prices_format;
const int err::unexpected_validator_set_format;

const int participation::open;
const int participation::distribution;
const int participation::staked;
const int participation::validating;
const int participation::held;
const int participation::recovering;

const int op::new_stake;
const int op::new_stake_error;
const int op::new_stake_ok;
const int op::recover_stake;
const int op::recover_stake_error;
const int op::recover_stake_ok;

const int op::send_tokens;
const int op::receive_tokens;
const int op::transfer_notification;
const int op::gas_excess;
const int op::unstake_tokens;
const int op::provide_wallet_address;
const int op::take_wallet_address;

const int op::deposit_coins;
const int op::save_coins;
const int op::stake_coins;
const int op::stake_first_coins;
const int op::mint_tokens;
const int op::unstake_all_tokens;
const int op::reserve_tokens;
const int op::withdraw_tokens;
const int op::burn_tokens;
const int op::burn_failed;
const int op::withdraw_failed;
const int op::withdrawal_notification;
const int op::withdraw_jettons;
const int op::upgrade_wallet;
const int op::convert_wallet;
const int op::merge_wallet;

const int op::request_loan;
const int op::participate_in_election;
const int op::decide_loan_requests;
const int op::process_loan_requests;
const int op::request_rejected;
const int op::send_new_stake;
const int op::vset_changed;
const int op::finish_participation;
const int op::recover_stakes;
const int op::send_recover_stake;
const int op::recover_stake_result;
const int op::loan_result;
const int op::take_profit;

const int op::propose_governor;
const int op::accept_governance;
const int op::set_halter;
const int op::set_stopped;
const int op::set_driver;
const int op::set_content;
const int op::set_governance_fee;
const int op::set_rounds_imbalance;
const int op::send_message_to_loan;
const int op::send_process_loan_requests;
const int op::upgrade_code;

const int op::withdraw_surplus;
const int op::top_up;

const int gas::deposit_coins;
const int gas::save_coins;
const int gas::stake_coins;
const int gas::stake_first_coins;
const int gas::mint_tokens;
const int gas::receive_tokens;
const int gas::send_tokens;
const int gas::transfer_notification;
const int gas::unstake_tokens;
const int gas::unstake_all_tokens;
const int gas::reserve_tokens;
const int gas::withdraw_tokens;
const int gas::burn_tokens;
const int gas::burn_failed;
const int gas::upgrade_wallet;
const int gas::convert_wallet;
const int gas::merge_wallet;
const int gas::withdraw_failed;
const int gas::withdrawal_notification;
const int gas::gas_excess;

const int gas::request_loan;
const int gas::participate_in_election;
const int gas::decide_loan_requests;
const int gas::process_loan_requests;
const int gas::send_new_stake;
const int gas::vset_changed;
const int gas::finish_participation;
const int gas::recover_stakes;
const int gas::send_recover_stake;
const int gas::recover_stake_result;
const int gas::new_stake;
const int gas::new_stake_error;
const int gas::new_stake_ok;
const int gas::recover_stake;
const int gas::recover_stake_ok;

const int fee::treasury_storage;
const int fee::new_stake_confirmation;

const int log::loan;
const int log::repayment;
const int log::finish;

const int config::elector_address;
const int config::election;
const int config::validators;
const int config::stake;
const int config::storage_prices;
const int config::mc_gas_prices;
const int config::gas_prices;
const int config::mc_fwd_prices;
const int config::fwd_prices;
const int config::previous_validators;
const int config::current_validators;
const int config::next_validators;
const int config::misbehaviour_punishment;

const int send::regular;
const int send::pay_gas_separately;
const int send::ignore_errors;
const int send::destroy_if_zero;
const int send::remaining_value;
const int send::remaining_balance;

const int reserve::exact;
const int reserve::all_but_amount;
const int reserve::at_most;
const int reserve::add_original_balance;
const int reserve::negate;

const int chain::main;
const int chain::base;

const slice address::empty;
```

## 8dc55c74d79634b47c99d7d0eeb31aa5ed343d85662542c6c7a6b307eb951ceb/imports/stdlib.fc

```fc
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail);

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list);

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list);

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list);

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list);

;;; Creates tuple with zero elements.
tuple empty_tuple();

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value);

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x);

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t);

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y);

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t);

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t);

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t);

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t);

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t);

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p);

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p);

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p);

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p);

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p);

;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null();

;;; Moves a variable [x] to the top of the stack

;;; Returns the current Unix time as an Integer
int now();

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address();

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance();

;;; Returns the logical time of the current transaction.
int cur_lt();

;;; Returns the starting logical time of the current block.
int block_lt();

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c);

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s);

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s);

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key);

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key);

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int, int) slice_compute_data_size?(slice s, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int) slice_compute_data_size(slice c, int max_cells) impure asm "SDATASIZE";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data();

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y);

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y);

;;; Sorts two integers.
(int, int) minmax(int x, int y);

;;; Computes the absolute value of an integer [x].
int abs(int x);

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}

;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c);

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s);

;;; Preloads the first reference from the slice.
cell preload_ref(slice s);

{- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s);
(slice, int) load_coins(slice s);

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len);

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len);

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len);

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len);

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s);

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s);

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s);

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s);

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s);

;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c);

{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s);

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s);

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s);

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).

;;; Checks whether `slice` [s] has no bits of data.

;;; Checks whether `slice` [s] has no references.

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s);

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b);

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b);

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b);

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell();

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b);

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c);

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";

;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s);

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x);
builder store_coins(builder b, int x);

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c);

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c);

{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
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
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s);

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s);

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s);

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s);

{-
  # Dictionary primitives
-}

;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value);

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value);

cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict();
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.

{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x);
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
;;; Returns the current random seed as an unsigned 256-bit Integer.
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b);

;;; Concatenates two builders
builder store_builder(builder to, builder from);
```

## 8dc55c74d79634b47c99d7d0eeb31aa5ed343d85662542c6c7a6b307eb951ceb/imports/utils.fc

```fc
#include "stdlib.fc";
#include "constants.fc";

const int old_wallet_code_hash;

builder to_builder(slice s) inline;

builder store_state_init(builder b, cell state_init) inline;

builder store_body(builder b, builder body) inline;

builder store_log(builder b, builder log) inline;

() send_msg(int bounceable?, builder dst, cell state_init, builder body, int coins, int mode) impure inline_ref;
    ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
    ;;   src:MsgAddress dest:MsgAddressInt
    ;;   value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
    ;;   created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
    ;; message$_ {X:Type} info:CommonMsgInfoRelaxed
    ;;   init:(Maybe (Either StateInit ^StateInit))
    ;;   body:(Either X ^X) = MessageRelaxed X;

() emit_log(int topic, builder log) impure inline_ref;
    ;; addr_extern$01 len:(## 9) external_address:(bits len) = MsgAddressExt;
    ;; ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
    ;;   created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
    ;; message$_ {X:Type} info:CommonMsgInfoRelaxed
    ;;   init:(Maybe (Either StateInit ^StateInit))
    ;;   body:(Either X ^X) = MessageRelaxed X;

() log_loan
( int round_since
, builder validator
, int min_payment
, int validator_reward_share
, int loan_amount
, int accrue_amount
, int stake_amount
) impure inline {
    emit_log(log::loan, log);

() log_repayment
( int round_since
    , slice validator
    , int repayment_amount
    , int loan_amount
    , int accrue_amount
    , int stakers_share
    , int governor_share
    , int validator_share
) impure inline {
    emit_log(log::repayment, log);

() log_finish(int round_since, int total_staked, int total_recovered, int total_coins, int total_tokens) impure inline;

(int, int) get_elector() inline;
    ;; _ elector_addr:bits256 = ConfigParam 1;

(int, int, int, int) get_election_config() inline;
    ;; _ validators_elected_for:uint32 elections_start_before:uint32
    ;;   elections_end_before:uint32 stake_held_for:uint32
    ;;   = ConfigParam 15;

(int, int, int) get_validators_config() inline;
    ;; _ max_validators:(## 16) max_main_validators:(## 16) min_validators:(## 16)
    ;;   { max_validators >= max_main_validators }
    ;;   { max_main_validators >= min_validators }
    ;;   { min_validators >= 1 }
    ;;   = ConfigParam 16;

(int, int, int, int) get_stake_config() inline;
    ;; _ min_stake:Grams max_stake:Grams min_total_stake:Grams max_stake_factor:uint32 = ConfigParam 17;

(int, int, int, int) get_storage_prices() inline;
    ;; _#cc utime_since:uint32 bit_price_ps:uint64 cell_price_ps:uint64
    ;;   mc_bit_price_ps:uint64 mc_cell_price_ps:uint64 = StoragePrices;
    ;; _ (Hashmap 32 StoragePrices) = ConfigParam 18;

(int, int) get_gas_prices(int i) inline_ref;
    ;; gas_prices#dd gas_price:uint64 gas_limit:uint64 gas_credit:uint64
    ;;   block_gas_limit:uint64 freeze_due_limit:uint64 delete_due_limit:uint64
    ;;   = GasLimitsPrices;

    ;; gas_prices_ext#de gas_price:uint64 gas_limit:uint64 special_gas_limit:uint64 gas_credit:uint64
    ;;   block_gas_limit:uint64 freeze_due_limit:uint64 delete_due_limit:uint64
    ;;   = GasLimitsPrices;

    ;; gas_flat_pfx#d1 flat_gas_limit:uint64 flat_gas_price:uint64 other:GasLimitsPrices
    ;;   = GasLimitsPrices;

    ;; config_mc_gas_prices#_ GasLimitsPrices = ConfigParam 20;
    ;; config_gas_prices#_ GasLimitsPrices = ConfigParam 21;

(int, int, int) get_msg_forward_prices(int i) inline_ref;
    ;; msg_forward_prices#ea lump_price:uint64 bit_price:uint64 cell_price:uint64
    ;;   ihr_price_factor:uint32 first_frac:uint16 next_frac:uint16 = MsgForwardPrices;

    ;; // used for messages to/from masterchain
    ;; config_mc_fwd_prices#_ MsgForwardPrices = ConfigParam 24;
    ;; // used for all other messages
    ;; config_fwd_prices#_ MsgForwardPrices = ConfigParam 25;

(int, int) get_vset_times(int i) inline_ref;
    ;; validators_ext#12 utime_since:uint32 utime_until:uint32
    ;;   total:(## 16) main:(## 16) { main <= total } { main >= 1 }
    ;;   total_weight:uint64 list:(HashmapE 16 ValidatorDescr) = ValidatorSet;

cell create_state_init(cell code, cell data) inline;
    ;; _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
    ;;   code:(Maybe ^Cell) data:(Maybe ^Cell)
    ;;   library:(HashmapE 256 SimpleLib) = StateInit;

builder create_address(int wc, int addr) inline_ref;
    ;; addr_std$10 anycast:(Maybe Anycast)
    ;;   workchain_id:int8 address:bits256  = MsgAddressInt;

cell create_wallet_data(builder owner, slice treasury, cell wallet_code) inline;

cell create_loan_data(slice treasury, builder validator, int round_since) inline;

(builder, cell, int) create_wallet_address(builder owner, slice treasury, cell wallet_code) inline_ref;

(builder, cell, int) create_loan_address(slice treasury, builder validator, int round_since, cell loan_code) inline_ref;

int request_sort_key(int min_payment, int validator_reward_share, int loan_amount) inline_ref;
    ;; sort based on:
    ;;   1. efficieny
    ;;   2. treasury reward share
    ;;   3. least loan amount

() check_new_stake_msg(slice cs) impure inline;

;; https://github.com/ton-blockchain/ton/blob/ae5c0720143e231c32c3d2034cfe4e533a16d969/crypto/block/block.tlb#L721
int max_recommended_punishment_for_validator_misbehaviour(int stake) inline_ref;
    ;; misbehaviour_punishment_config_v1#01
    ;;   default_flat_fine:Grams default_proportional_fine:uint32
    ;;   severity_flat_mult:uint16 severity_proportional_mult:uint16
    ;;   unpunishable_interval:uint16
    ;;   long_interval:uint16 long_flat_mult:uint16 long_proportional_mult:uint16
    ;;   medium_interval:uint16 medium_flat_mult:uint16 medium_proportional_mult:uint16
    ;;    = MisbehaviourPunishmentConfig;
    ;; _ MisbehaviourPunishmentConfig = ConfigParam 40;

        ;; 101 TON - https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/lite-client/lite-client.cpp#L3678

    ;; https://github.com/ton-blockchain/ton/blob/master/lite-client/lite-client.cpp#L3721

    ;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L529

int wallet_storage_fee() inline_ref;

(int, int) loan_storage_fee() inline_ref;
    ;; loan smart contract storage on main chain while validating

    ;; storage of loan request on base chain while participating

    ;; sotrage of participation on base chain while participating

    ;; 1 round validation, 1 round participation and stake held, 1 round for prolonged rounds, 1 round to be safe

int msg_fwd_fee(int lump_price, int bit_price, int cell_price, int rest_bits, int rest_cells) inline_ref;
    ;; // msg_fwd_fees = (lump_price + ceil((bit_price * msg.bits + cell_price * msg.cells)/2^16)) nanograms
    ;; // ihr_fwd_fees = ceil((msg_fwd_fees * ihr_price_factor)/2^16) nanograms
    ;; // bits in the root cell of a message are not included in msg.bits (lump_price pays for them)

int deposit_coins_fee(cell wallet_state_init);

    ;; consider an additional cell for the message body

int stake_coins_fee();

int stake_first_coins_fee();

int send_tokens_fee(cell wallet_state_init);

    ;; consider an additional cell for the message body

int unstake_tokens_fee();

int unstake_all_tokens_fee();

int transfer_notification_fee();

int withdraw_tokens_fee();

int upgrade_wallet_fee(cell wallet_state_init);

    ;; consider 10 additional entries in the staking dict

int request_loan_fee(cell loan_state_init);

    ;; consider two additional cells for the message body

int send_new_stake_fee(cell loan_state_init);

    ;; consider two additional cells for the message body

int recover_stake_fee();
```

## 8dc55c74d79634b47c99d7d0eeb31aa5ed343d85662542c6c7a6b307eb951ceb/wallet.fc

```fc
#include "imports/utils.fc";

global slice owner;;
global slice treasury;;
global int tokens;;
global cell staking;;
global int unstaking;;
global cell wallet_code;;

() save_data() impure inline_ref;

() load_data() impure inline_ref;

() save_coins(int msg_ton, slice src, slice s) impure inline;

() stake_coins(int msg_ton, slice src, slice s) impure inline_ref;

    ;; Intentionally not checking the sender, since anyone willing to pay for gas can call this,
    ;; including the driver and the owner.

() stake_first_coins(int msg_ton, slice s) impure inline;

() receive_tokens(int msg_ton, slice src, slice s) impure inline;

() send_tokens(int msg_ton, slice src, slice s) impure inline;

() unstake_tokens(int msg_ton, slice src, slice s) impure inline_ref;

() unstake_all_tokens(int msg_ton, slice src, slice s) impure inline;

() withdraw_tokens(int msg_ton, slice src, slice s) impure inline;

    ;; Intentionally not checking the sender, since anyone willing to pay for gas can call this,
    ;; including the driver and the owner.

() burn_failed(int msg_ton, slice src, slice s) impure inline;

() withdraw_surplus(slice src, slice s) impure inline;

() withdraw_jettons(slice src, slice s) impure inline;

() upgrade_wallet(int msg_ton, slice src, slice s) impure inline;

() merge_wallet(int msg_ton, slice src, slice s) impure inline;

() on_bounce(slice s) impure;
    ;; this should not happen but in a rare case of a bounce (e.g. a frozen account), at least recover tokens

        ;; do nothing

    ;; return excess gas to owner which is usually the original sender

() recv_internal(int msg_ton, cell in_msg_full, slice in_msg_body) impure;

;;
;; get methods
;;

(int, slice, slice, cell) get_wallet_data() method_id;

(int, cell, int) get_wallet_state() method_id;

(int, int, int) get_wallet_fees() method_id;
```

## 8e5aab17e2e503bec75c2f453b9dacf11a98bbb2cc202994710952a7271c7780/imports/op-codes.fc

```fc
;; NFTEditable
```

## 8e5aab17e2e503bec75c2f453b9dacf11a98bbb2cc202994710952a7271c7780/nft-collection.fc

```fc
#include "./stdlib.fc";
#include "./op-codes.fc";
#include "./params.fc";

;; NFT collection smart contract

;; storage scheme
;; default#_ royalty_factor:uint16 royalty_base:uint16 royalty_address:MsgAddress = RoyaltyParams;
;; storage#_ owner_address:MsgAddress next_item_index:uint64
;;           ^[collection_content:^Cell common_content:^Cell]
;;           nft_item_code:^Cell
;;           royalty_params:^RoyaltyParams
;;           = Storage;

(slice, int, cell, cell, cell) load_data() inline;

() save_data(slice owner_address, int next_item_index, cell content, cell nft_item_code, cell royalty_params) impure inline;

cell calculate_nft_item_state_init(int item_index, cell nft_item_code);

slice calculate_nft_item_address(int wc, cell state_init);

() deploy_nft_item(int item_index, cell nft_item_code, int amount, cell nft_content) impure;

() send_royalty_params(slice to_address, int query_id, slice data) impure inline;

() recv_internal(cell in_msg_full, slice in_msg_body) impure;

;; Get methods

(int, cell, slice) get_collection_data() method_id;

slice get_nft_address_by_index(int index) method_id;

(int, int, slice) royalty_params() method_id;

cell get_nft_content(int index, cell individual_nft_content) method_id;
```

## 8e5aab17e2e503bec75c2f453b9dacf11a98bbb2cc202994710952a7271c7780/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;
```

## 8e5aab17e2e503bec75c2f453b9dacf11a98bbb2cc202994710952a7271c7780/stdlib.fc

```fc
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail);

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list);

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list);

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list);

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list);

;;; Creates tuple with zero elements.
tuple empty_tuple();

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value);

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x);

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t);

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y);

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t);

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t);

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t);

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t);

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t);

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p);

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p);

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p);

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p);

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p);

;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null();

;;; Moves a variable [x] to the top of the stack

;;; Returns the current Unix time as an Integer
int now();

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address();

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance();

;;; Returns the logical time of the current transaction.
int cur_lt();

;;; Returns the starting logical time of the current block.
int block_lt();

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c);

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s);

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s);

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key);

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key);

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data();

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y);

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y);

;;; Sorts two integers.
(int, int) minmax(int x, int y);

;;; Computes the absolute value of an integer [x].
int abs(int x);

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}

;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c);

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s);

;;; Preloads the first reference from the slice.
cell preload_ref(slice s);

  {- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s);
(slice, int) load_coins(slice s);

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len);

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len);

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len);

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len);

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s);

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s);

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s);

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s);

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s);

;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c);

{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s);

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s);

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s);

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).

;;; Checks whether `slice` [s] has no bits of data.

;;; Checks whether `slice` [s] has no references.

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s);

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b);

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b);

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b);

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell();

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b);

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c);

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";

;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s);

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x);
builder store_coins(builder b, int x);

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c);

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c);

{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
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
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s);

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s);

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s);

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s);

{-
  # Dictionary primitives
-}

;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value);

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value);

cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict();
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.

{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x);
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
;;; Returns the current random seed as an unsigned 256-bit Integer.
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b);
int equal_slices(slice a, slice b);

;;; Concatenates two builders
builder store_builder(builder to, builder from);
```

## 912b0317bfb5c79760eac245efcc709245aa382a1332dadb5a4524e7834e1dcf/contracts/bcl/bcl_jetton_minter.fc

```fc
#include "../imports/stdlib_modern.fc";
#include "utils/jetton_utils.fc";
#include "./op_codes.fc";
#include "./storage.fc";
#include "./errors.fc";
#include "math/bcl_math.fc";
#include "utils/log.fc";
#include "utils/utils.fc";
#include "dex/stonfi.fc";
#include "../imports/math/math.fc";

;; TODO: probably we should use +16 flag for sending messages
;; so that contract bounces if something goes wrong with our calculations

const gas::buy_op_cost;
const gas::sell_op_cost;
const gas::auxiliary_costs;

const additional_to_return_value;

int storage_fees();

() send_fees(int amount, cell referal) impure inline;
    ;; Send fees

() mint_tokens(slice to_address, cell jetton_wallet_code, int amount, cell master_msg) impure;

() send_mint_token(slice to_address, int amount, slice response_addr, int query_id, int msg_value, int send_mode) impure inline;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

        ;; ignore empty messages

        ;; ignore all bounced messages

    ;; User wants to buy some coins
        ;; By default sender is the buyer

        ;; Throw if trading is disabled

        ;; Throw if not enough TONs

        ;; Deduct gas fee

        ;; Change buyer if its specified

        ;; Calculate amount of tokens to buy

        ;; Check slippage

        ;; raw_reserve(x, 4) reserves balance BEFORE current message

        ;; Update supply

        ;; Update collected TON liq

        ;; Update last trade date

        ;; Send fees

        ;; Send log message
            ;; Buyer
            ;; TON value
            ;; Supply delta
            ;; New supply
            ;; Collected TON liq
            ;; Referal

            ;; This way we can return unused tons for gas to the user

        ;; Send tokens

        ;; All coins are sold, we cant send liq to STON.fi
            ;; Disable trading

            ;; Send Jetton part of liq

            ;; Increase total supply

            ;; Send close fee

            ;; Send TON part of liq

            ;; Send log message
                ;; Liq in TON
                ;; Liq in coins

        ;; Save storage

    ;; BCL wallet wants to sell some tokens
        ;; Throw if trading is disabled

        ;; Accept sell messages only from wallets

        ;; Throw if not enough TONs

        ;; This case should never appear

        ;; Calculate amount TONs to return

        ;; Check slippage

        ;; Update supply

        ;; Update collected TON liq

        ;; Update last trade date

        ;; Reserve contract balance BEFORE the message minus tons to return minus fees and left sorage fees
        ;; +8 means amount is considered as negative value

        ;; Send fees

        ;; Send log message
            ;; Seller
            ;; TON value
            ;; Supply delta
            ;; New supply
            ;; Collected TON liq
            ;; Referal

        ;; Send TONs

        ;; Save storage

    ;; Wallet wants to unlock

        ;; Accept unlock request only from wallets

        ;; Wallets could be unlocked only after trading phase is over

        ;; Send excess to wallet

        ;; see provide_wallet_address TL-B layout in jetton.tlb

        ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733

        ;; change admin

        ;; change author

        ;; change content, delete this for immutable tokens

        ;; Fees address
        ;; Numerator
        ;; Denominator

var get_jetton_data() method_id;

var get_wallet_address(slice owner_address) method_id;

;;
;; BCL specific methods
;;
var coin_price() method_id;

var coins_for_tons(int tons) method_id;

var tons_for_coins(int coins) method_id;

var get_bcl_data() method_id;
```

## 912b0317bfb5c79760eac245efcc709245aa382a1332dadb5a4524e7834e1dcf/contracts/bcl/dex/stonfi.fc

```fc
#include "../../imports/stdlib_modern.fc";
#include "../utils/jetton_utils.fc";
#include "../op_codes.fc";
#include "../storage.fc";
#include "../utils/utils.fc";

const STON_PROVIDE_LP;
const PTON_TRANSFER_TON;

slice get_router() inline;

slice get_router_pton_wallet() inline;

const gas::lp_jetton::gas;
const gas::lp_jetton::forward_gas;
const gas::lp_ton::gas;
const gas::total_lp_provide_gas;

;; internal_transfer  query_id:uint64 amount:(VarUInteger 16) from:MsgAddress
;;                     response_address:MsgAddress
;;                     forward_ton_amount:(VarUInteger 16)
;;                     forward_payload:(Either Cell ^Cell)
;;                     = InternalMsgBody;

() provide_jetton_lp(int amount) impure inline;

;; transfer query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
;;           response_destination:MsgAddress custom_payload:(Maybe ^Cell)
;;           forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
;;           = InternalMsgBody;

() provide_ton_lp(int amount) impure inline;
```

## 912b0317bfb5c79760eac245efcc709245aa382a1332dadb5a4524e7834e1dcf/contracts/bcl/errors.fc

```fc
const err::slippage_error;
const err::too_many_coins_to_buy;
const err::no_funds_for_gas;
const err::trading_disabled;
const err::trading_enabled;
const err::not_valid_wallet;
const err::too_many_coins_to_sell;
const err::not_admin;
const err::not_author;

const err::wrong_workchain;
const err::not_owner;
;; jetton-wallet
const err::balance_error;
const err::not_enough_gas;
const err::invalid_message;

const err::wrong_op;
```

## 912b0317bfb5c79760eac245efcc709245aa382a1332dadb5a4524e7834e1dcf/contracts/bcl/math/bcl_math.fc

```fc
#include "../../imports/math/math.fc";
#include "bcl_math_core_2.fc";

;;
;; High level curve math
;;

;; Current price
int calc_coin_price() inline;

;; Sell operation
var calc_tons_for_coins(int tokens) inline;
    ;; Calc fees in TON

    ;; Deduct fees

var calc_tons_for_all_coins() inline;

;; Buy operation
var calc_coins_for_tons(int tons) inline;

    ;; Calc fees in TON
    ;; Deduct fees

    ;; Calculations for rest of available coins

        ;; Add fees

        ;; Calc fees in TON
```

## 912b0317bfb5c79760eac245efcc709245aa382a1332dadb5a4524e7834e1dcf/contracts/bcl/math/bcl_math_core_2.fc

```fc
#include "../../imports/math/math.fc";
#include "../../imports/math/fp/fp.fc";

;;
;; Core curve math, does not include any edge cases handling or fees calculation
;;

const coeff::vTon;
const coeff::vToken;
const coeff::K;

;; const MAX_TON = 1500000000000000000000; ;; ctx_max_ton
;; const MAX_TON = 3000000000000000000; ;; ctx_max_ton

const ONE_9;

;; Formulas for on TONs and TOKENS, not in nano format

;; Converts nanoTON to TON & FP
;; nano TON is 10^9, FP numbers are * 10^18,
;; so we need to mul by 10^18 and div by 10^9 which is just mul by 10^9
int to_fp(int value) inline;

;; Converts FP TON to nanoTON
int from_fp(int value) inline;

int real_ton(int r_token);

;; Current price

;; Calculates how much TONs could be received for selling given amount of coins
;; Used for SELL operation

        tokens,
    );

;; Calculates how much tokens could be received for given amount of TONs
;; Used for BUY operation
```

## 912b0317bfb5c79760eac245efcc709245aa382a1332dadb5a4524e7834e1dcf/contracts/bcl/op_codes.fc

```fc
;; Jetton standard
const op::transfer;
const op::transfer_notification;
const op::internal_transfer;
const op::excesses;
const op::burn;
const op::burn_notification;

;; Discoverable Jetton standard
const op::provide_wallet_address;
const op::take_wallet_address;

;; Jetton Minter
const op::mint;

;; BCL
const op::collect_fees;
const op::set_fees;
const op::set_code;
const op::set_data;
const op::set_code_data;
const op::set_admin;
const op::set_content;
const op::set_author;
const op::buy;
const op::sell;
;; sent from user jetton wallet to master
const op::sell_coins_notification;

;; sent to the wallet from owner
const op::unlock_wallet;
;; sent from wallet to master
const op::unlock_wallet_callback;
;; sent from master to wallet
const op::unlock_wallet_excess;

const op::send_liq;
const op::drain;

const op::fee_payout;

const op::top_up;
```

## 912b0317bfb5c79760eac245efcc709245aa382a1332dadb5a4524e7834e1dcf/contracts/bcl/storage.fc

```fc
#include "../imports/stdlib_modern.fc";

;; Jetton Minter data
global int ctx_total_supply;;
global slice ctx_admin;;
global cell ctx_content;;
global cell ctx_wallet_code;;
global int ctx_ttl;;
global int ctx_last_trade_date;;
global int ctx_ton_liq_collected;;
global int ctx_max_ton;;

;; BCL data
global int ctx_bcl_supply;;
global int ctx_liq_supply;;
global slice ctx_author_address;;
global slice ctx_fee_address;;
global int ctx_trade_fee_numerator;;
global int ctx_trade_fee_denominator;;
global int ctx_trading_enabled;;
global cell ctx_referral;;
global int ctx_seed;;
global int ctx_trading_close_fee;;

global slice ctx_router_address;;
global slice ctx_router_pton_wallet_address;;

() load_base_data() impure;

() store_base_data() impure;
```

## 912b0317bfb5c79760eac245efcc709245aa382a1332dadb5a4524e7834e1dcf/contracts/bcl/utils/jetton_utils.fc

```fc
#include "../../imports/stdlib_modern.fc";
#include "workchain.fc";

const int STATUS_SIZE;

cell pack_jetton_wallet_data(int status, int balance, slice owner_address, slice jetton_master_address) inline;

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L144
    _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
    code:(Maybe ^Cell) data:(Maybe ^Cell)
    library:(Maybe ^Cell) = StateInit;
  -}

slice calculate_jetton_wallet_address(cell state_init) inline;
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L105
    addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;
    -}

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

() check_either_forward_payload(slice s) impure inline;
        ;; forward_payload in ref
    ;; else forward_payload in slice - arbitrary bits and refs
```

## 912b0317bfb5c79760eac245efcc709245aa382a1332dadb5a4524e7834e1dcf/contracts/bcl/utils/log.fc

```fc
#include "../../imports/stdlib_modern.fc";

() emit_log(builder data) impure inline;
    ;; 1023 - (4+2+9+256+64+32+2) = 654 bit free

    ;;    var msg = begin_cell()
    ;;    .store_uint (12, 4)         ;; ext_out_msg_info$11 src:MsgAddressInt ()
    ;;    .store_uint (1, 2)          ;; addr_extern$01
    ;;    .store_uint (256, 9)        ;; len:(## 9)
    ;;    .store_uint(event_id, 256); ;; external_address:(bits len)
    ;;
    ;;    if (need_separate_cell) {
    ;;        msg = msg.store_uint(1, 64 + 32 + 2) ;; created_lt, created_at, init:Maybe, body:Either
    ;;        .store_ref(data);
    ;;    } else {
    ;;        msg = msg.store_uint(0, 64 + 32 + 2) ;; created_lt, created_at, init:Maybe, body:Either
    ;;        .store_slice(data.begin_parse());
    ;;    }
```

## 912b0317bfb5c79760eac245efcc709245aa382a1332dadb5a4524e7834e1dcf/contracts/bcl/utils/utils.fc

```fc
#include "../../imports/stdlib_modern.fc";

const addr_none;

const const::ok;

() send_ok(slice to_addr, int value, int mode) impure;
```

## 912b0317bfb5c79760eac245efcc709245aa382a1332dadb5a4524e7834e1dcf/contracts/bcl/utils/workchain.fc

```fc
#include "../../imports/stdlib_modern.fc";
#include "../op_codes.fc";
#include "../errors.fc";

const MY_WORKCHAIN;

int is_same_workchain(slice addr) inline;

() check_same_workchain(slice addr) impure inline;
```

## 912b0317bfb5c79760eac245efcc709245aa382a1332dadb5a4524e7834e1dcf/contracts/imports/math/fp/fp.fc

```fc
{-
    math/fp/fp.fc

    This library provide functions for fixed point math.
-}

;; internal functions

(int) negate(int _n);

;; public functions

return muldiv(a, b, __math::ONE_18);

return muldiv(a, __math::ONE_18, b);

    ;; The traditional divUp formula is:
    ;; divUp(x, y) := (x + y - 1) / y
    ;; To avoid intermediate overflow in the addition, we distribute the division and get:
    ;; divUp(x, y) := (x - 1) / y + 1
    ;; Note that this requires x != 0, if x == 0 then the result is zero

    ;; The traditional divUp formula is:
    ;; divUp(x, y) := (x + y - 1) / y
    ;; To avoid intermediate overflow in the addition, we distribute the division and get:
    ;; _divUp(x, y) := (x - 1) / y + 1
    ;; Note that this requires x != 0, if x == 0 then the result is zero

;; add 18 decimals

;; remove 18 decimals (floor)

;; remove 18 decimals (ceil)

;; remove 18 decimals (round)

;; same as regular muldiv because extra __math::ONE_18 cancel each other out in div and mul
    ;; ((x * y / __math::ONE_18) * __math::ONE_18 / z) = x * y / z
return muldiv(_x, _y, _z);

;; _a should have 18 decimals -> returns with 18 decimals

;; _arg and _base should have 18 decimals -> returns with 18 decimals

return muldiv(log_arg, __math::ONE_18, log_base);

;; _x should have 18 decimals -> returns with 18 decimals

;; _x and _y should have 18 decimals -> returns with 18 decimals

;; _x has 18 decimals -> returns with 18 decimals

;; optimized pow for weighted math
;; Returns x^y, assuming both are fixed point numbers, rounding down. The result is guaranteed to not be above
;; the true value (that is, the error function expected - actual is always positive).
    ;; Optimize for when y equals 1.0, 2.0 or 4.0, as those are very simple to implement and occur often in 50/50
    ;; and 80/20 Weighted Pools

;; optimized pow_up for weighted math
;; Returns x^y, assuming both are fixed point numbers, rounding up. The result is guaranteed to not be below
;; the true value (that is, the error function expected - actual is always negative).
    ;; Optimize for when y equals 1.0, 2.0 or 4.0, as those are very simple to implement and occur often in 50/50
    ;; and 80/20 Weighted Pools
```

## 912b0317bfb5c79760eac245efcc709245aa382a1332dadb5a4524e7834e1dcf/contracts/imports/math/int/int.fc

```fc
{-
    math/int/int.fc

    This library provide functions for integer math. 
-}

    repeat(7) {
```

## 912b0317bfb5c79760eac245efcc709245aa382a1332dadb5a4524e7834e1dcf/contracts/imports/math/math.fc

```fc
{-
    math.fc

    This library provide functions for math. 
-}

;; internal constants

const int __math::ONE_18;
const int __math::ONE_20;
const int __math::ONE_36;
const int __math::MAX_NATURAL_EXPONENT;
const int __math::MIN_NATURAL_EXPONENT;
const int __math::LN_36_LOWER_BOUND;
const int __math::LN_36_UPPER_BOUND;
const int __math::MILD_EXPONENT_BOUND;
const int __math::e;
const int __math::x0;
const int __math::a0;
const int __math::x1;
const int __math::a1;
const int __math::x2;
const int __math::a2;
const int __math::x3;
const int __math::a3;
const int __math::x4;
const int __math::a4;
const int __math::x5;
const int __math::a5;
const int __math::x6;
const int __math::a6;
const int __math::x7;
const int __math::a7;
const int __math::x8;
const int __math::a8;
const int __math::x9;
const int __math::a9;
const int __math::x10;
const int __math::a10;
const int __math::x11;
const int __math::a11;
const int __math::max_pow_relative_error;

;; public constants

const int math::MAX_UINT8;
const int math::MAX_UINT16;
const int math::MAX_UINT32;
const int math::MAX_UINT64;
const int math::MAX_UINT128;
const int math::MAX_UINT256;
const int math::MAX_COINS;
const int math::ONE_DEC;
const int math::E;
const int math::PI;
const int math::PI_SQ;
const int math::1_DIV_E;
const int math::1_DIV_PI;
const int math::1_DIV_PI_SQ;

;; errors

const math::error::x_out_of_bounds;
const math::error::y_out_of_bounds;
const math::error::product_out_of_bounds;
const math::error::invalid_exponent;
const math::error::out_of_bounds;
const math::error::0_base;
const math::error::negative_power;
const math::error::zero_division;
const math::error::cmplment_out_of_range;

#include "int/int.fc";
#include "fp/fp.fc";
```

## 912b0317bfb5c79760eac245efcc709245aa382a1332dadb5a4524e7834e1dcf/contracts/imports/stdlib_modern.fc

```fc
;; Standard library for funC
;;

{-
    This file is part of TON FunC Standard Library.

    FunC Standard Library is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.

    FunC Standard Library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

-}

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail);

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list);

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list);

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list);

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list);

;;; Creates tuple with zero elements.
tuple empty_tuple();

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value);

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x);

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t);

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y);

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t);

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t);

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t);

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t);

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t);

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p);

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p);

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p);

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p);

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p);

;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null();

;;; Moves a variable [x] to the top of the stack

;;; Returns the current Unix time as an Integer
int now();

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address();

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance();

;;; Returns the logical time of the current transaction.
int cur_lt();

;;; Returns the starting logical time of the current block.
int block_lt();

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c);

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s);

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s);

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key);

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key);

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data();

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
;;() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y);

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y);

;;; Sorts two integers.
(int, int) minmax(int x, int y);

;;; Computes the absolute value of an integer [x].
int abs(int x);

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}

;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c);

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s);

;;; Preloads the first reference from the slice.
cell preload_ref(slice s);

{- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s);
(slice, int) load_coins(slice s);

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len);

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len);

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len);

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len);

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s);

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s);

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s);

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s);

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s);

;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c);

{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s);

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s);

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s);

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).

;;; Checks whether `slice` [s] has no bits of data.

;;; Checks whether `slice` [s] has no references.

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s);

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b);

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b);

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b);

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell();

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b);

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c);

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";

;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s);

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x);
builder store_coins(builder b, int x);

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c);

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c);

{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
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
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s);

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s);

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s);

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s);

{-
  # Dictionary primitives
-}

;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value);

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value);

cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict();
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.

{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x);
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
;;; Returns the current random seed as an unsigned 256-bit Integer.
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slices_bits(slice a, slice b);
;;; Checks whether b is a null. Note, that FunC also has polymorphic null? built-in.
;;; Concatenates two builders
builder store_builder(builder to, builder from);

;; CUSTOM:

;; TVM UPGRADE 2023-07 https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07
;; In mainnet since 20 Dec 2023 https://t.me/tonblockchain/226

;;; Retrieves code of smart-contract from c7
cell my_code();

;;; Creates an output action and returns a fee for creating a message. Mode has the same effect as in the case of SENDRAWMSG

int gas_consumed();

;; TVM V6 https://github.com/ton-blockchain/ton/blob/testnet/doc/GlobalVersions.md#version-6

int get_compute_fee(int workchain, int gas_used);
int get_storage_fee(int workchain, int seconds, int bits, int cells);
int get_forward_fee(int workchain, int bits, int cells);
int get_precompiled_gas_consumption();

int get_simple_compute_fee(int workchain, int gas_used);
int get_simple_forward_fee(int workchain, int bits, int cells);
int get_original_fwd_fee(int workchain, int fwd_fee);
int my_storage_due();

tuple get_fee_cofigs();

;; BASIC

const int TRUE;
const int FALSE;

const int MASTERCHAIN;
const int BASECHAIN;

;;; skip (Maybe ^Cell) from `slice` [s].

(slice, int) ~load_bool(slice s) inline;

builder store_bool(builder b, int value) inline;

;; ADDRESS NONE
;; addr_none$00 = MsgAddressExt; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L100

builder store_address_none(builder b) inline;

slice address_none();

int is_address_none(slice s) inline;

;; MESSAGE

;; The message header info is organized as follows:

;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L126
;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
;; src:MsgAddressInt dest:MsgAddressInt
;; value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
;; created_lt:uint64 created_at:uint32 = CommonMsgInfo;

;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L135
;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
;; src:MsgAddress dest:MsgAddressInt
;; value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
;; created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;

;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L123C1-L124C33
;; currencies$_ grams:Grams other:ExtraCurrencyCollection = CurrencyCollection;

;; MSG FLAGS

const int BOUNCEABLE;
const int NON_BOUNCEABLE;

;; store msg_flags and address none
builder store_msg_flags_and_address_none(builder b, int msg_flags) inline;

;; load msg_flags only
(slice, int) ~load_msg_flags(slice s) inline;
;;; @param `msg_flags` - 4-bit
int is_bounced(int msg_flags) inline;

;; after `grams:Grams` we have (1 + 4 + 4 + 64 + 32) zeroes - zeroed extracurrency, ihr_fee, fwd_fee, created_lt and created_at
const int MSG_INFO_REST_BITS;

;; MSG

;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L155
;; message$_ {X:Type} info:CommonMsgInfo
;;  init:Maybe (Either StateInit ^StateInit)
;;  body:(Either X ^X) = Message X;
;;
;;message$_ {X:Type} info:CommonMsgInfoRelaxed
;;  init:(Maybe (Either StateInit ^StateInit))
;;  body:(Either X ^X) = MessageRelaxed X;
;;
;;_ (Message Any) = MessageAny;

;; if have StateInit (always place StateInit in ref):
;; 0b11 for `Maybe (Either StateInit ^StateInit)` and 0b1 or 0b0 for `body:(Either X ^X)`

const int MSG_WITH_STATE_INIT_AND_BODY_SIZE;
const int MSG_HAVE_STATE_INIT;
const int MSG_STATE_INIT_IN_REF;
const int MSG_BODY_IN_REF;

;; if no StateInit:
;; 0b0 for `Maybe (Either StateInit ^StateInit)` and 0b1 or 0b0 for `body:(Either X ^X)`

const int MSG_ONLY_BODY_SIZE;

builder store_statinit_ref_and_body_ref(builder b, cell state_init, cell body) inline;

builder store_only_body_ref(builder b, cell body) inline;

builder store_prefix_only_body(builder b) inline;

;; parse after sender_address
(slice, int) ~retrieve_fwd_fee(slice in_msg_full_slice) inline;

;; MSG BODY

;; According to the guideline, it is recommended to start the body of the internal message with uint32 op and uint64 query_id

const int MSG_OP_SIZE;
const int MSG_QUERY_ID_SIZE;

(slice, int) ~load_op(slice s) inline;
builder store_op(builder b, int op) inline;

(slice, int) ~load_query_id(slice s) inline;
builder store_query_id(builder b, int query_id) inline;

;; SEND MODES - https://docs.ton.org/tvm.pdf page 137, SENDRAWMSG

;; For `send_raw_message` and `send_message`:

;;; x = 0 is used for ordinary messages; the gas fees are deducted from the senging amount; action phaes should NOT be ignored.
const int SEND_MODE_REGULAR;
;;; +1 means that the sender wants to pay transfer fees separately.
const int SEND_MODE_PAY_FEES_SEPARATELY;
;;; + 2 means that any errors arising while processing this message during the action phase should be ignored.
const int SEND_MODE_IGNORE_ERRORS;
;;; + 32 means that the current account must be destroyed if its resulting balance is zero.
const int SEND_MODE_DESTROY;
;;; x = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message.
const int SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE;
;;; x = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message).
const int SEND_MODE_CARRY_ALL_BALANCE;
;;; in the case of action fail - bounce transaction. No effect if SEND_MODE_IGNORE_ERRORS (+2) is used. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int SEND_MODE_BOUNCE_ON_ACTION_FAIL;

;; Only for `send_message`:

;;; do not create an action, only estimate fee. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int SEND_MODE_ESTIMATE_FEE_ONLY;

;; Other modes affect the fee calculation as follows:
;; +64 substitutes the entire balance of the incoming message as an outcoming value (slightly inaccurate, gas expenses that cannot be estimated before the computation is completed are not taken into account).
;; +128 substitutes the value of the entire balance of the contract before the start of the computation phase (slightly inaccurate, since gas expenses that cannot be estimated before the completion of the computation phase are not taken into account).

;; RESERVE MODES - https://docs.ton.org/tvm.pdf page 137, RAWRESERVE

;;; Creates an output action which would reserve exactly x nanograms (if y = 0).
const int RESERVE_REGULAR;
;;; Creates an output action which would reserve at most x nanograms (if y = 2).
;;; Bit +2 in y means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved.
const int RESERVE_AT_MOST;
;;; in the case of action fail - bounce transaction. No effect if RESERVE_AT_MOST (+2) is used. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int RESERVE_BOUNCE_ON_ACTION_FAIL;

;; TOKEN METADATA
;; https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md

;; Key is sha256 hash of string. Value is data encoded as described in "Data serialization" paragraph.
;; Snake format - must be prefixed with 0x00 byte

;; On-chain content layout The first byte is 0x00 and the rest is key/value dictionary.
cell create_token_onchain_metadata(cell content_dict) inline;
```

## 9132203703e335beb2cb7850832c4d50e45be6bc6f6e88456b873c43118df4b0/contracts/imports/stdlib.fc

```fc
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail);

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list);

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list);

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list);

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list);

;;; Creates tuple with zero elements.
tuple empty_tuple();

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value);

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x);

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t);

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y);

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t);

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t);

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t);

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t);

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t);

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p);

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p);

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p);

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p);

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p);

;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null();

;;; Moves a variable [x] to the top of the stack

;;; Returns the current Unix time as an Integer
int now();

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address();

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance();

;;; Returns the logical time of the current transaction.
int cur_lt();

;;; Returns the starting logical time of the current block.
int block_lt();

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c);

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s);

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s);

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key);

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key);

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data();

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y);

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y);

;;; Sorts two integers.
(int, int) minmax(int x, int y);

;;; Computes the absolute value of an integer [x].
int abs(int x);

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}

;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c);

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s);

;;; Preloads the first reference from the slice.
cell preload_ref(slice s);

  {- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s);
(slice, int) load_coins(slice s);

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len);

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len);

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len);

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len);

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s);

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s);

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s);

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s);

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s);

;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c);

{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s);

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s);

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s);

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).

;;; Checks whether `slice` [s] has no bits of data.

;;; Checks whether `slice` [s] has no references.

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s);

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b);

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b);

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b);

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell();

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b);

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c);

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";

;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s);

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x);
builder store_coins(builder b, int x);

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c);

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c);

{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
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
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s);

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s);

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s);

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s);

{-
  # Dictionary primitives
-}

;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value);

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value);

cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict();
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.

{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x);
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
;;; Returns the current random seed as an unsigned 256-bit Integer.
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b);
int equal_slices(slice a, slice b);

;;; Concatenates two builders
builder store_builder(builder to, builder from);
```

## 9132203703e335beb2cb7850832c4d50e45be6bc6f6e88456b873c43118df4b0/subdomain-manager.fc

```fc
#include "imports/stdlib.fc";

const int op::update_record;

global slice owner;;
global cell domains;;

() load_data () impure;

() save_data () impure;

() recv_internal (int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

(slice, slice) parse_subdomain (slice subdomain);

(int, cell) dnsresolve (slice subdomain, int category) method_id;

    ;; "test\0qwerty\0" -> "test" "qwerty\0"
    ;; "test\0" -> "test" ""
```

## 9260a83d557fd427213a63f78e9d3d79ddd2da99ab8871c9e5cf236ff54e7056/contract/src/skate_gateway.tact

```tact
import "@stdlib/deploy";
import "@stdlib/ownable";
import "./traits/skate/ISkate.tact"; // implicit

message(0xedf05063) ChangeRelayer {
    newRelayer: Int;
    currentSignature: Slice;
    newSignature: Slice;
}

message(0xc8c28f2d) SetExecutor {
    executor: Address;
}

message(0x471c2809) RevokeExecutor {
    executor: Address;
}

message(0x75a6e8ec) TopUpTON {
    owner: Address;
    relayer: Int;
    executors: map<Address, Bool>;
    nonce: Int as uint64;
    to: self.owner,;
    value: 0,;
    mode: SendRemainingBalance,;
    query_id: msg.query_id,;
    user: msg.user,;
    skate_app: ctx.sender,;
    execution_info: msg.execution_info,;
    to: msg.target_app,;
    value: execution_info.value,;
    mode: SendPayGasSeparately,;
    body: execution_info.payload.data,;
```

## 9260a83d557fd427213a63f78e9d3d79ddd2da99ab8871c9e5cf236ff54e7056/contract/src/traits/skate/ISkate.tact

```tact
/// Skate Inter Contract Communication Interface (ICCI)
//
// NOTE: DISCUSSION POINT (RESOLVED)
// INTENDED FLOW:
// 1. SkateApp implementations takes request initiation from skate_app.
// 2. SkateApp construct payload and request Skate Gateway.
// 3. Skate Gateway emit Event collected by off-chain actor then:
//    a. Executor processIntent(), i.e. reserve it => emit event
//    b. Skate Kernel process.
//    c. Skate AVS process.
//    d. Executor do their jobs on destination chain, i.e. PolyMarket on Polygon
//    e. Relayer sign the confirmation
// 4. Executor with relayer signature:
//    a. execute on Skate Gateway (which verify)
//    b. Execution dispatch to SkateApp (TON periphery)
// 6. SkateApp performs assets transfer based on verified state (STATELESS)
// 7. Assets released on destination chains

struct Destination {
    chain_id: Int as uint256;
    chain_type: Int as uint256;
    address: Int as uint256;
}

struct Payload {
    destination: Cell;
    data: Cell;
}

struct ExecutionInfo {
    value: Int as coins;
    expiration: Int as uint32;
    payload: Payload;
}

// SkateApp
struct SkateInitiateTask {
    query_id: Int as uint64;
    user: Address;
    processing_fee: Int as coins;
    execution_info: ExecutionInfo;
}

// NOTE: External message
message SkateInitiateTaskEvent {
    query_id: Int as uint64;
    user: Address;
    skate_app: Address;
    execution_info: ExecutionInfo;
}

// For Skate App
message(0x3938aff1) SkateInitiateTaskNotification {
    query_id: Int as uint64;
    user: Address;
    execution_info: ExecutionInfo;
}

// For Skate executors
message(0xe46c5be4) SkateExecuteTask {
    query_id: Int as uint64;
    target_app: Address;
    execution_info: ExecutionInfo;
    relayer_signature: Slice;
}
```

## 9306f551a95bea74d95bbdfc9efbd51bf0ba626fc5b2d56cc8a77d60a533e82b/highload-wallet-internal.fc

```fc
;; Heavy-duty wallet for mass transfers (e.g., for cryptocurrency exchanges)
;; accepts orders for up to 254 internal messages (transfers) in one external message
;; this version does not use seqno for replay protection; instead, it remembers all recent query_ids
;; in this way several external messages with different query_id can be sent in parallel

() process_message(slice in_msg) impure;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

() recv_external(slice in_msg) impure;

;; Get methods

;; returns -1 for processed queries, 0 for unprocessed, 1 for unknown (forgotten)

int get_public_key() method_id;
```

## 9306f551a95bea74d95bbdfc9efbd51bf0ba626fc5b2d56cc8a77d60a533e82b/stdlib.fc

```fc
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail);
forall X -> (X, tuple) uncons(tuple list);
forall X -> (tuple, X) list_next(tuple list);
forall X -> X car(tuple list);
tuple cdr(tuple list);
tuple empty_tuple();
forall X -> tuple tpush(tuple t, X value);
forall X -> [X] single(X x);
forall X -> X unsingle([X] t);
forall X, Y -> [X, Y] pair(X x, Y y);
forall X, Y -> (X, Y) unpair([X, Y] t);
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);
forall X -> X first(tuple t);
forall X -> X second(tuple t);
forall X -> X third(tuple t);
forall X -> X fourth(tuple t);
forall X, Y -> X pair_first([X, Y] p);
forall X, Y -> Y pair_second([X, Y] p);
forall X, Y, Z -> X triple_first([X, Y, Z] p);
forall X, Y, Z -> Y triple_second([X, Y, Z] p);
forall X, Y, Z -> Z triple_third([X, Y, Z] p);
forall X -> X null();

int now();
slice my_address();
[int, cell] get_balance();
int cur_lt();
int block_lt();

int cell_hash(cell c);
int slice_hash(slice s);
int string_hash(slice s);

int check_signature(int hash, slice signature, int public_key);
int check_data_signature(slice data, slice signature, int public_key);

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data();
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y);
int max(int x, int y);
(int, int) minmax(int x, int y);
int abs(int x);

slice begin_parse(cell c);
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s);
cell preload_ref(slice s);
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s);
slice skip_bits(slice s, int len);
slice first_bits(slice s, int len);
slice skip_last_bits(slice s, int len);
slice slice_last(slice s, int len);
(slice, cell) load_dict(slice s);
cell preload_dict(slice s);
slice skip_dict(slice s);

(slice, cell) load_maybe_ref(slice s);
cell preload_maybe_ref(slice s);
builder store_maybe_ref(builder b, cell c);

int cell_depth(cell c);

int slice_refs(slice s);
int slice_bits(slice s);
(int, int) slice_bits_refs(slice s);
int slice_depth(slice s);

int builder_refs(builder b);
int builder_bits(builder b);
int builder_depth(builder b);

builder begin_cell();
cell end_cell(builder b);
builder store_ref(builder b, cell c);
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s);
builder store_grams(builder b, int x);
builder store_dict(builder b, cell c);

(slice, slice) load_msg_addr(slice s);
tuple parse_addr(slice s);
(int, int) parse_std_addr(slice s);
(int, slice) parse_var_addr(slice s);

cell idict_set_ref(cell dict, int key_len, int index, cell value);
cell udict_set_ref(cell dict, int key_len, int index, cell value);
cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);
cell new_dict();

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x);

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";
```

## 935a8ee55d0a162ec93ff2d90efd2f19c7a23014aab231588966dc3b83b2ab8f/contracts/imports/stdlib.fc

```fc
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail);

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list);

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list);

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list);

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list);

;;; Creates tuple with zero elements.
tuple empty_tuple();

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value);

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x);

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t);

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y);

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t);

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t);

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t);

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t);

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t);

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p);

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p);

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p);

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p);

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p);

;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null();

;;; Moves a variable [x] to the top of the stack

;;; Returns the current Unix time as an Integer
int now();

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address();

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance();

;;; Returns the logical time of the current transaction.
int cur_lt();

;;; Returns the starting logical time of the current block.
int block_lt();

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c);

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s);

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s);

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key);

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key);

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data();

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y);

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y);

;;; Sorts two integers.
(int, int) minmax(int x, int y);

;;; Computes the absolute value of an integer [x].
int abs(int x);

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}

;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c);

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s);

;;; Preloads the first reference from the slice.
cell preload_ref(slice s);

  {- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s);
(slice, int) load_coins(slice s);

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len);

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len);

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len);

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len);

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s);

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s);

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s);

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s);

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s);

;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c);

{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s);

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s);

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s);

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).

;;; Checks whether `slice` [s] has no bits of data.

;;; Checks whether `slice` [s] has no references.

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s);

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b);

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b);

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b);

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell();

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b);

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c);

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";

;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s);

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x);
builder store_coins(builder b, int x);

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c);

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c);

{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
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
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s);

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s);

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s);

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s);

{-
  # Dictionary primitives
-}

;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value);

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value);

cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict();
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.

{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x);
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
;;; Returns the current random seed as an unsigned 256-bit Integer.
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b);
int equal_slices(slice a, slice b);

;;; Concatenates two builders
builder store_builder(builder to, builder from);
```

## 935a8ee55d0a162ec93ff2d90efd2f19c7a23014aab231588966dc3b83b2ab8f/multi_sig.fc

```fc
;; v2.0.0

#include "imports/stdlib.fc";

_ unpack_state() inline_ref;

_ pack_state(cell pending_queries, cell owner_infos, int last_cleaned, int k, int n, int wallet_id) inline_ref;

_ pack_owner_info(int public_key, int flood, slice owner_address) inline_ref;

_ unpack_owner_info(slice cs) inline_ref;

(int, int) check_signatures(cell owner_infos, cell signatures, int hash, int cnt_bits) inline_ref;

() recv_internal(slice in_msg) impure;
  ;; do nothing for internal messages

(int, int, int, slice) unpack_query_data(slice in_msg, int n, slice query, var found?, int root_i) inline_ref;

(cell, ()) dec_flood(cell owner_infos, int creator_i) {

() try_init() impure inline_ref;
  ;; first query without signatures is always accepted

(cell, cell) update_pending_queries(cell pending_queries, cell owner_infos, slice msg, int query_id, int creator_i, int cnt, int cnt_bits, int n, int k) impure inline_ref;

(int, int) calc_boc_size(int cells, int bits, slice root);

() recv_external(slice in_msg) impure;
  ;; empty message triggers init

  ;; Check root signature

;; Get methods
;; returns -1 for processed queries, 0 for unprocessed, 1 for unknown (forgotten)
(int, int) get_query_state(int query_id) method_id;

cell create_init_state(int wallet_id, int n, int k, cell owners_info) method_id;

cell merge_list(cell a, cell b);

  ;; as~skip_bits(1);

cell get_owner_infos() method_id;

(int, int) check_query_signatures(cell query) method_id;

cell messages_by_mask(int mask, int inv) method_id;

cell get_messages_signed_by_id(int id) method_id;

cell get_messages_unsigned_by_id(int id) method_id;

cell get_messages_unsigned() method_id;

(int, int) get_n_k() method_id;

cell merge_inner_queries(cell a, cell b) method_id;
```

## 9494d1cc8edf12f05671a1a9ba09921096eb50811e1924ec65c3c629fbb80812/highload-wallet-v2-code.fc

```fc
;; Heavy-duty wallet for mass transfers (e.g., for cryptocurrency exchanges)
;; accepts orders for up to 254 internal messages (transfers) in one external message
;; this version does not use seqno for replay protection; instead, it remembers all recent query_ids
;; in this way several external messages with different query_id can be sent in parallel

() recv_internal(slice in_msg) impure;
  ;; do nothing for internal messages

() recv_external(slice in_msg) impure;

;; Get methods

;; returns -1 for processed queries, 0 for unprocessed, 1 for unknown (forgotten)

int get_public_key() method_id;
```

## 9494d1cc8edf12f05671a1a9ba09921096eb50811e1924ec65c3c629fbb80812/imports/stdlib.fc

```fc
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail);
forall X -> (X, tuple) uncons(tuple list);
forall X -> (tuple, X) list_next(tuple list);
forall X -> X car(tuple list);
tuple cdr(tuple list);
tuple empty_tuple();
forall X -> tuple tpush(tuple t, X value);
forall X -> [X] single(X x);
forall X -> X unsingle([X] t);
forall X, Y -> [X, Y] pair(X x, Y y);
forall X, Y -> (X, Y) unpair([X, Y] t);
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);
forall X -> X first(tuple t);
forall X -> X second(tuple t);
forall X -> X third(tuple t);
forall X -> X fourth(tuple t);
forall X, Y -> X pair_first([X, Y] p);
forall X, Y -> Y pair_second([X, Y] p);
forall X, Y, Z -> X triple_first([X, Y, Z] p);
forall X, Y, Z -> Y triple_second([X, Y, Z] p);
forall X, Y, Z -> Z triple_third([X, Y, Z] p);
forall X -> X null();

int now();
slice my_address();
[int, cell] get_balance();
int cur_lt();
int block_lt();

int cell_hash(cell c);
int slice_hash(slice s);
int string_hash(slice s);

int check_signature(int hash, slice signature, int public_key);
int check_data_signature(slice data, slice signature, int public_key);

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data();
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y);
int max(int x, int y);
(int, int) minmax(int x, int y);
int abs(int x);

slice begin_parse(cell c);
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s);
cell preload_ref(slice s);
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s);
slice skip_bits(slice s, int len);
slice first_bits(slice s, int len);
slice skip_last_bits(slice s, int len);
slice slice_last(slice s, int len);
(slice, cell) load_dict(slice s);
cell preload_dict(slice s);
slice skip_dict(slice s);

(slice, cell) load_maybe_ref(slice s);
cell preload_maybe_ref(slice s);
builder store_maybe_ref(builder b, cell c);

int cell_depth(cell c);

int slice_refs(slice s);
int slice_bits(slice s);
(int, int) slice_bits_refs(slice s);
int slice_depth(slice s);

int builder_refs(builder b);
int builder_bits(builder b);
int builder_depth(builder b);

builder begin_cell();
cell end_cell(builder b);
builder store_ref(builder b, cell c);
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s);
builder store_grams(builder b, int x);
builder store_dict(builder b, cell c);

(slice, slice) load_msg_addr(slice s);
tuple parse_addr(slice s);
(int, int) parse_std_addr(slice s);
(int, slice) parse_var_addr(slice s);

cell idict_set_ref(cell dict, int key_len, int index, cell value);
cell udict_set_ref(cell dict, int key_len, int index, cell value);
cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);
cell new_dict();

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x);

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x);
(slice, int) load_coins(slice s);

int equal_slices (slice a, slice b);
builder store_builder(builder to, builder from);
```

## 959fc9a86b4b2436a1256ee1c02a58481a58488df91ecdd6c186d580b00be40a/imports/stdlib.fc

```fc
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail);
forall X -> (X, tuple) uncons(tuple list);
forall X -> (tuple, X) list_next(tuple list);
forall X -> X car(tuple list);
tuple cdr(tuple list);
tuple empty_tuple();
forall X -> tuple tpush(tuple t, X value);
forall X -> [X] single(X x);
forall X -> X unsingle([X] t);
forall X, Y -> [X, Y] pair(X x, Y y);
forall X, Y -> (X, Y) unpair([X, Y] t);
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);
forall X -> X first(tuple t);
forall X -> X second(tuple t);
forall X -> X third(tuple t);
forall X -> X fourth(tuple t);
forall X, Y -> X pair_first([X, Y] p);
forall X, Y -> Y pair_second([X, Y] p);
forall X, Y, Z -> X triple_first([X, Y, Z] p);
forall X, Y, Z -> Y triple_second([X, Y, Z] p);
forall X, Y, Z -> Z triple_third([X, Y, Z] p);
forall X -> X null();

int now();
slice my_address();
[int, cell] get_balance();
int cur_lt();
int block_lt();

int cell_hash(cell c);
int slice_hash(slice s);
int string_hash(slice s);

int check_signature(int hash, slice signature, int public_key);
int check_data_signature(slice data, slice signature, int public_key);

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data();
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y);
int max(int x, int y);
(int, int) minmax(int x, int y);
int abs(int x);

slice begin_parse(cell c);
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s);
cell preload_ref(slice s);
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s);
slice skip_bits(slice s, int len);
slice first_bits(slice s, int len);
slice skip_last_bits(slice s, int len);
slice slice_last(slice s, int len);
(slice, cell) load_dict(slice s);
cell preload_dict(slice s);
slice skip_dict(slice s);

(slice, cell) load_maybe_ref(slice s);
cell preload_maybe_ref(slice s);
builder store_maybe_ref(builder b, cell c);

int cell_depth(cell c);

int slice_refs(slice s);
int slice_bits(slice s);
(int, int) slice_bits_refs(slice s);
int slice_depth(slice s);

int builder_refs(builder b);
int builder_bits(builder b);
int builder_depth(builder b);

builder begin_cell();
cell end_cell(builder b);
builder store_ref(builder b, cell c);
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s);
builder store_grams(builder b, int x);
builder store_dict(builder b, cell c);

(slice, slice) load_msg_addr(slice s);
tuple parse_addr(slice s);
(int, int) parse_std_addr(slice s);
(int, slice) parse_var_addr(slice s);

cell idict_set_ref(cell dict, int key_len, int index, cell value);
cell udict_set_ref(cell dict, int key_len, int index, cell value);
cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);
cell new_dict();

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x);

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x);
(slice, int) load_coins(slice s);

int equal_slices (slice a, slice b);
builder store_builder(builder to, builder from);
```

## 959fc9a86b4b2436a1256ee1c02a58481a58488df91ecdd6c186d580b00be40a/nft-single.fc

```fc
;;
;;  TON Single NFT Smart Contract
;;

int min_tons_for_storage();

;;
;;  storage scheme
;;
;;  default#_ royalty_factor:uint16 royalty_base:uint16 royalty_address:MsgAddress = RoyaltyParams;
;;
;;  storage#_ owner_address:MsgAddress  editor_address:MsgAddress content:^Cell royalty_params:^RoyaltyParams
;;     = Storage;
;;

_ load_data();

() store_data(slice owner_address, slice editor_address, cell content, cell royalty_params) impure;

() send_royalty_params(slice to_address, int query_id, slice data) impure inline;

() send_msg(slice to_address, int amount, int op, int query_id, builder payload, int send_mode) impure inline;

() transfer_ownership(int my_balance, slice owner_address, slice editor_address, cell content, cell royalty_params, slice sender_address, int query_id, slice in_msg_body, int fwd_fees) impure inline;

() transfer_editorship(int my_balance, slice owner_address, slice editor_address, cell content, cell royalty_params, slice sender_address, int query_id, slice in_msg_body, int fwd_fees) impure inline;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

;;
;;  GET Methods
;;

(int, int, slice, slice, cell) get_nft_data() method_id;

(int, int, slice) royalty_params() method_id;

slice get_editor() method_id;
```

## 959fc9a86b4b2436a1256ee1c02a58481a58488df91ecdd6c186d580b00be40a/op-codes.fc

```fc
;; NFTEditable

;; SBT
```

## 959fc9a86b4b2436a1256ee1c02a58481a58488df91ecdd6c186d580b00be40a/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;

slice null_addr();
```

## 9892766765d3ea42809a417abbd7ff9ce681b145d05ae6b118a614b38c8ded15/imports/stdlib.fc

```fc
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail);
forall X -> (X, tuple) uncons(tuple list);
forall X -> (tuple, X) list_next(tuple list);
forall X -> X car(tuple list);
tuple cdr(tuple list);
tuple empty_tuple();
forall X -> tuple tpush(tuple t, X value);
forall X -> [X] single(X x);
forall X -> X unsingle([X] t);
forall X, Y -> [X, Y] pair(X x, Y y);
forall X, Y -> (X, Y) unpair([X, Y] t);
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);
forall X -> X first(tuple t);
forall X -> X second(tuple t);
forall X -> X third(tuple t);
forall X -> X fourth(tuple t);
forall X, Y -> X pair_first([X, Y] p);
forall X, Y -> Y pair_second([X, Y] p);
forall X, Y, Z -> X triple_first([X, Y, Z] p);
forall X, Y, Z -> Y triple_second([X, Y, Z] p);
forall X, Y, Z -> Z triple_third([X, Y, Z] p);
forall X -> X null();

int now();
slice my_address();
[int, cell] get_balance();
int cur_lt();
int block_lt();

int cell_hash(cell c);
int slice_hash(slice s);
int string_hash(slice s);

int check_signature(int hash, slice signature, int public_key);
int check_data_signature(slice data, slice signature, int public_key);

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data();
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y);
int max(int x, int y);
(int, int) minmax(int x, int y);
int abs(int x);

slice begin_parse(cell c);
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s);
cell preload_ref(slice s);
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s);
slice skip_bits(slice s, int len);
slice first_bits(slice s, int len);
slice skip_last_bits(slice s, int len);
slice slice_last(slice s, int len);
(slice, cell) load_dict(slice s);
cell preload_dict(slice s);
slice skip_dict(slice s);

(slice, cell) load_maybe_ref(slice s);
cell preload_maybe_ref(slice s);
builder store_maybe_ref(builder b, cell c);

int cell_depth(cell c);

int slice_refs(slice s);
int slice_bits(slice s);
(int, int) slice_bits_refs(slice s);
int slice_depth(slice s);

int builder_refs(builder b);
int builder_bits(builder b);
int builder_depth(builder b);

builder begin_cell();
cell end_cell(builder b);
builder store_ref(builder b, cell c);
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s);
builder store_grams(builder b, int x);
builder store_dict(builder b, cell c);

(slice, slice) load_msg_addr(slice s);
tuple parse_addr(slice s);
(int, int) parse_std_addr(slice s);
(int, slice) parse_var_addr(slice s);

cell idict_set_ref(cell dict, int key_len, int index, cell value);
cell udict_set_ref(cell dict, int key_len, int index, cell value);
cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);
cell new_dict();

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x);

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x);
(slice, int) load_coins(slice s);

int equal_slices (slice a, slice b);
builder store_builder(builder to, builder from);
```

## 9892766765d3ea42809a417abbd7ff9ce681b145d05ae6b118a614b38c8ded15/nft-item-editable-DRAFT.fc

```fc
;;
;;  TON NFT Item Smart Contract
;;

{-

    NOTE that this tokens can be transferred within the same workchain.

    This is suitable for most tokens, if you need tokens transferable between workchains there are two solutions:

    1) use more expensive but universal function below to calculate message forward fee for arbitrary destination (see `misc/forward-fee-calc.cs`)

    2) use token holder proxies in target workchain (that way even 'non-universal' token can be used from any workchain)

-}

int min_tons_for_storage();

;;
;;  Storage
;;
;;  uint64 index
;;  MsgAddressInt collection_address
;;  MsgAddressInt owner_address
;;  cell content
;;  MsgAddressInt editor_address
;;

(int, int, slice, slice, cell, slice) load_data();

() store_data(int index, slice collection_address, slice owner_address, cell content, slice editor_address) impure;

() send_msg(slice to_address, int amount, int op, int query_id, builder payload, int send_mode) impure inline;

() transfer_ownership(int my_balance, int index, slice collection_address, slice owner_address, cell content, slice editor_address, slice sender_address, int query_id, slice in_msg_body, int fwd_fees) impure inline;

() transfer_editorship(int my_balance, int index, slice collection_address, slice owner_address, cell content, slice editor_address, slice sender_address, int query_id, slice in_msg_body, int fwd_fees) impure inline;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

;;
;;  GET Methods
;;

(int, int, slice, slice, cell) get_nft_data() method_id;

slice get_editor() method_id;
```

## 9892766765d3ea42809a417abbd7ff9ce681b145d05ae6b118a614b38c8ded15/op-codes.fc

```fc
;; NFTEditable

;; SBT
```

## 9892766765d3ea42809a417abbd7ff9ce681b145d05ae6b118a614b38c8ded15/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;

slice null_addr();
```

## 99b4fea19024646ab737fb257ff3be413176bfc2084534ee7fd8dacf4591b141/imports/constants.fc

```fc
;; operations (constant values taken from crc32 on op message in the companion .tlb files and appear during build)

;; errors

;; other

;; 6905(computational_gas_price) * 1000(cur_gas_price) = 6905000
;; ceil(6905000) = 10000000 ~= 0.01 TON
```

## 99b4fea19024646ab737fb257ff3be413176bfc2084534ee7fd8dacf4591b141/imports/jetton-utils.fc

```fc
cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int status) inline;

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

slice calculate_jetton_wallet_address(cell state_init) inline;

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
```

## 99b4fea19024646ab737fb257ff3be413176bfc2084534ee7fd8dacf4591b141/imports/op-codes.fc

```fc
;; Minter
```

## 99b4fea19024646ab737fb257ff3be413176bfc2084534ee7fd8dacf4591b141/imports/stdlib.fc

```fc
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail);
forall X -> (X, tuple) uncons(tuple list);
forall X -> (tuple, X) list_next(tuple list);
forall X -> X car(tuple list);
tuple cdr(tuple list);
tuple empty_tuple();
forall X -> tuple tpush(tuple t, X value);
forall X -> [X] single(X x);
forall X -> X unsingle([X] t);
forall X, Y -> [X, Y] pair(X x, Y y);
forall X, Y -> (X, Y) unpair([X, Y] t);
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);
forall X -> X first(tuple t);
forall X -> X second(tuple t);
forall X -> X third(tuple t);
forall X -> X fourth(tuple t);
forall X, Y -> X pair_first([X, Y] p);
forall X, Y -> Y pair_second([X, Y] p);
forall X, Y, Z -> X triple_first([X, Y, Z] p);
forall X, Y, Z -> Y triple_second([X, Y, Z] p);
forall X, Y, Z -> Z triple_third([X, Y, Z] p);
forall X -> X null();
const slice_jetton;

int now();
slice my_address();
[int, cell] get_balance();
int cur_lt();
int block_lt();

int cell_hash(cell c);
int slice_hash(slice s);
int string_hash(slice s);

int check_signature(int hash, slice signature, int public_key);
int check_data_signature(slice data, slice signature, int public_key);

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data();
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y);
int max(int x, int y);
(int, int) minmax(int x, int y);
int abs(int x);

slice begin_parse(cell c);
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s);
cell preload_ref(slice s);
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s);
slice skip_bits(slice s, int len);
slice first_bits(slice s, int len);
slice skip_last_bits(slice s, int len);
slice slice_last(slice s, int len);
(slice, cell) load_dict(slice s);
cell preload_dict(slice s);
slice skip_dict(slice s);

(slice, cell) load_maybe_ref(slice s);
cell preload_maybe_ref(slice s);
builder store_maybe_ref(builder b, cell c);

int cell_depth(cell c);

int slice_refs(slice s);
int slice_bits(slice s);
(int, int) slice_bits_refs(slice s);
int slice_depth(slice s);

int builder_refs(builder b);
int builder_bits(builder b);
int builder_depth(builder b);

builder begin_cell();
cell end_cell(builder b);
builder store_ref(builder b, cell c);
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s);
builder store_grams(builder b, int x);
builder store_dict(builder b, cell c);

(slice, slice) load_msg_addr(slice s);
tuple parse_addr(slice s);
(int, int) parse_std_addr(slice s);
(int, slice) parse_var_addr(slice s);

cell idict_set_ref(cell dict, int key_len, int index, cell value);
cell udict_set_ref(cell dict, int key_len, int index, cell value);
cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);
cell new_dict();

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

const builder_jetton;
cell config_param(int x);

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x);
(slice, int) load_coins(slice s);

int equal_slices (slice a, slice b);
builder store_builder(builder to, builder from);
```

## 99b4fea19024646ab737fb257ff3be413176bfc2084534ee7fd8dacf4591b141/imports/utils.fc

```fc
() send_grams(slice address, int amount) impure;
```

## 99b4fea19024646ab737fb257ff3be413176bfc2084534ee7fd8dacf4591b141/jetton-wallet.fc

```fc
#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/constants.fc";
#include "imports/jetton-utils.fc";
#include "imports/op-codes.fc";
#include "imports/utils.fc";
#pragma version >=0.2.0;

{-

NOTE that this tokens can be transferred within the same workchain.

This is suitable for most tokens, if you need tokens transferable between workchains there are two solutions:

1) use more expensive but universal function to calculate message forward fee for arbitrary destination (see `misc/forward-fee-calc.cs`)

2) use token holder proxies in target workchain (that way even 'non-universal' token can be used from any workchain)

-}

const min_tons_for_storage;
const gas_consumption;

{-
  Storage
  storage#_ balance:Coins owner_address:MsgAddressInt jetton_master_address:MsgAddressInt jetton_wallet_code:^Cell = Storage;
-}

(int, slice, slice, cell, int) load_data() inline;

() save_data (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int status) impure inline;

{-
  transfer query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
           response_destination:MsgAddress custom_payload:(Maybe ^Cell)
           forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
           = InternalMsgBody;
  internal_transfer  query_id:uint64 amount:(VarUInteger 16) from:MsgAddress
                     response_address:MsgAddress
                     forward_ton_amount:(VarUInteger 16)
                     forward_payload:(Either Cell ^Cell) 
                     = InternalMsgBody;
-}

() send_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure;

                     ;; 3 messages: wal1->wal2,  wal2->owner, wal2->response
                     ;; but last one is optional (it is ok if it fails)
                     ;; universal message send fee calculation may be activated here
                     ;; by using this instead of fwd_fee
                     ;; msg_fwd_fee(to_wallet, msg_body, state_init, 15)

{-
  internal_transfer  query_id:uint64 amount:(VarUInteger 16) from:MsgAddress
                     response_address:MsgAddress
                     forward_ton_amount:(VarUInteger 16)
                     forward_payload:(Either Cell ^Cell) 
                     = InternalMsgBody;
-}

() receive_tokens (slice in_msg_body, slice sender_address, int my_ton_balance, int fwd_fee, int msg_value) impure;
  ;; NOTE we can not allow fails in action phase since in that case there will be
  ;; no bounce. Thus check and throw in computation phase.

() burn_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure;
  ;; NOTE we can not allow fails in action phase since in that case there will be
  ;; no bounce. Thus check and throw in computation phase.
  ;; ignore custom payload
  ;; slice custom_payload = in_msg_body~load_dict();

() on_bounce (slice in_msg_body) impure;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

(int, slice, slice, cell, _) get_wallet_data() method_id;
```

## 99b4fea19024646ab737fb257ff3be413176bfc2084534ee7fd8dacf4591b141/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;
```

## 9a0f98dd6fbf225eef8165e4e64417ee931f7eea000653439e7b5dcdc0644cd6/imports/constants.fc

```fc
;; operations (constant values taken from crc32 on op message in the companion .tlb files and appear during build)

;; errors

;; other

;; 6905(computational_gas_price) * 1000(cur_gas_price) = 6905000
;; ceil(6905000) = 10000000 ~= 0.01 TON
```

## 9a0f98dd6fbf225eef8165e4e64417ee931f7eea000653439e7b5dcdc0644cd6/imports/discovery-params.fc

```fc
;; moved to the separate file to keep hex of the previous codes unchanged
```

## 9a0f98dd6fbf225eef8165e4e64417ee931f7eea000653439e7b5dcdc0644cd6/imports/jetton-utils.fc

```fc
cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

slice calculate_jetton_wallet_address(cell state_init) inline;

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
```

## 9a0f98dd6fbf225eef8165e4e64417ee931f7eea000653439e7b5dcdc0644cd6/imports/op-codes.fc

```fc
;; Minter
```

## 9a0f98dd6fbf225eef8165e4e64417ee931f7eea000653439e7b5dcdc0644cd6/imports/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;
```

## 9a0f98dd6fbf225eef8165e4e64417ee931f7eea000653439e7b5dcdc0644cd6/imports/utils.fc

```fc
() send_grams(slice address, int amount) impure;
```

## 9a0f98dd6fbf225eef8165e4e64417ee931f7eea000653439e7b5dcdc0644cd6/jetton-minter.fc

```fc
;; Jettons discoverable smart contract

;; storage scheme
;; storage#_ total_supply:Coins admin_address:MsgAddress content:^Cell jetton_wallet_code:^Cell = Storage;

#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/constants.fc";
#include "imports/jetton-utils.fc";
#include "imports/op-codes.fc";
#include "imports/utils.fc";
#include "imports/discovery-params.fc";
#pragma version >=0.2.0;

(int, slice, cell, cell) load_data() inline;

() save_data(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) impure inline;

() mint_tokens(slice to_address, cell jetton_wallet_code, int amount, cell master_msg) impure;

() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure;

(int, int, slice, cell, cell) get_jetton_data() method_id;

slice get_wallet_address(slice owner_address) method_id;
```

## 9a0f98dd6fbf225eef8165e4e64417ee931f7eea000653439e7b5dcdc0644cd6/stdlib.fc

```fc
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail);
forall X -> (X, tuple) uncons(tuple list);
forall X -> (tuple, X) list_next(tuple list);
forall X -> X car(tuple list);
tuple cdr(tuple list);
tuple empty_tuple();
forall X -> tuple tpush(tuple t, X value);
forall X -> [X] single(X x);
forall X -> X unsingle([X] t);
forall X, Y -> [X, Y] pair(X x, Y y);
forall X, Y -> (X, Y) unpair([X, Y] t);
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);
forall X -> X first(tuple t);
forall X -> X second(tuple t);
forall X -> X third(tuple t);
forall X -> X fourth(tuple t);
forall X, Y -> X pair_first([X, Y] p);
forall X, Y -> Y pair_second([X, Y] p);
forall X, Y, Z -> X triple_first([X, Y, Z] p);
forall X, Y, Z -> Y triple_second([X, Y, Z] p);
forall X, Y, Z -> Z triple_third([X, Y, Z] p);
forall X -> X null();

int now();
slice my_address();
[int, cell] get_balance();
int cur_lt();
int block_lt();

int cell_hash(cell c);
int slice_hash(slice s);
int string_hash(slice s);

int check_signature(int hash, slice signature, int public_key);
int check_data_signature(slice data, slice signature, int public_key);

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data();
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y);
int max(int x, int y);
(int, int) minmax(int x, int y);
int abs(int x);

slice begin_parse(cell c);
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s);
cell preload_ref(slice s);
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s);
slice skip_bits(slice s, int len);
slice first_bits(slice s, int len);
slice skip_last_bits(slice s, int len);
slice slice_last(slice s, int len);
(slice, cell) load_dict(slice s);
cell preload_dict(slice s);
slice skip_dict(slice s);

(slice, cell) load_maybe_ref(slice s);
cell preload_maybe_ref(slice s);
builder store_maybe_ref(builder b, cell c);

int cell_depth(cell c);

int slice_refs(slice s);
int slice_bits(slice s);
(int, int) slice_bits_refs(slice s);
int slice_depth(slice s);

int builder_refs(builder b);
int builder_bits(builder b);
int builder_depth(builder b);

builder begin_cell();
cell end_cell(builder b);
builder store_ref(builder b, cell c);
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s);
builder store_grams(builder b, int x);
builder store_dict(builder b, cell c);

(slice, slice) load_msg_addr(slice s);
tuple parse_addr(slice s);
(int, int) parse_std_addr(slice s);
(int, slice) parse_var_addr(slice s);

cell idict_set_ref(cell dict, int key_len, int index, cell value);
cell udict_set_ref(cell dict, int key_len, int index, cell value);
cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);
cell new_dict();

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x);

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x);
(slice, int) load_coins(slice s);

int equal_slices (slice a, slice b);
builder store_builder(builder to, builder from);
```

## 9a3ec14bc098f6b44064c305222caea2800f17dda85ee6a8198a7095ede10dcf/pool.fc

```fc
;; The validator has his own wallet in the masterchain, on which he holds his own coins for operating.
;; From this wallet he sends commands to this nominator pool (mostly `new_stake`, `update_validator_set` and `recover_stake`).
;; Register/vote_for complaints and register/vote_for config proposals are sent from validator's wallet.
;;
;; Pool contract must be in masterchain.
;; Nominators' wallets must be in the basechain.
;; The validator in most cases have two pools (for even and odd validation rounds).

int ADDR_SIZE();
int BOUNCEABLE();
int NON_BOUNCEABLE();
int SEND_MODE_PAY_FEE_SEPARATELY();
int SEND_MODE_IGNORE_ERRORS();
int SEND_MODE_REMAINING_AMOUNT();
int ONE_TON();
int MIN_TONS_FOR_STORAGE();
int DEPOSIT_PROCESSING_FEE();
int MIN_STAKE_TO_SEND();
int VOTES_LIFETIME();

int binary_log_ceil(int x);

;; hex parse same with bridge https://github.com/ton-blockchain/bridge-func/blob/d03dbdbe9236e01efe7f5d344831bf770ac4c613/func/text_utils.fc
(slice, int) ~load_hex_symbol(slice comment);

(slice, int) ~load_text_hex_number(slice comment, int byte_length);

slice make_address(int wc, int addr) inline_ref;

;; https://github.com/ton-blockchain/ton/blob/ae5c0720143e231c32c3d2034cfe4e533a16d969/crypto/block/block.tlb#L584
int is_elector_address(int wc, int addr) inline_ref;

slice elector_address() inline_ref;

;; https://github.com/ton-blockchain/ton/blob/ae5c0720143e231c32c3d2034cfe4e533a16d969/crypto/block/block.tlb#L721
int max_recommended_punishment_for_validator_misbehaviour(int stake) inline_ref;

     ;; https://github.com/ton-blockchain/ton/blob/master/lite-client/lite-client.cpp#L3721

;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/block/block.tlb#L632
;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L118
int get_validator_config() inline_ref;

;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/block/block.tlb#L712
(int, int, cell) get_current_validator_set() inline_ref;
    ;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/block/block.tlb#L579
    ;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/config-code.fc#L49

;; check the validity of the new_stake message
;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L208
int check_new_stake_msg(slice cs) impure inline_ref;

builder pack_nominator(int amount, int pending_deposit_amount) inline_ref;

(int, int) unpack_nominator(slice ds) inline_ref;

cell pack_config(int validator_address, int validator_reward_share, int max_nominators_count, int min_validator_stake, int min_nominator_stake) inline_ref;

(int, int, int, int, int) unpack_config(slice ds) inline_ref;

() save_data(int state, int nominators_count, int stake_amount_sent, int validator_amount, cell config, cell nominators, cell withdraw_requests, int stake_at, int saved_validator_set_hash, int validator_set_changes_count, int validator_set_change_time, int stake_held_for, cell config_proposal_votings) impure inline_ref;

(int, int, int, int, (int, int, int, int, int), cell, cell, int, int, int, int, int, cell) load_data() inline_ref {
    );

() send_msg(slice to_address, int amount, cell payload, int flags, int send_mode) impure inline_ref;

() send_excesses(slice sender_address) impure inline_ref;

(cell, cell, int, int) withdraw_nominator(int address, cell nominators, cell withdraw_requests, int balance, int nominators_count) impure inline_ref;

(cell, cell, int, int) process_withdraw_requests(cell nominators, cell withdraw_requests, int balance, int nominators_count, int limit) impure inline_ref;

int calculate_total_nominators_amount(cell nominators) inline_ref;

cell distribute_share(int reward, cell nominators) inline_ref;

() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure;

                ;; `new_stake` from nominator-pool should always be handled without throws by elector
                ;; because nominator-pool do `check_new_stake_msg` and `msg_value` checks before sending `new_stake`.
                ;; If the stake is not accepted elector will send `new_stake_error` response message.
                ;; Nevertheless we do process theoretically possible bounced `new_stake`.

        ;; We use simple text comments for nominator operations so nominators can do it from any wallet app.
        ;; In other cases, they will need to put a stake on a browser extension, or use scripts, which can be inconvenient.

        ;; Throw on any unexpected request so that the stake is bounced back to the nominator in case of a typo.

                ;; require higher fee to prevent dictionary spam

                        ;; even this should never happen

            ;; else just accept coins from elector

            ;; throw on any unexpected request so that the coins is bounced back to the sender in case of a typo

                ;; just accept coins

                ;; We need to take all credits from the elector at once,
                ;; because if we do not take all at once, then it will be processed as a fine by pool.
                ;; In the elector, credits (`credit_to`) are accrued in three places:
                ;; 1) return of surplus stake in elections (`try_elect`)
                ;; 2) reward for complaint when punish (`punish`) - before unfreezing
                ;; 3) unfreeze round (`unfreeze_without_bonuses`/`unfreeze_with_bonuses`)
                ;; We need to be guaranteed to wait for unfreezing round and only then send `recover_stake`.
                ;; So we are waiting for the change of 3 validator sets.

                ;; ADDITIONAL NOTE:
                ;; In a special case (if the network was down), the config theoretically can refuse the elector to save a new round after election - https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/config-code.fc#L494
                ;; and the elector will start a new election - https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L364
                ;; in this case, our pool will have to skip the round, but it will be able to recover stake later

                ;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L887

            ;; message from validator

                ;; the validator can withdraw everything that does not belong to the nominators

;; Get methods

_ get_pool_data() method_id;

int has_withdraw_requests() method_id;

(int, int, int) get_nominator_data(int nominator_address) method_id;

int get_max_punishment(int stake) method_id;

tuple list_nominators() method_id;

tuple list_votes() method_id;

tuple list_voters(int proposal_hash) method_id;
```

## 9a3ec14bc098f6b44064c305222caea2800f17dda85ee6a8198a7095ede10dcf/stdlib.fc

```fc
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail);
forall X -> (X, tuple) uncons(tuple list);
forall X -> (tuple, X) list_next(tuple list);
forall X -> X car(tuple list);
tuple cdr(tuple list);
tuple empty_tuple();
forall X -> tuple tpush(tuple t, X value);
forall X -> [X] single(X x);
forall X -> X unsingle([X] t);
forall X, Y -> [X, Y] pair(X x, Y y);
forall X, Y -> (X, Y) unpair([X, Y] t);
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);
forall X -> X first(tuple t);
forall X -> X second(tuple t);
forall X -> X third(tuple t);
forall X -> X fourth(tuple t);
forall X, Y -> X pair_first([X, Y] p);
forall X, Y -> Y pair_second([X, Y] p);
forall X, Y, Z -> X triple_first([X, Y, Z] p);
forall X, Y, Z -> Y triple_second([X, Y, Z] p);
forall X, Y, Z -> Z triple_third([X, Y, Z] p);
forall X -> X null();

int now();
slice my_address();
[int, cell] get_balance();
int cur_lt();
int block_lt();

int cell_hash(cell c);
int slice_hash(slice s);
int string_hash(slice s);

int check_signature(int hash, slice signature, int public_key);
int check_data_signature(slice data, slice signature, int public_key);

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data();
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y);
int max(int x, int y);
(int, int) minmax(int x, int y);
int abs(int x);

slice begin_parse(cell c);
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s);
cell preload_ref(slice s);
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s);
slice skip_bits(slice s, int len);
slice first_bits(slice s, int len);
slice skip_last_bits(slice s, int len);
slice slice_last(slice s, int len);
(slice, cell) load_dict(slice s);
cell preload_dict(slice s);
slice skip_dict(slice s);

(slice, cell) load_maybe_ref(slice s);
cell preload_maybe_ref(slice s);
builder store_maybe_ref(builder b, cell c);

int cell_depth(cell c);

int slice_refs(slice s);
int slice_bits(slice s);
(int, int) slice_bits_refs(slice s);
int slice_depth(slice s);

int builder_refs(builder b);
int builder_bits(builder b);
int builder_depth(builder b);

builder begin_cell();
cell end_cell(builder b);
builder store_ref(builder b, cell c);
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s);
builder store_grams(builder b, int x);
builder store_dict(builder b, cell c);

(slice, slice) load_msg_addr(slice s);
tuple parse_addr(slice s);
(int, int) parse_std_addr(slice s);
(int, slice) parse_var_addr(slice s);

cell idict_set_ref(cell dict, int key_len, int index, cell value);
cell udict_set_ref(cell dict, int key_len, int index, cell value);
cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);
cell new_dict();

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x);

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x);
(slice, int) load_coins(slice s);
```

## 9aca9b66fd183d5faea3375990adb13c11f5fa29556331dfcd1cd9d36ea4567c/contract/contracts/contract.tact

```tact
import "@stdlib/ownable";
import "./messages";
import "./jetton";

contract FeeJetton with Jetton {
    total_supply: Int as coins;
    mintable: Bool;
    owner: Address;
    content: Cell;
    init(owner: Address, content: Cell);
    receive(msg: Mint);
    require(ctx.sender == self.owner, "Not owner");;
    require(self.mintable, "Not mintable");;
    receive("Owner: MintClose");
    require(ctx.sender == self.owner, "Not owner");;
}

@interface("org.ton.ownable.transferable.v2")
trait Jetton with OwnableTransferable {
total_supply: Int;
mintable: Bool;
owner: Address;
content: Cell;

receive(msg: TokenBurnNotification);

receive(msg: ProvideWalletAddress);

fun mint(to: Address, amount: Int, response_destination: Address);

fun requireSenderAsWalletOwner(owner: Address);

virtual fun getJettonWalletInit(address: Address): StateInit {
}

get fun get_jetton_data(): JettonData {
total_supply: self.total_supply,
mintable: self.mintable,
owner: self.owner,
content: self.content,
wallet_code: initOf JettonDefaultWallet(self.owner, myAddress()).code
};
}

get fun get_wallet_address(owner: Address): Address {
}
}
```

## 9aca9b66fd183d5faea3375990adb13c11f5fa29556331dfcd1cd9d36ea4567c/contract/contracts/messages.tact

```tact
struct JettonData {
    total_supply: Int;
    mintable: Bool;
    owner: Address;
    content: Cell;
    wallet_code: Cell;
}

struct JettonWalletData {
    balance: Int;
    owner: Address;
    master: Address;
    code: Cell;
}

message(0xf8a7ea5) TokenTransfer {
    query_id: Int as uint64;
    amount: Int as coins;
    destination: Address;
    response_destination: Address?;
    custom_payload: Cell?;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining;
}

message(0x178d4519) TokenTransferInternal {
    query_id: Int as uint64;
    amount: Int as coins;
    from: Address;
    response_destination: Address?;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining;
}

message(0x7362d09c) TokenNotification {
    query_id: Int as uint64;
    amount: Int as coins;
    from: Address;
    forward_payload: Slice as remaining;
}

message(0x595f07bc) TokenBurn {
    query_id: Int as uint64;
    amount: Int as coins;
    response_destination: Address?;
    custom_payload: Cell?;
}

message(0x7bdd97de) TokenBurnNotification {
    query_id: Int as uint64;
    amount: Int as coins;
    sender: Address;
    response_destination: Address?;
    send_excess: Bool;
}

message(0xd53276db) TokenExcesses {
    query_id: Int as uint64;
}

message(0x2c76b973) ProvideWalletAddress {
    query_id: Int as uint64;
    owner_address: Address;
    include_address: Bool;
}

message(0xd1735400) TakeWalletAddress {
    query_id: Int as uint64;
    wallet_address: Address;
    owner_address: Slice as remaining;
}

message Mint {
    amount: Int;
    receiver: Address;
}
```

## 9aca9b66fd183d5faea3375990adb13c11f5fa29556331dfcd1cd9d36ea4567c/contract/contracts/sasha_50sell_3buy/jetton.tact

```tact
import "./messages";

@interface("org.ton.jetton.wallet")
contract JettonDefaultWallet {
    balance: Int as coins;
    owner: Address;
    master: Address;
    is_dex_vault: Bool;
    init(owner: Address, master: Address);
    receive(msg: TokenTransfer);
    require(ctx.sender == self.owner, "Invalid sender");;
    require(ctx.value > final, "Invalid value");;
    require(self.balance >= 0, "Invalid balance");;
    if (!msg.forward_payload.empty() && msg.forward_payload.refs() >= 1);
    if (fwdSlice.bits() >= 32 && fwdSlice.loadUint(32) == 0xe3a0d482);
    if (is_buy || is_sell);
    if (is_buy);
    if (msg.forward_ton_amount < 0);
    to: wallet_address,;
    value: ctx.value - ton("0.03"),;
    mode: 0,;
    bounce: false,;
    body: TokenTransferInternal{;
    query_id: msg.query_id,;
    amount: msg.amount,;
    from: self.owner,;
    response_destination: msg.response_destination,;
    forward_ton_amount: msg.forward_ton_amount,;
    forward_payload: msg.forward_payload;
    code: init.code,;
    data: init.data;
    to: fee_wallet_address,;
    value: ton_for_fee,;
    mode: 0,;
    bounce: false,;
    body: TokenTransferInternal{;
    query_id: 888,;
    amount: calculated_fee,;
    from: self.owner,;
    response_destination: msg.response_destination,;
    forward_ton_amount: 0,;
    forward_payload: emptySlice();
    to: wallet_address,;
    value: 0,;
    mode: SendRemainingValue,;
    bounce: false,;
    body: TokenTransferInternal{;
    query_id: msg.query_id,;
    amount: msg.amount,;
    from: self.owner,;
    response_destination: msg.response_destination,;
    forward_ton_amount: msg.forward_ton_amount,;
    forward_payload: msg.forward_payload;
    code: init.code,;
    data: init.data;
    receive(msg: TokenTransferInternal);
    if (ctx.sender != self.master);
    require(contractAddress(sinit) == ctx.sender, "Invalid sender!");;
    require(self.balance >= 0, "Invalid balance");;
    if (msg.forward_ton_amount > 0);
    if (!self.is_dex_vault && msg.forward_payload.refs() >= 1);
    if (fwdSlice.bits() >= 32 && fwdSlice.loadUint(32) == 0x40e108d6);
    to: self.owner,;
    value: msg.forward_ton_amount,;
    mode: SendPayGasSeparately,;
    bounce: false,;
    body: TokenNotification {;
    query_id: msg.query_id,;
    amount: msg.amount,;
    from: msg.from,;
    forward_payload: msg.forward_payload;
    if (msg.response_destination != null && msg_value > 0);
    to: msg.response_destination!!,;
    value: msg_value,;
    bounce: false,;
    body: TokenExcesses { query_id: msg.query_id }.toCell(),;
    mode: SendPayGasSeparately;
    receive(msg: TokenBurn);
    require(ctx.sender == self.owner, "Invalid sender");;
    require(self.balance >= 0, "Invalid balance");;
    require(ctx.value > fwd_fee + 2 * self.gasConsumption + self.minTonsForStorage, "Invalid value - Burn");;
    to: self.master,;
    value: 0,;
    mode: SendRemainingValue,;
    bounce: true,;
    body: TokenBurnNotification {;
    query_id: msg.query_id,;
    amount: msg.amount,;
    sender: self.owner,;
    response_destination: msg.response_destination!!,;
    send_excess: true;
    fun msg_value(value: Int): Int;
    bounced(msg: bounced<TokenTransferInternal>);
    bounced(msg: bounced<TokenBurnNotification>);
    get fun get_wallet_data(): JettonWalletData;
    balance: self.balance,;
    owner: self.owner,;
    master: self.master,;
    code: (initOf JettonDefaultWallet(self.owner, self.master)).code;
    get fun is_dexvault(): Bool;
}
```

## 9aefd6c40111910fb4ea3a6c1160cd8b9a45b74a5ea19802ff51798b6359a092/imports/constants.fc

```fc
;; operations (constant values taken from crc32 on op message in the companion .tlb files and appear during build)

;; errors

;; other

;; 6905(computational_gas_price) * 1000(cur_gas_price) = 6905000
;; ceil(6905000) = 10000000 ~= 0.01 TON
```

## 9aefd6c40111910fb4ea3a6c1160cd8b9a45b74a5ea19802ff51798b6359a092/imports/discovery-params.fc

```fc
;; moved to the separate file to keep hex of the previous codes unchanged
```

## 9aefd6c40111910fb4ea3a6c1160cd8b9a45b74a5ea19802ff51798b6359a092/imports/jetton-utils.fc

```fc
cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

slice calculate_jetton_wallet_address(cell state_init) inline;

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
```

## 9aefd6c40111910fb4ea3a6c1160cd8b9a45b74a5ea19802ff51798b6359a092/imports/op-codes.fc

```fc
;; Minter
```

## 9aefd6c40111910fb4ea3a6c1160cd8b9a45b74a5ea19802ff51798b6359a092/imports/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;
```

## 9aefd6c40111910fb4ea3a6c1160cd8b9a45b74a5ea19802ff51798b6359a092/imports/stdlib.fc

```fc
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail);

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list);

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list);

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list);

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list);

;;; Creates tuple with zero elements.
tuple empty_tuple();

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value);

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x);

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t);

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y);

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t);

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z);

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t);

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w);

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t);

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t);

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t);

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t);

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t);

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p);

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p);

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p);

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p);

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p);

;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null();

;;; Moves a variable [x] to the top of the stack

;;; Returns the current Unix time as an Integer
int now();

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address();

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance();

;;; Returns the logical time of the current transaction.
int cur_lt();

;;; Returns the starting logical time of the current block.
int block_lt();

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c);

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s);

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s);

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key);

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key);

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data();

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y);

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y);

;;; Sorts two integers.
(int, int) minmax(int x, int y);

;;; Computes the absolute value of an integer [x].
int abs(int x);

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}

;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c);

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s);

;;; Preloads the first reference from the slice.
cell preload_ref(slice s);

{- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s);
(slice, int) load_coins(slice s);

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len);

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len);

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len);

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len);

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s);

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s);

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s);

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s);

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s);

;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c);

{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s);

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s);

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s);

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).

;;; Checks whether `slice` [s] has no bits of data.

;;; Checks whether `slice` [s] has no references.

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s);

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b);

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b);

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b);

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell();

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b);

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c);

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";

;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s);

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x);
builder store_coins(builder b, int x);

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c);

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c);

{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
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
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s);

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s);

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s);

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s);

{-
  # Dictionary primitives
-}

;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value);

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value);

cell idict_get_ref(cell dict, int key_len, int index);
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value);
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value);
cell idict_set(cell dict, int key_len, int index, slice value);
cell dict_set(cell dict, int key_len, slice index, slice value);
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value);
cell idict_set_builder(cell dict, int key_len, int index, builder value);
cell dict_set_builder(cell dict, int key_len, slice index, builder value);
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len);
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len);
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len);
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len);

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict();
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.

{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x);
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
;;; Returns the current random seed as an unsigned 256-bit Integer.
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b);
int equal_slices(slice a, slice b);

;;; Concatenates two builders
builder store_builder(builder to, builder from);
```

## 9aefd6c40111910fb4ea3a6c1160cd8b9a45b74a5ea19802ff51798b6359a092/imports/utils.fc

```fc
() send_grams(slice address, int amount) impure;
```

## 9aefd6c40111910fb4ea3a6c1160cd8b9a45b74a5ea19802ff51798b6359a092/jetton-minter-discoverable.fc

```fc
;; Jettons discoverable smart contract

#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/constants.fc";
#include "imports/jetton-utils.fc";
#include "imports/op-codes.fc";
#include "imports/utils.fc";
#include "imports/discovery-params.fc";

;; 6905(computational_gas_price) * 1000(cur_gas_price) = 6905000
;; ceil(6905000) = 10000000 ~= 0.01 TON
int provide_address_gas_consumption();

;; storage scheme
;; storage#_ total_supply:Coins admin_address:MsgAddress content:^Cell jetton_wallet_code:^Cell = Storage;

(int, slice, cell, cell) load_data() inline;

() save_data(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) impure inline;

() mint_tokens(slice to_address, cell jetton_wallet_code, int amount, cell master_msg) impure;

() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure;

(int, int, slice, cell, cell) get_jetton_data() method_id;

slice get_wallet_address(slice owner_address) method_id;
```

## 9aefd6c40111910fb4ea3a6c1160cd8b9a45b74a5ea19802ff51798b6359a092/jetton-wallet.fc

```fc
;; Jetton Wallet Smart Contract

#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/constants.fc";
#include "imports/jetton-utils.fc";
#include "imports/op-codes.fc";
#include "imports/utils.fc";

{-

NOTE that this tokens can be transferred within the same workchain.

This is suitable for most tokens, if you need tokens transferable between workchains there are two solutions:

1) use more expensive but universal function to calculate message forward fee for arbitrary destination (see `misc/forward-fee-calc.cs`)

2) use token holder proxies in target workchain (that way even 'non-universal' token can be used from any workchain)

-}

int min_tons_for_storage();
;; Note that 2 * gas_consumptions is expected to be able to cover fees on both wallets (sender and receiver)
;; and also constant fees on inter-wallet interaction, in particular fwd fee on state_init transfer
;; that means that you need to reconsider this fee when:
;; a) jetton logic become more gas-heavy
;; b) jetton-wallet code (sent with inter-wallet message) become larger or smaller
;; c) global fee changes / different workchain
int gas_consumption();

{-
  Storage
  storage#_ balance:Coins owner_address:MsgAddressInt jetton_master_address:MsgAddressInt jetton_wallet_code:^Cell = Storage;
-}

(int, slice, slice, cell) load_data() inline;

() save_data (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) impure inline;

{-
  transfer query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
           response_destination:MsgAddress custom_payload:(Maybe ^Cell)
           forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
           = InternalMsgBody;
  internal_transfer  query_id:uint64 amount:(VarUInteger 16) from:MsgAddress
                     response_address:MsgAddress
                     forward_ton_amount:(VarUInteger 16)
                     forward_payload:(Either Cell ^Cell) 
                     = InternalMsgBody;
-}

;; transfer: Yêu cầu chuyển Jetton từ A đến B
;; internal_transfer: Yêu cầu gửi từ contract jetton wallet của A đến contract jetton wallet của B
;; transfer, địa chỉ người gửi, TON, fee forward
() send_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure;
  ;; query_id
  ;; amount: Số lượng Jettion Alice gửi
  ;; destination: Địa chỉ ví của Bob
  ;; Phân tích địa chỉ chuẩn TON (Standard Address) thành các thành phần cấu thành của nó, cụ thể là workchain_id và account_id. Trả về lỗi nếu workchain_id != workchain contract đang chạy
  ;; balance jetton trong ví, địa chỉ chủ sở hữu ví, địa chỉ hợp đồng jetton master, mã hợp đồng ví jetton wallet
  ;; Trừ jetton chuyển đi

  ;; Kiểm tra địa chỉ người gửi và địa chỉ chủ sở hữu jetton wallet
  ;; balance sau khi chuyển tiền >=0

  ;; Lấy ra state_init jetton wallet của người nhận
  ;; Tạo địa chỉ ví cho người nhận dựa trên state_init

  ;; response_destination: Địa chỉ nhận phản hồi xác nhận việc chuyển tiền từ Bob
  ;; custom_payload: Dữ liệu metadata tuỳ chỉnh
  ;; forward_ton_amount: Số lượng TON gửi kèm tới Bob
  ;; forward_payload: Dữ liệu metadata gửi kèm tới Bob kèm forward_ton_amount

    ;; 3 messages: wal1->wal2,  wal2->owner, wal2->response
    ;; but last one is optional (it is ok if it fails)
  ;; universal message send fee calculation may be activated here
  ;; by using this instead of fwd_fee
  ;; msg_fwd_fee(to_wallet, msg_body, state_init, 15)

{-
  internal_transfer  query_id:uint64 amount:(VarUInteger 16) from:MsgAddress
                     response_address:MsgAddress
                     forward_ton_amount:(VarUInteger 16)
                     forward_payload:(Either Cell ^Cell) 
                     = InternalMsgBody;
