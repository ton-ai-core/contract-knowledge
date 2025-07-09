
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

## 314104528800afba2e46dcc38529332976e942ddda5f6613a3668a118b19cdf6/minter/minter_errors.func

```func
const MINTER::ERR::CODE_BASE;

const MINTER::ERR::EMPTY_PROXY_WHITELIST;
const MINTER::ERR::INVALID_PROXY_ID;
const MINTER::ERR::INVALID_PROXY;
const MINTER::ERR::INVALID_PROXY_TYPE;
```

## 314104528800afba2e46dcc38529332976e942ddda5f6613a3668a118b19cdf6/minter/minter_op.func

```func
const MINTER::OP::CODE_BASE;

const MINTER::OP::UPDATE_PRICE;
const MINTER::OP::UPDATE_PRICE_INC;
const MINTER::OP::UPDATE_CONTENT;

const MINTER::OP::UPDATE_PROXY_WHITELIST;
const MINTER::OP::UPDATE_CODE_AND_DATA;
```

## 314104528800afba2e46dcc38529332976e942ddda5f6613a3668a118b19cdf6/minter/minter_params.func

```func
const MINTER::MIN_TON_STORAGE;

const MINTER::MINT_FEE;
const MINTER::BURN_FEE;
const MINTER::QUERY_FEE;
```

## 314104528800afba2e46dcc38529332976e942ddda5f6613a3668a118b19cdf6/proxy_errors.func

```func
;; inheritate from common
const PROXY_COMMON::ERR::CODE_BASE;
;; errcodes

const PROXY_COMMON::ERR::INVALID_AMOUNT;
const PROXY_COMMON::ERR::INVALID_TON_AMOUNT;
const PROXY_COMMON::ERR::INVALID_UTON_AMOUNT;
const PROXY_COMMON::ERR::WRONG_CALLER;
const PROXY_COMMON::ERR::INSUFFICIENT_BALANCE;
const PROXY_COMMON::ERR::UNAUTHORIZED;
const PROXY_COMMON::ERR::NOT_ENABLED;
const PROXY_COMMON::ERR::INSUFFICIENT_VALUE;
const PROXY_COMMON::ERR::INVALID_RECIPIENT_ADDRESS;
const PROXY_COMMON::ERR::INVALID_WITHDRAW_AMOUNT;
const PROXY_COMMON::ERR::INSUFFICIENT_WITHDRAW_CAPACITY;
const PROXY_COMMON::ERR::TON_RECEIVER_NOT_SET;
const PROXY_COMMON::ERR::UTON_RECEIVER_NOT_SET;
const PROXY_COMMON::ERR::BOUNCE_INVALID_OP;
const PROXY_COMMON::ERR::CAPACITY_NOT_ENOUGH;
```

## 314104528800afba2e46dcc38529332976e942ddda5f6613a3668a118b19cdf6/proxy_events.func

```func
#include "imports/stdlib.fc";
#include "./proxy_params.func";

const PROXY_TON::EVENT::CODE_BASE;

const PROXY_TON::EVENT::WITHDRAW;
() emit_withdraw_log(slice user_address, int withdraw_id, int ton_amount, slice recipient_address, int withdraw_timestamp) impure;
```

## 314104528800afba2e46dcc38529332976e942ddda5f6613a3668a118b19cdf6/proxy_op.func

```func
;; inheritate from common
const PROXY_COMMON::OP::CODE_BASE;

;; opcodes
const PROXY_COMMON::OP::QUERY;
const PROXY_COMMON::OP::QUERY_ACK;
const PROXY_COMMON::OP::STAKE;
const PROXY_COMMON::OP::BURN_NOTIFICATION;

;; admin
const PROXY_COMMON::OP::UPDATE_WHALE;
const PROXY_COMMON::OP::UPDATE_ADMIN;
const PROXY_COMMON::OP::ACCEPT_ADMIN;
const PROXY_COMMON::OP::UPDATE_UTON_RECEIVER;
const PROXY_COMMON::OP::UPDATE_TON_RECEIVER;
const PROXY_COMMON::OP::EXTRACT_ASSETS;
const PROXY_COMMON::OP::UPDATE_CAPACITY;
```

## 314104528800afba2e46dcc38529332976e942ddda5f6613a3668a118b19cdf6/proxy_params.func

```func
const PROXY_COMMON::PRICE_BASE;
const PROXY_COMMON::PROXY_ID_LEN;
const PROXY_COMMON::PROXY_TYPE_LEN;

const PROXY_COMMON::WORKCHAIN;
const PROXY_COMMON::ONE_DAY;

const PROXY_COMMON::EVENT_LEN;
```

## 314104528800afba2e46dcc38529332976e942ddda5f6613a3668a118b19cdf6/proxy_ton/proxy_ton.func

```func
#include "../imports/stdlib.fc";
#include "../uton/libs/libs_utils.func";

#include "../uton/minter_params.func";
#include "../uton/wallet_params.func";

#include "withdraw/withdraw_op.func";
#include "withdraw/withdraw_params.func";
#include "withdraw/withdraw_utils.func";

#include "../proxy_events.func";

#include "../proxy_errors.func";
#include "../proxy_op.func";
#include "../proxy_standard_op.func";

#include "proxy_ton_op.func";
#include "proxy_ton_params.func";
#include "proxy_ton_storage.func";

global int proxy_type;;
global int proxy_id;;
global int withdraw_pending_time;;
global int debt_ton;;
global slice utonic_minter_address;;
global slice ton_receiver_address;;
global slice admin_address;;
global slice pending_admin_address;;
global cell withdraw_code;;

() load_global_data() impure inline;

() save_global_data() impure inline;

() _send_ton(int query_id, int ton_amount, slice recipient_address, int send_all_fee) impure;
        ;; .store_uint(PROXY_COMMON::OP::STAKE_SAVE, 32)
        ;; .store_uint(query_id, 64);

() proxy_stake(int query_id, slice in_msg_body, slice sender_address, int my_ton_balance, int fwd_fee, int msg_value) impure;

    ;; throw_unless(PROXY_COMMON::ERR::TON_RECEIVER_NOT_SET, ton_receiver_address.preload_uint(2) != 0);

    ;; throw_unless(PROXY_COMMON::ERR::TON_RECEIVER_NOT_SET, ton_receiver_address.preload_uint(2) != 0);

    ;; then send notify msg to utonic minter(jetton master)

        ;; todo determine msg value for burn notification

() _pending_withdraw(

        withdraw_id, user_address, my_address(), utonic_minter_address, withdraw_code
    );

() burn(int query_id, slice sender_address, slice in_msg_body, int my_ton_balance, int fwd_fee, int msg_value) impure;

    ;; check wallet address

    ;; create a pending withdraw for user
        ;; .store_coins(0) 

() withdraw(int query_id, slice sender_address, slice in_msg_body, int my_ton_balance, int fwd_fee, int msg_value) impure;

        ;; .store_uint(PROXY_COMMON::OP::WITHDRAW_FUND, 32)
        ;; .store_uint(query_id, 64);

() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

        ;; just deposit

    ;; admin operate

(int, int, int, int, slice, slice, slice, slice) get_proxy_ton_data() method_id;

slice get_withdraw_address(slice owner_address, int withdraw_id) method_id;
```

## 314104528800afba2e46dcc38529332976e942ddda5f6613a3668a118b19cdf6/proxy_ton/proxy_ton_op.func

```func
const PROXY_TON::OP::CODE_BASE;

const PROXY_TON::OP::UPDATE_RECEIVER;
const PROXY_TON::OP::SEND_TON;
const PROXY_TON::OP::UPDATE_WITHDRAW_PENDING_TIME;
const PROXY_TON::OP::WITHDRAW_NOTIFICATION;
```

## 314104528800afba2e46dcc38529332976e942ddda5f6613a3668a118b19cdf6/proxy_ton/proxy_ton_params.func

```func
const PROXY_TON::MIN_TON_STORAGE;
const PROXY_TON::TRANSFER_NOTIFICATION_FEE;
const PROXY_TON::TRANSFER_FEE;
const PROXY_TON::MINT_FEE;

const PROXY_TON::BURN_FEE;
const PROXY_TON::WITHDRAW_FEE;
```

## 314104528800afba2e46dcc38529332976e942ddda5f6613a3668a118b19cdf6/proxy_ton/proxy_ton_storage.func

```func
(int, int, int, int, slice, slice, slice, slice, cell) load_data() inline;

() save_data(

  set_data(begin_cell()
    );
```

## 314104528800afba2e46dcc38529332976e942ddda5f6613a3668a118b19cdf6/proxy_ton/withdraw/withdraw.func

```func
#include "../../imports/stdlib.fc";
#include "../../uton/libs/libs_utils.func";

#include "../../uton/minter_params.func";

#include "../proxy_ton_op.func";
#include "../proxy_ton_params.func";

#include "../../proxy_op.func";
#include "../../proxy_standard_op.func";
#include "../../proxy_utils.func";
#include "../../proxy_errors.func";

#include "withdraw_op.func";
#include "withdraw_params.func";
#include "withdraw_storage.func";
#include "withdraw_errors.func";

global int withdraw_id;;
global int uton_amount;;
global int ton_amount;;
global int burn_price;;
global int burn_timestamp;;
global int withdraw_timestamp;;
global int finished;;
global slice owner_address;;
global slice proxy_address;;
global slice utonic_minter_address;;

() load_global_data() impure inline;

() save_global_data() impure inline;

() init_withdraw_data (slice in_msg_body, slice sender_address, int my_ton_balance, int fwd_fee, int msg_value) impure;

() withdraw_ton (slice in_msg_body, slice sender_address, int my_ton_balance, int fwd_fee, int msg_value) impure;

() query_ack (slice in_msg_body, slice sender_address, int my_ton_balance, int fwd_fee, int msg_value) impure;

() on_bounce (slice in_msg_body) impure;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

(int, int, int, int, int, int, int, slice, slice) get_withdraw_data() method_id;
```

## 314104528800afba2e46dcc38529332976e942ddda5f6613a3668a118b19cdf6/proxy_ton/withdraw/withdraw_errors.func

```func
const WITHDRAW::ERR::CODE_BASE;

const WITHDRAW::ERR::PENDING_TIME_NOT_EXPIRED;
const WITHDRAW::ERR::FINISHED;
const WITHDRAW::ERR::BOUNCE_ERR_INVALID_OP;
```

## 314104528800afba2e46dcc38529332976e942ddda5f6613a3668a118b19cdf6/proxy_ton/withdraw/withdraw_op.func

```func
const WITHDRAW::OP::CODE_BASE;

const WITHDRAW::OP::INIT_WITHDRAW_DATA;
const WITHDRAW::OP::WITHDRAW;
```

## 314104528800afba2e46dcc38529332976e942ddda5f6613a3668a118b19cdf6/proxy_ton/withdraw/withdraw_params.func

```func
const WITHDRAW::MIN_TON_STORAGE;
const WITHDRAW::INIT_FEE;
const WITHDRAW::WITHDRAW_FEE;
const WITHDRAW::QUERY_ACK_FEE;
```

## 314104528800afba2e46dcc38529332976e942ddda5f6613a3668a118b19cdf6/proxy_ton/withdraw/withdraw_storage.func

```func
#include "withdraw_utils.func";

(int, int, int, int, int, int, int, slice, slice, slice) load_data() inline;

() save_data (
) impure inline {
    set_data(pack_withdraw_data(
        lc_withdraw_id,
        lc_uton_amount, 
        lc_ton_amount,
        lc_burn_price,
        lc_burn_timestamp,
        lc_withdraw_timestamp,
        lc_finished,
        lc_owner_address, 
        lc_master_address,
        lc_utonic_minter_address
    ));
```

## 314104528800afba2e46dcc38529332976e942ddda5f6613a3668a118b19cdf6/proxy_ton/withdraw/withdraw_utils.func

```func
#include "../../proxy_params.func";

  ;; todo

cell calculate_withdraw_state_init(int withdraw_id, slice owner_address, slice proxy_address, slice utonic_minter_address, cell withdraw_code) inline;

slice calculate_withdraw_address(cell state_init) inline;

slice calculate_user_withdraw_address(slice owner_address, int withdraw_id, slice proxy_address, slice utonic_minter_address, cell withdraw_code) inline;
```

## 314104528800afba2e46dcc38529332976e942ddda5f6613a3668a118b19cdf6/proxy_utils.func

```func
#include "./proxy_standard_op.func";
#include "./proxy_params.func";

() refund_fee(int query_id, slice response_address, int msg_value);

(int) get_day(int timestamp) inline;

(int) get_current_day() inline;

(int) get_price(int last_price_day, int last_price, int price_inc, int current_day) inline;

(int) get_ton_amount(int uton_amount, int price) inline;

(int) get_uton_amount(int ton_amount, int price) inline;
```

## 314104528800afba2e46dcc38529332976e942ddda5f6613a3668a118b19cdf6/standard/standard_op.func

```func
const OP::EXCESSES;
const JETTON::OP::TRANSFER;
const JETTON::OP::TRANSFER_NOTIFICATION;
const JETTON::OP::INTERNAL_TRANSFER;
const JETTON::OP::BURN;
const JETTON::OP::BURN_NOTIFICATION;
```

## 314104528800afba2e46dcc38529332976e942ddda5f6613a3668a118b19cdf6/uton/libs/libs_utils.func

```func
#include "../../proxy_params.func";

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

## 314104528800afba2e46dcc38529332976e942ddda5f6613a3668a118b19cdf6/wallet/wallet_errors.func

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

## 314104528800afba2e46dcc38529332976e942ddda5f6613a3668a118b19cdf6/wallet/wallet_params.func

```func
const WALLET::MIN_TON_STORAGE;
const WALLET::SEND_FEE;
const WALLET::MINT_FEE;
const WALLET::RECEIVE_FEE;
const WALLET::BURN_FEE;
```

## 32050dfac44f64866bcc86f2cd9e1305fe9dcadb3959c002237cfb0902d44323/imports/stdlib.fc

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

## 32050dfac44f64866bcc86f2cd9e1305fe9dcadb3959c002237cfb0902d44323/nft-fixprice-sale-v3.fc

```fc
;; NFT sale smart contract v3

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

    ;; alow cancel complete contract for fix bug with duplicate transfet nft to sale

        ;; way to fix unexpected troubles with sale contract
        ;; for example if some one transfer nft to this contract

    ;; Throw if sale is complete

() recv_external(slice in_msg) impure;

(int, int, int, slice, slice, slice, int, slice, int, slice, int) get_sale_data() method_id;
```

## 32050dfac44f64866bcc86f2cd9e1305fe9dcadb3959c002237cfb0902d44323/op-codes.fc

```fc
;; NFTEditable

;; SBT
```

## 329f70e8e61178bad64e3036c30890a6abc740bcacf90fb30a8fe9e043e83ce8/imports/constants.fc

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

## 329f70e8e61178bad64e3036c30890a6abc740bcacf90fb30a8fe9e043e83ce8/imports/stdlib.fc

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

## 329f70e8e61178bad64e3036c30890a6abc740bcacf90fb30a8fe9e043e83ce8/imports/utils.fc

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

## 329f70e8e61178bad64e3036c30890a6abc740bcacf90fb30a8fe9e043e83ce8/loan.fc

```fc
#include "imports/utils.fc";

global slice elector;;
global slice treasury;;
global slice validator;;
global int round_since;;

() save_data(builder current_elector) impure inline;

() load_data() impure inline;

() send_new_stake(slice src, slice s) impure inline;

() send_recover_stake(slice src, slice s) impure inline;

() recover_stake_result(slice src, int op, slice s) impure inline_ref;

() on_bounce(slice src, slice s) impure;

        ;; the elector does not throw because format of new_stake_msg is already checked,
        ;; however, its code might change in the future, so let's handle a potential throw

        ;; the elector does not throw, but we'll handle it in case the elector's code has changed

() recv_internal(cell in_msg_full, slice in_msg_body) impure;

var get_loan_state() method_id;
```

## 33000786b703197f1216b092a83a0cd01a2e9ea4fff1e75605870281f21177c0/contracts/imports/error-codes.fc

```fc
const int error::unknown_op;
const int error::wrong_workchain;

const int error::malformed_forward_payload;
const int error::not_enough_tons;

const int error::unknown_action;
const int error::unknown_action_bounced;
```

## 33000786b703197f1216b092a83a0cd01a2e9ea4fff1e75605870281f21177c0/contracts/imports/messages.fc

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

## 33000786b703197f1216b092a83a0cd01a2e9ea4fff1e75605870281f21177c0/contracts/imports/op-codes.fc

```fc
const int op::excesses;
```

## 33000786b703197f1216b092a83a0cd01a2e9ea4fff1e75605870281f21177c0/contracts/imports/params.fc

```fc
#include "error-codes.fc";

const int workchain;

() force_chain(slice addr) impure;
```

## 33000786b703197f1216b092a83a0cd01a2e9ea4fff1e75605870281f21177c0/contracts/imports/stdlib.fc

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

## 33000786b703197f1216b092a83a0cd01a2e9ea4fff1e75605870281f21177c0/contracts/imports/utils.fc

```fc
#include "params.fc";
#include "messages.fc";
#include "op-codes.fc";

const int jetton_transfer_amount;

() emit_log_simple (int event_id, cell data, int need_separate_cell) impure inline;
    ;; 1023 - (4+2+9+256+64+32+2) = 654 bit free

() send_excess(slice address, int query_id) impure inline;
```

## 33000786b703197f1216b092a83a0cd01a2e9ea4fff1e75605870281f21177c0/contracts/nft/error-codes.fc

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

## 33000786b703197f1216b092a83a0cd01a2e9ea4fff1e75605870281f21177c0/contracts/nft/nft-item.fc

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

## 33000786b703197f1216b092a83a0cd01a2e9ea4fff1e75605870281f21177c0/contracts/nft/op-codes.fc

```fc
const int op::burn;

;; marketplace
const int op::deploy_sale_batch;
const int op::change_admin;
const int op::set_fee;
const int op::withdraw_tons;
```

## 337ed9a988cb88d8faa197fecda8faff97dbd3010d5a898641334fecec62f952/common/stdlib.func

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

## 337ed9a988cb88d8faa197fecda8faff97dbd3010d5a898641334fecec62f952/imports/op-codes.fc

```fc
const int op::transfer;
const int op::ownership_assigned;
const int op::owner_request;
const int op::owner_response;
const int op::excesses;
const int op::start;
```

## 337ed9a988cb88d8faa197fecda8faff97dbd3010d5a898641334fecec62f952/imports/utils.fc

```fc
const int workchain;

const int prize::coins;
const int prize::nft;

const int nft_message_value;

;; Calculated fees
const int deploy_ticket_fee;

const int draw_base_fee;
const int one_coin_prize_fee;
const int one_nft_prize_fee;
const int one_ticket_iteration_fee;

const int minimum_balance;

slice to_string(int n);

