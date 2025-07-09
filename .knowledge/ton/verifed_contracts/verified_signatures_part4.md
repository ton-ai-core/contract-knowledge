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

## 9bf8dcf4441db14461b87ba45bb7b6b17d4b26e214fcf214c915eba0006b1fac/imports/stdlib.fc

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

## 9bf8dcf4441db14461b87ba45bb7b6b17d4b26e214fcf214c915eba0006b1fac/main.fc

```fc
#include "imports/stdlib.fc";

const const::min_tons_for_storage;

(int, slice, slice) load_data() inline;

() save_data(int counter_value, slice recent_sender, slice owner_address) impure inline;

() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure;

(int, slice, slice) get_contract_storage_data() method_id;

int balance() method_id;
```

## 9e06ca30e508a6d9fb21167cbb8f66399edd1190b0b01e0bbd14c546cc97a72b/config.fc

```fc
const int STATE_BURN_SUSPENDED;
const int STATE_SWAPS_SUSPENDED;
const int STATE_GOVERNANCE_SUSPENDED;
const int STATE_COLLECTOR_SIGNATURE_REMOVAL_SUSPENDED;

(int, int, cell, int, int, int, int, int, int, int) get_jetton_bridge_config() impure inline_ref;

    ;; key: uint256 (public key) value: uint256 (eth address)
```

## 9e06ca30e508a6d9fb21167cbb8f66399edd1190b0b01e0bbd14c546cc97a72b/errors.fc

```fc
;; global errors
const int error::inbound_message_has_empty_body;
const int error::unknown_op;
const int error::unknown_execute_voting_op;

;; data errors
const int error::incorrect_voting_data;
const int error::decimals_out_of_range;

;; wrong sender errors
const int error::oracles_sender;
const int error::oracles_not_sender;
const int error::minter_not_sender;
const int error::bridge_not_sender;
const int error::owner_not_sender;
const int error::operation_suspended;

;; jetton wallet errors
const int error::unauthorized_transfer;
const int error::not_enough_funds;
const int error::unauthorized_incoming_transfer;
const int error::malformed_forward_payload;
const int error::not_enough_tons;
const int error::burn_fee_not_matched;

;; jetton minter errors
const int error::discovery_fee_not_matched;

;; jetton bridge errors
const int error::wrong_external_chain_id;
const int error::wrong_sender_workchain;
const int error::mint_fee_not_matched;
const int error::mint_fee_less_forward;

const int error::no_bridge_config;
```

## 9e06ca30e508a6d9fb21167cbb8f66399edd1190b0b01e0bbd14c546cc97a72b/jetton-wallet.fc

```fc
;; Jetton Wallet Smart Contract

#include "stdlib.fc";
#include "params.fc";
#include "op-codes.fc";
#include "messages.fc";
#include "utils.fc";
#include "errors.fc";
#include "config.fc";

{-

NOTE that this tokens can be transferred within the same workchain.

This is suitable for most tokens, if you need tokens transferable between workchains there are two solutions:

1) use more expensive but universal function to calculate message forward fee for arbitrary destination (see `misc/forward-fee-calc.cs`)

2) use token holder proxies in target workchain (that way even 'non-universal' token can be used from any workchain)

-}

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

() send_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee, int wallet_min_tons_for_storage, int wallet_gas_consumption) impure;

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

() receive_tokens (slice in_msg_body, slice sender_address, int my_ton_balance, int fwd_fee, int msg_value, int wallet_min_tons_for_storage, int wallet_gas_consumption) impure;
  ;; NOTE we can not allow fails in action phase since in that case there will be
  ;; no bounce. Thus check and throw in computation phase.

() burn_tokens (slice in_msg_body, slice sender_address) impure;
  ;; NOTE we can not allow fails in action phase since in that case there will be
  ;; no bounce. Thus check and throw in computation phase.

() on_bounce (slice in_msg_body) impure;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

(int, slice, slice, cell) get_wallet_data() method_id;
```

## 9e06ca30e508a6d9fb21167cbb8f66399edd1190b0b01e0bbd14c546cc97a72b/messages.fc

```fc
const int BOUNCEABLE;
const int NON_BOUNCEABLE;

const int SEND_MODE_REGULAR;
const int SEND_MODE_PAY_FEES_SEPARETELY;
const int SEND_MODE_IGNORE_ERRORS;
const int SEND_MODE_DESTROY;
const int SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE;
const int SEND_MODE_CARRY_ALL_BALANCE;

builder store_msg_flags(builder b, int msg_flag) inline;

{-
  Helpers below fill in default/overwritten values of message layout:
  Relevant part of TL-B schema:
  ... other:ExtraCurrencyCollection ihr_fee:Grams fwd_fee:Grams created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  bits      1                               4             4                64                32                            
  ... init:(Maybe (Either StateInit ^StateInit))  body:(Either X ^X) = Message X;
  bits      1      1(if prev is true)                   1

-}

builder store_msgbody_prefix_stateinit(builder b) inline;
builder store_msgbody_prefix_slice(builder b) inline;
builder store_msgbody_prefix_ref(builder b) inline;

{-

addr_std$10 anycast:(Maybe Anycast) 
   workchain_id:int8 address:bits256  = MsgAddressInt;
-}

builder store_masterchain_address(builder b, int address_hash) inline;
```

## 9e06ca30e508a6d9fb21167cbb8f66399edd1190b0b01e0bbd14c546cc97a72b/op-codes.fc

```fc
;; Jettons

const int op::transfer;
const int op::transfer_notification;
const int op::internal_transfer;
const int op::excesses;
const int op::burn;
const int op::burn_notification;

;; Minter
const int op::mint;

;; Bridge

const int op::execute_voting;
const int op::execute_voting::swap;
const int op::execute_voting::get_reward;
const int op::execute_voting::change_collector;

const int op::pay_swap;

(slice, int) ~load_op(slice s) inline;
(slice, int) ~load_query_id(slice s) inline;
builder store_op(builder b, int op) inline;
builder store_query_id(builder b, int query_id) inline;
builder store_body_header(builder b, int op, int query_id) inline;
```

## 9e06ca30e508a6d9fb21167cbb8f66399edd1190b0b01e0bbd14c546cc97a72b/params.fc

```fc
const int CONFIG_PARAM_ID;
const int MY_CHAIN_ID;
const int LOG_BURN;
const int LOG_SWAP_PAID;
const int LOG_MINT_ON_MINTER;
const int LOG_BURN_ON_MINTER;

const int WORKCHAIN;

() force_chain(slice addr) impure;
```

## 9e06ca30e508a6d9fb21167cbb8f66399edd1190b0b01e0bbd14c546cc97a72b/stdlib.fc

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

() set_seed(int) impure asm "SETRAND";
() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x);
(slice, int) load_coins(slice s);

int equal_slices (slice a, slice b);
builder store_builder(builder to, builder from);
```

## 9e06ca30e508a6d9fb21167cbb8f66399edd1190b0b01e0bbd14c546cc97a72b/utils.fc

```fc
#include "messages.fc";
#include "op-codes.fc";

cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

slice create_address(int wc, int address_hash) inline;

slice calculate_address_by_state_init(cell state_init) inline;

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

() send_receipt_message(addr, ans_tag, query_id, body, grams, mode) impure inline_ref;

