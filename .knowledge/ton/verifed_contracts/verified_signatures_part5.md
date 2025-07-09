            balance:Coins owner_address:MsgAddressInt
            jetton_master_address:MsgAddressInt = Storage;
-}

(int, int, slice, slice, int, int) load_data() inline;

() save_data(
) impure inline {
    set_data(
        pack_jetton_wallet_data(
            status, balance, owner_address, jetton_master_address, timelocked_balance, timelock_limit
    );

;; this function basically makes sure that we have the correct "header"
;; when we're sending stuff to the minter contract
;; depending on whether we're doing redeem step 1 or redeem step 2
slice redeem_forward_payload(slice either_forward_payload, int step_flag) inline;

() send_jettons(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure inline_ref;
    ;; see transfer TL-B layout in jetton.tlb

    ;; see internal TL-B layout in jetton.tlb

        ;; Default Jetton behavior
        ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733
        ;; Transfer tokens to master

() send_timelocked_jettons(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure inline_ref;
    ;; see transfer TL-B layout in jetton.tlb

    ;; this message had to have come from either the owner or the minter
    ;; can only send timelocked if the limit has passed
    ;; can only send timelocked to master

    ;; see internal TL-B layout in jetton.tlb

    ;; Transfer tokens to master

() receive_jettons(slice in_msg_body, slice sender_address, int my_ton_balance, int msg_value) impure inline_ref;
    ;; see internal TL-B layout in jetton.tlb

        ;; see transfer_notification TL-B layout in jetton.tlb

        ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733

        ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733

() receive_timelocked_jettons(slice in_msg_body, slice sender_address, int my_ton_balance, int msg_value) impure inline_ref;
    ;; see internal TL-B layout in jetton.tlb

    ;; timelocked transfer must come from master

    ;; disabling transfer notification for now, will bring it back if necessary
    ;; int forward_ton_amount = in_msg_body~load_coins();

        ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733

() burn_jettons(slice in_msg_body, slice sender_address, int msg_value) impure inline_ref;

    ;; see burn_notification TL-B layout in jetton.tlb

    ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733

() on_bounce(slice in_msg_body) impure inline;

() recv_internal(int my_ton_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

    ;; outgoing transfer

    ;; sending timelocked jettons to master

    ;; incoming transfer

    ;; receiveing timelocked jettons from master

    ;; burn

(int, slice, slice, cell) get_wallet_data() method_id;

int get_status() method_id;

(int, int) get_timelock_data() method_id;
```

## d3d14da9a627f0ec3533341829762af92b9540b21bf03665fac09c2b46eabbac/auto/order_code.func

```func
;; https://docs.ton.org/tvm.pdf, page 30
;; Library reference cell — Always has level 0, and contains 8+256 data bits, including its 8-bit type integer 2 
;; and the representation hash Hash(c) of the library cell being referred to. When loaded, a library
;; reference cell may be transparently replaced by the cell it refers to, if found in the current library context.

cell order_code();
```

## d3d14da9a627f0ec3533341829762af92b9540b21bf03665fac09c2b46eabbac/errors.func

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

## d3d14da9a627f0ec3533341829762af92b9540b21bf03665fac09c2b46eabbac/imports/stdlib.fc

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

## d3d14da9a627f0ec3533341829762af92b9540b21bf03665fac09c2b46eabbac/messages.func

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

## d3d14da9a627f0ec3533341829762af92b9540b21bf03665fac09c2b46eabbac/multisig.func

```func
#include "imports/stdlib.fc";
#include "types.func";
#include "op-codes.func";
#include "errors.func";
#include "messages.func";
#include "order_helpers.func";

int validate_dictionary_sequence(cell dict) impure inline;

    accept_message();

                validate_dictionary_sequence(proposers);

(int, int, cell, int, cell, int) load_data() inline;

() save_data(int next_order_seqno, int threshold, cell signers, int signers_num, cell proposers, int allow_arbitrary_order_seqno) impure inline;

() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body);

        ;; check that sender is order smart-contract and check that it has recent
        ;; signers dict

        ;; we always trust ourselves, this feature is used to make chains of executions
        ;; where last action of previous execution triggers new one.

(int, int, cell, cell) get_multisig_data() method_id;

int get_order_estimate(cell order, int expiration_date) method_id;

slice get_order_address(int order_seqno) method_id;
```

## d3d14da9a627f0ec3533341829762af92b9540b21bf03665fac09c2b46eabbac/op-codes.func

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

## d3d14da9a627f0ec3533341829762af92b9540b21bf03665fac09c2b46eabbac/order_helpers.func

```func
#include "imports/stdlib.fc";
#include "types.func";
#include "auto/order_code.func";

cell pack_order_init_data(slice multisig_address, int order_seqno) inline;

cell calculate_order_state_init(slice multisig_address, int order_seqno) inline;
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L144
    _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
    code:(Maybe ^Cell) data:(Maybe ^Cell)
    library:(Maybe ^Cell) = StateInit;
  -}

slice calculate_address_by_state_init(int workchain, cell state_init) inline;
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L105
    addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;
    -}

;;; @see /description.md "How is it calculated"

const int MULTISIG_INIT_ORDER_GAS;
const int ORDER_INIT_GAS;
const int ORDER_EXECUTE_GAS;
const int MULTISIG_EXECUTE_GAS;
;; we call number of bits/cells without order bits/cells as "overhead"
const int INIT_ORDER_BIT_OVERHEAD;
const int INIT_ORDER_CELL_OVERHEAD;
const int ORDER_STATE_BIT_OVERHEAD;
const int ORDER_STATE_CELL_OVERHEAD;
const int EXECUTE_ORDER_BIT_OVERHEAD;
const int EXECUTE_ORDER_CELL_OVERHEAD;

int calculate_order_processing_cost(cell order_body, cell signers, int duration) inline;
    {- There are following costs:
       1) Gas cost on Multisig contract
       2) Forward cost for Multisig->Order message
       3) Gas cost on Order initialisation
       4) Storage cost on Order
       5) Gas cost on Order finalization
       6) Forward cost for Order->Multisig message
       7) Gas cost on Multisig till accept_message
    -}

    ;; compute_data_size is unpredictable in gas, so we need to measure gas prior to it and after
    ;; and add difference to MULTISIG_INIT_ORDER_GAS
```

## d3d14da9a627f0ec3533341829762af92b9540b21bf03665fac09c2b46eabbac/types.func

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

## d4902fcc9fad74698fa8e353220a68da0dcf72e32bcb2eb9ee04217c17d3062c/wallet_v1_r2.fif

```fif
#!/usr/bin/fift -s
"TonUtil.fif" include
"Asm.fif" include
<{ SETCP0 DUP IFNOTRET // return if recv_internal
   DUP 85143 INT EQUAL IFJMP:<{ // "seqno" get-method
     DROP c4 PUSHCTR CTOS 32 PLDU  // cnt
   }>
   INC 32 THROWIF  // fail unless recv_external
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
     // 3 INT 35 LSHIFT# 3 INT RAWRESERVE    // reserve all but 103 Grams from the balance
     8 LDU LDREF         // pubk cnt mode msg cs
     s0 s2 XCHG SENDRAWMSG  // pubk cnt cs ; ( message sent )
   }>
   ENDS
   INC NEWC 32 STU 256 STU ENDC c4 POPCTR
}>c
```

## d512ae8d795c61d19ba99c145cc801f9ad06de428f7529d5bc8805281e70f429/nft-item.fc

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

## d512ae8d795c61d19ba99c145cc801f9ad06de428f7529d5bc8805281e70f429/op-codes.fc

```fc
;; NFTEditable
```

## d512ae8d795c61d19ba99c145cc801f9ad06de428f7529d5bc8805281e70f429/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;
```

## d512ae8d795c61d19ba99c145cc801f9ad06de428f7529d5bc8805281e70f429/stdlib.fc

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

## d512ae8d795c61d19ba99c145cc801f9ad06de428f7529d5bc8805281e70f429/utils.fc

```fc
builder store_uint_as_dec_string (builder b, int x);
  "WHILE:<{"
  "}>DO<{"                                                      ;; b i x
    "10 PUSHINT" "DIVMOD"                                       ;; b i x r
    "48 ADDCONST"                                               ;; b i x r
    "s0 s3 XCHG"                                                   ;; r i x b
    "s0 s2 XCHG"                                                   ;; r b x i
    "INC"                                                       ;; r b x i
    "SWAP"                                                      ;; r b i x
    "DUP" "0 NEQINT"                                            ;; r b i x f
  "}>"
  "DROP"                          
  "REPEAT:<{" 
  "}>"  

  throw(502);

      dump_stack();

  throw(502);
```

## d8cf747a559f107b8ff6e7f6b0331684c9e8964cb2fbcef4ba87ed3728a24d2a/contract/contracts/contract.tact

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

## d8cf747a559f107b8ff6e7f6b0331684c9e8964cb2fbcef4ba87ed3728a24d2a/contract/contracts/jetton.tact

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

## d8cf747a559f107b8ff6e7f6b0331684c9e8964cb2fbcef4ba87ed3728a24d2a/contract/contracts/messages.tact

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

## da895ae71bca1a1f8f31e7f13e4b0de581e90e3ca51cb09251bacdf60b633f78/contract/contracts/jetton.tact

```tact
import "@stdlib/ownable";
import "./messages";

@interface("org.ton.jetton.master")
trait Jetton with Ownable {

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

## da895ae71bca1a1f8f31e7f13e4b0de581e90e3ca51cb09251bacdf60b633f78/contract/contracts/king_kong_pixel.tact

```tact
import "./jetton";

message Mint {
    amount: Int;
    receiver: Address;
}