(cell, ()) shuffle_dict(cell dict, int key_len, int dict_size) impure {
  ;; replace each element with a random one
  ;; usage: ex_dict~shuffle_dict(32, 10)

int tickets_limit(int c, int n) method_id;
  ;; around 3600 is how many tickets is possible to
  ;; draw with 1 coin and 1 nft prize to fit in 1 TON gas limit

int calc_prize_pool(int my_balance, int c, int n, int t) method_id;
  ;; nft_message_value * prizes because contract sends all the owner requests at a time. And some responses are coming first.

builder message_builder(slice dst, int amount);

() topup_service_wallets(cell service_wallets, int amount) impure;

cell calculate_nft_item_state_init(int item_index, cell nft_item_code);

slice calculate_nft_item_address(int wc, cell state_init);

() deploy_nft_item(int item_index, cell nft_item_code, int draw_time, int amount, slice owner_address) impure;

() force_chain(slice addr) impure;
```

## 337ed9a988cb88d8faa197fecda8faff97dbd3010d5a898641334fecec62f952/ticket.fc

```fc
;;             Fortuna.ton
;;  Ticket smart contract by TONLab.pro
;;  Implements NFT Item Interface

;;
;;  Storage
;;
;;  uint16 index
;;  MsgAddressInt collection_address
;;  MsgAddressInt owner_address
;;  uint32 last_draw_time
;;  ^Cell individual_content
;;

#include "imports/stdlib.fc";
#include "imports/op-codes.fc";
#include "imports/utils.fc";

const int minimum_ticket_balance;

(int, int, slice, slice, int) load_data();

() store_data(int index, slice collection_address, slice owner_address, int last_draw_time) impure;

() send_transfer_notification(slice to_address, slice from_address, int my_balance, int query_id, int fwd_fee) impure inline;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

    ;; ticket stays in the wallet, so owner can immitate the transfer

;;
;;  GET Methods
;;

(int, int, slice, slice, cell) get_nft_data() method_id;

int get_draw_time() method_id;
```

## 353904f55a3042df45b784a969b05a56d36c4cfd16727fbf076a611d09e60c79/collection_exotic_sbt.fc

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

## 353904f55a3042df45b784a969b05a56d36c4cfd16727fbf076a611d09e60c79/imports/params.fc

```fc
#include "stdlib.fc";

const int workchain;

() force_chain(slice addr) impure;

slice null_addr();
```

## 353904f55a3042df45b784a969b05a56d36c4cfd16727fbf076a611d09e60c79/imports/stdlib.fc

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

## 353904f55a3042df45b784a969b05a56d36c4cfd16727fbf076a611d09e60c79/op-codes.fc

```fc
;; NFTEditable

;; SBT
```

## 3ba6528ab2694c118180aa3bd10dd19ff400b909ab4dcf58fc69925b2c7b12a6/Wallet.fc

```fc
{- small stdlib -}

int now();
slice my_address();

int cell_hash(cell c);
int slice_hash(slice s);
int check_signature(int hash, slice signature, int public_key);

cell get_data();
() set_data(cell c) impure asm "c4 POP";

() accept_message() impure asm "ACCEPT";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";

int slice_bits(slice s);
int slice_refs(slice s);
int builder_bits(builder b);

(slice, int) ~load_uint(slice s, int len);
(slice, cell) load_ref(slice s);
(slice, slice) load_msg_addr(slice s);
cell preload_ref(slice s);

builder begin_cell();
builder store_ref(builder b, cell c);
builder store_slice(builder b, slice s);
builder store_varuint(builder b, int x);
cell end_cell(builder b);

slice begin_parse(cell c);
() end_parse(slice s) impure asm "ENDS";

{- method ids -}

;; sendTransaction(address,uint128,bool,uint8,cell)()v2
int is_method_send_transaction(int function_id);

;; sendTransactionRaw(uint8,cell)()v2
int is_method_send_transaction_raw(int function_id);

{- helpers -}

;; Returns (body, (stored_timestamp, stored_pubkey, function id))
    ;; Read signature

    ;; Load persistent data

    ;; Prepend address to the body

    ;; Read `pubkey` header

    ;; Read `time`, `expire` headers and function id

    ;; Check signature

    ;; Check `expire` header

    ;; Check `time` header

{- entries -}

() recv_internal(slice in_msg) impure;
    ;; do nothing for internal messages

() recv_external(slice body) impure;

        ;; CommonMsgInfo (part 1)
        ;; 0 1 x 0 00 = 0x10 (bounce:0) or 0x18 (bounce:1)
        ;; \ \ \ \ ^^ src:addr_none$00
        ;;  \ \ \ * bounced:Bool
        ;;   \ \ * bounce:Bool
        ;;    \ * ihr_disabled:Bool
        ;;     * int_msg_info$0

        ;; CommonMsgInfo (part 2)
        ;; 1 bit - amount (empty currency collection extra)
        ;; 4 bits - ihr_fee
        ;; 4 bits - fwd_fee
        ;; 64 bits - created_lt
        ;; 32 bits - created_at
        ;; ---
        ;; 1 bit - empty state init

    ;; Store persistent data
```

## 40cc7aec870089010b9c2751245304f089f049e0b6797190ddd78481ddfde82a/imports/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;

slice null_addr();
```

## 40cc7aec870089010b9c2751245304f089f049e0b6797190ddd78481ddfde82a/op-codes.fc

```fc
;; NFTEditable

;; SBT
```

## 40cc7aec870089010b9c2751245304f089f049e0b6797190ddd78481ddfde82a/single.fc

```fc
#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/op_codes.fc";

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

## 40cc7aec870089010b9c2751245304f089f049e0b6797190ddd78481ddfde82a/stdlib.fc

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

## 431e1485b326a1c600baf02dc3e4cb6339a1538a92ebc4e3ce5daa7100f6c79b/contracts/gas.fc

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

## 431e1485b326a1c600baf02dc3e4cb6339a1538a92ebc4e3ce5daa7100f6c79b/contracts/imports/stdlib_modern.fc

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

## 431e1485b326a1c600baf02dc3e4cb6339a1538a92ebc4e3ce5daa7100f6c79b/contracts/jetton-utils.fc

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

## 431e1485b326a1c600baf02dc3e4cb6339a1538a92ebc4e3ce5daa7100f6c79b/contracts/jetton-wallet.fc

```fc
;; Jetton Wallet Smart Contract

#pragma version >=0.4.3;

#include "stdlib.fc";
#include "op-codes.fc";
#include "workchain.fc";
#include "jetton-utils.fc";
#include "gas.fc";
#include "proofs.fc";

{-
  Storage

  Status == 0: airdrop not claimed
         == 1: airdrop is claimed

  storage#_ status:uint4
            balance:Coins owner_address:MsgAddressInt
            jetton_master_address:MsgAddressInt
            merkle_root:uint256 = Storage;
-}

global int merkle_root;;
global int salt;;

(int, int, slice, slice) load_data() inline;

() save_data(int status, int balance, slice owner_address, slice jetton_master_address) impure inline;

() send_jettons(slice in_msg_body, slice sender_address, int my_ton_balance, int msg_value, int fwd_fee) impure inline_ref;
    ;; see transfer TL-B layout in jetton.tlb

        ;; first outgoing transfer can be from just deployed jetton wallet
        ;; in this case we need to reserve TON for storage

        ;; custom payload processing is not constant gas, account for that via gas_consumed()

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

int is_claimed() method_id;
```

## 431e1485b326a1c600baf02dc3e4cb6339a1538a92ebc4e3ce5daa7100f6c79b/contracts/op-codes.fc

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

## 431e1485b326a1c600baf02dc3e4cb6339a1538a92ebc4e3ce5daa7100f6c79b/contracts/proofs.fc

```fc
#include "stdlib.fc";
;; Copy from https://github.com/ton-community/compressed-nft-contract
(slice, int) begin_parse_exotic(cell x);
(slice, int) dict_get?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTGET" "NULLSWAPIFNOT";

const int error::not_exotic;
const int error::not_merkle_proof;
const int error::wrong_hash;
const int error::leaf_not_found;
const int error::airdrop_not_found;
const int cell_type::merkle_proof;

(cell, int) extract_merkle_proof(cell proof) impure;

cell check_merkle_proof(cell proof, int expected_hash) impure;

;;https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb#L105
const int ADDRESS_SLICE_LENGTH;
const int TIMESTAMP_SIZE;

(int, int, int) get_airdrop_params(cell submitted_proof, int proof_root, slice owner);
```

## 431e1485b326a1c600baf02dc3e4cb6339a1538a92ebc4e3ce5daa7100f6c79b/contracts/workchain.fc

```fc
#include "stdlib.fc";
#include "op-codes.fc";

const MY_WORKCHAIN;

int is_same_workchain(slice addr) inline;

() check_same_workchain(slice addr) impure inline;
```

## 44b620ffb4f57f55e943dc492ad5a3df0abe34262593667aee7db06fd8c030ad/bridge-config.fc

```fc
(int, int, cell) get_bridge_config() impure inline_ref;
  ;; wc always equals to -1
```

## 44b620ffb4f57f55e943dc492ad5a3df0abe34262593667aee7db06fd8c030ad/bridge_code.fc

```fc
(slice, (int, int, int)) load_fees(slice s) inline {

(int, int, slice, (int, int, int)) load_data() inline_ref {

() save_data(int state_flags, int total_locked, slice collector_address, fees) impure inline_ref;

int calculate_fee(int msg_value, fees);

;; create swap to external chain to destination address
() create_swap_from_ton(int destination_address, int amount, slice s_addr, int query_id, int is_text) impure;

() process_comment_api_request (slice in_msg, int msg_value, slice s_addr) impure;

() execute_voting (slice s_addr, slice voting_data, int bridge_address) impure;

    ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000

    ;; reserve total_locked + 100 Toncoins for storage fees

() recv_internal(int msg_value, cell in_msg_cell, slice in_msg) impure;
    ;; ignore all bounced messages

;; get methods

_ get_bridge_data() method_id;
```

## 44b620ffb4f57f55e943dc492ad5a3df0abe34262593667aee7db06fd8c030ad/message_utils.fc

```fc
() send_receipt_message(addr, ans_tag, query_id, body, grams, mode) impure inline_ref;
  ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000

() send_text_receipt_message(addr, grams, mode) impure inline_ref;
  ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000

() emit_log_simple (int event_id, slice data) impure inline;
```

## 44b620ffb4f57f55e943dc492ad5a3df0abe34262593667aee7db06fd8c030ad/stdlib.fc

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

## 44b620ffb4f57f55e943dc492ad5a3df0abe34262593667aee7db06fd8c030ad/text_utils.fc

```fc

```

## 45f99e717173f80754380738336b41b417c7ee36ed70f1777055cbbfa7f0e537/contract/contracts/jetton.tact

```tact
import "@stdlib/ownable";
import "./messages";

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
```

## 45f99e717173f80754380738336b41b417c7ee36ed70f1777055cbbfa7f0e537/contract/contracts/messages.tact

```tact
struct JettonData {
    totalSupply: Int;
    mintable: Bool;
    owner: Address;
    content: Cell;
    walletCode: Cell;
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

## 45f99e717173f80754380738336b41b417c7ee36ed70f1777055cbbfa7f0e537/contract/contracts/test_ton_token.tact

```tact
import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages.tact";
import "./jetton.tact";

// message Mint {
//     amount: Int;
//     receiver: Address;
// }

contract TestTonToken with Deployable, Jetton {
    totalSupply: Int as coins;
    owner: Address;
    content: Cell;
    mintable: Bool;
    max_supply: Int as coins;
    init(owner: Address, content: Cell, max_supply: Int);
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/lz/EpConfig.fc

```fc
#include "../../funC++/classlib.fc";

;; ERRORS
const int lz::EpConfig::ERROR::sameMsglib;
const int lz::EpConfig::ERROR::invalidTimeoutExpiry;
const int lz::EpConfig::ERROR::invalidTimeoutReceiveMsglib;
const int lz::EpConfig::VALID;

;; required storage name
const int lz::EpConfig::NAME;

;; field names
const int lz::EpConfig::isNull;
const int lz::EpConfig::sendMsglibManager;
const int lz::EpConfig::sendMsglib;
const int lz::EpConfig::sendMsglibConnection;
const int lz::EpConfig::receiveMsglib;
const int lz::EpConfig::receiveMsglibConnection;
const int lz::EpConfig::timeoutReceiveMsglib;
const int lz::EpConfig::timeoutReceiveMsglibConnection;
const int lz::EpConfig::timeoutReceiveMsglibExpiry;

) impure inline method_id {
        lz::EpConfig::NAME,
        unsafeTuple([
            [cl::t::bool, isNull],                            ;; lz::EpConfig::isNull
            [cl::t::address, sendMsglibManager],              ;; lz::EpConfig::sendMsglibManager
            [cl::t::address, sendMsglib],                     ;; lz::EpConfig::sendMsglib
            [cl::t::address, sendMsglibConnection],           ;; lz::EpConfig::sendMsglibConnection
            [cl::t::address, receiveMsglib],                  ;; lz::EpConfig::receiveMsglib
            [cl::t::address, receiveMsglibConnection],        ;; lz::EpConfig::receiveMsglibConnection
            [cl::t::address, timeoutReceiveMsglib],           ;; lz::EpConfig::timeoutReceiveMsglib
            [cl::t::address, timeoutReceiveMsglibConnection], ;; lz::EpConfig::timeoutReceiveMsglibConnection
            [cl::t::uint64, timeoutReceiveMsglibExpiry]       ;; lz::EpConfig::timeoutReceiveMsglibExpiry
        ])
    );

) impure inline method_id {
        isNull,
        sendMsglibManager,
        sendMsglib,
        NULLADDRESS,
        receiveMsglib,
        NULLADDRESS,
        timeoutReceiveMsglib,
        NULLADDRESS,
        timeoutReceiveMsglibExpiry
    );

        true,
        NULLADDRESS,
        NULLADDRESS,
        NULLADDRESS,
        NULLADDRESS,
        NULLADDRESS,
        NULLADDRESS,
        NULLADDRESS,
    );

;; ====================== Object Multi-Getters =====================

;; in root cell
const int lz::EpConfig::_isNullOffset;
const int lz::EpConfig::_sendMsglibManagerOffset;
const int lz::EpConfig::_sendMsglibOffset;

;; in ref[2]
const int lz::EpConfig::_sendMsglibConnectionOffset;
const int lz::EpConfig::_receiveMsglibOffset;
const int lz::EpConfig::_receiveMsglibConnectionOffset;

;; in ref[3]
const int lz::EpConfig::_timeoutReceiveMsglibOffset;
const int lz::EpConfig::_timeoutReceiveMsglibConnectionOffset;
const int lz::EpConfig::_timeoutReceiveMsglibExpiryOffset;

;; (isNull, sendMsglibManager, sendMsglib, sendMsglibConnection)
(int, int, int, int) lz::EpConfig::deserializeSendConfig(cell $self) impure inline {
    );

;; (isNull, receiveMsglibConnection)
(int, int) lz::EpConfig::deserializeReceiveConfig(cell $self) impure inline {
    );

;; ====================== Object Validators =====================

        ;; If the timeout receive msglib is null, the expiry must be 0
        ;; if the timeout receive msglib is not null, the expiry must be in the future
        ;; the receive msglib and timeout receive msglib must be different

    );
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/lz/Packet.fc

```fc
#include "../../funC++/classlib.fc";
#include "../../funC++/constants.fc";

#include "Path.fc";

;; required storage name
const int lz::Packet::NAME;

;; field names
const int lz::Packet::path;
const int lz::Packet::message;
const int lz::Packet::nonce;
const int lz::Packet::guid;

const int lz::Packet::ERROR::INVALID_MESSAGE;
const int lz::Packet::ERROR::INVALID_NONCE;
const int lz::Packet::ERROR::INVALID_PACKET_FIELD;

const int lz::Packet::MAX_RECEIVE_MESSAGE_CELLS;
const int lz::Packet::MAX_SEND_MESSAGE_CELLS;

        lz::Packet::NAME,
        unsafeTuple([
            [cl::t::objRef, $path],             ;; lz::Packet::path
            [cl::t::cellRef, message],          ;; lz::Packet::message
            [cl::t::uint64, nonce],             ;; lz::Packet::nonce
            [cl::t::uint256, 0]                 ;; lz::Packet::guid
        ])
    );

const int lz::Packet::_headerInfoBits;
const int lz::Packet::_headerFillerBits;
const int lz::Packet::_headerInfo;

;; this function is unused by the protocol but will be used by OApps

;; this function is unused by the protocol but will be used by OApps

;; ====================== Object Accessors =====================

const int lz::Packet::_nonceOffset;
const int lz::Packet::_guidOffset;

;; this function is unused by the protocol but will be used by OApps

;; returns (path, message, nonce, guid)
(cell, cell, int, int) lz::Packet::deserialize(cell $self) impure inline {
    );

;; ====================== Object Composite Modifiers =====================

;; NOTE: this assumes that the placement of the first field is before the second field
) impure inline method_id {

        lz::Packet::ERROR::INVALID_PACKET_FIELD,
        (max(field1Bytes, field2Bytes) > MAX_CELL_BYTES)
    );

    ;; short-circuit the common case to save gas
                itr,
                field1EndPosBits,
                0,
            ))
                itr,
            ))

                itr,
                0,
            );

                itr,
            );

                begin_cell()
            );
                begin_cell()
                    scutlast(
                        itr,
            );
                begin_cell()
                    scutlast(
                        itr,
            );

;; ====================== Object Utilities =====================

        begin_cell()
    );

;; ====================== Object Validators =====================

;; assumes that the message is a valid single-linked list

() lz::Packet::_assertValidLinkedList(cell head, int maxLen) impure inline {
                lz::Packet::ERROR::INVALID_MESSAGE,
            );
    throw(lz::Packet::ERROR::INVALID_MESSAGE);

() lz::Packet::assertValidSendMessage(cell $self) impure inline {
    lz::Packet::_assertValidLinkedList(
        lz::Packet::MAX_SEND_MESSAGE_CELLS
    );

() lz::Packet::assertValidReceiveMessage(cell $self) impure inline {
    lz::Packet::_assertValidLinkedList(
        lz::Packet::MAX_RECEIVE_MESSAGE_CELLS
    );
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/lz/Path.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int lz::Path::NAME;

;; field names
const int lz::Path::srcEid;
const int lz::Path::srcOApp;
const int lz::Path::dstEid;
const int lz::Path::dstOApp;

;; In all blockchains with atomic cross-contract call, we can use src/dst/srcOApp/dstOApp
;; because the send channel doesn't exist (it's just a nonce).
;; In TON, we need both send/receive channels, so we use srcOApp/dstOApp to provide
;; a context-free way to refer to the two ends of the channel.
;; The direction is inferred by the context of the contract (send vs receive).
;; The srcOApp is the 256-bit hashpart of a standard address.
        lz::Path::NAME,
        unsafeTuple([
            [cl::t::uint32, srcEid],    ;; lz::Path::srcEid
            [cl::t::address, srcOApp],  ;; lz::Path::srcOApp
            [cl::t::uint32, dstEid],    ;; lz::Path::dstEid
            [cl::t::address, dstOApp]   ;; lz::Path::dstOApp
        ])
    );

const int lz::Path::_headerInfoBits;
const int lz::Path::_headerFillerBits;
const int lz::Path::_headerInfo;

;; this function is unused by the protocol but will be used by OApps

;; ====================== Object Getters =====================

const int lz::Path::_srcEidOffset;
const int lz::Path::_srcOAppOffset;
const int lz::Path::_dstEidOffset;
const int lz::Path::_dstOAppOffset;

;; ====================== Storage Composite Accessors =====================

;; (srcEid, dstEid)
(int, int) lz::Path::getEidAndDstEid(cell $self) impure inline {
    );

;; (srcEid, srcOApp, dstEid, dstOApp)
(int, int, int, int) lz::Path::deserialize(cell $self) impure inline {
    );

;; ====================== Object Mutators =====================

;; low-level optimized version
;; original: 12k gas
;; optimized: 1k gas

    );
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/lz/ReceiveEpConfig.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int lz::ReceiveEpConfig::NAME;

;; field names
const int lz::ReceiveEpConfig::receiveMsglibConnection;
const int lz::ReceiveEpConfig::timeoutReceiveMsglibConnection;
const int lz::ReceiveEpConfig::expiry;

) impure inline method_id {
        lz::ReceiveEpConfig::NAME,
        unsafeTuple([
            [cl::t::address, receiveMsglibConnectionAddress],        ;; lz::ReceiveEpConfig::receiveMsglibConnection
            [cl::t::address, timeoutReceiveMsglibConnectionAddress], ;; lz::ReceiveEpConfig::timeoutReceiveMsglibConnection
            [cl::t::uint64, expiry]                                  ;; lz::ReceiveEpConfig::expiry
        ])
    );

;; ====================== Object Builders =====================

const int lz::ReceiveEpConfig::_headerInfoBits;
const int lz::ReceiveEpConfig::_headerFillerBits;
const int lz::ReceiveEpConfig::_headerInfo;

) impure inline {

;; ====================== Object Getters =====================

const int lz::ReceiveEpConfig::_receiveMsglibConnectionOffset;
const int lz::ReceiveEpConfig::_timeoutReceiveMsglibConnectionOffset;
const int lz::ReceiveEpConfig::_expiryOffset;
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/lz/SendEpConfig.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int lz::SendEpConfig::NAME;

;; field names
const int lz::SendEpConfig::sendMsglibManager;
const int lz::SendEpConfig::sendMsglib;
const int lz::SendEpConfig::sendMsglibConnection;

        lz::SendEpConfig::NAME,
        unsafeTuple([
            [cl::t::address, sendMsglibManager],        ;; lz::SendEpConfig::sendMsglibManager
            [cl::t::address, sendMsglib],               ;; lz::SendEpConfig::sendMsglib
            [cl::t::address, sendMsglibConnection]      ;; lz::SendEpConfig::sendMsglibConnection
        ])
    );

;; ====================== Object Builders =====================

;; everything fits in the root cell
const int lz::SendEpConfig::_headerInfoBits;
const int lz::SendEpConfig::_headerFillerBits;
const int lz::SendEpConfig::_headerInfo;

            begin_cell()

;; root cell offsets
const int lz::SendEpConfig::_sendMsglibManagerOffset;
const int lz::SendEpConfig::_sendMsglibOffset;

;; ref[2] offsets
const int lz::SendEpConfig::_sendMsglibConnectionOffset;

;; ====================== Object Getters =====================

;; ====================== Object Multi-Getters =====================

;; (sendMsglibManager, sendMsglib, sendMsglibConnection)
(int, int, int) lz::SendEpConfig::deserialize(cell $self) impure inline {
    );
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/ChannelNonceInfo.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int md::ChannelNonceInfo::NAME;

;; field names
const int md::ChannelNonceInfo::nonce;
const int md::ChannelNonceInfo::firstUnexecutedNonce;

        md::ChannelNonceInfo::NAME,
        unsafeTuple([
            [cl::t::uint64, nonce], ;; md::ChannelNonceInfo::nonce
            [cl::t::uint64, firstUnexecutedNonce]   ;; md::ChannelNonceInfo::firstUnexecutedNonce
        ])
    );

;; ====================== Object Getters =====================

const int md::ChannelNonceInfo::_nonceOffset;
const int md::ChannelNonceInfo::_firstUnexecutedNonceOffset;

(int, int) md::ChannelNonceInfo::deserialize(cell $self) impure inline {
    );
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/CoinsAmount.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int md::CoinsAmount::NAME;

;; field names
const int md::CoinsAmount::amount;

        md::CoinsAmount::NAME,
        unsafeTuple([
            [cl::t::coins, amount] ;; md::CoinsAmount::amount
        ])
    );

;; ========================== Sanitize ==========================
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/ExtendedMd.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int md::ExtendedMd::NAME;

;; field names
const int md::ExtendedMd::md;
const int md::ExtendedMd::obj;
const int md::ExtendedMd::forwardingAddress;

        md::ExtendedMd::NAME,
        unsafeTuple([
            [cl::t::objRef, $md],                ;; md::ExtendedMd::md
            [cl::t::objRef, $obj],               ;; md::ExtendedMd::obj
            [cl::t::address, forwardingAddress]  ;; md::ExtendedMd::forwardingAddress
        ])
    );

const int md::ExtendedMd::_headerInfoBits;
const int md::ExtendedMd::_headerFillerBits;
const int md::ExtendedMd::_headerInfo;

;; ====================== Object Getters =====================

const int md::ExtendedMd::_forwardingAddressOffset;

;; ====================== Object Multi-Getters =====================

(cell, int) md::ExtendedMd::getMdAndForwardingAddress(cell $self) impure inline {
    );

(cell, cell, int) md::ExtendedMd::deserialize(cell $self) impure inline {
    );

;; ====================== Sanitize =====================
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/LzReceivePrepare.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int md::LzReceivePrepare::NAME;

;; field names
const int md::LzReceivePrepare::nonce;
const int md::LzReceivePrepare::nanotons;

        md::LzReceivePrepare::NAME,
        unsafeTuple([
            [cl::t::uint64, nonce], ;; md::LzReceivePrepare::nonce
            [cl::t::coins, nanotons] ;; md::LzReceivePrepare::nanotons
        ])
    );

;; ====================== Object Getters =====================

const int md::LzReceivePrepare::_nonceOffset;
const int md::LzReceivePrepare::_nanotonsOffset;

;; this function is unused by the protocol but will be used by OApps

;; ====================== Object Multi-Getters =====================

(int, int) md::LzReceivePrepare::deserialize(cell $self) impure inline {
    );
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/LzReceiveStatus.fc

```fc
#include "../lz/Packet.fc";