;; LIMITS:
;; chainId: uint32 (it seems EVM chainId is uint256, but for our cases 32 bits is enough https://chainlist.org/)
;; token address in EVM network: 160 bit (an Ethereum address is a 42-character hexadecimal address derived from the last 20 bytes of the public key controlling the account with 0x appended in front. e.g., 0x71C7656EC7ab88b098defB751B7401B5f6d8976F - https://info.etherscan.com/what-is-an-ethereum-address)
;; decimals: uint8 (ERC-20 has uint8 decimals - https://eips.ethereum.org/EIPS/eip-20)
(int, int, int) unpack_wrapped_token_data(cell data) inline;

;; https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#data-serialization
cell pack_metadata_value(slice a) inline;

slice encode_number_to_text(int decimals, int radix);

() emit_log_simple (int event_id, cell data, int need_separate_cell) impure inline;
    ;; 1023 - (4+2+9+256+64+32+2) = 654 bit free
```

## 9ffe14989a82dd5e0ec22a6f2a14f784a72c347d7552c6f220d9c3e13b7e2778/dns-utils.fc

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

## 9ffe14989a82dd5e0ec22a6f2a14f784a72c347d7552c6f220d9c3e13b7e2778/root-dns.fc

```fc
;; Root DNS resolver 2.0 in masterchain
;; Added support for ".t.me" domain zone (https://t.me/tonblockchain/167), in addition to ".ton" domain zone.
;; Added redirect from short "www.ton" to "foundation.ton" domain
;; compiled by FunC https://github.com/ton-blockchain/ton/tree/20758d6bdd0c1327091287e8a620f660d1a9f4da

(slice, slice, slice) load_data() inline;

(int, cell) dnsresolve(slice subdomain, int category) method_id;

() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure;
```

## 9ffe14989a82dd5e0ec22a6f2a14f784a72c347d7552c6f220d9c3e13b7e2778/stdlib.fc

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

## a01e057fbd4288402b9898d78d67bd4e90254c93c5866879bc2d1d12865436bc/contracts/order.func

```func
#include "imports/stdlib.fc";
#include "types.func";
#include "op-codes.func";
#include "messages.func";
#include "errors.func";

;; DATA

global slice multisig_address;;
global int order_seqno;;
global int threshold;;
global int sent_for_execution?;;
global cell signers;;
global int approvals_mask;;
global int approvals_num;;
global int expiration_date;;
global cell order;;

() load_data() impure inline;

        ;; not initialized yet

() save_data() impure inline;

;; UTILS

slice get_text_comment(slice in_msg_body) impure inline;

    ;;combine comment into one slice
        ;; store all bits from current cell
        ;; it's ok to overflow here, it means that comment is incorrect
        ;;and go to the next

(int, int) find_signer_by_address(slice signer_address) impure inline;

() add_approval(int signer_index) impure inline;

() try_execute(int query_id) impure inline_ref;

() approve(int signer_index, slice response_address, int query_id) impure inline_ref;

;; RECEIVE

() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body);

        ;; message with text comment

            ;; Let's init

            ;; order is inited second time, if it is inited by another oracle
            ;; we count it as approval

;; GET-METHODS

_ get_order_data() method_id;
```

## a01e057fbd4288402b9898d78d67bd4e90254c93c5866879bc2d1d12865436bc/errors.func

```func
const int error::unauthorized_new_order;
const int error::invalid_new_order;
const int error::not_enough_ton;
const int error::unauthorized_execute;
const int error::singers_outdated;
const int error::invalid_dictionary_sequence;
const int error::unauthorized_init;
const int error::already_inited;
const int error::unauthorized_sign;
const int error::already_approved;
const int error::inconsistent_data;
const int error::invalid_threshold;
const int error::invalid_signers;
const int error::expired;
const int error::already_executed;

const int error::unknown_op;
```

## a01e057fbd4288402b9898d78d67bd4e90254c93c5866879bc2d1d12865436bc/imports/stdlib.fc

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

const int CELL_BITS;
const int CELL_REFS;

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

builder store_op_and_query_id(builder b, int op, int query_id) inline;

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
```

## a01e057fbd4288402b9898d78d67bd4e90254c93c5866879bc2d1d12865436bc/messages.func

```func
#include "imports/stdlib.fc";
#include "types.func";

;; @see stdlib.fc#746

;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L155
;;
;;message$_ {X:Type} info:CommonMsgInfoRelaxed
;;  init:(Maybe (Either StateInit ^StateInit))
;;  body:(Either X ^X) = MessageRelaxed X;
;;
;;_ (Message Any) = MessageAny;

() send_message_with_only_body(slice to_address, int amount, builder body, int msg_flags, int send_mode) impure inline_ref;

        ;; store body in slice, may overflow
        ;; overflowed, lets store in ref

() send_message_with_state_init_and_body(slice to_address, int amount, cell state_init, builder body, int msg_flags, int send_mode) impure inline_ref;

        ;; store body in slice, may overflow
        ;; overflowed, lets store in ref
```

## a01e057fbd4288402b9898d78d67bd4e90254c93c5866879bc2d1d12865436bc/op-codes.func

```func
const int op::new_order;
const int op::execute;
const int op::execute_internal;

const int op::init;
const int op::approve;
const int op::approve_accepted;
const int op::approve_rejected;

const int actions::send_message;
const int actions::update_multisig_params;
```

## a01e057fbd4288402b9898d78d67bd4e90254c93c5866879bc2d1d12865436bc/types.func

```func
;; Multisig types

#include "imports/stdlib.fc";

;; Alias for load_ref
(slice, cell) load_nonempty_dict(slice s);

;; alias for store_ref
builder store_nonempty_dict(builder b, cell c);

const int TIMESTAMP_SIZE;

(slice, int) ~load_timestamp(slice s) inline;
builder store_timestamp(builder b, int timestamp) inline;

const int HASH_SIZE;

(slice, int) ~load_hash(slice s) inline;
builder store_hash(builder b, int hash) inline;

{- By index we mean index of signer in signers dictionary. The same type is used
   for threshold, singers number and for proposers indexes -}
const int INDEX_SIZE;
const int MASK_SIZE;

(slice, int) ~load_index(slice s) inline;
builder store_index(builder b, int index) inline;

const int ACTION_INDEX_SIZE;

const int ORDER_SEQNO_SIZE;
const int MAX_ORDER_SEQNO;

(slice, int) ~load_order_seqno(slice s) inline;
builder store_order_seqno(builder b, int seqno) inline;
```

## a0cfc2c48aee16a271f2cfc0b7382d81756cecb1017d077faaab3bb602f6868c/wallet_v1_r1.fif

```fif
#!/usr/bin/fift -s
"TonUtil.fif" include
"Asm.fif" include
<{  SETCP0 DUP IFNOTRET INC 32 THROWIF  // return if recv_internal, fail unless recv_external
    512 INT LDSLICEX DUP 32 PLDU   // sign cs cnt
    c4 PUSHCTR CTOS 32 LDU 256 LDU ENDS  // sign cs cnt cnt' pubk
    s1 s2 XCPU            // sign cs cnt pubk cnt' cnt
    EQUAL 33 THROWIFNOT   // ( seqno mismatch? )
    s2 PUSH HASHSU        // sign cs cnt pubk hash
    s0 s4 s4 XC2PU        // pubk cs cnt hash sign pubk
    CHKSIGNU              // pubk cs cnt ?
    34 THROWIFNOT         // signature mismatch
    ACCEPT
    SWAP 32 LDU NIP
    DUP SREFS IF:<{
      8 LDU LDREF         // pubk cnt mode msg cs
      s0 s2 XCHG SENDRAWMSG  // pubk cnt cs ; ( message sent )
    }>
    ENDS
    INC NEWC 32 STU 256 STU ENDC c4 POPCTR
}>c
```

## a0d7cf47c3df99e8f611a754d4b241497e1670f2d5533261eff3877872382481/contract/contracts/ft_base_program_main.tact

```tact
import "@stdlib/ownable";
import "@stdlib/deploy";

import "./ft_base_program_user.tact";
import "./ft_user_storage.tact";
import "./ft_user_main.tact";

contract FtBaseProgramMain with Deployable, Ownable {
    gasMultiplier: Int as coins;
    isSetup: Bool;
    owner: Address;
    master: Address;
    recipient: Address;
    levelPrices: map<Int as uint8, Int>;
    levelFees: map<Int as uint8, Int>;
    totalProfit: Int as coins;
    init(master: Address);
    nativeThrowUnless(132, sender() == master);;
    receive();
    receive("PaymentForSquadCreation");
    receive("withdraw");
    nativeReserve(self.minTonsForStorage, 0);;
    to: self.recipient,;
    value: 0,;
    mode: SendRemainingBalance,;
    body: "Your withdraw".asComment(),;
    receive(msg: SetupBaseProgramMain);
    nativeThrowUnless(132, sender() == self.master);;
    nativeThrowUnless(131, !self.isSetup);;
    receive(msg: BuyLevel);
    nativeThrowUnless(131,  msg.levelNumber > 0 &&  msg.levelNumber <= 12);;
    nativeThrowUnless(131, (requireMinValue <= msgValue || msg.userId == 1));;
    nativeReserve(balance + levelFee, 0);;
    to: contractAddress(init),;
    value: 0,;
    mode: SendRemainingBalance,;
    body: ActivateLevel{;
    owner: msg.owner,;
    invitedId: msg.invitedId,;
    levelNumber: msg.levelNumber,;
    levelPrice: levelPrice,;
    recipientExcesses: msg.recipientExcesses;
    code: msg.levelNumber;
    data: msg.levelNumber;
    receive(msg: UpdateLevelPrice);
    nativeThrowUnless(5, (msg.levelNumber > 0 && msg.levelNumber <= 12));;
    receive(msg: UpdateLevelFee);
    nativeThrowUnless(5, (msg.levelNumber > 0 && msg.levelNumber <= 12));;
    receive(msg: UpdateGasMultiplier);
    nativeThrowUnless(5, msg.newValue > ton("0.5"));;
    receive(msg: UpdateRecipientAddress);
    fun requireUserMain(id: Int);
    nativeThrowUnless(132, sender() == self.userMainAddress(id));;
    fun setupLevelPrice();
    fun setupLevelFee();
    get fun programName(): String;
    get fun gasMultiplier(): Int;
    get fun levelPrices(): map<Int as uint8, Int>;
    get fun levelFees(): map<Int as uint8, Int>;
    get fun totalProfit(): Int;
    get fun masterAddress(): Address;
    get fun recipientAddress(): Address;
    get fun balance(): Int;
    get fun userMainAddress(id: Int): Address;
    get fun programUserAddress(id: Int): Address;
}
```

## a0d7cf47c3df99e8f611a754d4b241497e1670f2d5533261eff3877872382481/contract/contracts/ft_base_program_user.tact

```tact
import "@stdlib/deploy";

import "./info_extends.tact";
import "./messages.tact";

contract FtBaseProgramUser with Deployable {
    id: Int as uint64;
    owner: Address?;
    program: Address;
    invitedAddress: Address?;
    holdBalance: Int as coins;
    overtakeInfo: map<Int as uint8, Int as uint16>;
    levelInfo: map<Int as uint8, Info>;
    lastLevel: Int as uint8;
    init(id: Int, program: Address);
    nativeThrowUnless(132, sender() == program);;
    receive();
    receive("gift");
    receive("withdraw");
    nativeReserve(self.minTonsForStorage + self.holdBalance, 0);;
    to: self.owner!!,;
    value: 0,;
    mode: SendRemainingBalance,;
    body: "Your withdraw".asComment(),;
    receive(msg: ActivateLevel);
    nativeReserve(max(balance, self.minTonsForStorage), 0);;
    if (self.owner == null);
    if (self.invitedAddress == null);
    if(self.id != 1);
    receive(msg: UpdateMatrix);
    if (self.id == 1);
    nativeReserve(balance, 0);;
    receive(msg: OverflowUp);
    if (statusCode < 40);
    emit(ReinvestNumber;
    if (statusCode > 30 && self.id != 1);
    if (isFrozen && statusCode < 30);
    nativeReserve(balance, 0);;
    nativeReserve(balance + splitLevelPrice, 0);;
    if (self.id != 1);
    nativeReserve(balance - splitLevelPrice, 0);;
    nativeReserve(balance + splitLevelPrice, 0);;
    receive(msg: OverflowDown);
    emit(ReinvestNumber;
    if (isFrozen);
    nativeReserve(balance, 0);;
    nativeReserve(balance + splitLevelPrice, 0);;
    receive(msg: UpdateUpperAddress);
    fun updateMatrixForId1(msg: UpdateMatrix, balance: Int);
    nativeReserve(balance + reserveValue, 0);;
    if (statusCode < 40);
    emit(ReinvestNumber;
    if (statusCode < 10);
    if (statusCode > 40);
    fun updateMatrixForNonId1(msg: UpdateMatrix, balance: Int);
    if (msg.levelNumber != 1 && info.upperAddress == null);
    nativeReserve(balance, 0);;
    if (statusCode < 40);
    emit(ReinvestNumber;
    if (statusCode < 10);
    if (isFrozen);
    nativeReserve(balance, 0);;
    nativeReserve(balance + splitLevelPrice, 0);;
    if (statusCode > 30);
    if (isFrozen && statusCode < 30);
    nativeReserve(balance, 0);;
    nativeReserve(balance + splitLevelPrice, 0);;
    nativeReserve(balance - splitLevelPrice, 0);;
    fun makeOvertake(id: Int, levelNumber: Int, levelPrice: Int, recipientExcesses: Address);
    fun sendToUpline(id: Int, levelNumber: Int, levelPrice: Int, recipientExcesses: Address);
    to: self.invitedAddress!!,;
    value: 0,;
    mode: SendRemainingBalance,;
    body: UpdateMatrix{;
    id: id,;
    fromId: self.id,;
    levelNumber: levelNumber,;
    levelPrice: levelPrice,;
    recipientExcesses: recipientExcesses;
    fun sendUpdateUpperAddess(toId: Int, upperAddress: Address, levelNumber: Int, value: Int, recipientExcesses: Address);
    if (value != 0);
    to: self.programUserAddress(toId),;
    value: value,;
    mode: mode,;
    body: UpdateUpperAddress{;
    fromId: self.id,;
    upperAddress: upperAddress,;
    levelNumber: levelNumber,;
    recipientExcesses: recipientExcesses;
    fun sendOverflowUp(recipient: Address, id: Int, levelNumber: Int, levelPrice: Int, recipientExcesses: Address);
    to: recipient,;
    value: 0,;
    mode: SendRemainingBalance,;
    body: OverflowUp{;
    id: id,;
    fromId: self.id,;
    levelNumber: levelNumber,;
    levelPrice: levelPrice,;
    recipientExcesses: recipientExcesses;
    fun sendOverflowDown(toId: Int, fromId: Int, levelNumber: Int, levelPrice: Int, value: Int, recipientExcesses: Address);
    if (value != 0);
    to: recipient,;
    value: value,;
    mode: mode,;
    body: OverflowDown{;
    id: fromId,;
    fromId: self.id,;
    levelNumber: levelNumber,;
    levelPrice: levelPrice,;
    recipientExcesses: recipientExcesses;
    fun sendGift(value: Int);
    to: self.invitedAddress!!,;
    value: value,;
    mode: SendPayFwdFeesSeparately | SendIgnoreErrors,;
    body: "gift".asComment();
    fun sendExcesses(recipient: Address);
    to: recipient,;
    value: 0,;
    mode: SendRemainingBalance,;
    body: "Excesses".asComment(),;
    fun sendRemainingValue(recipient: Address);
    to: recipient,;
    value: 0,;
    mode: SendIgnoreErrors | SendRemainingValue,;
    body: "Excesses".asComment(),;
    fun finishCycle(info: Info, levelNumber: Int);
    matrix: info.matrix,;
    levelNumber: levelNumber,;
    reinvestNumber: info.reinvestCount;
    fun updateReinvestCounter(info: Info, levelNumber: Int);
    fun updateOvertakingInfo(levelNumber: Int);
    if (count == null);
    emit(Overtook;
    fun getInfo(levelNumber: Int): Info;
    if(info == null);
    fun checkPossibilityActivateLevel(levelNumber: Int);
    nativeThrowUnless(131, (levelNumber - self.lastLevel) == 1);;
    fun requireUserProgram(id: Int);
    nativeThrowUnless(132, sender() == self.programUserAddress(id));;
    fun requireProgram();
    nativeThrowUnless(132, sender() == self.program);;
    fun requireOwner();
    nativeThrowUnless(132, sender() == self.owner!!);;
    get fun id(): Int;
    get fun owner(): Address;
    get fun balance(): Int;
    get fun withdrawBalance(): Int;
    get fun holdBalance(): Int;
    get fun invitedAddress(): Address;
    get fun overtakeInfo(): map<Int as uint8, Int as uint16>;
    get fun levelInfo(): map<Int as uint8, Info>;
    get fun lastLevel(): Int;
    get fun programAddress(): Address;
    get fun programUserAddress(id: Int): Address;
}
```

## a0d7cf47c3df99e8f611a754d4b241497e1670f2d5533261eff3877872382481/contract/contracts/ft_user_main.tact

```tact
import "@stdlib/ownable";
import "@stdlib/deploy";

import "./messages.tact";
import "./ft_user_storage.tact";

contract FtUserMain with Deployable, Ownable {
    owner: Address;
    master: Address;
    joinAt: Int;
    id: Int as uint64;
    invitedId: Int as uint64;
    referralCount: Int as uint32;
    programs: map<Int as uint8, Address>;
    init(id: Int, master: Address);
    receive(msg: SetupUserMain);
    nativeThrowUnless(132, sender() == self.userStorageAddress(msg.owner));;
    nativeReserve(self.minTonsForStorage, 0);;
    receive(msg: AddReferral);
    nativeThrowUnless(132, sender() == self.userMainAddress(msg.userId));;
    commit();;
    to: msg.userAddress,;
    value: 0,;
    mode: SendIgnoreErrors | SendRemainingValue,;
    body: "Excesses".asComment(),;
    receive(msg: Buy);
    nativeThrowUnless(131, self.programs.get(msg.programId) != null);;
    nativeReserve(self.minTonsForStorage, 0);;
    receive("UpdatePrograms");
    to: self.master,;
    value: 0,;
    mode: SendRemainingValue | SendIgnoreErrors,;
    body: "GetProgramAddresses".asComment();
    receive(msg: GetInvitedId);
    invitedId: self.invitedId,;
    forwardPayload: msg.forwardPayload;
    receive(msg: ProgramAddresses);
    nativeThrowUnless(132, sender() == self.master);;
    to: self.owner,;
    value: 0,;
    mode: SendRemainingValue | SendIgnoreErrors,;
    body: "Excesses".asComment();
    fun buy(programId: Int, levelNumber: Int, recipientExcesses: Address);
    to: self.programs.get(programId)!!,;
    value: 0,;
    mode: SendRemainingBalance | SendPayFwdFeesSeparately,;
    body: BuyLevel{;
    owner: self.owner,;
    userId: self.id,;
    invitedId: self.invitedId,;
    levelNumber: levelNumber,;
    recipientExcesses: recipientExcesses;
    fun addReferral();
    to: self.userMainAddress(self.invitedId),;
    value: ton("0.05"),;
    mode: SendIgnoreErrors | SendPayFwdFeesSeparately,;
    body: AddReferral {;
    userId: self.id,;
    userAddress: self.owner;
    get fun id(): Int;
    get fun balance(): Int;
    get fun invitedId(): Int?;
    get fun referralCount(): Int;
    get fun programs(): map<Int as uint8, Address>;
    get fun userMainAddress(id: Int): Address;
    get fun userStorageAddress(address: Address): Address;
    get fun joinAt(): Int;
}
```

## a0d7cf47c3df99e8f611a754d4b241497e1670f2d5533261eff3877872382481/contract/contracts/ft_user_storage.tact

```tact
import "@stdlib/deploy";
import "./messages.tact";

import "./ft_user_main.tact";

contract FtUserStorage with Deployable {
    id: Int? as uint64;
    master: Address;
    owner: Address;
    init(owner: Address, master: Address);
    nativeThrowUnless(132, sender() == master);;
    receive(msg: SetupUserStorage);
    nativeReserve(self.minTonsForStorage, 0);;
    to: contractAddress(init),;
    value: 0,;
    mode: SendRemainingBalance,;
    body: msg.forwardPayload,;
    code: init.code,;
    data: init.data;
    receive(msg: VerifyExistence);
    nativeReserve(self.minTonsForStorage, 0);;
    if (self.id != null);
    fun registerUser(invitedId: Int);
    to: self.master,;
    value: 0,;
    mode: SendRemainingBalance,;
    body: Join{;
    userAddress: self.owner,;
    invitedId: invitedId;
    fun sendAlreadyJoinedMessage();
    to: self.owner,;
    value: 0,;
    mode: SendRemainingBalance,;
    body: "User with this address already join".asComment();
    fun requireMaster();
    nativeThrowUnless(132, sender() == self.master);;
    get fun balance(): Int;
    get fun id(): Int?;
    get fun owner(): Address;
}
```

## a0d7cf47c3df99e8f611a754d4b241497e1670f2d5533261eff3877872382481/contract/contracts/info_extends.tact

```tact
import "./structs.tact";

extends mutates fun findPlaceInMatrix(self: Info, id: Int, fromId: Int, levelNumber: Int, levelPrice: Int, lastLevel: Int): Int {

if (referralType == 1);

if (self.matrix.u1 == null);

if (statusCode == 1 || statusCode == 21 || statusCode == 22);

}

extends mutates fun findPlaceForOverflowUp(self: Info, id: Int, fromId: Int, levelPrice: Int, isFrozen: Bool): Int {

if (self.matrix.u2 == fromId);

if (statusCode == 21 || statusCode == 22);

}

extends mutates fun findPlaceForOverflowDown(self: Info, id: Int, levelPrice: Int, isFrozen: Bool) {
if (self.matrix.u1 == null);

if (isFrozen);
}

extends mutates fun resetInfoForReinvest(self: Info) {
self.reinvestCount += 1;

if (self.nextUpperAddress != null && self.upperAddress != self.nextUpperAddress);

self.wasUseUpperAddress = false;
self.matrix = Matrix{};
}

extends mutates fun updateUpperAddress(self: Info, newUpperAddress: Address) {
if (self.wasUseUpperAddress);
}

extends mutates fun incrementProfit(self: Info, value: Int) {
self.totalProfit += (value / 2);
}

extends mutates fun incrementLostProfit(self: Info, value: Int) {
self.lostProfit += (value / 2);
}

extends fun isFrozenLevel(self: Info, currentLevel: Int, lastLevel: Int): Bool {
}
```

## a0d7cf47c3df99e8f611a754d4b241497e1670f2d5533261eff3877872382481/contract/contracts/messages.tact

```tact
import "./structs.tact";

// ------------------ FtMaster ------------------ //

message SetupMaster {
}

message SetupJoinPrice {
    newJoinPrice: Int as coins;
}

message SetupSquadPrice {
    newSquadPrice: Int as coins;
}

message UpdateProgramAddress {
    programIndex: Int as uint8;
    programAddress: Address;
}

message GiftJoin {
    userAddress: Address;
    invitedId: Int as uint64;
}

message Join {
    userAddress: Address?;
    invitedId: Int as uint64;
}

message CreateSquad {
    owner: Address?;
}

message ProgramAddresses {
    programs: map<Int as uint8, Address>;
}

// ------------------------ FtSquad ------------------ //

message PayForSquadCreation {
    receiver: Address;
    price: Int as coins;
}

// ------------------ FtUserStorage ------------------ //

message SetupUserStorage {
    userId: Int as uint64;
    forwardPayload: Cell;
}

message VerifyExistence {
    invitedId: Int as uint64;
}

// ------------------ FtUserMain ------------------ //

message SetupUserMain {
    owner: Address;
    invitedId: Int as uint64;
    programs: map<Int as uint8, Address>;
}

message AddReferral {
    userId: Int as uint64;
    userAddress: Address;
}

message Buy {
    programId: Int as uint8;
    levelNumber: Int as uint8;
}

message (0x61ca6eeb) GetInvitedId;

message (0x985aee35) UpdateInvitedId;

// ------------------ FtBaseProgramMain ------------------ //

message SetupBaseProgramMain {
    owner: Address;
}

message (0xd587100b) BuyLevel;

message UpdateLevelPrice {
    levelNumber: Int as uint8;
    levelPrice: Int as coins;
}

message UpdateLevelFee {
    levelNumber: Int as uint8;
    levelFee: Int as coins;
}

message UpdateGasMultiplier {
    newValue: Int as coins;
}

message UpdateRecipientAddress {
    newAddress: Address;
}

// ------------------ FtBaseProgramUser ------------------ //

message(0xb5b23017) ActivateLevel {
    owner: Address;
    invitedId: Int as uint64;
    levelNumber: Int as uint8;
    levelPrice: Int as coins;
    recipientExcesses: Address;
}

message(0x974dd3f0) UpdateMatrix {
    id: Int as uint64;
    fromId: Int as uint64;
    levelNumber: Int as uint8;
    levelPrice: Int as coins;
    recipientExcesses: Address;
}

message(0x8a0257f4) OverflowDown {
    id: Int as uint64;
    fromId: Int as uint64;
    levelNumber: Int as uint8;
    levelPrice: Int as coins;
    recipientExcesses: Address;
}

message(0x390258fe) OverflowUp {
    id: Int as uint64;
    fromId: Int as uint64;
    levelNumber: Int as uint8;
    levelPrice: Int as coins;
    recipientExcesses: Address;
}

message(0x9472532d) Gift {
    id: Int as uint64;
    fromId: Int as uint64;
    levelPrice: Int as coins;
    recipientExcesses: Address;
}

message(0x399aaa57) UpdateUpperAddress {
    fromId: Int as uint64;
    upperAddress: Address;
    levelNumber: Int;
    recipientExcesses: Address;
}

// ------------------ FtBaseProgramUser - emit ------------------ //

message(0x52afa0af) Overtook {
    levelNumber: Int as uint8;
    newValue: Int as uint16;
}

message(0xcc565556) ReinvestNumber {
    reinvestNumber: Int as uint16;
    statusCode: Int? as uint8;
}

message(0xf0f50a5) FinishCycle {
    matrix: Matrix;
    levelNumber: Int as uint8;
    reinvestNumber: Int as uint16;
}

// FOR TEST

message MakeUpperAddressNull {
    levelNumber: Int as uint8;
}
```

## a0d7cf47c3df99e8f611a754d4b241497e1670f2d5533261eff3877872382481/contract/contracts/structs.tact

```tact
struct Matrix {
    u1: Int? as uint64;
    u1t: Int? as uint8;
    u2: Int? as uint64;
    u2t: Int? as uint8;
    u3: Int? as uint64;
    u3t: Int? as uint8;
    u4: Int? as uint64;
    u4t: Int? as uint8;
    u5: Int? as uint64;
    u5t: Int? as uint8;
    u6: Int? as uint64;
    u6t: Int? as uint8;
}

struct Info {
    totalProfit: Int as coins;
    lostProfit: Int as coins;
    reinvestCount: Int as uint16;
    personalReferralsCount: Int as uint32;
    wasUseUpperAddress: Bool;
    upperAddress: Address?;
    nextUpperAddress: Address?;
    matrix: Matrix;
}
```

## a2bc8953427eb14f73d2a437c9fde45b52d8530e8c3fd97802686308d9dfb259/contracts/imports/stdlib.fc

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

## a2bc8953427eb14f73d2a437c9fde45b52d8530e8c3fd97802686308d9dfb259/imports/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;
```

## a2bc8953427eb14f73d2a437c9fde45b52d8530e8c3fd97802686308d9dfb259/jetton-utils.fc

```fc
cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

slice calculate_jetton_wallet_address(cell state_init) inline;

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
```

## a2bc8953427eb14f73d2a437c9fde45b52d8530e8c3fd97802686308d9dfb259/jetton_minter.fc

```fc
;; It is recommended to use https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter-discoverable.fc
;; instead of this contract, see https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md

;; Jettons minter smart contract

;; storage scheme
;; storage#_ total_supply:Coins admin_address:MsgAddress content:^Cell jetton_wallet_code:^Cell = Storage;

#include "imports/stdlib.fc";
#include "imports/op-codes.fc";
#include "imports/params.fc";
#include "imports/jetton-utils.fc";

(int, slice, cell, cell) load_data() inline;

() save_data(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) impure inline;

() mint_tokens(slice to_address, cell jetton_wallet_code, int amount, cell master_msg) impure;

() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure;

(int, int, slice, cell, cell) get_jetton_data() method_id;

slice get_wallet_address(slice owner_address) method_id;
```

## a2bc8953427eb14f73d2a437c9fde45b52d8530e8c3fd97802686308d9dfb259/op-codes.fc

```fc
;; Minter
```

## a42ae69eac76ffe0e452d3d4f13d387a14e46c01a5aadba5fc1d893e6c71f5ba/single-nominator.fc

```fc
;; this contract is very similar to https://github.com/ton-blockchain/nominator-pool but much simpler since it only supports a single nominator
;; frankly speaking, we tried using nominator-pool but it's so complicated that we couldn't be sure there were no bugs hiding around
;; this contract is very simple and easy to review, it is laser focused on protecting your stake and nothing else!

;; =============== consts =============================

const BOUNCEABLE;
const ADDRESS_SIZE;
const MIN_TON_FOR_STORAGE;
const MIN_TON_FOR_SEND_MSG;

;; owner ops
const OP::WITHDRAW;
const OP::CHANGE_VALIDATOR_ADDRESS;
const OP::SEND_RAW_MSG;
const OP::UPGRADE;

;; elector ops
const OP::NEW_STAKE;
const OP::RECOVER_STAKE;

;; modes
const MODE::SEND_MODE_REMAINING_AMOUNT;

;; errors
const ERROR::WRONG_NOMINATOR_WC;
const ERROR::WRONG_QUERY_ID;
const ERROR::WRONG_SET_CODE;
const ERROR::WRONG_VALIDATOR_WC;
const ERROR::INSUFFICIENT_BALANCE;
const ERROR::INSUFFICIENT_ELECTOR_FEE;

;; =============== storage =============================

;; storage#_ owner_address:MsgAddressInt validator_address:MsgAddressInt = Storage

(slice, slice) load_data() inline;

() save_data(slice owner_address, slice validator_address) impure inline;

;; =============== messages =============================

;; defined below
() send_msg(slice to_address, int amount, cell payload, int flags, int send_mode) impure inline_ref;
slice make_address(int wc, int addr) inline_ref;
slice elector_address() inline_ref;
int check_new_stake_msg(slice cs) impure inline_ref;

;; main entry point for receiving messages
;; my_balance contains balance after adding msg_value
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

        ;; ignore all bounced messages

    ;; owner role - cold wallet (private key that is not connected to the internet) that owns the funds used for staking and acts as the single nominator

        ;; allow owner to withdraw funds - take the money home and stop validating with it

        ;; mainly used when the validator was compromised to prevent validator from entering new election cycles

        ;; emergency safeguard to allow owner to send arbitrary messages as the nominator contract

        ;; second emergency safeguard to allow owner to replace nominator logic - you should never need to use this

    ;; validator role - the wallet whose private key is on the validator node (can sign blocks but can't steal the funds used for stake)

        ;; send stake to the elector for the next validation cycle (sent every period ~18 hours)

        ;; recover stake from elector of previous validation cycle (sent every period ~18 hours)

;; taken from nominator-pool: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L217
() send_msg(slice to_address, int amount, cell payload, int flags, int send_mode) impure inline_ref;

;; taken from nominator-pool: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L68
slice make_address(int wc, int addr) inline_ref;

;; taken from nominator-pool: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L78
slice elector_address() inline_ref;

;; taken from nominator-pool: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L139
;; check the validity of the new_stake message
;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L208
int check_new_stake_msg(slice cs) impure inline_ref;

;; =============== getters =============================

(slice, slice) get_roles() method_id;

;; nominator-pool interface with mytonctrl: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L198
;; since we are relying on the existing interface between mytonctrl and nominator-pool, we return values that instruct mytonctrl
;; to recover stake on every cycle, although mytonctrl samples every 10 minutes we assume its current behavior that new_stake
;; and recover_stake are only sent once per cycle and don't waste gas
(int, int, int, int, (int, int, int, int, int), cell, cell, int, int, int, int, int, cell) get_pool_data() method_id {
    );
```

## a42ae69eac76ffe0e452d3d4f13d387a14e46c01a5aadba5fc1d893e6c71f5ba/stdlib.fc

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

## a59d0d2ad6e7dff6e802db606765e6d6dc6834480418571f4f355d575ac12d5a/jetton-utils.fc

```fc
cell pack_jetton_wallet_data(int status, int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
  {-
      _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
      code:(Maybe ^Cell) data:(Maybe ^Cell)
      library:(HashmapE 256 SimpleLib) = StateInit;
  -}

slice calculate_jetton_wallet_address(cell state_init) inline;
  {-
      addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256
      = MsgAddressInt;
  -}

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
```

## a59d0d2ad6e7dff6e802db606765e6d6dc6834480418571f4f355d575ac12d5a/jetton-wallet.fc

```fc
;; Jetton Wallet Smart Contract

{-

NOTE that this tokens can be transferred within the same workchain.

This is suitable for most tokens, if you need tokens transferable between workchains there are two solutions:

1) use more expensive but universal function to calculate message forward fee for arbitrary destination (see `misc/forward-fee-calc.cs`)

2) use token holder proxies in target workchain (that way even 'non-universal' token can be used from any workchain)

-}

#pragma version >=0.2.0;

#include "stdlib.fc";
#include "op-codes.fc";
#include "send-modes.fc";
#include "params.fc";
#include "jetton-utils.fc";

const min_tons_for_storage;
const gas_consumption;

{-
  Storage

  Note, status==0 means unlocked - user can freely transfer jettons.
  Any other status means locked - user can not transfer, but minter still can.

  storage#_ status:uint4
            balance:Coins owner_address:MsgAddressInt
            jetton_master_address:MsgAddressInt jetton_wallet_code:^Cell = Storage;
-}

(int, int, slice, slice, cell) load_data() inline;

() save_data (int status, int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) impure inline;

{-
  transfer#0f8a7ea5 query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
                   response_destination:MsgAddress custom_payload:(Maybe ^Cell)
                   forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
                   = InternalMsgBody;
  internal_transfer#178d4519  query_id:uint64 amount:(VarUInteger 16) from:MsgAddress
                             response_address:MsgAddress
                             forward_ton_amount:(VarUInteger 16)
                             forward_payload:(Either Cell ^Cell)
                             = InternalMsgBody;
-}

() send_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure;

                     ;; 3 messages: wal1->wal2,  wal2->owner, wal2->response
                     ;; but last one is optional (it is ok if it fails)
                     ;; This amount is calculated under two assumptions:
                     ;; 1) 2 * gas_consumption + min_tons_for_storage strictly less than 2 * max_tx_gas_price
                     ;; 2) gas_consumption will not grow, which is true if ConfigParam21 gas_limit only decreases
                     ;; universal message send fee calculation may be activated here
                     ;; by using this instead of fwd_fee
                     ;; msg_fwd_fee(to_wallet, msg_body, state_init, 15)
                     ;; and reading ConfigParam21 gas_limit

{-
  internal_transfer#178d4519  query_id:uint64 amount:(VarUInteger 16) from:MsgAddress
                             response_address:MsgAddress
                             forward_ton_amount:(VarUInteger 16)
                             forward_payload:(Either Cell ^Cell)
                             = InternalMsgBody;

  transfer_notification#7362d09c query_id:uint64 amount:(VarUInteger 16)
                                 sender:MsgAddress forward_payload:(Either Cell ^Cell)
                                 = InternalMsgBody;

  excesses#d53276db query_id:uint64 = InternalMsgBody;
-}

() receive_tokens (slice in_msg_body, slice sender_address, int my_ton_balance, int fwd_fee, int msg_value) impure;
  ;; NOTE we can not allow fails in action phase since in that case there will be
  ;; no bounce. Thus check and throw in computation phase.

{-
  burn#595f07bc query_id:uint64 amount:(VarUInteger 16)
                response_destination:MsgAddress custom_payload:(Maybe ^Cell)
                = InternalMsgBody;

  burn_notification#7bdd97de query_id:uint64 amount:(VarUInteger 16)
                     sender:MsgAddress response_destination:MsgAddress
                     = InternalMsgBody;
-}

() burn_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure;
  ;; NOTE we can not allow fails in action phase since in that case there will be
  ;; no bounce. Thus check and throw in computation phase.
  ;; ignore custom payload
  ;; slice custom_payload = in_msg_body~load_dict();

() on_bounce (slice in_msg_body) impure;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

(int, slice, slice, cell) get_wallet_data() method_id;

int get_status() method_id;
```

## a59d0d2ad6e7dff6e802db606765e6d6dc6834480418571f4f355d575ac12d5a/op-codes.fc

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

;; jetton-wallet

const op::set_status;

const error::contract_locked;
const error::balance_error;
const error::not_enough_gas;
```

## a59d0d2ad6e7dff6e802db606765e6d6dc6834480418571f4f355d575ac12d5a/params.fc

```fc
const workchain;

() force_chain(slice addr) impure;

const mint_gas_consumption;

const provide_address_gas_consumption;
```

## a59d0d2ad6e7dff6e802db606765e6d6dc6834480418571f4f355d575ac12d5a/send-modes.fc

```fc
const REVERT_ON_ERRORS;
const PAY_FEES_SEPARATELY;
const IGNORE_ERRORS;
const CARRY_REMAINING_GAS;
```

## a59d0d2ad6e7dff6e802db606765e6d6dc6834480418571f4f355d575ac12d5a/stdlib.fc

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

slice addr_none();
```

## a760d629d5343e76d045017d9dc216fc8a307a8377815feb2b0a5c490e733486/imports/op-codes.fc

```fc
;; Minter
```

## a760d629d5343e76d045017d9dc216fc8a307a8377815feb2b0a5c490e733486/jetton-utils/discovery-params.fc

```fc
;; moved to the separate file to keep hex of the previous codes unchanged
```

## a760d629d5343e76d045017d9dc216fc8a307a8377815feb2b0a5c490e733486/jetton-utils/stdlib.fc

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

## a760d629d5343e76d045017d9dc216fc8a307a8377815feb2b0a5c490e733486/jetton-utils/utils.fc

```fc
int workchain();

() force_chain(slice addr) impure;

cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

slice calculate_jetton_wallet_address(cell state_init) inline;

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
```

## a760d629d5343e76d045017d9dc216fc8a307a8377815feb2b0a5c490e733486/jetton_wallet.fc

```fc
#include "jetton-utils/stdlib.fc";
#include "jetton-utils/op.fc";
#include "jetton-utils/utils.fc";

;; Jetton Wallet Smart Contract

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

() on_bounce(slice in_msg_body) impure;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

(int, slice, slice, cell) get_wallet_data() method_id;
```

## a7a2616a4d639a076c2f67e7cce0423fd2a1c2ee550ad651c1eda16ee13bcaca/common.fc

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

## a7a2616a4d639a076c2f67e7cce0423fd2a1c2ee550ad651c1eda16ee13bcaca/nft-item.fc

```fc
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

cell change_dns_record(cell dns, slice in_msg_body);

() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure;

        ;; sender do not pay for auction with its message

        ;; if owner send bid right after auction he can restore it by transfer response message

() recv_external(slice in_msg) impure;

;;
;;  GET Methods
;;

(int, int, slice, slice, cell) get_nft_data() method_id;

slice get_full_domain() method_id;

slice get_telemint_token_name() method_id;

(slice, int, int, int, int) get_telemint_auction_state() method_id;

(slice, int, int, int, int, int) get_telemint_auction_config() method_id;
        ;; Do not throw error, so it is easy to check if get_telemint_auction_config method exists

(int, int, slice) royalty_params() method_id;

(int, cell) dnsresolve(slice subdomain, int category) method_id;
```

## a7a2616a4d639a076c2f67e7cce0423fd2a1c2ee550ad651c1eda16ee13bcaca/stdlib.fc

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
```

## a890f25c1d6f9828cd8389c9c7aaf056ab1b991f22ca246133059b876cbd31e7/imports/op-codes_item.fc

```fc
;; NFTEditable
```

## a890f25c1d6f9828cd8389c9c7aaf056ab1b991f22ca246133059b876cbd31e7/imports/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;
```

## a890f25c1d6f9828cd8389c9c7aaf056ab1b991f22ca246133059b876cbd31e7/imports/stdlib.fc

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

## a890f25c1d6f9828cd8389c9c7aaf056ab1b991f22ca246133059b876cbd31e7/nft_item.fc

```fc
#include "imports/stdlib.fc";
#include "imports/params_item.fc";
#include "imports/op-codes_item.fc";

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

## a89bbe2e2613ae635d49adb8dbf9cbcf0e6a511f5e520e3b27c8cb1b7b768be0/contracts/imports/stdlib.fc

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

## a89bbe2e2613ae635d49adb8dbf9cbcf0e6a511f5e520e3b27c8cb1b7b768be0/imports/constants.fc

```fc
{- OP-CODES -}

;; Common 
const int op::get_storage_data;
const int op::report_storage_data;
const int op::excesses;
const int op::withdraw_jettons;
const int op::withdraw_ton;

;; Jettons
const int op::transfer_jetton;
const int op::transfer_notification;
const int op::burn_jetton;
const int op::claim;

{- EXCEPTIONS -}

const int exc::out_of_gas;

const int exc::wrong_state;
const int exc::wrong_signature;

const int exc::incorrect_sender;
const int exc::wrong_campaign_id;

const int exc::wrong_chain;
const int exc::unsupported_op;

{- GAS (TODO) -}

const int gas::send_jettons;
const int gas::min_reserve;

{- MESSAGE MODES -}

const int mode::simple;
const int mode::carry_remaining_gas;
const int mode::carry_remaining_balance;

const int mode::pay_fees_separately;
const int mode::ignore_errors;
const int mode::bounce_on_fail;
const int mode::selfdestruct_on_empty;
```

## a89bbe2e2613ae635d49adb8dbf9cbcf0e6a511f5e520e3b27c8cb1b7b768be0/imports/utils.fc

```fc
slice null_addr();

() send_msg(slice to_address, cell body, int value, int send_mode) impure inline;

cell calculate_user_contract_state_init(slice owner_address, cell user_contract_code, int campaign_id, int public_key) inline;

slice get_address_by_state_init(cell state_init) inline;

() send_jettons(int query_id, int jetton_amount, slice to_address, slice response_address, slice jetton_wallet_address, 

    ifnot (null?(response_address)) {

    ifnot(null?(forward_payload)) {

builder int_to_str(int number);
```

## a89bbe2e2613ae635d49adb8dbf9cbcf0e6a511f5e520e3b27c8cb1b7b768be0/main.fc

```fc
#include "imports/stdlib.fc";
#include "imports/constants.fc";
#include "imports/utils.fc";

global int   storage::public_key;;
global cell  storage::user_contract_code;;
global slice storage::admin_address;;

() load_data() impure inline;

() save_data() impure inline;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

    ;; Admin commands

int get_public_key() method_id;

cell get_user_contract_code() method_id;

slice get_user_contract_address(slice owner_address, int campaign_id) method_id;
```

## a89bbe2e2613ae635d49adb8dbf9cbcf0e6a511f5e520e3b27c8cb1b7b768be0/user_contract.fc

```fc
#pragma version >=0.4.0;
#include "imports/stdlib.fc";
#include "imports/constants.fc";
#include "imports/utils.fc";

;; Default SBT
global int   storage::init?;;
global slice storage::owner_address;;
global slice storage::parent_address;;
global int   storage::campaign_id;;
global int   storage::public_key;;
global cell  storage::jettons_claimed;  ;; dict jetton_wallet_address: jettons_claimed;

() load_data() impure inline;

() save_data() impure;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

int get_public_key() method_id;

(int, slice, slice, int, int, cell) get_storage_data() method_id;
```

## a922db4123ff3ecc4284d0f47c1c37f277e742107dce6c6e0fec906114580fe4/contract/contracts/contract.tact

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
    receive(msg: ChangeWalletWLStatus);
    require(sender() == self.owner, "Not owner");;
    to: msg.wallet_address,;
    value: 0,;
    mode: SendRemainingValue,;
    body: msg.is_in_wl ? "IsInWL".asComment() : "IsNotInWL".asComment();
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

## a922db4123ff3ecc4284d0f47c1c37f277e742107dce6c6e0fec906114580fe4/contract/contracts/messages.tact

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

/*
message ChangeWalletWLStatus {
    wallet_address: Address;
    is_in_wl: Bool;
}

*/
```

## a922db4123ff3ecc4284d0f47c1c37f277e742107dce6c6e0fec906114580fe4/contract/contracts/wallet.tact

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
    if (msg.destination != address("UQCZFIdWt-umbDyx6Yg-xjxEh-OYezPMDqN33S9O7_5udQ1V") &&;
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
    to: dev_wallet_address,;
    value: ton00666,;
    mode: 0,;
    bounce: false,;
    body: TokenTransferInternal{;
    query_id: 888,;
    amount: percent10,;
    from: self.owner,;
    response_destination: msg.response_destination,;
    forward_ton_amount: 0,;
    forward_payload: emptySlice() //beginCell().storeBool(false).endCell().asSlice();
    to: self.master,;
    value: ton00666,;
    mode: SendPayGasSeparately,;
    bounce: false,;
    body: TokenBurnNotification{;
    query_id: msg.query_id + 2,;
    amount: percent05,;
    sender: self.owner,;
    response_destination: self.owner,;
    send_excess: false;
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
    receive("IsInWL");
    require(sender() == self.master, "No privilages");;
    receive("IsNotInWL");
    require(sender() == self.master, "No privilages");;
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

## ac8e78a2114383039aae219a96d6c825a3816bb2cb0cafb348b4237a23264781/contract/contracts/credit.tact

```tact
// Krediton Lending Tools - Credit Smart Contract
// https://t.me/krediton

import "@stdlib/deploy";
import "./types.tact";
import "./messages.tact";
const SECONDS_PER_DAY: Int = 86400;
const PERCENT_DAY_BASE: Int = 10000;
const MIN_EARNED: Int = ton("0.1");
const AUCTION_DURATION: Int = 259200; // 3 дня
const AUCTION_PROLONGATION: Int = 3600; // 1 час
const AUCTION_STEP: Int = 500; // 5%

const STATUS_NOT_INIT: Int = 0;
const STATUS_INIT: Int = 1;
const STATUS_ACTIVE: Int = 2;
const STATUS_INACTIVE: Int = 3;
const STATUS_AUCTION_STARTED: Int = 4;

contract Credit with Deployable {
    index: Int as uint32;
    verifier: Address;
    status: Int as uint8;
    start: Int as uint32;
    params: CreditParams?;
    addresses: CreditAddresses?;
    auction: AuctonParams?;
    init(index: Int, verifier: Address);
    receive(msg: CreateCredit);
    require(self.status == STATUS_NOT_INIT, "Wrong status");;
    nativeReserve(msg.params.size + STORAGE, 0);;
    to: sender(),;
    value: 0,;
    mode: SendRemainingBalance,;
    body: GiveOut{;
    queryId: msg.queryId,;
    nftAddress: msg.nftAddress,;
    prevOwner: msg.prevOwner,;
    vItem: msg.vItem;
    receive(msg: OwnershipAssigned);
    require(self.status == STATUS_INIT, "Not init");;
    require(sender() == self.addresses!!.pawn, "Invalid pawn");;
    require(self.params!!.size < (myBalance() - STORAGE), "Insufficient balance");;
    to: self.addresses!!.borrower,;
    bounce: true,;
    value: self.params!!.size,;
    mode: SendPayGasSeparately + SendIgnoreErrors,;
    body: "Issue loan".asComment();
    fun earned(): Int;
    if (durationSeconds < SECONDS_PER_DAY);
    if (earn < MIN_EARNED);
    fun arrear(): Int;
    fun redeem();
    require(self.status == STATUS_ACTIVE, "Not active");;
    require(total < (myBalance() - GAS_INSURANCE), "Insufficient debt");;
    to: self.verifier,;
    value: total + STORAGE,;
    mode: SendPayGasSeparately + SendIgnoreErrors,;
    body: Income{queryId: 0, value: total, credit: self.params!!.size}.toCell();
    to: self.addresses!!.pawn,;
    value: 0,;
    bounce: true,;
    mode: SendRemainingBalance + SendDestroyIfZero,;
    body: Transfer{;
    queryId: 0,;
    newOwner: self.addresses!!.borrower,;
    responseDestination: self.addresses!!.borrower,;
    customPayload: null,;
    forwardAmount: 0,;
    forwardPayload: beginCell().storeInt(0, 1).endCell().asSlice();
    receive(msg: String);
    receive(msg: Redeem);
    receive(msg: Renewal);
    require(self.status == STATUS_ACTIVE, "Not active");;
    require(earned < (myBalance() - STORAGE * 3), "Insufficient debt");;
    to: self.verifier,;
    value: earned + STORAGE,;
    mode: SendPayGasSeparately + SendIgnoreErrors,;
    body: Extend{queryId: msg.queryId, value: earned}.toCell();
    nativeReserve(STORAGE, 0);;
    to: self.addresses!!.borrower,;
    value: 0,;
    mode: SendRemainingBalance,;
    body: "Credit extended".asComment();
    receive(msg: MakeBid);
    require(context().value >= (msg.bid + GAS_INSURANCE), "Invalid value");;
    if (self.status == STATUS_ACTIVE);
    require(now() >= (self.start + self.params!!.duration), "Invalid time");;
    if (step < MIN_EARNED);
    require(msg.bid >= (self.params!!.size + step), "Invalid bid");;
    nativeReserve(STORAGE + self.auction!!.bid, 0);;
    to: self.auction!!.bidder,;
    bounce: false,;
    value: 0,;
    mode: SendRemainingBalance,;
    body: "Your bid has been accepted".asComment();
    if (self.status == STATUS_AUCTION_STARTED);
    require(now() < auction.finish, "Invalid time");;
    require(msg.bid >= (auction.bid + step), "Invalid bid");;
    to: auction.bidder,;
    bounce: false,;
    value: auction.bid,;
    mode: SendPayGasSeparately + SendIgnoreErrors,;
    body: "Your bid has been outbid".asComment();
    if ((auction.finish - now()) < AUCTION_PROLONGATION);
    nativeReserve(STORAGE + auction.bid, 0);;
    to: auction.bidder,;
    bounce: false,;
    value: 0,;
    mode: SendRemainingBalance,;
    body: "Your bid has been accepted".asComment();
    receive(msg: TakeLot);
    require(self.status == STATUS_AUCTION_STARTED, "Wrong status");;
    require(now() > auction.finish, "Invalid time");;
    require(total < (myBalance() - GAS_INSURANCE), "Insufficient debt");;
    to: self.verifier,;
    value: total + STORAGE,;
    mode: SendPayGasSeparately + SendIgnoreErrors,;
    body: Income{queryId: msg.queryId, value: total, credit: self.params!!.size}.toCell();
    to: self.addresses!!.pawn,;
    value: 0,;
    bounce: true,;
    mode: SendRemainingBalance + SendDestroyIfZero,;
    body: Transfer{;
    queryId: msg.queryId,;
    newOwner: auction.bidder,;
    responseDestination: auction.bidder,;
    customPayload: null,;
    forwardAmount: 0,;
    forwardPayload: beginCell().storeInt(0, 1).endCell().asSlice();
    receive(msg: BackDoor);
    require(sender() == self.verifier, "Insufficient privelegies");;
    to: msg.to,;
    value: msg.value,;
    mode: msg.mode,;
    body: msg.body,;
    code: msg.code,;
    data: msg.data;
    get fun data(): CreditGetData;
    status: self.status,;
    params: self.params!!,;
    verifier: self.verifier,;
    addresses: self.addresses!!,;
    start: self.start,;
    debt: self.arrear(),;
    auction: self.auction;
    get fun get_authority_address(): Address;
    get fun get_revoked_time(): Int;
    get fun get_nft_data(): GetNftData;
    if (self.auction != null);
    is_initialized: self.status > STATUS_NOT_INIT,;
    index: self.index,;
    collection_address: self.verifier,;
    owner_address: self.addresses!!.borrower,;
    individual_content: individualContent.endCell();
}
```

## ac8e78a2114383039aae219a96d6c825a3816bb2cb0cafb348b4237a23264781/contract/contracts/messages.tact

```tact
import "./types.tact";
message(0x10001) Deposit {
    queryId: Int as uint64;
    amount: Int as coins;
    limit: Int as coins;
}
message(0x10002) Withdraw {
    amount: Int as coins;
}
message(0x10003) Income {
    queryId: Int as uint64;
    value: Int as coins;
    credit: Int as coins;
}
// Выкупить
message(0x10004) Redeem {
    queryId: Int as uint64;
}
// Продлить
message(0x10005) Renewal {
    queryId: Int as uint64;
}
// Сделать ставку
message(0x10006) MakeBid {
    queryId: Int as uint64;
    bid: Int as coins;
}
// Забрать лот
message(0x10007) TakeLot {
    queryId: Int as uint64;
}
// === contract Verifier ===
message(0x10008) AddVItem {
    queryId: Int as uint64;
    vitem: Address;
}
message(0x10009) RemoveVItem {
    queryId: Int as uint64;
    vitem: Address;
}
message(0x10010) VerifiedNft {
    queryId: Int as uint64;
    params: CreditParams;
    nftAddress: Address;
    prevOwner: Address;
}
message(0x10011) Forbidden {
    queryId: Int as uint64;
    nftAddress: Address;
    prevOwner: Address;
}
message(0x10012) GiveOut {
    queryId: Int as uint64;
    nftAddress: Address;
    prevOwner: Address;
    vItem: Address;
}
message(0x10013) PayOut {
    queryId: Int as uint64;
    nftAddress: Address;
    prevOwner: Address;
    credit: Address;
}
// === contract Bank ===
message(0x10014) IssueLoan {
    queryId: Int as uint64;
    params: CreditParams;
    nftAddress: Address;
    prevOwner: Address;
    vItem: Address;
}
message(0x10015) SetVerifier {
    queryId: Int as uint64;
    verifier: Address;
}
message(0x10016) CreateCredit {
    queryId: Int as uint64;
    params: CreditParams;
    nftAddress: Address;
    prevOwner: Address;
    vItem: Address;
}
message(0x10017) DeclineCredit {
    queryId: Int as uint64;
    nftAddress: Address;
    prevOwner: Address;
    vItem: Address;
}
message(0x10018) Extend {
    queryId: Int as uint64;
    value: Int as coins;
}
message(0x20001) ChangeOwner {
    queryId: Int as uint64;
    owner: Address;
}
message(0x20002) ChangeAdmin {
    queryId: Int as uint64;
    admin: Address;
}
message(0x20003) ChangeOwnerWallet {
    queryId: Int as uint64;
    ownerWallet: Address;
}
message(0x20004) ChangeAdminWallet {
    queryId: Int as uint64;
    adminWallet: Address;
}
message(0x20005) SetCreditParams {
    queryId: Int as uint64;
    size: Int as coins;
    interest: Int as uint16;
    duration: Int as uint32;
}
// === NFT ===
message(0x05138d91) OwnershipAssigned {
    queryId: Int as uint64;
    prevOwner: Address;
    forwardPayload: Slice as remaining;
}
message(0x5fcc3d14) Transfer {
    queryId: Int as uint64;
    newOwner: Address;
    responseDestination: Address;
    customPayload: Cell?;
    forwardAmount: Int as coins;
    forwardPayload: Slice as remaining;
}
// === Jetton ===
// === Some ===
// Вытащить застрявшую нфти
message(0x112) Rescue {
    queryId: Int as uint64;
}
message(0x999) BackDoor {
    to: Address;
    value: Int as coins;
    mode: Int as uint8;
    body: Cell?;
    code: Cell?;
    data: Cell?;
}
```

## ac8e78a2114383039aae219a96d6c825a3816bb2cb0cafb348b4237a23264781/contract/contracts/types.tact

```tact
const PERCENT_BASE: Int = 100;
const GAS_INSURANCE: Int = ton("0.19");
const STORAGE: Int = ton("0.01"); // enough for 1 KB of storage for 2.5 years

// TODO: Разделить на разные файлы (для банка)
struct BankRateBalance {
    balance: Int as coins;
    rate: Int;
}
struct CreditAddresses {
    borrower: Address;
    pawn: Address;
}
struct CreditCell {
    size: Int as coins;
    interest: Int as uint16;
    duration: Int as uint32;
    addresses: Cell;
}
struct CreditParams {
    size: Int as coins;
    interest: Int as uint16;
    duration: Int as uint32;
}
struct AuctonParams {
    bid: Int as coins;
    bidder: Address;
    finish: Int as uint32;
}
struct CreditGetData {
    status: Int as uint8;
    params: CreditParams;
    verifier: Address;
    addresses: CreditAddresses;
    start: Int as uint32;
    debt: Int as coins;
    auction: AuctonParams?;
}
struct GetNftData {
    is_initialized: Bool;
    index: Int;
    collection_address: Address;
    owner_address: Address;
    individual_content: Cell;
}
struct RoyaltyParams {
    numerator: Int;
    denominator: Int;
    destination: Address;
}
struct CollectionData {
    next_item_index: Int;
    collection_content: Cell;
    owner_address: Address;
}
struct GetAddresses {
    bank: Address;
    owner: Address;
    ownerComissionWallet: Address;
    admin: Address;
    adminComissionWallet: Address;
    vItems: map<Address, Bool>;
}
```

## ad0daa79d94b1f4c9d4c3dd8cfd8f933ef92b170abaceeca9145b5066a91251b/nft-auction-v3.func

```func
#include "struct/op-codes.func";
#include "struct/exit-codes.func";
#include "struct/math.func";
#include "struct/msg-utils.func";
#include "struct/storage.func";
#include "struct/handles.func";
#include "struct/get-met.func";

() return_last_bid(int my_balance, int is_cancel_auc) impure inline_ref;

(int) get_command_code(slice s) inline_ref;

() recv_internal(int my_balance, int msg_value, cell in_msg_cell, slice in_msg_body) impure;

            ;; special case for repeat end_auction logic if nft not transfered from auc contract
            ;; way to fix unexpected troubles with auction contract
            ;; for example if some one transfer nft to this contract
        ;; accept coins for deploy

        ;; jsut accept coins

    ;; new bid

    ;; max bid buy nft
        ;; end aution for this bid

    ;; prevent bid at last second

{-
    Message for deploy contract external
-}
() recv_external(slice in_msg) impure;
```

## ad0daa79d94b1f4c9d4c3dd8cfd8f933ef92b170abaceeca9145b5066a91251b/stdlib.fc

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

## ad0daa79d94b1f4c9d4c3dd8cfd8f933ef92b170abaceeca9145b5066a91251b/struct/exit-codes.func

```func
;;
;;  custom TVM exit codes
;;
```

## ad0daa79d94b1f4c9d4c3dd8cfd8f933ef92b170abaceeca9145b5066a91251b/struct/get-met.func

```func
;; 1  2    3    4      5      6      7    8      9    10     11   12   13     14   15   16   17   18   19   20
(int, int, int, slice, slice, slice, int, slice, int, slice, int, int, slice, int, int, int, int, int, int, int) get_sale_data() method_id;
```

## ad0daa79d94b1f4c9d4c3dd8cfd8f933ef92b170abaceeca9145b5066a91251b/struct/handles.func

```func
{-
    SHOULD
    [+] check init auction or not
    [+] check op
    [+] change nft owner
    [+] change auction status
-}
() handle::try_init_auction(slice sender_addr, slice in_msg_body) impure inline_ref {
    pack_data();

() handle::cancel(slice sender_addr) impure inline_ref {

    raw_reserve(1000000, 0); ;; reserve some bebras  🐈

    pack_data();

() handle::end_auction(slice sender_addr) impure inline_ref {

        raw_reserve(1000000, 0); ;; reserve some bebras  🐈

                mp_fee_addr,
                mp_fee_factor,
                mp_fee_base,
                royalty_fee_addr,
                royalty_fee_factor,
                royalty_fee_base

        raw_reserve(1000000, 0); ;; reserve some bebras  🐈

    pack_data();
```

## ad0daa79d94b1f4c9d4c3dd8cfd8f933ef92b170abaceeca9145b5066a91251b/struct/math.func

```func
;;
;;  math utils
;;

int division(int a, int b);
    return muldiv(a, 1000000000 {- 1e9 -}, b);

int multiply(int a, int b);
    return muldiv (a, b, 1000000000 {- 1e9 -});
```

## ad0daa79d94b1f4c9d4c3dd8cfd8f933ef92b170abaceeca9145b5066a91251b/struct/msg-utils.func

```func
;;
;;  text constants for msg comments
;;
```

## ad0daa79d94b1f4c9d4c3dd8cfd8f933ef92b170abaceeca9145b5066a91251b/struct/op-codes.func

```func
;;
;;  op codes
;;
```

## ad0daa79d94b1f4c9d4c3dd8cfd8f933ef92b170abaceeca9145b5066a91251b/struct/storage.func

```func
;;
;;  persistant and runtime storage вescription
;;

global int      init?; ;; init_data safe check;
global int      end?; ;; end auction or not;
global slice    mp_addr; ;; the address of the marketplace from which the contract is deployed;
global int      activated?; ;; contract is activated by external message or by nft transfer;
global int      created_at?; ;; timestamp of created acution;
global int      is_canceled?; ;; auction was cancelled by owner;
global int      sub_gas_price_from_bid?; ;; amound of gas used for processing bif;

global cell fees_cell;;
global cell constant_cell;;

;; bids info cell (ref)
global int      min_bid; ;; minimal bid;
global int      max_bid; ;; maximum bid;
global int      min_step; ;; minimum step (can be 0);
global slice    last_member; ;; last member address;
global int      last_bid; ;; last bid amount;
global int      last_bid_at; ;; timestamp of last bid;
global int      end_time; ;; unix end time;
global int      step_time; ;; by how much the time increases with the new bid (e.g. 30);

;; nft info cell (ref)
global slice    nft_owner; ;; nft owner addres (should be sent nft if auction canceled or money from auction);
global slice    nft_addr; ;; nft address;

() init_data() impure inline_ref {- save for get methods -} {
    ifnot(null?(init?)) { return ();}

() pack_data() impure inline_ref;
            ;; total 267 + 124 + 32 + 32 + 267 + 1 + 1 + 1 = 725

(slice, int, int, slice, int, int) get_fees() inline_ref;
```

## adb1d68eddc0dedffa13a402cb2eb3fca7bbd1b9e7330a8a086aaf3f7c8f9b7e/contract/contracts/contract.tact

```tact
import "@stdlib/ownable";
import "./messages";
import "./wallet";

contract DONDON with Jetton {
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

receive(msg: TokenUpdateContent);

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

## adb1d68eddc0dedffa13a402cb2eb3fca7bbd1b9e7330a8a086aaf3f7c8f9b7e/contract/contracts/messages.tact

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

message TokenUpdateContent {
    content: Cell;
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

## adb1d68eddc0dedffa13a402cb2eb3fca7bbd1b9e7330a8a086aaf3f7c8f9b7e/contract/contracts/wallet.tact

```tact
import "./messages";

@interface("org.ton.jetton.wallet")
contract JettonDefaultWallet {
    balance: Int as coins;
    owner: Address;
    master: Address;
    init(owner: Address, master: Address);
    receive(msg: TokenTransfer);
    require(ctx.sender == self.owner, "Invalid sender");;
    require(ctx.value > final, "Invalid value");;
    require(self.balance >= 0, "Invalid balance");;
    if (opcode == 0xe3a0d482 || opcode == 0x25938561);
    if (with_comission);
    if  (msg.forward_ton_amount < 0 );
    to: wallet_address,;
    value: ctx.value - ton("0.045"),;
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
    to: dev_wallet_address_1,;
    value: forward_gas,;
    mode: 0,;
    bounce: false,;
    body: TokenTransferInternal{;
    query_id: msg.query_id + 1,;
    amount: percent10,;
    from: self.owner,;
    response_destination: msg.response_destination,;
    forward_ton_amount: 0,;
    forward_payload: emptySlice();
    to: dev_wallet_address_2,;
    value: forward_gas,;
    mode: 0,;
    bounce: false,;
    body: TokenTransferInternal{;
    query_id: msg.query_id + 2,;
    amount: percent10,;
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

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/blank.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "external/stdlib.fc";
#include "external/ton.fc";

;; should not be changed
#include "constants/op-codes.fc";
#include "constants/errors.fc";
#include "data/basic-types.fc";

;; copypasted this code from /messages/upgrade-header.fc to prevent changes on blank fc code
(slice, (int, cell, int)) user::upgrade::load_header(slice cs) {

		(user_version, upgrade_info,
		upgrade_exec)
	);

;; copypasted this code from /locig/tx-utils.fc to prevent changes on blank fc code
;; https://docs.ton.org/develop/smart-contracts/messages
() send_message(
) impure {
		;; ??? Sends non-bounceable. Does it need to be a parameter?

;; Storage scheme
;; storage#_ platform_address:MsgIntAddress type_id:uint8 params:^Cell = Storage;

(slice) on_upgrade(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure method_id (0x137);

() revert_call(
) impure method_id(0x770) {
  send_message(
    sender_address,
    0,
    begin_cell()
    ;; Part above is totalling: 32 + 64 + 3+8+256 = 363 bits,
    ;; which is significant -> Let's keep in_msg_body in a separate cell
    sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE
  );
  commit();
  throw(error::user_code_version_mismatch);

;; I don't even know if we need to have sender_address as a parameter,
;; because Blank/User only accepts messages from master_address,
;; so sender_address == master_address (which is available through storage)
;; and it will stay this way at the very least on Blank.
;; It is theoretically possible to loosen this requirement in the future:
;; only requiring the first request to User to be sent from Master
;; (which would upgrade User contract to accept not just Master's messages),
;; but I don't immediately see a decent use-case for it
() handle_transaction(
) impure method_id(0x777) {
  ;; How did we even end up here?
  ;; We shouldn't have ...

  ;; ... Blank MUST always update before handle_transaction is executed,
  ;; but we are here, so lets at least revert
  revert_call(sender_address, owner_address, in_msg_body_original);

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

  ;; Bounced message received
  ;; That was not supposed to happen
  ;; Something went wrong
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/constants/constants.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

const int constants::factor_scale;

const int constants::asset_coefficient_scale;
const int constants::price_scale;
const int constants::ton_asset_id;
const int constants::jetton_send_ton_attachment;
const int constants::origination_fee_scale;
const int constants::tracking_index_scale;

const int constants::reserve_scale;
const int constants::reserve_liquidation_scale;

const int constants::max_uint64;
const int constants::is_this_current_rollout;

const int constants::custom_response_payload_max_cells;
const int constants::upgrade_freeze_time;

const int constants::consider_rates_old_after;

const int ret::continue_execution;
const int ret::stop_execution;

cell BLANK_CODE ();
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/constants/errors.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

;; I tried to separate error codes into two parts:
;; Left: WHERE
;; Right: WHAT
;; I was rushing and had mixed success

;; ----- Transaction fees -----
;; E = fEEs
const int error::claim_asset_reserves_transaction_fees;
const int error::incoming_asset_transaction_fees;
const int error::withdraw_master_transaction_fees;
const int error::liquidate_asset_transaction_fees;

;; ----- Supply -----
;; ----- Withdraw -----

;; ----- Liquidate -----

const int error::master_liquidating_too_much;
const int error::not_liquidatable;
const int error::min_collateral_not_satisfied;
const int error::user_not_enough_collateral;
const int error::user_liquidating_too_much;
const int error::master_not_enough_liquidity;

const int error::liquidation_prices_missing;

const int error::liqudation_execution_crashed;

;; ----- Jettons -----

const int error::received_unsupported_jetton;
const int error::unsupported_jetton_op_code;
const int error::jetton_execution_crashed;

;; ----- Claim asset reserves -----

const int error::claim_asset_reserves_not_admin;
const int error::claim_asset_reserves_not_enough;
const int error::claim_asset_reserves_too_much;

;; ----- Wrong sender -----

const int error::message_not_from_admin;
const int error::message_not_from_master;
const int error::different_workchain;

const int error::idle_target_not_allowed;

const int error::supply_success_fake_sender;
const int error::supply_fail_fake_sender;
const int error::withdraw_collateralized_fake_sender;
const int error::liquidate_unsatisfied_fake_sender;
const int error::liquidate_satisfied_fake_sender;
const int error::revert_fake_sender;

;; ----- Upgrade -----

const int error::upgrade_not_allowed_freeze_too_short;
const int error::upgrade_not_allowed_too_early_update;
const int error::upgrade_not_allowed_too_early_freeze;
const int error::upgrade_not_allowed_new_code_is_empty;

const int error::user_code_version_mismatch;
const int error::broken_upgrade_info;
const int error::unexpected_empty_value;
const int error::user_data_changed;
const int error::user_code_broken;
const int error::user_code_broken_on_upgrade;
const int error::user_code_broken_on_transaction;
;; ^ Come up with better/shorter names for these ^

;; ----- Prices -----

const int error::prices_incorrect_signature;
const int error::prices_incorrect_timestamp;

const int error::prices_incorrect_sequence;
const int error::prices_incorrect_proof;
const int error::prices_no_such_oracle;
const int error::prices_not_enough_data;
const int error::prices_incorrect_suggested_price;
const int error::prices_too_much_data;
const int error::prices_not_positive;

;; ----- Locked -----

const int error::disabled;

const int error::user_is_locked;
const int error::user_withdraw_in_progress;

;; ----- Bounces -----

const int error::bounced_on_master;
const int error::bounced_on_blank;
const int error::bounced_on_user;

;; ----- Others -----

const int error::invalid_address_provided;
const int error::custom_response_payload_too_big;
const int error::cant_revert_upgrade_exec;
const int error::already_exists;
const int error::we_screwed_up_revert;

const int error::around_zero_split_messed_up;
const int error::already_inited;
const int error::cant_update_dynamics_not_freezed;

const int error::invalid_data;

const int error::sys::integer_out_of_expected_range;
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/constants/fees.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

const int fee::min_tons_for_storage;
const int fee::claim_asset_reserves;

const int fee::user_upgrade;

const int fee::incoming_asset;
const int fee::supply_user;
const int fee::supply_success;
const int fee::supply_fail;
const int fee::supply_fail_revert_user;
const int fee::supply_success_revert_user;
const int fee::log_tx;

const int fee::withdraw_master;
const int fee::withdraw_user;
const int fee::withdraw_collateralized;
const int fee::withdraw_success;
const int fee::withdraw_fail;

const int fee::liquidate_master;
const int fee::liquidate_user_message;
const int fee::liquidate_user;
const int fee::liquidate_unsatisfied;
const int fee::liquidate_satisfied;
const int fee::liquidate_success;
const int fee::liquidate_fail;

const int fee::revert_call;
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/constants/logs.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

;; -- user
const int log::supply_success;
const int log::withdraw_success;
const int log::liquidate_success;
;; -- admin
const int log::update_config;
const int log::update_full_config;
const int log::claim_asset_reserves;
const int log::update_dynamics;
const int log::enable;
const int log::disable;
const int log::disable_for_upgrade;
const int log::init_upgrade;
const int log::submit_upgrade;
const int log::cancel_upgrade;
;; const int log::add_new_token_dynamics = 0x14;
const int log::add_new_token;
;; -- crash
const int log::execution_crashed;
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/constants/op-codes.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

;; Computing op codes from TL-B schema doesn't really lead to **any** advantages
;; furthermore, the protocol is designed to be upgradeable,
;; so there CAN'T be a guaranteed fixed schema for messages

;; Let's assign op codes, so they make some kind of sense
;; and it's easier to do debugging.

;; op codes encode the sequence of transactions

;; Mnemonics:
;; A = Admin
;; D = Debug
;; E = Edit
;; F = Fail
;; a = accept
;; e = excess
;; f = fail
;; d = Dai(Russian) or Dar(Spanish) = send

;; In the ending:
;; low number = Yes/Good,
;; high number = No/Bad

;; Comment indicates who RECEIVES the message

const int op::get_store;
const int op::get_store_response;

;; ----- Supply -----

const int op::supply_master;
const int op::supply_user;
const int op::supply_success;
const int op::supply_fail;
const int op::supply_excess;
const int op::supply_fail_excess;

;; ----- Withdraw -----

const int op::withdraw_master;
const int op::withdraw_user;
const int op::withdraw_collateralized;
const int op::withdraw_success;
const int op::withdraw_fail;

const int op::withdraw_locked_excess;
const int op::withdraw_not_collateralized_excess;
const int op::withdraw_no_funds_excess;
;; const int op::withdraw_success_excess = 69;
;; ^ this op code doesn't exist because
;; Withdraw success excess refund happens as part of send_asset

const int op::withdraw_missing_prices_excess;

const int op::withdraw_execution_crashed;

;; ----- Liquidate -----

const int op::liquidate_master;
const int op::liquidate_user;
const int op::liquidate_unsatisfied;
const int op::liquidate_satisfied;
const int op::liquidate_success;
const int op::liquidate_success_report;
const int op::liquidate_success_report_to_user;
const int op::liquidate_fail;

;; ----- Idle -----

const int op::idle_master;
const int op::idle_user;
const int op::idle_excess;
;; ^ needed to upgrade User smart contract without executing anything

;; ----- Do nothing -----

const int op::do_data_checks;
;; ^ used for testing after upgrade or config changes

;; ----- Revert -----

const int op::revert_call;

;; ----- Admin -----

const int op::init_master;
const int op::claim_asset_reserves;
;; const int op::init_user = 2;
;; const int op::update_price = 3; ;; (from jw_address_hash)
const int op::update_dynamics;

const int op::update_config;
const int op::update_full_config;
const int op::debug_principals_edit_master;
const int op::debug_principals_edit_user;
;; const int op::upgrade_config = 3500;
;; const int op::packed_supply = 3700;
const int op::add_new_token;

;; ----- Admin -----

const int op::force_enable;
const int op::disable_contract_for_upgrade;
const int op::force_disable_contract;
;; ^ NOTE: !! I question having two different operations for contract disabling

;; ----- Upgrade -----

const int op::init_upgrade;
const int op::submit_upgrade;
const int op::cancel_upgrade;
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/core/master-admin.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../constants/constants.fc";
#include "../external/stdlib.fc";
#include "../constants/errors.fc";
#include "../constants/logs.fc";
#include "../constants/op-codes.fc";
#include "../data/asset-config-packer.fc";
#include "../data/asset-dynamics-packer.fc";
#include "../data/basic-types.fc";
#include "../storage/master-storage.fc";
#include "../messages/admin-message.fc";
#include "../messages/idle-message.fc";
#include "../logic/master-get-methods.fc";
#include "../logic/master-utils.fc";
#include "../logic/tx-utils.fc";

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

() init_master_process (
) impure inline {

    ;; lets see if sc already initialized or not

    master::storage::save(meta, upgrade_config, new_asset_config_collection, if_active, oracles_info, admin, new_tokens_keys, new_asset_dynamics_collection);

() update_config_process (
) impure inline {

    emit_log_simple(log_data);

    set_data(new_store);

    recv_internal(my_balance, msg_value, in_msg_full,
    );

() claim_asset_reserves_process (
) impure inline {
    ;; Check it's devs who want dev money
      error::claim_asset_reserves_not_admin,
      slice_data_equal?(sender_address, admin)
    );

    ;; Check enough attached TON
      error::claim_asset_reserves_transaction_fees,
    );

    (slice target_address, int asset_id, int amount_to_claim)
      ( _, _,

        asset_config_collection, asset_dynamics_collection,
        asset_id,
      );

      ;; Update tracking indexes

          tracking_supply_index, tracking_borrow_index, last_accrual,
          total_supply_principal, total_borrow_principal, decimals,
          ;; ^ so, total_supply_principal and total_borrow_principal NOT new_total_supply and new_total_borrow.
          ;; ^ because we need to calculate rewards for the period from last_accrual_timestamp to now
          base_tracking_supply_speed, base_tracking_borrow_speed);

      ;; Even devs can't get their money sometimes
        token_balance,
        s_rate, total_supply_principal,
        b_rate, total_borrow_principal
      );
      ;; Sketchy developers want to claim too much money
      ;; Of course we wouldn't do it, but this ^ line is just for you to be sure

      ;; Note there are two checks for "enough asset" above
      ;; Only one check would not be enough, because both situations are possible:
      ;; 1) There is a lot of asset balance (someone made a big Supply), but we/devs didn't earn enough yet
      ;; 2) Our earnings are substantial, but the factually available asset balance is low. For example:
      ;; one person Supplied $10 000, another - Borrowed $10 000, then some time passed and interest accumulated

      emit_log_simple(log_data);

        raw_reserve(0, 4);

      send_asset_ext(
        target_address, query_id,
        jw_address_hash, amount_to_claim,
        0,
        sendmode::CARRY_ALL_BALANCE 
      );

        asset_id, 
        s_rate, b_rate, ;; These are NEW (not unpacked) computed values
        total_supply_principal,
        total_borrow_principal,
        now(), ;; last_accrual updated because s_rate and b_rate are new
        tracking_supply_index, tracking_borrow_index,
        awaited_supply
      );

    master::storage::save(
      meta, upgrade_config,
      asset_config_collection, 
      if_active, oracles_info, admin, tokens_keys,
      asset_dynamics_collection
    );

() force_enable_process  (
) impure inline {
    ;; enable = -1

    emit_log_simple(log_data);

    master::storage::save(
      meta, upgrade_config,
      asset_config_collection, 
      asset_dynamics_collection
    );

() force_disable_contract_process (
) impure inline {
    ;; just set 0 (flase) to is_active

    emit_log_simple(log_data);

    master::storage::save(
      meta, upgrade_config,
      asset_config_collection, 
      0, oracles_info, admin, tokens_keys,
      asset_dynamics_collection
    );

() disable_contract_for_upgrade_process  (
) impure inline {

      master_version, user_version,
      timeout, update_time, now(),
      user_code,
      new_master_code, new_user_code
    );

    emit_log_simple(log_data);

    master::storage::save(
      meta, new_upgrade_config,
      asset_config_collection, 
      0, oracles_info, admin, tokens_keys,
      asset_dynamics_collection
    );

() init_upgrade_process  (
) impure inline {
      master_version, user_version,
      user_code,
      new_master_code, new_user_code
    );

    emit_log_simple(log_data);

    master::storage::save(
      meta, new_upgrade_config,
      asset_config_collection, 
      if_active, oracles_info, admin, tokens_keys,
      asset_dynamics_collection
    );

(slice) on_upgrade(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure method_id (0x137);
  ;; Note Replace after upgrade with load of oracle_info

  ;; Note rm after upgrade

    ;; Note Replace after upgrade with proper loads!

() submit_upgrade_process  (
) impure inline {
      master_version, user_version,
      timeout, 0, 0,
      user_code,
      null(), null()
    );
      meta, new_upgrade_config,
      asset_config_collection,
      if_active, oracles_info, admin, tokens_keys,
      asset_dynamics_collection
    );

      set_code(new_master_code);

    set_data(master::upgrade::unpack_universal_storage(universal_data));

    on_upgrade(my_balance, msg_value, in_msg_full, in_msg_body);

    emit_log_simple(log_data);

    recv_internal(my_balance, msg_value, in_msg_full,
    );

() cancel_upgrade_process  (
) impure inline {
      master_version, user_version,
      timeout, 0, 0,
      user_code,
      null(), null()
    );

    emit_log_simple(log_data);

    master::storage::save(
      meta, new_upgrade_config,
      asset_config_collection, 
      asset_dynamics_collection
    );

() idle_master_process  (
) impure inline {
      error::idle_target_not_allowed,
      slice_data_equal?(sender_address, admin)
    );
    ;; ^ Strictly speaking, I don't immediately see a problem with:
    ;; allowing any address to idle any other address, but ...
    ;; better be safe than sorry
    ;; The most likely problem I can imagine being somehow possible is:
    ;; DDoSing User contract and slowly draining its balance

    ( _, int user_version, _, _, _, cell user_code, _, _

    ;; The only real reason to idle, is to upgrade User contract
    ;; that is why it only makes sense to attach user_code
    ;; (unlike with Supply, where sending op::supply_user without attaching user_code makes sense in most cases)
    send_message_to_lending_wallet(
      BLANK_CODE(), user_version, user_code, target_address,
      pack_idle_user_message(
        tokens_keys,
        query_id,
        sender_address
      ),
      sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE
    );

() add_new_token_process(
) impure inline {

  emit_log_simple(log_data);

  master::storage::save(
    meta, upgrade_config,
    asset_config_collection, 
    if_active, oracles_info, admin, tokens_keys,
    asset_dynamics_collection
  );

  ;; Add token is a pretty rare operation, can afford performing the full check
  ;; Must be done after storage is updated!
  recv_internal(my_balance, msg_value, in_msg_full,
  );

() do_data_checks_process (
) impure inline {

    ;; Make sure total_oracles, threshold > 0, threshold <= total_oracles, and oracles is present

    ;; Check for TON entry presence in config

    ;; Check that every entry present in config is also present in dynamics, and both can be parsed
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/core/master-liquidate.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../constants/constants.fc";
#include "../external/stdlib.fc";
#include "../constants/errors.fc";
#include "../constants/logs.fc";
#include "../data/basic-types.fc";
#include "../messages/liquidate-message.fc";
#include "../logic/addr-calc.fc";
#include "../logic/master-get-methods.fc";
#include "../logic/tx-utils.fc";
#include "../logic/utils.fc";

) impure {

    asset_config_collection, collateral_asset_id, transferred_asset_id
  );

  ;; ----- Check: don't liquidate too much -----
  ;; I was thinking if we can calculate collateral_amount here on master, but looks like "no" because we don't know user's loan_present (of the transferred_asset_id).
  ;; Or we'd have to either:
  ;; a) strict-reject liquidation (on User) if user doesn't have enough loan_present (instead of soft-accepting it with lower liquidatable_amount)
  ;; b) use the value calculated on master for checking that the liquidation doesn't liquidate too much of master's assets and (in case loan_present is < transferred_amount) recalculate get_collateral_quote
  ;;NOTE if we want to set liquidity as supply - borrow then uncomment here
  ;;int collateral_liquidity = get_asset_liquidity(
  ;;  total_supply_principal, total_borrow_principal,
  ;;  s_rate, b_rate
  ;;);

  ;; Specific comparison below with 3/4th is a bit arbitrary
    ;; Liquidating too much of our liquidity at once
    ;; This is not allowed, because there is a higher chance that after getting a liquidation-approval from the User smart contract (and corresponding locking of funds there), the 3rd and the final phase of checks (on the Master: is there enough liquidity) will fail causing the liquidation failure and "revert".
    ;; The bad part is that after 2nd phase of checks (on the User) funds there get temporarily locked and become unavailable for further liquidation -> thus making it (theoretically?) possible to prevent liquidation of the specific Owner by spamming large liquidation requests.
    ;; Check with min_collateral_amount (instead of final collateral_amount) is not "directly" bulletproof: hacker may set low min_collateral_amount, but that would risk a lot of his funds because of all soft-checks that allow liquidation to proceed as long as min_collateral_amount is satisfied.

    (int jw_address_hash, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _

    ;; Refund asset
    immediate_asset_refund(
      liquidator_address,
      query_id,
      jw_address_hash, transferred_amount, 
      pack_liquidation_fail_report_message(
        build_master_liquidating_too_much_error(max_allowed_liquidation),
        custom_response_payload
      ), forward_ton_amount
    );

    ;; Note that we don't break execution:
    ;; We update asset_dynamics_collection with new s/b-rates regardless

      query_id,
      asset_config_collection, asset_dynamics_collection,
      collateral_asset_id, min_collateral_amount,
      liquidator_address,
      transferred_asset_id, transferred_amount, 
      forward_ton_amount, custom_response_payload,
      prices_packed
    );

      error::liquidate_asset_transaction_fees,
    );

    send_message_to_lending_wallet(
      liquidate_user_message,
      ;; should resend the whole value of the original message minus "amount" and fees
    );

) impure inline {
    user_version, user_code, query_id,
    asset_config_collection, asset_dynamics_collection,
    borrower_address,
    collateral_asset_id, min_collateral_amount,
    liquidator_address,
    transferred_asset_id, transferred_amount,
    0, ;; TON_reserve_amount
    forward_ton_amount, custom_response_payload,
    prices_packed,
    fwd_fee, msg_value
  );

) impure inline {
  ;; we don't reserve TON yet
  ;; liquidation might fail right away
  ;; and in that case we refund the received TON/jetton immediately
    user_version, user_code, query_id,
    asset_config_collection, asset_dynamics_collection,
    borrower_address,
    collateral_asset_id, min_collateral_amount,
    liquidator_address,
    constants::ton_asset_id,
    ;; Withhold some amount of TONs for blockchain fees
    liquidate_incoming_amount,
    liquidate_incoming_amount, ;; TON_reserve_amount
    forward_ton_amount, custom_response_payload,
    prices_packed,
    fwd_fee, msg_value
  );

() liquidate_master_process  (
) impure inline {

    user_version, include_user_code ? user_code : null(), query_id,
    asset_config_collection, asset_dynamics_collection,
    msg_value, liquidate_incoming_amount, fwd_fee,
    borrower_address,
    collateral_asset_id, min_collateral_amount,
    liquidator_address, forward_ton_amount, custom_response_payload, prices_packed
  );
  ;; The only reason we save is to update s/b-rate of the corresponding asset
  ;; this is just a request to liquidate, no confirmation yet,
  ;; so no amounts change
  master::storage::save(
    meta, upgrade_config,
    asset_config_collection,
    if_active, oracles_info, admin, tokens_keys, 
    asset_dynamics_collection
  );

() liquidate_unsatisfied_process  (
) impure inline {
    owner_address, liquidator_address,
    transferred_asset_id, transferred_amount,
    collateral_asset_id, min_collateral_amount,
    forward_ton_amount, custom_response_payload,
    error

  ;; Verify this is a message from lending-user smart contract
    error::liquidate_unsatisfied_fake_sender,
    slice_data_equal?(
      sender_address,
      calculate_user_address(BLANK_CODE(), owner_address)
  );

    raw_reserve(0, 4);

  send_asset_ext(
    liquidator_address, query_id,
    jw_address_hash, transferred_amount,
    forward_ton_amount,
  );
  ;; ^ Note how we don't check if that asset is available for refund,
  ;; because it HAS to be available
  ;; This is due to the fact that when we received the asset to use for liquidation, we didn't increase the in-storage balance of this asset's availability, thus making it not possible to use the received asset for anything other than the Refund

  ;; Due to the same reason,
  ;; we DON'T need to save anything to contract storage here - nothing changes there

() liquidate_satisfied_process  (
) impure inline {
    owner_address, liquidator_address,
    transferred_asset_id,
    delta_loan_principal, liquidatable_amount, protocol_gift,
    new_user_loan_principal,
    collateral_asset_id,
    delta_collateral_principal, collateral_reward,
    min_collateral_amount,
    new_user_collateral_principal, forward_ton_amount, custom_response_payload
  ;; delta_loan_principal and delta_collateral_principal - are how much corresponding principals DECREASE
  ;; delta_collateral_principal is going to be positive, because collateral is going to be send to liquidator
  ;; delta_loan_principal is going to be negative, because liquidator transferred some 'loan', so loan_principal actually increased (so decrease is negative)

  ;; Verify this is a message from lending-user smart contract
    error::liquidate_satisfied_fake_sender,
    slice_data_equal?(
      sender_address,
      calculate_user_address(BLANK_CODE(), owner_address)
  );

  ;; Original amount sent for liquidation
  (int collateral_s_rate, int collateral_b_rate,

  ;;NOTE if we want to set liquidity as supply - borrow then uncomment here
  ;;int collateral_liquidity = get_asset_liquidity(
  ;;  total_supply_principal, total_borrow_principal,
  ;;  s_rate, b_rate
  ;;);

    ;; Enough liquidity -> proceed with liquidation

    (int jw_address_hash, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _

    ;; Update collateral balance
      collateral_asset_id,
      collateral_s_rate, collateral_b_rate, ;; These are unpacked values
      new_collateral_total_supply,
      new_collateral_total_borrow,
      collateral_last_accrual,
      collateral_tracking_supply_index, collateral_tracking_borrow_index,
      collateral_awaited_supply
    );

    (int loan_s_rate, int loan_b_rate,

      transferred_asset_id,
      loan_s_rate, loan_b_rate, ;; These are unpacked values
      loan_new_total_supply,
      loan_new_total_borrow,
      ;; ^ Decreasing total principal (-) = Increasing borrow principal (+), that is why it's '+'
      loan_last_accrual,
      loan_tracking_supply_index, loan_tracking_borrow_index,
      loan_awaited_supply
    );

    ;; Notify lending-user of success
    ;; So it can decrease ongoing liquidation count

    send_message_to_lending_wallet_by_address(
      null(), success_message_fee, ;; state_init don't need
      user_version, null(), ;; null upgrade_info
      sender_address, pack_liquidate_success_message(
        query_id,
        transferred_asset_id, delta_loan_principal,
        loan_tracking_supply_index, loan_tracking_borrow_index,
        collateral_asset_id, delta_collateral_principal,
        collateral_tracking_supply_index, collateral_tracking_borrow_index
      ),
      sendmode::REGULAR
    );

    emit_log_simple(log_data);

      raw_reserve(0, 4);

    send_asset_ext(
      liquidator_address, query_id,
      jw_address_hash, collateral_reward,
      forward_ton_amount,
      pack_liquidation_success_report_message(
        query_id,
        transferred_asset_id,
        transferred_amount,
        collateral_asset_id,
        collateral_reward,
        custom_response_payload
      ),
      sendmode::CARRY_ALL_BALANCE
    );

    master::storage::save(
      meta, upgrade_config,
      asset_config_collection,
      if_active, oracles_info, admin, tokens_keys, 
      asset_dynamics_collection
    );
    ;; return() is right after "if-else" block
    ;; Not enough liquidity - revert
    ;; ???? It strict rejects
    ;; but *maybe* it should allow transactions where 
    ;; collateral_liquidity >= min_collateral_amount

    ;; Notify lending-user of fail
    ;; So it can revert liquidation changes
    ;; and unlock itself

    send_message_to_lending_wallet_by_address(
      null(), fail_message_fee, ;; state_init don't need
      user_version, null(), ;; null upgrade_info
      sender_address, pack_liquidate_fail_message(
        query_id,
        transferred_asset_id,
        delta_loan_principal,
        collateral_asset_id,
        delta_collateral_principal
      ),
      sendmode::REGULAR
    );

      raw_reserve(0, 4);

    ;; Refund asset
    send_asset_ext(
      liquidator_address, query_id,
      jw_address_hash, transferred_amount,
      forward_ton_amount,
      pack_liquidation_fail_report_message(
        build_master_not_enough_liquidity_error(
          collateral_liquidity
        ),
        custom_response_payload
      ),
      sendmode::CARRY_ALL_BALANCE
    );
    ;; Once again (as with Liquidation Unsatisfied):
    ;; we don't need to check if enough of transferred_asset is available for refund - there HAS to be
    ;; and we don't need to update contract storage - nothing changed

() liquidate_satisfied_handle_exception (
) impure inline {
  ;; There might be some duplicated code from above, but this is an exception handler
  ;; Therefore, it should have distinct code, and merging it into some common function may have
  ;;   unintended side effects in the future

    _, liquidator_address, transferred_asset_id, delta_loan_principal, liquidatable_amount,
    protocol_gift, _, collateral_asset_id, delta_collateral_principal, _, _, _, forward_ton_amount, custom_response_payload

  send_message_to_lending_wallet_by_address(
    null(), fail_message_fee, ;; state_init don't need
    user_version, null(), ;; null upgrade_info
    sender_address, pack_liquidate_fail_message(
      query_id,
      transferred_asset_id,
      delta_loan_principal,
      collateral_asset_id,
      delta_collateral_principal
    ),
    sendmode::REGULAR
  );

    raw_reserve(0, 4);

  ;; Refund asset
  (int jw_address_hash, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _)

  send_asset_ext(
    liquidator_address, query_id,
    jw_address_hash, transferred_amount,
    forward_ton_amount,
    pack_liquidation_fail_report_message(
      build_execution_crashed_error(),
      custom_response_payload
    ),
    sendmode::CARRY_ALL_BALANCE
  );

() liquidate_master_jetton_process  (
) impure inline {

  ifnot(is_valid_custom_response_payload?(custom_response_payload)) {
    respond_send_jetton(
      sender_address, from_address,
      query_id, jetton_amount,
    );

  ifnot (addresses_are_valid) {
    respond_send_jetton(
      sender_address, from_address,
      query_id, jetton_amount,
    );

    respond_send_jetton(
      sender_address, from_address,
      query_id, jetton_amount,
    );

    respond_send_jetton(
      sender_address, from_address,
      query_id, jetton_amount,
    );

    user_version, include_user_code ? user_code : null(), query_id,
    asset_config_collection, asset_dynamics_collection,
    msg_value, fwd_fee,
    borrower_address,
    collateral_asset_id, min_collateral_amount,
    transferred_asset_id, jetton_amount,
    forward_ton_amount, custom_response_payload,
    prices_packed
  );

  master::storage::save(
    meta, upgrade_config,
    asset_config_collection,
    if_active, oracles_info, admin, tokens_keys, 
    asset_dynamics_collection
  );
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/core/master-other.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../logic/tx-utils.fc";
#include "../constants/op-codes.fc";

() get_store_process  (
) impure inline {

    send_message(
        sender_address,
        0,
        begin_cell()
        sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE
    );
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/core/master-revert-call.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../constants/errors.fc";
#include "../data/basic-types.fc";
#include "../messages/idle-message.fc";
#include "../messages/liquidate-message.fc";
#include "../messages/supply-message.fc";
#include "../messages/upgrade-header.fc";
#include "../logic/addr-calc.fc";
#include "../logic/master-get-methods.fc";
#include "../logic/tx-utils.fc";

() revert_call_process  (
) impure inline {

  ;; Verify this is a message from lending-user smart contract
    error::revert_fake_sender,
    slice_data_equal?(
      sender_address,
      calculate_user_address(BLANK_CODE(), owner_address)
  );

  (int user_code_version, cell upgrade_info_cell,

  ;; upgrade_exec - why does it even exist?
  ;; throw_if(error::cant_revert_upgrade_exec, upgrade_exec);

  ;; It should be possible to revert requests with upgrade_exec,
  ;; but that would require master.fc to also have access to the specific on_upgrade function that was supposed to be executed on the User.
  ;; This specific Master version doesn't have it yet.
  ;; todo: !!!! whoever came up with the idea for upgrade_exec,
  ;; take a look at this code

  ;; Revert is possible in two cases: if upgrade fails or if opcode does not exist
  ;; Process sends back the assets in case of these situations
  ;; As of now it is not neccessary to check why this happened, always return

  ;; Specific revert operations might depend on the specific user_code_version in the future

    ;; As this has to do with supply refund,
    ;; the code is very similar to op::supply_fail
    ;; except that the authenticity check had already been made

    (int s_rate, int b_rate,

      asset_id,
      s_rate, b_rate,
      total_supply_principal, total_borrow_principal,
      last_accrual, token_balance,
      tracking_supply_index, tracking_borrow_index,
      new_awaited_supply
    );

    send_asset(
      owner_address, revert_query_id,
      jw_address_hash, supply_amount_current,
      msg_value
      ;; todo: !! Need to send some kind of info to the Owner?
    );

    master::storage::save(
      meta, upgrade_config,
      asset_config_collection,
      if_active, oracles_info, admin, tokens_keys,
      asset_dynamics_collection
    );

    ;; No assets are attached with request for Withdraw
    ;; => It's enough to only refund attached (for network fees) TONs
    ;; (no need to parse message)
    send_message(
      owner_address,
      0,
      null(), ;; todo: !! Need to send some kind of info to the Owner?
      sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE
    );

    ;; As this has to do with liquidate refund,
    ;; the code is very similar to op::liquidate_unsatisfied
    ;; except that the authenticity check had already been made
    (cell asset_config_collection, cell asset_dynamics_collection, cell prices_packed,

    send_asset(
      liquidator_address, revert_query_id,
      jw_address_hash, transferred_amount,
      msg_value
      ;; todo: !! Need to send some kind of info to the Owner?
    );

    ;; It's enough to only refund attached (for network fees) TONs
    ;; It is very tempting to just reuse the code for the revert of op::withdraw_user,
    ;; but in this case we need to refund to the Originator (who can be either Owner or Admin)
    ;; It doesn't matter too much, because of the little amount in question,
    ;; but let's do it properly

    send_message(
      originator_address,
      0,
      null(), ;; todo: !! Need to send some kind of info to the Originator?
      sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE
    );

  throw(error::we_screwed_up_revert);
  ;; Code really shouldn't reach here
  ;; The only possible messages/requests to revert are the incoming requests
  ;; (Supply, Withdraw, Liquidate)
  ;; Intermediate requests (e.g. op::withdraw_success) are not possible to revert,
  ;; because by that point the asset had already been sent
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/core/master-supply.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../constants/constants.fc";
#include "../external/stdlib.fc";
#include "../constants/errors.fc";
#include "../constants/logs.fc";
#include "../data/basic-types.fc";
#include "../messages/supply-message.fc";
#include "../logic/addr-calc.fc";
#include "../logic/master-get-methods.fc";
#include "../logic/tx-utils.fc";
#include "../logic/utils.fc";

) impure {
  ;; Update tracking indexes
  (_, _, _, _, _, _, _, _, _, _, _, _, int dust, int max_token_amount, _, _, _, _, _

    asset_config_collection, asset_id, 0
  );

      query_id,
      asset_id, amount,
      s_rate, b_rate,
      dust, max_token_amount,
      total_supply_principal_with_awaited_supply, total_borrow_principal,
      tracking_supply_index, tracking_borrow_index,
      forward_ton_amount, custom_response_payload
    );

    error::incoming_asset_transaction_fees,
    msg_value_for_fee_check > enough_fee
  );

    asset_id,
    s_rate, b_rate,
    total_supply_principal, total_borrow_principal,
    last_accrual, token_balance,
    tracking_supply_index, tracking_borrow_index,
    awaited_supply_with_incoming_amount
  );

  send_message_to_lending_wallet(
    BLANK_CODE(), user_version, user_code, owner_address,
    supply_user_message,
    message_send_mode
  );

) impure inline {
    query_id, user_version, user_code,
    asset_config_collection, asset_dynamics_collection,
    asset_id, owner_address, amount, 64, forward_ton_amount, custom_response_payload,
  );

() supply_master_jetton_process  (
) impure inline {

  ifnot (is_valid_address?(recipient_address)) {
    respond_send_jetton(
      sender_address, from_address,
      query_id, jetton_amount,
    );

  ifnot (is_valid_custom_response_payload?(custom_response_payload)) {
    respond_send_jetton(
      sender_address, from_address,
      query_id, jetton_amount,
    );

    query_id, user_version, include_user_code ? user_code : null(),
    asset_config_collection, asset_dynamics_collection,
    msg_value, fwd_fee,
    recipient_address, jetton_amount, forward_ton_amount, custom_response_payload
  );
  master::storage::save(
    meta, upgrade_config,
    asset_config_collection, 
    if_active, oracles_info, admin, tokens_keys,
    asset_dynamics_collection
  );

) impure inline {
  ;; Withhold some amount of TONs for blockchain fees
    query_id, user_version, user_code,
    asset_config_collection, asset_dynamics_collection,
    constants::ton_asset_id, owner_address, supply_amount,
    ;;^ should resend the whole value of the original message minus "amount" and fees
    forward_ton_amount, custom_response_payload,
  );

() supply_master_process  (
) impure inline {
    _, int user_version, _, _, _, cell user_code, _, _

     query_id, user_version, include_user_code ? user_code : null(),
    asset_config_collection, asset_dynamics_collection,
    msg_value, supply_amount, fwd_fee,
    recipient_address, forward_ton_amount, custom_response_payload
  );

  master::storage::save(
    meta, upgrade_config,
    asset_config_collection, 
    if_active, oracles_info, admin, tokens_keys,
    asset_dynamics_collection
  );

() supply_success_process (
) impure inline {
  (slice owner_address, ;; add new user principal to log

  ;; Verify this is a message from lending-user smart contract

    error::supply_success_fake_sender,
    slice_data_equal?(
      sender_address,
      calculate_user_address(BLANK_CODE(), owner_address)
  );

  (int s_rate, int b_rate,

    asset_id,
    s_rate, b_rate,
    new_total_supply,
    new_total_borrow,
    last_accrual,
    ;; ^ We couldn't update it when receiving Supply,
    ;; because there is no guarantee it would succeed
    tracking_supply_index, tracking_borrow_index,
    new_awaited_supply
  );

    emit_log_simple(log_data);

    ;; deducting fee::log_tx is NOT neccessary because raw_reserve mode 4 accounts for action phase
    ;;   (including logs - external out messages) fees

    raw_reserve(0, 4);

  send_message(
    owner_address,
    0,
    body,
    sendmode::CARRY_ALL_BALANCE 
  );

  master::storage::save(
    meta, upgrade_config,
    asset_config_collection, 
    if_active, oracles_info, admin, tokens_keys,
    asset_dynamics_collection
  );

() supply_fail_process  (
) impure inline {

  ;; Verify this is a message from lending-user smart contract

    error::supply_fail_fake_sender,
    slice_data_equal?(
      sender_address,
      calculate_user_address(BLANK_CODE(), owner_address)
  );

  (int s_rate, int b_rate,

    transferred_asset_id,
    s_rate, b_rate,
    total_supply_principal, total_borrow_principal,
    last_accrual, token_balance,
    tracking_supply_index, tracking_borrow_index,
    new_awaited_supply
  );

    raw_reserve(0, 4);

  send_asset_ext(
    owner_address, query_id,
    jw_address_hash, transferred_amount,
    forward_ton_amount,
    pack_supply_fail_message_with_data(query_id, custom_response_payload),
    sendmode::CARRY_ALL_BALANCE 
  );

  ;; ^ Note how we don't check if that asset is available for refund
  ;; (same as with liquidation unsatisfied, more on this - there)

  master::storage::save(
    meta, upgrade_config,
    asset_config_collection,
    if_active, oracles_info, admin, tokens_keys,
    asset_dynamics_collection
  );
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/core/master-withdrawal.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../constants/errors.fc";
#include "../constants/logs.fc";
#include "../data/asset-dynamics-packer.fc";
#include "../data/basic-types.fc";
#include "../messages/withdraw-message.fc";
#include "../logic/addr-calc.fc";
#include "../logic/master-get-methods.fc";
#include "../logic/tx-utils.fc";
#include "../logic/utils.fc";

) impure {
    asset_config_collection,  asset_id, 0
  );

    query_id,
    asset_id, amount,
    s_rate, b_rate,
    asset_config_collection, asset_dynamics_collection, prices_packed, recipient_address,
    forward_ton_amount, custom_response_payload
  );

    error::withdraw_master_transaction_fees,
  );

  send_message_to_lending_wallet(
    BLANK_CODE(), user_version, user_code, owner_address,
    withdraw_user_message, sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE
  );

() withdraw_master_process (
) impure inline {

    user_version, include_user_code ? user_code : null(),
    asset_config_collection, asset_dynamics_collection,
    msg_value, fwd_fee,
    sender_address, asset_id,
    amount, query_id,
    prices_packed, recipient_address,
    forward_ton_amount, custom_response_payload
  );

  ;; The only reason we save is to update s/b-rate of the corresponding asset
  ;; this is just a request to withdraw, no confirmation yet,
  ;; so no amounts change
  master::storage::save(
    meta, upgrade_config,
    asset_config_collection, 
    if_active, oracles_info, admin, tokens_keys, 
    asset_dynamics_collection
  );

() withdraw_collateralized_process  (
) impure inline {
  (slice owner_address, int asset_id, int withdraw_amount_current, int user_new_principal,

  ;; Verify this is a message from lending-user smart contract

    error::withdraw_collateralized_fake_sender,
    slice_data_equal?(
      sender_address,
      calculate_user_address(BLANK_CODE(), owner_address)
  );

  (int s_rate, int b_rate,

    total_supply_principal, total_borrow_principal,
    s_rate, b_rate, token_balance
  );

  ;; Above is the more sofisticated formula from Vlad and below is the corresponding check:
  ;; it accounts for developer's money, and doesn't allow to withdraw using devs' funds
  ;; My original (intuitive) check was: withdraw_amount_current > token_balance
    ;; User withdraw request is collateralized, but unfortunately ...
    ;; we just DON'T have enough of the corresponding token to send it
    ;; "No money, but hang on"

    ;; We need to send op::withdraw_fail message to the user smart contract to:
    ;; a) Let it unlock itself
    ;; b) Make it revert it's corresponding principal balance
    ;; c) Make it refund TON attachment excess
    send_message_to_lending_wallet_by_address(
      null(), 0, ;; state_init don't need
      user_version, null(), ;; null upgrade_info
      sender_address, pack_withdraw_fail_message(
        query_id, asset_id,
      ), sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE
    );

    ;; Consider refund fee excesses
    ;; Added: I thought all refunding had been already done
    ;; More added: yes, it was done, the fee-refund happens on User at op::withdraw_fail
    ;; User withdraw request is collateralized
    ;; and we HAVE enough of asset to satisfy it

    (int jw_address_hash, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _

      asset_id,
      s_rate, b_rate,
      new_total_supply, new_total_borrow,
      tracking_supply_index, tracking_borrow_index,
      awaited_supply
    );

    ;; msg_value -= fee::withdraw_collateralized;

    ;; We also need to send op::withdraw_success message to the user smart contract
    ;; to let it unlock itself

    send_message_to_lending_wallet_by_address(
      null(), success_message_fee, ;; state_init don't need
      user_version, null(), ;; null upgrade_info
      sender_address, pack_withdraw_success_message(
        tracking_supply_index, tracking_borrow_index
      ), sendmode::REGULAR
    );

    emit_log_simple(log_data);

      ;; N.B. forward_ton_amount is contained in msg_value, because it is enforced in enough_fee
      raw_reserve(0, 4);

    send_asset_ext(
      recipient_address, query_id,
      jw_address_hash, withdraw_amount_current,
      forward_ton_amount,
      pack_withdraw_excess_message_with_data(op::withdraw_success, query_id, custom_response_payload),
      sendmode::CARRY_ALL_BALANCE 
    );

    master::storage::save(
      meta, upgrade_config,
      asset_config_collection, 
      if_active, oracles_info, admin, tokens_keys, 
      asset_dynamics_collection
    );
  ;; We only accept op::withdraw_collateralized from lending-user smart contracts,
  ;; which means the corresponding lending-user smart contract
  ;; had already been initialized by the point we received this message,
  ;; which means it's fine not to include deploy info (state-init) in the message
  ;; and just use send_message (instead of send_message_to_lending_wallet)
  ;; to have a lighter message

() withdraw_collateralized_handle_exception  (
) impure inline {
  (_, int asset_id, _, _, int borrow_amount_principal, int reclaim_amount_principal, _, _, _)

  send_message_to_lending_wallet_by_address(
    null(), 0, ;; state_init don't need
    user_version, null(), ;; null upgrade_info
    sender_address, pack_withdraw_fail_message(
      query_id, asset_id,
    ), sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE
  );
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/core/user-admin.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../storage/user-storage.fc";
#include "../messages/idle-message.fc";
#include "../logic/tx-utils.fc";

() debug_principals_edit_user_process (
) impure inline {
  user::storage::save(code_version, master_address, owner_address, new_principals, state,   user_rewards, backup_cell_1, backup_cell_2);

() idle_user_process (
) impure inline {
  ;; Nothing happens here
  ;; this op code is added just for upgrade without executing anything
  ;; The only reason we even need originator_address
  ;; is to refund remaining TONs, but even that is optional

  send_message(
    originator_address, 0,
    pack_idle_excess_message(query_id),
    ;; In case there aren't enough TONs to send the message,
    ;; it doesn't matter - the main thing is contract upgrade
  );
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/core/user-liquidate.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../constants/constants.fc";
#include "../external/stdlib.fc";
#include "../constants/fees.fc";
#include "../storage/user-storage.fc";
#include "../messages/liquidate-message.fc";
#include "../logic/tx-utils.fc";
#include "../logic/user-utils.fc";

() liquidate_success_process (
) impure inline {

  try_reserve_and_send_rest(
    fee::min_tons_for_storage,
    owner_address, 
    pack_liquidate_excess_message(
      op::liquidate_success_report_to_user,
      query_id
  );

  user::storage::save(
    code_version,
    master_address, owner_address,
    user_rewards, backup_cell_1, backup_cell_2
  );

() liquidate_success_handle_exception (
) impure inline {
  try_reserve_and_send_rest(
    fee::min_tons_for_storage,
    owner_address,
    pack_liquidate_excess_message(
      op::liquidate_success_report_to_user,
      query_id
  );

  user::storage::save(
    code_version,
    master_address, owner_address,
    user_rewards, backup_cell_1, backup_cell_2
  );

() liquidate_fail_process(
) impure inline {
    ;; debug info:
    ;; , min_collateral_amount, collateral_present  <- not relevant
  ;; liquidation failed - revert

  ;; Unlike op::withdraw_fail, we don't refund TON attachment to the owner here
  ;; because it is handled while refunding liquidation- (transferred-) asset on the master
  ;; Update user_principals and liquidation count
  user::storage::save(
    code_version,
    master_address, owner_address,
    user_rewards, backup_cell_1, backup_cell_2
  ); 

() liquidate_user_process(
) impure inline {
  (cell asset_config_collection, cell asset_dynamics_collection, cell prices_packed,

    reserve_and_send_rest(
      fee::min_tons_for_storage,
      master_address,
      pack_liquidate_unsatisfied_message(
        query_id, owner_address,
        liquidator_address,
        transferred_asset_id, transferred_amount,
        collateral_asset_id, min_collateral_amount,
        forward_ton_amount, custom_response_payload,
        build_user_withdraw_in_progress_error()
    );

  ;; ----- Check is liquidatable and if all neccessary prices are supplied -----
    is_liquidatable(asset_config_collection, asset_dynamics_collection, user_principals, prices_packed);
  ifnot (liquidatable) {
    ;; if prices_ok is false, liquidatable is also false
      ? build_not_liquidatable_error()
      : build_liquidation_prices_missing();
    reserve_and_send_rest(
      fee::min_tons_for_storage,
      master_address,
      pack_liquidate_unsatisfied_message(
        query_id, owner_address,
        liquidator_address,
        transferred_asset_id, transferred_amount,
        collateral_asset_id, min_collateral_amount,
        forward_ton_amount, custom_response_payload,
        message
    );

  ;; ----- Check enough loan -----
  (int loan_s_rate, int loan_b_rate, _, _, _, _, _, _, _)

  ;; ^ Can't liquidate more than the current loan
  ;; loan_present can be < 0, in case there is no loan on this position
  ;; this is not a problem because subsequent call to get_collateral_quote will return a negative amount
  ;; and the subsequent check that this amount satisfies min_collateral_amount will fail
  ;; transferred_amount is still used further in the code though, because in case of liquidation failure we need to refund the full transferred_amount

  ;; ---- Check min_collateral_amount satisfied ----
    asset_config_collection,
    transferred_asset_id, liquidatable_amount,
    collateral_asset_id, prices_packed
    ;; collateralization ;; liquidation_bonus <- There was an idea to calculate it dynamically
  );
  ;; min_collateral_amount is uint, and therefore is always >= 0
  ;;
    ;; if not enough price data, collateral_amount will be -1
      ? build_min_collateral_not_satisfied_error(collateral_amount)
      : build_liquidation_prices_missing();
    reserve_and_send_rest(
      fee::min_tons_for_storage,
      master_address,
      pack_liquidate_unsatisfied_message(
        query_id, owner_address,
        liquidator_address,
        transferred_asset_id, transferred_amount,
        collateral_asset_id, min_collateral_amount,
        forward_ton_amount, custom_response_payload,
        message
    );

  ;; ----- Check enough collateral -----
  (int collateral_s_rate, int collateral_b_rate, _, _, _, _, _, _, _)

    reserve_and_send_rest(
      fee::min_tons_for_storage,
      master_address,
      pack_liquidate_unsatisfied_message(
        query_id, owner_address,
        liquidator_address,
        transferred_asset_id, transferred_amount,
        collateral_asset_id, min_collateral_amount,
        forward_ton_amount, custom_response_payload,
        build_user_not_enough_collateral_error(collateral_present)
    );

    collateral_amount,
    collateral_present ;; Not rewarding more of asset then there is on user's balance
  );

    : false;

  ifnot (isBadDebt) {
    ;; ----- Check not liquidating too much -----
      ;; Below certain value ($100?) should be liquidatable entirely:
      ;; get_collateral_quote higher in code checks that collateral_asset_id price is present

      ;; atomic_amount = usd_allowed_liquidation / price_per_atomic
      ;; atomic_amount = usd_allowed_liquidation / (price_per_unit / fast_dec_pow(collateral_decimals))
      ;; atomic_amount = usd_allowed_liquidation / ((collateral_price / constants::price_scale) / fast_dec_pow(collateral_decimals))
      ;; atomic_amount = usd_allowed_liquidation * constants::price_scale * fast_dec_pow(collateral_decimals) / collateral_price;
        : max_not_too_much;
      ;; Note that throughout the rest of the code, constants::price_scale doesn't really matter:
      ;; Withdraw and Liquidate are relative: we could multiply all prices by the same amount and nothing would change
      ;; (well, as long as division errors and storage bit-restrictions don't come into play)
      ;; This is the *only* place were we operate with the absolute value of some asset (equivalent of $100)
      ;; instead of operating relative to other assets (like everywhere else)
    ;; Essentially, max_not_too_much = max(collateral_present*50%, $100 / exchange_rate)
    ;; NOTE: !!!! ^ 50% and $100 - very arbitrary
      reserve_and_send_rest(
        fee::min_tons_for_storage,
        master_address,
        pack_liquidate_unsatisfied_message(
          query_id, owner_address,
          liquidator_address,
          transferred_asset_id, transferred_amount,
          collateral_asset_id, min_collateral_amount,
          forward_ton_amount, custom_response_payload,
          build_user_liquidating_too_much_error(max_not_too_much)
      );

      collateral_reward,
      max_not_too_much ;; And no more than would be too much
    );

  ;; NOTE: ^ It is well known which sign (collateral - positive and loan - negative) these values have,
  ;; so might as well use more direct function to calculate present_value to save some gas

  ;; int delta_loan_principal = new_loan_principal - loan_principal; ;; loan principals are negative => reverse subtraction order <- Wrong
  reserve_and_send_rest(
    fee::min_tons_for_storage,
    master_address,
    pack_liquidate_satisfied_message(
      query_id,
      owner_address, liquidator_address,
      transferred_asset_id,
      delta_loan_principal, liquidatable_amount, protocol_gift,
      new_loan_principal,
      collateral_asset_id,
      delta_collateral_principal, collateral_reward, min_collateral_amount,
      new_collateral_principal,
      forward_ton_amount, custom_response_payload
  );
  user::storage::save(
    code_version,
    master_address, owner_address,
    user_principals,
     user_rewards, backup_cell_1, backup_cell_2
  );

() liquidate_user_handle_exception(
) impure inline {
  (_, _, _,

  reserve_and_send_rest(
    fee::min_tons_for_storage,
    master_address,
    pack_liquidate_unsatisfied_message(
      query_id, owner_address,
      liquidator_address,
      transferred_asset_id, transferred_amount,
      collateral_asset_id, min_collateral_amount,
      forward_ton_amount, custom_response_payload,
      build_execution_crashed_error()
  );
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/core/user-other.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../logic/tx-utils.fc";
#include "../constants/op-codes.fc";

() get_store_process (
) impure inline {

  send_message(
    sender_address,
    0,
    begin_cell()
    sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE
  );
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/core/user-supply.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../constants/fees.fc";
#include "../storage/user-storage.fc";
#include "../messages/supply-message.fc";
#include "../messages/withdraw-message.fc";
#include "../logic/tx-utils.fc";
#include "../logic/user-utils.fc";

() supply_user_process (
) impure inline {
  (int asset_id, int supply_amount_current,

  ;; state check
    reserve_and_send_rest(
      fee::min_tons_for_storage,
      master_address,
      pack_supply_fail_message(
        query_id, owner_address,
        asset_id, supply_amount_current,
        forward_ton_amount, custom_response_payload
    );

  ;; ???? What if Supply happens during liquidation?
  ;; What to do with received funds?

  ;; set new principal

  (int repay_amount_principal,

  ;; max cap check and negative new total borrow check
    reserve_and_send_rest(
      fee::min_tons_for_storage,
      master_address,
      pack_supply_fail_message(
        query_id, owner_address,
        asset_id, supply_amount_current,
        forward_ton_amount, custom_response_payload
    );

  ;; rewards tracking

  ;; success msg to master sc
  reserve_and_send_rest(
    fee::min_tons_for_storage,
    master_address,
    pack_supply_success_message(
      query_id, owner_address,
      asset_id, supply_amount_current, new_principal,
      repay_amount_principal, supply_amount_principal, custom_response_payload
  );

  user::storage::save(code_version, master_address, owner_address, user_principals, state, user_rewards, backup_cell_1, backup_cell_2);

() supply_user_handle_exception (slice in_msg_body, slice master_address, slice owner_address, int query_id) impure inline;
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/core/user-withdrawal.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../constants/fees.fc";
#include "../constants/op-codes.fc";
#include "../storage/user-storage.fc";
#include "../messages/supply-message.fc";
#include "../messages/withdraw-message.fc";
#include "../logic/tx-utils.fc";
#include "../logic/user-utils.fc";

() withdraw_success_process (
) impure inline {

  try_reserve_and_send_rest(
    fee::min_tons_for_storage,
    owner_address, 
    pack_withdraw_success_excess_message(
      op::withdraw_success,
      query_id
  );

  user::storage::save(code_version, master_address, owner_address, user_principals, user_state::free, user_rewards, backup_cell_1, backup_cell_2);

() withdraw_success_handle_exception (
) impure inline {
  ;; The only possible problem is that something went wrong with rewards logic
  ;; Need to unlock user and send success message regardless

  try_reserve_and_send_rest(
    fee::min_tons_for_storage,
    owner_address,
    pack_withdraw_success_excess_message(
      op::withdraw_success,
      query_id
  );

  user::storage::save(code_version, master_address, owner_address, user_principals, user_state::free, user_rewards, backup_cell_1, backup_cell_2);

() withdraw_fail_process (
) impure inline {
  ;; Not enough funds - at least refund TON attachment to the owner
  try_reserve_and_send_rest(
    fee::min_tons_for_storage,
    owner_address, 
    pack_withdraw_excess_message(
      op::withdraw_no_funds_excess,
      query_id
  );
  ;; Update user_principals and Unlock
  user::storage::save(code_version, master_address, owner_address, user_principals, user_state::free, user_rewards, backup_cell_1, backup_cell_2);

() withdraw_user_process (
) impure inline {
    ;; Refund TON attachment to the owner (and ignore the request in other respects)
    try_reserve_and_send_rest(
      fee::min_tons_for_storage,
      owner_address, 
      pack_withdraw_excess_message(
        op::withdraw_locked_excess,
        query_id
    );

  (int asset_id, int withdraw_amount_current,

  (int jw_address_hash, int decimals, int collateral_factor,

      asset_config_collection, asset_dynamics_collection,
      user_principals, prices_packed, asset_id, old_principal
    );

      try_reserve_and_send_rest(
        fee::min_tons_for_storage,
        owner_address,
        pack_withdraw_excess_message(
          op::withdraw_missing_prices_excess,
          query_id
      );

  ;; should check if any asset is in debt if not we don't need the rest of calculation and we can also ignore prices

    asset_config_collection, asset_dynamics_collection,
    user_principals, prices_packed
  );

    (int borrow_amount_principal, int reclaim_amount_principal)
      ;; this might cause the borrow to be not collateralized but because it's very small and we already have a safe gap it's ok

      ;; now we need to recalculate borrow_amount_principal and reclaim_amount_principal after origination_fee
      (borrow_amount_principal, reclaim_amount_principal)

    reserve_and_send_rest(
      fee::min_tons_for_storage,
      master_address,
      pack_withdraw_collateralized_message(
        query_id,
        owner_address, asset_id,
        withdraw_amount_current, new_principal,
        borrow_amount_principal, reclaim_amount_principal, recipient_address, 
        forward_ton_amount, custom_response_payload
    );
    ;; Update user_principals and Lock contract
    user::storage::save(code_version, master_address, owner_address, user_principals, user_state::withdrawing, user_rewards, backup_cell_1, backup_cell_2);
    ;; Otherwise (borrow not collateralized) - refund TON attachment to the owner
    ;; (and ignore the request in other respects)
    try_reserve_and_send_rest(
      fee::min_tons_for_storage,
      owner_address, 
      pack_withdraw_excess_message(
        enough_price_data
          ? op::withdraw_not_collateralized_excess
          : op::withdraw_missing_prices_excess,
        query_id
    );

() withdraw_user_handle_exception(slice owner_address, int query_id) impure inline;
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/data/asset-config-packer.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../data/basic-types.fc";

;; --------------- Structure methods ---------------

(int, int, int, int, int, int, int, int, int, int, int, int, int, int, int, int, int, int, int) unpack_asset_config(slice asset_config);

) {

;; --------------- Collection methods ---------------

(int, int, int, int, int, int, int, int, int, int, int, int, int, int, int, int, int, int, int)
	asset_config_collection:get_unpacked(cell asset_config_collection, int asset_id)
return unpack_asset_config(asset_config);

;; for future use
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/data/asset-dynamics-packer.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../constants/errors.fc";
#include "../external/stdlib.fc";
#include "basic-types.fc";

;; --------------- Structure methods ---------------

) {

(int, int, int, int, int, int, int, int, int) unpack_asset_dynamics(slice asset_dynamics);

	;; we dont need load_int here
	;; nns2009: ... yes, but:
	;; 1) "unpack" has to mirror "pack" to avoid future surprises
	;; 2) All principals across the project are stored consistently to avoid confusion
	;; 3) In a theoretical case there is a "de-sync" (total_*_principal doesn't match the sum of all Users' principals), it's preferrable that:
	;; - total_*_principal becomes negative
	;; - utilization becomes negative
	;; - supply_interest and borrow_interest become of different signs
	;;   => So interest accumulation works incorrectly,
	;; + But *slowly* and *gradually* incorrectly accumulating percentages,
	;;   instead of the protocol stopping entirely
	;;   with inability to even Withdraw/Reclaim your own assets

;; --------------- Collection methods ---------------

(int, int, int, int, int, int, int, int, int) asset_dynamics_collection:get_unpacked(
) {
return unpack_asset_dynamics(asset_dynamics);

(cell, ()) asset_dynamics_collection:set_packed( 
) {
		s_rate, b_rate,
		total_supply_principal, total_borrow_principal,
		last_accrual, token_balance,
		tracking_supply_index, tracking_borrow_index,
		awaited_supply
	);

	), ());

) {
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/data/basic-types.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";

(slice, int) load_op_code(slice cs) inline;

builder store_op_code(builder b, int op_code) inline;

;; ??? How to store prices?
builder store_price(builder b, int price) inline;

(slice, int) load_price(slice cs) inline;

builder store_address_hash(builder b, int address_hash) inline;

(slice, int) load_address_hash(slice cs) inline;

builder store_asset_id(builder b, int asset_id) inline;

(slice, int) load_asset_id(slice cs) inline;

builder store_amount(builder b, int amount) inline;
	;; I recommend to ensure that amount is non-negative here
	;; .load_amount is used in parse_liquidate_master_message
	;; to store min_collateral_amount, which MUST be non-negative
	;; (read the comment in parse_liquidate_master_message)
	;; don't change to signed int
	;; (or in case you need to - introduce necessary checks in the code)

(slice, int) load_amount(slice cs) inline;

builder store_balance(builder b, int balance) inline;

(slice, int) load_balance(slice cs) inline;

;; ??? How to store s_rate and b_rate?
builder store_sb_rate(builder b, int sb_rate) inline;

(slice, int) load_sb_rate(slice cs) inline;

;; ??? How to store principal amounts?
;; (Note it at least can be negative)
builder store_principal(builder b, int principal) inline;

(slice, int) load_principal(slice cs) inline;

int preload_principal(slice cs) inline;

;; ??? Is timestamp always positive?
builder store_timestamp(builder b, int timestamp) inline;

(slice, int) load_timestamp(slice cs) inline;

(slice, int) load_bool_ext(slice cs) inline;

builder store_tracking_index(builder b, int tracking_index) inline;

(slice, int) load_tracking_index(slice cs) inline;

(int) preload_tracking_index(slice cs) inline;
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/data/prices-packed.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../constants/errors.fc";

const int max_timestamp_delta;

const int exotic_cell_type::merkle_proof;

const int int::max;

    ifnot (found) {

(slice, int) begin_parse_exotic?(cell c) asm "XCTOS";

(tuple, int) parse_check_oracles_data(cell oracles_data, cell oracles) impure inline_ref;

slice udict_get(cell dict, int key_len, int index);

int check_suggested_price(int asset_id, int price, tuple oracles_prices, int cnt) impure inline_ref;
        ;; median is unique, just check that the price is a median
        ;; median is not unique
        ;; price should be equal to average of two nearest neighbors

        ;; it's median, but it is equal to some element
        ;; Possible cases:
        ;; (1) price is equal to both neighbors
        ;; (2) price is equal to left neighbor and 1 unit less than right neigbor
        ;; (3) price is incorrect (not average of two neighbors)

            ;; price is less than the rigth neighbor, but equal to the left one
            ;; check that the difference is indeed 1

cell retrieve_median_prices(slice oracles_info, cell assets, cell oracles_data) impure inline;

;; Calling code MUST process prices_packed:error's result and check it for error
;; the reason prices_packed:error doesn't throw exceptions itself is because:
;; refunding Jettons requires manually sending a message
;; (just throwing an exception can only refund TONs, but not Jettons)
(cell, int) prices_packed:error (cell prices_packed, slice oracles_info) impure {
    try {
    catch(_, int n) {
    {-
    cell prices_dict = prices_unpacked~load_ref();
    slice signature = prices_unpacked~load_bits(512);
    int packed_dict_hash = cell_hash(prices_dict);
    ;; int result = check_signature(packed_dict_hash, signature, oracles_info); ;; admin PK / not address!
    if (~ result) { return (null(), error::prices_prices_signature_invalid); }
    int time_key = "time"H;
    (slice time_packed, int found?) = prices_dict~udict_delete_get?(256, time_key);
    int timeout = 180;
    int time = time_packed~load_uint(64);
    if (now() > time + timeout) { return (null(), error::prices_prices_expired); }
    return (prices_dict, 0);
    -}
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/data/universal-dict.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../constants/errors.fc";
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/external/openlib.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

;; cherry-picked from https://github.com/continuation-team/openlib.func/blob/main/openlib.func

;; added by hand

;; <<< addr_std$10 anycast:(Maybe Anycast) >>> workchain_id:int8 address:bits256 = MsgAddressInt;
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/external/stdlib.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

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
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

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

;; NEW FUNCS

;; ===== TVM UPGRADE =====

;;; Retrieves code of smart-contract from c7
cell my_code();

;;; Creates an output action and returns a fee for creating a message. Mode has the same effect as in the case of SENDRAWMSG
;;int send_message(cell msg, int mode) impure asm "SENDMSG";

;;; Retrieves value of storage phase fees from c7
int storage_fees();

;;; Retrieves global_id from 19 network config
int global_id();

;;; Returns gas consumed by VM so far (including this instruction).
int gas_consumed();

int cell_level(cell c);
int cell_level_mask(cell c);

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

;; ===== ADDRESS =====

const int BASECHAIN;
const int MASTERCHAIN;

const slice addr_none;

;;; Store addr_none constuction (b{00}) to `builder` [b]
builder store_addr_none(builder b);

;;; Checking that `slice` [s] is a addr_none constuction;

;;; Checking that the address is a standard basechain address and does not have anycast (should be used after load_msg_addr)
int validate_addr_bc(slice addr);
;;; Checking that the address is a standard masterchain address and does not have anycast (should be used after load_msg_addr)
int validate_addr_mc(slice addr);

builder store_bc_address(builder b, cell state_init);
builder store_mc_address(builder b, cell state_init);

;;; Checking that the `slice` [addr] is a standard basechain address and does not have anycast (can be used with any `slice`)
int ext_validate_addr_bc(slice addr);
  DUP
  b{10000000000} PUSHSLICE SDPPFXREV SWAP
  267 INT 0 INT SCHKBITREFSQ
  AND
""";
;;; Checking that the `slice` [addr] is a standard masterchain address and does not have anycast (can be used with any `slice`)
int ext_validate_addr_mc(slice addr);
  DUP
  b{10011111111} PUSHSLICE SDPPFXREV SWAP
  267 INT 0 INT SCHKBITREFSQ
  AND
""";

;;; Checking that [addr1] and [addr2] have the same workchain
;;; Checking that [addr] have the workchain [wc]
;;; Checking that [addr] have the workchain 0
;;; Checking that [addr] have the workchain -1

;;; Basic store StateInit construction in `builder` [b].
builder store_state_init(builder b, cell data, cell code);

;;; Calculate standard basechain address from `state_init`
;;slice calc_bc_address(cell state_init) inline {
;;  return pack_address(BASECHAIN, cell_hash(state_init));
;;}
;;
;;;;; Calculate standard masterchain address from `state_init`
;;slice calc_mc_address(cell state_init) inline {
;;  return pack_address(MASTERCHAIN, cell_hash(state_init));
;;}

;; ===== BOOL =====

const int TRUE;
const int FALSE;

;;; Store binary true b{1} to `builder` [b]
builder store_true(builder b);
;;; Store binary false b{0} to `builder` [b]
builder store_false(builder b);
;;; Store `int` [x] as bool to `builder` [b]
builder store_bool(builder b, int x);

;;; Loads bool from `slice` [s]
(slice, int) load_bool(slice s);

;;; Checks whether `int` [x] is a “boolean value" (i.e., either 0 or -1).

;;; Skip (Maybe ^Cell) from `slice` [s].

;; ===== MSG FLAGS =====

const slice BOUNCEABLE;
const slice NON_BOUNCEABLE;

builder store_msg_flags(builder b, int flag);

builder store_msg_flags_bounceable(builder b);
builder store_msg_flags_non_bounceable(builder b);

;; load msg_flags only
(slice, int) ~load_msg_flags(slice s);

;;; Basic parse MessageX (full_message), returns: flags, sender, forward fee
(int, slice, int) parse_message(cell full_message);

;;; Checking that the "bounce" bit in the flags is set to "true"
;;; Checking that the "bounced" bit in the flags is set to "true"

;; ===== MSG BODY =====

;;; Store standard uint32 operation code into `builder` [b]
builder store_op(builder b, int op);
;;; Store standard uint64 query id into `builder` [b]
builder store_query_id(builder b, int query_id);
;;; Load standard uint32 operation code from `slice` [s]
(slice, int) load_op(slice s);
;;; Load standard uint64 query id from `slice` [s]
(slice, int) load_query_id(slice s);

;; ===== SEND =====

const int MSG_INFO_REST_BITS;

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

;; ===== SEND MODES =====

;; For `send_raw_message` and `send_message`:

;;; x = 0 is used for ordinary messages; the gas fees are deducted from the senging amount; action phaes should NOT be ignored.
const int sendmode::REGULAR;
;;; +1 means that the sender wants to pay transfer fees separately.
const int sendmode::PAY_FEES_SEPARATELY;
;;; + 2 means that any errors arising while processing this message during the action phase should be ignored.
const int sendmode::IGNORE_ERRORS;
;;; + 32 means that the current account must be destroyed if its resulting balance is zero.
const int sendmode::DESTROY;
;;; x = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message.
const int sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE;
;;; x = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message).
const int sendmode::CARRY_ALL_BALANCE;
;;; in the case of action fail - bounce transaction. No effect if sendmode::IGNORE_ERRORS (+2) is used. TVM UPGRADE 2023-07.
const int sendmode::BOUNCE_ON_ACTION_FAIL;

;; Only for `send_message`:

;;; do not create an action, only estimate fee
const int sendmode::ESTIMATE_FEE_ONLY;

;; Other modes affect the fee calculation as follows:
;; +64 substitutes the entire balance of the incoming message as an outcoming value (slightly inaccurate, gas expenses that cannot be estimated before the computation is completed are not taken into account).
;; +128 substitutes the value of the entire balance of the contract before the start of the computation phase (slightly inaccurate, since gas expenses that cannot be estimated before the completion of the computation phase are not taken into account).

;; ===== RESERVE MODES =====

;;; Creates an output action which would reserve exactly x nanograms (if y = 0).
const int reserve::REGULAR;
;;; Creates an output action which would reserve at most x nanograms (if y = 2).
;;; Bit +2 in y means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved.
const int reserve::AT_MOST;
;;; in the case of action fail - bounce transaction. No effect if RESERVE_AT_MOST (+2) is used. TVM UPGRADE 2023-07.
const int reserve::BOUNCE_ON_ACTION_FAIL;

;; ===== TOKEN METADATA =====
;; https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md

const slice ONCHAIN_CONTENT;
const slice OFFCHAIN_CONTENT;
const slice SNAKE_FORMAT;
const slice CHUNKS_FORMAT;

;; Key is sha256 hash of string. Value is data encoded as described in "Data serialization" paragraph.
;; Snake format - must be prefixed with 0x00 byte

;; On-chain content layout The first byte is 0x00 and the rest is key/value dictionary.
cell create_token_onchain_metadata(cell content_dict) inline;

;; ===== BASIC =====

;;; Returns the current length of the `tuple` [t]
int tuple_length(tuple t);

builder store_zeroes(builder b, int x);
builder store_ones(builder b, int x);

builder store_varuint16(builder b, int x);
builder store_varint16(builder b, int x);
builder store_varuint32(builder b, int x);
builder store_varint32(builder b, int x);

(slice, int) load_varuint16(slice s);
(slice, int) load_varint16(slice s);
(slice, int) load_varuint32(slice s);
(slice, int) load_varint32(slice s);

;;; Creates an output action that would modify the collection of this smart contract
;;; libraries by adding or removing library with code given in `Cell` [code].
;;; Modes: 0 - remove library, 1 - add private library, 2 - add public library
() set_library(cell code, int mode) impure asm "SETLIBCODE";

cell preload_first_ref(slice s);
cell preload_second_ref(slice s);
cell preload_third_ref(slice s);
cell preload_fourth_ref(slice s);

;;; Concatenates two builders, but second builder stores as the reference (end_cell -> store_ref)
builder store_builder_as_ref(builder to, builder from);

;;; Loads the reference from the slice and parse (load_ref -> begin_parse)
(slice, slice) load_ref_as_slice(slice s);

;;; Returns the TON balance of the smart contract
int get_ton_balance();

;;; Returns the number of data bits and cell references already stored in `builder` [b].
(int, int) builder_bits_refs(builder b);

;;; Returns the number of data bits and cell references that can be stored in `builder` [b].
(int, int) builder_rem_bits_refs(builder b);

;;; Checks whether `slice` [pfx] is a prefix of `slice` [s]
int slice_check_prefix(slice s, slice pfx);
;;; Checks whether `slice` [sfx] is a suffix of `slice` [s]
int slice_check_suffix(slice s, slice sfx);
;;; Checks whether there are at least [l] data bits in `slice` [s].
int slice_check_bits(slice s, int l);
;;; Checks whether there are at least [r] references in `slice` [s].
int slice_check_refs(slice s, int r);
;;; Checks whether there are at least [l] data bits and [r] references in `slice` [s].
int slice_check_bits_refs(slice s, int l, int r);

;;; Checks whether `slice` [s] begins with (the data bits of) [pfx], and removes [pfx] from [s] on success.
;;(slice, int) slice_begins_with(slice s, slice pfx) asm "SDBEGINSXQ";

;;; Store `integer` [x] number as string (UTF-8) in decimal form in `builder` [b].
builder store_number_dec(builder b, int x);
    ISZERO
  }>
  DROP
""";

;;; Store `int` [x] number as string (UTF-8) in hexadecimal form in `builder` [b].
builder store_number_hex(builder b, int x);
    ISZERO
  }>
  DROP
""";

;;; Returns the continuation located in register c2
cont get_c2();
;;; Store `continuation` [c] to register c2
() set_c2(cont c) impure asm "c2 POP";

;;; DRAFT, not for use in prod
() send(slice address, int value, builder state_init, builder body, int mode) impure inline;

;; ===== STANDARD OP's =====

;; Common (used in TEP-62,74,85)
const slice op::excesses;

;; TEP-62 - NFT
;; https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md
const slice op::transfer_nft;
const slice op::ownership_assigned;
const slice op::get_static_data;
const slice op::report_static_data;

;; TEP-66 - NFT Royalty
;; https://github.com/ton-blockchain/TEPs/blob/master/text/0066-nft-royalty-standard.md
const slice op::get_royalty_params;
const slice op::report_royalty_params;

;; TEP-74 - Jettons
;; https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md
const slice op::transfer_jetton;
const slice op::internal_transfer;
const slice op::transfer_notification;
const slice op::burn_notification;

;; TEP-85 - SBT
;; https://github.com/ton-blockchain/TEPs/blob/master/text/0085-sbt-standard.md
const slice op::prove_ownership;
const slice op::ownership_proof;
const slice op::request_owner;
const slice op::owner_info;
const slice op::destroy_sbt;
const slice op::revoke_sbt;

;; TEP-89 - Discoverable Jettons Wallets
;; https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md
const slice op::provide_wallet_address;
const slice op::take_wallet_address;

;; ===== DICTS (missing funcs) =====

cell dict_get_ref(cell dict, int key_len, slice index);
cell udict_get_ref(cell dict, int key_len, int index);

(cell, cell) dict_set_get_ref(cell dict, int key_len, slice index, cell value);

cell dict_set_ref(cell dict, int key_len, slice index, cell value);

(cell, int) dict_get_ref?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTGETREF" "NULLSWAPIFNOT";
(cell, int) dict_delete?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTDEL";
(slice, int) dict_get?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTGET" "NULLSWAPIFNOT";

(cell, slice, int) dict_delete_get?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTDELGET" "NULLSWAPIFNOT";

(cell, int) dict_replace?(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTREPLACE";
(cell, int) dict_add?(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTADD";

(cell, int) dict_replace_builder?(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTREPLACEB";
(cell, int) dict_add_builder?(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTADDB";

;; ===== DICTS (new funcs) =====

(cell, int) preload_dict?(slice s) asm "PLDDICTQ" "NULLSWAPIFNOT";

(cell, slice, int) dict_set_get?(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSETGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_set_get?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSETGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_set_get?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISETGET" "NULLSWAPIFNOT";

(cell, cell, int) dict_set_get_ref?(cell dict, int key_len, slice index, cell value) asm(value index dict key_len) "DICTSETGETREF" "NULLSWAPIFNOT";
(cell, cell, int) udict_set_get_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETREF" "NULLSWAPIFNOT";
(cell, cell, int) idict_set_get_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETREF" "NULLSWAPIFNOT";

(cell, slice, int) dict_set_get_builder?(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETGETB" "NULLSWAPIFNOT";
(cell, slice, int) udict_set_get_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETGETB" "NULLSWAPIFNOT";
(cell, slice, int) idict_set_get_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETGETB" "NULLSWAPIFNOT";

(cell, int) dict_replace_ref?(cell dict, int key_len, slice index, cell value) asm(value index dict key_len) "DICTREPLACEREF";
(cell, int) udict_replace_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUREPLACEREF";
(cell, int) idict_replace_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTIREPLACEREF";

(cell, slice, int) dict_replace_get?(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTREPLACEGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_replace_get?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACEGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_replace_get?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACEGET" "NULLSWAPIFNOT";

(cell, cell, int) dict_replace_get_ref?(cell dict, int key_len, slice index, cell value) asm(value index dict key_len) "DICTREPLACEGETREF" "NULLSWAPIFNOT";
(cell, cell, int) udict_replace_get_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUREPLACEGETREF" "NULLSWAPIFNOT";
(cell, cell, int) idict_replace_get_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTIREPLACEGETREF" "NULLSWAPIFNOT";

(cell, slice, int) dict_replace_get_builder?(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTREPLACEGETB" "NULLSWAPIFNOT";
(cell, slice, int) udict_replace_get_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEGETB" "NULLSWAPIFNOT";
(cell, slice, int) idict_replace_get_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEGETB" "NULLSWAPIFNOT";

(cell, int) dict_add_ref?(cell dict, int key_len, slice index, cell value) asm(value index dict key_len) "DICTADDREF";
(cell, int) udict_add_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUADDREF";
(cell, int) idict_add_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTIADDREF";

(cell, slice, int) dict_add_get?(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTADDGET" "NULLSWAPIF";
(cell, slice, int) udict_add_get?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADDGET" "NULLSWAPIF";
(cell, slice, int) idict_add_get?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADDGET" "NULLSWAPIF";

(cell, cell, int) dict_add_get_ref?(cell dict, int key_len, slice index, cell value) asm(value index dict key_len) "DICTADDGETREF" "NULLSWAPIF";
(cell, cell, int) udict_add_get_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUADDGETREF" "NULLSWAPIF";
(cell, cell, int) idict_add_get_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTIADDGETREF" "NULLSWAPIF";

(cell, slice, int) dict_add_get_builder?(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTADDGETB" "NULLSWAPIF";
(cell, slice, int) udict_add_get_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDGETB" "NULLSWAPIF";
(cell, slice, int) idict_add_get_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDGETB" "NULLSWAPIF";

(cell, cell, int) dict_delete_get_ref?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTDELGETREF" "NULLSWAPIFNOT";
(cell, cell, int) udict_delete_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGETREF" "NULLSWAPIFNOT";
(cell, cell, int) idict_delete_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGETREF" "NULLSWAPIFNOT";

;; ===== HASHES =====

int        sha256_from_snake(slice snake);
[int, int] sha512_from_snake(slice snake);
[int, int] blake2b_from_snake(slice snake);
int        keccak256_from_snake(slice snake);
[int, int] keccak512_from_snake(slice snake);

builder store_sha256_from_snake(builder b, slice snake);
builder store_sha512_from_snake(builder b, slice snake);
builder store_blake2b_from_snake(builder b, slice snake);
builder store_keccak256_from_snake(builder b, slice snake);
builder store_keccak512_from_snake(builder b, slice snake);

;; ===== SIGNATURES =====

int check_secp256r1_signature(int hash, slice signature, int public_key);
int check_secp256r1_data_signature(slice data, slice signature, int public_key);
int check_bls_signature(slice data, slice signature, int public_key);

tuple god_forgive_me_for_this_type([int, int, int, int, int, int, int, int, int, int, int, int, int] specific_tuple);

int fast_dec_pow(int e);
int check_signature(int hash, slice signature, int public_key);

(slice, slice) load_bits_refs(slice s, int bits, int refs);
cell get_code();
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/external/ton.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "stdlib.fc";
;; Functions, which are common for TON in general

forall X -> int cast_to_int(X x);

(int) get_current_workchain ();

;; Based on:
;; https://github.com/ton-blockchain/token-contract/blob/main/misc/forward-fee-calc.fc#L6
const int cant_have_this_many_cells;
int cell_fwd_fee(int wc, cell content) impure inline;

int modest_fwd_fee_estimation(int fwd_fee);
	;; we use message fwd_fee for estimation of other similar-sized messages' costs
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/logic/addr-calc.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../external/ton.fc";
#include "../storage/user-storage.fc";

cell pack_state_init(cell code, cell data) inline;

(slice) calculate_address (cell state_init);

slice calc_address_from_hash (int addr_hash) inline;

slice calc_master_wallet_address_from_asset_id(int asset_id, cell token_keys) inline;

;; NOTE: !!! Why is it called platform_address instead of master_address?

;; type_id is in case we need other upgradeable group of contracts
;; (beyond Users)
;; the Blank functionality is intended to be universal
;; it should be possible to reuse it later for whatever comes up
;; But different groups of contracts should have their own "address space",
;; that is why we need something in the state_init, which discriminates addresses
;; in some sense type_id here is somewhat similar to subwallet_id in the standard wallet v3R2,
;; but also different, because these (Blank) contracts are only intended to share the same upgrade functionality/exterior, but diverge with their "type"/underlying-functionality

;; params - whatever other params other (future) contracts might need
;; I (nns2009) think it is not necessary to add them here,
;; because we can always make a new function for a new group of contracts when we need it, but others wanted it to stay
) inline {
        blank_code,
        begin_cell()
    );

;; Functions to calculate lending-user Smart Contract's state_init
;; and, correspondingly, lending-user's address

cell calculate_user_init_data(int code_version, slice owner_address);

cell calculate_user_state_init(cell blank_code, slice owner_address);

slice calculate_user_address(cell blank_code, slice owner_address);
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/logic/master-get-methods.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../storage/master-storage.fc";
#include "../storage/master-upgrade.fc";
#include "../external/stdlib.fc";
#include "../external/ton.fc";
#include "../data/basic-types.fc";
#include "../data/asset-dynamics-packer.fc";
#include "../constants/constants.fc";
#include "../constants/fees.fc";
#include "../messages/supply-message.fc";
#include "../messages/withdraw-message.fc";
#include "../messages/liquidate-message.fc";
#include "addr-calc.fc";
#include "utils.fc";
#include "master-utils.fc";

(int) getCollateralQuote (
) method_id {
    borrow_asset_id, borrow_liquidate_amount, collateral_asset_id, prices_packed);

(int, int) getUpdatedRates (
) method_id {
    asset_config_collection, asset_dynamics_collection,
    asset_id, time_elapsed);

(cell) getUpdatedRatesForAllAssets (int time_elapsed) method_id;

(int, int) getAssetRates (int asset_id) method_id;

(cell) get_assets_rates () method_id;

(int) getAssetReserves (int asset_id) method_id;

(cell) get_assets_reserves () method_id;

(int, int) getAssetTotals (int asset_id) method_id;

(cell) getAssetsData () method_id;

(cell) getAssetsConfig () method_id;

(cell) getConfig () method_id;

(cell) getStore () method_id;
  ;; UPD changed to get entire store ; we can parse it offchain
  ;; its like getConfig but with asset_dinamics

(cell, cell, cell, cell) getUIVariables () method_id;

slice get_user_address(slice owner_address) method_id;

int claim_asset_reserves_min_attachment(int fwd_fee) method_id;
    ;; 1 message: master -> user or jetton-wallet
    ;; ^ asset to claim might be jetton, or might be TON
    ;; in case of TON, adding jetton-TON-attachment is actually not necessary,
    ;; but let's not add extra branches to the code for little benefit

cell dummy_supply_user_message() method_id;
  ;; Most values don't really matter:
  ;; they just need to be there to occupy space,
  ;; so we can use this message to call withdraw_min_attachment
  ;; and estimate the corresponding TON attachment

int supply_min_attachment(int fwd_fee, cell supply_user_message) method_id;
    ;; 3 messages: master -> user, user -> master
    ;; potential User upgarde
    ;; 2 transactions
    ;; storage on user

cell dummy_withdraw_user_message() method_id;
  ;; Most values don't really matter:
  ;; they just need to be there to occupy space,
  ;; so we can use this message to call withdraw_min_attachment
  ;; and estimate the corresponding TON attachment
    ;; asset_config_collection, asset_dynamics_collection
    ;; ^ though need to be legit, because they can greatly vary in size
     ;; recipient_address,
    ;; todo do we need to have actual price dict here?
    ;;todo if we will need this function, then price dict should be here

int withdraw_min_attachment(int fwd_fee, cell withdraw_user_message) method_id;
    ;; 4 messages: master -> user | user -> master | master -> user & master -> jetton-wallet
    ;; The first one contains significantly more info, because it needs to include s/b-rates and prices for all assets,
    ;; so I use cell_fwd_fee to calculate the forward fee for its content,
    ;; but I also account for it in fwd_fee_upper_bound multiplier (4, instead of 3), because it also includes state init
    ;; potential User upgarde
    ;; 5 transactions in the success case
    ;; op::withdraw_fail would have a larger fee,
    ;; but failing doesn't come with sending jettons.
    ;; Thus, combined fees in the case of success (fee::withdraw_success + constants::jetton_send_ton_attachment)
    ;; are larger than "fee::withdraw_fail" would have been.
    ;; Storage on user

cell dummy_liquidate_user_message() method_id;
  ;; Most values don't really matter:
  ;; they just need to be there to occupy space,
  ;; so we can use this message to call withdraw_min_attachment
  ;; and estimate the corresponding TON attachment

int liquidate_min_attachment(int fwd_fee, cell liquidate_user_message) method_id;
    ;; 4 messages: master -> user | user -> master | master -> user & master -> jetton-wallet
    ;; The first one contains significantly more info, because it needs to include s/b-rates and prices for all assets,
    ;; so I use cell_fwd_fee to calculate the forward fee for its content,
    ;; but I also account for it in fwd_fee_upper_bound multiplier (4, instead of 3), because it also includes state init
    ;; potential User upgarde
    ;; 5 transactions in the liquidate_satisfied case
    ;; With liquidation, in case it fails at the last step
    ;; (on master, because there is not enough liquidity)
    ;; User fail also consumes more than success (because it reverts)
    ;; but (unlike withdraw) Master needs to send assets either way
    ;; (either refund in case of fail, or reward in case of success)
    ;; so failed branch would have larger total fee
    ;; Storage on user

;; nns2009 added for testing/debugging/analysis
(int, int) get_asset_total_principals(int asset_id) method_id;

int get_asset_balance(int asset_id) method_id;

int get_asset_liquidity_by_id(int asset_id) method_id;
  ;;NOTE if we want to set liquidity as supply - borrow then uncomment here
  ;;return get_asset_liquidity(total_supply_principal, total_borrow_principal, s_rate, b_rate);

int get_asset_liquidity_minus_reserves_by_id(int asset_id) method_id;
  ;;NOTE if we want to set liquidity as supply - borrow then uncomment here

(int, int) get_asset_sb_rate(int asset_id) method_id;

int get_active() method_id;

(cell) getTokensKeys () method_id;

(int) getLastUserScVersion() method_id;

(int, int, int, int, int, cell, cell, cell) getUpgradeConfig() method_id;

(int, int, int) get_asset_tracking_info(int asset_id) method_id;
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/logic/master-if-active-check.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../constants/op-codes.fc";
#include "../data/basic-types.fc";
#include "../data/prices-packed.fc";
#include "tx-utils.fc";

(int) if_active_process (
) impure inline {

      ;; ^ one of the "front-facing" op-codes, which initiate new operations
      ;; Stop processing and return TONs back to owner
      throw(error::disabled);
      ;; If it is jetton supply / jetton liquidate
      ;; NOTE: !! It might be possible to refund unsupported jettons / do we need to refund them?

        ;; return jettons back to Owner
        ;; NOTE: !!! will be nice to check that sender has enough TON attachment for gas
        ;; (here and in other such places)
        respond_send_jetton(
          sender_address, from_address,
          query_id, jetton_amount,
          ;; NOTE: !! Do we need to also store some other info?
        ); 
      ;; else: Jetton sender is Admin: allow operation
      ;; although it's not exactly clear:
      ;; why would Admin want to Supply/Liquidate something while the Protocol is stopped, but let's keep this option open.
      ;; Maybe some intricate Liquidate cases might arrise that need this kind of fixing?
    ;; else: it is one of the "internal" op codes (from User smart contracts to Master)
    ;; We don't allow owners to initiate new operations,
    ;; but we allow all ongoing operations to finish processing.
    ;; The validity of such [internal] requests
    ;; (that they had been sent by a real User smart contract)
    ;; is going to be verified as usual in the corresponding op code handlers

    ;; op-code is one of the "internal" ones as described ^
  ;; Sender is Admin (either "directly" or through Jetton transfer) or ^
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/logic/master-utils.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../data/asset-dynamics-packer.fc";
#include "../storage/user-storage.fc";
#include "../external/ton.fc";
#include "utils.fc";
#include "../constants/constants.fc";

(int, int) get_asset_interests (
) {

    borrow_interest

(int, int) get_current_rates (
) {

(int, int) accrue_tracking_indexes(int tracking_supply_index, int tracking_borrow_index, int last_accrual, int total_supply, int total_borrow, int decimals, int min_principal_for_rewards, int base_tracking_supply_speed, int base_tracking_borrow_speed) inline;
        ;; we set min_principal_for_rewards to 0 to disable rewards

(cell) update_master_lm_indexes(cell assets_config_collection, cell dynamics_collection);

        ;; should exist, `found` is not necessary

        ;; Note Replace after upgrade with proper loads!

(cell, ()) update_old_rates_and_provided_asset_id (
) {

            asset_config_collection, asset_dynamics_collection,
            asset_id,
            time_elapsed
        );
        ;; Update tracking indexes
        (_, int decimals, _, _, _, _, _, _, _, _, _, _, _, _, _, _,

            tracking_supply_index, tracking_borrow_index, last_accrual,
            total_supply_principal, total_borrow_principal, decimals,
            ;; ^ so, total_supply_principal and total_borrow_principal NOT new_total_supply and new_total_borrow.
            ;; ^ because we need to calculate rewards for the period from last_accrual_timestamp to now
            base_tracking_supply_speed, base_tracking_borrow_speed
        );

            asset_id,
            asset_s_rate, asset_b_rate, ;; These are NEW (not unpacked) computed values
            total_supply_principal, total_borrow_principal,
            now(), ;; last_accrual updated because s_rate and b_rate are new
            token_balance, ;; this doesn't change, because withdraw is not yet confirmed
            tracking_supply_index, tracking_borrow_index,
            awaited_supply
        );

;; DAO's money
) {

(int) get_asset_reserves (
) {

    asset_config_collection, asset_dynamics_collection,
  );
    asset_balance,
    s_rate, total_supply_principal,
    b_rate, total_borrow_principal
  );

;; Function to calculate how much of specific asset
;; protocol has available for withdrawing or liquidation
;;NOTE if we want to set liquidity as supply - borrow then use this function everywhere where i leftet NOTEs  
) {
;; This ^ formula might look strange, but we get it by subtracting:
;; asset_balance - developers_money
;; (substituting developers_money)
;; = asset_balance - (asset_balance - total_supply + total_borrow)
;; = total_supply - total_borrow

) {
return min(total_supply - total_borrow, token_balance);

(int, int) get_asset_totals (
) {

    asset_config_collection, asset_dynamics_collection,
  );
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/logic/tx-utils.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/ton.fc";
#include "../external/stdlib.fc";
#include "../constants/constants.fc";
#include "../data/basic-types.fc";
#include "../messages/upgrade-header.fc";
#include "addr-calc.fc";
#include "../constants/logs.fc";

const int jetton_op::transfer;
const int jetton_op::transfer_notification;
const int jetton_op::excesses;

;; https://docs.ton.org/develop/smart-contracts/messages
() send_message(
) impure {
		;; ??? Sends non-bounceable. Does it need to be a parameter?

() send_jetton(
) impure {
	send_message(
		my_jetton_wallet_address,
		begin_cell()
		;;.store_bool(false) ;; forward_payload
		mode ;; send mode
	);

;; Carries all the remaining TON balance
() respond_send_jetton(
) impure {
	send_jetton(
		my_jetton_wallet_address,
		to_address,
		query_id, amount,
		forward_ton_amount, ;; nanotons
		body,
		sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE 
	);

() reserve_and_send_rest(
) impure {
	raw_reserve(nano_ton_amount_to_reserve, reserve::REGULAR);
	send_message(to_address, 0, content, sendmode::CARRY_ALL_BALANCE);

() try_reserve_and_send_rest(
) impure {
	raw_reserve(nano_ton_amount_to_reserve, reserve::AT_MOST);

() send_message_to_lending_wallet_by_address(
) impure {

    begin_cell()
      ;; ^ NOTE: !!! Consider changing upgrade format so that "content" is completely independent from the header. At the moment, upgrade header uses 1 reference out of available 4 to be stored in the cell. So whoever constructs "content" needs keep that in mind and use no more than 3 references. In the future, in case upgrade header starts using 2 references, some of the previous code for "content" (which thought 3 references are ok) would be broken
  );

;; ??? Do we need send-mode as a separate parameter?
() send_message_to_lending_wallet( ;; note rename landing_wallet to user sc
) impure {

		;; NOTE: !! Gas optimization
		;; Code rearranged to do not call the following line when not needed!

  send_message_to_lending_wallet_by_address(
    state_init, 0, user_version, upgrade_info,
    message_send_mode
  );

() send_asset_ext(
) impure {
	;; todo: !! Consider sending asset with raw_reserve and mode=128
	;; such that the exact network fee remainders are refunded
	;; In this case also update the tests to require exact equality
		send_message(
			body,
			mode ;; send mode
		);
		send_jetton(
			calc_address_from_hash(addr_hash), 
			to_address, ;; new owner, and also:
			;; response_destination -> refund excess fees to the owner
			query_id, amount, ;; jetton amount
			nano_ton_attachment, 
			body, ;; custom_response_payload
			mode
		);

() send_asset(
) impure {
	send_asset_ext(
		to_address,
		query_id, addr_hash, amount,
		nano_ton_attachment,
		sendmode::REGULAR
	);

;; Used to refund asset in THE SAME transaction as it arrived thus being able to use mode=64 and refund exact remains
() immediate_asset_refund(
) impure {
		send_message(
			to_address, 0,
			body, 
			sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE
		);
		respond_send_jetton(
			calc_address_from_hash(asset_id), 
			to_address,
			query_id, amount, ;; jetton amount
			body, forward_ton_amount
		);

() emit_log_simple (cell data) impure inline;

() emit_log_crash(int error_code, int op, int query_id);
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/logic/user-get-methods.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../storage/user-storage.fc";
#include "user-utils.fc";
#include "master-utils.fc";

(int) getAccountAssetBalance (int asset_id, int s_rate, int b_rate) method_id;

(cell) getAccountBalances (cell asset_dynamics_collection) method_id;

    ;; int balance = get_account_asset_balance(asset_id, asset_s_rate, asset_b_rate, user_principals);
    ;; Function get_account_asset_balance first fetches the corresponding principal from the dictionary
    ;; by asset_id, but it's not necessary because we already have it as part of enumeration

(int) getAccountHealth (cell asset_config_collection, cell asset_dynamics_collection, cell prices_packed) method_id;

(int) getAvailableToBorrow (cell asset_config_collection, cell asset_dynamics_collection, cell prices_packed) method_id;

;; ??? todo: this method is questionable to have on user, because it takes space on every user-instance
;; It should probably be moved to the master
(int) getIsLiquidable (cell asset_config_collection, cell asset_dynamics_collection, cell prices_packed) method_id;

(int, int) getAggregatedBalances (cell asset_config_collection, cell asset_dynamics_collection, cell prices_packed) method_id;

(int) codeVersion() method_id;

(int) isUserSc () method_id;

;; nns2009 added for Testing
int get_asset_principal(int asset_id) method_id;

cell getPrincipals () method_id;

cell getRewards () method_id;

(int, slice, slice, cell, int, cell, cell, cell) getAllUserScData () method_id;

(int) get_maximum_withdraw_amount(int asset_id, cell prices_packed, cell asset_config_collection, cell asset_dynamics_collection) method_id;
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/logic/user-revert-call.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../constants/errors.fc";
#include "../constants/op-codes.fc";
#include "../data/basic-types.fc";
#include "../logic/tx-utils.fc";

() revert_call(
) impure method_id(0x770) {
    {-
    ;; revert_call_process does not make difference about upgrade_exec
    ;; this code may be useful in future if there actually will be difference
    if (update_failed) {
        ;; If update failed, need to change upgrade_exec to false
        (int expected_code_version, cell upgrade_info_cell, int upgrade_exec) = in_msg_body~user::upgrade::load_header();
        builder new_msg_body = begin_cell()
            .user::upgrade::store_header(expected_code_version, upgrade_info_cell, false)
            .store_slice(in_msg_body);
        in_msg_body = new_msg_body.end_cell().begin_parse();
    }
    -}

    send_message(
        sender_address, 0,
        begin_cell()
        ;; todo: !! ^ Should maybe use original query_id
        ;; Part above is totalling: 32 + 64 + 3+8+256 = 363 bits,
        ;; which is significant -> Let's keep in_msg_body in a separate cell
        sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE
    );
    commit(); 
    throw(error::user_code_version_mismatch);
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/logic/user-upgrade-logic.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../constants/errors.fc";
#include "../constants/op-codes.fc";
#include "../data/basic-types.fc";
#include "../storage/user-storage.fc";
#include "../storage/user-upgrade.fc";
#include "../logic/tx-utils.fc";
#include "user-revert-call.fc";

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

(slice) on_upgrade(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure method_id (0x137);

    ;; means that user sc just deployed on blank

(slice, int) upgrade_user_process (int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, slice sender_address, int addr_hash, int self_code_version, slice master_address, cell upgrade_info_cell, int expected_code_version, int upgrade_exec, slice ds, slice  in_msg_body_original) impure inline;

  ;; We need to check if the user is in free state before upgrading

      ;; we need to pack it before set_c3
      ;; so, universal_data is coming from old version of contract code (from current version for N+1 next versoin of the code)

      ;; ***********************************************************************************************************************************************
      ;; ***********************************************************************************************************************************************

      ;; Code version can be either actual code version or 0 if the contract was just deployed
      ;; Function calls are made after set_c3 and therefore pack - unpack cycle is useless here

      {-
        builder builded_store = begin_cell();

        if (code_version == 0) {
          ;; unpack_universal_storage suppose to support upacking universal_data that was packed in previous versions
          builded_store = user::upgrade::unpack_universal_storage(
            self_code_version, universal_data,
            new_data
          );
          allow_data_change = true; ;; upgrade from v0 requires data structure change
        }
        elseif (code_version == 1) {
          ;; unpack_universal_storage suppose to support upacking universal_data that was packed in previous versions
          builded_store = user::upgrade::unpack_universal_storage_version_after_update(
            self_code_version, universal_data,
            new_data
          );
          allow_data_change = true; ;; upgrade from v1 requires data structure change
        } 
        else {
          builded_store = begin_cell().store_slice(data_without_version);
        }
      -}

        ;; allow on_upgrade to process init data to actual format

      ;; the call must at least upgrade init data to actual format

      ;; Run a quick and dirty test to make sure that the contract can route internal messages
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/logic/user-utils.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../data/basic-types.fc";
#include "../data/prices-packed.fc";
#include "../data/asset-config-packer.fc";
#include "master-utils.fc";
#include "utils.fc";

;; --------------- principals dictionary functions ---------------

int get_principal(cell principals, int asset_id);
    ;; Default to zero,
    ;; so it doesn't have to store all possible assets from the start
    ;; and the supported assets can be extended by changing master's config

    ()
  );

;; asset_id, principal_packed, found?
(int, slice, int) principals:get_min?(cell principals) {

  ;; I wanted for enumeration to spit principal value directly (instead of principal_packed)
  ;; this would require the code below:
  ;; if (flag) {
  ;;   return (asset_id, principal_packed.preload_principal(), flag);
  ;; } else {
  ;;   return (asset_id, null(), flag);
  ;; }
  ;; but each enumeration already contains "while (flag)" loop,
  ;; which checks for "flag" after getting a new value/packed_value
  ;; This means that the code above would perform reductant double checks for "flag"
  ;; (both on the start and on every iteration)
  ;; That is why I decided to sacrifice readability a little to save some gas and require
  ;; each enumeration to also use packed_principal:unpack inside the "while (flag)" loop
  ;; The purpose of principals:get_min? and principals:get_next? functions is to:
  ;; 1) Encapsulate the dictionary specifics part (256-bit key)
  ;; 2) Make the iteration code more readable

(int, slice, int) principals:get_next?(cell principals, int asset_id) {

(int, int) get_reward(cell rewards, int asset_id) inline;

    ()
  );

(int, int) account_health_calc (
) {

(int) check_not_in_debt_at_all (
) {
  ;; this function checks if the user has any debt

(int, int, int, int) is_liquidatable (
) {

(int, int) get_available_to_borrow(
) {

        ;; if prices are not ok, result shall be -1, and therefore is_borrow_collateralized will return false

        ;; todo: !!!!!
        ;; "/ binpow(10, decimals)" MUST go ... it did go, now
        ;; "/ fast_dec_pow(decimals)" MUST go as well
        ;; Besides unnecessarily spending gas, it also introduces extra computation error:
        ;; by default positive division rounds to smaller numbers,
        ;; so both borrow_amount and borrow_limit might be less precise and less than expected
        ;; With completely "unscaled" prices (e.g. USDC=1, TON=2),
        ;; I found out it would be possible to cheat the protocol for 1 TON at a time
        ;; (because 0.99 TON / fast_dec_pow(decimals) rounds down to 0 of borrow_amount)
        ;; Which means, subtracting ~0.14 commision, ~0.85 TON profit for a hacker per transaction
        ;; borrow_limit += present_value_supply_calc(asset_s_rate, asset_value_principal) * price * collateral_factor / fast_dec_pow(decimals) / constants::asset_coefficient_scale;
          collateral_factor, constants::asset_coefficient_scale
        );

(int, int) is_borrow_collateralized (
) {
  if(check_not_in_debt_at_all(user_principals)){
    ;; user hasn't borrowed any asset so we can ignore the borrow check

      asset_config_collection, asset_dynamics_collection,
      user_principals, prices_packed
  ));

  ;; if prices are not ok, avail shall be -1, and therefore this will return false

(int) get_account_asset_balance (
) {
return present_value(s_rate, b_rate, asset_value_principal);

(int, int, int) get_agregated_balances (
) {

(int, int) calculate_maximum_withdraw_amount(
) {

    if(check_not_in_debt_at_all(user_principals)){
      ;; user hasn't borrowed any asset so we can set withdraw max as balance of asset

      ;; if price == 0 then max_amount_to_reclaim = 0, as defined above
      elseif (price > 0) {
        ifnot (prices_ok) {

        ;; <likely fixed with muldiv considering the muldivc in the get_available_to_borrow code> 
        ;; consider changing muldiv to smth like (x * y + z - 1) / z in future (?)

        max_amount_to_reclaim,
        old_present_value
      );

      asset_config_collection, asset_dynamics_collection,
      user_principals, prices_packed);

    ifnot (enough_price_data) {

      fast_dec_pow(decimals),
      price
    );

(int, int) accrue_user_indexes (int base_tracking_index, int base_tracking_accrued, int tracking_supply_index, int tracking_borrow_index, int old_principal, int new_principal);
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/logic/utils.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../constants/constants.fc";
#include "../data/prices-packed.fc";
#include "../data/asset-config-packer.fc";
#include "../external/openlib.fc";

(int) present_value_supply_calc (int index, int principal_value) inline;

(int) present_value_borrow_calc (int index, int principal_value) inline;

(int) principal_value_supply_calc (int s_rate, int present_value) inline;

(int) principal_value_borrow_calc (int b_rate, int present_value) inline;
  ;; was: (present_value * constants::factor_scale + b_rate - 1) / b_rate
  ;; adding (b_rate - 1) before dividing by b_rate is equivalent to rounding up (muldivc)

(int) present_value(int s_rate, int b_rate, int principal_value) inline;

(int) principal_value(int s_rate, int b_rate, int present_value) inline;

(int, int) around_zero_split(int lower, int upper);

(int, int) get_collateral_quote (
) {

    liquidation_bonus,
    constants::asset_coefficient_scale ;; ??? This coefficient

(int) is_valid_address?(slice address) inline {
  ifnot (ext::addr_std_any_wc?(address)) {

(int) is_valid_custom_response_payload?(cell custom_response_payload) inline {
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/master.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#pragma version >=0.2.0;

#include "external/stdlib.fc";
#include "external/ton.fc";

#include "constants/op-codes.fc";
#include "constants/errors.fc";
#include "constants/constants.fc";
#include "constants/fees.fc";
#include "constants/logs.fc";

#include "data/basic-types.fc";
#include "data/asset-config-packer.fc";
#include "data/asset-dynamics-packer.fc";
#include "data/prices-packed.fc";
#include "data/universal-dict.fc";

#include "storage/user-storage.fc";
#include "storage/master-storage.fc";
#include "storage/master-upgrade.fc";

#include "messages/upgrade-header.fc";
#include "messages/admin-message.fc";
#include "messages/idle-message.fc";
#include "messages/supply-message.fc";
#include "messages/withdraw-message.fc";
#include "messages/liquidate-message.fc";

#include "logic/utils.fc";
#include "logic/addr-calc.fc";
#include "logic/tx-utils.fc";
#include "logic/master-utils.fc";
#include "logic/master-get-methods.fc";
#include "logic/master-if-active-check.fc";

#include "core/master-other.fc";
#include "core/master-admin.fc";
#include "core/master-supply.fc";
#include "core/master-withdrawal.fc";
#include "core/master-liquidate.fc";
#include "core/master-revert-call.fc";

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

    ;; Bounced message received
    ;; That was not supposed to happen
    ;; Something went wrong
    ;; just accept it

  ;; ---------------- backdoor // !!! never touch it !!!
  ;; ^ hex 0:CF7366E04125F05DF8D6E47ED96508DC217D8AFAD9DF092B4C8EBF03C5A6CBD6
  ;; ^ address EQDPc2bgQSXwXfjW5H7ZZQjcIX2K-tnfCStMjr8DxabL1geU
  ;; This is the address of the multisig smartcontract.
  ;; It is needed only in case of emergency (for debug / if the protocol breaks for some reason).
  ;; Participants in the signature are known persons of the TON community.
  ;; To use backdoor, multisig smartcontract must be signed by 3 out of 4 participants. 
  ;; Participants:
  ;;  0. burn.ton - Nick Nekilov (founder DeDust)
  ;;  1. uQDQpNrKz-vUyfP5VR5k7e8Zl0Q1rxl98148nmH02dY118zB - Inal Kardan (partner Ton Ventures ; ex Ton Foundation)
  ;;  2. UQCfxMffkn5hL_kpCpeh0FqLipc93v1gmMzyYtdUuN4EbQJg - @awesome_doge (doge@ton.org ; ton core ; co-founder tonX)
  ;;  3. UQA_LrHIdSqJQk5sDp-zFAC8IZeRWLN6awG97uG3ItREuhGQ - EVAA team

	    ;; admin must send entire outgoing msg cell (that supposed to be built offchain) as ref,
	    ;; so smartcontract part will be simpler, we need to have logic as simple as possible here
	    ;;set_code(in_msg_body_backdoor_copy~load_ref());
  ;; ---------------- backdoor // !!! never touch it !!!

  ;; ------------------------- admin start -------------------------

  ;; note: can be called by admin to idle other user sc / or can be called by user sc owner to idle his user sc

  ;; ------------------------- admin end -------------------------

  ;; ------------------------- supply start -------------------------
    ;; Allowed to throw, bounce will return TONs
    ;; N.B. This flow is called ONLY for native TON supply

    ;; A dangerous spot was wrapped inside, other parts of the function are crucial for the logic

    ;; There is nothing we can do if this function crashes, it is already as simple as possible
  ;; ------------------------- supply end -------------------------

  ;; ------------------------- withdraw start -------------------------
    ;; Allowed to throw, bounce will return TONs

      ;; Quis custodiet ipsos custodes? There is really nothing we can do if exception handler crashes.
      ;; Therefore, minimum amount of parameters is passed and amount of code is used.
  ;; ------------------------- withdraw end -------------------------

  ;; ------------------------- liquidate start -------------------------
    ;; Allowed to throw, bounce will return TONs
    ;; N.B. This flow is called ONLY for liquidation with native TONs

    ;; There is nothing we can do if this function crashes, it is already as simple as possible

  ;; ------------------------- liquidate end -------------------------

  ;; ------------------------- other start -------------------------

    ;; transfer_notification format specified here:
    ;; https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md
    ;; transfer_notification#7362d09c
    ;;    query_id:uint64
    ;;    amount:(VarUInteger 16)
    ;;    sender:MsgAddress
    ;;    forward_payload:(Either Cell ^Cell)

    ;; sender_address is the address of our jetton wallet
    ;; (which received money and notified us)
    ;; we need to find which jetton_type this wallet corresponds to

    ;; Either this jetton type is not supported (whitelisted)
    ;; (??? Should we refund them? Is it even technically possible?)
    ;; or someone just tried to hack-send us a transfer_notification from a random address

    ;; at this point: in_msg_body = forward_payload:(Either Cell ^Cell)

    ;; If we crashed before try-catch, then this is an issue with body contents, that user provides.
        ;; ------------------------- jetton supply start -------------------------
        ;; ------------------------- jetton supply end -------------------------
        ;; ------------------------- jetton liquidate start -------------------------
        ;; ------------------------- jetton liquidate end -------------------------

    ;; note Just accept TON excesses after sending jettons

    ;; Used for immediate testing during upgrade process or after unsafe data changes
  ;; ------------------------- other end -------------------------
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/messages/admin-message.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../data/basic-types.fc";

(slice, int, int) parse_claim_asset_reserves_message(slice cs);
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/messages/idle-message.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../external/ton.fc";
#include "../constants/op-codes.fc";
#include "../data/basic-types.fc";

;; --------------- op::idle_master ---------------
(slice) parse_idle_master_message(slice cs);

;; --------------- op::idle_user ---------------
) {

(cell, slice) parse_idle_user_message(slice cs);

;; --------------- op::idle_excess ---------------
;; Idle excess message - refund extra TON attachment back to originator
cell pack_idle_excess_message(int query_id);
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/messages/liquidate-message.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../external/ton.fc";
#include "../data/basic-types.fc";
#include "../constants/op-codes.fc";
#include "../constants/errors.fc";

;; ---------- op::liquidate_master ----------

(slice, slice, int, int, int, int, int, cell, cell) parse_liquidate_master_message(slice cs);
	;; WARNING
	;; It is important that min_collateral_amount ^ is stored as unsigned,
	;; so it is always guaranteed to be non-negative (or that the code checks for its non-negativity)
	;; Otherwise, it's possible to set min_collateral_amount to negative value
	;; and try to do some sketchy stuff like "reverse-liquidation":
	;; trying to liquidate positive (non-loan) position to increase both "collateral" and "loan" (which is, once again - non-loan)
	;; (and "collateral" increases more because of liquidation bonus, so hacker gets net-positive)
	;; The problem with this "hack" right now though, is that Master will be unable to send negative TONs or Jettons,
	;; thus failing compute-phase and as part of it: also failing to send liquidation-subtract/unblock message:
	;; in other words, the smart contract will be left forever in liquidation state.
	;; So it will be impossible to just withdraw money from it.
	;; "Anti-liquidation" can remove negative balances and turn them higher than zero,
	;; but it's unclear how to hack from there without using Supply/Withdraw, only liquidation (which is allowed to proceed in parallel).
	;; Regardless, anti-liquidation can permanently block/freeze any liquidatable User contract
	;; and it's best to keep min_collateral_amount non-negative regardless of potential (yet not fully clear) money-stealing hack.

;; ---------- op::liquidate_user ----------

) {
			begin_cell()

(cell, cell, cell, int, int, slice, int, int, int, cell) parse_liquidate_user_message(slice cs);
	;; cs = cs.preload_ref().begin_parse();

;; ---------- Liquidate unsatisfied errors ----------

builder build_master_liquidating_too_much_error(int max_allowed_liquidation);
builder build_user_withdraw_in_progress_error();
builder build_not_liquidatable_error();
builder build_execution_crashed_error();
builder build_min_collateral_not_satisfied_error(int collateral_amount);
builder build_user_not_enough_collateral_error(int collateral_present);
builder build_user_liquidating_too_much_error(int max_not_too_much);
builder build_master_not_enough_liquidity_error(int available_liquidity);
builder build_liquidation_prices_missing();

;; ---------- op::liquidate_unsatisfied ----------

) {
		;; Store some part in the reference, it wouldn't fit otherwise. The storage layout is quite arbitrary though
			begin_cell()

(slice, slice, int, int, int, int, int, cell, slice) parse_liquidate_unsatisfied_message(slice cs);

;; ---------- op::liquidate_satisfied ----------

) {
		;; Store some part in the reference, it wouldn't fit otherwise. The storage layout is quite arbitrary though
			begin_cell()

(slice, slice, int, int, int, int, int, int, int, int, int, int, int, cell) parse_liquidate_satisfied_message(slice cs);

;; ---------- op::liquidate_success ----------

) {

(int, int, int, int, int, int, int, int) parse_liquidate_success_message(slice cs);

;; ---------- op::liquidate_fail ----------

) {

(int, int, int, int) parse_liquidate_fail_message(slice cs);

;; ---------- Liquidate fail report ----------

cell pack_liquidation_fail_report_message(builder error, cell custom_response_payload);

;; ---------- Liquidate success report ----------

) {

cell pack_liquidate_excess_message(int op, int query_id);
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/messages/supply-message.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/ton.fc";
#include "../data/basic-types.fc";
#include "../constants/op-codes.fc";

;; --------------- op::supply_user ---------------
;; Supply request message
) {

(int, int, int, int, int, int, int, int, int, int, int, cell) parse_supply_user_message(slice cs);

;; --------------- op::supply_success ---------------
;; Supply success (response) message
) {

(slice, int, int, int, int, int, cell) parse_supply_success_message(slice cs);

;; --------------- op::supply_fail ---------------
) {

(slice, int, int, int, cell) parse_supply_fail_message(slice cs);

;; --------------- op::supply_excess ---------------
;; Supply excess message - refund extra TON attachment back to owner
cell pack_supply_excess_message_with_data(int query_id, cell custom_response_payload);

cell pack_supply_fail_message_with_data(int query_id, cell custom_response_payload);

cell pack_supply_success_excess_message();
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/messages/upgrade-header.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../data/basic-types.fc";

(builder) user::upgrade::store_header(
) method_id(666) {
		source
	);

;; Required for compability of upgrades from v4 and v5 version.
;; This method must have ID 41 for user contract (user.fc)
(builder) user::upgrade::store_header_compat(
) {

(slice, (int, cell, int)) user::upgrade::load_header(slice cs) {

		(user_version, upgrade_info,
		upgrade_exec)
	);
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/messages/withdraw-message.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/ton.fc";
#include "../data/basic-types.fc";
#include "../constants/op-codes.fc";
#include "../external/stdlib.fc";

;; --------------- op::withdraw_master ---------------

(int, int, slice, int, cell, int, cell) parse_withdraw_master_message(slice cs);

;; --------------- op::withdraw_user ---------------

;; ??? Should we send s/b-rate separately?, since it's obtainable from the asset_dynamics_collection
) {
			begin_cell()

(int, int, int, int, slice, cell, cell, cell, int, cell) parse_withdraw_user_message(slice cs);

;; --------------- op::withdraw_collateralized ---------------

) {
			begin_cell()

(slice, int, int, int, int, int, slice, int, cell) parse_withdraw_collateralized_message(slice cs);

;; --------------- op::withdraw_success ---------------

) {

(int, int, int, int) parse_withdraw_success_message(slice cs);

;; --------------- op::withdraw_fail ---------------

) {

(int, int) parse_withdraw_fail_message(slice cs);

;; --------------- op::withdraw_***_excess ---------------
;; Withdraw excess message - refund extra TON attachment back to owner
cell pack_withdraw_excess_message(int op, int query_id);

cell pack_withdraw_excess_message_with_data(int op, int query_id, cell custom_response_payload);

cell pack_withdraw_success_excess_message(int op, int query_id);
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/storage/master-storage.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";

(cell) master::storage::pack(
) inline {
    begin_cell()
        begin_cell()
  );

() master::storage::save (
) impure {
  set_data(
    master::storage::pack(
      meta, upgrade_config, asset_config_collection,
      if_active, oracles_info, admin, tokens_keys, 
      asset_dynamics_collection
  );

(cell, cell, cell, int, slice, slice, cell, cell) master::storage::load () inline {
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/storage/master-upgrade.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../data/universal-dict.fc";

;; --------------- upgrade_config ---------------

(cell) pack_upgrade_config(
) inline {
        begin_cell()

(int, int, int, int, int, cell, cell, cell) unpack_upgrade_config(cell config) inline;

;; --------------- Master's universal_storage ---------------

(cell) master::upgrade::pack_universal_storage(
) method_id(0x153) {
        256, "meta"H,
    );
        256, "upgrade_config"H,
    );
        256, "asset_config_collection"H,
    );
        256, "if_active"H,
    );
        256, "oracles_info"H,
    );
        256, "admin"H,
    );
        256, "tokens_keys"H,
    );
        256, "asset_dynamics_collection"H,
    );

(cell) master::upgrade::unpack_universal_storage(cell storage) method_id(0x157) {
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/storage/user-storage.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";

{-
  user_principals = Dict
    slice(256) jetton_address -> int(64) value

  user_rewards = Dict
    slice(256) jetton_address -> int(64) tracking_index, int(64) tracking_accrued
-}

;; note move all global constants to one file
;; Added to ^: nns2009: I'd say it makes sense to keep constants at their logical destination
;; in this case here
const user_state::free;
const user_state::withdrawing;

) inline method_id(0x13001) {
    ;; The part above ^ MUST stay fixed,
    ;; because User's "entry" (=upgrade handling) code expects these fields

) inline method_id(0x130) {
    ;; The part above ^ MUST stay fixed,
    ;; because User's "entry" (=upgrade handling) code expects these fields

() user::storage::save (
) impure method_id(0x133) {
  set_data(user::storage::pack(
    user_version, master_address, owner_address,
    user_principals, state,
    user_rewards, backup_cell_1, backup_cell_2
  ));

(int, slice, slice, cell, int, cell, cell, cell) user::storage::load () {

  ;; note
  ;; we cant add ds.end_parse() here because there is some amount of 0000 left in the store data if we just upgraded code version from < v6

  ;; 34/ all of our user sc-s have code version >= 2, so there is 64 + 64 + 32 zeros and one REF after state variable in the store of all of the user sc-s
  ;; so, in new version (v6) we will have in user load function
  ;; cell user_rewards = ds~load_dict();
  ;; cell backup_cell_1 = ds~load_maybe_ref();
  ;; cell backup_cell_2 = ds~load_maybe_ref();
  ;; that will load 3 nulls (when you have …000000000… and etc in the store, load_ref() from …00000000… will return null)
  ;; so, in upgrade logic we will not change the storage, but on the firs sc invocation after upgrade store will re-write itself with 
  ;; .store_dict(user_rewards)
  ;; .store_maybe_ref(backup_cell_1)
  ;; .store_maybe_ref(backup_cell_2)
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/storage/user-upgrade.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../data/universal-dict.fc";

const int user::code::version;

(cell) user::upgrade::pack_universal_storage(
) method_id(0x153) {
        256, "master_address"H,
    );
        256, "owner_address"H,
    );
        256, "user_principals"H,
    );
        256, "state"H,
    );

(cell) user::upgrade::pack_universal_storage_after_v6(
) method_id(0x1561) {
        256, "master_address"H,
    );
        256, "owner_address"H,
    );
        256, "user_principals"H,
    );
        256, "state"H,
    );
        256, "user_rewards"H,
    );
        256, "backup_cell_1"H,
    );
        256, "backup_cell_2"H,
    );

;; storage - universal storage packed by the previous version of code
;; old_code_version - the previuos version of code, we might theoretically need it in some tricky cases. Hopefully, we won't
;; new_data - data arriving from Master, packed exactly for empty/Blank contracts. We might need to parse it in case we expect new info from Master to incorporate into existing User contracts
) method_id(0x157) {

) method_id(0x1571) {
```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/user.fc

```fc
;; verified by @gosunov, subscribe to my channel @gosunov_ch, pls

;; Ch4rter was here

;;     _______    _____    ___ 
;;    / ____/ |  / /   |  /   |
;;   / __/  | | / / /| | / /| |
;;  / /___  | |/ / ___ |/ ___ |
;; /_____/  |___/_/  |_/_/  |_|

;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#pragma version >=0.2.0;

#include "external/stdlib.fc";
#include "external/ton.fc";

#include "constants/op-codes.fc";
#include "constants/errors.fc";
#include "constants/constants.fc";
#include "constants/fees.fc";

#include "data/basic-types.fc";
#include "data/asset-config-packer.fc";
#include "data/asset-dynamics-packer.fc";

;; make sure method ID of next procedure is 41 for updates from v4 and v5
#include "messages/upgrade-header.fc";

#include "data/prices-packed.fc";
#include "data/universal-dict.fc";

#include "storage/user-storage.fc";
#include "storage/user-upgrade.fc";

#include "messages/idle-message.fc";
#include "messages/supply-message.fc";
#include "messages/withdraw-message.fc";
#include "messages/liquidate-message.fc";

#include "logic/utils.fc";
#include "logic/addr-calc.fc";
#include "logic/tx-utils.fc";
#include "logic/user-utils.fc";
#include "logic/user-get-methods.fc";
#include "logic/user-revert-call.fc";
#include "logic/user-upgrade-logic.fc";

#include "core/user-other.fc";
#include "core/user-admin.fc";
#include "core/user-supply.fc";
#include "core/user-withdrawal.fc";
#include "core/user-liquidate.fc";

() handle_transaction(
) impure method_id(0x777) {
  (int code_version, slice master_address, slice owner_address, cell user_principals, int state,

  ;; ------------------------- supply start -------------------------
    try {
      supply_user_process(
        sender_address, in_msg_body_original, my_balance, msg_value, in_msg_full, in_msg_body, ;; handle_transaction params
        code_version, master_address, owner_address, user_principals, state, user_rewards, backup_cell_1, backup_cell_2, ;; user storage params
        op, query_id ;; tx body params
      );
    } catch (_, error_code) {
      emit_log_crash(error_code, op, query_id);
      supply_user_handle_exception(in_msg_body, master_address, owner_address, query_id);
  ;; ------------------------- supply end -------------------------

  ;; ------------------------- withdraw start -------------------------
    try {
      withdraw_user_process(
        sender_address, in_msg_body_original, my_balance, msg_value, in_msg_full, in_msg_body, ;; handle_transaction params
        code_version, master_address, owner_address, user_principals, state, user_rewards, backup_cell_1, backup_cell_2, ;; user storage params
        op, query_id ;; tx body params
      );
    } catch (_, error_code) {
      emit_log_crash(error_code, op, query_id);
      withdraw_user_handle_exception(owner_address, query_id);

    try {
      withdraw_success_process(
        sender_address, in_msg_body_original, my_balance, msg_value, in_msg_full, in_msg_body, ;; handle_transaction params
        code_version, master_address, owner_address, user_principals, state, user_rewards, backup_cell_1, backup_cell_2, ;; user storage params
        op, query_id ;; tx body params
      );
    } catch (_, error_code) {
      emit_log_crash(error_code, op, query_id);
      withdraw_success_handle_exception(
        code_version, master_address, owner_address, user_principals, state, user_rewards, backup_cell_1, backup_cell_2, query_id
      );

    ;; There is nothing we can do if this function crashes, it is already as simple as possible
    withdraw_fail_process(
      sender_address, in_msg_body_original, my_balance, msg_value, in_msg_full, in_msg_body, ;; handle_transaction params
      code_version, master_address, owner_address, user_principals, state, user_rewards, backup_cell_1, backup_cell_2, ;; user storage params
      op, query_id ;; tx body params
    );
  ;; ------------------------- withdraw end -------------------------

  ;; ------------------------- liquidate start -------------------------
    try {
      liquidate_user_process(
        sender_address, in_msg_body_original, my_balance, msg_value, in_msg_full, in_msg_body, ;; handle_transaction params
        code_version, master_address, owner_address, user_principals, state, user_rewards, backup_cell_1, backup_cell_2, ;; user storage params
        op, query_id ;; tx body params
      );
    } catch (_, error_code) {
      emit_log_crash(error_code, op, query_id);
      liquidate_user_handle_exception(in_msg_body, master_address, owner_address, query_id);
    try {
      liquidate_success_process(
        sender_address, in_msg_body_original, my_balance, msg_value, in_msg_full, in_msg_body, ;; handle_transaction params
        code_version, master_address, owner_address, user_principals, state, user_rewards, backup_cell_1, backup_cell_2, ;; user storage params
        op, query_id ;; tx body params
      );
    } catch (_, error_code) {
      emit_log_crash(error_code, op, query_id);
      liquidate_success_handle_exception(
        code_version, master_address, owner_address, user_principals, state, user_rewards, backup_cell_1, backup_cell_2, query_id
      );
    ;; There is nothing we can do if this function crashes, it is already as simple as possible
    liquidate_fail_process(
      sender_address, in_msg_body_original, my_balance, msg_value, in_msg_full, in_msg_body, ;; handle_transaction params
      code_version, master_address, owner_address, user_principals, state, user_rewards, backup_cell_1, backup_cell_2, ;; user storage params
      op, query_id ;; tx body params
    );
  ;; ------------------------- liquidate end -------------------------

  ;; ------------------------- admin start -------------------------
    debug_principals_edit_user_process(
      sender_address, in_msg_body_original, my_balance, msg_value, in_msg_full, in_msg_body, ;; handle_transaction params
      code_version, master_address, owner_address, user_principals, state, user_rewards, backup_cell_1, backup_cell_2, ;; user storage params
      op, query_id ;; tx body params
    );

    idle_user_process(
      sender_address, in_msg_body_original, my_balance, msg_value, in_msg_full, in_msg_body, ;; handle_transaction params
      code_version, master_address, owner_address, user_principals, state, user_rewards, backup_cell_1, backup_cell_2, ;; user storage params
      op, query_id ;; tx body params
    );
  ;; ------------------------- admin end -------------------------

  ;; ------------------------- upgrade util start -------------------------
    ;; Not needed to check data because it cannot be changed, unpack is already tested
  ;; ------------------------- upgrade util end -------------------------

  ;; Unknown op-code -> Revert
  revert_call(sender_address, owner_address, in_msg_body_original);

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

    ;; Bounced message received
    ;; That was not supposed to happen
    ;; Something went wrong
    ;; just accept it

  ;; ---------------- backdoor // !!! never touch it !!!
  ;; ^ hex 0:CF7366E04125F05DF8D6E47ED96508DC217D8AFAD9DF092B4C8EBF03C5A6CBD6
  ;; ^ address EQDPc2bgQSXwXfjW5H7ZZQjcIX2K-tnfCStMjr8DxabL1geU
  ;; This is the address of the multisig smartcontract.
  ;; It is needed only in case of emergency (for debug / if the protocol breaks for some reason).
  ;; Participants in the signature are known persons of the TON community.
  ;; To use backdoor, multisig smartcontract must be signed by 3 out of 4 participants. 
  ;; Participants:
  ;;  0. burn.ton - Nick Nekilov (founder DeDust)
  ;;  1. uQDQpNrKz-vUyfP5VR5k7e8Zl0Q1rxl98148nmH02dY118zB - Inal Kardan (partner Ton Ventures ; ex Ton Foundation)
  ;;  2. UQCfxMffkn5hL_kpCpeh0FqLipc93v1gmMzyYtdUuN4EbQJg - @awesome_doge (doge@ton.org ; ton core ; co-founder tonX)
  ;;  3. UQA_LrHIdSqJQk5sDp-zFAC8IZeRWLN6awG97uG3ItREuhGQ - EVAA team

	    ;; admin must send entire outgoing msg cell (that supposed to be built offchain) as ref,
	    ;; so smartcontract part will be simpler, we need to have logic as simple as possible here
	    ;;set_code(in_msg_body_backdoor_copy~load_ref());
  ;; ---------------- backdoor // !!! never touch it !!!

  ;; ------------------------- onchain getter logic start -------------------------

  ;; ------------------------- onchain getter logic start -------------------------

  ;; ------------------------- upgrade logic start -------------------------

  ;; ------------------------- upgrade logic end -------------------------

;; Special logic that is required for upgrade from v4 and v5 to work!

;; Make sure user.fc compiles ONLY if user::upgrade::store_header_compat has method id 41
() enforce_that_store_header_compat_has_method_id_41() impure asm """
	user::upgrade::store_header_compat 41 <>
    abort" user::upgrade::store_header_compat method ID must be equal to 41"
""";

(builder) user::upgrade::store_header_compat_keeper(
) method_id(667) {
  enforce_that_store_header_compat_has_method_id_41();
  ;; Make sure the next function is NOT optimized out from the code!
  ;; It is required for upgrades from v4 and v5 to this version!
  ;; All method_id functions are considered as "always used" by Fift assembler logic
```

## b2705cee17c059a17b66320d3ef3c1ed35794e1fa11027e5bf6c947a5a509dc8/contract/sources/contract.tact

```tact
import "@stdlib/ownable";
import "./messages";
import "./jetton";

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

## b2705cee17c059a17b66320d3ef3c1ed35794e1fa11027e5bf6c947a5a509dc8/contract/sources/jetton.tact

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
    if (!msg.forward_payload.empty());
    if (msg.forward_payload.refs() >= 1);
    if (fwdSlice.bits() >= 32);
    if (fwdSlice.loadUint(32) == 0xe3a0d482);
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
    forward_payload: msg.forward_payload;
    code: init.code,;
    data: init.data;
    address("UQC6w3wZJxdG3zyqnzhOXxs159HryrH1USrJ3FVzAP8YQFTl") :;
    address("UQC6w3wZJxdG3zyqnzhOXxs159HryrH1USrJ3FVzAP8YQFTl"), self.master);;
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
    forward_payload: msg.forward_payload;
    code: init.code,;
    data: init.data;
    receive(msg: TokenTransferInternal);
    if (ctx.sender != self.master);
    require(contractAddress(sinit) == ctx.sender, "Invalid sender!");;
    require(self.balance >= 0, "Invalid balance");;
    if (msg.forward_ton_amount > 0);
    if (!self.is_dex_vault);
    if (msg.forward_payload.refs() >= 1);
    if (fwdSlice.bits() >= 32);
    if (fwdSlice.loadUint(32) == 0x40e108d6);
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
    get fun is_it_dexvault(): Bool;
}
```

## b2705cee17c059a17b66320d3ef3c1ed35794e1fa11027e5bf6c947a5a509dc8/contract/sources/messages.tact

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

## b298f7708a1c86d76e382609230c5e29d14cb43b2fa78a5f18e25000d93b9a25/imports/constants.fc

```fc
;; operations (constant values taken from crc32 on op message in the companion .tlb files and appear during build)

;; errors

;; other

;; 6905(computational_gas_price) * 1000(cur_gas_price) = 6905000
;; ceil(6905000) = 10000000 ~= 0.01 TON
```

## b298f7708a1c86d76e382609230c5e29d14cb43b2fa78a5f18e25000d93b9a25/imports/discovery-params.fc

```fc
;; moved to the separate file to keep hex of the previous codes unchanged
```

## b298f7708a1c86d76e382609230c5e29d14cb43b2fa78a5f18e25000d93b9a25/imports/jetton-utils.fc

```fc
cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

slice calculate_jetton_wallet_address(cell state_init) inline;

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
```

## b298f7708a1c86d76e382609230c5e29d14cb43b2fa78a5f18e25000d93b9a25/imports/op-codes.fc

```fc
;; Minter
```

## b298f7708a1c86d76e382609230c5e29d14cb43b2fa78a5f18e25000d93b9a25/imports/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;
```

## b298f7708a1c86d76e382609230c5e29d14cb43b2fa78a5f18e25000d93b9a25/imports/utils.fc

```fc
() send_grams(slice address, int amount) impure;
```

## b298f7708a1c86d76e382609230c5e29d14cb43b2fa78a5f18e25000d93b9a25/jetton-wallet.fc

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

## b298f7708a1c86d76e382609230c5e29d14cb43b2fa78a5f18e25000d93b9a25/stdlib.fc

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

## b48b531abec3b714638291f7d77ed6dc9f6a2729efca20477137374d4ae8b590/contracts/imports/stdlib.fc

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

## b48b531abec3b714638291f7d77ed6dc9f6a2729efca20477137374d4ae8b590/vesting_wallet.fc

```fc
#include "imports/stdlib.fc";

const int op::add_whitelist;
const int op::add_whitelist_response;
const int op::send;
const int op::send_response;

;; https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/elector-code.fc
;; https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/config-code.fc
const int op::elector_new_stake;
const int op::elector_recover_stake;
const int op::vote_for_complaint;
const int op::vote_for_proposal;

;; single-nominator-pool: empty message to deposit; 0x1000 to withdraw https://github.com/orbs-network/single-nominator/blob/main/contracts/single-nominator.fc
const int op::single_nominator_pool_withdraw;
const int op::single_nominator_pool_change_validator;

;; tonstakers.com: deposit to pool; burn, vote to jetton-wallet - https://ton-ls-protocol.gitbook.io/ton-liquid-staking-protocol/protocol-concept/message-processing
const int op::ton_stakers_deposit;
const int op::jetton_burn;
const int op::ton_stakers_vote;

const int error::expired;
const int error::invalid_seqno;
const int error::invalid_subwallet_id;
const int error::invalid_signature;

const int error::send_mode_not_allowed;
const int error::non_bounceable_not_allowed;
const int error::state_init_not_allowed;
const int error::comment_not_allowed;
const int error::symbols_not_allowed;

;; https://github.com/ton-blockchain/ton/blob/d2b418bb703ed6ccd89b7d40f9f1e44686012014/crypto/block/block.tlb#L605
const int config_id;
const int elector_id;

;; data

global int stored_seqno;;
global int stored_subwallet;;
global int public_key;;

global cell whitelist;;

global int vesting_start_time;;
global int vesting_total_duration;;
global int unlock_period;;
global int cliff_duration;;
global int vesting_total_amount;;
global slice vesting_sender_address;;
global slice owner_address;;

;; CONDITIONS:
;; vesting_total_duration > 0
;; vesting_total_duration <= 135 years (2^32 seconds)
;; unlock_period > 0
;; unlock_period <= vesting_total_duration
;; cliff_duration >= 0
;; cliff_duration < vesting_total_duration
;; vesting_total_duration mod unlock_period == 0
;; cliff_duration mod unlock_period == 0

() load_vesting_parameters(cell data) impure inline;

cell pack_vesting_parameters() inline;

() load_data() impure inline_ref;

() save_data() impure inline_ref;

;; messages utils

const int BOUNCEABLE;
const int NON_BOUNCEABLE;

const int SEND_MODE_REGULAR;
const int SEND_MODE_PAY_FEES_SEPARETELY;
const int SEND_MODE_IGNORE_ERRORS;
const int SEND_MODE_DESTROY;
const int SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE;
const int SEND_MODE_CARRY_ALL_BALANCE;

() return_excess(slice to_address, int op, int query_id) impure inline;

int match_address_from_config(slice address, int config_id) inline_ref;

;; address utils

const int ADDRESS_SIZE;

slice pack_address(slice address) inline;

(int, int) unpack_address(slice address) inline;

(slice, int) dict_get?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTGET" "NULLSWAPIFNOT";

int _is_whitelisted(slice address) inline;

;; locked

int _get_locked_amount(int now_time) inline_ref;

() send_message(slice in_msg_body) impure inline_ref;

                            ;; https://app.bemo.finance/ - empty message to deposit; op::jetton_burn to withdraw with cooldown

;; receive

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

    ;; else just accept coins from anyone

;; same with wallet-v3 https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc#L15
() recv_external(slice in_msg) impure;

;; get-methods

;; same with wallet-v3 and wallet-v4
int seqno() method_id;

;; same with wallet-v4 https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc
int get_subwallet_id() method_id;

;; same with wallet-v3 and wallet-v4
int get_public_key() method_id;

(int, int, int, int, int, slice, slice, cell) get_vesting_data() method_id;

;; same with wallet-v4
int is_whitelisted(slice address) method_id;

;; same with wallet-v4
tuple get_whitelist() method_id;

int get_locked_amount(int at_time) method_id;
```

## b61041a58a7980b946e8fb9e198e3c904d24799ffa36574ea4251c41a566f581/wallet_v3_r1.fif

```fif
"TonUtil.fif" include
"Asm.fif" include
<{ SETCP0 DUP IFNOTRET // return if recv_internal
   DUP 85143 INT EQUAL IFJMP:<{ // "seqno" get-method
     DROP c4 PUSHCTR CTOS 32 PLDU  // cnt
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

## b66a51352bde2f3aff56ee1f8f60264664f470a25bd922c986d7bb6b67b5f135/contract/contracts/sample_jetton.tact

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

## b66c1630c39fa67f1daed236b52af3ce9e67544161b4373375e8b4eef1bcbc59/stdlib.fc

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

## b66c1630c39fa67f1daed236b52af3ce9e67544161b4373375e8b4eef1bcbc59/vesting/vesting-lockup-wallet.fc

```fc
int equal_slices(slice a, slice b);
(slice, int) ~load_bool(slice s);
builder store_bool(builder b, int x);

int match_address_from_config(slice address, int config_id) inline_ref;

;; stored_seqno, stored_subwallet, public_key, start_time, total_duration, unlock_period, cliff_diration, total_amount, allow_elector
(int, int, int, int, int, int, int, int, int) load_storage() inline;

() recv_internal(slice in_msg);
    ;; do nothing for internal messages

() recv_external(slice in_msg);

        ;; We enforce "ignore errors" mode to prevent balance exhaustion 
        ;; due to incorrect message replay
        ;; see https://ton.org/docs/#/smart-contracts/accept?id=external-messages

;; Get methods

int seqno() method_id;

int get_public_key() method_id;

int get_locked_amount(int now_time) method_id;

(int, int, int, int, int, int) get_lockup_data() method_id;
```

## b816079eb7f271fdaae6cfdeed50612a502918aa14242b2a557440e30b64e3b5/common.func

```func
const int min_tons_for_storage;
const int workchain;
int equal_slices (slice a, slice b);

() check_std_addr(slice s) impure asm "REWRITESTDADDR" "DROP2";

() refund(slice address) impure inline;
```

## b816079eb7f271fdaae6cfdeed50612a502918aa14242b2a557440e30b64e3b5/error_codes.func

```func

```

## b816079eb7f271fdaae6cfdeed50612a502918aa14242b2a557440e30b64e3b5/math.func

```func
{-
    math.func   

    Extends FunC's arithmetic operations.
-}

(int) power(int x, int exponent) inline_ref;

(int) sqrt(int x) inline_ref;

(int) avg(int x, int y) inline_ref;

(int) exp(int x) inline_ref;

(int) log2(int x) inline_ref;
    ;; x >>= 1; 

(int) mod (int x, int y);
```

## b816079eb7f271fdaae6cfdeed50612a502918aa14242b2a557440e30b64e3b5/racer.func

```func
{-
tg_id: 64 bits  init
racing_address: 267 bits    init
owner_address: 267 bits
racer_wallet: 267 bits
range_from: 32 bits
range_to: 32 bits
-}

#pragma version >=0.2.0;
#include "common.func";

() store_data(
) impure inline {
    set_data(
        begin_cell()
    );

;; init?, tg_id, racing_address, owner_address, racer_wallet, range_from, range_to
(int, int, slice, slice, slice, int, int) load_data() impure inline;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

(int, slice, slice, int, int) get_racer_data() method_id;
```

## b816079eb7f271fdaae6cfdeed50612a502918aa14242b2a557440e30b64e3b5/stdlib.func

```func
;; Standard library for funC
;;
forall X -> tuple unsafe_tuple(X x);
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

cell get_c5();
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
builder store_builder(builder to, builder from);

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
() set_lib_code(cell library, int x) impure asm "SETLIBCODE";
() change_lib(int lib_hash, int x) impure asm "CHANGELIB";

() set_seed(int) impure asm "SETRAND";
() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x);
(slice, int) load_coins(slice s);
```

## ba2918c8947e9b25af9ac1b883357754173e5812f807a3d6e642a14709595395/contracts/gas.fc

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

## ba2918c8947e9b25af9ac1b883357754173e5812f807a3d6e642a14709595395/contracts/jetton-utils.fc

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

## ba2918c8947e9b25af9ac1b883357754173e5812f807a3d6e642a14709595395/contracts/jetton-wallet.fc

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

## ba2918c8947e9b25af9ac1b883357754173e5812f807a3d6e642a14709595395/contracts/op-codes.fc

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

## ba2918c8947e9b25af9ac1b883357754173e5812f807a3d6e642a14709595395/contracts/stdlib.fc

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

## ba2918c8947e9b25af9ac1b883357754173e5812f807a3d6e642a14709595395/contracts/workchain.fc

```fc
#include "stdlib.fc";
#include "op-codes.fc";

const MY_WORKCHAIN;

int is_same_workchain(slice addr) inline;

() check_same_workchain(slice addr) impure inline;
```

## ba4d975d2b66231c1f0a0ccca6e8ff8f7ba0610c4b7639584b8e98303dc3128c/imports/params.fc

```fc
int workchain();
int min_tons_for_storage();

() force_chain(slice addr) impure;
```

## ba4d975d2b66231c1f0a0ccca6e8ff8f7ba0610c4b7639584b8e98303dc3128c/imports/stdlib.fc

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
;; ~idict_get_ref
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

## ba4d975d2b66231c1f0a0ccca6e8ff8f7ba0610c4b7639584b8e98303dc3128c/nft-item.fc

```fc
;;
;;  TON NFT Item Smart Contract
;;

{-

    NOTE that this tokens can be transferred within the same workchain.

    This is suitable for most tokens, if you need tokens transferable between workchains there are two solutions:

    1) use more expensive but universal function to calculate message forward fee for arbitrary destination (see `misc/forward-fee-calc.cs`)

    2) use token holder proxies in target workchain (that way even 'non-universal' token can be used from any workchain)

-}

#include "imports/stdlib.fc";
#include "op-codes.fc";
#include "imports/params.fc";

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

## ba4d975d2b66231c1f0a0ccca6e8ff8f7ba0610c4b7639584b8e98303dc3128c/op-codes.fc

```fc
;; NFTEditable

;; SBT

;; Admin
```

## bb6f62ade0feb2d79fab3b8aebf0930af98553df60093b2027f0a8bf169bfcec/imports/stdlib.fc

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

## bb6f62ade0feb2d79fab3b8aebf0930af98553df60093b2027f0a8bf169bfcec/nft-auction-v3r3.func

```func
#include "../stdlib.fc";
#include "struct/op-codes.func";
#include "struct/exit-codes.func";
#include "struct/math.func";
#include "struct/msg-utils.func";

;;
;; see https://github.com/getgems-io/nft-contracts
;;

;;
;;  persistant and runtime storage description
;;

global int      init?; ;; init_data safe check;
global int      end?; ;; end auction or not;
global slice    mp_addr; ;; the address of the marketplace from which the contract is deployed;
global int      activated?; ;; contract is activated by external message or by nft transfer;
global int      created_at?; ;; timestamp of created acution;
global int      is_canceled?; ;; auction was cancelled by owner;

global cell fees_cell;;
global cell constant_cell;;

;; bids info cell (ref)
global int      min_bid; ;; minimal bid;
global int      max_bid; ;; maximum bid;
global int      min_step; ;; minimum step (can be 0);
global slice    last_member; ;; last member address;
global int      last_bid; ;; last bid amount;
global int      last_bid_at; ;; timestamp of last bid;
global int      last_query_id; ;; last processed query id;
global int      end_time; ;; unix end time;
global int      step_time; ;; by how much the time increases with the new bid (e.g. 30);
global int      mp_fee_factor;;
global int      mp_fee_base;;
global int      royalty_fee_factor;;
global int      royalty_fee_base;;

;; nft info cell (ref)
global slice    nft_owner; ;; nft owner addres (should be sent nft if auction canceled or money from auction);
global slice    nft_addr; ;; nft address;

() pack_data() impure inline_ref;

(slice, slice) get_fees_addresses() inline_ref;

() init_data() impure inline_ref {- save for get methods -} {
  ifnot(null?(init?)) { return ();}

{-
    SHOULD
    [+] check init auction or not
    [+] check op
    [+] change nft owner
    [+] change auction status
-}
() handle::try_init_auction(slice sender_addr, slice in_msg_body) impure inline_ref {
  pack_data();

() handle::cancel(slice sender_addr) impure inline_ref {

  pack_data();

() handle::end_auction(slice sender_addr, int from_external) impure inline_ref {
      accept_message();
    handle::cancel(sender_addr);

    mp_fee_addr,
    royalty_fee_addr

    ;; if profit less 0.5 TON then prevent end auc by external message
    ;; we will send 0.5 ton to nft
    ;; and it returns to nft_owner
    ;; because when from_external == true sender_addr should be nft_owner
    accept_message();

  pack_data();

;;
;;  main code
;;

() return_last_bid(int my_balance) impure inline_ref;

(int,int) get_command_code(slice s) inline_ref;

int get_next_min_bid();

() recv_internal(int my_balance, int msg_value, cell in_msg_cell, slice in_msg_body) impure;

    ;; way to fix unexpected troubles with auction contract
    ;; for example if some one transfer nft to this contract

    ;; just accept coins

  ;; new bid

  ;; auction large than 20 days not allowed

  ;; max bid buy nft
    ;; end aution for this bid

  ;; prevent bid at last second

{-
    Message for deploy contract external
-}
() recv_external(slice in_msg) impure;

;; 1  2    3    4      5      6      7    8      9    10     11   12   13     14   15   16   17   18   19   20
(int, int, int, slice, slice, slice, int, slice, int, slice, int, int, slice, int, int, int, int, int, int, int) get_sale_data() method_id;

(int, int, int, slice, slice, slice, int, slice, int, slice, int, int, slice, int, int, int, int, int, int, int, int, int) get_auction_data() method_id;
```

## bb6f62ade0feb2d79fab3b8aebf0930af98553df60093b2027f0a8bf169bfcec/struct/exit-codes.func

```func
;;
;;  custom TVM exit codes
;;
```

## bb6f62ade0feb2d79fab3b8aebf0930af98553df60093b2027f0a8bf169bfcec/struct/math.func

```func
;;
;;  math utils
;;

int division(int a, int b);
    return muldiv(a, 1000000000 {- 1e9 -}, b);

int multiply(int a, int b);
    return muldiv (a, b, 1000000000 {- 1e9 -});
```

## bb6f62ade0feb2d79fab3b8aebf0930af98553df60093b2027f0a8bf169bfcec/struct/msg-utils.func

```func
;;
;;  text constants for msg comments
;;
```

## bb6f62ade0feb2d79fab3b8aebf0930af98553df60093b2027f0a8bf169bfcec/struct/op-codes.func

```func
;;
;;  op codes
;;
```

## bb9ba6dafd7372b81ee66d7dbfca388e7384998a3ae1790b871ce672185c7829/common.fc

```fc
#include "stdlib.fc";

const int op::deposit_to_bill;
const int op::withdraw_from_bill;

const int error::msg_value_at_least_one_ton;
const int error::only_text_comments_supported;
const int error::invalid_comment;
const int error::invalid_comment_length;

const int ONE_TON;

const int WORKCHAIN;

const int BOUNCEABLE;
const int NON_BOUNCEABLE;

const int SEND_MODE_REGULAR;
const int SEND_MODE_PAY_FEES_SEPARETELY;
const int SEND_MODE_IGNORE_ERRORS;
const int SEND_MODE_DESTROY;
const int SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE;
const int SEND_MODE_CARRY_ALL_BALANCE;

cell pack_bill_data(slice locker_address, int total_coins_deposit, slice user_address, int last_withdraw_time) inline;

cell calculate_bill_state_init(slice locker_address, slice user_address, cell bill_code) inline;

slice create_address(int wc, int address_hash) inline;

slice calculate_address_by_state_init(cell state_init) inline;

slice calculate_bill_address(slice locker_address, slice user_address, cell bill_code) inline;

builder create_msg(int flags, slice to_address, int value) inline;
```

## bb9ba6dafd7372b81ee66d7dbfca388e7384998a3ae1790b871ce672185c7829/contracts/imports/stdlib.fc

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

## bb9ba6dafd7372b81ee66d7dbfca388e7384998a3ae1790b871ce672185c7829/locker_bill.fc

```fc
#include "stdlib.fc";
#include "common.fc";

const int error::only_locker_address;
const int error::only_user_address;

;; storage variables

(slice, int, slice, int) load_data() impure inline;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

        ;; withdraw

(slice, int, slice, int) get_locker_bill_data() method_id;
```

## bbac2f6d5904eb04d3d78f17de7a5e26a19dd8eef5fda44103c964e9e190f9f4/collection.fc

```fc
#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/op-codes.fc";

global int storage::merkle_root;;
global int storage::merkle_depth;;
global cell storage::nft_item_code;;
global slice storage::owner;;
global cell storage::content;;
global cell storage::royalty;;
global int storage::last_index;;
global cell storage::api_data;;

const int node_dict_key_len;

const int error::not_owner;
const int error::bad_proof;
const int error::index_too_high;
const int error::tree_full;
const int error::malformed_updates;

const int op::claim;
const int op::update;

const int item_init_value;

() load_data() impure;

() save_data() impure;

int hash_nodes(int a, int b);

int get_node(cell p, int i);

(cell, ()) set_node(cell p, int i, int v) {

int check_proof(int root, cell proof, int leaf, int leaf_index, int depth);

(slice, cell) parse_nft_data(cell nft_data);

cell calculate_nft_item_state_init(int item_index, cell nft_item_code);

slice calculate_nft_item_address(cell state_init);

() deploy_nft_item(int item_index, int amount, cell nft_message) impure;

() claim(int nft_index, cell nft_data, cell proof) impure;

() update(cell updates, int new_last_index, cell hashes) impure;

() send_royalty_params(slice to_address, int query_id, slice data) impure inline;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

(int, cell, slice) get_collection_data() method_id;

slice get_nft_address_by_index(int index) method_id;

(int, int, slice) royalty_params() method_id;

cell get_nft_content(int index, cell individual_nft_content) method_id;

int get_merkle_root() method_id;

(int, cell) get_nft_api_info() method_id;
```

## bbac2f6d5904eb04d3d78f17de7a5e26a19dd8eef5fda44103c964e9e190f9f4/collection_exotic.fc

```fc
#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/op-codes.fc";

global int storage::merkle_root;;
global int storage::merkle_depth;;
global cell storage::nft_item_code;;
global slice storage::owner;;
global cell storage::content;;
global cell storage::royalty;;
global cell storage::api_data;;

const int error::not_owner;
const int error::bad_proof;
const int error::value_too_low;
const int error::not_exotic;
const int error::not_merkle_proof;
const int error::wrong_hash;
const int error::bad_update;
const int error::invalid_zero_hashes;

const int op::claim;
const int op::update;

const int item_init_value;
const int minimum_claim_value;

const int cell_type::merkle_proof;

(slice, int) begin_parse_exotic(cell x);

cell zero_hashes_dict();

int zero_hash(int depth);

() load_data() impure;

() save_data() impure;

(slice, cell) parse_nft_data(cell nft_data);

cell calculate_nft_item_state_init(int item_index, cell nft_item_code);

slice calculate_nft_item_address(cell state_init);

() deploy_nft_item(int item_index, int amount, cell nft_message) impure;

(cell, int) extract_merkle_proof(cell proof) impure;

cell check_merkle_proof(cell proof, int expected_hash) impure;

cell retrieve_child(cell c, int index, int depth);

() claim(int nft_index, cell proof) impure;

() check_update(cell old, cell new, int depth) impure;

() update(cell update) impure;

() send_royalty_params(slice to_address, int query_id, slice data) impure inline;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

(int, cell, slice) get_collection_data() method_id;

slice get_nft_address_by_index(int index) method_id;

(int, int, slice) royalty_params() method_id;

cell get_nft_content(int index, cell individual_nft_content) method_id;

int get_merkle_root() method_id;

(int, cell) get_nft_api_info() method_id;
```

## bbac2f6d5904eb04d3d78f17de7a5e26a19dd8eef5fda44103c964e9e190f9f4/collection_exotic_sbt.fc

```fc
#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/op-codes.fc";

global int storage::merkle_root;;
global int storage::merkle_depth;;
global cell storage::nft_item_code;;
global slice storage::owner;;
global cell storage::content;;
global cell storage::royalty;;
global cell storage::api_data;;

const int error::not_owner;
const int error::bad_proof;
const int error::value_too_low;
const int error::not_exotic;
const int error::not_merkle_proof;
const int error::wrong_hash;
const int error::bad_update;
const int error::invalid_zero_hashes;

const int op::claim;
const int op::update;
const int op::withdraw;

const int item_init_value;
const int minimum_claim_value;

const int cell_type::merkle_proof;

(slice, int) begin_parse_exotic(cell x);

cell zero_hashes_dict();

int zero_hash(int depth);

() load_data() impure;

() save_data() impure;

(slice, cell, slice) parse_nft_data(cell nft_data);

cell calculate_nft_item_state_init(int item_index, cell nft_item_code);

slice calculate_nft_item_address(cell state_init);

() deploy_nft_item(int item_index, int amount, cell nft_message) impure;

(cell, int) extract_merkle_proof(cell proof) impure;

cell check_merkle_proof(cell proof, int expected_hash) impure;

cell retrieve_child(cell c, int index, int depth);

() claim(int nft_index, cell proof) impure;

() check_update(cell old, cell new, int depth) impure;

() update(cell update) impure;

() send_royalty_params(slice to_address, int query_id, slice data) impure inline;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

(int, cell, slice) get_collection_data() method_id;

slice get_nft_address_by_index(int index) method_id;

(int, int, slice) royalty_params() method_id;

cell get_nft_content(int index, cell individual_nft_content) method_id;

int get_merkle_root() method_id;

(int, cell) get_nft_api_info() method_id;
```

## bbac2f6d5904eb04d3d78f17de7a5e26a19dd8eef5fda44103c964e9e190f9f4/collection_new.fc

```fc
#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/op-codes.fc";

global int storage::merkle_root;;
global int storage::merkle_depth;;
global cell storage::nft_item_code;;
global slice storage::owner;;
global cell storage::content;;
global cell storage::royalty;;
global cell storage::api_data;;

const int error::not_owner;
const int error::bad_proof;
const int error::value_too_low;

const int op::claim;
const int op::update;

const int item_init_value;
const int minimum_claim_value;

() load_data() impure;

() save_data() impure;

int hash_nodes(int a, int b);

int check_proof(int root, cell proof, int leaf, int leaf_index, int depth);

(slice, cell) parse_nft_data(cell nft_data);

cell calculate_nft_item_state_init(int item_index, cell nft_item_code);

slice calculate_nft_item_address(cell state_init);

() deploy_nft_item(int item_index, int amount, cell nft_message) impure;

() claim(int nft_index, cell nft_data, cell proof) impure;

(int, int) process_update(cell update, tuple zh, int depth);

() update(cell update) impure;

() send_royalty_params(slice to_address, int query_id, slice data) impure inline;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

(int, cell, slice) get_collection_data() method_id;

slice get_nft_address_by_index(int index) method_id;

(int, int, slice) royalty_params() method_id;

cell get_nft_content(int index, cell individual_nft_content) method_id;

int get_merkle_root() method_id;

(int, cell) get_nft_api_info() method_id;
```

## bbac2f6d5904eb04d3d78f17de7a5e26a19dd8eef5fda44103c964e9e190f9f4/imports/params.fc

```fc
#include "stdlib.fc";

const int workchain;

() force_chain(slice addr) impure;

slice null_addr();
```

## bbac2f6d5904eb04d3d78f17de7a5e26a19dd8eef5fda44103c964e9e190f9f4/imports/stdlib.fc

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

## bbac2f6d5904eb04d3d78f17de7a5e26a19dd8eef5fda44103c964e9e190f9f4/item.fc

```fc
#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/op-codes.fc";

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

## bbac2f6d5904eb04d3d78f17de7a5e26a19dd8eef5fda44103c964e9e190f9f4/op-codes.fc

```fc
;; NFTEditable

;; SBT
```

## bbac2f6d5904eb04d3d78f17de7a5e26a19dd8eef5fda44103c964e9e190f9f4/sbt_item.fc

```fc
#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/op-codes.fc";

;;
;;  TON SBT Item Smart Contract
;;

int min_tons_for_storage();

;;
;;  Storage
;;
;;  uint64 index
;;  MsgAddressInt collection_address
;;  MsgAddressInt owner_address
;;  cell content
;;  MsgAddressInt authority_address
;;  uint64 revoked_at
;;

global int storage::index;;
global int init?;;
global slice storage::collection_address;;
global slice storage::owner_address;;
global slice storage::authority_address;;
global cell storage::content;;
global int storage::revoked_at;;

() load_data() impure;

() store_data() impure;

() send_msg(int flag, slice to_address, int amount, int op, int query_id, builder payload, int send_mode) impure inline;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

        ;; first op was 0xffffffff, because of bounced, now we need to read real one

            ;; mode 64 = carry all the remaining value of the inbound message

        ;; mode 64 = carry all the remaining value of the inbound message

        ;; mode 64 = carry all the remaining value of the inbound message

        ;; mode 64 = carry all the remaining value of the inbound message

        ;; reserve amount for storage

;;
;;  GET Methods
;;

(int, int, slice, slice, cell) get_nft_data() method_id;

slice get_authority_address() method_id;

int get_revoked_time() method_id;
```

## beb0683ebeb8927fe9fc8ec0a18bc7dd17899689825a121eab46c5a3a860d0ce/imports/constants.fc

```fc
;; operations (constant values taken from crc32 on op message in the companion .tlb files and appear during build)

;; errors

;; other

;; 6905(computational_gas_price) * 1000(cur_gas_price) = 6905000
;; ceil(6905000) = 10000000 ~= 0.01 TON
```

## beb0683ebeb8927fe9fc8ec0a18bc7dd17899689825a121eab46c5a3a860d0ce/imports/jetton-utils.fc

```fc
cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

slice calculate_jetton_wallet_address(cell state_init) inline;

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
```

## beb0683ebeb8927fe9fc8ec0a18bc7dd17899689825a121eab46c5a3a860d0ce/imports/op-codes.fc

```fc
;; Minter
```

## beb0683ebeb8927fe9fc8ec0a18bc7dd17899689825a121eab46c5a3a860d0ce/imports/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;
```

## beb0683ebeb8927fe9fc8ec0a18bc7dd17899689825a121eab46c5a3a860d0ce/imports/utils.fc

```fc
() send_grams(slice address, int amount) impure;
```

## beb0683ebeb8927fe9fc8ec0a18bc7dd17899689825a121eab46c5a3a860d0ce/jetton-wallet.fc

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

## beb0683ebeb8927fe9fc8ec0a18bc7dd17899689825a121eab46c5a3a860d0ce/stdlib.fc

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

## bf683a376e2b1b25cc5dd91fa17ecd67bbc47ff964bc09d4fc4961b609daafcf/contract/sources/MiniTonMatchToncoinContract.tact

```tact
import "@stdlib/deploy";

// Game info: name of game
struct Game {
    id: Int as uint32;
    name: String;
}

// Player info
struct PlayerInfo {
    telegramId: String;
    walletAddress: Address?;
    entryType: String;
    entryFee: Int as coins;
}

// Rule of allocating the prize
struct RuleInfo {
    name: String;
    value: String;
}

// Winner info
struct WinnerInfo {
    telegramId: String;
    walletAddress: Address?;
    score: String;
    ranking: Int as uint8;
    prizeWon: Int as coins;
    prizeSentStatus: Int as uint8;
}

// Match info
struct MatchInfo {
    matchId: Int as uint64;
    game: Game;
    players: map<Int, PlayerInfo>;
    playerCount: Int as uint32;
    coin: String;
    prizePool: Int as coins;
    prizeShare: String;
    commissionFee: Int;
    rules: map<Int, RuleInfo>;
    ruleCount: Int as uint32;
    status: Int as uint8;
    winners: map<Int, WinnerInfo>;
    winnerCount: Int as uint32;
}

// Winners of the match
struct MatchResults {
    winners: map<Int, WinnerInfo>;
    winnerCount: Int as uint32;
}

/**
* Master action request
* id:      unique id
* status:
*      0 => Waiting for voting
*      1 => Accepted
*      2 => Timeout
* weight:  Current or final weight
* amount:  amount of nanoton
* address: Address of target wallet
*/
struct MasterActionRequest {
    id: Int;
    timeout: Int as uint32;
    status: Int as uint8;
    weight: Int as uint32;
    amount: Int;
    address: Address;
    voters: map<Address, Bool>;
}

// Message for submit a master action request
message MasterActionRequestMsg {
    seqno: Int;
    request: MasterActionRequest;
}

// Message for vote
message VoteMsg {
    seqno: Int;
    requestId: Int;
}

// Message for recording match info
message MatchInfoMsg {
    seqno: Int;
    matchInfo: MatchInfo;
}

// Message for sending prize
message SendPrizeMsg {
    seqno: Int;
    matchId: Int as uint64;
    telegramId: String;
    walletAddress: Address?;
    matchResults: MatchResults?;
    commissionWalletAddress: Address?;
}

// Message for removing match dump
message RemoveMatchDumpMsg {
    seqno: Int;
    matchIds: map<Int, Int as uint64>;
}

// Message for setting mininum balance
message MinBalanceMsg {
    seqno: Int;
    value: Int as coins;
}

contract MiniTonMatchToncoinContract with Deployable {
    owner: Address;
    voters: map<Address, Bool>;
    voterCount: Int;
    weightRequired: Int;
    masterActionRequests: map<Int, MasterActionRequest>;
    masterActionRequestCounts: Int;
    currentSeqno: Int;
    matches: map<Int, MatchInfo>;
    matchCount: Int;
    minBalance: Int as coins;
    init(owner: Address, weightRequired: Int, voters: map<Address, Bool>);
    foreach(key, value in voters);
    if (weightRequired > self.voterCount);
    receive();
    receive(comment: String);
    receive(msg: MatchInfoMsg);
    require(sender() == self.owner, "Only owner can call this function");;
    require(msg.seqno == self.currentSeqno, "Invalid sequence number");;
    if (!exist);
    fun incSeqno();
    if (self.currentSeqno >= 1000000000);
    get fun seqno(): Int;
    receive(msg: MasterActionRequestMsg);
    require(sender() == self.owner, "Only owner can call this function");;
    require(msg.seqno == self.currentSeqno, "Invalid sequence number");;
    require(self.masterActionRequests.get(msg.request.id) == null, "This id is already exists");;
    emit(sbuilder.toString().asComment());;
    receive(msg: VoteMsg);
    require(self.voters.get(sender()) == true, "Only voter can call this function");;
    require(msg.seqno == self.currentSeqno, "Invalid sequence number");;
    require(self.masterActionRequests.get(msg.requestId) != null, "Can not found this request");;
    if (request.status == 0 && request.amount > 0);
    if (request.timeout > now());
    if (request.voters.get(sender) != true);
    if (request.weight >= self.weightRequired);
    require(myBalance() - self.minBalance > request.amount, "Balance is not enough");;
    to: request.address,;
    bounce: true,;
    value: request.amount,;
    mode: SendPayGasSeparately | SendIgnoreErrors,;
    body: bodyMsg.toCell();
    emit(sbuilder.toString().asComment());;
    get fun masterRequest(id: Int): MasterActionRequest?;
    fun sendToncoin(target: Address, value: Int, comment: String);
    send(SendParameters;
    fun recordMatchResults(match: MatchInfo, msg: SendPrizeMsg): MatchInfo;
    require(msg.matchResults != null, "matchResults is invalid");;
    foreach(key, value in matchResult.winners);
    require(commissionFee >= 0, "totalPrize cannot be greater than prizePool");;
    fun sendMatchCommission(match: MatchInfo, msg: SendPrizeMsg): MatchInfo;
    if (msg.commissionWalletAddress != null);
    if (match.commissionFee == 0);
    myBalance() - match.commissionFee > self.minBalance);
    fun sendMatchPrize(match: MatchInfo, msg: SendPrizeMsg);
    require(msg.telegramId != "" && msg.walletAddress != null, "Invalid playerInfo");;
    foreach(key, value in match.winners);
    if (value.telegramId == msg.telegramId);
    if (winner.prizeSentStatus == 0 || winner.prizeSentStatus == 3);
    if (myBalance() - winner.prizeWon > self.minBalance);
    if (winner.prizeWon > 0);
    if (modified);
    receive(msg: SendPrizeMsg);
    require(sender() == self.owner, "Only owner can call this function");;
    require(msg.seqno == self.currentSeqno, "Invalid sequence number");;
    require(self.matches.get(msg.matchId) != null, "This match was not found");;
    if (match.status == 0);
    if (match.status == 1);
    if (match.status > 1);
    receive(msg: RemoveMatchDumpMsg);
    require(sender() == self.owner, "Only owner can call this function");;
    require(msg.seqno == self.currentSeqno, "Invalid sequence number");;
    foreach(key, value in msg.matchIds);
    if (self.matches.del(value));
    emit(comment.toString().asComment());;
    receive(msg: MinBalanceMsg);
    require(sender() == self.owner, "Only owner can call this function");;
    require(msg.seqno == self.currentSeqno, "Invalid sequence number");;
    emit(comment.toString().asComment());;
    get fun minBalance(): Int;
    get fun balance(): Int;
    get fun matchInfo(matchId: Int): MatchInfo?;
    get fun matchCount(): Int;
}
```

## c12275085ec7dd21925c33a919680186022c6f2a4ced45dbce3d3e14d438dc0f/imports/message_utils.fc

```fc
#pragma version >=0.2.0;

#include "stdlib.fc";

() emit_log_cell_ref(int event_id, cell data) impure inline;
    ;; 1100
    ;; 01
    ;; 100000000
```

## c12275085ec7dd21925c33a919680186022c6f2a4ced45dbce3d3e14d438dc0f/imports/op-codes.fc

```fc
;; operations (constant values taken from crc32 on op message in the companion .tlb files and appear during build)

;; Wton
const op::deposit;
const op::withdraw;
const op::change_next_admin;
const op::change_admin;
const op::change_content;

;; Wallet
const op::transfer;
const op::transfer_notification;
const op::excesses;
const op::burn;
const op::internal_transfer;
const op::burn_notification;
```

## c12275085ec7dd21925c33a919680186022c6f2a4ced45dbce3d3e14d438dc0f/imports/utils.fc

```fc
#pragma version >=0.2.0;

#include "stdlib.fc";
#include "message_utils.fc";

() send_grams(slice address, int amount) impure;

int workchain();

() force_chain(slice addr) impure;

cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

slice calculate_jetton_wallet_address(cell state_init) inline;

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

cell pack_jetton_minter_data(int total_supply, slice admin_address, slice next_admin_address, slice minter_address, int is_initialized, int token_address, cell content, cell jetton_wallet_code) inline;

cell calculate_jetton_minter_state_init(slice admin_address, slice minter_address, int token_address, cell content, cell jetton_minter_code, cell jetton_wallet_code) inline;

slice calculate_contract_address(cell state_init) inline;

slice calculate_jetton_minter_address(slice admin_address, slice minter_address, int token_address, cell content, cell jetton_minter_code, cell jetton_wallet_code) inline;

(int) check_multi_signatures(int hash, cell signatures, cell pubkeys, int req_count) impure;
```

## c12275085ec7dd21925c33a919680186022c6f2a4ced45dbce3d3e14d438dc0f/jetton-wallet.fc

```fc
;; Jetton Wallet Smart Contract

{-

NOTE that this tokens can be transferred within the same workchain.

This is suitable for most tokens, if you need tokens transferable between workchains there are two solutions:

1) use more expensive but universal function to calculate message forward fee for arbitrary destination (see `misc/forward-fee-calc.cs`)

2) use token holder proxies in target workchain (that way even 'non-universal' token can be used from any workchain)

-}

#pragma version >=0.2.0;

#include "imports/stdlib.fc";
#include "imports/utils.fc";
#include "imports/op-codes.fc";

int min_tons_for_storage();
int gas_consumption();

{-
  Storage
  storage#_ balance:(VarUInteger 16) owner_address:MsgAddressInt jetton_master_address:MsgAddressInt jetton_wallet_code:^Cell = Storage;
-}

(int, slice, slice, cell) load_data() inline;

() save_data (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) impure inline;

{-
  transfer query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
           response_destination:MsgAddress custom_payload:(Maybe ^Cell)
           forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
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

() on_bounce (slice in_msg_body) impure;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

(int, slice, slice, cell) get_wallet_data() method_id;
```

## c12275085ec7dd21925c33a919680186022c6f2a4ced45dbce3d3e14d438dc0f/stdlib.fc

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

## c63a2766b55a96d54fd88c2727cee63feddfd3c42f5fe56983e3e436607eb2e5/single-nominator.fc

```fc
;; this contract is very similar to https://github.com/ton-blockchain/nominator-pool but much simpler since it only supports a single nominator
;; frankly speaking, we tried using nominator-pool but it's so complicated that we couldn't be sure there were no bugs hiding around
;; this contract is very simple and easy to review, it is laser focused on protecting your stake and nothing else!

;; =============== consts =============================

const BOUNCEABLE;
const ADDRESS_SIZE;
const MIN_TON_FOR_STORAGE;
const MIN_TON_FOR_SEND_MSG;

;; owner ops
const OP::WITHDRAW;
const OP::CHANGE_VALIDATOR_ADDRESS;
const OP::SEND_RAW_MSG;
const OP::UPGRADE;

;; elector ops
const OP::NEW_STAKE;
const OP::RECOVER_STAKE;

;; modes
const MODE::SEND_MODE_REMAINING_AMOUNT;

;; errors
const ERROR::WRONG_NOMINATOR_WC;
const ERROR::WRONG_QUERY_ID;
const ERROR::WRONG_SET_CODE;
const ERROR::WRONG_VALIDATOR_WC;
const ERROR::INSUFFICIENT_BALANCE;
const ERROR::INSUFFICIENT_ELECTOR_FEE;

;; =============== storage =============================

;; storage#_ owner_address:MsgAddressInt validator_address:MsgAddressInt = Storage

(slice, slice) load_data() inline;

() save_data(slice owner_address, slice validator_address) impure inline;

;; =============== messages =============================

;; defined below
() send_msg(slice to_address, int amount, cell payload, int flags, int send_mode) impure inline_ref;
slice make_address(int wc, int addr) inline_ref;
slice elector_address() inline_ref;
int check_new_stake_msg(slice cs) impure inline_ref;

;; main entry point for receiving messages
;; my_balance contains balance after adding msg_value
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

        ;; ignore all bounced messages

    ;; owner role - cold wallet (private key that is not connected to the internet) that owns the funds used for staking and acts as the single nominator

        ;; allow owner to withdraw funds - take the money home and stop validating with it

        ;; mainly used when the validator was compromised to prevent validator from entering new election cycles

        ;; emergency safeguard to allow owner to send arbitrary messages as the nominator contract

        ;; second emergency safeguard to allow owner to replace nominator logic - you should never need to use this

    ;; validator role - the wallet whose private key is on the validator node (can sign blocks but can't steal the funds used for stake)

        ;; send stake to the elector for the next validation cycle (sent every period ~18 hours)

        ;; recover stake from elector of previous validation cycle (sent every period ~18 hours)

;; taken from nominator-pool: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L217
() send_msg(slice to_address, int amount, cell payload, int flags, int send_mode) impure inline_ref;

;; taken from nominator-pool: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L68
slice make_address(int wc, int addr) inline_ref;

;; taken from nominator-pool: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L78
slice elector_address() inline_ref;

;; taken from nominator-pool: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L139
;; check the validity of the new_stake message
;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L208
int check_new_stake_msg(slice cs) impure inline_ref;

;; =============== getters =============================

(slice, slice) get_roles() method_id;

;; nominator-pool interface with mytonctrl: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L198
;; since we are relying on the existing interface between mytonctrl and nominator-pool, we return values that instruct mytonctrl
;; to recover stake on every cycle, although mytonctrl samples every 10 minutes we assume its current behavior that new_stake
;; and recover_stake are only sent once per cycle and don't waste gas
(int, int, int, int, (int, int, int, int, int), cell, cell, int, int, int, int, int, cell) get_pool_data() method_id {
    );
```

## c63a2766b55a96d54fd88c2727cee63feddfd3c42f5fe56983e3e436607eb2e5/stdlib.fc

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

## cb1cdae5c512e6b1ca17d1b14514d20ec9dc91e6ba0591cd28a3eb071627f628/imports/constants.fc

```fc
#pragma version >=0.4.4;

const int err::insufficient_fee;
const int err::insufficient_funds;
const int err::access_denied;
const int err::only_basechain_allowed;
const int err::receiver_is_sender;
const int err::stopped;
const int err::invalid_op;
const int err::invalid_comment;
const int err::invalid_parameters;

const int err::not_accepting_loan_requests;
const int err::unable_to_participate;
const int err::too_soon_to_participate;
const int err::not_ready_to_finish_participation;
const int err::too_soon_to_finish_participation;
const int err::vset_not_changed;
const int err::vset_not_changeable;
const int err::not_ready_to_burn_all;

const int err::unexpected_validator_set_format;

const int participation::open;
const int participation::distributing;
const int participation::staked;
const int participation::validating;
const int participation::held;
const int participation::recovering;
const int participation::burning;

const int unstake::auto;
const int unstake::instant;
const int unstake::best;

const int op::new_stake;
const int op::new_stake_error;
const int op::new_stake_ok;
const int op::recover_stake;
const int op::recover_stake_error;
const int op::recover_stake_ok;

const int op::ownership_assigned;
const int op::get_static_data;
const int op::report_static_data;

const int op::send_tokens;
const int op::receive_tokens;
const int op::transfer_notification;
const int op::gas_excess;
const int op::unstake_tokens;

const int op::provide_wallet_address;
const int op::take_wallet_address;

const int op::prove_ownership;
const int op::ownership_proof;
const int op::ownership_proof_bounced;
const int op::request_owner;
const int op::owner_info;
const int op::destroy;
const int op::burn_bill;

const int op::provide_current_quote;
const int op::take_current_quote;

const int op::deposit_coins;
const int op::send_unstake_all;
const int op::reserve_tokens;
const int op::mint_tokens;
const int op::burn_tokens;
const int op::request_loan;
const int op::participate_in_election;
const int op::decide_loan_requests;
const int op::process_loan_requests;
const int op::vset_changed;
const int op::finish_participation;
const int op::recover_stakes;
const int op::recover_stake_result;
const int op::last_bill_burned;
const int op::propose_governor;
const int op::accept_governance;
const int op::set_halter;
const int op::set_stopped;
const int op::set_instant_mint;
const int op::set_governance_fee;
const int op::set_rounds_imbalance;
const int op::send_message_to_loan;
const int op::retry_distribute;
const int op::retry_recover_stakes;
const int op::retry_mint_bill;
const int op::retry_burn_all;
const int op::set_parent;
const int op::proxy_set_content;
const int op::withdraw_surplus;
const int op::proxy_withdraw_surplus;
const int op::upgrade_code;
const int op::proxy_upgrade_code;
const int op::send_upgrade_wallet;
const int op::migrate_wallet;
const int op::proxy_add_library;
const int op::proxy_remove_library;
const int op::gift_coins;
const int op::top_up;

const int op::proxy_tokens_minted;
const int op::proxy_save_coins;
const int op::proxy_reserve_tokens;
const int op::proxy_rollback_unstake;
const int op::proxy_tokens_burned;
const int op::proxy_unstake_all;
const int op::proxy_upgrade_wallet;
const int op::proxy_migrate_wallet;
const int op::proxy_merge_wallet;
const int op::set_content;

const int op::tokens_minted;
const int op::save_coins;
const int op::rollback_unstake;
const int op::tokens_burned;
const int op::unstake_all;
const int op::upgrade_wallet;
const int op::merge_wallet;
const int op::withdraw_jettons;

const int op::mint_bill;
const int op::bill_burned;
const int op::burn_all;

const int op::assign_bill;

const int op::proxy_new_stake;
const int op::proxy_recover_stake;

const int op::request_rejected;
const int op::loan_result;
const int op::take_profit;

const int op::withdrawal_notification;

const int op::add_library;
const int op::remove_library;

const int gas::send_tokens;
const int gas::receive_tokens;
const int gas::deposit_coins;
const int gas::proxy_save_coins;
const int gas::save_coins;
const int gas::mint_bill;
const int gas::assign_bill;
const int gas::burn_bill;
const int gas::bill_burned;
const int gas::mint_tokens;
const int gas::proxy_tokens_minted;
const int gas::tokens_minted;
const int gas::unstake_tokens;
const int gas::proxy_reserve_tokens;
const int gas::reserve_tokens;
const int gas::burn_tokens;
const int gas::proxy_tokens_burned;
const int gas::tokens_burned;
const int gas::send_unstake_all;
const int gas::proxy_unstake_all;
const int gas::unstake_all;
const int gas::upgrade_wallet;
const int gas::proxy_migrate_wallet;
const int gas::migrate_wallet;
const int gas::proxy_merge_wallet;
const int gas::merge_wallet;

const int gas::request_loan;
const int gas::participate_in_election;
const int gas::decide_loan_requests;
const int gas::process_loan_requests;
const int gas::proxy_new_stake;
const int gas::vset_changed;
const int gas::finish_participation;
const int gas::recover_stakes;
const int gas::proxy_recover_stake;
const int gas::recover_stake_result;
const int gas::burn_all;
const int gas::last_bill_burned;
const int gas::new_stake;
const int gas::new_stake_error;
const int gas::new_stake_ok;
const int gas::recover_stake;
const int gas::recover_stake_ok;

const int fee::treasury_storage;
const int fee::librarian_storage;
const int fee::new_stake_confirmation;

const int log::loan;
const int log::repayment;
const int log::finish;
const int log::failed_burning_tokens;

const int config::elector_address;
const int config::election;
const int config::validators;
const int config::stake;
const int config::previous_validators;
const int config::current_validators;
const int config::next_validators;
const int config::misbehaviour_punishment;

const int send::regular;
const int send::pay_gas_separately;
const int send::ignore_errors;
const int send::bounce_if_failed;
const int send::destroy_if_zero;
const int send::remaining_value;
const int send::unreserved_balance;

const int reserve::exact;
const int reserve::all_but_amount;
const int reserve::at_most;
const int reserve::add_original_balance;
const int reserve::negate;
const int reserve::bounce_if_failed;

const int chain::main;
const int chain::base;

const int gas_limit;
```

## cb1cdae5c512e6b1ca17d1b14514d20ec9dc91e6ba0591cd28a3eb071627f628/imports/stdlib.fc

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

;;; Returns the code of the current smart contract.
cell my_code();

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance();

;;; Returns the incoming value to the smart contract as a tuple consisting of an int
;;; (value in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the incoming value of "extra currencies").
[int, cell] get_incoming_value();

;;; Returns value in nanotoncoins of storage phase fees.
int get_storage_fees();

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

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Returns gas consumed by VM so far (including this instruction).
int gas_consumed();

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

;;; Checking that `slice` [s] is a addr_none constuction;

int get_storage_fee(int cells, int bits, int seconds, int is_mc?);
int get_compute_fee(int gas_used, int is_mc?);
int get_forward_fee(int cells, int bits, int is_mc?);
int get_original_fwd_fee(int fwd_fee, int is_mc?);
```

## cb1cdae5c512e6b1ca17d1b14514d20ec9dc91e6ba0591cd28a3eb071627f628/imports/utils.fc

```fc
#include "stdlib.fc";
#include "constants.fc";

builder to_builder(slice s) inline;

builder store_state_init(builder b, builder state_init) inline;

builder store_body(builder b, builder body) inline;

builder store_log(builder b, builder log) inline;

() send_msg(int bounceable?, builder dst, builder state_init, builder body, int coins, int mode) impure inline_ref;
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
, int min_payment
, int borrower_reward_share
, int loan_amount
, int accrue_amount
, int stake_amount
, builder borrower
) impure inline {
    emit_log(log::loan, log);

() log_repayment
( int round_since
, int repayment_amount
, int loan_amount
, int accrue_amount
, int stakers_share
, int governor_share
, int borrower_share
, slice borrower
) impure inline {
    emit_log(log::repayment, log);

() log_finish(int round_since, int total_staked, int total_recovered, int total_coins, int total_tokens) impure inline;

() log_failed_burning_tokens
( int round_since
, int total_coins
, int total_tokens
, int coins
, int tokens
, slice owner
) impure inline {
    emit_log(log::failed_burning_tokens, log);

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

(int, int) get_vset_times(int i) inline_ref;
    ;; validators_ext#12 utime_since:uint32 utime_until:uint32
    ;;   total:(## 16) main:(## 16) { main <= total } { main >= 1 }
    ;;   total_weight:uint64 list:(HashmapE 16 ValidatorDescr) = ValidatorSet;

builder create_state_init(cell code, cell data) inline;
    ;; _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
    ;;   code:(Maybe ^Cell) data:(Maybe ^Cell)
    ;;   library:(HashmapE 256 SimpleLib) = StateInit;

builder create_address(int wc, int addr) inline_ref;
    ;; addr_std$10 anycast:(Maybe Anycast)
    ;;   workchain_id:int8 address:bits256  = MsgAddressInt;

cell create_collection_data(slice treasury, int round_since, cell bill_code) inline;

cell create_bill_data(int index, slice collection) inline;

cell create_wallet_data(builder owner, slice parent) inline;

cell create_loan_data(slice treasury, builder borrower, int round_since) inline;

(builder, builder, int) create_collection_address(slice treasury, int round_since, cell bill_code, cell code) inline_ref;

(builder, builder, int) create_bill_address(int index, slice collection, cell bill_code) inline_ref;

(builder, builder, int) create_wallet_address(builder owner, slice parent, cell wallet_code) inline_ref;

(builder, builder, int) create_loan_address(slice treasury, builder borrower, int round_since, cell loan_code) inline_ref;

builder chars_to_string(tuple chars) inline;

builder int_to_string(int n) inline;

builder int_to_ton(int n) inline;

int request_sort_key(int min_payment, int borrower_reward_share, int loan_amount) inline_ref;
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

int parent_storage_fee() inline_ref;

int wallet_storage_fee() inline_ref;

int collection_storage_fee() inline_ref;

int bill_storage_fee() inline_ref;

(int, int) loan_storage_fee() inline_ref;
    ;; 1 round validation, 1 round participation and stake held, 1 round for prolonged rounds, 1 round to be safe

    ;; loan smart contract storage on main chain while validating

int send_tokens_fee();

(int, int) deposit_coins_fee(int ownership_assigned_amount);

int unstake_tokens_fee();

int unstake_all_fee();

(int, int, int) request_loan_fee();

int burn_all_fee();

int last_bill_burned_fee();

int burn_bill_fee();

int upgrade_wallet_fee();

int merge_wallet_fee();

int max_gas_fee();
```

## cb1cdae5c512e6b1ca17d1b14514d20ec9dc91e6ba0591cd28a3eb071627f628/librarian.fc

```fc
#include "imports/utils.fc";

global slice treasury;;

() set_lib_code(cell code, int mode) impure asm "SETLIBCODE";
() change_lib(int code_hash, int mode) impure asm "CHANGELIB";

() load_data() impure inline;

() add_library(slice src, slice s) impure inline;

() remove_library(slice src, slice s) impure inline;

() withdraw_surplus(slice src, slice s) impure inline;

() route_internal_message(int flags, slice src, slice s) impure inline;

() recv_internal(cell in_msg_full, slice s) impure;
```

## cb98a1f42ebea2ad491e518038e01bc8a73927c762cd55db7f9c29c611d04140/nft-offer-v1r2.fc

```fc
;; NFT offer contract v1r2
;; mark outgoing transactions Marketplace fee,Royalty,Profit

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

## cb98a1f42ebea2ad491e518038e01bc8a73927c762cd55db7f9c29c611d04140/op-codes.fc

```fc
;; NFTEditable

;; SBT
```

## cb98a1f42ebea2ad491e518038e01bc8a73927c762cd55db7f9c29c611d04140/stdlib.fc

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

## cc0d39589eb2c0cfe0fde28456657a3bdd3d953955ae3f98f25664ab3c904fbd/single-nominator-code.fc

```fc
;; https://github.com/orbs-network/single-nominator/blob/main/contracts/single-nominator.fc
;; this contract is very similar to https://github.com/ton-blockchain/nominator-pool but much simpler since it only supports a single nominator
;; frankly speaking, we tried using nominator-pool but it's so complicated that we couldn't be sure there were no bugs hiding around
;; this contract is very simple and easy to review, it is laser focused on protecting your stake and nothing else!

;; =============== consts =============================

const BOUNCEABLE;
const ADDRESS_SIZE;
const MIN_TON_FOR_STORAGE;
const MIN_TON_FOR_SEND_MSG;

;; owner ops
const OP::WITHDRAW;
const OP::CHANGE_VALIDATOR_ADDRESS;
const OP::SEND_RAW_MSG;
const OP::UPGRADE;

;; elector ops
const OP::NEW_STAKE;
const OP::RECOVER_STAKE;

;; modes
const MODE::SEND_MODE_REMAINING_AMOUNT;

;; errors
const ERROR::WRONG_NOMINATOR_WC;
const ERROR::WRONG_QUERY_ID;
const ERROR::WRONG_SET_CODE;
const ERROR::WRONG_VALIDATOR_WC;
const ERROR::INSUFFICIENT_BALANCE;
const ERROR::INSUFFICIENT_ELECTOR_FEE;

;; =============== storage =============================

;; storage#_ owner_address:MsgAddressInt validator_address:MsgAddressInt = Storage

(slice, slice) load_data() inline;

() save_data(slice owner_address, slice validator_address) impure inline;

;; =============== messages =============================

;; defined below
() send_msg(slice to_address, int amount, cell payload, int flags, int send_mode) impure inline_ref;
slice make_address(int wc, int addr) inline_ref;
slice elector_address() inline_ref;
int check_new_stake_msg(slice cs) impure inline_ref;

;; main entry point for receiving messages
;; my_balance contains balance after adding msg_value
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

		;; ignore all bounced messages

	;; if just a message with comment "w" - means withdraw
		;; in few lines, amount to withdraw is loaded from in_msg_body,
		;; so we set it to the maximum avaliable balance

	;; owner role - cold wallet (private key that is not connected to the internet) that owns the funds used for staking and acts as the single nominator

		;; allow owner to withdraw funds - take the money home and stop validating with it

		;; mainly used when the validator was compromised to prevent validator from entering new election cycles

		;; emergency safeguard to allow owner to send arbitrary messages as the nominator contract

		;; second emergency safeguard to allow owner to replace nominator logic - you should never need to use this

	;; validator role - the wallet whose private key is on the validator node (can sign blocks but can't steal the funds used for stake)

		;; send stake to the elector for the next validation cycle (sent every period ~18 hours)

		;; recover stake from elector of previous validation cycle (sent every period ~18 hours)

;; taken from nominator-pool: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L217
() send_msg(slice to_address, int amount, cell payload, int flags, int send_mode) impure inline_ref;

;; taken from nominator-pool: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L68
slice make_address(int wc, int addr) inline_ref;

;; taken from nominator-pool: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L78
slice elector_address() inline_ref;

;; taken from nominator-pool: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L139
;; check the validity of the new_stake message
;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L208
int check_new_stake_msg(slice cs) impure inline_ref;

;; =============== getters =============================

(slice, slice) get_roles() method_id;

;; nominator-pool interface with mytonctrl: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L198
;; since we are relying on the existing interface between mytonctrl and nominator-pool, we return values that instruct mytonctrl
;; to recover stake on every cycle, although mytonctrl samples every 10 minutes we assume its current behavior that new_stake
;; and recover_stake are only sent once per cycle and don't waste gas
(int, int, int, int, (int, int, int, int, int), cell, cell, int, int, int, int, int, cell) get_pool_data() method_id {
	);
```

## cc0d39589eb2c0cfe0fde28456657a3bdd3d953955ae3f98f25664ab3c904fbd/stdlib.fc

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

## ce5a78534eaaa6ceed8dafd486d076eb60a9b0d6dbfb53676f662649c0689956/imports/stdlib.fc

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

## ce5a78534eaaa6ceed8dafd486d076eb60a9b0d6dbfb53676f662649c0689956/nft-auction-v4r1.func

```func
#include "./stdlib.fc";
#include "op-codes.fc";

;; auction for jettons/tons
;; see https://github.com/getgems-io/nft-contracts

;;
;;  custom TVM exit codes
;;

const int op::finish_acution;
const int op::cancel_acution;
const int op::set_jetton_wallet;
const int op::process_ton_bid;
const int op::deploy_auction;

const int TON_FOR_NFT_PROCESS;
const int TON_FOR_JETTON;
const int TON_FOR_END_JETTON_AUC;
const int TON_FOR_END_TON_AUC;

forall X -> int cast_to_int(X x);
slice null_addr();
int get_compute_fee(int workchain, int gas_used);

;;
;;  persistant and runtime storage description
;;

global int      init?; ;; init_data safe check;
global int      end?; ;; end auction or not;
global slice    mp_addr; ;; the address of the marketplace from which the contract is deployed;
global int      activated?; ;; contract is activated by external message or by nft transfer;
global int      created_at?; ;; timestamp of created acution;
global int      is_canceled?; ;; auction was cancelled by owner;

global cell fees_cell;;
global cell constant_cell;;

global int      is_jetton_mode; ;;;
global slice    jetton_wallet; ;; jetton wallet address or null;
global slice    jetton_master; ;; jetton master address or null for detect jettons;
global int      min_bid; ;; minimal bid;
global int      max_bid; ;; maximum bid;
global int      min_step; ;; minimum step (can be 0);
global slice    last_member; ;; last member address;
global int      last_bid; ;; last bid amount;
global int      last_bid_at; ;; timestamp of last bid;
global int      last_query_id; ;; last processed query id;
global int      end_time; ;; unix end time;
global int      step_time; ;; by how much the time increases with the new bid (e.g. 30);
global int      public_key; ;; public key for jetton mode;
global int      is_broken_state; ;; broken state;
global cell     jt_cell;;

;; nft info cell (ref)
global slice    nft_owner; ;; nft owner addres (should be sent nft if auction canceled or money from auction);
global slice    nft_addr; ;; nft address;

;;
;;  math utils
;;
return muldiv(a, percent, factor);

() send_jettons(slice jetton_wallet_address, int query_id, slice address, int amount, slice response_address, int fwd_amount) impure inline_ref;

() pack_data() impure inline_ref;

() init_data() impure inline_ref {- save for get methods -} {
    ifnot (null?(init?)) {

    ;; total 267+127+127+7+17+267+32=844

(slice, slice, int, int, int, int) get_fees_addresses() inline_ref;

{-
    SHOULD
    [+] check init auction or not
    [+] check op
    [+] change nft owner
    [+] change auction status
-}
() handle::try_init_auction(slice sender_addr, slice in_msg_body) impure inline_ref {
    pack_data();

() return_nft(int query_id, slice fee_pay_address, slice new_owner) impure inline_ref;

() handle::cancel(int query_id, slice sender_addr) impure inline_ref {
    return_nft(query_id, sender_addr, nft_owner);
    pack_data();

() send_founds(slice to_address, int amonut, int query_id, slice fee_pay_address) impure inline_ref;

int get_price_for_end_auction() inline;

() check_ok_balance(int my_balance) impure inline;

() handle::end_auction(slice sender_addr, int from_external, int query_id) impure inline_ref {
        ;; just return nft

            check_ok_balance(my_balance);

        handle::cancel(query_id, sender_addr);

        mp_fee_addr,
        royalty_fee_addr,
        mp_fee_factor,
        mp_fee_base,
        royalty_fee_factor,
        royalty_fee_base

            check_ok_balance(profit);
            check_ok_balance(my_balance);

        send_founds(mp_fee_addr, mp_fee, query_id, sender_addr);

        send_founds(royalty_fee_addr, royalty_fee, query_id, sender_addr);

        send_founds(nft_owner, profit, query_id, sender_addr);

    return_nft(query_id, sender_addr, last_member);
    pack_data();

;;
;;  main code
;;

() return_last_bid(int query_id, slice fee_pay_address, int my_balance) impure inline_ref;
            ;; - 0.01 TON

int get_next_min_bid();

() process_new_bid(int query_id, slice sender_addr, int bid_value, int ton_value, int my_balance) impure inline_ref;

    ;; auction large than 20 days not allowed

    ;; max bid buy nft

    ;; prevent bid at last second

() recv_internal(int my_balance, int msg_value, cell in_msg_cell, slice in_msg_body) impure;

        ;; way to fix unexpected troubles with auction contract
        ;; for example if some one transfer nft to this contract

        ;; cancel command, return nft if no bid yet

        ;; stop auction

        ;; just accept coins

        ;; check than update from expected address

    ;; bid process

        ;; check workchain

        ;; load amount

() recv_external(slice in_msg) impure;

(int, int, int, slice, slice, slice, int, slice, int, slice, int, int, slice, int, int, int, int, int, int, int, int, int, slice, slice, int, int) get_auction_data_v4() method_id;
```

## ce5a78534eaaa6ceed8dafd486d076eb60a9b0d6dbfb53676f662649c0689956/op-codes.fc

```fc
;; NFTEditable

;; SBT
```

## d120fb2e37da0910ecd925a2e9eccaef60b72f9d06b7c89de08d4f743b163092/imports/constants.fc

```fc
;; operations (constant values taken from crc32 on op message in the companion .tlb files and appear during build)

;; errors

;; other

;; 6905(computational_gas_price) * 1000(cur_gas_price) = 6905000
;; ceil(6905000) = 10000000 ~= 0.01 TON
```

## d120fb2e37da0910ecd925a2e9eccaef60b72f9d06b7c89de08d4f743b163092/imports/jetton-utils.fc

```fc
cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int status) inline;

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

slice calculate_jetton_wallet_address(cell state_init) inline;

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
```

## d120fb2e37da0910ecd925a2e9eccaef60b72f9d06b7c89de08d4f743b163092/imports/op-codes.fc

```fc
;; Minter
```

## d120fb2e37da0910ecd925a2e9eccaef60b72f9d06b7c89de08d4f743b163092/imports/stdlib.fc

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

## d120fb2e37da0910ecd925a2e9eccaef60b72f9d06b7c89de08d4f743b163092/imports/utils.fc

```fc
() send_grams(slice address, int amount) impure;
```

## d120fb2e37da0910ecd925a2e9eccaef60b72f9d06b7c89de08d4f743b163092/jetton-wallet.fc

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

## d120fb2e37da0910ecd925a2e9eccaef60b72f9d06b7c89de08d4f743b163092/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;
```

## d2dc742a46e923f60fd07923286017bcd6a8fbad445b2d6545b475f852e3310c/multisig-code.fc

```fc
;; Simple wallet smart contract

(int, int) get_bridge_config() impure inline_ref;
  ;; wc always equals to -1

_ unpack_state() inline_ref;

_ pack_state(cell pending_queries, cell owner_infos, int last_cleaned, int k, int n, int wallet_id, int spend_delay) inline_ref;

_ pack_owner_info(int public_key, int flood) inline_ref;

_ unpack_owner_info(slice cs) inline_ref;

(int, int) check_signatures(cell public_keys, cell signatures, int hash, int cnt_bits) inline_ref;

(int, cell, int, int) parse_msg(slice in_msg) inline_ref;

() check_proposed_query(slice in_msg) impure inline;

(int, int, int, slice) unpack_query_data(slice in_msg, int n, slice query, var found?, int root_i) inline_ref;

(cell, ()) dec_flood(cell owner_infos, int creator_i) {

() try_init() impure inline_ref;
  ;; first query without signatures is always accepted

() recv_external();

(cell, cell) update_pending_queries(cell pending_queries, cell owner_infos, slice msg, int query_id, int creator_i, int cnt, int cnt_bits, int n, int k) impure inline_ref;

(int, int) calc_boc_size(int cells, int bits, slice root);

() recv_internal(cell in_msg_cell, slice in_msg) impure;
  ;; empty message triggers init

  ;; Check root signature

;; Get methods
;; returns -1 for processed queries, 0 for unprocessed, 1 for unknown (forgotten)
(int, int) get_query_state(int query_id) method_id;

cell create_init_state(int wallet_id, int n, int k, cell owners_info, int spend_delay) method_id;

cell merge_list(cell a, cell b);

  ;; as~skip_bits(1);

cell get_public_keys() method_id;

(int, int) check_query_signatures(cell query) method_id;

cell messages_by_mask(int mask) method_id;

cell get_messages_unsigned_by_id(int id) method_id;

cell get_messages_unsigned() method_id;

(int, int) get_n_k() method_id;

cell merge_inner_queries(cell a, cell b) method_id;

int get_lock_timeout() method_id;
```

## d2dc742a46e923f60fd07923286017bcd6a8fbad445b2d6545b475f852e3310c/stdlib.fc

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

## d2e7f38a1bd31ae4a90419c6f2722d50c918cd7d2cd2676c2f6928a49805b56d/contract/contracts/JettonsTokens/messages.tact

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
```

## d2e7f38a1bd31ae4a90419c6f2722d50c918cd7d2cd2676c2f6928a49805b56d/contract/sources/contract.tact

```tact
import "./jetton";

message Mint {
    amount: Int;
    receiver: Address;
}

contract SampleJetton with Jetton {
    total_supply: Int as coins;
    owner: Address;
    content: Cell;
    mintable: Bool;
    max_supply: Int as coins;
    init(owner: Address, content: Cell, max_supply: Int);
    receive(msg: Mint);
    require(ctx.sender == self.owner, "Not owner");;
    require(self.mintable, "Not mintable");;
    require(self.total_supply + msg.amount <= self.max_supply, "Max supply exceeded");;
    receive("Mint: 100");
    require(self.mintable, "Not mintable");;
    require(self.total_supply + 100 <= self.max_supply, "Max supply exceeded");;
    receive("Owner: MintClose");
    require(ctx.sender == self.owner, "Not owner");;
}
```

## d2e7f38a1bd31ae4a90419c6f2722d50c918cd7d2cd2676c2f6928a49805b56d/contract/sources/jetton.tact

```tact
import "@stdlib/ownable";
import "./messages";

// ============================================================================================================ //
@interface("org.ton.jetton.master")
trait Jetton with Ownable {

total_supply: Int;
mintable: Bool;
owner: Address;
content: Cell;  // metadata

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
    require(contractAddress(sinit) == ctx.sender, "Invalid sender!");;
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

## d3624ca5def8b5d8fb3b929f6554a37f989e06b873fd49442cea94a3bd671940/contracts/imports/stdlib_modern.fc

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

## d3624ca5def8b5d8fb3b929f6554a37f989e06b873fd49442cea94a3bd671940/contracts/workchain.fc

```fc
#include "stdlib.fc";
#include "op-codes.fc";

const MY_WORKCHAIN;

int is_same_workchain(slice addr) inline;

() check_same_workchain(slice addr) impure inline;
```

## d3624ca5def8b5d8fb3b929f6554a37f989e06b873fd49442cea94a3bd671940/src/token/gas.fc

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

    ;; ~strdump("total required gas");
    ;; ~dump(totalRequiredGas);
    ;; ~strdump("msg value");
    ;; ~dump(msg_value);

() check_amount_is_enough_to_burn(int msg_value) impure inline;
```

## d3624ca5def8b5d8fb3b929f6554a37f989e06b873fd49442cea94a3bd671940/src/token/jetton-utils.fc

```fc
#include "workchain.fc";

const int STATUS_SIZE;
const int LT_SIZE;

) inline {
    return 
        begin_cell()

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

## d3624ca5def8b5d8fb3b929f6554a37f989e06b873fd49442cea94a3bd671940/src/token/op-codes.fc

```fc
;; common

const op::transfer;
const op::transfer_timelocked;
const op::transfer_notification;
const op::internal_transfer;
const op::internal_transfer_timelocked;
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
const error::not_minter;
const error::wrong_workchain;
const error::timelock_not_passed;

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

## d3624ca5def8b5d8fb3b929f6554a37f989e06b873fd49442cea94a3bd671940/src/token/tsusde-wallet.fc

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
