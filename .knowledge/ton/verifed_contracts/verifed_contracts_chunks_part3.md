                merkle_root,
                salt)
        )
        .store_uint(0, 1) ;; Empty libraries
        .end_cell();
}

[cell, int] calculate_jetton_wallet_properties_cheap(slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int merkle_root) inline {
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L144
    _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
    code:(Maybe ^Cell) data:(Maybe ^Cell)
    library:(Maybe ^Cell) = StateInit;
  -}
    int stop = false;
    int min_distance = 0xffff;
    int salt = -1;
    int min_salt = 0;
    (_, int owner_prefix) = parse_std_addr(owner_address);
    owner_prefix = owner_prefix >> (256 - 4);
    builder jetton_wallet_data_base = pack_jetton_wallet_data_builder_base(0, 0, owner_address, jetton_master_address, merkle_root);
    builder jetton_wallet_data_hash_base = pack_jetton_wallet_data_hash_base(jetton_wallet_data_base);
    builder jetton_wallet_account_hash_base = calculate_account_hash_base_slice(cell_hash(jetton_wallet_code), cell_depth(jetton_wallet_code), 0);

    do {
        salt += 1;
        int data_hash = calculate_jetton_wallet_data_hash_cheap(jetton_wallet_data_hash_base, salt);
        int account_hash = calculate_account_hash_cheap_with_base_builder(jetton_wallet_account_hash_base, data_hash);
        int wallet_prefix = account_hash >> (256 - 4);
        int distance = wallet_prefix ^ owner_prefix;
        if (distance < min_distance) {
            min_distance = distance;
            min_salt = salt;
        }
        stop = (salt == ITERATION_NUM) | (min_distance == 0);
    } until (stop);
    cell state_init = begin_cell()
        .store_uint(0, 2) ;; 0b00 - No split_depth; No special
        .store_maybe_ref(jetton_wallet_code)
        .store_maybe_ref(jetton_wallet_data_base.store_uint(min_salt, SALT_SIZE).end_cell())
        .store_uint(0, 1) ;; Empty libraries
        .end_cell();
    return [state_init, min_salt];
}

[cell, int] calculate_jetton_wallet_properties(slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int merkle_root) inline {
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L144
    _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
    code:(Maybe ^Cell) data:(Maybe ^Cell)
    library:(Maybe ^Cell) = StateInit;
  -}
    int stop = false;
    int min_distance = 0xffff;
    int salt = -1;
    int min_salt = 0;
    cell state_init = null();
    cell min_state_init = null();
    (_, int owner_prefix) = parse_std_addr(owner_address);
    owner_prefix = owner_prefix >> (256 - 4);

    do {
        salt += 1;
        state_init = calculate_jetton_wallet_state_init_internal(owner_address, jetton_master_address, jetton_wallet_code, merkle_root, salt);
        int wallet_prefix = cell_hash(state_init) >> (256 - 4);
        int distance = wallet_prefix ^ owner_prefix;
        if (distance < min_distance) {
            min_distance = distance;
            min_salt = salt;
            min_state_init = state_init;
        }
        stop = (salt == ITERATION_NUM) | (min_distance == 0);
    } until (stop);
    return [min_state_init, min_salt];
}

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int merkle_root) inline {
    [cell state_init, int salt] = calculate_jetton_wallet_properties_cheap(owner_address, jetton_master_address, jetton_wallet_code, merkle_root);
    return state_init;
}


slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int merkle_root) inline {
    return calculate_jetton_wallet_address(calculate_jetton_wallet_state_init(owner_address, jetton_master_address, jetton_wallet_code, merkle_root))
           .end_cell().begin_parse();
}

() check_either_forward_payload(slice s) impure inline {
    if (s.preload_uint(1)) {
        ;; forward_payload in ref
        (int remain_bits, int remain_refs) = slice_bits_refs(s);
        throw_unless(error::invalid_message, (remain_refs == 1) & (remain_bits == 1)); ;; we check that there is no excess in the slice
    }
    ;; else forward_payload in slice - arbitrary bits and refs
}

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

global int merkle_root;
global int salt;

(int, int, slice, slice) load_data() inline {
    slice ds = get_data().begin_parse();
    var data = (
        ds~load_uint(STATUS_SIZE), ;; status
        ds~load_coins(), ;; balance
        ds~load_msg_addr(), ;; owner_address
        ds~load_msg_addr() ;; jetton_master_address
    );
    merkle_root = ds~load_uint(MERKLE_ROOT_SIZE);
    salt = ds~load_uint(SALT_SIZE);
    ds.end_parse();
    return data;
}

() save_data(int status, int balance, slice owner_address, slice jetton_master_address) impure inline {
    set_data(pack_jetton_wallet_data(status, balance, owner_address, jetton_master_address, merkle_root, salt));
}

() send_jettons(slice in_msg_body, slice sender_address, int my_ton_balance, int msg_value, int fwd_fee) impure inline_ref {
    ;; see transfer TL-B layout in jetton.tlb
    int query_id = in_msg_body~load_query_id();
    int jetton_amount = in_msg_body~load_coins();
    slice to_owner_address = in_msg_body~load_msg_addr();
    check_same_workchain(to_owner_address);
    (int status, int balance, slice owner_address, slice jetton_master_address) = load_data();
    throw_unless(error::not_owner, equal_slices_bits(owner_address, sender_address));

    cell state_init = calculate_jetton_wallet_state_init(to_owner_address, jetton_master_address, my_code(), merkle_root);
    builder to_wallet_address = calculate_jetton_wallet_address(state_init);
    slice response_address = in_msg_body~load_msg_addr();
    cell custom_payload = in_msg_body~load_maybe_ref();
    int mode = SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_BOUNCE_ON_ACTION_FAIL;
    ifnot(custom_payload.null?()) {
        slice cps = custom_payload.begin_parse();
        int cp_op = cps~load_op();
        throw_unless(error::unknown_custom_payload, cp_op == op::merkle_airdrop_claim);
        throw_if(error::airdrop_already_claimed, status);
        cell airdrop_proof = cps~load_ref();
        (int airdrop_amount, int start_from, int expired_at) = get_airdrop_params(airdrop_proof, merkle_root, owner_address);
        int time = now();
        throw_unless(error::airdrop_not_ready, time >= start_from);
        throw_unless(error::airdrop_finished, time <= expired_at);
        balance += airdrop_amount;
        status |= 1;

        ;; first outgoing transfer can be from just deployed jetton wallet
        ;; in this case we need to reserve TON for storage
        int to_leave_on_balance = my_ton_balance - msg_value + my_storage_due();
        int to_reserve = max(to_leave_on_balance, calculate_jetton_wallet_min_storage_fee());
        raw_reserve(to_reserve, RESERVE_REGULAR | RESERVE_BOUNCE_ON_ACTION_FAIL);
        int actual_withheld = to_leave_on_balance - to_reserve;
        mode = SEND_MODE_CARRY_ALL_BALANCE | SEND_MODE_BOUNCE_ON_ACTION_FAIL;

        ;; custom payload processing is not constant gas, account for that via gas_consumed()
        msg_value -= get_compute_fee(MY_WORKCHAIN, gas_consumed()) + actual_withheld;
    }
    int forward_ton_amount = in_msg_body~load_coins();
    check_either_forward_payload(in_msg_body);
    slice either_forward_payload = in_msg_body;

    balance -= jetton_amount;
    throw_unless(error::balance_error, balance >= 0);

    ;; see internal TL-B layout in jetton.tlb
    cell msg_body = begin_cell()
    .store_op(op::internal_transfer)
    .store_query_id(query_id)
    .store_coins(jetton_amount)
    .store_slice(owner_address)
    .store_slice(response_address)
    .store_coins(forward_ton_amount)
    .store_slice(either_forward_payload)
    .end_cell();

    ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733
    cell msg = begin_cell()
    .store_msg_flags_and_address_none(BOUNCEABLE)
    .store_builder(to_wallet_address)
    .store_coins(0)
    .store_statinit_ref_and_body_ref(state_init, msg_body)
    .end_cell();

    check_amount_is_enough_to_transfer(msg_value , forward_ton_amount, fwd_fee);

    send_raw_message(msg, mode);

    save_data(status, balance, owner_address, jetton_master_address);
}

() receive_jettons(slice in_msg_body, slice sender_address, int my_ton_balance, int msg_value) impure inline_ref {
    (int status, int balance, slice owner_address, slice jetton_master_address) = load_data();
    ;; see internal TL-B layout in jetton.tlb
    int query_id = in_msg_body~load_query_id();
    int jetton_amount = in_msg_body~load_coins();
    balance += jetton_amount;
    slice from_address = in_msg_body~load_msg_addr();
    slice response_address = in_msg_body~load_msg_addr();
    int valid_address = equal_slices_bits(jetton_master_address, sender_address);
    ifnot(valid_address) {
        valid_address = equal_slices_bits(calculate_user_jetton_wallet_address(from_address, jetton_master_address, my_code(), merkle_root), sender_address);
    }
    throw_unless(error::not_valid_wallet, valid_address );
    int forward_ton_amount = in_msg_body~load_coins();

    if (forward_ton_amount) {
        slice either_forward_payload = in_msg_body;

        ;; see transfer_notification TL-B layout in jetton.tlb
        cell msg_body = begin_cell()
        .store_op(op::transfer_notification)
        .store_query_id(query_id)
        .store_coins(jetton_amount)
        .store_slice(from_address)
        .store_slice(either_forward_payload)
        .end_cell();

        ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733
        cell msg = begin_cell()
        .store_msg_flags_and_address_none(NON_BOUNCEABLE)
        .store_slice(owner_address)
        .store_coins(forward_ton_amount)
        .store_only_body_ref(msg_body)
        .end_cell();

        send_raw_message(msg, SEND_MODE_PAY_FEES_SEPARATELY | SEND_MODE_BOUNCE_ON_ACTION_FAIL);
    }

    if (~ is_address_none(response_address)) {
        int to_leave_on_balance = my_ton_balance - msg_value + my_storage_due();
        raw_reserve(max(to_leave_on_balance, calculate_jetton_wallet_min_storage_fee()), RESERVE_AT_MOST);

        ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733
        cell msg = begin_cell()
        .store_msg_flags_and_address_none(NON_BOUNCEABLE)
        .store_slice(response_address)
        .store_coins(0)
        .store_prefix_only_body()
        .store_op(op::excesses)
        .store_query_id(query_id)
        .end_cell();
        send_raw_message(msg, SEND_MODE_CARRY_ALL_BALANCE | SEND_MODE_IGNORE_ERRORS);
    }

    save_data(status, balance, owner_address, jetton_master_address);
}

() burn_jettons(slice in_msg_body, slice sender_address, int msg_value) impure inline_ref {
    (int status, int balance, slice owner_address, slice jetton_master_address) = load_data();
    int query_id = in_msg_body~load_query_id();
    int jetton_amount = in_msg_body~load_coins();
    slice response_address = in_msg_body~load_msg_addr();
    in_msg_body~skip_maybe_ref(); ;; custom_payload
    in_msg_body.end_parse();

    balance -= jetton_amount;
    int is_from_owner = equal_slices_bits(owner_address, sender_address);
    throw_unless(error::not_owner, is_from_owner);
    throw_unless(error::balance_error, balance >= 0);

    ;; see burn_notification TL-B layout in jetton.tlb
    cell msg_body = begin_cell()
    .store_op(op::burn_notification)
    .store_query_id(query_id)
    .store_coins(jetton_amount)
    .store_slice(owner_address)
    .store_slice(response_address)
    .end_cell();

    ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733
    cell msg = begin_cell()
    .store_msg_flags_and_address_none(BOUNCEABLE)
    .store_slice(jetton_master_address)
    .store_coins(0)
    .store_only_body_ref(msg_body)
    .end_cell();

    check_amount_is_enough_to_burn(msg_value);

    send_raw_message(msg, SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_BOUNCE_ON_ACTION_FAIL);

    save_data(status, balance, owner_address, jetton_master_address);
}

() on_bounce(slice in_msg_body) impure inline {
    in_msg_body~skip_bounced_prefix();
    (int status, int balance, slice owner_address, slice jetton_master_address) = load_data();
    int op = in_msg_body~load_op();
    throw_unless(error::wrong_op, (op == op::internal_transfer) | (op == op::burn_notification));
    in_msg_body~skip_query_id();
    int jetton_amount = in_msg_body~load_coins();
    save_data(status, balance + jetton_amount, owner_address, jetton_master_address);
}

() recv_internal(int my_ton_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    slice in_msg_full_slice = in_msg_full.begin_parse();
    int msg_flags = in_msg_full_slice~load_msg_flags();
    if (msg_flags & 1) { ;; is bounced
        on_bounce(in_msg_body);
        return ();
    }
    slice sender_address = in_msg_full_slice~load_msg_addr();
    int fwd_fee_from_in_msg = in_msg_full_slice~retrieve_fwd_fee();
    int fwd_fee = get_original_fwd_fee(MY_WORKCHAIN, fwd_fee_from_in_msg); ;; we use message fwd_fee for estimation of forward_payload costs

    int op = in_msg_body~load_op();

    ;; outgoing transfer
    if (op == op::transfer) {
        send_jettons(in_msg_body, sender_address, my_ton_balance, msg_value, fwd_fee);
        return ();
    }

    ;; incoming transfer
    if (op == op::internal_transfer) {
        receive_jettons(in_msg_body, sender_address, my_ton_balance, msg_value);
        return ();
    }

    ;; burn
    if (op == op::burn) {
        burn_jettons(in_msg_body, sender_address, msg_value);
        return ();
    }

    if (op == op::top_up) {
        return (); ;; just accept tons
    }

    throw(error::wrong_op);
}

(int, slice, slice, cell) get_wallet_data() method_id {
    (_, int balance, slice owner_address, slice jetton_master_address) = load_data();
    return (balance, owner_address, jetton_master_address, my_code());
}

int get_status() method_id {
    (int status, _, _, _) = load_data();
    return status;
}

int is_claimed() method_id {
    (int status, _, _, _) = load_data();
    return status;
}

```

## 431e1485b326a1c600baf02dc3e4cb6339a1538a92ebc4e3ce5daa7100f6c79b/contracts/op-codes.fc

```fc
;; common

const op::transfer = 0xf8a7ea5;
const op::transfer_notification = 0x7362d09c;
const op::internal_transfer = 0x178d4519;
const op::excesses = 0xd53276db;
const op::burn = 0x595f07bc;
const op::burn_notification = 0x7bdd97de;

const op::provide_wallet_address = 0x2c76b973;
const op::take_wallet_address = 0xd1735400;

const op::top_up = 0xd372158c;

const error::invalid_op = 72;
const error::wrong_op = 0xffff;
const error::not_owner = 73;
const error::not_valid_wallet = 74;
const error::wrong_workchain = 333;

;; jetton-minter

const op::mint = 0x642b7d07;
const op::change_admin = 0x6501f354;
const op::claim_admin = 0xfb88e119;
const op::upgrade = 0x2508d66a;
const op::change_metadata_uri = 0xcb862902;
const op::drop_admin = 0x7431f221;
const op::merkle_airdrop_claim = 0x0df602d6; ;; TODO

;; jetton-wallet
const error::balance_error = 47;
const error::not_enough_gas = 48;
const error::invalid_message = 49;
const error::airdrop_already_claimed = 54;
const error::airdrop_not_ready = 55;
const error::airdrop_finished = 56;
const error::unknown_custom_payload = 57;
const error::non_canonical_address = 58;

```

## 431e1485b326a1c600baf02dc3e4cb6339a1538a92ebc4e3ce5daa7100f6c79b/contracts/proofs.fc

```fc
#include "stdlib.fc";
;; Copy from https://github.com/ton-community/compressed-nft-contract
(slice, int) begin_parse_exotic(cell x) asm "XCTOS";
(slice, int) dict_get?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTGET" "NULLSWAPIFNOT";

const int error::not_exotic = 103;
const int error::not_merkle_proof = 104;
const int error::wrong_hash = 105;
const int error::leaf_not_found = 108;
const int error::airdrop_not_found = 109;
const int cell_type::merkle_proof = 3;

(cell, int) extract_merkle_proof(cell proof) impure {
    (slice s, int is_exotic) = proof.begin_parse_exotic();
    throw_unless(error::not_exotic, is_exotic);

    int ty = s~load_uint(8);
    throw_unless(error::not_merkle_proof, ty == cell_type::merkle_proof);

    return (s~load_ref(), s~load_uint(256));
}

cell check_merkle_proof(cell proof, int expected_hash) impure {
    (cell inner, int hash) = proof.extract_merkle_proof();
    throw_unless(error::wrong_hash, hash == expected_hash);

    return inner;
}
;;https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb#L105
const int ADDRESS_SLICE_LENGTH = 2 + 1 + 8 + 256;
const int TIMESTAMP_SIZE = 48;

(int, int, int) get_airdrop_params(cell submitted_proof, int proof_root, slice owner) {
    cell airdrop = submitted_proof.check_merkle_proof(proof_root);
    (slice data, int found) = airdrop.dict_get?(ADDRESS_SLICE_LENGTH, owner);
    throw_unless(error::airdrop_not_found, found);
    int airdrop_amount = data~load_coins();
    int start_from = data~load_uint(TIMESTAMP_SIZE);
    int expired_at = data~load_uint(TIMESTAMP_SIZE);
    return (airdrop_amount, start_from, expired_at);
}
```

## 431e1485b326a1c600baf02dc3e4cb6339a1538a92ebc4e3ce5daa7100f6c79b/contracts/workchain.fc

```fc
#include "stdlib.fc";
#include "op-codes.fc";

const MY_WORKCHAIN = BASECHAIN;

int is_same_workchain(slice addr) inline {
    (int wc, _) = parse_std_addr(addr);
    return wc == MY_WORKCHAIN;
}

() check_same_workchain(slice addr) impure inline {
    throw_unless(error::wrong_workchain, is_same_workchain(addr));
}
```

## 44b620ffb4f57f55e943dc492ad5a3df0abe34262593667aee7db06fd8c030ad/bridge-config.fc

```fc
(int, int, cell) get_bridge_config() impure inline_ref {
  cell bridge_config = config_param(72);
  if (bridge_config.cell_null?()) {
    bridge_config = config_param(-72);
  }
  throw_if(666, bridge_config.cell_null?());
  slice ds = bridge_config.begin_parse();
  ;; wc always equals to -1
  int bridge_address = ds~load_uint(256);
  int oracles_address = ds~load_uint(256);
  cell oracles = ds~load_dict();
  return (bridge_address, oracles_address, oracles);
}

```

## 44b620ffb4f57f55e943dc492ad5a3df0abe34262593667aee7db06fd8c030ad/bridge_code.fc

```fc
(slice, (int, int, int)) load_fees(slice s) inline {
    var fees = (s~load_grams(), s~load_grams(), s~load_uint(14));
    return (s, fees);
}

builder store_fees(builder b, (int, int, int) fees) inline {
  (int flat_reward, int network_fee, int factor) = fees;
  throw_if(391, factor > 10000);
  return b.store_grams(flat_reward).store_grams(network_fee).store_uint(factor, 14);
}

(int, int, slice, (int, int, int)) load_data() inline_ref {
  var ds = get_data().begin_parse();
  return (ds~load_uint(8), ds~load_grams(), ds~load_msg_addr(), ds~load_fees());
}

() save_data(int state_flags, int total_locked, slice collector_address, fees) impure inline_ref {
  var st = begin_cell().store_uint(state_flags, 8)
                       .store_grams(total_locked)
                       .store_slice(collector_address)
                       .store_fees(fees)
                       .end_cell();
  set_data(st);
}

int calculate_fee(int msg_value, fees)  {
    (int flat_reward, int network_fee, int factor) = fees;
    int remain = msg_value - flat_reward - network_fee;
    throw_unless(400, remain > 0);
    int percent_fee = remain * factor / 10000;
    return flat_reward + network_fee + percent_fee;
}

;; create swap to external chain to destination address
() create_swap_from_ton(int destination_address, int amount, slice s_addr, int query_id, int is_text) impure {
    (int state_flags, int total_locked, slice collector_address, var fees) = load_data();
    throw_if(339, state_flags & 1);
    int fee = calculate_fee(amount, fees);
    amount -= fee;
    throw_unless(306, amount > 0);
    total_locked += amount;
    emit_log_simple(0xc0470ccf, begin_cell().store_uint(destination_address, 160).store_uint(amount, 64).end_cell().begin_parse());
    save_data(state_flags, total_locked, collector_address, fees);
    if(is_text) {
      return send_text_receipt_message(s_addr, 100000000, 3);
    } else {
      return send_receipt_message(s_addr, 0x10000 + 3, query_id, 0, 100000000, 3);
    }
}

() process_comment_api_request (slice in_msg, int msg_value, slice s_addr) impure {
    if (in_msg.slice_empty?() & (in_msg.slice_refs() == 1)) {
      cell _cont = in_msg~load_ref();
      in_msg = _cont.begin_parse();
    }
    int command = in_msg~load_uint(56);
    throw_unless(328, command == 32500882701840163); ;; "swapTo#" other commands are unsupported
    int destination_address = in_msg~load_text_hex_number(20);
    in_msg.end_parse();
    return create_swap_from_ton(destination_address, msg_value, s_addr, 0, true);
}

() execute_voting (slice s_addr, slice voting_data, int bridge_address) impure {
  (int state_flags, int total_locked, slice collector_address, var fees) = load_data();

  int operation = voting_data~load_uint(8);
  if (operation == 0) { ;; swap

    (int ext_chain_hash,
     int internal_index,
     int wc,
     int addr_hash,
     int swap_amount) = (voting_data~load_uint(256),
                         voting_data~load_int(16),
                         voting_data~load_int(8),
                         voting_data~load_uint(256),
                         voting_data~load_uint(64));
    int fee = calculate_fee(swap_amount, fees);
    total_locked -= swap_amount;
    throw_unless(315, total_locked >= 0);
    swap_amount -= fee;

    ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
    var msg = begin_cell()
      .store_uint(0x10, 6) ;; #int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddressInt = 0 1 0 0 0 00
      .store_uint(4, 3).store_int(wc, 8).store_uint(addr_hash, 256)
      .store_grams(swap_amount)
      .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
      .store_uint(ext_chain_hash, 256)
      .store_uint(internal_index, 16);
    send_raw_message(msg.end_cell(), 0);

  } elseif (operation == 3) { ;; update state flags

    state_flags = voting_data~load_uint(8);

  } elseif (operation == 4) { ;; migrate

    var msg = begin_cell()
      .store_uint(0x18, 6) ;; #int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddressInt = 0 1 1 0 00
      .store_uint(4, 3).store_int(-1, 8).store_uint(bridge_address, 256)
      .store_grams(total_locked)
      .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
      .store_uint(0xf00d, 32); ;; new bridge contract should recognize this opcode
    send_raw_message(msg.end_cell(), 1);

  } elseif (operation == 5) { ;; get reward

    ;; reserve total_locked + 100 Toncoins for storage fees
    raw_reserve(total_locked + 100000000000, 2);
    var msg = begin_cell()
      .store_uint(0x18, 6) ;; #int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddressInt = 0 1 1 0 00
      .store_slice(s_addr)
      .store_grams(0)
      .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);
    send_raw_message(msg.end_cell(), 128); ;; send all the remainings

  } elseif (operation == 6) { ;; change fees

    fees = voting_data~load_fees();

  } elseif (operation == 7) { ;; change collector

    collector_address = voting_data~load_msg_addr();

  }

  save_data(state_flags, total_locked, collector_address, fees);
}

() recv_internal(int msg_value, cell in_msg_cell, slice in_msg) impure {
  var cs = in_msg_cell.begin_parse();
  var flags = cs~load_uint(4);  ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
  if (flags & 1) {
    ;; ignore all bounced messages
    return ();
  }
  slice s_addr = cs~load_msg_addr();
  throw_if(299, in_msg.slice_empty?()); ;; inbound message has empty body
  
  int op = in_msg~load_uint(32);
  (int bridge_address, int oracles_address, _) = get_bridge_config();
  (int wc, int addr) = parse_std_addr(s_addr);
  var is_oracles = (wc == -1) & (oracles_address == addr);

  if (op == 4) {
    throw_unless(305, is_oracles);
    return execute_voting(s_addr, in_msg, bridge_address);
  }
  throw_if(306, is_oracles); ;; don't allow to create swaps from oracles multisig
  if (op == 0) {
    return process_comment_api_request(in_msg, msg_value, s_addr);
  }
  int query_id = in_msg~load_uint(64);
  if (op == 3) {
    int destination_address = in_msg~load_uint(160);
    return create_swap_from_ton(destination_address, msg_value, s_addr, query_id, false);
  }
}

;; get methods

_ get_bridge_data() method_id {
    (int state_flags, int total_locked, slice collector_address_slice, var fees) = load_data();
    (int flat_reward, int network_fee, int factor) = fees;
    (int wc, int addr) = parse_std_addr(collector_address_slice);
    return (state_flags, total_locked, wc, addr, flat_reward, network_fee, factor, 10000);
}

```

## 44b620ffb4f57f55e943dc492ad5a3df0abe34262593667aee7db06fd8c030ad/message_utils.fc

```fc
() send_receipt_message(addr, ans_tag, query_id, body, grams, mode) impure inline_ref {
  ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_grams(grams)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_uint(ans_tag, 32)
    .store_uint(query_id, 64);
  if (body >= 0) {
    msg~store_uint(body, 256);
  }
  send_raw_message(msg.end_cell(), mode);
}

() send_text_receipt_message(addr, grams, mode) impure inline_ref {
  ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_grams(grams)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_uint(0, 32)
    .store_uint(0x4f4b, 16); ;; "OK"
  send_raw_message(msg.end_cell(), mode);
}

() emit_log_simple (int event_id, slice data) impure inline {
  var msg = begin_cell()
                        .store_uint (12, 4) ;; ext_out_msg_info$11 src:MsgAddressInt ()
                        .store_uint (1, 2)
                        .store_uint (256, 9)
                        .store_uint(event_id, 256)
                        .store_uint(0, 64 + 32 + 2) ;; created_lt, created_at, init:Maybe, body:Either
                        .store_slice(data)
           .end_cell();
  send_raw_message(msg, 0);
}

```

## 44b620ffb4f57f55e943dc492ad5a3df0abe34262593667aee7db06fd8c030ad/stdlib.fc

```fc
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail) asm "CONS";
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";
forall X -> X car(tuple list) asm "CAR";
tuple cdr(tuple list) asm "CDR";
tuple empty_tuple() asm "NIL";
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";
forall X -> [X] single(X x) asm "SINGLE";
forall X -> X unsingle([X] t) asm "UNSINGLE";
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";
forall X -> X first(tuple t) asm "FIRST";
forall X -> X second(tuple t) asm "SECOND";
forall X -> X third(tuple t) asm "THIRD";
forall X -> X fourth(tuple t) asm "3 INDEX";
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";
forall X -> X null() asm "PUSHNULL";
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";

int now() asm "NOW";
slice my_address() asm "MYADDR";
[int, cell] get_balance() asm "BALANCE";
int cur_lt() asm "LTIME";
int block_lt() asm "BLOCKLT";

int cell_hash(cell c) asm "HASHCU";
int slice_hash(slice s) asm "HASHSU";
int string_hash(slice s) asm "SHA256U";

int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data() asm "c4 PUSH";
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y) asm "MIN";
int max(int x, int y) asm "MAX";
(int, int) minmax(int x, int y) asm "MINMAX";
int abs(int x) asm "ABS";

slice begin_parse(cell c) asm "CTOS";
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";
cell preload_ref(slice s) asm "PLDREF";
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";
slice first_bits(slice s, int len) asm "SDCUTFIRST";
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";
slice slice_last(slice s, int len) asm "SDCUTLAST";
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";
cell preload_dict(slice s) asm "PLDDICT";
slice skip_dict(slice s) asm "SKIPDICT";

(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";
cell preload_maybe_ref(slice s) asm "PLDOPTREF";
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";

int cell_depth(cell c) asm "CDEPTH";

int slice_refs(slice s) asm "SREFS";
int slice_bits(slice s) asm "SBITS";
(int, int) slice_bits_refs(slice s) asm "SBITREFS";
int slice_empty?(slice s) asm "SEMPTY";
int slice_data_empty?(slice s) asm "SDEMPTY";
int slice_refs_empty?(slice s) asm "SREMPTY";
int slice_depth(slice s) asm "SDEPTH";

int builder_refs(builder b) asm "BREFS";
int builder_bits(builder b) asm "BBITS";
int builder_depth(builder b) asm "BDEPTH";

builder begin_cell() asm "NEWC";
cell end_cell(builder b) asm "ENDC";
builder store_ref(builder b, cell c) asm(c b) "STREF";
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s) asm "STSLICER";
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_dict(builder b, cell c) asm(c b) "STDICT";

(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";
tuple parse_addr(slice s) asm "PARSEMSGADDR";
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";
cell new_dict() asm "NEWDICT";
int dict_empty?(cell c) asm "DICTEMPTY";

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x) asm "CONFIGOPTPARAM";
int cell_null?(cell c) asm "ISNULL";

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

int random() impure asm "RANDU256";
int rand(int range) impure asm "RAND";
int get_seed() impure asm "RANDSEED";
int set_seed() impure asm "SETRAND";
() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";


```

## 44b620ffb4f57f55e943dc492ad5a3df0abe34262593667aee7db06fd8c030ad/text_utils.fc

```fc
(slice, (int)) ~load_hex_symbol(slice comment) {
  int n = comment~load_uint(8);
  n = n - 48;
  throw_unless( 329, n >= 0);
  if (n < 10) {
    return (comment, (n));
  }
  n = n - 7;
  throw_unless( 329, n >= 0);
  if (n < 16) {
    return (comment, (n));
  }
  n = n - 32;
  throw_unless( 329, (n >= 0) & (n < 16));
  return (comment, (n));
}

(slice, (int)) ~load_text_hex_number(slice comment, int byte_length) {
  throw_unless(329, comment~load_uint(16) == 12408); ;; "0x"
  int current_slice_length = comment.slice_bits() / 8;
  int result = 0;
  int counter = 0;
  repeat (2 * byte_length) {
    result = result * 16 + comment~load_hex_symbol();
    counter = counter + 1;
    if(counter == current_slice_length) {
      if (comment.slice_refs() == 1) {
        cell _cont = comment~load_ref();
        comment = _cont.begin_parse();
        current_slice_length = comment.slice_bits() / 8;
        counter = 0;
      }
    }
  }
  return (comment, (result));
}

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

    receive(msg: TokenUpdateContent) {
        self.requireOwner();                // Allow changing content only by owner
        self.content = msg.content;         // Update content
    }

    receive(msg: TokenBurnNotification) {
        self.requireWallet(msg.owner);                     // Check wallet
        self.totalSupply = self.totalSupply - msg.amount; // Update supply

        if (msg.response_destination != null) { // Cashback
            send(SendParameters{
                to: msg.response_destination!!, 
                value: 0,
                bounce: false,
                mode: SendRemainingValue + SendIgnoreErrors,
                body: TokenExcesses{
                    queryId: msg.queryId
                }.toCell()
            });
        }
    }

    // @to The Address receive the Jetton token after minting
    // @amount The amount of Jetton token being minted
    // @response_destination The previous owner address
    fun mint(to: Address, amount: Int, response_destination: Address) {
        require(self.totalSupply + amount <= self.max_supply, "The total supply will be overlapping.");
        self.totalSupply = self.totalSupply + amount; // Update total supply

        let winit: StateInit = self.getJettonWalletInit(to); // Create message
        send(SendParameters{
            to: contractAddress(winit), 
            value: 0, 
            bounce: false,
            mode: SendRemainingValue,
            body: TokenTransferInternal{ 
                queryId: 0,
                amount: amount,
                from: myAddress(),
                response_destination: response_destination,
                forward_ton_amount: 0,
                forward_payload: emptySlice()
            }.toCell(),
            code: winit.code,
            data: winit.data
        });
    }

    fun requireWallet(owner: Address) {
        let ctx: Context = context();
        let winit: StateInit = self.getJettonWalletInit(owner);
        require(contractAddress(winit) == ctx.sender, "Invalid sender");
    }

    virtual fun getJettonWalletInit(address: Address): StateInit {
        return initOf JettonDefaultWallet(myAddress(), address);
    }

    // ====== Get Methods ====== //
    get fun get_jetton_data(): JettonData {
        let code: Cell = self.getJettonWalletInit(myAddress()).code;
        return JettonData{ 
            totalSupply: self.totalSupply, 
            mintable: self.mintable, 
            owner: self.owner, 
            content: self.content, 
            walletCode: code
        };
    }

    get fun get_wallet_address(owner: Address): Address {
        let winit: StateInit = self.getJettonWalletInit(owner);
        return contractAddress(winit);
    }
}

@interface("org.ton.jetton.wallet")
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

    receive(msg: TokenTransfer) { // 0xf8a7ea5
        let ctx: Context = context(); // Check sender
        require(ctx.sender == self.owner, "Invalid sender");

        // Gas checks
        let fwdFee: Int = ctx.readForwardFee() + ctx.readForwardFee();  
        let final: Int =  2 * self.gasConsumption + self.minTonsForStorage + fwdFee;
        require(ctx.value > min(final, ton("0.01")), "Invalid value!!"); 

        // Update balance
        self.balance = self.balance - msg.amount; 
        require(self.balance >= 0, "Invalid balance");

        let init: StateInit = initOf JettonDefaultWallet(self.master, msg.destination);  
        let walletAddress: Address = contractAddress(init);
        send(SendParameters{
                to: walletAddress, 
                value: 0,
                mode: SendRemainingValue, 
                bounce: false,
                body: TokenTransferInternal{
                    queryId: msg.queryId,
                    amount: msg.amount,
                    from: self.owner,
                    response_destination: msg.response_destination,
                    forward_ton_amount: msg.forward_ton_amount,
                    forward_payload: msg.forward_payload
                }.toCell(),
                code: init.code,
                data: init.data
            });
    }

    receive(msg: TokenTransferInternal) { // 0x178d4519
        let ctx: Context = context();

        if (ctx.sender != self.master) {
            let sinit: StateInit = initOf JettonDefaultWallet(self.master, msg.from);
            require(contractAddress(sinit) == ctx.sender, "Invalid sender!");
        }

        // Update balance
        self.balance = self.balance + msg.amount;
        require(self.balance >= 0, "Invalid balance"); 
        
        // Get value for gas
        let msgValue: Int = self.msgValue(ctx.value);  
        let fwdFee: Int = ctx.readForwardFee();
        msgValue = msgValue - msg.forward_ton_amount - fwdFee;
        
         // 0x7362d09c - notify the new owner of JettonToken that the transfer is complete
        if (msg.forward_ton_amount > 0) { 
            send(SendParameters{
                to: self.owner,
                value: msg.forward_ton_amount,
                mode: SendPayGasSeparately + SendIgnoreErrors,
                bounce: false,
                body: TokenNotification {
                    queryId: msg.queryId,
                    amount: msg.amount,
                    from: msg.from,
                    forward_payload: msg.forward_payload
                }.toCell()
            });
        }

        // 0xd53276db -- Cashback to the original Sender
        if (msg.response_destination != null) { 
            send(SendParameters {
                to: msg.response_destination, 
                value: msgValue,  
                bounce: false,
                body: TokenExcesses { 
                    queryId: msg.queryId
                }.toCell(),
                mode: SendIgnoreErrors
            });
        }
    }

    receive(msg: TokenBurn) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Invalid sender");  // Check sender

        self.balance = self.balance - msg.amount; // Update balance
        require(self.balance >= 0, "Invalid balance");

        let fwdFee: Int = ctx.readForwardFee(); // Gas checks
        require(ctx.value > fwdFee + 2 * self.gasConsumption + self.minTonsForStorage, "Invalid value - Burn");

        // Burn tokens
        send(SendParameters{  
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

    get fun msgValue(value: Int): Int {
        let msgValue: Int = value;
        let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
        let storageFee: Int = self.minTonsForStorage - min(tonBalanceBeforeMsg, self.minTonsForStorage);
        msgValue = msgValue - (storageFee + self.gasConsumption);
        return msgValue;
    }

    bounced(src: bounced<TokenTransferInternal>) {
        self.balance = self.balance + src.amount;
    }

    bounced(src: bounced<TokenBurnNotification>) {
        self.balance = self.balance + src.amount;
    }

    get fun get_wallet_data(): JettonWalletData {
        return JettonWalletData{
            balance: self.balance,
            owner: self.owner,
            master: self.master,
            walletCode: (initOf JettonDefaultWallet(self.master, self.owner)).code
        };
    }
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
    forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton
}

message(0x178d4519) TokenTransferInternal {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    response_destination: Address;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton
}

message(0x7362d09c) TokenNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton 
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

    init(owner: Address, content: Cell, max_supply: Int) {
        self.totalSupply = 0;
        self.owner = owner;
        self.mintable = true;
        self.content = content;

        self.max_supply = max_supply;
        self.mint(self.owner, self.max_supply, self.owner);
        self.mintable = false;
        self.owner = address("0:0000000000000000000000000000000000000000000000000000000000000000");
    }

    // receive(msg: Mint) {
    //     let ctx: Context = context();
    //     require(ctx.sender == self.owner, "Not Owner");
    //     require(self.mintable, "Can't Mint Anymore");
    //     self.mint(msg.receiver, msg.amount, self.owner);
    // }

    // receive("Owner: MintClose") {
    //     let ctx: Context = context();
    //     require(ctx.sender == self.owner, "Not Owner");
    //     self.mintable = false;
    // }

    // receive(msg: Revoke) {
    //     let ctx: Context = context();
    //     require(ctx.sender == self.owner, "Not Owner");
    //     self.owner = address("0:0000000000000000000000000000000000000000000000000000000000000000");
    // }
}

```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/lz/EpConfig.fc

```fc
#include "../../funC++/classlib.fc";

;; ERRORS
const int lz::EpConfig::ERROR::sameMsglib = 1025;
const int lz::EpConfig::ERROR::invalidTimeoutExpiry = 1026;
const int lz::EpConfig::ERROR::invalidTimeoutReceiveMsglib = 1027;
const int lz::EpConfig::VALID = 42069 & ERRORCODE_MASK;

;; required storage name
const int lz::EpConfig::NAME = "EpConfig"u;

;; field names
const int lz::EpConfig::isNull = 0;
const int lz::EpConfig::sendMsglibManager = 1;
const int lz::EpConfig::sendMsglib = 2;
const int lz::EpConfig::sendMsglibConnection = 3;
const int lz::EpConfig::receiveMsglib = 4;
const int lz::EpConfig::receiveMsglibConnection = 5;
const int lz::EpConfig::timeoutReceiveMsglib = 6;
const int lz::EpConfig::timeoutReceiveMsglibConnection = 7;
const int lz::EpConfig::timeoutReceiveMsglibExpiry = 8;

cell lz::EpConfig::NewWithConnection(
    int isNull,
    int sendMsglibManager,
    int sendMsglib,
    int sendMsglibConnection,
    int receiveMsglib,
    int receiveMsglibConnection,
    int timeoutReceiveMsglib,
    int timeoutReceiveMsglibConnection,
    int timeoutReceiveMsglibExpiry
) impure inline method_id {
    return cl::declare(
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
}

cell lz::EpConfig::New(
    int isNull,
    int sendMsglibManager,
    int sendMsglib,
    int receiveMsglib,
    int timeoutReceiveMsglib,
    int timeoutReceiveMsglibExpiry
) impure inline method_id {
    return lz::EpConfig::NewWithConnection(
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
}

cell lz::EpConfig::NewWithDefaults() impure inline method_id {
    return lz::EpConfig::NewWithConnection(
        true,
        NULLADDRESS,
        NULLADDRESS,
        NULLADDRESS,
        NULLADDRESS,
        NULLADDRESS,
        NULLADDRESS,
        NULLADDRESS,
        0
    );
}

;; ====================== Object Multi-Getters =====================

;; in root cell
const int lz::EpConfig::_isNullOffset = _HEADER_WIDTH;
const int lz::EpConfig::_sendMsglibManagerOffset = lz::EpConfig::_isNullOffset + 1;
const int lz::EpConfig::_sendMsglibOffset = lz::EpConfig::_sendMsglibManagerOffset + 256;

;; in ref[2]
const int lz::EpConfig::_sendMsglibConnectionOffset = 0;
const int lz::EpConfig::_receiveMsglibOffset = lz::EpConfig::_sendMsglibConnectionOffset + 256;
const int lz::EpConfig::_receiveMsglibConnectionOffset = lz::EpConfig::_receiveMsglibOffset + 256;

;; in ref[3]
const int lz::EpConfig::_timeoutReceiveMsglibOffset = 0;
const int lz::EpConfig::_timeoutReceiveMsglibConnectionOffset = lz::EpConfig::_timeoutReceiveMsglibOffset + 256;
const int lz::EpConfig::_timeoutReceiveMsglibExpiryOffset = lz::EpConfig::_timeoutReceiveMsglibConnectionOffset + 256;

;; (isNull, sendMsglibManager, sendMsglib, sendMsglibConnection)
(int, int, int, int) lz::EpConfig::deserializeSendConfig(cell $self) impure inline {
    slice selfSlice = $self.begin_parse();
    return (
        selfSlice.preloadBoolAt(lz::EpConfig::_isNullOffset),
        selfSlice.preloadAddressAt(lz::EpConfig::_sendMsglibManagerOffset),
        selfSlice.preloadAddressAt(lz::EpConfig::_sendMsglibOffset),
        selfSlice.preloadRefAt(2).cellPreloadAddressAt(lz::EpConfig::_sendMsglibConnectionOffset)
    );
}

;; (isNull, receiveMsglibConnection)
(int, int) lz::EpConfig::deserializeReceiveConfig(cell $self) impure inline {
    slice selfSlice = $self.begin_parse();
    return (
        selfSlice.preloadBoolAt(lz::EpConfig::_isNullOffset),
        selfSlice.preloadRefAt(2).cellPreloadAddressAt(lz::EpConfig::_receiveMsglibConnectionOffset)
    );
}

;; ====================== Object Validators =====================

int lz::EpConfig::isValid(cell $epConfig) impure inline {
    int receiveMsglib = $epConfig.cl::get<address>(lz::EpConfig::receiveMsglib);
    int timeoutReceiveMsglib = $epConfig.cl::get<address>(lz::EpConfig::timeoutReceiveMsglib);
    int timeoutReceiveMsglibExpiry = $epConfig.cl::get<uint64>(lz::EpConfig::timeoutReceiveMsglibExpiry);

    if ((timeoutReceiveMsglib == NULLADDRESS) & (timeoutReceiveMsglibExpiry != 0)) {
        ;; If the timeout receive msglib is null, the expiry must be 0
        return lz::EpConfig::ERROR::invalidTimeoutReceiveMsglib;
    } elseif ((timeoutReceiveMsglib != NULLADDRESS) & (timeoutReceiveMsglibExpiry <= now())) {
        ;; if the timeout receive msglib is not null, the expiry must be in the future
        return lz::EpConfig::ERROR::invalidTimeoutExpiry;
    } elseif ((receiveMsglib != NULLADDRESS) & (receiveMsglib == timeoutReceiveMsglib)) {
        ;; the receive msglib and timeout receive msglib must be different
        return lz::EpConfig::ERROR::sameMsglib;
    }

    return lz::EpConfig::VALID;
}

cell lz::EpConfig::sanitize(cell $epConfig) impure {
    cell $sanitizedEpConfig = lz::EpConfig::NewWithConnection(
        $epConfig.cl::get<bool>(lz::EpConfig::isNull),
        $epConfig.cl::get<address>(lz::EpConfig::sendMsglibManager),
        $epConfig.cl::get<address>(lz::EpConfig::sendMsglib),
        $epConfig.cl::get<address>(lz::EpConfig::sendMsglibConnection),
        $epConfig.cl::get<address>(lz::EpConfig::receiveMsglib),
        $epConfig.cl::get<address>(lz::EpConfig::receiveMsglibConnection),
        $epConfig.cl::get<address>(lz::EpConfig::timeoutReceiveMsglib),
        $epConfig.cl::get<address>(lz::EpConfig::timeoutReceiveMsglibConnection),
        $epConfig.cl::get<uint64>(lz::EpConfig::timeoutReceiveMsglibExpiry)
    );
    int validity = lz::EpConfig::isValid($sanitizedEpConfig);
    throw_if(validity, validity != lz::EpConfig::VALID);
    return $sanitizedEpConfig;
}

```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/lz/Packet.fc

```fc
#include "../../funC++/classlib.fc";
#include "../../funC++/constants.fc";

#include "Path.fc";

;; required storage name
const int lz::Packet::NAME = "Packet"u;

;; field names
const int lz::Packet::path = 0;
const int lz::Packet::message = 1;
const int lz::Packet::nonce = 2;
const int lz::Packet::guid = 3;

const int lz::Packet::ERROR::INVALID_MESSAGE = 1089;
const int lz::Packet::ERROR::INVALID_NONCE = 1090;
const int lz::Packet::ERROR::INVALID_PACKET_FIELD = 1091;

const int lz::Packet::MAX_RECEIVE_MESSAGE_CELLS = 32;
const int lz::Packet::MAX_SEND_MESSAGE_CELLS = 255;

cell lz::Packet::New(cell $path, cell message, int nonce) impure inline method_id {
    return cl::declare(
        lz::Packet::NAME,
        unsafeTuple([
            [cl::t::objRef, $path],             ;; lz::Packet::path
            [cl::t::cellRef, message],          ;; lz::Packet::message
            [cl::t::uint64, nonce],             ;; lz::Packet::nonce
            [cl::t::uint256, 0]                 ;; lz::Packet::guid
        ])
    );
}

const int lz::Packet::_headerInfoBits = _BASIC_HEADER_WIDTH + (_FIELD_INFO_WIDTH * 4);
const int lz::Packet::_headerFillerBits = _HEADER_WIDTH - lz::Packet::_headerInfoBits;
const int lz::Packet::_headerInfo = 417359019239977417716476838698419835;

;; this function is unused by the protocol but will be used by OApps
cell lz::Packet::build(cell $path, cell message, int nonce) impure inline method_id {
    return begin_cell()
        .store_uint(lz::Packet::_headerInfo, lz::Packet::_headerInfoBits) ;; header info
        .store_ones(lz::Packet::_headerFillerBits)                        ;; header filler
        .store_ref($path)                                                  ;; path
        .store_ref(message)                                                ;; message
        .store_uint64(nonce)                                               ;; nonce
        .store_uint256(0)                                                  ;; guid (default = 0)
        .end_cell();
}

;; this function is unused by the protocol but will be used by OApps
cell lz::Packet::nonceless(cell $path, cell message) impure inline method_id {
    return lz::Packet::build($path, message, 0);
}

;; ====================== Object Accessors =====================

const int lz::Packet::_nonceOffset = _HEADER_WIDTH;
const int lz::Packet::_guidOffset = lz::Packet::_nonceOffset + 64;

cell lz::Packet::getPath(cell $self) impure inline {
    return $self.cellPreloadRefAt(0);
}

;; this function is unused by the protocol but will be used by OApps
cell lz::Packet::getMessage(cell $self) impure inline {
    return $self.cellPreloadRefAt(1);
}

int lz::Packet::getNonce(cell $self) impure inline {
    return $self.cellPreloadUint64At(lz::Packet::_nonceOffset);
}

int lz::Packet::getGuid(cell $self) impure inline {
    return $self.cellPreloadUint256At(lz::Packet::_guidOffset);
}

;; returns (path, message, nonce, guid)
(cell, cell, int, int) lz::Packet::deserialize(cell $self) impure inline {
    slice $selfSlice = $self.begin_parse();
    return (
        $selfSlice.preloadRefAt(0),
        $selfSlice.preloadRefAt(1),
        $selfSlice.preloadUint64At(lz::Packet::_nonceOffset),
        $selfSlice.preloadUint256At(lz::Packet::_guidOffset)
    );
}

;; ====================== Object Composite Modifiers =====================

;; NOTE: this assumes that the placement of the first field is before the second field
cell lz::Packet::replaceTwoFieldsAtOffsets(
    cell encodedPacket,
    int replacementValue1,
    int replacementOffsetBytes1,
    int field1Bytes,
    int replacementValue2,
    int replacementOffsetBytes2,
    int field2Bytes
) impure inline method_id {
    int field1PosBits = (replacementOffsetBytes1 % MAX_CELL_BYTES) * 8;
    int cell1Idx = replacementOffsetBytes1 / MAX_CELL_BYTES;
    int field2PosBits = (replacementOffsetBytes2 % MAX_CELL_BYTES) * 8;
    int cell2Idx = replacementOffsetBytes2 / MAX_CELL_BYTES;
    slice itr = encodedPacket.begin_parse();
    int field1Bits = field1Bytes * 8;
    int field2Bits = field2Bytes * 8;
    int field1EndPosBits = field1PosBits + field1Bits;
    int field2EndPosBits = field2PosBits + field2Bits;

    throw_if(
        lz::Packet::ERROR::INVALID_PACKET_FIELD,
        (max(field1Bytes, field2Bytes) > MAX_CELL_BYTES)
        | (max(field1EndPosBits, field2EndPosBits) > MAX_CELL_WHOLE_BYTE_BITS)
    );

    ;; short-circuit the common case to save gas
    if (cell2Idx == 0) {
        return begin_cell()
            .store_slice(scutfirst(itr, field1PosBits, 0))
            .store_uint(replacementValue1, field1Bits)
            .store_slice(subslice(
                itr,
                field1EndPosBits,
                0,
                field2PosBits - field1EndPosBits,
                0
            ))
            .store_uint(replacementValue2, field2Bits)
            .store_slice(scutlast(
                itr,
                itr.slice_bits() - field2EndPosBits,
                itr.slice_refs()
            ))
            .end_cell();
    }

    tuple encodedPacketBuilders = empty_tuple();

    int idx = 0;

    do {
        if ((idx == cell1Idx) & (cell1Idx == cell2Idx)) {
            slice beforeFirstField = scutfirst(itr, field1PosBits, 0);

            slice betweenFields = subslice(
                itr,
                (field1PosBits + field1Bits),
                0,
                (field2PosBits - field1PosBits - field1Bits),
                0
            );

            slice afterSecondField = scutlast(
                itr,
                itr.slice_bits() - (field2Bits + field2PosBits),
                itr.slice_refs()
            );

            encodedPacketBuilders~tpush(
                begin_cell()
                    .store_slice(beforeFirstField)
                    .store_uint(replacementValue1, field1Bits)
                    .store_slice(betweenFields)
                    .store_uint(replacementValue2, field2Bits)
                    .store_slice(afterSecondField)
            );
        } elseif (idx == cell1Idx) {
            encodedPacketBuilders~tpush(
                begin_cell()
                .store_slice(scutfirst(itr, field1PosBits, 0))
                .store_uint(replacementValue1, field1Bits)
                .store_slice(
                    scutlast(
                        itr,
                        itr.slice_bits() - (field1Bits + field1PosBits),
                        itr.slice_refs()
                    )
                )
            );
        } elseif (idx == cell2Idx) {
            encodedPacketBuilders~tpush(
                begin_cell()
                .store_slice(scutfirst(itr, field2PosBits, 0))
                .store_uint(replacementValue2, field2Bits)
                .store_slice(
                    scutlast(
                        itr,
                        itr.slice_bits() - (field2Bits + field2PosBits),
                        itr.slice_refs()
                    )
                )
            );
        } else {
            encodedPacketBuilders~tpush(begin_cell().store_slice(itr));
        }

        if (itr.slice_refs() > 0) {
            itr = itr.preload_first_ref().begin_parse();
        }
        idx += 1;
    } until (idx >= cell2Idx);

    cell curCell = encodedPacketBuilders.at(cell2Idx).end_cell();

    while (cell2Idx > 0) {
        cell2Idx -= 1;
        curCell = encodedPacketBuilders.at(cell2Idx).store_ref(curCell).end_cell();
    }

    return curCell;
}

cell lz::Packet::setNonceAndGuid(cell $self, int nonce, int guid) impure inline {
    return begin_cell()
            .store_slice($self.begin_parse().scutfirst(lz::Packet::_nonceOffset, 2))  ;; keep the header and the first two refs
            .store_uint64(nonce)
            .store_uint256(guid)
            .end_cell();
}

;; ====================== Object Utilities =====================

int lz::Packet::calculateGuid(cell $path, int nonce) inline method_id {
    (int srcEid, int srcOApp, int dstEid, int dstOApp) = $path.lz::Path::deserialize();
    return keccak256Builder(
        begin_cell()
            .store_uint64(nonce)
            .store_uint32(srcEid)
            .store_uint256(srcOApp)
            .store_uint32(dstEid)
            .store_uint256(dstOApp)
    );
}

;; ====================== Object Validators =====================

;; assumes that the message is a valid single-linked list
int lz::Packet::_messageBytes(cell $self) impure inline {
    slice messageSlice = $self.lz::Packet::getMessage().begin_parse();
    (int sliceBits, int sliceRefs) = messageSlice.slice_bits_refs();
    int messageBytes = sliceBits / 8;
    while (sliceRefs > 0) {
        messageSlice = messageSlice.preload_first_ref().begin_parse();
        (sliceBits, sliceRefs) = messageSlice.slice_bits_refs();
        messageBytes += (sliceBits / 8);
    }
    return messageBytes;
}

() lz::Packet::_assertValidLinkedList(cell head, int maxLen) impure inline {
    slice messageSlice = head.begin_parse();
    repeat (maxLen) {
        (int sliceBits, int sliceRefs) = messageSlice.slice_bits_refs();
        if (sliceRefs == 0) {
            throw_if(lz::Packet::ERROR::INVALID_MESSAGE, sliceBits % 8 != 0);
            return ();
        } else {
            throw_if(
                lz::Packet::ERROR::INVALID_MESSAGE,
                (sliceRefs != 1) | (sliceBits != MAX_CELL_WHOLE_BYTE_BITS)
            );
        }
        messageSlice = messageSlice.preload_first_ref().begin_parse();
    }
    throw(lz::Packet::ERROR::INVALID_MESSAGE);
}

() lz::Packet::assertValidSendMessage(cell $self) impure inline {
    lz::Packet::_assertValidLinkedList(
        $self.lz::Packet::getMessage(),
        lz::Packet::MAX_SEND_MESSAGE_CELLS
    );
}

() lz::Packet::assertValidReceiveMessage(cell $self) impure inline {
    lz::Packet::_assertValidLinkedList(
        $self.lz::Packet::getMessage(),
        lz::Packet::MAX_RECEIVE_MESSAGE_CELLS
    );
}

```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/lz/Path.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int lz::Path::NAME = "path"u;

;; field names
const int lz::Path::srcEid = 0;
const int lz::Path::srcOApp = 1;
const int lz::Path::dstEid = 2;
const int lz::Path::dstOApp = 3;

;; In all blockchains with atomic cross-contract call, we can use src/dst/srcOApp/dstOApp
;; because the send channel doesn't exist (it's just a nonce).
;; In TON, we need both send/receive channels, so we use srcOApp/dstOApp to provide
;; a context-free way to refer to the two ends of the channel.
;; The direction is inferred by the context of the contract (send vs receive).
;; The srcOApp is the 256-bit hashpart of a standard address.
cell lz::Path::New(int srcEid, int srcOApp, int dstEid, int dstOApp) impure inline method_id {
    return cl::declare(
        lz::Path::NAME,
        unsafeTuple([
            [cl::t::uint32, srcEid],    ;; lz::Path::srcEid
            [cl::t::address, srcOApp],  ;; lz::Path::srcOApp
            [cl::t::uint32, dstEid],    ;; lz::Path::dstEid
            [cl::t::address, dstOApp]   ;; lz::Path::dstOApp
        ])
    );
}

const int lz::Path::_headerInfoBits = _BASIC_HEADER_WIDTH + (_FIELD_INFO_WIDTH * 4);
const int lz::Path::_headerFillerBits = _HEADER_WIDTH - lz::Path::_headerInfoBits;
const int lz::Path::_headerInfo = 8903714975572488637007080065659;

;; this function is unused by the protocol but will be used by OApps
cell lz::Path::build(int srcEid, int srcOApp, int dstEid, int dstOApp) impure inline {
    return begin_cell()
        .store_uint(lz::Path::_headerInfo, lz::Path::_headerInfoBits)    ;; header info
        .store_ones(lz::Path::_headerFillerBits)                         ;; header filler
        .store_uint32(srcEid)
        .store_uint256(srcOApp)
        .store_uint32(dstEid)
        .store_uint256(dstOApp)
        .end_cell();
}

cell lz::Path::endpointPath(int srcEid, int dstEid) impure inline {
    return lz::Path::New(srcEid, NULLADDRESS, dstEid, NULLADDRESS);
}

cell lz::Path::reverse(cell $path) inline {
    int srcEid = $path.cl::get<uint32>(lz::Path::srcEid);
    int srcOapp = $path.cl::get<address>(lz::Path::srcOApp);
    int dstEid = $path.cl::get<uint32>(lz::Path::dstEid);
    int dstOapp = $path.cl::get<address>(lz::Path::dstOApp);
    return lz::Path::New(dstEid, dstOapp, srcEid, srcOapp);
}

;; ====================== Object Getters =====================

const int lz::Path::_srcEidOffset = _HEADER_WIDTH;
const int lz::Path::_srcOAppOffset = lz::Path::_srcEidOffset + 32;
const int lz::Path::_dstEidOffset = lz::Path::_srcOAppOffset + 256;
const int lz::Path::_dstOAppOffset = lz::Path::_dstEidOffset + 32;

int lz::Path::getSrcOApp(cell $self) impure inline {
    return $self.cellPreloadAddressAt(lz::Path::_srcOAppOffset);
}

;; ====================== Storage Composite Accessors =====================

int lz::Path::getDstEid(cell $self) impure inline {
    return $self.cellPreloadUint32At(lz::Path::_dstEidOffset);
}

;; (srcEid, dstEid)
(int, int) lz::Path::getEidAndDstEid(cell $self) impure inline {
    slice $selfSlice = $self.begin_parse();
    return (
        $selfSlice.preloadUint32At(lz::Path::_srcEidOffset),
        $selfSlice.preloadUint32At(lz::Path::_dstEidOffset)
    );
}

;; (srcEid, srcOApp, dstEid, dstOApp)
(int, int, int, int) lz::Path::deserialize(cell $self) impure inline {
    slice $selfSlice = $self.begin_parse();
    return (
        $selfSlice.preloadUint32At(lz::Path::_srcEidOffset),
        $selfSlice.preloadAddressAt(lz::Path::_srcOAppOffset),
        $selfSlice.preloadUint32At(lz::Path::_dstEidOffset),
        $selfSlice.preloadAddressAt(lz::Path::_dstOAppOffset)
    );
}

;; ====================== Object Mutators =====================

;; low-level optimized version
;; original: 12k gas
;; optimized: 1k gas
cell lz::Path::optimizedReverse(cell $path) impure inline {
    slice pathSlice = $path.begin_parse();
    return begin_cell()
        .store_slice(pathSlice.scutfirst(_HEADER_WIDTH, 0))
        .store_slice(pathSlice.preload_bits_offset(lz::Path::_dstEidOffset, 288)) ;; 32 + 256
        .store_slice(pathSlice.preload_bits_offset(lz::Path::_srcEidOffset, 288)) ;; eid + address
        .end_cell();
}

cell lz::Path::sanitize(cell $path) impure {
    return lz::Path::New(
        $path.cl::get<uint32>(lz::Path::srcEid),
        $path.cl::get<address>(lz::Path::srcOApp),
        $path.cl::get<uint32>(lz::Path::dstEid),
        $path.cl::get<address>(lz::Path::dstOApp)
    );
}

```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/lz/ReceiveEpConfig.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int lz::ReceiveEpConfig::NAME = "RcvEpCfg"u;

;; field names
const int lz::ReceiveEpConfig::receiveMsglibConnection = 0;
const int lz::ReceiveEpConfig::timeoutReceiveMsglibConnection = 1;
const int lz::ReceiveEpConfig::expiry = 2;

cell lz::ReceiveEpConfig::New(
    int receiveMsglibConnectionAddress,
    int timeoutReceiveMsglibConnectionAddress,
    int expiry
) impure inline method_id {
    return cl::declare(
        lz::ReceiveEpConfig::NAME,
        unsafeTuple([
            [cl::t::address, receiveMsglibConnectionAddress],        ;; lz::ReceiveEpConfig::receiveMsglibConnection
            [cl::t::address, timeoutReceiveMsglibConnectionAddress], ;; lz::ReceiveEpConfig::timeoutReceiveMsglibConnection
            [cl::t::uint64, expiry]                                  ;; lz::ReceiveEpConfig::expiry
        ])
    );
}

;; ====================== Object Builders =====================


const int lz::ReceiveEpConfig::_headerInfoBits = _BASIC_HEADER_WIDTH + (_FIELD_INFO_WIDTH * 3);
const int lz::ReceiveEpConfig::_headerFillerBits = _HEADER_WIDTH - lz::ReceiveEpConfig::_headerInfoBits;
const int lz::ReceiveEpConfig::_headerInfo = 106946417840994430288387571463327099;

cell lz::ReceiveEpConfig::build(
    int receiveMsglibConnectionAddress,
    int timeoutReceiveMsglibConnectionAddress,
    int expiry
) impure inline {
    return begin_cell()
        .store_uint(lz::ReceiveEpConfig::_headerInfo, lz::ReceiveEpConfig::_headerInfoBits) ;; header info
        .store_ones(lz::ReceiveEpConfig::_headerFillerBits)                                 ;; header filler
        .store_uint256(receiveMsglibConnectionAddress)                                       ;; cl::t::uint256
        .store_uint256(timeoutReceiveMsglibConnectionAddress)                                ;; cl::t::uint256
        .store_uint64(expiry)                                                                ;; cl::t::uint64
        .end_cell();
}

;; ====================== Object Getters =====================

const int lz::ReceiveEpConfig::_receiveMsglibConnectionOffset = _HEADER_WIDTH;
const int lz::ReceiveEpConfig::_timeoutReceiveMsglibConnectionOffset = lz::ReceiveEpConfig::_receiveMsglibConnectionOffset + 256;
const int lz::ReceiveEpConfig::_expiryOffset = lz::ReceiveEpConfig::_timeoutReceiveMsglibConnectionOffset + 256;

int lz::ReceiveEpConfig::getReceiveMsglibConnection(cell $self) impure inline {
    return $self.cellPreloadAddressAt(lz::ReceiveEpConfig::_receiveMsglibConnectionOffset);
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/lz/SendEpConfig.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int lz::SendEpConfig::NAME = "SendEpCfg"u;

;; field names
const int lz::SendEpConfig::sendMsglibManager = 0;
const int lz::SendEpConfig::sendMsglib = 1;
const int lz::SendEpConfig::sendMsglibConnection = 2;

cell lz::SendEpConfig::New(int sendMsglibManager, int sendMsglib, int sendMsglibConnection) impure inline method_id {
    return cl::declare(
        lz::SendEpConfig::NAME,
        unsafeTuple([
            [cl::t::address, sendMsglibManager],        ;; lz::SendEpConfig::sendMsglibManager
            [cl::t::address, sendMsglib],               ;; lz::SendEpConfig::sendMsglib
            [cl::t::address, sendMsglibConnection]      ;; lz::SendEpConfig::sendMsglibConnection
        ])
    );
}

;; ====================== Object Builders =====================

;; everything fits in the root cell
const int lz::SendEpConfig::_headerInfoBits = _BASIC_HEADER_WIDTH + (_FIELD_INFO_WIDTH * 3);
const int lz::SendEpConfig::_headerFillerBits = _HEADER_WIDTH - lz::SendEpConfig::_headerInfoBits;
const int lz::SendEpConfig::_headerInfo = 27713146160555717952182050613837570051;

cell lz::SendEpConfig::build(int sendMsglibManager, int sendMsglib, int sendMsglibConnection) impure inline {
    return begin_cell()
        .store_uint(lz::SendEpConfig::_headerInfo, lz::SendEpConfig::_headerInfoBits)
        .store_ones(lz::SendEpConfig::_headerFillerBits)
        .store_uint256(sendMsglibManager)
        .store_uint256(sendMsglib)
        .store_ref(empty_cell())
        .store_ref(empty_cell())
        .store_ref(
            begin_cell()
                .store_uint256(sendMsglibConnection)
            .end_cell()
        )
        .end_cell();
}

;; root cell offsets
const int lz::SendEpConfig::_sendMsglibManagerOffset = _HEADER_WIDTH;
const int lz::SendEpConfig::_sendMsglibOffset = _HEADER_WIDTH + 256;

;; ref[2] offsets
const int lz::SendEpConfig::_sendMsglibConnectionOffset = 0;

;; ====================== Object Getters =====================

int lz::SendEpConfig::getSendMsglib(cell $self) impure inline {
    return $self.cellPreloadAddressAt(lz::SendEpConfig::_sendMsglibOffset);
}

;; ====================== Object Multi-Getters =====================

;; (sendMsglibManager, sendMsglib, sendMsglibConnection)
(int, int, int) lz::SendEpConfig::deserialize(cell $self) impure inline {
    slice selfSlice = $self.begin_parse();
    return (
        selfSlice.preloadAddressAt(lz::SendEpConfig::_sendMsglibManagerOffset),
        selfSlice.preloadAddressAt(lz::SendEpConfig::_sendMsglibOffset),
        selfSlice.preloadRefAt(2).cellPreloadAddressAt(lz::SendEpConfig::_sendMsglibConnectionOffset)
    );
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/ChannelNonceInfo.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int md::ChannelNonceInfo::NAME = "cNonceInfo"u;

;; field names
const int md::ChannelNonceInfo::nonce = 0;
const int md::ChannelNonceInfo::firstUnexecutedNonce = 1;

cell md::ChannelNonceInfo::New(int nonce, int firstUnexecutedNonce) impure inline method_id {
    return cl::declare(
        md::ChannelNonceInfo::NAME,
        unsafeTuple([
            [cl::t::uint64, nonce], ;; md::ChannelNonceInfo::nonce
            [cl::t::uint64, firstUnexecutedNonce]   ;; md::ChannelNonceInfo::firstUnexecutedNonce
        ])
    );
}

;; ====================== Object Getters =====================

const int md::ChannelNonceInfo::_nonceOffset = _HEADER_WIDTH;
const int md::ChannelNonceInfo::_firstUnexecutedNonceOffset = md::ChannelNonceInfo::_nonceOffset + 64;

(int, int) md::ChannelNonceInfo::deserialize(cell $self) impure inline {
    slice selfSlice = $self.begin_parse();
    return (
        selfSlice.preloadUint64At(md::ChannelNonceInfo::_nonceOffset),
        selfSlice.preloadUint64At(md::ChannelNonceInfo::_firstUnexecutedNonceOffset)
    );
}

cell md::ChannelNonceInfo::sanitize(cell $self) impure inline_ref {
    int nonce = $self.cl::get<uint64>(md::ChannelNonceInfo::nonce);
    int firstUnexecutedNonce = $self.cl::get<uint64>(md::ChannelNonceInfo::firstUnexecutedNonce);

    return md::ChannelNonceInfo::New(nonce, firstUnexecutedNonce);
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/CoinsAmount.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int md::CoinsAmount::NAME = "coinsAmt"u;

;; field names
const int md::CoinsAmount::amount = 0;

cell md::CoinsAmount::New(int amount) impure inline method_id {
    return cl::declare(
        md::CoinsAmount::NAME,
        unsafeTuple([
            [cl::t::coins, amount] ;; md::CoinsAmount::amount
        ])
    );
}

;; ========================== Sanitize ==========================

cell md::CoinsAmount::sanitize(cell $self) impure {
    int amount = $self.cl::get<coins>(md::CoinsAmount::amount);

    return md::CoinsAmount::New(amount);
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/ExtendedMd.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int md::ExtendedMd::NAME = "extendedMd"u;

;; field names
const int md::ExtendedMd::md = 0;
const int md::ExtendedMd::obj = 1;
const int md::ExtendedMd::forwardingAddress = 2;

cell md::ExtendedMd::New(cell $md, cell $obj, int forwardingAddress) impure inline method_id {
    return cl::declare(
        md::ExtendedMd::NAME,
        unsafeTuple([
            [cl::t::objRef, $md],                ;; md::ExtendedMd::md
            [cl::t::objRef, $obj],               ;; md::ExtendedMd::obj
            [cl::t::address, forwardingAddress]  ;; md::ExtendedMd::forwardingAddress
        ])
    );
}

const int md::ExtendedMd::_headerInfoBits = _BASIC_HEADER_WIDTH + (_FIELD_INFO_WIDTH * 3);
const int md::ExtendedMd::_headerFillerBits = _HEADER_WIDTH - md::ExtendedMd::_headerInfoBits;
const int md::ExtendedMd::_headerInfo = 8632157695553525919024050567799415113083;

cell md::ExtendedMd::build(cell $md, cell $obj, int forwardingAddress) impure inline {
    return begin_cell()
        .store_uint(md::ExtendedMd::_headerInfo, md::ExtendedMd::_headerInfoBits)     ;; header info
        .store_ones(md::ExtendedMd::_headerFillerBits)                                ;; header filler
        .store_ref($md)                                                                ;; md::ExtendedMd::md
        .store_ref($obj)                                                               ;; md::ExtendedMd::obj
        .store_uint256(forwardingAddress)                                              ;; md::ExtendedMd::forwardingAddress
        .end_cell();
}   

;; ====================== Object Getters =====================

const int md::ExtendedMd::_forwardingAddressOffset = _HEADER_WIDTH;

cell md::ExtendedMd::getObj(cell $self) impure inline {
    return $self.cellPreloadRefAt(1);
}

;; ====================== Object Multi-Getters =====================

(cell, int) md::ExtendedMd::getMdAndForwardingAddress(cell $self) impure inline {
    slice selfSlice = $self.begin_parse();
    return (
        selfSlice.preloadRefAt(0),
        selfSlice.preloadAddressAt(md::ExtendedMd::_forwardingAddressOffset)
    );
}

(cell, cell, int) md::ExtendedMd::deserialize(cell $self) impure inline {
    slice selfSlice = $self.begin_parse();
    return (
        selfSlice.preloadRefAt(0),
        selfSlice.preloadRefAt(1),
        selfSlice.preloadAddressAt(md::ExtendedMd::_forwardingAddressOffset)
    );
}

;; ====================== Sanitize =====================

cell md::ExtendedMd::sanitize(cell $extendedMd) impure {
    cell $md = $extendedMd.cl::get<objRef>(md::ExtendedMd::md);
    cell $obj = $extendedMd.cl::get<objRef>(md::ExtendedMd::obj);
    int forwardingAddress = $extendedMd.cl::get<address>(md::ExtendedMd::forwardingAddress);

    return md::ExtendedMd::New($md, $obj, forwardingAddress);
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/LzReceivePrepare.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int md::LzReceivePrepare::NAME = "lzrecvprep"u;

;; field names
const int md::LzReceivePrepare::nonce = 0;
const int md::LzReceivePrepare::nanotons = 1;

cell md::LzReceivePrepare::New(int nonce, int nanotons) impure method_id {
    return cl::declare(
        md::LzReceivePrepare::NAME,
        unsafeTuple([
            [cl::t::uint64, nonce], ;; md::LzReceivePrepare::nonce
            [cl::t::coins, nanotons] ;; md::LzReceivePrepare::nanotons
        ])
    );
}

;; ====================== Object Getters =====================

const int md::LzReceivePrepare::_nonceOffset = _HEADER_WIDTH;
const int md::LzReceivePrepare::_nanotonsOffset = md::LzReceivePrepare::_nonceOffset + 64;

;; this function is unused by the protocol but will be used by OApps
int md::LzReceivePrepare::getNanotons(cell $self) impure inline {
    return $self.cellPreloadCoinsAt(md::LzReceivePrepare::_nanotonsOffset);
}

;; ====================== Object Multi-Getters =====================

(int, int) md::LzReceivePrepare::deserialize(cell $self) impure inline {
    slice selfSlice = $self.begin_parse();
    return (
        selfSlice.preloadUint64At(md::LzReceivePrepare::_nonceOffset),
        selfSlice.preloadCoinsAt(md::LzReceivePrepare::_nanotonsOffset)
    );
}

```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/LzReceiveStatus.fc

```fc
#include "../lz/Packet.fc";

;; required storage name
const int md::LzReceiveStatus::NAME = "LzRecvSts"u;

;; field names
const int md::LzReceiveStatus::success = 0;
const int md::LzReceiveStatus::nonce = 1;
const int md::LzReceiveStatus::value = 2;
const int md::LzReceiveStatus::extraData = 3;
const int md::LzReceiveStatus::reason = 4;
const int md::LzReceiveStatus::sender = 5;
const int md::LzReceiveStatus::packet = 6;
const int md::LzReceiveStatus::executionStatus = 7;

cell md::LzReceiveStatus::New(int success, int nonce) impure inline method_id {
    return cl::declare(
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
}

cell md::LzReceiveStatus::NewFull(
    int success,
    int nonce,
    int value,
    cell extraData,
    cell reason,
    int sender,
    cell $packet,
    int executionStatus
) impure inline method_id {
    lz::Packet::_assertValidLinkedList(extraData, lz::Packet::MAX_RECEIVE_MESSAGE_CELLS);
    lz::Packet::_assertValidLinkedList(reason, lz::Packet::MAX_RECEIVE_MESSAGE_CELLS);
    return cl::declare(
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
}

;; ====================== Object Builders =====================

const int md::LzReceiveStatus::_headerInfoBits = _BASIC_HEADER_WIDTH + (_FIELD_INFO_WIDTH * 8);
const int md::LzReceiveStatus::_headerFillerBits = _HEADER_WIDTH - md::LzReceiveStatus::_headerInfoBits;
const int md::LzReceiveStatus::_headerInfo = 31461150238884194531671275676859177915085721713836393515717807231;

;; this function is unused by the protocol but will be used by OApps
cell md::LzReceiveStatus::build(
    int success,
    int nonce
) impure inline method_id {
    return begin_cell()
        .store_uint(md::LzReceiveStatus::_headerInfo, md::LzReceiveStatus::_headerInfoBits) ;; header info
        .store_ones(md::LzReceiveStatus::_headerFillerBits)                                 ;; header filler
        .store_bool(success)                                                                 ;; bool[0]
        .store_uint64(nonce)                                                                 ;; uint64[1]
        .store_uint128(0)                                                                    ;; coins[2]
        .store_uint256(NULLADDRESS)                                                          ;; address[3]
        .store_uint8(0)                                                                      ;; uint8[4]
        .store_ref(cl::nullObject())                                                         ;; ref[0]
        .store_ref(cl::nullObject())                                                         ;; ref[1]
        .store_ref(
            begin_cell()
                .store_ref(cl::nullObject())                                                 ;; ref[2]
            .end_cell()
        )
        .end_cell();
}


;; ====================== Object Multi-Getters =====================

const int md::LzReceiveStatus::_successOffset = _HEADER_WIDTH;
const int md::LzReceiveStatus::_nonceOffset = md::LzReceiveStatus::_successOffset + 1;
const int md::LzReceiveStatus::_valueOffset = md::LzReceiveStatus::_nonceOffset + 64;
const int md::LzReceiveStatus::_senderOffset = md::LzReceiveStatus::_valueOffset + 128;
const int md::LzReceiveStatus::_executionStatusOffset = md::LzReceiveStatus::_senderOffset + 256;
const int md::LzReceiveStatus::_extraDataOffset = md::LzReceiveStatus::_executionStatusOffset + 8;

(int, int) md::LzReceiveStatus::getSuccessAndNonce(cell $self) impure inline {
    slice $selfSlice = $self.begin_parse(); 
    return (
        $selfSlice.preloadBoolAt(md::LzReceiveStatus::_successOffset),
        $selfSlice.preloadUint64At(md::LzReceiveStatus::_nonceOffset)
    );
}

;; ========================== Sanitize ==========================

cell md::LzReceiveStatus::NewFull::sanitize(cell $self) impure {
    int success = $self.cl::get<bool>(md::LzReceiveStatus::success);
    int nonce = $self.cl::get<uint64>(md::LzReceiveStatus::nonce);
    int value = $self.cl::get<coins>(md::LzReceiveStatus::value);
    cell extraData = $self.cl::get<cellRef>(md::LzReceiveStatus::extraData);
    cell reason = $self.cl::get<cellRef>(md::LzReceiveStatus::reason);
    int sender = $self.cl::get<address>(md::LzReceiveStatus::sender);
    cell $packet = $self.cl::get<objRef>(md::LzReceiveStatus::packet);
    int executionStatus = $self.cl::get<uint8>(md::LzReceiveStatus::executionStatus);

    return md::LzReceiveStatus::NewFull(
        success,
        nonce,
        value,
        extraData,
        reason,
        sender,
        $packet,
        executionStatus
    );
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/LzSend.fc

```fc
#include "../../funC++/classlib.fc";
#include "../lz/Packet.fc";

;; required storage name
const int md::LzSend::NAME = "lzSend"u;

;; field names
const int md::LzSend::sendRequestId = 0;
const int md::LzSend::sendMsglibManager = 1;
const int md::LzSend::sendMsglib = 2;
const int md::LzSend::sendMsglibConnection = 3;
const int md::LzSend::packet = 4;
const int md::LzSend::nativeFee = 5;
const int md::LzSend::zroFee = 6;
const int md::LzSend::extraOptions = 7;
const int md::LzSend::enforcedOptions = 8;
const int md::LzSend::callbackData = 9;

cell md::LzSend::New(
    int nativeFee,
    int zroFee,
    cell $extraOptions,
    cell $enforcedOptions,
    cell $packet,
    cell callbackData
) impure inline method_id {
    return cl::declare(
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
}

const int md::LzSend::_headerPostNameBits = 180;
const int md::LzSend::_headerFillerBits = _HEADER_WIDTH - (md::LzSend::_headerPostNameBits + _NAME_WIDTH);
const int md::LzSend::_headerInfo = 582890735024998957421269964955452773563747974476099581;

;; ========================== Object Builders ==========================

;; this function is unused by the protocol but will be used by OApps
cell md::LzSend::build(
    int nativeFee,
    int zroFee,
    cell $extraOptions,
    cell $enforcedOptions,
    cell $packet,
    cell callbackData
) impure inline {
    return begin_cell()
        .store_uint(md::LzSend::NAME, _NAME_WIDTH)
        .store_uint(md::LzSend::_headerInfo, md::LzSend::_headerPostNameBits)
        .store_ones(md::LzSend::_headerFillerBits)
        .store_uint64(0)                       ;; sendRequestId
        .store_uint256(NULLADDRESS)            ;; sendMsglibManager
        .store_uint256(NULLADDRESS)            ;; sendMsglib
        .store_ref($packet)
        .store_ref($extraOptions)
        .store_ref(
            begin_cell()
                .store_uint256(NULLADDRESS)    ;; sendMsglibConnection
                .store_uint128(nativeFee)      ;; nativeFee
                .store_uint128(zroFee)         ;; zroFee
                .store_ref($enforcedOptions)   ;; enforcedOptions
                .store_ref(callbackData)       ;; callbackData
                .end_cell()
        )
        .end_cell();
}

;; ====================== Object Accessors =====================

;; in root cell
const int md::LzSend::_sendRequestIdffset = _HEADER_WIDTH;
const int md::LzSend::_sendMsglibManagerOffset = md::LzSend::_sendRequestIdffset + 64;
const int md::LzSend::_sendMsglibOffset = md::LzSend::_sendMsglibManagerOffset + 256;

;; in ref[2]
const int md::LzSend::_sendMsglibConnectionOffset = 0;
const int md::LzSend::_nativeFeeOffset = md::LzSend::_sendMsglibConnectionOffset + 256;
const int md::LzSend::_zroFeeOffset = md::LzSend::_nativeFeeOffset + 128;

int md::LzSend::getSendRequestId(cell $self) impure inline {
    return $self.cellPreloadUint64At(md::LzSend::_sendRequestIdffset);
}

int md::LzSend::getSendMsglib(cell $self) impure inline {
    return $self.cellPreloadAddressAt(md::LzSend::_sendMsglibOffset);
}

cell md::LzSend::getPacket(cell $self) impure inline {
    return $self.cellPreloadRefAt(0);
}

;; gets the path from the packet inside the LzSend
cell md::LzSend::getPath(cell $self) impure inline {
    return $self.cellPreloadRefAt(0).cellPreloadRefAt(0);
}

;; (requestId, nativeFee, zroFee, extraOptions, enforcedOptions, sendMsglibManager)
(int, int, int, cell, cell, int) md::LzSend::deserializeSendCallback(cell $self) impure inline {
    slice selfSlice = $self.begin_parse();
    slice ref2Slice = selfSlice.preloadRefSliceAt(2);
    return (
        selfSlice.preloadUint64At(md::LzSend::_sendRequestIdffset),
        ref2Slice.preloadCoinsAt(md::LzSend::_nativeFeeOffset),
        ref2Slice.preloadCoinsAt(md::LzSend::_zroFeeOffset),
        selfSlice.preloadRefAt(1),
        ref2Slice.preloadRefAt(0),
        selfSlice.preloadAddressAt(md::LzSend::_sendMsglibManagerOffset)
    );
}

;; (packet, extraOptions, enforcedOptions)
(cell, cell, cell) md::LzSend::getQuoteInformation(cell $self) impure inline {
    return (
        $self.cellPreloadRefAt(0),
        $self.cellPreloadRefAt(1),
        $self.cellPreloadRefAt(2).cellPreloadRefAt(0)
    );
}

(cell, cell) md::LzSend::getPacketAndCallbackData(cell $self) impure inline {
    slice selfSlice = $self.begin_parse();
    return (
        selfSlice.preloadRefAt(0),
        selfSlice.preloadRefSliceAt(2).preloadRefAt(1)
    );
}

;; ====================== Object Composite Modifiers =====================

const int md::lzSend::requestInfoWidth = _HEADER_WIDTH + 64 + 256 + 256;
;; Can't easily store a slice constant because the header isn't byte-aligned
const int md::lzSend::_headerInfoBits = _BASIC_HEADER_WIDTH + (_FIELD_INFO_WIDTH * 10);
const int md::lzSend::_headerPrefix = 11424049401754228397633815938683071207390004427712457772775726065407;
const int md::lzSend::_headerSuffix = 17331160549995323848587739135;
const int md::lzSend::_headerTrailingBits = _HEADER_WIDTH - 256;

cell md::LzSend::fillRequestInfo(
    cell $self,
    int requestId,
    int sendMsglibManager,
    int sendMsglib,
    int sendMsglibConnection
) impure inline method_id {
    slice selfslice = $self.begin_parse();
    slice ref2Slice = selfslice.preloadRefSliceAt(2);

    ;; Fill in the fields AND overwrite the entire header to match the expected format
    return begin_cell()
        .store_uint256(md::lzSend::_headerPrefix)
        .store_uint(md::lzSend::_headerSuffix, md::lzSend::_headerTrailingBits)
        .store_slice(selfslice.scutfirst(0, 2))
        .store_uint64(requestId)
        .store_uint256(sendMsglibManager)
        .store_uint256(sendMsglib)
        .store_ref(
            begin_cell()
                .store_uint256(sendMsglibConnection)
                .store_slice(ref2Slice.sskipfirst(md::LzSend::_nativeFeeOffset, 0))
                .end_cell()
        )
        .end_cell();
}

cell md::LzSend::setPacketNonceAndGuid(cell $self, int packetNonce, int packetGuid) impure inline {
    slice selfSlice = $self.begin_parse();

    cell $newPacket = selfSlice~load_ref()
        .lz::Packet::setNonceAndGuid(packetNonce, packetGuid);

    return begin_cell()
        .store_ref($newPacket)
        .store_slice(selfSlice)
        .end_cell();
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/MdAddress.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int md::MdAddress::NAME = "MdAddr"u;

;; field names
const int md::MdAddress::md = 0;
const int md::MdAddress::address = 1;

cell md::MdAddress::New(cell $md, int address) inline method_id {
    return cl::declare(
        md::MdAddress::NAME,
        unsafeTuple([
            [cl::t::objRef, $md],       ;; md::MdAddress::md
            [cl::t::address, address]   ;; md::MdAddress::address
        ])
    );
}

;; ========================== Object Builders ==========================

const int md::MdAddress::_headerInfoBits = _BASIC_HEADER_WIDTH + (_FIELD_INFO_WIDTH * 2);
const int md::MdAddress::_headerFillerBits = _HEADER_WIDTH - md::MdAddress::_headerInfoBits;
const int md::MdAddress::_headerInfo = 5847545689438192720283003;

cell md::MdAddress::build(cell $md, int address) impure inline method_id {
    return begin_cell()
        .store_uint(md::MdAddress::_headerInfo, md::MdAddress::_headerInfoBits) ;; header info
        .store_ones(md::MdAddress::_headerFillerBits)                          ;; header filler
        .store_uint256(address)                                                 ;; md::MdAddress::address
        .store_ref($md)                                                         ;; md::MdAddress::md = ref[0]
        .end_cell();
}

;; ========================== Object Getters ==========================

const int md::MdAddress::_addressOffset = _HEADER_WIDTH;

cell md::MdAddress::getMd(cell $self) impure inline {
    return $self.cellPreloadRefAt(0);
}

;; ========================== Object Multi-Getters ==========================

(cell, int) md::MdAddress::deserialize(cell $self) impure inline {
    slice selfSlice = $self.begin_parse();
    return (
        selfSlice.preloadRefAt(0),
        selfSlice.preloadAddressAt(md::MdAddress::_addressOffset)
    );
}

;; ========================== Sanitize ==========================

cell md::MdAddress::sanitize(cell $self) impure inline_ref {
    int address = $self.cl::get<uint256>(md::MdAddress::address);
    cell $md = $self.cl::get<objRef>(md::MdAddress::md);

    return md::MdAddress::New($md, address);
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/MdObj.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int md::MdObj::NAME = "MdObj"u;

;; field names
const int md::MdObj::md = 0;
const int md::MdObj::obj = 1;

cell md::MdObj::New(cell $md, cell $obj) impure inline method_id {
    return cl::declare(
        md::MdObj::NAME,
        unsafeTuple([
            [cl::t::objRef, $md],   ;; md::MdObj::md
            [cl::t::objRef, $obj]   ;; md::MdObj::obj
        ])
    );
}


;; ========================== Object Builders ==========================
const int md::MdObj::_headerInfoBits = _BASIC_HEADER_WIDTH + (_FIELD_INFO_WIDTH * 2);
const int md::MdObj::_headerFillerBits = _HEADER_WIDTH - md::MdObj::_headerInfoBits;
const int md::MdObj::_headerInfo = 22842038364999638994941;

cell md::MdObj::build(cell $md, cell $obj) impure inline {
    return begin_cell()
        .store_uint(md::MdObj::_headerInfo, md::MdObj::_headerInfoBits) ;; header info
        .store_ones(md::MdObj::_headerFillerBits)                       ;; header filler
        .store_ref($md)                                                  ;; ref[0]
        .store_ref($obj)                                                 ;; ref[1]
        .end_cell();
} 

;; ========================== Object Multi-Getters ==========================

cell md::MdObj::getMd(cell $self) impure inline {
    return $self.cellPreloadRefAt(0);
}

cell md::MdObj::getObj(cell $self) impure inline {
    return $self.cellPreloadRefAt(1);
}

(cell, cell) md::MdObj::deserialize(cell $self) impure inline {
    slice selfSlice = $self.begin_parse();
    return (
        selfSlice.preloadRefAt(0),
        selfSlice.preloadRefAt(1)
    );
}

cell md::MdObj::sanitize(cell $mdObj) impure {
    cell $md = $mdObj.cl::get<objRef>(md::MdObj::md);
    cell $obj = $mdObj.cl::get<objRef>(md::MdObj::obj);

    return md::MdObj::New($md, $obj);
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/MessagingReceipt.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int md::MessagingReceipt::NAME = "MsgReceipt"u;

;; field names
const int md::MessagingReceipt::lzSend = 0;
const int md::MessagingReceipt::nativeFeeActual = 1;
const int md::MessagingReceipt::zroFeeActual = 2;
const int md::MessagingReceipt::errorCode = 3;

cell md::MessagingReceipt::New(cell $lzSend, int nativeFee, int zroFee, int errorCode) impure inline method_id {
    return cl::declare(
        md::MessagingReceipt::NAME,
        unsafeTuple([
            [cl::t::objRef, $lzSend],   ;; md::MessagingReceipt::lzSend
            [cl::t::coins, nativeFee],  ;; md::MessagingReceipt::nativeFeeActual
            [cl::t::coins, zroFee],     ;; md::MessagingReceipt::zroFeeActual
            [cl::t::uint16, errorCode]  ;; md::MessagingReceipt::errorCode
        ])
    );
}


;; ========================== Object Builders ==========================

const int md::MessagingReceipt::_headerInfoBits = _BASIC_HEADER_WIDTH + (_FIELD_INFO_WIDTH * 4);
const int md::MessagingReceipt::_headerFillerBits = _HEADER_WIDTH - md::MessagingReceipt::_headerInfoBits;
const int md::MessagingReceipt::_headerInfo = 1727210451775936897226519655289233983117527419;

cell md::MessagingReceipt::build(cell $lzSend, int nativeFee, int zroFee, int errorCode) impure inline {
    return begin_cell()
        .store_uint(md::MessagingReceipt::_headerInfo, md::MessagingReceipt::_headerInfoBits) ;; header info
        .store_ones(md::MessagingReceipt::_headerFillerBits)                                  ;; header filler
        .store_ref($lzSend)                                                                   ;; ref[0]
        .store_uint128(nativeFee)                                                             ;; coins[1]
        .store_uint128(zroFee)                                                                ;; coins[2]
        .store_uint16(errorCode)                                                              ;; uint16[3]
        .end_cell();
}

;; ========================== Object Accessors ==========================

const int md::MessagingReceipt::_nativeFeeOffset = _HEADER_WIDTH;
const int md::MessagingReceipt::_zroFeeOffset = _HEADER_WIDTH + 128;
const int md::MessagingReceipt::_errorCodeOffset = _HEADER_WIDTH + 256;

;; this function is unused by the protocol but will be used by OApps
(int, cell) md::MessagingReceipt::getErrorCodeAndLzSend(cell $self) impure inline {
    slice selfSlice = $self.begin_parse();
    return (
        selfSlice.preloadUint16At(md::MessagingReceipt::_errorCodeOffset),
        selfSlice.preloadRefAt(0)
    );
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/MsglibSendCallback.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int md::MsglibSendCallback::NAME = "libSndCb"u;

;; field names
const int md::MsglibSendCallback::nativeFee = 0;
const int md::MsglibSendCallback::zroFee = 1;
const int md::MsglibSendCallback::lzSend = 2;
const int md::MsglibSendCallback::packetEncoded = 3;
const int md::MsglibSendCallback::payees = 4;
const int md::MsglibSendCallback::nonceByteOffset = 5;
const int md::MsglibSendCallback::nonceBytes = 6;
const int md::MsglibSendCallback::guidByteOffset = 7;
const int md::MsglibSendCallback::guidBytes = 8;
const int md::MsglibSendCallback::msglibSendEvents = 9;
const int md::MsglibSendCallback::errorCode = 10;

cell md::MsglibSendCallback::New(
    int nativeFee,
    int zroFee,
    cell $lzSend,
    cell packetEncoded,
    cell payees,
    int nonceByteOffset,
    int nonceBytes,
    int guidByteOffset,
    int guidBytes,
    cell $msglibSendEvents,
    int errorCode
) impure inline method_id {
    return cl::declare(
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
}

;; ========================== Object Builders ==========================

const int md::MsglibSendCallback::_headerInfoBits = 198;
const int md::MsglibSendCallback::_headerFillerBits = _HEADER_WIDTH - (198 + _NAME_WIDTH);
const int md::MsglibSendCallback::_headerInfo = 177909621499943220462532613625031755041688677811453802367547;

cell md::MsglibSendCallback::build(
    int nativeFee,
    int zroFee,
    cell $lzSend,
    cell packetEncoded,
    cell payees,
    int nonceByteOffset,
    int nonceBytes,
    int guidByteOffset,
    int guidBytes,
    cell $msglibSendEvents,
    int errorCode
) impure inline {
    return begin_cell()
        .store_uint(md::MsglibSendCallback::NAME, _NAME_WIDTH)                                    ;; name
        .store_uint(md::MsglibSendCallback::_headerInfo, md::MsglibSendCallback::_headerInfoBits) ;; rest of the header
        .store_ones(md::MsglibSendCallback::_headerFillerBits)                                    ;; header filler
        .store_uint128(nativeFee)                                                                 ;; nativeFee
        .store_uint128(zroFee)                                                                    ;; zroFee
        .store_uint16(nonceByteOffset)                                                            ;; nonceByteOffset
        .store_uint8(nonceBytes)                                                                  ;; nonceBytes
        .store_uint16(guidByteOffset)                                                             ;; guidByteOffset
        .store_uint8(guidBytes)                                                                   ;; guidBytes
        .store_uint8(errorCode)                                                                   ;; errorCode
        .store_ref($lzSend)                                                                       ;; lzSend
        .store_ref(packetEncoded)                                                                 ;; packetEncoded
        .store_ref(
            begin_cell()
                .store_ref(payees)                                                                ;; payees
                .store_ref($msglibSendEvents)                                                     ;; msglibSendEvents
            .end_cell()
        )
        .end_cell();
}

;; ========================== Object Getters ==========================

const int md::MsglibSendCallback::_nativeFeeOffset = _HEADER_WIDTH;
const int md::MsglibSendCallback::_zroFeeOffset = md::MsglibSendCallback::_nativeFeeOffset + 128;
const int md::MsglibSendCallback::_nonceByteOffsetOffset = md::MsglibSendCallback::_zroFeeOffset + 128;
const int md::MsglibSendCallback::_nonceBytesOffset = md::MsglibSendCallback::_nonceByteOffsetOffset + 16;
const int md::MsglibSendCallback::_guidByteOffsetOffset = md::MsglibSendCallback::_nonceBytesOffset + 8;
const int md::MsglibSendCallback::_guidBytesOffset = md::MsglibSendCallback::_guidByteOffsetOffset + 16;
const int md::MsglibSendCallback::_errorCodeOffset = md::MsglibSendCallback::_guidBytesOffset + 8;


cell md::MsglibSendCallback::getLzSend(cell $self) impure inline {
    return $self
        .begin_parse()
        .preload_ref_at(0);
}

;; ========================== Object Multi-Getters ==========================

;; (errorCode, nativeFee, zroFee, lzSend, payees, encodedPacket, nonceByteOffset, nonceBytes, guidByteOffset, guidBytes, sendEvents)
(int, int, int, cell, cell, cell, int, int, int, int, cell) md::MsglibSendCallback::deserialize(cell $self) impure inline {
    slice selfSlice = $self.begin_parse();
    slice ref2 = selfSlice.preloadRefSliceAt(2);
    
    return (
        selfSlice.preloadUint8At(md::MsglibSendCallback::_errorCodeOffset),       ;; errorCode
        selfSlice.preloadCoinsAt(md::MsglibSendCallback::_nativeFeeOffset),       ;; nativeFee
        selfSlice.preloadCoinsAt(md::MsglibSendCallback::_zroFeeOffset),          ;; zroFee
        selfSlice.preloadRefAt(0),                                                ;; lzSend
        ref2.preloadRefAt(0),                                                     ;; payees
        selfSlice.preloadRefAt(1),                                                ;; encodedPacket
        selfSlice.preloadUint16At(md::MsglibSendCallback::_nonceByteOffsetOffset),;; nonceByteOffset
        selfSlice.preloadUint8At(md::MsglibSendCallback::_nonceBytesOffset),      ;; nonceBytes
        selfSlice.preloadUint16At(md::MsglibSendCallback::_guidByteOffsetOffset), ;; guidByteOffset
        selfSlice.preloadUint8At(md::MsglibSendCallback::_guidBytesOffset),       ;; guidBytes
        ref2.preloadRefAt(1)
    );
}

;; ========================== Payees Utilities ==========================

const int payeesTuple::_addressIdx  = 0;
const int payeesTuple::_nativeAmountIdx = 1;
const int payees::_addressBits = 256;
const int payees::_nativeAmountBits = 64;
const int payees::_payeeBits = payees::_addressBits + payees::_nativeAmountBits;

;; Serializes 3 payees (256-bit address => 64-bit TON coin amount) per cell.
cell serializePayees(tuple payeesInfo) impure inline {
    int numPayees = payeesInfo.tlen();
    if (numPayees == 0) {
        return empty_cell();
    }

    builder linkedList = begin_cell();
    tuple curPayee = empty_tuple();
    int idx = 1;
    while (idx <= numPayees) {
        curPayee = payeesInfo.tuple_at(numPayees - idx);
        if (idx % 3 == 0) {
            linkedList = begin_cell()
                .store_ref(linkedList.end_cell())
                .store_uint256(curPayee.int_at(payeesTuple::_addressIdx))
                .store_uint64(curPayee.int_at(payeesTuple::_nativeAmountIdx));
        } else {
            linkedList = linkedList
                .store_uint256(curPayee.int_at(payeesTuple::_addressIdx))
                .store_uint64(curPayee.int_at(payeesTuple::_nativeAmountIdx));
        }
        idx += 1;
    }

    return linkedList.end_cell();
}

;; deserializePayees will ignore any bits beyond 960
tuple deserializePayees(cell serializedPayees) impure inline {
    slice payeesSlice = serializedPayees.begin_parse();
    if (payeesSlice.slice_empty?()) {
        return empty_tuple();
    }
    tuple payees = empty_tuple();
    while (~ payeesSlice.slice_empty?()) {
        payees = payees.tpush([payeesSlice~load_uint256(), payeesSlice~load_uint64()]);

        ;; can you extract a second one?
        if (payeesSlice.slice_bits() >= (payees::_payeeBits)) {
            payees = payees.tpush([payeesSlice~load_uint256(), payeesSlice~load_uint64()]);
        }

        ;; how about a third?
        if (payeesSlice.slice_bits() >= (payees::_payeeBits)) {
            payees = payees.tpush([payeesSlice~load_uint256(), payeesSlice~load_uint64()]);
        }

        if (payeesSlice.slice_refs() > 0) {
            payeesSlice = payeesSlice.preload_first_ref().begin_parse();
        }
    }
    return payees;
}

;; Pop the last payee off the output of deserializePayees
;; and return the modified payee list and the popped payee.
(tuple, [int, int]) tpopPayee(tuple t) asm "TPOP";

```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/Nonce.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int md::Nonce::NAME = "nonce"u;

;; field names
const int md::Nonce::nonce = 0;

cell md::Nonce::New(int nonce) impure inline method_id {
    return cl::declare(
        md::Nonce::NAME,
        unsafeTuple([
            [cl::t::uint64, nonce] ;; md::Nonce::nonce
        ])
    );
}

;; ========================== Object Builders ==========================
const int md::Nonce::_headerInfoBits = _BASIC_HEADER_WIDTH + (_FIELD_INFO_WIDTH * 1);
const int md::Nonce::_headerFillerBits = _HEADER_WIDTH - md::Nonce::_headerInfoBits;
const int md::Nonce::_headerInfo = 124339069371385211;

;; this function is unused by the protocol but will be used by OApps
cell md::Nonce::build(int nonce) impure inline {
    return begin_cell()
        .store_uint(md::Nonce::_headerInfo, md::Nonce::_headerInfoBits) ;; header info
        .store_ones(md::Nonce::_headerFillerBits)                       ;; header filler
        .store_uint64(nonce)
        .end_cell();
}


;; ========================== Object Getters ==========================
const int md::Nonce::_nonceOffset = _HEADER_WIDTH;

int md::Nonce::getNonce(cell $self) impure inline {
    return $self.cellPreloadUint64At(md::Nonce::_nonceOffset);
}

;; ========================== Sanitize ==========================

cell md::Nonce::sanitize(cell $self) impure inline_ref {
    int nonce = $self.cl::get<uint64>(md::Nonce::nonce);

    return md::Nonce::New(nonce);
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/PacketId.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int md::PacketId::NAME = "pktId"u;

;; field names
const int md::PacketId::path = 0;
const int md::PacketId::nonce = 1;

cell md::PacketId::New(cell $path, int nonce) impure inline method_id {
    return cl::declare(
        md::PacketId::NAME,
        unsafeTuple([
            [cl::t::objRef, $path], ;; md::PacketId::path
            [cl::t::uint64, nonce]  ;; md::PacketId::nonce
        ])
    );
}

;; ========================== Object Builders ==========================

const int md::PacketId::_headerInfoBits = _BASIC_HEADER_WIDTH + (_FIELD_INFO_WIDTH * 2);
const int md::PacketId::_headerFillerBits = _HEADER_WIDTH - md::PacketId::_headerInfoBits;
const int md::PacketId::_headerInfo = 33180451689778480514427;

cell md::PacketId::build(cell $path, int nonce) impure inline {
    return begin_cell()
        .store_uint(md::PacketId::_headerInfo, md::PacketId::_headerInfoBits) ;; header info
        .store_ones(md::PacketId::_headerFillerBits)                          ;; header filler
        .store_ref($path)                                                     ;; ref[0]
        .store_uint(nonce, 64)                                                ;; uint[1]
        .end_cell();
}

;; ========================== Sanitize ==========================

cell md::PacketId::sanitize(cell $self) impure {
    cell $path = $self.cl::get<objRef>(md::PacketId::path);
    int nonce = $self.cl::get<uint64>(md::PacketId::nonce);

    return md::PacketId::New($path, nonce);
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/classes/msgdata/PacketSent.fc

```fc
#include "../../funC++/classlib.fc";

;; required storage name
const int md::PacketSent::NAME = "pktSent"u;

;; field names
const int md::PacketSent::nativeFee = 0;
const int md::PacketSent::zroFee = 1;
const int md::PacketSent::extraOptions = 2;
const int md::PacketSent::enforcedOptions = 3;
const int md::PacketSent::packetEncoded = 4;
const int md::PacketSent::nonce = 5;
const int md::PacketSent::msglibAddress = 6;
const int md::PacketSent::msglibSendEvents = 7;

cell md::PacketSent::New(
    int nativeFee,
    int zroFee,
    cell $extraOptions,
    cell $enforcedOptions,
    cell packetEncoded,
    int nonce,
    int msglibAddress,
    cell $msglibSendEvents
) impure inline method_id {
    return cl::declare(
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
}

;; ========================== Object Builders ==========================

const int md::PacketSent::_headerInfoBits = _BASIC_HEADER_WIDTH + (_FIELD_INFO_WIDTH * 8);
const int md::PacketSent::_headerFillerBits = _HEADER_WIDTH - md::PacketSent::_headerInfoBits;
const int md::PacketSent::_headerInfo = 705670168524170966093988960735291442056898952154447392698365;

cell md::PacketSent::build(
    int nativeFee,
    int zroFee,
    cell $extraOptions,
    cell $enforcedOptions,
    cell packetEncoded,
    int nonce,
    int msglibAddress,
    cell $msglibSendEvents
) impure inline {
    return begin_cell()
        .store_uint(md::PacketSent::_headerInfo, md::PacketSent::_headerInfoBits)
        .store_ones(md::PacketSent::_headerFillerBits)
        .store_uint128(nativeFee)
        .store_uint128(zroFee)
        .store_uint64(nonce)
        .store_uint256(msglibAddress)
        .store_ref($extraOptions)
        .store_ref($enforcedOptions)
        .store_ref(
            begin_cell()
            .store_ref(packetEncoded)
            .store_ref($msglibSendEvents)
            .end_cell()
        )
        .end_cell();
}

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

const int action::call::NAME = "actionCall"u;

const int action::call::to = 1;
const int action::call::opcode = 2;
const int action::call::md = 3;

;; Call a method on the contract at address `to` with the given message data `md`
;; optionally provide value provisioned from this contract's balance
;; @terminal
tuple action::call::create(int to, int opcode, cell $md) impure inline {
    return unsafeTuple([action::call::NAME, to, opcode, $md]);
}

;; returns true if equals
int action::call::equals(tuple self, tuple other) impure inline {
    int equalMdField = compareObjectFields(self.cell_at(action::call::md), other.cell_at(action::call::md));
    if (equalMdField != -1) {
        ~strdump("call: not equal md field at idx ");
        ~dump(equalMdField);
    }
    return (
        (self.int_at(0) == other.int_at(0)) ;; NAME
        & (self.int_at(action::call::to) == other.int_at(action::call::to))
        & (self.int_at(action::call::opcode) == other.int_at(action::call::opcode))
        & (equalMdField == -1)
    );
}

;; overloaded when you want to pass 0 outflowNanos
tuple _newAction<call>(int to, int opcode, cell $body) impure inline {
    return action::call::create(to, opcode, $body);
}

;; overloaded when you want to pass 0 outflowNanos
(tuple, ()) ~pushAction<call>(tuple actions, int to, int opcode, cell $body) impure inline {
    return (actions.tpush(_newAction<call>(to, opcode, $body)), ());
}

int executeCall(tuple callAction) impure inline {
    sendTerminalAction(
        callAction.int_at(action::call::to),
        buildLayerzeroMessageBody(
            0,
            callAction.int_at(action::call::opcode),
            callAction.cell_at(action::call::md)
        ),
        null(),
        NORMAL
    );
    return false;
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/actions/deploy.fc

```fc
#include "utils.fc";

;;; =======================================================
;; Deploys a contract defined by the given code and storage object,
;; and calls the contract with the given message data.
;; Typical usage will be to deploy and initialize
;;; =======================================================
const int action::deploy::NAME = "deploy"u;

const int action::deploy::code = 1;
const int action::deploy::storage = 2;
const int action::deploy::donationNanos = 3;
const int action::deploy::opcode = 4;
const int action::deploy::md = 5;
;; @info reserve donationNanos nanoton as the deployed contract's rent + value
;; @info in addition to the message value, use from_balance nanoton
;; from the contract's balance to pay for the deploy
;; @info e.g., if from_balance == outflowNanos, the entire rent is paid from the deployer
;; contract's balance
const int action::deploy::outflowNanos = 6;

;; @terminal
tuple action::deploy::create(
    cell code,
    cell $storage,
    int donationNanos,
    int opcode,
    cell $md,
    int outflowNanos
) impure inline {
    return unsafeTuple(
        [action::deploy::NAME, code, $storage, donationNanos, opcode, $md, outflowNanos]
    );
}

int action::deploy::equals(tuple self, tuple other) impure {
    int equalDataField = compareObjectFields(
        self.cell_at(action::deploy::storage),
        other.cell_at(action::deploy::storage)
    );
    int equalMdField = compareObjectFields(
        self.cell_at(action::deploy::md),
        other.cell_at(action::deploy::md)
    );
    return (
        (self.int_at(0) == other.int_at(0)) ;; NAME
        & (self.cell_at( action::deploy::code ).cell_hash() == other.cell_at( action::deploy::code ).cell_hash())
        & (equalDataField == -1)
        & (self.int_at(action::deploy::donationNanos) == other.int_at(action::deploy::donationNanos))
        & (self.int_at(action::deploy::opcode) == other.int_at(action::deploy::opcode))
        & (equalMdField == -1)
        & (self.int_at(action::deploy::outflowNanos) == other.int_at(action::deploy::outflowNanos))
    );
}

tuple _newAction<deployAndCall>(
    cell code,
    cell $storage,
    int donationNanos,
    int opcode,
    cell $md,
    int outflowNanos
) impure inline {
    return action::deploy::create(
        code,
        $storage,
        donationNanos,
        opcode,
        $md,
        outflowNanos
    );
}

(tuple, ()) ~pushAction<deployAndCall>(
    tuple actions,
    cell code,
    cell $storage,
    int donationNanos,
    int opcode,
    cell $md,
    int outflowNanos
) impure inline {
    return (
        actions
            .tpush(_newAction<deployAndCall>(
                code,
                $storage,
                donationNanos,
                opcode,
                $md,
                outflowNanos
            )),
        ()
    );
}

int executeDeploy(tuple action) impure inline {
    cell $storageObj = action.cell_at(action::deploy::storage);
    cell codeCell = action.cell_at(action::deploy::code);

    sendTerminalAction(
        computeContractAddress($storageObj, codeCell),
        buildLayerzeroMessageBody(
            action.int_at(action::deploy::donationNanos),
            action.int_at(action::deploy::opcode),
            action.cell_at(action::deploy::md)
        ),
        begin_cell()
            .store_uint(6, 5)
            .store_ref(codeCell)
            .store_ref($storageObj)
            .end_cell(),
        NORMAL
    );

    return false;
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/actions/dispatch.fc

```fc
#include "utils.fc";

#include "call.fc";

const int action::dispatch::NAME = "dispatch"u;

const int action::dispatch::to = 1;
const int action::dispatch::opcode = 2;
const int action::dispatch::md = 3;
const int action::dispatch::gasNanos = 4;

;; Call a method on the contract at address `to` with the given message data `md`
;; optionally provide value provisioned from this contract's balance
;; @terminal
tuple action::dispatch::create(int to, int opcode, cell $md, int gasNanos) inline {
    return unsafeTuple([action::dispatch::NAME, to, opcode, $md, gasNanos]);
}

;; returns true if equals
int action::dispatch::equals(tuple self, tuple other) {
    int equalMdField = compareObjectFields(
        self.cell_at(action::dispatch::md),
        other.cell_at(action::dispatch::md)
    );
    return (
        (self.int_at(0) == other.int_at(0 )) ;; NAME
        & (self.int_at(action::dispatch::to) == other.int_at(action::dispatch::to))
        & (self.int_at(action::dispatch::opcode) == other.int_at(action::dispatch::opcode))
        & (equalMdField == -1)
        & (self.int_at(action::dispatch::gasNanos) == other.int_at(action::dispatch::gasNanos))
    );
}

tuple _newAction<dispatch>(int to, int opcode, cell $body, int gasNanos) inline {
    return action::dispatch::create(to, opcode, $body, gasNanos);
}

;; overloaded when you want to pass 0 outflowNanos
(tuple, ()) ~pushAction<dispatch>(tuple actions, int to, int opcode, cell $body, int gasNanos) inline {
    return (actions.tpush(_newAction<dispatch>(to, opcode, $body, gasNanos)), ());
}

int executeDispatch(tuple dispatchAction) {
    cell body = buildLayerzeroMessageBody(
        0,
        dispatchAction.int_at(action::call::opcode),
        dispatchAction.cell_at(action::call::md)
    );

    (int cellsCount, int bitsCount, _) = body.compute_data_size(MAX_U16);

    sendNonTerminalAction(
        SEND_MSG_BOUNCEABLE,
        dispatchAction.int_at(action::dispatch::gasNanos) + get_forward_fee(cellsCount, bitsCount, false),
        dispatchAction.int_at(action::call::to),
        body,
        NORMAL
    );
    return true;
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/actions/event.fc

```fc
#include "../baseInterface.fc";
#include "../classlib.fc";
#include "utils.fc";

const int action::event::NAME = "event"u;

const int action::event::bodyIndex = 1;

const int action::event::topic = 0;
const int action::event::body = 1;
const int action::event::initialStorage = 2;

;; Interface function you must implement to get the event sink
int _getEventSink() impure inline;

;; @info Events in LZ contracts are internal messages to an event sink
;; where the resulting transaction always reverts
;; @non-terminal
cell action::event::New(int topic, cell $body, cell $initialStorage) impure inline method_id {
    return cl::declare(
        action::event::NAME,
        unsafeTuple([
            [cl::t::uint256, topic],
            [cl::t::objRef, $body],
            [cl::t::objRef, $initialStorage]
        ])
    );
}

const int action::event::_headerInfoBits = _BASIC_HEADER_WIDTH + (_FIELD_INFO_WIDTH * 3);
const int action::event::_headerFillerBits = _HEADER_WIDTH - action::event::_headerInfoBits;
const int action::event::_headerInfo = 7850279558805522911016931325;

cell action::event::build(int topic, cell $body, cell $initialStorage) impure inline method_id {
    return begin_cell()
        .store_uint(action::event::_headerInfo, action::event::_headerInfoBits)     ;; header info
        .store_ones(action::event::_headerFillerBits)                               ;; header filler
        .store_uint256(topic)
        .store_ref($body)
        .store_ref($initialStorage)
        .end_cell();
}

tuple action::event::create(int topic, cell $body, cell $initialStorage) impure inline {
    return unsafeTuple([
        action::event::NAME, 
        action::event::build(topic, $body, $initialStorage)
    ]);
}

;; returns true if equals
int action::event::equals(tuple self, tuple other) impure {
    int equalEventObj = compareObjectFields(
        self.cell_at(action::event::bodyIndex),
        other.cell_at(action::event::bodyIndex)
    );

    return (
        (self.int_at(0) == other.int_at(0)) ;; NAME
        & (equalEventObj == -1)
    );
}

;; interface this function because it requires passing the 'getInitialStorage' from the baseHandler
;; tuple _newAction<event>(int topic, cell $body) impure inline {
;;     return action::event::create(topic, $body, getInitialStorage());
;; }

tuple _newAction<event>(int topic, cell $body) impure inline;

(tuple, ()) ~pushAction<event>(tuple actions, int topic, cell $body) impure inline {
    return (actions.tpush(_newAction<event>(topic, $body)), ());
}

int executeEvent(tuple action) impure inline {
    ;; send event to event sink
    sendNonTerminalAction(
        SEND_MSG_NON_BOUNCEABLE,
        0,
        _getEventSink(),
        buildLayerzeroMessageBody(
            0,
            BaseInterface::OP::EVENT,
            action.cell_at(action::event::bodyIndex)
        ),
        PAID_EXTERNALLY
    );
    return true;
}

```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/actions/payment.fc

```fc
#include "utils.fc";

const int action::payment::NAME = "payment"u;

;; @info the address to pay
const int action::payment::toAddress = 1;
;; @info the amount to pay, in nanotons
const int action::payment::amount = 2;
;; @info the amount of value to provision from this contract's balance
const int action::payment::outflowNanos = 3;

;; @non-terminal
tuple action::payment::create(int toAddress, int amount, int outflowNanos) impure inline {
    return unsafeTuple([action::payment::NAME, toAddress, amount, outflowNanos]);
}

;; returns true if equals
int action::payment::equals(tuple self, tuple other) impure {
    return (
        (self.int_at(0) == other.int_at(0)) ;; NAME
        & (self.int_at(action::payment::toAddress) == other.int_at(action::payment::toAddress))
        & (self.int_at(action::payment::amount) == other.int_at(action::payment::amount))
        & (self.int_at(action::payment::outflowNanos) == other.int_at(action::payment::outflowNanos))
    );
}

tuple _newAction<payment>(int toAddress, int amount, int outflowNanos) impure inline {
    return action::payment::create(toAddress, amount, outflowNanos);
}

(tuple, ()) ~pushAction<payment>(tuple actions, int toAddress, int amount, int outflowNanos) impure inline {
    if (outflowNanos > 0) {
        actions = actions
            .tset(ACTIONS_OUTFLOW, actions.int_at(ACTIONS_OUTFLOW) + outflowNanos);
    }
    return (actions.tpush(_newAction<payment>(toAddress, amount, outflowNanos)), ());
}

int executePayment(tuple action) impure inline {
    sendNonTerminalAction(
        SEND_MSG_NON_BOUNCEABLE,
        get_forward_fee(BASECHAIN, 0, 1) +
        action.int_at(action::payment::amount),
        action.int_at(action::payment::toAddress),
        empty_cell(),
        NORMAL
    );

    ;; this being true means we're assuming there's going to
    ;; be some value left over after the payment is made
    return true;
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/actions/utils.fc

```fc
#include "../txnContext.fc";

;; Small file for now, but a placeholder for generic actions utility functions

const int ACTIONS_OUTFLOW = 0;

tuple emptyActions() inline {
    return unsafeTuple([0]);
}

;;; ======================================================================================
;; @info terminal actions are always sent using all non-reserved balance on the contract
() sendTerminalAction(int toAddress, cell messageBody, cell stateInit, int extraFlags) impure inline {
    builder b = begin_cell()
        .store_uint(SEND_MSG_BOUNCEABLE, 6)
        .store_slice(hashpartToBasechainAddressStd(toAddress))
        .store_coins(0);
    b = stateInit.is_null()
        ? b.store_uint(1, 107)
        : b.store_uint(7, 108).store_ref(stateInit);
    send_raw_message(b.store_ref(messageBody).end_cell(), CARRY_ALL_BALANCE | extraFlags);
}

;; @info non-terminal actions must specify the amount of funds to send
() sendNonTerminalAction(int bounceable, int amount, int toAddress, cell messageBody, int extraFlags) impure inline {
    cell msg = begin_cell()
        .store_uint(bounceable, 6)
        .store_slice(hashpartToBasechainAddressStd(toAddress))
        .store_coins(amount)
        .store_uint(1, 107)
        .store_ref(messageBody)
        .end_cell();
    send_raw_message(msg, extraFlags);
}
;; @param donationNanos: the amount of TON that the sender intended to be
;; withheld within our contract
;; @info baseHandler::refund_addr is the last known "origin" of a message
;; flow, and is used to refund the sender if the handler does not
;; use all remaining value from the in_message
cell buildLayerzeroMessageBody(int donationNanos, int opcode, cell $md) impure inline {
    cell ret = beginTonMessage(opcode)
        .store_coins(donationNanos)
        .store_slice(getOriginStd())
        .store_ref($md)
        .end_cell();
    return ret;
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/baseInterface.fc

```fc
const int BaseInterface::event::AUTHENTICATED = "AUTHENTICATED"u;
const int BaseInterface::event::INITIALIZED = "INITIALIZED"u;

const int BaseInterface::ERROR::notAuthenticated = 257;
const int BaseInterface::ERROR::onlyOwner = 258;
const int BaseInterface::ERROR::notInitialized = 259;
const int BaseInterface::ERROR::alreadyInitialized = 260;
const int BaseInterface::ERROR::invalidOpcode = 261;
const int BaseInterface::ERROR::eventEmitted = 262;
const int BaseInterface::ERROR::invalidActionType = 263;
const int BaseInterface::ERROR::invalidEventSource = 264;

const int BaseInterface::OP::INITIALIZE = "BaseInterface::OP::INITIALIZE"c;
const int BaseInterface::OP::EMPTY = 0;
const int BaseInterface::OP::EVENT = "BaseInterface::OP::EVENT"c;
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/classlib.fc

```fc
#include "utils.fc";
#include "stringlib.fc";

;; Types for storage abstraction
const int cl::t::bool = 0;
const int cl::t::uint8 = 3;
const int cl::t::uint16 = 4;
const int cl::t::uint32 = 5;
const int cl::t::uint64 = 6;
const int cl::t::coins = 7; ;; fixed-width uint128, because we are civilized people
const int cl::t::uint256 = 8;
const int cl::t::address = cl::t::uint256;
const int cl::t::cellRef = 9;
const int cl::t::dict256 = cl::t::cellRef;
const int cl::t::objRef = cl::t::cellRef;
const int cl::t::addressList = cl::t::cellRef;

const int DICT256_KEYLEN = 256;

const int cl::NULL_CLASS_NAME = "NULL"u;

const int cl::ERROR::INVALID_CLASS = 1057;
const int cl::ERROR::MALFORMED_OBJECT = 1058;


const int MAX_NAME_LEN = 10; ;; each name can be up to 10 characters long
const int _NAME_WIDTH = 8 * MAX_NAME_LEN; ;; convert to bits
const int _BASIC_HEADER_WIDTH = _NAME_WIDTH;
const int MAX_NAME_INTLEN = (1 << (8 * MAX_NAME_LEN)) - 1;

const int _FIELD_TYPE_WIDTH+_CELL_ID_WIDTH = 6; ;; support up to 16 types

const int _FIELD_TYPE_WIDTH = 4; ;; support up to 16 types
const int _CELL_ID_WIDTH = 2; ;; the classlib backend supports up to 4 inner cells including root
const int _DATA_OFFSET_WIDTH = 10; ;; 1023 bits per cell = 2**10 - 1
const int _REF_OFFSET_WIDTH = 2; ;; each cell can have up to 4 refs
const int _FIELD_INFO_WIDTH = _FIELD_TYPE_WIDTH + _CELL_ID_WIDTH + _DATA_OFFSET_WIDTH + _REF_OFFSET_WIDTH;
const int _MAX_CLASS_FIELDS = 15; ;; reserve 0xff for the "invalid" object field name
const int INVALID_CLASS_MEMBER = 15;
const int _HEADER_WIDTH = _BASIC_HEADER_WIDTH + _MAX_CLASS_FIELDS * _FIELD_INFO_WIDTH;

;; declarations require a tuple of the form [[ type, val ], ...]
const int FIELD_TYPE_IDX = 0;
const int FIELD_VAL_IDX = 1;

;;; ====================== Class functions ======================
;; returns type width in bits
int _getTypeWidth(int clType) impure inline {
    if (clType <= cl::t::uint256) {
        return 1 << clType; ;; type names are set up so this is true
    }
    ;; all other types are ref types with 0 data bits
    return 0;
}

int cl::hash(cell $obj) impure inline {
    return $obj.cell_hash();
}

int cl::isNullObject(cell $obj) impure inline {
    return $obj.cell_is_empty();
}

;; checks if a class lib object is flat, and contains no 'refs'
;; null is considered 'flat'
int cl::noRefFields(cell $obj) impure {
    slice headerSlice = $obj.begin_parse();
    int numRefs = headerSlice.slice_refs();

    if (numRefs == 0) {
        return true;
    } elseif (numRefs <= 2) {
        ;; if there are refs, the struct is not flat
        return false;
    }

    if (numRefs >= 3) {
        if (
            (headerSlice.preload_ref_at(0).cell_is_empty() == false)
            | (headerSlice.preload_ref_at(1).cell_is_empty() == false)
            | (headerSlice.preload_ref_at(2).begin_parse().slice_refs() != 0)
        ) {
            ;; if there is 1 structural node, that structural node must have 0 refs
            return false;
        }
    }

    if (numRefs >= 4) {
        if (headerSlice.preload_ref_at(3).begin_parse().slice_refs() != 0) {
            return false;
        }
    }

    return true;
}

int cl::equalObjTypeShallow(cell $a, cell $b) impure {
    slice aSlice = $a.begin_parse();
    slice bSlice = $b.begin_parse();
    int aRefs = aSlice.slice_refs();

    if (
        (aRefs != bSlice.slice_refs())
        | (aSlice.slice_bits() != bSlice.slice_bits())
    ) {
        return false;
    }

    int refIndex = 2;
    while (refIndex < aRefs) {
        if (
            (aSlice.preload_ref_at(refIndex).begin_parse().slice_refs() != bSlice.preload_ref_at(refIndex).begin_parse().slice_refs())
            | (aSlice.preload_ref_at(refIndex).begin_parse().slice_bits() != bSlice.preload_ref_at(refIndex).begin_parse().slice_bits())
        ) {
            return false;
        }
        refIndex += 1;
    }

    return true;
}

int cl::typeof(cell $obj) impure inline method_id {
    if (cl::isNullObject($obj)) {
        return cl::NULL_CLASS_NAME;
    }
    return $obj.begin_parse().preload_uint(_NAME_WIDTH);
}

cell cl::declare(int name, tuple fields) impure inline {
    ;; Initialize a tuple with [null, empty_builder] to store cell builders
    tuple classBuilder = unsafeTuple([null(), begin_cell()]);

    ;; Get number of fields of the object we want to create
    int num_fields = fields.tlen();
    ;; Start building header with class name
    builder headerBuilder = begin_cell().store_uint(name, _NAME_WIDTH);

    ;; Initialize tracking variables
    int curDataCell = 1;                ;; Current cell for storing data fields
    int curRefCell = 1;                 ;; Current cell for storing reference fields
    ;; root node is special as it only allows two ref fields
    int curCellMaxRefs = 2;             ;; Max references allowed in current cell 
    int curDataOffset = _HEADER_WIDTH;  ;; Current bit offset in data cell
    int curRefOffset = 0;               ;; Current reference offset in ref cell

    ;; Iterate through all fields
    int curField = 0;
    while (curField < num_fields) {
        ;; Get current field and its type from tuple
        tuple field = fields.tuple_at(curField);
        int fieldType = field.int_at(FIELD_TYPE_IDX);
        
        ;; Get number of bits needed for this field type
        ;; (2^{bitLength} for uints, 0 for Refs)
        int fieldBits = _getTypeWidth(fieldType);

        if (fieldBits > 0) {
            ;; If adding this integer field would exceed cell bit limit
            if ((curDataOffset + fieldBits) > MAX_CELL_BITS) {
                curDataCell += 1;  ;; Move to next cell
                curDataOffset = 0; ;; Reset bit offset
                ;; Add new cell builder if needed
                if (curDataCell >= classBuilder.tlen()) {
                    classBuilder = classBuilder.tpush(begin_cell());
                }
            }
        } else {
            ;; For reference types (fieldBits == 0)
            ;; If adding this ref would exceed cell ref limit
            if ((curRefOffset + 1) > curCellMaxRefs) {
                curRefCell += 1;  ;; Move to next cell
                curRefOffset = 0; ;; Reset ref offset
                curCellMaxRefs = MAX_CELL_REFS;  ;; Use max refs for non-root cells
                ;; Add new cell builder if needed
                if (curRefCell >= classBuilder.tlen()) {
                    classBuilder = classBuilder.tpush(begin_cell());
                }
            }
        }

        ;; Store field value based on type
        if (fieldType <= cl::t::address) {
            ;; For numeric types, store as uint
            classBuilder = classBuilder.tset(
                curDataCell,
                cast_to_builder(classBuilder.at(curDataCell))
                    .store_uint(abs(field.int_at(FIELD_VAL_IDX)), fieldBits)
            );
        } elseif (fieldType == cl::t::objRef) {
            ;; For object references, store as ref
            classBuilder = classBuilder.tset(
                curRefCell,
                cast_to_builder(classBuilder.at(curRefCell))
                    .store_ref(field.cell_at(FIELD_VAL_IDX))
            );
        } else {
            throw(CLASSLIB::ERROR::INVALID_FIELD_TYPE);
        }

        ;; Build field metadata in header
        headerBuilder = headerBuilder
            .store_uint(fieldType, _FIELD_TYPE_WIDTH);
        if (fieldBits > 0) {
            ;; For data fields, store cell index, bit offset, and ref offset
            headerBuilder = headerBuilder
                .store_uint(curDataCell == 1 ? 0 : curDataCell, _CELL_ID_WIDTH)
                .store_uint(curDataOffset, _DATA_OFFSET_WIDTH)
                .store_uint(3, _REF_OFFSET_WIDTH);
            curDataOffset += fieldBits;
        } else {
            ;; For ref fields, store cell index and ref offset
            headerBuilder = headerBuilder
                .store_uint(curRefCell == 1 ? 0 : curRefCell, _CELL_ID_WIDTH)
                .store_uint(MAX_CELL_BITS, _DATA_OFFSET_WIDTH)
                .store_uint(curRefOffset, _REF_OFFSET_WIDTH);
            curRefOffset += 1;
        }
        curField += 1;
    }

    ;; Get root cell builder and count total cells
    builder rootBuilder = classBuilder.at(1);
    int numCells = classBuilder.tlen() - 1;

    ;; For multi-cell objects, ensure root has exactly 2 refs
    if (numCells > 1) {
        if (rootBuilder.builder_refs() == 0) {
            rootBuilder = rootBuilder
                .store_ref(empty_cell())
                .store_ref(empty_cell());
        } elseif (rootBuilder.builder_refs() == 1) {
            rootBuilder = rootBuilder
                .store_ref(empty_cell());
        }
    }

    ;; Finalize header and combine with root cell
    headerBuilder = headerBuilder
        .store_ones(_HEADER_WIDTH - headerBuilder.builder_bits())
        .store_builder(rootBuilder);

    ;; Return final cell based on number of cells used
    if (numCells == 1) {
        return headerBuilder.end_cell();
    }
    if (numCells == 2) {
        return headerBuilder
            .store_ref(classBuilder.at(2).end_cell())
            .end_cell();
    }
    return headerBuilder
        .store_ref(classBuilder.at(2).end_cell())
        .store_ref(classBuilder.at(3).end_cell())
        .end_cell();
}

cell cl::nullObject() impure inline method_id {
    return empty_cell();
}

;;; ====================== Class Setter ======================
int cl::getFieldType::asm(slice self, int fieldInfoOffset) asm """
// STACK: left -> right: bottom -> top //
// Setup       // STACK [ headerSlice, fieldInfoOffset ]
4 PUSHINT      // STACK [ headerSlice, fieldInfoOffset, _FIELD_TYPE_WIDTH ]
SDSUBSTR       // STACK [ substring ]
4 PLDU         // STACK [ 2BitUnsignInt ]
""";

int cl::getFieldCellIndex::asm(slice self, int fieldInfoOffset) asm """
// STACK: left -> right: bottom -> top //
// Setup       // STACK [ headerSlice, fieldInfoOffset ]
4 ADDCONST     // STACK [ headerSlice, fieldInfoOffset + _FIELD_TYPE_WIDTH ]
2 PUSHINT      // STACK [ headerSlice, fieldInfoOffset + _FIELD_TYPE_WIDTH, _CELL_ID_WIDTH ]
SDSUBSTR       // STACK [ substring ]
2 PLDU         // STACK [ 2BitUnsignInt ]
""";

int cl::getFieldOffset::asm(slice self, int fieldInfoOffset) asm """
// STACK: left -> right: bottom -> top //
// Setup       // STACK [ headerSlice, fieldInfoOffset ]
6 ADDCONST     // STACK [ headerSlice, fieldInfoOffset + _FIELD_TYPE_WIDTH + _CELL_ID_WIDTH ]
10 PUSHINT     // STACK [ headerSlice, fieldInfoOffset + _FIELD_TYPE_WIDTH + _CELL_ID_WIDTH, _DATA_OFFSET_WIDTH ]
SDSUBSTR       // STACK [ substring ]
10 PLDU        // STACK [ 10BitUnsignInt ]
""";

int cl::getFieldCellOffset::asm(slice self, int fieldInfoOffset) asm """
// STACK: left -> right: bottom -> top //
// Setup        // STACK [ headerSlice, fieldInfoOffset ]
16 ADDCONST     // STACK [ headerSlice, fieldInfoOffset + _FIELD_TYPE_WIDTH + _CELL_ID_WIDTH + _DATA_OFFSET_WIDTH ]
2 PUSHINT       // STACK [ headerSlice, fieldInfoOffset + _FIELD_TYPE_WIDTH + _CELL_ID_WIDTH + _DATA_OFFSET_WIDTH, _REF_OFFSET_WIDTH ]
SDSUBSTR        // STACK [ substring ]
2 PLDU          // STACK [ 10BitUnsignInt ]
""";

int cl::preload_bits_offset_3::asm(int width1, slice self, int fieldOffset, int width2) asm """
// STACK: left -> right: bottom -> top //
// Setup        // STACK [ width1, headerSlice, fieldOffset, width2 ]
SDSUBSTR        // STACK [ width1, substring ]
s1 XCHG0        // STACK [ substring, width1 ]
PLDUX           // STACK [ 10BitUnsignInt ] ( CC + 1 )
""";

forall X -> cell cl::set(cell $self, int fieldName, X val) impure inline method_id {
    slice headerSlice = $self.begin_parse();
    int fieldInfoOffset = _BASIC_HEADER_WIDTH + (fieldName * _FIELD_INFO_WIDTH);
    int fieldCellIndex = headerSlice.cl::getFieldCellIndex::asm(fieldInfoOffset);
    int fieldType = headerSlice.cl::getFieldType::asm(fieldInfoOffset);
    int fieldOffset = headerSlice.cl::getFieldOffset::asm(fieldInfoOffset);
    int fieldRefsOffset = headerSlice.cl::getFieldCellOffset::asm(fieldInfoOffset);

    int fieldWidth = _getTypeWidth(fieldType);

    slice victim = fieldCellIndex == 0
        ? headerSlice
        : headerSlice.preload_ref_at(fieldCellIndex).begin_parse();
    if (fieldWidth != 0) {
        fieldRefsOffset = MAX_CELL_REFS;
    }

    builder replacement = begin_cell()
        .store_slice(
            victim.scutfirst(
                min(victim.slice_bits(), fieldOffset),
                min(fieldRefsOffset, victim.slice_refs())
            )
        );

    if (fieldType == cl::t::cellRef) {
        replacement = replacement
            .store_ref(val.cast_to_cell())
            .store_slice(victim.scutlast(0, victim.slice_refs() - fieldRefsOffset - 1));
    } else {
        ;; numeric type
        replacement = replacement
            .store_uint(abs(val.cast_to_int()), fieldWidth)
            .store_slice(victim.sskipfirst(fieldOffset + fieldWidth, victim.slice_refs()));
    }

    if (fieldCellIndex > 0) {
        ;; link the replacement into the root cell
        return begin_cell()
            .store_slice(headerSlice.scutfirst(headerSlice.slice_bits(), fieldCellIndex))
            .store_ref(replacement.end_cell())
            .store_slice(headerSlice.scutlast(0, headerSlice.slice_refs() - fieldCellIndex - 1))
            .end_cell();
    }
    return replacement.end_cell();
}
;;; ====================== Class Getters ======================

const int _NAME_WIDTH = 8 * MAX_NAME_LEN; ;; convert to bits
const int _BASIC_HEADER_WIDTH = _NAME_WIDTH;
const int MAX_NAME_INTLEN = (1 << (8 * MAX_NAME_LEN)) - 1;

const int _FIELD_TYPE_WIDTH = 4; ;; support up to 16 types
const int _CELL_ID_WIDTH = 2; ;; the classlib backend supports up to 4 inner cells including root
const int _DATA_OFFSET_WIDTH = 10; ;; 1023 bits per cell = 2**10 - 1


int cl::get<uint>(cell $self, int fieldName, int width) impure inline method_id {
    slice headerSlice = $self.begin_parse();

    int fieldInfoOffset = _BASIC_HEADER_WIDTH + (fieldName * _FIELD_INFO_WIDTH);
    int fieldCellIndex = headerSlice.cl::getFieldCellIndex::asm(fieldInfoOffset);
    int fieldOffset = headerSlice.cl::getFieldOffset::asm(fieldInfoOffset);

    if (fieldCellIndex == 0) {
        return cl::preload_bits_offset_3::asm(width, headerSlice, fieldOffset, width);
    } else {
        return cl::preload_bits_offset_3::asm(width, headerSlice.preload_ref_at(fieldCellIndex).begin_parse(), fieldOffset,  width);
    }
}

cell cl::get<cellRef>(cell $self, int fieldName) impure inline method_id {
    slice headerSlice = $self.begin_parse();
    int fieldInfoOffset = _BASIC_HEADER_WIDTH + (fieldName * _FIELD_INFO_WIDTH);
    int fieldCellIndex = headerSlice.cl::getFieldCellIndex::asm(fieldInfoOffset);
    int fieldRefIdx = headerSlice.cl::getFieldCellOffset::asm(fieldInfoOffset);

    if (fieldCellIndex == 0) {
        return headerSlice.preload_ref_at(fieldRefIdx);
    }

    return headerSlice
        .preload_ref_at(fieldCellIndex)
        .begin_parse()
        .preload_ref_at(fieldRefIdx)
    ;
}

cell cl::get<objRef>(cell $self, int fieldName) impure inline method_id {
    return cl::get<cellRef>($self, fieldName);
}

int cl::get<uint8>(cell $self, int fieldName) impure inline method_id {
    return $self.cl::get<uint>(fieldName, 8);
}

int cl::get<uint16>(cell $self, int fieldName) impure inline method_id {
    return $self.cl::get<uint>(fieldName, 16);
}

int cl::get<uint32>(cell $self, int fieldName) impure inline method_id {
    return $self.cl::get<uint>(fieldName, 32);
}

int cl::get<uint64>(cell $self, int fieldName) impure inline method_id {
    return $self.cl::get<uint>(fieldName, 64);
}

int cl::get<coins>(cell $self, int fieldName) impure inline method_id {
    return $self.cl::get<uint>(fieldName, 128);
}

int cl::get<uint256>(cell $self, int fieldName) impure inline method_id {
    return $self.cl::get<uint>(fieldName, 256);
}

slice cl::get<std_address>(cell $self, int fieldName) impure inline method_id {
    return hashpartToBasechainAddressStd(
        $self.cl::get<uint>(fieldName, 256)
    );
}

int cl::get<bool>(cell $self, int fieldName) impure inline method_id {
    return $self.cl::get<uint>(fieldName, 1) != 0;
}

cell cl::get<dict256>(cell $self, int fieldName) impure inline method_id {
    return $self.cl::get<cellRef>(fieldName);
}

int cl::get<address>(cell $self, int fieldName) impure inline method_id {
    return $self.cl::get<uint>(fieldName, 256);
}

;;; =============== DEBUG / CONVENIENCE FUNCTIONS =================
int typeofField(cell $self, int fieldName) impure inline {
    slice headerSlice = $self.begin_parse();
    int fieldInfoOffset = _BASIC_HEADER_WIDTH + (fieldName * _FIELD_INFO_WIDTH);
    return headerSlice
        .preload_bits_offset(
            fieldInfoOffset,
            _FIELD_TYPE_WIDTH
        )
        .preload_uint(_FIELD_TYPE_WIDTH);
}

;; returns -1 (true) if equal, otherwise the index of the first field that differs
;; returns 16 if the types of the objects are not equal
int compareObjectFields(cell $lhs, cell $rhs) impure inline {
    int malformed = cl::typeof($lhs) != cl::typeof($rhs);
    if (malformed) {
        return INVALID_CLASS_MEMBER;
    }
    if (cl::typeof($lhs) == cl::NULL_CLASS_NAME) {
        return -1;
    }
    int fieldIndex = 0;
    while (fieldIndex < INVALID_CLASS_MEMBER) {
        int curFieldType = $lhs.typeofField(fieldIndex);
        if (curFieldType == cl::t::cellRef) {
            malformed = $lhs.cl::get<objRef>(fieldIndex).cl::hash() != $rhs.cl::get<objRef>(fieldIndex).cl::hash();
            if (malformed) {
                ~dump($lhs.cl::get<objRef>(fieldIndex).cell_hash());
                ~dump($rhs.cl::get<objRef>(fieldIndex).cell_hash());
            }
        } elseif (curFieldType <= cl::t::uint256) {
            int cur_field_width = _getTypeWidth(curFieldType);
            malformed = $lhs.cl::get<uint>(fieldIndex, cur_field_width) != $rhs.cl::get<uint>(fieldIndex, cur_field_width);
            if (malformed) {
                str::console::log<int>("lhs: ", $lhs.cl::get<uint>(fieldIndex, cur_field_width));
                str::console::log<int>("rhs: ", $rhs.cl::get<uint>(fieldIndex, cur_field_width));
            }
        } else {
            ;; Finished iteration
            return -1;
        }
        if (malformed) {
            ~strdump("Malformed field");
            ~dump(fieldIndex);
            return fieldIndex;
        }
        fieldIndex += 1;
    }
    return -1;
}

int objectsAreEqual(cell $lhs, cell $rhs) impure inline {
    return compareObjectFields($lhs, $rhs) == -1;
}

slice _typeToStr(int fieldType) impure {
    if     (fieldType == cl::t::uint8)   { return "uint8";   }
    elseif (fieldType == cl::t::uint16)  { return "uint16";  }
    elseif (fieldType == cl::t::uint32)  { return "uint32";  }
    elseif (fieldType == cl::t::uint64)  { return "uint64";  }
    elseif (fieldType == cl::t::uint256) { return "uint256"; }
    elseif (fieldType == cl::t::coins)   { return "coins";   }
    elseif (fieldType == cl::t::address) { return "address"; }
    elseif (fieldType == cl::t::dict256) { return "dict256"; }
    elseif (fieldType == cl::t::objRef)  { return "objRef";  }
    elseif (fieldType == cl::t::cellRef) { return "cellRef"; }
    elseif (fieldType == cl::t::bool)    { return "bool";    }
    else                                 { return "unknown"; }
}

() printField(cell $obj, int fieldName) impure inline {
    slice headerSlice = $obj.begin_parse();
    int fieldType = typeofField($obj, fieldName);
    int fieldInfoOffset = _BASIC_HEADER_WIDTH + (fieldName * _FIELD_INFO_WIDTH);
    int fieldCellIndex = headerSlice
        .preload_bits_offset(
            fieldInfoOffset + _FIELD_TYPE_WIDTH,
            _CELL_ID_WIDTH
        )
        .preload_uint(_CELL_ID_WIDTH);
    int fieldRefIdx = headerSlice
        .preload_bits_offset(
            fieldInfoOffset + _FIELD_TYPE_WIDTH + _CELL_ID_WIDTH + _DATA_OFFSET_WIDTH,
            _REF_OFFSET_WIDTH
        )
        .preload_uint(_REF_OFFSET_WIDTH);

    int fieldBits = _getTypeWidth(fieldType);
    int fieldOffset = headerSlice
        .preload_bits_offset(
            fieldInfoOffset + _FIELD_TYPE_WIDTH + _CELL_ID_WIDTH,
            _DATA_OFFSET_WIDTH
        )
        .preload_uint(_DATA_OFFSET_WIDTH);

    slice toPrint = _typeToStr(fieldType)
        .str::concat(" ")
        .str::concatInt(fieldName)
        .str::concat(" at c")
        .str::concatInt(fieldCellIndex);
    if (fieldBits > 0) {
        toPrint = toPrint.str::concat(".b").str::concatInt(fieldOffset);
    } else {
        toPrint = toPrint.str::concat(".r").str::concatInt(fieldRefIdx);
    }
    if (fieldType <= cl::t::uint256) {
        ~strdump(
            toPrint
                .str::concat(" = ")
                .str::concatInt($obj.cl::get<uint>(fieldName, fieldBits))
        );
    } elseif (fieldType == cl::t::objRef) {
        ~strdump(toPrint
            .str::concat(" hash = ")
            .str::concatInt($obj.cl::get<objRef>(fieldName).cl::hash())
        );
    } else {
        ~strdump(toPrint
            .str::concat(" hash = ")
            .str::concatInt($obj.cl::get<cellRef>(fieldName).cell_hash())
        );
    }
}

;; doesn't actually return a tuple, just pushes something to the stack casted to a tuple
tuple getObjectField(cell $storage, int field) impure {
    int fieldType = typeofField($storage, field);
    int fieldBits = _getTypeWidth(fieldType);
    if (fieldType == cl::t::bool) {
        return unsafeTuple($storage.cl::get<bool>(field));
    } elseif (fieldType <= cl::t::uint256) {
        return unsafeTuple($storage.cl::get<uint>(field, fieldBits));
    }
    return unsafeTuple($storage.cl::get<cellRef>(field));
}

;; doesn't actually return a tuple, just pushes something to the stack casted to a tuple
tuple getContractStorageField(int field) impure method_id {
    return getObjectField(getContractStorage(), field);
}

;; doesn't actually return a tuple, just pushes something to the stack casted to a tuple
tuple getContractStorageNestedField(int field, int nestedField) impure method_id {
    return getObjectField(cast_to_cell(getContractStorageField(field)), nestedField);
}

;;; ====================== Dictionary functions ======================

slice uint256ToSlice(int val) impure inline {
    return begin_cell().store_uint256(val).as_slice();
}

int sliceToUint256(slice s) impure inline {
    return s.preload_uint(256);
}

;; override the insane behavior of TON to optimize out empty dictionaries
;; into a single bit
cell cl::dict256::New() impure inline {
    return empty_cell();
}

(slice, int) cl::dict256::get(cell dict, int key) impure inline method_id {
    if (dict.cell_is_empty()) {
        return (null(), false);
    }
    return dict.udict_get?(DICT256_KEYLEN, key);
}

(int, int) cl::dict256::get<uint256>(cell dict, int key) impure inline method_id {
    (slice val, int exists) = cl::dict256::get(dict, key);
    if (exists) {
        return (sliceToUint256(val), true);
    }
    return (0, false);
}

(cell, int) cl::dict256::get<cellRef>(cell dict, int key) impure inline method_id {
    if (dict.cell_is_empty()) {
        return (null(), false);
    }
    (cell ret, int exists) = dict.udict_get_ref?(DICT256_KEYLEN, key);
    ifnot (exists) {
        return (null(), false);
    }
    return (ret, true);
}

cell cl::dict256::setRef(cell dict, int key, cell val) impure inline method_id {
    if (dict.cell_is_empty()) {
        return new_dict().udict_set_ref(
            DICT256_KEYLEN,
            key,
            val.cast_to_cell()
        );
    }
    return dict.udict_set_ref(DICT256_KEYLEN, key, val.cast_to_cell());
}

forall X -> cell cl::dict256::set(cell dict, int key, X val) impure inline {
    slice _val = val.is_slice() ? val.cast_to_slice() : uint256ToSlice(val.cast_to_int());
    if (dict.cell_is_empty()) {
        return new_dict().udict_set(DICT256_KEYLEN, key, _val);
    }
    return dict.udict_set(DICT256_KEYLEN, key, _val);
}

cell cl::dict256::delete(cell dict, int key) impure {
    if (dict.cell_is_empty()) {
        return dict;
    }
    (cell modified_dict, _) = dict.udict_delete?(DICT256_KEYLEN, key);
    return modified_dict.is_cell() ? modified_dict : cl::dict256::New();
}

;;; ====================== Dictionary Iterators ======================
;; returns key, val, and key == -1 if there is no next (or min) element
;; if the val exists, it is returned
;; if a val does not exist, null() is returned

(int, slice) cl::dict256::getMin<slice>(cell dict256) impure inline {
    if (dict256.cell_is_empty()) {
        return (-1, null());
    }
    (int key, slice val, int exists) = dict256.udict_get_min?(DICT256_KEYLEN);
    if (exists) {
        return (key, val);
    }
    return (-1, null());
}

(int, int) cl::dict256::getMin<uint256>(cell dict256) impure inline {
    if (dict256.cell_is_empty()) {
        return (-1, null());
    }
    (int key, slice val, int exists) = dict256.udict_get_min?(DICT256_KEYLEN);
    if (exists) {
        return (key, val.preload_uint(256));
    }
    return (-1, null());
}

(int, cell) cl::dict256::getMin<cellRef>(cell dict256) impure inline {
    if (dict256.cell_is_empty()) {
        return (-1, null());
    }
    (int key, cell val, int exists) = dict256.udict_get_min_ref?(DICT256_KEYLEN);
    if (exists) {
        return (key, val);
    }
    return (-1, null());
}

(int, slice) cl::dict256::getNext<slice>(cell dict256, int pivot) impure inline {
    if (dict256.cell_is_empty()) {
        return (-1, null());
    }
    (int key, slice val, int exists) = dict256.udict_get_next?(DICT256_KEYLEN, pivot);
    if (exists) {
        return (key, val);
    }
    return (-1, null());
}

(int, int) cl::dict256::getNext<uint256>(cell dict256, int pivot) impure inline {
    if (dict256.cell_is_empty()) {
        return (-1, null());
    }
    (int key, slice val, int exists) = dict256.udict_get_next?(DICT256_KEYLEN, pivot);
    if (exists) {
        return (key, val.preload_uint(256));
    }
    return (-1, null());
}

(int, cell) cl::dict256::getNext<cellRef>(cell dict256, int pivot) impure inline {
    if (dict256.cell_is_empty()) {
        return (-1, null());
    }
    (int key, slice val, int exists) = dict256.udict_get_next?(DICT256_KEYLEN, pivot);
    if (exists) {
        return (key, val.preload_first_ref());
    }
    return (-1, null());
}

int cl::dict256::size(cell dict) impure inline method_id {
    int count = 0;
    (int pivot, _) = dict.cl::dict256::getMin<slice>();
    while (pivot >= 0) {
        (pivot, _) = dict.cl::dict256::getNext<slice>(pivot);
        count = count + 1;
    }
    return count;
}

;;; ====================== Nested Dict Helpers ======================

forall X -> cell cl::nestedDict256::set(cell $self, int fieldName, int key, X val) impure inline {
    return $self.cl::set(
        fieldName,
        $self
            .cl::get<dict256>(fieldName)
            .cl::dict256::set(key, val)
    );
}

cell cl::nestedDict256::setRef(cell $self, int fieldName, int key, cell val) impure inline {
    return $self.cl::set(
        fieldName,
        $self.cl::get<dict256>(fieldName).cl::dict256::setRef(key, val)
    );
}

cell cl::nestedDict256::delete(cell $self, int fieldName, int key) impure inline {
    return $self.cl::set(
        fieldName,
        $self.cl::get<dict256>(fieldName).cl::dict256::delete(key)
    );
}

(int, int) cl::nestedDict256::get<uint256>(cell $self, int fieldName, int key) impure inline {
    return $self.cl::get<dict256>(fieldName).cl::dict256::get<uint256>(key);
}

(slice, int) cl::nestedDict256::get<slice>(cell $self, int fieldName, int key) impure inline {
    return $self.cl::get<dict256>(fieldName).cl::dict256::get(key);
}

(cell, int) cl::nestedDict256::get<cellRef>(cell $self, int fieldName, int key) impure inline {
    (slice s, int exists) = $self.cl::get<dict256>(fieldName).cl::dict256::get(key);
    if (exists) {
        return (s.preload_first_ref(), true);
    }
    return (null(), false);
}

;; ========================= Storage View Functions =========================

;; -- Level 0: returns storage.fieldName
int getStorageFieldL0<uint>(int fieldName) impure method_id {
    cell $storage = getContractStorage();
    int fieldType = typeofField($storage, fieldName);
    int typeWidth = _getTypeWidth(fieldType);
    return cl::get<uint>($storage, fieldName, typeWidth);
}

cell getStorageFieldL0<cellRef>(int fieldName) impure method_id {
    return cl::get<cellRef>(
        getContractStorage(),
        fieldName
    );
}

cell getStorageFieldL0<objRef>(int fieldName) impure method_id {
    return cl::get<objRef>(
        getContractStorage(),
        fieldName
    );
}

;; -- Level 1: returns storage.fieldName.nestedFieldName
int getStorageFieldL1<uint>(int fieldName, int nestedFieldName) impure method_id {
    cell field = getStorageFieldL0<cellRef>(fieldName);
    int nestedFieldType = typeofField(field, nestedFieldName);
    int nestedFieldWidth = _getTypeWidth(nestedFieldType);
    return cl::get<uint>(field, nestedFieldName, nestedFieldWidth);
}

cell getStorageFieldL1<cellRef>(int fieldName, int nestedFieldName) impure method_id {
    return cl::get<cellRef>(
        getStorageFieldL0<cellRef>(fieldName),
        nestedFieldName
    );
}

cell getStorageFieldL1<objRef>(int fieldName, int nestedFieldName) impure method_id {
    return cl::get<objRef>(
        getStorageFieldL0<objRef>(fieldName),
        nestedFieldName
    );
}

;; returns storage.fieldName[key]
cell getStorageFieldL1<dict256::cellRef>(int fieldName, int key) impure method_id {
    (cell field, int exists) = cl::dict256::get<cellRef>(
        getStorageFieldL0<cellRef>(fieldName),
        key
    );
    if (exists) {
        return field;
    }
    return cl::nullObject();
}

int getStorageFieldL1<dict256::uint256>(int fieldName, int key) impure method_id {
    (int field, int exists) = cl::dict256::get<uint256>(
        getStorageFieldL0<cellRef>(fieldName),
        key
    );
    if (exists) {
        return field;
    }
    return -1;
}

;; Level 2: returns storage.fieldName[outerKey][innerKey]
cell getStorageFieldL2<dict256::cellRef>(int fieldName, int outerKey, int innerKey) impure method_id {
    (cell field, int exists) = cl::dict256::get<cellRef>(
        getStorageFieldL1<dict256::cellRef>(fieldName, outerKey),
        innerKey
    );
    if (exists) {
        return field;
    }
    return cl::nullObject();
}

int getStorageFieldL2<dict256::uint256>(int fieldName, int outerKey, int innerKey) impure method_id {
    (int field, int exists) = cl::dict256::get<uint256>(
        getStorageFieldL1<dict256::cellRef>(fieldName, outerKey),
        innerKey
    );
    if (exists) {
        return field;
    }
    return -1;
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/constants.fc

```fc
const int ERRORCODE_MASK = 0x7ff;
const int CLASSLIB::ERROR::INVALID_FIELD_TYPE = 1059;
const int CLASSLIB::ERROR::WRONG_ORDER_CONSTRUCTOR = 1060;

const int MAX_U8    = 0xFF;
const int MAX_U16   = 0xFFFF;
const int MAX_U32   = 0xFFFFFFFF;
const int MAX_U64   = 0xFFFFFFFFFFFFFFFF;
const int MAX_U128  = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
const int MAX_U256  = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
const int MAX_COINS = 1329227995784915872903807060280344575; ;; 2^120 - 1

const int ADDR_TYPE_NONE = 0;
const int ADDR_TYPE_EXTERN = 1;
const int ADDR_TYPE_STD = 2;
const int ADDR_TYPE_VAR = 3;

const int TRUE = -1;
const int FALSE = 0;
const int MASTERCHAIN = -1;
const int BASECHAIN = 0;

;; 0b011000 tag - 0, ihr_disabled - 1, bounce - 1, bounced - 0, src = adr_none$00
const int SEND_MSG_BOUNCEABLE = 0x18;
;; 0b010000 tag - 0, ihr_disabled - 1, bounce - 0, bounced - 0, src = adr_none$00
const int SEND_MSG_NON_BOUNCEABLE = 0x10;

;; MODIFIER
const int NORMAL = 0;
const int PAID_EXTERNALLY = 1;
const int IGNORE_ERRORS = 2;

;; SEND MODES
const int BOUNCE_IF_FAIL = 16;
const int DESTROY_IF_ZERO = 32;
const int CARRY_REMAINING_GAS = 64;
const int CARRY_ALL_BALANCE = 128;

;; SENDMSG modes
const int SUB_BALANCE_MSG = 64;
const int SUB_BALANCE_CONTRACT = 128;
const int ONLY_ESTIMATE_FEES = 1024;

;; SEND MODES QUIETED
const int QDESTROY_IF_ZERO = 34;
const int QCARRY_REMAINING_GAS = 66;
const int QCARRY_ALL_BALANCE = 130;

const int RESERVE_EXACTLY    = 0;
const int RESERVE_ALL_EXCEPT = 1;
const int RESERVE_AT_MOST    = 2;
const int EXTRN_DO_NOT_FAIL  = 2;
const int BALANCE_INCREASED  = 4;
const int BALANCE_DECREASED  = 8;
const int RESERVE_BOUNCE_ON_ACTION_FAIL = 16;

;; a lot of different constants, because arithmetic manipulation of constants is not optimized
const int MAX_CELL_BITS = 1023;
const int MAX_CELL_BYTES = 127;
const int MAX_CELL_WHOLE_BYTE_BITS = MAX_CELL_BYTES * 8;
const int MAX_CELL_BIT_INDEX = 1022;
const int MAX_CELL_REFS = 4;

const int NULLADDRESS = 0;

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

() main(int myBalance, int msgValue, cell inMsgFull, slice inMsgBody) impure inline {
    initTxnContext(myBalance, msgValue, inMsgFull, inMsgBody);

    if (txnIsBounced()) {
        return ();
    }

    authenticateIfNecessary();

    ;; ignore empty messages
    if (inMsgBody.slice_empty?()) {
        return ();
    }

    int op = getOpcode();
    cell $md = getMsgData();

    checkPermissions(op, $md);
    
    if (op == BaseInterface::OP::EVENT) {
        throw(BaseInterface::ERROR::eventEmitted);
    }

    tuple actions = null();
    if (op == BaseInterface::OP::INITIALIZE) {
        actions = initialize($md);
    } elseif (op == BaseInterface::OP::EMPTY) {
        actions = emptyActions();
    } else {
        assertInitialized();
        actions = _executeOpcode(op, $md);
    }

    int outflowNanos = actions.at(ACTIONS_OUTFLOW);
    ;; Storage fees are deducted from the contract balance
    ;; Any amount that is explicitly deposited into this contract (getRentNanos())
    ;; is reserved to prevent it from being sent downstream
    int baseline = (getContractBalance() - storage_fees()) - (getMsgValue() - getDonationNanos());
    ;; The below assertion matches the insufficient ton behavior on action phase
    ;; And it's probably unnecessary but it doesn’t cost much gas so no harm in keeping it.
    throw_unless(37, baseline >= outflowNanos);
    raw_reserve(baseline - outflowNanos, RESERVE_EXACTLY);

    ;; Whether there is any value left to refund to the origin
    int msgValueRemaining = true;
    ;; the index of the action to be processed
    int actionIndex = 1;
    int numActions = actions.tlen();
    while (actionIndex < numActions) {
        ;; ========================================
        ;; Loop management
        tuple action = actions.tuple_at(actionIndex);
        int actionType = action.int_at(0); ;; name is always the first index
        actionIndex += 1;

        ;; Applies a moving flag where if a single action returns false, then the false flag persists
        msgValueRemaining = msgValueRemaining & _executeAction(actionType, action);
    }

    ;; If any value remains, we should refund it to the origin
    if (msgValueRemaining) {
        cell msg = begin_cell()
            .store_uint(SEND_MSG_NON_BOUNCEABLE, 6)
            .store_slice(getOriginStd())
            .store_coins(0)
            .store_uint(1, 107)
            .store_ref(empty_cell())
            .end_cell();
        send_raw_message(msg, CARRY_ALL_BALANCE);
    }
}

```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/dataStructures/DeterministicInsertionCircularQueue.fc

```fc
;;; =================== DeterministicInsertionCircularQueue.fc ===================
;; the DeterministicInsertionCircularQueue is a deterministic-gas circular buffer
;; that stores key-value pairs along with one piece of metadata (8-bits) per entry.
#include "../utils.fc";

const int DeterministicInsertionCircularQueue::statusBits = 8;
const int DeterministicInsertionCircularQueue::keyBits = 64;

const int DeterministicInsertionCircularQueue::invalidKey = -1;
const int DeterministicInsertionCircularQueue::invalidStatus = -1;
const int DeterministicInsertionCircularQueue::ERROR::invalidObject = 1185;

cell DeterministicInsertionCircularQueue::_buildLevel(int level, cell initialContents) impure inline {
    if (level == 0) {
        return begin_cell()
            .store_ref(initialContents)
            .store_ref(initialContents)
            .store_ref(initialContents)
            .store_ref(initialContents)
            .end_cell();
    } else {
        int nextLevel = level - 1;
        return begin_cell()
            .store_ref(DeterministicInsertionCircularQueue::_buildLevel(nextLevel, initialContents))
            .store_ref(DeterministicInsertionCircularQueue::_buildLevel(nextLevel, initialContents))
            .store_ref(DeterministicInsertionCircularQueue::_buildLevel(nextLevel, initialContents))
            .store_ref(DeterministicInsertionCircularQueue::_buildLevel(nextLevel, initialContents))
            .end_cell();
    }
}

;; Given a well-formed commit_verification_queue
;; get the content of the queue at a given relative nonce
;; (actual key, entry, status, exists)
(int, cell, int, int) DeterministicInsertionCircularQueue::get(cell self, int key) impure inline {
    int position = key % MAX_CELL_BITS;

    slice commitSlice = self
        .begin_parse()
        .preload_ref_at(position / 256)
        .begin_parse()
        .preload_ref_at((position % 256) / 64)
        .begin_parse()
        .preload_ref_at((position % 64) / 16)
        .begin_parse()
        .preload_ref_at((position % 16) / 4)
        .begin_parse()
        .preload_ref_at(position % 4)
        .begin_parse();

    ;; guaranteed to always have state stored
    int exists = commitSlice~load_bool();
    int state = commitSlice~load_uint(DeterministicInsertionCircularQueue::statusBits);
    if (exists) {
        return (
            commitSlice.preload_uint(DeterministicInsertionCircularQueue::keyBits),
            commitSlice.preload_first_ref(),
            state,
            exists
        );
    }
    return (
        DeterministicInsertionCircularQueue::invalidKey,
        empty_cell(),
        DeterministicInsertionCircularQueue::invalidStatus,
        exists
    );
}

cell DeterministicInsertionCircularQueue::_setRaw(cell self, int key, cell newLeaf) impure inline {
    int slot = key % MAX_CELL_BITS;
    slice queueSlice = self.begin_parse();
    int l0_idx = slot / 256;
    int l1_idx = (slot % 256) / 64;
    int l2_idx = (slot % 64) / 16;
    int l3_idx = (slot % 16) / 4;
    int leaf_idx = slot % 4;

    slice l0Slice = queueSlice.preload_ref_at(l0_idx).begin_parse();
    slice l1Slice = l0Slice.preload_ref_at(l1_idx).begin_parse();
    slice l2Slice = l1Slice.preload_ref_at(l2_idx).begin_parse();
    slice l3Slice = l2Slice.preload_ref_at(l3_idx).begin_parse();

    cell new_l3 = begin_cell()
        .store_slice(scutfirst(l3Slice, 0, leaf_idx))
        .store_ref(newLeaf)
        .store_slice(scutlast(l3Slice, 0, 3 - leaf_idx))
        .end_cell();

    cell new_l2 = begin_cell()
        .store_slice(scutfirst(l2Slice, 0, l3_idx))
        .store_ref(new_l3)
        .store_slice(scutlast(l2Slice, 0, 3 - l3_idx))
        .end_cell();

    cell new_l1 = begin_cell()
        .store_slice(scutfirst(l1Slice, 0, l2_idx))
        .store_ref(new_l2)
        .store_slice(scutlast(l1Slice, 0, 3 - l2_idx))
        .end_cell();

    cell new_l0 = begin_cell()
        .store_slice(scutfirst(l0Slice, 0, l1_idx))
        .store_ref(new_l1)
        .store_slice(scutlast(l0Slice, 0, 3 - l1_idx))
        .end_cell();

    return (
        begin_cell()
            .store_slice(scutfirst(queueSlice, 0, l0_idx))
            .store_ref(new_l0)
            .store_slice(scutlast(queueSlice, 0, 3 - l0_idx))
            .end_cell()
    );
}

;; self
cell DeterministicInsertionCircularQueue::set(cell self, int key, cell $obj, int newState) impure inline {
    return DeterministicInsertionCircularQueue::_setRaw(
        self,
        key,
        begin_cell()
            .store_bool(true) ;; occupied
            .store_uint(newState, DeterministicInsertionCircularQueue::statusBits)
            .store_uint(key, DeterministicInsertionCircularQueue::keyBits)
            .store_ref($obj)
            .end_cell()
    );
}

cell DeterministicInsertionCircularQueue::delete(cell self, int key) impure inline {
    return DeterministicInsertionCircularQueue::_setRaw(
        self,
        key,
        begin_cell()
            .store_bool(false) ;; occupied
            .store_uint(0, DeterministicInsertionCircularQueue::statusBits)
            .store_uint(0, DeterministicInsertionCircularQueue::keyBits)
            .store_ref(empty_cell())
            .end_cell()
    );
}

cell DeterministicInsertionCircularQueue::create() impure method_id {
    ;; ceil(log4(MAX_CELL_BITS)) == 4
    ;; build the initial contents of each leaf in the outer scope to save gas
    cell initialContents = begin_cell()
        .store_bool(false) ;; unoccupied
        .store_uint(0, DeterministicInsertionCircularQueue::statusBits) ;; value not used until set
        .store_uint(0, DeterministicInsertionCircularQueue::keyBits) ;; value not used until set
        .store_ref(empty_cell()) ;; value not used until set
        .end_cell();
    return DeterministicInsertionCircularQueue::_buildLevel(4, initialContents);
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/dataStructures/PipelinedOutOfOrder.fc

```fc
;;; ==============================================================================
;; Pipelined Out-of-Order data structure
;; this data structure defines a bitmap that is used to track a stream of
;; commands that are executed out-of-order in a bounded-depth pipeline
#include "../classlib.fc";

const int POOO::NAME = "POOO"u;

const int POOO::nextEmpty = 0;
const int POOO::bitmap = 1;

const int POOO::ERROR::negativeIndex = 1153;

cell POOO::New() impure inline method_id {
    return cl::declare(
        POOO::NAME,
        unsafeTuple([
            [cl::t::uint64, 1], ;; nextEmpty
            [cl::t::cellRef, begin_cell().store_zeroes(MAX_CELL_BITS).end_cell()] ;; bitmap
        ])
    );
}

const int POOO::_headerInfoBits = _BASIC_HEADER_WIDTH + (_FIELD_INFO_WIDTH * 2);
const int POOO::_headerFillerBits = _HEADER_WIDTH - POOO::_headerInfoBits;
const int POOO::_headerInfo = 92590899976783941628;

cell POOO::buildFull(int nextEmpty, cell bitmap) impure inline {
    return begin_cell()
        .store_uint(POOO::_headerInfo, POOO::_headerInfoBits)       ;; header info
        .store_ones(POOO::_headerFillerBits)                        ;; header filler
        .store_uint64(nextEmpty)                                    ;; nextEmpty
        .store_ref(bitmap)                                          ;; bitmap
        .end_cell();
}

;; ========================== Object Getters ==========================

const int POOO::_nextEmptyOffset = _HEADER_WIDTH;

int POOO::getNextEmpty(cell $self) impure inline {
    return $self.cellPreloadUint64At(POOO::_nextEmptyOffset);
}

int POOO::maxSettableBit(cell $self) impure inline {
    return $self.POOO::getNextEmpty() + MAX_CELL_BIT_INDEX;
}

;; ========================== Object Multi-Getters ==========================

;; returns (nextEmpty, bitmap.slice)
(int, slice) POOO::deserialize(cell $self) impure inline {
    slice selfSlice = $self.begin_parse();
    return (
        selfSlice.preloadUint64At(POOO::_nextEmptyOffset),
        selfSlice.preloadRefSliceAt(0)
    );
}

;; ========================== Object Utils ==========================

int POOO::isBitSet(cell $self, int absoluteIdx) impure inline {
    (int nextEmpty, slice bitmap) = POOO::deserialize($self);
    int relativeIdx = absoluteIdx - nextEmpty;
    return bitmap.preloadBoolAt(relativeIdx);
}

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
cell POOO::set(cell $self, int absoluteIndex) impure inline method_id {
    throw_if(POOO::ERROR::negativeIndex, absoluteIndex < 0);

    (int nextEmpty, slice bitmapSlice) = POOO::deserialize($self);
    if (absoluteIndex < nextEmpty) {
        return $self;
    }

    int index = absoluteIndex - nextEmpty;

    (int leadingOnes, slice remainingBitmap) = ldones(
        begin_cell()
            .store_slice(scutfirst(bitmapSlice, index, 0))
            .store_uint(1, 1)
            .store_slice(scutlast(bitmapSlice, MAX_CELL_BITS - index - 1, 0))
            .as_slice()
    );
    
    return POOO::buildFull(
        nextEmpty + leadingOnes,
        begin_cell()
            .store_slice(remainingBitmap)
            .store_zeroes(leadingOnes)
        .end_cell()
    );
}

cell POOO::unsafeSetBits(cell $self, int start, int end) impure inline method_id {
    (int nextEmpty, slice bitmapSlice) = POOO::deserialize($self);

    int startIndex = start - nextEmpty;
    int endIndex = end - nextEmpty;

    (int leadingOnes, slice remainingBitmap) = ldones(
        begin_cell()
            .store_slice(scutfirst(bitmapSlice, startIndex, 0))
            .store_ones(endIndex - startIndex)
            .store_slice(scutlast(bitmapSlice, MAX_CELL_BITS - endIndex, 0))
            .as_slice()
    );
    
    return POOO::buildFull(
        nextEmpty + leadingOnes,
        begin_cell()
            .store_slice(remainingBitmap)
            .store_zeroes(leadingOnes)
        .end_cell()
    );
}
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

(cell, tuple) preamble() impure inline {
    return (getContractStorage(), emptyActions());
}

() checkPermissions(int op, cell $md) impure inline {
    if (op == BaseInterface::OP::EVENT) {
        return ();
    } elseif (op == BaseInterface::OP::INITIALIZE) {
        assertOwner();
    } elseif (op == BaseInterface::OP::EMPTY) {
        return ();
    } else {
        _checkPermissions(op, $md);
    }
}
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
forall X -> tuple cons(X head, tuple tail) asm "CONS";

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list) asm "CAR";

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list) asm "CDR";

;;; Creates tuple with zero elements.
tuple empty_tuple() asm "NIL";

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x) asm "SINGLE";

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t) asm "UNSINGLE";

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t) asm "FIRST";

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t) asm "SECOND";

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t) asm "THIRD";

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t) asm "3 INDEX";

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";


;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null() asm "PUSHNULL";

;;; Moves a variable [x] to the top of the stack
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";



;;; Returns the current Unix time as an Integer
int now() asm "NOW";

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address() asm "MYADDR";

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance() asm "BALANCE";

;;; Returns the logical time of the current transaction.
int cur_lt() asm "LTIME";

;;; Returns the starting logical time of the current block.
int block_lt() asm "BLOCKLT";

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c) asm "HASHCU";

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s) asm "HASHSU";

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s) asm "SHA256U";

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
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

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
cell get_data() asm "c4 PUSH";

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
int min(int x, int y) asm "MIN";

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y) asm "MAX";

;;; Sorts two integers.
(int, int) minmax(int x, int y) asm "MINMAX";

;;; Computes the absolute value of an integer [x].
int abs(int x) asm "ABS";

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
slice begin_parse(cell c) asm "CTOS";

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";

;;; Preloads the first reference from the slice.
cell preload_ref(slice s) asm "PLDREF";

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
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDGRAMS";

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len) asm "SDCUTFIRST";

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len) asm "SDCUTLAST";

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";
(slice, ()) ~skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s) asm "PLDOPTREF";


;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c) asm "CDEPTH";


{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s) asm "SREFS";

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s) asm "SBITS";

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s) asm "SBITREFS";

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).
int slice_empty?(slice s) asm "SEMPTY";

;;; Checks whether `slice` [s] has no bits of data.
int slice_data_empty?(slice s) asm "SDEMPTY";

;;; Checks whether `slice` [s] has no references.
int slice_refs_empty?(slice s) asm "SREMPTY";

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s) asm "SDEPTH";

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b) asm "BREFS";

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b) asm "BBITS";

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b) asm "BDEPTH";

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://docs.ton.org/develop/func/statements#non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell() asm "NEWC";

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b) asm "ENDC";

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c) asm(c b) "STREF";

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";


;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s) asm "STSLICER";

;;; Stores (serializes) an integer [x] in the range `0..2^120 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_coins(builder b, int x) asm "STGRAMS";

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c) asm(c b) "STDICT";

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";


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
(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s) asm "PARSEMSGADDR";

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parseStdAddress(slice s) asm "REWRITESTDADDR";

;;; A variant of [parseStdAddress] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

{-
  # Dictionary primitives
-}


;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";

cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict() asm "NEWDICT";
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.
int dict_empty?(cell c) asm "DICTEMPTY";


{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x) asm "CONFIGOPTPARAM";
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.
int cell_null?(cell c) asm "ISNULL";

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
int random() impure asm "RANDU256";
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
int rand(int range) impure asm "RAND";
;;; Returns the current random seed as an unsigned 256-bit Integer.
int get_seed() impure asm "RANDSEED";
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b) asm "SDEQ";

;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/stringlib.fc

```fc
#include "utils.fc";

;;; ===============================STRING MANIPULATION FUNCTIONS===========================
;; note that these functions are NOT optimized and should NOT be used in production code

const int ASCII_ZERO = 48;
const int ASCII_MASK = 0x1313131313131313131313131313131313131313131313131313131313131313;
const int ASCII_A = 65;

slice str::asciiUint256ToStr(int asciiUint256) impure {
    int leading_zeroes = _SDCNTLEAD0(begin_cell().store_uint256(asciiUint256).end_cell().begin_parse());
    int trailing_bits = 256 - leading_zeroes;
    int mask = POW2(trailing_bits) - 1;
    return begin_cell().store_uint256(asciiUint256 | (ASCII_MASK & (~ mask))).end_cell().begin_parse();
}

(slice, ()) ~str::concat(slice self, slice other) impure {
    if(self.slice_bits() + other.slice_bits() > 127 * MAX_U8) {
        throwError("Cannot concatenate: string too long");
    }
    return (begin_cell().store_slice(self).store_slice(other).end_cell().begin_parse(), ());
}

slice str::concat(slice self, slice other) impure {
    self~str::concat(other);
    return self;
}

(slice, ()) ~str::concatInt(slice self, int val) impure {
    slice intSlice = empty_slice();
    if (val < 0) {
        self~str::concat("-");
        val = -1 * val;
    }
    if (val == 0) {
        intSlice~str::concat(begin_cell().store_uint8(ASCII_ZERO).end_cell().begin_parse());
    }
    while (val > 0) {
        intSlice = begin_cell().store_uint8(ASCII_ZERO + val % 10).end_cell().begin_parse().str::concat(intSlice);
        val /= 10;
    }
    return (self.str::concat(intSlice), ());
}

slice str::concatInt(slice self, int val) impure {
    self~str::concatInt(val);
    return self;
}

(slice, ()) ~str::concatHex(slice self, int val) impure {
    slice hexSlice = empty_slice();
    if (val == 0) {
        hexSlice~str::concat(begin_cell().store_uint8(ASCII_ZERO).end_cell().begin_parse());
    }
    while (val > 0) {
        if (val % 16 <= 9) {
            hexSlice = begin_cell().store_uint8(ASCII_ZERO + val % 16).end_cell().begin_parse().str::concat(hexSlice);
        } else {
            hexSlice = begin_cell().store_uint8(ASCII_A + val % 16 - 10).end_cell().begin_parse().str::concat(hexSlice);
        }
        val = (val >> 4); ;; val /= 16
    }
    return (self.str::concat(hexSlice), ());
}

slice str::concatHex(slice self, int val) impure {
    self~str::concatHex(val);
    return self;
}

() str::console::log<int>(slice string, int val) impure {
    ~strdump(string.str::concat(": ").str::concatInt(val));
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/txnContext.fc

```fc
#include "utils.fc";

global tuple txnContext;

const int _IS_BOUNCED = 0;
const int _CALLER = 1;
const int _FWD_FEE = 2;
const int _OPCODE = 3;
const int _QUERY_ID = 4;
const int _BALANCE = 5;
const int _MSG_VALUE = 6;
const int _BODY = 7;
const int _RAW_MSG = 8;
const int _ORIGIN = 9;
const int _DONATION_NANOS = 10;
const int _MD = 11;

int getMsgValue() impure inline {
    return txnContext.int_at(_MSG_VALUE);
}

int getOpcode() impure inline {
    return txnContext.int_at(_OPCODE);
}

int txnIsBounced() impure inline {
    return txnContext.int_at(_IS_BOUNCED);
}

int getContractBalance() impure inline {
    return txnContext.int_at(_BALANCE);
}

int getInitialContractBalance() impure inline {
    return getContractBalance() - getMsgValue();
}

int getCaller() impure inline {
    return txnContext.int_at(_CALLER);
}

int getOrigin() impure inline {
    return txnContext.int_at(_ORIGIN);
}

slice getOriginStd() impure inline {
    return hashpartToBasechainAddressStd(getOrigin());
}

int getDonationNanos() impure inline {
    return txnContext.int_at(_DONATION_NANOS);
}

() setDonationNanos(int nanos) impure inline {
    txnContext~tset(_DONATION_NANOS, nanos);
}

cell getMsgData() impure inline {
    return txnContext.cell_at(_MD);
}

() setOrigin(int newOrigin) impure inline {
    txnContext~tset(_ORIGIN, newOrigin);
}

;; returns if slice empty
;; if empty body, sets opcode=-1 & query_id=-1, so it cannot be faked
() initTxnContext(int myBalance, int msgValue, cell inMsgFull, slice inMsgBody) impure inline {
    slice cs = inMsgFull.begin_parse();
    int flags = cs~load_uint(4);

    int _is_bounced = false;
    if flags & 1 {
        _is_bounced = true;
        inMsgBody~skip_bits(32); ;; 0xFFFFFFFF
    }

    int opcode = -1;
    int query_id = -1;
    int donationNanos = 0;
    cell md = null();

    slice _sender_address = cs~load_msg_addr();
    cs~load_msg_addr();
    cs~load_coins();
    cs~skip_dict();
    cs~load_coins();
    int senderAddress = basechainAddressStdToHashpart(_sender_address);

    ;; by default, the origin is the sender address
    int origin = senderAddress;

    ;; the inMsgBody parsing is technically compatible with the reference jetton implementation
    ;; where donationNanos == the amount of tokens received
    ;; and and the origin will contain garbage data
    ifnot (inMsgBody.slice_empty?()) {
        opcode = inMsgBody~load_uint(32);
        query_id = inMsgBody~load_uint(64);
        donationNanos = inMsgBody~load_coins();
        ;; if the origin is explicitly overriden in the body, use that
        if (inMsgBody.slice_bits() >= 267) {
            origin = inMsgBody.preload_bits_offset(11, 256).preload_uint(256);
        }
        ifnot (inMsgBody.slice_refs_empty?()) {
            md = inMsgBody.preload_ref();
        }
    }

    txnContext = castToTuple([
        _is_bounced,
        senderAddress,
        muldiv(cs~load_coins(), 3, 2),
        opcode,
        query_id,
        myBalance,
        msgValue,
        inMsgBody, ;; could be an empty slice
        inMsgFull,
        origin,
        donationNanos,
        md
    ]);
}

(builder) beginTonMessage(int _opcode) asm "txnContext GETGLOB 4 INDEX SWAP NEWC 32 STU 64 STU";
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/funC++/utils.fc

```fc
#include "constants.fc";
#include "stdlib.fc";

const int ERROR::WrongWorkchain = 2047;

forall X -> tuple unsafeTuple(X x) asm "NOP";
(slice) as_slice(builder b) asm "ENDC CTOS";
(slice, int) load_uint8(slice s) asm "8 LDU SWAP";
(builder) store_uint8(builder b, int t) inline asm(t b) "8 STU";
(slice, int) load_uint16(slice s) asm "16 LDU SWAP";
(builder) store_uint16(builder b, int t) inline asm(t b) "16 STU";
(slice, int) load_uint32(slice s) asm "32 LDU SWAP";
(builder) store_uint32(builder b, int t) inline asm(t b) "32 STU";
(slice, int) load_uint64(slice s) asm "64 LDU SWAP";
(builder) store_uint64(builder b, int t) inline asm(t b) "64 STU";
(slice, int) load_uint128(slice s) asm "128 LDU SWAP";
(builder) store_uint128(builder b, int t) inline asm(t b) "128 STU";
(slice, int) load_uint256(slice s) asm "256 LDU SWAP";
(builder) store_uint256(builder b, int t) inline asm(t b) "256 STU";
forall X -> int   is_null(X x) asm "ISNULL";
forall X -> int   is_int(X x) asm "<{ TRY:<{ 0 PUSHINT ADD DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int   is_cell(X x) asm "<{ TRY:<{ CTOS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int   is_slice(X x) asm "<{ TRY:<{ SBITS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int   is_tuple(X x) asm "ISTUPLE";
forall X -> cell  cast_to_cell(X x) asm "NOP";
forall X -> slice cast_to_slice(X x) asm "NOP";
forall X -> int   cast_to_int(X x) asm "NOP";
forall X -> tuple cast_to_tuple(X x) asm "NOP";
(cell) my_code() asm "MYCODE";
(tuple) get_values() asm "INCOMINGVALUE";
int storage_fees() asm "STORAGEFEES";
(int, slice) ldones(slice s) asm "LDONES";

(int) get_gas_consumed() asm "GASCONSUMED";

builder store_zeroes(builder b, int x) asm "STZEROES";
builder store_ones(builder b, int x) asm "STONES";
cell preload_first_ref(slice s) asm "0 PLDREFIDX";
slice preload_bits_offset(slice s, int offset, int len) asm "SDSUBSTR";
(slice, int) load_bool(slice s) asm(-> 1 0) "1 LDI";
int preload_bool(slice s) asm "1 PUSHINT PLDIX";
(builder) store_bool(builder b, int v) asm(v b) "1 STI";
cell empty_cell() asm "<b b> PUSHREF";
forall X -> tuple tset(tuple t, int k, X x) asm(t x k) "SETINDEXVAR";
forall X -> (tuple, ()) ~tset(tuple t, int k, X x) asm(t x k) "SETINDEXVAR";
forall X -> (tuple, X) tpop(tuple t) asm "TPOP";
int tlen(tuple t) asm "TLEN";
int keccak256Builder(builder b) asm "1 PUSHINT HASHEXT_KECCAK256";

int cell_is_empty(cell c) impure inline {
    return c.cell_hash() == 68134197439415885698044414435951397869210496020759160419881882418413283430343;
}

int get_compute_fee(int workchain, int gas_used) asm(gas_used workchain) "GETGASFEE";
int get_storage_fee(int workchain, int seconds, int bits, int cells) asm(cells bits seconds workchain) "GETSTORAGEFEE";
int get_forward_fee(int workchain, int bits, int cells) asm(cells bits workchain) "GETFORWARDFEE";

int ilog4(int x) asm(x) "UBITSIZE 4 PUSHINT DIV";
cell preload_ref_at(slice s, int idx) inline asm "PLDREFVAR";
slice scutfirst(slice s, int bits, int refs) inline asm "SCUTFIRST";
slice scutlast(slice s, int bits, int refs) inline asm "SCUTLAST";
slice subslice(slice s, int start_bits, int start_refs, int bits, int refs) inline asm "SUBSLICE";
slice sskipfirst(slice s, int bits, int refs) inline asm "SSKIPFIRST";
slice sskiplast(slice s, int bits, int refs) inline asm "SSKIPLAST";
slice sdskipfirst(slice s, int bits) inline asm "SDSKIPFIRST";
forall X -> builder cast_to_builder(X x) inline asm "NOP";
int abs(int x) inline asm "ABS";
tuple self_balance() asm "BALANCE";

() throwError(slice reason) impure inline {
    ~strdump(reason);
    throw(reason.slice_hash() & ERRORCODE_MASK);
}

() throwErrorUnless(int condition, slice reason) impure inline {
    ifnot (condition) {
        throwError(reason);
    }
}
int _SDCNTLEAD0(slice x) asm "SDCNTLEAD0";
int POW2(int y) asm "POW2";

;; numCells, num_bits
(int, int) getContractStateSize(cell code, cell init_storage) impure inline {
    cell stateInit = begin_cell()
        .store_uint(6, 5)
        .store_ref(code)
        .store_ref(init_storage)
        .end_cell();
    (int cellsCount, int bitsCount, int success) = stateInit.compute_data_size(MAX_U16);
    throw_unless(8, success);
    return (cellsCount, bitsCount);
}

int calculateStorageFees(int cellsCount, int bitsCount, int timeDelta) impure inline {
    return get_storage_fee(BASECHAIN, timeDelta, bitsCount, cellsCount);
}

forall X -> tuple castToTuple(X x) asm "NOP";

slice empty_slice() asm "<b b> <s PUSHSLICE";

int treeShapeEqual(cell lhs, cell rhs) inline {
    slice lhsSlice = lhs.begin_parse();
    slice rhsSlice = rhs.begin_parse();
    (int lhsBits, int lhsRefs) = lhsSlice.slice_bits_refs();
    (int rhsBits, int rhsRefs) = rhsSlice.slice_bits_refs();
    if ((lhsBits != rhsBits) | (lhsRefs != rhsRefs)) {
        return false;
    }
    if (lhsRefs == 0) {
        return true;
    }
    int subtreeShapeEqual = true;
    int refIdx = 0;
    while (refIdx < lhsRefs) {
        subtreeShapeEqual &= treeShapeEqual(
            lhsSlice.preload_ref_at(refIdx),
            rhsSlice.preload_ref_at(refIdx)
        );
    }
    return subtreeShapeEqual;
}

int _globvarIsNull(int idx) impure asm "GETGLOBVAR ISNULL";

int _gasToNanoton(int gas) impure inline {
    return get_compute_fee(false, gas);
}

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
(int, int, int, int, int, int, int, int, int) parseGasLimitsPrices(int workchainId) impure {
    int configIdx = workchainId == BASECHAIN ? 21 : 20;
    (cell cfg, int success) = getConfigParam(configIdx);
    ifnot (success) {
        return (-1, -1, -1, -1, -1, -1, -1, -1, -1);
    }
    slice cfgSlice = cfg.begin_parse();
    ifnot (cfgSlice.slice_bits() >= 592) {
        return (-1, -1, -1, -1, -1, -1, -1, -1, -1);
    }

    if (
        (cfgSlice.preload_uint(8) != 0xd1)
        | (cfgSlice.preload_bits_offset(136, 8).preload_uint(8) != 0xde)
    ) {
        return (-1, -1, -1, -1, -1, -1, -1, -1, -1);
    }

    cfgSlice~load_uint8();
    int specialGasLimit = cfgSlice~load_uint64();
    int flatGasLimit = cfgSlice~load_uint64();
    int flatGasPrice = cfgSlice~load_uint64();
    cfgSlice~load_uint8();
    int gasPrice = cfgSlice~load_uint64();
    int gasLimit = cfgSlice~load_uint64();
    int gasCredit = cfgSlice~load_uint64();
    int blockGasLimit = cfgSlice~load_uint64();
    int freezeDueLimit = cfgSlice~load_uint64();
    int deleteDueLimit = cfgSlice~load_uint64();
    return (
        specialGasLimit,
        flatGasLimit,
        flatGasPrice,
        gasPrice,
        gasLimit,
        gasCredit,
        blockGasLimit,
        freezeDueLimit,
        deleteDueLimit
    );
}

;;; ====================== Address functions ======================
int basechainAddressStdToHashpart(slice full_address) impure inline {
    (int wc, int hp) = parseStdAddress(full_address);
    throw_if(ERROR::WrongWorkchain, wc != BASECHAIN);
    return hp;
}

slice hashpartToBasechainAddressStd(int hashpart) impure inline {
    return begin_cell()
        .store_uint(4, 3) ;; 0b100
        .store_int(BASECHAIN, 8)
        .store_uint(hashpart, 256)
        .as_slice();
}

int getContractAddress() impure inline {
    return my_address().preload_bits_offset(11, 256).preload_uint(256);
}

() setContractStorage(cell $obj) impure inline {
    set_data($obj);
}

cell getContractStorage() impure inline method_id {
    return get_data();
}

int getContractBalanceView(int futureSeconds) impure inline method_id {
    (int cellsCount, int bitsCount) = getContractStateSize(my_code(), getContractStorage());

    int ret = self_balance().int_at(0) - calculateStorageFees(cellsCount, bitsCount, futureSeconds);

    return max(0, ret);
}

int computeContractAddress(cell $storage, cell code) impure inline {
    return begin_cell()
        .store_uint(6, 5)
        .store_ref(code)
        .store_ref($storage)
        .end_cell()
        .cell_hash();
}

;; ============================== Optimization Functions ==============================

;; ========================== For Slices ==========================

int preloadBoolAt(slice self, int offset) impure inline {
    ;; bools should be returned as bools
    return self.preload_bits_offset(offset, 1).preload_bool();
}

int preloadUint8At(slice self, int offset) impure inline {
    return self.preload_bits_offset(offset, 8).preload_uint(8);
}

int preloadUint16At(slice self, int offset) impure inline {
    return self.preload_bits_offset(offset, 16).preload_uint(16);
}

int preloadUint32At(slice self, int offset) impure inline {
    return self.preload_bits_offset(offset, 32).preload_uint(32);
}

int preloadUint64At(slice self, int offset) impure inline {
    return self.preload_bits_offset(offset, 64).preload_uint(64);
}   

int preloadCoinsAt(slice self, int offset) impure inline {
    return self.preload_bits_offset(offset, 128).preload_uint(128);
}

int preloadUint256At(slice self, int offset) impure inline {
    return self.preload_bits_offset(offset, 256).preload_uint(256);
}

int preloadAddressAt(slice self, int offset) impure inline {
    return self.preloadUint256At(offset);
}

;; slice -> cell
cell preloadRefAt(slice self, int offset) impure inline {
    return self.preload_ref_at(offset);
}

;; slice -> slice
slice preloadRefSliceAt(slice self, int offset) impure inline {
    return self.preload_ref_at(offset).begin_parse();
}

;; ========================== For Cells ==========================

int cellPreloadBoolAt(cell self, int offset) impure inline {
    return self.begin_parse().preloadBoolAt(offset);
}

int cellPreloadUint8At(cell self, int offset) impure inline {
    return self.begin_parse().preloadUint8At(offset);
}

int cellPreloadUint16At(cell self, int offset) impure inline {
    return self.begin_parse().preloadUint16At(offset);
}

int cellPreloadUint32At(cell self, int offset) impure inline {
    return self.begin_parse().preloadUint32At(offset);
}

int cellPreloadUint64At(cell self, int offset) impure inline {
    return self.begin_parse().preloadUint64At(offset);
}

int cellPreloadCoinsAt(cell self, int offset) impure inline {
    return self.begin_parse().preloadCoinsAt(offset);
}

int cellPreloadUint256At(cell self, int offset) impure inline {
    return self.begin_parse().preloadUint256At(offset);
}

int cellPreloadAddressAt(cell self, int offset) impure inline {
    return self.cellPreloadUint256At(offset);
}

;; cell -> cell
cell cellPreloadRefAt(cell self, int offset) impure inline {
    return self.begin_parse().preloadRefAt(offset);
}

;; cell -> slice
slice cellPreloadRefSliceAt(cell self, int offset) impure inline {
    return self.begin_parse().preloadRefAt(offset).begin_parse();
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/protocol/channel/callbackOpcodes.fc

```fc
;; Send flow
const int Layerzero::OP::CHANNEL_SEND_CALLBACK = "Layerzero::OP::CHANNEL_SEND_CALLBACK"c;

;; Receive flow
const int Layerzero::OP::LZ_RECEIVE_PREPARE = "Layerzero::OP::LZ_RECEIVE_PREPARE"c;
const int Layerzero::OP::LZ_RECEIVE_EXECUTE = "Layerzero::OP::LZ_RECEIVE_EXECUTE"c;

;; Receive flow management
const int Layerzero::OP::BURN_CALLBACK = "Layerzero::OP::BURN_CALLBACK"c;
const int Layerzero::OP::NILIFY_CALLBACK = "Layerzero::OP::NILIFY_CALLBACK"c;
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

int _getEventSink() inline {
    return getOwner();
}

;;; ==========================HELPER FUNCTIONS=====================================

() _assertEqualPaths(cell $path1, cell $path2) impure inline {
    throw_unless(Channel::ERROR::wrongPath, $path1.cl::hash() == $path2.cl::hash());
}

;; @info The send request queue (Channel::sendRequestQueue) is a DeterministicInsertionCircularQueue
;; that stores a mapping from requestId => hash of LzSend object.
;; {_build, _read}SendRequestQueueEntry functions are helper functions that
;; serialize and deserialize the 256-bit hash that is stored in the DICQueue
cell _buildSendRequestQueueEntry(cell $lzSend) impure inline method_id {
    return begin_cell().store_uint256($lzSend.cl::hash()).end_cell();
}

int _readSendRequestQueueEntry(cell contents) impure inline method_id {
    if (contents.is_null()) {
        return 0;
    } elseif (contents.cell_is_empty()) {
        return 0;
    }
    return contents.begin_parse().preload_uint(256);
}

;; returns boolean committable, (packet or null)
(int, cell) _nonceCommittable(int incomingNonce) impure inline method_id {
    throw_if(Channel::ERROR::invalidNonce, incomingNonce <= 0);

    cell $storage = getContractStorage();

    cell $executePOOO = $storage.Channel::getExecutePOOO();
    int firstUnexecutedNonce = $executePOOO.POOO::getNextEmpty();

    (int actualKey, cell $packet, int status, int exists) = DeterministicInsertionCircularQueue::get(
        $storage.Channel::getExecutionQueue(),
        incomingNonce
    );

    if (
        (incomingNonce == firstUnexecutedNonce)
        & (actualKey == incomingNonce)
        & (status != ExecutionQueue::executing)
    ) {
        ;; short-circuit for efficiency in the common case
        return (true, exists ? $packet : null());
    }

    ;; condition 1 & 2: must be within the window
    ;; condition 3: must not be executing
    if (
        (incomingNonce >= firstUnexecutedNonce)
        & (incomingNonce <= POOO::maxSettableBit($executePOOO))
        & (status != ExecutionQueue::executing)
    ) {
        ;; this is nested because funC doesn't support short-circuiting boolean/bitwise ops
        ;; condition 4: must not be executed
        ifnot (POOO::isBitSet($executePOOO, incomingNonce)) {
            return (true, exists ? $packet : null());
        }
    }

    return (false, null());
}

;; returns boolean committable
int _optimizedNonceCommittable(cell $executePOOO, cell executionQueue, int incomingNonce) impure inline {
    throw_if(Channel::ERROR::invalidNonce, incomingNonce <= 0);

    int firstUnexecutedNonce = $executePOOO.POOO::getNextEmpty();

    (int actualKey, _, int status, int exists) = DeterministicInsertionCircularQueue::get(
        executionQueue,
        incomingNonce
    );

    ;; condition 1 & 2: must be within the window
    ;; condition 3: must not be executing
    if (
        (incomingNonce >= firstUnexecutedNonce)
        & (incomingNonce <= POOO::maxSettableBit($executePOOO))
        & (status != ExecutionQueue::executing)
    ) {
        ;; this is nested because funC doesn't support short-circuiting boolean/bitwise ops
        ;; condition 4: must not be executed
        ifnot (POOO::isBitSet($executePOOO, incomingNonce)) {
            return true;
        }
    }

    return false;
}

cell _getExecutablePacket(int incomingNonce) impure inline method_id {
    (int isCommittable, cell $packet) = _nonceCommittable(incomingNonce);
    int firstUncommittedNonce = getContractStorage()
        .Channel::getCommitPOOO()
        .POOO::getNextEmpty();

    throw_if(
        Channel::ERROR::notExecutable,
        ((~ isCommittable) | (incomingNonce >= firstUncommittedNonce) | $packet.is_null())
    );

    return $packet;
}

;;; ==========================VIEW FUNCTIONS=====================================

int _viewInboundNonce() impure method_id {
    return getContractStorage()
        .Channel::getCommitPOOO()
        .POOO::getNextEmpty() - 1;
}

int _viewExecutionStatus(int incomingNonce) impure method_id {
    cell $storage = getContractStorage();

    cell $executePOOO = $storage.cl::get<objRef>(Channel::executePOOO);
    int firstUnexecutedNonce = $executePOOO.cl::get<uint64>(POOO::nextEmpty);
    cell $commitPOOO = $storage.cl::get<objRef>(Channel::commitPOOO);
    int firstUncommittedNonce = $commitPOOO.cl::get<uint64>(POOO::nextEmpty);
    int inboundNonce = firstUncommittedNonce - 1;

    int executed = incomingNonce < firstUnexecutedNonce;
    if ((~ executed) & (incomingNonce < (firstUnexecutedNonce + MAX_CELL_BITS))) {
        executed = $executePOOO.POOO::isBitSet(incomingNonce);
    }

    int committed = incomingNonce < firstUncommittedNonce;
    if ((~ committed) & (incomingNonce < (firstUncommittedNonce + MAX_CELL_BITS))) {
        committed = $commitPOOO.POOO::isBitSet(incomingNonce);
    }

    ifnot (committed) {
        return ExecutionStatus::uncommitted;
    } elseif (executed) {
        return ExecutionStatus::executed;
    }

    (_, _, int status, _) = DeterministicInsertionCircularQueue::get(
        $storage.cl::get<cellRef>(Channel::executionQueue),
        incomingNonce
    );
    if (status == ExecutionQueue::executing) {
        return ExecutionStatus::executing;
    } elseif (incomingNonce <= inboundNonce) {
        return ExecutionStatus::executable;
    }
    return ExecutionStatus::committedNotExecutable;
}

;;; ================INTERFACE FUNCTIONS=====================

(cell, tuple) _initialize(cell $md) impure inline {
    (cell $storage, tuple actions) = preamble();
    cell $path = $storage.cl::get<objRef>(Channel::path);

    throw_if(
        Channel::ERROR::wrongPath,
        ($path.cl::get<uint32>(lz::Path::srcEid) == 0)
        | ($path.cl::get<address>(lz::Path::srcOApp) == NULLADDRESS)
        | ($path.cl::get<uint32>(lz::Path::dstEid) == 0)
        | ($path.cl::get<address>(lz::Path::dstOApp) == NULLADDRESS)
    );

    return (
        $storage
            .cl::set(Channel::executionQueue, DeterministicInsertionCircularQueue::create())
            .cl::set(Channel::sendRequestQueue, DeterministicInsertionCircularQueue::create()),
        actions
    );
}

;;; ================PERMISSION FUNCTIONS=====================

() _assertEndpoint() impure inline {
    throw_unless(
        Channel::ERROR::onlyEndpoint,
        getCaller() == getContractStorage().Channel::getEndpointAddress()
    );
}

;; this function is purposely designed to be maximally efficient when using a
;; custom configuration and less efficient when using a default configuration
() _assertSendMsglib(cell $mdMsglibSendCallback) impure inline {
    ;; Resolve the actual sendMsglib address at the time of request.
    ;; This function assumes the messagelib is not malicious or man-in-the-middle attacking,
    ;; as those cases are asserted in the handler itself.
    int sendMsglibAddress = $mdMsglibSendCallback
        .md::MsglibSendCallback::getLzSend()
        .md::LzSend::getSendMsglib();

    throw_unless(Channel::ERROR::onlyApprovedSendMsglib, getCaller() == sendMsglibAddress);
}

() _assertOApp() impure inline {
    throw_unless(
        Channel::ERROR::onlyOApp,
        getCaller() == getContractStorage()
            .Channel::getPath()
            .lz::Path::getSrcOApp()
    );
}

() _checkPermissions(int op, cell $md) impure inline {
    if (op == Channel::OP::LZ_RECEIVE_PREPARE) {
        ;; open and public calls
        return ();
    } elseif (
        (op == Channel::OP::CHANNEL_SEND)
        | (op == Channel::OP::CHANNEL_COMMIT_PACKET)
    ) {
        return _assertEndpoint();
    } elseif (op == Channel::OP::MSGLIB_SEND_CALLBACK) {
        return _assertSendMsglib($md);
    } elseif (
        (op == Channel::OP::LZ_RECEIVE_LOCK)
        | (op == Channel::OP::LZ_RECEIVE_EXECUTE_CALLBACK)
    ) {
        return _assertOApp();
    } elseif (op == Channel::OP::DEPOSIT_ZRO) {
        return assertOwner();
    } elseif (
        (op == Channel::OP::NOTIFY_PACKET_EXECUTED)
        | (op == Channel::OP::SYNC_MSGLIB_CONNECTION)
    ) {
        return ();
    } elseif (op == Channel::OP::SET_EP_CONFIG_OAPP) {
        return _assertEndpoint();
    } elseif (
        ;; Management functions are all gated by OApp
        (op == Channel::OP::NILIFY)
        | (op == Channel::OP::BURN)
        | (op == Channel::OP::FORCE_ABORT)
    ) {
       return _assertOApp();
    } elseif (op == Channel::OP::EMIT_LZ_RECEIVE_ALERT) {
        return ();
    } else {
        ;; we must put a check for all opcodes to make sure we don't
        ;; mistakenly miss an opp code's permissions
        throw(BaseInterface::ERROR::invalidOpcode);
    }
}

;;; ==========================HANDLERS=====================================

;; @in endpoint/handler.fc/setEpConfig
;; @out controller/handler.fc/emit_event
;; @md EpConfig
tuple setEpConfigOApp(cell $epConfigOApp) impure inline method_id {
    (cell $storage, tuple actions) = preamble();

    setContractStorage(
        $storage.cl::set(Channel::epConfigOApp, $epConfigOApp.lz::EpConfig::sanitize())
    );

    actions~pushAction<event>(Channel::event::EP_CFG_OAPP_SET, $epConfigOApp);
    return actions;
}

;;; ==========================================
;; Send flow
;; @in: endpoint/handler.fc/quote
;; @in_md: MdObj(lzSend, defaultEpConfig)
;; @out: msglib/handler.fc/quote
;; @out_md: $lzSend
tuple channelSend(cell $mdObj) impure inline method_id {
    (cell $storage, tuple actions) = preamble();

    (
        cell $lzSend, 
        cell $defaultSendEpConfig
    ) = $mdObj.md::MdObj::deserialize();

    ;; assert the size and structure of the incoming lzSend message
    lz::Packet::assertValidSendMessage(
        $lzSend.md::LzSend::getPacket()
    );

    (
        cell $epConfigOApp, 
        cell $sendPath, 
        cell sendRequestQueue, 
        int lastSendRequestId
    ) = $storage.Channel::getSendInformation();

    ;; Resolve the desired send msglib and send msglib connection
    (
        int isEpConfigNull,
        int sendMsglibManager,
        int sendMsglib, 
        int sendMsglibConnection
    ) = $epConfigOApp.lz::EpConfig::deserializeSendConfig();

    if (isEpConfigNull) {
        (sendMsglibManager, sendMsglib, sendMsglibConnection) = $defaultSendEpConfig.lz::SendEpConfig::deserialize();
    }

    if ((sendMsglibManager == NULLADDRESS) | (sendMsglib == NULLADDRESS) | (sendMsglibConnection == NULLADDRESS)) {
        actions~pushAction<call>(
            $sendPath.lz::Path::getSrcOApp(), ;; the OApp on this chain
            Layerzero::OP::CHANNEL_SEND_CALLBACK,
            md::MdObj::New(
                md::MessagingReceipt::New(
                    $lzSend,
                    0,
                    0,
                    Channel::ERROR::MsglibBlocked
                ),
                getInitialStorage()
            )
        );
        return actions;
    }

    ;; Each send request is assigned a unique request ID, which is also used as the key into
    ;; the sendRequestQueue
    int curRequestId = lastSendRequestId + 1;

    $lzSend = md::LzSend::fillRequestInfo(
        $lzSend, 
        curRequestId, 
        sendMsglibManager, 
        sendMsglib, 
        sendMsglibConnection
    );

    (_, _, _, int exists) = DeterministicInsertionCircularQueue::get(sendRequestQueue, curRequestId);
    ifnot (exists) {
        ;; submit to the msglib
        setContractStorage(
            $storage.Channel::setSendRequestQueueAndLastSendRequestId(
                curRequestId,
                DeterministicInsertionCircularQueue::set(
                    sendRequestQueue,
                    curRequestId,
                    _buildSendRequestQueueEntry($lzSend),
                    SendRequestQueue::sending
                )
            )
        );

        actions~pushAction<call>(
            sendMsglibConnection,
            MsglibConnection::OP::MSGLIB_CONNECTION_SEND,
            $lzSend
        );
    } else {
        ;; callback to the oApp with a failure and emit an event
        actions~pushAction<event>(Channel::ERROR::sendQueueCongested, $lzSend);
        actions~pushAction<call>(
            $sendPath.lz::Path::getSrcOApp(), ;; the OApp on this chain
            Layerzero::OP::CHANNEL_SEND_CALLBACK,
            md::MdObj::New(
                md::MessagingReceipt::New($lzSend, 0, 0, Channel::ERROR::sendQueueCongested),
                getInitialStorage()
            )
        );
    }

    return actions;
}

;; in: msglib/handler.fc/msglibSend
;; in_md: MsglibSendCallback
;; out: OApp/handler.fc/sendCallback
tuple msglibSendCallback(cell $mdMsglibSendCallback) impure inline method_id {
    (cell $storage, tuple actions) = preamble();

    (
        int errorCode,
        int nativeQuote,
        int zroQuote,
        cell $lzSend,
        cell serializedPayees,
        cell encodedPacket,
        int nonceByteOffset,
        int nonceBytes,
        int guidByteOffset,
        int guidBytes,
        cell $sendEvents
    ) = $mdMsglibSendCallback.md::MsglibSendCallback::deserialize();

    (
        int requestId,
        int lzSendNativeFee,
        int lzSendZroFee,
        cell $extraOptions,
        cell $enforceOptions,
        int sendMsglibManager
    ) = $lzSend.md::LzSend::deserializeSendCallback();

    (
        cell sendRequestQueue,
        int zroBalance,
        cell $sendPath,
        int outboundNonce
    ) = $storage.Channel::getSendCallbackInformation();

    ;; Read the requestId from the sendRequestQueue to ensure this send request is genuine
    ;; and is not being double-executed
    (_, cell contents, _, int exists) = DeterministicInsertionCircularQueue::get(
        sendRequestQueue,
        requestId
    );

    if (exists) {
        if (_readSendRequestQueueEntry(contents) == $lzSend.cl::hash()) {
            $storage = $storage.Channel::setSendRequestQueue(
                DeterministicInsertionCircularQueue::delete(sendRequestQueue, requestId)
            );
        } else {
            ;; See below comment, this else case is logically the same as the below else block,
            ;; but needs to be split due to lack of short-circuiting boolean expressions in funC
            return actions;
        }
    } else {
        ;; if the send request doesn't exist, there are two cases
        ;; 1. a legitimate request was frontrun by a force-abort
        ;;  in this case, we can safely refund all the funds to the origin
        ;; 2. a malicious MITM attack by ULN
        ;;  in this case, we can't refund the funds, but we can still emit an event

        ;; This technically silently reverts, by not processing any output actions,
        ;; thus providing a refund, instead of hard reverting
        return actions;
    }

    ;; verify that cumulative fees quoted by the msglib <= the fee cap specified by the user/app
    if (lzSendNativeFee < nativeQuote) {
        errorCode = Channel::ERROR::notEnoughNative;
    }
    if (lzSendZroFee < zroQuote) {
        errorCode = Channel::ERROR::notEnoughZroToken;
    }

    ;; Verify that the ZRO token credits in the Channel is sufficient to cover the
    ;; quoted ZRO cost of the message.
    if (zroBalance < zroQuote) {
        errorCode = Channel::ERROR::notEnoughZroTokenBalance;
    }

    int packetGuid = 0;
    int packetNonce = 0;

    if (errorCode == Channel::NO_ERROR) {
        ;; Assign a nonce to the packet and calculate the resulting GUID
        packetNonce = outboundNonce + 1;
        packetGuid = lz::Packet::calculateGuid($sendPath, packetNonce);

        ;; native payments
        tuple payees = deserializePayees(serializedPayees);

        ;; If the TON message does not contain sufficient value to perform the payments,
        ;; the transaction will revert and the send channel will eventually get blocked.
        ;; It is the responsibility of the OApp to assert sufficient gas + value to cover the
        ;; entire transaction and avoid this failure.
        repeat (payees.tlen()) {
            [int payeeAddress, int nativeAmount] = payees~tpopPayee();
            actions~pushAction<payment>(payeeAddress, nativeAmount, 0);
        }

        ;; Due to asynchrony between the Msglib and the Channel, the nonce and guid
        ;; cannot be ... ?

        cell completedEncodedPacket = null();

        if (guidByteOffset > nonceByteOffset) {
            completedEncodedPacket = encodedPacket
                .lz::Packet::replaceTwoFieldsAtOffsets(
                    packetNonce,
                    nonceByteOffset,
                    nonceBytes,
                    packetGuid,
                    guidByteOffset,
                    guidBytes
                );
        } else {
            completedEncodedPacket = encodedPacket
                .lz::Packet::replaceTwoFieldsAtOffsets(
                    packetGuid,
                    guidByteOffset,
                    guidBytes,
                    packetNonce,
                    nonceByteOffset,
                    nonceBytes
                );
        }

        actions~pushAction<event>(
            Channel::event::PACKET_SENT,
            md::PacketSent::build(
                nativeQuote,
                zroQuote,
                $extraOptions,
                $enforceOptions,
                completedEncodedPacket,
                packetNonce,
                sendMsglibManager,
                $sendEvents
            )
        );

        $storage = $storage.Channel::setOutboundNonceAndZroBalance(
            packetNonce,
            zroBalance - zroQuote
        );
    }

    ;; If the quote was unsuccessful, delete the hash from storage to prevent hol blocking
    ;; If the quote was successful, additionally update the ZRO balance and outbound nonce
    setContractStorage($storage);

    actions~pushAction<call>(
        $sendPath.lz::Path::getSrcOApp(), ;; the OApp on this chain
        Layerzero::OP::CHANNEL_SEND_CALLBACK,
        md::MdObj::build(
            md::MessagingReceipt::build(
                $lzSend.md::LzSend::setPacketNonceAndGuid(packetNonce, packetGuid),
                nativeQuote,
                zroQuote,
                errorCode
            ),
            getInitialStorage()
        )
    );

    return actions;
}

;;; ==========================================
;; Receive flow
;; @in     endpoint/handler.fc/verify
;; @in_md  ExtendedMd(msglibConnectionAddress, defaultEpConfig, verify)
;; @out    packet_receive/handler.fc/verify
;; @out_md ExtendedMd(msglib_addr, _, verify)
;; @out    controller/handler.fc/emit_event
tuple channelCommitPacket(cell $mdExtended) impure inline method_id {
    (cell $storage, tuple actions) = preamble();

    cell $sanitizeMdExtended = $mdExtended.md::ExtendedMd::sanitize();

    (
        cell $packet,
        int callerMsglibConnectionAddress
    ) = $sanitizeMdExtended.md::ExtendedMd::getMdAndForwardingAddress();
    ;; assert the size of the incoming packet
    lz::Packet::assertValidReceiveMessage($packet);

    (
        cell $epConfigOApp,
        cell $commitPOOO,
        cell $executePOOO,
        cell executionQueue
    ) = $storage.Channel::getCommitPacketInformation();

    (
        int useDefaults,
        int receiveMsglibConnection
    ) = $epConfigOApp.lz::EpConfig::deserializeReceiveConfig();

    if (useDefaults) {
        cell $defaultConfig = $sanitizeMdExtended.md::ExtendedMd::getObj();
        receiveMsglibConnection = $defaultConfig.lz::ReceiveEpConfig::getReceiveMsglibConnection();
    }

    if (receiveMsglibConnection != callerMsglibConnectionAddress) {
        ;; grossly inefficient, but this will (almost) never happen
        ;; so we can optimize the happy path by isolating this logic into this block
        cell $defaultConfig = $sanitizeMdExtended.cl::get<objRef>(md::MdObj::obj);
        int timeoutReceiveMsglibConnection = useDefaults
            ? $defaultConfig.cl::get<address>(lz::ReceiveEpConfig::timeoutReceiveMsglibConnection)
            : $epConfigOApp.cl::get<address>(lz::EpConfig::timeoutReceiveMsglibConnection);

        int expiry = useDefaults
            ? $defaultConfig.cl::get<uint64>(lz::ReceiveEpConfig::expiry)
            : $epConfigOApp.cl::get<uint64>(lz::EpConfig::timeoutReceiveMsglibExpiry);

        if ((timeoutReceiveMsglibConnection != callerMsglibConnectionAddress) | (expiry < now())) {
            throw(Channel::ERROR::onlyApprovedReceiveMsglib);
        }
    }

    int incomingNonce = $packet.lz::Packet::getNonce();

    int isCommittable = _optimizedNonceCommittable(
        $executePOOO,
        executionQueue,
        incomingNonce
    );

    if (isCommittable) {
        setContractStorage(
            $storage
                .Channel::setCommitPOOOAndExecutionQueue(
                    POOO::set($commitPOOO, incomingNonce),
                    DeterministicInsertionCircularQueue::set(
                        executionQueue,
                        incomingNonce,
                        $packet,
                        ExecutionQueue::committed
                    )
                )
        );
        actions~pushAction<event>(Channel::event::PACKET_COMMITTED, $packet);
    }

    if (incomingNonce <= POOO::maxSettableBit($executePOOO)) {
        ;; Cannot respond back to msglib if the packet is not currently committable but
        ;; will be committable in the future
        ;; Caveat: if the packet is currently executing, we treat it as uncommittable.
        ;; There exists a race condition where a uncommitted re-committable packet
        ;; can be marked as committed. If the packet needs to be re-committed for a good reason
        ;; (e.g., malicious DVN), the OApp owner must first nilify the packet

        actions~pushAction<call>(
            callerMsglibConnectionAddress,
            MsglibConnection::OP::MSGLIB_CONNECTION_COMMIT_PACKET_CALLBACK,
            md::ChannelNonceInfo::New(
                incomingNonce,
                $storage.Channel::getExecutePOOO().POOO::getNextEmpty()
            )
        );
    }

    return actions;
}

;;; ==========================================
;; Execution step 1
;; @in_opcode Channel::OP::LZ_RECEIVE_PREPARE
;; @in_from (external in) permissionless
;; @in_md nonce
;; @out_opcode Layerzero::OP::LZ_RECEIVE_PREPARE
;; @out_to srcOApp
;; @out_md ExtendedMd(md=packetId, obj=channel_init_state, forwarding_addr=NULLADDRESS)
;; @permissions: permissonless
tuple lzReceivePrepare(cell $lzReceivePrepareMd) impure inline method_id {
    (cell $storage, tuple actions) = preamble();

    (int nonce, int nanotons) = $lzReceivePrepareMd.md::LzReceivePrepare::deserialize();

    ;; extract oApp from path
    actions~pushAction<dispatch>(
        $storage.Channel::getPath().lz::Path::getSrcOApp(), ;; the OApp on this chain
        Layerzero::OP::LZ_RECEIVE_PREPARE,
        ;; Throws if the Packet is not executable
        _getExecutablePacket(nonce),
        nanotons
    );

    return actions;
}

;; @in_opcode Channel::OP::LZ_RECEIVE_LOCK
;; @in_from oApp
;; @in_md nonce
;; @out_opcode Layerzero::OP::LZ_RECEIVE_EXECUTE
;; @out_to oApp
;; @out_md ExtendedMd(md=Packet, obj=channel_init_state, forwarding_addr=NULLADDRESS)
;; @permissions: only oApp
tuple lzReceiveLock(cell $nonceMd) impure inline method_id {
    (cell $storage, tuple actions) = preamble();

    int incomingNonce = $nonceMd.md::Nonce::getNonce();
    throw_if(Channel::ERROR::invalidNonce, incomingNonce <= 0);

    (
        cell executionQueue,
        cell $commitPOOO,
        cell $sendPath
    ) = $storage.Channel::getLzReceiveLockInformation();

    (int actualKey, cell $packet, int status, _) = DeterministicInsertionCircularQueue::get(
        executionQueue,
        incomingNonce
    );

    int firstUncommittedNonce = $commitPOOO.POOO::getNextEmpty();

    ;; executable if present and all preceding nonces are committed, executing, or executed
    if (
        (actualKey == incomingNonce)
        & (status == ExecutionQueue::committed)
        & (incomingNonce < firstUncommittedNonce)
    ) {
        ;; set state to executing
        setContractStorage(
            $storage.Channel::setExecutionQueue(
                DeterministicInsertionCircularQueue::set(
                    executionQueue,
                    incomingNonce,
                    $packet,
                    ExecutionQueue::executing
                )
            )
        );

        actions~pushAction<call>(
            $sendPath.lz::Path::getSrcOApp(), ;; the OApp on this chain
            Layerzero::OP::LZ_RECEIVE_EXECUTE,
            md::MdObj::build($packet, getInitialStorage())
        );
    } else {
        actions~pushAction<event>(
            Channel::event::NOT_EXECUTABLE,
            md::PacketId::New(
                $sendPath.lz::Path::reverse(), ;; emit the receive path 
                incomingNonce
            )
        );
    }

    return actions;
}

;; @in_opcode Channel::OP::LZ_RECEIVE_EXECUTE_CALLBACK
;; @in_from oApp
;; @in_md LzReceiveStatus
;; @out_opcode OP::PACKET_RECEIVE_DESTROYED_CALLBACK
;; @out_to oApp
;; @out_md ExtendedMd(md=packetId, obj=pr_init_state, forwarding_addr=address_std_hashpart_null())
;; @failure => unlock the Packet
;; @success => destroy the Packet and refund rent
;; @permissions: only oApp
tuple lzReceiveExecuteCallback(cell $lzReceiveStatus) impure inline method_id {
    (cell $storage, tuple actions) = preamble();

    (
        int lzReceiveSuccess, 
        int packetNonce
    ) = $lzReceiveStatus.md::LzReceiveStatus::getSuccessAndNonce();

    (
        cell $executePOOO, 
        cell executionQueue, 
        cell $sendPath
    ) = $storage.Channel::getExecutePOOOAndExecutionQueueAndPath();

    (int actualKey, cell $packet, int status, _) = DeterministicInsertionCircularQueue::get(
        executionQueue,
        packetNonce
    );

    throw_unless(
        Channel::ERROR::notExecuting,
        (actualKey == packetNonce) & (status == ExecutionQueue::executing)
    );

    ;; check for success/failure
    if (lzReceiveSuccess) {
        executionQueue = DeterministicInsertionCircularQueue::delete(executionQueue, packetNonce);

        $storage = $storage.Channel::setExecutePOOO(
            POOO::set($executePOOO, packetNonce)
        );

        ;; emit Packet in the manager
        actions~pushAction<event>(
            Channel::event::DELIVERED,
            md::PacketId::build(
                $sendPath.lz::Path::optimizedReverse(), ;; emit the receive path
                packetNonce
            )
        );
    } else {
        executionQueue = DeterministicInsertionCircularQueue::set(
            executionQueue,
            packetNonce,
            $packet, ;; same packet object that we extracted from the queue
            ExecutionQueue::committed
        );

        ;; emit Packet so we know its unlocked
        actions~pushAction<event>(
            Channel::event::LZ_RECEIVE_ALERT,
            md::LzReceiveStatus::NewFull(
                false,
                packetNonce, ;; unforgeable
                $lzReceiveStatus.cl::get<coins>(md::LzReceiveStatus::value), ;; can be arbitrary/unsafe
                $lzReceiveStatus.cl::get<cellRef>(md::LzReceiveStatus::extraData), ;; can be arbitrary/unsafe
                $lzReceiveStatus.cl::get<cellRef>(md::LzReceiveStatus::reason), ;; can be arbitrary/unsafe
                getOrigin(), ;; unforgeable
                $packet, ;; unforgeable
                ExecutionStatus::executable
            )
        );
    }

    setContractStorage($storage.Channel::setExecutionQueue(executionQueue));

    return actions;
}

;;; ====================== Management Helper ===================================
() _commitFakePacket(cell $storage, int nonce, cell $receivePath) impure inline method_id {
    cell $mockPacket = lz::Packet::New($receivePath, empty_cell(), nonce);

    ;; Because this is not originating from the endpoint, we dont have the defaults
    ;; Actual defaults and the msglib address arent required because the call is direct from the OApp
    cell $mockEpConfigDefaults = lz::ReceiveEpConfig::New(
        0xdeadbeef, ;; any non-null dummy value for the receive msglib connection address
        NULLADDRESS, ;; timeout never has to be used for burn
        0 ;; as above, timeout never has to be used for burn
    );
    cell $epConfigOApp = $storage.cl::get<objRef>(Channel::epConfigOApp);

    ;; Step 1: Commit the 'mockPacket'
    ;; This is safe because we are going to do the following steps (2 and 3) atomically.
    ;; channelCommitPacket will not revert if the packet is not committed, but lzReceiveLock will.
    ;; Basically lying to channelCommitPacket to say the "correct" msglib is committing
    channelCommitPacket(
        md::ExtendedMd::New(
            $mockPacket,
            $mockEpConfigDefaults, ;; this is completely ignored if useDefaults is false
            $epConfigOApp.cl::get<bool>(lz::EpConfig::isNull)
                ? $mockEpConfigDefaults.cl::get<address>(lz::ReceiveEpConfig::receiveMsglibConnection)
                : $epConfigOApp.cl::get<address>(lz::EpConfig::receiveMsglibConnection)
        )
    );
}

;; @permissions only-oApp
tuple nilify(cell $packetId) impure inline method_id {
    (cell $storage, tuple actions) = preamble();
    $packetId = $packetId.md::PacketId::sanitize();

    ;; reverse the path because this is from a receive perspective
    cell $receivePath = $storage.Channel::getPath().lz::Path::reverse();
    _assertEqualPaths($receivePath, $packetId.cl::get<objRef>(md::PacketId::path));

    int incomingNonce = $packetId.cl::get<uint64>(md::PacketId::nonce);

    (int isCommittable, cell $previousPacket) = _nonceCommittable(incomingNonce);
    throw_unless(Channel::ERROR::notCommittable, isCommittable);

    _commitFakePacket($storage, incomingNonce, $receivePath);
    
    setContractStorage(
        getContractStorage().cl::set(
            Channel::executionQueue,
            DeterministicInsertionCircularQueue::delete(
                $storage.Channel::getExecutionQueue(),
                incomingNonce
            )
        )
    );

    if ($previousPacket.is_null()) {
        $previousPacket = lz::Packet::New($receivePath, empty_cell(), incomingNonce);
    }
    actions~pushAction<event>(Channel::event::PACKET_NILIFIED, $previousPacket);

    actions~pushAction<call>(
        $receivePath.cl::get<address>(lz::Path::dstOApp), ;; the OApp on this chain
        Layerzero::OP::NILIFY_CALLBACK,
        md::MdObj::build($packetId, getInitialStorage())
    );

    return actions;
}

tuple burn(cell $packetId) impure inline method_id {
    (cell $storage, tuple actions) = preamble();
    cell $packetId = $packetId.md::PacketId::sanitize();

    ;; reverse the path because this is from a receive perspective
    cell $receivePath = $storage.Channel::getPath().lz::Path::reverse();
    _assertEqualPaths($receivePath, $packetId.cl::get<objRef>(md::PacketId::path));

    int nonce = $packetId.cl::get<uint64>(md::PacketId::nonce);

    cell $nonceMd = md::Nonce::New(nonce);

    (_, cell $previousPacket) = _nonceCommittable(nonce);

    ;; Step 1: Commit a 'mockPacket' to be used when we 'burn' this nonce
    _commitFakePacket($storage, nonce, $receivePath);
    
    ;; Step 2: Put the packet into 'executing'
    lzReceiveLock($nonceMd);
    ;; Step 3: Mock the lzReceiveExecuteCallback, which marks/flags that given nonce as used and 'executed'
    lzReceiveExecuteCallback(md::LzReceiveStatus::New(true, nonce));


    if ($previousPacket.is_null()) {
        $previousPacket = lz::Packet::New($receivePath, empty_cell(), nonce);
    }

    ;; Emit an event so we are able to observe offchain that this nonce has been 'burned'
    actions~pushAction<event>(
        Channel::event::PACKET_BURNED,
        $previousPacket
    );

    actions~pushAction<call>(
        $receivePath.cl::get<address>(lz::Path::dstOApp), ;; the OApp on this chain
        Layerzero::OP::BURN_CALLBACK,
        md::MdObj::build(
            md::PacketId::New($receivePath, nonce),
            getInitialStorage()
        )
    );

    return actions;
}

;;; ==========================================
;; ZRO management
;; only controller
tuple depositZro(cell $coinsAmount) impure inline method_id {
    (cell $storage, tuple actions) = preamble();

    cell $sanitizedCoinsAmount = $coinsAmount.md::CoinsAmount::sanitize();

    setContractStorage(
        $storage.cl::set(
            Channel::zroBalance,
            $storage.Channel::getZroBalance()
            + $sanitizedCoinsAmount.cl::get<coins>(md::CoinsAmount::amount)
        )
    );

   actions~pushAction<event>(Channel::event::ZRO_DEPOSITED, $sanitizedCoinsAmount);
    
    return actions;
}

;; Attempt to abort a send request. Check if hash still present, if present delete and send
;; @in: oApp
;; @in_opcode Channel::OP::FORCE_ABORT
;; @in_md lzSend
;; @out_opcode
;; @out_to oApp
;; @out_md lzSend
;; @permissions: only oApp
tuple forceAbort(cell $lzSend) impure inline method_id {
    (cell $storage, tuple actions) = preamble();

    cell $sendPath = $storage.cl::get<objRef>(Channel::path);
    ;; $lzSend does not need to be sanitized, as it must be correct to match
    ;; the stored hash
    _assertEqualPaths(
        $sendPath,
        $lzSend.md::LzSend::getPath()
    );

    int requestId = $lzSend.md::LzSend::getSendRequestId();

    cell sendRequestQueue = $storage.cl::get<cellRef>(Channel::sendRequestQueue);

    (_, cell request, int status, _) = DeterministicInsertionCircularQueue::get(sendRequestQueue, requestId);

    throw_if(
        Channel::ERROR::cannotAbortSend,
        (status != SendRequestQueue::sending) | (_readSendRequestQueueEntry(request) != $lzSend.cl::hash())
    );

    ;; delete the reservation and update the storage
    setContractStorage(
        $storage.cl::set(
            Channel::sendRequestQueue,
            DeterministicInsertionCircularQueue::delete(sendRequestQueue, requestId)
        )
    );

    actions~pushAction<call>(
        $sendPath.cl::get<address>(lz::Path::srcOApp), ;; the OApp on this chain
        Layerzero::OP::CHANNEL_SEND_CALLBACK,
        md::MdObj::New(
            md::MessagingReceipt::New($lzSend, 0, 0, Channel::ERROR::sendAborted),
            getInitialStorage()
        )
    );

    return actions;
}

;; Send the current state of the channel to the MsglibConnection
;; @in: permissionless
;; @in_opcode Channel::OP::MSGLIB_CONNECTION_SYNC_CHANNEL_STATE
;; @in_md mdAddress ( MsglibConnectionAddress, Path )
tuple syncMsglibConnection(cell $mdAddress) impure inline method_id {
    (cell $storage, tuple actions) = preamble();

    cell $sanitizedMdAddress = $mdAddress.md::MdAddress::sanitize();

    actions~pushAction<call>(
        $sanitizedMdAddress.cl::get<address>(md::MdAddress::address), ;; msglibConnectionAddress
        MsglibConnection::OP::MSGLIB_CONNECTION_SYNC_CHANNEL_STATE,
        md::MdObj::New(
            md::ChannelNonceInfo::New(
                $storage
                    .cl::get<objRef>(Channel::commitPOOO)
                    .cl::get<uint64>(POOO::nextEmpty),
                $storage
                    .cl::get<objRef>(Channel::executePOOO)
                    .cl::get<uint64>(POOO::nextEmpty)
            ),
            getInitialStorage()
        )
    );

    return actions;
}

tuple notifyPacketExecuted(cell $mdAddress) impure inline method_id {
    (cell $storage, tuple actions) = preamble();

    cell $sanitizedMdAddress = $mdAddress.md::MdAddress::sanitize();
    cell $sanitizedNonceMd = $sanitizedMdAddress
        .cl::get<objRef>(md::MdAddress::md)
        .md::Nonce::sanitize();

    int executionStatus = _viewExecutionStatus($sanitizedNonceMd.cl::get<uint64>(md::Nonce::nonce));

    if (executionStatus != ExecutionStatus::executed) {
        return actions;
    }

    actions~pushAction<call>(
        $sanitizedMdAddress.cl::get<address>(md::MdAddress::address),
        MsglibConnection::OP::MSGLIB_CONNECTION_COMMIT_PACKET_CALLBACK,
        md::ChannelNonceInfo::New(
            $sanitizedNonceMd.cl::get<uint64>(md::Nonce::nonce),
            $storage.cl::get<objRef>(Channel::executePOOO).cl::get<uint64>(POOO::nextEmpty)
        )
    );

    return actions;
}

tuple emitLzReceiveAlert(cell $lzReceiveStatus) impure inline method_id {
    (cell $storage, tuple actions) = preamble();

    cell $saniztizedLzReceiveStatus = $lzReceiveStatus.md::LzReceiveStatus::NewFull::sanitize();

    int nonce = $saniztizedLzReceiveStatus.cl::get<uint64>(md::LzReceiveStatus::nonce);
    throw_if(Channel::ERROR::invalidNonce, nonce == 0);
    
    (int actualNonce, cell $packet, _, int exists) = DeterministicInsertionCircularQueue::get(
        $storage.Channel::getExecutionQueue(),
        nonce
    );

    throw_unless(
        Channel::ERROR::invalidNonce,
        (actualNonce == nonce) & (exists)
    );

    actions~pushAction<event>(
        Channel::event::LZ_RECEIVE_ALERT,
        md::LzReceiveStatus::NewFull(
            $saniztizedLzReceiveStatus.cl::get<bool>(md::LzReceiveStatus::success),
            nonce,
            $saniztizedLzReceiveStatus.cl::get<coins>(md::LzReceiveStatus::value),
            $saniztizedLzReceiveStatus.cl::get<cellRef>(md::LzReceiveStatus::extraData),
            $saniztizedLzReceiveStatus.cl::get<cellRef>(md::LzReceiveStatus::reason),
            getCaller(),
            $packet,
            _viewExecutionStatus(nonce)
        )
    );
    return actions;
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/protocol/channel/interface.fc

```fc
#include "callbackOpcodes.fc";

;; Opcodes
const int Channel::OP::SET_EP_CONFIG_OAPP = "Channel::OP::SET_EP_CONFIG_OAPP"c;
const int Channel::OP::MSGLIB_SEND_CALLBACK = "Channel::OP::MSGLIB_SEND_CALLBACK"c;
const int Channel::OP::CHANNEL_SEND = "Channel::OP::CHANNEL_SEND"c;
const int Channel::OP::CHANNEL_COMMIT_PACKET = "Channel::OP::CHANNEL_COMMIT_PACKET"c;
const int Channel::OP::LZ_RECEIVE_PREPARE = "Channel::OP::LZ_RECEIVE_PREPARE"c;
const int Channel::OP::DEPOSIT_ZRO = "Channel::OP::DEPOSIT_ZRO"c;
const int Channel::OP::NILIFY = "Channel::OP::NILIFY"c;
const int Channel::OP::BURN = "Channel::OP::BURN"c;
const int Channel::OP::FORCE_ABORT = "Channel::OP::FORCE_ABORT"c;
const int Channel::OP::LZ_RECEIVE_LOCK = "Channel::OP::LZ_RECEIVE_LOCK"c;
const int Channel::OP::SYNC_MSGLIB_CONNECTION = "Channel::OP::SYNC_MSGLIB_CONNECTION"c;
const int Channel::OP::LZ_RECEIVE_EXECUTE_CALLBACK = "Channel::OP::LZ_RECEIVE_EXECUTE_CALLBACK"c;
const int Channel::OP::NOTIFY_PACKET_EXECUTED = "Channel::OP::NOTIFY_PACKET_EXECUTED"c;
const int Channel::OP::EMIT_LZ_RECEIVE_ALERT = "Channel::OP::EMIT_LZ_RECEIVE_ALERT"c;

;; EVENTS
const int Channel::event::EP_CFG_OAPP_SET = "Channel::event::EP_CFG_OAPP_SET"u;
const int Channel::event::PACKET_SENT = "Channel::event::PACKET_SENT"u;
const int Channel::event::PACKET_COMMITTED = "Channel::event::PACKET_COMMITTED"u;
const int Channel::event::PACKET_NILIFIED = "Channel::event::PACKET_NILIFIED"u;
const int Channel::event::PACKET_BURNED = "Channel::event::PACKET_BURNED"u;
const int Channel::event::DELIVERED = "Channel::event::DELIVERED"u;
const int Channel::event::LZ_RECEIVE_ALERT = "Channel::event::LZ_RECEIVE_ALERT"u;
const int Channel::event::NOT_EXECUTABLE = "Channel::event::NOT_EXECUTABLE"u;
const int Channel::event::ZRO_DEPOSITED = "Channel::event::ZRO_DEPOSITED"u;

;; ERRORS
const int Channel::ERROR::onlyEndpoint = 129;
const int Channel::ERROR::onlyOApp = 130;
const int Channel::ERROR::onlyApprovedSendMsglib = 131;
const int Channel::ERROR::onlyApprovedReceiveMsglib = 132;
const int Channel::ERROR::invalidNonce = 133;
const int Channel::ERROR::cannotAbortSend = 134;
const int Channel::ERROR::sendAborted = 135;
const int Channel::ERROR::notEnoughNative = 136;
const int Channel::ERROR::notEnoughZroToken = 137;
const int Channel::ERROR::sendQueueCongested = 138;
const int Channel::ERROR::notEnoughZroTokenBalance = 139;
const int Channel::ERROR::notCommittable = 140;
const int Channel::ERROR::notExecutable = 141;
const int Channel::ERROR::notExecuting = 142;
const int Channel::ERROR::wrongPath = 143;
const int Channel::ERROR::MsglibBlocked = 144;
const int Channel::NO_ERROR = 0;

;; States for view function and packet executability management
const int ExecutionStatus::uncommitted = 0;
const int ExecutionStatus::committedNotExecutable = 1;
const int ExecutionStatus::executable = 2;
const int ExecutionStatus::executed = 3;
const int ExecutionStatus::executing = 4; ;; new state
const int ExecutionStatus::committed = 8; ;; only used internally

const int ExecutionQueue::uncommitted = 0;
const int ExecutionQueue::executing = 1;
const int ExecutionQueue::committed = 2;

const int SendRequestQueue::sending = 1;
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/protocol/channel/main.fc

```fc
#include "../core/abstract/protocolMain.fc";

#include "handler.fc";
#include "interface.fc";

tuple _executeOpcode(int op, cell $md) impure inline {
    if (op == Channel::OP::SET_EP_CONFIG_OAPP) {
        return setEpConfigOApp($md);
    } elseif (op == Channel::OP::CHANNEL_SEND) {
        return channelSend($md);
    } elseif (op == Channel::OP::MSGLIB_SEND_CALLBACK) {
        return msglibSendCallback($md);
    } elseif (op == Channel::OP::CHANNEL_COMMIT_PACKET) {
        return channelCommitPacket($md);
    } elseif (op == Channel::OP::LZ_RECEIVE_PREPARE) {
        return lzReceivePrepare($md);
    } elseif (op == Channel::OP::LZ_RECEIVE_LOCK) {
        return lzReceiveLock($md);
    } elseif (op == Channel::OP::LZ_RECEIVE_EXECUTE_CALLBACK) {
        return lzReceiveExecuteCallback($md);
    } elseif (op == Channel::OP::DEPOSIT_ZRO) {
        return depositZro($md);
    } elseif (op == Channel::OP::NILIFY) {
        return nilify($md);
    } elseif (op == Channel::OP::BURN) {
        return burn($md);
    } elseif (op == Channel::OP::FORCE_ABORT) {
        return forceAbort($md);
    } elseif (op == Channel::OP::SYNC_MSGLIB_CONNECTION) {
        return syncMsglibConnection($md);
    } elseif (op == Channel::OP::NOTIFY_PACKET_EXECUTED) {
        return notifyPacketExecuted($md);
    } elseif (op == Channel::OP::EMIT_LZ_RECEIVE_ALERT) {
        return emitLzReceiveAlert($md);
    } else {
        throw(BaseInterface::ERROR::invalidOpcode);
    }
    return empty_tuple();
}

```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/protocol/channel/storage.fc

```fc
#include "../../funC++/dataStructures/PipelinedOutOfOrder.fc";

#include "../../classes/lz/EpConfig.fc";

#include "../core/baseStorage.fc";

;; maximum concurrent sendable inflight send requests
;; must be low to avoid permanent bricking
const int Channel::MAX_SEND_SLOTS = MAX_CELL_BITS;

;; required object name
const int Channel::NAME = "channel"u;

;; field names
;; Init state (sharding key)
const int Channel::baseStorage = 0;
const int Channel::path = 1;

;; Both send and receive channel state
const int Channel::endpointAddress = 2;
const int Channel::epConfigOApp = 3;

;; Send channel state
const int Channel::outboundNonce = 4;
const int Channel::sendRequestQueue = 5;
const int Channel::lastSendRequestId = 6;

;; Receive channel state
const int Channel::commitPOOO = 7;

;; Used to track the commit verification queue / capacity
const int Channel::executePOOO = 8;
const int Channel::executionQueue = 9;

const int Channel::zroBalance = 10;

;; @owner manager
cell Channel::New(int owner, cell $path, int endpointAddress) impure inline method_id {
    return cl::declare(
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
}

;; ====================== Object Accessors =====================

const int Channel::_endpointAddressOffset = _HEADER_WIDTH;
const int Channel::_outboundNonceOffset = Channel::_endpointAddressOffset + 256;
const int Channel::_sendRequestIdOffset = Channel::_outboundNonceOffset + 64;
const int Channel::_zroBalanceOffset = Channel::_sendRequestIdOffset + 64;
const int Channel::_sliceBits = Channel::_zroBalanceOffset + 128;

cell Channel::getBaseStorage(cell $self) impure inline {
    return $self.cellPreloadRefAt(0);
}

cell Channel::getPath(cell $self) impure inline {
    return $self.cellPreloadRefAt(1);
}

int Channel::getEndpointAddress(cell $self) impure inline {
    return $self.cellPreloadAddressAt(Channel::_endpointAddressOffset);
}

cell Channel::getCommitPOOO(cell $self) impure inline {
    return $self.cellPreloadRefAt(2).cellPreloadRefAt(2);
}

cell Channel::getExecutePOOO(cell $self) impure inline {
    return $self.cellPreloadRefAt(2).cellPreloadRefAt(3);
}

cell Channel::getExecutionQueue(cell $self) impure inline {
    return $self.cellPreloadRefAt(3).cellPreloadRefAt(0);
}

int Channel::getZroBalance(cell $self) impure inline {
    return $self.cellPreloadCoinsAt(Channel::_zroBalanceOffset);
}

;; (epConfigOApp, commitPOOO, ExecutePOOO, executionQueue)
(cell, cell, cell, cell) Channel::getCommitPacketInformation(cell $self) impure inline {
    slice selfSlice = $self.begin_parse();
    slice ref2 = selfSlice.preloadRefSliceAt(2);
    return (
        ref2.preloadRefAt(0),
        ref2.preloadRefAt(2),
        ref2.preloadRefAt(3),
        selfSlice.preloadRefAt(3).cellPreloadRefAt(0)
    );
}

;; (executePOOO, executionQueue, path)
(cell, cell, cell) Channel::getExecutePOOOAndExecutionQueueAndPath(cell $self) impure inline {
    slice selfSlice = $self.begin_parse();
    return (
        selfSlice.preloadRefAt(2).cellPreloadRefAt(3),
        selfSlice.preloadRefAt(3).cellPreloadRefAt(0),
        selfSlice.preloadRefAt(1)
    );
}

;; (epConfigOapp, path, sendRequestQueue, lastSendRequestId)
(cell, cell, cell, int) Channel::getSendInformation(cell $self) impure inline {
    slice selfSlice = $self.begin_parse();
    slice ref2 = selfSlice.preloadRefSliceAt(2);
    return (
        ref2.preloadRefAt(0),
        selfSlice.preloadRefAt(1),
        ref2.preloadRefAt(1),
        selfSlice.preloadUint64At(Channel::_sendRequestIdOffset)
    );
}

;; (sendRequestQueue, zroBalance, path, outBoundNonce)
(cell, int, cell, int) Channel::getSendCallbackInformation(cell $self) impure inline {
    slice selfSlice = $self.begin_parse();
    return (
        selfSlice.preloadRefAt(2).cellPreloadRefAt(1),                           ;; sendRequestQueue
        selfSlice.preloadCoinsAt(Channel::_zroBalanceOffset),                    ;; zroBalance
        selfSlice.preloadRefAt(1),                                               ;; path
        selfSlice.preloadUint64At(Channel::_outboundNonceOffset)                 ;; outboundNonce
    );
}

;; (executionQueue, commitPOOO, path)
(cell, cell, cell) Channel::getLzReceiveLockInformation(cell $self) impure inline {
    slice selfSlice = $self.begin_parse();
    return (
        selfSlice.preloadRefAt(3).cellPreloadRefAt(0),       ;; executionQueue
        selfSlice.preloadRefAt(2).cellPreloadRefAt(2),       ;; commitPOOO
        selfSlice.preloadRefAt(1)                            ;; path
    );
}

;; ====================== Object Modifiers =====================

cell Channel::setSendRequestQueue(cell $self, cell $sendRequestQueue) impure inline {
    slice selfSlice = $self.begin_parse();

    slice ref2Slice = selfSlice.preloadRefSliceAt(2);
    cell newRef2 = begin_cell()
        .store_slice(ref2Slice.scutfirst(0, 1))
        .store_ref($sendRequestQueue)
        .store_slice(ref2Slice.scutlast(0, 2))
        .end_cell();

    return begin_cell()
        .store_slice(selfSlice.scutfirst(Channel::_sliceBits, 2)) ;; store all the bits and the first 2 refs [0, 1]
        .store_ref(newRef2) ;; store the new ref[2] which includes the new sendRequestQueue
        .store_slice(selfSlice.scutlast(0, 1)) ;; store the last ref, ref[3]
        .end_cell();
}

cell Channel::setExecutePOOO(cell $self, cell $executePOOO) impure inline {
    slice selfSlice = $self.begin_parse();

    slice ref2Slice = selfSlice.preloadRefSliceAt(2);
    cell newRef2 = begin_cell()
        .store_slice(ref2Slice.scutfirst(0, 3))
        .store_ref($executePOOO)
        .end_cell();

    return begin_cell()
        .store_slice(selfSlice.scutfirst(Channel::_sliceBits, 2)) ;; store all the bits and the first 2 refs [0, 1]
        .store_ref(newRef2) ;; store the new ref[2] which includes the new executePOOO
        .store_slice(selfSlice.scutlast(0, 1)) ;; store the last ref, ref[3]
        .end_cell();
}

cell Channel::setExecutionQueue(cell $self, cell $executionQueue) impure inline {
    slice selfSlice = $self.begin_parse();

    cell newRef3 = begin_cell()
        .store_ref($executionQueue)
        .end_cell();

    return begin_cell()
        .store_slice(selfSlice.scutfirst(Channel::_sliceBits, 3)) ;; store all the bits and the first 3 refs [0, 1, 2]
        .store_ref(newRef3) ;; store the new ref[3] which includes the new executionQueue
        .end_cell();
}

;; ====================== Object Composite Modifiers =====================

cell Channel::setSendRequestQueueAndLastSendRequestId(cell $self, int lastSendRequestId, cell $sendRequestQueue) impure inline {
    slice selfSlice = $self.begin_parse();
    slice ref2Slice = selfSlice.preloadRefSliceAt(2);

    cell newRef2 = begin_cell()
        .store_slice(ref2Slice.scutfirst(0, 1))
        .store_ref($sendRequestQueue)
        .store_slice(ref2Slice.scutlast(0, 2))
        .end_cell();

    return begin_cell()
        .store_slice(selfSlice.scutfirst(Channel::_sendRequestIdOffset, 2)) ;; store all the bits before the lastSendRequestId and the first 2 refs [0, 1]
        .store_uint64(lastSendRequestId) ;; store the new lastSendRequestId = ref[2]
        .store_ref(newRef2) ;; store the new ref[2] which includes the new sendRequestQueue
        .store_slice(selfSlice.sskipfirst(Channel::_sendRequestIdOffset + 64, 3)) ;; store the whatever was after the lastSendRequestId and the last ref, only giving back ref[3]
        .end_cell();
}

cell Channel::setOutboundNonceAndZroBalance(cell $self, int outboundNonce, int zroBalance) impure inline {
    slice selfSlice = $self.begin_parse();

    return begin_cell()
        .store_slice(
            selfSlice.scutfirst(Channel::_outboundNonceOffset, 4)
        ) ;; store whatever's behind the outbound nonce and all the refs
        .store_uint64(outboundNonce)
        .store_slice(
            selfSlice.subslice(
                Channel::_sendRequestIdOffset, ;; start bits
                0, ;; start refs
                64, ;; bits
                0 ;; refs
            )
        ) ;; store the next 64 bits = sendRequestId
        .store_uint128(zroBalance)
        .end_cell();
}

cell Channel::setCommitPOOOAndExecutionQueue(cell $self, cell $commitPOOO, cell $executionQueue) impure inline {
    slice selfSlice = $self.begin_parse();

    slice ref2Slice = selfSlice.preloadRefSliceAt(2);
    cell newRef2 = begin_cell()
        .store_slice(ref2Slice.scutfirst(0, 2)) ;; store the first 2 refs [0, 1]
        .store_ref($commitPOOO)                   ;; store the new commitPOOO = ref[2]
        .store_slice(ref2Slice.scutlast(0, 1)) ;; store the last ref, ref[3]
        .end_cell();

    cell newRef3 = begin_cell()
        .store_ref($executionQueue) ;; store the new executionQueue = ref[0]
        .end_cell();

    return begin_cell()
        .store_slice(selfSlice.scutfirst(Channel::_sliceBits, 2)) ;; store all the bits and the first 3 refs [0, 1]  
        .store_ref(newRef2) ;; store the new ref[2] which includes the new commitPOOO
        .store_ref(newRef3) ;; store the new ref[3] which includes the new executionQueue
        .end_cell();  
}

cell Channel::setPath(cell $self, cell $path) impure inline {
    slice selfSlice = $self.begin_parse();
    return begin_cell()
        .store_ref(selfSlice.preloadRefAt(0))
        .store_ref($path) ;; change ref 1
        .store_slice(sskipfirst(selfSlice, 0, 2)) ;; rest of it stays the same
        .end_cell();
}

cell Channel::sanitize(cell $self) impure inline {
    cell $baseStorage = $self.cl::get<cellRef>(Channel::baseStorage);
    return Channel::New(
        $baseStorage.cl::get<address>(BaseStorage::owner),
        $self.cl::get<cellRef>(Channel::path),
        $self.cl::get<address>(Channel::endpointAddress)
    );
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/protocol/controller/interface.fc

```fc
const int MAX_MSGLIBS = 255;

;; OPCODES
const int Controller::OP::DEPLOY_ENDPOINT = "Controller::OP::DEPLOY_ENDPOINT"c;
const int Controller::OP::DEPLOY_CHANNEL = "Controller::OP::DEPLOY_CHANNEL"c;
const int Controller::OP::SET_EP_CONFIG_DEFAULTS = "Controller::OP::SET_EP_CONFIG_DEFAULTS"c;
const int Controller::OP::SET_EP_CONFIG_OAPP = "Controller::OP::SET_EP_CONFIG_OAPP"c;
const int Controller::OP::ADD_MSGLIB = "Controller::OP::ADD_MSGLIB"c;
const int Controller::OP::DEPOSIT_ZRO = "Controller::OP::DEPOSIT_ZRO"c;
const int Controller::OP::SET_ZRO_WALLET = "Controller::OP::SET_ZRO_WALLET"c;
const int Controller::OP::EXCESSES = 0xd53276db; ;; op::excesses: 0xd53276db
const int Controller::OP::TRANSFER_OWNERSHIP = "Controller::OP::TRANSFER_OWNERSHIP"c;
const int Controller::OP::CLAIM_OWNERSHIP = "Controller::OP::CLAIM_OWNERSHIP"c;

;; EVENT
const int Controller::event::ZRO_WALLET_SET = "Controller::event::ZRO_WALLT_SET"u;
const int Controller::event::OWNER_SET = "Controller::event::OWNER_SET"u;
const int Controller::event::OWNER_SET_TENTATIVE = "Controller::event::OWNERSET_TENT"u;

;; ERRORS
const int Controller::ERROR::onlyOApp = 65;
const int Controller::ERROR::invalidEid = 66;
const int Controller::ERROR::onlyZroWallet = 67;
const int Controller::ERROR::onlyTentativeOwner = 68;
const int Controller::ERROR::nullTentativeOwner = 69;
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/protocol/core/abstract/protocolHandler.fc

```fc
#include "../../../funC++/handlerCore.fc";
#include "../../../funC++/actions/call.fc";
#include "../../../funC++/actions/deploy.fc";
#include "../../../funC++/actions/event.fc";
#include "../../../funC++/actions/payment.fc";

#include "../baseStorage.fc";

int getOwner() impure inline {
    return getBaseStorage().BaseStorage::getOwner();
}

cell getInitialStorage() impure inline {
    return getBaseStorage().BaseStorage::getInitialStorage();
}

;;; ==========================================
;; Modifiers
() assertAuthenticated() impure inline {
    throw_unless(
        BaseInterface::ERROR::notAuthenticated,
        getBaseStorage().BaseStorage::getAuthenticated()
    );
}

() assertInitialized() impure inline {
    throw_unless(
        BaseInterface::ERROR::notInitialized,
        getBaseStorage().BaseStorage::getInitialized()
    );
}

;; assert the ctx sender is the owner of this contract
;; expects the ctx to be populated. Does not require storage to be loaded
() assertOwner() impure inline {
    throw_unless(
        BaseInterface::ERROR::onlyOwner,
        getCaller() == getOwner()
    );
}

;; Step 1: authenticate
() authenticate() impure {
    assertOwner();
    throw_if(
        BaseInterface::ERROR::alreadyInitialized,
        getBaseStorage().BaseStorage::getInitialized()
    );
    cell $storage = getContractStorage();

    setContractStorage(
        $storage
            .cl::set(
                BASE_STORAGE_INDEX,
                $storage
                    .cl::get<objRef>(BASE_STORAGE_INDEX)
                    .cl::set(
                        BaseStorage::initialStorage,
                        getContractStorage()
                    )
                    .cl::set(BaseStorage::authenticated, true)
            )
    );
}

() authenticateIfNecessary() impure inline {
    if (getBaseStorage().BaseStorage::getAuthenticated() == false) {
        authenticate();
    }
}

(cell, tuple) _initialize(cell $md) impure inline;

;; Step 2: initialize
tuple initialize(cell $md) impure inline {
    assertAuthenticated();
    if (getBaseStorage().BaseStorage::getInitialized()) {
        return emptyActions();
    }

    (cell $storage, tuple actions) = _initialize($md);

    setContractStorage(
        $storage
            .cl::set(
                BASE_STORAGE_INDEX,
                $storage
                    .cl::get<objRef>(BASE_STORAGE_INDEX)
                    .cl::set(BaseStorage::initialized, true)
            )
    );

    return actions;
}

;; declared inside of the actions/event.fc
;; We declare it here because it saves the need for declaring initialStorage everytime we call event
tuple _newAction<event>(int topic, cell $body) impure inline {
    return action::event::create(topic, $body, getInitialStorage());
}

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

int _executeAction(int actionType, tuple action) impure inline {
    if (actionType == action::event::NAME) {
        return executeEvent(action);
    } elseif (actionType == action::call::NAME) {
        return executeCall(action);
    } elseif (actionType == action::payment::NAME) {
        return executePayment(action);
    } elseif (actionType == action::dispatch::NAME) {
        return executeDispatch(action);
    } elseif (actionType == action::deploy::NAME) {
        return executeDeploy(action);
    } else {
        throw(BaseInterface::ERROR::invalidActionType);
    }

    ;; compiler freaks out if you dont have something here returning an int, but this should never be reached
    return false;
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/protocol/core/baseStorage.fc

```fc
#include "../../funC++/classlib.fc";
#include "../../funC++/baseInterface.fc";

;; !!! If you put this storage anywhere other than index 0 of your custom contract storage,
;; you are gunna have a bad time
const int BASE_STORAGE_INDEX = 0;

;; required object name
const int BaseStorage::NAME = "baseStore"u;

;; field names
const int BaseStorage::owner = 0;
const int BaseStorage::authenticated = 1;
const int BaseStorage::initialized = 2;
const int BaseStorage::initialStorage = 3;

;; In all blockchains with atomic cross-contract call, we can use src/dst/sender/receiver
;; because the send channel doesn't exist (it's just a nonce).
;; In TON, we need both send/receive channels, so we use local/remote to provide
;; a context-free way to refer to the two ends of the channel.
;; The direction is inferred by the context of the contract (send vs receive).
;; The srcOApp is the 256-bit hashpart of a standard address.
cell BaseStorage::New(int owner) impure inline method_id {
    return cl::declare(
        BaseStorage::NAME,
        unsafeTuple([
            [cl::t::address, owner], ;; BaseStorage::owner
            [cl::t::bool, false], ;; BaseStorage::authenticated
            [cl::t::bool, false], ;; BaseStorage::initialized
            [cl::t::objRef, cl::nullObject()] ;; BaseStorage::initialStorage
        ])
    );
}

const int BaseStorage::_ownerOffset = _HEADER_WIDTH;
const int BaseStorage::_authenticatedOffset = BaseStorage::_ownerOffset + 256;
const int BaseStorage::_initializedOffset = BaseStorage::_authenticatedOffset + 1;

int BaseStorage::getOwner(cell $self) impure inline {
    return $self.cellPreloadAddressAt(BaseStorage::_ownerOffset);
}

int BaseStorage::getAuthenticated(cell $self) impure inline {
    return $self.cellPreloadBoolAt(BaseStorage::_authenticatedOffset);
}

int BaseStorage::getInitialized(cell $self) impure inline {
    return $self.cellPreloadBoolAt(BaseStorage::_initializedOffset);
}

cell BaseStorage::getInitialStorage(cell $self) impure inline {
     return $self.cellPreloadRefAt(0);
}

cell getBaseStorage() impure inline method_id {
    return getContractStorage().cellPreloadRefAt(BASE_STORAGE_INDEX);
}
```

## 460c1c62fd4d98ba683bd25552ab0d830eb761de06ef1858a3ec3948429220ec/src/protocol/endpoint/interface.fc

```fc
;; OPCODES
const int Endpoint::OP::ENDPOINT_SEND = "Endpoint::OP::ENDPOINT_SEND"c;
const int Endpoint::OP::ENDPOINT_COMMIT_PACKET = "Endpoint::OP::ENDPOINT_COMMIT_PACKET"c;
const int Endpoint::OP::SET_EP_CONFIG_DEFAULTS = "Endpoint::OP::SET_EP_CONFIG_DEFAULTS"c;
const int Endpoint::OP::SET_EP_CONFIG_OAPP = "Endpoint::OP::SET_EP_CONFIG_OAPP"c;
const int Endpoint::OP::ADD_MSGLIB = "Endpoint::OP::ADD_MSGLIB"c;
const int Endpoint::OP::GET_MSGLIB_INFO_CALLBACK = "Endpoint::OP::GET_MSGLIB_INFO_CALLBACK"c;

;; EVENTS
const int Endpoint::event::EP_CONFIG_DEFAULTS_SET = "EP_CONFIG_DEFAULTS_SET"u;

;; ERRORS
const int Endpoint::ERROR::notOApp = 300;
const int Endpoint::ERROR::wrongPath = 301;
const int Endpoint::ERROR::unauthorizedMsglib = 302;
const int Endpoint::ERROR::invalidExpiry = 303;
const int Endpoint::ERROR::unresolvedMsglib = 304;
const int Endpoint::ERROR::msglibInfoExists = 305;
const int Endpoint::ERROR::numMsglibsExceeded = 306;
const int Endpoint::ERROR::sameTimeoutAndReceive = 307;

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
const int MsglibConnection::PathFieldIdx = 1;

;; All msglibs are required to have a connection and a manager
const int MsglibManager::OP::GET_MSGLIB_INFO = "MsglibManager::OP::GET_MSGLIB_INFO"c;

const int MsglibManager::OP::DEPLOY_CONNECTION = "MsglibManager::OP::DEPLOY_CONNECTION"c;

const int MsglibManager::OP::SET_OAPP_MSGLIB_SEND_CONFIG = "MsglibManager::OP::SET_OAPP_MSGLIB_SEND_CONFIG"c;

;; Set the connection MSGLIB config
;; called by OApp, seeded by SENDER
const int MsglibManager::OP::SET_OAPP_MSGLIB_RECEIVE_CONFIG = "MsglibManager::OP::SET_OAPP_MSGLIB_RECEIVE_CONFIG"c;

const int Msglib::OP::RETURN_QUOTE = "Msglib::OP::RETURN_QUOTE"c;

const int MsglibConnection::OP::MSGLIB_CONNECTION_QUOTE = "MsglibConnection::OP::MSGLIB_CONNECTION_QUOTE"c;
const int MsglibConnection::OP::MSGLIB_CONNECTION_SEND = "MsglibConnection::OP::MSGLIB_CONNECTION_SEND"c;
const int MsglibConnection::OP::MSGLIB_CONNECTION_COMMIT_PACKET_CALLBACK = "MsglibConnection::OP::MSGLIB_CONNECTION_COMMIT_PACKET_CALLBACK"c;
const int MsglibConnection::OP::MSGLIB_CONNECTION_SYNC_CHANNEL_STATE = "MsglibConnection::OP::MSGLIB_CONNECTION_SYNC_CHANNEL_STATE"c;

const int Msglib::ERROR::onlyChannel = 288;
```

## 499847d3b5434ee60ae3707f96bd0675b848168ac7ceece176e6cae5455f30d1/multisig-code.fc

```fc
;; Simple wallet smart contract

(int, int) get_bridge_config() impure inline_ref {
  cell bridge_config = config_param(72);
  if (bridge_config.cell_null?()) {
    bridge_config = config_param(-72);
  }
  if (bridge_config.cell_null?()) {
    return (0, 0);
  }
  slice ds = bridge_config.begin_parse();
  if (ds.slice_bits() < 512) {
    return (0, 0);
  }
  ;; wc always equals to -1
  int bridge_address = ds~load_uint(256);
  int oracles_address = ds~load_uint(256);
  return (bridge_address, oracles_address);
}

_ unpack_state() inline_ref {
  var ds = begin_parse(get_data());
  var res = (ds~load_uint(32), ds~load_uint(8), ds~load_uint(8), ds~load_uint(64), ds~load_dict(), ds~load_dict(), ds~load_uint(32));
  ds.end_parse();
  return res;
}

_ pack_state(cell pending_queries, cell owner_infos, int last_cleaned, int k, int n, int wallet_id, int spend_delay) inline_ref {
  return begin_cell()
    .store_uint(wallet_id, 32)
    .store_uint(n, 8)
    .store_uint(k, 8)
    .store_uint(last_cleaned, 64)
    .store_dict(owner_infos)
    .store_dict(pending_queries)
    .store_uint(spend_delay,32)
  .end_cell();
}

_ pack_owner_info(int public_key, int flood) inline_ref {
  return begin_cell()
    .store_uint(public_key, 256)
    .store_uint(flood, 8);
}

_ unpack_owner_info(slice cs) inline_ref {
  return (cs~load_uint(256), cs~load_uint(8));
}

(int, int) check_signatures(cell public_keys, cell signatures, int hash, int cnt_bits) inline_ref {
  int cnt = 0;

  do {
    slice cs = signatures.begin_parse();
    slice signature = cs~load_bits(512);

    int i = cs~load_uint(8);
    signatures = cs~load_dict();

    (slice public_key, var found?) = public_keys.udict_get?(8, i);
    throw_unless(37, found?);
    throw_unless(38, check_signature(hash, signature, public_key.preload_uint(256)));

    int mask = (1 << i);
    int old_cnt_bits = cnt_bits;
    cnt_bits |= mask;
    int should_check = cnt_bits != old_cnt_bits;
    cnt -= should_check;
  } until (cell_null?(signatures));

  return (cnt, cnt_bits);
}

() recv_internal(slice in_msg) impure {
  ;; do nothing for internal messages
}

(int, cell, int, int) parse_msg(slice in_msg) inline_ref {
  int mode = in_msg~load_uint(8);
  var msg = in_msg~load_ref();
  var msg' = msg.begin_parse();
  msg'~load_uint(4); ;; flags
  msg'~load_msg_addr(); ;; src
  (int wc, int addr) = parse_std_addr(msg'~load_msg_addr()); ;; dest
  return (mode, msg, wc, addr);
}

() check_proposed_query(slice in_msg) impure inline {
  throw_unless(43, (slice_refs(in_msg) == 1) & (slice_bits(in_msg) == 8));
  (_, _, int wc, _) = parse_msg(in_msg);
  wc~impure_touch();
}

(int, int, int, slice) unpack_query_data(slice in_msg, int n, slice query, var found?, int root_i) inline_ref {
  if (found?) {
    throw_unless(35, query~load_int(1));
    (int creator_i, int cnt, int cnt_bits, slice msg) = (query~load_uint(8), query~load_uint(8), query~load_uint(n), query);
    throw_unless(36, slice_hash(msg) == slice_hash(in_msg));
    return (creator_i, cnt, cnt_bits, msg);
  }
  check_proposed_query(in_msg);

  return (root_i, 0, 0, in_msg);
}

(cell, ()) dec_flood(cell owner_infos, int creator_i) {
  (slice owner_info, var found?) = owner_infos.udict_get?(8, creator_i);
  (int public_key, int flood) = unpack_owner_info(owner_info);
  owner_infos~udict_set_builder(8, creator_i, pack_owner_info(public_key, flood - 1));
  return (owner_infos, ());
}

() try_init() impure inline_ref {
  ;; first query without signatures is always accepted
  (int wallet_id, int n, int k, int last_cleaned, cell owner_infos, cell pending_queries, int spend_delay) = unpack_state();
  throw_if(37, last_cleaned);
  accept_message();
  set_data(pack_state(pending_queries, owner_infos, 1, k, n, wallet_id, spend_delay));
}

(cell, cell) update_pending_queries(cell pending_queries, cell owner_infos, slice msg, int query_id, int creator_i, int cnt, int cnt_bits, int n, int k) impure inline_ref {
  if (cnt >= k) {
    accept_message();
    (int bridge_address, int oracles_address) = get_bridge_config();
    (_, int my_addr) = parse_std_addr(my_address());
    var (mode, msg', wc, addr) = parse_msg(msg);
    if ( ((wc == -1) & (addr == bridge_address)) | (oracles_address != my_addr) ) {
       send_raw_message(msg', mode);
    }
    pending_queries~udict_set_builder(64, query_id, begin_cell().store_int(0, 1));
    owner_infos~dec_flood(creator_i);
  } else {
    pending_queries~udict_set_builder(64, query_id, begin_cell()
      .store_uint(1, 1)
      .store_uint(creator_i, 8)
      .store_uint(cnt, 8)
      .store_uint(cnt_bits, n)
      .store_slice(msg));
  }
  return (pending_queries, owner_infos);
}

(int, int) calc_boc_size(int cells, int bits, slice root) {
  cells += 1;
  bits += root.slice_bits();

  while (root.slice_refs()) {
    (cells, bits) = calc_boc_size(cells, bits, root~load_ref().begin_parse());
  }

  return (cells, bits);
}

() recv_external(slice in_msg) impure {
  ;; empty message triggers init
  if (slice_empty?(in_msg)) {
    return try_init();
  }

  ;; Check root signature
  slice root_signature = in_msg~load_bits(512);
  int root_hash = slice_hash(in_msg);
  int root_i = in_msg~load_uint(8);

  (int wallet_id, int n, int k, int last_cleaned, cell owner_infos, cell pending_queries, int spend_delay) = unpack_state();

  throw_unless(38, now() > spend_delay);
  last_cleaned -= last_cleaned == 0;

  (slice owner_info, var found?) = owner_infos.udict_get?(8, root_i);
  throw_unless(31, found?);
  (int public_key, int flood) = unpack_owner_info(owner_info);
  throw_unless(32, check_signature(root_hash, root_signature, public_key));

  cell signatures = in_msg~load_dict();

  var hash = slice_hash(in_msg);
  int query_wallet_id = in_msg~load_uint(32);
  throw_unless(42, query_wallet_id == wallet_id);

  int query_id = in_msg~load_uint(64);

  (int cnt, int bits) = calc_boc_size(0, 0, in_msg);
  throw_if(40, (cnt > 8) | (bits > 2048));

  (slice query, var found?) = pending_queries.udict_get?(64, query_id);

  ifnot (found?) {
    flood += 1;
    throw_if(39, flood > 10);
  }

  var bound = (now() << 32);
  throw_if(33, query_id < bound);

  (int creator_i, int cnt, int cnt_bits, slice msg) = unpack_query_data(in_msg, n, query, found?, root_i);
  int mask = 1 << root_i;
  throw_if(34, cnt_bits & mask);
  cnt_bits |= mask;
  cnt += 1;

  throw_if(41, ~ found? & (cnt < k) & (bound + ((60 * 60) << 32) > query_id));

  set_gas_limit(100000);

  ifnot (found?) {
    owner_infos~udict_set_builder(8, root_i, pack_owner_info(public_key, flood));
  }

  (pending_queries, owner_infos) = update_pending_queries(pending_queries, owner_infos, msg, query_id, creator_i, cnt, cnt_bits, n, k);
  set_data(pack_state(pending_queries, owner_infos, last_cleaned, k, n, wallet_id, spend_delay));

  commit();

  int need_save = 0;
  ifnot (cell_null?(signatures) | (cnt >= k)) {
    (int new_cnt, cnt_bits) = check_signatures(owner_infos, signatures, hash, cnt_bits);
    cnt += new_cnt;
    (pending_queries, owner_infos) = update_pending_queries(pending_queries, owner_infos, msg, query_id, creator_i, cnt, cnt_bits, n, k);
    need_save = -1;
  }

  accept_message();
  bound -= (64 << 32);   ;; clean up records expired more than 64 seconds ago
  int old_last_cleaned = last_cleaned;
  do {
    var (pending_queries', i, query, f) = pending_queries.udict_delete_get_min(64);
    f~touch();
    if (f) {
      f = (i < bound);
    }
    if (f) {
      if (query~load_int(1)) {
        owner_infos~dec_flood(query~load_uint(8));
      }
      pending_queries = pending_queries';
      last_cleaned = i;
      need_save = -1;
    }
  } until (~ f);

  if (need_save) {
    set_data(pack_state(pending_queries, owner_infos, last_cleaned, k, n, wallet_id, spend_delay));
  }
}

;; Get methods
;; returns -1 for processed queries, 0 for unprocessed, 1 for unknown (forgotten)
(int, int) get_query_state(int query_id) method_id {
  (_, int n, _, int last_cleaned, _, cell pending_queries, _) = unpack_state();
  (slice cs, var found) = pending_queries.udict_get?(64, query_id);
  if (found) {
    if (cs~load_int(1)) {
      cs~load_uint(8 + 8);
      return (0, cs~load_uint(n));
    } else {
      return (-1, 0);
    }
  }  else {
    return (-(query_id <= last_cleaned), 0);
  }
}

int processed?(int query_id) method_id {
  (int x, _) = get_query_state(query_id);
  return x;
}

cell create_init_state(int wallet_id, int n, int k, cell owners_info, int spend_delay) method_id {
  return pack_state(new_dict(), owners_info, 0, k, n, wallet_id, spend_delay);
}

cell merge_list(cell a, cell b) {
  if (cell_null?(a)) {
    return b;
  }
  if (cell_null?(b)) {
    return a;
  }
  slice as = a.begin_parse();
  if (as.slice_refs() != 0) {
    cell tail = merge_list(as~load_ref(), b);
    return begin_cell().store_slice(as).store_ref(tail).end_cell();
  }

  as~skip_last_bits(1);
  ;; as~skip_bits(1);
  return begin_cell().store_slice(as).store_dict(b).end_cell();

}

cell get_public_keys() method_id {
  (_, _, _, _, cell public_keys, _, _) = unpack_state();
  return public_keys;
}

(int, int) check_query_signatures(cell query) method_id {
  slice cs = query.begin_parse();
  slice root_signature = cs~load_bits(512);
  int root_hash = slice_hash(cs);
  int root_i = cs~load_uint(8);

  cell public_keys = get_public_keys();
  (slice public_key, var found?) = public_keys.udict_get?(8, root_i);
  throw_unless(31, found?);
  throw_unless(32, check_signature(root_hash, root_signature, public_key.preload_uint(256)));

  int mask = 1 << root_i;

  cell signatures = cs~load_dict();
  if (cell_null?(signatures)) {
    return (1, mask);
  }
  (int cnt, mask) = check_signatures(public_keys, signatures, slice_hash(cs), mask);
  return (cnt + 1, mask);
}

int message_signed_by_id?(int id, int query_id) method_id {
  (_, int n, _, _, _, cell pending_queries, _) = unpack_state();
  (var cs, var f) = pending_queries.udict_get?(64, query_id);
  if (f) {
    if (cs~load_int(1)) {
      int cnt_bits = cs.skip_bits(8 + 8).preload_uint(n);
      if (cnt_bits & (1 << id)) {
        return -1;
      }
      return 0;
    }
    return -1;
  }
  return 0;
}

cell messages_by_mask(int mask) method_id {
  (_, int n, _, _, _, cell pending_queries, _) = unpack_state();
  int i = -1;
  cell a = new_dict();
  do {
    (i, var cs, var f) = pending_queries.udict_get_next?(64, i);
    if (f) {
      if (cs~load_int(1)) {
        int cnt_bits = cs.skip_bits(8 + 8).preload_uint(n);
        if (cnt_bits & mask) {
          a~udict_set_builder(64, i, begin_cell().store_slice(cs));
        }
      }
    }
  } until (~ f);
  return a;
}

cell get_messages_unsigned_by_id(int id) method_id {
  return messages_by_mask(1 << id);
}

cell get_messages_unsigned() method_id {
  return messages_by_mask(~ 0);
}

(int, int) get_n_k() method_id {
  (_, int n, int k, _, _, _, _) = unpack_state();
  return (n, k);
}

cell merge_inner_queries(cell a, cell b) method_id {
  slice ca = a.begin_parse();
  slice cb = b.begin_parse();
  cell list_a = ca~load_dict();
  cell list_b = cb~load_dict();
  throw_unless(31, slice_hash(ca) == slice_hash(cb));
  return begin_cell()
    .store_dict(merge_list(list_a, list_b))
    .store_slice(ca)
  .end_cell();
}

int get_lock_timeout() method_id {
  (_, _, _, _, _, _, int spend_delay) = unpack_state();
  return spend_delay;
}

```

## 499847d3b5434ee60ae3707f96bd0675b848168ac7ceece176e6cae5455f30d1/stdlib.fc

```fc
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail) asm "CONS";
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";
forall X -> X car(tuple list) asm "CAR";
tuple cdr(tuple list) asm "CDR";
tuple empty_tuple() asm "NIL";
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";
forall X -> [X] single(X x) asm "SINGLE";
forall X -> X unsingle([X] t) asm "UNSINGLE";
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";
forall X -> X first(tuple t) asm "FIRST";
forall X -> X second(tuple t) asm "SECOND";
forall X -> X third(tuple t) asm "THIRD";
forall X -> X fourth(tuple t) asm "3 INDEX";
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";
forall X -> X null() asm "PUSHNULL";
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";

int now() asm "NOW";
slice my_address() asm "MYADDR";
[int, cell] get_balance() asm "BALANCE";
int cur_lt() asm "LTIME";
int block_lt() asm "BLOCKLT";

int cell_hash(cell c) asm "HASHCU";
int slice_hash(slice s) asm "HASHSU";
int string_hash(slice s) asm "SHA256U";

int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data() asm "c4 PUSH";
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y) asm "MIN";
int max(int x, int y) asm "MAX";
(int, int) minmax(int x, int y) asm "MINMAX";
int abs(int x) asm "ABS";

slice begin_parse(cell c) asm "CTOS";
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";
cell preload_ref(slice s) asm "PLDREF";
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";
slice first_bits(slice s, int len) asm "SDCUTFIRST";
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";
slice slice_last(slice s, int len) asm "SDCUTLAST";
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";
cell preload_dict(slice s) asm "PLDDICT";
slice skip_dict(slice s) asm "SKIPDICT";

(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";
cell preload_maybe_ref(slice s) asm "PLDOPTREF";
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";

int cell_depth(cell c) asm "CDEPTH";

int slice_refs(slice s) asm "SREFS";
int slice_bits(slice s) asm "SBITS";
(int, int) slice_bits_refs(slice s) asm "SBITREFS";
int slice_empty?(slice s) asm "SEMPTY";
int slice_data_empty?(slice s) asm "SDEMPTY";
int slice_refs_empty?(slice s) asm "SREMPTY";
int slice_depth(slice s) asm "SDEPTH";

int builder_refs(builder b) asm "BREFS";
int builder_bits(builder b) asm "BBITS";
int builder_depth(builder b) asm "BDEPTH";

builder begin_cell() asm "NEWC";
cell end_cell(builder b) asm "ENDC";
builder store_ref(builder b, cell c) asm(c b) "STREF";
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s) asm "STSLICER";
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_dict(builder b, cell c) asm(c b) "STDICT";

(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";
tuple parse_addr(slice s) asm "PARSEMSGADDR";
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";
cell new_dict() asm "NEWDICT";
int dict_empty?(cell c) asm "DICTEMPTY";

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x) asm "CONFIGOPTPARAM";
int cell_null?(cell c) asm "ISNULL";

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

int random() impure asm "RANDU256";
int rand(int range) impure asm "RAND";
int get_seed() impure asm "RANDSEED";
int set_seed() impure asm "SETRAND";
() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";


```

## 4adf48135cb575adbaed476799c87ff2904269b1f949ada4d0479e9104b6f217/imports/jetton-utils.fc

```fc
cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
   return  begin_cell()
            .store_coins(balance)
            .store_slice(owner_address)
            .store_slice(jetton_master_address)
            .store_ref(jetton_wallet_code)
           .end_cell();
}

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
  return begin_cell()
          .store_uint(0, 2)
          .store_dict(jetton_wallet_code)
          .store_dict(pack_jetton_wallet_data(0, owner_address, jetton_master_address, jetton_wallet_code))
          .store_uint(0, 1)
         .end_cell();
}

slice calculate_jetton_wallet_address(cell state_init) inline {
  return begin_cell().store_uint(4, 3)
                     .store_int(workchain(), 8)
                     .store_uint(cell_hash(state_init), 256)
                     .end_cell()
                     .begin_parse();
}

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
  return calculate_jetton_wallet_address(calculate_jetton_wallet_state_init(owner_address, jetton_master_address, jetton_wallet_code));
}


```

## 4adf48135cb575adbaed476799c87ff2904269b1f949ada4d0479e9104b6f217/imports/op-codes.fc

```fc
int op::transfer() asm "0xf8a7ea5 PUSHINT";
int op::transfer_notification() asm "0x7362d09c PUSHINT";
int op::internal_transfer() asm "0x178d4519 PUSHINT";
int op::excesses() asm "0xd53276db PUSHINT";
int op::burn() asm "0x595f07bc PUSHINT";
int op::burn_notification() asm "0x7bdd97de PUSHINT";

;; Minter
int op::mint() asm "21 PUSHINT";

```

## 4adf48135cb575adbaed476799c87ff2904269b1f949ada4d0479e9104b6f217/imports/params.fc

```fc
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}
```

## 4adf48135cb575adbaed476799c87ff2904269b1f949ada4d0479e9104b6f217/jetton-utils/stdlib.fc

```fc
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail) asm "CONS";
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";
forall X -> X car(tuple list) asm "CAR";
tuple cdr(tuple list) asm "CDR";
tuple empty_tuple() asm "NIL";
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";
forall X -> [X] single(X x) asm "SINGLE";
forall X -> X unsingle([X] t) asm "UNSINGLE";
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";
forall X -> X first(tuple t) asm "FIRST";
forall X -> X second(tuple t) asm "SECOND";
forall X -> X third(tuple t) asm "THIRD";
forall X -> X fourth(tuple t) asm "3 INDEX";
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";
forall X -> X null() asm "PUSHNULL";
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";

int now() asm "NOW";
slice my_address() asm "MYADDR";
[int, cell] get_balance() asm "BALANCE";
int cur_lt() asm "LTIME";
int block_lt() asm "BLOCKLT";

int cell_hash(cell c) asm "HASHCU";
int slice_hash(slice s) asm "HASHSU";
int string_hash(slice s) asm "SHA256U";

int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data() asm "c4 PUSH";
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y) asm "MIN";
int max(int x, int y) asm "MAX";
(int, int) minmax(int x, int y) asm "MINMAX";
int abs(int x) asm "ABS";

slice begin_parse(cell c) asm "CTOS";
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";
cell preload_ref(slice s) asm "PLDREF";
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";
slice first_bits(slice s, int len) asm "SDCUTFIRST";
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";
slice slice_last(slice s, int len) asm "SDCUTLAST";
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";
cell preload_dict(slice s) asm "PLDDICT";
slice skip_dict(slice s) asm "SKIPDICT";

(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";
cell preload_maybe_ref(slice s) asm "PLDOPTREF";
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";

int cell_depth(cell c) asm "CDEPTH";

int slice_refs(slice s) asm "SREFS";
int slice_bits(slice s) asm "SBITS";
(int, int) slice_bits_refs(slice s) asm "SBITREFS";
int slice_empty?(slice s) asm "SEMPTY";
int slice_data_empty?(slice s) asm "SDEMPTY";
int slice_refs_empty?(slice s) asm "SREMPTY";
int slice_depth(slice s) asm "SDEPTH";

int builder_refs(builder b) asm "BREFS";
int builder_bits(builder b) asm "BBITS";
int builder_depth(builder b) asm "BDEPTH";

builder begin_cell() asm "NEWC";
cell end_cell(builder b) asm "ENDC";
builder store_ref(builder b, cell c) asm(c b) "STREF";
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s) asm "STSLICER";
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_dict(builder b, cell c) asm(c b) "STDICT";

(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";
tuple parse_addr(slice s) asm "PARSEMSGADDR";
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";
cell new_dict() asm "NEWDICT";
int dict_empty?(cell c) asm "DICTEMPTY";

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x) asm "CONFIGOPTPARAM";
int cell_null?(cell c) asm "ISNULL";

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

int random() impure asm "RANDU256";
int rand(int range) impure asm "RAND";
int get_seed() impure asm "RANDSEED";
int set_seed() impure asm "SETRAND";
() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x) asm "STVARUINT16";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDVARUINT16";

int equal_slices (slice a, slice b) asm "SDEQ";
int builder_null?(builder b) asm "ISNULL";
builder store_builder(builder to, builder from) asm "STBR";


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

int min_tons_for_storage() asm "10000000 PUSHINT"; ;; 0.01 TON
int gas_consumption() asm "10000000 PUSHINT"; ;; 0.01 TON

{-
  Storage
  storage#_ balance:Coins owner_address:MsgAddressInt jetton_master_address:MsgAddressInt jetton_wallet_code:^Cell = Storage;
-}

(int, slice, slice, cell) load_data() inline {
  slice ds = get_data().begin_parse();
  return (ds~load_coins(), ds~load_msg_addr(), ds~load_msg_addr(), ds~load_ref());
}

() save_data (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) impure inline {
  set_data(pack_jetton_wallet_data(balance, owner_address, jetton_master_address, jetton_wallet_code));
}

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

() send_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure {
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  slice to_owner_address = in_msg_body~load_msg_addr();
  force_chain(to_owner_address);
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  balance -= jetton_amount;

  throw_unless(705, equal_slices(owner_address, sender_address));
  throw_unless(706, balance >= 0);

  cell state_init = calculate_jetton_wallet_state_init(to_owner_address, jetton_master_address, jetton_wallet_code);
  slice to_wallet_address = calculate_jetton_wallet_address(state_init);
  slice response_address = in_msg_body~load_msg_addr();
  cell custom_payload = in_msg_body~load_dict();
  int forward_ton_amount = in_msg_body~load_coins();
  slice either_forward_payload = in_msg_body;
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(to_wallet_address)
    .store_coins(0)
    .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
    .store_ref(state_init);
  var msg_body = begin_cell()
    .store_uint(op::internal_transfer(), 32)
    .store_uint(query_id, 64)
    .store_coins(jetton_amount)
    .store_slice(owner_address)
    .store_slice(response_address)
    .store_coins(forward_ton_amount)
    .store_slice(either_forward_payload)
    .end_cell();

  msg = msg.store_ref(msg_body);
  int fwd_count = forward_ton_amount ? 2 : 1;
  throw_unless(709, msg_value >
                     forward_ton_amount +
                     ;; 3 messages: wal1->wal2,  wal2->owner, wal2->response
                     ;; but last one is optional (it is ok if it fails)
                     fwd_count * fwd_fee +
                     (2 * gas_consumption() + min_tons_for_storage()));
                     ;; universal message send fee calculation may be activated here
                     ;; by using this instead of fwd_fee
                     ;; msg_fwd_fee(to_wallet, msg_body, state_init, 15)

  send_raw_message(msg.end_cell(), 64); ;; revert on errors
  save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}

{-
  internal_transfer  query_id:uint64 amount:(VarUInteger 16) from:MsgAddress
                     response_address:MsgAddress
                     forward_ton_amount:(VarUInteger 16)
                     forward_payload:(Either Cell ^Cell) 
                     = InternalMsgBody;
-}

() receive_tokens (slice in_msg_body, slice sender_address, int my_ton_balance, int fwd_fee, int msg_value) impure {
  ;; NOTE we can not allow fails in action phase since in that case there will be
  ;; no bounce. Thus check and throw in computation phase.
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  balance += jetton_amount;
  slice from_address = in_msg_body~load_msg_addr();
  slice response_address = in_msg_body~load_msg_addr();
  throw_unless(707,
      equal_slices(jetton_master_address, sender_address)
      |
      equal_slices(calculate_user_jetton_wallet_address(from_address, jetton_master_address, jetton_wallet_code), sender_address)
  );
  int forward_ton_amount = in_msg_body~load_coins();

  int ton_balance_before_msg = my_ton_balance - msg_value;
  int storage_fee = min_tons_for_storage() - min(ton_balance_before_msg, min_tons_for_storage());
  msg_value -= (storage_fee + gas_consumption());
  if(forward_ton_amount) {
    msg_value -= (forward_ton_amount + fwd_fee);
    slice either_forward_payload = in_msg_body;

    var msg_body = begin_cell()
        .store_uint(op::transfer_notification(), 32)
        .store_uint(query_id, 64)
        .store_coins(jetton_amount)
        .store_slice(from_address)
        .store_slice(either_forward_payload)
        .end_cell();

    var msg = begin_cell()
      .store_uint(0x18, 6)
      .store_slice(owner_address)
      .store_coins(forward_ton_amount)
      .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
      .store_ref(msg_body);

    send_raw_message(msg.end_cell(), 1);
  }

  if ((response_address.preload_uint(2) != 0) & (msg_value > 0)) {
    var msg = begin_cell()
      .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
      .store_slice(response_address)
      .store_coins(msg_value)
      .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
      .store_uint(op::excesses(), 32)
      .store_uint(query_id, 64);
    send_raw_message(msg.end_cell(), 2);
  }

  save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}

() burn_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure {
  ;; NOTE we can not allow fails in action phase since in that case there will be
  ;; no bounce. Thus check and throw in computation phase.
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  slice response_address = in_msg_body~load_msg_addr();
  ;; ignore custom payload
  ;; slice custom_payload = in_msg_body~load_dict();
  balance -= jetton_amount;
  throw_unless(705, equal_slices(owner_address, sender_address));
  throw_unless(706, balance >= 0);
  throw_unless(707, msg_value > fwd_fee + 2 * gas_consumption());

  var msg_body = begin_cell()
      .store_uint(op::burn_notification(), 32)
      .store_uint(query_id, 64)
      .store_coins(jetton_amount)
      .store_slice(owner_address)
      .store_slice(response_address)
      .end_cell();

  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(jetton_master_address)
    .store_coins(0)
    .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_ref(msg_body);

  send_raw_message(msg.end_cell(), 64);

  save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}

() on_bounce (slice in_msg_body) impure {
  in_msg_body~skip_bits(32); ;; 0xFFFFFFFF
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int op = in_msg_body~load_uint(32);
  throw_unless(709, (op == op::internal_transfer()) | (op == op::burn_notification()));
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  balance += jetton_amount;
  save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
  if (in_msg_body.slice_empty?()) { ;; ignore empty messages
    return ();
  }

  slice cs = in_msg_full.begin_parse();
  int flags = cs~load_uint(4);
  if (flags & 1) {
    on_bounce(in_msg_body);
    return ();
  }
  slice sender_address = cs~load_msg_addr();
  cs~load_msg_addr(); ;; skip dst
  cs~load_coins(); ;; skip value
  cs~skip_bits(1); ;; skip extracurrency collection
  cs~load_coins(); ;; skip ihr_fee
  int fwd_fee = cs~load_coins(); ;; we use message fwd_fee for estimation of forward_payload costs

  int op = in_msg_body~load_uint(32);

  if (op == op::transfer()) { ;; outgoing transfer
    send_tokens(in_msg_body, sender_address, msg_value, fwd_fee);
    return ();
  }

  if (op == op::internal_transfer()) { ;; incoming transfer
    receive_tokens(in_msg_body, sender_address, my_balance, fwd_fee, msg_value);
    return ();
  }

  if (op == op::burn()) { ;; burn
    burn_tokens(in_msg_body, sender_address, msg_value, fwd_fee);
    return ();
  }

  throw(0xffff);
}

(int, slice, slice, cell) get_wallet_data() method_id {
  return load_data();
}

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


int equal_slices (slice a, slice b) asm "SDEQ";

slice parse_sender_address (cell msg) inline {
  var cs = msg.begin_parse();
  cs~load_uint(4);
  return cs~load_msg_addr();
}

(slice, slice, slice, int, int, int, int) parse_data_storage(slice ds) impure inline_ref {
  return (
    ds~load_msg_addr(),
    ds~load_msg_addr(),
    ds~load_msg_addr(),
    ds~load_uint(32),
    ds~load_uint(8),
    ds~load_uint(8),
    ds~load_uint(4)
  );
}

() recv_internal(int smc_balance, int msg_value, cell msg, slice msg_slice) impure {
  slice sender = parse_sender_address(msg);
  slice data_slice = get_data().begin_parse();

  (
    slice manager_address,
    slice creator_address,
    slice opponent_address,
    int game_id,
    int creator_health,
    int opponent_health,
    int status
  ) = parse_data_storage(data_slice);


  int rounds = msg_slice~load_uint(10);
  int move_size = 3;
  int damage_size = 10;
  int hands_length = move_size * rounds;
  slice damages = msg_slice.slice_last(damage_size * rounds * 2);

  ;;throw_if(100, hands.slice_bits() != hands_length);
  throw_if(101, ((status == 3) | (status == 4)));
  throw_unless(102, (equal_slices(sender, creator_address) | equal_slices(sender, opponent_address)));
  throw_if(103, (equal_slices(sender, creator_address) & (status == 2)));
  throw_if(104, (equal_slices(sender, opponent_address) & (status == 1)));

  builder storage = begin_cell()
    .store_slice(manager_address)
    .store_slice(creator_address)
    .store_slice(opponent_address)
    .store_uint(game_id, 32)
    .store_uint(creator_health, 8)
    .store_uint(opponent_health, 8);


  if (status == 0) {
    int hands = msg_slice~load_uint(hands_length);

    if (equal_slices(sender, creator_address)) {
      storage~store_uint(2, 4);
      storage = storage.store_uint(hands, hands_length);
      storage~store_uint(0, hands_length);
    } else {
      storage~store_uint(1, 4);
      storage~store_uint(0, hands_length);
      storage = storage.store_uint(hands, hands_length);
    }

    set_data(storage.end_cell());
    return();

  } else {
    slice opponent_hands = null();
    slice creator_hands = null();

    if (status == 1) {
      opponent_hands = data_slice.slice_last(hands_length);
      creator_hands = msg_slice;
    } else {
      var all_hands = data_slice.slice_last(hands_length * 2);
      creator_hands = all_hands~load_bits(hands_length);
      opponent_hands = msg_slice;
    }

    slice winner = null();
    int new_status = -1;
    int creator_damage = 0;
    int opponent_damage = 0;

    repeat (rounds) {
      int creator_hand = creator_hands~load_uint(move_size);
      int opponent_hand = opponent_hands~load_uint(move_size);

      creator_damage += damages~load_int(damage_size);
      opponent_damage += damages~load_int(damage_size);
    }

    if (opponent_damage >= creator_health) {
      new_status = 4;
      winner = opponent_address;
    } else {
      if (creator_damage >= opponent_health) {
        winner = creator_address;
        new_status = 3;
      }
    }

    set_data(storage.store_uint(new_status, 4).end_cell());

    cell winner_msg = begin_cell()
      .store_uint(0x10, 6)
      .store_slice(winner)
      .store_grams(smc_balance * 90 / 100)
      .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .end_cell();

    cell manager_msg = begin_cell()
      .store_uint(0x10, 6)
      .store_slice(manager_address)
      .store_grams(0)
      .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .end_cell();

    send_raw_message(winner_msg, 3);
    send_raw_message(manager_msg, 128);
  }
}

```

## 4af21dce90f006fb2181def15736ad730ede88bf8f0659a180a089e7ad5caf02/stdlib.fc

```fc
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail) asm "CONS";
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";
forall X -> X car(tuple list) asm "CAR";
tuple cdr(tuple list) asm "CDR";
tuple empty_tuple() asm "NIL";
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";
forall X -> [X] single(X x) asm "SINGLE";
forall X -> X unsingle([X] t) asm "UNSINGLE";
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";
forall X -> X first(tuple t) asm "FIRST";
forall X -> X second(tuple t) asm "SECOND";
forall X -> X third(tuple t) asm "THIRD";
forall X -> X fourth(tuple t) asm "3 INDEX";
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";
forall X -> X null() asm "PUSHNULL";
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";

int now() asm "NOW";
slice my_address() asm "MYADDR";
[int, cell] get_balance() asm "BALANCE";
int cur_lt() asm "LTIME";
int block_lt() asm "BLOCKLT";

int cell_hash(cell c) asm "HASHCU";
int slice_hash(slice s) asm "HASHSU";
int string_hash(slice s) asm "SHA256U";

int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data() asm "c4 PUSH";
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y) asm "MIN";
int max(int x, int y) asm "MAX";
(int, int) minmax(int x, int y) asm "MINMAX";
int abs(int x) asm "ABS";

slice begin_parse(cell c) asm "CTOS";
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";
cell preload_ref(slice s) asm "PLDREF";
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";
slice first_bits(slice s, int len) asm "SDCUTFIRST";
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";
slice slice_last(slice s, int len) asm "SDCUTLAST";
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";
cell preload_dict(slice s) asm "PLDDICT";
slice skip_dict(slice s) asm "SKIPDICT";

(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";
cell preload_maybe_ref(slice s) asm "PLDOPTREF";
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";

int cell_depth(cell c) asm "CDEPTH";

int slice_refs(slice s) asm "SREFS";
int slice_bits(slice s) asm "SBITS";
(int, int) slice_bits_refs(slice s) asm "SBITREFS";
int slice_empty?(slice s) asm "SEMPTY";
int slice_data_empty?(slice s) asm "SDEMPTY";
int slice_refs_empty?(slice s) asm "SREMPTY";
int slice_depth(slice s) asm "SDEPTH";

int builder_refs(builder b) asm "BREFS";
int builder_bits(builder b) asm "BBITS";
int builder_depth(builder b) asm "BDEPTH";

builder begin_cell() asm "NEWC";
cell end_cell(builder b) asm "ENDC";
builder store_ref(builder b, cell c) asm(c b) "STREF";
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s) asm "STSLICER";
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_dict(builder b, cell c) asm(c b) "STDICT";

(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";
tuple parse_addr(slice s) asm "PARSEMSGADDR";
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";
cell new_dict() asm "NEWDICT";
int dict_empty?(cell c) asm "DICTEMPTY";

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x) asm "CONFIGOPTPARAM";
int cell_null?(cell c) asm "ISNULL";

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

int random() impure asm "RANDU256";
int rand(int range) impure asm "RAND";
int get_seed() impure asm "RANDSEED";
int set_seed() impure asm "SETRAND";
() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";
```

## 4b54587eb871ef7e2671e5f5737f45737850b1fc5dee4eeacbce37066f6de2f1/contracts/flip_res_proxy.fc

```fc
#include "../imports/stdlib.fc";

const ADMIN = "UQDO8VPQ7rx3A0tUPdyM80a45yFmbRaWZvX_1o8PmrrdayJv"a;

tuple get_prev_block() asm "PREVKEYBLOCK";

() custom_randomize() impure inline {
    int prev_root_hash = 0;
    try {
        tuple prev_block = get_prev_block(); ;; (int wc, int shard, int seqno, int root_hash, int file_hash)
        prev_root_hash = prev_block.at(3);
    } catch (x, n) {
        prev_root_hash = 1;
    }

    randomize(prev_root_hash);
    randomize(now());
    randomize(cur_lt());
}

(builder, ()) set_res_side(builder msg_b, int bets_count) impure inline {
    if bets_count > 1 {
        repeat(bets_count){
            int int_side = rand(2);
            msg_b = msg_b.store_slice(int_side == 0 ? "h" : "t");
        }
        return (msg_b, ());
    }
    int int_side = rand(2);
    return (msg_b.store_slice(int_side == 0 ? "h" : "t"), ());
}

(int, int) int_to_utf8(int num) {
    int res = 0;

    int bytes = 0;
    int shift = 0x1;
    while(num > 0) {
        (num, int digit) = num.divmod(10);
        res = res + (digit + 0x30) * shift;
        shift = shift * 0x0100;
        bytes = bytes + 1;
    }
    return (res, bytes * 8);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);
    
    if (flags & 1) { ;; fwd all bounced messages to admin
        send_raw_message(begin_cell()
           .store_uint(0x10, 6)
           .store_slice(ADMIN)
           .store_coins(0)
           .store_uint(0, 107)
        .end_cell(), 64 + 2);

        return ();
    }

    in_msg_body~load_uint(32); ;; skip op

    int bets_count = in_msg_body~load_uint(4);
    int bet_id = in_msg_body~load_uint(32);

    slice sender_address = cs~load_msg_addr();
    builder echo_b = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(sender_address)
        .store_coins(0)
        .store_uint(0, 107)
        .store_uint(0, 32)
        .store_slice("bets:")
        .store_uint(bets_count + 48, 8)
        .store_slice(" res:");

    custom_randomize();
    echo_b~set_res_side(bets_count);

    (int encoded_bet_id, int encoded_bet_id_len) = int_to_utf8(bet_id);

    send_raw_message(echo_b
        .store_slice(" id:")
        .store_uint(encoded_bet_id, encoded_bet_id_len)
    .end_cell(), 64);

    return ();
}

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
forall X -> tuple cons(X head, tuple tail) asm "CONS";

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list) asm "CAR";

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list) asm "CDR";

;;; Creates tuple with zero elements.
tuple empty_tuple() asm "NIL";

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x) asm "SINGLE";

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t) asm "UNSINGLE";

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t) asm "FIRST";

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t) asm "SECOND";

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t) asm "THIRD";

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t) asm "3 INDEX";

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";


;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null() asm "PUSHNULL";

;;; Moves a variable [x] to the top of the stack
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";



;;; Returns the current Unix time as an Integer
int now() asm "NOW";

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address() asm "MYADDR";

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance() asm "BALANCE";

;;; Returns the logical time of the current transaction.
int cur_lt() asm "LTIME";

;;; Returns the starting logical time of the current block.
int block_lt() asm "BLOCKLT";

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c) asm "HASHCU";

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s) asm "HASHSU";

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s) asm "SHA256U";

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
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

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
cell get_data() asm "c4 PUSH";

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
int min(int x, int y) asm "MIN";

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y) asm "MAX";

;;; Sorts two integers.
(int, int) minmax(int x, int y) asm "MINMAX";

;;; Computes the absolute value of an integer [x].
int abs(int x) asm "ABS";

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
slice begin_parse(cell c) asm "CTOS";

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";

;;; Preloads the first reference from the slice.
cell preload_ref(slice s) asm "PLDREF";

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
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDGRAMS";

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len) asm "SDCUTFIRST";

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len) asm "SDCUTLAST";

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s) asm "PLDOPTREF";


;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c) asm "CDEPTH";


{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s) asm "SREFS";

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s) asm "SBITS";

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s) asm "SBITREFS";

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).
int slice_empty?(slice s) asm "SEMPTY";

;;; Checks whether `slice` [s] has no bits of data.
int slice_data_empty?(slice s) asm "SDEMPTY";

;;; Checks whether `slice` [s] has no references.
int slice_refs_empty?(slice s) asm "SREMPTY";

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s) asm "SDEPTH";

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b) asm "BREFS";

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b) asm "BBITS";

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b) asm "BDEPTH";

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell() asm "NEWC";

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b) asm "ENDC";

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c) asm(c b) "STREF";

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";


;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s) asm "STSLICER";

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_coins(builder b, int x) asm "STGRAMS";

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c) asm(c b) "STDICT";

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";


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
(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s) asm "PARSEMSGADDR";

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

{-
  # Dictionary primitives
-}


;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";

cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict() asm "NEWDICT";
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.
int dict_empty?(cell c) asm "DICTEMPTY";


{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x) asm "CONFIGOPTPARAM";
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.
int cell_null?(cell c) asm "ISNULL";

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
int random() impure asm "RANDU256";
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
int rand(int range) impure asm "RAND";
;;; Returns the current random seed as an unsigned 256-bit Integer.
int get_seed() impure asm "RANDSEED";
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b) asm "SDEQ";
int equal_slices(slice a, slice b) asm "SDEQ";

;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";
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
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}
```

## 4c9123828682fa6f43797ab41732bca890cae01766e0674100250516e0bf8d42/jetton-utils/stdlib.fc

```fc
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail) asm "CONS";
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";
forall X -> X car(tuple list) asm "CAR";
tuple cdr(tuple list) asm "CDR";
tuple empty_tuple() asm "NIL";
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";
forall X -> [X] single(X x) asm "SINGLE";
forall X -> X unsingle([X] t) asm "UNSINGLE";
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";
forall X -> X first(tuple t) asm "FIRST";
forall X -> X second(tuple t) asm "SECOND";
forall X -> X third(tuple t) asm "THIRD";
forall X -> X fourth(tuple t) asm "3 INDEX";
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";
forall X -> X null() asm "PUSHNULL";
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";

int now() asm "NOW";
slice my_address() asm "MYADDR";
[int, cell] get_balance() asm "BALANCE";
int cur_lt() asm "LTIME";
int block_lt() asm "BLOCKLT";

int cell_hash(cell c) asm "HASHCU";
int slice_hash(slice s) asm "HASHSU";
int string_hash(slice s) asm "SHA256U";

int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data() asm "c4 PUSH";
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y) asm "MIN";
int max(int x, int y) asm "MAX";
(int, int) minmax(int x, int y) asm "MINMAX";
int abs(int x) asm "ABS";

slice begin_parse(cell c) asm "CTOS";
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";
cell preload_ref(slice s) asm "PLDREF";
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";
slice first_bits(slice s, int len) asm "SDCUTFIRST";
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";
slice slice_last(slice s, int len) asm "SDCUTLAST";
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";
cell preload_dict(slice s) asm "PLDDICT";
slice skip_dict(slice s) asm "SKIPDICT";

(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";
cell preload_maybe_ref(slice s) asm "PLDOPTREF";
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";

int cell_depth(cell c) asm "CDEPTH";

int slice_refs(slice s) asm "SREFS";
int slice_bits(slice s) asm "SBITS";
(int, int) slice_bits_refs(slice s) asm "SBITREFS";
int slice_empty?(slice s) asm "SEMPTY";
int slice_data_empty?(slice s) asm "SDEMPTY";
int slice_refs_empty?(slice s) asm "SREMPTY";
int slice_depth(slice s) asm "SDEPTH";

int builder_refs(builder b) asm "BREFS";
int builder_bits(builder b) asm "BBITS";
int builder_depth(builder b) asm "BDEPTH";

builder begin_cell() asm "NEWC";
cell end_cell(builder b) asm "ENDC";
builder store_ref(builder b, cell c) asm(c b) "STREF";
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s) asm "STSLICER";
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_dict(builder b, cell c) asm(c b) "STDICT";

(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";
tuple parse_addr(slice s) asm "PARSEMSGADDR";
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";
cell new_dict() asm "NEWDICT";
int dict_empty?(cell c) asm "DICTEMPTY";

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x) asm "CONFIGOPTPARAM";
int cell_null?(cell c) asm "ISNULL";

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

int random() impure asm "RANDU256";
int rand(int range) impure asm "RAND";
int get_seed() impure asm "RANDSEED";
int set_seed() impure asm "SETRAND";
() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x) asm "STVARUINT16";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDVARUINT16";

int equal_slices (slice a, slice b) asm "SDEQ";
int builder_null?(builder b) asm "ISNULL";
builder store_builder(builder to, builder from) asm "STBR";


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

int min_tons_for_storage() asm "50000000 PUSHINT"; ;; 0.05 TON

;;
;;  Storage
;;
;;  uint64 index
;;  MsgAddressInt collection_address
;;  MsgAddressInt owner_address
;;  cell content
;;

(int, int, slice, slice, cell) load_data() {
    slice ds = get_data().begin_parse();
    var (index, collection_address) = (ds~load_uint(64), ds~load_msg_addr());
    if (ds.slice_bits() > 0) {
      return (-1, index, collection_address, ds~load_msg_addr(), ds~load_ref());
    } else {  
      return (0, index, collection_address, null(), null()); ;; nft not initialized yet
    }
}

() store_data(int index, slice collection_address, slice owner_address, cell content) impure {
    set_data(
        begin_cell()
            .store_uint(index, 64)
            .store_slice(collection_address)
            .store_slice(owner_address)
            .store_ref(content)
            .end_cell()
    );
}

() send_msg(slice to_address, int amount, int op, int query_id, builder payload, int send_mode) impure inline {
  var msg = begin_cell()
    .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 010000
    .store_slice(to_address)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_uint(op, 32)
    .store_uint(query_id, 64);

  if (~ builder_null?(payload)) {
    msg = msg.store_builder(payload);
  }

  send_raw_message(msg.end_cell(), send_mode);
}

() transfer_ownership(int my_balance, int index, slice collection_address, slice owner_address, cell content, slice sender_address, int query_id, slice in_msg_body, int fwd_fees) impure inline {
    throw_unless(401, equal_slices(sender_address, owner_address));

    slice new_owner_address = in_msg_body~load_msg_addr();
    force_chain(new_owner_address);
    slice response_destination = in_msg_body~load_msg_addr();
    in_msg_body~load_int(1); ;; this nft don't use custom_payload
    int forward_amount = in_msg_body~load_coins();

    int rest_amount = my_balance - min_tons_for_storage();
    if (forward_amount) {
      rest_amount -= (forward_amount + fwd_fees);
    }
    int need_response = response_destination.preload_uint(2) != 0; ;; if NOT addr_none: 00
    if (need_response) {
      rest_amount -= fwd_fees;
    }

    throw_unless(402, rest_amount >= 0); ;; base nft spends fixed amount of gas, will not check for response

    if (forward_amount) {
      send_msg(new_owner_address, forward_amount, op::ownership_assigned(), query_id, begin_cell().store_slice(owner_address).store_slice(in_msg_body), 1);  ;; paying fees, revert on errors
    }
    if (need_response) {
      force_chain(response_destination);
      send_msg(response_destination, rest_amount, op::excesses(), query_id, null(), 1); ;; paying fees, revert on errors
    }

    store_data(index, collection_address, new_owner_address, content);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) { ;; ignore empty messages
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) { ;; ignore all bounced messages
        return ();
    }
    slice sender_address = cs~load_msg_addr();

    cs~load_msg_addr(); ;; skip dst
    cs~load_coins(); ;; skip value
    cs~skip_bits(1); ;; skip extracurrency collection
    cs~load_coins(); ;; skip ihr_fee
    int fwd_fee = cs~load_coins(); ;; we use message fwd_fee for estimation of forward_payload costs


    (int init?, int index, slice collection_address, slice owner_address, cell content) = load_data();
    if (~ init?) {
      throw_unless(405, equal_slices(collection_address, sender_address));
      store_data(index, collection_address, in_msg_body~load_msg_addr(), in_msg_body~load_ref());
      return ();
    }

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    if (op == op::transfer()) {
      transfer_ownership(my_balance, index, collection_address, owner_address, content, sender_address, query_id, in_msg_body, fwd_fee);
      return ();
    }
    if (op == op::get_static_data()) {
      send_msg(sender_address, 0, op::report_static_data(), query_id, begin_cell().store_uint(index, 256).store_slice(collection_address), 64);  ;; carry all the remaining value of the inbound message
      return ();
    }
    throw(0xffff);
}

;;
;;  GET Methods
;;

(int, int, slice, slice, cell) get_nft_data() method_id {
  (int init?, int index, slice collection_address, slice owner_address, cell content) = load_data();
  return (init?, index, collection_address, owner_address, content);
}

```

## 4c9123828682fa6f43797ab41732bca890cae01766e0674100250516e0bf8d42/op-codes.fc

```fc
int op::transfer() asm "0x5fcc3d14 PUSHINT";
int op::ownership_assigned() asm "0x05138d91 PUSHINT";
int op::excesses() asm "0xd53276db PUSHINT";
int op::get_static_data() asm "0x2fcb26a2 PUSHINT";
int op::report_static_data() asm "0x8b771735 PUSHINT";
int op::get_royalty_params() asm "0x693d3950 PUSHINT";
int op::report_royalty_params() asm "0xa8cb00ad PUSHINT";

;; NFTEditable
int op::edit_content() asm "0x1a0b9d51 PUSHINT";
int op::transfer_editorship() asm "0x1c04412a PUSHINT";
int op::editorship_assigned() asm "0x511a4463 PUSHINT";

```

## 50b917d9fd5b95760993287677d04812a15aa55e6b71d0f9226ecd7c20c3d82a/imports/constants.fc

```fc
#pragma version >=0.4.4;


const int err::insufficient_fee = 101;
const int err::insufficient_funds = 102;
const int err::access_denied = 103;
const int err::only_basechain_allowed = 104;
const int err::receiver_is_sender = 105;
const int err::stopped = 106;
const int err::invalid_op = 107;
const int err::invalid_comment = 108;
const int err::invalid_parameters = 109;

const int err::not_accepting_loan_requests = 201;
const int err::unable_to_participate = 202;
const int err::too_soon_to_participate = 203;
const int err::not_ready_to_finish_participation = 204;
const int err::too_soon_to_finish_participation = 205;
const int err::vset_not_changed = 206;
const int err::vset_not_changeable = 207;
const int err::not_ready_to_burn_all = 208;

const int err::unexpected_validator_set_format = 304;


const int participation::open = 0;
const int participation::distributing = 1;
const int participation::staked = 2;
const int participation::validating = 3;
const int participation::held = 4;
const int participation::recovering = 5;
const int participation::burning = 6;


const int unstake::auto = 0;
const int unstake::instant = 1;
const int unstake::best = 2;


const int op::new_stake = 0x4e73744b;
const int op::new_stake_error = 0xee6f454c;
const int op::new_stake_ok = 0xf374484c;
const int op::recover_stake = 0x47657424;
const int op::recover_stake_error = 0xfffffffe;
const int op::recover_stake_ok = 0xf96f7324;

const int op::ownership_assigned = 0x05138d91;
const int op::get_static_data = 0x2fcb26a2;
const int op::report_static_data = 0x8b771735;

const int op::send_tokens = 0x0f8a7ea5;
const int op::receive_tokens = 0x178d4519;
const int op::transfer_notification = 0x7362d09c;
const int op::gas_excess = 0xd53276db;
const int op::unstake_tokens = 0x595f07bc;

const int op::provide_wallet_address = 0x2c76b973;
const int op::take_wallet_address = 0xd1735400;

const int op::prove_ownership = 0x04ded148;
const int op::ownership_proof = 0x0524c7ae;
const int op::ownership_proof_bounced = 0xc18e86d2;
const int op::request_owner = 0xd0c3bfea;
const int op::owner_info = 0x0dd607e3;
const int op::destroy = 0x1f04537a;
const int op::burn_bill = 0x6f89f5e3;

const int op::provide_current_quote = 0xad83913f;
const int op::take_current_quote = 0x0a420458;

const int op::deposit_coins = 0x3d3761a6;
const int op::send_unstake_all = 0x45baeda9;
const int op::reserve_tokens = 0x386a358b;
const int op::mint_tokens = 0x42684479;
const int op::burn_tokens = 0x7cffe1ee;
const int op::request_loan = 0x36335da9;
const int op::participate_in_election = 0x574a297b;
const int op::decide_loan_requests = 0x6a31d344;
const int op::process_loan_requests = 0x071d07cc;
const int op::vset_changed = 0x2f0b5b3b;
const int op::finish_participation = 0x23274435;
const int op::recover_stakes = 0x4f173d3e;
const int op::recover_stake_result = 0x0fca4c86;
const int op::last_bill_burned = 0xc6d8b51f;
const int op::propose_governor = 0x76ff2956;
const int op::accept_governance = 0x06e237e3;
const int op::set_halter = 0x16bb5b17;
const int op::set_stopped = 0x0e5e9773;
const int op::set_instant_mint = 0x535b09d2;
const int op::set_governance_fee = 0x470fe5f6;
const int op::set_rounds_imbalance = 0x1b4463b6;
const int op::send_message_to_loan = 0x0e93f65b;
const int op::retry_distribute = 0x6ec00c48;
const int op::retry_recover_stakes = 0x2b7ad9e8;
const int op::retry_mint_bill = 0x654de488;
const int op::retry_burn_all = 0x106b8001;
const int op::set_parent = 0x4f6f6eed;
const int op::proxy_set_content = 0x2b1c8e37;
const int op::withdraw_surplus = 0x23355ffb;
const int op::proxy_withdraw_surplus = 0x77a0bf77;
const int op::upgrade_code = 0x3d6a29b5;
const int op::proxy_upgrade_code = 0x78570010;
const int op::send_upgrade_wallet = 0x7ade1ed8;
const int op::migrate_wallet = 0x325aacfa;
const int op::proxy_add_library = 0x31cb87f7;
const int op::proxy_remove_library = 0x747bf3a2;
const int op::gift_coins = 0x3496db80;
const int op::top_up = 0x5372158c;

const int op::proxy_tokens_minted = 0x5be57626;
const int op::proxy_save_coins = 0x47daa10f;
const int op::proxy_reserve_tokens = 0x688b0213;
const int op::proxy_rollback_unstake = 0x32b67194;
const int op::proxy_tokens_burned = 0x4476fde0;
const int op::proxy_unstake_all = 0x76bd2760;
const int op::proxy_upgrade_wallet = 0x4664bc68;
const int op::proxy_migrate_wallet = 0x0cb246bb;
const int op::proxy_merge_wallet = 0x6833d7d0;
const int op::set_content = 0x04dc78b7;

const int op::tokens_minted = 0x5445efee;
const int op::save_coins = 0x4cce0e74;
const int op::rollback_unstake = 0x1b77fd1a;
const int op::tokens_burned = 0x5b512e25;
const int op::unstake_all = 0x5ae30148;
const int op::upgrade_wallet = 0x01d9ae1c;
const int op::merge_wallet = 0x63d3a76c;
const int op::withdraw_jettons = 0x768a50b2;

const int op::mint_bill = 0x4b2d7871;
const int op::bill_burned = 0x840f6369;
const int op::burn_all = 0x639d400a;

const int op::assign_bill = 0x3275dfc2;

const int op::proxy_new_stake = 0x089cd4d0;
const int op::proxy_recover_stake = 0x407cb243;

const int op::request_rejected = 0xcd0f2116;
const int op::loan_result = 0xfaaa8366;
const int op::take_profit = 0x8b556813;

const int op::withdrawal_notification = 0xf0fa223b;

const int op::add_library = 0x53d0473e;
const int op::remove_library = 0x6bd0ce52;


const int gas::send_tokens = 10528;
const int gas::receive_tokens = 11691;
const int gas::deposit_coins = 18741;
const int gas::proxy_save_coins = 6175;
const int gas::save_coins = 7091;
const int gas::mint_bill = 7757;
const int gas::assign_bill = 5960;
const int gas::burn_bill = 6558;
const int gas::bill_burned = 12316;
const int gas::mint_tokens = 12230;
const int gas::proxy_tokens_minted = 6841;
const int gas::tokens_minted = 13453;
const int gas::unstake_tokens = 9040;
const int gas::proxy_reserve_tokens = 6538;
const int gas::reserve_tokens = 15521;
const int gas::burn_tokens = 16627;
const int gas::proxy_tokens_burned = 7307;
const int gas::tokens_burned = 7179;
const int gas::send_unstake_all = 12967;
const int gas::proxy_unstake_all = 6553;
const int gas::unstake_all = 7423;
const int gas::upgrade_wallet = 7618;
const int gas::proxy_migrate_wallet = 7978;
const int gas::migrate_wallet = 12802;
const int gas::proxy_merge_wallet = 7841;
const int gas::merge_wallet = 7443;

const int gas::request_loan = 45000;
const int gas::participate_in_election = 29000;
const int gas::decide_loan_requests = 21000;
const int gas::process_loan_requests = 26000;
const int gas::proxy_new_stake = 8000;
const int gas::vset_changed = 11000;
const int gas::finish_participation = 13000;
const int gas::recover_stakes = 22000;
const int gas::proxy_recover_stake = 5000;
const int gas::recover_stake_result = 39000;
const int gas::burn_all = 8000;
const int gas::last_bill_burned = 19000;
const int gas::new_stake = 18000;
const int gas::new_stake_error = 6000;
const int gas::new_stake_ok = 2000;
const int gas::recover_stake = 11000;
const int gas::recover_stake_ok = 6000;


const int fee::treasury_storage = 10000000000; ;; 10 TON
const int fee::librarian_storage = 1000000000; ;; 1 TON
const int fee::new_stake_confirmation = 1000000000; ;; 1 TON


const int log::loan = 0x1;
const int log::repayment = 0x2;
const int log::finish = 0x3;
const int log::failed_burning_tokens = 0x4;


const int config::elector_address = 1;
const int config::election = 15;
const int config::validators = 16;
const int config::stake = 17;
const int config::previous_validators = 32;
const int config::current_validators = 34;
const int config::next_validators = 36;
const int config::misbehaviour_punishment = 40;


const int send::regular = 0;
const int send::pay_gas_separately = 1;
const int send::ignore_errors = 2;
const int send::bounce_if_failed = 16;
const int send::destroy_if_zero = 32;
const int send::remaining_value = 64;
const int send::unreserved_balance = 128;


const int reserve::exact = 0;
const int reserve::all_but_amount = 1;
const int reserve::at_most = 2;
const int reserve::add_original_balance = 4;
const int reserve::negate = 8;
const int reserve::bounce_if_failed = 16;


const int chain::main = -1;
const int chain::base = 0;


const int gas_limit = 1000000;

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
forall X -> tuple cons(X head, tuple tail) asm "CONS";

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list) asm "CAR";

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list) asm "CDR";

;;; Creates tuple with zero elements.
tuple empty_tuple() asm "NIL";

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x) asm "SINGLE";

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t) asm "UNSINGLE";

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t) asm "FIRST";

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t) asm "SECOND";

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t) asm "THIRD";

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t) asm "3 INDEX";

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";


;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null() asm "PUSHNULL";

;;; Moves a variable [x] to the top of the stack
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";



;;; Returns the current Unix time as an Integer
int now() asm "NOW";

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address() asm "MYADDR";

;;; Returns the code of the current smart contract.
cell my_code() asm "MYCODE";

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance() asm "BALANCE";

;;; Returns the incoming value to the smart contract as a tuple consisting of an int
;;; (value in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the incoming value of "extra currencies").
[int, cell] get_incoming_value() asm "INCOMINGVALUE";

;;; Returns value in nanotoncoins of storage phase fees.
int get_storage_fees() asm "STORAGEFEES";

;;; Returns the logical time of the current transaction.
int cur_lt() asm "LTIME";

;;; Returns the starting logical time of the current block.
int block_lt() asm "BLOCKLT";

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c) asm "HASHCU";

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s) asm "HASHSU";

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s) asm "SHA256U";

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
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

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
cell get_data() asm "c4 PUSH";

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
int gas_consumed() asm "GASCONSUMED";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y) asm "MIN";

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y) asm "MAX";

;;; Sorts two integers.
(int, int) minmax(int x, int y) asm "MINMAX";

;;; Computes the absolute value of an integer [x].
int abs(int x) asm "ABS";

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
slice begin_parse(cell c) asm "CTOS";

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";

;;; Preloads the first reference from the slice.
cell preload_ref(slice s) asm "PLDREF";

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
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDGRAMS";

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len) asm "SDCUTFIRST";

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len) asm "SDCUTLAST";

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";
(slice, ()) ~skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s) asm "PLDOPTREF";


;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c) asm "CDEPTH";


{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s) asm "SREFS";

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s) asm "SBITS";

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s) asm "SBITREFS";

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).
int slice_empty?(slice s) asm "SEMPTY";

;;; Checks whether `slice` [s] has no bits of data.
int slice_data_empty?(slice s) asm "SDEMPTY";

;;; Checks whether `slice` [s] has no references.
int slice_refs_empty?(slice s) asm "SREMPTY";

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s) asm "SDEPTH";

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b) asm "BREFS";

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b) asm "BBITS";

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b) asm "BDEPTH";

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell() asm "NEWC";

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b) asm "ENDC";

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c) asm(c b) "STREF";

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";


;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s) asm "STSLICER";

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_coins(builder b, int x) asm "STGRAMS";

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c) asm(c b) "STDICT";

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";


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
(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s) asm "PARSEMSGADDR";

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

{-
  # Dictionary primitives
-}


;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";

cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict_delete_get_min?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict_delete_get_min?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict_delete_get_min?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict_delete_get_max?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict_delete_get_max?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict_delete_get_max?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict() asm "NEWDICT";
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.
int dict_empty?(cell c) asm "DICTEMPTY";


{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x) asm "CONFIGOPTPARAM";
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.
int cell_null?(cell c) asm "ISNULL";

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
int random() impure asm "RANDU256";
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
int rand(int range) impure asm "RAND";
;;; Returns the current random seed as an unsigned 256-bit Integer.
int get_seed() impure asm "RANDSEED";
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b) asm "SDEQ";

;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";

;;; Checking that `slice` [s] is a addr_none constuction;
int addr_none?(slice s) asm "b{00} PUSHSLICE SDEQ";

int get_storage_fee(int cells, int bits, int seconds, int is_mc?) asm "GETSTORAGEFEE";
int get_compute_fee(int gas_used, int is_mc?) asm "GETGASFEE";
int get_forward_fee(int cells, int bits, int is_mc?) asm "GETFORWARDFEE";
int get_original_fwd_fee(int fwd_fee, int is_mc?) asm "GETORIGINALFWDFEE";

```

## 50b917d9fd5b95760993287677d04812a15aa55e6b71d0f9226ecd7c20c3d82a/imports/utils.fc

```fc
#include "stdlib.fc";
#include "constants.fc";

builder to_builder(slice s) inline {
    return begin_cell().store_slice(s);
}

builder store_state_init(builder b, builder state_init) inline {
    return state_init.null?()
        ? b.store_uint(0, 1)
        : b.store_uint(2 + 0, 1 + 1).store_builder(state_init);
}

builder store_body(builder b, builder body) inline {
    return body.builder_bits() <= 513
        ? b.store_uint(0, 1).store_builder(body)
        : b.store_maybe_ref(body.end_cell());
}

builder store_log(builder b, builder log) inline {
    return log.builder_bits() <= 654
        ? b.store_uint(0, 1).store_builder(log)
        : b.store_maybe_ref(log.end_cell());
}

() send_msg(int bounceable?, builder dst, builder state_init, builder body, int coins, int mode) impure inline_ref {
    ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
    ;;   src:MsgAddress dest:MsgAddressInt
    ;;   value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
    ;;   created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
    ;; message$_ {X:Type} info:CommonMsgInfoRelaxed
    ;;   init:(Maybe (Either StateInit ^StateInit))
    ;;   body:(Either X ^X) = MessageRelaxed X;
    cell msg = begin_cell()
        .store_uint(bounceable? ? 0x18 : 0x10, 6) ;; 011000 or 010000
        .store_builder(dst)
        .store_coins(coins)
        .store_uint(0, 1 + 4 + 4 + 64 + 32)
        .store_state_init(state_init)
        .store_body(body)
        .end_cell();
    send_raw_message(msg, mode);
}

() emit_log(int topic, builder log) impure inline_ref {
    ;; addr_extern$01 len:(## 9) external_address:(bits len) = MsgAddressExt;
    ;; ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
    ;;   created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
    ;; message$_ {X:Type} info:CommonMsgInfoRelaxed
    ;;   init:(Maybe (Either StateInit ^StateInit))
    ;;   body:(Either X ^X) = MessageRelaxed X;
    cell msg = begin_cell()
        .store_uint(0x31, 2 + 2 + 2) ;; 110001
        .store_uint(256, 9)
        .store_uint(topic, 256)
        .store_uint(0, 64 + 32 + 1)
        .store_log(log)
        .end_cell();
    send_raw_message(msg, send::regular);
}

() log_loan
( int round_since
, int min_payment
, int borrower_reward_share
, int loan_amount
, int accrue_amount
, int stake_amount
, builder borrower
) impure inline {
    builder log = begin_cell()
        .store_uint(round_since, 32)
        .store_coins(min_payment)
        .store_uint(borrower_reward_share, 8)
        .store_coins(loan_amount)
        .store_coins(accrue_amount)
        .store_coins(stake_amount)
        .store_builder(borrower);
    emit_log(log::loan, log);
}

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
    builder log = begin_cell()
        .store_uint(round_since, 32)
        .store_coins(repayment_amount)
        .store_coins(loan_amount)
        .store_coins(accrue_amount)
        .store_coins(stakers_share)
        .store_coins(governor_share)
        .store_coins(borrower_share)
        .store_slice(borrower);
    emit_log(log::repayment, log);
}

() log_finish(int round_since, int total_staked, int total_recovered, int total_coins, int total_tokens) impure inline {
    builder log = begin_cell()
        .store_uint(round_since, 32)
        .store_coins(total_staked)
        .store_coins(total_recovered)
        .store_coins(total_coins)
        .store_coins(total_tokens);
    emit_log(log::finish, log);
}

() log_failed_burning_tokens
( int round_since
, int total_coins
, int total_tokens
, int coins
, int tokens
, slice owner
) impure inline {
    builder log = begin_cell()
        .store_uint(round_since, 32)
        .store_coins(total_coins)
        .store_coins(total_tokens)
        .store_coins(coins)
        .store_coins(tokens)
        .store_slice(owner);
    emit_log(log::failed_burning_tokens, log);
}

(int, int) get_elector() inline {
    ;; _ elector_addr:bits256 = ConfigParam 1;
    return ( chain::main, config_param(config::elector_address).begin_parse().preload_uint(256) );
}

(int, int, int, int) get_election_config() inline {
    ;; _ validators_elected_for:uint32 elections_start_before:uint32
    ;;   elections_end_before:uint32 stake_held_for:uint32
    ;;   = ConfigParam 15;
    slice cs = config_param(config::election).begin_parse();
    return ( cs~load_uint(32), cs~load_uint(32), cs~load_uint(32), cs~load_uint(32) );
}

(int, int, int) get_validators_config() inline {
    ;; _ max_validators:(## 16) max_main_validators:(## 16) min_validators:(## 16)
    ;;   { max_validators >= max_main_validators }
    ;;   { max_main_validators >= min_validators }
    ;;   { min_validators >= 1 }
    ;;   = ConfigParam 16;
    slice cs = config_param(config::validators).begin_parse();
    return ( cs~load_uint(16), cs~load_uint(16), cs~load_uint(16) );
}

(int, int, int, int) get_stake_config() inline {
    ;; _ min_stake:Grams max_stake:Grams min_total_stake:Grams max_stake_factor:uint32 = ConfigParam 17;
    slice cs = config_param(config::stake).begin_parse();
    return ( cs~load_coins(), cs~load_coins(), cs~load_coins(), cs~load_uint(32) );
}

(int, int) get_vset_times(int i) inline_ref {
    ;; validators_ext#12 utime_since:uint32 utime_until:uint32
    ;;   total:(## 16) main:(## 16) { main <= total } { main >= 1 }
    ;;   total_weight:uint64 list:(HashmapE 16 ValidatorDescr) = ValidatorSet;
    slice cs = config_param(i).begin_parse();
    throw_unless(err::unexpected_validator_set_format, cs~load_uint(8) == 0x12);
    return ( cs~load_uint(32), cs~load_uint(32) );
}

builder create_state_init(cell code, cell data) inline {
    ;; _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
    ;;   code:(Maybe ^Cell) data:(Maybe ^Cell)
    ;;   library:(HashmapE 256 SimpleLib) = StateInit;
    return begin_cell()
        .store_uint(6, 5) ;; 00110
        .store_ref(code)
        .store_ref(data);
}

builder create_address(int wc, int addr) inline_ref {
    ;; addr_std$10 anycast:(Maybe Anycast)
    ;;   workchain_id:int8 address:bits256  = MsgAddressInt;
    return begin_cell()
        .store_uint(4, 3) ;; 100
        .store_int(wc, 8)
        .store_uint(addr, 256);
}

cell create_collection_data(slice treasury, int round_since, cell bill_code) inline {
    return begin_cell()
        .store_slice(treasury)
        .store_uint(round_since, 32)
        .store_uint(0, 64)
        .store_ref(bill_code)
        .end_cell();
}

cell create_bill_data(int index, slice collection) inline {
    return begin_cell()
        .store_uint(index, 64)
        .store_slice(collection)
        .store_uint(0, 32)
        .store_uint(0, 9) ;; 00 (addr_none) + 00 (addr_none) + 0 (unstake) + 0000 (amount)
        .end_cell();
}

cell create_wallet_data(builder owner, slice parent) inline {
    return begin_cell()
        .store_builder(owner)
        .store_slice(parent)
        .store_coins(0) ;; tokens
        .store_dict(null()) ;; staking
        .store_coins(0) ;; unstaking
        .end_cell();
}

cell create_loan_data(slice treasury, builder borrower, int round_since) inline {
    return begin_cell()
        .store_uint(0, 2) ;; addr_none for elector
        .store_slice(treasury)
        .store_builder(borrower)
        .store_uint(round_since, 32)
        .end_cell();
}

(builder, builder, int) create_collection_address(slice treasury, int round_since, cell bill_code, cell code) inline_ref {
    cell collection_data = create_collection_data(treasury, round_since, bill_code);
    builder state_init = create_state_init(code, collection_data);
    int addr = state_init.end_cell().cell_hash();
    builder collection = create_address(chain::base, addr);
    return (collection, state_init, addr);
}

(builder, builder, int) create_bill_address(int index, slice collection, cell bill_code) inline_ref {
    cell bill_data = create_bill_data(index, collection);
    builder state_init = create_state_init(bill_code, bill_data);
    int addr = state_init.end_cell().cell_hash();
    builder bill = create_address(chain::base, addr);
    return (bill, state_init, addr);
}

(builder, builder, int) create_wallet_address(builder owner, slice parent, cell wallet_code) inline_ref {
    cell wallet_data = create_wallet_data(owner, parent);
    builder state_init = create_state_init(wallet_code, wallet_data);
    int addr = state_init.end_cell().cell_hash();
    builder wallet = create_address(chain::base, addr);
    return (wallet, state_init, addr);
}

(builder, builder, int) create_loan_address(slice treasury, builder borrower, int round_since, cell loan_code) inline_ref {
    cell loan_data = create_loan_data(treasury, borrower, round_since);
    builder state_init = create_state_init(loan_code, loan_data);
    int addr = state_init.end_cell().cell_hash();
    builder loan = create_address(chain::main, addr);
    return (loan, state_init, addr);
}

builder chars_to_string(tuple chars) inline {
    builder b = begin_cell();
    do {
        int char = chars~list_next();
        b = b.store_uint(char, 8);
    } until chars.null?();
    return b;
}

builder int_to_string(int n) inline {
    tuple chars = null();
    do {
        int r = n~divmod(10);
        chars = cons(r + "0"u, chars);
    } until n == 0;
    return chars_to_string(chars);
}

builder int_to_ton(int n) inline {
    tuple chars = null();
    int len = 0;
    do {
        int r = n~divmod(10);
        chars = cons(r + "0"u, chars);
        len += 1;
        if len == 9 {
            chars = cons("."u, chars);
            len += 1;
        }
    } until n == 0;
    while len < 9 {
        chars = cons("0"u, chars);
        len += 1;
    }
    if len == 9 {
        chars = cons("."u, chars);
        len += 1;
    }
    if len == 10 {
        chars = cons("0"u, chars);
    }
    return chars_to_string(chars);
}

int request_sort_key(int min_payment, int borrower_reward_share, int loan_amount) inline_ref {
    ;; sort based on:
    ;;   1. efficieny
    ;;   2. treasury reward share
    ;;   3. least loan amount
    int treasury_reward_share = 255 - borrower_reward_share;
    int min_payment_round = min_payment >> 30; ;; round to around 1 TON
    int loan_amount_round = max(1, loan_amount >> 40); ;; round to around 1100 TON
    int loan_amount_round_comp = (1 << 80) - loan_amount_round;
    int efficieny = min((1 << 24) - 1, muldiv(min_payment_round, 1000, loan_amount_round));
    return (efficieny << (8 + 80)) + (treasury_reward_share << 80) + loan_amount_round_comp;
}

() check_new_stake_msg(slice cs) impure inline {
    cs~skip_bits(256 + 32 + 32 + 256);
    slice ss = cs~load_ref().begin_parse();
    cs.end_parse();
    ss~skip_bits(512);
    ss.end_parse();
}

;; https://github.com/ton-blockchain/ton/blob/ae5c0720143e231c32c3d2034cfe4e533a16d969/crypto/block/block.tlb#L721
int max_recommended_punishment_for_validator_misbehaviour(int stake) inline_ref {
    ;; misbehaviour_punishment_config_v1#01
    ;;   default_flat_fine:Grams default_proportional_fine:uint32
    ;;   severity_flat_mult:uint16 severity_proportional_mult:uint16
    ;;   unpunishable_interval:uint16
    ;;   long_interval:uint16 long_flat_mult:uint16 long_proportional_mult:uint16
    ;;   medium_interval:uint16 medium_flat_mult:uint16 medium_proportional_mult:uint16
    ;;    = MisbehaviourPunishmentConfig;
    ;; _ MisbehaviourPunishmentConfig = ConfigParam 40;

    cell cp = config_param(config::misbehaviour_punishment);
    if cell_null?(cp) {
        ;; 101 TON - https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/lite-client/lite-client.cpp#L3678
        return 101000000000;
    }

    slice cs = cp.begin_parse();

    ( int prefix
    , int default_flat_fine, int default_proportional_fine
    , int severity_flat_mult, int severity_proportional_mult
    , int unpunishable_interval
    , int long_interval, int long_flat_mult, int long_proportional_mult
    ) = ( cs~load_uint(8)
        , cs~load_coins(), cs~load_uint(32)
        , cs~load_uint(16), cs~load_uint(16)
        , cs~load_uint(16)
        , cs~load_uint(16), cs~load_uint(16), cs~load_uint(16)
    );

    ;; https://github.com/ton-blockchain/ton/blob/master/lite-client/lite-client.cpp#L3721
    int fine = default_flat_fine;
    int fine_part = default_proportional_fine;

    fine *= severity_flat_mult;
    fine >>= 8;
    fine_part *= severity_proportional_mult;
    fine_part >>= 8;

    fine *= long_flat_mult;
    fine >>= 8;
    fine_part *= long_proportional_mult;
    fine_part >>= 8;

    ;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L529
    return min(stake, fine + muldiv(stake, fine_part, 1 << 32));
}

int parent_storage_fee() inline_ref {
    int cells = 1 + 1 + 11; ;; 1 (parent storage) + 1 (wallet_code) + 11 (content)
    int bits = 124 + 267 + 5 * (256 + 8 * 30); ;; 124 (total_tokens) + 267 (treasury) + 5 entries in content
    int duration = 60 * 60 * 24 * 365 * 2; ;; 2 years in seconds
    return get_storage_fee(cells, bits, duration, false); ;; currently near 0.01 TON
}

int wallet_storage_fee() inline_ref {
    int cells = 1 + 1;
    int bits = 267 + 267 + 124; ;; staking and unstaking amounts are short lived, and ignored here
    int duration = 60 * 60 * 24 * 365 * 5; ;; 5 years in seconds
    return get_storage_fee(cells, bits, duration, false); ;; currently near 0.004 TON
}

int collection_storage_fee() inline_ref {
    int cells = 1 + 1;
    int bits = 267 + 32 + 64 + 264;
    ( int validators_elected_for, _, _, _ ) = get_election_config();
    int duration = 2 * validators_elected_for;
    return get_storage_fee(cells, bits, duration, false); ;; currently near 0.0000004 TON
}

int bill_storage_fee() inline_ref {
    int cells = 1;
    int bits = 64 + 267 + 32 + 267 + 267 + 1 + 124;
    ( int validators_elected_for, _, _, _ ) = get_election_config();
    int duration = 2 * validators_elected_for;
    return get_storage_fee(cells, bits, duration, false); ;; currently near 0.0000004 TON
}

(int, int) loan_storage_fee() inline_ref {
    ;; 1 round validation, 1 round participation and stake held, 1 round for prolonged rounds, 1 round to be safe
    ( int validators_elected_for, _, _, _ ) = get_election_config();
    int duration = 4 * validators_elected_for;

    ;; loan smart contract storage on main chain while validating
    int cells1 = 1;
    int bits1 = 267 + 267 + 267 + 32;

    int mc_fee = get_storage_fee(cells1, bits1, duration, true);

    int cells2 = 1 + 1 + 1 + ;; storage of loan request while participating
            2 + 4 + 2; ;; sotrage of participation while participating
    int bits2 = 124 + 8 + 124 + 124 + 124 + 256 + 32 + 32 + 256 + 512 +
            32 + 4 + 16 + 1 + 112 + 256 + 6 + 256 + 124 + 124 + 256 + 32 + 32;
    int fee = get_storage_fee(cells2, bits2, duration, false);

    return ( mc_fee, fee ); ;; currently near 0.0006 TON
}

int send_tokens_fee() {
    int storage_fee = wallet_storage_fee();

    int compute_gas =
        gas::send_tokens +
        gas::receive_tokens;
    int compute_fee = get_compute_fee(compute_gas, false);

    return storage_fee + compute_fee;
}

(int, int) deposit_coins_fee(int ownership_assigned_amount) {
    int storage_fee = wallet_storage_fee();

    int compute_gas =
        gas::deposit_coins +
        gas::proxy_save_coins +
        gas::save_coins +
        gas::mint_bill +
        gas::assign_bill +
        gas::burn_bill +
        gas::bill_burned +
        gas::mint_tokens +
        gas::proxy_tokens_minted +
        gas::tokens_minted;
    int compute_fee = get_compute_fee(compute_gas, false);

    int s_fwd_fee = get_forward_fee(0, 0, false);
    int m_fwd_fee = get_forward_fee(1, 1023, false);
    int l_fwd_fee = get_forward_fee(1 + 3, 1023 * 2, false);
    int forward_fee =
        m_fwd_fee + ;; proxy_save_coins
        l_fwd_fee + ;; save_coins
        l_fwd_fee + ;; mint_bill
        l_fwd_fee + ;; assign_bill
        s_fwd_fee + ;; ownership_assigned
        s_fwd_fee + ;; burn_bill
        m_fwd_fee + ;; bill_burned
        m_fwd_fee + ;; mint_tokens
        m_fwd_fee + ;; proxy_tokens_minted
        l_fwd_fee; ;; tokens_minted

    int total = storage_fee + compute_fee + forward_fee + ownership_assigned_amount;

    int proxy_compute_gas =
        gas::proxy_save_coins +
        gas::save_coins;
    int proxy_compute_fee = get_compute_fee(proxy_compute_gas, false);

    int proxy_forward_fee =
        l_fwd_fee; ;; save_coins

    int proxy_save_coins_fee = storage_fee + proxy_compute_fee + proxy_forward_fee;

    return ( total, proxy_save_coins_fee );
}

int unstake_tokens_fee() {
    int compute_gas =
        gas::unstake_tokens +
        gas::proxy_reserve_tokens +
        gas::reserve_tokens +
        gas::mint_bill +
        gas::assign_bill +
        gas::burn_bill +
        gas::bill_burned +
        gas::burn_tokens +
        gas::mint_bill +   ;; second try
        gas::assign_bill + ;; second try
        gas::burn_bill +   ;; second try
        gas::bill_burned + ;; second try
        gas::burn_tokens + ;; second try
        gas::proxy_tokens_burned +
        gas::tokens_burned;
    int compute_fee = get_compute_fee(compute_gas, false);

    int s_fwd_fee = get_forward_fee(0, 0, false);
    int m_fwd_fee = get_forward_fee(1, 1023, false);
    int l_fwd_fee = get_forward_fee(1 + 3, 1023 * 2, false);
    int forward_fee =
        m_fwd_fee + ;; proxy_reserve_tokens
        m_fwd_fee + ;; reserve_tokens
        l_fwd_fee + ;; mint_bill
        l_fwd_fee + ;; assign_bill
        s_fwd_fee + ;; ownership_assigned
        s_fwd_fee + ;; burn_bill
        m_fwd_fee + ;; bill_burned
        m_fwd_fee + ;; burn_tokens
        l_fwd_fee + ;; mint_bill - second try
        l_fwd_fee + ;; assign_bill - second try
        s_fwd_fee + ;; burn_bill - second try
        m_fwd_fee + ;; bill_burned - second try
        m_fwd_fee + ;; burn_tokens - second try
        m_fwd_fee + ;; proxy_tokens_burned
        m_fwd_fee; ;; tokens_burned

    return compute_fee + forward_fee;
}

int unstake_all_fee() {
    int compute_gas =
        gas::send_unstake_all +
        gas::proxy_unstake_all +
        gas::unstake_all +
        gas::unstake_tokens +
        gas::proxy_reserve_tokens +
        gas::reserve_tokens +
        gas::mint_bill +
        gas::assign_bill +
        gas::burn_bill +
        gas::bill_burned +
        gas::burn_tokens +
        gas::mint_bill +   ;; second try
        gas::assign_bill + ;; second try
        gas::burn_bill +   ;; second try
        gas::bill_burned + ;; second try
        gas::burn_tokens + ;; second try
        gas::proxy_tokens_burned +
        gas::tokens_burned;
    int compute_fee = get_compute_fee(compute_gas, false);

    int s_fwd_fee = get_forward_fee(0, 0, false);
    int m_fwd_fee = get_forward_fee(1, 1023, false);
    int l_fwd_fee = get_forward_fee(1 + 3, 1023 * 2, false);
    int forward_fee =
        m_fwd_fee + ;; proxy_unstake_all
        s_fwd_fee + ;; unstake_all
        s_fwd_fee + ;; unstake_tokens
        m_fwd_fee + ;; proxy_reserve_tokens
        m_fwd_fee + ;; reserve_tokens
        l_fwd_fee + ;; mint_bill
        l_fwd_fee + ;; assign_bill
        s_fwd_fee + ;; ownership_assigned
        s_fwd_fee + ;; burn_bill
        m_fwd_fee + ;; bill_burned
        m_fwd_fee + ;; burn_tokens
        l_fwd_fee + ;; mint_bill - second try
        l_fwd_fee + ;; assign_bill - second try
        s_fwd_fee + ;; burn_bill - second try
        m_fwd_fee + ;; bill_burned - second try
        m_fwd_fee + ;; burn_tokens - second try
        m_fwd_fee + ;; proxy_tokens_burned
        m_fwd_fee; ;; tokens_burned

    return compute_fee + forward_fee;
}

(int, int, int) request_loan_fee() {
    ( int mc_storage_fee, int storage_fee ) = loan_storage_fee();

    int compute_gas =
        gas::request_loan +
        gas::participate_in_election +
        gas::decide_loan_requests +
        gas::process_loan_requests +
        gas::vset_changed +
        gas::vset_changed +
        gas::finish_participation +
        gas::recover_stakes +
        gas::recover_stake_result +
        gas::burn_all +
        gas::last_bill_burned;
    int mc_compute_gas =
        gas::proxy_new_stake +
        gas::new_stake + ;; beware, it's out of our control since it's in elector
        gas::new_stake_error +
        gas::new_stake_ok +
        gas::proxy_recover_stake +
        gas::recover_stake + ;; beware, it's out of our control since it's in elector
        gas::recover_stake_ok;
    int compute_fee = get_compute_fee(compute_gas, false) + get_compute_fee(mc_compute_gas, true);

    int s_fwd_fee = get_forward_fee(0, 0, false);
    int l_fwd_fee = get_forward_fee(1 + 3, 1023 * 2, false);
    int mc_s_fwd_fee = get_forward_fee(0, 0, true);
    int mc_m_fwd_fee = get_forward_fee(2, 1023 * 2, true);
    int mc_l_fwd_fee = get_forward_fee(2 + 3, 1023 * 2, true);
    int forward_fee =
        s_fwd_fee + ;; participate_in_election
        s_fwd_fee + ;; decide_loan_requests
        s_fwd_fee + ;; process_loan_requests
        mc_l_fwd_fee + ;; proxy_new_stake
        mc_m_fwd_fee + ;; new_stake
        mc_s_fwd_fee + ;; new_stake_error or new_stake_ok
        s_fwd_fee + ;; vset_changed
        s_fwd_fee + ;; vset_changed
        s_fwd_fee + ;; finish_participation
        s_fwd_fee + ;; recover_stakes
        mc_s_fwd_fee + ;; proxy_recover_stake
        mc_s_fwd_fee + ;; recover_stake
        mc_s_fwd_fee + ;; recover_stake_ok
        mc_m_fwd_fee + ;; recover_stake_result
        s_fwd_fee + ;; loan_result
        s_fwd_fee + ;; take_profit
        l_fwd_fee + ;; burn_all
        s_fwd_fee; ;; last_bill_burned

    int total = mc_storage_fee + storage_fee + compute_fee + forward_fee;

    int proxy_mc_compute_gas =
        gas::proxy_new_stake +
        gas::new_stake + ;; beware, it's out of our control since it's in elector
        gas::new_stake_error +
        gas::new_stake_ok;
    int proxy_compute_fee = get_compute_fee(proxy_mc_compute_gas, true);

    int proxy_forward_fee =
        mc_l_fwd_fee + ;; proxy_new_stake
        mc_m_fwd_fee + ;; new_stake
        mc_s_fwd_fee + ;; new_stake_error or new_stake_ok
        mc_m_fwd_fee; ;; recover_stake_result

    int proxy_new_stake_fee = proxy_compute_fee + proxy_forward_fee;

    int recover_mc_compute_gas =
        gas::proxy_recover_stake +
        gas::recover_stake + ;; beware, it's out of our control since it's in elector
        gas::recover_stake_ok;
    int recover_compute_fee = get_compute_fee(recover_mc_compute_gas, true);

    int recover_forward_fee =
        mc_s_fwd_fee + ;; proxy_recover_stake
        mc_s_fwd_fee + ;; recover_stake
        mc_s_fwd_fee + ;; recover_stake_ok
        mc_m_fwd_fee; ;; recover_stake_result

    int recover_stake_fee = mc_storage_fee + recover_compute_fee + recover_forward_fee;

    return ( total, proxy_new_stake_fee, recover_stake_fee );
}

int burn_all_fee() {
    int compute_gas =
        gas::burn_all +
        gas::burn_bill +
        gas::last_bill_burned;
    int compute_fee = get_compute_fee(compute_gas, false);

    int s_fwd_fee = get_forward_fee(0, 0, false);
    int l_fwd_fee = get_forward_fee(1 + 3, 1023 * 2, false);
    int forward_fee =
        l_fwd_fee + ;; burn_all
        s_fwd_fee; ;; last_bill_burned

    return compute_fee + forward_fee;
}

int last_bill_burned_fee() {
    int compute_gas =
        gas::last_bill_burned;
    int compute_fee = get_compute_fee(compute_gas, false);

    return compute_fee;
}

int burn_bill_fee() {
    int compute_gas =
        gas::burn_bill +
        gas::bill_burned;
    int compute_fee = get_compute_fee(compute_gas, false);

    int m_fwd_fee = get_forward_fee(1, 1023, false);
    int forward_fee =
        m_fwd_fee; ;; bill_burned

    return compute_fee + forward_fee;
}

int upgrade_wallet_fee() {
    int compute_gas =
        gas::upgrade_wallet +
        gas::proxy_migrate_wallet +
        gas::migrate_wallet +
        gas::proxy_merge_wallet +
        gas::merge_wallet;
    int compute_fee = get_compute_fee(compute_gas, false);

    int m_fwd_fee = get_forward_fee(1, 1023, false);
    int l_fwd_fee = get_forward_fee(1 + 3, 1023 * 2, false);
    int forward_fee =
        m_fwd_fee + ;; proxy_migrate_wallet
        m_fwd_fee + ;; migrate_wallet
        m_fwd_fee + ;; proxy_merge_wallet
        l_fwd_fee; ;; merge_wallet

    return compute_fee + forward_fee;
}

int merge_wallet_fee() {
    int compute_gas =
        gas::migrate_wallet +
        gas::proxy_merge_wallet +
        gas::merge_wallet;
    int compute_fee = get_compute_fee(compute_gas, false);

    int m_fwd_fee = get_forward_fee(1, 1023, false);
    int l_fwd_fee = get_forward_fee(1 + 3, 1023 * 2, false);
    int forward_fee =
        m_fwd_fee + ;; proxy_merge_wallet
        l_fwd_fee; ;; merge_wallet

    return compute_fee + forward_fee;
}

int max_gas_fee() {
    return get_compute_fee(gas_limit, false);
}

```

## 50b917d9fd5b95760993287677d04812a15aa55e6b71d0f9226ecd7c20c3d82a/wallet.fc

```fc
#include "imports/utils.fc";

global slice owner;
global slice parent;
global int tokens;
global cell staking;
global int unstaking;

() save_data() impure inline_ref {
    begin_cell()
        .store_slice(owner)
        .store_slice(parent)
        .store_coins(tokens)
        .store_dict(staking)
        .store_coins(unstaking)
        .end_cell()
        .set_data();
}

() load_data() impure inline_ref {
    slice ds = get_data().begin_parse();
    owner = ds~load_msg_addr();
    parent = ds~load_msg_addr();
    tokens = ds~load_coins();
    staking = ds~load_dict();
    unstaking = ds~load_coins();
    ds.end_parse();
}

() send_tokens(slice src, slice s, int fwd_fee) impure inline {
    int query_id = s~load_uint(64);
    int amount = s~load_coins();
    slice recipient = s~load_msg_addr();
    slice return_excess = s~load_msg_addr();
    s~load_maybe_ref(); ;; skip custom_payload
    int forward_ton_amount = s~load_coins();
    slice forward_payload = s;
    s~skip_dict(); ;; check either field
    s~impure_touch();

    if return_excess.addr_none?() {
        return_excess = src;
    }

    ( int recipient_wc, _ ) = parse_std_addr(recipient);
    ( builder wallet, builder state_init, _ ) = create_wallet_address(recipient.to_builder(), parent, my_code());
    int incoming_ton = get_incoming_value().pair_first();
    int fee = send_tokens_fee() + forward_ton_amount + (forward_ton_amount ? 2 : 1) * fwd_fee;
    int enough_fee? = incoming_ton >= fee;

    throw_unless(err::only_basechain_allowed, recipient_wc == chain::base);
    throw_unless(err::access_denied, equal_slice_bits(src, owner));
    throw_unless(err::insufficient_fee, enough_fee?);
    throw_unless(err::insufficient_funds, amount <= tokens);
    throw_if(err::receiver_is_sender, equal_slice_bits(recipient, owner));

    tokens -= amount;

    builder receive = begin_cell()
        .store_uint(op::receive_tokens, 32)
        .store_uint(query_id, 64)
        .store_coins(amount)
        .store_slice(owner)
        .store_slice(return_excess)
        .store_coins(forward_ton_amount)
        .store_slice(forward_payload);
    send_msg(true, wallet, state_init, receive, 0, send::remaining_value);
}

() receive_tokens(slice src, slice s) impure inline {
    int query_id = s~load_uint(64);
    int amount = s~load_coins();
    slice sender = s~load_msg_addr();
    slice return_excess = s~load_msg_addr();
    int forward_ton_amount = s~load_coins();
    slice forward_payload = s;

    ( _, _, int wallet_addr ) = create_wallet_address(sender.to_builder(), parent, my_code());
    ( int src_wc, int src_addr ) = parse_std_addr(src);

    throw_unless(err::access_denied, (src_wc == chain::base) & (src_addr == wallet_addr));

    tokens += amount;

    if forward_ton_amount {
        builder notification = begin_cell()
            .store_uint(op::transfer_notification, 32)
            .store_uint(query_id, 64)
            .store_coins(amount)
            .store_slice(sender)
            .store_slice(forward_payload);
        send_msg(false, owner.to_builder(), null(), notification, forward_ton_amount,
            send::pay_gas_separately + send::bounce_if_failed
        );
    }

    raw_reserve(wallet_storage_fee(), reserve::at_most);

    builder excess = begin_cell()
        .store_uint(op::gas_excess, 32)
        .store_uint(query_id, 64);
    send_msg(false, return_excess.to_builder(), null(), excess, 0, send::unreserved_balance + send::ignore_errors);
}

() tokens_minted(slice src, slice s) impure inline {
    int query_id = s~load_uint(64);
    int amount = s~load_coins();
    int coins = s~load_coins();
    s~load_msg_addr(); ;; skip owner address
    int round_since = s~load_uint(32);
    s.end_parse();

    throw_unless(err::access_denied, equal_slice_bits(src, parent));

    tokens += amount;

    if round_since {
        ( slice v, _ ) = staking~udict_delete_get?(32, round_since);
        int staking_coins = v~load_coins();
        v.end_parse();
        staking_coins -= coins;
        if staking_coins {
            staking~udict_set_builder(32, round_since, begin_cell().store_coins(staking_coins));
        }
    }

    raw_reserve(wallet_storage_fee(), reserve::at_most);

    builder notification = begin_cell()
        .store_uint(op::transfer_notification, 32)
        .store_uint(query_id, 64)
        .store_coins(amount)
        .store_slice(owner)
        .store_int(false, 1);
    send_msg(false, owner.to_builder(), null(), notification, 0, send::unreserved_balance + send::ignore_errors);
}

() save_coins(slice src, slice s) impure inline {
    int query_id = s~load_uint(64);
    int coins = s~load_coins();
    s~load_msg_addr(); ;; skip owner address
    int round_since = s~load_uint(32);
    s.end_parse();

    throw_unless(err::access_denied, equal_slice_bits(src, parent));

    ( slice v, int f? ) = staking.udict_get?(32, round_since);
    if f? {
        coins += v~load_coins();
        v.end_parse();
    }
    staking~udict_set_builder(32, round_since, begin_cell().store_coins(coins));
}

() unstake_tokens(slice src, slice s) impure inline_ref {
    int query_id = s~load_uint(64);
    int amount = s~load_coins();
    slice return_excess = s~load_msg_addr();
    cell custom_payload = s~load_maybe_ref();
    s.end_parse();

    int mode = unstake::auto;
    int ownership_assigned_amount = 0;
    ifnot custom_payload.null?() {
        slice ss = custom_payload.begin_parse();
        mode = ss~load_uint(4);
        ownership_assigned_amount = ss~load_coins();
        ss.end_parse();
    }

    int incoming_ton = get_incoming_value().pair_first();
    int fee = unstake_tokens_fee() + ownership_assigned_amount;
    int enough_fee? = incoming_ton >= fee;
    int valid? = equal_slice_bits(return_excess, owner) | (return_excess.addr_none?());
    valid? &= (mode >= unstake::auto) & (mode <= unstake::best);

    throw_unless(err::access_denied, equal_slice_bits(src, owner) | equal_slice_bits(src, my_address()));
    throw_unless(err::invalid_parameters, valid?);
    throw_unless(err::insufficient_fee, enough_fee?);
    throw_unless(err::insufficient_funds, (amount > 0) & (amount <= tokens));

    tokens -= amount;
    unstaking += amount;

    builder reserve = begin_cell()
        .store_uint(op::proxy_reserve_tokens, 32)
        .store_uint(query_id, 64)
        .store_coins(amount)
        .store_slice(owner)
        .store_uint(mode, 4)
        .store_coins(ownership_assigned_amount);
    send_msg(true, parent.to_builder(), null(), reserve, 0, send::remaining_value);
}

() rollback_unstake(slice src, slice s) impure inline {
    int query_id = s~load_uint(64);
    int amount = s~load_coins();
    s.end_parse();

    throw_unless(err::access_denied, equal_slice_bits(src, parent));

    tokens += amount;
    unstaking -= amount;

    builder excess = begin_cell()
        .store_uint(op::gas_excess, 32)
        .store_uint(query_id, 64);
    send_msg(false, owner.to_builder(), null(), excess, 0, send::remaining_value + send::ignore_errors);
}

() tokens_burned(slice src, slice s) impure inline {
    int query_id = s~load_uint(64);
    int amount = s~load_coins();
    int coins = s~load_coins();
    s.end_parse();

    throw_unless(err::access_denied, equal_slice_bits(src, parent));

    unstaking -= amount;

    raw_reserve(wallet_storage_fee(), reserve::at_most);

    builder notification = begin_cell()
        .store_uint(op::withdrawal_notification, 32)
        .store_uint(query_id, 64)
        .store_coins(amount)
        .store_coins(coins);
    send_msg(false, owner.to_builder(), null(), notification, coins, send::unreserved_balance + send::ignore_errors);
}

() unstake_all(slice src, slice s) impure inline {
    int query_id = s~load_uint(64);
    s.end_parse();

    throw_unless(err::access_denied, equal_slice_bits(src, parent) | equal_slice_bits(src, owner));

    builder unstake = begin_cell()
        .store_uint(op::unstake_tokens, 32)
        .store_uint(query_id, 64)
        .store_coins(tokens)
        .store_uint(0, 3); ;; 00 (addr_none) + 0 (custom_payload)
    send_msg(false, my_address().to_builder(), null(), unstake, 0, send::remaining_value);
}

() upgrade_wallet(slice src, slice s) impure inline {
    int query_id = s~load_uint(64);
    s.end_parse();

    int incoming_ton = get_incoming_value().pair_first();
    int fee = upgrade_wallet_fee();
    int enough_fee? = incoming_ton >= fee;

    throw_unless(err::access_denied, equal_slice_bits(src, owner) | equal_slice_bits(src, parent));
    throw_unless(err::insufficient_fee, enough_fee?);

    builder migrate = begin_cell()
        .store_uint(op::proxy_migrate_wallet, 32)
        .store_uint(query_id, 64)
        .store_coins(tokens)
        .store_slice(owner);
    send_msg(true, parent.to_builder(), null(), migrate, 0, send::unreserved_balance);

    tokens = 0;
}

() merge_wallet(slice src, slice s) impure inline {
    int query_id = s~load_uint(64);
    int new_tokens = s~load_coins();
    s.end_parse();

    throw_unless(err::access_denied, equal_slice_bits(src, parent));

    tokens += new_tokens;

    raw_reserve(wallet_storage_fee(), reserve::at_most);

    builder excess = begin_cell()
        .store_uint(op::gas_excess, 32)
        .store_uint(query_id, 64);
    send_msg(false, owner.to_builder(), null(), excess, 0, send::unreserved_balance + send::ignore_errors);
}

() withdraw_surplus(slice src, slice s) impure inline {
    int query_id = s~load_uint(64);
    slice return_excess = s~load_msg_addr();
    s.end_parse();

    if return_excess.addr_none?() {
        return_excess = src;
    }

    throw_unless(err::access_denied, equal_slice_bits(src, owner));

    raw_reserve(wallet_storage_fee(), reserve::at_most);

    builder excess = begin_cell()
        .store_uint(op::gas_excess, 32)
        .store_uint(query_id, 64);
    send_msg(false, return_excess.to_builder(), null(), excess, 0, send::unreserved_balance + send::ignore_errors);

    throw(0);
}

() withdraw_jettons(slice src, slice s) impure inline {
    int query_id = s~load_uint(64);
    slice child_wallet = s~load_msg_addr();
    int tokens = s~load_coins();
    cell custom_payload = s~load_maybe_ref();
    s.end_parse();

    throw_unless(err::access_denied, equal_slice_bits(src, owner));

    builder send = begin_cell()
        .store_uint(op::send_tokens, 32)
        .store_uint(query_id, 64)
        .store_coins(tokens)
        .store_slice(owner)
        .store_slice(owner)
        .store_maybe_ref(custom_payload)
        .store_coins(0)
        .store_int(false, 1);
    send_msg(true, child_wallet.to_builder(), null(), send, 0, send::remaining_value);

    throw(0);
}

() on_bounce(slice src, slice s) impure inline {
    ;; this should not happen but in a rare case of a bounce (e.g. a frozen account), at least recover tokens

    s~load_uint(32);
    int op = s~load_uint(32);
    int query_id = s~load_uint(64);

    if op == op::receive_tokens {
        int amount = s~load_coins();
        tokens += amount;
    }

    if op == op::proxy_reserve_tokens {
        int amount = s~load_coins();
        tokens += amount;
        unstaking -= amount;
    }

    if op == op::proxy_migrate_wallet {
        int amount = s~load_coins();
        tokens += amount;
    }

    if op == op::send_tokens {
        ;; do nothing
    }

    ;; send back excess gas to owner which is usually the original sender
    builder excess = begin_cell()
        .store_uint(op::gas_excess, 32)
        .store_uint(query_id, 64);
    send_msg(false, owner.to_builder(), null(), excess, 0, send::remaining_value + send::ignore_errors);
}

() route_internal_message(int flags, slice src, slice s, slice cs) impure inline {
    if flags & 1 {
        return on_bounce(src, s);
    }

    int op = s~load_uint(32);

    if op == op::send_tokens {
        cs~load_msg_addr(); ;; skip dst
        cs~load_coins(); ;; skip value
        cs~skip_bits(1); ;; skip extracurrency collection
        cs~load_coins(); ;; skip ihr fee
        int fwd_fee = get_original_fwd_fee(cs~load_coins(), false); ;; use fwd_fee to estimate forward_payload cost
        return send_tokens(src, s, fwd_fee);
    }

    if op == op::receive_tokens {
        return receive_tokens(src, s);
    }

    if op == op::tokens_minted {
        return tokens_minted(src, s);
    }

    if op == op::save_coins {
        return save_coins(src, s);
    }

    if op == op::unstake_tokens {
        return unstake_tokens(src, s);
    }

    if op == op::rollback_unstake {
        return rollback_unstake(src, s);
    }

    if op == op::tokens_burned {
        return tokens_burned(src, s);
    }

    if op == op::unstake_all {
        return unstake_all(src, s);
    }

    if op == op::upgrade_wallet {
        return upgrade_wallet(src, s);
    }

    if op == op::merge_wallet {
        return merge_wallet(src, s);
    }

    if op == op::withdraw_surplus {
        return withdraw_surplus(src, s);
    }

    if op == op::withdraw_jettons {
        return withdraw_jettons(src, s);
    }

    if op == op::top_up {
        throw(0); ;; top up TON balance, do nothing
    }

    if op == 0 {
        int c = s~load_uint(8);
        s.end_parse();
        c |= 0x20; ;; convert to lowercase

        if c == "w"u {
            return unstake_all(src, "0000000000000000"s);
        }

        throw(err::invalid_comment);
    }

    throw(err::invalid_op);
}

() recv_internal(cell in_msg_full, slice s) impure {
    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);
    slice src = cs~load_msg_addr();

    load_data();
    route_internal_message(flags, src, s, cs);
    save_data();
}

;;
;; get methods
;;

(int, slice, slice, cell) get_wallet_data() method_id {
    load_data();

    return ( tokens, owner, parent, my_code() );
}

(int, cell, int) get_wallet_state() method_id {
    load_data();

    return ( tokens, staking, unstaking );
}

var get_wallet_fees() method_id {
    int forward_fee = get_forward_fee(1 + 3, 1023 * 2, false);

    return
        ( send_tokens_fee() + forward_fee
        , unstake_tokens_fee()
        , upgrade_wallet_fee()
        , wallet_storage_fee()
        );
}

```

## 51b4d95b903f23707456f7b35b7f7ce7cbcb284742cd27f7698059cc03f79ec4/contracts/gas.fc

```fc
#include "workchain.fc";

const ONE_TON = 1000000000;

const MIN_STORAGE_DURATION = 5 * 365 * 24 * 3600; ;; 5 years

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
const JETTON_WALLET_BITS  = 1299;

;;- `JETTON_WALLET_CELLS`: [/sandbox_tests/StateInit.spec.ts#L92](L92)
const JETTON_WALLET_CELLS = 3;

;; difference in JETTON_WALLET_BITS/JETTON_WALLET_INITSTATE_BITS is difference in
;; StateInit and AccountStorage (https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)
;; we count bits as if balances are max possible
;;- `JETTON_WALLET_INITSTATE_BITS` [/sandbox_tests/StateInit.spec.ts#L95](L95)
const JETTON_WALLET_INITSTATE_BITS  = 1197;
;;- `JETTON_WALLET_INITSTATE_CELLS` [/sandbox_tests/StateInit.spec.ts#L95](L95)
const JETTON_WALLET_INITSTATE_CELLS = 3;

;; jetton-wallet.fc#L163 - maunal bits counting
const BURN_NOTIFICATION_BITS = 754; ;; body = 32+64+124+(3+8+256)+(3+8+256)
const BURN_NOTIFICATION_CELLS = 1; ;; body always in ref

;;## Gas
;;
;;Gas constants are calculated in the main test suite.
;;First the related transaction is found, and then it's
;;resulting gas consumption is printed to the console.

;;- `SEND_TRANSFER_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L753](L753)
const SEND_TRANSFER_GAS_CONSUMPTION    = 30766;

;;- `RECEIVE_TRANSFER_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L762](L762)
const RECEIVE_TRANSFER_GAS_CONSUMPTION = 32480;

;;- `SEND_BURN_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L1032](L1032)
const SEND_BURN_GAS_CONSUMPTION    = 6148;

;;- `RECEIVE_BURN_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L1033](L1033)
const RECEIVE_BURN_GAS_CONSUMPTION = 28680;


int calculate_jetton_wallet_min_storage_fee() inline {
    return get_storage_fee(MY_WORKCHAIN, MIN_STORAGE_DURATION, JETTON_WALLET_BITS, JETTON_WALLET_CELLS);
}

int forward_init_state_overhead() inline {
    return get_simple_forward_fee(MY_WORKCHAIN, JETTON_WALLET_INITSTATE_BITS, JETTON_WALLET_INITSTATE_CELLS);
}

() check_amount_is_enough_to_transfer(int msg_value, int forward_ton_amount, int fwd_fee) impure inline {
    int fwd_count = forward_ton_amount ? 2 : 1; ;; second sending (forward) will be cheaper that first

    int jetton_wallet_gas_consumption = get_precompiled_gas_consumption();
    int send_transfer_gas_consumption = null?(jetton_wallet_gas_consumption) ? SEND_TRANSFER_GAS_CONSUMPTION : jetton_wallet_gas_consumption;
    int receive_transfer_gas_consumption = null?(jetton_wallet_gas_consumption) ? RECEIVE_TRANSFER_GAS_CONSUMPTION : jetton_wallet_gas_consumption;

    throw_unless(error::not_enough_gas, msg_value >
    forward_ton_amount +
    ;; 3 messages: wal1->wal2,  wal2->owner, wal2->response
    ;; but last one is optional (it is ok if it fails)
    fwd_count * fwd_fee +
    forward_init_state_overhead() + ;; additional fwd fees related to initstate in iternal_transfer
    get_compute_fee(MY_WORKCHAIN, send_transfer_gas_consumption) +
    get_compute_fee(MY_WORKCHAIN, receive_transfer_gas_consumption) +
    calculate_jetton_wallet_min_storage_fee() );
}



() check_amount_is_enough_to_burn(int msg_value) impure inline {
    int jetton_wallet_gas_consumption = get_precompiled_gas_consumption();
    int send_burn_gas_consumption = null?(jetton_wallet_gas_consumption) ? SEND_BURN_GAS_CONSUMPTION : jetton_wallet_gas_consumption;

    throw_unless(error::not_enough_gas, msg_value > get_forward_fee(MY_WORKCHAIN, BURN_NOTIFICATION_BITS, BURN_NOTIFICATION_CELLS) + get_compute_fee(MY_WORKCHAIN, send_burn_gas_consumption) + get_compute_fee(MY_WORKCHAIN, RECEIVE_BURN_GAS_CONSUMPTION));
}

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
forall X -> tuple cons(X head, tuple tail) asm "CONS";

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list) asm(-> 1 0) "UNCONS";

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list) asm "CAR";

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list) asm "CDR";

;;; Creates tuple with zero elements.
tuple empty_tuple() asm "NIL";

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x) asm "SINGLE";

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t) asm "UNSINGLE";

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t) asm "FIRST";

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t) asm "SECOND";

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t) asm "THIRD";

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t) asm "3 INDEX";

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";


;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null() asm "PUSHNULL";

;;; Moves a variable [x] to the top of the stack
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";



;;; Returns the current Unix time as an Integer
int now() asm "NOW";

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address() asm "MYADDR";

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance() asm "BALANCE";

;;; Returns the logical time of the current transaction.
int cur_lt() asm "LTIME";

;;; Returns the starting logical time of the current block.
int block_lt() asm "BLOCKLT";

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c) asm "HASHCU";

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s) asm "HASHSU";

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s) asm "SHA256U";

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
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

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
cell get_data() asm "c4 PUSH";

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
int min(int x, int y) asm "MIN";

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y) asm "MAX";

;;; Sorts two integers.
(int, int) minmax(int x, int y) asm "MINMAX";

;;; Computes the absolute value of an integer [x].
int abs(int x) asm "ABS";

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
slice begin_parse(cell c) asm "CTOS";

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s) asm(-> 1 0) "LDREF";

;;; Preloads the first reference from the slice.
cell preload_ref(slice s) asm "PLDREF";

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
(slice, int) load_grams(slice s) asm(-> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm(-> 1 0) "LDVARUINT16";

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len) asm "SDCUTFIRST";

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len) asm "SDCUTLAST";

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s) asm(-> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";
(slice, ()) ~skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm(-> 1 0) "LDOPTREF";

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s) asm "PLDOPTREF";


;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c) asm "CDEPTH";


{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s) asm "SREFS";

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s) asm "SBITS";

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s) asm "SBITREFS";

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).
int slice_empty?(slice s) asm "SEMPTY";

;;; Checks whether `slice` [s] has no bits of data.
int slice_data_empty?(slice s) asm "SDEMPTY";

;;; Checks whether `slice` [s] has no references.
int slice_refs_empty?(slice s) asm "SREMPTY";

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s) asm "SDEPTH";

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b) asm "BREFS";

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b) asm "BBITS";

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b) asm "BDEPTH";

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell() asm "NEWC";

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b) asm "ENDC";

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c) asm(c b) "STREF";

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";


;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s) asm "STSLICER";

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_coins(builder b, int x) asm "STVARUINT16";

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c) asm(c b) "STDICT";

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";


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
(slice, slice) load_msg_addr(slice s) asm(-> 1 0) "LDMSGADDR";

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s) asm "PARSEMSGADDR";

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

{-
  # Dictionary primitives
-}


;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";

cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict() asm "NEWDICT";
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.
int dict_empty?(cell c) asm "DICTEMPTY";


{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x) asm "CONFIGOPTPARAM";
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.
int cell_null?(cell c) asm "ISNULL";

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
int random() impure asm "RANDU256";
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
int rand(int range) impure asm "RAND";
;;; Returns the current random seed as an unsigned 256-bit Integer.
int get_seed() impure asm "RANDSEED";
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slices_bits(slice a, slice b) asm "SDEQ";
;;; Checks whether b is a null. Note, that FunC also has polymorphic null? built-in.
int builder_null?(builder b) asm "ISNULL";
;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";

;; CUSTOM:

;; TVM UPGRADE 2023-07 https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07
;; In mainnet since 20 Dec 2023 https://t.me/tonblockchain/226

;;; Retrieves code of smart-contract from c7
cell my_code() asm "MYCODE";

;;; Creates an output action and returns a fee for creating a message. Mode has the same effect as in the case of SENDRAWMSG
int send_message(cell msg, int mode) impure asm "SENDMSG";

int gas_consumed() asm "GASCONSUMED";

;; TVM V6 https://github.com/ton-blockchain/ton/blob/testnet/doc/GlobalVersions.md#version-6

int get_compute_fee(int workchain, int gas_used) asm(gas_used workchain) "GETGASFEE";
int get_storage_fee(int workchain, int seconds, int bits, int cells) asm(cells bits seconds workchain) "GETSTORAGEFEE";
int get_forward_fee(int workchain, int bits, int cells) asm(cells bits workchain) "GETFORWARDFEE";
int get_precompiled_gas_consumption() asm "GETPRECOMPILEDGAS";

int get_simple_compute_fee(int workchain, int gas_used) asm(gas_used workchain) "GETGASFEESIMPLE";
int get_simple_forward_fee(int workchain, int bits, int cells) asm(cells bits workchain) "GETFORWARDFEESIMPLE";
int get_original_fwd_fee(int workchain, int fwd_fee) asm(fwd_fee workchain) "GETORIGINALFWDFEE";
int my_storage_due() asm "DUEPAYMENT";

tuple get_fee_cofigs() asm "UNPACKEDCONFIGTUPLE";

;; BASIC

const int TRUE = -1;
const int FALSE = 0;

const int MASTERCHAIN = -1;
const int BASECHAIN = 0;

;;; skip (Maybe ^Cell) from `slice` [s].
(slice, ()) ~skip_maybe_ref(slice s) asm "SKIPOPTREF";

(slice, int) ~load_bool(slice s) inline {
    return s.load_int(1);
}

builder store_bool(builder b, int value) inline {
    return b.store_int(value, 1);
}

;; ADDRESS NONE
;; addr_none$00 = MsgAddressExt; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L100

builder store_address_none(builder b) inline {
    return b.store_uint(0, 2);
}

slice address_none() asm "<b 0 2 u, b> <s PUSHSLICE";

int is_address_none(slice s) inline {
    return s.preload_uint(2) == 0;
}

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

const int BOUNCEABLE = 0x18; ;; 0b011000 tag - 0, ihr_disabled - 1, bounce - 1, bounced - 0, src = adr_none$00
const int NON_BOUNCEABLE = 0x10; ;; 0b010000 tag - 0, ihr_disabled - 1, bounce - 0, bounced - 0, src = adr_none$00

;; store msg_flags and address none
builder store_msg_flags_and_address_none(builder b, int msg_flags) inline {
    return b.store_uint(msg_flags, 6);
}

;; load msg_flags only
(slice, int) ~load_msg_flags(slice s) inline {
    return s.load_uint(4);
}
;;; @param `msg_flags` - 4-bit
int is_bounced(int msg_flags) inline {
    return msg_flags & 1 == 1;
}

(slice, ()) ~skip_bounced_prefix(slice s) inline {
    return (s.skip_bits(32), ()); ;; skip 0xFFFFFFFF prefix
}

;; after `grams:Grams` we have (1 + 4 + 4 + 64 + 32) zeroes - zeroed extracurrency, ihr_fee, fwd_fee, created_lt and created_at
const int MSG_INFO_REST_BITS = 1 + 4 + 4 + 64 + 32;

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

const int MSG_WITH_STATE_INIT_AND_BODY_SIZE = MSG_INFO_REST_BITS + 1 + 1 + 1;
const int MSG_HAVE_STATE_INIT = 4;
const int MSG_STATE_INIT_IN_REF = 2;
const int MSG_BODY_IN_REF = 1;

;; if no StateInit:
;; 0b0 for `Maybe (Either StateInit ^StateInit)` and 0b1 or 0b0 for `body:(Either X ^X)`

const int MSG_ONLY_BODY_SIZE = MSG_INFO_REST_BITS + 1 + 1;

builder store_statinit_ref_and_body_ref(builder b, cell state_init, cell body) inline {
    return b
    .store_uint(MSG_HAVE_STATE_INIT + MSG_STATE_INIT_IN_REF + MSG_BODY_IN_REF, MSG_WITH_STATE_INIT_AND_BODY_SIZE)
    .store_ref(state_init)
    .store_ref(body);
}

builder store_only_body_ref(builder b, cell body) inline {
    return b
    .store_uint(MSG_BODY_IN_REF, MSG_ONLY_BODY_SIZE)
    .store_ref(body);
}

builder store_prefix_only_body(builder b) inline {
    return b
    .store_uint(0, MSG_ONLY_BODY_SIZE);
}

;; parse after sender_address
(slice, int) ~retrieve_fwd_fee(slice in_msg_full_slice) inline {
    in_msg_full_slice~load_msg_addr(); ;; skip dst
    in_msg_full_slice~load_coins(); ;; skip value
    in_msg_full_slice~skip_dict(); ;; skip extracurrency collection
    in_msg_full_slice~load_coins(); ;; skip ihr_fee
    int fwd_fee = in_msg_full_slice~load_coins();
    return (in_msg_full_slice, fwd_fee);
}

;; MSG BODY

;; According to the guideline, it is recommended to start the body of the internal message with uint32 op and uint64 query_id

const int MSG_OP_SIZE = 32;
const int MSG_QUERY_ID_SIZE = 64;

(slice, int) ~load_op(slice s) inline {
    return s.load_uint(MSG_OP_SIZE);
}
(slice, ()) ~skip_op(slice s) inline {
    return (s.skip_bits(MSG_OP_SIZE), ());
}
builder store_op(builder b, int op) inline {
    return b.store_uint(op, MSG_OP_SIZE);
}

(slice, int) ~load_query_id(slice s) inline {
    return s.load_uint(MSG_QUERY_ID_SIZE);
}
(slice, ()) ~skip_query_id(slice s) inline {
    return (s.skip_bits(MSG_QUERY_ID_SIZE), ());
}
builder store_query_id(builder b, int query_id) inline {
    return b.store_uint(query_id, MSG_QUERY_ID_SIZE);
}

(slice, (int, int)) ~load_op_and_query_id(slice s) inline {
    int op = s~load_op();
    int query_id = s~load_query_id();
    return (s, (op, query_id));
}

;; SEND MODES - https://docs.ton.org/tvm.pdf page 137, SENDRAWMSG

;; For `send_raw_message` and `send_message`:

;;; x = 0 is used for ordinary messages; the gas fees are deducted from the senging amount; action phaes should NOT be ignored.
const int SEND_MODE_REGULAR = 0;
;;; +1 means that the sender wants to pay transfer fees separately.
const int SEND_MODE_PAY_FEES_SEPARATELY = 1;
;;; + 2 means that any errors arising while processing this message during the action phase should be ignored.
const int SEND_MODE_IGNORE_ERRORS = 2;
;;; + 32 means that the current account must be destroyed if its resulting balance is zero.
const int SEND_MODE_DESTROY = 32;
;;; x = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message.
const int SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE = 64;
;;; x = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message).
const int SEND_MODE_CARRY_ALL_BALANCE = 128;
;;; in the case of action fail - bounce transaction. No effect if SEND_MODE_IGNORE_ERRORS (+2) is used. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int SEND_MODE_BOUNCE_ON_ACTION_FAIL = 16;

;; Only for `send_message`:

;;; do not create an action, only estimate fee. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int SEND_MODE_ESTIMATE_FEE_ONLY = 1024;

;; Other modes affect the fee calculation as follows:
;; +64 substitutes the entire balance of the incoming message as an outcoming value (slightly inaccurate, gas expenses that cannot be estimated before the computation is completed are not taken into account).
;; +128 substitutes the value of the entire balance of the contract before the start of the computation phase (slightly inaccurate, since gas expenses that cannot be estimated before the completion of the computation phase are not taken into account).

;; RESERVE MODES - https://docs.ton.org/tvm.pdf page 137, RAWRESERVE

;;; Creates an output action which would reserve exactly x nanograms (if y = 0).
const int RESERVE_REGULAR = 0;
;;; Creates an output action which would reserve at most x nanograms (if y = 2).
;;; Bit +2 in y means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved.
const int RESERVE_AT_MOST = 2;
;;; in the case of action fail - bounce transaction. No effect if RESERVE_AT_MOST (+2) is used. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int RESERVE_BOUNCE_ON_ACTION_FAIL = 16;

;; TOKEN METADATA
;; https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md

;; Key is sha256 hash of string. Value is data encoded as described in "Data serialization" paragraph.
;; Snake format - must be prefixed with 0x00 byte
(cell, ()) ~set_token_snake_metadata_entry(cell content_dict, int key, slice value) impure {
    content_dict~udict_set_ref(256, key, begin_cell().store_uint(0, 8).store_slice(value).end_cell());
    return (content_dict, ());
}

;; On-chain content layout The first byte is 0x00 and the rest is key/value dictionary.
cell create_token_onchain_metadata(cell content_dict) inline {
    return begin_cell().store_uint(0, 8).store_dict(content_dict).end_cell();
}
```

## 51b4d95b903f23707456f7b35b7f7ce7cbcb284742cd27f7698059cc03f79ec4/contracts/jetton-utils.fc

```fc
#include "stdlib.fc";
#include "workchain.fc";

const int STATUS_SIZE = 4;
const int MERKLE_ROOT_SIZE = 256;
const int SALT_SIZE = 10; ;; if changed, update calculate_jetton_wallet_data_hash_cheap and pack_jetton_wallet_data_hash_base (data bits size and padding)
const int ITERATION_NUM = 32; ;; should be less than 2^SALT_SIZE-1

cell pack_jetton_wallet_data(int status, int balance, slice owner_address, slice jetton_master_address, int merkle_root, int salt) inline {
    ;; Note that for
    return begin_cell()
    .store_uint(status, STATUS_SIZE)
    .store_coins(balance)
    .store_slice(owner_address)
    .store_slice(jetton_master_address)
    .store_uint(merkle_root, MERKLE_ROOT_SIZE)
    .store_uint(salt, SALT_SIZE)
    .end_cell();
}

int hash_sha256(builder b) asm "1 PUSHINT HASHEXT_SHA256";

;; Trick for gas saving originally created by @NickNekilov
int calculate_account_hash_cheap(int code_hash, int code_depth, int data_hash, int data_depth) inline {
    return begin_cell()
        ;; refs_descriptor:bits8 bits_descriptor:bits8
        .store_uint(
            ;; refs_descriptor: ref_count + ((exotic? & 1) * 8) + (mask * 32)
            ;; we have 2 refs (code+data), non-exotic, zero mask
            (2 << 16) |
            ;; bits_descriptor: floor(bit_count/8) + ceil(bit_count/8)
            ;; we have 5 bit of data, bits_descriptor = 0 + 1 = 1
            (1 << 8) |
            ;; data: actual data: (split_depth, special,code, data, library) and also 3 bit for ceil number of bits
            ;; [0b00110] + [0b100]
            0x34,
            24
        )
        ;;depth descriptors
        .store_uint(code_depth, 16)
        .store_uint(data_depth, 16)
        ;; ref hashes
        .store_uint(code_hash, 256)
        .store_uint(data_hash, 256)
        .hash_sha256();
}

builder calculate_account_hash_base_slice(int code_hash, int code_depth, int data_depth) inline {
    return begin_cell()
    ;; refs_descriptor:bits8 bits_descriptor:bits8
        .store_uint(
            ;; refs_descriptor: ref_count + ((exotic? & 1) * 8) + (mask * 32)
            ;; we have 2 refs (code+data), non-exotic, zero mask
            (2 << 16) |
            ;; bits_descriptor: floor(bit_count/8) + ceil(bit_count/8)
            ;; we have 5 bit of data, bits_descriptor = 0 + 1 = 1
            (1 << 8) |
            ;; data: actual data: (split_depth, special,code, data, library) and also 3 bit for ceil number of bits
            ;; [0b00110] + [0b100]
            0x34,
            24
        )
    ;;depth descriptors
        .store_uint(code_depth, 16)
        .store_uint(data_depth, 16)
    ;; ref hashes
        .store_uint(code_hash, 256);
}

int calculate_account_hash_cheap_with_base_builder(builder base_builder, int data_hash) inline {
    return base_builder
           .store_uint(data_hash, 256)
           .hash_sha256();
}

builder calculate_jetton_wallet_address(cell state_init) inline {
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L105
    addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;
    -}
    return begin_cell()
        .store_uint(4, 3) ;; 0b100 = addr_std$10 tag; No anycast
        .store_int(MY_WORKCHAIN, 8)
        .store_uint(cell_hash(state_init), 256);
}

builder pack_jetton_wallet_data_builder_base(int status, int balance, slice owner_address, slice jetton_master_address, int merkle_root) inline {
    return begin_cell()
        .store_uint(status, 4)
        .store_coins(balance)
        .store_slice(owner_address)
        .store_slice(jetton_master_address)
        .store_uint(merkle_root, 256);
}

builder pack_jetton_wallet_data_hash_base(builder wallet_data_base) inline {
    return begin_cell()
    ;; refs_descriptor:bits8 bits_descriptor:bits8
        .store_uint(
            ;; refs_descriptor: ref_count + ((exotic? & 1) * 8) + (mask * 32)
            ;; we have 0 refs , non-exotic, zero mask
            ;;0 |
            ;; bits_descriptor: floor(bit_count/8) + ceil(bit_count/8)
            ;; we have 4+4+267+267+256+10 = 808 bit of data, bits_descriptor = 101 + 101 = 202
            202,
            16
        )
    ;;depth descriptors
        .store_builder(wallet_data_base);
}

int calculate_jetton_wallet_data_hash_cheap(builder base, int salt) inline {
    return base
           ;; salt 10 bits, no trailing bits needed
           .store_uint(salt, SALT_SIZE)
           .hash_sha256();
}

cell calculate_jetton_wallet_state_init_internal(slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int merkle_root, int salt) inline {
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L144
    _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
    code:(Maybe ^Cell) data:(Maybe ^Cell)
    library:(Maybe ^Cell) = StateInit;
  -}
    return begin_cell()
        .store_uint(0, 2) ;; 0b00 - No split_depth; No special
        .store_maybe_ref(jetton_wallet_code)
        .store_maybe_ref(
            pack_jetton_wallet_data(
                0, ;; status
                0, ;; balance
                owner_address,
                jetton_master_address,
                merkle_root,
                salt)
        )
        .store_uint(0, 1) ;; Empty libraries
        .end_cell();
}

[cell, int] calculate_jetton_wallet_properties_cheap(slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int merkle_root) inline {
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L144
    _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
    code:(Maybe ^Cell) data:(Maybe ^Cell)
    library:(Maybe ^Cell) = StateInit;
  -}
    int stop = false;
    int min_distance = 0xffff;
    int salt = -1;
    int min_salt = 0;
    (_, int owner_prefix) = parse_std_addr(owner_address);
    owner_prefix = owner_prefix >> (256 - 4);
    builder jetton_wallet_data_base = pack_jetton_wallet_data_builder_base(0, 0, owner_address, jetton_master_address, merkle_root);
    builder jetton_wallet_data_hash_base = pack_jetton_wallet_data_hash_base(jetton_wallet_data_base);
    builder jetton_wallet_account_hash_base = calculate_account_hash_base_slice(cell_hash(jetton_wallet_code), cell_depth(jetton_wallet_code), 0);

    do {
        salt += 1;
        int data_hash = calculate_jetton_wallet_data_hash_cheap(jetton_wallet_data_hash_base, salt);
        int account_hash = calculate_account_hash_cheap_with_base_builder(jetton_wallet_account_hash_base, data_hash);
        int wallet_prefix = account_hash >> (256 - 4);
        int distance = wallet_prefix ^ owner_prefix;
        if (distance < min_distance) {
            min_distance = distance;
            min_salt = salt;
        }
        stop = (salt == ITERATION_NUM) | (min_distance == 0);
    } until (stop);
    cell state_init = begin_cell()
        .store_uint(0, 2) ;; 0b00 - No split_depth; No special
        .store_maybe_ref(jetton_wallet_code)
        .store_maybe_ref(jetton_wallet_data_base.store_uint(min_salt, SALT_SIZE).end_cell())
        .store_uint(0, 1) ;; Empty libraries
        .end_cell();
    return [state_init, min_salt];
}

[cell, int] calculate_jetton_wallet_properties(slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int merkle_root) inline {
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L144
    _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
    code:(Maybe ^Cell) data:(Maybe ^Cell)
    library:(Maybe ^Cell) = StateInit;
  -}
    int stop = false;
    int min_distance = 0xffff;
    int salt = -1;
    int min_salt = 0;
    cell state_init = null();
    cell min_state_init = null();
    (_, int owner_prefix) = parse_std_addr(owner_address);
    owner_prefix = owner_prefix >> (256 - 4);

    do {
        salt += 1;
        state_init = calculate_jetton_wallet_state_init_internal(owner_address, jetton_master_address, jetton_wallet_code, merkle_root, salt);
        int wallet_prefix = cell_hash(state_init) >> (256 - 4);
        int distance = wallet_prefix ^ owner_prefix;
        if (distance < min_distance) {
            min_distance = distance;
            min_salt = salt;
            min_state_init = state_init;
        }
        stop = (salt == ITERATION_NUM) | (min_distance == 0);
    } until (stop);
    return [min_state_init, min_salt];
}

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int merkle_root) inline {
    [cell state_init, int salt] = calculate_jetton_wallet_properties_cheap(owner_address, jetton_master_address, jetton_wallet_code, merkle_root);
    return state_init;
}


slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int merkle_root) inline {
    return calculate_jetton_wallet_address(calculate_jetton_wallet_state_init(owner_address, jetton_master_address, jetton_wallet_code, merkle_root))
           .end_cell().begin_parse();
}

() check_either_forward_payload(slice s) impure inline {
    if (s.preload_uint(1)) {
        ;; forward_payload in ref
        (int remain_bits, int remain_refs) = slice_bits_refs(s);
        throw_unless(error::invalid_message, (remain_refs == 1) & (remain_bits == 1)); ;; we check that there is no excess in the slice
    }
    ;; else forward_payload in slice - arbitrary bits and refs
}

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

global int merkle_root;
global int salt;

(int, int, slice, slice) load_data() inline {
    slice ds = get_data().begin_parse();
    var data = (
        ds~load_uint(STATUS_SIZE), ;; status
        ds~load_coins(), ;; balance
        ds~load_msg_addr(), ;; owner_address
        ds~load_msg_addr() ;; jetton_master_address
    );
    merkle_root = ds~load_uint(MERKLE_ROOT_SIZE);
    salt = ds~load_uint(SALT_SIZE);
    ds.end_parse();
    return data;
}

() save_data(int status, int balance, slice owner_address, slice jetton_master_address) impure inline {
    set_data(pack_jetton_wallet_data(status, balance, owner_address, jetton_master_address, merkle_root, salt));
}

() send_jettons(slice in_msg_body, slice sender_address, int my_ton_balance, int msg_value, int fwd_fee) impure inline_ref {
    ;; see transfer TL-B layout in jetton.tlb
    int query_id = in_msg_body~load_query_id();
    int jetton_amount = in_msg_body~load_coins();
    slice to_owner_address = in_msg_body~load_msg_addr();
    check_same_workchain(to_owner_address);
    (int status, int balance, slice owner_address, slice jetton_master_address) = load_data();
    throw_unless(error::not_owner, equal_slices_bits(owner_address, sender_address));

    cell state_init = calculate_jetton_wallet_state_init(to_owner_address, jetton_master_address, my_code(), merkle_root);
    builder to_wallet_address = calculate_jetton_wallet_address(state_init);
    slice response_address = in_msg_body~load_msg_addr();
    cell custom_payload = in_msg_body~load_maybe_ref();
    int mode = SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_BOUNCE_ON_ACTION_FAIL;
    ifnot(custom_payload.null?()) {
        slice cps = custom_payload.begin_parse();
        int cp_op = cps~load_op();
        throw_unless(error::unknown_custom_payload, cp_op == op::merkle_airdrop_claim);
        throw_if(error::airdrop_already_claimed, status);
        cell airdrop_proof = cps~load_ref();
        (int airdrop_amount, int start_from, int expired_at) = get_airdrop_params(airdrop_proof, merkle_root, owner_address);
        int time = now();
        throw_unless(error::airdrop_not_ready, time >= start_from);
        throw_unless(error::airdrop_finished, time <= expired_at);
        balance += airdrop_amount;
        status |= 1;

        ;; first outgoing transfer can be from just deployed jetton wallet
        ;; in this case we need to reserve TON for storage
        int to_leave_on_balance = my_ton_balance - msg_value + my_storage_due();
        int actual_withheld = max(to_leave_on_balance, calculate_jetton_wallet_min_storage_fee());
        raw_reserve(actual_withheld, RESERVE_REGULAR | RESERVE_BOUNCE_ON_ACTION_FAIL);
        mode = SEND_MODE_CARRY_ALL_BALANCE | SEND_MODE_BOUNCE_ON_ACTION_FAIL;

        ;; custom payload processing is not constant gas, account for that via gas_consumed()
        msg_value -= get_compute_fee(MY_WORKCHAIN, gas_consumed()) + actual_withheld;
    }
    int forward_ton_amount = in_msg_body~load_coins();
    check_either_forward_payload(in_msg_body);
    slice either_forward_payload = in_msg_body;

    balance -= jetton_amount;
    throw_unless(error::balance_error, balance >= 0);

    ;; see internal TL-B layout in jetton.tlb
    cell msg_body = begin_cell()
    .store_op(op::internal_transfer)
    .store_query_id(query_id)
    .store_coins(jetton_amount)
    .store_slice(owner_address)
    .store_slice(response_address)
    .store_coins(forward_ton_amount)
    .store_slice(either_forward_payload)
    .end_cell();

    ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733
    cell msg = begin_cell()
    .store_msg_flags_and_address_none(BOUNCEABLE)
    .store_builder(to_wallet_address)
    .store_coins(0)
    .store_statinit_ref_and_body_ref(state_init, msg_body)
    .end_cell();

    check_amount_is_enough_to_transfer(msg_value , forward_ton_amount, fwd_fee);

    send_raw_message(msg, mode);

    save_data(status, balance, owner_address, jetton_master_address);
}

() receive_jettons(slice in_msg_body, slice sender_address, int my_ton_balance, int msg_value) impure inline_ref {
    (int status, int balance, slice owner_address, slice jetton_master_address) = load_data();
    ;; see internal TL-B layout in jetton.tlb
    int query_id = in_msg_body~load_query_id();
    int jetton_amount = in_msg_body~load_coins();
    balance += jetton_amount;
    slice from_address = in_msg_body~load_msg_addr();
    slice response_address = in_msg_body~load_msg_addr();
    int valid_address = equal_slices_bits(jetton_master_address, sender_address);
    ifnot(valid_address) {
        valid_address = equal_slices_bits(calculate_user_jetton_wallet_address(from_address, jetton_master_address, my_code(), merkle_root), sender_address);
    }
    throw_unless(error::not_valid_wallet, valid_address );
    int forward_ton_amount = in_msg_body~load_coins();

    if (forward_ton_amount) {
        slice either_forward_payload = in_msg_body;

        ;; see transfer_notification TL-B layout in jetton.tlb
        cell msg_body = begin_cell()
        .store_op(op::transfer_notification)
        .store_query_id(query_id)
        .store_coins(jetton_amount)
        .store_slice(from_address)
        .store_slice(either_forward_payload)
        .end_cell();

        ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733
        cell msg = begin_cell()
        .store_msg_flags_and_address_none(NON_BOUNCEABLE)
        .store_slice(owner_address)
        .store_coins(forward_ton_amount)
        .store_only_body_ref(msg_body)
        .end_cell();

        send_raw_message(msg, SEND_MODE_PAY_FEES_SEPARATELY | SEND_MODE_BOUNCE_ON_ACTION_FAIL);
    }

    if (~ is_address_none(response_address)) {
        int to_leave_on_balance = my_ton_balance - msg_value + my_storage_due();
        raw_reserve(max(to_leave_on_balance, calculate_jetton_wallet_min_storage_fee()), RESERVE_AT_MOST);

        ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733
        cell msg = begin_cell()
        .store_msg_flags_and_address_none(NON_BOUNCEABLE)
        .store_slice(response_address)
        .store_coins(0)
        .store_prefix_only_body()
        .store_op(op::excesses)
        .store_query_id(query_id)
        .end_cell();
        send_raw_message(msg, SEND_MODE_CARRY_ALL_BALANCE | SEND_MODE_IGNORE_ERRORS);
    }

    save_data(status, balance, owner_address, jetton_master_address);
}

() burn_jettons(slice in_msg_body, slice sender_address, int msg_value) impure inline_ref {
    (int status, int balance, slice owner_address, slice jetton_master_address) = load_data();
    int query_id = in_msg_body~load_query_id();
    int jetton_amount = in_msg_body~load_coins();
    slice response_address = in_msg_body~load_msg_addr();
    in_msg_body~skip_maybe_ref(); ;; custom_payload
    in_msg_body.end_parse();

    balance -= jetton_amount;
    int is_from_owner = equal_slices_bits(owner_address, sender_address);
    throw_unless(error::not_owner, is_from_owner);
    throw_unless(error::balance_error, balance >= 0);

    ;; see burn_notification TL-B layout in jetton.tlb
    cell msg_body = begin_cell()
    .store_op(op::burn_notification)
    .store_query_id(query_id)
    .store_coins(jetton_amount)
    .store_slice(owner_address)
    .store_slice(response_address)
    .end_cell();

    ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733
    cell msg = begin_cell()
    .store_msg_flags_and_address_none(BOUNCEABLE)
    .store_slice(jetton_master_address)
    .store_coins(0)
    .store_only_body_ref(msg_body)
    .end_cell();

    check_amount_is_enough_to_burn(msg_value);

    send_raw_message(msg, SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_BOUNCE_ON_ACTION_FAIL);

    save_data(status, balance, owner_address, jetton_master_address);
}

() on_bounce(slice in_msg_body) impure inline {
    in_msg_body~skip_bounced_prefix();
    (int status, int balance, slice owner_address, slice jetton_master_address) = load_data();
    int op = in_msg_body~load_op();
    throw_unless(error::wrong_op, (op == op::internal_transfer) | (op == op::burn_notification));
    in_msg_body~skip_query_id();
    int jetton_amount = in_msg_body~load_coins();
    save_data(status, balance + jetton_amount, owner_address, jetton_master_address);
}

() recv_internal(int my_ton_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    slice in_msg_full_slice = in_msg_full.begin_parse();
    int msg_flags = in_msg_full_slice~load_msg_flags();
    if (msg_flags & 1) { ;; is bounced
        on_bounce(in_msg_body);
        return ();
    }
    slice sender_address = in_msg_full_slice~load_msg_addr();
    int fwd_fee_from_in_msg = in_msg_full_slice~retrieve_fwd_fee();
    int fwd_fee = get_original_fwd_fee(MY_WORKCHAIN, fwd_fee_from_in_msg); ;; we use message fwd_fee for estimation of forward_payload costs

    int op = in_msg_body~load_op();

    ;; outgoing transfer
    if (op == op::transfer) {
        send_jettons(in_msg_body, sender_address, my_ton_balance, msg_value, fwd_fee);
        return ();
    }

    ;; incoming transfer
    if (op == op::internal_transfer) {
        receive_jettons(in_msg_body, sender_address, my_ton_balance, msg_value);
        return ();
    }

    ;; burn
    if (op == op::burn) {
        burn_jettons(in_msg_body, sender_address, msg_value);
        return ();
    }

    if (op == op::top_up) {
        return (); ;; just accept tons
    }

    throw(error::wrong_op);
}

(int, slice, slice, cell) get_wallet_data() method_id {
    (_, int balance, slice owner_address, slice jetton_master_address) = load_data();
    return (balance, owner_address, jetton_master_address, my_code());
}

int get_status() method_id {
    (int status, _, _, _) = load_data();
    return status;
}

int is_claimed() method_id {
    (int status, _, _, _) = load_data();
    return status;
}

```

## 51b4d95b903f23707456f7b35b7f7ce7cbcb284742cd27f7698059cc03f79ec4/contracts/op-codes.fc

```fc
;; common

const op::transfer = 0xf8a7ea5;
const op::transfer_notification = 0x7362d09c;
const op::internal_transfer = 0x178d4519;
const op::excesses = 0xd53276db;
const op::burn = 0x595f07bc;
const op::burn_notification = 0x7bdd97de;

const op::provide_wallet_address = 0x2c76b973;
const op::take_wallet_address = 0xd1735400;

const op::top_up = 0xd372158c;

const error::invalid_op = 72;
const error::wrong_op = 0xffff;
const error::not_owner = 73;
const error::not_valid_wallet = 74;
const error::wrong_workchain = 333;

;; jetton-minter

const op::mint = 0x642b7d07;
const op::change_admin = 0x6501f354;
const op::claim_admin = 0xfb88e119;
const op::upgrade = 0x2508d66a;
const op::change_metadata_uri = 0xcb862902;
const op::drop_admin = 0x7431f221;
const op::merkle_airdrop_claim = 0x0df602d6; ;; TODO

;; jetton-wallet
const error::balance_error = 47;
const error::not_enough_gas = 48;
const error::invalid_message = 49;
const error::airdrop_already_claimed = 54;
const error::airdrop_not_ready = 55;
const error::airdrop_finished = 56;
const error::unknown_custom_payload = 57;
const error::non_canonical_address = 58;

```

## 51b4d95b903f23707456f7b35b7f7ce7cbcb284742cd27f7698059cc03f79ec4/contracts/proofs.fc

```fc
#include "stdlib.fc";
;; Copy from https://github.com/ton-community/compressed-nft-contract
(slice, int) begin_parse_exotic(cell x) asm "XCTOS";
(slice, int) dict_get?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTGET" "NULLSWAPIFNOT";

const int error::not_exotic = 103;
const int error::not_merkle_proof = 104;
const int error::wrong_hash = 105;
const int error::leaf_not_found = 108;
const int error::airdrop_not_found = 109;
const int cell_type::merkle_proof = 3;

(cell, int) extract_merkle_proof(cell proof) impure {
    (slice s, int is_exotic) = proof.begin_parse_exotic();
    throw_unless(error::not_exotic, is_exotic);

    int ty = s~load_uint(8);
    throw_unless(error::not_merkle_proof, ty == cell_type::merkle_proof);

    return (s~load_ref(), s~load_uint(256));
}

cell check_merkle_proof(cell proof, int expected_hash) impure {
    (cell inner, int hash) = proof.extract_merkle_proof();
    throw_unless(error::wrong_hash, hash == expected_hash);

    return inner;
}
;;https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb#L105
const int ADDRESS_SLICE_LENGTH = 2 + 1 + 8 + 256;
const int TIMESTAMP_SIZE = 48;

(int, int, int) get_airdrop_params(cell submitted_proof, int proof_root, slice owner) {
    cell airdrop = submitted_proof.check_merkle_proof(proof_root);
    (slice data, int found) = airdrop.dict_get?(ADDRESS_SLICE_LENGTH, owner);
    throw_unless(error::airdrop_not_found, found);
    int airdrop_amount = data~load_coins();
    int start_from = data~load_uint(TIMESTAMP_SIZE);
    int expired_at = data~load_uint(TIMESTAMP_SIZE);
    return (airdrop_amount, start_from, expired_at);
}
```

## 51b4d95b903f23707456f7b35b7f7ce7cbcb284742cd27f7698059cc03f79ec4/contracts/workchain.fc

```fc
#include "stdlib.fc";
#include "op-codes.fc";

const MY_WORKCHAIN = BASECHAIN;

int is_same_workchain(slice addr) inline {
    (int wc, _) = parse_std_addr(addr);
    return wc == MY_WORKCHAIN;
}

() check_same_workchain(slice addr) impure inline {
    throw_unless(error::wrong_workchain, is_same_workchain(addr));
}
```

## 52161446bb3e6f811f3ceb163c8be33710fe41086c3a047ee928c2d94743fc2d/simple-subscription-plugin.fc

```fc
#pragma version =0.2.0;
;; Simple subscription plugin for wallet-v4
;; anyone can ask to send a subscription payment

(int) slice_data_equal?(slice s1, slice s2) asm "SDEQ";

int op:destruct() asm "0x64737472 PUSHINT";
int op:payment_request() asm "0x706c7567 PUSHINT";
int op:fallback() asm "0x756e6b77 PUSHINT";
int op:subscription() asm "0x73756273 PUSHINT";
int max_failed_attempts() asm "2 PUSHINT";
int max_reserved_funds() asm "67108864 PUSHINT"; ;; 0.0671 TON

int short_msg_fwd_fee(int workchain) inline {
  int config_index = 25 + workchain;
  int lump_price = config_param(config_index).begin_parse().skip_bits(8).preload_uint(64);
  return lump_price;
}

int gas_to_coins(int workchain, int gas) inline_ref {
  int config_index = 21 + workchain;
  var cs = config_param(config_index).begin_parse();
  if (cs.preload_uint(8) == 0xd1) { ;; gas_flat_pfx
    cs~skip_bits(8 + 64 + 64);
  }
  int tag = cs~load_uint(8);
  throw_unless(71, (tag == 0xdd) | (tag == 0xde)); ;; gas_prices or gas_prices_ext
  int gas_price = cs~load_uint(64);
  return (gas * gas_price) >> 16;
}

;; storage$_ wallet:MsgAddressInt
;;           beneficiary:MsgAddressInt
;;           amount:Grams
;;           period:uint32 start_time:uint32 timeout:uint32
;;           last_payment_time:uint32
;;           last_request_time:uint32
;;           failed_attempts:uint8
;;           subscription_id:uint32 = Storage;

(slice, slice, int, int, int, int, int, int, int, int) load_storage() impure inline_ref {
  var ds = get_data().begin_parse();
  return (ds~load_msg_addr(), ds~load_msg_addr(), ds~load_grams(),
          ds~load_uint(32), ds~load_uint(32), ds~load_uint(32),
          ds~load_uint(32), ds~load_uint(32), ds~load_uint(8), ds~load_uint(32));
}

() save_storage(slice wallet, slice beneficiary, int amount,
                int period, int start_time, int timeout, int last_payment_time,
                int last_request_time, int failed_attempts, int subscription_id) impure inline_ref {
  set_data(begin_cell()
    .store_slice(wallet)
    .store_slice(beneficiary)
    .store_grams(amount)
    .store_uint(period, 32)
    .store_uint(start_time, 32)
    .store_uint(timeout, 32)
    .store_uint(last_payment_time, 32)
    .store_uint(last_request_time, 32)
    .store_uint(failed_attempts, 8)
    .store_uint(subscription_id, 32) ;; to differ subscriptions to the same beneficiary (acts as a nonce)
  .end_cell());
}

() forward_funds(slice beneficiary, int self_destruct?, int op) impure inline_ref {
  if ~(self_destruct?) {
    raw_reserve(max_reserved_funds(), 2); ;; reserve at most `max_reserved_funds` nanocoins
  }
  var msg = begin_cell()
      .store_uint(0x10, 6) ;; non-bounce message
      .store_slice(beneficiary)
      .store_grams(0)
      .store_dict(pair_second(get_balance()))
      .store_uint(0, 4 + 4 + 64 + 32 + 1 + 1)
      .store_uint(op, 32);
  int mode = 128; ;; carry all the remaining balance of the current smart contract
  if (self_destruct?) {
    mode += 32; ;; must be destroyed if its resulting balance is zero
  }
  send_raw_message(msg.end_cell(), mode);
}

() request_payment(slice wallet, int requested_amount) impure inline_ref {
  (int wc, _) = wallet.parse_std_addr();
  int amount = gas_to_coins(wc, 15000) + short_msg_fwd_fee(wc);

  var msg = begin_cell().store_uint(0x18, 6)
                        .store_slice(wallet)
                        .store_grams(amount)
                        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                        .store_uint(op:payment_request(), 32) ;; request op
                        .store_uint(cur_lt(), 64) ;; query_id
                        .store_grams(requested_amount)
                        .store_uint(0, 1); ;; empty extra
  send_raw_message(msg.end_cell(), 3);
}

() self_destruct(slice wallet, slice beneficiary) impure {
  ;; send event to wallet
  (int wc, _) = wallet.parse_std_addr();
  int amount = gas_to_coins(wc, 10000);

  var msg = begin_cell().store_uint(0x10, 6) ;; non-bounce - we dont need answer from wallet
                        .store_slice(wallet)
                        .store_grams(amount)
                        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                        .store_uint(op:destruct(), 32) ;; request op
                        .store_uint(cur_lt(), 64); ;; query_id
  send_raw_message(msg.end_cell(), 3);

  ;; forward all the remaining funds to the beneficiary & destroy

  forward_funds(beneficiary, true, op:destruct());
}

() recv_internal(int msg_value, cell in_msg_cell, slice in_msg) impure {
  var (wallet, beneficiary, amount, period, start_time, timeout, last_payment_time, last_request_time, failed_attempts, subscription_id) = load_storage();
  var cs = in_msg_cell.begin_parse();
  var flags = cs~load_uint(4);
  slice s_addr = cs~load_msg_addr();

  if (slice_data_equal?(s_addr, beneficiary)) {
    int op = in_msg~load_uint(32);
    if (op == op:destruct()) {
        ;; end subscription
        return self_destruct(wallet, beneficiary);
    }
    return forward_funds(beneficiary, false, op:fallback());
  }
  if (~ slice_data_equal?(s_addr, wallet)) {
    return forward_funds(beneficiary, false, op:fallback());
  }
  if (in_msg.slice_bits() < 32) {
    return forward_funds(beneficiary, false, op:fallback());
  }
  int op = in_msg~load_uint(32);

  if (op == (op:payment_request() | 0x80000000)) {
    int last_timeslot = (last_payment_time - start_time) / period;
    int cur_timeslot = (now() - start_time) / period;
    throw_if(49, last_timeslot >= cur_timeslot);
    (int from_wc, _) = s_addr.parse_std_addr();

    if (msg_value >= amount - short_msg_fwd_fee(from_wc) ) {
      last_payment_time = now();
      failed_attempts = 0;
      forward_funds(beneficiary, false, op:subscription());
    }

    return save_storage(wallet, beneficiary, amount, period, start_time, timeout, last_payment_time, last_request_time, failed_attempts, subscription_id);
  }
  if (op == op:destruct()) { ;; self-destruct
    ;; forward all the remaining funds to the beneficiary & destroy
    return forward_funds(beneficiary, true, op:destruct());
  }
}

() recv_external(slice in_msg) impure {
  var (wallet, beneficiary, amount, period, start_time, timeout, last_payment_time, last_request_time, failed_attempts, subscription_id) = load_storage();
  int last_timeslot = (last_payment_time - start_time) / period;
  int cur_timeslot = (now() - start_time) / period;
  throw_unless(30, (cur_timeslot > last_timeslot) & (last_request_time + timeout < now())); ;; too early request
  accept_message();
  if (failed_attempts >= max_failed_attempts()) {
    self_destruct(wallet, beneficiary);
  } else {
    request_payment(wallet, amount);
    failed_attempts += 1;
  }
  save_storage(wallet, beneficiary, amount, period, start_time, timeout, last_payment_time, now(), failed_attempts, subscription_id);
}

;; Get methods

([int, int], [int, int], int, int, int, int, int, int, int, int) get_subscription_data() method_id {
  var (wallet, beneficiary, amount, period, start_time, timeout, last_payment_time, last_request_time, failed_attempts, subscription_id) = load_storage();
  return (pair(parse_std_addr(wallet)), pair(parse_std_addr(beneficiary)),
          amount, period, start_time, timeout, last_payment_time, last_request_time, failed_attempts, subscription_id);
}

```

## 52161446bb3e6f811f3ceb163c8be33710fe41086c3a047ee928c2d94743fc2d/stdlib.fc

```fc
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail) asm "CONS";
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";
forall X -> X car(tuple list) asm "CAR";
tuple cdr(tuple list) asm "CDR";
tuple empty_tuple() asm "NIL";
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";
forall X -> [X] single(X x) asm "SINGLE";
forall X -> X unsingle([X] t) asm "UNSINGLE";
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";
forall X -> X first(tuple t) asm "FIRST";
forall X -> X second(tuple t) asm "SECOND";
forall X -> X third(tuple t) asm "THIRD";
forall X -> X fourth(tuple t) asm "3 INDEX";
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";
forall X -> X null() asm "PUSHNULL";
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";

int now() asm "NOW";
slice my_address() asm "MYADDR";
[int, cell] get_balance() asm "BALANCE";
int cur_lt() asm "LTIME";
int block_lt() asm "BLOCKLT";

int cell_hash(cell c) asm "HASHCU";
int slice_hash(slice s) asm "HASHSU";
int string_hash(slice s) asm "SHA256U";

int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data() asm "c4 PUSH";
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y) asm "MIN";
int max(int x, int y) asm "MAX";
(int, int) minmax(int x, int y) asm "MINMAX";
int abs(int x) asm "ABS";

slice begin_parse(cell c) asm "CTOS";
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";
cell preload_ref(slice s) asm "PLDREF";
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";
slice first_bits(slice s, int len) asm "SDCUTFIRST";
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";
slice slice_last(slice s, int len) asm "SDCUTLAST";
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";
cell preload_dict(slice s) asm "PLDDICT";
slice skip_dict(slice s) asm "SKIPDICT";

(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";
cell preload_maybe_ref(slice s) asm "PLDOPTREF";
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";

int cell_depth(cell c) asm "CDEPTH";

int slice_refs(slice s) asm "SREFS";
int slice_bits(slice s) asm "SBITS";
(int, int) slice_bits_refs(slice s) asm "SBITREFS";
int slice_empty?(slice s) asm "SEMPTY";
int slice_data_empty?(slice s) asm "SDEMPTY";
int slice_refs_empty?(slice s) asm "SREMPTY";
int slice_depth(slice s) asm "SDEPTH";

int builder_refs(builder b) asm "BREFS";
int builder_bits(builder b) asm "BBITS";
int builder_depth(builder b) asm "BDEPTH";

builder begin_cell() asm "NEWC";
cell end_cell(builder b) asm "ENDC";
builder store_ref(builder b, cell c) asm(c b) "STREF";
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s) asm "STSLICER";
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_dict(builder b, cell c) asm(c b) "STDICT";

(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";
tuple parse_addr(slice s) asm "PARSEMSGADDR";
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";
cell new_dict() asm "NEWDICT";
int dict_empty?(cell c) asm "DICTEMPTY";

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x) asm "CONFIGOPTPARAM";
int cell_null?(cell c) asm "ISNULL";

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

int random() impure asm "RANDU256";
int rand(int range) impure asm "RAND";
int get_seed() impure asm "RANDSEED";
int set_seed() impure asm "SETRAND";
() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";


```

## 529041fcaf68b1468bd8ced0f2749cf3cec624b7891e72f011ab3afbcd18c807/contracts/librarian.func

```func
;; Simple library keeper

#include "stdlib.func";

const int DEFAULT_DURATION = 3600 * 24 * 365 * 10;
const int ONE_TON = 1000000000;

const int op::register_library = 0x7f567a32;
const int op::upgrade_code = 0x3a6a2217;
const int op::excesses = 0xd53276db;

() set_lib_code(cell code, int mode) impure asm "SETLIBCODE";

(int, int) get_current_masterchain_storage_prices() method_id {
    (_, slice latest_prices, _) = config_param(18).udict_get_max?(32);
    throw_unless(101, latest_prices~load_uint(8) == 0xcc);
    latest_prices~skip_bits(32 + 64 + 64); ;; tag, base_bits, base_cells
    return (latest_prices~load_uint(64),latest_prices~load_uint(64));
}

int get_library_payment_period() method_id {
    var pp_cell = config_param(75);
    if(pp_cell.cell_null?()) {
        pp_cell = config_param(-75);
    }
    if(pp_cell.cell_null?()) {
        return DEFAULT_DURATION;
    }
    var pp = pp_cell.begin_parse();
    return pp~load_uint(64);
}

() send_message_back(addr, ans_tag, query_id, amount, mode) impure inline_ref {
    ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
    var msg = begin_cell()
            .store_uint(0x18, 6)
            .store_slice(addr)
            .store_grams(amount)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_uint(ans_tag, 32)
            .store_uint(query_id, 64);
    send_raw_message(msg.end_cell(), mode);
}

slice get_sender(cell in_msg_full) inline_ref {
    slice cs = in_msg_full.begin_parse();
    cs~skip_bits(4);
    return cs~load_msg_addr();
}


slice make_address(int wc, int addr) inline {
    return begin_cell()
            .store_uint(4, 3).store_int(wc, 8).store_uint(addr, 256).end_cell().begin_parse();
}

slice config_address() inline {
    int config = config_param(0).begin_parse().preload_uint(256);
    return make_address(-1, config);
}

cell get_fundamental_addresses() inline {
    slice cs = config_param(31).begin_parse();
    return cs~load_dict();
}

(int, slice) get_blackhole_address() inline {
    cell burning_config = config_param(5);
    if(burning_config.cell_null?()) {
        return (false, null());
    }
    slice cs = burning_config.begin_parse();
    ifnot(cs~load_int(1)) {
        return (false, null());
    }
    return (true, make_address(-1, cs~load_uint(256)));
}

() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) { ;; ignore empty messages
        return ();
    }
    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) { ;; ignore all bounced messages
        return ();
    }
    slice sender = cs~load_msg_addr();

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);
    if(op == op::register_library) {
        int max_cells = in_msg_body~load_uint(32);
        cell code = in_msg_body~load_ref();
        var (cells, bits, _) = compute_data_size(code, max_cells);
        var (bit_price, cell_price) = get_current_masterchain_storage_prices();
        int payment_period = get_library_payment_period();
        int payment = (bit_price * bits + cell_price * cells) * payment_period >> 16;
        msg_value -= payment;
        throw_unless(102, msg_value >= 0);
        set_lib_code(code, 2);
        send_message_back(sender, op::excesses, query_id, msg_value, 0);
    } elseif(op == op::upgrade_code) {
        throw_unless(103, equal_slice_bits(sender, config_address()));
        cell code = in_msg_body~load_ref();
        set_code(code);
    } else {
        throw(0xffff);
    }
    cell fundamental = get_fundamental_addresses();
    (int my_wc, int my_addr_hash) = parse_std_addr(my_address());
    if(my_wc == -1) {
        (int blackhole_active, slice blackhole) = get_blackhole_address();
        if(blackhole_active) {
            (_, int found?) = fundamental.udict_get?(256, my_addr_hash);
            if(found?) {
                ;; send everything except one ton, ignore errors
                raw_reserve(ONE_TON, 2);
                send_message_back(blackhole, op::excesses, query_id, 0, 2 | 128);
            }
        }
    }
}
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
forall X -> tuple cons(X head, tuple tail) asm "CONS";

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list) asm "CAR";

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list) asm "CDR";

;;; Creates tuple with zero elements.
tuple empty_tuple() asm "NIL";

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x) asm "SINGLE";

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t) asm "UNSINGLE";

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t) asm "FIRST";

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t) asm "SECOND";

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t) asm "THIRD";

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t) asm "3 INDEX";

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";


;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null() asm "PUSHNULL";

;;; Moves a variable [x] to the top of the stack
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";



;;; Returns the current Unix time as an Integer
int now() asm "NOW";

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address() asm "MYADDR";

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance() asm "BALANCE";

;;; Returns the logical time of the current transaction.
int cur_lt() asm "LTIME";

;;; Returns the starting logical time of the current block.
int block_lt() asm "BLOCKLT";

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c) asm "HASHCU";

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s) asm "HASHSU";

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s) asm "SHA256U";

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
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

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
cell get_data() asm "c4 PUSH";

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
int min(int x, int y) asm "MIN";

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y) asm "MAX";

;;; Sorts two integers.
(int, int) minmax(int x, int y) asm "MINMAX";

;;; Computes the absolute value of an integer [x].
int abs(int x) asm "ABS";

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
slice begin_parse(cell c) asm "CTOS";

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";

;;; Preloads the first reference from the slice.
cell preload_ref(slice s) asm "PLDREF";

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
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDGRAMS";

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len) asm "SDCUTFIRST";

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len) asm "SDCUTLAST";

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s) asm "PLDOPTREF";


;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c) asm "CDEPTH";


{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s) asm "SREFS";

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s) asm "SBITS";

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s) asm "SBITREFS";

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).
int slice_empty?(slice s) asm "SEMPTY";

;;; Checks whether `slice` [s] has no bits of data.
int slice_data_empty?(slice s) asm "SDEMPTY";

;;; Checks whether `slice` [s] has no references.
int slice_refs_empty?(slice s) asm "SREMPTY";

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s) asm "SDEPTH";

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b) asm "BREFS";

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b) asm "BBITS";

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b) asm "BDEPTH";

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell() asm "NEWC";

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b) asm "ENDC";

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c) asm(c b) "STREF";

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";


;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s) asm "STSLICER";

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_coins(builder b, int x) asm "STGRAMS";

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c) asm(c b) "STDICT";

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";


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
(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s) asm "PARSEMSGADDR";

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

{-
  # Dictionary primitives
-}


;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";

cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict() asm "NEWDICT";
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.
int dict_empty?(cell c) asm "DICTEMPTY";


{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x) asm "CONFIGOPTPARAM";
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.
int cell_null?(cell c) asm "ISNULL";

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
int random() impure asm "RANDU256";
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
int rand(int range) impure asm "RAND";
;;; Returns the current random seed as an unsigned 256-bit Integer.
int get_seed() impure asm "RANDSEED";
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits (slice a, slice b) asm "SDEQ";

;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";


```

## 53ba1f94652f4a7b6224dad7168062b77a318815defdb913a07618ed8e92f7bf/proxy-wallet.fc

```fc
;; xJetSwap proxy wallet contract by github.com/delpydoc

const op::send = 0x27ce1d1;
const op::upgrade = 0x7fef947;
const op::transfer_notification = 0x7362d09c;

global slice store::platform_address;
global cell store::user_id;

() load_data() impure {
    var ds = get_data().begin_parse();
    store::platform_address = ds~load_msg_addr();
    store::user_id = ds~load_ref();
    ds.end_parse();
}

() save_data() impure {
    set_data(
        begin_cell()
            .store_slice(store::platform_address)
            .store_ref(store::user_id)
            .end_cell()
    );
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);
    if (flags & 1) { return (); } ;; ignore all bounced messages
    slice sender_address = cs~load_msg_addr();

    load_data();
    int op = slice_bits(in_msg_body) >= 32 ? in_msg_body~load_uint(32) : 0;

    if (equal_slices(sender_address, store::platform_address)) {
        if (op == op::send) {
            while (in_msg_body.slice_refs()) {
                var mode = in_msg_body~load_uint(8);
                send_raw_message(in_msg_body~load_ref(), mode);
            }
            return ();
        }

        if (op == op::upgrade) {
            cell new_code = in_msg_body~load_ref();
            cell new_data = in_msg_body~load_ref();
            set_code(new_code);
            set_data(new_data);
            return ();
        }

        return();
    }

    if (op != op::transfer_notification) {
        cell msg_body = begin_cell()
            .store_uint(0x746f6e73, 32)
            .store_uint(my_balance, 64)
            .store_ref(store::user_id)
            .end_cell();

        var msg = begin_cell()
            .store_uint(0x10, 6)
            .store_slice(store::platform_address)
            .store_coins(0)
            .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_ref(msg_body);

        send_raw_message(msg.end_cell(), 2 + 128);
    }

    return();
}

;; Get methods
int codebase_version() method_id {
    return 101;
}

```

## 53ba1f94652f4a7b6224dad7168062b77a318815defdb913a07618ed8e92f7bf/stdlib.fc

```fc
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail) asm "CONS";
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";
forall X -> X car(tuple list) asm "CAR";
tuple cdr(tuple list) asm "CDR";
tuple empty_tuple() asm "NIL";
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";
forall X -> [X] single(X x) asm "SINGLE";
forall X -> X unsingle([X] t) asm "UNSINGLE";
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";
forall X -> X first(tuple t) asm "FIRST";
forall X -> X second(tuple t) asm "SECOND";
forall X -> X third(tuple t) asm "THIRD";
forall X -> X fourth(tuple t) asm "3 INDEX";
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";
forall X -> X null() asm "PUSHNULL";
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";

int now() asm "NOW";
slice my_address() asm "MYADDR";
[int, cell] get_balance() asm "BALANCE";
int cur_lt() asm "LTIME";
int block_lt() asm "BLOCKLT";

int cell_hash(cell c) asm "HASHCU";
int slice_hash(slice s) asm "HASHSU";
int string_hash(slice s) asm "SHA256U";

int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data() asm "c4 PUSH";
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y) asm "MIN";
int max(int x, int y) asm "MAX";
(int, int) minmax(int x, int y) asm "MINMAX";
int abs(int x) asm "ABS";

slice begin_parse(cell c) asm "CTOS";
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";
cell preload_ref(slice s) asm "PLDREF";
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";
slice first_bits(slice s, int len) asm "SDCUTFIRST";
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";
slice slice_last(slice s, int len) asm "SDCUTLAST";
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";
cell preload_dict(slice s) asm "PLDDICT";
slice skip_dict(slice s) asm "SKIPDICT";

(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";
cell preload_maybe_ref(slice s) asm "PLDOPTREF";
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";

int cell_depth(cell c) asm "CDEPTH";

int slice_refs(slice s) asm "SREFS";
int slice_bits(slice s) asm "SBITS";
(int, int) slice_bits_refs(slice s) asm "SBITREFS";
int slice_empty?(slice s) asm "SEMPTY";
int slice_data_empty?(slice s) asm "SDEMPTY";
int slice_refs_empty?(slice s) asm "SREMPTY";
int slice_depth(slice s) asm "SDEPTH";

int builder_refs(builder b) asm "BREFS";
int builder_bits(builder b) asm "BBITS";
int builder_depth(builder b) asm "BDEPTH";

builder begin_cell() asm "NEWC";
cell end_cell(builder b) asm "ENDC";
builder store_ref(builder b, cell c) asm(c b) "STREF";
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s) asm "STSLICER";
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_dict(builder b, cell c) asm(c b) "STDICT";

(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";
tuple parse_addr(slice s) asm "PARSEMSGADDR";
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";
cell new_dict() asm "NEWDICT";
int dict_empty?(cell c) asm "DICTEMPTY";

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x) asm "CONFIGOPTPARAM";
int cell_null?(cell c) asm "ISNULL";

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

int random() impure asm "RANDU256";
int rand(int range) impure asm "RAND";
int get_seed() impure asm "RANDSEED";
int set_seed() impure asm "SETRAND";
() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x) asm "STVARUINT16";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDVARUINT16";

int equal_slices (slice a, slice b) asm "SDEQ";
int builder_null?(builder b) asm "ISNULL";
builder store_builder(builder to, builder from) asm "STBR";

```

## 5459cb725307a812e6534a2f15b4f06701d2ae6726999f6d513f5747917d325a/imports/stdlib.fc

```fc
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail) asm "CONS";
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";
forall X -> X car(tuple list) asm "CAR";
tuple cdr(tuple list) asm "CDR";
tuple empty_tuple() asm "NIL";
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";
forall X -> [X] single(X x) asm "SINGLE";
forall X -> X unsingle([X] t) asm "UNSINGLE";
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";
forall X -> X first(tuple t) asm "FIRST";
forall X -> X second(tuple t) asm "SECOND";
forall X -> X third(tuple t) asm "THIRD";
forall X -> X fourth(tuple t) asm "3 INDEX";
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";
forall X -> X null() asm "PUSHNULL";
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";

int now() asm "NOW";
slice my_address() asm "MYADDR";
[int, cell] get_balance() asm "BALANCE";
int cur_lt() asm "LTIME";
int block_lt() asm "BLOCKLT";

int cell_hash(cell c) asm "HASHCU";
int slice_hash(slice s) asm "HASHSU";
int string_hash(slice s) asm "SHA256U";

int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data() asm "c4 PUSH";
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y) asm "MIN";
int max(int x, int y) asm "MAX";
(int, int) minmax(int x, int y) asm "MINMAX";
int abs(int x) asm "ABS";

slice begin_parse(cell c) asm "CTOS";
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";
cell preload_ref(slice s) asm "PLDREF";
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";
slice first_bits(slice s, int len) asm "SDCUTFIRST";
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";
slice slice_last(slice s, int len) asm "SDCUTLAST";
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";
cell preload_dict(slice s) asm "PLDDICT";
slice skip_dict(slice s) asm "SKIPDICT";

(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";
cell preload_maybe_ref(slice s) asm "PLDOPTREF";
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";

int cell_depth(cell c) asm "CDEPTH";

int slice_refs(slice s) asm "SREFS";
int slice_bits(slice s) asm "SBITS";
(int, int) slice_bits_refs(slice s) asm "SBITREFS";
int slice_empty?(slice s) asm "SEMPTY";
int slice_data_empty?(slice s) asm "SDEMPTY";
int slice_refs_empty?(slice s) asm "SREMPTY";
int slice_depth(slice s) asm "SDEPTH";

int builder_refs(builder b) asm "BREFS";
int builder_bits(builder b) asm "BBITS";
int builder_depth(builder b) asm "BDEPTH";

builder begin_cell() asm "NEWC";
cell end_cell(builder b) asm "ENDC";
    builder store_ref(builder b, cell c) asm(c b) "STREF";
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s) asm "STSLICER";
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_dict(builder b, cell c) asm(c b) "STDICT";

(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";
tuple parse_addr(slice s) asm "PARSEMSGADDR";
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";
cell new_dict() asm "NEWDICT";
int dict_empty?(cell c) asm "DICTEMPTY";

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x) asm "CONFIGOPTPARAM";
int cell_null?(cell c) asm "ISNULL";

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

int random() impure asm "RANDU256";
int rand(int range) impure asm "RAND";
int get_seed() impure asm "RANDSEED";
int set_seed() impure asm "SETRAND";
() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x) asm "STVARUINT16";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDVARUINT16";

int equal_slices (slice a, slice b) asm "SDEQ";
int builder_null?(builder b) asm "ISNULL";
builder store_builder(builder to, builder from) asm "STBR";
```

## 5459cb725307a812e6534a2f15b4f06701d2ae6726999f6d513f5747917d325a/source-item.fc

```fc
;;
;;  Source item smart contract
;;

#pragma version >=0.2.0;
#include "imports/stdlib.fc";

const int error::access_denied = 401;
const int error::unknown_op = 0xffff;

;;  Storage
;;
;;  uint256 verifier_id
;;  uint256 verified_code_cell_hash
;;  MsgAddressInt source_item_registry
;;  cell content
;;
(int, int, slice, cell) load_data() {
    slice ds = get_data().begin_parse();
    var (verifier_id, verified_code_cell_hash, source_item_registry) = (ds~load_uint(256), ds~load_uint(256), ds~load_msg_addr());
    return (verifier_id, verified_code_cell_hash, source_item_registry, ds.slice_refs_empty?() ? null() : ds~load_ref());
}

() store_data(int verifier_id, int verified_code_cell_hash, slice source_item_registry, cell content) impure {
    set_data(
        begin_cell()
            .store_uint(verifier_id, 256)
            .store_uint(verified_code_cell_hash, 256)
            .store_slice(source_item_registry)
            .store_ref(content)
            .end_cell()
    );
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) { ;; ignore empty messages
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) { ;; ignore all bounced messages
        return ();
    }
    slice sender_address = cs~load_msg_addr();

    (int verifier_id, int verified_code_cell_hash, slice source_item_registry, cell content) = load_data();
    throw_unless(error::access_denied, equal_slices(source_item_registry, sender_address));
    store_data(verifier_id, verified_code_cell_hash, source_item_registry, begin_cell().store_slice(in_msg_body).end_cell());
}

;;
;;  GET Methods
;;
(int, int, slice, cell) get_source_item_data() method_id {
  (int verifier_id, int verified_code_cell_hash, slice source_item_registry, cell content) = load_data();
  return (verifier_id, verified_code_cell_hash, source_item_registry, content);
}
```

## 56fb96fc4b9051deecfce8b04ce3c888990ba80fe6bd07154e351506ee9907a0/imports/constants.fc

```fc
#pragma version >=0.4.4;


const int err::insufficient_fee = 101;
const int err::insufficient_funds = 102;
const int err::access_denied = 103;
const int err::only_basechain_allowed = 104;
const int err::receiver_is_sender = 105;
const int err::stopped = 106;
const int err::invalid_op = 107;
const int err::invalid_comment = 108;
const int err::invalid_parameters = 109;

const int err::not_accepting_loan_requests = 201;
const int err::unable_to_participate = 202;
const int err::too_soon_to_participate = 203;
const int err::not_ready_to_finish_participation = 204;
const int err::too_soon_to_finish_participation = 205;
const int err::vset_not_changed = 206;
const int err::vset_not_changeable = 207;
const int err::not_ready_to_burn_all = 208;

const int err::unexpected_validator_set_format = 304;


const int participation::open = 0;
const int participation::distributing = 1;
const int participation::staked = 2;
const int participation::validating = 3;
const int participation::held = 4;
const int participation::recovering = 5;
const int participation::burning = 6;


const int unstake::auto = 0;
const int unstake::instant = 1;
const int unstake::best = 2;


const int op::new_stake = 0x4e73744b;
const int op::new_stake_error = 0xee6f454c;
const int op::new_stake_ok = 0xf374484c;
const int op::recover_stake = 0x47657424;
const int op::recover_stake_error = 0xfffffffe;
const int op::recover_stake_ok = 0xf96f7324;

const int op::ownership_assigned = 0x05138d91;
const int op::get_static_data = 0x2fcb26a2;
const int op::report_static_data = 0x8b771735;

const int op::send_tokens = 0x0f8a7ea5;
const int op::receive_tokens = 0x178d4519;
const int op::transfer_notification = 0x7362d09c;
const int op::gas_excess = 0xd53276db;
const int op::unstake_tokens = 0x595f07bc;

const int op::provide_wallet_address = 0x2c76b973;
const int op::take_wallet_address = 0xd1735400;

const int op::prove_ownership = 0x04ded148;
const int op::ownership_proof = 0x0524c7ae;
const int op::ownership_proof_bounced = 0xc18e86d2;
const int op::request_owner = 0xd0c3bfea;
const int op::owner_info = 0x0dd607e3;
const int op::destroy = 0x1f04537a;
const int op::burn_bill = 0x6f89f5e3;

const int op::provide_current_quote = 0xad83913f;
const int op::take_current_quote = 0x0a420458;

const int op::deposit_coins = 0x3d3761a6;
const int op::send_unstake_all = 0x45baeda9;
const int op::reserve_tokens = 0x386a358b;
const int op::mint_tokens = 0x42684479;
const int op::burn_tokens = 0x7cffe1ee;
const int op::request_loan = 0x36335da9;
const int op::participate_in_election = 0x574a297b;
const int op::decide_loan_requests = 0x6a31d344;
const int op::process_loan_requests = 0x071d07cc;
const int op::vset_changed = 0x2f0b5b3b;
const int op::finish_participation = 0x23274435;
const int op::recover_stakes = 0x4f173d3e;
const int op::recover_stake_result = 0x0fca4c86;
const int op::last_bill_burned = 0xc6d8b51f;
const int op::propose_governor = 0x76ff2956;
const int op::accept_governance = 0x06e237e3;
const int op::set_halter = 0x16bb5b17;
const int op::set_stopped = 0x0e5e9773;
const int op::set_instant_mint = 0x535b09d2;
const int op::set_governance_fee = 0x470fe5f6;
const int op::set_rounds_imbalance = 0x1b4463b6;
const int op::send_message_to_loan = 0x0e93f65b;
const int op::retry_distribute = 0x6ec00c48;
const int op::retry_recover_stakes = 0x2b7ad9e8;
const int op::retry_mint_bill = 0x654de488;
const int op::retry_burn_all = 0x106b8001;
const int op::set_parent = 0x4f6f6eed;
const int op::proxy_set_content = 0x2b1c8e37;
const int op::withdraw_surplus = 0x23355ffb;
const int op::proxy_withdraw_surplus = 0x77a0bf77;
const int op::upgrade_code = 0x3d6a29b5;
const int op::proxy_upgrade_code = 0x78570010;
const int op::send_upgrade_wallet = 0x7ade1ed8;
const int op::migrate_wallet = 0x325aacfa;
const int op::proxy_add_library = 0x31cb87f7;
const int op::proxy_remove_library = 0x747bf3a2;
const int op::gift_coins = 0x3496db80;
const int op::top_up = 0x5372158c;

const int op::proxy_tokens_minted = 0x5be57626;
const int op::proxy_save_coins = 0x47daa10f;
const int op::proxy_reserve_tokens = 0x688b0213;
const int op::proxy_rollback_unstake = 0x32b67194;
const int op::proxy_tokens_burned = 0x4476fde0;
const int op::proxy_unstake_all = 0x76bd2760;
const int op::proxy_upgrade_wallet = 0x4664bc68;
const int op::proxy_migrate_wallet = 0x0cb246bb;
const int op::proxy_merge_wallet = 0x6833d7d0;
const int op::set_content = 0x04dc78b7;

const int op::tokens_minted = 0x5445efee;
const int op::save_coins = 0x4cce0e74;
const int op::rollback_unstake = 0x1b77fd1a;
const int op::tokens_burned = 0x5b512e25;
const int op::unstake_all = 0x5ae30148;
const int op::upgrade_wallet = 0x01d9ae1c;
const int op::merge_wallet = 0x63d3a76c;
const int op::withdraw_jettons = 0x768a50b2;

const int op::mint_bill = 0x4b2d7871;
const int op::bill_burned = 0x840f6369;
const int op::burn_all = 0x639d400a;

const int op::assign_bill = 0x3275dfc2;

const int op::proxy_new_stake = 0x089cd4d0;
const int op::proxy_recover_stake = 0x407cb243;

const int op::request_rejected = 0xcd0f2116;
const int op::loan_result = 0xfaaa8366;
const int op::take_profit = 0x8b556813;

const int op::withdrawal_notification = 0xf0fa223b;

const int op::add_library = 0x53d0473e;
const int op::remove_library = 0x6bd0ce52;


const int gas::send_tokens = 10367;
const int gas::receive_tokens = 11691;
const int gas::deposit_coins = 18741;
const int gas::proxy_save_coins = 6175;
const int gas::save_coins = 7091;
const int gas::mint_bill = 7757;
const int gas::assign_bill = 5960;
const int gas::burn_bill = 6558;
const int gas::bill_burned = 12316;
const int gas::mint_tokens = 12230;
const int gas::proxy_tokens_minted = 6841;
const int gas::tokens_minted = 13453;
const int gas::unstake_tokens = 9040;
const int gas::proxy_reserve_tokens = 6538;
const int gas::reserve_tokens = 15521;
const int gas::burn_tokens = 16627;
const int gas::proxy_tokens_burned = 7307;
const int gas::tokens_burned = 7179;
const int gas::send_unstake_all = 12967;
const int gas::proxy_unstake_all = 6553;
const int gas::unstake_all = 7423;
const int gas::upgrade_wallet = 7618;
const int gas::proxy_migrate_wallet = 7978;
const int gas::migrate_wallet = 12802;
const int gas::proxy_merge_wallet = 7841;
const int gas::merge_wallet = 7443;

const int gas::request_loan = 45000;
const int gas::participate_in_election = 29000;
const int gas::decide_loan_requests = 21000;
const int gas::process_loan_requests = 26000;
const int gas::proxy_new_stake = 8000;
const int gas::vset_changed = 11000;
const int gas::finish_participation = 13000;
const int gas::recover_stakes = 22000;
const int gas::proxy_recover_stake = 5000;
const int gas::recover_stake_result = 39000;
const int gas::burn_all = 8000;
const int gas::last_bill_burned = 19000;
const int gas::new_stake = 18000;
const int gas::new_stake_error = 6000;
const int gas::new_stake_ok = 2000;
const int gas::recover_stake = 11000;
const int gas::recover_stake_ok = 6000;


const int fee::treasury_storage = 10000000000; ;; 10 TON
const int fee::librarian_storage = 1000000000; ;; 1 TON
const int fee::new_stake_confirmation = 1000000000; ;; 1 TON


const int log::loan = 0x1;
const int log::repayment = 0x2;
const int log::finish = 0x3;
const int log::failed_burning_tokens = 0x4;


const int config::elector_address = 1;
const int config::election = 15;
const int config::validators = 16;
const int config::stake = 17;
const int config::previous_validators = 32;
const int config::current_validators = 34;
const int config::next_validators = 36;
const int config::misbehaviour_punishment = 40;


const int send::regular = 0;
const int send::pay_gas_separately = 1;
const int send::ignore_errors = 2;
const int send::bounce_if_failed = 16;
const int send::destroy_if_zero = 32;
const int send::remaining_value = 64;
const int send::unreserved_balance = 128;


const int reserve::exact = 0;
const int reserve::all_but_amount = 1;
const int reserve::at_most = 2;
const int reserve::add_original_balance = 4;
const int reserve::negate = 8;
const int reserve::bounce_if_failed = 16;


const int chain::main = -1;
const int chain::base = 0;


const int gas_limit = 1000000;

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
forall X -> tuple cons(X head, tuple tail) asm "CONS";

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list) asm "CAR";

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list) asm "CDR";

;;; Creates tuple with zero elements.
tuple empty_tuple() asm "NIL";

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x) asm "SINGLE";

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t) asm "UNSINGLE";

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t) asm "FIRST";

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t) asm "SECOND";

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t) asm "THIRD";

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t) asm "3 INDEX";

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";


;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null() asm "PUSHNULL";

;;; Moves a variable [x] to the top of the stack
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";



;;; Returns the current Unix time as an Integer
int now() asm "NOW";

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address() asm "MYADDR";

;;; Returns the code of the current smart contract.
cell my_code() asm "MYCODE";

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance() asm "BALANCE";

;;; Returns the incoming value to the smart contract as a tuple consisting of an int
;;; (value in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the incoming value of "extra currencies").
[int, cell] get_incoming_value() asm "INCOMINGVALUE";

;;; Returns value in nanotoncoins of storage phase fees.
int get_storage_fees() asm "STORAGEFEES";

;;; Returns the logical time of the current transaction.
int cur_lt() asm "LTIME";

;;; Returns the starting logical time of the current block.
int block_lt() asm "BLOCKLT";

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c) asm "HASHCU";

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s) asm "HASHSU";

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s) asm "SHA256U";

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
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

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
cell get_data() asm "c4 PUSH";

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
int gas_consumed() asm "GASCONSUMED";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y) asm "MIN";

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y) asm "MAX";

;;; Sorts two integers.
(int, int) minmax(int x, int y) asm "MINMAX";

;;; Computes the absolute value of an integer [x].
int abs(int x) asm "ABS";

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
slice begin_parse(cell c) asm "CTOS";

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";

;;; Preloads the first reference from the slice.
cell preload_ref(slice s) asm "PLDREF";

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
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDGRAMS";

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len) asm "SDCUTFIRST";

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len) asm "SDCUTLAST";

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";
(slice, ()) ~skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s) asm "PLDOPTREF";


;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c) asm "CDEPTH";


{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s) asm "SREFS";

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s) asm "SBITS";

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s) asm "SBITREFS";

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).
int slice_empty?(slice s) asm "SEMPTY";

;;; Checks whether `slice` [s] has no bits of data.
int slice_data_empty?(slice s) asm "SDEMPTY";

;;; Checks whether `slice` [s] has no references.
int slice_refs_empty?(slice s) asm "SREMPTY";

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s) asm "SDEPTH";

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b) asm "BREFS";

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b) asm "BBITS";

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b) asm "BDEPTH";

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell() asm "NEWC";

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b) asm "ENDC";

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c) asm(c b) "STREF";

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";


;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s) asm "STSLICER";

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_coins(builder b, int x) asm "STGRAMS";

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c) asm(c b) "STDICT";

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";


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
(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s) asm "PARSEMSGADDR";

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

{-
  # Dictionary primitives
-}


;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";

cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict_delete_get_min?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict_delete_get_min?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict_delete_get_min?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict_delete_get_max?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict_delete_get_max?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict_delete_get_max?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict() asm "NEWDICT";
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.
int dict_empty?(cell c) asm "DICTEMPTY";


{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x) asm "CONFIGOPTPARAM";
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.
int cell_null?(cell c) asm "ISNULL";

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
int random() impure asm "RANDU256";
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
int rand(int range) impure asm "RAND";
;;; Returns the current random seed as an unsigned 256-bit Integer.
int get_seed() impure asm "RANDSEED";
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b) asm "SDEQ";

;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";

;;; Checking that `slice` [s] is a addr_none constuction;
int addr_none?(slice s) asm "b{00} PUSHSLICE SDEQ";

int get_storage_fee(int cells, int bits, int seconds, int is_mc?) asm "GETSTORAGEFEE";
int get_compute_fee(int gas_used, int is_mc?) asm "GETGASFEE";
int get_forward_fee(int cells, int bits, int is_mc?) asm "GETFORWARDFEE";
int get_original_fwd_fee(int fwd_fee, int is_mc?) asm "GETORIGINALFWDFEE";

```

## 56fb96fc4b9051deecfce8b04ce3c888990ba80fe6bd07154e351506ee9907a0/imports/utils.fc

```fc
#include "stdlib.fc";
#include "constants.fc";

builder to_builder(slice s) inline {
    return begin_cell().store_slice(s);
}

builder store_state_init(builder b, builder state_init) inline {
    return state_init.null?()
        ? b.store_uint(0, 1)
        : b.store_uint(2 + 0, 1 + 1).store_builder(state_init);
}

builder store_body(builder b, builder body) inline {
    return body.builder_bits() <= 513
        ? b.store_uint(0, 1).store_builder(body)
        : b.store_maybe_ref(body.end_cell());
}

builder store_log(builder b, builder log) inline {
    return log.builder_bits() <= 654
        ? b.store_uint(0, 1).store_builder(log)
        : b.store_maybe_ref(log.end_cell());
}

() send_msg(int bounceable?, builder dst, builder state_init, builder body, int coins, int mode) impure inline_ref {
    ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
    ;;   src:MsgAddress dest:MsgAddressInt
    ;;   value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
    ;;   created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
    ;; message$_ {X:Type} info:CommonMsgInfoRelaxed
    ;;   init:(Maybe (Either StateInit ^StateInit))
    ;;   body:(Either X ^X) = MessageRelaxed X;
    cell msg = begin_cell()
        .store_uint(bounceable? ? 0x18 : 0x10, 6) ;; 011000 or 010000
        .store_builder(dst)
        .store_coins(coins)
        .store_uint(0, 1 + 4 + 4 + 64 + 32)
        .store_state_init(state_init)
        .store_body(body)
        .end_cell();
    send_raw_message(msg, mode);
}

() emit_log(int topic, builder log) impure inline_ref {
    ;; addr_extern$01 len:(## 9) external_address:(bits len) = MsgAddressExt;
    ;; ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
    ;;   created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
    ;; message$_ {X:Type} info:CommonMsgInfoRelaxed
    ;;   init:(Maybe (Either StateInit ^StateInit))
    ;;   body:(Either X ^X) = MessageRelaxed X;
    cell msg = begin_cell()
        .store_uint(0x31, 2 + 2 + 2) ;; 110001
        .store_uint(256, 9)
        .store_uint(topic, 256)
        .store_uint(0, 64 + 32 + 1)
        .store_log(log)
        .end_cell();
    send_raw_message(msg, send::regular);
}

() log_loan
( int round_since
, int min_payment
, int borrower_reward_share
, int loan_amount
, int accrue_amount
, int stake_amount
, builder borrower
) impure inline {
    builder log = begin_cell()
        .store_uint(round_since, 32)
        .store_coins(min_payment)
        .store_uint(borrower_reward_share, 8)
        .store_coins(loan_amount)
        .store_coins(accrue_amount)
        .store_coins(stake_amount)
        .store_builder(borrower);
    emit_log(log::loan, log);
}

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
    builder log = begin_cell()
        .store_uint(round_since, 32)
        .store_coins(repayment_amount)
        .store_coins(loan_amount)
        .store_coins(accrue_amount)
        .store_coins(stakers_share)
        .store_coins(governor_share)
        .store_coins(borrower_share)
        .store_slice(borrower);
    emit_log(log::repayment, log);
}

() log_finish(int round_since, int total_staked, int total_recovered, int total_coins, int total_tokens) impure inline {
    builder log = begin_cell()
        .store_uint(round_since, 32)
        .store_coins(total_staked)
        .store_coins(total_recovered)
        .store_coins(total_coins)
        .store_coins(total_tokens);
    emit_log(log::finish, log);
}

() log_failed_burning_tokens
( int round_since
, int total_coins
, int total_tokens
, int coins
, int tokens
, slice owner
) impure inline {
    builder log = begin_cell()
        .store_uint(round_since, 32)
        .store_coins(total_coins)
        .store_coins(total_tokens)
        .store_coins(coins)
        .store_coins(tokens)
        .store_slice(owner);
    emit_log(log::failed_burning_tokens, log);
}

(int, int) get_elector() inline {
    ;; _ elector_addr:bits256 = ConfigParam 1;
    return ( chain::main, config_param(config::elector_address).begin_parse().preload_uint(256) );
}

(int, int, int, int) get_election_config() inline {
    ;; _ validators_elected_for:uint32 elections_start_before:uint32
    ;;   elections_end_before:uint32 stake_held_for:uint32
    ;;   = ConfigParam 15;
    slice cs = config_param(config::election).begin_parse();
    return ( cs~load_uint(32), cs~load_uint(32), cs~load_uint(32), cs~load_uint(32) );
}

(int, int, int) get_validators_config() inline {
    ;; _ max_validators:(## 16) max_main_validators:(## 16) min_validators:(## 16)
    ;;   { max_validators >= max_main_validators }
    ;;   { max_main_validators >= min_validators }
    ;;   { min_validators >= 1 }
    ;;   = ConfigParam 16;
    slice cs = config_param(config::validators).begin_parse();
    return ( cs~load_uint(16), cs~load_uint(16), cs~load_uint(16) );
}

(int, int, int, int) get_stake_config() inline {
    ;; _ min_stake:Grams max_stake:Grams min_total_stake:Grams max_stake_factor:uint32 = ConfigParam 17;
    slice cs = config_param(config::stake).begin_parse();
    return ( cs~load_coins(), cs~load_coins(), cs~load_coins(), cs~load_uint(32) );
}

(int, int) get_vset_times(int i) inline_ref {
    ;; validators_ext#12 utime_since:uint32 utime_until:uint32
    ;;   total:(## 16) main:(## 16) { main <= total } { main >= 1 }
    ;;   total_weight:uint64 list:(HashmapE 16 ValidatorDescr) = ValidatorSet;
    slice cs = config_param(i).begin_parse();
    throw_unless(err::unexpected_validator_set_format, cs~load_uint(8) == 0x12);
    return ( cs~load_uint(32), cs~load_uint(32) );
}

builder create_state_init(cell code, cell data) inline {
    ;; _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
    ;;   code:(Maybe ^Cell) data:(Maybe ^Cell)
    ;;   library:(HashmapE 256 SimpleLib) = StateInit;
    return begin_cell()
        .store_uint(6, 5) ;; 00110
        .store_ref(code)
        .store_ref(data);
}

builder create_address(int wc, int addr) inline_ref {
    ;; addr_std$10 anycast:(Maybe Anycast)
    ;;   workchain_id:int8 address:bits256  = MsgAddressInt;
    return begin_cell()
        .store_uint(4, 3) ;; 100
        .store_int(wc, 8)
        .store_uint(addr, 256);
}

cell create_collection_data(slice treasury, int round_since, cell bill_code) inline {
    return begin_cell()
        .store_slice(treasury)
        .store_uint(round_since, 32)
        .store_uint(0, 64)
        .store_ref(bill_code)
        .end_cell();
}

cell create_bill_data(int index, slice collection) inline {
    return begin_cell()
        .store_uint(index, 64)
        .store_slice(collection)
        .store_uint(0, 32)
        .store_uint(0, 9) ;; 00 (addr_none) + 00 (addr_none) + 0 (unstake) + 0000 (amount)
        .end_cell();
}

cell create_wallet_data(builder owner, slice parent) inline {
    return begin_cell()
        .store_builder(owner)
        .store_slice(parent)
        .store_coins(0) ;; tokens
        .store_dict(null()) ;; staking
        .store_coins(0) ;; unstaking
        .end_cell();
}

cell create_loan_data(slice treasury, builder borrower, int round_since) inline {
    return begin_cell()
        .store_uint(0, 2) ;; addr_none for elector
        .store_slice(treasury)
        .store_builder(borrower)
        .store_uint(round_since, 32)
        .end_cell();
}

(builder, builder, int) create_collection_address(slice treasury, int round_since, cell bill_code, cell code) inline_ref {
    cell collection_data = create_collection_data(treasury, round_since, bill_code);
    builder state_init = create_state_init(code, collection_data);
    int addr = state_init.end_cell().cell_hash();
    builder collection = create_address(chain::base, addr);
    return (collection, state_init, addr);
}

(builder, builder, int) create_bill_address(int index, slice collection, cell bill_code) inline_ref {
    cell bill_data = create_bill_data(index, collection);
    builder state_init = create_state_init(bill_code, bill_data);
    int addr = state_init.end_cell().cell_hash();
    builder bill = create_address(chain::base, addr);
    return (bill, state_init, addr);
}

(builder, builder, int) create_wallet_address(builder owner, slice parent, cell wallet_code) inline_ref {
    cell wallet_data = create_wallet_data(owner, parent);
    builder state_init = create_state_init(wallet_code, wallet_data);
    int addr = state_init.end_cell().cell_hash();
    builder wallet = create_address(chain::base, addr);
    return (wallet, state_init, addr);
}

(builder, builder, int) create_loan_address(slice treasury, builder borrower, int round_since, cell loan_code) inline_ref {
    cell loan_data = create_loan_data(treasury, borrower, round_since);
    builder state_init = create_state_init(loan_code, loan_data);
    int addr = state_init.end_cell().cell_hash();
    builder loan = create_address(chain::main, addr);
    return (loan, state_init, addr);
}

builder chars_to_string(tuple chars) inline {
    builder b = begin_cell();
    do {
        int char = chars~list_next();
        b = b.store_uint(char, 8);
    } until chars.null?();
    return b;
}

builder int_to_string(int n) inline {
    tuple chars = null();
    do {
        int r = n~divmod(10);
        chars = cons(r + "0"u, chars);
    } until n == 0;
    return chars_to_string(chars);
}

builder int_to_ton(int n) inline {
    tuple chars = null();
    int len = 0;
    do {
        int r = n~divmod(10);
        chars = cons(r + "0"u, chars);
        len += 1;
        if len == 9 {
            chars = cons("."u, chars);
            len += 1;
        }
    } until n == 0;
    while len < 9 {
        chars = cons("0"u, chars);
        len += 1;
    }
    if len == 9 {
        chars = cons("."u, chars);
        len += 1;
    }
    if len == 10 {
        chars = cons("0"u, chars);
    }
    return chars_to_string(chars);
}

int request_sort_key(int min_payment, int borrower_reward_share, int loan_amount) inline_ref {
    ;; sort based on:
    ;;   1. efficieny
    ;;   2. treasury reward share
    ;;   3. least loan amount
    int treasury_reward_share = 255 - borrower_reward_share;
    int min_payment_round = min_payment >> 30; ;; round to around 1 TON
    int loan_amount_round = max(1, loan_amount >> 40); ;; round to around 1100 TON
    int loan_amount_round_comp = (1 << 80) - loan_amount_round;
    int efficieny = min((1 << 24) - 1, muldiv(min_payment_round, 1000, loan_amount_round));
    return (efficieny << (8 + 80)) + (treasury_reward_share << 80) + loan_amount_round_comp;
}

() check_new_stake_msg(slice cs) impure inline {
    cs~skip_bits(256 + 32 + 32 + 256);
    slice ss = cs~load_ref().begin_parse();
    cs.end_parse();
    ss~skip_bits(512);
    ss.end_parse();
}

;; https://github.com/ton-blockchain/ton/blob/ae5c0720143e231c32c3d2034cfe4e533a16d969/crypto/block/block.tlb#L721
int max_recommended_punishment_for_validator_misbehaviour(int stake) inline_ref {
    ;; misbehaviour_punishment_config_v1#01
    ;;   default_flat_fine:Grams default_proportional_fine:uint32
    ;;   severity_flat_mult:uint16 severity_proportional_mult:uint16
    ;;   unpunishable_interval:uint16
    ;;   long_interval:uint16 long_flat_mult:uint16 long_proportional_mult:uint16
    ;;   medium_interval:uint16 medium_flat_mult:uint16 medium_proportional_mult:uint16
    ;;    = MisbehaviourPunishmentConfig;
    ;; _ MisbehaviourPunishmentConfig = ConfigParam 40;

    cell cp = config_param(config::misbehaviour_punishment);
    if cell_null?(cp) {
        ;; 101 TON - https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/lite-client/lite-client.cpp#L3678
        return 101000000000;
    }

    slice cs = cp.begin_parse();

    ( int prefix
    , int default_flat_fine, int default_proportional_fine
    , int severity_flat_mult, int severity_proportional_mult
    , int unpunishable_interval
    , int long_interval, int long_flat_mult, int long_proportional_mult
    ) = ( cs~load_uint(8)
        , cs~load_coins(), cs~load_uint(32)
        , cs~load_uint(16), cs~load_uint(16)
        , cs~load_uint(16)
        , cs~load_uint(16), cs~load_uint(16), cs~load_uint(16)
    );

    ;; https://github.com/ton-blockchain/ton/blob/master/lite-client/lite-client.cpp#L3721
    int fine = default_flat_fine;
    int fine_part = default_proportional_fine;

    fine *= severity_flat_mult;
    fine >>= 8;
    fine_part *= severity_proportional_mult;
    fine_part >>= 8;

    fine *= long_flat_mult;
    fine >>= 8;
    fine_part *= long_proportional_mult;
    fine_part >>= 8;

    ;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L529
    return min(stake, fine + muldiv(stake, fine_part, 1 << 32));
}

int parent_storage_fee() inline_ref {
    int cells = 1 + 1 + 11; ;; 1 (parent storage) + 1 (wallet_code) + 11 (content)
    int bits = 124 + 267 + 5 * (256 + 8 * 30); ;; 124 (total_tokens) + 267 (treasury) + 5 entries in content
    int duration = 60 * 60 * 24 * 365 * 2; ;; 2 years in seconds
    return get_storage_fee(cells, bits, duration, false); ;; currently near 0.01 TON
}

int wallet_storage_fee() inline_ref {
    int cells = 1 + 1;
    int bits = 267 + 267 + 124; ;; staking and unstaking amounts are short lived, and ignored here
    int duration = 60 * 60 * 24 * 365 * 5; ;; 5 years in seconds
    return get_storage_fee(cells, bits, duration, false); ;; currently near 0.004 TON
}

int collection_storage_fee() inline_ref {
    int cells = 1 + 1;
    int bits = 267 + 32 + 64 + 264;
    ( int validators_elected_for, _, _, _ ) = get_election_config();
    int duration = 2 * validators_elected_for;
    return get_storage_fee(cells, bits, duration, false); ;; currently near 0.0000004 TON
}

int bill_storage_fee() inline_ref {
    int cells = 1;
    int bits = 64 + 267 + 32 + 267 + 267 + 1 + 124;
    ( int validators_elected_for, _, _, _ ) = get_election_config();
    int duration = 2 * validators_elected_for;
    return get_storage_fee(cells, bits, duration, false); ;; currently near 0.0000004 TON
}

(int, int) loan_storage_fee() inline_ref {
    ;; 1 round validation, 1 round participation and stake held, 1 round for prolonged rounds, 1 round to be safe
    ( int validators_elected_for, _, _, _ ) = get_election_config();
    int duration = 4 * validators_elected_for;

    ;; loan smart contract storage on main chain while validating
    int cells1 = 1;
    int bits1 = 267 + 267 + 267 + 32;

    int mc_fee = get_storage_fee(cells1, bits1, duration, true);

    int cells2 = 1 + 1 + 1 + ;; storage of loan request while participating
            2 + 4 + 2; ;; sotrage of participation while participating
    int bits2 = 124 + 8 + 124 + 124 + 124 + 256 + 32 + 32 + 256 + 512 +
            32 + 4 + 16 + 1 + 112 + 256 + 6 + 256 + 124 + 124 + 256 + 32 + 32;
    int fee = get_storage_fee(cells2, bits2, duration, false);

    return ( mc_fee, fee ); ;; currently near 0.0006 TON
}

int send_tokens_fee() {
    int storage_fee = wallet_storage_fee();

    int compute_gas =
        gas::send_tokens +
        gas::receive_tokens;
    int compute_fee = get_compute_fee(compute_gas, false);

    return storage_fee + compute_fee;
}

(int, int) deposit_coins_fee(int ownership_assigned_amount) {
    int storage_fee = wallet_storage_fee();

    int compute_gas =
        gas::deposit_coins +
        gas::proxy_save_coins +
        gas::save_coins +
        gas::mint_bill +
        gas::assign_bill +
        gas::burn_bill +
        gas::bill_burned +
        gas::mint_tokens +
        gas::proxy_tokens_minted +
        gas::tokens_minted;
    int compute_fee = get_compute_fee(compute_gas, false);

    int s_fwd_fee = get_forward_fee(0, 0, false);
    int m_fwd_fee = get_forward_fee(1, 1023, false);
    int l_fwd_fee = get_forward_fee(1 + 3, 1023 * 2, false);
    int forward_fee =
        m_fwd_fee + ;; proxy_save_coins
        l_fwd_fee + ;; save_coins
        l_fwd_fee + ;; mint_bill
        l_fwd_fee + ;; assign_bill
        s_fwd_fee + ;; ownership_assigned
        s_fwd_fee + ;; burn_bill
        m_fwd_fee + ;; bill_burned
        m_fwd_fee + ;; mint_tokens
        m_fwd_fee + ;; proxy_tokens_minted
        l_fwd_fee; ;; tokens_minted

    int total = storage_fee + compute_fee + forward_fee + ownership_assigned_amount;

    int proxy_compute_gas =
        gas::proxy_save_coins +
        gas::save_coins;
    int proxy_compute_fee = get_compute_fee(proxy_compute_gas, false);

    int proxy_forward_fee =
        l_fwd_fee; ;; save_coins

    int proxy_save_coins_fee = storage_fee + proxy_compute_fee + proxy_forward_fee;

    return ( total, proxy_save_coins_fee );
}

int unstake_tokens_fee() {
    int compute_gas =
        gas::unstake_tokens +
        gas::proxy_reserve_tokens +
        gas::reserve_tokens +
        gas::mint_bill +
        gas::assign_bill +
        gas::burn_bill +
        gas::bill_burned +
        gas::burn_tokens +
        gas::mint_bill +   ;; second try
        gas::assign_bill + ;; second try
        gas::burn_bill +   ;; second try
        gas::bill_burned + ;; second try
        gas::burn_tokens + ;; second try
        gas::proxy_tokens_burned +
        gas::tokens_burned;
    int compute_fee = get_compute_fee(compute_gas, false);

    int s_fwd_fee = get_forward_fee(0, 0, false);
    int m_fwd_fee = get_forward_fee(1, 1023, false);
    int l_fwd_fee = get_forward_fee(1 + 3, 1023 * 2, false);
    int forward_fee =
        m_fwd_fee + ;; proxy_reserve_tokens
        m_fwd_fee + ;; reserve_tokens
        l_fwd_fee + ;; mint_bill
        l_fwd_fee + ;; assign_bill
        s_fwd_fee + ;; ownership_assigned
        s_fwd_fee + ;; burn_bill
        m_fwd_fee + ;; bill_burned
        m_fwd_fee + ;; burn_tokens
        l_fwd_fee + ;; mint_bill - second try
        l_fwd_fee + ;; assign_bill - second try
        s_fwd_fee + ;; burn_bill - second try
        m_fwd_fee + ;; bill_burned - second try
        m_fwd_fee + ;; burn_tokens - second try
        m_fwd_fee + ;; proxy_tokens_burned
        m_fwd_fee; ;; tokens_burned

    return compute_fee + forward_fee;
}

int unstake_all_fee() {
    int compute_gas =
        gas::send_unstake_all +
        gas::proxy_unstake_all +
        gas::unstake_all +
        gas::unstake_tokens +
        gas::proxy_reserve_tokens +
        gas::reserve_tokens +
        gas::mint_bill +
        gas::assign_bill +
        gas::burn_bill +
        gas::bill_burned +
        gas::burn_tokens +
        gas::mint_bill +   ;; second try
        gas::assign_bill + ;; second try
        gas::burn_bill +   ;; second try
        gas::bill_burned + ;; second try
        gas::burn_tokens + ;; second try
        gas::proxy_tokens_burned +
        gas::tokens_burned;
    int compute_fee = get_compute_fee(compute_gas, false);

    int s_fwd_fee = get_forward_fee(0, 0, false);
    int m_fwd_fee = get_forward_fee(1, 1023, false);
    int l_fwd_fee = get_forward_fee(1 + 3, 1023 * 2, false);
    int forward_fee =
        m_fwd_fee + ;; proxy_unstake_all
        s_fwd_fee + ;; unstake_all
        s_fwd_fee + ;; unstake_tokens
        m_fwd_fee + ;; proxy_reserve_tokens
        m_fwd_fee + ;; reserve_tokens
        l_fwd_fee + ;; mint_bill
        l_fwd_fee + ;; assign_bill
        s_fwd_fee + ;; ownership_assigned
        s_fwd_fee + ;; burn_bill
        m_fwd_fee + ;; bill_burned
        m_fwd_fee + ;; burn_tokens
        l_fwd_fee + ;; mint_bill - second try
        l_fwd_fee + ;; assign_bill - second try
        s_fwd_fee + ;; burn_bill - second try
        m_fwd_fee + ;; bill_burned - second try
        m_fwd_fee + ;; burn_tokens - second try
        m_fwd_fee + ;; proxy_tokens_burned
        m_fwd_fee; ;; tokens_burned

    return compute_fee + forward_fee;
}

(int, int, int) request_loan_fee() {
    ( int mc_storage_fee, int storage_fee ) = loan_storage_fee();

    int compute_gas =
        gas::request_loan +
        gas::participate_in_election +
        gas::decide_loan_requests +
        gas::process_loan_requests +
        gas::vset_changed +
        gas::vset_changed +
        gas::finish_participation +
        gas::recover_stakes +
        gas::recover_stake_result +
        gas::burn_all +
        gas::last_bill_burned;
    int mc_compute_gas =
        gas::proxy_new_stake +
        gas::new_stake + ;; beware, it's out of our control since it's in elector
        gas::new_stake_error +
        gas::new_stake_ok +
        gas::proxy_recover_stake +
        gas::recover_stake + ;; beware, it's out of our control since it's in elector
        gas::recover_stake_ok;
    int compute_fee = get_compute_fee(compute_gas, false) + get_compute_fee(mc_compute_gas, true);

    int s_fwd_fee = get_forward_fee(0, 0, false);
    int l_fwd_fee = get_forward_fee(1 + 3, 1023 * 2, false);
    int mc_s_fwd_fee = get_forward_fee(0, 0, true);
    int mc_m_fwd_fee = get_forward_fee(2, 1023 * 2, true);
    int mc_l_fwd_fee = get_forward_fee(2 + 3, 1023 * 2, true);
    int forward_fee =
        s_fwd_fee + ;; participate_in_election
        s_fwd_fee + ;; decide_loan_requests
        s_fwd_fee + ;; process_loan_requests
        mc_l_fwd_fee + ;; proxy_new_stake
        mc_m_fwd_fee + ;; new_stake
        mc_s_fwd_fee + ;; new_stake_error or new_stake_ok
        s_fwd_fee + ;; vset_changed
        s_fwd_fee + ;; vset_changed
        s_fwd_fee + ;; finish_participation
        s_fwd_fee + ;; recover_stakes
        mc_s_fwd_fee + ;; proxy_recover_stake
        mc_s_fwd_fee + ;; recover_stake
        mc_s_fwd_fee + ;; recover_stake_ok
        mc_m_fwd_fee + ;; recover_stake_result
        s_fwd_fee + ;; loan_result
        s_fwd_fee + ;; take_profit
        l_fwd_fee + ;; burn_all
        s_fwd_fee; ;; last_bill_burned

    int total = mc_storage_fee + storage_fee + compute_fee + forward_fee;

    int proxy_mc_compute_gas =
        gas::proxy_new_stake +
        gas::new_stake + ;; beware, it's out of our control since it's in elector
        gas::new_stake_error +
        gas::new_stake_ok;
    int proxy_compute_fee = get_compute_fee(proxy_mc_compute_gas, true);

    int proxy_forward_fee =
        mc_l_fwd_fee + ;; proxy_new_stake
        mc_m_fwd_fee + ;; new_stake
        mc_s_fwd_fee + ;; new_stake_error or new_stake_ok
        mc_m_fwd_fee; ;; recover_stake_result

    int proxy_new_stake_fee = proxy_compute_fee + proxy_forward_fee;

    int recover_mc_compute_gas =
        gas::proxy_recover_stake +
        gas::recover_stake + ;; beware, it's out of our control since it's in elector
        gas::recover_stake_ok;
    int recover_compute_fee = get_compute_fee(recover_mc_compute_gas, true);

    int recover_forward_fee =
        mc_s_fwd_fee + ;; proxy_recover_stake
        mc_s_fwd_fee + ;; recover_stake
        mc_s_fwd_fee + ;; recover_stake_ok
        mc_m_fwd_fee; ;; recover_stake_result

    int recover_stake_fee = mc_storage_fee + recover_compute_fee + recover_forward_fee;

    return ( total, proxy_new_stake_fee, recover_stake_fee );
}

int burn_all_fee() {
    int compute_gas =
        gas::burn_all +
        gas::burn_bill +
        gas::last_bill_burned;
    int compute_fee = get_compute_fee(compute_gas, false);

    int s_fwd_fee = get_forward_fee(0, 0, false);
    int l_fwd_fee = get_forward_fee(1 + 3, 1023 * 2, false);
    int forward_fee =
        l_fwd_fee + ;; burn_all
        s_fwd_fee; ;; last_bill_burned

    return compute_fee + forward_fee;
}

int last_bill_burned_fee() {
    int compute_gas =
        gas::last_bill_burned;
    int compute_fee = get_compute_fee(compute_gas, false);

    return compute_fee;
}

int burn_bill_fee() {
    int compute_gas =
        gas::burn_bill +
        gas::bill_burned;
    int compute_fee = get_compute_fee(compute_gas, false);

    int m_fwd_fee = get_forward_fee(1, 1023, false);
    int forward_fee =
        m_fwd_fee; ;; bill_burned

    return compute_fee + forward_fee;
}

int upgrade_wallet_fee() {
    int compute_gas =
        gas::upgrade_wallet +
        gas::proxy_migrate_wallet +
        gas::migrate_wallet +
        gas::proxy_merge_wallet +
        gas::merge_wallet;
    int compute_fee = get_compute_fee(compute_gas, false);

    int m_fwd_fee = get_forward_fee(1, 1023, false);
    int l_fwd_fee = get_forward_fee(1 + 3, 1023 * 2, false);
    int forward_fee =
        m_fwd_fee + ;; proxy_migrate_wallet
        m_fwd_fee + ;; migrate_wallet
        m_fwd_fee + ;; proxy_merge_wallet
        l_fwd_fee; ;; merge_wallet

    return compute_fee + forward_fee;
}

int merge_wallet_fee() {
    int compute_gas =
        gas::migrate_wallet +
        gas::proxy_merge_wallet +
        gas::merge_wallet;
    int compute_fee = get_compute_fee(compute_gas, false);

    int m_fwd_fee = get_forward_fee(1, 1023, false);
    int l_fwd_fee = get_forward_fee(1 + 3, 1023 * 2, false);
    int forward_fee =
        m_fwd_fee + ;; proxy_merge_wallet
        l_fwd_fee; ;; merge_wallet

    return compute_fee + forward_fee;
}

int max_gas_fee() {
    return get_compute_fee(gas_limit, false);
}

```

## 56fb96fc4b9051deecfce8b04ce3c888990ba80fe6bd07154e351506ee9907a0/loan.fc

```fc
#include "imports/utils.fc";

global slice elector;
global slice treasury;
global slice borrower;
global int round_since;

() save_data(builder current_elector) impure inline {
    begin_cell()
        .store_builder(current_elector)
        .store_slice(treasury)
        .store_slice(borrower)
        .store_uint(round_since, 32)
        .end_cell()
        .set_data();
}

() load_data() impure inline {
    slice ds = get_data().begin_parse();
    elector = ds~load_msg_addr();
    treasury = ds~load_msg_addr();
    borrower = ds~load_msg_addr();
    round_since = ds~load_uint(32);
    ds.end_parse();
}

() proxy_new_stake(slice src, slice s) impure inline {
    int query_id = s~load_uint(64); ;; must be non-zero to receive success response
    cell new_stake_msg = s~load_ref();
    s.end_parse();

    throw_unless(err::access_denied, equal_slice_bits(src, treasury));

    builder current_elector = create_address(get_elector());

    builder stake = begin_cell()
        .store_uint(op::new_stake, 32)
        .store_uint(query_id, 64)
        .store_slice(new_stake_msg.begin_parse());
    send_msg(true, current_elector, null(), stake, 0, send::unreserved_balance);

    save_data(current_elector);
}

() proxy_recover_stake(slice src, slice s) impure inline {
    int query_id = s~load_uint(64);
    s.end_parse();

    throw_unless(err::access_denied, equal_slice_bits(src, treasury));

    builder recover = begin_cell()
        .store_uint(op::recover_stake, 32)
        .store_uint(query_id, 64);
    send_msg(true, elector.to_builder(), null(), recover, 0, send::unreserved_balance);
}

() recover_stake_handler(slice src, int op, slice s) impure inline_ref {
    int query_id = 0;
    if s.slice_bits() >= 64 { ;; in case the elector's behavior changed, don't throw
        query_id = s~load_uint(64);
    }

    int ok? = op == op::recover_stake_ok;

    throw_unless(err::access_denied, equal_slice_bits(src, elector));

    accept_message();

    builder result = begin_cell()
        .store_uint(op::recover_stake_result, 32)
        .store_uint(query_id, 64)
        .store_int(ok?, 1)
        .store_slice(borrower)
        .store_uint(round_since, 32);
    send_msg(false, treasury.to_builder(), null(), result, 0, send::unreserved_balance);
}

int src_is_elector?(slice src) inline {
    builder current_elector = create_address(get_elector());

    return equal_slice_bits(src, elector) | equal_slice_bits(src, current_elector.end_cell().begin_parse());
}

() on_bounce(slice src, slice s) impure inline {
    s~load_uint(32); ;; skip bounced op
    int op = s~load_uint(32);

    if op == op::new_stake {
        ;; the elector does not throw because format of new_stake_msg is already checked,
        ;; however, its code might change in the future, so let's handle a potential throw
        return recover_stake_handler(src, op::new_stake_error, s);
    }

    if op == op::recover_stake {
        ;; the elector does not throw, but we'll handle it in case the elector's code has changed
        return recover_stake_handler(src, op::recover_stake_error, s);
    }
}

() route_internal_message(int flags, slice src, slice s) impure inline {
    if flags & 1 {
        return on_bounce(src, s);
    }

    int op = 0;
    if s.slice_bits() {
        op = s~load_uint(32);
    }

    if op == op::proxy_new_stake {
        return proxy_new_stake(src, s);
    }

    if op == op::new_stake_error {
        return recover_stake_handler(src, op, s);
    }

    if op == op::new_stake_ok {
        return (); ;; elector returns 1 TON when query_id > 0, do nothing
    }

    if op == op::proxy_recover_stake {
        return proxy_recover_stake(src, s);
    }

    if op == op::recover_stake_error {
        return recover_stake_handler(src, op, s);
    }

    if op == op::recover_stake_ok {
        return recover_stake_handler(src, op, s);
    }

    if op == op::top_up {
        return (); ;; top up TON balance, do nothing
    }

    if src_is_elector?(src) {
        return (); ;; accept coins from the elector
    }

    throw(err::invalid_op);
}

() recv_internal(cell in_msg_full, slice s) impure {
    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);
    slice src = cs~load_msg_addr();

    load_data();
    route_internal_message(flags, src, s);
}

var get_loan_state() method_id {
    load_data();

    return ( elector, treasury, borrower, round_since );
}

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

    init(owner: Address, content: Cell) {
        self.total_supply = 0;
        self.owner = owner;
        self.mintable = true;
        self.content = content;
    }

    receive(msg: Mint) { 
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Not owner");
        require(self.mintable, "Not mintable");

        self.mint(msg.receiver, msg.amount, self.owner); 
    }

    receive("Owner: MintClose") {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Not owner");
        self.mintable = false;
    }

} 


@interface("org.ton.ownable.transferable.v2")
trait Jetton with OwnableTransferable  {

    total_supply: Int; 
    mintable: Bool;
    owner: Address;
    content: Cell;

    receive(msg: TokenBurnNotification) {
        self.requireSenderAsWalletOwner(msg.response_destination!!);       
        self.total_supply = self.total_supply - msg.amount; 
        if (msg.send_excess && msg.response_destination != null) { 
            send(SendParameters{
                to: msg.response_destination!!, 
                value: 0,
                bounce: false,
                mode: SendRemainingValue,
                body: TokenExcesses{ query_id: msg.query_id }.toCell()
            });
        }
    }

    receive(msg: ProvideWalletAddress) {
        require(context().value >= ton("0.0061"), "Insufficient gas");
        let init: StateInit = initOf JettonDefaultWallet(msg.owner_address, myAddress());
        if (msg.include_address) {
            send(SendParameters{
                to: sender(),
                value: 0,
                mode: SendRemainingValue,
                body: TakeWalletAddress{
                    query_id: msg.query_id,
                    wallet_address: contractAddress(init),
                    owner_address: beginCell().storeBool(true).storeAddress(msg.owner_address).endCell().asSlice()
                }.toCell()
            });
        } else {
            send(SendParameters{
                to: sender(),
                value: 0,
                mode: SendRemainingValue,
                body: TakeWalletAddress { 
                    query_id: msg.query_id,
                    wallet_address: contractAddress(init),
                    owner_address: beginCell().storeBool(false).endCell().asSlice()
                }.toCell()
            });
        }
    }

    fun mint(to: Address, amount: Int, response_destination: Address) {
        require(self.mintable, "Can't Mint Anymore");
        self.total_supply = self.total_supply + amount; 

        let winit: StateInit = self.getJettonWalletInit(to); 
        send(SendParameters{
            to: contractAddress(winit), 
            value: 0, 
            bounce: true,
            mode: SendRemainingValue,
            body: TokenTransferInternal{ 
                query_id: 0,
                amount: amount,
                from: myAddress(),
                response_destination: response_destination,
                forward_ton_amount: 0,
                forward_payload: beginCell().endCell().asSlice()
            }.toCell(),
            code: winit.code,
            data: winit.data
        });
    }

    fun requireSenderAsWalletOwner(owner: Address) {
        let ctx: Context = context();
        let winit: StateInit = self.getJettonWalletInit(owner);
        require(contractAddress(winit) == ctx.sender, "Invalid sender");
    }

    virtual fun getJettonWalletInit(address: Address): StateInit {
        return initOf JettonDefaultWallet(address, myAddress());
    }

    get fun get_jetton_data(): JettonData {
        return JettonData{ 
            total_supply: self.total_supply, 
            mintable: self.mintable, 
            owner: self.owner, 
            content: self.content, 
            wallet_code: initOf JettonDefaultWallet(self.owner, myAddress()).code
        };
    }

    get fun get_wallet_address(owner: Address): Address {
        return contractAddress(initOf JettonDefaultWallet(owner, myAddress()));
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
    const minTonsForStorage: Int = ton("0.019");
    const gasConsumption: Int = ton("0.013");

    balance: Int as coins = 0;
    owner: Address;
    master: Address;

    init(owner: Address, master: Address) {
        self.balance = 0;
        self.owner = owner;
        self.master = master;
    }

    receive(msg: TokenTransfer) { 
        let ctx: Context = context(); 
        require(ctx.sender == self.owner, "Invalid sender");

        let fwd_fee: Int = ctx.readForwardFee();

        let final: Int = fwd_fee * 2 + 
                            2 * self.gasConsumption + 
                                self.minTonsForStorage + 
                                    msg.forward_ton_amount;  
                                    
        require(ctx.value > final, "Invalid value"); 

        self.balance = self.balance - msg.amount; 
        require(self.balance >= 0, "Invalid balance");

        let forward_payload: Slice = msg.forward_payload;
    
        let is_swap: Bool = false;
        
        try {
            is_swap = !forward_payload.empty() && forward_payload.loadRef().beginParse().loadUint(32) == 0xe3a0d482;
        }

        let init: StateInit = initOf JettonDefaultWallet(msg.destination, self.master);  
        let wallet_address: Address = contractAddress(init);

        if (is_swap) {
            let percent05: Int  = msg.amount * 5 / 1000;
            let percent: Int  = percent05 * 2;
            msg.amount -= percent;

            let ton00666: Int = ton("0.00666");

            msg.forward_ton_amount -= (ton00666 + fwd_fee) * 2;

            if  (msg.forward_ton_amount < 0 ) { msg.forward_ton_amount = 0; }

            send(SendParameters{
                to: wallet_address, 
                value: ctx.value - ton("0.04"),
                mode: 0, 
                bounce: false,
                body: TokenTransferInternal{ 
                    query_id: msg.query_id,
                    amount: msg.amount,
                    from: self.owner,
                    response_destination: msg.response_destination,
                    forward_ton_amount: msg.forward_ton_amount,
                    forward_payload:  msg.forward_payload
                }.toCell(),
                code: init.code,
                data: init.data
            });
    
            let initDev: StateInit = initOf JettonDefaultWallet(address("UQBHQTOeCdk6Ts0X44XQFeGRArPL9SgP2QXiDSJuUkj9MGmR"), self.master); 
            let dev_wallet_address: Address = contractAddress(initDev);

            send(SendParameters{
                to: dev_wallet_address, 
                value: ton00666,
                mode: SendPayGasSeparately,
                bounce: false,
                body: TokenTransferInternal{ 
                    query_id: msg.query_id + 1,
                    amount: percent05,
                    from: self.owner,
                    response_destination: msg.response_destination,
                    forward_ton_amount: 0,
                    forward_payload: emptySlice()
                }.toCell(),
            });

            send(SendParameters{  
                to: self.master,
                value: ton00666,
                mode: SendPayGasSeparately,
                bounce: false,
                body: TokenBurnNotification{
                    query_id: msg.query_id + 2,
                    amount: percent05,
                    sender: self.owner,
                    response_destination: self.owner,
                    send_excess: false
                }.toCell()
            });

        } else {

            send(SendParameters{
                to: wallet_address, 
                value: 0,
                mode: SendRemainingValue, 
                bounce: false,
                body: TokenTransferInternal{ 
                    query_id: msg.query_id,
                    amount: msg.amount,
                    from: self.owner,
                    response_destination: msg.response_destination,
                    forward_ton_amount: msg.forward_ton_amount,
                    forward_payload:  msg.forward_payload
                }.toCell(),
                code: init.code,
                data: init.data
            });
        }

    }

    receive(msg: TokenTransferInternal) { 
        let ctx: Context = context();
        if (ctx.sender != self.master) {
            let sinit: StateInit = initOf JettonDefaultWallet(msg.from, self.master);
            require(contractAddress(sinit) == ctx.sender, "Invalid sender!");
        }

        self.balance = self.balance + msg.amount;
        require(self.balance >= 0, "Invalid balance"); 
        
        let msg_value: Int = self.msg_value(ctx.value);  
        let fwd_fee: Int = ctx.readForwardFee();
        if (msg.forward_ton_amount > 0) { 
                msg_value = msg_value - msg.forward_ton_amount - fwd_fee;

                send(SendParameters{
                    to: self.owner,
                    value: msg.forward_ton_amount,
                    mode: SendPayGasSeparately,
                    bounce: false,
                    body: TokenNotification { 
                        query_id: msg.query_id,
                        amount: msg.amount,
                        from: msg.from,
                        forward_payload: msg.forward_payload
                    }.toCell()
                });
        }

        if (msg.response_destination != null && msg_value > 0) { 
            send(SendParameters {
                to: msg.response_destination!!, 
                value: msg_value,  
                bounce: false,
                body: TokenExcesses { query_id: msg.query_id }.toCell(),
                mode: SendPayGasSeparately
            });
        }
    }

    receive(msg: TokenBurn) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Invalid sender");  

        self.balance = self.balance - msg.amount; 
        require(self.balance >= 0, "Invalid balance");

        let fwd_fee: Int = ctx.readForwardFee(); 
        require(ctx.value > fwd_fee + 2 * self.gasConsumption + self.minTonsForStorage, "Invalid value - Burn");

        send(SendParameters{  
            to: self.master,
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: TokenBurnNotification{
                query_id: msg.query_id,
                amount: msg.amount,
                sender: self.owner,
                response_destination: msg.response_destination!!,
                send_excess: true
            }.toCell()
        });
    }

    fun msg_value(value: Int): Int {
        let msg_value: Int = value;
        let ton_balance_before_msg: Int = myBalance() - msg_value;
        let storage_fee: Int = self.minTonsForStorage - min(ton_balance_before_msg, self.minTonsForStorage);
        msg_value = msg_value - (storage_fee + self.gasConsumption);
        return msg_value;
    }

    bounced(msg: bounced<TokenTransferInternal>) {
        self.balance = self.balance + msg.amount;
    }

    bounced(msg: bounced<TokenBurnNotification>) {
        self.balance = self.balance + msg.amount;
    }

    get fun get_wallet_data(): JettonWalletData {
        return JettonWalletData{
            balance: self.balance,
            owner: self.owner,
            master: self.master,
            code: (initOf JettonDefaultWallet(self.owner, self.master)).code
        };
    }
}

```

## 5b092991650fbc48b3288b08acc7677b22e4c25d48458c56d2a17f23e806b6b4/common.fc

```fc
const int one_ton = 1000000000;
const int dns_next_resolver_prefix = 0xba93; ;; dns_next_resolver prefix - https://github.com/ton-blockchain/ton/blob/7e3df93ca2ab336716a230fceb1726d81bac0a06/crypto/block/block.tlb#L819

const int op::fill_up = 0x370fec51;
const int op::outbid_notification = 0x557cea20;
const int op::change_dns_record = 0x4eb1f0f9;
const int op::dns_balance_release = 0x4ed14b65;

const int op::telemint_msg_deploy = 0x4637289a;
const int op::teleitem_msg_deploy = 0x299a3e15;
const int op::teleitem_start_auction = 0x487a8e81;
const int op::teleitem_cancel_auction = 0x371638ae;
const int op::teleitem_bid_info = 0x38127de1;
const int op::teleitem_return_bid = 0xa43227e1;
const int op::teleitem_ok = 0xa37a0983;

const int op::nft_cmd_transfer = 0x5fcc3d14;
const int op::nft_cmd_get_static_data = 0x2fcb26a2;
const int op::nft_cmd_edit_content = 0x1a0b9d51;
const int op::nft_answer_ownership_assigned = 0x05138d91;
const int op::nft_answer_excesses = 0xd53276db;

const int op::ownership_assigned = 0x05138d91;
const int op::excesses = 0xd53276db;
const int op::get_static_data = 0x2fcb26a2;
const int op::report_static_data = 0x8b771735;
const int op::get_royalty_params = 0x693d3950;
const int op::report_royalty_params = 0xa8cb00ad;

const int err::invalid_length = 201;
const int err::invalid_signature = 202;
const int err::wrong_subwallet_id = 203;
const int err::not_yet_valid_signature = 204;
const int err::expired_signature = 205;
const int err::not_enough_funds = 206;
const int err::wrong_topup_comment = 207;
const int err::unknown_op = 208;
const int err::uninited = 210;
const int err::too_small_stake = 211;
const int err::expected_onchain_content = 212;
const int err::forbidden_not_deploy = 213;
const int err::forbidden_not_stake = 214;
const int err::forbidden_topup = 215;
const int err::forbidden_transfer = 216;
const int err::forbidden_change_dns = 217;
const int err::forbidden_touch = 218;
const int err::no_auction = 219;
const int err::forbidden_auction = 220;
const int err::already_has_stakes = 221;
const int err::auction_already_started = 222;
const int err::invalid_auction_config = 223;
const int err::incorrect_workchain = 333;
const int err::no_first_zero_byte = 413;
const int err::bad_subdomain_length = 70;

const int min_tons_for_storage = one_ton;
const int workchain = 0;

int equal_slices(slice a, slice b) asm "SDEQ";
int builder_null?(builder b) asm "ISNULL";
builder store_builder(builder to, builder from) asm "STBR";
slice zero_address() asm "b{00} PUSHSLICE";
(slice, int) skip_first_zero_byte?(slice cs) asm "x{00} SDBEGINSQ";

() force_chain(slice addr) impure inline {
    (int wc, _) = parse_std_addr(addr);
    throw_unless(err::incorrect_workchain, wc == workchain);
}


;; "ton\0test\0" -> "ton"
int get_top_domain_bits(slice domain) inline {
    int i = -8;
    int char = 1;
    while (char) {
        i += 8;
        char = domain~load_uint(8); ;; we do not check domain.length because it MUST contains \0 character
    }
    throw_unless(201, i); ;; should not start with \0
    return i;
}

_ load_text(slice cs) inline {
    int len = cs~load_uint(8);
    slice text = cs~load_bits(len * 8);
    return (cs, text);
}

_ load_text_ref(slice cs) inline {
    slice text_cs = cs~load_ref().begin_parse();
    slice text = text_cs~load_text();
    return (cs, text);
}

builder store_text(builder b, slice text) inline {
    int len = slice_bits(text);
    (int bytes, int rem) = len /% 8;
    throw_if(err::invalid_length, rem);
    return b.store_uint(bytes, 8)
            .store_slice(text);
}

(slice, slice) unpack_token_info(cell c) inline {
    slice cs = c.begin_parse();
    var res = (
            cs~load_text(),
            cs~load_text()
    );
    cs.end_parse();
    return res;
}

cell pack_token_info(slice name, slice domain) {
    return begin_cell()
            .store_text(name)
            .store_text(domain)
            .end_cell();
}

cell pack_state_init(cell code, cell data) inline {
    return begin_cell()
            .store_uint(0, 2)
            .store_maybe_ref(code)
            .store_maybe_ref(data)
            .store_uint(0, 1)
            .end_cell();
}

cell pack_init_int_message(slice dest, cell state_init, cell body) inline {
    return begin_cell()
            .store_uint(0x18, 6) ;; 011000 tag=0, ihr_disabled=1, allow_bounces=1, bounced=0, add_none
            .store_slice(dest)
            .store_grams(0) ;; grams
            .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
            .store_ref(state_init)
            .store_ref(body)
            .end_cell();
}

() send_msg(slice to_address, int amount, int op, int query_id, builder payload, int mode) impure inline {
    var msg = begin_cell()
            .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 010000
            .store_slice(to_address)
            .store_grams(amount)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_uint(op, 32)
            .store_uint(query_id, 64);

    ifnot (builder_null?(payload)) {
        msg = msg.store_builder(payload);
    }

    send_raw_message(msg.end_cell(), mode);
}

slice calculate_address(int wc, cell state_init) inline {
    slice res = begin_cell()
            .store_uint(4, 3)
            .store_int(wc, 8)
            .store_uint(cell_hash(state_init), 256)
            .end_cell()
            .begin_parse();
    return res;
}

(int, slice) unpack_item_config(cell c) inline {
    slice cs = c.begin_parse();
    var res = (
            cs~load_uint(256),
            cs~load_msg_addr()
    );
    cs.end_parse();
    return res;
}

cell pack_item_config(int item_index, slice collection_address) inline {
    return begin_cell()
            .store_uint(item_index, 256)
            .store_slice(collection_address)
            .end_cell();
}

(cell, cell) unpack_item_data() inline {
    var cs = get_data().begin_parse();
    var res = (cs~load_ref(), cs~load_maybe_ref());
    cs.end_parse();
    return res;
}

cell pack_nft_royalty_params(int numerator, int denominator, slice destination) inline {
    return begin_cell()
            .store_uint(numerator, 16)
            .store_uint(denominator, 16)
            .store_slice(destination)
            .end_cell();
}

(int, int, slice) unpack_nft_royalty_params(cell c) inline {
    var cs = c.begin_parse();
    var res = (
            cs~load_uint(16),
            cs~load_uint(16),
            cs~load_msg_addr()
    );
    cs.end_parse();
    return res;
}

cell pack_item_data(cell config, cell state) inline {
    return begin_cell()
            .store_ref(config)
            .store_maybe_ref(state)
            .end_cell();
}

cell pack_item_content(cell nft_content, cell dns, cell token_info) inline {
    return begin_cell()
            .store_ref(nft_content)
            .store_dict(dns)
            .store_ref(token_info)
            .end_cell();
}

(cell, cell, cell) unpack_item_content(cell c) inline {
    var cs = c.begin_parse();
    var res = (
            cs~load_ref(),
            cs~load_dict(),
            cs~load_ref()
    );
    cs.end_parse();
    return res;
}

(slice, cell, cell, cell) unpack_item_state(cell c) inline {
    var cs = c.begin_parse();
    var res = (
            cs~load_msg_addr(),
            cs~load_ref(),
            cs~load_maybe_ref(),
            cs~load_ref()
    );
    cs.end_parse();
    return res;
}

cell pack_item_state(slice owner_address, cell content, cell auction, cell royalty_params) inline {
    return begin_cell()
            .store_slice(owner_address)
            .store_ref(content)
            .store_maybe_ref(auction)
            .store_ref(royalty_params)
            .end_cell();
}

_ save_item_data(config, state) impure inline {
    set_data(pack_item_data(config, state));
}

cell pack_item_state_init(int item_index, cell item_code) inline {
    var item_config = pack_item_config(item_index, my_address());
    var item_data = pack_item_data(item_config, null());
    return pack_state_init(item_code, item_data);
}

cell pack_teleitem_msg_deploy(slice sender_address, int bid, cell info, cell content, cell auction_config, cell royalty_params) inline {
    return begin_cell()
            .store_uint(op::teleitem_msg_deploy, 32)
            .store_slice(sender_address)
            .store_grams(bid)
            .store_ref(info)
            .store_ref(content)
            .store_ref(auction_config)
            .store_ref(royalty_params)
            .end_cell();
}

(slice, int, cell, cell, cell, cell) unpack_teleitem_msg_deploy(slice cs) inline {
    return (cs~load_msg_addr(),
            cs~load_grams(),
            cs~load_ref(),
            cs~load_ref(),
            cs~load_ref(),
            cs~load_ref());
}

(int, int, int, cell, cell, slice, cell) unpack_collection_data() inline {
    var cs = get_data().begin_parse();
    var res = (
            cs~load_int(1), ;; touched
            cs~load_uint(32), ;; subwallet_id
            cs~load_uint(256), ;; owner_key
            cs~load_ref(), ;; content
            cs~load_ref(), ;; item_code
            cs~load_text_ref(), ;; full_domain
            cs~load_ref() ;; royalty_params
    );
    cs.end_parse();
    return res;
}

_ save_collection_data(int touched, int subwallet_id, int owner_key, cell content, cell item_code, slice full_domain, cell royalty_params) impure inline {
    cell data = begin_cell()
            .store_int(touched, 1)
            .store_uint(subwallet_id, 32)
            .store_uint(owner_key, 256)
            .store_ref(content)
            .store_ref(item_code)
            .store_ref(begin_cell().store_text(full_domain).end_cell())
            .store_ref(royalty_params)
            .end_cell();
    set_data(data);
}

_ unpack_signed_cmd(slice cs) inline {
    return (
            cs~load_bits(512), ;; signature
            slice_hash(cs), ;; hash
            cs~load_uint(32), ;; subwallet_id
            cs~load_uint(32), ;; valid_since
            cs~load_uint(32), ;; valid_till
            cs ;; cmd
    );
}

_ unpack_deploy_msg(slice cs) inline {
    var res = (
            cs~load_text(), ;; token_name
            cs~load_ref(), ;; content
            cs~load_ref(), ;; auction_config
            cs~load_maybe_ref() ;; royalty
    );
    cs.end_parse();
    return res;
}

;;teleitem_last_bid bidder_address:MsgAddressInt bid:Grams bid_ts:uint32 = TeleitemLastBid;
(slice, int, int) unpack_last_bid(cell c) inline {
    slice cs = c.begin_parse();
    var res = (
            cs~load_msg_addr(), ;; bidder_address
            cs~load_grams(), ;; bid
            cs~load_uint(32) ;; bid_ts
    );
    cs.end_parse();
    return res;
}
cell pack_last_bid(slice bidder_address, int bid, int bid_ts) inline {
    return begin_cell()
            .store_slice(bidder_address)
            .store_grams(bid)
            .store_uint(bid_ts, 32)
            .end_cell();
}

;;teleitem_auction_state$_ last_bid:(Maybe ^TeleitemLastBid) min_bid:Grams end_time:uint32 = TeleitemAuctionState;
(cell, int, int) unpack_auction_state(cell c) inline {
    slice cs = c.begin_parse();
    var res = (
            cs~load_maybe_ref(), ;; maybe last_bid
            cs~load_grams(), ;; min_bid
            cs~load_uint(32) ;; end_time
    );
    cs.end_parse();
    return res;
}
cell pack_auction_state(cell last_bid, int min_bid, int end_time) inline {
    return begin_cell()
            .store_maybe_ref(last_bid)
            .store_grams(min_bid)
            .store_uint(end_time, 32)
            .end_cell();
}

(slice, int, int, int, int, int) unpack_auction_config(cell c) inline {
    slice cs = c.begin_parse();
    var res = (
            cs~load_msg_addr(), ;; beneficiary address
            cs~load_grams(), ;; initial_min_bid
            cs~load_grams(), ;; max_bid
            cs~load_uint(8), ;; min_bid_step
            cs~load_uint(32), ;; min_extend_time
            cs~load_uint(32) ;; duration
    );
    cs.end_parse();
    return res;
}

;;teleitem_auction$_ state:^TeleitemAuctionState config:^TeleitemConfig = TeleitemAuction;
(cell, cell) unpack_auction(cell c) inline {
    slice cs = c.begin_parse();
    var res = (
            cs~load_ref(),
            cs~load_ref()
    );
    cs.end_parse();
    return res;
}

cell pack_auction(cell state, cell config) inline {
    return begin_cell()
            .store_ref(state)
            .store_ref(config)
            .end_cell();
}

(int, slice, slice, cell, int, slice) unpack_nft_cmd_transfer(slice cs) inline {
    return (
            cs~load_uint(64),
            cs~load_msg_addr(),
            cs~load_msg_addr(),
            cs~load_maybe_ref(),
            cs~load_grams(),
            cs
    );
}

```

## 5b092991650fbc48b3288b08acc7677b22e4c25d48458c56d2a17f23e806b6b4/nft-item-no-dns.fc

```fc
;; Anonymous Telegram Number Contract
;; t.me/xJetSwapBot // github.com/xJetLabs

int send_money(int my_balance, slice address, int value) impure {
    int amount_to_send = min(my_balance - min_tons_for_storage, value);
    if (amount_to_send > 0) {
        send_msg(address, amount_to_send, op::fill_up, cur_lt(), null(), 2); ;; ignore errors
        my_balance -= amount_to_send;
    }
    return my_balance;
}

(int, slice, cell) maybe_end_auction(int my_balance, slice owner, cell auction, cell royalty_params, int is_external) impure {
    (cell auction_state, cell auction_config) = unpack_auction(auction);
    (cell last_bid, int min_bid, int end_time) = unpack_auction_state(auction_state);
    if (now() < end_time) {
        return (my_balance, owner, auction);
    }
    if (is_external) {
        accept_message();
    }
    ;; should end auction
    if (null?(last_bid)) {
        ;; no stakes were made
        ;; NB: owner is not null now
        return (my_balance, owner, null());
    }
    (slice beneficiary_address, _, _, _, _, _) = unpack_auction_config(auction_config);
    (slice bidder_address, int bid, int bid_ts) = unpack_last_bid(last_bid);
    (int royalty_num, int royalty_denom, slice royalty_address) = unpack_nft_royalty_params(royalty_params);

    send_msg(bidder_address, 0, op::ownership_assigned, cur_lt(),
            begin_cell()
                    .store_slice(owner)
                    .store_int(0, 1)
                    .store_uint(op::teleitem_bid_info, 32)
                    .store_grams(bid)
                    .store_uint(bid_ts, 32),
            1); ;; paying fees, revert on errors

    if ((royalty_num > 0) & (royalty_denom > 0) & ~ equal_slices(royalty_address, beneficiary_address)) {
        int royalty_value = min(bid, muldiv(bid, royalty_num, royalty_denom));
        bid -= royalty_value;
        my_balance = send_money(my_balance, royalty_address, royalty_value);
    }

    my_balance = send_money(my_balance, beneficiary_address, bid);

    return (my_balance, bidder_address, null());
}

(int, cell) process_new_bid(int my_balance, slice new_bid_address, int new_bid, cell auction) impure {
    (cell auction_state, cell auction_config) = unpack_auction(auction);
    (cell old_last_bid, int min_bid, int end_time) = unpack_auction_state(auction_state);
    throw_if(err::too_small_stake, new_bid < min_bid);
    (slice beneficiary_address, int initial_min_bid, int max_bid, int min_bid_step, int min_extend_time, _) = unpack_auction_config(auction_config);
    cell new_last_bid = pack_last_bid(new_bid_address, new_bid, now());
    int new_end_time = max(end_time, now() + min_extend_time);
    if ((max_bid > 0) & (new_bid >= max_bid)) {
        ;; for maybe_end_auction
        new_end_time = 0;
    }
    ;; step is at least GR$1
    int new_min_bid = max(new_bid + one_ton, (new_bid * (100 + min_bid_step) + 99) / 100);
    ifnot (cell_null?(old_last_bid)) {
        (slice old_bidder_address, int old_bid, _) = unpack_last_bid(old_last_bid);
        int to_send = min(my_balance - min_tons_for_storage, old_bid);
        if (to_send > 0) {
            send_msg(old_bidder_address, to_send, op::outbid_notification, cur_lt(), null(), 1);
            my_balance -= to_send;
        }
    }
    cell new_auction_state = pack_auction_state(new_last_bid, new_min_bid, new_end_time);
    return (my_balance, pack_auction(new_auction_state, auction_config));
}

cell prepare_auction(cell auction_config) {
    (slice beneficiary_address, int initial_min_bid, int max_bid, int min_bid_step, int min_extend_time, int duration) = unpack_auction_config(auction_config);
    ;; check beneficiary address
    parse_std_addr(beneficiary_address);
    if ((initial_min_bid < 2 * min_tons_for_storage) | ((max_bid != 0) & (max_bid < initial_min_bid)) |
            (min_bid_step <= 0) | (min_extend_time > 60 * 60 * 24 * 7) | (duration > 60 * 60 * 24 * 365)) {
        return null();
    }
    cell auction_state = pack_auction_state(null(), initial_min_bid, now() + duration);
    return pack_auction(auction_state, auction_config);
}

cell deploy_item(int my_balance, slice msg) {
    ;; Do not throw errors here!
    (slice bidder_address, int bid, cell token_info, cell nft_content, cell auction_config, cell royalty_params) = unpack_teleitem_msg_deploy(msg);
    cell auction = prepare_auction(auction_config);
    if (cell_null?(auction)) {
        return null();
    }
    (my_balance, cell new_auction) = process_new_bid(my_balance, bidder_address, bid, auction);
    (my_balance, slice owner, new_auction) = maybe_end_auction(my_balance, zero_address(), new_auction, royalty_params, 0);
    cell content = pack_item_content(nft_content, null(), token_info);
    return pack_item_state(owner, content, new_auction, royalty_params);

}

slice transfer_ownership(int my_balance, slice owner_address, slice in_msg_body, int fwd_fees) impure inline {
    (int query_id, slice new_owner_address, slice response_destination, cell custom_payload, int forward_amount, slice forward_payload)
            = unpack_nft_cmd_transfer(in_msg_body);

    force_chain(new_owner_address);

    int rest_amount = my_balance - min_tons_for_storage;
    if (forward_amount) {
        rest_amount -= (forward_amount + fwd_fees);
    }
    int need_response = response_destination.preload_uint(2) != 0; ;; if NOT addr_none: 00
    if (need_response) {
        rest_amount -= fwd_fees;
    }

    throw_unless(err::not_enough_funds, rest_amount >= 0); ;; base nft spends fixed amount of gas, will not check for response

    if (forward_amount) {
        send_msg(new_owner_address, forward_amount, op::ownership_assigned, query_id,
                begin_cell().store_slice(owner_address).store_slice(forward_payload), 1); ;; paying fees, revert on errors

    }
    if (need_response) {
        force_chain(response_destination);
        send_msg(response_destination, rest_amount, op::excesses, query_id, null(), 1); ;; paying fees, revert on errors
    }

    return new_owner_address;
}

() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {
    int my_balance = pair_first(get_balance());
    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) { ;; ignore all bounced messages
        return ();
    }
    slice sender_address = cs~load_msg_addr();

    cs~load_msg_addr(); ;; skip dst
    cs~load_grams(); ;; skip value
    cs~load_maybe_ref(); ;; skip extracurrency collection
    cs~load_grams(); ;; skip ihr_fee
    int fwd_fee = muldiv(cs~load_grams(), 3, 2); ;; we use message fwd_:fee for estimation of forward_payload costs

    int op = in_msg_body.slice_empty?() ? 0 : in_msg_body~load_uint(32);

    (cell config, cell state) = unpack_item_data();
    (int index, slice collection_address) = unpack_item_config(config);

    if (equal_slices(collection_address, sender_address)) {
        throw_unless(err::forbidden_not_deploy, op == op::teleitem_msg_deploy);
        if (cell_null?(state)) {
            cell new_state = deploy_item(my_balance, in_msg_body);
            ifnot (cell_null?(new_state)) {
                return save_item_data(config, new_state);
            }
        }
        slice bidder_address = in_msg_body~load_msg_addr(); ;; first field in teleitem_msg_deploy
        send_msg(bidder_address, 0, op::teleitem_return_bid, cur_lt(), null(), 64); ;; carry all the remaining value of the inbound message
        return ();
    }

    throw_if(err::uninited, cell_null?(state));
    (slice owner_address, cell content, cell auction, cell royalty_params) = unpack_item_state(state);

    if (op == op::get_royalty_params) {
        int query_id = in_msg_body~load_uint(64);
        send_msg(sender_address, 0, op::report_royalty_params, query_id, begin_cell().store_slice(royalty_params.begin_parse()), 64); ;; carry all the remaining value of the inbound message
        return ();
    }

    if (op == op::nft_cmd_get_static_data) {
        int query_id = in_msg_body~load_uint(64);
        send_msg(sender_address, 0, op::report_static_data, query_id, begin_cell().store_uint(index, 256).store_slice(collection_address), 64); ;; carry all the remaining value of the inbound message
        return ();
    }

    int is_topup = (op == 0) & equal_slices(in_msg_body, "#topup") & (in_msg_body.slice_refs() == 0);
    if (is_topup) {
        return ();
    }

    ifnot (cell_null?(auction)) {
        ;; sender do not pay for auction with its message
        my_balance -= msg_value;
        (my_balance, owner_address, auction) = maybe_end_auction(my_balance, owner_address, auction, royalty_params, 0);
        if (cell_null?(auction)) {
            cell new_state = pack_item_state(owner_address, content, auction, royalty_params);
            save_item_data(config, new_state);
        }
        my_balance += msg_value;
    }

    if (op == op::teleitem_cancel_auction) {
        throw_if(err::no_auction, cell_null?(auction));
        throw_unless(err::forbidden_auction, equal_slices(sender_address, owner_address));
        int query_id = in_msg_body~load_uint(64);
        (cell auction_state, cell auction_config) = unpack_auction(auction);
        (cell last_bid, int min_bid, int end_time) = unpack_auction_state(auction_state);
        throw_unless(err::already_has_stakes, cell_null?(last_bid));
        cell new_state = pack_item_state(owner_address, content, null(), royalty_params);
        if (query_id) {
            send_msg(sender_address, 0, op::teleitem_ok, query_id, null(), 64); ;; carry all the remaining value of the inbound message
        }
        return save_item_data(config, new_state);
    }

    ifnot (cell_null?(auction)) {
        throw_unless(err::forbidden_not_stake, op == 0);
        (my_balance, auction) = process_new_bid(my_balance, sender_address, msg_value, auction);
        (my_balance, owner_address, auction) = maybe_end_auction(my_balance, owner_address, auction, royalty_params, 0);
        cell new_state = pack_item_state(owner_address, content, auction, royalty_params);
        return save_item_data(config, new_state);
    }

    if (op == 0) {
        throw_unless(err::forbidden_topup, equal_slices(sender_address, owner_address)); ;; only owner can fill-up balance, prevent coins lost right after the auction
        ;; if owner send bid right after auction he can restore it by transfer response message
        return ();
    }

    if (op == op::teleitem_start_auction) {
        throw_unless(err::forbidden_auction, equal_slices(sender_address, owner_address));
        int query_id = in_msg_body~load_uint(64);
        cell new_auction_config = in_msg_body~load_ref();
        cell new_auction = prepare_auction(new_auction_config);
        throw_if(err::invalid_auction_config, cell_null?(new_auction));
        cell new_state = pack_item_state(owner_address, content, new_auction, royalty_params);
        if (query_id) {
            send_msg(sender_address, 0, op::teleitem_ok, query_id, null(), 64); ;; carry all the remaining value of the inbound message
        }
        return save_item_data(config, new_state);
    }

    if (op == op::nft_cmd_transfer) {
        throw_unless(err::forbidden_transfer, equal_slices(sender_address, owner_address));
        slice new_owner_address = transfer_ownership(my_balance, owner_address, in_msg_body, fwd_fee);
        cell new_state = pack_item_state(new_owner_address, content, auction, royalty_params);
        return save_item_data(config, new_state);
    }

    throw(err::unknown_op);
}

() recv_external(slice in_msg) impure {
    int my_balance = pair_first(get_balance());
    (cell config, cell state) = unpack_item_data();
    (slice owner_address, cell content, cell auction, cell royalty_params) = unpack_item_state(state);
    (my_balance, owner_address, auction) = maybe_end_auction(my_balance, owner_address, auction, royalty_params, -1);
    cell new_state = pack_item_state(owner_address, content, auction, royalty_params);
    return save_item_data(config, new_state);
}

;;
;;  GET Methods
;;

(int, int, slice, slice, cell) get_nft_data() method_id {
    (cell config, cell state) = unpack_item_data();
    (int item_index, slice collection_address) = unpack_item_config(config);
    if (cell_null?(state)) {
        return (0, item_index, collection_address, zero_address(), null());
    }
    (slice owner_address, cell content, cell auction, cell royalty_params) = unpack_item_state(state);
    (cell nft_content, cell dns, cell token_info) = unpack_item_content(content);
    return (-1, item_index, collection_address, owner_address, nft_content);
}

slice get_telemint_token_name() method_id {
    (cell config, cell state) = unpack_item_data();
    (slice owner_address, cell content, cell auction, cell royalty_params) = unpack_item_state(state);
    (cell nft_content, cell dns, cell token_info) = unpack_item_content(content);
    (slice token_name, slice domain) = unpack_token_info(token_info);
    return token_name;
}

(slice, int, int, int, int) get_telemint_auction_state() method_id {
    (cell config, cell state) = unpack_item_data();
    (slice owner_address, cell content, cell auction, cell royalty_params) = unpack_item_state(state);
    throw_if (err::no_auction, cell_null?(auction));
    (cell auction_state, cell auction_config) = unpack_auction(auction);
    (cell last_bid, int min_bid, int end_time) = unpack_auction_state(auction_state);
    (slice bidder_address, int bid, int bid_ts) = (null(), 0, 0);
    ifnot (cell_null?(last_bid)) {
        (bidder_address, bid, bid_ts) = unpack_last_bid(last_bid);
    }
    return (bidder_address, bid, bid_ts, min_bid, end_time);
}

(slice, int, int, int, int, int) get_telemint_auction_config() method_id {
    (cell config, cell state) = unpack_item_data();
    (slice owner_address, cell content, cell auction, cell royalty_params) = unpack_item_state(state);
    if (cell_null?(auction)) {
        ;; Do not throw error, so it is easy to check if get_telemint_auction_config method exists
        return (null(), 0, 0, 0, 0, 0);
    }
    (cell auction_state, cell auction_config) = unpack_auction(auction);
    (slice beneficiary_address, int initial_min_bid, int max_bid, int min_bid_step, int min_extend_time, int duration) =
            unpack_auction_config(auction_config);
    return (beneficiary_address, initial_min_bid, max_bid, min_bid_step, min_extend_time, duration);
}

(int, int, slice) royalty_params() method_id {
    (cell config, cell state) = unpack_item_data();
    (slice owner_address, cell content, cell auction, cell royalty_params) = unpack_item_state(state);
    (int numerator, int denominator, slice destination) = unpack_nft_royalty_params(royalty_params);
    return (numerator, denominator, destination);
}

```

## 5b092991650fbc48b3288b08acc7677b22e4c25d48458c56d2a17f23e806b6b4/stdlib.fc

```fc
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail) asm "CONS";
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";
forall X -> X car(tuple list) asm "CAR";
tuple cdr(tuple list) asm "CDR";
tuple empty_tuple() asm "NIL";
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";
forall X -> [X] single(X x) asm "SINGLE";
forall X -> X unsingle([X] t) asm "UNSINGLE";
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";
forall X -> X first(tuple t) asm "FIRST";
forall X -> X second(tuple t) asm "SECOND";
forall X -> X third(tuple t) asm "THIRD";
forall X -> X fourth(tuple t) asm "3 INDEX";
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";
forall X -> X null() asm "PUSHNULL";
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";

int now() asm "NOW";
slice my_address() asm "MYADDR";
[int, cell] get_balance() asm "BALANCE";
int cur_lt() asm "LTIME";
int block_lt() asm "BLOCKLT";

int cell_hash(cell c) asm "HASHCU";
int slice_hash(slice s) asm "HASHSU";
int string_hash(slice s) asm "SHA256U";

int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data() asm "c4 PUSH";
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y) asm "MIN";
int max(int x, int y) asm "MAX";
(int, int) minmax(int x, int y) asm "MINMAX";
int abs(int x) asm "ABS";

slice begin_parse(cell c) asm "CTOS";
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";
cell preload_ref(slice s) asm "PLDREF";
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";
slice first_bits(slice s, int len) asm "SDCUTFIRST";
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";
slice slice_last(slice s, int len) asm "SDCUTLAST";
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";
cell preload_dict(slice s) asm "PLDDICT";
slice skip_dict(slice s) asm "SKIPDICT";

(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";
cell preload_maybe_ref(slice s) asm "PLDOPTREF";
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";

int cell_depth(cell c) asm "CDEPTH";

int slice_refs(slice s) asm "SREFS";
int slice_bits(slice s) asm "SBITS";
(int, int) slice_bits_refs(slice s) asm "SBITREFS";
int slice_empty?(slice s) asm "SEMPTY";
int slice_data_empty?(slice s) asm "SDEMPTY";
int slice_refs_empty?(slice s) asm "SREMPTY";
int slice_depth(slice s) asm "SDEPTH";

int builder_refs(builder b) asm "BREFS";
int builder_bits(builder b) asm "BBITS";
int builder_depth(builder b) asm "BDEPTH";

builder begin_cell() asm "NEWC";
cell end_cell(builder b) asm "ENDC";
builder store_ref(builder b, cell c) asm(c b) "STREF";
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s) asm "STSLICER";
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_dict(builder b, cell c) asm(c b) "STDICT";

(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";
tuple parse_addr(slice s) asm "PARSEMSGADDR";
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";
cell new_dict() asm "NEWDICT";
int dict_empty?(cell c) asm "DICTEMPTY";

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x) asm "CONFIGOPTPARAM";
int cell_null?(cell c) asm "ISNULL";

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

int random() impure asm "RANDU256";
int rand(int range) impure asm "RAND";
int get_seed() impure asm "RANDSEED";
int set_seed() impure asm "SETRAND";
() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

```

## 5b7a8516a9df1e8c9ffbeda43405223e3ba1696ee104465c5aa36b4a630a7e8c/imports/precompiled_gas_const.fc

```fc
const MIN_FINANCIAL_STORAGE_DURATION = 1 * 365 * 24 * 3600; ;; 1 year
const MIN_JETTON_WALLET_STORAGE_DURATION = 5 * 365 * 24 * 3600; ;; 5 years
const MIN_UNSTAKE_REQUEST_STORAGE_DURATION = 3 * 30 * 24 * 3600; ;; 3 mouth

;;# Precompiled constants
;;
;;All of the contents are result of contract emulation tests
;;

;;## Storage
;;
;;Get calculated in a separate test file [/tests/StateInit.spec.ts](StateInit.spec.ts)

;;- `JETTON_WALLET_BITS` [/tests/StateInit.spec.ts#L123](L123)
const JETTON_WALLET_BITS = 941;
;;- `JETTON_WALLET_CELLS`: [/tests/StateInit.spec.ts#L123](L123)
const JETTON_WALLET_CELLS = 3;

;; difference in JETTON_WALLET_BITS/JETTON_WALLET_INITSTATE_BITS is difference in
;; StateInit and AccountStorage (https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)
;; we count bits as if balances are max possible
;;- `JETTON_WALLET_INITSTATE_BITS` [/tests/StateInit.spec.ts#L126](L126)
const JETTON_WALLET_INITSTATE_BITS = 847;
;;- `JETTON_WALLET_INITSTATE_CELLS` [/tests/StateInit.spec.ts#L126](L126)
const JETTON_WALLET_INITSTATE_CELLS = 3;

;;- `UNSTAKE_REQUEST_MIN_BITS` [/tests/StateInit.spec.ts#L179](L179)
const UNSTAKE_REQUEST_MIN_BITS = 1295;
;;- `UNSTAKE_REQUEST_MIN_CELLS`: [/tests/StateInit.spec.ts#L179](L179)
const UNSTAKE_REQUEST_MIN_CELLS = 5;

;;- `FINANCIAL_BITS` [/tests/StateInit.spec.ts#L95](L95)
const FINANCIAL_BITS = 27293;
;;- `FINANCIAL_CELLS`: [/tests/StateInit.spec.ts#L95](L95)
const FINANCIAL_CELLS = 59;

;;## Gas
;;
;;Gas constants are calculated in the main test suite.
;;First the related transaction is found, and then it's
;;resulting gas consumption is printed to the console.

;;- `SEND_TRANSFER_GAS_CONSUMPTION` [/tests/JettonWallet.spec.ts#L462](L462)
const SEND_TRANSFER_GAS_CONSUMPTION = 9371;

;;- `RECEIVE_TRANSFER_GAS_CONSUMPTION` [/tests/JettonWallet.spec.ts#L471](L471)
const RECEIVE_TRANSFER_GAS_CONSUMPTION = 10185;

;;- `BURN_GAS_CONSUMPTION` [/tests/JettonWallet.spec.ts#L250](L250)
const BURN_GAS_CONSUMPTION    = 7865;

;;- `STAKE_GAS_CONSUMPTION` [/tests/Financial.spec.ts#L506](L506)
const STAKE_GAS_CONSUMPTION    = 11382;

;;- `BURN_NOTIFICATION_GAS_CONSUMPTION` [/tests/Financial.spec.ts#L1829](L1829)
const BURN_NOTIFICATION_GAS_CONSUMPTION    = 15479;

;;- `DEPLOY_UNSTAKE_REQUEST_GAS_CONSUMPTION` [/tests/Financial.spec.ts#L1830](L1830)
const DEPLOY_UNSTAKE_REQUEST_GAS_CONSUMPTION    = 4186;

;;- `UNSTAKE_GAS_CONSUMPTION` [/tests/Financial.spec.ts#L2240](L2240)
const UNSTAKE_GAS_CONSUMPTION    = 12116;

;;- `UNSTAKE_REQUEST_GAS_CONSUMPTION` [/tests/UnstakeRequest.spec.ts#L299](L299)
const UNSTAKE_REQUEST_GAS_CONSUMPTION    = 7734;

int calculate_jetton_wallet_min_storage_fee() inline {
    return get_storage_fee(BASECHAIN, MIN_JETTON_WALLET_STORAGE_DURATION, JETTON_WALLET_BITS, JETTON_WALLET_CELLS);
}

int calculate_financial_min_storage_fee() inline {
    return get_storage_fee(BASECHAIN, MIN_FINANCIAL_STORAGE_DURATION, FINANCIAL_BITS, FINANCIAL_CELLS);
}

int calculate_unstake_request_min_storage_fee(int forward_payload_cells, int forward_payload_bits) inline {
    return get_storage_fee(BASECHAIN, MIN_UNSTAKE_REQUEST_STORAGE_DURATION, UNSTAKE_REQUEST_MIN_BITS + forward_payload_bits, UNSTAKE_REQUEST_MIN_CELLS + forward_payload_cells);
}

int jetton_wallet_forward_init_state_overhead() inline {
    return get_simple_forward_fee(BASECHAIN, JETTON_WALLET_INITSTATE_BITS, JETTON_WALLET_INITSTATE_CELLS);
}
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
forall X -> tuple cons(X head, tuple tail) asm "CONS";

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list) asm(-> 1 0) "UNCONS";

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list) asm "CAR";

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list) asm "CDR";

;;; Creates tuple with zero elements.
tuple empty_tuple() asm "NIL";

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x) asm "SINGLE";

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t) asm "UNSINGLE";

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t) asm "FIRST";

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t) asm "SECOND";

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t) asm "THIRD";

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t) asm "3 INDEX";

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";


;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null() asm "PUSHNULL";

;;; Moves a variable [x] to the top of the stack
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";



;;; Returns the current Unix time as an Integer
int now() asm "NOW";

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address() asm "MYADDR";

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance() asm "BALANCE";

;;; Returns the logical time of the current transaction.
int cur_lt() asm "LTIME";

;;; Returns the starting logical time of the current block.
int block_lt() asm "BLOCKLT";

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c) asm "HASHCU";

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s) asm "HASHSU";

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s) asm "SHA256U";

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
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

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
cell get_data() asm "c4 PUSH";

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
int min(int x, int y) asm "MIN";

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y) asm "MAX";

;;; Sorts two integers.
(int, int) minmax(int x, int y) asm "MINMAX";

;;; Computes the absolute value of an integer [x].
int abs(int x) asm "ABS";

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
slice begin_parse(cell c) asm "CTOS";

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s) asm(-> 1 0) "LDREF";

;;; Preloads the first reference from the slice.
cell preload_ref(slice s) asm "PLDREF";

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
(slice, int) load_grams(slice s) asm(-> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm(-> 1 0) "LDVARUINT16";

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len) asm "SDCUTFIRST";

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len) asm "SDCUTLAST";

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s) asm(-> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";
(slice, ()) ~skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm(-> 1 0) "LDOPTREF";

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s) asm "PLDOPTREF";


;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c) asm "CDEPTH";


{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s) asm "SREFS";

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s) asm "SBITS";

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s) asm "SBITREFS";

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).
int slice_empty?(slice s) asm "SEMPTY";

;;; Checks whether `slice` [s] has no bits of data.
int slice_data_empty?(slice s) asm "SDEMPTY";

;;; Checks whether `slice` [s] has no references.
int slice_refs_empty?(slice s) asm "SREMPTY";

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s) asm "SDEPTH";

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b) asm "BREFS";

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b) asm "BBITS";

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b) asm "BDEPTH";

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell() asm "NEWC";

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b) asm "ENDC";

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c) asm(c b) "STREF";

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";


;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s) asm "STSLICER";

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_coins(builder b, int x) asm "STVARUINT16";

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c) asm(c b) "STDICT";

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";


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
(slice, slice) load_msg_addr(slice s) asm(-> 1 0) "LDMSGADDR";

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s) asm "PARSEMSGADDR";

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

{-
  # Dictionary primitives
-}


;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";

cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict() asm "NEWDICT";
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.
int dict_empty?(cell c) asm "DICTEMPTY";


{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x) asm "CONFIGOPTPARAM";
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.
int cell_null?(cell c) asm "ISNULL";

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
int random() impure asm "RANDU256";
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
int rand(int range) impure asm "RAND";
;;; Returns the current random seed as an unsigned 256-bit Integer.
int get_seed() impure asm "RANDSEED";
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slices(slice a, slice b) asm "SDEQ";
;;; Checks whether b is a null. Note, that FunC also has polymorphic null? built-in.
int builder_null?(builder b) asm "ISNULL";
;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";

;; CUSTOM:

;; TVM UPGRADE 2023-07 https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07
;; In mainnet since 20 Dec 2023 https://t.me/tonblockchain/226

;;; Retrieves code of smart-contract from c7
cell my_code() asm "MYCODE";

;;; Creates an output action and returns a fee for creating a message. Mode has the same effect as in the case of SENDRAWMSG
int send_message(cell msg, int mode) impure asm "SENDMSG";

int gas_consumed() asm "GASCONSUMED";

;; TVM V6 https://github.com/ton-blockchain/ton/blob/testnet/doc/GlobalVersions.md#version-6

int get_compute_fee(int workchain, int gas_used) asm(gas_used workchain) "GETGASFEE";
int get_storage_fee(int workchain, int seconds, int bits, int cells) asm(cells bits seconds workchain) "GETSTORAGEFEE";
int get_forward_fee(int workchain, int bits, int cells) asm(cells bits workchain) "GETFORWARDFEE";
int get_precompiled_gas_consumption() asm "GETPRECOMPILEDGAS";

int get_simple_compute_fee(int workchain, int gas_used) asm(gas_used workchain) "GETGASFEESIMPLE";
int get_simple_forward_fee(int workchain, int bits, int cells) asm(cells bits workchain) "GETFORWARDFEESIMPLE";
int get_original_fwd_fee(int workchain, int fwd_fee) asm(fwd_fee workchain) "GETORIGINALFWDFEE";
int my_storage_due() asm "DUEPAYMENT";

tuple get_fee_cofigs() asm "UNPACKEDCONFIGTUPLE";

;; BASIC

const int TRUE = -1;
const int FALSE = 0;

const int MASTERCHAIN = -1;
const int BASECHAIN = 0;

;;; skip (Maybe ^Cell) from `slice` [s].
(slice, ()) ~skip_maybe_ref(slice s) asm "SKIPOPTREF";

(slice, int) ~load_bool(slice s) inline {
    return s.load_int(1);
}

builder store_bool(builder b, int value) inline {
    return b.store_int(value, 1);
}

;; ADDRESS NONE
;; addr_none$00 = MsgAddressExt; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L100

builder store_address_none(builder b) inline {
    return b.store_uint(0, 2);
}

slice address_none() asm "<b 0 2 u, b> <s PUSHSLICE";

int is_address_none(slice s) inline {
    return s.preload_uint(2) == 0;
}

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

const int FLAGS::BOUNCEABLE = 0x18; ;; 0b011000 tag - 0, ihr_disabled - 1, bounce - 1, bounced - 0, src = adr_none$00
const int FLAGS::NON_BOUNCEABLE = 0x10; ;; 0b010000 tag - 0, ihr_disabled - 1, bounce - 0, bounced - 0, src = adr_none$00

;; store msg_flags and address none
builder store_msg_flags_and_address_none(builder b, int msg_flags) inline {
    return b.store_uint(msg_flags, 6);
}

;; load msg_flags only
(slice, int) ~load_msg_flags(slice s) inline {
    return s.load_uint(4);
}
;;; @param `msg_flags` - 4-bit
int is_bounced(int msg_flags) inline {
    return msg_flags & 1 == 1;
}

(slice, ()) ~skip_bounced_prefix(slice s) inline {
    return (s.skip_bits(32), ()); ;; skip 0xFFFFFFFF prefix
}

;; after `grams:Grams` we have (1 + 4 + 4 + 64 + 32) zeroes - zeroed extracurrency, ihr_fee, fwd_fee, created_lt and created_at
const int MSG_INFO_REST_BITS = 1 + 4 + 4 + 64 + 32;

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

const int MSG_WITH_STATE_INIT_AND_BODY_SIZE = MSG_INFO_REST_BITS + 1 + 1 + 1;
const int MSG_HAVE_STATE_INIT = 4;
const int MSG_STATE_INIT_IN_REF = 2;
const int MSG_BODY_IN_REF = 1;

;; if no StateInit:
;; 0b0 for `Maybe (Either StateInit ^StateInit)` and 0b1 or 0b0 for `body:(Either X ^X)`

const int MSG_ONLY_BODY_SIZE = MSG_INFO_REST_BITS + 1 + 1;

builder store_stateinit_ref_and_body_ref(builder b, cell state_init, cell body) inline {
    return b
    .store_uint(MSG_HAVE_STATE_INIT + MSG_STATE_INIT_IN_REF + MSG_BODY_IN_REF, MSG_WITH_STATE_INIT_AND_BODY_SIZE)
    .store_ref(state_init)
    .store_ref(body);
}

builder store_only_body_ref(builder b, cell body) inline {
    return b
    .store_uint(MSG_BODY_IN_REF, MSG_ONLY_BODY_SIZE)
    .store_ref(body);
}

builder store_prefix_only_body(builder b) inline {
    return b
    .store_uint(0, MSG_ONLY_BODY_SIZE);
}

;; parse after sender_address
(slice, int) ~retrieve_fwd_fee(slice in_msg_full_slice) inline {
    in_msg_full_slice~load_msg_addr(); ;; skip dst
    in_msg_full_slice~load_coins(); ;; skip value
    in_msg_full_slice~skip_dict(); ;; skip extracurrency collection
    in_msg_full_slice~load_coins(); ;; skip ihr_fee
    int fwd_fee = in_msg_full_slice~load_coins();
    return (in_msg_full_slice, fwd_fee);
}

;; MSG BODY

;; According to the guideline, it is recommended to start the body of the internal message with uint32 op and uint64 query_id

const int MSG_OP_SIZE = 32;
const int MSG_QUERY_ID_SIZE = 64;

(slice, int) ~load_op(slice s) inline {
    return s.load_uint(MSG_OP_SIZE);
}
(slice, ()) ~skip_op(slice s) inline {
    return (s.skip_bits(MSG_OP_SIZE), ());
}
builder store_op(builder b, int op) inline {
    return b.store_uint(op, MSG_OP_SIZE);
}

(slice, int) ~load_query_id(slice s) inline {
    return s.load_uint(MSG_QUERY_ID_SIZE);
}
(slice, ()) ~skip_query_id(slice s) inline {
    return (s.skip_bits(MSG_QUERY_ID_SIZE), ());
}
builder store_query_id(builder b, int query_id) inline {
    return b.store_uint(query_id, MSG_QUERY_ID_SIZE);
}

(slice, (int, int)) ~load_op_and_query_id(slice s) inline {
    int op = s~load_op();
    int query_id = s~load_query_id();
    return (s, (op, query_id));
}

;; SEND MODES - https://docs.ton.org/tvm.pdf page 137, SENDRAWMSG

;; For `send_raw_message` and `send_message`:

;;; x = 0 is used for ordinary messages; the gas fees are deducted from the senging amount; action phaes should NOT be ignored.
const int SEND_MODE::REGULAR = 0;
;;; +1 means that the sender wants to pay transfer fees separately.
const int SEND_MODE::PAY_FEES_SEPARATELY = 1;
;;; + 2 means that any errors arising while processing this message during the action phase should be ignored.
const int SEND_MODE::IGNORE_ERRORS = 2;
;;; + 32 means that the current account must be destroyed if its resulting balance is zero.
const int SEND_MODE::DESTROY = 32;
;;; x = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message.
const int SEND_MODE::CARRY_ALL_REMAINING_MESSAGE_VALUE = 64;
;;; x = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message).
const int SEND_MODE::CARRY_ALL_BALANCE = 128;
;;; in the case of action fail - bounce transaction. No effect if SEND_MODE_IGNORE_ERRORS (+2) is used. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int SEND_MODE::BOUNCE_ON_ACTION_FAIL = 16;

;; Only for `send_message`:

;;; do not create an action, only estimate fee. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int SEND_MODE::ESTIMATE_FEE_ONLY = 1024;

;; Other modes affect the fee calculation as follows:
;; +64 substitutes the entire balance of the incoming message as an outcoming value (slightly inaccurate, gas expenses that cannot be estimated before the computation is completed are not taken into account).
;; +128 substitutes the value of the entire balance of the contract before the start of the computation phase (slightly inaccurate, since gas expenses that cannot be estimated before the completion of the computation phase are not taken into account).

;; RESERVE MODES - https://docs.ton.org/tvm.pdf page 137, RAWRESERVE

;;; Creates an output action which would reserve exactly x nanograms (if y = 0).
const int RESERVE_MODE::REGULAR = 0;
;;; Creates an output action which would reserve at most x nanograms (if y = 2).
;;; Bit +2 in y means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved.
const int RESERVE_MODE::AT_MOST = 2;

const int RESERVE_MODE::INCREASE_BY_BALANCE_BEFORE_COMPUTE = 4;
;;; in the case of action fail - bounce transaction. No effect if RESERVE_AT_MOST (+2) is used. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int RESERVE_MODE::BOUNCE_ON_ACTION_FAIL = 16;

;; General errors

const int ERROR::UNKNOWN_OP = 0xffff;

(slice, ()) ~skip_ref(slice s) asm "LDREF NIP";


;; =============== chains utils =============================

;; errors
const int ERROR::NOT_BASECHAIN = 333;
const int ERROR::NOT_MASTERCHAIN = 334;


;; function utils
(int, int) force_chain(slice addr) impure {
    (int wc, int addr) = parse_std_addr(addr);
    throw_unless(ERROR::NOT_BASECHAIN, wc == BASECHAIN);
    return (wc, addr);
}

;; TOKEN METADATA
;; https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md

;; Key is sha256 hash of string. Value is data encoded as described in "Data serialization" paragraph.
;; Snake format - must be prefixed with 0x00 byte
(cell, ()) ~set_token_snake_metadata_entry(cell content_dict, int key, slice value) impure {
    content_dict~udict_set_ref(256, key, begin_cell().store_uint(0, 8).store_slice(value).end_cell());
    return (content_dict, ());
}

;; On-chain content layout The first byte is 0x00 and the rest is key/value dictionary.
cell create_token_onchain_metadata(cell content_dict) inline {
    return begin_cell().store_uint(0, 8).store_dict(content_dict).end_cell();
}

const int ERROR::NOT_ENOUGH_GAS = 48;
```

## 5b7a8516a9df1e8c9ffbeda43405223e3ba1696ee104465c5aa36b4a630a7e8c/imports/unstake_request_gas.fc

```fc
#include "precompiled_gas_const.fc";

() check_balance_is_enough_to_unstake(int balance, cell forward_payload) impure inline {
    int initial_gas = gas_consumed();
    var (cells, bits,_) = compute_data_size(forward_payload, 8192);
    int size_counting_gas = gas_consumed() - initial_gas;
    var fwd_fee = get_forward_fee(BASECHAIN, cells,bits);

    throw_unless(ERROR::NOT_ENOUGH_GAS,
        balance >
        ;; 2 messages: unstake_request->financial, financial->user
        2 * fwd_fee +
        get_compute_fee(BASECHAIN, UNSTAKE_REQUEST_GAS_CONSUMPTION + size_counting_gas) +
        get_compute_fee(BASECHAIN, UNSTAKE_GAS_CONSUMPTION) +
        calculate_financial_min_storage_fee()
    );
}
```

## 5b7a8516a9df1e8c9ffbeda43405223e3ba1696ee104465c5aa36b4a630a7e8c/imports/utils.fc

```fc
;; =============== general consts =============================

const ONE_TON = 1000000000; ;; 1 TON

;; errors
const ERROR::INSUFFICIENT_BALANCE = 103;

const ERROR::NOT_BOUNCEABLE_OP = 200;

const ERROR::INSUFFICIENT_MSG_VALUE = 709;


;; =============== send msg utils =============================

() send_msg(slice to_address, int amount, cell payload, int flags, int send_mode) impure inline {
  int has_payload = ~ cell_null?(payload);

  var msg = begin_cell()
          .store_msg_flags_and_address_none(flags)
          .store_slice(to_address)
          .store_coins(amount)
          .store_uint(has_payload ? MSG_BODY_IN_REF : 0, MSG_ONLY_BODY_SIZE);

  if (has_payload) {
    msg = msg.store_ref(payload);
  }

  send_raw_message(msg.end_cell(), send_mode);
}


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
const OP::DEPLOY_UNSTAKE_REQUEST = 0x10a1ce75;
const OP::RETURN_UNSTAKE_REQUEST = 0x38633538;

;; financial ops
const FIN_OP::UNSTAKE = 0x492ab1b3;

;; errors
const ERROR::NOT_ALLOWED = 50;
const ERROR::UNLOCK_TIMESTAMP_HAS_NOT_EXPIRED_YET = 51;

;; global
global int index;
global slice financial_address;
global slice owner_address;
global int ton_amount;
global int jetton_amount;
global cell forward_payload;
global int unlock_timestamp;


;; =============== storage =============================

() load_data() impure {
    slice ds = get_data().begin_parse();
    index = ds~load_uint(64);
    financial_address = ds~load_msg_addr();
    owner_address = ds~load_msg_addr();
    ton_amount = ds~load_coins();
    jetton_amount = ds~load_coins();
    forward_payload = ds~load_maybe_ref();
    unlock_timestamp = ds~load_uint(32);
    ds.end_parse();
}

() save_data() impure {
    set_data(begin_cell()
            .store_uint(index, 64)
            .store_slice(financial_address)
            .store_slice(owner_address)
            .store_coins(ton_amount)
            .store_coins(jetton_amount)
            .store_maybe_ref(forward_payload)
            .store_uint(unlock_timestamp, 32)
            .end_cell()
    );
}


;; =============== recv =============================

() unstake(int my_balance, int external?) impure {
    throw_unless(ERROR::NOT_ALLOWED, unlock_timestamp != 0);
    throw_unless(ERROR::UNLOCK_TIMESTAMP_HAS_NOT_EXPIRED_YET, unlock_timestamp <= now());

    if (external?) {
        accept_message();
    }

    var payload = begin_cell()
            .store_op(FIN_OP::UNSTAKE)
            .store_uint(index, 64)
            .store_slice(owner_address)
            .store_coins(ton_amount)
            .store_coins(jetton_amount)
            .store_maybe_ref(forward_payload)
            .end_cell();

    check_balance_is_enough_to_unstake(my_balance, forward_payload);

    unlock_timestamp = 0;

    send_msg(financial_address, 0, payload, FLAGS::NON_BOUNCEABLE, SEND_MODE::CARRY_ALL_BALANCE + SEND_MODE::IGNORE_ERRORS);
}


;; =============== recv =============================

() recv_external(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    load_data();
    unstake(my_balance, true);
    save_data();
    return ();
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    slice in_msg_full_slice = in_msg_full.begin_parse();
    int msg_flags = in_msg_full_slice~load_msg_flags();

    if (msg_flags & 1) { ;; ignore all bounced messages
        return ();
    }

    slice sender_address = in_msg_full_slice~load_msg_addr();

    load_data();

    if (equal_slices(financial_address, sender_address)){
        int op = in_msg_body~load_op();
        throw_unless(ERROR::UNKNOWN_OP, (op == OP::DEPLOY_UNSTAKE_REQUEST) | (op == OP::RETURN_UNSTAKE_REQUEST));
        if (op == OP::DEPLOY_UNSTAKE_REQUEST) {
            owner_address = in_msg_body~load_msg_addr();
            ton_amount = in_msg_body~load_coins();
            jetton_amount = in_msg_body~load_coins();
            forward_payload = in_msg_body~load_maybe_ref();
        }
        unlock_timestamp = in_msg_body~load_uint(32);
    } else {
        unstake(my_balance, false);
    }

    save_data();
    return ();
}

;; =============== getters =============================

(_) get_unstake_data() method_id {
    load_data();

    return (
            index,
            financial_address,
            owner_address,
            ton_amount,
            jetton_amount,
            unlock_timestamp,
            forward_payload
    );
}

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
(int) equal_slices (slice s1, slice s2) asm "SDEQ";

() recv_internal(cell in_msg_cell, slice in_msg) {
  
  ;; Parse message
  var cs = in_msg_cell.begin_parse();
  var flags = cs~load_uint(4);  ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
  slice s_addr = cs~load_msg_addr();

  ;; Parse data
  var ds = get_data().begin_parse();
  slice address_0 = ds~load_msg_addr();
  slice address_1 = ds~load_msg_addr();
  ds~skip_bits(64);
  ds.end_parse();

  ;; Resolve addresses address
  slice src = null();
  slice dst = null();
  if (equal_slices(s_addr, address_0)) {
        src = address_0;
        dst = address_1;
  } elseif (equal_slices(s_addr, address_1)) {
        src = address_1;
        dst = address_0;
  }

  ;; Bounce while keeping storage fee on unknown
  ;; Useful fro deploy
  if (null?(src)) {
      raw_reserve(1000000000, 2);
      var msg = begin_cell()
        .store_uint(0x10, 6)
        .store_slice(s_addr)
        .store_grams(0)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
      .end_cell();
      send_raw_message(msg, 128);
      return ();
  }

  ;; Process messages
  raw_reserve(1000000000, 2);
  var msg = begin_cell()
    .store_uint(flags, 4)
    .store_uint(0, 2)
    .store_slice(dst)
    .store_grams(0)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1);

  ;; Content
  if(msg.builder_bits() + 1 + in_msg.slice_bits() > 1023) {
    msg = msg.store_uint(1,1)
             .store_ref(begin_cell().store_slice(in_msg).end_cell());
  } else {
    msg = msg.store_uint(0,1)
             .store_slice(in_msg);
  }

  ;; Send message
  send_raw_message(msg.end_cell(), 128);
}

() recv_external(slice in_msg) impure {
    ;; Do not accept external messages
    throw(72);
}
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
forall X -> tuple cons(X head, tuple tail) asm "CONS";

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list) asm "CAR";

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list) asm "CDR";

;;; Creates tuple with zero elements.
tuple empty_tuple() asm "NIL";

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x) asm "SINGLE";

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t) asm "UNSINGLE";

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t) asm "FIRST";

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t) asm "SECOND";

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t) asm "THIRD";

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t) asm "3 INDEX";

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";


;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null() asm "PUSHNULL";

;;; Moves a variable [x] to the top of the stack
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";



;;; Returns the current Unix time as an Integer
int now() asm "NOW";

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address() asm "MYADDR";

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance() asm "BALANCE";

;;; Returns the logical time of the current transaction.
int cur_lt() asm "LTIME";

;;; Returns the starting logical time of the current block.
int block_lt() asm "BLOCKLT";

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c) asm "HASHCU";

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s) asm "HASHSU";

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s) asm "SHA256U";

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
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

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
cell get_data() asm "c4 PUSH";

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
int min(int x, int y) asm "MIN";

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y) asm "MAX";

;;; Sorts two integers.
(int, int) minmax(int x, int y) asm "MINMAX";

;;; Computes the absolute value of an integer [x].
int abs(int x) asm "ABS";

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
slice begin_parse(cell c) asm "CTOS";

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";

;;; Preloads the first reference from the slice.
cell preload_ref(slice s) asm "PLDREF";

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
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDGRAMS";

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len) asm "SDCUTFIRST";

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len) asm "SDCUTLAST";

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s) asm "PLDOPTREF";


;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c) asm "CDEPTH";


{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s) asm "SREFS";

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s) asm "SBITS";

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s) asm "SBITREFS";

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).
int slice_empty?(slice s) asm "SEMPTY";

;;; Checks whether `slice` [s] has no bits of data.
int slice_data_empty?(slice s) asm "SDEMPTY";

;;; Checks whether `slice` [s] has no references.
int slice_refs_empty?(slice s) asm "SREMPTY";

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s) asm "SDEPTH";

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b) asm "BREFS";

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b) asm "BBITS";

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b) asm "BDEPTH";

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell() asm "NEWC";

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b) asm "ENDC";

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c) asm(c b) "STREF";

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";


;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s) asm "STSLICER";

;;; Stores (serializes) an integer [x] in the range `0..2^120 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_coins(builder b, int x) asm "STGRAMS";

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c) asm(c b) "STDICT";

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";


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
(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s) asm "PARSEMSGADDR";

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

{-
  # Dictionary primitives
-}


;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";

cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict() asm "NEWDICT";
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.
int dict_empty?(cell c) asm "DICTEMPTY";


{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x) asm "CONFIGOPTPARAM";
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.
int cell_null?(cell c) asm "ISNULL";

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
int random() impure asm "RANDU256";
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
int rand(int range) impure asm "RAND";
;;; Returns the current random seed as an unsigned 256-bit Integer.
int get_seed() impure asm "RANDSEED";
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits (slice a, slice b) asm "SDEQ";

;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";

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
forall X -> tuple cons(X head, tuple tail) asm "CONS";

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list) asm "CAR";

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list) asm "CDR";

;;; Creates tuple with zero elements.
tuple empty_tuple() asm "NIL";

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x) asm "SINGLE";

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t) asm "UNSINGLE";

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t) asm "FIRST";

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t) asm "SECOND";

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t) asm "THIRD";

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t) asm "3 INDEX";

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";


;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null() asm "PUSHNULL";

;;; Moves a variable [x] to the top of the stack
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";



;;; Returns the current Unix time as an Integer
int now() asm "NOW";

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address() asm "MYADDR";

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance() asm "BALANCE";

;;; Returns the logical time of the current transaction.
int cur_lt() asm "LTIME";

;;; Returns the starting logical time of the current block.
int block_lt() asm "BLOCKLT";

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c) asm "HASHCU";

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s) asm "HASHSU";

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s) asm "SHA256U";

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
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

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
cell get_data() asm "c4 PUSH";

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
int min(int x, int y) asm "MIN";

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y) asm "MAX";

;;; Sorts two integers.
(int, int) minmax(int x, int y) asm "MINMAX";

;;; Computes the absolute value of an integer [x].
int abs(int x) asm "ABS";

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
slice begin_parse(cell c) asm "CTOS";

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";

;;; Preloads the first reference from the slice.
cell preload_ref(slice s) asm "PLDREF";

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
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDGRAMS";

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len) asm "SDCUTFIRST";

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len) asm "SDCUTLAST";

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s) asm "PLDOPTREF";


;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c) asm "CDEPTH";


{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s) asm "SREFS";

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s) asm "SBITS";

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s) asm "SBITREFS";

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).
int slice_empty?(slice s) asm "SEMPTY";

;;; Checks whether `slice` [s] has no bits of data.
int slice_data_empty?(slice s) asm "SDEMPTY";

;;; Checks whether `slice` [s] has no references.
int slice_refs_empty?(slice s) asm "SREMPTY";

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s) asm "SDEPTH";

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b) asm "BREFS";

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b) asm "BBITS";

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b) asm "BDEPTH";

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell() asm "NEWC";

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b) asm "ENDC";

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c) asm(c b) "STREF";

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";


;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s) asm "STSLICER";

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_coins(builder b, int x) asm "STGRAMS";

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c) asm(c b) "STDICT";

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";


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
(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s) asm "PARSEMSGADDR";

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

{-
  # Dictionary primitives
-}


;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";

cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict() asm "NEWDICT";
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.
int dict_empty?(cell c) asm "DICTEMPTY";


{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x) asm "CONFIGOPTPARAM";
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.
int cell_null?(cell c) asm "ISNULL";

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
int random() impure asm "RANDU256";
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
int rand(int range) impure asm "RAND";
;;; Returns the current random seed as an unsigned 256-bit Integer.
int get_seed() impure asm "RANDSEED";
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b) asm "SDEQ";
int equal_slices(slice a, slice b) asm "SDEQ";

;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";
```

## 61689f0431f0bead3490202a24110f59f58ac3c23f5e4ad4168923eee237287a/welcome_rahul.fc

```fc
#include "imports/stdlib.fc"; ;; import the stdlib to have access to all standard functions

const op::increase = "op::increase"c; ;; create an opcode from string using the "c" prefix, this results in 0x7e8764ef opcode in this case

;; storage variables
global int ctx_id; ;; id is required to be able to create different instances of counters, because addresses in TON depend on the initial state of the contract
global int ctx_counter; ;; the counter itself

;; load_data populates storage variables using stored data (get_data())
() load_data() impure { ;; the impure modifier is needed because the compiler optimizes away any non-impure function the return value of which is not used
    var ds = get_data().begin_parse(); ;; begin_parse() converts cell to slice to read data from it

    ctx_id = ds~load_uint(32); ;; load id as 32 bit unsigned integer
    ctx_counter = ds~load_uint(32); ;; load counter as 32 bit unsigned integer

    ds.end_parse(); ;; end_parse() checks that the remaining slice is empty (if it isn't, it can indicate a mistake during serialization of data)
}

;; save_data stores storage variables as a cell into persistent storage
() save_data() impure {
    set_data( ;; set_data() stores a cell into persistent storage
        begin_cell() ;; begin_cell() returns a builder - a type to create cells
            .store_uint(ctx_id, 32) ;; this layout needs to be the same as the one used in load_data()
            .store_uint(ctx_counter, 32)
            .end_cell() ;; end_cell() converts a builder into a cell
    );
}

;; recv_internal is the main function of the contract and is called when it receives a message
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) { ;; ignore all empty messages
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4); ;; the first four bits of serialized message contain certain flags, one of which indicates whether the message is bounced
    ;; a message is bounced when a contract receives a bounceable message and throws during its processing
    ;; the bounced message is then returned to sender with `bounced` bit set, this is a way to handle errors in TON

    if (flags & 1) { ;; ignore all bounced messages
        return ();
    }

    load_data(); ;; here we populate the storage variables
    ;; in this case, it could also be done in the single op::increase handler, but generally you would want
    ;; to populate storage variables as soon as all preliminary checks which do not need storage pass

    int op = in_msg_body~load_uint(32); ;; by convention, the first 32 bits of incoming message is the op
    int query_id = in_msg_body~load_uint(64); ;; also by convention, the next 64 bits contain the "query id", although this is not always the case
    ;; some contracts do not use query_id at all and do not have it in their messages, but for this one we will be reading it, but not using it

    if (op == op::increase) { ;; handle op::increase
        int increase_by = in_msg_body~load_uint(32); ;; read by how much we want to increase the counter
        ctx_counter += increase_by; ;; increase the counter
        save_data(); ;; when we change storage variables, we need to store the changed variables, so we call save_data()
        return (); ;; this message is handled so we return
    }

    throw(0xffff); ;; if the message contains an op that is not known to this contract, we throw
    ;; if the message is bounceable, the contract will then bounce the message to the sender
    ;; and the sender will receive unspent coins and will know that this message failed
    ;; provided of course that the sender has code to handle bounced messages
}

;; get methods are a means to conveniently read contract data using, for example, HTTP APIs
;; they are marked with method_id
;; note that unlike in many other smart contract VMs, get methods cannot be called by other contracts
(int) get_counter() method_id {
    load_data(); ;; when a get method is called, storage variables are not populated, so we populate them first
    return ctx_counter; ;; then return the value
}

;; same deal as the previous get method, but this one returns the id of the counter
(int) get_id() method_id {
    load_data();
    return ctx_id;
}

```

## 642a362286ad1a309f37d10fbf0b4074c4b81bcfe3b2a7869a4f149f7678e656/config/exit-codes.fc

```fc
const int ext::wrong_addr = 1001;
const int ext::wrong_op = 1002;
const int ext::invalid_jwall = 1003;
const int ext::cliff = 1004;
const int ext::no_available = 1005;
```

## 642a362286ad1a309f37d10fbf0b4074c4b81bcfe3b2a7869a4f149f7678e656/config/op-codes.fc

```fc
const int op::transfer_notification = 0x7362d09c;
const int op::transfer = 0xf8a7ea5;
const int op::maintain = 2001;
const int op::set_data_code = 2002;
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
forall X -> tuple cons(X head, tuple tail) asm "CONS";

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list) asm "CAR";

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list) asm "CDR";

;;; Creates tuple with zero elements.
tuple empty_tuple() asm "NIL";

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x) asm "SINGLE";

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t) asm "UNSINGLE";

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t) asm "FIRST";

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t) asm "SECOND";

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t) asm "THIRD";

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t) asm "3 INDEX";

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";


;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null() asm "PUSHNULL";

;;; Moves a variable [x] to the top of the stack
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";



;;; Returns the current Unix time as an Integer
int now() asm "NOW";

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address() asm "MYADDR";

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance() asm "BALANCE";

;;; Returns the logical time of the current transaction.
int cur_lt() asm "LTIME";

;;; Returns the starting logical time of the current block.
int block_lt() asm "BLOCKLT";

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c) asm "HASHCU";

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s) asm "HASHSU";

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s) asm "SHA256U";

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
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

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
cell get_data() asm "c4 PUSH";

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
int min(int x, int y) asm "MIN";

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y) asm "MAX";

;;; Sorts two integers.
(int, int) minmax(int x, int y) asm "MINMAX";

;;; Computes the absolute value of an integer [x].
int abs(int x) asm "ABS";

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
slice begin_parse(cell c) asm "CTOS";

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";

;;; Preloads the first reference from the slice.
cell preload_ref(slice s) asm "PLDREF";

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
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDGRAMS";

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len) asm "SDCUTFIRST";

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len) asm "SDCUTLAST";

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s) asm "PLDOPTREF";


;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c) asm "CDEPTH";


{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s) asm "SREFS";

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s) asm "SBITS";

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s) asm "SBITREFS";

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).
int slice_empty?(slice s) asm "SEMPTY";

;;; Checks whether `slice` [s] has no bits of data.
int slice_data_empty?(slice s) asm "SDEMPTY";

;;; Checks whether `slice` [s] has no references.
int slice_refs_empty?(slice s) asm "SREMPTY";

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s) asm "SDEPTH";

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b) asm "BREFS";

;;; Returns the number of data bits already stored in `builder` [b].