;; required storage name
const int md::LzReceiveStatus::NAME;

;; field names
const int md::LzReceiveStatus::success;
const int md::LzReceiveStatus::nonce;
const int md::LzReceiveStatus::value;
const int md::LzReceiveStatus::extraData;
const int md::LzReceiveStatus::reason;
const int md::LzReceiveStatus::sender;
const int md::LzReceiveStatus::packet;
const int md::LzReceiveStatus::executionStatus;

        md::LzReceiveStatus::NAME,
        unsafeTuple([
            [cl::t::bool, success],             ;; md::LzReceiveStatus::success
            [cl::t::uint64, nonce],             ;; md::LzReceiveStatus::nonce
            [cl::t::coins, 0],                  ;; md::LzReceiveAlert::value
            [cl::t::cellRef, empty_cell()],     ;; md::LzReceiveAlert::extraData
            [cl::t::cellRef, empty_cell()],     ;; md::LzReceiveAlert::reason
            [cl::t::address, NULLADDRESS],      ;; md::LzReceiveAlert::sender
            [cl::t::objRef, cl::nullObject()],  ;; md::LzReceiveAlert::packet
            [cl::t::uint8, 0]                   ;; md::LzReceiveAlert::executionStatus
        ])
    );

) impure inline method_id {
    lz::Packet::_assertValidLinkedList(extraData, lz::Packet::MAX_RECEIVE_MESSAGE_CELLS);
    lz::Packet::_assertValidLinkedList(reason, lz::Packet::MAX_RECEIVE_MESSAGE_CELLS);
        md::LzReceiveStatus::NAME,
        unsafeTuple([
            [cl::t::bool, success],         ;; md::LzReceiveStatus::success
            [cl::t::uint64, nonce],         ;; md::LzReceiveStatus::nonce
            [cl::t::coins, value],          ;; md::LzReceiveAlert::sendRequestId
            [cl::t::cellRef, extraData],    ;; md::LzReceiveAlert::extraData
            [cl::t::cellRef, reason],       ;; md::LzReceiveAlert::reason
            [cl::t::address, sender],       ;; md::LzReceiveAlert::sender
            [cl::t::objRef, $packet],       ;; md::LzReceiveAlert::packet
            [cl::t::uint8, executionStatus] ;; md::LzReceiveAlert::executionStatus
        ])
    );

;; ====================== Object Builders =====================

const int md::LzReceiveStatus::_headerInfoBits;
const int md::LzReceiveStatus::_headerFillerBits;
const int md::LzReceiveStatus::_headerInfo;

;; this function is unused by the protocol but will be used by OApps
) impure inline method_id {
            begin_cell()

;; ====================== Object Multi-Getters =====================

const int md::LzReceiveStatus::_successOffset;
const int md::LzReceiveStatus::_nonceOffset;
const int md::LzReceiveStatus::_valueOffset;
const int md::LzReceiveStatus::_senderOffset;
const int md::LzReceiveStatus::_executionStatusOffset;
const int md::LzReceiveStatus::_extraDataOffset;

(int, int) md::LzReceiveStatus::getSuccessAndNonce(cell $self) impure inline {
    );

;; ========================== Sanitize ==========================

        success,
        nonce,
        value,
        extraData,
        reason,
        sender,
        $packet,
        executionStatus
    );
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/LzSend.fc

```fc
#include "../../funC++/classlib.fc";
#include "../lz/Packet.fc";

;; required storage name
const int md::LzSend::NAME;

;; field names
const int md::LzSend::sendRequestId;
const int md::LzSend::sendMsglibManager;
const int md::LzSend::sendMsglib;
const int md::LzSend::sendMsglibConnection;
const int md::LzSend::packet;
const int md::LzSend::nativeFee;
const int md::LzSend::zroFee;
const int md::LzSend::extraOptions;
const int md::LzSend::enforcedOptions;
const int md::LzSend::callbackData;

) impure inline method_id {
        md::LzSend::NAME,
        unsafeTuple([
            [cl::t::uint64, 0],                 ;; md::LzSend::sendRequestId
            [cl::t::address, NULLADDRESS],      ;; md::LzSend::sendMsglibManager
            [cl::t::address, NULLADDRESS],      ;; md::lzSend::sendMsglib
            [cl::t::address, NULLADDRESS],      ;; md::lzSend::sendMsglibConnection
            [cl::t::objRef, $packet],           ;; md::LzSend::packet
            [cl::t::coins, nativeFee],          ;; md::LzSend::nativeFee
            [cl::t::coins, zroFee],             ;; md::LzSend::zroFee
            [cl::t::objRef, $extraOptions],     ;; md::LzSend::extraOptions
            [cl::t::objRef, $enforcedOptions],  ;; md::LzSend::enforcedOptions
            [cl::t::objRef, callbackData]       ;; md::LzSend::callbackData
        ])
    );

const int md::LzSend::_headerPostNameBits;
const int md::LzSend::_headerFillerBits;
const int md::LzSend::_headerInfo;

;; ========================== Object Builders ==========================

;; this function is unused by the protocol but will be used by OApps
) impure inline {
            begin_cell()

;; ====================== Object Accessors =====================

;; in root cell
const int md::LzSend::_sendRequestIdffset;
const int md::LzSend::_sendMsglibManagerOffset;
const int md::LzSend::_sendMsglibOffset;

;; in ref[2]
const int md::LzSend::_sendMsglibConnectionOffset;
const int md::LzSend::_nativeFeeOffset;
const int md::LzSend::_zroFeeOffset;

;; gets the path from the packet inside the LzSend

;; (requestId, nativeFee, zroFee, extraOptions, enforcedOptions, sendMsglibManager)
(int, int, int, cell, cell, int) md::LzSend::deserializeSendCallback(cell $self) impure inline {
    );

;; (packet, extraOptions, enforcedOptions)
(cell, cell, cell) md::LzSend::getQuoteInformation(cell $self) impure inline {
    );

(cell, cell) md::LzSend::getPacketAndCallbackData(cell $self) impure inline {
    );

;; ====================== Object Composite Modifiers =====================

const int md::lzSend::requestInfoWidth;
;; Can't easily store a slice constant because the header isn't byte-aligned
const int md::lzSend::_headerInfoBits;
const int md::lzSend::_headerPrefix;
const int md::lzSend::_headerSuffix;
const int md::lzSend::_headerTrailingBits;

) impure inline method_id {

    ;; Fill in the fields AND overwrite the entire header to match the expected format
            begin_cell()
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/MdAddress.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int md::MdAddress::NAME;

;; field names
const int md::MdAddress::md;
const int md::MdAddress::address;

        md::MdAddress::NAME,
        unsafeTuple([
            [cl::t::objRef, $md],       ;; md::MdAddress::md
            [cl::t::address, address]   ;; md::MdAddress::address
        ])
    );

;; ========================== Object Builders ==========================

const int md::MdAddress::_headerInfoBits;
const int md::MdAddress::_headerFillerBits;
const int md::MdAddress::_headerInfo;

;; ========================== Object Getters ==========================

const int md::MdAddress::_addressOffset;

;; ========================== Object Multi-Getters ==========================

(cell, int) md::MdAddress::deserialize(cell $self) impure inline {
    );

;; ========================== Sanitize ==========================
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/MdObj.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int md::MdObj::NAME;

;; field names
const int md::MdObj::md;
const int md::MdObj::obj;

        md::MdObj::NAME,
        unsafeTuple([
            [cl::t::objRef, $md],   ;; md::MdObj::md
            [cl::t::objRef, $obj]   ;; md::MdObj::obj
        ])
    );

;; ========================== Object Builders ==========================
const int md::MdObj::_headerInfoBits;
const int md::MdObj::_headerFillerBits;
const int md::MdObj::_headerInfo;

;; ========================== Object Multi-Getters ==========================

(cell, cell) md::MdObj::deserialize(cell $self) impure inline {
    );
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/MessagingReceipt.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int md::MessagingReceipt::NAME;

;; field names
const int md::MessagingReceipt::lzSend;
const int md::MessagingReceipt::nativeFeeActual;
const int md::MessagingReceipt::zroFeeActual;
const int md::MessagingReceipt::errorCode;

        md::MessagingReceipt::NAME,
        unsafeTuple([
            [cl::t::objRef, $lzSend],   ;; md::MessagingReceipt::lzSend
            [cl::t::coins, nativeFee],  ;; md::MessagingReceipt::nativeFeeActual
            [cl::t::coins, zroFee],     ;; md::MessagingReceipt::zroFeeActual
            [cl::t::uint16, errorCode]  ;; md::MessagingReceipt::errorCode
        ])
    );

;; ========================== Object Builders ==========================

const int md::MessagingReceipt::_headerInfoBits;
const int md::MessagingReceipt::_headerFillerBits;
const int md::MessagingReceipt::_headerInfo;

;; ========================== Object Accessors ==========================

const int md::MessagingReceipt::_nativeFeeOffset;
const int md::MessagingReceipt::_zroFeeOffset;
const int md::MessagingReceipt::_errorCodeOffset;

;; this function is unused by the protocol but will be used by OApps
(int, cell) md::MessagingReceipt::getErrorCodeAndLzSend(cell $self) impure inline {
    );
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/MsglibSendCallback.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int md::MsglibSendCallback::NAME;

;; field names
const int md::MsglibSendCallback::nativeFee;
const int md::MsglibSendCallback::zroFee;
const int md::MsglibSendCallback::lzSend;
const int md::MsglibSendCallback::packetEncoded;
const int md::MsglibSendCallback::payees;
const int md::MsglibSendCallback::nonceByteOffset;
const int md::MsglibSendCallback::nonceBytes;
const int md::MsglibSendCallback::guidByteOffset;
const int md::MsglibSendCallback::guidBytes;
const int md::MsglibSendCallback::msglibSendEvents;
const int md::MsglibSendCallback::errorCode;

) impure inline method_id {
        md::MsglibSendCallback::NAME,
        unsafeTuple([
            [cl::t::coins, nativeFee],          ;; md::MsglibSendCallback::nativeFee
            [cl::t::coins, zroFee],             ;; md::MsglibSendCallback::zroFee
            [cl::t::objRef, $lzSend],           ;; md::MsglibSendCallback::lzSend
            [cl::t::cellRef, packetEncoded],    ;; md::MsglibSendCallback::packetEncoded
            [cl::t::cellRef, payees],           ;; md::MsglibSendCallback::payees
            [cl::t::uint16, nonceByteOffset],   ;; md::MsglibSendCallback::nonceByteOffset
            [cl::t::uint8, nonceBytes],         ;; md::MsglibSendCallback::nonceBytes
            [cl::t::uint16, guidByteOffset],    ;; md::MsglibSendCallback::guidByteOffset
            [cl::t::uint8, guidBytes],          ;; md::MsglibSendCallback::guidBytes
            [cl::t::objRef, $msglibSendEvents], ;; md::MsglibSendCallback::msglibEvents
            [cl::t::uint8, errorCode]           ;; md::MsglibSendCallback::errorCode
        ])
    );

;; ========================== Object Builders ==========================

const int md::MsglibSendCallback::_headerInfoBits;
const int md::MsglibSendCallback::_headerFillerBits;
const int md::MsglibSendCallback::_headerInfo;

) impure inline {
            begin_cell()

;; ========================== Object Getters ==========================

const int md::MsglibSendCallback::_nativeFeeOffset;
const int md::MsglibSendCallback::_zroFeeOffset;
const int md::MsglibSendCallback::_nonceByteOffsetOffset;
const int md::MsglibSendCallback::_nonceBytesOffset;
const int md::MsglibSendCallback::_guidByteOffsetOffset;
const int md::MsglibSendCallback::_guidBytesOffset;
const int md::MsglibSendCallback::_errorCodeOffset;

;; ========================== Object Multi-Getters ==========================

;; (errorCode, nativeFee, zroFee, lzSend, payees, encodedPacket, nonceByteOffset, nonceBytes, guidByteOffset, guidBytes, sendEvents)
(int, int, int, cell, cell, cell, int, int, int, int, cell) md::MsglibSendCallback::deserialize(cell $self) impure inline {

    );

;; ========================== Payees Utilities ==========================

const int payeesTuple::_addressIdx;
const int payeesTuple::_nativeAmountIdx;
const int payees::_addressBits;
const int payees::_nativeAmountBits;
const int payees::_payeeBits;

;; Serializes 3 payees (256-bit address => 64-bit TON coin amount) per cell.
cell serializePayees(tuple payeesInfo) impure inline;

;; deserializePayees will ignore any bits beyond 960
tuple deserializePayees(cell serializedPayees) impure inline;

        ;; can you extract a second one?

        ;; how about a third?

;; Pop the last payee off the output of deserializePayees
;; and return the modified payee list and the popped payee.
(tuple, [int, int]) tpopPayee(tuple t);
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/Nonce.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int md::Nonce::NAME;

;; field names
const int md::Nonce::nonce;

        md::Nonce::NAME,
        unsafeTuple([
            [cl::t::uint64, nonce] ;; md::Nonce::nonce
        ])
    );

;; ========================== Object Builders ==========================
const int md::Nonce::_headerInfoBits;
const int md::Nonce::_headerFillerBits;
const int md::Nonce::_headerInfo;

;; this function is unused by the protocol but will be used by OApps

;; ========================== Object Getters ==========================
const int md::Nonce::_nonceOffset;

;; ========================== Sanitize ==========================
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/PacketId.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int md::PacketId::NAME;

;; field names
const int md::PacketId::path;
const int md::PacketId::nonce;

        md::PacketId::NAME,
        unsafeTuple([
            [cl::t::objRef, $path], ;; md::PacketId::path
            [cl::t::uint64, nonce]  ;; md::PacketId::nonce
        ])
    );

;; ========================== Object Builders ==========================

const int md::PacketId::_headerInfoBits;
const int md::PacketId::_headerFillerBits;
const int md::PacketId::_headerInfo;

;; ========================== Sanitize ==========================
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/PacketSent.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int md::PacketSent::NAME;

;; field names
const int md::PacketSent::nativeFee;
const int md::PacketSent::zroFee;
const int md::PacketSent::extraOptions;
const int md::PacketSent::enforcedOptions;
const int md::PacketSent::packetEncoded;
const int md::PacketSent::nonce;
const int md::PacketSent::msglibAddress;
const int md::PacketSent::msglibSendEvents;

) impure inline method_id {
        md::PacketSent::NAME,
        unsafeTuple([
            [cl::t::coins, nativeFee],          ;; md::PacketSent::nativeFee
            [cl::t::coins, zroFee],             ;; md::PacketSent::zroFee
            [cl::t::objRef, $extraOptions],     ;; md::PacketSent::extraOptions
            [cl::t::objRef, $enforcedOptions],  ;; md::PacketSent::enforcedOptions
            [cl::t::cellRef, packetEncoded],    ;; md::PacketSent::packetEncoded
            [cl::t::uint64, nonce],             ;; md::PacketSent::nonce
            [cl::t::address, msglibAddress],    ;; md::PacketSent::msglibAddress
            [cl::t::objRef, $msglibSendEvents]  ;; md::PacketSent::msglibEvents
        ])
    );

;; ========================== Object Builders ==========================

const int md::PacketSent::_headerInfoBits;
const int md::PacketSent::_headerFillerBits;
const int md::PacketSent::_headerInfo;

) impure inline {
            begin_cell()
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/abstract/contractMainAbstract.fc

```fc
;; _executeOpcode is executed at the start of contractMain, after checking permissions.
;; Each contract implements a list of opcodes, which calls a handler as the entry point
;; of that opcode. The contract must be initialized in order to start executing opcodes.
;; @in the opcode to execute
;; @in the message data extracted from txnContext
;; @out tuple of resultant actions
tuple _executeOpcode(int op, cell $md) impure inline;

;; Actions are executed after the opcode is executed. Each opcode must emit a tuple
;; of actions, where each action is executed after the opcode is executed in order.
;; @in the action to execute
;; @in the value of the action
;; @out a bool that determines if excess balance is to be sent back to the origin.
int _executeAction(int actionType, tuple action) impure inline;
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/abstract/handlerAbstract.fc