contract KingKongPixel with Jetton {
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

## da895ae71bca1a1f8f31e7f13e4b0de581e90e3ca51cb09251bacdf60b633f78/contract/contracts/messages.tact

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
```

## dd3ce98db487c7585803933bffba7a57eb4e663099059d08b83db0b4ce060793/asserts.func

```func
#include "errors.func";

() assert_sender!(slice sender, slice required_address) impure inline {

global int state;;
global int halted?;;
const int state::HALTED;

() assert_not_halted!() impure inline {

() assert_state!(int expected) impure inline {
() assert_1of2_state!(int expected1, int expected2) impure inline {
```

## dd3ce98db487c7585803933bffba7a57eb4e663099059d08b83db0b4ce060793/contracts/auto/git-hash.func

```func
const int git_hash;
```

## dd3ce98db487c7585803933bffba7a57eb4e663099059d08b83db0b4ce060793/contracts/controller.func

```func
;; The validator has his own wallet on which he holds his own coins for operating.
;; From this wallet (s)he sends commands to this validator-controller (mostly `new_stake`, `update_validator_set` and `recover_stake`).
;; validator-controller contract must be in masterchain.
;; The validator in most cases have two validator-controllers (for even and odd validation rounds).

{-
 TODO:
   1) move config_param(1) to constants
   2) elector_address() can be optimized
-}

#include "stdlib.func";
#include "types.func";
#include "op-codes.func";
#include "messages.func";
#include "errors.func";
#include "asserts.func";
#include "network_config_utils.func";
#include "sudoer_requests.func";
#include "governor_requests.func";
#include "halter_requests.func";

const int ONE_TON;
const int ELECTOR_OPERATION_VALUE;
const int MIN_REQUEST_LOAN_VALUE;
const int MIN_TONS_FOR_STORAGE;
const int DEPOSIT_FEE;
const int WITHDRAWAL_FEE;
const int MIN_STAKE_TO_SEND;

;; Time in seconds for validator to make mandatory actions, such as
;; recover stake or update hash
const int GRACE_PERIOD;
;; Fines for validator for overdue actions
const int HASH_UPDATE_FINE;
const int STAKE_RECOVER_FINE;

;; Whole storage is put to global variables

global int state;;
global int halted?;;
global int approved?;;

global int stake_amount_sent;;
global int stake_at;;

global int saved_validator_set_hash;;
global int validator_set_changes_count;;
global int validator_set_change_time;;
global int stake_held_for;;

global int borrowed_amount;;
global int borrowing_time;;

global slice sudoer;;
global int sudoer_set_at;;

global int max_expected_interest;;

global slice static_data;;
global int controller_id;;
global slice validator;;
global slice pool;;
global slice governor;;
global slice halter;;
global slice approver;;

const int state::REST;
const int state::SENT_BORROWING_REQUEST;
const int state::SENT_STAKE_REQUEST;
const int state::FUNDS_STAKEN;
const int state::SENT_RECOVER_REQUEST;
const int state::INSOLVENT;

() save_data() impure;
() load_data() impure;

slice elector_address();
int is_elector_address(slice address);
;;int max_recommended_punishment_for_validator_misbehaviour(int stake);
;;(int, int, int) get_validator_config();
;;int get_stake_held_for();
;;int get_elections_start_before();
;;(int, int, cell) get_current_validator_set();
int check_new_stake_msg(slice cs);

() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

                ;; `new_stake` from nominator-pool should always be handled without throws by elector
                ;; because nominator-pool do `check_new_stake_msg` and `msg_value` checks before sending `new_stake`.
                ;; If the stake is not accepted elector will send `new_stake_error` response message.
                ;; Nevertheless we do process theoretically possible bounced `new_stake`.

                ;; Note, this request will be processed even in halted state
                    ;; The only case when we get elector::recover_stake_error is credits = 0
                    ;; in this case we should not return state to FUNDS_STAKEN to avoid
                    ;; further balance depletion due to repetitive STAKE_RECOVER_FINE

                    ;; update saved_validator_set_hash in case it have changed
                    ;; while new_stake message reached the elector

            ;; else just accept coins from elector

                    ;; we add WITHDRAWAL_FEE below to ensure there is enough money to process
                    ;; and send bounty in return_unused_loan
                ;; borrowed_amount includes interest
                ;; actions above considered safe or critical enough to be processed in halted regime
                ;; actions below are only allowed for not halted controller
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

                    ;; elector set 'stake_held_for' during election conduction
                    ;; we save it when sending stake and after first round change and chose max
                    ;; it's ok unless 'stake_held_for' will change twice: first one after sending stake
                    ;; but before election conduction and second one after election but prior update_hash

                      ;; it is allowed to use credit funds only in the same round when they were obtained

                  ;; For simplicity forbid multiple borrowing
                  ;; TODO

                  ;; lets check whether we can afford it

() save_data() impure inline_ref;

() load_data() impure inline_ref;

slice make_address(int wc, int addr) inline_ref;

slice elector_address() inline_ref;

;; https://github.com/ton-blockchain/ton/blob/ae5c0720143e231c32c3d2034cfe4e533a16d969/crypto/block/block.tlb#L584
int is_elector_address(slice address) inline_ref;

;; check the validity of the new_stake message
;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L208
int check_new_stake_msg(slice cs) impure inline_ref;

;; Get methods

_ get_validator_controller_data() method_id;

int get_max_punishment(int stake) method_id;

int get_max_stake_value() method_id;
    ;; we add ELECTOR_OPERATION_VALUE to ensure room for storage fees and so on
        ;; it is allowed to use credit funds only in the same round when they were obtained
    ;; currently we skip checks related to max_recommended_punishment_for_validator_misbehaviour

(int, int) required_balance_for_loan(int credit, int interest) method_id;

(int, int) request_window_time() method_id;
    ;; get time window (since, until) when controller may request loan
```

## dd3ce98db487c7585803933bffba7a57eb4e663099059d08b83db0b4ce060793/contracts/payout_nft/stdlib.func

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

## dd3ce98db487c7585803933bffba7a57eb4e663099059d08b83db0b4ce060793/contracts/versioning.func

```func
#include "auto/git-hash.func";

int get_code_version() method_id;
```

## dd3ce98db487c7585803933bffba7a57eb4e663099059d08b83db0b4ce060793/errors.func

```func
const int error::unknown_op;

const int error::wrong_sender;
const int error::wrong_state;
const int error::halted;

const int sudoer::quarantine;
const int error::governor_update_too_soon;
const int error::governor_update_not_matured;

const int error::interest_too_low;
const int error::contradicting_borrowing_params;
const int error::not_enough_funds_for_loan;
const int error::total_credit_too_high;
const int error::borrowing_request_in_closed_round;

const int error::deposit_amount_too_low;
const int error::deposits_are_closed;
const int error::output_amount_is_zero;

const int error::not_enough_TON_to_process;

const int error::controller_in_wrong_workchain;
const int error::credit_book_too_deep;
const int error::unknown_borrower;

const int error::finalizing_active_credit_round;

const int error::too_early_stake_recover_attempt_count;
const int error::too_early_stake_recover_attempt_time;
const int error::too_low_recover_stake_value;
const int error::not_enough_money_to_pay_fine;
const int error::too_low_request_loan_value;

const int error::too_much_validator_set_counts;
const int error::no_new_hash;

const int error::withdrawal_while_credited;
const int error::incorrect_withdrawal_amount;

const int error::incorrect_new_stake::query_id;
const int error::incorrect_new_stake::request_value;
const int error::incorrect_new_stake::value_lt_minimum;
const int error::incorrect_new_stake::value_too_high;
const int error::incorrect_new_stake::wrongly_used_credit;
const int error::incorrect_new_stake::solvency_not_guaranteed;

const int error::controller_not_approved;
const int error::multiple_loans_are_prohibited;
const int error::too_early_loan_request;
const int error::too_late_loan_request;
const int error::too_high_loan_request_amount;
const int error::credit_interest_too_high;

const int error::no_credit;
const int error::too_early_loan_return;
```

## dd3ce98db487c7585803933bffba7a57eb4e663099059d08b83db0b4ce060793/governor_requests.func

```func
;; common functions in all contracts
global slice governor;;
global int governor_update_after;;
global slice sudoer;;
global int sudoer_set_at;;
global int state;;
global int halted?;;

const int GOVERNOR_QUARANTINE;

() process_set_sudo_request(slice sender, slice in_msg) impure inline_ref;

() process_prepare_governance_migration(slice sender, slice in_msg) impure inline_ref;

() process_unhalt_request(slice sender) impure inline_ref;
```

## dd3ce98db487c7585803933bffba7a57eb4e663099059d08b83db0b4ce060793/halter_requests.func

```func
;; common functions in all contracts
global slice halter;;
global int halted?;;

() process_halt_request(slice sender) impure inline_ref;
```

## dd3ce98db487c7585803933bffba7a57eb4e663099059d08b83db0b4ce060793/messages.func

```func
;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
const int msgflag::NON_BOUNCEABLE;
const int msgflag::BOUNCEABLE;

const int sendmode::REGULAR;
const int sendmode::PAY_FEES_SEPARETELY;
const int sendmode::IGNORE_ERRORS;
const int sendmode::DESTROY;
const int sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE;
const int sendmode::CARRY_ALL_BALANCE;

builder store_msg_flags(builder b, int msg_flag) inline;

{-
  Helpers below fill in default/overwritten values of message layout:
  Relevant part of TL-B schema:
  ... other:ExtraCurrencyCollection ihr_fee:Grams fwd_fee:Grams created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  bits      1                               4             4                64                32                            
  ... init:(Maybe (Either StateInit ^StateInit))  body:(Either X ^X) = Message X;
  bits      1      1(if prev is true)                   1

-}

builder store_msgbody_prefix_stateinit(builder b, cell state_init, cell ref) inline;

builder store_msgbody_prefix_stateinit_slice(builder b, cell state_init) inline;

builder store_msgbody_prefix_slice(builder b) inline;
builder store_msgbody_prefix_ref(builder b, cell ref) inline;

{-

addr_std$10 anycast:(Maybe Anycast) 
   workchain_id:int8 address:bits256  = MsgAddressInt;
-}

builder store_masterchain_address(builder b, int address_hash) inline;

() send_msg(slice to_address, int amount, cell payload, int flags, int send_mode) impure inline_ref;

() send_msg_builder(slice to_address, int amount, builder payload, int flags, int send_mode) impure inline_ref;

() send_excesses(slice sender_address) impure inline_ref;

() emit_log (int topic, builder data) impure inline;
    ;; 1023 - (4+2+9+256+64+32+2) = 654 bit free
```

## dd3ce98db487c7585803933bffba7a57eb4e663099059d08b83db0b4ce060793/network_config_utils.func

```func
const int ONE_TON;

;; https://github.com/ton-blockchain/ton/blob/ae5c0720143e231c32c3d2034cfe4e533a16d969/crypto/block/block.tlb#L721
int max_recommended_punishment_for_validator_misbehaviour(int stake) inline_ref;

     ;; https://github.com/ton-blockchain/ton/blob/master/lite-client/lite-client.cpp#L3721

;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/block/block.tlb#L632
;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L118
(int, int, int) get_validator_config() inline;

int get_stake_held_for() inline_ref;
int get_elections_start_before() inline_ref;

;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/block/block.tlb#L712
(int, int, cell) get_current_validator_set() inline_ref;
    ;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/block/block.tlb#L579
    ;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/config-code.fc#L49
```

## dd3ce98db487c7585803933bffba7a57eb4e663099059d08b83db0b4ce060793/op-codes.func

```func
{- ======== ELECTOR OPCODES =========== -}

;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L621
const int elector::new_stake;

;; return_stake https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L169
const int elector::new_stake_error;

;; send_confirmation https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L173
const int elector::new_stake_ok;

;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L625
const int elector::recover_stake;

;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L407
const int elector::recover_stake_error;

;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L426
const int elector::recover_stake_ok;

{- ========  Validator Controller OPCODES ======== -}
;; IN
const int controller::top_up;
const int controller::update_validator_hash;
const int controller::approve;
const int controller::disapprove;
const int controller::recover_stake;
const int controller::new_stake;
const int controller::credit;
const int controller::withdraw_validator;
const int controller::return_unused_loan;

;; OUT
const int controller::validator_withdrawal;
const int controller::send_request_loan;

{- ======== Validator Pool OPCODES ========== -}
const int pool::request_loan;
const int pool::loan_repayment;
const int pool::deposit;
const int pool::withdraw;
const int pool::withdrawal;
const int pool::touch;
const int pool::donate;

const int pool::deploy_controller;

const int sudo::send_message;
const int sudo::upgrade;
const int governor::set_sudoer;
const int governor::set_governance_fee;
const int governor::set_roles;
const int governor::unhalt;
const int governor::set_deposit_settings;
const int governor::return_available_funds;
const int governor::prepare_governance_migration;

const int halter::halt;

const int interest_manager::operation_fee;
const int interest_manager::request_notification;
const int interest_manager::stats;
const int interest_manager::set_interest;

{- ========== Jetton OPCODES ========== -}
const int jetton::transfer;
const int jetton::transfer_notification;
const int jetton::internal_transfer;
const int jetton::excesses;
const int jetton::burn;
const int jetton::burn_notification;
const int jetton::withdraw_tons;
const int jetton::withdraw_jettons;

const int jetton::provide_wallet_address;
const int jetton::take_wallet_address;
const int jetton::change_content;

const int payout::mint;
const int payout::burn_notification;
const int payout::init;

const int payouts::start_distribution;

{- =========== awaited Jettons ============= -}
const int payouts::mint;
```

## dd3ce98db487c7585803933bffba7a57eb4e663099059d08b83db0b4ce060793/sudoer_requests.func

```func
#include "asserts.func";

;; common function in all contracts
global slice sudoer;;
global int sudoer_set_at;;

const int SUDOER_QUARANTINE;

() process_sudo_request(slice sender, slice in_msg) impure inline_ref;

() execute(cont c) impure asm "EXECUTE";
() process_sudo_upgrade_request(slice sender, slice in_msg) impure inline_ref;
```

## dd3ce98db487c7585803933bffba7a57eb4e663099059d08b83db0b4ce060793/types.func

```func
;; general
builder store_timestamp(builder b, int timestamp) inline;

builder store_bool(builder b, int flag) inline;

builder store_workchain(builder b, int wc) inline;
const int MASTERCHAIN;
const int BASECHAIN;

;; Op-codes

builder store_op(builder b, int op) inline;
builder store_query_id(builder b, int query_id) inline;
builder store_body_header(builder b, int op, int query_id) inline;

;; Pool types

builder store_share(builder b, int share) inline;
const int SHARE_BASIS;

builder store_controller_id(builder b, int id) inline;

builder store_signed_coins(builder b, int amount) inline;

const int ADDR_SIZE;
```

## ddac4389ae1e0949d3562c6a534fc1500e22f2277906d570d69b7fc9ac9977a9/imports/constants.fc

```fc
;; operations (constant values taken from crc32 on op message in the companion .tlb files and appear during build)

;; errors

;; other
```

## ddac4389ae1e0949d3562c6a534fc1500e22f2277906d570d69b7fc9ac9977a9/imports/jetton-utils.fc

```fc
cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

slice calculate_jetton_wallet_address(cell state_init) inline;

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
```

## ddac4389ae1e0949d3562c6a534fc1500e22f2277906d570d69b7fc9ac9977a9/imports/op-codes.fc

```fc
;; Minter
```

## ddac4389ae1e0949d3562c6a534fc1500e22f2277906d570d69b7fc9ac9977a9/imports/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;
```

## ddac4389ae1e0949d3562c6a534fc1500e22f2277906d570d69b7fc9ac9977a9/imports/utils.fc

```fc
() send_grams(slice address, int amount) impure;
```

## ddac4389ae1e0949d3562c6a534fc1500e22f2277906d570d69b7fc9ac9977a9/jetton-wallet.fc

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

## ddac4389ae1e0949d3562c6a534fc1500e22f2277906d570d69b7fc9ac9977a9/stdlib.fc

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

## deb53b6c5765c1e6cd238bf47bc5e83ba596bdcc04b0b84cd50ab1e474a08f31/nft-fixprice-sale-v3r2.fc

```fc
;; NFT sale smart contract v3.1
;; fix repeat cancel message
;; allow cancel by text "cancel"

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

    ;; way to fix unexpected troubles with sale contract
    ;; for example if some one transfer nft to this contract

  ;; Throw if sale is complete

() recv_external(slice in_msg) impure;

(int, int, int, slice, slice, slice, int, slice, int, slice, int) get_sale_data() method_id;
```

## deb53b6c5765c1e6cd238bf47bc5e83ba596bdcc04b0b84cd50ab1e474a08f31/op-codes.fc

```fc
;; NFTEditable

;; SBT
```

## deb53b6c5765c1e6cd238bf47bc5e83ba596bdcc04b0b84cd50ab1e474a08f31/stdlib.fc

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

## df8d704766a3ca425c326fb0c800aeb0a02b0354078635f152ad765965a177ff/imports/discovery-params.fc

```fc
;; moved to the separate file to keep hex of the previous codes unchanged
```

## df8d704766a3ca425c326fb0c800aeb0a02b0354078635f152ad765965a177ff/imports/op.fc

```fc
;; Minter
```

## df8d704766a3ca425c326fb0c800aeb0a02b0354078635f152ad765965a177ff/imports/utils.fc

```fc
int workchain();

() force_chain(slice addr) impure;
cell pack_jetton_wallet_data(int ban?, int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

slice calculate_jetton_wallet_address(cell state_init) inline;

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
```

## df8d704766a3ca425c326fb0c800aeb0a02b0354078635f152ad765965a177ff/jetton_wallet.fc

```fc
#include "imports/stdlib.fc";
#include "imports/op.fc";
#include "imports/utils.fc";
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

(int, int, slice, slice, cell) load_data() inline;

() save_data (int ban?, int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) impure inline;

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

int get_ban() method_id;
;; ELBANCO
```

## df8d704766a3ca425c326fb0c800aeb0a02b0354078635f152ad765965a177ff/stdlib.fc

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

## e63063060926e6ef2c6d17ffae7f5fe29a91678020c419d167e0dff3638e2761/contract/contracts/jetton.tact

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
return
JettonData{
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
    body: TokenNotification{ // 0x7362d09c -- Remind the new Owner;
    query_id: msg.query_id,;
    amount: msg.amount,;
    from: msg.from,;
    forward_payload: msg.forward_payload;
    if (msg.response_destination != null && msg_value > 0);
    to: msg.response_destination!!,;
    value: msg_value,;
    bounce: false,;
    body: TokenExcesses{query_id: msg.query_id}.toCell(),;
    mode: SendPayGasSeparately;
    receive(msg: TokenBurn);
    require(ctx.sender == self.owner, "Invalid sender"); // Check sender;
    require(self.balance >= 0, "Invalid balance");;
    require(ctx.value > ((fwd_fee + 2 * self.gasConsumption) + self.minTonsForStorage), "Invalid value - Burn");;
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
    code: initOf JettonDefaultWallet(self.owner, self.master).code;
```

## e63063060926e6ef2c6d17ffae7f5fe29a91678020c419d167e0dff3638e2761/contract/contracts/jetton_deployer.tact

```tact
import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";
import "./token";

contract JD with Deployable, Ownable {
    owner: Address;
    init(owner: Address);
    receive(msg: ChangeOwnerMsg);
    receive(msg: NewToken);
    to: contractAddress(token),;
    body: MintAll{receiver: self.owner}.toCell(),;
    value: ton("0"),;
    mode: SendRemainingValue | SendIgnoreErrors,;
    code: token.code,;
    data: token.data;
    get fun balance(): Int;
    receive("Withdraw");
    if (myBalance() > ton("0.2"));
    send(SendParameters;
}
```

## e63063060926e6ef2c6d17ffae7f5fe29a91678020c419d167e0dff3638e2761/contract/contracts/messages.tact

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
    to: Address;
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
message ChangeOwnerMsg {
    new_owner: Address;
}
message NewOwnerEvent {
    new_owner: Address;
}
message NewToken {
    queryId: Int as uint64;
    content: Cell;
    max_supply: Int as coins;
    tokenLauncher: Address;
    website: String;
    telegram: String;
    twitter: String;
}
message NewTokenLaunched {
    tokenAddress: Address;
    launchedBy: Address;
    content: Cell;
}
message MintAll {
    receiver: Address;
}
```

## e63063060926e6ef2c6d17ffae7f5fe29a91678020c419d167e0dff3638e2761/contract/contracts/token.tact

```tact
import "@stdlib/deploy";
import "@stdlib/ownable";
import "./jetton";
import "./messages";

contract Token with Jetton, Deployable, Ownable {
    tokenLauncher: Address;
    total_supply: Int as coins;
    owner: Address;
    content: Cell;
    mintable: Bool;
    max_supply: Int as coins;
    website: String;
    telegram: String;
    twitter: String;
    _content: Cell,;
    _max_supply: Int,;
    _tokenLauncher: Address,;
    _website: String,;
    _telegram: String,;
    _twitter: String){;
    receive(msg: MintAll);
    require(self.mintable, "Not mintable");;
    get fun _tokenLauncher(): Address;
    get fun socialLinks(): String;
}
```

## e9d46f1ad4f3d05866b9800a3dc2202e4730bed1d344a54999b5e20f7f5226cc/imports/stdlib.fc

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

## e9d46f1ad4f3d05866b9800a3dc2202e4730bed1d344a54999b5e20f7f5226cc/nft-item-editable-DRAFT.fc

```fc
;;
;;  TON NFT Item Smart Contract Editable
;;

#include "imports/stdlib.fc";
#include "imports/op-codes.fc";
#include "imports/params.fc";

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

## e9d46f1ad4f3d05866b9800a3dc2202e4730bed1d344a54999b5e20f7f5226cc/op-codes.fc

```fc
;; NFTEditable

;; SBT
```

## e9d46f1ad4f3d05866b9800a3dc2202e4730bed1d344a54999b5e20f7f5226cc/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;

slice null_addr();
```

## ec108e7ff8031c4de795af16de6486fa3e584e384964e6c0575b21b88de7e99b/imports/stdlib.fc

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

## ec108e7ff8031c4de795af16de6486fa3e584e384964e6c0575b21b88de7e99b/wallet_kurilshika.fc

```fc
;; Simple wallet smart contract - БЕЗ SEQNO, ЧЕКАЙТЕ КАКОЙ ПИЗДЕЦ:
;; https://tonviewer.com/EQBkrGoihTA9ex0SlxV6iX0Ut1sds7d-exDgMROH4UyuqdO0
;;
;; ВСЕ ТОНЫ СЖЕГ НА ДЕПЛОЙ)))))))))

() recv_internal(slice in_msg) impure;
    ;; do nothing for internal messages

() recv_external(slice in_msg) impure;

    ;;; ВОТ ЧТО БЛЯТЬ БЫВАЕТ ЕСЛИ НЕ СТАВИТЬ SEQNO, ЗАПОМНИТЕ СУКИ!

    ;;  throw_unless(33, msg_seqno == stored_seqno);

;; Get methods

int seqno() method_id;

int get_public_key() method_id;
```

## ec7c309191cab37164fafdcd871985aad7aa6ac429c3cb27580e1345d1cbb8db/btn-jwallet.func

```func
;; This code was verified by @gosunov
;; subscribe to my channel @gosunov_ch
;; buy $SLOW

;;  _           _ _   
;; | |         | | |  
;; | |__   ___ | | |_ 
;; | '_ \ / _ \| | __|
;; | |_) | (_) | | |_ 
;; |_.__/ \___/|_|\__|

;;
;;  btn-token-smc – smart contracts collection for Biton token
;;
;;  Copyright (C) 2022 BITON <https://github.com/BITONdev>
;;
;;  This file is part of btn-token-smc.
;;
;;  btn-token-smc is free software: you can redistribute it and/or modify
;;  it under the terms of the GNU General Public License as published by
;;  the Free Software Foundation, either version 3 of the License, or
;;  (at your option) any later version.
;;
;;  btn-token-smc is distributed in the hope that it will be useful,
;;  but WITHOUT ANY WARRANTY; without even the implied warranty of
;;  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
;;  GNU General Public License for more details.
;;
;;  You should have received a copy of the GNU General Public License
;;  along with btn-token-smc.  If not, see <https://www.gnu.org/licenses/>.
;;

int min_tons_for_storage();
int gas_consumption();

(int, slice, slice, cell) load_data() inline;

() save_data (int balance, slice owner_addr, slice jmaster_addr, cell jwall_code) impure inline;

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

() send_tokens (slice in_msg_body, slice sender_addr, int msg_value, int fwd_fee) impure;

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

() receive_tokens (slice in_msg_body, slice sender_addr, int my_ton_balance, int fwd_fee) impure;
    ;; NOTE we can not allow fails in action phase since in that case there will be
    ;; no bounce. Thus check and throw in computation phase.

() burn_tokens (slice in_msg_body, slice sender_addr, int msg_value, int fwd_fee) impure;
    ;; NOTE we can not allow fails in action phase since in that case there will be
    ;; no bounce. Thus check and throw in computation phase.
    ;; ignore custom payload
    ;; slice custom_payload = in_msg_body~load_dict();

() on_bounce (slice in_msg_body) impure;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;
    ;; istead of if (in_msg_body.slice_empty?()) { return (); }

(int, slice, slice, cell) get_wallet_data() method_id;
```

## ec7c309191cab37164fafdcd871985aad7aa6ac429c3cb27580e1345d1cbb8db/lib/extlib.func

```func
;;
;;  btn-token-smc – smart contracts collection for Biton token
;;
;;  Copyright (C) 2022 BITON <https://github.com/BITONdev>
;;
;;  This file is part of btn-token-smc.
;;
;;  btn-token-smc is free software: you can redistribute it and/or modify
;;  it under the terms of the GNU General Public License as published by
;;  the Free Software Foundation, either version 3 of the License, or
;;  (at your option) any later version.
;;
;;  btn-token-smc is distributed in the hope that it will be useful,
;;  but WITHOUT ANY WARRANTY; without even the implied warranty of
;;  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
;;  GNU General Public License for more details.
;;
;;  You should have received a copy of the GNU General Public License
;;  along with btn-token-smc.  If not, see <https://www.gnu.org/licenses/>.
;;

;;
;; extension for FunC standard library (stdlib.fc)
;;

;;  addr_std$10 anycast:(## 1) {anycast = 0}
;;      workchain_id:int8 address:bits256 = MsgAddrSmpl;

        extlib::addrsmpl_start()
    );
```

## ec7c309191cab37164fafdcd871985aad7aa6ac429c3cb27580e1345d1cbb8db/lib/stdlib.func

```func
;;
;;  Standard library for funC
;;

;;
;;  This file is part of TON Blockchain Library.
;;
;;  TON Blockchain Library is free software: you can redistribute it and/or modify
;;  it under the terms of the GNU Lesser General Public License as published by
;;  the Free Software Foundation, either version 2 of the License, or
;;  (at your option) any later version.
;;
;;  TON Blockchain Library is distributed in the hope that it will be useful,
;;  but WITHOUT ANY WARRANTY; without even the implied warranty of
;;  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
;;  GNU Lesser General Public License for more details.
;;
;;  You should have received a copy of the GNU Lesser General Public License
;;  along with TON Blockchain Library.  If not, see <http://www.gnu.org/licenses/>.
;;
;;  Copyright 2017-2020 Telegram Systems LLP
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

## ec7c309191cab37164fafdcd871985aad7aa6ac429c3cb27580e1345d1cbb8db/utils/exit-codes.func

```func
;;
;;  btn-token-smc – smart contracts collection for Biton token
;;
;;  Copyright (C) 2022 BITON <https://github.com/BITONdev>
;;
;;  This file is part of btn-token-smc.
;;
;;  btn-token-smc is free software: you can redistribute it and/or modify
;;  it under the terms of the GNU General Public License as published by
;;  the Free Software Foundation, either version 3 of the License, or
;;  (at your option) any later version.
;;
;;  btn-token-smc is distributed in the hope that it will be useful,
;;  but WITHOUT ANY WARRANTY; without even the implied warranty of
;;  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
;;  GNU General Public License for more details.
;;
;;  You should have received a copy of the GNU General Public License
;;  along with btn-token-smc.  If not, see <https://www.gnu.org/licenses/>.
;;

;; basic exit codes

;; "op::buy_tokens()" exit codes

;; system exit codes
```

## ec7c309191cab37164fafdcd871985aad7aa6ac429c3cb27580e1345d1cbb8db/utils/jetton-utils.func

```func
;;
;;  btn-token-smc – smart contracts collection for Biton token
;;
;;  Copyright (C) 2022 BITON <https://github.com/BITONdev>
;;
;;  This file is part of btn-token-smc.
;;
;;  btn-token-smc is free software: you can redistribute it and/or modify
;;  it under the terms of the GNU General Public License as published by
;;  the Free Software Foundation, either version 3 of the License, or
;;  (at your option) any later version.
;;
;;  btn-token-smc is distributed in the hope that it will be useful,
;;  but WITHOUT ANY WARRANTY; without even the implied warranty of
;;  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
;;  GNU General Public License for more details.
;;
;;  You should have received a copy of the GNU General Public License
;;  along with btn-token-smc.  If not, see <https://www.gnu.org/licenses/>.
;;

int workchain();

) inline {

) inline {

slice jwall_state_addr(cell state_init) inline;

slice jwall_addr_by_owner(slice owner_addr, slice jmaster_addr, cell jwall_code) inline;

() force_chain(slice addr) impure;
```

## ec7c309191cab37164fafdcd871985aad7aa6ac429c3cb27580e1345d1cbb8db/utils/op-codes.func

```func
;;
;;  btn-token-smc – smart contracts collection for Biton token
;;
;;  Copyright (C) 2022 BITON <https://github.com/BITONdev>
;;
;;  This file is part of btn-token-smc.
;;
;;  btn-token-smc is free software: you can redistribute it and/or modify
;;  it under the terms of the GNU General Public License as published by
;;  the Free Software Foundation, either version 3 of the License, or
;;  (at your option) any later version.
;;
;;  btn-token-smc is distributed in the hope that it will be useful,
;;  but WITHOUT ANY WARRANTY; without even the implied warranty of
;;  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
;;  GNU General Public License for more details.
;;
;;  You should have received a copy of the GNU General Public License
;;  along with btn-token-smc.  If not, see <https://www.gnu.org/licenses/>.
;;

;; ---- minter-ico ----
```

## ec7c309191cab37164fafdcd871985aad7aa6ac429c3cb27580e1345d1cbb8db/utils/text.func

```func
;;
;;  btn-token-smc – smart contracts collection for Biton token
;;
;;  Copyright (C) 2022 BITON <https://github.com/BITONdev>
;;
;;  This file is part of btn-token-smc.
;;
;;  btn-token-smc is free software: you can redistribute it and/or modify
;;  it under the terms of the GNU General Public License as published by
;;  the Free Software Foundation, either version 3 of the License, or
;;  (at your option) any later version.
;;
;;  btn-token-smc is distributed in the hope that it will be useful,
;;  but WITHOUT ANY WARRANTY; without even the implied warranty of
;;  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
;;  GNU General Public License for more details.
;;
;;  You should have received a copy of the GNU General Public License
;;  along with btn-token-smc.  If not, see <https://www.gnu.org/licenses/>.
;;

;;
;; set of texts that the smc uses
;;
```

## ef87b8c26f089ba3faa79003cca2895fd38c3fb08b21b0b62f4bce22922d4dbf/contract/contracts/monster.tact

```tact
import "@stdlib/ownable";
import "@stdlib/deploy";

message Mint {
    receiver: Address;
}

contract Monster with Jetton, Deployable {
    totalSupply: Int as coins;
    owner: Address;
    content: Cell;
    mintable: Bool;
    max_supply: Int as coins;
    init(owner: Address, content: Cell, max_supply: Int);
    receive(msg: Mint);
    require(ctx.sender == self.owner, "Not Owner");;
    require(self.mintable, "Can't Mint Anymore");;
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
    bounce: true,;
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

## f1b5430dba31f0241843a4d5c8f2a6b937c29bae6e70a2971f2d23b9d54b8c50/contracts/imports/error-codes.fc

```fc
const int error::unknown_op;
const int error::wrong_workchain;

const int error::malformed_forward_payload;
const int error::not_enough_tons;

const int error::unknown_action;
const int error::unknown_action_bounced;
```

## f1b5430dba31f0241843a4d5c8f2a6b937c29bae6e70a2971f2d23b9d54b8c50/contracts/imports/messages.fc

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

## f1b5430dba31f0241843a4d5c8f2a6b937c29bae6e70a2971f2d23b9d54b8c50/contracts/imports/params.fc

```fc
#include "error-codes.fc";

const int workchain;

() force_chain(slice addr) impure;
```

## f1b5430dba31f0241843a4d5c8f2a6b937c29bae6e70a2971f2d23b9d54b8c50/contracts/imports/stdlib.fc

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

## f1b5430dba31f0241843a4d5c8f2a6b937c29bae6e70a2971f2d23b9d54b8c50/contracts/jetton/error-codes.fc

```fc
#include "../imports/stdlib.fc";
#include "../imports/error-codes.fc";

;; jetton wallet errors
const int error::unauthorized_transfer;
const int error::not_enough_jettons;
const int error::unauthorized_incoming_transfer;
const int error::burn_fee_not_matched;

;; jetton minter errors
const int error::discovery_fee_not_matched;
const int error::unauthorized_mint_request;
const int error::unauthorized_burn_request;
const int error::unauthorized_change_admin_request;
const int error::unauthorized_change_content_request;
```

## f1b5430dba31f0241843a4d5c8f2a6b937c29bae6e70a2971f2d23b9d54b8c50/contracts/jetton/jetton-minter.fc

```fc
#include "../imports/stdlib.fc";
#include "../imports/params.fc";
#include "../imports/messages.fc";
#include "jetton-utils.fc";
#include "error-codes.fc";
#include "op-codes.fc";

;; Jettons discoverable smart contract

;; 6905(computational_gas_price) * 1000(cur_gas_price) = 6905000
;; ceil(6905000) = 10000000 ~= 0.01 TON
const int provide_address_gas_consumption;

;; storage scheme
;; storage#_ total_supply:Coins admin_address:MsgAddress content:^Cell jetton_wallet_code:^Cell = Storage;

(int, slice, cell, cell) load_data() inline;

() save_data(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) impure inline;

() mint_tokens(slice to_address, cell jetton_wallet_code, int amount, cell master_msg) impure;

() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure;

(int, int, slice, cell, cell) get_jetton_data() method_id;

slice get_wallet_address(slice owner_address) method_id;
```

## f1b5430dba31f0241843a4d5c8f2a6b937c29bae6e70a2971f2d23b9d54b8c50/contracts/jetton/jetton-utils.fc

```fc
#include "../imports/params.fc";

const int ONE_TON;

cell pack_jetton_wallet_data (int balance, slice owner, slice jetton_master, cell token_wallet_code) inline;
{-
    _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
      code:(Maybe ^Cell) data:(Maybe ^Cell)
      library:(HashmapE 256 SimpleLib) = StateInit;
-}
cell calculate_jetton_wallet_state_init (slice owner, slice jetton_master, cell code) inline;

{-
  addr_std$10 anycast:(Maybe Anycast)
   workchain_id:int8 address:bits256  = MsgAddressInt;
-}
slice calc_address(cell state_init) inline;

(slice) calc_user_wallet (slice owner, slice jetton_master, cell code) inline;
```

## f1b5430dba31f0241843a4d5c8f2a6b937c29bae6e70a2971f2d23b9d54b8c50/contracts/jetton/op-codes.fc

```fc
const int op::transfer;
const int op::transfer_notification;
const int op::internal_transfer;
const int op::excesses;
const int op::burn;
const int op::burn_notification;
const int op::withdraw_tons;
const int op::withdraw_jettons;

const int op::provide_wallet_address;
const int op::take_wallet_address;

;; Minter
const int op::mint;
const int op::deploy_wallet;
const int op::change_admin;
const int op::change_content;
```

## f200eed5d16b5649bff6f0914a12e8fe71cc75f57fbb34e74ad5240e2142e8fb/contract/contracts/jetton.tact

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
return
JettonData{
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
    body: TokenNotification{ // 0x7362d09c -- Remind the new Owner;
    query_id: msg.query_id,;
    amount: msg.amount,;
    from: msg.from,;
    forward_payload: msg.forward_payload;
    if (msg.response_destination != null && msg_value > 0);
    to: msg.response_destination!!,;
    value: msg_value,;
    bounce: false,;
    body: TokenExcesses{query_id: msg.query_id}.toCell(),;
    mode: SendPayGasSeparately;
    receive(msg: TokenBurn);
    require(ctx.sender == self.owner, "Invalid sender"); // Check sender;
    require(self.balance >= 0, "Invalid balance");;
    require(ctx.value > ((fwd_fee + 2 * self.gasConsumption) + self.minTonsForStorage), "Invalid value - Burn");;
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
    code: initOf JettonDefaultWallet(self.owner, self.master).code;
```

## f200eed5d16b5649bff6f0914a12e8fe71cc75f57fbb34e74ad5240e2142e8fb/contract/contracts/jetton_deployer.tact

```tact
import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";
import "./token";

contract JD with Deployable, Ownable {
    owner: Address;
    init(owner: Address);
    receive(msg: ChangeOwnerMsg);
    receive(msg: NewToken);
    to: contractAddress(token),;
    body: MintAll{receiver: self.owner}.toCell(),;
    value: ton("0"),;
    mode: SendRemainingValue | SendIgnoreErrors,;
    code: token.code,;
    data: token.data;
    get fun balance(): Int;
    receive("Withdraw");
    if (myBalance() > ton("0.2"));
    send(SendParameters;
}
```

## f200eed5d16b5649bff6f0914a12e8fe71cc75f57fbb34e74ad5240e2142e8fb/contract/contracts/messages.tact

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
    to: Address;
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
message ChangeOwnerMsg {
    new_owner: Address;
}
message NewOwnerEvent {
    new_owner: Address;
}
message NewToken {
    queryId: Int as uint64;
    content: Cell;
    max_supply: Int as coins;
    tokenLauncher: Address;
    website: String;
    telegram: String;
    twitter: String;
}
message NewTokenLaunched {
    tokenAddress: Address;
    launchedBy: Address;
    content: Cell;
}
message MintAll {
    receiver: Address;
}
```

## f200eed5d16b5649bff6f0914a12e8fe71cc75f57fbb34e74ad5240e2142e8fb/contract/contracts/token.tact

```tact
import "@stdlib/deploy";
import "@stdlib/ownable";
import "./jetton";
import "./messages";

contract Token with Jetton, Deployable, Ownable {
    tokenLauncher: Address;
    total_supply: Int as coins;
    owner: Address;
    content: Cell;
    mintable: Bool;
    max_supply: Int as coins;
    website: String;
    telegram: String;
    twitter: String;
    _content: Cell,;
    _max_supply: Int,;
    _tokenLauncher: Address,;
    _website: String,;
    _telegram: String,;
    _twitter: String){;
    receive(msg: MintAll);
    require(self.mintable, "Not mintable");;
    get fun _tokenLauncher(): Address;
    get fun socialLinks(): String;
}
```

## f3d7ca53493deedac28b381986a849403cbac3d2c584779af081065af0ac4b93/contracts/imports/stdlib.fc

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

## f3d7ca53493deedac28b381986a849403cbac3d2c584779af081065af0ac4b93/wallet_v5.fc

```fc
#pragma version =0.4.4;

#include "imports/stdlib.fc";

const int size::stored_seqno;
const int size::stored_subwallet;
const int size::public_key;

const int size::subwallet_id;
const int size::valid_until;
const int size::msg_seqno;

const int size::flags;

() return_if(int cond) impure asm "IFRET";
() return_unless(int cond) impure asm "IFNOTRET";

(slice) udict_get_or_return(cell dict, int key_len, int index) impure asm(index dict key_len) "DICTUGET" "IFNOTRET";

(slice) enforce_and_remove_sign_prefix(slice body) impure asm "x{7369676E} SDBEGINS";
(slice, int) check_and_remove_extn_prefix(slice body) impure asm "x{6578746E} SDBEGINSQ";
(slice, int) check_and_remove_sint_prefix(slice body) impure asm "x{73696E74} SDBEGINSQ";

;; (slice, int) check_and_remove_set_data_prefix(slice body) impure asm "x{1ff8ea0b} SDBEGINSQ";
(slice, int) check_and_remove_add_extension_prefix(slice body) impure asm "x{1c40db9f} SDBEGINSQ";
(slice, int) check_and_remove_remove_extension_prefix(slice body) impure asm "x{5eaef4a4} SDBEGINSQ";
(slice, int) check_and_remove_set_signature_auth_allowed_prefix(slice body) impure asm "x{20cbb95a} SDBEGINSQ";

(slice) enforce_and_remove_action_send_msg_prefix(slice body) impure asm "x{0ec3c86d} SDBEGINS";

;; Extensible wallet contract v5

;; Compresses 8+256-bit address into 256-bit uint by cutting off one bit from sha256.
;; This allows us to save on wrapping the address in a cell and make plugin requests cheaper.
;; This method also unpacks address hash if you pass packed hash with the original wc.

;; Stores pre-computed list of actions (mostly `action_send_msg`) in the actions register.
() set_actions(cell action_list) impure asm "c5 POP";

int count_leading_zeroes(slice cs);
int count_trailing_zeroes(slice cs);
int count_trailing_ones(slice cs);

;; (slice, slice) split(slice s, int bits, int refs) asm "SPLIT";
;; (slice, slice, int) split?(slice s, int bits, int refs) asm "SPLIT" "NULLSWAPIFNOT";

slice get_last_bits(slice s, int n);
slice remove_last_bits(slice s, int n);

cell verify_actions(cell c5) inline;
  ;; Comment out code starting from here to disable checks (unsafe version)
  ;; {-
  slice c5s = c5.begin_parse();
  return_if(c5s.slice_empty?());
  do {
    ;; only send_msg is allowed, set_code or reserve_currency are not
    c5s = c5s.enforce_and_remove_action_send_msg_prefix();
    ;; enforce that send_mode has 2 bit set
    ;; for that load 7 bits and make sure that they end with 1
    throw_if(37, count_trailing_zeroes(c5s.preload_bits(7)));
    c5s = c5s.preload_ref().begin_parse();
  } until (c5s.slice_empty?());
  ;; -}

;; Dispatches already authenticated request.
;; this function is explicitly included as an inline reference - not completely inlined
;; completely inlining it causes undesirable code split and noticeable gas increase in some paths
() dispatch_complex_request(slice cs) impure inline_ref;

  ;; Recurse into extended actions until we reach standard actions
    ;; Add/remove extensions

      ;; Add extension
      ;; Remove extension if (op == 0x5eaef4a4)
      ;; It can be ONLY 0x1c40db9f OR 0x5eaef4a4 here. No need for second check.

        ;; allow
        ;; Can't be disallowed with 0 because disallowing increments seqno
        ;; -123 -> 123 -> 124
        ;; disallow
        ;; Corner case: 0 -> 1 -> -1
        ;; 123 -> 124 -> -124
    ;; Uncomment to allow set_data (for unsafe version)
    {-
    elseif (cs~check_and_remove_set_data_prefix()) {
      set_data(cs~load_ref());
    }
    -}
      ;; need to throw on unsupported actions for correct flow and for testability
  ;; At this point we are at `action_list_basic$0 {n:#} actions:^(OutList n) = ActionList n 0;`
  ;; Simply set the C5 register with all pre-computed actions after verification:

;; ------------------------------------------------------------------------------------------------

;; Verifies signed request, prevents replays and proceeds with `dispatch_request`.
() process_signed_request_from_external_message(slice full_body) impure inline;
  ;; The precise order of operations here is VERY important. Any other order results in unneccessary stack shuffles.

  ;; TODO: Consider moving signed into separate ref, slice_hash consumes 500 gas just like cell creation!
  ;; Only such checking order results in least amount of gas
  ;; If public key is disabled, stored_seqno is strictly less than zero: stored_seqno < 0
  ;; However, msg_seqno is uint, therefore it can be only greater or equal to zero: msg_seqno >= 0
  ;; Thus, if public key is disabled, these two domains NEVER intersect, and additional check is not needed

  ;; Store and commit the seqno increment to prevent replays even if the subsequent requests fail.

  ;; <<<<<<<<<<---------- Simple primary cases gas evaluation ends here ---------->>>>>>>>>>

  ;; inline_ref required because otherwise it will produce undesirable JMPREF

() recv_external(slice body) impure inline;
  ;; 0x7369676E ("sign") external message authenticated by signature

;; ------------------------------------------------------------------------------------------------

() dispatch_extension_request(slice cs, var dummy1) impure inline;
  ;; <<<<<<<<<<---------- Simple primary cases gas evaluation ends here ---------->>>>>>>>>>
  ;;

;; Same logic as above function but with return_* instead of throw_* and additional checks to prevent bounces
() process_signed_request_from_internal_message(slice full_body) impure inline;
  ;; Additional check to make sure that there are enough bits for reading (+1 for actual actions flag)

  ;; The precise order of operations here is VERY important. Any other order results in unneccessary stack shuffles.

  ;; Note on bouncing/nonbouncing behaviour:
  ;; In principle, the wallet should not bounce incoming messages as to avoid 
  ;; returning deposits back to the sender due to opcode misinterpretation.
  ;; However, specifically for "gasless" transactions (signed messages relayed by a 3rd party),
  ;; there is a risk for the relaying party to be abused: their coins should be bounced back in case of a race condition or delays.
  ;; We resolve this dilemma by silently failing at the signature check (therefore ordinary deposits with arbitrary opcodes never bounce),
  ;; but failing with exception (therefore bouncing) after the signature check.

  ;; TODO: Consider moving signed into separate ref, slice_hash consumes 500 gas just like cell creation!
  ;; Only such checking order results in least amount of gas
  ;; If public key is disabled, stored_seqno is strictly less than zero: stored_seqno < 0
  ;; However, msg_seqno is uint, therefore it can be only greater or equal to zero: msg_seqno >= 0
  ;; Thus, if public key is disabled, these two domains NEVER intersect, and additional check is not needed

  ;; Store and commit the seqno increment to prevent replays even if the subsequent requests fail.

  ;; <<<<<<<<<<---------- Simple primary cases gas evaluation ends here ---------->>>>>>>>>>

  ;; inline_ref required because otherwise it will produce undesirable JMPREF

() recv_internal(cell full_msg, slice body) impure inline;

  ;; return right away if there are no references
  ;; correct messages always have a ref, because any code paths ends with preload_ref

  ;; Any attempt to postpone msg_value deletion will result in s2 POP -> SWAP change. No use at all.

  ;; If bounced flag (last bit) is set amount of trailing ones will be non-zero, else it will be zero.

  ;; slicy_return_if_bounce(begin_cell().store_uint(3, 4).end_cell().begin_parse()); ;; TEST!!!

  ;; We accept two kinds of authenticated messages:
  ;; - 0x6578746E "extn" authenticated by extension
  ;; - 0x73696E74 "sint" internal message authenticated by signature

  ;; IFJMPREF because unconditionally returns inside

    ;; Authenticate extension by its address.

    ;; It is not required to read this data here, maybe ext is doing simple transfer where those are not needed

    ;; Note that some random contract may have deposited funds with this prefix,
    ;; so we accept the funds silently instead of throwing an error (wallet v4 does the same).

    ;; auth_kind and wc are passed into dispatch_extension_request and later are dropped in batch with 3 BLKDROP

  ;; Process the rest of the slice just like the signed request.

;; ------------------------------------------------------------------------------------------------
;; Get methods

int seqno() method_id;
  ;; Use absolute value to do not confuse apps with negative seqno if key is disabled

int get_wallet_id() method_id;

int get_public_key() method_id;

;; Returns raw dictionary (or null if empty) where keys are packed addresses and the `wc` is stored in leafs.
;; User should unpack the address using the same packing function using `wc` to restore the original address.
cell get_extensions() method_id;

int get_is_signature_auth_allowed() method_id;
```

## f84fd57f17c9f203e6bb05a95da756360034ccebb462b9e655d11974551e67cc/contract/contracts/contract.tact

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

## f84fd57f17c9f203e6bb05a95da756360034ccebb462b9e655d11974551e67cc/contract/contracts/jetton.tact

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

## f84fd57f17c9f203e6bb05a95da756360034ccebb462b9e655d11974551e67cc/contract/contracts/messages.tact

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

## f8cb44ef7b5beef60b4e98d2439e8cea718b34c03702618e7e2c387cde6847fe/imports/exceptions.fc

```fc
const int exc::incorrect_sender_address;
const int exc::not_enough_ton_for_gas;
const int exc::not_enough_ton_for_fees;
const int exc::incorrect_jetton;
const int exc::incorrect_nft;
const int exc::incorrect_lock_period;
const int exc::no_rewards_left;
const int exc::unsupported_op;
```

## f8cb44ef7b5beef60b4e98d2439e8cea718b34c03702618e7e2c387cde6847fe/imports/op-codes.fc

```fc
;; Jettons
const int op::transfer_jetton;
const int op::transfer_notification;

;; NFT
const int op::transfer;
const int op::ownership_assigned;
const int op::excesses;
const int op::get_static_data;
const int op::report_static_data;
const int op::get_royalty_params;
const int op::report_royalty_params;
const int op::burn;
const int op::nft_transferred;

;; NFT-collection
const int op::change_owner;
;; const int op::change_jetton_wallet = 0x4;
const int op::withdraw_fees;
const int op::get_info;
;; const int op::change_royalty_params = 0x;
```

## f8cb44ef7b5beef60b4e98d2439e8cea718b34c03702618e7e2c387cde6847fe/imports/stdlib.fc

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
(slice, cell) ~load_dict(slice s);

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

## f8cb44ef7b5beef60b4e98d2439e8cea718b34c03702618e7e2c387cde6847fe/nft_item.fc

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
#pragma version >=0.4.0;
#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/op-codes.fc";

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

() transfer_ownership(int my_balance, int index, slice collection_address, slice owner_address, cell content,

    force_chain(new_owner_address);

            ;; update claimed_rewards

            send_msg(new_owner_address, forward_amount, op::ownership_assigned,
            send_msg(new_owner_address, forward_amount, op::ownership_assigned, query_id, 

                send_msg(collection_address, 1, op::nft_transferred, query_id, 

        force_chain(response_destination);
        send_msg(response_destination, rest_amount, op::excesses, query_id, null(), 1);  ;; paying fees, revert on errors

    store_data(index, collection_address, new_owner_address, content);

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

;;
;;  GET Methods
;;

(int, int, slice, slice, cell) get_nft_data() method_id;

(int, int, int, int, int, int, slice, slice) get_nft_content() method_id;
```

## f8cb44ef7b5beef60b4e98d2439e8cea718b34c03702618e7e2c387cde6847fe/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;
```

## f90707f6c62427a1139d7cefd65fcc6eb365cb8e883c27abf45e3f7cea434d3c/contracts/custom-jetton/jetton-utils.fc

```fc
#include "../imports/workchain.fc";
#include "../imports/errors.fc";

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

## f90707f6c62427a1139d7cefd65fcc6eb365cb8e883c27abf45e3f7cea434d3c/contracts/custom-jetton/jetton_wallet.fc

```fc
;; Jetton Wallet Smart Contract

#pragma version >=0.4.4;
#include "op-codes.fc";
#include "jetton-utils.fc";
#include "../imports/stdlib.fc";
#include "../imports/utils.fc";
#include "../imports/gas.fc";

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

## f90707f6c62427a1139d7cefd65fcc6eb365cb8e883c27abf45e3f7cea434d3c/contracts/custom-jetton/op-codes.fc

```fc
const op::set_status;
const op::transfer;
const op::transfer_notification;
const op::internal_transfer;
const op::excesses;
const op::burn;
const op::burn_notification;
const op::provide_wallet_address;
const op::take_wallet_address;
const op::top_up;
const op::mint;
const op::change_admin;
const op::claim_admin;
const int op::call_to;
const op::change_content;
const op::upgrade_jetton_code;
const op::upgrade_jetton_wallet_code;
const op::upgrade;
const op::upgrade_wallet_code;
```

## f90707f6c62427a1139d7cefd65fcc6eb365cb8e883c27abf45e3f7cea434d3c/contracts/imports/errors.fc

```fc
const int error::invalid_sender;
const int error::not_open;
const int error::deposit_amount_too_low;
const int error::insufficient_fee;
const int error::insufficient_balance;
const int error::invalid_reward;
const int error::invalid_amount;
const int error::wrong_op;
const int error::invalid_op;
const int error::not_owner_or_vault_wallet;
const int error::not_valid_wallet;
const int error::contract_locked;
const int error::balance_error;
const int error::not_enough_gas;
const int error::invalid_message;
const int error::not_enough_collateral;
const int error::invalid_time;
const int error::invalid_oracle_data;
const int error::invalid_latest_timestamp;
const int error::invalid_borrow_fee;
const int error::not_owner;
const int error::insufficient_collateral;
const int error::max_withdraw;
const int error::in_during_liquidation;
const int error::not_repay;
const int error::not_repay_fee;
const int error::withdraw_time;
const int error::invalid_repay_amount;
const int error::invalid_asset_key;
const int error::bad_collateral;
```

## f90707f6c62427a1139d7cefd65fcc6eb365cb8e883c27abf45e3f7cea434d3c/contracts/imports/gas.fc

```fc
#pragma version >=0.4.4;
#include "workchain.fc";
#include "errors.fc";

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

int get_amount_mint_token(int forward_ton_amount, int fwd_fee) impure inline;

    ;; 3 messages: wal1->wal2,  wal2->owner, wal2->response
    ;; but last one is optional (it is ok if it fails)
;; const VAULT_BITS  = 3954;
;; const VAULT_CELLS = 5;
;; 15528362 
;; int calculate_vault_min_storage_fee() inline {
;;     return get_storage_fee(MY_WORKCHAIN, MIN_STORAGE_DURATION, VAULT_BITS, VAULT_CELLS);
;; }

;; const VAULT_WALLET_BITS  = 2001;
;; const VAULT_WALLET_CELLS = 3;
;; real = 8423427
;; int calculate_vault_wallet_min_storage_fee() inline {
;;     return get_storage_fee(MY_WORKCHAIN, MIN_STORAGE_DURATION, VAULT_WALLET_BITS, VAULT_WALLET_CELLS);
;; }

const VAULT_MIN_STORAGE_FEE;
const VAULT_WALLET_MIN_STORAGE_FEE;

() check_amount_is_enough_to_burn(int msg_value) impure inline;
```

## f90707f6c62427a1139d7cefd65fcc6eb365cb8e883c27abf45e3f7cea434d3c/contracts/imports/stdlib.fc

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

;;; Checking that `slice` [s] is a addr_none constuction;
slice none_address();

slice true_slice();
slice false_slice();

;;; Gas fees
int get_gas_used();
int get_storage_due();

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

(slice, int) ~load_uint64(slice s) inline;

builder store_uint64(builder b, int value) inline;

(slice, int) ~load_uint32(slice s) inline;

builder store_uint32(builder b, int value) inline;

(slice, int) ~load_uint16(slice s) inline;

builder store_uint16(builder b, int value) inline;

(slice, int) ~load_uint8(slice s) inline;

builder store_uint8(builder b, int value) inline;

(slice, int) ~load_uint256(slice s) inline;

builder store_uint256(builder b, int value) inline;

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

## f90707f6c62427a1139d7cefd65fcc6eb365cb8e883c27abf45e3f7cea434d3c/contracts/imports/utils.fc

```fc
#pragma version >=0.4.4;
#include "workchain.fc";

cell pack_vault_wallet_data(slice owner_address, slice vault_address) inline;

builder calculate_vault_wallet_state_init(slice owner_address, slice vault_address, cell vault_wallet_code) inline;

slice calculate_address(cell state_init) inline;

slice calculate_user_vault_wallet_address(slice owner_address, slice vault_address, cell vault_wallet_code) inline;
```

## f90707f6c62427a1139d7cefd65fcc6eb365cb8e883c27abf45e3f7cea434d3c/contracts/imports/workchain.fc

```fc
#include "stdlib.fc";

const MY_WORKCHAIN;
const error::wrong_workchain;

int is_same_workchain(slice addr) inline;

() check_same_workchain(slice addr) impure inline;
```

## f95ba0330b38cdf3459b1e811e5fc6fa6cfee566d7b764455c0468140365a737/imports/stdlib.fc

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

## f95ba0330b38cdf3459b1e811e5fc6fa6cfee566d7b764455c0468140365a737/jetton-minter.fc

```fc
#include "imports/stdlib.fc";
#include "jetton-utils.fc"; 
#include "params.fc"; 
#include "op-codes.fc"; 

(int, slice, cell, cell) load_data() inline;

() save_data(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) impure inline;

() mint_tokens(slice to_address, cell jetton_wallet_code, int amount, cell master_msg) impure;

() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure;

(int, int, slice, cell, cell) get_jetton_data() method_id;

slice get_wallet_address(slice owner_address) method_id;
```

## f95ba0330b38cdf3459b1e811e5fc6fa6cfee566d7b764455c0468140365a737/jetton-utils.fc

```fc
#include "params.fc"; 

cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

slice calculate_jetton_wallet_address(cell state_init) inline;

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
```

## f95ba0330b38cdf3459b1e811e5fc6fa6cfee566d7b764455c0468140365a737/op-codes.fc

```fc
;; Minter
```

## f95ba0330b38cdf3459b1e811e5fc6fa6cfee566d7b764455c0468140365a737/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;
```

## fc00a29dd0205bcdcc0d3ffb9ca38cc3c8c159ec60d8aa543240a92f10592d40/nft-auction.func

```func
;;
;;  main FunC file git@github.com:cryshado/nft-auc-contest.git
;;

#include "struct/op-codes.func";
#include "struct/exit-codes.func";
#include "struct/math.func";
#include "struct/msg-utils.func";
#include "struct/storage.func";
#include "struct/handles.func";
#include "struct/get-met.func";

{-
    SHOULD
    [+] accept coins for deploy
    [+] accept nft and change auction statud
    [+] return transaction if auction already end
    [+] can cancel auction
    [+] accept new bid -> check auction end -> end auction
-}
() recv_internal(int my_balance, int msg_value, cell in_msg_cell, slice in_msg_body) impure;

            ;; special case for repeat end_auction logic if nft not transfered from auc contract
            ;; way to fix unexpected troubles with auction contract
            ;; for example if some one transfer nft to this contract
        ;; accept coins for deploy

{-
    Message for deploy contract external
-}
() recv_external(slice in_msg) impure;
```

## fc00a29dd0205bcdcc0d3ffb9ca38cc3c8c159ec60d8aa543240a92f10592d40/stdlib.fc

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

## fc00a29dd0205bcdcc0d3ffb9ca38cc3c8c159ec60d8aa543240a92f10592d40/struct/exit-codes.func

```func
;;
;;  custom TVM exit codes
;;
```

## fc00a29dd0205bcdcc0d3ffb9ca38cc3c8c159ec60d8aa543240a92f10592d40/struct/get-met.func

```func
(int, int) get_nft_owner() method_id;

(int, int) get_nft_addr() method_id;

(int, int) get_last_member() method_id;
    ;; trhow error of addr not std

(int, int) get_mp_addr() method_id;
    ;; trhow error of addr not std

(int, int) get_mp_fee_addr() method_id;
    ;; trhow error of addr not std

(int, int) get_royalty_fee_addr() method_id;
    ;; trhow error of addr not std

(int, int, int, int) get_fees_info() method_id;

(int, int, int, int, int) get_bid_info() method_id;

;; 1  2    3    4      5      6      7    8      9    10     11   12   13     14   15   16   17   18   19   20
(int, int, int, slice, slice, slice, int, slice, int, slice, int, int, slice, int, int, int, int, int, int, int) get_sale_data() method_id;
```

## fc00a29dd0205bcdcc0d3ffb9ca38cc3c8c159ec60d8aa543240a92f10592d40/struct/handles.func

```func
;;
;;  function handlers
;;

() handle::return_transaction(slice sender_addr) impure inline_ref {

{-
    SHOULD
    [+] check init auction or not
    [+] check op
    [+] change nft owner
    [+] change auction status
-}
() handle::try_init_auction(slice sender_addr, slice in_msg_body) impure inline_ref {
    pack_data();

{-
    SHOULD
    [+] return prev bid 
    [+] return nft to owner
    [+] reserve 0,001 ton 
-}
() handle::try_cancel(slice in_msg_body) impure inline_ref {
            exit::not_cancel(),
    );

    raw_reserve(1000000, 0); ;; reserve some bebras  🐈

    pack_data();

{-
    SHOULD
    [+] transfer nft
    [+] send marketplace fee
    [+] send royalty fee
    [+] reserve 0,001 ton 
    [+] send profit to previous nft owner
    [+] change auction status
-}
() handle::end_auction() impure inline_ref {

        raw_reserve(1000000, 0); ;; reserve some bebras  🐈

        raw_reserve(1000000, 0); ;; reserve some bebras  🐈

    pack_data();

{-
    SHOULD 
    [+] check if first bid
    [+] check time  
    [+] check bid step amount
    [+] check init auction or not 
    [+] return prev bid
    [+] change bid info
    [+] check max bid
-}
() handle::new_bid(slice sender_addr, int msg_value) impure inline_ref {

        handle::return_transaction(sender_addr);
        handle::end_auction();

        handle::end_auction();

    ;; 990(now) 1000(end time) 100(try step time)

    ifnot(last_bid) {
        pack_data();

        handle::return_transaction(sender_addr);

    pack_data();
```

## fc00a29dd0205bcdcc0d3ffb9ca38cc3c8c159ec60d8aa543240a92f10592d40/struct/math.func

```func
;;
;;  math utils
;;

int division(int a, int b);
    return muldiv(a, 1000000000 {- 1e9 -}, b);

int multiply(int a, int b);
    return muldiv (a, b, 1000000000 {- 1e9 -});
```

## fc00a29dd0205bcdcc0d3ffb9ca38cc3c8c159ec60d8aa543240a92f10592d40/struct/msg-utils.func

```func
;;
;;  text constants for msg comments
;;
```

## fc00a29dd0205bcdcc0d3ffb9ca38cc3c8c159ec60d8aa543240a92f10592d40/struct/op-codes.func

```func
;;
;;  op codes
;;
```

## fc00a29dd0205bcdcc0d3ffb9ca38cc3c8c159ec60d8aa543240a92f10592d40/struct/storage.func

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

;; fees cell (ref)
global slice    mp_fee_addr; ;; the address of the marketplace where the commission goes;
global int      mp_fee_factor; ;;;
global int      mp_fee_base; ;;;
global slice    royalty_fee_addr; ;; the address of the collection owner where the commission goes;
global int      royalty_fee_factor; ;;;
global int      royalty_fee_base; ;;;

;; bids info cell (ref)
global int      min_bid; ;; minimal bid;
global int      max_bid; ;; maximum bid;
global int      min_step; ;; minimum step (can be 0);
global slice    last_member; ;; last member address;
global int      last_bid; ;; last bid amount;
global int      last_bid_at; ;; timestamp of last bid;
global int      end_time; ;; unix end time;
global int      step_time; ;; by how much the time increases with the new bid (e.g. 30);
global int      try_step_time; ;; after what time to start increasing the time (e.g. 60);

;; nft info cell (ref)
global slice    nft_owner; ;; nft owner addres (should be sent nft if auction canceled or money from auction);
global slice    nft_addr; ;; nft address;

() init_data() impure inline_ref {- save for get methods -} {
    ifnot(null?(init?)) { return ();}

() pack_data() impure inline_ref;
    ;; total: (267 * 2) + (32 * 4) = 662 maximum bits

    ;; total 32*4 + 124*4 + 267 = 891

    ;; total: 267 * 2 = 534 maximum bits
```

## fe05b9f31a4c200ef51036d05a7ce05fd4b024716c4a8bcbc56c603302e1e3a9/contract/contracts/messages/metadata-messages.tact

```tact
// ---------------------------------------
// Metadata
// ---------------------------------------
struct MetadataState {
    avatar: String;
    name: String;
    about: String;
    website: String;
    terms: String;
    telegram: String;
    github: String;
    jetton: Address;
    nft: Address;
    hide: Bool;
    dns: String;
}
```

## fe05b9f31a4c200ef51036d05a7ce05fd4b024716c4a8bcbc56c603302e1e3a9/contract/contracts/metadata.tact

```tact
import "@stdlib/deploy";
import "./messages/metadata-messages";

contract Metadata with Deployable {
    avatar: String;
    name: String;
    about: String;
    website: String;
    terms: String;
    telegram: String;
    github: String;
    jetton: Address;
    nft: Address;
    hide: Bool;
    dns: String;
    jetton: Address, nft: Address, hide: Bool, dns: String) {;
    receive();
    get fun state(): MetadataState;
    avatar: self.avatar,;
    name: self.name,;
    about: self.about,;
    website: self.website,;
    terms: self.terms,;
    telegram: self.telegram,;
    github: self.github,;
    jetton: self.jetton,;
    nft: self.nft,;
    hide: self.hide ,;
    dns: self.dns;
}
```

## fe05b9f31a4c200ef51036d05a7ce05fd4b024716c4a8bcbc56c603302e1e3a9/output/verifier_Metadata.code.fc

```fc
#pragma version =0.4.3;
#pragma allow-post-modification;
#pragma compute-asm-ltr;

#include "verifier_Metadata.headers.fc";
#include "verifier_Metadata.stdlib.fc";
#include "verifier_Metadata.storage.fc";

;;
;; Contract Metadata functions
;;

(slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) $Metadata$_contract_init(slice $avatar, slice $name, slice $about, slice $website, slice $terms, slice $telegram, slice $github, slice $jetton, slice $nft, int $hide, slice $dns) impure inline_ref {

((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice), (slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice)) $Metadata$_fun_state((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) $self) impure inline_ref {

;;
;; Receivers of a Contract Metadata
;;

(((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice)), ()) %$Metadata$_internal_empty((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) $self) impure inline {

(((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice)), ()) $Metadata$_internal_binary_Deploy((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) $self, (int) $deploy) impure inline {

;;
;; Get methods of a Contract Metadata
;;

_ %state() method_id(77589) {

_ supported_interfaces() method_id;

_ get_abi_ipfs() method_id;

_ lazy_deployment_completed() method_id;

;;
;; Routing of a Contract Metadata
;;

((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice), int) $Metadata$_contract_router_internal((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) self, int msg_bounced, slice in_msg) impure inline_ref {
    ;; Handle bounced messages

    ;; Parse incoming message

    ;; Receive empty message

    ;; Receive Deploy message

() recv_internal(int msg_value, cell in_msg_cell, slice in_msg) impure;

    ;; Context

    ;; Load contract data

    ;; Handle operation

    ;; Throw if not handled

    ;; Persist state
```

## fe05b9f31a4c200ef51036d05a7ce05fd4b024716c4a8bcbc56c603302e1e3a9/output/verifier_Metadata.headers.fc

```fc
;;
;; Header files for Metadata
;; NOTE: declarations are sorted for optimal order
;;

;; __tact_verify_address
slice __tact_verify_address(slice address) inline;

;; __tact_load_address
(slice, slice) __tact_load_address(slice cs) inline;

;; __tact_store_address
builder __tact_store_address(builder b, slice address) inline;

;; __tact_my_balance
int __tact_my_balance() inline;

;; __tact_not_null
forall X -> X __tact_not_null(X x) inline;

;; __tact_context_get
(int, slice, int, slice) __tact_context_get() inline;

;; __tact_context_get_sender
slice __tact_context_get_sender() inline;

;; __tact_store_bool
builder __tact_store_bool(builder b, int v) inline;

;; $Deploy$_load
(slice, ((int))) $Deploy$_load(slice sc_0) inline;

;; $DeployOk$_store

;; $DeployOk$_store_cell

;; $Metadata$_store

;; $Metadata$_load
(slice, ((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice))) $Metadata$_load(slice sc_0) inline;

;; $StateInit$_not_null
((cell, cell)) $StateInit$_not_null(tuple v) inline;

;; $MetadataState$_to_external
(slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) $MetadataState$_to_external(((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice)) v) inline;

;; $Metadata$init$_load
(slice, ((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice))) $Metadata$init$_load(slice sc_0) inline_ref;

;; $Metadata$_contract_init
(slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) $Metadata$_contract_init(slice $avatar, slice $name, slice $about, slice $website, slice $terms, slice $telegram, slice $github, slice $jetton, slice $nft, int $hide, slice $dns) impure inline_ref;

;; $Metadata$_contract_load
(slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) $Metadata$_contract_load() impure inline_ref;

;; $Metadata$_contract_store
() $Metadata$_contract_store((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) v) impure inline;

;; $global_send
() $global_send((int, slice, int, int, cell, cell, cell) $params) impure inline_ref;

;; $MetadataState$_constructor_avatar_name_about_website_terms_telegram_github_jetton_nft_hide_dns
((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice)) $MetadataState$_constructor_avatar_name_about_website_terms_telegram_github_jetton_nft_hide_dns(slice avatar, slice name, slice about, slice website, slice terms, slice telegram, slice github, slice jetton, slice nft, int hide, slice dns) inline;

;; $Metadata$_fun_state
((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice), (slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice)) $Metadata$_fun_state((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) $self) impure inline_ref;

;; $SendParameters$_constructor_bounce_to_value_mode_body_code_data
((int, slice, int, int, cell, cell, cell)) $SendParameters$_constructor_bounce_to_value_mode_body_code_data(int bounce, slice to, int value, int mode, cell body, cell code, cell data) inline;

;; $Metadata$_fun_forward
((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice), ()) $Metadata$_fun_forward((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) $self, slice $to, cell $body, int $bounce, tuple $init) impure inline_ref;

;; $Metadata$_fun_notify
((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice), ()) $Metadata$_fun_notify((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) $self, cell $body) impure inline;

;; $DeployOk$_constructor_queryId
((int)) $DeployOk$_constructor_queryId(int queryId) inline;
```

## fe05b9f31a4c200ef51036d05a7ce05fd4b024716c4a8bcbc56c603302e1e3a9/output/verifier_Metadata.stdlib.fc

```fc
global (int, slice, int, slice) __tact_context;;
global slice __tact_context_sender;;
global cell __tact_context_sys;;
global int __tact_randomized;;

slice __tact_verify_address(slice address) inline;

(slice, slice) __tact_load_address(slice cs) inline;

builder __tact_store_address(builder b, slice address) inline;

int __tact_my_balance() inline;

forall X -> X __tact_not_null(X x) inline;

(int, slice, int, slice) __tact_context_get() inline;

slice __tact_context_get_sender() inline;

builder __tact_store_bool(builder b, int v) inline;

forall X0, X1 -> (X0, X1) __tact_tuple_destroy_2(tuple v);

() $global_send((int, slice, int, int, cell, cell, cell) $params) impure inline_ref {
    send_raw_message($c, $params'mode);

((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice), ()) $Metadata$_fun_forward((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) $self, slice $to, cell $body, int $bounce, tuple $init) impure inline_ref {
            raw_reserve(0, 0);

((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice), ()) $Metadata$_fun_notify((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) $self, cell $body) impure inline {
```

## fe05b9f31a4c200ef51036d05a7ce05fd4b024716c4a8bcbc56c603302e1e3a9/output/verifier_Metadata.storage.fc

```fc
;;
;; Type: StateInit
;; TLB: _ code:^cell data:^cell = StateInit
;;

((cell, cell)) $StateInit$_not_null(tuple v) inline {

;;
;; Type: SendParameters
;; TLB: _ bounce:bool to:address value:int257 mode:int257 body:Maybe ^cell code:Maybe ^cell data:Maybe ^cell = SendParameters
;;

((int, slice, int, int, cell, cell, cell)) $SendParameters$_constructor_bounce_to_value_mode_body_code_data(int bounce, slice to, int value, int mode, cell body, cell code, cell data) inline {

;;
;; Type: Deploy
;; Header: 0x946a98b6
;; TLB: deploy#946a98b6 queryId:uint64 = Deploy
;;

(slice, ((int))) $Deploy$_load(slice sc_0) inline {

;;
;; Type: DeployOk
;; Header: 0xaff90f57
;; TLB: deploy_ok#aff90f57 queryId:uint64 = DeployOk
;;

((int)) $DeployOk$_constructor_queryId(int queryId) inline {

;;
;; Type: MetadataState
;; TLB: _ avatar:^string name:^string about:^string website:^string terms:^string telegram:^string github:^string jetton:address nft:address hide:bool dns:^string = MetadataState
;;

(slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) $MetadataState$_to_external(((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice)) v) inline {

((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice)) $MetadataState$_constructor_avatar_name_about_website_terms_telegram_github_jetton_nft_hide_dns(slice avatar, slice name, slice about, slice website, slice terms, slice telegram, slice github, slice jetton, slice nft, int hide, slice dns) inline {

;;
;; Type: Metadata
;;

(slice, ((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice))) $Metadata$_load(slice sc_0) inline {

(slice, ((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice))) $Metadata$init$_load(slice sc_0) inline_ref {

(slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) $Metadata$_contract_load() impure inline_ref {
        ;; Allow only workchain deployments

() $Metadata$_contract_store((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) v) impure inline {
```

## fe9530d3243853083ef2ef0b4c2908c0abf6fa1c31ea243aacaa5bf8c7d753f1/wallet_v2_r2.fif

```fif
"TonUtil.fif" include
"Asm.fif" include
<{ SETCP0 DUP IFNOTRET // return if recv_internal
   DUP 85143 INT EQUAL OVER 78748 INT EQUAL OR IFJMP:<{ // "seqno" and "get_public_key" get-methods
     1 INT AND c4 PUSHCTR CTOS 32 LDU 256 PLDU CONDSEL  // cnt or pubk
   }>
   INC 32 THROWIF	// fail unless recv_external
   9 PUSHPOW2 LDSLICEX DUP 32 LDU 32 LDU	//  signature in_msg msg_seqno valid_until cs
   SWAP NOW LEQ 35 THROWIF	//  signature in_msg msg_seqno cs
   c4 PUSH CTOS 32 LDU 256 LDU ENDS	//  signature in_msg msg_seqno cs stored_seqno public_key
   s3 s1 XCPU	//  signature in_msg public_key cs stored_seqno msg_seqno stored_seqno
   EQUAL 33 THROWIFNOT	//  signature in_msg public_key cs stored_seqno
   s0 s3 XCHG HASHSU	//  signature stored_seqno public_key cs hash
   s0 s4 s2 XC2PU CHKSIGNU 34 THROWIFNOT	//  cs stored_seqno public_key
   ACCEPT
   s0 s2 XCHG	//  public_key stored_seqno cs
   WHILE:<{
     DUP SREFS	//  public_key stored_seqno cs _40
   }>DO<{	//  public_key stored_seqno cs
     // 3 INT 35 LSHIFT# 3 INT RAWRESERVE    // reserve all but 103 Grams from the balance
     8 LDU LDREF s0 s2 XCHG	//  public_key stored_seqno cs _45 mode
     SENDRAWMSG	//  public_key stored_seqno cs
   }>
   ENDS INC	//  public_key seqno'
   NEWC 32 STU 256 STU ENDC c4 POP
}>c
```

## feb5ff6820e2ff0d9483e7e0d62c817d846789fb4ae580c878866d959dabd5c0/stdlib.fc

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

## feb5ff6820e2ff0d9483e7e0d62c817d846789fb4ae580c878866d959dabd5c0/wallet-v4-code.fc

```fc
#pragma version =0.2.0;
;; Wallet smart contract with plugins

(slice, int) dict_get?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTGET" "NULLSWAPIFNOT";
(cell, int) dict_add_builder?(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTADDB";
(cell, int) dict_delete?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTDEL";

() recv_internal(int msg_value, cell in_msg_cell, slice in_msg) impure;
    ;; ignore all bounced messages
    ;; ignore simple transfers
    ;; ignore all messages not related to plugins
    ;; it may be a transfer

    ;; return coins only if bounce expected

() recv_external(slice in_msg) impure;

;; Get methods

int seqno() method_id;

int get_subwallet_id() method_id;

int get_public_key() method_id;

int is_plugin_installed(int wc, int addr_hash) method_id;

tuple get_plugin_list() method_id;
```