```fc
;; Assert that the owner has sent an INITIALIZE opcode to this contract
() assertInitialized() impure inline;

;; Assert the identity of the caller for a given opcode
() checkPermissions(int op, cell $md) impure inline;

;; Initialize this contract
tuple initialize(cell $md) impure inline;

;; Authentication = the owner has deployed and sent at least one transaction to this contract
;; unauthenticated contracts cannot perform any actions.
;; Authentication enables sharded contracts to trust the identity and intention of other shards
() authenticateIfNecessary() impure inline;

;; Assert the caller is the owner of this contract
() assertOwner() impure inline;

;; Asserts permissions of caller for permissioned opcodes before executing opcode
;; @see contractMainAbstract.fc
() _checkPermissions(int op, cell $md) impure inline;
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/actions/call.fc

```fc
#include "utils.fc";
#include "../classlib.fc";

const int action::call::NAME;

const int action::call::to;
const int action::call::opcode;
const int action::call::md;

;; Call a method on the contract at address `to` with the given message data `md`
;; optionally provide value provisioned from this contract's balance
;; @terminal
return unsafeTuple([action::call::NAME, to, opcode, $md]);

;; returns true if equals
    );

;; overloaded when you want to pass 0 outflowNanos

;; overloaded when you want to pass 0 outflowNanos

int executeCall(tuple callAction) impure inline;
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/actions/deploy.fc

```fc
#include "utils.fc";

;;; =======================================================
;; Deploys a contract defined by the given code and storage object,
;; and calls the contract with the given message data.
;; Typical usage will be to deploy and initialize
;;; =======================================================
const int action::deploy::NAME;

const int action::deploy::code;
const int action::deploy::storage;
const int action::deploy::donationNanos;
const int action::deploy::opcode;
const int action::deploy::md;
;; @info reserve donationNanos nanoton as the deployed contract's rent + value
;; @info in addition to the message value, use from_balance nanoton
;; from the contract's balance to pay for the deploy
;; @info e.g., if from_balance == outflowNanos, the entire rent is paid from the deployer
;; contract's balance
const int action::deploy::outflowNanos;

;; @terminal
) impure inline {
        [action::deploy::NAME, code, $storage, donationNanos, opcode, $md, outflowNanos]
    );

    );
    );
    );

) impure inline {
        code,
        $storage,
        donationNanos,
        opcode,
        $md,
        outflowNanos
    );

) impure inline {
        actions
                code,
                $storage,
                donationNanos,
                opcode,
                $md,
                outflowNanos
            )),
        ()
    );

int executeDeploy(tuple action) impure inline;
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/actions/dispatch.fc

```fc
#include "utils.fc";

#include "call.fc";

const int action::dispatch::NAME;

const int action::dispatch::to;
const int action::dispatch::opcode;
const int action::dispatch::md;
const int action::dispatch::gasNanos;

;; Call a method on the contract at address `to` with the given message data `md`
;; optionally provide value provisioned from this contract's balance
;; @terminal
return unsafeTuple([action::dispatch::NAME, to, opcode, $md, gasNanos]);

;; returns true if equals
    );
    );

;; overloaded when you want to pass 0 outflowNanos

int executeDispatch(tuple dispatchAction);
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/actions/event.fc

```fc
#include "../baseInterface.fc";
#include "../classlib.fc";
#include "utils.fc";

const int action::event::NAME;

const int action::event::bodyIndex;

const int action::event::topic;
const int action::event::body;
const int action::event::initialStorage;

;; Interface function you must implement to get the event sink
int _getEventSink() impure inline;

;; @info Events in LZ contracts are internal messages to an event sink
;; where the resulting transaction always reverts
;; @non-terminal
        action::event::NAME,
        unsafeTuple([
            [cl::t::uint256, topic],
            [cl::t::objRef, $body],
            [cl::t::objRef, $initialStorage]
        ])
    );

const int action::event::_headerInfoBits;
const int action::event::_headerFillerBits;
const int action::event::_headerInfo;

        action::event::NAME, 
        action::event::build(topic, $body, $initialStorage)
    ]);

;; returns true if equals
    );

    );

;; interface this function because it requires passing the 'getInitialStorage' from the baseHandler
;; tuple _newAction<event>(int topic, cell $body) impure inline {
;;     return action::event::create(topic, $body, getInitialStorage());
;; }

int executeEvent(tuple action) impure inline;
    ;; send event to event sink
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/actions/payment.fc

```fc
#include "utils.fc";

const int action::payment::NAME;

;; @info the address to pay
const int action::payment::toAddress;
;; @info the amount to pay, in nanotons
const int action::payment::amount;
;; @info the amount of value to provision from this contract's balance
const int action::payment::outflowNanos;

;; @non-terminal
return unsafeTuple([action::payment::NAME, toAddress, amount, outflowNanos]);

;; returns true if equals
    );

int executePayment(tuple action) impure inline;

    ;; this being true means we're assuming there's going to
    ;; be some value left over after the payment is made
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/actions/utils.fc

```fc
#include "../txnContext.fc";

;; Small file for now, but a placeholder for generic actions utility functions

const int ACTIONS_OUTFLOW;

tuple emptyActions() inline;

;;; ======================================================================================
;; @info terminal actions are always sent using all non-reserved balance on the contract
() sendTerminalAction(int toAddress, cell messageBody, cell stateInit, int extraFlags) impure inline;

;; @info non-terminal actions must specify the amount of funds to send
() sendNonTerminalAction(int bounceable, int amount, int toAddress, cell messageBody, int extraFlags) impure inline;
;; @param donationNanos: the amount of TON that the sender intended to be
;; withheld within our contract
;; @info baseHandler::refund_addr is the last known "origin" of a message
;; flow, and is used to refund the sender if the handler does not
;; use all remaining value from the in_message
cell buildLayerzeroMessageBody(int donationNanos, int opcode, cell $md) impure inline;
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/baseInterface.fc

```fc
const int BaseInterface::event::AUTHENTICATED;
const int BaseInterface::event::INITIALIZED;

const int BaseInterface::ERROR::notAuthenticated;
const int BaseInterface::ERROR::onlyOwner;
const int BaseInterface::ERROR::notInitialized;
const int BaseInterface::ERROR::alreadyInitialized;
const int BaseInterface::ERROR::invalidOpcode;
const int BaseInterface::ERROR::eventEmitted;
const int BaseInterface::ERROR::invalidActionType;
const int BaseInterface::ERROR::invalidEventSource;

const int BaseInterface::OP::INITIALIZE;
const int BaseInterface::OP::EMPTY;
const int BaseInterface::OP::EVENT;
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/classlib.fc

```fc
#include "utils.fc";
#include "stringlib.fc";

;; Types for storage abstraction
const int cl::t::bool;
const int cl::t::uint8;
const int cl::t::uint16;
const int cl::t::uint32;
const int cl::t::uint64;
const int cl::t::coins;
const int cl::t::uint256;
const int cl::t::address;
const int cl::t::cellRef;
const int cl::t::dict256;
const int cl::t::objRef;
const int cl::t::addressList;

const int DICT256_KEYLEN;

const int cl::NULL_CLASS_NAME;

const int cl::ERROR::INVALID_CLASS;
const int cl::ERROR::MALFORMED_OBJECT;

const int MAX_NAME_LEN;
const int _NAME_WIDTH;
const int _BASIC_HEADER_WIDTH;
const int MAX_NAME_INTLEN;

const int _FIELD_TYPE_WIDTH+_CELL_ID_WIDTH;

const int _FIELD_TYPE_WIDTH;
const int _CELL_ID_WIDTH;
const int _DATA_OFFSET_WIDTH;
const int _REF_OFFSET_WIDTH;
const int _FIELD_INFO_WIDTH;
const int _MAX_CLASS_FIELDS;
const int INVALID_CLASS_MEMBER;
const int _HEADER_WIDTH;

;; declarations require a tuple of the form [[ type, val ], ...]
const int FIELD_TYPE_IDX;
const int FIELD_VAL_IDX;

;;; ====================== Class functions ======================
;; returns type width in bits
int _getTypeWidth(int clType) impure inline;
    ;; all other types are ref types with 0 data bits

;; checks if a class lib object is flat, and contains no 'refs'
;; null is considered 'flat'

        ;; if there are refs, the struct is not flat

        ) {
            ;; if there is 1 structural node, that structural node must have 0 refs

    ) {

        ) {

    ;; Initialize a tuple with [null, empty_builder] to store cell builders

    ;; Get number of fields of the object we want to create
    ;; Start building header with class name

    ;; Initialize tracking variables
    ;; root node is special as it only allows two ref fields

    ;; Iterate through all fields
        ;; Get current field and its type from tuple

        ;; Get number of bits needed for this field type
        ;; (2^{bitLength} for uints, 0 for Refs)

            ;; If adding this integer field would exceed cell bit limit
                ;; Add new cell builder if needed
            ;; For reference types (fieldBits == 0)
            ;; If adding this ref would exceed cell ref limit
                ;; Add new cell builder if needed

        ;; Store field value based on type
            ;; For numeric types, store as uint
                curDataCell,
            );
            ;; For object references, store as ref
                curRefCell,
            );
            throw(CLASSLIB::ERROR::INVALID_FIELD_TYPE);

        ;; Build field metadata in header
            ;; For data fields, store cell index, bit offset, and ref offset
            ;; For ref fields, store cell index and ref offset

    ;; Get root cell builder and count total cells

    ;; For multi-cell objects, ensure root has exactly 2 refs

    ;; Finalize header and combine with root cell

    ;; Return final cell based on number of cells used

return empty_cell();

;;; ====================== Class Setter ======================
""";

""";

""";

""";

""";

        ? headerSlice

        );

        ;; numeric type

        ;; link the replacement into the root cell
;;; ====================== Class Getters ======================

const int _NAME_WIDTH;
const int _BASIC_HEADER_WIDTH;
const int MAX_NAME_INTLEN;

const int _FIELD_TYPE_WIDTH;
const int _CELL_ID_WIDTH;
const int _DATA_OFFSET_WIDTH;

    );

;;; =============== DEBUG / CONVENIENCE FUNCTIONS =================
int typeofField(cell $self, int fieldName) impure inline;

;; returns -1 (true) if equal, otherwise the index of the first field that differs
;; returns 16 if the types of the objects are not equal
int compareObjectFields(cell $lhs, cell $rhs) impure inline;
            ;; Finished iteration

int objectsAreEqual(cell $lhs, cell $rhs) impure inline;

slice _typeToStr(int fieldType) impure;

() printField(cell $obj, int fieldName) impure inline;

;; doesn't actually return a tuple, just pushes something to the stack casted to a tuple
tuple getObjectField(cell $storage, int field) impure;

;; doesn't actually return a tuple, just pushes something to the stack casted to a tuple
tuple getContractStorageField(int field) impure method_id;

;; doesn't actually return a tuple, just pushes something to the stack casted to a tuple
tuple getContractStorageNestedField(int field, int nestedField) impure method_id;

;;; ====================== Dictionary functions ======================

slice uint256ToSlice(int val) impure inline;

int sliceToUint256(slice s) impure inline;

;; override the insane behavior of TON to optimize out empty dictionaries
;; into a single bit
return empty_cell();

(slice, int) cl::dict256::get(cell dict, int key) impure inline method_id {

(int, int) cl::dict256::get<uint256>(cell dict, int key) impure inline method_id {

(cell, int) cl::dict256::get<cellRef>(cell dict, int key) impure inline method_id {
    ifnot (exists) {

            DICT256_KEYLEN,
            key,
        );

;;; ====================== Dictionary Iterators ======================
;; returns key, val, and key == -1 if there is no next (or min) element
;; if the val exists, it is returned
;; if a val does not exist, null() is returned

(int, slice) cl::dict256::getMin<slice>(cell dict256) impure inline {

(int, int) cl::dict256::getMin<uint256>(cell dict256) impure inline {

(int, cell) cl::dict256::getMin<cellRef>(cell dict256) impure inline {

(int, slice) cl::dict256::getNext<slice>(cell dict256, int pivot) impure inline {

(int, int) cl::dict256::getNext<uint256>(cell dict256, int pivot) impure inline {

(int, cell) cl::dict256::getNext<cellRef>(cell dict256, int pivot) impure inline {

;;; ====================== Nested Dict Helpers ======================

        fieldName,
        $self
    );

        fieldName,
    );

        fieldName,
    );

(int, int) cl::nestedDict256::get<uint256>(cell $self, int fieldName, int key) impure inline {

(slice, int) cl::nestedDict256::get<slice>(cell $self, int fieldName, int key) impure inline {

(cell, int) cl::nestedDict256::get<cellRef>(cell $self, int fieldName, int key) impure inline {

;; ========================= Storage View Functions =========================

;; -- Level 0: returns storage.fieldName

        getContractStorage(),
        fieldName
    );

        getContractStorage(),
        fieldName
    );

;; -- Level 1: returns storage.fieldName.nestedFieldName

        getStorageFieldL0<cellRef>(fieldName),
        nestedFieldName
    );

        getStorageFieldL0<objRef>(fieldName),
        nestedFieldName
    );

;; returns storage.fieldName[key]
        getStorageFieldL0<cellRef>(fieldName),
        key
    );

        getStorageFieldL0<cellRef>(fieldName),
        key
    );

;; Level 2: returns storage.fieldName[outerKey][innerKey]
        getStorageFieldL1<dict256::cellRef>(fieldName, outerKey),
        innerKey
    );

        getStorageFieldL1<dict256::cellRef>(fieldName, outerKey),
        innerKey
    );
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/constants.fc

```fc
const int ERRORCODE_MASK;
const int CLASSLIB::ERROR::INVALID_FIELD_TYPE;
const int CLASSLIB::ERROR::WRONG_ORDER_CONSTRUCTOR;

const int MAX_U8;
const int MAX_U16;
const int MAX_U32;
const int MAX_U64;
const int MAX_U128;
const int MAX_U256;
const int MAX_COINS;

const int ADDR_TYPE_NONE;
const int ADDR_TYPE_EXTERN;
const int ADDR_TYPE_STD;
const int ADDR_TYPE_VAR;

const int TRUE;
const int FALSE;
const int MASTERCHAIN;
const int BASECHAIN;

;; 0b011000 tag - 0, ihr_disabled - 1, bounce - 1, bounced - 0, src = adr_none$00
const int SEND_MSG_BOUNCEABLE;
;; 0b010000 tag - 0, ihr_disabled - 1, bounce - 0, bounced - 0, src = adr_none$00
const int SEND_MSG_NON_BOUNCEABLE;

;; MODIFIER
const int NORMAL;
const int PAID_EXTERNALLY;
const int IGNORE_ERRORS;

;; SEND MODES
const int BOUNCE_IF_FAIL;
const int DESTROY_IF_ZERO;
const int CARRY_REMAINING_GAS;
const int CARRY_ALL_BALANCE;

;; SENDMSG modes
const int SUB_BALANCE_MSG;
const int SUB_BALANCE_CONTRACT;
const int ONLY_ESTIMATE_FEES;

;; SEND MODES QUIETED
const int QDESTROY_IF_ZERO;
const int QCARRY_REMAINING_GAS;
const int QCARRY_ALL_BALANCE;

const int RESERVE_EXACTLY;
const int RESERVE_ALL_EXCEPT;
const int RESERVE_AT_MOST;
const int EXTRN_DO_NOT_FAIL;
const int BALANCE_INCREASED;
const int BALANCE_DECREASED;
const int RESERVE_BOUNCE_ON_ACTION_FAIL;

;; a lot of different constants, because arithmetic manipulation of constants is not optimized
const int MAX_CELL_BITS;
const int MAX_CELL_BYTES;
const int MAX_CELL_WHOLE_BYTE_BITS;
const int MAX_CELL_BIT_INDEX;
const int MAX_CELL_REFS;

const int NULLADDRESS;
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/contractMain.fc

```fc
;;; ================================================================
;; The base main function for LayerZero Endpoint, UltraLightNode, and OApp
;;; ================================================================

#include "handlerCore.fc";
#include "abstract/contractMainAbstract.fc";

;;; ===============================
;; Base main - low-level builtin context

() main(int myBalance, int msgValue, cell inMsgFull, slice inMsgBody) impure inline;

    ;; ignore empty messages

    ;; Storage fees are deducted from the contract balance
    ;; Any amount that is explicitly deposited into this contract (getRentNanos())
    ;; is reserved to prevent it from being sent downstream
    ;; The below assertion matches the insufficient ton behavior on action phase
    ;; And it's probably unnecessary but it doesn’t cost much gas so no harm in keeping it.

    ;; Whether there is any value left to refund to the origin
    ;; the index of the action to be processed
        ;; ========================================
        ;; Loop management

        ;; Applies a moving flag where if a single action returns false, then the false flag persists

    ;; If any value remains, we should refund it to the origin
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/dataStructures/DeterministicInsertionCircularQueue.fc

```fc
;;; =================== DeterministicInsertionCircularQueue.fc ===================
;; the DeterministicInsertionCircularQueue is a deterministic-gas circular buffer
;; that stores key-value pairs along with one piece of metadata (8-bits) per entry.
#include "../utils.fc";

const int DeterministicInsertionCircularQueue::statusBits;
const int DeterministicInsertionCircularQueue::keyBits;

const int DeterministicInsertionCircularQueue::invalidKey;
const int DeterministicInsertionCircularQueue::invalidStatus;
const int DeterministicInsertionCircularQueue::ERROR::invalidObject;

;; Given a well-formed commit_verification_queue
;; get the content of the queue at a given relative nonce
;; (actual key, entry, status, exists)
(int, cell, int, int) DeterministicInsertionCircularQueue::get(cell self, int key) impure inline {

    ;; guaranteed to always have state stored
            state,
            exists
        );
        DeterministicInsertionCircularQueue::invalidKey,
        empty_cell(),
        DeterministicInsertionCircularQueue::invalidStatus,
        exists
    );

        begin_cell()
    );

;; self
        self,
        key,
        begin_cell()
    );

        self,
        key,
        begin_cell()
    );

    ;; ceil(log4(MAX_CELL_BITS)) == 4
    ;; build the initial contents of each leaf in the outer scope to save gas
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/dataStructures/PipelinedOutOfOrder.fc

```fc
;;; ==============================================================================
;; Pipelined Out-of-Order data structure
;; this data structure defines a bitmap that is used to track a stream of
;; commands that are executed out-of-order in a bounded-depth pipeline
#include "../classlib.fc";

const int POOO::NAME;

const int POOO::nextEmpty;
const int POOO::bitmap;

const int POOO::ERROR::negativeIndex;

        POOO::NAME,
        unsafeTuple([
            [cl::t::uint64, 1], ;; nextEmpty
        ])
    );

const int POOO::_headerInfoBits;
const int POOO::_headerFillerBits;
const int POOO::_headerInfo;

;; ========================== Object Getters ==========================

const int POOO::_nextEmptyOffset;

;; ========================== Object Multi-Getters ==========================

;; returns (nextEmpty, bitmap.slice)
(int, slice) POOO::deserialize(cell $self) impure inline {
    );

;; ========================== Object Utils ==========================

;; ========================== Object Setters ==========================

;; Algorithm:
;; 1. Extract the first `index` bits from the original bitmap.
;; 2. Append a '1' bit to the extracted bits.
;; 3. Append the remaining bits from the original bitmap after the first `index` bits to form a new bitmap.

;; Returns:
;; 1. The number of leading ones (`leadingOnes`).
;; 2. A new cell that contains:
;;    - The remaining bits after the leading ones from the original bitmap.
;;    - A number of trailing zero bits equal to `leadingOnes`.

;; Parameters:
;; - `bitmapCell`: The original bitmap in the form of a cell.
;; - `index`: The position up to which the first part of the bitmap is extracted.

        begin_cell()
    );

        begin_cell()
    );

        begin_cell()
    );

        begin_cell()
    );
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/handlerCore.fc

```fc
;;; ==========================================
;; This file contains the utility functions for all handler functions that follow
;; LayerZero Labs handler convention.
;;; ==========================================
#include "abstract/handlerAbstract.fc";

#include "actions/utils.fc";

#include "baseInterface.fc";

;;; ===================REQUIRED VIRTUAL FUNCTIONS=======================

(cell, tuple) preamble() impure inline;

() checkPermissions(int op, cell $md) impure inline;
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/stdlib.fc

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
(int, int, int, int) slice_compute_data_size?(slice s, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

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
(int, int) parseStdAddress(slice s);

;;; A variant of [parseStdAddress] that returns the (rewritten) address as a slice [s],
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
int equal_slice_bits(slice a, slice b);

;;; Concatenates two builders
builder store_builder(builder to, builder from);
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/stringlib.fc

```fc
#include "utils.fc";

;;; ===============================STRING MANIPULATION FUNCTIONS===========================
;; note that these functions are NOT optimized and should NOT be used in production code

const int ASCII_ZERO;
const int ASCII_MASK;
const int ASCII_A;

        throwError("Cannot concatenate: string too long");

() str::console::log<int>(slice string, int val) impure {
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/txnContext.fc

```fc
#include "utils.fc";

global tuple txnContext;;

const int _IS_BOUNCED;
const int _CALLER;
const int _FWD_FEE;
const int _OPCODE;
const int _QUERY_ID;
const int _BALANCE;
const int _MSG_VALUE;
const int _BODY;
const int _RAW_MSG;
const int _ORIGIN;
const int _DONATION_NANOS;
const int _MD;

int getMsgValue() impure inline;

int getOpcode() impure inline;

int txnIsBounced() impure inline;

int getContractBalance() impure inline;

int getInitialContractBalance() impure inline;

int getCaller() impure inline;

int getOrigin() impure inline;

slice getOriginStd() impure inline;

int getDonationNanos() impure inline;

() setDonationNanos(int nanos) impure inline;

cell getMsgData() impure inline;

() setOrigin(int newOrigin) impure inline;

;; returns if slice empty
;; if empty body, sets opcode=-1 & query_id=-1, so it cannot be faked
() initTxnContext(int myBalance, int msgValue, cell inMsgFull, slice inMsgBody) impure inline;

    ;; by default, the origin is the sender address

    ;; the inMsgBody parsing is technically compatible with the reference jetton implementation
    ;; where donationNanos == the amount of tokens received
    ;; and and the origin will contain garbage data
        ;; if the origin is explicitly overriden in the body, use that

(builder) beginTonMessage(int _opcode);
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/utils.fc

```fc
#include "constants.fc";
#include "stdlib.fc";

const int ERROR::WrongWorkchain;

forall X -> tuple unsafeTuple(X x);
(slice) as_slice(builder b);
(slice, int) load_uint8(slice s);
(builder) store_uint8(builder b, int t) inline asm(t b) "8 STU";
(slice, int) load_uint16(slice s);
(builder) store_uint16(builder b, int t) inline asm(t b) "16 STU";
(slice, int) load_uint32(slice s);
(builder) store_uint32(builder b, int t) inline asm(t b) "32 STU";
(slice, int) load_uint64(slice s);
(builder) store_uint64(builder b, int t) inline asm(t b) "64 STU";
(slice, int) load_uint128(slice s);
(builder) store_uint128(builder b, int t) inline asm(t b) "128 STU";
(slice, int) load_uint256(slice s);
(builder) store_uint256(builder b, int t) inline asm(t b) "256 STU";
forall X -> int   is_null(X x);
forall X -> int   is_int(X x);
forall X -> int   is_cell(X x);
forall X -> int   is_slice(X x);
forall X -> int   is_tuple(X x);
forall X -> cell  cast_to_cell(X x);
forall X -> slice cast_to_slice(X x);
forall X -> int   cast_to_int(X x);
forall X -> tuple cast_to_tuple(X x);
(cell) my_code();
(tuple) get_values();
int storage_fees();
(int, slice) ldones(slice s);

(int) get_gas_consumed();

builder store_zeroes(builder b, int x);
builder store_ones(builder b, int x);
cell preload_first_ref(slice s);
slice preload_bits_offset(slice s, int offset, int len);
(slice, int) load_bool(slice s);
int preload_bool(slice s);
(builder) store_bool(builder b, int v);
cell empty_cell();
forall X -> tuple tset(tuple t, int k, X x);
forall X -> (tuple, X) tpop(tuple t);
int tlen(tuple t);
int keccak256Builder(builder b);

int cell_is_empty(cell c) impure inline;

int get_compute_fee(int workchain, int gas_used);
int get_storage_fee(int workchain, int seconds, int bits, int cells);
int get_forward_fee(int workchain, int bits, int cells);

int ilog4(int x);
tuple self_balance();

() throwError(slice reason) impure inline;

() throwErrorUnless(int condition, slice reason) impure inline;
int _SDCNTLEAD0(slice x);
int POW2(int y);

;; numCells, num_bits
(int, int) getContractStateSize(cell code, cell init_storage) impure inline;

int calculateStorageFees(int cellsCount, int bitsCount, int timeDelta) impure inline;

forall X -> tuple castToTuple(X x);

slice empty_slice();

int treeShapeEqual(cell lhs, cell rhs) inline;

int _gasToNanoton(int gas) impure inline;

(cell, int) getConfigParam(int idx) inline asm "CONFIGPARAM";

;; https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb
;; gas_prices#dd gas_price:uint64 gas_limit:uint64 gas_credit:uint64
;; block_gas_limit:uint64 freeze_due_limit:uint64 delete_due_limit:uint64
;; = GasLimitsPrices;
;;
;; gas_prices_ext#de gas_price:uint64 gas_limit:uint64 special_gas_limit:uint64 gas_credit:uint64
;; block_gas_limit:uint64 freeze_due_limit:uint64 delete_due_limit:uint64
;; = GasLimitsPrices;
;;
;; gas_flat_pfx#d1 flat_gas_limit:uint64 flat_gas_price:uint64 other:GasLimitsPrices
;; = GasLimitsPrices;
;;
;; config_mc_gas_prices#_ GasLimitsPrices = ConfigParam 20;
;; config_gas_prices#_ GasLimitsPrices = ConfigParam 21;
;; return -1 on any failure
(int, int, int, int, int, int, int, int, int) parseGasLimitsPrices(int workchainId) impure;

;;; ====================== Address functions ======================
int basechainAddressStdToHashpart(slice full_address) impure inline;

slice hashpartToBasechainAddressStd(int hashpart) impure inline;

int getContractAddress() impure inline;

() setContractStorage(cell $obj) impure inline;

cell getContractStorage() impure inline method_id;

int getContractBalanceView(int futureSeconds) impure inline method_id;

int computeContractAddress(cell $storage, cell code) impure inline;

;; ============================== Optimization Functions ==============================

;; ========================== For Slices ==========================

int preloadBoolAt(slice self, int offset) impure inline;
    ;; bools should be returned as bools

int preloadUint8At(slice self, int offset) impure inline;

int preloadUint16At(slice self, int offset) impure inline;

int preloadUint32At(slice self, int offset) impure inline;

int preloadUint64At(slice self, int offset) impure inline;

int preloadCoinsAt(slice self, int offset) impure inline;

int preloadUint256At(slice self, int offset) impure inline;

int preloadAddressAt(slice self, int offset) impure inline;

;; slice -> cell
cell preloadRefAt(slice self, int offset) impure inline;

;; slice -> slice
slice preloadRefSliceAt(slice self, int offset) impure inline;

;; ========================== For Cells ==========================

int cellPreloadBoolAt(cell self, int offset) impure inline;

int cellPreloadUint8At(cell self, int offset) impure inline;

int cellPreloadUint16At(cell self, int offset) impure inline;

int cellPreloadUint32At(cell self, int offset) impure inline;

int cellPreloadUint64At(cell self, int offset) impure inline;

int cellPreloadCoinsAt(cell self, int offset) impure inline;

int cellPreloadUint256At(cell self, int offset) impure inline;

int cellPreloadAddressAt(cell self, int offset) impure inline;

;; cell -> cell
cell cellPreloadRefAt(cell self, int offset) impure inline;

;; cell -> slice
slice cellPreloadRefSliceAt(cell self, int offset) impure inline;
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/protocol/channel/callbackOpcodes.fc

```fc
;; Send flow
const int Layerzero::OP::CHANNEL_SEND_CALLBACK;

;; Receive flow
const int Layerzero::OP::LZ_RECEIVE_PREPARE;
const int Layerzero::OP::LZ_RECEIVE_EXECUTE;

;; Receive flow management
const int Layerzero::OP::BURN_CALLBACK;
const int Layerzero::OP::NILIFY_CALLBACK;
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/protocol/channel/handler.fc

```fc
#include "callbackOpcodes.fc";

#include "../core/abstract/protocolHandler.fc";

#include "../../funC++/actions/dispatch.fc";
#include "../../funC++/actions/event.fc";

#include "../../classes/lz/EpConfig.fc";
#include "../../classes/lz/Packet.fc";
#include "../../classes/lz/Path.fc";
#include "../../classes/lz/ReceiveEpConfig.fc";
#include "../../classes/lz/SendEpConfig.fc";

#include "../../classes/msgdata/ChannelNonceInfo.fc";
#include "../../classes/msgdata/CoinsAmount.fc";
#include "../../classes/msgdata/ExtendedMd.fc";
#include "../../classes/msgdata/LzReceivePrepare.fc";
#include "../../classes/msgdata/LzReceiveStatus.fc";
#include "../../classes/msgdata/LzReceivePrepare.fc";
#include "../../classes/msgdata/LzSend.fc";
#include "../../classes/msgdata/MdAddress.fc";
#include "../../classes/msgdata/MdObj.fc";
#include "../../classes/msgdata/MessagingReceipt.fc";
#include "../../classes/msgdata/MsglibSendCallback.fc";
#include "../../classes/msgdata/Nonce.fc";
#include "../../classes/msgdata/PacketId.fc";
#include "../../classes/msgdata/PacketSent.fc";

#include "../../funC++/dataStructures/DeterministicInsertionCircularQueue.fc";
#include "../../funC++/dataStructures/PipelinedOutOfOrder.fc";

#include "../interfaces.fc";
#include "../msglibs/interface.fc";
#include "interface.fc";
#include "storage.fc";

;;; ================INTERFACE FUNCTIONS=====================

int _getEventSink() inline;

;;; ==========================HELPER FUNCTIONS=====================================

() _assertEqualPaths(cell $path1, cell $path2) impure inline;

;; @info The send request queue (Channel::sendRequestQueue) is a DeterministicInsertionCircularQueue
;; that stores a mapping from requestId => hash of LzSend object.
;; {_build, _read}SendRequestQueueEntry functions are helper functions that
;; serialize and deserialize the 256-bit hash that is stored in the DICQueue
cell _buildSendRequestQueueEntry(cell $lzSend) impure inline method_id;

int _readSendRequestQueueEntry(cell contents) impure inline method_id;

;; returns boolean committable, (packet or null)
(int, cell) _nonceCommittable(int incomingNonce) impure inline method_id;

        ;; short-circuit for efficiency in the common case

    ;; condition 1 & 2: must be within the window
    ;; condition 3: must not be executing
        ;; this is nested because funC doesn't support short-circuiting boolean/bitwise ops
        ;; condition 4: must not be executed

;; returns boolean committable
int _optimizedNonceCommittable(cell $executePOOO, cell executionQueue, int incomingNonce) impure inline;

    ;; condition 1 & 2: must be within the window
    ;; condition 3: must not be executing
        ;; this is nested because funC doesn't support short-circuiting boolean/bitwise ops
        ;; condition 4: must not be executed

cell _getExecutablePacket(int incomingNonce) impure inline method_id;

;;; ==========================VIEW FUNCTIONS=====================================

int _viewInboundNonce() impure method_id;

int _viewExecutionStatus(int incomingNonce) impure method_id;

;;; ================INTERFACE FUNCTIONS=====================

(cell, tuple) _initialize(cell $md) impure inline;

;;; ================PERMISSION FUNCTIONS=====================

() _assertEndpoint() impure inline;

;; this function is purposely designed to be maximally efficient when using a
;; custom configuration and less efficient when using a default configuration
() _assertSendMsglib(cell $mdMsglibSendCallback) impure inline;
    ;; Resolve the actual sendMsglib address at the time of request.
    ;; This function assumes the messagelib is not malicious or man-in-the-middle attacking,
    ;; as those cases are asserted in the handler itself.

() _assertOApp() impure inline;

() _checkPermissions(int op, cell $md) impure inline;
        ;; open and public calls
        ;; Management functions are all gated by OApp
        ;; we must put a check for all opcodes to make sure we don't
        ;; mistakenly miss an opp code's permissions

;;; ==========================HANDLERS=====================================

;; @in endpoint/handler.fc/setEpConfig
;; @out controller/handler.fc/emit_event
;; @md EpConfig
tuple setEpConfigOApp(cell $epConfigOApp) impure inline method_id;

;;; ==========================================
;; Send flow
;; @in: endpoint/handler.fc/quote
;; @in_md: MdObj(lzSend, defaultEpConfig)
;; @out: msglib/handler.fc/quote
;; @out_md: $lzSend
tuple channelSend(cell $mdObj) impure inline method_id;

    ;; assert the size and structure of the incoming lzSend message

    ;; Resolve the desired send msglib and send msglib connection

    ;; Each send request is assigned a unique request ID, which is also used as the key into
    ;; the sendRequestQueue

        ;; submit to the msglib

        ;; callback to the oApp with a failure and emit an event

;; in: msglib/handler.fc/msglibSend
;; in_md: MsglibSendCallback
;; out: OApp/handler.fc/sendCallback
tuple msglibSendCallback(cell $mdMsglibSendCallback) impure inline method_id;

    ;; Read the requestId from the sendRequestQueue to ensure this send request is genuine
    ;; and is not being double-executed

            ;; See below comment, this else case is logically the same as the below else block,
            ;; but needs to be split due to lack of short-circuiting boolean expressions in funC
        ;; if the send request doesn't exist, there are two cases
        ;; 1. a legitimate request was frontrun by a force-abort
        ;;  in this case, we can safely refund all the funds to the origin
        ;; 2. a malicious MITM attack by ULN
        ;;  in this case, we can't refund the funds, but we can still emit an event

        ;; This technically silently reverts, by not processing any output actions,
        ;; thus providing a refund, instead of hard reverting

    ;; verify that cumulative fees quoted by the msglib <= the fee cap specified by the user/app

    ;; Verify that the ZRO token credits in the Channel is sufficient to cover the
    ;; quoted ZRO cost of the message.

        ;; Assign a nonce to the packet and calculate the resulting GUID

        ;; native payments

        ;; If the TON message does not contain sufficient value to perform the payments,
        ;; the transaction will revert and the send channel will eventually get blocked.
        ;; It is the responsibility of the OApp to assert sufficient gas + value to cover the
        ;; entire transaction and avoid this failure.

        ;; Due to asynchrony between the Msglib and the Channel, the nonce and guid
        ;; cannot be ... ?

    ;; If the quote was unsuccessful, delete the hash from storage to prevent hol blocking
    ;; If the quote was successful, additionally update the ZRO balance and outbound nonce

;;; ==========================================
;; Receive flow
;; @in     endpoint/handler.fc/verify
;; @in_md  ExtendedMd(msglibConnectionAddress, defaultEpConfig, verify)
;; @out    packet_receive/handler.fc/verify
;; @out_md ExtendedMd(msglib_addr, _, verify)
;; @out    controller/handler.fc/emit_event
tuple channelCommitPacket(cell $mdExtended) impure inline method_id;

    ;; assert the size of the incoming packet

        ;; grossly inefficient, but this will (almost) never happen
        ;; so we can optimize the happy path by isolating this logic into this block

        ;; Cannot respond back to msglib if the packet is not currently committable but
        ;; will be committable in the future
        ;; Caveat: if the packet is currently executing, we treat it as uncommittable.
        ;; There exists a race condition where a uncommitted re-committable packet
        ;; can be marked as committed. If the packet needs to be re-committed for a good reason
        ;; (e.g., malicious DVN), the OApp owner must first nilify the packet

;;; ==========================================
;; Execution step 1
;; @in_opcode Channel::OP::LZ_RECEIVE_PREPARE
;; @in_from (external in) permissionless
;; @in_md nonce
;; @out_opcode Layerzero::OP::LZ_RECEIVE_PREPARE
;; @out_to srcOApp
;; @out_md ExtendedMd(md=packetId, obj=channel_init_state, forwarding_addr=NULLADDRESS)
;; @permissions: permissonless
tuple lzReceivePrepare(cell $lzReceivePrepareMd) impure inline method_id;

    ;; extract oApp from path
        ;; Throws if the Packet is not executable

;; @in_opcode Channel::OP::LZ_RECEIVE_LOCK
;; @in_from oApp
;; @in_md nonce
;; @out_opcode Layerzero::OP::LZ_RECEIVE_EXECUTE
;; @out_to oApp
;; @out_md ExtendedMd(md=Packet, obj=channel_init_state, forwarding_addr=NULLADDRESS)
;; @permissions: only oApp
tuple lzReceiveLock(cell $nonceMd) impure inline method_id;

    ;; executable if present and all preceding nonces are committed, executing, or executed
        ;; set state to executing

;; @in_opcode Channel::OP::LZ_RECEIVE_EXECUTE_CALLBACK
;; @in_from oApp
;; @in_md LzReceiveStatus
;; @out_opcode OP::PACKET_RECEIVE_DESTROYED_CALLBACK
;; @out_to oApp
;; @out_md ExtendedMd(md=packetId, obj=pr_init_state, forwarding_addr=address_std_hashpart_null())
;; @failure => unlock the Packet
;; @success => destroy the Packet and refund rent
;; @permissions: only oApp
tuple lzReceiveExecuteCallback(cell $lzReceiveStatus) impure inline method_id;

    ;; check for success/failure

        ;; emit Packet in the manager

        ;; emit Packet so we know its unlocked

;;; ====================== Management Helper ===================================
() _commitFakePacket(cell $storage, int nonce, cell $receivePath) impure inline method_id;

    ;; Because this is not originating from the endpoint, we dont have the defaults
    ;; Actual defaults and the msglib address arent required because the call is direct from the OApp

    ;; Step 1: Commit the 'mockPacket'
    ;; This is safe because we are going to do the following steps (2 and 3) atomically.
    ;; channelCommitPacket will not revert if the packet is not committed, but lzReceiveLock will.
    ;; Basically lying to channelCommitPacket to say the "correct" msglib is committing

;; @permissions only-oApp
tuple nilify(cell $packetId) impure inline method_id;

    ;; reverse the path because this is from a receive perspective

tuple burn(cell $packetId) impure inline method_id;

    ;; reverse the path because this is from a receive perspective

    ;; Step 1: Commit a 'mockPacket' to be used when we 'burn' this nonce

    ;; Step 2: Put the packet into 'executing'
    ;; Step 3: Mock the lzReceiveExecuteCallback, which marks/flags that given nonce as used and 'executed'

    ;; Emit an event so we are able to observe offchain that this nonce has been 'burned'

;;; ==========================================
;; ZRO management
;; only controller
tuple depositZro(cell $coinsAmount) impure inline method_id;

;; Attempt to abort a send request. Check if hash still present, if present delete and send
;; @in: oApp
;; @in_opcode Channel::OP::FORCE_ABORT
;; @in_md lzSend
;; @out_opcode
;; @out_to oApp
;; @out_md lzSend
;; @permissions: only oApp
tuple forceAbort(cell $lzSend) impure inline method_id;

    ;; $lzSend does not need to be sanitized, as it must be correct to match
    ;; the stored hash

    ;; delete the reservation and update the storage

;; Send the current state of the channel to the MsglibConnection
;; @in: permissionless
;; @in_opcode Channel::OP::MSGLIB_CONNECTION_SYNC_CHANNEL_STATE
;; @in_md mdAddress ( MsglibConnectionAddress, Path )
tuple syncMsglibConnection(cell $mdAddress) impure inline method_id;

tuple notifyPacketExecuted(cell $mdAddress) impure inline method_id;

tuple emitLzReceiveAlert(cell $lzReceiveStatus) impure inline method_id;
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/protocol/channel/interface.fc

```fc
#include "callbackOpcodes.fc";

;; Opcodes
const int Channel::OP::SET_EP_CONFIG_OAPP;
const int Channel::OP::MSGLIB_SEND_CALLBACK;
const int Channel::OP::CHANNEL_SEND;
const int Channel::OP::CHANNEL_COMMIT_PACKET;
const int Channel::OP::LZ_RECEIVE_PREPARE;
const int Channel::OP::DEPOSIT_ZRO;
const int Channel::OP::NILIFY;
const int Channel::OP::BURN;
const int Channel::OP::FORCE_ABORT;
const int Channel::OP::LZ_RECEIVE_LOCK;
const int Channel::OP::SYNC_MSGLIB_CONNECTION;
const int Channel::OP::LZ_RECEIVE_EXECUTE_CALLBACK;
const int Channel::OP::NOTIFY_PACKET_EXECUTED;
const int Channel::OP::EMIT_LZ_RECEIVE_ALERT;

;; EVENTS
const int Channel::event::EP_CFG_OAPP_SET;
const int Channel::event::PACKET_SENT;
const int Channel::event::PACKET_COMMITTED;
const int Channel::event::PACKET_NILIFIED;
const int Channel::event::PACKET_BURNED;
const int Channel::event::DELIVERED;
const int Channel::event::LZ_RECEIVE_ALERT;
const int Channel::event::NOT_EXECUTABLE;
const int Channel::event::ZRO_DEPOSITED;

;; ERRORS
const int Channel::ERROR::onlyEndpoint;
const int Channel::ERROR::onlyOApp;
const int Channel::ERROR::onlyApprovedSendMsglib;
const int Channel::ERROR::onlyApprovedReceiveMsglib;
const int Channel::ERROR::invalidNonce;
const int Channel::ERROR::cannotAbortSend;
const int Channel::ERROR::sendAborted;
const int Channel::ERROR::notEnoughNative;
const int Channel::ERROR::notEnoughZroToken;
const int Channel::ERROR::sendQueueCongested;
const int Channel::ERROR::notEnoughZroTokenBalance;
const int Channel::ERROR::notCommittable;
const int Channel::ERROR::notExecutable;
const int Channel::ERROR::notExecuting;
const int Channel::ERROR::wrongPath;
const int Channel::ERROR::MsglibBlocked;
const int Channel::NO_ERROR;

;; States for view function and packet executability management
const int ExecutionStatus::uncommitted;
const int ExecutionStatus::committedNotExecutable;
const int ExecutionStatus::executable;
const int ExecutionStatus::executed;
const int ExecutionStatus::executing;
const int ExecutionStatus::committed;

const int ExecutionQueue::uncommitted;
const int ExecutionQueue::executing;
const int ExecutionQueue::committed;

const int SendRequestQueue::sending;
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/protocol/channel/main.fc

```fc
#include "../core/abstract/protocolMain.fc";

#include "handler.fc";
#include "interface.fc";

tuple _executeOpcode(int op, cell $md) impure inline;
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/protocol/channel/storage.fc

```fc
#include "../../funC++/dataStructures/PipelinedOutOfOrder.fc";

#include "../../classes/lz/EpConfig.fc";

#include "../core/baseStorage.fc";

;; maximum concurrent sendable inflight send requests
;; must be low to avoid permanent bricking
const int Channel::MAX_SEND_SLOTS;

;; required object name
const int Channel::NAME;

;; field names
;; Init state (sharding key)
const int Channel::baseStorage;
const int Channel::path;

;; Both send and receive channel state
const int Channel::endpointAddress;
const int Channel::epConfigOApp;

;; Send channel state
const int Channel::outboundNonce;
const int Channel::sendRequestQueue;
const int Channel::lastSendRequestId;

;; Receive channel state
const int Channel::commitPOOO;

;; Used to track the commit verification queue / capacity
const int Channel::executePOOO;
const int Channel::executionQueue;

const int Channel::zroBalance;

;; @owner manager
        Channel::NAME,
        unsafeTuple([
            [cl::t::objRef, BaseStorage::New(owner)],           ;; Channel::baseStorage
            [cl::t::objRef, $path],                             ;; Channel::path
            [cl::t::address, endpointAddress],                  ;; Channel::endpointAddress
            [cl::t::objRef, lz::EpConfig::NewWithDefaults()],   ;; Channel::epConfigOApp
            [cl::t::uint64, 0],                                 ;; Channel::outboundNonce
            [cl::t::objRef, cl::nullObject()],                 ;; Channel::sendRequestQueue (DICQ)
            [cl::t::uint64, 0],                                 ;; Channel::sendRequestId
            [cl::t::objRef, POOO::New()],                       ;; Channel::commitPOOO
            [cl::t::objRef, POOO::New()],                       ;; Channel::executePOOO
            [cl::t::cellRef, cl::nullObject()],                 ;; Channel::executionQueue (DICQ)
            [cl::t::coins, 0]                                   ;; Channel::zroBalance
        ])
    );

;; ====================== Object Accessors =====================

const int Channel::_endpointAddressOffset;
const int Channel::_outboundNonceOffset;
const int Channel::_sendRequestIdOffset;
const int Channel::_zroBalanceOffset;
const int Channel::_sliceBits;

;; (epConfigOApp, commitPOOO, ExecutePOOO, executionQueue)
(cell, cell, cell, cell) Channel::getCommitPacketInformation(cell $self) impure inline {
    );

;; (executePOOO, executionQueue, path)
(cell, cell, cell) Channel::getExecutePOOOAndExecutionQueueAndPath(cell $self) impure inline {
    );

;; (epConfigOapp, path, sendRequestQueue, lastSendRequestId)
(cell, cell, cell, int) Channel::getSendInformation(cell $self) impure inline {
    );

;; (sendRequestQueue, zroBalance, path, outBoundNonce)
(cell, int, cell, int) Channel::getSendCallbackInformation(cell $self) impure inline {
    );

;; (executionQueue, commitPOOO, path)
(cell, cell, cell) Channel::getLzReceiveLockInformation(cell $self) impure inline {
    );

;; ====================== Object Modifiers =====================

;; ====================== Object Composite Modifiers =====================

        ) ;; store whatever's behind the outbound nonce and all the refs
                Channel::_sendRequestIdOffset, ;; start bits
                0, ;; start refs
                64, ;; bits
                0 ;; refs

    );
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/protocol/controller/interface.fc

```fc
const int MAX_MSGLIBS;

;; OPCODES
const int Controller::OP::DEPLOY_ENDPOINT;
const int Controller::OP::DEPLOY_CHANNEL;
const int Controller::OP::SET_EP_CONFIG_DEFAULTS;
const int Controller::OP::SET_EP_CONFIG_OAPP;
const int Controller::OP::ADD_MSGLIB;
const int Controller::OP::DEPOSIT_ZRO;
const int Controller::OP::SET_ZRO_WALLET;
const int Controller::OP::EXCESSES;
const int Controller::OP::TRANSFER_OWNERSHIP;
const int Controller::OP::CLAIM_OWNERSHIP;

;; EVENT
const int Controller::event::ZRO_WALLET_SET;
const int Controller::event::OWNER_SET;
const int Controller::event::OWNER_SET_TENTATIVE;

;; ERRORS
const int Controller::ERROR::onlyOApp;
const int Controller::ERROR::invalidEid;
const int Controller::ERROR::onlyZroWallet;
const int Controller::ERROR::onlyTentativeOwner;
const int Controller::ERROR::nullTentativeOwner;
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/protocol/core/abstract/protocolHandler.fc

```fc
#include "../../../funC++/handlerCore.fc";
#include "../../../funC++/actions/call.fc";
#include "../../../funC++/actions/deploy.fc";
#include "../../../funC++/actions/event.fc";
#include "../../../funC++/actions/payment.fc";

#include "../baseStorage.fc";

int getOwner() impure inline;

cell getInitialStorage() impure inline;

;;; ==========================================
;; Modifiers
() assertAuthenticated() impure inline;

() assertInitialized() impure inline;

;; assert the ctx sender is the owner of this contract
;; expects the ctx to be populated. Does not require storage to be loaded
() assertOwner() impure inline;

;; Step 1: authenticate
() authenticate() impure;

() authenticateIfNecessary() impure inline;

(cell, tuple) _initialize(cell $md) impure inline;

;; Step 2: initialize
tuple initialize(cell $md) impure inline;

;; declared inside of the actions/event.fc
;; We declare it here because it saves the need for declaring initialStorage everytime we call event
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/protocol/core/abstract/protocolMain.fc

```fc
;;; ================================================================
;; The base main function for LayerZero Endpoint, UltraLightNode, and OApp
;;; ================================================================
#include "../../../funC++/actions/call.fc";
#include "../../../funC++/actions/deploy.fc";
#include "../../../funC++/actions/dispatch.fc";
#include "../../../funC++/actions/event.fc";
#include "../../../funC++/actions/payment.fc";

#include "../../../funC++/contractMain.fc";
#include "../../../funC++/handlerCore.fc";

int _executeAction(int actionType, tuple action) impure inline;

    ;; compiler freaks out if you dont have something here returning an int, but this should never be reached
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/protocol/core/baseStorage.fc

```fc
#include "../../funC++/classlib.fc";
#include "../../funC++/baseInterface.fc";

;; !!! If you put this storage anywhere other than index 0 of your custom contract storage,
;; you are gunna have a bad time
const int BASE_STORAGE_INDEX;

;; required object name
const int BaseStorage::NAME;

;; field names
const int BaseStorage::owner;
const int BaseStorage::authenticated;
const int BaseStorage::initialized;
const int BaseStorage::initialStorage;

;; In all blockchains with atomic cross-contract call, we can use src/dst/sender/receiver
;; because the send channel doesn't exist (it's just a nonce).
;; In TON, we need both send/receive channels, so we use local/remote to provide
;; a context-free way to refer to the two ends of the channel.
;; The direction is inferred by the context of the contract (send vs receive).
;; The srcOApp is the 256-bit hashpart of a standard address.
        BaseStorage::NAME,
        unsafeTuple([
            [cl::t::address, owner], ;; BaseStorage::owner
            [cl::t::bool, false], ;; BaseStorage::authenticated
            [cl::t::bool, false], ;; BaseStorage::initialized
            [cl::t::objRef, cl::nullObject()] ;; BaseStorage::initialStorage
        ])
    );

const int BaseStorage::_ownerOffset;
const int BaseStorage::_authenticatedOffset;
const int BaseStorage::_initializedOffset;

cell getBaseStorage() impure inline method_id;
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/protocol/endpoint/interface.fc

```fc
;; OPCODES
const int Endpoint::OP::ENDPOINT_SEND;
const int Endpoint::OP::ENDPOINT_COMMIT_PACKET;
const int Endpoint::OP::SET_EP_CONFIG_DEFAULTS;
const int Endpoint::OP::SET_EP_CONFIG_OAPP;
const int Endpoint::OP::ADD_MSGLIB;
const int Endpoint::OP::GET_MSGLIB_INFO_CALLBACK;

;; EVENTS
const int Endpoint::event::EP_CONFIG_DEFAULTS_SET;

;; ERRORS
const int Endpoint::ERROR::notOApp;
const int Endpoint::ERROR::wrongPath;
const int Endpoint::ERROR::unauthorizedMsglib;
const int Endpoint::ERROR::invalidExpiry;
const int Endpoint::ERROR::unresolvedMsglib;
const int Endpoint::ERROR::msglibInfoExists;
const int Endpoint::ERROR::numMsglibsExceeded;
const int Endpoint::ERROR::sameTimeoutAndReceive;
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/protocol/interfaces.fc

```fc
#include "channel/interface.fc";
#include "controller/interface.fc";
#include "endpoint/interface.fc";
#include "msglibs/interface.fc";
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/protocol/msglibs/interface.fc

```fc
;; All msglibs must have the path in their storage as field 1
const int MsglibConnection::PathFieldIdx;

;; All msglibs are required to have a connection and a manager
const int MsglibManager::OP::GET_MSGLIB_INFO;

const int MsglibManager::OP::DEPLOY_CONNECTION;

const int MsglibManager::OP::SET_OAPP_MSGLIB_SEND_CONFIG;

;; Set the connection MSGLIB config
;; called by OApp, seeded by SENDER
const int MsglibManager::OP::SET_OAPP_MSGLIB_RECEIVE_CONFIG;

const int Msglib::OP::RETURN_QUOTE;

const int MsglibConnection::OP::MSGLIB_CONNECTION_QUOTE;
const int MsglibConnection::OP::MSGLIB_CONNECTION_SEND;
const int MsglibConnection::OP::MSGLIB_CONNECTION_COMMIT_PACKET_CALLBACK;
const int MsglibConnection::OP::MSGLIB_CONNECTION_SYNC_CHANNEL_STATE;

const int Msglib::ERROR::onlyChannel;
```

## 499847d3b5434ee60ae3707f96bd0675b848168ac7ceece176e6cae5455f30d1/multisig-code.fc

```fc
;; Simple wallet smart contract

(int, int) get_bridge_config() impure inline_ref;
  ;; wc always equals to -1

_ unpack_state() inline_ref;

_ pack_state(cell pending_queries, cell owner_infos, int last_cleaned, int k, int n, int wallet_id, int spend_delay) inline_ref;

_ pack_owner_info(int public_key, int flood) inline_ref;

_ unpack_owner_info(slice cs) inline_ref;

(int, int) check_signatures(cell public_keys, cell signatures, int hash, int cnt_bits) inline_ref;

() recv_internal(slice in_msg) impure;
  ;; do nothing for internal messages

(int, cell, int, int) parse_msg(slice in_msg) inline_ref;

() check_proposed_query(slice in_msg) impure inline;

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

## 499847d3b5434ee60ae3707f96bd0675b848168ac7ceece176e6cae5455f30d1/stdlib.fc

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

## 4adf48135cb575adbaed476799c87ff2904269b1f949ada4d0479e9104b6f217/imports/jetton-utils.fc

```fc
cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

slice calculate_jetton_wallet_address(cell state_init) inline;

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
```

## 4adf48135cb575adbaed476799c87ff2904269b1f949ada4d0479e9104b6f217/imports/op-codes.fc

```fc
;; Minter
```

## 4adf48135cb575adbaed476799c87ff2904269b1f949ada4d0479e9104b6f217/imports/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;
```

## 4adf48135cb575adbaed476799c87ff2904269b1f949ada4d0479e9104b6f217/jetton-utils/stdlib.fc

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

## 4adf48135cb575adbaed476799c87ff2904269b1f949ada4d0479e9104b6f217/jetton-wallet.fc

```fc
;; Jetton Wallet Smart Contract

{-

NOTE that this tokens can be transferred within the same workchain.

This is suitable for most tokens, if you need tokens transferable between workchains there are two solutions:

1) use more expensive but universal function to calculate message forward fee for arbitrary destination (see `misc/forward-fee-calc.cs`)

2) use token holder proxies in target workchain (that way even 'non-universal' token can be used from any workchain)

-}

int min_tons_for_storage();
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

() on_bounce (slice in_msg_body) impure;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

(int, slice, slice, cell) get_wallet_data() method_id;
```

## 4af21dce90f006fb2181def15736ad730ede88bf8f0659a180a089e7ad5caf02/rock-paper-scissors.fc

```fc
{-
manager_address:MsgAddressInt creator_address:MsgAddressInt opponent_address:MsgAddressInt = GameAddresses
address:GameAddresses status:(##3) rounds:(##10) creator_hands:(##3 * rounds) opponent_hands:(##3 * rounds) = MsgBody;

status
0 -- created
1 -- waiting for creator_hands
2 -- waiting for opponent_hands
3 -- creator won
4 -- opponent won

hand
0 -- none
1 -- annihilation
2 -- katana
3 -- hack
4 -- grenade
5 -- pistol

-}

int equal_slices (slice a, slice b);

slice parse_sender_address (cell msg) inline;

(slice, slice, slice, int, int, int, int) parse_data_storage(slice ds) impure inline_ref;

() recv_internal(int smc_balance, int msg_value, cell msg, slice msg_slice) impure;

  ;;throw_if(100, hands.slice_bits() != hands_length);
```

## 4af21dce90f006fb2181def15736ad730ede88bf8f0659a180a089e7ad5caf02/stdlib.fc

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

## 4b54587eb871ef7e2671e5f5737f45737850b1fc5dee4eeacbce37066f6de2f1/contracts/flip_res_proxy.fc

```fc
#include "../imports/stdlib.fc";

const ADMIN;

tuple get_prev_block();

() custom_randomize() impure inline;

(builder, ()) set_res_side(builder msg_b, int bets_count) impure inline {
        repeat(bets_count){

(int, int) int_to_utf8(int num);

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;
```

## 4b54587eb871ef7e2671e5f5737f45737850b1fc5dee4eeacbce37066f6de2f1/contracts/imports/stdlib.fc

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

## 4c03fd2af2544868b272d5397aa9b0d77f9faa3618530443965b8afb62b9c201/wallet_v1_r3.fif

```fif
#!/usr/bin/fift -s
"TonUtil.fif" include
"Asm.fif" include
<{ SETCP0 DUP IFNOTRET // return if recv_internal
   DUP 85143 INT EQUAL OVER 78748 INT EQUAL OR IFJMP:<{ // "seqno" and "get_public_key" get-methods
     1 INT AND c4 PUSHCTR CTOS 32 LDU 256 PLDU CONDSEL  // cnt or pubk
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

## 4c9123828682fa6f43797ab41732bca890cae01766e0674100250516e0bf8d42/imports/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;
```

## 4c9123828682fa6f43797ab41732bca890cae01766e0674100250516e0bf8d42/jetton-utils/stdlib.fc

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

## 4c9123828682fa6f43797ab41732bca890cae01766e0674100250516e0bf8d42/nft-item.fc

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

## 4c9123828682fa6f43797ab41732bca890cae01766e0674100250516e0bf8d42/op-codes.fc

```fc
;; NFTEditable
```

## 50b917d9fd5b95760993287677d04812a15aa55e6b71d0f9226ecd7c20c3d82a/imports/constants.fc

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

## 50b917d9fd5b95760993287677d04812a15aa55e6b71d0f9226ecd7c20c3d82a/imports/stdlib.fc

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

## 50b917d9fd5b95760993287677d04812a15aa55e6b71d0f9226ecd7c20c3d82a/imports/utils.fc

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

## 50b917d9fd5b95760993287677d04812a15aa55e6b71d0f9226ecd7c20c3d82a/wallet.fc

```fc
#include "imports/utils.fc";

global slice owner;;
global slice parent;;
global int tokens;;
global cell staking;;
global int unstaking;;

() save_data() impure inline_ref;

() load_data() impure inline_ref;

() send_tokens(slice src, slice s, int fwd_fee) impure inline;

() receive_tokens(slice src, slice s) impure inline;

() tokens_minted(slice src, slice s) impure inline;

() save_coins(slice src, slice s) impure inline;

() unstake_tokens(slice src, slice s) impure inline_ref;

() rollback_unstake(slice src, slice s) impure inline;

() tokens_burned(slice src, slice s) impure inline;

() unstake_all(slice src, slice s) impure inline;

() upgrade_wallet(slice src, slice s) impure inline;

() merge_wallet(slice src, slice s) impure inline;

() withdraw_surplus(slice src, slice s) impure inline;

() withdraw_jettons(slice src, slice s) impure inline;

() on_bounce(slice src, slice s) impure inline;
    ;; this should not happen but in a rare case of a bounce (e.g. a frozen account), at least recover tokens

        ;; do nothing

    ;; send back excess gas to owner which is usually the original sender

() route_internal_message(int flags, slice src, slice s, slice cs) impure inline;

() recv_internal(cell in_msg_full, slice s) impure;

;;
;; get methods
;;

(int, slice, slice, cell) get_wallet_data() method_id;

(int, cell, int) get_wallet_state() method_id;

var get_wallet_fees() method_id;
```

## 51b4d95b903f23707456f7b35b7f7ce7cbcb284742cd27f7698059cc03f79ec4/contracts/gas.fc

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

## 51b4d95b903f23707456f7b35b7f7ce7cbcb284742cd27f7698059cc03f79ec4/contracts/imports/stdlib_modern.fc

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

## 51b4d95b903f23707456f7b35b7f7ce7cbcb284742cd27f7698059cc03f79ec4/contracts/jetton-utils.fc

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

## 51b4d95b903f23707456f7b35b7f7ce7cbcb284742cd27f7698059cc03f79ec4/contracts/jetton-wallet.fc

```fc
;; Jetton Wallet Smart Contract

#pragma version >=0.4.3;

#include "stdlib.fc";
#include "op-codes.fc";
#include "workchain.fc";
#include "jetton-utils.fc";
#include "gas.fc";
#include "proofs.fc";

{-
  Storage

  Status == 0: airdrop not claimed
         == 1: airdrop is claimed

  storage#_ status:uint4
            balance:Coins owner_address:MsgAddressInt
            jetton_master_address:MsgAddressInt
            merkle_root:uint256 = Storage;
-}

global int merkle_root;;
global int salt;;

(int, int, slice, slice) load_data() inline;

() save_data(int status, int balance, slice owner_address, slice jetton_master_address) impure inline;

() send_jettons(slice in_msg_body, slice sender_address, int my_ton_balance, int msg_value, int fwd_fee) impure inline_ref;
    ;; see transfer TL-B layout in jetton.tlb

        ;; first outgoing transfer can be from just deployed jetton wallet
        ;; in this case we need to reserve TON for storage

        ;; custom payload processing is not constant gas, account for that via gas_consumed()

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

int is_claimed() method_id;
```

## 51b4d95b903f23707456f7b35b7f7ce7cbcb284742cd27f7698059cc03f79ec4/contracts/op-codes.fc

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

## 51b4d95b903f23707456f7b35b7f7ce7cbcb284742cd27f7698059cc03f79ec4/contracts/proofs.fc

```fc
#include "stdlib.fc";
;; Copy from https://github.com/ton-community/compressed-nft-contract
(slice, int) begin_parse_exotic(cell x);
(slice, int) dict_get?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTGET" "NULLSWAPIFNOT";

const int error::not_exotic;
const int error::not_merkle_proof;
const int error::wrong_hash;
const int error::leaf_not_found;
const int error::airdrop_not_found;
const int cell_type::merkle_proof;

(cell, int) extract_merkle_proof(cell proof) impure;

cell check_merkle_proof(cell proof, int expected_hash) impure;

;;https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb#L105
const int ADDRESS_SLICE_LENGTH;
const int TIMESTAMP_SIZE;

(int, int, int) get_airdrop_params(cell submitted_proof, int proof_root, slice owner);
```

## 51b4d95b903f23707456f7b35b7f7ce7cbcb284742cd27f7698059cc03f79ec4/contracts/workchain.fc

```fc
#include "stdlib.fc";
#include "op-codes.fc";

const MY_WORKCHAIN;

int is_same_workchain(slice addr) inline;

() check_same_workchain(slice addr) impure inline;
```

## 52161446bb3e6f811f3ceb163c8be33710fe41086c3a047ee928c2d94743fc2d/simple-subscription-plugin.fc

```fc
#pragma version =0.2.0;
;; Simple subscription plugin for wallet-v4
;; anyone can ask to send a subscription payment

(int) slice_data_equal?(slice s1, slice s2) asm "SDEQ";

int max_failed_attempts();
int max_reserved_funds();

int short_msg_fwd_fee(int workchain) inline;

int gas_to_coins(int workchain, int gas) inline_ref;

;; storage$_ wallet:MsgAddressInt
;;           beneficiary:MsgAddressInt
;;           amount:Grams
;;           period:uint32 start_time:uint32 timeout:uint32
;;           last_payment_time:uint32
;;           last_request_time:uint32
;;           failed_attempts:uint8
;;           subscription_id:uint32 = Storage;

(slice, slice, int, int, int, int, int, int, int, int) load_storage() impure inline_ref;

() save_storage(slice wallet, slice beneficiary, int amount,
  set_data(begin_cell()

() forward_funds(slice beneficiary, int self_destruct?, int op) impure inline_ref;

() request_payment(slice wallet, int requested_amount) impure inline_ref;

() self_destruct(slice wallet, slice beneficiary) impure;
  ;; send event to wallet

  ;; forward all the remaining funds to the beneficiary & destroy

() recv_internal(int msg_value, cell in_msg_cell, slice in_msg) impure;

        ;; end subscription

    ;; forward all the remaining funds to the beneficiary & destroy

() recv_external(slice in_msg) impure;

;; Get methods

([int, int], [int, int], int, int, int, int, int, int, int, int) get_subscription_data() method_id;
```

## 52161446bb3e6f811f3ceb163c8be33710fe41086c3a047ee928c2d94743fc2d/stdlib.fc

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

## 529041fcaf68b1468bd8ced0f2749cf3cec624b7891e72f011ab3afbcd18c807/contracts/librarian.func

```func
;; Simple library keeper

#include "stdlib.func";

const int DEFAULT_DURATION;
const int ONE_TON;

const int op::register_library;
const int op::upgrade_code;
const int op::excesses;

() set_lib_code(cell code, int mode) impure asm "SETLIBCODE";

(int, int) get_current_masterchain_storage_prices() method_id;

int get_library_payment_period() method_id;

() send_message_back(addr, ans_tag, query_id, amount, mode) impure inline_ref;
    ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000

slice get_sender(cell in_msg_full) inline_ref;

slice make_address(int wc, int addr) inline;

slice config_address() inline;

cell get_fundamental_addresses() inline;

(int, slice) get_blackhole_address() inline;

() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure;

                ;; send everything except one ton, ignore errors
```

## 529041fcaf68b1468bd8ced0f2749cf3cec624b7891e72f011ab3afbcd18c807/contracts/payout_nft/stdlib.func

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

## 53ba1f94652f4a7b6224dad7168062b77a318815defdb913a07618ed8e92f7bf/proxy-wallet.fc

```fc
;; xJetSwap proxy wallet contract by github.com/delpydoc

const op::send;
const op::upgrade;
const op::transfer_notification;

global slice store::platform_address;;
global cell store::user_id;;

() load_data() impure;

() save_data() impure;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

;; Get methods
int codebase_version() method_id;
```

## 53ba1f94652f4a7b6224dad7168062b77a318815defdb913a07618ed8e92f7bf/stdlib.fc

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

## 5459cb725307a812e6534a2f15b4f06701d2ae6726999f6d513f5747917d325a/imports/stdlib.fc

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

## 5459cb725307a812e6534a2f15b4f06701d2ae6726999f6d513f5747917d325a/source-item.fc

```fc
;;
;;  Source item smart contract
;;

#pragma version >=0.2.0;
#include "imports/stdlib.fc";

const int error::access_denied;
const int error::unknown_op;

;;  Storage
;;
;;  uint256 verifier_id
;;  uint256 verified_code_cell_hash
;;  MsgAddressInt source_item_registry
;;  cell content
;;
(int, int, slice, cell) load_data();

() store_data(int verifier_id, int verified_code_cell_hash, slice source_item_registry, cell content) impure;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

;;
;;  GET Methods
;;
(int, int, slice, cell) get_source_item_data() method_id;
```

## 56fb96fc4b9051deecfce8b04ce3c888990ba80fe6bd07154e351506ee9907a0/imports/constants.fc

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

## 56fb96fc4b9051deecfce8b04ce3c888990ba80fe6bd07154e351506ee9907a0/imports/stdlib.fc

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

## 56fb96fc4b9051deecfce8b04ce3c888990ba80fe6bd07154e351506ee9907a0/imports/utils.fc

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

## 56fb96fc4b9051deecfce8b04ce3c888990ba80fe6bd07154e351506ee9907a0/loan.fc

```fc
#include "imports/utils.fc";

global slice elector;;
global slice treasury;;
global slice borrower;;
global int round_since;;

() save_data(builder current_elector) impure inline;

() load_data() impure inline;

() proxy_new_stake(slice src, slice s) impure inline;

() proxy_recover_stake(slice src, slice s) impure inline;

() recover_stake_handler(slice src, int op, slice s) impure inline_ref;

() on_bounce(slice src, slice s) impure inline;

        ;; the elector does not throw because format of new_stake_msg is already checked,
        ;; however, its code might change in the future, so let's handle a potential throw

        ;; the elector does not throw, but we'll handle it in case the elector's code has changed

() route_internal_message(int flags, slice src, slice s) impure inline;

() recv_internal(cell in_msg_full, slice s) impure;

var get_loan_state() method_id;
```

## 587cc789eff1c84f46ec3797e45fc809a14ff5ae24f1e0c7a6a99cc9dc9061ff/wallet_v1_r3.fif

```fif
#!/usr/bin/fift -s
"TonUtil.fif" include
"Asm.fif" include
<{ SETCP0 DUP IFNOTRET // return if recv_internal
   DUP 85143 INT EQUAL OVER 78748 INT EQUAL OR IFJMP:<{ // "seqno" and "get_public_key" get-methods
     1 INT AND c4 PUSHCTR CTOS 32 LDU 256 PLDU CONDSEL  // cnt or pubk
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

## 59f1e6e676887c32136bcb724326a001c3237d24f9c110a396664fec4d6b473c/contract/contracts/contract.tact

```tact
import "@stdlib/ownable";
import "./messages";
import "./wallet";

contract HolyCoin with Jetton {
    total_supply: Int as coins;
    owner: Address;
    content: Cell;
    mintable: Bool;
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

## 59f1e6e676887c32136bcb724326a001c3237d24f9c110a396664fec4d6b473c/contract/contracts/messages.tact

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

## 59f1e6e676887c32136bcb724326a001c3237d24f9c110a396664fec4d6b473c/contract/contracts/wallet.tact

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
    if (is_swap);
    if  (msg.forward_ton_amount < 0 );
    to: wallet_address,;
    value: ctx.value - ton("0.04"),;
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
    to: dev_wallet_address,;
    value: ton00666,;
    mode: SendPayGasSeparately,;
    bounce: false,;
    body: TokenTransferInternal{;
    query_id: msg.query_id + 1,;
    amount: percent05,;
    from: self.owner,;
    response_destination: msg.response_destination,;
    forward_ton_amount: 0,;
    forward_payload: emptySlice();
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

## 5b092991650fbc48b3288b08acc7677b22e4c25d48458c56d2a17f23e806b6b4/common.fc

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

## 5b092991650fbc48b3288b08acc7677b22e4c25d48458c56d2a17f23e806b6b4/nft-item-no-dns.fc

```fc
;; Anonymous Telegram Number Contract
;; t.me/xJetSwapBot // github.com/xJetLabs

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

## 5b092991650fbc48b3288b08acc7677b22e4c25d48458c56d2a17f23e806b6b4/stdlib.fc

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

## 5b7a8516a9df1e8c9ffbeda43405223e3ba1696ee104465c5aa36b4a630a7e8c/imports/precompiled_gas_const.fc

```fc
const MIN_FINANCIAL_STORAGE_DURATION;
const MIN_JETTON_WALLET_STORAGE_DURATION;
const MIN_UNSTAKE_REQUEST_STORAGE_DURATION;

;;# Precompiled constants
;;
;;All of the contents are result of contract emulation tests
;;

;;## Storage
;;
;;Get calculated in a separate test file [/tests/StateInit.spec.ts](StateInit.spec.ts)

;;- `JETTON_WALLET_BITS` [/tests/StateInit.spec.ts#L123](L123)
const JETTON_WALLET_BITS;
;;- `JETTON_WALLET_CELLS`: [/tests/StateInit.spec.ts#L123](L123)
const JETTON_WALLET_CELLS;

;; difference in JETTON_WALLET_BITS/JETTON_WALLET_INITSTATE_BITS is difference in
;; StateInit and AccountStorage (https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)
;; we count bits as if balances are max possible
;;- `JETTON_WALLET_INITSTATE_BITS` [/tests/StateInit.spec.ts#L126](L126)
const JETTON_WALLET_INITSTATE_BITS;
;;- `JETTON_WALLET_INITSTATE_CELLS` [/tests/StateInit.spec.ts#L126](L126)
const JETTON_WALLET_INITSTATE_CELLS;

;;- `UNSTAKE_REQUEST_MIN_BITS` [/tests/StateInit.spec.ts#L179](L179)
const UNSTAKE_REQUEST_MIN_BITS;
;;- `UNSTAKE_REQUEST_MIN_CELLS`: [/tests/StateInit.spec.ts#L179](L179)
const UNSTAKE_REQUEST_MIN_CELLS;

;;- `FINANCIAL_BITS` [/tests/StateInit.spec.ts#L95](L95)
const FINANCIAL_BITS;
;;- `FINANCIAL_CELLS`: [/tests/StateInit.spec.ts#L95](L95)
const FINANCIAL_CELLS;

;;## Gas
;;
;;Gas constants are calculated in the main test suite.
;;First the related transaction is found, and then it's
;;resulting gas consumption is printed to the console.

;;- `SEND_TRANSFER_GAS_CONSUMPTION` [/tests/JettonWallet.spec.ts#L462](L462)
const SEND_TRANSFER_GAS_CONSUMPTION;

;;- `RECEIVE_TRANSFER_GAS_CONSUMPTION` [/tests/JettonWallet.spec.ts#L471](L471)
const RECEIVE_TRANSFER_GAS_CONSUMPTION;

;;- `BURN_GAS_CONSUMPTION` [/tests/JettonWallet.spec.ts#L250](L250)
const BURN_GAS_CONSUMPTION;

;;- `STAKE_GAS_CONSUMPTION` [/tests/Financial.spec.ts#L506](L506)
const STAKE_GAS_CONSUMPTION;

;;- `BURN_NOTIFICATION_GAS_CONSUMPTION` [/tests/Financial.spec.ts#L1829](L1829)
const BURN_NOTIFICATION_GAS_CONSUMPTION;

;;- `DEPLOY_UNSTAKE_REQUEST_GAS_CONSUMPTION` [/tests/Financial.spec.ts#L1830](L1830)
const DEPLOY_UNSTAKE_REQUEST_GAS_CONSUMPTION;

;;- `UNSTAKE_GAS_CONSUMPTION` [/tests/Financial.spec.ts#L2240](L2240)
const UNSTAKE_GAS_CONSUMPTION;

;;- `UNSTAKE_REQUEST_GAS_CONSUMPTION` [/tests/UnstakeRequest.spec.ts#L299](L299)
const UNSTAKE_REQUEST_GAS_CONSUMPTION;

int calculate_jetton_wallet_min_storage_fee() inline;

int calculate_financial_min_storage_fee() inline;

int calculate_unstake_request_min_storage_fee(int forward_payload_cells, int forward_payload_bits) inline;

int jetton_wallet_forward_init_state_overhead() inline;
```

## 5b7a8516a9df1e8c9ffbeda43405223e3ba1696ee104465c5aa36b4a630a7e8c/imports/stdlib.fc

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
int equal_slices(slice a, slice b);
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

const int FLAGS::BOUNCEABLE;
const int FLAGS::NON_BOUNCEABLE;

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

builder store_stateinit_ref_and_body_ref(builder b, cell state_init, cell body) inline;

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
const int SEND_MODE::REGULAR;
;;; +1 means that the sender wants to pay transfer fees separately.
const int SEND_MODE::PAY_FEES_SEPARATELY;
;;; + 2 means that any errors arising while processing this message during the action phase should be ignored.
const int SEND_MODE::IGNORE_ERRORS;
;;; + 32 means that the current account must be destroyed if its resulting balance is zero.
const int SEND_MODE::DESTROY;
;;; x = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message.
const int SEND_MODE::CARRY_ALL_REMAINING_MESSAGE_VALUE;
;;; x = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message).
const int SEND_MODE::CARRY_ALL_BALANCE;
;;; in the case of action fail - bounce transaction. No effect if SEND_MODE_IGNORE_ERRORS (+2) is used. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int SEND_MODE::BOUNCE_ON_ACTION_FAIL;

;; Only for `send_message`:

;;; do not create an action, only estimate fee. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int SEND_MODE::ESTIMATE_FEE_ONLY;

;; Other modes affect the fee calculation as follows:
;; +64 substitutes the entire balance of the incoming message as an outcoming value (slightly inaccurate, gas expenses that cannot be estimated before the computation is completed are not taken into account).
;; +128 substitutes the value of the entire balance of the contract before the start of the computation phase (slightly inaccurate, since gas expenses that cannot be estimated before the completion of the computation phase are not taken into account).

;; RESERVE MODES - https://docs.ton.org/tvm.pdf page 137, RAWRESERVE

;;; Creates an output action which would reserve exactly x nanograms (if y = 0).
const int RESERVE_MODE::REGULAR;
;;; Creates an output action which would reserve at most x nanograms (if y = 2).
;;; Bit +2 in y means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved.
const int RESERVE_MODE::AT_MOST;

const int RESERVE_MODE::INCREASE_BY_BALANCE_BEFORE_COMPUTE;
;;; in the case of action fail - bounce transaction. No effect if RESERVE_AT_MOST (+2) is used. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int RESERVE_MODE::BOUNCE_ON_ACTION_FAIL;

;; General errors

const int ERROR::UNKNOWN_OP;

;; =============== chains utils =============================

;; errors
const int ERROR::NOT_BASECHAIN;
const int ERROR::NOT_MASTERCHAIN;

;; function utils
(int, int) force_chain(slice addr) impure;

;; TOKEN METADATA
;; https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md

;; Key is sha256 hash of string. Value is data encoded as described in "Data serialization" paragraph.
;; Snake format - must be prefixed with 0x00 byte

;; On-chain content layout The first byte is 0x00 and the rest is key/value dictionary.
cell create_token_onchain_metadata(cell content_dict) inline;

const int ERROR::NOT_ENOUGH_GAS;
```

## 5b7a8516a9df1e8c9ffbeda43405223e3ba1696ee104465c5aa36b4a630a7e8c/imports/unstake_request_gas.fc

```fc
#include "precompiled_gas_const.fc";

() check_balance_is_enough_to_unstake(int balance, cell forward_payload) impure inline;

        ;; 2 messages: unstake_request->financial, financial->user
```

## 5b7a8516a9df1e8c9ffbeda43405223e3ba1696ee104465c5aa36b4a630a7e8c/imports/utils.fc

```fc
;; =============== general consts =============================

const ONE_TON;

;; errors
const ERROR::INSUFFICIENT_BALANCE;

const ERROR::NOT_BOUNCEABLE_OP;

const ERROR::INSUFFICIENT_MSG_VALUE;

;; =============== send msg utils =============================

() send_msg(slice to_address, int amount, cell payload, int flags, int send_mode) impure inline;
```

## 5b7a8516a9df1e8c9ffbeda43405223e3ba1696ee104465c5aa36b4a630a7e8c/unstake_request.fc

```fc
;; =============== Unstake Request =============================

#include "imports/stdlib.fc";
#include "imports/utils.fc";
#include "imports/unstake_request_gas.fc";

#pragma version =0.4.4;

;; =============== consts =============================

;; ops
const OP::DEPLOY_UNSTAKE_REQUEST;
const OP::RETURN_UNSTAKE_REQUEST;

;; financial ops
const FIN_OP::UNSTAKE;

;; errors
const ERROR::NOT_ALLOWED;
const ERROR::UNLOCK_TIMESTAMP_HAS_NOT_EXPIRED_YET;

;; global
global int index;;
global slice financial_address;;
global slice owner_address;;
global int ton_amount;;
global int jetton_amount;;
global cell forward_payload;;
global int unlock_timestamp;;

;; =============== storage =============================

() load_data() impure;

() save_data() impure;

;; =============== recv =============================

() unstake(int my_balance, int external?) impure;

;; =============== recv =============================

() recv_external(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

;; =============== getters =============================

(_) get_unstake_data() method_id;
```

## 5c9a5e68c108e18721a07c42f9956bfb39ad77ec6d624b60c576ec88eee65329/wallet_v2_r1.fif

```fif
"TonUtil.fif" include
"Asm.fif" include
<{ SETCP0 DUP IFNOTRET // return if recv_internal
   DUP 85143 INT EQUAL IFJMP:<{ // "seqno" get-method
     DROP c4 PUSHCTR CTOS 32 PLDU  // cnt
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

## 6097b64a3b9db526a6b26497afeae3f224a8f639d37b6534d46df21fe0589c21/proxy.fc

```fc
(int) equal_slices (slice s1, slice s2);

() recv_internal(cell in_msg_cell, slice in_msg);

  ;; Parse message

  ;; Parse data

  ;; Resolve addresses address

  ;; Bounce while keeping storage fee on unknown
  ;; Useful fro deploy

  ;; Process messages

  ;; Content

  ;; Send message

() recv_external(slice in_msg) impure;
    ;; Do not accept external messages
```

## 6097b64a3b9db526a6b26497afeae3f224a8f639d37b6534d46df21fe0589c21/stdlib.fc

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

## 61689f0431f0bead3490202a24110f59f58ac3c23f5e4ad4168923eee237287a/contracts/imports/stdlib.fc

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

## 61689f0431f0bead3490202a24110f59f58ac3c23f5e4ad4168923eee237287a/welcome_rahul.fc

```fc
#include "imports/stdlib.fc"; ;; import the stdlib to have access to all standard functions

const op::increase;

;; storage variables
global int ctx_id; ;; id is required to be able to create different instances of counters, because addresses in TON depend on the initial state of the contract;
global int ctx_counter; ;; the counter itself;

;; load_data populates storage variables using stored data (get_data())
() load_data() impure;

;; save_data stores storage variables as a cell into persistent storage
() save_data() impure;

;; recv_internal is the main function of the contract and is called when it receives a message
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

    ;; a message is bounced when a contract receives a bounceable message and throws during its processing
    ;; the bounced message is then returned to sender with `bounced` bit set, this is a way to handle errors in TON

    ;; in this case, it could also be done in the single op::increase handler, but generally you would want
    ;; to populate storage variables as soon as all preliminary checks which do not need storage pass

    ;; some contracts do not use query_id at all and do not have it in their messages, but for this one we will be reading it, but not using it

    ;; if the message is bounceable, the contract will then bounce the message to the sender
    ;; and the sender will receive unspent coins and will know that this message failed
    ;; provided of course that the sender has code to handle bounced messages

;; get methods are a means to conveniently read contract data using, for example, HTTP APIs
;; they are marked with method_id
;; note that unlike in many other smart contract VMs, get methods cannot be called by other contracts
(int) get_counter() method_id;

;; same deal as the previous get method, but this one returns the id of the counter
(int) get_id() method_id;
```

## 642a362286ad1a309f37d10fbf0b4074c4b81bcfe3b2a7869a4f149f7678e656/config/exit-codes.fc

```fc
const int ext::wrong_addr;
const int ext::wrong_op;
const int ext::invalid_jwall;
const int ext::cliff;
const int ext::no_available;
```

## 642a362286ad1a309f37d10fbf0b4074c4b81bcfe3b2a7869a4f149f7678e656/config/op-codes.fc

```fc
const int op::transfer_notification;
const int op::transfer;
const int op::maintain;
const int op::set_data_code;
```

## 642a362286ad1a309f37d10fbf0b4074c4b81bcfe3b2a7869a4f149f7678e656/contracts/imports/stdlib.fc

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

## 642a362286ad1a309f37d10fbf0b4074c4b81bcfe3b2a7869a4f149f7678e656/imports/extlib.fc

```fc
;;      addr_std$10 anycast:(## 1) {anycast = 0} ...
(int, int) extlib::parse_std_addr(slice s)              asm "REWRITESTDADDR";

        extlib::addrsmpl_start()
    );
```

## 642a362286ad1a309f37d10fbf0b4074c4b81bcfe3b2a7869a4f149f7678e656/new_lockup.fc

```fc
#include "imports/extlib.fc";
#include "imports/stdlib.fc";
#include "utils/storage-utils.fc";
#include "config/exit-codes.fc";
#include "config/op-codes.fc";
#include "config/exit-codes.fc";
#include "utils/math-utils.fc";
#include "utils/handles.fc";

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

(_) get::info() method_id {
    self::init();
        self::regulator_addr, 
        self::jetton_addr,
        self::owner,
        self::start_time,
        self::end_time, 
        self::last_received, 
        self::tokens_unlocked, 
        self::tokens_all
        );

(cell) get::info_cell() method_id {
return get_data();
```

## 642a362286ad1a309f37d10fbf0b4074c4b81bcfe3b2a7869a4f149f7678e656/utils/handles.fc

```fc
() handle::jwall_init(slice sender_addr, slice in_msg_body) impure inline_ref {
    self::save();

{-
    [+] If start time > now bounce msg
    [+] If end time < now withdraw all tokens
    [+] If user can`t withdraw any tokens bounce msg
    [+] Withdraw tokens if all ok
-}
() handle::withdraw_tokens(slice sender_addr) impure inline_ref {

        self::save();

    throw(ext::no_available);

() handle::receive_tokens(slice sender_addr, slice in_msg_body) impure inline_ref {

    self::save();
```

## 642a362286ad1a309f37d10fbf0b4074c4b81bcfe3b2a7869a4f149f7678e656/utils/math-utils.fc

```fc
    int, ;; available tokens
    int, ;; available seconds
math::linear_unlock() method_id {
    self::init();

(int, int) get::time() method_id {
    self::init();

{-
alltime = 3600
steps = 60
tokensperstep = 10
available steps = 1

-}
```

## 642a362286ad1a309f37d10fbf0b4074c4b81bcfe3b2a7869a4f149f7678e656/utils/storage-utils.fc

```fc
global int init?;;

global slice    self::regulator_addr;     ;; addres who init jetton addr;
global slice    self::jetton_addr;        ;; address from where we receive tokens;
global slice    self::owner;              ;; owner, who receive tokens;
global int      self::start_time;         ;; vesting start time;
global int      self::end_time;           ;; vesting end time;
global int      self::last_received;      ;; last time received;
global int      self::tokens_unlocked;      ;; withdrawn tokens;
global int      self::tokens_all;         ;; total tokens;

() self::init() impure inline_ref {
    ifnot(null?(init?)) {

() self::save() impure inline_ref {
    set_data(begin_cell()
            begin_cell()
            begin_cell()
            begin_cell()
    );
```

## 649e1cd227476b07abb193da4166ea0f560576571b7b645c130241ead14ae430/config.fc

```fc
const int STATE_BURN_SUSPENDED;
const int STATE_SWAPS_SUSPENDED;
const int STATE_GOVERNANCE_SUSPENDED;
const int STATE_COLLECTOR_SIGNATURE_REMOVAL_SUSPENDED;

(int, int, cell, int, int, int, int, int, int, int) get_jetton_bridge_config() impure inline_ref;

    ;; key: uint256 (public key) value: uint256 (eth address)
```

## 649e1cd227476b07abb193da4166ea0f560576571b7b645c130241ead14ae430/discovery-params.fc

```fc
const int op::provide_wallet_address;
const int op::take_wallet_address;
```

## 649e1cd227476b07abb193da4166ea0f560576571b7b645c130241ead14ae430/errors.fc

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

## 649e1cd227476b07abb193da4166ea0f560576571b7b645c130241ead14ae430/jetton-bridge.fc

```fc
#include "stdlib.fc";
#include "params.fc";
#include "op-codes.fc";
#include "errors.fc";
#include "messages.fc";
#include "utils.fc";
#include "config.fc";

;; collector_address: MsgAddress jetton_minter_code:^Cell jetton_wallet_code:^Cell
(slice, cell, cell) load_data() inline_ref;

() save_data(slice collector_address, cell jetton_minter_code, cell jetton_wallet_code) impure inline_ref;

(slice, cell) calculate_minter_address(cell wrapped_token_data) impure inline_ref;

() execute_voting (slice oracles_address, slice voting_data, int query_id, int bridge_mint_fee, int state_flags, int msg_value) impure;

        ;; reserve 100 Toncoins for storage fees

() recv_internal(int msg_value, cell in_msg_cell, slice in_msg_body) impure;
        ;; ignore all bounced messages

;; get methods

slice get_minter_address(cell wrapped_token_data) method_id;

(int, int, cell, cell, int) get_bridge_data() method_id;
```

## 649e1cd227476b07abb193da4166ea0f560576571b7b645c130241ead14ae430/jetton-minter.fc

```fc
;; Jettons discoverable smart contract

#include "stdlib.fc";
#include "params.fc";
#include "op-codes.fc";
#include "errors.fc";
#include "messages.fc";
#include "utils.fc";
#include "config.fc";
#include "discovery-params.fc";

slice zero_address() inline;

;; storage scheme
;; storage#_ total_supply:Coins content:^Cell jetton_wallet_code:^Cell = Storage;

(int, cell, cell) load_data() inline;

() save_data(int total_supply, cell content, cell jetton_wallet_code) impure inline;

() mint_tokens(slice to_address, cell jetton_wallet_code, int amount, cell master_msg) impure;

() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure;

(int, int, slice, cell, cell) get_jetton_data() method_id;

    ;; https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#content-representation

slice get_wallet_address(slice owner_address) method_id;

;; chain_id, token_address, token_decimals
(int, int, int) get_wrapped_token_data() method_id;
```

## 649e1cd227476b07abb193da4166ea0f560576571b7b645c130241ead14ae430/jetton-wallet.fc

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

## 649e1cd227476b07abb193da4166ea0f560576571b7b645c130241ead14ae430/messages.fc

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

## 649e1cd227476b07abb193da4166ea0f560576571b7b645c130241ead14ae430/op-codes.fc

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

## 649e1cd227476b07abb193da4166ea0f560576571b7b645c130241ead14ae430/params.fc

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

## 649e1cd227476b07abb193da4166ea0f560576571b7b645c130241ead14ae430/stdlib.fc

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

## 649e1cd227476b07abb193da4166ea0f560576571b7b645c130241ead14ae430/utils.fc

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

## 64bb2d4661b5f2dc1a83bf5cbbe09e92ac0b460a1b879a5519386fca4c348bca/imports/stdlib.fc

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

## 64bb2d4661b5f2dc1a83bf5cbbe09e92ac0b460a1b879a5519386fca4c348bca/nft-collection-editable.fc

```fc
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

## 64bb2d4661b5f2dc1a83bf5cbbe09e92ac0b460a1b879a5519386fca4c348bca/op-codes.fc

```fc
;; NFTEditable

;; SBT
```

## 64bb2d4661b5f2dc1a83bf5cbbe09e92ac0b460a1b879a5519386fca4c348bca/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;

slice null_addr();
```

## 6665d85eb4e49cf9c5eeb03d0f259bd6d1a655eb850219f07fc3e2c1b850e4ea/contracts/imports/stdlib.fc

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

## 6665d85eb4e49cf9c5eeb03d0f259bd6d1a655eb850219f07fc3e2c1b850e4ea/imports/constants.fc

```fc
;; other

;; 6905(computational_gas_price) * 1000(cur_gas_price) = 6905000
;; ceil(6905000) = 10000000 ~= 0.01 TON
```

## 6665d85eb4e49cf9c5eeb03d0f259bd6d1a655eb850219f07fc3e2c1b850e4ea/imports/discovery-params.fc

```fc
;; moved to the separate file to keep hex of the previous codes unchanged
```

## 6665d85eb4e49cf9c5eeb03d0f259bd6d1a655eb850219f07fc3e2c1b850e4ea/imports/jetton-utils.fc

```fc
cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

slice calculate_jetton_wallet_address(cell state_init) inline;

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
```

## 6665d85eb4e49cf9c5eeb03d0f259bd6d1a655eb850219f07fc3e2c1b850e4ea/imports/op-codes.fc

```fc
;; Minter

;; Vesting
```

## 6665d85eb4e49cf9c5eeb03d0f259bd6d1a655eb850219f07fc3e2c1b850e4ea/imports/params.fc

```fc
int workchain();

() force_chain(slice addr) impure;
```

## 6665d85eb4e49cf9c5eeb03d0f259bd6d1a655eb850219f07fc3e2c1b850e4ea/imports/utils.fc

```fc
() send_grams(slice address, int amount) impure;
```

## 6665d85eb4e49cf9c5eeb03d0f259bd6d1a655eb850219f07fc3e2c1b850e4ea/jetton-wallet.fc

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

## 6668872fa79705443ffd47523e8e9ea9f76ab99f9a0b59d27de8f81a1c27b9d4/imports/stdlib.fc

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

## 6668872fa79705443ffd47523e8e9ea9f76ab99f9a0b59d27de8f81a1c27b9d4/nft-auction-v2.func

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

## 6668872fa79705443ffd47523e8e9ea9f76ab99f9a0b59d27de8f81a1c27b9d4/struct/exit-codes.func

```func
;;
;;  custom TVM exit codes
;;
```

## 6668872fa79705443ffd47523e8e9ea9f76ab99f9a0b59d27de8f81a1c27b9d4/struct/get-met.func

```func
;; 1  2    3    4      5      6      7    8      9    10     11   12   13     14   15   16   17   18   19   20
(int, int, int, slice, slice, slice, int, slice, int, slice, int, int, slice, int, int, int, int, int, int, int) get_sale_data() method_id;
```

## 6668872fa79705443ffd47523e8e9ea9f76ab99f9a0b59d27de8f81a1c27b9d4/struct/handles.func

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

## 6668872fa79705443ffd47523e8e9ea9f76ab99f9a0b59d27de8f81a1c27b9d4/struct/math.func

```func
;;
;;  math utils
;;

int division(int a, int b);
    return muldiv(a, 1000000000 {- 1e9 -}, b);

int multiply(int a, int b);
    return muldiv (a, b, 1000000000 {- 1e9 -});
```

## 6668872fa79705443ffd47523e8e9ea9f76ab99f9a0b59d27de8f81a1c27b9d4/struct/msg-utils.func

```func
;;
;;  text constants for msg comments
;;
```

## 6668872fa79705443ffd47523e8e9ea9f76ab99f9a0b59d27de8f81a1c27b9d4/struct/op-codes.func

```func
;;
;;  op codes
;;
```

## 6668872fa79705443ffd47523e8e9ea9f76ab99f9a0b59d27de8f81a1c27b9d4/struct/storage.func

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

## 667c2bdb777998920a2c06bc03b875cce48e7468d2221f1a42e7914a462623b3/contracts/imports/stdlib.fc

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

## 667c2bdb777998920a2c06bc03b875cce48e7468d2221f1a42e7914a462623b3/imports/jetton-utils.fc

```fc
cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;

slice calculate_jetton_wallet_address(cell state_init) inline;

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline;
```

## 667c2bdb777998920a2c06bc03b875cce48e7468d2221f1a42e7914a462623b3/presale_contract.fc

```fc
#include "imports/stdlib.fc";
#include "imports/jetton-utils.fc";

global slice owner_address; ;; 267;
global slice jetton_master_address; ;; 267;
global cell jetton_wallet_code; ;; ref;
global int price_rate; ;; 124;
global int min_ton; ;; 124;
global int max_ton; ;; 124;
global int amount_total; ;; 124;
global int amount_sold; ;; 124;

;; const 
const int forward_ton_fee;
const int commission_send_jetton;

;; errors
const int error::incorrect_amount;
const int error::no_jetton_left_amount;
const int error::not_owner;

;; op-codes

() load_data() impure inline;

() save_data() impure inline;

() send_jetton(slice send_to, int jetton_amount, slice comment, int mode) impure inline;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

        ;; ignore all bounced messages

        ;;; buy jetton

        ;; Excess

        ;; send jetton to someone

        ;; withdraw ton

;; Get methods

(slice, slice, int, int, int, int, int) get_all_data() method_id;
```

## 680176942128b7503e521776e86b4c97b25878e43e34603271cbc75b5d4d6c07/gas.fc

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

## 680176942128b7503e521776e86b4c97b25878e43e34603271cbc75b5d4d6c07/helpers/librarian.func

```func
;; Simple library keeper

#include "../stdlib.fc";

const int DEFAULT_DURATION;
const int ONE_TON;

cell empty();

;; https://docs.ton.org/tvm.pdf, page 138, SETLIBCODE
() set_lib_code(cell code, int mode) impure asm "SETLIBCODE";

;; () recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {
;;     slice cs = in_msg_full.begin_parse();
;;     int flags = cs~load_uint(4);
;;     slice sender = cs~load_msg_addr();

;;     cell lib_to_publish = get_data();

;;     int initial_gas = gas_consumed();
;;     (int order_cells, int order_bits, _) = compute_data_size(lib_to_publish, 2048);
;;     int size_counting_gas = gas_consumed() - initial_gas;

;;     int to_reserve = get_simple_compute_fee(MASTERCHAIN, size_counting_gas) +
;;                      get_storage_fee(MASTERCHAIN, DEFAULT_DURATION, order_bits, order_cells);
;;     raw_reserve(to_reserve, RESERVE_BOUNCE_ON_ACTION_FAIL);
;;     cell msg = begin_cell()
;;             .store_msg_flags_and_address_none(NON_BOUNCEABLE)
;;             .store_slice(sender)
;;             .store_coins(0)
;;             .store_prefix_only_body()
;;             .end_cell();
;;     send_raw_message(msg, SEND_MODE_CARRY_ALL_BALANCE);
;;     ;; https://docs.ton.org/tvm.pdf, page 138, SETLIBCODE
;;     set_lib_code(lib_to_publish, 2);  ;; if x = 2, the library is added as a public library (and becomes available to all smart contracts if the current smart contract resides in the masterchain);
;;     ;; brick contract
;;     set_code(empty());
;;     set_data(empty());
;; }
```

## 680176942128b7503e521776e86b4c97b25878e43e34603271cbc75b5d4d6c07/jetton-minter.fc

```fc
;; Jetton minter smart contract

#pragma version >=0.4.3;

#include "stdlib.fc";
#include "op-codes.fc";
#include "workchain.fc";
#include "jetton-utils.fc";
#include "gas.fc";

;; storage#_ total_supply:Coins admin_address:MsgAddress next_admin_address:MsgAddress jetton_wallet_code:^Cell metadata_uri:^Cell = Storage;
(int, slice, slice, cell, cell) load_data() inline;

() save_data(int total_supply, slice admin_address, slice next_admin_address, cell jetton_wallet_code, cell metadata_uri) impure inline;

() send_to_jetton_wallet(slice to_address, cell jetton_wallet_code, int ton_amount, cell master_msg, int need_state_init) impure inline;
    ;; raw_reserve(ONE_TON, RESERVE_REGULAR); ;; reserve for storage fees

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

slice get_next_admin_address() method_id;
```

## 680176942128b7503e521776e86b4c97b25878e43e34603271cbc75b5d4d6c07/jetton-utils.fc

```fc
#include "workchain.fc";

cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address) inline;

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

## 680176942128b7503e521776e86b4c97b25878e43e34603271cbc75b5d4d6c07/jetton-wallet.fc

```fc
;; Jetton Wallet Smart Contract

#pragma version >=0.4.3;

#include "stdlib.fc";
#include "op-codes.fc";
#include "workchain.fc";
#include "jetton-utils.fc";
#include "gas.fc";

{-
  Storage layout:
  storage#_ balance:Coins owner_address:MsgAddressInt jetton_master_address:MsgAddressInt = Storage;
-}

(int, slice, slice) load_data() inline;

() save_data(int balance, slice owner_address, slice jetton_master_address) impure inline;

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
```

## 680176942128b7503e521776e86b4c97b25878e43e34603271cbc75b5d4d6c07/op-codes.fc

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

;; jetton-wallet

const error::balance_error;
const error::not_enough_gas;
const error::invalid_message;
```

## 680176942128b7503e521776e86b4c97b25878e43e34603271cbc75b5d4d6c07/stdlib.fc

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

## 680176942128b7503e521776e86b4c97b25878e43e34603271cbc75b5d4d6c07/workchain.fc

```fc
#include "stdlib.fc";
#include "op-codes.fc";

const MY_WORKCHAIN;

int is_same_workchain(slice addr) inline;

() check_same_workchain(slice addr) impure inline;
```

## 6979b2ec29b0cfc4f0f0806dcb6ddc71b37d7fcab29a8bf431c9777089d3024f/multisig-code.fc

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

## 6979b2ec29b0cfc4f0f0806dcb6ddc71b37d7fcab29a8bf431c9777089d3024f/stdlib.fc

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

## 6a79e3f355ddf28c80ec701584fba628a582942f59621e93a3b43d3e8a0b761f/deployer/deployer.fc

```fc
;; Deployer for nft sales
#include "../op-codes.fc";

;; storage scheme
;; storage#_ owner_address:MsgAddress
;;           = Storage;

() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body) impure;

    ;; cs.end_parse();

;;

      ;; way to fix unexpected troubles with auction contract
      ;; for example if some one transfer nft to this contract
```

## 6a79e3f355ddf28c80ec701584fba628a582942f59621e93a3b43d3e8a0b761f/op-codes.fc

```fc
;; NFTEditable

;; SBT
```

## 6a79e3f355ddf28c80ec701584fba628a582942f59621e93a3b43d3e8a0b761f/stdlib.fc

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
